# Hub Figma implementation — screenshot canonical path

**Location (canonical):** `nursenest-core/docs/screenshots/hub-figma-implementation/` (inside the Next.js app package, i.e. repository path `nursenest-core/nursenest-core/docs/screenshots/hub-figma-implementation/`).

Playwright specs that capture hub marketing surfaces for visual evidence should write PNGs here:

- `tests/e2e/public/nursing-pathway-hubs-smoke.spec.ts` — RN / RPN / NP / New Grad × desktop/mobile × Ocean / Blossom / Midnight
- `tests/e2e/public/allied-health-hubs.spec.ts` — Allied global + occupation matrix screenshots
- `tests/e2e/public/hub-figma-implementation-smoke.spec.ts` — lightweight cross-check + smoke capture

**Note:** `pathway-hub-premium-modules-interaction.spec.ts` continues to default to `test-results/hub-modules/` unless `HUB_MODULES_SCREENSHOT_DIR` is set (keeps existing CI contract).

See `reports/hub-figma-implementation-FINAL.md` for audit summary, module policy, and command exit codes.
