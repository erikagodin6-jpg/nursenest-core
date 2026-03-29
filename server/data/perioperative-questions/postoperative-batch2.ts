import type { PerioperativeQuestion } from "./types";

export const postoperativeBatch2Questions: PerioperativeQuestion[] = [
  {
    stem: "A patient arrives in the PACU after a laparoscopic cholecystectomy. Within 10 minutes, the patient develops severe shivering, oxygen desaturation to 91%, and tachycardia. What is the MOST likely cause and initial intervention?",
    options: [
      "Sepsis from intraoperative contamination — administer broad-spectrum antibiotics",
      "Postanesthetic shivering from hypothermia — apply forced-air warming, administer supplemental oxygen, and consider meperidine 12.5-25 mg IV as the most effective pharmacologic treatment for postoperative shivering",
      "Malignant hyperthermia — administer dantrolene immediately",
      "Acute myocardial infarction — obtain 12-lead ECG"
    ],
    correctAnswer: 1,
    rationaleLong: "Postanesthetic shivering is one of the most common PACU complications, occurring in 40-70% of patients after general anesthesia. It is primarily caused by intraoperative hypothermia (core temperature drop of 1-3°C is common during surgery due to cold OR environment, IV fluids, exposed body cavities, and anesthetic-induced impairment of thermoregulation). Shivering is the body's thermoregulatory response to restore normothermia, but it has significant physiological consequences: oxygen consumption increases by 200-500% (causing the desaturation observed), cardiac output and heart rate increase (causing the tachycardia), metabolic rate increases, CO2 production increases, and the patient experiences significant discomfort. The management approach includes: (1) Active rewarming with forced-air warming devices (Bair Hugger) — the most effective non-pharmacologic intervention; (2) Supplemental oxygen to compensate for the dramatically increased oxygen consumption; (3) Warm IV fluids and warm blankets; (4) Pharmacologic treatment if rewarming alone is insufficient — meperidine (Demerol) 12.5-25 mg IV is the most effective drug for postoperative shivering, working through kappa-opioid receptor agonism and central thermoregulatory modulation. Other options include clonidine, tramadol, and ondansetron. Prevention is key: maintaining normothermia intraoperatively with forced-air warming, warm IV fluids, and minimizing body surface exposure reduces PACU shivering significantly.",
    learningObjective: "Manage postanesthetic shivering in the PACU with active rewarming, supplemental oxygen, and appropriate pharmacologic intervention",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "thermoregulation",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Meperidine is the most effective drug for postoperative shivering — it works via kappa-opioid receptors and central thermoregulation, not just analgesia.",
    clinicalPearls: [
      "Postanesthetic shivering increases O2 consumption 200-500% — always apply supplemental O2",
      "Meperidine 12.5-25 mg IV is the most effective pharmacologic treatment for postoperative shivering",
      "Prevention: maintain intraoperative normothermia with forced-air warming — target core temp ≥36°C"
    ],
    safetyNote: "The 200-500% increase in oxygen consumption during shivering can precipitate myocardial ischemia in patients with coronary artery disease",
    distractorRationales: [
      "Sepsis is unlikely within 10 minutes of PACU arrival and does not typically present with shivering as the primary symptom",
      "Malignant hyperthermia occurs intraoperatively with rising temperature, rigidity, and hypercarbia — not postoperative shivering with hypothermia",
      "While tachycardia can indicate MI, the combination with shivering and recent surgery makes hypothermia the most likely cause"
    ]
  },
  {
    stem: "A 68-year-old patient is in the PACU following a right total knee arthroplasty under spinal anesthesia. The patient reports inability to move the left leg 3 hours after the procedure. What should the PACU nurse assess?",
    options: [
      "This is expected — spinal anesthesia always takes 6+ hours to wear off",
      "Assess the level and symmetry of sensory and motor block resolution — persistent unilateral block or progressive weakness may indicate epidural hematoma, which is a surgical emergency requiring urgent neurosurgical evaluation",
      "Administer additional pain medication since the patient is likely in pain",
      "Position the patient prone to facilitate drainage of spinal anesthesia"
    ],
    correctAnswer: 1,
    rationaleLong: "While residual motor block after spinal anesthesia is expected in the early postoperative period, the PACU nurse must differentiate between normal block resolution and neurological emergency. Expected spinal anesthesia resolution follows a predictable pattern: motor function returns before sensory function, and the block recedes symmetrically from the highest level downward. Concerning findings that warrant urgent investigation include: (1) Asymmetric block resolution — one side resolving while the other remains blocked; (2) Prolonged motor block beyond the expected duration for the local anesthetic used (bupivacaine typically lasts 2-4 hours for motor block); (3) Progressive weakness or ascending block AFTER initial resolution has begun; (4) New-onset severe back pain; (5) Bowel or bladder dysfunction. These findings may indicate epidural hematoma — a collection of blood in the epidural space that compresses the spinal cord or nerve roots. Epidural hematoma is a true surgical emergency with a narrow window for intervention: neurological recovery is best when decompressive laminectomy is performed within 6-8 hours of symptom onset. Risk factors include anticoagulant therapy, coagulopathy, difficult or bloody neuraxial placement, and anatomic abnormalities. The PACU nurse should perform serial neurological assessments documenting motor strength, sensory level, and symmetry of block resolution.",
    learningObjective: "Differentiate normal spinal anesthesia resolution from potential epidural hematoma requiring emergency neurosurgical intervention",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "neuraxial anesthesia complications",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Epidural hematoma: asymmetric block, progressive weakness, severe back pain. Decompressive laminectomy must occur within 6-8 hours for best neurological recovery.",
    clinicalPearls: [
      "Normal spinal block resolves symmetrically — asymmetric resolution is a red flag for epidural hematoma",
      "Epidural hematoma: surgical emergency — decompressive laminectomy within 6-8 hours for best outcomes",
      "Serial motor/sensory assessments in PACU are essential after neuraxial anesthesia"
    ],
    safetyNote: "Never assume prolonged or asymmetric motor block is 'just the spinal wearing off' — epidural hematoma requires urgent intervention",
    distractorRationales: [
      "Most spinal anesthetics with bupivacaine resolve motor block within 2-4 hours — 6+ hours is not universally expected",
      "Pain medication does not address the underlying concern of potential neurological compromise",
      "Prone positioning does not facilitate spinal anesthesia clearance and is not appropriate management"
    ]
  },
  {
    stem: "A patient in the PACU after a thyroidectomy suddenly develops stridor, dyspnea, and neck swelling. What is the MOST likely complication and what is the immediate nursing action?",
    options: [
      "Laryngospasm from extubation — administer positive pressure ventilation",
      "Postoperative neck hematoma causing airway compression — call for emergency assistance, prepare for emergent wound opening at the bedside, and have airway equipment immediately available",
      "Allergic reaction to postoperative medications — administer epinephrine",
      "Pneumothorax from surgical complication — prepare for chest tube insertion"
    ],
    correctAnswer: 1,
    rationaleLong: "Post-thyroidectomy hematoma is a life-threatening emergency that occurs in approximately 1-2% of thyroidectomy patients, typically within the first 6-24 hours postoperatively. The neck has limited capacity for expansion, and even a relatively small volume of blood (50-100 mL) can cause critical airway compression. The hematoma compresses the trachea externally and causes venous congestion and laryngeal edema, leading to progressive airway obstruction. Clinical signs include: rapidly expanding neck swelling, stridor (indicating narrowed airway), dyspnea, dysphagia, tachycardia, and restlessness. This is a TRUE EMERGENCY that can rapidly progress to complete airway obstruction and death if not immediately addressed. The nursing response includes: (1) Call for immediate surgical assistance and anesthesia support; (2) If the airway is critically compromised and the surgeon is not immediately available, the nurse should be prepared to OPEN THE WOUND AT THE BEDSIDE — a sterile suture removal kit or scissors should be at every post-thyroidectomy patient's bedside. Opening the wound and evacuating the hematoma can be lifesaving by immediately relieving tracheal compression; (3) Have intubation equipment and tracheostomy tray immediately available — intubation may be extremely difficult due to distorted anatomy and edema; (4) Administer supplemental oxygen and position the patient upright to reduce venous pressure.",
    learningObjective: "Recognize and respond to post-thyroidectomy hematoma as an airway emergency requiring immediate surgical intervention",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "surgical site bleeding",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Post-thyroidectomy hematoma = airway emergency. Be prepared to OPEN THE WOUND AT THE BEDSIDE if the airway is critically compromised.",
    clinicalPearls: [
      "Post-thyroidectomy hematoma: 1-2% incidence, typically within 6-24 hours",
      "50-100 mL of blood can cause critical airway compression in the closed neck space",
      "Keep suture removal kit/scissors at the bedside of every post-thyroidectomy patient"
    ],
    safetyNote: "Post-thyroidectomy hematoma can progress to complete airway obstruction within minutes — emergent wound opening at bedside may be lifesaving",
    distractorRationales: [
      "Laryngospasm typically occurs at extubation and does not cause neck swelling",
      "Allergic reaction can cause stridor but does not cause localized neck swelling at the surgical site",
      "Pneumothorax is rare after thyroidectomy and presents with chest findings, not neck swelling"
    ]
  },
  {
    stem: "A PACU nurse is assessing a patient following a laparoscopic gastric sleeve surgery. The patient's heart rate is 118 bpm, blood pressure is 92/58 mmHg, and urine output has been 15 mL over the past 2 hours. The surgical drain shows no significant output. The patient denies pain but appears restless and anxious. What should the nurse suspect?",
    options: [
      "The patient is anxious about the surgery and needs reassurance",
      "The vital signs suggest postoperative hemorrhage despite the absence of visible external bleeding — internal bleeding after bariatric surgery may not be visible externally, and tachycardia is often the earliest sign",
      "The patient needs more IV fluids for dehydration from the NPO period",
      "The low blood pressure is a normal effect of residual anesthesia"
    ],
    correctAnswer: 1,
    rationaleLong: "The clinical picture of tachycardia (HR 118), hypotension (BP 92/58), oliguria (15 mL/2 hours), and restlessness/anxiety in a postoperative bariatric patient is highly suggestive of postoperative hemorrhage until proven otherwise. After laparoscopic gastric sleeve surgery, the primary source of hemorrhage is the staple line — the long staple line along the greater curvature of the stomach can bleed intra-abdominally without any external evidence. Key points: (1) Tachycardia is often the EARLIEST and most sensitive sign of hemorrhage — it may precede hypotension by 30-60 minutes because compensatory mechanisms maintain blood pressure initially; (2) In obese patients, traditional signs of hemorrhage may be masked or delayed — blood pressure may be artificially elevated by the cuff size, and large intra-abdominal volumes can accumulate before becoming clinically apparent; (3) Drains may not reflect the true extent of bleeding if they are not positioned optimally or if clots obstruct the drain; (4) Restlessness and anxiety are early neurological signs of hypoperfusion. The nurse should: immediately notify the surgeon, obtain stat hemoglobin/hematocrit, ensure large-bore IV access, prepare for potential blood transfusion, and prepare for possible return to the operating room for surgical re-exploration.",
    learningObjective: "Recognize early signs of postoperative hemorrhage after bariatric surgery and initiate appropriate emergency response",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "hemorrhage recognition",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Tachycardia is the EARLIEST sign of hemorrhage — it precedes hypotension by 30-60 minutes. Absence of drain output does NOT rule out internal bleeding.",
    clinicalPearls: [
      "Tachycardia is the earliest sign of hemorrhage — precedes hypotension by 30-60 minutes",
      "Absence of drain output or visible bleeding does NOT rule out internal hemorrhage",
      "In obese patients, hemorrhage signs may be masked or delayed"
    ],
    safetyNote: "Never dismiss persistent postoperative tachycardia — always investigate hemorrhage as the primary differential until proven otherwise",
    distractorRationales: [
      "Anxiety alone would not cause the combination of tachycardia, hypotension, and oliguria",
      "Dehydration from NPO may contribute but the severity of vital sign changes suggests hemorrhage",
      "Residual anesthesia may cause mild hypotension but not the combination with tachycardia and oliguria"
    ]
  },
  {
    stem: "A patient is being transferred from the operating room to the PACU after a craniotomy for brain tumor resection. The surgeon orders the head of bed to be elevated 30 degrees. What is the physiological rationale for this positioning?",
    options: [
      "To prevent aspiration of gastric contents",
      "To promote cerebral venous drainage and reduce intracranial pressure (ICP), thereby optimizing cerebral perfusion pressure",
      "To improve the patient's visual field for assessment",
      "To reduce postoperative nausea from anesthesia"
    ],
    correctAnswer: 1,
    rationaleLong: "Head-of-bed elevation to 30 degrees after craniotomy is a standard neuroprotective positioning strategy designed to optimize intracranial dynamics. The physiological rationale includes: (1) Promotes cerebral venous drainage — elevating the head above the heart facilitates gravity-assisted venous outflow through the internal jugular veins and cerebral venous sinuses. This reduces cerebral blood volume, which is one of the three components of intracranial contents (brain tissue, cerebrospinal fluid, and blood — per the Monro-Kellie doctrine); (2) Reduces intracranial pressure (ICP) — by enhancing venous drainage and reducing cerebral blood volume, ICP is lowered. After craniotomy, cerebral edema and the surgical manipulation can increase ICP; (3) Optimizes cerebral perfusion pressure (CPP) — CPP = Mean Arterial Pressure (MAP) minus ICP. By reducing ICP, CPP is maintained or improved, ensuring adequate brain perfusion; (4) Reduces the risk of postoperative cerebral edema. Important positioning considerations: the head should be maintained in a neutral, midline position (avoiding rotation, flexion, or extension) because turning the head can compress the internal jugular veins and impair venous drainage, paradoxically increasing ICP. Hip flexion should also be minimized as it can increase intra-abdominal and intrathoracic pressure, impairing venous return from the head.",
    learningObjective: "Apply neuroprotective positioning principles after craniotomy to optimize cerebral venous drainage and intracranial pressure",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "neurosurgical positioning",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "HOB 30° + midline neutral head position after craniotomy. Head rotation compresses jugular veins and INCREASES ICP — keep head midline.",
    clinicalPearls: [
      "HOB 30° promotes cerebral venous drainage and reduces ICP via gravity-assisted outflow",
      "Monro-Kellie: brain tissue + CSF + blood = fixed volume — reducing blood volume lowers ICP",
      "CPP = MAP - ICP — reducing ICP improves cerebral perfusion"
    ],
    safetyNote: "Maintain the head in midline neutral position — head rotation compresses the jugular veins and increases ICP",
    distractorRationales: [
      "Aspiration prevention is a benefit but not the primary rationale for head elevation after craniotomy",
      "Visual assessment is not the physiological reason for this specific positioning",
      "Nausea reduction is not the primary rationale — the positioning specifically targets intracranial pressure management"
    ]
  },
  {
    stem: "A patient in the PACU reports a pain level of 8/10 after an open inguinal hernia repair. The nurse has administered the maximum ordered dose of IV morphine with minimal relief. What is the MOST appropriate next step?",
    options: [
      "Tell the patient that pain is normal after surgery and to try relaxation techniques",
      "Administer a second dose of morphine beyond the ordered amount",
      "Contact the anesthesiologist or surgeon for reassessment, request additional analgesic orders, and consider multimodal pain management options including regional anesthesia techniques",
      "Discharge the patient from the PACU despite uncontrolled pain"
    ],
    correctAnswer: 2,
    rationaleLong: "Uncontrolled postoperative pain despite maximum ordered analgesic doses requires escalation and reassessment. The PACU nurse should NOT simply accept inadequate pain control as inevitable, administer medication beyond ordered limits, or discharge the patient with uncontrolled pain. The appropriate response includes: (1) Contact the anesthesiologist or surgeon to report inadequate pain control and request additional orders — this may include higher opioid doses, a different opioid (rotation), or adjunct medications; (2) Advocate for multimodal analgesia — the combination of different analgesic classes (opioids, NSAIDs, acetaminophen, gabapentinoids, local anesthetics) targets different pain pathways and provides superior analgesia with fewer opioid-related side effects; (3) Consider regional anesthesia — an ilioinguinal/iliohypogastric nerve block, TAP block, or local anesthetic wound infiltration can provide excellent analgesia for inguinal hernia repair; (4) Assess for surgical complications — severe pain disproportionate to the expected level may indicate complications such as hematoma, incarcerated mesh, or nerve entrapment; (5) Implement non-pharmacologic interventions as adjuncts (positioning, ice, breathing techniques) — these complement but do not replace adequate pharmacologic management; (6) Document the pain assessment, interventions, and patient response. Effective postoperative pain management is both a patient right and a clinical quality indicator.",
    learningObjective: "Escalate uncontrolled postoperative pain management through provider communication, multimodal analgesia, and regional techniques",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "pain management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Uncontrolled pain requires provider notification and multimodal approach — never exceed ordered limits or accept inadequate analgesia. Consider regional blocks.",
    clinicalPearls: [
      "Multimodal analgesia (opioids + NSAIDs + acetaminophen + regional blocks) is superior to opioids alone",
      "Severe pain disproportionate to the expected level may indicate surgical complications",
      "Regional nerve blocks can provide excellent analgesia when systemic medications are insufficient"
    ],
    safetyNote: "Never discharge a patient from the PACU with uncontrolled pain — inadequate pain control is associated with complications and prolonged recovery",
    distractorRationales: [
      "Dismissing the patient's pain is inappropriate and does not meet the standard of care",
      "Administering medication beyond ordered amounts is practicing outside the scope of the order",
      "Discharging with uncontrolled pain violates PACU discharge criteria and patient safety standards"
    ]
  },
  {
    stem: "A patient who underwent a laparoscopic appendectomy under general anesthesia arrives in the PACU. The Aldrete score is being assessed. Which criteria are included in the modified Aldrete scoring system?",
    options: [
      "Pain level, nausea severity, and surgeon satisfaction",
      "Activity (motor function), respiration, circulation (blood pressure), consciousness, and oxygen saturation — each scored 0-2 for a maximum score of 10",
      "Intake and output, ambulation distance, and appetite",
      "Surgical wound assessment, drain output, and laboratory values"
    ],
    correctAnswer: 1,
    rationaleLong: "The modified Aldrete scoring system is the most widely used standardized tool for assessing patient readiness for discharge from the PACU. It evaluates five criteria, each scored 0, 1, or 2, for a maximum total score of 10: (1) Activity/Motor function — ability to move extremities voluntarily or on command (2 = moves all four extremities, 1 = moves two extremities, 0 = unable to move); (2) Respiration — ability to breathe deeply and cough (2 = can deep breathe and cough freely, 1 = dyspnea or limited breathing, 0 = apneic); (3) Circulation — blood pressure compared to pre-anesthetic level (2 = within 20% of pre-anesthetic level, 1 = within 20-49%, 0 = >50% difference); (4) Consciousness — level of awareness (2 = fully awake, 1 = arousable on calling, 0 = not responding); (5) Oxygen saturation — SpO2 (2 = maintains >92% on room air, 1 = needs supplemental O2 to maintain >90%, 0 = <90% even with supplemental O2). A score of ≥9 is generally required for PACU discharge to a general care unit. The original Aldrete score used skin color instead of oxygen saturation, but the modified version replaced this with SpO2 monitoring, which is more objective and quantifiable.",
    learningObjective: "Apply the modified Aldrete scoring system to assess PACU discharge readiness across five standardized physiological criteria",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "PACU discharge criteria",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Modified Aldrete: Activity, Respiration, Circulation (BP), Consciousness, SpO2 — each scored 0-2, max 10. Score ≥9 for discharge.",
    clinicalPearls: [
      "Modified Aldrete: Activity, Respiration, Circulation, Consciousness, SpO2 — max score 10",
      "Score ≥9 generally required for PACU discharge to general care",
      "Original Aldrete used skin color; modified version uses SpO2 (more objective)"
    ],
    safetyNote: "The Aldrete score is a minimum standard — additional criteria (pain control, PONV, surgical-specific concerns) must also be met before PACU discharge",
    distractorRationales: [
      "Pain and nausea are important but are NOT part of the standard Aldrete score — they are separate discharge criteria",
      "Intake, ambulation, and appetite are assessed for Phase II (ambulatory) discharge, not PACU Phase I discharge",
      "Wound assessment and labs are not part of the Aldrete score — they are assessed separately"
    ]
  },
  {
    stem: "A patient develops postoperative nausea and vomiting (PONV) in the PACU. The patient has already received ondansetron (Zofran) 4 mg IV intraoperatively without relief. What is the recommended approach to rescue antiemetic therapy?",
    options: [
      "Repeat the same dose of ondansetron since it is the most effective antiemetic",
      "Administer a rescue antiemetic from a DIFFERENT pharmacologic class than the prophylactic agent — for example, dexamethasone, droperidol, promethazine, or transdermal scopolamine",
      "Wait for the PONV to resolve on its own since all PONV is self-limiting",
      "Administer IV fluids only — PONV does not require pharmacologic treatment"
    ],
    correctAnswer: 1,
    rationaleLong: "The management of postoperative nausea and vomiting (PONV) follows a multimodal, multi-class approach. When a prophylactic antiemetic fails to prevent PONV, the rescue antiemetic should be from a DIFFERENT pharmacologic class than the agent already administered. This is because PONV involves multiple receptor pathways (serotonin 5-HT3, dopamine D2, histamine H1, muscarinic, and neurokinin NK1 receptors), and failure of one class suggests that the predominant pathway in that patient may not be the one targeted by the initial agent. The major antiemetic classes and their receptor targets include: (1) 5-HT3 receptor antagonists — ondansetron, granisetron, palonosetron (this was already given); (2) Corticosteroids — dexamethasone (mechanism not fully understood but involves anti-inflammatory effects and central serotonin antagonism); (3) Butyrophenones — droperidol (D2 receptor antagonist); (4) Phenothiazines — promethazine, prochlorperazine (D2, H1 receptor antagonists); (5) Anticholinergics — scopolamine (muscarinic receptor antagonist); (6) NK1 receptor antagonists — aprepitant, fosaprepitant. The PONV risk factors identified by the Apfel Simplified Risk Score include: female sex, history of PONV or motion sickness, non-smoking status, and postoperative opioid use. Each factor adds approximately 20% to the baseline PONV risk.",
    learningObjective: "Apply multimodal antiemetic therapy using different pharmacologic classes for PONV rescue when initial prophylaxis fails",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "PONV management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Rescue antiemetic must be from a DIFFERENT class than the prophylactic agent. Repeating the same class is ineffective.",
    clinicalPearls: [
      "PONV rescue: use a DIFFERENT antiemetic class than the prophylactic agent",
      "Apfel risk factors: female, history of PONV/motion sickness, non-smoker, postoperative opioids",
      "PONV involves multiple receptor pathways — multimodal approach is most effective"
    ],
    safetyNote: "Uncontrolled PONV can cause aspiration, wound dehiscence, esophageal tears, and significant patient distress — it requires active management",
    distractorRationales: [
      "Repeating the same class is ineffective — if ondansetron failed, a different 5-HT3 antagonist will likely fail too",
      "PONV is not always self-limiting and can cause serious complications if untreated",
      "IV fluids help with hydration but do not adequately treat established PONV without pharmacologic intervention"
    ]
  },
  {
    stem: "A patient who underwent a total hip arthroplasty under general anesthesia is in the PACU. The nurse notes that the patient's temperature is 35.2°C (95.4°F). According to evidence-based guidelines, what is the minimum acceptable core temperature before PACU discharge?",
    options: [
      "Any temperature above 34°C is acceptable for discharge",
      "36°C (96.8°F) — patients should be normothermic (≥36°C) before discharge from the PACU to prevent complications associated with hypothermia",
      "37°C (98.6°F) — only normal body temperature is acceptable",
      "Temperature is not a PACU discharge criterion"
    ],
    correctAnswer: 1,
    rationaleLong: "Perioperative hypothermia (core temperature <36°C) is associated with multiple adverse outcomes: increased surgical site infection risk (hypothermia impairs neutrophil function and reduces tissue oxygen tension), impaired coagulation (platelet dysfunction and enzymatic slowing of the coagulation cascade, increasing bleeding), prolonged drug metabolism (anesthetic agents are metabolized more slowly, delaying emergence and recovery), cardiac morbidity (hypothermia triggers sympathetic activation, increasing cardiac oxygen demand and the risk of myocardial ischemia and arrhythmias), postoperative shivering (increasing oxygen consumption 200-500%), patient discomfort, and prolonged hospital length of stay. Current guidelines from multiple professional organizations (AORN, ASA, NICE, ASPAN) recommend maintaining core temperature ≥36°C throughout the perioperative period and require that patients achieve normothermia (≥36°C) before PACU discharge. At 35.2°C, this patient requires active rewarming with forced-air warming before discharge. The nurse should continue warming measures, monitor temperature serially, and document temperature achievement before meeting the discharge temperature criterion.",
    learningObjective: "Apply normothermia standards as a PACU discharge criterion and understand the complications associated with perioperative hypothermia",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "temperature management",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Minimum PACU discharge temperature: ≥36°C (96.8°F). Hypothermia increases SSI risk, impairs coagulation, and prolongs drug metabolism.",
    clinicalPearls: [
      "Normothermia standard: ≥36°C — required before PACU discharge",
      "Hypothermia increases SSI risk by impairing neutrophil function and reducing tissue oxygenation",
      "Each 1°C drop below 36°C significantly increases coagulopathy and cardiac morbidity risk"
    ],
    safetyNote: "Never discharge a hypothermic patient from the PACU — active rewarming must continue until normothermia is achieved",
    distractorRationales: [
      "34°C is moderate hypothermia and is associated with significant complications — it is not acceptable for discharge",
      "37°C is ideal but not required — the standard is ≥36°C for safe discharge",
      "Temperature IS a PACU discharge criterion per AORN and ASPAN guidelines"
    ]
  },
  {
    stem: "During PACU care, a patient who had a spinal anesthetic for a cesarean section reports a severe headache that worsens when sitting up and improves when lying flat. What should the PACU nurse suspect?",
    options: [
      "Tension headache from stress of surgery — administer acetaminophen",
      "Post-dural puncture headache (PDPH) caused by CSF leak through the dural puncture site — notify the anesthesiologist for evaluation and potential epidural blood patch",
      "Migraine triggered by surgical stress",
      "Hypertensive headache — check blood pressure and administer antihypertensives"
    ],
    correctAnswer: 1,
    rationaleLong: "Post-dural puncture headache (PDPH) is a well-recognized complication of neuraxial anesthesia that occurs when the dura mater is punctured (intentionally during spinal anesthesia, or accidentally during epidural placement), allowing cerebrospinal fluid (CSF) to leak through the puncture site. The characteristic feature is a POSITIONAL headache — it worsens with upright posture (sitting, standing) and improves with recumbent positioning. This pattern occurs because the loss of CSF volume reduces the cushioning effect on the brain, and in the upright position, gravity causes the brain to sag downward, putting traction on pain-sensitive meningeal structures and bridging veins. PDPH characteristics include: frontal or occipital headache, postural nature, onset typically 24-48 hours after dural puncture (but can be earlier), and may be accompanied by neck stiffness, nausea, photophobia, tinnitus, or cranial nerve symptoms. Risk factors include: young age, female sex, pregnancy, larger needle gauge, cutting-type needle (Quincke) rather than pencil-point (Whitacre/Sprotte), and multiple dural puncture attempts. Treatment includes: conservative management (bed rest, hydration, caffeine 300-500 mg orally or IV, analgesics), and definitive treatment with an epidural blood patch — injection of 15-20 mL of the patient's own autologous blood into the epidural space at or near the puncture level, which seals the dural tear. The epidural blood patch has a success rate of approximately 70-90% with the first attempt.",
    learningObjective: "Recognize post-dural puncture headache by its characteristic positional nature and facilitate appropriate treatment including epidural blood patch",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "neuraxial complications",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "PDPH: POSITIONAL headache — worse sitting/standing, better lying flat. Definitive treatment: epidural blood patch (70-90% success rate).",
    clinicalPearls: [
      "PDPH hallmark: positional headache — worse upright, better supine — caused by CSF leak",
      "Risk factors: young, female, pregnancy, larger needle, cutting-type needle, multiple attempts",
      "Epidural blood patch: 15-20 mL autologous blood at the puncture level, 70-90% success rate"
    ],
    safetyNote: "Report any postural headache after neuraxial anesthesia to the anesthesiologist — untreated PDPH can rarely progress to subdural hematoma",
    distractorRationales: [
      "Tension headache is not positional — it does not have the characteristic improvement with lying flat",
      "Migraines are not typically positional and are not associated with recent dural puncture",
      "Hypertensive headache is not positional and requires blood pressure verification before assuming the diagnosis"
    ]
  }
];
