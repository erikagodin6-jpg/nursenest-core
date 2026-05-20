/**
 * Multi-dimensional remediation priority scoring.
 *
 * Replaces the flat formula in record-remediation.ts with a structured breakdown
 * that accounts for: recency, confidence mismatch, lapse frequency, dwell time,
 * SATA partial failures, and prescribing-safety / danger-level escalations.
 *
 * All inputs are plain data — no DB calls. Callers aggregate signals before calling.
 */

import { isPrescribingSafetyTopic, topicDangerLevel } from "@/lib/remediation/topic-taxonomy";

export type RemediationScoringInput = {
  /** Miss events in the last 24 h for this pathway+topic+bodySystem. */
  recent24h: number;
  /** Miss events in the last 7 days for this topic. */
  recentWeek7d: number;
  /** CAT adaptive difficulty hint (higher = harder item missed). */
  catDifficultyHint?: number | null;

  /** Existing mistake count BEFORE this event (post-increment happens in score). */
  priorMistakeCount: number;

  /** Learner-declared confidence at time of miss. */
  confidence: "low" | "medium" | "high" | null;

  /** SRS lapse count for the matched flashcard topic (0 when unknown). */
  lapseCount?: number;

  /** Time the learner spent on the question before submitting (ms). */
  dwellTimeMs?: number;

  /** True when the question is a SATA (Select All That Apply) item. */
  isSata?: boolean;
  /**
   * True when the learner selected SOME but not all correct SATA options.
   * Partial understanding is more dangerous than a full miss — the learner
   * may believe they are correct.
   */
  sataPartialCredit?: boolean;

  /** Raw topic string — used for taxonomy lookup. */
  topic: string | null;

  /**
   * Override: caller explicitly signals this is a prescribing-safety miss
   * (e.g. grading code detects controlled-substance or dosing category).
   */
  prescribingSafetyMissOverride?: boolean;
};

export type RemediationScoreBreakdown = {
  /** Sum of all component scores. */
  total: number;
  recency: number;
  confidenceMismatch: number;
  lapseFrequency: number;
  dwellTime: number;
  sataPartial: number;
  /** Safety/danger escalation (prescribing-safety or critical topic). */
  safetyPenalty: number;
  /** Accumulated mistake count contribution. */
  chronicAccumulation: number;
};

/**
 * Compute multi-dimensional remediation priority score.
 *
 * Higher total = more urgent to resurface to the learner.
 * Components are additive so callers can log breakdowns for analytics.
 */
export function computeRemediationScore(input: RemediationScoringInput): RemediationScoreBreakdown {
  // ── Recency ───────────────────────────────────────────────────────────────
  const catBoost = Number.isFinite(input.catDifficultyHint ?? NaN)
    ? Number(input.catDifficultyHint) * 3
    : 0;
  const recency = 10 + input.recent24h * 5 + input.recentWeek7d * 2 + catBoost;

  // ── Confidence mismatch ───────────────────────────────────────────────────
  // High-confidence wrong answers are the most dangerous: learner doesn't know
  // what they don't know. Surface these aggressively.
  let confidenceMismatch = 0;
  if (input.confidence === "high") confidenceMismatch = 25;
  else if (input.confidence === "medium") confidenceMismatch = 10;
  else if (input.confidence === "low") confidenceMismatch = 3;

  // ── Lapse frequency ───────────────────────────────────────────────────────
  // Each lapse = learned → forgotten. Chronic pattern; cap at 10 lapses.
  const lapses = Math.min(input.lapseCount ?? 0, 10);
  const lapseFrequency = lapses * 8;

  // ── Dwell time ────────────────────────────────────────────────────────────
  // <5 s: hasty / lucky-guess wrong answer — needs reinforcement.
  // >120 s: genuine struggle even with time investment.
  let dwellTime = 0;
  if (input.dwellTimeMs !== undefined) {
    if (input.dwellTimeMs < 5_000) dwellTime = 4;
    else if (input.dwellTimeMs > 120_000) dwellTime = 3;
  }

  // ── SATA partial failure ──────────────────────────────────────────────────
  // Partial credit = understanding gap in a multi-select item. The learner
  // may falsely believe they understand the topic.
  const sataPartial = input.isSata === true && input.sataPartialCredit === true ? 12 : 0;

  // ── Safety / danger escalation ────────────────────────────────────────────
  const dangerLevel = topicDangerLevel(input.topic);
  const isPrescribingSafety =
    input.prescribingSafetyMissOverride === true || isPrescribingSafetyTopic(input.topic);
  let safetyPenalty = 0;
  if (isPrescribingSafety || dangerLevel === "critical") {
    safetyPenalty = 30;
  } else if (dangerLevel === "high") {
    safetyPenalty = 15;
  }

  // ── Chronic accumulation ──────────────────────────────────────────────────
  const mistakeCount = input.priorMistakeCount + 1;
  const chronicAccumulation = mistakeCount * 1.5;

  const total =
    recency +
    confidenceMismatch +
    lapseFrequency +
    dwellTime +
    sataPartial +
    safetyPenalty +
    chronicAccumulation;

  return {
    total,
    recency,
    confidenceMismatch,
    lapseFrequency,
    dwellTime,
    sataPartial,
    safetyPenalty,
    chronicAccumulation,
  };
}

/** Spaced-review interval in days for a given accumulated mistake count. */
export function spacedReviewDays(mistakeCount: number): number {
  const n = Math.max(1, Math.min(mistakeCount, 8));
  return Math.min(32, 2 ** (n - 1));
}
