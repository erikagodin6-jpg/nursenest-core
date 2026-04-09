/**
 * Single import surface for **region-aware exam marketing URLs** (US vs Canada, RN / PN / NP / Allied).
 * Prefer these helpers over hardcoding `/us/...` or `/canada/...` so nav, footer, and CTAs stay aligned.
 *
 * @see country-exam-offerings.ts (implementation)
 */
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import {
  loginCallbackAppCatStartForOffering,
  loginCallbackMarketingCatForOffering,
  publicMarketingCatHrefForOffering,
} from "@/lib/exam-pathways/practice-exams-cat-start";
import {
  marketingExamHubPath,
  defaultPathwayIdForMarketingOffering,
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
  publicMarketingCatHrefForOffering,
  loginCallbackAppCatStartForOffering,
  loginCallbackMarketingCatForOffering,
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

/**
 * Sign-in → return to the **public** CAT page for the selected offering (`/us/rn/nclex-rn/cat`, …).
 * Prefer {@link publicMarketingCatHrefForOffering} when the user can browse the CAT page without forcing login first.
 */
export function loginCallbackCatStartForOffering(region: MarketingRegionToggle, offering: CountryExamOfferingId): string {
  return loginCallbackMarketingCatForOffering(region, offering);
}

/** Sign-in → public CAT page for the region’s default RN track. */
export function loginCallbackDefaultRnCatStart(region: MarketingRegionToggle): string {
  return loginCallbackMarketingCatForOffering(region, "rn");
}
