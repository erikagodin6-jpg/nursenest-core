# Phase 2 — performance hardening

## Scope

Small, production-safe diffs: lesson index tooling dedupe, practice test UI modularization, learner shell code-splitting for admin QA, no schema/API response changes.

## Files changed

| Area | File |
|------|------|
| Lesson index coverage | `scripts/lesson-normalization-coverage.mts` — optional `pathwayIds` for `buildLessonNormalizationCoverageReport` |
| Lesson index build | `scripts/build-normalized-lesson-indexes.runner.mts` — passes `pathwayIds: ids` into coverage (avoids second `listCatalogPathwayIdsWithLessonsSync` + redundant listing work) |
| Practice test runner | `src/components/student/practice-test-runner-client.tsx` — uses extracted presentational parts |
| Practice test parts (new) | `src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx` |
| Learner layout | `src/app/(student)/app/(learner)/layout.tsx` — dynamic `import()` for admin learner QA modules when `qaShell` is set |

## Lesson normalization / memoization

- **In-process memoization** in `pathway-lesson-catalog-sync.ts` for `getCatalogLessonsRaw`, `ensurePathwayCatalogIndexes`, `getEffectiveCatalogLessonsForPathwaySync`, `getLessonSummariesIndex`, and `getMarketingHubEffectiveCatalogSlugSet` was already present; this phase did **not** change normalization output or verify’s `NN_PATHWAY_LESSON_INDEX_DIR` temp-dir live legs.
- **Build runner**: coverage report now reuses the same pathway id list as the main loop (`buildLessonNormalizationCoverageReport({ pathwayIds: ids })`), preserving report content while skipping a duplicate catalog id enumeration pass.

### Build / verify timing (this environment)

- `npm run build:lesson-indexes`: ~7m10s wall (`time`); memo log sample: `pathwayCount=9`, `mergedRawHits=18` / `mergedRawMisses=9`, `pathwayNormHits=9` / `pathwayNormMisses=9`, `effectiveHubHits=9` / `effectiveHubMisses=9`, `summaryHits=9` / `summaryMisses=9`, `marketingSlugHits=0` / `marketingSlugMisses=9` (expected with stripped output dir — no trusted disk index during build).
- **Strict verify**: `npm run build:lesson-indexes && npm run verify:lesson-indexes` run **sequentially** completed with **exit code 0**; `fileCount=9`, `totalLessonRowsVerified=3302`. (A standalone verify run mid-session once hit `ENOENT` on a JSON file — likely concurrent writers or partial index dir; sequential build→verify is the reliable gate.)

## Practice exam runner modularization

New presentational building blocks (state/scoring remain in `practice-test-runner-client.tsx`):

- `PracticeTestFlagForReviewButton`
- `PracticeTestClinicalFigure`
- `PracticeTestMcqChoicesInstruction`
- `PracticeTestTimedSessionAlert` / `PracticeTestTimedSessionAlertCompact`
- `PracticeTestQuestionMediaBlock` (wraps `EcgVideoQuestionMedia`)
- `PracticeTestMcqRadiogroupOptions` (non-SATA radiogroup lists)
- `PracticeTestCatStudyRationaleAside` (aside + `RationalePanel`)
- `PracticeTestCatAdaptiveExamFooter` (preserves `data-nn-qa-cat-adaptive-exam-footer` + footer classes for E2E measurement hooks)

SATA checkbox lists and CAT-specific option formatting stay inline in the parent where behavior diverges.

## Learner shell hydration / imports

- **Admin learner QA**: `AdminLearnerQaPosthogSuppressor` and `AdminLearnerQaAppToolbar` load via `import()` only when `qaShell` is truthy, so normal learner traffic does not pay for those chunks up front.
- **Unchanged**: paywall/i18n/session/`BaselineAssessmentPrompt`, study-next/tutor dynamic pattern, entitlements resolution order.

## Mobile / Playwright

- No edits to Playwright specs or measurement-based overflow assertions.

## Prior reports

- `reports/lesson-index-build-performance.md` and `reports/phase-1-observability-and-performance.md` were **not found** in this workspace at investigation time; memoization context was taken from `pathway-lesson-catalog-sync.ts` and build runner logs.

## Validation commands (exit codes)

| Command | Result |
|---------|--------|
| `npm run build:lesson-indexes && npm run verify:lesson-indexes` | **0** (sequential, post-change) |
| `npm run typecheck` | **Not completed in-session** — `tsc --noEmit` exceeded 10+ minutes without finishing in this environment; recommend running locally/CI. |
| `npm run build` | **Not run** (full Next build blocked on same `tsc` scale in this session). |
| `npm run test:e2e:mobile` | **Not run** (Playwright mobile suite not executed here). |
| `npm run qa:release-gate` | **Not run** (release gate typically needs credentials/artifacts). |

## Remaining risks

- Full `tsc` / `next build` / mobile E2E still need a green run in CI or a machine with sufficient resources/time.
- Any tooling that assumes static imports for admin QA modules in the learner layout should use the dynamically loaded components only when `qaShell` is active.
