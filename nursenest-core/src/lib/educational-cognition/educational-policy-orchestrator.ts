/**
 * Educational policy orchestration — bridges psychometric policies to coaching / remediation semantics.
 */
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { PsychometricOrchestrationContext } from "@/lib/testing/psychometric-orchestrator";
import type {
  RemediationOrchestrationContract,
} from "@/lib/educational-cognition/educational-cognition-types";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

export function coachingModelFromPsychometric(ctx: PsychometricOrchestrationContext): CoachingModel {
  if (ctx.model === "LOFT") return "loft_readiness";
  if (ctx.model === "CAT") return "cat_adaptive";
  return "linear_practice";
}

export function buildRemediationOrchestrationContract(
  psychometric: PsychometricOrchestrationContext,
  learnerState: RnLearnerStateSnapshot,
): RemediationOrchestrationContract {
  const fatigueCapActive = learnerState.remediationFatigueScore >= 0.65;
  return {
    maxRecommendations: fatigueCapActive ? 3 : 5,
    fatigueCapActive,
    graphAwareSequencing: true,
    recommendationFraming: psychometric.recommendations.weakAreaFraming,
  };
}
