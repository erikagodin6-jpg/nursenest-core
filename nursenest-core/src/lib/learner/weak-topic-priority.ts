import type { TopicStrength } from "@/lib/learner/weak-topics-from-sessions";

/** Days for half-life of wrong-answer signal (recent errors weigh more). */
export const WEAK_TOPIC_WRONG_RECENCY_HALF_LIFE_DAYS = 14;

/** Days for half-life of “recovery” signal from last attempt (correct streaks accelerate drop). */
export const WEAK_TOPIC_RECOVERY_HALF_LIFE_DAYS = 10;

/** Pseudo-attempts so one miss on a fresh topic does not max weakness. */
export const WEAK_TOPIC_VOLUME_PRIOR_ATTEMPTS = 4;

/** Attempts at which ledger confidence approaches 1 for merge / fallback weighting. */
export const LEDGER_FULL_CONFIDENCE_ATTEMPTS = 22;

/** Minimum total ledger attempts before session fallback is strongly down-weighted. */
export const THIN_LEDGER_TOTAL_ATTEMPTS = 12;

/** Minimum distinct topics with ≥1 attempt before we consider ledger “thick enough” to fade fallback. */
export const THIN_LEDGER_MIN_TOPICS = 3;

/** Extra weight on wrong streak (capped). */
export const WRONG_STREAK_MULTIPLIER = 0.14;

export const MAX_STREAK_FOR_SCORE = 8;

export type TopicStatLike = {
  correctCount: number;
  wrongCount: number;
  wrongStreak: number;
  lastWrongAt: Date | null;
  lastAttemptAt: Date | null;
};

export type DecaySignals = {
  /** 0–1, higher = more recent wrong activity. */
  decayAdjustedWrongSignal: number;
  /** 0–1, higher = stronger recent success / recovery signal. */
  decayAdjustedCorrectSignal: number;
};

function clamp01(n: number): number {
  if (Number.isNaN(n) || !Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function daysBetween(from: Date, toMs: number): number {
  return (toMs - from.getTime()) / 86400000;
}

function expDecay(days: number, halfLifeDays: number): number {
  if (halfLifeDays <= 0) return 0;
  return Math.exp(-Math.LN2 * (days / halfLifeDays));
}

/**
 * Explicit recency decay on aggregates (continuous).
 * Wrong mass decays from lastWrongAt; correct/recovery mass from lastAttemptAt when streak is zero.
 */
export function computeDecaySignals(s: TopicStatLike, nowMs: number = Date.now()): DecaySignals {
  const total = s.correctCount + s.wrongCount;
  if (total <= 0) {
    return { decayAdjustedWrongSignal: 0, decayAdjustedCorrectSignal: 0 };
  }

  const daysSinceWrong = s.lastWrongAt != null ? Math.max(0, daysBetween(s.lastWrongAt, nowMs)) : 9999;
  const wrongRecency = s.wrongCount > 0 ? expDecay(daysSinceWrong, WEAK_TOPIC_WRONG_RECENCY_HALF_LIFE_DAYS) : 0;

  const wrongMass = s.wrongCount / (total + WEAK_TOPIC_VOLUME_PRIOR_ATTEMPTS);
  const streakBoost = 1 + WRONG_STREAK_MULTIPLIER * Math.min(s.wrongStreak, MAX_STREAK_FOR_SCORE);
  const decayAdjustedWrongSignal = clamp01(wrongMass * wrongRecency * streakBoost);

  const daysSinceAttempt =
    s.lastAttemptAt != null ? Math.max(0, daysBetween(s.lastAttemptAt, nowMs)) : 9999;
  const attemptRecency = expDecay(daysSinceAttempt, WEAK_TOPIC_RECOVERY_HALF_LIFE_DAYS);
  const correctMass = s.correctCount / (total + WEAK_TOPIC_VOLUME_PRIOR_ATTEMPTS);

  let recoveryFactor = attemptRecency;
  if (s.wrongStreak === 0 && s.wrongCount > 0) {
    recoveryFactor *= 1 + 0.35 * expDecay(daysSinceWrong, WEAK_TOPIC_WRONG_RECENCY_HALF_LIFE_DAYS * 1.6);
  }

  const decayAdjustedCorrectSignal = clamp01(correctMass * recoveryFactor);
  return { decayAdjustedWrongSignal, decayAdjustedCorrectSignal };
}

/**
 * Bounded 0–1 weak priority: higher = more important to remediate soon.
 * Uses decay signals + accuracy + volume dampening so low-volume noise does not dominate.
 */
export function computeWeakPriorityScore(s: TopicStatLike, nowMs: number = Date.now()): number {
  const total = s.correctCount + s.wrongCount;
  if (total <= 0) return 0;

  const { decayAdjustedWrongSignal, decayAdjustedCorrectSignal } = computeDecaySignals(s, nowMs);
  const acc = s.correctCount / total;

  const volumeFactor = total / (total + WEAK_TOPIC_VOLUME_PRIOR_ATTEMPTS);
  const accuracyStress = clamp01(1 - acc);

  let raw =
    0.52 * decayAdjustedWrongSignal +
    0.28 * accuracyStress * volumeFactor +
    0.2 * clamp01(s.wrongStreak / MAX_STREAK_FOR_SCORE) * volumeFactor;

  raw -= 0.42 * decayAdjustedCorrectSignal * (s.wrongStreak === 0 ? 1 : 0.45);

  return clamp01(raw);
}

export function ledgerEvidenceCount(s: TopicStatLike): number {
  return s.correctCount + s.wrongCount;
}

export function ledgerSourceConfidence(s: TopicStatLike): number {
  const n = ledgerEvidenceCount(s);
  return clamp01(n / LEDGER_FULL_CONFIDENCE_ATTEMPTS);
}

/** Same thresholds as previous classifier — UI labels unchanged. */
export function classifyTopicStrength(args: {
  correctCount: number;
  wrongCount: number;
  wrongStreak: number;
  lastWrongAt: Date | null;
}): TopicStrength {
  const total = args.correctCount + args.wrongCount;
  if (total === 0) return "moderate";
  const acc = args.correctCount / total;
  const daysSinceWrong = args.lastWrongAt
    ? (Date.now() - args.lastWrongAt.getTime()) / 86400000
    : 999;

  if (total < 3) {
    if (args.wrongCount >= 2 && acc < 0.5) return "weak";
    if (args.correctCount === total && total >= 2) return "strong";
    return "moderate";
  }

  if (acc >= 0.78 && args.wrongStreak <= 1 && args.wrongCount / total <= 0.28) return "strong";
  if (acc < 0.55 || args.wrongStreak >= 3 || (acc < 0.65 && daysSinceWrong < 3 && args.wrongCount >= 2)) {
    return "weak";
  }
  return "moderate";
}

/** Session-only heuristic priority (no persisted streak/timestamps). */
export function fallbackWeakPriorityFromSessionRow(missRate: number, attempted: number, missed: number): number {
  const t = Math.max(0, attempted);
  const vol = t / (t + WEAK_TOPIC_VOLUME_PRIOR_ATTEMPTS * 1.25);
  const miss = clamp01(missRate / 100);
  const m = Math.max(0, missed);
  return clamp01(0.65 * miss * vol + 0.35 * clamp01(m / (m + 5)));
}
