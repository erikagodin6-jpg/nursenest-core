export type MarketingShowcaseKind =
  | "lesson"
  | "ecg-case"
  | "simulation"
  | "cat-question"
  | "bowtie-question"
  | "matrix-question"
  | "sata-question"
  | "readiness-report"
  | "clinical-skill"
  | "lab-activity"
  | "medication-math-activity"
  | "pharmacology-activity"
  | "flashcard-example"
  | "question-bank-item";

export type MarketingShowcaseAudience =
  | "homepage"
  | "pricing"
  | "sales"
  | "institutional"
  | "investor"
  | "onboarding"
  | "promotional";

export type MarketingShowcaseScores = {
  visualAppeal: number;
  educationalValue: number;
  clinicalDepth: number;
  conversionPotential: number;
  screenshotQuality: number;
};

export type MarketingShowcaseFlags = {
  marketingPriority: true;
  marketingShowcase: true;
  featuredScreenshotCandidate: true;
};

export type MarketingShowcaseItem = {
  id: string;
  kind: MarketingShowcaseKind;
  title: string;
  pathway: "RN" | "RPN" | "NP" | "New Graduate" | "Allied";
  entryRoute: string;
  activitySlug: string;
  description: string;
  educationalState: string;
  screenshotInstruction: string;
  audiences: readonly MarketingShowcaseAudience[];
  tags: readonly string[];
  scores: MarketingShowcaseScores;
  showcaseScore: number;
  flags: MarketingShowcaseFlags;
};

export type MarketingDemoLearner = {
  id: string;
  label: string;
  persona: "struggling-student" | "improving-student" | "exam-ready-student" | "high-achiever";
  readinessScore: number;
  trend: readonly number[];
  strengths: readonly string[];
  weakAreas: readonly string[];
  recommendations: readonly string[];
  flags: MarketingShowcaseFlags;
};

export const MARKETING_SHOWCASE_FLAGS: MarketingShowcaseFlags = {
  marketingPriority: true,
  marketingShowcase: true,
  featuredScreenshotCandidate: true,
};

const scoreWeights = {
  visualAppeal: 0.22,
  educationalValue: 0.22,
  clinicalDepth: 0.2,
  conversionPotential: 0.2,
  screenshotQuality: 0.16,
} as const satisfies Record<keyof MarketingShowcaseScores, number>;

export function scoreMarketingShowcaseItem(scores: MarketingShowcaseScores): number {
  return Math.round(
    Object.entries(scoreWeights).reduce((total, [key, weight]) => {
      return total + scores[key as keyof MarketingShowcaseScores] * weight;
    }, 0),
  );
}

function routeFor(kind: MarketingShowcaseKind): string {
  switch (kind) {
    case "lesson":
      return "/app/lessons?pathwayId=ca-rn-nclex-rn";
    case "ecg-case":
      return "/modules/ecg/interactive";
    case "simulation":
      return "/app/simulations?pathwayId=ca-rn-nclex-rn";
    case "cat-question":
      return "/app/practice-tests/cat-launch?pathwayId=ca-rn-nclex-rn";
    case "bowtie-question":
    case "matrix-question":
    case "sata-question":
    case "question-bank-item":
      return "/app/practice-tests?pathwayId=ca-rn-nclex-rn";
    case "readiness-report":
      return "/app/account/readiness";
    case "clinical-skill":
      return "/app/clinical-skills?pathwayId=ca-rn-nclex-rn";
    case "lab-activity":
      return "/app/labs?pathwayId=ca-rn-nclex-rn";
    case "medication-math-activity":
      return "/app/med-calculations?pathwayId=ca-rn-nclex-rn";
    case "pharmacology-activity":
      return "/app/pharmacology?pathwayId=ca-rn-nclex-rn";
    case "flashcard-example":
      return "/app/flashcards?pathwayId=ca-rn-nclex-rn";
  }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function item(args: {
  kind: MarketingShowcaseKind;
  title: string;
  pathway?: MarketingShowcaseItem["pathway"];
  description: string;
  educationalState: string;
  screenshotInstruction: string;
  tags: readonly string[];
  scores: MarketingShowcaseScores;
  audiences?: readonly MarketingShowcaseAudience[];
}): MarketingShowcaseItem {
  const activitySlug = slugify(args.title);
  return {
    id: `${args.kind}:${activitySlug}`,
    kind: args.kind,
    title: args.title,
    pathway: args.pathway ?? "RN",
    entryRoute: routeFor(args.kind),
    activitySlug,
    description: args.description,
    educationalState: args.educationalState,
    screenshotInstruction: args.screenshotInstruction,
    audiences: args.audiences ?? ["homepage", "pricing", "sales", "onboarding"],
    tags: args.tags,
    scores: args.scores,
    showcaseScore: scoreMarketingShowcaseItem(args.scores),
    flags: MARKETING_SHOWCASE_FLAGS,
  };
}

function showcaseScores(seed: number, overrides: Partial<MarketingShowcaseScores> = {}): MarketingShowcaseScores {
  const base = 88 + (seed % 8);
  return {
    visualAppeal: Math.min(99, base + 2),
    educationalValue: Math.min(99, base + 4),
    clinicalDepth: Math.min(99, base + 3),
    conversionPotential: Math.min(99, base + 1),
    screenshotQuality: Math.min(99, base + 2),
    ...overrides,
  };
}

const ecgCases = [
  "Atrial Fibrillation With Rapid Ventricular Response",
  "Supraventricular Tachycardia With Vagal Maneuver Decision",
  "Monomorphic Ventricular Tachycardia",
  "Inferior STEMI With Escalation",
  "Mobitz II Heart Block",
  "Symptomatic Bradycardia",
  "Hyperkalemia ECG Changes",
  "Torsades De Pointes Risk",
  "Pediatric SVT Recognition",
  "Complete Heart Block Deterioration",
] as const;

const bowtieQuestions = [
  "Sepsis Shock Priority Bowtie",
  "Stroke Thrombolysis Screening Bowtie",
  "Diabetic Ketoacidosis Bowtie",
  "Postpartum Hemorrhage Bowtie",
  "Pulmonary Embolism Deterioration Bowtie",
  "Anaphylaxis Emergency Bowtie",
  "Hyperkalemia Cardiac Safety Bowtie",
  "GI Bleed Hypovolemia Bowtie",
  "Opioid Respiratory Depression Bowtie",
  "Neutropenic Fever Bowtie",
  "Heart Failure Pulmonary Edema Bowtie",
  "Pediatric Dehydration Bowtie",
  "Severe Preeclampsia Bowtie",
  "Malignant Hyperthermia Bowtie",
  "Acute Transfusion Reaction Bowtie",
  "Severe Asthma Exacerbation Bowtie",
  "Acute Coronary Syndrome Bowtie",
  "Increased Intracranial Pressure Bowtie",
  "Compartment Syndrome Bowtie",
  "Severe Hypoglycemia Bowtie",
] as const;

const matrixQuestions = [
  "Sepsis Lab Trend Matrix",
  "COPD ABG Interpretation Matrix",
  "Telemetry Priority Findings Matrix",
  "Anticoagulant Safety Matrix",
  "Stroke Assessment Matrix",
  "Postpartum Assessment Matrix",
  "Pediatric Respiratory Distress Matrix",
  "Infection Control Precautions Matrix",
  "Delegation And Acuity Matrix",
  "Wound Infection Assessment Matrix",
  "Acute Kidney Injury Matrix",
  "DKA Clinical Judgment Matrix",
  "Suicide Safety Matrix",
  "Pain And Sedation Matrix",
  "IV Infiltration Matrix",
  "Chest Tube Assessment Matrix",
  "Oxygen Delivery Matrix",
  "Isolation PPE Matrix",
  "Dysphagia Safety Matrix",
  "Discharge Teaching Readiness Matrix",
] as const;

const questionBankTopics = [
  "Sepsis First Action",
  "Heart Failure Weight Gain",
  "COPD Oxygen Titration",
  "Stroke Last Known Well",
  "DKA Fluid Priority",
  "Hyperkalemia ECG Risk",
  "Postpartum Hemorrhage",
  "Pediatric Dehydration",
  "Neutropenic Fever",
  "Pulmonary Embolism",
  "Digoxin Toxicity",
  "Warfarin Teaching",
  "Insulin Safety",
  "Chest Tube Bubbling",
  "Tracheostomy Dislodgement",
  "Acute Kidney Injury",
  "GI Bleed Shock",
  "Preeclampsia Warning Signs",
  "Magnesium Toxicity",
  "Compartment Syndrome",
  "Anaphylaxis Epinephrine",
  "Opioid Reversal",
  "Delirium Safety",
  "Suicide Precautions",
  "Delegation To UAP",
  "RN Scope Prioritization",
  "Blood Transfusion Reaction",
  "Central Line Infection",
  "Hypoglycemia Rescue",
  "Hyponatremia Seizure Risk",
  "Acute Coronary Syndrome",
  "Atrial Fibrillation Anticoagulation",
  "Pneumonia Deterioration",
  "Asthma Exhaustion",
  "Pain Reassessment",
  "Fall Risk Prevention",
  "Pressure Injury Staging",
  "Wound Drainage",
  "Medication Reconciliation",
  "SBAR Escalation",
  "Informed Consent",
  "Isolation Room Entry",
  "C. Difficile Precautions",
  "IV Potassium Safety",
  "Pediatric Fever",
  "Meningitis Precautions",
  "Seizure Safety",
  "Burn Fluid Resuscitation",
  "DKA Potassium Shift",
  "Heart Block Symptomatic Bradycardia",
] as const;

const lessonTopics = [
  "Heart Failure Clinical Reasoning Lesson",
  "Sepsis Recognition And Escalation Lesson",
  "COPD Exacerbation Lesson",
  "Stroke Priority Assessment Lesson",
  "Diabetic Ketoacidosis Lesson",
  "Medication Safety Lesson",
  "Chest Tube Management Lesson",
  "Tracheostomy Emergency Lesson",
  "Postpartum Hemorrhage Lesson",
  "Pediatric Respiratory Distress Lesson",
  "Acute Kidney Injury Lesson",
  "Electrolyte Emergencies Lesson",
  "Delegation And Prioritization Lesson",
  "Clinical Judgment Framework Lesson",
  "Blood Transfusion Safety Lesson",
  "Shock States Lesson",
  "Acute Coronary Syndrome Lesson",
  "Mental Health Safety Lesson",
  "Infection Control Decision-Making Lesson",
  "Documentation And SBAR Lesson",
] as const;

const simulationTopics = [
  "Heart Failure Deterioration Simulation",
  "Sepsis Rapid Response Simulation",
  "COPD Respiratory Failure Simulation",
  "Postoperative Hemorrhage Simulation",
  "Pediatric Asthma Simulation",
  "Stroke Escalation Simulation",
  "DKA Emergency Simulation",
  "Anaphylaxis Simulation",
  "Chest Pain Telemetry Simulation",
  "Medication Error Recovery Simulation",
] as const;

const clinicalSkillTopics = [
  "Tracheostomy Care Workflow",
  "Chest Tube Management Workflow",
  "Medication Administration Safety Workflow",
  "Head-To-Toe Assessment Workflow",
  "Wound Care Decision Workflow",
  "Central Line Safety Workflow",
  "Oxygen Therapy Escalation Workflow",
  "Foley Catheter Insertion Workflow",
  "Blood Transfusion Verification Workflow",
  "Neurological Assessment Workflow",
] as const;

const labTopics = [
  "Hyperkalemia Lab Interpretation",
  "Sepsis Lactate Interpretation",
  "Heart Failure BNP Interpretation",
  "Acute Kidney Injury Creatinine Interpretation",
  "DKA Anion Gap Interpretation",
  "GI Bleed Hemoglobin Trend",
  "Coagulation Safety Interpretation",
  "ABG Respiratory Failure Interpretation",
  "Hyponatremia Neurological Risk Interpretation",
  "Cardiac Troponin Trend Interpretation",
] as const;

const medicationMathTopics = [
  "Heparin Infusion Titration",
  "Weight-Based Pediatric Dose",
  "IV Pump Rate Calculation",
  "Insulin Correction Scale",
  "Safe Dose Range Check",
  "Dopamine Infusion Calculation",
  "Reconstitution Calculation",
  "mL Per Hour Conversion",
] as const;

const pharmacologyTopics = [
  "Anticoagulant Safety Workflow",
  "Beta Blocker Monitoring Workflow",
  "Diuretic Teaching Workflow",
  "Insulin Safety Workflow",
  "Opioid Safety Workflow",
  "Antibiotic Monitoring Workflow",
  "Magnesium Sulfate Safety Workflow",
  "Vasopressor Monitoring Workflow",
] as const;

const flashcardTopics = [
  "Heart Failure Memory Hook",
  "Sepsis Red Flags",
  "COPD Oxygen Targets",
  "DKA Priority Labs",
  "Stroke Time Window",
  "Hyperkalemia ECG Changes",
  "Magnesium Toxicity",
  "Chest Tube Troubleshooting",
  "Isolation Precautions",
  "Delegation Rules",
] as const;

function buildItems(
  kind: MarketingShowcaseKind,
  topics: readonly string[],
  args: {
    description: (topic: string) => string;
    state: (topic: string) => string;
    instruction: (topic: string) => string;
    tags: readonly string[];
    scoreOverrides?: (index: number, topic: string) => Partial<MarketingShowcaseScores>;
  },
): MarketingShowcaseItem[] {
  return topics.map((topic, index) =>
    item({
      kind,
      title: topic,
      description: args.description(topic),
      educationalState: args.state(topic),
      screenshotInstruction: args.instruction(topic),
      tags: args.tags,
      scores: showcaseScores(index, args.scoreOverrides?.(index, topic)),
    }),
  );
}

export const MARKETING_SHOWCASE_COLLECTION: readonly MarketingShowcaseItem[] = [
  ...buildItems("ecg-case", ecgCases, {
    description: (topic) => `${topic} with strip interpretation, rhythm reasoning, significance, and escalation cues.`,
    state: (topic) => `${topic} opened in ECG Detective Mode with the strip, interpretation workflow, clinical significance, and escalation considerations visible.`,
    instruction: (topic) => `Navigate to ECG, open ${topic}, reveal interpretation and reasoning panels, then capture the strip plus workflow state.`,
    tags: ["ECG", "Telemetry", "Clinical Reasoning", "Escalation"],
    scoreOverrides: (index) => ({ visualAppeal: index < 4 ? 98 : 94, screenshotQuality: index < 4 ? 97 : 93 }),
  }),
  ...buildItems("bowtie-question", bowtieQuestions, {
    description: (topic) => `${topic} with condition, priority actions, monitoring parameters, and professional rationale visible.`,
    state: (topic) => `${topic} completed with all answer zones filled and rationale revealed.`,
    instruction: (topic) => `Open ${topic}, select the correct condition, actions, and monitoring priorities, submit, and capture the completed bowtie with rationale.`,
    tags: ["NGN", "Bowtie", "Priority", "Rationale"],
    scoreOverrides: (index) => ({ conversionPotential: index < 8 ? 98 : 93 }),
  }),
  ...buildItems("matrix-question", matrixQuestions, {
    description: (topic) => `${topic} with completed selections, clinical scenario, and explanation visible.`,
    state: (topic) => `${topic} completed with matrix selections and rationale open.`,
    instruction: (topic) => `Open ${topic}, complete the matrix, reveal the explanation, and capture the finished learning state.`,
    tags: ["NGN", "Matrix", "Clinical Judgment", "Rationale"],
    scoreOverrides: (index) => ({ visualAppeal: index < 6 ? 96 : 92 }),
  }),
  ...buildItems("question-bank-item", questionBankTopics, {
    description: (topic) => `${topic} with high-quality distractors, why-incorrect teaching, clinical pearl, and exam strategy.`,
    state: (topic) => `${topic} answered with correct answer, selected answer, detailed rationale, why-tempting distractor analysis, and clinical pearl visible.`,
    instruction: (topic) => `Open ${topic}, answer it, reveal rationale, expand clinical pearl and exam strategy, then capture the answer state.`,
    tags: ["Question Bank", "Rationale", "Clinical Pearl", "Distractors"],
    scoreOverrides: (index) => ({ educationalValue: index < 12 ? 99 : 93 }),
  }),
  ...buildItems("lesson", lessonTopics, {
    description: (topic) => `${topic} with visual hierarchy, clinical pearl, knowledge check, and applied reasoning.`,
    state: (topic) => `${topic} opened past the introduction with clinical teaching, a pearl, and knowledge check visible.`,
    instruction: (topic) => `Open ${topic}, advance to the applied reasoning section, reveal the knowledge check, and capture the lesson body state.`,
    tags: ["Lesson", "Knowledge Check", "Clinical Pearl", "Reasoning"],
    scoreOverrides: (index) => ({ screenshotQuality: index < 8 ? 96 : 92 }),
  }),
  ...buildItems("simulation", simulationTopics, {
    description: (topic) => `${topic} with vitals, deterioration cues, clinical decisions, and consequence feedback.`,
    state: (topic) => `${topic} paused at an active decision point with vitals, patient context, choices, and outcome feedback visible.`,
    instruction: (topic) => `Open ${topic}, progress to the first deterioration branch, choose an action, reveal consequence feedback, and capture the active scenario.`,
    tags: ["Simulation", "Deterioration", "Decision Point", "Consequences"],
    scoreOverrides: () => ({ visualAppeal: 97, conversionPotential: 98, screenshotQuality: 96 }),
  }),
  ...buildItems("clinical-skill", clinicalSkillTopics, {
    description: (topic) => `${topic} with steps, reasoning prompts, safety checks, and interactive feedback.`,
    state: (topic) => `${topic} displayed in an interactive workflow with decision-making, safety checks, and feedback visible.`,
    instruction: (topic) => `Open ${topic}, advance to the safety decision step, reveal feedback, and capture the workflow.`,
    tags: ["Clinical Skills", "Workflow", "Safety", "Competency"],
  }),
  ...buildItems("lab-activity", labTopics, {
    description: (topic) => `${topic} with abnormal values, clinical meaning, nursing actions, and escalation cues.`,
    state: (topic) => `${topic} opened in the lab workstation with abnormal values, interpretation, nursing priorities, and rationale visible.`,
    instruction: (topic) => `Open ${topic}, select the clinically significant abnormal value, reveal interpretation and nursing priorities, then capture the workstation.`,
    tags: ["Labs", "Interpretation", "Clinical Analysis", "Escalation"],
  }),
  ...buildItems("medication-math-activity", medicationMathTopics, {
    description: (topic) => `${topic} with formula setup, safe range check, calculation, and answer validation.`,
    state: (topic) => `${topic} showing formula setup, calculator input, completed answer, and safety validation.`,
    instruction: (topic) => `Open ${topic}, enter a completed calculation, reveal validation and safety feedback, then capture the activity.`,
    tags: ["Medication Math", "Safety", "Calculator", "Validation"],
  }),
  ...buildItems("pharmacology-activity", pharmacologyTopics, {
    description: (topic) => `${topic} with medication class, monitoring, contraindications, and patient teaching.`,
    state: (topic) => `${topic} opened with nursing considerations, monitoring parameters, and rationale visible.`,
    instruction: (topic) => `Open ${topic}, reveal monitoring and nursing considerations, then capture the medication learning workflow.`,
    tags: ["Pharmacology", "Medication Safety", "Monitoring", "Patient Teaching"],
  }),
  ...buildItems("flashcard-example", flashcardTopics, {
    description: (topic) => `${topic} flashcard with answer, rationale, clinical pearl, and memory hook visible.`,
    state: (topic) => `${topic} flipped with the answer, rationale, clinical pearl, and memory hook visible.`,
    instruction: (topic) => `Open ${topic}, flip the card, reveal rationale and memory hook, then capture the study state.`,
    tags: ["Flashcards", "Active Recall", "Memory Hook", "Clinical Pearl"],
  }),
  ...buildItems("cat-question", ["Adaptive Prioritization CAT Question", "Clinical Judgment CAT Question", "Safety And Infection Control CAT Question", "Physiological Adaptation CAT Question", "Management Of Care CAT Question"], {
    description: (topic) => `${topic} in progress with timer, progress, difficulty signal, and answer choices.`,
    state: (topic) => `${topic} active in CAT mode with timer, progress, adaptive context, and answer choices visible.`,
    instruction: (topic) => `Launch ${topic}, stop before submission, and capture the active exam state.`,
    tags: ["CAT", "Adaptive", "Exam", "Question In Progress"],
    scoreOverrides: () => ({ conversionPotential: 96, screenshotQuality: 95 }),
  }),
  ...buildItems("sata-question", ["Sepsis Findings SATA", "Heart Failure Teaching SATA", "DKA Priority Orders SATA", "Stroke Safety SATA", "Pediatric Respiratory Distress SATA", "Postpartum Hemorrhage SATA", "Anticoagulant Teaching SATA", "Isolation Precautions SATA", "Chest Tube Complications SATA", "Hypoglycemia Safety SATA"], {
    description: (topic) => `${topic} with completed select-all-that-apply responses and rationale visible.`,
    state: (topic) => `${topic} answered with selected options, missed options, rationale, and clinical pearl visible.`,
    instruction: (topic) => `Open ${topic}, submit selected responses, reveal rationale, and capture the completed SATA state.`,
    tags: ["SATA", "Question Bank", "Rationale", "Clinical Judgment"],
  }),
  ...buildItems("readiness-report", ["Struggling Student Readiness Report", "Improving Student Readiness Report", "Exam Ready Student Readiness Report", "High Achiever Readiness Report"], {
    description: (topic) => `${topic} with trends, weak areas, strengths, recommendations, and next-step study plan.`,
    state: (topic) => `${topic} populated with realistic readiness trend data, strengths, weak areas, and recommendations.`,
    instruction: (topic) => `Load ${topic}, ensure trend data and recommendations are visible, then capture the analytics state.`,
    tags: ["Readiness", "Analytics", "Recommendations", "Progress"],
    scoreOverrides: () => ({ visualAppeal: 94, conversionPotential: 97, screenshotQuality: 95 }),
  }),
] as const;

export const MARKETING_DEMO_LEARNERS: readonly MarketingDemoLearner[] = [
  {
    id: "demo-learner-struggling-student",
    label: "Struggling Student",
    persona: "struggling-student",
    readinessScore: 48,
    trend: [42, 44, 46, 48],
    strengths: ["Medication Safety Basics", "Infection Control"],
    weakAreas: ["Prioritization", "Respiratory Deterioration", "Lab Interpretation"],
    recommendations: ["Start COPD Oxygen Titration", "Review ABG Respiratory Failure", "Complete Sepsis First Action"],
    flags: MARKETING_SHOWCASE_FLAGS,
  },
  {
    id: "demo-learner-improving-student",
    label: "Improving Student",
    persona: "improving-student",
    readinessScore: 68,
    trend: [51, 56, 62, 68],
    strengths: ["Clinical Judgment", "Pharmacology Monitoring"],
    weakAreas: ["Delegation", "Maternal Emergencies"],
    recommendations: ["Complete Delegation And Acuity Matrix", "Practice Postpartum Hemorrhage Bowtie"],
    flags: MARKETING_SHOWCASE_FLAGS,
  },
  {
    id: "demo-learner-exam-ready-student",
    label: "Exam Ready Student",
    persona: "exam-ready-student",
    readinessScore: 86,
    trend: [74, 79, 83, 86],
    strengths: ["Prioritization", "Safety", "Physiological Adaptation"],
    weakAreas: ["Pediatric Respiratory Distress"],
    recommendations: ["Maintain CAT cadence", "Review pediatric respiratory safety flashcards"],
    flags: MARKETING_SHOWCASE_FLAGS,
  },
  {
    id: "demo-learner-high-achiever",
    label: "High Achiever",
    persona: "high-achiever",
    readinessScore: 94,
    trend: [84, 88, 91, 94],
    strengths: ["Clinical Reasoning", "ECG Interpretation", "Lab Interpretation", "Delegation"],
    weakAreas: ["Sustained Review Spacing"],
    recommendations: ["Continue smart review", "Complete final readiness CAT"],
    flags: MARKETING_SHOWCASE_FLAGS,
  },
] as const;

export const MARKETING_SHOWCASE_MINIMUMS = {
  "ecg-case": 10,
  "bowtie-question": 20,
  "matrix-question": 20,
  "question-bank-item": 50,
  lesson: 20,
  simulation: 10,
  "clinical-skill": 10,
} as const satisfies Partial<Record<MarketingShowcaseKind, number>>;

export function getMarketingShowcaseItems(kind?: MarketingShowcaseKind): MarketingShowcaseItem[] {
  const items = kind
    ? MARKETING_SHOWCASE_COLLECTION.filter((candidate) => candidate.kind === kind)
    : [...MARKETING_SHOWCASE_COLLECTION];
  return items.sort((a, b) => b.showcaseScore - a.showcaseScore || a.title.localeCompare(b.title));
}

export function selectMarketingShowcaseCandidates(args: {
  kind?: MarketingShowcaseKind;
  audience?: MarketingShowcaseAudience;
  limit?: number;
} = {}): MarketingShowcaseItem[] {
  const limit = args.limit ?? 12;
  return getMarketingShowcaseItems(args.kind)
    .filter((candidate) => !args.audience || candidate.audiences.includes(args.audience))
    .slice(0, limit);
}

export function getTopMarketingShowcaseItem(kind: MarketingShowcaseKind): MarketingShowcaseItem | undefined {
  return selectMarketingShowcaseCandidates({ kind, limit: 1 })[0];
}

export function getMarketingShowcaseCoverage(): Record<MarketingShowcaseKind, number> {
  return MARKETING_SHOWCASE_COLLECTION.reduce(
    (coverage, candidate) => {
      coverage[candidate.kind] = (coverage[candidate.kind] ?? 0) + 1;
      return coverage;
    },
    {} as Record<MarketingShowcaseKind, number>,
  );
}

export function assertMarketingShowcaseMinimums(): void {
  const coverage = getMarketingShowcaseCoverage();
  for (const [kind, minimum] of Object.entries(MARKETING_SHOWCASE_MINIMUMS)) {
    const actual = coverage[kind as MarketingShowcaseKind] ?? 0;
    if (actual < minimum) {
      throw new Error(`Marketing showcase ${kind} has ${actual} items; expected at least ${minimum}.`);
    }
  }
}
