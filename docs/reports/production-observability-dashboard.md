# Production Observability Dashboard

**Generated:** 2026-06-01  
**Sprint:** Production Health Dashboard  
**Route:** `/admin/platform-health`  
**API:** `GET /api/admin/platform-health`

---

## What Was Built

A real-time production health dashboard wired directly into the hardened infrastructure from the Redis Resilience sprint. No external monitoring dependencies. No new production services. All data is process-local and collected in-memory.

---

## New Files

| File | Purpose |
|------|---------|
| `src/app/(admin)/admin/platform-health/page.tsx` | Dashboard page — all five phases rendered server-side |
| `src/app/api/admin/platform-health/route.ts` | JSON API endpoint for the same data |

## Modified Files (stats exposed)

| File | Change |
|------|--------|
| `src/lib/server/credentials-login-rate-limit.ts` | Added `getFallbackLimiterStats()` + event counter |
| `src/lib/cache/memory-cache.ts` | Added `getMemoryCacheStats()` with hit/miss/eviction counters |

---

## Phase 1 — Redis Health

**Location on page:** Left column, top card  
**Data source:** `getRedisHealthSnapshot()` from `src/lib/server/redis.ts`

Surfaces:
- **Current state** — one of `reachable | unavailable | misconfigured | unreachable | unchecked` with color-coded dot
- **Last health check** — ISO timestamp of last ping attempt
- **Content cache client state** — secondary `redis-content-cache.ts` client health (reactive from first real call)
- **Rate limit fallback active** — boolean derived from fallback event counter
- **State reference table** — inline legend explaining each state

States and their visual treatment:

| State | Color | Meaning |
|-------|-------|---------|
| `reachable` | Green | Ping succeeded — Redis is writing and reading |
| `unavailable` | Gray | Env vars not set — Redis not provisioned (expected) |
| `misconfigured` | Red | Credentials present but malformed URL or missing token |
| `unreachable` | Red | Valid credentials, but connection failed |
| `unchecked` | Gray | Process just started, ping still pending |

---

## Phase 2 — Rate Limiting

**Location on page:** Right column, top card  
**Data source:** `getFallbackLimiterStats()` from `src/lib/server/credentials-login-rate-limit.ts`

Stat cards:
- **Fallback events** — total activations since process start (yellow when > 0)
- **Active buckets** — current in-process rate-limit Map size vs capacity
- **Limit ratio** — fallback ceiling as % of the Redis limit (default 60%)

Detail rows:
- Fallback active: Yes / No
- Last activation timestamp
- Bucket usage: current / capacity (yellow when > 80%)

Inline explanation distinguishes Redis-backed (distributed) from in-process fallback (per-instance) mode.

---

## Phase 3 — Memory Cache

**Location on page:** Left column, bottom card  
**Data source:** `getMemoryCacheStats()` from `src/lib/cache/memory-cache.ts`

Stat cards:
- **Entries** — current store size vs 256-entry cap (yellow when > 80% full)
- **Hit rate** — `hits / (hits + misses)` since process start
- **Evictions** — total LRU or TTL-expiry evictions since start

Detail rows:
- Raw hit count
- Raw miss count
- Size vs capacity

---

## Phase 4 — Platform Health

**Location on page:** Full-width status strip + right column database card  

### Status strip

Single-row summary showing:
- **Overall badge** — `Healthy` (green), `Degraded` (amber), `Critical` (red)
- Redis state inline
- Rate limit fallback state inline
- Database state with latency inline

Overall status derivation:
- `critical` — any alert with `level: "critical"` present
- `degraded` — any alert with `level: "warning"` present  
- `healthy` — no alerts

### Database card

- `DATABASE_URL configured`: Yes / No
- Reachable: Yes / No
- Probe latency in ms (yellow > 2 s, red on failure)
- Error message if unreachable

Database readiness probe: `checkDatabaseReadiness()` with 3.5 s hard timeout, same as the system status probe.

---

## Phase 5 — Alert Banners

**Location on page:** Above the status strip, below the page header  

Banners render only when there are active alerts. Each banner shows:
- Severity level (Critical / Warning) + alert code
- Human-readable message with actionable context

### Alert codes and trigger conditions

| Code | Level | Triggers when |
|------|-------|--------------|
| `REDIS_UNAVAILABLE` | Warning | `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` both absent |
| `REDIS_MISCONFIGURED` | Critical | Either credential present but URL fails `new URL()` parse or token missing |
| `REDIS_UNREACHABLE` | Critical | Credentials valid but background ping failed |
| `RL_FALLBACK_ACTIVE` | Warning | `fallbackEventCount > 0` since process start |
| `DB_URL_MISSING` | Critical | `isDatabaseUrlConfigured()` returns false |
| `DB_UNREACHABLE` | Critical | Readiness probe throws or returns `ok: false` |
| `DB_SLOW` | Warning | Probe latency > 2,000 ms |

---

## API Endpoint

`GET /api/admin/platform-health`

Response shape:

```json
{
  "ok": true,
  "checkedAt": "2026-06-01T22:00:00.000Z",
  "overall": "healthy | degraded | critical",
  "alerts": [
    { "level": "warning | critical", "code": "REDIS_UNAVAILABLE", "message": "..." }
  ],
  "redis": {
    "primaryClient": { "state": "reachable", "checkedAt": 1748823600000 },
    "contentCacheClient": "reachable",
    "rateLimitFallbackActive": false
  },
  "rateLimit": {
    "active": false,
    "bucketCount": 0,
    "bucketCapacity": 2000,
    "eventCountSinceStart": 0,
    "lastActivatedAt": null,
    "limitRatio": 0.6
  },
  "memoryCache": {
    "size": 2,
    "maxSize": 256,
    "hits": 14,
    "misses": 2,
    "evictions": 0,
    "hitRate": "87.5%"
  },
  "database": {
    "urlConfigured": true,
    "reachable": true,
    "latencyMs": 42,
    "error": null
  }
}
```

Auth: admin session required (same guard as all `/api/admin/*` routes).  
Cache: `no-store, no-cache, must-revalidate` — always fresh.

---

## Success Criteria Check

| Criterion | Status |
|-----------|--------|
| Infrastructure status visible without logs | ✅ Full dashboard at `/admin/platform-health` |
| Admin can detect degraded services immediately | ✅ Alert banners render at top of page on any non-healthy condition |
| No additional production dependencies | ✅ All data is process-local; no new services, no new env vars required |
| No impact on learner-facing performance | ✅ Dashboard is admin-only, server-rendered at load time; no hooks into learner paths |

---

## Navigation

The page is at `/admin/platform-health`. Add it to the admin nav sidebar by inserting a link in the admin layout navigation file. It sits naturally alongside `/admin/reliability` and `/admin/diagnostics`.
