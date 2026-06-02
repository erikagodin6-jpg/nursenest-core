/**
 * Tier 2 NCLEX-style clinical judgment question catalog.
 *
 * These NurseNest-authored items are moderately challenging entry-level RN
 * licensure questions. They emphasize multi-step reasoning without drifting
 * into ICU, specialty procedural, or provider-level management.
 */

export type NclexTier2QuestionType =
  | "priority"
  | "first-assess"
  | "delegation"
  | "trend-recognition"
  | "medication-safety"
  | "ngn-case";

export type NclexTier2Domain =
  | "medical-surgical"
  | "pharmacology"
  | "respiratory"
  | "cardiovascular"
  | "neurologic"
  | "endocrine"
  | "postoperative"
  | "delegation"
  | "safety";

export type NclexTier2Option = {
  id: "A" | "B" | "C" | "D";
  text: string;
  correct: boolean;
  rationale: string;
};

export type NclexTier2Question = {
  id: string;
  tier: 2;
  questionType: NclexTier2QuestionType;
  exam: readonly ["NCLEX-RN"];
  domain: NclexTier2Domain;
  topic: string;
  subtopic: string;
  scenario: string;
  stem: string;
  options: readonly [NclexTier2Option, NclexTier2Option, NclexTier2Option, NclexTier2Option];
  correctAnswer: "A" | "B" | "C" | "D";
  rationale: {
    correct: string;
    prioritizationLogic: string;
    safetyThinking: string;
    ngnReasoning: string;
    wrongAnswers: Record<"A" | "B" | "C" | "D", string>;
  };
  hints: readonly [string, string, string];
  teachingPoint: string;
  noviceScopeGuardrail: string;
  adaptiveMetadata: {
    difficulty: "tier-2-moderate-clinical-judgment";
    cognitiveLoad: 2 | 3;
    safetyCritical: boolean;
    prioritizationLevel: 2 | 3;
    misconceptionTags: readonly string[];
    avoidedAdvancedContent: readonly string[];
  };
};

function option(
  id: "A" | "B" | "C" | "D",
  text: string,
  correct: boolean,
  rationale: string,
): NclexTier2Option {
  return { id, text, correct, rationale };
}

type Scenario = {
  key: string;
  questionType: NclexTier2QuestionType;
  domain: NclexTier2Domain;
  topic: string;
  subtopic: string;
  scenario: string;
  stem: string;
  correct: string;
  distractors: readonly [string, string, string];
  rationale: string;
  priority: string;
  safety: string;
  ngn: string;
  trap: string;
  hints: readonly [string, string, string];
  teaching: string;
  tags: readonly string[];
};

const SCENARIOS: readonly Scenario[] = [
  {
    key: "sepsis-older-adult",
    questionType: "priority",
    domain: "medical-surgical",
    topic: "Sepsis recognition",
    subtopic: "Older adult deterioration",
    scenario:
      "Four clients are assigned to the nurse on a medical unit. One client has a urinary tract infection and is now confused, RR 26/min, HR 118/min, BP 88/54, and skin cool to touch.",
    stem: "Which client should the nurse assess first?",
    correct: "The client with infection, new confusion, tachypnea, tachycardia, hypotension, and cool skin.",
    distractors: [
      "A client with chronic back pain requesting prescribed acetaminophen.",
      "A client with type 2 diabetes whose premeal glucose is 168 mg/dL.",
      "A client with pneumonia who reports fatigue but has SpO2 95% on room air.",
    ],
    rationale: "The infection plus hypotension, tachypnea, tachycardia, cool skin, and acute confusion suggests possible sepsis and poor perfusion.",
    priority: "Potential sepsis with perfusion changes is the most unstable presentation and requires immediate assessment and escalation.",
    safety: "Early recognition and prompt reporting reduce failure-to-rescue risk.",
    ngn: "Recognize cues, analyze the trend as systemic deterioration, prioritize sepsis risk, and take action by assessing and escalating.",
    trap: "Do not wait for a high fever; older adults may deteriorate with confusion and vital-sign changes.",
    hints: [
      "Look for the client with both infection and unstable vital signs.",
      "New confusion plus hypotension is more urgent than stable chronic symptoms.",
      "Choose the client with possible sepsis and poor perfusion.",
    ],
    teaching: "Tier 2 sepsis questions often require combining several moderate cues into one high-risk pattern.",
    tags: ["sepsis", "deterioration", "hypotension"],
  },
  {
    key: "postop-bleeding",
    questionType: "trend-recognition",
    domain: "postoperative",
    topic: "Postoperative complications",
    subtopic: "Bleeding and shock cues",
    scenario:
      "A client is 6 hours postoperative after abdominal surgery. The dressing has a growing area of bright red drainage, HR increased from 88 to 116/min, and BP decreased from 132/78 to 96/58.",
    stem: "Which action is the nurse's priority?",
    correct: "Assess the client and surgical site, reinforce the dressing if needed, and notify the surgeon or rapid response pathway per policy.",
    distractors: [
      "Remove the original dressing to measure the drainage directly.",
      "Document the drainage and recheck the dressing at the end of the shift.",
      "Offer oral fluids and encourage the client to ambulate.",
    ],
    rationale: "Increasing bright red drainage with tachycardia and falling blood pressure suggests possible postoperative bleeding.",
    priority: "The nurse should assess, protect the site according to policy, and escalate promptly.",
    safety: "Delayed response to bleeding can lead to shock, so the nurse must treat the trend as a time-sensitive safety concern.",
    ngn: "The trend in vital signs and drainage changes the hypothesis from routine recovery to possible hemorrhage.",
    trap: "Do not treat growing bleeding as routine dressing care.",
    hints: [
      "Compare the current vital signs with the earlier baseline.",
      "Bright red drainage plus tachycardia and lower blood pressure is not routine.",
      "Choose assessment and escalation for possible bleeding.",
    ],
    teaching: "Moderate postoperative questions often test trend recognition rather than one isolated finding.",
    tags: ["postoperative", "bleeding", "shock"],
  },
  {
    key: "stroke-last-known-well",
    questionType: "priority",
    domain: "neurologic",
    topic: "Stroke recognition",
    subtopic: "Acute neurologic change",
    scenario:
      "A client suddenly develops slurred speech, left facial droop, and left arm weakness while eating breakfast. The client's glucose is 102 mg/dL.",
    stem: "Which nursing action is most appropriate first?",
    correct: "Determine the last-known-well time, keep the client NPO, and activate the stroke response process.",
    distractors: [
      "Give water slowly to evaluate swallowing ability.",
      "Assist the client to walk to determine whether weakness improves.",
      "Reassure the client and reassess speech after breakfast.",
    ],
    rationale: "Sudden focal neurologic deficits with normal glucose suggest possible acute stroke.",
    priority: "Time-sensitive recognition, swallow safety, and escalation are the priorities.",
    safety: "Oral intake before swallow screening increases aspiration risk.",
    ngn: "Recognize neurologic cues, analyze the likely hypothesis, and take action through the stroke pathway.",
    trap: "Do not delay reporting by testing swallowing with food or fluids.",
    hints: [
      "Sudden focal deficits are time-sensitive.",
      "Swallow safety matters before oral intake.",
      "Choose last-known-well, NPO, and stroke activation.",
    ],
    teaching: "Entry-level nurses do not diagnose stroke, but they must recognize sudden deficits and escalate quickly.",
    tags: ["stroke", "last-known-well", "aspiration-risk"],
  },
  {
    key: "chest-pain-unstable",
    questionType: "first-assess",
    domain: "cardiovascular",
    topic: "Chest pain",
    subtopic: "First assessment",
    scenario:
      "A client reports new crushing chest pressure radiating to the left arm with nausea and diaphoresis. The client appears pale and anxious.",
    stem: "What should the nurse do first?",
    correct: "Stay with the client, assess vital signs and pain, and notify the provider or rapid response team according to protocol.",
    distractors: [
      "Ask the client to walk in the hallway to see if the pain improves.",
      "Provide discharge teaching about reducing saturated fat.",
      "Tell the client anxiety commonly causes chest discomfort.",
    ],
    rationale: "New crushing chest pressure with radiation, nausea, diaphoresis, and pallor is concerning for acute cardiac ischemia.",
    priority: "Immediate assessment and escalation are safer than teaching or reassurance.",
    safety: "A potentially unstable cardiac presentation requires prompt recognition.",
    ngn: "Multiple cues point to a high-priority hypothesis requiring action and evaluation.",
    trap: "Do not dismiss chest pain as anxiety before assessing cardiac risk.",
    hints: [
      "Look for acute cardiac warning signs.",
      "Teaching is not first when the client may be unstable.",
      "Choose immediate assessment and escalation.",
    ],
    teaching: "Chest pain questions reward recognition of unstable symptoms and timely escalation.",
    tags: ["chest-pain", "cardiac", "rapid-response"],
  },
  {
    key: "respiratory-distress-pneumonia",
    questionType: "priority",
    domain: "respiratory",
    topic: "Respiratory distress",
    subtopic: "Pneumonia deterioration",
    scenario:
      "A client admitted with pneumonia is now restless, using accessory muscles, RR 32/min, and SpO2 86% on 2 L/min oxygen by nasal cannula.",
    stem: "Which action should the nurse take first?",
    correct: "Raise the head of the bed, assess airway and breathing, ensure oxygen equipment is functioning, and call for help.",
    distractors: [
      "Encourage the client to finish breakfast to improve energy.",
      "Document the findings and reassess in 1 hour.",
      "Teach the client about completing antibiotics after discharge.",
    ],
    rationale: "Restlessness, accessory muscle use, tachypnea, and low oxygen saturation indicate respiratory deterioration.",
    priority: "Support breathing and get help before teaching, meals, or delayed reassessment.",
    safety: "Hypoxemia can worsen quickly and requires immediate nursing action.",
    ngn: "Recognize cues, prioritize impaired oxygenation, take action, and evaluate response.",
    trap: "Do not prioritize education or nutrition during active respiratory distress.",
    hints: [
      "The client's breathing is worsening now.",
      "Accessory muscle use and low saturation are urgent cues.",
      "Choose positioning, assessment, equipment check, and help.",
    ],
    teaching: "Tier 2 respiratory items require noticing both the oxygen number and the work of breathing.",
    tags: ["pneumonia", "hypoxemia", "respiratory-distress"],
  },
  {
    key: "hypoglycemia-confused",
    questionType: "medication-safety",
    domain: "endocrine",
    topic: "Hypoglycemia",
    subtopic: "Unsafe oral intake",
    scenario:
      "A client with diabetes is diaphoretic and confused. Blood glucose is 44 mg/dL. The client coughs when offered a sip of water.",
    stem: "Which action is the priority?",
    correct: "Keep the client NPO, stay with the client, and follow the facility hypoglycemia protocol for a client who may not swallow safely.",
    distractors: [
      "Give orange juice quickly to raise the blood glucose.",
      "Administer the scheduled rapid-acting insulin.",
      "Ask assistive personnel to ambulate the client to improve circulation.",
    ],
    rationale: "The client has severe hypoglycemia and possible unsafe swallowing, so oral carbohydrate is not safe.",
    priority: "Correct glucose using the appropriate protocol while protecting the airway.",
    safety: "Confusion and coughing with water increase aspiration risk, so oral treatment may create a second immediate safety problem.",
    ngn: "Analyze both glucose and swallowing cues before selecting an action; the safest response corrects glucose while protecting the airway.",
    trap: "Oral juice is correct only when the client can swallow safely.",
    hints: [
      "Do not treat one problem while creating another safety risk.",
      "The glucose is low, but swallowing may be unsafe.",
      "Choose protocol-based treatment without oral intake.",
    ],
    teaching: "Hypoglycemia questions become Tier 2 when airway safety and glucose correction must both be considered.",
    tags: ["hypoglycemia", "aspiration-risk", "diabetes"],
  },
  {
    key: "hyperglycemia-dka-cues",
    questionType: "trend-recognition",
    domain: "endocrine",
    topic: "Hyperglycemia",
    subtopic: "Possible DKA cues",
    scenario:
      "A young adult with type 1 diabetes reports nausea, abdominal pain, and excessive thirst. Blood glucose is 392 mg/dL, and respirations are deep and rapid.",
    stem: "Which action is most appropriate?",
    correct: "Assess hydration and respiratory status, check ketone testing if available per policy, and notify the provider promptly.",
    distractors: [
      "Encourage the client to skip all fluids until glucose improves.",
      "Give a snack because nausea usually means hypoglycemia.",
      "Reassure the client that thirst is expected and reassess tomorrow.",
    ],
    rationale: "Hyperglycemia with nausea, abdominal pain, thirst, and deep rapid respirations suggests possible ketoacidosis.",
    priority: "The nurse recognizes danger cues, assesses, and escalates rather than delaying care.",
    safety: "Possible DKA can worsen quickly without prompt treatment, so worsening symptoms require timely assessment and reporting.",
    ngn: "Cluster hyperglycemia, thirst, nausea, abdominal pain, and deep rapid respirations into one hypothesis before choosing the nursing response.",
    trap: "Do not assume all nausea in diabetes means low glucose.",
    hints: [
      "Match the symptoms with the high glucose value.",
      "Deep rapid respirations are a concerning cue.",
      "Choose assessment and prompt notification.",
    ],
    teaching: "Tier 2 endocrine questions require recognizing a pattern, not just a single glucose value.",
    tags: ["hyperglycemia", "DKA", "trend-recognition"],
  },
  {
    key: "heart-failure-fluid-overload",
    questionType: "trend-recognition",
    domain: "cardiovascular",
    topic: "Heart failure",
    subtopic: "Worsening fluid overload",
    scenario:
      "A client with heart failure has gained 4 lb in 2 days, reports sleeping in a recliner, and has new crackles at the lung bases.",
    stem: "Which nursing action is the priority?",
    correct: "Assess respiratory status, verify current medications and intake/output trends, and report possible fluid overload.",
    distractors: [
      "Encourage the client to increase oral fluids to improve kidney function.",
      "Teach low-sodium diet after the client finishes breakfast.",
      "Document the weight gain as expected with heart failure.",
    ],
    rationale: "Rapid weight gain, orthopnea, and new crackles suggest worsening fluid overload.",
    priority: "Respiratory assessment and timely reporting take priority over routine teaching.",
    safety: "Fluid overload can progress to respiratory distress, so breathing symptoms and rapid weight gain require prompt follow-up.",
    ngn: "Trend weight, symptoms, and lung assessment together before choosing the action.",
    trap: "Do not treat rapid weight gain as expected baseline heart failure.",
    hints: [
      "Daily weight changes can reveal fluid retention.",
      "Orthopnea and crackles raise concern for pulmonary congestion.",
      "Choose respiratory assessment and reporting.",
    ],
    teaching: "Heart failure questions often test whether learners connect daily weight with breathing symptoms.",
    tags: ["heart-failure", "fluid-overload", "orthopnea"],
  },
  {
    key: "potassium-loop-diuretic",
    questionType: "medication-safety",
    domain: "pharmacology",
    topic: "Electrolytes",
    subtopic: "Hypokalemia risk",
    scenario:
      "A client taking furosemide reports muscle weakness. The latest potassium is 3.0 mEq/L.",
    stem: "Which action should the nurse take?",
    correct: "Assess the client, place fall precautions as needed, and notify the provider about the low potassium.",
    distractors: [
      "Encourage the client to take an extra dose of furosemide.",
      "Tell the client muscle weakness is unrelated to potassium.",
      "Delay reporting until the next routine lab draw.",
    ],
    rationale: "Furosemide can contribute to potassium loss, and muscle weakness with low potassium needs follow-up.",
    priority: "The nurse should address safety and report the abnormal lab and symptoms before giving advice that ignores the electrolyte risk.",
    safety: "Low potassium can affect muscle function and cardiac rhythm.",
    ngn: "Link medication, symptom, and lab trend into one safety concern, then take action through assessment, precautions, and notification.",
    trap: "Do not ignore symptoms because the medication is commonly prescribed.",
    hints: [
      "Connect the diuretic with the electrolyte value.",
      "Muscle weakness can match low potassium.",
      "Choose safety measures and notification.",
    ],
    teaching: "Moderate pharmacology questions often require connecting medication effects with assessment cues.",
    tags: ["furosemide", "hypokalemia", "medication-safety"],
  },
  {
    key: "delegation-new-confusion",
    questionType: "delegation",
    domain: "delegation",
    topic: "Delegation",
    subtopic: "Unstable versus stable tasks",
    scenario:
      "The nurse is assigning tasks to assistive personnel. One client is newly confused after hip surgery, and another stable client needs help with a bed bath.",
    stem: "Which task is appropriate to delegate?",
    correct: "Assist the stable client with a bed bath and report any concerns.",
    distractors: [
      "Assess the newly confused postoperative client's orientation.",
      "Teach the newly confused client how to use the walker.",
      "Evaluate whether pain medication reduced the confused client's pain.",
    ],
    rationale: "Assisting with hygiene for a stable client is a task; assessing confusion, teaching, and evaluation require nursing judgment.",
    priority: "The nurse keeps assessment and evaluation while delegating stable, predictable care.",
    safety: "New confusion after surgery may indicate deterioration and needs nursing assessment.",
    ngn: "Compare stability and task complexity before delegating; new clinical changes require nursing judgment while routine care may be assigned.",
    trap: "Do not delegate assessment of a new change in condition.",
    hints: [
      "Separate tasks from nursing judgment.",
      "New confusion is not a routine finding to delegate.",
      "Choose the routine care task for the stable client.",
    ],
    teaching: "Delegation questions require matching the task, the role, and patient stability.",
    tags: ["delegation", "assistive-personnel", "confusion"],
  },
  {
    key: "opioid-sedation",
    questionType: "medication-safety",
    domain: "pharmacology",
    topic: "Opioid adverse effects",
    subtopic: "Sedation and respiratory rate",
    scenario:
      "A postoperative client who received opioid pain medication is difficult to arouse. Respiratory rate is 8/min and SpO2 is 90% on room air.",
    stem: "What is the nurse's priority action?",
    correct: "Stimulate the client, assess airway and breathing, apply oxygen if prescribed or per protocol, and call for help.",
    distractors: [
      "Administer the next opioid dose because pain will worsen.",
      "Allow the client to sleep and reassess at the next scheduled round.",
      "Document that sedation is expected after opioid medication.",
    ],
    rationale: "Excessive sedation with bradypnea after opioids suggests respiratory depression.",
    priority: "Airway and breathing assessment with immediate help is the priority because medication-related respiratory depression can worsen quickly.",
    safety: "Respiratory depression can become life-threatening, so difficult arousal with RR 8/min is not routine sleepiness.",
    ngn: "Recognize adverse medication cues, prioritize breathing, take immediate action, and evaluate whether ventilation improves.",
    trap: "Do not normalize difficult arousal and RR 8/min as routine sedation.",
    hints: [
      "The respiratory rate is the key safety cue.",
      "Difficult arousal after opioids is concerning.",
      "Choose airway/breathing assessment and help.",
    ],
    teaching: "Opioid safety requires reassessing sedation and respirations, not only pain score.",
    tags: ["opioids", "respiratory-depression", "postoperative"],
  },
  {
    key: "transfusion-reaction",
    questionType: "priority",
    domain: "safety",
    topic: "Blood transfusion reaction",
    subtopic: "Initial response",
    scenario:
      "Fifteen minutes after a blood transfusion begins, the client reports chills, back pain, and shortness of breath.",
    stem: "Which action should the nurse take first?",
    correct: "Stop the transfusion and maintain IV access with normal saline using new tubing per policy.",
    distractors: [
      "Slow the transfusion and reassess in 30 minutes.",
      "Administer acetaminophen and continue the transfusion.",
      "Tell the client mild chills are expected and document the report.",
    ],
    rationale: "Chills, back pain, and shortness of breath soon after transfusion begins suggest a possible transfusion reaction.",
    priority: "Stopping the transfusion is the first safety action while maintaining IV access.",
    safety: "Continuing the transfusion can worsen a reaction, so stopping exposure to the blood product is the immediate safety step.",
    ngn: "Recognize the timing and symptom cluster, prioritize transfusion reaction, and take immediate action before reassessment.",
    trap: "Do not treat possible transfusion reaction symptoms as mild expected discomfort.",
    hints: [
      "Timing matters: symptoms began soon after transfusion started.",
      "The safest action prevents more blood product exposure.",
      "Stop the transfusion first to prevent further exposure.",
    ],
    teaching: "Transfusion reaction questions test immediate stop-and-assess safety actions.",
    tags: ["transfusion", "reaction", "patient-safety"],
  },
  {
    key: "postop-pulmonary-embolism",
    questionType: "priority",
    domain: "postoperative",
    topic: "Pulmonary embolism cues",
    subtopic: "Sudden dyspnea",
    scenario:
      "A postoperative client suddenly reports sharp chest pain and shortness of breath. HR is 124/min, RR is 30/min, and SpO2 is 88%.",
    stem: "Which action should the nurse take first?",
    correct: "Stay with the client, raise the head of the bed, assess respiratory status, and call rapid response or the provider.",
    distractors: [
      "Assist the client to walk to prevent further clot formation.",
      "Offer oral fluids and reassess after the client rests.",
      "Teach the client about using compression devices after discharge.",
    ],
    rationale: "Sudden dyspnea, chest pain, tachycardia, tachypnea, and hypoxemia after surgery suggest possible pulmonary embolism.",
    priority: "Support oxygenation, assess, and escalate immediately because sudden hypoxemia and chest pain suggest instability.",
    safety: "Possible pulmonary embolism can rapidly impair oxygenation and perfusion.",
    ngn: "Cluster respiratory and cardiovascular cues into a high-risk hypothesis, then choose nursing actions that support breathing and escalation.",
    trap: "Do not ambulate a client with sudden hypoxemia and chest pain.",
    hints: [
      "Sudden symptoms after surgery are concerning.",
      "Low oxygen saturation plus chest pain is unstable.",
      "Choose support, assessment, and rapid escalation.",
    ],
    teaching: "New-grad nurses must recognize PE cues and escalate, not manage definitive treatment independently.",
    tags: ["pulmonary-embolism", "postoperative", "hypoxemia"],
  },
  {
    key: "sodium-confusion",
    questionType: "trend-recognition",
    domain: "medical-surgical",
    topic: "Fluid and electrolyte imbalance",
    subtopic: "Hyponatremia safety",
    scenario:
      "A client taking a thiazide diuretic becomes increasingly confused. Sodium is 126 mEq/L, down from 136 mEq/L two days ago.",
    stem: "Which nursing action is most appropriate?",
    correct: "Institute safety precautions, assess neurologic status, and notify the provider of the sodium trend.",
    distractors: [
      "Encourage the client to drink several large glasses of water.",
      "Reassure the family that confusion is expected with aging.",
      "Delay reporting because the sodium is only slightly changed.",
    ],
    rationale: "A drop in sodium with confusion suggests clinically significant hyponatremia.",
    priority: "The nurse should protect the client from injury, assess neurologic status, and report the trend.",
    safety: "Hyponatremia can cause neurologic changes and fall risk, so confusion with a falling sodium trend is a safety concern.",
    ngn: "Trend interpretation matters: the direction and symptom together create urgency.",
    trap: "Do not dismiss acute confusion as normal aging.",
    hints: [
      "Compare the sodium to the previous value.",
      "Confusion is a neurologic cue that changes priority.",
      "Choose safety, neuro assessment, and notification.",
    ],
    teaching: "Tier 2 electrolyte items often test symptom-plus-trend interpretation rather than memorizing one number.",
    tags: ["hyponatremia", "confusion", "trend-recognition"],
  },
  {
    key: "asthma-worsening",
    questionType: "first-assess",
    domain: "respiratory",
    topic: "Asthma",
    subtopic: "Worsening respiratory status",
    scenario:
      "A client with asthma used a rescue inhaler 20 minutes ago but still has wheezing, speaks in short phrases, and has increasing anxiety.",
    stem: "Which nursing action is the priority?",
    correct: "Assess respiratory status, position upright, check oxygen saturation, and notify the provider or rapid response per protocol.",
    distractors: [
      "Teach long-term trigger avoidance before reassessing breathing.",
      "Ask the client to lie flat to conserve energy.",
      "Document that the rescue inhaler was used and recheck at the next round.",
    ],
    rationale: "Persistent symptoms after rescue medication with short phrases and anxiety suggest worsening respiratory status.",
    priority: "Immediate reassessment and escalation are needed before long-term teaching.",
    safety: "Respiratory deterioration can progress if response to rescue therapy is poor.",
    ngn: "Evaluate the outcome of an action and respond when the outcome is not adequate; persistent symptoms after rescue therapy change priority.",
    trap: "Do not substitute education for reassessment during active breathing difficulty.",
    hints: [
      "The rescue inhaler did not resolve symptoms.",
      "Speaking in short phrases is a concerning respiratory cue.",
      "Choose reassessment, positioning, oxygen check, and escalation.",
    ],
    teaching: "NGN reasoning includes evaluating whether an intervention worked and changing priority if it did not.",
    tags: ["asthma", "respiratory", "reassessment"],
  },
  {
    key: "priority-four-clients",
    questionType: "priority",
    domain: "safety",
    topic: "Prioritization",
    subtopic: "Most unstable client",
    scenario:
      "The nurse receives report on four clients at the start of shift.",
    stem: "Which client should the nurse assess first?",
    correct: "A client with new facial droop and arm weakness that began 20 minutes ago.",
    distractors: [
      "A client with chronic arthritis requesting help repositioning in bed.",
      "A client scheduled for discharge who needs medication teaching.",
      "A client with a healed incision asking when sutures will be removed.",
    ],
    rationale: "New focal neurologic deficits are time-sensitive and require immediate assessment.",
    priority: "Acute neurologic change is more urgent than stable teaching, comfort, or routine follow-up.",
    safety: "Rapid recognition preserves safety and time-sensitive treatment options.",
    ngn: "Recognize the cue that changes urgency among multiple patients and choose the client with the most time-sensitive safety risk.",
    trap: "Do not prioritize routine tasks over a new unstable finding.",
    hints: [
      "Look for the newest acute change with the highest risk.",
      "Teaching and comfort matter but are not first when a client may be unstable.",
      "Choose the client with possible stroke cues.",
    ],
    teaching: "Classic NCLEX prioritization asks which patient has the most immediate risk, not which task is easiest.",
    tags: ["prioritization", "stroke", "unstable"],
  },
];

function buildQuestion(s: Scenario, index: number): NclexTier2Question {
  const ids = ["A", "B", "C", "D"] as const;
  const texts = [s.correct, ...s.distractors] as const;
  const options = ids.map((id, i) =>
    option(
      id,
      texts[i]!,
      i === 0,
      i === 0
        ? s.rationale
        : `This is not the priority because it misses ${s.trap.toLowerCase()}`,
    ),
  ) as [NclexTier2Option, NclexTier2Option, NclexTier2Option, NclexTier2Option];

  return {
    id: `nclex-tier2-${String(index + 1).padStart(2, "0")}-${s.key}`,
    tier: 2,
    questionType: s.questionType,
    exam: ["NCLEX-RN"],
    domain: s.domain,
    topic: s.topic,
    subtopic: s.subtopic,
    scenario: s.scenario,
    stem: s.stem,
    options,
    correctAnswer: "A",
    rationale: {
      correct: s.rationale,
      prioritizationLogic: s.priority,
      safetyThinking: s.safety,
      ngnReasoning: s.ngn,
      wrongAnswers: {
        A: `Correct: ${s.rationale}`,
        B: `Incorrect: this option is less safe because ${s.trap.toLowerCase()}`,
        C: `Incorrect: this option delays priority nursing action because ${s.trap.toLowerCase()}`,
        D: `Incorrect: this option misses the time-sensitive finding because ${s.trap.toLowerCase()}`,
      },
    },
    hints: s.hints,
    teachingPoint: s.teaching,
    noviceScopeGuardrail:
      "The novice RN role is to recognize danger, assess, start safe nursing actions, communicate clearly, and escalate through policy rather than independently planning specialty treatment.",
    adaptiveMetadata: {
      difficulty: "tier-2-moderate-clinical-judgment",
      cognitiveLoad: s.questionType === "trend-recognition" || s.questionType === "ngn-case" ? 3 : 2,
      safetyCritical: true,
      prioritizationLevel: 3,
      misconceptionTags: s.tags,
      avoidedAdvancedContent: [
        "ventilator parameter optimization",
        "invasive hemodynamic interpretation",
        "provider-level treatment planning",
        "specialty procedural knowledge",
      ],
    },
  };
}

export const nclexTier2ClinicalJudgmentQuestions: readonly NclexTier2Question[] = SCENARIOS.map(buildQuestion);

export const NCLEX_TIER2_CLINICAL_JUDGMENT_METRICS = {
  totalQuestions: nclexTier2ClinicalJudgmentQuestions.length,
  byType: nclexTier2ClinicalJudgmentQuestions.reduce<Record<NclexTier2QuestionType, number>>(
    (acc, question) => {
      acc[question.questionType] = (acc[question.questionType] ?? 0) + 1;
      return acc;
    },
    {
      priority: 0,
      "first-assess": 0,
      delegation: 0,
      "trend-recognition": 0,
      "medication-safety": 0,
      "ngn-case": 0,
    },
  ),
  byDomain: nclexTier2ClinicalJudgmentQuestions.reduce<Record<NclexTier2Domain, number>>(
    (acc, question) => {
      acc[question.domain] = (acc[question.domain] ?? 0) + 1;
      return acc;
    },
    {
      "medical-surgical": 0,
      pharmacology: 0,
      respiratory: 0,
      cardiovascular: 0,
      neurologic: 0,
      endocrine: 0,
      postoperative: 0,
      delegation: 0,
      safety: 0,
    },
  ),
} as const;
