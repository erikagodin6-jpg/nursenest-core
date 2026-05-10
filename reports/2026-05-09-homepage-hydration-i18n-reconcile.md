# Homepage hydration fix + EN premium pages.json reconcile

## Summary

- **Hydration** (`917543493`): Hooks already top-level in `PremiumHomepageHero`; no duplicate fix in this commit.
- **EN contract**: Premium keys were missing from **`public/i18n/en/pages.json`** because **`tools/i18n/marketing/marketing-en.json`** lacked `pages.home.hero.eyebrow`, `headlinePremium`, `subheadingPremium`, CTAs, panel labels, and `pages.home.premium.readiness.dashboardCta`. Only `eyebrowBrand` existed.

## Fix

1. Added all required premium strings to **`tools/i18n/marketing/marketing-en.json`** (canonical marketing EN).
2. Ran **`npm run i18n:compile`** to regenerate shards (`nursenest-core/public/i18n`, `client/public/i18n`, generated keys).

## Regression tests

- `src/lib/marketing/premium-homepage-hero.hooks.contract.test.ts` — no hooks inside `try/catch`.
- `tests/e2e/public/homepage-stays-loaded-after-hydration.spec.ts` — rejects "Something went wrong loading this section".
- `package.json` `test:homepage` includes hooks contract.

## Validation

- `npm run typecheck:critical` — pass
- `npm run test:homepage` — pass
- `npm run build` — failed in sandbox with "Another next build process is already running" (lock); re-run on clean runner.

## Post-deploy

Verify DO SHA; run Playwright homepage stability vs production when 200.
