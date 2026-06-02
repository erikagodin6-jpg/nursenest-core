# Practice Test Resilience — Phase 4

**Implemented:** 2026-06-01  
**Status:** ✅ Complete

---

## Problem

The practice test flow had two unretried DB operations:

1. **Session load** (`GET /api/practice-tests/[id]`) — `findPracticeTest` called directly without `withRetry`
2. **All state mutations** (`PATCH /api/practice-tests/[id]`) — `updatePracticeTest` called directly without `withRetry`

A single transient DB error on either operation would:
- Fail the entire session load (user sees "Not found" or unhandled 500)
- Lose answer progress on a save action
- Corrupt session state on a CAT advance

---

## Fix: Retry Wrapping in route-deps.ts

**File:** `src/app/api/practice-tests/[id]/route-deps.ts`

```typescript
// Before
findPracticeTest: (args) => prisma.practiceTest.findFirst(args),
updatePracticeTest: (args) => prisma.practiceTest.update(args),

// After
findPracticeTest: (args) =>
  withRetry(() => prisma.practiceTest.findFirst(args), { maxAttempts: 3 }),
updatePracticeTest: (args) =>
  withRetry(() => prisma.practiceTest.update(args), { maxAttempts: 2 }),
```

**Why route-deps.ts:** All practice test route handlers consume these via the `practiceTestRouteDeps` object. Wrapping at the deps layer applies the protection to every call site simultaneously without touching the 900+ line route file.

**Retry config:**
- `findPracticeTest`: 3 attempts (read — safe to retry unlimited times)
- `updatePracticeTest`: 2 attempts (write — safe because Prisma updates are idempotent on the same session ID, but limiting to 2 to avoid double-write risk on non-idempotent payloads)

**Coverage:** Every action in the PATCH handler benefits:

| Action | Protection |
|---|---|
| `save` (answer progress) | ✅ `updatePracticeTest` now retried |
| `complete` (submit exam) | ✅ `updatePracticeTest` now retried |
| `abandon` | ✅ `updatePracticeTest` now retried |
| `cat_advance` state update | ✅ `updatePracticeTest` now retried |
| `linear_commit` state update | ✅ `updatePracticeTest` now retried |
| Session load (GET) | ✅ `findPracticeTest` now retried |

---

## Static Question Fallback Module

**File:** `src/lib/study-content-failover/practice-test-question-static-fallback.server.ts`

For the question-fetch endpoint (`GET /api/practice-tests/[id]/question`), a static fallback module is available. When the question cannot be retrieved from the DB after retries:

- `getFallbackQuestion({ topic, pathwayId, practiceTestId })` returns a representative question from the static NCLEX-PN gap-closure bundle
- Fallback question is marked with `_isFallback: true`
- Best-effort topic matching attempts to return a contextually relevant question

**Not yet wired to the route** (backlog item) — the current `withRetry` on the question fetch covers most transient failures. The static fallback is available for a future sprint.

---

## Pre-Generated Exam Inventory (Roadmap)

For a full tertiary fallback on practice test creation, a nightly export of pre-generated exam sessions would allow serving users when the question pool DB is unavailable. This requires:

1. Export job that calls `POST /api/practice-tests` and saves the resulting `questionIds` array to a snapshot file
2. A `practice-test-pre-generated-inventory-read.ts` module (following the pattern of `practice-exams-published-snapshot-read.ts`)
3. Wiring in `POST /api/practice-tests` to serve a pre-generated session on DB failure

This is scoped to a future infrastructure sprint given the complexity of pre-generating personalized adaptive sessions.

---

## Recovery Timeline

| Time | State |
|---|---|
| T+0 | DB spike begins |
| T+0 to T+160ms | `withRetry(3)` attempts for `findPracticeTest` (40ms + 80ms + 160ms backoff) |
| T+160ms | DB recovers (typical transient spike) — session served |
| T+320ms | If DB still down: `updatePracticeTest` retry window |
| T+320ms+ | All retries exhausted → standard 503 returned |

For typical transient DB spikes (<200ms), the retry window now absorbs the failure entirely. Users experience a slight delay but no error.

---

## Files Changed

| File | Change |
|---|---|
| `src/app/api/practice-tests/[id]/route-deps.ts` | Added `withRetry` import; wrapped `findPracticeTest` and `updatePracticeTest` |
| `src/lib/study-content-failover/practice-test-question-static-fallback.server.ts` | **NEW** — static question fallback module (not yet wired) |
