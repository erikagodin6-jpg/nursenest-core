# Blossom Theme Brand Wordmark Fix — 2026-05-11

## Root Cause

The `html[data-theme="blossom"] .nn-header-brand-lockup` CSS rule in `premium-redesign-2026.css` was using `var(--logo-text)` to color the NurseNest wordmark and leaf logo. This is the wrong token for brand coloring.

**Token resolution chain for `--logo-text` on Blossom:**

`ThemeStateHydration` computes `--logo-text` using `pickReadableText`:
```typescript
const logoText = pickReadableText(
  semantic.navBackground,  // → #ffffff (Blossom white nav)
  semantic.logoOnLight,    // → #1f2937 (near-black)
  semantic.logoOnDark,     // → #ffffff (white)
);
// pickReadableText picks whichever has better contrast against #ffffff
// #1f2937 wins → --logo-text = #1f2937 ← near-black
```

This is correct for accessibility (ensuring nav text is readable), but wrong for brand coloring. The wordmark should use the brand identity color.

**Correct token:**

`--logo-primary` is set from `palette.logoPrimary = "#c97a91"` (Blossom pink/mauve). This is the intentional brand color for the Blossom theme's wordmark and logo.

---

## Files Changed

| File | Change |
|---|---|
| `src/app/premium-redesign-2026.css` | Changed `var(--logo-text)` → `var(--logo-primary)` in Blossom brand lockup rule |
| `src/lib/theme/site-header-marketing-chrome.contract.test.ts` | Added 2 contract tests locking in correct token usage |

---

## Token / Theme Changes

### Before
```css
html[data-theme="blossom"] .nn-header-brand-lockup {
  color: var(--logo-text);  /* resolves to #1f2937 — near-black */
}
```

### After
```css
html[data-theme="blossom"] .nn-header-brand-lockup {
  /* --logo-primary = #c97a91 (Blossom pink) from ThemeStateHydration palette.logoPrimary.
     --logo-text was incorrectly used here: it resolves to #1f2937 (near-black) on the white
     Blossom nav background because it is readability-optimised, not brand-colour-optimised.
     The leaf mask and wordmark both read currentColor, so this fix applies to both. */
  color: var(--logo-primary);
}
```

### Token resolution
| Token | Blossom value | Source |
|---|---|---|
| `--logo-primary` | `#c97a91` (Blossom pink) | `palette.logoPrimary` in `theme-palette-tokens.ts` |
| `--logo-text` | `#1f2937` (near-black) | `pickReadableText(#ffffff, #1f2937, #ffffff)` in `ThemeStateHydration` |

---

## Logo / Wordmark Fixes

### What changed visually

**Before:**
- NurseNest wordmark: `#1f2937` (near-black) on the Blossom cream/pink header background
- Leaf logo (when monochrome mask path): same `#1f2937` (black leaf)
- Leaf logo (when img path): unaffected (raster image)
- Leaf icon fallback (Lucide): `text-current` = `#1f2937` (black)

**After:**
- NurseNest wordmark: `#c97a91` (Blossom pink) — matches Blossom brand identity
- Leaf logo (monochrome mask): `bg-current` = `#c97a91` (pink leaf)
- Leaf icon fallback: `text-current` = `#c97a91` (pink)

### Why `bg-current` and `text-current` are both fixed

The `HeaderBrandLockup` component uses a mask-based monochrome leaf when Blossom is active:
```tsx
const useMonochromeLeaf = registeredThemeId === "blossom" && showLeafRaster;
// ...
<span className="block h-full w-full bg-current" style={{ maskImage: `url(${leafUrl})` }} />
```

`bg-current` inherits the `color` property of the element, which is set by the CSS rule on `.nn-header-brand-lockup`. Changing to `--logo-primary` fixes both the leaf and the wordmark in one rule.

The wordmark text uses `text-current` (Tailwind class that maps to `color: currentColor`), so it also inherits from the parent `.nn-header-brand-lockup` color.

---

## Accessibility / Contrast Notes

`#c97a91` on the Blossom nav background (approximately `#fff6fb`, a very light pink-cream):

- Estimated contrast ratio: ~3.0:1
- WCAG 2.1 SC 1.4.3 large text threshold: 3:1
- The NurseNest wordmark is rendered at `1.12rem–1.28rem` (18–20px) semi-bold, which qualifies as large text under WCAG
- WCAG explicitly exempts logotypes from contrast requirements (SC 1.4.3 note: "Text or images of text that are part of a logo or brand name have no contrast requirement")

The pink `#c97a91` reads clearly as a brand identifier against the light Blossom background and maintains the premium visual identity.

---

## Regression Checks Performed

| Theme | Wordmark source | Status |
|---|---|---|
| Ocean (default) | `color-mix(in srgb, var(--semantic-brand) 84%, var(--nn-header-primary-fg))` from generic `marketing-row4` rule | ✓ Unchanged — no Blossom-specific override for Ocean |
| Midnight | `color-mix(in srgb, var(--semantic-brand) 24%, var(--nn-nav-fg, #f8fafc))` from `marketing-unified-dark` rule | ✓ Unchanged — uses different layout type |
| Dark themes (dark-clinical, storm-slate, etc.) | `marketing-unified-dark` rule | ✓ Unchanged — different layout type |
| Aurora | No specific brand lockup override | ✓ Falls through to generic `marketing-row4` rule |
| Blossom | **Fixed**: `var(--logo-primary)` = `#c97a91` | ✓ Now renders Blossom pink |

Contract tests confirm:
- `theme-marketing-row4-contract.test.ts` — 5/5 pass (no forbidden structural properties in Blossom/Midnight rules)
- `site-header-marketing-chrome.contract.test.ts` — 6/6 pass (new Blossom wordmark token test passes)
- `test:homepage` — 142/142 pass

---

## Tests Added / Updated

**New tests in `site-header-marketing-chrome.contract.test.ts`:**

1. **`Blossom brand lockup uses --logo-primary (brand pink), not --logo-text (near-black)`**
   — Asserts the Blossom rule uses `var(--logo-primary)` and rejects `var(--logo-text)`. Prevents future regression to the black wordmark.

2. **`generic marketing-row4 brand lockup rule still uses semantic-brand mix (Ocean/other themes unaffected)`**
   — Asserts Ocean's brand lockup formula is unchanged. Guards against accidentally removing the generic rule.

---

## Remaining Theme Consistency Opportunities

1. **Aurora theme** — Aurora does not have a specific brand lockup override. It falls through to the generic `marketing-row4` formula (`color-mix(in srgb, var(--semantic-brand) 84%, var(--nn-header-primary-fg))`). This may or may not be intentional — could benefit from an explicit override matching its brand palette if the `semantic-brand` value is not a strong enough brand color on Aurora's light background.

2. **Nav chrome foreground color for Blossom** — The nav chrome for Blossom uses `foreground: "#10182f"` (very dark). The sticky header inherits this for all non-lockup elements. The lockup is now corrected, but other nav elements (tier chips, nav links) use Blossom-specific overrides. These appear to be functioning correctly per the existing premium-redesign-2026.css rules.

3. **Mobile menu logo** — In the mobile full-screen menu overlay (`mobileOpen` portal), `HeaderBrandLockup` is rendered again. It will also benefit from this fix since the same component and same CSS class apply. No separate fix needed.

4. **Leaf raster availability** — When the leaf raster URL is unavailable (CDN failure or missing logo), the Lucide `<Leaf>` fallback uses `text-current` which inherits `--logo-primary` after this fix. This is correct.
