# Canonical Recovery

Generated: 2026-06-01T02:26:23.690Z

Current live production canonical failures in the sampled sitemap HTML URLs: 40.

CSV: `reports/production-seo-current/canonical-failures.csv`

Recovery rule:

- Every indexable HTML page must emit a self-canonical URL matching the final normalized sitemap URL.
- Canonicals must not point to redirected, noindexed, or non-200 URLs.

Verdict: canonical fixes are required before GSC GO, but origin recovery is the higher priority because the current live sitemap crawl found thousands of 504 responses.
