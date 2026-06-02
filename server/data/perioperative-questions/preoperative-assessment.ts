import type { PerioperativeQuestion } from "./types";

export const preoperativeAssessmentQuestions: PerioperativeQuestion[] = [
  {
    stem: "A 68-year-old male with a history of type 2 diabetes mellitus and hypertension is scheduled for a total knee arthroplasty. During the preoperative assessment, the nurse notes his HbA1c is 9.2% and fasting blood glucose is 245 mg/dL. What is the most appropriate nursing action?",
    options: [
      "Proceed with the surgical schedule as planned since the surgeon has already approved the case",
      "Notify the surgeon and anesthesiologist of the elevated glucose levels and advocate for optimization before elective surgery",
      "Administer sliding scale insulin immediately to normalize the blood glucose",
      "Document the findings and instruct the patient to take his regular diabetes medications on the morning of surgery"
    ],
    correctAnswer: 1,
    rationaleLong: "Poorly controlled diabetes mellitus, indicated by an HbA1c greater than 8% and elevated fasting glucose, significantly increases the risk of surgical site infections (SSIs), poor wound healing, and perioperative complications including cardiovascular events. The American Diabetes Association and Society for Ambulatory Anesthesia recommend optimizing glycemic control before elective procedures. An HbA1c of 9.2% suggests chronic poor glucose management over the preceding 2-3 months. The perioperative nurse has a professional obligation to advocate for patient safety by communicating these concerning laboratory values to the surgical and anesthesia teams. While the decision to proceed or delay surgery ultimately rests with the surgeon and anesthesiologist, the nurse's role in identifying and communicating risk factors is essential. Studies have demonstrated that patients with HbA1c above 8% have a 2-3 fold increased risk of SSI following orthopedic procedures. Optimizing glucose control for 2-4 weeks before elective surgery can significantly reduce complication rates. Simply proceeding without communication, administering insulin without orders, or relying on the patient's home medication regimen does not address the underlying concern or fulfill the nurse's advocacy role.",
    learningObjective: "Identify elevated preoperative glucose as a modifiable risk factor and advocate for glycemic optimization before elective surgery",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "risk assessment",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "HbA1c reflects 2-3 month glucose average, not just day-of-surgery values. An isolated fasting glucose may be managed, but HbA1c of 9.2% indicates chronic poor control requiring optimization.",
    clinicalPearls: [
      "HbA1c >8% is associated with 2-3x increased SSI risk in orthopedic surgery",
      "Elective surgery should generally be delayed for glycemic optimization when HbA1c exceeds 8-8.5%",
      "The perioperative nurse is responsible for identifying and communicating preoperative risk factors"
    ],
    safetyNote: "Always verify and communicate abnormal preoperative lab values to the surgical team before elective procedures proceed",
    distractorRationales: [
      "Proceeding without communication violates the nurse's advocacy responsibility and ignores a significant modifiable risk factor",
      "Administering insulin without physician orders is outside the perioperative nurse's scope unless covered by a specific protocol",
      "Home medication management alone is insufficient when chronic glucose control is this poor"
    ]
  },
  {
    stem: "During a preoperative interview, a 45-year-old female scheduled for laparoscopic cholecystectomy reports taking herbal supplements including St. John's Wort, ginkgo biloba, and garlic capsules daily. Which supplement poses the greatest concern for intraoperative bleeding?",
    options: [
      "St. John's Wort due to its interaction with anesthetic agents",
      "Ginkgo biloba due to its antiplatelet properties and inhibition of platelet-activating factor",
      "Garlic capsules due to their antihypertensive effects",
      "All three supplements pose equal bleeding risk and should be discontinued simultaneously"
    ],
    correctAnswer: 1,
    rationaleLong: "Ginkgo biloba poses the most significant concern for intraoperative bleeding among these supplements due to its potent antiplatelet properties. Ginkgo biloba contains ginkgolides, particularly ginkgolide B, which is a potent inhibitor of platelet-activating factor (PAF). PAF is a phospholipid mediator involved in platelet aggregation, and its inhibition can significantly impair hemostasis. Multiple case reports have documented spontaneous bleeding events, including subdural hematomas and hyphema, associated with ginkgo biloba use. The American Society of Anesthesiologists recommends discontinuing ginkgo biloba at least 36 hours before surgery, though many practitioners recommend 7-14 days. While garlic does have mild antiplatelet effects through inhibition of thromboxane synthesis and St. John's Wort primarily causes drug interactions through CYP450 enzyme induction (particularly affecting anesthetic drug metabolism, warfarin, and oral contraceptives), ginkgo biloba's direct inhibition of PAF makes it the most clinically significant bleeding risk. The perioperative nurse must systematically assess herbal supplement use during the preoperative interview, as many patients do not consider supplements to be 'medications' and may not voluntarily disclose them. A thorough medication reconciliation including herbal products, vitamins, and over-the-counter medications is essential for perioperative safety.",
    learningObjective: "Identify herbal supplements with antiplatelet or anticoagulant properties that increase perioperative bleeding risk",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "medication reconciliation",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "St. John's Wort is primarily a CYP450 enzyme inducer causing drug interactions, not a bleeding risk. Garlic has mild antiplatelet effects but ginkgo biloba is the strongest.",
    clinicalPearls: [
      "Ginkgo biloba inhibits platelet-activating factor (PAF), significantly impairing hemostasis",
      "Discontinue ginkgo biloba at least 36 hours (ideally 7-14 days) before surgery",
      "Many patients do not consider herbal supplements as medications — always ask specifically"
    ],
    safetyNote: "Always conduct a thorough medication reconciliation that specifically asks about herbal supplements, vitamins, and over-the-counter products",
    distractorRationales: [
      "St. John's Wort primarily causes drug interactions via CYP450 induction, not direct bleeding risk",
      "Garlic has mild antiplatelet properties but is less potent than ginkgo biloba's PAF inhibition",
      "While all three warrant assessment, they do not pose equal bleeding risk"
    ]
  },
  {
    stem: "A patient scheduled for a right total hip arthroplasty is classified as ASA Physical Status III. Which patient profile best represents this classification?",
    options: [
      "A healthy 35-year-old with no medical history presenting for elective surgery",
      "A 70-year-old with well-controlled hypertension on a single medication",
      "A 62-year-old with poorly controlled diabetes, coronary artery disease with stable angina, and BMI of 38",
      "A 55-year-old with end-stage renal disease on hemodialysis and recent myocardial infarction within the past 30 days"
    ],
    correctAnswer: 2,
    rationaleLong: "The ASA Physical Status Classification System is a widely used framework for assessing a patient's pre-anesthesia medical comorbidities. ASA III is defined as a patient with severe systemic disease that is not incapacitating. Examples include poorly controlled diabetes mellitus, morbid obesity (BMI over 35-40), stable coronary artery disease with angina, moderate chronic obstructive pulmonary disease, and compensated heart failure. The patient described in option C has multiple severe but compensated conditions: poorly controlled diabetes (not end-stage), coronary artery disease with stable angina (not acute or unstable), and morbid obesity. These conditions impose substantive functional limitations and increase perioperative risk but are not immediately life-threatening. ASA I represents a normal healthy patient. ASA II represents a patient with mild systemic disease (such as well-controlled hypertension). ASA IV represents a patient with severe systemic disease that is a constant threat to life (such as end-stage renal disease with recent MI). ASA V represents a moribund patient not expected to survive without the operation. The ASA classification is important because it helps the anesthesia team plan the anesthetic approach, monitors needed, and postoperative disposition. It also serves as a predictor of perioperative morbidity and mortality. The perioperative nurse should understand these classifications to anticipate the level of care each patient will require.",
    learningObjective: "Correctly classify patients using the ASA Physical Status Classification System",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "ASA classification",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "ASA III is severe systemic disease, NOT life-threatening. Recent MI within 30 days would elevate to ASA IV.",
    clinicalPearls: [
      "ASA I: healthy; ASA II: mild systemic disease; ASA III: severe systemic disease; ASA IV: life-threatening; ASA V: moribund",
      "ASA classification is assigned by the anesthesiologist but perioperative nurses should understand the implications",
      "ASA classification correlates with perioperative morbidity and mortality risk"
    ],
    safetyNote: "ASA classification guides the level of monitoring and resources required — higher classifications demand more intensive perioperative care",
    distractorRationales: [
      "A healthy 35-year-old with no medical history is ASA I, not ASA III",
      "Well-controlled hypertension on a single medication is ASA II (mild systemic disease)",
      "ESRD on hemodialysis with recent MI suggests ASA IV (severe life-threatening disease)"
    ]
  },
  {
    stem: "During the preoperative holding area, a circulating nurse is verifying informed consent for a left inguinal hernia repair. The patient states, 'I signed the form but I'm not really sure what they're going to do.' What is the nurse's most appropriate response?",
    options: [
      "Reassure the patient that the surgeon will explain everything in the operating room",
      "Explain the surgical procedure in detail, including risks and alternatives, to obtain informed consent",
      "Notify the surgeon that the patient does not demonstrate understanding of the procedure and that informed consent may not be adequate",
      "Have the patient sign a new consent form after providing a brief description of the procedure"
    ],
    correctAnswer: 2,
    rationaleLong: "Informed consent is a legal and ethical process that requires the patient to have adequate understanding of the proposed procedure, its risks, benefits, alternatives, and the consequences of refusing treatment. The physician or surgeon who will perform the procedure is responsible for obtaining informed consent, including providing the patient with this information. The nurse's role is to witness the consent, verify that the patient's signature is on the form, and assess whether the patient appears to understand what they have consented to. When a patient verbalizes lack of understanding about the procedure, this is a red flag that informed consent may not be truly 'informed.' The nurse should not explain the procedure's risks and alternatives because this is outside the nursing scope for informed consent — this is the surgeon's responsibility. Instead, the nurse should advocate for the patient by notifying the surgeon that the patient needs additional explanation before proceeding. Proceeding with a case when the patient does not understand the procedure violates the principle of patient autonomy and may expose the facility and provider to legal liability. The nurse serves as a patient advocate in this situation, ensuring the patient's right to make an informed decision about their care.",
    learningObjective: "Understand the perioperative nurse's role in the informed consent process and appropriate action when consent adequacy is questioned",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "informed consent",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The nurse witnesses informed consent but does not obtain it — explaining the procedure's risks and alternatives is the surgeon's responsibility.",
    clinicalPearls: [
      "The surgeon obtains informed consent; the nurse verifies documentation and witnesses the patient's understanding",
      "If a patient expresses lack of understanding, the nurse must notify the surgeon before proceeding",
      "Informed consent requires understanding of procedure, risks, benefits, alternatives, and right to refuse"
    ],
    safetyNote: "Never proceed to the operating room when a patient verbalizes they do not understand the planned procedure",
    distractorRationales: [
      "Deferring explanation until the operating room does not ensure informed consent is obtained preoperatively",
      "The nurse explaining risks and alternatives exceeds the nursing role in informed consent — this is the surgeon's responsibility",
      "Having the patient sign a new form without the surgeon providing additional information does not address the fundamental issue"
    ]
  },
  {
    stem: "A preoperative nurse is reviewing the medication list of a patient scheduled for a carotid endarterectomy tomorrow morning. The patient takes warfarin 5 mg daily, metoprolol 50 mg twice daily, lisinopril 10 mg daily, and aspirin 81 mg daily. The INR today is 2.8. Which medication management concern should the nurse prioritize communicating to the surgical team?",
    options: [
      "The metoprolol should be held on the morning of surgery to prevent intraoperative hypotension",
      "The elevated INR of 2.8 indicates warfarin needs to be bridged or reversed before the procedure can safely proceed",
      "The lisinopril should be continued through the morning of surgery to maintain blood pressure control",
      "The aspirin should be discontinued immediately due to bleeding risk during vascular surgery"
    ],
    correctAnswer: 1,
    rationaleLong: "An INR of 2.8 in a patient on warfarin who is scheduled for a carotid endarterectomy presents a significant perioperative bleeding risk. The therapeutic INR range for most indications is 2.0-3.0, but for surgical procedures, particularly vascular surgery where precise hemostasis is critical, the INR should typically be less than 1.5 before proceeding. A carotid endarterectomy involves dissection near major cervical blood vessels, and uncontrolled bleeding in this area can lead to airway compromise, hematoma formation with potential tracheal deviation, and life-threatening complications. The nurse should prioritize communicating the elevated INR to the surgical team so they can determine the appropriate management, which may include holding warfarin for several days, administering vitamin K, or providing fresh frozen plasma or prothrombin complex concentrate depending on the urgency of the procedure. Regarding the other medications: beta-blockers like metoprolol should generally be continued perioperatively to prevent rebound tachycardia and hypertension. ACE inhibitors like lisinopril are often held on the morning of surgery due to the risk of refractory hypotension under anesthesia. Aspirin management in carotid endarterectomy varies, but many vascular surgeons prefer to continue aspirin through surgery to reduce the risk of perioperative stroke, as the antiplatelet benefit may outweigh the bleeding risk.",
    learningObjective: "Identify and communicate critical anticoagulation concerns in the preoperative setting for vascular surgery patients",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "medication management",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Beta-blockers should generally be CONTINUED perioperatively — abrupt discontinuation causes rebound tachycardia. ACE inhibitors are often HELD on morning of surgery.",
    clinicalPearls: [
      "INR should generally be <1.5 for most surgical procedures; elevated INR requires reversal or delay",
      "Beta-blockers are continued perioperatively to prevent rebound tachycardia and cardiovascular events",
      "Aspirin is often continued through carotid surgery to reduce perioperative stroke risk"
    ],
    safetyNote: "Always verify INR and coagulation status for patients on anticoagulants before surgical procedures — elevated INR in vascular surgery risks life-threatening hemorrhage",
    distractorRationales: [
      "Holding beta-blockers perioperatively can cause dangerous rebound tachycardia and is generally not recommended",
      "ACE inhibitors are typically held, not continued, on the morning of surgery due to hypotension risk under anesthesia",
      "Aspirin is often continued in carotid endarterectomy to reduce stroke risk"
    ]
  },
  {
    stem: "A 42-year-old patient is scheduled for a laparoscopic appendectomy. During the preoperative assessment, the patient reports eating a hamburger and drinking a milkshake 4 hours ago. According to ASA fasting guidelines, what is the appropriate nursing action?",
    options: [
      "Proceed with surgery since 4 hours is sufficient fasting time for all food and liquids",
      "Notify the anesthesiologist that the patient does not meet NPO guidelines for solids, as a minimum of 6-8 hours fasting from fatty foods is required",
      "Administer metoclopramide and proceed with surgery in 2 more hours",
      "Cancel the surgery and reschedule for the next day to ensure complete gastric emptying"
    ],
    correctAnswer: 1,
    rationaleLong: "The ASA Practice Guidelines for Preoperative Fasting recommend specific fasting intervals based on the type of intake to reduce the risk of pulmonary aspiration during anesthesia. For clear liquids, the minimum fasting period is 2 hours. For breast milk, it is 4 hours. For infant formula, nonhuman milk, and light meals (such as toast and clear liquids), the minimum is 6 hours. For meals containing fried or fatty foods or meat, the fasting interval should be 8 hours or more, as these foods have significantly prolonged gastric emptying times. A hamburger and milkshake constitute a heavy, fatty meal that would require at least 8 hours of fasting before elective anesthesia. At only 4 hours post-meal, this patient is at elevated risk for aspiration of gastric contents under anesthesia. The nurse should notify the anesthesiologist of this finding so they can determine whether to delay the case, proceed with aspiration precautions (rapid sequence induction), or take other measures based on the clinical urgency. For an appendectomy, the urgency depends on the clinical presentation — if the appendicitis is uncomplicated, a brief delay may be appropriate, but if there are signs of perforation or sepsis, the anesthesiologist may elect to proceed with modified technique. The decision is not the nurse's to make, but communication of the fasting violation is essential.",
    learningObjective: "Apply ASA preoperative fasting guidelines based on type and timing of oral intake",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "NPO guidelines",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Fasting times differ by intake type: clear liquids 2 hrs, breast milk 4 hrs, light meal 6 hrs, fatty/fried foods 8+ hrs. A hamburger and milkshake is a heavy fatty meal requiring 8 hours.",
    clinicalPearls: [
      "ASA fasting guidelines: clear liquids 2 hrs, breast milk 4 hrs, light meal 6 hrs, heavy/fatty meal 8+ hrs",
      "Fatty foods significantly delay gastric emptying compared to simple carbohydrates",
      "The anesthesiologist makes the final decision on whether to proceed, delay, or modify the anesthetic technique"
    ],
    safetyNote: "Pulmonary aspiration of gastric contents is a leading cause of anesthesia-related morbidity and mortality — always verify NPO status",
    distractorRationales: [
      "Four hours is sufficient for clear liquids and breast milk but not for solid foods, especially fatty meals",
      "Administering a prokinetic agent does not guarantee adequate gastric emptying and is not a substitute for proper fasting",
      "Cancellation may be excessive — the anesthesiologist should determine the appropriate course of action based on clinical urgency"
    ]
  },
  {
    stem: "A preoperative nurse is assessing a 55-year-old male scheduled for elective lumbar laminectomy. He has a BMI of 32, Mallampati score of IV, neck circumference of 48 cm, and reports using a CPAP machine at night for obstructive sleep apnea. Which preoperative finding is MOST critical to communicate to the anesthesia team?",
    options: [
      "The BMI of 32 indicating class I obesity",
      "The Mallampati IV score suggesting potential difficult airway management",
      "The neck circumference of 48 cm",
      "The obstructive sleep apnea diagnosis requiring CPAP"
    ],
    correctAnswer: 1,
    rationaleLong: "While all four findings are relevant to the anesthetic plan, the Mallampati IV score is the most critical finding to communicate to the anesthesia team because it is the strongest individual predictor of a potentially difficult airway. The Mallampati classification system assesses the visibility of pharyngeal structures with the mouth open and tongue protruded: Class I shows the soft palate, fauces, uvula, and pillars; Class II shows the soft palate, fauces, and uvula; Class III shows the soft palate and base of uvula; and Class IV shows only the hard palate. A Mallampati IV score means that only the hard palate is visible, indicating severely limited oropharyngeal space and a high probability of difficult direct laryngoscopy and intubation. This finding demands advance preparation of difficult airway equipment, backup airway plans, and potentially awake fiberoptic intubation. The combination of Mallampati IV with obesity, large neck circumference, and OSA creates a constellation of difficult airway predictors, but the Mallampati IV score alone is sufficient to warrant special airway precautions. The anesthesiologist needs this information to formulate an airway management strategy, position appropriate equipment, and potentially arrange for additional personnel to be available. Failure to communicate difficult airway findings can lead to catastrophic airway events including hypoxic brain injury and death.",
    learningObjective: "Identify Mallampati classification as a critical predictor of difficult airway and communicate findings to the anesthesia team",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "airway assessment",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "While OSA, obesity, and large neck circumference all contribute to airway difficulty, Mallampati IV is the strongest single predictor of difficult intubation.",
    clinicalPearls: [
      "Mallampati IV: only hard palate visible — strongest single predictor of difficult intubation",
      "LEMON mnemonic for difficult airway: Look externally, Evaluate 3-3-2 rule, Mallampati, Obstruction, Neck mobility",
      "Multiple difficult airway predictors compound the risk — communicate ALL findings"
    ],
    safetyNote: "Always communicate difficult airway indicators to anesthesia BEFORE the patient enters the operating room to allow adequate preparation",
    distractorRationales: [
      "BMI of 32 is class I obesity and relevant but less specific than Mallampati for airway prediction",
      "Neck circumference of 48 cm suggests possible difficult mask ventilation but is less predictive than Mallampati IV",
      "OSA requiring CPAP is important for postoperative management but Mallampati IV more directly predicts intubation difficulty"
    ]
  },
  {
    stem: "During preoperative verification, the circulating nurse discovers that the patient's history and physical was completed 32 days ago for an elective total shoulder arthroplasty. According to The Joint Commission standards, what action should the nurse take?",
    options: [
      "Proceed with the case since the history and physical is within the acceptable 60-day timeframe",
      "Request that the surgeon or designee perform an updated history and physical before the case proceeds, as TJC requires the H&P within 30 days with a day-of-surgery update",
      "Have the preoperative nurse complete a new history and physical to update the documentation",
      "Contact the patient's primary care physician to fax an updated clearance letter"
    ],
    correctAnswer: 1,
    rationaleLong: "The Joint Commission (TJC) requires that a history and physical examination be completed within 30 days prior to a surgical or anesthesia procedure. Additionally, if the H&P was completed prior to the day of admission or procedure, an updated examination must be performed on the day of surgery to document any changes in the patient's condition since the original assessment. In this case, the H&P was completed 32 days ago, which exceeds the 30-day requirement. The nurse should request that the surgeon or a qualified designee (such as a resident or physician assistant with appropriate privileges) perform a new or updated H&P before the case can proceed. This is not a nursing responsibility — performing a history and physical is within the physician's scope of practice, not the registered nurse's scope. The requirements exist because a patient's medical condition can change significantly over time, and an outdated assessment may miss new medications, diagnoses, or changes in functional status that affect anesthetic and surgical planning. The perioperative nurse serves as the final safety check to verify that all documentation requirements are met before the patient enters the operating room. Proceeding without current documentation violates regulatory standards and potentially compromises patient safety.",
    learningObjective: "Apply TJC requirements for preoperative history and physical documentation timing",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "documentation requirements",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "TJC requires H&P within 30 days, not 60 days. Even if within 30 days, a day-of-surgery update is still required.",
    clinicalPearls: [
      "TJC requires H&P within 30 days of surgery with a day-of-surgery update",
      "The H&P must be performed by a physician or qualified practitioner, not a nurse",
      "The perioperative nurse is the final checkpoint to verify documentation compliance before the case proceeds"
    ],
    safetyNote: "Never allow a patient to enter the operating room without a current, compliant history and physical — this is both a safety and regulatory requirement",
    distractorRationales: [
      "The acceptable timeframe is 30 days, not 60 days per TJC standards",
      "Completing a history and physical is outside the RN scope of practice — this is a physician responsibility",
      "A PCP clearance letter does not substitute for the required surgical H&P"
    ]
  },
  {
    stem: "A patient scheduled for a thyroidectomy reports a family history of malignant hyperthermia in her brother. She has never had general anesthesia. What is the priority preoperative nursing action?",
    options: [
      "Reassure the patient that malignant hyperthermia is rare and unlikely to affect her",
      "Immediately communicate the family history of malignant hyperthermia to the anesthesiologist and verify that dantrolene sodium is available in the operating room",
      "Order a caffeine-halothane contracture test to confirm the patient's susceptibility before scheduling the case",
      "Switch the anesthetic plan to spinal anesthesia to avoid the risk entirely"
    ],
    correctAnswer: 1,
    rationaleLong: "A family history of malignant hyperthermia (MH) is a critical preoperative finding because MH susceptibility is inherited as an autosomal dominant trait with variable penetrance. A first-degree relative (brother) with MH means this patient has approximately a 50% chance of being susceptible. The priority nursing action is to immediately communicate this finding to the anesthesiologist so that appropriate precautions can be implemented. These precautions include: preparing an MH-safe anesthetic plan that avoids all known triggering agents (succinylcholine and volatile inhalation anesthetics such as sevoflurane, desflurane, isoflurane), ensuring dantrolene sodium (at least 36 vials or the equivalent of Ryanodex) is immediately available in the operating room, flushing the anesthesia machine with high-flow oxygen for an extended period (per manufacturer recommendations) to eliminate residual volatile agents, using a clean breathing circuit, and having an MH cart readily accessible. While the caffeine-halothane contracture test (CHCT) is the gold standard for confirming MH susceptibility, it requires a muscle biopsy performed at a specialized center and is not a preoperative test that can be ordered urgently before surgery. The anesthesiologist, not the nurse, determines the anesthetic technique. The nurse's role is to communicate the risk and verify preparedness.",
    learningObjective: "Identify malignant hyperthermia risk factors and implement appropriate preoperative communication and preparation",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "malignant hyperthermia screening",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "MH susceptibility is autosomal dominant — a first-degree relative with MH means ~50% chance of susceptibility. Never dismiss family history as irrelevant.",
    clinicalPearls: [
      "MH is autosomal dominant with variable penetrance — first-degree family history warrants full MH precautions",
      "MH triggering agents: succinylcholine and volatile anesthetics (sevoflurane, desflurane, isoflurane)",
      "CHCT is the gold standard diagnostic test but requires muscle biopsy at a specialized center"
    ],
    safetyNote: "Dantrolene sodium must be immediately available whenever a patient with known or suspected MH susceptibility undergoes general anesthesia",
    distractorRationales: [
      "Dismissing a family history of MH is dangerous — MH has a mortality rate of 70% if untreated",
      "CHCT requires a muscle biopsy at a specialized center and cannot be urgently ordered preoperatively",
      "The choice of anesthetic technique is the anesthesiologist's decision, not the nurse's"
    ]
  },
  {
    stem: "A 78-year-old patient with a history of atrial fibrillation and mechanical aortic valve replacement is on long-term warfarin therapy. She is scheduled for an elective right total hip arthroplasty in 5 days. The surgeon has ordered bridge anticoagulation. Which bridge therapy protocol is most appropriate?",
    options: [
      "Discontinue warfarin 5 days before surgery and begin enoxaparin 1 mg/kg subcutaneously twice daily when INR falls below 2.0, with last dose 24 hours before surgery",
      "Discontinue warfarin 2 days before surgery and administer vitamin K 10 mg IV on the day before surgery",
      "Continue warfarin until the day before surgery and administer fresh frozen plasma in the holding area",
      "Discontinue warfarin 7 days before surgery with no bridge therapy needed for mechanical valve patients"
    ],
    correctAnswer: 0,
    rationaleLong: "Patients with mechanical heart valves, particularly in the aortic position, are at high risk for thromboembolic events if anticoagulation is interrupted. Bridge anticoagulation with low-molecular-weight heparin (LMWH) such as enoxaparin is the standard approach for these high-risk patients when warfarin must be discontinued for surgery. The typical protocol involves discontinuing warfarin 5 days before surgery to allow the INR to naturally decline to a safe surgical range (<1.5). When the INR falls below 2.0 (usually 2-3 days after warfarin discontinuation), therapeutic-dose LMWH is initiated. The last dose of enoxaparin is given 24 hours before surgery to allow adequate clearance and minimize intraoperative bleeding risk. Enoxaparin has an elimination half-life of approximately 4.5-7 hours, so a 24-hour gap provides adequate clearance. Postoperatively, bridge therapy is resumed once hemostasis is established, typically 24-48 hours after surgery, and warfarin is restarted concurrently. The two therapies overlap until the INR reaches the therapeutic range. This protocol balances the risk of thromboembolism (from being without anticoagulation) against the risk of surgical bleeding (from continuing anticoagulation).",
    learningObjective: "Understand bridge anticoagulation protocols for high-risk patients with mechanical heart valves undergoing elective surgery",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "anticoagulation management",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Warfarin is held 5 days before surgery (not 2 or 7), and the last dose of LMWH bridge is 24 hours before surgery, not 12 hours.",
    clinicalPearls: [
      "Mechanical heart valves are high-risk for thromboembolism and require bridge anticoagulation when warfarin is held",
      "Hold warfarin 5 days before surgery; start LMWH when INR <2.0; last LMWH dose 24 hours before surgery",
      "Resume bridge therapy postoperatively when hemostasis is established, typically 24-48 hours after surgery"
    ],
    safetyNote: "Mechanical valve patients are at critical risk for valve thrombosis and stroke if anticoagulation is interrupted without bridging",
    distractorRationales: [
      "Holding warfarin only 2 days is insufficient time for INR to normalize and IV vitamin K may cause rapid complete reversal risking valve thrombosis",
      "Continuing warfarin until the day before and using FFP is not an evidence-based bridge strategy",
      "Mechanical valve patients absolutely require bridge anticoagulation — no bridging is inappropriate for this high-risk population"
    ]
  },
  {
    stem: "A patient with a known latex allergy is scheduled for a laparoscopic nephrectomy. During preoperative planning, which intervention is MOST important to implement?",
    options: [
      "Schedule the patient as the last case of the day to minimize latex exposure",
      "Schedule the patient as the first case of the day to minimize aerosolized latex particles in the operating room",
      "Use powdered latex gloves but double-glove to prevent patient contact",
      "Apply topical diphenhydramine to the patient's skin before draping"
    ],
    correctAnswer: 1,
    rationaleLong: "Patients with documented latex allergies should be scheduled as the first case of the day in the operating room. This is because powdered latex gloves, which may have been used in previous cases, release latex protein particles that become aerosolized and settle on surfaces throughout the operating room. These particles can persist in the air and on surfaces for hours. By scheduling the latex-allergic patient first, the room has had the longest possible time (overnight) without latex exposure, minimizing the presence of aerosolized latex proteins. Additionally, all latex-containing products must be removed from the room and replaced with latex-free alternatives before the patient enters. This includes gloves, urinary catheters, IV tubing injection ports, tourniquets, blood pressure cuff bladders, anesthesia breathing circuits, and wound drains. A 'latex-free' cart should be brought into the room with all necessary supplies. The circulating nurse should place signs on the door indicating a latex-free environment and communicate the allergy to all team members. The anesthesiologist should have emergency medications available (epinephrine, diphenhydramine, corticosteroids) in case of an anaphylactic reaction despite precautions.",
    learningObjective: "Implement appropriate environmental precautions for surgical patients with latex allergies",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "allergy management",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Latex-allergic patients should be FIRST case of the day, not last. Overnight allows maximum clearance of aerosolized latex particles.",
    clinicalPearls: [
      "Schedule latex-allergic patients as the FIRST case of the day for maximum latex particle clearance",
      "Remove ALL latex-containing products from the OR and replace with latex-free alternatives",
      "Powdered latex gloves are the primary source of aerosolized latex proteins"
    ],
    safetyNote: "Latex anaphylaxis can be fatal — meticulous environmental preparation and team communication are essential for latex-allergic patients",
    distractorRationales: [
      "Last case of the day means maximum accumulated aerosolized latex particles — this is the worst scheduling option",
      "Powdered latex gloves are never appropriate for latex-allergic patients regardless of double-gloving",
      "Topical diphenhydramine does not prevent systemic anaphylaxis from inhaled or contact latex exposure"
    ]
  },
  {
    stem: "During the preoperative assessment of a 30-year-old female scheduled for arthroscopic knee surgery, the patient reports she might be pregnant. Her last menstrual period was 6 weeks ago. What is the priority preoperative action?",
    options: [
      "Proceed with surgery since arthroscopic surgery uses minimal anesthesia and is low-risk",
      "Obtain a serum or urine beta-hCG pregnancy test before proceeding with anesthesia and surgery",
      "Ask the patient if she has had any pregnancy symptoms and document her response",
      "Consult with the patient's obstetrician before making any decisions"
    ],
    correctAnswer: 1,
    rationaleLong: "When a patient of childbearing age reports a possible pregnancy or has a missed menstrual period, obtaining a pregnancy test is the priority action before proceeding with anesthesia and surgery. Both general and regional anesthesia, as well as certain medications used perioperatively (including some antibiotics, NSAIDs, and sedatives), can potentially harm a developing embryo or fetus, particularly during the first trimester when organogenesis is occurring. A urine or serum beta-hCG test can quickly and definitively determine pregnancy status. Many institutions have policies requiring pregnancy testing for all females of childbearing age (typically ages 12-55) before any procedure requiring anesthesia, regardless of the patient's report of sexual activity or contraception use. If the test is positive, the case is typically postponed unless it is emergent, and the risks and benefits of proceeding are discussed with the patient and a multidisciplinary team including obstetrics. The ASA and AORN recommend pregnancy testing as part of the preoperative assessment for females of reproductive age. Simply asking about symptoms is insufficient because early pregnancy can be asymptomatic, and the consequences of unknowingly exposing a developing fetus to anesthesia and surgery can be significant.",
    learningObjective: "Implement pregnancy screening protocols for patients of childbearing age in the preoperative setting",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "pregnancy screening",
    difficulty: 1,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "A pregnancy test is required regardless of the type of surgery or anesthesia — even 'low-risk' procedures involve medications that may be teratogenic.",
    clinicalPearls: [
      "All females of childbearing age should have pregnancy testing before procedures requiring anesthesia",
      "First trimester is the highest risk for teratogenic effects of anesthesia and medications",
      "Institutional policies typically require beta-hCG for females ages 12-55"
    ],
    safetyNote: "Never proceed with anesthesia in a patient with suspected pregnancy without a confirmed pregnancy test result",
    distractorRationales: [
      "No surgery is 'low-risk' for a potentially pregnant patient — all anesthesia carries teratogenic risk",
      "Asking about symptoms alone is insufficient — early pregnancy is often asymptomatic",
      "Consulting OB may be needed if positive, but the pregnancy test must come first"
    ]
  },
  {
    stem: "A 72-year-old patient with a history of chronic kidney disease (GFR 28 mL/min) is scheduled for coronary artery bypass grafting. The preoperative nurse notes the patient's last potassium level drawn yesterday was 5.8 mEq/L. What is the priority nursing action?",
    options: [
      "Document the finding and proceed since elevated potassium is expected in CKD patients",
      "Immediately notify the anesthesiologist and surgeon of the critical potassium level and anticipate a delay in surgery until the electrolyte is corrected",
      "Administer oral kayexalate as a standing preoperative order",
      "Recheck the potassium level using a point-of-care device to confirm the result before notifying anyone"
    ],
    correctAnswer: 1,
    rationaleLong: "A potassium level of 5.8 mEq/L is critically elevated and represents an immediate threat during surgery, particularly cardiac surgery. Hyperkalemia increases the risk of life-threatening cardiac dysrhythmias including ventricular fibrillation and asystole, especially under the influence of general anesthesia and during cardiopulmonary bypass. During CABG surgery, the heart is exposed to additional potassium through cardioplegia solution, which could compound an already dangerously elevated serum potassium. The priority nursing action is immediate notification of both the anesthesiologist and surgeon. While confirming a lab value is sometimes appropriate, a potassium of 5.8 mEq/L in a patient with CKD (where hyperkalemia is a chronic issue) is highly likely to be accurate and represents a time-sensitive safety concern. The surgical team needs to know this information immediately to determine whether to proceed, delay, or initiate potassium-lowering interventions before surgery. Treatment options may include IV calcium gluconate for cardiac membrane stabilization, insulin with glucose for intracellular potassium shifting, sodium bicarbonate, inhaled albuterol, or emergent hemodialysis. Simply documenting without communicating, or waiting for a recheck, delays critical intervention. Administering kayexalate without an order is outside the nurse's scope and may not act quickly enough for a surgical case.",
    learningObjective: "Recognize critical electrolyte abnormalities in the preoperative setting and take appropriate urgent action",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "laboratory assessment",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not normalize hyperkalemia just because a patient has CKD — 5.8 mEq/L is dangerous regardless of the underlying cause, especially before cardiac surgery.",
    clinicalPearls: [
      "Potassium >5.5 mEq/L significantly increases risk of cardiac dysrhythmias under general anesthesia",
      "CABG surgery involves additional potassium exposure through cardioplegia solution",
      "CKD patients are prone to hyperkalemia but critical levels still require urgent intervention"
    ],
    safetyNote: "Critical electrolyte values must be communicated immediately to the surgical team — delay can result in intraoperative cardiac arrest",
    distractorRationales: [
      "Documenting without communicating fails the nurse's advocacy responsibility for a life-threatening lab value",
      "Administering kayexalate without an order is outside nursing scope and is too slow-acting for this situation",
      "Rechecking delays notification of a critically elevated value in a clinical context where the result is highly plausible"
    ]
  },
  {
    stem: "A preoperative nurse is completing the surgical safety checklist for a patient undergoing bilateral breast reduction. During the 'Sign In' phase before anesthesia induction, which elements must be verified?",
    options: [
      "Patient identity, surgical site marking, procedure confirmed, known allergies, and anesthesia equipment check",
      "Instrument count, sponge count, specimen labeling, and anticipated blood loss",
      "Surgeon's name, operating room number, scrub team assignments, and equipment preferences",
      "Postoperative pain management plan, expected discharge time, and follow-up appointment date"
    ],
    correctAnswer: 0,
    rationaleLong: "The WHO Surgical Safety Checklist, adopted and required by The Joint Commission, consists of three phases: Sign In (before induction of anesthesia), Time Out (before skin incision), and Sign Out (before the patient leaves the operating room). The Sign In phase occurs in the preoperative area or at the beginning of the case before anesthesia induction and includes verification of: patient identity (using two patient identifiers), correct surgical site marking (visible and confirmed with the patient), procedure name confirmed (matching the consent form, schedule, and patient's understanding), known allergies documented, anticipated difficult airway or aspiration risk reviewed, anesthesia safety check completed (machine, medications, equipment), and pulse oximeter on the patient and functioning. This phase is designed to catch critical errors before the patient is anesthetized and unable to participate in verification. The instrument and sponge counts occur during the Time Out and Sign Out phases. Surgeon preferences, OR assignment, and team assignments are operational details addressed before the case begins but are not part of the formal checklist verification. Postoperative planning elements like pain management and discharge occur during Sign Out or postoperative care planning.",
    learningObjective: "Identify the components of the WHO Surgical Safety Checklist 'Sign In' phase",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "surgical safety checklist",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "The three phases are Sign In (before anesthesia), Time Out (before incision), and Sign Out (before leaving OR). Don't confuse which elements belong to which phase.",
    clinicalPearls: [
      "WHO checklist has 3 phases: Sign In (pre-anesthesia), Time Out (pre-incision), Sign Out (pre-exit)",
      "Sign In includes: patient ID, site marking, procedure, allergies, airway assessment, anesthesia check, pulse oximetry",
      "The patient must be conscious and able to participate in Sign In verification"
    ],
    safetyNote: "The Sign In phase is the last opportunity to involve the conscious patient in verifying their identity, surgical site, and procedure",
    distractorRationales: [
      "Instrument and sponge counts are part of Time Out and Sign Out phases, not Sign In",
      "Surgeon preferences and team assignments are operational items, not formal checklist elements",
      "Postoperative planning occurs during Sign Out or post-procedure, not during Sign In"
    ]
  },
  {
    stem: "A 64-year-old patient with a pacemaker is scheduled for a transurethral resection of the prostate (TURP). During the preoperative assessment, what information about the pacemaker is MOST critical for the perioperative team?",
    options: [
      "The date the pacemaker was last replaced",
      "The pacemaker manufacturer, model, programming mode, and whether the patient is pacemaker-dependent",
      "The cosmetic appearance of the pacemaker pocket site",
      "Whether the patient carries a pacemaker identification card in his wallet"
    ],
    correctAnswer: 1,
    rationaleLong: "For patients with cardiac implantable electronic devices (CIEDs) including pacemakers and implantable cardioverter-defibrillators (ICDs), the most critical preoperative information includes the device manufacturer, model number, current programming mode, indication for placement, and whether the patient is pacemaker-dependent. This information is essential because electrosurgical devices (monopolar electrocautery) used during TURP can generate electromagnetic interference (EMI) that may affect pacemaker function. EMI can cause inappropriate inhibition of pacing (potentially causing asystole in pacemaker-dependent patients), mode switching, inappropriate ICD shocks, or device reprogramming. Knowing whether the patient is pacemaker-dependent is the single most important piece of information because pacemaker-dependent patients (those without an adequate underlying intrinsic cardiac rhythm) are at the highest risk for hemodynamic compromise if EMI inhibits pacing output. For pacemaker-dependent patients, the device may need to be reprogrammed to an asynchronous mode (DOO, VOO, AOO) that is not affected by EMI. A magnet can also be applied to convert most pacemakers to an asynchronous mode, but this requires knowledge of the specific device behavior. The perioperative team also needs to know the device type to plan electrosurgery use, monitor placement, and postoperative interrogation.",
    learningObjective: "Identify critical preoperative information needed for patients with cardiac implantable electronic devices undergoing surgery with electrosurgery",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "cardiac device assessment",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Pacemaker dependency is the single most critical factor — a pacemaker-dependent patient who has pacing inhibited by EMI from electrosurgery can develop asystole.",
    clinicalPearls: [
      "EMI from monopolar electrosurgery can inhibit pacing, cause mode switching, or trigger inappropriate ICD shocks",
      "Pacemaker-dependent patients may require reprogramming to asynchronous mode before surgery",
      "Bipolar electrosurgery generates less EMI than monopolar and may be preferred when feasible"
    ],
    safetyNote: "Ensure pacemaker interrogation is performed and documented preoperatively, with a plan for intraoperative management of the device",
    distractorRationales: [
      "Battery replacement date is less critical than knowing the current programming and dependency status",
      "Cosmetic appearance of the pocket site is irrelevant to safe perioperative management",
      "While a pacemaker ID card can provide useful information, the critical data is the device programming and dependency status"
    ]
  },
  {
    stem: "A preoperative nurse is reviewing the chart of a 50-year-old patient scheduled for a right hemicolectomy. The patient has a documented history of severe anaphylaxis to penicillin. The surgeon has ordered cefazolin 2g IV for surgical prophylaxis. What is the appropriate nursing action?",
    options: [
      "Administer the cefazolin as ordered since cephalosporins are a different class than penicillins",
      "Question the order with the surgeon, as patients with severe penicillin allergy (anaphylaxis) have an increased cross-reactivity risk with first-generation cephalosporins, and recommend an alternative antibiotic",
      "Administer the cefazolin but pretreat with diphenhydramine and methylprednisolone",
      "Substitute amoxicillin-clavulanate as an equivalent alternative without notifying the surgeon"
    ],
    correctAnswer: 1,
    rationaleLong: "Patients with a documented history of severe anaphylaxis to penicillin have an estimated 1-2% cross-reactivity risk with first-generation cephalosporins like cefazolin, compared to less than 0.5% for second and third-generation cephalosporins. While the overall cross-reactivity rate is lower than historically believed (previously cited as 10%), the risk is not zero, and in a patient with a history of anaphylaxis (the most severe form of allergic reaction), even a small risk of repeated anaphylaxis is clinically significant. The perioperative nurse should question the cefazolin order and communicate the concern to the surgeon. The SCIP (Surgical Care Improvement Project) and current SSI prevention guidelines recommend alternative prophylactic antibiotics for patients with severe penicillin allergies, such as clindamycin 900 mg IV or vancomycin 15 mg/kg IV for colorectal procedures. Vancomycin provides gram-positive coverage and is often combined with an aminoglycoside or fluoroquinolone for gram-negative coverage in colorectal surgery. Simply administering cefazolin without questioning exposes the patient to anaphylaxis risk. Pretreatment with antihistamines and steroids is not a reliable prevention strategy for true IgE-mediated anaphylaxis. Substituting another beta-lactam (amoxicillin-clavulanate) is also contraindicated due to the same cross-reactivity concerns.",
    learningObjective: "Apply cross-reactivity knowledge between penicillins and cephalosporins to safely manage surgical antibiotic prophylaxis",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "antibiotic prophylaxis",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Cross-reactivity between penicillin and first-generation cephalosporins is ~1-2%, not zero. With a history of ANAPHYLAXIS, this risk is unacceptable.",
    clinicalPearls: [
      "Penicillin-cephalosporin cross-reactivity: ~1-2% for first-generation, <0.5% for later generations",
      "Alternatives for severe penicillin allergy: clindamycin, vancomycin, or fluoroquinolones",
      "Pretreatment with antihistamines does NOT reliably prevent true IgE-mediated anaphylaxis"
    ],
    safetyNote: "Always verify allergy history against prescribed antibiotics — cross-reactivity between beta-lactam classes can cause fatal anaphylaxis",
    distractorRationales: [
      "While cephalosporins are a different class, cross-reactivity exists, especially with first-generation agents in anaphylactic patients",
      "Pretreatment does not reliably prevent IgE-mediated anaphylaxis and gives false reassurance",
      "Amoxicillin-clavulanate is a penicillin derivative and is absolutely contraindicated in penicillin-anaphylactic patients"
    ]
  }
];
