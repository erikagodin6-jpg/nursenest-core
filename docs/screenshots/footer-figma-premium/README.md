# Footer premium — screenshot naming

Captures are written by Playwright (`tests/e2e/navigation/footer-marketing-premium.spec.ts`) when the optional evidence test runs with a live `baseURL`.

## Naming policy

- **Surface:** `footer-home-*` (marketing homepage `/`) or `footer-rn-hub-*` (US RN exam hub from `CANONICAL_PATHWAY_HUB.usRn`).
- **Theme:** `ocean`, `blossom`, or `midnight` (`data-theme` on `<html>`).
- **Viewport suffix:** `desktop` (1440×900 in spec), `tablet` (820×1100), `mobile` (390×844).

## Examples

- `footer-home-ocean-desktop.png`
- `footer-home-blossom-tablet.png`
- `footer-rn-hub-midnight-mobile.png`

Re-run capture test from app package:

`cd nursenest-core && npx playwright test tests/e2e/navigation/footer-marketing-premium.spec.ts -g "optional data-theme"`
