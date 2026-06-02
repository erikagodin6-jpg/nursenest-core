# Lesson Client Navigation Errors

Date: 2026-05-31

## Client Navigation Findings

No missing client route was found. The client app route existed and the API route existed.

The user-facing failure was caused by:

1. Category card destination pointing to the same-page hash instead of a system route.
2. Exact topic filtering returning no rows for aliased systems.
3. No strong visible error or empty state on failed filtered loads.

## Client Hardening Added

- Immediate `loading=true` before fetch/cache resolution in `LearnerLessonsResponsiveResults`.
- Visible `Unable to load lessons` retry card.
- Visible empty filtered state with reset.
- Client diagnostic POST/beacon to `/api/learner/lesson-loading-errors`.
- Card forensic data attributes for Playwright root-cause assertions.

## Browser Console Risk Reduced

Unhandled fetch failures are caught and reported. Abort errors remain intentionally ignored.
