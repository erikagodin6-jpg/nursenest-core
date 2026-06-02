/**
 * Longitudinal Learner Intelligence Profile
 *
 * Aggregates data across multiple monitor sessions to produce a persistent
 * intelligence profile tracking growth, trends, and risk patterns over time.
 *
 * The profile is computed from stored MonitorSessionReport records and
 * CompetencyPassport state. It is recalculated after each session.
 *
 * Key outputs:
 *   - NCJMM domain trends (improving/stable/declining)
 *   - Harm pattern analysis (persistent red flags)
 *   - Escalation timing trajectory
 *   - Competency velocity (how fast the learner is advancing)
 *   - Readiness forecast (predicted score in N more sessions)
 *   - High-risk patterns (dangerous recurring behaviours)
 */

import type { NcjmmDomain } from "./clinical-judgment-engine";
import type { ReadinessDomain, ReadinessBand } from "./readiness-score-engine";
import type { MonitorCompetencyLevel } from "./monitor-competency-tracker";
import { computeReadinessProfile, type ReadinessInput } from "./readiness-score-engine";

// ─── Session summary (lightweight — stored in DB) ─────────────────────────────

export interface SessionSummaryRecord {
  sessionId: string;
  conditionKey: string;
  mode: string;
  completedAt: string;              // ISO
  compositeScore: number;
  clinicalJudgmentScore: number;
  monitorInterpretationScore: number;
  timeToInterventionScore: number;
  harmIndexScore: number;
  harmColor: "green" | "yellow" | "red";
  escalationTimely: boolean;
  missedOpportunityCount: number;
  interventionCount: number;
  remediationCompleted: boolean;
}

// ─── Domain trend ─────────────────────────────────────────────────────────────

export type TrendDirection = "improving" | "stable" | "declining" | "insufficient_data";

export interface DomainTrend {
  domain: NcjmmDomain;
  latestScore: number;
  previousScore: number | null;
  direction: TrendDirection;
  /** Slope of linear regression over last 5 sessions (+ve = improving). */
  velocityPerSession: number;
  /** Sessions the trend is based on. */
  sampleSize: number;
}

// ─── Risk pattern ─────────────────────────────────────────────────────────────

export type RiskPatternType =
  | "repeated_delayed_escalation"
  | "persistent_harm_events"
  | "unsafe_interventions"
  | "missed_critical_alarms"
  | "declining_performance"
  | "inconsistent_scores";

export interface RiskPattern {
  type: RiskPatternType;
  description: string;
  occurrences: number;
  severity: "advisory" | "concern" | "critical";
  recommendation: string;
}

// ─── Learner intelligence profile ────────────────────────────────────────────

export interface LearnerIntelligenceProfile {
  userId: string;
  /** Sessions analysed (most recent first, up to 30). */
  sessionCount: number;
  firstSessionAt: string;
  lastSessionAt: string;
  /** Per-NCJMM-domain trends. */
  domainTrends: DomainTrend[];
  /** Aggregate session scores over time (for sparkline). */
  compositeScoreHistory: number[];
  /** Current composite score (latest window average). */
  currentCompositeScore: number;
  /** Composite score trajectory. */
  compositeDirection: TrendDirection;
  /** Average composite score in last 3 sessions vs first 3 sessions. */
  overallImprovement: number;       // positive = improved
  /** Identified high-risk patterns. */
  riskPatterns: RiskPattern[];
  /** Top 3 strengths derived from longitudinal data. */
  strengths: string[];
  /** Top 3 priority improvement areas. */
  priorityImprovements: string[];
  /** Predicted composite score after N more sessions (simple linear extrapolation). */
  forecastScore: {
    in3Sessions: number;
    in5Sessions: number;
    in10Sessions: number;
  };
  /** Current readiness profile. */
  readinessProfile: ReturnType<typeof computeReadinessProfile>;
  computedAt: string;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildLearnerIntelligenceProfile(
  userId: string,
  sessions: SessionSummaryRecord[],
  competencyLevels?: Partial<Record<string, MonitorCompetencyLevel>>,
): LearnerIntelligenceProfile {
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  );
  const recentSessions = sortedSessions.slice(0, 30);
  const sessionCount = recentSessions.length;

  if (sessionCount === 0) {
    return emptyProfile(userId);
  }

  // ── Composite score history ────────────────────────────────────────────────
  const compositeScoreHistory = [...recentSessions]
    .reverse()
    .map((s) => s.compositeScore);

  const currentCompositeScore = average(compositeScoreHistory.slice(-3));
  const earlyComposite = average(compositeScoreHistory.slice(0, Math.min(3, sessionCount)));
  const overallImprovement = Math.round(currentCompositeScore - earlyComposite);
  const compositeDirection = trendDirection(compositeScoreHistory);

  // ── Domain trends ──────────────────────────────────────────────────────────
  const domainTrends = buildDomainTrends(recentSessions);

  // ── Risk patterns ──────────────────────────────────────────────────────────
  const riskPatterns = detectRiskPatterns(recentSessions, compositeScoreHistory);

  // ── Strengths and improvements ────────────────────────────────────────────
  const strengths = deriveStrengths(recentSessions, domainTrends);
  const priorityImprovements = derivePriorityImprovements(recentSessions, domainTrends);

  // ── Forecast ──────────────────────────────────────────────────────────────
  const slope = linearRegressionSlope(compositeScoreHistory);
  const forecast = {
    in3Sessions:  Math.min(100, Math.max(0, Math.round(currentCompositeScore + slope * 3))),
    in5Sessions:  Math.min(100, Math.max(0, Math.round(currentCompositeScore + slope * 5))),
    in10Sessions: Math.min(100, Math.max(0, Math.round(currentCompositeScore + slope * 10))),
  };

  // ── Readiness profile ──────────────────────────────────────────────────────
  const conditionsPracticed = [...new Set(recentSessions.map((s) => s.conditionKey))];
  const greenHarmRate = recentSessions.filter((s) => s.harmColor === "green").length / sessionCount;
  const redHarmRate = recentSessions.filter((s) => s.harmColor === "red").length / sessionCount;
  const timelyEscalationRate = recentSessions.filter((s) => s.escalationTimely).length / sessionCount;
  const remediationCompletionRate = recentSessions.filter((s) => s.remediationCompleted).length / sessionCount;

  const readinessInput: ReadinessInput = {
    sessionCount,
    avgCompositeScore: currentCompositeScore,
    avgClinicalJudgmentScore: average(recentSessions.slice(0, 10).map((s) => s.clinicalJudgmentScore)),
    avgMonitorInterpretationScore: average(recentSessions.slice(0, 10).map((s) => s.monitorInterpretationScore)),
    avgTimeToInterventionScore: average(recentSessions.slice(0, 10).map((s) => s.timeToInterventionScore)),
    avgHarmIndexScore: average(recentSessions.slice(0, 10).map((s) => s.harmIndexScore)),
    greenHarmRate,
    redHarmRate,
    conditionsPracticed,
    timelyEscalationRate,
    remediationCompletionRate,
    scoreConsistency: stdDev(compositeScoreHistory),
  };
  const readinessProfile = computeReadinessProfile(readinessInput);

  return {
    userId,
    sessionCount,
    firstSessionAt: recentSessions[recentSessions.length - 1]!.completedAt,
    lastSessionAt: recentSessions[0]!.completedAt,
    domainTrends,
    compositeScoreHistory,
    currentCompositeScore,
    compositeDirection,
    overallImprovement,
    riskPatterns,
    strengths,
    priorityImprovements,
    forecastScore: forecast,
    readinessProfile,
    computedAt: new Date().toISOString(),
  };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function emptyProfile(userId: string): LearnerIntelligenceProfile {
  return {
    userId, sessionCount: 0,
    firstSessionAt: "", lastSessionAt: "",
    domainTrends: [],
    compositeScoreHistory: [],
    currentCompositeScore: 0,
    compositeDirection: "insufficient_data",
    overallImprovement: 0,
    riskPatterns: [],
    strengths: [],
    priorityImprovements: [],
    forecastScore: { in3Sessions: 0, in5Sessions: 0, in10Sessions: 0 },
    readinessProfile: computeReadinessProfile({
      sessionCount: 0, avgCompositeScore: 0, avgClinicalJudgmentScore: 0,
      avgMonitorInterpretationScore: 0, avgTimeToInterventionScore: 0,
      avgHarmIndexScore: 0, greenHarmRate: 0, redHarmRate: 0,
      conditionsPracticed: [], timelyEscalationRate: 0, remediationCompletionRate: 0,
    }),
    computedAt: new Date().toISOString(),
  };
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.round(Math.sqrt(variance));
}

function trendDirection(values: number[]): TrendDirection {
  if (values.length < 3) return "insufficient_data";
  const slope = linearRegressionSlope(values);
  if (slope > 1.5) return "improving";
  if (slope < -1.5) return "declining";
  return "stable";
}

function linearRegressionSlope(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;
  const xs = values.map((_, i) => i);
  const sumX = xs.reduce((s, x) => s + x, 0);
  const sumY = values.reduce((s, y) => s + y, 0);
  const sumXY = xs.reduce((s, x, i) => s + x * values[i]!, 0);
  const sumX2 = xs.reduce((s, x) => s + x * x, 0);
  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return 0;
  return (n * sumXY - sumX * sumY) / denom;
}

function buildDomainTrends(sessions: SessionSummaryRecord[]): DomainTrend[] {
  const ncjmmDomains: NcjmmDomain[] = [
    "recognize_cues", "analyze_cues", "prioritize_hypotheses",
    "generate_solutions", "take_action", "evaluate_outcomes",
  ];

  // Proxy domain scores from available session metrics
  return ncjmmDomains.map((domain) => {
    const scores = sessions.slice(0, 10).map((s) => {
      switch (domain) {
        case "recognize_cues":        return s.clinicalJudgmentScore * 0.9 + s.monitorInterpretationScore * 0.1;
        case "analyze_cues":          return s.clinicalJudgmentScore * 0.8 + s.monitorInterpretationScore * 0.2;
        case "prioritize_hypotheses": return s.clinicalJudgmentScore * 0.85;
        case "generate_solutions":    return s.clinicalJudgmentScore * 0.75 + s.timeToInterventionScore * 0.25;
        case "take_action":           return s.timeToInterventionScore * 0.7 + s.interventionCount > 3 ? 75 : 50;
        case "evaluate_outcomes":     return s.harmIndexScore * 0.6 + s.clinicalJudgmentScore * 0.4;
        default:                      return s.compositeScore;
      }
    }).map(Math.round);

    const reversedScores = [...scores].reverse();
    const latestScore = reversedScores[reversedScores.length - 1] ?? 0;
    const previousScore = reversedScores.length > 1 ? reversedScores[reversedScores.length - 2] ?? null : null;

    return {
      domain,
      latestScore,
      previousScore,
      direction: trendDirection(reversedScores),
      velocityPerSession: Math.round(linearRegressionSlope(reversedScores) * 10) / 10,
      sampleSize: scores.length,
    };
  });
}

function detectRiskPatterns(
  sessions: SessionSummaryRecord[],
  compositeHistory: number[],
): RiskPattern[] {
  const patterns: RiskPattern[] = [];
  const recent10 = sessions.slice(0, 10);

  // Delayed escalation
  const lateEscalationCount = recent10.filter((s) => !s.escalationTimely).length;
  if (lateEscalationCount >= 4) {
    patterns.push({
      type: "repeated_delayed_escalation",
      description: `Escalation delayed in ${lateEscalationCount} of last ${recent10.length} sessions`,
      occurrences: lateEscalationCount,
      severity: lateEscalationCount >= 7 ? "critical" : "concern",
      recommendation: "Complete 3 rapid response activation drills. Review SBAR escalation protocol.",
    });
  }

  // Persistent harm
  const redHarmCount = recent10.filter((s) => s.harmColor === "red").length;
  if (redHarmCount >= 2) {
    patterns.push({
      type: "persistent_harm_events",
      description: `Red Harm Index in ${redHarmCount} of last ${recent10.length} sessions`,
      occurrences: redHarmCount,
      severity: redHarmCount >= 4 ? "critical" : "concern",
      recommendation: "Mandatory review of harm event replays before next unsupervised session.",
    });
  }

  // Declining performance
  if (compositeHistory.length >= 5 && linearRegressionSlope(compositeHistory.slice(-5)) < -2) {
    patterns.push({
      type: "declining_performance",
      description: "Composite score declining over last 5 sessions",
      occurrences: 5,
      severity: "concern",
      recommendation: "Reduce session complexity. Return to foundational sepsis/telemetry scenarios.",
    });
  }

  // Inconsistent scores
  const recentStdDev = stdDev(compositeHistory.slice(0, Math.min(8, compositeHistory.length)));
  if (recentStdDev > 20 && compositeHistory.length >= 5) {
    patterns.push({
      type: "inconsistent_scores",
      description: `Score variance is high (σ = ${recentStdDev}) — performance is unpredictable`,
      occurrences: compositeHistory.length,
      severity: "advisory",
      recommendation: "Practice at consistent difficulty level before advancing to harder cases.",
    });
  }

  return patterns;
}

function deriveStrengths(
  sessions: SessionSummaryRecord[],
  trends: DomainTrend[],
): string[] {
  const strengths: string[] = [];
  const recent5 = sessions.slice(0, 5);

  const avgHarm = average(recent5.map((s) => s.harmIndexScore));
  if (avgHarm >= 85) strengths.push("Consistent patient safety record");

  const avgCJ = average(recent5.map((s) => s.clinicalJudgmentScore));
  if (avgCJ >= 80) strengths.push("Strong clinical judgment (NCJMM)");

  const avgTTI = average(recent5.map((s) => s.timeToInterventionScore));
  if (avgTTI >= 80) strengths.push("Timely intervention and escalation");

  const improvingDomain = trends.find((t) => t.direction === "improving" && t.latestScore >= 75);
  if (improvingDomain) strengths.push(`Improving ${improvingDomain.domain.replace(/_/g, " ")}`);

  const conditionCount = new Set(sessions.map((s) => s.conditionKey)).size;
  if (conditionCount >= 10) strengths.push(`Broad simulation exposure (${conditionCount} conditions)`);

  return strengths.slice(0, 4);
}

function derivePriorityImprovements(
  sessions: SessionSummaryRecord[],
  trends: DomainTrend[],
): string[] {
  const improvements: string[] = [];
  const recent5 = sessions.slice(0, 5);

  const avgHarm = average(recent5.map((s) => s.harmIndexScore));
  if (avgHarm < 70) improvements.push("Harm prevention — review harm event replays");

  const escalationRate = recent5.filter((s) => s.escalationTimely).length / recent5.length;
  if (escalationRate < 0.6) improvements.push("Escalation timing — practice rapid response activation");

  const avgCJ = average(recent5.map((s) => s.clinicalJudgmentScore));
  if (avgCJ < 65) improvements.push("Clinical judgment (NCJMM) — focus on cue recognition");

  const decliningDomain = trends.find((t) => t.direction === "declining");
  if (decliningDomain) improvements.push(`${decliningDomain.domain.replace(/_/g, " ")} — declining trend`);

  const missedAvg = average(recent5.map((s) => s.missedOpportunityCount));
  if (missedAvg >= 2) improvements.push("Missed opportunities — replay deterioration turning points");

  return improvements.slice(0, 4);
}
