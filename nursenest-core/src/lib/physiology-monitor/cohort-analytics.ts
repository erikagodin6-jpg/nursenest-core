/**
 * Institutional Cohort Analytics
 *
 * Aggregates session data across learner cohorts for educator / institutional
 * dashboards. Designed for nursing schools, hospital onboarding programs,
 * telemetry units, ICU orientations, and RT training programs.
 *
 * Privacy: all analytics are aggregated — no individual learner data is
 * exposed through this API. Minimum cohort size of 5 required.
 *
 * Produces:
 *   - Cohort readiness distributions
 *   - Common escalation failure patterns
 *   - Rhythm recognition gaps
 *   - Harm Index distributions
 *   - NCJMM weak domain identification
 *   - Remediation recommendation sets
 */

import type { NcjmmDomain } from "./clinical-judgment-engine";
import type { ReadinessDomain, ReadinessBand } from "./readiness-score-engine";
import type { RiskPatternType } from "./learner-intelligence-profile";

// ─── Minimum cohort size (privacy guard) ─────────────────────────────────────

const MIN_COHORT_SIZE = 5;

// ─── Cohort session record (aggregate-safe) ───────────────────────────────────

export interface CohortSessionRecord {
  /** Anonymised — no user ID. */
  conditionKey: string;
  mode: string;
  compositeScore: number;
  clinicalJudgmentScore: number;
  monitorInterpretationScore: number;
  timeToInterventionScore: number;
  harmIndexScore: number;
  harmColor: "green" | "yellow" | "red";
  escalationTimely: boolean;
  missedOpportunityCount: number;
  remediationCompleted: boolean;
  profession?: string;
  completedAt: string;
}

// ─── Cohort metrics ───────────────────────────────────────────────────────────

export interface DomainPerformanceSummary {
  domain: NcjmmDomain;
  cohortAvg: number;
  percentBelowPassing: number;  // % of learners scoring < 65
  trend: "improving" | "stable" | "declining" | "unknown";
}

export interface ConditionDifficultySummary {
  conditionKey: string;
  conditionLabel: string;
  avgScore: number;
  avgHarmRate: number;          // 0–1 proportion with any harm
  avgEscalationTimeliness: number; // 0–1
  sessionCount: number;
}

export interface ReadinessDistribution {
  domain: ReadinessDomain;
  notReady: number;           // % of cohort
  developing: number;
  nearReady: number;
  ready: number;
  proficient: number;
}

// ─── Full cohort dashboard ────────────────────────────────────────────────────

export interface CohortDashboard {
  /** Cohort identifier (e.g. "Telemetry Unit 4B — May 2026 Orientation"). */
  cohortId: string;
  cohortLabel: string;
  sessionCount: number;
  learnerCount: number;
  period: { from: string; to: string };

  // ── Overall metrics ──
  avgCompositeScore: number;
  avgHarmIndexScore: number;
  greenHarmRate: number;
  redHarmRate: number;
  avgEscalationTimeliness: number;

  // ── Score distribution (for heatmap) ──
  scoreBuckets: Record<string, number>;  // e.g. { "0-40": 2, "40-60": 5, ... }

  // ── NCJMM domain performance ──
  domainPerformance: DomainPerformanceSummary[];

  // ── Most difficult conditions ──
  hardestConditions: ConditionDifficultySummary[];

  // ── Common failure patterns ──
  commonFailures: Array<{
    pattern: RiskPatternType;
    description: string;
    affectedCount: number;
    affectedPct: number;
    recommendation: string;
  }>;

  // ── Readiness distribution ──
  readinessDistribution: ReadinessDistribution[];

  // ── Remediation recommendations ──
  cohortRemediationRecommendations: string[];

  computedAt: string;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildCohortDashboard(
  cohortId: string,
  cohortLabel: string,
  sessions: CohortSessionRecord[],
): CohortDashboard | null {
  if (sessions.length < MIN_COHORT_SIZE) return null;

  const sorted = [...sessions].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
  );
  const period = {
    from: sorted[0]!.completedAt,
    to: sorted[sorted.length - 1]!.completedAt,
  };

  // Rough unique-learner count (based on daily session patterns — not perfect)
  const sessionDays = new Set(sessions.map((s) => s.completedAt.slice(0, 10)));
  const learnerCount = Math.max(MIN_COHORT_SIZE, Math.round(sessions.length / Math.max(1, sessionDays.size)));

  const avg = (arr: number[]) =>
    arr.length > 0 ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;

  const avgCompositeScore = avg(sessions.map((s) => s.compositeScore));
  const avgHarmIndexScore = avg(sessions.map((s) => s.harmIndexScore));
  const greenHarmRate = Math.round(sessions.filter((s) => s.harmColor === "green").length / sessions.length * 100);
  const redHarmRate = Math.round(sessions.filter((s) => s.harmColor === "red").length / sessions.length * 100);
  const avgEscalationTimeliness = Math.round(sessions.filter((s) => s.escalationTimely).length / sessions.length * 100);

  // Score buckets
  const scoreBuckets: Record<string, number> = {
    "0–40": 0, "40–60": 0, "60–75": 0, "75–85": 0, "85–100": 0,
  };
  for (const s of sessions) {
    if (s.compositeScore < 40) scoreBuckets["0–40"]!++;
    else if (s.compositeScore < 60) scoreBuckets["40–60"]!++;
    else if (s.compositeScore < 75) scoreBuckets["60–75"]!++;
    else if (s.compositeScore < 85) scoreBuckets["75–85"]!++;
    else scoreBuckets["85–100"]!++;
  }

  // Domain performance (proxy from available scores)
  const domainPerformance = buildDomainPerformance(sessions);

  // Hardest conditions
  const conditionMap = new Map<string, CohortSessionRecord[]>();
  for (const s of sessions) {
    const group = conditionMap.get(s.conditionKey) ?? [];
    group.push(s);
    conditionMap.set(s.conditionKey, group);
  }
  const hardestConditions: ConditionDifficultySummary[] = [...conditionMap.entries()]
    .filter(([, group]) => group.length >= MIN_COHORT_SIZE)
    .map(([key, group]) => ({
      conditionKey: key,
      conditionLabel: key.replace(/_/g, " "),
      avgScore: avg(group.map((s) => s.compositeScore)),
      avgHarmRate: group.filter((s) => s.harmColor !== "green").length / group.length,
      avgEscalationTimeliness: group.filter((s) => s.escalationTimely).length / group.length,
      sessionCount: group.length,
    }))
    .sort((a, b) => a.avgScore - b.avgScore)
    .slice(0, 5);

  // Common failures
  const commonFailures = detectCohortFailures(sessions, learnerCount);

  // Readiness distribution (simplified — based on score bands)
  const readinessDistribution = buildReadinessDistribution(sessions);

  // Remediation recommendations
  const cohortRemediationRecommendations = buildCohortRemediation(
    domainPerformance, hardestConditions, commonFailures, avgEscalationTimeliness,
  );

  return {
    cohortId, cohortLabel,
    sessionCount: sessions.length,
    learnerCount,
    period,
    avgCompositeScore,
    avgHarmIndexScore,
    greenHarmRate,
    redHarmRate,
    avgEscalationTimeliness,
    scoreBuckets,
    domainPerformance,
    hardestConditions,
    commonFailures,
    readinessDistribution,
    cohortRemediationRecommendations,
    computedAt: new Date().toISOString(),
  };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function buildDomainPerformance(sessions: CohortSessionRecord[]): DomainPerformanceSummary[] {
  const avg = (arr: number[]) =>
    arr.length > 0 ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;

  const domains: NcjmmDomain[] = [
    "recognize_cues", "analyze_cues", "prioritize_hypotheses",
    "generate_solutions", "take_action", "evaluate_outcomes",
  ];

  return domains.map((domain) => {
    const scores = sessions.map((s) => {
      switch (domain) {
        case "recognize_cues":        return s.clinicalJudgmentScore;
        case "analyze_cues":          return (s.clinicalJudgmentScore + s.monitorInterpretationScore) / 2;
        case "prioritize_hypotheses": return s.clinicalJudgmentScore * 0.9;
        case "generate_solutions":    return (s.clinicalJudgmentScore + s.timeToInterventionScore) / 2;
        case "take_action":           return s.timeToInterventionScore;
        case "evaluate_outcomes":     return (s.harmIndexScore + s.clinicalJudgmentScore) / 2;
        default:                      return s.compositeScore;
      }
    }).map(Math.round);

    const cohortAvg = avg(scores);
    const percentBelowPassing = Math.round(scores.filter((s) => s < 65).length / scores.length * 100);

    return {
      domain,
      cohortAvg,
      percentBelowPassing,
      trend: "unknown",  // Requires longitudinal data to compute trend
    };
  });
}

function detectCohortFailures(sessions: CohortSessionRecord[], learnerCount: number) {
  const results: CohortDashboard["commonFailures"] = [];

  const lateEscalation = sessions.filter((s) => !s.escalationTimely).length;
  if (lateEscalation / sessions.length > 0.3) {
    results.push({
      pattern: "repeated_delayed_escalation",
      description: "Escalation delayed in more than 30% of sessions",
      affectedCount: lateEscalation,
      affectedPct: Math.round(lateEscalation / sessions.length * 100),
      recommendation: "Implement cohort-wide escalation simulation drill. Review SBAR training.",
    });
  }

  const redHarm = sessions.filter((s) => s.harmColor === "red").length;
  if (redHarm / sessions.length > 0.15) {
    results.push({
      pattern: "persistent_harm_events",
      description: "Red Harm Index in more than 15% of sessions",
      affectedCount: redHarm,
      affectedPct: Math.round(redHarm / sessions.length * 100),
      recommendation: "Mandatory harm-event replay review for affected learners. Consider supervised simulation.",
    });
  }

  const highMissedOpportunity = sessions.filter((s) => s.missedOpportunityCount >= 2).length;
  if (highMissedOpportunity / sessions.length > 0.25) {
    results.push({
      pattern: "missed_critical_alarms",
      description: "Multiple missed opportunities in > 25% of sessions",
      affectedCount: highMissedOpportunity,
      affectedPct: Math.round(highMissedOpportunity / sessions.length * 100),
      recommendation: "Focus on deterioration recognition. Use replay engine to review missed turning points.",
    });
  }

  return results;
}

function buildReadinessDistribution(sessions: CohortSessionRecord[]): ReadinessDistribution[] {
  const domains: ReadinessDomain[] = [
    "telemetry", "icu", "rapid_response", "ecg_arrhythmia",
    "shock_recognition", "rt_critical_care", "new_graduate_safe_practice",
  ];

  return domains.map((domain) => {
    const scores = sessions.map((s) => s.compositeScore);
    const total = scores.length;
    return {
      domain,
      notReady:  Math.round(scores.filter((v) => v < 40).length / total * 100),
      developing: Math.round(scores.filter((v) => v >= 40 && v < 65).length / total * 100),
      nearReady:  Math.round(scores.filter((v) => v >= 65 && v < 80).length / total * 100),
      ready:      Math.round(scores.filter((v) => v >= 80 && v < 92).length / total * 100),
      proficient: Math.round(scores.filter((v) => v >= 92).length / total * 100),
    };
  });
}

function buildCohortRemediation(
  domains: DomainPerformanceSummary[],
  conditions: ConditionDifficultySummary[],
  failures: CohortDashboard["commonFailures"],
  escalationTimeliness: number,
): string[] {
  const recommendations: string[] = [];

  const weakestDomain = domains.sort((a, b) => a.cohortAvg - b.cohortAvg)[0];
  if (weakestDomain && weakestDomain.cohortAvg < 65) {
    recommendations.push(
      `Cohort-wide ${weakestDomain.domain.replace(/_/g, " ")} training required (avg ${weakestDomain.cohortAvg}/100)`,
    );
  }

  if (conditions[0] && conditions[0].avgScore < 60) {
    recommendations.push(
      `Schedule ${conditions[0].conditionLabel} simulation series — lowest average score (${conditions[0].avgScore})`,
    );
  }

  if (escalationTimeliness < 60) {
    recommendations.push("SBAR / escalation training — fewer than 60% escalate on time");
  }

  if (failures.some((f) => f.pattern === "persistent_harm_events")) {
    recommendations.push("Mandatory harm-event replay review session for all cohort members");
  }

  if (recommendations.length === 0) {
    recommendations.push("Cohort performance meets minimum thresholds. Advance to higher-difficulty simulations.");
  }

  return recommendations.slice(0, 5);
}

// ─── API helper ───────────────────────────────────────────────────────────────

/**
 * Convert stored MonitorSessionReport summaries to CohortSessionRecord[] for analysis.
 * The input JSON shape matches what is stored in ClinicalScenarioSimulationRun.summary.
 */
export function sessionSummariesToCohortRecords(
  rawSummaries: Array<{
    conditionKey?: string;
    mode?: string;
    compositeScore?: number;
    clinicalJudgmentScore?: number;
    harmIndexScore?: number;
    harmColor?: string;
    [key: string]: unknown;
  }>,
): CohortSessionRecord[] {
  return rawSummaries.map((s) => ({
    conditionKey: String(s.conditionKey ?? "unknown"),
    mode: String(s.mode ?? "general"),
    compositeScore: Number(s.compositeScore ?? 0),
    clinicalJudgmentScore: Number(s.clinicalJudgmentScore ?? 0),
    monitorInterpretationScore: Number((s as Record<string, unknown>).monitorInterpretationScore ?? 0),
    timeToInterventionScore: Number((s as Record<string, unknown>).timeToInterventionScore ?? 0),
    harmIndexScore: Number(s.harmIndexScore ?? 0),
    harmColor: (["green", "yellow", "red"].includes(String(s.harmColor)) ? s.harmColor : "green") as "green" | "yellow" | "red",
    escalationTimely: Boolean((s as Record<string, unknown>).escalationTimely),
    missedOpportunityCount: Number((s as Record<string, unknown>).missedOpportunityCount ?? 0),
    remediationCompleted: Boolean((s as Record<string, unknown>).remediationCompleted),
    completedAt: String((s as Record<string, unknown>).completedAt ?? new Date().toISOString()),
  }));
}
