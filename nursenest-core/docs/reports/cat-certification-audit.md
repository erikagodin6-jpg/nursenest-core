# CAT Certification Audit

Date: 2026-06-01

Scope: source-code audit only. This report describes actual implemented behavior found in the CAT engines, API routes, persistence, and schema. It does not certify intended product behavior.

## Executive Verdict

NurseNest CAT is adaptive, but it is not a true NCLEX psychometric CAT.

The primary practice-test CAT engine maintains a persisted theta-like ability estimate, updates it after each scored item, adapts target difficulty, balances blueprint categories, and can stop NCLEX simulations using a 95% confidence interval against a passing threshold. However, the implementation uses a simplified hand-tuned model, not calibrated IRT/Rasch estimation. Item difficulty is a 1-5 integer stored on `exam_questions.difficulty`; no calibrated item difficulty parameter, discrimination parameter, guessing parameter, or operational item exposure model is stored or used.

NCLEX parity score: 58/100.

Reason: the implementation has the outer shape of NCLEX-style CAT (theta, adaptive selection, variable-length NCLEX bounds, blueprint balancing, CI stop), but it lacks the psychometric core required for full NCLEX parity: calibrated IRT item parameters, real standard-error computation from item information, official passing-standard logic, field-test/security controls, and robust exposure controls.

## Source Files Reviewed

- `src/lib/exams/cat-engine.ts`
- `src/lib/exams/cat-types.ts`
- `src/lib/exams/cat-config.ts`
- `src/lib/exams/exam-config.ts`
- `src/lib/exams/cat-adaptive-policy.ts`
- `src/lib/exams/cat-exam-simulation.ts`
- `src/lib/practice-tests/cat-session.ts`
- `src/lib/practice-tests/cat-pool.ts`
- `src/app/api/practice-tests/route.ts`
- `src/app/api/practice-tests/[id]/route.ts`
- `src/app/api/practice-tests/[id]/question/route.ts`
- `src/app/api/cat/np/session/route.ts`
- `src/app/api/cat/np/answer/route.ts`
- `src/lib/cat/cat-engine.ts`
- `src/lib/cat/session-persistence.ts`
- `src/lib/cat/types.ts`
- `prisma/schema.prisma`
- Relevant migrations for `exam_questions`, `practice_tests`, and `adaptive_state`

## Architecture Diagram

```text
Learner CAT launch
  |
  | POST /api/practice-tests
  v
createCatPracticeTestPayload()
  |
  | fetchCatPracticePoolCached()
  |   -> fetchCatPracticePool()
  |      -> exam_questions metadata rows
  |      -> filters: entitlement, pathway, published/complete, non-ECG, scope
  |
  | createInitialAdaptiveState()
  |   -> theta = 0
  |   -> targetDifficulty = 3
  |   -> se = 1.25
  |   -> results/history empty
  |
  | selectNextQuestion()
  |   -> no repeats in session
  |   -> difficulty distance to target
  |   -> blueprint category balance
  |   -> weak-area/high-yield boosts in practice mode
  |   -> session-seeded jitter
  |
  v
practice_tests row
  - questionIds
  - config
  - adaptiveState

Learner answers item
  |
  | PATCH /api/practice-tests/[id] action=cat_advance
  v
advanceCatPracticeTest()
  |
  | scoreOne()
  |   -> answerMatches()
  |   -> reads exam_questions.difficulty and blueprint fields
  |
  | appendScoredResult()
  |   -> update theta by capped correct/incorrect step
  |   -> update targetDifficulty
  |   -> update se with formula based on sqrt(n)
  |   -> append result and difficulty history
  |
  | shouldStopAfterAnswer()
  |   -> max length
  |   -> fixed-length NP mode
  |   -> NCLEX exam-simulation 95% CI vs threshold
  |   -> adaptive practice streak/theta/SE heuristics
  |
  | if not stopped: selectNextQuestion()
  v
practice_tests updated
  - answers
  - cursorIndex
  - questionIds
  - adaptiveState

Separate legacy/specialized NP CAT API
  |
  | /api/cat/np/session and /api/cat/np/answer
  v
src/lib/cat/cat-engine.ts
  - abilityEstimate, not theta
  - simplified fixed correct/incorrect ability steps
  - risk/layer floors and weakness boosts
```

## Implemented Algorithm

### Primary practice-test CAT engine

The main learner CAT flow is the practice-test CAT engine. It is created from `POST /api/practice-tests`, which calls `createCatPracticeTestPayload()` and persists the returned `adaptiveState` into `practice_tests.adaptiveState`. The state shape is defined in `src/lib/exams/cat-types.ts` and includes `theta`, `targetDifficulty`, `se`, `totalInformation`, `results`, `difficultyHistory`, `thetaHistory`, `stoppedReason`, `decision`, `passingThreshold`, and blueprint diagnostics.

Initial state is created in `src/lib/exams/cat-engine.ts`:

- `theta = CAT_START_THETA`, currently `0`.
- `targetDifficulty = CAT_START_TARGET_DIFFICULTY`, currently `3`.
- `se = 1.25`.
- `totalInformation = 0`.
- No results or history.

After each answer, `advanceCatPracticeTest()` loads the current question, scores it with `answerMatches()`, and calls `appendScoredResult()`. `scoreOne()` stores only `questionId`, `correct`, `categoryKey`, `difficulty`, and `blueprintMappingSource`. It does not populate item discrimination or item information. `appendScoredResult()` updates theta with a capped fixed step based on correct/incorrect response and phase:

- Calibration phase: first 10 scored items.
- Stabilization phase: items 10-25.
- Precision phase: item 26 onward.
- Correct answers nudge theta up.
- Incorrect answers nudge theta down.
- The step is adjusted slightly by distance of item difficulty from the center.
- Theta is clamped to `[-3, 3]`.

The same function updates `targetDifficulty` by moving up/down on a 1-5 scale and updates `se` using `2.12 / sqrt(n)` or `2.32 / sqrt(n)` near the cut score. `totalInformation` increments by `result.itemInformation` if present, otherwise a constant `0.25`. Because `scoreOne()` does not set `itemInformation`, active sessions use the fallback constant.

Next item selection uses `selectNextQuestion()` in `src/lib/exams/cat-engine.ts`. It filters out already-used IDs, then scores unused candidates by:

- Absolute distance from `targetDifficulty`.
- Blueprint balance term using expected category count from configured category weights when rows are mapped.
- Legacy delivered-count term when category weights are not usable.
- Same-category penalty.
- Optional weak-area/high-yield/category boosts for practice mode.
- Information-value approximation near the passing cutoff.
- Session-seeded jitter.

The lowest score wins. It then hash-picks among near-tied top candidates. If the selected item is outside a difficulty band of +/-1, it tries to select a close item; otherwise it returns the closest available item.

### Separate NP CAT engine

There is a second CAT implementation under `src/lib/cat`. It is used by `/api/cat/np/session` and `/api/cat/np/answer`. This engine does not use the primary `theta` state. It uses `abilityEstimate`, derived from historical weighted accuracy at session creation, then updated by fixed increments:

- Correct answer: `+0.25`.
- Incorrect answer: `-0.20`.
- Bounds: `[-3, 3]`.

The NP engine maps ability to difficulty with a tanh transform, then selects questions using difficulty proximity, weak-system/risk/layer boosts, risk and cognitive-layer floors, topic diversity, population tag boost, cognitive-load penalty, and deterministic noise.

This split matters: NurseNest has more than one implemented CAT path. The primary practice-test engine is closer to NCLEX-style CAT; the NP-specific endpoint is a simpler adaptive readiness engine.

## Answers To Certification Questions

### 1. Does CAT maintain a candidate ability estimate (theta)?

Yes, in the primary practice-test CAT engine.

`CatAdaptiveState` includes `theta` and persists it in `PracticeTest.adaptiveState`. `createInitialAdaptiveState()` initializes `theta` to `0`. `parseAdaptiveState()` reloads it from persisted JSON.

The separate NP CAT engine does not call it theta. It maintains `abilityEstimate` in `CatSessionState`.

### 2. Is theta updated after every question?

Yes, for the primary practice-test CAT path when an answer is scored through `advanceCatPracticeTest()`.

`advanceCatPracticeTest()` calls `scoreOne()` and then `appendScoredResult()`. `appendScoredResult()` updates theta on every scored result.

Important limitation: the update is not a psychometric theta re-estimation. It is a capped correct/incorrect step adjustment.

### 3. How is question difficulty stored?

For the main question bank, difficulty is stored as `exam_questions.difficulty`, mapped by Prisma as `ExamQuestion.difficulty Int? @default(3)`.

At runtime:

- Pool rows select `difficulty`.
- Null or invalid values fall back to `3`.
- Values are rounded and clamped to the 1-5 scale by `clampDifficulty()`.

There is no stored calibrated IRT b-parameter. The difficulty field is a coarse 1-5 integer.

### 4. How is the next question selected?

Primary practice-test CAT:

1. Build a metadata-only candidate pool from `exam_questions`.
2. Remove used question IDs.
3. Compute a score for each unused row:
   - difficulty distance from current `targetDifficulty`
   - blueprint deficit or fallback category balance
   - same-category penalty
   - weak-area/high-yield boosts in practice mode
   - approximate information boost near passing cutoff
   - session-seeded jitter
4. Sort by lowest score.
5. Hash-pick among near ties.
6. Prefer an item within +/-1 difficulty band when possible.

Legacy NP CAT:

1. Remove answered/recently seen IDs.
2. Compute target difficulty from `abilityEstimate`.
3. Score candidates by ability match, weakness boosts, floor urgency, topic diversity, population tag, cognitive-load penalty, and deterministic noise.
4. Pick the highest score.

### 5. Is IRT used?

No, not in the operational psychometric sense.

The code contains IRT-like language and lightweight fields for `discrimination` and `itemInformation`, but active scoring does not estimate theta from item response functions and calibrated item parameters. `scoreOne()` does not set discrimination or item information. `appendScoredResult()` therefore uses a fixed fallback information contribution of `0.25`.

The theta update is a hand-tuned correct/incorrect step function, not maximum-likelihood, EAP, MAP, or Bayesian IRT estimation.

### 6. Is Rasch used?

No.

The implementation does not apply a Rasch probability model `P(correct | theta, b)` for scoring or theta updates. There is no calibrated Rasch item difficulty parameter beyond the 1-5 content difficulty field, and the update rule is not Rasch estimation.

The older NP engine comment says "1PL Bayesian-simplified", but the actual code adds fixed increments of `+0.25` or `-0.20`; it does not compute a Rasch likelihood.

### 7. Is a simplified adaptive model used?

Yes.

The actual model is simplified adaptive testing:

- Theta-like ability estimate.
- 1-5 target difficulty.
- Fixed step updates.
- Approximate standard error shrinkage based on answered count.
- Blueprint balancing.
- Weak-area/high-yield boosts in practice mode.
- Recent-question and in-session no-repeat filtering.

It is adaptive and useful for learning, but it is not a fully calibrated CAT engine.

### 8. What determines exam termination?

Primary practice-test CAT termination is handled by `shouldStopAfterAnswer()`:

- Always stop when answered count reaches configured `max`.
- For `fixed_full_length`, do not stop early; finish at max only.
- For `adaptive_exam_ci`, after configured minimum, stop when the 95% confidence interval is fully above or below the passing threshold:
  - pass if `theta - 1.96 * se > passingThreshold`
  - fail if `theta + 1.96 * se < passingThreshold`
- For `adaptive_practice`, stop after:
  - five consecutive correct answers or five consecutive wrong answers after at least 8 questions
  - or after minimum confidence count when `se <= CAT_EARLY_STOP_SE` and theta is above/below threshold plus margin
  - or max length

The separate NP CAT engine terminates on:

- max questions
- pool exhaustion
- a stability heuristic after at least 20 questions when recent answer-derived ability is within `0.1` of current `abilityEstimate`

### 9. What determines pass/fail?

Primary practice-test CAT:

- Early CI stop sets decision to `pass` or `fail` for `confidence_pass` / `confidence_fail`.
- Otherwise, `finalizeThetaDecision()` compares final theta with `passingThreshold +/- finalBand`.
- The default final band is based on `CAT_FINAL_PASS_THETA` and `CAT_FINAL_FAIL_THETA`, currently `+/-0.12`.
- `buildCatReport()` maps decision to `PASS`, `FAIL`, or `BORDERLINE`.

This is a NurseNest readiness classification, not an official NCLEX pass/fail decision.

The separate NP CAT engine completes with readiness analysis and readiness score, not the same pass/fail report model.

### 10. How closely does the engine match NCLEX CAT?

It matches NCLEX CAT structurally but not psychometrically.

Matches:

- Maintains theta-like ability state.
- Updates after each answer.
- Selects next items adaptively.
- Uses variable-length NCLEX-style bounds for NCLEX RN/PN simulation: 85-145.
- Uses blueprint category weights for mapped NCLEX client-needs categories.
- Uses a confidence interval stopping rule in NCLEX exam-simulation mode.

Does not match:

- No calibrated IRT/Rasch item bank.
- No operational item parameters such as b, a, c, or calibrated item information.
- No theta re-estimation from likelihood across all responses.
- SE is not derived from accumulated calibrated item information.
- Difficulty is coarse 1-5 metadata, not calibrated psychometric difficulty.
- Blueprint balancing uses four top-level client-needs categories, not full operational NCLEX blueprint depth.
- No explicit field-test item logic.
- No hard item exposure-rate control across the population.
- No official NCLEX passing standard calibration.
- Manual completion can finalize CAT sessions in some flows.

## Detailed Findings

### Ability Estimation

Primary practice-test engine:

- `CatAdaptiveState.theta` exists and is persisted.
- `thetaHistory` keeps recent theta values.
- `appendScoredResult()` updates theta after each scored item.
- Update formula is phase-based and hand tuned:
  - calibration: `0.12`
  - stabilization: `0.095`
  - precision: `0.078`
  - multiplied by correct/incorrect sign
  - slightly reduced for item difficulty distance from center
  - capped by phase

This is an ability proxy, not a calibrated psychometric estimator.

Legacy NP engine:

- `CatSessionState.abilityEstimate` exists.
- Starting value comes from historical weighted accuracy through a logit transform.
- Each answer adds `+0.25` or `-0.20`.

### Standard Error / Confidence Interval

Primary practice-test engine:

- `se` is persisted in `adaptiveState`.
- Initial `se` is `1.25`.
- After each answer, `se` becomes `min(1.14, seShrink / sqrt(n))`.
- `seShrink` is `2.12`, or `2.32` near cut score after calibration.
- `totalInformation` is incremented, but active scoring does not provide real item information; the fallback is `0.25`.

The 95% CI rule is implemented, but the standard error feeding it is a count-based proxy, not calibrated psychometric precision.

### Question Difficulty / Item Calibration

Difficulty is stored as `ExamQuestion.difficulty Int? @default(3)` on `exam_questions`.

Runtime behavior:

- `null` difficulty becomes `3`.
- Difficulty is rounded and clamped to 1-5.
- Pool validation requires at least two difficulty levels.

Missing for full CAT parity:

- calibrated b-parameter
- discrimination a-parameter
- guessing c-parameter
- calibrated standard error / information curves
- empirical calibration workflow tied into selection/scoring

There are analytics files for question discrimination elsewhere in the repo, but the CAT scoring path does not consume a persisted item discrimination value.

### Blueprint Balancing

The practice-test engine supports blueprint balancing through `nclexClientNeedsCategory` and exam config weights. If a candidate row is mapped and weights exist, selection computes expected delivered count and boosts under-served categories.

Fallback behavior exists:

- If an item lacks NCLEX/AANP blueprint mapping, `blueprintKeyForPoolRow()` falls back to body system, topic, or `General`.
- Diagnostics track pool and session mapped fractions.
- Mapping quality warnings are non-blocking.

This is meaningful blueprint balancing, but it is only as strong as item tagging coverage and currently operates at high-level category granularity.

### Exposure Controls

Implemented controls:

- No repeats inside a session via `usedIds`.
- Recent practice question exclusion by pathway/session lookback, capped to recent IDs.
- Legacy NP API excludes recently answered IDs and tracks a 24-hour recently seen set.
- Session-seeded pool windowing and jitter reduce identical item order.

Missing controls:

- No global item exposure-rate targets.
- No max-exposure constraints per item.
- No randomized shadow-test assembly.
- No content security pool rotation based on item usage across the whole learner population.
- No field-test/pretest item handling.

### Stop Rules

NCLEX simulation mode uses NCLEX-like variable length and confidence interval logic, but with the simplified theta/SE proxy.

Practice mode uses shorter adaptive heuristics, including last-five streak termination, which is not NCLEX-like.

NP board simulation can be fixed-length and explicitly non-adaptive in item order when `catFixedItemOrder` is set.

### Pass / Fail Logic

The engine produces readiness labels and pass/fail/borderline classification from theta and confidence-stop outcomes. It is not an official NCLEX pass prediction. The report itself inserts copy warning that NCLEX-RN-style simulation is not an official NCLEX result or pass prediction.

## NCLEX Parity Score

Overall score: 58/100.

Breakdown:

| Area | Score | Evidence |
|---|---:|---|
| Candidate ability estimate | 80 | `theta` exists and persists in primary engine; NP path uses `abilityEstimate`. |
| Per-item ability update | 70 | Updated after scored items, but with fixed step heuristics. |
| Adaptive question selection | 70 | Difficulty matching, blueprint balance, weak boosts, no repeats, jitter. |
| IRT/Rasch psychometrics | 15 | No calibrated item parameters or likelihood-based theta estimation. |
| Difficulty model | 45 | 1-5 integer difficulty, not calibrated psychometric difficulty. |
| Standard error / CI | 55 | CI rule exists, but SE is count-based proxy. |
| Blueprint balancing | 65 | Uses configured weights when mapped; falls back to body system/topic. |
| Stopping rules | 65 | NCLEX simulation has min/max and CI stop; practice has non-NCLEX heuristics. |
| Pass/fail logic | 50 | Theta-threshold readiness classification, not official calibrated pass standard. |
| Exposure/security controls | 35 | In-session/recent exclusion only; no population exposure model. |

## Gaps Required For Full NCLEX Parity

1. Add item calibration fields to the bank:
   - calibrated difficulty `b`
   - discrimination `a`
   - optional guessing/slipping or format-specific parameters
   - calibration sample size and last-calibrated timestamp

2. Replace fixed theta updates with psychometric estimation:
   - Rasch/1PL or 2PL probability model
   - MAP/EAP/MLE theta update after each item
   - standard error from test information
   - all prior responses included in theta re-estimation

3. Compute item information from calibrated parameters:
   - remove constant fallback information as the normal path
   - select items maximizing information near current theta and passing standard

4. Strengthen blueprint model:
   - use full NCLEX client-needs subcategory coverage where applicable
   - enforce minimum/maximum content-category constraints
   - separate blueprint constraints from remediation/practice weak-area boosts in exam simulation

5. Implement operational exposure controls:
   - per-item exposure rates
   - maximum exposure thresholds
   - randomesque item selection among high-information candidates
   - pool rotation / quarantine for overexposed items

6. Add field-test/pretest support if claiming closer NCLEX simulation:
   - unscored item slots
   - explicit scoring exclusion
   - separate reporting

7. Calibrate pass/fail standard:
   - replace arbitrary theta bands with a defensible passing standard
   - store passing threshold by exam/pathway/version
   - version decisions with the item calibration version

8. Consolidate CAT engines:
   - keep one canonical engine for practice, NCLEX simulation, NP simulation, readiness, and analytics
   - retire or adapt the separate NP `/api/cat/np/*` engine so all CAT paths share the same state model and evidence trail

9. Make exam simulation stricter:
   - prevent manual completion from producing a normal pass/fail classification unless the session is terminal under CAT rules
   - ensure practice-only weak-area/high-yield boosts cannot affect exam-simulation item selection

10. Add certification tests:
   - theta monotonic sanity checks
   - item information selection checks
   - CI stopping boundary tests
   - blueprint min/max enforcement tests
   - exposure cap tests
   - replay determinism tests

## Bottom Line

NurseNest currently implements a simplified adaptive learning CAT and an NCLEX-shaped exam simulation. It is credible as a learner-facing adaptive readiness experience, but the source code does not support calling it a true NCLEX psychometric CAT yet.

The highest-value next step is not more content volume. It is psychometric calibration: item parameters, real theta estimation, real information-based SE, and exposure controls.
