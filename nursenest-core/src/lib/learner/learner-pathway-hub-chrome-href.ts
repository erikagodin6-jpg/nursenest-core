import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/**
 * Learner shell “pathway pill” href: public marketing exam hub root for the pathway.
 * Uses pure {@link buildExamPathwayPath} — no exam registry import at module scope.
 */
export function learnerPathwayHubChromeHref(pathway: ExamPathwayDefinition): string {
  return buildExamPathwayPath(pathway);
}

/** Tier-based hub when DB has no learnerPath yet. */
export async function learnerPathwayHubChromeHrefForTierFallback(tier: string): Promise<string | null> {
  const t = tier.toUpperCase();
  if (t === "RN") {
    const p = getExamPathwayById("ca-rn-nclex-rn");
    return p ? learnerPathwayHubChromeHref(p) : "/canada/rn/nclex-rn";
  }
  if (t === "RPN") {
    const p = getExamPathwayById("ca-rpn-rex-pn");
    return p ? learnerPathwayHubChromeHref(p) : "/canada/pn/rex-pn";
  }
  if (t === "LVN_LPN") {
    const p = getExamPathwayById("us-lpn-nclex-pn");
    return p ? learnerPathwayHubChromeHref(p) : "/us/lpn/nclex-pn";
  }
  if (t === "NP") {
    const p = getExamPathwayById("us-np-fnp");
    return p ? learnerPathwayHubChromeHref(p) : "/us/np/fnp";
  }
  if (t === "ALLIED") return "/allied/allied-health";
  if (t === "PRE_NURSING") return "/pre-nursing";
  return null;
}
