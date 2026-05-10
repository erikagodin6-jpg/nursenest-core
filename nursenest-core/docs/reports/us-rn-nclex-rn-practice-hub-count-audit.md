# US RN NCLEX-RN Practice Hub Count Audit

Date: 2026-05-10

## Source Files Audited

- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx`
- `src/lib/questions/pathway-practice-body-system-aggregates.ts`
- `src/lib/questions/pathway-practice-hub-inventory.ts`
- `src/lib/questions/normalize-question-body-system.ts`
- `src/lib/questions/pathway-practice-hub-count-audit.ts`
- `src/lib/exam-pathways/pathway-question-bank-snapshot.server.ts`
- `src/lib/exam-pathways/exam-pathways-data-segment-b.ts`
- `src/lib/content-quality/exam-question-exam-normalization.ts`
- `src/lib/practice-tests/cat-pool.ts`
- `src/lib/study-question-pool/study-question-pool-gates.ts`
- `src/app/api/questions/route.ts`

## Data Path

The marketing route resolves `us-rn-nclex-rn`, then calls `loadPathwayPracticeBodySystemHubAggregates(pathway.id)`.

The aggregate loader builds `pathwayExamQuestionMarketingHubInventoryWhere(pathway)`, runs a Prisma `examQuestion.groupBy` by `bodySystem`, `topic`, and `nclexClientNeedsCategory`, then hydrates the canonical hub skeleton through `hydratePracticeHubAggregatesFromGroupByRows`.

The `/api/questions` route stays aligned by loading the same aggregates when `practiceHubIds` are provided, then using the aggregate `matchingTopics` and `matchingBodySystems` as the API pool filter.

## Final Filter Behavior

For `us-rn-nclex-rn`:

- Pathway id: `us-rn-nclex-rn`
- Country: `US`
- Tier: `RN`
- `contentExamKeys`: `["NCLEX-RN", "NCLEX_RN"]`
- Expanded exam keys: `["NCLEX-RN", "NCLEX_RN"]`
- Published rows only: `status in ["published", "PUBLISHED"]`
- Region scope: `BOTH` or `US_ONLY`
- RN tier ladder: case-insensitive `rpn`, `lvn`, or `rn`
- Exam scope: `exam in ["NCLEX-RN", "NCLEX_RN"]`
- ECG exclusion: not `questionFormat = "ecg_video"` and not tagged `ecg-video`
- Module-only exclusion: exclude `lab-drills-only` and `med-calculations-only` unless tagged `general-nursing-practice`
- CAT-only complete-row filters: not applied

## Category Totals

Live audit command:

```bash
node --import tsx scripts/audit-us-rn-nclex-rn-practice-hub-counts.mts
```

Current DB-backed audit result:

- Total matching rows: 5,235
- Grouped `bodySystem` / `topic` / `nclexClientNeedsCategory` rows: 187
- Sum of normalized hub counts: 5,235

After mapping hardening:

- Cardiovascular: 665
- Respiratory: 525
- Neurological: 830
- Gastrointestinal: 335
- Endocrine: 370
- Renal / Urinary: 475
- Musculoskeletal: 105
- Integumentary: 105
- Hematology / Oncology: 310
- Immune / Infection Control: 215
- Maternity / Reproductive: 330
- Pediatrics: 75
- Mental Health: 20
- Pharmacology: 120
- Fundamentals / Safety: 50
- Leadership / Prioritization: 190
- Community / Public Health: 0
- Emergency / Critical Care: 65
- Other / multi-topic: 450

Before the mapping hardening, `Other / multi-topic` was 605. The total did not change; 155 rows moved from uncategorized into specific hubs.

## Uncategorized Examples

Examples that still remain in `Other / multi-topic` after normalization:

- `antibiotic-classes`
- `cancer-pain-palliative`
- `clinical-deterioration-rapid-response`
- `early-vs-late-complications`
- `end-of-life-care`
- `functional-assessment`
- `head-to-toe-assessment`
- `nursing-documentation`
- `overdose-toxicology`
- `patient-education-principles`
- `peripheral-iv-therapy`
- `postoperative-care`
- `preoperative-assessment`
- `primary-survey-abcde`
- `priority-setting-frameworks`
- `quality-improvement`
- `sbar-communication`

These remain uncategorized because they are genuinely cross-cutting or do not map cleanly to one canonical body-system hub from current metadata.

## Mapping Fixes Made

- Normalized hyphenated and underscored topic slugs into words before keyword matching. This lets values like `five-rights-of-delegation` match the same way as plain text.
- Added narrow leadership/legal aliases for `chain of command`, `informed consent`, and `advance directive`.
- Added `eating disorder` to mental health mapping.
- Preserved all existing hub ids.
- Kept generic `Labs` and arbitrary unknown topics uncategorized to avoid broad false positives.

## Regression Coverage

Added or hardened tests for:

- Requested body-system mapping cases: cardiovascular, pharmacology, respiratory, maternity, pediatrics, mental health, fundamentals, leadership, safety, endocrine, renal, neuro, GI, immune, musculoskeletal, integumentary, labs, and uncategorized.
- Aggregate total parity: grouped input counts equal final normalized hub count totals.
- DB-backed parity when `DATABASE_URL` is configured: grouped DB totals equal normalized hub totals for `us-rn-nclex-rn`.
- `Other / multi-topic` remains the separate uncategorized hub label.
- Marketing hub counts explicitly do not apply CAT complete-row filters.
- RN NCLEX filter scope includes country, tier ladder, published status, US/BOTH region, and NCLEX aliases.
- ECG rows and ECG tags are excluded.
- Lab-drills-only and med-calculations-only rows are excluded unless tagged `general-nursing-practice`.

## Commands Run

```bash
node --import tsx --test src/lib/questions/*.test.ts
node --import tsx --test src/lib/exam-pathways/pathway-practice-hub-count-scope.test.ts
node --import tsx scripts/audit-us-rn-nclex-rn-practice-hub-counts.mts
```

The broader requested command `node --import tsx --test src/lib/exam-pathways/*.test.ts` was also run. The new `pathway-practice-hub-count-scope.test.ts` passed after aligning assertions to the real Prisma fields. The full glob still includes unrelated pre-existing failures in `international-rn-exam-pathways.test.ts` around international RN copy fallback (`Overview copy is loading.`), outside this RN practice hub count change.
