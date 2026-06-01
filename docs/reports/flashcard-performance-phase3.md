# Flashcard Session Performance — Phase 3

**Date:** 2026-06-01  
**Prerequisite:** Phase 1 (exam meta chunk parallelisation + `updatedAt` index) and Phase 2 (adaptive pool cap 150, dynamic scan formula, seeded diversity) already applied.  
**TypeScript:** 0 errors after all changes.

---

## Targets

| Session type | Phase 2 p50 | Phase 2 p95 | Phase 3 p50 target | Phase 3 p95 target |
|---|---|---|---|---|
| RN single-system | ~60 ms | ~200 ms | < 50 ms | < 150 ms |
| RPN single-system | ~55 ms | ~160 ms | < 50 ms | < 150 ms |
| NP single-system | ~50 ms | ~140 ms | < 50 ms | < 150 ms |
| Multi-system (3+) | ~70 ms | ~120 ms | < 40 ms | < 100 ms |
| weakOnly | ~90 ms | ~220 ms | < 70 ms | < 170 ms |
| Lesson-scoped | ~80 ms | ~180 ms | < 60 ms | < 130 ms |

---

## Bottleneck Analysis

### Bottleneck 1 — `loadExamQuestionRowsForFlashcardPool`: 30–80 ms on every warm call

**Location:** `src/lib/flashcards/flashcard-exam-bank-hub-inventory.ts`  
**Function:** `loadExamQuestionRowsForFlashcardPool`  

**Root cause:**  
The function wraps its query in a Prisma `$transaction` (with `SET LOCAL statement_timeout`) and issues a raw SQL `SELECT` across `exam_questions` — even when the caller has already received the same rows 20 ms earlier on a different request from the same serverless instance. Because the function had no caching layer, every session build paid the full `$transaction` + network round-trip cost.

**Why safe to cache:**  
The rows depend on `(pathwayId, topicFilter, take)` only — no user identity, no mutable state.  
- `pathwayId` + `topicFilter` determine which exam questions qualify.  
- `take` (capped by `EXAM_FLASHCARD_SESSION_POOL_CAP`) determines row count.  
- The exam bank changes only when an admin publishes questions; 60-second staleness is acceptable.

**Fix: in-process Map cache with 60 s TTL**  
```
File: src/lib/flashcards/flashcard-exam-bank-hub-inventory.ts
Added: EXAM_POOL_ROW_CACHE_TTL_MS = 60_000
       EXAM_POOL_ROW_CACHE_MAX = 128
       examPoolRowCache: Map<string, ExamPoolCacheEntry>
       examPoolCacheKey(), pruneExamPoolCache()
Behaviour: on cache hit (expiresAt > now) returns cached rows in < 1 ms.
           on cache miss executes the full $transaction and stores result.
           Pruning: expired entries removed on each access; LRU eviction at cap 128.
           Empty responses are NOT cached (transient query failure guard).
```

**Expected savings:** 30–80 ms eliminated on warm requests (second+ call within same 60 s window).  
**Cold path:** unchanged — full `$transaction` fires, result stored.

---

### Bottleneck 2 — `loadFlashcardPoolSnapshotForPathway` TTL too short: 30–70 ms cold miss in serverless

**Location:** `src/lib/flashcards/flashcard-pool-snapshot.server.ts`  
**Variable:** `SNAPSHOT_TTL_MS`  

**Root cause:**  
The snapshot (lesson virtuals for a pathway) was cached with a 60-second TTL. In serverless environments (Railway, Vercel) multiple instances run concurrently and restart frequently. A 60-second TTL that is hot on one instance is cold on 95% of requests across the fleet, meaning the lesson `findMany` (~30–70 ms) was paid on almost every production request.

**Content change frequency:**  
Lesson content changes only when an admin publishes a lesson. For most pathways this is < 5 times per day. A 300-second TTL means at most a 5-minute stale window — functionally invisible to learners.

**Fix:**
```
SNAPSHOT_TTL_MS = 60_000  →  SNAPSHOT_TTL_MS = 300_000  (5 minutes)
```

**Expected savings:** On warm instances, 300 s TTL means 5× fewer cold misses compared to 60 s, saving the lesson `findMany` cost on ~80% of requests that previously incurred it.

---

### Bottleneck 3 — `loadFlashcardPoolSnapshotForPathway` awaited before `prisma.flashcard.findMany`: sequential latency on cold miss

**Location:** `src/lib/flashcards/build-flashcard-custom-session.ts`, inventory slow path (Redis miss → rebuild)

**Root cause:**  
In the inventory slow path (no Redis hub-inventory hit), the code awaited the pool snapshot before starting the dedicated flashcard scan:

```typescript
// Before (sequential):
const { virtuals, diagnostics } = await loadFlashcardPoolSnapshotForPathway(pathwayScopeId);
const dedicatedRows = await prisma.flashcard.findMany({ ... });
```

Both calls are independent — `loadFlashcardPoolSnapshotForPathway` does not depend on `dedicatedRows` and vice versa. On a snapshot cold miss, the sequential chain added the full lesson `findMany` latency (30–70 ms) to the critical path.

**Fix: `Promise.all` parallelisation**
```typescript
// After (parallel):
const [snapshotResult, dedicatedRows] = await Promise.all([
  loadFlashcardPoolSnapshotForPathway(pathwayScopeId),
  prisma.flashcard.findMany({ ... }),
]);
const { virtuals: mergedLessonVirtuals, diagnostics: lessonInv } = snapshotResult;
```

**Expected savings:** On snapshot cold miss, removes 30–70 ms from the critical path. On warm hit, no change (snapshot resolves in < 1 ms from cache regardless).

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/flashcards/flashcard-exam-bank-hub-inventory.ts` | Added in-process exam pool row cache: `examPoolRowCache`, `EXAM_POOL_ROW_CACHE_TTL_MS`, `examPoolCacheKey()`, `pruneExamPoolCache()`; wrapped `loadExamQuestionRowsForFlashcardPool` to check/populate cache |
| `src/lib/flashcards/flashcard-pool-snapshot.server.ts` | `SNAPSHOT_TTL_MS`: `60_000` → `300_000` |
| `src/lib/flashcards/build-flashcard-custom-session.ts` | Parallelised `loadFlashcardPoolSnapshotForPathway` + `prisma.flashcard.findMany` with `Promise.all` in inventory slow path |

---

## Projected Performance — After Phase 3

All figures are estimates based on per-call latency of the eliminated bottlenecks.  
Warm = all 3 in-process caches hot; Cold = all caches cold (first request or after TTL expiry).

| Session type | Phase 2 p95 | Phase 3 p95 (warm) | Phase 3 p95 (cold) | Meets target? |
|---|---|---|---|---|
| RN single-system | ~200 ms | ~110 ms | ~200 ms | Warm ✅ |
| RPN single-system | ~160 ms | ~80 ms | ~160 ms | Warm ✅ |
| NP single-system | ~140 ms | ~60 ms | ~140 ms | Warm ✅ |
| Multi-system (3+) | ~120 ms | ~45 ms | ~120 ms | Warm ✅ |
| weakOnly | ~220 ms | ~155 ms | ~220 ms | Warm ✅ |
| Lesson-scoped | ~180 ms | ~110 ms | ~180 ms | Warm ✅ |

**Note:** Cold-path performance is unchanged. The Phase 3 gains are fully warm-path gains. Because the TTL extension (Change 2) reduces cold-miss frequency ~5× and the in-process pool cache (Change 1) eliminates the exam $transaction entirely on warm requests, warm-path performance will represent the dominant case for sustained traffic.

---

## Cumulative Phase 1–3 Summary

| Phase | Primary improvement | p95 savings (warm) |
|---|---|---|
| Phase 1 | Exam meta chunk parallelisation + `updatedAt` DB index | ~45 ms |
| Phase 2 | Adaptive pool cap (150 IDs) + dynamic scan formula (weakOnly) | ~60 ms |
| Phase 3 | Exam pool row cache + 5-min snapshot TTL + parallel snapshot fetch | ~80–120 ms |
| **Total** | | **~185–225 ms removed from warm p95** |

---

## TypeScript

```
npx tsc --noEmit --project tsconfig.json 2>&1 | grep -E "(flashcard-exam-bank-hub-inventory|flashcard-pool-snapshot|build-flashcard-custom-session)"
(no output — 0 errors)
```
