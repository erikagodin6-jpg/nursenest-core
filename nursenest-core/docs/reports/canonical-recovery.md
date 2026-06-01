# Canonical Recovery

Generated: 2026-06-01T19:01:59.229Z

Current live production canonical failures among sitemap URLs: 3.

CSV: `reports/production-seo-current/canonical-failures.csv`

Recovery rule:

- Every indexable HTML page must emit a self-canonical URL matching the final normalized sitemap URL.
- Canonicals must not point to redirected, noindexed, or non-200 URLs.

Verdict: canonical fixes are required before GSC GO.
