import type { GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";
import { REMEDIATION_LADDER_MAX_STEPS, TOPIC_HUB_GRAPH_MAX_LINKS } from "@/lib/educational-graph/graph-governance";

/** Marketing lesson graph pills (orchestrator output cap before UI). */
export const MARKETING_GRAPH_PILL_MAX = 3;

/** Single remediation CTA on public lesson surfaces. */
export const MARKETING_REMEDIATION_CTA_MAX = 1;

/** Dashboard / feed prioritized actions. */
export const DASHBOARD_ACTION_MAX = 5;

/** Reassessment prompts grouped on dashboard surfaces. */
export const DASHBOARD_REASSESSMENT_GROUP_MAX = 2;

/** Study-plan blocks derived from remediation recommendations. */
export const STUDY_PLAN_BLOCK_MAX = 8;

/** AI tutor may expand traversal within governed depth. */
export const AI_TUTOR_DYNAMIC_MAX = 10;

export function maxGraphStepsForSurface(
  surface: GraphSourceSurface,
  options?: { fatigueScore?: number; explicitMax?: number },
): number {
  const fatigue = options?.fatigueScore ?? 0;
  if (options?.explicitMax != null) {
    return Math.min(options.explicitMax, REMEDIATION_LADDER_MAX_STEPS);
  }

  switch (surface) {
    case "marketing_lesson":
      return MARKETING_GRAPH_PILL_MAX;
    case "topic_hub_public":
      return TOPIC_HUB_GRAPH_MAX_LINKS;
    case "topic_hub_authenticated":
      return Math.min(6, REMEDIATION_LADDER_MAX_STEPS);
    case "dashboard_feed":
      return fatigue >= 0.7 ? Math.min(3, DASHBOARD_ACTION_MAX) : DASHBOARD_ACTION_MAX;
    case "study_plan":
      return fatigue >= 0.6 ? Math.min(5, STUDY_PLAN_BLOCK_MAX) : STUDY_PLAN_BLOCK_MAX;
    case "ai_tutor":
      return Math.min(AI_TUTOR_DYNAMIC_MAX, REMEDIATION_LADDER_MAX_STEPS);
    case "post_exam_coaching":
    case "recommendation_engine":
    case "app_remediation":
    default:
      return REMEDIATION_LADDER_MAX_STEPS;
  }
}

export function isAuthenticatedGraphSurface(surface: GraphSourceSurface): boolean {
  return (
    surface === "topic_hub_authenticated" ||
    surface === "app_remediation" ||
    surface === "post_exam_coaching" ||
    surface === "dashboard_feed" ||
    surface === "study_plan" ||
    surface === "ai_tutor" ||
    surface === "recommendation_engine"
  );
}
