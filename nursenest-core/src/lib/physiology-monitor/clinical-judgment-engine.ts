/**
 * Clinical Judgment Engine — NCJMM Scoring Layer
 *
 * Maps every learner action during a monitor session to one or more of the
 * six NCJMM (Next-Generation Clinical Judgment Measurement Model) domains,
 * then produces a 0–100 score per domain and an overall Clinical Judgment Score.
 *
 * Integrates with:
 *   - ScoringEvent[] from MonitorEngine (interventions, recognitions)
 *   - PhysiologySnapshot[] for timeline analysis
 *   - DeteriorationPattern for expected-action gold standards
 *   - SimulationAnalyticsDimension from simulation-clinical-judgment-engine.ts
 */

import type { PhysiologySnapshot, PhysiologyState } from "./physiology-state";
import type { ScoringEvent } from "./monitor-engine";
import { getDeteriorationPattern } from "./deterioration-patterns";
import { getIntervention, getInterventionsForCondition } from "./intervention-catalog";
import { SIM_SECONDS_PER_TICK } from "./monitor-engine";

// ─── NCJMM Domain types ───────────────────────────────────────────────────────

export type NcjmmDomain =
  | "recognize_cues"
  | "analyze_cues"
  | "prioritize_hypotheses"
  | "generate_solutions"
  | "take_action"
  | "evaluate_outcomes";

export const NCJMM_DOMAIN_LABELS: Record<NcjmmDomain, string> = {
  recognize_cues:        "Recognize Cues",
  analyze_cues:          "Analyze Cues",
  prioritize_hypotheses: "Prioritize Hypotheses",
  generate_solutions:    "Generate Solutions",
  take_action:           "Take Action",
  evaluate_outcomes:     "Evaluate Outcomes",
};

export const NCJMM_DOMAIN_DESCRIPTIONS: Record<NcjmmDomain, string> = {
  recognize_cues:
    "Identifies relevant normal and abnormal assessment findings from the monitor data.",
  analyze_cues:
    "Interprets data relationships, links clinical findings to underlying physiology.",
  prioritize_hypotheses:
    "Ranks possible patient conditions by urgency and likelihood.",
  generate_solutions:
    "Identifies expected outcomes and evidence-based interventions.",
  take_action:
    "Implements interventions within optimal time windows and correct sequence.",
  evaluate_outcomes:
    "Reassesses the patient after interventions; identifies improvement or deterioration.",
};

// ─── Per-domain score ─────────────────────────────────────────────────────────

export interface NcjmmDomainScore {
  domain: NcjmmDomain;
  score: number;                 // 0–100
  possible: number;              // max points available this session
  earned: number;                // points actually earned
  level: "developing" | "approaching" | "proficient" | "advanced";
  feedback: string[];            // 1–3 specific coaching observations
}

// ─── Full clinical judgment result ────────────────────────────────────────────

export interface ClinicalJudgmentResult {
  overallScore: number;           // 0–100 weighted average
  overallLevel: NcjmmDomainScore["level"];
  domainScores: Record<NcjmmDomain, NcjmmDomainScore>;
  /** Domains where the learner is weakest (score < 60). */
  weakDomains: NcjmmDomain[];
  /** Domains where the learner excelled (score ≥ 80). */
  strongDomains: NcjmmDomain[];
  /** Whether learner recognised all critical life-threatening findings. */
  recognisedAllCriticalFindings: boolean;
  /** Whether any indicated intervention was never applied. */
  missedIndicatedInterventions: string[];
  sessionSummary: string;
}

// ─── Expected-action gold standard per condition ──────────────────────────────

export interface ConditionClinicalProfile {
  conditionKey: string;
  /** Cues the learner should have noticed (for coaching feedback). */
  expectedCues: string[];
  /** Which ECG findings should be called out. */
  expectedEcgFindings: string[];
  /** Optimal intervention keys in priority order. */
  optimalInterventionSequence: string[];
  /** Interventions that are contraindicated for this condition. */
  contraindicatedInterventions: string[];
  /** Ticks after session start before harm becomes irreversible. */
  criticalWindowTicks: number;
  /** Whether escalation (calling for help) is expected. */
  escalationRequired: boolean;
  /** Whether reassessment after initial intervention is expected. */
  reassessmentExpected: boolean;
}

const CONDITION_PROFILES: ConditionClinicalProfile[] = [
  {
    conditionKey: "sepsis",
    expectedCues: ["tachycardia", "hypotension", "fever", "elevated lactate", "tachypnea"],
    expectedEcgFindings: ["sinus tachycardia"],
    optimalInterventionSequence: ["fluid_bolus", "supplemental_o2", "norepinephrine"],
    contraindicatedInterventions: ["furosemide"],
    criticalWindowTicks: 8,
    escalationRequired: true,
    reassessmentExpected: true,
  },
  {
    conditionKey: "stemi",
    expectedCues: ["ST elevation", "chest pain", "tachycardia", "hypotension in cardiogenic shock"],
    expectedEcgFindings: ["STEMI pattern", "ST elevation"],
    optimalInterventionSequence: ["supplemental_o2", "amiodarone", "defibrillation"],
    contraindicatedInterventions: ["fluid_bolus"],
    criticalWindowTicks: 6,
    escalationRequired: true,
    reassessmentExpected: true,
  },
  {
    conditionKey: "afib_rvr",
    expectedCues: ["irregular rhythm", "rapid ventricular rate", "hypotension"],
    expectedEcgFindings: ["atrial fibrillation", "irregularly irregular rhythm"],
    optimalInterventionSequence: ["amiodarone", "synchronized_cardioversion"],
    contraindicatedInterventions: ["adenosine"],
    criticalWindowTicks: 10,
    escalationRequired: true,
    reassessmentExpected: true,
  },
  {
    conditionKey: "svt",
    expectedCues: ["very rapid rate", "sudden onset", "narrow complex", "hypotension"],
    expectedEcgFindings: ["SVT", "rate > 150"],
    optimalInterventionSequence: ["adenosine", "synchronized_cardioversion"],
    contraindicatedInterventions: ["amiodarone"],
    criticalWindowTicks: 6,
    escalationRequired: true,
    reassessmentExpected: true,
  },
  {
    conditionKey: "vt_to_vf",
    expectedCues: ["wide complex tachycardia", "hemodynamic instability", "VF"],
    expectedEcgFindings: ["ventricular tachycardia", "ventricular fibrillation"],
    optimalInterventionSequence: ["defibrillation", "cpr", "amiodarone"],
    contraindicatedInterventions: [],
    criticalWindowTicks: 3,
    escalationRequired: true,
    reassessmentExpected: true,
  },
  {
    conditionKey: "pulmonary_embolism",
    expectedCues: ["tachycardia", "hypoxemia", "tachypnea", "elevated CVP"],
    expectedEcgFindings: ["RBBB", "sinus tachycardia", "right heart strain"],
    optimalInterventionSequence: ["supplemental_o2", "fluid_bolus"],
    contraindicatedInterventions: ["furosemide"],
    criticalWindowTicks: 8,
    escalationRequired: true,
    reassessmentExpected: true,
  },
  {
    conditionKey: "ards",
    expectedCues: ["severe hypoxemia", "high ventilator pressures", "reduced compliance"],
    expectedEcgFindings: ["sinus tachycardia"],
    optimalInterventionSequence: ["increase_peep"],
    contraindicatedInterventions: ["fluid_bolus"],
    criticalWindowTicks: 10,
    escalationRequired: true,
    reassessmentExpected: true,
  },
  {
    conditionKey: "hyperkalemia",
    expectedCues: ["peaked T waves", "QRS widening", "bradycardia", "high potassium"],
    expectedEcgFindings: ["hyperkalemia pattern", "peaked T waves", "widened QRS"],
    optimalInterventionSequence: ["calcium_gluconate", "insulin_glucose"],
    contraindicatedInterventions: [],
    criticalWindowTicks: 7,
    escalationRequired: true,
    reassessmentExpected: true,
  },
  {
    conditionKey: "dka",
    expectedCues: ["tachycardia", "Kussmaul breathing", "hyperglycemia", "low EtCO2"],
    expectedEcgFindings: ["sinus tachycardia", "peaked T waves"],
    optimalInterventionSequence: ["fluid_bolus", "insulin_glucose"],
    contraindicatedInterventions: [],
    criticalWindowTicks: 10,
    escalationRequired: true,
    reassessmentExpected: true,
  },
  {
    conditionKey: "anaphylaxis",
    expectedCues: ["hypotension", "tachycardia", "bronchospasm", "rapid onset"],
    expectedEcgFindings: ["sinus tachycardia"],
    optimalInterventionSequence: ["epinephrine_im", "supplemental_o2", "fluid_bolus"],
    contraindicatedInterventions: [],
    criticalWindowTicks: 4,
    escalationRequired: true,
    reassessmentExpected: true,
  },
  {
    conditionKey: "increased_icp",
    expectedCues: ["bradycardia", "hypertension", "falling GCS", "Cushing's triad"],
    expectedEcgFindings: ["sinus bradycardia", "AV block"],
    optimalInterventionSequence: ["mannitol"],
    contraindicatedInterventions: ["fluid_bolus"],
    criticalWindowTicks: 8,
    escalationRequired: true,
    reassessmentExpected: true,
  },
  {
    conditionKey: "cardiac_tamponade",
    expectedCues: ["hypotension", "tachycardia", "elevated CVP", "narrow pulse pressure"],
    expectedEcgFindings: ["sinus tachycardia", "electrical alternans"],
    optimalInterventionSequence: ["pericardiocentesis"],
    contraindicatedInterventions: ["furosemide"],
    criticalWindowTicks: 6,
    escalationRequired: true,
    reassessmentExpected: true,
  },
  {
    conditionKey: "tension_pneumothorax",
    expectedCues: ["severe hypoxemia", "hypotension", "high PIP", "absent breath sounds"],
    expectedEcgFindings: ["sinus tachycardia", "PEA"],
    optimalInterventionSequence: ["needle_decompression"],
    contraindicatedInterventions: [],
    criticalWindowTicks: 3,
    escalationRequired: true,
    reassessmentExpected: true,
  },
  {
    conditionKey: "heart_failure",
    expectedCues: ["hypoxemia", "crackles", "elevated CVP", "tachypnea"],
    expectedEcgFindings: ["atrial fibrillation", "ST depression"],
    optimalInterventionSequence: ["bipap", "furosemide", "supplemental_o2"],
    contraindicatedInterventions: ["fluid_bolus"],
    criticalWindowTicks: 10,
    escalationRequired: true,
    reassessmentExpected: true,
  },
  {
    conditionKey: "gi_bleed",
    expectedCues: ["tachycardia", "hypotension", "pallor", "elevated lactate"],
    expectedEcgFindings: ["sinus tachycardia", "ST depression"],
    optimalInterventionSequence: ["fluid_bolus", "blood_transfusion"],
    contraindicatedInterventions: ["furosemide"],
    criticalWindowTicks: 7,
    escalationRequired: true,
    reassessmentExpected: true,
  },
];

function getProfile(conditionKey: string): ConditionClinicalProfile | null {
  return CONDITION_PROFILES.find((p) => p.conditionKey === conditionKey) ?? null;
}

// ─── Domain-level scorers ─────────────────────────────────────────────────────

/** Ticks optimal time window: recognition should happen within 3 ticks of first critical alarm. */
const OPTIMAL_RECOGNITION_TICKS = 3;
/** Ticks optimal for first intervention after recognition. */
const OPTIMAL_FIRST_INTERVENTION_TICKS = 4;
/** Ticks optimal for reassessment after intervention. */
const OPTIMAL_REASSESSMENT_TICKS = 6;

function scoreRecognizeCues(
  events: ScoringEvent[],
  history: PhysiologySnapshot[],
  profile: ConditionClinicalProfile,
): Pick<NcjmmDomainScore, "earned" | "possible" | "feedback"> {
  const recognitionEvents = events.filter((e) => e.type === "recognition");
  const criticalSnap = history.find((s) => s.state.conditionStage === "severe" || s.state.conditionStage === "critical");
  const possible = 100;
  const feedback: string[] = [];
  let earned = 0;

  if (recognitionEvents.length === 0) {
    feedback.push("No explicit cue recognition recorded. Use monitor acknowledgment buttons to document findings.");
    return { earned: 20, possible, feedback };
  }

  // Score 1: Did they recognise anything at all?
  earned += 25;

  // Score 2: Did they recognise before critical stage?
  if (criticalSnap) {
    const firstRec = recognitionEvents[0]!;
    if (firstRec.tick <= criticalSnap.tick) {
      earned += 35;
      feedback.push("Recognised deterioration before critical stage — excellent early detection.");
    } else {
      feedback.push("Deterioration reached critical before recognition was recorded. Earlier assessment needed.");
    }
  } else {
    earned += 35;
    feedback.push("Recognised deterioration and patient did not reach critical stage.");
  }

  // Score 3: Multiple recognition events = comprehensive assessment
  if (recognitionEvents.length >= 3) {
    earned += 25;
    feedback.push("Documented multiple clinical findings — thorough systematic assessment.");
  } else if (recognitionEvents.length >= 2) {
    earned += 15;
    feedback.push("Documented key findings. Systematic head-to-toe assessment would strengthen recognition.");
  } else {
    feedback.push(`Recognised ${profile.expectedCues.length} expected cues available. Document each finding explicitly.`);
  }

  // Score 4: Timing bonus — recognised within optimal window
  if (criticalSnap && recognitionEvents[0]!.tick <= OPTIMAL_RECOGNITION_TICKS) {
    earned += 15;
    feedback.push(`Recognition within ${recognitionEvents[0]!.simSeconds}s — within optimal window.`);
  }

  return { earned: Math.min(earned, possible), possible, feedback };
}

function scoreAnalyzeCues(
  events: ScoringEvent[],
  history: PhysiologySnapshot[],
  profile: ConditionClinicalProfile,
  overlayUsed: boolean,
): Pick<NcjmmDomainScore, "earned" | "possible" | "feedback"> {
  const possible = 100;
  const feedback: string[] = [];
  let earned = 0;

  // Proxy 1: Used the educational overlay (reading explanations = analysis)
  if (overlayUsed) {
    earned += 30;
    feedback.push("Used clinical explanation overlay — demonstrates active pattern interpretation.");
  } else {
    feedback.push("Educational overlay was not engaged. Review the physiology explanations during the scenario.");
  }

  // Proxy 2: Viewed trend data (looking at trends = temporal analysis)
  const hasTrendEvents = events.some((e) => e.type === "recognition" && e.detail.includes("trend"));
  if (hasTrendEvents) {
    earned += 20;
    feedback.push("Trend analysis incorporated — strong temporal reasoning.");
  }

  // Proxy 3: Intervention selection shows correct interpretation
  const interventionEvents = events.filter((e) => e.type === "intervention");
  const correctInterventions = interventionEvents.filter((e) =>
    profile.optimalInterventionSequence.includes(e.detail.toLowerCase().replace(/ /g, "_"))
  );
  if (correctInterventions.length > 0) {
    earned += 30;
    feedback.push("Intervention choices reflect correct pathophysiologic analysis.");
  } else if (interventionEvents.length > 0) {
    earned += 15;
    feedback.push("Some interventions applied but optimal choices not selected — review pathophysiology of this condition.");
  }

  // Proxy 4: No contraindicated interventions used
  const contraindicatedUsed = interventionEvents.filter((e) =>
    profile.contraindicatedInterventions.some((ci) => e.detail.toLowerCase().includes(ci))
  );
  if (contraindicatedUsed.length === 0 && interventionEvents.length > 0) {
    earned += 20;
    feedback.push("No contraindicated interventions used — appropriate clinical reasoning.");
  } else if (contraindicatedUsed.length > 0) {
    feedback.push(`⚠ Contraindicated intervention used: ${contraindicatedUsed.map((e) => e.detail).join(", ")}.`);
  }

  return { earned: Math.min(earned, possible), possible, feedback };
}

function scorePrioritizeHypotheses(
  events: ScoringEvent[],
  history: PhysiologySnapshot[],
  profile: ConditionClinicalProfile,
): Pick<NcjmmDomainScore, "earned" | "possible" | "feedback"> {
  const possible = 100;
  const feedback: string[] = [];
  let earned = 0;
  const interventionEvents = events.filter((e) => e.type === "intervention");

  if (interventionEvents.length === 0) {
    feedback.push("No interventions applied. Cannot evaluate hypothesis prioritization.");
    return { earned: 10, possible, feedback };
  }

  // Score 1: Most critical/life-saving intervention came first
  const firstIntervention = interventionEvents[0]!;
  const firstKey = profile.optimalInterventionSequence[0];
  if (firstKey && firstIntervention.detail.toLowerCase().includes(firstKey.replace(/_/g, " "))) {
    earned += 50;
    feedback.push(`Correctly prioritized most critical intervention first (${firstIntervention.detail}).`);
  } else if (profile.optimalInterventionSequence.some((k) => firstIntervention.detail.toLowerCase().includes(k.replace(/_/g, " ")))) {
    earned += 30;
    feedback.push("Applied an appropriate intervention first, though not the single highest-priority action.");
  } else {
    feedback.push(`First intervention (${firstIntervention.detail}) was not the highest-priority action for this condition.`);
  }

  // Score 2: No contraindicated interventions
  const contraindicatedUsed = interventionEvents.some((e) =>
    profile.contraindicatedInterventions.some((ci) => e.detail.toLowerCase().includes(ci))
  );
  if (!contraindicatedUsed) {
    earned += 30;
  } else {
    feedback.push("Contraindicated intervention reduces hypothesis prioritization score.");
  }

  // Score 3: Escalation recognised
  const escalated = events.some((e) => e.type === "escalation");
  if (profile.escalationRequired && escalated) {
    earned += 20;
    feedback.push("Escalation correctly initiated.");
  } else if (profile.escalationRequired && !escalated) {
    feedback.push("Escalation was required but not documented. Recognise when provider notification and rapid response are needed.");
  }

  return { earned: Math.min(earned, possible), possible, feedback };
}

function scoreGenerateSolutions(
  events: ScoringEvent[],
  profile: ConditionClinicalProfile,
): Pick<NcjmmDomainScore, "earned" | "possible" | "feedback"> {
  const possible = 100;
  const feedback: string[] = [];
  const interventionEvents = events.filter((e) => e.type === "intervention");

  if (interventionEvents.length === 0) {
    return {
      earned: 0,
      possible,
      feedback: ["No solutions generated. Apply at least one indicated intervention to demonstrate solution planning."],
    };
  }

  const optimal = profile.optimalInterventionSequence;
  const appliedKeys = new Set(
    interventionEvents.map((e) => e.detail.toLowerCase().replace(/ /g, "_"))
  );
  const optimalApplied = optimal.filter((k) => appliedKeys.has(k));
  const coverageRatio = optimal.length > 0 ? optimalApplied.length / optimal.length : 1;

  const earned = Math.round(coverageRatio * 80);

  if (coverageRatio >= 1.0) {
    feedback.push(`All ${optimal.length} optimal interventions applied — comprehensive solution set generated.`);
  } else if (coverageRatio >= 0.6) {
    feedback.push(`${optimalApplied.length}/${optimal.length} optimal interventions applied. Review the full treatment bundle for this condition.`);
  } else {
    feedback.push(`Only ${optimalApplied.length}/${optimal.length} optimal interventions applied. Systematic condition-based protocols improve solution generation.`);
  }

  // Bonus: did not apply purely non-indicated interventions
  const indicatedKeys = new Set(getInterventionsForCondition(profile.conditionKey).map((i) => i.key));
  const nonIndicatedApplied = interventionEvents.filter(
    (e) => !indicatedKeys.has(e.detail.toLowerCase().replace(/ /g, "_"))
  );
  const bonus = nonIndicatedApplied.length === 0 ? 20 : Math.max(0, 20 - nonIndicatedApplied.length * 8);
  if (bonus === 20) {
    feedback.push("Interventions were condition-specific — no unfocused shotgun approach.");
  }

  return { earned: Math.min(earned + bonus, possible), possible, feedback };
}

function scoreTakeAction(
  events: ScoringEvent[],
  history: PhysiologySnapshot[],
  profile: ConditionClinicalProfile,
  finalState: PhysiologyState,
): Pick<NcjmmDomainScore, "earned" | "possible" | "feedback"> {
  const possible = 100;
  const feedback: string[] = [];
  const interventionEvents = events.filter((e) => e.type === "intervention");

  if (interventionEvents.length === 0) {
    return { earned: 0, possible, feedback: ["No actions taken during session."] };
  }

  let earned = 0;

  // Score 1: Applied at least one indicated intervention
  const indicatedKeys = new Set(getInterventionsForCondition(profile.conditionKey).map((i) => i.key));
  const hasIndicated = interventionEvents.some((e) => indicatedKeys.has(e.detail.toLowerCase().replace(/ /g, "_")));
  if (hasIndicated) {
    earned += 30;
  } else {
    feedback.push("No indicated interventions were applied. Actions should directly address the primary diagnosis.");
  }

  // Score 2: Timing — first intervention within optimal window
  const firstRec = events.find((e) => e.type === "recognition");
  const firstInt = interventionEvents[0];
  if (firstRec && firstInt) {
    const lagTicks = firstInt.tick - firstRec.tick;
    if (lagTicks <= OPTIMAL_FIRST_INTERVENTION_TICKS) {
      earned += 35;
      feedback.push(`First action within ${firstInt.simSeconds}s of recognition — excellent response time.`);
    } else {
      const lagSec = lagTicks * SIM_SECONDS_PER_TICK;
      feedback.push(`${lagSec}s elapsed between recognition and first action — target < ${OPTIMAL_FIRST_INTERVENTION_TICKS * SIM_SECONDS_PER_TICK}s.`);
      earned += Math.max(0, 35 - lagTicks * 5);
    }
  } else if (!firstRec && firstInt) {
    earned += 20;
    feedback.push("Action taken without prior documented recognition — document assessment findings before intervening.");
  }

  // Score 3: Acted before critical stage
  const criticalSnapTick = history.find((s) => s.state.conditionStage === "critical")?.tick ?? Infinity;
  if (firstInt && firstInt.tick < criticalSnapTick) {
    earned += 20;
    feedback.push("Acted before patient reached critical stage.");
  } else if (firstInt && firstInt.tick >= criticalSnapTick) {
    feedback.push("Patient reached critical stage before first action was taken.");
  }

  // Score 4: Correct final outcome — did vitals improve?
  const firstSnap = history[0]?.state;
  if (firstSnap && finalState.spo2 >= firstSnap.spo2 && finalState.map >= firstSnap.map * 0.9) {
    earned += 15;
    feedback.push("Vital signs improved after intervention — effective treatment response.");
  }

  return { earned: Math.min(earned, possible), possible, feedback };
}

function scoreEvaluateOutcomes(
  events: ScoringEvent[],
  history: PhysiologySnapshot[],
  profile: ConditionClinicalProfile,
  finalState: PhysiologyState,
): Pick<NcjmmDomainScore, "earned" | "possible" | "feedback"> {
  const possible = 100;
  const feedback: string[] = [];
  let earned = 0;

  const interventionEvents = events.filter((e) => e.type === "intervention");
  const recognitionEvents = events.filter((e) => e.type === "recognition");

  if (interventionEvents.length === 0) {
    return { earned: 0, possible, feedback: ["No interventions to evaluate outcomes for."] };
  }

  // Score 1: Recognition events after an intervention = reassessment
  const firstInt = interventionEvents[0]!;
  const postInterventionRec = recognitionEvents.filter((e) => e.tick > firstInt.tick);
  if (postInterventionRec.length > 0) {
    earned += 40;
    feedback.push("Reassessment documented after intervention — demonstrates outcome evaluation loop.");
  } else {
    feedback.push("No post-intervention reassessment recorded. After each intervention, re-assess vitals and document response.");
  }

  // Score 2: Trend interpretation — did the learner act on worsening trends?
  const severeSnap = history.find((s) => s.state.conditionStage === "severe" || s.state.conditionStage === "critical");
  const actionAfterWorsening = severeSnap
    ? interventionEvents.some((e) => e.tick > severeSnap.tick)
    : false;
  if (actionAfterWorsening) {
    earned += 30;
    feedback.push("Escalated treatment in response to worsening trends — adaptive management demonstrated.");
  }

  // Score 3: Vital improvement detected
  const postIntSnaps = history.filter((s) => s.tick > firstInt.tick);
  if (postIntSnaps.length >= 2) {
    const beforeVitals = history.find((s) => s.tick <= firstInt.tick)?.state;
    const afterVitals = postIntSnaps[postIntSnaps.length - 1]?.state;
    if (beforeVitals && afterVitals && afterVitals.map > beforeVitals.map) {
      earned += 20;
      feedback.push("Haemodynamic improvement observed post-intervention — correctly identified effective treatment.");
    } else if (beforeVitals && afterVitals) {
      feedback.push("Haemodynamic response was not optimal. Review intervention choice and dosing.");
    }
  }

  // Score 4: Multiple rounds of intervention (iterative care)
  if (interventionEvents.length >= 2) {
    earned += 10;
    feedback.push("Multiple rounds of intervention demonstrate iterative clinical management.");
  }

  return { earned: Math.min(earned, possible), possible, feedback };
}

// ─── Score-to-level mapping ───────────────────────────────────────────────────

function scoreToLevel(score: number): NcjmmDomainScore["level"] {
  if (score >= 80) return "advanced";
  if (score >= 65) return "proficient";
  if (score >= 45) return "approaching";
  return "developing";
}

// ─── Domain weight for overall score ─────────────────────────────────────────

const DOMAIN_WEIGHTS: Record<NcjmmDomain, number> = {
  recognize_cues:        1.0,
  analyze_cues:          0.8,
  prioritize_hypotheses: 0.9,
  generate_solutions:    0.9,
  take_action:           1.2,   // Highest weight — action is patient-safety critical
  evaluate_outcomes:     0.9,
};

// ─── Main scorer ──────────────────────────────────────────────────────────────

export interface ClinicalJudgmentInput {
  conditionKey: string;
  events: ScoringEvent[];
  history: PhysiologySnapshot[];
  finalState: PhysiologyState;
  /** Whether the learner opened the educational overlay panel at any point. */
  overlayUsed: boolean;
}

export function scoreClinicalJudgment(input: ClinicalJudgmentInput): ClinicalJudgmentResult {
  const { conditionKey, events, history, finalState, overlayUsed } = input;
  const profile = getProfile(conditionKey);

  // Fallback profile if condition not registered
  const safeProfile: ConditionClinicalProfile = profile ?? {
    conditionKey,
    expectedCues: ["abnormal vital signs"],
    expectedEcgFindings: [],
    optimalInterventionSequence: [],
    contraindicatedInterventions: [],
    criticalWindowTicks: 10,
    escalationRequired: true,
    reassessmentExpected: true,
  };

  const rcRaw = scoreRecognizeCues(events, history, safeProfile);
  const acRaw = scoreAnalyzeCues(events, history, safeProfile, overlayUsed);
  const phRaw = scorePrioritizeHypotheses(events, history, safeProfile);
  const gsRaw = scoreGenerateSolutions(events, safeProfile);
  const taRaw = scoreTakeAction(events, history, safeProfile, finalState);
  const eoRaw = scoreEvaluateOutcomes(events, history, safeProfile, finalState);

  const rawScores: Record<NcjmmDomain, typeof rcRaw> = {
    recognize_cues:        rcRaw,
    analyze_cues:          acRaw,
    prioritize_hypotheses: phRaw,
    generate_solutions:    gsRaw,
    take_action:           taRaw,
    evaluate_outcomes:     eoRaw,
  };

  const domainScores = Object.fromEntries(
    (Object.entries(rawScores) as [NcjmmDomain, typeof rcRaw][]).map(([domain, raw]) => {
      const score = raw.possible > 0 ? Math.round((raw.earned / raw.possible) * 100) : 0;
      return [
        domain,
        {
          domain,
          score,
          possible: raw.possible,
          earned: raw.earned,
          level: scoreToLevel(score),
          feedback: raw.feedback,
        } satisfies NcjmmDomainScore,
      ];
    }),
  ) as Record<NcjmmDomain, NcjmmDomainScore>;

  // Weighted overall score
  const totalWeight = Object.values(DOMAIN_WEIGHTS).reduce((a, b) => a + b, 0);
  const overallScore = Math.round(
    Object.entries(domainScores).reduce(
      (acc, [domain, ds]) => acc + ds.score * DOMAIN_WEIGHTS[domain as NcjmmDomain],
      0,
    ) / totalWeight,
  );

  const weakDomains = (Object.keys(domainScores) as NcjmmDomain[]).filter(
    (d) => domainScores[d].score < 60,
  );
  const strongDomains = (Object.keys(domainScores) as NcjmmDomain[]).filter(
    (d) => domainScores[d].score >= 80,
  );

  // Critical-finding check
  const interventionEvents = events.filter((e) => e.type === "intervention");
  const indicatedKeys = new Set(getInterventionsForCondition(conditionKey).map((i) => i.key));
  const appliedKeys = new Set(interventionEvents.map((e) => e.detail.toLowerCase().replace(/ /g, "_")));
  const missedIndicatedInterventions = [...indicatedKeys].filter((k) => !appliedKeys.has(k));

  const criticalStageReached = history.some((s) => s.state.conditionStage === "critical");
  const recognitionBeforeCritical = events.some(
    (e) =>
      e.type === "recognition" &&
      history.some(
        (s) => s.tick <= e.tick && s.state.conditionStage !== "critical",
      ),
  );
  const recognisedAllCriticalFindings = criticalStageReached ? recognitionBeforeCritical : true;

  const sessionSummary = buildSessionSummary(overallScore, weakDomains, strongDomains, safeProfile);

  return {
    overallScore,
    overallLevel: scoreToLevel(overallScore),
    domainScores,
    weakDomains,
    strongDomains,
    recognisedAllCriticalFindings,
    missedIndicatedInterventions,
    sessionSummary,
  };
}

function buildSessionSummary(
  score: number,
  weak: NcjmmDomain[],
  strong: NcjmmDomain[],
  profile: ConditionClinicalProfile,
): string {
  const parts: string[] = [];
  if (score >= 80) {
    parts.push("Strong clinical judgment demonstrated.");
  } else if (score >= 60) {
    parts.push("Developing clinical judgment with key areas for growth.");
  } else {
    parts.push("Clinical judgment requires significant development in this scenario.");
  }
  if (strong.length > 0) {
    parts.push(`Strengths: ${strong.map((d) => NCJMM_DOMAIN_LABELS[d]).join(", ")}.`);
  }
  if (weak.length > 0) {
    parts.push(`Priority improvement areas: ${weak.map((d) => NCJMM_DOMAIN_LABELS[d]).join(", ")}.`);
  }
  return parts.join(" ");
}
