import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";

export type PreNursingFuturePathwayHint = "rn" | "rpn" | "pn" | "np" | "unsure";

const usRn = getExamPathwayById("us-rn-nclex-rn");
const usPn = getExamPathwayById("us-lpn-nclex-pn");
const caRpn = getExamPathwayById("ca-rpn-rex-pn");
const caRn = getExamPathwayById("ca-rn-nclex-rn");
const usNp = getExamPathwayById("us-np-fnp");

export function examPrepHrefForHint(hint: PreNursingFuturePathwayHint | null | undefined): string | null {
  if (!hint || hint === "unsure") return null;
  if (hint === "rn" && usRn) return buildExamPathwayPath(usRn);
  if (hint === "pn" && usPn) return buildExamPathwayPath(usPn);
  if (hint === "rpn" && caRpn) return buildExamPathwayPath(caRpn);
  if (hint === "np" && usNp) return buildExamPathwayPath(usNp);
  return null;
}

/** Canada PN / REX-PN style — use CA RN hub as alternate when rpn chosen */
export function secondaryExamPrepHrefForHint(hint: PreNursingFuturePathwayHint | null | undefined): string | null {
  if (hint === "rn" && caRn) return buildExamPathwayPath(caRn);
  return null;
}
