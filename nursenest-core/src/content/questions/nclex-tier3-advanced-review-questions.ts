/**
 * Tier 3 NCLEX-style advanced review question catalog.
 *
 * These NurseNest-authored items are high-acuity nursing judgment questions for
 * advanced review and specialty exposure. They challenge escalation, monitoring,
 * and patient-safety reasoning while staying inside nursing scope.
 */

export type NclexTier3QuestionType =
  | "advanced-priority"
  | "rapid-deterioration"
  | "icu-safety"
  | "telemetry-basic"
  | "titrated-medication-safety"
  | "shock-recognition"
  | "ventilated-patient-assessment"
  | "complex-delegation"
  | "ngn-case";

export type NclexTier3Domain =
  | "advanced-respiratory"
  | "critical-care"
  | "advanced-cardiac"
  | "shock"
  | "sepsis"
  | "neurologic"
  | "pharmacology"
  | "emergency"
  | "postoperative"
  | "multisystem"
  | "delegation";

export type NclexTier3Option = {
  id: "A" | "B" | "C" | "D";
  text: string;
  correct: boolean;
  rationale: string;
};

export type NclexTier3Question = {
  id: string;
  tier: 3;
  questionType: NclexTier3QuestionType;
  exam: readonly ["NCLEX-RN"];
  domain: NclexTier3Domain;
  topic: string;
  subtopic: string;
  scenario: string;
  stem: string;
  options: readonly [NclexTier3Option, NclexTier3Option, NclexTier3Option, NclexTier3Option];
  correctAnswer: "A" | "B" | "C" | "D";
  rationale: {
    correct: string;
    advancedNursingReasoning: string;
    escalationLogic: string;
    safetyPrinciple: string;
    wrongAnswers: Record<"A" | "B" | "C" | "D", string>;
  };
  hints: readonly [string, string, string];
  teachingPoint: string;
  advancedScopeGuardrail: string;
  adaptiveMetadata: {
    difficulty: "tier-3-advanced-review";
    cognitiveLoad: 4 | 5;
    safetyCritical: true;
    prioritizationLevel: 4 | 5;
    specialtyExposure: boolean;
    misconceptionTags: readonly string[];
    avoidedOutOfScopeContent: readonly string[];
  };
};

function option(
  id: "A" | "B" | "C" | "D",
  text: string,
  correct: boolean,
  rationale: string,
): NclexTier3Option {
  return { id, text, correct, rationale };
}

type Scenario = {
  key: string;
  questionType: NclexTier3QuestionType;
  domain: NclexTier3Domain;
  topic: string;
  subtopic: string;
  scenario: string;
  stem: string;
  correctAnswer: "A" | "B" | "C" | "D";
  options: Record<"A" | "B" | "C" | "D", string>;
  optionRationales: Record<"A" | "B" | "C" | "D", string>;
  rationale: {
    correct: string;
    advanced: string;
    escalation: string;
    safety: string;
  };
  hints: readonly [string, string, string];
  teachingPoint: string;
  cognitiveLoad: 4 | 5;
  prioritizationLevel: 4 | 5;
  tags: readonly string[];
};

const SCENARIOS: readonly Scenario[] = [
  {
    key: "ventilated-high-pressure-alarm",
    questionType: "ventilated-patient-assessment",
    domain: "advanced-respiratory",
    topic: "Ventilated patient deterioration",
    subtopic: "High-pressure alarm and hypoxemia",
    scenario:
      "A mechanically ventilated client becomes restless. The high-pressure alarm sounds, SpO2 falls from 94% to 86%, and the nurse sees the client coughing with visible secretions in the endotracheal tubing.",
    stem: "Which nursing action is the priority?",
    correctAnswer: "B",
    options: {
      A: "Silence the alarm and document that the client was coughing.",
      B: "Assess the client and airway, call for respiratory support, and prepare to suction according to policy.",
      C: "Increase the sedation infusion so the client stops coughing against the ventilator.",
      D: "Reposition the pulse oximeter and wait 10 minutes to see if the saturation improves.",
    },
    optionRationales: {
      A: "Silencing the alarm without assessment ignores a real oxygenation and airway-clearance problem.",
      B: "Coughing, visible secretions, hypoxemia, and a high-pressure alarm suggest impaired ventilation from airway resistance or obstruction; the nurse should assess and mobilize help promptly.",
      C: "Sedation may hide distress and does not address secretions or falling oxygen saturation.",
      D: "A sensor issue is possible, but the clinical cues point to airway compromise that cannot wait.",
    },
    rationale: {
      correct:
        "The priority is direct assessment and airway support. Visible secretions with a high-pressure alarm and falling SpO2 require immediate nursing recognition, respiratory collaboration, and suction readiness within policy.",
      advanced:
        "The nurse is not optimizing ventilator settings; the advanced nursing skill is recognizing that the alarm plus patient cues represents an airway and oxygenation threat.",
      escalation:
        "Escalate early to respiratory therapy, rapid response, or the provider if oxygenation does not improve with immediate safe interventions.",
      safety:
        "Treat ventilator alarms as patient alarms first; assess the client before assuming equipment malfunction.",
    },
    hints: [
      "Connect the alarm to the client's visible distress and oxygen trend.",
      "A high-pressure alarm with secretions suggests resistance to airflow or airway obstruction.",
      "Choose the action that assesses the patient, protects oxygenation, and brings help.",
    ],
    teachingPoint:
      "Advanced respiratory items should test whether the nurse recognizes deterioration and initiates safe airway support, not whether the nurse independently changes ventilator parameters.",
    cognitiveLoad: 5,
    prioritizationLevel: 5,
    tags: ["ventilated-patient", "airway", "high-pressure-alarm"],
  },
  {
    key: "septic-shock-progression",
    questionType: "shock-recognition",
    domain: "sepsis",
    topic: "Sepsis progression",
    subtopic: "Poor perfusion despite early treatment",
    scenario:
      "A client admitted with pyelonephritis has received prescribed IV fluids and antibiotics. Two hours later the client is more confused, MAP is 58 mm Hg, lactate increased from 2.4 to 4.1 mmol/L, and urine output is 10 mL/hr.",
    stem: "Which interpretation should guide the nurse's next action?",
    correctAnswer: "C",
    options: {
      A: "The antibiotics need more time, so the nurse should continue routine monitoring.",
      B: "The urine output is low because the client has not had enough oral fluids.",
      C: "The client is showing signs of worsening shock and needs urgent reassessment and escalation.",
      D: "The confusion is expected because hospitalization commonly causes sleep disruption.",
    },
    optionRationales: {
      A: "Routine monitoring is unsafe because perfusion markers are worsening.",
      B: "Low urine output with hypotension and rising lactate suggests poor perfusion, not simple oral intake deficit.",
      C: "Worsening mental status, low MAP, rising lactate, and oliguria indicate ongoing shock physiology requiring urgent nursing escalation.",
      D: "Hospital confusion is possible, but the perfusion trend makes deterioration the priority hypothesis.",
    },
    rationale: {
      correct:
        "The pattern suggests sepsis progressing toward shock despite initial therapy. The nurse should reassess perfusion, verify current orders, notify the provider or rapid response team, and anticipate time-sensitive interventions.",
      advanced:
        "Tier 3 reasoning requires linking lactate, urine output, MAP, and mentation as one perfusion problem rather than treating each finding separately.",
      escalation:
        "Escalation is required because worsening perfusion after fluids and antibiotics can become life-threatening quickly.",
      safety:
        "Failure to rescue in sepsis often occurs when subtle perfusion trends are documented instead of acted on.",
    },
    hints: [
      "Do not evaluate the lactate, MAP, urine output, and mentation separately.",
      "Ask whether perfusion is improving or worsening after initial therapy.",
      "The safest response treats the pattern as shock until proven otherwise.",
    ],
    teachingPoint:
      "Advanced sepsis questions reward trend synthesis: low MAP, rising lactate, oliguria, and confusion together demand escalation.",
    cognitiveLoad: 5,
    prioritizationLevel: 5,
    tags: ["sepsis", "shock", "lactate", "oliguria"],
  },
  {
    key: "norepinephrine-extravasation",
    questionType: "titrated-medication-safety",
    domain: "pharmacology",
    topic: "Vasoactive medication safety",
    subtopic: "Peripheral infusion complication",
    scenario:
      "A client receiving a titrated norepinephrine infusion through a peripheral IV reports burning at the site. The IV area is pale, cool, and swollen, and the blood pressure remains low.",
    stem: "Which action should the nurse take first?",
    correctAnswer: "A",
    options: {
      A: "Stop the infusion, leave the catheter in place, and activate the facility extravasation protocol.",
      B: "Remove the catheter immediately and restart the infusion in the same arm.",
      C: "Flush the IV quickly with normal saline to clear the medication from the vein.",
      D: "Lower the infusion rate and reassess the site in 30 minutes.",
    },
    optionRationales: {
      A: "Stopping the infusion prevents further tissue injury, and leaving the catheter allows ordered antidote management if indicated by protocol.",
      B: "Immediate removal can prevent protocol-based treatment through the existing catheter and restarting nearby may worsen injury risk.",
      C: "Flushing can push more medication into compromised tissue or circulation without addressing extravasation.",
      D: "Reducing the rate delays response to a high-risk medication complication.",
    },
    rationale: {
      correct:
        "Vasoactive medication extravasation threatens tissue perfusion. The nurse should stop the infusion, keep access for protocol-directed management, notify the appropriate team, and establish safe alternate access.",
      advanced:
        "The advanced nursing issue is not choosing a vasopressor dose; it is recognizing a time-sensitive infusion complication and preventing tissue injury.",
      escalation:
        "Notify the provider, pharmacy, or vascular access team according to policy while ensuring hemodynamic support continues through safe access.",
      safety:
        "Titrated high-alert medications require frequent site assessment and immediate action when infiltration or extravasation is suspected.",
    },
    hints: [
      "The medication is high-alert and the IV site findings are not benign.",
      "Think about preventing tissue damage while preserving protocol treatment options.",
      "The safest first step stops the infusion without removing the catheter immediately.",
    ],
    teachingPoint:
      "Advanced medication safety includes detecting infusion complications early and following high-alert protocols precisely.",
    cognitiveLoad: 4,
    prioritizationLevel: 4,
    tags: ["vasopressor", "extravasation", "high-alert-medication"],
  },
  {
    key: "wide-complex-tachycardia-unstable",
    questionType: "telemetry-basic",
    domain: "advanced-cardiac",
    topic: "Telemetry deterioration",
    subtopic: "Symptomatic wide-complex rhythm",
    scenario:
      "A client on telemetry suddenly reports dizziness and chest pressure. The monitor shows a new regular wide-complex tachycardia at 168/min, BP is 82/50, and the client is diaphoretic.",
    stem: "What is the nurse's priority action?",
    correctAnswer: "D",
    options: {
      A: "Print a rhythm strip and place it in the chart before intervening.",
      B: "Ask the client to bear down repeatedly while the nurse observes the monitor.",
      C: "Give the scheduled oral beta blocker and recheck the blood pressure in 1 hour.",
      D: "Assess responsiveness and circulation, call rapid response, and prepare emergency equipment.",
    },
    optionRationales: {
      A: "Documentation is secondary when the client has unstable symptoms and hypotension.",
      B: "Vagal maneuvers are not the priority for an unstable wide-complex rhythm.",
      C: "An oral scheduled medication is too slow and unsafe in hypotensive deterioration.",
      D: "The combination of a new wide-complex tachycardia and poor perfusion requires immediate assessment, emergency support, and escalation.",
    },
    rationale: {
      correct:
        "The client is unstable: hypotension, chest pressure, diaphoresis, and dizziness with a new wide-complex tachycardia. The nurse should assess ABCs and perfusion, call rapid response, and prepare emergency equipment.",
      advanced:
        "The nurse does not need to name every rhythm subtype before acting. The safe nursing priority is recognizing unstable perfusion with a dangerous rhythm.",
      escalation:
        "Emergency escalation is necessary because the rhythm is associated with hemodynamic compromise.",
      safety:
        "Treat the patient, not only the monitor. Symptoms and blood pressure determine urgency.",
    },
    hints: [
      "Look beyond the rhythm label to the client's perfusion.",
      "Hypotension and chest pressure make this unstable.",
      "Choose immediate assessment, emergency help, and readiness for ordered interventions.",
    ],
    teachingPoint:
      "Telemetry questions at this level test recognition of instability and emergency escalation, not advanced electrophysiology memorization.",
    cognitiveLoad: 5,
    prioritizationLevel: 5,
    tags: ["telemetry", "wide-complex-tachycardia", "unstable"],
  },
  {
    key: "postop-hemorrhage-abdominal",
    questionType: "rapid-deterioration",
    domain: "postoperative",
    topic: "Postoperative hemorrhage",
    subtopic: "Abdominal surgery deterioration",
    scenario:
      "A client 10 hours after bowel surgery becomes anxious and pale. The abdomen is firm and distended, HR rises from 92 to 128/min, BP falls to 88/54, and the drain output has changed from serosanguineous to bright red.",
    stem: "Which response by the nurse is most appropriate?",
    correctAnswer: "B",
    options: {
      A: "Encourage the client to use the incentive spirometer and splint the incision.",
      B: "Stay with the client, assess perfusion, reinforce the dressing if needed, and call rapid response or the surgeon.",
      C: "Ambulate the client to reduce gas pain and improve bowel motility.",
      D: "Administer the prescribed stool softener and reassess the abdomen in 1 hour.",
    },
    optionRationales: {
      A: "Pulmonary hygiene is important but does not address signs of hemorrhage and shock.",
      B: "The vital-sign trend, bright red output, pallor, anxiety, and firm abdomen suggest acute bleeding requiring immediate escalation.",
      C: "Ambulation is unsafe for a hypotensive client with suspected bleeding.",
      D: "A stool softener does not address acute postoperative instability.",
    },
    rationale: {
      correct:
        "The client is showing possible internal or surgical-site bleeding with shock. The nurse should remain with the client, assess perfusion, protect the surgical site according to policy, and escalate immediately.",
      advanced:
        "The advanced reasoning is recognizing that anxiety and abdominal distention can be early deterioration cues when paired with tachycardia, hypotension, and bright red drainage.",
      escalation:
        "Rapid response or surgical notification is time-sensitive because hemorrhage can progress quickly.",
      safety:
        "Do not mobilize or delay care for a client with hypotension and suspected active bleeding.",
    },
    hints: [
      "Compare the vital signs and drain output to the earlier baseline.",
      "A firm distended abdomen with hypotension is not routine gas pain.",
      "Choose the action that treats possible bleeding as an emergency.",
    ],
    teachingPoint:
      "Tier 3 postoperative questions often embed hemorrhage in multiple subtle cues rather than naming it directly.",
    cognitiveLoad: 4,
    prioritizationLevel: 5,
    tags: ["postoperative", "hemorrhage", "shock"],
  },
  {
    key: "increased-icp-cushing-cues",
    questionType: "advanced-priority",
    domain: "neurologic",
    topic: "Increased intracranial pressure",
    subtopic: "Neurologic deterioration",
    scenario:
      "A client with a traumatic brain injury becomes difficult to arouse. The nurse notes a new unequal pupil response, BP 178/62, HR 48/min, and irregular respirations.",
    stem: "Which action should the nurse take first?",
    correctAnswer: "C",
    options: {
      A: "Dim the lights and allow the client to sleep without interruption.",
      B: "Place the client flat and encourage coughing to clear secretions.",
      C: "Maintain airway safety, elevate the head of bed if not contraindicated, and call rapid response.",
      D: "Administer oral pain medication and recheck the pupils in 30 minutes.",
    },
    optionRationales: {
      A: "Decreased arousal with abnormal vital signs and pupil change requires urgent action, not rest.",
      B: "Flat positioning and coughing can worsen intracranial pressure risk and do not address deterioration.",
      C: "The cues suggest increased intracranial pressure with possible brainstem involvement; airway protection, positioning, and escalation are priorities.",
      D: "Oral medication is unsafe in decreased arousal and delays emergency response.",
    },
    rationale: {
      correct:
        "New decreased level of consciousness, unequal pupils, widened pulse pressure, bradycardia, and irregular respirations are high-risk neurologic deterioration cues. The nurse should protect airway, position safely, and escalate immediately.",
      advanced:
        "The nurse is not determining definitive neurosurgical treatment. The nursing judgment is recognizing a dangerous neurologic pattern and preventing secondary injury.",
      escalation:
        "Rapid response and provider notification are urgent because delayed action can lead to irreversible neurologic harm.",
      safety:
        "Airway, oxygenation, and cerebral perfusion take priority during neurologic deterioration.",
    },
    hints: [
      "The vital-sign pattern and pupil change should be interpreted together.",
      "Decreased arousal changes airway and safety priorities.",
      "Choose airway protection, safer positioning, and urgent escalation.",
    ],
    teachingPoint:
      "Advanced neuro questions require recognizing deterioration patterns while still choosing nursing actions: airway, positioning, assessment, and escalation.",
    cognitiveLoad: 5,
    prioritizationLevel: 5,
    tags: ["increased-icp", "neurologic-deterioration", "rapid-response"],
  },
  {
    key: "dka-insulin-potassium",
    questionType: "titrated-medication-safety",
    domain: "pharmacology",
    topic: "DKA infusion safety",
    subtopic: "Potassium risk during insulin therapy",
    scenario:
      "A client with diabetic ketoacidosis is receiving a prescribed insulin infusion. The newest labs show potassium 3.0 mEq/L, glucose 286 mg/dL, and the client reports new muscle weakness.",
    stem: "Which nursing action is most appropriate?",
    correctAnswer: "A",
    options: {
      A: "Pause and verify the insulin infusion protocol with the provider because potassium is low.",
      B: "Increase the insulin infusion because the glucose remains above normal.",
      C: "Give orange juice because the client is becoming hypoglycemic.",
      D: "Document the weakness as expected fatigue from diabetic ketoacidosis.",
    },
    optionRationales: {
      A: "Insulin shifts potassium into cells and can worsen hypokalemia, increasing dysrhythmia and muscle weakness risk.",
      B: "Increasing insulin when potassium is low can create a dangerous electrolyte shift.",
      C: "The glucose is elevated, and orange juice does not address hypokalemia risk during insulin therapy.",
      D: "New weakness with low potassium is a safety cue that requires action.",
    },
    rationale: {
      correct:
        "Insulin therapy in DKA can lower serum potassium further. With potassium 3.0 mEq/L and weakness, the nurse should verify the protocol and notify the provider before continuing therapy that may worsen hypokalemia.",
      advanced:
        "The advanced nursing reasoning is anticipating a medication-electrolyte interaction and preventing a predictable complication.",
      escalation:
        "Escalate to the provider or protocol pathway because the infusion plan may need immediate adjustment and potassium replacement orders.",
      safety:
        "High-alert infusions require lab trend review before assuming that more medication is safer.",
    },
    hints: [
      "Insulin affects more than glucose during DKA treatment.",
      "Low potassium plus weakness is a medication-safety warning.",
      "Choose the action that prevents worsening hypokalemia.",
    ],
    teachingPoint:
      "Advanced endocrine questions often test whether the nurse anticipates electrolyte shifts during protocolized treatment.",
    cognitiveLoad: 4,
    prioritizationLevel: 4,
    tags: ["dka", "insulin", "hypokalemia"],
  },
  {
    key: "ards-worsening-on-high-flow",
    questionType: "rapid-deterioration",
    domain: "advanced-respiratory",
    topic: "Acute respiratory compromise",
    subtopic: "Worsening oxygenation trend",
    scenario:
      "A client with severe pneumonia is on high-flow oxygen. Over 30 minutes, SpO2 decreases from 92% to 84%, RR increases to 36/min, the client becomes less responsive, and breath sounds are diminished bilaterally.",
    stem: "Which nursing action is the priority?",
    correctAnswer: "D",
    options: {
      A: "Encourage the client to use pursed-lip breathing and reassess in 1 hour.",
      B: "Lower the oxygen flow because high oxygen levels can reduce respiratory drive.",
      C: "Document the oxygen trend and ask the family to reduce stimulation.",
      D: "Call rapid response while supporting airway and breathing and preparing for advanced support.",
    },
    optionRationales: {
      A: "Coaching alone is insufficient for a client with declining responsiveness and worsening hypoxemia.",
      B: "Lowering oxygen during severe hypoxemia is unsafe and based on a misconception.",
      C: "Documentation does not address active respiratory failure cues.",
      D: "Falling saturation, tachypnea, diminished sounds, and decreased responsiveness indicate impending respiratory failure requiring immediate escalation.",
    },
    rationale: {
      correct:
        "The client is deteriorating despite high-flow oxygen. The nurse should call rapid response, support airway and breathing, verify equipment function, and prepare for advanced respiratory support by the appropriate team.",
      advanced:
        "The nurse's role is rapid recognition and escalation of respiratory failure, not independent specialty management.",
      escalation:
        "Delayed escalation risks arrest because decreased responsiveness suggests worsening oxygen delivery to the brain.",
      safety:
        "A falling oxygen saturation trend with increasing work of breathing is more important than a single oxygen number.",
    },
    hints: [
      "The client is worsening despite already receiving significant oxygen support.",
      "Decreased responsiveness makes this an airway and breathing emergency.",
      "Choose immediate support and escalation.",
    ],
    teachingPoint:
      "Advanced respiratory compromise questions require acting on trajectory and mental status, not waiting for complete decompensation.",
    cognitiveLoad: 5,
    prioritizationLevel: 5,
    tags: ["respiratory-failure", "high-flow-oxygen", "deterioration"],
  },
  {
    key: "transfusion-reaction-shock",
    questionType: "shock-recognition",
    domain: "emergency",
    topic: "Transfusion reaction",
    subtopic: "Acute reaction with instability",
    scenario:
      "Fifteen minutes after a packed red blood cell transfusion begins, the client reports chills, back pain, dyspnea, and a feeling of doom. BP drops from 124/76 to 86/48.",
    stem: "Which action should the nurse take first?",
    correctAnswer: "B",
    options: {
      A: "Slow the transfusion and continue monitoring because chills are common.",
      B: "Stop the transfusion, keep IV access with normal saline using new tubing, and notify the provider and blood bank.",
      C: "Administer the next prescribed oral antihypertensive because the blood pressure changed.",
      D: "Ask the client to drink fluids and apply warm blankets before reassessing.",
    },
    optionRationales: {
      A: "Slowing the transfusion is unsafe when symptoms suggest an acute reaction with hypotension.",
      B: "Stopping the transfusion prevents further exposure while maintaining IV access for emergency treatment.",
      C: "An antihypertensive is inappropriate and dangerous when the client is hypotensive.",
      D: "Comfort measures do not address a potentially life-threatening transfusion reaction.",
    },
    rationale: {
      correct:
        "The symptoms suggest an acute transfusion reaction with hemodynamic instability. The nurse should stop blood administration immediately, maintain IV access with normal saline and new tubing, and notify the provider and blood bank.",
      advanced:
        "The advanced reasoning is recognizing a rare but high-risk pattern early and performing the correct sequence of nursing safety actions.",
      escalation:
        "The provider and blood bank need immediate notification because the reaction requires evaluation and treatment.",
      safety:
        "Never continue a transfusion when acute reaction cues and hypotension occur because ongoing exposure can intensify harm.",
    },
    hints: [
      "Timing matters: symptoms began shortly after blood administration started.",
      "Back pain, dyspnea, chills, and hypotension are not routine discomforts.",
      "Choose the action that stops exposure and preserves emergency IV access.",
    ],
    teachingPoint:
      "Transfusion questions test immediate nursing safety actions, especially stopping the transfusion and maintaining access.",
    cognitiveLoad: 4,
    prioritizationLevel: 5,
    tags: ["transfusion-reaction", "hypotension", "blood-safety"],
  },
  {
    key: "complex-icu-delegation",
    questionType: "complex-delegation",
    domain: "delegation",
    topic: "High-acuity assignment safety",
    subtopic: "Delegating around unstable clients",
    scenario:
      "The RN is caring for four clients in a step-down unit and is working with an experienced unregulated assistive personnel (UAP). One client is receiving a titrated vasopressor, one is 1 day postoperative and stable, one needs assistance with feeding after a passed swallow screen, and one has new chest pain.",
    stem: "Which task is appropriate for the RN to delegate to the UAP?",
    correctAnswer: "C",
    options: {
      A: "Assess the client with new chest pain and report whether it is cardiac.",
      B: "Increase the vasopressor infusion if the blood pressure drops.",
      C: "Assist the stable postoperative client with feeding and report any choking or fatigue.",
      D: "Evaluate whether the postoperative client's pain medication should be changed.",
    },
    optionRationales: {
      A: "Assessment and interpretation of new chest pain require the RN.",
      B: "Titrated vasoactive medication management is not delegated to UAP.",
      C: "Assisting with feeding after swallow screening is appropriate if the UAP reports concerning changes.",
      D: "Medication evaluation and care-plan changes require licensed nursing judgment.",
    },
    rationale: {
      correct:
        "Delegation should match task predictability, client stability, and role scope. Feeding assistance for a stable client after a passed swallow screen is appropriate when the UAP is instructed what to report.",
      advanced:
        "The high-acuity distractors test whether the nurse protects assessment, interpretation, and titrated medication decisions from unsafe delegation.",
      escalation:
        "The RN should personally assess new chest pain and unstable vasoactive medication needs while using delegation for predictable care.",
      safety:
        "Safe delegation includes clear reporting parameters and preserving RN accountability for unstable clients.",
    },
    hints: [
      "Separate predictable assistance from assessment and medication judgment.",
      "Unstable symptoms and titrated infusions require licensed nursing oversight.",
      "Choose the task with a stable client, clear instructions, and reportable cues.",
    ],
    teachingPoint:
      "Advanced delegation questions combine acuity, role scope, and competing priorities rather than asking a single memorized rule.",
    cognitiveLoad: 4,
    prioritizationLevel: 4,
    tags: ["delegation", "uap", "step-down", "titrated-infusion"],
  },
  {
    key: "pca-opioid-oversedation",
    questionType: "titrated-medication-safety",
    domain: "pharmacology",
    topic: "Opioid safety",
    subtopic: "Patient-controlled analgesia complication",
    scenario:
      "A postoperative client using patient-controlled analgesia is difficult to arouse. Respirations are 7/min, SpO2 is 88% on 2 L/min oxygen, and the family says they pressed the button because the client looked uncomfortable.",
    stem: "Which action should the nurse take first?",
    correctAnswer: "A",
    options: {
      A: "Stop the opioid delivery, stimulate the client, support breathing, and call for help.",
      B: "Teach the family that they may press the button only when pain is severe.",
      C: "Increase oxygen and wait for the next scheduled sedation assessment.",
      D: "Document that the client is resting comfortably after adequate pain control.",
    },
    optionRationales: {
      A: "Bradypnea, hypoxemia, and decreased arousal indicate opioid oversedation requiring immediate respiratory support and escalation.",
      B: "Teaching is needed later, but it does not address immediate respiratory depression.",
      C: "Oxygen alone does not correct hypoventilation or unsafe opioid exposure.",
      D: "The findings are not comfort; they indicate a medication safety emergency.",
    },
    rationale: {
      correct:
        "The priority is stopping further opioid exposure and supporting ventilation. The nurse should stimulate the client, call for help, monitor airway and breathing, and prepare protocol-directed reversal if prescribed.",
      advanced:
        "The advanced nursing judgment is recognizing that sedation level and respiratory rate are more important than the pain-device label.",
      escalation:
        "Escalate immediately because opioid-induced respiratory depression can progress to arrest.",
      safety:
        "Only the patient should activate patient-controlled analgesia; family activation is a serious safety risk.",
    },
    hints: [
      "The respiratory rate and arousal level are the priority cues.",
      "Oxygen saturation may improve temporarily while ventilation remains inadequate.",
      "Choose the action that stops medication exposure and supports breathing.",
    ],
    teachingPoint:
      "High-acuity pharmacology questions often test whether the nurse recognizes medication harm before focusing on education.",
    cognitiveLoad: 4,
    prioritizationLevel: 5,
    tags: ["opioid-safety", "pca", "respiratory-depression"],
  },
  {
    key: "hyperkalemia-telemetry-cues",
    questionType: "telemetry-basic",
    domain: "advanced-cardiac",
    topic: "Hyperkalemia safety",
    subtopic: "ECG cue recognition",
    scenario:
      "A client with acute kidney injury reports weakness and nausea. Potassium is 6.4 mEq/L, and the telemetry strip shows tall peaked T waves.",
    stem: "Which nursing action is the priority?",
    correctAnswer: "D",
    options: {
      A: "Give a potassium-rich snack to prevent further muscle weakness.",
      B: "Remove the telemetry monitor because the rhythm has been identified.",
      C: "Teach the client that nausea is expected with kidney injury.",
      D: "Place the client on continuous monitoring, assess cardiac status, and notify the provider urgently.",
    },
    optionRationales: {
      A: "Additional potassium can worsen a life-threatening electrolyte abnormality.",
      B: "Telemetry should continue because hyperkalemia can cause dangerous dysrhythmias.",
      C: "Teaching does not address the immediate cardiac risk.",
      D: "Hyperkalemia with ECG changes is an emergency requiring monitoring, assessment, and urgent escalation.",
    },
    rationale: {
      correct:
        "Potassium 6.4 mEq/L with peaked T waves indicates significant dysrhythmia risk. The nurse should monitor continuously, assess for cardiac compromise, notify the provider urgently, and prepare ordered therapy.",
      advanced:
        "The advanced reasoning is linking a lab trend to a monitor finding and recognizing immediate safety risk.",
      escalation:
        "Urgent escalation is needed because ECG changes show physiologic impact, not just an abnormal lab value.",
      safety:
        "Electrolyte abnormalities become priority when they threaten cardiac conduction.",
    },
    hints: [
      "A high potassium level becomes more urgent when ECG changes appear.",
      "Weakness and nausea are less important than cardiac conduction risk.",
      "Choose monitoring, assessment, and urgent notification.",
    ],
    teachingPoint:
      "Advanced lab questions should remain nursing-focused: recognize danger, monitor, communicate, and prepare ordered care.",
    cognitiveLoad: 4,
    prioritizationLevel: 4,
    tags: ["hyperkalemia", "telemetry", "acute-kidney-injury"],
  },
  {
    key: "stroke-thrombolytic-neuro-change",
    questionType: "ngn-case",
    domain: "neurologic",
    topic: "Post-thrombolytic monitoring",
    subtopic: "Neurologic change after treatment",
    scenario:
      "A client treated for ischemic stroke is being monitored after receiving thrombolytic therapy. The client suddenly reports a severe headache, becomes nauseated, and has a new decrease in level of consciousness.",
    stem: "Which action should the nurse take first?",
    correctAnswer: "B",
    options: {
      A: "Dim the lights and provide an antiemetic at the next scheduled medication time.",
      B: "Stop any running thrombolytic infusion if applicable, perform a focused neurologic assessment, and notify the stroke team immediately.",
      C: "Encourage the client to sleep because neurologic fatigue is expected after stroke treatment.",
      D: "Assist the client to ambulate to determine whether weakness has improved.",
    },
    optionRationales: {
      A: "Comfort measures delay response to possible intracranial bleeding.",
      B: "Sudden severe headache, nausea, and decreased consciousness after thrombolytic therapy are concerning for intracranial hemorrhage and require immediate action.",
      C: "New decreased consciousness is not expected fatigue and must be treated as deterioration.",
      D: "Ambulation is unsafe during acute neurologic change.",
    },
    rationale: {
      correct:
        "The new symptoms are high-risk for intracranial hemorrhage after thrombolytic therapy. The nurse should act immediately by stopping any active infusion if applicable, reassessing neurologic status, and notifying the stroke team.",
      advanced:
        "The advanced nursing skill is recognizing a treatment-related complication and initiating protocol-based escalation without delay.",
      escalation:
        "Stroke-team notification is urgent because rapid imaging and treatment decisions may be needed.",
      safety:
        "After thrombolytic therapy, sudden severe headache or decreased consciousness is never routine.",
    },
    hints: [
      "Think about the major bleeding risk associated with the recent treatment.",
      "New severe headache and decreased consciousness are red flags.",
      "Choose immediate neurologic assessment and stroke-team escalation.",
    ],
    teachingPoint:
      "Advanced stroke questions require differentiating expected monitoring from dangerous post-treatment changes.",
    cognitiveLoad: 5,
    prioritizationLevel: 5,
    tags: ["stroke", "thrombolytic", "intracranial-bleeding"],
  },
  {
    key: "cardiogenic-shock-post-mi",
    questionType: "shock-recognition",
    domain: "shock",
    topic: "Cardiogenic shock",
    subtopic: "Post-MI perfusion failure",
    scenario:
      "A client admitted with myocardial infarction becomes cool and clammy. BP is 84/52, HR 122/min, crackles are present bilaterally, urine output is 12 mL/hr, and the client is increasingly anxious.",
    stem: "Which action should the nurse prioritize?",
    correctAnswer: "C",
    options: {
      A: "Encourage oral fluids because urine output is low.",
      B: "Place the client flat to improve venous return.",
      C: "Assess oxygenation and perfusion, call rapid response, and prepare for ordered hemodynamic support.",
      D: "Teach the client that anxiety is common after myocardial infarction.",
    },
    optionRationales: {
      A: "Oral fluids can worsen pulmonary congestion and do not address shock.",
      B: "Flat positioning can worsen breathing when crackles suggest pulmonary congestion.",
      C: "Hypotension, cool clammy skin, oliguria, crackles, and anxiety suggest cardiogenic shock requiring immediate escalation.",
      D: "Anxiety may be a perfusion cue and should not be dismissed.",
    },
    rationale: {
      correct:
        "The findings suggest cardiogenic shock with poor perfusion and pulmonary congestion. The nurse should assess airway, breathing, circulation, escalate urgently, and prepare for ordered supportive therapies.",
      advanced:
        "The high-level reasoning is recognizing that low urine output and anxiety are part of the shock picture, not isolated minor complaints.",
      escalation:
        "Rapid response is appropriate because shock after myocardial infarction can deteriorate quickly.",
      safety:
        "Avoid interventions that increase fluid burden or worsen oxygenation when pulmonary congestion is present.",
    },
    hints: [
      "Low urine output plus cool clammy skin points to poor perfusion.",
      "Crackles after myocardial infarction change how you think about fluids and positioning.",
      "Choose urgent assessment and escalation for shock physiology.",
    ],
    teachingPoint:
      "Advanced shock items require distinguishing perfusion failure from simple anxiety, pain, or dehydration.",
    cognitiveLoad: 5,
    prioritizationLevel: 5,
    tags: ["cardiogenic-shock", "myocardial-infarction", "perfusion"],
  },
  {
    key: "burn-inhalation-deterioration",
    questionType: "rapid-deterioration",
    domain: "emergency",
    topic: "Burn inhalation injury",
    subtopic: "Airway edema risk",
    scenario:
      "A client with facial burns from a house fire has singed nasal hairs and a hoarse voice. Thirty minutes later the client develops increasing restlessness, drooling, and stridor.",
    stem: "What should the nurse do first?",
    correctAnswer: "A",
    options: {
      A: "Call rapid response and prepare for emergency airway support while keeping the client upright.",
      B: "Offer ice chips to soothe the throat and reduce swelling.",
      C: "Cover the client with extra blankets and reassess the voice in 1 hour.",
      D: "Ask the client to lie flat so the nurse can inspect the mouth more easily.",
    },
    optionRationales: {
      A: "Stridor, drooling, restlessness, and hoarseness after facial burns indicate threatened airway requiring immediate escalation.",
      B: "Oral intake is unsafe with possible airway compromise and does not treat edema.",
      C: "Waiting is unsafe because airway edema can progress rapidly.",
      D: "Lying flat can worsen airway obstruction and distress.",
    },
    rationale: {
      correct:
        "The client is showing signs of worsening upper-airway obstruction after inhalation injury. The nurse should call rapid response, keep the client in a position that supports breathing, and prepare for emergency airway management by the appropriate team.",
      advanced:
        "The advanced nursing task is early recognition of airway threat before complete obstruction occurs or the client arrests.",
      escalation:
        "Escalation must occur immediately because stridor and drooling are late airway warning signs.",
      safety:
        "Do not give oral intake or place the client flat when airway compromise is suspected.",
    },
    hints: [
      "Facial burns plus hoarseness suggest inhalation injury risk.",
      "Stridor and drooling indicate the airway is worsening.",
      "Choose the response that brings emergency airway help now.",
    ],
    teachingPoint:
      "Emergency airway questions often test whether the nurse recognizes late warning signs and escalates before arrest.",
    cognitiveLoad: 4,
    prioritizationLevel: 5,
    tags: ["burns", "inhalation-injury", "airway"],
  },
  {
    key: "massive-pe-deterioration",
    questionType: "advanced-priority",
    domain: "multisystem",
    topic: "Pulmonary embolism deterioration",
    subtopic: "Obstructive shock cues",
    scenario:
      "A postoperative client suddenly becomes severely short of breath and anxious. SpO2 is 82% on 4 L/min oxygen, HR is 136/min, BP is 78/46, and the client reports sharp chest pain.",
    stem: "Which nursing action is the priority?",
    correctAnswer: "D",
    options: {
      A: "Assist the client to walk because postoperative gas pain is common.",
      B: "Give the next scheduled oral pain medication and reassess in 30 minutes.",
      C: "Encourage slow breathing and document that anxiety triggered dyspnea.",
      D: "Call rapid response, support oxygenation, keep the client on bed rest, and prepare for ordered emergency therapy.",
    },
    optionRationales: {
      A: "Ambulation is unsafe with hypotension and severe hypoxemia.",
      B: "Oral pain medication delays emergency response and does not address shock.",
      C: "Anxiety may be caused by hypoxemia and shock; documenting it as the trigger is unsafe.",
      D: "Sudden dyspnea, pleuritic pain, tachycardia, hypoxemia, and hypotension suggest a life-threatening pulmonary embolism pattern requiring emergency escalation.",
    },
    rationale: {
      correct:
        "The client has sudden severe respiratory distress with shock after surgery, concerning for massive pulmonary embolism. The nurse should support oxygenation, prevent exertion, call rapid response, and prepare for emergency ordered care.",
      advanced:
        "The nurse is not independently selecting definitive clot therapy; the nursing role is recognizing obstructive shock cues and escalating immediately.",
      escalation:
        "Rapid response is needed because hypotension and hypoxemia indicate high risk of collapse.",
      safety:
        "Do not ambulate or delay care in sudden postoperative hypoxemia with hypotension.",
    },
    hints: [
      "The client is postoperative and suddenly hypoxemic and hypotensive.",
      "Severe anxiety can be a symptom of hypoxia and shock.",
      "Choose bed rest, oxygenation support, and emergency escalation.",
    ],
    teachingPoint:
      "Advanced multisystem questions test rapid recognition of life-threatening patterns without drifting into provider-only treatment decisions.",
    cognitiveLoad: 5,
    prioritizationLevel: 5,
    tags: ["pulmonary-embolism", "postoperative", "obstructive-shock"],
  },
  {
    key: "acute-liver-failure-bleeding-confusion",
    questionType: "ngn-case",
    domain: "multisystem",
    topic: "Multisystem deterioration",
    subtopic: "Liver failure safety priorities",
    scenario:
      "A client with acute liver failure becomes increasingly confused and has new oozing from IV sites. The nurse notes asterixis, jaundice, abdominal distention, and a new fall attempt while trying to get out of bed.",
    stem: "Which nursing priority best addresses the immediate safety risk?",
    correctAnswer: "C",
    options: {
      A: "Encourage independent ambulation to reduce abdominal fluid accumulation.",
      B: "Delay notifying the provider until the next scheduled coagulation labs result.",
      C: "Institute fall and bleeding precautions, assess neurologic status, and escalate the change in condition.",
      D: "Offer a high-protein snack and document that confusion is expected.",
    },
    optionRationales: {
      A: "Independent ambulation is unsafe with confusion and bleeding risk.",
      B: "Waiting for scheduled labs delays response to active neurologic and bleeding changes.",
      C: "Confusion, asterixis, bleeding, and a fall attempt require immediate safety precautions, focused assessment, and escalation.",
      D: "Nutrition teaching is not the immediate priority during active deterioration.",
    },
    rationale: {
      correct:
        "The immediate nursing priorities are injury prevention, bleeding precautions, neurologic assessment, and escalation. The client has signs of encephalopathy and coagulopathy, creating urgent safety risks.",
      advanced:
        "This item requires balancing neurologic, bleeding, and fall risks rather than focusing on a single body system.",
      escalation:
        "Escalation is needed because new confusion and bleeding can indicate worsening liver failure and require prompt team response.",
      safety:
        "A confused client with bleeding risk can be harmed quickly by falls, invasive procedures, or delayed recognition.",
    },
    hints: [
      "Identify the immediate harms: fall injury and bleeding.",
      "Asterixis and confusion suggest neurologic involvement, not just noncompliance.",
      "Choose precautions, assessment, and escalation.",
    ],
    teachingPoint:
      "Advanced multisystem reasoning asks the nurse to prioritize safety when several complications are occurring at once.",
    cognitiveLoad: 5,
    prioritizationLevel: 4,
    tags: ["liver-failure", "bleeding-risk", "encephalopathy"],
  },
  {
    key: "sedation-handoff-instability",
    questionType: "icu-safety",
    domain: "critical-care",
    topic: "High-acuity handoff",
    subtopic: "Sedation and deterioration cues",
    scenario:
      "During handoff, the nurse receives a client recovering from procedural sedation. The client is snoring loudly, difficult to arouse, RR 8/min, BP 90/54, and oxygen saturation is 89% despite oxygen. The outgoing nurse says the client was just sleepy.",
    stem: "Which action should the receiving nurse take first?",
    correctAnswer: "B",
    options: {
      A: "Accept the explanation and complete the rest of handoff before reassessing.",
      B: "Pause handoff, stimulate the client, assess airway and breathing, and call for immediate assistance.",
      C: "Ask the UAP to check the next set of vital signs in 15 minutes.",
      D: "Lower the oxygen flow because the client is breathing too slowly.",
    },
    optionRationales: {
      A: "Handoff should pause when the client has active airway and breathing compromise.",
      B: "Snoring respirations, decreased arousal, bradypnea, hypotension, and hypoxemia require immediate airway and breathing assessment with help.",
      C: "This unstable assessment cannot be delegated or delayed.",
      D: "Lowering oxygen is unsafe during hypoxemia and does not address hypoventilation.",
    },
    rationale: {
      correct:
        "The client has signs of oversedation and airway compromise. The nurse should interrupt handoff, stimulate the client, assess airway and breathing, and call for help immediately.",
      advanced:
        "Advanced handoff safety means challenging reassuring explanations when objective cues show deterioration.",
      escalation:
        "Immediate assistance is appropriate because post-sedation respiratory depression can progress quickly.",
      safety:
        "Handoff does not take priority over an unstable airway or breathing problem, even when the prior report sounds reassuring.",
    },
    hints: [
      "Do not let the handoff process override the client's current condition.",
      "Snoring, low respirations, and low saturation point to airway and breathing compromise.",
      "Choose the action that interrupts the workflow to stabilize the client.",
    ],
    teachingPoint:
      "High-acuity workflow questions test whether the nurse can stop routine processes when patient safety demands immediate action.",
    cognitiveLoad: 4,
    prioritizationLevel: 5,
    tags: ["sedation", "handoff", "airway", "workflow"],
  },
  {
    key: "aortic-dissection-warning",
    questionType: "advanced-priority",
    domain: "advanced-cardiac",
    topic: "Acute vascular emergency cues",
    subtopic: "Chest and back pain with perfusion change",
    scenario:
      "A client with long-standing hypertension reports sudden tearing chest pain radiating to the back. The nurse notes unequal arm blood pressures, diaphoresis, and new weakness in one leg.",
    stem: "Which nursing response is most appropriate?",
    correctAnswer: "A",
    options: {
      A: "Keep the client on bed rest, assess perfusion and neurologic status, and notify the provider or rapid response team immediately.",
      B: "Assist the client to ambulate to determine whether the leg weakness improves.",
      C: "Administer an antacid and reassess the pain after the medication takes effect.",
      D: "Teach relaxation breathing because anxiety can cause chest pain and diaphoresis.",
    },
    optionRationales: {
      A: "Sudden tearing chest and back pain with unequal blood pressures and neurologic change suggests a vascular emergency requiring immediate assessment and escalation.",
      B: "Ambulation is unsafe when perfusion and neurologic compromise are possible.",
      C: "An antacid delays response to a life-threatening presentation.",
      D: "Anxiety may be secondary to a severe physiologic emergency and should not be assumed.",
    },
    rationale: {
      correct:
        "The presentation is concerning for acute aortic pathology with perfusion compromise. The nurse should keep the client at rest, assess circulation and neurologic status, and escalate immediately.",
      advanced:
        "The advanced nursing reasoning is identifying a high-risk pattern without making a definitive medical diagnosis or ordering treatment.",
      escalation:
        "Immediate provider or rapid response notification is needed because deterioration can be sudden and catastrophic.",
      safety:
        "Avoid exertion and delays when chest pain includes unequal perfusion or neurologic deficits.",
    },
    hints: [
      "Sudden tearing pain radiating to the back is a major red flag.",
      "Unequal arm pressures and leg weakness point to perfusion compromise.",
      "Choose bed rest, focused assessment, and immediate escalation.",
    ],
    teachingPoint:
      "Advanced cardiovascular questions may include specialty-adjacent cues, but the answer remains nursing assessment, safety, and escalation.",
    cognitiveLoad: 5,
    prioritizationLevel: 5,
    tags: ["vascular-emergency", "hypertension", "perfusion"],
  },
];

function buildQuestion(s: Scenario, index: number): NclexTier3Question {
  const options = (["A", "B", "C", "D"] as const).map((id) =>
    option(id, s.options[id], id === s.correctAnswer, s.optionRationales[id]),
  ) as [NclexTier3Option, NclexTier3Option, NclexTier3Option, NclexTier3Option];

  return {
    id: `nclex-tier3-${String(index + 1).padStart(2, "0")}-${s.key}`,
    tier: 3,
    questionType: s.questionType,
    exam: ["NCLEX-RN"],
    domain: s.domain,
    topic: s.topic,
    subtopic: s.subtopic,
    scenario: s.scenario,
    stem: s.stem,
    options,
    correctAnswer: s.correctAnswer,
    rationale: {
      correct: s.rationale.correct,
      advancedNursingReasoning: s.rationale.advanced,
      escalationLogic: s.rationale.escalation,
      safetyPrinciple: s.rationale.safety,
      wrongAnswers: s.optionRationales,
    },
    hints: s.hints,
    teachingPoint: s.teachingPoint,
    advancedScopeGuardrail:
      "The Tier 3 nursing role is to recognize high-acuity danger, assess, monitor, protect patient safety, communicate clearly, and escalate through policy while avoiding independent provider-level treatment decisions.",
    adaptiveMetadata: {
      difficulty: "tier-3-advanced-review",
      cognitiveLoad: s.cognitiveLoad,
      safetyCritical: true,
      prioritizationLevel: s.prioritizationLevel,
      specialtyExposure: true,
      misconceptionTags: s.tags,
      avoidedOutOfScopeContent: [
        "exact ventilator setting calculation",
        "respiratory therapist technical management",
        "independent prescribing",
        "invasive procedure performance",
        "intensivist-level treatment planning",
      ],
    },
  };
}

export const nclexTier3AdvancedReviewQuestions: readonly NclexTier3Question[] = SCENARIOS.map(buildQuestion);

export const NCLEX_TIER3_ADVANCED_REVIEW_METRICS = {
  totalQuestions: nclexTier3AdvancedReviewQuestions.length,
  byType: nclexTier3AdvancedReviewQuestions.reduce<Record<NclexTier3QuestionType, number>>(
    (acc, question) => {
      acc[question.questionType] = (acc[question.questionType] ?? 0) + 1;
      return acc;
    },
    {
      "advanced-priority": 0,
      "rapid-deterioration": 0,
      "icu-safety": 0,
      "telemetry-basic": 0,
      "titrated-medication-safety": 0,
      "shock-recognition": 0,
      "ventilated-patient-assessment": 0,
      "complex-delegation": 0,
      "ngn-case": 0,
    },
  ),
  byDomain: nclexTier3AdvancedReviewQuestions.reduce<Record<NclexTier3Domain, number>>(
    (acc, question) => {
      acc[question.domain] = (acc[question.domain] ?? 0) + 1;
      return acc;
    },
    {
      "advanced-respiratory": 0,
      "critical-care": 0,
      "advanced-cardiac": 0,
      shock: 0,
      sepsis: 0,
      neurologic: 0,
      pharmacology: 0,
      emergency: 0,
      postoperative: 0,
      multisystem: 0,
      delegation: 0,
    },
  ),
} as const;
