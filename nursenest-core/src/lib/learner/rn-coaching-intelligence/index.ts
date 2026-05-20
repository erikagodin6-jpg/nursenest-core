/** RN competency-state coaching intelligence — public API */

export type {
  CoachingModel,
  CoachingRecommendation,
  RnCoachingIntelligenceReport,
  PostExamDashboardFeed,
  ReadinessReliability,
  ClinicalJudgmentPattern,
} from "@/lib/learner/rn-coaching-intelligence/coaching-types";

export type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

export {
  buildRnCoachingIntelligenceReport,
  getReadinessBandFromScore,
  resolveCoachingSessionKind,
  type BuildRnCoachingIntelligenceInput,
} from "@/lib/learner/rn-coaching-intelligence/build-rn-coaching-intelligence-report";

export {
  persistDashboardFeedToSession,
  readDashboardFeedFromSession,
  clearDashboardFeedSession,
} from "@/lib/learner/rn-coaching-intelligence/dashboard-feed";

export {
  persistLearnerState,
  readLearnerState,
  readLearnerStateFromSession,
  persistLearnerStateToSession,
} from "@/lib/learner/rn-coaching-intelligence/learner-state-store";

export {
  recordCoachingTelemetry,
  recordTimingInsightEngagement,
  recordRemediationAcceptance,
  recordStudyPlanCompletion,
} from "@/lib/learner/rn-coaching-intelligence/coaching-telemetry";

export { governCoachingReportCopy, validateRemediationRecommendation } from "@/lib/learner/rn-coaching-intelligence/ai-coaching-governance";

export {
  buildOrchestratedPostExamReport,
  buildEnrichedPostExamPerformanceReport,
  type BuildOrchestratedPostExamInput,
} from "@/lib/learner/rn-coaching-intelligence/coaching-orchestration";

export { composeDashboardOrchestrationV3 } from "@/lib/learner/rn-coaching-intelligence/dashboard-orchestration-v3";
export { buildGovernedRnStudyPlan } from "@/lib/learner/rn-coaching-intelligence/study-plan-orchestration";
export {
  deriveTimingCognitionSignals,
  deriveTimingRiskBand,
  studyPlanDensityFromTiming,
} from "@/lib/learner/rn-coaching-intelligence/timing-cognition";
export { buildUnifiedRemediationHrefs } from "@/lib/learner/rn-coaching-intelligence/remediation-traversal";
export { buildTimingInsightCards } from "@/lib/learner/rn-coaching-intelligence/timing-insights-ui";
export { buildAiTutorContextEnvelope, type AiTutorContextEnvelope } from "@/lib/learner/rn-coaching-intelligence/ai-tutor-context-envelope";
export {
  wrapLearnerStateForServer,
  mergeServerLearnerState,
  fingerprintLearnerState,
} from "@/lib/learner/rn-coaching-intelligence/learner-state-server-sync";
