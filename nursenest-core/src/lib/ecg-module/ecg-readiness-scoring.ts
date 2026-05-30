/**
 * ECG Readiness Scoring — Multi-Domain Readiness Dashboard
 *
 * Aggregates performance data from detective mode, deterioration engine,
 * compare & contrast, and telemetry shift into per-domain readiness scores.
 *
 * Eight competency domains correspond to the existing ECG_COMPETENCY_DOMAINS
 * in ecg-competency-domains.ts, providing a unified scoring surface.
 */

import type { DetectiveSessionScore } from "@/lib/ecg-module/ecg-detective-mode";

// ─── Readiness scoring types ──────────────────────────────────────────────────

export type EcgReadinessDomainId =
  | "rhythm_recognition"
  | "interval_analysis"
  | "ischemia_stemi"
  | "acls_critical_rhythms"
  | "telemetry_interpretation"
  | "conduction_disorders"
  | "paced_rhythms"
  | "electrolyte_abnormalities";

export type ReadinessTrend = "improving" | "stable" | "declining" | "insufficient_data";

export type EcgReadinessDomainScore = {
  domainId: EcgReadinessDomainId;
  label: string;
  score: number;               // 0–100
  previousScore: number | null;
  trend: ReadinessTrend;
  sessionCount: number;
  lastActivityAt: string | null;
  weakRhythms: string[];        // rhythm keys below 70% in this domain
  strongRhythms: string[];      // rhythm keys above 90% in this domain
  recommendedActivity: ReadinessRecommendedActivity;
};

export type ReadinessRecommendedActivity = {
  type: "detective_mode" | "compare_contrast" | "deterioration" | "telemetry_shift" | "lesson_review";
  label: string;
  rhythmKey?: string;
  pairId?: string;
  pathwayId?: string;
};

export type EcgReadinessProfile = {
  learnerId: string;
  overallScore: number;            // weighted average across all domains
  overallTrend: ReadinessTrend;
  domains: EcgReadinessDomainScore[];
  /** Percentage of the 29 rhythms where the learner has demonstrated mastery (≥ 85%) */
  rhythmMasteryPercent: number;
  /** Whether the learner meets the NCLEX ECG readiness threshold */
  nclexReady: boolean;
  /** Whether the learner meets the ACLS ECG readiness threshold */
  aclsReady: boolean;
  /** Domains ranked by current weakness (lowest score first) */
  weakestDomains: EcgReadinessDomainId[];
  /** Domains ranked by improvement rate (fastest improving first) */
  improvingDomains: EcgReadinessDomainId[];
  lastUpdatedAt: string;
};

// ─── Domain rhythm mapping ────────────────────────────────────────────────────

export const DOMAIN_RHYTHM_MAPPING: Record<EcgReadinessDomainId, string[]> = {
  rhythm_recognition: [
    "normal_sinus_rhythm", "sinus_bradycardia", "sinus_tachycardia",
    "respiratory_sinus_arrhythmia", "atrial_fibrillation", "atrial_flutter",
    "svt", "junctional_rhythm", "accelerated_junctional_rhythm",
  ],
  interval_analysis: [
    "normal_sinus_rhythm", "first_degree_av_block",
    "second_degree_type_i_av_block", "second_degree_type_ii_av_block",
    "third_degree_av_block",
  ],
  ischemia_stemi: [
    "stemi_pattern", "nstemi_pattern",
  ],
  acls_critical_rhythms: [
    "ventricular_tachycardia", "ventricular_fibrillation",
    "torsades_de_pointes", "pea", "asystole",
    "second_degree_type_ii_av_block", "third_degree_av_block",
  ],
  telemetry_interpretation: [
    "pacs", "pvcs", "atrial_fibrillation", "atrial_flutter",
    "idioventricular_rhythm", "ventricular_escape_rhythm",
  ],
  conduction_disorders: [
    "first_degree_av_block", "second_degree_type_i_av_block",
    "second_degree_type_ii_av_block", "third_degree_av_block",
    "right_bundle_branch_block", "left_bundle_branch_block",
  ],
  paced_rhythms: [
    "paced_rhythm",
  ],
  electrolyte_abnormalities: [
    "hyperkalemia_pattern", "hypokalemia_pattern",
  ],
};

export const DOMAIN_LABELS: Record<EcgReadinessDomainId, string> = {
  rhythm_recognition: "Rhythm Recognition",
  interval_analysis: "Interval Analysis",
  ischemia_stemi: "Ischaemia & STEMI",
  acls_critical_rhythms: "ACLS Critical Rhythms",
  telemetry_interpretation: "Telemetry Interpretation",
  conduction_disorders: "Conduction Disorders",
  paced_rhythms: "Paced Rhythms",
  electrolyte_abnormalities: "Electrolyte Changes",
};

/** Clinical weights — higher = more important for overall readiness. */
export const DOMAIN_WEIGHTS: Record<EcgReadinessDomainId, number> = {
  rhythm_recognition:        1.0,
  interval_analysis:         0.9,
  ischemia_stemi:            1.2,
  acls_critical_rhythms:     1.5, // highest weight — life-threatening rhythms
  telemetry_interpretation:  1.0,
  conduction_disorders:      0.9,
  paced_rhythms:             0.7,
  electrolyte_abnormalities: 0.8,
};

const NCLEX_THRESHOLD = 70;  // minimum weighted average to be NCLEX-ready
const ACLS_THRESHOLD = 80;   // minimum weighted average for ACLS readiness

// ─── Score aggregation ────────────────────────────────────────────────────────

/**
 * Input data structure from all activity sources.
 * Consumed by computeEcgReadinessProfile().
 */
export type ReadinessInputData = {
  /** Detective session scores: rhythm key → array of % scores (most recent last) */
  detectiveHistory: Record<string, number[]>;
  /** Deterioration pathway scores: pathway ID → best % score */
  deteriorationScores: Record<string, number>;
  /** Whether each pathway was prevented */
  deteriorationPrevented: Record<string, boolean>;
  /** Compare & contrast pair IDs completed */
  compareContrastCompleted: string[];
  /** Telemetry shift simulator scores: session ID → % score */
  telemetryShiftScores: number[];
};

export function computeEcgReadinessProfile(
  learnerId: string,
  data: ReadinessInputData,
): EcgReadinessProfile {
  const domainScores = (Object.keys(DOMAIN_RHYTHM_MAPPING) as EcgReadinessDomainId[]).map(
    (domainId) => computeDomainScore(domainId, data),
  );

  // Weighted overall score
  const totalWeight = domainScores.reduce(
    (sum, d) => sum + DOMAIN_WEIGHTS[d.domainId],
    0,
  );
  const weightedSum = domainScores.reduce(
    (sum, d) => sum + (d.score * DOMAIN_WEIGHTS[d.domainId]),
    0,
  );
  const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  // Trend: compare to previous score if available
  const previousWeightedSum = domainScores.reduce((sum, d) => {
    const prev = d.previousScore;
    return sum + ((prev ?? d.score) * DOMAIN_WEIGHTS[d.domainId]);
  }, 0);
  const previousOverall = totalWeight > 0 ? Math.round(previousWeightedSum / totalWeight) : 0;
  const overallTrend: ReadinessTrend =
    overallScore === 0 && previousOverall === 0
      ? "insufficient_data"
      : overallScore > previousOverall + 2
        ? "improving"
        : overallScore < previousOverall - 2
          ? "declining"
          : "stable";

  // Mastery percentage
  const allRhythmKeys = Object.values(DOMAIN_RHYTHM_MAPPING).flat();
  const uniqueRhythms = [...new Set(allRhythmKeys)];
  const masteredCount = uniqueRhythms.filter((k) => {
    const scores = data.detectiveHistory[k] ?? [];
    return scores.length > 0 && Math.max(...scores) >= 85;
  }).length;
  const rhythmMasteryPercent = Math.round((masteredCount / uniqueRhythms.length) * 100);

  // Weak and improving domains
  const sorted = [...domainScores].sort((a, b) => a.score - b.score);
  const weakestDomains = sorted.slice(0, 3).map((d) => d.domainId);

  const improving = domainScores
    .filter((d) => d.trend === "improving")
    .sort((a, b) => (b.score - (b.previousScore ?? b.score)) - (a.score - (a.previousScore ?? a.score)));
  const improvingDomains = improving.map((d) => d.domainId);

  const aclsDomains: EcgReadinessDomainId[] = ["acls_critical_rhythms", "rhythm_recognition", "ischemia_stemi"];
  const nclexDomains: EcgReadinessDomainId[] = ["rhythm_recognition", "interval_analysis", "telemetry_interpretation"];

  const aclsScore = computeSubsetScore(domainScores, aclsDomains);
  const nclexScore = computeSubsetScore(domainScores, nclexDomains);

  return {
    learnerId,
    overallScore,
    overallTrend,
    domains: domainScores,
    rhythmMasteryPercent,
    nclexReady: nclexScore >= NCLEX_THRESHOLD,
    aclsReady: aclsScore >= ACLS_THRESHOLD,
    weakestDomains,
    improvingDomains,
    lastUpdatedAt: new Date().toISOString(),
  };
}

function computeSubsetScore(
  allDomains: EcgReadinessDomainScore[],
  domainIds: EcgReadinessDomainId[],
): number {
  const relevant = allDomains.filter((d) => domainIds.includes(d.domainId));
  if (relevant.length === 0) return 0;
  return Math.round(relevant.reduce((sum, d) => sum + d.score, 0) / relevant.length);
}

function computeDomainScore(
  domainId: EcgReadinessDomainId,
  data: ReadinessInputData,
): EcgReadinessDomainScore {
  const rhythms = DOMAIN_RHYTHM_MAPPING[domainId];
  const scoresForDomain: number[] = [];
  const allPrevious: number[] = [];
  let sessionCount = 0;
  let lastActivityAt: string | null = null;
  const weakRhythms: string[] = [];
  const strongRhythms: string[] = [];

  for (const rhythmKey of rhythms) {
    const history = data.detectiveHistory[rhythmKey] ?? [];
    if (history.length === 0) continue;

    sessionCount += history.length;
    const best = Math.max(...history);
    const current = history[history.length - 1] ?? 0;
    const previous = history.length >= 2 ? (history[history.length - 2] ?? null) : null;

    scoresForDomain.push(current);
    if (previous !== null) allPrevious.push(previous);

    if (best >= 90) strongRhythms.push(rhythmKey);
    if (best < 70) weakRhythms.push(rhythmKey);

    // Use current time as proxy for last activity
    if (lastActivityAt === null) lastActivityAt = new Date().toISOString();
  }

  // Add deterioration bonus for ACLS/telemetry domains
  if (domainId === "acls_critical_rhythms" || domainId === "telemetry_interpretation") {
    const deterScores = Object.values(data.deteriorationScores);
    if (deterScores.length > 0) {
      const deterAvg = deterScores.reduce((a, b) => a + b, 0) / deterScores.length;
      scoresForDomain.push(Math.round(deterAvg));
    }
  }

  const score = scoresForDomain.length > 0
    ? Math.round(scoresForDomain.reduce((a, b) => a + b, 0) / scoresForDomain.length)
    : 0;
  const previousScore = allPrevious.length > 0
    ? Math.round(allPrevious.reduce((a, b) => a + b, 0) / allPrevious.length)
    : null;

  const trend: ReadinessTrend =
    scoresForDomain.length < 2
      ? "insufficient_data"
      : score > (previousScore ?? 0) + 2
        ? "improving"
        : score < (previousScore ?? 0) - 2
          ? "declining"
          : "stable";

  const recommendedActivity = getRecommendedActivity(domainId, weakRhythms, data);

  return {
    domainId,
    label: DOMAIN_LABELS[domainId],
    score,
    previousScore,
    trend,
    sessionCount,
    lastActivityAt,
    weakRhythms,
    strongRhythms,
    recommendedActivity,
  };
}

function getRecommendedActivity(
  domainId: EcgReadinessDomainId,
  weakRhythms: string[],
  data: ReadinessInputData,
): ReadinessRecommendedActivity {
  // If there are weak rhythms, prioritise detective mode for the weakest
  if (weakRhythms.length > 0) {
    return {
      type: "detective_mode",
      label: `Detective Mode: ${weakRhythms[0]?.replace(/_/g, " ")}`,
      rhythmKey: weakRhythms[0],
    };
  }

  // Domain-specific recommendations
  const domainRecommendations: Record<EcgReadinessDomainId, ReadinessRecommendedActivity> = {
    rhythm_recognition: {
      type: "compare_contrast",
      label: "Compare & Contrast: AFib vs Atrial Flutter",
      pairId: "afib-vs-flutter",
    },
    interval_analysis: {
      type: "compare_contrast",
      label: "Compare & Contrast: Mobitz I vs Mobitz II",
      pairId: "mobitz1-vs-mobitz2",
    },
    ischemia_stemi: {
      type: "compare_contrast",
      label: "Compare & Contrast: STEMI vs NSTEMI",
      pairId: "stemi-vs-nstemi",
    },
    acls_critical_rhythms: {
      type: "deterioration",
      label: "Deterioration Pathway: PVC → VT → VF",
      pathwayId: "pvc-to-vf",
    },
    telemetry_interpretation: {
      type: "telemetry_shift",
      label: "Telemetry Shift Simulator",
    },
    conduction_disorders: {
      type: "compare_contrast",
      label: "Compare & Contrast: Mobitz I vs Mobitz II",
      pairId: "mobitz1-vs-mobitz2",
    },
    paced_rhythms: {
      type: "detective_mode",
      label: "Detective Mode: Pacemaker Rhythm",
      rhythmKey: "paced_rhythm",
    },
    electrolyte_abnormalities: {
      type: "deterioration",
      label: "Deterioration Pathway: Hyperkalemia",
      pathwayId: "hyperkalemia-to-pea",
    },
  };

  return domainRecommendations[domainId] ?? {
    type: "detective_mode",
    label: "Practice detective mode",
  };
}

// ─── Report card ──────────────────────────────────────────────────────────────

export type EcgReportCard = {
  learnerId: string;
  generatedAt: string;
  readinessProfile: EcgReadinessProfile;
  /** Total detective sessions completed */
  detectiveSessionsCompleted: number;
  /** Total deterioration pathways completed */
  deteriorationPathwaysCompleted: number;
  /** Deterioration pathways where prevention was achieved */
  deteriorationPreventionCount: number;
  /** Number of compare & contrast pairs completed */
  compareContrastCount: number;
  /** Rhythms attempted but not yet mastered */
  rhythmsInProgress: string[];
  /** Rhythms not yet started */
  rhythmsNotStarted: string[];
  /** Top performance: best 3 rhythm scores */
  topRhythms: Array<{ rhythmKey: string; score: number }>;
  /** Bottom performance: worst 3 rhythm scores */
  bottomRhythms: Array<{ rhythmKey: string; score: number }>;
  /** All earned clearance IDs */
  earnedClearances: string[];
  /** Next recommended clearance to pursue */
  nextClearanceId: string | null;
};

export function generateEcgReportCard(
  learnerId: string,
  data: ReadinessInputData,
  earnedClearanceIds: string[],
): EcgReportCard {
  const profile = computeEcgReadinessProfile(learnerId, data);

  const allRhythms = [...new Set(Object.values(DOMAIN_RHYTHM_MAPPING).flat())];
  const detHistory = data.detectiveHistory;

  const scores = allRhythms
    .filter((k) => (detHistory[k]?.length ?? 0) > 0)
    .map((k) => ({
      rhythmKey: k,
      score: Math.max(...(detHistory[k] ?? [0])),
    }));

  const rhythmsNotStarted = allRhythms.filter((k) => (detHistory[k]?.length ?? 0) === 0);
  const rhythmsInProgress = scores.filter((s) => s.score < 85).map((s) => s.rhythmKey);
  const topRhythms = [...scores].sort((a, b) => b.score - a.score).slice(0, 3);
  const bottomRhythms = [...scores].sort((a, b) => a.score - b.score).slice(0, 3);

  const deteriorationCompleted = Object.values(data.deteriorationScores).filter((s) => s > 0).length;
  const deteriorationPrevented = Object.values(data.deteriorationPrevented).filter(Boolean).length;

  const earned = new Set(earnedClearanceIds);
  const nextClearance = ECG_CLEARANCES.find((c) =>
    !earned.has(c.id) && c.prerequisites.every((p) => earned.has(p)),
  );

  return {
    learnerId,
    generatedAt: new Date().toISOString(),
    readinessProfile: profile,
    detectiveSessionsCompleted: Object.values(detHistory).reduce((sum, h) => sum + h.length, 0),
    deteriorationPathwaysCompleted: deteriorationCompleted,
    deteriorationPreventionCount: deteriorationPrevented,
    compareContrastCount: data.compareContrastCompleted.length,
    rhythmsInProgress,
    rhythmsNotStarted,
    topRhythms,
    bottomRhythms,
    earnedClearances: earnedClearanceIds,
    nextClearanceId: nextClearance?.id ?? null,
  };
}

// Re-export ECG_CLEARANCES so consumers only need one import
export { ECG_CLEARANCES } from "@/lib/ecg-module/ecg-clearances";
