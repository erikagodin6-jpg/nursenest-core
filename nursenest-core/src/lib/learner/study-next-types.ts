/** Explainable codes for dashboard “Study next” (deterministic copy mapping in UI/engine). */
export type StudyNextReasonCode =
  | "continue_path_started"
  | "pathway_progress_stalled"
  | "weak_topic_high_confidence"
  | "weak_topic_recent_miss"
  | "weak_topic_low_confidence"
  | "review_due"
  | "practice_retest_weak_pool"
  | "insufficient_signals_mixed_bank"
  | "missed_items_review";

export type StudyNextRecommendationType =
  | "continue_pathway_lesson"
  | "weak_topic_lesson"
  | "weak_topic_qbank"
  | "weak_topic_flashcards"
  | "retest_topic"
  | "missed_review_session";

export type StudyNextConfidence = "high" | "medium" | "low";

export type StudyNextRecommendation = {
  type: StudyNextRecommendationType;
  href: string;
  title: string;
  reasonCode: StudyNextReasonCode;
  /** Short, factual line for the dashboard (no random motivational filler). */
  reasonShort: string;
  confidence: StudyNextConfidence;
  /** Weak-topic label when applicable. */
  topicLabel?: string;
};
