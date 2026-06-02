import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { ExamFamily } from "@prisma/client";

export type ExamTakeawaysHeadingOpts = {
  /** Short profession line for allied hubs, e.g. “Physical therapist assistant exam prep”. */
  alliedProfessionLabel?: string;
};

/**
 * Dynamic label for exam takeaway blocks — driven by pathway id + exam family (no page-level hardcoding).
 */
export function examTakeawaysHeadingForPathway(
  pathway: Pick<ExamPathwayDefinition, "id" | "examFamily">,
  opts?: ExamTakeawaysHeadingOpts,
): string {
  if (pathway.examFamily === ExamFamily.NP || /(^|-)np-/.test(pathway.id)) {
    return "NP Exam Takeaways";
  }
  if (pathway.examFamily === ExamFamily.ALLIED || pathway.id.includes("allied")) {
    const p = opts?.alliedProfessionLabel?.trim();
    if (p) {
      const short = p.length > 48 ? `${p.slice(0, 45).trim()}…` : p;
      return `Exam Takeaways · ${short}`;
    }
    return "Exam Takeaways";
  }
  if (pathway.id === "ca-rpn-rex-pn") {
    return "REx-PN Takeaways";
  }
  if (pathway.id === "us-lpn-nclex-pn") {
    return "NCLEX-PN Takeaways";
  }
  if (pathway.id === "ca-rn-nclex-rn" || pathway.id === "us-rn-nclex-rn") {
    return "NCLEX-RN Takeaways";
  }
  return "Exam Takeaways";
}
