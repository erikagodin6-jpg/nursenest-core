import type { CatConfidenceLevel } from "@/lib/exams/cat-types";

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
  if (level === "high") return "High — estimate is fairly stable for this session length.";
  if (level === "medium") return "Medium — a few more items would narrow the estimate.";
  return "Building — keep going; the estimate will firm up as you answer more.";
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
}): string {
  const { readinessScore, confidenceLevel, decision } = args;
  if (decision === "pass" && readinessScore >= 62) return "On track for this session";
  if (decision === "fail" || readinessScore < 42) return "Needs focused review";
  if (confidenceLevel === "low") return "Building confidence — keep practicing";
  return "Mixed performance — keep going";
}
