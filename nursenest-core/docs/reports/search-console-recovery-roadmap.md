# Search Console Recovery Roadmap

Generated: 2026-05-31T22:26:52.433Z

## Critical

| Item | Traffic Impact | Indexation Impact | Implementation Effort | Action |
| --- | --- | --- | --- | --- |
| Remove 5xx/timeouts from sitemap URLs | Very High | Very High | Medium | Run live sitemap verification, fix timeout templates, and keep CI crawl-health blocking regressions. |
| Remove sitemap/noindex mismatches | High | Very High | Low-Medium | Any noindex page must be removed from XML sitemap or made indexable if public and valuable. |
| Load GSC URL exports for blocked/noindex/duplicates/crawled-not-indexed | High | High | Low | Place CSVs in data/gsc-indexing/ and rerun audit for exact URL lists. |

## High

| Item | Traffic Impact | Indexation Impact | Implementation Effort | Action |
| --- | --- | --- | --- | --- |
| Canonicalize duplicate-prone exam and topic pages | High | High | Medium | Self-canonical distinct pages; merge or canonicalize thin variants. |
| Strengthen question pages as educational resources | High | High | Medium | Add rationale, clinical application, exam strategy, related content, and schema. |
| Improve internal links for lessons/questions/glossary/simulations | High | Medium-High | Medium | Add breadcrumbs, related learning, hub connections, and topic clusters. |

## Medium

| Item | Traffic Impact | Indexation Impact | Implementation Effort | Action |
| --- | --- | --- | --- | --- |
| Schema validation by page type | Medium | Medium | Medium | Extract rendered JSON-LD in crawl-health and validate representative page families. |
| Locale publication policy cleanup | Medium | Medium | Medium | Keep incomplete locales noindex/follow and out of sitemaps; publish only complete locale clusters. |
| Long-tail blog duplicate/content-depth pass | Medium | Medium | High | Expand or consolidate thin/boilerplate long-tail articles. |

## Low

| Item | Traffic Impact | Indexation Impact | Implementation Effort | Action |
| --- | --- | --- | --- | --- |
| Robots documentation and periodic guard | Low | Medium | Low | Keep private-only robots rules and validate single sitemap directive. |
| Search Console validation checklist automation | Low | Medium | Low | Generate validation steps after every SEO recovery audit run. |
