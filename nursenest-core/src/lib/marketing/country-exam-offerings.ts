/**
 * Single country-aware source for marketing exam/program labels (i18n keys) and canonical hrefs.
 * UI resolves `labelKey` with `t(labelKey)` so switching region updates copy immediately.
 *
 * **Import surface:** Prefer `@/lib/marketing/marketing-exam-navigation` for app-wide re-exports (`marketingExamPrepHubs`).
 *
 * Paths stay aligned with `marketing-entry-routes.ts` and programmatic SEO slugs — do not rename routes here.
 *
 * **NP:** US → `/np-exam-practice-questions` (programmatic umbrella listing FNP, AGPCNP, PMHNP). Canada → canonical CNPLE hub
 * (`/canada/np/cnple`) for product truth + waitlist/upcoming messaging.
 *
 * **Strip vs hero:** RN/PN/Allied use canonical pathway hub URLs; NP US uses the umbrella above.
 * Order is always RN → PN → NP → Allied (`EXAM_PATHWAY_ORDER`).
 */
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { NP, RN, alliedHub, pnPrimaryHub } from "@/lib/marketing/marketing-entry-routes";

export type CountryExamOfferingId = "rn" | "pn" | "np" | "allied";

/** Sub-navigation strip under the main header (compact exam-focused labels). */
export type ExamNavStripItem = {
  id: CountryExamOfferingId;
  labelKey: string;
  href: string;
};

/** Same shape as strip items; hero uses `home.quickEntry.*` label keys and hub hrefs. */
export type ExamPathwayHeroItem = ExamNavStripItem;

/**
 * Canonical order everywhere: RN, PN, NP, Allied — US/CA labels and routes resolve per region.
 */
export const EXAM_PATHWAY_ORDER: readonly CountryExamOfferingId[] = ["rn", "pn", "np", "allied"];

/** Primary marketing landing for each exam (pathway hub root, not programmatic SEO slugs). */
export function marketingExamHubPath(region: MarketingRegionToggle, id: CountryExamOfferingId): string {
  const isUs = region === "US";
  switch (id) {
    case "rn": {
      const p = getExamPathwayById(isUs ? "us-rn-nclex-rn" : "ca-rn-nclex-rn");
      return p ? buildExamPathwayPath(p) : RN.practiceProgrammatic;
    }
    case "pn":
      return pnPrimaryHub(region);
    case "np": {
      if (isUs) {
        return NP.practiceProgrammatic;
      }
      const caNp = getExamPathwayById("ca-np-cnple");
      return caNp ? buildExamPathwayPath(caNp) : NP.practiceProgrammaticCa;
    }
    case "allied":
      return alliedHub(region);
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

function examNavStripItemFor(region: MarketingRegionToggle, id: CountryExamOfferingId): ExamNavStripItem {
  const isUs = region === "US";
  switch (id) {
    case "rn":
      return { id: "rn", labelKey: "nav.examStrip.rn", href: marketingExamHubPath(region, "rn") };
    case "pn":
      return {
        id: "pn",
        labelKey: isUs ? "nav.examStrip.pnUS" : "nav.examStrip.pnCA",
        href: marketingExamHubPath(region, "pn"),
      };
    case "np":
      return {
        id: "np",
        labelKey: isUs ? "nav.examStrip.npUS" : "nav.examStrip.npCA",
        href: marketingExamHubPath(region, "np"),
      };
    case "allied":
      return {
        id: "allied",
        labelKey: isUs ? "nav.examStrip.alliedUS" : "nav.examStrip.alliedCA",
        href: marketingExamHubPath(region, "allied"),
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
      return { id: "rn", labelKey: "home.quickEntry.rnQuestions", href: marketingExamHubPath(region, "rn") };
    case "pn":
      return {
        id: "pn",
        labelKey: isUs ? "home.quickEntry.pnQuestionsUS" : "home.quickEntry.pnQuestionsCA",
        href: marketingExamHubPath(region, "pn"),
      };
    case "np":
      return {
        id: "np",
        labelKey: isUs ? "home.quickEntry.npQuestionsUS" : "home.quickEntry.npQuestionsCA",
        href: marketingExamHubPath(region, "np"),
      };
    case "allied":
      return {
        id: "allied",
        labelKey: isUs ? "home.quickEntry.alliedUS" : "home.quickEntry.alliedCA",
        href: marketingExamHubPath(region, "allied"),
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

/** Hero / quick-entry row: same order and labels as the nav strip; links go to each exam hub. */
export function getExamPathwayHeroItems(region: MarketingRegionToggle): ExamPathwayHeroItem[] {
  return EXAM_PATHWAY_ORDER.map((id) => examPathwayHeroItemFor(region, id));
}
