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
  "nn-btn-primary inline-flex min-h-[48px] w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 px-8 py-3 text-center text-base font-semibold text-balance break-words transition-[filter] hover:bg-role-cta-hover sm:min-h-[52px] sm:w-auto sm:max-w-[min(100%,24rem)] sm:px-10 sm:text-lg" as const;

/** Secondary: lighter than primary (smaller type) — keeps one clear “main” action per section. */
export const MARKETING_SECONDARY_CTA_CLASS =
  "nn-btn-secondary inline-flex min-h-[48px] w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 px-6 py-3 text-center text-sm font-semibold text-balance break-words sm:min-h-[52px] sm:w-auto sm:max-w-[min(100%,22rem)] sm:px-7 sm:text-base" as const;

export const MARKETING_TERTIARY_LINK_CLASS =
  "nn-link-quiet inline-flex min-h-[44px] items-center justify-center px-4 py-2 text-sm sm:min-h-0" as const;

/** Header, banners, dense toolbars — same brand pill as primary without full section min-heights. */
export const MARKETING_PRIMARY_CTA_COMPACT_CLASS =
  "nn-btn-primary inline-flex min-h-[40px] items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-[filter] hover:bg-role-cta-hover sm:min-h-0" as const;

export const MARKETING_SECONDARY_CTA_COMPACT_CLASS =
  "nn-btn-secondary inline-flex min-h-[40px] items-center justify-center rounded-full px-4 py-2 text-sm font-semibold sm:min-h-0" as const;
