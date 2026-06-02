# Hub Figma implementation — final report

**Date:** 2026-05-09  
**App root:** `nursenest-core/nursenest-core` (Next.js package).  
**Git root:** `/root/nursenest-core`. **No git push** per request.

## Executive summary

Audited nursing tier hubs (`NursingTierHubPage`), exam overview hubs (`ExamPathwayHub` + `ExamPathwayHubBody`), allied hubs (`AlliedHealthPathwayHub`), and the shared premium grid (`ExamPathwayHubPremiumModules` + `buildPremiumMarketingModuleCards`). Implemented a **single shared hero primitive** (`MarketingPathwayHubHeroBand`) so RN/RPN/NP/New Grad tier hubs, NP/RN **exam overview** hubs, and allied occupation hubs share the same gradient band, semantic glow accents, and `data-nn-hub-section="identity-hero"` hook. **Module inventory and gating were not changed** (per `exam-pathway-hub-premium-modules` + `pathwayAllowsEcgLinkedLearning` + allied policy). Screenshot evidence for this program is **canonical under** `nursenest-core/docs/screenshots/hub-figma-implementation/` (path inside the Next app package). Added `npm run test:e2e:hub-figma` and `playwright.hub-figma.config.ts` for targeted smoke.

**Figma:** No Figma file URL exists in-repo for this pass. Frame mapping follows existing CSS comments in `premium-redesign-2026.css` (“Pathway tier hub — hero band elevation consistent with in-repo homepage mockups”) and `docs/pathway-hub-architecture.md` / `docs/hub-module-relocation-FINAL.md`.

## Audit — hub surfaces

| Surface | Primary components | Premium modules | Notes |
|--------|-------------------|-----------------|-------|
| Tier pathway hubs (RN, RPN/REx-PN, NP, New Grad) | `NursingTierHubPage` | `ExamPathwayHubPremiumModules` | Quick actions grid + premium bands |
| Exam overview `[locale]/[slug]/[examCode]` | `ExamPathwayHub` → `ExamPathwayHubBody` | Same premium component after primary study cards | Wrapped with `nn-premium-pathway-hub` + `data-pathway-track` for shared CSS |
| Allied global chooser | `AlliedHealthPathwayHub` (`occupationPickerOnly`) | **No** premium grid (by design) | Occupation picker + measurement toggle |
| Allied occupation hubs | `AlliedHealthPathwayHub` + profession | `ExamPathwayHubPremiumModules` with `alliedProfessionKey` | ECG omitted at builder level for allied |
| Pre-nursing marketing | `pre-nursing-marketing-hub-main` | Premium modules for PN tier | Unchanged in this pass |

**Premium builder** (`src/lib/marketing/exam-pathway-hub-premium-modules.ts`):

- **ECG:** `pathwayAllowsEcgLinkedLearning` — RN/NP `stripeTier` only; excludes REx-PN / `new-grad` ids; allied never receives ECG tile from nursing matrix; NP uses **core** ECG entry `/modules/ecg/basic/lessons` (see `ecg-linked-learning.ts`; not Advanced ECG Program).
- **NP:** `clinical_cases` + `np_clinical` QA marker; **no** generic `clinical_scenarios` row for NP.
- **OSCE:** Pushed in core study tools with feature-flag lock; allied uses profession-scoped OSCE href helper.
- **CAT:** Nursing: `pathway_cat_landing`; allied: `pathway_cat` when `alliedHubCatSurfaceUnlocked(professionKey)`; New Grad strip uses `new_grad_pathway_cat`.
- **Allied:** No `hub_lessons` marketing card; NGN tools omitted; `pushAlliedSupplementalPremiumStudyTools` adds skills refresher, optional CAT, clinical cases for core pathway ids, career blog.

## Tier coverage (module visibility — policy unchanged)

| Tier / hub | ECG | NP clinical | OSCE row | CAT surfaces | Notes |
|------------|-----|-------------|----------|--------------|-------|
| US RN | Yes (when `ecgModulePublic`) | — | Yes (gated) | `pathway_cat_landing` | |
| Canada RPN / REx-PN | **No** | — | Yes | CAT landing | Contract tests enforce no ECG marker |
| US NP | Yes | Yes (`clinical_cases`) | Yes | Same | |
| New Grad RN | **No** | — | Yes | New-grad strip + transition cards | Separate `newGrad` band |
| Allied occupation | **No** | No | Yes (copy variant) | Conditional `pathway_cat` | E2E: no NGN in premium zone |

## Files changed

- `src/components/marketing/marketing-pathway-hub-hero-band.tsx` — **new** shared hero.
- `src/components/marketing/nursing-tier-hub-page.tsx` — uses shared hero.
- `src/components/exam-pathways/exam-pathway-hub.tsx` — `nn-premium-pathway-hub`, `data-pathway-track`, shared hero.
- `src/components/marketing/allied-health-pathway-hub.tsx` — hero refactored to shared primitive.
- `tests/e2e/public/nursing-pathway-hubs-smoke.spec.ts` — screenshot dir → `hub-figma-implementation`; assert `identity-hero`.
- `tests/e2e/public/allied-health-hubs.spec.ts` — screenshot dir → `hub-figma-implementation`.
- `tests/e2e/public/hub-figma-implementation-smoke.spec.ts` — **new** smoke.
- `playwright.hub-figma.config.ts` — **new** config.
- `package.json` — `test:e2e:hub-figma` script.
- `docs/screenshots/hub-figma-implementation/README.md` — **new** canonical path doc.

**Intentionally not changed:** `buildPremiumMarketingModuleCards` logic, routes, auth, SEO loaders, lazy-loading boundaries, `pathway-hub-premium-modules-interaction` default screenshot dir (`test-results/hub-modules/`).

## Playwright

| Command | Role |
|---------|------|
| `npm run test:e2e:hub-figma` | `playwright.hub-figma.config.ts` → `hub-figma-implementation-smoke.spec.ts` |
| `npx playwright test -c playwright.nursing-hubs.config.ts` | RN/RPN/NP/New Grad smoke + full-page screenshots |
| `npx playwright test tests/e2e/public/allied-health-hubs.spec.ts` | Allied registry + matrix |
| `npm run test:e2e:hub-modules` | Guest interaction + tier gates |

## Screenshot canonical path

**Use:** `nursenest-core/nursenest-core/docs/screenshots/hub-figma-implementation/` (app-relative `docs/screenshots/hub-figma-implementation/` inside the Next package).

## Validation commands (cwd: `nursenest-core/nursenest-core`)

| Command | Exit code | When run |
|---------|-----------|----------|
| `npm run typecheck:critical` | **0** | This session |
| `npm run test:homepage` | **0** | This session |
| `npm run test:e2e:hub-figma` | **0** | With dev server on `127.0.0.1:3000` (reuse) |

**Blockers / environment notes:**

- Global `/allied/allied-health` does **not** render `ExamPathwayHubPremiumModules`; smoke uses `/allied/respiratory` for allied premium assertions.
- If port `3000` is in use and `PLAYWRIGHT_NO_REUSE_WEB_SERVER=1`, webServer may hit **EADDRINUSE**. Use default reuse or `PLAYWRIGHT_SKIP_WEB_SERVER=1` with manual `npm run dev:next`.

## Figma parity & production readiness (honest)

- **Visual parity:** Not pixel-compared to an external Figma file; aligned with in-repo premium pathway CSS and consolidated hero markup.
- **Production readiness:** **Medium-high** for shell-only changes: `typecheck:critical` and `test:homepage` green; `test:e2e:hub-figma` green against live dev. Full nursing + allied screenshot matrices not re-run after dir change in this session—run before release if screenshots are artifacts.
- **Clutter reduction:** No further duplicate premium blocks removed (`docs/hub-module-relocation-FINAL.md` already documents prior composition work).

## Truthpack

`.vibecheck/truthpack/` was **not present** in this workspace clone; behavior verified against code and contract tests.

*Verified By VibeCheck ✅*
