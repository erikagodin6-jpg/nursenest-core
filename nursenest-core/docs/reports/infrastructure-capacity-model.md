# Infrastructure Capacity Model

Generated: 2026-06-02

## Live DigitalOcean Findings

The DigitalOcean app spec was reachable during this audit. Sanitized findings:

| Component | Observed setting |
| --- | --- |
| Web instance size | `apps-s-2vcpu-4gb` |
| Autoscaling bounds | min 2 / max 4 |
| Autoscaling metrics | empty metrics block |
| Runtime command | `node scripts/start-production.mjs` |
| Runtime heap cap | `NODE_MAX_OLD_SPACE_SIZE_MB=768` |
| Build heap cap | `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB=4096` |
| Health check | `/readyz`, 15s period, 15s timeout, 12 failure threshold |
| Database URL shape | malformed redacted URL shape observed: duplicated query-string fragment / quote in value |

User-stated current platform target for this audit: 2 vCPU, 8 GB RAM. The live app spec shows 2 vCPU / 4 GB per instance with two minimum instances, which provides 4 vCPU / 8 GB aggregate web capacity but only 4 GB RAM per instance.

## Capacity Model

This model is architectural guidance, not a live benchmark.

| Concurrent users | Expected state on current 2 x `apps-s-2vcpu-4gb` web floor | Primary limit | Required posture |
| ---: | --- | --- | --- |
| 50 | Likely sustainable if DB URL and pool are healthy. | DB fanout on learner paths. | Current web floor likely enough; verify DB. |
| 100 | Reasonable target after DB URL/pool verification. | DB pool and dynamic SSR CPU. | Keep min 2; add CPU autoscale metric. |
| 500 | Not safe without query reduction and caching. | Postgres connections, flashcard/CAT session builds, analytics. | Max 4 may be enough only with DB pooling and snapshots. |
| 1000 | Requires precomputed inventories and async analytics. | CAT/flashcard/session persistence and dashboard aggregates. | Raise max instances beyond 4 and scale DB/cache. |
| 5000 | Requires mature cache/pool/background architecture. | DB write/read amplification and crawler/user concurrency overlap. | 6+ app instances, larger DB, CDN-heavy public routes, queues. |

## Saturation Points

- CPU saturates first on dynamic public rendering, CAT selection bursts, and large catalog normalization.
- Memory saturates through large in-process catalogs, Next.js server heap, and concurrent response payloads. The observed `NODE_MAX_OLD_SPACE_SIZE_MB=768` is conservative for a 4 GB instance and can constrain large catalog/render paths before container RAM is fully used.
- Connection pools saturate when multiple app instances each open Prisma pools against a small Postgres plan.
- Response times degrade when DB waits combine with dynamic rendering, causing readiness and upstream risk.

## Recommended Simple Architecture

- Web: keep min 2 instances, add CPU autoscaling metric, and raise max to 6+ before 1000+ user tests.
- DB: managed Postgres with enough connections, PgBouncer/session pooling where compatible.
- Cache: Redis for inventory, learner-private reads, CAT/session candidates, and public snapshots.
- CDN: cache static/public lesson/blog/sitemap assets and HTML where safe.
- Jobs: separate worker process or scheduled job runner with DB-health throttling.

## Immediate Infrastructure Fixes

1. Repair the malformed redacted `DATABASE_URL` value in App Platform before using the deployment for any publication or load certification.
2. Add an autoscaling CPU metric policy; current min/max bounds exist, but metrics are empty.
3. Reconcile runtime heap cap with instance size. A 768 MB Node heap may protect the container, but it also limits large Next.js/catalog paths.
4. Confirm Postgres plan and max connection count before increasing max web instances.
