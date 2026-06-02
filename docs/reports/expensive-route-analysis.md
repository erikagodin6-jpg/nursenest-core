# Expensive Route Analysis

Generated: 2026-06-01

## Evidence Used

- Fresh route profile: `reports/origin-route-profile/latest.json`
- Existing crawl artifacts: `reports/origin-capacity-test/*.csv`
- Source inspection of public route loaders, Prisma reads, i18n loaders, sitemap builders, and runtime observability.

## Route-Family Cost Map

| Route family | Expensive operations | Measurement / evidence | Risk |
| --- | --- | --- | --- |
| Blog detail | `generateMetadata` calls `isBlogPostMetaVisible` then `getBlogPostMetaBySlug`; page body calls `getPublishedBlogPostBySlug`; body processing sanitizes HTML, auto-links, parses FAQ/schema/internal-link plan, builds related reading. | Prior runtime logs reported `marketing.blog_post` at ~2.5s-4.2s and metadata at ~3.2s-7.2s. Under 100 crawl, blog p95 hit 20,003ms. | High |
| Localized homepage/routes | `loadMarketingLayoutShardsOverlay`, route body overlays, locale layout, large translated payloads. | Fresh `/fr` and `/es` payloads were ~3.15-3.19 MB with p95 1,588ms at low pressure. | High |
| Public question bank/questions | Marketing shard overlay, region cookie read, landing component, pathway card rendering. Programmatic question topic pages also use DB-backed question/lesson loaders. | Fresh `/question-bank` p95 2,218ms and 1.58 MB payload. | High |
| Homepage | `HomeRestoredWithDeferredStats` imports stats module, computes cached public stats, reads server island i18n, reads region cookies; below-fold blog teaser races DB at 1s. | Fresh p95 1,159ms, but 100-crawl homepage samples were ~10-11s. | High under cold/concurrent cache miss |
| Lessons | Pre-nursing hub is mostly static registry plus `preloadInlineContentMap`; pathway lesson hubs include DB verification caps and lesson loaders. | Fresh `/pre-nursing/lessons` p95 775ms but 1.59 MB. Existing docs cite pathway lesson DB timings ~0.6s-2.7s and `pathway_lessons db_timeout`. | Medium-high |
| Flashcards | Public flashcard route is payload-heavy. Authenticated flashcard inventory/session loaders can scan pools and compute inventory diagnostics. | Fresh `/flashcards` p95 1,338ms and 1.58 MB. | Medium-high |
| Sitemap routes | Index and segmented sitemaps are mostly cached/static; DB-backed enrichment exists but uses skip/fallback guards. | Fresh sitemap p95 147ms; current sitemap routes are not the bottleneck. | Low |

## Ranked Findings

1. Most expensive route family: localized public routes and public study hubs by payload size, blog detail by cold metadata/body processing.
2. Most expensive query pattern: public homepage stats fan-out in `computePublicHomeStats`, which can run 6 counts plus 2 groupBy queries when the shared cache misses.
3. Most expensive loader: blog public detail loaders in `src/lib/blog/safe-blog-queries.ts`, especially duplicate metadata/body reads for the same slug during one page request.
4. Most expensive component: public marketing/study surfaces that embed large server-rendered payloads. The concrete symptom is 1.5-3.2 MB responses for lessons, questions, flashcards, NP, localized pages, and blog detail.

## Query And Loader Inventory

| Operation | File | Notes |
| --- | --- | --- |
| Blog slug metadata/body reads | `src/lib/blog/safe-blog-queries.ts` | `getBlogPostMetaBySlug`, `isBlogPostMetaVisible`, and `getPublishedBlogPostBySlug` can resolve the same slug more than once across metadata and page render. |
| Blog public DB concurrency | `src/lib/blog/safe-blog-queries.ts` | `BLOG_PUBLIC_DB_CONCURRENCY` defaults to 4 and protects DB, but queued reads can elongate crawl wall time under many concurrent blog URLs. |
| Homepage public stats | `src/lib/marketing/public-home-stats.ts` | Cache miss runs counts/groupBy for content items, pathway lessons, flashcards, decks, users, exam questions, question tiers, scenarios, and distinct topics. |
| Inline content overrides | `src/lib/inline-content/load-inline-content.ts` | Uses `unstable_cache` and one `findMany` per key set; safe, but still a DB read on shared-cache miss. |
| Marketing i18n shards | `src/lib/marketing-i18n/load-marketing-route-shard-bundles.ts` | In-process `Map` cache after first load; initial loads still inflate cold path and payload. |
| Sitemap XML | `src/lib/seo/sitemap-static-xml.ts`, `src/app/sitemap*.xml/route.ts` | Sitemaps have cache headers and ISR/static settings; not currently the slow path. |
| DB query observability | `src/lib/db/prisma-query-capture.ts`, `src/lib/db/prisma-slow-query-log.ts` | Production logs slow queries above 250ms by fingerprint and duration; full query capture is disabled unless opted in. |
| DB query semaphore | `src/lib/server/db-query-semaphore.ts` | App-level cap defaults to 22 concurrent Prisma operations per Node process. |

## Component-Level Cost

The dominant component cost in public crawl surfaces is not one React component doing CPU-heavy work in isolation. It is the combination of:

- Large RSC/HTML payloads on public marketing study surfaces.
- Repeated metadata and body loaders for blog detail routes.
- Cold ISR/cache misses across many distinct URLs at once.
- Optional DB reads that are individually bounded but collectively saturate the single origin.

