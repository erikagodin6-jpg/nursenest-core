# Startup Watchdog Architecture Audit

Generated: 2026-06-01

## Process Model

NurseNest production uses a two-process standalone runtime:

```text
DigitalOcean App Platform
  |
  v
node scripts/start-production.mjs
  |
  v
node nursenest-core/scripts/start-standalone.mjs
  |
  +-- Parent bootstrap proxy binds public PORT
  |
  +-- Child Next standalone process binds internal loopback port
        node scripts/start-standalone-runtime.cjs .next/standalone/server.js
```

## Responsibility Matrix

| Surface | Process | Implementation |
|---|---|---|
| Public socket / App Platform PORT | Parent bootstrap process | `scripts/start-standalone.mjs` |
| Startup `/healthz` before ready | Parent bootstrap process | returns 200 process liveness |
| Startup `/readyz` before ready | Parent bootstrap process | returns 503 until handlers ready |
| Internal child bootstrap probe | Child preload wrapper | `/_nn_bootstrap_ready_check__` |
| Next route rendering | Child Next standalone process | `.next/standalone/server.js` |
| Runtime `/healthz` after ready | Child Next route, via parent proxy | `src/app/(runtime)/healthz/route.ts` |
| Runtime `/readyz` after ready | Child Next route, via parent proxy | `src/app/(runtime)/readyz/route.ts` |

## Previous Ambiguity

The child preload helper intercepted:

- `/_nn_bootstrap_ready_check__`
- `/healthz`
- `/readyz`

That meant a proxied public `/readyz` could be answered by the child preload even though the child preload's own `handlersReady` state was permanently false. This produced misleading logs and could make `/readyz` appear synthetic.

## Correct Architecture

The parent bootstrap proxy must own public readiness before the app is ready. The child preload must only own the internal bootstrap probe.

```text
Before parent readiness:
  /healthz -> parent, 200 process liveness
  /readyz  -> parent, 503 not ready
  other    -> parent, 503 not ready

After parent readiness:
  /healthz -> parent proxies to child Next route
  /readyz  -> parent proxies to child Next route
  other    -> parent proxies to child Next route

Internal only:
  /_nn_bootstrap_ready_check__ -> child preload, 200 only for parent readiness loop
```

## Local Remediation

Implemented locally:

- Removed child preload interception for public `/healthz`.
- Removed child preload interception for public `/readyz`.
- Preserved child preload interception for `/_nn_bootstrap_ready_check__`.
- Added parent readiness state transition logs.
- Added parent route readiness logs for pre-ready `/healthz` and `/readyz`.
- Converted forced readiness fallback to liveness-only logging.

## Current Production Status

The code changes in this audit are local and validated by tests, but they are not deployed yet.

The live production deployment still shows the old child-preload symptom:

```text
startup_watchdog bootstrap_healthz_intercepted {"pathname":"/readyz","handlersReady":false,"msSinceBoot":1820575}
```

## Conclusion

The watchdog architecture should remain two-process, but the child preload must not answer public readiness routes. The local fix restores a clean separation:

- parent = readiness gate
- child preload = internal bootstrap probe only
- child Next = application routes

