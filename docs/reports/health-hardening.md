# Health Hardening

Generated: 2026-06-01

## Final Endpoint Contract

### `/healthz`

- Purpose: process liveness.
- Required dependencies: none.
- Success condition: Node process can execute the route.
- Target: under 100 ms.

### `/readyz`

- Purpose: readiness for traffic.
- Required dependencies: bounded DB readiness only.
- Timeout: 450 ms.
- Target: under 500 ms.
- Failure: returns 503 quickly with server-side diagnostics.

## What Was Removed From Probe Risk

Neither endpoint performs:

- Blog queries.
- Sitemap generation.
- Lesson index loading.
- Translation bundle loading.
- User/session lookup.
- Entitlement lookup.
- Analytics or recommendation work.

## Current Probe Evidence

At-rest live probes:

| Endpoint | Status | Time |
|---|---:|---:|
| `/healthz` | 200 | 0.099 s |
| `/readyz` | 200 | 0.181 s |

## Build Status

Verification after this safe-mode patch:

- `typecheck:critical`: PASS.
- client/server boundary validation: PASS.
- admin content audit route contract tests: PASS.
- sitemap validation: PASS.
- Next build attempt 1: failed in Next static manifest writer with `ENOENT` for `_buildManifest.js.tmp...`.
- Next build attempt 2: passed prep stages, then the wrapper exited without a code-level diagnostic and left a stale exclusive lock after the build process was gone.

The code changes passed TypeScript and route-boundary checks. A clean CI/DigitalOcean build is still required before deployment.
