# Tools + FAQ redesign — completion summary

**Date:** 2026-05-08

## Routes touched (marketing)

| Route | Notes |
|-------|--------|
| `/tools`, `/[locale]/tools` | `ToolsHubClient` — premium hero (`.nn-tools-marketing-hero`), semantic multi-hue icon tiles, elevated cards, `data-testid="marketing-tools-hub"` |
| `/tools/[slug]` | `ToolsToolShell` — pill back link, `nn-marketing-h2` title, calculator wrapped in `.nn-tools-calculator-surface`, `data-testid="marketing-tool-{slug}"` |
| `/faq`, `/[locale]/faq` | Legal FAQ in card surface (`.nn-faq-marketing-root`); product FAQ section restyled; **locale FAQ now includes `FaqProductScreenshotsSection`** (parity with default) |

## CSS

- `src/app/premium-redesign-2026.css`: `.nn-tools-marketing-hero`, `.nn-tools-calculator-surface`, `.nn-faq-marketing-root` (token-only gradients and elevation).

## Calculators (UI only; logic unchanged)

- Tab pills: focus rings, semantic inactive surfaces, primary active state.
- Result / validation panels: `semantic-surface`, `elevation-rest`, `semantic-warning` for validation text (replaced raw amber utilities).
- **IV infusion:** removed hardcoded English intro line; appended `tools.disclaimer` for consistency.
- **Transfusion safety:** `common.previous` / `common.next`; rationale colors use `--semantic-success` / `--semantic-warning`; option buttons tokenized.
- **Lab values:** table container + header row use semantic tints.

## Tests

- Added `tests/e2e/public/tools-faq-marketing.spec.ts` (mobile viewport, `/tools`, `/tools/med-math`, `/faq`, console hygiene, link 404 check, horizontal overflow).
- Run locally: `npm run typecheck:critical`, `npm run test:homepage`, `npx playwright test tests/e2e/public/tools-faq-marketing.spec.ts` (requires dev server on `BASE_URL`).

## Screenshots

- Capture when app is up: `npm run ui-preview:capture` (includes `tools` route) or Playwright trace screenshots on failure.
- Existing repo snapshots under `reports/ui-redesign-preview/` include `faq-page-garden-desktop.png`; refresh after visual sign-off.

## Regression smokes (if specs exist)

- Homepage: `tests/e2e/public/homepage-premium-body.spec.ts`, `homepage-production-smoke.spec.ts`
- RN/RPN hubs, blog, pricing: see `tests/e2e/public/` and release-gate configs.

## Blockers / follow-ups

- **Typecheck:** run `npm run typecheck:critical` in `nursenest-core/` when the toolchain is responsive (long-running `tsc` was backgrounded in agent env).
- **Playwright:** needs `next dev` or deployed `BASE_URL`.
- **Screenshots:** regenerate desktop/mobile PNGs into `preview-screenshots/` after approval.

