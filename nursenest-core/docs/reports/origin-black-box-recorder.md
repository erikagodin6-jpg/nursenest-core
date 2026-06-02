# Origin Failure Black Box Recorder

Generated: 2026-06-01

## Status

**IMPLEMENTED LOCALLY / DEPLOYMENT BLOCKED**

The black box recorder has been implemented in the production runtime path. It cannot capture a live production failure until the current DigitalOcean write-permission blocker is resolved and a new deployment is created.

## Output Location

Recorder output:

```text
reports/origin-black-box-recorder/
```

Generated timeline:

```text
reports/origin-black-box-recorder/origin-failure-timeline.md
```

## Recorder Components

| Component | Process | File |
|---|---|---|
| `parent-bootstrap` | public App Platform bootstrap/proxy process | `scripts/start-standalone.mjs` |
| `child-next-runtime` | child Next standalone process | `scripts/start-standalone-runtime.cjs` |

Shared recorder:

```text
scripts/origin-black-box-recorder.cjs
```

Timeline generator:

```text
scripts/generate-origin-failure-timeline.cjs
```

## Captured Every 15 Seconds

- RSS memory
- heap used
- heap total
- CPU percentage
- event-loop lag mean / p95 / max
- active requests
- total requests
- max active requests
- active DB connections field
- DB pool state
- readiness state
- watchdog state
- child process state
- uptime

## Shutdown / Failure Capture

The recorder writes event rows for:

- startup
- readiness transitions
- route readiness checks
- child process exit
- child process error
- parent signal
- child signal
- process `beforeExit`
- process `exit`

Shutdown snapshots include:

- signal or exit code
- memory snapshot
- readiness state
- request counts
- DB pool state
- child process state

## DB Pool State

Prisma pool internals are not exposed directly in this standalone runtime. The recorder captures:

- configured database host metadata
- configured `connection_limit` when present
- explicit `activeConnections: null`
- reason: `prisma_pool_metrics_not_exposed_in_standalone_runtime`

This is intentionally honest. It prevents false precision while keeping the timeline schema ready for a future Prisma/pg pool counter.

## Timeline Generation

After reproducing an incident on a deployed build:

```text
node scripts/generate-origin-failure-timeline.cjs
```

The generator merges all JSONL recorder files and produces a chronological markdown table.

## Current Generated Timeline

The local timeline file exists and contains smoke-test recorder rows from local runtime validation. It is not a production origin-collapse capture yet because this recorder has not been deployed to production.

```text
reports/origin-black-box-recorder/origin-failure-timeline.md
```

## Validation

Syntax checks passed:

```text
node --check scripts/origin-black-box-recorder.cjs
node --check scripts/generate-origin-failure-timeline.cjs
node --check scripts/start-standalone-runtime.cjs
node --check scripts/start-standalone.mjs
```

## Answers This Will Provide After Deployment

- Did memory spike?
- Did event loop stall?
- Did DB pool pressure correlate with timeouts?
- Did readiness fail before process exit?
- Did process exit before readiness failed?
- Did DigitalOcean kill or replace the instance?
- Which process emitted the final signal/exit snapshot?
