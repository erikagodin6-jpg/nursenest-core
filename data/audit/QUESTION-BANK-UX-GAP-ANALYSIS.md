# Question bank / test bank: legacy vs current UX (audit)

See also: [`RESTORATION-FINAL-REPORT.md`](./RESTORATION-FINAL-REPORT.md) (combined routes, scripts, audit files).

Generated as part of legacy restoration work. **Legacy reference:** `client/src/pages/question-bank.tsx` (monolith). **Current learner routes:** `/app/questions` (question bank + practice exam builder), `/app/practice-tests/*` (CAT-style runs and results).

## Legacy UX (old site)

| Feature | Notes |
|--------|--------|
| **Modes** | `study` (immediate feedback), `exam` (timed set, submit, then results), `learning` (guided / confidence-adjacent flow). |
| **Filters** | Tier, body system, exam family, difficulty, topic — client loaded a pool and re-filtered. |
| **Exam mode** | Configurable question count and timer; countdown; submit; **results** with breakdowns (e.g. by system and difficulty) and review list. |
| **Study mode** | Single-question flow with reveal and stats. |
| **Gating** | Tier access + freemium usage endpoints (`/api/qbank/*`). |

## Current app — already present

| Capability | Where |
|------------|--------|
| **Timed practice exams** with CAT-grade plumbing, weak areas, systems, tutor vs exam session mode, rationale timing | `QuestionBankPracticeSetupClient` → `POST /api/practice-tests` → `PracticeTestRunnerClient` + `/app/practice-tests/[id]/results`. |
| **Rich in-bank practice** | `QuestionBankPracticeClient`: pathway/topic/exam filters, difficulty band, incorrect-only, presets, exam-style shell vs tutor-style rationale timing, strike/highlight, notes, performance rollups, study loop links. |
| **Post-run analytics** | Practice test **results** page (scores, review) — not identical layout to legacy exam breakdown but same job-to-be-done. |

## Gaps (legacy stronger or not yet mirrored)

| Gap | Priority | Mitigation implemented |
|-----|----------|-------------------------|
| **Single page** combined “pick mode + filter + run” vs split “setup → runner” | Medium | `/app/questions` now surfaces **both** the practice-exam builder and the **full question bank client** so learners get legacy-style bank controls without losing CAT exams. |
| **Explicit three-way “study / exam / learning” labels** | Low–medium | Current bank uses **practice vs exam shell** + setup **tutor vs exam**; “learning” is approximated by tutor + study loop / lessons. Further copy/IA alignment optional. |
| **Legacy exam results breakdown rows** (body system + difficulty matrix matching old layout) | Medium | Partially covered by practice test results; bank session uses local rollups. Aligning visual breakdown to legacy charts would be a focused follow-up. |

## Routes touched

- **Learner question hub:** `/app/questions` — `nursenest-core/src/app/(student)/app/(learner)/questions/page.tsx` (wires `QuestionBankPracticeClient` + existing setup).

## Import / data (separate audit JSON)

Machine-readable import and validation artifacts:

- `data/audit/legacy-advanced-questions-import-validation.json`
- `data/audit/legacy-career-questions-import-validation.json`
- `data/audit/legacy-question-bank-import-report.json` (combined pre/post counts)

Run: `npm run import:legacy-question-bank` (or `:dry-run`) from `nursenest-core/`.
