# Flashcard Query Audit

## Route

- `/app/flashcards`

## Server Page Query Call Sites

The flashcards page is protected by the existing static query budget:

- `src/lib/db/query-budget-contracts.test.ts`
- Budget: `FlashcardsPageContent <= 5 DB call sites`

Current page-level DB use:

- User profile pathway lookup: `prisma.user.findUnique`
- Optional server inventory loader: `loadFlashcardsExamInventoryForPathway`

## Inventory Loader Query Shape

`loadFlashcardsExamInventoryForPathway` performs bounded aggregate work:

- Access-scope coalescing may read a user row if tier or country is missing.
- One transaction sets local statement timeout.
- Parallel aggregate work:
  - `COUNT(*)` over scoped `exam_questions`
  - grouped body-system/topic counts
  - dedicated flashcard count
  - legacy canonical pool count when available

## Query Risk

The inventory loader can be expensive because it aggregates over `exam_questions`. It must not block hub first paint.

## Hardening Applied

- Server page races inventory against `FLASHCARDS_INVENTORY_BOOTSTRAP_TIMEOUT_MS = 100`.
- Client inventory fetches abort after `FLASHCARDS_HUB_CLIENT_FETCH_TIMEOUT_MS = 2000`.
- Static category metadata renders immediately even when counts are unavailable.
- User-facing retry controls refresh counts without removing the hub.

## Target

- Page-level DB call sites: `<=5`.
- Server render should not wait on analytics, readiness, recommendations, or progress aggregation.
- Inventory can complete after first paint or fail safely with categories still visible.
