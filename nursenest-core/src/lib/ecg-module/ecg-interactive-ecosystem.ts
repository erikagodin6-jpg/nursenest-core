import type { DetectiveSessionScore } from "@/lib/ecg-module/ecg-detective-mode";
import type { LearnerClearanceMetrics } from "@/lib/ecg-module/ecg-clearances";
import type { ReadinessInputData } from "@/lib/ecg-module/ecg-readiness-scoring";
import { ECG_CLINICAL_REASONING_RHYTHM_KEYS } from "@/lib/ecg-module/ecg-clinical-reasoning-index";

export type EcgComparePairId =
  | "afib-vs-flutter"
  | "mobitz1-vs-mobitz2"
  | "vt-vs-svt"
  | "pac-vs-pvc"
  | "rbbb-vs-lbbb"
  | "stemi-vs-nstemi"
  | "junctional-vs-sinus-bradycardia"
  | "hyperkalemia-vs-hypokalemia";

export type EcgComparePair = {
  id: EcgComparePairId;
  title: string;
  leftRhythmKey: string;
  rightRhythmKey: string;
  visualDifference: string;
  clinicalDifference: string;
  escalationDifference: string;
  treatmentDifference: string;
};

export const ECG_INTERACTIVE_COMPARE_PAIRS: EcgComparePair[] = [
  {
    id: "afib-vs-flutter",
    title: "AFib vs Flutter",
    leftRhythmKey: "atrial_fibrillation",
    rightRhythmKey: "atrial_flutter",
    visualDifference: "AFib is irregularly irregular without discrete P-waves; flutter has organized sawtooth atrial activity.",
    clinicalDifference: "Both increase stroke risk, but flutter may conduct in predictable ratios while AFib varies beat to beat.",
    escalationDifference: "Escalation depends on rate, symptoms, perfusion, and duration; unstable patients need urgent synchronized cardioversion.",
    treatmentDifference: "Rate/rhythm control and anticoagulation decisions are individualized; avoid unsafe cardioversion if duration/anticoagulation status is unclear.",
  },
  {
    id: "mobitz1-vs-mobitz2",
    title: "Mobitz I vs Mobitz II",
    leftRhythmKey: "second_degree_type_i_av_block",
    rightRhythmKey: "second_degree_type_ii_av_block",
    visualDifference: "Mobitz I has progressive PR lengthening before a dropped QRS; Mobitz II drops QRS complexes without PR warning.",
    clinicalDifference: "Mobitz I is usually AV nodal and often tolerated; Mobitz II is infranodal and more likely to deteriorate.",
    escalationDifference: "Mobitz II deserves earlier provider notification, pacing readiness, and closer monitoring than uncomplicated Mobitz I.",
    treatmentDifference: "Symptomatic Mobitz II often needs pacing; atropine may be unreliable when the block is below the AV node.",
  },
  {
    id: "vt-vs-svt",
    title: "VT vs SVT",
    leftRhythmKey: "ventricular_tachycardia",
    rightRhythmKey: "svt",
    visualDifference: "VT is usually wide-complex; SVT is usually narrow-complex unless aberrant conduction is present.",
    clinicalDifference: "VT is treated as life-threatening until proven otherwise, especially with ischemia or instability.",
    escalationDifference: "Unstable wide-complex tachycardia requires rapid response and synchronized cardioversion with a pulse.",
    treatmentDifference: "Stable SVT may respond to vagal maneuvers or adenosine; unstable VT is not a wait-and-see medication problem.",
  },
  {
    id: "pac-vs-pvc",
    title: "PAC vs PVC",
    leftRhythmKey: "pacs",
    rightRhythmKey: "pvcs",
    visualDifference: "PACs arrive early with abnormal P-wave morphology and narrow QRS; PVCs are early wide ventricular beats.",
    clinicalDifference: "PACs often signal atrial irritability; increasing PVC burden can warn of ventricular instability.",
    escalationDifference: "Isolated ectopy may be monitored, but symptomatic or increasing PVC burden needs electrolyte and ischemia assessment.",
    treatmentDifference: "Treat triggers such as caffeine, stress, hypoxia, ischemia, potassium, and magnesium rather than the single premature beat alone.",
  },
  {
    id: "rbbb-vs-lbbb",
    title: "RBBB vs LBBB",
    leftRhythmKey: "right_bundle_branch_block",
    rightRhythmKey: "left_bundle_branch_block",
    visualDifference: "RBBB delays right ventricular activation; LBBB delays left ventricular activation and can obscure ischemic ST changes.",
    clinicalDifference: "New LBBB with symptoms carries higher concern for structural disease or ischemia than isolated chronic RBBB.",
    escalationDifference: "Escalate new bundle branch block with chest pain, syncope, hypotension, or acute heart failure signs.",
    treatmentDifference: "Treat the cause and clinical context; do not treat the bundle pattern as an isolated medication target.",
  },
  {
    id: "stemi-vs-nstemi",
    title: "STEMI vs NSTEMI",
    leftRhythmKey: "stemi_pattern",
    rightRhythmKey: "nstemi_pattern",
    visualDifference: "STEMI has diagnostic ST elevation in contiguous leads; NSTEMI may show ST depression, T-wave inversion, or nonspecific changes.",
    clinicalDifference: "STEMI suggests acute coronary occlusion needing immediate reperfusion; NSTEMI is high-risk ischemia without classic elevation criteria.",
    escalationDifference: "STEMI activation is immediate; NSTEMI still needs urgent ACS evaluation, serial ECGs, biomarkers, and monitoring.",
    treatmentDifference: "STEMI prioritizes cath lab activation; NSTEMI management follows risk stratification, antithrombotic therapy, and cardiology guidance.",
  },
  {
    id: "junctional-vs-sinus-bradycardia",
    title: "Junctional vs Sinus Bradycardia",
    leftRhythmKey: "junctional_rhythm",
    rightRhythmKey: "sinus_bradycardia",
    visualDifference: "Junctional rhythms often have absent or retrograde P-waves; sinus bradycardia preserves sinus P-waves before each QRS.",
    clinicalDifference: "Junctional escape may reflect SA node failure or medication effect; sinus bradycardia can be normal or symptomatic.",
    escalationDifference: "Escalate either rhythm when bradycardia causes hypotension, altered LOC, ischemia, shock, or heart failure symptoms.",
    treatmentDifference: "Correct reversible causes first; symptomatic bradycardia follows pacing/atropine pathways depending on rhythm and perfusion.",
  },
  {
    id: "hyperkalemia-vs-hypokalemia",
    title: "Hyperkalemia vs Hypokalemia",
    leftRhythmKey: "hyperkalemia_pattern",
    rightRhythmKey: "hypokalemia_pattern",
    visualDifference: "Hyperkalemia classically produces peaked T-waves and QRS widening; hypokalemia can show ST depression, flat T-waves, and U-waves.",
    clinicalDifference: "Both can trigger lethal dysrhythmias, but hyperkalemia can deteriorate rapidly into sine-wave, escape rhythm, PEA, or asystole.",
    escalationDifference: "Hyperkalemia ECG changes are urgent; symptomatic or severe hypokalemia also needs monitored replacement.",
    treatmentDifference: "Hyperkalemia requires membrane stabilization and potassium shifting/removal; hypokalemia requires safe controlled replacement.",
  },
];

export const ECG_PHASE3_READINESS_LABELS = [
  { label: "Rhythm Recognition", sourceDomain: "rhythm_recognition", scoreOffset: 0 },
  { label: "Clinical Reasoning", sourceDomain: "interval_analysis", scoreOffset: 4 },
  { label: "Escalation", sourceDomain: "acls_critical_rhythms", scoreOffset: 0 },
  { label: "Medication Safety", sourceDomain: "acls_critical_rhythms", scoreOffset: 8 },
  { label: "Telemetry Monitoring", sourceDomain: "telemetry_interpretation", scoreOffset: 0 },
  { label: "Deterioration Recognition", sourceDomain: "acls_critical_rhythms", scoreOffset: -3 },
  { label: "Emergency Response", sourceDomain: "acls_critical_rhythms", scoreOffset: 4 },
  { label: "Professional Role Judgment", sourceDomain: "conduction_disorders", scoreOffset: 6 },
] as const;

export const ECG_PHASE3_DEMO_READINESS_INPUT: ReadinessInputData = {
  detectiveHistory: {
    normal_sinus_rhythm: [78, 91],
    sinus_bradycardia: [72, 84],
    atrial_fibrillation: [64, 79],
    atrial_flutter: [66, 76],
    svt: [70, 82],
    ventricular_tachycardia: [48, 61],
    ventricular_fibrillation: [74, 86],
    pvcs: [60, 73],
    pacs: [81, 89],
    second_degree_type_i_av_block: [69, 78],
    second_degree_type_ii_av_block: [52, 68],
    third_degree_av_block: [58, 72],
    right_bundle_branch_block: [73, 82],
    left_bundle_branch_block: [62, 75],
    stemi_pattern: [71, 84],
    nstemi_pattern: [58, 69],
    hyperkalemia_pattern: [51, 66],
    hypokalemia_pattern: [74, 83],
    paced_rhythm: [77, 88],
  },
  deteriorationScores: {
    "pvc-to-vf": 62,
    "mobitz2-to-chb": 70,
    "hyperkalemia-to-pea": 58,
  },
  deteriorationPrevented: {
    "pvc-to-vf": false,
    "mobitz2-to-chb": true,
    "hyperkalemia-to-pea": false,
  },
  compareContrastCompleted: ["afib-vs-flutter", "vt-vs-svt", "pac-vs-pvc"],
  telemetryShiftScores: [66, 74],
};

export const ECG_PHASE3_CLEARANCE_METRICS: LearnerClearanceMetrics = {
  detectiveScores: Object.fromEntries(
    ECG_CLINICAL_REASONING_RHYTHM_KEYS.map((key) => [
      key,
      ECG_PHASE3_DEMO_READINESS_INPUT.detectiveHistory[key]?.at(-1) ?? 0,
    ]),
  ),
  detectiveCompletions: Object.fromEntries(
    ECG_CLINICAL_REASONING_RHYTHM_KEYS.map((key) => [
      key,
      (ECG_PHASE3_DEMO_READINESS_INPUT.detectiveHistory[key]?.length ?? 0),
    ]),
  ),
  deteriorationResults: {
    "pvc-to-vf": { completed: true, prevented: false, score: 62 },
    "mobitz2-to-chb": { completed: true, prevented: true, score: 70 },
    "hyperkalemia-to-pea": { completed: true, prevented: false, score: 58 },
    "pac-to-afib": { completed: false, prevented: false, score: 0 },
  },
  compareContrastCompletions: ECG_PHASE3_DEMO_READINESS_INPUT.compareContrastCompleted,
  telemetryShiftScores: ECG_PHASE3_DEMO_READINESS_INPUT.telemetryShiftScores,
  readinessDomainScores: {
    rhythm_recognition: 81,
    interval_analysis: 74,
    ischemia_stemi: 77,
    acls_critical_rhythms: 69,
    telemetry_interpretation: 73,
    conduction_disorders: 76,
    paced_rhythms: 88,
    electrolyte_abnormalities: 71,
  },
  medicationSafetyScore: 78,
};

export const ECG_PHASE3_DEMO_DETECTIVE_SCORES: DetectiveSessionScore[] = [
  {
    rhythmKey: "ventricular_tachycardia",
    totalPoints: 93,
    maxPoints: 165,
    percentScore: 56,
    grade: "D",
    domainScores: {
      recognition: 64,
      clinicalReasoning: 55,
      escalation: 42,
      medicationSafety: 35,
    },
    perfectSteps: ["qrs_width"],
    weakSteps: ["rhythm_id", "escalation_level", "first_action", "medication_safety"],
  },
  {
    rhythmKey: "hyperkalemia_pattern",
    totalPoints: 108,
    maxPoints: 165,
    percentScore: 65,
    grade: "D",
    domainScores: {
      recognition: 70,
      clinicalReasoning: 60,
      escalation: 55,
      medicationSafety: 45,
    },
    perfectSteps: ["qrs_width"],
    weakSteps: ["p_wave", "mechanism", "medication_safety"],
  },
];
