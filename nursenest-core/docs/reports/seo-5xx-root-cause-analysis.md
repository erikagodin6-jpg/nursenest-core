# SEO 5xx Root Cause Analysis

Generated: 2026-06-01T01:26:47.645Z

## Evidence Sources

- Search Console aggregate count supplied in prompt: 8,122 Server Errors (5xx).
- Local GSC 5xx URL export: Unavailable in this workspace.
- Live production sitemap verifier evidence: 17 timeout URLs observed on 2026-05-30.
- Production exception logs / APM traces: Unable To Verify from this workspace. Export `crawl_surface public_route`, `exam_pathway_hub hub_data_load_timeout`, route 5xx logs, and platform request logs to complete exact exception attribution.

## Route Template Analysis

| Route Template | Route Type | Affected URLs In Evidence | Examples | Verified Cause | Required Fix |
| --- | --- | --- | --- | --- | --- |
| /canada/rn/nclex-rn/questions | Questions | 1 | https://nursenest.ca/canada/rn/nclex-rn/questions | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Keep public question hubs DB-budgeted; degrade to cached/skeleton aggregates if Prisma reads exceed route budget. |
| /us/rn/nclex-rn/questions | Questions | 1 | https://nursenest.ca/us/rn/nclex-rn/questions | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Keep public question hubs DB-budgeted; degrade to cached/skeleton aggregates if Prisma reads exceed route budget. |
| /us/np/fnp/questions | Questions | 1 | https://nursenest.ca/us/np/fnp/questions | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Keep public question hubs DB-budgeted; degrade to cached/skeleton aggregates if Prisma reads exceed route budget. |
| /us/np/pmhnp/questions | Questions | 1 | https://nursenest.ca/us/np/pmhnp/questions | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Keep public question hubs DB-budgeted; degrade to cached/skeleton aggregates if Prisma reads exceed route budget. |
| /us/np/whnp/questions | Questions | 1 | https://nursenest.ca/us/np/whnp/questions | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Keep public question hubs DB-budgeted; degrade to cached/skeleton aggregates if Prisma reads exceed route budget. |
| /us/np/pnp-pc | Marketing Pages | 1 | https://nursenest.ca/us/np/pnp-pc | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Audit SSR data dependencies and ensure missing content falls back to 404 or degraded public shell. |
| /us/np/pnp-pc/pricing | Marketing Pages | 1 | https://nursenest.ca/us/np/pnp-pc/pricing | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Audit SSR data dependencies and ensure missing content falls back to 404 or degraded public shell. |
| /us/np/pnp-pc/questions | Questions | 1 | https://nursenest.ca/us/np/pnp-pc/questions | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Keep public question hubs DB-budgeted; degrade to cached/skeleton aggregates if Prisma reads exceed route budget. |
| /us/rn/nclex-rn/test-bank | Practice Tests | 1 | https://nursenest.ca/us/rn/nclex-rn/test-bank | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Missing test-bank config must return 404/notFound, not throw. Keep page rendering static and DB-free where possible. |
| /canada/rpn/rex-pn/test-bank | Practice Tests | 1 | https://nursenest.ca/canada/rpn/rex-pn/test-bank | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Missing test-bank config must return 404/notFound, not throw. Keep page rendering static and DB-free where possible. |
| /canada/np/cnple/test-bank | Practice Tests | 1 | https://nursenest.ca/canada/np/cnple/test-bank | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Missing test-bank config must return 404/notFound, not throw. Keep page rendering static and DB-free where possible. |
| /us/np/fnp/test-bank | Practice Tests | 1 | https://nursenest.ca/us/np/fnp/test-bank | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Missing test-bank config must return 404/notFound, not throw. Keep page rendering static and DB-free where possible. |
| /us/np/agpcnp/test-bank | Practice Tests | 1 | https://nursenest.ca/us/np/agpcnp/test-bank | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Missing test-bank config must return 404/notFound, not throw. Keep page rendering static and DB-free where possible. |
| /canada/pn/rex-pn/rex-pn-practice-questions-cardiovascular | Questions | 1 | https://nursenest.ca/canada/pn/rex-pn/rex-pn-practice-questions-cardiovascular | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Keep public question hubs DB-budgeted; degrade to cached/skeleton aggregates if Prisma reads exceed route budget. |
| /canada/pn/rex-pn/rex-pn-practice-questions-respiratory | Questions | 1 | https://nursenest.ca/canada/pn/rex-pn/rex-pn-practice-questions-respiratory | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Keep public question hubs DB-budgeted; degrade to cached/skeleton aggregates if Prisma reads exceed route budget. |
| /canada/pn/rex-pn/rex-pn-practice-questions-gastrointestinal | Questions | 1 | https://nursenest.ca/canada/pn/rex-pn/rex-pn-practice-questions-gastrointestinal | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Keep public question hubs DB-budgeted; degrade to cached/skeleton aggregates if Prisma reads exceed route budget. |
| /canada/pn/rex-pn/rex-pn-practice-questions-neurological | Questions | 1 | https://nursenest.ca/canada/pn/rex-pn/rex-pn-practice-questions-neurological | Live production sitemap verifier observed timeout. Exact exception unavailable without production logs. | Keep public question hubs DB-budgeted; degrade to cached/skeleton aggregates if Prisma reads exceed route budget. |

## Root-Cause Findings Implemented In This Pass

| Surface | Failure Mode | Fix |
| --- | --- | --- |
| Public pathway question hubs | Body-system aggregate DB reads could hold the route open until crawler timeout. | Added a bounded database fallback for pathway practice body-system aggregates. Slow/unreachable DB now degrades to skeleton aggregates instead of holding public crawler responses. |
| Static test-bank pages | Missing page config threw an exception, which produces a 500. | Missing test-bank config now calls `notFound()` so missing content returns 404 instead of 500. |
| Crawl regression seeds | Known failing production route classes were not all represented in the seed set. | Added question hubs, test-bank pages, NP pages, REx-PN topic pages, lessons, glossary, about, and localized public routes to the crawl-health seed list. |

## Dynamic Route Hardening Contract

- Missing content must return `notFound()`, a 404 route, or a degraded public shell.
- Missing content must never throw an uncaught exception.
- Public crawler routes must not perform unbounded DB scans.
- Optional marketing aggregates must use cached reads, bounded reads, or safe fallback data.
- Sitemap URLs must return 200 indexable HTML/XML, not 5xx, redirects, or noindex HTML.

## Crawler Route Budgets

| Route Class | Budget | Required Degradation |
| --- | --- | --- |
| Sitemap index and robots | 500 ms target, DB-free | Static fallback XML/text if invariants fail. |
| Public marketing hubs | 2500 ms max before slow telemetry | Render shell with cached/skeleton optional blocks. |
| Question hubs | 2500 ms max before slow telemetry | Render launcher with skeleton body-system counts if aggregate reads time out. |
| Test-bank pages | Static/content-registry only | Return 404 for missing registry entries. |
| Blog/lesson/topic pages | 2500 ms max before slow telemetry | Return 404 for missing slug; use cached snapshots for optional related content. |

## Remaining Verification Required

1. Add the GSC 5xx export to `data/gsc-indexing/5xx.csv`.
2. Export production request/error logs for the affected URLs.
3. Rerun `npm run audit:gsc-indexing`.
4. Run `PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://nursenest.ca npm run qa:crawl-health:remote`.
5. Run `SITEMAP_VERIFY_MAX_URLS=5000 SITEMAP_VERIFY_CONCURRENCY=4 npm run verify:sitemap`.
