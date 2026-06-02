# Allied Health hub — premium module pass (implementation FINAL)

## Summary

Extended allied marketing premium study-tool grid with occupation-aware tiles: **adaptive readiness (`pathway_cat`)** when `alliedHubCatSurfaceUnlocked`, **allied clinical scenarios** (same `clinical_cases` key as NP tile but allied i18n, no `data-nn-qa-hub-np-cases`), **skills refresher** (medication drills), and **career / track blog** (`allied_career_resources`). Global `buildPremiumMarketingModuleCards` without `alliedProfessionKey` adds only **skills_refresher**; occupation-scoped tiles require `alliedProfessionKey`.

**Constraints honored:** No routing changes; no ECG on allied (`pathwayAllowsEcgLinkedLearning` unchanged); no NGN tools tile on allied; `applyAlliedOccupationPremiumModuleLocks` unchanged; locked cards still resolve via `resolvePremiumCardHref`.

## Files changed

| Area | Path |
|------|------|
| Premium module builder | `nursenest-core/src/lib/marketing/exam-pathway-hub-premium-modules.ts` |
| Contract tests | `nursenest-core/src/components/exam-pathways/exam-pathway-hub-premium-modules.contract.test.tsx` |
| Allied matrix contract | `nursenest-core/src/lib/marketing/allied-hub-premium-homepage-matrix.contract.test.ts` |
| i18n (EN source) | `tools/i18n/marketing/marketing-en.json` |
| i18n compile outputs | `nursenest-core/public/i18n/*`, `client/public/i18n/*`, `nursenest-core/src/lib/i18n/marketing-message-keys.generated.ts` (via `npm run i18n:compile`) |
| Playwright | `nursenest-core/tests/e2e/public/allied-health-hubs.spec.ts` |
| Figma program doc | `reports/allied-health-figma-ui-plan.md` (append: premium grid checklist + **Figma file TBD** table) |

## Routes (unchanged URLs)

- Global: `/allied/allied-health`, `/us/allied/allied-health`, locale-prefixed mirrors.
- Occupation: `/allied/{professionKey}` (registry-driven).

## Figma

- **Frame checklist + placeholder table:** `reports/allied-health-figma-ui-plan.md` (tail section).
- **File URL / node IDs:** **Figma file TBD** — do not invent links.
- Cross-ref: `docs/governance/figma-premium-ui-mandatory-process.md` (already lists allied plan in Related).

## Components / logic touched

- **`pushAlliedSupplementalPremiumStudyTools`** — allied-only append to study-tool list after `pushCoreStudyToolCards`, before `applyAlliedOccupationPremiumModuleLocks`.
- **`PremiumHubModuleKey`** — added `pathway_cat`, `allied_career_resources`.
- **`ExamPathwayHubPremiumModules`** — no structural change; new keys render via existing `PremiumModuleGrid` + `data-nn-qa-hub-premium-module`.

## Theme / tokens

- Allied premium band unchanged: `alliedPremiumAccentChartVar` + semantic `color-mix` top border in `exam-pathway-hub-premium-modules.tsx`.
- Section panels: existing `premiumSectionSurfaceClass` semantic mixes.

## Screenshots (Playwright artifacts)

Target directory: **`nursenest-core/docs/screenshots/allied-health-e2e/`** (existing tests write `allied-mlt-*.png`, hub desktop/mobile, etc.).

## Commands run

| Command | Result |
|---------|------|
| `npm run i18n:compile` (repo root) | **Pass** (exit 0) |
| `npm run typecheck:critical` (`nursenest-core/`) | **Pass** (exit 0) |
| `npm run test:homepage` (`nursenest-core/`) | **Pass** (77 passed, 1 skipped) |
| `npx tsx --test` … `exam-pathway-hub-premium-modules.contract.test.tsx` + `allied-hub-premium-homepage-matrix.contract.test.ts` | **Pass** (16 tests) |
| `npx playwright test tests/e2e/public/allied-health-hubs.spec.ts --project=chromium` | **Infrastructure-failed in this session** — `page.goto http://127.0.0.1:3000/allied/mlt` timed out at navigation; no dev server was running. New assertions (CAT gate, supplemental keys, no NP marker, no admin) were not reached. Run locally with the app up: `cd nursenest-core && npm run dev` then `BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/public/allied-health-hubs.spec.ts --project=chromium`. |

## Commit / push

- **Commit hash:** _(not committed in this session — `git commit` not run)_  
- **Push / deploy:** unknown


## Workspace note

The clone had many unrelated modified files. The allied premium builder in `exam-pathway-hub-premium-modules.ts` matched `HEAD` after edits (may already be committed on this branch). **`nursenest-core/src/lib/marketing/allied-hub-premium-homepage-matrix.contract.test.ts` is currently untracked** — add and commit with the allied pass. `nursenest-core/tests/e2e/public/allied-health-hubs.spec.ts` had a non-empty diff vs HEAD for overflow helpers and the occupation matrix block.
