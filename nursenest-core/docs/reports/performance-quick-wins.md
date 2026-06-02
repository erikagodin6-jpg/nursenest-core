# Performance Quick Wins

Generated: 2026-06-02T01:15:11.169Z

Implemented in this pass:

1. Static import for CAT session pathway registry lookup in `src/lib/practice-tests/cat-session.ts`.
2. Static import for learner pathway tier fallback registry lookup in `src/lib/learner/learner-pathway-hub-chrome-href.ts`.
3. Static import for learner layout selected NP pathway registry lookup in `src/app/(app)/app/(learner)/layout.tsx`.
4. Static import for learner layout subscription-compatible pathway list in `src/app/(app)/app/(learner)/layout.tsx`.

Already implemented before this certification request and retained:

5. Homepage live counts removed in favor of `public_home_stats_snapshot`.
6. Blog live counts replaced with `blog_index_snapshot` / `take + 1` pagination.
7. Admin blog status counts consolidated with `groupBy`.
8. Admin analytics user counts consolidated into one aggregate.
9. Flashcard progress query input deduplicated and synthetic ids filtered.
10. CAT answer-history loading overlapped with pool work.

No schema changes, route changes, learning-logic changes, or business-logic changes were made.
