import { OSCESkillStation } from "./osce-skills-data";

export const osceSkillStations5: OSCESkillStation[] = [
  {
    id: "cardiac-chest-pain",
    title: "Cardiac Chest Pain Assessment",
    category: "Acute Care",
    difficulty: "Advanced",
    icon: "Heart",
    description: "Perform a rapid, systematic assessment of a patient presenting with acute chest pain to differentiate cardiac from non-cardiac causes and initiate appropriate interventions.",
    scenarioIntro: "You are a nurse in the emergency department. A 64-year-old male presents with sudden onset substernal chest pain radiating to his left arm, rated 8/10, associated with diaphoresis and nausea. He has a history of hypertension, hyperlipidemia, and type 2 diabetes. Vital signs: BP 158/94, HR 102, RR 22, SpO2 95%, Temp 37.0°C.",
    equipment: [
      "Cardiac monitor with 12-lead ECG capability",
      "Stethoscope",
      "Blood pressure cuff",
      "Pulse oximeter",
      "IV start kit",
      "Oxygen delivery devices (nasal cannula, non-rebreather mask)",
      "Nitroglycerin (sublingual)",
      "Aspirin (chewable 325 mg)",
      "Morphine (as ordered)",
      "Normal saline IV fluid",
      "Crash cart nearby",
      "Documentation tools"
    ],
    steps: [
      { id: "ccp-1", instruction: "Perform hand hygiene, identify patient with two identifiers, and briefly introduce yourself.", rationale: "Patient safety standard. In acute presentations, rapid identification and introduction must occur simultaneously with assessment.", criticalStep: true },
      { id: "ccp-2", instruction: "Perform a rapid primary survey (Airway, Breathing, Circulation) and assess hemodynamic stability.", rationale: "Determines immediate life threats and guides urgency of intervention.", criticalStep: true },
      { id: "ccp-3", instruction: "Obtain a focused chest pain history using PQRST: Provocation, Quality, Region/Radiation, Severity, Timing.", rationale: "PQRST systematically characterizes the pain and helps differentiate cardiac from non-cardiac etiologies.", criticalStep: true },
      { id: "ccp-4", instruction: "Apply continuous cardiac monitoring and obtain a 12-lead ECG within 10 minutes of arrival.", rationale: "A 12-lead ECG within 10 minutes is a quality benchmark for chest pain assessment. ST-segment changes indicate myocardial ischemia or infarction.", criticalStep: true },
      { id: "ccp-5", instruction: "Assess vital signs including bilateral blood pressure if aortic dissection is suspected.", rationale: "A blood pressure difference greater than 20 mmHg between arms suggests aortic dissection, which contraindicates anticoagulation.", criticalStep: false },
      { id: "ccp-6", instruction: "Establish IV access with a large-bore catheter (18-gauge or larger) and draw cardiac biomarkers (troponin, CK-MB).", rationale: "IV access is essential for medication administration. Troponin is the most sensitive and specific biomarker for myocardial injury.", criticalStep: true },
      { id: "ccp-7", instruction: "Administer aspirin 325 mg chewable as ordered, confirming no allergy or active bleeding.", rationale: "Aspirin inhibits platelet aggregation and reduces mortality in acute coronary syndrome. Chewing accelerates absorption.", criticalStep: true },
      { id: "ccp-8", instruction: "Administer supplemental oxygen if SpO2 is below 94%.", rationale: "Oxygen therapy is indicated only when hypoxemia is present. Routine oxygen in normoxic ACS patients provides no benefit and may cause harm.", criticalStep: false },
      { id: "ccp-9", instruction: "Administer sublingual nitroglycerin as ordered, checking blood pressure before each dose.", rationale: "Nitroglycerin is a vasodilator that reduces preload and myocardial oxygen demand. Contraindicated if SBP < 90 mmHg or if phosphodiesterase inhibitors were used within 24-48 hours.", criticalStep: true },
      { id: "ccp-10", instruction: "Assess pain response after each intervention using the numeric pain scale.", rationale: "Serial pain assessment guides treatment effectiveness and escalation of care.", criticalStep: false },
      { id: "ccp-11", instruction: "Auscultate heart sounds for new murmurs, S3, or S4.", rationale: "A new murmur may indicate papillary muscle dysfunction or ventricular septal rupture. S3 suggests heart failure.", criticalStep: false },
      { id: "ccp-12", instruction: "Auscultate lung fields bilaterally for crackles.", rationale: "Bilateral crackles may indicate pulmonary edema secondary to left ventricular failure complicating ACS.", criticalStep: false },
      { id: "ccp-13", instruction: "Monitor for signs of cardiogenic shock: hypotension, tachycardia, altered mental status, cool and clammy skin.", rationale: "Cardiogenic shock complicates 5-8% of acute MI and carries high mortality. Early recognition enables timely intervention.", criticalStep: true },
      { id: "ccp-14", instruction: "Ensure the patient remains on bed rest and provide emotional support to reduce anxiety.", rationale: "Activity increases myocardial oxygen demand. Anxiety triggers catecholamine release, worsening ischemia.", criticalStep: false },
      { id: "ccp-15", instruction: "Document all findings, interventions, and patient responses systematically and prepare for potential cardiac catheterization.", rationale: "Accurate documentation ensures continuity of care and supports time-sensitive treatment decisions such as percutaneous coronary intervention.", criticalStep: false }
    ],
    commonErrors: [
      "Failing to obtain a 12-lead ECG within 10 minutes",
      "Administering nitroglycerin without checking blood pressure first",
      "Not asking about phosphodiesterase inhibitor use before nitroglycerin",
      "Forgetting to administer aspirin early",
      "Not assessing bilateral blood pressures when dissection is possible",
      "Administering oxygen to a normoxic patient routinely",
      "Failing to recognize signs of cardiogenic shock"
    ],
    passingCriteria: "All critical steps must be performed. Student must complete PQRST assessment, obtain ECG within 10 minutes, establish IV access, administer aspirin and nitroglycerin appropriately, and monitor for complications.",
    clinicalPearls: [
      "Remember MONA is no longer the standard. Current ACS management prioritizes aspirin, nitroglycerin, and anticoagulation based on ECG findings.",
      "Troponin takes 3-6 hours to elevate after myocardial injury. A negative initial troponin does not rule out MI.",
      "Women, elderly, and diabetic patients may present atypically: fatigue, dyspnea, nausea, or jaw/back pain instead of classic substernal chest pain.",
      "Door-to-balloon time for STEMI should be less than 90 minutes. Nursing efficiency in the initial assessment directly impacts this benchmark.",
      "Always check for contraindications to nitroglycerin: SBP < 90, right ventricular infarction, recent PDE5 inhibitor use."
    ],
    examLevel: "RN / Advanced",
    timeLimit: "15 minutes",
    candidateInstructions: "You will assess a patient presenting with acute chest pain. Perform a systematic assessment, initiate appropriate interventions, and communicate findings to the healthcare team. Verbalize your clinical reasoning throughout.",
    patientActorScript: "You are a 64-year-old male experiencing severe chest pain. Clutch your chest and appear distressed. Rate your pain as 8/10. Describe the pain as a heavy, crushing pressure behind your breastbone that radiates to your left arm. You feel nauseated and sweaty. You took a nitroglycerin at home with no relief. You have not taken any erectile dysfunction medications. When asked, report your medical history includes high blood pressure, high cholesterol, and diabetes.",
    examinerChecklist: [
      { action: "Performs hand hygiene and identifies patient", marks: 2 },
      { action: "Completes primary survey (ABC)", marks: 3 },
      { action: "Obtains PQRST chest pain history", marks: 5 },
      { action: "Applies cardiac monitor and obtains 12-lead ECG within 10 minutes", marks: 5 },
      { action: "Establishes IV access and draws cardiac biomarkers", marks: 4 },
      { action: "Administers aspirin with allergy check", marks: 4 },
      { action: "Administers nitroglycerin with BP check and contraindication screening", marks: 5 },
      { action: "Monitors for cardiogenic shock signs", marks: 3 },
      { action: "Auscultates heart and lung sounds", marks: 3 },
      { action: "Documents findings and communicates to team", marks: 2 }
    ],
    criticalFailCriteria: [
      "Fails to obtain 12-lead ECG within 10 minutes",
      "Administers nitroglycerin without checking blood pressure",
      "Fails to administer aspirin",
      "Does not establish IV access",
      "Fails to recognize or respond to signs of cardiogenic shock"
    ],
    examinerQuestions: [
      { question: "What are the classic ECG findings in a STEMI?", answer: "ST-segment elevation in two or more contiguous leads, with reciprocal ST depression in opposite leads. The leads involved indicate the territory of infarction." },
      { question: "When is nitroglycerin contraindicated?", answer: "Systolic blood pressure below 90 mmHg, right ventricular infarction, use of phosphodiesterase-5 inhibitors (sildenafil within 24 hours, tadalafil within 48 hours), and severe aortic stenosis." },
      { question: "What is the significance of a new S3 heart sound in this patient?", answer: "A new S3 indicates ventricular volume overload and suggests acute heart failure complicating the myocardial infarction." }
    ],
    teachingPoints: [
      "Time is muscle — every minute of coronary occlusion results in progressive myocardial necrosis",
      "The initial nursing assessment directly impacts door-to-balloon time and patient outcomes",
      "Atypical presentations are common in women, elderly, and diabetic patients — maintain a high index of suspicion",
      "Right ventricular infarction presents with hypotension, JVD, and clear lung fields — nitroglycerin and diuretics are contraindicated",
      "Serial troponin measurements at 0, 3, and 6 hours are standard to rule in or rule out myocardial injury"
    ]
  },
  {
    id: "myocardial-infarction",
    title: "Myocardial Infarction Recognition",
    category: "Acute Care",
    difficulty: "Advanced",
    icon: "Heart",
    description: "Recognize the clinical presentation of acute myocardial infarction, differentiate STEMI from NSTEMI, and initiate time-critical interventions.",
    scenarioIntro: "You are a nurse on a telemetry unit. A 71-year-old female patient with a history of hypertension and coronary artery disease suddenly develops severe chest tightness, diaphoresis, and dyspnea. Her telemetry shows new ST-segment elevation in leads II, III, and aVF. Vital signs: BP 92/60, HR 48, RR 24, SpO2 91%.",
    equipment: [
      "12-lead ECG machine",
      "Cardiac monitor",
      "Stethoscope",
      "Blood pressure cuff",
      "Pulse oximeter",
      "IV start kit with large-bore catheters",
      "Oxygen delivery devices",
      "Aspirin (chewable)",
      "Normal saline",
      "Emergency medications as ordered",
      "Crash cart",
      "Documentation tools"
    ],
    steps: [
      { id: "mi-1", instruction: "Recognize the acute change in patient status and call for help immediately.", rationale: "Acute MI is a medical emergency. Activating the response team ensures timely intervention.", criticalStep: true },
      { id: "mi-2", instruction: "Perform a rapid assessment: airway, breathing, circulation, and level of consciousness.", rationale: "Establishes immediate hemodynamic stability and identifies life-threatening complications.", criticalStep: true },
      { id: "mi-3", instruction: "Obtain a 12-lead ECG immediately and interpret ST-segment changes.", rationale: "ST elevation in leads II, III, aVF indicates an inferior STEMI. This triggers the STEMI activation protocol.", criticalStep: true },
      { id: "mi-4", instruction: "Notify the physician and activate the STEMI/cardiac catheterization lab protocol.", rationale: "Door-to-balloon time of less than 90 minutes is the treatment standard. Early notification of the cath lab team is essential.", criticalStep: true },
      { id: "mi-5", instruction: "Administer aspirin 325 mg chewable if not already given, confirming no contraindications.", rationale: "Aspirin reduces mortality in acute MI by inhibiting platelet aggregation.", criticalStep: true },
      { id: "mi-6", instruction: "Establish or verify large-bore IV access and initiate normal saline infusion.", rationale: "In inferior MI with hypotension, fluid resuscitation is the first-line treatment. Avoid nitroglycerin in right ventricular involvement.", criticalStep: true },
      { id: "mi-7", instruction: "Administer oxygen to maintain SpO2 above 94%.", rationale: "Hypoxemia worsens myocardial ischemia. Supplemental oxygen is indicated when SpO2 is below 94%.", criticalStep: false },
      { id: "mi-8", instruction: "Assess for signs of right ventricular infarction: hypotension, JVD, clear lung fields.", rationale: "Right ventricular infarction accompanies 30-50% of inferior MIs. It requires volume loading and avoidance of nitrates and diuretics.", criticalStep: true },
      { id: "mi-9", instruction: "Monitor heart rhythm continuously for bradycardia or heart block.", rationale: "Inferior MI commonly causes AV nodal blocks due to right coronary artery involvement. Atropine and transcutaneous pacing may be needed.", criticalStep: true },
      { id: "mi-10", instruction: "Draw serial cardiac biomarkers (troponin) and complete blood work as ordered.", rationale: "Troponin confirms myocardial necrosis. Serial measurements track the extent and timing of injury.", criticalStep: false },
      { id: "mi-11", instruction: "Assess and manage pain using morphine or analgesics as ordered, monitoring respiratory status.", rationale: "Pain increases catecholamine release and myocardial oxygen demand. Morphine also provides anxiolysis and reduces preload.", criticalStep: false },
      { id: "mi-12", instruction: "Keep the patient on strict bed rest, elevate the head of bed if tolerated, and maintain NPO status.", rationale: "Activity restriction minimizes myocardial oxygen demand. NPO status is maintained in case of cardiac catheterization.", criticalStep: false },
      { id: "mi-13", instruction: "Prepare the patient for cardiac catheterization: consent, shave site, remove jewelry, mark pulses.", rationale: "Preparation for PCI must be efficient to minimize door-to-balloon time.", criticalStep: false },
      { id: "mi-14", instruction: "Provide emotional support and brief education to the patient and family about the procedure.", rationale: "Acute MI is terrifying. Brief, calm explanation reduces anxiety and improves cooperation.", criticalStep: false },
      { id: "mi-15", instruction: "Document all interventions, times, and patient responses using SBAR format for handoff.", rationale: "Time-stamped documentation is essential for quality metrics and continuity during the cath lab handoff.", criticalStep: true }
    ],
    commonErrors: [
      "Delayed recognition of ST-segment elevation on monitor",
      "Administering nitroglycerin in inferior MI with right ventricular involvement",
      "Not activating the STEMI protocol immediately",
      "Failing to assess for right ventricular infarction signs",
      "Delayed aspirin administration",
      "Not monitoring for heart blocks in inferior MI",
      "Inadequate documentation of intervention times"
    ],
    passingCriteria: "All critical steps must be performed. Student must recognize the STEMI pattern, activate the protocol, administer aspirin, establish IV access, assess for RV infarction, and monitor for conduction abnormalities.",
    clinicalPearls: [
      "Inferior MI (leads II, III, aVF) is caused by right coronary artery occlusion in 85% of cases.",
      "Always obtain a right-sided ECG (V4R) when inferior STEMI is present to assess for right ventricular involvement.",
      "In RV infarction: give fluids, avoid nitrates, avoid diuretics, avoid morphine in large doses.",
      "Bradycardia and heart blocks are common with inferior MI due to AV node blood supply from the RCA.",
      "Anterior MI (V1-V4) carries the worst prognosis due to large area of myocardium at risk."
    ],
    examLevel: "RN / Advanced",
    timeLimit: "15 minutes",
    candidateInstructions: "Your patient on telemetry has developed sudden symptoms with ST-segment elevation. Recognize the emergency, initiate appropriate interventions, and prepare the patient for definitive treatment. Think aloud about your clinical reasoning.",
    patientActorScript: "You are a 71-year-old woman who suddenly feels terrible chest tightness and cannot catch your breath. You are very sweaty and feel lightheaded. You are frightened and say 'I feel like I'm going to die.' When asked, you report no allergies and have not taken any new medications. You took your blood pressure pill this morning.",
    examinerChecklist: [
      { action: "Recognizes acute change and calls for help", marks: 3 },
      { action: "Performs rapid ABC assessment", marks: 3 },
      { action: "Obtains and interprets 12-lead ECG correctly", marks: 5 },
      { action: "Activates STEMI protocol promptly", marks: 5 },
      { action: "Administers aspirin", marks: 3 },
      { action: "Establishes IV access and initiates fluids", marks: 3 },
      { action: "Assesses for right ventricular infarction", marks: 5 },
      { action: "Monitors for bradycardia/heart block", marks: 3 },
      { action: "Prepares patient for catheterization", marks: 2 },
      { action: "Documents all interventions with timestamps", marks: 3 }
    ],
    criticalFailCriteria: [
      "Fails to recognize ST-segment elevation",
      "Does not activate STEMI protocol",
      "Administers nitroglycerin to a hypotensive patient with inferior MI",
      "Fails to assess for right ventricular infarction",
      "Does not administer aspirin"
    ],
    examinerQuestions: [
      { question: "Which coronary artery is most likely occluded based on the ECG findings?", answer: "The right coronary artery (RCA). ST elevation in leads II, III, and aVF indicates an inferior STEMI, and the RCA supplies the inferior wall in approximately 85% of patients." },
      { question: "Why is nitroglycerin dangerous in this patient?", answer: "The patient is hypotensive (BP 92/60) and has an inferior MI with possible right ventricular involvement. Nitroglycerin reduces preload, which can cause profound hypotension and cardiovascular collapse in RV-dependent patients." },
      { question: "What conduction abnormality should you anticipate?", answer: "AV node blocks (first-degree, second-degree type I/Wenckebach, or complete heart block) because the AV node is supplied by the RCA in most patients." }
    ],
    teachingPoints: [
      "ST elevation in contiguous leads is the hallmark of transmural ischemia requiring emergent reperfusion",
      "Inferior STEMI has unique management considerations due to frequent RV involvement",
      "Door-to-balloon time directly correlates with myocardial salvage and patient outcomes",
      "Bradycardia in inferior MI is often transient and may respond to atropine",
      "Nursing recognition and rapid protocol activation is the single greatest determinant of treatment time"
    ]
  },
  {
    id: "stroke-recognition",
    title: "Stroke Recognition & Response",
    category: "Acute Care",
    difficulty: "Advanced",
    icon: "Brain",
    description: "Recognize the signs and symptoms of acute stroke, differentiate ischemic from hemorrhagic stroke, perform a rapid neurological assessment, and initiate the stroke protocol.",
    scenarioIntro: "You are a nurse on a medical unit. A 68-year-old male patient with a history of atrial fibrillation and hypertension suddenly develops right-sided facial droop, right arm weakness, and slurred speech during lunch. His wife reports symptoms began approximately 30 minutes ago. Vital signs: BP 178/96, HR 88 (irregular), RR 18, SpO2 96%.",
    equipment: [
      "Penlight",
      "Blood pressure cuff",
      "Pulse oximeter",
      "Cardiac monitor",
      "Blood glucose meter",
      "IV start kit",
      "NIH Stroke Scale reference",
      "Clock or watch for time documentation",
      "Documentation tools"
    ],
    steps: [
      { id: "strk-1", instruction: "Recognize the acute onset of neurological symptoms and activate the stroke code/rapid response.", rationale: "Acute stroke is a time-sensitive emergency. Immediate activation of the stroke team reduces time to treatment.", criticalStep: true },
      { id: "strk-2", instruction: "Note and document the exact time of symptom onset or last known well time.", rationale: "The window for thrombolytic therapy (tPA) is within 4.5 hours of symptom onset. Accurate timing determines treatment eligibility.", criticalStep: true },
      { id: "strk-3", instruction: "Perform a rapid neurological assessment using FAST: Face drooping, Arm weakness, Speech difficulty, Time to call.", rationale: "FAST is a validated rapid screening tool for stroke recognition in the acute setting.", criticalStep: true },
      { id: "strk-4", instruction: "Assess and maintain airway, breathing, and circulation.", rationale: "Stroke patients may lose protective airway reflexes. Ensuring ABCs prevents secondary injury.", criticalStep: true },
      { id: "strk-5", instruction: "Check blood glucose level immediately.", rationale: "Hypoglycemia can mimic stroke symptoms and must be ruled out before proceeding with stroke treatment.", criticalStep: true },
      { id: "strk-6", instruction: "Obtain vital signs and apply continuous cardiac monitoring.", rationale: "Hypertension is common in acute stroke. Cardiac monitoring detects atrial fibrillation and other arrhythmias as potential causes.", criticalStep: false },
      { id: "strk-7", instruction: "Perform a focused NIH Stroke Scale assessment.", rationale: "The NIHSS quantifies stroke severity, guides treatment decisions, and provides a baseline for monitoring.", criticalStep: true },
      { id: "strk-8", instruction: "Establish IV access with a large-bore catheter and draw ordered labs including coagulation studies.", rationale: "IV access is needed for potential tPA administration. Coagulation studies (INR, PTT) must be checked before thrombolytics.", criticalStep: true },
      { id: "strk-9", instruction: "Position the patient with the head of bed elevated to 30 degrees and keep the patient NPO.", rationale: "Head elevation promotes venous drainage and reduces intracranial pressure. NPO status is required pending a swallow screen.", criticalStep: false },
      { id: "strk-10", instruction: "Prepare the patient for an emergent CT scan of the head (non-contrast).", rationale: "CT differentiates ischemic from hemorrhagic stroke. Thrombolytics are absolutely contraindicated in hemorrhagic stroke.", criticalStep: true },
      { id: "strk-11", instruction: "Do NOT administer antihypertensives unless BP exceeds 220/120 (ischemic) or as specifically ordered.", rationale: "Permissive hypertension maintains cerebral perfusion to the ischemic penumbra. Aggressive BP lowering can worsen ischemia.", criticalStep: true },
      { id: "strk-12", instruction: "Communicate findings to the stroke team using SBAR format, including last known well time and NIHSS score.", rationale: "Structured communication ensures all critical information is relayed for time-sensitive treatment decisions.", criticalStep: false },
      { id: "strk-13", instruction: "Prepare for tPA administration if ordered: confirm eligibility, verify time window, obtain consent, and review exclusion criteria.", rationale: "tPA must be administered within 4.5 hours. Exclusion criteria include recent surgery, active bleeding, and INR > 1.7.", criticalStep: false },
      { id: "strk-14", instruction: "Document all assessment findings, interventions, and times meticulously.", rationale: "Time-stamped documentation is critical for quality metrics and medicolegal purposes in stroke care.", criticalStep: true }
    ],
    commonErrors: [
      "Not noting the exact time of symptom onset or last known well time",
      "Failing to check blood glucose before attributing symptoms to stroke",
      "Aggressively lowering blood pressure in acute ischemic stroke",
      "Not maintaining NPO status pending dysphagia screening",
      "Delaying CT scan by performing unnecessary assessments",
      "Failing to activate the stroke code immediately",
      "Not performing the NIH Stroke Scale"
    ],
    passingCriteria: "All critical steps must be performed. Student must activate the stroke code, document symptom onset time, perform FAST and NIHSS assessments, check blood glucose, establish IV access, and prepare for emergent CT scan.",
    clinicalPearls: [
      "Time is brain — approximately 1.9 million neurons die every minute during an ischemic stroke.",
      "Hypoglycemia is the great stroke mimic. Always check glucose first.",
      "Do not lower blood pressure aggressively in ischemic stroke unless it exceeds 220/120. If tPA is planned, BP must be below 185/110.",
      "Atrial fibrillation is the most common cardiac cause of embolic stroke.",
      "The ischemic penumbra is the salvageable tissue surrounding the infarct core — early reperfusion saves this tissue."
    ],
    examLevel: "RN / Advanced",
    timeLimit: "12 minutes",
    candidateInstructions: "Your patient has developed sudden neurological symptoms. Recognize the emergency, perform a rapid assessment, initiate the stroke protocol, and prepare the patient for definitive imaging. Verbalize your clinical reasoning and time-critical actions.",
    patientActorScript: "You are a 68-year-old man eating lunch when suddenly your right side of your face droops and your right arm feels very heavy. Your speech is slurred and you are confused about what is happening. You are frightened. When asked, you can tell the nurse your name but have difficulty with other responses. You cannot lift your right arm above your head.",
    examinerChecklist: [
      { action: "Immediately recognizes stroke symptoms and activates code", marks: 5 },
      { action: "Documents symptom onset time accurately", marks: 5 },
      { action: "Performs FAST assessment", marks: 3 },
      { action: "Checks blood glucose", marks: 4 },
      { action: "Performs NIH Stroke Scale", marks: 4 },
      { action: "Establishes IV access and draws labs", marks: 3 },
      { action: "Prepares for emergent CT scan", marks: 4 },
      { action: "Appropriately manages blood pressure (does not lower aggressively)", marks: 4 },
      { action: "Communicates using SBAR with stroke team", marks: 2 },
      { action: "Documents all times and interventions", marks: 2 }
    ],
    criticalFailCriteria: [
      "Fails to activate stroke code",
      "Does not document symptom onset time",
      "Fails to check blood glucose",
      "Aggressively lowers blood pressure in ischemic stroke",
      "Delays CT scan preparation"
    ],
    examinerQuestions: [
      { question: "What is the time window for tPA administration in ischemic stroke?", answer: "tPA (alteplase) can be administered within 4.5 hours of symptom onset. The earlier it is given, the better the outcome. The target is door-to-needle time of 60 minutes or less." },
      { question: "Why is it important to differentiate ischemic from hemorrhagic stroke before treatment?", answer: "tPA is a thrombolytic that dissolves clots. Administering tPA to a patient with a hemorrhagic stroke would worsen the bleeding, potentially causing death. A CT scan without contrast is required first." },
      { question: "Why is permissive hypertension maintained in acute ischemic stroke?", answer: "Elevated blood pressure helps maintain cerebral perfusion to the ischemic penumbra — the area of brain tissue surrounding the infarct that is at risk but still salvageable. Lowering BP can reduce perfusion to this area and extend the infarction." }
    ],
    teachingPoints: [
      "The stroke chain of survival depends on rapid recognition, activation, assessment, and treatment",
      "Last known well time, not symptom discovery time, determines thrombolytic eligibility",
      "NIHSS score correlates with stroke severity and predicts outcomes",
      "Post-tPA monitoring requires frequent neurological checks and strict BP control below 180/105",
      "Dysphagia screening must occur before any oral intake to prevent aspiration pneumonia"
    ]
  },
  {
    id: "anaphylaxis-management",
    title: "Anaphylaxis Management",
    category: "Acute Care",
    difficulty: "Advanced",
    icon: "AlertTriangle",
    description: "Recognize and manage a severe anaphylactic reaction including airway management, epinephrine administration, and hemodynamic support.",
    scenarioIntro: "You are a nurse on a medical-surgical unit. A 45-year-old female patient who received IV cefazolin 10 minutes ago now complains of throat tightness, difficulty breathing, and generalized itching. On assessment, you observe facial edema, urticaria over the trunk, audible wheezing, and she is becoming increasingly anxious. Vital signs: BP 82/50, HR 128, RR 28, SpO2 88%.",
    equipment: [
      "Epinephrine 1:1000 (1 mg/mL) for IM injection",
      "Epinephrine 1:10,000 for IV use (if available)",
      "Oxygen delivery devices (non-rebreather mask, bag-valve mask)",
      "IV start kit with large-bore catheters",
      "Normal saline for fluid resuscitation",
      "Diphenhydramine (IV)",
      "Methylprednisolone or hydrocortisone (IV)",
      "Albuterol nebulizer",
      "Crash cart with intubation equipment",
      "Cardiac monitor",
      "Pulse oximeter",
      "Stethoscope",
      "Documentation tools"
    ],
    steps: [
      { id: "ana-1", instruction: "Recognize the signs of anaphylaxis and call a code/rapid response immediately.", rationale: "Anaphylaxis is a life-threatening emergency requiring immediate intervention. Delayed treatment increases mortality.", criticalStep: true },
      { id: "ana-2", instruction: "Stop the offending agent immediately (discontinue the IV antibiotic infusion).", rationale: "Continuing the antigen exposure worsens the allergic response. Remove the cause immediately.", criticalStep: true },
      { id: "ana-3", instruction: "Assess and maintain airway — position the patient supine with legs elevated if tolerated. If in respiratory distress, allow an upright position.", rationale: "Supine with legs elevated improves venous return in hypotension. Airway swelling can cause complete obstruction.", criticalStep: true },
      { id: "ana-4", instruction: "Administer epinephrine 0.3-0.5 mg IM into the mid-outer thigh immediately.", rationale: "Epinephrine is the first-line, life-saving treatment for anaphylaxis. It reverses bronchospasm, vasodilation, and mucosal edema. IM route has faster absorption than subcutaneous.", criticalStep: true },
      { id: "ana-5", instruction: "Apply high-flow oxygen via non-rebreather mask at 10-15 L/min.", rationale: "High-flow oxygen counteracts hypoxemia from bronchospasm and upper airway edema.", criticalStep: true },
      { id: "ana-6", instruction: "Establish two large-bore IV lines and begin rapid normal saline infusion (1-2 liters).", rationale: "Anaphylaxis causes massive vasodilation and capillary leak. Aggressive fluid resuscitation treats distributive shock.", criticalStep: true },
      { id: "ana-7", instruction: "Repeat epinephrine every 5-15 minutes if symptoms persist and hemodynamics do not improve.", rationale: "A single dose of epinephrine may not be sufficient. Up to 20% of anaphylactic reactions require a second dose.", criticalStep: true },
      { id: "ana-8", instruction: "Administer diphenhydramine 25-50 mg IV as ordered.", rationale: "H1 antihistamines treat urticaria and pruritus but are adjunctive — they do not replace epinephrine.", criticalStep: false },
      { id: "ana-9", instruction: "Administer corticosteroids (methylprednisolone 125 mg IV) as ordered.", rationale: "Corticosteroids may help prevent biphasic reactions that can occur 4-12 hours after the initial event.", criticalStep: false },
      { id: "ana-10", instruction: "Administer nebulized albuterol for persistent bronchospasm.", rationale: "Albuterol provides additional bronchodilation for wheezing not fully reversed by epinephrine.", criticalStep: false },
      { id: "ana-11", instruction: "Continuously monitor vital signs, cardiac rhythm, and oxygen saturation.", rationale: "Anaphylaxis can rapidly deteriorate to cardiac arrest. Continuous monitoring enables early detection of worsening.", criticalStep: true },
      { id: "ana-12", instruction: "Assess for airway compromise: stridor, voice changes, tongue swelling, drooling.", rationale: "Progressive upper airway edema may require emergent intubation or surgical airway.", criticalStep: true },
      { id: "ana-13", instruction: "Prepare for possible intubation if airway edema progresses.", rationale: "Delayed intubation in severe angioedema can result in inability to secure the airway. Early preparation is essential.", criticalStep: false },
      { id: "ana-14", instruction: "Document the allergic reaction, causative agent, all interventions, and update the allergy list in the medical record.", rationale: "Accurate documentation prevents future re-exposure and ensures the allergy is permanently recorded.", criticalStep: true },
      { id: "ana-15", instruction: "Plan for a minimum 4-6 hour observation period after symptom resolution.", rationale: "Biphasic anaphylaxis occurs in up to 20% of cases, with recurrence of symptoms hours after apparent resolution.", criticalStep: false }
    ],
    commonErrors: [
      "Delaying epinephrine administration",
      "Administering antihistamines before or instead of epinephrine",
      "Using the wrong epinephrine concentration (1:10,000 IV instead of 1:1,000 IM)",
      "Administering epinephrine subcutaneously instead of intramuscularly",
      "Not stopping the offending agent immediately",
      "Failing to position the patient supine with legs elevated",
      "Not observing for biphasic reaction"
    ],
    passingCriteria: "All critical steps must be performed. Student must recognize anaphylaxis, stop the offending agent, administer IM epinephrine promptly, provide high-flow oxygen, establish IV access with fluid resuscitation, and monitor continuously.",
    clinicalPearls: [
      "Epinephrine is the ONLY first-line treatment for anaphylaxis. There is no contraindication to epinephrine in anaphylaxis.",
      "The IM route (mid-outer thigh) is preferred over subcutaneous because it provides faster and more reliable absorption.",
      "Antihistamines and steroids are adjunctive treatments only. They do not reverse anaphylaxis and must never replace epinephrine.",
      "Biphasic reactions can occur 4-12 hours later, so patients must be observed for a minimum of 4-6 hours.",
      "Patients on beta-blockers may have refractory anaphylaxis. Glucagon may be needed in these cases."
    ],
    examLevel: "RN / Advanced",
    timeLimit: "10 minutes",
    candidateInstructions: "Your patient is experiencing a severe allergic reaction to an IV antibiotic. Recognize the anaphylaxis, initiate life-saving treatment, and manage the emergency. Verbalize your actions and reasoning.",
    patientActorScript: "You are a 45-year-old woman who suddenly feels your throat closing up. You are itching all over and have difficulty breathing. You are terrified and wheezing audibly. You cannot speak in full sentences. Your face is visibly swollen. If epinephrine is administered, gradually improve your breathing and report feeling somewhat better after 5 minutes.",
    examinerChecklist: [
      { action: "Recognizes anaphylaxis and activates emergency response", marks: 4 },
      { action: "Stops the IV antibiotic immediately", marks: 4 },
      { action: "Administers IM epinephrine (correct dose, route, site)", marks: 8 },
      { action: "Applies high-flow oxygen", marks: 3 },
      { action: "Establishes IV access and starts fluid resuscitation", marks: 4 },
      { action: "Monitors airway for progressive edema", marks: 3 },
      { action: "Considers repeat epinephrine if no improvement", marks: 3 },
      { action: "Administers adjunctive medications appropriately", marks: 2 },
      { action: "Continuously monitors vital signs", marks: 2 },
      { action: "Documents allergic reaction and updates allergy record", marks: 3 }
    ],
    criticalFailCriteria: [
      "Fails to administer epinephrine",
      "Administers antihistamines as the primary treatment instead of epinephrine",
      "Does not stop the offending agent",
      "Uses wrong route or concentration of epinephrine",
      "Fails to recognize progressive airway compromise"
    ],
    examinerQuestions: [
      { question: "What is the correct dose and route of epinephrine for anaphylaxis in an adult?", answer: "Epinephrine 0.3 to 0.5 mg of 1:1,000 concentration (1 mg/mL) administered intramuscularly into the mid-outer thigh. Can be repeated every 5-15 minutes as needed." },
      { question: "Why are antihistamines not sufficient to treat anaphylaxis?", answer: "Antihistamines only block histamine receptors and reduce urticaria and pruritus. They do not reverse bronchospasm, vasodilation, or upper airway edema. Only epinephrine provides alpha-adrenergic vasoconstriction, beta-1 cardiac stimulation, and beta-2 bronchodilation." },
      { question: "What is a biphasic anaphylactic reaction?", answer: "A biphasic reaction is a recurrence of anaphylactic symptoms that occurs 4-12 hours after the initial reaction has resolved, even without re-exposure to the antigen. It occurs in up to 20% of cases, which is why extended observation is required." }
    ],
    teachingPoints: [
      "Epinephrine is the only drug that saves lives in anaphylaxis — never delay or withhold it",
      "The mid-outer thigh provides the fastest IM absorption due to its vascularity",
      "Always document the specific allergen and update the medical record, allergy band, and pharmacy profile",
      "Patients should be prescribed an epinephrine auto-injector and educated on its use before discharge",
      "Beta-blocker use complicates anaphylaxis management — glucagon is the rescue drug for refractory cases"
    ]
  },
  {
    id: "post-operative-hemorrhage",
    title: "Post-Operative Hemorrhage",
    category: "Acute Care",
    difficulty: "Advanced",
    icon: "Droplets",
    description: "Recognize and manage post-operative hemorrhage including assessment of surgical site bleeding, hemodynamic monitoring, and initiation of resuscitation.",
    scenarioIntro: "You are a nurse on a surgical unit. A 56-year-old male patient is 6 hours post-open cholecystectomy. He calls you stating he feels dizzy and cold. On assessment, you note the abdominal dressing is saturated with bright red blood, the Jackson-Pratt drain has 200 mL of sanguineous output in the last hour, and his skin is pale, cool, and diaphoretic. Vital signs: BP 88/52, HR 118, RR 24, SpO2 94%.",
    equipment: [
      "Blood pressure cuff",
      "Pulse oximeter",
      "Cardiac monitor",
      "Stethoscope",
      "IV start kit with large-bore catheters",
      "Normal saline and lactated Ringer's solution",
      "Blood transfusion supplies (tubing, blood warmer)",
      "Hemostatic dressings and additional surgical dressings",
      "Foley catheter kit",
      "Clean and sterile gloves",
      "Documentation tools"
    ],
    steps: [
      { id: "poh-1", instruction: "Recognize the signs of post-operative hemorrhage: saturated dressing, excessive drain output, hypotension, tachycardia, and signs of shock.", rationale: "Early recognition of hemorrhage enables rapid intervention before progression to irreversible hemorrhagic shock.", criticalStep: true },
      { id: "poh-2", instruction: "Call for help and notify the surgeon immediately with an SBAR report.", rationale: "Post-operative hemorrhage may require surgical re-exploration. The surgeon must be notified immediately.", criticalStep: true },
      { id: "poh-3", instruction: "Apply direct pressure to the surgical site if external bleeding is visible.", rationale: "Direct pressure is the most effective immediate intervention for external hemorrhage control.", criticalStep: true },
      { id: "poh-4", instruction: "Position the patient supine with legs elevated (modified Trendelenburg).", rationale: "This position promotes venous return and improves cardiac output in hypovolemic states.", criticalStep: false },
      { id: "poh-5", instruction: "Establish or verify two large-bore IV lines (16-18 gauge) and initiate rapid crystalloid infusion.", rationale: "Two large-bore IVs allow rapid volume resuscitation. Crystalloids are the first-line fluid for hemorrhagic shock.", criticalStep: true },
      { id: "poh-6", instruction: "Draw blood for type and crossmatch, CBC, coagulation studies, and metabolic panel.", rationale: "Type and crossmatch enables blood product availability. CBC provides baseline hemoglobin. Coagulation studies assess for coagulopathy.", criticalStep: true },
      { id: "poh-7", instruction: "Administer oxygen via non-rebreather mask at 10-15 L/min.", rationale: "High-flow oxygen maximizes oxygen delivery to tissues compromised by reduced circulating volume.", criticalStep: false },
      { id: "poh-8", instruction: "Apply continuous cardiac monitoring and monitor vital signs every 5 minutes.", rationale: "Hemorrhagic shock causes progressive hemodynamic instability. Frequent monitoring detects deterioration.", criticalStep: true },
      { id: "poh-9", instruction: "Insert a Foley catheter and monitor urine output hourly.", rationale: "Urine output is the most reliable indicator of organ perfusion. Target is at least 0.5 mL/kg/hr in adults.", criticalStep: false },
      { id: "poh-10", instruction: "Prepare for blood transfusion: verify blood products using two-nurse verification, check patient identifiers.", rationale: "Transfusion errors are a leading cause of preventable death. Verification prevents ABO incompatibility reactions.", criticalStep: true },
      { id: "poh-11", instruction: "Administer packed red blood cells as ordered, monitoring for transfusion reactions.", rationale: "PRBCs restore oxygen-carrying capacity. Monitor for fever, chills, urticaria, dyspnea, or hemolysis.", criticalStep: false },
      { id: "poh-12", instruction: "Mark the dressing and document the time to track ongoing bleeding.", rationale: "Marking the dressing provides an objective measure of ongoing hemorrhage and rate of expansion.", criticalStep: false },
      { id: "poh-13", instruction: "Monitor for signs of worsening shock: altered mental status, decreasing urine output, worsening tachycardia, falling blood pressure.", rationale: "Progressive shock indicates ongoing hemorrhage requiring surgical intervention.", criticalStep: true },
      { id: "poh-14", instruction: "Prepare the patient for possible return to the operating room for surgical re-exploration.", rationale: "Uncontrolled post-operative hemorrhage often requires surgical intervention to identify and control the bleeding source.", criticalStep: false },
      { id: "poh-15", instruction: "Document all assessments, interventions, fluid volumes, drain outputs, and vital sign trends.", rationale: "Accurate documentation guides ongoing management and provides a legal record of the clinical course.", criticalStep: false }
    ],
    commonErrors: [
      "Failing to recognize early signs of hemorrhagic shock (tachycardia may precede hypotension)",
      "Not notifying the surgeon promptly",
      "Establishing only one IV line instead of two large-bore lines",
      "Not applying direct pressure to the bleeding site",
      "Failing to mark the dressing to track bleeding progression",
      "Not initiating type and crossmatch early",
      "Inadequate monitoring frequency during active hemorrhage"
    ],
    passingCriteria: "All critical steps must be performed. Student must recognize hemorrhage, notify the surgeon, apply pressure, establish two large-bore IVs, initiate fluid resuscitation, prepare for blood transfusion, and monitor for shock progression.",
    clinicalPearls: [
      "Tachycardia is often the earliest sign of hemorrhagic shock. Hypotension is a late and ominous finding indicating 30-40% blood volume loss.",
      "A healthy adult can lose up to 15% of blood volume (Class I hemorrhage) with minimal vital sign changes. Do not be falsely reassured by normal BP.",
      "Drain output greater than 100 mL/hour of sanguineous fluid is a red flag for post-operative hemorrhage.",
      "Young, healthy patients compensate well and may maintain normal blood pressure until suddenly decompensating.",
      "The lethal triad of trauma: hypothermia, acidosis, and coagulopathy — warming the patient and blood products is essential."
    ],
    examLevel: "RN / Advanced",
    timeLimit: "12 minutes",
    candidateInstructions: "Your surgical patient is showing signs of post-operative hemorrhage. Perform a rapid assessment, initiate hemorrhage management, and prepare the patient for potential surgical re-exploration. Think aloud about your clinical reasoning.",
    patientActorScript: "You are a 56-year-old man who had surgery earlier today. You feel very dizzy and cold. You are anxious and say 'Something doesn't feel right.' Your skin is pale and sweaty. You become increasingly confused and drowsy as the scenario progresses if treatment is delayed.",
    examinerChecklist: [
      { action: "Recognizes hemorrhagic shock signs", marks: 4 },
      { action: "Calls for help and notifies surgeon", marks: 4 },
      { action: "Applies direct pressure to bleeding site", marks: 3 },
      { action: "Establishes two large-bore IV lines", marks: 4 },
      { action: "Initiates rapid crystalloid infusion", marks: 3 },
      { action: "Draws type and crossmatch and labs", marks: 3 },
      { action: "Prepares for blood transfusion with proper verification", marks: 5 },
      { action: "Monitors vital signs every 5 minutes", marks: 3 },
      { action: "Monitors for progressive shock", marks: 3 },
      { action: "Documents all findings and interventions", marks: 2 }
    ],
    criticalFailCriteria: [
      "Fails to recognize hemorrhagic shock",
      "Does not notify the surgeon",
      "Fails to establish adequate IV access",
      "Does not initiate fluid resuscitation",
      "Fails to prepare for blood transfusion"
    ],
    examinerQuestions: [
      { question: "What are the four classes of hemorrhagic shock?", answer: "Class I: up to 15% blood loss, minimal tachycardia. Class II: 15-30% loss, tachycardia, narrowed pulse pressure. Class III: 30-40% loss, hypotension, tachycardia, altered mental status. Class IV: greater than 40% loss, life-threatening with profound hypotension and obtunded mental status." },
      { question: "What is the most reliable indicator of adequate resuscitation?", answer: "Urine output of at least 0.5 mL/kg/hour in adults indicates adequate organ perfusion and is the most reliable clinical indicator of successful fluid resuscitation." },
      { question: "Why is two-nurse verification required for blood transfusions?", answer: "Two-nurse verification at the bedside confirms the correct patient, correct blood product, correct blood type (ABO/Rh compatibility), correct unit number, and expiration date. Transfusion errors from misidentification are a leading cause of preventable deaths." }
    ],
    teachingPoints: [
      "Early recognition of hemorrhage relies on trending vital signs — a single normal reading does not exclude hemorrhage",
      "Tachycardia is the body's first compensatory mechanism and should prompt investigation even with normal blood pressure",
      "Massive transfusion protocols use a ratio of 1:1:1 (PRBCs:FFP:platelets) to prevent dilutional coagulopathy",
      "Drain output tracking and dressing marking provide objective measures of ongoing bleeding",
      "The decision for surgical re-exploration is a team decision — nurses provide critical assessment data that guides this decision"
    ]
  },
  {
    id: "postpartum-hemorrhage",
    title: "Postpartum Hemorrhage",
    category: "Maternal & Newborn",
    difficulty: "Advanced",
    icon: "Heart",
    description: "Recognize and manage postpartum hemorrhage including fundal assessment, uterine massage, pharmacological interventions, and hemodynamic support.",
    scenarioIntro: "You are a nurse on the postpartum unit. A 32-year-old G3P3 patient who delivered vaginally 2 hours ago calls you reporting she feels a gush of blood. On assessment, the perineal pad is saturated, the fundus is boggy and displaced above the umbilicus, and there are large clots present. Vital signs: BP 94/58, HR 112, RR 22, SpO2 96%.",
    equipment: [
      "Clean gloves (sterile gloves available)",
      "Blood pressure cuff",
      "Pulse oximeter",
      "IV start kit with large-bore catheters",
      "Oxytocin (Pitocin) for IV infusion",
      "Methylergonovine (Methergine) IM",
      "Misoprostol (Cytotec) rectal",
      "Carboprost (Hemabate) IM",
      "Normal saline and lactated Ringer's",
      "Foley catheter kit",
      "Blood transfusion supplies",
      "Quantitative blood loss measurement tools (calibrated drapes, graduated containers)",
      "Documentation tools"
    ],
    steps: [
      { id: "pph-1", instruction: "Recognize the signs of postpartum hemorrhage: excessive bleeding, boggy uterus, hypotension, tachycardia.", rationale: "Postpartum hemorrhage is the leading cause of maternal death worldwide. Early recognition is critical.", criticalStep: true },
      { id: "pph-2", instruction: "Call for help and activate the obstetric emergency response.", rationale: "PPH management requires a team approach including the obstetrician, anesthesia, and additional nursing support.", criticalStep: true },
      { id: "pph-3", instruction: "Assess the fundus for tone, height, and position.", rationale: "A boggy (soft) uterus indicates uterine atony, which is the most common cause of PPH (70-80% of cases).", criticalStep: true },
      { id: "pph-4", instruction: "Perform bimanual uterine massage firmly until the uterus becomes firm.", rationale: "Uterine massage stimulates uterine contractions and is the immediate first-line intervention for uterine atony.", criticalStep: true },
      { id: "pph-5", instruction: "Empty the bladder by inserting a Foley catheter.", rationale: "A full bladder displaces the uterus and prevents effective contraction. Catheterization also enables accurate urine output monitoring.", criticalStep: true },
      { id: "pph-6", instruction: "Estimate blood loss quantitatively using calibrated tools and weigh blood-soaked materials.", rationale: "Visual estimation consistently underestimates blood loss. Quantitative measurement guides intervention escalation.", criticalStep: false },
      { id: "pph-7", instruction: "Administer oxytocin (Pitocin) IV infusion as ordered (typically 20-40 units in 1 L of normal saline).", rationale: "Oxytocin is the first-line uterotonic for PPH. It stimulates uterine smooth muscle contraction.", criticalStep: true },
      { id: "pph-8", instruction: "If uterine atony persists, administer second-line uterotonics as ordered: methylergonovine (Methergine) IM or misoprostol (Cytotec) rectally.", rationale: "Second-line agents provide additional uterotonic effect. Methergine is contraindicated in hypertension. Misoprostol can be given rectally for rapid absorption.", criticalStep: true },
      { id: "pph-9", instruction: "Establish or verify two large-bore IV lines and initiate aggressive fluid resuscitation.", rationale: "Hemorrhagic shock in PPH progresses rapidly. Two large-bore IVs enable simultaneous fluid and blood administration.", criticalStep: true },
      { id: "pph-10", instruction: "Draw blood for type and crossmatch, CBC, coagulation studies, and fibrinogen level.", rationale: "Fibrinogen below 200 mg/dL in PPH predicts the need for massive transfusion. Coagulopathy worsens hemorrhage.", criticalStep: false },
      { id: "pph-11", instruction: "Apply continuous monitoring: vital signs every 5 minutes, uterine tone, and ongoing blood loss.", rationale: "Continuous assessment detects response to treatment or need for surgical intervention.", criticalStep: true },
      { id: "pph-12", instruction: "Administer blood products as ordered, using proper verification procedures.", rationale: "Blood transfusion restores oxygen-carrying capacity and coagulation factors in severe PPH.", criticalStep: false },
      { id: "pph-13", instruction: "Assess for other causes of PPH using the 4 T's: Tone, Trauma, Tissue, Thrombin.", rationale: "If uterine massage and uterotonics do not control bleeding, other causes must be investigated: lacerations, retained placental tissue, or coagulopathy.", criticalStep: true },
      { id: "pph-14", instruction: "Provide emotional support to the patient and family, explaining interventions calmly.", rationale: "PPH is a terrifying experience for the new mother and family. Calm, clear communication reduces anxiety.", criticalStep: false },
      { id: "pph-15", instruction: "Document all assessments, interventions, blood loss measurements, and medication administration times.", rationale: "Accurate documentation guides ongoing management and is essential for quality review and medicolegal purposes.", criticalStep: false }
    ],
    commonErrors: [
      "Not performing fundal massage immediately when uterine atony is identified",
      "Failing to empty the bladder before assessing fundal position",
      "Underestimating blood loss by visual estimation alone",
      "Administering Methergine to a hypertensive patient",
      "Delaying team activation and surgeon notification",
      "Not considering the 4 T's when initial treatment fails",
      "Failing to monitor vital signs frequently enough"
    ],
    passingCriteria: "All critical steps must be performed. Student must recognize PPH, perform fundal massage, empty the bladder, administer uterotonics, establish IV access with fluid resuscitation, and systematically assess using the 4 T's.",
    clinicalPearls: [
      "The 4 T's of PPH: Tone (uterine atony, 70-80%), Trauma (lacerations, 20%), Tissue (retained products), Thrombin (coagulopathy).",
      "Uterine atony is by far the most common cause. Always check fundal tone first.",
      "Methergine is contraindicated in hypertension due to risk of severe hypertensive crisis.",
      "A fibrinogen level below 200 mg/dL strongly predicts the need for massive transfusion.",
      "PPH is defined as cumulative blood loss ≥1000 mL or blood loss accompanied by signs of hypovolemia within 24 hours of delivery."
    ],
    examLevel: "RN / Advanced",
    timeLimit: "12 minutes",
    candidateInstructions: "Your postpartum patient is experiencing excessive bleeding. Recognize the hemorrhage, initiate management, and escalate care as needed. Verbalize your clinical reasoning and the steps you are taking.",
    patientActorScript: "You are a 32-year-old woman who just had your third baby 2 hours ago. You suddenly feel a gush of fluid between your legs and are lightheaded. You are very frightened and ask 'Am I going to be okay? What about my baby?' When the nurse performs fundal massage, express discomfort but allow the procedure. Gradually improve vital signs if treatment is effective.",
    examinerChecklist: [
      { action: "Recognizes PPH and activates emergency response", marks: 4 },
      { action: "Assesses fundal tone correctly", marks: 4 },
      { action: "Performs effective uterine massage", marks: 5 },
      { action: "Empties bladder via catheterization", marks: 3 },
      { action: "Administers oxytocin appropriately", marks: 4 },
      { action: "Administers second-line uterotonics with contraindication awareness", marks: 4 },
      { action: "Establishes two large-bore IVs and initiates fluid resuscitation", marks: 4 },
      { action: "Systematically assesses 4 T's", marks: 4 },
      { action: "Monitors vital signs and blood loss continuously", marks: 3 },
      { action: "Documents all interventions and blood loss", marks: 2 }
    ],
    criticalFailCriteria: [
      "Fails to perform uterine massage for a boggy uterus",
      "Does not activate emergency response team",
      "Administers Methergine to a hypertensive patient",
      "Fails to establish IV access and begin fluid resuscitation",
      "Does not assess for causes beyond uterine atony when first-line treatment fails"
    ],
    examinerQuestions: [
      { question: "What are the 4 T's of postpartum hemorrhage?", answer: "Tone (uterine atony), Trauma (lacerations, hematomas, uterine rupture), Tissue (retained placenta or clots), and Thrombin (coagulopathy including DIC). Tone is the most common cause, accounting for 70-80% of PPH." },
      { question: "Why is Methergine contraindicated in hypertension?", answer: "Methylergonovine (Methergine) causes sustained vasoconstriction which can precipitate severe hypertensive crisis, stroke, or myocardial infarction in patients with pre-existing hypertension or preeclampsia." },
      { question: "What fibrinogen level is concerning in PPH?", answer: "A fibrinogen level below 200 mg/dL is an early predictor of severe PPH requiring massive transfusion. Normal fibrinogen in pregnancy is 400-600 mg/dL, so a level even in the 'normal' non-pregnant range may indicate significant coagulopathy." }
    ],
    teachingPoints: [
      "PPH is the leading cause of preventable maternal death — every obstetric nurse must be proficient in its management",
      "Uterine massage is a skill that requires firmness and persistence — a gentle touch is insufficient",
      "Quantitative blood loss measurement replaces visual estimation as the standard of care",
      "Always consider the 4 T's systematically when bleeding does not respond to uterine massage and uterotonics",
      "A multidisciplinary team response including obstetrics, anesthesia, blood bank, and nursing is essential for severe PPH"
    ]
  },
  {
    id: "newborn-assessment",
    title: "Newborn Assessment",
    category: "Maternal & Newborn",
    difficulty: "Intermediate",
    icon: "Baby",
    description: "Perform a comprehensive newborn assessment including APGAR scoring, gestational age assessment, physical examination, and identification of deviations from normal.",
    scenarioIntro: "You are a nurse in the newborn nursery. A term infant born via spontaneous vaginal delivery 1 hour ago is being transitioned to your care. The delivery was uncomplicated, and the infant cried immediately at birth. Birth weight is 3.4 kg. You need to perform a comprehensive newborn assessment.",
    equipment: [
      "Infant scale",
      "Measuring tape (length and head circumference)",
      "Stethoscope (neonatal size)",
      "Thermometer (axillary or temporal)",
      "Pulse oximeter with neonatal probe",
      "Penlight",
      "Clean gloves",
      "Warm blankets",
      "Bulb syringe",
      "Newborn identification bands",
      "Documentation tools"
    ],
    steps: [
      { id: "nba-1", instruction: "Perform hand hygiene and don clean gloves.", rationale: "Newborns have immature immune systems and are highly susceptible to infection.", criticalStep: true },
      { id: "nba-2", instruction: "Verify newborn identification bands match the mother's bands and check two identifiers.", rationale: "Preventing newborn misidentification is a critical safety priority.", criticalStep: true },
      { id: "nba-3", instruction: "Review the APGAR scores assigned at 1 and 5 minutes after birth.", rationale: "APGAR scores assess the infant's transition to extrauterine life. Scores of 7-10 are reassuring. Scores below 7 at 5 minutes require ongoing evaluation.", criticalStep: true },
      { id: "nba-4", instruction: "Obtain vital signs: axillary temperature, heart rate (apical for 1 full minute), respiratory rate, and oxygen saturation.", rationale: "Normal newborn parameters: Temp 36.5-37.5°C, HR 120-160 bpm, RR 30-60, SpO2 >95%. Deviations require investigation.", criticalStep: true },
      { id: "nba-5", instruction: "Measure weight, length, and head circumference.", rationale: "These measurements establish the growth baseline and are compared to gestational age norms to identify SGA, AGA, or LGA status.", criticalStep: true },
      { id: "nba-6", instruction: "Inspect the head: fontanelles (anterior and posterior), sutures, molding, caput succedaneum, or cephalohematoma.", rationale: "The anterior fontanelle should be soft and flat. Bulging suggests increased ICP; sunken suggests dehydration. Cephalohematoma does not cross suture lines.", criticalStep: false },
      { id: "nba-7", instruction: "Inspect the face for symmetry, assess eyes for red reflex, and inspect ears for position and form.", rationale: "Low-set ears may indicate chromosomal abnormalities. Red reflex rules out cataracts or retinoblastoma.", criticalStep: false },
      { id: "nba-8", instruction: "Inspect the mouth: palate integrity (hard and soft), presence of natal teeth, and tongue for ankyloglossia.", rationale: "Cleft palate impairs feeding and requires early intervention. Ankyloglossia (tongue-tie) can affect breastfeeding.", criticalStep: true },
      { id: "nba-9", instruction: "Auscultate heart sounds: rate, rhythm, and presence of murmurs.", rationale: "Murmurs in the first 24 hours may indicate congenital heart defects. Persistent murmurs require echocardiographic evaluation.", criticalStep: true },
      { id: "nba-10", instruction: "Auscultate breath sounds bilaterally and observe respiratory effort.", rationale: "Grunting, nasal flaring, retractions, or tachypnea indicate respiratory distress and require immediate evaluation.", criticalStep: true },
      { id: "nba-11", instruction: "Inspect the abdomen: shape, cord clamp, number of cord vessels (2 arteries, 1 vein), and bowel sounds.", rationale: "A single umbilical artery may be associated with renal and cardiac anomalies. The abdomen should be soft and non-distended.", criticalStep: true },
      { id: "nba-12", instruction: "Inspect the genitalia and anus: sex characteristics, patency of anus, and any abnormalities.", rationale: "Imperforate anus requires urgent surgical evaluation. Document passage of meconium.", criticalStep: false },
      { id: "nba-13", instruction: "Perform Ortolani and Barlow maneuvers to assess hip stability.", rationale: "These tests screen for developmental dysplasia of the hip (DDH). A positive clunk requires referral for ultrasonography.", criticalStep: true },
      { id: "nba-14", instruction: "Inspect the spine for alignment, dimples, tufts of hair, or masses.", rationale: "Sacral dimples or hair tufts may indicate spina bifida occulta or other neural tube defects.", criticalStep: false },
      { id: "nba-15", instruction: "Assess newborn reflexes: Moro, rooting, sucking, palmar grasp, and Babinski.", rationale: "Primitive reflexes indicate intact neurological function. Absent or asymmetric reflexes suggest injury or abnormality.", criticalStep: false },
      { id: "nba-16", instruction: "Assess skin color, acrocyanosis, jaundice, and any birthmarks.", rationale: "Acrocyanosis (blue hands and feet) is normal in the first 24-48 hours. Central cyanosis is always abnormal and requires urgent evaluation.", criticalStep: false },
      { id: "nba-17", instruction: "Ensure thermoregulation: dry the infant, place skin-to-skin or in a warmer, and apply a cap.", rationale: "Newborns lose heat rapidly through evaporation, radiation, conduction, and convection. Hypothermia increases oxygen consumption and metabolic stress.", criticalStep: true },
      { id: "nba-18", instruction: "Document all findings and communicate any deviations to the provider.", rationale: "Thorough documentation and prompt communication of abnormal findings enables early intervention.", criticalStep: false }
    ],
    commonErrors: [
      "Not verifying newborn identification bands",
      "Taking a rectal temperature instead of axillary in a newborn",
      "Not counting the apical heart rate for a full minute",
      "Forgetting to check the number of umbilical cord vessels",
      "Not performing hip assessment (Ortolani/Barlow)",
      "Missing signs of respiratory distress (grunting, flaring, retractions)",
      "Failing to maintain thermoregulation during the assessment"
    ],
    passingCriteria: "All critical steps must be performed. Student must verify identification, obtain complete vital signs, perform a systematic physical examination including heart/lung auscultation, cord vessel assessment, hip examination, and palate inspection.",
    clinicalPearls: [
      "Count the apical heart rate for a full minute. Newborn heart rates are irregular and a 15-second count multiplied by 4 is inaccurate.",
      "The umbilical cord should have 2 arteries and 1 vein (AVA). A single umbilical artery occurs in 1% of births and is associated with renal anomalies.",
      "Caput succedaneum crosses suture lines and resolves quickly. Cephalohematoma does NOT cross suture lines and may take weeks to resolve.",
      "Acrocyanosis is normal. Central cyanosis is NEVER normal and requires immediate evaluation.",
      "The Moro reflex should be symmetric. An asymmetric Moro suggests brachial plexus injury (Erb's palsy) or fractured clavicle."
    ],
    examLevel: "RN / Intermediate",
    timeLimit: "20 minutes",
    candidateInstructions: "You will perform a comprehensive newborn assessment on a 1-hour-old term infant. Demonstrate a systematic approach, identify normal and abnormal findings, and communicate your assessment to the healthcare team.",
    patientActorScript: "This station uses a newborn manikin or standardized newborn. The manikin should have a soft anterior fontanelle, a cord clamp with three visible vessels, clear breath sounds bilaterally, no heart murmur, bilateral hip stability, an intact palate, and pink skin with mild acrocyanosis of the hands and feet.",
    examinerChecklist: [
      { action: "Performs hand hygiene and verifies identification", marks: 3 },
      { action: "Reviews APGAR scores", marks: 2 },
      { action: "Obtains complete vital signs with correct technique", marks: 4 },
      { action: "Measures weight, length, and head circumference", marks: 3 },
      { action: "Inspects head, fontanelles, and face systematically", marks: 3 },
      { action: "Auscultates heart and lung sounds", marks: 4 },
      { action: "Inspects umbilical cord vessels", marks: 3 },
      { action: "Performs Ortolani and Barlow maneuvers", marks: 4 },
      { action: "Inspects palate integrity", marks: 3 },
      { action: "Maintains thermoregulation throughout assessment", marks: 3 }
    ],
    criticalFailCriteria: [
      "Fails to verify newborn identification",
      "Does not assess for respiratory distress",
      "Fails to maintain thermoregulation during assessment",
      "Does not auscultate heart and lungs",
      "Misses imperforate anus or cleft palate if present"
    ],
    examinerQuestions: [
      { question: "What are the five components of the APGAR score?", answer: "Appearance (skin color), Pulse (heart rate), Grimace (reflex irritability), Activity (muscle tone), and Respiration (respiratory effort). Each scored 0-2 for a maximum of 10." },
      { question: "What is the difference between caput succedaneum and cephalohematoma?", answer: "Caput succedaneum is edema that crosses suture lines, is present at birth, and resolves within days. Cephalohematoma is a subperiosteal hemorrhage that does NOT cross suture lines, may not be apparent immediately, and takes weeks to months to resolve." },
      { question: "Why is a single umbilical artery clinically significant?", answer: "A single umbilical artery occurs in about 1% of births and is associated with renal anomalies, cardiac defects, and chromosomal abnormalities. It warrants renal ultrasound and echocardiography to screen for associated anomalies." }
    ],
    teachingPoints: [
      "A systematic head-to-toe approach prevents missed findings in the newborn assessment",
      "Thermoregulation is a priority throughout the assessment — cold stress increases oxygen demand and can cause hypoglycemia",
      "The newborn period is the highest-risk time for identification errors — always verify bands at every interaction",
      "Early recognition of congenital anomalies enables timely intervention and improved outcomes",
      "Document both normal and abnormal findings — absence of documentation implies absence of assessment"
    ]
  },
  {
    id: "breastfeeding-assessment",
    title: "Breastfeeding Assessment",
    category: "Maternal & Newborn",
    difficulty: "Intermediate",
    icon: "Heart",
    description: "Perform a comprehensive breastfeeding assessment including latch evaluation, positioning, milk transfer, and identification of common breastfeeding problems.",
    scenarioIntro: "You are a nurse on the postpartum unit. A 28-year-old first-time mother delivered vaginally 12 hours ago and is attempting to breastfeed her term infant. She reports painful latch and feels uncertain about whether the baby is getting enough milk. The infant is alert and showing feeding cues (rooting, hand-to-mouth movements). You need to assess breastfeeding and provide support.",
    equipment: [
      "Breastfeeding pillow",
      "Clean gloves",
      "Breast pump (if needed)",
      "Nipple shield (if indicated)",
      "Scale for pre/post-feed weights (if needed)",
      "Breastfeeding documentation form (LATCH score)",
      "Educational handouts",
      "Documentation tools"
    ],
    steps: [
      { id: "bfa-1", instruction: "Perform hand hygiene, introduce yourself, and create a calm, private environment.", rationale: "Privacy and a calm environment promote relaxation, which facilitates the let-down reflex and successful breastfeeding.", criticalStep: true },
      { id: "bfa-2", instruction: "Assess the mother's breastfeeding goals, concerns, and previous breastfeeding experience.", rationale: "Understanding the mother's perspective enables individualized support and identifies knowledge gaps.", criticalStep: false },
      { id: "bfa-3", instruction: "Assess the infant for feeding readiness cues: rooting, sucking motions, hand-to-mouth activity, alert state.", rationale: "Feeding when the infant shows early hunger cues leads to better latch. Crying is a late hunger cue and makes latching more difficult.", criticalStep: true },
      { id: "bfa-4", instruction: "Inspect the mother's breasts and nipples: shape, integrity, engorgement, and any signs of tissue damage.", rationale: "Flat or inverted nipples, cracked or bleeding nipples, and engorgement all affect latch and require intervention.", criticalStep: true },
      { id: "bfa-5", instruction: "Assist with positioning: support the mother in a comfortable position (cradle, cross-cradle, football, or side-lying hold).", rationale: "Proper positioning brings the infant to the breast at the correct angle and reduces maternal fatigue and discomfort.", criticalStep: true },
      { id: "bfa-6", instruction: "Guide the mother through the latch technique: align the infant's nose to the nipple, wait for a wide gape, and bring the baby to the breast (not the breast to the baby).", rationale: "An asymmetric deep latch with the lower lip flanged outward ensures adequate milk transfer and prevents nipple trauma.", criticalStep: true },
      { id: "bfa-7", instruction: "Assess the latch: mouth wide open, lips flanged outward, areola more visible above the upper lip than below, no clicking sounds.", rationale: "A shallow latch causes nipple pain, inefficient milk transfer, and nipple damage.", criticalStep: true },
      { id: "bfa-8", instruction: "Observe for effective sucking: rhythmic suck-swallow pattern with audible swallowing.", rationale: "Nutritive sucking follows a 1:1 suck-to-swallow ratio once milk flow is established. Audible swallowing confirms milk transfer.", criticalStep: true },
      { id: "bfa-9", instruction: "Assess for signs of adequate milk transfer: softening of the breast, infant's satisfied behavior after feeding, and expected wet and soiled diapers.", rationale: "In the first days, 1-2 wet diapers on day 1, increasing to 6+ by day 4-5. Transitional stools by day 3-4.", criticalStep: false },
      { id: "bfa-10", instruction: "Use the LATCH scoring tool to document the assessment: Latch, Audible swallowing, Type of nipple, Comfort, Help needed.", rationale: "The LATCH score provides a standardized method for assessing and communicating breastfeeding progress.", criticalStep: false },
      { id: "bfa-11", instruction: "Assess for common breastfeeding problems: engorgement, nipple pain, cracked nipples, perceived low milk supply.", rationale: "Early identification and intervention for breastfeeding problems prevents breastfeeding failure and maternal frustration.", criticalStep: false },
      { id: "bfa-12", instruction: "Teach the mother how to break the latch safely by inserting a finger into the corner of the infant's mouth.", rationale: "Pulling the infant off the breast without breaking suction causes nipple trauma.", criticalStep: false },
      { id: "bfa-13", instruction: "Educate on feeding frequency: at least 8-12 times in 24 hours, feeding on demand, and signs of adequate intake.", rationale: "Frequent feeding stimulates milk production and ensures adequate caloric intake for the newborn.", criticalStep: true },
      { id: "bfa-14", instruction: "Provide emotional support and reassurance, normalizing the learning process.", rationale: "Breastfeeding is a learned skill. Maternal confidence is a strong predictor of breastfeeding success and duration.", criticalStep: false },
      { id: "bfa-15", instruction: "Document the assessment findings, interventions, and plan for follow-up.", rationale: "Documentation ensures continuity of care and allows the next nurse or lactation consultant to build on the assessment.", criticalStep: false }
    ],
    commonErrors: [
      "Not assessing the infant for feeding readiness before attempting to latch",
      "Pushing the infant's head onto the breast forcefully",
      "Not inspecting the mother's nipples for damage",
      "Failing to observe a full feeding cycle",
      "Not providing education about feeding frequency and signs of adequate intake",
      "Dismissing maternal pain as 'normal' without assessing latch quality",
      "Not offering emotional support and reassurance"
    ],
    passingCriteria: "All critical steps must be performed. Student must assess feeding readiness, inspect breasts/nipples, assist with positioning and latch, assess for effective sucking with audible swallowing, and educate on feeding frequency.",
    clinicalPearls: [
      "Pain during breastfeeding is NOT normal and usually indicates a latch problem. Address latch before it causes nipple breakdown.",
      "The infant should have a wide gape before latching — aiming the nipple toward the hard palate ensures a deep latch.",
      "Colostrum is produced in small volumes (5-7 mL per feed on day 1) and is sufficient for the healthy term infant. Reassure the mother.",
      "Supplementation should be avoided unless medically indicated, as it interferes with supply-demand regulation.",
      "Skin-to-skin contact promotes breastfeeding initiation and should be encouraged throughout the hospital stay."
    ],
    examLevel: "RN / Intermediate",
    timeLimit: "15 minutes",
    candidateInstructions: "You will assess a breastfeeding mother and infant dyad. Evaluate feeding readiness, assist with positioning and latch, observe the feeding, and provide appropriate education and support. Verbalize your assessment findings.",
    patientActorScript: "You are a 28-year-old first-time mother who is excited but anxious about breastfeeding. You report nipple pain when the baby latches. You worry that you are not producing enough milk. You are receptive to guidance and willing to try different positions. When the nurse corrects your latch, report that the pain has improved. Ask questions such as 'How do I know if the baby is getting enough?'",
    examinerChecklist: [
      { action: "Creates a calm, private environment", marks: 2 },
      { action: "Assesses infant feeding readiness cues", marks: 3 },
      { action: "Inspects maternal breast and nipple condition", marks: 3 },
      { action: "Assists with proper positioning", marks: 4 },
      { action: "Guides effective latch technique", marks: 5 },
      { action: "Assesses latch quality (flanged lips, no clicking)", marks: 4 },
      { action: "Observes for audible swallowing", marks: 3 },
      { action: "Educates on feeding frequency and signs of adequate intake", marks: 4 },
      { action: "Provides emotional support and reassurance", marks: 2 },
      { action: "Documents assessment findings", marks: 2 }
    ],
    criticalFailCriteria: [
      "Forces the infant onto the breast",
      "Does not assess the latch",
      "Dismisses maternal pain without assessment",
      "Does not educate on feeding frequency",
      "Fails to assess for feeding readiness cues"
    ],
    examinerQuestions: [
      { question: "How often should a newborn breastfeed in the first 24 hours?", answer: "A newborn should breastfeed at least 8-12 times in 24 hours, approximately every 2-3 hours. Feeding on demand is recommended, watching for early feeding cues rather than adhering to a strict schedule." },
      { question: "What are the signs that an infant is getting enough breast milk?", answer: "Adequate intake indicators include: at least 6 wet diapers per day by day 4-5, 3-4 stools per day transitioning from meconium to yellow seedy stools, audible swallowing during feeds, weight loss no greater than 7-10% of birth weight, and return to birth weight by 10-14 days." },
      { question: "What does a clicking sound during breastfeeding indicate?", answer: "Clicking or smacking sounds typically indicate a shallow or incorrect latch, or the infant is breaking suction repeatedly. This results in inefficient milk transfer, maternal nipple pain, and potential nipple damage. The latch should be assessed and corrected." }
    ],
    teachingPoints: [
      "Breastfeeding is a learned skill for both mother and baby — patience and support are essential",
      "A deep, asymmetric latch is the foundation of painless and effective breastfeeding",
      "Early and frequent feeding establishes milk supply through the supply-and-demand mechanism",
      "Skin-to-skin contact enhances breastfeeding success and should be maximized in the early postpartum period",
      "Nurses play a critical role in breastfeeding success — consistent, evidence-based support significantly improves outcomes"
    ]
  },
  {
    id: "pre-eclampsia",
    title: "Pre-eclampsia Recognition",
    category: "Maternal & Newborn",
    difficulty: "Advanced",
    icon: "AlertTriangle",
    description: "Recognize the clinical signs and symptoms of pre-eclampsia, perform a focused assessment, initiate monitoring, and implement prescribed interventions to prevent progression to eclampsia.",
    scenarioIntro: "You are a nurse on the antepartum unit. A 30-year-old G1P0 at 34 weeks gestation reports a severe headache that will not resolve, visual changes described as 'seeing spots,' and facial swelling that developed over the past few hours. Her prenatal record shows blood pressures in the 110-120/70-80 range. Current vital signs: BP 168/108, HR 90, RR 18, SpO2 98%. She has 3+ pitting edema in her hands and face.",
    equipment: [
      "Blood pressure cuff (appropriate size)",
      "Stethoscope",
      "Pulse oximeter",
      "Fetal heart rate monitor (electronic fetal monitoring)",
      "Urine specimen container for protein testing",
      "Reflex hammer",
      "IV start kit",
      "Magnesium sulfate infusion supplies",
      "Calcium gluconate (antidote for magnesium toxicity)",
      "Seizure precautions equipment (padded side rails, suction, oxygen)",
      "Documentation tools"
    ],
    steps: [
      { id: "pec-1", instruction: "Recognize the constellation of symptoms indicating pre-eclampsia with severe features: hypertension, headache, visual changes, edema.", rationale: "Pre-eclampsia with severe features carries high risk for progression to eclampsia (seizures), HELLP syndrome, placental abruption, and maternal/fetal death.", criticalStep: true },
      { id: "pec-2", instruction: "Notify the physician or midwife immediately with an SBAR report of the clinical findings.", rationale: "Pre-eclampsia with severe features is an obstetric emergency requiring prompt medical management and possible delivery planning.", criticalStep: true },
      { id: "pec-3", instruction: "Obtain blood pressure using the correct technique: appropriate cuff size, patient seated or in left lateral position, arm at heart level.", rationale: "Accurate BP measurement is critical. A BP of 160/110 or greater on two occasions confirms severe hypertension in pregnancy.", criticalStep: true },
      { id: "pec-4", instruction: "Assess for severe features: persistent headache, visual disturbances, right upper quadrant or epigastric pain, hyperreflexia with clonus.", rationale: "These symptoms indicate end-organ involvement and cerebral irritability, increasing the risk of eclamptic seizures.", criticalStep: true },
      { id: "pec-5", instruction: "Assess deep tendon reflexes (DTRs) and check for clonus at the ankle.", rationale: "Hyperreflexia (3-4+) and clonus indicate cerebral irritability and increased seizure risk. DTR monitoring also guides magnesium sulfate therapy.", criticalStep: true },
      { id: "pec-6", instruction: "Collect a urine specimen and test for proteinuria.", rationale: "Proteinuria of 300 mg or greater in 24 hours or a protein-to-creatinine ratio of 0.3 or greater supports the diagnosis. However, severe pre-eclampsia can occur without proteinuria.", criticalStep: false },
      { id: "pec-7", instruction: "Apply electronic fetal monitoring (EFM) to assess fetal heart rate pattern.", rationale: "Pre-eclampsia affects placental perfusion. Non-reassuring fetal heart rate patterns may indicate fetal compromise requiring urgent delivery.", criticalStep: true },
      { id: "pec-8", instruction: "Establish IV access and draw ordered labs: CBC, liver enzymes (AST, ALT), LDH, creatinine, uric acid, and coagulation studies.", rationale: "These labs screen for HELLP syndrome (Hemolysis, Elevated Liver enzymes, Low Platelets) and renal dysfunction.", criticalStep: true },
      { id: "pec-9", instruction: "Initiate magnesium sulfate as ordered: loading dose of 4-6 grams IV over 20-30 minutes, followed by maintenance infusion of 1-2 grams/hour.", rationale: "Magnesium sulfate is the gold standard for seizure prophylaxis in pre-eclampsia. It prevents eclamptic seizures.", criticalStep: true },
      { id: "pec-10", instruction: "Before and during magnesium sulfate infusion, assess: DTRs present, respiratory rate > 12/min, urine output > 30 mL/hr.", rationale: "Magnesium toxicity causes loss of DTRs, respiratory depression, and cardiac arrest. These three assessments are the essential safety checks.", criticalStep: true },
      { id: "pec-11", instruction: "Ensure calcium gluconate 1 gram is available at the bedside.", rationale: "Calcium gluconate is the antidote for magnesium toxicity. It must be immediately accessible whenever magnesium sulfate is infusing.", criticalStep: true },
      { id: "pec-12", instruction: "Implement seizure precautions: pad side rails, suction at bedside, dim lighting, minimize stimulation.", rationale: "Environmental stimulation can trigger eclamptic seizures. A calm, quiet, dark environment is protective.", criticalStep: true },
      { id: "pec-13", instruction: "Monitor blood pressure every 15 minutes initially, then per protocol.", rationale: "BP trends guide antihypertensive therapy and delivery timing.", criticalStep: false },
      { id: "pec-14", instruction: "Administer antihypertensive medications as ordered (labetalol or hydralazine IV) for BP above 160/110.", rationale: "Acute severe hypertension in pregnancy requires treatment within 30-60 minutes to prevent stroke and organ damage.", criticalStep: false },
      { id: "pec-15", instruction: "Monitor intake and output strictly, including hourly urine output.", rationale: "Oliguria (less than 30 mL/hr) indicates renal compromise and may indicate worsening pre-eclampsia or magnesium accumulation.", criticalStep: false },
      { id: "pec-16", instruction: "Educate the patient about warning signs to report: worsening headache, vision changes, epigastric pain, decreased fetal movement.", rationale: "Patient self-monitoring adds an additional safety layer between nursing assessments.", criticalStep: false },
      { id: "pec-17", instruction: "Document all findings, interventions, magnesium sulfate assessments, and fetal monitoring results.", rationale: "Thorough documentation guides ongoing management and provides a legal record.", criticalStep: false }
    ],
    commonErrors: [
      "Not recognizing the cluster of severe features as an emergency",
      "Failing to check DTRs before and during magnesium sulfate therapy",
      "Not ensuring calcium gluconate is at the bedside",
      "Not monitoring respiratory rate during magnesium infusion",
      "Failing to implement seizure precautions",
      "Using a wrong-size blood pressure cuff, leading to inaccurate readings",
      "Not monitoring urine output during magnesium therapy"
    ],
    passingCriteria: "All critical steps must be performed. Student must recognize severe features, notify the provider, assess DTRs and clonus, initiate fetal monitoring, administer magnesium sulfate with appropriate safety monitoring, and implement seizure precautions.",
    clinicalPearls: [
      "The three essential checks during magnesium sulfate therapy: DTRs present, RR > 12, urine output > 30 mL/hr. If any are absent, hold the infusion and notify the provider.",
      "Pre-eclampsia can occur without proteinuria if other severe features are present.",
      "HELLP syndrome can develop rapidly — monitor labs frequently. Platelets below 100,000, AST/ALT elevated, and hemolysis are the triad.",
      "The only cure for pre-eclampsia is delivery. Management before delivery is temporizing to prevent complications.",
      "Eclamptic seizures can occur antepartum, intrapartum, or postpartum (up to 6 weeks after delivery)."
    ],
    examLevel: "RN / Advanced",
    timeLimit: "15 minutes",
    candidateInstructions: "Your antepartum patient is showing signs of pre-eclampsia with severe features. Perform a focused assessment, initiate prescribed interventions including magnesium sulfate therapy, and implement safety precautions. Verbalize your clinical reasoning.",
    patientActorScript: "You are a 30-year-old woman pregnant with your first baby at 34 weeks. You have a terrible headache and are seeing spots in your vision. Your face and hands feel very swollen. You are scared and worried about your baby. When the nurse tests your reflexes, they are very brisk (hyperreflexic). You ask 'Is my baby going to be okay?' and 'Am I going to have a seizure?'",
    examinerChecklist: [
      { action: "Recognizes severe features of pre-eclampsia", marks: 4 },
      { action: "Notifies provider promptly", marks: 3 },
      { action: "Obtains accurate blood pressure", marks: 3 },
      { action: "Assesses DTRs and clonus", marks: 4 },
      { action: "Initiates fetal monitoring", marks: 3 },
      { action: "Draws appropriate labs", marks: 3 },
      { action: "Administers magnesium sulfate with proper monitoring", marks: 6 },
      { action: "Ensures calcium gluconate at bedside", marks: 4 },
      { action: "Implements seizure precautions", marks: 4 },
      { action: "Monitors respiratory rate and urine output during magnesium therapy", marks: 3 }
    ],
    criticalFailCriteria: [
      "Fails to recognize pre-eclampsia with severe features",
      "Does not initiate magnesium sulfate seizure prophylaxis",
      "Fails to monitor DTRs and respiratory rate during magnesium infusion",
      "Does not have calcium gluconate available at bedside",
      "Does not implement seizure precautions"
    ],
    examinerQuestions: [
      { question: "What are the three essential assessments during magnesium sulfate therapy?", answer: "Deep tendon reflexes must be present (loss of DTRs is the first sign of toxicity), respiratory rate must be greater than 12 breaths per minute, and urine output must be greater than 30 mL/hour. If any of these criteria are not met, the infusion should be held and the provider notified." },
      { question: "What is the antidote for magnesium sulfate toxicity?", answer: "Calcium gluconate 1 gram administered IV slowly over 3-5 minutes. It must be immediately available at the bedside whenever magnesium sulfate is being infused." },
      { question: "What is HELLP syndrome and how does it relate to pre-eclampsia?", answer: "HELLP is a severe variant of pre-eclampsia characterized by Hemolysis (elevated LDH, schistocytes on blood smear), Elevated Liver enzymes (AST, ALT), and Low Platelets (below 100,000). It can develop rapidly and indicates severe end-organ dysfunction requiring urgent delivery." }
    ],
    teachingPoints: [
      "Pre-eclampsia is a multisystem disorder affecting the brain, liver, kidneys, and placenta",
      "Magnesium sulfate is the gold standard for seizure prevention — it is NOT primarily an antihypertensive",
      "The three magnesium safety checks (DTRs, RR, urine output) must be performed and documented every 1-2 hours",
      "Delivery is the only definitive treatment — all other interventions are temporizing",
      "Pre-eclampsia can present or worsen postpartum — continued monitoring after delivery is essential"
    ]
  },
  {
    id: "labour-triage",
    title: "Labour Triage Assessment",
    category: "Maternal & Newborn",
    difficulty: "Intermediate",
    icon: "ClipboardList",
    description: "Perform a systematic triage assessment of a patient presenting in possible labour including contraction assessment, fetal heart rate monitoring, cervical status review, and determination of true versus false labour.",
    scenarioIntro: "You are a nurse in the labour and delivery triage unit. A 26-year-old G2P1 at 38 weeks gestation presents reporting regular contractions every 5 minutes for the past 2 hours and a 'gush of fluid' 30 minutes ago. She rates her contraction pain as 6/10. Her prenatal record shows an uncomplicated pregnancy, GBS-negative status, and no known allergies.",
    equipment: [
      "Electronic fetal monitor (EFM)",
      "Tocodynamometer",
      "Blood pressure cuff",
      "Pulse oximeter",
      "Thermometer",
      "Stethoscope",
      "Nitrazine paper and ferning slides",
      "Sterile speculum (if needed)",
      "Sterile gloves",
      "IV start kit",
      "Urine specimen container",
      "Documentation tools"
    ],
    steps: [
      { id: "lt-1", instruction: "Perform hand hygiene, identify the patient with two identifiers, and introduce yourself.", rationale: "Patient safety standard. Proper identification is critical in labour and delivery.", criticalStep: true },
      { id: "lt-2", instruction: "Obtain a focused obstetric history: gravida/para, estimated date of delivery, prenatal complications, GBS status, and current complaints.", rationale: "Obstetric history guides assessment priorities and care planning. GBS status determines need for intrapartum antibiotics.", criticalStep: true },
      { id: "lt-3", instruction: "Assess the contraction pattern: frequency, duration, intensity, and regularity.", rationale: "True labour contractions are regular, progressively stronger, and closer together. False labour contractions are irregular and do not intensify.", criticalStep: true },
      { id: "lt-4", instruction: "Apply the external fetal monitor and tocodynamometer for continuous fetal heart rate and contraction monitoring.", rationale: "Continuous EFM establishes a baseline fetal heart rate pattern and correlates it with uterine contractions to assess fetal wellbeing.", criticalStep: true },
      { id: "lt-5", instruction: "Assess the fetal heart rate tracing: baseline rate, variability, accelerations, and decelerations.", rationale: "Normal baseline is 110-160 bpm with moderate variability. Accelerations are reassuring. Decelerations require classification and response.", criticalStep: true },
      { id: "lt-6", instruction: "Assess for rupture of membranes: ask about fluid leakage, perform Nitrazine test (positive = blue/alkaline), and assess for ferning under microscope if ordered.", rationale: "Ruptured membranes confirm the onset of the labour process and increase infection risk. Nitrazine paper turns blue in the presence of amniotic fluid (pH 7.0-7.5).", criticalStep: true },
      { id: "lt-7", instruction: "Obtain vital signs: blood pressure, heart rate, respiratory rate, temperature, and oxygen saturation.", rationale: "Baseline maternal vital signs detect hypertension (pre-eclampsia risk), fever (infection risk), and guide ongoing management.", criticalStep: true },
      { id: "lt-8", instruction: "Review the most recent cervical examination results (dilation, effacement, station) or prepare for provider examination.", rationale: "Cervical change over time distinguishes true from false labour. True labour demonstrates progressive dilation and effacement.", criticalStep: true },
      { id: "lt-9", instruction: "Assess pain level and coping strategies; ask about the patient's birth plan and pain management preferences.", rationale: "Pain assessment guides interventions. Understanding the birth plan promotes patient-centered care.", criticalStep: false },
      { id: "lt-10", instruction: "Collect a urine specimen for urinalysis and protein assessment.", rationale: "Urinalysis screens for urinary tract infection and proteinuria (pre-eclampsia screening).", criticalStep: false },
      { id: "lt-11", instruction: "Establish IV access if admission is indicated.", rationale: "IV access provides a route for fluid resuscitation, antibiotics (GBS prophylaxis), and emergency medications.", criticalStep: false },
      { id: "lt-12", instruction: "Differentiate true labour from false labour based on contraction pattern, cervical change, and associated symptoms.", rationale: "True labour: regular contractions, cervical dilation/effacement, contractions intensify with walking. False labour: irregular contractions, no cervical change, relieved by position change.", criticalStep: true },
      { id: "lt-13", instruction: "If membranes are ruptured, note the time, color, odor, and amount of fluid.", rationale: "Meconium-stained fluid indicates potential fetal distress and requires preparation for neonatal resuscitation. Foul odor suggests chorioamnionitis.", criticalStep: true },
      { id: "lt-14", instruction: "Communicate findings to the provider using SBAR format and obtain admission or discharge orders.", rationale: "Structured communication ensures the provider has all relevant clinical information for decision-making.", criticalStep: false },
      { id: "lt-15", instruction: "Document all assessment findings, fetal heart rate tracing interpretation, and the plan of care.", rationale: "Thorough documentation ensures continuity of care and provides a legal record of the triage encounter.", criticalStep: false }
    ],
    commonErrors: [
      "Not applying the fetal monitor promptly upon arrival",
      "Failing to assess for rupture of membranes when fluid leakage is reported",
      "Not differentiating between true and false labour",
      "Performing a digital cervical examination when preterm premature rupture of membranes is suspected",
      "Not noting the color and odor of amniotic fluid",
      "Failing to check GBS status for antibiotic planning",
      "Not assessing the fetal heart rate tracing systematically"
    ],
    passingCriteria: "All critical steps must be performed. Student must obtain obstetric history, apply fetal monitoring, assess contraction pattern, test for membrane rupture, obtain vital signs, review cervical status, and differentiate true from false labour.",
    clinicalPearls: [
      "True labour contractions are regular, intensify with ambulation, and result in cervical change. False labour contractions are irregular and resolve with rest.",
      "Nitrazine testing has false positives with blood, semen, vaginitis, and alkaline urine. Ferning is more specific.",
      "Never perform a digital cervical examination if preterm premature rupture of membranes (PPROM) is suspected — use sterile speculum examination instead.",
      "Meconium-stained amniotic fluid requires notification of the neonatal team and preparation for possible neonatal resuscitation.",
      "The fetal heart rate tracing should be categorized: Category I (normal), Category II (indeterminate), or Category III (abnormal requiring intervention)."
    ],
    examLevel: "RN / Intermediate",
    timeLimit: "15 minutes",
    candidateInstructions: "You will assess a patient presenting to labour and delivery triage with contractions and possible rupture of membranes. Perform a systematic assessment, differentiate true from false labour, and communicate your findings to the healthcare team.",
    patientActorScript: "You are a 26-year-old woman pregnant with your second baby at 38 weeks. You are having strong, regular contractions every 5 minutes and felt a gush of fluid 30 minutes ago. Your underwear is damp with clear fluid. You are excited but nervous. You had a normal vaginal delivery with your first baby. When asked, report your prenatal care has been uncomplicated, you are GBS-negative, and you have no allergies. Rate your contraction pain as 6/10.",
    examinerChecklist: [
      { action: "Identifies patient and obtains focused obstetric history", marks: 3 },
      { action: "Applies fetal monitor and assesses FHR tracing", marks: 5 },
      { action: "Assesses contraction pattern (frequency, duration, intensity)", marks: 4 },
      { action: "Tests for rupture of membranes (Nitrazine/ferning)", marks: 4 },
      { action: "Notes color, odor, and amount of amniotic fluid", marks: 3 },
      { action: "Obtains maternal vital signs", marks: 3 },
      { action: "Reviews cervical examination findings", marks: 3 },
      { action: "Differentiates true from false labour", marks: 4 },
      { action: "Checks GBS status", marks: 2 },
      { action: "Communicates findings using SBAR", marks: 3 }
    ],
    criticalFailCriteria: [
      "Fails to apply fetal monitoring",
      "Does not assess for rupture of membranes when reported",
      "Performs a digital cervical exam when PPROM is possible without provider order",
      "Does not assess fetal heart rate tracing",
      "Fails to note meconium staining if present"
    ],
    examinerQuestions: [
      { question: "What are the key differences between true and false labour?", answer: "True labour: contractions are regular and progressive in frequency and intensity, pain typically begins in the back and radiates to the front, contractions intensify with ambulation, and cervical dilation and effacement progress. False labour (Braxton Hicks): contractions are irregular, pain is usually in the lower abdomen, contractions decrease with rest or position change, and there is no cervical change." },
      { question: "What does a positive Nitrazine test indicate?", answer: "A positive Nitrazine test (paper turns blue) indicates an alkaline pH consistent with amniotic fluid (pH 7.0-7.5). Normal vaginal pH is acidic (3.8-4.2). However, false positives can occur with blood, semen, bacterial vaginosis, or cervical mucus." },
      { question: "What is the significance of meconium-stained amniotic fluid?", answer: "Meconium-stained amniotic fluid may indicate fetal distress, particularly in post-term pregnancies. Thick meconium increases the risk of meconium aspiration syndrome in the newborn. The neonatal resuscitation team should be notified and present at delivery for suctioning and support." }
    ],
    teachingPoints: [
      "Labour triage requires rapid, systematic assessment balancing maternal and fetal priorities",
      "Fetal heart rate monitoring should be initiated as early as possible in the triage process",
      "Membrane rupture assessment is time-sensitive — prolonged rupture increases infection risk",
      "GBS-positive patients require intrapartum antibiotic prophylaxis at least 4 hours before delivery for adequate coverage",
      "Documentation of arrival time, assessment times, and fetal monitoring strips is critical for medicolegal purposes"
    ]
  }
];
