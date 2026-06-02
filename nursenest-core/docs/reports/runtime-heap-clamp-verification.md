# Runtime Heap Clamp Verification

Generated: 2026-06-01

## Verdict

**PARTIAL PASS**

The heap clamp exists in the committed production start script. Production uses that start script. A fresh deployment containing the latest local telemetry/readiness fixes could not be created because DigitalOcean mutation calls are currently blocked by HTTP 403.

## Source Verification

File:

```text
scripts/start-production.mjs
```

Verified implementation:

```text
applyRuntimeHeapLimit()
NODE_MAX_OLD_SPACE_SIZE_MB
--max-old-space-size=<limit>
[runtime_env] clamped NODE_OPTIONS max-old-space-size to <limit> MB
```

Relevant lines:

```text
scripts/start-production.mjs:45 applyRuntimeHeapLimit()
scripts/start-production.mjs:46 NODE_MAX_OLD_SPACE_SIZE_MB
scripts/start-production.mjs:55 --max-old-space-size
scripts/start-production.mjs:60 clamped NODE_OPTIONS max-old-space-size
scripts/start-production.mjs:69 applyRuntimeHeapLimit()
```

## Deployment Verification

Active deployment:

| Field | Value |
|---|---|
| App | `nursenest-core-next` |
| Active deployment | `2a9127f6-689b-441a-8cc1-855fdea70b92` |
| Run command | `node scripts/start-production.mjs` |

The App Platform spec confirms production starts through `scripts/start-production.mjs`, which contains the heap clamp.

## Runtime Environment

The app spec includes runtime heap-related environment values:

| Variable | Status |
|---|---|
| `NODE_OPTIONS` | configured |
| `NODE_MAX_OLD_SPACE_SIZE_MB` | configured |

Values are intentionally not included in this report.

## Remaining Gap

Because DigitalOcean write operations now return HTTP 403, a new deployment could not be created after the latest local watchdog/telemetry changes.

Required follow-up after permissions are restored:

1. Deploy latest build.
2. Confirm startup log contains:

```text
[runtime_env] clamped NODE_OPTIONS max-old-space-size
```

3. Confirm `runtime_resource startup` logs are present.

