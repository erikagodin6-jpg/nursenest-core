/**
 * Readiness Scoring Engine
 *
 * Converts a learner's answer history into a clinically-weighted 0–100
 * readiness score that reflects actual clinical decision-making readiness,
 * not just raw accuracy.
 *
 * Scoring model:
 *   itemWeight   = cognitiveWeight(layer) × riskWeight(riskLevel)
 *   itemScore    = correct ? itemWeight : 0
 *   recencyScore = Σ( itemScore × recencyFactor(answeredAt) )  /  Σ( itemWeight × recencyFactor )
 *   finalScore   = clamp(recencyScore × consistencyModifier × 100, 0, 100)
 *
 * Recency factor: exponential decay with half-life of RECENCY_HALF_LIFE_MS.
 * Consistency modifier: penalises high variance; rewards steady performance.
 */

import type {
  AnswerRecord,
  CognitiveLayer,
  ReadinessScore,
  RiskLevel,
} from "./types";
import { COGNITIVE_WEIGHTS, MAX_ITEM_WEIGHT, RISK_WEIGHTS } from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Recency decay half-life: 7 days in ms. Older answers contribute ~half the weight. */
const RECENCY_HALF_LIFE_MS = 7 * 24 * 60 * 60 * 1000;

/** λ for exponential decay: λ = ln(2) / halfLife */
const RECENCY_LAMBDA = Math.LN2 / RECENCY_HALF_LIFE_MS;

/**
 * Consistency window: number of recent answers used to compute variance.
 * Using the last 20 answers gives a stable but responsive estimate.
 */
const CONSISTENCY_WINDOW = 20;

/** Minimum modifier applied when performance is perfectly inconsistent. */
const CONSISTENCY_MIN = 0.85;

/** Maximum modifier applied when performance is perfectly consistent. */
const CONSISTENCY_MAX = 1.10;

/**
 * Confidence thresholds (based on total weighted-answer count, not raw count,
 * so answering many easy L1/low-risk questions doesn't inflate confidence).
 */
const CONFIDENCE_THRESHOLDS = {
  high: 44,    // ≥ ~20 answers weighted at L2-moderate average
  medium: 22,  // ≥ ~10 answers
} as const;

// ─── Internal Helpers ─────────────────────────────────────────────────────────

/**
 * Compute exponential recency factor for an answer recorded at `answeredAt`.
 * Factor is 1.0 for answers recorded right now and decays toward 0 over time.
 */
function recencyFactor(answeredAt: number, now: number): number {
  const agMs = Math.max(0, now - answeredAt);
  return Math.exp(-RECENCY_LAMBDA * agMs);
}

/**
 * Per-item weight: product of cognitive and risk weights.
 * L3 × high = 2.2 × 2.5 = 5.5 (MAX_ITEM_WEIGHT).
 * L1 × low  = 1.0 × 1.0 = 1.0.
 */
function itemWeight(layer: CognitiveLayer, risk: RiskLevel): number {
  return COGNITIVE_WEIGHTS[layer] * RISK_WEIGHTS[risk];
}

/**
 * Compute population standard deviation of a number array.
 * Returns 0 for arrays with fewer than 2 elements.
 */
function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Consistency modifier derived from the variance of recent binary outcomes.
 * stdDev(binary outcomes) ∈ [0, 0.5]:
 *   0   → perfectly consistent → max modifier
 *   0.5 → maximum variance    → min modifier
 */
function consistencyModifier(recentAnswers: AnswerRecord[]): number {
  const window = recentAnswers.slice(-CONSISTENCY_WINDOW);
  if (window.length < 4) return 1.0; // not enough data to penalise
  const outcomes = window.map((a) => (a.correct ? 1 : 0));
  const sd = stdDev(outcomes);
  // Linear interpolation: sd=0 → max, sd=0.5 → min
  const t = Math.min(1, sd / 0.5);
  return CONSISTENCY_MAX - t * (CONSISTENCY_MAX - CONSISTENCY_MIN);
}

// ─── Dimension Breakdowns ─────────────────────────────────────────────────────

type DimKey = CognitiveLayer | RiskLevel | string;

interface DimAccumulator {
  weightedCorrect: number;
  weightedTotal: number;
}

function buildDimBreakdown(
  answers: AnswerRecord[],
  now: number,
  keyFn: (a: AnswerRecord) => DimKey,
): Record<string, number> {
  const acc: Record<string, DimAccumulator> = {};
  for (const a of answers) {
    const key = keyFn(a);
    if (!acc[key]) acc[key] = { weightedCorrect: 0, weightedTotal: 0 };
    const w = itemWeight(a.cognitiveLayer, a.riskLevel) * recencyFactor(a.answeredAt, now);
    acc[key]!.weightedTotal += w;
    if (a.correct) acc[key]!.weightedCorrect += w;
  }
  const result: Record<string, number> = {};
  for (const [key, { weightedCorrect, weightedTotal }] of Object.entries(acc)) {
    result[key] = weightedTotal > 0 ? Math.round((weightedCorrect / weightedTotal) * 100) : 0;
  }
  return result;
}

// ─── Main Scorer ──────────────────────────────────────────────────────────────

/**
 * Compute a readiness score from a set of answer records.
 *
 * @param answers - All historical answers for this learner (or a session subset).
 * @param now     - Reference timestamp in ms. Defaults to Date.now().
 *
 * @returns A `ReadinessScore` with a 0–100 score and full diagnostic breakdown.
 */
export function computeReadinessScore(
  answers: AnswerRecord[],
  now: number = Date.now(),
): ReadinessScore {
  if (answers.length === 0) {
    return emptyReadinessScore();
  }

  // ── Step 1: Weighted recency-aware score ──────────────────────────────────

  let weightedCorrect = 0;
  let weightedTotal = 0;
  let totalWeightSum = 0; // for confidence threshold (unrecency-adjusted)

  for (const a of answers) {
    const w = itemWeight(a.cognitiveLayer, a.riskLevel);
    const rf = recencyFactor(a.answeredAt, now);
    const recencyW = w * rf;
    weightedTotal += recencyW;
    if (a.correct) weightedCorrect += recencyW;
    totalWeightSum += w;
  }

  const rawWeightedPercent = weightedTotal > 0 ? weightedCorrect / weightedTotal : 0;

  // ── Step 2: Consistency modifier ─────────────────────────────────────────

  const modifier = consistencyModifier(answers);

  // ── Step 3: Final score ───────────────────────────────────────────────────

  const score = Math.min(100, Math.max(0, Math.round(rawWeightedPercent * modifier * 100)));

  // ── Step 4: Confidence ────────────────────────────────────────────────────

  let confidence: ReadinessScore["confidence"] = "low";
  if (totalWeightSum >= CONFIDENCE_THRESHOLDS.high) confidence = "high";
  else if (totalWeightSum >= CONFIDENCE_THRESHOLDS.medium) confidence = "medium";

  // ── Step 5: Dimension breakdowns ──────────────────────────────────────────

  const byLayer = buildDimBreakdown(answers, now, (a) => a.cognitiveLayer) as Record<CognitiveLayer, number>;
  const byRisk = buildDimBreakdown(answers, now, (a) => a.riskLevel) as Record<RiskLevel, number>;
  const bySystem = buildDimBreakdown(answers, now, (a) => a.systemTag);

  return {
    score,
    confidence,
    sampleSize: answers.length,
    consistencyModifier: Math.round(modifier * 1000) / 1000,
    rawWeightedPercent: Math.round(rawWeightedPercent * 1000) / 1000,
    dimensions: { byLayer, byRisk, bySystem },
    computedAt: new Date(now).toISOString(),
  };
}

/**
 * Compute a readiness score delta: the change from `before` to `after`.
 * Returns null when either score is undefined.
 */
export function scoreDelata(
  before: ReadinessScore | null | undefined,
  after: ReadinessScore,
): number | null {
  if (!before) return null;
  return after.score - before.score;
}

/**
 * Produce an empty/zero readiness score (no answers recorded yet).
 */
export function emptyReadinessScore(): ReadinessScore {
  return {
    score: 0,
    confidence: "low",
    sampleSize: 0,
    consistencyModifier: 1.0,
    rawWeightedPercent: 0,
    dimensions: {
      byLayer: { L1: 0, L2: 0, L3: 0 },
      byRisk: { low: 0, moderate: 0, high: 0 },
      bySystem: {},
    },
    computedAt: new Date().toISOString(),
  };
}

/**
 * Quick accuracy check: what fraction of L3 high-risk questions were answered correctly?
 * This is the most clinically significant subset and is used for "red zone" detection.
 */
export function l3HighRiskAccuracy(answers: AnswerRecord[]): number {
  const subset = answers.filter((a) => a.cognitiveLayer === "L3" && a.riskLevel === "high");
  if (subset.length === 0) return 0;
  const correct = subset.filter((a) => a.correct).length;
  return correct / subset.length;
}

/**
 * Derive a 5-point readiness band from a 0–100 score.
 *
 * | Band      | Score  | Clinical interpretation                     |
 * |-----------|--------|---------------------------------------------|
 * | critical  | 0–39   | Significant gaps; clinical risk              |
 * | developing| 40–59  | Foundational understanding; gaps remain     |
 * | approaching| 60–74 | Mostly competent; specific weaknesses       |
 * | ready     | 75–89  | Clinically ready; minor refinement needed   |
 * | proficient| 90–100 | Strong mastery across all domains           |
 */
export function readinessBand(
  score: number,
): "critical" | "developing" | "approaching" | "ready" | "proficient" {
  if (score < 40) return "critical";
  if (score < 60) return "developing";
  if (score < 75) return "approaching";
  if (score < 90) return "ready";
  return "proficient";
}

/**
 * Normalise a raw item weight to a 0–1 scale relative to MAX_ITEM_WEIGHT.
 * Used when displaying individual question contribution to the score.
 */
export function normaliseItemWeight(layer: CognitiveLayer, risk: RiskLevel): number {
  return itemWeight(layer, risk) / MAX_ITEM_WEIGHT;
}
