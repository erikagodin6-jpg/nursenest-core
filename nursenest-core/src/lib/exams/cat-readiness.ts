import type { CatConfidenceLevel, CatPresentationMode } from "@/lib/exams/cat-types";
import type { CatAnswerResult } from "@/lib/exams/cat-types";

/** Map internal theta (roughly −3…+3) to a bounded 0–100 readiness score. */
export function readinessScoreFromTheta(theta: number): number {
  if (!Number.isFinite(theta)) return 50;
  const scaled = 50 + 15.5 * theta;
  return Math.round(Math.min(100, Math.max(0, scaled)));
}

export function confidenceLevelFromSe(se: number): CatConfidenceLevel {
  if (!Number.isFinite(se) || se > 0.9) return "low";
  if (se <= 0.28) return "high";
  if (se <= 0.45) return "medium";
  return "low";
}

export function confidenceText(level: CatConfidenceLevel): string {
  if (level === "high") return "High. Estimate is fairly stable for this session length.";
  if (level === "medium") return "Medium. A few more items would narrow the estimate.";
  return "Building. Keep going; the estimate will firm up as you answer more.";
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function normalizedTheta(theta: number): number {
  if (!Number.isFinite(theta)) return 0.5;
  return clamp01((theta + 3) / 6);
}

function weightedAccuracy(results: CatAnswerResult[]): number {
  if (results.length === 0) return 0.5;
  let weightedCorrect = 0;
  let weightedTotal = 0;
  for (const r of results) {
    const weight = clamp01(0.84 + r.difficulty * 0.08);
    weightedTotal += weight;
    if (r.correct) weightedCorrect += weight;
  }
  return weightedTotal > 0 ? weightedCorrect / weightedTotal : 0.5;
}

function consistencyScore(results: CatAnswerResult[]): number {
  if (results.length < 3) return 0.5;
  const binary: number[] = results.map((r) => (r.correct ? 1 : 0));
  const mean = binary.reduce<number>((sum, x) => sum + x, 0) / binary.length;
  const variance = binary.reduce<number>((sum, x) => sum + (x - mean) ** 2, 0) / binary.length;
  const std = Math.sqrt(variance);
  let transitions = 0;
  for (let i = 1; i < binary.length; i++) {
    if (binary[i] !== binary[i - 1]) transitions += 1;
  }
  const transitionScore = binary.length > 1 ? 1 - transitions / (binary.length - 1) : 0.5;
  const varianceScore = 1 - clamp01(std / 0.5);
  return clamp01(transitionScore * 0.55 + varianceScore * 0.45);
}

function trendScore(results: CatAnswerResult[]): number {
  const sequence = results.map((r) => r.correct);
  const t = trajectorySummary(sequence);
  if (t === "improving") return 0.68;
  if (t === "slipping") return 0.32;
  if (t === "steady") return 0.5;
  return 0.5;
}

export function abilityScoreFromSignals(theta: number, results: CatAnswerResult[]): number {
  const thetaScore = normalizedTheta(theta);
  const accuracyScore = weightedAccuracy(results);
  const trend = trendScore(results);
  const consistency = consistencyScore(results);
  return clamp01(thetaScore * 0.45 + accuracyScore * 0.3 + trend * 0.15 + consistency * 0.1);
}

function normalizedThresholdFromTheta(passingThreshold: number): number {
  return clamp01((passingThreshold + 3) / 6);
}

export function readinessLevelFromAbility(
  abilityScore: number,
  passingThreshold: number,
): "Likely Pass" | "Borderline" | "At Risk" {
  const threshold = normalizedThresholdFromTheta(passingThreshold);
  const margin = 0.06;
  if (abilityScore >= threshold + margin) return "Likely Pass";
  if (abilityScore >= threshold - margin) return "Borderline";
  return "At Risk";
}

export function passProbabilityFromAbility(
  abilityScore: number,
  passingThreshold: number,
  confidence: "High" | "Moderate" | "Low",
): number {
  const threshold = normalizedThresholdFromTheta(passingThreshold);
  const z = (abilityScore - threshold) * 12;
  let pct = Math.round((1 / (1 + Math.exp(-z))) * 100);
  if (confidence === "Low") pct = Math.round((pct + 50) / 2);
  if (confidence === "Moderate") pct = Math.round((pct * 3 + 50) / 4);
  return Math.max(0, Math.min(100, pct));
}

export function passProbabilityBandFromPct(
  pct: number,
): "Very likely to pass" | "Likely to pass" | "Borderline" | "At risk" {
  if (pct >= 85) return "Very likely to pass";
  if (pct >= 70) return "Likely to pass";
  if (pct >= 50) return "Borderline";
  return "At risk";
}

export function confidenceLabelFromSignals(args: {
  se: number;
  answeredCount: number;
  abilityScore: number;
  passingThreshold: number;
  trend: "improving" | "slipping" | "steady" | "insufficient";
  consistency: number;
}): "High" | "Moderate" | "Low" {
  const { se, answeredCount, abilityScore, passingThreshold, trend, consistency } = args;
  const threshold = normalizedThresholdFromTheta(passingThreshold);
  const distance = Math.abs(abilityScore - threshold);
  let score = 0;
  if (answeredCount >= 110) score += 2;
  else if (answeredCount >= 85) score += 1;
  if (consistency >= 0.72) score += 1;
  else if (consistency < 0.45) score -= 1;
  if (distance >= 0.12) score += 1;
  else score -= 1;
  if (trend === "improving") score += 1;
  if (trend === "slipping") score -= 1;
  if (se <= 0.28) score += 1;
  if (se >= 0.5) score -= 1;
  if (score >= 3) return "High";
  if (score >= 1) return "Moderate";
  return "Low";
}

export function weakAreaPriorityFromResults(results: CatAnswerResult[]): Array<{
  categoryKey: string;
  wrongCount: number;
  averageDifficulty: number;
  priorityScore: number;
}> {
  const byCategory = new Map<string, { wrongCount: number; total: number; weightedWrong: number; diffSum: number }>();
  for (const r of results) {
    const cur = byCategory.get(r.categoryKey) ?? { wrongCount: 0, total: 0, weightedWrong: 0, diffSum: 0 };
    cur.total += 1;
    if (!r.correct) {
      cur.wrongCount += 1;
      cur.weightedWrong += 1 + (r.difficulty - 3) * 0.25;
      cur.diffSum += r.difficulty;
    }
    byCategory.set(r.categoryKey, cur);
  }
  return [...byCategory.entries()]
    .map(([categoryKey, value]) => {
      const accuracy = value.total > 0 ? 1 - value.wrongCount / value.total : 0;
      const averageDifficulty = value.wrongCount > 0 ? value.diffSum / value.wrongCount : 0;
      const priorityScore = value.weightedWrong * 0.65 + (1 - accuracy) * 2.4;
      return {
        categoryKey,
        wrongCount: value.wrongCount,
        averageDifficulty: Math.round(averageDifficulty * 10) / 10,
        priorityScore: Math.round(priorityScore * 100) / 100,
      };
    })
    .filter((entry) => entry.wrongCount > 0)
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

/** Compare first vs second half accuracy for a simple trajectory hint. */
export function trajectorySummary(correctSequence: boolean[]): "improving" | "slipping" | "steady" | "insufficient" {
  if (correctSequence.length < 6) return "insufficient";
  const mid = Math.floor(correctSequence.length / 2);
  const a = correctSequence.slice(0, mid).filter(Boolean).length / mid;
  const b = correctSequence.slice(mid).filter(Boolean).length / (correctSequence.length - mid);
  if (b - a > 0.12) return "improving";
  if (a - b > 0.12) return "slipping";
  return "steady";
}

export function readinessHeadlineFromSignals(args: {
  readinessScore: number;
  confidenceLevel: CatConfidenceLevel;
  decision: "pass" | "fail" | "uncertain";
  presentationMode?: CatPresentationMode;
}): string {
  const { readinessScore, confidenceLevel, decision, presentationMode } = args;
  const sim = presentationMode === "exam_simulation";
  if (decision === "pass" && readinessScore >= 62) {
    return sim ? "Exam simulation: above passing band for this run" : "On track for this session";
  }
  if (decision === "fail" || readinessScore < 42) {
    return sim ? "Exam simulation: below passing band for this run" : "Needs focused review";
  }
  if (confidenceLevel === "low") {
    return sim ? "Simulation still calibrating. More items may be needed" : "Building confidence. Keep practicing";
  }
  return sim ? "Exam simulation: mixed. Keep building depth" : "Mixed performance. Keep going";
}
