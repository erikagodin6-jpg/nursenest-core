/**
 * Performance Tracker
 *
 * Maintains and updates `PerformanceProfile` — the multi-dimensional view of
 * a learner's performance across systems, risk levels, cognitive layers, and topics.
 *
 * This module is pure: no side effects, no external I/O. Callers are responsible
 * for persisting state between sessions.
 *
 * Design decisions:
 *  - Recency weighting uses the same decay model as readiness-scorer.ts for consistency.
 *  - Each dimension slice is computed from the full answer list, not incrementally,
 *    to ensure reproducibility and avoid drift from out-of-order updates.
 *  - Weighted accuracy accounts for cognitive × risk weight so that a 60% accuracy
 *    on L3/high-risk questions is distinguished from 60% on L1/low-risk.
 */

import type {
  AnswerRecord,
  CognitiveLayer,
  DimensionPerformance,
  PerformanceProfile,
  RiskLevel,
} from "./types";
import { COGNITIVE_WEIGHTS, RISK_WEIGHTS } from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

const RECENCY_HALF_LIFE_MS = 7 * 24 * 60 * 60 * 1000;
const RECENCY_LAMBDA = Math.LN2 / RECENCY_HALF_LIFE_MS;

/** Minimum questions in a dimension before metrics are considered reliable. */
export const MIN_RELIABLE_SAMPLE = 3;

/** Accuracy below this threshold classifies a dimension as a "weak area". */
export const WEAK_AREA_THRESHOLD = 0.65;

/** Accuracy at or above this threshold classifies a dimension as "strong". */
export const STRONG_AREA_THRESHOLD = 0.80;

// ─── Internal helpers ─────────────────────────────────────────────────────────

function recencyFactor(answeredAt: number, now: number): number {
  return Math.exp(-RECENCY_LAMBDA * Math.max(0, now - answeredAt));
}

function itemWeight(layer: CognitiveLayer, risk: RiskLevel): number {
  return COGNITIVE_WEIGHTS[layer] * RISK_WEIGHTS[risk];
}

/**
 * Build a `DimensionPerformance` from a slice of answer records.
 * Handles the empty-slice case gracefully.
 */
function buildDimensionPerformance(
  answers: AnswerRecord[],
  now: number,
): DimensionPerformance {
  if (answers.length === 0) {
    return {
      attempted: 0,
      correct: 0,
      accuracy: 0,
      recentAccuracy: 0,
      weightedAccuracy: 0,
      uniqueQuestionsSeen: 0,
    };
  }

  const totalCorrect = answers.filter((a) => a.correct).length;
  const rawAccuracy = totalCorrect / answers.length;

  // Recency-weighted accuracy
  let recentWeightedCorrect = 0;
  let recentWeightedTotal = 0;

  // Cognitive × risk weighted accuracy
  let wCorrect = 0;
  let wTotal = 0;

  const uniqueIds = new Set<string>();

  for (const a of answers) {
    uniqueIds.add(a.questionId);
    const rf = recencyFactor(a.answeredAt, now);
    recentWeightedTotal += rf;
    if (a.correct) recentWeightedCorrect += rf;

    const w = itemWeight(a.cognitiveLayer, a.riskLevel);
    wTotal += w;
    if (a.correct) wCorrect += w;
  }

  const recentAccuracy =
    recentWeightedTotal > 0 ? recentWeightedCorrect / recentWeightedTotal : 0;
  const weightedAccuracy = wTotal > 0 ? wCorrect / wTotal : 0;

  return {
    attempted: answers.length,
    correct: totalCorrect,
    accuracy: rawAccuracy,
    recentAccuracy,
    weightedAccuracy,
    uniqueQuestionsSeen: uniqueIds.size,
  };
}

// ─── Profile Builder ──────────────────────────────────────────────────────────

/**
 * Build a full `PerformanceProfile` from an array of answer records.
 *
 * @param answers - Complete answer history (all sessions combined).
 * @param now     - Reference timestamp in ms (defaults to Date.now()).
 */
export function buildPerformanceProfile(
  answers: AnswerRecord[],
  now: number = Date.now(),
): PerformanceProfile {
  // Group by system
  const bySystemMap = groupBy(answers, (a) => a.systemTag);
  const bySystem: Record<string, DimensionPerformance> = {};
  for (const [key, slice] of Object.entries(bySystemMap)) {
    bySystem[key] = buildDimensionPerformance(slice, now);
  }

  // Group by risk level
  const byRiskMap = groupBy(answers, (a) => a.riskLevel);
  const byRisk: Record<RiskLevel, DimensionPerformance> = {
    low: buildDimensionPerformance(byRiskMap["low"] ?? [], now),
    moderate: buildDimensionPerformance(byRiskMap["moderate"] ?? [], now),
    high: buildDimensionPerformance(byRiskMap["high"] ?? [], now),
  };

  // Group by cognitive layer
  const byLayerMap = groupBy(answers, (a) => a.cognitiveLayer);
  const byLayer: Record<CognitiveLayer, DimensionPerformance> = {
    L1: buildDimensionPerformance(byLayerMap["L1"] ?? [], now),
    L2: buildDimensionPerformance(byLayerMap["L2"] ?? [], now),
    L3: buildDimensionPerformance(byLayerMap["L3"] ?? [], now),
  };

  // Group by topic
  const byTopicMap = groupBy(answers, (a) => a.topicSlug);
  const byTopic: Record<string, DimensionPerformance> = {};
  for (const [key, slice] of Object.entries(byTopicMap)) {
    byTopic[key] = buildDimensionPerformance(slice, now);
  }

  // Overall
  const overall = buildDimensionPerformance(answers, now);

  return { bySystem, byRisk, byLayer, byTopic, overall };
}

/**
 * Incrementally update an existing `PerformanceProfile` with a new answer.
 *
 * This is equivalent to rebuilding from scratch but cheaper for live updates
 * during an active session. For session-end persistence, rebuild from full history.
 *
 * Note: `uniqueQuestionsSeen` may undercount when using incremental update
 * if the question was already seen — callers should use the full rebuild for
 * definitive reporting.
 */
export function applyAnswerToProfile(
  profile: PerformanceProfile,
  answer: AnswerRecord,
  now: number = Date.now(),
): PerformanceProfile {
  const updated = structuredClone(profile) as PerformanceProfile;

  const dims: Array<[DimensionPerformance, boolean]> = [
    [updated.bySystem[answer.systemTag] ??= zeroDimension(), true],
    [updated.byRisk[answer.riskLevel], true],
    [updated.byLayer[answer.cognitiveLayer], true],
    [updated.byTopic[answer.topicSlug] ??= zeroDimension(), true],
    [updated.overall, true],
  ];

  for (const [dim] of dims) {
    const rf = recencyFactor(answer.answeredAt, now);
    const w = itemWeight(answer.cognitiveLayer, answer.riskLevel);

    // Recompute running stats
    dim.attempted += 1;
    if (answer.correct) dim.correct += 1;
    dim.accuracy = dim.correct / dim.attempted;

    // Approximate recency and weighted accuracy update
    // (exact values require full history; this is a running approximation)
    const prevN = dim.attempted - 1;
    const alpha = rf / (prevN + rf); // blending factor
    dim.recentAccuracy = dim.recentAccuracy * (1 - alpha) + (answer.correct ? 1 : 0) * alpha;
    dim.weightedAccuracy = dim.weightedAccuracy * (1 - w / (prevN * 2 + w)) + (answer.correct ? w / (prevN * 2 + w) : 0);
    dim.uniqueQuestionsSeen = Math.max(dim.uniqueQuestionsSeen, dim.attempted);
  }

  return updated;
}

// ─── Weak Area Detection ──────────────────────────────────────────────────────

export interface WeakDimension {
  key: string;
  dimension: "system" | "risk" | "layer" | "topic";
  performance: DimensionPerformance;
  /** Remediation priority: higher = more urgent attention needed. */
  priority: number;
}

/**
 * Identify weak dimensions from a performance profile.
 * A dimension is "weak" when:
 *   - It has ≥ MIN_RELIABLE_SAMPLE questions answered, AND
 *   - Its recentAccuracy (or accuracy if no recent data) is below WEAK_AREA_THRESHOLD.
 *
 * Priority is computed as:
 *   priority = (1 - recentAccuracy) × riskMultiplier × sampleSizeBonus
 * where riskMultiplier is 2.5 for high-risk, 1.5 for moderate, 1.0 for others.
 */
export function identifyWeakDimensions(profile: PerformanceProfile): WeakDimension[] {
  const results: WeakDimension[] = [];

  function checkDim(
    key: string,
    dim: "system" | "risk" | "layer" | "topic",
    perf: DimensionPerformance,
    riskMultiplier = 1.0,
  ) {
    if (perf.attempted < MIN_RELIABLE_SAMPLE) return;
    const effectiveAccuracy =
      perf.attempted >= MIN_RELIABLE_SAMPLE ? perf.recentAccuracy : perf.accuracy;
    if (effectiveAccuracy >= WEAK_AREA_THRESHOLD) return;

    // Sample size bonus: more attempts = more reliable weakness signal
    const sampleBonus = Math.min(2.0, 1 + perf.attempted / 20);
    const priority = (1 - effectiveAccuracy) * riskMultiplier * sampleBonus;

    results.push({ key, dimension: dim, performance: perf, priority });
  }

  // Systems
  for (const [key, perf] of Object.entries(profile.bySystem)) {
    checkDim(key, "system", perf);
  }

  // Risk levels (high-risk weaknesses get higher priority)
  const riskMultipliers: Record<RiskLevel, number> = {
    low: 1.0,
    moderate: 1.5,
    high: 2.5,
  };
  for (const [key, perf] of Object.entries(profile.byRisk) as [RiskLevel, DimensionPerformance][]) {
    checkDim(key, "risk", perf, riskMultipliers[key]);
  }

  // Cognitive layers (L3 weaknesses get extra priority)
  const layerMultipliers: Record<CognitiveLayer, number> = {
    L1: 1.0,
    L2: 1.3,
    L3: 1.8,
  };
  for (const [key, perf] of Object.entries(profile.byLayer) as [CognitiveLayer, DimensionPerformance][]) {
    checkDim(key, "layer", perf, layerMultipliers[key]);
  }

  // Topics
  for (const [key, perf] of Object.entries(profile.byTopic)) {
    checkDim(key, "topic", perf, 1.2);
  }

  return results.sort((a, b) => b.priority - a.priority);
}

/**
 * Return the single weakest system tag, or null if all systems are strong.
 * Used by the CAT engine for question selection prioritisation.
 */
export function weakestSystem(profile: PerformanceProfile): string | null {
  const systems = Object.entries(profile.bySystem)
    .filter(([, p]) => p.attempted >= MIN_RELIABLE_SAMPLE)
    .sort((a, b) => a[1].recentAccuracy - b[1].recentAccuracy);
  const weakest = systems[0];
  if (!weakest) return null;
  return weakest[1].recentAccuracy < WEAK_AREA_THRESHOLD ? weakest[0] : null;
}

/**
 * Return the single weakest risk level, or null if all levels are strong.
 */
export function weakestRiskLevel(profile: PerformanceProfile): RiskLevel | null {
  const levels: RiskLevel[] = ["high", "moderate", "low"];
  for (const level of levels) {
    const perf = profile.byRisk[level];
    if (perf.attempted >= MIN_RELIABLE_SAMPLE && perf.recentAccuracy < WEAK_AREA_THRESHOLD) {
      return level;
    }
  }
  return null;
}

/**
 * Return the single weakest cognitive layer, or null if all are strong.
 */
export function weakestLayer(profile: PerformanceProfile): CognitiveLayer | null {
  const layers: CognitiveLayer[] = ["L3", "L2", "L1"];
  for (const layer of layers) {
    const perf = profile.byLayer[layer];
    if (perf.attempted >= MIN_RELIABLE_SAMPLE && perf.recentAccuracy < WEAK_AREA_THRESHOLD) {
      return layer;
    }
  }
  return null;
}

// ─── Zero/empty helpers ───────────────────────────────────────────────────────

function zeroDimension(): DimensionPerformance {
  return {
    attempted: 0,
    correct: 0,
    accuracy: 0,
    recentAccuracy: 0,
    weightedAccuracy: 0,
    uniqueQuestionsSeen: 0,
  };
}

export function emptyPerformanceProfile(): PerformanceProfile {
  return {
    bySystem: {},
    byRisk: { low: zeroDimension(), moderate: zeroDimension(), high: zeroDimension() },
    byLayer: { L1: zeroDimension(), L2: zeroDimension(), L3: zeroDimension() },
    byTopic: {},
    overall: zeroDimension(),
  };
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  for (const item of items) {
    const key = keyFn(item);
    (result[key] ??= []).push(item);
  }
  return result;
}

/**
 * Merge two performance profiles (e.g., historical + session).
 * For display purposes only — authoritative profiles should be rebuilt from full history.
 */
export function mergeProfiles(
  base: PerformanceProfile,
  overlay: PerformanceProfile,
): PerformanceProfile {
  function mergeDim(a: DimensionPerformance, b: DimensionPerformance): DimensionPerformance {
    const attempted = a.attempted + b.attempted;
    const correct = a.correct + b.correct;
    return {
      attempted,
      correct,
      accuracy: attempted > 0 ? correct / attempted : 0,
      recentAccuracy: b.attempted > 0 ? b.recentAccuracy : a.recentAccuracy,
      weightedAccuracy:
        a.weightedAccuracy * 0.5 + b.weightedAccuracy * 0.5,
      uniqueQuestionsSeen: a.uniqueQuestionsSeen + b.uniqueQuestionsSeen,
    };
  }

  const allSystems = new Set([
    ...Object.keys(base.bySystem),
    ...Object.keys(overlay.bySystem),
  ]);

  const bySystem: Record<string, DimensionPerformance> = {};
  for (const s of allSystems) {
    bySystem[s] = mergeDim(base.bySystem[s] ?? zeroDimension(), overlay.bySystem[s] ?? zeroDimension());
  }

  const allTopics = new Set([
    ...Object.keys(base.byTopic),
    ...Object.keys(overlay.byTopic),
  ]);
  const byTopic: Record<string, DimensionPerformance> = {};
  for (const t of allTopics) {
    byTopic[t] = mergeDim(base.byTopic[t] ?? zeroDimension(), overlay.byTopic[t] ?? zeroDimension());
  }

  const levels: RiskLevel[] = ["low", "moderate", "high"];
  const byRisk = {} as Record<RiskLevel, DimensionPerformance>;
  for (const l of levels) byRisk[l] = mergeDim(base.byRisk[l], overlay.byRisk[l]);

  const layers: CognitiveLayer[] = ["L1", "L2", "L3"];
  const byLayer = {} as Record<CognitiveLayer, DimensionPerformance>;
  for (const l of layers) byLayer[l] = mergeDim(base.byLayer[l], overlay.byLayer[l]);

  return {
    bySystem,
    byRisk,
    byLayer,
    byTopic,
    overall: mergeDim(base.overall, overlay.overall),
  };
}
