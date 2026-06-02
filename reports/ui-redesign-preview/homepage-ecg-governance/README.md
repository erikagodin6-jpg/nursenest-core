# Homepage ECG — canonical screenshot baselines

This tree holds **optional** PNG baselines for the premium homepage **ECG ecosystem** section (`PremiumHomepageEcg`). Baselines are **not** required for CI unless your pipeline opts in.

## Regenerate baselines

From `nursenest-core/`:

1. Start Next.js (auth helper):

   ```bash
   NN_SKIP_DEV_AUTH_SECRET=1 npm run dev:next
   ```

2. In another terminal:

   ```bash
   UPDATE_ECG_GOVERNANCE_SCREENSHOTS=1 npm run test:e2e:homepage-ecg-governance
   ```

3. Review PNGs under:

   - `desktop/full-page/` — full-page captures (`1440×900` viewport)
   - `desktop/section-isolated/` — `section-premium-home-ecg` and Advanced teaser crops
   - `desktop/in-context/` — viewport centered on ECG (`block: "center"`)
   - `mobile/full-page/` — `390×844`
   - `mobile/section-isolated/` — ECG section crop on narrow screens

A `manifest.json` is written when capturing completes.

## Themes

Screenshots cycle **`ocean`**, **`midnight`**, **`sage-garden`**, **`blossom`** via `localStorage` key `nursenest-theme` **before** navigation.

**Note:** Public marketing chrome intentionally allowlists **Ocean only** for the header theme picker (`PUBLIC_MARKETING_THEME_ALLOWLIST`). Baselines still validate CSS palette switching for ecosystem-critical dark/light contrasts across named palettes used elsewhere in the product.

## Git / `.gitignore`

Top-level `reports/ui-redesign-preview/*.png` patterns may not ignore **nested** PNGs here; large binaries should be reviewed before commit. Prefer attaching baselines to release docs or storing off-repo if diff noise is unacceptable.
