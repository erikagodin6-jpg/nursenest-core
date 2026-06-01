# Exit Code 128 Analysis

Generated: 2026-06-01

## Executive Finding

The web component exit is still best classified as resource-exhaustion / platform restart under crawl load, not a deterministic application exception.

The exact kernel-level cause of exit code `128` could not be proven from retained DigitalOcean logs. DigitalOcean App Platform exposed the component exit and replacement behavior, but the previous run logs for the failed deployment were no longer available once the deployment entered `final_cleanup`.

What is proven:

- The origin was healthy before crawl load.
- The origin returned `504 no_healthy_upstream` after sustained crawl load.
- The service is a single `basic-s` instance.
- The failed instance was replaced/restarted.
- No retained logs show a TypeScript/Prisma/Next stack trace immediately causing process exit.
- The same failure mode reproduced after lowering runtime heap: the 500 URL recovery test returned `504 no_healthy_upstream` and forced another restart cycle.

## Timeline

| Time UTC | Event |
| --- | --- |
| 03:34:02 | 1,000 URL crawl started at concurrency 12 |
| 03:41:04 | 1,000 URL crawl ended with 606 upstream failures and 27 client timeouts |
| After 03:41 | `/healthz` and `/readyz` returned 504 `no_healthy_upstream` |
| 03:42:53 | Manual recovery restart deployment created |
| 03:47:47 | Recovery restart active |
| 04:00-04:11 | Runtime heap config update deployed |
| 04:12:32 | 100 URL recovery crawl started |
| 04:14:09 | 100 URL recovery crawl completed: 99 HTTP 200, 1 timeout, 0 upstream failures |
| 04:14:55 | 500 URL recovery crawl started |
| 04:18:58 | 500 URL recovery crawl failed: 299 HTTP 504, 107 client timeouts, 173 upstream failures |
| 04:20:10 | Manual recovery restart deployment created |
| 04:25:10 | Recovery restart active |

## Exit Code Interpretation

`128` by itself is not enough to distinguish:

- explicit child process exit code,
- shell/process-manager convention,
- platform termination behavior,
- forced restart while the process was unhealthy.

Important signal-handling detail:

- `scripts/start-standalone.mjs` maps `SIGTERM` to exit code `143`.
- It maps `SIGINT` to exit code `130`.
- A direct `SIGKILL` would typically present as `137` in many Linux/container contexts.

Because the observed platform line was `code: 128`, it is not cleanly identified as a normal `SIGTERM` path by the app's signal mapping.

## Logs Collected

### Deployment state

- Active recovery deployment after first outage: `39ab7d09-782c-4de0-ad88-3a84c69b45c6`
- Heap-config deployment: `c4206126-10fe-4322-9db4-31a7246665ff`
- Recovery restart after 500 URL failure: `510fb5a6-8e09-4a47-ab19-7a89fe28af8c`

### Startup logs

Startup consistently reached:

- `STARTING WEB PROCESS`
- `startup_watchdog server_listening`
- `startup_watchdog standalone_spawn`
- `Next.js 16.2.6`
- `prisma: effectiveConnection`

### Failure-adjacent logs

During recovery after the 500 URL failure, logs showed repeated readiness probe timeouts before eventual handler readiness:

- `startup_watchdog internal_probe_error`
- `error: probe timeout`
- repeated attempts against `/_nn_bootstrap_ready_check__`
- eventual `startup_watchdog handlers_ready`

This indicates the process was struggling to become responsive during/after restart, consistent with runtime saturation.

## DigitalOcean Runtime Events

The App Platform CLI exposed:

- deployment history,
- active/superseded deployment IDs,
- instance name,
- current phase,
- build/deploy steps,
- run/deploy logs.

The CLI did not expose:

- kernel OOM kill reason,
- container RSS at kill time,
- CPU saturation graph,
- platform event that maps exit `128` to a signal,
- DB pool occupancy.

## Root Cause Assessment

Most likely cause:

- Sustained crawler concurrency saturates the single `basic-s` web instance until App Platform has no healthy upstream.

Contributing causes:

- Single instance only; no redundancy.
- Shared 1 vCPU / 2 GB RAM class.
- Public routes are slow under crawl; p95 hit the 20s audit timeout.
- Sitemap discovery itself timed out on heavy child sitemaps.
- Prisma connection limit is 5; logs show DB slow queries and timeout fallbacks under crawl pressure.
- Readiness can eventually recover, but the public edge can remain `no_healthy_upstream` until restart.

Not proven:

- Direct OOM kill.
- Direct SIGKILL.
- Direct SIGTERM.
- A single application exception causing the exit.

## Fixes Applied During Incident

Production config change:

- Updated live `NODE_OPTIONS` from `--max-old-space-size=4096` to `--max-old-space-size=768`.

Local source hardening prepared:

- `scripts/start-production.mjs` clamps `NODE_OPTIONS` to `NODE_MAX_OLD_SPACE_SIZE_MB`.
- `scripts/start-standalone-runtime.cjs` adds process-level runtime telemetry for RSS, heap, CPU usage, and event-loop lag on the next image that includes this code.

## Current Verdict

Exit code `128` remains unresolved at the exact signal/kernel level, but the incident is reproducible as an origin capacity failure.

The heap flag was a necessary correction, but it did not resolve the availability failure.

Priority remains: increase origin capacity and reduce per-request route/render cost before another large crawl.
