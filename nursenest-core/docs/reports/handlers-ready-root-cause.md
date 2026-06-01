# handlersReady Root Cause Audit

Date: 2026-06-01

## Executive Summary

`handlersReady` is owned by the parent bootstrap proxy in `scripts/start-standalone.mjs`. It starts as `false`, then should become `true` only after the parent successfully probes the child Next standalone runtime on the internal loopback port.

The current lifecycle is mostly correct: public `/healthz` is liveness, public `/readyz` is 503 until `handlersReady` flips, and after that the parent proxies readiness to the child Next route. The child preload now only serves the internal bootstrap probe and does not synthesize public `/readyz`.

Root cause found:

- `NN_ENABLE_FORCED_READINESS_FALLBACK=1` changed the parent probe URL from `/_nn_bootstrap_ready_check__` to `/_nn_bootstrap_forced_readiness_check__`.
- The child preload only intercepts `/_nn_bootstrap_ready_check__`.
- Therefore, when forced fallback is enabled, the child can be alive but the parent probes an unserved path, so `handlersReady` remains false until the fatal watchdog timeout.

Fix applied:

- `scripts/start-standalone.mjs` now always probes `/_nn_bootstrap_ready_check__`.
- The forced fallback timer remains liveness-only logging and no longer changes the probe target.

## Lifecycle Map

### Startup Bootstrap

File: `scripts/start-standalone.mjs`

1. Runtime env fallback and validation run before binding.
2. Standalone artifact is verified.
3. Startup mode is resolved by `resolveBootstrapStartupMode()`.
4. In normal production mode, parent bootstrap binds public `PORT`.
5. Child Next runtime is spawned on an allocated internal loopback port.
6. Parent waits for child TCP bind.
7. Parent starts an internal readiness probe loop.

Relevant code:

- Public bootstrap server: `scripts/start-standalone.mjs:151`.
- Initial state: `handlersReady: false` at `scripts/start-standalone.mjs:376`.
- Internal probe loop: `scripts/start-standalone.mjs:258`.
- Readiness transition: `markHandlersReady()` at `scripts/start-standalone.mjs:235`.

### Where `handlersReady` Becomes True

Primary path:

- `waitForChildReadiness()` calls `probeChild()`.
- `probeChild()` sends `HEAD http://127.0.0.1:<internalPort>/_nn_bootstrap_ready_check__`.
- If the child returns any 2xx/3xx status, parent calls `markHandlersReady(state, "internal_probe", ...)`.

Relevant code:

- Probe URL: `scripts/start-standalone.mjs:90`.
- Probe response handling: `scripts/start-standalone.mjs:312`.
- True transition: `scripts/start-standalone.mjs:315`.

Secondary legacy path:

- If `NN_BYPASS_BOOTSTRAP=1`, `resolveBootstrapStartupMode()` sets `readinessWatchdogBypass`.
- Parent calls `markHandlersReady(state, "watchdog_bypass", ...)` without proving the child app handler is ready.

Relevant code:

- Bypass resolution: `scripts/resolve-bootstrap-mode.mjs:24`.
- Bypass transition: `scripts/start-standalone.mjs:259`.

Risk:

- This legacy bypass can mask real readiness failures and should stay unset in production.

## Why `handlersReady` Remains False

### Confirmed Root Cause

Before the fix, `childProbePath()` returned a different path when forced fallback was enabled:

```js
NN_ENABLE_FORCED_READINESS_FALLBACK=1
=> /_nn_bootstrap_forced_readiness_check__
```

But the child preload only serves:

```js
/_nn_bootstrap_ready_check__
```

Relevant code:

- Parent probe path before fix: `scripts/start-standalone.mjs:90`.
- Child bootstrap ready path: `scripts/standalone-bootstrap-healthz-shared.cjs:3`.
- Child intercept exact match: `scripts/standalone-bootstrap-healthz-shared.cjs:92`.

Effect:

- Parent repeatedly receives timeout/404/non-ready probe results.
- `handlersReady` remains `false`.
- `/readyz` remains 503 from the parent.
- Eventually the watchdog exits with `readiness_fatal_timeout` or `readiness_fatal_max_attempts`.

Corrected behavior:

- Forced fallback only emits `handlers_ready_forced_liveness_only`.
- Parent continues probing `/_nn_bootstrap_ready_check__`.
- A real child bootstrap probe can still flip `handlersReady`.

### Other Causes That Can Keep It False

| Cause | Evidence Path | Expected `/readyz` |
|---|---|---|
| Child process never binds internal port | `waitForTcpOpen()` fails in `scripts/start-standalone.mjs` | Process exits before ready |
| Child process exits during boot | `child.on("exit")` in `scripts/start-standalone.mjs` | Parent exits |
| Child preload does not install | `scripts/start-standalone-runtime.cjs` fails before requiring preload | Probe fails, parent exits |
| Probe path mismatch | Fixed in `scripts/start-standalone.mjs` | Was stuck 503 until fatal timeout |
| Event loop saturation | Child accepts TCP but probe cannot complete inside timeout | Parent remains not ready or later runtime `/readyz` fails |
| DB unavailable after proxy handoff | Runtime `/readyz` calls DB readiness | 503 after `handlersReady=true` |

## Watchdog Masking Audit

### Public `/healthz`

Before `handlersReady=true`:

- Parent returns 200 for `/healthz`.
- This is intentional liveness only.
- It can mask application readiness if DigitalOcean is configured to use `/healthz` as the readiness check.

Relevant code:

- Parent pre-ready `/healthz`: `scripts/start-standalone.mjs:187`.
- Runtime `/healthz`: `src/app/(runtime)/healthz/route.ts:7`.

Recommendation:

- Use `/readyz` for readiness and `/healthz` for liveness only.

### Public `/readyz`

Before `handlersReady=true`:

- Parent returns 503.

After `handlersReady=true`:

- Parent proxies to child Next runtime `/readyz`.
- Runtime `/readyz` performs bounded DB readiness with a 450ms timeout.

Relevant code:

- Parent pre-ready `/readyz`: `scripts/start-standalone.mjs:207`.
- Runtime `/readyz`: `src/app/(runtime)/readyz/route.ts:21`.

Verdict:

- Correct in normal mode.
- Incorrect if `NN_BYPASS_BOOTSTRAP=1`, because bypass flips `handlersReady` without app readiness proof.

### Forced Fallback

Current behavior after fix:

- Emits `handlers_ready_forced_liveness_only`.
- Does not call `markHandlersReady()`.
- Does not change the probe path.

Verdict:

- No longer masks readiness.
- It is now only an operational breadcrumb.

### Legacy Watchdog Bypass

Environment:

```text
NN_BYPASS_BOOTSTRAP=1
```

Effect:

- Parent flips `handlersReady=true` without internal probe success.
- Public requests begin proxying to the child after bind.

Verdict:

- This can mask readiness failures.
- It is explicitly deprecated in `scripts/resolve-bootstrap-mode.mjs`.
- Production should keep it unset.

## Preload Runtime Audit

Files:

- `scripts/start-standalone-runtime.cjs`
- `scripts/standalone-startup-watchdog-preload.cjs`
- `scripts/standalone-startup-watchdog-preload-shared.cjs`
- `scripts/standalone-bootstrap-healthz-shared.cjs`

Flow:

1. Runtime wrapper installs resource telemetry.
2. Runtime wrapper requires `standalone-startup-watchdog-preload.cjs`.
3. Preload patches `http.createServer` and `https.createServer`.
4. Wrapped request listener calls `maybeServeBootstrapHealthz()`.
5. Only `/_nn_bootstrap_ready_check__` is intercepted.
6. Public `/healthz` and `/readyz` are forwarded to Next after parent readiness.

Important detail:

- The preload `startupState.handlersReady` is initialized to `false` and never flips.
- That is acceptable only because preload no longer owns public readiness.
- Its `handlersReady` value is diagnostic metadata for the internal bootstrap intercept, not the source of truth for public readiness.

## Health And Readiness Endpoint Audit

| Endpoint | Before Parent Ready | After Parent Ready | Dependency | Verdict |
|---|---|---|---|---|
| `/healthz` | Parent 200 | Child route 200 | Process only | Correct liveness |
| `/readyz` | Parent 503 | Child route 200/503 | Fast DB probe | Correct readiness |
| `/api/health` | Parent 503 unless ready | Child route 200 | Process only | Correct API liveness |
| `/api/health/ready` | Parent 503 unless ready | Child route 200/503 | DB probe | Correct API readiness |
| `/_nn_bootstrap_ready_check__` | Parent public path returns 404 | Child internal path returns 200 via preload | Child HTTP listener exists | Correct internal probe |

## Code Change Applied

File:

- `scripts/start-standalone.mjs`

Change:

- `childProbePath()` now always returns `/_nn_bootstrap_ready_check__`.

Why:

- The probe target must match the child preload's exact intercept path.
- Forced fallback must not alter readiness proof.

## Verification

Passed:

```text
node --test scripts/resolve-bootstrap-mode.test.mjs scripts/start-standalone-bootstrap-runtime.test.cjs
```

Result:

- 10 tests executed.
- 6 passed.
- 4 skipped because this workspace does not contain `.next/standalone`.

Passed:

```text
node --check scripts/start-standalone.mjs
```

Attempted:

```text
node -e "import('./scripts/start-standalone.mjs').catch(()=>{})"
```

Result:

- The launcher correctly refused to boot without required runtime env (`AUTH_SECRET` and AI generation env). This is expected startup guard behavior, not a readiness-code failure.

## Recommendations

1. Keep `NN_BYPASS_BOOTSTRAP` unset in production.
2. Keep `NN_ENABLE_FORCED_READINESS_FALLBACK` unset unless debugging, but it is no longer a readiness blocker after the probe path fix.
3. Ensure DigitalOcean readiness checks use `/readyz`, not `/healthz`.
4. Keep `/healthz` as liveness only.
5. Add a regression assertion that `childProbePath()` always equals `CHILD_BOOTSTRAP_READY_PATH`.
6. Add deployed log monitoring for:
   - `handlers_ready_transition`
   - `handlers_init_failed`
   - `internal_probe_error`
   - `handlers_ready_forced_liveness_only`
   - public `/readyz` 503 during startup only

## GO / NO-GO

Status: GO after deploying the probe-path fix, provided production has:

- `NN_BYPASS_BOOTSTRAP` unset.
- Readiness probe configured as `/readyz`.
- No repeated `handlers_init_failed` or `readiness_fatal_timeout` logs.
- Runtime `/readyz` stays 200 under crawl/load tests.

If `/readyz` still fails after this fix, the next investigation should focus on post-handoff runtime readiness: DB probe latency, event-loop saturation, Prisma pool starvation, and container resource exhaustion.
