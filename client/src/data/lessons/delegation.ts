import type { LessonContent } from "./types";

export const delegationLessons: Record<string, LessonContent> = {
  "abcs-life-threats": {
    title: "ABCs & Immediate Life Threat Prioritization",
    cellular: {
      title: "Physiological Basis for ABC Prioritization",
      content: "The ABC framework (Airway, Breathing, Circulation) is grounded in the physiological principle that organ systems have varying tolerances to oxygen deprivation. The brain sustains irreversible damage within 4-6 minutes of oxygen deprivation, making airway and breathing the highest priorities in any clinical situation. Without a patent airway, no amount of breathing effort is effective. Without adequate breathing, circulation of deoxygenated blood provides no benefit. Without circulation, even well-oxygenated blood cannot reach the tissues.\n\nThis hierarchy directly mirrors Maslow's Hierarchy of Needs applied to clinical nursing. Physiological needs (oxygen, perfusion, thermoregulation) must be addressed before safety needs (fall prevention, infection control), which must be addressed before psychosocial needs (anxiety, education, spiritual care). On the licensing exam, examinations and in clinical practice, ABCs override all other considerations when a patient is acutely deteriorating.\n\nThe primary survey (ABCDE: Airway, Breathing, Circulation, Disability, Exposure) provides a systematic approach to identifying and treating life-threatening conditions in order of physiological priority. Each step is addressed sequentially, and any abnormality found is treated before moving to the next letter. A compromised airway is always addressed first, regardless of other dramatic findings such as active bleeding or altered consciousness."
    },
    riskFactors: [
      "Failure to assess airway patency before addressing other complaints",
      "Distraction by dramatic but non-life-threatening findings (e.g., open fracture)",
      "Treating pain before ensuring adequate oxygenation and ventilation",
      "Addressing psychosocial concerns before stabilizing physiological parameters",
      "Failure to recognize early signs of airway compromise (stridor, accessory muscle use)",
      "Delayed recognition of obstructive airway emergencies (anaphylaxis, epiglottitis)",
      "Ignoring subtle signs of circulatory compromise (delayed capillary refill, mottling)",
      "Over-focusing on single vital sign abnormalities without assessing the full ABC picture"
    ],
    diagnostics: [
      "Airway: Look for chest rise, listen for air movement, feel for breath on cheek",
      "Airway: Assess for stridor, gurgling, snoring, or silent chest",
      "Breathing: Assess respiratory rate, depth, pattern, and effort",
      "Breathing: Auscultate bilateral lung sounds for symmetry and adventitious sounds",
      "Circulation: Assess heart rate, blood pressure, capillary refill, skin color/temperature",
      "Circulation: Palpate central and peripheral pulses for rate, rhythm, and quality"
    ],
    management: [
      "Airway obstruction: Head-tilt chin-lift (trauma: jaw thrust only), suction, oropharyngeal or nasopharyngeal airway",
      "Breathing failure: Apply high-flow oxygen, assist ventilations with bag-valve-mask if apneic",
      "Circulatory failure: Control hemorrhage with direct pressure, establish IV access, administer fluid bolus as ordered",
      "Position patient appropriately: high-Fowler's for respiratory distress, supine with legs elevated for shock",
      "Prepare for advanced airway management if basic maneuvers fail",
      "Activate rapid response or code team when ABCs cannot be stabilized with initial interventions"
    ],
    nursingActions: [
      "Always assess airway FIRST - before blood pressure, pain, or any other parameter",
      "Clear the airway: suction visible secretions, position for optimal airway opening",
      "If the patient can speak in full sentences, the airway is patent and breathing is adequate",
      "Assess for signs of tension pneumothorax: tracheal deviation, absent breath sounds, JVD, hypotension",
      "Apply pulse oximetry continuously for any patient with respiratory or circulatory compromise",
      "Document ABC assessment findings and interventions in real-time"
    ],
    signs: {
      left: [
        "Airway Compromise: Stridor, gurgling, snoring respirations",
        "Airway Compromise: Drooling, inability to swallow secretions",
        "Breathing Failure: Apnea, cyanosis, silent chest, agonal gasps",
        "Breathing Failure: Accessory muscle use, nasal flaring, retractions"
      ],
      right: [
        "Circulatory Failure: Pulselessness, unresponsiveness, asystole/VF",
        "Circulatory Failure: Hypotension, tachycardia, mottling, delayed cap refill",
        "Disability: Unresponsive, pupils fixed and dilated, posturing",
        "Maslow Priority: Physiological → Safety → Psychosocial → Self-actualization"
      ]
    },
    medications: [
      {
        name: "Epinephrine (Anaphylaxis)",
        type: "Catecholamine",
        action: "Reverses bronchospasm, vasodilation, and laryngeal edema in anaphylaxis",
        sideEffects: "Tachycardia, hypertension, tremor, anxiety",
        contra: "No absolute contraindications in anaphylaxis - always give for life-threatening allergic reaction",
        pearl: "Anaphylaxis is an ABC emergency: airway (laryngeal edema), breathing (bronchospasm), and circulation (distributive shock) are all simultaneously threatened. Give IM epinephrine in the anterolateral thigh IMMEDIATELY."
      }
    ],
    pearls: [
      "If the patient can speak in complete sentences, the airway is patent and breathing is sufficient for the moment",
      "In trauma, assume cervical spine injury until cleared - use jaw thrust instead of head-tilt chin-lift",
      "Bleeding that you can see is less dangerous than bleeding you cannot see (internal hemorrhage)",
      "On the licensing exam, : when multiple patients need attention, always address the ABC problem first"
    ],
    preTest: [
      {
        question: "A patient has active external bleeding and is making snoring sounds. What is the priority?",
        options: ["Apply pressure to the bleeding site", "Open the airway with head-tilt chin-lift", "Start an IV for fluid resuscitation", "Assess blood pressure"],
        correct: 1,
        rationale: "Airway ALWAYS comes before circulation. The snoring sounds indicate a partially obstructed airway. Without a patent airway, controlling bleeding is futile because the patient cannot oxygenate."
      },
      {
        question: "According to Maslow's hierarchy applied to nursing, which need is addressed first?",
        options: ["Safety needs (fall prevention)", "Physiological needs (oxygenation)", "Psychosocial needs (anxiety)", "Self-esteem needs (independence)"],
        correct: 1,
        rationale: "Maslow's hierarchy in nursing prioritization: physiological needs (ABCs, oxygen, circulation) are always addressed first before moving to safety, psychosocial, or higher-level needs."
      },
      {
        question: "A patient is cyanotic, has absent breath sounds on the right side, and tracheal deviation to the left. This suggests:",
        options: ["Simple pneumonia", "Tension pneumothorax", "Asthma exacerbation", "Heart failure"],
        correct: 1,
        rationale: "Absent breath sounds on one side with tracheal deviation to the opposite side and cyanosis is the classic presentation of tension pneumothorax - a life-threatening breathing emergency requiring immediate needle decompression."
      }
    ],
    postTest: [
      {
        question: "Four patients need the nurse's attention. Which should be seen FIRST?",
        options: ["Patient reporting 8/10 pain requesting medication", "Patient with BP 88/52 and HR 122", "Patient with new-onset stridor after eating shellfish", "Patient requesting discharge paperwork"],
        correct: 2,
        rationale: "Stridor after shellfish exposure suggests anaphylaxis with airway compromise. Airway always takes priority over circulation (the hypotensive patient) or pain management."
      },
      {
        question: "During the primary survey, when should the nurse assess blood pressure?",
        options: ["First, before anything else", "After assessing Airway and Breathing", "Only after all other assessments are complete", "Blood pressure is not part of the primary survey"],
        correct: 1,
        rationale: "In the primary survey (ABCDE), blood pressure is assessed as part of Circulation (C), which comes AFTER Airway (A) and Breathing (B) have been assessed and any life threats managed."
      },
      {
        question: "A patient with anaphylaxis is not improving after the first IM epinephrine dose. What is the next step?",
        options: ["Wait 30 minutes for the first dose to work", "Repeat IM epinephrine in 5-15 minutes", "Switch to oral diphenhydramine only", "Discontinue all treatment and observe"],
        correct: 1,
        rationale: "If anaphylaxis symptoms persist, IM epinephrine can be repeated every 5-15 minutes. There is no maximum dose in a life-threatening situation. Antihistamines are adjunct therapy only."
      }
    ],
    quiz: [
      {
        question: "In the ABC framework, which is always assessed and managed first?",
        options: ["Breathing", "Circulation", "Airway", "Disability"],
        correct: 2,
        rationale: "Airway is ALWAYS the first priority. Without a patent airway, breathing and circulation are irrelevant. This is the foundational principle of emergency and clinical prioritization."
      }
    ]
  },

  "unstable-vs-stable": {
    title: "Unstable vs Stable: Prioritization Framework",
    cellular: {
      title: "Differentiating Stable from Unstable Clinical",
      content: "The ability to differentiate stable from unstable patients is one of the most critical clinical reasoning skills in nursing. An unstable patient is one whose condition is actively deteriorating, whose vital signs are trending in a dangerous direction, or who presents with new-onset symptoms that may indicate a life-threatening process. A stable patient has a predictable clinical course, vital signs within an acceptable range for their condition, and symptoms that are expected given their diagnosis.\n\nKey indicators of instability include: new-onset symptoms that were not previously present, acute changes from the patient's baseline, vital sign parameters outside safe ranges, signs of organ hypoperfusion (altered mental status, decreased urine output, mottled skin), and symptoms that are worsening despite current interventions. The word 'new' is critical - a patient with chronic stable heart failure who reports their usual dyspnea with exertion is stable, but a patient with heart failure who develops new-onset resting dyspnea is unstable.\n\nExpected findings are symptoms or assessment data that are consistent with the patient's known diagnosis, current treatment plan, and stage of recovery. Unexpected findings are new symptoms, worsening trends, or assessment data that deviate from the anticipated clinical trajectory. Every unexpected finding warrants immediate assessment and potential intervention. The nurse must constantly compare the patient's current status to what is expected and recognize when the clinical picture deviates from the norm."
    },
    riskFactors: [
      "Failure to recognize 'new onset' vs 'chronic/expected' presentation",
      "Assuming that stable vital signs mean the patient is clinically stable",
      "Normalizing abnormal findings because the patient 'always looks like that'",
      "Failure to trend vital signs and recognize deteriorating patterns",
      "Over-reliance on technology without clinical bedside assessment",
      "Cognitive anchoring to the initial diagnosis without considering new developments",
      "Failure to reassess after interventions to determine effectiveness",
      "Delaying assessment of patients who 'look fine' but have concerning vital signs"
    ],
    diagnostics: [
      "Compare current vital signs to patient's established baseline (not just textbook normals)",
      "Assess for new-onset symptoms not present on previous assessment",
      "Evaluate level of consciousness using AVPU (Alert, Voice, Pain, Unresponsive) or GCS",
      "Monitor trends over time rather than relying on single-point-in-time assessments",
      "Assess for signs of end-organ perfusion: mental status, urine output, skin color and temperature",
      "Review current medications and treatments for potential contribution to clinical changes"
    ],
    management: [
      "Unstable patients: Immediate bedside assessment, notify provider, prepare for escalation",
      "Assess ABCs for any patient identified as potentially unstable",
      "Increase monitoring frequency for patients showing early signs of instability",
      "Implement standing orders or protocols for acute changes (e.g., hypoglycemia protocol, chest pain protocol)",
      "Prepare for potential transfer to higher level of care (ICU)",
      "Document timeline of changes, interventions, and patient responses"
    ],
    nursingActions: [
      "Always prioritize the unstable patient over stable patients, regardless of scheduled tasks",
      "Report any NEW onset of chest pain, dyspnea, altered mental status, or hemodynamic changes",
      "Reassess the patient after every intervention to determine if stability is improving or worsening",
      "Compare assessment findings to the last documented assessment to identify trends",
      "Use clinical judgment to differentiate between expected post-procedural findings and complications",
      "Communicate urgency appropriately when reporting unstable findings to the provider"
    ],
    signs: {
      left: [
        "STABLE: Expected findings for the diagnosis and stage of illness",
        "STABLE: Vital signs within the patient's baseline range",
        "STABLE: Symptoms responding to current treatment plan",
        "STABLE: Alert and oriented, adequate urine output, stable hemodynamics"
      ],
      right: [
        "UNSTABLE: New-onset symptoms not previously present",
        "UNSTABLE: Vital signs trending in a dangerous direction",
        "UNSTABLE: Symptoms worsening despite current interventions",
        "UNSTABLE: Altered LOC, decreasing urine output, hemodynamic compromise"
      ]
    },
    medications: [
      {
        name: "Clinical Stability Assessment Framework",
        type: "Decision-Making Tool",
        action: "Guides prioritization by differentiating stable from unstable patients",
        sideEffects: "May delay care to other patients when focusing on unstable patients",
        contra: "Never assume stability based on a single normal vital sign parameter",
        pearl: "The key question for NCLEX: 'Is this finding EXPECTED for this patient, or is this NEW and UNEXPECTED?' New and unexpected = unstable = priority."
      }
    ],
    pearls: [
      "The word 'NEW' is the most important word in clinical prioritization - new symptoms always take priority",
      "A patient with 'normal' vital signs can still be unstable if those values represent a significant change from their baseline",
      "Expected pain after surgery is stable; new-onset sharp chest pain after surgery is unstable (possible PE)",
      "When in doubt, assess the patient at the bedside - no amount of data review replaces a hands-on evaluation"
    ],
    preTest: [
      {
        question: "A heart failure patient reports their usual dyspnea when climbing stairs. Is this stable or unstable?",
        options: ["Unstable - dyspnea is always a concern", "Stable - this is an expected finding for their chronic condition", "Unstable - all heart failure patients should be monitored in ICU", "Cannot determine without lab values"],
        correct: 1,
        rationale: "Exertional dyspnea that is consistent with the patient's known baseline and chronic condition is an EXPECTED finding and represents stability. New-onset dyspnea at rest would be unstable."
      },
      {
        question: "Which patient should the nurse assess FIRST?",
        options: ["Post-op day 2 patient with expected surgical site pain of 4/10", "Diabetic patient with blood glucose of 180 mg/dL before lunch", "Heart failure patient with new-onset confusion and SpO2 of 88%", "Patient requesting a pain medication refill"],
        correct: 2,
        rationale: "New-onset confusion with hypoxemia in a heart failure patient indicates clinical deterioration. This is an UNEXPECTED finding that requires immediate assessment and intervention."
      },
      {
        question: "What makes a clinical finding 'unexpected'?",
        options: ["It is a textbook abnormal value", "It is new, different from baseline, or worsening despite treatment", "The physician has not been informed yet", "It occurs during the night shift"],
        correct: 1,
        rationale: "An unexpected finding is one that is new (not previously present), significantly different from the patient's baseline, or worsening despite appropriate interventions."
      }
    ],
    postTest: [
      {
        question: "A post-op knee replacement patient has moderate surgical site pain and mild swelling on day 1. This is:",
        options: ["Unstable - requires immediate assessment", "Stable - expected findings for post-op day 1", "Requires transfer to ICU", "Requires emergency surgery"],
        correct: 1,
        rationale: "Moderate pain and mild swelling on post-op day 1 after knee replacement are EXPECTED findings. The nurse should manage pain per orders and monitor, but this is not a priority concern."
      },
      {
        question: "A post-op patient who was stable 2 hours ago now has HR 128, BP 82/50, and is restless. Priority action:",
        options: ["Recheck vitals in one hour", "Assess immediately for hemorrhage or complication", "Encourage rest and reassess at next scheduled check", "Administer pain medication for the restlessness"],
        correct: 1,
        rationale: "This patient was stable and is now showing signs of hemodynamic instability (tachycardia, hypotension, restlessness). This is a NEW change suggesting active bleeding, hypovolemia, or other acute complication requiring immediate assessment."
      },
      {
        question: "When should the nurse increase the frequency of vital sign monitoring?",
        options: ["Only when ordered by the physician", "When the patient requests it", "When assessment findings suggest early instability or clinical change", "Every shift change automatically"],
        correct: 2,
        rationale: "Nurses should increase monitoring frequency proactively when assessment findings suggest the patient may be developing instability. This is an independent nursing judgment that does not require a physician order."
      }
    ],
    quiz: [
      {
        question: "Which clinical scenario represents an UNSTABLE patient?",
        options: ["COPD patient with baseline SpO2 of 90% and chronic productive cough", "Post-op patient with new sudden onset of chest pain and tachycardia", "Diabetic patient with blood glucose of 160 before meals", "Heart failure patient with 1+ bilateral ankle edema (chronic)"],
        correct: 1,
        rationale: "New-onset chest pain with tachycardia in a post-op patient is unexpected and may indicate pulmonary embolism, myocardial infarction, or hemorrhage. This patient is unstable and requires immediate assessment."
      }
    ]
  },

  "who-to-see-first": {
    title: "Who to See First: Clinical Decision Framework",
    cellular: {
      title: "Clinical Triage",
      content: "The 'Who to See First' question is one of the most frequently tested clinical judgment domains on licensing examinations and one of the most critical skills in daily nursing practice. When multiple patients require attention simultaneously, the nurse must rapidly assess each situation and determine the order of priority based on clinical acuity, potential for deterioration, and the ABCs/Maslow framework.\n\nThe priority patient is always the one with the greatest threat to life or the highest potential for rapid clinical deterioration. This is determined by applying a systematic framework: (1) Identify any airway, breathing, or circulation threats - these are always first; (2) Identify any new-onset, unexpected, or acute findings - these take priority over chronic or expected findings; (3) Identify patients who are at risk for complications if not assessed promptly; (4) Address routine needs and scheduled tasks last.\n\nCommOn the licensing exam, distractors include patients with concerning but stable chronic conditions, expected post-procedural findings, and psychosocial needs. While all patients deserve attention, the nurse must recognize that a patient with acute respiratory distress takes priority over a patient with chronic pain, and a patient with signs of hemorrhage takes priority over a patient requesting a sleeping pill. The key principle is that unstable, acute, and life-threatening conditions are always assessed before stable, chronic, and non-urgent conditions."
    },
    riskFactors: [
      "Seeing patients in room order rather than acuity order",
      "Addressing the most vocal or demanding patient first instead of the most critical",
      "Confusing urgency with importance (a patient demanding pain medication vs. a silent patient with declining SpO2)",
      "Failure to delegate appropriate tasks to free time for high-acuity patients",
      "Not reassessing priorities after new information becomes available",
      "Anchoring on initial morning assessment without accounting for acute changes",
      "Inadequate shift handoff leading to missed clinical concerns",
      "Task-oriented rather than patient-outcome-oriented thinking"
    ],
    diagnostics: [
      "Rapidly assess all patients using a brief visual and verbal check at start of shift",
      "Identify which patients have the highest acuity based on diagnosis, interventions, and stability",
      "Review overnight events and recent trend data before making prioritization decisions",
      "Apply ABC framework to any acute situation requiring immediate triage",
      "Assess which patients are at greatest risk for clinical deterioration within the next hour",
      "Consider which patients have time-sensitive needs (medications, procedures, discharge)"
    ],
    management: [
      "See the patient with the most acute or life-threatening condition first",
      "Delegate appropriate tasks to UAP to manage stable patients while addressing critical needs",
      "Reassess priorities throughout the shift as patient conditions change",
      "Use SBAR to communicate with the healthcare team about changes in priority",
      "Document the rationale for prioritization decisions when they impact care delivery",
      "Escalate when patient acuity exceeds safe staffing capacity"
    ],
    nursingActions: [
      "ABCs first: always see the patient with airway, breathing, or circulation compromise first",
      "New onset > chronic: see the patient with new symptoms before the patient with stable chronic conditions",
      "Unstable > stable: assess deteriorating patients before patients with predictable courses",
      "Acute pain > chronic pain: but both are secondary to ABC emergencies",
      "Post-procedure complications > routine post-procedure checks",
      "Time-sensitive interventions (blood transfusion reaction, chest pain protocol) supersede scheduled tasks"
    ],
    signs: {
      left: [
        "HIGHEST PRIORITY: Active airway obstruction, respiratory failure, cardiac arrest",
        "HIGH PRIORITY: New chest pain, acute mental status change, hemorrhage",
        "MODERATE PRIORITY: Uncontrolled pain, fever with suspected sepsis, acute urinary retention",
        "LOWER PRIORITY: Stable chronic conditions, routine assessments, discharge teaching"
      ],
      right: [
        "NCLEX Key: 'Assess' is almost always correct before 'Intervene' for unclear situations",
        "NCLEX Key: Real emergencies need action (airway, CPR) not just assessment",
        "NCLEX Key: The patient who is 'expected' is NOT the priority",
        "NCLEX Key: The quiet patient declining may be sicker than the vocal patient complaining"
      ]
    },
    medications: [
      {
        name: "Triage Decision Framework",
        type: "Clinical Prioritization Tool",
        action: "Systematic approach to determine which patient needs attention first",
        sideEffects: "Requires rapid clinical judgment that improves with experience",
        contra: "Never prioritize based on personal convenience or patient room proximity",
        pearl: "Ask yourself: 'Which patient will have the worst outcome if I delay seeing them?' That is your priority patient."
      }
    ],
    pearls: [
      "The sickest patient is not always the loudest - a patient who is too sick to call for help is more critical than one who is yelling for pain medication",
      "On the licensing exam, when all patients seem equally urgent, apply ABCs to differentiate",
      "Expected findings for a diagnosis are never the priority over unexpected/new findings in another patient",
      "When delegating to UAP, you free yourself to focus on the patients who require RN-level assessment and judgment"
    ],
    preTest: [
      {
        question: "Four patients need attention. Who should the nurse see first?",
        options: ["Patient with chronic back pain requesting medication", "Patient with post-op nausea requesting an antiemetic", "Patient with new-onset dyspnea and SpO2 of 85%", "Patient requesting help to the bathroom"],
        correct: 2,
        rationale: "New-onset dyspnea with SpO2 of 85% is an acute respiratory problem (Breathing - the 'B' in ABCs). This patient is at immediate risk for respiratory failure and must be seen first."
      },
      {
        question: "A nurse has four patients. Which should be assessed LAST?",
        options: ["Patient 2 hours post-cardiac catheterization with stable vitals", "Patient with diabetes whose blood glucose is 310 mg/dL", "Patient post-appendectomy with expected moderate incision pain", "Patient with pneumonia and new confusion"],
        correct: 2,
        rationale: "Expected moderate incision pain after appendectomy is a stable, predictable finding. All other patients have higher acuity: the cath patient needs frequent neurovascular checks, hyperglycemia needs treatment, and new confusion with pneumonia suggests sepsis."
      },
      {
        question: "What is the primary basis for 'who to see first' decisions?",
        options: ["Room proximity", "Patient or family request", "Potential threat to life and clinical acuity", "Length of time since last assessment"],
        correct: 2,
        rationale: "Prioritization is based on clinical acuity and threat to life. ABCs, potential for deterioration, and new-onset findings drive priority decisions, not convenience or patient requests."
      }
    ],
    postTest: [
      {
        question: "A nurse receives report on four patients. Which finding should prompt the nurse to assess that patient FIRST?",
        options: ["Heart failure patient with weight gain of 0.5 kg from yesterday", "Post-thyroidectomy patient reporting tingling around the lips", "COPD patient with SpO2 of 90% on 2L nasal cannula", "Hip replacement patient requesting pain medication"],
        correct: 1,
        rationale: "Tingling around the lips after thyroidectomy suggests hypocalcemia from accidental parathyroid removal. This can progress to laryngospasm (airway emergency) and requires IMMEDIATE assessment and calcium level evaluation."
      },
      {
        question: "A charge nurse must assign a new admission. Which nurse should receive the patient?",
        options: ["Nurse with one unstable ICU patient", "Nurse with three stable patients being discharged today", "Nurse with two patients, one receiving a blood transfusion", "Nurse with four complex patients and no aide support"],
        correct: 1,
        rationale: "The nurse with three stable patients being discharged will have the most capacity to take a new admission. The other nurses have higher-acuity or higher-workload situations that would be unsafe to add to."
      },
      {
        question: "During a mass casualty event, which patient should receive treatment FIRST?",
        options: ["Patient with no pulse and no respirations (even after airway opening)", "Patient with a compound femur fracture and controlled bleeding", "Patient with respiratory distress and an open chest wound", "Patient with minor abrasions and anxiety"],
        correct: 2,
        rationale: "In disaster triage, patients with treatable life-threatening injuries (respiratory distress with open chest wound) are treated first. The pulseless/apneic patient is expectant (black tag) in a mass casualty. Minor injuries are delayed (green tag)."
      }
    ],
    quiz: [
      {
        question: "A nurse must prioritize four patients. Who is seen first?",
        options: ["Patient with pain rated 7/10 requesting PRN morphine", "Patient with blood glucose of 45 mg/dL who is confused and diaphoretic", "Patient with stable chronic renal failure awaiting dialysis", "Patient requesting assistance with a bath"],
        correct: 1,
        rationale: "Blood glucose of 45 mg/dL with confusion and diaphoresis is acute hypoglycemia - a medical emergency that can progress to seizures, coma, and death. This is an immediate life threat requiring glucose replacement."
      }
    ]
  },

  "delegation-rules-scope": {
    title: "Delegation Rules & Scope of Practice",
    cellular: {
      title: "Legal and Ethical Framework for Nursing",
      content: "Delegation is the transfer of responsibility for performing a nursing activity to another person while retaining accountability for the outcome. The delegating nurse remains legally accountable for the appropriateness of the delegation decision, for supervising the delegated task, and for evaluating the outcome. Understanding scope of practice and delegation rules is essential for patient safety and legal protection.\n\nThe Five Rights of Delegation provide a framework for safe delegation decisions: Right Task (the activity is within the delegate's scope and competency), Right Circumstance (the patient's condition is stable and predictable enough for the task to be safely delegated), Right Person (the delegate has the appropriate training, skills, and legal authority), Right Direction/Communication (clear, specific instructions are given including expected findings to report), and Right Supervision/Evaluation (the delegating nurse follows up to ensure the task was completed correctly and the patient responded appropriately).\n\nScope of practice varies by licensure level. Registered Nurses (RNs) can perform comprehensive assessment, develop nursing care plans, administer all medications (including IV push and blood products), provide patient education, and delegate to RPNs/LPNs and UAPs. Registered Practical Nurses/Licensed Practical Nurses (RPNs/LPNs) work under RN supervision for complex patients and can perform focused assessments, administer most medications (with jurisdictional variations for IV push), reinforce education, and delegate to UAPs. Unregulated/Unlicensed Assistive Personnel (UAPs/PSWs/CNAs) can perform activities of daily living, vital signs on stable patients, specimen collection, and routine tasks that do not require clinical judgment."
    },
    riskFactors: [
      "Delegating assessment, evaluation, or clinical judgment to UAPs",
      "Failing to verify the delegate's competency for the specific task",
      "Delegating to an overwhelmed staff member without checking their workload",
      "Assuming that RPN/LPN scope is identical to RN scope",
      "Failing to provide clear, complete instructions and expected reporting parameters",
      "Not following up after delegation to evaluate task completion and patient outcome",
      "Delegating unstable or unpredictable patient care to inappropriate personnel",
      "Delegating tasks that are excluded from the delegate's scope by regulation"
    ],
    diagnostics: [
      "Determine the stability and predictability of the patient's condition",
      "Verify the delegate's licensure level and scope of practice",
      "Assess the delegate's demonstrated competency for the specific task",
      "Evaluate the complexity of the task and required level of clinical judgment",
      "Consider the availability of supervision and support",
      "Review facility policy and jurisdictional regulations regarding delegation"
    ],
    management: [
      "Apply the Five Rights of Delegation before every delegation decision",
      "Provide clear, specific verbal and/or written instructions for delegated tasks",
      "Include specific parameters for when the delegate must report findings immediately",
      "Follow up within an appropriate timeframe to evaluate task completion and patient response",
      "Document delegation decisions, instructions given, and evaluation of outcomes",
      "Intervene immediately if the delegate reports unexpected findings or if the patient's condition changes"
    ],
    nursingActions: [
      "NEVER delegate: Initial assessment, care planning, patient education, evaluation of outcomes, or unstable patient care",
      "RN can delegate to RPN/LPN: focused assessments, medication administration (within scope), reinforcement of established teaching",
      "RN can delegate to UAP: vital signs on stable patients, ADLs, I&O measurement, specimen collection, ambulation assistance",
      "UAP must report to the nurse: any change in patient condition, vital signs outside normal range, patient complaints, refusal of care",
      "Always verify task completion - delegation does not transfer accountability",
      "Document what was delegated, to whom, instructions given, and follow-up evaluation"
    ],
    signs: {
      left: [
        "CAN delegate to UAP: Bathing, feeding, ambulation, vital signs (stable patients)",
        "CAN delegate to UAP: I&O measurement, specimen collection, simple dressing changes",
        "CAN delegate to RPN/LPN: Medication administration (within scope), focused assessments",
        "CAN delegate to RPN/LPN: Wound care, catheter care, reinforcement of patient education"
      ],
      right: [
        "CANNOT delegate: Initial or comprehensive assessment (RN only)",
        "CANNOT delegate: Nursing diagnosis and care planning (RN only)",
        "CANNOT delegate: Patient education (initial teaching - RN responsibility)",
        "CANNOT delegate: Evaluation of patient outcomes and clinical judgment decisions"
      ]
    },
    medications: [
      {
        name: "Five Rights of Delegation",
        type: "Legal Safety Framework",
        action: "Ensures safe and appropriate transfer of nursing activities",
        sideEffects: "Time-intensive but legally and ethically required",
        contra: "Never delegate when the patient is unstable or the task requires clinical nursing judgment",
        pearl: "Remember: You delegate the TASK but never the ACCOUNTABILITY. The nurse who delegates remains legally responsible for the outcome."
      }
    ],
    pearls: [
      "The RN ALWAYS retains accountability for delegated tasks - you can delegate the task but never the responsibility",
      "Assessment is NEVER delegated - UAPs collect data (vital signs), but the nurse interprets and assesses",
      "When in doubt about scope, check: Can the delegate legally do this? Do they have the competency? Is the patient stable enough?",
      "On the licensing exam, if the question involves an unstable patient, the answer is almost always 'the nurse does it' - not delegated"
    ],
    preTest: [
      {
        question: "Which task can be safely delegated to a UAP (unlicensed assistive personnel)?",
        options: ["Performing an initial patient assessment", "Administering oral medications", "Measuring vital signs on a stable patient", "Evaluating the effectiveness of a pain medication"],
        correct: 2,
        rationale: "UAPs can measure vital signs on stable patients. They collect data that the nurse then interprets. Assessment, medication administration, and evaluation of outcomes require licensed nursing judgment."
      },
      {
        question: "Who retains accountability when a task is delegated?",
        options: ["The person performing the task", "The charge nurse", "The delegating nurse", "The nursing supervisor"],
        correct: 2,
        rationale: "The delegating nurse ALWAYS retains accountability for the appropriateness of the delegation decision, the supervision provided, and the patient outcome. This is a fundamental principle of delegation."
      },
      {
        question: "Which of the Five Rights of Delegation ensures the delegate has proper training?",
        options: ["Right Task", "Right Circumstance", "Right Person", "Right Supervision"],
        correct: 2,
        rationale: "Right Person ensures that the delegate has the appropriate education, training, skill competency, and legal scope of practice to perform the delegated task safely."
      }
    ],
    postTest: [
      {
        question: "An RN delegates vital signs on a post-operative patient to a UAP. The UAP reports BP 80/50. The nurse should:",
        options: ["Ask the UAP to recheck in 30 minutes", "Immediately assess the patient personally", "Tell the UAP to increase the IV rate", "Document the finding and continue with other tasks"],
        correct: 1,
        rationale: "An abnormal vital sign requires immediate RN assessment. The nurse must personally evaluate the patient, correlate the vital signs with clinical presentation, and intervene as needed. Increasing IV rate requires a nursing order."
      },
      {
        question: "Which patient assignment is MOST appropriate for an RPN/LPN?",
        options: ["Patient in acute respiratory distress requiring intubation", "Stable post-op patient requiring routine wound care and oral medications", "Patient receiving initial chemotherapy infusion", "Newly admitted patient requiring comprehensive assessment"],
        correct: 1,
        rationale: "An RPN/LPN is appropriate for stable patients with predictable outcomes. Wound care and oral medication administration are within RPN/LPN scope. Acute emergencies, initial chemotherapy, and comprehensive assessments require an RN."
      },
      {
        question: "A UAP asks the nurse if they can teach a newly diagnosed diabetic patient about insulin injection. The nurse should:",
        options: ["Allow the UAP to teach since they have experience with diabetes", "Decline - initial patient education is an RN responsibility that cannot be delegated", "Agree if the UAP has received additional training", "Delegate it since the nurse is too busy"],
        correct: 1,
        rationale: "Initial patient education cannot be delegated to a UAP. Education requires clinical knowledge, assessment of learning readiness, and evaluation of understanding - all nursing judgment activities. A UAP may reinforce previously taught concepts under RN direction."
      }
    ],
    quiz: [
      {
        question: "What is the MOST important factor in determining whether a task can be delegated to a UAP?",
        options: ["Whether the UAP wants to do the task", "Whether the patient is stable and the task does not require clinical judgment", "Whether the nurse is busy with other patients", "Whether the charge nurse approves"],
        correct: 1,
        rationale: "The key factors are patient stability and whether the task requires clinical nursing judgment. UAPs can perform tasks that are routine, predictable, and do not require assessment, evaluation, or clinical decision-making."
      }
    ]
  },

  "sbar-escalation": {
    title: "SBAR Escalation: When & How to Escalate",
    cellular: {
      title: "Clinical Deterioration Recognition",
      content: "Failure to rescue - the inability to recognize and respond to clinical deterioration in a timely manner - is a leading cause of preventable hospital deaths. Studies consistently demonstrate that patients who experience cardiac arrest, respiratory failure, or unexpected ICU transfer display warning signs hours before the event. The nurse's ability to recognize these warning signs and communicate effectively with the healthcare team is the critical link between early detection and successful intervention.\n\nSBAR (Situation-Background-Assessment-Recommendation) is the standardized communication framework that structures clinical communication to ensure essential information is conveyed clearly and completely. When escalating a concern about a deteriorating patient, the SBAR format reduces ambiguity, prevents important details from being omitted, and empowers the nurse to make a specific recommendation rather than simply reporting data.\n\nEscalation pathways exist for situations when the initial provider response is inadequate or when the nurse has ongoing concerns despite communication. The chain of command (bedside nurse → charge nurse → nursing supervisor → medical director → chief of staff) provides a structured escalation pathway that nurses are legally and ethically obligated to use when patient safety is at risk. Failure to escalate when a patient is deteriorating can constitute negligence, even if the nurse communicated with one provider who chose not to act."
    },
    riskFactors: [
      "Hesitation to contact physicians due to intimidation or hierarchical culture",
      "Failure to articulate clinical concern clearly and concisely",
      "Presenting data without clinical interpretation or recommendation",
      "Accepting a physician response that does not adequately address the concern",
      "Failure to use the chain of command when initial escalation is inadequate",
      "Normalizing abnormal findings or dismissing nursing intuition",
      "Delayed escalation due to 'wanting to collect more data first'",
      "Poor documentation of escalation attempts and provider responses"
    ],
    diagnostics: [
      "Monitor for early warning signs: increasing heart rate trend, rising respiratory rate, subtle mental status changes",
      "Calculate Early Warning Scores (NEWS2, MEWS) to quantify deterioration objectively",
      "Assess for new-onset symptoms that were not present during previous assessment",
      "Compare current status to expected clinical trajectory for the patient's condition",
      "Review recent medication administration for potential adverse effects",
      "Assess for signs of systemic deterioration: new confusion, decreased urine output, cool extremities"
    ],
    management: [
      "Formulate SBAR communication before making the call - be organized and concise",
      "State the situation and your level of concern clearly at the beginning of the conversation",
      "Provide your clinical assessment, not just raw data - tell the provider what you think is happening",
      "Make a specific recommendation - 'I think the patient needs X' is more effective than 'What would you like me to do?'",
      "If the provider's response does not address your concern, respectfully advocate and escalate",
      "Document every communication including: time, provider name, information shared, response, and orders received"
    ],
    nursingActions: [
      "Prepare before calling: have vital signs, assessment data, relevant labs, current medications, and allergies ready",
      "S: 'This is [name], RN on [unit]. I am calling about [patient] in room [X]. The situation is [specific concern].'",
      "B: 'The patient was admitted for [diagnosis]. Relevant history includes [PMH]. Current treatment is [medications/interventions].'",
      "A: 'I have assessed the patient. My concern is [clinical judgment]. I believe this may be [suspected problem].'",
      "R: 'I would like you to [specific action]. Would you like me to [specific intervention] in the meantime?'",
      "If inadequate response: 'I remain concerned about this patient's safety. I need to escalate this through the chain of command.'"
    ],
    signs: {
      left: [
        "ESCALATE IMMEDIATELY: Acute airway compromise or respiratory distress",
        "ESCALATE IMMEDIATELY: New-onset chest pain with ECG changes",
        "ESCALATE IMMEDIATELY: Signs of sepsis (fever, tachycardia, hypotension, altered mental status)",
        "ESCALATE IMMEDIATELY: Active hemorrhage or hemodynamic instability"
      ],
      right: [
        "ESCALATE PROMPTLY: Vital sign trends worsening over 2-3 assessments",
        "ESCALATE PROMPTLY: New neurological deficits or declining GCS",
        "ESCALATE PROMPTLY: Increasing pain unresponsive to current management",
        "USE CHAIN OF COMMAND: When initial provider response is inadequate for the clinical situation"
      ]
    },
    medications: [
      {
        name: "Chain of Command Escalation",
        type: "Patient Safety Protocol",
        action: "Structured pathway for escalating clinical concerns when initial communication is inadequate",
        sideEffects: "May create interpersonal tension but is ethically and legally required",
        contra: "Never allow fear of conflict to prevent escalation when patient safety is at risk",
        pearl: "The chain of command exists to protect patients. Using it is not 'going over someone's head' - it is fulfilling your professional obligation as a patient advocate."
      }
    ],
    pearls: [
      "If you are worried enough to consider escalating, escalate. Trust your clinical judgment.",
      "Always include your ASSESSMENT in SBAR - the provider needs your clinical interpretation, not just numbers",
      "Document every provider communication: time, name, what was discussed, response received, and orders given",
      "Using the chain of command is a professional obligation when patient safety is at risk - never let hierarchy prevent escalation"
    ],
    preTest: [
      {
        question: "A nurse calls a physician about a deteriorating patient but the physician says 'just continue monitoring.' The nurse remains concerned. The next step is:",
        options: ["Follow the physician's order and continue monitoring", "Escalate through the chain of command to the charge nurse or supervisor", "Document and go home at end of shift", "Call the patient's family for advice"],
        correct: 1,
        rationale: "When the initial provider response does not adequately address the nurse's clinical concern, the nurse is obligated to escalate through the chain of command. Patient advocacy requires persistent escalation."
      },
      {
        question: "Which SBAR component conveys the nurse's clinical judgment?",
        options: ["Situation", "Background", "Assessment", "Recommendation"],
        correct: 2,
        rationale: "Assessment is where the nurse provides their clinical interpretation of what is happening. This is the most important component because it conveys clinical reasoning, not just raw data."
      },
      {
        question: "Early warning signs of clinical deterioration include:",
        options: ["Stable vital signs for 24 hours", "Subtle increase in heart rate and respiratory rate over several hours", "Patient sleeping comfortably", "Normal urine output"],
        correct: 1,
        rationale: "A trending increase in heart rate and respiratory rate, even when individual values are still within 'normal' ranges, is an early warning sign of compensatory response to clinical deterioration."
      }
    ],
    postTest: [
      {
        question: "A patient's condition worsens despite two calls to the physician. The nurse has escalated to the charge nurse with no improvement. The next step is:",
        options: ["Accept the situation and document carefully", "Contact the nursing supervisor to continue chain of command escalation", "Call the patient's family", "Wait until the next shift to reassess"],
        correct: 1,
        rationale: "The chain of command continues: bedside nurse → charge nurse → nursing supervisor → medical director → chief of staff. Each level must be pursued when the patient's safety remains at risk."
      },
      {
        question: "When preparing an SBAR communication, the nurse should gather which information BEFORE calling?",
        options: ["Only the most recent vital signs", "Vital signs, assessment findings, relevant labs, current medications, allergies, and code status", "The patient's insurance information", "Only the information the physician specifically asks for"],
        correct: 1,
        rationale: "Being prepared with comprehensive data before calling demonstrates professionalism and ensures the provider has all necessary information to make a decision. Having data ready prevents delays in communication."
      },
      {
        question: "What is the nurse's ethical obligation when a physician provides an order the nurse believes is unsafe?",
        options: ["Follow the order because the physician has more authority", "Question the order and refuse to implement if it remains unsafe after clarification", "Implement the order but document disagreement", "Ask another nurse to carry out the order instead"],
        correct: 1,
        rationale: "Nurses have an ethical and legal obligation to question orders they believe are unsafe. If clarification does not resolve the concern, the nurse should refuse the order and escalate through the chain of command."
      }
    ],
    quiz: [
      {
        question: "What is the most common reason nurses fail to escalate concerns about deteriorating patients?",
        options: ["Lack of assessment skills", "Hierarchical culture and fear of appearing incompetent", "Patients deteriorate too quickly to call", "There is no escalation pathway available"],
        correct: 1,
        rationale: "Research consistently identifies hierarchical culture, intimidation, and fear of 'bothering' physicians as the primary barriers to escalation. SBAR and chain of command protocols exist specifically to overcome these barriers."
      }
    ]
  },

  "post-op-prioritization": {
    title: "Post-Op Complications: Prioritization",
    cellular: {
      title: "Temporal Framework for Post-Operative",
      content: "Post-operative complications follow a predictable temporal pattern that guides nursing assessment priorities. Understanding WHEN complications are most likely to occur allows the nurse to focus assessments on the highest-risk complications for each post-operative timeframe. Failure to recognize early complications can result in rapid deterioration, reoperation, prolonged hospitalization, or death.\n\nImmediate post-operative complications (0-24 hours) are primarily related to the effects of anesthesia and the surgical procedure itself. Airway compromise from residual anesthesia, hemorrhage from surgical site bleeding, and hemodynamic instability from fluid shifts are the primary threats during this period. The nurse must assess ABCs frequently, monitor for active bleeding (surgical site, drains, vital sign trends), and ensure adequate pain management without respiratory depression.\n\nEarly post-operative complications (24-72 hours) include atelectasis (the most common complication), deep vein thrombosis (DVT) development, paralytic ileus, urinary retention, and surgical site infection onset. The shift from immediate to early complications requires a change in assessment focus from anesthesia recovery to systemic complications of immobility, inflammation, and surgical stress.\n\nLate post-operative complications (72 hours to weeks) include wound dehiscence, evisceration, pulmonary embolism (typically days 5-7), pneumonia, and delayed surgical site infections. These complications often develop insidiously and require vigilant ongoing assessment even as the patient appears to be improving."
    },
    riskFactors: [
      "Advanced age (decreased physiological reserve and healing capacity)",
      "Obesity (increased risk of wound complications, DVT, and respiratory issues)",
      "Smoking history (impaired wound healing, increased respiratory complications)",
      "Diabetes mellitus (delayed healing, increased infection risk)",
      "Immunosuppression (chemotherapy, steroids, HIV)",
      "Prolonged surgical time (increased risk of all complications)",
      "Emergency surgery (limited pre-operative optimization)",
      "History of DVT or coagulopathy"
    ],
    diagnostics: [
      "Immediate (0-24h): Vital signs every 15 min × 4, then every 30 min × 2, then every hour × 4",
      "Immediate: Assess airway patency, respiratory rate and depth, oxygen saturation continuously",
      "Immediate: Monitor surgical site and drains for output (color, amount, consistency)",
      "Early (24-72h): Auscultate lung sounds every shift - assess for atelectasis (diminished breath sounds at bases)",
      "Early: Assess for DVT signs (calf pain, warmth, swelling, positive Homans sign)",
      "Late (72h+): Assess wound for dehiscence (separation), evisceration (organ protrusion), and infection signs"
    ],
    management: [
      "Immediate: Maintain airway, monitor for hemorrhage, manage pain while preventing respiratory depression",
      "Early: Incentive spirometry every 1-2 hours while awake, early ambulation, DVT prophylaxis as ordered",
      "Early: Monitor for return of bowel function (bowel sounds, flatus) before advancing diet",
      "Late: Assess wound healing, monitor for signs of infection (redness, warmth, drainage, fever)",
      "Late: Continue DVT prophylaxis and encourage mobility throughout hospitalization",
      "All phases: Strict I&O monitoring, adequate nutrition, pain management, and fall prevention"
    ],
    nursingActions: [
      "Priority assessment for IMMEDIATE post-op: Airway → Breathing → Circulation → Surgical site → Pain",
      "Report active bleeding: increasing drain output, saturated dressings, tachycardia, hypotension",
      "Report respiratory depression: RR < 10, SpO2 < 92%, excessive sedation (Ramsay > 4)",
      "Enforce incentive spirometry: 10 breaths every 1-2 hours while awake to prevent atelectasis",
      "Report signs of wound dehiscence/evisceration: if evisceration occurs, cover with sterile saline-moistened gauze, position supine with knees bent, notify surgeon STAT",
      "Report signs of PE: sudden dyspnea, chest pain, tachycardia, hypoxemia (typically post-op days 5-7)"
    ],
    signs: {
      left: [
        "IMMEDIATE (0-24h): Airway obstruction, hemorrhage, anesthesia complications",
        "IMMEDIATE: Malignant hyperthermia (rapid temp rise, muscle rigidity, tachycardia)",
        "EARLY (24-72h): Atelectasis (#1 most common complication), paralytic ileus",
        "EARLY: Urinary retention, DVT formation, early wound infection"
      ],
      right: [
        "LATE (72h+): Wound dehiscence and evisceration (often with coughing/straining)",
        "LATE: Pulmonary embolism (typically days 5-7 post-op)",
        "LATE: Pneumonia (from immobility and poor pulmonary toilet)",
        "LATE: Deep surgical site infection (fever, increasing WBC, purulent drainage)"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "DVT prophylaxis by inhibiting Factor Xa in the coagulation cascade",
        sideEffects: "Bleeding, injection site bruising, thrombocytopenia",
        contra: "Active bleeding, severe thrombocytopenia, epidural catheter in place",
        pearl: "Administer SubQ in the abdomen, alternating sides. DO NOT rub the injection site. Hold if platelet count < 100,000. Check for epidural catheter before administering - risk of spinal hematoma."
      }
    ],
    pearls: [
      "Atelectasis is the #1 most common post-op complication - incentive spirometry and early ambulation are the best prevention",
      "Post-op fever timeline: Wind (atelectasis, day 1-2), Water (UTI, day 3-5), Wound (infection, day 5-7), Walking (DVT/PE, day 5-7), Wonder drugs (drug fever, any time)",
      "If a wound eviscerates: do NOT push organs back in. Cover with sterile saline-soaked gauze, position supine with knees bent, NPO, call surgeon STAT",
      "Post-op day 5-7 is the highest risk period for pulmonary embolism from DVT dislodgment"
    ],
    preTest: [
      {
        question: "What is the MOST common post-operative complication?",
        options: ["Hemorrhage", "Pulmonary embolism", "Atelectasis", "Wound infection"],
        correct: 2,
        rationale: "Atelectasis is the most common post-operative complication, occurring in up to 90% of surgical patients. It results from shallow breathing, pain-limited inspiratory effort, and immobility. Prevention includes incentive spirometry and early ambulation."
      },
      {
        question: "A patient is post-op day 1 and develops a low-grade fever of 38.1°C. The most likely cause is:",
        options: ["Wound infection", "Urinary tract infection", "Atelectasis", "Pulmonary embolism"],
        correct: 2,
        rationale: "Low-grade fever on post-op day 1-2 is most commonly caused by atelectasis ('Wind' in the post-op fever mnemonic). Wound infections typically present on days 5-7."
      },
      {
        question: "When does pulmonary embolism most commonly occur in post-operative patients?",
        options: ["Within the first 6 hours", "Post-op day 1", "Post-op days 5-7", "After 2 weeks"],
        correct: 2,
        rationale: "Pulmonary embolism most commonly occurs on post-op days 5-7 when DVTs formed during the period of immobility dislodge as the patient begins increasing activity."
      }
    ],
    postTest: [
      {
        question: "A post-op patient suddenly has bowel protruding through their abdominal incision. Immediate nursing actions include:",
        options: ["Push the bowel back in and apply a sterile dressing", "Cover with sterile saline-moistened gauze, position supine with knees bent, call surgeon STAT", "Apply dry sterile gauze and send the patient back to the OR", "Apply an abdominal binder tightly and monitor"],
        correct: 1,
        rationale: "Evisceration is a surgical emergency. Cover exposed organs with sterile saline-moistened gauze to prevent desiccation, position supine with knees bent to reduce abdominal tension, keep patient NPO, and notify the surgeon immediately."
      },
      {
        question: "Post-op day 6, a patient develops sudden dyspnea, chest pain, and tachycardia. Priority action:",
        options: ["Encourage deep breathing exercises", "Apply oxygen, elevate HOB, notify physician STAT (suspect PE)", "Administer PRN anxiety medication", "Increase IV fluid rate"],
        correct: 1,
        rationale: "Sudden dyspnea, chest pain, and tachycardia on post-op day 5-7 is highly suspicious for pulmonary embolism. Immediate actions: oxygen, high-Fowler's position, notify provider for anticoagulation and diagnostic imaging."
      },
      {
        question: "The post-op fever mnemonic 'Wind, Water, Wound, Walking, Wonder drugs' corresponds to which timeline?",
        options: ["All occur on day 1", "Wind (day 1-2), Water (day 3-5), Wound (day 5-7), Walking (day 5-7), Wonder drugs (anytime)", "All occur after day 7", "They occur in reverse order"],
        correct: 1,
        rationale: "This mnemonic helps identify the most likely cause of post-op fever by timeline: Wind (atelectasis, days 1-2), Water (UTI, days 3-5), Wound (infection, days 5-7), Walking (DVT/PE, days 5-7), Wonder drugs (drug fever, anytime)."
      }
    ],
    quiz: [
      {
        question: "What is the priority nursing assessment in the IMMEDIATE post-operative period?",
        options: ["Pain level", "Wound appearance", "Airway patency and respiratory status", "Urine output"],
        correct: 2,
        rationale: "Airway and breathing are always the first priority (ABCs). In the immediate post-op period, residual anesthesia effects can compromise the airway and respiratory drive. All other assessments are secondary."
      }
    ]
  }
};
