# Navigation Pill Audit

Generated: 2026-05-31

## Scope

This pass audited navigation surfaces only. Routes, URLs, hierarchy, permissions, entitlements, SEO behavior, analytics events, and mobile menu behavior were preserved.

## Screenshots

Before:

- Desktop homepage: `test-results/navigation-depillification/before/home-desktop.png`
- Mobile homepage: `test-results/navigation-depillification/before/home-mobile.png`

After:

- Desktop homepage: `test-results/navigation-depillification/after/home-desktop.png`
- Laptop homepage: `test-results/navigation-depillification/after/home-laptop.png`
- Tablet homepage: `test-results/navigation-depillification/after/home-tablet.png`
- Mobile homepage: `test-results/navigation-depillification/after/home-mobile.png`
- Mobile menu check: `test-results/navigation-depillification/after/home-mobile-menu.png`
- RN hub desktop: `test-results/navigation-depillification/after/rn-hub-desktop.png`
- RN hub mobile: `test-results/navigation-depillification/after/rn-hub-mobile.png`

## Audit Matrix

| Component | Route / Surface | Previous Presentation | Decision | Result |
| --- | --- | --- | --- | --- |
| `SiteHeader` primary marketing nav | Homepage and marketing chrome | Rounded text links with hover fill | Convert to text link | Text-first links with transparent background and active underline |
| `SiteHeader` tier rail | Homepage and marketing chrome | RN/RPN/NP/New Grad/Allied rendered as pill chips | Convert to tab navigation | Horizontal tab row with semantic underline active state |
| `SiteHeader` pathway links | Homepage and marketing chrome | Pre-Nursing/ECG/HESI/TEAS/CASPER shared pill styling | Convert to tab navigation | Text tabs aligned with tier rail |
| `MarketingSiteSubNav` | Marketing pathway sub-navigation | Rounded pill links | Convert to tabs | Low-weight horizontal tab links with underline active state |
| `LearnerDashboardHubNavIsland` | Learner hub in-page section nav | Card-like jump nav with rounded chip links | Convert to text navigation | Transparent nav with underline hover state |
| `MarketingHeaderUtilityCluster` | Country, language, theme controls | Segmented/pill utility selectors | Keep | Allowed as functional selectors; not primary navigation |
| Header CTA | Sign Up / Start Free | Rounded CTA button | Keep with reduced pill effect | Primary conversion action remains prominent with rounded-xl, not full pill |
| Account avatar and learner pathway badge | Authenticated header | Badge/avatar shape | Keep | Identity/status elements, not navigation collections |
| Hero/trust labels | Marketing content | Pill badges | Keep out of scope | Decorative/content labels are not navigation |
| Practice/CAT session chrome | Focused study sessions | Rounded controls | Keep | Session controls are not global navigation and must preserve focused-study behavior |

## Files Updated

- `src/components/layout/site-header.tsx`
- `src/components/layout/marketing-site-sub-nav.tsx`
- `src/app/styles/marketing/marketing-global.css`
- `src/app/styles/marketing/header-nav.css`
- `src/app/styles/marketing/theme-overrides.css`
- `src/app/styles/marketing/blossom-multicolor.css`
- `src/app/styles/learner/learner-global.css`
- `src/app/globals.css`

## Verification

- Header remains three-zone on desktop: logo, centered navigation, right-aligned actions.
- Desktop header height remains inside the target range.
- Mobile header still uses hamburger behavior with visible logo and primary CTA.
- Country and language controls remain functional segmented selectors.
- Active state uses a single underline treatment, not filled pills.
- No route, permission, entitlement, SEO, or analytics code was changed.

## Outstanding

- Broader non-navigation chips remain across lessons, question runners, badges, filters, and study controls. They were intentionally retained because this pass is navigation-only.
