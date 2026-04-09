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

/** Canonical pathway id per region and marketing offering (matches `EXAM_PATHWAYS`). */
const DEFAULT_PATHWAY_ID_BY_OFFERING: Record<MarketingRegionToggle, Record<CountryExamOfferingId, string>> = {
  US: {
    rn: "us-rn-nclex-rn",
    pn: "us-lpn-nclex-pn",
    np: "us-np-fnp",
    allied: "us-allied-core",
  },
  CA: {
    rn: "ca-rn-nclex-rn",
    pn: "ca-rpn-rex-pn",
    np: "ca-np-cnple",
    allied: "ca-allied-core",
  },
};

/** Region’s NCLEX-RN pathway id (for `/app/practice-tests/start?pathwayId=…` callbacks). */
export function defaultRnPathwayIdForMarketingRegion(region: MarketingRegionToggle): string {
  return RN_PATHWAY_ID_BY_REGION[region];
}

/** Default app pathway id for a marketing offering (RN / PN / NP / Allied) in this region. */
export function defaultPathwayIdForMarketingOffering(
  region: MarketingRegionToggle,
  offering: CountryExamOfferingId,
): string {
  return DEFAULT_PATHWAY_ID_BY_OFFERING[region][offering];
}

/** Sign-in → app CAT start for the given marketing offering and region (`/practice-exams`, strips, etc.). */
export function loginCallbackCatStartForOffering(region: MarketingRegionToggle, offering: CountryExamOfferingId): string {
  return loginWithCallback(appPathwayCatSessionStartPath(defaultPathwayIdForMarketingOffering(region, offering)));
}

/** Sign-in → app CAT start for the region’s default RN track (single-link CTAs that stay RN-first). */
export function loginCallbackDefaultRnCatStart(region: MarketingRegionToggle): string {
  return loginCallbackCatStartForOffering(region, "rn");
}
