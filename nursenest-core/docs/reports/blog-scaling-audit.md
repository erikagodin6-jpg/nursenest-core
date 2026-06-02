# Blog Scaling Audit

Generated: 2026-06-02

## Target

Support 100,000+ indexed pages without crawler-driven origin saturation.

## Current Strengths

- Public blog count now reads `blog_index_snapshot` or static fallback.
- Default list pagination uses `take + 1` when totals are not required.
- Static corpus fallback exists when DB is unavailable.
- Diagnostics and full live merge are opt-in via env flags.

## Scaling Risks

| Area | Risk at 100k pages | Mitigation |
| --- | --- | --- |
| Blog hub/category pages | Crawler bursts can still hit DB list reads by scope. | Precompute category/tag/locale indexes and serve static/ISR pages. |
| Sitemap generation | Full corpus computation can overwhelm CPU/memory. | Split sitemaps, generate from durable snapshot, cache aggressively. |
| Article rendering | Dynamic render for every article becomes expensive. | Static/ISR for stable articles; CDN cache HTML. |
| Related posts/internal links | Runtime lookup can fan out. | Precompute related-link graph. |
| Search/tag filters | Flexible filters degrade with growth. | Materialized facets or dedicated search index when needed. |

## Crawler Guardrails

- Public blog and article pages should be cacheable by CDN.
- Sitemap routes should not touch the live DB on request.
- Category/tag hubs should read snapshot slices.
- Live DB merge should remain disabled for anonymous traffic.

