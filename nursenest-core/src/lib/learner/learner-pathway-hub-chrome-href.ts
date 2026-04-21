import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { isRnNclexMarketingPathwayId } from "@/lib/exam-pathways/rn-nclex-public-hub-policy";
import { CANONICAL_LEARNER_ROUTES } from "@/lib/navigation/learner-primary-nav";

/**
 * Learner shell “pathway pill” href: marketing exam hubs are not primary for RN NCLEX — use `/app/lessons`.
 */
export function learnerPathwayHubChromeHref(pathway: ExamPathwayDefinition): string {
  if (isRnNclexMarketingPathwayId(pathway.id)) {
    return `${CANONICAL_LEARNER_ROUTES.lessons}?pathwayId=${encodeURIComponent(pathway.id)}`;
  }
  return buildExamPathwayPath(pathway);
}

export function learnerPathwayHubChromeHrefForTierFallback(tier: string): string | null {
  const t = tier.toUpperCase();
  if (t === "RN") {
    const p = getExamPathwayById("us-rn-nclex-rn");
    return p ? learnerPathwayHubChromeHref(p) : `${CANONICAL_LEARNER_ROUTES.lessons}?pathwayId=us-rn-nclex-rn`;
  }
  if (t === "RPN") {
    const p = getExamPathwayById("ca-rpn-rex-pn");
    return p ? learnerPathwayHubChromeHref(p) : "/canada/rpn/rex-pn";
  }
  if (t === "LVN_LPN") {
    const p = getExamPathwayById("us-lpn-nclex-pn");
    return p ? learnerPathwayHubChromeHref(p) : "/us/lpn/nclex-pn";
  }
  if (t === "NP") {
    const p = getExamPathwayById("us-np-fnp");
    return p ? learnerPathwayHubChromeHref(p) : "/us/np/fnp";
  }
  if (t === "ALLIED") return "/us/allied/allied-health";
  return null;
}
