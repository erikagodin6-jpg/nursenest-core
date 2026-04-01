/**
 * Central insight types — normalized, safe with missing fields.
 * Reuses domain rows where they already exist; extends only for interpretation.
 */

import type { ReadinessResult } from "@/lib/learner/readiness-score";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

/** Finer than TopicStrength for prioritization and copy. */
export type WeaknessTier = "strong" | "moderate" | "weak" | "critical";

export type TopicAccuracyRow = {
  topic: string;
  /** Subtopics require per-question joins; optional until populated. */
  subtopic: string | null;
  correct: number;
  attempted: number;
  accuracyPct: number | null;
  /** Recency-weighted accuracy 0–1 when enough data. */
  weightedAccuracy: number | null;
};

export type PerformanceTrend = "improving" | "declining" | "stable" | "unknown";

export type ConsistencyLabel = "tight" | "moderate" | "volatile" | "unknown";

export type PerformanceAnalysis = {
  overallAccuracyPct: number | null;
  /** Recent sessions weighted more heavily. */
  recencyWeightedAccuracyPct: number | null;
  byTopic: TopicAccuracyRow[];
  mockTrend: PerformanceTrend;
  /** From spread of mock percentages when 2+ mocks. */
  mockConsistency: ConsistencyLabel;
  /** Plain-language interpretation — no false precision. */
  trendSummary: string;
};

export type WeakAreaInsight = WeakTopicRow & {
  tier: WeaknessTier;
  /** Risk of repeated exam-style misses if unaddressed. */
  risk: "high" | "medium" | "low";
  why: string;
};

export type KnowledgeGap = {
  kind: "never_practiced" | "under_practiced" | "poor_retention" | "repeated_failure";
  topic: string;
  detail: string;
  /** What to do — links resolved at surface layer. */
  suggestedAction: string;
};

export type ExplainableAction = {
  title: string;
  href: string;
  kind: "lesson" | "quiz" | "mock" | "cat" | "review" | "continue" | "settings" | "exams" | "flashcards" | "planner";
  /** WHY this surfaced. */
  why: string;
  /** WHAT to do (one line). */
  what: string;
  /** HOW it helps readiness / retention. */
  how: string;
};

export type RecommendationBundle = {
  primary: ExplainableAction;
  secondary: ExplainableAction[];
};

export type CatInsightSummary = {
  hasData: boolean;
  /** Last adaptive run — practice only. */
  theta: number | null;
  se: number | null;
  line: string | null;
};

export type FlashcardInsight = {
  cardsReviewedTotal: number;
  lastStudyDate: string | null;
  currentStreak: number;
  line: string;
};

export type DailyAdaptivePlan = {
  /** Short list for “today”. */
  todayTasks: { label: string; href: string; reason: string }[];
  /** Week-level bullets. */
  weeklyPriorities: string[];
};

export type LearnerInsightSnapshot = {
  generatedAt: string;
  performance: PerformanceAnalysis;
  weakAreas: WeakAreaInsight[];
  knowledgeGaps: KnowledgeGap[];
  readiness: ReadinessResult;
  recommendations: RecommendationBundle;
  dailyPlan: DailyAdaptivePlan;
  cat: CatInsightSummary;
  flashcards: FlashcardInsight;
  /** Re-export for surfaces that need trends without re-fetching. */
  topicTrends: TopicTrendRow[];
};

export type InsightEngineInput = {
  userId: string;
  readiness: ReadinessResult;
  weakTopics: WeakTopicRow[];
  strongTopics: WeakTopicRow[];
  topicTrends: TopicTrendRow[];
  sessionGrading: { correct: number; total: number; sessionCount: number };
  recencyWeighted: { correct: number; total: number } | null;
  recentMocks: { score: number; total: number; at: string }[];
  lessonsCompleted: number;
  lessonsAvailable: number;
  recommendedQuizTopic: string | null;
  continueLesson: { title: string; href: string } | null;
  streakDays: number;
  mockCount: number;
  practiceSessionCount: number;
  examDate: Date | null;
  examDatePlanType: import("@prisma/client").ExamDatePlanType | null;
  /** From buildAdaptiveRecommendations — we enrich with explainability. */
  adaptiveBase: import("@/lib/learner/adaptive-recommendations").AdaptiveLearnerRecommendations;
  cat: CatInsightSummary;
  flashcards: FlashcardInsight;
};
