/**
 * Learner dashboard UX governance by testing model — LOFT vs CAT visual semantics.
 */
import type { TestingModel } from "@/lib/testing/testing-model-types";
import { getTestingModelDefinition } from "@/lib/testing/testing-model-definitions";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";
import { loftDashboardPriorityThemes } from "@/lib/testing/psychometric-isolation";

/** Dashboard widget ids that carry CAT/adaptive psychometric semantics. */
export type PsychometricDashboardWidgetId =
  | "adaptiveEngine"
  | "passProbability"
  | "catStreak"
  | "adaptiveReadinessMeter"
  | "precisionConfidence";

export type LearnerDashboardPsychometricProfile = {
  model: TestingModel;
  priorityThemes: readonly string[];
  showAdaptiveProgression: boolean;
  showCatStreakSemantics: boolean;
  showEscalatingDifficultyMetaphors: boolean;
  primaryMetricLabel: string;
  sessionCtaLabel: string;
  /** Widgets that must not render for this pathway's testing model. */
  suppressedWidgets: readonly PsychometricDashboardWidgetId[];
};

const CAT_ONLY_WIDGETS: readonly PsychometricDashboardWidgetId[] = [
  "adaptiveEngine",
  "passProbability",
  "catStreak",
  "adaptiveReadinessMeter",
  "precisionConfidence",
] as const;

const LOFT_SUPPRESSED = CAT_ONLY_WIDGETS;
const LINEAR_SUPPRESSED: readonly PsychometricDashboardWidgetId[] = [
  "adaptiveEngine",
  "catStreak",
  "adaptiveReadinessMeter",
  "precisionConfidence",
] as const;

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
      suppressedWidgets: LOFT_SUPPRESSED,
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
      suppressedWidgets: [] as const,
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
    suppressedWidgets: LINEAR_SUPPRESSED,
  };
}

/** Capability-driven widget eligibility — prefer this over pathway conditionals in dashboard UI. */
export function isDashboardWidgetEligible(
  pathwayId: string | null | undefined,
  widgetId: PsychometricDashboardWidgetId,
): boolean {
  const profile = getLearnerDashboardProfile(pathwayId);
  return !profile.suppressedWidgets.includes(widgetId);
}
