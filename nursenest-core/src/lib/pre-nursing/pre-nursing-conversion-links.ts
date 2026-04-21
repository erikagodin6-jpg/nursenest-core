import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { HUB } from "@/lib/marketing/marketing-entry-routes";

export type PreNursingFuturePathwayHint = "rn" | "rpn" | "pn" | "np" | "unsure";

const usRn = getExamPathwayById("us-rn-nclex-rn");
const usPn = getExamPathwayById("us-lpn-nclex-pn");
const caRpn = getExamPathwayById("ca-rpn-rex-pn");
const usNp = getExamPathwayById("us-np-fnp");

export function examPrepHrefForHint(hint: PreNursingFuturePathwayHint | null | undefined): string | null {
  if (!hint || hint === "unsure") return null;
  if (hint === "rn" && usRn) return HUB.examLessons;
  if (hint === "pn" && usPn) return buildExamPathwayPath(usPn);
  if (hint === "rpn" && caRpn) return buildExamPathwayPath(caRpn);
  if (hint === "np" && usNp) return buildExamPathwayPath(usNp);
  return null;
}

/** Optional second CTA (e.g. alternate region hub). RN NCLEX no longer uses a separate CA hub overview. */
export function secondaryExamPrepHrefForHint(_hint: PreNursingFuturePathwayHint | null | undefined): string | null {
  return null;
}
