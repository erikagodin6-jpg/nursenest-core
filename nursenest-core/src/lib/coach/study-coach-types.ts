/**
 * Study Coach domain types.
 * Structured guidance only: no chat transcript model, no freeform memory.
 */

export type CoachIntent =
  | "explain_simply"
  | "why_wrong"
  | "what_next"
  | "weak_summary"
  | "topic_review"
  | "quick_plan"
  | "quiz_concept"
  | "intervention_alert"
  | "readiness_explain"
  | "study_priority_ranked"
  | "pattern_insight";

export type CoachSurface = "dashboard" | "review" | "lesson" | "report_card" | "questions";

export interface CoachActionDefinition {
  intent: CoachIntent;
  label: string;
  description: string;
}

/** Request context from embedded surfaces (bounded, no free text beyond content fields). */
export interface CoachContext {
  content?: string;
  topic?: string;
  subtopic?: string;
  wasCorrect?: boolean;
  rationale?: string;
  weakTopics?: string[];
  examTarget?: string;
  daysUntilExam?: number;
}

export interface CoachFollowUpAction {
  label: string;
  intent: CoachIntent;
}

export interface CoachSection {
  heading: string;
  body: string;
}

export interface CoachResponsePayload {
  intent: CoachIntent;
  title: string;
  content: string;
  sections?: CoachSection[];
  followUp?: CoachFollowUpAction[];
  /** True when the response was assembled without a language model. */
  deterministic?: boolean;
}

/** Alias for legacy imports. */
export type CoachResponse = CoachResponsePayload;

export interface CoachRequest {
  intent: CoachIntent;
  context: CoachContext;
}

export type ReadinessBand = "at_risk" | "borderline" | "passing_range" | "strong";

export interface ReadinessFactor {
  key: string;
  label: string;
  impact: "positive" | "negative" | "neutral";
  summary: string;
  value?: number | string;
}

export interface ReadinessScore {
  score: number;
  band: ReadinessBand;
  factors: ReadinessFactor[];
  confidence: "low" | "moderate" | "high";
}

export type CoachInterventionSeverity = "info" | "watch" | "action";

export interface CoachIntervention {
  id: string;
  type: string;
  severity: CoachInterventionSeverity;
  title: string;
  message: string;
  recommendedAction: CoachFollowUpAction | null;
  surface: CoachSurface;
  /** Stable key for suppressing repeats in UI or client storage. */
  dedupeKey: string;
}

export interface WeaknessPriority {
  topicSlug: string;
  label: string;
  priorityScore: number;
  reasons: string[];
  suggestedActions: string[];
}

export interface LearnerPatternSnapshot {
  repeatedWeakTopics: string[];
  improvingTopics: string[];
  timingPatterns: string[];
  confidencePatterns: string[];
  reviewHabits: string[];
  summarySignals: string[];
}

export interface QuickStudyPlanStep {
  minutes: number;
  action: string;
  detail: string;
}

export interface QuickStudyPlan {
  title: string;
  steps: QuickStudyPlanStep[];
  totalMinutes: number;
}

/**
 * Normalized inputs for coach engines.
 * All fields are optional where underlying data may be missing.
 */
export interface CoachContextInput {
  recentAccuracyPct: number | null;
  weakTopicCount: number;
  weakTopics: Array<{
    topic: string;
    topicSlug: string;
    missRate: number;
    attempted: number;
    wrongStreak?: number;
  }>;
  topicsImproving: string[];
  topicsDeclining: string[];
  recentSessionsSample: number;
  mockExamAvgPct: number | null;
  catOrPracticeAvgPct: number | null;
  reviewCompletionRate: number | null;
  daysSinceLastActivity: number | null;
  difficultyGapScore: number | null;
  /** When the app already computed a readiness score (0 to 100). */
  appReadinessScore: number | null;
  /** Practice trend from existing readiness subsystem when available. */
  practiceTrend: "improving" | "stable" | "declining" | null;
  lessonsCompletedRatio: number | null;
}

/** Serializable slice of the coach dashboard bundle for learner UI props. */
export type CoachDashboardSummary = {
  readiness: ReadinessScore;
  priorities: WeaknessPriority[];
  patterns: LearnerPatternSnapshot;
  topIntervention: CoachIntervention | null;
};
