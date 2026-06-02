# Post-Fix Production 504 Verification

Generated: 2026-06-01

## Deployment Status

The fixed build has been validated locally but has not been verified as deployed in production during this run.

```text
npm run build:production
status: PASS
standalone artifact: verified
```

## Current Live At-Rest Probe

| URL | Status | Response Time | Origin Status |
|---|---:|---:|---:|
| `/` | 200 | 0.656 s | 200 |
| `/healthz` | 200 | 0.099 s | 200 |
| `/readyz` | 200 | 0.181 s | 200 |
| `/blog` | 200 | 0.012 s | 200 |
| `/sitemap.xml` | 200 | 0.012 s | 200 |
| `/sitemap-blog.xml` | 200 | 0.011 s | 200 |

## Current Crawl Probe

100 URL crawl at concurrency 12:

| Metric | Result |
|---|---:|
| URLs audited | 100 |
| HTTP 200 | 98 |
| HTTP 504 | 1 |
| Fetch timeout | 1 |
| Upstream failures | 0 |
| p50 | 14,390 ms |
| p95 | 20,003 ms |
| Max | 20,006 ms |

Known failures from this sample:

- `/nclex-next-gen-question-types`: HTTP 504, origin status 502
- `/best-nclex-prep-course`: fetch timeout at 20,003 ms

## Full Crawl Status

The required full 7,918 URL post-fix production crawl was not run because the fixed build has not been confirmed deployed.

## Verdict

NO-GO.

Required before GO:

1. Deploy this build.
2. Confirm `/healthz` and `/readyz` are served by the hardened code.
3. Rerun the full production crawl.
4. Verify 504 count is 0 and total 5xx count is under 50.

