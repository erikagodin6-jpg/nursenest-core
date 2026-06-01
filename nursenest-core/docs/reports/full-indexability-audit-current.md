# Full Indexability Audit Current

Generated: 2026-06-01T02:26:23.685Z

Scope: all URLs discovered from the current live production sitemap index and child sitemaps. Status checks used bounded HEAD requests after a canonical/noindex HTML sample of 50 URLs.

| Metric | Count |
| --- | ---: |
| Total URLs audited | 7918 |
| HTTP 200 | 1090 |
| HTTP 404 | 0 |
| HTTP 500 | 0 |
| HTTP 504 | 6828 |
| Fetch errors | 0 |
| Canonical failures in sample | 40 |
| Noindex pages in sample | 40 |
| Orphan pages | 0 measured from sitemap-only crawl; hub-link crawl still required |
| Sitemap exclusions | 0 measured from sitemap-only crawl |
| HTTP-200 URLs | 1090 |

Artifacts:

- `reports/production-seo-current/results.json`
- `reports/production-seo-current/non-200-sitemap-urls.csv`
- `reports/production-seo-current/canonical-failures.csv`
- `reports/production-seo-current/orphaned-urls.csv`
- `reports/production-seo-current/missing-from-sitemaps.csv`
