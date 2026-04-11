/**
 * SRS Scheduler — Spaced Repetition Review Scheduling Engine
 *
 * Pure TypeScript (no DB, no side effects). Takes raw question attempt records,
 * aggregates per-question history, computes a deterministic urgency score, and
 * returns a prioritized review queue.
 *
 * Scheduling rules (Section 4 of spec):
 *   Base score:
 *     incorrect + high confidence   → 100  (overconfidence — highest urgency)
 *     incorrect + medium confidence → 80
 *     incorrect + low/null conf     → 65
 *     correct   + low/null conf     → 50   (uncertain knowledge)
 *     correct   + medium confidence → 28
 *     correct   + high confidence   → 8    (stable — lowest urgency)
 *
 *   Time multiplier (longer gap → higher urgency):
 *     > 14 days: ×1.8
 *     > 7 days:  ×1.5
 *     > 3 days:  ×1.2
 *     > 1 day:   ×1.05
 *     ≤ 1 day:   ×0.85  (reviewed today — reduce urgency)
 *
 *   Repeated miss bonus (floor accumulates on the base):
 *     ≥ 3 incorrect: +30
 *     ≥ 2 incorrect: +15
 *
 *   Priority thresholds (score ∈ [0, 150]):
 *     ≥ 70  → "due_now"      (Due Now section)
 *     ≥ 35  → "review_soon"  (Review Soon section)
 *     < 35  → "stable"       (Stable / Lower Priority section)
 */

export type SrsConfidenceLevel = "high" | "medium" | "low" | null;

// ── Raw attempt record (one row per question × session) ─────────────────────

export interface QuestionAttemptRecord {
  /** Stable question identifier (from results JSON). */
  questionId: string;
  /** Question stem text (may be partial). */
  stem: string | null;
  topic: string | null;
  rationale: string | null;
  isCorrect: boolean;
  confidence: SrsConfidenceLevel;
  /** When this attempt was submitted. */
  attemptedAt: Date;
  /** ExamAttempt.id — used for session-level tracking only. */
  sessionId: string;
}

// ── Aggregated per-question data ─────────────────────────────────────────────

export interface AggregatedQuestion {
  questionId: string;
  stem: string | null;
  topic: string | null;
  rationale: string | null;
  totalAttempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  /** Most recent attempt — drives the primary scheduling decision. */
  lastAttempt: QuestionAttemptRecord;
  allAttempts: QuestionAttemptRecord[];
}

// ── Prioritized, scored output ────────────────────────────────────────────────

export type ReviewPriority = "due_now" | "review_soon" | "stable";

/**
 * Human-readable mode label for the last attempt pattern.
 * Used by UI to drive "start a focused session" filtering.
 */
export type ReviewModeLabel =
  | "Overconfidence"   // wrong + high confidence
  | "Needs Review"     // wrong + other confidence
  | "Uncertain"        // correct + low/null confidence
  | "Stable";          // correct + high confidence

export interface ScoredReviewItem extends AggregatedQuestion {
  urgencyScore: number;       // 0–150 — higher = more urgent
  priority: ReviewPriority;
  dueLabel: string;           // e.g. "Overdue — 3 days", "Due today"
  daysSinceLastReview: number;
  modeLabel: ReviewModeLabel;
}

// ── Summary for the hero section ─────────────────────────────────────────────

export interface ReviewQueueSummary {
  dueNowCount: number;
  reviewSoonCount: number;
  stableCount: number;
  total: number;
  overconfidenceCount: number; // wrong + high conf (highest urgency type)
  uncertainCount: number;      // correct + low conf (reinforce)
}

// ── Scheduling constants ──────────────────────────────────────────────────────

const DUE_NOW_MIN = 70;
const REVIEW_SOON_MIN = 35;

// ── Core scoring function ─────────────────────────────────────────────────────

export function computeUrgencyScore(
  agg: AggregatedQuestion,
  now: Date = new Date(),
): number {
  const { isCorrect, confidence } = agg.lastAttempt;
  const daysSince =
    (now.getTime() - agg.lastAttempt.attemptedAt.getTime()) /
    (1000 * 60 * 60 * 24);

  // Base score from correctness × confidence matrix
  let base: number;
  if (!isCorrect && confidence === "high")    base = 100;
  else if (!isCorrect && confidence === "medium") base = 80;
  else if (!isCorrect)                        base = 65; // low or null
  else if (isCorrect && confidence === "low") base = 50;
  else if (isCorrect && confidence === null)  base = 45;
  else if (isCorrect && confidence === "medium") base = 28;
  else /* correct + high */                   base = 8;

  // Time multiplier
  let timeMul: number;
  if (daysSince > 14)      timeMul = 1.8;
  else if (daysSince > 7)  timeMul = 1.5;
  else if (daysSince > 3)  timeMul = 1.2;
  else if (daysSince > 1)  timeMul = 1.05;
  else                     timeMul = 0.85; // reviewed today

  // Repeated miss bonus
  const missPenalty =
    agg.incorrectAttempts >= 3 ? 30
    : agg.incorrectAttempts >= 2 ? 15
    : 0;

  return Math.min(Math.round(base * timeMul + missPenalty), 150);
}

function assignPriority(score: number): ReviewPriority {
  if (score >= DUE_NOW_MIN)    return "due_now";
  if (score >= REVIEW_SOON_MIN) return "review_soon";
  return "stable";
}

function deriveModeLabel(lastAttempt: QuestionAttemptRecord): ReviewModeLabel {
  const { isCorrect, confidence } = lastAttempt;
  if (!isCorrect && confidence === "high")                          return "Overconfidence";
  if (!isCorrect)                                                    return "Needs Review";
  if (isCorrect && (confidence === "low" || confidence === null))   return "Uncertain";
  return "Stable";
}

function buildDueLabel(daysSince: number, priority: ReviewPriority): string {
  if (priority === "due_now") {
    if (daysSince < 0.5) return "Due today";
    if (daysSince < 2)   return "Overdue — 1 day";
    if (daysSince < 7)   return `Overdue — ${Math.round(daysSince)} days`;
    return `Overdue — ${Math.round(daysSince / 7)}w`;
  }
  if (priority === "review_soon") {
    if (daysSince < 2)   return "Review soon";
    if (daysSince < 7)   return `${Math.round(daysSince)} days ago`;
    return `${Math.round(daysSince / 7)} week${daysSince > 14 ? "s" : ""} ago`;
  }
  // stable
  if (daysSince < 1)   return "Stable — reviewed today";
  if (daysSince < 7)   return `Stable — ${Math.round(daysSince)}d ago`;
  return `Stable — ${Math.round(daysSince / 7)}w ago`;
}

// ── Aggregation ───────────────────────────────────────────────────────────────

export function aggregateQuestions(
  attempts: QuestionAttemptRecord[],
): Map<string, AggregatedQuestion> {
  const map = new Map<string, AggregatedQuestion>();

  // Process oldest-first so `lastAttempt` ends up as the most recent
  const sorted = [...attempts].sort(
    (a, b) => a.attemptedAt.getTime() - b.attemptedAt.getTime(),
  );

  for (const attempt of sorted) {
    const existing = map.get(attempt.questionId);
    if (!existing) {
      map.set(attempt.questionId, {
        questionId: attempt.questionId,
        stem: attempt.stem,
        topic: attempt.topic,
        rationale: attempt.rationale,
        totalAttempts: 1,
        correctAttempts: attempt.isCorrect ? 1 : 0,
        incorrectAttempts: attempt.isCorrect ? 0 : 1,
        lastAttempt: attempt,
        allAttempts: [attempt],
      });
    } else {
      existing.totalAttempts++;
      if (attempt.isCorrect) existing.correctAttempts++;
      else existing.incorrectAttempts++;
      existing.lastAttempt = attempt; // overwrites with the more recent
      existing.allAttempts.push(attempt);
      // Prefer more recent or non-null metadata
      if (attempt.stem)     existing.stem = attempt.stem;
      if (attempt.topic)    existing.topic = attempt.topic;
      if (attempt.rationale) existing.rationale = attempt.rationale;
    }
  }

  return map;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Build a fully sorted, scored review queue from raw attempt records.
 * Output is sorted by urgencyScore descending — highest urgency first.
 */
export function buildReviewQueue(
  attempts: QuestionAttemptRecord[],
  now: Date = new Date(),
): ScoredReviewItem[] {
  const aggregated = aggregateQuestions(attempts);
  const results: ScoredReviewItem[] = [];

  for (const agg of aggregated.values()) {
    const score = computeUrgencyScore(agg, now);
    const priority = assignPriority(score);
    const daysSince =
      (now.getTime() - agg.lastAttempt.attemptedAt.getTime()) /
      (1000 * 60 * 60 * 24);

    results.push({
      ...agg,
      urgencyScore: score,
      priority,
      dueLabel: buildDueLabel(daysSince, priority),
      daysSinceLastReview: daysSince,
      modeLabel: deriveModeLabel(agg.lastAttempt),
    });
  }

  return results.sort((a, b) => b.urgencyScore - a.urgencyScore);
}

export function buildReviewQueueSummary(
  queue: ScoredReviewItem[],
): ReviewQueueSummary {
  return {
    dueNowCount:     queue.filter((q) => q.priority === "due_now").length,
    reviewSoonCount: queue.filter((q) => q.priority === "review_soon").length,
    stableCount:     queue.filter((q) => q.priority === "stable").length,
    total:           queue.length,
    overconfidenceCount: queue.filter(
      (q) => !q.lastAttempt.isCorrect && q.lastAttempt.confidence === "high",
    ).length,
    uncertainCount: queue.filter(
      (q) =>
        q.lastAttempt.isCorrect &&
        (q.lastAttempt.confidence === "low" ||
          q.lastAttempt.confidence === null),
    ).length,
  };
}

/**
 * Cursor-style pagination for a single priority tier.
 * `page` is 0-based; items within the tier are already sorted by urgency.
 */
export function paginateByPriority(
  queue: ScoredReviewItem[],
  priority: ReviewPriority,
  page: number,
  pageSize: number,
): { items: ScoredReviewItem[]; total: number; hasMore: boolean } {
  const filtered = queue.filter((q) => q.priority === priority);
  const start = page * pageSize;
  const end = start + pageSize;
  return {
    items: filtered.slice(start, end),
    total: filtered.length,
    hasMore: end < filtered.length,
  };
}

/** Filter the full queue to a specific mode (for focused session launch). */
export function filterQueueByMode(
  queue: ScoredReviewItem[],
  mode: ReviewModeLabel,
): ScoredReviewItem[] {
  return queue.filter((q) => q.modeLabel === mode);
}
