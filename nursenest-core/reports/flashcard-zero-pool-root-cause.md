# Flashcard hub "zero pool" — root cause and fix

## Root cause

Learner flashcard hub inventory (`loadFlashcardsExamInventoryForPathway`) previously counted `ExamQuestion` rows using Prisma `getCanonicalExamQuestionWhereForPathway`, which scopes `exam` with **exact string** `IN (...)` against catalog keys. Production data and audits use **`examQuestionExamNormInSql`** (normalized exam keys: case, underscores vs hyphens, repeated separators). Large published pools therefore appeared in `ensure-exam-question-bank.ts` / core pathway audits while the hub returned **0**.

A secondary failure mode: when inventory was treated as a hard error (`CRITICAL_EMPTY_POOL`), the API could return **500**, and the client treated the response as a load failure — surfacing **zero** or an error state even when the entitlement path was otherwise valid.

## Data path (learner)

1. **`/app/flashcards`** (App Router) loads server payload including pathway and optional initial inventory/diagnostics.
2. **`FlashcardsHubClient`** calls **`GET /api/flashcards/inventory?pathwayId=...`** for category counts and matching pool size.
3. **Inventory route** → **`requireSubscriberSession`** → **`loadFlashcardsExamInventoryForPathway`**.
4. Loader resolves **`resolveAccessScopeForPathwayExamQuestionPool`** (tier/country coalesced from user + pathway; subscription pathway coverage).
5. **Pool count** uses **`$queryRaw`** `COUNT(*)` and a **bounded** `GROUP BY body_system, topic` with **`flashcardLearnerExamPoolWhereSql`**, which composes:
   - `examQuestionsDiscoveryWhereSql` (published + tier + region; staff bypass unchanged),
   - **`discoveryExamContextScopeForFlashcardFallback`** (normalized exam + tier scope, or empty when pathway has no content keys),
   - **`OR study_link_pathway_id = pathway.id`**,
   - **`flashcardLearnerExamQualityGatesSql`** (stem length ≥ 10, JSON `correct_answer`, topic/body signal, flashcard-eligible formats, non-ECG tags, general study-bank module scope),
   - **`npPathwaySpecialtyAndSql`** for US NP specialty pathways.
6. **Dedicated `Flashcard` row count** remains a separate `prisma.flashcard.count` on the pathway deck (published) for diagnostics — **no bulk duplication** of `ExamQuestion` into `Flashcard`.
7. **`buildFlashcardCustomSession`** (inventory-only branch) uses the same loader for **`matchingCards`** and attaches **`poolInventoryDiagnostics`**. Exam-bank **session augmentation** uses **`loadExamQuestionRowsForFlashcardPool`** with the **same** `flashcardLearnerExamPoolWhereSql` + resolved pool scope (no "drop exam scope" retry that could widen pools).

## Fixed query (conceptual)

```sql
SELECT COUNT(*)::bigint AS n
FROM exam_questions
WHERE <entitlement: published + tier IN + region_scope>
  AND (
        ( <normalized_exam IN (...) > AND <tier lower match> )
     OR (coalesce(study_link_pathway_id,'') = :pathwayId)
       )
  AND <flashcard quality gates>
  AND <np specialty fragment when applicable>;
```

Legacy Prisma `exam IN (...)` count is retained **only** as `legacyCanonicalPrismaPoolCount` in diagnostics for comparison.

## Before / after behavior

| Area | Before | After |
|------|--------|--------|
| Hub total / categories | Often **0** with mismatched `exam` spellings | Aligns with audit / discovery normalization |
| Empty eligible pool | Could **500** / throw on empty | **200** success with `total: 0`, `zeroHint` in diagnostics |
| Session exam rows | Older discovery scope + usability SQL; retry without exam scope | Same SQL stack as inventory; **no exam-scope drop retry** |
| Dedicated Flashcards | Supported | Still supported; counts shown in diagnostics |

## Remaining risks

- **SQL drift**: If discovery or audit gates change, `flashcard-learner-exam-pool-sql.ts` must stay aligned (contract tests + this report).
- **GROUP BY cap**: Inventory uses `LIMIT 500` buckets; `total` is always full `COUNT(*)`, but category sums can diverge when capped (logged).
- **Performance**: Raw `COUNT(*)` on large tables depends on indexes; statement timeouts match discovery patterns where applicable.
