# CAT question-type hardening — deploy readiness

This document summarizes **which question shapes the licensing CAT / practice runner can render**, how **pool assertions** guard production data, **Playwright coverage**, and how to **re-verify** before deploy.

**Source of truth (runtime routing):** `src/lib/questions/cat-runner-renderer-coverage.ts` — `CAT_QUESTION_TYPE_RUNTIME_MATRIX`, `catRunnerRowUsesUnsupportedFallback`, `assertCatCompleteRowRenderableOrThrow`.

**Completeness gate (CAT pool rows):** `src/lib/practice-tests/cat-question-completeness.ts` — `isCompleteCatQuestionRow` (used by the full-scan report when `CAT_REPORT_FULL_SCAN=1`).

---

## Supported CAT-rendered types

These paths use the normal MCQ, SATA, or Bowtie UI in the CAT shell (no "specialized question format" unsupported alert), when payloads match what `practiceRunnerNeedsUnsupportedFallback` and `tryNormalizeBowtiePayload` accept:

| Logical id | Example `question_type` labels | Renderer |
| --- | --- | --- |
| `mcq` | `MCQ`, `MULTIPLE_CHOICE`, `multiple_choice` | MCQ |
| `sata` | `SATA`, `SELECT_ALL_THAT_APPLY` | SATA |
| `bowtie_trend` | `Bowtie`, `NGN_BOWTIE`, `Trend`, `TREND` | Bowtie (NGN-style mapping UI) |

Exact examples and product notes live in `CAT_QUESTION_TYPE_RUNTIME_MATRIX` in `cat-runner-renderer-coverage.ts`.

---

## Fallback-only types (by design)

Rows whose `question_type` / `options` shape imply **matrix, cloze, ordering, exhibit-only, case unfolding, hotspot, or ECG video** (per matrix) are routed to **`runnerUnsupportedQuestionFallback`** (accessible alert). They are **not** CAT-first-class renderers in this release.

Matrix rows with `runtimeRenderer: "unsupported_fallback"` document rationale (matrix grid, cloze/dropdown, ordered priority, exhibit/chart hints, case unfolding, hotspot, `ecg_video` exclusion from non-ECG pool).

**Important:** Incomplete CAT rows (e.g. missing rationale per `isCompleteCatQuestionRow`) are **not** subject to renderer assertion — only rows that **pass** completeness are checked when `CAT_ASSERT_POOL_RENDERERS=1`.

---

## Positive E2E coverage

**Spec:** `tests/e2e/cat/cat-question-type-positive-matrix.spec.ts`  
**Command:** `npm run test:e2e:cat-question-types` (Playwright project: `playwright.cat-question-types.config.ts`)

**Requires:** `E2E_PAID_EMAIL` and `E2E_PAID_PASSWORD` (authenticated paid learner shell).

**Scenarios:**

1. **MCQ** — patched GET question payload, stem visibility, `data-nn-qa-cat-format="mcq"`, select option, submit, advance; no unsupported alert; teaching contract (no rationale in CAT exam mode).
2. **SATA** — checkbox options, submit, advance.
3. **Bowtie** — bowtie bank + slot fills, submit, advance.
4. **Mixed MCQ → SATA → Bowtie** — three sequential items via route mutator by `index`; asserts no unsupported alert across transitions.
5. **CAT insights route** — `/app/practice-tests/cat-insights` loads for authenticated learner.

Unsupported fallback behavior is covered separately in `tests/e2e/cat/cat-question-type-unsupported-fallback.spec.ts`.

---

## Pool assertion behavior

**Script:** `scripts/report-cat-question-type-coverage.mts`  
**npm:** `npm run report:cat-question-types`

| Env | Effect |
| --- | --- |
| `CAT_REPORT_FULL_SCAN=1` | Cursor-batches up to `CAT_REPORT_MAX_SCAN` (default **25000**) published, non-ECG `exam_questions` rows; counts `isCompleteCatQuestionRow` passes per `question_type`. |
| `CAT_ASSERT_POOL_RENDERERS=1` | For each **complete** row in that scan, calls `assertCatCompleteRowRenderableOrThrow`. Any failure collects messages; script **`process.exit(1)`** if count > 0. Ignored unless `CAT_REPORT_FULL_SCAN=1`. |

**Generated inventory (includes SQL histograms):** `reports/cat-question-type-coverage.md` (regenerated each run; may be gitignored — keep for CI artifacts or copy excerpts into PRs).

---

## Commands and results (verification run)

Run from `nursenest-core/`:

```bash
npm run typecheck:critical
npm run test:unit:cat
npm run test:unit:practice
CAT_REPORT_FULL_SCAN=1 CAT_ASSERT_POOL_RENDERERS=1 npm run report:cat-question-types
```

**Optional paid E2E:**

```bash
E2E_PAID_EMAIL='…' E2E_PAID_PASSWORD='…' npm run test:e2e:cat-question-types
```

| Step | Result (latest verification) |
| --- | --- |
| `npm run typecheck:critical` | Pass (`tsc --noEmit` critical project) |
| `npm run test:unit:cat` | Pass — **113** tests (CAT hardening contracts, renderer coverage, practice-runner support, CAT adapters) |
| `npm run test:unit:practice` | Pass — **13** tests (alias redirect, bowtie adapter/grade) |
| `CAT_REPORT_FULL_SCAN=1 CAT_ASSERT_POOL_RENDERERS=1 npm run report:cat-question-types` | **Exit 0** — **zero** complete-row renderer assertion violations against the connected DB |
| Paid E2E | **Not run** in CI sandbox without `E2E_PAID_EMAIL` / `E2E_PAID_PASSWORD`; run locally or in secure CI with secrets before production promote |

---

## Known limitations

1. **NP CAT API** (`/api/cat/np/session`) applies `isAdaptiveEligible: true`; the RN/PN **practice CAT pool** (`fetchCatPracticePool`) does **not** — inventory SQL and completeness scan are broader than NP-only CAT (see report "Scope notes").
2. **Scan cap:** Default `CAT_REPORT_MAX_SCAN=25000` — increase only with intent; full table scans are bounded for CI/runtime cost.
3. **ECG video rows** excluded from practice/CAT pool via `NON_ECG_PRACTICE_EXAM_WHERE` (aligned with matrix `ecg_video` row).
4. **Assertion scope:** Only rows passing **`isCompleteCatQuestionRow`** are asserted renderable; partially authored published rows may still exist but are not CAT-complete.
5. **Legacy `question_type` strings:** DB histograms can show many labels; runtime behavior is driven by **normalization + options shape**, not enum-only typing.

---

## Deploy checklist (short)

- [ ] `npm run typecheck:critical`
- [ ] `npm run test:unit:cat` && `npm run test:unit:practice`
- [ ] `CAT_REPORT_FULL_SCAN=1 CAT_ASSERT_POOL_RENDERERS=1 npm run report:cat-question-types` against **production or staging DB mirror** — exit 0
- [ ] With secrets: `npm run test:e2e:cat-question-types`
- [ ] No production scoring/fallback changes unless the pool assert reports real violations and product approves a fix
