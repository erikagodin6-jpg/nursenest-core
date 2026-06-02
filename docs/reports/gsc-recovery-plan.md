# GSC Recovery Plan

Generated: 2026-06-01T19:09:32.412Z

## Decision

**NO-GO for Search Console revalidation/submission.**

Previous Search Console state reported 8,120+ server errors. The current live audit still shows 7491 HTTP 504s, 87 fetch aborts, and 2 HTTP 520s across 7871 sitemap URLs. Bulk URL submission now would waste crawl budget and reinforce 5xx signals.

## Revalidation Gates

| Gate | Status |
| --- | --- |
| Production health probes 200 | Pass |
| 504 count = 0 | Fail (7491) |
| 5xx count < 50 | Fail (7493) |
| Canonical critical failures = 0 | Pending deploy validation |
| Orphan count <1% | Not certifiable |
| Hub-linked articles 100% | Not certifiable |

## URL Submission Lists

A provisional `highest-value-1000-urls.csv` was generated from currently successful sampled/indexable rows only. It contains 288 URLs, not 1000, because only 288 rows were fully indexable in the current production crawl sample.

Do not submit these until the certification report is GO.

## Phased Plan After GO

- Batch 1: top 100 RN/RPN/NP/high-conversion pathway and article URLs.
- Batch 2: next 250 authority/blog/lesson pages with strong commercial or clinical intent.
- Batch 3: remaining 650 long-tail and supporting cluster URLs.
