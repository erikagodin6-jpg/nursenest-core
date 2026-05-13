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

/**
 * Phase 4 pilot: the full utility list is now encoded in .nn-marketing-cta-primary
 * (marketing-global.css). Callers still see a string constant — no call-site changes.
 * The arbitrary values (transition-[filter], sm:max-w-[min(...)]) are now in CSS,
 * removing them from the Tailwind arbitrary-value compiler output.
 */
export const MARKETING_PRIMARY_CTA_CLASS =
  “nn-btn-primary nn-marketing-cta-primary” as const;

/** Secondary: lighter than primary (smaller type) — keeps one clear “main” action per section. */
export const MARKETING_SECONDARY_CTA_CLASS =
  “nn-btn-secondary nn-marketing-cta-secondary” as const;

export const MARKETING_TERTIARY_LINK_CLASS =
  "nn-link-quiet inline-flex min-h-[44px] min-w-0 items-center justify-center gap-2 px-4 py-2 text-sm sm:min-h-0" as const;

/** Header, banners, dense toolbars — same brand pill as primary without full section min-heights. */
export const MARKETING_PRIMARY_CTA_COMPACT_CLASS =
  "nn-btn-primary inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-[filter] hover:bg-role-cta-hover sm:min-h-0" as const;

export const MARKETING_SECONDARY_CTA_COMPACT_CLASS =
  "nn-btn-secondary inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold sm:min-h-0" as const;
