/**
 * Unified educational cognition contracts — learner-state, psychometric, remediation, dashboard.
 */
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import type { CoachingModel, RnCoachingIntelligenceReport } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { AiTutorContextEnvelope } from "@/lib/learner/rn-coaching-intelligence/ai-tutor-context-envelope";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type { PsychometricOrchestrationContext } from "@/lib/testing/psychometric-orchestrator";
import type { TestingModelReadinessSemantics } from "@/lib/testing/policies/readiness-policy";
import type { PsychometricDashboardWidgetId } from "@/lib/testing/testing-dashboard-governance";

export type CognitionCapability =
  | "adaptive_recommendations"
  | "pass_outlook"
  | "competency_graph"
  | "longitudinal_state"
  | "timing_intelligence"
  | "ai_coaching_narrative"
  | "measurement_interpretation"
  | "remediation_fatigue_governance";

export type DashboardWidgetContract = {
  id: PsychometricDashboardWidgetId | "readinessHero" | "weakAreaRail" | "studyMomentum" | "competencyBalance";
  eligible: boolean;
  priority: number;
  label: string;
};

export type DashboardCompositionContract = {
  pathwayId: string;
  widgets: DashboardWidgetContract[];
  showAdaptivePlan: boolean;
  primaryMetricLabel: string;
  sessionCtaLabel: string;
};

export type RemediationOrchestrationContract = {
  maxRecommendations: number;
  fatigueCapActive: boolean;
  graphAwareSequencing: boolean;
  recommendationFraming: string;
};

export type EducationalOntologySlice = {
  competencyIds: string[];
  measurementWeaknessTags: string[];
  reasoningPatternCodes: string[];
  telemetryNamespaces: string[];
  remediationPathwayIds: string[];
};

export type MeasurementCognitionSliceRef = {
  topCategory: string | null;
  measurementPriorityScore: number;
  learnerStateReason: string | null;
  priorityCount: number;
};

export type EducationalCognitionContext = {
  pathwayId: string;
  psychometric: PsychometricOrchestrationContext;
  coachingModel: CoachingModel;
  capabilities: Record<CognitionCapability, boolean>;
  readinessSemantics: TestingModelReadinessSemantics;
  readinessResult: ReadinessResult | null;
  learnerState: RnLearnerStateSnapshot;
  dashboard: DashboardCompositionContract;
  remediation: RemediationOrchestrationContract;
  ontology: EducationalOntologySlice;
  measurement: MeasurementCognitionSliceRef;
  coachingReport: RnCoachingIntelligenceReport | null;
  aiTutorEnvelope?: AiTutorContextEnvelope | null;
};

export type ResolveEducationalCognitionOptions = {
  userId?: string | null;
  sessionKind?: string | null;
  readinessResult?: ReadinessResult | null;
  weakTopicLabels?: string[];
  topicTrends?: import("@/lib/learner/topic-performance").TopicTrendRow[];
  weakTopics?: import("@/lib/learner/weak-topics-from-sessions").WeakTopicRow[];
  timing?: import("@/lib/learner/rn-coaching-intelligence/coaching-types").TimingIntelligenceResult | null;
  persistLearnerState?: boolean;
};
