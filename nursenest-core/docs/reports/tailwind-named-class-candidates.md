# Tailwind Named Class Conversion Candidates
Generated: 2026-05-13

## Overview

Named CSS class conversion reduces HTML verbosity and improves maintainability.
However, it does NOT reduce the compiled CSS bundle when the individual utilities
are also used elsewhere (they remain in the bundle regardless). CSS bundle
reduction requires eliminating **unique** arbitrary values.

The candidates below are ranked by a combined score of:
- Frequency (how many times the pattern appears)
- CSS impact (whether the conversion removes unique arbitrary values)
- Risk (visual, responsive, theme behavior)

---

## Tier 1: High Impact (removes unique arbitrary values from CSS)

### 1. Marketing CTA Primary Button
**Pattern:** `nn-btn-primary inline-flex min-h-[48px] min-w-0 w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 overflow-visible px-7 py-3 text-center text-base font-semibold text-balance break-words transition-[filter] hover:bg-role-cta-hover sm:min-h-[52px] sm:w-auto sm:max-w-[min(100%,min(24rem,calc(100vw-2rem)))] sm:px-10 sm:text-lg`

| Attribute | Value |
|---|---|
| **Files affected** | 78 (marketing routes) |
| **Proposed class** | `.nn-marketing-cta-primary` |
| **Arbitrary values removed** | `transition-[filter]`, `sm:max-w-[min(100%,min(24rem,...))]` |
| **Utility reduction** | ~3–5 unique arbitrary CSS rules |
| **Visual risk** | Low (purely cosmetic, no layout change) |
| **Migration risk** | Low (single constant updated) |
| **Priority** | **HIGH** |

**Implementation:** Update `MARKETING_PRIMARY_CTA_CLASS` in `src/lib/theme/marketing-hero-pattern.ts`.

---

### 2. Marketing CTA Secondary Button
**Pattern:** `nn-btn-secondary inline-flex min-h-[48px] min-w-0 w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 overflow-visible px-5 py-3 text-center text-sm font-semibold text-balance break-words sm:min-h-[52px] sm:w-auto sm:max-w-[min(100%,min(22rem,calc(100vw-2rem)))] sm:px-7 sm:text-base`

| Attribute | Value |
|---|---|
| **Files affected** | 78 (same marketing components) |
| **Proposed class** | `.nn-marketing-cta-secondary` |
| **Arbitrary values removed** | `sm:max-w-[min(100%,min(22rem,...))]` |
| **Priority** | **HIGH** |

---

### 3. color-mix Transparency Pattern (Highest CSS Impact)
**Pattern:** `bg-[color-mix(in_srgb,var(--X)_N%,transparent)]`

| Attribute | Value |
|---|---|
| **CSS rules in bundle** | 746 rules (~100 KB) |
| **Proposed approach** | Migrate to `bg-X/N` (Tailwind opacity modifier) OR define named CSS custom properties |
| **Arbitrary values removed** | Up to 373 unique color-mix expressions |
| **CSS savings estimate** | 80–120 KB |
| **Visual risk** | Medium (srgb vs oklch color space difference for transparency) |
| **Migration risk** | High (requires global find-replace across 400+ source files) |
| **Priority** | **MEDIUM** (needs color-space validation first) |

**Blocker:** Tailwind's `bg-X/N` uses `oklch` color interpolation, while current code
uses `srgb`. For transparency overlays this is usually imperceptible, but requires
visual QA on all themes before mass migration.

---

## Tier 2: Medium Impact (HTML verbosity reduction, minimal CSS savings)

### 4. Admin Table Label
**Pattern:** `text-xs font-medium text-muted-foreground`

| Attribute | Value |
|---|---|
| **Files affected** | ~128 admin files |
| **Proposed class** | `.nn-admin-label` |
| **CSS savings** | ~0 (utilities used elsewhere) |
| **Visual risk** | Very Low |
| **Priority** | **MEDIUM** (DX improvement for admin) |

---

### 5. Muted Body Text
**Pattern:** `text-sm text-muted-foreground`

| Attribute | Value |
|---|---|
| **Files affected** | ~460 across all families |
| **Proposed class** | `.nn-text-muted` |
| **CSS savings** | ~0 (both utilities are extremely common) |
| **Priority** | **LOW** (too broadly shared) |

---

### 6. Flex Row (Centered)
**Pattern:** `flex items-center gap-2`

| Attribute | Value |
|---|---|
| **Files affected** | 309 across all families |
| **Proposed class** | `.nn-flex-row` |
| **CSS savings** | ~0 |
| **Priority** | **LOW** (too common to extract meaningfully) |

---

### 7. Dashboard Stat Tile Wrapper (Learner)
**Pattern:** Based on learner dashboard stats — `flex flex-col gap-1 rounded-xl border bg-card p-4`

| Attribute | Value |
|---|---|
| **Files affected** | ~20 learner dashboard files |
| **Proposed class** | `.nn-stat-tile` in `learner-global.css` |
| **CSS savings** | ~0 (bg-card, rounded-xl, border all used widely) |
| **Priority** | **MEDIUM** (learner isolation benefit) |

---

## Tier 3: Low Impact (arbitrary value consolidation)

### 8. Text size `text-[11px]`
**Pattern:** `text-[11px]` — 223 source uses, 6 CSS rules

| Attribute | Value |
|---|---|
| **Proposed utility** | `@utility text-tiny { font-size: 11px; line-height: 1.45; }` added to globals.css |
| **CSS savings** | Minimal (replaces 1 CSS rule with another named rule) |
| **Priority** | **LOW** (small impact, good DX) |

### 9. Z-index arbitrary values
**Pattern:** `z-[1]`, `z-[2]`, `z-[20]`, etc. — 27 unique CSS rules

| Attribute | Value |
|---|---|
| **Proposed approach** | Consolidate to standard Tailwind z-scale + named custom z-values |
| **Arbitrary values removed** | Up to 27 CSS rules |
| **CSS savings** | ~3–5 KB |
| **Priority** | **LOW** (small impact, higher breakage risk) |

---

## Summary

| Priority | Pattern | CSS Savings | Effort |
|---|---|---|---|
| HIGH | Marketing CTA primary/secondary | 5–10 KB | Low |
| HIGH | color-mix transparency → Tailwind opacity modifiers | 80–120 KB | Very High |
| MEDIUM | Admin table label (`.nn-admin-label`) | ~0 | Low |
| MEDIUM | Dashboard stat tile | ~0 | Low |
| LOW | text-[11px] → `@utility text-tiny` | ~0 | Low |
| LOW | z-index consolidation | 3–5 KB | Medium |
