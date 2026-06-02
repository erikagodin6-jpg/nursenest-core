# Homepage Failure Trace

Generated: 2026-06-01

## Route Mapping

The public `/` route is served by:

- `nursenest-core/src/app/(marketing)/(default)/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/layout.tsx`

There is no physical `src/app/page.tsx`; the App Router route group maps `(marketing)/(default)/page.tsx` to `/`.

## Homepage Dependency Trace

### Page Body

`HomePage()` loads:

| Dependency | Source | Runtime Risk | Guard |
|---|---|---:|---|
| Blog teaser | `HomeBlogTeaserSectionAsync` | DB/content query risk | 1000 ms timeout, shell fallback |
| Marketing region | `getMarketingRegionFromCookies` | cookies/headers | `Promise.allSettled`, CA fallback |
| Region cards | `listPublishedHomeGlobalRegionCardIds` | static registry | try/catch fallback |
| WebPage JSON-LD | `buildMarketingWebPageJsonLdProps` | pure/static | no DB |
| Homepage stats | `HomeRestoredWithDeferredStats` | optional DB stats | now skipped + 1200 ms fallback |

### Nested Server Components

`HomeRestoredWithDeferredStats()` loads:

| Dependency | Source | Runtime Risk | Guard |
|---|---|---:|---|
| Public stats | `getHomepagePublicHomeStats()` | DB counts | skipped on `/` during emergency safe mode |
| Server island messages | marketing i18n shards | filesystem/JSON parse | 100 ms fallback + in-process cache |
| Marketing region | cookies | low | `Promise.allSettled` fallback |
| Premium hero/trust | server components | static render | receives safe fallback data |

### Layout

The default marketing layout previously loaded:

- request headers
- viewport hints
- marketing chrome messages
- region cookies
- global region cookies
- public content overrides
- staff session probe in the background
- header/footer chrome

Production logs showed the layout repeatedly loading a large message set during crawl load:

```text
marketing layout after messages {"locale":"en","messageCount":8937}
```

## Failure Evidence

`reports/production-seo-current/results.json` showed:

| Probe | Status | ms | Cache | Upstream |
|---|---:|---:|---|---:|
| `/` | 504 | 66 | MISS | 503 |
| `/healthz` | 504 | 89 | MISS | 503 |
| `/readyz` | 504 | 106 | MISS | 503 |
| `/blog` | 200 | 182 | HIT | 200 |
| `/sitemap.xml` | 200 | 16 | HIT | 200 |
| `/sitemap-blog.xml` | 200 | 61 | HIT | 200 |

The short 504 response times indicate DigitalOcean was returning an unhealthy-origin response quickly, not that the homepage itself spent 30 seconds rendering.

## Root Cause

The homepage failure is best classified as origin/runtime unavailability under crawl load, with homepage-specific contributors:

1. `/` was a cache MISS and required live origin rendering.
2. The shared marketing layout had expensive optional chrome/message work.
3. Optional homepage stats could still wait on the stats component if the DB path stalled.
4. `/healthz` and `/readyz` failing at the same time confirms the runtime instance was unavailable, not only the homepage route.

## Remediation Applied

- `/` now always uses the minimal static marketing shell in the default layout.
- Homepage stats now skip optional DB reads.
- Homepage stats are bounded by a 1200 ms timeout.
- Blog teaser remains bounded by a 1000 ms timeout.
- Marketing i18n shard reads are cached in-process.

## Current Status

At-rest live verification after the prior fix showed `/` returning 200 in 0.656 s. Full post-deploy crawl verification is still required after this safe-mode patch is deployed.

