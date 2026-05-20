import type { RoleTrackSlug } from "@/lib/exam-pathways/types";
import type { PathwayLessonLinkedLearningSignals } from "@/lib/lessons/pathway-lesson-types";

/** Study surfaces the recommendation engine may reference (caller enforces entitlements). */
export type AdaptiveStudySurface = "lesson" | "flashcards" | "question_bank" | "cat_practice";

export type AdaptiveMissTrigger = "cat_miss" | "practice_miss" | "flashcard_struggle";

/**
 * Caller-supplied weakness signal per topic (or synthetic “system” keys).
 * No DB reads — values must be aggregated server-side before invoking the engine.
 */
export type TopicWeaknessSignalInput = {
  topicKey: string;
  missCount: number;
  lastAttemptMs?: number;
  /** 0–1 optional estimate; high values deprioritize the topic (avoid mastered churn). */
  masteryEstimate?: number;
};

export type AdaptiveRecommendationContext = {
  pathwayId: string;
  roleTrack: RoleTrackSlug;
  linkedLearning: PathwayLessonLinkedLearningSignals | null;
  weakTopicSignals: TopicWeaknessSignalInput[];
  nowMs: number;
};

/** Minimal lesson row for ranking — reuse pathway lesson fields only. */
export type LessonRecommendationCandidate = {
  slug: string;
  title: string;
  topicSlug?: string;
  bodySystem?: string;
  linkedLearningSignals?: PathwayLessonLinkedLearningSignals | null;
};

export type RankedWeakTopic = TopicWeaknessSignalInput & {
  /** Deterministic composite score (higher = more urgent). */
  urgencyScore: number;
};

export type LessonStudyRecommendation = {
  slug: string;
  title: string;
  topicKey: string;
  reason: "weak_topic_match";
};

export type FlashcardStudyRecommendation = {
  topicKey: string;
  /** False when linked-learning says flashcards are not wired for this topic/pathway. */
  allowed: boolean;
  reason: "linked_surface_available" | "linked_surface_blocked";
};

export type PracticeCatCategoryHint = {
  topicKeys: readonly string[];
  /** True when pathway allows practice-test / CAT pool surface (see linked-learning assets). */
  catPoolSurfaceAvailable: boolean;
  /** Study-mode CAT is a UX hint only — server policy unchanged. */
  suggestStudyModeReview: boolean;
};

export type AdaptiveRecommendationBundle = {
  rankedWeakTopics: RankedWeakTopic[];
  lessons: LessonStudyRecommendation[];
  flashcards: FlashcardStudyRecommendation[];
  practiceCat: PracticeCatCategoryHint;
  /** When true, caller should show generic “continue studying” copy only. */
  usedEmptyFallback: boolean;
  fallbackReason?: "no_weak_signals" | "all_topics_mastered" | "no_lesson_candidates";
};

export type PostMissOrchestrationInput = {
  trigger: AdaptiveMissTrigger;
  pathwayId: string;
  roleTrack: RoleTrackSlug;
  /** Pre-computed linked-learning for the anchor lesson/topic (optional). */
  linkedLearning: PathwayLessonLinkedLearningSignals | null;
  weakTopicSignals: TopicWeaknessSignalInput[];
  lessonCandidates: LessonRecommendationCandidate[];
  nowMs: number;
};

export type PostMissOrchestrationResult = {
  trigger: AdaptiveMissTrigger;
  recommendations: AdaptiveRecommendationBundle;
  /** Cross-surface CTA ordering — deterministic. */
  suggestedSurfaceOrder: AdaptiveStudySurface[];
};
