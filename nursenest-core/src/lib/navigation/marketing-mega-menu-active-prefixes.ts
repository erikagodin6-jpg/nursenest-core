/**
 * Mega-menu “active tab” pathname prefixes only — no exam registries, allied catalogs, or hub builders.
 * Used by {@link SiteHeader} for aria-current / emphasis without importing heavy nav graph modules.
 */
export type MarketingPathwayMegaMenuKey = "rn" | "pn" | "np" | "newgrad" | "allied";

/**
 * Stripped marketing pathname prefixes (after {@link stripMarketingLocalePrefix}) that
 * should light up each exam mega-menu tab. Keep narrow: shared hubs like `/lessons` must
 * not activate "New Grad" just because the mega menu once linked there.
 */
export const MEGA_MENU_STRIPPED_ACTIVE_PREFIXES: Record<MarketingPathwayMegaMenuKey, readonly string[]> = {
  rn: ["/us/rn/", "/canada/rn/", "/lessons", "/question-bank"],
  pn: ["/us/pn/", "/canada/pn/"],
  np: ["/us/np/", "/canada/np/"],
  newgrad: ["/us/rn/new-grad-transition", "/us/rn/new-grad-transition/", "/us/new-grad", "/canada/new-grad"],
  allied: ["/us/allied/", "/canada/allied/"],
} as const;
