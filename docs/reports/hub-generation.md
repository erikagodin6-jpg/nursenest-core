# Hub Generation

Generated: 2026-06-01T19:09:32.412Z

## Verdict

**Authority hub infrastructure exists; new hub generation is deferred until production crawlability is stable.**

The live sitemap already exposes `sitemap-authority-clusters.xml` with 96 URLs, and the codebase contains reusable hub and authority templates. However, creating or expanding hubs before resolving 7491 HTTP 504s would add crawl pressure to an unhealthy origin.

## Existing Hub Architecture

- `src/components/seo/exam-cluster-hub-page.tsx`: reusable exam cluster hub with FAQ and WebPage schema.
- `src/components/seo/authority-cluster-page.tsx`: cluster page with related assets, FAQ, Article schema, breadcrumbs, and CTAs.
- `src/lib/seo/authority-cluster-pages.ts`: authority cluster registry.
- `src/lib/authority/healthcare-authority-content-engine.ts`: pillar/cluster ownership, knowledge graph, readiness scoring.
- `src/app/sitemap-authority-clusters.xml/route.ts`: authority cluster sitemap segment.

## Requested Hub Families

| Family | Status | Action |
| --- | --- | --- |
| RN hubs | Partially represented by pathway and authority cluster infrastructure | Validate after 5xx recovery, then add missing topic hubs. |
| RPN hubs | Partially represented by REx-PN cluster infrastructure | Validate after 5xx recovery. |
| NP hubs | NP specialty cluster infrastructure exists | Validate after 5xx recovery. |
| NCLEX-PN hubs | Needs post-stability hub gap pass | Defer generation. |
| Allied hubs | Allied sitemap and profession hubs exist | Validate after 5xx recovery. |

## Current Gate

No new public hub pages were generated in this pass. The next hub sprint should begin only after production returns 200 for sitemap-scale crawling.
