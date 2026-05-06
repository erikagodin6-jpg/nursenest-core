# Flashcards exam inventory — aggregate performance (2026-05)

## Summary

Default flashcards hub inventory no longer runs a bounded `findMany` of up to ~8000 `ExamQuestion` rows to compute category totals. It uses:

- `prisma.examQuestion.count({ where })` for the **exact** eligible total under the same CAT-aligned, pathway-scoped canonical `WHERE`.
- `prisma.examQuestion.groupBy({ by: ["bodySystem", "topic"], where, _count: { _all: true } })` to aggregate per persisted bucket, then folds into builder-category counts with the **same** `resolveBuilderCategoryId` inputs as the legacy per-row loop.

## Behavior preserved

- **WHERE**: `getCanonicalExamQuestionWhereForPathway` (unchanged).
- **Coalesce**: `resolveAccessScopeForPathwayExamQuestionPool` (unchanged).
- **ECG**: Still excluded only via canonical WHERE (`NON_ECG_PRACTICE_EXAM_WHERE`).
- **Progress filters**: Hub still uses `/api/flashcards/custom-session` when weak / incorrect / unseen / starred are on.
- **Errors**: `CRITICAL_EMPTY_POOL` when `total === 0`; `pathway_not_entitled` (403) when scope resolution fails.

## Old vs new

| Aspect | Before | After |
|--------|--------|--------|
| Row reads | `findMany` up to 8000 rows | `count` + `groupBy` only |
| Total | Capped at 8000 | Exact `count` |

## Mapping equivalence

Classification only used `bodySystem`, `topic`, and `pathwayId`; identical `(bodySystem, topic)` rows share a builder id, so group-then-classify equals classify-then-sum.

## Risks

- Very high cardinality on `(bodySystem, topic)` could make `groupBy` large (still lighter than full row scans).
- Full coalesce + live DB regression: validate in staging with subscription `tier`/`country` null + non-empty CAT pool.

## Commands

```bash
cd nursenest-core
npm run typecheck
node --import tsx --test \
  src/lib/flashcards/flashcards-exam-inventory-counts.test.ts \
  src/lib/flashcards/load-flashcards-exam-inventory.loader.contract.test.ts \
  src/lib/practice-tests/flashcards-inventory-cat-pool-parity.contract.test.ts
```

## Mobile

No hub layout changes — `reports/mobile-validation.md` not updated.
