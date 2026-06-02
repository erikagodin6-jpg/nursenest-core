# Probe Correctness Audit

Generated: 2026-06-01

## Required Contract

| Probe | Contract |
|---|---|
| `/healthz` | Process liveness only |
| `/readyz` | Application readiness |
| `/_nn_bootstrap_ready_check__` | Internal child bootstrap probe only |

## Current Implementation After Local Fix

### `/healthz`

Before parent readiness:

```text
Parent bootstrap process returns 200.
```

This is correct because `/healthz` is process liveness.

After parent readiness:

```text
Parent proxies to child Next `/healthz` route.
```

The child route returns 200 without database work.

### `/readyz`

Before parent readiness:

```text
Parent bootstrap process returns 503.
```

This is correct because request handlers are not yet ready.

After parent readiness:

```text
Parent proxies to child Next `/readyz` route.
```

This is correct because the parent only flips readiness after the internal child probe succeeds.

### `/_nn_bootstrap_ready_check__`

The child preload still intercepts this internal path and returns 200 to the parent probe loop. This path is not public readiness.

## Incorrect Behavior Found

The child preload previously intercepted public `/healthz` and `/readyz` while its local child state remained:

```text
handlersReady=false
```

This was incorrect for `/readyz` because it created a synthetic child-level success path and generated misleading logs long after startup.

## Fix Applied Locally

File:

```text
scripts/standalone-bootstrap-healthz-shared.cjs
```

Change:

```text
isBootstrapHealthzRequest()
```

now returns true only for:

```text
/_nn_bootstrap_ready_check__
```

It no longer matches:

```text
/healthz
/readyz
```

## Synthetic Readiness Audit

| Mechanism | Before | After Local Fix |
|---|---|---|
| Child preload `/readyz` intercept | possible | removed |
| Forced readiness fallback | could flip readiness | liveness-only log |
| Parent `/readyz` before handlers ready | 503 | 503 |
| Parent `/healthz` before handlers ready | 200 | 200 |
| Internal child bootstrap probe | 200 | 200 |

## Remaining Concern

`NN_BYPASS_BOOTSTRAP=1` still exists as a legacy escape hatch in `resolve-bootstrap-mode.mjs`. It is not appropriate for production readiness certification. Production should run with:

```text
NN_BYPASS_BOOTSTRAP unset
NN_DIRECT_STANDALONE unset
```

## Conclusion

Probe semantics are corrected locally:

- `/healthz` is liveness.
- `/readyz` fails when parent `handlersReady=false`.
- child preload no longer answers public readiness routes.
- forced fallback no longer marks the app ready.

The local fix must be deployed before production probe behavior can be considered corrected.

