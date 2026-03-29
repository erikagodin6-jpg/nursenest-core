import { ParamedicQuestion } from "./types";
import { traumaQuestions } from "./trauma";
import {
  PARAMEDIC_DRUGS,
  VITAL_PATTERNS,
  ECG_PATTERNS,
  generateDrugQuestion,
  generateECGQuestion,
  generateVitalSignQuestion,
} from "./question-templates";

const medicalScenarios: ParamedicQuestion[] = [
  {
    stem: "A 68-year-old male presents with sudden onset right-sided weakness, facial droop, and slurred speech. His wife states symptoms began 45 minutes ago. Blood glucose is 110 mg/dL. What is the MOST appropriate prehospital action?",
    options: ["Administer aspirin 324 mg", "Establish IV access, perform Cincinnati Stroke Scale, activate stroke alert", "Administer nitroglycerin sublingual", "Perform a detailed neurological exam on scene"],
    correctAnswer: 1,
    rationaleLong: "This patient presents with classic signs of acute ischemic stroke (sudden onset unilateral weakness, facial droop, speech difficulty). The Cincinnati Stroke Scale (facial droop, arm drift, speech) confirms the stroke assessment. With onset 45 minutes ago, the patient is within the thrombolytic window (4.5 hours). Prehospital priorities include: rapid stroke scale assessment, blood glucose (to rule out hypoglycemia mimicking stroke — already done at 110 mg/dL), IV access, determine last known well time, and activate stroke alert to the receiving facility. Aspirin is NOT given for stroke in the prehospital setting — it requires CT confirmation to rule out hemorrhagic stroke first. Nitroglycerin is not indicated. Prolonged scene times for detailed exams delay definitive care.",
    learningObjective: "Perform rapid stroke assessment and activate appropriate hospital notification",
    blueprintCategory: "Medical Emergencies",
    subtopic: "Stroke Assessment",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may give aspirin thinking it helps stroke like ACS — but hemorrhagic stroke must be ruled out first with CT",
    clinicalPearls: ["Cincinnati Stroke Scale: Face-Arm-Speech", "Last known well time determines thrombolytic eligibility", "Blood glucose <60 can mimic stroke — always check BGL"],
    safetyNote: "Do NOT administer aspirin for suspected stroke prehospitally — hemorrhagic stroke must be excluded by CT first",
    distractorRationales: ["Aspirin is contraindicated until hemorrhagic stroke is ruled out by CT", "Nitroglycerin is not indicated for stroke management", "Detailed neurological exams delay transport — time is brain"]
  },
  {
    stem: "A 42-year-old type 1 diabetic is found by coworkers acting confused and combative. He is diaphoretic with a blood glucose of 32 mg/dL. IV access cannot be established after two attempts. What is the MOST appropriate next intervention?",
    options: ["Oral glucose gel", "Glucagon 1 mg IM", "D50 via IO access", "Thiamine 100 mg IM"],
    correctAnswer: 1,
    rationaleLong: "With confirmed severe hypoglycemia (BGL 32 mg/dL) and failed IV access, glucagon 1 mg IM is the most appropriate intervention. Glucagon stimulates hepatic glycogenolysis to raise blood glucose. It can be given IM without IV access, making it ideal for this situation. Oral glucose is CONTRAINDICATED in a patient with altered mental status due to aspiration risk — the patient is confused and combative. D50 via IO is an option but IO placement is more invasive than IM glucagon and should be reserved if glucagon is unavailable or ineffective. Thiamine should be considered but does not address the acute hypoglycemia emergency. Glucagon typically raises BGL within 5-10 minutes but requires adequate hepatic glycogen stores.",
    learningObjective: "Select appropriate hypoglycemia treatment when IV access is unavailable",
    blueprintCategory: "Medical Emergencies",
    subtopic: "Diabetic Emergencies",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Oral glucose seems simple but is contraindicated in patients with altered mental status due to aspiration risk",
    clinicalPearls: ["Glucagon 1 mg IM when IV access unavailable", "Oral glucose is ONLY for alert patients who can swallow", "Recheck BGL 5-10 minutes after glucagon administration"],
    safetyNote: "NEVER give oral glucose to a patient with altered mental status — aspiration risk is high",
    distractorRationales: ["Oral glucose is contraindicated in altered mental status due to aspiration risk", "IO access is more invasive than necessary when IM glucagon is available", "Thiamine does not treat acute hypoglycemia"]
  },
  {
    stem: "A 22-year-old female presents with generalized tonic-clonic seizures that have been ongoing for 8 minutes. She has no IV access. What is the MOST appropriate first-line treatment?",
    options: ["Diazepam 10 mg rectal", "Midazolam 10 mg IM or 5 mg IN", "Lorazepam 4 mg IV", "Phenytoin 20 mg/kg IV"],
    correctAnswer: 1,
    rationaleLong: "For status epilepticus (seizures lasting >5 minutes) without IV access, midazolam IM (10 mg) or intranasal (5 mg) is the first-line treatment. The RAMPART trial demonstrated that IM midazolam is at least as effective as IV lorazepam for prehospital seizure management. Since the patient has no IV access, IM/IN midazolam is immediately available and does not require establishing access during an active seizure. Rectal diazepam is an alternative but is less practical in adults and has slower absorption. IV lorazepam requires IV access which is not available. Phenytoin is a second-line agent used in the hospital setting for refractory seizures and requires IV access with cardiac monitoring.",
    learningObjective: "Manage status epilepticus with appropriate benzodiazepine therapy",
    blueprintCategory: "Medical Emergencies",
    subtopic: "Seizures",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may choose IV lorazepam as the 'best' benzodiazepine but this patient has no IV access",
    clinicalPearls: ["Status epilepticus: seizures >5 minutes or recurrent without return to baseline", "RAMPART trial: IM midazolam equivalent to IV lorazepam", "Intranasal midazolam is an excellent alternative when IV access is unavailable"],
    safetyNote: "Monitor respiratory status closely after benzodiazepine administration — respiratory depression is the primary adverse effect",
    distractorRationales: ["Rectal diazepam is less practical in adults and has slower absorption", "IV lorazepam requires IV access which is not available", "Phenytoin is a second-line hospital agent requiring IV access and cardiac monitoring"]
  },
  {
    stem: "A 35-year-old male presents after intentional ingestion of an unknown quantity of acetaminophen approximately 1 hour ago. He is alert, oriented, and denies any symptoms. What is the MOST appropriate prehospital intervention?",
    options: ["Activated charcoal 1 g/kg PO", "Syrup of ipecac to induce vomiting", "N-acetylcysteine IV infusion", "Transport only — no prehospital treatment needed"],
    correctAnswer: 0,
    rationaleLong: "Activated charcoal (1 g/kg PO) is most appropriate within 1 hour of acetaminophen ingestion in an alert, cooperative patient who can protect their airway. Charcoal adsorbs acetaminophen in the GI tract, reducing systemic absorption. The effectiveness of charcoal decreases significantly after 1-2 hours post-ingestion. Syrup of ipecac is no longer recommended for poisoning management due to aspiration risk and limited efficacy. N-acetylcysteine (NAC) is the definitive antidote but is typically initiated in the hospital based on acetaminophen levels and the Rumack-Matthew nomogram. Transport without any intervention misses the opportunity to reduce absorption during the critical first hour. The patient's lack of symptoms is expected — acetaminophen toxicity has a delayed presentation (24-72 hours for liver damage).",
    learningObjective: "Apply activated charcoal appropriately for acute oral poisoning",
    blueprintCategory: "Medical Emergencies",
    subtopic: "Overdose/Poisoning",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "The asymptomatic patient may seem fine, but acetaminophen toxicity is delayed — early decontamination is critical",
    clinicalPearls: ["Activated charcoal most effective within 1 hour of ingestion", "Acetaminophen toxicity is delayed — liver damage occurs at 24-72 hours", "N-acetylcysteine is the definitive antidote but hospital-based"],
    safetyNote: "Only give activated charcoal to patients who are alert and can protect their airway — aspiration of charcoal causes severe pneumonitis",
    distractorRationales: ["Syrup of ipecac is no longer recommended and increases aspiration risk", "NAC is initiated in the hospital based on serum levels, not prehospitally", "Transporting without decontamination misses the window for activated charcoal efficacy"]
  },
  {
    stem: "A 50-year-old female presents with acute onset hives, lip swelling, wheezing, and hypotension after eating shrimp. Her BP is 72/40 and HR is 140. After administering epinephrine 0.3 mg IM, what is the NEXT most important intervention?",
    options: ["Diphenhydramine 50 mg IV", "Normal saline 1-2 L IV bolus", "Nebulized albuterol", "Methylprednisolone 125 mg IV"],
    correctAnswer: 1,
    rationaleLong: "After epinephrine IM for anaphylaxis, the next priority is aggressive IV fluid resuscitation with normal saline 1-2 L bolus. Anaphylaxis causes distributive shock through massive vasodilation and increased capillary permeability, leading to intravascular volume depletion. The hypotension (BP 72/40) requires volume expansion in addition to the vasoconstrictive effects of epinephrine. Diphenhydramine addresses histamine-mediated symptoms (hives, itching) but does not treat the life-threatening hypotension. Albuterol helps with bronchospasm but does not address shock. Corticosteroids help prevent biphasic reactions but take hours to work and do not address acute hemodynamic instability.",
    learningObjective: "Manage anaphylactic shock with appropriate fluid resuscitation after epinephrine",
    blueprintCategory: "Medical Emergencies",
    subtopic: "Anaphylaxis",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may choose diphenhydramine as the 'next step' but it does not treat the hemodynamic emergency",
    clinicalPearls: ["Anaphylaxis fluid shifts can require 5-10 L of crystalloid", "Epinephrine can be repeated every 5-15 minutes if symptoms persist", "Biphasic anaphylaxis can occur 4-12 hours after initial reaction"],
    safetyNote: "Anaphylaxis can recur (biphasic reaction) — observe patients for at least 4-6 hours after treatment",
    distractorRationales: ["Diphenhydramine treats histamine symptoms but not hemodynamic shock", "Albuterol addresses bronchospasm but not hypotension", "Corticosteroids have delayed onset and do not treat acute shock"]
  },
  {
    stem: "A 72-year-old nursing home resident presents with fever of 103°F, altered mental status, tachycardia at 125, BP 82/50, and RR of 26. A urinary catheter is in place. What condition should the paramedic strongly suspect?",
    options: ["Urinary tract infection only", "Sepsis secondary to urinary source", "Heat stroke", "Diabetic ketoacidosis"],
    correctAnswer: 1,
    rationaleLong: "This patient meets criteria for sepsis: suspected infection (urinary catheter as source) with organ dysfunction evidenced by altered mental status and hypotension. The SOFA/qSOFA criteria include altered mentation, SBP ≤100, and RR ≥22 — this patient meets all three. Sepsis is defined as life-threatening organ dysfunction caused by a dysregulated host response to infection. The urinary catheter is a common source of infection in nursing home patients. A simple UTI would not cause hypotension and altered mental status. Heat stroke is possible but the urinary catheter and presentation pattern favor sepsis. DKA presents with Kussmaul respirations, fruity breath, and polyuria, not this pattern.",
    learningObjective: "Recognize sepsis using clinical criteria and identify common sources of infection",
    blueprintCategory: "Medical Emergencies",
    subtopic: "Sepsis",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "multiple-choice",
    examTrap: "Students may diagnose 'just a UTI' and miss the systemic sepsis presentation",
    clinicalPearls: ["qSOFA: AMS + SBP ≤100 + RR ≥22 — 2 of 3 suggests sepsis", "Urinary catheters are a leading source of sepsis in elderly/institutionalized patients", "Sepsis requires aggressive fluid resuscitation and early antibiotics"],
    safetyNote: "Every hour of delayed sepsis treatment increases mortality by approximately 7.6% — early recognition saves lives",
    distractorRationales: ["UTI alone does not explain hypotension and altered mental status", "Heat stroke is possible but the infectious source and sepsis criteria are more consistent", "DKA has a different presentation pattern with Kussmaul respirations and hyperglycemia"]
  },
  {
    stem: "A 28-year-old male is found unresponsive at a party. His friends say he took 'something.' He has pinpoint pupils, respiratory rate of 4, and cyanosis. After assisting ventilations with BVM, you administer naloxone 2 mg IN. The patient wakes up agitated and combative. What should you do?",
    options: ["Administer another 2 mg naloxone", "Physically restrain the patient and transport", "Explain that he received an overdose reversal medication and maintain supportive care", "Administer midazolam for sedation"],
    correctAnswer: 2,
    rationaleLong: "The patient's presentation (pinpoint pupils, respiratory depression, response to naloxone) confirms opioid overdose. The naloxone has reversed the opioid effects, but the agitation and combativeness are common responses — the patient may be experiencing acute opioid withdrawal and/or confusion upon waking. The appropriate response is to calmly explain the situation, maintain a safe environment, and provide supportive care. Additional naloxone is NOT indicated since the patient is now breathing adequately. The goal of naloxone is to restore respiratory effort, NOT full consciousness. Physical restraint should be a last resort. Midazolam would cause sedation and potentially re-depress respirations in a patient who just had respiratory failure.",
    learningObjective: "Manage post-naloxone administration including withdrawal symptoms and patient communication",
    blueprintCategory: "Medical Emergencies",
    subtopic: "Overdose/Poisoning",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Giving more naloxone when the patient is already breathing risks precipitating severe withdrawal",
    clinicalPearls: ["Titrate naloxone to respiratory effort, NOT full consciousness", "Agitation after naloxone is expected — acute withdrawal is uncomfortable but not dangerous", "Naloxone duration (30-90 min) may be shorter than the opioid — monitor for re-sedation"],
    safetyNote: "Monitor for re-sedation — long-acting opioids (methadone, fentanyl patches) may outlast naloxone's duration",
    distractorRationales: ["Additional naloxone is not needed since respiratory effort is restored", "Physical restraint is a last resort and may be unnecessary with de-escalation", "Midazolam could re-depress respirations in a patient recovering from respiratory failure"]
  },
  {
    stem: "A 60-year-old male with no medical history presents with confusion, excessive thirst, polyuria, and deep rapid breathing (Kussmaul respirations). His blood glucose reads 'HIGH' (>500 mg/dL). What condition is MOST likely?",
    options: ["Hyperosmolar hyperglycemic state (HHS)", "Diabetic ketoacidosis (DKA)", "Hypoglycemia", "Addisonian crisis"],
    correctAnswer: 1,
    rationaleLong: "Kussmaul respirations (deep, rapid breathing) combined with extreme hyperglycemia (>500 mg/dL), confusion, excessive thirst, and polyuria are the hallmarks of diabetic ketoacidosis (DKA). Kussmaul respirations are the body's compensatory mechanism to blow off CO2 to correct metabolic acidosis from ketone body accumulation. DKA most commonly occurs in type 1 diabetics but can occur in type 2. HHS typically presents with extreme hyperglycemia (often >600 mg/dL) but WITHOUT Kussmaul respirations because there is minimal ketosis/acidosis. Hypoglycemia presents with the opposite glucose finding. Addisonian crisis presents with hypotension and hypoglycemia, not hyperglycemia.",
    learningObjective: "Differentiate DKA from HHS based on clinical presentation",
    blueprintCategory: "Medical Emergencies",
    subtopic: "Diabetic Emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "multiple-choice",
    examTrap: "The key differentiator between DKA and HHS is Kussmaul respirations — DKA has them, HHS does not",
    clinicalPearls: ["DKA: Kussmaul respirations, fruity breath, glucose usually 300-800", "HHS: No Kussmaul respirations, glucose often >600-1000, more common in type 2", "Both DKA and HHS require aggressive fluid resuscitation"],
    safetyNote: "DKA patients are severely dehydrated — initiate NS fluid bolus (1-2 L) prehospitally",
    distractorRationales: ["HHS lacks Kussmaul respirations and significant ketoacidosis", "Hypoglycemia presents with low blood glucose, not >500", "Addisonian crisis presents with hypoglycemia and hypotension"]
  },
  {
    stem: "A 45-year-old male with a known seizure disorder presents postictal. Bystanders report a single generalized tonic-clonic seizure lasting approximately 2 minutes that has now resolved. He is confused but breathing normally. What is the MOST appropriate prehospital management?",
    options: ["Administer IV lorazepam to prevent another seizure", "Place in recovery position, monitor airway, assess blood glucose, transport", "Intubate immediately due to risk of aspiration", "Administer phenytoin loading dose IV"],
    correctAnswer: 1,
    rationaleLong: "For a patient who is postictal after a single self-limited seizure (lasting <5 minutes), the appropriate management is supportive care: recovery position to protect the airway, monitoring respiratory status, checking blood glucose (hypoglycemia can cause seizures and should be treated), and transport for evaluation. Benzodiazepines are NOT indicated for a seizure that has already terminated — they are only indicated for active status epilepticus (>5 minutes). Prophylactic benzodiazepines can cause unnecessary respiratory depression. Intubation is not needed in a patient who is breathing normally. Phenytoin is a hospital-based intervention.",
    learningObjective: "Provide appropriate postictal care and differentiate from status epilepticus management",
    blueprintCategory: "Medical Emergencies",
    subtopic: "Seizures",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may reflexively give benzodiazepines after any seizure — but treatment is only for ACTIVE status epilepticus",
    clinicalPearls: ["Benzodiazepines are for active seizures >5 minutes, not postictal patients", "Always check blood glucose in seizure patients — hypoglycemia is a treatable cause", "Postictal confusion typically resolves in 15-30 minutes"],
    safetyNote: "Place postictal patients in the recovery position to prevent aspiration — vomiting is common during the postictal period",
    distractorRationales: ["Benzodiazepines for a terminated seizure cause unnecessary respiratory depression", "Intubation is not indicated in a patient breathing normally", "Phenytoin is a hospital-based medication requiring IV access and cardiac monitoring"]
  },
  {
    stem: "A 30-year-old male presents with sudden severe headache ('worst headache of my life'), neck stiffness, and photophobia. He is alert with GCS 15. BP is 168/92. What condition should you suspect?",
    options: ["Tension headache", "Migraine with aura", "Subarachnoid hemorrhage", "Meningitis"],
    correctAnswer: 2,
    rationaleLong: "The 'worst headache of my life' with sudden onset (thunderclap headache), combined with neck stiffness (meningismus) and photophobia, is the classic presentation of subarachnoid hemorrhage (SAH) until proven otherwise. SAH is caused by rupture of a cerebral aneurysm, releasing blood into the subarachnoid space. The blood irritates the meninges, causing neck stiffness and photophobia. The hypertension (168/92) is a compensatory response. Tension headaches are gradual onset with band-like pressure. Migraines can be severe but are typically preceded by aura and have a different character. Meningitis presents similarly (neck stiffness, photophobia) but typically has fever and a more gradual onset. SAH is a neurosurgical emergency requiring immediate transport.",
    learningObjective: "Recognize the classic presentation of subarachnoid hemorrhage",
    blueprintCategory: "Medical Emergencies",
    subtopic: "Stroke Assessment",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "multiple-choice",
    examTrap: "Neck stiffness with headache may lead students to think meningitis — but 'worst headache of life' with sudden onset points to SAH",
    clinicalPearls: ["'Worst headache of my life' + sudden onset = subarachnoid hemorrhage until proven otherwise", "Do not lower blood pressure in suspected SAH — hypertension maintains cerebral perfusion", "SAH can present with a 'sentinel headache' days before major rupture"],
    safetyNote: "SAH has 50% mortality — rapid transport to a facility with neurosurgical capability is critical",
    distractorRationales: ["Tension headaches are gradual onset and not described as 'worst ever'", "Migraines have prodromal symptoms and different character than thunderclap headaches", "Meningitis typically includes fever and has a more gradual onset"]
  },
  {
    stem: "A 55-year-old male presents with weakness, nausea, and peaked T waves on the cardiac monitor. He is on dialysis and missed his last two sessions. His potassium is most likely:",
    options: ["Low (hypokalemia)", "Normal", "High (hyperkalemia)", "Cannot be determined from this information"],
    correctAnswer: 2,
    rationaleLong: "This patient has classic signs of hyperkalemia: dialysis patient who missed sessions (kidneys cannot excrete potassium), weakness, nausea, and peaked T waves on the cardiac monitor. Peaked T waves are the earliest ECG change in hyperkalemia, appearing when potassium levels exceed approximately 5.5-6.0 mEq/L. As potassium rises further, the ECG progresses to widened QRS, flattened P waves, sine wave pattern, and eventually cardiac arrest. Dialysis patients are at high risk for hyperkalemia because the kidneys are the primary route of potassium excretion. Missing dialysis sessions allows potassium to accumulate to dangerous levels. Treatment includes calcium chloride (cardiac membrane stabilization), sodium bicarbonate (shifts K+ intracellularly), albuterol nebulizer (shifts K+ intracellularly), and emergent dialysis.",
    learningObjective: "Recognize hyperkalemia in at-risk patients and identify ECG findings",
    blueprintCategory: "Medical Emergencies",
    subtopic: "Electrolyte Disorders",
    difficulty: 2,
    cognitiveLevel: "analysis",
    questionType: "multiple-choice",
    examTrap: "Students must know that peaked T waves are the hallmark ECG finding of hyperkalemia",
    clinicalPearls: ["Hyperkalemia ECG progression: peaked T waves → widened QRS → loss of P waves → sine wave → cardiac arrest", "Dialysis patients + missed sessions = assume hyperkalemia", "Calcium chloride stabilizes the cardiac membrane but does NOT lower potassium"],
    safetyNote: "Hyperkalemia can cause sudden cardiac arrest — treat aggressively and monitor continuously",
    distractorRationales: ["Hypokalemia causes flattened T waves and U waves, not peaked T waves", "Normal potassium does not cause ECG changes", "The clinical context (missed dialysis + peaked T waves) clearly indicates hyperkalemia"]
  },
];

const cardiacScenarios: ParamedicQuestion[] = [
  {
    stem: "You arrive to find a 58-year-old male in cardiac arrest. Bystander CPR is in progress. The monitor shows ventricular fibrillation. What is the FIRST intervention in the ACLS VF/pVT algorithm?",
    options: ["Administer epinephrine 1 mg IV", "Defibrillation at 120-200J biphasic", "Administer amiodarone 300 mg IV", "Secure an advanced airway"],
    correctAnswer: 1,
    rationaleLong: "In the ACLS cardiac arrest algorithm for VF/pulseless VT, the FIRST intervention is immediate defibrillation. Defibrillation is the only definitive treatment for ventricular fibrillation — it depolarizes the entire myocardium simultaneously, allowing the heart's intrinsic pacemakers to resume organized electrical activity. Every minute of VF without defibrillation reduces survival by 7-10%. The sequence is: confirm rhythm → defibrillate → resume CPR for 2 minutes → rhythm check. Epinephrine is given after the 2nd shock. Amiodarone is given after the 3rd shock. Advanced airway management should not interrupt chest compressions and is performed between rhythm checks.",
    learningObjective: "Apply the ACLS VF/pulseless VT cardiac arrest algorithm",
    blueprintCategory: "Cardiac/ACLS",
    subtopic: "Cardiac Arrest",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may want to give epinephrine first, but defibrillation takes priority for shockable rhythms",
    clinicalPearls: ["VF/pVT: Shock first, then CPR, then drugs", "Epinephrine after 2nd shock in VF/pVT", "Amiodarone 300 mg after 3rd shock, then 150 mg"],
    safetyNote: "Minimize interruptions to chest compressions — even brief pauses significantly reduce survival",
    distractorRationales: ["Epinephrine is given after the second defibrillation attempt", "Amiodarone is given after the third defibrillation attempt", "Advanced airway should not delay defibrillation or interrupt compressions"]
  },
  {
    stem: "A 65-year-old female presents with substernal chest pressure radiating to the left arm, diaphoresis, and nausea. Her 12-lead ECG shows ST elevation in leads II, III, and aVF. Which coronary artery is MOST likely occluded?",
    options: ["Left anterior descending (LAD)", "Right coronary artery (RCA)", "Left circumflex (LCx)", "Left main coronary artery"],
    correctAnswer: 1,
    rationaleLong: "ST elevation in leads II, III, and aVF indicates an inferior STEMI, which is most commonly caused by occlusion of the right coronary artery (RCA). The RCA supplies the inferior wall of the left ventricle, the right ventricle, the SA node (in ~60% of people), and the AV node (in ~85% of people). This explains why inferior MIs may present with bradycardia (SA/AV node ischemia) and right ventricular involvement. The LAD supplies the anterior wall (ST elevation in V1-V4). The LCx supplies the lateral wall (ST elevation in I, aVL, V5-V6). Left main occlusion would cause widespread ST changes and is usually rapidly fatal. Always obtain right-sided leads (V4R) for inferior STEMIs to assess for right ventricular involvement.",
    learningObjective: "Correlate ST elevation patterns with coronary artery territories",
    blueprintCategory: "Cardiac/ACLS",
    subtopic: "12-Lead ECG",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "multiple-choice",
    examTrap: "Students must memorize which leads correspond to which coronary territories",
    clinicalPearls: ["Inferior STEMI (II, III, aVF) = RCA", "Anterior STEMI (V1-V4) = LAD", "Lateral STEMI (I, aVL, V5-V6) = LCx"],
    safetyNote: "Inferior STEMIs may involve the right ventricle — avoid nitroglycerin as it reduces preload and can cause severe hypotension",
    distractorRationales: ["LAD occlusion causes anterior STEMI with ST elevation in V1-V4", "LCx occlusion causes lateral STEMI with changes in I, aVL, V5-V6", "Left main occlusion causes widespread changes and is usually rapidly fatal"]
  },
  {
    stem: "A patient is found pulseless and apneic. The cardiac monitor shows a flat line in Lead II. What should you do BEFORE calling asystole?",
    options: ["Administer epinephrine 1 mg IV", "Confirm asystole in a second lead", "Begin transcutaneous pacing", "Check for a pulse for 30 seconds"],
    correctAnswer: 1,
    rationaleLong: "Before declaring asystole, the paramedic must confirm the rhythm in at least one other lead. A flat line in a single lead may represent fine ventricular fibrillation (which is treatable with defibrillation) viewed perpendicular to the electrical axis, making it appear flat. This is sometimes called 'fine VF masquerading as asystole.' Confirming in multiple leads helps differentiate true asystole from fine VF. Other checks include verifying leads are connected, the gain is turned up, and the monitor is functioning properly. Treating asystole as VF (defibrillating) is harmful, and treating VF as asystole (not defibrillating) misses a chance for survival. The pulse check should be brief (no more than 10 seconds).",
    learningObjective: "Properly confirm asystole before initiating the asystole algorithm",
    blueprintCategory: "Cardiac/ACLS",
    subtopic: "Cardiac Arrest",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "A flat line in one lead may actually be fine VF — always confirm in a second lead",
    clinicalPearls: ["Confirm asystole in 2+ leads before declaring", "Fine VF can appear as asystole in certain lead orientations", "Check leads, gain, and connections before accepting asystole"],
    safetyNote: "Defibrillating true asystole provides no benefit and interrupts CPR — always confirm the rhythm",
    distractorRationales: ["Epinephrine is part of the asystole algorithm but rhythm must be confirmed first", "Transcutaneous pacing is not effective for asystole", "Pulse checks should be brief (10 seconds), not 30 seconds"]
  },
  {
    stem: "A patient develops chest pain and the 12-lead shows ST elevation in V1-V4 with reciprocal ST depression in II, III, aVF. Which wall of the heart is affected?",
    options: ["Inferior wall", "Anterior wall", "Lateral wall", "Posterior wall"],
    correctAnswer: 1,
    rationaleLong: "ST elevation in leads V1-V4 indicates an anterior wall STEMI, caused by occlusion of the left anterior descending (LAD) artery. The reciprocal ST depression in the inferior leads (II, III, aVF) supports this diagnosis — reciprocal changes are common and help confirm the STEMI diagnosis. The anterior wall is the largest territory of the left ventricle, and anterior STEMIs often result in significant loss of myocardial function and may lead to cardiogenic shock or cardiac arrest. V1-V2 correspond to the septal wall, V3-V4 to the anterior wall. The LAD is sometimes called the 'widow maker' because anterior STEMIs have the highest mortality. Immediate treatment includes aspirin, nitroglycerin (if SBP >90), heparin per protocol, and emergent cath lab activation.",
    learningObjective: "Identify anterior STEMI pattern on 12-lead ECG and understand the clinical significance",
    blueprintCategory: "Cardiac/ACLS",
    subtopic: "12-Lead ECG",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may focus on the reciprocal depression rather than the primary ST elevation to identify the affected wall",
    clinicalPearls: ["V1-V4 ST elevation = anterior STEMI = LAD occlusion", "Reciprocal changes confirm the STEMI diagnosis", "Anterior STEMIs have the highest mortality due to large territory involvement"],
    safetyNote: "Anterior STEMIs are high-risk for cardiogenic shock and VF arrest — have defibrillator ready and monitor continuously",
    distractorRationales: ["Inferior wall involvement would show ST elevation in II, III, aVF — not V1-V4", "Lateral wall would show changes in I, aVL, V5-V6", "Posterior wall shows ST depression in V1-V3 (not elevation) with tall R waves"]
  },
  {
    stem: "A 72-year-old male presents with lightheadedness and near-syncope. His heart rate is 34 bpm. The monitor shows regular QRS complexes with P waves marching through at a rate of 80 bpm with no consistent relationship to the QRS complexes. What is the rhythm?",
    options: ["Second-degree Type I (Wenckebach)", "Second-degree Type II (Mobitz II)", "Third-degree (complete) heart block", "Sinus bradycardia"],
    correctAnswer: 2,
    rationaleLong: "The key findings are: atrial rate of 80 bpm (P waves at 80), ventricular rate of 34 bpm (QRS at 34), and NO consistent relationship between P waves and QRS complexes (AV dissociation). This is the definition of third-degree (complete) heart block. The atria and ventricles are beating independently because no atrial impulses are conducted through the AV node. The ventricular rate of 34 suggests a ventricular escape rhythm. Second-degree Type I shows progressive PR prolongation before a dropped beat. Second-degree Type II shows constant PR intervals with intermittent dropped beats. Sinus bradycardia would show a 1:1 relationship between P waves and QRS complexes. Third-degree heart block is a high-risk rhythm requiring transcutaneous pacing.",
    learningObjective: "Identify third-degree heart block and differentiate it from other bradydysrhythmias",
    blueprintCategory: "Cardiac/ACLS",
    subtopic: "Dysrhythmia Recognition",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "multiple-choice",
    examTrap: "The hallmark of complete heart block is AV dissociation — P waves and QRS complexes have no relationship",
    clinicalPearls: ["3rd degree block: P waves march through QRS at independent rates", "Ventricular rate <40 suggests ventricular escape rhythm", "Atropine is usually INEFFECTIVE for infranodal blocks — use pacing"],
    safetyNote: "Third-degree heart block can deteriorate to asystole without warning — prepare for transcutaneous pacing immediately",
    distractorRationales: ["Wenckebach shows progressive PR prolongation — this has no PR relationship", "Mobitz II has constant PR with dropped beats — this has completely independent rates", "Sinus bradycardia has 1:1 P:QRS relationship — this shows complete dissociation"]
  },
  {
    stem: "You are performing synchronized cardioversion on a patient with unstable SVT at 180 bpm. At what energy level should you START for narrow-complex SVT?",
    options: ["50-100 J biphasic", "120-200 J biphasic", "200 J biphasic", "360 J monophasic"],
    correctAnswer: 0,
    rationaleLong: "Synchronized cardioversion for narrow-complex SVT should start at a lower energy level of 50-100 J biphasic. Narrow-complex tachycardias (SVT, atrial flutter) are more easily cardioverted than wide-complex rhythms and require less energy. The synchronized mode delivers the shock during the R wave to avoid the vulnerable period (T wave), which could induce VF. Starting at higher energies increases the risk of complications including post-cardioversion dysrhythmias and myocardial damage without improving success rates. If 50 J is unsuccessful, increase in a stepwise fashion. For unstable VT with a pulse, start at 100 J. For atrial fibrillation, start at 120-200 J. Remember: synchronized cardioversion is for patients WITH a pulse who are hemodynamically unstable.",
    learningObjective: "Select appropriate cardioversion energy levels for different tachyarrhythmias",
    blueprintCategory: "Cardiac/ACLS",
    subtopic: "Cardioversion/Defibrillation",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "multiple-choice",
    examTrap: "Students may confuse cardioversion energy levels with defibrillation levels — cardioversion starts lower for narrow-complex rhythms",
    clinicalPearls: ["SVT/atrial flutter: 50-100 J", "Unstable VT with pulse: 100 J", "Atrial fibrillation: 120-200 J"],
    safetyNote: "Always ensure the defibrillator is in SYNC mode for cardioversion — unsynchronized shock can induce VF",
    distractorRationales: ["120-200 J is the starting energy for atrial fibrillation, not SVT", "200 J is too high as an initial energy for narrow-complex SVT", "360 J monophasic is the maximum defibrillation energy, not cardioversion starting energy"]
  },
];

const pediatricScenarios: ParamedicQuestion[] = [
  {
    stem: "You are called to a 2-year-old who is febrile (104°F), drooling, sitting in a tripod position, and has inspiratory stridor. The child appears anxious but is not cyanotic. What is the MOST likely diagnosis and the MOST important prehospital action?",
    options: ["Croup — administer nebulized epinephrine", "Epiglottitis — keep child calm, avoid instrumentation, transport immediately", "Foreign body aspiration — perform back blows and chest thrusts", "Asthma — administer nebulized albuterol"],
    correctAnswer: 1,
    rationaleLong: "The classic presentation of epiglottitis includes the '4 Ds': Drooling, Dysphagia, Dysphonia, and Distress, along with high fever and tripod positioning. This child's fever (104°F), drooling, tripod position, and stridor are highly suspicious for epiglottitis. The MOST important prehospital action is to keep the child calm, avoid any instrumentation (no tongue depressors, no laryngoscopy, no oral suctioning), and transport immediately. Agitating the child or attempting to visualize the airway can cause complete airway obstruction from the swollen epiglottis. Croup typically presents with a barking cough and lower-grade fever. Foreign body aspiration has a sudden onset history. Asthma presents with expiratory wheezing, not inspiratory stridor.",
    learningObjective: "Differentiate epiglottitis from other pediatric upper airway emergencies",
    blueprintCategory: "Pediatric/PALS",
    subtopic: "Pediatric Airway",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "multiple-choice",
    examTrap: "Attempting to visualize the airway in suspected epiglottitis can cause complete obstruction — this is a critical safety point",
    clinicalPearls: ["Epiglottitis 4 Ds: Drooling, Dysphagia, Dysphonia, Distress", "NEVER instrument the airway in suspected epiglottitis", "Epiglottitis has higher fever than croup (>103°F vs <102°F typically)"],
    safetyNote: "DO NOT attempt to visualize the airway, insert tongue depressors, or agitate a child with suspected epiglottitis — complete obstruction can result",
    distractorRationales: ["Croup presents with barking cough and seal-like sound, not drooling and tripod positioning", "Foreign body aspiration has sudden onset history, not high fever and gradual progression", "Asthma causes expiratory wheezing, not inspiratory stridor with drooling"]
  },
  {
    stem: "You are resuscitating a newborn who is gasping with a heart rate of 50 bpm after initial steps and 30 seconds of effective positive pressure ventilation. What is the NEXT step?",
    options: ["Administer epinephrine via umbilical vein", "Continue PPV and reassess in 30 seconds", "Begin chest compressions coordinated with PPV at 3:1 ratio", "Intubate immediately"],
    correctAnswer: 2,
    rationaleLong: "In neonatal resuscitation (NRP algorithm), if the heart rate remains below 60 bpm after 30 seconds of effective positive pressure ventilation, chest compressions should be initiated. The compression-to-ventilation ratio for neonatal resuscitation is 3:1 (3 compressions to 1 ventilation), delivering approximately 120 events per minute (90 compressions + 30 breaths). This ratio is specific to neonatal resuscitation and differs from the 15:2 ratio used for infant/child two-rescuer CPR and the 30:2 ratio for single-rescuer CPR. Epinephrine is considered if HR remains <60 after adequate ventilation AND compressions. The heart rate of 50 bpm after adequate PPV indicates the need for compressions, not just continued ventilation.",
    learningObjective: "Apply the NRP algorithm for neonatal resuscitation",
    blueprintCategory: "Pediatric/PALS",
    subtopic: "Neonatal Resuscitation",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "The 3:1 compression-to-ventilation ratio is unique to neonatal resuscitation — students may default to 30:2 or 15:2",
    clinicalPearls: ["NRP compressions indicated when HR <60 after 30 seconds of effective PPV", "Neonatal compression-to-ventilation ratio: 3:1", "Epinephrine only after HR remains <60 despite compressions + ventilation"],
    safetyNote: "Ensure ventilation is EFFECTIVE before starting compressions — the most common reason for neonatal bradycardia is inadequate ventilation",
    distractorRationales: ["Epinephrine is given only after compressions fail to raise the heart rate above 60", "Simply continuing PPV without compressions is insufficient when HR <60 after adequate ventilation", "Intubation may be needed but compressions should not be delayed for advanced airway"]
  },
  {
    stem: "A 5-year-old child presents with increased work of breathing, bilateral wheezing, intercostal retractions, and SpO2 of 89%. After administering albuterol, the child's condition does not improve. What should you administer next?",
    options: ["Ipratropium bromide 0.5 mg nebulized", "Epinephrine 1:1,000 0.01 mg/kg IM", "Magnesium sulfate 25-50 mg/kg IV", "Methylprednisolone 2 mg/kg IV"],
    correctAnswer: 0,
    rationaleLong: "For a pediatric patient with moderate-to-severe asthma who has not responded to initial albuterol, the next step is ipratropium bromide (Atrovent) 0.5 mg nebulized. Ipratropium is an anticholinergic bronchodilator that works through a different mechanism than albuterol (beta-2 agonist), providing additive bronchodilation. This is often given as a combination nebulizer (DuoNeb). IM epinephrine is reserved for severe asthma/status asthmaticus not responding to inhaled bronchodilators or for patients unable to cooperate with nebulized treatments. Magnesium sulfate is considered for severe/refractory asthma. Corticosteroids are important but have a delayed onset (4-6 hours) and do not provide immediate bronchodilation.",
    learningObjective: "Manage escalating pediatric asthma treatment when initial bronchodilator therapy fails",
    blueprintCategory: "Pediatric/PALS",
    subtopic: "Pediatric Airway",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may jump to epinephrine, but ipratropium is the next step in the asthma stepwise approach before systemic medications",
    clinicalPearls: ["Albuterol + ipratropium provides additive bronchodilation through different mechanisms", "IM epinephrine is reserved for severe/status asthmaticus", "Pediatric albuterol dose: 2.5 mg nebulized, can be given continuously"],
    safetyNote: "An SpO2 of 89% in a wheezing child represents severe asthma — prepare for rapid escalation of care including possible intubation",
    distractorRationales: ["IM epinephrine is reserved for more severe cases not responding to inhaled treatments", "Magnesium sulfate is for severe refractory asthma — ipratropium comes first", "Corticosteroids have delayed onset and do not provide immediate bronchodilation"]
  },
  {
    stem: "Using the Broselow tape, you determine a pediatric patient weighs approximately 15 kg. What is the correct epinephrine dose for this child in cardiac arrest?",
    options: ["0.15 mg (0.15 mL of 1:1,000)", "0.15 mg (1.5 mL of 1:10,000)", "1.5 mg (1.5 mL of 1:1,000)", "0.015 mg (0.15 mL of 1:10,000)"],
    correctAnswer: 1,
    rationaleLong: "The pediatric cardiac arrest epinephrine dose is 0.01 mg/kg IV/IO of 1:10,000 concentration. For a 15 kg child: 0.01 mg/kg × 15 kg = 0.15 mg. Using the 1:10,000 concentration (0.1 mg/mL), the volume is 1.5 mL. This is the STANDARD IV/IO dose. The IM dose for anaphylaxis uses 1:1,000 concentration at 0.01 mg/kg but that is a different indication. Using 1:1,000 concentration IV at 10× the intended concentration could cause dangerous hypertension, tachycardia, and arrhythmias. The Broselow tape provides weight-based dosing to reduce medication errors in pediatric emergencies. Always double-check concentration, dose, and volume in pediatric patients.",
    learningObjective: "Calculate correct weight-based epinephrine dosing for pediatric cardiac arrest",
    blueprintCategory: "Pediatric/PALS",
    subtopic: "Pediatric Pharmacology",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Concentration errors between 1:1,000 and 1:10,000 are one of the most common and dangerous pediatric medication errors",
    clinicalPearls: ["Pediatric cardiac arrest epinephrine: 0.01 mg/kg IV/IO of 1:10,000", "Pediatric anaphylaxis epinephrine: 0.01 mg/kg IM of 1:1,000", "Always verify concentration before administering pediatric epinephrine"],
    safetyNote: "Using 1:1,000 instead of 1:10,000 concentration IV gives 10× the intended dose — this is a potentially lethal error",
    distractorRationales: ["0.15 mL of 1:1,000 = 0.15 mg but uses the wrong concentration for IV cardiac arrest dosing", "1.5 mg is 10× the correct dose — a dangerous overdose", "0.015 mg is too low (0.001 mg/kg instead of 0.01 mg/kg)"]
  },
  {
    stem: "Using the Pediatric Assessment Triangle (PAT), you observe a 3-year-old with normal appearance, increased work of breathing (nasal flaring, retractions), and normal circulation to skin. What is your assessment?",
    options: ["Respiratory distress", "Respiratory failure", "Compensated shock", "Cardiopulmonary failure"],
    correctAnswer: 0,
    rationaleLong: "The Pediatric Assessment Triangle (PAT) assesses three components: Appearance (TICLS: Tone, Interactivity, Consolability, Look/gaze, Speech/cry), Work of Breathing, and Circulation to Skin. This child has: normal appearance (alert, interactive), abnormal work of breathing (nasal flaring, retractions), and normal circulation (good skin color/perfusion). This pattern — normal appearance + increased WOB + normal circulation — indicates RESPIRATORY DISTRESS. If the appearance were abnormal (indicating altered mental status), it would suggest respiratory failure. Compensated shock would show normal appearance with abnormal circulation. The PAT is a rapid 'across the room' assessment tool that guides the urgency and direction of further evaluation and treatment.",
    learningObjective: "Apply the Pediatric Assessment Triangle to classify pediatric emergencies",
    blueprintCategory: "Pediatric/PALS",
    subtopic: "Pediatric Assessment Triangle",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "The PAT distinguishes respiratory distress (normal appearance) from respiratory failure (abnormal appearance) — this is critical",
    clinicalPearls: ["PAT: Appearance + Work of Breathing + Circulation to Skin", "Normal appearance + abnormal WOB = respiratory distress", "Abnormal appearance + abnormal WOB = respiratory failure"],
    safetyNote: "Respiratory distress can rapidly progress to respiratory failure in children — monitor closely and treat aggressively",
    distractorRationales: ["Respiratory failure would show abnormal appearance (altered mental status)", "Compensated shock shows normal appearance with abnormal circulation, not breathing", "Cardiopulmonary failure shows abnormal appearance with both abnormal WOB and circulation"]
  },
];

const obScenarios: ParamedicQuestion[] = [
  {
    stem: "A 32-year-old female at 39 weeks gestation is crowning with the baby's head visible at the perineum. Delivery is imminent. After the head delivers, you notice the umbilical cord is wrapped around the baby's neck. What should you do?",
    options: ["Push the baby's head back in and transport immediately", "Attempt to slip the cord over the baby's head; if unable, clamp and cut the cord", "Pull firmly on the cord to remove it", "Have the mother stop pushing and wait for ALS backup"],
    correctAnswer: 1,
    rationaleLong: "A nuchal cord (umbilical cord wrapped around the baby's neck) is found in approximately 20-30% of deliveries. The first attempt should be to gently slip the cord over the baby's head. If the cord is too tight to slip over the head, it should be double-clamped and cut between the clamps, then unwrapped from the neck to allow delivery to proceed. Pushing the baby's head back is never appropriate and could cause injury. Pulling on the cord risks tearing the cord or avulsing it from the placenta, causing hemorrhage. Delaying delivery while waiting for backup puts both mother and baby at risk — this is a time-critical situation that the paramedic must manage. After managing the nuchal cord, continue with normal delivery procedures.",
    learningObjective: "Manage a nuchal cord during field delivery",
    blueprintCategory: "OB Emergencies",
    subtopic: "Normal Delivery",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may panic and try to push the baby back — this is never appropriate once the head has delivered",
    clinicalPearls: ["Nuchal cord occurs in 20-30% of deliveries — it is common", "First: try to slip over the head; if unable: clamp × 2 and cut", "Proceed with normal delivery after managing the nuchal cord"],
    safetyNote: "Never pull on the umbilical cord — this can cause cord rupture, placental abruption, or uterine inversion",
    distractorRationales: ["Pushing the head back risks injury and is never appropriate once the head has delivered", "Pulling on the cord can tear it or cause placental abruption", "Waiting for backup delays management of a time-critical situation"]
  },
  {
    stem: "A 28-year-old female at 36 weeks gestation is having a seizure. Her BP is 198/120. She has no history of seizure disorder. What is the MOST likely diagnosis and FIRST-line treatment?",
    options: ["Epileptic seizure — lorazepam 4 mg IV", "Eclampsia — magnesium sulfate 4-6 g IV over 20 minutes", "Stroke — rapid transport and stroke alert", "Hypoglycemia — dextrose 50% IV"],
    correctAnswer: 1,
    rationaleLong: "Seizures in a third-trimester pregnant patient with severe hypertension (BP 198/120) and no seizure history is eclampsia until proven otherwise. Eclampsia is the occurrence of seizures in a patient with preeclampsia (hypertension + proteinuria in pregnancy). The first-line treatment is magnesium sulfate 4-6 g IV over 15-20 minutes, followed by a maintenance infusion of 1-2 g/hour. Magnesium sulfate is superior to benzodiazepines and phenytoin for eclamptic seizures because it addresses the underlying pathophysiology. Benzodiazepines may stop the seizure but do not prevent recurrence. Additional management includes left lateral positioning (to prevent aortocaval compression), high-flow oxygen, and transport to a facility with obstetric capability.",
    learningObjective: "Recognize and treat eclampsia with appropriate first-line medication",
    blueprintCategory: "OB Emergencies",
    subtopic: "Eclampsia",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may default to benzodiazepines for seizures, but magnesium sulfate is the specific treatment for eclampsia",
    clinicalPearls: ["Seizures + hypertension + third trimester = eclampsia", "Magnesium sulfate is first-line for eclamptic seizures", "Position the patient in left lateral decubitus to relieve aortocaval compression"],
    safetyNote: "Monitor for magnesium toxicity: loss of deep tendon reflexes, respiratory depression, hypotension — have calcium gluconate ready as the antidote",
    distractorRationales: ["Benzodiazepines may stop the seizure but do not prevent recurrence and are not first-line for eclampsia", "While stroke is possible, the clinical context strongly suggests eclampsia", "Hypoglycemia would need to be checked but severe hypertension in pregnancy with seizures is eclampsia"]
  },
  {
    stem: "During a field delivery, the baby's head has delivered but the shoulders are stuck behind the pubic symphysis despite gentle downward traction. What is this complication called, and what is the FIRST maneuver to attempt?",
    options: ["Cord prolapse — elevate presenting part", "Shoulder dystocia — McRoberts maneuver (hyperflex mother's thighs against abdomen)", "Breech presentation — apply gentle upward traction", "Placental abruption — transport immediately"],
    correctAnswer: 1,
    rationaleLong: "Shoulder dystocia occurs when the anterior shoulder of the fetus becomes impacted behind the mother's pubic symphysis after delivery of the head. This is a true obstetric emergency with a window of approximately 5-7 minutes before fetal hypoxia leads to permanent neurological damage. The FIRST maneuver is the McRoberts maneuver: hyperflexion of the mother's thighs against her abdomen. This rotates the pubic symphysis superiorly and increases the functional diameter of the pelvic outlet. Suprapubic pressure (NOT fundal pressure) can be applied simultaneously to dislodge the anterior shoulder. If McRoberts fails, the Gaskin maneuver (hands and knees position) or Rubin maneuver (rotating the anterior shoulder) may be attempted. NEVER apply excessive traction on the fetal head or neck — this can cause brachial plexus injury (Erb's palsy).",
    learningObjective: "Recognize and manage shoulder dystocia using the McRoberts maneuver",
    blueprintCategory: "OB Emergencies",
    subtopic: "Normal Delivery",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may apply fundal pressure thinking it will push the baby out — fundal pressure is CONTRAINDICATED and can worsen impaction",
    clinicalPearls: ["McRoberts maneuver: hyperflex thighs against abdomen — first-line for shoulder dystocia", "Apply suprapubic pressure, NEVER fundal pressure", "Excessive traction on the fetal head causes brachial plexus injury (Erb's palsy)"],
    safetyNote: "NEVER apply fundal pressure during shoulder dystocia — it worsens impaction and can cause uterine rupture",
    distractorRationales: ["Cord prolapse involves the umbilical cord presenting before the baby, not stuck shoulders", "This is not a breech presentation — the head has already delivered", "Placental abruption is a separate condition involving premature placental separation"]
  },
  {
    stem: "A mother has just delivered a baby in the field. Two minutes after delivery, the placenta has not yet delivered and the mother begins bleeding heavily from the vagina, soaking through multiple pads. What is the MOST appropriate prehospital management?",
    options: ["Pull on the umbilical cord to deliver the placenta quickly", "Fundal massage, IV fluid bolus, and rapid transport", "Pack the vagina with gauze to control bleeding", "Administer oxytocin 10 units IV push"],
    correctAnswer: 1,
    rationaleLong: "Postpartum hemorrhage (PPH) is defined as blood loss >500 mL after vaginal delivery. The most common cause is uterine atony (failure of the uterus to contract after delivery). Prehospital management includes: firm fundal massage (place one hand on the lower abdomen and massage the uterine fundus in a circular motion to stimulate contraction), establishing IV access with a large-bore catheter, and administering an IV fluid bolus of normal saline. Rapid transport to a facility with obstetric capability is essential. NEVER pull on the umbilical cord to hasten placental delivery — this can cause cord avulsion, retained placenta, or uterine inversion. Vaginal packing is not recommended as it can mask ongoing hemorrhage. Oxytocin should be administered as a slow infusion (not IV push), if available per local protocol.",
    learningObjective: "Manage postpartum hemorrhage with appropriate prehospital interventions",
    blueprintCategory: "OB Emergencies",
    subtopic: "Postpartum Hemorrhage",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Pulling on the cord seems logical to 'stop the bleeding by getting the placenta out' but this causes uterine inversion — a lethal complication",
    clinicalPearls: ["Fundal massage is the first-line treatment for uterine atony causing PPH", "PPH defined as >500 mL blood loss after vaginal delivery", "The placenta typically delivers within 30 minutes — do not rush it"],
    safetyNote: "NEVER pull on the umbilical cord — this can cause uterine inversion, a life-threatening emergency",
    distractorRationales: ["Pulling on the cord risks cord avulsion, retained placenta fragments, or uterine inversion", "Vaginal packing masks ongoing hemorrhage and does not treat the cause", "Oxytocin IV push can cause dangerous hypotension — it should be given as a slow infusion"]
  },
];

const airwayScenarios: ParamedicQuestion[] = [
  {
    stem: "You are ventilating an apneic patient with a BVM. Despite a good mask seal and proper head positioning, the chest is not rising. What should you try NEXT?",
    options: ["Increase the force of bag squeezes", "Reposition the airway using jaw thrust and reassess", "Immediately proceed to endotracheal intubation", "Insert a supraglottic airway device"],
    correctAnswer: 1,
    rationaleLong: "When BVM ventilation is ineffective (no chest rise despite good mask seal), the FIRST troubleshooting step is to reposition the airway. The most common cause of failed BVM ventilation is inadequate airway positioning. The jaw thrust maneuver lifts the mandible forward, pulling the tongue away from the posterior pharynx and opening the airway. Before escalating to more invasive interventions, basic airway maneuvers should be optimized. Increasing squeeze force can cause gastric insufflation without improving ventilation if the airway is obstructed. Proceeding to intubation without optimizing BVM ventilation is premature. A supraglottic airway may be needed but reposition should be attempted first as it is the simplest and fastest intervention.",
    learningObjective: "Troubleshoot failed BVM ventilation using systematic approach",
    blueprintCategory: "Airway Management",
    subtopic: "BVM Ventilation",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may want to escalate to advanced airways when simple repositioning would solve the problem",
    clinicalPearls: ["No chest rise with BVM → reposition airway first", "Jaw thrust is the most effective maneuver for opening the airway in unconscious patients", "Two-person BVM technique improves both seal and ventilation effectiveness"],
    safetyNote: "Forcing ventilations with poor positioning causes gastric insufflation, increasing aspiration risk",
    distractorRationales: ["Increased force causes gastric insufflation if the airway is obstructed", "Intubation is premature before optimizing basic airway maneuvers", "Supraglottic airway may be needed but simple repositioning should be tried first"]
  },
  {
    stem: "After intubating a patient, you auscultate breath sounds only over the right lung field with absent sounds on the left. ETCO2 shows a normal waveform with a value of 38 mmHg. What is the MOST likely problem?",
    options: ["Esophageal intubation", "Right mainstem bronchus intubation", "Left tension pneumothorax", "Equipment malfunction"],
    correctAnswer: 1,
    rationaleLong: "The presence of a normal ETCO2 waveform (38 mmHg) confirms the tube IS in the trachea, ruling out esophageal intubation. Breath sounds present on the right but absent on the left with confirmed tracheal placement indicates the ETT has been advanced too far into the right mainstem bronchus. The right mainstem bronchus branches off at a less acute angle than the left, making right mainstem intubation the most common malposition. The fix is to deflate the cuff, withdraw the tube 1-2 cm, reinflate the cuff, and reassess breath sounds bilaterally. A left tension pneumothorax is possible but would also show hemodynamic changes and the ETCO2 might be affected. Equipment malfunction would not cause unilateral breath sounds.",
    learningObjective: "Identify and correct right mainstem bronchus intubation",
    blueprintCategory: "Airway Management",
    subtopic: "Endotracheal Intubation",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "multiple-choice",
    examTrap: "Normal ETCO2 rules out esophageal intubation — the tube IS in the airway, just too deep",
    clinicalPearls: ["Right mainstem intubation: most common ETT malposition", "Normal ETCO2 + unilateral breath sounds = too deep, not wrong location", "Standard ETT depth at teeth: 21 cm for females, 23 cm for males"],
    safetyNote: "After any tube adjustment, re-confirm placement with ETCO2 and bilateral breath sounds",
    distractorRationales: ["Normal ETCO2 confirms tracheal placement — this is NOT esophageal intubation", "Left tension pneumothorax is less likely with normal ETCO2 and no hemodynamic changes", "Equipment malfunction does not cause unilateral breath sounds with normal ETCO2"]
  },
  {
    stem: "You need to perform RSI on a trauma patient with a suspected difficult airway. Which induction agent is PREFERRED for a hypotensive trauma patient (BP 78/50)?",
    options: ["Propofol", "Etomidate", "Ketamine", "Thiopental"],
    correctAnswer: 2,
    rationaleLong: "Ketamine is the preferred RSI induction agent for hypotensive trauma patients because it maintains hemodynamic stability through sympathomimetic effects (releases endogenous catecholamines). Ketamine increases heart rate and blood pressure, which is beneficial in patients who are already hypotensive. It also preserves respiratory drive and airway reflexes better than other induction agents. Propofol causes significant dose-dependent hypotension through vasodilation and myocardial depression — it can be fatal in a hypotensive patient. Etomidate is hemodynamically neutral but has been associated with adrenal suppression. Thiopental is a barbiturate that causes profound hypotension and is rarely used in modern RSI.",
    learningObjective: "Select the appropriate RSI induction agent based on patient hemodynamic status",
    blueprintCategory: "Airway Management",
    subtopic: "RSI Technique",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Etomidate is often considered 'hemodynamically neutral' but ketamine is PREFERRED in hypotension because it actually supports blood pressure",
    clinicalPearls: ["Ketamine: maintains/increases BP — preferred in hypotensive patients", "Propofol: causes hypotension — avoid in hemodynamically unstable patients", "Ketamine dose for RSI induction: 1-2 mg/kg IV"],
    safetyNote: "Propofol in a hypotensive patient can cause cardiovascular collapse — ketamine is the safest choice",
    distractorRationales: ["Propofol causes significant hypotension through vasodilation and myocardial depression", "Etomidate is hemodynamically neutral but does not support blood pressure like ketamine", "Thiopental causes profound hypotension and is largely obsolete for RSI"]
  },
  {
    stem: "What is the significance of an ETCO2 reading of 15 mmHg during CPR?",
    options: ["The patient has ROSC", "CPR quality is adequate", "CPR quality is inadequate and compressions should be improved", "The ET tube is in the esophagus"],
    correctAnswer: 2,
    rationaleLong: "During CPR, ETCO2 reflects the quality of chest compressions and cardiac output generated. An ETCO2 of 15 mmHg during CPR indicates inadequate compression quality. The target ETCO2 during CPR should be at least 20 mmHg, with values >20 mmHg correlating with better CPR quality and higher likelihood of ROSC. When ETCO2 is low during CPR, the team should: increase compression depth (at least 2 inches / 5 cm in adults), increase compression rate (100-120/min), ensure complete chest recoil, minimize interruptions, and rotate compressors if fatigued. A sudden rise in ETCO2 to >40 mmHg during CPR suggests ROSC. Esophageal intubation would show ETCO2 near zero, not 15 mmHg.",
    learningObjective: "Use ETCO2 as a real-time indicator of CPR quality",
    blueprintCategory: "Airway Management",
    subtopic: "Capnography",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "multiple-choice",
    examTrap: "Students may think any ETCO2 reading during CPR means things are going well — but <20 mmHg indicates poor CPR quality",
    clinicalPearls: ["Target ETCO2 during CPR: >20 mmHg", "ETCO2 <20 during CPR → improve compression quality", "Sudden ETCO2 rise to >40 mmHg suggests ROSC"],
    safetyNote: "Low ETCO2 during CPR is a red flag for poor outcomes — immediately address compression quality",
    distractorRationales: ["ROSC would show a sudden rise in ETCO2 to >40 mmHg, not a reading of 15", "ETCO2 of 15 mmHg during CPR indicates INADEQUATE, not adequate, compression quality", "Esophageal intubation would show near-zero ETCO2, not 15 mmHg"]
  },
];

const assessmentScenarios: ParamedicQuestion[] = [
  {
    stem: "You arrive at the scene of a reported shooting. As you approach the location, what is your FIRST priority?",
    options: ["Immediately enter to assess the patient", "Ensure scene safety — confirm law enforcement has secured the scene", "Put on personal protective equipment", "Call for additional ambulances"],
    correctAnswer: 1,
    rationaleLong: "Scene safety is ALWAYS the first priority in EMS, and this is especially critical for scenes involving violence (shootings, stabbings, assaults). The paramedic must confirm that law enforcement has secured the scene before entering. Entering an unsecured shooting scene puts the paramedic at risk of becoming a victim, which helps no one. The scene safety assessment includes: identifying hazards (active shooter, bystanders with weapons), ensuring police have cleared the area, identifying safe approach routes, and staging at a safe distance until cleared. PPE is important but comes after scene safety confirmation. Patient assessment and requesting resources come after ensuring a safe scene.",
    learningObjective: "Prioritize scene safety in potentially dangerous EMS responses",
    blueprintCategory: "Assessment",
    subtopic: "Scene Size-Up",
    difficulty: 1,
    cognitiveLevel: "recall",
    questionType: "multiple-choice",
    examTrap: "Students may feel urgency to help the patient immediately, but an injured paramedic cannot help anyone",
    clinicalPearls: ["Scene safety is ALWAYS the first priority — before patient contact", "Violent scenes require law enforcement clearance before EMS entry", "Stage at a safe distance until the scene is secured"],
    safetyNote: "NEVER enter an unsecured scene involving violence — you cannot help the patient if you become a victim",
    distractorRationales: ["Entering an unsecured shooting scene puts the paramedic at risk", "PPE is important but scene safety comes first", "Requesting resources is appropriate but after ensuring scene safety"]
  },
  {
    stem: "A patient opens their eyes to pain, makes incomprehensible sounds, and withdraws from painful stimuli. What is their Glasgow Coma Scale score?",
    options: ["GCS 6", "GCS 8", "GCS 9", "GCS 10"],
    correctAnswer: 1,
    rationaleLong: "The Glasgow Coma Scale has three components: Eye Opening (E), Verbal Response (V), and Motor Response (M). Eye opening to pain = E2. Incomprehensible sounds = V2. Withdrawal from pain = M4. Total GCS = 2 + 2 + 4 = 8. A GCS of 8 or less indicates severe brain injury and is the threshold for considering endotracheal intubation (GCS ≤ 8, intubate). The GCS scale ranges from 3 (minimum) to 15 (fully alert). Eye: 4=spontaneous, 3=to voice, 2=to pain, 1=none. Verbal: 5=oriented, 4=confused, 3=inappropriate words, 2=incomprehensible sounds, 1=none. Motor: 6=obeys commands, 5=localizes pain, 4=withdrawal, 3=abnormal flexion, 2=extension, 1=none.",
    learningObjective: "Calculate the Glasgow Coma Scale score accurately",
    blueprintCategory: "Assessment",
    subtopic: "Glasgow Coma Scale",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students commonly confuse 'incomprehensible sounds' (V2) with 'inappropriate words' (V3) and 'withdrawal' (M4) with 'localization' (M5)",
    clinicalPearls: ["GCS ≤ 8 = consider intubation", "E2 + V2 + M4 = GCS 8", "Always report individual components (E2V2M4) in addition to the total"],
    safetyNote: "A GCS of 8 indicates the patient cannot protect their airway — prepare for advanced airway management",
    distractorRationales: ["GCS 6 would require lower component scores", "GCS 9 is incorrect — the components sum to 8", "GCS 10 would require higher scores on one or more components"]
  },
  {
    stem: "You are obtaining a SAMPLE history from a patient with chest pain. What does the 'A' in SAMPLE stand for?",
    options: ["Assessment findings", "Allergies", "Age", "Ambulance response"],
    correctAnswer: 1,
    rationaleLong: "In the SAMPLE history mnemonic, 'A' stands for Allergies. SAMPLE is a systematic approach to obtaining a focused patient history: S = Signs and Symptoms (what the patient is experiencing), A = Allergies (medications, foods, environmental), M = Medications (current medications including OTC, herbal), P = Past medical/surgical history, L = Last oral intake (food/drink), E = Events leading up to the present illness/injury. Knowing allergies is critical before administering any medication — giving aspirin to an aspirin-allergic patient or a medication to which the patient has a known allergy can cause anaphylaxis or other severe reactions. SAMPLE should be obtained for every patient encounter and documented thoroughly.",
    learningObjective: "Apply the SAMPLE history mnemonic for systematic patient assessment",
    blueprintCategory: "Assessment",
    subtopic: "Patient History",
    difficulty: 1,
    cognitiveLevel: "recall",
    questionType: "multiple-choice",
    examTrap: "This is a basic knowledge question that students should not miss — know all components of SAMPLE",
    clinicalPearls: ["SAMPLE: Signs/Symptoms, Allergies, Medications, Past history, Last oral intake, Events", "Always ask about allergies before administering ANY medication", "Include drug allergies, food allergies, and environmental allergies"],
    safetyNote: "Failing to check allergies before medication administration can cause anaphylaxis — always ask",
    distractorRationales: ["Assessment findings are part of the physical exam, not the SAMPLE history", "Age is demographic information, not a SAMPLE component", "Ambulance response is not part of the SAMPLE mnemonic"]
  },
  {
    stem: "A 55-year-old male has the following vital signs: HR 92, BP 142/88, RR 18, SpO2 96%, Temp 98.6°F. He has no complaints and is alert and oriented. How would you document the blood pressure classification?",
    options: ["Normal blood pressure", "Stage 1 hypertension", "Stage 2 hypertension", "Hypertensive crisis"],
    correctAnswer: 1,
    rationaleLong: "According to the ACC/AHA blood pressure guidelines, a BP of 142/88 is classified as Stage 1 hypertension (systolic 130-139 or diastolic 80-89 mmHg). While the systolic of 142 exceeds the Stage 1 range, the diastolic of 88 falls within Stage 1. Normal BP is <120/<80. Elevated BP is 120-129/<80. Stage 1 hypertension is 130-139/80-89. Stage 2 hypertension is ≥140/≥90. Hypertensive crisis is >180/>120. Note: the 2017 guidelines lowered the threshold for hypertension from 140/90 to 130/80. In the field, this reading should be noted but is not an emergency in an asymptomatic patient. Serial BP measurements should be obtained.",
    learningObjective: "Classify blood pressure readings according to current guidelines",
    blueprintCategory: "Assessment",
    subtopic: "Vitals Interpretation",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "The 2017 guidelines lowered the hypertension threshold — students using the old 140/90 cutoff may misclassify",
    clinicalPearls: ["Normal: <120/<80; Elevated: 120-129/<80; Stage 1: 130-139/80-89; Stage 2: ≥140/≥90", "Hypertensive crisis: >180/>120 with or without organ damage", "A single elevated reading does not diagnose chronic hypertension"],
    safetyNote: "Asymptomatic Stage 1 hypertension does not require emergency treatment in the field",
    distractorRationales: ["Normal BP is <120/<80 — this patient's reading exceeds both thresholds", "Stage 2 is ≥140/≥90 — while systolic qualifies, the classification follows the higher category", "Hypertensive crisis requires BP >180/>120"]
  },
];

const operationsScenarios: ParamedicQuestion[] = [
  {
    stem: "You arrive at a mass casualty incident (MCI) with 20 patients. Using the START triage system, a patient is walking toward you with minor cuts. What triage category should this patient receive?",
    options: ["Red (Immediate)", "Yellow (Delayed)", "Green (Minor/Walking Wounded)", "Black (Expectant/Deceased)"],
    correctAnswer: 2,
    rationaleLong: "In the START (Simple Triage and Rapid Treatment) triage system, the FIRST step is to direct all walking patients to a designated area — these patients are automatically categorized as GREEN (Minor/Walking Wounded). This is the most efficient first step because it immediately sorts a large group without individual assessment. Patients who cannot walk are then assessed for breathing, circulation (radial pulse or capillary refill), and mental status. Walking wounded may have injuries but can walk, indicating they are not immediately life-threatened. They will be reassessed later when resources allow. This system allows rapid sorting of large numbers of patients in a disaster scenario.",
    learningObjective: "Apply the START triage system in mass casualty incidents",
    blueprintCategory: "Operations",
    subtopic: "MCI/Triage",
    difficulty: 1,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may want to assess each patient individually — but START triage for walking patients is automatic Green classification",
    clinicalPearls: ["START triage: walking = Green (first step)", "Non-walking: assess RPM — Respirations, Perfusion, Mental status", "Green patients must be reassessed as resources become available"],
    safetyNote: "Walking wounded may have occult injuries (internal bleeding, head injuries) — reassess when possible",
    distractorRationales: ["Red is for immediate life-threats who cannot walk", "Yellow is for patients with serious but not immediately life-threatening injuries who cannot walk", "Black is for patients who are dead or have non-survivable injuries"]
  },
  {
    stem: "While working at a hazardous materials incident, you notice a placard on the overturned tanker showing the number 1017. Using the ERG (Emergency Response Guidebook), what does this indicate and what is your role as a paramedic?",
    options: ["You should enter the hot zone to rescue victims", "You should remain in the cold zone and prepare for patient decontamination", "You should enter the warm zone with SCBA", "You should begin treating patients in the hot zone"],
    correctAnswer: 1,
    rationaleLong: "UN placard 1017 indicates chlorine gas, a toxic and corrosive substance. As a paramedic trained to the awareness level, your role at a hazmat incident is to: recognize the hazardous material, isolate the area, deny entry, and notify the appropriate hazmat response team. Paramedics should remain in the COLD ZONE (safe area) and prepare for receiving patients AFTER they have been decontaminated by hazmat-trained personnel. The hot zone is where the hazardous material is located and requires specialized PPE (Level A suits). The warm zone is the decontamination corridor. Entering the hot or warm zone without proper hazmat training and PPE puts the paramedic at risk of contamination and becoming a victim. Patient treatment begins only after decontamination is complete.",
    learningObjective: "Define the paramedic's role at hazardous materials incidents within proper zone boundaries",
    blueprintCategory: "Operations",
    subtopic: "Hazmat Awareness",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may feel pressured to enter the scene to help victims — but untrained entry creates more victims",
    clinicalPearls: ["Paramedics operate in the COLD zone at hazmat incidents", "Treat patients only AFTER decontamination", "ERG is the primary field reference for hazmat identification"],
    safetyNote: "NEVER enter a hazmat hot zone without proper training and PPE — you will become a victim requiring rescue",
    distractorRationales: ["Paramedics without hazmat training should never enter the hot zone", "SCBA alone is insufficient — full Level A protection is needed in the hot zone", "Treating patients in the hot zone exposes the paramedic to the hazardous material"]
  },
  {
    stem: "You are dispatched to a vehicle accident where a patient is trapped in the vehicle. The fire department is performing extrication. What is the paramedic's PRIMARY role during the extrication process?",
    options: ["Operating the hydraulic extrication tools", "Providing patient care and monitoring during extrication", "Directing fire department operations", "Securing the vehicle against movement"],
    correctAnswer: 1,
    rationaleLong: "During vehicle extrication, the paramedic's primary role is providing patient care and monitoring. This includes: maintaining cervical spine stabilization, monitoring the patient's airway, breathing, and circulation, providing pain management, establishing IV access when possible, covering the patient with a protective blanket during cutting operations, and communicating patient status changes to the extrication team. Operating hydraulic tools (Jaws of Life) is the responsibility of fire/rescue personnel who are trained in their use. Directing fire operations is the responsibility of the fire incident commander. Securing the vehicle (cribbing, stabilization) is done by fire/rescue. The paramedic focuses on the patient while fire handles the vehicle.",
    learningObjective: "Define the paramedic's role during vehicle extrication operations",
    blueprintCategory: "Operations",
    subtopic: "Vehicle Extrication",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "multiple-choice",
    examTrap: "Students may think paramedics should help with extrication — the paramedic's role is patient care",
    clinicalPearls: ["Paramedic role during extrication: patient care and monitoring", "Cover the patient during cutting operations to prevent injury from debris", "Communicate any patient status changes to the extrication team"],
    safetyNote: "Wear appropriate PPE during extrication — hard hat, eye protection, gloves, and turnout gear if available",
    distractorRationales: ["Operating hydraulic tools is the fire department's responsibility", "Directing fire operations is the fire IC's role, not the paramedic's", "Vehicle stabilization is performed by trained fire/rescue personnel"]
  },
];

const legalScenarios: ParamedicQuestion[] = [
  {
    stem: "A competent adult patient with chest pain refuses transport to the hospital against your advice. What is the MOST legally appropriate action?",
    options: ["Transport the patient against their will", "Have the patient sign a refusal of care form after thorough informed refusal documentation", "Leave the scene without documentation", "Call law enforcement to force the patient to go"],
    correctAnswer: 1,
    rationaleLong: "A competent adult has the legal right to refuse medical treatment, even if the refusal may result in harm or death. The paramedic must: 1) Ensure the patient is competent (alert, oriented, not intoxicated, understands consequences), 2) Inform the patient of the risks of refusal including possible death, 3) Document the informed refusal thoroughly including assessment findings, risks explained, and that the patient verbalized understanding, 4) Have the patient sign a refusal form (ideally witnessed), 5) Advise the patient to call 911 if symptoms worsen, and 6) Report to medical control per protocol. Transporting against the patient's will constitutes battery and false imprisonment. Leaving without documentation creates liability. Law enforcement involvement is only appropriate if the patient lacks capacity.",
    learningObjective: "Manage patient refusal of care with proper legal documentation",
    blueprintCategory: "Legal/Ethics",
    subtopic: "Consent/Refusal",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may think they can override a competent patient's refusal for their own good — this is battery",
    clinicalPearls: ["Competent adults can refuse any and all treatment", "Document: assessment, risks explained, patient understanding, alternatives offered", "Contact medical control for guidance on challenging refusal situations"],
    safetyNote: "A refusal is only valid if the patient is truly competent — assess for intoxication, head injury, or altered mental status that would invalidate consent",
    distractorRationales: ["Forced transport of a competent adult is battery and false imprisonment", "Leaving without documentation creates significant legal liability", "Law enforcement cannot force a competent adult to accept medical care"]
  },
  {
    stem: "While treating a 14-year-old who was in a bicycle accident, the child's parents are not present. No one with legal authority is available. Can you treat this patient?",
    options: ["No, you must wait for parental consent", "Yes, under implied consent for minors in emergencies", "No, you need a court order first", "Yes, but only if the child verbally consents"],
    correctAnswer: 1,
    rationaleLong: "Under the doctrine of implied consent, emergency medical treatment can be provided to minors when a parent or legal guardian is not available to provide express consent and the minor requires emergency care. The law presumes that a reasonable parent would consent to emergency treatment for their child. This applies to situations where: the patient is a minor, a life- or limb-threatening emergency exists, the parent/guardian is not available to consent, and delaying treatment to obtain consent would harm the patient. This is the same legal doctrine that allows treatment of unconscious adult patients. The paramedic should document that the parent/guardian was not available and that treatment was provided under implied consent. Non-emergency situations (minor injuries) may require waiting for parental consent.",
    learningObjective: "Apply implied consent principles for treating minors in emergency situations",
    blueprintCategory: "Legal/Ethics",
    subtopic: "Consent/Refusal",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may hesitate to treat a minor without parental consent — but implied consent covers emergency treatment",
    clinicalPearls: ["Implied consent covers emergency treatment of minors when parents are unavailable", "Document that parents were not available and treatment was necessary", "Non-emergency situations may require parental consent"],
    safetyNote: "When in doubt, err on the side of treatment for minors in emergency situations — you are legally protected under implied consent",
    distractorRationales: ["Waiting for consent when emergency treatment is needed could constitute negligence", "Court orders are not required for emergency medical treatment", "A minor's verbal consent alone does not meet legal requirements — implied consent is the legal basis"]
  },
  {
    stem: "You respond to a call where you suspect a 4-year-old child is being physically abused. The parent is present and hostile. What is your legal obligation?",
    options: ["Confront the parent about the suspected abuse", "Document your findings and report to the appropriate authorities (mandatory reporting)", "Only report if the child discloses abuse", "Report only if injuries are life-threatening"],
    correctAnswer: 1,
    rationaleLong: "Paramedics are mandatory reporters of suspected child abuse in all 50 states and Canadian provinces. This means you have a LEGAL OBLIGATION to report suspected abuse to the appropriate authorities (child protective services, law enforcement) — you do NOT need proof, only reasonable suspicion. You should: document objective findings thoroughly (injury patterns, statements made, child's demeanor, parent's behavior), report to the appropriate agency, and ensure the child's immediate safety. You should NOT confront the parent (this can escalate the situation and endanger the child and yourself), and you should NOT wait for the child to disclose abuse (children often cannot or will not disclose). The duty to report exists regardless of injury severity. Failure to report suspected abuse when you have reasonable suspicion can result in criminal charges and civil liability.",
    learningObjective: "Understand mandatory reporting obligations for suspected child abuse",
    blueprintCategory: "Legal/Ethics",
    subtopic: "Mandatory Reporting",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "multiple-choice",
    examTrap: "Students may think they need 'proof' of abuse — they only need reasonable suspicion to trigger the mandatory reporting obligation",
    clinicalPearls: ["Mandatory reporting requires suspicion, not proof", "Document objectively: injuries, patterns, statements, behaviors", "Report to child protective services and/or law enforcement"],
    safetyNote: "Do NOT confront the suspected abuser — this can escalate violence and endanger the child and the paramedic",
    distractorRationales: ["Confronting the parent can escalate the situation and endanger everyone", "Waiting for child disclosure is not required — suspicion alone triggers reporting", "All suspected abuse must be reported regardless of injury severity"]
  },
];

export function getAllParamedicQuestions(): ParamedicQuestion[] {
  const allQuestions: ParamedicQuestion[] = [];

  allQuestions.push(...traumaQuestions);
  allQuestions.push(...medicalScenarios);
  allQuestions.push(...cardiacScenarios);
  allQuestions.push(...pediatricScenarios);
  allQuestions.push(...obScenarios);
  allQuestions.push(...airwayScenarios);
  allQuestions.push(...assessmentScenarios);
  allQuestions.push(...operationsScenarios);
  allQuestions.push(...legalScenarios);

  for (const drug of PARAMEDIC_DRUGS) {
    for (let v = 0; v < 5; v++) {
      allQuestions.push(generateDrugQuestion(drug, v));
    }
  }

  for (const ecg of ECG_PATTERNS) {
    for (let v = 0; v < 2; v++) {
      allQuestions.push(generateECGQuestion(ecg, v));
    }
  }

  for (const vital of VITAL_PATTERNS) {
    for (let v = 0; v < 2; v++) {
      allQuestions.push(generateVitalSignQuestion(vital, v));
    }
  }

  return allQuestions;
}
