# Runtime Memory Audit

Generated: 2026-06-01

## Executive Finding

The strongest memory-risk finding is configuration-level:

- DigitalOcean service size: `basic-s` = 2 GB memory, single instance.
- Runtime `NODE_OPTIONS` included `--max-old-space-size=4096`.
- Runtime env also included `NODE_MAX_OLD_SPACE_SIZE_MB=768`.

Before this pass, the process-level `NODE_OPTIONS` value could allow V8 old-space to grow beyond the container budget. Under sustained crawl load, this can drive memory pressure, process exit, and App Platform replacement.

## Measurements Available

Direct DigitalOcean CPU/RSS charts were not exposed through the installed `doctl` commands in this shell. The incident evidence is therefore based on:

- DigitalOcean app instance/deployment state.
- App runtime logs.
- Live origin health probes.
- Capacity-test response data.
- Existing local build/runtime memory artifacts.

## Runtime Load Signals

During the 1,000 URL crawl:

- 606 upstream failures occurred.
- App logs showed slow public route rendering and metadata generation.
- `pathway_lessons db_timeout` fallback events appeared.
- Component exited with code `128`.
- DigitalOcean replaced the instance.

This is consistent with memory or CPU saturation rather than a single deterministic route exception.

## Route Family Memory / Load Risk

| Route Family | Evidence | Risk |
| --- | --- | --- |
| Startup | Boot succeeds; health passes at rest. | Medium, because the app carries a large Next standalone and many content modules. |
| Idle | `/healthz` and `/readyz` pass quickly after restart. | Low at rest. |
| Blog routes | Multi-second `marketing.blog_post` and `metadata.generation` logs under crawl. | High. |
| Lesson/topic routes | `pathway_lessons` DB timings and timeout fallbacks under crawl. | Medium-high. |
| Localized routes | Included in sitemap discovery; not isolated in this run. | Unknown until route-family segmented crawl is run. |
| Question routes | Not isolated in this run. | Unknown until route-family segmented crawl is run. |

## Fix Applied

File changed:

- `scripts/start-production.mjs`

Change:

- Added `applyRuntimeHeapLimit()`.
- If `NODE_MAX_OLD_SPACE_SIZE_MB` is set, replace or append `--max-old-space-size=<limit>` in `NODE_OPTIONS`.
- Current production env has `NODE_MAX_OLD_SPACE_SIZE_MB=768`, so after deployment the effective runtime old-space cap will be 768 MB rather than 4096 MB.

Verification:

```bash
node --check scripts/start-production.mjs
```

Result: PASS.

## Remaining Gap

The heap clamp reduces OOM risk, but it does not add capacity. A single `basic-s` instance can still become unhealthy under crawler bursts if route rendering saturates CPU, database connections, or the event loop.

## Required Retest

After deployment:

1. Confirm startup logs include: `clamped NODE_OPTIONS max-old-space-size to 768 MB`.
2. Confirm `/healthz`, `/readyz`, `/`, `/blog`, and `/sitemap.xml` return 200.
3. Re-run 100, 500, and 1,000 URL capacity tests.
4. Only run 2,000 URL certification if 1,000 URLs produce 0 upstream failures.

## Verdict

Runtime memory configuration: FIX PREPARED, not deployed/certified in this workspace.

Origin stability: NO-GO until redeploy and retest.
