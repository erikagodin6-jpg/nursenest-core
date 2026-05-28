# NurseNest Resilience Architecture — Monitoring Plan

> **Status:** Planning document — pre-implementation
> **Generated:** 2026-05-28

---

## 1. Existing Observability (Already In Place)

The codebase already emits structured events for failover. This plan extends — not replaces — existing telemetry.

| Signal | Channel | Event Name |
|---|---|---|
| Flashcard failover | PostHog + server logs | `critical_study_load_diagnostics` |
| API route timing | PostHog | `runWithApiTelemetry` wrapper |
| DB errors | Sentry | `captureException` |
| Large responses | Server logs | `logLargeApiResponse` |
| Startup diagnostics | Server logs | `startup_diagnostics` |

---

## 2. New Telemetry Events

### Redis Cache Events

Emitted by `src/lib/cache/redis-content-cache.ts`:

```typescript
// PostHog event: nn_cache_operation
{
  operation: "get" | "set" | "del",
  result: "hit" | "miss" | "error" | "skipped",
  surface: "flashcards" | "lessons" | "questions" | "cat_pool",
  key_prefix: "nn:fc:" | "nn:lesson:" | "nn:practice:" | "nn:cat:",
  latency_ms: number,
  ttl_seconds: number | null
}
```

### Snapshot Load Events

Extends existing `critical_study_load_diagnostics`:

```typescript
{
  event: "critical_study_load_diagnostics",
  surface: string,                    // flashcards_subscriber_list | lessons_hub | questions_pack | cat_pool
  source_used: "primary" | "cache" | "secondary" | "none",
  failover_reason: string | null,
  snapshot_version: string | null,
  snapshot_age_ms: number | null,
  cache_hit: boolean,
  final_outcome: "live" | "cached" | "degraded_snapshot" | "error"
}
```

### CAT Resilience Mode Events

```typescript
// PostHog event: nn_cat_resilience_mode
{
  event: "nn_cat_resilience_mode",
  reason: "engine_error" | "db_unavailable" | "session_loss",
  pool_id: string,           // "rn-pool-a"
  pathway: string,
  user_id_prefix: string     // first 8 chars only
}
```

### Offline Study Events

```typescript
// PostHog event: nn_offline_study
{
  event: "nn_offline_study",
  action: "session_started" | "answer_queued" | "sync_success" | "sync_failed",
  queue_depth: number,
  records_synced: number | null,
  retry_count: number | null
}
```

### Snapshot Generation Events

```typescript
// Server log: nn_snapshot_generation
{
  event: "nn_snapshot_generation",
  surface: string,
  status: "started" | "complete" | "failed",
  record_count: number,
  duration_ms: number,
  file_path: string,
  snapshot_version: string,
  error: string | null
}
```

---

## 3. Metrics to Track

### Layer 1 — Database Health

| Metric | How | Alert Threshold |
|---|---|---|
| DB query success rate | Count `final_outcome: live` vs total | < 99.5% over 5min |
| DB query P95 latency | `runWithApiTelemetry` timing | > 2000ms |
| Retry trigger rate | Count `withRetry()` retries | > 5% of requests |
| Prisma timeout count | `P2024` error code events | > 10/min |

### Layer 2 — Redis Cache Health

| Metric | How | Alert Threshold |
|---|---|---|
| Cache hit rate (per surface) | `nn_cache_operation` hit vs total | < 50% (warm cache expected) |
| Cache latency P95 | `latency_ms` in cache events | > 100ms |
| Cache error rate | `result: error` events | > 1% |
| Cache miss spike | Sudden drop in hit rate | > 20% drop in 5min window |

### Layer 3 — Snapshot Health

| Metric | How | Alert Threshold |
|---|---|---|
| Snapshot age (per surface) | `snapshot_age_ms` in failover events | > 26h (missed nightly run) |
| Snapshot usage rate | Count `source_used: secondary` | > 0.1% of requests (investigate) |
| Snapshot generation success | `nn_snapshot_generation` status | Any `failed` status |
| Snapshot file count | Verify expected files exist after cron | Missing any required surface |

### CAT Resilience Mode

| Metric | How | Alert Threshold |
|---|---|---|
| Resilience mode activation rate | `nn_cat_resilience_mode` count | Any activation (investigate) |
| Pool usage distribution | Count by `pool_id` | Skew > 80% to one pool |

### Offline / Sync

| Metric | How | Alert Threshold |
|---|---|---|
| Offline sessions | `nn_offline_study action:session_started` | Trend (no alert) |
| Sync failure rate | `action:sync_failed` / total syncs | > 5% |
| Queue depth at sync | `queue_depth` distribution | P95 > 50 records |

---

## 4. Admin Resilience Dashboard

**Location:** `/admin/resilience`

**Access:** Admin tier only (same gate as existing admin routes)

### Dashboard Sections

#### Section 1 — System Health Overview

```
┌──────────────────────────────────────────────────────────────┐
│  RESILIENCE HEALTH OVERVIEW              Last 24h            │
│                                                              │
│  Database    ████████████████████ 99.8%  ✅ Healthy          │
│  Redis Cache ████████████████░░░░ 82.1%  ✅ Normal           │
│  Snapshots   ████████████████████ 100%   ✅ Fresh (2h ago)   │
│  CAT Engine  ████████████████████ 100%   ✅ No resilience mode│
│  Offline Sync████████████████░░░░ 94.3%  ✅ Normal           │
└──────────────────────────────────────────────────────────────┘
```

#### Section 2 — Failover Activity

Table: last 100 failover events
- Surface, reason, snapshot age, user count affected, timestamp

#### Section 3 — Cache Performance

Per-surface cache hit rates (sparklines), avg latency, error rate

#### Section 4 — Snapshot Status

| Surface | Last Generated | Age | Record Count | Status |
|---|---|---|---|---|
| flashcards/subscriber | 2026-05-28 02:01 | 5h | 1,204 | ✅ |
| lessons/rn/hub | 2026-05-28 02:02 | 5h | 87 | ✅ |
| questions/rn/* | 2026-05-28 02:15 | 5h | 2,340 | ✅ |
| cat/rn-pool-a | 2026-05-28 02:30 | 5h | 130 | ✅ |

#### Section 5 — Offline Activity

- Offline sessions (last 7 days sparkline)
- Sync queue depth histogram
- Sync success/failure rates

---

## 5. Alerting Configuration

### Critical Alerts (PagerDuty / immediate)

- DB success rate < 95% for 2 consecutive minutes
- Snapshot age > 48 hours for any critical surface
- Any CAT resilience mode activation

### Warning Alerts (Slack / next business hour)

- DB success rate < 99.5% for 5 minutes
- Redis cache error rate > 1%
- Snapshot generation failed (any surface)
- Offline sync failure rate > 5%

### Informational (Dashboard only)

- Cache hit rate by surface (trend)
- Offline session count (trend)
- Failover usage (trend — expect near-zero)

---

## 6. Monitoring Implementation

### PostHog Dashboards

Create two PostHog saved queries:

1. **Resilience Health** — funnel of `source_used` (live → cache → snapshot → error) over time
2. **CAT Resilience Mode** — count of `nn_cat_resilience_mode` events by day

### Server-Side Counter Store

`src/lib/resilience/resilience-metrics.ts` maintains in-process counters:

```typescript
interface ResilienceCounters {
  cacheHits: Record<string, number>;        // by surface
  cacheMisses: Record<string, number>;      // by surface
  snapshotLoads: Record<string, number>;    // by surface
  catResilienceActivations: number;
  offlineSyncsSuccess: number;
  offlineSyncsFailed: number;
  lastSnapshotGeneratedAt: Record<string, number>; // by surface → epoch ms
}
```

These counters are exposed via `GET /api/admin/resilience-metrics` (admin auth required) and consumed by the dashboard.

### Existing Signal Reuse

The existing `critical_study_load_diagnostics` events already provide:
- `source_used` (primary / secondary / none)
- `snapshot_age_ms`
- `failover_reason`

The admin dashboard aggregates these PostHog events — no additional instrumentation needed for the failover tracking column.
