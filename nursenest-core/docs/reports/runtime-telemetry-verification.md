# Runtime Telemetry Verification

Generated: 2026-06-01

## Verdict

**LOCAL PASS / PRODUCTION DEPLOY BLOCKED**

Runtime telemetry has been enhanced locally, but it cannot be deployed while DigitalOcean write operations return HTTP 403.

## Instrumented File

```text
scripts/start-standalone-runtime.cjs
```

## Telemetry Fields

The runtime now emits:

- `pid`
- `rssMb`
- `heapUsedMb`
- `heapTotalMb`
- `externalMb`
- `arrayBuffersMb`
- `cpuUserMs`
- `cpuSystemMs`
- `eventLoopLagMeanMs`
- `eventLoopLagP95Ms`
- `eventLoopLagMaxMs`
- `activeRequests`
- `totalRequests`
- `maxActiveRequests`
- shutdown `signal`
- process `exit` code

## Interval

Default interval is now:

```text
15000ms
```

Override:

```text
NN_RUNTIME_RESOURCE_TELEMETRY_INTERVAL_MS
```

Disable:

```text
NN_RUNTIME_RESOURCE_TELEMETRY=0
```

## Active Request Tracking

The runtime patches HTTP and HTTPS server request events and tracks:

- currently active requests
- total requests observed
- maximum simultaneous active requests

This is intended to correlate crawl pressure with readiness failures, DB timeouts, and memory growth.

## Validation

Local checks:

```text
node --check nursenest-core/scripts/start-standalone-runtime.cjs
```

Result: PASS

Focused startup/watchdog tests:

```text
20 tests passed
0 failed
```

## Production Status

Not yet deployed.

Blocking issue:

```text
DigitalOcean App Platform mutation calls return HTTP 403 forbidden.
```

Once deployment access is restored, verify production logs contain:

```text
[nursenest-core] runtime_resource startup
[nursenest-core] runtime_resource sample
```

with `activeRequests` and event-loop lag fields.

