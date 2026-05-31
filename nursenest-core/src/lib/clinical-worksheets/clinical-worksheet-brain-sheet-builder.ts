export type WorksheetLearnerMode = "student" | "new-grad" | "rpn-lpn" | "rn" | "np";
export type WorksheetTemplate =
  | "student-clinical"
  | "traditional-brain"
  | "med-surg-report"
  | "icu"
  | "pediatric"
  | "mental-health"
  | "community"
  | "np-clinical";

export type WorksheetPatientInput = {
  id: string;
  roomNumber: string;
  age: string;
  diagnosis: string;
  codeStatus: string;
  allergies: string;
  medicalHistory: string;
  surgicalHistory: string;
  currentMedications: string;
  relevantLabs: string;
  vitalSigns: string;
  mobilityStatus: string;
  isolationPrecautions: string;
  diet: string;
  ivAccess: string;
  oxygenRequirements: string;
  monitoringRequirements: string;
  personalNotes: string;
};

export type WorksheetInput = {
  learnerMode: WorksheetLearnerMode;
  template: WorksheetTemplate;
  patients: WorksheetPatientInput[];
};

export type WorksheetPriority = "critical" | "high" | "moderate" | "routine";

export type WorksheetCard = {
  title: string;
  priority: WorksheetPriority;
  bullets: string[];
  rationale: string;
};

export type WorksheetTask = {
  time: string;
  label: string;
  priorityRank: number;
  rationale: string;
};

export type WorksheetPatientOutput = {
  patientId: string;
  roomNumber: string;
  snapshot: WorksheetCard;
  assessmentSections: Array<{ system: string; prompts: string[]; notePrompt: string }>;
  labTracker: Array<{ lab: string; normalRange: string; currentResult: string; trend: string; clinicalMeaning: string; abnormal: boolean }>;
  medicationOrganizer: Array<{ medication: string; why: string; nursingConsiderations: string[]; holdParameters: string[]; patientTeaching: string[] }>;
  tasks: WorksheetTask[];
  priorityAnalysis: WorksheetCard;
  reasoningPanel: WorksheetCard;
  sbar: { situation: string; background: string; assessment: string; recommendation: string };
  reportSheet: WorksheetCard;
  learnerModePanel: WorksheetCard;
  smartNotebookPrompts: string[];
  coachFeedback: WorksheetCard;
  integrationLinks: Array<{ label: string; href: string; rationale: string }>;
};

export type WorksheetOutput = {
  title: string;
  template: WorksheetTemplate;
  learnerMode: WorksheetLearnerMode;
  assignmentSummary: WorksheetCard;
  patients: WorksheetPatientOutput[];
  multiPatientAnalysis: WorksheetCard;
  monetization: { freeTier: string; paidTier: string };
};

type DiagnosisProfile = {
  match: string[];
  label: string;
  priorityConcerns: string[];
  safetyRisks: string[];
  likelyComplications: string[];
  priorityAssessments: string[];
  interventionsFirst: string[];
  instructorQuestions: string[];
  commonMistakes: string[];
  deteriorationRisk: number;
  medicationRisk: number;
  fallRisk: number;
};

const TEMPLATE_LABELS: Record<WorksheetTemplate, string> = {
  "student-clinical": "Student Clinical Worksheet",
  "traditional-brain": "Traditional Brain Sheet",
  "med-surg-report": "Med-Surg Report Sheet",
  icu: "ICU Worksheet",
  pediatric: "Pediatric Worksheet",
  "mental-health": "Mental Health Worksheet",
  community: "Community Nursing Worksheet",
  "np-clinical": "NP Clinical Worksheet",
};

const PROFILES: DiagnosisProfile[] = [
  {
    match: ["heart failure", "chf", "hf", "pulmonary edema"],
    label: "Heart Failure",
    priorityConcerns: ["oxygenation", "perfusion", "fluid overload", "renal function", "dysrhythmia risk"],
    safetyRisks: ["falls from diuresis or hypotension", "hypoxemia", "electrolyte-related dysrhythmia", "delayed escalation of pulmonary edema"],
    likelyComplications: ["pulmonary edema", "cardiogenic shock", "acute kidney injury", "atrial fibrillation or other dysrhythmia"],
    priorityAssessments: ["lung sounds and work of breathing", "SpO2 and oxygen requirement", "BP/HR/rhythm", "edema, daily weight, intake/output", "urine output and mentation"],
    interventionsFirst: ["position upright", "assess oxygenation and perfusion", "administer ordered diuretic/oxygen safely", "trend potassium and creatinine", "escalate worsening dyspnea or hypotension"],
    instructorQuestions: ["Why do crackles occur in heart failure?", "Which matters first: edema or falling SpO2?", "Why check potassium before/after diuresis?", "What would make you call the provider?"],
    commonMistakes: ["focusing on edema while missing respiratory decline", "forgetting renal and potassium monitoring", "documenting intake/output inaccurately"],
    deteriorationRisk: 86,
    medicationRisk: 82,
    fallRisk: 72,
  },
  {
    match: ["copd", "pneumonia", "asthma", "respiratory"],
    label: "Respiratory Compromise",
    priorityConcerns: ["work of breathing", "oxygenation", "airway clearance", "infection risk", "fatigue"],
    safetyRisks: ["respiratory failure", "hypoxemia", "sepsis", "falls with dyspnea", "missed mental status change"],
    likelyComplications: ["respiratory failure", "sepsis", "atelectasis", "delirium"],
    priorityAssessments: ["RR, SpO2, work of breathing", "breath sounds and cough/sputum", "temperature and infection cues", "mental status", "response to oxygen/bronchodilator/antibiotics"],
    interventionsFirst: ["position upright", "assess respiratory effort", "apply ordered oxygen", "administer respiratory meds safely", "escalate fatigue or rising oxygen needs"],
    instructorQuestions: ["Why does pneumonia cause hypoxemia?", "Why is work of breathing more important than one SpO2?", "What signs indicate respiratory failure?"],
    commonMistakes: ["charting only saturation", "missing new confusion", "not reassessing after inhaler/nebulizer"],
    deteriorationRisk: 88,
    medicationRisk: 62,
    fallRisk: 58,
  },
  {
    match: ["diabetes", "dka", "hyperglycemia", "hypoglycemia"],
    label: "Diabetes",
    priorityConcerns: ["glucose instability", "meal and insulin timing", "hydration", "infection", "skin and foot safety"],
    safetyRisks: ["hypoglycemia", "DKA/HHS", "falls from glucose change", "delayed wound healing"],
    likelyComplications: ["hypoglycemia", "DKA/HHS", "infection", "delayed wound healing"],
    priorityAssessments: ["blood glucose trend", "meal intake and nausea/vomiting", "mental status", "hydration", "skin/feet/wounds"],
    interventionsFirst: ["check glucose before insulin", "match rapid insulin to meal intake", "treat hypoglycemia per policy", "monitor potassium if DKA/insulin therapy", "teach symptoms and sick-day safety"],
    instructorQuestions: ["Why does insulin timing matter?", "What finding would make you hold/clarify insulin?", "Why does potassium matter in DKA?"],
    commonMistakes: ["giving rapid insulin without confirming meal safety", "missing hypoglycemia symptoms", "ignoring wound or infection risk"],
    deteriorationRisk: 70,
    medicationRisk: 90,
    fallRisk: 60,
  },
  {
    match: ["stroke", "tia", "cva", "neuro"],
    label: "Stroke / Neurologic Change",
    priorityConcerns: ["neurologic change", "airway and swallowing safety", "mobility/falls", "time of onset", "aspiration risk"],
    safetyRisks: ["aspiration", "falls", "worsening neurologic injury", "skin breakdown"],
    likelyComplications: ["aspiration pneumonia", "falls", "seizure", "increased intracranial pressure"],
    priorityAssessments: ["LOC, pupils, speech, facial droop", "strength and sensation", "swallowing safety", "glucose and oxygenation", "last-known-well"],
    interventionsFirst: ["protect airway", "hold oral intake if swallow unsafe", "perform focused neuro check", "escalate new deficits", "fall precautions"],
    instructorQuestions: ["Why is last-known-well important?", "Why check glucose for neuro changes?", "Why might oral meds be unsafe?"],
    commonMistakes: ["feeding before swallow safety", "not documenting onset time", "missing subtle neuro changes"],
    deteriorationRisk: 84,
    medicationRisk: 64,
    fallRisk: 88,
  },
];

const DEFAULT_PROFILE = PROFILES[0];

export function generateClinicalWorksheet(input: WorksheetInput): WorksheetOutput {
  const patients = input.patients.slice(0, 6).map((patient) => buildPatientOutput(patient, input));
  return {
    title: `${TEMPLATE_LABELS[input.template]} Builder`,
    template: input.template,
    learnerMode: input.learnerMode,
    assignmentSummary: buildAssignmentSummary(patients),
    patients,
    multiPatientAnalysis: buildMultiPatientAnalysis(patients),
    monetization: {
      freeTier: "Free tier: one patient worksheet and basic brain sheet.",
      paidTier: "Paid tier: multi-patient assignments, saved worksheets, PDF exports, AI coaching, and clinical reasoning support.",
    },
  };
}

export function formatClinicalWorksheetForCopy(output: WorksheetOutput): string {
  const lines = [output.title, "", "Assignment Summary", ...formatCard(output.assignmentSummary), ""];
  for (const patient of output.patients) {
    lines.push(`Room ${patient.roomNumber}`, ...formatCard(patient.snapshot), "");
    lines.push("Tasks");
    patient.tasks.forEach((task) => lines.push(`- ${task.time} [${task.priorityRank}] ${task.label}: ${task.rationale}`));
    lines.push("SBAR", `S: ${patient.sbar.situation}`, `B: ${patient.sbar.background}`, `A: ${patient.sbar.assessment}`, `R: ${patient.sbar.recommendation}`, "");
  }
  return lines.join("\n");
}

function buildPatientOutput(patient: WorksheetPatientInput, input: WorksheetInput): WorksheetPatientOutput {
  const profile = selectProfile(patient.diagnosis, patient.medicalHistory, patient.relevantLabs, patient.vitalSigns);
  const labs = parseLabs(patient.relevantLabs, profile);
  const meds = parseMedications(patient.currentMedications, profile);
  const risk = patientRiskScore(patient, profile);
  return {
    patientId: patient.id,
    roomNumber: patient.roomNumber || patient.id,
    snapshot: buildSnapshot(patient, profile, risk),
    assessmentSections: buildAssessmentSections(profile),
    labTracker: labs,
    medicationOrganizer: meds,
    tasks: buildTasks(patient, profile, input.template),
    priorityAnalysis: buildPriorityAnalysis(patient, profile, risk),
    reasoningPanel: buildReasoningPanel(profile),
    sbar: buildSbar(patient, profile),
    reportSheet: buildReportSheet(patient, profile),
    learnerModePanel: buildLearnerModePanel(input.learnerMode, profile),
    smartNotebookPrompts: buildNotebookPrompts(patient, profile),
    coachFeedback: buildCoachFeedback(patient, profile, labs, meds),
    integrationLinks: buildIntegrationLinks(profile),
  };
}

function selectProfile(...values: string[]): DiagnosisProfile {
  const text = values.join(" ").toLowerCase();
  return PROFILES.find((profile) => profile.match.some((needle) => text.includes(needle))) ?? DEFAULT_PROFILE;
}

function buildSnapshot(patient: WorksheetPatientInput, profile: DiagnosisProfile, risk: number): WorksheetCard {
  return {
    title: `Room ${patient.roomNumber || patient.id}: ${patient.age || "Patient"} with ${patient.diagnosis || profile.label}`,
    priority: risk >= 80 ? "critical" : risk >= 65 ? "high" : "moderate",
    bullets: [
      `Code status: ${patient.codeStatus || "verify on chart"}`,
      `Allergies: ${patient.allergies || "verify before meds"}`,
      `Priority concerns: ${profile.priorityConcerns.join(", ")}`,
      `Safety risks: ${profile.safetyRisks.slice(0, 3).join(", ")}`,
      `Mobility: ${patient.mobilityStatus || "assess baseline and assistance needs"}`,
      `Isolation: ${patient.isolationPrecautions || "verify precautions"}`,
      `Diet: ${patient.diet || "verify orders"}`,
      `IV access: ${patient.ivAccess || "verify patency/site"}`,
      `Oxygen: ${patient.oxygenRequirements || "verify room air/oxygen needs"}`,
      `Monitoring: ${patient.monitoringRequirements || profile.priorityAssessments.slice(0, 2).join(", ")}`,
    ],
    rationale: "The snapshot prioritizes information that changes safety, first assessment, medication decisions, or escalation.",
  };
}

function buildAssessmentSections(profile: DiagnosisProfile): WorksheetPatientOutput["assessmentSections"] {
  return [
    section("Neurological", ["LOC/orientation", "pupils if indicated", "new confusion or weakness"], "Document baseline and acute changes."),
    section("Respiratory", ["RR/work of breathing", "SpO2/oxygen device", "lung sounds/cough"], profile.priorityAssessments.includes("lung sounds and work of breathing") ? "High priority for this diagnosis." : "Trend against baseline."),
    section("Cardiovascular", ["BP/HR/rhythm", "perfusion", "edema/chest pain"], "Link circulation findings to perfusion and medication safety."),
    section("GI", ["diet tolerance", "nausea/vomiting", "bowel pattern"], "Watch hydration, nutrition, and medication tolerance."),
    section("GU", ["urine output", "catheter/continence", "renal labs if relevant"], "Urine output is a perfusion and renal safety cue."),
    section("Skin", ["wounds/incisions", "pressure areas", "drainage"], "Skin findings drive infection and mobility priorities."),
    section("Pain", ["location/score/quality", "intervention", "reassessment"], "Pain documentation requires reassessment."),
    section("Mobility", ["baseline", "assist level", "fall risk"], "Mobility changes workflow, falls, skin, and discharge planning."),
    section("Mental Status", ["mood/behavior", "safety", "communication"], "Mental status changes can signal hypoxia, infection, glucose, neuro change, or distress."),
  ];
}

function section(system: string, prompts: string[], notePrompt: string) {
  return { system, prompts, notePrompt };
}

function parseLabs(inputLabs: string, profile: DiagnosisProfile): WorksheetPatientOutput["labTracker"] {
  const entered = splitList(inputLabs);
  const labs = entered.length ? entered : profile.priorityConcerns.includes("fluid overload") ? ["BNP", "potassium", "creatinine"] : ["CBC", "electrolytes", "glucose"];
  return labs.slice(0, 8).map((lab) => {
    const normal = normalRange(lab);
    const abnormal = /low|high|critical|\d/.test(lab.toLowerCase()) && !/normal/i.test(lab);
    return {
      lab: labName(lab),
      normalRange: normal,
      currentResult: lab,
      trend: abnormal ? "Needs trend review" : "Enter current and previous value",
      clinicalMeaning: labMeaning(lab, profile),
      abnormal,
    };
  });
}

function parseMedications(inputMeds: string, profile: DiagnosisProfile): WorksheetPatientOutput["medicationOrganizer"] {
  const meds = splitList(inputMeds);
  const fallback = profile.label === "Heart Failure" ? ["furosemide", "metoprolol"] : profile.label === "Diabetes" ? ["insulin"] : ["scheduled medications"];
  return (meds.length ? meds : fallback).slice(0, 10).map((med) => medicationOrganizer(med, profile));
}

function buildTasks(patient: WorksheetPatientInput, profile: DiagnosisProfile, template: WorksheetTemplate): WorksheetTask[] {
  const criticalFirst = profile.priorityAssessments[0];
  const tasks: WorksheetTask[] = [
    task("0700", `Initial safety check, code status/allergies review, room ${patient.roomNumber || patient.id}`, 1, "Safety identifiers and code/allergy verification protect every later task."),
    task("0715", `Focused assessment: ${criticalFirst}`, 2, "First assessment targets the highest-risk deterioration pathway."),
    task("0800", "Medication pass with hold parameters and required pre-checks", 3, "Medication safety depends on allergies, vitals, labs, indication, and patient status."),
    task("0900", "Review labs, diagnostics, and pending orders", 4, "Labs and orders change priority and escalation decisions."),
    task("1000", `Patient education: ${profile.commonMistakes[0]}`, 6, "Teaching should target the most likely safety gap."),
    task("1200", "Reassessment and update report sheet", 5, "Reassessment confirms whether interventions changed the concerning findings."),
  ];
  if (template === "icu") tasks.unshift(task("0645", "Line/tube/drip verification and alarms review", 1, "ICU workflow starts with life-supporting devices and high-risk infusions."));
  if (patient.surgicalHistory.trim()) tasks.push(task("PRN", "Dressing/incision/drain check", 5, "Surgical history adds wound, infection, and bleeding priorities."));
  return tasks.sort((a, b) => a.priorityRank - b.priorityRank);
}

function buildPriorityAnalysis(patient: WorksheetPatientInput, profile: DiagnosisProfile, risk: number): WorksheetCard {
  return {
    title: "Priority Patient Analysis",
    priority: risk >= 80 ? "critical" : "high",
    bullets: [
      `Deterioration risk: ${profile.deteriorationRisk}/100 because of ${profile.priorityConcerns.slice(0, 3).join(", ")}.`,
      `Fall risk: ${profile.fallRisk}/100; mobility status: ${patient.mobilityStatus || "not entered"}.`,
      `Medication risk: ${profile.medicationRisk}/100; verify allergies, vitals, labs, hold parameters, and response.`,
      `Most time-sensitive care: ${profile.interventionsFirst[0]}.`,
    ],
    rationale: "Priority analysis identifies the patient most likely to deteriorate or require time-sensitive nursing action.",
  };
}

function buildReasoningPanel(profile: DiagnosisProfile): WorksheetCard {
  return {
    title: "Clinical Reasoning Panel",
    priority: "high",
    bullets: [
      `What should concern the nurse: ${profile.priorityConcerns.join(", ")}.`,
      `Escalate: ${profile.safetyRisks.slice(0, 3).join(", ")}.`,
      `Likely complications: ${profile.likelyComplications.join(", ")}.`,
      `Most important assessments: ${profile.priorityAssessments.slice(0, 4).join(", ")}.`,
      `Interventions first: ${profile.interventionsFirst.slice(0, 3).join(", ")}.`,
    ],
    rationale: "This panel turns worksheet data into nursing judgment rather than passive information collection.",
  };
}

function buildSbar(patient: WorksheetPatientInput, profile: DiagnosisProfile): WorksheetPatientOutput["sbar"] {
  return {
    situation: `Room ${patient.roomNumber || patient.id}, ${patient.age || "patient"} with ${patient.diagnosis || profile.label}; current concern is ${profile.priorityConcerns[0]}.`,
    background: `History: ${patient.medicalHistory || "review chart"}. Allergies/code status: ${patient.allergies || "verify"} / ${patient.codeStatus || "verify"}.`,
    assessment: `Vitals: ${patient.vitalSigns || "not entered"}. Priority assessments: ${profile.priorityAssessments.slice(0, 3).join(", ")}.`,
    recommendation: `Recommend timely reassessment/escalation if ${profile.safetyRisks.slice(0, 2).join(" or ")} occurs.`,
  };
}

function buildReportSheet(patient: WorksheetPatientInput, profile: DiagnosisProfile): WorksheetCard {
  return {
    title: "Shift Handoff Report Template",
    priority: "moderate",
    bullets: [
      `Patient summary: Room ${patient.roomNumber || patient.id}, ${patient.age || "age not entered"}, ${patient.diagnosis || profile.label}.`,
      `Events during shift: document assessment changes, meds, procedures, education, and patient response.`,
      `Outstanding tasks: labs, diagnostics, wound/line care, education, discharge planning.`,
      `Pending diagnostics: ${patient.relevantLabs || "verify pending labs/diagnostics"}.`,
      `Concerns/recommendations: ${profile.safetyRisks.slice(0, 3).join(", ")}.`,
    ],
    rationale: "Handoff should communicate what changed, what remains, and what could become unsafe.",
  };
}

function buildLearnerModePanel(mode: WorksheetLearnerMode, profile: DiagnosisProfile): WorksheetCard {
  if (mode === "np") {
    return card("NP Mode", "high", ["Diagnostic considerations", "Differential diagnoses", "Follow-up planning", "Advanced assessment considerations", ...profile.instructorQuestions.slice(0, 2)], "NP worksheets add diagnostic and follow-up reasoning.");
  }
  if (mode === "new-grad") {
    return card("New Grad Mode", "high", ["Time management coaching", "Delegation suggestions", "Escalation triggers", "Clinical prioritization coaching", ...profile.interventionsFirst.slice(0, 2)], "New graduate worksheets emphasize workflow and escalation.");
  }
  return card("Student Mode", "moderate", ["Instructor questions to expect", ...profile.instructorQuestions, "Pathophysiology review", "Medication review", ...profile.commonMistakes], "Student worksheets teach reasoning and clinical preparation.");
}

function buildNotebookPrompts(patient: WorksheetPatientInput, profile: DiagnosisProfile): string[] {
  return [
    `Clinical note for ${patient.diagnosis || profile.label}: what cue changed your priority today?`,
    `Personal learning point: explain one medication or lab tied to ${profile.label}.`,
    `Instructor feedback: what did your instructor ask about ${profile.priorityConcerns[0]}?`,
    `Question to review later: what would require escalation for room ${patient.roomNumber || patient.id}?`,
  ];
}

function buildCoachFeedback(
  patient: WorksheetPatientInput,
  profile: DiagnosisProfile,
  labs: WorksheetPatientOutput["labTracker"],
  meds: WorksheetPatientOutput["medicationOrganizer"],
): WorksheetCard {
  const missing: string[] = [];
  if (!patient.codeStatus.trim()) missing.push("code status");
  if (!patient.allergies.trim()) missing.push("allergies");
  if (!patient.vitalSigns.trim()) missing.push("vital signs");
  if (!patient.currentMedications.trim()) missing.push("medications");
  if (!patient.relevantLabs.trim()) missing.push("labs");
  return {
    title: "AI Clinical Coach Feedback",
    priority: missing.length >= 3 ? "high" : "moderate",
    bullets: [
      missing.length ? `Missing safety data: ${missing.join(", ")}.` : "Core safety identifiers are present.",
      `Prioritization: first focus should be ${profile.priorityAssessments[0]}.`,
      `Medication considerations: ${meds.slice(0, 2).map((med) => med.medication).join(", ") || "verify medication list"}.`,
      `Lab considerations: ${labs.slice(0, 2).map((lab) => lab.lab).join(", ") || "verify labs"}.`,
      `Documentation gap to avoid: ${profile.commonMistakes[0]}.`,
    ],
    rationale: "The coach reviews whether the brain sheet has enough information to support safe prioritization and handoff.",
  };
}

function buildIntegrationLinks(profile: DiagnosisProfile): WorksheetPatientOutput["integrationLinks"] {
  return [
    { label: "Care Plans", href: "/app/clinical-assignments", rationale: `Turn ${profile.label} priorities into a care plan.` },
    { label: "Concept Maps", href: "/app/clinical-assignments", rationale: "Map disease, cues, labs, medications, and complications." },
    { label: "Clinical Skills", href: "/app/clinical-skills", rationale: "Review likely hands-on skills before clinical." },
    { label: "Labs", href: "/app/labs", rationale: "Practice interpreting abnormal values." },
    { label: "Pharmacology", href: "/app/pharmacology", rationale: "Review medication indications and nursing considerations." },
    { label: "ECG", href: "/app/ecg", rationale: "Use when rhythm, perfusion, or cardiac monitoring matters." },
    { label: "Simulations", href: "/app/clinical-scenarios", rationale: "Practice responding to deterioration." },
    { label: "Question Bank", href: "/app/questions", rationale: "Convert weak areas into exam-style practice." },
  ];
}

function buildAssignmentSummary(patients: WorksheetPatientOutput[]): WorksheetCard {
  return {
    title: `${patients.length}-Patient Assignment Overview`,
    priority: patients.some((patient) => patient.priorityAnalysis.priority === "critical") ? "critical" : "high",
    bullets: patients.map((patient) => `Room ${patient.roomNumber}: ${patient.snapshot.title}; first priority: ${patient.tasks[0]?.label ?? "safety check"}.`),
    rationale: "The assignment overview helps learners see the whole shift before getting lost in one patient worksheet.",
  };
}

function buildMultiPatientAnalysis(patients: WorksheetPatientOutput[]): WorksheetCard {
  const mostUnstable = [...patients].sort(prioritySort)[0];
  const medRisk = [...patients].sort((a, b) => riskFromPriority(b.priorityAnalysis.priority) - riskFromPriority(a.priorityAnalysis.priority))[0];
  return {
    title: "Multi-Patient Priority Analysis",
    priority: mostUnstable?.priorityAnalysis.priority ?? "moderate",
    bullets: [
      `Most unstable patient: room ${mostUnstable?.roomNumber ?? "n/a"} because ${mostUnstable?.priorityAnalysis.bullets[0] ?? "risk not available"}.`,
      `Highest medication risk: room ${medRisk?.roomNumber ?? "n/a"}; verify allergies, labs, vitals, and hold parameters before pass.`,
      `Most time-sensitive care: complete first assessments before routine documentation when deterioration risk is present.`,
      `Workflow habit: safety check -> focused assessment -> med/lab review -> task clustering -> reassessment -> handoff update.`,
    ],
    rationale: "Multi-patient view teaches assignment-level prioritization, not only single-patient data collection.",
  };
}

function patientRiskScore(patient: WorksheetPatientInput, profile: DiagnosisProfile): number {
  let score = Math.round((profile.deteriorationRisk + profile.medicationRisk + profile.fallRisk) / 3);
  if (/oxygen|o2|spo2|hypotension|tachy|fever|confusion/i.test(`${patient.vitalSigns} ${patient.monitoringRequirements}`)) score += 8;
  if (/nkda|none/i.test(patient.allergies) || patient.allergies.trim()) score -= 2;
  return Math.max(0, Math.min(100, score));
}

function normalRange(lab: string): string {
  const text = lab.toLowerCase();
  if (text.includes("potassium") || /\bk\b/.test(text)) return "3.5-5.0 mmol/L";
  if (text.includes("sodium") || /\bna\b/.test(text)) return "135-145 mmol/L";
  if (text.includes("creatinine")) return "varies by age/sex; trend with eGFR";
  if (text.includes("glucose")) return "approx. 4-7 fasting or facility target";
  if (text.includes("wbc")) return "4.5-11.0 x10^9/L";
  if (text.includes("bnp")) return "assay-specific; elevated supports cardiac stretch";
  return "verify facility range";
}

function labMeaning(lab: string, profile: DiagnosisProfile): string {
  const text = lab.toLowerCase();
  if (text.includes("potassium") || /\bk\b/.test(text)) return "Affects dysrhythmia risk and medication safety.";
  if (text.includes("creatinine")) return "Reflects renal function, perfusion, and medication dosing risk.";
  if (text.includes("glucose")) return "Links to insulin timing, mental status, infection stress, and safety.";
  if (text.includes("bnp")) return "Supports heart failure/volume overload interpretation in clinical context.";
  return `Interpret in relation to ${profile.label}, assessment findings, and nursing action.`;
}

function labName(lab: string): string {
  return lab.split(/\s|=/)[0] || lab;
}

function medicationOrganizer(medication: string, profile: DiagnosisProfile): WorksheetPatientOutput["medicationOrganizer"][number] {
  const text = medication.toLowerCase();
  if (/furosemide|lasix/.test(text)) {
    return med(medication, "Fluid overload/heart failure", ["Monitor BP, urine output, daily weight, potassium, creatinine"], ["Hypotension, severe hypokalemia, unsafe renal trend per policy/order"], ["Report dizziness, daily weight changes, worsening dyspnea"]);
  }
  if (/metoprolol|beta/.test(text)) {
    return med(medication, "Rate/BP control and reduced cardiac workload", ["Check HR and BP before giving", "Watch bradycardia, hypotension, fatigue"], ["Bradycardia or hypotension per order/policy"], ["Do not stop abruptly; report dizziness or shortness of breath"]);
  }
  if (/insulin/.test(text)) {
    return med(medication, "Glucose control", ["Check glucose and meal status", "Monitor hypoglycemia"], ["Low glucose, no meal availability, or unsafe order mismatch per policy"], ["Hypoglycemia symptoms and treatment"]);
  }
  return med(medication, `Treats or supports ${profile.label}`, ["Verify indication, allergies, dose, route, relevant labs/vitals"], ["Hold/clarify when assessment, labs, or parameters are unsafe"], ["Purpose, major side effects, when to seek help"]);
}

function med(medication: string, why: string, nursingConsiderations: string[], holdParameters: string[], patientTeaching: string[]) {
  return { medication, why, nursingConsiderations, holdParameters, patientTeaching };
}

function splitList(value: string): string[] {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function task(time: string, label: string, priorityRank: number, rationale: string): WorksheetTask {
  return { time, label, priorityRank, rationale };
}

function card(title: string, priority: WorksheetPriority, bullets: string[], rationale: string): WorksheetCard {
  return { title, priority, bullets, rationale };
}

function prioritySort(a: WorksheetPatientOutput, b: WorksheetPatientOutput): number {
  return riskFromPriority(b.priorityAnalysis.priority) - riskFromPriority(a.priorityAnalysis.priority);
}

function riskFromPriority(priority: WorksheetPriority): number {
  if (priority === "critical") return 4;
  if (priority === "high") return 3;
  if (priority === "moderate") return 2;
  return 1;
}

function formatCard(card: WorksheetCard): string[] {
  return [card.title, `Rationale: ${card.rationale}`, ...card.bullets.map((bullet) => `- ${bullet}`)];
}
