# Readiness Architecture Fix

Generated: 2026-06-01

## Verdict

**LOCAL PASS / PRODUCTION DEPLOY BLOCKED**

The readiness architecture has been corrected locally. Production still needs a fresh deployment, but deployment creation is currently blocked by DigitalOcean HTTP 403.

## Defect

The runtime had two readiness states:

| Process | State | Issue |
|---|---|---|
| Parent bootstrap proxy | `state.handlersReady` | real public readiness gate |
| Child preload wrapper | `startupState.handlersReady` | initialized false and never transitioned true |

The child preload intercepted public `/readyz`, causing logs like:

```text
startup_watchdog bootstrap_healthz_intercepted {"pathname":"/readyz","handlersReady":false,"msSinceBoot":1820575}
```

That child-side state is not the true parent readiness state.

## Fix Applied Locally

Child preload now intercepts only:

```text
/_nn_bootstrap_ready_check__
```

Child preload no longer answers:

```text
/healthz
/readyz
```

Parent bootstrap owns public readiness:

| Route | Before Ready | After Ready |
|---|---|---|
| `/healthz` | parent returns 200 liveness | proxy to child |
| `/readyz` | parent returns 503 | proxy to child |
| all app routes | parent returns 503 | proxy to child |

## Additional Safeguards

- Added `handlers_ready_transition` logging.
- Added `route_readiness_check` logging before ready.
- Added pid/uptime/RSS/heap fields to startup watchdog logs.
- Forced readiness fallback is now liveness-only and cannot mark the app ready.

## Validation

Focused tests:

```text
node --test \
  nursenest-core/scripts/standalone-bootstrap-healthz.test.cjs \
  nursenest-core/scripts/standalone-startup-watchdog-preload-smoke.test.cjs \
  nursenest-core/scripts/start-standalone-bootstrap-runtime.test.cjs
```

Result:

```text
20 passed
0 failed
```

Syntax checks:

```text
node --check nursenest-core/scripts/start-standalone.mjs
node --check nursenest-core/scripts/standalone-bootstrap-healthz-shared.cjs
node --check nursenest-core/scripts/standalone-startup-watchdog-shared.cjs
node --check nursenest-core/scripts/start-standalone-runtime.cjs
```

Result: PASS

## Production Status

Not deployed.

Reason:

```text
POST /v2/apps/.../deployments
HTTP 403 forbidden
```

## Acceptance Criteria After Deployment

Verify:

- `/healthz` returns process health.
- `/readyz` returns 503 while parent `handlersReady=false`.
- child preload logs no longer show public `/readyz` interception.
- `handlers_ready_transition` appears exactly once during boot.
- `runtime_resource sample` appears every 15 seconds.

