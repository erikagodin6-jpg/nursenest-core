# Production Origin 504 Root Cause

Generated: 2026-06-01

## Incident Summary

The latest production crawl reported 7,918 sitemap URLs crawled with 6,828 HTTP 504 responses. The failure pattern was asymmetric:

- `/blog`, `/blog?page=2`, `/blog?page=5`, `/blog?page=10`, `/sitemap.xml`, and `/sitemap-blog.xml` returned 200.
- `/`, `/healthz`, and `/readyz` were reported as failing during the crawl window.

This is a runtime/origin-health incident, not an SEO metadata incident.

## Exact Failure Mode

Production logs showed the startup watchdog intercepting readiness traffic long after boot:

```text
startup_watchdog bootstrap_healthz_intercepted
pathname=/readyz
handlersReady=false
msSinceBoot=1039513
```

The same pattern repeated above 1,000 seconds after boot. That means at least one runtime readiness path was still treating public `/readyz` as not handler-ready while the application was already serving other routes.

## Additional Crawl-Load Evidence

A 100 URL crawl at concurrency 12 against production completed with:

- 98 HTTP 200
- 1 HTTP 504
- 1 fetch timeout
- p50: 14,390 ms
- p95: 20,003 ms
- `/healthz` before: 200 in 55 ms
- `/readyz` before: 200 in 74 ms
- `/healthz` after: 200 in 867 ms
- `/readyz` after: 200 in 891 ms

The 100 URL run did not reproduce systemic `origin_no_healthy_upstream`, but it did prove the origin becomes very slow under even modest crawl pressure.

## Root Cause Classification

Primary root cause:

Runtime readiness ambiguity plus origin saturation under crawl load.

Contributing cause:

The shared marketing layout synchronously loaded and merged a large marketing i18n bundle on public marketing routes. Production logs showed:

```text
marketing layout after messages {"locale":"en","messageCount":8937}
```

That work was repeated across many public page requests during crawls. Since `/blog` and sitemaps are cached, they continued to return 200 while uncached or less-cached public routes saturated the single origin.

## Code Paths

- Readiness route: `src/app/(runtime)/readyz/route.ts`
- Bootstrap runtime: `scripts/start-standalone.mjs`
- Marketing layout: `src/app/(marketing)/(default)/layout.tsx`
- Marketing message loader: `src/lib/marketing-i18n/load-marketing-message-shards.ts`

## Fix Applied

1. `/readyz` now performs only a bounded database readiness check with a 450 ms timeout.
2. `/readyz` logs slow/failing probes server-side and returns 503 only when required readiness fails.
3. `/healthz` remains lightweight process liveness.
4. Marketing i18n shard loading now uses in-process caches for shard JSON and merged locale bundles, removing repeated filesystem reads and JSON parsing from public route renders.
5. Production build blockers were removed so the runtime fix can deploy.

## Verification

Production at-rest probe after investigation:

| Endpoint | Status | Time |
|---|---:|---:|
| `/` | 200 | 0.656 s |
| `/healthz` | 200 | 0.099 s |
| `/readyz` | 200 | 0.181 s |
| `/blog` | 200 | 0.012 s |
| `/sitemap.xml` | 200 | 0.012 s |
| `/sitemap-blog.xml` | 200 | 0.011 s |

Local production build:

```text
npm run build:production
status: PASS
standalone artifact: verified
sitemap validation: PASS
```

## Current Verdict

NO-GO for GSC revalidation until the fixed build is deployed and the full production crawl is rerun.

