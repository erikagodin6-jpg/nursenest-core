import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/** US NCLEX-PN (LPN/LVN) and Canada REx-PN (RPN) marketing exam hubs — premium convergence surface. */
export function isPracticalNursingMarketingPathway(pathway: ExamPathwayDefinition): boolean {
  return pathway.id === "us-lpn-nclex-pn" || pathway.id === "ca-rpn-rex-pn";
}
