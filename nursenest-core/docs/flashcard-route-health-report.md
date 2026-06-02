# Flashcard Route Health Report

## Canonical Route

- `/app/flashcards`

Recommended pathway-scoped entry:

- `/app/flashcards?pathwayId=ca-rn-nclex-rn`

## Health Checks

### Flashcards Button / Link

The expected link target is the learner flashcards route. Existing helpers should continue to use:

- `pathwayHubAppFlashcardsHref`
- `buildAppFlashcardsHubHref`
- Direct `/app/flashcards?pathwayId=...` only when pathway context is known.

### Auth Redirects

Anonymous users should be redirected through the existing auth flow. The authenticated flashcards hub must not fork a separate shell.

### Entitlement Redirects

Non-entitled users should see the existing subscription paywall. Entitled users should render the hub even if live inventory is slow.

### Dead Route / Loop Risk

No route rewrite or redirect was added. The hardening stays inside the existing route and client hub.

## Failure Handling

If live inventory fails within the hub:

- The route remains `/app/flashcards`.
- Category cards remain visible.
- Start controls remain visible.
- Retry counts control appears.
- Client diagnostic logs record the failure.

## Regression Coverage

- `tests/e2e/flashcards/flashcard-launch-hub.spec.ts`
- `src/lib/flashcards/flashcard-launch-budget.test.ts`
- Existing query budget: `src/lib/db/query-budget-contracts.test.ts`
