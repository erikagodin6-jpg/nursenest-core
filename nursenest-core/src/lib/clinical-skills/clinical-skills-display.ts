import type { ClinicalSkillCompetencyTier } from "@/lib/clinical-skills/clinical-skills-catalog";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

export function clinicalSkillTierLabel(tier: ClinicalSkillCompetencyTier): string {
  switch (tier) {
    case "foundation":
      return "Foundation";
    case "proficiency":
      return "Proficiency";
    case "simulation_ready":
      return "Simulation-ready";
    default:
      return tier;
  }
}

export function clinicalSkillProgressLabel(status: PathwayLessonProgressStatus): string {
  if (status === "completed") return "Completed";
  if (status === "in_progress") return "In progress";
  return "Not started";
}
