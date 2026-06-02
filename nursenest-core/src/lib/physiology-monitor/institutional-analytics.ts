/**
 * Institutional Analytics
 *
 * Cohort-level analytics for nursing schools, hospital educators, residency
 * programs, and orientation teams. Aggregates LearnerGrowthProfile[] data
 * into cohort dashboards, competency heatmaps, and risk reports.
 */

import type { LearnerGrowthProfile } from "./learner-profile";
import type { NcjmmDomain } from "./clinical-judgment-engine";
import type { HarmLevel } from "./harm-index";
import type { SimulationProfession } from "./simulation-catalog";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CohortAnalytics {
  cohortId: string;
  cohortName: string;
  generatedAt: string;
  learnerCount: number;
  totalSessions: number;

  // ── Domain performance ─────────────────────────────────────
  domainAverages: Record<NcjmmDomain, number>;
  domainDistribution: Record<NcjmmDomain, ScoreDistribution>;

  // ── Safety ────────────────────────────────────────────────
  harmDistribution: Record<HarmLevel, number>;
  highRiskLearners: HighRiskLearner[];
  safetyIncidentRate: number;   // % of sessions with severe/arrest harm

  // ── Common failures ───────────────────────────────────────
  commonFailurePatterns: FailurePattern[];

  // ── Timing ────────────────────────────────────────────────
  averageRecognitionTimeSec: number;
  averageInterventionTimeSec: number;

  // ── Competency readiness ──────────────────────────────────
  telemetryReadyCount: number;
  telemetryReadyPercent: number;
  icuReadyCount: number;
  icuReadyPercent: number;

  // ── Condition coverage ────────────────────────────────────
  conditionCoverageGaps: string[];
  mostPracticedConditions: string[];
  leastPracticedConditions: string[];

  // ── Trend ─────────────────────────────────────────────────
  cohortCompositeTrend: "improving" | "stable" | "declining";
  monthlyProgressSummary: MonthlyProgress[];

  // ── Recommendations ───────────────────────────────────────
  curriculumRecommendations: CurriculumRecommendation[];
}

export interface ScoreDistribution {
  below50: number;
  range50_65: number;
  range65_80: number;
  above80: number;
  mean: number;
  median: number;
}

export interface HighRiskLearner {
  learnerId: string;
  riskReason: string;
  urgency: "monitor" | "intervene" | "remediation_required";
  lastSessionDate: string;
  compositeScore: number;
}

export interface FailurePattern {
  pattern: string;
  affectedLearnerCount: number;
  affectedPercent: number;
  relatedDomain: NcjmmDomain;
  conditionKeys: string[];
  recommendedAction: string;
}

export interface MonthlyProgress {
  month: string;
  averageComposite: number;
  sessionsCompleted: number;
  newTelemetryReady: number;
}

export interface CurriculumRecommendation {
  priority: 1 | 2 | 3;
  recommendation: string;
  rationale: string;
  targetDomain?: NcjmmDomain;
  affectedPercent: number;
}

// ─── Analytics builder ────────────────────────────────────────────────────────

export function buildCohortAnalytics(
  cohortId: string,
  cohortName: string,
  profiles: LearnerGrowthProfile[],
): CohortAnalytics {
  const now = new Date().toISOString();
  const totalSessions = profiles.reduce((a, p) => a + p.sessionCount, 0);

  const domains: NcjmmDomain[] = [
    "recognize_cues", "analyze_cues", "prioritize_hypotheses",
    "generate_solutions", "take_action", "evaluate_outcomes",
  ];

  // ── Domain averages and distributions ──
  const domainAverages: Record<string, number> = {};
  const domainDistribution: Record<string, ScoreDistribution> = {};

  for (const domain of domains) {
    const scores = profiles.map((p) => p.ncjmmTrends[domain]?.current ?? 50).filter((s) => s > 0);
    domainAverages[domain] = scores.length > 0 ? mean(scores) : 0;
    domainDistribution[domain] = computeDistribution(scores);
  }

  // ── Harm distribution ──
  const harmLevels: HarmLevel[] = ["none", "near_miss", "moderate", "severe", "preventable_arrest"];
  const harmDistribution: Record<string, number> = {};
  for (const level of harmLevels) {
    harmDistribution[level] = profiles.reduce((acc, p) => {
      return acc + p.harmPatterns.filter((h) => h.harmLevel === level).reduce((a, h) => a + h.occurrenceCount, 0);
    }, 0);
  }

  const severeCount = (harmDistribution.severe ?? 0) + (harmDistribution.preventable_arrest ?? 0);
  const safetyIncidentRate = totalSessions > 0 ? (severeCount / totalSessions) * 100 : 0;

  // ── High risk learners ──
  const highRiskLearners = identifyHighRiskLearners(profiles);

  // ── Common failure patterns ──
  const commonFailurePatterns = identifyFailurePatterns(profiles, domains as NcjmmDomain[]);

  // ── Timing ──
  const recTimes = profiles
    .map((p) => p.recognitionTimeTrend.current)
    .filter((t) => t > 0 && t < 1000);
  const intTimes = profiles
    .map((p) => p.interventionTimeTrend.current)
    .filter((t) => t > 0 && t < 2000);

  // ── Competency readiness ──
  const telemetryReadyCount = profiles.filter((p) => p.telemetryReadySessions >= 3).length;
  const icuReadyCount = profiles.filter((p) => p.icuReadySessions >= 3).length;

  // ── Condition coverage gaps ──
  const allCoveredConditions = profiles.flatMap((p) => p.conditionsCovered);
  const conditionFrequency = allCoveredConditions.reduce<Record<string, number>>((acc, c) => {
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});

  const sortedByFreq = Object.entries(conditionFrequency).sort((a, b) => b[1] - a[1]);
  const mostPracticed = sortedByFreq.slice(0, 5).map(([c]) => c);
  const leastPracticed = sortedByFreq.slice(-5).map(([c]) => c);
  const coverageGaps = findCoverageGaps(profiles);

  // ── Cohort trend ──
  const avgComposites = profiles.map((p) => p.compositeTrend.current);
  const compositeAvg = mean(avgComposites);
  const slopes = profiles.map((p) => p.compositeTrend.slope);
  const avgSlope = mean(slopes);
  const cohortCompositeTrend: CohortAnalytics["cohortCompositeTrend"] =
    avgSlope > 0.5 ? "improving" : avgSlope < -0.5 ? "declining" : "stable";

  // ── Curriculum recommendations ──
  const curriculumRecommendations = buildCurriculumRecommendations(
    profiles,
    domains as NcjmmDomain[],
    domainAverages as Record<NcjmmDomain, number>,
    safetyIncidentRate,
    coverageGaps,
  );

  return {
    cohortId,
    cohortName,
    generatedAt: now,
    learnerCount: profiles.length,
    totalSessions,
    domainAverages: domainAverages as Record<NcjmmDomain, number>,
    domainDistribution: domainDistribution as Record<NcjmmDomain, ScoreDistribution>,
    harmDistribution: harmDistribution as Record<HarmLevel, number>,
    highRiskLearners,
    safetyIncidentRate,
    commonFailurePatterns,
    averageRecognitionTimeSec: recTimes.length > 0 ? mean(recTimes) : 0,
    averageInterventionTimeSec: intTimes.length > 0 ? mean(intTimes) : 0,
    telemetryReadyCount,
    telemetryReadyPercent: profiles.length > 0 ? (telemetryReadyCount / profiles.length) * 100 : 0,
    icuReadyCount,
    icuReadyPercent: profiles.length > 0 ? (icuReadyCount / profiles.length) * 100 : 0,
    conditionCoverageGaps: coverageGaps,
    mostPracticedConditions: mostPracticed,
    leastPracticedConditions: leastPracticed,
    cohortCompositeTrend,
    monthlyProgressSummary: buildMonthlyProgress(profiles),
    curriculumRecommendations,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function computeDistribution(scores: number[]): ScoreDistribution {
  if (scores.length === 0) return { below50: 0, range50_65: 0, range65_80: 0, above80: 0, mean: 0, median: 0 };
  const sorted = [...scores].sort((a, b) => a - b);
  return {
    below50: scores.filter((s) => s < 50).length,
    range50_65: scores.filter((s) => s >= 50 && s < 65).length,
    range65_80: scores.filter((s) => s >= 65 && s < 80).length,
    above80: scores.filter((s) => s >= 80).length,
    mean: Math.round(mean(scores)),
    median: Math.round(sorted[Math.floor(sorted.length / 2)] ?? 0),
  };
}

function identifyHighRiskLearners(profiles: LearnerGrowthProfile[]): HighRiskLearner[] {
  return profiles
    .filter((p) => {
      const hasUnsafeTrend = p.unsafeTrends.some((u) => u.severity === "critical");
      const lowComposite = p.compositeTrend.current < 45;
      const recurringHarm = p.harmPatterns.some(
        (h) => (h.harmLevel === "severe" || h.harmLevel === "preventable_arrest") && h.isRecurring,
      );
      return hasUnsafeTrend || lowComposite || recurringHarm;
    })
    .map((p) => {
      const hasArrest = p.harmPatterns.some((h) => h.harmLevel === "preventable_arrest" && h.isRecurring);
      const urgency: HighRiskLearner["urgency"] = hasArrest
        ? "remediation_required"
        : p.compositeTrend.current < 40
        ? "intervene"
        : "monitor";

      return {
        learnerId: p.learnerId,
        riskReason: hasArrest
          ? "Recurring preventable arrest"
          : p.compositeTrend.current < 45
          ? "Consistently low composite score"
          : "Unsafe clinical trends detected",
        urgency,
        lastSessionDate: p.lastSessionDate,
        compositeScore: Math.round(p.compositeTrend.current),
      };
    })
    .sort((a, b) => {
      const order = { remediation_required: 0, intervene: 1, monitor: 2 };
      return order[a.urgency] - order[b.urgency];
    });
}

function identifyFailurePatterns(
  profiles: LearnerGrowthProfile[],
  domains: NcjmmDomain[],
): FailurePattern[] {
  const patterns: FailurePattern[] = [];

  for (const domain of domains) {
    const weakLearners = profiles.filter((p) => p.ncjmmTrends[domain].rollingAverage < 55);
    if (weakLearners.length < 2) continue;

    const affectedPercent = (weakLearners.length / profiles.length) * 100;
    if (affectedPercent < 20) continue;

    const conditionKeys = [...new Set(
      weakLearners.flatMap((p) => p.simulationsFailed),
    )].slice(0, 3);

    patterns.push({
      pattern: `Weak ${domain.replace(/_/g, " ")} across cohort`,
      affectedLearnerCount: weakLearners.length,
      affectedPercent: Math.round(affectedPercent),
      relatedDomain: domain,
      conditionKeys,
      recommendedAction: buildDomainRecommendation(domain),
    });
  }

  return patterns.sort((a, b) => b.affectedPercent - a.affectedPercent);
}

function buildDomainRecommendation(domain: NcjmmDomain): string {
  const RECOMMENDATIONS: Record<NcjmmDomain, string> = {
    recognize_cues:        "Add dedicated monitor recognition drills and increase telemetry observation hours.",
    analyze_cues:          "Integrate more pathophysiology content — case studies with mechanism explanations.",
    prioritize_hypotheses: "More NGN prioritization question sets; structured debriefing on clinical reasoning.",
    generate_solutions:    "Protocol-based flashcard reinforcement; increase simulation density.",
    take_action:           "Timed simulation practice with strict response-time requirements; ACLS refresher.",
    evaluate_outcomes:     "Post-intervention trend analysis exercises; reassessment documentation requirements.",
  };
  return RECOMMENDATIONS[domain];
}

function findCoverageGaps(profiles: LearnerGrowthProfile[]): string[] {
  const CORE_CONDITIONS = [
    "Sepsis", "Anterior STEMI", "Atrial Fibrillation with RVR", "Pulmonary Embolism",
    "ARDS", "Hyperkalemia", "DKA", "Anaphylaxis", "GI Bleed / Hypovolemia",
    "Ventricular Tachycardia → VF",
  ];

  return CORE_CONDITIONS.filter((condition) => {
    const covered = profiles.filter((p) =>
      p.conditionsCovered.some((c) => c.toLowerCase().includes(condition.toLowerCase().split(" ")[0]!.toLowerCase()))
    );
    return covered.length < profiles.length * 0.5;
  });
}

function buildMonthlyProgress(profiles: LearnerGrowthProfile[]): MonthlyProgress[] {
  // Group sessions by month using lastSessionDate as proxy
  const months = new Map<string, { composites: number[]; sessions: number; newReady: number }>();

  for (const profile of profiles) {
    if (!profile.lastSessionDate) continue;
    const month = profile.lastSessionDate.slice(0, 7); // YYYY-MM
    const existing = months.get(month) ?? { composites: [], sessions: 0, newReady: 0 };
    existing.composites.push(profile.compositeTrend.current);
    existing.sessions += profile.sessionCount;
    if (profile.telemetryReadySessions >= 3) existing.newReady++;
    months.set(month, existing);
  }

  return Array.from(months.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      averageComposite: Math.round(mean(data.composites)),
      sessionsCompleted: data.sessions,
      newTelemetryReady: data.newReady,
    }));
}

function buildCurriculumRecommendations(
  profiles: LearnerGrowthProfile[],
  domains: NcjmmDomain[],
  domainAverages: Record<NcjmmDomain, number>,
  safetyIncidentRate: number,
  coverageGaps: string[],
): CurriculumRecommendation[] {
  const recommendations: CurriculumRecommendation[] = [];

  // Safety
  if (safetyIncidentRate > 15) {
    recommendations.push({
      priority: 1,
      recommendation: "Mandatory ACLS/BLES skills refresher for all learners",
      rationale: `${Math.round(safetyIncidentRate)}% of sessions had severe harm events — above acceptable threshold.`,
      affectedPercent: safetyIncidentRate,
    });
  }

  // Domain gaps
  const weakestDomain = domains.reduce((prev, curr) =>
    (domainAverages[curr] ?? 100) < (domainAverages[prev] ?? 100) ? curr : prev,
  );

  if ((domainAverages[weakestDomain] ?? 100) < 60) {
    recommendations.push({
      priority: 1,
      recommendation: `Increase ${weakestDomain.replace(/_/g, " ")} content density`,
      rationale: `Cohort average ${Math.round(domainAverages[weakestDomain] ?? 0)}/100 — below minimum competency threshold.`,
      targetDomain: weakestDomain,
      affectedPercent: Math.round(
        (profiles.filter((p) => p.ncjmmTrends[weakestDomain].current < 60).length / profiles.length) * 100,
      ),
    });
  }

  // Coverage gaps
  if (coverageGaps.length > 3) {
    recommendations.push({
      priority: 2,
      recommendation: `Add simulation scenarios for: ${coverageGaps.slice(0, 3).join(", ")}`,
      rationale: "Core clinical conditions have < 50% cohort coverage.",
      affectedPercent: 50,
    });
  }

  // ECG recognition
  const avgRecognition = mean(profiles.map((p) => p.ncjmmTrends.recognize_cues.current));
  if (avgRecognition < 65) {
    recommendations.push({
      priority: 2,
      recommendation: "Add dedicated ECG / telemetry recognition module",
      rationale: `Recognition domain average ${Math.round(avgRecognition)}/100 — ECG pattern recognition training needed.`,
      targetDomain: "recognize_cues",
      affectedPercent: Math.round(
        (profiles.filter((p) => p.ncjmmTrends.recognize_cues.current < 65).length / profiles.length) * 100,
      ),
    });
  }

  // General enrichment
  const readyCount = profiles.filter((p) => p.telemetryReadySessions >= 3).length;
  const readyPercent = (readyCount / profiles.length) * 100;
  if (readyPercent < 30) {
    recommendations.push({
      priority: 3,
      recommendation: "Increase simulation frequency — minimum 2 sessions per week per learner",
      rationale: `Only ${Math.round(readyPercent)}% of learners have achieved Telemetry Ready status.`,
      affectedPercent: 100 - Math.round(readyPercent),
    });
  }

  return recommendations.sort((a, b) => a.priority - b.priority);
}
