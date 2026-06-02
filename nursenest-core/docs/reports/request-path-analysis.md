# Request Path Analysis

Generated: 2026-06-02

## Summary

| Path | Queries / DB work | External services | Cache utilization | CPU / memory cost | Main bottleneck |
| --- | --- | --- | --- | --- | --- |
| Homepage | Public live counts removed; now snapshot/fallback based. | None on render expected. | `public_home_stats_snapshot`. | Low if snapshot path is used. | Keep snapshot refresh off request path. |
| Lessons hub | Public loader can normalize large lesson sets; learner API still has source probes/progress work. | None. | `unstable_cache` and catalog memoization exist. | Medium-high on cold pathway/locale/topic. | Precompute normalized hub slices. |
| Lesson detail | Detail page resolves lesson, progress/context, adjacent nav, image, study loop. | None normally. | Adjacent/detail cache and catalog memoization. | Medium; content rendering can be large. | Keep body loads out of hub paths; batch progress. |
| Flashcards | Inventory fast path via Redis snapshot; cold path scans cards and lesson virtuals; session path reads cards/progress/question metadata. | Redis when configured. | Hub inventory snapshot and in-process metadata cache. | High under cold concurrent session builds. | Cold inventory and card selection scans. |
| Practice | Practice create queries question pools and persists `PracticeTest`. CAT path uses advisory lock and transaction. | None normally. | Practice availability/cache work exists. | Medium-high for session creation. | Candidate pool selection and persistence. |
| CAT | CAT creation loads pool and history; NP answer route reloads pool every answer. | None. | Some pool/cache helpers; session persistence in DB. | High CPU per concurrent exam due selection/scoring plus DB pool reloads. | Per-question pool reload and state persistence. |
| Dashboard | User, lesson bundle, progress, exam aggregates, topic analytics, cognition warmup. | Optional analytics/observability. | Learner private read cache and degraded fallback. | High for active learners. | Aggregate fanout and analytics joins. |
| Blog | Public list uses `take + 1` and snapshot count; article/static fallback exists. | None. | Snapshot/static corpus fallback. | Low-medium; category/sitemap can spike. | 100k page crawler bursts and optional live merge. |
| Subscriptions | Stripe checkout/webhook, subscription/user writes, notifications. | Stripe, email, SMS. | Idempotency policy exists in webhook code paths. | Low CPU, high provider dependency risk. | Synchronous notification/provider work. |
| Analytics | Topic performance, exam attempts, practice tests, confidence/time metrics. | Optional observability. | Learner-private cache in some routes. | High with data growth. | Need summarized learner metrics and async refresh. |

## Expensive Operations

- Flashcards: `prisma.flashcard.findMany({ take: 5000 })` for cold inventory, plus metadata hydration from `examQuestion`.
- CAT: pool load on creation and full pool reload on answer.
- Lessons: public normalized list build and learner progress joins.
- Dashboard/report card: repeated aggregates over attempts, sessions, progress, and topic stats.
- Blog: live merge/fetch-all path should stay disabled for anonymous traffic at scale.

## Synchronous Bottlenecks

- CAT creation inside advisory-lock transaction is correct for duplication protection, but should stay short.
- Notifications should not block checkout/webhook completion.
- Background campaign writes should not share unlimited concurrency with learner traffic.

