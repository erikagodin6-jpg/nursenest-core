/**
 * Clinical Readiness Score Engine
 *
 * Generates multi-domain readiness scores from aggregated monitor session data.
 * Each score combines: competency levels, timing metrics, Harm Index history,
 * remediation completion, and longitudinal consistency.
 *
 * Readiness domains:
 *   - Telemetry Readiness          (floor nurses, step-down, med-surg)
 *   - ICU Readiness                (critical care, CVICU, MICU)
 *   - Rapid Response Readiness     (deteriorating patient recognition)
 *   - ECG / Arrhythmia Readiness   (rhythm interpretation, telemetry units)
 *   - Shock Recognition Readiness  (emergency, ICU, rapid response teams)
 *   - RT Critical Care Readiness   (ventilator management, airway emergencies)
 *   - New Graduate Safe Practice   (foundational safety thresholds)
 */

import type { MonitorCompetencyPassport, MonitorCompetencyLevel } from "./monitor-competency-tracker";
import type { HarmIndexResult } from "./harm-index";
import type { TimeToInterventionMetrics } from "./monitor-competency-tracker";
import type { ClinicalJudgmentResult } from "./clinical-judgment-engine";

// ─── Readiness domains ────────────────────────────────────────────────────────

export type ReadinessDomain =
  | "telemetry"
  | "icu"
  | "rapid_response"
  | "ecg_arrhythmia"
  | "shock_recognition"
  | "rt_critical_care"
  | "new_graduate_safe_practice";

export const READINESS_DOMAIN_LABELS: Record<ReadinessDomain, string> = {
  telemetry:                  "Telemetry Readiness",
  icu:                        "ICU Readiness",
  rapid_response:             "Rapid Response Readiness",
  ecg_arrhythmia:             "ECG / Arrhythmia Readiness",
  shock_recognition:          "Shock Recognition Readiness",
  rt_critical_care:           "RT Critical Care Readiness",
  new_graduate_safe_practice: "New Graduate Safe Practice",
};

export const READINESS_DOMAIN_DESCRIPTIONS: Record<ReadinessDomain, string> = {
  telemetry:
    "Ability to monitor continuous cardiac rhythms, respond to alarms, recognise deterioration, and escalate appropriately on step-down or telemetry units.",
  icu:
    "Competency with complex physiology, multiorgan failure, vasopressor management, and high-acuity intervention timing in critical care.",
  rapid_response:
    "Early deterioration recognition, rapid response activation timing, and escalation decision quality for deteriorating ward patients.",
  ecg_arrhythmia:
    "Rhythm identification, arrhythmia management, and ECG interpretation accuracy across the spectrum of common and life-threatening rhythms.",
  shock_recognition:
    "Differentiation and early management of distributive, cardiogenic, hypovolemic, and obstructive shock states with hemodynamic reasoning.",
  rt_critical_care:
    "Ventilator management, airway emergency response, waveform interpretation, and RT-specific alarm management in mechanically ventilated patients.",
  new_graduate_safe_practice:
    "Foundational patient safety: timely escalation, harm avoidance, basic deterioration recognition, and consistent application of nursing safety checks.",
};

// ─── Readiness band ───────────────────────────────────────────────────────────

export type ReadinessBand =
  | "not_ready"
  | "developing"
  | "near_ready"
  | "ready"
  | "proficient";

export const READINESS_BAND_LABELS: Record<ReadinessBand, string> = {
  not_ready:  "Not Ready",
  developing: "Developing",
  near_ready: "Near Ready",
  ready:      "Ready",
  proficient: "Proficient",
};

export const READINESS_BAND_THRESHOLDS: Record<ReadinessBand, number> = {
  not_ready:  0,
  developing: 40,
  near_ready: 65,
  ready:      80,
  proficient: 92,
};

export function readinessBandFromScore(score: number): ReadinessBand {
  if (score >= 92) return "proficient";
  if (score >= 80) return "ready";
  if (score >= 65) return "near_ready";
  if (score >= 40) return "developing";
  return "not_ready";
}

// ─── Per-domain score ─────────────────────────────────────────────────────────

export interface ReadinessDomainScore {
  domain: ReadinessDomain;
  score: number;             // 0–100
  band: ReadinessBand;
  /** Whether the learner has passed the clearance gate for this domain. */
  cleared: boolean;
  /** Score components with weights. */
  components: ReadinessScoreComponent[];
  /** What's holding the score back. */
  limitingFactors: string[];
  /** What's driving the score up. */
  strengths: string[];
  /** Specific coaching recommendation. */
  coachingNote: string;
}

export interface ReadinessScoreComponent {
  name: string;
  score: number;       // 0–100
  weight: number;      // 0–1
  contribution: number; // score × weight
}

// ─── Full readiness profile ───────────────────────────────────────────────────

export interface ReadinessProfile {
  /** All domain scores. */
  domains: Record<ReadinessDomain, ReadinessDomainScore>;
  /** Domains the learner is cleared for (score ≥ clearance threshold). */
  clearedDomains: ReadinessDomain[];
  /** Domains with the lowest scores — highest priority for remediation. */
  priorityDomains: ReadinessDomain[];
  /** Overall composite readiness (equal-weighted average). */
  compositeScore: number;
  compositeBand: ReadinessBand;
  /** Number of monitor sessions this profile is based on. */
  sessionCount: number;
  computedAt: string;
}

// ─── Clearance thresholds ─────────────────────────────────────────────────────

const CLEARANCE_THRESHOLDS: Record<ReadinessDomain, number> = {
  telemetry:                  75,
  icu:                        82,
  rapid_response:             78,
  ecg_arrhythmia:             80,
  shock_recognition:          78,
  rt_critical_care:           80,
  new_graduate_safe_practice: 70,
};

// ─── Input from aggregated sessions ──────────────────────────────────────────

export interface ReadinessInput {
  /** Sessions analysed (most recent first). */
  sessionCount: number;
  /** Average composite score across sessions. */
  avgCompositeScore: number;
  /** Average clinical judgment score. */
  avgClinicalJudgmentScore: number;
  /** Average monitor interpretation score. */
  avgMonitorInterpretationScore: number;
  /** Average time-to-intervention score. */
  avgTimeToInterventionScore: number;
  /** Average harm index score (higher = safer). */
  avgHarmIndexScore: number;
  /** Proportion of sessions with Green harm index. */
  greenHarmRate: number;         // 0–1
  /** Proportion of sessions with Red harm index. */
  redHarmRate: number;           // 0–1
  /** Competency passport from competency tracker. */
  competencyPassport?: MonitorCompetencyPassport;
  /** Conditions practiced (keys). */
  conditionsPracticed: string[];
  /** Proportion of sessions where escalation was timely. */
  timelyEscalationRate: number; // 0–1
  /** Proportion of sessions completing remediation plan. */
  remediationCompletionRate: number; // 0–1
  /** Whether learner has passed arrhythmia recognition drill. */
  arrhythmiaAssessmentPassed?: boolean;
  /** Longitudinal consistency: std-dev of composite scores (lower = more consistent). */
  scoreConsistency?: number;    // 0 = perfectly consistent, 100 = max variance
}

// ─── Score calculator ─────────────────────────────────────────────────────────

export function computeReadinessProfile(input: ReadinessInput): ReadinessProfile {
  const domains: Record<ReadinessDomain, ReadinessDomainScore> = {
    telemetry:                  scoreTelemetry(input),
    icu:                        scoreIcu(input),
    rapid_response:             scoreRapidResponse(input),
    ecg_arrhythmia:             scoreEcgArrhythmia(input),
    shock_recognition:          scoreShockRecognition(input),
    rt_critical_care:           scoreRtCriticalCare(input),
    new_graduate_safe_practice: scoreNewGradSafePractice(input),
  };

  const clearedDomains = (Object.keys(domains) as ReadinessDomain[]).filter(
    (d) => domains[d].cleared,
  );

  const allScores = Object.values(domains).map((d) => d.score);
  const compositeScore = Math.round(allScores.reduce((s, v) => s + v, 0) / allScores.length);

  const priorityDomains = (Object.keys(domains) as ReadinessDomain[])
    .sort((a, b) => domains[a].score - domains[b].score)
    .slice(0, 3);

  return {
    domains,
    clearedDomains,
    priorityDomains,
    compositeScore,
    compositeBand: readinessBandFromScore(compositeScore),
    sessionCount: input.sessionCount,
    computedAt: new Date().toISOString(),
  };
}

// ─── Per-domain scorers ───────────────────────────────────────────────────────

function weighedScore(components: ReadinessScoreComponent[]): number {
  const total = components.reduce((s, c) => s + c.weight, 0);
  const weighted = components.reduce((s, c) => s + c.score * c.weight, 0);
  return Math.round(Math.min(100, total > 0 ? weighted / total : 0));
}

function competencyLevelToScore(level?: MonitorCompetencyLevel): number {
  const map: Record<MonitorCompetencyLevel, number> = {
    not_started: 0,
    developing:  30,
    approaching: 55,
    competent:   72,
    proficient:  88,
    expert:      100,
  };
  return level ? (map[level] ?? 0) : 0;
}

function scoreTelemetry(input: ReadinessInput): ReadinessDomainScore {
  const rhythmLevel = input.competencyPassport?.domains["monitor_rhythm_recognition"]?.level;
  const alarmLevel = input.competencyPassport?.domains["monitor_alarm_management"]?.level;

  const components: ReadinessScoreComponent[] = [
    { name: "Rhythm Recognition", score: competencyLevelToScore(rhythmLevel), weight: 0.30 },
    { name: "Alarm Management",   score: competencyLevelToScore(alarmLevel),  weight: 0.25 },
    { name: "Monitor Interpretation", score: input.avgMonitorInterpretationScore, weight: 0.25 },
    { name: "Patient Safety",     score: input.avgHarmIndexScore,              weight: 0.20 },
  ].map((c) => ({ ...c, contribution: c.score * c.weight }));

  const score = weighedScore(components);
  const limitingFactors: string[] = [];
  const strengths: string[] = [];

  if (competencyLevelToScore(rhythmLevel) < 60) limitingFactors.push("Rhythm recognition below competent level");
  if (input.avgHarmIndexScore < 70) limitingFactors.push("Harm events in recent sessions");
  if (competencyLevelToScore(rhythmLevel) >= 80) strengths.push("Strong rhythm recognition");
  if (input.greenHarmRate > 0.8) strengths.push("Consistent safe practice");

  return {
    domain: "telemetry",
    score,
    band: readinessBandFromScore(score),
    cleared: score >= CLEARANCE_THRESHOLDS.telemetry,
    components,
    limitingFactors,
    strengths,
    coachingNote: score < 65
      ? "Focus on rhythm recognition and alarm prioritization drills before telemetry unit placement."
      : score < 80
      ? "Near telemetry clearance — complete 3 more arrhythmia recognition sessions."
      : "Telemetry-ready. Continue to maintain alarm response times.",
  };
}

function scoreIcu(input: ReadinessInput): ReadinessDomainScore {
  const vitalLevel = input.competencyPassport?.domains["monitor_vital_interpretation"]?.level;
  const trendLevel = input.competencyPassport?.domains["monitor_trend_analysis"]?.level;

  const components: ReadinessScoreComponent[] = [
    { name: "Vital Interpretation",  score: competencyLevelToScore(vitalLevel),  weight: 0.25 },
    { name: "Trend Analysis",        score: competencyLevelToScore(trendLevel),  weight: 0.25 },
    { name: "Clinical Judgment",     score: input.avgClinicalJudgmentScore,      weight: 0.25 },
    { name: "Time to Intervention",  score: input.avgTimeToInterventionScore,    weight: 0.15 },
    { name: "Harm Prevention",       score: input.avgHarmIndexScore,             weight: 0.10 },
  ].map((c) => ({ ...c, contribution: c.score * c.weight }));

  const icuConditionCount = input.conditionsPracticed.filter((k) =>
    ["septic_shock", "stemi", "ards", "multi_system_failure", "cardiac_tamponade", "vt_to_vf"].includes(k),
  ).length;

  const exposureBonus = Math.min(20, icuConditionCount * 4);
  const score = Math.min(100, weighedScore(components) + (exposureBonus > 10 ? 5 : 0));

  const limitingFactors: string[] = [];
  const strengths: string[] = [];

  if (input.redHarmRate > 0.2) limitingFactors.push("Red harm index in > 20% of sessions");
  if (icuConditionCount < 3) limitingFactors.push("Insufficient exposure to ICU-level conditions");
  if (input.avgTimeToInterventionScore < 60) limitingFactors.push("Intervention timing consistently delayed");
  if (input.avgClinicalJudgmentScore >= 80) strengths.push("Strong NCJMM clinical judgment");
  if (icuConditionCount >= 5) strengths.push("Broad ICU condition exposure");

  return {
    domain: "icu",
    score,
    band: readinessBandFromScore(score),
    cleared: score >= CLEARANCE_THRESHOLDS.icu,
    components,
    limitingFactors,
    strengths,
    coachingNote: score < 65
      ? "Not ready for ICU placement. Complete at least 8 ICU-level simulations before clearance."
      : score < 82
      ? "Approaching ICU readiness. Focus on septic shock, MODS, and advanced vasopressor cases."
      : "ICU clearance criteria met. Continue advanced NP/PA-level differential cases.",
  };
}

function scoreRapidResponse(input: ReadinessInput): ReadinessDomainScore {
  const trendLevel = input.competencyPassport?.domains["monitor_trend_analysis"]?.level;

  const components: ReadinessScoreComponent[] = [
    { name: "Deterioration Recognition", score: competencyLevelToScore(trendLevel), weight: 0.35 },
    { name: "Escalation Timing",         score: Math.round(input.timelyEscalationRate * 100), weight: 0.35 },
    { name: "Time to Intervention",      score: input.avgTimeToInterventionScore,   weight: 0.20 },
    { name: "Harm Prevention",           score: input.avgHarmIndexScore,            weight: 0.10 },
  ].map((c) => ({ ...c, contribution: c.score * c.weight }));

  const score = weighedScore(components);
  const limitingFactors: string[] = [];
  const strengths: string[] = [];

  if (input.timelyEscalationRate < 0.6) limitingFactors.push("Escalation delayed in > 40% of sessions");
  if (competencyLevelToScore(trendLevel) < 55) limitingFactors.push("Trend analysis not yet competent");
  if (input.timelyEscalationRate > 0.85) strengths.push("Excellent escalation timing");

  return {
    domain: "rapid_response",
    score,
    band: readinessBandFromScore(score),
    cleared: score >= CLEARANCE_THRESHOLDS.rapid_response,
    components,
    limitingFactors,
    strengths,
    coachingNote: score < 65
      ? "Escalation timing is the primary gap. Practice 5 rapid response activation scenarios."
      : score < 78
      ? "Near rapid response readiness. Focus on earlier recognition of subtle deterioration."
      : "Rapid response criteria met. Consider advanced MEWS/NEWS-2 documentation practice.",
  };
}

function scoreEcgArrhythmia(input: ReadinessInput): ReadinessDomainScore {
  const rhythmLevel = input.competencyPassport?.domains["monitor_rhythm_recognition"]?.level;
  const arrhythmiaBonus = input.arrhythmiaAssessmentPassed ? 15 : 0;

  const components: ReadinessScoreComponent[] = [
    { name: "Rhythm Recognition Competency", score: competencyLevelToScore(rhythmLevel), weight: 0.40 },
    { name: "Monitor Interpretation",        score: input.avgMonitorInterpretationScore, weight: 0.35 },
    { name: "Clinical Judgment",             score: input.avgClinicalJudgmentScore,      weight: 0.25 },
  ].map((c) => ({ ...c, contribution: c.score * c.weight }));

  const score = Math.min(100, weighedScore(components) + (arrhythmiaBonus > 10 ? 5 : 0));
  const limitingFactors: string[] = [];
  const strengths: string[] = [];

  if (!input.arrhythmiaAssessmentPassed) limitingFactors.push("Arrhythmia competency assessment not completed");
  const ecgConditions = input.conditionsPracticed.filter((k) =>
    ["afib_rvr", "svt", "vt_to_vf", "hyperkalemia", "stemi"].includes(k),
  ).length;
  if (ecgConditions < 3) limitingFactors.push("Limited arrhythmia exposure in simulations");
  if (competencyLevelToScore(rhythmLevel) >= 80) strengths.push("Rhythm recognition at proficient level");

  return {
    domain: "ecg_arrhythmia",
    score,
    band: readinessBandFromScore(score),
    cleared: score >= CLEARANCE_THRESHOLDS.ecg_arrhythmia,
    components,
    limitingFactors,
    strengths,
    coachingNote: score < 65
      ? "Complete the 12-lead ECG module and AFib/VT/VF simulation series before clearance."
      : score < 80
      ? "Strong foundation. Complete the arrhythmia competency assessment to unlock clearance."
      : "ECG/Arrhythmia-ready. Consider ACLS-level telemetry cases for continued growth.",
  };
}

function scoreShockRecognition(input: ReadinessInput): ReadinessDomainScore {
  const vitalLevel = input.competencyPassport?.domains["monitor_vital_interpretation"]?.level;
  const shockConditions = input.conditionsPracticed.filter((k) =>
    ["sepsis", "septic_shock", "anaphylaxis", "gi_bleed", "complex_shock", "cardiac_tamponade"].includes(k),
  ).length;

  const components: ReadinessScoreComponent[] = [
    { name: "Vital Sign Interpretation", score: competencyLevelToScore(vitalLevel), weight: 0.30 },
    { name: "Clinical Judgment",         score: input.avgClinicalJudgmentScore,     weight: 0.30 },
    { name: "Intervention Timing",       score: input.avgTimeToInterventionScore,   weight: 0.25 },
    { name: "Shock Case Exposure",       score: Math.min(100, shockConditions * 18), weight: 0.15 },
  ].map((c) => ({ ...c, contribution: c.score * c.weight }));

  const score = weighedScore(components);
  const limitingFactors: string[] = [];
  const strengths: string[] = [];

  if (shockConditions < 3) limitingFactors.push("Insufficient shock recognition case exposure");
  if (input.avgTimeToInterventionScore < 65) limitingFactors.push("Vasopressor and fluid initiation consistently delayed");
  if (shockConditions >= 5) strengths.push("Broad shock state exposure");
  if (input.avgClinicalJudgmentScore >= 80) strengths.push("Strong differential reasoning");

  return {
    domain: "shock_recognition",
    score,
    band: readinessBandFromScore(score),
    cleared: score >= CLEARANCE_THRESHOLDS.shock_recognition,
    components,
    limitingFactors,
    strengths,
    coachingNote: score < 65
      ? "Complete distributive, cardiogenic, and obstructive shock simulation series."
      : score < 78
      ? "Near shock-ready. Focus on early vasopressor initiation and source control timing."
      : "Shock recognition criteria met. Advance to undifferentiated shock / NP-level cases.",
  };
}

function scoreRtCriticalCare(input: ReadinessInput): ReadinessDomainScore {
  const rtConditions = input.conditionsPracticed.filter((k) =>
    ["ards", "rt_auto_peep", "rt_mucus_plug", "rt_vent_asynchrony", "rt_accidental_extubation"].includes(k),
  ).length;

  const components: ReadinessScoreComponent[] = [
    { name: "RT Condition Exposure",     score: Math.min(100, rtConditions * 22), weight: 0.30 },
    { name: "Monitor Interpretation",    score: input.avgMonitorInterpretationScore, weight: 0.25 },
    { name: "Intervention Timing",       score: input.avgTimeToInterventionScore,  weight: 0.25 },
    { name: "Clinical Judgment",         score: input.avgClinicalJudgmentScore,    weight: 0.20 },
  ].map((c) => ({ ...c, contribution: c.score * c.weight }));

  const score = weighedScore(components);
  const limitingFactors: string[] = [];
  const strengths: string[] = [];

  if (rtConditions < 3) limitingFactors.push("Insufficient RT simulation exposure");
  if (!input.conditionsPracticed.includes("rt_accidental_extubation")) limitingFactors.push("Accidental extubation drill not completed");
  if (rtConditions >= 5) strengths.push("Full RT simulation completion");

  return {
    domain: "rt_critical_care",
    score,
    band: readinessBandFromScore(score),
    cleared: score >= CLEARANCE_THRESHOLDS.rt_critical_care,
    components,
    limitingFactors,
    strengths,
    coachingNote: score < 65
      ? "Complete all 5 RT simulation modules including accidental extubation and auto-PEEP."
      : score < 80
      ? "Near RT clearance. Practice ventilator waveform interpretation and difficult airway scenarios."
      : "RT critical care criteria met. Consider advanced ECMO/inhaled nitric oxide scenarios.",
  };
}

function scoreNewGradSafePractice(input: ReadinessInput): ReadinessDomainScore {
  const components: ReadinessScoreComponent[] = [
    { name: "Harm Prevention",      score: input.avgHarmIndexScore,                          weight: 0.35 },
    { name: "Escalation Behaviour", score: Math.round(input.timelyEscalationRate * 100),     weight: 0.30 },
    { name: "Consistency",          score: Math.max(0, 100 - (input.scoreConsistency ?? 50)), weight: 0.20 },
    { name: "Remediation Follow-up", score: Math.round(input.remediationCompletionRate * 100), weight: 0.15 },
  ].map((c) => ({ ...c, contribution: c.score * c.weight }));

  const score = weighedScore(components);
  const limitingFactors: string[] = [];
  const strengths: string[] = [];

  if (input.redHarmRate > 0.1) limitingFactors.push("Harm events in more than 10% of sessions — safety concern");
  if (input.timelyEscalationRate < 0.7) limitingFactors.push("Escalation delayed in > 30% of sessions");
  if (input.greenHarmRate > 0.85) strengths.push("Strong safety record — Green harm index in 85%+ of sessions");
  if (input.remediationCompletionRate > 0.8) strengths.push("Excellent remediation follow-through");

  return {
    domain: "new_graduate_safe_practice",
    score,
    band: readinessBandFromScore(score),
    cleared: score >= CLEARANCE_THRESHOLDS.new_graduate_safe_practice,
    components,
    limitingFactors,
    strengths,
    coachingNote: score < 55
      ? "Safety concerns identified. Remediation required before independent clinical practice."
      : score < 70
      ? "Developing safe practice. Focus on escalation habits and harm avoidance patterns."
      : "Safe practice criteria met for new graduate deployment. Continue monitoring for consistency.",
  };
}
