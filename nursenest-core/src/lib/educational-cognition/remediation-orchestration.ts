/**
 * Remediation orchestration layer — graph-aware sequencing with fatigue governance.
 */
import { planRemediationV3 } from "@/lib/learner/rn-coaching-intelligence/remediation-planner-v3";
import type { CoachingRecommendation } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { CoachingSessionKind } from "@/lib/learner/rn-coaching-intelligence/remediation-planner-v3";
import type { CatResultsCoachSnapshot } from "@/lib/practice-tests/cat-results-coach";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type {
  RemediationOrchestrationContract,
} from "@/lib/educational-cognition/educational-cognition-types";
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";

export function orchestrateGovernedRemediation(args: {
  coachingModel: CoachingModel;
  sessionKind: CoachingSessionKind;
  pathwayId: string | null;
  weakTopicLabels: string[];
  contract: RemediationOrchestrationContract;
  coach?: CatResultsCoachSnapshot | null;
  remediationUserId?: string | null;
  learnerState?: RnLearnerStateSnapshot | null;
}): CoachingRecommendation[] {
  return planRemediationV3({
    coachingModel: args.coachingModel,
    sessionKind: args.sessionKind,
    pathwayId: args.pathwayId,
    weakTopicLabels: args.weakTopicLabels,
    coach: args.coach,
    remediationUserId: args.remediationUserId,
    learnerState: args.learnerState,
    maxItems: args.contract.maxRecommendations,
  });
}
