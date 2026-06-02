# Prisma Performance Audit

Date: 2026-06-01

## Executive Summary

This audit reviewed Prisma usage across `src`, `scripts`, and `prisma` with static scans, the repository N+1 detector, targeted hot-route reads, and existing database performance notes. The scan found 3,336 direct `prisma.` references and 2,690 model operation call sites outside tests.

The main production risk is not missing content. It is fan-out: public and learner routes combine counts, list reads, fallback probes, progress lookups, and content merge loaders inside a single request. Under crawl load, those requests multiply into database pressure, queueing, slow responses, and eventually origin unhealthy upstream events.

The fastest path to a 50%+ DB load reduction is:

1. Remove public hot-path counts where `take + 1`, cached totals, or precomputed snapshots are sufficient.
2. Batch per-pathway and per-resource counts into `groupBy` or raw aggregate queries.
3. Batch progress/navigation/activity context reads per request.
4. Move homepage/blog/lesson hub stats to durable cache or precomputed snapshots.
5. Convert admin and scheduler row-by-row jobs to chunked prefetch plus `createMany` / `updateMany` where possible.

## Scope And Method

- Static Prisma operation scan: `rg "prisma\\." src scripts prisma`.
- N+1 scan: `scripts/detect-n-plus-one.mjs --severity 2`.
- Manual review of hot route families: public blog, homepage stats, learner lessons, flashcards, questions, dashboards, admin analytics, retention cron, and blog batch pipelines.
- Existing evidence reviewed: `reports/database-query-hotspots.md` and `docs/reports/database-performance-audit.md`.

This is a code-path audit, not a live `EXPLAIN ANALYZE` run. The recommendations below should be validated with production-like query timing after implementation.

## Highest Impact Findings

| Rank | Area | File | Query Pattern | Cost | Recommended Fix |
|---:|---|---|---|---|---|
| 1 | Public blog index | `src/lib/blog/safe-blog-queries.ts:472`, `src/lib/blog/safe-blog-queries.ts:482`, `src/lib/blog/safe-blog-queries.ts:895` | `blogPost.findMany` page read plus `blogPost.count`, then optional full live-row fetch for static merge | High on crawled `/blog` and scoped blog pages. A single index request can perform page read, total count, overlap lookup, and full merge fetch. Counts and full fetches become expensive as live posts grow. | Cache live blog index snapshots by scope. Use `take + 1` for pagination when total is not required. Store/calculate live total asynchronously. Disable full live merge on hot path or precompute merged rows. |
| 2 | Learner lesson hub API | `src/app/api/learner/pathway-lessons/route.ts:151`, `src/app/api/learner/pathway-lessons/route.ts:209`, `src/app/api/learner/pathway-lessons/route.ts:301` | `pathwayLesson.findFirst`, `contentItem.count`, paginated lesson resolver, then per-pathway progress map loop | High for authenticated app traffic. Request does 2 source-probe reads before actual pagination and can add N progress queries by pathway. | Replace source probes with cached source capability metadata. Batch progress in one query for all `(pathwayId, slug)` keys. Avoid `contentItem.count` on every list request. |
| 3 | Public lesson hub full scan | `src/lib/lessons/pathway-lesson-loader.ts:751`, `src/lib/lessons/pathway-lesson-loader.ts:788`, `src/lib/lessons/pathway-lesson-loader.ts:1179` | Chunked full lesson load plus translation overlay load, cached per page key | High on crawled lesson hubs. The implementation is bounded and cached, but the first request per key can scan all renderable lessons before slicing. | Precompute pathway hub renderable lists by pathway/locale/topic. Cache the normalized full list separately from page slices. Keep page cache keys thin and reuse one normalized snapshot for metadata plus page rendering. |
| 4 | Flashcard custom session | `src/lib/flashcards/build-flashcard-custom-session.ts:409`, `src/lib/flashcards/build-flashcard-custom-session.ts:603`, `src/lib/flashcards/build-flashcard-custom-session.ts:667` | Dedicated flashcard scan up to 5,000, session card scan up to 800, chunked `examQuestion.findMany` for metadata | High for flashcard sessions and inventory-backed hubs. The session scan is capped, but the inventory path still pulls 5,000 dedicated cards with category/deck relations. | Build flashcard inventory from aggregate counts and IDs first. Lower or paginate the 5,000 dedicated-card inventory scan. Defer category/deck relation reads until selected cards are known. |
| 5 | Question API random/fallback selection | `src/app/api/questions/route.ts:677`, `src/app/api/questions/route.ts:718`, `src/app/api/questions/route.ts:732`, `src/app/api/questions/route.ts:746`, `src/app/api/questions/route.ts:982` | Random candidate pool read, ID lookup read, fallback relaxed query read | High for question-bank traffic. Some requests can perform multiple selection queries when topic filters relax or random selection is used. | Collapse fallback selection into one ranked SQL query with `CASE` scoring, or cache candidate ID pools by pathway/filter/difficulty. Keep final row hydration to one `id IN (...)` query. |
| 6 | Homepage public stats | `src/lib/marketing/public-home-stats.ts:257`, `src/lib/marketing/public-home-stats.ts:261`, `src/lib/marketing/public-home-stats.ts:267`, `src/lib/marketing/public-home-stats.ts:275`, `src/lib/marketing/public-home-stats.ts:279` | Multiple public `count` queries on homepage stats load | High under anonymous traffic and crawls. Counts are parallelized but still consume pool slots and can serialize behind the DB semaphore. | Move public stats to a durable snapshot refreshed by cron/build. Treat stats as eventually consistent and avoid live DB reads on homepage render. |
| 7 | Admin content coverage dashboard | `src/lib/admin/load-admin-content-coverage-dashboard.ts:328`, `src/lib/admin/load-admin-content-coverage-dashboard.ts:341` | Per-pathway `examQuestion.count` inside readiness loop | Medium to high for admin dashboards. Cost is `pathway_count` separate count queries. | Replace loop with one grouped aggregate over published questions keyed by pathway/exam mapping. Use existing pathway metadata to hydrate rows in memory. |
| 8 | SEO content-backed hub sitemap rows | `src/lib/seo/content-backed-study-resource-hub.ts:236`, `src/lib/seo/content-backed-study-resource-hub.ts:240` | `examQuestion.count` inside body-system group loop | High during sitemap generation and crawl preparation. Cost is one count per candidate body system. | Use a single `examQuestion.groupBy({ by: ["bodySystem"] })` with pathway where clause, then filter body-system groups in memory. |
| 9 | Admin blog list | `src/app/api/admin/blog/route.ts:133`, `src/app/api/admin/blog/route.ts:140`, `src/app/api/admin/blog/route.ts:146` | Page read plus total count plus six status counts plus next scheduled lookup | Medium. Admin-only but expensive and easy to optimize. | Replace six status counts with one `groupBy({ by: ["postStatus"] })`. Make total optional or cached. Keep next scheduled lookup separate. |
| 10 | Admin analytics stats | `src/app/api/admin/stats/analytics/route.ts:83` | Six `user.count` queries plus raw aggregates and related model counts | Medium. Admin-only, but counts can contend with production traffic. | Consolidate user metrics into one raw SQL aggregate using `COUNT(*) FILTER (WHERE ...)`. Cache dashboard response for 30-60 seconds. |
| 11 | Retention cron | `src/lib/retention/run-retention-cron-scan.ts:31`, `src/lib/retention/run-retention-cron-scan.ts:42`, `src/lib/retention/run-retention-cron-scan.ts:47` | Candidate user scan, then two `findFirst` reads per user | Medium to high during cron windows. Cost is `1 + 2N` queries plus downstream nudge work. | Fetch last attempts and last sessions for all candidate IDs in two aggregate/window queries, then evaluate last touch in memory. |
| 12 | Study pool counts | `src/lib/study-question-pool/get-study-question-pool-for-pathway.ts:62`, `src/lib/study-question-pool/get-study-question-pool-for-pathway.ts:67` | Question count plus dedicated flashcard count per pathway | Medium. This repeats across pathway readiness/inventory surfaces. | Cache pool counts by pathway and entitlement scope. Prefer one shared inventory helper so flashcards, questions, CAT, and readiness reuse counts. |
| 13 | Learner warm cache/nav context | `src/app/api/learner/activity-warm-cache/route.ts:58`, `src/app/api/learner/activity-warm-cache/route.ts:61` | Load nav metadata, then activity context fallback | Medium. Repeated across learner shell APIs and warm-cache. | Introduce one per-request learner context object containing nav pathway, entitlement, and activity context. Memoize by `userId` with a short TTL where safe. |
| 14 | Blog bulk operations | `src/lib/admin/content-bulk/execute-blog-bulk-chunk.ts:117`, `src/lib/admin/content-bulk/execute-blog-bulk-chunk.ts:150`, `src/lib/admin/content-bulk/execute-blog-bulk-chunk.ts:163`, `src/lib/admin/content-bulk/execute-blog-bulk-chunk.ts:180` | Per-post `findUnique` then per-post `update` in bulk loops | Medium. Admin-only, but large batches steal DB capacity from production reads. | Prefetch all selected posts once. Partition rows in memory. Use `updateMany` for uniform operations and chunked transactions for taxonomy-specific updates. |
| 15 | Blog campaign generation chunks | `src/app/api/admin/blog/campaigns/[id]/run-chunk/route.ts:225`, `src/app/api/admin/blog/campaigns/[id]/run-chunk/route.ts:269`, `src/app/api/admin/blog/campaigns/[id]/run-chunk/route.ts:297` | Per-item `blogPost.create`, campaign-item update, and failure update | Medium. Expected for generation, but high write fan-out under large campaign chunks. | Cap chunk concurrency, wrap item create/update in small transactions, prefetch slug conflicts, and pause campaign work when DB health/readiness degrades. |

## N+1 And Repeated Query Details

### Public Hot Paths

#### Blog Index

Queries:

- `prisma.blogPost.findMany` for list rows at `src/lib/blog/safe-blog-queries.ts:472`.
- `prisma.blogPost.count` for total at `src/lib/blog/safe-blog-queries.ts:482`.
- `countPublishedBlogPosts()` runs `blogPost.count` and overlap lookup at `src/lib/blog/safe-blog-queries.ts:615`.
- Static/live merge can fetch all live rows up to `BLOG_INDEX_MERGE_DB_MAX` at `src/lib/blog/safe-blog-queries.ts:895`.

Cost:

- Worst case: 3-4 DB reads for a single blog index response.
- Counts are repeated across index, tags, categories, sitemap, and homepage-style surfaces.
- Full live-row merge is especially risky when crawlers hit many blog indexes concurrently.

Recommended fix:

- Precompute a merged blog index snapshot keyed by scope.
- Return approximate/cached totals on public routes.
- Use `take + 1` for page-next behavior instead of live `count`.
- Keep live DB fetches for admin/editorial tools, not anonymous crawl paths.

#### Homepage Public Stats

Queries:

- `contentItem.count`, `pathwayLesson.count`, `flashcard.count`, `flashcardDeck.count`, `user.count`, `examQuestion.count`, and question `groupBy` in `src/lib/marketing/public-home-stats.ts:245`.

Cost:

- Multiple public aggregate queries for a page whose values do not need request-time precision.
- Counts consume pool capacity during crawl spikes and can delay request-critical reads.

Recommended fix:

- Persist `public_home_stats_snapshot` or JSON cache refreshed every 5-30 minutes.
- Serve stale values on DB timeout.
- Remove live user count from anonymous public rendering.

#### Public Lesson Hubs

Queries/loaders:

- `loadPublishedLessonInputsAllChunked()` loads hub rows in chunks at `src/lib/lessons/pathway-lesson-loader.ts:751`.
- `fetchPublishedLessonOverlaysForMarketingLocale()` is loaded before normalization at `src/lib/lessons/pathway-lesson-loader.ts:788`.
- Data cache wraps the final page key at `src/lib/lessons/pathway-lesson-loader.ts:1179`.

Cost:

- First request per pathway/locale/topic/search can load the full normalized lesson list before slicing.
- Metadata and page rendering can request similar normalized data.

Recommended fix:

- Cache normalized renderable lesson lists independently from page slices.
- Precompute pathway/locale lesson hub payloads during content publish/import.
- Reuse the same normalized list for metadata, page cards, and sitemap rows.

### Learner Hot Paths

#### Learner Lessons API

Queries:

- Source probe: `pathwayLesson.findFirst` at `src/app/api/learner/pathway-lessons/route.ts:154`.
- Legacy source probe: `contentItem.count` at `src/app/api/learner/pathway-lessons/route.ts:163`.
- Main pagination resolver at `src/app/api/learner/pathway-lessons/route.ts:209`.
- Per-pathway progress loop at `src/app/api/learner/pathway-lessons/route.ts:301`.

Cost:

- 3+ DB reads before progress.
- Progress reads scale with pathway count in the returned page.
- Source detection is repeated per request even though it changes rarely.

Recommended fix:

- Cache lesson-source capability by entitlement/pathway.
- Add `loadPathwayLessonProgressMapBatch(userId, keys)` and query progress once.
- Make progress opt-in for list routes and use a separate endpoint for expanded details when needed.

#### Flashcard Custom Sessions

Queries:

- Inventory slow path loads exam inventory and lesson virtuals, then scans dedicated cards at `src/lib/flashcards/build-flashcard-custom-session.ts:409`.
- Session builder scans cards at `src/lib/flashcards/build-flashcard-custom-session.ts:603`.
- Metadata hydration performs chunked `examQuestion.findMany` at `src/lib/flashcards/build-flashcard-custom-session.ts:667`.

Cost:

- Dedicated flashcard inventory path still has `take: 5000`.
- Session path can read 800 cards plus question metadata.
- Relations are selected before the final card set is known.

Recommended fix:

- Convert inventory builder to aggregate counts plus sampled IDs.
- Hydrate only selected card rows.
- Share inventory counts with readiness/CAT/question helpers.

#### Questions API

Queries:

- Random Prisma candidate pool at `src/app/api/questions/route.ts:677`.
- Random ID hydration at `src/app/api/questions/route.ts:718`.
- Ordered page query at `src/app/api/questions/route.ts:732`.
- Relaxed fallback query at `src/app/api/questions/route.ts:746`.
- Freemium random ID hydration at `src/app/api/questions/route.ts:982`.

Cost:

- Random requests can perform selection plus hydration.
- Topic fallback can double list queries.
- Candidate pools are recomputed instead of reused.

Recommended fix:

- Use a single ranked SQL candidate query that marks exact vs relaxed matches.
- Cache candidate ID pools by pathway, topic, body system, difficulty, entitlement, and study mode.
- Keep response hydration to one query.

### Admin, Batch, And Background Load

#### Admin Content Coverage Dashboard

Query:

- `examQuestion.count` runs inside the pathway loop at `src/lib/admin/load-admin-content-coverage-dashboard.ts:341`.

Cost:

- One count query per pathway.

Recommended fix:

- Replace with grouped aggregate keyed by pathway/exam family.
- Compute readiness rows from the grouped result in memory.

#### SEO Content-Backed Hub Generation

Query:

- `examQuestion.count` runs inside a body-system loop at `src/lib/seo/content-backed-study-resource-hub.ts:240`.

Cost:

- One count query per candidate body system during sitemap/resource row generation.

Recommended fix:

- Use `examQuestion.groupBy({ by: ["bodySystem"] })` once per pathway.
- Compare grouped question counts to lesson group counts in memory.

#### Retention Cron

Queries:

- Candidate users are loaded once at `src/lib/retention/run-retention-cron-scan.ts:31`.
- `examAttempt.findFirst` and `examSession.findFirst` run for every candidate at `src/lib/retention/run-retention-cron-scan.ts:42` and `src/lib/retention/run-retention-cron-scan.ts:47`.

Cost:

- `1 + 2N` DB reads before nudge sending.

Recommended fix:

- Fetch latest attempt/session timestamps for candidate IDs with two aggregate/window queries.
- Evaluate inactive candidates in memory.

#### Admin Blog List

Queries:

- Page list and total at `src/app/api/admin/blog/route.ts:132`.
- Six independent status counts at `src/app/api/admin/blog/route.ts:146`.

Cost:

- 8 queries for one admin page load, excluding diagnostics.

Recommended fix:

- Replace status counts with one `groupBy`.
- Make list total optional or cached for unfiltered admin views.

#### Admin Analytics

Queries:

- Multiple `user.count` queries plus raw aggregates start at `src/app/api/admin/stats/analytics/route.ts:83`.

Cost:

- Repeated scans over `User` with similar predicates.

Recommended fix:

- Consolidate into one SQL query with `COUNT(*) FILTER`.
- Cache analytics for 30-60 seconds.

#### Blog Bulk And Campaign Jobs

Queries:

- Bulk chunk per-post read/update in `src/lib/admin/content-bulk/execute-blog-bulk-chunk.ts:117`, `src/lib/admin/content-bulk/execute-blog-bulk-chunk.ts:150`, `src/lib/admin/content-bulk/execute-blog-bulk-chunk.ts:163`, and `src/lib/admin/content-bulk/execute-blog-bulk-chunk.ts:180`.
- Campaign chunk per-item create/update/failure update in `src/app/api/admin/blog/campaigns/[id]/run-chunk/route.ts:225`, `src/app/api/admin/blog/campaigns/[id]/run-chunk/route.ts:269`, and `src/app/api/admin/blog/campaigns/[id]/run-chunk/route.ts:297`.

Cost:

- Row-by-row writes can monopolize connection pool capacity during large content operations.

Recommended fix:

- Prefetch rows in one `findMany`.
- Use `updateMany` for uniform status changes.
- Chunk writes and pause background work when DB health is degraded.

## Duplicate Counts And Fetches To Remove First

| Duplicate Work | Current Behavior | Replacement |
|---|---|---|
| Public blog totals | Live `count` during index and count helper calls | Cached total snapshot plus `take + 1` pagination |
| Homepage stats | Multiple live counts on anonymous route | Snapshot JSON/table refreshed asynchronously |
| Pathway lesson source detection | Per-request `findFirst` plus `contentItem.count` | Cached source capability map |
| Lesson progress | Loop of progress map reads by pathway | Single batched progress query |
| Admin blog status counts | Six independent `count` calls | One `groupBy` |
| Admin analytics user counts | Several `user.count` calls with similar predicates | One raw aggregate |
| Per-pathway readiness counts | `examQuestion.count` inside pathway loop | One grouped aggregate |
| Per-body-system SEO counts | `examQuestion.count` inside group loop | One `groupBy` by body system |
| Retention activity checks | Two `findFirst` calls per user | Two aggregate/window queries for all users |

## Expected Load Reduction

The following staged fixes should exceed the 50% DB-load reduction goal on crawl and learner traffic:

| Stage | Change | Expected Reduction |
|---|---|---:|
| 1 | Cache homepage stats and public blog totals/snapshots | 15-25% fewer public aggregate reads |
| 2 | Batch learner lesson progress and remove lesson source probes | 10-20% fewer learner lesson API reads |
| 3 | Precompute public lesson hub normalized lists | 10-20% fewer lesson hub DB reads on cache misses and crawls |
| 4 | Replace admin dashboard/status/readiness count loops with grouped aggregates | 5-10% fewer admin/background reads |
| 5 | Convert retention and blog batch loops to bulk reads/writes | 5-15% less background pool contention |

Combined target: 45-80% reduction in Prisma query volume on the audited hot paths, with the largest win from public route caching and aggregate batching.

## Implementation Priority

1. Public route protection:
   - Blog index snapshots.
   - Homepage stats snapshot.
   - Public lesson hub normalized-list cache.

2. Learner route batching:
   - Batched lesson progress.
   - Cached learner/source context.
   - Shared inventory counts for questions, flashcards, CAT, and readiness.

3. Aggregate rewrites:
   - Admin blog status `groupBy`.
   - Admin analytics single aggregate SQL.
   - Content coverage and SEO hub grouped question counts.

4. Background-job containment:
   - Retention cron aggregate reads.
   - Blog bulk prefetch/updateMany.
   - Campaign generation chunk health gating.

## Verification Plan

After implementing fixes:

1. Add Prisma query counters around these routes in staging:
   - `/`
   - `/blog`
   - `/blog/category/*`
   - lesson hub routes
   - `/api/learner/pathway-lessons`
   - flashcard session builder
   - question API random and filtered routes

2. Record per-request:
   - Prisma query count
   - total DB time
   - max single-query time
   - connection wait time if available

3. Re-run crawl tests:
   - 100, 500, 1000, 2000 URLs
   - concurrency 4, 8, 12, 16, 24

4. Success criteria:
   - 50%+ reduction in hot-path query count.
   - p95 below 2 seconds.
   - p99 below 5 seconds.
   - 0 readiness failures.
   - 0 upstream unhealthy events.

## GO / NO-GO

Current status: NO-GO for SEO or crawl expansion.

Reason: public and learner hot paths still contain duplicate counts, full-list loaders, and request-time aggregate work that can amplify under crawl concurrency. Proceed with the optimization stages above, then certify origin stability before SEO/GSC activity.
