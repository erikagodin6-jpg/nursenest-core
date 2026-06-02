# Database Growth Audit

Generated: 2026-06-02

## Growth Model

This report identifies degradation risks at current, 10x, 50x, and 100x data growth. It does not claim measured row counts beyond existing snapshot evidence.

| Domain | Current risk | 10x risk | 50x risk | 100x risk | Index / storage requirement |
| --- | --- | --- | --- | --- | --- |
| Questions | Random/fallback candidate queries and CAT pools are already hot. | Candidate scans slow without composite filters. | CAT pool and question bank need cached ID sets. | Search/faceting should be materialized or externalized. | Composite indexes by `status`, `exam`, `studyLinkPathwayId`, `isAdaptiveEligible`, `bodySystem`, `topic`, `difficulty`. |
| Flashcards | Cold inventory can scan 5,000 rows. | Dedicated card/deck/category relation reads become expensive. | Must avoid relation hydration before selection. | Need precomputed per-pathway deck/category inventory. | Index `status`, `deckId`, `examQuestionId`, deck `pathwayId`; precomputed inventory table/snapshot. |
| Lessons | Catalog plus DB fallback is manageable but hub cold builds are heavy. | Public hubs need precomputed normalized lists. | DB lesson body loads must stay off hubs. | Static/ISR/public snapshots required. | Index pathway/slug/status/topic; store summary indexes separately from bodies. |
| Analytics | User activity aggregates become dominant with active learners. | Dashboard/report card p95 degrades. | Per-user rollups required. | Raw event reads should be background-only. | Rollup tables by user/day/topic/session; indexes by user and createdAt. |
| Subscriptions | Low row volume; high correctness risk. | Fine with indexes. | Fine with indexes. | Fine with idempotency. | Unique Stripe event/subscription/customer identifiers; webhook event table retention. |
| Blog | Snapshot reduces public count load. | Category/tag pages need cached facets. | Sitemap splitting and static generation required. | Search/index routes need materialized index. | Index `postStatus`, `publishedAt`, `locale`, `slug`, category/tag join keys. |
| Study Plans | Per-user plans small. | Query by user/date remains fine. | Need bounded reads. | Archive old plan events. | Index user/date/status. |
| User Activity | Biggest long-term storage driver. | Raw reads must be bounded. | Rollups required. | Partition/archive old events. | User/time indexes, daily rollups, retention policy. |
| Report Cards | Pulls attempts, practice tests, sessions, topics. | Needs private cache. | Needs summary snapshots. | Raw recomputation unacceptable. | User summary snapshot table/cache; async refresh after session completion. |

## Priority Index Work

1. CAT/question pool filters.
2. Flashcard deck/pathway/category filters.
3. PracticeTest by user/status/config pathway.
4. Progress by user and synthetic lesson id.
5. Blog public status/locale/published filters.
6. Activity/analytics user/time rollup indexes.

