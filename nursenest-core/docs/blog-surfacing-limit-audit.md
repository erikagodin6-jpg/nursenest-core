# Blog Surfacing Limit Audit

Date: 2026-05-31

## Executive Finding

NurseNest does not appear to be globally capped to only hundreds of blog articles. The main `/blog` index uses normal pagination at 50 posts per page and, while the live database count remains under the 5,000-row merge threshold, it merges live CMS rows with static/long-tail supplement rows.

However, thousands of articles can be missed by scoped discovery surfaces such as RN, regional, and localized hubs because those loaders apply `careerSlug`, locale, region, profession, and exam filters. Current live database evidence shows most live articles have `careerSlug = null`, so scoped hubs can return zero while the global corpus contains thousands of live articles.

## Live Database Evidence

Observed against the configured production database on 2026-05-31:

| Metric | Count |
|---|---:|
| Live blog rows under public live filter | 4,217 |
| Live rows with `careerSlug = null` | 4,196 |
| Live `careerSlug = rn` rows | 0 |
| Live `careerSlug = canada-rn` rows | 0 |
| Live `careerSlug = us-rn` rows | 0 |
| Live `careerSlug = rex-pn` rows | 0 |
| Live `careerSlug = nclex-pn` rows | 0 |
| Recovered static rows with `careerSlug = null` | 4,168 |

Live rows by `careerSlug`:

| careerSlug | Count |
|---|---:|
| null | 4,196 |
| mlt | 15 |
| paramedic | 3 |
| imaging | 3 |

Live rows by locale:

| Locale | Count |
|---|---:|
| en | 3,277 |
| ar | 140 |
| es | 140 |
| fil | 140 |
| fr | 140 |
| hi | 140 |
| pt | 140 |
| en-US | 40 |
| ar-SA | 10 |
| es-ES | 10 |
| fr-FR | 10 |
| hi-IN | 10 |
| pt-BR | 10 |
| tl-PH | 10 |

## Global Blog Pagination And Caps

| Evidence | Finding | Impact |
|---|---|---|
| `src/lib/api/api-pagination-limits.ts:6-7` | `API_LIST_PAGE_SIZE_HARD_MAX = 50`. | Public/admin list pages are capped to 50 rows per request. This is pagination, not a corpus cap. |
| `src/lib/blog/safe-blog-queries.ts:289-293` | `BLOG_LIST_PAGE_SIZE = 50`. | `/blog`, tag, and category list pages default to 50 rows per page. |
| `src/lib/blog/safe-blog-queries.ts:568-582` | `getPublishedBlogPostsPage` sanitizes page and caps `pageSize` at the API hard max. | Users need pagination to see the full corpus. |
| `src/lib/blog/safe-blog-queries.ts:414-434` | DB list query uses `skip` and `take: safeSize`. | Standard offset pagination; does not itself hide later pages if total count is correct. |
| `src/app/(marketing)/(default)/blog/page.tsx:71-74` | Main blog page loads `getPublishedBlogPostsPage(page, BLOG_LIST_PAGE_SIZE)`. | Global blog index displays 50/page plus a pathophysiology spotlight on page 1. |
| `src/app/(marketing)/(default)/blog/page.tsx:103-115` | Page 1 removes pathophysiology spotlight slugs from the normal list, then uses one featured row and the remaining client list. | First-page visible article count can be lower than raw page size when spotlight rows overlap. |

## Merge Caps

| Evidence | Finding | Impact |
|---|---|---|
| `src/lib/blog/blog-public-merge.ts:8-10` | Comment documents that in-memory CMS + static merge is only used up to `BLOG_INDEX_MERGE_DB_MAX`; above that, static remains detail-route reachable but not interleaved in the index. | Future discovery risk when live CMS count exceeds 5,000. |
| `src/lib/blog/blog-public-merge.ts:18-19` | `BLOG_INDEX_MERGE_DB_MAX = 5000`. | Hard merge threshold. |
| `src/lib/blog/blog-public-merge.ts:77-85` | DB slugs win; static supplement rows with duplicate DB slugs are dropped. | Expected dedupe, but static rows can disappear from lists when DB has same slug. |
| `src/lib/blog/blog-public-merge.ts:88-92` | Merged rows are paginated with `.slice(start, start + safeSize)`. | Pagination occurs after merge for global unscoped index under the merge cap. |
| `src/lib/blog/safe-blog-queries.ts:804-815` | Static supplement rows are built only when `isGlobalUnscopedBlogIndexScope(scope)` is true. | Scoped hubs do not receive static supplement rows. |
| `src/lib/blog/safe-blog-queries.ts:822-849` | When global DB total is `<= 5000`, the code fetches all DB rows up to the cap, merges static rows, slices the requested page, and sets `totalOut = merged.length`. | Current global `/blog` can surface the merged corpus through pagination. |
| `src/lib/blog/safe-blog-queries.ts:894-915` | When global DB total is `> 5000`, the code returns DB-only pagination and records `cms_live_count_gt_5000_index_static_not_interleaved`. | Once live DB count exceeds 5,000, static-only supplements will no longer appear in global list pagination. |
| `src/lib/blog/safe-blog-queries.ts:916-925` | Scoped queries return live DB rows only. | RN/regional/local scoped pages can be empty even while global blog has thousands. |

## Visibility And Scope Filters

| Evidence | Finding | Impact |
|---|---|---|
| `src/lib/blog/safe-blog-queries.ts:642-644` | Public list `where` is built through `buildBlogPublicListWhere(now, scope)`. | Visibility and scope filtering are centralized. |
| `src/lib/blog/safe-blog-queries.ts:711-729` | Locale fallback to source locale only happens if scoped locale differs from source locale and the primary DB total is zero. | Locale fallback does not solve missing `careerSlug` matches if source query still includes the same career scope. |
| `src/app/(marketing)/(default)/blog/rn/page.tsx:50-55` | `/blog/rn` passes `careerSlug: "rn"` into `getPublishedBlogPostsPage`. | RN hub excludes all live rows where `careerSlug` is null. Current live RN count is 0. |
| `src/lib/blog/regional-blog-cluster-page.tsx:74-79` | Regional hubs pass `careerSlug: clusterSlug` into `getPublishedBlogPostsPage`. | `/blog/canada-rn`, `/blog/us-rn`, `/blog/rex-pn`, and `/blog/nclex-pn` exclude global/null-career rows. Current counts are 0 for these slugs. |

## Category And Tag Loaders

| Evidence | Finding | Impact |
|---|---|---|
| `src/lib/blog/safe-blog-queries.ts:1343-1360` | Tag count returns DB count only above merge cap; otherwise it adds static supplement count. | Tags are not capped to hundreds, but static supplement merging is subject to the 5,000-row threshold. |
| `src/lib/blog/safe-blog-queries.ts:1400-1461` | Tag page caps page size at 50. If DB tag count exceeds 5,000, it returns DB-only pagination; otherwise it fetches DB rows up to merge cap, merges supplements, and slices. | Same future merge-cliff risk as global `/blog`. |
| `src/lib/blog/safe-blog-queries.ts:1464-1481` | Category count uses the same DB-count-plus-static-supplement logic under the merge cap. | Category totals should include static supplements only below the merge cap. |
| `src/lib/blog/safe-blog-queries.ts:1484-1547` | Category page uses the same 50 page-size cap and 5,000 merge threshold behavior. | Category pages can surface the corpus through pagination under the cap. |

## Homepage, RSS, And Spotlight Surfaces

| Evidence | Finding | Impact |
|---|---|---|
| `src/lib/blog/home-blog-teaser.ts:17-24` | Homepage teaser caps requested rows to `Math.min(6, ...)`. | Homepage intentionally surfaces at most 6 blog posts. This is not a full index. |
| `src/lib/blog/home-blog-teaser.ts:29-35` | Homepage teaser calls `getPublishedBlogPostsPage(1, safeTake, includeTotal: false)`. | It only reads page 1 and does not compute total. |
| `src/lib/blog/blog-rss-feed.ts:27-30` | RSS feed calls `getPublishedBlogPostsPage(1, 50, includeTotal: false)`. | RSS intentionally surfaces latest 50 only. |
| `src/lib/blog/safe-blog-queries.ts:301-308` | Pathophysiology spotlight default take is 12 and is capped by API hard max. | Spotlight is intentionally small. |
| `src/lib/blog/safe-blog-queries.ts:335-342` | Pathophysiology spotlight DB fetch is capped to at most 50 rows. | Spotlight cannot represent the full pathophysiology corpus. |

## Localized Blog Loaders

| Evidence | Finding | Impact |
|---|---|---|
| `src/lib/blog/safe-localized-blog-queries.ts:186-197` | Localized list default page size is 24 and maxes at the 50-row API cap. | Normal page-size cap. |
| `src/lib/blog/safe-localized-blog-queries.ts:200-207` | Localized query filters simultaneously by `locale`, `region`, `profession`, and `exam`. | Missing metadata in any one dimension excludes the row. |
| `src/lib/blog/safe-localized-blog-queries.ts:212-225` | Localized list uses `skip` and `take: safeSize` plus a count. | Pagination is bounded but should be complete if filters match. |
| `src/lib/blog/safe-localized-blog-queries.ts:228-253` | English fallback still applies the same region/profession/exam filters. | Fallback does not recover rows missing scope metadata. |

## Sitemap Limits

| Evidence | Finding | Impact |
|---|---|---|
| `src/lib/seo/sitemap-blog-xml.ts:29-34` | Blog sitemap logs when 50,000 URL cap is reached. | Current corpus is below this cap. |
| `src/lib/seo/sitemap-blog-xml.ts:58-63` | Regional hub pages are always included in sitemap. | Hub pages can be indexed even when their scoped loaders show no articles. |
| `src/lib/blog/safe-blog-queries.ts:1550-1552` | Sitemap DB row cap is 50,000 and slug page size is 2,000. | Sitemap is designed to page through a large corpus. |
| `src/lib/blog/safe-blog-queries.ts:1560-1627` | Sitemap slug fetches DB rows in 2,000-row pages up to 50,000. | Not capped to hundreds. |
| `src/lib/blog/safe-blog-queries.ts:1640-1670` | Sitemap supplement rows include static and long-tail rows not shadowed by live DB slugs. | Static-only content can still enter sitemap if not shadowed by DB. |

## Publication And Recovery Caps

| Evidence | Finding | Impact |
|---|---|---|
| `src/lib/blog/blog-publish-scheduler.ts:29-42` | Scheduled publisher considers up to 500 due posts per run. | Operational publication throughput cap, not a display cap. |
| `src/lib/blog/blog-recover-missed-posts.ts:66-80` | Missed-post recovery defaults to 5 and caps requested recovery at 50 scheduled candidates. | Recovery can take many runs for a large backlog. |
| `src/lib/blog/blog-recover-missed-posts.ts:82-95` | Failed recovery fetches `need * 3` and then `.slice(0, need)`. | Additional recovery cap after filtering for body length. |

## Answer To The Core Question

Thousands of articles do exist, and the global blog index is not currently limited to only hundreds. With 4,217 live DB rows and the 5,000-row merge cap, the global `/blog` surface should be able to expose the live and supplement corpus through pagination.

The real surfacing defect is scoped discovery:

1. Most live blog rows have `careerSlug = null`.
2. RN and regional hubs query by explicit `careerSlug`.
3. Scoped queries do not merge static supplement rows.
4. Localized loaders require exact locale, region, profession, and exam metadata.

That means the content can exist, be routable, and be in global/indexable surfaces while still being absent from RN/RPN/regional/local hub experiences.

## Recommendations

1. Backfill `careerSlug`, `exam`, `profession`, region, and locale metadata for recovered blog rows where classification is clear.
2. Add scoped hub fallback logic that can include relevant `careerSlug = null` rows by taxonomy, category, tags, or canonical pathway metadata.
3. Add a diagnostics panel or scheduled report comparing global live rows against each scoped hub count.
4. Replace the 5,000-row merge cliff with cursor-based union pagination before the live CMS corpus exceeds 5,000 rows.
5. Keep the 50-row page-size cap; it is a normal pagination safeguard, not the source of hidden content.
