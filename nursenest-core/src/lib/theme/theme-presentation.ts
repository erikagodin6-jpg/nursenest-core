/**
 * Theme presentation layer: **CSS custom properties** on `[data-theme]` (see `globals.css`) are the
 * source of truth for companion surfaces (`--nn-presentation-*`). They mix from `THEME_OPTIONS[].color`
 * indirectly via the active palette’s `--theme-primary`.
 *
 * This module documents those tokens for TypeScript consumers (QA labels, Storybook, future tooling).
 * Do not duplicate ad hoc hexes in components; prefer `bg-[var(--nn-presentation-wash)]`, etc.
 */
export const THEME_PRESENTATION_CSS_VARS = [
  "--nn-presentation-wash",
  "--nn-presentation-panel",
  "--nn-presentation-badge",
  "--nn-presentation-trust-band",
  "--nn-presentation-ribbon",
  "--nn-presentation-divider",
] as const;

export const THEME_RHYTHM_CSS_VARS = [
  "--nn-rhythm-page-y",
  "--nn-rhythm-section-y",
  "--nn-rhythm-tight-y",
  "--nn-rhythm-hero-gap",
  "--nn-rhythm-footer-y",
  "--nn-rhythm-shell-y",
] as const;
