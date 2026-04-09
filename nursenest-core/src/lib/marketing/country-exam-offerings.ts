/**
 * Single country-aware source for marketing exam/program labels (i18n keys) and canonical hrefs.
 * UI resolves `labelKey` with `t(labelKey)` so switching region updates copy immediately.
 *
 * **Import surface:** Prefer `@/lib/marketing/marketing-exam-navigation` for app-wide re-exports (`marketingExamPrepHubs`).
 *
 * Paths stay aligned with `marketing-entry-routes.ts` and programmatic SEO slugs — do not rename routes here.
 *
 * **NP:** US → default pathway hub `/us/np/fnp` (FNP). Canada → canonical CNPLE hub (`/canada/np/cnple`).
 * Legacy programmatic SEO slugs 301 to these hubs (`canonical-pathway-hubs` + `next.config` redirects).
 *
 * **Strip vs hero:** RN/PN/NP/Allied use canonical pathway hub URLs from the registry.
 * Order is always RN → PN → NP → Allied (`EXAM_PATHWAY_ORDER`).
 */
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { CANONICAL_PATHWAY_HUB } from "@/lib/marketing/canonical-pathway-hubs";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { alliedHub, pnPrimaryHub } from "@/lib/marketing/marketing-entry-routes";

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

/**
 * Canonical pathway id for each marketing offering (RN/PN/NP/Allied), aligned with {@link marketingExamHubPath}.
 * Use for CAT URLs, app deep links, and analytics — avoids duplicating hub ↔ registry mapping elsewhere.
 */
export function defaultPathwayIdForMarketingOffering(region: MarketingRegionToggle, id: CountryExamOfferingId): string {
  const isUs = region === "US";
  switch (id) {
    case "rn":
      return isUs ? "us-rn-nclex-rn" : "ca-rn-nclex-rn";
    case "pn":
      return isUs ? "us-lpn-nclex-pn" : "ca-rpn-rex-pn";
    case "np":
      return isUs ? "us-np-fnp" : "ca-np-cnple";
    case "allied":
      return isUs ? "us-allied-core" : "ca-allied-core";
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

/** Primary marketing landing for each exam (pathway hub root, not programmatic SEO slugs). */
export function marketingExamHubPath(region: MarketingRegionToggle, id: CountryExamOfferingId): string {
  const isUs = region === "US";
  const pathwayId = defaultPathwayIdForMarketingOffering(region, id);
  const p = getExamPathwayById(pathwayId);
  if (p) return buildExamPathwayPath(p);
  switch (id) {
    case "rn":
      return isUs ? CANONICAL_PATHWAY_HUB.usRn : CANONICAL_PATHWAY_HUB.caRn;
    case "pn":
      return pnPrimaryHub(region);
    case "np":
      return isUs ? CANONICAL_PATHWAY_HUB.usNp : CANONICAL_PATHWAY_HUB.caNp;
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
