import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { ExamFamily } from "@prisma/client";

/**
 * Dynamic label for high-yield takeaways strips — avoids hardcoding NCLEX for every pathway.
 */
export function examTakeawaysHeadingForPathway(
  pathway: Pick<ExamPathwayDefinition, "id" | "examFamily">,
): string {
  if (pathway.examFamily === ExamFamily.NP || /(^|-)np-/.test(pathway.id)) {
    return "NP Exam Takeaways";
  }
  if (pathway.id.includes("allied")) {
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
