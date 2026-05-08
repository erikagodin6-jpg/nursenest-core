# Phase 6B — Allied / generated-index pipeline (`us-allied-core.json`)

## Package root

Next.js app and npm scripts: **`nursenest-core/nursenest-core/`** (monorepo nested package).

## Root cause

1. **Order + OOM/time**: Allied indexes were logically last when iterating heavy RN pathways first; SIGKILL/OOM (exit **137**) before allied wrote leaves `us-allied-core.json` missing at verify.
2. **Empty bundled allied**: Missing/zero `allied-bundled-catalog.json` merge → no allied pathway in `listCatalogPathwayIdsWithLessonsSync()`.
3. **`NN_SKIP_LESSON_INDEX_BUILD`**: No JSON artifacts.

## Fixes

- Allied pathways sorted **first**; union with `mandatoryAllied`; bundled-only non-empty checks; post-loop allied file asserts; verify requires allied JSON when bundled non-empty; gate logs absolute `generated-indexes` path and warns on skip.

## Verification (local agent)

- `npm run typecheck:critical`: PASS
- `npm run build:lesson-indexes` + `npm run verify:lesson-indexes`: PASS (9 files; `us-allied-core` written first)
- Full `npm run build`: lesson gate PASS; `next build` hit duplicate-process lock once; standalone `npx next build` **Killed (137)** — OOM in low-RAM env
- Release gate: `validate-release-gate-env.mjs` PASS; paid/free/admin creds missing (skipped projects)

## Exit 137

SIGKILL — typically OOM; not a lesson-index validation error.

## Files changed

- `scripts/build-normalized-lesson-indexes.runner.mts`
- `scripts/verify-normalized-lesson-indexes.runner.mts`
- `scripts/run-lesson-indexes-for-build.mjs` (logging already present)

## Detailed file list (this PR)

- `nursenest-core/scripts/build-normalized-lesson-indexes.runner.mts` — bundled-allied non-empty guard; allied index post-checks; `buildLessonNormalizationCoverageReport({ pathwayIds: ids })` fix.
- `nursenest-core/scripts/verify-normalized-lesson-indexes.runner.mts` — require `us-allied-core.json` / `ca-allied-core.json` when `getCatalogLessonsRawFromBundledOnly` is non-zero.
- `nursenest-core/scripts/run-lesson-indexes-for-build.mjs` — indexDir + ready path (pre-existing in branch; no change required for allied fix).

## Smoke / start

- `npm run start` and route smoke **not run**: `next build` did not complete (137), so a trustworthy production `start` was not validated here.
