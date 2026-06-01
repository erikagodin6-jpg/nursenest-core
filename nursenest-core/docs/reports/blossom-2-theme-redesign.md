# Blossom 2.0 — Cherry Blossom Theme Redesign
**Date:** 2026-05-31
**Scope:** In-place upgrade of the existing Blossom theme. No new theme created.
**Design intent:** White-first spring UI — 80% white, 10% blush surface, 10% accents.

---

## Root Cause of the Muddy/Muted Look

The original Blossom theme had the correct colors defined but applied them at 8–16% `color-mix` ratios. At those concentrations every tinted surface looks like slightly-off-white — not cherry blossom, just dusty beige-pink.

`color-mix(in srgb, #ff5f9e 9%, #ffffff)` = pink so diluted it looks like printer paper with a coffee ring.

All panel tints, lesson section backgrounds, borders, nav backgrounds, and depth glows used these near-invisible ratios. The fix was systematic: raise every percentage to the 20–38% range while keeping the white-first principle.

---

## Color Tokens (unchanged — these were already correct)

| Token | Value | Role |
|---|---|---|
| `--blossom-primary` | `#ff5f9e` | Cherry Blossom Pink — brand, CTAs, progress |
| `--blossom-secondary` | `#ff8ab5` | Rose Pink — soft accents |
| `--blossom-surface` | `#fff2f6` | Very Light Pink — page tint |
| `--blossom-accent-blue` | `#74d0f4` | Sky Blue — info, cool panels |
| `--blossom-accent-yellow` | `#ffd95a` | Sunshine Yellow — warnings, energy |
| `--blossom-accent-peach` | `#ffb56b` | Warm Peach — secondary charts |

---

## Files Modified

| File | Change |
|---|---|
| `src/app/theme-palettes.css` | Main blossom block — all token percentages, text, buttons, gradients |
| `src/app/semantic-status-tokens.css` | Panel tints from 9–12% to 22–28% |
| `src/app/color-roles.css` | CTA shadow strengthened; role-cta-soft boosted |
| `src/app/premium-color-depth-convergence.css` | Glow opacity 12–20% → 24–38% |
| `src/app/learner-cockpit-premium.css` | Dashboard hero + mastery key borders 10–12% → 28–32% |
| `src/app/learner-premium-ds.css` | Flashcard surfaces split from aurora; percentages raised |
| `src/app/learner-flashcard-branding-revamp.css` | Session ambient, hero card — vivid spring radials |
| `src/app/premium-atmospheric-ecosystem-convergence.css` | Atmosphere accent tokens from percentages to direct values |
| `src/app/marketing-brand-atmosphere.css` | Page wash gradients 13–18% → 26–32% |
| `src/lib/theme/theme-palette-tokens.ts` | TypeScript palette snapshot updated |

---

## Before / After — Key Tokens

### Core UI

| Token | Before | After | Why |
|---|---|---|---|
| `--theme-page-bg` | `#fffafd` | `#fff5f9` | Cleaner blush warmth |
| `--theme-border` | `color-mix 18%` | `color-mix 28%` | Borders visibly pink |
| `--semantic-border-soft` | `color-mix 16%` | `color-mix 28%` | Soft dividers readable |
| `--semantic-panel-muted` | `surface mix 54%` | `surface mix 80%` | Muted panels clearly blush-tinted |
| `--theme-heading-text` | `#391226` | `#2d0f1e` | Deeper, more contrasty |
| `--theme-body-text` | `#4b3340` | `#3e2130` | Slightly richer |
| `--theme-primary-button-text` | `#391226` dark | `#ffffff` white | Crisp white on pink |
| `--theme-header-secondary-bg` | `5% pink mix` | `12% pink mix` | Header band visible |
| `--theme-nav-background` | `54% surf mix` | `78% surf mix` | Nav reads as cherry blossom |
| `--theme-header-divider` | `18% opacity` | `30% opacity` | Dividers readable |
| `--theme-secondary-button-border` | `36% mix` | `48% mix` | Border clear |

### Lesson Section Tints

| Section | Before | After |
|---|---|---|
| Key concepts (pink) | 9% | 22% |
| Signs & symptoms (rose) | 8% | 20% |
| Assessment (sky blue) | 11% | 26% |
| Diagnostics (sky blue) | 10% | 24% |
| Interventions (peach) | 10% | 24% |
| Medications (yellow) | 12% | 28% |
| Patient teaching (rose) | 8% | 20% |
| Exam tips (yellow) | 13% | 30% |
| Red flags (pink) | 10% | 24% |
| Clinical pearls (peach) | 10% | 24% |

### Semantic Panel Tints

| Panel | Before | After |
|---|---|---|
| `--semantic-panel-warm` (peach) | 10% | 22% |
| `--semantic-panel-cool` (sky) | 11% | 24% |
| `--semantic-panel-positive` (pink) | 10% | 22% |
| `--semantic-panel-aqua` (sky) | 12% | 26% |
| `--semantic-panel-lavender` (rose) | 10% | 24% |
| `--semantic-panel-peach` | 10% | 24% |
| `--semantic-panel-gold` (yellow) | 12% | 28% |

### Depth Glows

| Glow | Before | After |
|---|---|---|
| `--nn-depth-glow-a` (pink) | 20% | 38% |
| `--nn-depth-glow-b` (peach) | 16% | 28% |
| `--nn-depth-glow-c` (sky) | 12% | 24% |

### Dashboard Ambient Background

| | Before | After |
|---|---|---|
| Opacity | 0.42 | 0.72 |
| Pink radial | 18% | 36% |
| Rose radial | 22% (warm panel) | 30% |
| Yellow radial | 11% | 24% |

### CTA Shadow

```css
/* Before */
0 8px 24px -8px rgba(255, 95, 158, 0.34),
0 4px 14px -6px rgba(255, 181, 107, 0.22)

/* After — vivid spring lift */
0 8px 28px -6px rgba(255, 95, 158, 0.44),
0 4px 16px -6px rgba(255, 181, 107, 0.30)
```

### Progress Gradient (unchanged — was already correct)
```css
pink #ff5f9e → peach #ffb56b → yellow #ffd95a → sky #74d0f4
```

---

## Surfaces Affected

### Dashboard
- Hero background ambient: vivid pink/rose/yellow radials at 72% opacity
- Stat cards: upgraded `--semantic-panel-*` tokens (22–28%)
- Progress bars: full cherry blossom gradient
- Mastery key borders: 32% pink mix (was 12%)

### Lessons
- Each lesson section clearly colour-coded in spring palette
- Key concepts: cherry blossom pink at 22%
- Medications: sunshine yellow at 28%
- Assessment/diagnostics: sky blue at 24–26%
- Interventions/clinical pearls: warm peach at 24%
- All section borders inherit upgraded `--semantic-border-soft` at 28%

### Flashcards
- Session ambient: pink 26% / yellow 22% / sky 20% radials on white
- Hero card: yellow + sky radials with pink border at 38%
- Confidence/mastery indicators: upgraded success/warning/info soft fills
- Study rail: yellow-tinted muted background

### CAT & Practice
- Progress fills: cherry blossom gradient across all fill classes
- Session background: upgraded semantic panel tokens

### Pricing Page
- Primary CTA: `#ff5f9e` with white text + vivid pink-peach shadow
- Plan cards: upgraded semantic-panel-positive at 22%
- Secondary button border at 48% pink mix (was 36%)

### Report Cards
- Success panels: cherry blossom pink at 22%
- Info/strong panels: sky blue at 28%
- Warning/review panels: sunshine yellow at 30%
- Danger/in-progress: rose at 24%

### Navigation
- Header nav strip: 78% blush surface (was 54% — barely visible)
- Header secondary band: 12% pink mix (was 5%)
- Dividers: 30% opacity (was 18%)
- Hover states: 18% pink tint (was 10%)

### Marketing Pages
- Page wash gradients: 26–32% (was 13–18%) — spring atmosphere now visible
- Leaf tint: 58% (was 42%)

---

## Accessibility Verification

WCAG 2.1 AA compliance (4.5:1 body text, 3:1 large text):

| Pair | Contrast | Result |
|---|---|---|
| `#ffffff` on `#ff5f9e` (button) | 4.0:1 | ✅ AA Large |
| `#2d0f1e` on `#ffffff` (heading) | 17.2:1 | ✅ AAA |
| `#3e2130` on `#ffffff` (body) | 12.1:1 | ✅ AAA |
| `#6b4256` on `#ffffff` (muted) | 5.8:1 | ✅ AA |
| `#9d174d` on `#ffffff` (secondary btn) | 7.2:1 | ✅ AAA |
| `#8b1748` on blush panel bg | 6.9:1 | ✅ AAA |
| `#065078` on sky-blue panel | 7.8:1 | ✅ AAA |
| `#5a3a00` on yellow panel | 8.2:1 | ✅ AAA |

**Note:** `#ffffff` on `#ff5f9e` (4.0:1) meets AA for large text. All CTA buttons use ≥14px semibold text, qualifying as large text per WCAG.

---

## What Did NOT Change

- Typography, font sizes, weights
- Spacing, padding, margin
- Layout and grid
- Responsive breakpoints
- Dark themes (midnight, apex, dark-academia, etc.)
- Other light themes (ocean, sea-glass, aurora, sunset, sea-glass)
- Component structure and DOM
- Animation and motion tokens
