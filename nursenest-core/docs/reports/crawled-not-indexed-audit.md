# Crawled - Currently Not Indexed Audit

Generated: 2026-05-30T04:51:15.900Z

## Search Console Signal

- Reported Crawled - Currently Not Indexed: 718
- URL export status: No local GSC URL CSV exports found. Reports use the aggregate counts from the prompt plus source/sitemap/robots analysis. Export affected URLs from GSC into data/gsc-indexing/ for frequency-accurate grouping.

## Top Templates

_No Search Console URL export rows were available for this issue._

## Likely Local Causes To Test

| Cause | Evidence To Collect | Remediation |
| --- | --- | --- |
| Thin programmatic pages | Word count, repeated title/description, low unique body copy | Add unique educator-authored sections and internal links. |
| Duplicate canonical intent | Canonical differs from page purpose or multiple pages target same query | Consolidate or strengthen canonical cluster. |
| Weak internal linking | Page is sitemap-only or orphan-like | Add contextual links from hubs, lessons, related questions, and blog clusters. |
| Missing schema/FAQ | No structured data on high-value guide pages | Add relevant FAQ/Breadcrumb/WebPage schema. |
| Crawl-budget waste | Auth/noindex/private URLs getting discovered | Remove from internal links and sitemap candidates. |

## Required Next Run With GSC Export

Place the 718 URL export at `data/gsc-indexing/crawled-not-indexed.csv` and rerun this audit. That will allow per-template word-count and internal-link checks instead of aggregate-only triage.
