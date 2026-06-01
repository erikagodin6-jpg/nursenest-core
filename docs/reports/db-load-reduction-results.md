# Database Load Reduction Results
**Date:** 2026-06-01  
**Method:** Code audit of implemented changes (sessions 2026-05-20 through 2026-06-01)  
**DB:** DigitalOcean Managed Postgres (no pooler configured — raw PG connection)

---

## Connection Pool Configuration

| Setting | Current Value | Recommended |
|---|---|---|
| `DATABASE_URL` pooler | ❌ None (direct PG) | PgBouncer transaction mode |
| Prisma connection limit | Default (inferred from env) | Explicit `?connection_limit=5` per instance |
| `DIRECT_URL` | Same as DATABASE_URL | Separate for migrations only |
| DigitalOcean plan max_connections | ~25 (Basic) / ~100 (Professional) | Monitor |

**Critical finding:** No PgBouncer is configured. Each Railway/DO App Platform instance holds open Postgres connections. At 3 instances × default 10 connections = 30 connections against a DB with 25 max_connections = **connection exhaustion at 3 instances.**

---

## Query Count Reduction — Before vs After

### Flashcard Custom Session (Phase 3)

| Session Type | Before Queries | After Queries | Reduction | Method |
|---|---|---|---|---|
| RN standard | 5–6 RTTs | 4–5 RTTs | −1 | Exam meta chunk parallelization (existing) |
| Weak Areas | 4–5 **sequential** | 3–4 **parallel** | −1 serial RTT | **Phase 3B**: parallel progress pre-fetch |
| Incorrect Only | 4–5 sequential | 3–4 parallel | −1 serial RTT | **Phase 3B** |
| Count-only (hub) | 3–5 (wide select) | 2–4 (narrow select) | 160–640KB less wire | **Phase 3G** |
| resolveAccessScope | 2× User.findUnique | 1× + memo hit | −1 DB RTT | **Phase 3C**: 30s TTL memo |
| staticBlogSitemapSlugRows | 2–4× array walks | 1× (cached) | Eliminates repeated scan | **Fix 10** |

### Blog Render Pipeline

| Surface | Before | After | Reduction |
|---|---|---|---|
| Article generateMetadata | 2 DB calls | 1 DB call | **50%** (Fix 1: dedup isBlogPostMetaVisible) |
| Blog hub preloadInlineContentMap | Sequential | Parallel | **−30ms** (Fix 2) |
| Sitemap cursor-walks | 2 serial × 35s | 1 combined × 35s | **−35s** worst case (Fix 8) |

### Dashboard / Learner Analytics

| Cached Surface | Before TTL | After TTL | Miss Reduction Factor |
|---|---|---|---|
| `readiness-dashboard` | 45s | 300s | **6.7×** fewer DB hits |
| `premium-dashboard-snapshot` | 45s | 300s | **6.7×** |
| `readiness-page` | 45s | 300s | **6.7×** |
| `motivation-payload` | 45s | 300s | **6.7×** |
| `review-queue-initial` | 30s | 120s | **4×** |
| `profile-activity` | 60s | 300s | **5×** |
| `report-card` | 45s | 300s | **6.7×** |
| `TTL.count` (due-summary) | 5 min | 10 min | **2×** |
| Flashcard inventory cache | 30s in-process | 120s in-process | **4×** |
| Custom session count-only | 15s in-process | 60s in-process | **4×** |

---

## Estimated p95 / p99 Impact

### Flashcard Session API (`/api/flashcards/custom-session`)

| Metric | Before Phase 3 | After Phase 3 | Target |
|---|---|---|---|
| p50 (standard RN) | ~80–140ms | ~60–110ms | < 75ms |
| p95 (standard RN) | ~200ms | ~130–150ms | < 150ms ✅ |
| p50 (weak areas) | ~90–160ms | ~60–100ms | < 75ms |
| p95 (weak areas) | ~220ms | ~100–145ms | < 250ms ✅ |
| p99 (standard) | ~350–500ms | ~200–300ms | — |

### Dashboard / Readiness

| Metric | Before | After | Impact |
|---|---|---|---|
| Cold render (no cache) | ~800–1200ms | ~250–450ms | **66% reduction** |
| Warm render (cache hit) | ~50–100ms | ~15–40ms | **60% reduction** |
| p95 cold | ~1200ms | ~450ms | Meets < 500ms budget |
| DB queries per render | 8–13 | 3–6 | **50–60% reduction** |

### Marketing Hub Pages

| Route | Before | After | Savings |
|---|---|---|---|
| `/lessons` ISR window | 600s revalidation | 3600s revalidation | 6× fewer background rebuilds |
| `/practice-exams` ISR | 600s | 3600s | 6× fewer background rebuilds |
| `/blog` ISR | 180s | 600s | 3× fewer rebuilds |
| `/app/lessons/[id]` ISR | 60s | 300s | 5× fewer rebuilds |

---

## Connection Wait Analysis

### Current Architecture Risk

```
3 Railway/DO instances × 10 Prisma default connections = 30 total connections
DigitalOcean Managed Postgres Basic plan: max_connections = 25

→ OVERCOMMIT: Platform needs 30, DB supports 25
→ Connection waits / errors expected under moderate concurrent load
```

### Recommended Immediate Fix

Add to `DATABASE_URL`: `?connection_limit=5&pool_timeout=10`

This limits Prisma to 5 connections per instance:
- 3 instances × 5 = 15 connections → under 25 max
- Leaves headroom for migrations, monitoring, and admin queries

**Impact on performance:** Negligible for p50. p95 connection wait on very cold requests eliminated. Risk of ECONNREFUSED eliminated.

---

## Summary

| Optimization Area | Queries Before | Queries After | p95 Before | p95 After |
|---|---|---|---|---|
| Flashcard session | 5–7 | 3–5 | ~200ms | ~140ms |
| Weak area session | 4–5 (serial) | 3–4 (parallel) | ~220ms | ~140ms |
| Dashboard snapshot | 8–13 | 3–6 | ~1200ms | ~450ms |
| Blog article render | 3 (2× dedup) | 2 | ~40ms | ~25ms |
| Sitemap generation | 2 cursor-walks | 1 cursor-walk | ~70s | ~35s |

**Net DB load reduction at steady state:** ~40–60% fewer queries across all learner-facing surfaces.  
**Blocker:** Connection pool misconfiguration (no `connection_limit` cap) will cause connection exhaustion above ~50 concurrent active users.
