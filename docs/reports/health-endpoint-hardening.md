# Health Endpoint Hardening

Generated: 2026-06-01

## Contract

`/healthz` is process liveness.

- Must be lightweight.
- Must not query content.
- Must not load sitemap, blog, lessons, translations, session, or learner state.
- Should return 200 when the process is alive.

`/readyz` is application readiness.

- Must check only required runtime dependencies.
- Must be bounded by hard timeouts.
- Must not run expensive content queries.
- Must fail quickly when the database is unavailable.

## Implementation

Updated `src/app/(runtime)/readyz/route.ts`.

Behavior:

- Runs `checkDatabaseReadiness(450)`.
- Returns `200 ready` when the database check is skipped or succeeds.
- Returns `503 not ready` when the required database dependency fails or times out.
- Uses `cache-control: no-store`.
- Logs slow/failing readiness probes with route, status, duration, uptime, classification, and detail.

## Explicit Non-Goals

The endpoint does not:

- Load full sitemap data.
- Load blog indexes.
- Load lesson indexes.
- Load locale JSON bundles.
- Load user/session state.
- Perform auth or entitlement checks.

## Expected Performance

- `/healthz` p95 target: under 100 ms.
- `/readyz` p95 target: under 500 ms.

Current production at-rest verification:

| Endpoint | Status | Response Time |
|---|---:|---:|
| `/healthz` | 200 | 0.099 s |
| `/readyz` | 200 | 0.181 s |

100 URL crawl at concurrency 12 showed endpoint degradation but no health failure:

| Endpoint | Before | After |
|---|---:|---:|
| `/healthz` | 55 ms | 867 ms |
| `/readyz` | 74 ms | 891 ms |

That post-crawl latency confirms origin saturation still needs deployment validation after the code fix.

## Build Verification

```text
npm run build:production
status: PASS
standalone artifact: verified
```

