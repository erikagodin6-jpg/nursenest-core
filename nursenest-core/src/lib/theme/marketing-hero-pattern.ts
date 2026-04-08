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

export const MARKETING_PRIMARY_CTA_CLASS =
  "nn-btn-primary inline-flex min-h-[48px] w-full items-center justify-center px-8 py-3 text-base font-semibold transition-[filter] hover:bg-role-cta-hover sm:min-h-[52px] sm:w-auto sm:px-10 sm:text-lg" as const;

/** Secondary: lighter than primary (smaller type) — keeps one clear “main” action per section. */
export const MARKETING_SECONDARY_CTA_CLASS =
  "nn-btn-secondary inline-flex min-h-[48px] w-full items-center justify-center px-6 py-3 text-sm font-semibold sm:min-h-[52px] sm:w-auto sm:px-7 sm:text-base" as const;

export const MARKETING_TERTIARY_LINK_CLASS =
  "nn-link-quiet inline-flex min-h-[44px] items-center justify-center px-4 py-2 text-sm sm:min-h-0" as const;
