# handlersReady Lifecycle

Generated: 2026-06-01

## Executive Finding

`handlersReady` exists in two different processes:

1. Parent bootstrap proxy: `scripts/start-standalone.mjs`
2. Child Next preload wrapper: `scripts/standalone-startup-watchdog-preload-shared.cjs`

The parent `handlersReady` is the actual public readiness gate. The child preload also creates a separate `startupState = { handlersReady: false }`, but that state never transitions to true. That explains production log lines such as:

```text
startup_watchdog bootstrap_healthz_intercepted ... "pathname":"/readyz","handlersReady":false,"msSinceBoot":1820575
```

Those logs are from the child preload, not proof that the parent bootstrap proxy never became ready.

## Declarations

| State | File | Purpose |
|---|---|---|
| `state.handlersReady` | `scripts/start-standalone.mjs` | Parent public readiness gate |
| `startupState.handlersReady` | `scripts/standalone-startup-watchdog-preload-shared.cjs` | Child preload internal probe interception state |

## Parent Lifecycle

```text
start-production.mjs
  -> delegates to nursenest-core/scripts/start-standalone.mjs
    -> parent bootstrap server binds public PORT
    -> child Next server is spawned on internal 127.0.0.1:<port>
    -> parent waits for child TCP bind
    -> parent probes child /_nn_bootstrap_ready_check__
    -> parent marks state.handlersReady=true
    -> parent proxies public traffic to child
```

Transition to ready happens in `waitForChildReadiness()` after a 2xx/3xx response from the child internal probe.

## Child Lifecycle

```text
start-standalone-runtime.cjs
  -> requires standalone-startup-watchdog-preload.cjs
    -> installStandaloneStartupWatchdog()
      -> startupState = { handlersReady: false }
      -> patches http/https createServer
      -> intercepts bootstrap probe path
  -> imports/requires Next standalone server.js
```

Before this fix, the child helper also intercepted public `/healthz` and `/readyz` while its local `startupState.handlersReady` remained false forever. The child had no transition path to set that state to true.

## Failure Paths

| Failure Path | Previous Behavior | Corrected Behavior |
|---|---|---|
| Child internal probe never returns 2xx/3xx | Parent exits after timeout/attempt cap | unchanged |
| Child process exits | Parent exits | unchanged |
| Public `/readyz` reaches parent before ready | Parent returns 503 | unchanged |
| Public `/readyz` reaches child after parent ready | Child preload could intercept and log `handlersReady=false` | child preload no longer intercepts public `/readyz` |
| Forced readiness fallback enabled | Could flip readiness synthetically | now logs liveness-only and does not flip readiness |

## Flow Diagram

```text
DigitalOcean /readyz
  |
  v
Parent bootstrap server on PORT
  |
  +-- state.handlersReady=false -> 503 "bootstrap: request handlers not ready"
  |
  +-- state.handlersReady=true
        |
        v
      Proxy to child Next server
        |
        +-- /readyz route returns framework readiness response

Parent readiness loop
  |
  v
HEAD http://127.0.0.1:<internal>/_nn_bootstrap_ready_check__
  |
  v
Child preload intercepts internal probe only
  |
  v
200 "ok"
  |
  v
Parent marks handlersReady=true
```

## Code Changes

- `scripts/standalone-bootstrap-healthz-shared.cjs`
  - Child preload now intercepts only `/_nn_bootstrap_ready_check__`.
  - Child preload no longer intercepts public `/healthz` or `/readyz`.
- `scripts/start-standalone.mjs`
  - Added `handlers_ready_transition` logging.
  - Added parent `route_readiness_check` logging for `/healthz` and `/readyz` while not ready.
  - Forced fallback is now liveness-only and does not flip readiness.
- `scripts/standalone-startup-watchdog-shared.cjs`
  - Startup watchdog logs now include pid, ppid, uptime, RSS, heap used, and heap total.

## Conclusion

The long-running `handlersReady=false` log is a child-preload state artifact, not the parent readiness state. However, it masked the real capacity failure because public readiness semantics were ambiguous. The local fix removes the child public readiness intercept and makes readiness transitions explicit.

