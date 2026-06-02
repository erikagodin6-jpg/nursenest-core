# Internal Link Recovery

Generated: 2026-06-01T19:09:32.412Z

## Verdict

**Blocked by production 5xx crawl state.**

No automatic link graph mutation was performed because 7580 sitemap URLs returned non-200 responses. A link graph built from this production state would incorrectly classify reachable pages as orphaned.

## Existing Code Evidence

The blog article template already includes several required discovery primitives:

- Breadcrumb chain via `BreadcrumbBar` and blog breadcrumb helpers.
- Category/topic badge links via `BlogTopicBadge`.
- Related reading via `BlogRelatedReadingSection`.
- Lesson/tool CTAs via `BlogPostDistributionFooter`.
- Body auto-linking via `applyAutoLinksToHtml`.
- BlogPosting and FAQ schema via `BlogPostingJsonLd` and `BlogFaqPageJsonLd`.

## Metrics

| Metric | Value |
| --- | ---: |
| Orphan count before | Not certifiable under current 5xx state |
| Orphan count after | Not modified |
| Links created | 0 |
| Goal state | <1% orphaned content after stable crawl |

## Next Safe Step

After 504 count is 0, run a graph crawl from homepage, blog hub, category pages, topic hubs, and authority clusters. Only then create missing category/topic/related/previous/next article links.

CSV placeholder: `docs/reports/orphaned-pages.csv` lists pages whose orphan status is blocked by non-200 crawl state.
