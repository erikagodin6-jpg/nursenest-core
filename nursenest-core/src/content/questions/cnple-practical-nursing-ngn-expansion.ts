/**
 * Canadian practical nursing NGN-style expansion catalog.
 *
 * These are NurseNest-authored CNPLE/REx-PN-style practice items for Canadian
 * practical nursing education. They are not official exam items. Keep this file
 * content-only: no runtime side effects, no DB writes, and no UI assumptions.
 */

export type CnplePracticalQuestionType =
  | "matrix"
  | "bowtie"
  | "sata"
  | "case-study"
  | "prioritization"
  | "ordered-response"
  | "chart-review"
  | "hotspot"
  | "cloze"
  | "extended-matching"
  | "communication"
  | "delegation-assignment"
  | "medication-safety"
  | "safety-deterioration";

export type CnpleDifficulty = "foundational" | "intermediate" | "advanced" | "exam-level";

export type CnpleContentDomain =
  | "medical-surgical"
  | "pharmacology"
  | "pediatrics"
  | "maternity"
  | "mental-health"
  | "emergency-care"
  | "community-health"
  | "leadership-delegation"
  | "ethics"
  | "infection-control"
  | "chronic-disease"
  | "geriatrics";

export type CnpleOption = {
  id: string;
  text: string;
  correct: boolean;
  rationale: string;
};

export type CnpleRationale = {
  correct: string;
  pathophysiology?: string;
  prioritizationLogic: string;
  safetyImplication: string;
  wrongAnswers: Record<string, string>;
};

export type CnpleAdaptiveMetadata = {
  profession: "RPN";
  country: "CA";
  examStyle: "CNPLE_PN_STYLE" | "REx-PN";
  scopeLevel: "entry-level practical nursing";
  safetyCritical: boolean;
  cognitiveLoad: 1 | 2 | 3 | 4 | 5;
  prioritizationLevel: 1 | 2 | 3 | 4 | 5;
  delegationComplexity: 1 | 2 | 3 | 4 | 5;
  misconceptionTags: readonly string[];
};

export type CnplePracticalQuestion = {
  id: string;
  questionType: CnplePracticalQuestionType;
  domain: CnpleContentDomain;
  topic: string;
  subtopic: string;
  difficulty: CnpleDifficulty;
  scenario: string;
  stem: string;
  options: readonly CnpleOption[];
  correctAnswer: string | readonly string[] | Record<string, string>;
  rationale: CnpleRationale;
  hints: readonly [string, string, string];
  clinicalJudgmentFocus: string;
  canadianPracticeNote: string;
  adaptiveMetadata: CnpleAdaptiveMetadata;
  payload?: Record<string, unknown>;
};

type ScenarioTemplate = {
  key: string;
  domain: CnpleContentDomain;
  topic: string;
  subtopic: string;
  difficulty: CnpleDifficulty;
  patient: string;
  setting: string;
  presentation: string;
  concerningCue: string;
  expectedFinding: string;
  priorityAction: string;
  unsafeAction: string;
  monitor: string;
  condition: string;
  pathophysiology: string;
  escalation: string;
  misconception: string;
};

const SCENARIOS: readonly ScenarioTemplate[] = [
  {
    key: "copd-decline",
    domain: "medical-surgical",
    topic: "Respiratory deterioration",
    subtopic: "COPD exacerbation and escalation",
    difficulty: "advanced",
    patient: "A 72-year-old client with COPD in a medical unit",
    setting: "Canadian acute-care medicine unit",
    presentation:
      "The client becomes restless and increasingly short of breath after walking to the bathroom. SpO2 falls from 92% to 85% on ordered low-flow oxygen, RR is 30/min, and accessory muscles are visible.",
    concerningCue: "new restlessness with falling oxygen saturation and increased work of breathing",
    expectedFinding: "mild exertional dyspnea that resolves with rest and returns to baseline saturation",
    priorityAction: "position high-Fowler's, assess breath sounds and oxygen equipment, stay with the client, and notify the RN/charge nurse or prescriber per policy",
    unsafeAction: "encourage the client to rest alone and reassess at the next scheduled round",
    monitor: "work of breathing, SpO2 trend, respiratory rate, mental status, and response to ordered therapy",
    condition: "acute respiratory deterioration",
    pathophysiology:
      "COPD exacerbation increases airway resistance and ventilation-perfusion mismatch; restlessness can be an early sign of hypoxemia or hypercapnia.",
    escalation: "Immediate escalation is needed because mental status change plus falling SpO2 suggests decompensation.",
    misconception: "Treating COPD oxygen targets as a reason to delay escalation when objective distress is worsening.",
  },
  {
    key: "sepsis-ltc",
    domain: "geriatrics",
    topic: "Sepsis recognition",
    subtopic: "Older adult infection and deterioration",
    difficulty: "exam-level",
    patient: "An 86-year-old long-term-care resident",
    setting: "Ontario long-term-care home",
    presentation:
      "The resident is newly confused, refuses breakfast, has T 38.1 C, HR 112/min, RR 24/min, BP 94/58, and foul-smelling urine in the catheter drainage bag.",
    concerningCue: "new confusion with tachypnea, hypotension, fever, and suspected urinary source",
    expectedFinding: "baseline mild forgetfulness with stable vital signs and usual intake",
    priorityAction: "complete focused assessment, keep the resident safe, notify the RN/charge nurse immediately, and prepare SBAR escalation for possible sepsis",
    unsafeAction: "wait for the next routine medication pass because older adults often have mild confusion",
    monitor: "vital-sign trend, mental status, urine output, temperature, and perfusion cues",
    condition: "possible sepsis with shock risk",
    pathophysiology:
      "Sepsis causes systemic inflammation, vasodilation, capillary leak, and impaired perfusion; older adults may present with confusion before high fever.",
    escalation: "The RPN should recognize deterioration, report promptly, and support ordered interventions within scope.",
    misconception: "Attributing acute delirium to dementia instead of treating it as a possible infection-related emergency.",
  },
  {
    key: "heart-failure-fluid",
    domain: "chronic-disease",
    topic: "Heart failure",
    subtopic: "Fluid overload and daily weights",
    difficulty: "intermediate",
    patient: "A 68-year-old client with heart failure receiving home-care follow-up",
    setting: "Community nursing visit",
    presentation:
      "The client reports waking at night short of breath, has gained 2.2 kg in 3 days, has new ankle edema, and has crackles at both lung bases.",
    concerningCue: "rapid weight gain with orthopnea, edema, and new crackles",
    expectedFinding: "stable weight with mild chronic ankle swelling unchanged from baseline",
    priorityAction: "assess respiratory status, reinforce sodium/fluid teaching, and notify the care team about possible fluid overload",
    unsafeAction: "recommend drinking extra fluids because the client feels tired",
    monitor: "daily weights, edema, lung sounds, dyspnea, blood pressure, and medication adherence",
    condition: "worsening heart failure fluid overload",
    pathophysiology:
      "Reduced cardiac pumping can activate fluid-retaining neurohormonal responses, causing pulmonary congestion and peripheral edema.",
    escalation: "Rapid weight gain and orthopnea require timely reporting so therapy can be adjusted.",
    misconception: "Focusing on ankle edema alone while missing the respiratory and weight trend.",
  },
  {
    key: "stroke-cue",
    domain: "emergency-care",
    topic: "Stroke recognition",
    subtopic: "Acute neurologic change",
    difficulty: "advanced",
    patient: "A 74-year-old client on a rehabilitation unit",
    setting: "Inpatient rehabilitation",
    presentation:
      "During morning care, the client develops sudden slurred speech, right facial droop, and right arm drift. Blood glucose is 5.8 mmol/L.",
    concerningCue: "sudden focal neurologic deficit with normal glucose",
    expectedFinding: "fatigue after therapy with equal grips and clear speech",
    priorityAction: "note last-known-well time, keep the client NPO, perform focused neuro check, and call the RN/rapid response pathway",
    unsafeAction: "offer water to assess swallowing before reporting",
    monitor: "airway safety, neurologic status, glucose, blood pressure, and symptom progression",
    condition: "possible acute stroke",
    pathophysiology:
      "A sudden focal deficit suggests interrupted cerebral perfusion; early recognition preserves time-sensitive treatment options.",
    escalation: "The practical nurse's priority is rapid recognition, swallow safety, and immediate escalation.",
    misconception: "Treating sudden neurologic change as routine fatigue or anxiety.",
  },
  {
    key: "postpartum-hemorrhage",
    domain: "maternity",
    topic: "Postpartum assessment",
    subtopic: "Uterine atony and hemorrhage risk",
    difficulty: "advanced",
    patient: "A 30-year-old client 2 hours after vaginal birth",
    setting: "Postpartum unit",
    presentation:
      "The client reports dizziness. The pad is saturated within 15 minutes, fundus is boggy and above the umbilicus, HR is 118/min, and BP is 92/54.",
    concerningCue: "boggy high fundus with heavy lochia and shock cues",
    expectedFinding: "firm midline fundus with moderate rubra lochia and stable vital signs",
    priorityAction: "massage the fundus, call for help, assess bladder status, and follow postpartum hemorrhage protocol within scope",
    unsafeAction: "document the pad count and return in 30 minutes",
    monitor: "fundal tone, lochia amount, vital signs, dizziness, bladder distention, and level of consciousness",
    condition: "postpartum hemorrhage from uterine atony",
    pathophysiology:
      "A boggy uterus cannot compress uterine vessels effectively, leading to rapid blood loss after delivery.",
    escalation: "Uterine atony is time-sensitive; fundal massage and immediate help prevent deterioration.",
    misconception: "Viewing heavy lochia as normal because birth was recent.",
  },
  {
    key: "pediatric-respiratory",
    domain: "pediatrics",
    topic: "Pediatric respiratory distress",
    subtopic: "Work of breathing and fatigue",
    difficulty: "advanced",
    patient: "A 4-year-old in the emergency department with wheezing",
    setting: "Emergency department urgent assessment area",
    presentation:
      "The child is quiet, sitting upright, using intercostal retractions, has SpO2 89% on room air, and the wheeze is now faint compared with triage.",
    concerningCue: "quiet child with retractions, hypoxemia, and decreasing wheeze intensity",
    expectedFinding: "mild wheeze with playful behaviour and normal oxygen saturation",
    priorityAction: "stay with the child, position for breathing, apply ordered oxygen, and escalate urgently to the RN/provider",
    unsafeAction: "reassure the parent that less wheezing means improvement",
    monitor: "work of breathing, SpO2, mental status, breath sounds, and response to treatment",
    condition: "impending pediatric respiratory failure",
    pathophysiology:
      "A silent or quiet chest in respiratory distress can mean poor air movement rather than improvement.",
    escalation: "Children can fatigue quickly; work of breathing and behaviour matter as much as SpO2.",
    misconception: "Interpreting reduced wheeze as improvement without assessing air entry and fatigue.",
  },
  {
    key: "hypoglycemia",
    domain: "pharmacology",
    topic: "Diabetes medication safety",
    subtopic: "Insulin and hypoglycemia",
    difficulty: "intermediate",
    patient: "A 59-year-old client with type 2 diabetes receiving insulin",
    setting: "Medical unit",
    presentation:
      "The client is diaphoretic, shaky, and confused before lunch. Point-of-care glucose is 3.1 mmol/L. The client is awake and able to swallow.",
    concerningCue: "symptomatic hypoglycemia with confusion and glucose 3.1 mmol/L",
    expectedFinding: "pre-meal glucose within individualized target and no adrenergic symptoms",
    priorityAction: "give fast-acting carbohydrate according to hypoglycemia protocol and recheck glucose in 15 minutes",
    unsafeAction: "administer the scheduled rapid-acting insulin before lunch",
    monitor: "glucose response, mental status, swallowing safety, meal intake, and recurrence risk",
    condition: "hypoglycemia",
    pathophysiology:
      "Low circulating glucose deprives the brain of fuel and triggers adrenergic symptoms such as sweating and tremor.",
    escalation: "If the client cannot swallow or does not improve, escalate for glucagon/IV dextrose per protocol.",
    misconception: "Treating all diabetes concerns with more insulin instead of matching symptoms to glucose.",
  },
  {
    key: "warfarin-bleeding",
    domain: "pharmacology",
    topic: "Anticoagulant safety",
    subtopic: "Bleeding risk and INR follow-up",
    difficulty: "advanced",
    patient: "A 77-year-old client taking warfarin for atrial fibrillation",
    setting: "Primary-care clinic phone triage",
    presentation:
      "The client reports black tarry stools, dizziness when standing, and new bruising. The most recent INR yesterday was 4.8.",
    concerningCue: "melena symptoms with supratherapeutic INR and dizziness",
    expectedFinding: "minor stable bruise after venipuncture with therapeutic INR",
    priorityAction: "instruct urgent same-day assessment/emergency evaluation per policy and notify the prescriber/RN immediately",
    unsafeAction: "tell the client to skip leafy greens and recheck INR next month",
    monitor: "bleeding symptoms, orthostatic symptoms, INR, hemoglobin if ordered, and medication interactions",
    condition: "possible gastrointestinal bleeding with over-anticoagulation",
    pathophysiology:
      "Warfarin reduces vitamin K-dependent clotting factors; a high INR increases spontaneous and gastrointestinal bleeding risk.",
    escalation: "Melena plus dizziness is not routine teaching; it requires urgent assessment.",
    misconception: "Responding to high INR with diet advice while missing active bleeding cues.",
  },
  {
    key: "delirium-dementia",
    domain: "mental-health",
    topic: "Delirium recognition",
    subtopic: "Acute confusion in older adults",
    difficulty: "intermediate",
    patient: "An 82-year-old resident with mild dementia",
    setting: "Long-term-care evening shift",
    presentation:
      "The resident is suddenly disoriented, picking at sheets, has new urinary incontinence, T 37.9 C, and refuses fluids. Family says this is not baseline.",
    concerningCue: "acute change from baseline with infection/dehydration cues",
    expectedFinding: "chronic forgetfulness without abrupt fluctuation or vital-sign change",
    priorityAction: "assess for reversible causes, ensure safety, increase observation, and report acute delirium concern",
    unsafeAction: "apply restraints because confusion is expected with dementia",
    monitor: "mental status fluctuation, hydration, temperature, urinary symptoms, falls risk, and medication changes",
    condition: "acute delirium risk",
    pathophysiology:
      "Delirium reflects acute brain dysfunction often triggered by infection, dehydration, medications, pain, or hypoxia.",
    escalation: "Delirium is a medical warning sign in older adults, not just a behaviour problem.",
    misconception: "Normalizing sudden confusion because a dementia diagnosis already exists.",
  },
  {
    key: "cdiff-ipac",
    domain: "infection-control",
    topic: "C. difficile infection control",
    subtopic: "Contact precautions and dehydration risk",
    difficulty: "intermediate",
    patient: "A 64-year-old client after antibiotics for pneumonia",
    setting: "Acute-care medical unit",
    presentation:
      "The client has 6 watery stools in 8 hours, abdominal cramping, T 38.0 C, and recent clindamycin exposure.",
    concerningCue: "frequent watery diarrhea with fever after high-risk antibiotic exposure",
    expectedFinding: "one soft stool after laxative use with normal temperature",
    priorityAction: "initiate contact precautions per policy, perform hand hygiene with soap and water, assess hydration, and notify the RN/provider",
    unsafeAction: "use alcohol-based hand rub only and keep the client in the shared room",
    monitor: "stool frequency, hydration status, abdominal pain, temperature, and signs of sepsis",
    condition: "suspected C. difficile infection",
    pathophysiology:
      "Antibiotics can disrupt normal gut flora, allowing C. difficile toxin-mediated colitis and dehydration.",
    escalation: "Early isolation and hydration assessment protect the client and other patients.",
    misconception: "Assuming all diarrhea is routine medication side effect without IPAC action.",
  },
  {
    key: "wound-infection",
    domain: "medical-surgical",
    topic: "Postoperative wound complication",
    subtopic: "Infection and dehiscence risk",
    difficulty: "intermediate",
    patient: "A 51-year-old client on postoperative day 4 after abdominal surgery",
    setting: "Surgical unit",
    presentation:
      "The incision has increasing redness spreading 2 cm from the edge, warmth, purulent drainage, T 38.3 C, and the client reports worsening pain.",
    concerningCue: "spreading erythema, purulent drainage, fever, and increasing pain",
    expectedFinding: "mild localized bruising with decreasing pain and approximated edges",
    priorityAction: "assess wound and vital signs, reinforce dressing as ordered, and report infection/dehiscence concern promptly",
    unsafeAction: "remove all steri-strips and vigorously cleanse inside the wound without an order",
    monitor: "wound edges, drainage amount/odour, temperature, pain trend, and systemic signs",
    condition: "possible surgical site infection",
    pathophysiology:
      "Bacterial contamination and impaired tissue healing produce inflammation, purulent drainage, pain, and fever.",
    escalation: "Postoperative infection can progress to sepsis or wound separation if not reported.",
    misconception: "Calling purulent drainage normal because some drainage is expected after surgery.",
  },
  {
    key: "ethics-capacity",
    domain: "ethics",
    topic: "Consent and capacity",
    subtopic: "Refusal of care",
    difficulty: "foundational",
    patient: "A 45-year-old alert client scheduled for a dressing change",
    setting: "Community clinic",
    presentation:
      "The client refuses the dressing change, says they understand the infection risk, and asks to speak with the nurse again after lunch.",
    concerningCue: "refusal of care requiring capacity-aware communication and documentation",
    expectedFinding: "client agrees to care after informed discussion and no distress",
    priorityAction: "explore reasons, provide clear information, respect capable refusal, document objectively, and notify the appropriate team member if risk persists",
    unsafeAction: "proceed with the dressing change because it is ordered",
    monitor: "understanding, voluntariness, wound risk, distress, and need for further team support",
    condition: "informed refusal of care",
    pathophysiology:
      "Not applicable; this item tests ethical and legal nursing judgment rather than disease mechanism.",
    escalation: "Capacity and informed refusal require respectful communication and objective documentation.",
    misconception: "Believing an order overrides a capable client's right to refuse.",
  },
];

const LETTERS = ["A", "B", "C", "D"] as const;

function hints(s: ScenarioTemplate): [string, string, string] {
  return [
    `Start by separating baseline findings from acute change in ${s.topic.toLowerCase()}.`,
    `Ask which cue creates the greatest immediate safety risk: ${s.concerningCue}.`,
    `Choose the action that stays within practical nursing scope while escalating ${s.condition}.`,
  ];
}

function metadata(s: ScenarioTemplate, overrides: Partial<CnpleAdaptiveMetadata> = {}): CnpleAdaptiveMetadata {
  return {
    profession: "RPN",
    country: "CA",
    examStyle: "REx-PN",
    scopeLevel: "entry-level practical nursing",
    safetyCritical: true,
    cognitiveLoad: s.difficulty === "foundational" ? 2 : s.difficulty === "intermediate" ? 3 : 4,
    prioritizationLevel: s.difficulty === "exam-level" ? 5 : s.difficulty === "advanced" ? 4 : 3,
    delegationComplexity: s.domain === "leadership-delegation" ? 4 : 2,
    misconceptionTags: [s.misconception, "delayed-escalation", "scope-safe-action"],
    ...overrides,
  };
}

function optionRationales(s: ScenarioTemplate): Record<string, string> {
  return {
    A: `${s.priorityAction} addresses the priority because it responds to ${s.concerningCue} while staying within practical nursing scope.`,
    B: `This sounds calming, but it delays recognition of ${s.condition} and can allow deterioration to continue.`,
    C: `This may be useful later, but it is not the first safety action when ${s.concerningCue} is present.`,
    D: `This exceeds or bypasses practical nursing responsibilities by jumping to a treatment decision before assessment, reporting, or ordered care.`,
  };
}

function baseRationale(s: ScenarioTemplate, wrongAnswers = optionRationales(s)): CnpleRationale {
  return {
    correct: `${s.priorityAction} is correct because the scenario contains ${s.concerningCue}, which indicates ${s.condition}.`,
    pathophysiology: s.pathophysiology,
    prioritizationLogic: `For entry-level Canadian practical nursing items, choose the option that recognizes deterioration, protects immediate safety, communicates through the appropriate chain, and reassesses response.`,
    safetyImplication: s.escalation,
    wrongAnswers,
  };
}

function makePrioritization(s: ScenarioTemplate): CnplePracticalQuestion {
  const wrong = optionRationales(s);
  return {
    id: `cnple-rpn-priority-${s.key}`,
    questionType: "prioritization",
    domain: s.domain,
    topic: s.topic,
    subtopic: s.subtopic,
    difficulty: s.difficulty,
    scenario: `${s.patient} is in a ${s.setting}. ${s.presentation}`,
    stem: "Which nursing action should the practical nurse take first?",
    options: [
      { id: "A", text: s.priorityAction, correct: true, rationale: wrong.A },
      { id: "B", text: s.unsafeAction, correct: false, rationale: wrong.B },
      { id: "C", text: "Complete routine charting before reassessing because documentation is required.", correct: false, rationale: wrong.C },
      {
        id: "D",
        text:
          "Request a new treatment order before completing focused assessment findings or reporting the current change.",
        correct: false,
        rationale:
          "Seeking orders may eventually be needed, but skipping focused assessment and timely team communication weakens escalation.",
      },
    ],
    correctAnswer: "A",
    rationale: baseRationale(s, wrong),
    hints: hints(s),
    clinicalJudgmentFocus: "Recognize deterioration and choose the safest first action within RPN scope.",
    canadianPracticeNote:
      "RPN scope varies by province and employer policy; these items emphasize recognition, routine interventions, reporting, documentation, and reassessment.",
    adaptiveMetadata: metadata(s),
  };
}

function makeSata(s: ScenarioTemplate): CnplePracticalQuestion {
  const wrong = {
    A: `This is correct because ${s.concerningCue} requires immediate assessment and communication.`,
    B: `This is correct because monitoring ${s.monitor} helps determine whether the client is stabilizing or deteriorating.`,
    C: `This is correct when performed within orders/policy because it supports immediate safety while escalation occurs.`,
    D: `This is unsafe because it normalizes or delays response to ${s.concerningCue}.`,
    E: "This is tempting because documentation matters, but documentation cannot come before immediate safety and escalation.",
    F: "This is unsafe because independent diagnosis or treatment escalation beyond scope bypasses the regulated decision pathway.",
  };
  return {
    id: `cnple-rpn-sata-${s.key}`,
    questionType: "sata",
    domain: s.domain,
    topic: s.topic,
    subtopic: s.subtopic,
    difficulty: s.difficulty,
    scenario: `${s.patient} is in a ${s.setting}. ${s.presentation}`,
    stem: "Which actions are appropriate for the practical nurse? Select all that apply.",
    options: [
      { id: "A", text: "Perform a focused assessment and compare findings with baseline.", correct: true, rationale: wrong.A },
      { id: "B", text: `Monitor ${s.monitor}.`, correct: true, rationale: wrong.B },
      { id: "C", text: s.priorityAction, correct: true, rationale: wrong.C },
      { id: "D", text: s.unsafeAction, correct: false, rationale: wrong.D },
      { id: "E", text: "Finish routine documentation before notifying anyone because charting is legally required.", correct: false, rationale: wrong.E },
      {
        id: "F",
        text:
          "Ask the prescriber for new treatment orders before giving the RN/charge nurse a focused update.",
        correct: false,
        rationale:
          "A prescriber update may follow, but the practical nurse first gathers focused cues and escalates through the appropriate team pathway.",
      },
    ],
    correctAnswer: ["A", "B", "C"],
    rationale: baseRationale(s, wrong),
    hints: hints(s),
    clinicalJudgmentFocus: "Evaluate each option independently for safety, scope, and timing.",
    canadianPracticeNote:
      "SATA items reward selecting every safe practical-nursing action without adding unsafe or out-of-scope actions.",
    adaptiveMetadata: metadata(s),
  };
}

function makeMatrix(s: ScenarioTemplate): CnplePracticalQuestion {
  const rows = [
    { id: "finding-acute", text: s.concerningCue, correctColumn: "urgent" },
    { id: "finding-baseline", text: s.expectedFinding, correctColumn: "routine" },
    { id: "action-priority", text: s.priorityAction, correctColumn: "appropriate" },
    { id: "action-unsafe", text: s.unsafeAction, correctColumn: "inappropriate" },
  ];
  return {
    id: `cnple-rpn-matrix-${s.key}`,
    questionType: "matrix",
    domain: s.domain,
    topic: s.topic,
    subtopic: s.subtopic,
    difficulty: s.difficulty,
    scenario: `${s.patient} is in a ${s.setting}. ${s.presentation}`,
    stem: "Classify each finding or action using the safest practical-nursing judgment.",
    options: rows.map((row) => ({
      id: row.id,
      text: row.text,
      correct: row.correctColumn === "urgent" || row.correctColumn === "appropriate",
      rationale:
        row.correctColumn === "urgent" || row.correctColumn === "appropriate"
          ? `${row.text} belongs in the higher-priority/safe-action category because it connects to ${s.condition}.`
          : `${row.text} is not the priority/safe classification because it misses or delays response to the key risk.`,
    })),
    correctAnswer: Object.fromEntries(rows.map((row) => [row.id, row.correctColumn])),
    rationale: baseRationale(s, {
      urgent: `Urgent findings are acute changes that suggest ${s.condition}.`,
      routine: "Routine findings match baseline and do not drive the first action.",
      appropriate: "Appropriate actions protect safety, remain in scope, and trigger timely communication.",
      inappropriate: "Inappropriate actions delay escalation, ignore deterioration, or move outside scope.",
    }),
    hints: hints(s),
    clinicalJudgmentFocus: "Differentiate expected/routine cues from urgent findings and safe actions.",
    canadianPracticeNote:
      "Matrix items are useful for Canadian PN scope because they separate recognition/reporting from provider-level treatment decisions.",
    adaptiveMetadata: metadata(s),
    payload: {
      columns: ["urgent", "routine", "appropriate", "inappropriate"],
      rows,
    },
  };
}

function makeBowtie(s: ScenarioTemplate): CnplePracticalQuestion {
  const correctAnswer = {
    condition: s.condition,
    action: s.priorityAction,
    monitoring: s.monitor,
  };
  return {
    id: `cnple-rpn-bowtie-${s.key}`,
    questionType: "bowtie",
    domain: s.domain,
    topic: s.topic,
    subtopic: s.subtopic,
    difficulty: s.difficulty,
    scenario: `${s.patient} is in a ${s.setting}. ${s.presentation}`,
    stem: "Complete the bow-tie by linking the likely problem, priority action, and best monitoring focus.",
    options: [
      { id: "condition-correct", text: s.condition, correct: true, rationale: `${s.condition} best explains ${s.concerningCue}.` },
      { id: "condition-distractor", text: "Expected baseline variation", correct: false, rationale: "This is tempting if one cue is isolated, but the overall trend is not baseline." },
      { id: "action-correct", text: s.priorityAction, correct: true, rationale: "This action protects immediate safety and escalates through the appropriate team pathway." },
      { id: "action-unsafe", text: s.unsafeAction, correct: false, rationale: "This action delays response to deterioration." },
      { id: "monitor-correct", text: s.monitor, correct: true, rationale: "These parameters show whether the client is improving or worsening." },
      { id: "monitor-distractor", text: "Meal preference and routine comfort only", correct: false, rationale: "Comfort data may matter later, but it does not monitor the active safety risk." },
    ],
    correctAnswer,
    rationale: baseRationale(s, {
      condition: `${s.condition} is correct because the cue cluster is acute and safety-relevant.`,
      action: `${s.priorityAction} is correct because it matches practical nursing scope and escalation timing.`,
      monitoring: `${s.monitor} is correct because reassessment confirms response and detects worsening.`,
    }),
    hints: hints(s),
    clinicalJudgmentFocus: "Link cues to problem, action, and monitoring rather than selecting isolated facts.",
    canadianPracticeNote:
      "Bow-tie reasoning supports RPN recognition, safe first action, and timely reporting without drifting into independent diagnosis.",
    adaptiveMetadata: metadata(s),
    payload: {
      conditionOptions: [s.condition, "Expected baseline variation", "Primary anxiety response"],
      actionOptions: [s.priorityAction, s.unsafeAction, "Delay reassessment until routine rounds"],
      monitoringOptions: [s.monitor, "Meal preference and routine comfort only", "Room temperature only"],
    },
  };
}

const ORDERED_SEQUENCES: ReadonlyArray<{
  key: string;
  scenario: ScenarioTemplate;
  stem: string;
  correctOrder: readonly string[];
}> = [
  { key: "hypoglycemia-response", scenario: SCENARIOS[6], stem: "Place the hypoglycemia response steps in the safest order.", correctOrder: ["Assess airway/swallow safety and confirm glucose.", "Give fast-acting carbohydrate if safe to swallow.", "Recheck glucose in 15 minutes.", "Document response and report recurrent or unresolved hypoglycemia."] },
  { key: "stroke-response", scenario: SCENARIOS[3], stem: "Sequence the practical nurse's response to sudden stroke-like symptoms.", correctOrder: ["Ensure safety and assess airway/glucose.", "Identify last-known-well time.", "Keep NPO and perform focused neurologic check.", "Activate the RN/rapid response or stroke pathway."] },
  { key: "postpartum-bleeding", scenario: SCENARIOS[4], stem: "Sequence the immediate response to suspected postpartum hemorrhage.", correctOrder: ["Call for help while staying with the client.", "Massage the boggy fundus per policy.", "Assess lochia, bladder, and vital signs.", "Prepare for ordered medications/IV support and document response."] },
  { key: "cdiff-ipac", scenario: SCENARIOS[9], stem: "Sequence the initial IPAC response to suspected C. difficile.", correctOrder: ["Place the client on contact precautions per policy.", "Use soap-and-water hand hygiene after care.", "Assess hydration and stool frequency.", "Notify the RN/provider and document isolation actions."] },
  { key: "warfarin-bleed", scenario: SCENARIOS[7], stem: "Sequence the phone-triage response to possible warfarin-related bleeding.", correctOrder: ["Assess bleeding symptoms and safety to remain at home.", "Recognize melena/dizziness with INR 4.8 as urgent.", "Notify the prescriber/RN and direct same-day emergency assessment per policy.", "Document instructions and closed-loop communication."] },
  { key: "wound-infection", scenario: SCENARIOS[10], stem: "Sequence the response to a worsening postoperative wound.", correctOrder: ["Assess wound, pain, temperature, and vital signs.", "Reinforce dressing using ordered technique.", "Report infection/dehiscence concerns promptly.", "Document objective wound findings and reassessment plan."] },
];

function makeOrdered(item: (typeof ORDERED_SEQUENCES)[number]): CnplePracticalQuestion {
  const s = item.scenario;
  return {
    id: `cnple-rpn-ordered-${item.key}`,
    questionType: "ordered-response",
    domain: s.domain,
    topic: s.topic,
    subtopic: s.subtopic,
    difficulty: s.difficulty,
    scenario: `${s.patient} is in a ${s.setting}. ${s.presentation}`,
    stem: item.stem,
    options: item.correctOrder.map((step, index) => ({
      id: String(index + 1),
      text: step,
      correct: true,
      rationale: `Step ${index + 1}: ${step}`,
    })),
    correctAnswer: item.correctOrder,
    rationale: baseRationale(s, {
      sequence: "The safest sequence starts with immediate assessment/safety, then the ordered or protocol action, then reassessment and communication.",
    }),
    hints: hints(s),
    clinicalJudgmentFocus: "Sequence assessment, intervention, escalation, and reassessment.",
    canadianPracticeNote:
      "Ordered-response items mirror practical nursing workflow: do not skip assessment, scope checks, or documentation.",
    adaptiveMetadata: metadata(s),
  };
}

const CHART_REVIEW_SCENARIOS = SCENARIOS.slice(0, 6);

function makeChartReview(s: ScenarioTemplate): CnplePracticalQuestion {
  const chartTabs = {
    vitals: `Current trend shows ${s.concerningCue}.`,
    notes: `Previous note documented ${s.expectedFinding}; current note states ${s.presentation}`,
    orders: "Continue ordered care, notify regulated team member for acute change, follow site policy.",
    mar: "Review recent medications and hold/clarify only as policy and orders require.",
  };
  return {
    id: `cnple-rpn-chart-${s.key}`,
    questionType: "chart-review",
    domain: s.domain,
    topic: s.topic,
    subtopic: s.subtopic,
    difficulty: s.difficulty,
    scenario: `${s.patient} is in a ${s.setting}. The learner reviews vitals, notes, orders, and MAR before choosing the priority.`,
    stem: "Which chart finding requires the most immediate nursing follow-up?",
    options: [
      { id: "A", text: s.concerningCue, correct: true, rationale: `This is the priority chart cue because it suggests ${s.condition}.` },
      { id: "B", text: s.expectedFinding, correct: false, rationale: "This is closer to baseline and does not explain acute risk." },
      { id: "C", text: "The client prefers tea with breakfast.", correct: false, rationale: "Preference matters for comfort, but it is not the priority safety finding." },
      { id: "D", text: "The admission paperwork is missing a non-urgent phone number.", correct: false, rationale: "Administrative follow-up should not delay response to deterioration." },
    ],
    correctAnswer: "A",
    rationale: baseRationale(s),
    hints: hints(s),
    clinicalJudgmentFocus: "Scan the EHR for trend-based deterioration instead of isolated normal details.",
    canadianPracticeNote:
      "Canadian chart-review items emphasize objective documentation, trend recognition, and closed-loop escalation under local policy.",
    adaptiveMetadata: metadata(s),
    payload: { chartTabs },
  };
}

const SPECIALTY_INTERACTIVE_ITEMS: readonly CnplePracticalQuestion[] = [
  {
    id: "cnple-rpn-hotspot-im-injection-site",
    questionType: "hotspot",
    domain: "pharmacology",
    topic: "Medication administration",
    subtopic: "IM injection site safety",
    difficulty: "foundational",
    scenario: "An adult client requires an ordered intramuscular vaccine in a community clinic.",
    stem: "Select the safest deltoid landmark region for an adult IM vaccine.",
    options: [
      { id: "A", text: "Central deltoid, below the acromion and above the axillary fold", correct: true, rationale: "This region avoids injecting too high near the shoulder capsule or too low near neurovascular structures." },
      { id: "B", text: "Directly over the acromion process", correct: false, rationale: "Too high increases shoulder injury risk." },
      { id: "C", text: "Near the antecubital fossa", correct: false, rationale: "This is not a deltoid IM injection site." },
      { id: "D", text: "Over an inflamed rash", correct: false, rationale: "Inflamed or infected skin should not be used for injection." },
    ],
    correctAnswer: "A",
    rationale: {
      correct: "The central deltoid landmark is the safest adult IM vaccine site when volume and client factors are appropriate.",
      prioritizationLogic: "Medication safety begins with the right route, site, landmark, client, and documentation.",
      safetyImplication: "Incorrect landmarking can cause shoulder injury, nerve injury, pain, or poor absorption.",
      wrongAnswers: {
        B: "Too-high placement is a known vaccine administration injury risk.",
        C: "The antecubital area is used for venipuncture, not deltoid IM injection.",
        D: "Compromised skin increases infection and tissue injury risk.",
      },
    },
    hints: ["Think landmark, not just muscle name.", "Avoid sites too close to joints, nerves, or compromised skin.", "Choose the central deltoid region appropriate for an adult IM vaccine."],
    clinicalJudgmentFocus: "Medication administration safety and anatomy-based landmarking.",
    canadianPracticeNote: "Follow provincial standards, employer policy, product monograph, and client-specific assessment.",
    adaptiveMetadata: metadata(SCENARIOS[6], { cognitiveLoad: 2, prioritizationLevel: 2 }),
    payload: { mediaDescription: "Adult upper-arm landmark diagram", correctRegions: ["central-deltoid"] },
  },
  {
    id: "cnple-rpn-hotspot-pressure-injury-sacrum",
    questionType: "hotspot",
    domain: "geriatrics",
    topic: "Pressure injury prevention",
    subtopic: "Sacral skin assessment",
    difficulty: "foundational",
    scenario: "A bedbound older adult has new non-blanchable redness over a bony prominence.",
    stem: "Select the area the practical nurse should identify as the sacrum for focused pressure-injury assessment.",
    options: [
      { id: "A", text: "Lower back over the triangular bone above the gluteal cleft", correct: true, rationale: "This is the sacral region, a common pressure injury site." },
      { id: "B", text: "Anterior thigh", correct: false, rationale: "The anterior thigh is not the sacrum and is less commonly pressure-loaded in supine positioning." },
      { id: "C", text: "Lateral elbow", correct: false, rationale: "The elbow is a bony prominence but not the sacrum." },
      { id: "D", text: "Mid-sternum", correct: false, rationale: "The sternum is not the pressure area described." },
    ],
    correctAnswer: "A",
    rationale: {
      correct: "The sacrum is vulnerable when clients remain supine; non-blanchable redness suggests pressure injury risk.",
      prioritizationLogic: "Identify the correct site, offload pressure, assess skin, and report/document early changes.",
      safetyImplication: "Missing early pressure injury signs can lead to tissue breakdown, pain, infection, and longer hospitalization.",
      wrongAnswers: { B: "This does not match the described bony prominence.", C: "This is a different pressure point.", D: "This is anatomically unrelated." },
    },
    hints: ["Think about where pressure is highest when supine.", "The sacrum sits near the lower back and gluteal cleft.", "Choose the triangular bony area above the buttocks."],
    clinicalJudgmentFocus: "Skin safety and early injury recognition.",
    canadianPracticeNote: "Use facility skin-assessment policy, validated risk tools, and objective wound documentation.",
    adaptiveMetadata: metadata(SCENARIOS[8], { cognitiveLoad: 2, prioritizationLevel: 2 }),
    payload: { mediaDescription: "Posterior torso pressure-area diagram", correctRegions: ["sacrum"] },
  },
  {
    id: "cnple-rpn-cloze-insulin-hypoglycemia",
    questionType: "cloze",
    domain: "pharmacology",
    topic: "Diabetes safety",
    subtopic: "Hypoglycemia protocol",
    difficulty: "intermediate",
    scenario: "A client receiving insulin is shaky and confused before lunch. Blood glucose is 3.1 mmol/L and the client can swallow.",
    stem: "Complete the safest statement: Give _____ now and recheck blood glucose in _____.",
    options: [
      { id: "A", text: "fast-acting carbohydrate; 15 minutes", correct: true, rationale: "This matches common hypoglycemia protocol timing when the client can swallow." },
      { id: "B", text: "rapid-acting insulin; 15 minutes", correct: false, rationale: "More insulin worsens hypoglycemia and can rapidly intensify confusion, seizure risk, or loss of consciousness." },
      { id: "C", text: "water; 1 hour", correct: false, rationale: "Water does not correct low glucose, and waiting an hour delays the required reassessment after treatment." },
      { id: "D", text: "a full high-fat meal; 2 hours", correct: false, rationale: "High-fat food slows carbohydrate absorption and does not match the urgent correction/recheck sequence." },
    ],
    correctAnswer: "A",
    rationale: baseRationale(SCENARIOS[6]),
    hints: hints(SCENARIOS[6]),
    clinicalJudgmentFocus: "Protocol-based hypoglycemia treatment and reassessment.",
    canadianPracticeNote: "Use site hypoglycemia protocol and escalate if the client cannot swallow or does not respond.",
    adaptiveMetadata: metadata(SCENARIOS[6]),
  },
  {
    id: "cnple-rpn-cloze-documentation",
    questionType: "cloze",
    domain: "ethics",
    topic: "Documentation",
    subtopic: "Objective charting after refusal",
    difficulty: "foundational",
    scenario: "A capable client refuses a dressing change after risks and benefits are explained.",
    stem: "Select the best documentation phrase: Client _____ dressing change after explanation of infection risk; _____ notified.",
    options: [
      { id: "A", text: "refused; RN/prescriber per policy", correct: true, rationale: "This is objective and includes communication." },
      { id: "B", text: "was non-compliant with; no one", correct: false, rationale: "Judgmental language and lack of communication are unsafe." },
      { id: "C", text: "was difficult about; family only", correct: false, rationale: "This is subjective and does not reflect proper clinical escalation." },
      { id: "D", text: "ignored; chart omitted", correct: false, rationale: "Omitting refusal documentation creates safety and legal risk." },
    ],
    correctAnswer: "A",
    rationale: baseRationale(SCENARIOS[11]),
    hints: hints(SCENARIOS[11]),
    clinicalJudgmentFocus: "Objective, respectful, legally sound documentation.",
    canadianPracticeNote: "Canadian nursing documentation should be factual, timely, objective, and include communication/escalation.",
    adaptiveMetadata: metadata(SCENARIOS[11], { safetyCritical: false, cognitiveLoad: 2 }),
  },
  {
    id: "cnple-rpn-extended-matching-respiratory-cues",
    questionType: "extended-matching",
    domain: "medical-surgical",
    topic: "Respiratory cue differentiation",
    subtopic: "Stable vs deteriorating respiratory presentations",
    difficulty: "advanced",
    scenario: "The practical nurse reviews four respiratory mini-scenarios during a busy shift.",
    stem: "Match the mini-scenario requiring immediate escalation.",
    options: [
      { id: "A", text: "COPD client restless with SpO2 85% and accessory muscle use", correct: true, rationale: "This indicates acute respiratory deterioration." },
      { id: "B", text: "Client uses inhaler before usual morning walk and reports baseline dyspnea", correct: false, rationale: "This is stable if it matches baseline and response is expected." },
      { id: "C", text: "Client asks for more pillows but denies dyspnea and has SpO2 97%", correct: false, rationale: "Comfort request alone is not the highest acuity." },
      { id: "D", text: "Client coughs once after drinking and then clears throat", correct: false, rationale: "Needs observation/swallow screening if recurrent, but it is less urgent than hypoxemic distress." },
    ],
    correctAnswer: "A",
    rationale: baseRationale(SCENARIOS[0]),
    hints: hints(SCENARIOS[0]),
    clinicalJudgmentFocus: "Compare similar respiratory presentations and identify the unstable one.",
    canadianPracticeNote:
      "Canadian practical nursing escalation should use objective deterioration cues and local policy, not diagnosis labels alone.",
    adaptiveMetadata: metadata(SCENARIOS[0]),
  },
  {
    id: "cnple-rpn-extended-matching-pharm-risk",
    questionType: "extended-matching",
    domain: "pharmacology",
    topic: "High-alert medication safety",
    subtopic: "Medication risk pattern recognition",
    difficulty: "advanced",
    scenario: "The practical nurse reviews medication safety concerns for four clients.",
    stem: "Which medication situation is highest priority to report before administration?",
    options: [
      { id: "A", text: "Warfarin client with black stool and INR 4.8", correct: true, rationale: "This suggests active bleeding with over-anticoagulation." },
      { id: "B", text: "Client asks what time their vitamin D is due", correct: false, rationale: "This is routine teaching, not urgent." },
      { id: "C", text: "Client dislikes the taste of liquid acetaminophen", correct: false, rationale: "This is comfort/adherence, not a high-alert safety emergency." },
      { id: "D", text: "Client prefers metformin with supper", correct: false, rationale: "Timing may matter for tolerance but is not the priority risk." },
    ],
    correctAnswer: "A",
    rationale: baseRationale(SCENARIOS[7]),
    hints: hints(SCENARIOS[7]),
    clinicalJudgmentFocus: "Identify high-alert medication complications requiring urgent escalation.",
    canadianPracticeNote: "RPN medication administration includes verifying safety, holding/clarifying per policy, and escalating concerns.",
    adaptiveMetadata: metadata(SCENARIOS[7]),
  },
  {
    id: "cnple-rpn-communication-sbar-sepsis",
    questionType: "communication",
    domain: "leadership-delegation",
    topic: "SBAR escalation",
    subtopic: "Sepsis communication",
    difficulty: "advanced",
    scenario: `${SCENARIOS[1].patient} is in an ${SCENARIOS[1].setting}. ${SCENARIOS[1].presentation}`,
    stem: "Which SBAR statement best communicates the concern?",
    options: [
      { id: "A", text: "Situation: new confusion and low BP. Background: catheter and fever. Assessment: possible sepsis. Recommendation: urgent RN/provider assessment.", correct: true, rationale: "This organizes acute risk, source, interpretation, and needed escalation." },
      { id: "B", text: "The resident is acting strangely; please check later.", correct: false, rationale: "This is vague and lacks vital signs or urgency." },
      { id: "C", text: "The urine smells bad, so antibiotics are needed now.", correct: false, rationale: "This jumps to treatment rather than reporting assessment and seeking evaluation." },
      { id: "D", text: "Family says this happens sometimes, so no action is needed.", correct: false, rationale: "This ignores objective deterioration and family actually says it is not baseline." },
    ],
    correctAnswer: "A",
    rationale: baseRationale(SCENARIOS[1]),
    hints: hints(SCENARIOS[1]),
    clinicalJudgmentFocus: "Use SBAR to escalate deterioration with objective data.",
    canadianPracticeNote: "Closed-loop communication is a core patient-safety expectation in Canadian care settings.",
    adaptiveMetadata: metadata(SCENARIOS[1], { delegationComplexity: 3 }),
  },
  {
    id: "cnple-rpn-communication-therapeutic-panic",
    questionType: "communication",
    domain: "mental-health",
    topic: "Therapeutic communication",
    subtopic: "Anxiety and safety assessment",
    difficulty: "intermediate",
    scenario: "A client in a clinic says, 'I feel like I can't breathe and I might die.' Vitals are being assessed while the client appears panicked.",
    stem: "Which response is most therapeutic while maintaining safety?",
    options: [
      { id: "A", text: "I will stay with you while we check your breathing and vital signs.", correct: true, rationale: "This validates distress, promotes safety, and does not dismiss possible physical causes." },
      { id: "B", text: "There is nothing wrong; calm down.", correct: false, rationale: "This dismisses the client and misses potential physical deterioration." },
      { id: "C", text: "Everyone feels this way sometimes.", correct: false, rationale: "This minimizes the experience and does not address assessment." },
      { id: "D", text: "You should not be so dramatic.", correct: false, rationale: "This is judgmental, damages trust, and may delay assessment of a potentially urgent physical concern." },
    ],
    correctAnswer: "A",
    rationale: {
      correct: "Therapeutic communication combines presence, validation, and objective assessment.",
      prioritizationLogic: "Do not assume anxiety until safety assessment rules out urgent physical concerns.",
      safetyImplication: "Dismissive communication can delay recognition of respiratory or cardiac emergencies.",
      wrongAnswers: {
        B: "Dismissive and premature reassurance.",
        C: "Normalizing does not support immediate safety.",
        D: "Judgmental language damages trust and violates therapeutic communication principles.",
      },
    },
    hints: ["Acknowledge fear without diagnosing it.", "Safety assessment and calm presence can happen together.", "Choose the response that stays with the client and checks objective data."],
    clinicalJudgmentFocus: "Therapeutic communication plus safety-first assessment.",
    canadianPracticeNote:
      "Respectful, patient-centred communication supports culturally safer Canadian care and practical nursing assessment.",
    adaptiveMetadata: metadata(SCENARIOS[8], { cognitiveLoad: 2, prioritizationLevel: 2 }),
  },
  {
    id: "cnple-rpn-delegation-ucp-stable-care",
    questionType: "delegation-assignment",
    domain: "leadership-delegation",
    topic: "Delegation and assignment",
    subtopic: "UCP task assignment",
    difficulty: "intermediate",
    scenario: "An RPN is working with an unregulated care provider on a medical unit.",
    stem: "Which task is most appropriate to assign to the UCP?",
    options: [
      { id: "A", text: "Assist a stable client with bathing and report shortness of breath or dizziness.", correct: true, rationale: "This is a routine assistance task with clear reporting parameters." },
      { id: "B", text: "Assess a new postoperative wound and decide whether it is infected.", correct: false, rationale: "Assessment and clinical judgment are nursing responsibilities." },
      { id: "C", text: "Teach insulin dose adjustment for discharge.", correct: false, rationale: "Teaching medication adjustment requires regulated nursing assessment/education." },
      { id: "D", text: "Triage a client with sudden chest pain.", correct: false, rationale: "Unstable symptoms require regulated nursing assessment and escalation." },
    ],
    correctAnswer: "A",
    rationale: {
      correct: "Routine assistance for a stable client can be assigned with clear expectations and reporting criteria.",
      prioritizationLogic: "Delegate tasks, not nursing judgment; retain responsibility for assessment, teaching, and unstable clients.",
      safetyImplication: "Unsafe delegation can delay deterioration recognition and create accountability risk.",
      wrongAnswers: { B: "Requires nursing assessment.", C: "Requires regulated teaching and evaluation.", D: "Requires urgent nursing assessment." },
    },
    hints: ["Ask whether the task requires nursing assessment.", "Stable routine care is more delegable than new or unstable findings.", "Choose the task with clear instructions and report-back criteria."],
    clinicalJudgmentFocus: "Match task complexity to role, stability, and supervision needs.",
    canadianPracticeNote: "Use provincial standards, employer policy, and client predictability when assigning tasks.",
    adaptiveMetadata: metadata(SCENARIOS[2], { delegationComplexity: 4 }),
  },
  {
    id: "cnple-rpn-delegation-assignment-four-clients",
    questionType: "delegation-assignment",
    domain: "leadership-delegation",
    topic: "Assignment prioritization",
    subtopic: "Stable vs unstable client assignment",
    difficulty: "advanced",
    scenario: "The charge nurse asks which client is safest for an RPN assignment with RN consultation available.",
    stem: "Which client assignment best fits practical nursing care with predictable outcomes?",
    options: [
      { id: "A", text: "Stable cellulitis client receiving scheduled oral antibiotics and dressing change", correct: true, rationale: "This client is predictable with routine medication and wound care needs." },
      { id: "B", text: "Client with new chest pain and diaphoresis", correct: false, rationale: "This is unstable and requires immediate RN/provider escalation because cardiac perfusion may be compromised." },
      { id: "C", text: "Postpartum client saturating pads every 15 minutes", correct: false, rationale: "Possible hemorrhage is unstable and needs immediate postpartum emergency response rather than routine assignment." },
      { id: "D", text: "Child with increasing retractions and SpO2 89%", correct: false, rationale: "Pediatric respiratory distress is high acuity because children can fatigue and deteriorate quickly." },
    ],
    correctAnswer: "A",
    rationale: {
      correct: "The stable cellulitis client has predictable needs appropriate to practical nursing care.",
      prioritizationLogic: "Assignment decisions compare stability, predictability, complexity, and available supports.",
      safetyImplication: "Assigning unstable clients without appropriate RN involvement can delay rescue.",
      wrongAnswers: { B: "Possible ACS is unstable.", C: "Possible hemorrhage is unstable.", D: "Respiratory distress in a child is unstable." },
    },
    hints: [
      "Start by asking whether each client is stable and predictable.",
      "Unstable vital signs, acute bleeding, chest pain, or pediatric respiratory distress require higher-level escalation.",
      "Choose the client with routine, expected care needs and available consultation if the situation changes.",
    ],
    clinicalJudgmentFocus: "Canadian practical nursing assignment safety.",
    canadianPracticeNote: "Practical-nursing assignment must reflect client complexity, predictability, competence, and consultation resources.",
    adaptiveMetadata: metadata(SCENARIOS[2], { delegationComplexity: 5 }),
  },
  {
    id: "cnple-rpn-med-safety-opioid-sedation",
    questionType: "medication-safety",
    domain: "pharmacology",
    topic: "Opioid safety",
    subtopic: "Sedation and respiratory depression",
    difficulty: "advanced",
    scenario: "A postoperative client is due for morphine. The client is difficult to arouse, RR is 8/min, and SpO2 is 89% on room air.",
    stem: "What is the safest practical-nursing action?",
    options: [
      { id: "A", text: "Hold the opioid, stimulate/assess the client, apply ordered oxygen if available, and notify the RN/provider immediately.", correct: true, rationale: "Sedation with RR 8 indicates possible opioid-induced respiratory depression." },
      { id: "B", text: "Give the morphine because pain control prevents complications.", correct: false, rationale: "Administering more opioid can worsen respiratory depression." },
      { id: "C", text: "Let the client sleep and reassess in 2 hours.", correct: false, rationale: "RR 8 and low SpO2 are urgent, not routine rest." },
      { id: "D", text: "Tell the family the client is just tired.", correct: false, rationale: "This dismisses objective danger signs." },
    ],
    correctAnswer: "A",
    rationale: {
      correct: "Hold/clarify high-risk medication and escalate because the client shows respiratory depression.",
      pathophysiology: "Opioids depress central respiratory drive and can reduce ventilation before cardiac arrest.",
      prioritizationLogic: "Airway and breathing outrank scheduled medication administration.",
      safetyImplication: "Delayed recognition can lead to respiratory arrest; naloxone may be ordered by authorized clinicians.",
      wrongAnswers: { B: "More opioid worsens the problem.", C: "Delays rescue.", D: "Minimizes a high-risk finding." },
    },
    hints: ["Check ABCs before giving a scheduled medication.", "RR 8/min is not a normal sleep finding.", "Hold and escalate rather than administer another opioid."],
    clinicalJudgmentFocus: "High-alert medication safety and respiratory assessment.",
    canadianPracticeNote:
      "Follow Canadian medication administration standards: right assessment, right documentation, and clarification when unsafe.",
    adaptiveMetadata: metadata(SCENARIOS[10], { cognitiveLoad: 4, prioritizationLevel: 5 }),
  },
  {
    id: "cnple-rpn-med-safety-digoxin-apical",
    questionType: "medication-safety",
    domain: "pharmacology",
    topic: "Cardiac medication safety",
    subtopic: "Digoxin assessment",
    difficulty: "intermediate",
    scenario: "A client is due for digoxin. The apical pulse is 52/min and the client reports nausea and seeing yellow halos.",
    stem: "What should the practical nurse do?",
    options: [
      { id: "A", text: "Hold the dose and notify the RN/provider according to policy.", correct: true, rationale: "Bradycardia and visual/nausea symptoms suggest possible digoxin toxicity." },
      { id: "B", text: "Give the dose because nausea is common with breakfast.", correct: false, rationale: "The symptom cluster is medication-safety relevant." },
      { id: "C", text: "Give double fluids and recheck next week.", correct: false, rationale: "This does not address bradycardia or toxicity risk." },
      { id: "D", text: "Ignore the apical pulse and use the radial pulse only.", correct: false, rationale: "Digoxin assessment requires careful apical pulse and symptom review per policy." },
    ],
    correctAnswer: "A",
    rationale: {
      correct: "Digoxin should be held/clarified when bradycardia and toxicity symptoms appear.",
      pathophysiology: "Digoxin slows AV nodal conduction; toxicity can cause bradyarrhythmias, GI symptoms, and visual changes.",
      prioritizationLogic: "Assess before administering cardiac medications and escalate unsafe findings.",
      safetyImplication: "Giving digoxin during toxicity can precipitate dangerous dysrhythmias.",
      wrongAnswers: { B: "Minimizes toxicity cues.", C: "Unrelated and delays escalation.", D: "Uses an unsafe assessment shortcut." },
    },
    hints: ["Connect pulse rate with medication effect.", "Nausea plus visual changes are not random here.", "Hold/clarify when assessment findings make administration unsafe."],
    clinicalJudgmentFocus: "Medication assessment before administration.",
    canadianPracticeNote: "Employer policy will define hold parameters; unsafe findings require clarification and documentation.",
    adaptiveMetadata: metadata(SCENARIOS[2], { cognitiveLoad: 3, prioritizationLevel: 4 }),
  },
  {
    id: "cnple-rpn-case-study-sepsis-evolution",
    questionType: "case-study",
    domain: "geriatrics",
    topic: "Evolving sepsis case",
    subtopic: "Longitudinal reassessment",
    difficulty: "exam-level",
    scenario: "An older LTC resident develops infection cues across a shift: decreased intake, new confusion, tachypnea, hypotension, and reduced urine output.",
    stem: "Which decision best reflects safe management as the case evolves?",
    options: [
      { id: "A", text: "Recognize the trend as possible sepsis, escalate immediately, monitor perfusion/urine output, and document SBAR communication.", correct: true, rationale: "This integrates evolving cues, escalation, monitoring, and documentation." },
      { id: "B", text: "Wait for a high fever before notifying anyone.", correct: false, rationale: "Older adults may not mount high fever; waiting delays care." },
      { id: "C", text: "Treat confusion as dementia and continue routine activities.", correct: false, rationale: "Acute change is not baseline dementia." },
      { id: "D", text: "Administer leftover antibiotics from a previous prescription.", correct: false, rationale: "This is unsafe, outside scope, and antimicrobial-stewardship failure." },
    ],
    correctAnswer: "A",
    rationale: baseRationale(SCENARIOS[1]),
    hints: hints(SCENARIOS[1]),
    clinicalJudgmentFocus: "Use evolving data to reprioritize care over time.",
    canadianPracticeNote:
      "Canadian longitudinal case items should reward reassessment and communication, not one-time cue memorization.",
    adaptiveMetadata: metadata(SCENARIOS[1], { cognitiveLoad: 5, prioritizationLevel: 5 }),
    payload: {
      timeline: [
        "0700: reduced breakfast intake and new confusion",
        "0900: RR 24/min, HR 112/min, T 38.1 C",
        "1000: BP 94/58 and reduced urine output",
      ],
      linkedTasks: ["cue recognition", "priority action", "monitoring", "SBAR"],
    },
  },
  {
    id: "cnple-rpn-safety-deterioration-shock",
    questionType: "safety-deterioration",
    domain: "emergency-care",
    topic: "Shock recognition",
    subtopic: "Compensated to decompensated shock",
    difficulty: "exam-level",
    scenario: "A client who fell at home becomes pale, diaphoretic, increasingly anxious, HR 124/min, BP drops from 118/74 to 88/50, and urine output is minimal.",
    stem: "Which finding most strongly indicates the client is deteriorating and requires urgent escalation?",
    options: [
      { id: "A", text: "Dropping blood pressure with tachycardia, diaphoresis, anxiety, and low urine output", correct: true, rationale: "This pattern suggests poor perfusion and shock progression." },
      { id: "B", text: "The client asks when supper will arrive", correct: false, rationale: "This is not the safety priority compared with perfusion changes." },
      { id: "C", text: "A bruise is present where the client bumped the arm", correct: false, rationale: "A local bruise alone is less concerning than systemic shock signs." },
      { id: "D", text: "The call bell is out of reach", correct: false, rationale: "This is a safety issue to fix, but not the physiologic deterioration cue." },
    ],
    correctAnswer: "A",
    rationale: {
      correct: "The combined trend indicates inadequate perfusion and possible shock.",
      pathophysiology: "Shock reduces tissue perfusion; tachycardia and anxiety may appear before hypotension, while low urine output reflects renal hypoperfusion.",
      prioritizationLogic: "Trend-based instability outranks routine comfort and local findings.",
      safetyImplication: "Failure to escalate shock signs can lead to organ failure or cardiac arrest.",
      wrongAnswers: { B: "Comfort concern, not urgent deterioration.", C: "Isolated local finding.", D: "Environmental safety, but not the physiologic emergency." },
    },
    hints: ["Look for a pattern, not one number.", "Perfusion cues include mentation, skin, pulse, BP, and urine output.", "Choose the finding cluster that suggests shock."],
    clinicalJudgmentFocus: "Failure-to-rescue prevention through trend recognition.",
    canadianPracticeNote:
      "Escalate unstable trends using local emergency response pathways/policy and document objective changes.",
    adaptiveMetadata: metadata(SCENARIOS[1], { cognitiveLoad: 5, prioritizationLevel: 5 }),
  },
  {
    id: "cnple-rpn-community-home-care-falls",
    questionType: "prioritization",
    domain: "community-health",
    topic: "Home safety",
    subtopic: "Falls risk and community escalation",
    difficulty: "intermediate",
    scenario:
      "During a home-care visit, an older adult reports two falls this week, dizziness when standing, poor fluid intake, and a new over-the-counter sleep aid started 4 days ago.",
    stem: "Which action should the practical nurse take first?",
    options: [
      {
        id: "A",
        text: "Assess orthostatic symptoms, immediate injury risk, medication changes, hydration, and notify the care team with objective findings.",
        correct: true,
        rationale:
          "Repeated falls plus dizziness and a new sedating medication require immediate safety assessment and communication.",
      },
      {
        id: "B",
        text: "Tell the client falls are expected with aging and schedule the next routine visit.",
        correct: false,
        rationale:
          "Falls are not an expected finding to dismiss; repeated falls may signal medication harm, dehydration, or acute illness.",
      },
      {
        id: "C",
        text: "Remove all medications from the home without consultation.",
        correct: false,
        rationale:
          "Medication safety concerns must be reported and clarified; removing all medications independently can cause harm.",
      },
      {
        id: "D",
        text: "Focus only on tidying the home because environmental hazards are the sole cause of falls.",
        correct: false,
        rationale:
          "Environmental hazards matter, but dizziness, poor intake, and sedating medication require clinical follow-up.",
      },
    ],
    correctAnswer: "A",
    rationale: {
      correct:
        "The safest action is to assess immediate risk and communicate objective findings because repeated falls can indicate a reversible clinical or medication-related problem.",
      prioritizationLogic:
        "Home-care practical nursing prioritizes immediate safety, injury assessment, medication-change recognition, hydration cues, and clear escalation to the care team.",
      safetyImplication:
        "Delayed follow-up can lead to fracture, head injury, medication harm, dehydration, or loss of independence.",
      wrongAnswers: {
        B: "This normalizes a preventable safety risk and delays assessment.",
        C: "This exceeds safe practical-nursing action and may interrupt necessary medications.",
        D: "This is too narrow and misses clinical causes of falls.",
      },
    },
    hints: [
      "In community care, repeated falls are safety events, not just environmental problems.",
      "Look for reversible contributors such as dizziness, hydration, and recent medication changes.",
      "Choose the action that assesses immediate risk and escalates objective findings.",
    ],
    clinicalJudgmentFocus: "Recognize falls as a community-health safety signal requiring assessment and team communication.",
    canadianPracticeNote:
      "Canadian community nursing relies on policy-based escalation, medication reconciliation awareness, and interprofessional fall-prevention planning.",
    adaptiveMetadata: metadata(SCENARIOS[2], {
      cognitiveLoad: 3,
      prioritizationLevel: 4,
      misconceptionTags: ["falls-are-normal-aging", "medication-change-missed", "home-care-escalation-delay"],
    }),
  },
];

export const cnplePracticalNursingNgnExpansionQuestions: readonly CnplePracticalQuestion[] = [
  ...SCENARIOS.flatMap((scenario) => [
    makePrioritization(scenario),
    makeSata(scenario),
    makeMatrix(scenario),
    makeBowtie(scenario),
  ]),
  ...ORDERED_SEQUENCES.map(makeOrdered),
  ...CHART_REVIEW_SCENARIOS.map(makeChartReview),
  ...SPECIALTY_INTERACTIVE_ITEMS,
] as const;

export const CNPLE_PRACTICAL_NURSING_EXPANSION_METRICS = {
  totalQuestions: cnplePracticalNursingNgnExpansionQuestions.length,
  byType: cnplePracticalNursingNgnExpansionQuestions.reduce<Record<CnplePracticalQuestionType, number>>(
    (acc, question) => {
      acc[question.questionType] = (acc[question.questionType] ?? 0) + 1;
      return acc;
    },
    {} as Record<CnplePracticalQuestionType, number>,
  ),
  byDomain: cnplePracticalNursingNgnExpansionQuestions.reduce<Record<CnpleContentDomain, number>>(
    (acc, question) => {
      acc[question.domain] = (acc[question.domain] ?? 0) + 1;
      return acc;
    },
    {} as Record<CnpleContentDomain, number>,
  ),
  safetyCritical: cnplePracticalNursingNgnExpansionQuestions.filter((question) => question.adaptiveMetadata.safetyCritical)
    .length,
} as const;

export default {
  questions: cnplePracticalNursingNgnExpansionQuestions,
  metrics: CNPLE_PRACTICAL_NURSING_EXPANSION_METRICS,
};
