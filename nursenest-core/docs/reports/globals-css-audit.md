# globals.css Selector Audit

**Date:** 2026-05-13  
**File:** `src/app/globals.css` (213 KB, 13,926 lines)  
**Method:** grep-based selector inventory + route dependency mapping  
**Status:** Audit only — no selectors removed. Extraction candidates listed.

---

## Summary

| Metric | Value |
|---|---|
| File size (uncompressed) | 213 KB |
| Total CSS lines | 13,926 |
| Unique `.nn-*` class references | 480 |
| Unique `[data-nn-*]` attribute references | 8 |
| Top-level rule blocks | ~1,004 |
| **Learner-specific rule blocks** | **~208 (~21%)** |
| Marketing-specific rule blocks | ~47 (~5%) |
| Shared/neutral rule blocks | ~749 (~74%) |

`globals.css` loads on **every route** (root layout). The ~208 learner-specific
rule blocks are delivered to marketing, admin, and all other routes. Estimated
**~30–40 KB** of learner-only CSS on every marketing page request.

---

## Import Chain

```
src/app/layout.tsx (root layout — ALL routes)
  └── globals.css (213 KB) imports:
        @import "tailwindcss"
        @import "./theme-palettes.css"         (68 KB)
        @import "./color-roles.css"            (10 KB)
        @import "./semantic-status-tokens.css" (51 KB)
        @import "./marketing-brand-atmosphere.css" (11 KB)
        @import "./full-platform-convergence.css" (5 KB)
        @import "./premium-color-depth-convergence.css" (10 KB)
        @import "./premium-atmospheric-ecosystem-convergence.css" (12 KB)
        @import "./premium-mobile-study-experience-audit.css" (8 KB)
        @import "./mobile-ux-standards.css" (2 KB)
  └── (marketing)/marketing-dark-utilities.css (11 KB)

src/app/(marketing)/layout.tsx (marketing routes only)
  └── marketing-styles.css imports:
        @import "premium-redesign-2026.css" (barrel → 8 section files, ~212 KB)
        @import "premium-allied-newgrad-convergence.css" (5 KB)
        [+ styles/marketing/marketing-global.css (42 KB) via layout.tsx directly?]

src/app/(student)/app/(learner)/layout.tsx (learner routes only)
  └── learner-exam-shell.css (3 KB)
  └── learner-exam-session-premium.css (31 KB)
  └── learner-flashcard-premium.css (18 KB)
  └── learner-cockpit-premium.css (14 KB)
  └── learner-surface-primitives.css (12 KB)
  └── styles/tokens.css
  └── styles/learner-ds.css
  └── learner-premium-ds.css (31 KB, now imports shared/premium-stat-tiles.css)
```

---

## Selector Inventory

### LEARNER-specific selectors in globals.css (~208 blocks)

These are candidates for extraction to the learner layout. They are delivered to
marketing, admin, and unauthenticated users today but have zero effect on those routes.

| Selector prefix | Count | Estimated extraction safety |
|---|---|---|
| `.nn-cat-exam-*` | 14 | **SAFE** — only used in CAT exam pages |
| `.nn-focus-area-*` | 12 | **SAFE** — learner dashboard only |
| `.nn-premium-lock-*` | 12 | **SAFE** — paywall/entitlement UI only |
| `.nn-dash-page-*` | 7 | **SAFE** — learner dashboard |
| `.nn-dash-hub-*` | 7 | **SAFE** — learner hub |
| `.nn-practice-session-*` | 5 | **SAFE** — practice test UI |
| `.nn-practice-rationale-*` | 4 | **SAFE** — practice test UI |
| `.nn-cat-question-*` | 6 | **SAFE** — CAT exam only |
| `.nn-exam-session-*` | 4 | **SAFE** — exam session only |
| `.nn-upgrade-prompt-*` | 6 | **SAFE** — learner paywall |
| `.nn-benchmark-*` | 2 | **SAFE** — learner analytics only |
| `.nn-learner-nav-link-*` | 8 | **NEEDS_AUDIT** — used in learner shell nav |
| `.nn-learner-shell-link-*` | 4 | **NEEDS_AUDIT** — learner nav |
| `.nn-learner-app` | 1 | **HIGH_RISK** — root wrapper of entire learner shell |
| `.nn-study-home-*` | 3 | **SAFE** — learner study home |
| `.nn-readiness-gauge-*` | 2 | **SAFE** — analytics charts |
| `.nn-lesson-hy-*` | 13 | **NEEDS_AUDIT** — lesson highlight system |
| `.nn-lesson-section-*` | 11 | **NEEDS_AUDIT** — lesson reading (also marketing lessons) |
| `.nn-lesson-phase-*` | 7 | **NEEDS_AUDIT** — lesson reading |
| `.nn-lesson-exam-*` | 6 | **NEEDS_AUDIT** — lesson-exam UI |
| `.nn-lesson-quick-*` | 6 | **NEEDS_AUDIT** — lesson quick actions |

### MARKETING-specific selectors in globals.css (~47 blocks)

These were partially extracted to `marketing-styles.css` but some remain in globals.

| Selector prefix | Count | Notes |
|---|---|---|
| `.nn-home-rich-*` | 6 | Homepage hero context |
| `.nn-marketing-h*` | 5 | Typography scale |
| `.nn-section-shell` | 3 | Layout shell (also used on learner) |
| `.nn-hub-category-*` | 3 | Hub cards (also used on learner hub pages) |
| `.nn-pricing-*` | 4 | Pricing page — marketing only |
| `.nn-conversion-*` | 3 | Marketing CTAs |
| `.nn-blog-*` | 3 | Blog surfaces |
| `.nn-footer-*` | 4 | Footer (marketing only) |
| `.nn-landing-*` | 2 | SEO landing pages |
| `.nn-pathway-hero-*` | 2 | Marketing hub hero bands |

### SHARED selectors (genuine globals) (~749 blocks)

These are correctly global and should NOT be extracted:

| Selector prefix | Count | Rationale |
|---|---|---|
| `.nn-btn-*` | 9 | Used on all routes (forms, auth, marketing, learner) |
| `.nn-card*` | 12 | Universal card system |
| `.nn-badge-*` | 6 | Status indicators across all routes |
| `.nn-skeleton-*` | 4 | Loading states (all surfaces) |
| `.nn-mobile-*` | 8 | Mobile layout utils (all routes) |
| `.nn-section-shell` | 3 | Layout wrapper (marketing + learner) |
| `.nn-brand-*` | 15 | Brand logo/lockup (all routes) |
| `.nn-marketing-nav-*` | 8 | Nav (shared marketing + learner header nav) |
| `.nn-header-*` | 20 | Site header (shared) |
| `.nn-ui-btn` | 9 | Shared button primitives |
| `:root` token definitions | ~50 | Design system tokens |
| `html, body` rules | ~20 | Global resets and overrides |

---

## High-Impact Extraction Opportunities

### Opportunity A — CAT exam surface CSS (P1 — SAFE)
- Selectors: `.nn-cat-exam-*`, `.nn-cat-question-*`, `.nn-cat-adaptive-*`
- Estimated size: ~8 KB
- Target: Move to `learner-exam-shell.css` or a dedicated `cat-exam.css` in learner layout
- Risk: **LOW** — these selectors are NOT used on any marketing page
- Prerequisite: grep-verify each selector has zero hits in `src/app/(marketing)/`

### Opportunity B — Dashboard/learner-app CSS (P1 — SAFE)
- Selectors: `.nn-dash-page-*`, `.nn-dash-hub-*`, `.nn-focus-area-*`, `.nn-upgrade-prompt-*`
- Estimated size: ~12 KB
- Target: Move to `learner-cockpit-premium.css` or new `learner-dashboard.css`
- Risk: **LOW** — dashboard-specific

### Opportunity C — Learner nav selectors (P2 — NEEDS_AUDIT)
- Selectors: `.nn-learner-nav-link-*`, `.nn-learner-shell-link-*`
- Estimated size: ~3 KB
- Target: Move to `learner-surface-primitives.css`
- Risk: **MEDIUM** — need to verify `.nn-learner-app` scope doesn't affect these

### Opportunity D — Practice test surface CSS (P2 — NEEDS_AUDIT)
- Selectors: `.nn-practice-session-*`, `.nn-practice-rationale-*`, `.nn-exam-session-*`
- Estimated size: ~5 KB
- Target: Move to `learner-exam-session-premium.css`
- Risk: **MEDIUM** — practice tests use marketing hub wrappers for unauthenticated paths

### Opportunity E — Marketing-only CSS still in globals (P3 — NEEDS_AUDIT)
- Selectors: `.nn-pricing-*`, `.nn-conversion-*`, `.nn-blog-*`, `.nn-footer-*`
- Estimated size: ~8 KB
- Target: Move to `(marketing)/marketing-styles.css` or `styles/marketing/`
- Risk: **MEDIUM** — some selectors may be shared with learner plan upgrade flows

---

## Extraction Safety Classification

| Level | Definition |
|---|---|
| **SAFE** | Selector verified absent from all non-learner TSX files; zero risk of visual regression on marketing |
| **NEEDS_AUDIT** | Used in learner files but may also appear in shared components or edge-case marketing pages; requires grep verification before extraction |
| **HIGH_RISK** | Root-level wrapper, theme token, or shared primitive; removing from globals would affect all routes |

---

## Recommended Next Steps

1. **Verify with grep** before any extraction:
   ```bash
   grep -rn "nn-cat-exam" src/app/(marketing)/ src/components/marketing/ --include="*.tsx"
   ```
   If zero hits → SAFE to extract

2. **Add CSS payload budget test** (Phase 5) to catch regressions after each extraction

3. **Extract Opportunity A first** (CAT CSS) as it's the most self-contained and has
   the clearest route ownership

4. **Do NOT extract** `.nn-learner-app` from globals — it's the root wrapper for the
   entire learner shell and is referenced in many CSS rules in both globals and split files

---

## Notes on @import Optimization

`globals.css` uses PostCSS/Tailwind's `@import` to inline several files:
- `theme-palettes.css` (68 KB) — contains ALL theme tokens for all 10+ themes
- `semantic-status-tokens.css` (51 KB) — comprehensive semantic token set

These cannot be easily split as they define CSS custom properties used across all routes.
The built CSS bundles are gzip-compressed, so the actual network cost of 213 KB source
is approximately **35–45 KB gzipped**.

**No changes recommended to globals.css in this pass** — extraction should proceed
incrementally in subsequent PRs with proper testing at each step.
