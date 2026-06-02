# Architecture Contracts

These contracts record permanent architectural decisions that protect production stability. They are enforced by `scripts/verify-architecture-contracts.mts` and should be updated only when the architecture itself intentionally changes.

## Contract 001

Next.js request interception uses:

- `src/proxy.ts`

Never:

- `src/middleware.ts`
- `src/middleware.js`
- middleware shim imports from `proxy.ts`

Reason:

- Next.js 16 proxy architecture.
- Having both middleware and proxy entrypoints can block builds/deployments.

Violation:

- Deployment blocked.

## Contract 002

Flashcards derive from shared inventory.

Never maintain separate flashcard inventories.

Required behavior:

- Flashcard hub API and server page use the shared flashcard inventory helper.
- Shared flashcard inventory derives from the same count-only session builder used by session creation.
- CAT/question pool parity must remain a stricter subset of the canonical exam inventory, not a competing inventory.

Violation:

- Deployment blocked until flashcard consumption is reconnected to the shared inventory path.

## Contract 003

Content generation must not succeed if publication cannot succeed.

Database preflight required.

Required behavior:

- CLI publication and DB-backed generation scripts must have a database URL preflight path.
- Publication readiness scripts must fail when `DATABASE_URL` is unavailable.
- Prisma/scripts must never silently publish against placeholder, malformed, or wrong database URLs.

Violation:

- Publication pipeline blocked.

## Contract 004

One inventory helper powers:

- Lessons
- Flashcards
- Practice
- CAT
- Readiness

No duplicate inventory logic.

Required behavior:

- Learner study surfaces use canonical shared inventory, snapshot, or failover helpers.
- Flashcards, practice, CAT, readiness, and lessons may have surface-specific views, but not separate source-of-truth pools.
- Any new inventory consumer must either call the canonical helper path or document why it is a read-only projection of that path.

Violation:

- CI blocked until the duplicate inventory source is removed or routed through the canonical helper.
