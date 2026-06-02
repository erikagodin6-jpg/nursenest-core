# GSC 5xx Revalidation Readiness

Generated: 2026-06-01

## Baseline

- Current audit 5xx/504 count: 6,828 of 7,918 sitemap URLs.
- Search Console affected URLs: 8,120+.

## Fix Status

Implemented and build-verified:

- Hardened `/readyz`.
- Cached marketing i18n shard loading.
- Removed production build blockers.

Not yet complete:

- Fixed build has not been confirmed deployed.
- Full post-deploy 7,918 URL crawl has not been rerun.
- 5xx reduction has not been measured after deployment.

## Current At-Rest Health

| Endpoint | Status |
|---|---:|
| `/` | 200 |
| `/healthz` | 200 |
| `/readyz` | 200 |
| `/blog` | 200 |
| `/sitemap.xml` | 200 |
| `/sitemap-blog.xml` | 200 |

## Recommendation

NO-GO for Google Search Console revalidation.

Reason: at-rest health is recovered, but crawl-load stability is not yet proven after deploying the fix.

## GO Criteria

Generate `highest-value-1000-urls.csv` only after:

- Full production crawl completes.
- 504 count is 0.
- Total 5xx count is under 50.
- No route family shows systemic 5xx.

