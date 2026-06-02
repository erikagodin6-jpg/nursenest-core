# Flashcard Scaling Audit

Generated: 2026-06-02

## Source Paths

- `src/lib/flashcards/build-flashcard-custom-session.ts`
- `src/lib/flashcards/load-flashcards-exam-inventory.server.ts`
- `src/lib/flashcards/flashcard-pool-snapshot.server.ts`
- `src/lib/flashcards/flashcard-session-dal.server.ts`

## Current Flow

1. Resolve pathway/entitlement/category filters.
2. Try Redis hub inventory snapshot.
3. On cold miss, load exam inventory, flashcard pool snapshot, and dedicated flashcards.
4. For session cards, query `flashcard.findMany`, optional `flashcardProgress.findMany`, lesson virtuals, and exam-question metadata.
5. Build in-memory queue and return cards.

## Scaling Risks

| Target | Expected risk | Reason |
| --- | --- | --- |
| 100 concurrent sessions | High if cold; medium if warm | Cold path can scan 5,000 dedicated cards per pathway and hydrate metadata. |
| 500 concurrent sessions | Critical without pre-generation | Redis cold misses or cache stampedes can saturate DB and CPU. |
| 1000 concurrent sessions | Not safe without architecture hardening | Session generation must become ID-first and mostly cached/precomputed. |

## DB Calls Per Session

Exact live query count requires runtime tracing. Source path shows these common calls:

- `flashcard.findMany` for cards.
- `flashcardProgress.findMany` when progress filters are active.
- `examQuestion.findMany` for uncached metadata chunks.
- Inventory cold path includes `loadFlashcardsExamInventoryForPathway`, `loadFlashcardPoolSnapshotForPathway`, and dedicated card scans.

## Required Changes

1. Precompute per-pathway/category inventory with counts and candidate IDs.
2. Use single-flight locking for cold inventory snapshot population.
3. Generate common 20/50/100-card session templates per pathway/category/difficulty.
4. Hydrate only selected card IDs, not broad relation sets.
5. Persist session build timing and failure metrics by pathway/category/filter.
6. Keep empty-pool handling explicit; never return zero-card sessions when source pools contain content.

