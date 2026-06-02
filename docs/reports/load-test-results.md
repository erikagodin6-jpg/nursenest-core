# Load Test Results
**Date:** 2026-06-01  
**Method:** Architecture-based capacity analysis + k6 script review (live run requires k6 + running server)  
**k6 Scripts:** `tests/load/learner-concurrent-sessions.k6.js`, `tests/load/public-traffic-spike.k6.js`

---

## Infrastructure Baseline

| Component | Specification |
|---|---|
| Application | Next.js 16.2.6, App Router, ISR |
| Hosting | DigitalOcean App Platform / Railway |
| Database | DigitalOcean Managed Postgres |
| DB Connection | Direct (no PgBouncer) |
| Redis | Upstash REST (used for content cache) |
| CDN/Edge | Cloudflare (ISR-cached marketing routes) |
| Instance count | 1–3 (depending on plan) |
| Instance memory | ~512MB–1GB per instance |
| Node.js workers | 1 (Next.js default) |

---

## Public Traffic (Unauthenticated) — ISR-Cached Routes

Marketing pages (`/`, `/rn`, `/blog`, `/pricing`, `/lessons`) are ISR-cached with 300–3600s windows. Under public load, the server primarily serves CDN cache hits.

### Theoretical Public Capacity

| Load | Expected Behavior | CDN Hit Rate | p95 TTFB |
|---|---|---|---|
| 25 concurrent | CDN serves; server < 5 req/s | ~95% | < 100ms |
| 100 concurrent | CDN serves; server ~10–20 req/s revalidation | ~90% | < 200ms |
| 500 concurrent | CDN serves; server ~50 req/s | ~88% | < 500ms |
| 1000 concurrent | CDN serves; server ~100 req/s | ~85% | < 1000ms |

**Constraint for public traffic:** CDN cache efficiency. With 3600s ISR on lesson/practice hubs, a single origin request per hour per route is typical. Public traffic is **not the bottleneck**.

---

## Authenticated Learner Traffic — Live DB Queries

Each authenticated learner generates:
- 1 session validation per request (~5ms, cached 60s in entitlement layer)
- 3–6 Prisma queries per page load (after Phase 3 optimizations)
- 1–3 Redis reads per page load
- 0–2 Stripe API calls (only on checkout)

### Learner Concurrency Analysis

#### 25 Concurrent Learners

| Metric | Expected | Risk |
|---|---|---|
| Active DB connections | ~10–15 | ✅ Safe (under 25 max) |
| p50 response | ~150–250ms | ✅ |
| p95 response | ~400–600ms | ✅ |
| p99 response | ~800–1200ms | ✅ |
| Error rate | < 0.1% | ✅ |
| Memory (per instance) | ~300–400MB | ✅ |
| CPU utilization | ~15–25% | ✅ |
| **Status** | **Fully supported** | ✅ |

#### 50 Concurrent Learners

| Metric | Expected | Risk |
|---|---|---|
| Active DB connections | ~18–25 | ⚠️ Near limit |
| p50 response | ~200–350ms | ✅ |
| p95 response | ~600–900ms | ⚠️ Approaching budget |
| p99 response | ~1200–2000ms | ⚠️ |
| Error rate | < 1% | ✅ |
| Connection wait events | ~5–15% of requests | ⚠️ |
| **Status** | **Supported with caveats** | ⚠️ Fix connection pool first |

#### 100 Concurrent Learners

| Metric | Expected | Risk |
|---|---|---|
| Active DB connections | ~30–40 (EXCEEDS 25 max) | ❌ Connection exhaustion |
| p50 response | ~400–700ms | ⚠️ |
| p95 response | ~1500–3000ms | ❌ Exceeds budget |
| p99 response | ~5000ms+ | ❌ |
| Error rate | ~5–15% (connection refused) | ❌ |
| **Status** | **Fails without connection pool fix** | ❌ |

#### 250 Concurrent Learners

| Metric | Expected | Risk |
|---|---|---|
| Active DB connections | Maxed — all requests queue | ❌ |
| p95 response | > 5000ms | ❌ |
| Error rate | ~30–50% | ❌ |
| **Status** | **Not supported** | ❌ |

---

## Bottleneck Waterfall

```
25 users   → ✅  System healthy. DB connections < 25.
50 users   → ⚠️  Connection pool near limit. Some p99 degradation.
100 users  → ❌  DB connection exhaustion. ECONNREFUSED errors.
250 users  → ❌  Full outage on authenticated routes.
```

**First bottleneck:** Postgres connection pool (not CPU, not memory, not Redis, not Next.js).

---

## Load Test Script Design Review

### `learner-concurrent-sessions.k6.js`

```javascript
stages: [
  { duration: '2m', target: 100 },   // Ramp to 100
  { duration: '5m', target: 500 },   // Peak 500
  { duration: '2m', target: 100 },   // Ramp down
]
thresholds:
  http_req_duration: ['p(95)<1000']
  session_load_time: ['p(95)<500']
```

**Assessment:** Targets are aspirational. At 100 concurrent authenticated learners, the current architecture will fail due to DB connections before k6 thresholds matter. **The test will expose this within the first 2-minute ramp.**

### `public-traffic-spike.k6.js`

```javascript
stages: [
  { duration: '1m', target: 50 },
  { duration: '2m', target: 500 },
  { duration: '3m', target: 1000 },
]
thresholds:
  p(95)<500ms, cache_hits>80%
```

**Assessment:** Public traffic spike test will **pass** at these thresholds because ISR + CDN handles public routes efficiently. The cache hit rate will exceed 80%.

---

## CPU and Memory Projections

| Concurrent Users | CPU (per instance) | Memory (per instance) | DB Connections |
|---|---|---|---|
| 25 | ~20% | ~350MB | ~12 |
| 50 | ~40% | ~450MB | ~22 |
| 100 | ~70% | ~600MB | ~35 (OVER LIMIT) |
| 250 | N/A (DB blocked) | N/A | Saturated |

---

## Required Fix Before Any Load Testing

Add to `DATABASE_URL` in all environments:

```
?connection_limit=5&pool_timeout=10
```

With 5 connections per instance:
- 1 instance:  5 connections  (25 users safe)
- 3 instances: 15 connections (100 users safe)
- 5 instances: 25 connections (200–250 users viable)

**This is a 1-line fix** that unlocks horizontal scaling.

---

## Estimated Results After Connection Pool Fix

| Concurrent Users | p50 | p95 | p99 | Error Rate | Status |
|---|---|---|---|---|---|
| 25 | 150ms | 400ms | 800ms | < 0.1% | ✅ |
| 100 | 200ms | 600ms | 1200ms | < 0.5% | ✅ |
| 250 | 300ms | 900ms | 2000ms | < 2% | ✅ (with 3+ instances) |
| 500 | 500ms | 1500ms | 3000ms | < 5% | ⚠️ (needs PgBouncer) |
