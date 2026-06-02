# Flashcard Blocking Operations Report

## Blocking Operations Identified

### Required Blocking

- Authentication through `getProtectedRouteSession`.
- Entitlement validation through `resolveEntitlementForPage`.
- Pathway compatibility from the in-memory exam pathway catalog.

These remain blocking because anonymous or non-entitled users must not launch premium flashcard content.

### Previously Risky Blocking

- `prisma.user.findUnique` for `learnerPath`.
- Server inventory aggregation through `loadFlashcardsExamInventoryForPathway`.
- Client `/api/flashcards/inventory` request.
- Client `/api/flashcards/custom-session` request when progress filters are active.

## Fixes Applied

- Learner profile lookup is now time-boxed to `1200ms`.
- Server inventory bootstrap remains non-blocking with a `100ms` race.
- The hub renders with static category metadata from `builderCategoryOptionsForPathway`.
- Client inventory and custom-session requests now abort after `2000ms`.
- When client refresh fails or times out, existing deck categories remain visible.
- Retry controls are shown without replacing the hub with an error-only surface.

## Deferred Features

The launch hub does not wait for:

- Analytics.
- Recommendations.
- Readiness summaries.
- Weak-area calculations.
- Progress-filter counts.
- Historical usage metrics.

These features refresh after the primary hub is visible.

## Remaining Required Work

- Continue monitoring production timing logs for `server_shell_ready`.
- Add database-level query timing telemetry if slow counts remain visible in logs.
- Consider precomputing per-pathway flashcard inventory if live aggregation is still noisy under load.
