# Blossom Theme — Bright Marketing Pass (2026-05-11)

Branch: `feat/blossom-bright-marketing`
Commit: `feat(theme): brighten blossom palette and align logo with marketing hero`

## Goal

Align `[data-theme="blossom"]` with the user's bright, colourful reference:

- White-forward hero with a soft pastel atmosphere (no muddy gray-50).
- Pink → purple → warm-gold energy on CTAs and the marketing background.
- Header chrome that reads as light glass instead of a solid `#D9436A` band.
- Logo + wordmark visually cohesive with the new surfaces (CSS-only — CDN
  leaf asset and `resolveThemeLogo` were intentionally not touched).

## Files touched (surgical scope)

| File | Change |
| --- | --- |
| `nursenest-core/src/app/theme-palettes.css` | Refined `[data-theme="blossom"]` block only. |
| `nursenest-core/src/app/premium-redesign-2026.css` | Added one blossom-scoped `.nn-home-marketing-rich-hero` background bloom (CSS only, semantic-token-driven). |

Not changed (per scope):

- `nursenest-core/src/lib/branding/resolve-theme-logo.ts` — left alone. CDN
  leaf asset is fine; wordmark color intent is now driven by the updated
  `--logo-text` CSS variable in the blossom palette block.
- `nursenest-core/src/components/marketing/home/premium-homepage-hero.tsx`
  — left alone. The hero already paints from `var(--page-bg, …)` /
  semantic chart tokens, so the palette + new blossom-scoped CSS rule is
  enough.
- `nursenest-core/src/lib/theme/nav-chrome.ts` — left alone (see "Follow-up"
  below). For light themes (blossom is light), the marketing site-header
  paints from CSS tokens (`--nn-header-utility-bg`, `--nn-header-tier-bg`,
  `--nn-header-primary-bg`), not from the JS chrome value, so the CSS edits
  flow through end-to-end.
- No schema, route, i18n, or copy changes.

## Token diff (before / after)

| CSS variable                 | Before                             | After                                                                 | Why                                                                 |
| ---                          | ---                                | ---                                                                   | ---                                                                 |
| `--theme-page-bg`            | `#f8fafc` (slate-50, cool gray)    | `#fff8fb`                                                             | Aligns with `CLINICAL_THEME_META.blossom.surface` (`#FFF8FB`).      |
| `--theme-nav-background`     | `#D9436A` (solid magenta)          | `color-mix(in srgb, #D9436A 8%, #ffffff)` (≈ `#fdeff2`)               | Light-glass marketing band; brand pink tint, not a saturated wall. |
| `--theme-nav-foreground`     | `#FFFFFF`                          | `#5a1a30` (deep rose-wine)                                            | WCAG AA on the new tinted band; reads as warm rose ink.            |
| `--theme-nav-hover`          | `rgba(255,255,255,0.16)`           | `color-mix(in srgb, #D9436A 16%, #ffffff)`                            | Hover deepens the same blossom mix instead of a white wash.        |
| `--theme-nav-hover-foreground` | `#FFFFFF`                        | `#5a1a30`                                                             | Matches the new ink color so hover stays legible.                  |
| `--theme-header-top-bg`      | `#D9436A`                          | `color-mix(in srgb, #D9436A 6%, #ffffff)`                             | Utility band (top strip) feels barely tinted — closer to white.    |
| `--theme-header-main-bg`     | `#D9436A`                          | `color-mix(in srgb, #D9436A 8%, #ffffff)`                             | Tier band slightly stronger tint than utility for visual hierarchy.|
| `--theme-header-secondary-bg`| `#FFFFFF`                          | `#FFFFFF`                                                             | Unchanged — primary logo row stays pure white.                     |
| `--theme-header-secondary-fg`| `#111827`                          | `#1f2937`                                                             | Tiny softening; both pass AA on white.                              |
| `--theme-header-divider`     | `rgba(217, 67, 106, 0.24)`         | `color-mix(in srgb, #D9436A 22%, transparent)`                        | Same intent, expressed as token-linked color-mix.                  |
| `--logo-text`                | `#1f2937` (slate)                  | `#5a1a30` (deep rose-wine)                                            | Wordmark + leaf now read as one rose family on bright surfaces.    |
| `--logo-primary` / `--logo-accent` | unchanged (`#e75480` / `#3a86ff`) | unchanged                                                          | CDN leaf asset is intact; only the wordmark ink changed.           |

Tokens overridden by the existing final-pass `:is(...)` block (intentional —
left as documented): `--theme-secondary`, `--theme-secondary-foreground`,
`--theme-accent`, `--theme-accent-foreground`, `--theme-border`,
`--theme-topbar-bg`, `--theme-topbar-text`. These remain neutralised by the
shared light-shell normaliser at the bottom of `theme-palettes.css`.

## New marketing hero rule (premium-redesign-2026.css)

```css
html[data-theme="blossom"] .nn-home-marketing-rich-hero {
  background:
    radial-gradient(640px 360px at 12% 0%, color-mix(in srgb, var(--semantic-chart-1, #ec4899) 22%, transparent) 0%, transparent 60%),
    radial-gradient(640px 360px at 100% 8%, color-mix(in srgb, var(--semantic-chart-2, #a855f7) 18%, transparent) 0%, transparent 60%),
    radial-gradient(720px 380px at 50% 110%, color-mix(in srgb, var(--semantic-warning, #fbbf24) 16%, transparent) 0%, transparent 60%),
    var(--theme-page-bg, #fff8fb);
}
```

CSS-only. No new images. All hues come from the existing semantic chart
tokens; the flat `#…` literals are guarded fallbacks per the rest of the
file's pattern.

## Contrast / preservation report

- **Marketing utility band** (`color-mix(#D9436A 6%, #ffffff)` ≈ `#fdf2f4`) +
  rose-wine ink `#5a1a30` → ~9.5:1 contrast (AAA).
- **Marketing tier band** (`color-mix(#D9436A 8%, #ffffff)` ≈ `#fdeef1`) +
  `#5a1a30` → ~9.0:1 contrast (AAA).
- **Hover** (`color-mix(#D9436A 16%, #ffffff)` ≈ `#fad9e1`) + `#5a1a30` → ~6.6:1 (AA+).
- **Lesson pastel strips** are unchanged. They were already AA on `#ffffff`
  / `#fff8fb` (lighter background), so contrast is preserved or improved.
- **Page surface** moves from cool slate `#f8fafc` to warm pink-white
  `#fff8fb` — slightly warmer; body text `#4b5563` on `#fff8fb` is still
  ~8.5:1 (AAA).

## Validation

- `npm run typecheck:critical` — **PASS** (no new errors).
- `npx tsx --test src/lib/theme/theme-nav-chrome.contract.test.ts src/lib/theme/marketing-header-bands.contract.test.ts src/lib/theme/theme-palettes-order.test.ts` — **PASS** (47/47 tests, 5 suites).
- Diff is 2 files, +28/-6 net lines.
- No raw hex added in TSX. All new color values live in
  `theme-palettes.css` (palette source-of-truth) or are token-linked
  `color-mix` expressions.

## Follow-up (not in this PR)

`nursenest-core/src/lib/theme/nav-chrome.ts` still hard-codes
`NAV_CHROME_BY_THEME.blossom.chrome = "#D9436A"`. For **light** blossom,
this value is only consumed by the dark-theme branch of `<SiteHeader>`
(`isLightTheme ? undefined : { ...navChromeStyle, … }`), so it has no
visible impact on blossom today. If a future redesign wants the dashboard
sub-nav and footer chrome (which `getNavChromeStyle` paints unconditionally)
to also feel light glass on blossom, sync that JS value to the new tinted
mix or convert the JS module to read from CSS tokens. Out of scope here.

## PR suggestion

Merge `feat/blossom-bright-marketing` → `main` once preview-deploy
screenshots of the marketing homepage with blossom active (mobile + desktop)
look correct. No DB / route / i18n surface touched, so no learner regression
risk beyond the visual diff captured above.
