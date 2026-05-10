# Final independent QA pass — 2026-05-09

**Workspace:** `/root/nursenest-core`  
**Package under test:** `nursenest-core/` (Next.js app — run npm scripts from `nursenest-core/` cwd).

> **Note:** Target path `reports/final-qa-pass.md` is not writable from this environment; this file lives under `docs/` as the canonical copy.

## Executive verdict

**Not safe for `main` merge/push:** homepage/marketing contract tests and production **`npm run build`** succeeded after regenerating lesson indexes; **`npm run typecheck:critical`** passed (also after clearing corrupted `.next`). **Full `npm run typecheck` failed** (`EXIT:2`, multiple TS errors). **Playwright `release-phase-1-guest`** **failed** (3 tests). Remaining **full E2E**, **mobile/theme Playwright**, and **saved route screenshots** were **not fully executed** — treat as **blocking until green**.

**Git:** `main`, aligned with `origin/main`; **large unstaged/untracked change set** (i18n, hub modules, new E2E helpers). **Remote:** only `origin` → `git@github.com:erikagodin6-jpg/nursenest-core.git`. **No merge/push performed.**

---

## Issues found

| Issue | Severity | Notes |
|-------|-----------|--------|
| Corrupted `.next/dev/types/routes.d.ts` | Blocker for `typecheck:critical` until cleared | `tsc` reported `TS1434` / parse errors in generated routes types. **Mitigation:** `rm -rf nursenest-core/.next` then re-run; after full `next build`, `.next` regenerated cleanly. |
| Missing lesson index file during first `npm run build` | Blocker | `ENOENT` for `ca-rpn-rex-pn.json` under `generated-indexes` during `verify:lesson-indexes`. **Mitigation:** ran `npm run build:lesson-indexes` (exit 0); wrote `ca-rpn-rex-pn.json` and peers; **second `npm run build` succeeded.** |
| Playwright `npm run qa:release-gate:list` extremely slow | Operational | Completed successfully but **~938s wall clock** for `--list` only — environment/load dependent; full gate not run here. |
| First `npm run test:homepage` failure (historical) | Resolved | Earlier failure referenced `alliedHub` / Pre-Nursing regex; **current tree passes** (see below). |

---

## Fixes applied (this session)

1. **`rm -rf nursenest-core/.next`** — restored clean critical typecheck against broken generated route typings.
2. **`npm run build:lesson-indexes`** — produced missing normalized pathway JSON indexes including **`ca-rpn-rex-pn.json`**.
3. **Re-ran `npm run build`** — completed successfully (standalone + verify-dist steps).

No auth, entitlement, or paywall logic was changed.

---

## Command results (exact cwd: `nursenest-core/`)

### 1. `npm run test:homepage`

**Final run:** exit **0**  
**Summary:** `# tests 72` → `# pass 71`, `# fail 0`, `# skipped 1`, `# duration_ms` ~19–22s (approx).

### 2. `npm run typecheck:critical`

**After `.next` cleanup / post-build:** exit **0** (sample: **~31s**).

**Initial failure (before `rm -rf .next`):** errors in `.next/dev/types/routes.d.ts` (`TS1434`, `TS1109`, `TS1128`).

### 3. Full `npm run typecheck`

**Completed (background job ~52 min):** exit **`EXIT:2`** — **TypeScript errors remain**, including (non-exhaustive):

- `layout.tsx` — `serverHasStaffSession` not in `Attributes`
- `bowtie-question-renderer.tsx` — `correctIds` vs `correct`
- `marketing-for-institutions-premium-client.tsx` — `asChild` on `Button`
- `learner-study-modes-band.tsx` — `dashboard_study_modes_grid` vs `StudyLoopCatSurface`
- `use-delayed-loading.ts` — `number` vs `Timeout`
- `blog-ai-provider.ts`, `blog-generation-jobs.ts`, `pathway-lesson-catalog-sync.ts`, `theme-registry.ts`, etc.

One earlier full-typecheck shell job **aborted** without capturing output; the **`tee /tmp/tsc-full.log`** run produced the list above.

### 4. Playwright release gate + full E2E

| Command | Result |
|---------|--------|
| `npm run qa:release-gate:list` | exit **0**; **19 tests** in **9 files** (listed). **~938s** elapsed in this environment. |
| `npx playwright test -c playwright.release-gate.config.ts --project=release-phase-1-guest` | **FAILED** — **3 failed**, **1 skipped** (~26 min). Guest marketing suite: homepage/pricing/signup/login shell check failed; **`/signup` mobile** — **page crashed**; **`/app/onboarding` redirect** — **timeout**. Summary JSON: `test-results/release-gate-summary.md` / artifacts under `test-results/release-gate/artifacts/`. |
| `npm run qa:release-gate` / `npm run test:e2e` / `test:e2e:full-regression` | Full matrix **not** re-run beyond the guest project above. |

### 5. Mobile / theme Playwright

**Status:** **Not run** (`test:e2e:mobile`, release-gate mobile project, theme-specific configs).

### 6. `npm run build` (production)

**First attempt:** **failed** during `verify:lesson-indexes` (`ENOENT` `ca-rpn-rex-pn.json`).  
**Second attempt (after `build:lesson-indexes`):** exit **0**; Next.js route table printed; standalone static + lesson-index copy steps completed (~**388s** logged for last run tail).

---

## Contract / module gating (automated spot-check)

Covered via **`npm run test:homepage`** including `exam-pathway-hub-premium-modules.contract.test.tsx` and `buildPremiumMarketingModuleCards` suites: ECG scope (RN/NP vs RPN), NP clinical tile, OSCE gating, Pre-Nursing omissions, allied `alliedProfession` query scoping, no `/admin` in hub HTML samples.

---

## Allied Health reports

No `reports/allied-health-*` files were found at repo root via glob in this session. Lesson normalization outputs **were** written under `nursenest-core/reports/` during `build:lesson-indexes` (e.g. `lesson-normalization-coverage.json` / `.md`). **Counts are build-derived, not hand-entered.**

---

## Pre-Nursing

Contract tests assert Pre-Nursing hub markup (foundations ecosystem label pattern, mini adaptive exam, lesson library) and omit ECG in card matrix — aligned with automated checks in this pass.

---

## Screenshots

Directory prepared: `docs/screenshots/final-qa-2026-05-09/README.md` explains that **no PNGs were captured** in this run; follow instructions there for CI/local capture.

---

## Routes / surfaces (coverage level)

| Area | Coverage |
|------|----------|
| Homepage + marketing chrome | Contract tests (`test:homepage`) |
| Pathway hubs (premium modules) | Same + DOM contract tests |
| Full manual/browser QA | **Not performed** |
| Playwright smoke/release gate | **List only**; execution **pending** |

---

## Build / deploy

**Production `npm run build`:** **PASS** (after lesson index generation).  
**Deploy:** not executed.

---

## Remaining blockers before merge to `main`

1. Complete **`npm run typecheck`** (full project).  
2. Run **`npm run qa:release-gate`** (and paid/mobile subsets if credentials exist).  
3. Run requested **full E2E** per `package.json` (`test:e2e`, `test:e2e:full-regression` or CI equivalent).  
4. Capture **screenshots** per brief or attach CI artifact paths.  
5. Resolve **git hygiene**: commit or discard **large dirty tree** before merge.

---

## Explicit verdict

**Not safe for `main`.** Full **`npm run typecheck`** is **red**; **`release-phase-1-guest`** Playwright is **red**. **Build + homepage contracts + critical typecheck** passed — insufficient for merge until TS and Playwright gates are fixed and re-run.
