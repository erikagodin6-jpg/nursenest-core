/**
 * Monitor Competency Tracker
 *
 * Tracks and advances learner competency across four monitor-specific domains.
 * Integrates with the existing EcgCompetencyDomainId taxonomy from the ECG module
 * and EcgPassportLevel from the ECG competency passport.
 *
 * The four monitor domains extend (not duplicate) the ECG system:
 *   - monitor_rhythm_recognition  → maps to ECG "rhythm_recognition" + "acls_critical_rhythms"
 *   - monitor_vital_interpretation → new domain: vital signs + alarm management
 *   - monitor_alarm_management     → new domain: alarm response, prioritisation, fatigue
 *   - monitor_trend_analysis       → new domain: deterioration recognition, recovery, subtle trends
 *
 * Competency State Machine:
 *   not_started → developing → approaching → competent → proficient → expert
 *
 * Each session contributes evidence to advance or hold each domain.
 */

import type { EcgCompetencyDomainId } from "@/lib/ecg-module/ecg-competency-domains";
import type { NcjmmDomainScore } from "./clinical-judgment-engine";
import type { HarmIndexResult } from "./harm-index";
import type { PhysiologySnapshot } from "./physiology-state";
import type { ScoringEvent } from "./monitor-engine";

// ─── Monitor-specific competency domains ──────────────────────────────────────

export type MonitorCompetencyDomainId =
  | "monitor_rhythm_recognition"
  | "monitor_vital_interpretation"
  | "monitor_alarm_management"
  | "monitor_trend_analysis";

/** Domains that can be driven by ECG module evidence. */
export const MONITOR_TO_ECG_DOMAIN_MAP: Record<MonitorCompetencyDomainId, EcgCompetencyDomainId[]> = {
  monitor_rhythm_recognition:  ["rhythm_recognition", "acls_critical_rhythms", "ischemia_stemi", "electrolyte_abnormalities"],
  monitor_vital_interpretation: ["telemetry_interpretation"],
  monitor_alarm_management:    ["telemetry_interpretation"],
  monitor_trend_analysis:      ["telemetry_interpretation", "rhythm_recognition"],
};

// ─── Competency level ─────────────────────────────────────────────────────────

export type MonitorCompetencyLevel =
  | "not_started"
  | "developing"
  | "approaching"
  | "competent"
  | "proficient"
  | "expert";

export const COMPETENCY_LEVEL_LABELS: Record<MonitorCompetencyLevel, string> = {
  not_started: "Not Started",
  developing:  "Developing",
  approaching: "Approaching",
  competent:   "Competent",
  proficient:  "Proficient",
  expert:      "Expert",
};

export const COMPETENCY_LEVEL_ORDER: MonitorCompetencyLevel[] = [
  "not_started", "developing", "approaching", "competent", "proficient", "expert",
];

// ─── Domain record ────────────────────────────────────────────────────────────

export interface MonitorCompetencyDomainRecord {
  domainId: MonitorCompetencyDomainId;
  label: string;
  level: MonitorCompetencyLevel;
  /** 0–100 running score within the current level. */
  progressWithinLevel: number;
  /** How many sessions have contributed evidence. */
  sessionCount: number;
  /** Score at which the learner advances to the next level. */
  advancementThreshold: number;
  /** Worst harm level seen across all sessions (blocks advancement if "severe"). */
  worstHarmLevelSeen: string;
  /** Last session score (0–100). */
  lastSessionScore: number;
  /** ISO timestamp of last update. */
  lastUpdatedAt: string;
}

// ─── Full competency passport ─────────────────────────────────────────────────

export interface MonitorCompetencyPassport {
  learnerId?: string;
  domains: Record<MonitorCompetencyDomainId, MonitorCompetencyDomainRecord>;
  /** Highest overall level across all domains. */
  overallLevel: MonitorCompetencyLevel;
  /** Whether the learner is cleared for supervised clinical telemetry monitoring. */
  telemetryReadyClearance: boolean;
  /** Whether the learner is cleared for ICU-level monitoring. */
  icuReadyClearance: boolean;
  lastUpdatedAt: string;
}

// ─── Scoring evidence ─────────────────────────────────────────────────────────

export interface CompetencyEvidenceInput {
  conditionKey: string;
  ecgRhythmKey: string;
  domainScores: Partial<Record<string, NcjmmDomainScore>>;
  harmResult: HarmIndexResult;
  history: PhysiologySnapshot[];
  events: ScoringEvent[];
  overallJudgmentScore: number;
}

// ─── Initial passport factory ─────────────────────────────────────────────────

const DOMAIN_METADATA: Record<MonitorCompetencyDomainId, { label: string; advancementThreshold: number }> = {
  monitor_rhythm_recognition:  { label: "Rhythm Recognition",       advancementThreshold: 75 },
  monitor_vital_interpretation: { label: "Vital Sign Interpretation", advancementThreshold: 70 },
  monitor_alarm_management:    { label: "Alarm Management",          advancementThreshold: 72 },
  monitor_trend_analysis:      { label: "Trend Analysis",            advancementThreshold: 68 },
};

export function createEmptyPassport(learnerId?: string): MonitorCompetencyPassport {
  const now = new Date().toISOString();
  const domains = Object.fromEntries(
    (Object.keys(DOMAIN_METADATA) as MonitorCompetencyDomainId[]).map((id) => [
      id,
      {
        domainId: id,
        label: DOMAIN_METADATA[id].label,
        level: "not_started" as MonitorCompetencyLevel,
        progressWithinLevel: 0,
        sessionCount: 0,
        advancementThreshold: DOMAIN_METADATA[id].advancementThreshold,
        worstHarmLevelSeen: "none",
        lastSessionScore: 0,
        lastUpdatedAt: now,
      } satisfies MonitorCompetencyDomainRecord,
    ]),
  ) as Record<MonitorCompetencyDomainId, MonitorCompetencyDomainRecord>;

  return {
    learnerId,
    domains,
    overallLevel: "not_started",
    telemetryReadyClearance: false,
    icuReadyClearance: false,
    lastUpdatedAt: now,
  };
}

// ─── Domain score derivation ──────────────────────────────────────────────────

function deriveRhythmRecognitionScore(evidence: CompetencyEvidenceInput): number {
  const { events, history, ecgRhythmKey } = evidence;

  // Base: overall judgment recognition domain
  const recScore = evidence.domainScores["recognize_cues"]?.score ?? 50;

  // ECG-specific bonus: did the learner name an ECG finding?
  const ecgRecognition = events.some(
    (e) => e.type === "recognition" && (e.detail.toLowerCase().includes("ecg") || e.detail.toLowerCase().includes("rhythm"))
  );
  const ecgBonus = ecgRecognition ? 15 : 0;

  // Penalty for arrest without recognition
  const arrestWithoutRec = history.some((s) =>
    ["ventricular_fibrillation", "asystole"].includes(s.state.ecgRhythmKey)
  ) && !events.some((e) => e.type === "recognition" && e.tick <= (history.findIndex((s) =>
    ["ventricular_fibrillation", "asystole"].includes(s.state.ecgRhythmKey)
  ) + 2));
  const arrestPenalty = arrestWithoutRec ? -20 : 0;

  return Math.max(0, Math.min(100, recScore + ecgBonus + arrestPenalty));
}

function deriveVitalInterpretationScore(evidence: CompetencyEvidenceInput): number {
  const { domainScores, harmResult } = evidence;
  const analyzeScore = domainScores["analyze_cues"]?.score ?? 50;
  const harmPenalty = harmResult.color === "red" ? 20 : harmResult.color === "yellow" ? 8 : 0;
  return Math.max(0, Math.min(100, analyzeScore - harmPenalty));
}

function deriveAlarmManagementScore(evidence: CompetencyEvidenceInput): number {
  const { events, history, harmResult } = evidence;

  // Time from first alarm to first intervention
  const firstCriticalTick = history.findIndex(
    (s) => s.state.spo2 < 90 || s.state.map < 65 || s.state.heartRate > 150
  );
  const firstInterventionTick = events.find((e) => e.type === "intervention")?.tick ?? Infinity;
  const responseLagTicks = firstCriticalTick >= 0 ? Math.max(0, firstInterventionTick - firstCriticalTick) : 0;

  // Score based on response speed (max 80 points)
  const speedScore = Math.max(0, 80 - responseLagTicks * 10);

  // Harm penalty
  const harmPenalty = harmResult.color === "red" ? 30 : harmResult.color === "yellow" ? 10 : 0;

  return Math.max(0, Math.min(100, speedScore - harmPenalty + 20));
}

function deriveTrendAnalysisScore(evidence: CompetencyEvidenceInput): number {
  const { events, history } = evidence;

  // Did the learner act before the condition worsened beyond "developing"?
  const severeIndex = history.findIndex((s) => s.state.conditionStage === "severe");
  const firstInterventionTick = events.find((e) => e.type === "intervention")?.tick;

  let trendScore = 60;

  if (severeIndex > 0 && firstInterventionTick !== undefined) {
    if (firstInterventionTick < history[severeIndex]!.tick) {
      trendScore += 25; // Acted before severe
    } else {
      trendScore -= 15; // Missed the deterioration trend
    }
  }

  // Bonus for multiple recognitions (monitoring trend)
  const recCount = events.filter((e) => e.type === "recognition").length;
  trendScore += Math.min(15, recCount * 5);

  return Math.max(0, Math.min(100, trendScore));
}

// ─── Level advancement ────────────────────────────────────────────────────────

function advanceLevel(current: MonitorCompetencyLevel, runningScore: number, threshold: number, harmLevel: string): MonitorCompetencyLevel {
  // Block advancement if severe harm
  if (harmLevel === "severe" || harmLevel === "preventable_arrest") return current;

  const currentIndex = COMPETENCY_LEVEL_ORDER.indexOf(current);
  if (runningScore >= threshold && currentIndex < COMPETENCY_LEVEL_ORDER.length - 1) {
    return COMPETENCY_LEVEL_ORDER[currentIndex + 1]!;
  }
  // Regression: drop a level if score < 40 for 3+ sessions
  if (runningScore < 40 && currentIndex > 1) {
    return COMPETENCY_LEVEL_ORDER[currentIndex - 1]!;
  }
  return current;
}

// ─── Main update function ─────────────────────────────────────────────────────

export function updateCompetencyPassport(
  passport: MonitorCompetencyPassport,
  evidence: CompetencyEvidenceInput,
): MonitorCompetencyPassport {
  const now = new Date().toISOString();
  const HARM_LEVELS = ["none", "near_miss", "moderate", "severe", "preventable_arrest"];

  const domainScorers: Record<MonitorCompetencyDomainId, (e: CompetencyEvidenceInput) => number> = {
    monitor_rhythm_recognition:   deriveRhythmRecognitionScore,
    monitor_vital_interpretation: deriveVitalInterpretationScore,
    monitor_alarm_management:     deriveAlarmManagementScore,
    monitor_trend_analysis:       deriveTrendAnalysisScore,
  };

  const updatedDomains = { ...passport.domains };

  for (const [domainId, scorer] of Object.entries(domainScorers) as [MonitorCompetencyDomainId, typeof deriveRhythmRecognitionScore][]) {
    const sessionScore = scorer(evidence);
    const current = updatedDomains[domainId]!;
    const sessionCount = current.sessionCount + 1;

    // Exponential moving average with recency weight 0.4
    const newProgress = current.sessionCount === 0
      ? sessionScore
      : Math.round(current.progressWithinLevel * 0.6 + sessionScore * 0.4);

    const worstHarm =
      HARM_LEVELS.indexOf(evidence.harmResult.level) > HARM_LEVELS.indexOf(current.worstHarmLevelSeen)
        ? evidence.harmResult.level
        : current.worstHarmLevelSeen;

    const newLevel = advanceLevel(
      current.level,
      newProgress,
      current.advancementThreshold,
      evidence.harmResult.level,
    );

    updatedDomains[domainId] = {
      ...current,
      level: newLevel,
      progressWithinLevel: newProgress,
      sessionCount,
      worstHarmLevelSeen: worstHarm,
      lastSessionScore: sessionScore,
      lastUpdatedAt: now,
    };
  }

  // Clearance gates
  const allCompetent = Object.values(updatedDomains).every(
    (d) => COMPETENCY_LEVEL_ORDER.indexOf(d.level) >= COMPETENCY_LEVEL_ORDER.indexOf("competent"),
  );
  const noSevereHarm = Object.values(updatedDomains).every(
    (d) => d.worstHarmLevelSeen !== "severe" && d.worstHarmLevelSeen !== "preventable_arrest",
  );

  const allProficient = Object.values(updatedDomains).every(
    (d) => COMPETENCY_LEVEL_ORDER.indexOf(d.level) >= COMPETENCY_LEVEL_ORDER.indexOf("proficient"),
  );

  const telemetryReadyClearance = allCompetent && noSevereHarm;
  const icuReadyClearance = allProficient && noSevereHarm;

  // Overall level = lowest domain level (bottleneck model)
  const levelIndices = Object.values(updatedDomains).map((d) =>
    COMPETENCY_LEVEL_ORDER.indexOf(d.level),
  );
  const overallIndex = Math.min(...levelIndices);
  const overallLevel = COMPETENCY_LEVEL_ORDER[overallIndex]!;

  return {
    ...passport,
    domains: updatedDomains,
    overallLevel,
    telemetryReadyClearance,
    icuReadyClearance,
    lastUpdatedAt: now,
  };
}

// ─── Monitor Interpretation Score (0–100) ─────────────────────────────────────

export function computeMonitorInterpretationScore(
  evidence: CompetencyEvidenceInput,
): number {
  const rhythm = deriveRhythmRecognitionScore(evidence);
  const vital = deriveVitalInterpretationScore(evidence);
  const alarm = deriveAlarmManagementScore(evidence);
  const trend = deriveTrendAnalysisScore(evidence);

  // Equal weights
  return Math.round((rhythm + vital + alarm + trend) / 4);
}

// ─── Time-to-Intervention Score ───────────────────────────────────────────────

export interface TimeToInterventionMetrics {
  recognitionTimeSec: number | null;
  firstInterventionTimeSec: number | null;
  escalationTimeSec: number | null;
  reassessmentTimeSec: number | null;
  score: number;
}

export function computeTimeToInterventionScore(
  events: ScoringEvent[],
  history: PhysiologySnapshot[],
): TimeToInterventionMetrics {
  const firstRec = events.find((e) => e.type === "recognition");
  const firstInt = events.find((e) => e.type === "intervention");
  const firstEsc = events.find((e) => e.type === "escalation");
  const postIntRec = firstInt
    ? events.find((e) => e.type === "recognition" && e.tick > firstInt.tick)
    : null;

  const recognitionTimeSec = firstRec?.simSeconds ?? null;
  const firstInterventionTimeSec = firstInt?.simSeconds ?? null;
  const escalationTimeSec = firstEsc?.simSeconds ?? null;
  const reassessmentTimeSec = postIntRec?.simSeconds ?? null;

  let score = 100;

  // Penalty for late recognition (> 60 sim-seconds)
  if (recognitionTimeSec === null) score -= 25;
  else if (recognitionTimeSec > 120) score -= 20;
  else if (recognitionTimeSec > 60) score -= 10;

  // Penalty for late first intervention (> 120 sim-seconds)
  if (firstInterventionTimeSec === null) score -= 30;
  else if (firstInterventionTimeSec > 240) score -= 25;
  else if (firstInterventionTimeSec > 120) score -= 15;

  // Penalty for no escalation
  if (escalationTimeSec === null) score -= 10;

  // Penalty for no reassessment
  if (reassessmentTimeSec === null) score -= 15;

  return {
    recognitionTimeSec,
    firstInterventionTimeSec,
    escalationTimeSec,
    reassessmentTimeSec,
    score: Math.max(0, Math.min(100, score)),
  };
}
