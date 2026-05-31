export type AdvancedQuestionProfession =
  | "rn"
  | "rpn-lpn"
  | "np-cnple"
  | "np-fnp"
  | "np-agpcnp"
  | "np-pmhnp"
  | "np-pnp-pc"
  | "np-whnp"
  | "np-enp"
  | "rt"
  | "paramedic"
  | "ot"
  | "pt"
  | "mlt";

export type AdvancedQuestionFormat =
  | "sata"
  | "matrix"
  | "bowtie"
  | "trend-interpretation"
  | "prioritization"
  | "sequencing"
  | "clinical-judgment-case";

export type AdvancedQuestionTier = "tier-1" | "tier-2" | "tier-3" | "np" | "allied";

export type BodySystem =
  | "cardiovascular"
  | "respiratory"
  | "neurological"
  | "endocrine"
  | "renal"
  | "gastrointestinal"
  | "maternal-newborn"
  | "pediatrics"
  | "mental-health"
  | "critical-care"
  | "trauma"
  | "rehabilitation"
  | "laboratory";

export type ReviewStatus = "draft" | "clinical-review" | "editorial-review" | "ready-for-publication" | "published";
export type MonetizationStatus = "not-ready" | "review-gated" | "premium-ready";

export type AdvancedAnswerOption = {
  readonly id: string;
  readonly text: string;
  readonly correct: boolean;
  readonly rationale: string;
};

export type MatrixRow = {
  readonly finding: string;
  readonly assessment: "expected" | "concerning" | "critical";
  readonly intervention: "monitor" | "act-now" | "escalate";
  readonly complicationRisk: "low" | "moderate" | "high";
  readonly rationale: string;
};

export type BowtiePayload = {
  readonly clientCondition: string;
  readonly assessmentFindings: readonly string[];
  readonly immediateActions: readonly string[];
  readonly monitoringPriorities: readonly string[];
  readonly complications: readonly string[];
  readonly rationale: string;
};

export type AdvancedQuestionItem = {
  readonly id: string;
  readonly profession: AdvancedQuestionProfession;
  readonly tier: AdvancedQuestionTier;
  readonly format: AdvancedQuestionFormat;
  readonly bodySystem: BodySystem;
  readonly topic: string;
  readonly clinicalContext: string;
  readonly stem: string;
  readonly options?: readonly AdvancedAnswerOption[];
  readonly matrixRows?: readonly MatrixRow[];
  readonly bowtie?: BowtiePayload;
  readonly sequence?: readonly string[];
  readonly correctAnswer: readonly string[] | Record<string, string> | string;
  readonly detailedRationale: string;
  readonly clinicalPearl: string;
  readonly safetyAlert: string;
  readonly guidelineSupport?: string;
  readonly reviewStatus: ReviewStatus;
  readonly reviewed: boolean;
  readonly published: boolean;
  readonly monetizationStatus: MonetizationStatus;
};

export type AdvancedFormatTarget = {
  readonly profession: AdvancedQuestionProfession;
  readonly tier: AdvancedQuestionTier;
  readonly sata: number;
  readonly matrix: number;
  readonly bowtie: number;
  readonly trendInterpretation: number;
  readonly prioritization: number;
  readonly sequencing: number;
  readonly clinicalJudgmentCases: number;
};

export type AdvancedQuestionReadinessRow = {
  readonly profession: AdvancedQuestionProfession;
  readonly tier: AdvancedQuestionTier;
  readonly questionType: AdvancedQuestionFormat;
  readonly target: number;
  readonly totalQuestions: number;
  readonly reviewedQuestions: number;
  readonly publishedQuestions: number;
  readonly clinicalReviewStatus: ReviewStatus;
  readonly readinessPercentage: number;
  readonly monetizationStatus: MonetizationStatus;
};

export type AdvancedQuestionGapRow = {
  readonly profession: AdvancedQuestionProfession;
  readonly tier: AdvancedQuestionTier;
  readonly questionType: AdvancedQuestionFormat;
  readonly remaining: number;
  readonly priority: "critical" | "high" | "medium";
};

export type AdvancedQuestionDashboard = {
  readonly targetRows: readonly AdvancedFormatTarget[];
  readonly readinessByProfessionTierAndType: readonly AdvancedQuestionReadinessRow[];
  readonly readinessByBodySystem: readonly Array<{
    readonly bodySystem: BodySystem;
    readonly totalQuestions: number;
    readonly reviewedQuestions: number;
    readonly publishedQuestions: number;
    readonly readinessPercentage: number;
  }>;
  readonly gaps: readonly AdvancedQuestionGapRow[];
  readonly qualityFailures: readonly Array<{ readonly questionId: string; readonly reasons: readonly string[] }>;
};

const ADVANCED_FORMAT_TARGETS: readonly AdvancedFormatTarget[] = [
  target("rn", "tier-3", 5000, 2000, 2000, 1200, 1200, 800, 1000),
  target("rpn-lpn", "tier-2", 3000, 1500, 1500, 800, 800, 600, 700),
  target("np-cnple", "np", 1000, 500, 500, 300, 300, 200, 250),
  target("np-fnp", "np", 1000, 500, 500, 300, 300, 200, 250),
  target("np-agpcnp", "np", 1000, 500, 500, 300, 300, 200, 250),
  target("np-pmhnp", "np", 1000, 500, 500, 300, 300, 200, 250),
  target("np-pnp-pc", "np", 1000, 500, 500, 300, 300, 200, 250),
  target("np-whnp", "np", 1000, 500, 500, 300, 300, 200, 250),
  target("np-enp", "np", 1000, 500, 500, 300, 300, 200, 250),
  target("rt", "allied", 1500, 500, 500, 350, 350, 250, 300),
  target("paramedic", "allied", 1500, 500, 500, 350, 350, 250, 300),
  target("ot", "allied", 750, 500, 500, 250, 250, 150, 200),
  target("pt", "allied", 750, 500, 500, 250, 250, 150, 200),
  target("mlt", "allied", 750, 500, 500, 250, 250, 150, 200),
] as const;

export const ADVANCED_NGN_SEED_QUESTIONS: readonly AdvancedQuestionItem[] = [
  {
    id: "rn-sata-postpartum-hemorrhage-001",
    profession: "rn",
    tier: "tier-3",
    format: "sata",
    bodySystem: "maternal-newborn",
    topic: "Postpartum hemorrhage",
    clinicalContext:
      "A 29-year-old client is 1 hour postpartum after a prolonged labor. The fundus is boggy and displaced to the right, lochia saturates one pad in 15 minutes, HR is 122/min, BP is 88/54, and the client reports dizziness.",
    stem: "Which nursing actions are appropriate at this time? Select all that apply.",
    options: [
      option("A", "Massage the fundus while supporting the lower uterine segment.", true, "A boggy fundus suggests uterine atony. Fundal massage is an immediate nursing action to promote uterine contraction while supporting the uterus to reduce inversion risk."),
      option("B", "Assess bladder distention and assist with emptying the bladder as appropriate.", true, "A displaced fundus can indicate a full bladder, which prevents uterine contraction and worsens bleeding."),
      option("C", "Increase the IV oxytocin infusion according to the ordered protocol or facility policy.", true, "Oxytocin promotes uterine tone. This is appropriate when ordered or protocol-driven and should occur while continuing assessment and escalation."),
      option("D", "Place the newborn skin-to-skin and reassess bleeding in 30 minutes.", false, "Bonding is important, but this client is unstable with hemorrhage signs. Waiting delays treatment of shock risk."),
      option("E", "Notify the provider or activate the obstetric emergency response while continuing interventions.", true, "Hypotension, tachycardia, dizziness, and heavy bleeding indicate possible shock. Escalation brings uterotonics, blood-loss response, and obstetric support while bedside actions continue."),
      option("F", "Document the pad count and continue routine postpartum checks.", false, "Documentation matters after immediate safety actions. Routine checks are inadequate for active hemorrhage."),
    ],
    correctAnswer: ["A", "B", "C", "E"],
    detailedRationale:
      "This item requires recognition of postpartum hemorrhage with shock risk. The priority is to treat uterine atony and remove reversible causes while escalating. Fundal massage, bladder emptying, ordered uterotonics, and emergency notification work together to restore uterine tone and perfusion. Delayed reassessment or routine documentation alone is unsafe because the vital signs and blood loss show active deterioration.",
    clinicalPearl: "A boggy, displaced fundus plus heavy lochia is uterine atony until proven otherwise; act and escalate at the same time.",
    safetyAlert: "Postpartum hemorrhage can progress quickly to hypovolemic shock. Do not wait for scheduled reassessment when bleeding and vital signs are unstable.",
    guidelineSupport: "Aligned with obstetric hemorrhage safety principles: uterine tone, quantified blood loss, rapid escalation, and protocolized uterotonics.",
    reviewStatus: "clinical-review",
    reviewed: false,
    published: false,
    monetizationStatus: "review-gated",
  },
  {
    id: "rn-matrix-sepsis-deterioration-001",
    profession: "rn",
    tier: "tier-3",
    format: "matrix",
    bodySystem: "critical-care",
    topic: "Sepsis deterioration",
    clinicalContext:
      "A client admitted with pneumonia becomes confused. Vitals trend from BP 118/72 to 86/50, HR 96 to 124, RR 22 to 30, SpO2 93% to 88% on 2 L, urine output is 15 mL/hr, and lactate is 4.1 mmol/L.",
    stem: "Classify each finding by expected significance, priority intervention level, and complication risk.",
    matrixRows: [
      row("New confusion with hypotension", "critical", "escalate", "high", "Altered mental status with hypotension suggests impaired perfusion and possible septic shock."),
      row("Urine output 15 mL/hr", "critical", "escalate", "high", "Oliguria indicates poor renal perfusion and organ dysfunction, especially when it appears with hypotension and rising lactate."),
      row("SpO2 88% with rising respiratory rate", "critical", "act-now", "high", "Worsening oxygenation and work of breathing require immediate respiratory assessment and oxygen escalation per orders/policy."),
      row("Temperature 37.8 C after antipyretic", "concerning", "monitor", "moderate", "Temperature alone is less urgent than perfusion and respiratory deterioration, but it remains part of the infection trend and response-to-treatment picture."),
    ],
    correctAnswer: {
      "New confusion with hypotension": "critical/escalate/high",
      "Urine output 15 mL/hr": "critical/escalate/high",
      "SpO2 88% with rising respiratory rate": "critical/act-now/high",
      "Temperature 37.8 C after antipyretic": "concerning/monitor/moderate",
    },
    detailedRationale:
      "The grid tests discrimination between isolated infection data and organ dysfunction. Hypotension, confusion, oliguria, rising lactate, and worsening oxygenation point to sepsis with shock risk. The RN should not treat the low-grade temperature as the main problem. Immediate actions include focused assessment, oxygen support within orders or protocol, fluid/medication readiness as ordered, and urgent escalation using a sepsis pathway.",
    clinicalPearl: "In sepsis, perfusion and organ function trends outrank fever as priority cues.",
    safetyAlert: "Low urine output, altered mentation, hypotension, or rising lactate should trigger urgent escalation.",
    reviewStatus: "clinical-review",
    reviewed: false,
    published: false,
    monetizationStatus: "review-gated",
  },
  {
    id: "rn-bowtie-dka-cerebral-edema-001",
    profession: "rn",
    tier: "tier-3",
    format: "bowtie",
    bodySystem: "endocrine",
    topic: "Diabetic ketoacidosis",
    clinicalContext:
      "An adolescent with DKA is receiving IV fluids and insulin. Glucose is falling, potassium is 3.2 mmol/L, the client reports worsening headache, becomes increasingly irritable, and has a new decrease in level of consciousness.",
    stem: "Complete the bowtie by identifying the most likely condition, critical findings, immediate actions, monitoring priorities, and complications.",
    bowtie: {
      clientCondition: "Possible cerebral edema during DKA treatment with concurrent potassium safety risk",
      assessmentFindings: ["worsening headache", "decreased level of consciousness", "irritability or neurologic change", "falling glucose during therapy"],
      immediateActions: ["stop and assess before advancing therapy", "notify provider/rapid response immediately", "prepare ordered hyperosmolar therapy", "verify potassium replacement and insulin safety per protocol"],
      monitoringPriorities: ["neurologic checks", "glucose trend", "potassium and ECG changes", "intake/output and fluid status"],
      complications: ["cerebral edema", "seizures", "dysrhythmias from hypokalemia", "cardiorespiratory deterioration"],
      rationale:
        "Neurologic decline during DKA treatment is not expected fatigue. Cerebral edema is rare but life-threatening, especially in pediatric DKA. Potassium also requires close monitoring because insulin shifts potassium intracellularly.",
    },
    correctAnswer: "Possible cerebral edema during DKA treatment with concurrent potassium safety risk",
    detailedRationale:
      "The clinical judgment is recognizing that worsening neurologic status during DKA treatment is a red flag for cerebral edema, especially in pediatric and adolescent clients. The nurse should pause to reassess, notify the provider or rapid response team, prepare ordered hyperosmolar therapy, and increase neurologic monitoring. The potassium of 3.2 mmol/L is also unsafe because insulin shifts potassium intracellularly and can worsen hypokalemia. Continuing routine treatment without reassessment risks missing cerebral edema, seizures, dysrhythmias, and cardiorespiratory deterioration.",
    clinicalPearl: "In DKA, improving glucose does not guarantee improving patient status; neurologic decline is an emergency cue.",
    safetyAlert: "New headache, irritability, or decreased consciousness during pediatric DKA treatment is a critical safety risk and requires immediate escalation.",
    reviewStatus: "clinical-review",
    reviewed: false,
    published: false,
    monetizationStatus: "review-gated",
  },
  {
    id: "rpn-sata-copd-scope-001",
    profession: "rpn-lpn",
    tier: "tier-2",
    format: "sata",
    bodySystem: "respiratory",
    topic: "COPD exacerbation and practical nursing scope",
    clinicalContext:
      "A client with COPD reports increased shortness of breath after ambulating. SpO2 decreases from 92% to 85% on prescribed low-flow oxygen, RR is 30/min, and the client is restless.",
    stem: "Which actions are appropriate for the practical nurse? Select all that apply.",
    options: [
      option("A", "Stay with the client and complete a focused respiratory assessment.", true, "The client is deteriorating. Staying with the client and assessing work of breathing, lung sounds, mental status, and oxygen equipment is scope-appropriate."),
      option("B", "Position the client upright and verify that the ordered oxygen device is connected and functioning.", true, "Positioning and equipment checks are immediate safety actions that can improve ventilation and identify correctable problems."),
      option("C", "Notify the RN/charge nurse or prescriber according to local policy.", true, "Falling oxygen saturation with restlessness and tachypnea suggests acute respiratory deterioration. Escalation ensures scope-appropriate support and timely treatment changes."),
      option("D", "Increase oxygen to a high-flow mask without an order and leave to obtain supplies.", false, "Oxygen changes must follow orders, policy, and clinical urgency. Leaving an unstable client alone is unsafe."),
      option("E", "Document the episode after the client stabilizes and include objective findings and escalation.", true, "Documentation is required for continuity and legal safety, but it follows immediate assessment, intervention, and escalation for the unstable respiratory trend."),
      option("F", "Teach pursed-lip breathing only and reassess at the next scheduled round.", false, "Pursed-lip breathing may help stable dyspnea, but teaching alone is inadequate because the client has objective deterioration and possible hypoxemia."),
    ],
    correctAnswer: ["A", "B", "C", "E"],
    detailedRationale:
      "This SATA item is scope-specific. The RPN/LPN should recognize deterioration, stay with the client, complete a focused respiratory assessment, perform immediate safe interventions, and escalate to the RN/charge nurse or prescriber according to local policy. Upright positioning and oxygen-equipment checks address reversible causes without exceeding scope. Documentation is important after urgent care is underway. Independent high-flow oxygen changes without policy/order support, leaving the client alone, or delaying reassessment for teaching are unsafe because restlessness, tachypnea, and falling SpO2 indicate potential respiratory failure.",
    clinicalPearl: "Practical nursing scope includes recognizing deterioration and escalating early; it does not mean waiting passively.",
    safetyAlert: "Restlessness with falling SpO2 is an urgent safety risk because it can indicate worsening hypoxemia, hypercapnia, or impending respiratory failure.",
    reviewStatus: "clinical-review",
    reviewed: false,
    published: false,
    monetizationStatus: "review-gated",
  },
  {
    id: "np-bowtie-chest-pain-differential-001",
    profession: "np-fnp",
    tier: "np",
    format: "bowtie",
    bodySystem: "cardiovascular",
    topic: "Chest pain differential diagnosis",
    clinicalContext:
      "A 58-year-old with diabetes reports pressure-like chest discomfort radiating to the left arm with diaphoresis and nausea. ECG shows nonspecific ST-T changes. Initial troponin is pending. BP is 156/92 and HR is 104/min.",
    stem: "Complete the bowtie for the highest-risk working diagnosis and initial management priorities.",
    bowtie: {
      clientCondition: "Possible acute coronary syndrome until ruled out",
      assessmentFindings: ["pressure-like radiating pain", "diaphoresis", "diabetes with atypical-risk presentation", "nonspecific ECG changes"],
      immediateActions: ["activate chest pain pathway", "obtain serial ECGs and troponins", "assess contraindications to ordered antiplatelet/nitrate therapy", "arrange ED transfer or urgent evaluation based on setting"],
      monitoringPriorities: ["pain trend", "hemodynamics", "rhythm changes", "troponin delta"],
      complications: ["STEMI/NSTEMI progression", "dysrhythmia", "cardiogenic shock", "delayed reperfusion"],
      rationale:
        "The NP must prioritize life-threatening causes before benign explanations. Diabetes increases risk for atypical or under-recognized ACS, and nonspecific ECG findings do not exclude MI.",
    },
    correctAnswer: "Possible acute coronary syndrome until ruled out",
    detailedRationale:
      "This is an NP-level item because it requires diagnostic risk stratification and management planning. The working diagnosis should remain ACS until serial ECG/troponin evaluation and clinical reassessment lower the risk. Focusing on reflux or anxiety before excluding ACS would be unsafe. Prescribing decisions depend on contraindications, setting, and protocols, but urgent pathway activation is the priority.",
    clinicalPearl: "NP chest pain reasoning starts with ruling out time-sensitive threats before settling on common benign causes.",
    safetyAlert: "A single nondiagnostic ECG or pending troponin cannot safely rule out ACS in a high-risk patient.",
    guidelineSupport: "Aligned with chest pain pathway principles using ECG, serial troponin, risk stratification, and urgent escalation.",
    reviewStatus: "clinical-review",
    reviewed: false,
    published: false,
    monetizationStatus: "review-gated",
  },
  {
    id: "rt-matrix-abg-ventilation-001",
    profession: "rt",
    tier: "allied",
    format: "matrix",
    bodySystem: "respiratory",
    topic: "ABG and ventilatory failure",
    clinicalContext:
      "A ventilated patient has increased peak pressures, wheezing, pH 7.25, PaCO2 62 mmHg, PaO2 72 mmHg on FiO2 0.50, HCO3 26 mmol/L, and the ventilator waveform suggests air trapping.",
    stem: "Classify the respiratory findings and RT priorities.",
    matrixRows: [
      row("pH 7.25 with PaCO2 62", "critical", "act-now", "high", "Acute respiratory acidosis indicates inadequate ventilation and requires assessment of ventilation, airway resistance, and ventilator settings."),
      row("Wheezing with rising peak pressure", "concerning", "act-now", "high", "Bronchospasm or obstruction can worsen ventilation, air trapping, and carbon dioxide retention in a ventilated patient."),
      row("PaO2 72 on FiO2 0.50", "concerning", "escalate", "moderate", "Oxygenation is impaired on moderate FiO2 and should be communicated because ventilatory failure and oxygenation problems can worsen together."),
      row("HCO3 26", "expected", "monitor", "low", "Bicarbonate is not elevated enough to suggest chronic full compensation, so the acid-base problem should be treated as acute ventilatory failure."),
    ],
    correctAnswer: {
      "pH 7.25 with PaCO2 62": "critical/act-now/high",
      "Wheezing with rising peak pressure": "concerning/act-now/high",
      "PaO2 72 on FiO2 0.50": "concerning/escalate/moderate",
      "HCO3 26": "expected/monitor/low",
    },
    detailedRationale:
      "This RT matrix requires discrimination between oxygenation and ventilation. The low pH and high PaCO2 indicate acute ventilatory failure, while wheezing, increased peak pressures, and air trapping suggest increased airway resistance. The PaO2 is also concerning because it remains low despite FiO2 0.50, but the immediate acid-base threat is inadequate ventilation. The RT should assess the patient, ventilator, circuit, waveform, airway patency, and bronchodilator response, then communicate urgent findings to the bedside team.",
    clinicalPearl: "In ventilated patients, PaCO2 and pH tell you whether ventilation is adequate; peak pressure and waveforms help explain why it is failing.",
    safetyAlert: "Air trapping is a critical safety risk because it can worsen hypercapnia, dynamic hyperinflation, hypotension, and cardiopulmonary deterioration.",
    reviewStatus: "clinical-review",
    reviewed: false,
    published: false,
    monetizationStatus: "review-gated",
  },
  {
    id: "paramedic-sequence-trauma-shock-001",
    profession: "paramedic",
    tier: "allied",
    format: "sequencing",
    bodySystem: "trauma",
    topic: "Prehospital trauma shock",
    clinicalContext:
      "A 34-year-old motorcyclist is found 8 metres from the vehicle. The scene is safe. The patient is pale, confused, has radial pulses, RR 28/min, HR 132/min, BP 84/50, and an obvious open femur deformity with heavy bleeding.",
    stem: "Place the prehospital actions in the safest order.",
    sequence: [
      "Control life-threatening external bleeding with direct pressure/tourniquet per protocol.",
      "Complete primary survey with airway, breathing, circulation, disability, and exposure priorities.",
      "Support oxygenation/ventilation and prevent hypothermia while preparing rapid transport.",
      "Provide concise trauma handoff with mechanism, vitals, interventions, and response.",
    ],
    correctAnswer: ["bleeding control", "primary survey", "oxygenation and rapid transport prep", "trauma handoff"],
    detailedRationale:
      "The sequence prioritizes immediate hemorrhage control because uncontrolled external bleeding can kill before a full secondary assessment is completed. Once catastrophic bleeding is addressed, the primary survey identifies airway, breathing, circulation, neurologic, and exposure threats that determine immediate prehospital interventions. Oxygenation support, hypothermia prevention, and rapid transport reduce preventable trauma mortality. A concise trauma handoff preserves the mechanism, trend, interventions, and response so the receiving team can continue time-sensitive decisions without reconstructing the scene history.",
    clinicalPearl: "In major trauma, control catastrophic bleeding early and keep the handoff tied to mechanism, trends, interventions, and response.",
    safetyAlert: "Delaying hemorrhage control for a detailed secondary exam increases shock risk.",
    reviewStatus: "clinical-review",
    reviewed: false,
    published: false,
    monetizationStatus: "review-gated",
  },
  {
    id: "mlt-matrix-hemolyzed-potassium-001",
    profession: "mlt",
    tier: "allied",
    format: "matrix",
    bodySystem: "laboratory",
    topic: "Specimen quality and critical potassium interpretation",
    clinicalContext:
      "A serum potassium result is 6.8 mmol/L and flagged hemolyzed. The previous potassium 4 hours earlier was 4.2 mmol/L. The patient is in the emergency department for chest pain, and the ECG is being repeated.",
    stem: "Classify each laboratory consideration.",
    matrixRows: [
      row("Potassium 6.8 mmol/L with hemolysis flag", "critical", "escalate", "high", "The value may be falsely elevated, but because it is critical and the patient has chest pain, communication and recollection are urgent."),
      row("Previous potassium 4.2 mmol/L", "expected", "monitor", "moderate", "The prior result helps interpret plausibility and trend direction, but it does not cancel the need to address the critical flagged result."),
      row("Need for repeat specimen", "concerning", "act-now", "high", "A non-hemolyzed specimen is needed to determine whether hyperkalemia is real."),
      row("ECG being repeated", "concerning", "escalate", "high", "ECG changes would increase clinical urgency and must be considered with the care team."),
    ],
    correctAnswer: {
      "Potassium 6.8 mmol/L with hemolysis flag": "critical/escalate/high",
      "Previous potassium 4.2 mmol/L": "expected/monitor/moderate",
      "Need for repeat specimen": "concerning/act-now/high",
      "ECG being repeated": "concerning/escalate/high",
    },
    detailedRationale:
      "This MLT item tests quality assurance and patient safety. Hemolysis can falsely elevate potassium, but a critical potassium value in a symptomatic emergency patient cannot be ignored or silently dismissed. The prior normal value helps assess plausibility, yet it does not prove the new result is false. The laboratory professional should follow critical value and specimen recollection procedures, communicate the hemolysis limitation clearly, and support rapid confirmation so the team can distinguish true hyperkalemia from pre-analytic error.",
    clinicalPearl: "Specimen quality changes interpretation, but it does not remove responsibility to communicate critical risk.",
    safetyAlert: "True hyperkalemia can cause fatal dysrhythmias; a hemolyzed critical potassium needs prompt clarification and communication.",
    reviewStatus: "clinical-review",
    reviewed: false,
    published: false,
    monetizationStatus: "review-gated",
  },
] as const;

function target(
  profession: AdvancedQuestionProfession,
  tier: AdvancedQuestionTier,
  sata: number,
  matrix: number,
  bowtie: number,
  trendInterpretation: number,
  prioritization: number,
  sequencing: number,
  clinicalJudgmentCases: number,
): AdvancedFormatTarget {
  return { profession, tier, sata, matrix, bowtie, trendInterpretation, prioritization, sequencing, clinicalJudgmentCases };
}

function option(id: string, text: string, correct: boolean, rationale: string): AdvancedAnswerOption {
  return { id, text, correct, rationale };
}

function row(
  finding: string,
  assessment: MatrixRow["assessment"],
  intervention: MatrixRow["intervention"],
  complicationRisk: MatrixRow["complicationRisk"],
  rationale: string,
): MatrixRow {
  return { finding, assessment, intervention, complicationRisk, rationale };
}

export function listAdvancedFormatTargets(): readonly AdvancedFormatTarget[] {
  return ADVANCED_FORMAT_TARGETS;
}

export function listAdvancedNgnSeedQuestions(): readonly AdvancedQuestionItem[] {
  return ADVANCED_NGN_SEED_QUESTIONS;
}

export function validateAdvancedQuestionQuality(question: AdvancedQuestionItem): readonly string[] {
  const failures: string[] = [];
  const contextBlob = `${question.clinicalContext} ${question.stem} ${question.detailedRationale}`.toLowerCase();
  if (!/\b(patient|client|resident|adolescent|year-old|bp|hr|rr|spo2|lab|ecg|vital|assessment)\b/.test(contextBlob)) {
    failures.push("Clinical realism: missing concrete patient context, findings, or trend data.");
  }
  if (question.detailedRationale.split(/\s+/).length < 55) {
    failures.push("Rationale quality: detailed rationale must teach clinical reasoning, not restate the answer.");
  }
  if (question.clinicalPearl.split(/\s+/).length < 8) {
    failures.push("Clinical pearl: add a memorable, clinically useful learning point.");
  }
  if (!/\b(safety|shock|deterior|urgent|escalat|fatal|harm|risk|unstable|critical)\b/i.test(question.safetyAlert)) {
    failures.push("Safety alert: must identify a concrete patient-safety risk.");
  }

  if (question.format === "sata") {
    const options = question.options ?? [];
    const correctCount = options.filter((item) => item.correct).length;
    const incorrectCount = options.filter((item) => !item.correct).length;
    if (correctCount < 2) failures.push("SATA: requires multiple correct answers.");
    if (incorrectCount < 2) failures.push("SATA: requires multiple clinically plausible distractors.");
    for (const item of options) {
      if (item.rationale.split(/\s+/).length < 12) failures.push(`SATA rationale: option ${item.id} needs deeper reasoning.`);
    }
  }

  if (question.format === "matrix") {
    const rows = question.matrixRows ?? [];
    if (rows.length < 4) failures.push("Matrix: requires at least four discriminating rows.");
    if (!rows.some((item) => item.assessment === "critical")) failures.push("Matrix: must include critical discriminators.");
    if (!rows.some((item) => item.intervention === "escalate")) failures.push("Matrix: must test escalation decisions.");
  }

  if (question.format === "bowtie") {
    const bowtie = question.bowtie;
    if (!bowtie) failures.push("Bowtie: missing bowtie payload.");
    if (bowtie && (bowtie.assessmentFindings.length < 3 || bowtie.immediateActions.length < 3 || bowtie.complications.length < 2)) {
      failures.push("Bowtie: requires condition, findings, immediate actions, monitoring priorities, and complications.");
    }
  }

  if (question.format === "sequencing" && (question.sequence?.length ?? 0) < 4) {
    failures.push("Sequencing: requires at least four ordered clinical actions.");
  }

  return failures;
}

export function buildAdvancedQuestionExpansionDashboard(
  questions: readonly AdvancedQuestionItem[] = ADVANCED_NGN_SEED_QUESTIONS,
): AdvancedQuestionDashboard {
  const readinessByProfessionTierAndType = ADVANCED_FORMAT_TARGETS.flatMap((targetRow) => {
    const formats: Array<[AdvancedQuestionFormat, number]> = [
      ["sata", targetRow.sata],
      ["matrix", targetRow.matrix],
      ["bowtie", targetRow.bowtie],
      ["trend-interpretation", targetRow.trendInterpretation],
      ["prioritization", targetRow.prioritization],
      ["sequencing", targetRow.sequencing],
      ["clinical-judgment-case", targetRow.clinicalJudgmentCases],
    ];
    return formats.map(([format, targetCount]) => {
      const matching = questions.filter((item) => item.profession === targetRow.profession && item.tier === targetRow.tier && item.format === format);
      const reviewedQuestions = matching.filter((item) => item.reviewed).length;
      const publishedQuestions = matching.filter((item) => item.published).length;
      return {
        profession: targetRow.profession,
        tier: targetRow.tier,
        questionType: format,
        target: targetCount,
        totalQuestions: matching.length,
        reviewedQuestions,
        publishedQuestions,
        clinicalReviewStatus: resolveReviewStatus(matching),
        readinessPercentage: percent(matching.length, targetCount),
        monetizationStatus: matching.some((item) => item.monetizationStatus === "premium-ready") ? "premium-ready" : matching.length > 0 ? "review-gated" : "not-ready",
      };
    });
  });

  const readinessByBodySystem = Array.from(new Set(questions.map((item) => item.bodySystem))).map((bodySystem) => {
    const matching = questions.filter((item) => item.bodySystem === bodySystem);
    return {
      bodySystem,
      totalQuestions: matching.length,
      reviewedQuestions: matching.filter((item) => item.reviewed).length,
      publishedQuestions: matching.filter((item) => item.published).length,
      readinessPercentage: percent(matching.filter((item) => item.reviewed).length, matching.length || 1),
    };
  });

  const gaps = readinessByProfessionTierAndType
    .map((row) => ({
      profession: row.profession,
      tier: row.tier,
      questionType: row.questionType,
      remaining: Math.max(0, row.target - row.totalQuestions),
      priority: row.target >= 1500 ? "critical" : row.target >= 500 ? "high" : "medium",
    }) satisfies AdvancedQuestionGapRow)
    .filter((row) => row.remaining > 0);

  return {
    targetRows: ADVANCED_FORMAT_TARGETS,
    readinessByProfessionTierAndType,
    readinessByBodySystem,
    gaps,
    qualityFailures: questions
      .map((question) => ({ questionId: question.id, reasons: validateAdvancedQuestionQuality(question) }))
      .filter((row) => row.reasons.length > 0),
  };
}

function resolveReviewStatus(items: readonly AdvancedQuestionItem[]): ReviewStatus {
  if (items.length === 0) return "draft";
  if (items.every((item) => item.reviewStatus === "published")) return "published";
  if (items.every((item) => item.reviewStatus === "ready-for-publication" || item.reviewStatus === "published")) return "ready-for-publication";
  if (items.some((item) => item.reviewStatus === "clinical-review")) return "clinical-review";
  return "draft";
}

function percent(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}
