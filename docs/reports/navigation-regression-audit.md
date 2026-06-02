# Navigation Regression Audit

**Date:** 2026-06-01  
**Status:** Regressions identified and remediated  
**Files modified:** `site-header-server.tsx`, `site-header.tsx`

---

## Original Intended Three-Tier Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  Row 0 — Utility Bar (desktop, thin)                                │
│  Country ▼  Language ▼  Theme ▼  [Currency if enabled]              │
├─────────────────────────────────────────────────────────────────────┤
│  Row 1 — Main Navigation                                            │
│  [Logo]   About   Tools   FAQ   Pricing   [Log In]  [Start Free]   │
├─────────────────────────────────────────────────────────────────────┤
│  Row 2 — Exam Navigation Bar                                        │
│  RN   RPN   NP   Allied Health   New Grad │ ECG  HESI  TEAS  CASPer│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Before (Regressed State)

```
Row 0 Utility:  Country  Language  Theme
Row 1 Main:     [Logo]  Tools  Pricing  About  Blog  FAQ  [Login] [Start Free]
Row 2 Exam:     RN  RPN  NP  New Grad  Allied | Pre-Nursing  ECG  HESI  ATI TEAS  CASPER
```

---

## After (Restored State)

```
Row 0 Utility:  Country  Language  Theme
Row 1 Main:     [Logo]  About  Tools  FAQ  Pricing  [Login] [Start Free]
Row 2 Exam:     RN  RPN  NP  Allied Health  New Grad | ECG  HESI A2  ATI TEAS  CASPER
```

---

## Regressions Found

### Regression 1 — Blog placed in Main Navigation (Row 1)

| | Detail |
|---|---|
| **Tier** | Row 1 — Main Navigation |
| **Item** | Blog |
| **Current position** | `brandNavLinks` array in Row 1 center nav |
| **Correct position** | Footer only / mobile drawer (not main nav) |
| **Cause** | `blog` entry added to `brandNavLinks` in `SiteHeaderServer.buildPrecomputedNavData()` and in the `site-header.tsx` client-side fallback array |
| **Impact** | Row 1 renders 5 links (Tools, Pricing, About, Blog, FAQ) instead of 4 (About, Tools, FAQ, Pricing). Blog is content discovery, not platform information — it crowds the informational nav and breaks the intended separation of concerns |
| **Tier violation** | Blog is not a "platform information" item. Main nav contains only: About, Tools/Features, FAQ, Pricing |

### Regression 2 — "Pre-Nursing" parent category link in Exam Nav (Row 2)

| | Detail |
|---|---|
| **Tier** | Row 2 — Exam Navigation |
| **Item** | Pre-Nursing |
| **Current position** | `pathwayNavLinks` array in Row 2 tier rail, appearing BEFORE its own children (HESI, TEAS, CASPer) |
| **Correct position** | Not present as a standalone nav item; HESI A2 / ATI TEAS / CASPer are the correct individual items |
| **Cause** | `pre-nursing` added as first entry in `pathwayNavLinks` in `SiteHeaderServer.buildPrecomputedNavData()` and in the `site-header.tsx` fallback |
| **Impact** | Row 2 renders 9 items instead of 8. "Pre-Nursing" is a parent category that encompasses HESI, TEAS, and CASPer — displaying it alongside its children creates redundancy and clutters the exam navigation |
| **Tier violation** | Exam nav contains only individual exam/pathway items. Parent category pages are not nav items |

### Regression 3 — Link ordering in Main Navigation (Row 1)

| | Detail |
|---|---|
| **Tier** | Row 1 — Main Navigation |
| **Current order** | Tools → Pricing → About → Blog → FAQ |
| **Correct order** | About → Tools → FAQ → Pricing |
| **Cause** | `brandNavLinks` array built with wrong key order (Tools first, Pricing second, About third) |
| **Impact** | "About" is the primary discovery link for new visitors and should lead the nav. Pricing is a conversion destination and belongs at the end. The current order front-loads the commercial item (Pricing) before the informational items |

---

## Items in Wrong Tier — Summary

| Item | Current Tier | Correct Tier | Action |
|---|---|---|---|
| Blog | Row 1 Main Nav | Footer / Mobile only | Remove from `brandNavLinks` |
| Pre-Nursing | Row 2 Exam Nav | None (children already present) | Remove from `pathwayNavLinks` |
| Tools/Pricing/About/FAQ | Row 1 Main Nav | Row 1 Main Nav | ✓ Correct tier, fix order |
| RN/RPN/NP/Allied/New Grad | Row 2 Exam Nav | Row 2 Exam Nav | ✓ No change needed |
| ECG/HESI/TEAS/CASPer | Row 2 Exam Nav | Row 2 Exam Nav | ✓ No change needed |
| Country/Language/Theme | Row 0 Utility | Row 0 Utility | ✓ No change needed |

---

## Duplicate Items

| Item | Appears in | Problem |
|---|---|---|
| Pre-Nursing + HESI + TEAS + CASPer | Row 2 | Pre-Nursing is parent of HESI/TEAS/CASPer; parent should not appear with children |

---

## Missing Items

No items from the intended structure are missing. The exam hub chips (RN, RPN, NP, Allied Health, New Grad) are correctly computed by `buildMarketingTierHubStrip()` and render correctly in Row 2.

---

## Spacing & Alignment Audit

| Element | Current | Expected | Status |
|---|---|---|---|
| Header Row 1 min-height | `4.75rem` (76px) | 76px | ✅ Correct |
| Logo far left | `grid-template-columns: auto minmax(0, 1fr) auto` | Logo left, nav center, auth right | ✅ Correct |
| Nav centered | `justify-center` in nav container | Centered | ✅ Correct |
| Auth cluster far right | `justify-self: end` | Right-aligned | ✅ Correct |
| Nav link gap | `gap-2 sm:gap-3 xl:gap-4` (8px → 12px → 16px) | Comfortable spacing | ✅ Correct |
| Header column gap | `clamp(1rem, 2vw, 2.5rem)` | Responsive breathing room | ✅ Correct |
| Row 2 tier inner min-height | `36px` / `md:40px` | Compact exam row | ✅ Correct |
| Utility row min-height | `30px` | Thin utility band | ✅ Correct |

No spacing or alignment regressions found. All layout metrics match the intended three-tier design.

---

## Mobile Drawer — Audit

| Section | Current | Correct | Status |
|---|---|---|---|
| Section 1: Auth | Login / Sign Up or user card | ✅ Unchanged | ✓ |
| Section 2: NurseNest brand | Tools, Pricing, About, **Blog**, FAQ | Tools, Pricing, About, FAQ (Blog kept in mobile for discoverability) | Blog is retained in mobile drawer intentionally — mobile requires broader navigation coverage than the slim desktop bar |
| Section 3: Classes & Pathways | **Pre-Nursing**, ECG, HESI, TEAS, CASPER + tier chips | ECG, HESI, TEAS, CASPER + tier chips (Pre-Nursing removed) | Pre-Nursing removed to match Row 2 |

---

## Files Changed

| File | Change |
|---|---|
| `src/components/layout/site-header-server.tsx` | Removed `blog` from `brandNavLinks`; removed `pre-nursing` from `pathwayNavLinks`; reordered `brandNavLinks` to About → Tools → FAQ → Pricing |
| `src/features/layout/site-header.tsx` | Removed `blog` from client-side `brandNavLinks` fallback; removed `pre-nursing` from `pathwayMoreLinks` fallback; reordered fallback to match |
