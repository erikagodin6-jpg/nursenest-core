# Scale To 5,000 Roadmap

Generated: 2026-06-02

## Must Fix Before 100 Users

| Item | Risk | Effort | Impact | Recommended solution |
| --- | --- | --- | --- | --- |
| Minimum two web instances | Single instance unhealthy-upstream events. | Low | High | Set min instances to 2. |
| DB connection pool limits | Prisma pools can exhaust small Postgres. | Medium | High | Set explicit connection limits and add PgBouncer/pooled connection strategy. |
| Flashcard zero-card/session failure telemetry | Hidden learner degradation. | Low | High | Emit session build success/failure/zero-card metrics. |
| CAT answer failure telemetry | Stalled adaptive sessions. | Low | High | Emit answer latency/failure/stalled metrics. |

## Must Fix Before 500 Users

| Item | Risk | Effort | Impact | Recommended solution |
| --- | --- | --- | --- | --- |
| Flashcard inventory precompute | Cold cache scans saturate DB. | Medium | High | Durable per-pathway/category inventory snapshots and single-flight cache fill. |
| Learner lesson progress batching | N progress queries per request. | Medium | High | One query for all visible lesson keys. |
| Lesson hub normalized snapshots | Public route cold starts expensive. | Medium | High | Precompute pathway/locale/topic hub indexes. |
| Queue notifications | Provider latency blocks checkout/user actions. | Medium | Medium | Defer email/SMS/admin notifications to retryable jobs. |

## Must Fix Before 1000 Users

| Item | Risk | Effort | Impact | Recommended solution |
| --- | --- | --- | --- | --- |
| CAT pool snapshot per session | Per-answer pool reload becomes dominant. | Medium | High | Persist compact pool snapshot and next-question state. |
| Dashboard/report card rollups | Analytics fanout grows with user activity. | Medium | High | Daily/user/topic rollup snapshots refreshed after sessions. |
| Background job throttling | Jobs compete with learners. | Medium | High | DB-health-aware worker concurrency limits. |
| Blog/sitemap static generation | Crawlers can saturate origin. | Medium | High | Snapshot sitemap and ISR/static blog pages. |

## Must Fix Before 5000 Users

| Item | Risk | Effort | Impact | Recommended solution |
| --- | --- | --- | --- | --- |
| 100k-page public CDN strategy | Origin cannot render every crawler hit dynamically. | Medium | Critical | CDN cache, ISR/static generation, sitemap snapshots. |
| Analytics event retention/partitioning | Raw activity tables grow without bound. | Medium | High | Retention policy plus rollups; archive raw old events. |
| Search/facet scaling | Flexible DB search degrades at 100x content. | Medium | Medium | Materialized facets first, external search only when DB-backed facets fail. |
| Provider/job observability | Silent revenue/content failures. | Low | High | Alerting dashboards and dead-letter review workflow. |

## Simplest Architecture That Can Work

No Kubernetes. No microservices. Keep the monolith, but make it boringly scalable:

1. CDN for public pages/assets.
2. Redis/snapshots for inventory, public counts, blog indexes, learner private reads.
3. Pooled Postgres connections and explicit Prisma limits.
4. Background workers for notifications/content/scheduler jobs.
5. Precomputed CAT/flashcard/session inputs.
6. Rollup tables for analytics/report cards.

