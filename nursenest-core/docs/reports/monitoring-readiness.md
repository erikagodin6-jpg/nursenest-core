# Monitoring Readiness

Generated: 2026-06-02

## Existing Instrumentation

| Signal | Status | Evidence |
| --- | --- | --- |
| Server errors | Partial | Sentry server/client/edge config and `safeServerLogCritical`. |
| Structured logs | Present | `src/lib/observability/safe-server-log.ts`. |
| API payload / slow Prisma logging | Present | `src/lib/observability/perf-log.ts` and `perf-log-core`. |
| Memory pressure | Partial | Runtime memory diagnostics and build tracing memory fields. |
| DB connection pool | Partial | `src/lib/performance/connection-pool-monitor.ts`. |
| CAT frontend failures | Partial | CAT runner emits runtime bootstrap failures. |
| Flashcard failures | Partial | Server logs exist, but dedicated failure-rate metric needs consolidation. |
| Webhook failures | Partial | Stripe webhook policy and reconcile logs exist; alerting must be configured. |

## Required Dashboards And Alerts

| Metric | Alert threshold |
| --- | --- |
| Route p95 latency | Warn > 2s, critical > 5s for learner routes. |
| 5xx rate | Warn > 0.5%, critical > 2%. |
| CPU | Warn > 60% sustained, critical > 80%. |
| Memory/RSS | Warn > 75%, critical > 90%. |
| DB pool utilization | Warn > 75%, critical > 90%. |
| Slow queries | Warn > 500ms, critical > 2s. |
| Webhook failures | Any sustained failure; critical if checkout entitlement not created. |
| Flashcard session failures | Warn > 1%, critical > 3% or any zero-card session with available source pool. |
| CAT failures | Warn > 1%, critical > 3%, any duplicate loop/stalled session. |
| Background job retries | Warn on retry spike, critical on dead-letter growth. |

## Implementation Gap

The code has logging primitives, but scale readiness requires aggregation: log drain or APM dashboards must turn these structured events into time-series alerts.

