/** High-level intent surfaced to learners (drives ordering + future coach UX). */
export type StudyNextMode =
  | "reinforce_weak"
  | "continue_pathway"
  | "continue_body_system"
  | "practice_questions_next"
  | "review_flashcards_next"
  | "mixed_review"
  | "explore";

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
  | "missed_items_review"
  | "continue_same_body_system";

export type StudyNextRecommendationType =
  | "continue_pathway_lesson"
  | "weak_topic_lesson"
  | "weak_topic_qbank"
  | "weak_topic_flashcards"
  | "retest_topic"
  | "missed_review_session"
  | "same_body_system_lesson";

export type StudyNextConfidence = "high" | "medium" | "low";

export type StudyNextRecommendation = {
  type: StudyNextRecommendationType;
  /** Optional UX / analytics hint — derived from type + reason. */
  mode?: StudyNextMode;
  href: string;
  title: string;
  reasonCode: StudyNextReasonCode;
  /** Short, factual line for the dashboard (no random motivational filler). */
  reasonShort: string;
  confidence: StudyNextConfidence;
  /** Weak-topic label when applicable. */
  topicLabel?: string;
};
