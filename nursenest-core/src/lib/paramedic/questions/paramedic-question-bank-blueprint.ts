export type ParamedicQuestionDomain =
  | "airway"
  | "trauma"
  | "ecg-cardiology"
  | "pharmacology"
  | "medical-emergencies"
  | "pediatrics"
  | "operations";

export type ParamedicQuestionDifficulty = "foundation" | "operational" | "advanced" | "critical";

export type ParamedicQuestionStyle =
  | "single-best-answer"
  | "clinical-judgment"
  | "scenario-sequence"
  | "ecg-interpretation"
  | "transport-decision";

export interface ParamedicQuestionBankTarget {
  domain: ParamedicQuestionDomain;
  label: string;
  targetCount: number;
  minimumLaunchCount: number;
  priority: "p0" | "p1" | "p2";
  rationale: string;
}

export interface ParamedicSeedQuestion {
  id: string;
  domain: ParamedicQuestionDomain;
  difficulty: ParamedicQuestionDifficulty;
  style: ParamedicQuestionStyle;
  stem: string;
  choices: readonly string[];
  correctChoiceIndex: number;
  rationale: string;
  tags: readonly string[];
  remediationLessonSlugs: readonly string[];
}

export const PARAMEDIC_QUESTION_BANK_TARGETS: readonly ParamedicQuestionBankTarget[] = [
  {
    domain: "airway",
    label: "Airway and Respiratory Emergencies",
    targetCount: 450,
    minimumLaunchCount: 120,
    priority: "p0",
    rationale:
      "Airway drives overdose, pediatrics, asthma, pulmonary edema, arrest, trauma, and respiratory failure scenarios.",
  },
  {
    domain: "trauma",
    label: "Trauma and Shock",
    targetCount: 450,
    minimumLaunchCount: 120,
    priority: "p0",
    rationale:
      "Trauma is a core EMS identity pillar and should heavily test XABCDE, hemorrhage, chest trauma, shock, and transport urgency.",
  },
  {
    domain: "ecg-cardiology",
    label: "ECG and Cardiology",
    targetCount: 500,
    minimumLaunchCount: 140,
    priority: "p0",
    rationale:
      "ECG and STEMI are the strongest SEO and simulation differentiators, especially because the EMS slice reuses the canonical ECG module.",
  },
  {
    domain: "pharmacology",
    label: "EMS Pharmacology",
    targetCount: 300,
    minimumLaunchCount: 80,
    priority: "p1",
    rationale:
      "Medication questions should test indications, contraindications, reassessment, and field physiology rather than memorized drug facts.",
  },
  {
    domain: "medical-emergencies",
    label: "Medical Emergencies and Toxicology",
    targetCount: 350,
    minimumLaunchCount: 90,
    priority: "p1",
    rationale:
      "Stroke, seizure, diabetes, anaphylaxis, overdose, sepsis, and altered LOC create high-yield scenario and adaptive exam coverage.",
  },
  {
    domain: "pediatrics",
    label: "Pediatric and Obstetric Emergencies",
    targetCount: 250,
    minimumLaunchCount: 60,
    priority: "p2",
    rationale:
      "Pediatric EMS is high-anxiety and high-consequence, but should follow after core adult instability pillars are stable.",
  },
  {
    domain: "operations",
    label: "EMS Operations, Communication, and MCI",
    targetCount: 200,
    minimumLaunchCount: 40,
    priority: "p2",
    rationale:
      "Operations content supports scene management, transport coordination, documentation, radio reports, and MCI triage.",
  },
];

export const PARAMEDIC_TARGET_QUESTION_COUNT = PARAMEDIC_QUESTION_BANK_TARGETS.reduce(
  (sum, target) => sum + target.targetCount,
  0,
);

export const PARAMEDIC_MINIMUM_LAUNCH_QUESTION_COUNT = PARAMEDIC_QUESTION_BANK_TARGETS.reduce(
  (sum, target) => sum + target.minimumLaunchCount,
  0,
);

export const PARAMEDIC_SEED_QUESTIONS: readonly ParamedicSeedQuestion[] = [
  {
    id: "ems-airway-bvm-overdose-001",
    domain: "airway",
    difficulty: "critical",
    style: "clinical-judgment",
    stem:
      "An adult is found unresponsive with pinpoint pupils, cyanosis, shallow respirations at 6/min, and SpO₂ 78%. Which action should be prioritized before waiting for naloxone to work?",
    choices: [
      "Apply a nasal cannula and reassess in five minutes",
      "Begin assisted ventilation with BVM and oxygen",
      "Place the patient in a seated position and obtain a full SAMPLE history",
      "Administer oral glucose and prepare transport paperwork",
    ],
    correctChoiceIndex: 1,
    rationale:
      "This is ventilation failure. Naloxone may reverse opioid effect, but BVM ventilation addresses immediate hypoxia and inadequate ventilation first.",
    tags: ["airway", "bvm", "overdose", "respiratory-failure", "prioritization"],
    remediationLessonSlugs: ["bvm-ventilation-paramedic", "respiratory-distress-vs-failure"],
  },
  {
    id: "ems-trauma-hemorrhage-xabcde-001",
    domain: "trauma",
    difficulty: "critical",
    style: "scenario-sequence",
    stem:
      "A motorcycle crash patient is pale and confused with a spurting thigh wound. They are gasping but moving air. In the first minute, what should be addressed first?",
    choices: [
      "Complete a full head-to-toe trauma assessment",
      "Control catastrophic external hemorrhage",
      "Apply a cervical collar before any other intervention",
      "Obtain a complete medication history",
    ],
    correctChoiceIndex: 1,
    rationale:
      "XABCDE prioritizes catastrophic hemorrhage before later survey steps. Exsanguinating extremity bleeding can kill before airway reassessment is complete.",
    tags: ["trauma", "xabcde", "hemorrhage", "shock", "tourniquet"],
    remediationLessonSlugs: ["trauma-primary-survey-xabcde", "hemorrhage-control-prehospital"],
  },
  {
    id: "ems-ecg-inferior-stemi-nitro-001",
    domain: "ecg-cardiology",
    difficulty: "critical",
    style: "ecg-interpretation",
    stem:
      "A patient has inferior ST elevation, HR 42, BP 82/48, diaphoresis, and weak radial pulses. Which concern should affect medication and transport decisions?",
    choices: [
      "Inferior STEMI may involve preload dependence and worsening hypotension risk",
      "Inferior STEMI is usually benign when the heart rate is slow",
      "Nitroglycerin should be repeated rapidly until pain resolves regardless of BP",
      "Transport can be delayed because bradycardia lowers myocardial oxygen demand",
    ],
    correctChoiceIndex: 0,
    rationale:
      "Inferior STEMI with hypotension and bradycardia should raise concern for compromised perfusion and possible right-sided involvement. Transport and reassessment are urgent.",
    tags: ["ecg", "stemi", "inferior-stemi", "nitroglycerin", "transport-decision"],
    remediationLessonSlugs: ["inferior-stemi-rural-transport", "ecg-st-t-changes"],
  },
  {
    id: "ems-pharm-naloxone-reassessment-001",
    domain: "pharmacology",
    difficulty: "operational",
    style: "clinical-judgment",
    stem:
      "After naloxone, an overdose patient wakes briefly but becomes drowsy again during transport. What is the best interpretation?",
    choices: [
      "The original respiratory problem can recur and ventilation must be reassessed",
      "The patient is now stable because they woke after naloxone",
      "The patient should be encouraged to walk to improve circulation",
      "Oxygen can be discontinued once the patient opens their eyes",
    ],
    correctChoiceIndex: 0,
    rationale:
      "Naloxone response can be temporary. EMS must reassess respiratory effort, oxygenation, mental status, and ventilation throughout transport.",
    tags: ["pharmacology", "naloxone", "overdose", "reassessment", "airway"],
    remediationLessonSlugs: ["bvm-ventilation-paramedic", "respiratory-distress-vs-failure"],
  },
  {
    id: "ems-medical-stroke-transport-001",
    domain: "medical-emergencies",
    difficulty: "operational",
    style: "transport-decision",
    stem:
      "A patient has sudden facial droop, arm drift, slurred speech, and symptom onset 45 minutes ago. Vitals are stable. What is the most important operational priority?",
    choices: [
      "Delay transport until symptoms fully resolve",
      "Prioritize stroke-capable destination and early notification",
      "Give oral fluids and reassess in 30 minutes",
      "Treat as anxiety because vital signs are stable",
    ],
    correctChoiceIndex: 1,
    rationale:
      "Time-sensitive neurologic symptoms require stroke pathway thinking, destination planning, and early notification even when initial vitals are stable.",
    tags: ["stroke", "transport", "medical-emergencies", "time-sensitive", "neurology"],
    remediationLessonSlugs: ["stroke-assessment", "ems-transport-decisions"],
  },
  {
    id: "ems-peds-respiratory-fatigue-001",
    domain: "pediatrics",
    difficulty: "advanced",
    style: "clinical-judgment",
    stem:
      "A child with respiratory distress becomes quieter, less interactive, and has reduced chest movement after initially crying and wheezing. What does this suggest?",
    choices: [
      "The child is improving because they are less agitated",
      "Respiratory fatigue and possible impending failure",
      "A normal pediatric response to oxygen therapy",
      "A reason to delay transport until a caregiver arrives",
    ],
    correctChoiceIndex: 1,
    rationale:
      "In pediatrics, becoming quiet with decreased interaction and reduced chest movement can signal fatigue and respiratory failure, not improvement.",
    tags: ["pediatrics", "respiratory-failure", "fatigue", "airway", "deterioration"],
    remediationLessonSlugs: ["respiratory-distress-vs-failure", "pediatric-respiratory-failure"],
  },
  {
    id: "ems-ops-radio-stemi-alert-001",
    domain: "operations",
    difficulty: "foundation",
    style: "transport-decision",
    stem:
      "A rural EMS crew identifies a likely STEMI with hypotension and 30-minute transport to PCI. Which communication is most useful early?",
    choices: [
      "A concise STEMI alert with ECG findings, vitals, ETA, and instability concerns",
      "A full past medical history before mentioning the ECG",
      "A request for the receiving hospital to decide whether chest pain is serious",
      "No notification until arrival because the ECG may change",
    ],
    correctChoiceIndex: 0,
    rationale:
      "Early concise notification supports cath-lab activation, destination readiness, and care continuity for time-sensitive STEMI patients.",
    tags: ["operations", "radio-report", "stemi-alert", "transport", "communication"],
    remediationLessonSlugs: ["inferior-stemi-rural-transport", "radio-communication-ems"],
  },
];

export const PARAMEDIC_CURRENT_SEEDED_QUESTION_COUNT = PARAMEDIC_SEED_QUESTIONS.length;

export function getParamedicQuestionTargetsByPriority(priority: ParamedicQuestionBankTarget["priority"]): ParamedicQuestionBankTarget[] {
  return PARAMEDIC_QUESTION_BANK_TARGETS.filter((target) => target.priority === priority);
}

export function getParamedicSeedQuestionsByDomain(domain: ParamedicQuestionDomain): ParamedicSeedQuestion[] {
  return PARAMEDIC_SEED_QUESTIONS.filter((question) => question.domain === domain);
}

export function calculateParamedicQuestionBankReadinessPercent(): number {
  if (PARAMEDIC_MINIMUM_LAUNCH_QUESTION_COUNT <= 0) return 0;
  return Math.min(
    100,
    Math.round((PARAMEDIC_CURRENT_SEEDED_QUESTION_COUNT / PARAMEDIC_MINIMUM_LAUNCH_QUESTION_COUNT) * 100),
  );
}

export const PARAMEDIC_QUESTION_BANK_READINESS_PERCENT = calculateParamedicQuestionBankReadinessPercent();
