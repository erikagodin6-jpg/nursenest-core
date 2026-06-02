import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/** True for US/CA New Grad transition marketing + tier hub surfaces (`NursingTierHubPage`). */
export function isNewGradTransitionPathway(pathway: ExamPathwayDefinition): boolean {
  return pathway.stripeTier === "NEW_GRAD" || pathway.examCode === "new-grad-transition";
}
