import type { BowtieQuestionBankBulkItem } from "@/lib/admin/question-bank-bulk-import";

type TierConfig = {
  tier: BowtieQuestionBankBulkItem["tier"];
  exam: string;
  country: BowtieQuestionBankBulkItem["country"];
  count: number;
  pathwayLabel: string;
  tierFocus: string[];
  categoryPattern: string[];
  bodySystems: string[];
  professionScope?: string;
  difficultyPattern: NonNullable<BowtieQuestionBankBulkItem["difficulty"]>[];
};

type ClinicalPattern = {
  cue: string;
  condition: string;
  action: string;
  monitor: string;
  alternateCondition: string;
  unsafeAction: string;
  unrelatedMonitor: string;
};

const systems = [
  "Cardiovascular",
  "Respiratory",
  "Endocrine",
  "Neurological",
  "Renal/Urinary",
  "Gastrointestinal",
  "Maternal/Newborn",
  "Pediatric",
  "Mental Health",
  "Pharmacology",
  "Infection/Sepsis",
  "Safety/Prioritization",
  "Delegation",
  "Labs/Diagnostics",
  "ECG/Arrhythmia",
  "Fluids/Electrolytes",
] as const;

const pnSystems = systems.filter((system) => system !== "ECG/Arrhythmia");

const configs: TierConfig[] = [
  {
    tier: "RPN",
    exam: "REx-PN",
    country: "CA",
    count: 75,
    pathwayLabel: "RPN / REx-PN",
    tierFocus: ["practical nursing scope", "med-surg fundamentals", "client safety", "medication follow-up"],
    categoryPattern: [
      "Safety/Prioritization",
      "Pharmacology",
      "Fundamentals",
      "Maternal/Newborn",
      "Mental Health",
      "Delegation",
    ],
    bodySystems: pnSystems,
    difficultyPattern: ["FOUNDATION", "INTERMEDIATE", "INTERMEDIATE"],
  },
  {
    tier: "LVN_LPN",
    exam: "NCLEX-PN",
    country: "US",
    count: 75,
    pathwayLabel: "LPN / NCLEX-PN",
    tierFocus: ["practical nursing scope", "basic maternity/peds", "delegated care", "stable med-surg care"],
    categoryPattern: [
      "Safety/Prioritization",
      "Pharmacology",
      "Delegation",
      "Basic Maternity/Peds",
      "Med-Surg",
      "Client Teaching",
    ],
    bodySystems: pnSystems,
    difficultyPattern: ["FOUNDATION", "INTERMEDIATE", "INTERMEDIATE"],
  },
  {
    tier: "NP",
    exam: "NP",
    country: "US",
    count: 75,
    pathwayLabel: "NP",
    tierFocus: ["advanced assessment", "differential diagnosis", "diagnostic selection", "management decisions"],
    categoryPattern: [
      "Differential Diagnosis",
      "Diagnostics",
      "Pharmacology",
      "Red Flags",
      "Management",
      "Follow-up Planning",
    ],
    bodySystems: systems,
    difficultyPattern: ["INTERMEDIATE", "ADVANCED", "ADVANCED"],
  },
  {
    tier: "NEW_GRAD",
    exam: "New Grad Transition",
    country: "US",
    count: 50,
    pathwayLabel: "New Grad",
    tierFocus: ["transition-to-practice", "escalation", "communication", "documentation safety"],
    categoryPattern: [
      "Safety/Prioritization",
      "Delegation",
      "Escalation",
      "Documentation",
      "Communication",
      "Clinical Deterioration",
    ],
    bodySystems: systems,
    difficultyPattern: ["FOUNDATION", "INTERMEDIATE", "INTERMEDIATE"],
  },
  {
    tier: "ALLIED",
    exam: "ALLIED",
    country: "US",
    count: 32,
    pathwayLabel: "Allied Health",
    tierFocus: ["respiratory therapy", "paramedic assessment", "medical laboratory interpretation", "rehab safety"],
    categoryPattern: [
      "Respiratory Therapy",
      "Paramedic/EMT",
      "MLT/Lab Interpretation",
      "PTA/Rehab Safety",
    ],
    bodySystems: ["Respiratory", "Cardiovascular", "Labs/Diagnostics", "Safety/Prioritization"],
    professionScope: "respiratory-paramedic-mlt-pta",
    difficultyPattern: ["FOUNDATION", "INTERMEDIATE", "INTERMEDIATE", "ADVANCED"],
  },
  {
    tier: "PRE_NURSING",
    exam: "Pre-Nursing Foundations",
    country: "US",
    count: 20,
    pathwayLabel: "Pre-Nursing",
    tierFocus: ["clinical reasoning foundations", "A&P vocabulary", "safety basics", "dosage calculation context"],
    categoryPattern: ["A&P Foundations", "Safety Basics", "Medication Math", "Clinical Vocabulary"],
    bodySystems: ["Cardiovascular", "Respiratory", "Endocrine", "Renal/Urinary", "Labs/Diagnostics"],
    difficultyPattern: ["FOUNDATION"],
  },
];

const clientNeedsByCategory: Record<string, string> = {
  "Safety/Prioritization": "safe-effective-care-environment",
  Delegation: "safe-effective-care-environment",
  Pharmacology: "pharmacological-parenteral-therapies",
  "Maternal/Newborn": "health-promotion-maintenance",
  "Basic Maternity/Peds": "health-promotion-maintenance",
  "Mental Health": "psychosocial-integrity",
  Diagnostics: "physiological-integrity",
  "Differential Diagnosis": "physiological-integrity",
  "Red Flags": "reduction-of-risk-potential",
  Management: "physiological-integrity",
  "Follow-up Planning": "health-promotion-maintenance",
};

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function scenarioFor(config: TierConfig, bodySystem: string, category: string, index: number): string {
  const focus = config.tierFocus[index % config.tierFocus.length];
  return `${config.pathwayLabel} learner reviews a ${bodySystem.toLowerCase()} scenario focused on ${category.toLowerCase()} and ${focus}. The client has a changing finding that requires selecting the likely problem, the safest next action, and the best parameter to monitor.`;
}

function vitalSet(bodySystem: string, index: number): Record<string, string> {
  return {
    bloodPressure: `${104 + (index % 28)}/${62 + (index % 18)} mm Hg`,
    heartRate: `${82 + (index % 42)}/min`,
    respiratoryRate: `${16 + (index % 10)}/min`,
    oxygenSaturation: bodySystem === "Respiratory" ? `${88 + (index % 8)}%` : `${94 + (index % 5)}%`,
    temperature: `${36.7 + (index % 5) * 0.2} C`,
  };
}

function labSet(bodySystem: string, index: number): Record<string, string> {
  if (bodySystem === "Endocrine") return { glucose: `${54 + (index % 160)} mg/dL` };
  if (bodySystem === "Renal/Urinary") return { creatinine: `${1.2 + (index % 5) * 0.2} mg/dL` };
  if (bodySystem === "Infection/Sepsis") return { lactate: `${2.1 + (index % 6) * 0.4} mmol/L`, wbc: `${11 + (index % 9)} K/uL` };
  if (bodySystem === "Labs/Diagnostics") return { hemoglobin: `${8 + (index % 6)} g/dL`, potassium: `${3.1 + (index % 18) * 0.1} mEq/L` };
  return { sodium: `${132 + (index % 9)} mEq/L`, potassium: `${3.4 + (index % 14) * 0.1} mEq/L` };
}

function clinicalPattern(bodySystem: string, config: TierConfig, index: number): ClinicalPattern {
  const np = config.tier === "NP";
  const allied = config.tier === "ALLIED";
  const patterns: Record<string, ClinicalPattern> = {
    Cardiovascular: {
      cue: "new chest pressure with diaphoresis and a rising heart rate",
      condition: np ? "Possible acute coronary syndrome" : "Possible decreased cardiac perfusion",
      action: allied
        ? "Stop activity, assess pain, and notify the appropriate clinical lead"
        : np
          ? "Obtain ECG and troponin while activating urgent evaluation"
          : "Stop activity, assess pain, and notify the provider/charge nurse",
      monitor: "Repeat pain score, blood pressure, heart rhythm, and oxygen saturation",
      alternateCondition: "Expected anxiety response",
      unsafeAction: "Encourage ambulation to see if the discomfort resolves",
      unrelatedMonitor: "Document appetite at the next meal",
    },
    Respiratory: {
      cue: allied ? "increasing work of breathing with wheezes and falling SpO2" : "new dyspnea, accessory muscle use, and oxygen saturation below baseline",
      condition: allied ? "Impaired ventilation/oxygenation" : "Impaired gas exchange",
      action: allied ? "Position upright and initiate ordered oxygen/bronchodilator protocol" : "Position high-Fowler's, assess lung sounds, and escalate oxygen concern",
      monitor: "Work of breathing, breath sounds, SpO2 trend, and response to therapy",
      alternateCondition: "Mild seasonal congestion",
      unsafeAction: "Lay the client flat for comfort",
      unrelatedMonitor: "Track meal percentage only",
    },
    Endocrine: {
      cue: "sweating, tremor, confusion, and a low point-of-care glucose after insulin",
      condition: "Hypoglycemia",
      action: "Give fast-acting carbohydrate if safe to swallow and follow the hypoglycemia protocol",
      monitor: "Recheck glucose and mental status in 15 minutes",
      alternateCondition: "Hyperglycemia",
      unsafeAction: "Give the next scheduled insulin dose immediately",
      unrelatedMonitor: "Measure calf circumference",
    },
    Neurological: {
      cue: "new facial droop, slurred speech, and unilateral arm weakness",
      condition: np ? "Possible acute stroke/TIA" : "Acute neurologic change",
      action: np ? "Activate stroke pathway and verify last-known-well time" : "Perform focused neuro check and call rapid response/charge nurse",
      monitor: "Neuro status, airway safety, glucose, and symptom progression",
      alternateCondition: "Expected fatigue after activity",
      unsafeAction: "Offer oral fluids before swallow safety is assessed",
      unrelatedMonitor: "Check routine skin turgor only",
    },
    "Renal/Urinary": {
      cue: "decreasing urine output with rising creatinine and new edema",
      condition: "Possible acute kidney injury/fluid overload",
      action: "Report reduced output and review nephrotoxic medication risk",
      monitor: "Urine output, daily weight, creatinine, potassium, and lung sounds",
      alternateCondition: "Uncomplicated urinary frequency",
      unsafeAction: "Encourage unrestricted oral fluids despite edema",
      unrelatedMonitor: "Count bowel sounds every shift only",
    },
    Gastrointestinal: {
      cue: "coffee-ground emesis, dizziness, and a falling hemoglobin",
      condition: "Possible upper gastrointestinal bleeding",
      action: "Keep NPO, assess hemodynamics, and escalate promptly",
      monitor: "Blood pressure, heart rate, emesis/stool appearance, and hemoglobin trend",
      alternateCondition: "Routine nausea after a large meal",
      unsafeAction: "Give oral NSAIDs for abdominal discomfort",
      unrelatedMonitor: "Ask about sleep quality only",
    },
    "Maternal/Newborn": {
      cue: "boggy uterus with increased lochia after birth",
      condition: "Postpartum hemorrhage risk from uterine atony",
      action: "Massage the fundus and call for help per postpartum protocol",
      monitor: "Fundal tone, lochia amount, vital signs, and dizziness",
      alternateCondition: "Expected scant lochia",
      unsafeAction: "Leave the room and reassess at the next routine round",
      unrelatedMonitor: "Count newborn wet diapers only",
    },
    Pediatric: {
      cue: "child with fever, poor intake, delayed capillary refill, and fewer wet diapers",
      condition: "Dehydration with perfusion concern",
      action: "Assess hydration/perfusion and escalate fluid replacement needs",
      monitor: "Capillary refill, urine output, mental status, and weight",
      alternateCondition: "Normal toddler food preference",
      unsafeAction: "Delay reporting until intake improves overnight",
      unrelatedMonitor: "Measure adult blood pressure cuff size",
    },
    "Mental Health": {
      cue: "direct statement of suicidal intent with a specific plan",
      condition: "High suicide risk",
      action: "Maintain safety precautions and notify the appropriate licensed clinician immediately",
      monitor: "Continuous safety observation and change in intent or agitation",
      alternateCondition: "Mild situational sadness without risk",
      unsafeAction: "Promise confidentiality and leave the client alone",
      unrelatedMonitor: "Monitor cholesterol panel timing",
    },
    Pharmacology: {
      cue: "new bruising and black stools while taking an anticoagulant",
      condition: "Possible anticoagulant-related bleeding",
      action: "Hold unsafe administration until the prescriber/charge nurse is notified per policy",
      monitor: "Bleeding signs, hemoglobin, INR/anti-Xa as applicable, and vital signs",
      alternateCondition: "Expected medication side effect requiring no action",
      unsafeAction: "Administer another dose before assessment",
      unrelatedMonitor: "Trend hearing screening results",
    },
    "Infection/Sepsis": {
      cue: "fever, tachycardia, hypotension trend, and new confusion",
      condition: "Possible sepsis with perfusion risk",
      action: np ? "Initiate sepsis evaluation and timely cultures/lactate/antibiotic planning" : "Notify provider/rapid response and prepare for sepsis protocol",
      monitor: "Blood pressure, mental status, lactate, urine output, and temperature",
      alternateCondition: "Localized mild redness only",
      unsafeAction: "Delay escalation until the next scheduled vital signs",
      unrelatedMonitor: "Track hair loss pattern",
    },
    "Safety/Prioritization": {
      cue: "unsteady gait, orthostatic dizziness, and recent sedating medication",
      condition: "High fall/injury risk",
      action: "Institute fall precautions and assist with transfers",
      monitor: "Dizziness, sedation level, gait stability, and orthostatic vital signs",
      alternateCondition: "Independent mobility readiness",
      unsafeAction: "Encourage walking alone to build confidence",
      unrelatedMonitor: "Assess favorite foods",
    },
    Delegation: {
      cue: "multiple assigned tasks with one client newly short of breath",
      condition: "Unstable priority client",
      action: "Assess the unstable client personally and delegate stable routine tasks appropriately",
      monitor: "Respiratory status and completion of delegated routine care",
      alternateCondition: "All clients are equally stable",
      unsafeAction: "Delegate the new assessment of acute dyspnea",
      unrelatedMonitor: "Review unit supply counts only",
    },
    "Labs/Diagnostics": {
      cue: "critical potassium result with muscle weakness and palpitations",
      condition: "Potassium imbalance with dysrhythmia risk",
      action: allied ? "Verify specimen/result integrity and immediately notify the care team" : "Place on cardiac precautions/notify provider per policy",
      monitor: "Cardiac rhythm, repeat potassium, weakness, and renal function",
      alternateCondition: "Benign lab variation without symptoms",
      unsafeAction: "Ignore the result until routine morning review",
      unrelatedMonitor: "Track fluid preference only",
    },
    "ECG/Arrhythmia": {
      cue: "irregular rhythm with dizziness and a rapid ventricular rate",
      condition: np ? "Symptomatic tachyarrhythmia" : "Possible unstable rhythm change",
      action: np ? "Obtain/interpret ECG and determine need for urgent rhythm management" : "Assess perfusion and notify rapid response/provider",
      monitor: "Rhythm strip, blood pressure, chest pain, mentation, and oxygen saturation",
      alternateCondition: "Expected sinus arrhythmia without symptoms",
      unsafeAction: "Send the client to shower before assessment",
      unrelatedMonitor: "Monitor meal intake first",
    },
    "Fluids/Electrolytes": {
      cue: "vomiting, weakness, dry mucous membranes, and orthostatic tachycardia",
      condition: "Fluid volume deficit/electrolyte risk",
      action: "Report dehydration cues and prepare ordered fluid/electrolyte replacement",
      monitor: "Orthostatic vital signs, intake/output, mucous membranes, sodium, and potassium",
      alternateCondition: "Excess fluid volume",
      unsafeAction: "Restrict all fluids without an order",
      unrelatedMonitor: "Check visual acuity only",
    },
  };
  return patterns[bodySystem] ?? patterns["Safety/Prioritization"];
}

function makeItem(config: TierConfig, index: number): BowtieQuestionBankBulkItem {
  const bodySystem = config.bodySystems[index % config.bodySystems.length];
  const clinicalCategory = config.categoryPattern[index % config.categoryPattern.length];
  const pattern = clinicalPattern(bodySystem, config, index);
  const stem = `${config.pathwayLabel} bowtie ${index + 1}: A client has ${pattern.cue}. Which problem, action, and monitoring priority best match?`;
  const base = slug(`${config.tier}_${config.exam}_${bodySystem}_${clinicalCategory}_${index + 1}`);
  const condition = `${base}_condition`;
  const intervention = `${base}_action`;
  const monitoring = `${base}_monitor`;
  const distractorA = `${base}_distractor_a`;
  const distractorB = `${base}_distractor_b`;
  const distractorC = `${base}_distractor_c`;
  const focus = config.tierFocus[index % config.tierFocus.length];

  return {
    stem,
    scenario: scenarioFor(config, bodySystem, clinicalCategory, index),
    patientContext: `${config.pathwayLabel} ${focus}; ${pattern.cue}.`,
    rationale: `The safest bowtie mapping links ${pattern.condition.toLowerCase()} to ${pattern.action.toLowerCase()} and then reassesses ${pattern.monitor.toLowerCase()}.`,
    questionType: "BOWTIE",
    country: config.country,
    tier: config.tier,
    exam: config.exam,
    difficulty: config.difficultyPattern[index % config.difficultyPattern.length],
    topicTag: clinicalCategory,
    systemTag: bodySystem,
    bodySystem,
    clinicalCategory,
    clientNeedsCategory: clientNeedsByCategory[clinicalCategory] ?? "physiological-integrity",
    clinicalJudgmentFunction: index % 3 === 0 ? "Recognize cues" : index % 3 === 1 ? "Take action" : "Evaluate outcomes",
    safetyPriorityTags: ["priority", slug(clinicalCategory)],
    tags: ["bowtie", slug(config.pathwayLabel), slug(bodySystem), slug(clinicalCategory)],
    regionScope: config.country === "CA" ? "CA_ONLY" : "US_ONLY",
    professionScope: config.professionScope,
    vitals: vitalSet(bodySystem, index),
    labs: labSet(bodySystem, index),
    bank: [
      { id: condition, label: pattern.condition },
      { id: distractorA, label: pattern.alternateCondition, rationale: "This option does not explain the priority change." },
      { id: intervention, label: pattern.action },
      { id: distractorB, label: pattern.unsafeAction, rationale: "This response delays or worsens care for the priority cue." },
      { id: monitoring, label: pattern.monitor },
      { id: distractorC, label: pattern.unrelatedMonitor, rationale: "This does not confirm response to the priority intervention." },
    ],
    slotLabels: {
      condition: "Condition/problem",
      intervention: "Action to take",
      monitoring: "Parameter/finding to monitor",
    },
    correctMapping: { condition, intervention, monitoring },
    correctRationales: {
      condition: `The cue pattern is most consistent with ${pattern.condition.toLowerCase()}.`,
      intervention: `${pattern.action} directly addresses the priority while staying aligned with ${config.pathwayLabel} scope.`,
      monitoring: `${pattern.monitor} evaluates whether the selected action is working.`,
    },
    distractorRationales: {
      [distractorA]: "This is plausible but not the best explanation for the priority cue.",
      [distractorB]: "Delaying action is unsafe when the client has a changing priority finding.",
      [distractorC]: "This does not measure the outcome tied to the clinical problem.",
    },
  };
}

export const bowtieStarterBatchItems: BowtieQuestionBankBulkItem[] = configs.flatMap((config) =>
  Array.from({ length: config.count }, (_, index) => makeItem(config, index)),
);

export const bowtieStarterBatchConfig = configs.map(({ tier, exam, country, count, pathwayLabel, bodySystems, categoryPattern }) => ({
  tier,
  exam,
  country,
  count,
  pathwayLabel,
  bodySystems,
  categoryPattern,
}));
