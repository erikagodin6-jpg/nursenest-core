# Allied + New Grad premium hub implementation — final report

**Date:** 2026-05-09  
**Scope:** Marketing / pathway hub surfaces for **Allied Health occupation hubs** and **New Grad** (transition tier hub, US/CA marketing landing, work-area hubs). **No deploy or git push.**

## Product intent (Figma-aligned)

- **Hierarchy:** Shared hero band stays primary; new **guided study path** strip (`data-nn-marketing-hub-guided-path="1"`) sits **above** modality grids.
- **Compact analytics:** Allied live inventory and New Grad work-area snapshot use tighter padding, **semantic badges** (`nn-badge-semantic-*`), shorter copy. Tags: `data-nn-allied-hub-compact-analytics`, `data-nn-new-grad-compact-analytics`.
- **Tokens:** Allied `data-nn-allied-hub-tone` + globals `color-mix` on semantic vars. New Grad: `nn-premium-pathway-hub--new-grad` hero border tweak.
- **Removal:** Allied duplicate bottom "Already subscribed?" row removed (links remain elsewhere).

## ECG / CAT

Unchanged: `resolveMarketingHubEcgModulePublic`, `alliedHubCatSurfaceUnlocked`, `AlliedPathwayHubCatCard`, New Grad CAT module expectations in existing specs.

## Files changed

- `src/components/marketing/marketing-hub-guided-study-path.tsx` (new)
- `src/lib/marketing/is-new-grad-transition-pathway.ts` (new)
- `src/lib/marketing/is-new-grad-transition-pathway.test.ts` (new)
- `src/components/marketing/allied-health-pathway-hub.tsx`
- `src/components/marketing/nursing-tier-hub-page.tsx`
- `src/components/marketing/new-grad-marketing-landing.tsx`
- `src/components/marketing/new-grad-work-area-hub.tsx`
- `src/app/globals.css`
- `tests/e2e/public/allied-health-hubs.spec.ts`
- `tests/e2e/public/new-grad-hubs.spec.ts`
- `src/components/marketing/nursing-tier-hub-page.test.tsx`

## Playwright

- `tests/e2e/public/allied-health-hubs.spec.ts` — screenshot dir: repo `docs/screenshots/allied-newgrad-figma/`; guided path (occupation hubs); MLT vs RN headline.
- `tests/e2e/public/new-grad-hubs.spec.ts` — same dir; guided path on transition + marketing landings.

Generate PNGs: `cd nursenest-core && BASE_URL=http://localhost:3000 npx playwright test tests/e2e/public/allied-health-hubs.spec.ts tests/e2e/public/new-grad-hubs.spec.ts`

## Commands (cwd nursenest-core/nursenest-core)

| Command | Exit |
|---------|------|
| npm run typecheck:critical | 0 |
| npm run test:homepage | 0 |
| node --import tsx --test src/lib/marketing/is-new-grad-transition-pathway.test.ts | 0 |
| node --import tsx --test src/lib/marketing/allied-hub-route-smoke.test.tsx | 0 |

## Blockers

- Screenshots not captured in this session (no dev server + BASE_URL Playwright run).
- `nursing-tier-hub-page.test.tsx` not run here (missing @happy-dom/global-registrator).
- Truthpack folder absent in clone.

## Verdict

Ready for staging QA after Playwright + visual theme pass on Allied occupations and New Grad surfaces.
