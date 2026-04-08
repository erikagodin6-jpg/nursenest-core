/**
 * Single import surface for **region-aware exam marketing URLs** (US vs Canada, RN / PN / NP / Allied).
 * Prefer these helpers over hardcoding `/us/...` or `/canada/...` so nav, footer, and CTAs stay aligned.
 *
 * @see country-exam-offerings.ts (implementation)
 */
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
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

const RN_PATHWAY_ID_BY_REGION: Record<MarketingRegionToggle, string> = {
  US: "us-rn-nclex-rn",
  CA: "ca-rn-nclex-rn",
};

/** Region’s NCLEX-RN pathway id (for `/app/practice-tests/start?pathwayId=…` callbacks). */
export function defaultRnPathwayIdForMarketingRegion(region: MarketingRegionToggle): string {
  return RN_PATHWAY_ID_BY_REGION[region];
}

/** Sign-in → app CAT start for the region’s default RN track (public practice-exams page, etc.). */
export function loginCallbackDefaultRnCatStart(region: MarketingRegionToggle): string {
  return loginWithCallback(appPathwayCatSessionStartPath(defaultRnPathwayIdForMarketingRegion(region)));
}
