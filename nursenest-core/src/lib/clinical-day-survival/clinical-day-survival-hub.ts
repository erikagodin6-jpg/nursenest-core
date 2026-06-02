export type ClinicalDayRole = "rn-student" | "rpn-lpn-student" | "np-student";
export type ClinicalDayUnit = "med-surg" | "icu" | "er" | "pediatrics" | "maternal-child" | "mental-health" | "community" | "ltc";
export type ClinicalDayModuleId =
  | "patient-assignment"
  | "tomorrow-cheat-sheet"
  | "pre-conference"
  | "post-conference"
  | "instructor-questions"
  | "med-pass"
  | "lab-prep"
  | "shift-prioritization"
  | "skills-prep"
  | "rapid-review";

export type ClinicalDayInput = {
  role: ClinicalDayRole;
  unit: ClinicalDayUnit;
  diagnosis: string;
  age: string;
  comorbidities: string;
  medications: string;
  labs: string;
  notes: string;
};

export type ClinicalDayPriority = "critical" | "warning" | "stable" | "teaching";

export type ClinicalDayCard = {
  id: string;
  title: string;
  priority: ClinicalDayPriority;
  bullets: string[];
  rationale: string;
};

export type InstructorQuestion = {
  category: "Pathophysiology" | "Pharmacology" | "Labs" | "Assessment" | "Prioritization" | "Teaching" | "Safety";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  question: string;
  modelAnswer: string;
  rationale: string;
};

export type ClinicalDayOutput = {
  moduleId: ClinicalDayModuleId;
  title: string;
  patientSnapshot: ClinicalDayCard;
  onePageSummary: ClinicalDayCard[];
  checklist: Array<{ label: string; doneByDefault: boolean; rationale: string }>;
  instructorQuestions: InstructorQuestion[];
  rapidReview: ClinicalDayCard[];
  skills: Array<{ label: string; href: string; whyRelevant: string }>;
  monetization: {
    freeTierLimit: string;
    paidTierUnlock: string;
  };
  qualityFlags: string[];
};

type DxProfile = {
  key: string;
  names: string[];
  label: string;
  pathophysiology: string;
  assessments: string[];
  medications: string[];
  labs: string[];
  redFlags: string[];
  priorities: string[];
  complications: string[];
  instructorQuestions: InstructorQuestion[];
  skills: Array<{ label: string; slug: string; whyRelevant: string }>;
  rapidReview: ClinicalDayCard[];
};

const MODULE_TITLES: Record<ClinicalDayModuleId, string> = {
  "patient-assignment": "Patient Assignment Prep Tool",
  "tomorrow-cheat-sheet": "What Should I Know Tomorrow?",
  "pre-conference": "Pre-Conference Prep",
  "post-conference": "Post-Conference Prep",
  "instructor-questions": "Clinical Instructor Question Bank",
  "med-pass": "Medication Pass Prep",
  "lab-prep": "Lab Interpretation Prep",
  "shift-prioritization": "Shift Prioritization Tool",
  "skills-prep": "Clinical Skills Prep",
  "rapid-review": "Rapid Review Sheets",
};

const UNIT_LABELS: Record<ClinicalDayUnit, string> = {
  "med-surg": "medical-surgical",
  icu: "ICU",
  er: "emergency",
  pediatrics: "pediatrics",
  "maternal-child": "maternal-child",
  "mental-health": "mental health",
  community: "community",
  ltc: "long-term care",
};

const DX_PROFILES: DxProfile[] = [
  {
    key: "heart-failure",
    names: ["heart failure", "chf", "hf", "pulmonary edema"],
    label: "Heart Failure",
    pathophysiology:
      "Impaired ventricular filling or pumping reduces forward cardiac output. Compensation increases sympathetic tone and fluid retention, which can worsen pulmonary or systemic congestion.",
    assessments: [
      "Respiratory effort, SpO2, lung sounds, orthopnea, and oxygen requirement",
      "Blood pressure, heart rate/rhythm, peripheral pulses, capillary refill, mentation, and urine output",
      "Daily weight, edema, intake/output, abdominal distention, and activity tolerance",
    ],
    medications: ["furosemide", "beta blocker", "ACE inhibitor/ARB/ARNI", "spironolactone", "digoxin if ordered"],
    labs: ["BNP/NT-proBNP", "potassium", "creatinine/eGFR", "sodium", "troponin if ischemia suspected"],
    redFlags: ["SpO2 falling or oxygen need rising", "new crackles with acute dyspnea", "hypotension with cool extremities", "low urine output", "new dysrhythmia"],
    priorities: [
      "Assess oxygenation and work of breathing before routine teaching.",
      "Trend perfusion and fluid status together; diuresis can improve lungs but stress kidneys and potassium.",
      "Escalate acute dyspnea, hypotension, altered mentation, or decreasing urine output.",
    ],
    complications: ["Pulmonary edema", "cardiogenic shock", "dysrhythmias", "acute kidney injury", "falls from hypotension or diuresis"],
    skills: [
      { label: "Head-to-toe cardiovascular and respiratory assessment", slug: "head-to-toe-assessment", whyRelevant: "HF priorities depend on breathing, perfusion, edema, and activity tolerance." },
      { label: "Medication administration", slug: "medication-administration", whyRelevant: "Diuretics and cardiac medications require pre-checks and monitoring." },
      { label: "Oxygen therapy", slug: "oxygen-therapy", whyRelevant: "Worsening congestion can create oxygen needs and escalation decisions." },
      { label: "Blood glucose monitoring", slug: "blood-glucose-monitoring", whyRelevant: "Diabetes comorbidity changes infection, healing, and medication safety." },
    ],
    instructorQuestions: [
      q("Pathophysiology", "Beginner", "Why does heart failure cause crackles?", "Fluid backs up into pulmonary circulation, increasing fluid in or around alveoli and impairing gas exchange.", "The answer links the disease mechanism to a specific assessment finding."),
      q("Assessment", "Intermediate", "Which finding would you report first: ankle edema or new SpO2 88%?", "New SpO2 88% is first because oxygenation is an ABC concern and may signal pulmonary edema.", "This tests prioritization, not memorization of symptoms."),
      q("Labs", "Intermediate", "Why are potassium and creatinine important for this patient?", "Diuretics and poor perfusion can change potassium and kidney function; both affect dysrhythmia risk and medication safety.", "Medication safety is tied to lab interpretation."),
      q("Safety", "Advanced", "What failure-to-rescue pattern worries you in heart failure?", "Increasing oxygen need, crackles, hypotension, confusion, low urine output, or new dysrhythmia should trigger rapid escalation.", "The learner should name a pattern of deterioration, not a single isolated cue."),
    ],
    rapidReview: [],
  },
  {
    key: "copd",
    names: ["copd", "asthma", "pneumonia", "respiratory"],
    label: "COPD / Pneumonia",
    pathophysiology:
      "Airflow obstruction, inflammation, infection, or alveolar consolidation creates ventilation-perfusion mismatch. The patient may compensate with tachypnea until fatigue or hypoxemia appears.",
    assessments: ["Respiratory rate, work of breathing, SpO2 target, breath sounds, cough/sputum", "Mental status, fatigue, accessory muscle use, ability to speak", "Temperature, hydration, chest pain, and response to bronchodilators or antibiotics"],
    medications: ["bronchodilators", "corticosteroids", "antibiotics", "oxygen", "mucolytics if ordered"],
    labs: ["WBC", "ABG/VBG if ordered", "lactate if sepsis concern", "sputum culture", "electrolytes"],
    redFlags: ["silent chest", "new confusion", "cyanosis", "increasing oxygen need", "hypotension with infection signs"],
    priorities: ["Assess breathing effort before completing routine paperwork.", "Monitor response to oxygen/bronchodilator therapy.", "Escalate fatigue, worsening hypoxemia, or sepsis cues."],
    complications: ["Respiratory failure", "sepsis", "atelectasis", "dehydration", "delirium"],
    skills: [
      { label: "Respiratory assessment", slug: "respiratory-assessment", whyRelevant: "Respiratory illness changes quickly and requires trend-based assessment." },
      { label: "Oxygen therapy", slug: "oxygen-therapy", whyRelevant: "Students must understand oxygen delivery, target saturation, and escalation." },
      { label: "Medication administration", slug: "medication-administration", whyRelevant: "Bronchodilators, steroids, and antibiotics need monitoring for response and adverse effects." },
    ],
    instructorQuestions: [
      q("Pathophysiology", "Beginner", "Why can pneumonia lower oxygen saturation?", "Inflamed or fluid-filled alveoli impair gas exchange, creating ventilation-perfusion mismatch.", "This connects the diagnosis to oxygenation assessment."),
      q("Assessment", "Intermediate", "Why is work of breathing important even when SpO2 looks acceptable?", "Increasing effort can show compensation and fatigue before saturation drops.", "Students often overfocus on one number."),
      q("Prioritization", "Advanced", "What would make this patient an urgent escalation?", "New confusion, silent chest, cyanosis, rising oxygen needs, or sepsis signs require urgent escalation.", "This tests failure-to-rescue recognition."),
    ],
    rapidReview: [],
  },
  {
    key: "diabetes",
    names: ["diabetes", "dka", "hyperglycemia", "hypoglycemia"],
    label: "Diabetes",
    pathophysiology:
      "Insulin deficiency or resistance prevents effective cellular glucose use. Stress, infection, steroids, altered intake, or missed therapy can destabilize glucose and fluid/electrolyte balance.",
    assessments: ["Blood glucose trend and symptoms", "Meal intake, nausea/vomiting, hydration, and mental status", "Skin, feet, wounds, infection signs, and medication timing"],
    medications: ["insulin", "metformin", "sulfonylurea", "GLP-1 agonist", "dextrose or glucagon if hypoglycemia"],
    labs: ["glucose", "ketones if DKA concern", "potassium", "creatinine/eGFR", "A1C"],
    redFlags: ["altered mental status", "symptomatic hypoglycemia", "vomiting with hyperglycemia", "ketones", "dehydration"],
    priorities: ["Check glucose before insulin and with symptoms.", "Connect glucose results to meal intake and medication timing.", "Escalate severe hypoglycemia or DKA pattern quickly."],
    complications: ["Hypoglycemia", "DKA/HHS", "infection", "delayed wound healing", "falls or injury"],
    skills: [
      { label: "Blood glucose monitoring", slug: "blood-glucose-monitoring", whyRelevant: "Glucose checks drive medication and safety decisions." },
      { label: "Medication administration", slug: "medication-administration", whyRelevant: "Insulin timing and dose safety are common clinical questions." },
      { label: "Wound care", slug: "wound-care", whyRelevant: "Diabetes increases infection and delayed-healing risk." },
    ],
    instructorQuestions: [
      q("Pharmacology", "Beginner", "Why should rapid-acting insulin be linked to meals?", "It lowers glucose quickly, so giving it without intake can cause hypoglycemia.", "This tests medication timing and safety."),
      q("Labs", "Intermediate", "Why does potassium matter in DKA treatment?", "Insulin shifts potassium into cells, which can worsen hypokalemia and cause dysrhythmias.", "Students must connect therapy to electrolyte risk."),
      q("Safety", "Advanced", "Which diabetes finding is most urgent?", "Altered mental status, severe hypoglycemia, dehydration with ketones, or persistent vomiting is urgent.", "These findings indicate immediate physiologic risk."),
    ],
    rapidReview: [],
  },
  {
    key: "stroke",
    names: ["stroke", "tia", "cva", "neuro"],
    label: "Stroke / Neurologic Change",
    pathophysiology:
      "Interrupted blood flow or bleeding disrupts brain oxygen and glucose delivery. Deficits depend on location and timing, making last-known-well and focused neuro assessment essential.",
    assessments: ["Level of consciousness, pupils, speech, facial droop, strength, sensation", "Swallowing safety, airway protection, glucose, oxygenation", "Last known well, anticoagulant use, fall risk, and mobility"],
    medications: ["antiplatelet", "anticoagulant if ordered", "antihypertensive", "statin", "thrombolytic only in protocol contexts"],
    labs: ["glucose", "INR/PTT if anticoagulated", "platelets", "electrolytes", "troponin/ECG if ordered"],
    redFlags: ["new focal deficit", "decreased level of consciousness", "seizure", "failed swallow screen", "severe headache"],
    priorities: ["Protect airway and swallowing safety.", "Document last-known-well and focused neurologic changes.", "Escalate new or worsening deficits immediately."],
    complications: ["Aspiration", "falls", "increased intracranial pressure", "seizures", "skin breakdown"],
    skills: [
      { label: "Neurologic assessment", slug: "neurologic-assessment", whyRelevant: "Stroke preparation requires repeatable neuro checks and trend recognition." },
      { label: "Safe feeding and aspiration precautions", slug: "aspiration-precautions", whyRelevant: "Swallowing safety prevents aspiration." },
      { label: "Mobility and transfer safety", slug: "safe-transfers", whyRelevant: "Weakness and neglect increase falls." },
    ],
    instructorQuestions: [
      q("Assessment", "Beginner", "Why is last-known-well important?", "It determines urgency and eligibility for time-sensitive stroke pathways.", "Timing is clinical data."),
      q("Safety", "Intermediate", "Why might you hold oral intake?", "Swallowing may be impaired, increasing aspiration risk.", "Safety can outrank routine medications or meals."),
      q("Prioritization", "Advanced", "What neurologic change requires immediate escalation?", "New weakness, speech change, seizure, pupil change, severe headache, or declining LOC.", "These may indicate progression or a new emergency."),
    ],
    rapidReview: [],
  },
];

const FALLBACK_PROFILE = DX_PROFILES[0];

export function generateClinicalDaySurvivalHub(input: ClinicalDayInput, moduleId: ClinicalDayModuleId): ClinicalDayOutput {
  const profile = selectProfile(input.diagnosis, input.notes, input.comorbidities);
  const meds = mergeMedicationList(input.medications, profile.medications);
  const labs = mergeLabList(input.labs, profile.labs);
  const baseCards = buildBaseCards(input, profile, meds, labs);
  return {
    moduleId,
    title: MODULE_TITLES[moduleId],
    patientSnapshot: baseCards.patientSnapshot,
    onePageSummary: cardsForModule(moduleId, baseCards),
    checklist: buildChecklist(moduleId, input, profile, meds, labs),
    instructorQuestions: buildQuestions(moduleId, profile),
    rapidReview: buildRapidReview(profile),
    skills: profile.skills.map((skill) => ({
      label: skill.label,
      href: `/app/clinical-skills/${skill.slug}`,
      whyRelevant: skill.whyRelevant,
    })),
    monetization: {
      freeTierLimit: "Free tier: limited diagnosis prep and limited instructor questions.",
      paidTierUnlock: "Paid tier: unlimited prep sheets, unlimited questions, PDF export, saved history, and personalized recommendations.",
    },
    qualityFlags: buildQualityFlags(input, profile),
  };
}

export function formatClinicalDaySurvivalForCopy(output: ClinicalDayOutput): string {
  const lines = [output.title, "", "Patient Snapshot", ...formatCard(output.patientSnapshot), ""];
  lines.push("One-Page Prep");
  output.onePageSummary.forEach((card) => {
    lines.push(...formatCard(card), "");
  });
  lines.push("Checklist");
  output.checklist.forEach((item) => lines.push(`- ${item.label}: ${item.rationale}`));
  lines.push("", "Instructor Questions");
  output.instructorQuestions.forEach((item) => {
    lines.push(`- ${item.category} (${item.difficulty}): ${item.question}`);
    lines.push(`  Model answer: ${item.modelAnswer}`);
    lines.push(`  Rationale: ${item.rationale}`);
  });
  return lines.join("\n");
}

function selectProfile(...values: string[]): DxProfile {
  const text = values.join(" ").toLowerCase();
  return DX_PROFILES.find((profile) => profile.names.some((name) => text.includes(name))) ?? FALLBACK_PROFILE;
}

function buildBaseCards(input: ClinicalDayInput, profile: DxProfile, meds: string[], labs: string[]) {
  const patientSnapshot: ClinicalDayCard = {
    id: "patient-snapshot",
    title: `${input.age || "Patient"} on ${UNIT_LABELS[input.unit]} with ${input.diagnosis || profile.label}`,
    priority: "warning",
    bullets: [
      `Pathophysiology: ${profile.pathophysiology}`,
      `Priority assessments: ${profile.assessments.slice(0, 3).join("; ")}`,
      `Common medications: ${meds.join(", ")}`,
      `Priority labs: ${labs.join(", ")}`,
      `Safety concern: ${profile.redFlags[0]}`,
    ],
    rationale: "The snapshot compresses the assignment into the clinical facts most likely to affect safety, assessment, and instructor questioning.",
  };

  return {
    patientSnapshot,
    topTen: card("top-ten", "Top 10 Things To Know", "teaching", [
      profile.pathophysiology,
      ...profile.assessments.slice(0, 3),
      ...profile.labs.slice(0, 3).map((lab) => `Know why ${lab} matters.`),
      ...profile.redFlags.slice(0, 3).map((flag) => `Escalate: ${flag}.`),
    ], "These points fit a one-page tomorrow sheet by prioritizing what changes bedside decisions."),
    assessments: card("assessments", "Most Important Assessments", "critical", profile.assessments, "Assessment choices are linked to the diagnosis and highest-risk complications."),
    complications: card("complications", "Most Common Complications", "warning", profile.complications, "Complications help students anticipate deterioration rather than reacting late."),
    interventions: card("interventions", "Common Nursing Interventions", "warning", profile.priorities, "Interventions are chosen because they reduce immediate risk or improve decision-making data."),
    missedFindings: card("missed-findings", "Frequently Missed Findings", "critical", profile.redFlags, "Missed findings are early failure-to-rescue cues."),
    instructorPoints: card("instructor-points", "Instructor Questioning Points", "teaching", profile.instructorQuestions.map((item) => item.question), "Instructor questions usually test why a finding matters and what the student would do next."),
    medicationPass: card("med-pass", "Medication Pass Prep", "warning", meds.map((med) => medicationPrepLine(med, profile)), "Medication pass prep connects indication, mechanism, side effects, hold parameters, monitoring, and teaching."),
    labs: card("lab-prep", "Lab Interpretation Prep", "warning", labs.map((lab) => labPrepLine(lab, profile)), "Lab prep connects values to clinical significance and nursing actions."),
    priorities: card("shift-priorities", "Start-of-Shift Priorities", "critical", [
      ...profile.priorities,
      `Unit context: ${UNIT_LABELS[input.unit]} shifts urgency, monitoring frequency, and escalation threshold.`,
      `Role context: ${roleScope(input.role)}`,
    ], "Start-of-shift priorities are ordered by physiologic risk, safety, time sensitivity, and learner scope."),
  };
}

function cardsForModule(moduleId: ClinicalDayModuleId, cards: ReturnType<typeof buildBaseCards>): ClinicalDayCard[] {
  switch (moduleId) {
    case "patient-assignment":
      return [cards.patientSnapshot, cards.assessments, cards.labs, cards.medicationPass, cards.complications, cards.instructorPoints];
    case "tomorrow-cheat-sheet":
      return [cards.topTen, cards.assessments, cards.complications, cards.interventions, cards.missedFindings, cards.instructorPoints];
    case "pre-conference":
      return [cards.patientSnapshot, cards.assessments, cards.labs, cards.medicationPass];
    case "post-conference":
      return [cards.missedFindings, cards.priorities];
    case "instructor-questions":
      return [cards.instructorPoints, cards.assessments, cards.labs, cards.medicationPass];
    case "med-pass":
      return [cards.medicationPass];
    case "lab-prep":
      return [cards.labs, cards.missedFindings];
    case "shift-prioritization":
      return [cards.priorities, cards.assessments, cards.missedFindings];
    case "skills-prep":
      return [cards.assessments, cards.interventions];
    case "rapid-review":
      return [cards.topTen, cards.assessments, cards.complications, cards.interventions];
    default:
      return [cards.patientSnapshot];
  }
}

function buildChecklist(moduleId: ClinicalDayModuleId, input: ClinicalDayInput, profile: DxProfile, meds: string[], labs: string[]) {
  if (moduleId === "post-conference") {
    return [
      item("What went well?", "Name a specific assessment, communication moment, or safety behavior."),
      item("What challenged you?", "Connect the challenge to knowledge, confidence, workflow, or communication."),
      item("What would you do differently?", "Choose one behavior that would improve patient safety or clinical reasoning."),
      item("What knowledge gap was identified?", `Review ${profile.label} pathophysiology, medications, labs, or complications.`),
      item("What should be reviewed before next shift?", "Pick one diagnosis, one medication, and one red flag."),
    ];
  }
  return [
    item("Diagnosis review", profile.pathophysiology),
    item("Medication review", meds.join(", ")),
    item("Lab review", labs.join(", ")),
    item("Assessment review", profile.assessments.join("; ")),
    item("Safety review", profile.redFlags.join("; ")),
    item("Personal notes", input.notes || "Add instructor-specific expectations or unit routines."),
  ];
}

function buildQuestions(moduleId: ClinicalDayModuleId, profile: DxProfile): InstructorQuestion[] {
  if (moduleId === "instructor-questions") return expandQuestions(profile);
  return profile.instructorQuestions.slice(0, 4);
}

function expandQuestions(profile: DxProfile): InstructorQuestion[] {
  const generated: InstructorQuestion[] = [
    ...profile.instructorQuestions,
    q("Pharmacology", "Beginner", `Name one common medication for ${profile.label} and what you monitor.`, `Common options include ${profile.medications.join(", ")}. Monitoring depends on the drug and patient response.`, "Medication questions test indication plus safety monitoring."),
    q("Labs", "Beginner", `Which lab would you check before clinical for ${profile.label}?`, `Priority labs include ${profile.labs.join(", ")}.`, "Lab questions test whether students can connect values to nursing actions."),
    q("Teaching", "Intermediate", "What would you teach this patient before discharge?", `Teach warning signs, medication purpose, follow-up, and when to seek help for ${profile.redFlags.slice(0, 2).join(" or ")}.`, "Patient teaching must match the diagnosis and likely complications."),
    q("Prioritization", "Advanced", "What would you assess first at the start of shift?", profile.assessments[0], "First assessment should target the highest-risk deterioration pathway."),
  ];
  return generated;
}

function buildRapidReview(profile: DxProfile): ClinicalDayCard[] {
  return [
    card("rapid-patho", `${profile.label}: Pathophysiology`, "teaching", [profile.pathophysiology], "Rapid review starts with why the disease creates the patient's findings."),
    card("rapid-assess", `${profile.label}: Assessments`, "critical", profile.assessments, "Assessments are selected because they detect deterioration or response to therapy."),
    card("rapid-meds", `${profile.label}: Medications`, "warning", profile.medications, "Medication review prepares students for safe administration and instructor questions."),
    card("rapid-red-flags", `${profile.label}: Red Flags`, "critical", profile.redFlags, "Red flags are escalation triggers."),
  ];
}

function mergeMedicationList(inputMeds: string, defaultMeds: string[]): string[] {
  const entered = splitList(inputMeds);
  return Array.from(new Set([...entered, ...defaultMeds])).slice(0, 8);
}

function mergeLabList(inputLabs: string, defaultLabs: string[]): string[] {
  const entered = splitList(inputLabs).map((item) => item.replace(/\s+/g, " ").trim());
  return Array.from(new Set([...entered, ...defaultLabs])).slice(0, 8);
}

function splitList(value: string): string[] {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function medicationPrepLine(medication: string, profile: DxProfile): string {
  const text = medication.toLowerCase();
  if (/furosemide|lasix|diuretic/.test(text)) return `${medication}: loop diuretic; monitor BP, urine output, daily weight, potassium, creatinine; hold/clarify for hypotension or unsafe labs per policy; teach dizziness and fluid/weight reporting.`;
  if (/metoprolol|beta/.test(text)) return `${medication}: beta blocker; monitor HR/BP; watch bradycardia, hypotension, fatigue; teach not to stop abruptly.`;
  if (/insulin|glargine|lispro|aspart/.test(text)) return `${medication}: insulin; monitor glucose and meal intake; watch hypoglycemia; teach timing, symptoms, and rapid treatment.`;
  if (/antibiotic|cef|penicillin|azithro|vanco|amoxicillin/.test(text)) return `${medication}: antimicrobial; verify allergies, cultures/orders, response, diarrhea/rash; teach completing therapy as prescribed.`;
  return `${medication}: connect indication to ${profile.label}, verify allergies/orders, monitor expected effect, major side effects, hold parameters, and patient teaching.`;
}

function labPrepLine(lab: string, profile: DxProfile): string {
  const text = lab.toLowerCase();
  if (/potassium| k\b/.test(text)) return `${lab}: normal approx. 3.5-5.0 mmol/L; abnormal values increase dysrhythmia risk and affect diuretics, insulin, and cardiac meds.`;
  if (/creatinine|egfr/.test(text)) return `${lab}: renal function affects perfusion assessment, medication dosing, contrast safety, and fluid decisions.`;
  if (/bnp/.test(text)) return `${lab}: elevated values support cardiac stretch and volume overload in the right clinical picture.`;
  if (/wbc/.test(text)) return `${lab}: infection/inflammation marker; trend with fever, source, lactate, and patient appearance.`;
  if (/glucose/.test(text)) return `${lab}: connect value to symptoms, meal intake, insulin timing, infection stress, and safety.`;
  return `${lab}: review normal range, patient value, why it is ordered for ${profile.label}, and the nursing action if abnormal.`;
}

function buildQualityFlags(input: ClinicalDayInput, profile: DxProfile): string[] {
  const flags: string[] = [];
  if (!input.diagnosis.trim()) flags.push("Diagnosis missing: default rapid-review profile used.");
  if (profile === FALLBACK_PROFILE && !/heart failure|chf|hf|pulmonary edema/i.test(input.diagnosis)) {
    flags.push("Diagnosis not recognized in current Phase 1 profile set: heart failure framework used as a safe fallback.");
  }
  if (!input.medications.trim()) flags.push("Medication list missing: output includes common medication classes, not patient-specific med pass prep.");
  if (!input.labs.trim()) flags.push("Labs missing: output includes priority labs to review, not patient-specific values.");
  return flags;
}

function roleScope(role: ClinicalDayRole): string {
  if (role === "np-student") return "NP students should add diagnostic reasoning, management options, prescribing considerations, and follow-up.";
  if (role === "rpn-lpn-student") return "RPN/LPN students should emphasize recognition, monitoring, safe medication administration, reporting, and escalation.";
  return "RN students should emphasize focused assessment, prioritization, care planning, communication, and reassessment.";
}

function card(id: string, title: string, priority: ClinicalDayPriority, bullets: string[], rationale: string): ClinicalDayCard {
  return { id, title, priority, bullets: bullets.slice(0, 10), rationale };
}

function item(label: string, rationale: string) {
  return { label, doneByDefault: false, rationale };
}

function q(
  category: InstructorQuestion["category"],
  difficulty: InstructorQuestion["difficulty"],
  question: string,
  modelAnswer: string,
  rationale: string,
): InstructorQuestion {
  return { category, difficulty, question, modelAnswer, rationale };
}

function formatCard(card: ClinicalDayCard): string[] {
  return [card.title, `Rationale: ${card.rationale}`, ...card.bullets.map((bullet) => `- ${bullet}`)];
}
