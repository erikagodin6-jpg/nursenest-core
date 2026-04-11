"use client";

import type { ConfidenceLevel } from "./confidence-selector";

// ── Types ───────────────────────────────────────────────────────────────────

export interface ConfidenceStats {
  overconfidentErrors: number;
  uncertainCorrect: number;
  strongKnowledge: number;
  totalRated: number;
}

export interface ReviewItem {
  questionNumber: number;
  topic?: string | null;
  confidence: ConfidenceLevel;
  isCorrect: boolean;
}

// ── computeConfidenceStats ───────────────────────────────────────────────────

/**
 * Derives all confidence analytics from the raw maps.
 *
 * @param confidence - Map<questionId, ConfidenceLevel>
 * @param correctness - Map<questionId, boolean> — only committed questions
 * @param questionMeta - Optional per-question metadata (index in session + topic)
 */
export function computeConfidenceStats(
  confidence: Record<string, ConfidenceLevel>,
  correctness: Record<string, boolean>,
  questionMeta?: Record<string, { index: number; topic?: string | null }>,
): {
  stats: ConfidenceStats;
  highConfidenceAccuracy: number | null;
  reviewItems: ReviewItem[];
} {
  let overconfidentErrors = 0;
  let uncertainCorrect = 0;
  let strongKnowledge = 0;
  let highCorrect = 0;
  let highTotal = 0;
  const reviewItems: ReviewItem[] = [];

  for (const [qid, level] of Object.entries(confidence)) {
    const isCorrect = correctness[qid];
    if (isCorrect === undefined) continue; // question was never committed / scored

    const meta = questionMeta?.[qid];
    const questionNumber = meta?.index != null ? meta.index + 1 : reviewItems.length + 1;
    const topic = meta?.topic ?? null;

    if (level === "high") {
      highTotal++;
      if (isCorrect) highCorrect++;
    }

    if (level === "high" && !isCorrect) overconfidentErrors++;
    if (level === "low" && isCorrect) uncertainCorrect++;
    if (level === "high" && isCorrect) strongKnowledge++;

    reviewItems.push({ questionNumber, confidence: level, isCorrect, topic });
  }

  // Sort by question number so groups appear in order
  reviewItems.sort((a, b) => a.questionNumber - b.questionNumber);

  const highConfidenceAccuracy = highTotal > 0 ? highCorrect / highTotal : null;

  return {
    stats: {
      overconfidentErrors,
      uncertainCorrect,
      strongKnowledge,
      totalRated: reviewItems.length,
    },
    highConfidenceAccuracy,
    reviewItems,
  };
}

// ── ConfidenceSummaryStrip ───────────────────────────────────────────────────

/**
 * ConfidenceSummaryStrip — compact visual anchor above the analytics section.
 *
 * Uses `surface-emphasis` (spec §8) — a branded, non-aggressive tint.
 * Hidden when no high-confidence data is available.
 */
export function ConfidenceSummaryStrip({
  highConfidenceAccuracy,
}: {
  highConfidenceAccuracy: number | null;
}) {
  if (highConfidenceAccuracy === null) return null;
  const pct = Math.round(highConfidenceAccuracy * 100);
  return (
    <div className="nn-confidence-strip">
      High-confidence answers were correct <strong>{pct}%</strong> of the time
    </div>
  );
}

// ── ConfidencePatternCards ───────────────────────────────────────────────────

/**
 * ConfidencePatternCards — 3-card summary using multi-surface palette (spec §7).
 *
 * Card 1 → soft warning  (overconfident errors)
 * Card 2 → soft info     (uncertain correct)
 * Card 3 → soft success  (strong knowledge)
 */
export function ConfidencePatternCards({ stats }: { stats: ConfidenceStats }) {
  return (
    <div className="nn-confidence-pattern-grid">
      <div className="nn-confidence-pattern-card nn-confidence-pattern-card--warning">
        <p className="nn-confidence-pattern-card__label">Overconfident Errors</p>
        <p className="nn-confidence-pattern-card__value">{stats.overconfidentErrors}</p>
        <p className="nn-confidence-pattern-card__desc">
          Answered incorrectly despite high confidence — review these first to
          correct faulty assumptions.
        </p>
      </div>
      <div className="nn-confidence-pattern-card nn-confidence-pattern-card--info">
        <p className="nn-confidence-pattern-card__label">Uncertain Correct</p>
        <p className="nn-confidence-pattern-card__value">{stats.uncertainCorrect}</p>
        <p className="nn-confidence-pattern-card__desc">
          Got it right but weren't sure — reinforce these areas to convert
          guesses into reliable recall.
        </p>
      </div>
      <div className="nn-confidence-pattern-card nn-confidence-pattern-card--success">
        <p className="nn-confidence-pattern-card__label">Strong Knowledge</p>
        <p className="nn-confidence-pattern-card__value">{stats.strongKnowledge}</p>
        <p className="nn-confidence-pattern-card__desc">
          Correct with high confidence — these areas are stable and ready for
          exam conditions.
        </p>
      </div>
    </div>
  );
}

// ── ReviewPriorityGroups ─────────────────────────────────────────────────────

function ReviewItemList({
  items,
  emptyMessage,
}: {
  items: ReviewItem[];
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return <p className="nn-review-priority-group__empty">{emptyMessage}</p>;
  }
  const visible = items.slice(0, 6);
  const overflow = items.length - visible.length;
  return (
    <div className="nn-review-priority-group__items">
      {visible.map((item) => (
        <p
          key={`${item.questionNumber}-${item.confidence}`}
          className="nn-review-priority-group__item"
        >
          <span className="font-semibold">Q{item.questionNumber}</span>
          {item.topic ? ` · ${item.topic}` : ""}
          <span className="ml-2">
            <span className="nn-confidence-chip">{item.confidence}</span>
          </span>
        </p>
      ))}
      {overflow > 0 ? (
        <p className="nn-review-priority-group__empty">+{overflow} more</p>
      ) : null}
    </div>
  );
}

/**
 * ReviewPriorityGroups — three grouped rows by review urgency (spec §9).
 *
 * Group 1 (high priority) → soft danger surface
 * Group 2 (needs review)  → soft warning surface
 * Group 3 (stable)        → soft success surface
 */
export function ReviewPriorityGroups({ items }: { items: ReviewItem[] }) {
  const highPriority = items.filter(
    (i) => !i.isCorrect && i.confidence === "high",
  );
  const needsReview = items.filter(
    (i) =>
      (!i.isCorrect && (i.confidence === "low" || i.confidence === "medium")) ||
      (i.isCorrect && i.confidence === "low"),
  );
  const stable = items.filter((i) => i.isCorrect && i.confidence === "high");

  return (
    <div className="nn-review-priority-groups">
      <div className="nn-review-priority-group nn-review-priority-group--high">
        <p className="nn-review-priority-group__label">Highest Priority</p>
        <p className="nn-review-priority-group__title">
          Incorrect + High Confidence
        </p>
        <ReviewItemList
          items={highPriority}
          emptyMessage="No overconfident errors — excellent calibration."
        />
      </div>

      <div className="nn-review-priority-group nn-review-priority-group--medium">
        <p className="nn-review-priority-group__label">Needs Review</p>
        <p className="nn-review-priority-group__title">
          Incorrect or Uncertain
        </p>
        <ReviewItemList
          items={needsReview}
          emptyMessage="No items requiring focused review."
        />
      </div>

      <div className="nn-review-priority-group nn-review-priority-group--stable">
        <p className="nn-review-priority-group__label">Stable Areas</p>
        <p className="nn-review-priority-group__title">
          Correct + High Confidence
        </p>
        <ReviewItemList
          items={stable}
          emptyMessage="Keep practicing to reach high-confidence mastery."
        />
      </div>
    </div>
  );
}

// ── ConfidenceAnalyticsBlock ─────────────────────────────────────────────────

/**
 * ConfidenceAnalyticsBlock — the full confidence section for the results page.
 *
 * Renders only when meaningful confidence data exists (at least one rated
 * question with a known correctness outcome).
 */
export function ConfidenceAnalyticsBlock({
  confidence,
  correctness,
  questionMeta,
}: {
  confidence: Record<string, ConfidenceLevel>;
  correctness: Record<string, boolean>;
  questionMeta?: Record<string, { index: number; topic?: string | null }>;
}) {
  const { stats, highConfidenceAccuracy, reviewItems } = computeConfidenceStats(
    confidence,
    correctness,
    questionMeta,
  );

  if (stats.totalRated === 0) return null;

  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <ConfidenceSummaryStrip highConfidenceAccuracy={highConfidenceAccuracy} />

      {/* Pattern cards */}
      <div>
        <p className="nn-confidence-section-title">Confidence Patterns</p>
        <ConfidencePatternCards stats={stats} />
      </div>

      {/* Review priority */}
      <div>
        <p className="nn-confidence-section-title">Where to Focus Next</p>
        <ReviewPriorityGroups items={reviewItems} />
      </div>
    </div>
  );
}
