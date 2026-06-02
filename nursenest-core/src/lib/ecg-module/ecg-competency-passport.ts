/**
 * ECG Competency Passport — Phase 2
 *
 * A learner-facing competency achievement system that tracks mastery across
 * recognition, clinical judgment, and simulation domains.
 *
 * EXTENDS (does not replace):
 *   - EcgCompetencyDomainId (ecg-competency-domains.ts) — 8 technical domains
 *   - EcgMasteryRecord (ecg-learner-mastery.ts) — per-rhythm mastery state
 *
 * ADDS:
 *   - Named competency badges (Telemetry Ready, Clinical Ready, ECG Mastery)
 *   - Simulation completion tracking
 *   - Clinical judgment competency gates
 *   - Profession-specific passport variants
 *
 * DISPLAY LEVELS (Phase 10 positioning)
 *   Beginner → Developing → Proficient → Advanced → Telemetry Ready → Clinical Ready → ECG Mastery
 */

import type { EcgCompetencyDomainId } from "@/lib/ecg-module/ecg-competency-domains";
import type { EcgSimulationProfession } from "@/lib/ecg-module/ecg-simulation-schema";

// ─── Passport levels ──────────────────────────────────────────────────────────

export type EcgPassportLevel =
  | "beginner"
  | "developing"
  | "proficient"
  | "advanced"
  | "telemetry_ready"
  | "clinical_ready"
  | "ecg_mastery";

export const ECG_PASSPORT_LEVEL_LABELS: Record<EcgPassportLevel, string> = {
  beginner:        "Beginner",
  developing:      "Developing",
  proficient:      "Proficient",
  advanced:        "Advanced",
  telemetry_ready: "Telemetry Ready",
  clinical_ready:  "Clinical Ready",
  ecg_mastery:     "ECG Mastery",
};

export const ECG_PASSPORT_LEVEL_DESCRIPTIONS: Record<EcgPassportLevel, string> = {
  beginner:
    "Recognizing the foundational rhythms (NSR, sinus tachycardia, sinus bradycardia). " +
    "Learning the 6-step interpretation framework.",
  developing:
    "Consistently identifying common arrhythmias (AFib, PVCs, SVT). " +
    "Beginning to apply hemodynamic context to rhythm interpretation.",
  proficient:
    "Recognizing all core rhythms with > 80% accuracy. " +
    "Correctly applying stable vs. unstable classification to clinical presentations.",
  advanced:
    "Mastering complex rhythms (CHB, Wenckebach, Torsades, BBB). " +
    "Consistently selecting the correct escalation level for each rhythm state.",
  telemetry_ready:
    "Competent to independently monitor and interpret telemetry in a supervised clinical environment. " +
    "Has completed telemetry simulations and demonstrated clinical judgment competencies.",
  clinical_ready:
    "Demonstrated competency across all ECG domains including STEMI recognition, ACLS rhythms, " +
    "and complex conduction disorders. Simulation-verified clinical judgment in emergency scenarios.",
  ecg_mastery:
    "Expert-level ECG interpretation with demonstrated mastery of all rhythms, clinical judgment, " +
    "simulation performance, and teaching competency. Suitable for mentoring peers.",
};

// ─── Competency badge types ───────────────────────────────────────────────────

export type EcgCompetencyBadgeId =
  // Recognition competencies
  | "recognizes_nsr"
  | "recognizes_sinus_brady"
  | "recognizes_sinus_tach"
  | "recognizes_afib"
  | "recognizes_atrial_flutter"
  | "recognizes_svt"
  | "recognizes_pvcs"
  | "recognizes_vt"
  | "recognizes_vf"
  | "recognizes_asystole"
  | "recognizes_pea"
  | "recognizes_chb"
  | "recognizes_stemi"
  | "recognizes_nstemi"
  | "recognizes_paced_rhythm"
  | "recognizes_bbb"
  | "recognizes_wenckebach"
  | "recognizes_torsades"
  | "recognizes_hyperkalemia"
  | "recognizes_rsa"
  // Clinical judgment competencies
  | "judgment_escalated_appropriately"
  | "judgment_activated_rapid_response"
  | "judgment_activated_code_blue"
  | "judgment_correct_shock_mode"
  | "judgment_identified_unstable"
  | "judgment_recognized_stemi"
  | "judgment_withheld_nitrates_rv_mi"
  | "judgment_identified_wpw_afib"
  | "judgment_prioritized_correctly"
  | "judgment_delegated_appropriately"
  // Simulation competencies
  | "simulation_telemetry_basic"
  | "simulation_telemetry_advanced"
  | "simulation_emergency_vt"
  | "simulation_emergency_vf"
  | "simulation_stemi_activation"
  | "simulation_cardiac_arrest"
  | "simulation_chb_pacing"
  | "simulation_afib_cardioversion"
  | "simulation_pediatric_svt"
  | "simulation_torsades_magnesium"
  // Documentation competencies
  | "documentation_rhythm_charting"
  | "documentation_sbar_escalation"
  | "documentation_code_record"
  | "documentation_stemi_event";

// ─── Competency badge definitions ─────────────────────────────────────────────

export type EcgCompetencyBadge = {
  id: EcgCompetencyBadgeId;
  label: string;
  description: string;
  category: "recognition" | "clinical_judgment" | "simulation" | "documentation";
  /** Minimum accuracy on rhythm-specific questions to earn this badge */
  minimumAccuracy?: number;
  /** Specific simulation IDs required to earn this badge */
  requiredSimulationIds?: ReadonlyArray<string>;
  /** Clinical risk level this badge demonstrates competency with */
  riskLevel?: "low" | "moderate" | "high" | "life_threatening";
  /** Whether this badge is required for Telemetry Ready level */
  requiredForTelemetryReady: boolean;
  /** Whether this badge is required for Clinical Ready level */
  requiredForClinicalReady: boolean;
  /** Whether this badge is required for ECG Mastery level */
  requiredForEcgMastery: boolean;
};

export const ECG_COMPETENCY_BADGES: ReadonlyArray<EcgCompetencyBadge> = [
  // ── Recognition badges ────────────────────────────────────────────────────
  { id: "recognizes_nsr", label: "NSR Recognition", description: "Consistently identifies normal sinus rhythm with correct measurement of rate, regularity, PR, and QRS.", category: "recognition", minimumAccuracy: 0.90, riskLevel: "low", requiredForTelemetryReady: true, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_sinus_brady", label: "Sinus Bradycardia Recognition", description: "Identifies sinus bradycardia, differentiates from CHB, and correctly assesses for symptoms.", category: "recognition", minimumAccuracy: 0.85, riskLevel: "moderate", requiredForTelemetryReady: true, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_sinus_tach", label: "Sinus Tachycardia Recognition", description: "Identifies sinus tachycardia and recognizes the cause-finding imperative.", category: "recognition", minimumAccuracy: 0.85, riskLevel: "moderate", requiredForTelemetryReady: true, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_afib", label: "AFib Recognition", description: "Identifies atrial fibrillation, assesses ventricular response rate, and initiates appropriate monitoring.", category: "recognition", minimumAccuracy: 0.85, riskLevel: "high", requiredForTelemetryReady: true, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_atrial_flutter", label: "Atrial Flutter Recognition", description: "Identifies atrial flutter with characteristic sawtooth pattern and assesses conduction ratio.", category: "recognition", minimumAccuracy: 0.80, riskLevel: "high", requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_svt", label: "SVT Recognition", description: "Identifies SVT, differentiates from sinus tachycardia, and recognizes vagal maneuver candidacy.", category: "recognition", minimumAccuracy: 0.82, riskLevel: "high", requiredForTelemetryReady: true, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_pvcs", label: "PVC Recognition", description: "Identifies PVCs, characterizes frequency and morphology, and applies context-appropriate escalation.", category: "recognition", minimumAccuracy: 0.85, riskLevel: "moderate", requiredForTelemetryReady: true, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_vt", label: "VT Recognition", description: "Identifies VT, performs pulse check, and correctly classifies pulsatile vs. pulseless VT.", category: "recognition", minimumAccuracy: 0.88, riskLevel: "life_threatening", requiredForTelemetryReady: true, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_vf", label: "VF Recognition", description: "Identifies VF, confirms with patient assessment (not monitor alone), and initiates ACLS.", category: "recognition", minimumAccuracy: 0.90, riskLevel: "life_threatening", requiredForTelemetryReady: true, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_asystole", label: "Asystole Recognition", description: "Identifies asystole, applies 2-lead confirmation rule before calling code, and differentiates from fine VF.", category: "recognition", minimumAccuracy: 0.85, riskLevel: "life_threatening", requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_pea", label: "PEA Recognition", description: "Identifies PEA as a clinical diagnosis (organized ECG + no pulse), not an ECG diagnosis alone.", category: "recognition", minimumAccuracy: 0.85, riskLevel: "life_threatening", requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_chb", label: "CHB Recognition", description: "Identifies complete heart block with AV dissociation, differentiates from simple bradycardia, and initiates pacing protocol.", category: "recognition", minimumAccuracy: 0.85, riskLevel: "life_threatening", requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_stemi", label: "STEMI Recognition", description: "Identifies STEMI on 12-lead, localizes the territory, and activates the cath lab within 10 minutes.", category: "recognition", minimumAccuracy: 0.88, riskLevel: "life_threatening", requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_nstemi", label: "NSTEMI Recognition", description: "Identifies NSTEMI pattern (ST depression, T-wave changes) and differentiates from STEMI.", category: "recognition", minimumAccuracy: 0.80, riskLevel: "high", requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_paced_rhythm", label: "Paced Rhythm Recognition", description: "Identifies paced rhythm, differentiates capture from failure to capture, and recognizes undersensing.", category: "recognition", minimumAccuracy: 0.80, riskLevel: "high", requiredForTelemetryReady: false, requiredForClinicalReady: false, requiredForEcgMastery: true },
  { id: "recognizes_bbb", label: "Bundle Branch Block Recognition", description: "Differentiates RBBB (RSR' in V1) from LBBB (broad notched R in I/V6) and identifies clinical implications.", category: "recognition", minimumAccuracy: 0.78, riskLevel: "moderate", requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_wenckebach", label: "Wenckebach Recognition", description: "Identifies progressive PR lengthening with dropped QRS (Wenckebach) and differentiates from Mobitz II.", category: "recognition", minimumAccuracy: 0.78, riskLevel: "moderate", requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_torsades", label: "Torsades de Pointes Recognition", description: "Identifies polymorphic VT with axis twisting (torsades), differentiates from monomorphic VT, and initiates magnesium.", category: "recognition", minimumAccuracy: 0.80, riskLevel: "life_threatening", requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "recognizes_hyperkalemia", label: "Hyperkalemia ECG Recognition", description: "Identifies peaked T waves, QRS widening, and loss of P waves in progressive hyperkalemia.", category: "recognition", minimumAccuracy: 0.75, riskLevel: "high", requiredForTelemetryReady: false, requiredForClinicalReady: false, requiredForEcgMastery: true },
  { id: "recognizes_rsa", label: "RSA Recognition", description: "Identifies respiratory sinus arrhythmia as a normal variant in young/athletic patients and differentiates from AFib.", category: "recognition", minimumAccuracy: 0.80, riskLevel: "low", requiredForTelemetryReady: true, requiredForClinicalReady: true, requiredForEcgMastery: true },

  // ── Clinical judgment badges ───────────────────────────────────────────────
  { id: "judgment_escalated_appropriately", label: "Escalation Judgment", description: "Correctly matched escalation level (monitor/notify/rapid response/code) to rhythm + clinical presentation in ≥5 simulation scenarios.", category: "clinical_judgment", requiredSimulationIds: [], requiredForTelemetryReady: true, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "judgment_activated_rapid_response", label: "Rapid Response Activation", description: "Correctly identified and activated rapid response for at least 2 hemodynamically unstable rhythm scenarios in simulation.", category: "clinical_judgment", requiredSimulationIds: ["ecg-rn-bradycardia-chb"], requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "judgment_activated_code_blue", label: "Code Blue Activation", description: "Correctly called code blue and initiated CPR for pulseless rhythm in simulation.", category: "clinical_judgment", requiredSimulationIds: ["ecg-sim-vt-code-rn"], requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "judgment_correct_shock_mode", label: "Shock Mode Selection", description: "Correctly selected unsynchronized defibrillation for pulseless VT/VF and synchronized cardioversion for pulsatile unstable VT/AFib in simulation.", category: "clinical_judgment", requiredSimulationIds: ["ecg-sim-vt-code-rn"], requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "judgment_identified_unstable", label: "Hemodynamic Instability Recognition", description: "Correctly identified hemodynamic instability (hypotension + altered mentation + diaphoresis) and applied the appropriate algorithm in ≥3 simulation scenarios.", category: "clinical_judgment", requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "judgment_recognized_stemi", label: "STEMI Clinical Judgment", description: "Recognized STEMI on 12-lead and activated cath lab within 10 minutes in simulation.", category: "clinical_judgment", requiredSimulationIds: ["ecg-sim-stemi-activation-rn"], requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "judgment_withheld_nitrates_rv_mi", label: "RV MI Safety Competency", description: "Correctly withheld nitroglycerin for inferior STEMI after recognizing RV MI on right-sided leads.", category: "clinical_judgment", requiredSimulationIds: ["ecg-sim-stemi-activation-rn"], requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "judgment_identified_wpw_afib", label: "WPW + AFib Safety", description: "Correctly identified WPW-related AFib and avoided AV nodal blocking agents.", category: "clinical_judgment", requiredSimulationIds: ["ecg-rn-wpw-afib"], requiredForTelemetryReady: false, requiredForClinicalReady: false, requiredForEcgMastery: true },
  { id: "judgment_prioritized_correctly", label: "Prioritization Competency", description: "Correctly prioritized the most acutely ill patient when managing multiple patients with different rhythms.", category: "clinical_judgment", requiredForTelemetryReady: true, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "judgment_delegated_appropriately", label: "Delegation Competency", description: "Correctly identified tasks that can be delegated to UAP vs. those requiring an RN in emergency scenarios.", category: "clinical_judgment", requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },

  // ── Simulation badges ─────────────────────────────────────────────────────
  { id: "simulation_telemetry_basic", label: "Basic Telemetry Simulation", description: "Completed basic telemetry monitoring simulations with passing score.", category: "simulation", requiredSimulationIds: ["ecg-ng-my-first-alarm", "ecg-ng-artifact-not-vf", "ecg-ng-pvcs-scared"], requiredForTelemetryReady: true, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "simulation_telemetry_advanced", label: "Advanced Telemetry Simulation", description: "Completed advanced telemetry simulations including artifact recognition and pacemaker interpretation.", category: "simulation", requiredSimulationIds: ["ecg-rn-artifact-vf", "ecg-rn-pacemaker-failure"], requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "simulation_emergency_vt", label: "VT Emergency Simulation", description: "Successfully managed pulsatile and pulseless VT in a full simulation scenario.", category: "simulation", requiredSimulationIds: ["ecg-sim-vt-code-rn"], requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "simulation_emergency_vf", label: "VF Arrest Simulation", description: "Successfully managed VF cardiac arrest through ACLS protocol in simulation.", category: "simulation", requiredSimulationIds: ["ecg-sim-vt-code-rn"], requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "simulation_stemi_activation", label: "STEMI Activation Simulation", description: "Successfully activated STEMI protocol within 10 minutes in simulation, including right-sided lead assessment.", category: "simulation", requiredSimulationIds: ["ecg-sim-stemi-activation-rn"], requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "simulation_cardiac_arrest", label: "Cardiac Arrest Simulation", description: "Demonstrated competency in cardiac arrest management (CPR quality, defibrillation, epinephrine timing, ROSC assessment).", category: "simulation", requiredSimulationIds: ["ecg-sim-vt-code-rn"], requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "simulation_chb_pacing", label: "CHB + Pacing Simulation", description: "Applied transcutaneous pacing for hemodynamically unstable CHB and confirmed mechanical capture.", category: "simulation", requiredSimulationIds: ["ecg-rn-bradycardia-chb"], requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "simulation_afib_cardioversion", label: "AFib Cardioversion Simulation", description: "Managed hemodynamically unstable AFib through synchronized cardioversion simulation.", category: "simulation", requiredSimulationIds: ["ecg-sim-afib-rvr-rn"], requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "simulation_torsades_magnesium", label: "Torsades Simulation", description: "Identified torsades de pointes and initiated IV magnesium protocol (not amiodarone) in simulation.", category: "simulation", requiredSimulationIds: ["ecg-rn-torsades-magnesium"], requiredForTelemetryReady: false, requiredForClinicalReady: false, requiredForEcgMastery: true },

  // ── Documentation badges ──────────────────────────────────────────────────
  { id: "documentation_rhythm_charting", label: "Rhythm Documentation", description: "Completed accurate rhythm change documentation including rate, rhythm, symptoms, provider notification, and plan.", category: "documentation", requiredForTelemetryReady: true, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "documentation_sbar_escalation", label: "SBAR Communication", description: "Completed structured SBAR communication for an arrhythmia escalation with all required elements.", category: "documentation", requiredForTelemetryReady: true, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "documentation_code_record", label: "Code Blue Documentation", description: "Completed accurate code blue documentation including timing, interventions, medications, ROSC, and disposition.", category: "documentation", requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
  { id: "documentation_stemi_event", label: "STEMI Event Documentation", description: "Completed STEMI event documentation including ECG findings, alert activation time, medications, and D2B data.", category: "documentation", requiredForTelemetryReady: false, requiredForClinicalReady: true, requiredForEcgMastery: true },
];

// ─── Passport level gates ─────────────────────────────────────────────────────

export type EcgPassportLevelGate = {
  level: EcgPassportLevel;
  label: string;
  requirements: {
    minimumDomainScores: Partial<Record<EcgCompetencyDomainId, number>>;
    requiredBadges: ReadonlyArray<EcgCompetencyBadgeId>;
    minimumSimulationsCompleted: number;
    minimumOverallAccuracy: number;
  };
};

export const ECG_PASSPORT_LEVEL_GATES: ReadonlyArray<EcgPassportLevelGate> = [
  {
    level: "beginner",
    label: "Beginner",
    requirements: {
      minimumDomainScores: { rhythm_recognition: 0.30 },
      requiredBadges: [],
      minimumSimulationsCompleted: 0,
      minimumOverallAccuracy: 0.40,
    },
  },
  {
    level: "developing",
    label: "Developing",
    requirements: {
      minimumDomainScores: { rhythm_recognition: 0.55 },
      requiredBadges: ["recognizes_nsr", "recognizes_sinus_tach"],
      minimumSimulationsCompleted: 2,
      minimumOverallAccuracy: 0.55,
    },
  },
  {
    level: "proficient",
    label: "Proficient",
    requirements: {
      minimumDomainScores: {
        rhythm_recognition: 0.75,
        acls_critical_rhythms: 0.65,
      },
      requiredBadges: ["recognizes_nsr", "recognizes_sinus_brady", "recognizes_sinus_tach", "recognizes_afib", "recognizes_pvcs", "recognizes_vt", "recognizes_vf"],
      minimumSimulationsCompleted: 5,
      minimumOverallAccuracy: 0.70,
    },
  },
  {
    level: "advanced",
    label: "Advanced",
    requirements: {
      minimumDomainScores: {
        rhythm_recognition: 0.85,
        acls_critical_rhythms: 0.80,
        conduction_disorders: 0.72,
        ischemia_stemi: 0.75,
      },
      requiredBadges: ["recognizes_afib", "recognizes_vt", "recognizes_vf", "recognizes_stemi", "recognizes_chb", "recognizes_svt", "judgment_escalated_appropriately"],
      minimumSimulationsCompleted: 10,
      minimumOverallAccuracy: 0.80,
    },
  },
  {
    level: "telemetry_ready",
    label: "Telemetry Ready",
    requirements: {
      minimumDomainScores: {
        rhythm_recognition: 0.85,
        acls_critical_rhythms: 0.80,
        telemetry_interpretation: 0.78,
      },
      requiredBadges: [
        "recognizes_nsr", "recognizes_afib", "recognizes_vt", "recognizes_vf",
        "recognizes_sinus_brady", "recognizes_sinus_tach", "recognizes_svt", "recognizes_pvcs", "recognizes_rsa",
        "judgment_escalated_appropriately", "judgment_prioritized_correctly",
        "simulation_telemetry_basic", "documentation_rhythm_charting", "documentation_sbar_escalation",
      ],
      minimumSimulationsCompleted: 15,
      minimumOverallAccuracy: 0.82,
    },
  },
  {
    level: "clinical_ready",
    label: "Clinical Ready",
    requirements: {
      minimumDomainScores: {
        rhythm_recognition: 0.88,
        acls_critical_rhythms: 0.85,
        conduction_disorders: 0.80,
        ischemia_stemi: 0.82,
        telemetry_interpretation: 0.80,
      },
      requiredBadges: [
        // All recognition badges
        "recognizes_nsr", "recognizes_sinus_brady", "recognizes_sinus_tach", "recognizes_afib",
        "recognizes_atrial_flutter", "recognizes_svt", "recognizes_pvcs", "recognizes_vt",
        "recognizes_vf", "recognizes_asystole", "recognizes_pea", "recognizes_chb",
        "recognizes_stemi", "recognizes_nstemi", "recognizes_bbb", "recognizes_wenckebach", "recognizes_torsades",
        // All critical judgment badges
        "judgment_activated_code_blue", "judgment_correct_shock_mode", "judgment_recognized_stemi",
        "judgment_withheld_nitrates_rv_mi", "judgment_identified_unstable",
        // Key simulation badges
        "simulation_emergency_vt", "simulation_emergency_vf", "simulation_stemi_activation",
        "simulation_cardiac_arrest", "simulation_chb_pacing", "simulation_afib_cardioversion",
        // Documentation
        "documentation_code_record", "documentation_stemi_event",
      ],
      minimumSimulationsCompleted: 25,
      minimumOverallAccuracy: 0.85,
    },
  },
  {
    level: "ecg_mastery",
    label: "ECG Mastery",
    requirements: {
      minimumDomainScores: {
        rhythm_recognition: 0.92,
        acls_critical_rhythms: 0.90,
        conduction_disorders: 0.85,
        ischemia_stemi: 0.88,
        telemetry_interpretation: 0.85,
        electrolyte_abnormalities: 0.80,
        paced_rhythms: 0.80,
        interval_analysis: 0.82,
      },
      requiredBadges: [
        // All badges — ECG Mastery requires every competency
        "recognizes_nsr", "recognizes_sinus_brady", "recognizes_sinus_tach", "recognizes_afib",
        "recognizes_atrial_flutter", "recognizes_svt", "recognizes_pvcs", "recognizes_vt",
        "recognizes_vf", "recognizes_asystole", "recognizes_pea", "recognizes_chb",
        "recognizes_stemi", "recognizes_nstemi", "recognizes_paced_rhythm", "recognizes_bbb",
        "recognizes_wenckebach", "recognizes_torsades", "recognizes_hyperkalemia", "recognizes_rsa",
        "judgment_escalated_appropriately", "judgment_activated_rapid_response",
        "judgment_activated_code_blue", "judgment_correct_shock_mode", "judgment_identified_unstable",
        "judgment_recognized_stemi", "judgment_withheld_nitrates_rv_mi", "judgment_identified_wpw_afib",
        "judgment_prioritized_correctly", "judgment_delegated_appropriately",
        "simulation_telemetry_basic", "simulation_telemetry_advanced",
        "simulation_emergency_vt", "simulation_emergency_vf", "simulation_stemi_activation",
        "simulation_cardiac_arrest", "simulation_chb_pacing", "simulation_afib_cardioversion", "simulation_torsades_magnesium",
        "documentation_rhythm_charting", "documentation_sbar_escalation", "documentation_code_record", "documentation_stemi_event",
      ],
      minimumSimulationsCompleted: 40,
      minimumOverallAccuracy: 0.90,
    },
  },
];

// ─── Profession-specific passport requirements ────────────────────────────────

export type EcgProfessionPassportConfig = {
  profession: EcgSimulationProfession;
  /** Maximum achievable level for this profession */
  maxLevel: EcgPassportLevel;
  /** Badges that are excluded from this profession's passport (scope-based) */
  excludedBadgeIds: ReadonlyArray<EcgCompetencyBadgeId>;
  /** Minimum required simulations from this profession's catalog */
  minimumProfessionSimulations: number;
};

export const ECG_PROFESSION_PASSPORT_CONFIGS: ReadonlyArray<EcgProfessionPassportConfig> = [
  {
    profession: "RN",
    maxLevel: "ecg_mastery",
    excludedBadgeIds: [],
    minimumProfessionSimulations: 15,
  },
  {
    profession: "RPN",
    maxLevel: "telemetry_ready",
    excludedBadgeIds: [
      "judgment_activated_code_blue",
      "judgment_correct_shock_mode",
      "simulation_emergency_vt",
      "simulation_emergency_vf",
      "simulation_cardiac_arrest",
      "simulation_chb_pacing",
      "documentation_code_record",
    ],
    minimumProfessionSimulations: 15,
  },
  {
    profession: "NP",
    maxLevel: "ecg_mastery",
    excludedBadgeIds: [],
    minimumProfessionSimulations: 15,
  },
  {
    profession: "RT",
    maxLevel: "clinical_ready",
    excludedBadgeIds: ["judgment_identified_wpw_afib"],
    minimumProfessionSimulations: 12,
  },
  {
    profession: "new_grad",
    maxLevel: "telemetry_ready",
    excludedBadgeIds: [
      "recognizes_paced_rhythm",
      "recognizes_wenckebach",
      "recognizes_hyperkalemia",
      "judgment_identified_wpw_afib",
      "simulation_torsades_magnesium",
    ],
    minimumProfessionSimulations: 10,
  },
];

// ─── Accessor functions ────────────────────────────────────────────────────────

export function getPassportLevelGate(level: EcgPassportLevel): EcgPassportLevelGate | undefined {
  return ECG_PASSPORT_LEVEL_GATES.find((g) => g.level === level);
}

export function getBadgesRequiredForLevel(level: EcgPassportLevel): ReadonlyArray<EcgCompetencyBadge> {
  const gate = getPassportLevelGate(level);
  if (!gate) return [];
  return ECG_COMPETENCY_BADGES.filter((b) => gate.requirements.requiredBadges.includes(b.id));
}

export function getProfessionPassportConfig(
  profession: EcgSimulationProfession,
): EcgProfessionPassportConfig | undefined {
  return ECG_PROFESSION_PASSPORT_CONFIGS.find((c) => c.profession === profession);
}

export function computeEcgPassportLevel(
  earnedBadgeIds: ReadonlyArray<EcgCompetencyBadgeId>,
  overallAccuracy: number,
  completedSimulationCount: number,
  domainScores: Partial<Record<EcgCompetencyDomainId, number>>,
): EcgPassportLevel {
  const earnedSet = new Set(earnedBadgeIds);

  const levelsDescending: EcgPassportLevel[] = [
    "ecg_mastery", "clinical_ready", "telemetry_ready", "advanced", "proficient", "developing",
  ];

  for (const level of levelsDescending) {
    const gate = getPassportLevelGate(level);
    if (!gate) continue;

    const { requirements } = gate;

    const badgesMet = requirements.requiredBadges.every((b) => earnedSet.has(b as EcgCompetencyBadgeId));
    const accuracyMet = overallAccuracy >= requirements.minimumOverallAccuracy;
    const simulationsMet = completedSimulationCount >= requirements.minimumSimulationsCompleted;
    const domainsMet = Object.entries(requirements.minimumDomainScores).every(([domain, minScore]) => {
      const score = domainScores[domain as EcgCompetencyDomainId] ?? 0;
      return score >= (minScore ?? 0);
    });

    if (badgesMet && accuracyMet && simulationsMet && domainsMet) {
      return level;
    }
  }

  return "beginner";
}
