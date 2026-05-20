/**
 * Learner dashboard UX governance by testing model — LOFT vs CAT visual semantics.
 */
import type { TestingModel } from "@/lib/testing/testing-model-types";
import { getTestingModelDefinition } from "@/lib/testing/testing-model-definitions";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";
import { loftDashboardPriorityThemes } from "@/lib/testing/psychometric-isolation";

export type LearnerDashboardPsychometricProfile = {
  model: TestingModel;
  priorityThemes: readonly string[];
  showAdaptiveProgression: boolean;
  showCatStreakSemantics: boolean;
  showEscalatingDifficultyMetaphors: boolean;
  primaryMetricLabel: string;
  sessionCtaLabel: string;
};

export function getLearnerDashboardProfile(
  pathwayId: string | null | undefined,
): LearnerDashboardPsychometricProfile {
  const model = getTestingModelForPathwayId(pathwayId);
  const def = getTestingModelDefinition(model);

  if (model === "LOFT") {
    return {
      model,
      priorityThemes: loftDashboardPriorityThemes(),
      showAdaptiveProgression: false,
      showCatStreakSemantics: false,
      showEscalatingDifficultyMetaphors: false,
      primaryMetricLabel: "Readiness & competency balance",
      sessionCtaLabel: "Continue LOFT simulation",
    };
  }

  if (model === "CAT") {
    return {
      model,
      priorityThemes: ["adaptive progression", "precision readiness", "weak-area targeting"] as const,
      showAdaptiveProgression: true,
      showCatStreakSemantics: true,
      showEscalatingDifficultyMetaphors: true,
      primaryMetricLabel: "Adaptive readiness",
      sessionCtaLabel: def.learnerFacingName,
    };
  }

  return {
    model,
    priorityThemes: ["topic recall", "practice completion", "timed blocks"] as const,
    showAdaptiveProgression: false,
    showCatStreakSemantics: false,
    showEscalatingDifficultyMetaphors: false,
    primaryMetricLabel: "Practice performance",
    sessionCtaLabel: def.learnerFacingName,
  };
}
