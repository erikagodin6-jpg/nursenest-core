# Phase 6C — Build performance & memory (May 2026)

## Scope

Next app root: **`nursenest-core/`** (package `rest-express`, `next.config.mjs`).

## Phase 6B coordination

- **`reports/PHASE_6B_ALLIED_INDEX_PIPELINE.md`**: not present in this clone.
- **Allied / RN / PN / NP index behavior preserved**: build runner enumerates `ALLIED_MARKETING_CORE_PATHWAY_IDS`, fails fast if allied bundled merge is empty, sorts pathways **allied-first**, and verify refuses missing `us-allied-core.json` / `ca-allied-core.json` when those pathways have merged catalog rows.

## Low-memory Next / webpack settings (verified)

From `nursenest-core/next.config.mjs` (build diagnostics line):

- `experimental.cpus`: **1**
- `experimental.staticGenerationMaxConcurrency`: **1**
- `experimental.workerThreads`: **false**
- `experimental.webpackBuildWorker`: **false**
- `experimental.memoryBasedWorkersCount`: **false**
- `webpack`: `parallelism` **1**, production `cache`: **false**

## Pipeline timing profile (this environment)

| Stage | Approx. notes |
|--------|----------------|
| `i18n:compile` (prebuild) | ~2–4 min wall-clock |
| `build:lesson-indexes` | ~1–5.5 min; hotspots: `normalized_pathway_catalog` |
| `verify:lesson-indexes` | ~3–7 min cold; ~3 min warm |
| `next build` compile | ~2.5–4.5 min (Turbopack) |
| `next build` page-data | High RSS — see Blockers |

## Optimizations implemented

1. **Verify live parity**: `liveLessonIndexParityWithoutDisk` merges two tmpdir passes per pathway (~37% faster cold verify in session: ~11 min → ~7 min).
2. **Compact generated JSON** in `build-normalized-lesson-indexes.runner.mts`.
3. **`run-next-prod-build.mjs`**: `phase_ms` logs per major phase.
4. **`ensure-node-memory.mjs`**: host-sized default heap (same 55% cap as `run-next-prod-build.mjs`) when heap not explicitly set.
5. **Verify**: allied index files required when allied pathways have catalog rows.

## Before / after (representative)

| Metric | Before | After |
|--------|--------|-------|
| verify cold wall | ~669 s | ~420 s |
| verify warm wall | — | ~188 s |
| default heap ~7.9 GiB host | 8192 MiB | ~4367 MiB |

## Validation

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | Pass |
| `npm run build` | Exit **137** during Collecting page data on ~8 GiB RAM agent |
| `verify:lesson-indexes` | Pass; `us-allied-core.json` produced |

## Files touched

- `scripts/verify-normalized-lesson-indexes.runner.mts`
- `scripts/build-normalized-lesson-indexes.runner.mts`
- `scripts/run-next-prod-build.mjs`
- `scripts/ensure-node-memory.mjs`

## Blockers / go-live

- Full `npm run build` may **SIGKILL** on **~8 GiB** builders during static generation — use **≥12 GiB RAM or swap**, or larger CI runner.
- Release gate tests not run (build incomplete on this host).

