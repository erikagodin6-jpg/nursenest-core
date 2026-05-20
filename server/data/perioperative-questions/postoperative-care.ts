import type { PerioperativeQuestion } from "./types";

export const postoperativeCareQuestions: PerioperativeQuestion[] = [
  {
    stem: "A patient arrives in the PACU following a total thyroidectomy under general anesthesia. During the initial assessment, the nurse notices progressive neck swelling, the patient reports tightness in the throat, and stridor is audible. What is the PRIORITY nursing action?",
    options: [
      "Apply ice packs to the neck and elevate the head of bed to 45 degrees",
      "Immediately notify the surgeon and prepare for emergency wound exploration to evacuate a neck hematoma",
      "Administer IV dexamethasone for airway edema and continue monitoring",
      "Suction the oropharynx and administer supplemental oxygen via nasal cannula"
    ],
    correctAnswer: 1,
    rationaleLong: "Post-thyroidectomy neck hematoma is a surgical emergency that can rapidly progress to complete airway obstruction and death. The combination of progressive neck swelling, throat tightness, and stridor indicates a rapidly expanding hematoma compressing the trachea. This condition can evolve from stable to fatal within minutes. The priority action is to immediately notify the surgeon because the wound needs emergent opening at the bedside (if the patient is in extremis) or in the operating room for formal exploration and hemostasis. The wound closure (skin staples or sutures) may need to be opened immediately at the bedside to release the pressure if airway compromise is imminent. The nurse should have clip/suture removal supplies at the bedside of every thyroidectomy patient for this exact reason. Simultaneously, the nurse should prepare for potential intubation or emergency surgical airway, as the edematous tissues may make intubation extremely difficult. While supplemental oxygen and head elevation are supportive measures, they do not address the underlying cause — a compressive hematoma. Dexamethasone may help with edema but acts too slowly for an acute surgical emergency. The classic signs to monitor post-thyroidectomy include: progressive neck swelling, dyspnea, stridor, dysphagia, and voice changes. Additional post-thyroidectomy complications include hypocalcemia from parathyroid damage (presenting as tingling, Chvostek's sign, Trousseau's sign) and recurrent laryngeal nerve injury (presenting as hoarseness).",
    learningObjective: "Recognize post-thyroidectomy neck hematoma as a surgical emergency requiring immediate intervention to prevent airway obstruction",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "postoperative hemorrhage",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Post-thyroidectomy hematoma = surgical emergency. Suture/clip removal supplies should be at EVERY thyroidectomy patient's bedside in PACU.",
    clinicalPearls: [
      "Post-thyroidectomy hematoma can cause airway obstruction within minutes — this is a life-threatening emergency",
      "Keep suture/staple removal supplies at the bedside of all thyroidectomy patients",
      "Also monitor for hypocalcemia (Chvostek's, Trousseau's signs) and recurrent laryngeal nerve injury (hoarseness)"
    ],
    safetyNote: "Any progressive neck swelling after thyroidectomy requires immediate surgical evaluation — delay can be fatal",
    distractorRationales: [
      "Ice and elevation are insufficient for a compressive hematoma causing airway obstruction",
      "Dexamethasone acts too slowly and does not address the mechanical compression from the hematoma",
      "Suctioning and nasal cannula oxygen do not address the surgical cause of the airway compromise"
    ]
  },
  {
    stem: "A 68-year-old patient is in the PACU 45 minutes after a right total hip arthroplasty under spinal anesthesia. The patient's Aldrete score is 7 out of 10, with points lost for inability to move the lower extremities and mild oxygen desaturation requiring supplemental oxygen. What is the most appropriate nursing interpretation?",
    options: [
      "The patient is ready for discharge to the surgical floor since 7/10 is an acceptable Aldrete score",
      "The residual spinal anesthesia explains the lack of lower extremity movement, and the desaturation should be investigated — the patient is not yet ready for discharge from PACU",
      "The inability to move lower extremities suggests a neurological emergency requiring immediate MRI",
      "The Aldrete score of 7 indicates the patient needs to be transferred to the ICU"
    ],
    correctAnswer: 1,
    rationaleLong: "The Aldrete scoring system is used in the PACU to assess a patient's readiness for discharge to a lower level of care. It evaluates five parameters, each scored 0-2: activity (ability to move extremities), respiration (ability to breathe deeply and cough), circulation (blood pressure compared to baseline), consciousness (level of arousal), and oxygen saturation. A score of 9-10 is generally required for discharge from Phase I PACU. This patient's score of 7 is below the discharge threshold. The inability to move lower extremities is expected 45 minutes after spinal anesthesia, as the motor block typically lasts 2-4 hours depending on the local anesthetic used. This finding does not indicate a neurological emergency — it is an expected residual effect of the regional anesthetic. However, the patient cannot be discharged until motor function begins to return. The mild oxygen desaturation requiring supplemental oxygen should be evaluated — possible causes include residual sedation, atelectasis, pain-related splinting, or position-related issues. The nurse should investigate the cause, implement appropriate interventions (incentive spirometry, repositioning, pain management), and continue monitoring. The patient needs continued PACU care until the Aldrete score reaches 9-10.",
    learningObjective: "Apply the Aldrete scoring system to determine PACU readiness for discharge and interpret findings in the context of regional anesthesia",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "PACU discharge criteria",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Residual motor block after spinal anesthesia is EXPECTED, not a neurological emergency. But the patient still cannot be discharged until motor function returns.",
    clinicalPearls: [
      "Aldrete score parameters: Activity, Respiration, Circulation, Consciousness, O2 saturation (each 0-2, total 10)",
      "Aldrete score of 9-10 is generally required for Phase I PACU discharge",
      "Spinal anesthesia motor block typically resolves in 2-4 hours — this is expected, not pathological"
    ],
    safetyNote: "Do not discharge patients from PACU with residual motor block — fall risk is significantly elevated until motor function returns",
    distractorRationales: [
      "Score of 7 is below the 9-10 threshold for PACU discharge",
      "Motor block 45 minutes after spinal anesthesia is expected — emergent MRI is unnecessary and wasteful",
      "A score of 7 does not automatically require ICU transfer — it means the patient needs continued PACU care"
    ]
  },
  {
    stem: "A patient who underwent an open abdominal aortic aneurysm repair is in the PACU. Two hours postoperatively, the nurse notes that the patient's urine output has been only 15 mL/hr for the past 2 hours, the patient's feet are cool and mottled, and pedal pulses are diminished bilaterally. What complication should the nurse suspect?",
    options: [
      "Normal postoperative fluid shifts from third-spacing",
      "Renal artery thrombosis or graft occlusion causing lower extremity and renal ischemia",
      "Urinary retention from residual anesthesia effects",
      "Dehydration from inadequate intraoperative fluid replacement"
    ],
    correctAnswer: 1,
    rationaleLong: "After open abdominal aortic aneurysm (AAA) repair, the combination of oliguria (urine output <0.5 mL/kg/hr), cool and mottled lower extremities, and diminished pedal pulses is highly suggestive of graft occlusion or thrombosis causing distal ischemia. During AAA repair, the aorta is cross-clamped and a synthetic graft is placed to replace the aneurysmal segment. Postoperative complications include graft thrombosis, distal embolization, renal ischemia (if the clamp was near or above the renal arteries), and lower extremity ischemia. The renal arteries branch from the abdominal aorta, and ischemia to these vessels results in acute kidney injury manifested by oliguria or anuria. Simultaneously, occlusion of the graft or distal embolization compromises blood flow to the lower extremities, causing the classic signs of acute limb ischemia: pain, pallor, pulselessness, poikilothermia (coolness), and paresthesia. This is a surgical emergency requiring immediate surgical consultation for possible graft revision, thrombectomy, or embolectomy. The nurse should immediately notify the surgeon, continue to monitor and document vascular assessments (pulses, capillary refill, skin color and temperature) in both lower extremities, and maintain adequate hydration. Urinary retention typically does not cause mottled, cool extremities with diminished pulses. Simple third-spacing or dehydration would not explain the vascular findings.",
    learningObjective: "Recognize signs of graft occlusion and distal ischemia following aortic surgery and initiate appropriate nursing response",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "vascular assessment",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "After aortic surgery, the combination of oliguria + cool/mottled legs + diminished pulses = graft occlusion until proven otherwise.",
    clinicalPearls: [
      "6 Ps of acute limb ischemia: Pain, Pallor, Pulselessness, Poikilothermia, Paresthesia, Paralysis",
      "After AAA repair, check pedal pulses, skin color/temp, capillary refill, and urine output every 15-30 minutes",
      "Oliguria after aortic surgery may indicate renal artery ischemia — a surgical emergency"
    ],
    safetyNote: "Any change in pedal pulses or lower extremity perfusion after aortic surgery requires immediate surgical notification",
    distractorRationales: [
      "Third-spacing causes generalized edema and decreased urine output but does not explain cool, mottled extremities with absent pulses",
      "Urinary retention presents with a distended bladder and discomfort, not vascular compromise signs",
      "Dehydration alone does not cause bilateral limb ischemia with absent pulses"
    ]
  },
  {
    stem: "A patient who underwent a laparoscopic Roux-en-Y gastric bypass 6 hours ago develops sudden-onset tachycardia (heart rate 128 bpm), restlessness, and anxiety. Blood pressure is 104/68 mmHg, respiratory rate is 24, and temperature is 37.8°C. The surgical drain output is minimal. What postoperative complication should the nurse suspect FIRST?",
    options: [
      "Pulmonary embolism related to immobility",
      "Anastomotic leak at the gastrojejunal connection",
      "Normal postoperative pain response requiring additional analgesics",
      "Atelectasis from inadequate deep breathing exercises"
    ],
    correctAnswer: 1,
    rationaleLong: "After bariatric surgery, unexplained tachycardia is the earliest and most reliable clinical sign of an anastomotic leak. A tachycardia of 128 bpm with restlessness, anxiety, and low-normal blood pressure 6 hours after Roux-en-Y gastric bypass should immediately raise suspicion for this life-threatening complication. Anastomotic leaks occur at the staple lines or connection sites (gastrojejunal anastomosis or jejunojejunal anastomosis) and can allow gastric or intestinal contents to leak into the peritoneal cavity, causing chemical peritonitis and sepsis. The classic early sign is tachycardia out of proportion to pain level, which may precede fever, abdominal distension, and hemodynamic instability. The fact that the surgical drain output is minimal does NOT rule out a leak — drains can be malpositioned, kinked, or the leak may not communicate with the drain location. Important: in post-bariatric patients, traditional signs of peritonitis (abdominal rigidity, rebound tenderness) may be masked by the patient's body habitus, residual anesthesia effects, and postoperative analgesics. The nurse should immediately notify the surgeon, as emergent upper GI contrast study or CT scan may be needed to confirm the diagnosis, and the patient may require emergent return to the operating room for repair. The nurse should also obtain serial vital signs, prepare for potential hemodynamic support, and withhold oral intake.",
    learningObjective: "Recognize unexplained tachycardia as the earliest sign of anastomotic leak after bariatric surgery",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "anastomotic leak",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Unexplained tachycardia after bariatric surgery = anastomotic leak until proven otherwise. Do NOT be reassured by minimal drain output or absence of classical peritonitis signs.",
    clinicalPearls: [
      "Tachycardia is the earliest and most reliable sign of anastomotic leak after bariatric surgery",
      "Classical peritonitis signs may be masked in obese patients — rely on heart rate trends",
      "Minimal drain output does NOT rule out a leak — drains can be malpositioned"
    ],
    safetyNote: "Any unexplained tachycardia >120 bpm after gastric bypass requires immediate surgical consultation",
    distractorRationales: [
      "PE can cause tachycardia but the timing and clinical context make anastomotic leak more likely as a first consideration",
      "Pain alone typically does not cause a heart rate of 128 with restlessness and borderline hypotension",
      "Atelectasis causes mild tachypnea and hypoxia but not the degree of tachycardia and hemodynamic changes seen here"
    ]
  },
  {
    stem: "A PACU nurse is caring for a 4-year-old child who underwent bilateral myringotomy with tube placement under general anesthesia with sevoflurane. The child is inconsolable, thrashing, kicking, and crying but does not appear to recognize the parents. Vital signs are stable. What is the MOST likely cause of this behavior?",
    options: [
      "Severe postoperative pain requiring immediate opioid administration",
      "Emergence delirium (emergence agitation) following sevoflurane anesthesia, which is common in young children",
      "Allergic reaction to the anesthetic agent requiring epinephrine",
      "Hypoglycemia from prolonged NPO period requiring IV dextrose"
    ],
    correctAnswer: 1,
    rationaleLong: "Emergence delirium (ED), also called emergence agitation, is a common phenomenon in pediatric patients recovering from general anesthesia, particularly with volatile agents such as sevoflurane and desflurane. ED occurs in 10-80% of pediatric patients (depending on the study and definition used) and is characterized by inconsolable crying, thrashing, kicking, disorientation, non-purposeful movements, and failure to recognize parents or caregivers. The child is not fully conscious and is in a dissociative state between general anesthesia and full wakefulness. Risk factors include: young age (2-5 years is peak), sevoflurane or desflurane anesthesia, rapid emergence, short procedures, ENT procedures (particularly myringotomy), preoperative anxiety, and lack of premedication. ED is self-limiting, typically resolving within 15-30 minutes. Management includes: ensuring patient safety (side rails up, padding, parent presence), ruling out other causes (pain, full bladder, hypoxia), and in severe cases, administering a small dose of IV propofol (0.5-1 mg/kg), fentanyl, or dexmedetomidine. Differentiating ED from pain is important — in ED, the child does not respond to comfort measures and does not recognize familiar people; in pain, the child typically responds to analgesics and recognizes parents. Prevention strategies include prophylactic ketorolac, propofol bolus at the end of the case, or preoperative intranasal dexmedetomidine or midazolam.",
    learningObjective: "Recognize emergence delirium in pediatric patients and differentiate it from postoperative pain",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "emergence delirium",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Emergence delirium ≠ pain. Key differentiator: in ED, the child does NOT recognize parents and is not consolable. In pain, the child responds to comfort and recognizes familiar faces.",
    clinicalPearls: [
      "ED peak age: 2-5 years; peak agents: sevoflurane, desflurane; peak procedures: short ENT cases",
      "Self-limiting, resolves in 15-30 minutes; treat severe cases with low-dose propofol or fentanyl",
      "Key differentiator from pain: child does not recognize parents in ED"
    ],
    safetyNote: "Ensure patient safety during emergence delirium — side rails up, padding, one-to-one nursing care to prevent self-injury",
    distractorRationales: [
      "Pain is possible but the hallmark of ED is failure to recognize parents and non-purposeful thrashing — pain management is a secondary consideration",
      "Allergic reactions present with urticaria, bronchospasm, or hemodynamic instability, not isolated behavioral agitation",
      "Hypoglycemia in a previously healthy child after a short NPO period is unlikely and would present with different symptoms"
    ]
  },
  {
    stem: "A patient in the PACU following a right total knee arthroplasty under general anesthesia develops postoperative nausea and vomiting (PONV). The nurse notes the patient has three of the four Apfel risk factors. Which combination of risk factors would give this patient a high PONV risk score?",
    options: [
      "Male sex, smoking history, planned use of postoperative opioids, history of motion sickness",
      "Female sex, non-smoking status, history of PONV, and planned use of postoperative opioids",
      "Age over 65, diabetes mellitus, hypertension, and male sex",
      "BMI over 40, regional anesthesia, short procedure duration, and early ambulation"
    ],
    correctAnswer: 1,
    rationaleLong: "The simplified Apfel score is the most widely used clinical tool for predicting postoperative nausea and vomiting (PONV) risk. It consists of four independent risk factors, each worth one point: (1) Female sex, (2) Non-smoking status, (3) History of PONV or motion sickness, and (4) Planned use of postoperative opioids. With 0 factors, the baseline PONV risk is approximately 10%; with 1 factor, 21%; with 2 factors, 39%; with 3 factors, 61%; and with 4 factors, 79%. This patient has 3 of 4 Apfel risk factors (female, non-smoker, history of PONV, plus opioid use = 3 of 4 mentioned), giving a 61% risk of PONV. Understanding these risk factors allows the perioperative team to implement a multimodal antiemetic prophylaxis strategy. For patients with 3-4 risk factors, guidelines recommend combination antiemetic therapy with agents from different classes (e.g., ondansetron 5-HT3 antagonist + dexamethasone + scopolamine patch + droperidol). Additionally, total intravenous anesthesia (TIVA) with propofol, minimizing opioid use through multimodal analgesia, and adequate hydration reduce PONV risk. The nurse should advocate for multimodal antiemetic prophylaxis and early intervention when PONV occurs.",
    learningObjective: "Apply the Apfel simplified risk score to identify patients at high risk for PONV and advocate for prophylactic antiemetic therapy",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "PONV management",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Apfel risk factors: Female, Non-smoker, History of PONV/motion sickness, Postop opioids. Male sex and SMOKING are protective factors.",
    clinicalPearls: [
      "Apfel score: Female, Non-smoker, History PONV/motion sickness, Postop opioids — each factor = ~20% added risk",
      "3-4 risk factors = 61-79% PONV risk — multimodal antiemetic prophylaxis is strongly recommended",
      "TIVA with propofol reduces PONV compared to volatile anesthetics"
    ],
    safetyNote: "Uncontrolled PONV can cause aspiration, wound dehiscence, increased intracranial pressure, and significant patient distress",
    distractorRationales: [
      "Male sex and smoking are actually protective factors against PONV (reduce risk), not risk factors",
      "Age, diabetes, and hypertension are not Apfel risk factors for PONV",
      "BMI, regional anesthesia, and procedure duration are not part of the Apfel simplified risk score"
    ]
  },
  {
    stem: "On postoperative day 1, a patient who underwent an open colectomy reports sudden onset of copious serosanguineous drainage soaking through the abdominal dressing. Upon removing the dressing, the nurse observes loops of bowel protruding through the incision. What is the IMMEDIATE nursing action?",
    options: [
      "Gently push the bowel back into the abdominal cavity and apply a pressure dressing",
      "Cover the exposed bowel with sterile saline-moistened towels, position the patient supine with knees flexed, and notify the surgeon immediately for emergency surgical repair",
      "Apply a sterile dry dressing, administer IV analgesics, and monitor vital signs every 5 minutes",
      "Document the wound dehiscence, take a photograph for the medical record, and page the surgeon"
    ],
    correctAnswer: 1,
    rationaleLong: "This scenario describes wound evisceration — the protrusion of abdominal organs (typically bowel) through a dehisced surgical incision. This is a surgical emergency requiring immediate intervention. The priority nursing actions are: (1) Do NOT attempt to push the bowel back into the abdomen, as this can cause bowel perforation, contamination, or vascular compromise; (2) Cover the exposed bowel with sterile towels or gauze moistened with warm sterile normal saline to prevent the tissue from drying out, cooling, or becoming contaminated. Dry or cold coverings can cause tissue damage and bowel necrosis; (3) Position the patient supine with knees flexed (semi-Fowler's with knees bent) to reduce tension on the abdominal wall and prevent further evisceration; (4) Notify the surgeon immediately — the patient will need emergency surgical repair (re-closure of the abdominal wall); (5) Keep the patient NPO, establish IV access, monitor vital signs continuously, and prepare for emergency return to the operating room. Risk factors for wound dehiscence include obesity, malnutrition (low albumin), chronic steroid use, diabetes, infection, chronic cough, abdominal distension, and excessive straining. The precursor event is often a sudden increase in intra-abdominal pressure (coughing, vomiting, straining) with the hallmark warning sign of sudden serosanguineous ('salmon-colored') drainage soaking the dressing.",
    learningObjective: "Implement emergency nursing interventions for wound evisceration including sterile saline-moistened coverings and immediate surgical notification",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "wound dehiscence and evisceration",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER push eviscerated bowel back into the abdomen. Cover with MOIST sterile saline towels, not dry dressings.",
    clinicalPearls: [
      "Sudden serosanguineous drainage = warning sign of impending dehiscence/evisceration",
      "Cover exposed bowel with warm sterile saline-moistened towels — NEVER dry or cold coverings",
      "Position supine with knees flexed to reduce abdominal wall tension"
    ],
    safetyNote: "Wound evisceration is a surgical emergency — never delay notification for documentation or photography",
    distractorRationales: [
      "Pushing bowel back in can cause perforation, contamination, and vascular compromise — never attempt this",
      "Dry dressings cause tissue desiccation and damage — always use moist saline coverings",
      "Documentation and photography must not delay emergency intervention and surgical notification"
    ]
  },
  {
    stem: "A postoperative patient who underwent a transurethral resection of the prostate (TURP) develops confusion, nausea, and hyponatremia (serum sodium 118 mEq/L) 2 hours after the procedure. What complication does this presentation suggest?",
    options: [
      "Postoperative delirium from residual anesthetic effects",
      "TURP syndrome caused by absorption of hypotonic irrigation fluid during the procedure",
      "Sepsis from urinary tract infection",
      "Acute adrenal insufficiency from steroid withdrawal"
    ],
    correctAnswer: 1,
    rationaleLong: "TURP syndrome is a potentially life-threatening complication that occurs when large volumes of hypotonic irrigation fluid (glycine 1.5% or sterile water) are absorbed through open prostatic venous sinuses during transurethral resection of the prostate. The absorbed hypotonic fluid causes dilutional hyponatremia, fluid overload, and can lead to cerebral edema. The classic presentation includes: neurological symptoms (confusion, agitation, visual disturbances, seizures — glycine is a neurotransmitter), cardiovascular symptoms (hypertension followed by hypotension, bradycardia, pulmonary edema), and laboratory findings (hyponatremia, often severe <120 mEq/L, decreased hemoglobin from hemodilution). A serum sodium of 118 mEq/L is severely low and can cause seizures, cerebral edema, and brain herniation if not corrected promptly. Risk factors include: prolonged resection time (>60 minutes), large gland size (>45g), excessive irrigation fluid use, and low irrigation fluid height. Treatment includes: stopping the procedure (if still ongoing), fluid restriction, IV furosemide, and in severe cases (seizures, coma), hypertonic saline (3% NaCl) administered cautiously to avoid overcorrection and osmotic demyelination syndrome. The nurse should monitor neurological status, strict I&O, serial sodium levels, and ECG for signs of hypervolemia. Modern bipolar TURP techniques using normal saline irrigation have significantly reduced the incidence of TURP syndrome.",
    learningObjective: "Recognize TURP syndrome as a complication of transurethral prostate surgery caused by hypotonic irrigation fluid absorption",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "procedure-specific complications",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "TURP syndrome = dilutional hyponatremia from hypotonic irrigation absorption. Key lab: sodium <120 mEq/L with neurological symptoms. Bipolar TURP with saline has reduced this risk.",
    clinicalPearls: [
      "TURP syndrome: hypotonic irrigation absorption causing dilutional hyponatremia and fluid overload",
      "Glycine toxicity contributes to visual disturbances (glycine is a retinal neurotransmitter)",
      "Modern bipolar TURP with normal saline has significantly reduced TURP syndrome incidence"
    ],
    safetyNote: "Monitor sodium levels and neurological status closely after TURP — sodium <120 mEq/L can cause seizures and cerebral edema",
    distractorRationales: [
      "Postoperative delirium does not explain the severe hyponatremia of 118 mEq/L",
      "Sepsis from UTI would present with fever, tachycardia, and hemodynamic instability, not isolated hyponatremia",
      "Adrenal insufficiency is unlikely without a history of chronic steroid use and would present with hyperkalemia, not isolated hyponatremia"
    ]
  },
  {
    stem: "A postoperative nurse is monitoring a patient who underwent a left pneumonectomy. The nurse notices the mediastinal shift on the chest X-ray shows the trachea deviating to the RIGHT (away from the operative side). The patient's blood pressure is dropping and heart rate is increasing. What does this finding suggest?",
    options: [
      "Normal postoperative finding after pneumonectomy as the remaining lung expands",
      "Tension in the operative hemithorax from accumulation of fluid or air, causing mediastinal shift away from the operative side and cardiovascular compromise",
      "Pneumothorax of the remaining right lung",
      "Proper positioning of the chest tube with expected drainage"
    ],
    correctAnswer: 1,
    rationaleLong: "After pneumonectomy, the operative hemithorax gradually fills with serosanguineous fluid over days to weeks, and the mediastinum should remain midline or shift slightly TOWARD the operative side as the space fills. If the mediastinum shifts AWAY from the operative side (trachea deviating to the right in a left pneumonectomy), this indicates increased pressure in the operative hemithorax — either from excessive fluid accumulation, hemorrhage, or air under tension. This mediastinal shift compresses the remaining lung and great vessels, causing hemodynamic compromise (hypotension, tachycardia) and respiratory distress. This is an emergency. Importantly, chest tubes are typically NOT placed after pneumonectomy. A pneumonectomy space is meant to gradually fill with fluid and eventually organize into a fibrothorax. Placing a chest tube could cause rapid mediastinal shift by removing the fluid that maintains mediastinal position, or could introduce infection into the space. If a chest tube is placed, it is clamped and only opened briefly to allow small amounts of fluid or air drainage to maintain mediastinal position. The nurse should immediately notify the surgeon, position the patient with the operative side down (to prevent fluid from filling the remaining lung if a bronchopleural fistula is present), administer supplemental oxygen, and prepare for possible emergency thoracentesis or return to the operating room.",
    learningObjective: "Recognize mediastinal shift as an emergency after pneumonectomy and differentiate normal from pathological postoperative findings",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "thoracic surgery complications",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "After pneumonectomy, mediastinum should shift TOWARD the operative side (normal) or remain midline. Shift AWAY = emergency (tension in operative space).",
    clinicalPearls: [
      "Post-pneumonectomy: mediastinum should shift toward operative side; shift away = emergency",
      "Chest tubes are typically NOT placed after pneumonectomy (or if placed, kept clamped)",
      "Position patient with operative side DOWN if bronchopleural fistula is suspected"
    ],
    safetyNote: "Mediastinal shift away from the pneumonectomy side with hemodynamic instability requires immediate surgical intervention",
    distractorRationales: [
      "Normal post-pneumonectomy shift is toward the operative side, not away from it",
      "Pneumothorax of the remaining lung would shift the mediastinum toward the operative side, not away",
      "Chest tubes are not routinely placed after pneumonectomy"
    ]
  },
  {
    stem: "A patient reports a Numeric Pain Rating Scale (NRS) score of 8/10 after a laparoscopic cholecystectomy. The patient has a history of opioid use disorder and is currently on buprenorphine/naloxone (Suboxone) maintenance therapy. The surgeon has ordered hydromorphone 0.5 mg IV for breakthrough pain. What is the nurse's most appropriate action?",
    options: [
      "Administer the hydromorphone as ordered since the surgical pain overrides addiction concerns",
      "Consult with the anesthesiologist or pain service about appropriate analgesic management, as buprenorphine's receptor binding may reduce the effectiveness of the ordered opioid",
      "Withhold all opioids because the patient is on Suboxone and provide only non-opioid alternatives",
      "Discontinue the buprenorphine/naloxone and replace it entirely with the ordered hydromorphone"
    ],
    correctAnswer: 1,
    rationaleLong: "Managing acute postoperative pain in patients on buprenorphine maintenance therapy is complex and requires a nuanced approach. Buprenorphine is a partial mu-opioid receptor agonist with very high receptor binding affinity. When a patient is on buprenorphine, full mu-opioid agonists like hydromorphone may have reduced effectiveness because buprenorphine occupies the mu receptors and has a higher binding affinity. This means that standard doses of opioids may not provide adequate pain relief. The nurse should consult with the anesthesiologist, pain service, or addiction medicine team to develop an appropriate plan. Options may include: (1) Continuing buprenorphine and using higher doses of full agonist opioids with close monitoring (buprenorphine's ceiling effect on respiratory depression provides some safety margin); (2) Dividing the buprenorphine into more frequent, smaller doses to maximize its analgesic effect; (3) Temporarily discontinuing buprenorphine and using full agonist opioids with a plan to restart buprenorphine before discharge; (4) Maximizing multimodal analgesia (acetaminophen, NSAIDs, regional anesthesia, gabapentinoids, ketamine). Withholding all opioids is inappropriate for moderate-severe postoperative pain and violates the ethical obligation to treat pain. Abruptly discontinuing buprenorphine without a plan risks withdrawal and relapse.",
    learningObjective: "Manage acute postoperative pain in patients on buprenorphine maintenance therapy through appropriate consultation and multimodal analgesia",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "pain management in special populations",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Buprenorphine has high receptor affinity — standard opioid doses may be ineffective. Consultation with pain/addiction medicine is essential, not just giving more opioid.",
    clinicalPearls: [
      "Buprenorphine's high mu-receptor affinity can reduce effectiveness of full agonist opioids",
      "Patients on buprenorphine still deserve adequate pain management — withholding all opioids is unethical",
      "Multimodal analgesia is especially important in this population to reduce opioid requirements"
    ],
    safetyNote: "Always involve pain management or addiction medicine services when managing acute pain in patients on buprenorphine maintenance",
    distractorRationales: [
      "Administering standard opioid doses without understanding buprenorphine interactions may result in inadequate pain relief",
      "Withholding all opioids for severe pain is unethical and does not reflect evidence-based practice",
      "Abruptly discontinuing buprenorphine without a structured plan risks withdrawal and relapse"
    ]
  }
];
