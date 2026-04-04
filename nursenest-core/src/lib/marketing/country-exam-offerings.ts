/**
 * Single country-aware source for marketing exam/program labels (i18n keys) and canonical hrefs.
 * UI resolves `labelKey` with `t(labelKey)` so switching region updates copy immediately.
 *
 * Paths stay aligned with `marketing-entry-routes.ts` and programmatic SEO slugs — do not rename routes here.
 *
 * **Strip vs hero:** `getExamNavStripItems` uses programmatic / brochure entry URLs (SEO, overview).
 * `getExamPathwayHeroItems` uses in-app question-bank entry URLs (conversion). Order is always
 * RN → PN → NP → Allied (`EXAM_PATHWAY_ORDER`).
 */
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import {
  ALLIED,
  RN,
  alliedQuestions,
  npNpQuestionsForRegion,
  npPracticeProgrammatic,
  pnPracticeProgrammatic,
  pnQuestions,
  rnQuestions,
} from "@/lib/marketing/marketing-entry-routes";

export type CountryExamOfferingId = "rn" | "pn" | "np" | "allied";

/** Sub-navigation strip under the main header (compact exam-focused labels). */
export type ExamNavStripItem = {
  id: CountryExamOfferingId;
  labelKey: string;
  href: string;
};

/** Same shape as strip items; hero uses question-bank hrefs and `home.quickEntry.*` label keys. */
export type ExamPathwayHeroItem = ExamNavStripItem;

/**
 * Canonical order everywhere: RN, PN, NP, Allied — US/CA labels and routes resolve per region.
 */
export const EXAM_PATHWAY_ORDER: readonly CountryExamOfferingId[] = ["rn", "pn", "np", "allied"];

function examNavStripItemFor(region: MarketingRegionToggle, id: CountryExamOfferingId): ExamNavStripItem {
  const isUs = region === "US";
  switch (id) {
    case "rn":
      return { id: "rn", labelKey: "nav.examStrip.rn", href: RN.practiceProgrammatic };
    case "pn":
      return {
        id: "pn",
        labelKey: isUs ? "nav.examStrip.pnUS" : "nav.examStrip.pnCA",
        href: pnPracticeProgrammatic(region),
      };
    case "np":
      return {
        id: "np",
        labelKey: isUs ? "nav.examStrip.npUS" : "nav.examStrip.npCA",
        href: npPracticeProgrammatic(region),
      };
    case "allied":
      return {
        id: "allied",
        labelKey: isUs ? "nav.examStrip.alliedUS" : "nav.examStrip.alliedCA",
        href: ALLIED.marketingLanding(),
      };
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

function examPathwayHeroItemFor(region: MarketingRegionToggle, id: CountryExamOfferingId): ExamPathwayHeroItem {
  const isUs = region === "US";
  switch (id) {
    case "rn":
      return { id: "rn", labelKey: "home.quickEntry.rnQuestions", href: rnQuestions(region) };
    case "pn":
      return {
        id: "pn",
        labelKey: isUs ? "home.quickEntry.pnQuestionsUS" : "home.quickEntry.pnQuestionsCA",
        href: pnQuestions(region),
      };
    case "np":
      return {
        id: "np",
        labelKey: isUs ? "home.quickEntry.npQuestionsUS" : "home.quickEntry.npQuestionsCA",
        href: npNpQuestionsForRegion(region),
      };
    case "allied":
      return {
        id: "allied",
        labelKey: isUs ? "home.quickEntry.alliedUS" : "home.quickEntry.alliedCA",
        href: alliedQuestions(region),
      };
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

export function getExamNavStripItems(region: MarketingRegionToggle): ExamNavStripItem[] {
  return EXAM_PATHWAY_ORDER.map((id) => examNavStripItemFor(region, id));
}

/** Hero / quick-entry row: same order and labels as the nav strip, question-bank hrefs for conversion. */
export function getExamPathwayHeroItems(region: MarketingRegionToggle): ExamPathwayHeroItem[] {
  return EXAM_PATHWAY_ORDER.map((id) => examPathwayHeroItemFor(region, id));
}
