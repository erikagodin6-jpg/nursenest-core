/**
 * Longitudinal Learner Profile
 *
 * Aggregates MonitorSessionReport data across multiple sessions into a persistent
 * growth profile. Tracks NCJMM domain trends, harm patterns, timing trends,
 * competency trajectory, and readiness indicators.
 *
 * This is the intelligence layer that makes the platform adaptive over time
 * rather than treating each session as isolated.
 */

import type { NcjmmDomain } from "./clinical-judgment-engine";
import type { HarmLevel } from "./harm-index";
import type { MonitorMode } from "./physiology-state";
import type { MonitorSessionReport } from "./monitor-session-report";
import type { SimulationProfession } from "./simulation-catalog";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrendPoint {
  sessionIndex: number;
  value: number;
  date: string;
}

export interface TrendLine {
  points: TrendPoint[];
  /** Linear regression slope — positive = improving. */
  slope: number;
  /** Latest value. */
  current: number;
  /** Rolling 3-session average. */
  rollingAverage: number;
  direction: "improving" | "declining" | "stable";
}

export interface HarmPattern {
  harmLevel: HarmLevel;
  occurrenceCount: number;
  conditionKeys: string[];
  /** Consistently repeated harm type = pattern worth flagging. */
  isRecurring: boolean;
  lastSeenDate: string;
}

export interface UnsafeTrend {
  domain: string;
  description: string;
  sessionCount: number;
  severity: "moderate" | "critical";
  flaggedDate: string;
}

export interface CompetencyTrajectoryPoint {
  sessionIndex: number;
  date: string;
  domain: string;
  level: string;
  score: number;
}

export interface ReadinessIndicator {
  indicator: string;
  met: boolean;
  currentValue: string;
  target: string;
  sessionsAtTarget: number;
}

export interface LearnerGrowthProfile {
  learnerId: string;
  profession: SimulationProfession;
  sessionCount: number;
  firstSessionDate: string;
  lastSessionDate: string;

  // ── NCJMM domain trends ──────────────────────────────────
  ncjmmTrends: Record<NcjmmDomain, TrendLine>;

  // ── Monitor interpretation ────────────────────────────────
  monitorInterpretationTrend: TrendLine;

  // ── Timing ────────────────────────────────────────────────
  recognitionTimeTrend: TrendLine;
  interventionTimeTrend: TrendLine;
  timeToInterventionTrend: TrendLine;

  // ── Safety ────────────────────────────────────────────────
  harmPatterns: HarmPattern[];
  harmIndexTrend: TrendLine;
  unsafeTrends: UnsafeTrend[];

  // ── Competency ────────────────────────────────────────────
  competencyTrajectory: CompetencyTrajectoryPoint[];

  // ── Session coverage ──────────────────────────────────────
  conditionsCovered: string[];
  simulationsPassed: string[];
  simulationsFailed: string[];

  // ── Composite ─────────────────────────────────────────────
  compositeTrend: TrendLine;
  strengthAreas: string[];
  weakAreas: string[];
  readinessIndicators: ReadinessIndicator[];

  // ── Clearance status ─────────────────────────────────────
  telemetryReadySessions: number;
  icuReadySessions: number;
}

// ─── Profile builder ──────────────────────────────────────────────────────────

export function buildLearnerGrowthProfile(
  learnerId: string,
  profession: SimulationProfession,
  sessions: MonitorSessionReport[],
): LearnerGrowthProfile {
  if (sessions.length === 0) {
    return createEmptyProfile(learnerId, profession);
  }

  const sorted = [...sessions].sort(
    (a, b) => new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime(),
  );

  const ncjmmDomains: NcjmmDomain[] = [
    "recognize_cues", "analyze_cues", "prioritize_hypotheses",
    "generate_solutions", "take_action", "evaluate_outcomes",
  ];

  // ── NCJMM domain trends ──
  const ncjmmTrends = Object.fromEntries(
    ncjmmDomains.map((domain) => {
      const points = sorted.map((s, i) => ({
        sessionIndex: i,
        value: s.clinicalJudgment.domainScores[domain]?.score ?? 50,
        date: s.generatedAt,
      }));
      return [domain, computeTrendLine(points)];
    }),
  ) as Record<NcjmmDomain, TrendLine>;

  // ── Monitor interpretation trend ──
  const monitorPoints = sorted.map((s, i) => ({
    sessionIndex: i,
    value: s.monitorInterpretationScore,
    date: s.generatedAt,
  }));

  // ── Timing trends ──
  const recognitionPoints = sorted.map((s, i) => ({
    sessionIndex: i,
    value: s.timeToIntervention.recognitionTimeSec ?? 300,
    date: s.generatedAt,
  }));

  const interventionPoints = sorted.map((s, i) => ({
    sessionIndex: i,
    value: s.timeToIntervention.firstInterventionTimeSec ?? 600,
    date: s.generatedAt,
  }));

  const ttiPoints = sorted.map((s, i) => ({
    sessionIndex: i,
    value: s.scores.timeToIntervention,
    date: s.generatedAt,
  }));

  // ── Harm patterns ──
  const harmPatterns = computeHarmPatterns(sorted);
  const harmPoints = sorted.map((s, i) => ({
    sessionIndex: i,
    value: s.scores.harmIndex,
    date: s.generatedAt,
  }));

  // ── Unsafe trends ──
  const unsafeTrends = detectUnsafeTrends(sorted, ncjmmTrends);

  // ── Competency trajectory ──
  const competencyTrajectory = buildCompetencyTrajectory(sorted);

  // ── Session coverage ──
  const conditionsCovered = [...new Set(sorted.map((s) => s.summary.conditionLabel))];
  const simulationsPassed = sorted
    .filter((s) => s.scores.composite >= 65)
    .map((s) => s.summary.conditionLabel);
  const simulationsFailed = sorted
    .filter((s) => s.scores.composite < 65)
    .map((s) => s.summary.conditionLabel);

  // ── Composite ──
  const compositePoints = sorted.map((s, i) => ({
    sessionIndex: i,
    value: s.scores.composite,
    date: s.generatedAt,
  }));
  const compositeTrend = computeTrendLine(compositePoints);

  // ── Strengths and weaknesses ──
  const strengthAreas = ncjmmDomains
    .filter((d) => (ncjmmTrends[d].current ?? 0) >= 75)
    .map((d) => d.replace(/_/g, " "));

  const weakAreas = ncjmmDomains
    .filter((d) => (ncjmmTrends[d].current ?? 0) < 55)
    .map((d) => d.replace(/_/g, " "));

  // ── Readiness ──
  const readinessIndicators = buildReadinessIndicators(sorted, ncjmmTrends, harmPatterns);

  // ── Clearance counts ──
  const telemetryReadySessions = sorted.filter(
    (s) => s.scores.composite >= 70 && s.harmIndex.color === "green",
  ).length;

  const icuReadySessions = sorted.filter(
    (s) => s.scores.composite >= 80 && s.harmIndex.color === "green" && s.summary.mode === "icu",
  ).length;

  return {
    learnerId,
    profession,
    sessionCount: sorted.length,
    firstSessionDate: sorted[0]!.generatedAt,
    lastSessionDate: sorted[sorted.length - 1]!.generatedAt,
    ncjmmTrends,
    monitorInterpretationTrend: computeTrendLine(monitorPoints),
    recognitionTimeTrend: computeTrendLine(recognitionPoints, true),
    interventionTimeTrend: computeTrendLine(interventionPoints, true),
    timeToInterventionTrend: computeTrendLine(ttiPoints),
    harmPatterns,
    harmIndexTrend: computeTrendLine(harmPoints),
    unsafeTrends,
    competencyTrajectory,
    conditionsCovered,
    simulationsPassed,
    simulationsFailed,
    compositeTrend,
    strengthAreas,
    weakAreas,
    readinessIndicators,
    telemetryReadySessions,
    icuReadySessions,
  };
}

// ─── Trend computation ────────────────────────────────────────────────────────

function computeTrendLine(points: TrendPoint[], lowerIsBetter = false): TrendLine {
  if (points.length === 0) {
    return { points: [], slope: 0, current: 0, rollingAverage: 0, direction: "stable" };
  }

  const current = points[points.length - 1]!.value;
  const last3 = points.slice(-3).map((p) => p.value);
  const rollingAverage = last3.reduce((a, b) => a + b, 0) / last3.length;

  // Linear regression slope
  const n = points.length;
  const sumX = points.reduce((a, p) => a + p.sessionIndex, 0);
  const sumY = points.reduce((a, p) => a + p.value, 0);
  const sumXY = points.reduce((a, p) => a + p.sessionIndex * p.value, 0);
  const sumX2 = points.reduce((a, p) => a + p.sessionIndex * p.sessionIndex, 0);
  const slope = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX) : 0;

  // Determine direction: for "lowerIsBetter" metrics (time), negative slope = improving
  const improving = lowerIsBetter ? slope < -0.5 : slope > 0.5;
  const declining = lowerIsBetter ? slope > 0.5 : slope < -0.5;

  return {
    points,
    slope,
    current,
    rollingAverage,
    direction: improving ? "improving" : declining ? "declining" : "stable",
  };
}

// ─── Harm pattern analysis ─────────────────────────────────────────────────────

function computeHarmPatterns(sessions: MonitorSessionReport[]): HarmPattern[] {
  const levels: HarmLevel[] = ["near_miss", "moderate", "severe", "preventable_arrest"];
  return levels
    .map((level) => {
      const matching = sessions.filter((s) => s.harmIndex.level === level);
      return {
        harmLevel: level,
        occurrenceCount: matching.length,
        conditionKeys: [...new Set(matching.map((s) => s.summary.conditionLabel))],
        isRecurring: matching.length >= 3,
        lastSeenDate: matching[matching.length - 1]?.generatedAt ?? "",
      };
    })
    .filter((p) => p.occurrenceCount > 0);
}

// ─── Unsafe trend detection ───────────────────────────────────────────────────

function detectUnsafeTrends(
  sessions: MonitorSessionReport[],
  ncjmmTrends: Record<NcjmmDomain, TrendLine>,
): UnsafeTrend[] {
  const trends: UnsafeTrend[] = [];
  const now = new Date().toISOString();

  // Repeated preventable arrests
  const arrests = sessions.filter((s) => s.harmIndex.level === "preventable_arrest");
  if (arrests.length >= 2) {
    trends.push({
      domain: "Patient Safety",
      description: `Preventable cardiac arrest in ${arrests.length} sessions — ACLS response training required.`,
      sessionCount: arrests.length,
      severity: "critical",
      flaggedDate: now,
    });
  }

  // Declining take_action domain
  if (ncjmmTrends.take_action.direction === "declining" && ncjmmTrends.take_action.current < 50) {
    trends.push({
      domain: "Take Action",
      description: "Intervention timing and correctness is worsening across recent sessions.",
      sessionCount: sessions.length,
      severity: "moderate",
      flaggedDate: now,
    });
  }

  // Consistently missing recognition
  const noRecognition = sessions.filter((s) => s.clinicalJudgment.domainScores.recognize_cues.score < 40);
  if (noRecognition.length >= 3) {
    trends.push({
      domain: "Recognize Cues",
      description: "Consistent failure to document recognition events — pattern recognition training needed.",
      sessionCount: noRecognition.length,
      severity: "moderate",
      flaggedDate: now,
    });
  }

  return trends;
}

// ─── Competency trajectory ────────────────────────────────────────────────────

function buildCompetencyTrajectory(sessions: MonitorSessionReport[]): CompetencyTrajectoryPoint[] {
  return sessions.flatMap((s, i) => {
    const passport = s.competencyPassport;
    if (!passport) return [];
    return Object.values(passport.domains).map((d) => ({
      sessionIndex: i,
      date: s.generatedAt,
      domain: d.label,
      level: d.level,
      score: d.progressWithinLevel,
    }));
  });
}

// ─── Readiness indicators ─────────────────────────────────────────────────────

function buildReadinessIndicators(
  sessions: MonitorSessionReport[],
  ncjmmTrends: Record<NcjmmDomain, TrendLine>,
  harmPatterns: HarmPattern[],
): ReadinessIndicator[] {
  const last5 = sessions.slice(-5);
  const avgComposite = last5.reduce((a, s) => a + s.scores.composite, 0) / (last5.length || 1);
  const avgHarm = last5.reduce((a, s) => a + s.scores.harmIndex, 0) / (last5.length || 1);
  const recentSevereHarm = harmPatterns.some(
    (p) => (p.harmLevel === "severe" || p.harmLevel === "preventable_arrest") && p.isRecurring,
  );

  return [
    {
      indicator: "Consistent composite score ≥ 70",
      met: avgComposite >= 70,
      currentValue: `${Math.round(avgComposite)}/100 (5-session avg)`,
      target: "≥ 70/100",
      sessionsAtTarget: last5.filter((s) => s.scores.composite >= 70).length,
    },
    {
      indicator: "No recurring severe harm events",
      met: !recentSevereHarm,
      currentValue: recentSevereHarm ? "Recurring severe harm detected" : "No recurring harm",
      target: "Zero recurring severe harm",
      sessionsAtTarget: last5.filter((s) => s.harmIndex.color === "green").length,
    },
    {
      indicator: "Recognition score ≥ 65",
      met: ncjmmTrends.recognize_cues.rollingAverage >= 65,
      currentValue: `${Math.round(ncjmmTrends.recognize_cues.rollingAverage)}/100`,
      target: "≥ 65/100",
      sessionsAtTarget: last5.filter((s) => s.clinicalJudgment.domainScores.recognize_cues.score >= 65).length,
    },
    {
      indicator: "Take Action score ≥ 65",
      met: ncjmmTrends.take_action.rollingAverage >= 65,
      currentValue: `${Math.round(ncjmmTrends.take_action.rollingAverage)}/100`,
      target: "≥ 65/100",
      sessionsAtTarget: last5.filter((s) => s.clinicalJudgment.domainScores.take_action.score >= 65).length,
    },
    {
      indicator: "Harm Index consistently ≥ 80",
      met: avgHarm >= 80,
      currentValue: `${Math.round(avgHarm)}/100 (5-session avg)`,
      target: "≥ 80/100",
      sessionsAtTarget: last5.filter((s) => s.scores.harmIndex >= 80).length,
    },
    {
      indicator: "Minimum 5 sessions completed",
      met: sessions.length >= 5,
      currentValue: `${sessions.length} sessions`,
      target: "≥ 5 sessions",
      sessionsAtTarget: sessions.length,
    },
  ];
}

// ─── Empty profile factory ────────────────────────────────────────────────────

function createEmptyProfile(learnerId: string, profession: SimulationProfession): LearnerGrowthProfile {
  const emptyTrend: TrendLine = { points: [], slope: 0, current: 0, rollingAverage: 0, direction: "stable" };
  const domains: NcjmmDomain[] = [
    "recognize_cues", "analyze_cues", "prioritize_hypotheses",
    "generate_solutions", "take_action", "evaluate_outcomes",
  ];

  return {
    learnerId,
    profession,
    sessionCount: 0,
    firstSessionDate: "",
    lastSessionDate: "",
    ncjmmTrends: Object.fromEntries(domains.map((d) => [d, { ...emptyTrend }])) as Record<NcjmmDomain, TrendLine>,
    monitorInterpretationTrend: emptyTrend,
    recognitionTimeTrend: emptyTrend,
    interventionTimeTrend: emptyTrend,
    timeToInterventionTrend: emptyTrend,
    harmPatterns: [],
    harmIndexTrend: emptyTrend,
    unsafeTrends: [],
    competencyTrajectory: [],
    conditionsCovered: [],
    simulationsPassed: [],
    simulationsFailed: [],
    compositeTrend: emptyTrend,
    strengthAreas: [],
    weakAreas: [],
    readinessIndicators: [],
    telemetryReadySessions: 0,
    icuReadySessions: 0,
  };
}
