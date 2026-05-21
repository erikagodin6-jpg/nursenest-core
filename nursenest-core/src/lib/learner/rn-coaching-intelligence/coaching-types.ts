/** Shared coaching intelligence types (RN competency-state engine). */

export type ReadinessBand = "not_ready" | "building" | "approaching" | "exam_ready";

export type CoachingModel = "cat_adaptive" | "loft_readiness" | "linear_practice";

export type CoachingSessionKind = "cat" | "practice_exam" | "loft_simulation" | "readiness_assessment" | "timed_assessment";

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
  questionType?: string | null;
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
  readinessMomentum?: number;
  pacingProfile?: string;
  hesitationProfile?: string;
  weaknessClusters?: string[];
  studyMomentumLine?: string | null;
  nextBestActionTitle?: string | null;
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

export type TimingCognitiveProfile = {
  fatigueDetected: boolean;
  lateSessionAccuracyDrop: boolean;
  sataHesitation: boolean;
  matrixHesitation: boolean;
  answerChangeRisk: boolean;
  confidenceInstability: number;
  exhibitOverloadSuspected: boolean;
};

export type TimingIntelligenceV2Result = TimingIntelligenceResult & {
  cognitive: TimingCognitiveProfile;
  coachingNarratives: string[];
};

export type ReadinessReliabilityAssessment = {
  level: ReadinessReliability;
  factors: string[];
  softenPredictions: boolean;
  guidance: string;
};

export type CoachingCertaintyTier = "observation" | "directional" | "stable";

export type RnCoachingIntelligenceReport = {
  coachingModel: CoachingModel;
  semantics: CoachingSemanticsCopy;
  readinessReliability: ReadinessReliabilityAssessment;
  certaintyTier: CoachingCertaintyTier;
  readinessBand: ReadinessBand;
  longitudinal: PostExamCoachingContext;
  longitudinalNarratives: string[];
  timing: TimingIntelligenceResult;
  timingV2: TimingIntelligenceV2Result;
  clinicalJudgment: StructuredClinicalInsight[];
  recommendations: CoachingRecommendation[];
  dashboardFeed: PostExamDashboardFeed;
  learnerState: import("@/lib/learner/rn-coaching-intelligence/learner-state-types").RnLearnerStateSnapshot;
};

export type QuestionOutcome = {
  questionId: string;
  isCorrect: boolean;
  questionType?: string | null;
  topic?: string | null;
};
