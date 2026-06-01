# Public Route 504 Protection

Generated: 2026-06-01

## Scope

Route families reviewed for this incident:

- Homepage and marketing pages
- Blog
- Sitemaps
- Health endpoints
- Public lesson/question/pathway route families through sitemap crawl evidence

## Findings

Cached routes such as `/blog`, `/sitemap.xml`, and `/sitemap-blog.xml` remained healthy while uncached public route families degraded under crawl load.

The highest-confidence shared bottlenecks found in this pass were:

1. Stale readiness/watchdog ambiguity for `/readyz`.
2. Repeated synchronous marketing i18n shard loading on public marketing routes.
3. Origin capacity saturation under crawl load.

## Protection Implemented

- `/readyz` now has a bounded dependency check and no content loading.
- Marketing i18n shards are cached in-process to reduce repeated per-request filesystem and parsing work.
- Production build blockers were removed so the protection can ship.

## Protection Not Applied In This Pass

No route family was removed from production sitemap output in this branch.

Reason: the dominant failure is shared origin runtime saturation, not proven invalid URLs. Quarantining large sitemap segments before the runtime fix is deployed would mask the infrastructure incident and could remove valid public pages from crawl discovery.

## Required Next Step

Deploy this branch, then rerun the production crawl. Only route families that still produce systemic 5xx after the runtime fix should receive route-specific fallback/quarantine work.

