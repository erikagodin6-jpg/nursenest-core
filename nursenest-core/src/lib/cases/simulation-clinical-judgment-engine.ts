import type {
  CaseDecisionRecord,
  CaseStep,
  CaseStepConsequence,
  ClinicalUpdate,
  DiagnosticArtifact,
  PatientCase,
  VitalReading,
} from "@/lib/cases/longitudinal-case-types";
import type { CnpleDomainSlug } from "@/lib/np/cnple-domain-tags";

export type SimulationTimeHorizon = "15_min" | "30_min" | "60_min" | "multi_shift";

export type ClinicalJudgmentAction =
  | "assessment"
  | "recognition"
  | "prioritization"
  | "intervention"
  | "evaluation"
  | "escalation"
  | "documentation";

export type NgNClinicalJudgmentFormat =
  | "bowtie"
  | "matrix"
  | "extended_sata"
  | "trend_recognition"
  | "cloze"
  | "case_study";

export type SimulationSpecialty =
  | "emergency"
  | "critical_care"
  | "telemetry"
  | "maternal"
  | "pediatrics"
  | "mental_health"
  | "community"
  | "long_term_care"
  | "leadership"
  | "home_care"
  | "perioperative"
  | "dialysis"
  | "primary_care"
  | "np_practice";

export type SimulationAnalyticsDimension =
  | "Recognition Score"
  | "Prioritization Score"
  | "Intervention Score"
  | "Safety Score"
  | "Communication Score"
  | "Documentation Score"
  | "Clinical Judgment Score"
  | "Decision Quality Score";

export type PatientEvolutionSignal = {
  label: string;
  source: "vitals" | "labs" | "ecg" | "imaging" | "mental_status" | "oxygen" | "family" | "orders" | "medications" | "scenario";
  severity: "stable" | "watch" | "worsening" | "critical";
};

export type SimulationPracticeStep = Omit<CaseStep, "question"> & {
  question: Pick<CaseStep["question"], "stem" | "family" | "options" | "clinicalJudgmentFocus">;
};

export type SimulationPracticeFrame = {
  timeHorizon: SimulationTimeHorizon;
  careCycle: ClinicalJudgmentAction[];
  ngnFormats: NgNClinicalJudgmentFormat[];
  patientEvolutionSignals: PatientEvolutionSignal[];
  requiredActions: ClinicalJudgmentAction[];
  documentationTasks: string[];
  teamCommunicationPrompts: string[];
  handoffPrompts: string[];
  analyticsDimensions: SimulationAnalyticsDimension[];
  adaptiveRemediationRoutes: Array<{
    surface: "lessons" | "flashcards" | "questions" | "clinical_skills" | "pharmacology" | "ecg";
    reason: string;
  }>;
};

export type SimulationCapabilityTarget = {
  tier: "rn" | "pn" | "np" | "allied" | "new_grad";
  minimumSimulations: number;
  emphasis: string[];
};

export const CLINICAL_JUDGMENT_CARE_CYCLE: ClinicalJudgmentAction[] = [
  "assessment",
  "recognition",
  "prioritization",
  "intervention",
  "evaluation",
  "escalation",
  "documentation",
];

export const NGN_SIMULATION_FORMATS: NgNClinicalJudgmentFormat[] = [
  "bowtie",
  "matrix",
  "extended_sata",
  "trend_recognition",
  "cloze",
  "case_study",
];

export const SIMULATION_ANALYTICS_DIMENSIONS: SimulationAnalyticsDimension[] = [
  "Recognition Score",
  "Prioritization Score",
  "Intervention Score",
  "Safety Score",
  "Communication Score",
  "Documentation Score",
  "Clinical Judgment Score",
  "Decision Quality Score",
];

export const SIMULATION_SPECIALTY_LIBRARY: Record<SimulationSpecialty, string> = {
  emergency: "Rapid assessment, unstable priorities, emergency interventions, and escalation.",
  critical_care: "Hemodynamics, drips, ventilatory support, deterioration, and team coordination.",
  telemetry: "Rhythm changes, symptom correlation, medication implications, and escalation.",
  maternal: "Maternal-fetal safety, postpartum risks, urgent findings, and family teaching.",
  pediatrics: "Age-specific assessment, caregiver communication, dosing safety, and deterioration cues.",
  mental_health: "Risk assessment, therapeutic communication, safety planning, and crisis escalation.",
  community: "Health promotion, follow-up planning, access barriers, and public-health reasoning.",
  long_term_care: "Functional change, infection cues, polypharmacy, falls, and family communication.",
  leadership: "Delegation, staffing, conflict, safety events, and professional accountability.",
  home_care: "Environmental safety, teaching, symptom escalation, and care coordination.",
  perioperative: "Pre-op risk, post-op complications, handoff, pain, and infection prevention.",
  dialysis: "Fluid shifts, access assessment, electrolytes, hemodynamic change, and emergency response.",
  primary_care: "Differential diagnosis, investigations, prevention, follow-up, and patient education.",
  np_practice: "Diagnostic reasoning, prescribing decisions, investigations, follow-up, and complex management.",
};

export const SIMULATION_CONTENT_TARGETS: SimulationCapabilityTarget[] = [
  { tier: "rn", minimumSimulations: 250, emphasis: ["NCLEX-RN", "NGN", "clinical judgment", "CAT readiness"] },
  { tier: "pn", minimumSimulations: 200, emphasis: ["REx-PN", "CPNRE", "safety", "practical nursing scope"] },
  { tier: "np", minimumSimulations: 200, emphasis: ["CNPLE", "LOFT", "diagnostic reasoning", "prescribing"] },
  { tier: "allied", minimumSimulations: 100, emphasis: ["profession-specific competencies", "team communication"] },
  { tier: "new_grad", minimumSimulations: 150, emphasis: ["transition to practice", "specialty readiness"] },
];

export function buildSimulationPracticeFrame(patientCase: Pick<PatientCase, "estimatedMinutes">, step: SimulationPracticeStep): SimulationPracticeFrame {
  return {
    timeHorizon: timeHorizonForMinutes(patientCase.estimatedMinutes),
    careCycle: CLINICAL_JUDGMENT_CARE_CYCLE,
    ngnFormats: NGN_SIMULATION_FORMATS,
    patientEvolutionSignals: derivePatientEvolutionSignals(step),
    requiredActions: requiredActionsForStep(step),
    documentationTasks: documentationTasksForStep(step),
    teamCommunicationPrompts: teamCommunicationForStep(step),
    handoffPrompts: handoffPromptsForStep(step),
    analyticsDimensions: SIMULATION_ANALYTICS_DIMENSIONS,
    adaptiveRemediationRoutes: remediationRoutesForDomain(step.cnpleDomain, step.question.family),
  };
}

export function consequenceNarrativeForDecision(trajectory: CaseStepConsequence["trajectory"]): string {
  switch (trajectory) {
    case "optimal":
      return "The patient improves or remains safely stabilized after the intervention.";
    case "acceptable":
      return "The patient remains safe, but additional reassessment or follow-up is still needed.";
    case "suboptimal":
      return "The patient risk increases because the decision delays or incompletely addresses the problem.";
    case "harmful":
      return "A critical safety event occurs or the patient deteriorates because the decision was unsafe.";
  }
}

export function scoreSimulationJudgmentDimensions(decisions: CaseDecisionRecord[]): Record<SimulationAnalyticsDimension, number> {
  const total = Math.max(1, decisions.length);
  const optimal = decisions.filter((decision) => decision.trajectory === "optimal").length;
  const safe = decisions.filter((decision) => decision.trajectory !== "harmful").length;
  const correct = decisions.filter((decision) => decision.isCorrect).length;
  const fastEnough = decisions.filter((decision) => (decision.dwellMs ?? 0) <= 90_000 || decision.trajectory === "optimal").length;
  const lowDebt = decisions.filter((decision) => (decision.trajectorySeverity ?? 0) <= 10).length;
  const followUpSafe = decisions.filter((decision) => decision.followUpAppropriateness !== "dangerous_delay").length;

  return {
    "Recognition Score": pct(correct, total),
    "Prioritization Score": pct(optimal + decisions.filter((decision) => decision.trajectory === "acceptable").length, total),
    "Intervention Score": pct(correct + optimal, total * 2),
    "Safety Score": pct(safe, total),
    "Communication Score": pct(followUpSafe, total),
    "Documentation Score": pct(lowDebt, total),
    "Clinical Judgment Score": pct(correct + safe + optimal, total * 3),
    "Decision Quality Score": pct(correct + fastEnough + lowDebt, total * 3),
  };
}

function timeHorizonForMinutes(minutes: number): SimulationTimeHorizon {
  if (minutes <= 15) return "15_min";
  if (minutes <= 30) return "30_min";
  if (minutes <= 60) return "60_min";
  return "multi_shift";
}

function derivePatientEvolutionSignals(step: SimulationPracticeStep): PatientEvolutionSignal[] {
  const signals: PatientEvolutionSignal[] = [
    signalFromClinicalUpdate(step.clinicalUpdate),
    ...step.vitals.filter(isAbnormalVital).slice(0, 4).map(signalFromVital),
    ...step.diagnosticArtifacts.slice(0, 4).map(signalFromDiagnostic),
  ];
  if (step.medicationChanges.length) {
    signals.push({
      label: "Medication orders or administration status changed",
      source: "medications",
      severity: "watch",
    });
  }
  return signals;
}

function signalFromClinicalUpdate(update: ClinicalUpdate): PatientEvolutionSignal {
  return {
    label: update.summary,
    source: /family|spouse|parent|caregiver/i.test(update.summary) ? "family" : "scenario",
    severity: update.direction === "critical" ? "critical" : update.direction === "worsening" ? "worsening" : update.direction === "stable" ? "watch" : "stable",
  };
}

function signalFromVital(vital: VitalReading): PatientEvolutionSignal {
  return {
    label: `${vital.label}: ${vital.value}${vital.unit ? ` ${vital.unit}` : ""}`,
    source: /oxygen|spo2|o2/i.test(vital.label) ? "oxygen" : "vitals",
    severity: vital.flag === "critical" ? "critical" : vital.flag ? "worsening" : "watch",
  };
}

function signalFromDiagnostic(artifact: DiagnosticArtifact): PatientEvolutionSignal {
  const type = artifact.type ?? "other";
  return {
    label: artifact.finding ?? artifact.interpretation ?? artifact.impression ?? artifact.label ?? artifact.name ?? "New diagnostic information",
    source: type === "ecg" ? "ecg" : type === "lab_panel" ? "labs" : type === "imaging" ? "imaging" : "orders",
    severity: artifact.isAbnormal ? "worsening" : "watch",
  };
}

function isAbnormalVital(vital: VitalReading): boolean {
  return Boolean(vital.flag) || /\b(o2|spo2|oxygen|pain|mental|loc)\b/i.test(vital.label);
}

function requiredActionsForStep(step: SimulationPracticeStep): ClinicalJudgmentAction[] {
  const actions = new Set<ClinicalJudgmentAction>(["assessment", "recognition", "prioritization", "documentation"]);
  if (step.clinicalUpdate.direction === "worsening" || step.clinicalUpdate.direction === "critical") {
    actions.add("intervention");
    actions.add("evaluation");
    actions.add("escalation");
  }
  if (/follow|reassess|monitor|evaluate/i.test(step.question.stem)) actions.add("evaluation");
  if (/refer|urgent|emerg|call|consult|rapid|escalat/i.test(step.question.stem)) actions.add("escalation");
  return CLINICAL_JUDGMENT_CARE_CYCLE.filter((action) => actions.has(action));
}

function documentationTasksForStep(step: SimulationPracticeStep): string[] {
  const tasks = ["Focused assessment findings", "Decision rationale", "Patient response and reassessment plan"];
  if (step.medicationChanges.length || /prescrib|medicat|dose|drug/i.test(step.question.family)) {
    tasks.push("Medication teaching, monitoring, and safety checks");
  }
  if (step.clinicalUpdate.direction === "critical" || step.clinicalUpdate.direction === "worsening") {
    tasks.push("SBAR escalation note and time-sensitive follow-up");
  }
  return tasks;
}

function teamCommunicationForStep(step: SimulationPracticeStep): string[] {
  const prompts = ["Communicate the priority cue and requested next step using SBAR."];
  if (/prescrib|medicat|dose|drug/i.test(step.question.family)) prompts.push("Clarify medication risk with pharmacy or prescriber before administration.");
  if (step.diagnosticArtifacts.some((artifact) => artifact.isAbnormal || artifact.type === "ecg")) prompts.push("Report critical diagnostics and anticipated intervention to the provider team.");
  if (/home|community|follow|screening|promotion/i.test(step.question.family)) prompts.push("Coordinate education, follow-up, and access barriers with the interprofessional team.");
  return prompts;
}

function handoffPromptsForStep(step: SimulationPracticeStep): string[] {
  return [
    `Current status: ${step.clinicalUpdate.summary}`,
    `Priority risk: ${step.clinicalUpdate.newFindings?.[0] ?? step.question.clinicalJudgmentFocus ?? "clinical judgment and safe next step"}`,
    "Next nurse should know: pending diagnostics, response to intervention, and escalation threshold.",
  ];
}

function remediationRoutesForDomain(domain: CnpleDomainSlug, family: string): SimulationPracticeFrame["adaptiveRemediationRoutes"] {
  const routes: SimulationPracticeFrame["adaptiveRemediationRoutes"] = [
    { surface: "lessons", reason: `Review ${domain.replace(/_/g, " ")} reasoning before the next simulation.` },
    { surface: "questions", reason: "Practice similar clinical judgment stems with immediate rationale feedback." },
    { surface: "flashcards", reason: "Reinforce recognition cues and safety thresholds with spaced recall." },
  ];
  if (/prescrib|medicat|dose|drug|stewardship/i.test(family)) {
    routes.push({ surface: "pharmacology", reason: "Medication decision errors should route to pharmacology and safety review." });
  }
  if (/respiratory|cardiac|chest|acute/i.test(family)) {
    routes.push({ surface: "ecg", reason: "Cardiorespiratory deterioration should route to ECG or rhythm-context review when relevant." });
  }
  if (/procedure|wound|catheter|transfusion|care/i.test(family)) {
    routes.push({ surface: "clinical_skills", reason: "Bedside action errors should route to clinical skills remediation." });
  }
  return routes;
}

function pct(numerator: number, denominator: number): number {
  return Math.max(0, Math.min(100, Math.round((numerator / Math.max(1, denominator)) * 100)));
}
