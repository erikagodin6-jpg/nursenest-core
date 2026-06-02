# Database Pressure Audit

Generated: 2026-06-01

## Scope

This pass audited source-level DB pressure and reused production incident evidence. It did not run direct production SQL against `pg_stat_activity`, `pg_stat_statements`, or pooler internals from this workstation.

## Production Evidence

Prior origin investigation recorded:

- `pathway_lessons` DB timings around ~0.6s to ~2.7s.
- `pathway_lessons db_timeout` fallback events.
- Blog metadata generation at ~3.2s to ~7.2s.
- Blog page rendering at ~2.5s to ~4.2s.
- 606 upstream failures during a 1,000 URL crawl at concurrency 12.

## Current App Protections

| Protection | Location | Current behavior |
| --- | --- | --- |
| Shared Prisma singleton | `src/lib/db.server.ts` | Prevents duplicate Prisma clients in normal server code and warns if multiple clients are constructed. |
| Slow query logging | `src/lib/db/prisma-slow-query-log.ts` | Production default logs Prisma query fingerprints above 250ms. |
| Query context | `src/lib/server/prisma-query-context.ts` | Allows route/correlation context where API wrappers use it. |
| DB semaphore | `src/lib/server/db-query-semaphore.ts` | Caps app-level concurrent Prisma operations, default 22. |
| Blog DB queue | `src/lib/blog/safe-blog-queries.ts` | Caps public blog DB reads, default 4. |
| Safe read timeouts | `src/lib/prisma/safe-reads.ts`, `src/lib/db/safe-database.ts` | Falls back instead of crashing optional public reads. |

## Pressure Sources

| Source | Query pattern | Pressure risk |
| --- | --- | --- |
| Homepage stats cache miss | 6 `count` queries + 2 `groupBy` queries in parallel | Can create burst pressure during cold cache or deployment. |
| Blog detail route | Metadata and body resolve same slug via public blog loaders | Duplicated slug lookup and body/meta work per uncached page. |
| Blog index/sitemap/listing | Count/list/fallback probes with bounded timeouts | Slow DB can queue blog reads and inflate response time. |
| Pathway lesson hubs | Lesson verification and pathway lesson queries | Prior logs show slow reads and timeouts under crawl. |
| Inline content | `inlineContentEntry.findMany` per key set on shared-cache miss | Low query count, but many cold public URLs can multiply misses. |
| Question/CAT/practice pools | Counts, `findMany`, pool filtering, and adaptive eligibility | Mostly authenticated, but expensive when crawlers hit public study pages and app traffic overlaps. |

## N+1 / Duplicate Read Findings

| Finding | Evidence | Recommendation |
| --- | --- | --- |
| Blog detail duplicate slug work | `generateMetadata` checks visibility and loads meta; page body then loads full post. | Add request-level cache around scoped blog slug resolution or combine visibility/meta/body cache for one slug. |
| Homepage stats fan-out | `computePublicHomeStats` runs multiple aggregate queries on cache miss. | Keep shared cache warm after deploy; use static fallback for crawler traffic where exact counts are not critical. |
| Public study page payloads | Large 1.5-3.2 MB responses imply expensive RSC serialization and route memory allocation. | Split noncritical sections out of initial server payload and defer client-only/secondary content. |
| Pathway lesson verification | Existing guard caps verification, but prior logs still show `pathway_lessons db_timeout`. | Confirm indexes and reduce synchronous verification on public crawler routes. |

## Missing Measurements

Direct production DB metrics still needed:

- Active connection count during crawl.
- Pool wait time / pooler saturation.
- `pg_stat_statements` slowest normalized queries.
- `EXPLAIN (ANALYZE, BUFFERS)` for top blog, pathway lesson, and question pool queries.
- Prisma engine connection limit and effective pool size in the deployed environment.

## Database Verdict

Database pressure is a contributing factor, especially on cold public page generation. It is not the only factor: even static-ish public route payloads are large enough to create CPU, memory, and serialization pressure under crawl load.

