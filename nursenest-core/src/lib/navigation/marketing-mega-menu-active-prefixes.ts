/**
 * Mega-menu “active tab” pathname prefixes only — no exam registries, allied catalogs, or hub builders.
 * Used by {@link SiteHeader} for aria-current / emphasis without importing heavy nav graph modules.
 */
export type MarketingPathwayMegaMenuKey = "rn" | "pn" | "np" | "newgrad" | "allied";

/** Canada marketing route for New Grad tier navigation (see `publicNewGradStudyDestinations`). */
export const CANADA_NEW_GRAD_MARKETING_HUB_PATH = "/canada/new-grad" as const;

/** US marketing landing for New Grad (clinical work-area cards → hubs). Study surfaces stay on the transition pathway URL. */
export const US_NEW_GRAD_MARKETING_HUB_PATH = "/us/new-grad" as const;

/**
 * Stripped marketing pathname prefixes (after {@link stripMarketingLocalePrefix}) that
 * should light up each exam mega-menu tab. Keep narrow: shared hubs like `/lessons` must
 * not activate "New Grad" just because the mega menu once linked there.
 */
export const MEGA_MENU_STRIPPED_ACTIVE_PREFIXES: Record<MarketingPathwayMegaMenuKey, readonly string[]> = {
  rn: ["/us/rn/", "/canada/rn/", "/lessons", "/question-bank"],
  pn: ["/us/pn/", "/canada/pn/"],
  np: ["/us/np/", "/canada/np/"],
  newgrad: [
    US_NEW_GRAD_MARKETING_HUB_PATH,
    `${US_NEW_GRAD_MARKETING_HUB_PATH}/`,
    "/us/rn/new-grad-transition",
    "/us/rn/new-grad-transition/",
    CANADA_NEW_GRAD_MARKETING_HUB_PATH,
    `${CANADA_NEW_GRAD_MARKETING_HUB_PATH}/`,
  ],
  /** Global hub, occupation hubs (`/allied/:professionKey`), and legacy country-prefixed shells. */
  allied: ["/allied/", "/us/allied/", "/canada/allied/"],
} as const;

/** Locale-stripped marketing paths like `/fr/new-grad` → `/new-grad` (exact, not `/new-graduation`). */
export function strippedPathActivatesMegaMenuKey(key: MarketingPathwayMegaMenuKey, strippedPath: string): boolean {
  if (key === "newgrad" && strippedPath === "/new-grad") return true;
  const prefixes = MEGA_MENU_STRIPPED_ACTIVE_PREFIXES[key];
  return prefixes.some((pre) => strippedPath.startsWith(pre));
}
