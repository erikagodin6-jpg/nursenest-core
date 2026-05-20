# Pathway inventory regression — fix report

## Root cause

1. **Aggregation drift:** `loadPathwayPracticeBodySystemHubAggregates` used only `pathwayExamQuestionMarketingWhere`. `loadPathwayQuestionBankSnapshot` also applies `NON_ECG_PRACTICE_EXAM_WHERE` and `generalStudyBankModuleSurfaceWhere()`, so hub category totals could exceed stat-card / app-visible inventory.

2. **CTA / copy:** Marketing questions hero, empty states, bottom nav, live inventory strip, and `PathwayQuestionsHubView` (`hasQuestions` true when snapshot null) advertised practice/CAT when the bank was empty or CAT-complete pool was below floor.

## Affected pathways

All marketing pathways using these loaders; repro notes: RN NCLEX-RN, REx-PN, NP tracks.

## Files changed

- `src/lib/exam-pathways/pathway-question-bank-snapshot.ts` — `pathwayExamQuestionMarketingHubInventoryWhere`, snapshot uses it.
- `src/lib/questions/pathway-practice-body-system-aggregates.ts` — aggregates use same where.
- `src/lib/exam-pathways/pathway-marketing-practice-gates.ts` — **new** linear/CAT usability helpers.
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx`
- `src/components/marketing/marketing-practice-questions-hub-client.tsx`
- `src/components/exam-pathways/pathway-questions-hub-view.tsx`
- `src/components/exam-pathways/pathway-live-inventory-strip.tsx`
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx`

## Validation

- `npm run verify:learning-surfaces` — **OK**
- `npm run typecheck` — **not finished here** (tsc exceeded 300s); re-run in CI/local.

## Truthpack

`.vibecheck/truthpack/` missing in this clone; no route/schema contract edits.

## Remaining risks

Full tsc; data issues if `exam` strings do not map via `expandedExamKeysForPathwayPool`.
