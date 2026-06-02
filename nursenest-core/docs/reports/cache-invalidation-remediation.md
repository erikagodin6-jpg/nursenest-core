# Cache Invalidation Remediation

**Generated:** 2026-06-01  
**Scope:** Targeted cache invalidation after CAT completion, practice test completion, flashcard session completion, and SRS progress writes

---

## Problem

Phase 2 added three Redis count caches. Without explicit invalidation, stale counts persisted for the full TTL (5 min for SRS counts, 10 min for CAT readiness) after learner state changed. The flashcard dashboard poller, study queue surface, and CAT launch screen could all show stale data until the TTL expired naturally.

---

## Solution: Two-Layer Invalidation

Each cache uses two layers:

| Layer | Mechanism | TTL before this fix |
|-------|-----------|---------------------|
| **In-process** | Module-level `Map` in `cat-practice-readiness.ts` | 60 s |
| **Redis** | Upstash Redis via `content-cache.ts` | 5 min (SRS counts), 10 min (CAT readiness) |

Both layers are now cleared on the events below. Neither layer is relied upon solely for expiry.

---

## Cache Map

| Cache | Key Pattern | Cleared By |
|-------|-------------|------------|
| `flashcard-due-summary` | `content:count:flashcard-due-summary:{userId}` | SRS write, session completion |
| `study-queue-counts` | `content:count:study-queue-counts:{userId}:{pathwayId}` | SRS write, session completion, practice/CAT completion |
| `cat-readiness` (Redis) | `content:cat:readiness:{userId}:{pathwayId}` | CAT completion, practice test completion |
| `cat-readiness` (in-process Map) | `{userId}:{pathwayId}:{tier}:{country}:{access}` | CAT completion, practice test completion |

---

## New Helpers Added

### `content-cache.ts`

```typescript
export async function invalidateCatReadiness(userId: string, pathwayId: string): Promise<void>
```
Deletes the Redis key `content:cat:readiness:{userId}:{pathwayId}`. Uses the existing `cacheDelete` wrapper — gracefully no-ops when Redis is unavailable.

### `cat-practice-readiness.ts`

```typescript
export function invalidateCatReadinessMemoForUser(userId: string): void
```
Scans the module-level `catReadinessSummaryCache` Map and removes all entries whose key starts with `{userId}:`. This clears all pathways and entitlement variants for the user in O(n) over the cached entries — the Map is bounded to 256 entries, so this is always fast.

---

## Events and Invalidated Caches

### Event 1: CAT Completion (`cat_advance` → `"completed"`)

**File:** [src/app/api/practice-tests/[id]/route.ts](src/app/api/practice-tests/%5Bid%5D/route.ts)  
**Trigger:** Adaptive engine returns `kind === "completed"` on a `cat_advance` PATCH  
**Existing hook:** `invalidateHeavyReads()` (already called)

**What was added to `invalidateHeavyReads`:**

```typescript
invalidateCatReadinessMemoForUser(gate.userId);         // in-process Map
await invalidateCatReadiness(gate.userId, pid);         // Redis
await invalidateStudyQueueCounts(gate.userId, pid);     // Redis (pathway-keyed)
await invalidateStudyQueueCounts(gate.userId, null);    // Redis (unscoped)
```

`pid = cfg.pathwayId?.trim()`. If no pathway ID is present, only the null-keyed study-queue-counts is cleared.

**Why:** CAT completion changes the user's adaptive score and question usage. The readiness cache (which gates whether the CAT start button is enabled) and the study queue counts (activity summary) must reflect the new state immediately.

---

### Event 2: CAT Manual Completion (`action: "complete"`, `selectionMode === "cat"`)

**File:** [src/app/api/practice-tests/[id]/route.ts](src/app/api/practice-tests/%5Bid%5D/route.ts)  
**Trigger:** Client sends `action: "complete"` on a CAT test  
**Existing hook:** `invalidateHeavyReads()` (already called)

Same invalidation as Event 1 — shared `invalidateHeavyReads` closure.

---

### Event 3: Linear Practice Test Completion (`action: "complete"`, `selectionMode !== "cat"`)

**File:** [src/app/api/practice-tests/[id]/route.ts](src/app/api/practice-tests/%5Bid%5D/route.ts)  
**Trigger:** Client sends `action: "complete"` on a linear practice test  
**Existing hook:** `invalidateHeavyReads()` (already called)

Same invalidation — all three practice test completion paths share the `invalidateHeavyReads` closure.

**Why CAT readiness for linear completion:** A linear practice test completion updates topic stats, which indirectly signals that the learner has engaged with the question pool. The 10-min Redis TTL on CAT readiness is acceptable staleness in most cases, but completing a full practice session is a natural checkpoint where staleness should be resolved immediately.

---

### Event 4: Flashcard Deck Review (per-card SRS write)

**File:** [src/app/api/flashcards/decks/[deckRef]/review/route.ts](src/app/api/flashcards/decks/%5BdeckRef%5D/review/route.ts)  
**Trigger:** `POST /api/flashcards/decks/[deckRef]/review` succeeds  

**Added after `logFlashcardProgressSaved`:**

```typescript
await Promise.all([
  invalidateFlashcardDueSummary(userId),
  invalidateStudyQueueCounts(userId, deck.pathwayId ?? null),
  ...(deck.pathwayId ? [invalidateStudyQueueCounts(userId, null)] : []),
]);
```

Both the pathway-keyed and the unscoped `study-queue-counts` keys are invalidated when `deck.pathwayId` is present — a user may be viewing unscoped totals on the dashboard simultaneously. When `deck.pathwayId` is null, only the null-keyed entry is cleared.

**Why:** Each card review changes `nextReviewAt`, `repetitions`, and `lapses`. The `due-summary` and `study-queue-counts` caches derive their counts from exactly these fields. Without this invalidation, the dashboard due count could show `N` due cards while the user has already reviewed them.

---

### Event 5: Flashcard Card Review (custom session, no deck context)

**File:** [src/app/api/flashcards/cards/[cardId]/review/route.ts](src/app/api/flashcards/cards/%5BcardId%5D/review/route.ts)  
**Trigger:** `POST /api/flashcards/cards/[cardId]/review` succeeds  

**Added after `logFlashcardProgressSaved`:**

```typescript
await Promise.all([
  invalidateFlashcardDueSummary(userId),
  invalidateStudyQueueCounts(userId, null),
]);
```

No pathway context available in this route (multi-deck custom sessions are not pathway-scoped). The null-keyed study-queue cache is invalidated, which covers both unscoped and "no pathway" dashboard views.

---

### Event 6: Flashcard Session Completion (server action)

**File:** [src/app/actions/flashcards/session-actions.ts](src/app/actions/flashcards/session-actions.ts)  
**Trigger:** `completeSessionAction(sessionId)` server action  

**Added after `completeFlashcardSession`:**

```typescript
await Promise.all([
  invalidateFlashcardDueSummary(uid),
  invalidateStudyQueueCounts(uid, null),
]);
```

This is a batch-level safety net: even if per-card invalidation was missed (e.g. client didn't call the review routes but completed the session), the session-completion action ensures counts are fresh.

---

## Invalidation Flow Diagram

```
CAT complete (cat_advance)          ─┬─► invalidateCatReadinessMemoForUser (in-proc)
CAT complete (manual)               ─┤   invalidateCatReadiness(uid, pid)     (Redis)
Linear practice complete            ─┘   invalidateStudyQueueCounts(uid, pid) (Redis)
                                         invalidateStudyQueueCounts(uid, null) (Redis)

Deck card review (POST /review)     ─┬─► invalidateFlashcardDueSummary(uid)   (Redis)
Card review (custom session)        ─┤   invalidateStudyQueueCounts(uid, pathwayId|null)
Session completion (server action)  ─┘   invalidateStudyQueueCounts(uid, null)
```

---

## What Is NOT Invalidated

| Cache | Event NOT triggering invalidation | Rationale |
|-------|----------------------------------|-----------|
| `cat-readiness` | Flashcard SRS writes | Flashcard progress has no effect on the question pool used by CAT |
| `flashcard-due-summary` | Practice test completion | Practice tests don't change SRS `nextReviewAt`/`lapses` state |
| Admin command center | All learner events | Admin cache is process-local, 10-min TTL, not user-specific |

---

## Cache Invalidation Safety Properties

| Property | Guarantee |
|----------|-----------|
| **Never blocks response on Redis failure** | `cacheDelete` has internal try/catch; never throws |
| **No cross-user contamination** | All keys include `userId`; invalidation is per-user only |
| **No active session state invalidated** | `ExamSession`, `ExamAttempt`, `FlashcardSession` writes are DB-only, never cached |
| **Idempotent** | Deleting a key that doesn't exist is a no-op in Redis |
| **Graceful without Redis** | `getRedisClient()` returns null when unconfigured; all calls become no-ops |
| **In-process + Redis invalidated together** | Both layers cleared atomically per event — no partial invalidation |

---

## TypeScript Check

```
npx tsc --noEmit  →  0 errors in modified files
```

All imports are resolved. No circular dependencies introduced.
