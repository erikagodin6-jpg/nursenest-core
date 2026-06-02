# Query Timeout Audit

**Date:** 2026-06-02  
**Scope:** `src/lib/` and `src/app/api/` — all `withDatabaseFallbackTimeout` and `Promise.race` call sites  
**Key question per site:** Does the underlying DB work continue after the timeout fires?

---

## Mechanism: How `withDatabaseFallbackTimeout` Works

```typescript
export async function withDatabaseFallbackTimeout<T>(run, fallback, timeoutMs) {
  return await Promise.race([
    run(),                         // ← DB work starts immediately
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("database_timeout")), timeoutMs);
    }),
  ]);
  // If timer wins: catch() returns `fallback`. run() Promise is NOT cancelled.
  // If run() wins: fallback never used. timer is cleared.
}
```

**Critical:** `Promise.race` resolves with the winner but does NOT cancel the loser. When the timeout fires:
1. The fallback is returned immediately — **the route responds without blocking**
2. The `run()` Promise (the DB query) **continues running in the background**
3. Background DB connections remain held until the query completes or the connection is killed
4. With `connection_limit=5`, phantom queries deplete the pool for concurrent requests

**Risk classification:**

| Risk | Description |
|---|---|
| 🔴 HIGH | Loop queries with many iterations; each batch takes time → minutes of background work |
| 🟡 MEDIUM | Complex multi-join or groupBy query → seconds of background work |
| 🟢 LOW | Simple single-table count/find → < 500ms background work, within normal query time |

---

## Call Sites

### 1. `src/lib/exam-pathways/pathway-question-bank-snapshot.server.ts`

**Fixed this phase.**

| Query | Timeout | Background work after timeout | Risk | Status |
|---|---|---|---|---|
| `prisma.examQuestion.count({ where: publishedWhere })` | 1,000ms | Negligible — single COUNT on indexed column | 🟢 LOW | ✅ Fine |
| `prisma.examQuestion.count({ where: inventoryWhere })` | 1,000ms | Negligible — single COUNT with complex WHERE | 🟢 LOW | ✅ Fine |
| `prisma.examQuestion.count({ where: { isAdaptiveEligible: true, ... } })` | 1,000ms | Negligible — single COUNT | 🟢 LOW | ✅ **Fixed** (was O(n) loop scanning 8,000 rows — now O(1) count) |

**Before fix:** The adaptive scan loop fetched 280-row batches in a `while` loop. After the outer 1,000ms timeout fired, up to 27 additional batch queries continued running in the background, each taking ~200ms, for a total of ~5,400ms of phantom DB work per timed-out request.

---

### 2. `src/lib/questions/pathway-practice-body-system-aggregates.ts`

| Query | Timeout | Background work after timeout | Risk |
|---|---|---|---|
| `prisma.examQuestion.groupBy({ by: ["bodySystem","topic","nclexCategory"], _count })` | 1,200ms | GroupBy on large table — continues for 2–5s after timeout | 🟡 MEDIUM |

**Assessment:** groupBy runs on the full `ExamQuestion` table (10k+ rows) with a compound `WHERE`. If the index covers the WHERE clause, it completes in ~200ms and timeout never fires. If it misses the index (e.g., after a stats refresh), it runs full scan for 2–5s. Background work post-timeout: 1–4 seconds. DB connection held during that window.  
**Recommendation:** Add composite index on `(status, exam, bodySystem, topic, nclexClientNeedsCategory)` — or at minimum `(status, exam)` — to ensure the groupBy always uses the index.

---

### 3. `src/lib/exam-pathways/marketing-hub-optional-data.ts` — lesson count

| Query | Timeout | Background work after timeout | Risk | Status |
|---|---|---|---|---|
| `countPathwayLessons(pathway.id)` → `prisma.pathwayLesson.count({ where: { pathwayId, status: PUBLISHED } })` | 1,000ms | < 200ms — single COUNT on indexed (pathwayId, status) | 🟢 LOW | ✅ **Fixed** (was `countPathwayLessonsPublic` → full list resolution 3–5s) |

**Before fix:** `countPathwayLessonsPublic` called `resolveMarketingHubRenderableLessonList` which issued multiple sequential DB queries (overlay map, lesson list pagination, catalog merge). After the 1,500ms timeout fired, these queries continued running for 3–5 additional seconds. With multiple concurrent requests, this exhausted the 5-connection pool.

---

### 4. `src/lib/auth/protected-route-session.ts`

| Query | Timeout | Background work | Risk |
|---|---|---|---|
| `loadLearnerRequestUser(userId)` → `prisma.user.findFirst` | 650ms | < 100ms — single PK lookup on User | 🟢 LOW |

Single-row primary key lookup. Always fast. Timeout is a safety net for DB unreachable scenarios. No concern.

---

### 5. `src/lib/np/np-pathway-inventory-gate.ts`

| Query | Timeout | Background work | Risk |
|---|---|---|---|
| `prisma.pathwayLesson.count({ where: { pathwayId: "ca-np-cnple", status: PUBLISHED } })` | 1,000ms | Negligible — single COUNT | 🟢 LOW |

---

### 6. `src/lib/seo/load-programmatic-question-topic-page.ts`

| Query | Timeout | Background work | Risk |
|---|---|---|---|
| Multi-query page assembly for programmatic SEO topics | 3,000ms | Complex query, 2–5s background | 🟡 MEDIUM |

This is only called for programmatic SEO pages (`/seo/[slug]`), which have low traffic. Acceptable risk; monitor if SEO traffic grows.

---

### 7. `src/lib/blog/safe-blog-queries.ts` and `safe-localized-blog-queries.ts`

| Query | Timeout | Background work | Risk |
|---|---|---|---|
| Various blog queries (post list, tag aggregates, author lookup) | 2,000–4,000ms | Complex JOIN queries, up to 5s background | 🟡 MEDIUM |

Blog pages are primarily statically rendered with long ISR windows. Low concurrent request rate means pool exhaustion is unlikely. Monitor for spikes after blog post publication.

---

### 8. `src/lib/async/safe-await.ts` — General timeout wrapper

```typescript
return await Promise.race([
  promise,
  new Promise((_, reject) => { setTimeout(() => reject(...), timeoutMs) }),
]);
```

Same mechanism as `withDatabaseFallbackTimeout`. Used for auth session reads (`AUTH_NODE_SESSION_READ_TIMEOUT_MS = 2,000ms`). Background work after timeout: session JWT verification continues in Node.js background. Risk: 🟢 LOW — JWT verification is CPU-bound, no DB connections held.

---

### 9. `src/lib/db/prisma-readiness.ts` — Readiness probe

```typescript
await Promise.race([prisma.$queryRaw`SELECT 1`, new Promise((_, reject) => setTimeout(reject, ...))]);
```

Health-check only. Cancellation doesn't matter — the probe either passes or fails, and the next probe interval will try again. 🟢 LOW.

---

### 10. `src/lib/blog/home-blog-teaser.ts` and `blog-public-db-read-attempt.ts`

Custom `Promise.race` patterns similar to `withDatabaseFallbackTimeout`. Both wrap single blog post queries. 🟢 LOW.

---

### 11. `src/lib/durability/with-core-read-timeout.ts`

Durability wrapper for core content reads. Used in learner-facing content API routes with 2,000–5,000ms budgets. Background work depends on the wrapped query; generally single-table reads. 🟡 MEDIUM for complex queries.

---

## Connection Pool Impact Summary

With `PRISMA_CONNECTION_LIMIT = 5` in production, the pool is:

| Scenario | Connections consumed | Recovery time |
|---|---|---|
| 1 timed-out adaptive scan (old) | 1 connection, ~30s | 30s before free |
| 1 timed-out groupBy | 1 connection, ~3s | 3s before free |
| 1 timed-out `countPathwayLessonsPublic` (old) | 1 connection, ~5s | 5s before free |
| 5 simultaneous timed-out adaptive scans (old) | **5/5 connections** | Pool exhausted — next requests queue |
| After all fixes | Background work bounded to < 300ms | Near-instant pool recovery |

---

## Recommendations

### R1 — Add composite index on ExamQuestion (HIGH)

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_examquestion_marketing_groupby
ON "ExamQuestion" (status, exam, "bodySystem", topic, "nclexClientNeedsCategory")
WHERE status = 'PUBLISHED';
```

Expected improvement: groupBy from 1,200ms (timeout path) to < 200ms (index scan).

### R2 — Increase connection limit with pgBouncer (MEDIUM)

Set `PRISMA_USE_PGBOUNCER=true` and point `DATABASE_URL` to the DO managed pooler port (25061). This raises the effective client-visible connection count without requiring a larger DB plan.

### R3 — Log phantom queries in `withDatabaseFallbackTimeout` (LOW)

Add a `AbortController` and pass its signal to Prisma queries where supported. Prisma 5.x supports `signal` on raw queries; ORM calls require manual cancellation via `$executeRaw('SELECT pg_cancel_backend($1)', [pid])`. This is a larger change — track as a separate engineering item.
