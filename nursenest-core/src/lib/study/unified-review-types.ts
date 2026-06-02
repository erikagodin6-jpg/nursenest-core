/**
 * Unified Review Engine — Shared Types
 *
 * Central type definitions for the multi-source spaced repetition review engine.
 * Sources: exam-question attempts (heuristic SRS), flashcard SM-2 intervals, topic
 * weak-area signals from UserTopicStat.
 *
 * Priority tiers (highest urgency first):
 *   overdue    — flashcard nextReviewAt past, or question urgency ≥ 100
 *   due_today  — flashcard due within UTC today, or question urgency 70–99
 *   high_risk  — topic with wrong streak ≥ 2 or high decay signal (no direct due date)
 *   due_soon   — question urgency 35–69 (review_soon tier); flashcard due < 7 days
 *   stable     — question urgency < 35; flashcard repetitions ≥ 3, not yet due
 */

import type { ScoredReviewItem } from "@/lib/study/srs-scheduler";

// ── Source kinds ──────────────────────────────────────────────────────────────

export type ReviewSourceKind = "question" | "flashcard" | "topic";

// ── Priority tiers ────────────────────────────────────────────────────────────

export type ReviewPriorityTier =
  | "overdue"
  | "due_today"
  | "high_risk"
  | "due_soon"
  | "stable";

// ── Per-source data ───────────────────────────────────────────────────────────

export interface QuestionReviewData {
  questionItem: ScoredReviewItem;
}

export interface FlashcardDeckReviewData {
  deckId: string;
  deckName: string;
  /** Cards already past their SM-2 due date (nextReviewAt < today start). */
  overdueCount: number;
  /** Cards due within UTC today (nextReviewAt in today's window). */
  dueTodayCount: number;
  /** Total due or overdue across any future window ≤ 7 days. */
  dueSoonCount: number;
  /** Average ease factor across all progressed cards in this deck. */
  avgEaseFactor: number;
  /** How many cards in this deck have been studied at least once. */
  progressedCount: number;
  /** Href to launch SM-2 review for this deck. */
  reviewHref: string;
}

export interface TopicReviewData {
  /** Normalised topic key (display label). */
  topic: string;
  bodySystem: string | null;
  missRate: number;       // 0–100
  wrongStreak: number;
  wrongCount: number;
  correctCount: number;
  /** ISO string | null */
  lastWrongAt: string | null;
  /** Decay-adjusted priority score (from computeWeakPriorityScore). */
  weakPriorityScore: number;
  /** Decay-adjusted wrong signal. */
  decayAdjustedWrongSignal: number;
}

// ── Unified item ──────────────────────────────────────────────────────────────

export interface UnifiedReviewItem {
  /** Stable React key — source-prefixed: "q:{questionId}", "fc:{deckId}", "t:{topic}". */
  id: string;
  kind: ReviewSourceKind;
  tier: ReviewPriorityTier;
  /** Normalised 0–150 urgency; higher = more urgent. */
  urgencyScore: number;
  /**
   * Human-readable timing label.
   * Examples: "Overdue — 3 days", "Due today", "Due in 2 days", "2 days ago", "Stable"
   */
  dueLabel: string;
  /** Primary display title (stem preview, deck name, or topic name). */
  title: string;
  /** Secondary context (topic name, deck description, body system, etc.). */
  subtitle: string | null;
  topic: string | null;
  bodySystem: string | null;
  /** Quick-drill link (question bank preset, flashcard deck, topic drill). */
  drillHref: string;
  lessonHref: string | null;
  // Source-specific payloads — only the relevant one is set
  questionData?: QuestionReviewData;
  flashcardData?: FlashcardDeckReviewData;
  topicData?: TopicReviewData;
}

// ── Summary ───────────────────────────────────────────────────────────────────

export interface UnifiedReviewSummary {
  /** Items past their scheduled review date (flashcard SM-2 or question urgency ≥ 100). */
  overdueCount: number;
  /** Items due within today. */
  dueTodayCount: number;
  /** Items due within the next 7 days (review_soon + due_soon flashcards). */
  dueSoonCount: number;
  /** Topics with structural weakness signals (high wrong streak / decay). */
  highRiskCount: number;
  /** Items well-retained and stable. */
  stableCount: number;
  /** Total items across all sources. */
  totalItems: number;
  /** Distinct metric: flashcard decks with any due cards (from SM-2). */
  flashcardDecksWithDue: number;
  /** Distinct metric: topics classified as high-risk. */
  topicsAtRisk: number;
  /** Brief motivating message for the hero section. */
  summaryMessage: string;
}

// ── Full data payload ─────────────────────────────────────────────────────────

export interface UnifiedReviewData {
  summary: UnifiedReviewSummary;
  /** Overdue items, urgency-sorted (most urgent first). */
  overdue: UnifiedReviewItem[];
  /** Due today, urgency-sorted. */
  dueToday: UnifiedReviewItem[];
  /** High-risk concept/topic items (structural weakness, not time-gated). */
  highRisk: UnifiedReviewItem[];
  /** Upcoming items due within 7 days. */
  dueSoon: UnifiedReviewItem[];
  /** Stable / well-retained items for encouragement. */
  stable: UnifiedReviewItem[];
}
