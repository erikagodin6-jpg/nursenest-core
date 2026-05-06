# Build memory hotspots

**Purpose:** Surfaces scripts, configs, and data paths that drive **RSS / SIGKILL** risk on DigitalOcean and large `next build` jobs.

## Risk ratings

- **Critical** — known multi‑GiB heap users or repeated full-catalog work on the build critical path.
- **High** — large JSON or many pathways compiled into server/client graphs.
- **Medium** — tunable concurrency / cache / duplicate validation.
- **Low** — bounded, cached, or skipped in production build.

## Configuration hotspots

| Item | Location | Risk | Notes |
|------|-----------|------|--------|
| Webpack parallelism | `nursenest-core/next.config.mjs` | **Low** (mitigated) | `webpackParallelism = 1`; `config.parallelism` set; prod `config.cache = false`. |
| Static generation concurrency | `next.config.mjs` `experimental` | **Low** | `staticGenerationMaxConcurrency: 1`, `cpus: 1`, `webpackBuildWorker: false`, `memoryBasedWorkersCount: false`. |
| Duplicate typecheck+lint in `next build` | `next.config.mjs` | **Medium** (intentional) | `typescript.ignoreBuildErrors` + eslint ignore during build — **reduces** peak memory; CI must run `typecheck` separately. |
| Integrated build diagnostics | `next.config.mjs` `[nn-next-build-config]` | **Low** | JSON log of heuristic flags; disable with `NN_NEXT_BUILD_CONFIG_LOG=0`. |
| Root `tsc` | Root `package.json` → `check` | **Critical** on 2–4 GiB builders | Observed **JavaScript heap OOM** (~2 GiB default) in this environment. Prefer `nursenest-core` `typecheck:critical` or raise `NODE_OPTIONS` for root checks. |
| `next build` | `nursenest-core` | **High** | Largest single step; Dockerfile sets `NODE_OPTIONS=--max-old-space-size=4096`, `NN_LOW_MEMORY_BUILD=1`, `NN_APP_PLATFORM_BUILD=true`. |
| `run-next-prod-build.mjs` | `nursenest-core/scripts/` | **Medium** | Caps heap vs physical RAM (~55% max 6144 MiB) to reduce kernel OOM; merges heap from `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB`. |
| `ensure-node-memory.mjs` | `nursenest-core/scripts/` | **Low** | Writes `scripts/.node-memory-exports.sh`; default 4096 MiB heap when unset. |

## Script / pipeline hotspots

| Script | Risk | Notes |
|--------|------|--------|
| `run-lesson-indexes-for-build.mjs` | **High** | Runs `build:lesson-indexes` then `verify:lesson-indexes` before `next build`. Catalog normalization is **CPU + memory** heavy (observed ~61s+ for large pathways in verify logs). Escape: `NN_SKIP_LESSON_INDEX_BUILD`. |
| `build-normalized-lesson-indexes.mjs` (via npm) | **High** | Touches full pathway catalogs; keep **bounded** and deterministic for CI. |
| `prebuild` (i18n + guards) | **Medium** | Compiles i18n and validators; necessary for correctness — run before build in CI. |
| `postinstall` → `prisma-safe.mjs generate` | **Medium** | Uses stub `DATABASE_URL` in Docker; never logs secrets — uses masked target helper. |
| Root `prebuild` / `build` (`tsx script/build.ts`) | **High** (legacy path) | Root `NODE_OPTIONS=--max-old-space-size=4096` — separate from nested `nursenest-core` Next build. |

## Data / import hotspots

| Data | Location | Risk | Notes |
|------|-----------|------|--------|
| Pathway lesson `catalog.json` | `content/pathway-lessons/catalog.json` | **High** | Imported in tests and some libs; lesson index scripts merge bundled catalogs — main **volume** driver. |
| `pathway-readiness-snapshot.json` | `src/lib/navigation/` | **Medium** | Static JSON import for marketing/navigation surfaces. |
| `marketing-cdn.catalog.json` | `src/config/` | **Medium** | CDN catalog import. |

## Docker / DO

| Item | Risk | Notes |
|------|------|-------|
| Multi-stage `npm ci` + `heroku-postbuild` + `build:deploy` | **High** | Single builder stage does install, Prisma generate, Next build, prune — peak RSS here. |
| Runtime `NODE_MAX_OLD_SPACE_SIZE_MB=768` | **Low** (runtime) | Matches basic-xs constraints; separate from build heap. |

## New diagnostics

- **`npm run diagnostics:build-env`** — JSON fingerprint (Node version, memory knobs, CI/DO flags). Secret-like keys show `(redacted)` only.
- **`npm --prefix nursenest-core run build:next:timed`** — Wall-clock for **`next build` only** (optional; does not replace full `npm run build`).

## No changes made (verified absent)

- `NEXT_PRIVATE_*` / `JEST_WORKERS` — **not used** in repo grep at time of audit.
- Webpack parallelism beyond `next.config.mjs` — single source remains `webpackParallelism = 1`.
