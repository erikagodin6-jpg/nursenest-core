# Readiness Transition Audit

Generated: 2026-06-01

## Objective

Add explicit readiness-state evidence so future incidents can answer:

- when startup began
- when the parent public server bound
- when the child Next server bound
- when readiness probing started
- when `handlersReady` transitioned
- which pid and memory profile emitted each event

## Logging Added

### Runtime Snapshot Fields

Startup watchdog events now include:

- `pid`
- `ppid`
- `uptimeSec`
- `rssMb`
- `heapUsedMb`
- `heapTotalMb`

Implemented in:

```text
scripts/standalone-startup-watchdog-shared.cjs
```

### Parent State Initialization

New event:

```text
startup_watchdog watchdog_state_initialized
```

Fields:

- `mode`
- `handlersReady`
- `readinessWatchdogBypass`
- `internalPort`

### Readiness Transition

New event:

```text
startup_watchdog handlers_ready_transition
```

Fields:

- `previous`
- `next`
- `reason`
- `childPid`
- `internalPort`
- `attempts`
- `statusCode`
- `probeUrl`
- runtime snapshot fields

### Route Readiness Checks

New event while parent is not ready:

```text
startup_watchdog route_readiness_check
```

Fields:

- `route`
- `status`
- `handlersReady`
- `source`
- runtime snapshot fields

## Forced Fallback Correction

Previous behavior could flip readiness when `NN_ENABLE_FORCED_READINESS_FALLBACK=1`.

Corrected behavior:

```text
startup_watchdog handlers_ready_forced_liveness_only
```

This event records the fallback timer but does not set `handlersReady=true`.

## Local Test Evidence

Focused tests passed:

```text
node --test \
  nursenest-core/scripts/standalone-bootstrap-healthz.test.cjs \
  nursenest-core/scripts/standalone-startup-watchdog-preload-smoke.test.cjs \
  nursenest-core/scripts/start-standalone-bootstrap-runtime.test.cjs

20 tests passed
0 failed
```

Syntax checks passed:

```text
node --check nursenest-core/scripts/start-standalone.mjs
node --check nursenest-core/scripts/standalone-bootstrap-healthz-shared.cjs
node --check nursenest-core/scripts/standalone-startup-watchdog-shared.cjs
```

## Production Evidence Before Fix Deployment

During the 100 URL correlation test, live production emitted:

```text
startup_watchdog bootstrap_healthz_intercepted {"method":"GET","url":"/readyz","pathname":"/readyz","handlersReady":false,"msSinceBoot":1820575}
```

That confirms the old child public readiness interception is still present in production.

## Conclusion

The local code now creates clear readiness transition evidence. The current production image does not yet include these logging corrections, so a new deployment is required before future logs can cleanly distinguish parent readiness from child preload probe state.

