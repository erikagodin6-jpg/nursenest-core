/**
 * Single import surface for **region-aware exam marketing URLs** (US vs Canada, RN / PN / NP / Allied).
 * Prefer these helpers over hardcoding `/us/...` or `/canada/...` so nav, footer, and CTAs stay aligned.
 *
 * @see country-exam-offerings.ts (implementation)
 */
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
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
