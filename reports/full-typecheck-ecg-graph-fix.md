# Full TypeScript check — ECG graph restore (`fix/full-typecheck-ecg-graph`)

**Date:** 2026-05-08  
**Base:** `origin/main` @ `13597d6fd`  
**Branch:** `fix/full-typecheck-ecg-graph`  
**Git:** branch `fix/full-typecheck-ecg-graph`, single commit with message `fix(ecg): restore full typecheck graph` (hash changes if amended; use `git log -1` on the branch).
**Policy:** No push (local commit only).

## Root cause

`npx tsc -p tsconfig.json` reported **TS6053** for missing files under `src/lib/ecg/*` and `src/components/ecg/*` while `tsconfig.json` includes all `src/**/*.ts(x)`. On `main`, those directories were absent. No `@/lib/ecg/` or `@/components/ecg/` imports were found in `src/` at audit time; the failure matched a **broken filesystem graph** vs incremental expectations.

**Fix:** restore trees from `feat/ecg-premium-suite`:

`git checkout feat/ecg-premium-suite -- nursenest-core/src/lib/ecg nursenest-core/src/components/ecg`

## Validation

From `nursenest-core/`:

| Check | Result |
| --- | --- |
| Full graph `npx tsc -p tsconfig.json --noEmit --pretty false` (after `rm -f node_modules/.cache/typescript/next-app.tsbuildinfo`) | **Fails** (exit 2) on **unrelated** errors only; **no TS6053**; `rg` for `ecg-rhythm-strip|ecg-catalog|ecg-rhythm-svg|TS6053` → **no matches** |
| `npm run typecheck:critical` | **Passes** (exit 0) |
| `node --import tsx --test src/lib/modules/hidden-module-preview.test.ts src/lib/marketing/allied-hub-route-smoke.test.tsx` | **14 passed, 0 failed** |

Sample unrelated full-`tsc` errors (tail): `learner-study-modes-band.tsx` (TS2322), `use-delayed-loading.ts` (TS2322), `blog-ai-provider.ts` (TS18048), `blog-generation-jobs.ts` (TS2345), `theme-registry.ts` (TS2345).

## Merge recommendation

Merge **`fix/full-typecheck-ecg-graph`** after review to restore ECG sources. Address unrelated full-`tsc` errors separately or narrow CI until full graph is green.

## Stash

`git stash list` may contain: `wip: release-candidate status before fix/full-typecheck-ecg-graph` (used to switch branches; stash was **not** dropped).
