# Production nav & homepage copy hotfix

## Root cause

1. **Premium homepage** used flat i18n keys under `pages.home.premium.*` and `pages.home.hero.*` that were missing from the English catalog for several sections (pathways showcase, clinical depth, study ecosystem). When `formatMarketingMessage` normalized to empty, `MarketingI18nProvider` returned `humanizedMarketingKeyFallback()`, producing visible stubs (e.g. "Headline Premium").
2. **Public header** desktop chrome was gated at **1280px** while many viewports and tests use **1024px**, so full nav and tier hub row did not appear on standard "desktop" widths below `xl`.

## What changed (follow-up on `hotfix/production-nav-homepage-copy`)

- `tools/i18n/marketing/marketing-en.json` — added missing `pages.home.premium.pathways.*`, `clinicalDepth.*`, `studyEcosystem.*` copy; ran `npm run i18n:compile`.
- `nursenest-core/public/i18n/**` — regenerated from compile.
- `nursenest-core/src/app/globals.css` — header desktop / utility / overlay / hub-strip breakpoints **1280px → 1024px** (Tailwind `lg`).
- `nursenest-core/tests/e2e/public/homepage-production-smoke.spec.ts` — reject placeholder / leaked `pages.home.*` patterns in `main`.
- `nursenest-core/tests/e2e/public/marketing-nav-footer-theme-links.spec.ts` — new; desktop + mobile drawer must show Pricing, Blog, FAQ, Pre-Nursing, Tools, RN/PN/NP/New Grad/Allied, Log In, Start Free.

Earlier commit on this branch: premium hero keys (`headlinePremium`, `premiumPrimaryCta`, panel/stats/trust), `homepage-marketing-visible-copy` guards, `global-nav-config` FAQ in mobile drawer, layout integrity + contract tests.

## Tests

From `nursenest-core/` in the hotfix worktree:

- `npm run typecheck:critical`
- `npm run test:homepage`
- `npx playwright test tests/e2e/public/homepage-production-smoke.spec.ts --project=chromium`
- `npx playwright test tests/e2e/public/marketing-nav-footer-theme-links.spec.ts --project=chromium`

**Playwright blocker:** requires a running server at `BASE_URL` (default `http://localhost:3000`). Without `npm run dev` or `npm run start`, tests fail with connection refused.

## Deploy

No migrations. Deploy compiled `public/i18n` with the app bundle.

**Push:** pending (per instructions).
