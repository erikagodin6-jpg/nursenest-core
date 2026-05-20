# Homepage / theme regression fixes (2026-05-08)

Surgical visual, readability, and default-copy fixes for the premium marketing homepage. No route, auth, entitlement, pricing, analytics event name, API, or SEO metadata changes.

## Files changed (this pass)

| Area | Files |
|------|--------|
| Dark-mode text + surfaces | `src/app/globals.css` — register `midnight` and `apex` on the shared **dark palette** block; map `--palette-heading`, `--palette-text`, `--palette-text-muted` to computed dark `--text-*` so utilities using palette tokens are not stuck on `:root` slate. |
| Apex theme surfaces | `src/app/theme-palettes.css` — `color-scheme: dark` plus shadcn-style page/card/nav/input tokens so Apex is not a dark page with light card fallbacks. |
| Premium nav / tier row | `src/app/premium-redesign-2026.css` — Midnight + Apex overrides for exam-family row active/hover (primary-tinted glass instead of white 18% wash). |
| Shared CTAs | `src/lib/theme/marketing-hero-pattern.ts` — `min-w-0` on primary/secondary/tertiary marketing CTAs; tertiary adds `gap-2`. |
| Globals button polish | `src/app/globals.css` — `.nn-btn-primary.inline-flex` / `.nn-btn-secondary.inline-flex` use `min-width: 0`; nested `svg` `flex-shrink: 0`. |
| Home sections | `src/components/marketing/home/premium-*.tsx` — `shrink-0` on chevron icons, `min-w-0` on pathway/flow/CTA tiles; updated English fallbacks for title case / CTA labels. |

## Contrast / dark mode

- **Root cause:** `midnight` and `apex` were not on the `html[data-theme="dark-*"]` dark block, so `--text-primary` stayed light-theme. Headings use `--palette-heading`, which never tracked dark foreground.
- **Fix:** Include both themes in the dark block; sync `--palette-heading`, `--palette-text`, `--palette-text-muted`.
- **Apex:** Full dark card/page/nav/input tokens in `theme-palettes.css`.
- **Tier strip:** Overrides in `premium-redesign-2026.css` for Midnight/Apex.

## Button / link fitting

- `min-w-0` on marketing CTA utility classes; global `svg` shrink guard; `min-w-0` + `shrink-0` on homepage tiles/links as noted above.

## Capitalization (English fallbacks)

Title case for headings/CTAs where listed in PR scope; body remains sentence case. i18n JSON shards not edited (may override fallbacks in production).

## Validation

- `npm run typecheck:critical` — pass
- `npm run test:homepage` — pass
- `theme-palettes-order.test.ts` — pass
- Playwright `homepage-production-smoke.spec.ts` — **blocked** (no server on localhost:3000)

## Screenshots

Not captured (no dev server on port 3000). Intended locations: `preview-screenshots/` and `reports/ui-redesign-preview/` under the `nursenest-core` package.
