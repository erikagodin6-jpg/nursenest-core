/**
 * ECG Simulation Schema — Phase 2
 *
 * Extends the existing simulation infrastructure for ECG-specific scenarios.
 * Integrates with:
 *   - SimulationPracticeFrame (simulation-clinical-judgment-engine.ts)
 *   - PatientCase (longitudinal-case-types.ts)
 *   - EcgMasteryRecord (ecg-learner-mastery.ts)
 *   - EcgCompetencyDomainId (ecg-competency-domains.ts)
 *   - EcgClinicalReasoningEntry (ecg-clinical-reasoning-schema.ts)
 *
 * ARCHITECTURE
 *   EcgSimulation = patient profile + clinical environment + rhythm progression
 *                 + decision points + consequences + documentation tasks
 *
 *   The rhythm progression is a directed graph — each node is a rhythm state,
 *   edges are triggered by learner decisions (correct/incorrect/delayed).
 *
 * GOVERNANCE
 *   Published simulations must pass ecg-phase2-governance.contract.test.ts.
 *   Life-threatening rhythm simulations require a code_blue decision point.
 */

import type { SimulationSpecialty } from "@/lib/cases/simulation-clinical-judgment-engine";
import type { EcgCompetencyDomainId } from "@/lib/ecg-module/ecg-competency-domains";
import type { EcgClinicalRiskLevel } from "@/lib/ecg-module/ecg-clinical-reasoning-schema";

// ─── Profession taxonomy ───────────────────────────────────────────────────────

export type EcgSimulationProfession =
  | "RN"
  | "RPN"
  | "NP"
  | "RT"
  | "new_grad";

// ─── Clinical environment ──────────────────────────────────────────────────────

export type EcgSimulationEnvironment = {
  specialty: SimulationSpecialty;
  /** Human-readable unit name, e.g. "Cardiac Telemetry Unit — 4B" */
  unitLabel: string;
  /** Monitor type visible to learner: bedside, central station, mobile device */
  monitorContext: "bedside_monitor" | "central_station" | "mobile_telemetry" | "remote_monitoring";
  /** Time of day — affects staffing and escalation context */
  timeOfDay: "day" | "evening" | "night";
  /** Staffing context */
  staffingContext: "adequate" | "short_staffed" | "code_situation";
};

// ─── Patient profile ───────────────────────────────────────────────────────────

export type EcgSimulationPatient = {
  age: number;
  sex: "male" | "female" | "other";
  /** Primary admission diagnosis */
  admissionDiagnosis: string;
  /** Why the patient was admitted to this unit specifically */
  admissionReason: string;
  /** Relevant past medical history */
  relevantHistory: ReadonlyArray<string>;
  /** Active medications relevant to rhythm interpretation */
  medications: ReadonlyArray<string>;
  allergies: ReadonlyArray<string>;
  /** Baseline rhythm on admission (rhythmKey matching EcgRhythmTemplate) */
  baselineRhythmKey: string;
  /** Baseline HR, BP, SpO₂, RR */
  baselineVitals: {
    hr: number;
    sbp: number;
    dbp: number;
    spo2: number;
    rr: number;
    temp?: number;
  };
};

// ─── Rhythm progression node ───────────────────────────────────────────────────

/**
 * A single state in the rhythm progression graph.
 * Each node represents one point in time during the simulation.
 */
export type EcgRhythmProgressionNode = {
  /** Unique ID within this simulation's graph */
  nodeId: string;
  /** The rhythm present at this state (rhythmKey from EcgRhythmTemplate) */
  rhythmKey: string;
  /** How long before this rhythm change occurs if no intervention (seconds) */
  onsetSeconds: number;
  /** Vital signs at this node */
  vitals: {
    hr: number;
    sbp: number;
    dbp?: number;
    spo2?: number;
    rr?: number;
  };
  /** Observable clinical signs the learner sees */
  clinicalSigns: ReadonlyArray<string>;
  /** Monitor alarms active at this node */
  activeAlarms: ReadonlyArray<string>;
  /** Clinical risk at this node */
  riskLevel: EcgClinicalRiskLevel;
  /**
   * Warning signs present at this node that, if missed, lead to deterioration.
   * Used in post-simulation debrief ("what you missed").
   */
  missableWarnings: ReadonlyArray<string>;
  /**
   * Transitions from this node. Each transition is triggered by a learner
   * decision (or lack of one within the time limit).
   */
  transitions: ReadonlyArray<EcgProgressionTransition>;
};

export type EcgProgressionTransition = {
  /** ID of the target node */
  targetNodeId: string;
  /**
   * Trigger condition for this transition.
   *   "correct_action"    → learner chose the right escalation/intervention
   *   "incorrect_action"  → learner chose wrong intervention
   *   "no_action"         → timer expired without learner action
   *   "partial_action"    → learner acted but incompletely
   */
  trigger: "correct_action" | "incorrect_action" | "no_action" | "partial_action";
  /** Human-readable label for this transition (shown in debrief) */
  label: string;
  /** Score impact for this transition [-3 to +3] */
  scoreImpact: number;
};

// ─── Decision point ────────────────────────────────────────────────────────────

export type EcgSimulationDecisionType =
  | "escalation"        // What level of escalation is required?
  | "intervention"      // What intervention should be performed?
  | "recognition"       // What rhythm is this?
  | "prioritization"    // Which patient needs attention first?
  | "documentation"     // How should this be documented?
  | "communication"     // How should this be communicated?
  | "delegation"        // What can be delegated?
  | "handoff";          // How should handoff be structured?

export type EcgSimulationDecisionPoint = {
  /** Corresponds to a rhythmProgressionNodeId — when should this decision occur */
  atNodeId: string;
  decisionType: EcgSimulationDecisionType;
  /** The clinical question posed to the learner */
  stem: string;
  /** Available options (3–5) */
  options: ReadonlyArray<{
    id: string;
    text: string;
    /** Whether this is a correct answer */
    correct: boolean;
    /** Which node this answer transitions to */
    consequenceNodeId: string;
    /** Rationale shown after the learner commits */
    rationale: string;
    /** If this option represents a clinical safety risk */
    safetyFlag?: string;
  }>;
  /** NGN question format for this decision point */
  ngnFormat: "mcq" | "sata" | "bowtie" | "matrix" | "prioritization";
  /** Time limit in seconds before "no_action" transition fires */
  timeLimitSeconds?: number;
};

// ─── Documentation task ────────────────────────────────────────────────────────

export type EcgDocumentationTask = {
  id: string;
  /** When in the simulation this task should be completed (node reference) */
  atNodeId: string;
  taskType:
    | "rhythm_documentation"
    | "escalation_documentation"
    | "sbar_communication"
    | "code_documentation"
    | "handoff_report"
    | "rapid_response_report";
  /** Template or prompt for the documentation task */
  prompt: string;
  /** Required elements that must appear in a complete response */
  requiredElements: ReadonlyArray<string>;
  /** Model answer for debrief */
  modelAnswer: string;
};

// ─── Simulation debrief ────────────────────────────────────────────────────────

export type EcgSimulationDebrief = {
  /** What happened and why (narrative) */
  clinicalNarrative: string;
  /** Warning signs that were present but commonly missed */
  missedWarnings: ReadonlyArray<string>;
  /** What interventions would have prevented deterioration */
  preventionOpportunities: ReadonlyArray<string>;
  /** Key learning objectives addressed by this simulation */
  learningObjectives: ReadonlyArray<string>;
  /** Clinical pearls from this scenario */
  clinicalPearls: ReadonlyArray<string>;
  /** Guideline references */
  guidelineReferences: ReadonlyArray<string>;
};

// ─── Full simulation record ────────────────────────────────────────────────────

export type EcgSimulationRecord = {
  /** Unique simulation slug — used for routing and analytics */
  id: string;
  title: string;
  /** 1–2 sentence clinical scenario summary shown on the catalog card */
  summary: string;
  publishStatus: "published" | "review" | "draft";
  /** Which professions this simulation is designed for */
  targetProfessions: ReadonlyArray<EcgSimulationProfession>;
  environment: EcgSimulationEnvironment;
  patient: EcgSimulationPatient;
  /**
   * The rhythm progression graph — ordered by onset.
   * First node is the starting state.
   */
  rhythmProgression: ReadonlyArray<EcgRhythmProgressionNode>;
  /** Interactive decision points embedded in the progression */
  decisionPoints: ReadonlyArray<EcgSimulationDecisionPoint>;
  /** Documentation tasks required during the simulation */
  documentationTasks: ReadonlyArray<EcgDocumentationTask>;
  /** Post-simulation debrief content */
  debrief: EcgSimulationDebrief;
  /** ECG competency domains this simulation primarily addresses */
  primaryDomains: ReadonlyArray<EcgCompetencyDomainId>;
  /** Estimated completion time in minutes */
  estimatedMinutes: number;
  /** Difficulty [1–5] */
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Whether this simulation requires the learner to call a code blue at some point */
  requiresCodeBlueDecision: boolean;
  /** Whether this simulation includes a STEMI activation decision */
  requiresStemiActivation: boolean;
  /** Clinical safety flags the learner must navigate */
  criticalSafetyDecisions: ReadonlyArray<string>;
};

// ─── Validation ────────────────────────────────────────────────────────────────

export const SIMULATION_REQUIRED_FIELDS: ReadonlyArray<keyof EcgSimulationRecord> = [
  "id", "title", "summary", "publishStatus", "targetProfessions",
  "environment", "patient", "rhythmProgression", "decisionPoints",
  "debrief", "primaryDomains", "estimatedMinutes", "difficulty",
];

export function validateEcgSimulation(sim: EcgSimulationRecord): string[] {
  if (sim.publishStatus === "draft") return [];
  const errors: string[] = [];

  for (const field of SIMULATION_REQUIRED_FIELDS) {
    const val = sim[field];
    if (val === undefined || val === null || val === "") {
      errors.push(`${sim.id}: required field "${field}" missing`);
    }
  }

  if (sim.rhythmProgression.length < 2) {
    errors.push(`${sim.id}: rhythmProgression must have ≥2 nodes (initial + at least one change)`);
  }
  if (sim.decisionPoints.length < 1) {
    errors.push(`${sim.id}: must have ≥1 decisionPoint`);
  }
  if (sim.debrief.learningObjectives.length < 1) {
    errors.push(`${sim.id}: debrief must have ≥1 learningObjective`);
  }
  if (sim.targetProfessions.length < 1) {
    errors.push(`${sim.id}: must target ≥1 profession`);
  }

  // Life-threatening simulations require a code-related decision point
  const hasLifeThreatening = sim.rhythmProgression.some(
    (n) => n.riskLevel === "life_threatening",
  );
  if (hasLifeThreatening && sim.decisionPoints.every((dp) => dp.decisionType !== "escalation")) {
    errors.push(`${sim.id}: simulation includes life-threatening rhythm but has no escalation decision point`);
  }

  return errors;
}
