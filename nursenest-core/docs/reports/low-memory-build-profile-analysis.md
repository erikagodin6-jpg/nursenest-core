# Low-Memory Build Profile Analysis

Generated: 2026-05-10

## Summary

This pass preserved production low-memory defaults. No relaxation was applied to Docker, DigitalOcean, or Next.js worker settings because the plan prioritizes deployment stability over aggressive speedups.

## Current Defaults Preserved

- `NN_LOW_MEMORY_BUILD=1` in the Docker builder image.
- `NN_FORCE_SINGLE_BUILD_WORKER=true` in DigitalOcean build env.
- `BUILD_WEBPACK_PARALLELISM=1` in DigitalOcean build env.
- `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB=4096` and `NODE_OPTIONS=--max-old-space-size=4096` for build.
- Runtime heap stays separate at `NODE_MAX_OLD_SPACE_SIZE_MB=768` for the standalone child server.

## Instrumentation Added

`reports/build-runtime-metrics.json` now records trend-ready local build artifacts through `scripts/build-runtime-metrics.mjs`:

- phase durations
- low-memory/env settings
- host CPU/RAM summary
- heap and RSS at finish
- Next build peak RSS/process counts when the full build wrapper runs
- lesson index generation and verification gate timings

## Local Profile Evidence

A lightweight lesson gate run recorded:

- `lesson_index_generation`: 86520 ms
- `lesson_index_verification`: 3593 ms wrapper time
- total lesson gate: 90113 ms
- verifier internal light-mode work: 260 ms

Generation, not verification, is now the dominant lesson-index cost in deploy-light mode.

## Risk Assessment

No settings were relaxed. The safest next optimization target is catalog normalization/generation work, especially large RN/NP pathway normalization, rather than increasing worker concurrency or heap pressure on the DigitalOcean `basic-xs` deployment build.

## Rollback

The telemetry helper is artifact-only. Roll back by removing `scripts/build-runtime-metrics.mjs` and the calls in `run-next-prod-build.mjs` / `run-lesson-indexes-for-build.mjs` if metrics writing causes unexpected filesystem constraints.
