# /readyz Dependency Audit

Generated: 2026-06-01

## Executive Summary

`/readyz` was previously coupled to a Prisma database probe. Under sustained crawl load, a saturated DB pool could make readiness fail even while the Node process and Next request handlers were healthy. That failure mode matches the observed pattern: crawl traffic increases latency, DB pressure rises, readiness returns non-200, and the platform can mark the instance unhealthy.

Readiness is now intentionally cheap:

- Process alive
- Next route handler reached
- In standalone production, parent bootstrap has already marked handlers registered before proxying `/readyz`

Expensive dependency diagnostics moved to:

- `/healthz/deep`

## Readiness Routes Audited

| Route | Previous Behavior | New Behavior | DB Usage | Network Usage | Filesystem Usage | Expected Cost |
|---|---|---|---:|---:|---:|---:|
| `/readyz` | `checkDatabaseReadiness(450)` → Prisma `SELECT 1` | returns `ready` after handler reached | None | None | None | < 25ms |
| `HEAD /readyz` | `checkDatabaseReadiness(450)` → Prisma `SELECT 1` | returns 200 after handler reached | None | None | None | < 25ms |
| `/api/health/ready` | `checkDatabaseReadiness(timeout)` + logging + DB failure metrics | JSON cheap readiness alias | None | None | None | < 25ms |
| `/api/healthz` | alias to `/api/health/ready`, therefore DB-backed | alias to cheap readiness | None | None | None | < 25ms |
| `/api/health` | liveness plus `DATABASE_URL` fingerprint generation and console log | pure liveness JSON | None | None | None | < 25ms |

## Deep Diagnostic Route

| Route | Purpose | DB Usage | Network Usage | Filesystem Usage | Timeout | Probe Role |
|---|---|---:|---:|---:|---:|---|
| `/healthz/deep` | diagnostics only | Prisma `SELECT 1` via `checkDatabaseReadiness` | DB socket only | None | 2500ms | Never load balancer readiness |

## Removed Readiness Dependencies

| Dependency | Previous Entry Point | Cost | Risk Under Load | New Location |
|---|---|---:|---|---|
| Prisma import/client | `/readyz`, `/api/health/ready`, `/api/healthz` | module load + pool access | Pool wait can exceed probe timeout | `/healthz/deep` |
| `prisma.$queryRaw\`SELECT 1\`` | `/readyz`, `/api/health/ready`, `/api/healthz` | DB round trip | DB saturation ejects healthy app | `/healthz/deep` |
| DB failure metrics | `/api/health/ready` | sync/async observability work | readiness path becomes coupled to diagnostics | removed from readiness |
| DB URL fingerprinting | `/api/health` | env parse + SHA-256 | unnecessary hot-path work | removed from liveness |
| Console hit log | `/api/health` | stdout IO | log pressure during probe bursts | removed |

## Implementation Notes

- `/readyz` does not import Prisma, CMS loaders, blog loaders, question counts, sitemap builders, cache warmers, or filesystem readers.
- `scripts/start-standalone.mjs` still gates public `/readyz` before the child app is ready. Before handlers are registered, the parent returns 503. After the internal bootstrap probe succeeds, requests proxy to the cheap Next `/readyz` handler.
- Watchdog forced fallback still does not flip readiness to 200; only the internal probe marks handlers ready.

## DigitalOcean Readiness Recommendation

After deploying this readiness change:

- readiness path: `/readyz`
- timeout: `5s`
- failure threshold: `20`
- liveness path: `/healthz`
- deep diagnostics: `/healthz/deep` only for manual/admin monitoring

Do not configure `/healthz/deep`, `/api/health/ready`, blog pages, homepage, sitemap routes, or any DB-backed endpoint as platform readiness.

## GO / NO-GO

GO for readiness probe behavior after deployment if:

- `/readyz` p95 < 25ms
- `/readyz` p99 < 50ms during crawl
- `/readyz` has zero DB queries
- `/healthz/deep` may fail without removing an instance from rotation
