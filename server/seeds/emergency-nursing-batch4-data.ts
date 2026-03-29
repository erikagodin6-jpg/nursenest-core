export interface EmergencyNursingQuestion {
  stem: string;
  options: string[];
  correctAnswer: number;
  rationaleLong: string;
  learningObjective: string;
  blueprintCategory: string;
  subtopic: string;
  difficulty: number;
  cognitiveLevel: string;
  questionType: string;
  examTrap: string;
  clinicalPearls: string[];
  safetyNote: string;
  distractorRationales: string[];
  lessonLink: string;
}

export const triageESIQuestions: EmergencyNursingQuestion[] = [
  {
    stem: "A 45-year-old male presents to the emergency department complaining of substernal chest pain radiating to his left arm for the past 30 minutes. He is diaphoretic with a blood pressure of 148/92 mmHg, heart rate of 110 bpm, respiratory rate of 22 breaths/min, and SpO2 of 96% on room air. He has a history of hypertension and smokes one pack per day. Using the Emergency Severity Index (ESI), what triage level should this patient receive?",
    options: [
      "ESI Level 1 - requires immediate life-saving intervention",
      "ESI Level 2 - high risk, confused, lethargic, or severe pain/distress",
      "ESI Level 3 - stable but expected to need two or more resources",
      "ESI Level 4 - stable, expected to need one resource"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient should be triaged as ESI Level 2 based on the Emergency Severity Index algorithm. ESI Level 2 is assigned to patients who present with high-risk situations, new-onset confusion or lethargy, or severe pain and distress. This patient presents with classic signs of acute coronary syndrome (ACS): substernal chest pain radiating to the left arm, diaphoresis, tachycardia, and significant cardiac risk factors including hypertension and smoking history. While the patient does not currently require immediate life-saving interventions such as intubation or defibrillation (which would make him ESI Level 1), his presentation represents a high-risk condition that could rapidly deteriorate. The triage nurse must recognize that ACS patients can develop lethal dysrhythmias, cardiogenic shock, or cardiac arrest without warning. ESI Level 2 patients should be placed in a treatment area immediately and should not wait in the waiting room. The triage nurse should obtain a 12-lead ECG within 10 minutes of arrival per ACC/AHA guidelines, establish IV access, and ensure the patient is on continuous cardiac monitoring. Pain assessment using a validated scale should also be documented. The distinction between ESI 1 and ESI 2 is critical: ESI 1 patients require immediate hands-on intervention to prevent death, while ESI 2 patients are in a high-risk situation that demands urgent evaluation but are currently maintaining their airway, breathing, and circulation without active resuscitation measures.",
    learningObjective: "Apply the Emergency Severity Index (ESI) triage algorithm to correctly categorize patients with acute coronary syndrome presentations",
    blueprintCategory: "Triage & ESI",
    subtopic: "ESI Level Assignment",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Students often over-triage chest pain to ESI 1, but ESI 1 requires active life-saving intervention (CPR, intubation, etc.), not just high-risk presentation",
    clinicalPearls: [
      "ESI Level 2 includes high-risk situations where delay could lead to significant morbidity or mortality",
      "A 12-lead ECG should be obtained within 10 minutes of arrival for all chest pain patients",
      "ESI Level 1 requires immediate life-saving intervention such as CPR, intubation, or cardioversion",
      "Triage is a dynamic process - reassess if patient condition changes"
    ],
    safetyNote: "Never delay ECG acquisition for chest pain patients regardless of initial triage assessment. Rapid identification of STEMI can significantly reduce door-to-balloon time.",
    distractorRationales: [
      "ESI Level 1 is incorrect because while this is a serious presentation, the patient currently maintains his own airway, breathing, and circulation and does not require immediate life-saving intervention",
      "ESI Level 3 is incorrect because this patient's presentation represents a high-risk condition that demands immediate evaluation, not a stable condition requiring resources",
      "ESI Level 4 is incorrect because this significantly underestimates the acuity of a patient with active chest pain and ACS symptoms"
    ],
    lessonLink: "/emergency/lessons/esi-triage-system"
  },
  {
    stem: "A 78-year-old female is brought to the ED by EMS after a ground-level fall at home. She is alert and oriented, complaining of right hip pain rated 7/10. Vital signs are: BP 132/78, HR 88, RR 16, SpO2 97%, temp 36.8C. She takes warfarin for atrial fibrillation. She has a visible deformity of the right lower extremity with external rotation and shortening. What ESI level should be assigned?",
    options: [
      "ESI Level 2 - high risk due to anticoagulation status and potential for hemorrhage",
      "ESI Level 3 - stable vital signs, will need imaging and labs",
      "ESI Level 4 - single resource needed (X-ray only)",
      "ESI Level 5 - simple evaluation, no resources needed"
    ],
    correctAnswer: 0,
    rationaleLong: "This geriatric patient on anticoagulation therapy with a hip fracture should be triaged as ESI Level 2. While her vital signs appear stable, several high-risk factors elevate her triage acuity. First, she is on warfarin (an anticoagulant), which significantly increases her risk of hemorrhagic complications. Hip fractures in anticoagulated patients can result in substantial blood loss into the thigh and retroperitoneal space, which may not be immediately apparent. Second, geriatric patients have diminished physiologic reserve and may not mount appropriate compensatory responses to hemorrhage - normal vital signs can be misleading. Third, ground-level falls in elderly patients on anticoagulants should prompt evaluation for occult injuries including intracranial hemorrhage, even when the mechanism seems minor. The ESI algorithm specifically identifies patients on anticoagulants with traumatic injuries as high-risk situations warranting ESI Level 2 designation. The triage nurse should prioritize this patient for rapid assessment, including point-of-care INR testing, CBC, and type and screen in addition to hip imaging. Pain management should be initiated promptly, as untreated pain in geriatric patients can lead to delirium, hemodynamic instability, and other complications. The external rotation and shortening of the extremity strongly suggest a femoral neck or intertrochanteric fracture, which typically requires surgical intervention. Early orthopedic consultation and admission planning should be anticipated.",
    learningObjective: "Recognize high-risk features in geriatric trauma patients that warrant elevated ESI triage levels including anticoagulation status",
    blueprintCategory: "Triage & ESI",
    subtopic: "Geriatric Triage",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not be falsely reassured by normal vital signs in geriatric patients - they may not mount appropriate tachycardic or hypotensive responses to hemorrhage",
    clinicalPearls: [
      "Anticoagulated patients with traumatic injuries are considered high-risk in ESI triage",
      "Elderly patients may lose up to 1500mL of blood into a fractured hip before showing hemodynamic changes",
      "Ground-level falls in anticoagulated elderly should prompt consideration of occult intracranial hemorrhage",
      "Geriatric vital signs may appear normal despite significant hemorrhage due to medication effects and diminished physiologic reserve"
    ],
    safetyNote: "Always check anticoagulation status during triage assessment. Anticoagulated patients with any traumatic mechanism require elevated vigilance for occult hemorrhage.",
    distractorRationales: [
      "ESI Level 3 underestimates the risk posed by anticoagulation combined with a significant fracture mechanism",
      "ESI Level 4 is incorrect as this patient will clearly need multiple resources including labs, imaging, and likely surgical consultation",
      "ESI Level 5 is grossly inappropriate for a patient with a hip fracture requiring comprehensive evaluation and intervention"
    ],
    lessonLink: "/emergency/lessons/geriatric-triage"
  },
  {
    stem: "During a busy Friday evening shift, the triage nurse receives five patients simultaneously. Which patient should be seen FIRST based on ESI triage principles?",
    options: [
      "A 25-year-old with a 2-cm laceration on the forearm from a kitchen knife, bleeding controlled with pressure",
      "A 3-year-old brought by parents with a fever of 39.5C (103.1F), rash, and irritability for 6 hours",
      "A 55-year-old complaining of intermittent chest pain for 3 days, currently pain-free with normal vital signs",
      "A 30-year-old with right lower quadrant pain, nausea, and low-grade fever of 38.2C (100.8F)"
    ],
    correctAnswer: 1,
    rationaleLong: "The 3-year-old with fever, rash, and irritability should be seen first based on ESI triage principles. This pediatric patient presents with a constellation of symptoms that raise concern for potentially life-threatening conditions including meningococcemia, meningitis, or other serious bacterial infections. In pediatric triage, the combination of high fever, rash, and altered behavior (irritability) in a young child represents a high-risk situation that warrants ESI Level 2 designation and immediate evaluation. The Pediatric Assessment Triangle (PAT) would likely identify abnormalities in appearance (irritability) that signal a potentially unstable child. Meningococcal disease can progress from fever and rash to septic shock and death within hours, making rapid assessment critical. The triage nurse should assess the rash characteristics - petechial or purpuric rashes that do not blanch are particularly concerning for meningococcemia. While all of these patients require evaluation, the urgency hierarchy based on ESI principles places this child ahead of the others. The laceration patient (ESI Level 4-5) has controlled bleeding and stable presentation. The chest pain patient who is currently pain-free (ESI Level 3) needs evaluation but is not in acute distress. The right lower quadrant pain patient (ESI Level 3) likely needs imaging and labs for possible appendicitis but is hemodynamically stable. Pediatric patients require special consideration in triage because their physiologic reserve is limited and they can decompensate rapidly.",
    learningObjective: "Prioritize triage assessment among multiple simultaneous patient arrivals using ESI principles with attention to pediatric high-risk presentations",
    blueprintCategory: "Triage & ESI",
    subtopic: "Pediatric Triage",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "PRIORITIZATION",
    examTrap: "The chest pain patient might seem highest priority, but being currently pain-free with normal vitals makes them ESI 3, while the febrile child with rash represents a potentially life-threatening emergency",
    clinicalPearls: [
      "Fever plus rash plus altered behavior in a young child is a red flag for meningococcemia until proven otherwise",
      "The Pediatric Assessment Triangle assesses appearance, work of breathing, and circulation to skin",
      "Children can compensate effectively until sudden cardiovascular collapse",
      "Non-blanching petechial or purpuric rashes are highly concerning for meningococcal disease"
    ],
    safetyNote: "Any febrile child with petechial rash should be isolated and evaluated immediately. Droplet precautions should be initiated for suspected meningococcal disease.",
    distractorRationales: [
      "The laceration with controlled bleeding is ESI Level 4-5 and can safely wait for evaluation",
      "The chest pain patient who is currently asymptomatic with normal vitals is ESI Level 3 and does not require immediate evaluation",
      "The RLQ pain patient is likely ESI Level 3 with possible appendicitis but is hemodynamically stable and can wait briefly"
    ],
    lessonLink: "/emergency/lessons/pediatric-triage"
  },
  {
    stem: "A 62-year-old male arrives at the ED via personal vehicle. He states he developed sudden onset of weakness on the right side of his body and difficulty speaking approximately 45 minutes ago. His wife noticed his face was drooping. Vital signs: BP 178/96, HR 92, RR 18, SpO2 98%, blood glucose 142 mg/dL. What is the correct ESI triage level and priority action?",
    options: [
      "ESI Level 3 - obtain CT scan and neurology consult",
      "ESI Level 1 - initiate stroke code alert immediately",
      "ESI Level 2 - place in acute care bed and activate stroke team",
      "ESI Level 4 - obtain basic labs and reassess"
    ],
    correctAnswer: 2,
    rationaleLong: "This patient should be triaged as ESI Level 2 with immediate activation of the stroke team. The presentation is classic for an acute ischemic stroke: sudden onset of unilateral weakness, speech difficulty (dysarthria or aphasia), and facial droop - all components of the Cincinnati Prehospital Stroke Scale. The critical factor here is the time of symptom onset - approximately 45 minutes ago, which places this patient well within the treatment window for thrombolytic therapy (alteplase) and potentially mechanical thrombectomy. The ESI Level 2 designation is appropriate because while the patient is not currently requiring immediate life-saving intervention (ruling out ESI 1), he is in a high-risk, time-sensitive situation where delays directly impact outcome. The concept of 'time is brain' means that approximately 1.9 million neurons are lost per minute during an acute ischemic stroke. The triage nurse should immediately activate the stroke code/alert system, which mobilizes the stroke team, expedites CT imaging, and prepares for potential thrombolytic administration. Blood glucose has already been checked (142 mg/dL), ruling out hypoglycemia as a stroke mimic. The elevated blood pressure (178/96) is expected in acute stroke and should not be aggressively treated unless it exceeds thrombolytic eligibility thresholds (generally >185/110 mmHg for alteplase). Door-to-CT time should be less than 25 minutes, and door-to-needle time for thrombolytics should be under 60 minutes per AHA/ASA guidelines. The triage nurse plays a critical role in initiating this time-sensitive cascade of care.",
    learningObjective: "Correctly triage and initiate time-critical stroke protocols for patients presenting with acute neurological deficits within the treatment window",
    blueprintCategory: "Triage & ESI",
    subtopic: "Triage Decision-Making",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Students may select ESI Level 1 because stroke seems life-threatening, but ESI 1 requires active intervention like intubation or CPR - the patient is maintaining airway and hemodynamics",
    clinicalPearls: [
      "Time of symptom onset is the single most critical piece of information for acute stroke triage",
      "Approximately 1.9 million neurons die per minute during acute ischemic stroke",
      "Door-to-CT time goal is under 25 minutes, door-to-needle under 60 minutes",
      "Blood glucose should be checked immediately to rule out hypoglycemia as a stroke mimic"
    ],
    safetyNote: "Never delay stroke team activation to complete a full triage assessment. Last known well time and blood glucose are the two most critical data points for initial stroke triage.",
    distractorRationales: [
      "ESI Level 3 dangerously underestimates the urgency and time-sensitivity of acute stroke presentation",
      "ESI Level 1 is technically incorrect as the patient is not requiring immediate life-saving intervention, though stroke code activation is warranted",
      "ESI Level 4 is completely inappropriate and could result in catastrophic delay of time-sensitive treatment"
    ],
    lessonLink: "/emergency/lessons/esi-triage-system"
  },
  {
    stem: "A 28-year-old female presents to triage stating she is 32 weeks pregnant and has had a severe headache for 2 hours with visual changes described as 'seeing spots.' Her blood pressure is 168/110 mmHg, and she has 2+ pitting edema in both lower extremities. She denies vaginal bleeding or fluid leakage. What is the appropriate triage action?",
    options: [
      "ESI Level 3 - obtain urine protein and basic metabolic panel",
      "ESI Level 4 - headache evaluation with one resource needed",
      "ESI Level 2 - immediate placement in treatment area and obstetric consultation",
      "ESI Level 5 - provide acetaminophen and reassess"
    ],
    correctAnswer: 2,
    rationaleLong: "This pregnant patient should be triaged as ESI Level 2 with immediate placement in a treatment area and urgent obstetric consultation. Her presentation is highly suspicious for severe preeclampsia, a potentially life-threatening obstetric emergency. The triad of severe hypertension (168/110 mmHg, with systolic greater than 160 or diastolic greater than 110 meeting criteria for severe range), headache, and visual disturbances in a pregnant patient beyond 20 weeks gestation is a classic presentation of severe preeclampsia with features. This condition can rapidly progress to eclampsia (seizures), HELLP syndrome (hemolysis, elevated liver enzymes, low platelets), placental abruption, or stroke. The peripheral edema provides additional supporting evidence. ESI Level 2 is appropriate because this represents a high-risk situation requiring immediate evaluation and intervention, but the patient is not currently seizing or in cardiovascular collapse (which would warrant ESI Level 1). The triage nurse should immediately place the patient on continuous fetal monitoring, obtain IV access, and have magnesium sulfate available at the bedside for seizure prophylaxis. Laboratory studies should include CBC, comprehensive metabolic panel, LDH, uric acid, and coagulation studies. Blood pressure should be monitored every 5 minutes until stable. The obstetric team should be notified immediately as this patient may require emergent delivery depending on maternal and fetal status. The ED nurse must be familiar with obstetric triage criteria as delays in recognizing severe preeclampsia can result in maternal and fetal mortality.",
    learningObjective: "Identify severe preeclampsia as an obstetric emergency requiring ESI Level 2 triage and immediate obstetric team activation",
    blueprintCategory: "Triage & ESI",
    subtopic: "Obstetric Triage",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not dismiss headache and visual changes in a pregnant patient as benign - these are warning signs of severe preeclampsia that can progress to eclampsia",
    clinicalPearls: [
      "Severe preeclampsia criteria include BP greater than 160/110 on two occasions, visual disturbances, persistent headache, and epigastric pain",
      "Magnesium sulfate is the first-line treatment for eclampsia prophylaxis and treatment",
      "Eclampsia can occur before, during, or after delivery",
      "HELLP syndrome can present without significant hypertension in some cases"
    ],
    safetyNote: "Have seizure precautions in place immediately for any pregnant patient with severe hypertension and neurological symptoms. Magnesium sulfate should be readily available.",
    distractorRationales: [
      "ESI Level 3 underestimates the urgency of severe preeclampsia which can rapidly progress to life-threatening complications",
      "ESI Level 4 is dangerously inappropriate for a patient with signs of severe preeclampsia",
      "ESI Level 5 with acetaminophen ignores the life-threatening nature of this presentation and could result in maternal and fetal death"
    ],
    lessonLink: "/emergency/lessons/obstetric-triage"
  },
  {
    stem: "A 35-year-old male is brought to the ED by police after being found agitated on the street, yelling at cars and attempting to remove his clothing. He is combative, diaphoretic, and hyperthermic with a temperature of 39.8C (103.6F). Heart rate is 132 bpm, BP 168/102, RR 24. His pupils are dilated. No identification is available and he is unable to provide coherent history. Using ESI triage, what level should be assigned?",
    options: [
      "ESI Level 3 - psychiatric evaluation needed",
      "ESI Level 4 - behavioral health assessment",
      "ESI Level 1 - immediate intervention needed for agitated delirium",
      "ESI Level 2 - high risk situation with altered mental status"
    ],
    correctAnswer: 3,
    rationaleLong: "This patient should be triaged as ESI Level 2 based on the presentation of altered mental status in a high-risk clinical context. The ESI algorithm specifically identifies patients who are confused, lethargic, or disoriented as ESI Level 2. This patient demonstrates altered mental status (inability to provide coherent history, combativeness, disrobing behavior), along with sympathomimetic toxidrome features including tachycardia, hypertension, hyperthermia, diaphoresis, and mydriasis (dilated pupils). This presentation is concerning for stimulant intoxication (cocaine, methamphetamine, synthetic cathinones), excited delirium syndrome, or other dangerous conditions including serotonin syndrome, anticholinergic toxicity, or thyroid storm. While the combativeness and agitation might initially suggest ESI Level 1 (requiring immediate intervention), ESI Level 2 is more appropriate because the patient is not in cardiac or respiratory arrest and does not yet require intubation or immediate resuscitative measures. However, this patient requires immediate de-escalation, pharmacological sedation, and comprehensive medical evaluation. The triage nurse should ensure adequate security presence, obtain core temperature measurement, and prepare for potential rapid deterioration. Excited delirium syndrome carries a significant mortality risk, and these patients can develop rhabdomyolysis, metabolic acidosis, hyperkalemia, and sudden cardiac arrest. The psychiatric versus medical emergency distinction is critical - this patient requires medical clearance before any psychiatric evaluation. Active cooling measures should be considered for temperatures above 39C, and benzodiazepines are the preferred first-line pharmacological intervention for sympathomimetic agitation.",
    learningObjective: "Triage agitated patients with altered mental status and sympathomimetic features as high-risk ESI Level 2 presentations requiring medical evaluation before psychiatric assessment",
    blueprintCategory: "Triage & ESI",
    subtopic: "Psychiatric Triage",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Never assume an agitated patient is purely psychiatric - the vital sign abnormalities and sympathomimetic signs indicate a medical emergency requiring medical evaluation first",
    clinicalPearls: [
      "Altered mental status with vital sign abnormalities is a medical emergency until proven otherwise",
      "The sympathomimetic toxidrome includes tachycardia, hypertension, hyperthermia, diaphoresis, and mydriasis",
      "Excited delirium carries significant mortality risk from rhabdomyolysis, metabolic acidosis, and sudden cardiac death",
      "Benzodiazepines are first-line treatment for sympathomimetic agitation - avoid antipsychotics as sole agents"
    ],
    safetyNote: "Ensure adequate security and team response before approaching combative patients. Chemical sedation with benzodiazepines should be available for rapid administration.",
    distractorRationales: [
      "ESI Level 3 underestimates the severity - this patient has altered mental status and dangerous vital sign abnormalities",
      "ESI Level 4 is inappropriate for a combative patient with altered mental status and abnormal vital signs",
      "ESI Level 1 could be argued but the patient is not currently in arrest or requiring immediate airway intervention"
    ],
    lessonLink: "/emergency/lessons/psychiatric-triage"
  },
  {
    stem: "The ED is currently at 120% capacity with 15 patients in the waiting room. The triage nurse identifies that two patients who were triaged as ESI Level 3 have been waiting for 90 minutes. Upon reassessment, one patient with abdominal pain now reports worsening pain rated 9/10 with new-onset vomiting, and the other patient with a wrist injury reports unchanged pain at 5/10. What is the most appropriate triage nursing action?",
    options: [
      "Maintain both patients at ESI Level 3 and document reassessment findings",
      "Upgrade the abdominal pain patient to ESI Level 2 and maintain the wrist injury at ESI Level 3",
      "Move both patients to the front of the ESI Level 3 queue",
      "Request the charge nurse to open additional treatment spaces for all ESI Level 3 patients"
    ],
    correctAnswer: 1,
    rationaleLong: "The most appropriate action is to upgrade the abdominal pain patient to ESI Level 2 while maintaining the wrist injury patient at ESI Level 3. Triage is a dynamic, ongoing process that requires continuous reassessment of waiting patients. The abdominal pain patient has demonstrated clinical deterioration with worsening pain from an unspecified level to 9/10 and development of a new symptom (vomiting). This clinical change suggests a possible evolving surgical emergency such as appendiceal perforation, bowel obstruction, or mesenteric ischemia. The worsening trajectory and severe pain meet the ESI Level 2 criteria for severe pain or distress in a high-risk situation. In contrast, the wrist injury patient with unchanged symptoms at a moderate pain level remains appropriately triaged at ESI Level 3. The triage nurse has both the authority and the responsibility to re-triage patients based on reassessment findings. This is particularly important during periods of ED overcrowding when patients may experience prolonged wait times. The Emergency Nurses Association (ENA) and American College of Emergency Physicians (ACEP) both recommend structured reassessment intervals based on ESI level: ESI Level 2 every 15 minutes, ESI Level 3 every 30-60 minutes, and ESI Level 4-5 every 60-120 minutes. During overcrowding, the triage nurse should maintain heightened vigilance for patients whose conditions are changing. Documentation of reassessment findings and any triage level changes is essential for patient safety and medicolegal protection. The triage nurse should also communicate the re-triage decision to the charge nurse and attending provider to facilitate bed placement.",
    learningObjective: "Apply dynamic triage reassessment principles to identify clinical deterioration and appropriately upgrade ESI triage levels during ED overcrowding",
    blueprintCategory: "Triage & ESI",
    subtopic: "Reassessment Timing",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Triage is not a one-time assessment - patients must be reassessed at regular intervals, and triage levels can and should be changed when clinical status changes",
    clinicalPearls: [
      "Triage reassessment intervals: ESI 2 every 15 min, ESI 3 every 30-60 min, ESI 4-5 every 60-120 min",
      "Worsening pain with new symptoms indicates clinical deterioration requiring re-triage",
      "The triage nurse has authority to upgrade or downgrade ESI levels based on reassessment",
      "ED overcrowding increases risk of adverse outcomes for waiting patients"
    ],
    safetyNote: "During ED overcrowding, implement structured reassessment protocols to catch deteriorating patients. Document all reassessment findings including stable patients.",
    distractorRationales: [
      "Maintaining both at ESI 3 ignores the clinical deterioration of the abdominal pain patient",
      "Moving both to the front of the queue does not address the acuity change and is not consistent with ESI methodology",
      "Requesting additional treatment spaces is a charge nurse/administrative action that does not address the immediate clinical priority of the deteriorating patient"
    ],
    lessonLink: "/emergency/lessons/esi-triage-system"
  },
  {
    stem: "A 19-year-old college student presents to triage with complaints of sore throat, fever of 38.4C (101.1F), and difficulty swallowing for 2 days. She denies shortness of breath, drooling, or voice changes. She has no medical history and takes no medications. Vital signs: BP 118/72, HR 92, RR 16, SpO2 99%. On visual inspection, the triage nurse notes bilateral tonsillar enlargement with white exudates. What ESI level is appropriate?",
    options: [
      "ESI Level 2 - airway compromise risk",
      "ESI Level 3 - likely needs labs and possible medications",
      "ESI Level 4 - one resource needed (rapid strep test)",
      "ESI Level 5 - no resources needed"
    ],
    correctAnswer: 2,
    rationaleLong: "This patient should be triaged as ESI Level 4, which indicates a stable patient expected to require one resource. The key to ESI level assignment for patients who are not Level 1 or Level 2 is resource prediction. This patient presents with a straightforward pharyngitis presentation that will likely require a single resource: a rapid strep test or throat culture. ESI Levels 3, 4, and 5 are differentiated by the predicted number of resources the patient will need. ESI Level 3 patients are expected to need two or more resources (labs, imaging, IV medications, specialty consultation), ESI Level 4 patients need one resource, and ESI Level 5 patients need no resources (prescription refill, wound recheck). Resources in the ESI algorithm include lab tests, imaging studies, IV fluids or medications, specialty consultation, and procedures. Importantly, oral medications, prescriptions, phone calls, and simple wound care are NOT counted as resources. This patient will likely need a rapid strep test (one resource) and potentially a prescription for antibiotics if positive, but the prescription itself does not count as a resource. The absence of danger signs (no drooling, no voice changes, no stridor, no respiratory distress, normal oxygen saturation) rules out concerning diagnoses such as peritonsillar abscess, epiglottitis, or retropharyngeal abscess that would elevate the triage level. However, the triage nurse should document the absence of these red flags and advise the patient to alert staff immediately if breathing difficulty develops while waiting.",
    learningObjective: "Apply ESI resource prediction to differentiate between ESI Levels 3, 4, and 5 for patients with uncomplicated upper respiratory presentations",
    blueprintCategory: "Triage & ESI",
    subtopic: "ESI Level Assignment",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "In the ESI algorithm, prescriptions and oral medications do NOT count as resources when predicting ESI level - only labs, imaging, IV meds, consults, and procedures count",
    clinicalPearls: [
      "ESI resource counting: labs, imaging, IV fluids/meds, specialty consults, and procedures count as resources",
      "Oral medications, prescriptions, phone calls, and simple wound care do NOT count as ESI resources",
      "Drooling, voice changes (hot potato voice), and stridor are red flags for deep space infections",
      "Peritonsillar abscess presents with trismus, uvular deviation, and muffled voice"
    ],
    safetyNote: "Always assess for airway red flags in sore throat patients: drooling, stridor, voice changes, and inability to handle secretions indicate potential airway emergency.",
    distractorRationales: [
      "ESI Level 2 is incorrect because the patient has no signs of airway compromise or hemodynamic instability",
      "ESI Level 3 overestimates the resources needed for an uncomplicated pharyngitis presentation",
      "ESI Level 5 is incorrect because the patient will need at least one resource (rapid strep test)"
    ],
    lessonLink: "/emergency/lessons/esi-triage-system"
  },
  {
    stem: "A 6-month-old infant is brought to the ED by parents who report the baby has been 'fussy and not eating well' for 12 hours. The infant had a fever of 38.9C (102F) at home. On arrival, the infant appears pale, has a weak cry, and has a sunken anterior fontanelle. Capillary refill is 4 seconds. Vital signs: HR 190, RR 52, temp 39.1C (102.4F), SpO2 95%. What ESI level should be assigned?",
    options: [
      "ESI Level 3 - febrile infant needing labs and possible admission",
      "ESI Level 2 - high-risk pediatric presentation with concerning findings",
      "ESI Level 1 - immediate resuscitation required",
      "ESI Level 4 - one resource needed for fever evaluation"
    ],
    correctAnswer: 1,
    rationaleLong: "This infant should be triaged as ESI Level 2 based on multiple high-risk features. Using the Pediatric Assessment Triangle (PAT), this infant demonstrates abnormalities in all three components: Appearance (pale, weak cry, poor feeding - indicating abnormal work of breathing or central nervous system function), Work of Breathing (tachypnea at 52 breaths per minute), and Circulation to Skin (pallor, prolonged capillary refill at 4 seconds, sunken fontanelle indicating dehydration). The vital signs reveal significant tachycardia (HR 190 - well above normal for age), tachypnea, persistent fever, and borderline low oxygen saturation. The combination of fever, poor feeding, irritability, dehydration signs (sunken fontanelle), and prolonged capillary refill in a 6-month-old infant represents a high-risk situation that could indicate sepsis, meningitis, urinary tract infection, or other serious bacterial infection. Infants under 90 days with fever are automatically considered high-risk, and while this infant is 6 months old, the severity of presentation warrants ESI Level 2. The triage nurse should immediately notify the treatment team, as this infant may need emergent fluid resuscitation, blood cultures, urinalysis, lumbar puncture, and empiric antibiotic therapy. While the infant is not yet in cardiac or respiratory arrest (ruling out ESI 1), the clinical trajectory suggests potential rapid deterioration. Weight-based medication doses should be calculated using the Broselow tape or estimated weight. IV or IO access should be established promptly for fluid resuscitation with 20 mL/kg normal saline boluses.",
    learningObjective: "Recognize high-risk features in febrile infants using the Pediatric Assessment Triangle and assign appropriate ESI triage level",
    blueprintCategory: "Triage & ESI",
    subtopic: "Pediatric Triage",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A febrile infant with prolonged capillary refill and tachycardia is showing signs of compensated shock - do not wait for hypotension to recognize pediatric shock",
    clinicalPearls: [
      "The Pediatric Assessment Triangle (PAT) assesses Appearance, Work of Breathing, and Circulation to Skin",
      "Sunken fontanelle indicates moderate to severe dehydration in infants",
      "Pediatric patients maintain blood pressure until late in shock - tachycardia and capillary refill are earlier indicators",
      "Normal heart rate for a 6-month-old is 100-150 bpm - HR 190 indicates significant tachycardia"
    ],
    safetyNote: "Never delay resuscitation in a febrile infant with signs of poor perfusion. Hypotension is a late and ominous sign of pediatric shock.",
    distractorRationales: [
      "ESI Level 3 underestimates the severity of this presentation - the infant shows signs of compensated shock",
      "ESI Level 1 could be considered but the infant is not yet in arrest or requiring immediate intubation/CPR",
      "ESI Level 4 is dangerously inappropriate for a febrile infant with signs of hemodynamic compromise"
    ],
    lessonLink: "/emergency/lessons/pediatric-triage"
  },
  {
    stem: "An 82-year-old nursing home resident is brought to the ED for 'altered mental status.' The facility reports he was 'acting differently' this morning but could not provide specific details. His baseline mental status per records is alert and oriented to person and place. Currently, he responds to voice but is confused, speaking in incomplete sentences. Vital signs: BP 98/54, HR 108, RR 22, temp 38.6C (101.5F), SpO2 93% on room air. What ESI level is most appropriate?",
    options: [
      "ESI Level 3 - needs workup for altered mental status",
      "ESI Level 1 - unresponsive patient requiring resuscitation",
      "ESI Level 4 - basic evaluation with one resource",
      "ESI Level 2 - altered mental status from baseline with abnormal vital signs"
    ],
    correctAnswer: 3,
    rationaleLong: "This patient should be triaged as ESI Level 2 based on altered mental status from baseline combined with significantly abnormal vital signs suggesting a serious underlying condition. The ESI algorithm specifically identifies patients with new-onset confusion or altered mental status as ESI Level 2 candidates. This patient's baseline is alert and oriented to person and place, but he is now confused and speaking in incomplete sentences - representing a significant change from baseline. The vital signs paint a concerning clinical picture: hypotension (98/54), tachycardia (108), mild tachypnea (22), low-grade fever (38.6C), and hypoxemia (SpO2 93%). This constellation of findings in an elderly patient is highly suspicious for sepsis. Applying the qSOFA criteria (quick Sequential Organ Failure Assessment), this patient meets at least 2 of 3 criteria: altered mental status (GCS less than 15) and systolic blood pressure less than or equal to 100 mmHg, with respiratory rate of 22 being at the threshold. A qSOFA score of 2 or greater in a patient with suspected infection is associated with increased mortality and should trigger consideration for ICU-level care. The triage nurse should immediately place this patient in a treatment area, establish IV access, obtain blood cultures, lactate level, and initiate fluid resuscitation per the sepsis bundle. The one-hour sepsis bundle includes measuring lactate, obtaining blood cultures, administering broad-spectrum antibiotics, beginning rapid fluid resuscitation with 30 mL/kg crystalloid for hypotension or lactate greater than 4 mmol/L, and applying vasopressors if hypotension persists despite fluid resuscitation.",
    learningObjective: "Recognize the significance of altered mental status from baseline in geriatric patients and apply qSOFA screening criteria during triage assessment",
    blueprintCategory: "Triage & ESI",
    subtopic: "Geriatric Triage",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not confuse ESI Level 1 (requires immediate intervention like CPR or intubation) with ESI Level 2 (high-risk but not requiring hands-on resuscitation yet)",
    clinicalPearls: [
      "qSOFA criteria: altered mental status, SBP <=100, RR >=22 - two or more suggests sepsis with increased mortality risk",
      "Altered mental status may be the earliest and only sign of serious illness in elderly patients",
      "Baseline mental status must be established to recognize acute changes in geriatric patients",
      "The one-hour sepsis bundle should be initiated within 60 minutes of recognition"
    ],
    safetyNote: "Elderly patients with altered mental status and abnormal vital signs should be presumed septic until proven otherwise. Initiate sepsis screening and bundle within one hour.",
    distractorRationales: [
      "ESI Level 3 underestimates the severity - altered mental status with hemodynamic instability is high-risk",
      "ESI Level 1 is incorrect because while the patient is altered, he is responding to voice and does not require immediate CPR or intubation",
      "ESI Level 4 is dangerously inappropriate for a patient with altered mental status and vital sign abnormalities"
    ],
    lessonLink: "/emergency/lessons/geriatric-triage"
  },
  {
    stem: "The ED has implemented a new protocol to reduce the 'left without being seen' (LWBS) rate, which is currently at 8%. As the triage nurse, which strategy has the strongest evidence for reducing LWBS rates?",
    options: [
      "Adding a greeter at the ED entrance to direct patients to the appropriate area",
      "Implementing a provider-in-triage (PIT) model to initiate orders at triage",
      "Extending triage nurse hours to provide 24/7 double coverage",
      "Creating a fast-track area staffed by an advanced practice provider for ESI 4-5 patients"
    ],
    correctAnswer: 1,
    rationaleLong: "Implementing a provider-in-triage (PIT) model has the strongest evidence for reducing LWBS rates. The PIT model places a physician or advanced practice provider at the triage point to perform rapid medical screening exams, initiate diagnostic orders, and begin treatment during the triage process. Research consistently demonstrates that PIT models reduce LWBS rates by 20-50%, decrease overall length of stay, and improve patient satisfaction. The PIT model works by 'front-loading' the care process - instead of patients waiting to be seen after triage, they receive their initial medical evaluation and have orders placed during the triage encounter. This means diagnostic results (lab work, imaging) are often available by the time a treatment bed becomes available, significantly shortening the total ED visit. Multiple studies published in the Annals of Emergency Medicine and the Journal of Emergency Nursing have demonstrated the effectiveness of PIT models in reducing LWBS rates. A typical PIT process includes: triage nurse performs initial assessment and ESI level assignment, the PIT provider performs a focused medical screening exam, orders are entered based on the provider's assessment, and the patient is moved to the appropriate treatment area. The LWBS rate is a critical quality metric because patients who leave before being seen may have serious undiagnosed conditions and represent both a clinical risk and a medicolegal liability. An 8% LWBS rate exceeds the benchmark of less than 2% recommended by the American College of Emergency Physicians. While all of the listed strategies can contribute to improved patient flow, the PIT model has the most robust evidence base for specifically targeting LWBS reduction.",
    learningObjective: "Identify evidence-based strategies for reducing left-without-being-seen rates in emergency departments, with emphasis on the provider-in-triage model",
    blueprintCategory: "Triage & ESI",
    subtopic: "Left-Without-Being-Seen Prevention",
    difficulty: 3,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "While fast-track areas help with lower acuity patients, the PIT model addresses LWBS across all acuity levels by initiating care earlier in the visit",
    clinicalPearls: [
      "Provider-in-triage models reduce LWBS rates by 20-50% in published studies",
      "The ACEP benchmark for LWBS rate is less than 2%",
      "LWBS patients represent both clinical risk and medicolegal liability",
      "Front-loading diagnostic orders at triage reduces overall length of stay"
    ],
    safetyNote: "Patients who leave without being seen may have serious undiagnosed conditions. Implement callback procedures for LWBS patients, especially those triaged as ESI Level 2 or 3.",
    distractorRationales: [
      "An entrance greeter improves patient experience but does not significantly reduce LWBS rates",
      "Double triage coverage may reduce wait times but does not address the root cause of LWBS (prolonged total visit time)",
      "Fast-track areas help with ESI 4-5 flow but do not address LWBS across all acuity levels"
    ],
    lessonLink: "/emergency/lessons/esi-triage-system"
  },
  {
    stem: "A triage nurse is using the Emergency Severity Index to assess a 50-year-old male presenting with left flank pain radiating to the groin, rated 10/10, with nausea and vomiting. He is writhing on the stretcher and unable to find a comfortable position. Vital signs: BP 156/94, HR 112, RR 20, temp 37.2C, SpO2 99%. Urinalysis dipstick at triage shows positive blood. What is the appropriate ESI triage level?",
    options: [
      "ESI Level 4 - urinalysis confirms renal colic, simple treatment needed",
      "ESI Level 2 - severe pain and distress requiring urgent evaluation",
      "ESI Level 3 - needs CT scan and pain management",
      "ESI Level 5 - self-limited condition requiring no resources"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient should be triaged as ESI Level 2 based on severe pain and distress. The ESI algorithm includes 'severe pain/distress' as a criterion for ESI Level 2 assignment. This patient is presenting with classic renal colic symptoms: acute flank pain radiating to the groin (following the ureteral path), inability to find a comfortable position (often described as colicky or writhing), nausea and vomiting, and microscopic hematuria on urinalysis. While renal colic is generally a self-limited condition, the severity of pain this patient is experiencing (rated 10/10 with writhing behavior and tachycardia likely due to pain) meets the ESI Level 2 threshold for severe distress. The elevated heart rate of 112 and blood pressure of 156/94 are likely pain-driven sympathetic responses. The triage nurse must recognize that patients in severe pain require urgent evaluation and treatment. Additionally, severe flank pain can also represent other serious conditions including ruptured abdominal aortic aneurysm, renal artery dissection, or renal infarction - conditions that are potentially life-threatening. Therefore, until the diagnosis is confirmed with imaging, the higher acuity level is appropriate. ESI Level 3 might seem reasonable since the patient will need CT imaging and IV pain management (two or more resources), but the severe distress component elevates this to Level 2. The distinction matters because ESI Level 2 patients should be placed in treatment areas immediately, while ESI Level 3 patients may wait. Delaying pain management for renal colic is both inhumane and may cause hemodynamic instability from the pain response.",
    learningObjective: "Apply the ESI Level 2 'severe pain/distress' criterion to patients presenting with acute renal colic and recognize the importance of pain severity in triage decisions",
    blueprintCategory: "Triage & ESI",
    subtopic: "ESI Level Assignment",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Even though renal colic is often benign, severe pain causing inability to be still meets ESI Level 2 criteria for severe pain/distress",
    clinicalPearls: [
      "ESI Level 2 includes patients with severe pain or distress regardless of the underlying condition",
      "Classic renal colic triad: flank pain radiating to groin, nausea/vomiting, hematuria",
      "Patients with renal colic cannot find a comfortable position, unlike peritonitis patients who remain still",
      "Always consider AAA rupture in the differential for acute flank pain, especially in males over 50"
    ],
    safetyNote: "Acute flank pain in patients over 50 should prompt consideration of aortic aneurysm in addition to renal colic. Bedside ultrasound can rapidly screen for AAA.",
    distractorRationales: [
      "ESI Level 4 underestimates the severity of pain and the resources this patient will require",
      "ESI Level 3 does not account for the severe distress criterion that elevates this to Level 2",
      "ESI Level 5 is completely inappropriate for a patient in severe distress requiring multiple interventions"
    ],
    lessonLink: "/emergency/lessons/esi-triage-system"
  },
  {
    stem: "A 42-year-old female with a history of bipolar disorder presents to triage stating she wants to kill herself. She reports taking 'a handful of pills' approximately one hour ago but will not specify the medication. She is tearful but alert, oriented, and hemodynamically stable with vital signs: BP 122/76, HR 88, RR 16, SpO2 99%, temp 36.9C. What is the most appropriate ESI triage level and initial action?",
    options: [
      "ESI Level 3 - obtain labs and toxicology screen while patient waits",
      "ESI Level 2 - immediate placement with 1:1 observation and toxicology evaluation",
      "ESI Level 4 - psychiatric evaluation with one resource needed",
      "ESI Level 1 - immediate gastric lavage required"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient should be triaged as ESI Level 2 with immediate placement in a treatment area and 1:1 continuous observation. This presentation involves two critical issues: active suicidal ideation with a reported ingestion, and an unknown substance ingestion with potential for delayed toxicity. The ESI algorithm considers patients who are suicidal as high-risk, warranting ESI Level 2. The unknown ingestion adds medical urgency because many common medications available to psychiatric patients (lithium, tricyclic antidepressants, acetaminophen, anticonvulsants) can have delayed toxic effects that may not manifest with initial normal vital signs. The triage nurse must initiate several immediate actions: place the patient on 1:1 continuous observation (suicide precaution), remove all potentially harmful items from the patient's possession and environment (ligature risks, sharps, medications), establish IV access, obtain stat labs including comprehensive metabolic panel, hepatic function tests, acetaminophen level, salicylate level, and serum drug screen. The refusal to identify the ingested substance should heighten concern rather than minimize it. The timing of one hour post-ingestion means the patient may still be in the absorption phase for many drugs. Acetaminophen is particularly dangerous because patients may appear completely well for the first 24 hours while developing fatal hepatotoxicity. A 4-hour acetaminophen level is essential regardless of reported ingestion substance. The patient should not be left alone at any time, as suicidal patients in the ED are at risk for elopement or self-harm using environmental hazards. Psychiatric evaluation should occur after medical stabilization and clearance.",
    learningObjective: "Correctly triage suicidal patients with reported ingestions as ESI Level 2 and implement immediate safety and medical evaluation protocols",
    blueprintCategory: "Triage & ESI",
    subtopic: "Psychiatric Triage",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Normal vital signs after ingestion do NOT indicate safety - many toxic ingestions have delayed onset of symptoms (acetaminophen, lithium, sustained-release formulations)",
    clinicalPearls: [
      "Suicidal patients with reported ingestions require both psychiatric and medical evaluation",
      "Acetaminophen levels should be drawn at 4 hours post-ingestion regardless of reported substance",
      "Normal vital signs do not rule out dangerous ingestion - many toxic effects are delayed",
      "Environmental safety assessment (ligature risks, sharps, medications) is essential for suicidal patients in the ED"
    ],
    safetyNote: "Never leave a suicidal patient unattended in the ED. Implement 1:1 observation, remove all potential means of self-harm, and ensure the environment is safe.",
    distractorRationales: [
      "ESI Level 3 is inappropriate because the combination of suicidal ideation and unknown ingestion requires immediate evaluation, not waiting in the waiting room",
      "ESI Level 4 dangerously underestimates the acuity of a suicidal patient with a reported ingestion",
      "ESI Level 1 with gastric lavage is incorrect - gastric lavage is rarely indicated and the patient is not requiring immediate life-saving intervention"
    ],
    lessonLink: "/emergency/lessons/psychiatric-triage"
  },
  {
    stem: "The ED is experiencing a surge with all beds occupied and 22 patients in the waiting room. The triage nurse receives a radio report of an incoming ambulance with a 68-year-old male in ventricular fibrillation with CPR in progress. Which action by the triage nurse demonstrates appropriate overcrowding management?",
    options: [
      "Direct EMS to divert to the nearest available hospital",
      "Clear a resuscitation bay by identifying the most stable patient for hallway placement and activate the code team",
      "Ask EMS to continue CPR in the ambulance bay until a bed becomes available",
      "Place the patient in the waiting room with a portable monitor until a treatment bed opens"
    ],
    correctAnswer: 1,
    rationaleLong: "The correct action is to immediately clear a resuscitation bay by identifying the most stable patient for temporary hallway placement while simultaneously activating the code team. This demonstrates appropriate overcrowding management by applying the fundamental triage principle that the sickest patients receive priority access to treatment resources. A patient in ventricular fibrillation with CPR in progress is ESI Level 1 - requiring immediate life-saving intervention. Under EMTALA (Emergency Medical Treatment and Labor Act), hospitals with emergency departments are obligated to provide medical screening examinations and stabilizing treatment regardless of capacity. Diverting an ambulance with a patient in active cardiac arrest is inappropriate and potentially illegal unless the facility lacks the fundamental capability to manage the emergency. The triage nurse should work with the charge nurse to rapidly identify a patient in an acute care bed who is stable enough for temporary hallway placement - this might be a patient awaiting discharge, a patient awaiting admission with stable vital signs, or a patient with a minor complaint who was placed in a bed before the surge. The code team should be activated before the patient arrives so that all necessary team members, equipment, and medications are ready. The ambulance bay and waiting room are not appropriate locations for ongoing cardiac arrest management, as they lack the necessary equipment, space, and infrastructure for effective resuscitation. The triage nurse's role in overcrowding management includes facilitating patient flow, identifying potential bed availability, and ensuring that the highest acuity patients receive immediate access to appropriate treatment spaces.",
    learningObjective: "Demonstrate appropriate ED overcrowding management when receiving a critically ill patient, including bed clearing strategies and code team activation",
    blueprintCategory: "Triage & ESI",
    subtopic: "Overcrowding Management",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "EMTALA requires hospitals to provide stabilizing treatment regardless of capacity - diverting an actively dying patient is not an option",
    clinicalPearls: [
      "EMTALA prohibits turning away patients requiring emergency stabilization regardless of bed availability",
      "The charge nurse and triage nurse should collaboratively manage bed flow during overcrowding",
      "Hallway placement of stable patients is an acceptable temporary measure to accommodate critical arrivals",
      "Code team activation should occur before patient arrival when possible to minimize delays"
    ],
    safetyNote: "Active cardiac arrest management requires a dedicated resuscitation bay with full monitoring, defibrillation capability, and adequate space for the resuscitation team.",
    distractorRationales: [
      "Diverting an ambulance with an actively dying patient violates EMTALA and is clinically inappropriate",
      "Having EMS continue CPR in the ambulance bay delays definitive care and is not sustainable",
      "The waiting room lacks the equipment, space, and monitoring capability for cardiac arrest management"
    ],
    lessonLink: "/emergency/lessons/overcrowding-management"
  },
  {
    stem: "A 70-year-old female presents to triage with progressive shortness of breath over 3 days, now unable to speak in full sentences. She has a history of heart failure with an EF of 30%. Vital signs: BP 88/58, HR 128, RR 32, SpO2 84% on room air, temp 36.5C. She has bilateral crackles, JVD, and 3+ pitting edema. What ESI level should be assigned?",
    options: [
      "ESI Level 2 - acute heart failure exacerbation requiring urgent treatment",
      "ESI Level 1 - immediate life-saving intervention required",
      "ESI Level 3 - needs chest X-ray, labs, and diuretics",
      "ESI Level 4 - needs one resource for evaluation"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient should be triaged as ESI Level 1 - requiring immediate life-saving intervention. The clinical presentation indicates acute decompensated heart failure with respiratory failure and cardiogenic shock. Key findings include: severe hypoxemia (SpO2 84% on room air), respiratory distress with inability to speak in full sentences and tachypnea (RR 32), hemodynamic instability with hypotension (88/58) and tachycardia (128), and clinical signs of fluid overload (bilateral crackles, JVD, peripheral edema). This patient requires immediate intervention to prevent respiratory arrest and cardiovascular collapse. The SpO2 of 84% represents significant hypoxemia that may require emergent non-invasive positive pressure ventilation (CPAP/BiPAP) or endotracheal intubation if she cannot maintain her airway or oxygenation. Non-invasive ventilation with CPAP or BiPAP is a life-saving intervention that qualifies this patient for ESI Level 1. The hypotension in the setting of heart failure with reduced ejection fraction (EF 30%) suggests cardiogenic shock, which may require vasopressor support. The ESI Level 1 designation means this patient must be taken directly to a treatment area with immediate physician evaluation and intervention. The triage nurse should apply supplemental oxygen immediately (non-rebreather mask or high-flow nasal cannula if BiPAP is not immediately available), position the patient upright to optimize respiratory mechanics, and ensure the resuscitation team is ready. This is not a situation where the patient can wait even briefly - the combination of severe hypoxemia, respiratory distress, and hemodynamic instability represents an immediately life-threatening presentation.",
    learningObjective: "Identify ESI Level 1 presentations in patients with acute decompensated heart failure requiring immediate life-saving respiratory and hemodynamic interventions",
    blueprintCategory: "Triage & ESI",
    subtopic: "ESI Level Assignment",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "SpO2 of 84% with respiratory distress and hemodynamic instability requires IMMEDIATE intervention (BiPAP/intubation) - this is ESI Level 1, not Level 2",
    clinicalPearls: [
      "ESI Level 1 is assigned when a patient needs an immediate life-saving intervention such as intubation, BiPAP, defibrillation, or CPR",
      "BiPAP/CPAP is a life-saving intervention for acute pulmonary edema that reduces intubation rates",
      "Cardiogenic shock presents with hypotension, tachycardia, elevated JVP, and pulmonary edema",
      "Inability to speak in full sentences indicates severe respiratory distress"
    ],
    safetyNote: "Apply supplemental oxygen immediately for any patient with SpO2 below 90%. Do not wait for bed placement or physician orders to initiate oxygen therapy.",
    distractorRationales: [
      "ESI Level 2 underestimates the severity - this patient needs immediate intervention (BiPAP/intubation) not just urgent evaluation",
      "ESI Level 3 is completely inappropriate for a patient in respiratory failure with hemodynamic instability",
      "ESI Level 4 is dangerously incorrect and could result in the patient's death from respiratory arrest"
    ],
    lessonLink: "/emergency/lessons/esi-triage-system"
  },
  {
    stem: "During triage assessment, a nurse notices that a 4-year-old child has multiple bruises in various stages of healing on the trunk and buttocks, along with a patterned burn on the left hand. The parent states the child 'falls a lot.' The child appears withdrawn and flinches when approached. Which triage action takes priority?",
    options: [
      "Document findings and triage normally based on the presenting complaint",
      "Confront the parent about the suspicious injury pattern",
      "Assign ESI Level 2, ensure the child is not left alone with the suspected abuser, and initiate mandatory reporting",
      "Assign ESI Level 3 and request a social work consult when available"
    ],
    correctAnswer: 2,
    rationaleLong: "The triage nurse should assign ESI Level 2, ensure the child's immediate safety by not leaving the child alone with the suspected abuser, and initiate mandatory reporting. This presentation has multiple red flags for non-accidental trauma (child abuse): bruises in various stages of healing suggesting repeated injury, bruising on the trunk and buttocks (unusual locations for accidental injury in a young child), patterned burn (indicating an object was used), behavioral indicators (withdrawn behavior, flinching), and an inconsistent history ('falls a lot' does not explain patterned burns or trunk bruising). The triage nurse is a mandated reporter and has a legal and ethical obligation to report suspected child abuse. The child's safety is the immediate priority. ESI Level 2 is appropriate because this is a high-risk situation - the child may have additional occult injuries (fractures, intracranial hemorrhage) that require urgent evaluation, and the child needs to be protected from further harm. The triage nurse should document objective findings without interpretation (exact location, size, shape, color of injuries), avoid confronting the parent (which could escalate the situation and cause the parent to flee with the child), separate the child from the suspected abuser when possible under the guise of clinical care, notify the treating physician of concerns, and contact the hospital's child protection team or social worker. The mandatory report to Child Protective Services should be made as soon as possible and does not require proof of abuse - only reasonable suspicion. Medical evaluation should include a skeletal survey, ophthalmologic examination, and laboratory studies to rule out medical conditions that mimic abuse (coagulopathy, osteogenesis imperfecta).",
    learningObjective: "Recognize indicators of non-accidental trauma in pediatric patients during triage and implement appropriate safety measures and mandatory reporting procedures",
    blueprintCategory: "Triage & ESI",
    subtopic: "Pediatric Triage",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not confront the suspected abuser at triage - this can escalate the situation and cause the parent to leave with the child before evaluation is complete",
    clinicalPearls: [
      "Bruising on the trunk, buttocks, and face in pre-mobile children is highly suspicious for abuse",
      "Patterned injuries (loop marks, bite marks, object-shaped burns) indicate non-accidental mechanism",
      "Nurses are mandated reporters - reporting requires reasonable suspicion, not proof",
      "The child's safety takes priority over all other triage considerations"
    ],
    safetyNote: "Never allow a child with suspected abuse to leave the ED without medical evaluation and child protective services notification. Document findings objectively and without interpretation.",
    distractorRationales: [
      "Simply documenting and triaging normally fails to address the immediate safety concern and mandated reporting obligation",
      "Confronting the parent is dangerous and could cause the parent to flee with the child or become violent",
      "ESI Level 3 with a delayed social work consult does not address the urgency of the safety concern or the need for comprehensive trauma evaluation"
    ],
    lessonLink: "/emergency/lessons/pediatric-triage"
  },
  {
    stem: "A 55-year-old male presents to triage reporting he passed a large amount of bright red blood per rectum 30 minutes ago. He feels lightheaded when standing. Vital signs sitting: BP 118/72, HR 96. Vital signs standing: BP 92/58, HR 124. He has a history of liver cirrhosis and takes no medications. What ESI level is most appropriate?",
    options: [
      "ESI Level 3 - GI bleed needing labs, IV fluids, and consult",
      "ESI Level 4 - rectal bleeding evaluation",
      "ESI Level 2 - high-risk GI hemorrhage with orthostatic instability",
      "ESI Level 1 - immediate blood transfusion required"
    ],
    correctAnswer: 2,
    rationaleLong: "This patient should be triaged as ESI Level 2 based on the combination of acute lower GI hemorrhage, significant orthostatic vital sign changes, history of liver cirrhosis, and risk of rapid hemodynamic deterioration. The orthostatic vital signs demonstrate hemodynamic instability: a 26 mmHg drop in systolic blood pressure and a 28 bpm increase in heart rate upon standing. Orthostatic changes of this magnitude suggest a volume loss of approximately 15-30% of circulating blood volume (Class II hemorrhage). In a patient with liver cirrhosis, the concern is heightened because: cirrhotic patients often have underlying coagulopathy (decreased synthetic function, thrombocytopenia from portal hypertension), they may have esophageal or rectal varices that can cause massive hemorrhage, they have limited physiologic reserve to compensate for blood loss, and bright red blood per rectum in a cirrhotic patient may indicate variceal bleeding or portal hypertensive gastropathy. The triage nurse should assign ESI Level 2 and immediately place the patient in a treatment area with two large-bore IV lines (16-18 gauge), obtain type and crossmatch, CBC, comprehensive metabolic panel, coagulation studies, and lactate. The patient should be placed on continuous cardiac monitoring. While the patient is not currently in cardiovascular collapse (which would warrant ESI Level 1), the trajectory of this presentation with active hemorrhage and orthostatic instability in a cirrhotic patient suggests high risk for rapid deterioration. Gastroenterology consultation should be obtained urgently for potential endoscopic intervention. Blood products should be available at the bedside.",
    learningObjective: "Recognize orthostatic vital sign changes as indicators of significant hemorrhage and appropriately triage patients with GI bleeding and comorbid liver disease",
    blueprintCategory: "Triage & ESI",
    subtopic: "Triage Decision-Making",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Sitting vital signs may appear near-normal in significant hemorrhage - always assess orthostatic vital signs when blood loss is suspected",
    clinicalPearls: [
      "Orthostatic hypotension (SBP drop >20 or HR increase >30) suggests 15-30% blood volume loss",
      "Cirrhotic patients with GI bleeding have increased mortality due to coagulopathy and limited physiologic reserve",
      "Bright red blood per rectum can originate from a brisk upper GI source in addition to lower GI bleeding",
      "Two large-bore (16-18 gauge) IV lines should be established for any significant GI hemorrhage"
    ],
    safetyNote: "Cirrhotic patients with GI bleeding require aggressive resuscitation and early GI consultation. Have blood products available at the bedside for transfusion.",
    distractorRationales: [
      "ESI Level 3 underestimates the severity - orthostatic instability indicates significant volume loss requiring urgent intervention",
      "ESI Level 4 is completely inappropriate for a patient with active GI hemorrhage and orthostatic vital signs",
      "ESI Level 1 could be considered if the patient were in frank cardiovascular collapse, but he currently maintains consciousness and vital signs when sitting"
    ],
    lessonLink: "/emergency/lessons/esi-triage-system"
  },
  {
    stem: "A triage nurse is evaluating a 38-year-old female who presents with right upper quadrant pain, nausea, and a fever of 38.8C (101.8F). She reports the pain started 6 hours ago after eating a fatty meal. Murphy's sign is positive on triage assessment. Vital signs: BP 128/82, HR 102, RR 18, SpO2 99%. The nurse predicts the patient will need labs, ultrasound, IV antibiotics, and surgical consult. What ESI level is appropriate?",
    options: [
      "ESI Level 2 - positive Murphy's sign indicates surgical emergency",
      "ESI Level 4 - one resource for ultrasound only",
      "ESI Level 3 - stable with predicted need for two or more resources",
      "ESI Level 5 - no resources needed for evaluation"
    ],
    correctAnswer: 2,
    rationaleLong: "This patient should be triaged as ESI Level 3. The ESI algorithm directs the triage nurse to first determine if the patient meets ESI Level 1 criteria (immediate life-saving intervention needed) or ESI Level 2 criteria (high-risk, confused, lethargic, or severe pain/distress). This patient does not meet either: she is alert, oriented, hemodynamically stable (though mildly tachycardic), and while in pain, does not appear to be in severe distress requiring immediate intervention. For patients who do not meet Level 1 or Level 2 criteria, the ESI algorithm asks the triage nurse to predict how many resources the patient will need. This patient will predictably need: laboratory studies (CBC, CMP, lipase, possibly blood cultures given fever), imaging (right upper quadrant ultrasound), IV medications (antibiotics, pain management, antiemetics), and possibly a surgical consultation. Four or more predicted resources clearly qualifies this patient for ESI Level 3, which is defined as stable patients expected to need two or more resources. The positive Murphy's sign (inspiratory arrest during palpation of the right upper quadrant) is a clinical finding suggestive of acute cholecystitis. While cholecystitis can be a surgical condition, it is not typically an immediately life-threatening emergency in a hemodynamically stable patient. The mild tachycardia (HR 102) may be related to pain or fever rather than hemodynamic compromise. The triage nurse should monitor for signs of deterioration that would warrant re-triage to ESI Level 2, such as rigors, worsening tachycardia, hypotension, or escalating pain suggesting perforation or gangrenous cholecystitis.",
    learningObjective: "Accurately predict resource utilization to differentiate ESI Level 3 from Levels 4 and 5 in patients with acute abdominal presentations",
    blueprintCategory: "Triage & ESI",
    subtopic: "ESI Level Assignment",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A positive Murphy's sign indicates likely cholecystitis requiring multiple resources, not necessarily an immediate surgical emergency requiring ESI Level 2",
    clinicalPearls: [
      "ESI Level 3 is assigned when two or more resources are predicted for a stable patient",
      "Resources include: labs, imaging, IV fluids/meds, specialty consults, procedures",
      "Murphy's sign has good specificity for acute cholecystitis but does not automatically elevate triage level",
      "Monitor for signs of complicated cholecystitis: rigors, peritoneal signs, hemodynamic instability"
    ],
    safetyNote: "Reassess acute abdominal pain patients at regular intervals. Gangrenous cholecystitis and perforation can develop rapidly and require immediate surgical intervention.",
    distractorRationales: [
      "ESI Level 2 overestimates the acuity - the patient is hemodynamically stable without severe distress",
      "ESI Level 4 underestimates the resources needed - this patient will need multiple diagnostic and therapeutic interventions",
      "ESI Level 5 is completely incorrect as this patient clearly requires multiple resources"
    ],
    lessonLink: "/emergency/lessons/esi-triage-system"
  },
  {
    stem: "A 23-year-old male presents to the ED after a motorcycle crash. He is conscious but confused, wearing a helmet. He has a visible open fracture of the left femur with active arterial bleeding and a flail chest segment on the right side. GCS is 13 (E3V4M6). Vital signs: BP 82/50, HR 140, RR 34, SpO2 88%. What is the correct ESI triage level?",
    options: [
      "ESI Level 2 - multiple trauma requiring urgent evaluation",
      "ESI Level 3 - trauma patient needing imaging and orthopedic consult",
      "ESI Level 1 - immediate life-saving intervention required for hemorrhagic shock and respiratory compromise",
      "ESI Level 4 - fracture requiring one resource"
    ],
    correctAnswer: 2,
    rationaleLong: "This patient should be triaged as ESI Level 1 - requiring immediate life-saving intervention. This is a multi-system trauma patient demonstrating signs of hemorrhagic shock and respiratory compromise that require emergent resuscitation. The clinical findings include: hemorrhagic shock evidenced by hypotension (82/50), severe tachycardia (140), and active arterial bleeding from an open femur fracture (Class III-IV hemorrhage); respiratory compromise with flail chest (multiple contiguous rib fractures creating a paradoxical segment), tachypnea (34), and hypoxemia (SpO2 88%); and altered mental status with GCS of 13, which may represent either traumatic brain injury or hypoperfusion. This patient requires immediate life-saving interventions including: direct pressure or tourniquet application to control arterial hemorrhage, massive transfusion protocol activation, emergent intubation may be needed for respiratory failure from flail chest, bilateral chest assessment for pneumothorax (common with flail chest), and large-bore IV access with rapid infusion of blood products. The flail chest creates a paradoxical chest wall movement that significantly impairs ventilation and is often associated with underlying pulmonary contusion, further compromising oxygenation. The ESI Level 1 designation ensures immediate access to a resuscitation bay and activation of the trauma team. The triage nurse should activate the trauma code before the patient arrives when possible, ensuring the trauma surgeon, emergency physician, respiratory therapy, blood bank, and OR are notified simultaneously. The open femur fracture alone can result in 1500-2000 mL of blood loss, and combined with other injuries, this patient is at high risk for exsanguination.",
    learningObjective: "Identify ESI Level 1 multi-system trauma presentations requiring immediate life-saving intervention including hemorrhage control and airway management",
    blueprintCategory: "Triage & ESI",
    subtopic: "Triage Decision-Making",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Multiple simultaneous life threats (hemorrhagic shock + respiratory failure) clearly make this ESI Level 1 - do not under-triage trauma patients",
    clinicalPearls: [
      "Open femur fractures can result in 1500-2000 mL of blood loss from the fracture site alone",
      "Flail chest requires 3 or more contiguous ribs each fractured in 2 places creating paradoxical movement",
      "Class III hemorrhage (30-40% blood volume loss) presents with tachycardia, hypotension, and altered mental status",
      "Massive transfusion protocol should be activated for patients with hemorrhagic shock"
    ],
    safetyNote: "Apply a tourniquet or direct pressure to control arterial hemorrhage immediately at triage - hemorrhage control should not wait for a treatment bed.",
    distractorRationales: [
      "ESI Level 2 underestimates the severity - this patient requires immediate life-saving intervention, not just urgent evaluation",
      "ESI Level 3 is completely inappropriate for a hemodynamically unstable trauma patient with active hemorrhage",
      "ESI Level 4 is absurdly low for a patient in hemorrhagic shock with multiple life-threatening injuries"
    ],
    lessonLink: "/emergency/lessons/esi-triage-system"
  },
  {
    stem: "A triage nurse is assessing an 88-year-old female from an assisted living facility who presents with urinary frequency, mild confusion (baseline is oriented x3, currently oriented x1), and vital signs: BP 142/86, HR 78, RR 16, SpO2 97%, temp 37.1C (98.8F). The facility reports she started a new antibiotic 3 days ago for a UTI. Lab-dependent resources predicted: UA, CBC, BMP. What ESI level is most appropriate?",
    options: [
      "ESI Level 3 - needs labs and possible medication adjustment",
      "ESI Level 4 - UTI follow-up requiring one resource",
      "ESI Level 5 - medication management, no resources needed",
      "ESI Level 2 - acute change in mental status from baseline"
    ],
    correctAnswer: 3,
    rationaleLong: "This patient should be triaged as ESI Level 2 based on the acute change in mental status from baseline. The ESI algorithm specifically identifies patients with new-onset confusion or altered mentation as ESI Level 2, regardless of the suspected underlying cause. This patient's baseline mental status is alert and oriented to person, place, and time (oriented x3), but she is currently only oriented to person (oriented x1) - representing a significant cognitive decline from her baseline. While the history suggests a possible UTI with treatment failure, the change in mental status in an elderly patient has a broad differential diagnosis that includes sepsis (the UTI may be worsening despite antibiotics), medication adverse effect or drug interaction (new antibiotic started 3 days ago), electrolyte imbalance, stroke, subdural hematoma, delirium from another source, and Clostridioides difficile infection (common with antibiotic use). The vital signs may appear relatively normal, but geriatric patients often fail to mount appropriate physiologic responses to serious illness. The absence of fever does not rule out sepsis in elderly patients - up to 30% of geriatric patients with serious infections present without fever. The triage nurse should recognize that any acute change in mental status in a geriatric patient represents a medical emergency that warrants immediate evaluation. The patient should be placed in a treatment area promptly and have comprehensive evaluation including labs, urinalysis, blood cultures, and potentially imaging (CT head) depending on physician assessment. The 3-day antibiotic history should prompt consideration of antibiotic failure, resistant organism, or secondary infection.",
    learningObjective: "Recognize acute change in mental status from baseline as an ESI Level 2 criterion in geriatric patients regardless of apparently stable vital signs",
    blueprintCategory: "Triage & ESI",
    subtopic: "Geriatric Triage",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not let normal-appearing vital signs in elderly patients reassure you when mental status has changed - geriatric patients often fail to mount appropriate physiologic responses",
    clinicalPearls: [
      "Any acute change from baseline mental status qualifies for ESI Level 2 regardless of vital signs",
      "Up to 30% of elderly patients with serious infections present without fever",
      "Delirium in elderly patients has a broad differential and requires comprehensive evaluation",
      "New medications, especially antibiotics, can cause confusion in elderly patients through multiple mechanisms"
    ],
    safetyNote: "Always obtain and document baseline mental status for elderly patients. Compare current status to baseline rather than to age-based assumptions.",
    distractorRationales: [
      "ESI Level 3 fails to account for the acute mental status change criterion that mandates ESI Level 2",
      "ESI Level 4 dangerously underestimates the significance of acute confusion in an elderly patient",
      "ESI Level 5 is completely inappropriate for a patient with any form of altered mental status"
    ],
    lessonLink: "/emergency/lessons/geriatric-triage"
  },
  {
    stem: "A mother brings her 8-year-old son to the ED stating he 'just doesn't seem right.' She reports he fell off his bicycle 4 hours ago and hit his head on the pavement (no helmet). Initially he seemed fine, but over the past hour he has become increasingly sleepy and vomited twice. On assessment, the child opens eyes to voice, gives confused verbal responses, and localizes pain. Vital signs: BP 128/84, HR 62, RR 14, SpO2 99%. What finding is MOST concerning to the triage nurse?",
    options: [
      "The vomiting, which suggests increased intracranial pressure",
      "The lucid interval followed by deterioration, suggesting epidural hematoma",
      "The bradycardia, which is consistent with Cushing response to increased ICP",
      "The history of no helmet use during the bicycle fall"
    ],
    correctAnswer: 1,
    rationaleLong: "The most concerning finding is the lucid interval followed by deterioration, which is the classic presentation of an epidural hematoma. An epidural hematoma typically results from trauma to the temporal bone causing rupture of the middle meningeal artery. The classic presentation involves an initial loss of consciousness or dazed period at the time of injury, followed by a 'lucid interval' during which the patient appears neurologically normal, and then rapid deterioration as the expanding hematoma compresses the brain. This child initially 'seemed fine' after the fall but is now becoming increasingly somnolent (GCS: E3V4M5 = 12, declining from presumably normal post-fall) and has developed vomiting - both consistent with rising intracranial pressure from an expanding epidural hematoma. This is a neurosurgical emergency requiring immediate CT scan and likely emergent craniotomy for hematoma evacuation. The triage nurse should assign this patient ESI Level 1 or 2 and immediately notify the treatment team. While the bradycardia (HR 62) and hypertension (BP 128/84 for an 8-year-old) suggest Cushing response (a late sign of severely elevated ICP), and the vomiting also indicates increased ICP, the lucid interval pattern is the most specifically concerning finding because it identifies the likely pathology (epidural hematoma) and indicates a rapidly evolving neurosurgical emergency. Without intervention, epidural hematomas can progress to uncal herniation and death within hours. The triage nurse should also note that normal vital signs would be HR 80-100 and BP approximately 100/60 for an 8-year-old, making the relative bradycardia and hypertension significant.",
    learningObjective: "Identify the classic lucid interval presentation of epidural hematoma in pediatric head trauma and recognize it as a neurosurgical emergency requiring immediate intervention",
    blueprintCategory: "Triage & ESI",
    subtopic: "Pediatric Triage",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "All the listed findings are concerning, but the lucid interval pattern is the most specific indicator of epidural hematoma - a condition with high mortality if not rapidly treated",
    clinicalPearls: [
      "The classic 'talk and die' presentation of epidural hematoma involves a lucid interval followed by rapid deterioration",
      "Epidural hematomas are caused by rupture of the middle meningeal artery, usually from temporal bone fracture",
      "Cushing triad (hypertension, bradycardia, irregular respirations) is a LATE sign of elevated ICP",
      "Pediatric vital sign norms differ from adults - always reference age-appropriate ranges"
    ],
    safetyNote: "Any child with head trauma who deteriorates after an initial period of apparent normalcy requires emergent CT scan and neurosurgical consultation.",
    distractorRationales: [
      "Vomiting is a sign of increased ICP but is non-specific and can occur with concussion or migraine",
      "Bradycardia is concerning as part of Cushing response but is a late finding - the lucid interval pattern is more diagnostically specific",
      "Lack of helmet use is a risk factor but does not directly inform the current clinical management priority"
    ],
    lessonLink: "/emergency/lessons/pediatric-triage"
  },
  {
    stem: "The triage nurse receives four patients simultaneously during an overcrowding event. Based on ESI triage principles, which patient should be placed in the LAST available acute care bed?",
    options: [
      "A 45-year-old with new-onset atrial fibrillation with rapid ventricular response, HR 162, BP 96/60, complaining of chest pain and dizziness",
      "A 60-year-old post-dialysis patient with shortness of breath, bilateral crackles, and SpO2 90% on 4L nasal cannula",
      "A 72-year-old with acute onset facial droop and arm weakness, last known well 2 hours ago",
      "A 30-year-old with a displaced ankle fracture after a sports injury, pedal pulses intact, pain controlled with splint"
    ],
    correctAnswer: 3,
    rationaleLong: "The 30-year-old with a displaced ankle fracture should be placed in the last available acute care bed, as this patient has the lowest acuity among the four. Let us analyze each patient: The 45-year-old with new-onset rapid atrial fibrillation (HR 162), hypotension (96/60), chest pain, and dizziness is ESI Level 1-2. This patient is hemodynamically unstable and may require immediate cardioversion. The rapid ventricular response with hypotension indicates poor cardiac output and potential for deterioration to cardiovascular collapse. The 60-year-old post-dialysis patient with respiratory distress, bilateral crackles, and hypoxemia (SpO2 90% despite supplemental oxygen) is ESI Level 2. This presentation suggests fluid overload or pulmonary edema in a dialysis-dependent patient who may need emergent dialysis, BiPAP, or aggressive diuresis. The 72-year-old with acute facial droop and arm weakness with a 2-hour onset is ESI Level 2 - an acute stroke alert. This patient is within the treatment window for thrombolytics and requires immediate CT and stroke team activation. Time is brain, and every minute of delay reduces the chance of good neurological outcome. The 30-year-old with a displaced ankle fracture is ESI Level 3. While the fracture requires evaluation and reduction, the intact pedal pulses indicate adequate distal perfusion, and the pain is controlled with a splint. This patient is hemodynamically stable and not at immediate risk for deterioration. The fracture can be appropriately managed with continued splinting and pain management while awaiting orthopedic consultation. This patient should still receive prompt care but can safely wait while the three higher-acuity patients are prioritized.",
    learningObjective: "Prioritize bed assignment among multiple patients based on ESI acuity levels and time-sensitive conditions during overcrowding events",
    blueprintCategory: "Triage & ESI",
    subtopic: "Overcrowding Management",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "PRIORITIZATION",
    examTrap: "The ankle fracture with intact pulses is the most stable patient - do not be distracted by the dramatic appearance of a displaced fracture when other patients have life-threatening conditions",
    clinicalPearls: [
      "Hemodynamically unstable atrial fibrillation may require emergent cardioversion",
      "Post-dialysis pulmonary edema may require emergent dialysis or BiPAP",
      "Acute stroke with 2-hour onset is within the thrombolytic window and is time-critical",
      "Displaced fractures with intact distal pulses are stable and can safely wait with appropriate splinting"
    ],
    safetyNote: "Reassess neurovascular status of extremity injuries at regular intervals. Loss of distal pulses in a displaced fracture requires immediate intervention.",
    distractorRationales: [
      "The atrial fibrillation patient with hemodynamic instability requires immediate intervention and cannot wait",
      "The post-dialysis patient with respiratory distress and hypoxemia requires urgent respiratory support",
      "The acute stroke patient has a time-sensitive condition where delays directly impact neurological outcome"
    ],
    lessonLink: "/emergency/lessons/overcrowding-management"
  },
  {
    stem: "A 56-year-old male presents to the ED reporting progressive abdominal distension, yellowing of his skin over the past week, and confusion for the past 2 days. His wife reports he has been drinking heavily for 20 years. On assessment, he has asterixis (liver flap), scleral icterus, and distended abdomen with a fluid wave. Vital signs: BP 106/62, HR 104, RR 20, SpO2 96%, temp 37.8C (100F). What ESI level should be assigned?",
    options: [
      "ESI Level 3 - chronic liver disease exacerbation needing labs and imaging",
      "ESI Level 2 - hepatic encephalopathy with altered mental status representing high-risk presentation",
      "ESI Level 4 - jaundice evaluation requiring labs",
      "ESI Level 5 - alcohol use disorder assessment"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient should be triaged as ESI Level 2 based on altered mental status (hepatic encephalopathy manifested by confusion and asterixis) in the setting of acute-on-chronic liver failure. The ESI algorithm identifies patients with new-onset confusion or altered mentation as ESI Level 2. This patient demonstrates multiple findings consistent with decompensated cirrhosis: asterixis (involuntary flapping tremor of the hands, pathognomonic for hepatic encephalopathy), jaundice (scleral icterus), ascites (abdominal distension with fluid wave), and borderline hemodynamic instability (mild hypotension, tachycardia). Hepatic encephalopathy is a serious complication of liver failure that can progress to coma if untreated. The differential diagnosis for this presentation includes spontaneous bacterial peritonitis (SBP), which occurs in 10-30% of cirrhotic patients with ascites and presents with fever, abdominal pain, and encephalopathy. The low-grade temperature (37.8C) raises concern for SBP, which has a mortality rate of 20-40% if not treated promptly. The triage nurse should prioritize this patient for rapid evaluation including: diagnostic paracentesis to rule out SBP (cell count, culture, albumin), comprehensive metabolic panel, CBC, coagulation studies, ammonia level, and blood cultures. The patient may need lactulose for encephalopathy, empiric antibiotics if SBP is suspected, and albumin replacement. The hemodynamic parameters suggest borderline compensated status that could deteriorate with variceal bleeding, hepatorenal syndrome, or sepsis.",
    learningObjective: "Recognize decompensated cirrhosis with hepatic encephalopathy as an ESI Level 2 presentation requiring urgent evaluation for complications including spontaneous bacterial peritonitis",
    blueprintCategory: "Triage & ESI",
    subtopic: "Triage Decision-Making",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not dismiss this as a chronic condition - new-onset confusion in a cirrhotic patient may indicate life-threatening complications such as SBP, variceal bleeding, or hepatorenal syndrome",
    clinicalPearls: [
      "Asterixis (liver flap) is a hallmark of hepatic encephalopathy",
      "SBP should be suspected in any cirrhotic patient with ascites who develops fever, encephalopathy, or abdominal pain",
      "Diagnostic paracentesis should be performed before antibiotics are started when SBP is suspected",
      "The mortality rate of untreated SBP is 20-40%"
    ],
    safetyNote: "Cirrhotic patients with altered mental status should be evaluated urgently for SBP, variceal bleeding, and hepatorenal syndrome. Do not assume encephalopathy is from ammonia alone.",
    distractorRationales: [
      "ESI Level 3 underestimates the severity of altered mental status in the setting of decompensated liver disease",
      "ESI Level 4 fails to recognize the complexity and severity of this presentation",
      "ESI Level 5 is completely inappropriate and ignores the acute life-threatening presentation"
    ],
    lessonLink: "/emergency/lessons/esi-triage-system"
  },
  {
    stem: "A walk-in patient presents to triage stating she is 36 weeks pregnant and has had regular contractions every 3 minutes for the past hour. She feels the urge to push and reports a gush of clear fluid 20 minutes ago. She has had no prenatal care. Vital signs: BP 130/82, HR 98, RR 20, SpO2 99%. The triage nurse notes the patient is bearing down during contractions. What is the priority triage action?",
    options: [
      "Assign ESI Level 3 and place her in the OB triage area for evaluation",
      "Call the OB department for routine transfer of a patient in labor",
      "Assign ESI Level 2, prepare for imminent delivery in the ED, and call for OB and neonatal support",
      "Assign ESI Level 4 and obtain prenatal records before proceeding"
    ],
    correctAnswer: 2,
    rationaleLong: "The priority action is to assign ESI Level 2, prepare for imminent delivery in the ED, and call for obstetric and neonatal support simultaneously. This patient is presenting with signs of imminent delivery: regular contractions every 3 minutes, ruptured membranes (gush of clear fluid), urge to push, and active bearing down during contractions. The combination of contractions every 3 minutes with urge to push suggests she is in the second stage of labor (fully dilated) or near complete dilation. Delivery may occur within minutes. The lack of prenatal care adds significant risk because the triage nurse has no information about fetal position, placental location, group B streptococcus status, gestational diabetes, preeclampsia risk, or other complications. This means the delivery could present unexpected complications such as breech presentation, placenta previa, or cord prolapse. At 36 weeks, the infant is late preterm and may require neonatal resuscitation support. The triage nurse should immediately: place the patient in a treatment area or designated delivery room (do NOT attempt to transport to labor and delivery if delivery is imminent), call for OB and neonatal response teams, prepare delivery supplies (delivery kit, bulb suction, warmer, clamps, sterile towels), have neonatal resuscitation equipment ready, and assess for visible fetal parts or crowning. If delivery occurs before OB arrival, the ED nurse must be prepared to manage the delivery. The most critical interventions are maintaining airway and temperature of the newborn and monitoring for maternal hemorrhage. ESI Level 2 is appropriate because while delivery is a natural process, the unplanned ED delivery with no prenatal care history represents a high-risk situation for both mother and neonate.",
    learningObjective: "Recognize signs of imminent delivery at triage and implement emergency delivery preparation protocols when transport to labor and delivery is not feasible",
    blueprintCategory: "Triage & ESI",
    subtopic: "Obstetric Triage",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not attempt to transport a patient with imminent delivery to labor and delivery - prepare for ED delivery and bring resources to the patient",
    clinicalPearls: [
      "Urge to push with bearing down during contractions indicates imminent delivery",
      "Late preterm infants (34-36 weeks) may require temperature support and respiratory assistance",
      "No prenatal care increases risk for unknown complications during delivery",
      "Postpartum hemorrhage is the most common life-threatening complication of ED delivery"
    ],
    safetyNote: "Never delay delivery preparation to transport a patient with imminent delivery. Have neonatal resuscitation equipment ready and call for neonatal support immediately.",
    distractorRationales: [
      "ESI Level 3 with OB triage placement may result in unattended delivery during transport",
      "Routine OB transfer call does not convey the urgency of imminent delivery in the ED",
      "ESI Level 4 with records review dangerously delays care for a patient about to deliver"
    ],
    lessonLink: "/emergency/lessons/obstetric-triage"
  },
  {
    stem: "During a mass casualty incident involving a building collapse, the triage nurse is using the START (Simple Triage and Rapid Treatment) algorithm. A victim is found who is breathing at 32 breaths per minute after opening the airway, has a radial pulse present, and follows simple commands. What START triage category should this patient receive?",
    options: [
      "Green (Minor/Walking Wounded) - able to follow commands indicates minor injury",
      "Yellow (Delayed) - has injuries but can wait for treatment",
      "Red (Immediate) - respiratory rate above 30 indicates immediate need",
      "Black (Expectant/Deceased) - injuries likely incompatible with survival"
    ],
    correctAnswer: 2,
    rationaleLong: "This patient should be categorized as RED (Immediate) using the START triage algorithm. The START algorithm uses a systematic assessment of respiration, perfusion, and mental status to rapidly categorize patients in mass casualty incidents. The algorithm follows this decision tree: First, check if the patient can walk - if yes, they are GREEN (Minor). If not walking, assess respirations: if not breathing, open the airway. If still not breathing, they are BLACK (Expectant). If breathing after airway opening, they are RED (Immediate). If breathing spontaneously, check respiratory rate: if greater than 30 breaths per minute, they are RED (Immediate). If respiratory rate is under 30, check perfusion using radial pulse or capillary refill: if no radial pulse or capillary refill greater than 2 seconds, they are RED. If perfusion is adequate, check mental status: if unable to follow simple commands, they are RED. If able to follow commands, they are YELLOW (Delayed). In this scenario, the patient's respiratory rate is 32 breaths per minute, which exceeds the threshold of 30 in the START algorithm. This automatically categorizes the patient as RED regardless of other findings. The elevated respiratory rate may indicate chest injury, pain, anxiety, or early respiratory failure from dust inhalation or compression injury. RED category patients are expected to benefit from immediate intervention and have the highest priority for transport and treatment. The START triage process should take no more than 30-60 seconds per patient. The triage nurse should apply a red triage tag and move to the next patient - treatment is not performed during the triage phase of an MCI response.",
    learningObjective: "Apply the START mass casualty triage algorithm to correctly categorize patients based on respiratory rate, perfusion, and mental status criteria",
    blueprintCategory: "Triage & ESI",
    subtopic: "ESI Level Assignment",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "In START triage, a respiratory rate above 30 automatically makes the patient RED (Immediate) - do not continue assessing perfusion and mental status",
    clinicalPearls: [
      "START triage sequence: Walk? -> Breathing? -> RR >30? -> Radial pulse/CRT? -> Follows commands?",
      "Any abnormal finding in the START algorithm stops the assessment and assigns the corresponding category",
      "START triage should take 30-60 seconds per patient maximum",
      "Do not treat patients during the triage phase of MCI response - tag and move on"
    ],
    safetyNote: "In mass casualty incidents, the goal of triage is to do the greatest good for the greatest number. Individual patient optimization is secondary to population-level resource allocation.",
    distractorRationales: [
      "GREEN is only for patients who can walk independently - this patient was found on the ground",
      "YELLOW would only be assigned if RR was under 30, radial pulse was present, and the patient could follow commands",
      "BLACK is for patients who are not breathing even after airway opening"
    ],
    lessonLink: "/emergency/lessons/esi-triage-system"
  },
  {
    stem: "A 40-year-old female with a history of systemic lupus erythematosus presents to triage with pleuritic chest pain, shortness of breath, and unilateral leg swelling. She reports recent hospitalization for a lupus flare 2 weeks ago with 5 days of bedrest. Vital signs: BP 118/74, HR 112, RR 24, SpO2 92% on room air. What is the most appropriate ESI level and clinical concern?",
    options: [
      "ESI Level 3 - lupus flare with pleurisy requiring rheumatology consult",
      "ESI Level 2 - high suspicion for pulmonary embolism given risk factors and presentation",
      "ESI Level 4 - leg swelling evaluation with one resource needed",
      "ESI Level 5 - follow-up for recent hospitalization"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient should be triaged as ESI Level 2 with high clinical suspicion for pulmonary embolism (PE). The patient presents with multiple Virchow's triad risk factors and clinical findings consistent with PE: pleuritic chest pain (sharp, worsens with breathing - classic for PE), dyspnea with tachypnea (RR 24), hypoxemia (SpO2 92%), tachycardia (HR 112), unilateral leg swelling suggesting deep vein thrombosis (DVT), and significant risk factors including SLE (an independent risk factor for thromboembolism due to antiphospholipid antibodies), recent hospitalization with prolonged immobility, and possible recent glucocorticoid use. The Wells criteria for PE would score this patient at high clinical probability: clinical signs of DVT (3 points), heart rate >100 (1.5 points), recent immobilization (1.5 points), with additional risk from the autoimmune condition. A score above 6 indicates high probability. This patient requires urgent CT pulmonary angiography, D-dimer may be useful if clinical probability is low but is unlikely to be helpful here given the high pre-test probability. If PE is confirmed, anticoagulation therapy should be initiated immediately. In the setting of hemodynamic instability, systemic thrombolysis or catheter-directed therapy may be needed. The triage nurse should recognize that SLE patients are at increased risk for thromboembolic events, especially those with antiphospholipid antibody syndrome, and should not attribute the symptoms solely to a lupus pleurisy without ruling out PE. ESI Level 2 is appropriate because while the patient maintains hemodynamic stability (ruling out ESI 1 for massive PE with cardiovascular collapse), she has a high-risk presentation with hypoxemia that demands immediate evaluation.",
    learningObjective: "Identify risk factors for pulmonary embolism during triage assessment including autoimmune disease, recent immobility, and unilateral leg swelling, and assign appropriate ESI level",
    blueprintCategory: "Triage & ESI",
    subtopic: "Triage Decision-Making",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not attribute pleuritic chest pain in a lupus patient solely to pleuritis without considering PE - SLE is an independent risk factor for thromboembolism",
    clinicalPearls: [
      "SLE patients have 3-10x increased risk of venous thromboembolism compared to the general population",
      "Antiphospholipid antibody syndrome is present in up to 40% of SLE patients and significantly increases clotting risk",
      "Wells criteria for PE: DVT signs (3), HR>100 (1.5), immobilization (1.5), previous DVT/PE (1.5), hemoptysis (1), malignancy (1)",
      "Unilateral leg swelling with pleuritic chest pain should always raise concern for DVT with PE"
    ],
    safetyNote: "In patients with high clinical probability for PE, do not delay CT angiography to obtain D-dimer. Negative D-dimer does not reliably exclude PE in high-probability patients.",
    distractorRationales: [
      "ESI Level 3 with rheumatology consult delays evaluation of a potentially life-threatening PE",
      "ESI Level 4 grossly underestimates the severity of this presentation",
      "ESI Level 5 is completely inappropriate for a patient with significant cardiopulmonary symptoms and hypoxemia"
    ],
    lessonLink: "/emergency/lessons/esi-triage-system"
  },
];

export const multiSystemEmergencyQuestions: EmergencyNursingQuestion[] = [
  {
    stem: "A 58-year-old male with type 2 diabetes presents to the ED with altered mental status. His wife reports he has been increasingly confused over the past 2 days with excessive thirst and frequent urination. On arrival, he is drowsy but responsive to voice. Vital signs: BP 92/58, HR 124, RR 28 (deep, rapid breathing), temp 37.2C, SpO2 98%. Point-of-care glucose reads 'HIGH' (>500 mg/dL). Mucous membranes are dry and skin turgor is poor. What is the PRIORITY nursing intervention?",
    options: [
      "Administer a regular insulin bolus of 10 units IV push immediately",
      "Initiate aggressive IV fluid resuscitation with 0.9% normal saline at 1 liter over the first hour",
      "Obtain a fingerstick glucose and administer oral fluids",
      "Draw a comprehensive metabolic panel and wait for results before intervening"
    ],
    correctAnswer: 1,
    rationaleLong: "The priority nursing intervention is to initiate aggressive IV fluid resuscitation with 0.9% normal saline at 1 liter over the first hour. This patient presents with classic diabetic ketoacidosis (DKA) or hyperosmolar hyperglycemic state (HHS): severe hyperglycemia (>500 mg/dL), altered mental status, dehydration (dry mucous membranes, poor skin turgor), hemodynamic instability (hypotension, tachycardia), and Kussmaul respirations (deep, rapid breathing indicating metabolic acidosis). The most immediate life-threatening problem in DKA/HHS is profound dehydration and volume depletion, which causes poor tissue perfusion and contributes to the metabolic derangement. Patients with DKA/HHS may have a fluid deficit of 5-10 liters. The American Diabetes Association guidelines recommend initiating fluid resuscitation BEFORE insulin therapy. The standard protocol is 0.9% normal saline at 15-20 mL/kg/hour (approximately 1-1.5 liters) in the first hour, followed by adjustment based on hemodynamic status and sodium levels. Administering insulin before adequate fluid resuscitation can cause rapid fluid shifts, dangerous drops in serum potassium, and cardiovascular collapse. Additionally, insulin should NOT be initiated until the serum potassium level is confirmed to be above 3.3 mEq/L, as insulin drives potassium intracellularly and can precipitate fatal hypokalemia and cardiac arrhythmias. The nursing assessment should include obtaining IV access (preferably two large-bore peripheral IVs), initiating fluid resuscitation, drawing comprehensive labs (BMP, CBC, VBG or ABG, serum ketones, phosphorus, magnesium), placing a Foley catheter for urine output monitoring, and continuous cardiac monitoring for electrolyte-related arrhythmias.",
    learningObjective: "Prioritize IV fluid resuscitation over insulin administration in the initial management of diabetic ketoacidosis and hyperosmolar hyperglycemic state",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "DKA and HHS",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The instinct to give insulin immediately for severe hyperglycemia is wrong - fluid resuscitation must come FIRST, and potassium must be checked before insulin is administered",
    clinicalPearls: [
      "DKA/HHS patients may have 5-10 liter fluid deficits requiring aggressive resuscitation",
      "Always check potassium before administering insulin - hypokalemia must be corrected first",
      "Kussmaul respirations (deep, rapid) are the body's attempt to compensate for metabolic acidosis by blowing off CO2",
      "Fluid resuscitation alone can reduce blood glucose by 20-30% through dilution and improved renal perfusion"
    ],
    safetyNote: "Never administer insulin in DKA/HHS without first confirming serum potassium is above 3.3 mEq/L. Fatal cardiac arrhythmias can result from insulin-driven hypokalemia.",
    distractorRationales: [
      "Insulin bolus before fluid resuscitation and potassium verification can cause dangerous fluid shifts and fatal hypokalemia",
      "Oral fluids are inappropriate for a patient with altered mental status (aspiration risk) and require IV route",
      "Waiting for lab results before intervening delays critical fluid resuscitation for a hemodynamically unstable patient"
    ],
    lessonLink: "/emergency/lessons/dka-hhs-management"
  },
  {
    stem: "A 67-year-old female presents to the ED from a nursing facility with a temperature of 39.2C (102.6F), altered mental status, blood pressure of 84/52 mmHg, heart rate of 128, respiratory rate of 26, and SpO2 of 91% on room air. Lab results show: WBC 18,200, lactate 4.8 mmol/L, creatinine 2.4 mg/dL (baseline 1.0). The nurse suspects sepsis. According to the Surviving Sepsis Campaign guidelines, which intervention bundle must be completed within ONE hour of recognition?",
    options: [
      "Obtain blood cultures, administer broad-spectrum antibiotics, begin 30 mL/kg crystalloid fluid bolus, and remeasure lactate if initial lactate is elevated",
      "Obtain blood cultures, start norepinephrine infusion, insert central venous catheter, and consult infectious disease",
      "Administer broad-spectrum antibiotics, obtain CT scan of chest/abdomen/pelvis, insert Foley catheter, and order echocardiogram",
      "Draw comprehensive metabolic panel, initiate cooling measures for fever, administer antipyretics, and reassess in 30 minutes"
    ],
    correctAnswer: 0,
    rationaleLong: "According to the Surviving Sepsis Campaign (SSC) guidelines, the one-hour sepsis bundle includes: (1) Measure lactate level and remeasure if initial lactate is greater than 2 mmol/L, (2) Obtain blood cultures BEFORE administering antibiotics (but do not delay antibiotics for cultures), (3) Administer broad-spectrum antibiotics within one hour of sepsis recognition, and (4) Begin rapid administration of 30 mL/kg crystalloid for hypotension or lactate greater than or equal to 4 mmol/L. This patient meets criteria for septic shock: suspected infection with organ dysfunction (altered mental status, acute kidney injury with creatinine 2.4 from baseline 1.0), hypotension (84/52), and elevated lactate (4.8 mmol/L, significantly above the 2 mmol/L threshold). The qSOFA score is 3/3 (altered mental status, SBP less than or equal to 100, RR greater than or equal to 22). The one-hour bundle is critical because each hour of delay in antibiotic administration increases mortality by approximately 7.6% in septic shock. The nurse's role includes: obtaining two sets of blood cultures from different sites before antibiotics (but not delaying antibiotics more than 45 minutes for cultures), ensuring timely antibiotic administration by communicating urgency to pharmacy and the physician, initiating the 30 mL/kg crystalloid bolus (approximately 2.1 liters for a 70 kg patient) as rapidly as possible using pressure bags if needed, and ensuring lactate is redrawn within 2-4 hours. If hypotension persists despite fluid resuscitation, vasopressors (norepinephrine first-line) should be initiated - this is the second tier of management, not part of the initial one-hour bundle. The nurse should also place the patient on continuous cardiac monitoring, insert a Foley catheter for urine output monitoring (target >0.5 mL/kg/hr), and reassess the patient's response to interventions frequently.",
    learningObjective: "Identify the components of the Surviving Sepsis Campaign one-hour bundle and the nurse's role in executing time-sensitive sepsis interventions",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Sepsis Management",
    difficulty: 3,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Blood cultures should be obtained before antibiotics, but antibiotics should NOT be delayed more than 45 minutes to obtain cultures - time to antibiotics is the priority",
    clinicalPearls: [
      "Each hour delay in antibiotics increases septic shock mortality by approximately 7.6%",
      "The one-hour bundle: lactate, blood cultures, antibiotics, 30 mL/kg crystalloid for hypotension/lactate >=4",
      "qSOFA criteria: altered mental status, SBP <=100, RR >=22 - score of 2+ suggests sepsis",
      "Norepinephrine is the first-line vasopressor for septic shock refractory to fluid resuscitation"
    ],
    safetyNote: "Time to antibiotics is the single most important modifiable factor in sepsis mortality. Communicate urgency clearly to pharmacy and the treatment team.",
    distractorRationales: [
      "Central line and vasopressors are second-tier interventions after fluid resuscitation fails, not part of the one-hour bundle",
      "CT imaging, Foley, and echo are important but are not components of the initial one-hour sepsis bundle",
      "Antipyretics and reassessment in 30 minutes dangerously delays critical sepsis bundle interventions"
    ],
    lessonLink: "/emergency/lessons/sepsis-management"
  },
  {
    stem: "A 32-year-old female with Addison's disease presents to the ED after 3 days of vomiting and diarrhea. She reports she ran out of her hydrocortisone 5 days ago. She is lethargic, confused, and has diffuse abdominal pain. Vital signs: BP 72/44, HR 138, RR 22, temp 37.0C, SpO2 97%. Point-of-care glucose is 48 mg/dL. Labs show sodium 126 mEq/L and potassium 6.2 mEq/L. What is the MOST critical initial intervention?",
    options: [
      "Administer IV dextrose 50% (D50) to correct hypoglycemia",
      "Administer IV stress-dose hydrocortisone 100 mg and initiate aggressive normal saline resuscitation",
      "Treat the hyperkalemia with IV calcium gluconate, insulin, and dextrose",
      "Administer IV normal saline at 250 mL/hr and obtain an ECG"
    ],
    correctAnswer: 1,
    rationaleLong: "The most critical initial intervention is to administer stress-dose IV hydrocortisone 100 mg and initiate aggressive normal saline fluid resuscitation. This patient is in adrenal crisis (acute adrenal insufficiency), a life-threatening endocrine emergency. The clinical picture is classic: a patient with known Addison's disease (primary adrenal insufficiency) who has been without replacement corticosteroids for 5 days and has experienced physiologic stress (gastroenteritis with vomiting and diarrhea). The hallmark laboratory findings of adrenal crisis include hyponatremia (126 mEq/L - due to impaired free water excretion and volume depletion), hyperkalemia (6.2 mEq/L - due to lack of aldosterone), and hypoglycemia (48 mg/dL - due to impaired gluconeogenesis without cortisol). The hemodynamic instability (BP 72/44, HR 138) results from cortisol deficiency causing decreased vascular tone and poor response to catecholamines, combined with volume depletion from the GI losses and mineralocorticoid deficiency. The cornerstone of adrenal crisis treatment is immediate IV stress-dose hydrocortisone (100 mg bolus, followed by 50 mg every 8 hours or 200 mg/24 hours continuous infusion). Hydrocortisone at stress doses provides both glucocorticoid AND mineralocorticoid activity, which will address the hypotension, hyponatremia, hyperkalemia, and hypoglycemia simultaneously. Aggressive IV normal saline resuscitation (1-2 liters in the first hour) should be started concurrently with dextrose supplementation. While the individual electrolyte abnormalities (hyperkalemia, hypoglycemia) need treatment, addressing the underlying cortisol deficiency is the most critical intervention because it treats the root cause of all the metabolic derangements. The hypoglycemia and hyperkalemia will begin correcting with hydrocortisone administration. However, if the potassium is above 6.0 with ECG changes, emergent cardiac stabilization with IV calcium should proceed simultaneously.",
    learningObjective: "Recognize adrenal crisis as the underlying cause of combined hypotension, hyponatremia, hyperkalemia, and hypoglycemia, and prioritize stress-dose corticosteroid replacement",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Adrenal Crisis",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "While treating each individual lab abnormality seems urgent, stress-dose hydrocortisone addresses the ROOT CAUSE of all the metabolic derangements in adrenal crisis",
    clinicalPearls: [
      "Adrenal crisis triad: hypotension refractory to fluids/vasopressors, hyponatremia, and hyperkalemia",
      "Stress-dose hydrocortisone (100 mg IV) provides both glucocorticoid and mineralocorticoid effects",
      "Any patient on chronic corticosteroids who cannot take oral medication needs parenteral stress-dose steroids",
      "Adrenal crisis can be precipitated by illness, surgery, trauma, or abrupt discontinuation of corticosteroids"
    ],
    safetyNote: "Adrenal crisis is rapidly fatal without treatment. If clinical suspicion is high, administer stress-dose hydrocortisone immediately - do NOT wait for cortisol levels to confirm the diagnosis.",
    distractorRationales: [
      "D50 alone treats the hypoglycemia but does not address the underlying cortisol deficiency causing all metabolic derangements",
      "Treating hyperkalemia with standard protocols addresses one component but misses the root cause",
      "Normal saline at 250 mL/hr is too slow for a patient in shock, and while an ECG is needed, it should not delay corticosteroid administration"
    ],
    lessonLink: "/emergency/lessons/adrenal-crisis"
  },
  {
    stem: "A 45-year-old female presents to the ED with agitation, tremor, fever of 40.2C (104.4F), profuse diaphoresis, and heart rate of 168 bpm with new-onset atrial fibrillation. She has a visible goiter and exophthalmos. Her husband reports she stopped taking her methimazole 3 weeks ago because of a skin rash. Blood pressure is 180/94 and she is confused. What is the correct sequence of medication administration for this emergency?",
    options: [
      "Methimazole first, then propranolol, then iodine solution, then hydrocortisone",
      "Propranolol for rate control, then propylthiouracil (PTU), then iodine solution at least 1 hour after PTU, then hydrocortisone",
      "Iodine solution first to block thyroid hormone release, then PTU, then atenolol",
      "Hydrocortisone first, then iodine, then methimazole, then calcium channel blocker"
    ],
    correctAnswer: 1,
    rationaleLong: "The correct treatment sequence for thyroid storm is: (1) Beta-blocker (propranolol) for immediate symptom control and rate control, (2) Thionamide (PTU preferred over methimazole in thyroid storm), (3) Iodine solution administered at least 1 hour AFTER the thionamide, and (4) Hydrocortisone for stress-dose steroid replacement and inhibition of T4-to-T3 peripheral conversion. This patient presents with classic thyroid storm: the Burch-Wartofsky Point Scale would score highly with temperature >40C, heart rate >140 with atrial fibrillation, CNS dysfunction (agitation, confusion), precipitating event (medication discontinuation), and GI symptoms (diaphoresis). Thyroid storm has a mortality rate of 10-30% even with treatment. The medication sequence is critical for physiological reasons. Propranolol is administered first because it provides immediate symptom relief by blocking beta-adrenergic effects of excess thyroid hormone, controls the dangerous tachycardia and atrial fibrillation, and at high doses inhibits peripheral conversion of T4 to T3. PTU is preferred over methimazole in thyroid storm because PTU both inhibits new thyroid hormone synthesis AND blocks peripheral T4-to-T3 conversion. Iodine solution (Lugol's solution or saturated potassium iodide) blocks thyroid hormone release through the Wolff-Chaikoff effect, but it MUST be given at least 1 hour after the thionamide. If iodine is given before the thionamide, it can paradoxically serve as substrate for new thyroid hormone synthesis, worsening the storm (Jod-Basedow phenomenon). Hydrocortisone (100 mg IV every 8 hours) is administered because relative adrenal insufficiency is common in thyroid storm due to accelerated cortisol metabolism, and corticosteroids also inhibit peripheral T4-to-T3 conversion.",
    learningObjective: "Implement the correct pharmacological sequence for thyroid storm management, understanding the rationale for medication timing and selection",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Thyroid Storm",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Iodine MUST be given at least 1 hour AFTER the thionamide - giving iodine first can worsen thyroid storm by providing substrate for new hormone synthesis",
    clinicalPearls: [
      "Thyroid storm medication sequence: beta-blocker -> thionamide -> iodine (1 hour later) -> corticosteroid",
      "PTU is preferred over methimazole in thyroid storm because it also blocks peripheral T4-to-T3 conversion",
      "Propranolol is the preferred beta-blocker because at high doses it inhibits T4-to-T3 conversion",
      "The Burch-Wartofsky Point Scale helps quantify the likelihood of thyroid storm"
    ],
    safetyNote: "Thyroid storm mortality is 10-30% - this is a true endocrine emergency. Aggressive cooling measures and supportive care are needed alongside pharmacotherapy.",
    distractorRationales: [
      "Methimazole first is suboptimal because PTU is preferred in thyroid storm for its dual mechanism, and this sequence does not specify the critical timing of iodine after thionamide",
      "Iodine first before thionamide can paradoxically worsen thyroid storm through the Jod-Basedow phenomenon",
      "Hydrocortisone first, while important, does not address the immediately dangerous tachycardia and should follow beta-blockade"
    ],
    lessonLink: "/emergency/lessons/thyroid-storm"
  },
  {
    stem: "A 22-year-old male is brought to the ED after being found unresponsive at a music festival. Friends report he consumed 'ecstasy' approximately 3 hours ago and was dancing vigorously before becoming confused and collapsing. On arrival, he is unresponsive to verbal stimuli but withdraws from pain. Vital signs: temp 41.8C (107.2F), HR 148, BP 86/52, RR 30, SpO2 96%. He has generalized muscle rigidity, clonus, and is diaphoretic. Labs show: K+ 7.1 mEq/L, CK 45,000 U/L, creatinine 3.8 mg/dL, pH 7.08. What is the MOST life-threatening complication requiring immediate intervention?",
    options: [
      "Rhabdomyolysis with acute kidney injury",
      "Severe hyperkalemia with risk of cardiac arrest",
      "Life-threatening hyperthermia requiring aggressive cooling",
      "Metabolic acidosis requiring sodium bicarbonate infusion"
    ],
    correctAnswer: 2,
    rationaleLong: "The most life-threatening complication requiring immediate intervention is the severe hyperthermia (41.8C/107.2F). While all of the listed complications are present and serious, the extreme hyperthermia is the primary driver of this patient's multi-organ dysfunction and must be addressed first because it is the root cause of the cascade of complications. This patient presents with MDMA (ecstasy)-induced hyperthermia, which has triggered a catastrophic physiological cascade: the extreme body temperature causes direct cellular injury and protein denaturation, leading to rhabdomyolysis (CK 45,000), which in turn causes hyperkalemia (K+ 7.1) from muscle cell lysis and acute kidney injury (creatinine 3.8) from myoglobin deposition in renal tubules. The metabolic acidosis (pH 7.08) results from anaerobic metabolism, lactic acid production, and renal failure. If the hyperthermia is not corrected immediately, all downstream complications will continue to worsen regardless of other interventions. Temperatures above 41.1C (106F) are associated with irreversible organ damage and mortality rates exceeding 80% if not rapidly cooled. Aggressive cooling measures should include: removal of all clothing, application of ice packs to groin, axillae, and neck, cold water immersion if available (the gold standard), evaporative cooling with misting fans, cold IV fluid administration, and consideration of intracavitary lavage for refractory cases. The hyperkalemia is immediately dangerous (risk of cardiac arrest) and should be treated simultaneously with IV calcium gluconate for cardiac membrane stabilization, but without addressing the ongoing hyperthermia, the hyperkalemia will continue to worsen from ongoing rhabdomyolysis. Benzodiazepines should be administered to reduce muscle rigidity, agitation, and heat generation.",
    learningObjective: "Identify life-threatening hyperthermia as the primary driver of multi-organ dysfunction in stimulant toxicity and prioritize aggressive cooling over treating downstream complications",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Heat Stroke and Hypothermia",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "While the hyperkalemia at 7.1 is immediately dangerous, it is being driven by ongoing rhabdomyolysis from hyperthermia - cooling is the intervention that addresses the root cause of ALL complications",
    clinicalPearls: [
      "Core temperature above 41.1C (106F) is associated with irreversible organ damage and high mortality",
      "Cold water immersion is the gold standard for cooling in exertional and drug-induced hyperthermia",
      "Benzodiazepines reduce muscle rigidity, agitation, and metabolic heat generation",
      "MDMA-induced hyperthermia causes a cascade: hyperthermia -> rhabdomyolysis -> hyperkalemia + AKI -> acidosis"
    ],
    safetyNote: "Do not use antipyretics (acetaminophen, NSAIDs) for drug-induced or exertional hyperthermia - they are ineffective because the mechanism is not cytokine-mediated fever.",
    distractorRationales: [
      "Rhabdomyolysis with AKI is serious but is a downstream effect of hyperthermia - treating the temperature addresses the cause",
      "Hyperkalemia needs treatment but will continue to worsen without cooling due to ongoing muscle breakdown",
      "Metabolic acidosis will improve with cooling, fluid resuscitation, and correction of the underlying hyperthermia"
    ],
    lessonLink: "/emergency/lessons/heat-stroke-hypothermia"
  },
  {
    stem: "A 5-year-old child is brought to the ED after a submersion incident in a backyard pool. The child was found face-down and was submerged for an estimated 3-5 minutes. Bystander CPR was initiated and the child regained spontaneous breathing before EMS arrival. On ED arrival, the child is coughing, alert, and crying. Vital signs: HR 130, RR 28, SpO2 91% on room air, temp 36.0C. Bilateral crackles are heard on auscultation. Which statement about this patient's management is MOST accurate?",
    options: [
      "Since the child is alert and breathing spontaneously, she can be observed for 4 hours and discharged if stable",
      "The child should be admitted for at least 24 hours of observation due to risk of delayed pulmonary deterioration",
      "Prophylactic antibiotics should be started immediately to prevent aspiration pneumonia",
      "The child should be intubated immediately due to the submersion history"
    ],
    correctAnswer: 1,
    rationaleLong: "The child should be admitted for at least 24 hours of observation due to the risk of delayed pulmonary deterioration. Drowning (the current preferred terminology over 'near-drowning') can cause delayed respiratory complications that may not be apparent for 6-24 hours after the initial event. This child demonstrates current respiratory compromise (SpO2 91%, bilateral crackles, coughing) despite being alert, indicating pulmonary injury from water aspiration. The mechanism of drowning-related lung injury involves: aspiration of water causing surfactant washout and dysfunction, direct damage to alveolar epithelium, inflammatory response leading to acute respiratory distress syndrome (ARDS), and potential for secondary infection. Even patients who appear to improve initially after submersion can develop delayed pulmonary edema, ARDS, or pneumonia within 24-72 hours. The 'talk and die' scenario in drowning occurs when initial improvement is followed by rapid respiratory deterioration as inflammation and surfactant dysfunction progress. Current evidence-based recommendations from the American Heart Association and Wilderness Medical Society indicate that all submersion patients with any respiratory symptoms (coughing, crackles, tachypnea, hypoxemia) should be admitted for extended observation with serial respiratory assessments, pulse oximetry monitoring, and chest X-ray. The observation period should be at minimum 24 hours, with discharge only after respiratory status has been consistently normal. Prophylactic antibiotics are NOT recommended as they have not shown benefit and may promote resistant organisms. Intubation is not needed at this time as the child is maintaining her airway and breathing spontaneously, though close monitoring for deterioration is essential. Mild hypothermia (36.0C) is common in drowning and should be treated with passive rewarming.",
    learningObjective: "Recognize the risk of delayed pulmonary deterioration in submersion patients and implement appropriate observation protocols regardless of initial improvement",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Drowning",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not be falsely reassured by initial improvement in drowning patients - delayed pulmonary deterioration can occur 6-24 hours after the event",
    clinicalPearls: [
      "All symptomatic submersion patients require at least 24 hours of observation",
      "Delayed pulmonary edema and ARDS can develop 6-24 hours after submersion",
      "Prophylactic antibiotics are NOT recommended for drowning patients",
      "The term 'near-drowning' is no longer used - the correct term is 'drowning' with or without morbidity/mortality"
    ],
    safetyNote: "Monitor all drowning patients with pulse oximetry continuously. Any deterioration in respiratory status should prompt immediate reassessment and possible escalation of respiratory support.",
    distractorRationales: [
      "4-hour observation is insufficient given the risk of delayed pulmonary deterioration within 24 hours",
      "Prophylactic antibiotics are not recommended and may promote resistant organisms",
      "Immediate intubation is not indicated as the child is alert with adequate spontaneous respirations, though close monitoring is needed"
    ],
    lessonLink: "/emergency/lessons/drowning-management"
  },
  {
    stem: "A 35-year-old female presents to the ED 20 minutes after eating shrimp at a restaurant. She reports throat tightness, difficulty swallowing, diffuse urticaria, and wheezing. Vital signs: BP 78/42, HR 142, RR 28, SpO2 88%. She has audible stridor and is using accessory muscles. She has an EpiPen but did not use it because she 'wasn't sure it was bad enough.' What is the FIRST medication that should be administered?",
    options: [
      "Diphenhydramine 50 mg IV for the allergic reaction and urticaria",
      "Methylprednisolone 125 mg IV to prevent biphasic reaction",
      "Epinephrine 0.3 mg intramuscular (IM) in the anterolateral thigh",
      "Albuterol nebulizer for the wheezing and bronchospasm"
    ],
    correctAnswer: 2,
    rationaleLong: "The first medication that must be administered is epinephrine 0.3 mg intramuscular (IM) in the anterolateral thigh. This patient is experiencing severe anaphylaxis with multi-system involvement: cardiovascular (hypotension at 78/42, tachycardia at 142), respiratory (stridor indicating upper airway edema, wheezing indicating lower airway bronchospasm, SpO2 88%, accessory muscle use), and dermatologic (diffuse urticaria). Epinephrine is the FIRST-LINE and ONLY life-saving medication for anaphylaxis. There is NO contraindication to epinephrine in anaphylaxis. The IM route in the anterolateral thigh (vastus lateralis) provides the fastest and most reliable absorption compared to subcutaneous or deltoid injection. The mechanism of epinephrine in anaphylaxis includes: alpha-1 adrenergic effects causing vasoconstriction to reverse hypotension and reduce mucosal edema, beta-1 effects increasing cardiac output, beta-2 effects causing bronchodilation and reducing mast cell mediator release. The dose for adults is 0.3-0.5 mg of 1:1000 (1 mg/mL) concentration IM, and can be repeated every 5-15 minutes if symptoms persist. Every minute of delay in epinephrine administration during anaphylaxis increases the risk of death. Studies consistently show that the most common error in anaphylaxis management is failure to administer or delayed administration of epinephrine. Antihistamines (diphenhydramine) and corticosteroids (methylprednisolone) are adjunctive therapies that should be given AFTER epinephrine but should NEVER delay epinephrine administration. H1 blockers help with urticaria and itching but do NOT treat the life-threatening cardiovascular and respiratory effects. Corticosteroids may help prevent biphasic reactions but take hours to have effect. Albuterol can help with bronchospasm but does not address the cardiovascular collapse or upper airway edema.",
    learningObjective: "Recognize epinephrine IM as the first-line and only life-saving treatment for anaphylaxis, and identify barriers to timely administration",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Anaphylaxis",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "There is NO contraindication to epinephrine in anaphylaxis - not even in elderly patients or those with cardiac history. The risk of NOT giving epinephrine far exceeds any risk from the medication",
    clinicalPearls: [
      "Epinephrine IM in the anterolateral thigh is the first and most important treatment for anaphylaxis",
      "The most common fatal error in anaphylaxis management is failure to give or delay in giving epinephrine",
      "Epinephrine can be repeated every 5-15 minutes - there is no maximum number of doses",
      "Biphasic anaphylaxis (recurrence of symptoms) occurs in 5-20% of cases, typically within 8-12 hours"
    ],
    safetyNote: "All patients treated for anaphylaxis should be observed for a minimum of 4-6 hours (some guidelines recommend up to 24 hours for severe reactions) due to risk of biphasic reaction.",
    distractorRationales: [
      "Diphenhydramine treats urticaria but does NOT reverse the life-threatening cardiovascular and airway components of anaphylaxis",
      "Methylprednisolone takes hours to work and is adjunctive only - it cannot reverse acute anaphylaxis",
      "Albuterol addresses bronchospasm but not the upper airway edema (stridor) or cardiovascular collapse"
    ],
    lessonLink: "/emergency/lessons/anaphylaxis-management"
  },
  {
    stem: "A 72-year-old male with a history of chronic kidney disease presents with progressive weakness over 3 days. ECG shows peaked T waves, widened QRS complexes, and absent P waves. Serum potassium returns at 7.8 mEq/L. The patient is alert and reports paresthesias in his hands and feet. What is the CORRECT order of interventions?",
    options: [
      "IV insulin and dextrose, then IV calcium gluconate, then sodium bicarbonate, then kayexalate",
      "IV calcium gluconate to stabilize the myocardium, then IV insulin with dextrose to shift potassium intracellularly, then arrange emergent dialysis",
      "Kayexalate orally to remove potassium, then IV normal saline, then recheck potassium in 4 hours",
      "Albuterol nebulizer to shift potassium, then IV calcium gluconate, then IV furosemide"
    ],
    correctAnswer: 1,
    rationaleLong: "The correct order of interventions for severe hyperkalemia with ECG changes is: (1) IV calcium gluconate to stabilize the cardiac membrane, (2) IV regular insulin with dextrose to shift potassium intracellularly, and (3) arrange emergent dialysis for definitive potassium removal in a patient with chronic kidney disease. This patient has severe, life-threatening hyperkalemia (7.8 mEq/L) with significant ECG changes (peaked T waves, widened QRS, absent P waves). The ECG changes indicate that the hyperkalemia is affecting cardiac conduction and the patient is at imminent risk for ventricular fibrillation or asystole. The treatment follows a systematic approach based on mechanism: STABILIZE the heart (calcium), SHIFT potassium into cells (insulin/dextrose, albuterol, bicarbonate), and REMOVE potassium from the body (dialysis, kayexalate, loop diuretics). Calcium gluconate (10 mL of 10% solution IV over 2-3 minutes) is given FIRST because it directly stabilizes the cardiac membrane by raising the threshold potential, reducing the risk of fatal arrhythmia. It works within 1-3 minutes but does NOT lower serum potassium - it is a temporizing measure to prevent cardiac arrest. IV regular insulin (10 units) with dextrose (25-50 grams of D50) is given next to shift potassium intracellularly. Insulin activates the Na+/K+ ATPase pump, driving potassium into cells. This works within 15-30 minutes and lowers potassium by 0.5-1.5 mEq/L. The dextrose is given to prevent hypoglycemia. For a patient with CKD who cannot excrete potassium renally, emergent hemodialysis is the definitive treatment for potassium removal. Loop diuretics (furosemide) are unlikely to be effective in advanced CKD. Sodium polystyrene sulfonate (kayexalate) has questionable efficacy and slow onset and should not be relied upon as a primary treatment.",
    learningObjective: "Implement the correct sequence of interventions for life-threatening hyperkalemia: cardiac stabilization, intracellular potassium shifting, and definitive potassium removal",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Severe Electrolyte Imbalances",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Calcium gluconate does NOT lower potassium - it stabilizes the cardiac membrane. Insulin/dextrose SHIFTS potassium but does not remove it. Only dialysis, diuretics, or kayexalate REMOVE potassium",
    clinicalPearls: [
      "ECG changes in hyperkalemia progress: peaked T waves -> PR prolongation -> QRS widening -> absent P waves -> sine wave -> VF/asystole",
      "Calcium gluconate works in 1-3 minutes to stabilize the heart but does not lower potassium levels",
      "Insulin/dextrose lowers potassium by 0.5-1.5 mEq/L within 15-30 minutes - monitor glucose for 4-6 hours after",
      "In CKD patients, dialysis is the definitive treatment for severe hyperkalemia"
    ],
    safetyNote: "Monitor blood glucose every 30-60 minutes for 4-6 hours after insulin administration for hyperkalemia - delayed hypoglycemia is common and can be fatal.",
    distractorRationales: [
      "Giving insulin before calcium risks cardiac arrest - the heart must be stabilized first",
      "Kayexalate is slow-acting, has questionable efficacy, and should not be the primary intervention for life-threatening hyperkalemia",
      "Albuterol before calcium delays cardiac stabilization, and furosemide is unlikely to work in CKD"
    ],
    lessonLink: "/emergency/lessons/electrolyte-emergencies"
  },
  {
    stem: "A 28-year-old male is brought to the ED after a motorcycle crash. He complains of severe bilateral thigh pain and dark brown urine. He was pinned under his motorcycle for approximately 2 hours before extraction. Vital signs: BP 100/62, HR 118, RR 22, SpO2 98%, temp 36.8C. Labs show: CK 82,000 U/L, potassium 6.4 mEq/L, calcium 6.8 mg/dL, creatinine 2.6 mg/dL, urine myoglobin positive. What is the PRIMARY goal of fluid resuscitation in this patient?",
    options: [
      "Replace intravascular volume to maintain blood pressure above 90 systolic",
      "Achieve a urine output of 200-300 mL/hr to prevent myoglobin-induced renal tubular obstruction",
      "Dilute the serum potassium concentration to prevent cardiac arrhythmias",
      "Correct the metabolic acidosis by flushing hydrogen ions through the kidneys"
    ],
    correctAnswer: 1,
    rationaleLong: "The primary goal of fluid resuscitation in rhabdomyolysis is to achieve a urine output of 200-300 mL/hr to prevent myoglobin-induced acute kidney injury. This patient presents with traumatic rhabdomyolysis from prolonged crush injury (pinned under motorcycle for 2 hours). The massively elevated CK (82,000 U/L) confirms extensive muscle breakdown, and the positive urine myoglobin indicates that myoglobin is being filtered through the kidneys. Myoglobin is directly nephrotoxic through multiple mechanisms: it causes renal tubular obstruction by precipitating in the tubular lumen (especially in acidic urine), it generates free radicals that damage tubular epithelial cells, and it causes renal vasoconstriction reducing renal blood flow. The key to preventing rhabdomyolysis-induced acute kidney injury is aggressive IV fluid resuscitation to maintain high urine flow rates (200-300 mL/hr or 3-6 mL/kg/hr), which flushes myoglobin through the renal tubules before it can precipitate and cause obstruction. This typically requires IV normal saline infusion rates of 1-1.5 liters per hour initially. A Foley catheter should be placed to accurately measure hourly urine output, which is the primary target of resuscitation. The fluid requirements can be enormous - patients with severe rhabdomyolysis may need 10-20 liters in the first 24 hours. Sodium bicarbonate may be added to alkalinize the urine (target urine pH >6.5), as myoglobin is more soluble in alkaline urine and less likely to precipitate. The associated electrolyte abnormalities (hyperkalemia 6.4, hypocalcemia 6.8) result from muscle cell lysis releasing intracellular contents (potassium, phosphate, myoglobin) while calcium is consumed by damaged muscle tissue. These must be monitored and treated, but the cornerstone of management is aggressive fluid resuscitation targeting urine output.",
    learningObjective: "Understand the pathophysiology of rhabdomyolysis-induced AKI and the critical role of aggressive fluid resuscitation with urine output targets of 200-300 mL/hr",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Rhabdomyolysis",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The urine output target in rhabdomyolysis (200-300 mL/hr) is MUCH higher than typical resuscitation targets (0.5-1 mL/kg/hr) - do not confuse the two",
    clinicalPearls: [
      "Target urine output in rhabdomyolysis is 200-300 mL/hr (3-6 mL/kg/hr) - much higher than usual targets",
      "CK levels above 5,000 U/L significantly increase the risk of AKI from myoglobin deposition",
      "Patients may need 10-20 liters of IV fluid in the first 24 hours of rhabdomyolysis management",
      "Avoid calcium replacement in rhabdomyolysis unless symptomatic - calcium can deposit in damaged muscle tissue"
    ],
    safetyNote: "Monitor for fluid overload during aggressive resuscitation for rhabdomyolysis. Auscultate lungs frequently and monitor for signs of pulmonary edema, especially in patients with renal impairment.",
    distractorRationales: [
      "Maintaining systolic BP >90 is important but is not the PRIMARY goal - urine output drives the fluid strategy",
      "Diluting potassium is a secondary benefit of fluids but not the primary rationale for the aggressive resuscitation rates",
      "Correcting acidosis is achieved partly through fluids but the primary goal is preventing renal tubular myoglobin deposition"
    ],
    lessonLink: "/emergency/lessons/rhabdomyolysis-management"
  },
  {
    stem: "A 48-year-old female presents to the ED with sudden onset of severe abdominal pain that started 2 hours ago. She describes the pain as 'the worst pain of my life,' rating it 10/10, diffuse across the abdomen. She has atrial fibrillation and is not taking her prescribed anticoagulation. Vital signs: BP 142/88, HR 108, RR 22, temp 37.4C, SpO2 97%. Abdominal exam reveals diffuse tenderness but the abdomen is soft with minimal guarding. The pain seems 'out of proportion to the physical exam findings.' What diagnosis should the nurse suspect?",
    options: [
      "Acute pancreatitis given the severity of pain and diffuse tenderness",
      "Ruptured ovarian cyst causing acute peritoneal irritation",
      "Acute mesenteric ischemia based on pain out of proportion to exam in an atrial fibrillation patient",
      "Small bowel obstruction causing colicky abdominal pain"
    ],
    correctAnswer: 2,
    rationaleLong: "The nurse should suspect acute mesenteric ischemia (AMI) based on the hallmark presentation of abdominal pain that is 'out of proportion to the physical examination findings' in a patient with atrial fibrillation who is not anticoagulated. AMI is a vascular emergency with a mortality rate exceeding 60-80% if not diagnosed and treated promptly. The most common cause of AMI is arterial embolism, and atrial fibrillation is the most common source of mesenteric emboli. This patient has the classic risk profile: atrial fibrillation without anticoagulation, allowing thrombus formation in the left atrial appendage that can embolize to the superior mesenteric artery. The pathognomonic presentation of AMI is severe abdominal pain that seems disproportionate to the physical examination. Early in the course, the ischemic bowel causes visceral pain (severe, poorly localized) but has not yet developed transmural necrosis that would cause peritoneal signs (guarding, rigidity, rebound tenderness). This discrepancy between subjective pain severity and objective exam findings is the key clinical clue. As the ischemia progresses to infarction, the bowel becomes necrotic, bacteria translocate, and the patient develops peritonitis, sepsis, and multi-organ failure. By the time peritoneal signs develop, the mortality rate is extremely high. Laboratory findings may include an elevated lactate level (often dramatically elevated), leukocytosis, and metabolic acidosis. CT angiography of the abdomen is the diagnostic study of choice and should be obtained urgently. Treatment involves heparinization, fluid resuscitation, broad-spectrum antibiotics, and emergent surgical or interventional radiology consultation for revascularization. The triage nurse should communicate the suspicion for AMI to the treatment team to expedite imaging and surgical consultation.",
    learningObjective: "Recognize the classic presentation of acute mesenteric ischemia - pain out of proportion to physical exam findings - in patients with embolic risk factors such as atrial fibrillation",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Acute Abdomen",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Pain out of proportion to physical exam + atrial fibrillation = think mesenteric ischemia until proven otherwise. By the time peritoneal signs develop, mortality is extremely high",
    clinicalPearls: [
      "Pain out of proportion to physical exam is the hallmark of early mesenteric ischemia",
      "Atrial fibrillation is the most common source of mesenteric arterial emboli",
      "Lactate elevation in the setting of abdominal pain should raise suspicion for mesenteric ischemia",
      "CT angiography is the diagnostic study of choice for suspected mesenteric ischemia"
    ],
    safetyNote: "Acute mesenteric ischemia has a narrow window for intervention. Any patient with AF and severe abdominal pain out of proportion to exam needs urgent CT angiography.",
    distractorRationales: [
      "Acute pancreatitis typically has epigastric pain radiating to the back and would not explain pain out of proportion to exam",
      "Ruptured ovarian cyst would cause localized pelvic pain with peritoneal signs, not diffuse pain out of proportion to exam",
      "SBO presents with colicky pain, distension, and vomiting with hyperactive bowel sounds, not pain out of proportion to exam"
    ],
    lessonLink: "/emergency/lessons/acute-abdomen"
  },
  {
    stem: "A 55-year-old male with a history of alcohol use disorder presents with hematemesis. He reports vomiting approximately 500 mL of bright red blood over the past hour. On arrival, he is anxious, pale, and diaphoretic. Vital signs: BP 86/54, HR 132, RR 24, SpO2 96%, temp 36.4C. He has spider angiomata, palmar erythema, and splenomegaly. The nurse anticipates this is a variceal hemorrhage. What is the priority nursing action?",
    options: [
      "Insert a nasogastric tube to assess the character and quantity of the bleeding",
      "Establish two large-bore (14-16 gauge) IV lines, initiate fluid resuscitation, activate massive transfusion protocol, and administer octreotide as ordered",
      "Administer a proton pump inhibitor IV push to reduce gastric acid secretion",
      "Position the patient in left lateral decubitus and prepare for urgent endoscopy"
    ],
    correctAnswer: 1,
    rationaleLong: "The priority nursing action is to establish two large-bore IV lines (14-16 gauge), initiate fluid resuscitation, activate the massive transfusion protocol, and administer octreotide as ordered. This patient is presenting with hemorrhagic shock (Class III hemorrhage) from suspected esophageal variceal bleeding, a life-threatening complication of portal hypertension secondary to alcoholic cirrhosis. The physical findings (spider angiomata, palmar erythema, splenomegaly) confirm chronic liver disease with portal hypertension. Variceal hemorrhage has a mortality rate of 15-20% per episode. The nursing priorities follow the hemorrhagic shock resuscitation sequence: First, establish vascular access with two large-bore peripheral IVs (14-16 gauge). Large-bore peripheral IVs allow faster flow rates than central lines for initial resuscitation. Second, initiate volume resuscitation. In actively bleeding variceal patients, the goal is to restore circulating volume while avoiding over-resuscitation that could increase portal pressure and worsen bleeding. The massive transfusion protocol should be activated given the hemodynamic instability and ongoing hemorrhage. Third, pharmacological therapy with octreotide (somatostatin analog) should be administered as soon as possible. Octreotide reduces portal venous pressure and splanchnic blood flow, decreasing the driving pressure behind variceal bleeding. The typical dose is a 50 mcg IV bolus followed by a 50 mcg/hour continuous infusion. Antibiotics (ceftriaxone 1g IV) should also be administered as prophylaxis against spontaneous bacterial peritonitis, which occurs in up to 45% of cirrhotic patients with GI bleeding. Type and crossmatch for at least 6 units of packed RBCs should be sent, and a target hemoglobin of 7-8 g/dL is recommended for variceal bleeding (restrictive transfusion strategy). The patient should be prepared for emergent upper endoscopy with band ligation, which is the definitive treatment for variceal bleeding.",
    learningObjective: "Implement priority nursing interventions for acute variceal hemorrhage including vascular access, volume resuscitation, massive transfusion protocol, and pharmacological therapy",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "GI Bleeding",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "In variceal bleeding, avoid over-resuscitation with IV fluids as this can increase portal pressure and worsen hemorrhage - use a restrictive transfusion strategy targeting Hgb 7-8 g/dL",
    clinicalPearls: [
      "Large-bore peripheral IVs (14-16 gauge) allow faster flow rates than central venous catheters for initial resuscitation",
      "Octreotide reduces portal pressure and should be started as soon as variceal bleeding is suspected",
      "Prophylactic antibiotics (ceftriaxone) reduce mortality in cirrhotic patients with GI bleeding",
      "Target hemoglobin 7-8 g/dL in variceal bleeding - over-transfusion increases portal pressure"
    ],
    safetyNote: "In massive upper GI hemorrhage, airway protection is critical. Position the patient to prevent aspiration and have suction and intubation equipment immediately available.",
    distractorRationales: [
      "NGT insertion is not a priority and may provoke further vomiting/aspiration in an actively bleeding patient with hemorrhagic shock",
      "PPI is appropriate for non-variceal upper GI bleeding but is not first-line for variceal hemorrhage - octreotide is the correct pharmacological agent",
      "Left lateral positioning without establishing IV access and resuscitation delays critical interventions"
    ],
    lessonLink: "/emergency/lessons/gi-bleeding-management"
  },
  {
    stem: "A 29-year-old female presents to the ED with right lower quadrant pain, vaginal spotting, and dizziness. Her last menstrual period was 7 weeks ago. Vital signs: BP 88/56, HR 128, RR 22, SpO2 99%. She is pale and diaphoretic with rebound tenderness in the right lower quadrant. A point-of-care pregnancy test is positive. What is the MOST critical initial action?",
    options: [
      "Obtain a quantitative beta-hCG level and schedule a transvaginal ultrasound",
      "Administer IV morphine for pain management and obtain a CBC",
      "Establish two large-bore IV lines, type and crossmatch, and prepare for possible emergent surgical intervention",
      "Obtain a pelvic ultrasound to determine if the pregnancy is intrauterine"
    ],
    correctAnswer: 2,
    rationaleLong: "The most critical initial action is to establish two large-bore IV lines, send type and crossmatch, and prepare for possible emergent surgical intervention. This patient presents with a classic presentation of ruptured ectopic pregnancy with hemorrhagic shock: reproductive-age female with amenorrhea (7 weeks since LMP), positive pregnancy test, vaginal spotting, right lower quadrant pain with peritoneal signs (rebound tenderness), and hemodynamic instability (hypotension 88/56, tachycardia 128, signs of poor perfusion with pallor and diaphoresis). Ruptured ectopic pregnancy is a gynecological emergency and the leading cause of pregnancy-related death in the first trimester. The ruptured ectopic (most commonly in the fallopian tube) causes intraperitoneal hemorrhage that can lead to hemorrhagic shock and death if not treated surgically. The hemodynamic instability indicates that significant intraperitoneal bleeding has already occurred. The nursing priority is to prepare for hemorrhagic shock resuscitation and emergent surgical intervention: establish two large-bore (16-18 gauge) peripheral IV lines for rapid fluid and blood product administration, send type and crossmatch immediately (blood should be available within 15-30 minutes), initiate fluid resuscitation with crystalloid while blood products are being prepared, notify the OB/GYN surgeon for emergent consultation, and prepare the patient for possible emergent laparotomy or laparoscopy. A point-of-care bedside ultrasound (FAST exam) can be performed in the ED to confirm free fluid (hemoperitoneum) in the pelvis, but formal ultrasound or quantitative beta-hCG should NOT delay surgical intervention in a hemodynamically unstable patient. If the patient's condition deteriorates, emergency O-negative blood should be transfused without waiting for crossmatch results.",
    learningObjective: "Recognize ruptured ectopic pregnancy as a surgical emergency in reproductive-age females with positive pregnancy test, abdominal pain, and hemodynamic instability",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Ectopic Pregnancy",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do NOT delay surgical intervention in a hemodynamically unstable patient with suspected ruptured ectopic pregnancy to obtain quantitative beta-hCG or formal ultrasound",
    clinicalPearls: [
      "Classic ruptured ectopic triad: amenorrhea + vaginal bleeding + abdominal pain in a reproductive-age female",
      "Ruptured ectopic pregnancy is the leading cause of first-trimester pregnancy-related death",
      "Bedside FAST exam can rapidly identify free pelvic fluid suggesting hemoperitoneum",
      "In unstable patients, transfuse O-negative blood without waiting for crossmatch"
    ],
    safetyNote: "Every reproductive-age female presenting with abdominal pain should have a pregnancy test performed. Ectopic pregnancy can occur even with IUD in place or history of tubal ligation.",
    distractorRationales: [
      "Quantitative beta-hCG and scheduled ultrasound delays critical surgical intervention in a hemodynamically unstable patient",
      "Pain management is important but secondary to addressing hemorrhagic shock and the surgical emergency",
      "Pelvic ultrasound is useful for stable patients but should not delay intervention in hemodynamic instability"
    ],
    lessonLink: "/emergency/lessons/ectopic-pregnancy"
  },
  {
    stem: "A 60-year-old male presents to the ED with sudden onset of severe respiratory distress. He had a central venous catheter placed 30 minutes ago on the medical floor. Vital signs: BP 78/44, HR 136, RR 36, SpO2 78%. He has absent breath sounds on the left side, tracheal deviation to the right, distended neck veins, and subcutaneous emphysema in the left neck and chest. What is the IMMEDIATE nursing action?",
    options: [
      "Obtain a stat portable chest X-ray to confirm the diagnosis",
      "Prepare for and assist with emergent needle decompression of the left chest",
      "Increase supplemental oxygen to 100% via non-rebreather mask and call a rapid response",
      "Prepare for emergent chest tube placement by gathering a chest tube tray"
    ],
    correctAnswer: 1,
    rationaleLong: "The immediate nursing action is to prepare for and assist with emergent needle decompression of the left chest. This patient is presenting with tension pneumothorax, a life-threatening emergency requiring immediate intervention without waiting for radiographic confirmation. The classic presentation includes: sudden respiratory distress following a procedure (central line placement - a known risk factor for iatrogenic pneumothorax), absent breath sounds on the affected side (left), tracheal deviation AWAY from the affected side (deviated to the right), distended neck veins (from impaired venous return due to mediastinal shift), hypotension and tachycardia (obstructive shock from impaired venous return and cardiac compression), severe hypoxemia (SpO2 78%), and subcutaneous emphysema (air tracking through tissue planes). Tension pneumothorax occurs when air enters the pleural space through a one-way valve mechanism and cannot escape, causing progressive pressure buildup that compresses the mediastinum, impairs venous return, and eventually causes cardiovascular collapse and death. This is a clinical diagnosis that requires immediate treatment - waiting for a chest X-ray can be fatal. Needle decompression is performed by inserting a large-bore (14-16 gauge) angiocatheter into the second intercostal space at the midclavicular line (or the fourth-fifth intercostal space at the anterior axillary line, which is preferred in current ATLS guidelines due to better success rate). This converts the tension pneumothorax to a simple pneumothorax by allowing trapped air to escape. Definitive treatment with tube thoracostomy (chest tube) follows needle decompression. The nurse should: prepare the needle decompression equipment, position the patient, assist the physician with the procedure, and have chest tube equipment ready for definitive management. Increasing oxygen alone will not address the underlying mechanical problem.",
    learningObjective: "Recognize tension pneumothorax as a clinical diagnosis requiring immediate needle decompression without waiting for radiographic confirmation",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Airway Emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Tension pneumothorax is a CLINICAL diagnosis - NEVER delay treatment to obtain a chest X-ray. The classic signs are sufficient for immediate intervention",
    clinicalPearls: [
      "Tension pneumothorax signs: absent breath sounds, tracheal deviation away from affected side, JVD, hypotension",
      "Needle decompression site: 2nd ICS midclavicular line or 4th-5th ICS anterior axillary line",
      "Central line placement is a common cause of iatrogenic pneumothorax",
      "Subcutaneous emphysema indicates air has escaped the pleural space into soft tissues"
    ],
    safetyNote: "Tension pneumothorax is immediately life-threatening. The nurse should have needle decompression equipment readily available in all resuscitation areas and be familiar with the procedure.",
    distractorRationales: [
      "Chest X-ray delays life-saving intervention and the patient may arrest while waiting for imaging",
      "Increasing oxygen alone does not address the mechanical cause of the respiratory failure and cardiovascular collapse",
      "Chest tube is definitive treatment but is slower to set up than needle decompression - decompress first, then place the chest tube"
    ],
    lessonLink: "/emergency/lessons/airway-emergencies"
  },
  {
    stem: "A 44-year-old male presents to the ED with severe epigastric pain radiating to his back, nausea, and vomiting. He reports heavy alcohol use over the past weekend. Vital signs: BP 96/58, HR 122, RR 24, temp 38.2C, SpO2 96%. Labs show: lipase 1,842 U/L (normal <60), WBC 16,800, BUN 32, creatinine 1.8, glucose 286 mg/dL, calcium 7.2 mg/dL, LDH 420, AST 186. Using the Ranson criteria on admission, which findings indicate severe acute pancreatitis?",
    options: [
      "Only the elevated lipase confirms the diagnosis and severity",
      "Age under 55, WBC >16,000, glucose >200, LDH >350, and AST >250 are the admission Ranson criteria - this patient meets 3 of 5",
      "The elevated BUN and creatinine alone determine severity",
      "Ranson criteria cannot be calculated until 48 hours after admission"
    ],
    correctAnswer: 1,
    rationaleLong: "The Ranson criteria are a clinical prediction tool used to assess the severity of acute pancreatitis. There are five criteria assessed at admission and six additional criteria assessed at 48 hours. The admission criteria (using the mnemonic GA LAW) are: Glucose >200 mg/dL (this patient: 286 - YES), Age >55 years (this patient: 44 - NO), LDH >350 IU/L (this patient: 420 - YES), AST >250 IU/L (this patient: 186 - NO), WBC >16,000/mm3 (this patient: 16,800 - YES). This patient meets 3 of the 5 admission Ranson criteria (elevated glucose, elevated LDH, elevated WBC), which indicates a moderate-to-severe case. A score of 3 or more is associated with increased morbidity and mortality: 0-2 criteria = minimal mortality (<5%), 3-4 criteria = 15-20% mortality, 5-6 criteria = 40% mortality, 7-8 criteria = near 100% mortality. The additional 48-hour criteria include: hematocrit decrease >10%, BUN increase >5 mg/dL, calcium <8 mg/dL, PaO2 <60 mmHg, base deficit >4, and fluid sequestration >6 liters. This patient's calcium is already low (7.2) and BUN is elevated, suggesting that the 48-hour score will likely worsen. The nursing implications of severe pancreatitis include: aggressive IV fluid resuscitation (250-500 mL/hr of lactated Ringer's is preferred in the first 12-24 hours), NPO status, pain management (typically IV opioids), close monitoring for organ dysfunction (respiratory failure, renal failure, cardiovascular collapse), and preparation for possible ICU admission. The nurse should also monitor for complications including necrotizing pancreatitis, infected pancreatic necrosis, ARDS, and abdominal compartment syndrome.",
    learningObjective: "Apply Ranson criteria at admission to assess acute pancreatitis severity and understand the nursing implications of severe pancreatitis",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Acute Abdomen",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Lipase confirms the DIAGNOSIS of pancreatitis but does NOT correlate with severity - the Ranson criteria, BISAP score, or CT severity index are used for severity assessment",
    clinicalPearls: [
      "Ranson admission criteria mnemonic GA LAW: Glucose >200, Age >55, LDH >350, AST >250, WBC >16,000",
      "3+ Ranson criteria indicates severe pancreatitis with 15-20% mortality",
      "Lactated Ringer's is preferred over normal saline for pancreatitis fluid resuscitation",
      "Lipase level does not correlate with disease severity - clinical scoring systems are needed"
    ],
    safetyNote: "Aggressive early fluid resuscitation (within first 12-24 hours) significantly improves outcomes in severe acute pancreatitis. Monitor closely for fluid overload.",
    distractorRationales: [
      "Lipase confirms diagnosis but does not assess severity - it is not part of the Ranson criteria",
      "BUN and creatinine alone are insufficient - the Ranson criteria use multiple parameters for risk stratification",
      "While 48-hour criteria exist, the admission criteria can and should be calculated immediately to guide initial management"
    ],
    lessonLink: "/emergency/lessons/acute-abdomen"
  },
  {
    stem: "A 38-year-old construction worker is brought to the ED on a hot summer day after collapsing at a work site. Coworkers report he was working outdoors for 8 hours with minimal fluid intake. He is confused, combative, and his skin is hot and dry. Vital signs: temp 41.4C (106.5F), HR 144, BP 92/58, RR 30, SpO2 96%. What distinguishes this presentation as heat stroke rather than heat exhaustion?",
    options: [
      "The patient's heart rate is above 120 bpm",
      "The patient has an altered mental status with core temperature above 40C (104F)",
      "The patient is hypotensive and dehydrated from prolonged heat exposure",
      "The patient was working outdoors for more than 6 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "The distinguishing feature of heat stroke versus heat exhaustion is the presence of altered mental status (CNS dysfunction) in combination with a core temperature above 40C (104F). This is the critical diagnostic distinction between the two conditions. Heat exhaustion presents with temperatures typically below 40C, heavy sweating, weakness, nausea, headache, and dizziness, but the patient maintains NORMAL mental status. The patient may feel faint but remains oriented and cognitively intact. Heat stroke, by contrast, is defined by CNS dysfunction (confusion, combativeness, seizures, loss of consciousness, ataxia) in the setting of environmental heat exposure with elevated core temperature above 40C. This patient demonstrates clear CNS dysfunction: confusion and combativeness with a core temperature of 41.4C, definitively classifying this as exertional heat stroke. The hot, dry skin (rather than diaphoretic skin) is a classic but not universal finding - some heat stroke patients, particularly with exertional heat stroke, may still be sweating. The absence of sweating suggests the thermoregulatory system has failed. Exertional heat stroke (EHS) occurs in individuals performing vigorous physical activity in hot environments, as opposed to classic (non-exertional) heat stroke, which typically affects elderly or chronically ill individuals during heat waves. EHS carries a mortality rate of up to 10% even with treatment, and this rate increases significantly with delayed cooling. Treatment requires immediate aggressive cooling with a target of reducing core temperature to below 39C (102.2F) within 30 minutes. Cold water immersion (CWI) is the gold standard cooling method with the fastest cooling rates (0.2C/minute). The nurse should initiate cooling measures immediately upon recognition, including removing clothing, applying ice packs to groin/axillae/neck, and preparing for cold water immersion if available.",
    learningObjective: "Differentiate heat stroke from heat exhaustion based on the presence of altered mental status and core temperature above 40C, and implement immediate aggressive cooling",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Heat Stroke and Hypothermia",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "The key distinction is CNS dysfunction (altered mental status) - NOT the degree of dehydration, heart rate, or duration of exposure",
    clinicalPearls: [
      "Heat stroke = core temp >40C + altered mental status (CNS dysfunction)",
      "Heat exhaustion = elevated temp <40C + profuse sweating + normal mental status",
      "Cold water immersion is the gold standard cooling method with the fastest cooling rates",
      "Target: reduce core temp to <39C within 30 minutes of recognition"
    ],
    safetyNote: "Begin cooling immediately - do not delay for diagnostic workup. Every minute of elevated core temperature increases the risk of irreversible organ damage.",
    distractorRationales: [
      "Heart rate above 120 can occur in both heat exhaustion and heat stroke",
      "Hypotension and dehydration can occur in both conditions",
      "Duration of heat exposure does not differentiate heat stroke from heat exhaustion"
    ],
    lessonLink: "/emergency/lessons/heat-stroke-hypothermia"
  },
  {
    stem: "A 50-year-old male is pulled from a lake after a boating accident in 5C (41F) water. He was submerged for approximately 15 minutes. On arrival, he is unresponsive with a barely palpable pulse. Vital signs: temp 28C (82.4F), HR 32 (irregular), BP 62/40, RR 6 (shallow). ECG shows atrial fibrillation with slow ventricular response and prominent J (Osborn) waves. What is the CRITICAL principle guiding this patient's resuscitation?",
    options: [
      "Aggressive rewarming should be avoided because it may cause rewarming arrhythmias",
      "The patient should be pronounced dead due to the prolonged submersion time and cardiac instability",
      "The patient is not dead until warm and dead - active rewarming must be achieved before determining neurological outcome",
      "External rewarming with warm blankets is sufficient for moderate hypothermia"
    ],
    correctAnswer: 2,
    rationaleLong: "The critical principle guiding this patient's resuscitation is 'the patient is not dead until warm and dead' - meaning that active rewarming must be achieved and core temperature restored to at least 32-35C before neurological outcome can be determined or resuscitation efforts terminated. Severe hypothermia (core temperature below 28C, though this patient is at 28C which is at the threshold) causes profound physiological changes that can mimic death: severe bradycardia, hypotension, minimal respiratory effort, fixed and dilated pupils, and absent reflexes. However, hypothermia is also profoundly neuroprotective - the cold brain requires significantly less oxygen, and patients have survived neurologically intact after prolonged cold-water submersion with core temperatures as low as 13.7C. The J (Osborn) waves on ECG are pathognomonic for hypothermia and reflect altered ventricular repolarization at low temperatures. The atrial fibrillation with slow ventricular response is a common rhythm in moderate-to-severe hypothermia. At temperatures below 30C, the heart is particularly susceptible to ventricular fibrillation, and rough handling or invasive procedures can trigger lethal arrhythmias. Rewarming strategies for severe hypothermia include: passive external rewarming (warm environment, blankets), active external rewarming (forced warm air blankets, warm water immersion), and active core rewarming (warm IV fluids 40-42C, warm humidified oxygen, peritoneal or pleural lavage, and in extreme cases, extracorporeal rewarming with cardiopulmonary bypass or ECMO). The most effective rewarming for severe hypothermia is extracorporeal membrane oxygenation (ECMO) or cardiopulmonary bypass, which provides the fastest rewarming rate and hemodynamic support. The ED nurse should handle the patient gently to avoid triggering VF, administer warm IV fluids, apply warm blankets, and prepare for possible invasive rewarming measures.",
    learningObjective: "Apply the principle 'not dead until warm and dead' in severe hypothermia management and understand rewarming strategies for cold-water submersion",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Heat Stroke and Hypothermia",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do NOT pronounce a hypothermic patient dead based on clinical findings alone - hypothermia mimics death and is neuroprotective. Rewarm first, then assess",
    clinicalPearls: [
      "Not dead until warm and dead - resuscitation should continue until core temperature reaches at least 32-35C",
      "J (Osborn) waves on ECG are pathognomonic for hypothermia",
      "Below 30C, the heart is very susceptible to VF - handle hypothermic patients gently",
      "ECMO/cardiopulmonary bypass is the most effective rewarming method for severe hypothermia"
    ],
    safetyNote: "Handle severely hypothermic patients extremely gently to avoid triggering ventricular fibrillation. Avoid unnecessary movement, rough handling, and central line insertion if possible.",
    distractorRationales: [
      "Rewarming is essential and should NOT be avoided - the risk of remaining hypothermic far exceeds rewarming risks",
      "Pronouncing death before rewarming violates the 'not dead until warm and dead' principle in hypothermia",
      "Warm blankets alone are insufficient for severe hypothermia - active core rewarming methods are needed"
    ],
    lessonLink: "/emergency/lessons/heat-stroke-hypothermia"
  },
  {
    stem: "A 65-year-old female with type 2 diabetes presents with confusion, extreme thirst, and polyuria for the past week. She recently started on a new diuretic. Vital signs: BP 84/50, HR 128, RR 18 (normal depth), temp 37.4C, SpO2 97%. Point-of-care glucose reads 'HIGH' (>500 mg/dL). Labs: sodium 152 mEq/L, BUN 68, creatinine 3.2, serum osmolality 348 mOsm/kg, pH 7.32, bicarbonate 20 mEq/L, ketones trace. What is the key distinguishing feature that differentiates HHS from DKA?",
    options: [
      "The blood glucose level being above 500 mg/dL",
      "The presence of severe dehydration with hemodynamic instability",
      "Serum osmolality >320 mOsm/kg with minimal ketosis and pH >7.30",
      "The patient's age and type 2 diabetes history"
    ],
    correctAnswer: 2,
    rationaleLong: "The key distinguishing features that differentiate Hyperosmolar Hyperglycemic State (HHS) from Diabetic Ketoacidosis (DKA) are: serum osmolality >320 mOsm/kg, minimal to absent ketosis, and pH >7.30 (or only mild acidosis). This patient's presentation is classic HHS: serum osmolality 348 mOsm/kg (markedly elevated, >320 threshold), trace ketones only (minimal ketosis), pH 7.32 (mild acidosis but above the 7.30 threshold), normal respiratory pattern (no Kussmaul breathing indicating metabolic acidosis compensation), and profound dehydration with hypernatremia (Na 152). In contrast, DKA typically presents with: serum osmolality usually <320 mOsm/kg, significant ketonemia/ketonuria, pH <7.30 (often <7.0 in severe cases), Kussmaul respirations (deep, rapid breathing compensating for metabolic acidosis), and anion gap metabolic acidosis. HHS develops more insidiously than DKA, typically over days to weeks, and the primary pathophysiology is profound dehydration with severe hyperglycemia. Patients with HHS have enough residual insulin production to prevent significant ketogenesis but not enough to control blood glucose. The result is extreme hyperglycemia causing osmotic diuresis, which leads to severe volume depletion (patients may have 8-12 liter fluid deficits), hypernatremia, and hyperosmolality. The hyperosmolality is responsible for the neurological symptoms, particularly confusion and lethargy, and can progress to seizures and coma if serum osmolality exceeds 380 mOsm/kg. Treatment priorities are similar to DKA (fluids first, then insulin), but HHS requires even more aggressive fluid replacement and more gradual correction of glucose and osmolality to prevent cerebral edema. The new diuretic likely precipitated HHS by causing additional fluid loss and dehydration.",
    learningObjective: "Differentiate Hyperosmolar Hyperglycemic State from Diabetic Ketoacidosis using serum osmolality, ketone levels, and acid-base status",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "DKA and HHS",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not use blood glucose level alone to differentiate DKA from HHS - both can have extremely high glucose. The key differentiators are osmolality, ketones, and pH",
    clinicalPearls: [
      "HHS: osmolality >320, minimal ketones, pH >7.30, gradual onset over days to weeks",
      "DKA: osmolality usually <320, significant ketones, pH <7.30, acute onset over hours",
      "HHS fluid deficit is typically 8-12 liters - even more than DKA (5-10 liters)",
      "Mortality rate of HHS (5-20%) is higher than DKA (1-5%) due to older age and comorbidities"
    ],
    safetyNote: "Correct hyperosmolality gradually - rapid correction of osmolality can cause cerebral edema. Monitor serum sodium and osmolality frequently during treatment.",
    distractorRationales: [
      "Blood glucose above 500 can occur in both DKA and HHS - it does not differentiate them",
      "Severe dehydration occurs in both conditions, though it is typically worse in HHS",
      "While HHS is more common in type 2 diabetes and older patients, the biochemical criteria are the true differentiators"
    ],
    lessonLink: "/emergency/lessons/dka-hhs-management"
  },
  {
    stem: "A 42-year-old female presents to the ED with sudden onset of the worst headache of her life while exercising at the gym. She rates the pain as 10/10 with a thunderclap onset. She has nausea and vomiting but is alert and oriented. Vital signs: BP 178/102, HR 96, RR 18, SpO2 99%. She has a mild nuchal rigidity but no focal neurological deficits. A non-contrast CT head performed within 6 hours of onset is negative for hemorrhage. What is the NEXT appropriate step?",
    options: [
      "Discharge with migraine medications and follow-up with neurology in 1 week",
      "Perform a lumbar puncture to evaluate for xanthochromia indicating subarachnoid hemorrhage",
      "Administer IV ketorolac for the headache and observe for 4 hours",
      "Order a CT angiogram of the head only if neurological deficits develop"
    ],
    correctAnswer: 1,
    rationaleLong: "The next appropriate step is to perform a lumbar puncture (LP) to evaluate for xanthochromia, which would indicate subarachnoid hemorrhage (SAH) not detected on CT. This patient presents with a classic thunderclap headache - sudden onset, severe (worst headache of life), occurring during exertion (exercise) - which is the hallmark presentation of subarachnoid hemorrhage from a ruptured cerebral aneurysm. The nuchal rigidity further supports meningeal irritation from blood in the subarachnoid space. While non-contrast CT head is highly sensitive for SAH in the first 6 hours (approximately 98-100% sensitivity when interpreted by an experienced neuroradiologist), it is NOT 100% sensitive. A small percentage of SAH cases will have a negative initial CT, particularly small-volume hemorrhages that may be missed or have already been cleared by CSF circulation. The classic teaching is that a negative CT must be followed by lumbar puncture to definitively rule out SAH. The LP evaluates for: red blood cells that do not clear between sequential tubes (traumatic tap produces RBCs that decrease in sequential tubes, while SAH produces consistent RBC counts), xanthochromia (yellow discoloration of CSF from hemoglobin breakdown products, which takes approximately 12 hours to develop and persists for 2+ weeks), and elevated opening pressure. If the LP is performed within 12 hours of symptom onset, spectrophotometry for bilirubin in the CSF may be more sensitive than visual inspection for xanthochromia. If SAH is confirmed, urgent CT angiography or conventional angiography is needed to identify the source (aneurysm) and the patient requires neurosurgical consultation for definitive treatment (surgical clipping or endovascular coiling). Missing a SAH diagnosis has catastrophic consequences - the rebleed rate is 4% in the first 24 hours with 40% mortality per rebleed event. Discharging this patient without LP would be a significant diagnostic error.",
    learningObjective: "Recognize that a negative CT head does not rule out subarachnoid hemorrhage and that lumbar puncture is required for definitive evaluation of thunderclap headache",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Acute Abdomen",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A negative CT does NOT rule out SAH - LP is required. The sensitivity of CT decreases with time from symptom onset, dropping to approximately 85% at 24 hours",
    clinicalPearls: [
      "Thunderclap headache (worst headache of life, maximal at onset) is SAH until proven otherwise",
      "CT sensitivity for SAH: ~98% at 6 hours, ~93% at 12 hours, ~85% at 24 hours",
      "Xanthochromia takes ~12 hours to develop - LP performed too early may need to be repeated",
      "SAH rebleed rate is 4% in first 24 hours with 40% mortality per rebleed event"
    ],
    safetyNote: "Never discharge a patient with thunderclap headache without both CT and LP to rule out SAH. Missing SAH is one of the highest-risk diagnostic errors in emergency medicine.",
    distractorRationales: [
      "Discharging with migraine medications without LP is dangerous and could miss a life-threatening SAH",
      "Ketorolac and observation do not address the need to rule out SAH definitively",
      "Waiting for neurological deficits to develop before obtaining CTA may result in catastrophic rebleeding"
    ],
    lessonLink: "/emergency/lessons/acute-abdomen"
  },
  {
    stem: "A 55-year-old male with end-stage renal disease on hemodialysis presents to the ED with progressive shortness of breath, orthopnea, and bilateral lower extremity edema. He missed his last two dialysis sessions. Vital signs: BP 196/118, HR 110, RR 32, SpO2 82% on room air. He has bilateral crackles to the apices, JVD, and a new S3 gallop. ECG shows peaked T waves. BNP is 4,200 pg/mL, potassium is 6.8 mEq/L. What is the MOST comprehensive initial management plan?",
    options: [
      "IV furosemide 80 mg push, IV nitroglycerin drip, and cardiac monitoring",
      "BiPAP for respiratory support, IV calcium gluconate for hyperkalemia, nitroglycerin for afterload reduction, and arrange emergent dialysis",
      "Intubation for respiratory failure, IV insulin and dextrose for hyperkalemia, and admission to ICU",
      "IV morphine for dyspnea, oxygen via nasal cannula, and nephrology consult in the morning"
    ],
    correctAnswer: 1,
    rationaleLong: "The most comprehensive initial management plan is: BiPAP for respiratory support, IV calcium gluconate for cardiac membrane stabilization against hyperkalemia, nitroglycerin for blood pressure and afterload reduction, and arrangement of emergent dialysis. This patient presents with a critical combination of acute decompensated heart failure with pulmonary edema AND life-threatening hyperkalemia in the setting of missed dialysis sessions. Each component of the management plan addresses a specific life-threatening problem: BiPAP (bilevel positive airway pressure) addresses the severe hypoxemia (SpO2 82%) and pulmonary edema. BiPAP reduces preload, reduces afterload, improves oxygenation, and reduces work of breathing. Multiple studies demonstrate that BiPAP reduces intubation rates and mortality in acute cardiogenic pulmonary edema. This should be initiated immediately while other interventions are being prepared. IV calcium gluconate (10 mL of 10% solution over 2-3 minutes) is administered to stabilize the cardiac membrane against the hyperkalemia (6.8 mEq/L with peaked T waves on ECG). The peaked T waves indicate cardiac toxicity from hyperkalemia, and this patient is at risk for ventricular fibrillation or asystole. Calcium does not lower potassium but provides temporary cardiac protection while other treatments take effect. IV nitroglycerin infusion addresses the severe hypertension (196/118) and reduces both preload and afterload, improving cardiac function and reducing pulmonary edema. It also reduces myocardial oxygen demand. Emergent dialysis is the definitive treatment for this patient because: the kidneys cannot excrete the excess fluid (making diuretics largely ineffective), dialysis removes potassium, removes excess volume, and corrects the metabolic derangements. The nephrology team and dialysis unit should be contacted immediately for emergent hemodialysis. IV furosemide is largely ineffective in anuric or oliguric ESRD patients - the kidneys cannot respond to diuretics when there is no residual renal function.",
    learningObjective: "Develop a comprehensive initial management plan for ESRD patients presenting with pulmonary edema and hyperkalemia, addressing multiple simultaneous life threats",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Acute Renal Failure",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "IV furosemide is INEFFECTIVE in anuric ESRD patients - do not rely on diuretics when there is no residual renal function. Emergent dialysis is the only way to remove excess volume",
    clinicalPearls: [
      "BiPAP reduces intubation rates by 60% in acute cardiogenic pulmonary edema",
      "Furosemide is ineffective in anuric ESRD patients - emergent dialysis is needed for volume removal",
      "Calcium gluconate stabilizes the heart within 1-3 minutes but does not lower potassium",
      "In ESRD with hyperkalemia, avoid succinylcholine if intubation is needed - it raises potassium"
    ],
    safetyNote: "ESRD patients with missed dialysis who present with respiratory distress need emergent dialysis. Contact nephrology and the dialysis team immediately - do not wait for morning.",
    distractorRationales: [
      "Furosemide is ineffective in ESRD - the kidneys cannot respond, and this plan does not address hyperkalemia",
      "Immediate intubation is not needed if BiPAP can adequately support oxygenation and ventilation - intubation carries additional risks",
      "IV morphine for dyspnea is no longer recommended, nasal cannula is insufficient for this degree of hypoxemia, and waiting until morning for nephrology is dangerous"
    ],
    lessonLink: "/emergency/lessons/acute-renal-failure"
  },
  {
    stem: "A 30-year-old previously healthy male presents to the ED with a 3-day history of sore throat and odynophagia. Over the past 12 hours, he has developed progressive difficulty breathing, drooling, and a change in his voice described as 'hot potato voice.' He is sitting upright, leaning forward, and appears anxious. Vital signs: HR 118, RR 26, SpO2 93% on room air, temp 39.2C (102.6F). He has trismus and visible unilateral pharyngeal swelling with uvular deviation. What is the MOST dangerous potential complication of this condition?",
    options: [
      "Sepsis from the pharyngeal infection spreading systemically",
      "Airway obstruction from abscess rupture and aspiration of purulent material",
      "Cavernous sinus thrombosis from extension of infection",
      "Mediastinitis from infection tracking along fascial planes into the chest"
    ],
    correctAnswer: 1,
    rationaleLong: "The most dangerous and immediately life-threatening potential complication is airway obstruction from abscess rupture and aspiration of purulent material. This patient presents with a peritonsillar abscess (PTA) or deep neck space infection, evidenced by the progressive sore throat, odynophagia, hot potato voice (caused by swelling near the soft palate), trismus (difficulty opening mouth due to pterygoid muscle inflammation), unilateral pharyngeal swelling with uvular deviation, drooling (inability to manage secretions due to pain and swelling), and fever. The most immediately dangerous complication is spontaneous rupture of the abscess, which releases a large volume of purulent material into the oropharynx. If this occurs in a patient with an already compromised airway (as evidenced by the voice changes, SpO2 93%, and respiratory distress), the aspirated pus can cause complete airway obstruction and asphyxiation. This can occur suddenly and without warning, particularly if the patient is lying supine or sedated. The nurse should maintain the patient in an upright position (sitting forward), have suction immediately available at the bedside, alert the emergency physician and anesthesiology about the potential for airway emergency, avoid any unnecessary manipulation of the oropharynx that could precipitate rupture, and ensure difficult airway equipment is at the bedside (including surgical airway kit). While all listed complications are genuine risks of deep neck infections, airway obstruction represents the most acute and immediately life-threatening danger. Mediastinitis from infection tracking along the retropharyngeal and danger spaces is indeed very serious (mortality 30-50%) but develops over days rather than minutes. Sepsis and cavernous sinus thrombosis are similarly serious but less immediately catastrophic than acute airway loss.",
    learningObjective: "Identify airway obstruction from abscess rupture as the most immediately life-threatening complication of peritonsillar abscess and implement appropriate airway precautions",
    blueprintCategory: "Multi-system Acute Emergencies",
    subtopic: "Airway Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "While mediastinitis is a feared long-term complication with high mortality, acute airway obstruction from abscess rupture is the most IMMEDIATELY life-threatening complication",
    clinicalPearls: [
      "Hot potato voice, trismus, uvular deviation, and drooling are classic signs of peritonsillar abscess",
      "Keep the patient upright and leaning forward to protect the airway and facilitate drainage",
      "Have suction and difficult airway equipment immediately available at the bedside",
      "The 'danger space' of the neck provides a direct pathway for infection to track from the pharynx to the mediastinum"
    ],
    safetyNote: "Never lie a patient with a deep neck infection flat - maintain upright positioning to prevent aspiration if the abscess ruptures spontaneously.",
    distractorRationales: [
      "Sepsis is a serious complication but develops over hours and is treatable with antibiotics",
      "Cavernous sinus thrombosis is rare and develops over days, not immediately life-threatening",
      "Mediastinitis is very serious (30-50% mortality) but develops over days rather than presenting as an acute emergency"
    ],
    lessonLink: "/emergency/lessons/airway-emergencies"
  },
];

export const edNursingSkillsQuestions: EmergencyNursingQuestion[] = [
  {
    stem: "The emergency physician orders rapid sequence intubation (RSI) for a 70 kg male patient with acute respiratory failure. The nurse is preparing medications. The physician requests succinylcholine as the paralytic agent. Which patient history finding should the nurse IMMEDIATELY communicate to the physician before administration?",
    options: [
      "The patient has a history of gastroesophageal reflux disease",
      "The patient had a cardiac arrest with prolonged down time 48 hours ago and has been in the ICU with rhabdomyolysis and potassium of 5.8 mEq/L",
      "The patient has a latex allergy documented in his chart",
      "The patient received general anesthesia 6 months ago without complications"
    ],
    correctAnswer: 1,
    rationaleLong: "The nurse should IMMEDIATELY communicate to the physician that the patient has rhabdomyolysis with an elevated potassium of 5.8 mEq/L. Succinylcholine is a depolarizing neuromuscular blocking agent that works by causing sustained depolarization of the motor end plate. This depolarization results in the release of potassium from muscle cells, typically raising serum potassium by 0.5-1.0 mEq/L. In a patient with existing hyperkalemia (5.8 mEq/L) and ongoing rhabdomyolysis (which itself causes massive potassium release from muscle breakdown), the additional potassium surge from succinylcholine could raise the serum potassium to dangerously high levels (potentially >7 mEq/L), precipitating fatal cardiac arrhythmias including ventricular fibrillation or asystole. Conditions that contraindicate succinylcholine due to hyperkalemia risk include: crush injuries and rhabdomyolysis, extensive burns (after 24-72 hours post-burn), prolonged immobilization, spinal cord injury (after 24-72 hours), neuromuscular diseases (muscular dystrophy, denervation injuries), and pre-existing hyperkalemia. The nurse should recommend rocuronium as an alternative non-depolarizing paralytic agent, which does not cause potassium release. Rocuronium at a dose of 1.2 mg/kg provides intubating conditions in 45-60 seconds, which is comparable to succinylcholine. If succinylcholine has already been administered and hyperkalemia-related arrhythmias develop, the treatment includes IV calcium chloride or calcium gluconate for cardiac stabilization, IV insulin with dextrose, and sodium bicarbonate. The nurse's role in RSI includes not only preparing and administering medications but also performing a safety check by reviewing the patient's history for contraindications to specific agents. This is a critical patient safety function that can prevent iatrogenic harm.",
    learningObjective: "Identify absolute contraindications to succinylcholine during RSI preparation, particularly hyperkalemia and conditions causing potassium efflux from muscle cells",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "Rapid Sequence Intubation Assistance",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Succinylcholine raises potassium by 0.5-1.0 mEq/L in ALL patients - in a patient who already has hyperkalemia, this can be fatal. The nurse must communicate this before the drug is given",
    clinicalPearls: [
      "Succinylcholine raises serum potassium by 0.5-1.0 mEq/L through depolarization of muscle cells",
      "Contraindications to succinylcholine: hyperkalemia, rhabdomyolysis, burns >24hrs, spinal cord injury >24hrs, neuromuscular disease",
      "Rocuronium 1.2 mg/kg is the alternative non-depolarizing agent with onset in 45-60 seconds",
      "The nurse's pre-RSI safety check should include medication allergies, difficult airway history, and contraindications to specific agents"
    ],
    safetyNote: "Always verify serum potassium before succinylcholine administration when possible. Communicate contraindications to the physician BEFORE the medication is drawn up or administered.",
    distractorRationales: [
      "GERD history is relevant for aspiration risk during RSI but does not contraindicate succinylcholine",
      "Latex allergy does not affect the choice of paralytic agent for RSI",
      "Previous uneventful general anesthesia is reassuring, though malignant hyperthermia history would be a concern"
    ],
    lessonLink: "/emergency/lessons/rsi-assistance"
  },
  {
    stem: "A nurse is monitoring a 55-year-old patient undergoing procedural sedation with propofol and fentanyl for shoulder reduction in the ED. The patient initially responded to painful stimuli but now has no response to stimulation. Vital signs: HR 58, BP 88/52, RR 6, SpO2 86%, ETCO2 62 mmHg. What is the PRIORITY nursing intervention?",
    options: [
      "Increase the oxygen flow rate and reassess in 2 minutes",
      "Administer flumazenil to reverse the sedation",
      "Stop the sedation infusion, open the airway with jaw thrust, provide bag-valve-mask ventilation with 100% O2, and prepare for potential intubation",
      "Administer naloxone 0.4 mg IV push to reverse respiratory depression"
    ],
    correctAnswer: 2,
    rationaleLong: "The priority nursing intervention is to immediately stop the sedation infusion, open the airway using a jaw thrust maneuver, provide bag-valve-mask (BVM) ventilation with 100% oxygen, and prepare for potential intubation. This patient has progressed from moderate/deep sedation to general anesthesia with significant respiratory depression and cardiovascular compromise. The clinical findings indicate critical respiratory failure: respiratory rate of 6 (severe hypoventilation), SpO2 of 86% (significant hypoxemia), ETCO2 of 62 mmHg (severe hypercarbia indicating inadequate ventilation - normal is 35-45 mmHg), and loss of response to painful stimuli (indicating deep sedation/general anesthesia level). The cardiovascular parameters (HR 58, BP 88/52) indicate propofol-induced bradycardia and hypotension. The nursing response follows the procedural sedation complication algorithm: First, stop ALL sedating medications immediately. Second, establish airway patency using a jaw thrust (preferred over head-tilt chin-lift if cervical spine status is unknown) and insert an oral or nasal airway adjunct if needed. Third, provide positive-pressure ventilation via BVM with 100% FiO2 to address both the hypoxemia and hypercarbia. Fourth, prepare for possible endotracheal intubation if BVM ventilation is inadequate or the patient does not recover. Additional considerations include: IV fluid bolus for hypotension, atropine 0.5 mg IV for symptomatic bradycardia, and having vasopressors available. Regarding reversal agents: flumazenil reverses benzodiazepines (not used in this case - the sedatives are propofol and fentanyl), and naloxone reverses opioids (fentanyl). While naloxone could partially reverse the fentanyl-related respiratory depression, it should NOT be the primary intervention because: propofol (which has no reversal agent) is likely the primary cause of the deep sedation, and basic airway management and ventilation are more immediately important than pharmacological reversal. Naloxone may be considered as an adjunctive measure after airway management is established.",
    learningObjective: "Implement the procedural sedation complication algorithm when patients progress to deeper-than-intended sedation levels with respiratory and cardiovascular compromise",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "Procedural Sedation Monitoring",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Propofol has NO reversal agent - airway management and BVM ventilation are the primary interventions. Naloxone reverses fentanyl but does not reverse propofol",
    clinicalPearls: [
      "ETCO2 monitoring is the earliest indicator of respiratory depression during procedural sedation - it detects hypoventilation before SpO2 drops",
      "Propofol has no reversal agent - supportive airway management is the only treatment for over-sedation",
      "Procedural sedation monitoring must include continuous ETCO2, SpO2, ECG, and BP at minimum",
      "The jaw thrust maneuver opens the airway without extending the cervical spine"
    ],
    safetyNote: "ETCO2 monitoring is MANDATORY during procedural sedation per current guidelines. A rising ETCO2 above 50 mmHg indicates inadequate ventilation and should prompt intervention before desaturation occurs.",
    distractorRationales: [
      "Simply increasing oxygen and waiting 2 minutes is inappropriate for a patient with severe respiratory depression and hemodynamic instability",
      "Flumazenil reverses benzodiazepines, which were NOT used in this sedation - propofol and fentanyl were the agents",
      "Naloxone may help reverse fentanyl effects but does not address propofol-induced sedation and should not replace basic airway management"
    ],
    lessonLink: "/emergency/lessons/procedural-sedation"
  },
  {
    stem: "A nurse is administering packed red blood cells (PRBCs) to a trauma patient. Fifteen minutes into the transfusion, the patient develops fever (39.1C), rigors, flank pain, dark urine, and hypotension (BP 78/48). The nurse suspects an acute hemolytic transfusion reaction. What is the CORRECT sequence of nursing actions?",
    options: [
      "Slow the transfusion rate, administer diphenhydramine and acetaminophen, and monitor closely",
      "Stop the transfusion immediately, disconnect the blood tubing, maintain IV access with new NS tubing, notify the physician and blood bank, send the blood bag and post-transfusion blood samples to the lab",
      "Stop the transfusion, administer epinephrine for the hypotension, and start a new unit of blood from a different donor",
      "Continue the transfusion at a slower rate while administering IV fluids for the hypotension"
    ],
    correctAnswer: 1,
    rationaleLong: "The correct sequence for managing a suspected acute hemolytic transfusion reaction (AHTR) is: (1) STOP the transfusion immediately, (2) Disconnect the blood product tubing from the IV catheter (do NOT flush the blood tubing), (3) Maintain IV access by connecting new normal saline tubing to the IV catheter, (4) Keep the IV line open with NS and initiate fluid resuscitation for hypotension, (5) Notify the physician immediately, (6) Notify the blood bank, (7) Recheck the patient's identification against the blood product label for a possible clerical error, (8) Send the blood bag with attached tubing and all associated paperwork to the blood bank, (9) Draw post-transfusion blood samples (EDTA tube for DAT/Coombs test, serum for free hemoglobin, repeat type and crossmatch) from the OPPOSITE arm from the transfusion, (10) Send a urine specimen for free hemoglobin (hemoglobinuria), (11) Monitor vital signs every 15 minutes and closely assess for DIC, renal failure, and cardiovascular collapse. Acute hemolytic transfusion reactions are caused by ABO incompatibility (most commonly from clerical/identification errors) and result in complement-mediated intravascular hemolysis of the transfused red blood cells. The released hemoglobin causes hemoglobinuria (dark urine), renal tubular damage leading to acute kidney injury, activation of the coagulation cascade leading to DIC, and massive inflammatory response causing hypotension and shock. Mortality rate is 1-6% but increases significantly with the volume of incompatible blood transfused, making immediate cessation of the transfusion critical. The flank pain is caused by renal capsule distension from hemoglobin deposition. The key nursing principle is: when in doubt, STOP the transfusion. Every minute of continued incompatible blood transfusion increases the risk of death. Aggressive IV fluid resuscitation should be initiated to maintain urine output above 1 mL/kg/hr, which helps prevent renal tubular obstruction from hemoglobin.",
    learningObjective: "Execute the correct sequence of nursing actions for suspected acute hemolytic transfusion reaction, including immediate cessation, specimen handling, and notification procedures",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "Blood Product Administration",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER slow the rate and continue - any suspected transfusion reaction requires IMMEDIATE cessation. The blood tubing must be disconnected (not flushed) and sent back to the blood bank",
    clinicalPearls: [
      "Acute hemolytic transfusion reactions are most commonly caused by ABO incompatibility from clerical errors",
      "Signs: fever, rigors, flank pain, dark urine (hemoglobinuria), hypotension, DIC",
      "Draw post-transfusion samples from the OPPOSITE arm to avoid contamination with the transfused blood",
      "Maintain urine output >1 mL/kg/hr with aggressive IV fluids to prevent renal tubular obstruction"
    ],
    safetyNote: "Two-nurse verification of patient identity and blood product labeling before transfusion is the most important step in preventing ABO-incompatible transfusions.",
    distractorRationales: [
      "Slowing the transfusion and giving premedications is appropriate for febrile non-hemolytic reactions, NOT hemolytic reactions",
      "Stopping the transfusion is correct, but giving epinephrine and starting new blood without investigation could administer more incompatible blood",
      "Continuing the transfusion at any rate during a suspected hemolytic reaction is dangerous and could be fatal"
    ],
    lessonLink: "/emergency/lessons/blood-product-administration"
  },
  {
    stem: "A nurse is preparing to assist with intraosseous (IO) access placement in a 4-year-old child who is in decompensated shock with failed peripheral IV attempts. The physician selects the proximal tibia as the insertion site. Which statement about IO access is CORRECT?",
    options: [
      "IO access can only be used for fluid administration, not for medications or blood products",
      "The IO needle should be inserted at a 90-degree angle to the bone surface with a slight caudal (toward the foot) angle to avoid the growth plate",
      "IO access is only appropriate in pediatric patients under 6 years of age",
      "IO access should be maintained for up to 72 hours to allow adequate resuscitation"
    ],
    correctAnswer: 1,
    rationaleLong: "The correct statement is that the IO needle should be inserted at a 90-degree angle to the bone surface with a slight caudal (toward the foot) angle to avoid the growth plate. The proximal tibia is the preferred IO insertion site in pediatric patients, with the insertion point located on the flat medial surface of the tibia, approximately 1-2 cm below the tibial tuberosity. The needle is directed at 90 degrees to the bone with a slight caudal angle (angled slightly toward the foot, away from the proximal growth plate) to avoid damaging the epiphyseal plate, which is critical for bone growth in children. Confirmation of correct placement includes: loss of resistance as the needle enters the marrow cavity, the needle stands upright without support, ability to aspirate bone marrow (though this is not always possible), and ability to infuse fluid without extravasation or subcutaneous swelling. Regarding the incorrect statements: IO access can be used for ALL medications, fluids, and blood products that can be given IV - essentially anything that can go through a peripheral IV can go through an IO. This includes crystalloids, colloids, packed RBCs, vasopressors, antibiotics, sedation medications, and cardiac resuscitation drugs. IO medication onset of action and drug levels are comparable to peripheral IV administration. IO access is appropriate in patients of ALL ages, from neonates to adults. Current ACLS, PALS, and ATLS guidelines recommend IO access when IV access cannot be rapidly obtained in critical patients regardless of age. In adults, the proximal tibia and proximal humerus are the most common sites. Regarding duration, IO access should be replaced with definitive IV access as soon as possible and should NOT remain in place for more than 24 hours due to the risk of osteomyelitis, which increases significantly after 24 hours. The recommended maximum duration is 24 hours, with most guidelines suggesting removal as soon as alternative IV access is established.",
    learningObjective: "Demonstrate correct knowledge of IO access placement technique, indications, capabilities, and nursing considerations in emergency vascular access",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "Central Line and IO Access",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "IO access can deliver ANY medication, fluid, or blood product that can be given IV - it is NOT limited to fluids only. Also, IO is for ALL ages, not just pediatrics",
    clinicalPearls: [
      "IO access provides medication onset and drug levels comparable to peripheral IV",
      "Proximal tibia insertion: 1-2 cm below tibial tuberosity on the flat medial surface, 90 degrees with slight caudal angle",
      "IO can be used in all ages - proximal tibia (pediatrics) and proximal humerus (adults) are preferred sites",
      "IO should be removed within 24 hours and replaced with definitive IV access to reduce osteomyelitis risk"
    ],
    safetyNote: "Contraindications to IO at a specific site include: fracture in the target bone, previous IO attempt in the same bone within 24 hours, infection at the insertion site, and prosthetic limb.",
    distractorRationales: [
      "IO can deliver all medications, fluids, and blood products - not limited to fluids only",
      "IO access is appropriate for patients of all ages per ACLS, PALS, and ATLS guidelines",
      "IO should be removed within 24 hours, not maintained for 72 hours, due to osteomyelitis risk"
    ],
    lessonLink: "/emergency/lessons/io-access"
  },
  {
    stem: "A nurse is caring for a patient with a chest tube connected to a water-seal drainage system after a traumatic pneumothorax. The nurse observes continuous bubbling in the water-seal chamber. Which action should the nurse take FIRST?",
    options: [
      "Clamp the chest tube at the insertion site and call the physician immediately",
      "Systematically assess the system from the patient to the drainage unit by checking all connections and tubing for air leaks",
      "Increase the suction to compensate for the air leak",
      "Prepare for emergency chest tube removal and replacement"
    ],
    correctAnswer: 1,
    rationaleLong: "The nurse should first systematically assess the chest tube drainage system from the patient to the drainage unit to identify the source of the air leak. Continuous bubbling in the water-seal chamber indicates an air leak somewhere in the system. The air leak can originate from two main sources: the patient (ongoing pneumothorax with air escaping from the lung) or the drainage system (disconnection, crack in the tubing, or loose connection allowing atmospheric air to enter). The nurse should assess the system methodically from the patient distally: First, check the insertion site dressing - is it intact and occlusive? Is there subcutaneous emphysema around the insertion site? Second, check all connection points along the tubing - each connection should be secure without visible gaps. Third, examine the tubing for cracks, kinks, or damage. Fourth, verify the drainage unit connections are secure. The nurse can systematically identify the leak location by momentarily clamping the chest tube at sequential points from the patient toward the drainage unit: if the bubbling stops when clamped near the patient, the leak is at or proximal to the clamp (from the patient's chest). If the bubbling continues despite clamping near the patient, the air leak is in the drainage system itself. If the air leak is from a loose connection, it can be corrected by securing the connection. If it appears to be from the patient (persistent air leak from the lung), this is expected in the acute phase and should be documented and reported to the physician. However, clamping a chest tube for extended periods is DANGEROUS because it can convert a simple pneumothorax into a tension pneumothorax by preventing air from escaping. The clamp test should be brief (seconds, not minutes). Increasing suction does not fix the air leak and may worsen it. Emergency removal and replacement is not indicated without first identifying the source of the leak.",
    learningObjective: "Systematically troubleshoot chest tube air leaks by assessing the drainage system from patient to collection device and differentiating patient-side from system-side air leaks",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "Chest Tube Management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER clamp a chest tube for extended periods - this can cause tension pneumothorax. Brief clamping for leak assessment is acceptable, but the tube should never be left clamped",
    clinicalPearls: [
      "Continuous bubbling = air leak; intermittent bubbling with respiration is normal and expected",
      "Assess from patient to drainage unit: insertion site -> connections -> tubing -> collection chamber",
      "Brief clamping for assessment is acceptable, but NEVER leave a chest tube clamped",
      "Tidaling (fluctuation of water level with respiration) indicates the tube is patent and in the pleural space"
    ],
    safetyNote: "If a chest tube becomes disconnected, the immediate action is to place the open end in a container of sterile water to create a temporary water seal. Have petroleum gauze available at the bedside at all times.",
    distractorRationales: [
      "Clamping at the insertion site without assessment is premature and could cause tension pneumothorax if left clamped",
      "Increasing suction does not correct an air leak and may worsen it by drawing more air through the leak",
      "Emergency replacement is premature - the leak may be from a simple loose connection that can be easily corrected"
    ],
    lessonLink: "/emergency/lessons/chest-tube-management"
  },
  {
    stem: "A nurse is triaging a sexual assault victim who has arrived at the ED. The patient is tearful but medically stable. She reports the assault occurred approximately 3 hours ago. Which nursing action demonstrates the BEST understanding of evidence preservation and patient-centered care?",
    options: [
      "Have the patient change into a hospital gown immediately, bagging her clothing in a paper bag, and initiate the SANE exam before medical evaluation",
      "Prioritize the medical evaluation, allow the patient to shower if she requests it, and call law enforcement before speaking with the patient",
      "Ensure the patient's physical safety, explain the forensic examination process and obtain informed consent, coordinate with a trained SANE nurse, and preserve clothing and evidence using proper chain of custody procedures",
      "Defer the SANE exam to the next available appointment and focus on STI prophylaxis and emergency contraception"
    ],
    correctAnswer: 2,
    rationaleLong: "The correct approach demonstrates integration of evidence preservation with patient-centered, trauma-informed care. The nursing actions should include: First, ensure the patient's immediate physical safety and provide a private, secure environment. Assess for any life-threatening injuries that require immediate intervention. Second, explain the forensic examination process (SANE exam) thoroughly and obtain INFORMED CONSENT. The patient has the right to accept or decline any or all parts of the forensic examination. This is critical for patient autonomy and trauma-informed care. Third, coordinate with a trained Sexual Assault Nurse Examiner (SANE) if available. SANE nurses have specialized training in forensic evidence collection, trauma-informed interviewing, and proper documentation. If a SANE nurse is not available, the ED nurse should follow institutional protocols for evidence collection. Fourth, preserve evidence using proper procedures: ask the patient NOT to eat, drink, urinate, defecate, shower, brush teeth, or change clothing before the exam (explain WHY these actions could compromise evidence). If the patient has already changed clothing or the clothing needs to be removed for medical care, each item should be placed in a SEPARATE PAPER bag (not plastic, which promotes bacterial growth and evidence degradation). All evidence must follow chain of custody documentation. Fifth, provide emotional support, a patient advocate (if available), and ensure the patient knows they are in control of the process. The nurse should document only objective findings using body maps and avoid subjective interpretations. Regarding timing, forensic evidence collection is most effective within 72-120 hours of the assault, and this patient's 3-hour window is excellent for evidence recovery. The nurse should not call law enforcement without the patient's explicit consent (mandatory reporting laws vary by jurisdiction and age). Emergency contraception, STI prophylaxis, and tetanus immunization should be offered but should not replace the forensic examination.",
    learningObjective: "Integrate forensic evidence preservation protocols with trauma-informed, patient-centered care for sexual assault patients in the emergency department",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "SANE Exam Awareness",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The patient MUST give informed consent for the SANE exam - it is never mandatory. Also, clothing should be placed in PAPER bags (not plastic) to prevent evidence degradation",
    clinicalPearls: [
      "SANE exam evidence collection is most effective within 72-120 hours of the assault",
      "Use PAPER bags for clothing (not plastic) to prevent moisture retention and evidence degradation",
      "The patient can consent to or decline any individual component of the forensic examination",
      "Document objective findings using body maps - avoid subjective language or interpretations"
    ],
    safetyNote: "Mandatory reporting requirements for sexual assault vary by jurisdiction. Adult sexual assault may not require mandatory law enforcement reporting in all states - know your state's laws. Pediatric sexual assault is always mandatory.",
    distractorRationales: [
      "Having the patient change immediately without explanation is not trauma-informed, and initiating SANE before medical eval could miss injuries",
      "Allowing the patient to shower destroys evidence, and calling law enforcement without consent violates patient autonomy (for adult patients in most jurisdictions)",
      "Deferring the SANE exam loses the optimal evidence collection window and STI prophylaxis alone is insufficient"
    ],
    lessonLink: "/emergency/lessons/sane-exam"
  },
  {
    stem: "A nurse is preparing to transfer a critically ill patient from the ED to the ICU. The patient is intubated, on vasopressors, and has multiple IV infusions running. Which handoff communication method is considered the gold standard for ensuring patient safety during transitions of care?",
    options: [
      "A brief verbal summary at the bedside including the patient's name and chief complaint",
      "Written documentation in the electronic health record with a notification to the receiving nurse",
      "SBAR (Situation, Background, Assessment, Recommendation) structured handoff with bedside verification of all lines, drips, and equipment",
      "A phone call to the ICU charge nurse with the patient's vital signs and diagnosis"
    ],
    correctAnswer: 2,
    rationaleLong: "The gold standard for handoff communication during transitions of care is the SBAR (Situation, Background, Assessment, Recommendation) structured handoff framework combined with bedside verification of all lines, drips, and equipment. SBAR provides a standardized, systematic approach to communicating critical patient information that reduces errors of omission and ensures all relevant information is transmitted. For a critically ill patient transfer from ED to ICU, the SBAR handoff should include: SITUATION: Patient identification, current diagnosis, current vital signs, active problems, code status, and reason for ICU admission. For example: 'This is Mr. Smith, 62-year-old male with septic shock from community-acquired pneumonia, currently intubated on mechanical ventilation, on norepinephrine at 0.15 mcg/kg/min.' BACKGROUND: Relevant medical history, surgical history, allergies, home medications, course of ED stay, interventions performed, and response to treatment. Include specific details about the sepsis bundle completion, fluid totals, and antibiotic timing. ASSESSMENT: Current clinical status assessment including neurological status (sedation level, RASS score), hemodynamic status (MAP target, vasopressor trends), ventilator settings and response, and organ function (urine output, lactate trends). The nurse's assessment of the patient's trajectory (improving, stable, or deteriorating) is critical information. RECOMMENDATION: Outstanding orders, pending results (cultures, imaging reads), anticipated needs (repeat labs in X hours, potential for additional vasopressor), family communication needs, and any safety concerns. The bedside component is essential for critically ill patients: physically verifying all IV lines (what is running in each line, rate, concentration), checking ventilator settings match orders, verifying monitor parameters and alarm settings, confirming tube and line positions (ETT depth, central line site), and reviewing the medication administration record for any due medications.",
    learningObjective: "Implement SBAR structured handoff communication with bedside verification for safe transfer of critically ill patients between care areas",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "Handoff Communication (SBAR)",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "SBAR alone is not sufficient for critical patient transfers - bedside verification of all lines, drips, equipment, and monitor settings is an essential component",
    clinicalPearls: [
      "SBAR: Situation (what is happening now), Background (relevant history), Assessment (clinical impression), Recommendation (what needs to happen next)",
      "Bedside handoff allows physical verification of lines, drips, and equipment settings",
      "Use read-back for critical values and medication infusion rates during handoff",
      "The Joint Commission identifies communication failures as the leading cause of sentinel events"
    ],
    safetyNote: "During critical patient transfers, ensure vasopressor infusions are NEVER interrupted. Use a dedicated IV line for vasopressors and verify continued infusion before, during, and after transfer.",
    distractorRationales: [
      "A brief verbal summary is insufficient for a critically ill patient with multiple infusions and devices",
      "Written documentation alone without verbal handoff and bedside verification misses the interactive component essential for complex patients",
      "A phone call without structured format and bedside verification does not meet the standard for safe handoff of critically ill patients"
    ],
    lessonLink: "/emergency/lessons/sbar-handoff"
  },
  {
    stem: "A patient in the ED becomes increasingly agitated, threatening staff, and attempting to leave the treatment area while pulling at his IV and cardiac monitor leads. He has been evaluated by the physician and does not have capacity to make medical decisions due to acute alcohol intoxication with a blood alcohol level of 380 mg/dL. The physician orders physical restraints. Which nursing action is MOST appropriate regarding restraint application?",
    options: [
      "Apply four-point leather restraints immediately and document the behavior",
      "Use the least restrictive restraint that maintains safety, ensure proper application that maintains circulation, document the behavior that necessitated restraints, and initiate monitoring protocol with neurovascular checks every 15 minutes",
      "Ask the security team to hold the patient down until he calms down without applying formal restraints",
      "Apply wrist restraints and check on the patient every 2 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "The most appropriate nursing action is to use the least restrictive restraint that maintains safety, ensure proper application that maintains circulation, document the behavior necessitating restraints, and initiate a monitoring protocol with neurovascular checks every 15 minutes. This approach follows evidence-based restraint use guidelines and regulatory requirements. The principle of least restrictive intervention means starting with the minimum level of restraint that will maintain patient and staff safety. This might mean starting with one-on-one observation, verbal de-escalation, or environmental modifications before escalating to physical restraints. If physical restraints are necessary, the least restrictive type should be used (soft limb restraints before leather restraints, bilateral before four-point). Proper application of restraints requires: ensuring adequate circulation by maintaining two-finger space between the restraint and the skin, positioning restraints so that the patient cannot tighten them by pulling, securing restraints to the bed frame (not the side rails) to allow for bed position changes, maintaining functional body alignment, and ensuring the patient can reach the call bell and has access to food, fluids, and toileting. Documentation requirements include: the specific behavior that necessitated restraints (objective, observable behavior), less restrictive interventions attempted first and their outcomes, the type of restraint applied, the time of application, the physician order (which must be obtained within 1 hour of application for behavioral health restraints and renewed every 4 hours for adults), and ongoing monitoring documentation. Monitoring protocol for restrained patients includes: neurovascular checks every 15 minutes (circulation, sensation, movement of restrained extremities), vital signs, assessment of continued need for restraints, offering nutrition, hydration, and toileting, range of motion exercises, and assessment of skin integrity under restraints. Restraints should be removed as soon as the behavior resolves. The goal is always to transition back to the least restrictive level of intervention.",
    learningObjective: "Implement evidence-based restraint use protocols including least restrictive principle, proper application technique, documentation requirements, and monitoring frequency",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "Restraint Use and Safety",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Restraint monitoring is every 15 MINUTES for neurovascular checks, not every 2 hours. Restraints are tied to the bed FRAME, not the side rails",
    clinicalPearls: [
      "Least restrictive intervention principle: verbal de-escalation -> 1:1 observation -> chemical sedation -> physical restraints",
      "Neurovascular checks every 15 minutes: circulation, sensation, movement of restrained extremities",
      "Restraint orders must be renewed every 4 hours for adults, every 2 hours for pediatric patients",
      "Secure restraints to the bed frame, NOT the side rails - side rail attachment can cause injury"
    ],
    safetyNote: "A restrained patient on a backboard or in a supine position is at risk for aspiration - position the patient on their side if possible, or elevate the head of the bed.",
    distractorRationales: [
      "Immediately applying four-point leather restraints without attempting less restrictive measures violates the least restrictive principle",
      "Having security hold the patient without formal restraints bypasses documentation, monitoring, and safety protocols",
      "Checking every 2 hours is dangerously infrequent - neurovascular checks are required every 15 minutes"
    ],
    lessonLink: "/emergency/lessons/restraint-safety"
  },
  {
    stem: "A nurse in the ED is caring for a patient who was involved in a motor vehicle crash and is suspected of driving under the influence. Law enforcement requests that the nurse draw the patient's blood for a blood alcohol level without the patient's consent. The patient is alert, oriented, and refusing the blood draw. What is the CORRECT nursing response?",
    options: [
      "Draw the blood as requested by law enforcement since it is a criminal investigation",
      "Refuse to draw the blood without the patient's consent or a valid warrant, and document the encounter",
      "Draw the blood but label it as a legal specimen separate from the medical chart",
      "Defer the decision to the physician and have them draw the blood instead"
    ],
    correctAnswer: 1,
    rationaleLong: "The correct nursing response is to refuse to draw the blood without the patient's consent or a valid court-issued warrant, and to document the encounter thoroughly. This is based on the landmark U.S. Supreme Court decision in Birchfield v. North Dakota (2016) and Missouri v. McNeely (2013), which established that warrantless blood draws in DUI cases violate the Fourth Amendment protection against unreasonable search and seizure. The patient has the legal right to refuse a blood draw, and the nurse has an ethical and legal obligation to respect that right. A blood draw is a medical procedure that requires informed consent. Without either patient consent or a valid court-issued search warrant, drawing blood constitutes: battery (unauthorized touching), violation of patient autonomy, potential violation of the patient's constitutional rights, and potential violation of nursing practice standards. The nurse should: clearly communicate to law enforcement that a blood draw cannot be performed without patient consent or a warrant, document the encounter including the law enforcement request, the patient's refusal, and the nurse's response, notify the charge nurse and/or nursing supervisor, and continue to provide appropriate medical care to the patient. The nurse should NOT draw the blood for any reason without consent or warrant, should NOT delegate the blood draw to another provider to circumvent the refusal, and should NOT document the blood draw as a medical specimen if it was drawn for legal purposes. If law enforcement returns with a valid warrant signed by a judge, the nurse should verify the warrant's validity and comply with the court order while documenting that the blood draw was performed pursuant to a warrant. Some states have implied consent laws for licensed drivers, but even these typically require a warrant for forced blood draws following recent Supreme Court rulings.",
    learningObjective: "Apply legal and ethical principles regarding patient consent for blood draws in forensic situations, including the requirement for consent or a valid warrant",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "Forensic Evidence Preservation",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Law enforcement request alone is NOT sufficient legal authority for a blood draw without consent - a court-issued WARRANT is required",
    clinicalPearls: [
      "Missouri v. McNeely (2013): warrantless blood draws in DUI cases violate the Fourth Amendment",
      "Blood draws require either patient consent or a valid court-issued warrant",
      "The nurse's duty to the patient (autonomy, consent) supersedes law enforcement requests",
      "Document all encounters with law enforcement including requests, patient responses, and actions taken"
    ],
    safetyNote: "If compelled by a valid warrant, document that the blood draw was performed under warrant. If threatened by law enforcement, contact the nursing supervisor and hospital administration immediately.",
    distractorRationales: [
      "Drawing blood without consent or warrant is battery and violates constitutional protections",
      "Labeling it separately does not change the legal requirement for consent or warrant",
      "Having the physician draw the blood instead does not circumvent the consent requirement - the legal issue applies regardless of who draws the blood"
    ],
    lessonLink: "/emergency/lessons/forensic-evidence"
  },
  {
    stem: "A nurse is managing pain for a 45-year-old patient with an isolated long bone fracture in the ED. The patient reports pain at 8/10 despite receiving IV morphine 4 mg. The physician orders a femoral nerve block with ultrasound guidance. What is the nurse's PRIMARY role during the nerve block procedure?",
    options: [
      "Performing the ultrasound-guided nerve block independently as an advanced nursing skill",
      "Monitoring the patient for signs of local anesthetic systemic toxicity (LAST) including perioral numbness, tinnitus, metallic taste, and cardiovascular instability, with 20% lipid emulsion available",
      "Administering the local anesthetic while the physician holds the ultrasound probe",
      "Documenting the procedure only, as the nurse has no active role during nerve blocks"
    ],
    correctAnswer: 1,
    rationaleLong: "The nurse's primary role during a nerve block procedure is monitoring the patient for signs of local anesthetic systemic toxicity (LAST) and ensuring that rescue medications, particularly 20% intralipid emulsion, are immediately available. LAST occurs when local anesthetics (lidocaine, bupivacaine, ropivacaine) reach toxic levels in the bloodstream, either from inadvertent intravascular injection, excessive dosing, or rapid absorption from the injection site. LAST has a characteristic progression of symptoms: Early CNS toxicity (occurs first at lower blood levels): perioral numbness and tingling, metallic taste, tinnitus (ringing in ears), lightheadedness, visual disturbances, agitation or confusion, and muscle twitching. Severe CNS toxicity: seizures and loss of consciousness. Cardiovascular toxicity (occurs at higher blood levels): bradycardia, hypotension, conduction abnormalities (widened QRS, prolonged PR), ventricular tachycardia, ventricular fibrillation, and asystole. Bupivacaine is particularly cardiotoxic and resistant to standard ACLS medications. The nurse should maintain continuous verbal contact with the patient during the procedure, asking about symptoms like numbness of the lips or tongue, metallic taste, ringing in the ears, or visual changes. Any report of these symptoms should prompt immediate cessation of the injection and notification of the physician. Treatment of LAST includes: stop the local anesthetic injection immediately, manage the airway (BVM, intubation if needed), treat seizures with benzodiazepines (NOT propofol, which has its own cardiac depressant effects), administer 20% intralipid emulsion (1.5 mL/kg IV bolus over 1 minute, followed by 0.25 mL/kg/min infusion), and initiate ACLS protocols for cardiovascular collapse. The nurse should ensure 20% intralipid emulsion is available at the bedside before the procedure begins, as it acts as a 'lipid sink' to sequester the lipophilic local anesthetic away from cardiac tissue.",
    learningObjective: "Identify the nurse's monitoring role during nerve block procedures including recognition of LAST symptoms and availability of intralipid emulsion for rescue",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "Pain Management Protocols",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "LAST presents with CNS symptoms BEFORE cardiovascular symptoms - perioral numbness, tinnitus, and metallic taste are early warning signs that should prompt immediate cessation of injection",
    clinicalPearls: [
      "LAST progression: perioral numbness -> tinnitus/metallic taste -> visual changes -> seizures -> cardiac arrhythmias -> cardiac arrest",
      "20% intralipid emulsion is the specific antidote for LAST - it should be available at the bedside for all nerve blocks",
      "Bupivacaine is the most cardiotoxic local anesthetic - cardiac arrest from bupivacaine is resistant to standard ACLS",
      "Maximum doses: lidocaine 4.5 mg/kg (7 mg/kg with epinephrine), bupivacaine 2.5 mg/kg"
    ],
    safetyNote: "20% intralipid emulsion must be immediately available for any procedure involving local anesthetics. The nurse should know the location and dosing protocol before the procedure begins.",
    distractorRationales: [
      "Performing nerve blocks is within the physician's or advanced practice provider's scope, not standard nursing scope",
      "Administering the local anesthetic during a nerve block is a physician function, not a nursing role",
      "The nurse has a critical active role in monitoring for LAST and ensuring rescue equipment is available - documentation alone is insufficient"
    ],
    lessonLink: "/emergency/lessons/pain-management"
  },
  {
    stem: "A nurse is providing end-of-life care in the ED for a patient who has been determined to have injuries incompatible with life after a traumatic arrest. The patient's family has arrived and is in the family waiting area. The attending physician will be speaking with the family. What is the nurse's MOST important role in this situation?",
    options: [
      "Preparing the death certificate and completing all documentation before the family sees the patient",
      "Ensuring the patient is cleaned and presentable before allowing the family to view the body",
      "Being present during the notification, providing emotional support to the family, facilitating viewing of the patient, and connecting the family with support resources including chaplain services and social work",
      "Directing the family to contact a funeral home and providing information about the medical examiner's office"
    ],
    correctAnswer: 2,
    rationaleLong: "The nurse's most important role in this situation is providing comprehensive family support, including being present during the death notification, providing emotional support, facilitating viewing of the patient, and connecting the family with support resources. Death notification and end-of-life family care are among the most significant nursing responsibilities in the emergency department. The nurse's role encompasses several critical components: Before the notification: prepare the family room (private, comfortable space with tissues, water, seating), coordinate with the physician regarding the notification plan, ensure chaplain and/or social worker have been called, and prepare the patient's area for potential family viewing (remove unnecessary equipment while leaving intact anything required for organ donation evaluation or medical examiner investigation). During the notification: the nurse should be present during the physician's death notification as a supportive presence and witness. The nurse's presence provides continuity of care and demonstrates that the care team cared about the patient. The nurse should be prepared for a range of emotional responses including disbelief, anger, wailing, collapse, and should know how to respond therapeutically to each. After the notification: facilitate family viewing of the patient when they are ready. This is an important part of the grieving process and should not be delayed or denied unless there are specific medicolegal reasons. The nurse should prepare the family for what they will see (tubes, dressings, injuries), offer to accompany them, allow unrestricted time with the patient, and respect cultural and religious practices around death. Connect with resources: social work for immediate needs and follow-up services, chaplain or spiritual care for religious/spiritual needs, organ/tissue donation coordinator, grief counseling referrals, and practical information (belongings, medical examiner process, death certificate timeline). The nurse should document the time of death, who was notified, and family interactions while maintaining sensitivity.",
    learningObjective: "Implement comprehensive family support during end-of-life care in the ED including death notification presence, facilitated patient viewing, and resource connection",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "End-of-Life and Family Notification",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not delay family viewing to 'clean up' the patient - this takes away valuable time the family could spend with their loved one. Explain what they will see and let them choose when to view",
    clinicalPearls: [
      "Be present during the death notification as a supportive presence and to provide continuity for the family",
      "Allow unrestricted time for family viewing and respect cultural/religious death practices",
      "Contact organ/tissue donation services before discussing with the family - it should come from trained requestors",
      "Document the time of death, notification details, family interactions, and disposition of personal belongings"
    ],
    safetyNote: "If the case involves a medical examiner investigation, do not remove any tubes, lines, or equipment from the patient. Consult with the ME office regarding what can and cannot be altered.",
    distractorRationales: [
      "Death certificate completion is important but secondary to providing family support and facilitating the grieving process",
      "Delaying family viewing to clean the patient takes away valuable time and is not the priority",
      "Directing the family to a funeral home is premature and impersonal - connecting with social work and chaplain services comes first"
    ],
    lessonLink: "/emergency/lessons/end-of-life-care"
  },
  {
    stem: "A nurse in the ED is managing a patient with a complex wound. The patient sustained a 6-cm laceration to the forearm from a circular saw approximately 2 hours ago. The wound has jagged edges, visible tendon, and moderate contamination with wood debris. Distal sensation and motor function are intact. Radial and ulnar pulses are 2+. What wound management considerations are MOST important?",
    options: [
      "Close the wound with skin staples for rapid hemostasis and apply a pressure dressing",
      "Irrigate copiously with normal saline under pressure to remove debris, assess for tendon involvement, and prepare for layered closure by a physician, with consideration for delayed primary closure given the contamination",
      "Apply wound closure strips (Steri-Strips) to approximate the edges and refer to a plastic surgeon",
      "Pack the wound with iodoform gauze and schedule follow-up wound check in 48 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "The most important wound management considerations are copious irrigation, debris removal, assessment of deep structure involvement, and preparation for appropriate closure technique with consideration for delayed primary closure given the contamination level. This complex wound requires a systematic approach: Assessment: The wound has several features that influence management: jagged edges (irregular laceration requiring careful approximation), visible tendon (deep structure involvement requiring evaluation of tendon integrity), moderate contamination with wood debris (organic material increases infection risk), intact distal neurovascular status (reassuring that no major vessels or nerves are severed), and 2-hour injury-to-presentation time (within the window for primary closure if adequately cleaned). Irrigation: High-pressure irrigation with normal saline is the single most important intervention for reducing wound infection risk. The recommended approach is 250-500 mL of normal saline per centimeter of wound length delivered under pressure (using a 30-60 mL syringe with an 18-gauge needle or splash guard creates approximately 8 PSI of irrigation pressure). For a contaminated wound like this, at least 1-2 liters of irrigation fluid should be used. Each piece of visible debris must be removed - organic material (wood) is particularly prone to causing infection. Deep structure assessment: The visible tendon must be evaluated for partial or complete laceration by testing the specific tendon function against resistance. If tendon injury is identified, surgical consultation is needed. Closure considerations: Given the contamination with organic material, delayed primary closure (DPC) should be considered rather than immediate primary closure. In DPC, the wound is irrigated and debrided, left open with wet-to-dry dressings for 3-5 days to ensure no infection develops, and then closed at a follow-up visit. This significantly reduces the risk of wound infection in contaminated wounds. Tetanus prophylaxis should be updated if not current. Prophylactic antibiotics may be indicated for contaminated wounds with deep structure involvement.",
    learningObjective: "Apply wound management principles including irrigation, deep structure assessment, and appropriate closure technique selection based on wound characteristics and contamination level",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "Wound Management and Closure",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Not all wounds should be closed primarily (immediately) - heavily contaminated wounds, especially with organic material, may benefit from delayed primary closure to reduce infection risk",
    clinicalPearls: [
      "High-pressure irrigation (8 PSI via syringe and needle) is the most important intervention for reducing wound infection",
      "Use 250-500 mL of NS per cm of wound length for adequate irrigation",
      "Organic contamination (wood, soil) significantly increases infection risk and may warrant delayed primary closure",
      "Always assess tendon function against resistance when tendons are visible in the wound"
    ],
    safetyNote: "Update tetanus prophylaxis for any wound if the patient's immunization status is not current. Dirty/contaminated wounds require tetanus immunoglobulin (TIG) in addition to the vaccine if immunization history is incomplete.",
    distractorRationales: [
      "Skin staples are inappropriate for a jagged wound with tendon involvement and contamination - they cannot achieve layered closure",
      "Wound closure strips cannot approximate jagged wound edges or address the deep contamination and tendon involvement",
      "Packing with iodoform alone does not address the contamination or the need for definitive wound management"
    ],
    lessonLink: "/emergency/lessons/wound-management"
  },
  {
    stem: "A nurse receives a physician's order for ketamine 1.5 mg/kg IV for procedural sedation in a 25-year-old patient requiring shoulder reduction. The patient weighs 80 kg. The nurse notes that the available ketamine vial concentration is 100 mg/mL. What is the correct dose, and what is the MOST important adverse effect the nurse should prepare to manage?",
    options: [
      "Dose: 120 mg (1.2 mL); most important to prepare for: respiratory depression requiring bag-valve-mask ventilation",
      "Dose: 120 mg (1.2 mL); most important to prepare for: emergence reactions including vivid dreams, hallucinations, and agitation, managed with a calm environment and low-dose benzodiazepines",
      "Dose: 800 mg (8 mL); most important to prepare for: hypotension requiring vasopressors",
      "Dose: 12 mg (0.12 mL); most important to prepare for: allergic reaction requiring epinephrine"
    ],
    correctAnswer: 1,
    rationaleLong: "The correct dose is 120 mg (1.5 mg/kg x 80 kg = 120 mg, which is 1.2 mL of a 100 mg/mL concentration), and the most important adverse effect to prepare for is emergence reactions. Ketamine is a dissociative anesthetic that produces a unique state of 'dissociative anesthesia' where the patient appears awake (eyes open, nystagmus) but is dissociated from the environment and does not feel pain. It is increasingly used for ED procedural sedation because of its excellent safety profile for airway maintenance - unlike other sedation agents, ketamine generally preserves airway reflexes, maintains respiratory drive, and causes bronchodilation. However, the most clinically significant adverse effect that requires nursing preparation is emergence reactions, which occur in approximately 10-30% of adult patients. Emergence reactions are characterized by vivid dreams (often unpleasant), hallucinations, delirium, agitation, and disorientation as the patient transitions from the dissociative state back to normal consciousness. Risk factors for emergence reactions include: age >15 years (adults more than children), female sex, history of psychiatric illness, and rapid IV administration. Management of emergence reactions includes: maintaining a calm, quiet, dimly lit environment during the recovery period, minimizing tactile and auditory stimulation, speaking softly and providing reassurance, and if significant agitation occurs, administering a low-dose benzodiazepine (midazolam 0.5-1 mg IV). Some practitioners give prophylactic midazolam before ketamine to reduce emergence reaction rates, though this practice varies. While respiratory depression is less common with ketamine than with other sedation agents (propofol, etomidate), it can occur, especially with rapid IV push or high doses. The nurse should have BVM, suction, and airway adjuncts available. Other side effects include increased oral secretions (managed with glycopyrrolate or atropine), nausea/vomiting, and transient increases in heart rate and blood pressure.",
    learningObjective: "Calculate correct ketamine dosing for procedural sedation and prepare for the most common significant adverse effect - emergence reactions - with appropriate management strategies",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "Procedural Sedation Monitoring",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Ketamine generally PRESERVES airway reflexes and respiratory drive - emergence reactions are the more common clinical challenge that nurses should prepare to manage",
    clinicalPearls: [
      "Ketamine IV procedural sedation dose: 1-2 mg/kg IV over 1-2 minutes",
      "Emergence reactions occur in 10-30% of adults and are managed with benzodiazepines and a calm environment",
      "Ketamine is one of the few sedation agents that preserves airway reflexes and respiratory drive",
      "Ketamine increases oral secretions - have suction available and consider glycopyrrolate pretreatment"
    ],
    safetyNote: "Despite ketamine's favorable airway profile, full procedural sedation monitoring (continuous ETCO2, SpO2, ECG, BP) is still required. Rare cases of laryngospasm have been reported.",
    distractorRationales: [
      "While respiratory depression is possible and monitoring equipment should be available, it is less common than emergence reactions with ketamine",
      "800 mg is a massive overdose (10 mg/kg) that could cause respiratory arrest",
      "12 mg is a significant underdose (0.15 mg/kg) that would not achieve dissociative anesthesia"
    ],
    lessonLink: "/emergency/lessons/procedural-sedation"
  },
  {
    stem: "A 68-year-old patient with dementia becomes increasingly agitated in the ED, pulling at his IV line and cardiac monitor leads, and attempting to climb over the bed rails. He scored 4/4 on the Confusion Assessment Method (CAM) indicating delirium. Non-pharmacological interventions (reorientation, familiar objects, reducing stimulation) have been unsuccessful. The physician orders haloperidol 2.5 mg IM. Before administering, what assessment is MOST critical for the nurse to perform?",
    options: [
      "Check the patient's liver function tests for hepatic clearance of the medication",
      "Obtain a baseline QTc interval from the cardiac monitor/ECG, as haloperidol can prolong QTc and increase risk of torsades de pointes",
      "Assess the patient's renal function to determine if dose adjustment is needed",
      "Check the patient's last oral intake to determine aspiration risk"
    ],
    correctAnswer: 1,
    rationaleLong: "The most critical assessment before administering haloperidol is obtaining a baseline QTc interval from the cardiac monitor or 12-lead ECG. Haloperidol is an antipsychotic medication commonly used for acute agitation and delirium in the ED, but it carries a significant risk of QT prolongation, which can lead to the potentially fatal arrhythmia torsades de pointes (TdP). The QTc interval represents the corrected QT interval on ECG, which reflects ventricular repolarization time. Normal QTc is less than 440 ms for males and less than 460 ms for females. Risk of torsades de pointes increases significantly when QTc exceeds 500 ms. Haloperidol prolongs QTc in a dose-dependent manner, and the risk is highest with: IV administration (which has a greater effect on QTc than IM or oral), higher doses, pre-existing QT prolongation, concurrent use of other QT-prolonging medications (common in elderly patients), electrolyte abnormalities (hypokalemia, hypomagnesemia - which should also be checked), structural heart disease, and female sex. The nurse should: obtain a baseline QTc before the first dose (either from continuous cardiac monitoring or a 12-lead ECG), alert the physician if the QTc is >450 ms (relative caution) or >500 ms (generally avoid haloperidol), ensure the patient is on continuous cardiac monitoring during and after administration, and recheck the QTc after the medication is given. If QTc prolongation is identified, alternative medications for agitation include benzodiazepines (which do not prolong QTc), olanzapine (less QTc prolongation than haloperidol), or dexmedetomidine. The elderly demented patient is particularly vulnerable because they often have multiple risk factors for QT prolongation: polypharmacy, electrolyte abnormalities from poor nutrition, and structural heart changes from aging.",
    learningObjective: "Identify the critical safety assessment (QTc interval) required before administering haloperidol and understand the risk of torsades de pointes in high-risk populations",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "Pain Management Protocols",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "QTc >500 ms is the danger zone for torsades de pointes. Always check baseline QTc before giving haloperidol, especially in elderly patients who may have multiple risk factors for QT prolongation",
    clinicalPearls: [
      "Haloperidol prolongs QTc in a dose-dependent manner - IV route has greater effect than IM or oral",
      "QTc >500 ms significantly increases risk of torsades de pointes - avoid QT-prolonging drugs",
      "Also check potassium and magnesium levels - hypokalemia and hypomagnesemia increase torsades risk",
      "Alternative agents for agitation without QT risk: benzodiazepines, dexmedetomidine"
    ],
    safetyNote: "Continuous cardiac monitoring is required when administering haloperidol, especially IV. If torsades de pointes occurs, treat with IV magnesium sulfate 2g and consider overdrive pacing.",
    distractorRationales: [
      "Liver function tests are relevant for drug metabolism but are not the most critical safety check before haloperidol",
      "Renal function affects drug clearance but is less immediately critical than QTc assessment for haloperidol safety",
      "Last oral intake is relevant for aspiration risk with sedation but is not the most critical assessment for haloperidol specifically"
    ],
    lessonLink: "/emergency/lessons/pain-management"
  },
  {
    stem: "A nurse in the ED is caring for a 16-year-old patient who was brought in by paramedics after a drowning incident at a community pool. The patient was successfully resuscitated by bystanders but the patient has died in the ED despite aggressive resuscitation efforts. The parents arrive 20 minutes after the patient was pronounced dead. The mother collapses upon hearing the news. What should the nurse do FIRST?",
    options: [
      "Help the mother to a chair or the floor to prevent injury from the collapse, ensure her physical safety, and call for assistance",
      "Focus on explaining the medical interventions that were performed during the resuscitation",
      "Immediately take the parents to see their child's body to begin the grieving process",
      "Contact the hospital chaplain and leave the family alone to process the news privately"
    ],
    correctAnswer: 0,
    rationaleLong: "The nurse's first action should be to ensure the mother's immediate physical safety by helping her to a chair or safely to the floor to prevent injury from the collapse, and then calling for assistance. This is based on Maslow's hierarchy of needs and the fundamental nursing principle that physical safety takes priority over emotional or psychological interventions. The mother's collapse could be a simple vasovagal response to overwhelming emotional distress, or it could represent a genuine medical emergency (cardiac event, head injury from fall). The nurse should: ensure the mother is in a safe position to prevent injury, assess her level of consciousness and vital signs, call for assistance from other staff members (so that one nurse can attend to the mother while others support the father and manage the ongoing situation), and once the mother is assessed and stable, continue with the family notification and support process. After addressing the mother's immediate physical safety, the nurse should: provide a private, comfortable space for the family, use clear and direct language to communicate the death (avoid euphemisms like 'passed away' or 'we lost him'), allow the family to express their grief without judgment, offer to accompany the parents to see their child when they are ready, and connect the family with support resources (chaplain, social worker, bereavement services). This is a particularly devastating scenario because it involves a pediatric death, which is universally recognized as one of the most difficult situations in emergency nursing. The family's grief response may be intense and prolonged. The nurse should also be prepared for their own emotional response and should access critical incident stress debriefing or employee assistance programs after the shift. Pediatric drowning deaths may also involve medical examiner notification and potential law enforcement investigation.",
    learningObjective: "Prioritize physical safety during acute grief reactions while providing compassionate family support following a pediatric death in the emergency department",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "End-of-Life and Family Notification",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Physical safety always comes first - a collapsing family member needs immediate assessment before emotional support can be provided",
    clinicalPearls: [
      "Physical safety of family members takes priority during acute grief reactions",
      "Use clear, direct language when communicating death - avoid euphemisms",
      "Pediatric deaths often require medical examiner notification and potential investigation",
      "Staff involved in pediatric deaths should access critical incident stress debriefing"
    ],
    safetyNote: "Assess any family member who collapses for medical causes. Vasovagal syncope is common during grief but cannot be assumed without assessment.",
    distractorRationales: [
      "Explaining medical interventions should come later - the mother's physical safety is the immediate priority",
      "Taking parents to see the body immediately without addressing the mother's collapse could result in injury",
      "Leaving the family alone without first ensuring the mother's safety and providing initial support is inappropriate"
    ],
    lessonLink: "/emergency/lessons/end-of-life-care"
  },
  {
    stem: "A nurse is caring for a patient in the ED who arrived via EMS after being found at the scene of a stabbing. The patient has a single stab wound to the left upper quadrant. Police are present and have indicated this is an active criminal investigation. The patient's clothing has been removed for the trauma evaluation. Which nursing action demonstrates BEST practice for forensic evidence preservation?",
    options: [
      "Place all clothing items together in one large biohazard bag and hand them to the police officer",
      "Cut around any holes or defects in the clothing (such as the stab wound entry point), place each item in a separate paper bag, label each bag with patient information and chain of custody documentation, and secure them until law enforcement can properly receive them",
      "Discard the clothing as biohazardous waste since it is contaminated with blood",
      "Allow the police officer to collect the clothing directly from the trauma bay without nursing involvement"
    ],
    correctAnswer: 1,
    rationaleLong: "The best practice for forensic evidence preservation includes: cutting around holes or defects in clothing rather than through them, placing each item in a separate paper bag, labeling with proper chain of custody documentation, and securing the evidence until law enforcement can receive it through proper channels. Each element of this practice has important forensic significance: Cutting around holes and defects: The location, size, and characteristics of holes in clothing (stab wounds, bullet holes) are critical evidence. Forensic analysis can match the weapon to the wound pattern in the clothing. Cutting through these defects destroys this evidence. When removing clothing during trauma evaluation, the nurse should cut along seams or at locations away from the injury site whenever possible. Separate paper bags for each item: Items should NEVER be placed together because cross-contamination of DNA, blood, fibers, or trace evidence between items can corrupt the evidence. Paper bags (not plastic) are used because they allow moisture to evaporate, preventing bacterial growth that degrades biological evidence. Plastic bags trap moisture and accelerate decomposition of DNA and other biological evidence. Chain of custody documentation: Every person who handles the evidence must be documented, including: who collected the item, when it was collected, where it was stored, and who it was transferred to. Any break in the chain of custody can render evidence inadmissible in court. Secure storage: Evidence should be stored in a locked, secure location (many EDs have a designated evidence locker) until law enforcement formally receives it with proper documentation. Additional forensic nursing considerations: document any foreign objects removed from wounds, preserve projectiles (wrap in gauze, not metal forceps which can alter ballistic markings), do not wash hands before the SANE exam if the assault involved the hands, and photograph injuries with proper documentation before treatment when possible.",
    learningObjective: "Implement forensic evidence preservation protocols for trauma patients involved in criminal investigations, including proper clothing handling, chain of custody, and evidence storage",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "Forensic Evidence Preservation",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Cut AROUND holes in clothing, not through them. Use PAPER bags (not plastic). SEPARATE items into individual bags. Maintain chain of custody documentation",
    clinicalPearls: [
      "Cut around (not through) holes and defects in clothing to preserve wound pattern evidence",
      "Use paper bags (not plastic) to allow moisture evaporation and prevent evidence degradation",
      "Place each clothing item in a separate bag to prevent cross-contamination",
      "Chain of custody must be maintained from collection through transfer to law enforcement"
    ],
    safetyNote: "Patient care and medical stabilization always take priority over evidence preservation. However, awareness of forensic principles during care can preserve evidence without compromising treatment.",
    distractorRationales: [
      "Placing all items together in one bag causes cross-contamination, and biohazard bags are plastic which degrades biological evidence",
      "Discarding clothing destroys potential evidence that could be critical to the criminal investigation",
      "Allowing police to collect directly without nursing documentation breaks the chain of custody and may compromise the evidence"
    ],
    lessonLink: "/emergency/lessons/forensic-evidence"
  },
  {
    stem: "A nurse in the ED is reviewing the cardiac monitor of a patient who received IV amiodarone for new-onset atrial fibrillation with rapid ventricular response. The patient's heart rate has decreased from 152 to 88 bpm, and the rhythm has converted to normal sinus rhythm. However, the nurse notices the QTc interval has increased from 420 ms to 510 ms. What is the MOST appropriate nursing action?",
    options: [
      "Document the rhythm change as therapeutic effect and continue monitoring",
      "Immediately notify the physician of the QTc prolongation to 510 ms, hold any additional QT-prolonging medications, verify electrolyte levels (particularly potassium and magnesium), and continue continuous cardiac monitoring",
      "Administer another dose of amiodarone to maintain sinus rhythm",
      "Reduce the amiodarone infusion rate by 50% and recheck the QTc in 4 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "The most appropriate nursing action is to immediately notify the physician of the QTc prolongation to 510 ms, hold any additional QT-prolonging medications, verify electrolyte levels, and continue continuous cardiac monitoring. A QTc interval of 510 ms is clinically significant and places the patient at increased risk for torsades de pointes (TdP), a potentially fatal polymorphic ventricular tachycardia. While the conversion to normal sinus rhythm is a therapeutic success, the QTc prolongation is a potentially dangerous side effect that requires immediate attention. Amiodarone is a Class III antiarrhythmic that works by blocking potassium channels, which inherently prolongs the QT interval. Some QT prolongation is expected and is part of the drug's mechanism of action. However, a QTc >500 ms is considered dangerous because it significantly increases the risk of TdP. The nursing actions should include: Immediate physician notification: QTc >500 ms is a critical value that requires medical decision-making about whether to continue, reduce, or discontinue the amiodarone infusion. Medication review: Hold any other QT-prolonging medications the patient may be receiving (including antiemetics like ondansetron, antibiotics like fluoroquinolones, and psychiatric medications). Electrolyte verification: Hypokalemia (K+ <3.5) and hypomagnesemia (Mg <1.5) potentiate QT prolongation and increase TdP risk. If levels are low, replacement should be initiated immediately. Target K+ >4.0 and Mg >2.0 in patients with QT prolongation. Continuous cardiac monitoring: Watch for R-on-T phenomenon (a PVC occurring on the T wave), short-long-short sequences, and polymorphic VT which herald TdP. TdP treatment: If TdP occurs, administer IV magnesium sulfate 2g over 2 minutes, consider isoproterenol for rate-dependent QT prolongation, and prepare for overdrive pacing if pharmacological measures fail.",
    learningObjective: "Recognize clinically significant QTc prolongation (>500 ms) as a dangerous adverse effect of antiarrhythmic therapy and implement appropriate monitoring and intervention",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "Procedural Sedation Monitoring",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A therapeutic response (rate control) does not negate a dangerous adverse effect (QTc prolongation). Both must be addressed simultaneously",
    clinicalPearls: [
      "QTc >500 ms significantly increases risk of torsades de pointes regardless of the medication causing it",
      "Maintain K+ >4.0 and Mg >2.0 in patients with QT prolongation to reduce TdP risk",
      "IV magnesium sulfate 2g is the first-line treatment for torsades de pointes",
      "Common QT-prolonging drugs in the ED: amiodarone, haloperidol, ondansetron, fluoroquinolones, methadone"
    ],
    safetyNote: "Always check for drug-drug interactions before administering QT-prolonging medications. Multiple QT-prolonging drugs have additive effects on QTc interval.",
    distractorRationales: [
      "Simply documenting and monitoring ignores the dangerous QTc prolongation that requires physician notification",
      "Administering more amiodarone when QTc is already >500 ms could precipitate fatal torsades de pointes",
      "Reducing the rate without notifying the physician is insufficient - the QTc value is a critical finding requiring medical decision-making"
    ],
    lessonLink: "/emergency/lessons/procedural-sedation"
  },
  {
    stem: "A nurse in the ED is caring for an intubated patient on mechanical ventilation. The ventilator high-pressure alarm activates repeatedly. The nurse observes the patient is biting on the endotracheal tube, has bilateral breath sounds, and the SpO2 is decreasing from 98% to 91%. What is the CORRECT sequence of troubleshooting steps?",
    options: [
      "Increase the ventilator pressure limit settings to stop the alarm from sounding",
      "Disconnect the patient from the ventilator and provide manual ventilation with a bag-valve device while systematically assessing for obstruction, patient-ventilator dyssynchrony, or bronchospasm",
      "Suction the endotracheal tube immediately and administer a nebulizer treatment",
      "Sedate the patient with propofol to stop the biting and wait for the alarm to resolve"
    ],
    correctAnswer: 1,
    rationaleLong: "The correct troubleshooting sequence is to disconnect the patient from the ventilator, provide manual ventilation with a bag-valve device, and systematically assess for the cause of the high-pressure alarm. This approach follows the DOPE mnemonic (Displacement, Obstruction, Pneumothorax, Equipment) for troubleshooting ventilator emergencies. When a high-pressure alarm activates, it means the ventilator is unable to deliver the set tidal volume because airway pressure has exceeded the high-pressure limit. This can be caused by: patient factors (biting the ETT, bronchospasm, mucus plugging, fighting the ventilator, coughing, tension pneumothorax) or equipment factors (kinked tubing, water in the circuit). The immediate action of disconnecting and hand-bagging serves two purposes: it ensures the patient continues to receive ventilation while troubleshooting, and it helps localize the problem. If the patient is easy to bag with good chest rise and compliance, the problem is likely ventilator-related (circuit, settings). If the patient is difficult to bag (high resistance), the problem is patient-related (bronchospasm, mucus plug, pneumothorax, or ETT obstruction). The DOPE mnemonic guides systematic assessment: Displacement - verify ETT position (centimeter marking at the teeth, bilateral breath sounds, ETCO2 confirmation). Obstruction - assess for tube biting (insert bite block/oral airway), mucus plugging (pass suction catheter through ETT), or kinked tube. Pneumothorax - assess for unilateral breath sounds, tracheal deviation, subcutaneous emphysema. Equipment - check ventilator circuit for disconnections, kinks, water accumulation. In this case, the patient is biting the ETT, which compresses the tube lumen and prevents gas flow. The immediate intervention is to insert an oral airway or bite block alongside the ETT to prevent biting, then reconnect to the ventilator. If biting persists, sedation adjustment is appropriate.",
    learningObjective: "Apply the DOPE mnemonic to systematically troubleshoot ventilator high-pressure alarms and provide safe manual ventilation during assessment",
    blueprintCategory: "ED-specific Nursing Skills",
    subtopic: "Rapid Sequence Intubation Assistance",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER increase the high-pressure limit to silence the alarm - this masks the underlying problem and could cause barotrauma",
    clinicalPearls: [
      "DOPE mnemonic: Displacement, Obstruction, Pneumothorax, Equipment failure",
      "Disconnect and bag to simultaneously ventilate and assess compliance",
      "Insert bite block/oral airway for patients biting on the ETT",
      "Easy to bag = likely equipment issue; Hard to bag = likely patient issue (bronchospasm, pneumothorax, plug)"
    ],
    safetyNote: "Keep a bag-valve device at the bedside of every mechanically ventilated patient. In any ventilator emergency, disconnect and hand-ventilate while troubleshooting.",
    distractorRationales: [
      "Increasing pressure limits masks the problem and risks barotrauma (lung injury from excessive pressure)",
      "Blind suctioning without assessing the cause may not address the problem if it is not from secretions",
      "Sedation alone does not immediately address the ventilation problem - the patient needs manual ventilation while the cause is identified"
    ],
    lessonLink: "/emergency/lessons/rsi-assistance"
  },
];
