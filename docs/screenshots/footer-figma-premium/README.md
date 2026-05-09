# Footer premium — screenshots

Store Playwright and manual captures for the marketing **SiteFooter** refresh (`data-nn-footer-layout="marketing"`).

## Expected layout

- **Homepage** `/` and **RN hub** `/us/rn/nclex-rn` (US cookie), themes **ocean**, **blossom**, **midnight**, viewports **desktop (1280+)**, **tablet (~820)**, **mobile (390)**.

## Automated captures

With dev server or `baseURL` set:

```bash
cd nursenest-core
npx playwright test tests/e2e/navigation/footer-marketing-premium.spec.ts --project=chromium
npx playwright test tests/e2e/public/footer-premium-responsive.spec.ts --project=chromium
```

Artifacts are written here by `footer-marketing-premium.spec.ts` (full-page PNGs per theme × viewport).

## Manual / Figma

If Figma frames are not yet linked in-repo, attach exports under this folder using the same naming pattern: `footer-home-{theme}-{viewport}.png`, `footer-rn-hub-{theme}-{viewport}.png`.

## Blockers

- CI without a reachable `baseURL` skips overflow/theme evidence runs; document `SKIP` in the implementation report when that applies.
