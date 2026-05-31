# Flashcard Launch Flow Audit

## Scope

Route audited:

- `/app/flashcards?pathwayId=ca-rn-nclex-rn`

Primary files:

- `src/app/(app)/app/(learner)/flashcards/page.tsx`
- `src/components/flashcards/flashcards-hub-client.tsx`
- `src/lib/flashcards/load-flashcards-exam-inventory.server.ts`
- `src/app/api/flashcards/inventory/route.ts`
- `src/app/api/flashcards/custom-session/route.ts`

## Navigation Flow

1. User clicks a Flashcards link or button.
2. Browser navigates to `/app/flashcards` with a pathway query when available.
3. Next.js app shell and middleware enforce authentication.
4. `FlashcardsPage` resolves search params and learner marketing copy.
5. `getProtectedRouteSession` verifies the learner session.
6. `resolveEntitlementForPage` validates subscription access.
7. Compatible pathways are derived from entitlement using the pathway catalog.
8. Learner profile pathway lookup is time-boxed to `1200ms`.
9. If profile lookup times out, the route renders with URL pathway or compatible subscription pathway context.
10. Static category metadata is rendered immediately through `builderCategoryOptionsForPathway`.
11. Server inventory aggregation is attempted but time-boxed to `100ms`.
12. Client hub mounts with deck categories and start controls.
13. Live inventory, progress filters, weak-area counts, and custom-session totals refresh asynchronously.
14. Client inventory fetches abort after `2000ms`, keep visible categories, show retry controls, and log diagnostics.

## Blocking Operations Found

- Entitlement validation remains required before premium content is shown.
- Previous learner profile lookup could block pathway resolution.
- Server inventory aggregation was already time-boxed, but client inventory fetch could wait on network/API behavior.
- Progress-filter custom sessions could also wait on slow API responses.

## Execution Targets

- Route response begins immediately after auth and entitlement.
- Profile pathway lookup budget: `1200ms`.
- Server inventory bootstrap budget: `100ms`.
- Client inventory/custom-session fetch budget: `2000ms`.
- Hub categories are available from static metadata even if live counts fail.

## Failure Handling

If hub inventory fails or exceeds the client budget:

- Keep category cards visible.
- Keep Start Flashcards available.
- Show a retry counts control.
- Log `inventory_timeout_kept_stale` or `custom_session_timeout_kept_stale`.

The user should not see a blank screen or indefinite loading state.
