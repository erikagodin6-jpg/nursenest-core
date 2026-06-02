# 5,000 User Threat Assessment

Generated: 2026-06-02

## Scope And Evidence

This is an architecture audit, not a live load certification. Evidence used:

- `docs/reports/prisma-performance-audit.md`
- `docs/reports/db-load-reduction-results.md`
- `docs/reports/digitalocean-capacity-plan.md`
- `docs/reports/scalability-certification.md`
- Source review of homepage, lessons, flashcards, practice, CAT, blog, dashboard, subscriptions, analytics, and background job paths.

## Threat Matrix

| Rank | Bottleneck | Likelihood | Impact | Estimated threshold | Evidence | Preferred mitigation |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Postgres connection pool saturation | High | Critical | 100-500 active users, earlier during crawls | Prisma fanout remains on learner lessons, flashcards, CAT, dashboard, analytics. | PgBouncer or Prisma Accelerate-compatible pooling, strict per-instance connection limits, query reduction. |
| 2 | Flashcard cold inventory/session build | High | High | 100 concurrent sessions | `build-flashcard-custom-session.ts` can scan dedicated cards up to 5,000 and hydrate question metadata. | Precomputed inventory, ID-first selection, cached session templates, async hydration. |
| 3 | CAT per-question pool reload | High | High | 100-500 concurrent CATs | NP CAT answer route reloads full pool by `id in poolIds` each answer. | Persist compact pool snapshot, cache pool rows per session, store next-question state. |
| 4 | Lesson hub normalization and progress joins | High | High | 500 users or crawler bursts | Lesson hubs still need normalized pathway/locale/topic snapshots and progress batching. | Precompute public hub lists; one-query progress batch for authenticated users. |
| 5 | Public blog/category/sitemap crawler pressure | Medium | High | 100k indexed pages, crawler bursts | Blog count snapshot exists, but DB merge and diagnostics paths remain expensive when enabled. | Keep public blog mostly static/ISR; disable live merge on anonymous hot path. |
| 6 | Dashboard/report-card analytics fanout | Medium | High | 500-1000 active learners | Dashboard/report card load many learner activity aggregates. | Private read cache, async analytics refresh, summarized learner metrics table. |
| 7 | Node memory pressure from large catalogs | Medium | High | 500-1000 users per instance | Lesson catalog caches and large content arrays remain process resident. | Snapshot summaries, avoid full lesson body in hubs, cap in-process caches. |
| 8 | CPU saturation from dynamic server rendering | Medium | High | 100-500 simultaneous dynamic requests | Prior p95 around timeout ceiling under crawl concurrency 12 on small infra. | CDN/ISR/static public pages, precomputed payloads, min 2 instances. |
| 9 | Background jobs contending with learner traffic | Medium | Medium | Any launch campaign or generation burst | Blog campaigns and bulk jobs have per-item create/update patterns. | Queue workers, rate limits, DB-health throttling, bulk writes. |
| 10 | Notification/provider latency in checkout/webhooks | Medium | Medium | 25-100 simultaneous purchases | Stripe processing writes DB rows and may trigger email/admin/SMS paths. | Webhook idempotency, defer notifications to queue, alert on webhook failures. |
| 11 | Spaces/CDN publication gaps | Medium | Medium | Content/media expansion | Lesson image audit found stale/private object keys causing invisible assets. | CDN verification in publish pipeline, asset registry validation. |
| 12 | Search/indexing inside Postgres | Medium | Medium | 50x-100x content growth | Question/topic/blog search can degrade if using flexible filters without prepared indexes. | Search snapshots or external search later; first add targeted indexes/materialized facets. |

## Bottom Line

NurseNest can plausibly scale toward 5,000 users without Kubernetes, microservices, or a rewrite, but not by only increasing instance size. The path is: cache public surfaces, pool DB connections, precompute inventory/session inputs, batch learner progress/analytics, and move background/provider work out of request paths.

