export type ClinicalAssignmentRole = "student" | "new-grad" | "rpn-lpn" | "rn" | "np";

export type ClinicalAssignmentSetting =
  | "medical-surgical"
  | "icu"
  | "emergency"
  | "pediatrics"
  | "mental-health"
  | "community"
  | "maternal-child"
  | "long-term-care";

export type ClinicalAssignmentModuleId =
  | "care-plan"
  | "concept-map"
  | "medication-card"
  | "disease-worksheet"
  | "sbar"
  | "clinical-prep"
  | "reflection";

export type ClinicalAssignmentInput = {
  role: ClinicalAssignmentRole;
  setting: ClinicalAssignmentSetting;
  patientProfile: {
    age: string;
    sex: string;
    weight: string;
    diagnosis: string;
    secondaryDiagnoses: string;
    surgicalHistory: string;
    medicalHistory: string;
    currentMedications: string;
    allergies: string;
  };
  assessmentData: {
    vitalSigns: string;
    laboratoryValues: string;
    symptoms: string;
    physicalAssessmentFindings: string;
    diagnosticTests: string;
    imagingFindings: string;
  };
};

export type AssignmentPriority = "critical" | "warning" | "stable" | "educational";

export type AssignmentNode = {
  id: string;
  title: string;
  category:
    | "patient"
    | "pathophysiology"
    | "assessment"
    | "lab"
    | "medication"
    | "diagnosis"
    | "priority"
    | "complication"
    | "ncjmm"
    | "education";
  priority: AssignmentPriority;
  summary: string;
  details: string[];
  rationale: string;
};

export type AssignmentRelationship = {
  from: string;
  to: string;
  label: string;
  rationale: string;
  priority: AssignmentPriority;
};

export type AssignmentSection = {
  id: string;
  title: string;
  rationale: string;
  items: Array<{
    label: string;
    value: string;
    interpretation?: string;
    priority?: AssignmentPriority;
    rationale?: string;
  }>;
};

export type ClinicalAssignmentOutput = {
  moduleId: ClinicalAssignmentModuleId;
  title: string;
  patientSummary: string;
  reasoningSummary: string;
  printableTitle: string;
  nodes: AssignmentNode[];
  relationships: AssignmentRelationship[];
  sections: AssignmentSection[];
  examPrep: {
    nclexPearls: string[];
    rexPnPearls: string[];
    priorityActions: string[];
    safetyAlerts: string[];
    commonMistakes: string[];
  };
  learnerChallenge: {
    prompts: string[];
    answerKey: string[];
    scoringGuide: string[];
  };
  qualityFlags: string[];
};

type ClinicalSignal =
  | "oxygenation"
  | "perfusion"
  | "infection"
  | "fluid"
  | "glucose"
  | "neuro"
  | "pain"
  | "safety";

type ConditionProfile = {
  match: string[];
  label: string;
  corePathway: string[];
  complications: Array<{ title: string; likelihood: string; severity: AssignmentPriority; warningSigns: string[]; response: string }>;
  nursingDiagnoses: Array<{ priority: "High Priority" | "Moderate Priority" | "Lower Priority"; diagnosis: string; rationale: string }>;
  pearls: string[];
};

const MODULE_TITLES: Record<ClinicalAssignmentModuleId, string> = {
  "care-plan": "Care Plan Builder",
  "concept-map": "Concept Map Builder",
  "medication-card": "Medication Card Generator",
  "disease-worksheet": "Disease Process Worksheet Generator",
  sbar: "SBAR Builder",
  "clinical-prep": "Clinical Preparation Sheet Generator",
  reflection: "Clinical Reflection Assistant",
};

const SETTING_LABELS: Record<ClinicalAssignmentSetting, string> = {
  "medical-surgical": "medical-surgical",
  icu: "ICU",
  emergency: "emergency",
  pediatrics: "pediatrics",
  "mental-health": "mental health",
  community: "community",
  "maternal-child": "maternal-child",
  "long-term-care": "long-term care",
};

const CONDITION_PROFILES: ConditionProfile[] = [
  {
    match: ["heart failure", "chf", "hf", "pulmonary edema"],
    label: "Heart Failure",
    corePathway: [
      "Impaired ventricular filling or contractility",
      "Reduced forward cardiac output",
      "Neurohormonal compensation and fluid retention",
      "Pulmonary or systemic congestion",
      "Dyspnea, crackles, edema, fatigue, activity intolerance",
    ],
    complications: [
      {
        title: "Pulmonary edema",
        likelihood: "High when oxygen needs, crackles, orthopnea, or rapid weight gain are present.",
        severity: "critical",
        warningSigns: ["increasing dyspnea", "pink frothy sputum", "new hypoxemia", "coarse crackles"],
        response: "Raise head of bed, apply ordered oxygen, reassess lung sounds and saturation, prepare diuretic therapy as ordered, and escalate promptly.",
      },
      {
        title: "Renal hypoperfusion",
        likelihood: "Moderate when creatinine rises, urine output falls, or hypotension develops.",
        severity: "warning",
        warningSigns: ["low urine output", "rising creatinine", "worsening hypotension"],
        response: "Trend intake/output, renal labs, blood pressure, and medication effects; escalate worsening perfusion.",
      },
      {
        title: "Dysrhythmia",
        likelihood: "Moderate with electrolyte shifts, digoxin use, ischemia, or decompensation.",
        severity: "critical",
        warningSigns: ["palpitations", "syncope", "new irregular pulse", "potassium abnormality"],
        response: "Assess pulse quality, obtain or review ECG/telemetry as available, check potassium and magnesium, and escalate unstable rhythm.",
      },
    ],
    nursingDiagnoses: [
      {
        priority: "High Priority",
        diagnosis: "Decreased Cardiac Output",
        rationale: "Perfusion is threatened when the heart cannot meet metabolic demand; mentation, urine output, blood pressure, and fatigue become priority cues.",
      },
      {
        priority: "High Priority",
        diagnosis: "Impaired Gas Exchange",
        rationale: "Pulmonary congestion interferes with oxygen diffusion, so respiratory status can deteriorate before the learner notices edema or weight trends.",
      },
      {
        priority: "Moderate Priority",
        diagnosis: "Excess Fluid Volume",
        rationale: "Fluid retention drives congestion, medication needs, activity intolerance, and discharge teaching priorities.",
      },
      {
        priority: "Lower Priority",
        diagnosis: "Activity Intolerance",
        rationale: "Fatigue matters, but it follows immediate oxygenation and perfusion threats.",
      },
    ],
    pearls: [
      "In heart failure, increasing oxygen need plus crackles is more urgent than edema alone.",
      "Daily weight trends can reveal fluid retention before the patient feels dramatically worse.",
      "Diuresis improves congestion but can create potassium and renal perfusion risks.",
    ],
  },
  {
    match: ["pneumonia", "copd", "asthma", "respiratory failure"],
    label: "Respiratory Compromise",
    corePathway: [
      "Airway inflammation, obstruction, infection, or alveolar fluid",
      "Ventilation-perfusion mismatch",
      "Hypoxemia or impaired ventilation",
      "Increased work of breathing",
      "Dyspnea, abnormal breath sounds, fatigue, altered mental status",
    ],
    complications: [
      {
        title: "Acute respiratory failure",
        likelihood: "High when respiratory rate rises, oxygen needs increase, or mental status changes.",
        severity: "critical",
        warningSigns: ["tripod positioning", "silent chest", "cyanosis", "new confusion"],
        response: "Prioritize airway and breathing assessment, apply ordered oxygen, reduce exertion, and escalate for respiratory support.",
      },
      {
        title: "Sepsis",
        likelihood: "Moderate to high with fever, hypotension, high WBC, lactate elevation, or pneumonia source.",
        severity: "critical",
        warningSigns: ["hypotension", "tachycardia", "rising lactate", "decreased urine output"],
        response: "Trend perfusion cues, collect ordered diagnostics, administer prescribed antimicrobials promptly, and escalate shock signs.",
      },
    ],
    nursingDiagnoses: [
      {
        priority: "High Priority",
        diagnosis: "Impaired Gas Exchange",
        rationale: "Breathing is prioritized because oxygenation and ventilation can deteriorate rapidly.",
      },
      {
        priority: "High Priority",
        diagnosis: "Ineffective Airway Clearance",
        rationale: "Secretions, bronchospasm, or fatigue can prevent effective ventilation.",
      },
      {
        priority: "Moderate Priority",
        diagnosis: "Activity Intolerance",
        rationale: "Exertion increases oxygen demand and may reveal worsening respiratory reserve.",
      },
    ],
    pearls: [
      "A normal saturation does not cancel concern when work of breathing is increasing.",
      "New confusion in respiratory illness can be an oxygenation or ventilation cue.",
      "Breathing priority is not only saturation; it includes rate, effort, lung sounds, and fatigue.",
    ],
  },
  {
    match: ["sepsis", "septic", "infection", "cellulitis", "uti"],
    label: "Sepsis Risk",
    corePathway: [
      "Infection triggers systemic inflammatory response",
      "Vasodilation and capillary leak",
      "Relative hypovolemia and poor tissue perfusion",
      "Cellular hypoxia and organ dysfunction",
      "Hypotension, tachycardia, altered mentation, oliguria, elevated lactate",
    ],
    complications: [
      {
        title: "Septic shock",
        likelihood: "High when hypotension, lactate elevation, altered mentation, or low urine output appears.",
        severity: "critical",
        warningSigns: ["MAP decline", "mottled skin", "confusion", "oliguria"],
        response: "Escalate immediately, support oxygenation and perfusion, obtain ordered cultures/labs, and administer time-sensitive prescribed therapy.",
      },
      {
        title: "Acute kidney injury",
        likelihood: "Moderate with hypotension, nephrotoxic medications, dehydration, or rising creatinine.",
        severity: "warning",
        warningSigns: ["low urine output", "rising creatinine", "fluid overload"],
        response: "Trend urine output and renal labs, avoid delays in escalation, and monitor medication safety.",
      },
    ],
    nursingDiagnoses: [
      {
        priority: "High Priority",
        diagnosis: "Ineffective Tissue Perfusion",
        rationale: "Sepsis threatens circulation and cellular oxygen delivery before organ dysfunction becomes obvious.",
      },
      {
        priority: "High Priority",
        diagnosis: "Risk For Shock",
        rationale: "Rapid escalation is necessary when infection cues combine with hypotension, lactate, or mentation changes.",
      },
      {
        priority: "Moderate Priority",
        diagnosis: "Hyperthermia",
        rationale: "Fever increases metabolic demand and supports infection severity assessment.",
      },
    ],
    pearls: [
      "Sepsis is a pattern problem: infection plus perfusion change is more important than fever alone.",
      "Altered mentation and low urine output are organ perfusion cues until proven otherwise.",
      "Do not wait for every lab before escalating a deteriorating infectious picture.",
    ],
  },
  {
    match: ["stroke", "tia", "seizure", "altered mental", "confusion"],
    label: "Neurologic Change",
    corePathway: [
      "Altered cerebral perfusion or abnormal neurologic activity",
      "Impaired neuronal oxygen or glucose delivery",
      "Focal or global neurologic dysfunction",
      "Safety, airway, swallowing, and mobility risks",
      "Weakness, speech change, confusion, seizure, abnormal level of consciousness",
    ],
    complications: [
      {
        title: "Airway compromise or aspiration",
        likelihood: "Moderate to high when level of consciousness or swallowing is impaired.",
        severity: "critical",
        warningSigns: ["drooling", "wet voice", "decreased LOC", "coughing with intake"],
        response: "Protect airway, hold oral intake when unsafe, position appropriately, and escalate new neurologic decline.",
      },
      {
        title: "Worsening neurologic injury",
        likelihood: "High with new focal deficits, severe headache, seizure, or declining consciousness.",
        severity: "critical",
        warningSigns: ["new weakness", "pupil change", "seizure", "worsening confusion"],
        response: "Determine last known well, perform focused neurologic assessment, check glucose/oxygenation, and activate local escalation pathway.",
      },
    ],
    nursingDiagnoses: [
      {
        priority: "High Priority",
        diagnosis: "Ineffective Cerebral Tissue Perfusion",
        rationale: "Neurologic change is time-sensitive and requires rapid cue recognition.",
      },
      {
        priority: "High Priority",
        diagnosis: "Risk For Aspiration",
        rationale: "Swallowing and airway protection can be impaired even when the patient appears awake.",
      },
      {
        priority: "Moderate Priority",
        diagnosis: "Impaired Physical Mobility",
        rationale: "Mobility deficits drive falls, skin risk, and discharge planning.",
      },
    ],
    pearls: [
      "With new neurologic signs, time of onset is clinical data, not a documentation detail.",
      "Check glucose and oxygenation because reversible problems can mimic or worsen neurologic deficits.",
      "Swallowing safety comes before routine oral medications or food.",
    ],
  },
];

const LAB_RANGES: Record<string, { aliases: string[]; normal: string; low?: number; high?: number; unit: string; concern: string }> = {
  wbc: { aliases: ["wbc", "white blood"], normal: "4.5-11.0", low: 4.5, high: 11, unit: "x10^9/L", concern: "infection, inflammation, immune suppression, or treatment response" },
  lactate: { aliases: ["lactate"], normal: "<2.0", high: 2, unit: "mmol/L", concern: "tissue hypoperfusion or sepsis risk" },
  potassium: { aliases: ["k", "potassium"], normal: "3.5-5.0", low: 3.5, high: 5, unit: "mmol/L", concern: "dysrhythmia and medication safety" },
  creatinine: { aliases: ["creatinine", "cr"], normal: "facility-specific, often 45-110", high: 110, unit: "umol/L", concern: "renal perfusion, renal injury, and medication dosing" },
  glucose: { aliases: ["glucose", "blood sugar"], normal: "4-7 fasting", low: 4, high: 10, unit: "mmol/L", concern: "hypoglycemia, hyperglycemia, infection stress, or medication mismatch" },
  bnp: { aliases: ["bnp"], normal: "varies by assay; higher values support cardiac stretch", high: 100, unit: "pg/mL", concern: "heart failure severity and volume overload" },
  troponin: { aliases: ["troponin", "trop"], normal: "below assay cutoff", high: 0.04, unit: "ng/mL", concern: "myocardial injury or demand ischemia" },
  hemoglobin: { aliases: ["hgb", "hemoglobin"], normal: "approx. 120-160", low: 120, unit: "g/L", concern: "oxygen-carrying capacity and bleeding risk" },
  sodium: { aliases: ["na", "sodium"], normal: "135-145", low: 135, high: 145, unit: "mmol/L", concern: "fluid balance and neurologic safety" },
};

const MEDICATION_PROFILES: Record<string, { match: string[]; className: string; expectedEffect: string; sideEffects: string[]; monitoring: string[]; nursingConsiderations: string[] }> = {
  furosemide: {
    match: ["furosemide", "lasix"],
    className: "loop diuretic",
    expectedEffect: "reduces fluid overload by increasing sodium and water excretion",
    sideEffects: ["hypokalemia", "dehydration", "hypotension", "renal stress"],
    monitoring: ["blood pressure", "urine output", "daily weight", "potassium", "creatinine"],
    nursingConsiderations: ["assess lung sounds and edema before and after therapy", "watch for dizziness and falls", "report low potassium or worsening renal function"],
  },
  metoprolol: {
    match: ["metoprolol", "atenolol", "bisoprolol"],
    className: "beta blocker",
    expectedEffect: "reduces heart rate and myocardial workload",
    sideEffects: ["bradycardia", "hypotension", "fatigue", "bronchospasm risk in susceptible patients"],
    monitoring: ["heart rate", "blood pressure", "dizziness", "fatigue", "wheezing"],
    nursingConsiderations: ["check pulse and blood pressure before administration", "use caution with symptomatic bradycardia", "teach not to stop abruptly without prescriber guidance"],
  },
  insulin: {
    match: ["insulin", "glargine", "lispro", "aspart", "regular insulin"],
    className: "antidiabetic",
    expectedEffect: "moves glucose into cells and lowers blood glucose",
    sideEffects: ["hypoglycemia", "weight gain", "hypokalemia with high-dose therapy"],
    monitoring: ["blood glucose", "meal intake", "signs of hypoglycemia", "potassium when clinically indicated"],
    nursingConsiderations: ["match rapid-acting insulin to meals", "keep hypoglycemia treatment available", "hold or clarify doses when intake is unsafe or glucose is low per policy"],
  },
  ceftriaxone: {
    match: ["ceftriaxone", "cephalexin", "piperacillin", "vancomycin", "amoxicillin", "azithromycin"],
    className: "antimicrobial",
    expectedEffect: "treats suspected or confirmed bacterial infection",
    sideEffects: ["allergic reaction", "diarrhea", "C. difficile risk", "renal or drug-specific toxicity"],
    monitoring: ["temperature", "WBC", "cultures", "allergy history", "clinical response"],
    nursingConsiderations: ["verify allergy history", "administer on schedule", "monitor for rash, diarrhea, and worsening infection signs"],
  },
  salbutamol: {
    match: ["salbutamol", "albuterol", "ventolin", "ipratropium", "tiotropium"],
    className: "bronchodilator",
    expectedEffect: "opens airways and reduces bronchospasm",
    sideEffects: ["tachycardia", "tremor", "palpitations", "dry mouth depending on drug"],
    monitoring: ["work of breathing", "wheezing", "oxygen saturation", "heart rate"],
    nursingConsiderations: ["assess respiratory response after administration", "teach inhaler technique", "escalate poor response or worsening respiratory effort"],
  },
};

export function generateClinicalAssignment(input: ClinicalAssignmentInput, moduleId: ClinicalAssignmentModuleId): ClinicalAssignmentOutput {
  const context = buildContext(input);
  const profile = selectConditionProfile(context);
  const signals = detectClinicalSignals(context, profile);
  const labs = parseLabs(input.assessmentData.laboratoryValues);
  const medications = parseMedications(input.patientProfile.currentMedications);
  const nodes = buildNodes(input, profile, signals, labs, medications);
  const relationships = buildRelationships(profile, signals, labs, medications);
  const sections = buildSections(input, moduleId, profile, signals, labs, medications);
  const qualityFlags = buildQualityFlags(input, profile, labs, relationships);

  return {
    moduleId,
    title: MODULE_TITLES[moduleId],
    printableTitle: `${MODULE_TITLES[moduleId]} - ${profile.label}`,
    patientSummary: buildPatientSummary(input, profile, signals),
    reasoningSummary: buildReasoningSummary(input, profile, signals),
    nodes,
    relationships,
    sections,
    examPrep: buildExamPrep(profile, signals, input.role),
    learnerChallenge: buildLearnerChallenge(profile, labs, medications),
    qualityFlags,
  };
}

export function formatClinicalAssignmentForCopy(output: ClinicalAssignmentOutput): string {
  const lines = [output.printableTitle, "", "Patient Summary", output.patientSummary, "", "Clinical Reasoning", output.reasoningSummary, ""];
  for (const section of output.sections) {
    lines.push(section.title);
    lines.push(section.rationale);
    for (const item of section.items) {
      lines.push(`- ${item.label}: ${item.value}`);
      if (item.interpretation) lines.push(`  Interpretation: ${item.interpretation}`);
      if (item.rationale) lines.push(`  Rationale: ${item.rationale}`);
    }
    lines.push("");
  }
  lines.push("Concept Relationships");
  for (const rel of output.relationships) {
    lines.push(`- ${nodeTitle(output.nodes, rel.from)} -> ${nodeTitle(output.nodes, rel.to)}: ${rel.rationale}`);
  }
  return lines.join("\n");
}

function buildContext(input: ClinicalAssignmentInput) {
  const raw = [
    input.patientProfile.diagnosis,
    input.patientProfile.secondaryDiagnoses,
    input.patientProfile.surgicalHistory,
    input.patientProfile.medicalHistory,
    input.patientProfile.currentMedications,
    input.assessmentData.vitalSigns,
    input.assessmentData.laboratoryValues,
    input.assessmentData.symptoms,
    input.assessmentData.physicalAssessmentFindings,
    input.assessmentData.diagnosticTests,
    input.assessmentData.imagingFindings,
  ]
    .filter(Boolean)
    .join(" ");
  return { raw, normalized: raw.toLowerCase() };
}

function selectConditionProfile(context: ReturnType<typeof buildContext>): ConditionProfile {
  return CONDITION_PROFILES.find((profile) => profile.match.some((needle) => context.normalized.includes(needle))) ?? CONDITION_PROFILES[0];
}

function detectClinicalSignals(context: ReturnType<typeof buildContext>, profile: ConditionProfile): ClinicalSignal[] {
  const text = `${context.normalized} ${profile.label.toLowerCase()}`;
  const signals: ClinicalSignal[] = [];
  addSignal(signals, "oxygenation", text, ["spo2", "dyspnea", "shortness", "crackles", "wheeze", "oxygen", "pneumonia", "copd", "pulmonary"]);
  addSignal(signals, "perfusion", text, ["heart failure", "hypotension", "tachycardia", "chest pain", "edema", "bnp", "troponin", "shock"]);
  addSignal(signals, "infection", text, ["fever", "wbc", "lactate", "infection", "sepsis", "pneumonia", "uti", "cellulitis"]);
  addSignal(signals, "fluid", text, ["edema", "dehydration", "vomiting", "diarrhea", "creatinine", "sodium", "potassium", "diuretic"]);
  addSignal(signals, "glucose", text, ["diabetes", "glucose", "insulin", "hypoglycemia", "hyperglycemia", "dka"]);
  addSignal(signals, "neuro", text, ["stroke", "confusion", "seizure", "weakness", "slurred", "altered"]);
  addSignal(signals, "pain", text, ["pain", "surgical", "post-op", "fracture", "burn"]);
  signals.push("safety");
  return Array.from(new Set(signals));
}

function addSignal(signals: ClinicalSignal[], signal: ClinicalSignal, text: string, needles: string[]) {
  if (needles.some((needle) => text.includes(needle))) signals.push(signal);
}

function parseLabs(text: string) {
  const normalized = text.toLowerCase();
  return Object.entries(LAB_RANGES)
    .map(([key, range]) => {
      const alias = range.aliases.find((candidate) => normalized.includes(candidate));
      if (!alias) return null;
      const value = valueAfterAlias(normalized, alias);
      const status = value == null ? "mentioned" : range.high != null && value > range.high ? "high" : range.low != null && value < range.low ? "low" : "normal";
      const priority: AssignmentPriority = status === "normal" ? "stable" : key === "lactate" || key === "potassium" || key === "troponin" ? "critical" : "warning";
      return {
        key,
        label: labelize(key),
        result: value == null ? "entered, value not parsed" : `${value} ${range.unit}`,
        normal: range.normal,
        status,
        priority,
        concern: range.concern,
      };
    })
    .filter(Boolean) as Array<{
    key: string;
    label: string;
    result: string;
    normal: string;
    status: string;
    priority: AssignmentPriority;
    concern: string;
  }>;
}

function valueAfterAlias(text: string, alias: string): number | null {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`${escaped}\\s*(?:=|:)?\\s*(-?\\d+(?:\\.\\d+)?)`, "i"));
  return match?.[1] ? Number(match[1]) : null;
}

function parseMedications(text: string) {
  const normalized = text.toLowerCase();
  return Object.entries(MEDICATION_PROFILES)
    .filter(([, profile]) => profile.match.some((needle) => normalized.includes(needle)))
    .map(([key, profile]) => ({ key, label: labelize(key), ...profile }));
}

function buildNodes(
  input: ClinicalAssignmentInput,
  profile: ConditionProfile,
  signals: ClinicalSignal[],
  labs: ReturnType<typeof parseLabs>,
  medications: ReturnType<typeof parseMedications>,
): AssignmentNode[] {
  const nodes: AssignmentNode[] = [
    {
      id: "patient",
      title: `${input.patientProfile.age || "Adult"} ${input.patientProfile.sex || "patient"} with ${profile.label}`,
      category: "patient",
      priority: acuityFromSignals(signals),
      summary: `Primary concern: ${input.patientProfile.diagnosis || profile.label}. Setting: ${SETTING_LABELS[input.setting]}.`,
      details: [
        `Key concerns: ${signals.map(labelize).join(", ")}`,
        `Medical history: ${input.patientProfile.medicalHistory || "not entered"}`,
        `Allergies: ${input.patientProfile.allergies || "not entered"}`,
      ],
      rationale: "The central node anchors all assignment outputs to the patient, acuity, diagnosis, and most important safety concerns.",
    },
    ...profile.corePathway.map((step, index): AssignmentNode => ({
      id: `patho-${index + 1}`,
      title: step,
      category: "pathophysiology" as const,
      priority: index > 2 ? "warning" : "educational",
      summary: pathoSummary(step, profile.label),
      details: [`Cause-and-effect step ${index + 1} in the ${profile.label} reasoning chain.`],
      rationale: "This pathophysiology step explains why the next assessment cue or complication can occur.",
    })),
    ...labs.map((lab): AssignmentNode => ({
      id: `lab-${lab.key}`,
      title: `${lab.label}: ${lab.result}`,
      category: "lab" as const,
      priority: lab.priority,
      summary: `${lab.status === "normal" ? "Within expected range" : "Abnormal or clinically important"} compared with ${lab.normal}.`,
      details: [`Clinical concern: ${lab.concern}`, `Normal range: ${lab.normal}`, `Patient value: ${lab.result}`],
      rationale: `${lab.label} is linked because it can change priority, medication safety, escalation urgency, or complication risk.`,
    })),
    ...medications.map((med): AssignmentNode => ({
      id: `med-${med.key}`,
      title: med.label,
      category: "medication" as const,
      priority: "educational" as const,
      summary: `${med.className}: ${med.expectedEffect}.`,
      details: [
        `Major side effects: ${med.sideEffects.join(", ")}`,
        `Monitoring: ${med.monitoring.join(", ")}`,
        `Nursing considerations: ${med.nursingConsiderations.join("; ")}`,
      ],
      rationale: "Medication cards must connect the order to the diagnosis, expected physiologic effect, adverse effects, and nursing monitoring.",
    })),
    ...profile.nursingDiagnoses.map((dx, index): AssignmentNode => ({
      id: `dx-${index + 1}`,
      title: dx.diagnosis,
      category: "diagnosis" as const,
      priority: dx.priority === "High Priority" ? "critical" : dx.priority === "Moderate Priority" ? "warning" : "educational",
      summary: dx.priority,
      details: [dx.rationale],
      rationale: "Priority nursing diagnoses are selected from patient cues, pathophysiology, and immediate safety risk.",
    })),
    ...profile.complications.map((complication, index): AssignmentNode => ({
      id: `complication-${index + 1}`,
      title: complication.title,
      category: "complication" as const,
      priority: complication.severity,
      summary: complication.likelihood,
      details: [`Early warning signs: ${complication.warningSigns.join(", ")}`, `Nursing response: ${complication.response}`],
      rationale: "Complication nodes teach failure-to-rescue awareness by making early warning signs and nursing response explicit.",
    })),
    ...ncjmmNodes(profile, signals),
  ];
  return nodes;
}

function buildRelationships(
  profile: ConditionProfile,
  signals: ClinicalSignal[],
  labs: ReturnType<typeof parseLabs>,
  medications: ReturnType<typeof parseMedications>,
): AssignmentRelationship[] {
  const relationships: AssignmentRelationship[] = [];
  for (let i = 0; i < profile.corePathway.length; i += 1) {
    relationships.push({
      from: i === 0 ? "patient" : `patho-${i}`,
      to: `patho-${i + 1}`,
      label: "causes",
      rationale: `${i === 0 ? profile.label : profile.corePathway[i - 1]} contributes to ${profile.corePathway[i]}, which explains the next clinical cue.`,
      priority: i > 2 ? "warning" : "educational",
    });
  }
  for (const lab of labs) {
    relationships.push({
      from: `lab-${lab.key}`,
      to: lab.key === "bnp" || lab.key === "troponin" ? "patho-2" : lab.key === "lactate" ? "patho-3" : "patient",
      label: "supports concern",
      rationale: `${lab.label} is clinically relevant because it reflects ${lab.concern}; abnormal trends can change priority and escalation decisions.`,
      priority: lab.priority,
    });
  }
  for (const med of medications) {
    relationships.push({
      from: `med-${med.key}`,
      to: "patient",
      label: "treats or modifies risk",
      rationale: `${med.label} is linked to the patient because it ${med.expectedEffect}; nursing monitoring prevents predictable adverse effects.`,
      priority: "educational",
    });
  }
  profile.nursingDiagnoses.forEach((_, index) => {
    relationships.push({
      from: "patient",
      to: `dx-${index + 1}`,
      label: "cue cluster",
      rationale: "The nursing diagnosis is not chosen from a label alone; it is supported by assessment findings, pathophysiology, labs, and safety risk.",
      priority: index < 2 ? "critical" : "warning",
    });
  });
  profile.complications.forEach((complication, index) => {
    relationships.push({
      from: "patho-3",
      to: `complication-${index + 1}`,
      label: "can progress to",
      rationale: `${profile.label} can progress to ${complication.title}; early signs include ${complication.warningSigns.join(", ")}.`,
      priority: complication.severity,
    });
  });
  if (signals.includes("oxygenation")) {
    relationships.push({
      from: "ncjmm-recognize",
      to: "ncjmm-prioritize",
      label: "ABCs",
      rationale: "Oxygenation cues move rapidly from recognition to prioritization because breathing threats can deteriorate before labs return.",
      priority: "critical",
    });
  }
  return relationships;
}

function buildSections(
  input: ClinicalAssignmentInput,
  moduleId: ClinicalAssignmentModuleId,
  profile: ConditionProfile,
  signals: ClinicalSignal[],
  labs: ReturnType<typeof parseLabs>,
  medications: ReturnType<typeof parseMedications>,
): AssignmentSection[] {
  const shared = [
    assessmentSection(input, signals),
    labSection(labs),
    medicationSection(medications, profile),
    diagnosisSection(profile),
    prioritizationSection(signals, input.role),
    complicationSection(profile),
    ncjmmSection(profile, signals, input.role),
  ];
  if (moduleId === "medication-card") return [medicationSection(medications, profile), labSection(labs)];
  if (moduleId === "sbar") return [sbarSection(input, profile, signals), prioritizationSection(signals, input.role)];
  if (moduleId === "disease-worksheet") return [pathophysiologySection(profile), assessmentSection(input, signals), complicationSection(profile)];
  if (moduleId === "clinical-prep") return [prepSection(input, profile, signals), medicationSection(medications, profile), sbarSection(input, profile, signals)];
  if (moduleId === "reflection") return [reflectionSection(profile, signals, input.role), ncjmmSection(profile, signals, input.role)];
  if (moduleId === "care-plan") return [diagnosisSection(profile), assessmentSection(input, signals), prioritizationSection(signals, input.role), complicationSection(profile)];
  return [pathophysiologySection(profile), ...shared];
}

function assessmentSection(input: ClinicalAssignmentInput, signals: ClinicalSignal[]): AssignmentSection {
  return {
    id: "assessment",
    title: "Priority Assessments",
    rationale: "Priority assessment focuses on findings that can change safety, escalation, or the first nursing action.",
    items: [
      {
        label: "Vital signs",
        value: input.assessmentData.vitalSigns || "not entered",
        interpretation: "Trend for instability rather than treating one number in isolation.",
        priority: signals.includes("oxygenation") || signals.includes("perfusion") ? "critical" : "warning",
        rationale: "Vital sign patterns identify airway, breathing, circulation, infection, pain, and neurologic deterioration.",
      },
      {
        label: "Focused assessment",
        value: input.assessmentData.physicalAssessmentFindings || "not entered",
        interpretation: "Compare expected findings for the diagnosis with new or worsening findings.",
        priority: "warning",
        rationale: "Focused assessment validates whether the diagnosis is stable, improving, or deteriorating.",
      },
      {
        label: "Symptoms",
        value: input.assessmentData.symptoms || "not entered",
        interpretation: "Symptoms become high priority when they indicate oxygenation, perfusion, neurologic, or safety risk.",
        priority: "warning",
        rationale: "Symptoms are patient-reported cues that must be linked to objective findings.",
      },
    ],
  };
}

function labSection(labs: ReturnType<typeof parseLabs>): AssignmentSection {
  return {
    id: "labs",
    title: "Laboratory Interpretation Tree",
    rationale: "Lab values are interpreted by clinical meaning, potential cause, and nursing concern, not by memorizing ranges alone.",
    items: labs.length
      ? labs.map((lab) => ({
          label: lab.label,
          value: lab.result,
          interpretation: `${lab.status}; normal range: ${lab.normal}.`,
          priority: lab.priority,
          rationale: `Meaning: ${lab.concern}. Nursing concern: trend with assessment findings and medication safety.`,
        }))
      : [
          {
            label: "Labs",
            value: "No parseable lab values entered.",
            interpretation: "Add values such as WBC 16.2, lactate 2.4, potassium 3.1, BNP 840, or glucose 14.8.",
            priority: "educational",
            rationale: "The assignment remains usable, but lab-specific clinical reasoning needs actual values.",
          },
        ],
  };
}

function medicationSection(medications: ReturnType<typeof parseMedications>, profile: ConditionProfile): AssignmentSection {
  return {
    id: "medications",
    title: "Medication Cards",
    rationale: "Medication cards connect why the patient receives the drug, expected effect, side effects, nursing considerations, and monitoring.",
    items: medications.length
      ? medications.map((med) => ({
          label: med.label,
          value: `${med.className}; expected effect: ${med.expectedEffect}.`,
          interpretation: `Linked diagnosis: ${profile.label} or related comorbidity.`,
          priority: "educational",
          rationale: `Major side effects: ${med.sideEffects.join(", ")}. Monitor: ${med.monitoring.join(", ")}. Nursing considerations: ${med.nursingConsiderations.join("; ")}.`,
        }))
      : [
          {
            label: "Medication review",
            value: "No recognized medications entered.",
            interpretation: "Add medications to generate patient-specific cards.",
            priority: "educational",
            rationale: "Medication reasoning requires drug names so the hub can connect therapy to diagnosis, expected effect, and monitoring.",
          },
        ],
  };
}

function diagnosisSection(profile: ConditionProfile): AssignmentSection {
  return {
    id: "diagnoses",
    title: "Priority Nursing Diagnoses",
    rationale: "Diagnoses are ranked by ABCs, safety, deterioration risk, and relationship to patient cues.",
    items: profile.nursingDiagnoses.slice(0, 5).map((dx) => ({
      label: dx.priority,
      value: dx.diagnosis,
      interpretation: dx.rationale,
      priority: dx.priority === "High Priority" ? "critical" : dx.priority === "Moderate Priority" ? "warning" : "educational",
      rationale: "Linked to assessment findings, pathophysiology, risk factors, and complication prevention.",
    })),
  };
}

function prioritizationSection(signals: ClinicalSignal[], role: ClinicalAssignmentRole): AssignmentSection {
  const roleScope =
    role === "np"
      ? "NP learners add diagnostic reasoning, differential diagnosis, management planning, prescribing considerations, and follow-up."
      : role === "rpn-lpn"
        ? "RPN/LPN learners focus on recognition, monitoring, safe medication administration, timely reporting, and escalation within scope."
        : "RN learners focus on advanced assessment, prioritization, care planning, clinical judgment, and interprofessional communication.";
  return {
    id: "prioritization",
    title: "Prioritization Framework",
    rationale: "The hub makes prioritization explicit so learners can explain why one concern comes before another.",
    items: [
      {
        label: "ABCs",
        value: signals.includes("oxygenation") ? "Breathing concern is high priority." : signals.includes("perfusion") ? "Circulation concern is high priority." : "No immediate ABC signal detected from entered data.",
        interpretation: "Airway and breathing are prioritized before circulation when unstable; circulation follows when perfusion is threatened.",
        priority: signals.includes("oxygenation") || signals.includes("perfusion") ? "critical" : "stable",
        rationale: "ABCs protect immediate physiologic survival.",
      },
      {
        label: "Maslow",
        value: "Physiologic stability comes before education, long-term coping, or discharge planning.",
        interpretation: "Education is important, but unstable oxygenation, perfusion, infection, neurologic status, or glucose comes first.",
        priority: "warning",
        rationale: "Maslow helps learners separate immediate survival needs from longer-term learning needs.",
      },
      {
        label: "Safety and scope",
        value: roleScope,
        interpretation: "The correct assignment answer depends on learner role and scope.",
        priority: "educational",
        rationale: "Safe nursing decisions differ for RPN/LPN, RN, and NP roles.",
      },
    ],
  };
}

function complicationSection(profile: ConditionProfile): AssignmentSection {
  return {
    id: "complications",
    title: "Complication Map",
    rationale: "Complication mapping teaches early recognition and failure-to-rescue prevention.",
    items: profile.complications.map((complication) => ({
      label: complication.title,
      value: `Likelihood: ${complication.likelihood}`,
      interpretation: `Early warning signs: ${complication.warningSigns.join(", ")}.`,
      priority: complication.severity,
      rationale: `Nursing response: ${complication.response}`,
    })),
  };
}

function pathophysiologySection(profile: ConditionProfile): AssignmentSection {
  return {
    id: "pathophysiology",
    title: "Pathophysiology Reasoning Chain",
    rationale: "This chain turns disease content into cause-and-effect bedside reasoning.",
    items: profile.corePathway.map((step, index) => ({
      label: `Step ${index + 1}`,
      value: step,
      interpretation: index === 0 ? "Starting mechanism." : `Clinical consequence of step ${index}.`,
      priority: index > 2 ? "warning" : "educational",
      rationale: "The learner should be able to explain how this step creates the next finding or risk.",
    })),
  };
}

function ncjmmSection(profile: ConditionProfile, signals: ClinicalSignal[], role: ClinicalAssignmentRole): AssignmentSection {
  const rolePhrase = role === "np" ? "management and follow-up" : role === "rpn-lpn" ? "reporting and escalation" : "care planning and team communication";
  return {
    id: "ncjmm",
    title: "NCJMM Clinical Judgment Map",
    rationale: "The six NCJMM domains translate the patient data into exam-style clinical judgment.",
    items: [
      { label: "Recognize Cues", value: `Identify ${signals.map(labelize).join(", ")} cues.`, priority: "warning", rationale: "Cues are clinically meaningful findings, not every piece of data." },
      { label: "Analyze Cues", value: `Connect cues to ${profile.label} pathophysiology.`, priority: "warning", rationale: "Analysis explains why findings cluster together." },
      { label: "Prioritize Hypotheses", value: "Rank oxygenation, perfusion, infection, neurologic change, and safety before teaching-only needs.", priority: "critical", rationale: "Priority hypotheses prevent delayed rescue." },
      { label: "Generate Solutions", value: `Choose interventions appropriate for ${rolePhrase}.`, priority: "warning", rationale: "Solutions must fit scope and acuity." },
      { label: "Take Action", value: "Act on the highest-risk cue cluster first, communicate clearly, and document changes.", priority: "critical", rationale: "Action should target the cause of deterioration and the immediate safety risk." },
      { label: "Evaluate Outcomes", value: "Reassess the cue that triggered action and decide whether escalation is still required.", priority: "warning", rationale: "Evaluation prevents assuming an intervention worked without evidence." },
    ],
  };
}

function sbarSection(input: ClinicalAssignmentInput, profile: ConditionProfile, signals: ClinicalSignal[]): AssignmentSection {
  return {
    id: "sbar",
    title: "SBAR Report",
    rationale: "SBAR converts clinical reasoning into concise team communication.",
    items: [
      { label: "Situation", value: `${input.patientProfile.age || "Patient"} with ${input.patientProfile.diagnosis || profile.label} in ${SETTING_LABELS[input.setting]} care.`, rationale: "Situation states who the patient is and why you are calling now." },
      { label: "Background", value: `${input.patientProfile.medicalHistory || "Relevant history not entered"}. Medications: ${input.patientProfile.currentMedications || "not entered"}.`, rationale: "Background gives only information that changes interpretation or action." },
      { label: "Assessment", value: `Current cue clusters: ${signals.map(labelize).join(", ")}. Findings: ${input.assessmentData.vitalSigns || "vitals not entered"}.`, rationale: "Assessment links objective findings to concern." },
      { label: "Recommendation", value: "Request timely reassessment, orders or escalation pathway support based on acuity and scope.", rationale: "Recommendation states what help or decision is needed next." },
    ],
  };
}

function prepSection(input: ClinicalAssignmentInput, profile: ConditionProfile, signals: ClinicalSignal[]): AssignmentSection {
  return {
    id: "clinical-prep",
    title: "Clinical Preparation Sheet",
    rationale: "Clinical preparation should help the learner anticipate assessments, meds, safety risks, and likely instructor questions.",
    items: [
      { label: "Know before shift", value: profile.corePathway.join(" -> "), rationale: "The learner should explain how the diagnosis creates expected findings." },
      { label: "Assess first", value: signals.includes("oxygenation") ? "Respiratory effort, lung sounds, SpO2, oxygen delivery, mental status." : "Vital signs, focused assessment, pain, safety, trend changes.", rationale: "First assessments are chosen by risk, not by worksheet order." },
      { label: "Prepare to explain", value: `Why this patient is at risk for ${profile.complications.map((c) => c.title).join(", ")}.`, rationale: "Instructor questions usually test clinical reasoning and complication recognition." },
      { label: "Bring to post-conference", value: input.assessmentData.laboratoryValues || "Add relevant labs and medication monitoring points.", rationale: "Post-conference discussion improves when the learner connects cues to decisions." },
    ],
  };
}

function reflectionSection(profile: ConditionProfile, signals: ClinicalSignal[], role: ClinicalAssignmentRole): AssignmentSection {
  return {
    id: "reflection",
    title: "Clinical Reflection Assistant",
    rationale: "Reflection should identify reasoning growth, missed cues, safety lessons, and next clinical behavior.",
    items: [
      { label: "Cue reflection", value: `Which ${signals.map(labelize).join(", ")} cue changed your priority most?`, rationale: "Strong reflection names a cue and explains its meaning." },
      { label: "Reasoning reflection", value: `How did ${profile.label} pathophysiology explain the patient's symptoms and risks?`, rationale: "This prevents reflection from becoming a generic feelings-only answer." },
      { label: "Scope reflection", value: `What action fit your ${role.toUpperCase()} learner scope, and what required escalation?`, rationale: "Safe reflection includes role boundaries." },
      { label: "Next shift goal", value: "Name one assessment cue you will monitor earlier next time and why.", rationale: "Future-facing reflection improves practice behavior." },
    ],
  };
}

function ncjmmNodes(profile: ConditionProfile, signals: ClinicalSignal[]): AssignmentNode[] {
  return [
    ["ncjmm-recognize", "Recognize Cues", `Recognize ${signals.map(labelize).join(", ")} cues.`],
    ["ncjmm-analyze", "Analyze Cues", `Connect cue clusters to ${profile.label} pathophysiology.`],
    ["ncjmm-prioritize", "Prioritize Hypotheses", "Rank oxygenation, perfusion, infection, neurologic change, and safety."],
    ["ncjmm-solutions", "Generate Solutions", "Choose scope-appropriate interventions and escalation options."],
    ["ncjmm-action", "Take Action", "Act on the highest-risk concern and communicate clearly."],
    ["ncjmm-evaluate", "Evaluate Outcomes", "Reassess whether the action changed the cue that mattered."],
  ].map(([id, title, summary], index) => ({
    id,
    title,
    category: "ncjmm" as const,
    priority: index === 2 || index === 4 ? "critical" : "educational",
    summary,
    details: [summary],
    rationale: "NCJMM nodes make the learner's clinical judgment process visible and assessable.",
  }));
}

function buildExamPrep(profile: ConditionProfile, signals: ClinicalSignal[], role: ClinicalAssignmentRole): ClinicalAssignmentOutput["examPrep"] {
  return {
    nclexPearls: [
      ...profile.pearls,
      "On NCLEX-style items, choose the answer that addresses the most unstable cue first, then reassess.",
      "If two options are reasonable, choose the one that prevents deterioration or gathers the cue needed for safe action.",
    ],
    rexPnPearls: [
      role === "rpn-lpn"
        ? "For RPN/LPN scope, prioritize recognition, focused monitoring, safe administration, reporting, and escalation."
        : "REx-PN-style reasoning emphasizes scope, predictable outcomes, escalation, and practical bedside safety.",
      "Do not select advanced independent management when the safer answer is assessment, reporting, or following the plan of care.",
    ],
    priorityActions: [
      signals.includes("oxygenation") ? "Assess airway, breathing, oxygen delivery, lung sounds, and work of breathing first." : "Start with the cue cluster most likely to become unstable.",
      signals.includes("perfusion") ? "Trend blood pressure, heart rate, mentation, urine output, and perfusion markers." : "Reassess after intervention and document the change in the original cue.",
      "Escalate when findings worsen, do not fit the expected disease pattern, or exceed learner scope.",
    ],
    safetyAlerts: [
      "Do not let a normal-looking single value override a deteriorating trend.",
      "Medication safety depends on assessment and labs, not just the medication name.",
      "Escalation is an intervention when deterioration is possible.",
    ],
    commonMistakes: [
      "Writing a diagnosis because it sounds familiar instead of linking it to cues.",
      "Treating labs as isolated facts instead of explaining what they mean for risk.",
      "Skipping evaluation after an intervention.",
    ],
  };
}

function buildLearnerChallenge(
  profile: ConditionProfile,
  labs: ReturnType<typeof parseLabs>,
  medications: ReturnType<typeof parseMedications>,
): ClinicalAssignmentOutput["learnerChallenge"] {
  const abnormalLab = labs.find((lab) => lab.status !== "normal");
  const medication = medications[0];
  return {
    prompts: [
      `Hide the diagnosis: identify the most likely process from the pathophysiology chain and cue clusters.`,
      abnormalLab ? `Hide ${abnormalLab.label}: explain what the value suggests and what you would monitor next.` : "Hide the lab node: add one lab that would help evaluate this patient and explain why.",
      medication ? `Hide ${medication.label}: identify why the patient receives it and what safety check matters most.` : "Hide the medication card: identify one medication class likely to be ordered and its nursing monitoring.",
      `Hide one complication: predict the early warning signs for ${profile.label}.`,
    ],
    answerKey: [
      `Likely process: ${profile.label}.`,
      abnormalLab ? `${abnormalLab.label} relates to ${abnormalLab.concern}.` : "Appropriate labs depend on the diagnosis and risk pattern.",
      medication ? `${medication.label}: ${medication.expectedEffect}; monitor ${medication.monitoring.join(", ")}.` : "Medication reasoning should include indication, expected effect, adverse effects, and monitoring.",
      `Complications include ${profile.complications.map((item) => item.title).join(", ")}.`,
    ],
    scoringGuide: [
      "2 points: identifies correct missing concept and explains the clinical rationale.",
      "1 point: identifies the concept but gives incomplete reasoning.",
      "0 points: guesses without connecting cues, risk, and nursing action.",
    ],
  };
}

function buildQualityFlags(
  input: ClinicalAssignmentInput,
  profile: ConditionProfile,
  labs: ReturnType<typeof parseLabs>,
  relationships: AssignmentRelationship[],
): string[] {
  const flags: string[] = [];
  if (!input.patientProfile.diagnosis.trim()) flags.push("Diagnosis missing: map uses the closest recognized clinical profile.");
  if (profile === CONDITION_PROFILES[0] && !/heart failure|chf|hf|pulmonary edema/i.test(input.patientProfile.diagnosis + input.assessmentData.symptoms + input.assessmentData.physicalAssessmentFindings)) {
    flags.push("Condition not recognized: heart failure framework used as a safe demonstration profile.");
  }
  if (labs.length === 0) flags.push("No parseable labs: laboratory interpretation is limited.");
  if (!input.assessmentData.vitalSigns.trim()) flags.push("Vital signs missing: prioritization confidence is reduced.");
  if (relationships.some((relationship) => relationship.rationale.trim().length < 25)) flags.push("Relationship rationale below standard.");
  return flags;
}

function buildPatientSummary(input: ClinicalAssignmentInput, profile: ConditionProfile, signals: ClinicalSignal[]): string {
  return `${input.patientProfile.age || "Patient"} ${input.patientProfile.sex || ""} in ${SETTING_LABELS[input.setting]} with ${input.patientProfile.diagnosis || profile.label}. Key reasoning concerns: ${signals.map(labelize).join(", ")}. Acuity: ${acuityFromSignals(signals)}.`;
}

function buildReasoningSummary(input: ClinicalAssignmentInput, profile: ConditionProfile, signals: ClinicalSignal[]): string {
  const scope =
    input.role === "np"
      ? "advanced diagnostics, differential diagnosis, prescribing considerations, and follow-up planning"
      : input.role === "rpn-lpn"
        ? "recognition, monitoring, safe medication administration, reporting, and escalation"
        : "assessment, prioritization, care planning, interprofessional communication, and reassessment";
  return `${profile.label} is mapped as a cause-and-effect clinical reasoning problem. The learner should connect ${profile.corePathway.join(" -> ")} while using ${scope} for the ${input.role.toUpperCase()} role.`;
}

function acuityFromSignals(signals: ClinicalSignal[]): AssignmentPriority {
  if (signals.includes("oxygenation") || signals.includes("perfusion") || signals.includes("neuro")) return "critical";
  if (signals.includes("infection") || signals.includes("fluid") || signals.includes("glucose")) return "warning";
  return "stable";
}

function pathoSummary(step: string, condition: string): string {
  return `${step} is clinically important because it explains how ${condition} creates observable patient cues and complication risk.`;
}

function nodeTitle(nodes: AssignmentNode[], id: string): string {
  return nodes.find((node) => node.id === id)?.title ?? id;
}

function labelize(value: string): string {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
