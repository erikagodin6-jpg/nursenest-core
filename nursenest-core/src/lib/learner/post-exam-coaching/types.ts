import type { ReadinessBand } from "@/lib/learner/post-exam-performance-report";

/** Psychometric + copy semantics — never mix CAT adaptive language into LOFT. */
export type CoachingModel = "cat_adaptive" | "loft_readiness" | "linear_practice";

export type ReadinessReliability = "high" | "moderate" | "low";

export type ClinicalJudgmentPattern =
  | "premature_closure"
  | "unsafe_prioritization"
  | "delayed_escalation"
  | "task_before_assessment"
  | "monitoring_gap"
  | "delegation_risk"
  | "hesitant_intervention"
  | "sata_partial_reasoning"
  | "medication_safety_gap"
  | "lifespan_context_gap";

export type RemediationStepKind =
  | "mechanism"
  | "lesson"
  | "flashcards"
  | "drill"
  | "readiness_reassessment"
  | "simulation";

export type QuestionTimingSignal = {
  questionId: string;
  dwellMs?: number;
  rereads?: number;
  answerChanges?: number;
  confidence?: "low" | "medium" | "high";
  isCorrect: boolean;
  topic?: string | null;
};

export type LearnerCompetencyTrend = {
  topic: string;
  momentum: "improving" | "stable" | "declining";
  sessionCount: number;
  narrative: string;
  persistentWeak: boolean;
  recurringTimingIssue: boolean;
};

export type CompetencyGraphStep = {
  depth: number;
  kind: RemediationStepKind;
  title: string;
  reason: string;
  href: string;
};

export type CoachingRecommendation = {
  priority: number;
  title: string;
  reason: string;
  href: string;
  kind: RemediationStepKind | "cat" | "review";
  graphStep?: CompetencyGraphStep;
  exposureKey: string;
};

export type PostExamDashboardFeed = {
  generatedAt: string;
  pathwayId: string | null;
  coachingModel: CoachingModel;
  topWeakTopic: string | null;
  readinessScore: number;
  readinessReliability: ReadinessReliability;
  headline: string;
  primaryHref: string;
  weakTopics: string[];
  reassessmentPrompt: string | null;
};

export type PostExamCoachingContext = {
  topicTrends: LearnerCompetencyTrend[];
  persistentWeakTopics: string[];
  recentSessionCount: number;
};

export type CoachingSemanticsCopy = {
  examModeLabel: string;
  readinessLabel: string;
  passOutlookLabel: string;
  competencySectionTitle: string;
  timingSectionTitle: string;
  forbidAdaptiveWording: boolean;
};

export type StructuredClinicalInsight = {
  pattern: ClinicalJudgmentPattern;
  patternLabel: string;
  domain: string;
  guidance: string;
  emphasis: "strength" | "focus";
};

export type TimingIntelligenceResult = {
  elapsedLabel: string;
  avgSecPerQuestion: number | null;
  pacingLabel: string;
  pacingDetail: string;
  recommendations: string[];
  signals: QuestionTimingSignal[];
  hesitationClusterTopics: string[];
  rapidGuessTopics: string[];
};

export type ReadinessReliabilityAssessment = {
  level: ReadinessReliability;
  factors: string[];
  softenPredictions: boolean;
  guidance: string;
};

export type PostExamCoachingReport = {
  coachingModel: CoachingModel;
  semantics: CoachingSemanticsCopy;
  readinessReliability: ReadinessReliabilityAssessment;
  readinessBand: ReadinessBand;
  longitudinal: PostExamCoachingContext;
  longitudinalNarratives: string[];
  timing: TimingIntelligenceResult;
  clinicalJudgment: StructuredClinicalInsight[];
  recommendations: CoachingRecommendation[];
  dashboardFeed: PostExamDashboardFeed;
  /** Present when built via rn-coaching-intelligence orchestration. */
  timingV2?: import("@/lib/learner/rn-coaching-intelligence/coaching-types").TimingIntelligenceV2Result;
  certaintyTier?: import("@/lib/learner/rn-coaching-intelligence/coaching-types").CoachingCertaintyTier;
  learnerState?: import("@/lib/learner/rn-coaching-intelligence/learner-state-types").RnLearnerStateSnapshot;
};
