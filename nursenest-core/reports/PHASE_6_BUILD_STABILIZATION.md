# Phase 6 — Production build stabilization + release-gate

**Date:** 2026-05-08  
**Scope:** Memory/build pipeline audit, Edge-safe instrumentation wiring, verification runs. No learner UX or feature work.

## 1. Audit — hotspots

### `next.config.mjs` (`nn-next-build-config`)

- Logs diagnostics when `npm run build` / argv includes `build`: low-memory heuristic (`NN_LOW_MEMORY_BUILD`, `CI`, `NN_APP_PLATFORM_BUILD`, or host RAM ≤ ~9 GiB), `experimental.cpus: 1`, `staticGenerationMaxConcurrency: 1`, `workerThreads: false`, `webpackBuildWorker: false`, `memoryBasedWorkersCount: false`, parallel server compile/trace off, webpack `parallelism: 1`, prod webpack `cache: false`.
- **Lint/types:** `typescript.ignoreBuildErrors: true` with explicit comment that CI must run `typecheck` / `validate:prebuild` before deploy.
- **`output: standalone`** — production start expects standalone artifact.

### `scripts/run-lesson-indexes-for-build.mjs`

- Runs `build:lesson-indexes` then `verify:lesson-indexes` unless `NN_SKIP_LESSON_INDEX_BUILD` is truthy.
- **Memory:** Spawns separate Node processes (not the Next heap), but catalog normalization is CPU/RAM heavy (logs show multi-second pathway normalizes).

### `scripts/ensure-node-memory.mjs`

- Merges `NODE_OPTIONS`; default heap `--max-old-space-size=8192` unless overridden by `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB`.
- Emits `scripts/.node-memory-exports.sh` for `build` / `start` / `dev`.

### `src/instrumentation.ts` (Edge / Node split)

- **Before:** Static import of `@/lib/observability/home-perf-diag` pulled `server-stderr-line` into the instrumentation module graph for **all** runtimes, including Edge.
- **After:** `home-perf-diag` is loaded only inside the `NEXT_RUNTIME === "nodejs"` branch via **dynamic `import()`**, so the Edge instrumentation bundle no longer pulls that chain at compile time.

### Static generation / `generateStaticParams`

- Large surface area: many marketing and app routes export `generateStaticParams` / `generateMetadata` (grep hits across `src/app/**`).
- Many routes use `export const dynamic = "force-dynamic"`, which limits static prerender work; robots/sitemap and similar remain dynamic or static as designed.
- **Collect page data:** With `staticGenerationMaxConcurrency: 1` and build output showing **"Collecting page data using 1 worker"**, the primary lever for RAM spikes is already set low.

### Large JSON imports (representative)

- Tests and guards reference **not** importing huge lesson-library JSON on hubs (`lessons-hub-import-guard.test.ts`).
- Other JSON imports include `education-image-inventory.json`, `pathway-readiness-snapshot.json`, marketing CDN catalog JSON — smaller than multi‑MB lesson libraries.

### Turbopack vs webpack

- **`npx next build`** on Next **16.2.1** logs **"Next.js 16.2.1 (Turbopack)"**. The `webpack()` hook in `next.config.mjs` applies when the build uses webpack (e.g. explicit webpack build path); Turbopack uses its own pipeline. Low concurrency settings under `experimental` still apply to the static generation phase.

## 2. Reduce build memory (safe)

- **No further config tightening** in this pass: `next.config.mjs` already sets `cpus: 1`, `staticGenerationMaxConcurrency: 1`, webpack parallelism `1`, `workerThreads: false`, `webpackBuildWorker: false`, etc.
- **Operational:** `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB` / `NODE_OPTIONS` via `ensure-node-memory.mjs` for constrained hosts.
- **Escape hatch:** `NN_SKIP_LESSON_INDEX_BUILD=true` skips the pre-`next build` lesson index gate (documented in verify script).

## 3. Instrumentation / Edge fix

| File | Change |
|------|--------|
| `src/instrumentation.ts` | Dynamic `import("@/lib/observability/home-perf-diag")` only in the Node branch of `register()` so Edge instrumentation does not statically bundle `home-perf-diag` → `server-stderr-line`. |

`server-stderr-line.ts` itself remains runtime-safe (stderr write with `console.warn` fallback); the issue was **instrumentation's top-level import graph**, not stderr helpers alone.

## 4. Verify build — results

| Command | Result | Notes |
|---------|--------|--------|
| `npm run build` (full pipeline) | **Exit 1** | Failed in **`verify:lesson-indexes`**: `ENOENT` opening `generated-indexes/us-allied-core.json` after other pathways verified. **Did not reach OOM in this run** — failure was missing/partial index artifact, not "Killed (137)". |
| `NN_SKIP_LESSON_INDEX_BUILD=1` + `npx next build` (after `ensure-node-memory` + source `.node-memory-exports.sh`) | **Exit 0** | **Compiled** (~4.1 min), **"Collecting page data using 1 worker"** completed, **Generating static pages (200/200)** completed. |

**Retry note:** User playbook suggested `NODE_OPTIONS=--max-old-space-size=4096 npm run build` after OOM — this host already used **8192** MB via `ensure-node-memory.mjs`. On true OOM, **increase** heap (`BUILD_NODE_MAX_OLD_SPACE_SIZE_MB` or higher `--max-old-space-size`) or reduce parallel work; 4096 is a *lower* cap and can worsen OOM.

## 5. Release-gate

**Not executed:** `npm run start` failed **runtime env validation** (`AUTH_SECRET` / `NEXTAUTH_SECRET`, AI keys, `AI_ADMIN_GENERATION_ENABLED`, etc.). Playwright release-gate requires a running server and optional paid credentials.

### Commands (when env and server are ready)

From `nursenest-core/` after a successful build and `npm run start` (default port **3000** unless `PORT` is set):

```bash
export BASE_URL=http://localhost:3000   # or PLAYWRIGHT_BASE_URL / NURSENEST_PRODUCTION_BASE_URL
npm run qa:release-gate:guest    # release-health + release-phase-1-guest
npm run qa:release-gate:paid     # needs paid test credentials in env
npm run qa:release-gate:mobile   # release-mobile project
# or full suite:
npm run qa:release-gate
```

Reports default to Playwright's **`playwright-report/`** and **`test-results/`** under the project cwd (see `playwright.release-gate.config.ts`).

## 6. Files changed (this phase)

- `src/instrumentation.ts` — dynamic import for `home-perf-diag` in Node-only path.
- `reports/PHASE_6_BUILD_STABILIZATION.md` — this document.

## 7. Remaining failures / recommendations

1. **Lesson index gate:** Investigate why `us-allied-core.json` was missing after `build:lesson-indexes` (generator pathway list vs verify expectations, or interrupted write). Re-run `npm run build:lesson-indexes` and confirm all expected `generated-indexes/*.json` files exist before `verify:lesson-indexes`.
2. **OOM (137) on other hosts:** Keep `experimental.staticGenerationMaxConcurrency: 1` and single worker flags; ensure sufficient swap or heap; consider `NN_SKIP_LESSON_INDEX_BUILD` on RAM-starved CI only if indexes are produced elsewhere.
3. **Turbopack vs webpack memory:** If CI must use webpack-specific cache/parallelism limits, confirm whether the pipeline should call `next build --webpack` (Next 16) for parity with `webpack()` config.
4. **Release-gate:** Provide production-like `.env` (at minimum `AUTH_SECRET`, AI gate vars) before `npm run start` + Playwright.
