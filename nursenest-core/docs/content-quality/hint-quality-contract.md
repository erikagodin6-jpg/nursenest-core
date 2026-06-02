# Hint Quality Contract

Date: 2026-06-01
Status: Hint quality enforcement standard

Source of truth: `docs/hint-quality-rubric.md` and `src/lib/questions/hint-quality-score.ts`.

Future content remains locked: `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, `adminOnly=true`.

## Purpose

Every hint must help the learner think better without revealing the answer. Hints must be clinically useful, pathway-specific, stem-connected, and safe for the learner's role.

## Scoring Rubric

| Score | Gate | Meaning | Publication Rule |
| ---: | --- | --- | --- |
| 1 | Hard fail | Reveals answer, names option, is missing, or encourages unsafe/outside-scope reasoning | Block publish |
| 2 | Review required | Generic, vague, or disconnected from the stem | Rewrite before publish |
| 3 | Foundational only | Adequate general guidance, but not enough for premium clinical content | Allowed only for foundational or admissions content |
| 4 | Publish eligible | Gives a useful decision framework without leakage | Publish eligible after normal review |
| 5 | Premium/flagship | Guides cue interpretation, priority, safety, scope, mechanism, or exam decision type with pathway specificity | Premium quality |

## Scored Dimensions

The scoring engine evaluates:

- Clinical cue direction
- Priority framework
- Mechanism prompt
- Scope or role prompt
- Safety or escalation prompt
- Exam decision-type prompt
- Answer leakage risk
- Stem relevance
- Pathway specificity

## Good Patterns

| Pattern | Example |
| --- | --- |
| Clinical cue direction | Identify which finding is new, abnormal, or changing before choosing the action. |
| Priority framework | Decide which cue creates the greatest immediate airway, breathing, circulation, or safety risk. |
| Mechanism prompt | Think about which action addresses the underlying pathophysiology. |
| Scope or role prompt | Ask whether the action requires nursing judgment or can be delegated safely. |
| Safety or escalation prompt | Consider which finding requires reporting or rapid escalation before routine care. |
| Exam decision type | Decide whether the item asks for first action, teaching, delegation, evaluation, or reassessment. |

## Rejected Patterns

| Rejected Pattern | Example | Failure |
| --- | --- | --- |
| Option disclosure | Review option B. | Answer option leakage |
| Answer wording leakage | The correct answer focuses on oxygen. | Gives away keyed concept |
| Generic advice | Think carefully. | No clinical reasoning support |
| Stem disconnect | Review the chapter. | Not connected to patient scenario |
| Unsafe scope | Consider whether the nurse should prescribe a higher dose. | Outside RN/RPN scope |
| ECG without framework | Think about safety. | Missing rate, rhythm, interval, or hemodynamic interpretation |
| Lab without trend/pattern | Remember the normal range. | Missing clinical pattern or trend framing |
| Medication math without units | Calculate carefully. | Missing unit setup and reasonableness check |
| Pharmacology without safety | Remember the drug class. | Missing monitoring, contraindication, adverse effect, or safety frame |

## Pathway-Specific Examples

| Pathway | Premium Hint Pattern |
| --- | --- |
| RN | Consider whether this is an acute change that should be assessed or escalated before routine teaching or documentation. |
| RPN / PN | Decide whether the finding is expected and predictable or requires reporting, monitoring, and reassessment. |
| NP | Consider which diagnosis, management step, referral, or follow-up plan is safest based on red flags. |
| Pre-Nursing | Think about the primary function or structure before choosing the answer. |
| Admissions | Set up the question carefully and eliminate choices that do not answer the exact prompt. |
| Allied Health | Consider the profession-specific workflow, safety risk, and scope of responsibility. |
| ECG | Use rate, regularity, P waves, PR interval, QRS width, and hemodynamic impact before naming the rhythm. |
| Labs | Decide whether the abnormal value is isolated or part of a dangerous pattern or trend. |
| Medication Math | Set up units first, convert carefully, and check whether the final dose is clinically reasonable. |
| Pharmacology | Consider contraindications, monitoring, adverse effects, and hold/report parameters before choosing. |
| Clinical Skills | Think about technique, safety, complications, documentation, and what finding would change the plan. |

## Publish Gate Rules

- Score 1: hard fail; block publish.
- Score 2: review required; rewrite before publish.
- Score 3: allowed only for foundational or admissions content.
- Score 4: publish eligible.
- Score 5: premium or flagship quality.
- Unsafe or answer-leaking hints are always blocked, regardless of total item quality.

## Reviewer Checklist

Before approval, reviewers must confirm:

- The hint does not reveal answer wording or option letters.
- The hint connects to the stem.
- The hint gives a reasoning frame, not a miniature rationale.
- The hint is appropriate for the learner's pathway and scope.
- The hint does not encourage unsafe delay, independent prescribing, or outside-scope action.
- ECG, lab, medication math, and pharmacology hints include the required specialty-specific reasoning frame.

