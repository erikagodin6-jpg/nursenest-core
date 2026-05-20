/**
 * Behavioral contracts per psychometric delivery model — not label-only routing.
 */
import type { TestingModel } from "@/lib/testing/testing-model-types";

export type PsychometricStyle = "adaptive" | "blueprint_constrained" | "fixed_form";
export type PacingStyle = "dynamic" | "stable" | "fixed";
export type RemediationStyle = "adaptive_precision" | "competency_balance" | "practice_review";
export type AnalyticsModelKey = "cat" | "loft" | "linear";

export interface TestingModelDefinition {
  model: TestingModel;
  learnerFacingName: string;
  psychometricStyle: PsychometricStyle;
  pacingStyle: PacingStyle;
  remediationStyle: RemediationStyle;
  analyticsModel: AnalyticsModelKey;
  simulationFamily: string;
  allowsDifficultyAdaptation: boolean;
  allowsConfidenceEstimation: boolean;
  allowsAdaptiveTermination: boolean;
}

export const TESTING_MODEL_DEFINITIONS: Readonly<Record<TestingModel, TestingModelDefinition>> = {
  CAT: {
    model: "CAT",
    learnerFacingName: "Adaptive CAT",
    psychometricStyle: "adaptive",
    pacingStyle: "dynamic",
    remediationStyle: "adaptive_precision",
    analyticsModel: "cat",
    simulationFamily: "adaptive_licensing",
    allowsDifficultyAdaptation: true,
    allowsConfidenceEstimation: true,
    allowsAdaptiveTermination: true,
  },
  LOFT: {
    model: "LOFT",
    learnerFacingName: "LOFT Simulation",
    psychometricStyle: "blueprint_constrained",
    pacingStyle: "stable",
    remediationStyle: "competency_balance",
    analyticsModel: "loft",
    simulationFamily: "canadian_np_readiness",
    allowsDifficultyAdaptation: false,
    allowsConfidenceEstimation: false,
    allowsAdaptiveTermination: false,
  },
  LINEAR: {
    model: "LINEAR",
    learnerFacingName: "Practice exam",
    psychometricStyle: "fixed_form",
    pacingStyle: "fixed",
    remediationStyle: "practice_review",
    analyticsModel: "linear",
    simulationFamily: "linear_practice",
    allowsDifficultyAdaptation: false,
    allowsConfidenceEstimation: false,
    allowsAdaptiveTermination: false,
  },
} as const;

export function getTestingModelDefinition(model: TestingModel): TestingModelDefinition {
  return TESTING_MODEL_DEFINITIONS[model];
}
