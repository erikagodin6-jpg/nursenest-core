# Marketing header layout fix (2026-05-09)

## Root cause

- Desktop marketing chrome (utility band, three-column grid, tier rail) was gated at **1280px**, so **1024–1279px** used the mobile header on a desktop-wide viewport → crowding and overlap risk.
- The grid middle column kept the nav cluster **content-sized** (`justify-self: center` + bounded width), so long editorial links could still **bbox-overlap** the auth/utility cluster at 1280px.

## Fix

- Align marketing header breakpoints to **1024px (Tailwind `lg`)** in `globals.css` for: `.nn-header-desktop-grid`, `.nn-header-hide-until-xl` / `-flex`, mobile-only rows, overlay (hub strip was already 1024px).
- Grid: middle column stays **`auto minmax(0, 1fr) auto`**; **`.nav`** uses **`justify-self: stretch`**, **`width: 100%`**, and brand/auth tracks get **`max-width`** caps so links wrap inside the fluid column instead of overlapping auth.
- `site-header.tsx`: main marketing **`nav`** adds **`w-full max-w-full`**.
- `marketing-header-utility-strip.tsx`: utility root uses **`min-w-0 shrink`** so controls can wrap under pressure.
- Brand: **`.nn-header-brand-lockup { color: var(--semantic-brand); }`** in globals; lockup children use **`text-current`** (`header-brand-lockup.tsx`, pre-existing) for computed-color parity in tests.

## Files changed

- `src/app/globals.css`
- `src/app/premium-redesign-2026.css` (comment)
- `src/components/layout/site-header.tsx`
- `src/components/layout/marketing-header-utility-strip.tsx`
- `tests/e2e/public/marketing-header-layout-responsive.spec.ts`

## Screenshots

PNG artifacts from Playwright (when run against a live dev server):

- `docs/screenshots/marketing-header/after-fix-chromium-1024x900.png`
- `docs/screenshots/marketing-header/after-fix-chromium-768x1024.png`
- `docs/screenshots/marketing-header/after-fix-chromium-390x844.png`

The spec also writes `after-fix-chromium-1280x900.png` on the 1280 test; add that file after a green local run if you want it in-repo.

## Tests run (this agent)

- `npm run typecheck:critical` — pass
- `npm run test:homepage` — pass
- `npx playwright test tests/e2e/public/marketing-header-layout-responsive.spec.ts --project=chromium` — **not verified here** (local `127.0.0.1:3000` hung / DNS to production blocked in this environment). Re-run locally with `npm run dev:next` on port 3000.

## Risks

- Desktop marketing chrome appears from **1024px** instead of 1280px (intended for tablet landscape).
