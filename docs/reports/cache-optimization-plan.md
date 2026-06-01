# Cache Optimization Plan

Generated: 2026-06-01

## Goal

Reduce public page generation time and origin work so a 2,000 URL crawl can pass with p95 under 2s, p99 under 5s, and zero upstream failures.

## Highest-Value Opportunities

| Priority | Surface | Current behavior | Recommendation | Expected impact |
| ---: | --- | --- | --- | --- |
| 1 | Blog detail metadata/body | Metadata and body can resolve the same slug separately. ISR is 1h, but cold misses across many URLs are expensive. | Add request-level cache for scoped blog slug resolution and ensure metadata/body share the same DB/static row per request. | Cuts duplicate DB and parsing work on cold blog hits. |
| 2 | Public study page payloads | Questions, flashcards, NP, lessons, and localized pages return ~1.5-3.2 MB at low pressure. | Move below-fold/secondary sections out of initial RSC payload; defer large inventories and carousels; audit Flight payload composition. | Reduces CPU, memory allocation, bandwidth, and crawl time. |
| 3 | Localized pages | `/fr` and `/es` return over 3 MB each. | Load only route-critical i18n shards; avoid embedding full locale dictionaries in server payload. | Large reduction for localized crawl sets. |
| 4 | Homepage stats | Shared cache miss runs aggregate fan-out. | Warm stats cache post-deploy; prefer static degraded proof counters for anonymous crawler requests if shared cache misses. | Prevents crawler bursts from triggering aggregate storms. |
| 5 | Pathway lesson hubs/details | DB verification and lesson loaders can time out under load. | Keep verification caps low, add cache tags around published lesson index, and precompute public lesson index snapshots. | Stabilizes lesson sitemap traffic. |
| 6 | Sitemaps | Current sitemap routes are fast and cacheable. | Keep `s-maxage`/ISR; avoid adding live DB fan-out to sitemap routes. | Protects a currently healthy surface. |

## Static / Cached / Pre-render Candidates

| Content | Candidate strategy |
| --- | --- |
| Blog posts | ISR plus request-level row cache; optionally prewarm top 500 sitemap blog URLs after deploy. |
| Static marketing policy pages | Force static where no cookies/session are needed; keep metadata filesystem/i18n only. |
| Localized homepage routes | Static/ISR with minimal shard payload and no cookie dependency where possible. |
| Pre-nursing lessons | Keep registry/static modules; cache inline content key sets; avoid per-card DB reads. |
| Public question landing pages | ISR and payload trimming; defer pathway cards that are not first viewport. |
| Public flashcard pages | ISR and client/API defer for inventory counts. |
| Homepage stats | Shared cache plus deploy warmup; static fallback for anonymous crawler path. |
| Sitemaps | Continue static/ISR segmented routes; keep DB-backed enrichment bounded and skipped during build. |

## Do Not Cache Blindly

- Authenticated learner progress, entitlements, subscription state, and paywall gates.
- Admin/staff pages.
- Personalized recommendations and adaptive study loops.
- User-specific flashcard queues, CAT state, and practice sessions.

## Implementation Order

1. Add request-scoped cache to blog slug resolution.
2. Add payload budget reports for public marketing route families.
3. Trim localized route payloads by shard and route.
4. Warm homepage stats and blog caches after deploy.
5. Re-run 100/500/1,000 URL crawl at concurrency 4 and 8 before returning to concurrency 12.

