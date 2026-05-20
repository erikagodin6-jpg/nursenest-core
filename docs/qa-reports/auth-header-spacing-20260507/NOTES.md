# Auth / marketing header spacing — QA notes (2026-05-07)

## Summary

Tightened horizontal spacing so the **logo**, **Log in**, **Start Free** (guest), and **trailing controls** read as a more intentional group on marketing surfaces (`SiteHeader`), without changing URLs, i18n, or mobile hamburger/settings behavior.

## Files changed

| File | Change |
|------|--------|
| `nursenest-core/src/app/globals.css` | Desktop (`xl+`): `.nn-header-desktop-grid` uses `minmax(0,1fr) auto minmax(0,1fr)` so logo and auth sit on the **inner** edges of the side tracks toward the centered nav; slightly smaller `column-gap`; `justify-self` on brand, `.nav`, and `.nn-header-desktop-auth-cluster`. |
| `nursenest-core/src/components/layout/site-header.tsx` | **Mobile/tablet (`<xl`)**: guest row uses `justify-between` with a **`nn-header-mobile-brand-auth-cluster`** wrapping logo + CTAs (no `flex-1` + `justify-end` desert between logo and buttons). Desktop auth wrapper gets **`nn-header-desktop-auth-cluster`**. Nav drops redundant `flex-1` in grid context. Logo link: `focus-visible:outline-offset-2` to reduce clipping risk. |

## Viewports exercised (Playwright `screenshot`)

| Size | Route | Screenshot |
|------|-------|------------|
| 1280×800 | `/us/new-grad` | `viewport-1280-us-new-grad.png` |
| 768×900 | `/us/new-grad` | `viewport-768-us-new-grad.png` |
| 390×844 | `/us/new-grad` | `viewport-390-us-new-grad.png` |
| 1280×800 | `/en/login` | `viewport-1280-en-login.png` |
| 1280×800 | `/en/signup` | `viewport-1280-en-signup.png` |

All PNGs live in **this folder** (`docs/qa-reports/auth-header-spacing-20260507/`).

**Routing note:** In this app, `[locale]/new-grad` redirects to **`/us/new-grad`** (canonical US New Grad marketing landing). Screenshots use `/us/new-grad` for the hub; login/signup use `/en/...` as requested.

## Cursor browser MCP

Navigation to `http://localhost:3001` / `http://165.245.235.115:3001` from the IDE browser MCP returned `chrome-error://chromewebdata/` (no route to the dev machine). Verification was done with **local Playwright CLI** against `http://127.0.0.1:3000` instead.

## Remaining risks

1. **Very long localized nav labels** at `xl+`: equal `1fr` side tracks can shrink; nav is `max-width: min(100%, 52rem)` — if translations widen links, watch for overlap with logo/auth (unlikely at 1280px).
2. **Guest mobile narrow widths**: logo + two CTAs + two icon buttons still compete for width; `max-w-[38%]` / `[52%]` on buttons remain as a safety valve.
3. **Theme / region strip** (`MarketingHeaderUtilityStrip`) is unchanged; only the primary brand row and desktop grid were adjusted.

## Semantic color guardrails

No new hardcoded product hex; spacing/layout only. Existing `color-mix` / CSS variables in the header were left as-is.
