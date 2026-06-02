/**
 * Clinical Pathways — Reusable Pathway Library
 *
 * Simulations compose pathways instead of duplicating logic.
 * Each pathway defines the complete clinical trajectory for a condition class:
 *   - progression stages with vital deltas
 *   - rhythm sequence
 *   - optimal intervention bundle (ordered)
 *   - escalation triggers
 *   - harm outcomes if untreated
 *   - stabilisation branches (if treated correctly)
 *   - documentation prompts
 *   - NGN cue sets for question generation
 *   - assessment cues for each stage
 *
 * Pathways are condition-class abstractions — a pathway like "sepsis" can drive
 * both "rn-sepsis-early" and "rn-septic-shock" simulations with different
 * opening stages.
 */

import type { ConditionStage } from "./physiology-state";
import type { NgnQuestionFormat } from "./simulation-catalog";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PathwayId =
  | "stemi"
  | "sepsis"
  | "shock"
  | "respiratory_failure"
  | "hyperkalemia"
  | "stroke"
  | "gi_bleed"
  | "pe"
  | "dka"
  | "bradycardia"
  | "tachyarrhythmia"
  | "cardiac_arrest"
  | "anaphylaxis"
  | "opioid_toxicity";

export interface PathwayStageData {
  label: string;
  /** Key clinical findings that should be recognized at this stage. */
  recognitionCues: string[];
  /** Optimal interventions for this stage (in priority order). */
  optimalInterventions: string[];
  /** If these interventions are NOT applied within windowTicks, harm occurs. */
  harmIfMissedTicks: number;
  /** Description of harm if stage is not treated. */
  harmDescription: string;
  /** Description of outcome if stage IS treated optimally. */
  stabilisationOutcome: string;
  /** ECG pattern at this stage. */
  ecgPattern: string;
}

export interface EscalationTrigger {
  description: string;
  vitalThreshold: string;
  escalationTarget: string;
  timeLimitSec: number;
}

export interface NgnCueSet {
  format: NgnQuestionFormat;
  /** Stem template — use {conditionLabel}, {stage}, {vital} as placeholders. */
  stemTemplate: string;
  /** Correct cues / answers for this format. */
  correctCues: string[];
  /** Incorrect distractors. */
  distractors: string[];
}

export interface DocumentationPrompt {
  category: "assessment" | "intervention" | "escalation" | "reassessment";
  prompt: string;
  required: boolean;
}

export interface StabilisationBranch {
  /** Interventions that trigger this stabilisation branch. */
  triggerInterventions: string[];
  /** Vital signs that confirm stabilisation. */
  vitalTargets: Array<{ vital: string; target: string }>;
  /** What learner should observe after successful stabilisation. */
  expectedMonitorChanges: string[];
  /** Educational note on why these interventions worked. */
  mechanismExplanation: string;
}

export interface ClinicalPathway {
  id: PathwayId;
  name: string;
  conditionKeys: string[];
  description: string;
  stages: Record<ConditionStage, PathwayStageData>;
  escalationTriggers: EscalationTrigger[];
  stabilisationBranches: StabilisationBranch[];
  documentationPrompts: DocumentationPrompt[];
  ngnCueSets: NgnCueSet[];
  /** Tags for filtering / cross-referencing. */
  tags: string[];
}

// ─── Pathways ─────────────────────────────────────────────────────────────────

export const CLINICAL_PATHWAYS: ClinicalPathway[] = [

  // ── STEMI ──────────────────────────────────────────────────────────────────
  {
    id: "stemi",
    name: "STEMI",
    conditionKeys: ["stemi"],
    description: "Acute ST-elevation myocardial infarction — transmural ischaemia requiring emergent reperfusion.",
    stages: {
      early: {
        label: "ST Elevation — Hemodynamically Stable",
        recognitionCues: ["ST elevation on monitor", "chest pain", "diaphoresis", "pain radiation"],
        optimalInterventions: ["supplemental_o2"],
        harmIfMissedTicks: 3,
        harmDescription: "Delay in reperfusion increases myocardium at risk — every 30 minutes doubles mortality.",
        stabilisationOutcome: "Oxygen supplementation, aspirin, and cath lab activation prevent progression to cardiogenic shock.",
        ecgPattern: "stemi_pattern with ST elevation",
      },
      developing: {
        label: "Expanding Infarct — Rising Troponin",
        recognitionCues: ["widening QRS", "falling BP", "rising troponin", "declining cardiac output"],
        optimalInterventions: ["supplemental_o2"],
        harmIfMissedTicks: 4,
        harmDescription: "Expanding ischaemia progresses to cardiogenic shock without reperfusion.",
        stabilisationOutcome: "Emergent PCI within 90 minutes of first medical contact prevents cardiogenic shock.",
        ecgPattern: "stemi_pattern with widened QRS",
      },
      severe: {
        label: "Cardiogenic Shock — VT Risk",
        recognitionCues: ["ventricular tachycardia", "hypotension", "pulmonary edema", "AV dissociation"],
        optimalInterventions: ["amiodarone", "defibrillation"],
        harmIfMissedTicks: 2,
        harmDescription: "VT without treatment degenerates to VF within minutes.",
        stabilisationOutcome: "Amiodarone terminates VT; defibrillation treats VF. Mechanical circulatory support for cardiogenic shock.",
        ecgPattern: "ventricular_tachycardia",
      },
      critical: {
        label: "Ventricular Fibrillation — Cardiac Arrest",
        recognitionCues: ["VF on monitor", "pulselessness", "loss of consciousness"],
        optimalInterventions: ["defibrillation", "cpr", "amiodarone"],
        harmIfMissedTicks: 1,
        harmDescription: "VF without defibrillation causes irreversible anoxic brain injury within 4–6 minutes.",
        stabilisationOutcome: "Immediate defibrillation (200J) + high-quality CPR achieves ROSC in 40–50% of cases.",
        ecgPattern: "ventricular_fibrillation",
      },
    },
    escalationTriggers: [
      { description: "BP < 90 systolic", vitalThreshold: "SBP < 90", escalationTarget: "Cardiologist + ICU team", timeLimitSec: 120 },
      { description: "VT or VF on monitor", vitalThreshold: "VT/VF rhythm", escalationTarget: "Code Blue activation", timeLimitSec: 60 },
      { description: "New LBBB with chest pain", vitalThreshold: "LBBB + chest pain", escalationTarget: "STEMI equivalent activation", timeLimitSec: 120 },
    ],
    stabilisationBranches: [
      {
        triggerInterventions: ["supplemental_o2"],
        vitalTargets: [{ vital: "SpO₂", target: "≥ 94%" }],
        expectedMonitorChanges: ["SpO₂ improving", "HR settling"],
        mechanismExplanation: "Supplemental O₂ maintains myocardial oxygen delivery during ischaemia.",
      },
      {
        triggerInterventions: ["defibrillation", "cpr"],
        vitalTargets: [{ vital: "rhythm", target: "Organised rhythm post-ROSC" }, { vital: "EtCO₂", target: "≥ 40 mmHg" }],
        expectedMonitorChanges: ["VF converts to organised rhythm", "SpO₂ recovers", "EtCO₂ rises after ROSC"],
        mechanismExplanation: "Defibrillation terminates chaotic electrical activity; CPR maintains perfusion pressure until ROSC.",
      },
    ],
    documentationPrompts: [
      { category: "assessment", prompt: "Document time of STEMI identification and 12-lead ECG acquisition", required: true },
      { category: "intervention", prompt: "Record aspirin 325 mg administered: time, dose, route", required: true },
      { category: "escalation", prompt: "Document cath lab activation time — door-to-balloon target", required: true },
      { category: "reassessment", prompt: "Reassess and document BP, HR, rhythm every 5 minutes", required: true },
    ],
    ngnCueSets: [
      {
        format: "bowtie",
        stemTemplate: "A patient presents with {vital} and ST elevation in V1–V4. Which actions should the nurse take FIRST?",
        correctCues: ["Activate STEMI protocol", "Administer aspirin 325 mg", "Obtain IV access × 2", "Continuous ECG monitoring"],
        distractors: ["Administer metoprolol IV", "Place NG tube", "Obtain portable CXR before aspirin", "Start IV heparin before physician order"],
      },
      {
        format: "sata",
        stemTemplate: "Which findings support a STEMI diagnosis in a patient with chest pain?",
        correctCues: ["ST elevation ≥ 1 mm in contiguous leads", "Reciprocal ST depression", "Rising serial troponin", "New LBBB"],
        distractors: ["ST depression only", "T-wave inversion in V4–V6", "Normal ECG", "Right bundle branch block alone"],
      },
    ],
    tags: ["stemi", "acs", "cardiac", "arrhythmia", "defibrillation"],
  },

  // ── SEPSIS ─────────────────────────────────────────────────────────────────
  {
    id: "sepsis",
    name: "Sepsis / Septic Shock",
    conditionKeys: ["sepsis", "septic_shock"],
    description: "Life-threatening organ dysfunction from dysregulated host response to infection.",
    stages: {
      early: {
        label: "SIRS — Early Sepsis",
        recognitionCues: ["fever > 38°C or < 36°C", "HR > 90", "RR > 20", "suspected infection"],
        optimalInterventions: ["supplemental_o2", "fluid_bolus"],
        harmIfMissedTicks: 4,
        harmDescription: "Untreated early sepsis progresses to septic shock — each hour of antibiotic delay increases mortality 7%.",
        stabilisationOutcome: "Early fluid resuscitation and antibiotics prevent progression to organ failure.",
        ecgPattern: "sinus_tachycardia",
      },
      developing: {
        label: "Sepsis — Organ Hypoperfusion",
        recognitionCues: ["MAP < 70", "lactate > 2 mmol/L", "rising RR", "oliguria"],
        optimalInterventions: ["fluid_bolus", "supplemental_o2"],
        harmIfMissedTicks: 4,
        harmDescription: "Persistent hypoperfusion causes AKI, coagulopathy, and hepatic dysfunction.",
        stabilisationOutcome: "30 mL/kg crystalloid and antibiotics within 3 hours improve outcomes.",
        ecgPattern: "sinus_tachycardia",
      },
      severe: {
        label: "Severe Sepsis — Organ Failure",
        recognitionCues: ["GCS change", "creatinine rising", "lactate > 4", "SpO₂ < 92%"],
        optimalInterventions: ["norepinephrine", "fluid_bolus"],
        harmIfMissedTicks: 3,
        harmDescription: "Multi-organ failure without vasopressor support — irreversible organ damage within hours.",
        stabilisationOutcome: "Vasopressors targeting MAP ≥ 65 restore organ perfusion pressure.",
        ecgPattern: "sinus_tachycardia",
      },
      critical: {
        label: "Septic Shock — Refractory Vasodilation",
        recognitionCues: ["MAP < 65 despite fluids", "lactate > 4 mmol/L", "vasopressor-dependent", "AFib onset"],
        optimalInterventions: ["norepinephrine"],
        harmIfMissedTicks: 2,
        harmDescription: "Refractory septic shock leads to cardiac arrest from profound hypotension.",
        stabilisationOutcome: "Norepinephrine first-line; add vasopressin 0.04 units/min if refractory.",
        ecgPattern: "atrial_fibrillation",
      },
    },
    escalationTriggers: [
      { description: "MAP < 65 after 30 mL/kg fluid", vitalThreshold: "MAP < 65", escalationTarget: "ICU team / vasopressor initiation", timeLimitSec: 180 },
      { description: "Lactate ≥ 4 mmol/L", vitalThreshold: "Lactate ≥ 4", escalationTarget: "ICU consult", timeLimitSec: 120 },
      { description: "GCS drop ≥ 2 points", vitalThreshold: "GCS ↓ ≥ 2", escalationTarget: "Rapid response / ICU transfer", timeLimitSec: 120 },
    ],
    stabilisationBranches: [
      {
        triggerInterventions: ["fluid_bolus"],
        vitalTargets: [{ vital: "MAP", target: "≥ 65 mmHg" }, { vital: "HR", target: "< 100 bpm" }],
        expectedMonitorChanges: ["BP rising after bolus", "HR decreasing", "UO increasing"],
        mechanismExplanation: "Crystalloid expands intravascular volume in distributive shock — cardiac preload restored.",
      },
      {
        triggerInterventions: ["norepinephrine"],
        vitalTargets: [{ vital: "MAP", target: "≥ 65 mmHg" }],
        expectedMonitorChanges: ["MAP rising on vasopressor", "UO improving"],
        mechanismExplanation: "Norepinephrine increases SVR, overcoming pathological vasodilation in septic shock.",
      },
    ],
    documentationPrompts: [
      { category: "assessment", prompt: "Document SIRS criteria met with time of recognition", required: true },
      { category: "intervention", prompt: "Record fluid volume, type, rate, and response", required: true },
      { category: "intervention", prompt: "Document antibiotic: drug, dose, time from recognition", required: true },
      { category: "reassessment", prompt: "Lactate repeat at 2 hours — document trend", required: true },
    ],
    ngnCueSets: [
      {
        format: "bowtie",
        stemTemplate: "A patient has fever 39.2°C, HR 118, BP 88/52, RR 26, lactate 4.8. What are the PRIORITY actions?",
        correctCues: ["Blood cultures × 2 BEFORE antibiotics", "Broad-spectrum antibiotics within 1 hour", "30 mL/kg crystalloid bolus", "Vasopressors if MAP < 65 after fluids"],
        distractors: ["Chest X-ray before antibiotics", "Insert Foley after stabilisation", "Furosemide for pulmonary edema", "Hold fluids — CVP is elevated"],
      },
      {
        format: "matrix",
        stemTemplate: "Match each sepsis finding with its clinical significance:",
        correctCues: ["Lactate ≥ 4 → tissue hypoperfusion / poor prognosis", "MAP < 65 → organ perfusion threshold", "HR > 90 → SIRS criterion / compensatory", "Fever → SIRS criterion / infectious trigger"],
        distractors: ["Lactate ≥ 4 → pulmonary edema", "MAP < 65 → normal in elderly"],
      },
    ],
    tags: ["sepsis", "shock", "infection", "lactate", "vasopressors"],
  },

  // ── SHOCK ──────────────────────────────────────────────────────────────────
  {
    id: "shock",
    name: "Shock States",
    conditionKeys: ["sepsis", "gi_bleed", "cardiac_tamponade", "anaphylaxis", "complex_shock"],
    description: "Unified shock pathway covering distributive, hypovolemic, cardiogenic, and obstructive subtypes.",
    stages: {
      early: {
        label: "Compensated Shock",
        recognitionCues: ["tachycardia", "cool extremities", "delayed capillary refill", "anxiety"],
        optimalInterventions: ["fluid_bolus", "supplemental_o2"],
        harmIfMissedTicks: 4,
        harmDescription: "Compensated shock progresses to decompensated when catecholamine reserves exhaust.",
        stabilisationOutcome: "Volume resuscitation restores preload; early treatment prevents decompensation.",
        ecgPattern: "sinus_tachycardia",
      },
      developing: {
        label: "Decompensated Shock",
        recognitionCues: ["hypotension", "MAP < 70", "rising lactate", "oliguria"],
        optimalInterventions: ["fluid_bolus", "norepinephrine"],
        harmIfMissedTicks: 3,
        harmDescription: "Persistent decompensated shock causes AKI, hepatic ischaemia, and coagulopathy.",
        stabilisationOutcome: "Vasopressors and volume optimisation restore MAP ≥ 65 — organ injury reversible.",
        ecgPattern: "sinus_tachycardia",
      },
      severe: {
        label: "Refractory Shock",
        recognitionCues: ["MAP < 55", "lactate > 6", "GCS decline", "anuric"],
        optimalInterventions: ["norepinephrine", "cpr"],
        harmIfMissedTicks: 2,
        harmDescription: "Refractory shock causes irreversible multi-organ failure within 1–2 hours.",
        stabilisationOutcome: "Multi-drug vasopressors, CRRT for AKI, mechanical circulatory support.",
        ecgPattern: "sinus_tachycardia",
      },
      critical: {
        label: "Shock → Cardiac Arrest",
        recognitionCues: ["pulselessness", "VF or PEA", "EtCO₂ near zero"],
        optimalInterventions: ["cpr", "defibrillation"],
        harmIfMissedTicks: 1,
        harmDescription: "Cardiac arrest without CPR causes irreversible anoxic brain injury within minutes.",
        stabilisationOutcome: "High-quality CPR maintains coronary and cerebral perfusion. Treat reversible cause (Hs and Ts).",
        ecgPattern: "pea",
      },
    },
    escalationTriggers: [
      { description: "MAP < 65 despite initial resuscitation", vitalThreshold: "MAP < 65", escalationTarget: "ICU / vasopressor order", timeLimitSec: 180 },
      { description: "Lactate > 4 mmol/L", vitalThreshold: "Lactate > 4", escalationTarget: "Senior physician / ICU", timeLimitSec: 120 },
      { description: "Cardiac arrest", vitalThreshold: "Pulselessness", escalationTarget: "Code Blue", timeLimitSec: 30 },
    ],
    stabilisationBranches: [
      {
        triggerInterventions: ["fluid_bolus", "blood_transfusion"],
        vitalTargets: [{ vital: "MAP", target: "≥ 65" }, { vital: "HR", target: "< 100" }],
        expectedMonitorChanges: ["BP rising", "HR decreasing", "UO recovering"],
        mechanismExplanation: "Volume replenishment restores cardiac preload — stroke volume and MAP improve.",
      },
    ],
    documentationPrompts: [
      { category: "assessment", prompt: "Document shock type based on haemodynamic profile (distributive/hypovolemic/cardiogenic/obstructive)", required: true },
      { category: "intervention", prompt: "Record all fluid administered: volume, type, time, cumulative total", required: true },
      { category: "reassessment", prompt: "Reassess MAP, HR, UO, mental status every 15 minutes", required: true },
    ],
    ngnCueSets: [
      {
        format: "prioritization",
        stemTemplate: "Rank the following interventions for a patient in hypovolemic shock (SBP 78, HR 138):",
        correctCues: ["Large-bore IV access", "Fluid bolus 30 mL/kg", "Identify and control bleeding source", "Blood transfusion if haemorrhagic"],
        distractors: ["Furosemide for expected renal failure", "Morphine for pain", "Chest X-ray first"],
      },
    ],
    tags: ["shock", "distributive", "hypovolemic", "cardiogenic", "obstructive"],
  },

  // ── RESPIRATORY FAILURE ────────────────────────────────────────────────────
  {
    id: "respiratory_failure",
    name: "Respiratory Failure",
    conditionKeys: ["ards", "heart_failure", "opioid_toxicity", "tension_pneumothorax"],
    description: "Progressive hypoxemic or hypercapnic respiratory failure requiring escalating respiratory support.",
    stages: {
      early: {
        label: "Hypoxaemia — O₂ Therapy Required",
        recognitionCues: ["SpO₂ < 94%", "RR > 20", "accessory muscle use", "dyspnoea"],
        optimalInterventions: ["supplemental_o2"],
        harmIfMissedTicks: 4,
        harmDescription: "Untreated hypoxaemia progresses to respiratory failure requiring intubation.",
        stabilisationOutcome: "Supplemental O₂ maintains SpO₂ > 94%; BiPAP reduces work of breathing.",
        ecgPattern: "sinus_tachycardia",
      },
      developing: {
        label: "Respiratory Failure — BiPAP Threshold",
        recognitionCues: ["SpO₂ < 90% on O₂", "RR > 28", "fatigue", "inability to complete sentences"],
        optimalInterventions: ["bipap", "supplemental_o2"],
        harmIfMissedTicks: 3,
        harmDescription: "Respiratory fatigue leads to apnoea and cardiac arrest without ventilatory support.",
        stabilisationOutcome: "BiPAP reduces work of breathing — splints alveoli open, improves gas exchange.",
        ecgPattern: "sinus_tachycardia",
      },
      severe: {
        label: "Severe Respiratory Failure — Intubation Threshold",
        recognitionCues: ["SpO₂ < 85%", "altered consciousness", "RR > 35 or < 8", "cyanosis"],
        optimalInterventions: ["bipap"],
        harmIfMissedTicks: 2,
        harmDescription: "Delayed intubation in severe respiratory failure causes hypoxic cardiac arrest.",
        stabilisationOutcome: "Mechanical ventilation provides adequate oxygenation and ventilation — bridge to treatment.",
        ecgPattern: "sinus_tachycardia",
      },
      critical: {
        label: "Respiratory Arrest — ARDS Failure",
        recognitionCues: ["SpO₂ < 75%", "agonal breathing", "pulselessness risk"],
        optimalInterventions: ["bipap", "increase_peep"],
        harmIfMissedTicks: 1,
        harmDescription: "Respiratory arrest without airway management causes cardiac arrest from hypoxia.",
        stabilisationOutcome: "Intubation with lung-protective ventilation (4–6 mL/kg IBW, PEEP per ARDSnet table).",
        ecgPattern: "sinus_tachycardia",
      },
    },
    escalationTriggers: [
      { description: "SpO₂ < 90% on 10L O₂", vitalThreshold: "SpO₂ < 90% despite O₂", escalationTarget: "ICU / anaesthesiology", timeLimitSec: 120 },
      { description: "RR > 35", vitalThreshold: "RR > 35", escalationTarget: "Respiratory therapy / intubation team", timeLimitSec: 120 },
    ],
    stabilisationBranches: [
      {
        triggerInterventions: ["supplemental_o2"],
        vitalTargets: [{ vital: "SpO₂", target: "≥ 94%" }],
        expectedMonitorChanges: ["SpO₂ rising after O₂ applied"],
        mechanismExplanation: "Supplemental O₂ increases FiO₂, driving O₂ across alveolar-capillary membrane.",
      },
      {
        triggerInterventions: ["bipap"],
        vitalTargets: [{ vital: "SpO₂", target: "≥ 92%" }, { vital: "RR", target: "< 25" }],
        expectedMonitorChanges: ["SpO₂ improving", "RR decreasing", "HR settling with reduced work of breathing"],
        mechanismExplanation: "PEEP recruits collapsed alveoli; inspiratory support reduces inspiratory effort and O₂ consumption.",
      },
      {
        triggerInterventions: ["increase_peep"],
        vitalTargets: [{ vital: "SpO₂", target: "≥ 88%" }],
        expectedMonitorChanges: ["SpO₂ improves after PEEP increase", "compliance may improve"],
        mechanismExplanation: "Increased PEEP maintains alveolar recruitment throughout the respiratory cycle in ARDS.",
      },
    ],
    documentationPrompts: [
      { category: "assessment", prompt: "Document SpO₂, RR, FiO₂, and work of breathing at each assessment", required: true },
      { category: "intervention", prompt: "Record O₂ delivery: device, flow rate, FiO₂ equivalent", required: true },
      { category: "reassessment", prompt: "SpO₂ response 5 minutes after each O₂ change — document", required: true },
    ],
    ngnCueSets: [
      {
        format: "sata",
        stemTemplate: "A patient with ARDS has SpO₂ 87% on FiO₂ 0.8. Which actions are appropriate?",
        correctCues: ["Increase PEEP per ARDSnet table", "Check TV: reduce if > 6 mL/kg IBW", "Consider prone positioning", "Notify intensivist"],
        distractors: ["Decrease PEEP to reduce barotrauma risk", "Increase TV to improve minute ventilation", "Administer furosemide for wet lungs"],
      },
    ],
    tags: ["ards", "respiratory-failure", "bipap", "vent", "hypoxemia"],
  },

  // ── HYPERKALEMIA ───────────────────────────────────────────────────────────
  {
    id: "hyperkalemia",
    name: "Hyperkalemia",
    conditionKeys: ["hyperkalemia", "dka"],
    description: "Progressive hyperkalemia with sequential ECG changes leading to cardiac arrest if untreated.",
    stages: {
      early: {
        label: "K⁺ 5.5–6.4 — Peaked T-waves",
        recognitionCues: ["peaked narrow T-waves on ECG", "K⁺ > 5.5", "muscle weakness", "bradycardia tendency"],
        optimalInterventions: ["calcium_gluconate"],
        harmIfMissedTicks: 4,
        harmDescription: "Untreated moderate hyperkalemia progresses to QRS widening and life-threatening arrhythmia.",
        stabilisationOutcome: "Calcium gluconate stabilises cardiac membrane within 5 minutes; insulin/D50 drives K intracellularly.",
        ecgPattern: "hyperkalemia_pattern with peakedT",
      },
      developing: {
        label: "K⁺ 6.5–7.2 — QRS Widening",
        recognitionCues: ["QRS width > 120 ms", "prolonged PR", "K⁺ 6.5–7.2"],
        optimalInterventions: ["calcium_gluconate", "insulin_glucose"],
        harmIfMissedTicks: 3,
        harmDescription: "QRS widening progressing to sine-wave pattern precedes VF in minutes.",
        stabilisationOutcome: "Calcium stabilises membrane; insulin/D50 reduces K⁺ by 0.5–1.5 mEq/L within 30 minutes.",
        ecgPattern: "hyperkalemia_pattern with widenedQrs",
      },
      severe: {
        label: "K⁺ 7.2–8.0 — Sine-Wave / Bradycardia",
        recognitionCues: ["sine-wave QRS", "bradycardia HR < 50", "wide-complex regular rhythm"],
        optimalInterventions: ["calcium_gluconate", "insulin_glucose"],
        harmIfMissedTicks: 2,
        harmDescription: "Sine-wave pattern immediately precedes VF — imminent cardiac arrest risk.",
        stabilisationOutcome: "Emergent dialysis is definitive; temporise with calcium, insulin, bicarbonate.",
        ecgPattern: "sinus_bradycardia with extreme widenedQrs",
      },
      critical: {
        label: "K⁺ > 8.0 — PEA / VF Arrest",
        recognitionCues: ["PEA on ECG", "VF on ECG", "pulselessness", "K⁺ > 8.0"],
        optimalInterventions: ["cpr", "defibrillation", "calcium_gluconate"],
        harmIfMissedTicks: 1,
        harmDescription: "VF from hyperkalemia — standard ACLS with empiric calcium supplementation.",
        stabilisationOutcome: "ACLS + empiric calcium gluconate 2 g IV + dialysis within 30 minutes of ROSC.",
        ecgPattern: "pea then ventricular_fibrillation",
      },
    },
    escalationTriggers: [
      { description: "K⁺ > 6.5 with ECG changes", vitalThreshold: "K⁺ > 6.5 + ECG", escalationTarget: "Nephrology + ICU", timeLimitSec: 120 },
      { description: "QRS > 120 ms on ECG", vitalThreshold: "QRS > 0.12s", escalationTarget: "Urgent nephrology / CRRT", timeLimitSec: 60 },
    ],
    stabilisationBranches: [
      {
        triggerInterventions: ["calcium_gluconate"],
        vitalTargets: [{ vital: "QRS width", target: "Narrowing trend" }, { vital: "HR", target: "Stable > 50" }],
        expectedMonitorChanges: ["QRS narrowing within 5 minutes", "PR interval shortening"],
        mechanismExplanation: "Calcium raises the cardiac action potential threshold, opposing the depolarising effect of hyperkalemia.",
      },
      {
        triggerInterventions: ["insulin_glucose"],
        vitalTargets: [{ vital: "Potassium", target: "Falling 0.5–1.5 mEq/L" }],
        expectedMonitorChanges: ["T-waves becoming less peaked", "QRS normalising"],
        mechanismExplanation: "Insulin stimulates Na⁺-K⁺-ATPase, driving potassium intracellularly. Glucose prevents hypoglycaemia.",
      },
    ],
    documentationPrompts: [
      { category: "assessment", prompt: "Document K⁺ result, ECG pattern, and time of recognition", required: true },
      { category: "intervention", prompt: "Record calcium gluconate: dose, time, ECG response", required: true },
      { category: "intervention", prompt: "Record insulin and D50: doses, time, glucose monitoring plan", required: true },
      { category: "escalation", prompt: "Document nephrology consultation and dialysis plan", required: true },
    ],
    ngnCueSets: [
      {
        format: "cloze",
        stemTemplate: "For a patient with K⁺ 7.2 and QRS widening, the FIRST drug given is _____ to _____ the cardiac membrane.",
        correctCues: ["calcium gluconate", "stabilise"],
        distractors: ["insulin", "drive potassium intracellularly"],
      },
    ],
    tags: ["hyperkalemia", "ecg", "electrolytes", "renal", "cardiac"],
  },

  // ── STROKE ─────────────────────────────────────────────────────────────────
  {
    id: "stroke",
    name: "Acute Ischaemic Stroke",
    conditionKeys: ["stroke"],
    description: "Acute ischaemic stroke requiring time-critical recognition and potential thrombolysis.",
    stages: {
      early: {
        label: "FAST Positive — Window Open",
        recognitionCues: ["facial droop", "arm drift", "speech difficulty", "sudden onset"],
        optimalInterventions: ["supplemental_o2"],
        harmIfMissedTicks: 3,
        harmDescription: "Every 1 minute of ischaemia, 1.9 million neurones die. Time is brain.",
        stabilisationOutcome: "Code Stroke activation within 15 minutes of ED arrival achieves door-to-needle < 60 minutes.",
        ecgPattern: "normal_sinus_rhythm",
      },
      developing: {
        label: "Progressive Deficit — BP Management",
        recognitionCues: ["worsening deficit", "BP > 185/110 (if tPA candidate)", "falling GCS"],
        optimalInterventions: ["supplemental_o2"],
        harmIfMissedTicks: 4,
        harmDescription: "Uncontrolled hypertension in tPA candidates increases haemorrhagic transformation risk.",
        stabilisationOutcome: "BP control to < 185/110 enables safe tPA administration.",
        ecgPattern: "normal_sinus_rhythm or atrial_fibrillation",
      },
      severe: {
        label: "Large Territory Infarct — Herniation Risk",
        recognitionCues: ["GCS < 10", "blown pupil", "Cheyne-Stokes breathing", "Cushing's triad beginning"],
        optimalInterventions: ["mannitol"],
        harmIfMissedTicks: 3,
        harmDescription: "Malignant MCA infarct with herniation — 80% mortality without decompressive hemicraniectomy.",
        stabilisationOutcome: "Decompressive hemicraniectomy within 48 hours reduces mortality in malignant MCA infarct.",
        ecgPattern: "sinus_bradycardia",
      },
      critical: {
        label: "Herniation — Cardiorespiratory Collapse",
        recognitionCues: ["bilateral fixed dilated pupils", "decerebrate posturing", "apnoea"],
        optimalInterventions: ["mannitol", "bipap"],
        harmIfMissedTicks: 1,
        harmDescription: "Brainstem herniation — imminent cardiorespiratory arrest.",
        stabilisationOutcome: "Intubation and osmotherapy may temporise while surgical team is prepared.",
        ecgPattern: "third_degree_av_block",
      },
    },
    escalationTriggers: [
      { description: "FAST positive", vitalThreshold: "Any FAST finding", escalationTarget: "Stroke team / Code Stroke", timeLimitSec: 60 },
      { description: "GCS drop ≥ 2", vitalThreshold: "GCS ↓ ≥ 2", escalationTarget: "Neurosurgery", timeLimitSec: 120 },
    ],
    stabilisationBranches: [
      {
        triggerInterventions: ["supplemental_o2"],
        vitalTargets: [{ vital: "SpO₂", target: "≥ 94%" }],
        expectedMonitorChanges: ["SpO₂ maintained"],
        mechanismExplanation: "Hypoxia worsens ischaemic penumbra — maintain SpO₂ ≥ 94% to protect viable brain tissue.",
      },
      {
        triggerInterventions: ["mannitol"],
        vitalTargets: [{ vital: "ICP", target: "< 20 mmHg" }, { vital: "GCS", target: "Improving" }],
        expectedMonitorChanges: ["ICP decreasing", "GCS may improve"],
        mechanismExplanation: "Osmotic agents reduce cerebral oedema by creating an osmotic gradient across the blood-brain barrier.",
      },
    ],
    documentationPrompts: [
      { category: "assessment", prompt: "Document FAST findings with exact time of recognition", required: true },
      { category: "assessment", prompt: "Record last-known-well time precisely", required: true },
      { category: "escalation", prompt: "Document Code Stroke activation time", required: true },
      { category: "intervention", prompt: "Record BP every 15 minutes pre-tPA", required: true },
    ],
    ngnCueSets: [
      {
        format: "bowtie",
        stemTemplate: "A 68M has sudden right-sided weakness and slurred speech. Time of symptom onset is 45 minutes ago. What is the PRIORITY action?",
        correctCues: ["Activate Code Stroke", "Stat brain CT", "Establish IV access", "12-lead ECG to detect AF"],
        distractors: ["IM morphine for headache", "NPO and NG tube immediately", "Wait 2 hours to confirm deficit is persistent"],
      },
    ],
    tags: ["stroke", "neuro", "tpa", "fast", "icp"],
  },

  // ── GI BLEED ───────────────────────────────────────────────────────────────
  {
    id: "gi_bleed",
    name: "GI Haemorrhage",
    conditionKeys: ["gi_bleed"],
    description: "Upper or lower GI haemorrhage with haemorrhagic shock requiring resuscitation.",
    stages: {
      early: {
        label: "Compensated Haemorrhage (Class I/II)",
        recognitionCues: ["tachycardia", "orthostatic hypotension", "haematemesis or melaena", "pallor"],
        optimalInterventions: ["fluid_bolus"],
        harmIfMissedTicks: 3,
        harmDescription: "Unresuscitated haemorrhage progresses to haemorrhagic shock with rapid decompensation.",
        stabilisationOutcome: "IV fluid resuscitation and blood products restore intravascular volume.",
        ecgPattern: "sinus_tachycardia",
      },
      developing: {
        label: "Moderate Haemorrhage (Class III)",
        recognitionCues: ["SBP < 100", "HR > 120", "confusion", "decreased UO"],
        optimalInterventions: ["fluid_bolus", "blood_transfusion"],
        harmIfMissedTicks: 3,
        harmDescription: "30–40% blood loss decompensates — catecholamine compensation fails.",
        stabilisationOutcome: "Massive transfusion protocol (1:1:1 PRBC:FFP:platelets) replaces lost blood components.",
        ecgPattern: "sinus_tachycardia",
      },
      severe: {
        label: "Severe Haemorrhage (Class III/IV) — Myocardial Ischaemia",
        recognitionCues: ["ST depression from demand ischaemia", "SBP < 80", "GCS decline"],
        optimalInterventions: ["blood_transfusion", "fluid_bolus"],
        harmIfMissedTicks: 2,
        harmDescription: "Severe anaemia causes demand ischaemia — NSTEMI-pattern ECG changes.",
        stabilisationOutcome: "Blood transfusion is the only definitive resuscitative measure — saline alone dilutes clotting factors.",
        ecgPattern: "sinus_tachycardia with stDepression",
      },
      critical: {
        label: "Haemorrhagic Shock — Cardiac Arrest",
        recognitionCues: ["pulselessness", "VT/VF from ischaemia", "empty heart on echo"],
        optimalInterventions: ["cpr", "blood_transfusion"],
        harmIfMissedTicks: 1,
        harmDescription: "Exsanguination — haemorrhagic cardiac arrest without ongoing transfusion is non-survivable.",
        stabilisationOutcome: "Resuscitative endovascular balloon occlusion of the aorta (REBOA) in selected trauma centres.",
        ecgPattern: "ventricular_tachycardia",
      },
    },
    escalationTriggers: [
      { description: "SBP < 90 after initial bolus", vitalThreshold: "SBP < 90", escalationTarget: "GI / surgery / blood bank MTP", timeLimitSec: 120 },
      { description: "Estimated blood loss > 1.5 L", vitalThreshold: "HR > 120 + SBP < 80", escalationTarget: "Massive transfusion protocol", timeLimitSec: 60 },
    ],
    stabilisationBranches: [
      {
        triggerInterventions: ["fluid_bolus", "blood_transfusion"],
        vitalTargets: [{ vital: "MAP", target: "≥ 65" }, { vital: "HR", target: "< 100" }],
        expectedMonitorChanges: ["HR decreasing after blood", "BP improving", "UO recovering"],
        mechanismExplanation: "Blood products restore O₂-carrying capacity and clotting factors simultaneously.",
      },
    ],
    documentationPrompts: [
      { category: "assessment", prompt: "Document estimated blood loss: clinical findings and colour of output", required: true },
      { category: "intervention", prompt: "Record every blood product: type, units, time, response", required: true },
      { category: "reassessment", prompt: "Vital signs every 15 minutes during active haemorrhage", required: true },
    ],
    ngnCueSets: [
      {
        format: "prioritization",
        stemTemplate: "A patient with haematemesis has HR 128, BP 82/50. Rank these interventions:",
        correctCues: ["Large-bore IV access × 2", "Type and cross-match", "Fluid bolus 500 mL NS", "Activate massive transfusion protocol if no response"],
        distractors: ["Gastroscopy before IV access", "Morphine for abdominal pain first"],
      },
    ],
    tags: ["gi-bleed", "hemorrhage", "transfusion", "shock"],
  },

  // ── PE ─────────────────────────────────────────────────────────────────────
  {
    id: "pe",
    name: "Pulmonary Embolism",
    conditionKeys: ["pulmonary_embolism"],
    description: "Acute pulmonary embolism spectrum from low-risk subsegmental to massive haemodynamically unstable PE.",
    stages: {
      early: {
        label: "Low-Risk PE — Tachycardia + Hypoxia",
        recognitionCues: ["sudden dyspnoea", "pleuritic chest pain", "tachycardia", "SpO₂ drop", "DVT signs"],
        optimalInterventions: ["supplemental_o2"],
        harmIfMissedTicks: 4,
        harmDescription: "Anticoagulation delay allows thrombus extension — RV strain worsens.",
        stabilisationOutcome: "CTPA confirmation and anticoagulation within 12 hours prevents thrombus propagation.",
        ecgPattern: "sinus_tachycardia",
      },
      developing: {
        label: "Submassive PE — RV Strain",
        recognitionCues: ["RBBB on ECG", "rising CVP", "RV dilation on echo", "EtCO₂ dropping"],
        optimalInterventions: ["supplemental_o2", "fluid_bolus"],
        harmIfMissedTicks: 3,
        harmDescription: "RV pressure overload causes interventricular septal shift — LV output falls.",
        stabilisationOutcome: "Anticoagulation + fluid optimisation supports RV preload without overfilling.",
        ecgPattern: "right_bundle_branch_block",
      },
      severe: {
        label: "Massive PE — Obstructive Shock",
        recognitionCues: ["SBP < 90", "CVP elevated", "CO reduced", "EtCO₂ < 20"],
        optimalInterventions: ["fluid_bolus", "norepinephrine"],
        harmIfMissedTicks: 2,
        harmDescription: "Massive PE obstructing > 50% of pulmonary vasculature — right heart failure and systemic hypoperfusion.",
        stabilisationOutcome: "Systemic thrombolysis (tPA 100 mg over 2 hours) in haemodynamically unstable PE not requiring surgery.",
        ecgPattern: "right_bundle_branch_block with stDepression",
      },
      critical: {
        label: "Massive PE — PEA Arrest",
        recognitionCues: ["PEA arrest", "dilated RV on echo during CPR"],
        optimalInterventions: ["cpr", "fluid_bolus"],
        harmIfMissedTicks: 1,
        harmDescription: "Massive PE PEA arrest — non-survivable without thrombolysis during CPR.",
        stabilisationOutcome: "Empiric thrombolysis during CPR for suspected massive PE — ROSC rate 40–60%.",
        ecgPattern: "pea",
      },
    },
    escalationTriggers: [
      { description: "Suspected PE with haemodynamic instability", vitalThreshold: "SBP < 90 + SpO₂ < 90%", escalationTarget: "ICU + interventional radiology / cardiac surgery", timeLimitSec: 90 },
    ],
    stabilisationBranches: [
      {
        triggerInterventions: ["supplemental_o2"],
        vitalTargets: [{ vital: "SpO₂", target: "≥ 92%" }],
        expectedMonitorChanges: ["SpO₂ partially improving"],
        mechanismExplanation: "Supplemental O₂ treats hypoxia but does not address the obstruction — definitive treatment is anticoagulation.",
      },
    ],
    documentationPrompts: [
      { category: "assessment", prompt: "Document Wells criteria score with components", required: true },
      { category: "assessment", prompt: "Record SpO₂, RR, BP at time of PE suspicion", required: true },
      { category: "intervention", prompt: "Document anticoagulation initiated: drug, dose, time", required: false },
    ],
    ngnCueSets: [
      {
        format: "sata",
        stemTemplate: "A post-op patient has sudden dyspnoea and right-sided chest pain. Which findings support PE?",
        correctCues: ["Tachycardia", "SpO₂ drop to 88%", "Right calf swelling", "EtCO₂ drop to 22 mmHg"],
        distractors: ["Bradycardia", "Left-sided chest pain with radiation to jaw", "High EtCO₂"],
      },
    ],
    tags: ["pe", "pulmonary-embolism", "dvt", "anticoagulation", "rv-strain"],
  },

  // ── DKA ────────────────────────────────────────────────────────────────────
  {
    id: "dka",
    name: "Diabetic Ketoacidosis",
    conditionKeys: ["dka"],
    description: "DKA with progressive dehydration, metabolic acidosis, and eventual cerebral oedema risk.",
    stages: {
      early: {
        label: "DKA — Compensated with Kussmaul",
        recognitionCues: ["glucose > 300", "Kussmaul breathing", "fruity odour", "polyuria", "low EtCO₂"],
        optimalInterventions: ["fluid_bolus"],
        harmIfMissedTicks: 4,
        harmDescription: "Untreated DKA worsens metabolic acidosis and dehydration — cerebral oedema risk in rapid correction.",
        stabilisationOutcome: "Controlled fluid resuscitation (NS 500 mL/hr initial) and insulin infusion corrects acidosis safely.",
        ecgPattern: "sinus_tachycardia with peakedT",
      },
      developing: {
        label: "DKA — Dehydration and Pseudohyponatraemia",
        recognitionCues: ["tachycardia", "dry mucous membranes", "K⁺ appearing high (pseudohyperkalemia)", "GCS 13"],
        optimalInterventions: ["fluid_bolus", "insulin_glucose"],
        harmIfMissedTicks: 4,
        harmDescription: "Insulin without potassium replacement causes fatal hypokalaemia — K⁺ drops when acidosis corrects.",
        stabilisationOutcome: "Insulin + K⁺ replacement + fluid corrects DKA without electrolyte crisis.",
        ecgPattern: "sinus_tachycardia",
      },
      severe: {
        label: "DKA — Altered Mental Status",
        recognitionCues: ["GCS < 12", "hyperosmolarity", "K⁺ changing rapidly", "pH < 7.1"],
        optimalInterventions: ["fluid_bolus", "insulin_glucose"],
        harmIfMissedTicks: 3,
        harmDescription: "Cerebral oedema from osmotic shifts — more common in paediatric DKA but occurs in adults.",
        stabilisationOutcome: "Slower fluid replacement rate and tight glucose control (10–14 mmol/L target) prevent cerebral oedema.",
        ecgPattern: "sinus_tachycardia with widenedQrs",
      },
      critical: {
        label: "DKA — Cerebral Oedema / Cardiac Arrest",
        recognitionCues: ["sudden GCS drop", "bradycardia + hypertension (cerebral oedema)", "VF from severe K⁺ abnormality"],
        optimalInterventions: ["mannitol", "cpr"],
        harmIfMissedTicks: 1,
        harmDescription: "Cerebral oedema in DKA — most common cause of DKA mortality.",
        stabilisationOutcome: "Mannitol 0.5–1 g/kg IV for cerebral oedema in DKA — hypertonic saline as alternative.",
        ecgPattern: "hyperkalemia_pattern",
      },
    },
    escalationTriggers: [
      { description: "GCS drop in DKA", vitalThreshold: "GCS ↓ > 2", escalationTarget: "ICU / endocrinology", timeLimitSec: 120 },
      { description: "pH < 7.0", vitalThreshold: "Severe acidosis", escalationTarget: "ICU for bicarbonate consideration", timeLimitSec: 180 },
    ],
    stabilisationBranches: [
      {
        triggerInterventions: ["fluid_bolus"],
        vitalTargets: [{ vital: "HR", target: "< 100" }, { vital: "BP", target: "MAP ≥ 65" }],
        expectedMonitorChanges: ["HR decreasing", "BP improving with volume"],
        mechanismExplanation: "Isotonic crystalloid replaces lost free water from osmotic diuresis without rapid osmolar shift.",
      },
      {
        triggerInterventions: ["insulin_glucose"],
        vitalTargets: [{ vital: "glucose", target: "Falling 3–5 mmol/L per hour" }, { vital: "ECG", target: "Peaked T improving" }],
        expectedMonitorChanges: ["Glucose trending down", "K⁺ falling on repeat labs", "T-waves less peaked"],
        mechanismExplanation: "Insulin suppresses ketogenesis and restores glucose utilisation; drives K⁺ intracellularly.",
      },
    ],
    documentationPrompts: [
      { category: "assessment", prompt: "Document glucose, ketones, pH, K⁺ with time", required: true },
      { category: "intervention", prompt: "Record insulin infusion rate and hourly glucose", required: true },
      { category: "intervention", prompt: "Document K⁺ replacement: dose, frequency, labs", required: true },
    ],
    ngnCueSets: [
      {
        format: "cloze",
        stemTemplate: "In DKA, insulin must not be given until serum potassium is confirmed ≥ _____ mEq/L, because insulin drives K⁺ _____ the cell.",
        correctCues: ["3.5", "into"],
        distractors: ["5.0", "out of"],
      },
    ],
    tags: ["dka", "diabetes", "acidosis", "potassium", "insulin"],
  },

  // ── BRADYCARDIA ────────────────────────────────────────────────────────────
  {
    id: "bradycardia",
    name: "Bradycardia",
    conditionKeys: ["increased_icp"],
    description: "Symptomatic bradycardia — from sinus bradycardia to complete heart block requiring pacing.",
    stages: {
      early: {
        label: "Asymptomatic Bradycardia — HR 45–59",
        recognitionCues: ["HR < 60", "monitor alarm", "no symptoms"],
        optimalInterventions: [],
        harmIfMissedTicks: 6,
        harmDescription: "Asymptomatic bradycardia rarely requires treatment — watch for symptom development.",
        stabilisationOutcome: "Identify reversible cause: beta-blockers, hypothyroidism, high vagal tone, inferior MI.",
        ecgPattern: "sinus_bradycardia",
      },
      developing: {
        label: "Symptomatic Bradycardia — HR 40–50",
        recognitionCues: ["dizziness", "presyncope", "diaphoresis", "hypotension"],
        optimalInterventions: [],
        harmIfMissedTicks: 4,
        harmDescription: "Symptomatic bradycardia with haemodynamic compromise — pacing threshold approaching.",
        stabilisationOutcome: "Atropine 0.5–1 mg IV for sinus bradycardia or Mobitz I — NOT effective for Mobitz II.",
        ecgPattern: "sinus_bradycardia",
      },
      severe: {
        label: "Severe Bradycardia — HR < 40",
        recognitionCues: ["HR < 40", "near-syncope", "hypotension", "Mobitz II or CHB pattern"],
        optimalInterventions: [],
        harmIfMissedTicks: 2,
        harmDescription: "Complete heart block or severely symptomatic bradycardia — transcutaneous pacing required.",
        stabilisationOutcome: "Transcutaneous pacing bridges to transvenous pacing or permanent pacemaker.",
        ecgPattern: "third_degree_av_block",
      },
      critical: {
        label: "Pulseless Bradycardia / Asystole",
        recognitionCues: ["asystole on monitor", "pulselessness", "HR < 20"],
        optimalInterventions: ["cpr"],
        harmIfMissedTicks: 1,
        harmDescription: "Asystole — ACLS with epinephrine and transcutaneous pacing.",
        stabilisationOutcome: "CPR + epinephrine + transcutaneous pacing. Identify reversible cause.",
        ecgPattern: "asystole",
      },
    },
    escalationTriggers: [
      { description: "Symptomatic bradycardia HR < 50", vitalThreshold: "HR < 50 + symptoms", escalationTarget: "Physician / cardiologist", timeLimitSec: 120 },
      { description: "Mobitz II or CHB detected", vitalThreshold: "Second-degree Mobitz II / CHB", escalationTarget: "Cardiology / pacing team", timeLimitSec: 60 },
    ],
    stabilisationBranches: [
      {
        triggerInterventions: [],
        vitalTargets: [{ vital: "HR", target: "> 60 bpm" }],
        expectedMonitorChanges: ["HR increasing", "symptoms resolving"],
        mechanismExplanation: "Atropine blocks vagal tone for sinus bradycardia. Does NOT work for infranodal (Mobitz II, CHB) — pacing required.",
      },
    ],
    documentationPrompts: [
      { category: "assessment", prompt: "Document HR, rhythm strip, symptoms, BP at time of recognition", required: true },
      { category: "intervention", prompt: "Record atropine dose if given, time, ECG response", required: false },
      { category: "escalation", prompt: "Document pacing team / cardiology notification time", required: true },
    ],
    ngnCueSets: [
      {
        format: "sata",
        stemTemplate: "A patient has Mobitz II second-degree AV block with HR 38 and symptoms. Which interventions are appropriate?",
        correctCues: ["Transcutaneous pacing pads immediately", "Cardiology consult for permanent pacemaker", "Stop any AV-blocking medications"],
        distractors: ["Atropine 1 mg IV (first-line)", "Adenosine to convert the rhythm", "Digoxin for rate control"],
      },
    ],
    tags: ["bradycardia", "av-block", "pacing", "conduction", "vagal"],
  },

  // ── TACHYARRHYTHMIA ────────────────────────────────────────────────────────
  {
    id: "tachyarrhythmia",
    name: "Tachyarrhythmia",
    conditionKeys: ["afib_rvr", "svt", "vt_to_vf"],
    description: "Rapid cardiac rhythms from stable AFib to haemodynamically unstable VT/VF.",
    stages: {
      early: {
        label: "Tachyarrhythmia — HR > 100",
        recognitionCues: ["rapid rate on monitor", "palpitations", "HR > 100"],
        optimalInterventions: [],
        harmIfMissedTicks: 6,
        harmDescription: "Sustained tachycardia causes tachycardia-induced cardiomyopathy over time.",
        stabilisationOutcome: "Rate/rhythm characterisation guides appropriate therapy selection.",
        ecgPattern: "atrial_fibrillation or sinus_tachycardia",
      },
      developing: {
        label: "Symptomatic Tachycardia — HR > 130",
        recognitionCues: ["palpitations", "dyspnoea", "mild hypotension", "HR > 130"],
        optimalInterventions: ["amiodarone", "adenosine"],
        harmIfMissedTicks: 4,
        harmDescription: "Haemodynamic compromise from reduced diastolic filling time.",
        stabilisationOutcome: "Chemical rate/rhythm control: amiodarone for AFib/VT, adenosine for SVT.",
        ecgPattern: "atrial_fibrillation with high rate",
      },
      severe: {
        label: "Unstable Tachycardia — Haemodynamic Compromise",
        recognitionCues: ["SBP < 90", "altered mental status", "HR > 150", "chest pain"],
        optimalInterventions: ["synchronized_cardioversion"],
        harmIfMissedTicks: 2,
        harmDescription: "Haemodynamically unstable tachycardia — electrical cardioversion required.",
        stabilisationOutcome: "Synchronised cardioversion 100–200J converts most supraventricular and ventricular rhythms.",
        ecgPattern: "svt or ventricular_tachycardia",
      },
      critical: {
        label: "VF — Cardiac Arrest",
        recognitionCues: ["VF on monitor", "pulselessness", "loss of consciousness"],
        optimalInterventions: ["defibrillation", "cpr"],
        harmIfMissedTicks: 1,
        harmDescription: "VF without defibrillation → irreversible brain injury within 4–6 minutes.",
        stabilisationOutcome: "Unsynchronised defibrillation 200J → CPR → rhythm check every 2 minutes.",
        ecgPattern: "ventricular_fibrillation",
      },
    },
    escalationTriggers: [
      { description: "VT or VF on monitor", vitalThreshold: "Wide-complex tachycardia", escalationTarget: "ACLS / code blue", timeLimitSec: 30 },
      { description: "Haemodynamic instability", vitalThreshold: "SBP < 90 + tachycardia", escalationTarget: "Cardiologist / code team", timeLimitSec: 60 },
    ],
    stabilisationBranches: [
      {
        triggerInterventions: ["adenosine"],
        vitalTargets: [{ vital: "HR", target: "Normal sinus rhythm" }],
        expectedMonitorChanges: ["Brief asystole → conversion to NSR", "HR dropping to < 100"],
        mechanismExplanation: "Adenosine transiently blocks AV node, interrupting re-entry circuits in SVT.",
      },
      {
        triggerInterventions: ["synchronized_cardioversion"],
        vitalTargets: [{ vital: "rhythm", target: "NSR or controlled rate" }, { vital: "BP", target: "Improving" }],
        expectedMonitorChanges: ["Rhythm converts after shock", "HR normalises", "BP improves"],
        mechanismExplanation: "Synchronised shock depolarises all myocardial cells simultaneously, allowing the SA node to resume control.",
      },
    ],
    documentationPrompts: [
      { category: "assessment", prompt: "Document rhythm interpretation: regular vs irregular, narrow vs wide", required: true },
      { category: "intervention", prompt: "Record cardioversion: energy, synchronisation, rhythm before/after", required: true },
      { category: "reassessment", prompt: "Document rhythm and BP every 5 minutes post-cardioversion", required: true },
    ],
    ngnCueSets: [
      {
        format: "bowtie",
        stemTemplate: "A patient has SVT at 198 bpm with mild dizziness. Which intervention is FIRST-LINE?",
        correctCues: ["Vagal manoeuvre (Valsalva)", "Adenosine 6 mg rapid IV push", "12-lead ECG"],
        distractors: ["Synchronised cardioversion immediately", "Amiodarone 150 mg IV", "Beta-blocker oral"],
      },
    ],
    tags: ["afib", "svt", "vt", "vf", "tachycardia", "cardioversion"],
  },

  // ── CARDIAC ARREST ─────────────────────────────────────────────────────────
  {
    id: "cardiac_arrest",
    name: "Cardiac Arrest (ACLS)",
    conditionKeys: ["vt_to_vf", "cardiac_tamponade", "tension_pneumothorax"],
    description: "Cardiac arrest — shockable (VF/pVT) and non-shockable (PEA/asystole) algorithms.",
    stages: {
      early: {
        label: "Pre-Arrest — Deteriorating Haemodynamics",
        recognitionCues: ["HR > 150 with hypotension", "GCS declining", "SpO₂ < 80%"],
        optimalInterventions: ["supplemental_o2"],
        harmIfMissedTicks: 2,
        harmDescription: "Pre-arrest recognition and treatment may prevent cardiac arrest.",
        stabilisationOutcome: "Aggressive pre-arrest management (airway, breathing, circulation) may avert arrest.",
        ecgPattern: "ventricular_tachycardia",
      },
      developing: {
        label: "Pulseless VT",
        recognitionCues: ["VT on monitor", "no palpable pulse", "no breathing"],
        optimalInterventions: ["cpr", "defibrillation"],
        harmIfMissedTicks: 1,
        harmDescription: "Pulseless VT — start CPR immediately, defibrillate within 2 minutes.",
        stabilisationOutcome: "Defibrillation of pulseless VT achieves ROSC in up to 60% of cases.",
        ecgPattern: "ventricular_tachycardia",
      },
      severe: {
        label: "VF",
        recognitionCues: ["chaotic waveform", "no organised QRS", "pulselessness"],
        optimalInterventions: ["defibrillation", "cpr"],
        harmIfMissedTicks: 1,
        harmDescription: "VF — time to defibrillation is the single greatest determinant of survival.",
        stabilisationOutcome: "Defibrillation 200J → CPR 2 min → rhythm check. ROSC rate 40% with each defibrillation.",
        ecgPattern: "ventricular_fibrillation",
      },
      critical: {
        label: "Prolonged Arrest — Asystole",
        recognitionCues: ["flat line", "no cardiac activity", "confirmed asystole in 2 leads"],
        optimalInterventions: ["cpr"],
        harmIfMissedTicks: 1,
        harmDescription: "Asystole — non-shockable rhythm. CPR + epinephrine + Hs and Ts workup.",
        stabilisationOutcome: "Reversible causes: Hypoxia, Hypovolaemia, H-ions (acidosis), Hypo/hyperkalemia, Hypothermia, Tension PTX, Tamponade, Toxins, Thrombosis (PE/MI).",
        ecgPattern: "asystole",
      },
    },
    escalationTriggers: [
      { description: "Cardiac arrest confirmed", vitalThreshold: "Pulselessness", escalationTarget: "Code Blue team", timeLimitSec: 30 },
    ],
    stabilisationBranches: [
      {
        triggerInterventions: ["defibrillation", "cpr"],
        vitalTargets: [{ vital: "EtCO₂", target: "> 40 mmHg (ROSC)" }, { vital: "rhythm", target: "Organised" }],
        expectedMonitorChanges: ["EtCO₂ rising — probable ROSC", "Rhythm organising", "SpO₂ recoverable"],
        mechanismExplanation: "Defibrillation terminates chaotic activity; CPR maintains coronary perfusion pressure. ROSC restores spontaneous circulation.",
      },
    ],
    documentationPrompts: [
      { category: "assessment", prompt: "Document exact time of arrest recognition and code blue call", required: true },
      { category: "intervention", prompt: "Record every defibrillation: time, joules, rhythm before and after", required: true },
      { category: "intervention", prompt: "Document all medications: drug, dose, time", required: true },
      { category: "reassessment", prompt: "Document ROSC time if achieved and post-ROSC care initiated", required: true },
    ],
    ngnCueSets: [
      {
        format: "sata",
        stemTemplate: "During a code blue, VF is confirmed on the monitor. Which are the PRIORITY actions?",
        correctCues: ["Begin high-quality CPR immediately", "Charge defibrillator to 200J", "Defibrillate and resume CPR immediately", "Prepare epinephrine 1 mg IV"],
        distractors: ["Administer atropine 1 mg", "Synchronise the shock", "Wait for a pulse before defibrillating"],
      },
    ],
    tags: ["cardiac-arrest", "cpr", "defibrillation", "acls", "vf", "asystole", "pea"],
  },

  // ── ANAPHYLAXIS ────────────────────────────────────────────────────────────
  {
    id: "anaphylaxis",
    name: "Anaphylaxis",
    conditionKeys: ["anaphylaxis"],
    description: "Severe systemic hypersensitivity reaction requiring immediate epinephrine.",
    stages: {
      early: {
        label: "Mild Anaphylaxis — Urticaria + Angioedema",
        recognitionCues: ["urticaria", "pruritus", "flushing", "mild throat tightness", "recent allergen exposure"],
        optimalInterventions: ["epinephrine_im"],
        harmIfMissedTicks: 2,
        harmDescription: "Mild reactions can progress rapidly to anaphylactic shock — IM epinephrine is NEVER wrong if anaphylaxis is suspected.",
        stabilisationOutcome: "IM epinephrine prevents progression; antihistamines and steroids as adjuncts.",
        ecgPattern: "sinus_tachycardia",
      },
      developing: {
        label: "Moderate Anaphylaxis — Bronchospasm + Hypotension",
        recognitionCues: ["bronchospasm", "BP dropping", "HR > 130", "stridor beginning"],
        optimalInterventions: ["epinephrine_im", "supplemental_o2", "fluid_bolus"],
        harmIfMissedTicks: 2,
        harmDescription: "Bronchospasm without epinephrine leads to respiratory failure; distributive shock worsens without fluids.",
        stabilisationOutcome: "IM epi + O₂ + IV access + fluids. Repeat epi every 5 minutes if no response.",
        ecgPattern: "sinus_tachycardia",
      },
      severe: {
        label: "Severe Anaphylaxis — Anaphylactic Shock",
        recognitionCues: ["SBP < 70", "stridor + loss of speech", "impending airway loss", "altered consciousness"],
        optimalInterventions: ["epinephrine_im", "fluid_bolus"],
        harmIfMissedTicks: 1,
        harmDescription: "Anaphylactic shock — minutes to respiratory/cardiac arrest without treatment.",
        stabilisationOutcome: "IV epinephrine infusion for refractory anaphylaxis. Early intubation if airway threatened.",
        ecgPattern: "sinus_tachycardia",
      },
      critical: {
        label: "Anaphylactic Arrest — PEA",
        recognitionCues: ["pulselessness", "PEA rhythm", "likely distributive mechanism"],
        optimalInterventions: ["cpr"],
        harmIfMissedTicks: 1,
        harmDescription: "Anaphylactic cardiac arrest — PEA from profound vasodilation.",
        stabilisationOutcome: "ACLS + IV epinephrine bolus 1 mg (10× IM dose). Volume loading for distributive mechanism.",
        ecgPattern: "pea",
      },
    },
    escalationTriggers: [
      { description: "Throat tightening or stridor", vitalThreshold: "Stridor + SpO₂ < 92%", escalationTarget: "Anaesthesiology / airway team", timeLimitSec: 60 },
      { description: "No response to IM epinephrine × 2", vitalThreshold: "BP < 80 after epi × 2", escalationTarget: "ICU / IV epinephrine infusion", timeLimitSec: 90 },
    ],
    stabilisationBranches: [
      {
        triggerInterventions: ["epinephrine_im"],
        vitalTargets: [{ vital: "BP", target: "Rising" }, { vital: "SpO₂", target: "≥ 92%" }, { vital: "HR", target: "Stabilising" }],
        expectedMonitorChanges: ["BP recovering", "SpO₂ improving", "bronchospasm reducing"],
        mechanismExplanation: "Epinephrine: α-1 vasoconstriction reverses hypotension; β-2 bronchodilation reverses bronchospasm; β-1 positive inotropy.",
      },
    ],
    documentationPrompts: [
      { category: "assessment", prompt: "Document time of allergen administration and time of symptom onset", required: true },
      { category: "intervention", prompt: "Record epinephrine: dose, route, site, time, response", required: true },
      { category: "reassessment", prompt: "Vital signs every 5 minutes × 30 minutes post-epinephrine", required: true },
    ],
    ngnCueSets: [
      {
        format: "bowtie",
        stemTemplate: "A patient 10 minutes after IV amoxicillin has throat tightness, urticaria, BP 74/38, HR 142. What is FIRST?",
        correctCues: ["IM epinephrine 0.3 mg right lateral thigh", "Stop amoxicillin infusion", "Call for help"],
        distractors: ["Diphenhydramine 50 mg IV", "Dexamethasone 10 mg IV", "Salbutamol nebuliser", "IV antihistamine before epinephrine"],
      },
    ],
    tags: ["anaphylaxis", "epinephrine", "allergy", "shock", "airway"],
  },

  // ── OPIOID TOXICITY ────────────────────────────────────────────────────────
  {
    id: "opioid_toxicity",
    name: "Opioid Toxicity / Respiratory Depression",
    conditionKeys: ["opioid_toxicity"],
    description: "Opioid-induced respiratory depression from therapeutic or non-therapeutic opioid exposure.",
    stages: {
      early: {
        label: "Early Opioid Effect — Sedation",
        recognitionCues: ["excessive sedation", "RASS -3 or lower", "slurred speech", "pinpoint pupils"],
        optimalInterventions: ["supplemental_o2"],
        harmIfMissedTicks: 4,
        harmDescription: "Unrecognised opioid toxicity progresses to apnoea — most post-op respiratory deaths are preventable.",
        stabilisationOutcome: "Stimulation, supplemental O₂, and opioid dose reduction may be sufficient for early toxicity.",
        ecgPattern: "sinus_bradycardia",
      },
      developing: {
        label: "Respiratory Depression — RR < 10",
        recognitionCues: ["RR < 10", "SpO₂ dropping", "unable to sustain eye opening"],
        optimalInterventions: ["supplemental_o2"],
        harmIfMissedTicks: 2,
        harmDescription: "RR < 8 with hypoxia — naloxone threshold reached. Apnoea risk within minutes.",
        stabilisationOutcome: "Naloxone 0.4 mg IV/IM titrated to adequate RR — avoid acute withdrawal.",
        ecgPattern: "sinus_bradycardia",
      },
      severe: {
        label: "Apnoea — Unresponsive",
        recognitionCues: ["RR < 4 or apnoea", "SpO₂ < 80%", "unresponsive to stimulation"],
        optimalInterventions: ["supplemental_o2"],
        harmIfMissedTicks: 1,
        harmDescription: "Apnoea → hypoxic cardiac arrest within 3–5 minutes without rescue breathing.",
        stabilisationOutcome: "BVM ventilation + naloxone 0.4–2 mg IV. Prepare for ACLS if no response.",
        ecgPattern: "sinus_bradycardia",
      },
      critical: {
        label: "Hypoxic Cardiac Arrest",
        recognitionCues: ["pulselessness", "PEA or asystole from hypoxia"],
        optimalInterventions: ["cpr", "supplemental_o2"],
        harmIfMissedTicks: 1,
        harmDescription: "Hypoxic cardiac arrest — highest ROSC rates when airway secured before arrest.",
        stabilisationOutcome: "CPR + naloxone + airway. Empiric naloxone in all unknown-cause cardiac arrests.",
        ecgPattern: "pea",
      },
    },
    escalationTriggers: [
      { description: "RR < 8", vitalThreshold: "RR < 8", escalationTarget: "Anaesthesiology / code blue standby", timeLimitSec: 60 },
    ],
    stabilisationBranches: [
      {
        triggerInterventions: ["supplemental_o2"],
        vitalTargets: [{ vital: "RR", target: "> 10" }, { vital: "SpO₂", target: "> 92%" }],
        expectedMonitorChanges: ["RR increasing within 2–3 minutes of naloxone", "SpO₂ recovering"],
        mechanismExplanation: "Naloxone competitively blocks μ-opioid receptors, rapidly reversing respiratory depression. Duration 30–90 minutes — re-dosing required for long-acting opioids.",
      },
    ],
    documentationPrompts: [
      { category: "assessment", prompt: "Document sedation score (RASS), RR, SpO₂, and pupil assessment", required: true },
      { category: "intervention", prompt: "Record naloxone: dose, route, time, response (RR, SpO₂, RASS)", required: true },
      { category: "intervention", prompt: "Document opioid stopped / dose reduced", required: true },
    ],
    ngnCueSets: [
      {
        format: "sata",
        stemTemplate: "A post-op patient has RR 5, SpO₂ 84%, unresponsive to voice. Which are PRIORITY actions?",
        correctCues: ["Stimulate patient — sternal rub", "BVM ventilation at 15 L O₂", "Naloxone 0.4 mg IV", "Stop opioid PCA immediately"],
        distractors: ["Wait 5 minutes to see if patient wakes spontaneously", "Administer flumazenil first", "Insert NG tube for stomach emptying"],
      },
    ],
    tags: ["opioid", "naloxone", "respiratory-depression", "postop", "toxicology"],
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getClinicalPathway(id: PathwayId): ClinicalPathway | null {
  return CLINICAL_PATHWAYS.find((p) => p.id === id) ?? null;
}

export function getPathwayForCondition(conditionKey: string): ClinicalPathway | null {
  return CLINICAL_PATHWAYS.find((p) => p.conditionKeys.includes(conditionKey)) ?? null;
}

export const PATHWAY_IDS: PathwayId[] = CLINICAL_PATHWAYS.map((p) => p.id);
