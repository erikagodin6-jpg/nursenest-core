/**
 * Shared marketing **hero** composition: rhythm and borders live in `globals.css`
 * (`.nn-marketing-hero-section`, `.nn-hero-bridge`, `.nn-stack-hero-heading`, `.nn-hero-cta-row`,
 * `.nn-final-cta-row`).
 * Pages vary layout (gradient, copy, media) but reuse these hooks for cohesion.
 */
export const MARKETING_HERO_SECTION_CLASS =
  "nn-hero-bridge nn-marketing-hero-section relative overflow-hidden pt-0" as const;

/** Home conversion closing block: stack on mobile, centered wrap on `sm+` (see `globals.css`). */
export const MARKETING_FINAL_CTA_ROW_CLASS = "nn-final-cta-row" as const;
