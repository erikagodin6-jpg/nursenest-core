/**
 * Clinical Pathway Composer
 *
 * Reusable clinical pathway packages that compose simulations rather than
 * requiring every simulation to be fully authored from scratch.
 *
 * A ClinicalPathway defines:
 *   - The physiologic stages (maps to a DeteriorationPattern)
 *   - Decision points (when the learner must act)
 *   - Stabilization branches (what happens when treatment is applied)
 *   - Escalation windows (time-sensitive action requirements)
 *   - NGN cue sets (pre-mapped to NCJMM domains)
 *   - Documentation tasks
 *   - Harm Index event thresholds
 *
 * Simulations are assembled by composing a pathway + a patient brief +
 * profession-specific learning objectives.
 *
 * Usage:
 *   const pathway = getPathway("stemi");
 *   const simulation = composeSimulation(pathway, {
 *     patientBrief: "72-year-old male...",
 *     profession: "RN",
 *     difficulty: "proficient",
 *   });
 */

import type { MonitorMode } from "./physiology-state";
import type { NgnQuestionFormat, SimulationProfession, SimulationDifficulty } from "./simulation-catalog";
import type { NcjmmDomain } from "./clinical-judgment-engine";

// ─── Pathway types ────────────────────────────────────────────────────────────

export type PathwayCategory =
  | "cardiac_ischemia"
  | "arrhythmia"
  | "shock"
  | "respiratory"
  | "neurological"
  | "metabolic"
  | "toxicological"
  | "critical_care";

export interface DecisionPoint {
  /** Tick from session start at which this decision must be made. */
  tickDeadline: number;
  description: string;
  /** The action required. Maps to an intervention key or "escalation". */
  requiredAction: string;
  /** What happens if the learner misses this deadline. */
  consequenceIfMissed: string;
  isHarmIfMissed: boolean;
  /** NCJMM domain primarily exercised at this point. */
  primaryDomain: NcjmmDomain;
}

export interface StabilizationBranch {
  /** Intervention key that triggers this branch. */
  triggerInterventionKey: string;
  description: string;
  /** Vital parameters that improve when this branch activates. */
  expectedImprovements: string[];
  /** Whether this branch prevents stage advancement. */
  stopsDeterioration: boolean;
}

export interface PathwayNgnCueSet {
  stage: "early" | "developing" | "severe";
  format: NgnQuestionFormat;
  /** Pre-mapped cues the learner should identify from the monitor. */
  cues: string[];
  /** Expected actions (for bowtie/matrix). */
  expectedInterventions: string[];
  /** Primary NCJMM domain for this cue set. */
  domain: NcjmmDomain;
}

export interface DocumentationTask {
  /** When to complete this documentation. */
  triggerStage: "early" | "developing" | "severe" | "critical";
  description: string;
  elements: string[];           // e.g. ["Vital signs", "SBAR to MD", "Pain reassessment"]
  isRequired: boolean;
  ncjmmDomain: NcjmmDomain;
}

export interface PathwayHarmThreshold {
  vital: string;
  criticalValue: string;
  responseWindowTicks: number;
  harmLevel: "near_miss" | "moderate" | "severe";
}

// ─── Clinical Pathway definition ──────────────────────────────────────────────

export interface ClinicalPathway {
  id: string;
  label: string;
  category: PathwayCategory;
  /** Underlying deterioration pattern key. */
  conditionKey: string;
  /** Default monitor mode for this pathway. */
  defaultMode: MonitorMode;
  /** Recommended professions for this pathway. */
  targetProfessions: SimulationProfession[];
  /** Difficulty range this pathway is suited for. */
  difficultyRange: [SimulationDifficulty, SimulationDifficulty];
  /** Estimated session duration in simulation minutes. */
  estimatedSimMinutes: number;
  /** Clinical context template (insert patient-specific data to complete). */
  contextTemplate: string;
  /** Key assessment findings learners should identify. */
  keyFindings: string[];
  /** Ordered decision points — define the critical action timeline. */
  decisionPoints: DecisionPoint[];
  /** Stabilization branches triggered by correct interventions. */
  stabilizationBranches: StabilizationBranch[];
  /** NGN cue sets for post-sim questions. */
  ngnCueSets: PathwayNgnCueSet[];
  /** Documentation tasks integrated throughout the simulation. */
  documentationTasks: DocumentationTask[];
  /** Harm thresholds specific to this pathway. */
  harmThresholds: PathwayHarmThreshold[];
  /** Primary NCJMM domains exercised. */
  primaryNcjmmDomains: NcjmmDomain[];
  tags: string[];
}

// ─── Composed simulation request ──────────────────────────────────────────────

export interface CompositionRequest {
  pathwayId: string;
  patientBrief: string;
  profession: SimulationProfession;
  difficulty: SimulationDifficulty;
  /** Override default monitor mode. */
  mode?: MonitorMode;
  /** Custom learning objectives (appended to pathway defaults). */
  additionalObjectives?: string[];
  /** Whether to include documentation tasks in this simulation. */
  includeDocumentation?: boolean;
}

// ─── Pathway catalog ──────────────────────────────────────────────────────────

export const CLINICAL_PATHWAYS: ClinicalPathway[] = [

  // ── STEMI ─────────────────────────────────────────────────────────────────
  {
    id: "stemi",
    label: "STEMI — ST-Elevation MI",
    category: "cardiac_ischemia",
    conditionKey: "stemi",
    defaultMode: "icu",
    targetProfessions: ["RN", "NP"],
    difficultyRange: ["developing", "advanced"],
    estimatedSimMinutes: 15,
    contextTemplate: "{{age}}-year-old presents with sudden-onset chest pain {{pain_score}}/10 and diaphoresis.",
    keyFindings: ["ST elevation on ECG", "Tachycardia", "Hypotension developing", "Diaphoresis", "Troponin rising"],
    decisionPoints: [
      { tickDeadline: 3, description: "12-lead ECG obtained and STEMI identified", requiredAction: "recognition", consequenceIfMissed: "Door-to-balloon time exceeded", isHarmIfMissed: true, primaryDomain: "recognize_cues" },
      { tickDeadline: 5, description: "Aspirin and nitroglycerin administered", requiredAction: "supplemental_o2", consequenceIfMissed: "Ischaemic burden extends", isHarmIfMissed: false, primaryDomain: "take_action" },
      { tickDeadline: 6, description: "Cath lab activation / cardiologist contacted", requiredAction: "escalation", consequenceIfMissed: "Door-to-balloon time > 90 min — Class I harm event", isHarmIfMissed: true, primaryDomain: "generate_solutions" },
    ],
    stabilizationBranches: [
      { triggerInterventionKey: "supplemental_o2", description: "Oxygen reduces ischaemic burden; HR stabilises", expectedImprovements: ["SpO₂ improvement", "HR decrease"], stopsDeterioration: false },
      { triggerInterventionKey: "amiodarone", description: "Arrhythmia suppression if VT develops", expectedImprovements: ["Rhythm stabilises"], stopsDeterioration: false },
    ],
    ngnCueSets: [
      { stage: "early", format: "sata", cues: ["ST elevation", "chest pain", "diaphoresis", "tachycardia"], expectedInterventions: ["aspirin", "oxygen", "IV access", "cath lab activation"], domain: "recognize_cues" },
      { stage: "developing", format: "bowtie", cues: ["falling BP", "worsening ST elevation", "new VT"], expectedInterventions: ["defibrillation", "escalation", "vasopressor"], domain: "prioritize_hypotheses" },
    ],
    documentationTasks: [
      { triggerStage: "early", description: "Document 12-lead ECG findings and STEMI identification time", elements: ["ECG interpretation", "Time of recognition", "Provider notification"], isRequired: true, ncjmmDomain: "recognize_cues" },
      { triggerStage: "developing", description: "Document deteriorating haemodynamics and escalation", elements: ["Vital signs trend", "Interventions applied", "SBAR to cardiology"], isRequired: true, ncjmmDomain: "evaluate_outcomes" },
    ],
    harmThresholds: [
      { vital: "systolicBP", criticalValue: "< 70 mmHg", responseWindowTicks: 2, harmLevel: "severe" },
      { vital: "ecgRhythm", criticalValue: "VT/VF", responseWindowTicks: 1, harmLevel: "severe" },
    ],
    primaryNcjmmDomains: ["recognize_cues", "take_action", "evaluate_outcomes"],
    tags: ["stemi", "cardiac", "ischemia", "rn", "np", "icu", "emergency"],
  },

  // ── SEPSIS ────────────────────────────────────────────────────────────────
  {
    id: "sepsis",
    label: "Sepsis — Early Recognition & Bundle",
    category: "shock",
    conditionKey: "sepsis",
    defaultMode: "general",
    targetProfessions: ["RN", "RPN", "NP"],
    difficultyRange: ["foundational", "proficient"],
    estimatedSimMinutes: 20,
    contextTemplate: "{{age}}-year-old with {{source}} infection, fever {{temp}}°C, altered mental status.",
    keyFindings: ["Tachycardia", "Hypotension", "Fever or hypothermia", "Elevated lactate", "Tachypnoea", "Altered LOC"],
    decisionPoints: [
      { tickDeadline: 3, description: "Sepsis recognised using qSOFA / SIRS criteria", requiredAction: "recognition", consequenceIfMissed: "Sepsis bundle initiation delayed", isHarmIfMissed: false, primaryDomain: "recognize_cues" },
      { tickDeadline: 5, description: "Blood cultures obtained and antibiotics initiated", requiredAction: "escalation", consequenceIfMissed: "Each hour delay increases mortality 7%", isHarmIfMissed: true, primaryDomain: "generate_solutions" },
      { tickDeadline: 6, description: "30 mL/kg crystalloid fluid bolus initiated", requiredAction: "fluid_bolus", consequenceIfMissed: "Tissue hypoperfusion worsens, lactate rises", isHarmIfMissed: true, primaryDomain: "take_action" },
      { tickDeadline: 10, description: "Reassessment of fluid response documented", requiredAction: "recognition", consequenceIfMissed: "Over-resuscitation or under-resuscitation undetected", isHarmIfMissed: false, primaryDomain: "evaluate_outcomes" },
    ],
    stabilizationBranches: [
      { triggerInterventionKey: "fluid_bolus", description: "MAP improves, HR decreases, lactate trends down", expectedImprovements: ["MAP +8 mmHg", "HR -15 bpm", "Lactate trend down"], stopsDeterioration: false },
      { triggerInterventionKey: "norepinephrine", description: "Vasopressor maintains MAP ≥ 65 in vasoplegic shock", expectedImprovements: ["MAP stabilises", "Peripheral perfusion improves"], stopsDeterioration: true },
    ],
    ngnCueSets: [
      { stage: "early", format: "prioritization", cues: ["fever", "tachycardia", "altered LOC", "hypotension", "low UO"], expectedInterventions: ["blood cultures", "antibiotics", "fluid bolus", "lactate"], domain: "prioritize_hypotheses" },
      { stage: "severe", format: "matrix", cues: ["persistent hypotension", "rising lactate", "oliguria"], expectedInterventions: ["vasopressor", "ICU transfer", "reassessment"], domain: "generate_solutions" },
    ],
    documentationTasks: [
      { triggerStage: "early", description: "Complete sepsis screening tool (qSOFA / SIRS)", elements: ["qSOFA score", "Lactate result", "Source identification"], isRequired: true, ncjmmDomain: "analyze_cues" },
      { triggerStage: "developing", description: "Sepsis bundle compliance documentation", elements: ["Antibiotics given time", "Cultures drawn", "Fluid volume administered"], isRequired: true, ncjmmDomain: "take_action" },
    ],
    harmThresholds: [
      { vital: "map", criticalValue: "< 55 mmHg", responseWindowTicks: 3, harmLevel: "moderate" },
      { vital: "lactate", criticalValue: "> 8 mmol/L", responseWindowTicks: 4, harmLevel: "severe" },
    ],
    primaryNcjmmDomains: ["recognize_cues", "generate_solutions", "take_action", "evaluate_outcomes"],
    tags: ["sepsis", "infection", "shock", "rn", "rpn", "np", "bundle"],
  },

  // ── RESPIRATORY FAILURE ───────────────────────────────────────────────────
  {
    id: "respiratory_failure",
    label: "Acute Respiratory Failure",
    category: "respiratory",
    conditionKey: "ards",
    defaultMode: "rt",
    targetProfessions: ["RN", "RT"],
    difficultyRange: ["developing", "advanced"],
    estimatedSimMinutes: 18,
    contextTemplate: "Mechanically ventilated {{age}}-year-old post-{{event}} with progressive bilateral infiltrates.",
    keyFindings: ["SpO₂ < 90% on high FiO₂", "Rising plateau pressure", "Bilateral infiltrates", "Reduced compliance", "PaO₂/FiO₂ < 200"],
    decisionPoints: [
      { tickDeadline: 3, description: "ARDS criteria identified (Berlin definition)", requiredAction: "recognition", consequenceIfMissed: "Ventilator strategy not adjusted — VILI risk", isHarmIfMissed: false, primaryDomain: "analyze_cues" },
      { tickDeadline: 5, description: "Lung-protective ventilation initiated (6 mL/kg IBW)", requiredAction: "increase_peep", consequenceIfMissed: "Volutrauma extends ARDS", isHarmIfMissed: true, primaryDomain: "take_action" },
      { tickDeadline: 8, description: "Prone positioning considered for PaO₂/FiO₂ < 150", requiredAction: "escalation", consequenceIfMissed: "Refractory hypoxaemia unaddressed", isHarmIfMissed: false, primaryDomain: "generate_solutions" },
    ],
    stabilizationBranches: [
      { triggerInterventionKey: "increase_peep", description: "PEEP increase improves alveolar recruitment, SpO₂ rises", expectedImprovements: ["SpO₂ +4%", "FiO₂ requirement decreases"], stopsDeterioration: false },
    ],
    ngnCueSets: [
      { stage: "early", format: "sata", cues: ["high plateau pressure", "bilateral crackles", "low SpO₂ despite FiO₂ increase", "non-cardiac infiltrates"], expectedInterventions: ["reduce VT to 6 mL/kg", "increase PEEP", "pause sedation for SAT"], domain: "recognize_cues" },
      { stage: "severe", format: "bowtie", cues: ["SpO₂ < 85% despite FiO₂ 1.0", "PEEP 18"], expectedInterventions: ["prone positioning", "inhaled NO", "ECMO referral"], domain: "generate_solutions" },
    ],
    documentationTasks: [
      { triggerStage: "early", description: "Ventilator parameter documentation and ARDS classification", elements: ["PaO₂/FiO₂ ratio", "Berlin criteria", "Tidal volume per kg IBW"], isRequired: true, ncjmmDomain: "analyze_cues" },
    ],
    harmThresholds: [
      { vital: "plateau_pressure", criticalValue: "> 30 cmH₂O", responseWindowTicks: 2, harmLevel: "moderate" },
      { vital: "spo2", criticalValue: "< 80%", responseWindowTicks: 2, harmLevel: "severe" },
    ],
    primaryNcjmmDomains: ["analyze_cues", "take_action", "evaluate_outcomes"],
    tags: ["ards", "respiratory-failure", "ventilator", "rt", "rn", "icu"],
  },

  // ── CARDIAC ARREST ────────────────────────────────────────────────────────
  {
    id: "cardiac_arrest",
    label: "Cardiac Arrest — VT/VF",
    category: "arrhythmia",
    conditionKey: "vt_to_vf",
    defaultMode: "icu",
    targetProfessions: ["RN", "RPN", "RT", "NEW_GRAD"],
    difficultyRange: ["developing", "advanced"],
    estimatedSimMinutes: 12,
    contextTemplate: "Monitor alarm fires. {{age}}-year-old patient unresponsive. Rhythm: wide-complex tachycardia.",
    keyFindings: ["No pulse", "Wide-complex VT progressing to VF", "Loss of consciousness", "Apnoea"],
    decisionPoints: [
      { tickDeadline: 1, description: "Pulse check and code activation within 30 seconds", requiredAction: "recognition", consequenceIfMissed: "CPR delay — survival reduced 10% per minute", isHarmIfMissed: true, primaryDomain: "recognize_cues" },
      { tickDeadline: 2, description: "CPR initiated and defibrillator obtained", requiredAction: "cpr", consequenceIfMissed: "Survival falls below 20% without early CPR", isHarmIfMissed: true, primaryDomain: "take_action" },
      { tickDeadline: 3, description: "Defibrillation delivered for shockable rhythm", requiredAction: "defibrillation", consequenceIfMissed: "Every 1-minute delay to defibrillation reduces survival ~10%", isHarmIfMissed: true, primaryDomain: "take_action" },
    ],
    stabilizationBranches: [
      { triggerInterventionKey: "defibrillation", description: "ROSC achieved — rhythm converts to sinus", expectedImprovements: ["Pulse returns", "MAP recovers", "SpO₂ improves"], stopsDeterioration: true },
      { triggerInterventionKey: "amiodarone", description: "Post-shock amiodarone reduces recurrent VF", expectedImprovements: ["VF recurrence rate falls"], stopsDeterioration: false },
    ],
    ngnCueSets: [
      { stage: "severe", format: "prioritization", cues: ["unresponsive", "VF on monitor", "no pulse", "apnoea"], expectedInterventions: ["call code", "start CPR", "defibrillate", "epinephrine"], domain: "take_action" },
    ],
    documentationTasks: [
      { triggerStage: "severe", description: "Code documentation — resuscitation timeline", elements: ["Time of arrest", "CPR initiation time", "First shock time", "Medications given", "ROSC time"], isRequired: true, ncjmmDomain: "evaluate_outcomes" },
    ],
    harmThresholds: [
      { vital: "ecgRhythm", criticalValue: "VF/Asystole", responseWindowTicks: 1, harmLevel: "severe" },
    ],
    primaryNcjmmDomains: ["recognize_cues", "take_action", "evaluate_outcomes"],
    tags: ["cardiac-arrest", "cpr", "vt", "vf", "acls", "rn", "rpn"],
  },

  // ── PULMONARY EMBOLISM ────────────────────────────────────────────────────
  {
    id: "pulmonary_embolism",
    label: "Massive Pulmonary Embolism",
    category: "respiratory",
    conditionKey: "pulmonary_embolism",
    defaultMode: "icu",
    targetProfessions: ["RN", "NP"],
    difficultyRange: ["developing", "proficient"],
    estimatedSimMinutes: 16,
    contextTemplate: "Post-surgical {{age}}-year-old develops sudden dyspnoea, chest pain, and haemodynamic instability.",
    keyFindings: ["Tachycardia", "Hypoxaemia", "Hypotension", "Right heart strain on ECG", "Elevated CVP"],
    decisionPoints: [
      { tickDeadline: 4, description: "PE suspected and CTPA / bedside echo ordered", requiredAction: "recognition", consequenceIfMissed: "Diagnosis delayed, anticoagulation not started", isHarmIfMissed: false, primaryDomain: "analyze_cues" },
      { tickDeadline: 6, description: "Anticoagulation initiated", requiredAction: "supplemental_o2", consequenceIfMissed: "Clot propagation", isHarmIfMissed: false, primaryDomain: "take_action" },
      { tickDeadline: 8, description: "Haemodynamic support initiated (massive PE)", requiredAction: "fluid_bolus", consequenceIfMissed: "Cardiogenic shock worsens", isHarmIfMissed: true, primaryDomain: "generate_solutions" },
    ],
    stabilizationBranches: [
      { triggerInterventionKey: "supplemental_o2", description: "Oxygen corrects hypoxaemia", expectedImprovements: ["SpO₂ improves"], stopsDeterioration: false },
    ],
    ngnCueSets: [
      { stage: "developing", format: "bowtie", cues: ["sudden dyspnoea", "tachycardia", "low SpO₂", "hypotension", "RBBB on ECG"], expectedInterventions: ["anticoagulation", "thrombolysis for massive PE", "fluid cautiously"], domain: "prioritize_hypotheses" },
    ],
    documentationTasks: [
      { triggerStage: "early", description: "DVT/PE risk assessment and pre-test probability", elements: ["Wells score", "D-dimer ordered", "Risk factors documented"], isRequired: false, ncjmmDomain: "analyze_cues" },
    ],
    harmThresholds: [
      { vital: "spo2", criticalValue: "< 85%", responseWindowTicks: 3, harmLevel: "moderate" },
      { vital: "map", criticalValue: "< 55 mmHg", responseWindowTicks: 3, harmLevel: "severe" },
    ],
    primaryNcjmmDomains: ["analyze_cues", "prioritize_hypotheses", "generate_solutions"],
    tags: ["pe", "pulmonary-embolism", "dvt", "rn", "np"],
  },

  // ── HYPERKALEMIA ──────────────────────────────────────────────────────────
  {
    id: "hyperkalemia",
    label: "Severe Hyperkalemia",
    category: "metabolic",
    conditionKey: "hyperkalemia",
    defaultMode: "icu",
    targetProfessions: ["RN", "NP"],
    difficultyRange: ["developing", "proficient"],
    estimatedSimMinutes: 14,
    contextTemplate: "ESRD patient on haemodialysis missed two sessions. K⁺ = {{potassium}} mEq/L.",
    keyFindings: ["Peaked T waves", "Widened QRS", "Bradycardia", "Potassium > 6.5", "Weakness"],
    decisionPoints: [
      { tickDeadline: 3, description: "ECG changes from hyperkalemia identified", requiredAction: "recognition", consequenceIfMissed: "Cardiac arrhythmia risk unrecognised", isHarmIfMissed: false, primaryDomain: "recognize_cues" },
      { tickDeadline: 4, description: "Calcium gluconate given for cardiac membrane stabilisation", requiredAction: "calcium_gluconate", consequenceIfMissed: "No cardiac protection before potassium lowering", isHarmIfMissed: true, primaryDomain: "take_action" },
      { tickDeadline: 6, description: "Insulin/glucose infusion initiated", requiredAction: "insulin_glucose", consequenceIfMissed: "Potassium continues to rise", isHarmIfMissed: false, primaryDomain: "take_action" },
    ],
    stabilizationBranches: [
      { triggerInterventionKey: "calcium_gluconate", description: "ECG changes partially reverse; QRS narrows", expectedImprovements: ["QRS width decreases", "T-wave amplitude reduces"], stopsDeterioration: false },
      { triggerInterventionKey: "insulin_glucose", description: "Potassium shifts intracellularly", expectedImprovements: ["K⁺ falls 0.5–1 mEq/L over 30 min"], stopsDeterioration: true },
    ],
    ngnCueSets: [
      { stage: "early", format: "sata", cues: ["peaked T waves", "widened QRS", "bradycardia", "high K⁺", "ESRD history"], expectedInterventions: ["calcium gluconate", "insulin/glucose", "kayexalate", "dialysis"], domain: "analyze_cues" },
    ],
    documentationTasks: [
      { triggerStage: "early", description: "Electrolyte critical value communication", elements: ["Lab result notification", "Verbal read-back", "Intervention ordered"], isRequired: true, ncjmmDomain: "take_action" },
    ],
    harmThresholds: [
      { vital: "potassium", criticalValue: "> 7.5 mEq/L", responseWindowTicks: 3, harmLevel: "severe" },
    ],
    primaryNcjmmDomains: ["recognize_cues", "analyze_cues", "take_action"],
    tags: ["hyperkalemia", "electrolyte", "ecg", "renal", "rn", "np"],
  },

];

// ─── Lookup ───────────────────────────────────────────────────────────────────

export function getPathway(id: string): ClinicalPathway | null {
  return CLINICAL_PATHWAYS.find((p) => p.id === id) ?? null;
}

export function getPathwaysByCategory(category: PathwayCategory): ClinicalPathway[] {
  return CLINICAL_PATHWAYS.filter((p) => p.category === category);
}

export function getPathwaysByCondition(conditionKey: string): ClinicalPathway[] {
  return CLINICAL_PATHWAYS.filter((p) => p.conditionKey === conditionKey);
}

export function getPathwaysByProfession(profession: SimulationProfession): ClinicalPathway[] {
  return CLINICAL_PATHWAYS.filter((p) => p.targetProfessions.includes(profession));
}

export const PATHWAY_IDS = CLINICAL_PATHWAYS.map((p) => p.id);
export const PATHWAY_COUNT = CLINICAL_PATHWAYS.length;

// ─── Simulation composition helper ───────────────────────────────────────────

/**
 * Compose simulation metadata from a pathway definition.
 * Returns fields compatible with SimulationDefinition for dynamic simulation generation.
 */
export function composeSimulationFromPathway(
  pathway: ClinicalPathway,
  req: CompositionRequest,
): {
  conditionKey: string;
  monitorMode: MonitorMode;
  patientBrief: string;
  learningObjectives: string[];
  criticalActions: Array<{ timeLimitTicks: number; description: string; interventionKey: string | null; isHarmIfMissed: boolean }>;
  documentationPrompts: string[];
  ngnFormats: NgnQuestionFormat[];
  primaryNcjmmDomains: string[];
  tags: string[];
} {
  const mode = req.mode ?? pathway.defaultMode;

  const learningObjectives = [
    `Identify ${pathway.keyFindings.slice(0, 3).join(", ")} from monitor data`,
    `Apply the ${pathway.decisionPoints[0]?.description ?? "indicated"} within the optimal window`,
    ...pathway.stabilizationBranches.slice(0, 2).map((b) => `Recognise: ${b.description}`),
    ...(req.additionalObjectives ?? []),
  ].slice(0, 5);

  const criticalActions = pathway.decisionPoints.map((dp) => ({
    timeLimitTicks: dp.tickDeadline,
    description: dp.description,
    interventionKey: dp.requiredAction === "recognition" || dp.requiredAction === "escalation"
      ? null
      : dp.requiredAction,
    isHarmIfMissed: dp.isHarmIfMissed,
  }));

  const documentationPrompts = req.includeDocumentation
    ? pathway.documentationTasks.map((t) => t.description)
    : [];

  const ngnFormats = [...new Set(pathway.ngnCueSets.map((c) => c.format))];

  return {
    conditionKey: pathway.conditionKey,
    monitorMode: mode,
    patientBrief: req.patientBrief,
    learningObjectives,
    criticalActions,
    documentationPrompts,
    ngnFormats,
    primaryNcjmmDomains: pathway.primaryNcjmmDomains,
    tags: [...pathway.tags, req.profession.toLowerCase(), req.difficulty],
  };
}
