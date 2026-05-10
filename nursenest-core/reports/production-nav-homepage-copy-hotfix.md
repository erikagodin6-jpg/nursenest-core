# Production hotfix: public nav + homepage copy

## Root cause

1. **Homepage** — Many `pages.home.*` strings used by the premium homepage were absent from `public/i18n/en/pages.json`, so the marketing provider could surface `humanizedMarketingKeyFallback` stubs (e.g. "Headline premium"). `homepage-marketing-visible-copy.ts` was hardened again (humanized match, `eyebrow` leaf, stub phrase regexes). Premium hero CTAs now use dedicated keys `pages.home.hero.premiumPrimaryCta` / `premiumSecondaryCta` so catalog values match "Start free" / "View pricing".

2. **Nav** — FAQ was desktop-dropdown-only in `global-nav-config.ts`, so it was missing from the marketing mobile drawer. Minimal layout shell messages and integrity checks ensure first-paint nav labels. Desktop "more" links use `nav-fg` for dark-mode contrast.

## Validation

- `npm run typecheck:critical` — pass
- `npm run test:homepage` — pass
- Playwright `tests/e2e/public/homepage-production-smoke.spec.ts` (chromium) — pass when server available

## Deploy

Single marketing hotfix; no schema or entitlement changes. Merge via PR; do not push from automation.

