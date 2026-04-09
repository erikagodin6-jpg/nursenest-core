/**
 * Single import surface for **region-aware exam marketing URLs** (US vs Canada, RN / PN / NP / Allied).
 * Prefer these helpers over hardcoding `/us/...` or `/canada/...` so nav, footer, and CTAs stay aligned.
 *
 * @see country-exam-offerings.ts (implementation)
 */
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import {
  defaultPathwayIdForMarketingOffering,
  defaultRnPathwayIdForMarketingRegion,
  loginCallbackAppCatStartForOffering,
  loginCallbackMarketingCatForOffering,
  publicMarketingCatHrefForOffering,
} from "@/lib/exam-pathways/practice-exams-cat-start";
import {
  marketingExamHubPath,
  type CountryExamOfferingId,
  EXAM_PATHWAY_ORDER,
  getExamNavStripItems,
  getExamPathwayHeroItems,
} from "@/lib/marketing/country-exam-offerings";

export {
  marketingExamHubPath,
  EXAM_PATHWAY_ORDER,
  getExamNavStripItems,
  getExamPathwayHeroItems,
  type CountryExamOfferingId,
  defaultPathwayIdForMarketingOffering,
  defaultRnPathwayIdForMarketingRegion,
  publicMarketingCatHrefForOffering,
};

/** Canonical exam hub roots for footer, cross-links, and “exam first” CTAs. */
export function marketingExamPrepHubs(region: MarketingRegionToggle): Record<CountryExamOfferingId, string> {
  return {
    rn: marketingExamHubPath(region, "rn"),
    pn: marketingExamHubPath(region, "pn"),
    np: marketingExamHubPath(region, "np"),
    allied: marketingExamHubPath(region, "allied"),
  };
}

/**
 * Default nursing entry when the UI must pick one hub (header “Exams”, homepage tertiary, etc.).
 * Strip + cards still expose PN/NP; this stays RN-first for the single-link case.
 */
export function defaultNursingExamMarketingHub(region: MarketingRegionToggle): string {
  return marketingExamHubPath(region, "rn");
}

/** Region’s NCLEX-RN pathway id (for `/app/practice-tests/start?pathwayId=…` callbacks). */
export { defaultRnPathwayIdForMarketingRegion as defaultRnPathwayIdForMarketingRegion };

/** Default app pathway id for a marketing offering (RN / PN / NP / Allied) in this region. */
export { defaultPathwayIdForMarketingOffering };

/**
 * Public marketing CAT landing for the offering (`/us/rn/nclex-rn/cat`, …). Use on `/practice-exams` tiles.
 */
export { publicMarketingCatHrefForOffering };

/**
 * Sign-in → return to **public** CAT explainer for the selected offering (pathway-aware).
 * @deprecated Prefer {@link publicMarketingCatHrefForOffering} for direct navigation; use this only when login must come first.
 */
export function loginCallbackCatStartForOffering(region: MarketingRegionToggle, offering: CountryExamOfferingId): string {
  return loginCallbackMarketingCatForOffering(region, offering);
}

/**
 * Sign-in → **app** CAT builder with correct `pathwayId` (when skipping the marketing CAT page is intentional).
 */
export function loginCallbackAppCatStartForOfferingExport(
  region: MarketingRegionToggle,
  offering: CountryExamOfferingId,
): string {
  return loginCallbackAppCatStartForOffering(region, offering);
}

/** Sign-in → public CAT page for the region’s default RN track. */
export function loginCallbackDefaultRnCatStart(region: MarketingRegionToggle): string {
  return loginCallbackMarketingCatForOffering(region, "rn");
}
