# Redis Runtime Verification

**Generated:** 2026-06-01  
**Method:** Codebase analysis — credential inspection, client tracing, fallback path audit, cache surface mapping

---

## Verdict

**Redis is not configured locally. Production status is unknown but architecturally optional.**  
The application is designed to run without Redis — all cache operations silently no-op when credentials are absent, and every surface falls back to Next.js RSC cache, direct DB queries, or in-process memory maps.

The dashboard, study plan, and analytics surfaces **do not use Redis at all** — they are cached by Next.js's `unstable_cache`, which is process-local and unrelated to Upstash.

---

## 1. Credentials

### Local environment (`nursenest-core/.env.local`)
```
UPSTASH_REDIS_REST_URL=    ← empty
UPSTASH_REDIS_REST_TOKEN=  ← empty
```

**Redis is not configured in the local dev environment.** Both values are empty strings. Every Redis call in local development is a transparent no-op.

### Production environment (DigitalOcean / Railway)
Not directly readable from this repo. The deploy preflight (`scripts/deploy-preflight.mjs`) does NOT check for `UPSTASH_REDIS_REST_URL` or `UPSTASH_REDIS_REST_TOKEN` — they are not in the required env list. The startup diagnostics (`operational-startup-diagnostics.ts`) report `redisOrKvEnvPresent` as an informational boolean only, not a failure signal.

**Inference:** Redis may be set in production, or it may not be. The architecture does not require it. Verifying requires checking the DigitalOcean app spec or Railway service variables directly.

---

## 2. Redis Client Architecture

Two independent Redis client implementations coexist:

### Client A — `src/lib/server/redis.ts` (primary)
Uses `@upstash/redis` SDK.

```typescript
function createRedisClient(): RedisJsonClient | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;          // ← returns null when unconfigured
  return new Redis({ url, token });
}
```

**Null when unconfigured.** Every downstream function checks for null before calling:
```typescript
export async function cacheGet<T>(cacheKey: string): Promise<T | null> {
  const r = getRedisClient();
  if (!r) return null;                      // ← silent miss
  ...
}

export async function cacheSet<T>(...): Promise<void> {
  const r = getRedisClient();
  if (!r) return;                           // ← silent no-op
  ...
}
```

### Client B — `src/lib/cache/redis-content-cache.ts` (secondary)
Uses raw HTTP `fetch` for Upstash REST, or the `redis` TCP package as fallback.

```typescript
export function isCacheConfigured(): boolean {
  const hasUpstash = Boolean(process.env.UPSTASH_REDIS_REST_URL?.trim());
  const hasTcp    = Boolean(process.env.REDIS_URL?.trim());
  return hasUpstash || hasTcp;
}
```

This client is used by **`src/lib/server/manifest-loader.ts`** for the three-layer content loader (Redis → snapshot → live DB). It reads the same env vars as Client A.

**Client B also checks for `REDIS_URL`** — if a TCP Redis is set (Railway Redis, etc.) it will use that even without Upstash credentials.

---

## 3. Application Connection

When `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are both set, connection is lazy — no connection test at startup. The `@upstash/redis` client makes an HTTP request on first use.

**Connection test is NOT performed at boot.** There is no ping/health-check on startup. A misconfigured Redis URL would silently fail on first use and return `null` from `cacheGet`, causing transparent fallback to DB.

**Operational startup diagnostics** (`operational-startup-diagnostics.ts`) reports only whether the env var is present, not whether the connection succeeds:
```typescript
redisOrKvEnvPresent: Boolean(process.env.UPSTASH_REDIS_REST_URL?.trim()) || ...
```

---

## 4. Cache Write Verification

These Redis write paths are wired in application code:

| Cache | Write function | Triggered by | TTL |
|-------|---------------|-------------|-----|
| Practice session recovery | `setPracticeSessionRecovery` | `POST /api/practice-tests` | 20 min |
| CAT pool | `setCatPool` | `cat-pool.ts` on first pool build | 30 min |
| CAT readiness | `setCatReadiness` | `cat-practice-readiness.ts` | 10 min |
| Flashcard hub inventory | `setFlashcardHubInventory` | `build-flashcard-custom-session.ts` (async, fire-and-forget) | 30 min |
| Flashcard session recovery | `setFlashcardRecoverySession` | `self-healing-flashcard-session-cache.ts` | 15 min |
| Flashcard bank pool | `setFlashcardBank` | `build-flashcard-custom-session.ts` | 60 min |
| Lesson manifest | `setLessonManifest` | `app-subscriber-lesson-detail-resolve.ts` (async) | 60 min |
| Flashcard due summary | `setFlashcardDueSummary` | SRS queue loader | 10 min |
| Reliability counters | `incrementReliabilityCounter` | `app-subscriber-lesson-detail-resolve.ts`, `self-healing-flashcard-session-cache.ts` | 8 days |
| Manifest loader entries | `cacheSet` via `loadWithManifest` | On snapshot or live DB read | 60 min |
| Rate limit counters | `INCR` + `expire` | `credentials-login-rate-limit.ts` | Per window |

**All writes are fire-and-forget or guarded with `if (!r) return` — zero writes when Redis is absent.**

---

## 5. Cache Read Verification

| Cache | Read function | On Redis miss (or absent) | Fallback |
|-------|--------------|--------------------------|---------|
| Practice session recovery | `getPracticeSessionRecovery` | Re-runs question selection | DB query |
| CAT pool | `getCatPool` | Re-runs pool query | DB query |
| CAT readiness | `getCatReadiness` | Re-runs readiness scan | DB query |
| Flashcard hub inventory | `getFlashcardHubInventory` | Rebuilds via `buildFlashcardCustomSession` | DB query |
| Flashcard bank pool | `getFlashcardBank` | Re-queries DB | DB query |
| Lesson manifest | `getLessonManifest` | Reads from DB + joins | DB query |
| Manifest loader entries | `cacheGet` in manifest loader | Reads snapshot file → DB | Filesystem → DB |
| Rate limit counters | Redis `INCR` | **Fails open** (allows request) | Unprotected |
| Reliability counters | Redis `GET` | Returns 0 | `{}` (empty map) |

---

## 6. Cache Hit Rates

**Cannot be determined from this environment.** The codebase has the infrastructure to track hit rates (`src/lib/performance/cache-observability.ts`) but this data is stored in-process and emitted to structured logs — it cannot be read from the codebase.

Alert thresholds defined in the cache observability module:
```typescript
redis:    { warnRate: 0.70, criticalRate: 0.50, minSamples: 10 }
snapshot: { warnRate: 0.80, criticalRate: 0.60, minSamples: 5  }
```

If Redis is configured in production, hit rates above 70% would be the expected steady-state (content changes infrequently; TTLs are long). If hit rates fall below 50%, the alert would fire via structured log.

---

## 7. Surface-by-Surface Cache Status

### Flashcard Hub Inventory Cache

**Cache backend: Redis (when configured) → in-process no-op fallback**

Path: `GET /api/flashcards/inventory` → `loadWithManifest` (Redis → snapshot → live DB)  
Also: `buildFlashcardCustomSession` → `getFlashcardHubInventory` (Redis directly)

- Redis key: `manifest:flashcard-inv:{tier}:{country}:{pathway}:v1`
- TTL: 60 minutes (manifest loader), 30 minutes (hub inventory write)
- Without Redis: Every flashcard hub page load triggers full DB rebuild via `buildFlashcardCustomSession`
- This is the most expensive cache miss — rebuilds mergedCounts across all categories

**Status: Redis-backed when configured. Falls back to live DB on every request when absent.**

---

### Lesson Inventory Cache

**Cache backend: Redis (when configured) → snapshot file → live DB**

Path: lessons hub → `loadWithManifest` (Redis → snapshot → live DB)  
Lesson detail: `app-subscriber-lesson-detail-resolve.ts` → `getLessonManifest` → `setLessonManifest`

- Redis keys: `manifest:lessons:hub:{tier}:{country}:v1`, `content:lesson:manifest:{lessonId}`
- TTL: 60 minutes
- Reliability tier tracking: `incrementReliabilityCounter("lesson", "tier_a"|"tier_b")` — only tracked when Redis is configured
- Without Redis: Full DB join on every lesson list and lesson detail page load

**Status: Redis-backed when configured. Falls back to snapshot → live DB when absent.**

---

### Study Plan Cache

**Cache backend: Next.js `unstable_cache` (RSC data cache) — NOT Redis**

Path: `/app/study-plan` → `buildCognitionIntegratedStudyPlan` → `loadWithLearnerPrivateReadCache`

```typescript
return loadWithLearnerPrivateReadCache(
  { surface: "study-plan-summary", userId, ttlSeconds: DASHBOARD_ANALYTICS_TTL_SECONDS },
  loader,
);
// → unstable_cache(loader, [...keyParts], { revalidate: 900, tags: [...] })
```

- Cache mechanism: Next.js `unstable_cache` with 15-minute revalidation + tag-based invalidation
- This cache is **process-local, not distributed**
- TTL: 15 minutes (`DASHBOARD_ANALYTICS_TTL_SECONDS = 900`)
- Invalidated on: session completion via `revalidateTag`
- Memory impact: Stored in Next.js data cache on the server process heap

**Status: NOT Redis-backed. Uses Next.js `unstable_cache`. Unaffected by Redis presence or absence.**

---

### Dashboard Cache

**Cache backend: Next.js `unstable_cache` (RSC data cache) — NOT Redis**

Surfaces backed by `loadWithLearnerPrivateReadCache`:
- `premium-dashboard-snapshot` (15 min)
- `readiness-summary` (15 min)
- `weak-area-summary` (15 min)
- `performance-summary` (15 min)
- `readiness-page` (15 min)
- `readiness-dashboard` (15 min)
- `report-card` (15 min)
- `review-queue-initial` (15 min)
- `motivation-payload` (15 min)
- `profile-activity` (15 min)
- `benchmark-engine` (15 min)

All use `unstable_cache` with per-user tag-based invalidation. **Zero Redis involvement.**

**Status: NOT Redis-backed. Uses Next.js `unstable_cache`. Unaffected by Redis presence or absence.**

---

### Analytics Cache

**Cache backend: Next.js `unstable_cache` (RSC data cache) — NOT Redis**

Readiness and topic performance data flows through `loadWithLearnerPrivateReadCache` → `unstable_cache`.

The `cache-observability.ts` tracking counters are in-process `Map` — not stored in Redis, not persistent across restarts.

**Status: NOT Redis-backed. Uses Next.js `unstable_cache` and in-process counters.**

---

## 8. In-Memory Fallback Caches (Always Active)

These run regardless of Redis configuration:

### `src/lib/cache/memory-cache.ts`
```typescript
const store = new Map<string, Entry<unknown>>();  // ← NO max size limit
```
**Risk: Unbounded Map.** If many distinct keys are written (e.g., per-user per-pathway combinations), this grows without bound until process restart. Used by specific hot paths that bypass Redis.

### `src/lib/server/fallback-cache.ts`
```typescript
const MAX_ENTRIES = 2_000;
const store = new Map<string, unknown>();
```
Bounded at 2,000 entries (LRU-evicts oldest on overflow). Used for `learnerFallback` data after entitlement resolution.

### `self-healing-flashcard-session-cache.ts` (L1)
In-process Map for active flashcard sessions. TTL: 15 minutes. Redis is L2 when configured. Without Redis, sessions are not recoverable across process restarts or scale-out events.

---

## 9. Critical Behavior Without Redis

### Rate Limiting — Fails Open ⚠️

```typescript
if (!redis) {
  return { ok: true, remaining: opts.max };  // allow request unconditionally
}
```

**Without Redis, credential login rate limiting is disabled.** An attacker can attempt unlimited credential logins. This is the most operationally significant consequence of Redis being absent.

### Reliability Counters — Not Tracked

The admin reliability dashboard (`/admin/reliability`) shows tier A/B/C/D counts for flashcard and lesson delivery. These counts are only recorded when Redis is configured. Without Redis, the dashboard shows zeros.

### Session Recovery — Not Persistent

Flashcard and practice session recovery relies on Redis as L2. Without Redis, session recovery is limited to the in-process L1 Map — sessions are lost on deployment, restart, or scale-out.

---

## 10. Does Redis Reduce Production Memory Usage?

**The answer depends on which memory you are measuring.**

| Cache type | Memory location | Redis impact |
|-----------|----------------|-------------|
| Dashboard, study plan, analytics | Next.js process heap (`unstable_cache`) | **None** — these are not in Redis |
| Flashcard inventory, lesson manifest | Redis (when configured) | Reduces per-request DB → heap allocation |
| CAT pool, practice session | Redis (when configured) | Reduces repeated DB join → heap allocation |
| Session recovery | In-process L1 → Redis L2 | Redis reduces OOM risk on long-lived sessions |
| Rate limit counters | Redis only | Not in-process memory at all |
| `memory-cache.ts` | Always in-process | Not reduced by Redis |

**Redis primarily reduces PostgreSQL query load, not server heap memory.** The dashboard and analytics surfaces — which are the most memory-intensive per-user aggregates — are cached by Next.js `unstable_cache`, not Redis. Adding Redis would not reduce the memory footprint of those surfaces.

---

## Summary

| Credential | Status |
|-----------|--------|
| `UPSTASH_REDIS_REST_URL` | Empty (local). Production: unknown. |
| `UPSTASH_REDIS_REST_TOKEN` | Empty (local). Production: unknown. |

| Surface | Cache Backend | Redis Required? | Without Redis |
|---------|-------------|----------------|---------------|
| Flashcard hub inventory | Redis + manifest loader | No | Full DB rebuild per request |
| Lesson inventory | Redis + manifest loader | No | Snapshot → live DB |
| Lesson detail | Redis (manifest) | No | Full DB join per load |
| CAT pool | Redis | No | Full pool query per session |
| Practice session | Redis | No | Selection re-runs on recovery |
| **Study plan** | **Next.js `unstable_cache`** | **No** | **Not affected** |
| **Dashboard** | **Next.js `unstable_cache`** | **No** | **Not affected** |
| **Analytics** | **Next.js `unstable_cache`** | **No** | **Not affected** |
| Rate limiting | Redis only | **Yes (security)** | **Fails open — unprotected** |
| Reliability counters | Redis only | No | Dashboard shows zeros |
| Session recovery | In-process + Redis | No | Lost on restart/scale |

### Recommendation

If Redis is not currently set in production:
1. **Set it immediately** — the most critical reason is rate limiting. Without Redis, credential login rate limiting is disabled.
2. The content caches (flashcard inventory, lesson manifest, CAT pool) will begin working and reduce DB query volume on cache hits.
3. Dashboard and study plan performance is unaffected by Redis — those use Next.js RSC cache.
4. Fix the unbounded `memory-cache.ts` `Map` — add a max-size cap regardless of Redis status.
