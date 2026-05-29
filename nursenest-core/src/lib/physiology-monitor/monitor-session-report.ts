/**
 * Monitor Session Report
 *
 * Assembles all scoring engines into a single post-session report data structure.
 * This is the data layer consumed by the <MonitorSessionReport> UI component
 * and by institutional analytics dashboards.
 *
 * Sources:
 *   - ClinicalJudgmentResult (clinical-judgment-engine.ts)
 *   - HarmIndexResult (harm-index.ts)
 *   - TimeToInterventionMetrics (monitor-competency-tracker.ts)
 *   - MonitorCompetencyPassport (monitor-competency-tracker.ts)
 *   - PersonalisedRemediationPlan (adaptive-remediation.ts)
 */

import type { PhysiologySnapshot, PhysiologyState, MonitorMode } from "./physiology-state";
import type { ScoringEvent } from "./monitor-engine";
import type { ClinicalJudgmentResult } from "./clinical-judgment-engine";
import type { HarmIndexResult } from "./harm-index";
import type { TimeToInterventionMetrics, MonitorCompetencyPassport } from "./monitor-competency-tracker";
import type { PersonalisedRemediationPlan } from "./adaptive-remediation";

import { scoreClinicalJudgment } from "./clinical-judgment-engine";
import { computeHarmIndex } from "./harm-index";
import { computeTimeToInterventionScore, computeMonitorInterpretationScore } from "./monitor-competency-tracker";
import { buildRemediationPlan } from "./adaptive-remediation";
import { getDeteriorationPattern } from "./deterioration-patterns";
import { SIM_SECONDS_PER_TICK } from "./monitor-engine";

// ─── Report types ─────────────────────────────────────────────────────────────

export interface SessionSummaryStats {
  totalSimSeconds: number;
  totalTicks: number;
  finalConditionStage: PhysiologyState["conditionStage"];
  conditionLabel: string;
  mode: MonitorMode;
  interventionsApplied: number;
  recognitionEvents: number;
}

export interface ScoreSummary {
  /** NCJMM overall clinical judgment. */
  clinicalJudgment: number;
  /** Monitor interpretation (rhythm + vital + alarm + trend). */
  monitorInterpretation: number;
  /** Timing score. */
  timeToIntervention: number;
  /** Patient safety score (higher = safer). */
  harmIndex: number;
  /** Simple average of the four. */
  composite: number;
}

export interface MonitorSessionReport {
  sessionId: string;
  generatedAt: string;
  summary: SessionSummaryStats;
  scores: ScoreSummary;
  clinicalJudgment: ClinicalJudgmentResult;
  harmIndex: HarmIndexResult;
  timeToIntervention: TimeToInterventionMetrics;
  monitorInterpretationScore: number;
  competencyPassport?: MonitorCompetencyPassport;
  remediationPlan: PersonalisedRemediationPlan;
  /** Top 3 strengths to surface in the report card. */
  topStrengths: string[];
  /** Top 3 priority improvement areas. */
  topImprovements: string[];
  /** Badges earned this session. */
  badgesEarned: SessionBadge[];
}

export interface SessionBadge {
  id: string;
  label: string;
  description: string;
  tier: "bronze" | "silver" | "gold";
}

// ─── Badge definitions ────────────────────────────────────────────────────────

const BADGE_DEFINITIONS: Array<{
  id: string;
  label: string;
  description: string;
  tier: SessionBadge["tier"];
  condition: (report: Partial<MonitorSessionReport>) => boolean;
}> = [
  {
    id: "rapid_responder",
    label: "Rapid Responder",
    description: "Recognised deterioration and intervened within 60 sim-seconds.",
    tier: "gold",
    condition: (r) => (r.timeToIntervention?.firstInterventionTimeSec ?? Infinity) <= 60,
  },
  {
    id: "zero_harm",
    label: "Zero Harm",
    description: "No patient harm events in this session.",
    tier: "gold",
    condition: (r) => r.harmIndex?.color === "green",
  },
  {
    id: "clinical_judgment_advanced",
    label: "Clinical Judgment: Advanced",
    description: "Achieved Advanced level in overall NCJMM clinical judgment.",
    tier: "gold",
    condition: (r) => r.clinicalJudgment?.overallLevel === "advanced",
  },
  {
    id: "full_intervention_bundle",
    label: "Full Bundle",
    description: "Applied all indicated interventions for this condition.",
    tier: "silver",
    condition: (r) => (r.clinicalJudgment?.missedIndicatedInterventions?.length ?? 1) === 0,
  },
  {
    id: "trend_spotter",
    label: "Trend Spotter",
    description: "Intervened before the patient reached severe stage.",
    tier: "silver",
    condition: (r) => r.summary?.finalConditionStage === "developing" || r.summary?.finalConditionStage === "early",
  },
  {
    id: "systematic_assessor",
    label: "Systematic Assessor",
    description: "Documented 3+ recognition events during the session.",
    tier: "bronze",
    condition: (r) => (r.summary?.recognitionEvents ?? 0) >= 3,
  },
  {
    id: "monitor_watcher",
    label: "Monitor Watcher",
    description: "Completed a full session without pausing the simulation.",
    tier: "bronze",
    condition: (_r) => true, // Awarded for completion
  },
];

// ─── Report builder ───────────────────────────────────────────────────────────

export interface ReportBuilderInput {
  conditionKey: string;
  mode: MonitorMode;
  finalState: PhysiologyState;
  history: PhysiologySnapshot[];
  events: ScoringEvent[];
  overlayUsed: boolean;
  competencyPassport?: MonitorCompetencyPassport;
}

export function buildSessionReport(input: ReportBuilderInput): MonitorSessionReport {
  const {
    conditionKey, mode, finalState, history, events, overlayUsed, competencyPassport,
  } = input;

  const sessionId = `mon-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const generatedAt = new Date().toISOString();

  // ── Stats ──
  const pattern = getDeteriorationPattern(conditionKey);
  const totalTicks = finalState.tick;
  const totalSimSeconds = totalTicks * SIM_SECONDS_PER_TICK;
  const recognitionEvents = events.filter((e) => e.type === "recognition").length;
  const interventionsApplied = events.filter((e) => e.type === "intervention").length;

  const summary: SessionSummaryStats = {
    totalSimSeconds,
    totalTicks,
    finalConditionStage: finalState.conditionStage,
    conditionLabel: pattern?.label ?? conditionKey,
    mode,
    interventionsApplied,
    recognitionEvents,
  };

  // ── Clinical Judgment ──
  const clinicalJudgment = scoreClinicalJudgment({
    conditionKey, events, history, finalState, overlayUsed,
  });

  // ── Harm Index ──
  const harmIndex = computeHarmIndex(history, events, conditionKey);

  // ── Time to Intervention ──
  const timeToIntervention = computeTimeToInterventionScore(events, history);

  // ── Monitor Interpretation ──
  const monitorInterpretationScore = computeMonitorInterpretationScore({
    conditionKey,
    ecgRhythmKey: finalState.ecgRhythmKey,
    domainScores: Object.fromEntries(
      Object.entries(clinicalJudgment.domainScores).map(([k, v]) => [k, v])
    ),
    harmResult: harmIndex,
    history,
    events,
    overallJudgmentScore: clinicalJudgment.overallScore,
  });

  // ── Composite Score ──
  const scores: ScoreSummary = {
    clinicalJudgment: clinicalJudgment.overallScore,
    monitorInterpretation: monitorInterpretationScore,
    timeToIntervention: timeToIntervention.score,
    harmIndex: harmIndex.score,
    composite: Math.round(
      (clinicalJudgment.overallScore +
       monitorInterpretationScore +
       timeToIntervention.score +
       harmIndex.score) / 4,
    ),
  };

  // ── Remediation Plan ──
  const remediationPlan = buildRemediationPlan({
    conditionKey,
    mode,
    weakNcjmmDomains: clinicalJudgment.weakDomains,
    worstHarmLevel: harmIndex.level,
    overallJudgmentScore: clinicalJudgment.overallScore,
    missedInterventions: clinicalJudgment.missedIndicatedInterventions,
  });

  // ── Strengths & Improvements ──
  const topStrengths = buildTopStrengths(clinicalJudgment, harmIndex, timeToIntervention);
  const topImprovements = buildTopImprovements(clinicalJudgment, harmIndex);

  // ── Badges ──
  const partialReport = { summary, scores, clinicalJudgment, harmIndex, timeToIntervention };
  const badgesEarned = BADGE_DEFINITIONS
    .filter((b) => b.condition(partialReport))
    .map(({ id, label, description, tier }) => ({ id, label, description, tier }));

  return {
    sessionId,
    generatedAt,
    summary,
    scores,
    clinicalJudgment,
    harmIndex,
    timeToIntervention,
    monitorInterpretationScore,
    competencyPassport,
    remediationPlan,
    topStrengths,
    topImprovements,
    badgesEarned,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildTopStrengths(
  cj: ClinicalJudgmentResult,
  harm: HarmIndexResult,
  tti: TimeToInterventionMetrics,
): string[] {
  const strengths: string[] = [];
  if (cj.strongDomains.length > 0) {
    strengths.push(`Strong ${cj.strongDomains[0]!.replace(/_/g, " ")} — ${cj.domainScores[cj.strongDomains[0]!].score}/100`);
  }
  if (harm.color === "green") {
    strengths.push("Zero patient harm events — safe clinical practice");
  }
  if (tti.firstInterventionTimeSec !== null && tti.firstInterventionTimeSec <= 60) {
    strengths.push(`Rapid intervention: first action at ${Math.round(tti.firstInterventionTimeSec)}s`);
  }
  if (cj.recognisedAllCriticalFindings) {
    strengths.push("All critical findings identified before irreversible harm");
  }
  if (strengths.length === 0) strengths.push("Session completed — building foundational monitor competency");
  return strengths.slice(0, 3);
}

function buildTopImprovements(cj: ClinicalJudgmentResult, harm: HarmIndexResult): string[] {
  const improvements: string[] = [];
  if (cj.weakDomains.length > 0) {
    improvements.push(`Improve ${cj.weakDomains[0]!.replace(/_/g, " ")} — currently ${cj.domainScores[cj.weakDomains[0]!].score}/100`);
  }
  if (harm.color === "red") {
    improvements.push("Patient safety: address preventable harm events (see Harm Index)");
  } else if (harm.color === "yellow") {
    improvements.push("Reduce response time to critical alarms");
  }
  if (cj.missedIndicatedInterventions.length > 0) {
    improvements.push(`Apply missed interventions: ${cj.missedIndicatedInterventions.join(", ")}`);
  }
  if (improvements.length === 0) improvements.push("Continue to challenge yourself with higher-acuity scenarios");
  return improvements.slice(0, 3);
}
