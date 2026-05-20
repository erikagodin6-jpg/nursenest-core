import { buildRnRemediationGraphSteps } from "@/lib/learner/rn-coaching-intelligence/competency-graph-orchestration";
import type { CompetencyGraphStep, CoachingModel } from "@/lib/learner/post-exam-coaching/types";

/**
 * @deprecated Use {@link buildRnRemediationGraphSteps} — thin re-export for post-exam coaching.
 */
export function buildCompetencyGraphSteps(args: {
  topic: string;
  pathwayId: string | null;
  coachingModel: CoachingModel;
  exposureDepth: number;
}): CompetencyGraphStep[] {
  return buildRnRemediationGraphSteps({
    ...args,
    sourceSurface: "post_exam_coaching",
  });
}
