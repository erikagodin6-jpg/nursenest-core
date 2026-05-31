# Lesson Navigation Flow Audit

Date: 2026-05-31

## Scope

Production incident: lesson system/category navigation appeared inert for core systems such as Cardiovascular, Respiratory, Neurological, Endocrine, Renal, Gastrointestinal, Mental Health, Pediatrics, and Maternity.

## Click To Render Flow

1. Learner opens `/app/lessons`.
2. Server page resolves protected session and entitlement in `src/app/(app)/app/(learner)/lessons/page.tsx`.
3. Page parses `topicSlug`, `topic`, `pathwayId`, `q`, `page`, and `limit`.
4. Page resolves learner pathway and visible pathway IDs through `visiblePathwayIdsForAppLessons`.
5. Page builds pathway lesson filters through `pathwayLessonsAppListWhereWithTopicFilter`.
6. Page queries pathway lessons and renderability through `paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver`.
7. Client receives initial rows in `LearnerLessonsResponsiveResults`.
8. Category/topic click calls `loadFilters`.
9. `loadFilters` pushes `/app/lessons?topicSlug=...&pathwayId=...`, shows loading immediately, and requests `/api/learner/pathway-lessons`.
10. API mirrors the same entitlement, pathway, topic, safety, and renderability filters.
11. Client renders rows, visible empty state, or visible retry error.

## Timing Budgets

- Server lesson page DB fallback timeout: 900ms.
- API pathway lesson timeout: 1800ms.
- Progress personalization budget: 350ms.
- Client click feedback: immediate `loading=true` before fetch/cache resolution.

## Failure Point Found

The route accepted exact `topicSlug` filters only. UI/system names and taxonomy IDs do not always match stored lesson topic slugs:

- Renal UI/system aliases may be `renal`, `renal_urinary`, or `renal-and-urinary`.
- Maternity UI/system aliases may be `maternity`, `reproductive_maternal_newborn`, or `maternal-and-newborn`.
- Mental Health may appear as `mental_health` or `mental-health`.

Exact matching could produce an empty response that looked like a failed click.

## Fix

Added `src/lib/lessons/lesson-system-navigation.ts` as the shared alias and href resolver. Live DB filters and bundled catalog fallback now expand high-risk system labels into all known topic slug variants. Client loading, empty, retry, and error logging states were added so lesson navigation never fails silently.
