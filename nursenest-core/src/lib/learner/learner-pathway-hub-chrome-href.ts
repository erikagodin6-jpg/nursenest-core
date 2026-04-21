import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { isRnNclexMarketingPathwayId } from "@/lib/exam-pathways/rn-nclex-public-hub-policy";
import { CANONICAL_LEARNER_ROUTES } from "@/lib/navigation/learner-primary-nav";

/**
 * Learner shell “pathway pill” href: marketing exam hubs are not primary for RN NCLEX — use `/app/lessons`.
 * Uses pure {@link buildExamPathwayPath} — no exam registry import at module scope.
 */
export function learnerPathwayHubChromeHref(pathway: ExamPathwayDefinition): string {
  if (isRnNclexMarketingPathwayId(pathway.id)) {
    return `${CANONICAL_LEARNER_ROUTES.lessons}?pathwayId=${encodeURIComponent(pathway.id)}`;
  }
  return buildExamPathwayPath(pathway);
}

/**
 * Tier-based hub when DB has no learnerPath yet. Loads pathway rows via dynamic import so the
 * learner shell graph does not statically depend on the full exam product facade.
 */
export async function learnerPathwayHubChromeHrefForTierFallback(tier: string): Promise<string | null> {
  const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-product-registry");
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
