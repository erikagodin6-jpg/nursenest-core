import { EmergencyNursingQuestion } from "./types";

export const cardiacEmergencyQuestions: EmergencyNursingQuestion[] = [
  {
    stem: "A 58-year-old male presents to the ED with crushing substernal chest pain radiating to the left arm for the past 30 minutes. His 12-lead ECG shows ST-segment elevation in leads II, III, and aVF with reciprocal ST depression in leads I and aVL. Vital signs: BP 88/60 mmHg, HR 52 bpm, RR 22, SpO2 94%. Which intervention should the emergency nurse prioritize first?",
    options: [
      "Establish IV access and prepare for emergent cardiac catheterization while administering aspirin 325 mg PO",
      "Administer sublingual nitroglycerin 0.4 mg for pain relief",
      "Obtain a right-sided ECG to evaluate for right ventricular involvement before fluid resuscitation",
      "Administer morphine 4 mg IV for pain management"
    ],
    correctAnswer: 2,
    rationaleLong: "This patient presents with an inferior STEMI (ST elevation in leads II, III, aVF) with hemodynamic compromise (hypotension and bradycardia). The priority intervention is obtaining a right-sided ECG (specifically lead V4R) to evaluate for right ventricular (RV) infarction, which occurs in approximately 30-50% of inferior STEMIs. RV involvement fundamentally changes the management approach because these patients are preload-dependent. Administering nitroglycerin or morphine to a patient with RV infarction can cause catastrophic hypotension due to venodilation and decreased preload. If RV involvement is confirmed, the treatment includes aggressive IV fluid resuscitation (normal saline boluses of 250-500 mL) to maintain adequate preload and cardiac output. While aspirin administration and preparation for cardiac catheterization are important, they should not precede the critical assessment of RV involvement in an inferior STEMI with hypotension. The right-sided ECG takes only seconds to perform and provides essential information that directly impacts treatment decisions. Morphine should be used cautiously in any acute MI as it can cause hypotension and respiratory depression. The American Heart Association guidelines emphasize obtaining right-sided leads in all inferior STEMIs to guide appropriate fluid management and avoid harmful vasodilator therapy.",
    learningObjective: "Recognize the importance of right-sided ECG in inferior STEMI to evaluate for right ventricular involvement before initiating vasodilator therapy",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "STEMI/NSTEMI Recognition",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Many nurses default to nitroglycerin for chest pain, but in inferior STEMI with hypotension, this can be fatal due to RV involvement",
    clinicalPearls: [
      "Always obtain right-sided ECG in inferior STEMI before administering nitroglycerin",
      "RV infarction patients are preload-dependent and need IV fluids, not vasodilators",
      "Bradycardia with inferior STEMI suggests vagal response or AV nodal ischemia",
      "ST elevation >= 1mm in V4R is highly specific for RV infarction"
    ],
    safetyNote: "Never give nitroglycerin to a patient with suspected RV infarction or SBP < 90 mmHg - can cause irreversible cardiogenic shock",
    distractorRationales: [
      "Aspirin and cath lab activation are correct but not the first priority when RV involvement must be assessed",
      "Nitroglycerin is contraindicated with hypotension and suspected RV infarction due to preload reduction",
      "Morphine can worsen hypotension and is not first-line in hemodynamically unstable STEMI"
    ],
    lessonLink: "/emergency/lessons/stemi-management"
  },
  {
    stem: "A 45-year-old female arrives at the ED via EMS with a chief complaint of 'palpitations and dizziness' for 2 hours. The cardiac monitor shows a narrow-complex tachycardia at 186 bpm with no discernible P waves. BP is 110/72 mmHg and the patient is alert and oriented. The emergency nurse should anticipate which initial intervention?",
    options: [
      "Synchronized cardioversion at 50-100 joules",
      "Vagal maneuvers followed by rapid IV push of adenosine 6 mg if unsuccessful",
      "IV amiodarone 150 mg over 10 minutes",
      "IV diltiazem 0.25 mg/kg over 2 minutes"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with a stable supraventricular tachycardia (SVT), evidenced by the narrow QRS complex, rate of 186 bpm, absent P waves, and stable hemodynamics. According to ACLS guidelines, the first-line treatment for stable SVT is vagal maneuvers (such as the modified Valsalva maneuver, carotid sinus massage, or bearing down), followed by adenosine if vagal maneuvers are unsuccessful. Adenosine is administered as a rapid IV push at 6 mg, followed by a 20 mL normal saline flush. If the first dose is ineffective, a second dose of 12 mg can be given. Adenosine works by briefly blocking conduction through the AV node, which interrupts the re-entrant circuit that causes most SVTs. It has an ultra-short half-life of less than 10 seconds, making it both effective and safe. Synchronized cardioversion is reserved for unstable patients showing signs of hemodynamic compromise such as hypotension, altered mental status, chest pain, or acute heart failure. This patient is hemodynamically stable with adequate blood pressure and mental status. Amiodarone is used for wide-complex tachycardias or refractory arrhythmias, not as first-line for SVT. Diltiazem may be considered as a second-line agent for rate control but is not the initial intervention of choice. The emergency nurse should prepare adenosine in a syringe with a three-way stopcock setup for rapid administration, as the drug must reach the heart before being metabolized.",
    learningObjective: "Apply ACLS algorithm for stable narrow-complex tachycardia including vagal maneuvers and adenosine administration",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not cardiovert a stable SVT patient - adenosine is first-line for stable narrow-complex tachycardia",
    clinicalPearls: [
      "Modified Valsalva (bearing down in supine position then passively raising legs) has higher conversion rates than traditional Valsalva",
      "Adenosine must be given via rapid IV push through a proximal IV site closest to the heart",
      "Always have transcutaneous pacing pads ready when administering adenosine in case of prolonged pause",
      "Warn patients that adenosine causes a brief but alarming sensation of chest pressure and flushing"
    ],
    safetyNote: "Adenosine is contraindicated in patients with known Wolff-Parkinson-White syndrome with atrial fibrillation - can cause ventricular fibrillation",
    distractorRationales: [
      "Cardioversion is for unstable tachycardia; this patient has stable vitals",
      "Amiodarone is for wide-complex or refractory arrhythmias, not first-line SVT",
      "Diltiazem is second-line and slower onset; adenosine is preferred initial pharmacotherapy"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "A 72-year-old male with a history of heart failure presents to the ED in severe respiratory distress. Assessment reveals: bilateral crackles to the apices, pink frothy sputum, JVD, BP 198/110 mmHg, HR 118 bpm, RR 36, SpO2 82% on room air. Which combination of interventions should the emergency nurse implement immediately?",
    options: [
      "High-flow oxygen via non-rebreather mask, IV furosemide 40 mg, sublingual nitroglycerin, and position the patient upright with legs dependent",
      "Intubation, IV normal saline 500 mL bolus, and dopamine infusion",
      "CPAP at 10 cmH2O, IV morphine 4 mg, and IV metoprolol 5 mg",
      "BiPAP at 10/5 cmH2O, obtain chest X-ray before any treatment, and oral captopril 25 mg"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with acute decompensated heart failure with flash pulmonary edema, evidenced by severe dyspnea, bilateral crackles, pink frothy sputum, JVD, hypertension, and critically low oxygen saturation. The immediate management priorities follow the LMNOP mnemonic: Lasix (furosemide), Morphine (used cautiously), Nitroglycerin, Oxygen, and Position. High-flow oxygen via non-rebreather mask addresses the critical hypoxemia. If available, CPAP or BiPAP may be used, but oxygen delivery should not be delayed awaiting non-invasive ventilation setup. IV furosemide reduces preload through venodilation within 5 minutes (even before diuresis begins at 15-30 minutes) and removes excess fluid. Sublingual nitroglycerin rapidly reduces preload and afterload, decreasing myocardial oxygen demand and pulmonary congestion, and is particularly effective in hypertensive pulmonary edema. Upright positioning with legs dependent reduces venous return and decreases pulmonary congestion through gravitational redistribution of blood volume. IV fluid bolus is contraindicated as the patient is fluid overloaded. Intubation may become necessary but is not the first intervention when non-invasive measures can be tried first. IV morphine has fallen out of favor in acute heart failure guidelines due to increased mortality risk. Beta-blockers like metoprolol are contraindicated in acute decompensated heart failure as they can worsen cardiac output. Obtaining a chest X-ray should not delay life-saving interventions in this critically ill patient.",
    learningObjective: "Implement immediate nursing interventions for acute decompensated heart failure with pulmonary edema using the LMNOP approach",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Heart Failure Exacerbation",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Morphine was traditionally included in flash pulmonary edema management but current evidence shows increased mortality - avoid as first-line",
    clinicalPearls: [
      "LMNOP: Lasix, Morphine (cautious), Nitro, Oxygen, Position upright",
      "Furosemide causes venodilation within 5 minutes, before diuresis begins",
      "Nitroglycerin is particularly effective when pulmonary edema is accompanied by hypertension",
      "Non-invasive positive pressure ventilation (CPAP/BiPAP) reduces intubation rates in cardiogenic pulmonary edema"
    ],
    safetyNote: "Do not delay oxygen administration while setting up non-invasive ventilation in critically hypoxemic patients",
    distractorRationales: [
      "IV fluids and dopamine are contraindicated in fluid-overloaded patients with adequate blood pressure",
      "Morphine increases mortality risk in acute heart failure; metoprolol worsens acute decompensation",
      "Delaying treatment for chest X-ray is inappropriate in critical respiratory distress"
    ],
    lessonLink: "/emergency/lessons/cardiogenic-pulmonary-edema"
  },
  {
    stem: "During resuscitation of a cardiac arrest patient, the monitor shows ventricular fibrillation. The team has delivered two defibrillation shocks at 200J biphasic, administered epinephrine 1 mg IV, and continued high-quality CPR. The rhythm check after the third 2-minute cycle still shows ventricular fibrillation. What medication should the emergency nurse prepare next?",
    options: [
      "Epinephrine 1 mg IV",
      "Amiodarone 300 mg IV bolus",
      "Lidocaine 100 mg IV bolus",
      "Vasopressin 40 units IV"
    ],
    correctAnswer: 1,
    rationaleLong: "According to the ACLS cardiac arrest algorithm for shockable rhythms (VF/pVT), after the initial defibrillation attempt and 2 minutes of CPR, epinephrine is administered. After the second defibrillation and another 2 minutes of CPR, the antiarrhythmic amiodarone 300 mg IV push should be administered for refractory VF/pVT. This is the correct sequence: Shock -> CPR/Epi -> Shock -> CPR/Amiodarone -> Shock -> CPR/Epi (repeat). Amiodarone is the first-line antiarrhythmic for shock-refractory ventricular fibrillation. A second dose of 150 mg can be given if VF persists. The rationale for amiodarone over lidocaine is based on the ALIVE trial and subsequent studies showing improved survival to hospital admission with amiodarone. Epinephrine is given every 3-5 minutes (alternating cycles), so the next dose of epinephrine would follow the amiodarone in the subsequent cycle. Vasopressin is no longer recommended in the current ACLS guidelines as a replacement or alternative to epinephrine in cardiac arrest. Lidocaine may be used as an alternative to amiodarone if amiodarone is unavailable, but it is not the preferred first-line antiarrhythmic. The emergency nurse should have amiodarone pre-drawn and ready, as minimizing interruptions in CPR is critical for survival outcomes. High-quality chest compressions with a rate of 100-120/min, depth of at least 2 inches, and full chest recoil must be maintained throughout.",
    learningObjective: "Apply the ACLS VF/pVT algorithm to determine appropriate medication sequencing during cardiac arrest resuscitation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Arrest Management (ACLS)",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Epinephrine and amiodarone alternate in the VF/pVT algorithm - after epinephrine on the second cycle, amiodarone follows on the third cycle",
    clinicalPearls: [
      "VF/pVT algorithm: Shock-CPR/Epi-Shock-CPR/Amio-Shock-CPR/Epi (repeat)",
      "Amiodarone first dose 300 mg IV push, second dose 150 mg if needed",
      "Epinephrine every 3-5 minutes regardless of rhythm",
      "High-quality CPR (100-120/min, 2+ inches depth) is the most important intervention"
    ],
    safetyNote: "Never delay defibrillation for medication administration - shock delivery takes priority over any drug in VF/pVT",
    distractorRationales: [
      "Epinephrine was already given in the second cycle; amiodarone follows in the third",
      "Lidocaine is an alternative only if amiodarone is unavailable",
      "Vasopressin is no longer recommended in current ACLS guidelines"
    ],
    lessonLink: "/emergency/lessons/cardiac-arrest-acls"
  },
  {
    stem: "A 65-year-old female presents to the ED with sudden onset of tearing chest pain radiating to the back. BP in the right arm is 182/98 mmHg and in the left arm is 144/78 mmHg. HR 102 bpm, RR 24. The emergency nurse recognizes this presentation is most consistent with which condition?",
    options: [
      "Acute myocardial infarction",
      "Acute aortic dissection",
      "Pulmonary embolism",
      "Esophageal rupture"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation is classic for acute aortic dissection based on several key findings: sudden onset of severe tearing or ripping chest pain radiating to the back, and a significant blood pressure differential between the arms (>20 mmHg systolic). The blood pressure difference of 38 mmHg between the right and left arms indicates that the dissection flap is partially occluding blood flow to one of the subclavian arteries. Aortic dissection occurs when a tear in the aortic intima allows blood to enter the media, creating a false lumen that can propagate proximally or distally. Type A dissections involve the ascending aorta and are surgical emergencies with mortality rates of 1-2% per hour if untreated. Type B dissections involve the descending aorta and are typically managed medically. The emergency nurse should immediately obtain bilateral blood pressures in all patients presenting with acute chest pain, as this is a critical assessment that helps differentiate aortic dissection from acute coronary syndrome. While acute MI can present with chest pain, it typically does not cause blood pressure differentials between arms. Pulmonary embolism more commonly presents with pleuritic chest pain and dyspnea rather than tearing back pain. Esophageal rupture (Boerhaave syndrome) usually follows forceful vomiting and presents with subcutaneous emphysema. The priority nursing interventions for suspected aortic dissection include aggressive blood pressure control targeting SBP 100-120 mmHg using IV esmolol or labetalol, heart rate control to less than 60 bpm, pain management, and emergent CT angiography or TEE for definitive diagnosis.",
    learningObjective: "Identify the classic presentation of acute aortic dissection including bilateral blood pressure differential and tearing chest pain",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Aortic Dissection",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Blood pressure differential >20 mmHg between arms is a hallmark of aortic dissection, not MI or PE",
    clinicalPearls: [
      "Always check bilateral arm BPs in patients with acute chest/back pain",
      "Type A (ascending) dissections require emergent surgery; Type B (descending) are typically managed medically",
      "Target SBP 100-120 and HR <60 with IV beta-blockers as first-line",
      "D-dimer can be elevated in dissection but is not diagnostic"
    ],
    safetyNote: "Avoid thrombolytics and anticoagulation in suspected aortic dissection - can be fatal",
    distractorRationales: [
      "MI does not typically cause blood pressure differential between arms",
      "PE presents with pleuritic pain and dyspnea rather than tearing back pain with BP differential",
      "Esophageal rupture follows forceful vomiting and presents with subcutaneous emphysema"
    ],
    lessonLink: "/emergency/lessons/aortic-dissection"
  },
  {
    stem: "A 50-year-old male with known heart failure is brought to the ED by EMS after a witnessed cardiac arrest. ROSC was achieved after 12 minutes of CPR and 3 defibrillation shocks. Current vitals: BP 82/50 mmHg on norepinephrine 0.1 mcg/kg/min, HR 94 bpm, temp 36.8C, GCS 6 (E1V2M3). The 12-lead ECG shows ST elevation in leads V1-V4. Which post-ROSC intervention should the emergency nurse prioritize?",
    options: [
      "Initiate targeted temperature management (TTM) to 32-36C and defer cardiac catheterization",
      "Emergent cardiac catheterization for STEMI with concurrent TTM initiation",
      "Administer IV thrombolytics since the patient is too unstable for catheterization",
      "Obtain a CT head before any cardiac intervention to rule out neurological cause of arrest"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has achieved return of spontaneous circulation (ROSC) after cardiac arrest with a 12-lead ECG showing ST elevation in the anterior leads (V1-V4), consistent with an anterior STEMI that was likely the cause of the cardiac arrest. Current guidelines from the American Heart Association and European Resuscitation Council recommend emergent coronary angiography and percutaneous coronary intervention (PCI) for post-cardiac arrest patients with STEMI on their post-ROSC ECG, regardless of the patient's neurological status. Targeted temperature management (TTM) should be initiated concurrently with cardiac catheterization, not as a reason to defer reperfusion therapy. TTM involves maintaining the patient's core temperature between 32-36C for at least 24 hours to reduce neurological injury following cardiac arrest. This can be initiated in the ED using cold IV saline infusion and surface cooling devices while preparing for the cath lab. The patient should not be given IV thrombolytics when PCI is available, as primary PCI is superior to thrombolysis in STEMI management and the patient has already had CPR (relative contraindication to thrombolytics). While CT head may eventually be needed, it should not delay treatment of the STEMI, which is the likely cause of the arrest. The emergency nurse should coordinate simultaneous preparation for TTM (applying cooling devices, monitoring core temperature) and cath lab transfer. Hemodynamic support with vasopressors and potentially mechanical circulatory support should continue throughout.",
    learningObjective: "Coordinate post-ROSC care including concurrent TTM initiation and emergent cardiac catheterization for STEMI",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Post-ROSC Care",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "TTM should not delay emergent PCI in post-arrest STEMI - both should occur simultaneously",
    clinicalPearls: [
      "Post-ROSC STEMI requires emergent PCI regardless of neurological status",
      "TTM target 32-36C for at least 24 hours post-ROSC",
      "Initiate cooling in ED with cold saline and surface devices while preparing for cath lab",
      "Monitor for post-arrest syndrome: hemodynamic instability, neurological injury, and systemic inflammation"
    ],
    safetyNote: "Avoid hyperthermia (>37.5C) in post-ROSC patients as it worsens neurological outcomes",
    distractorRationales: [
      "TTM should not delay emergent catheterization for STEMI",
      "Thrombolytics are inferior to PCI and relatively contraindicated after CPR",
      "CT head should not delay treatment of the likely cardiac cause of arrest"
    ],
    lessonLink: "/emergency/lessons/post-rosc-care"
  },
  {
    stem: "A 42-year-old female post-motor vehicle collision presents to the ED with muffled heart sounds, JVD, and hypotension (BP 74/50 mmHg). The emergency nurse recognizes Beck's triad and suspects cardiac tamponade. Which assessment finding would further confirm this diagnosis?",
    options: [
      "Pulsus paradoxus greater than 10 mmHg",
      "Bilateral crackles on lung auscultation",
      "Unilateral absence of breath sounds",
      "Wide pulse pressure with bounding pulses"
    ],
    correctAnswer: 0,
    rationaleLong: "Cardiac tamponade is a life-threatening condition caused by fluid accumulation in the pericardial space that compresses the heart and impairs filling. Beck's triad consists of hypotension, muffled (distant) heart sounds, and jugular venous distension (JVD). An additional confirmatory finding is pulsus paradoxus, defined as a drop in systolic blood pressure greater than 10 mmHg during inspiration. In cardiac tamponade, the increased intrapericardial pressure limits cardiac expansion during the respiratory cycle. During inspiration, the right ventricle fills preferentially as intrathoracic pressure decreases, causing the interventricular septum to bow toward the left ventricle, further compromising left ventricular filling and stroke volume. This results in a greater-than-normal decrease in systolic blood pressure during inspiration. Pulsus paradoxus can be measured by inflating the blood pressure cuff above systolic pressure and slowly deflating while listening for Korotkoff sounds that initially appear only during expiration, then noting the pressure at which sounds are heard throughout the respiratory cycle. The difference between these two pressures is the pulsus paradoxus measurement. Bilateral crackles suggest pulmonary edema or pneumonia, not tamponade. Tamponade typically presents with clear lung sounds because the cardiac compression prevents pulmonary congestion. Unilateral absent breath sounds suggest pneumothorax, which should be considered in the differential for obstructive shock in trauma. Wide pulse pressure with bounding pulses is seen in aortic regurgitation or sepsis, not tamponade which causes narrow pulse pressure. The definitive treatment for cardiac tamponade is pericardiocentesis or surgical intervention.",
    learningObjective: "Identify pulsus paradoxus as a confirmatory finding in cardiac tamponade and understand its pathophysiology",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Tamponade",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Cardiac tamponade typically has CLEAR lung sounds despite JVD - bilateral crackles suggest heart failure, not tamponade",
    clinicalPearls: [
      "Beck's triad: hypotension, muffled heart sounds, JVD",
      "Pulsus paradoxus >10 mmHg supports tamponade diagnosis",
      "Tamponade has clear lungs despite JVD (distinguishes from heart failure)",
      "Bedside echocardiography is the fastest diagnostic tool for tamponade in the ED"
    ],
    safetyNote: "Cardiac tamponade in trauma is a surgical emergency requiring thoracotomy - do not delay for prolonged diagnostic workup",
    distractorRationales: [
      "Bilateral crackles indicate pulmonary edema, not tamponade - tamponade has clear lungs",
      "Unilateral absent breath sounds suggest pneumothorax, not tamponade",
      "Wide pulse pressure occurs in aortic regurgitation; tamponade causes narrow pulse pressure"
    ],
    lessonLink: "/emergency/lessons/cardiac-tamponade"
  },
  {
    stem: "An emergency nurse is performing a 12-lead ECG on a 68-year-old patient with chest pain. The ECG shows ST depression in leads V1-V3 with tall R waves. Which interpretation should the nurse communicate to the physician?",
    options: [
      "Normal variant with no clinical significance",
      "Posterior STEMI equivalent requiring emergent intervention",
      "Right bundle branch block pattern",
      "Left ventricular hypertrophy with strain pattern"
    ],
    correctAnswer: 1,
    rationaleLong: "ST depression in leads V1-V3 with tall R waves in a patient presenting with chest pain represents a posterior STEMI equivalent. The standard 12-lead ECG does not directly visualize the posterior wall of the heart. Instead, leads V1-V3 are positioned anteriorly and provide a mirror image of posterior electrical activity. Therefore, ST depression in these anterior leads actually represents ST elevation on the posterior wall, and tall R waves represent reciprocal Q waves of posterior infarction. This is a time-critical finding that requires the same urgency as any other STEMI presentation. The emergency nurse should immediately communicate this finding to the physician and prepare for emergent cardiac catheterization. Posterior leads (V7-V9) should be obtained to confirm the diagnosis; ST elevation of 0.5 mm or greater in these leads confirms posterior MI. Posterior STEMIs account for approximately 15-20% of all STEMIs and are frequently missed because providers may not recognize the reciprocal changes in the anterior leads. A right bundle branch block would show an rSR' pattern in V1 with a widened QRS, not ST depression with tall R waves. Left ventricular hypertrophy with strain typically shows increased voltage criteria with asymmetric ST-T wave changes, different from the pattern described. Missing a posterior STEMI leads to delayed reperfusion and increased mortality. The emergency nurse plays a critical role in ECG interpretation and timely recognition of STEMI equivalents.",
    learningObjective: "Recognize posterior STEMI equivalent ECG changes including ST depression and tall R waves in leads V1-V3",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "12-Lead ECG Interpretation",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ST depression in V1-V3 with chest pain is NOT simply ischemia - it is a posterior STEMI equivalent that needs emergent cath lab activation",
    clinicalPearls: [
      "ST depression V1-V3 + tall R waves = posterior STEMI equivalent",
      "Obtain posterior leads V7-V9 to confirm: ST elevation >= 0.5 mm confirms posterior MI",
      "Posterior STEMI is missed in up to 20% of cases due to non-standard ECG findings",
      "Always consider posterior MI when anterior ST depression seems out of proportion"
    ],
    safetyNote: "Posterior STEMIs have the same door-to-balloon time goals as all other STEMIs - do not delay activation",
    distractorRationales: [
      "This is not a normal variant - ST depression with tall R waves in V1-V3 with chest pain is pathological",
      "RBBB shows rSR' pattern with wide QRS, not ST depression with tall R waves",
      "LVH strain pattern has different morphology and voltage criteria"
    ],
    lessonLink: "/emergency/lessons/ecg-interpretation"
  },
  {
    stem: "A 78-year-old male presents to the ED with altered mental status and a heart rate of 34 bpm. The ECG shows third-degree (complete) heart block with a wide QRS escape rhythm. BP is 78/42 mmHg. Atropine 0.5 mg IV has been administered with no response. What is the next appropriate intervention?",
    options: [
      "Administer a second dose of atropine 1 mg IV",
      "Initiate transcutaneous pacing at a rate of 60-80 bpm",
      "Administer dopamine 2-5 mcg/kg/min",
      "Prepare for immediate defibrillation at 200J"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has symptomatic third-degree (complete) heart block with hemodynamic instability manifested by hypotension and altered mental status. The ECG shows a wide QRS escape rhythm, indicating the escape pacemaker is ventricular in origin (below the Bundle of His). Atropine has been administered without effect, which is expected because atropine works by enhancing conduction through the AV node and increasing sinus rate, but in complete heart block with a ventricular escape rhythm, the block is below the AV node where atropine cannot exert its parasympatholytic effect. The next appropriate intervention is transcutaneous pacing (TCP). TCP should be initiated at a rate of 60-80 bpm with increasing milliampere output until electrical capture is achieved (evidenced by a pacing spike followed by a wide QRS complex and a corresponding pulse). The patient should receive sedation and analgesia as TCP is painful. While awaiting TCP setup, a dopamine or epinephrine infusion can be started as a temporizing measure. Additional atropine is unlikely to be effective in infranodal block and the maximum dose is 3 mg total. Defibrillation is used for ventricular fibrillation or pulseless ventricular tachycardia, not for bradycardia. The emergency nurse should simultaneously prepare for transvenous pacing as a more definitive treatment and notify cardiology for potential permanent pacemaker placement. Capture should be verified by confirming a palpable pulse with each paced QRS complex, and the patient should be closely monitored for loss of capture.",
    learningObjective: "Implement transcutaneous pacing for symptomatic bradycardia unresponsive to atropine per ACLS bradycardia algorithm",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Pacing/Cardioversion/Defibrillation",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Atropine is often ineffective in complete heart block with wide QRS escape rhythm because the block is infranodal",
    clinicalPearls: [
      "Atropine is ineffective in infranodal blocks (wide QRS escape) - proceed to pacing",
      "TCP rate 60-80 bpm, increase mA until capture (spike + wide QRS + pulse)",
      "Provide sedation/analgesia for conscious patients during TCP",
      "Verify mechanical capture with pulse check, not just electrical capture on monitor"
    ],
    safetyNote: "Always verify mechanical capture (palpable pulse) after initiating transcutaneous pacing - electrical capture alone does not guarantee adequate cardiac output",
    distractorRationales: [
      "Additional atropine will not work in infranodal block with wide QRS escape",
      "Dopamine can be used as temporizing measure but pacing is the priority intervention",
      "Defibrillation is for VF/pVT, not bradycardia"
    ],
    lessonLink: "/emergency/lessons/pacing-cardioversion"
  },
  {
    stem: "A 55-year-old female presents to the ED with acute onset dyspnea, pleuritic chest pain, and right leg swelling 5 days after total knee replacement surgery. SpO2 88% on room air, HR 112 bpm, BP 98/62 mmHg, RR 28. The emergency nurse calculates a Wells score suggesting high probability for PE. Which diagnostic study is most appropriate?",
    options: [
      "D-dimer level",
      "CT pulmonary angiography (CTPA)",
      "Ventilation-perfusion (V/Q) scan",
      "Lower extremity Doppler ultrasound"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has a high clinical probability for pulmonary embolism based on the Wells score criteria: recent surgery (major orthopedic procedure within 4 weeks), unilateral leg swelling suggesting DVT, tachycardia, and classic PE symptoms of dyspnea and pleuritic chest pain. In patients with high clinical probability for PE, D-dimer testing is not appropriate as the initial diagnostic test because it cannot reliably exclude PE in high-probability patients. D-dimer has excellent sensitivity but poor specificity and is most useful for ruling out PE in low-to-moderate probability patients. The recommended diagnostic study for high-probability PE is CT pulmonary angiography (CTPA), which is the gold standard imaging modality with sensitivity and specificity both exceeding 95%. CTPA directly visualizes thrombus in the pulmonary arteries and can also identify alternative diagnoses. Given this patient's hemodynamic instability (hypotension, tachycardia), the emergency nurse should also prepare for potential thrombolytic therapy if massive PE is confirmed with hemodynamic compromise. A V/Q scan is an alternative when CTPA is contraindicated (such as contrast allergy or renal insufficiency) but is less definitive and takes longer to obtain. Lower extremity Doppler ultrasound can confirm DVT but does not diagnose PE directly, and a negative DVT study does not exclude PE. Bedside echocardiography can be used to assess for right ventricular strain as a rapid assessment while awaiting definitive imaging. The emergency nurse should establish two large-bore IVs, prepare for fluid resuscitation, and have vasopressors available.",
    learningObjective: "Select appropriate diagnostic testing based on Wells score probability assessment for pulmonary embolism",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "PE Management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "D-dimer is only useful for RULING OUT PE in low-to-moderate probability patients - it should not be ordered for high-probability PE",
    clinicalPearls: [
      "High Wells score -> skip D-dimer -> proceed directly to CTPA",
      "D-dimer is useful only for ruling out PE in low-moderate probability patients",
      "Bedside echo showing RV strain can support PE diagnosis while awaiting CTPA",
      "Recent surgery within 4 weeks is a major risk factor for VTE"
    ],
    safetyNote: "Hemodynamically unstable PE may require bedside thrombolytics - do not delay for imaging if patient is in extremis",
    distractorRationales: [
      "D-dimer cannot reliably exclude PE in high-probability patients",
      "V/Q scan is less definitive and takes longer; used when CTPA is contraindicated",
      "LE Doppler confirms DVT but does not diagnose PE; negative DVT does not exclude PE"
    ],
    lessonLink: "/emergency/lessons/pe-management"
  },
  {
    stem: "A 60-year-old male with a history of hypertension presents to the ED with severe headache, blurred vision, and chest pain. BP is 242/138 mmHg, HR 96 bpm. Fundoscopic exam reveals papilledema and flame hemorrhages. Urinalysis shows proteinuria. The emergency nurse should anticipate which blood pressure management strategy?",
    options: [
      "Rapidly reduce BP to 120/80 mmHg within 1 hour using IV labetalol",
      "Reduce mean arterial pressure by no more than 25% within the first hour using IV nicardipine or clevidipine infusion",
      "Administer oral amlodipine 10 mg and recheck BP in 4 hours",
      "Administer IV hydralazine 20 mg push and monitor for 30 minutes"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with a hypertensive emergency, defined as severely elevated blood pressure (>180/120 mmHg) with evidence of end-organ damage. The end-organ damage in this case includes hypertensive retinopathy (papilledema and flame hemorrhages suggesting grade III-IV changes), renal injury (proteinuria), and likely cardiac involvement (chest pain). The management of hypertensive emergency requires controlled, gradual blood pressure reduction. The guideline-recommended approach is to reduce the mean arterial pressure (MAP) by no more than 25% within the first hour, then to 160/100 mmHg over the next 2-6 hours, and then gradually normalize over 24-48 hours. Rapid reduction beyond these targets can cause watershed cerebral infarction, coronary ischemia, or renal failure due to impaired autoregulation in chronically hypertensive patients. IV nicardipine (5-15 mg/hr) or clevidipine (1-2 mg/hr initial) are preferred agents because they provide titratable, predictable blood pressure reduction with a smooth dose-response curve. IV labetalol is also acceptable but requires more careful dosing. Rapidly reducing to normal (120/80) within an hour is dangerous and can cause cerebral hypoperfusion. Oral medications are inappropriate for hypertensive emergencies because they have unpredictable absorption and cannot be titrated precisely. IV hydralazine has an unpredictable response, prolonged duration, and can cause reflex tachycardia. The emergency nurse should establish an arterial line for continuous BP monitoring and administer the titratable IV infusion via an infusion pump.",
    learningObjective: "Apply guideline-recommended blood pressure reduction targets for hypertensive emergency with end-organ damage",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Hypertensive Emergency",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do NOT normalize BP rapidly in hypertensive emergency - reduce MAP by no more than 25% in first hour to prevent watershed infarction",
    clinicalPearls: [
      "Reduce MAP by max 25% in first hour, then to 160/100 over 2-6 hours",
      "IV nicardipine or clevidipine are preferred for smooth, titratable control",
      "Rapid normalization can cause watershed cerebral infarction in chronically hypertensive patients",
      "Arterial line monitoring is recommended for precise BP management"
    ],
    safetyNote: "Rapidly dropping BP to normal levels in chronic hypertension can cause stroke, MI, or renal failure due to impaired autoregulation",
    distractorRationales: [
      "Rapid reduction to 120/80 risks watershed infarction from cerebral hypoperfusion",
      "Oral medications cannot be titrated and have unpredictable absorption in emergencies",
      "IV hydralazine has unpredictable duration and can cause dangerous reflex tachycardia"
    ],
    lessonLink: "/emergency/lessons/hypertensive-emergency"
  },
  {
    stem: "A 48-year-old male presents to the ED with chest pain that improves when leaning forward. ECG shows diffuse ST elevation with PR depression. Troponin is mildly elevated at 0.08 ng/mL. The emergency nurse should recognize this presentation as most consistent with which condition?",
    options: [
      "Acute STEMI requiring emergent catheterization",
      "Acute pericarditis with possible myopericarditis",
      "Aortic dissection with coronary involvement",
      "Stress (Takotsubo) cardiomyopathy"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation is classic for acute pericarditis with possible myopericarditis. The key distinguishing features include: (1) chest pain that improves with leaning forward and worsens when supine, which is pathognomonic for pericardial inflammation; (2) diffuse ST elevation (not confined to a single coronary artery territory as in STEMI); (3) PR depression, which is a highly specific ECG finding for pericarditis caused by inflammation of the atrial myocardium; and (4) mildly elevated troponin suggesting some myocardial involvement (myopericarditis). In STEMI, ST elevation follows a coronary artery distribution with reciprocal ST depression, and pain does not typically change with position. The PR segment depression distinguishes pericarditis from STEMI. Aortic dissection presents with tearing pain radiating to the back with blood pressure differentials between arms. Takotsubo cardiomyopathy typically presents with apical ballooning on echocardiography triggered by emotional or physical stress, with ECG changes mimicking anterior STEMI. The management of acute pericarditis differs significantly from STEMI. Treatment includes NSAIDs (ibuprofen 600-800 mg TID) combined with colchicine (0.5 mg BID) to reduce inflammation and prevent recurrence. Patients should be monitored for complications including pericardial effusion and tamponade. The emergency nurse should obtain echocardiography to assess for effusion and ensure the patient does not receive anticoagulation or thrombolytics, which could cause hemorrhagic pericardial effusion and tamponade. Inappropriate cath lab activation for pericarditis wastes resources and subjects the patient to unnecessary procedure risks.",
    learningObjective: "Differentiate acute pericarditis from STEMI based on positional pain relief, diffuse ST elevation, and PR depression",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "STEMI/NSTEMI Recognition",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Diffuse ST elevation + PR depression = pericarditis, NOT STEMI. STEMI has territorial ST changes with reciprocal depression",
    clinicalPearls: [
      "Pericarditis: positional pain (better leaning forward), diffuse ST elevation, PR depression",
      "PR depression is highly specific for pericarditis",
      "Mild troponin elevation in pericarditis suggests myocardial involvement (myopericarditis)",
      "Treatment: NSAIDs + colchicine; avoid anticoagulation"
    ],
    safetyNote: "Do not administer anticoagulants or thrombolytics for pericarditis - risk of hemorrhagic pericardial effusion and tamponade",
    distractorRationales: [
      "STEMI has territorial ST changes with reciprocal depression, not diffuse ST elevation with PR depression",
      "Aortic dissection presents with tearing back pain and BP differentials, not positional relief",
      "Takotsubo mimics anterior STEMI on ECG but is triggered by emotional/physical stress"
    ],
    lessonLink: "/emergency/lessons/stemi-management"
  },
  {
    stem: "During synchronized cardioversion of a patient with unstable atrial fibrillation with rapid ventricular response, the monitor shows the shock was delivered but the rhythm did not convert. What should the emergency nurse do next?",
    options: [
      "Immediately repeat cardioversion at the same energy level",
      "Increase the energy level and repeat synchronized cardioversion after ensuring proper pad placement and gel contact",
      "Switch to unsynchronized defibrillation at maximum energy",
      "Discontinue cardioversion attempts and start IV amiodarone"
    ],
    correctAnswer: 1,
    rationaleLong: "When the initial synchronized cardioversion attempt fails to convert the rhythm, the appropriate next step is to increase the energy level for the subsequent attempt while also verifying proper pad placement and ensuring good contact between the pads and the patient's skin. For atrial fibrillation, the initial recommended energy for synchronized cardioversion with a biphasic defibrillator is 120-200 joules. If the initial shock fails, the energy should be increased in a stepwise fashion. Before delivering the next shock, the emergency nurse should verify that the sync mode is still engaged (as some defibrillators reset to unsynchronized mode after each discharge), ensure the pads are placed correctly in the anterolateral or anteroposterior position with good skin contact, and confirm that no gel or sweat is interfering with pad adhesion. The sync marker should be visible on each R wave on the monitor. Switching to unsynchronized defibrillation for atrial fibrillation is dangerous because delivering a shock during the relative refractory period (T wave) could induce ventricular fibrillation. Unsynchronized defibrillation should only be used when the patient is in a lethal rhythm (VF/pVT) or when sync mode cannot detect QRS complexes reliably. Discontinuing cardioversion and switching to amiodarone alone may be appropriate if multiple cardioversion attempts fail, but it should not be the immediate next step after a single failed attempt. The emergency nurse should also ensure adequate sedation is maintained for the patient during additional cardioversion attempts.",
    learningObjective: "Manage failed synchronized cardioversion by escalating energy while maintaining synchronization and verifying technique",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Pacing/Cardioversion/Defibrillation",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "After failed cardioversion, verify sync mode is still engaged - many defibrillators reset to unsynchronized mode after shock delivery",
    clinicalPearls: [
      "Escalate energy in stepwise fashion after failed cardioversion",
      "Always recheck sync mode after each shock - many devices auto-reset",
      "Anteroposterior pad placement may be more effective than anterolateral",
      "Ensure adequate sedation before repeated cardioversion attempts"
    ],
    safetyNote: "Never use unsynchronized defibrillation for organized rhythms - risk of R-on-T phenomenon causing ventricular fibrillation",
    distractorRationales: [
      "Repeating at the same energy level without optimization is unlikely to succeed",
      "Unsynchronized defibrillation risks inducing VF from R-on-T phenomenon",
      "Amiodarone may be considered after multiple failed attempts but not after a single failure"
    ],
    lessonLink: "/emergency/lessons/pacing-cardioversion"
  },
  {
    stem: "A 38-year-old female presents to the ED 2 days postpartum with sudden onset of severe dyspnea, orthopnea, and lower extremity edema. Echocardiography reveals an ejection fraction of 25%. She has no prior cardiac history. The emergency nurse should recognize this presentation as which condition?",
    options: [
      "Peripartum cardiomyopathy",
      "Pulmonary embolism",
      "Postpartum preeclampsia",
      "Acute myocardial infarction"
    ],
    correctAnswer: 0,
    rationaleLong: "This presentation is consistent with peripartum cardiomyopathy (PPCM), defined as heart failure with reduced ejection fraction (EF <45%) occurring in the last month of pregnancy or within 5 months after delivery in a woman without prior heart disease or identifiable cause. The severely reduced EF of 25% with symptoms of heart failure (dyspnea, orthopnea, lower extremity edema) in a postpartum patient without prior cardiac history is the hallmark of PPCM. This is a potentially life-threatening condition with an incidence of approximately 1 in 1,000-4,000 pregnancies. Risk factors include advanced maternal age, multiparity, multiple gestation, preeclampsia, and African descent. The emergency nurse should initiate standard heart failure management with diuretics, vasodilators, and oxygen. However, ACE inhibitors and ARBs, which are mainstays of heart failure treatment, are safe postpartum but were contraindicated during pregnancy. If the patient is breastfeeding, medication selection should consider excretion in breast milk. Anticoagulation should be considered due to the high risk of intracardiac thrombus with severely reduced EF. Pulmonary embolism is in the differential for postpartum dyspnea but would not typically cause a reduced EF on echocardiography. Preeclampsia can persist postpartum but presents with hypertension and proteinuria rather than primary systolic dysfunction. Acute MI in a 38-year-old female without risk factors is unlikely and would not present with global hypokinesis and reduced EF. PPCM can progress to requiring mechanical circulatory support or heart transplantation, so early recognition and appropriate consultation with cardiology is essential.",
    learningObjective: "Recognize peripartum cardiomyopathy as a cause of new-onset heart failure in the peripartum period",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Heart Failure Exacerbation",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "New heart failure symptoms in a peripartum patient with no prior cardiac history should raise immediate suspicion for peripartum cardiomyopathy",
    clinicalPearls: [
      "PPCM: heart failure with EF <45% in last month of pregnancy to 5 months postpartum",
      "Risk factors: advanced age, multiparity, preeclampsia, African descent",
      "ACE inhibitors are safe postpartum but were contraindicated during pregnancy",
      "Consider anticoagulation with severely reduced EF due to thrombus risk"
    ],
    safetyNote: "PPCM can rapidly deteriorate to cardiogenic shock requiring mechanical circulatory support - early cardiology consultation is essential",
    distractorRationales: [
      "PE causes dyspnea but would not cause reduced EF on echocardiography",
      "Preeclampsia presents with hypertension and proteinuria, not systolic dysfunction",
      "Acute MI in a young female without risk factors would not cause global hypokinesis"
    ],
    lessonLink: "/emergency/lessons/heart-failure-management"
  },
  {
    stem: "An emergency nurse is monitoring a patient on a continuous cardiac monitor who develops the following rhythm: wide-complex tachycardia at 180 bpm, regular, monomorphic QRS morphology. The patient is diaphoretic with BP 86/54 mmHg and altered mental status. What is the immediate intervention?",
    options: [
      "Administer adenosine 6 mg rapid IV push",
      "Administer amiodarone 150 mg IV over 10 minutes",
      "Perform synchronized cardioversion starting at 100 joules biphasic",
      "Administer IV magnesium 2 grams over 10 minutes"
    ],
    correctAnswer: 2,
    rationaleLong: "This patient presents with unstable monomorphic ventricular tachycardia (VT), evidenced by a wide-complex regular tachycardia at 180 bpm with hemodynamic instability (hypotension, diaphoresis, and altered mental status). According to ACLS guidelines, any tachyarrhythmia with signs of hemodynamic instability requires immediate synchronized cardioversion. Signs of instability include hypotension, altered mental status, signs of shock, ischemic chest pain, and acute heart failure. The recommended initial energy for synchronized cardioversion of monomorphic VT with a biphasic defibrillator is 100 joules, escalating if unsuccessful. Sedation should be provided if time permits and the patient's condition allows, but cardioversion should not be delayed for sedation in a critically unstable patient. Adenosine should not be administered for wide-complex tachycardia unless it is clearly established as SVT with aberrant conduction, as adenosine can cause degeneration to ventricular fibrillation in true VT. IV amiodarone is the appropriate pharmacological treatment for stable wide-complex tachycardia, but this patient is unstable and requires electrical cardioversion first. Magnesium is used for torsades de pointes (polymorphic VT with prolonged QT), not monomorphic VT. The emergency nurse must ensure the defibrillator is in sync mode, verify the sync marker is tracking QRS complexes appropriately, and prepare to deliver the shock. If the patient deteriorates to pulseless VT or VF, the nurse should immediately switch to unsynchronized defibrillation.",
    learningObjective: "Perform immediate synchronized cardioversion for unstable monomorphic ventricular tachycardia",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Unstable = cardiovert. Do not waste time with medications when the patient is hemodynamically compromised with a tachyarrhythmia",
    clinicalPearls: [
      "Unstable tachycardia signs: hypotension, altered mental status, shock, chest pain, acute HF",
      "Monomorphic VT cardioversion starts at 100J biphasic",
      "Do not delay cardioversion for sedation in critically unstable patients",
      "If patient becomes pulseless, immediately switch to unsynchronized defibrillation"
    ],
    safetyNote: "Verify sync mode before cardioversion - unsynchronized shock during VT can cause VF",
    distractorRationales: [
      "Adenosine can degenerate VT to VF and should not be used for wide-complex tachycardia",
      "Amiodarone is for stable VT; this patient is hemodynamically unstable requiring cardioversion",
      "Magnesium is for torsades de pointes (polymorphic VT), not monomorphic VT"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "A 70-year-old patient with a permanent pacemaker presents to the ED with dizziness and near-syncope. The ECG shows pacing spikes not followed by QRS complexes intermittently, with the patient's native rhythm at 38 bpm. What does this ECG finding indicate?",
    options: [
      "Normal pacemaker function with appropriate sensing",
      "Failure to capture requiring evaluation and possible transcutaneous pacing",
      "Pacemaker oversensing leading to inappropriate inhibition",
      "Electromagnetic interference causing artifact"
    ],
    correctAnswer: 1,
    rationaleLong: "Pacing spikes not followed by QRS complexes indicate failure to capture, meaning the pacemaker is firing but the electrical stimulus is not depolarizing the myocardium to produce a mechanical contraction. This is a potentially life-threatening pacemaker malfunction, especially when the patient's intrinsic rate is inadequate (38 bpm in this case, causing symptoms of dizziness and near-syncope). Failure to capture can result from several causes: lead dislodgement, lead fracture, battery depletion, elevated pacing threshold due to fibrosis at the lead tip, metabolic abnormalities (hyperkalemia, acidosis), or medication effects (flecainide, propafenone). The emergency nurse should immediately prepare for transcutaneous pacing as a backup while the pacemaker issue is being evaluated. The patient needs continuous monitoring, IV access, and cardiology consultation for interrogation of the pacemaker device. The nurse should check for recent changes in medications, electrolyte levels (particularly potassium and magnesium), and any recent procedures that could have caused lead dislodgement. Normal pacemaker function would show pacing spikes followed by appropriate QRS complexes. Pacemaker oversensing would result in inappropriate inhibition of pacing output, meaning fewer pacing spikes than expected, not spikes without capture. Electromagnetic interference typically causes irregular, multiple artifacts rather than discrete pacing spikes. A chest X-ray should be obtained to evaluate lead position and integrity.",
    learningObjective: "Identify pacemaker failure to capture on ECG and implement appropriate emergency interventions",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Pacing/Cardioversion/Defibrillation",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Pacing spikes WITHOUT following QRS = failure to capture. Pacing spikes WITH QRS = appropriate function. No pacing spikes when expected = failure to fire or oversensing",
    clinicalPearls: [
      "Failure to capture: pacing spikes present but no following QRS complex",
      "Common causes: lead dislodgement, battery depletion, hyperkalemia, fibrosis",
      "Have transcutaneous pacing ready as backup for symptomatic pacemaker failure",
      "Check electrolytes (K+, Mg2+) and recent medication changes"
    ],
    safetyNote: "Place a magnet over the pacemaker to switch to asynchronous mode only if device is under-sensing - consult cardiology before magnet application",
    distractorRationales: [
      "Normal function would show pacing spikes followed by QRS complexes",
      "Oversensing causes inhibition of pacing output, not spikes without capture",
      "EMI causes irregular artifacts, not discrete pacing spikes"
    ],
    lessonLink: "/emergency/lessons/pacing-cardioversion"
  },
  {
    stem: "A 62-year-old male with a history of coronary artery disease presents to the ED with chest pressure, diaphoresis, and nausea for 45 minutes. The initial troponin is negative. The 12-lead ECG shows no ST elevation. The emergency nurse should understand that this presentation:",
    options: [
      "Rules out acute coronary syndrome since troponin is negative and ECG shows no STEMI",
      "Could represent an NSTEMI or unstable angina requiring serial troponins and monitoring",
      "Requires no further cardiac workup and the patient can be discharged",
      "Should be treated with thrombolytic therapy empirically"
    ],
    correctAnswer: 1,
    rationaleLong: "A negative initial troponin does NOT rule out acute coronary syndrome (ACS). Troponin levels may not become detectable until 3-6 hours after the onset of myocardial injury, and in some patients, elevation may not peak for 12-24 hours. This patient presents with classic ACS symptoms (chest pressure, diaphoresis, nausea) which mandate a thorough evaluation regardless of the initial ECG and troponin results. The patient could have either NSTEMI (which will show troponin elevation on serial testing) or unstable angina (which may never show troponin elevation). Serial troponin measurements should be obtained at 3-6 hour intervals to evaluate for evolving myocardial injury. The patient should be placed on continuous cardiac monitoring, given aspirin 325 mg (if not already administered), nitroglycerin for pain as appropriate, and possibly heparin anticoagulation. A repeat 12-lead ECG should be obtained if symptoms change or recur. The emergency nurse should monitor for dynamic ST-T wave changes that may indicate active ischemia. Risk stratification tools such as the HEART score or TIMI risk score should be used to guide further management decisions including admission, stress testing, or cardiac catheterization. Thrombolytic therapy is only indicated for STEMI when PCI is not available in a timely manner; it should never be given empirically for non-STEMI ACS as it does not improve outcomes and increases bleeding risk. Discharging a patient with ongoing ACS symptoms and a single negative troponin is a dangerous practice that could result in adverse outcomes.",
    learningObjective: "Recognize that a single negative troponin does not rule out ACS and serial troponin measurement is essential",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "STEMI/NSTEMI Recognition",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A single negative troponin NEVER rules out ACS - troponin may not elevate for 3-6 hours after symptom onset",
    clinicalPearls: [
      "Initial troponin can be negative in early MI - serial testing at 3-6 hour intervals is essential",
      "High-sensitivity troponin allows for earlier detection but still requires serial measurement",
      "HEART score helps risk-stratify chest pain patients for disposition decisions",
      "Dynamic ST-T changes on serial ECGs may indicate active ischemia even without STEMI criteria"
    ],
    safetyNote: "Never discharge a patient with ongoing ACS symptoms based on a single negative troponin - missed MI is a leading cause of ED malpractice claims",
    distractorRationales: [
      "A single negative troponin does not rule out ACS; serial testing is required",
      "Discharge without complete workup is dangerous and a leading cause of malpractice",
      "Thrombolytics are only for STEMI; never given empirically for non-STEMI presentations"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndrome"
  },
  {
    stem: "A patient in the ED develops polymorphic ventricular tachycardia (torsades de pointes) on the cardiac monitor. The QTc interval on the prior ECG was 580 ms. The patient is currently pulseless. What is the priority intervention?",
    options: [
      "Administer IV amiodarone 300 mg push",
      "Perform unsynchronized defibrillation and administer IV magnesium sulfate 2 grams",
      "Administer IV procainamide 20 mg/min",
      "Initiate transcutaneous overdrive pacing at 100 bpm"
    ],
    correctAnswer: 1,
    rationaleLong: "Pulseless torsades de pointes (TdP) is a medical emergency that requires immediate unsynchronized defibrillation because the patient has no pulse, making this a cardiac arrest situation. Standard ACLS cardiac arrest protocols apply: high-quality CPR and defibrillation are the immediate priorities. However, TdP has a unique pharmacological treatment: IV magnesium sulfate 2 grams administered over 1-2 minutes. Magnesium stabilizes the cardiac cell membrane and reduces the early afterdepolarizations that trigger TdP. Magnesium should be administered as soon as possible during resuscitation efforts. Torsades de pointes is a specific form of polymorphic ventricular tachycardia associated with a prolonged QT interval (>500 ms). The prolonged QT interval leads to early afterdepolarizations that trigger the characteristic twisting-of-the-points morphology on the ECG. Amiodarone, while standard for VF/pVT arrest, actually PROLONGS the QT interval and can worsen TdP. It should be avoided in the setting of known QT prolongation and TdP. Similarly, procainamide prolongs the QT interval and is contraindicated. Isoproterenol infusion or transcutaneous overdrive pacing can be used for recurrent TdP in patients WITH a pulse, as increasing the heart rate shortens the QT interval and suppresses the trigger for TdP. However, this patient is pulseless, so defibrillation is the priority. The emergency nurse should also review the patient's medication list for QT-prolonging drugs and check electrolytes, as hypokalemia and hypomagnesemia predispose to TdP.",
    learningObjective: "Manage pulseless torsades de pointes with defibrillation and IV magnesium sulfate while avoiding QT-prolonging medications",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Arrest Management (ACLS)",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Amiodarone PROLONGS QT and worsens torsades de pointes - magnesium is the antiarrhythmic of choice for TdP",
    clinicalPearls: [
      "TdP = polymorphic VT + prolonged QT; magnesium is the treatment",
      "Amiodarone and procainamide prolong QT and worsen TdP - AVOID",
      "For TdP with a pulse: isoproterenol or overdrive pacing to shorten QT",
      "QTc > 500 ms is high risk for TdP - review medications and electrolytes"
    ],
    safetyNote: "Review all medications for QT prolongation when TdP occurs - common culprits include haloperidol, ondansetron, fluoroquinolones, and methadone",
    distractorRationales: [
      "Amiodarone prolongs QT interval and worsens TdP - contraindicated",
      "Procainamide prolongs QT interval and is contraindicated in TdP",
      "Overdrive pacing is for TdP with a pulse, not pulseless cardiac arrest"
    ],
    lessonLink: "/emergency/lessons/cardiac-arrest-acls"
  },
  {
    stem: "A 55-year-old male with acute anterior STEMI arrives at a non-PCI-capable facility. The estimated transfer time to the nearest PCI center is 150 minutes. According to current guidelines, what is the recommended reperfusion strategy?",
    options: [
      "Wait for transfer to PCI center since primary PCI is always superior",
      "Administer fibrinolytic therapy within 30 minutes and arrange transfer for rescue PCI if needed",
      "Start heparin infusion only and transfer emergently",
      "Administer half-dose fibrinolytic with GP IIb/IIIa inhibitor before transfer"
    ],
    correctAnswer: 1,
    rationaleLong: "When the estimated first medical contact-to-balloon time exceeds 120 minutes and the patient presents within the fibrinolytic window (ideally within 12 hours of symptom onset), current AHA/ACC guidelines recommend fibrinolytic therapy as the reperfusion strategy. The door-to-needle time for fibrinolytic administration should be within 30 minutes of arrival. While primary PCI is the preferred reperfusion strategy when it can be performed in a timely manner, the benefit of PCI over fibrinolysis diminishes when there are significant delays. In this case, with a 150-minute transfer time, the total first medical contact-to-balloon time would far exceed the 120-minute threshold. The recommended approach is a pharmacoinvasive strategy: administer fibrinolytic therapy at the presenting facility, then transfer the patient to a PCI-capable center for coronary angiography within 3-24 hours or immediately if fibrinolysis fails (rescue PCI). Signs of failed fibrinolysis include persistent ST elevation, ongoing chest pain, and hemodynamic instability at 60-90 minutes post-fibrinolytic administration. The emergency nurse should verify the absence of contraindications to fibrinolytics (active bleeding, recent surgery, history of hemorrhagic stroke, etc.), administer the fibrinolytic agent as ordered, and prepare the patient for transfer. Simply waiting for transfer without reperfusion therapy wastes valuable myocardial tissue. Heparin alone does not achieve reperfusion. Half-dose fibrinolytic with GP IIb/IIIa inhibitor combination has not shown benefit and increases bleeding risk.",
    learningObjective: "Apply the pharmacoinvasive strategy for STEMI reperfusion when PCI cannot be performed within 120 minutes",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "STEMI/NSTEMI Recognition",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "When FMC-to-balloon time exceeds 120 minutes, fibrinolysis within 30 minutes + transfer for angiography is the correct pharmacoinvasive approach",
    clinicalPearls: [
      "FMC-to-balloon >120 min = consider fibrinolysis if within treatment window",
      "Door-to-needle time for fibrinolytics should be <30 minutes",
      "Transfer for angiography within 3-24 hours post-fibrinolysis (pharmacoinvasive strategy)",
      "Signs of failed fibrinolysis at 60-90 min: persistent ST elevation, ongoing pain"
    ],
    safetyNote: "Screen carefully for fibrinolytic contraindications: active bleeding, recent surgery within 3 weeks, hemorrhagic stroke history, BP >180/110",
    distractorRationales: [
      "Waiting for transfer wastes time when FMC-to-balloon exceeds 120 minutes",
      "Heparin alone does not achieve reperfusion of the occluded coronary artery",
      "Half-dose fibrinolytic + GP IIb/IIIa combination increases bleeding without benefit"
    ],
    lessonLink: "/emergency/lessons/stemi-management"
  },
  {
    stem: "An emergency nurse is assessing a patient who reports taking metoprolol, lisinopril, and warfarin. The patient's ECG shows atrial fibrillation with controlled ventricular rate of 78 bpm. INR is 4.8. The patient has no active bleeding but reports persistent epistaxis this morning. What is the priority nursing intervention?",
    options: [
      "Administer vitamin K 10 mg IV immediately and fresh frozen plasma",
      "Hold warfarin and administer vitamin K 2.5-5 mg PO with close monitoring and repeat INR in 24 hours",
      "Administer prothrombin complex concentrate (PCC) for immediate reversal",
      "Observe without intervention as the INR will normalize after holding warfarin"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has a supratherapeutic INR of 4.8 with minor bleeding (epistaxis without hemodynamic compromise). According to the American College of Chest Physicians guidelines, management of elevated INR depends on the level of elevation and the presence and severity of bleeding. For INR 4.5-10 without major bleeding, the recommended approach is to hold warfarin and administer oral vitamin K in a dose of 2.5-5 mg. Oral vitamin K provides more predictable and gradual reversal compared to IV administration. The INR should be rechecked in 24 hours, and warfarin can be restarted at a reduced dose once the INR returns to the therapeutic range. IV vitamin K 10 mg is reserved for patients with major, life-threatening bleeding where rapid reversal is needed. However, IV vitamin K should be administered slowly due to the risk of anaphylactoid reactions, and large doses can make the patient resistant to re-anticoagulation for days to weeks. Prothrombin complex concentrate (PCC) or fresh frozen plasma (FFP) is reserved for major/life-threatening bleeding requiring immediate reversal, such as intracranial hemorrhage or active GI bleeding with hemodynamic instability. Simply observing without any intervention is inappropriate because the INR is significantly supratherapeutic and the patient has active (minor) bleeding. The emergency nurse should also apply direct pressure for the epistaxis, verify the patient's medication list for drug interactions that may have caused the INR elevation, and educate the patient about dietary and medication interactions with warfarin.",
    learningObjective: "Manage supratherapeutic INR with minor bleeding using appropriate vitamin K dosing and warfarin management",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "INR 4.5-10 with minor bleeding = hold warfarin + oral vitamin K 2.5-5 mg. Reserve IV vitamin K and PCC for life-threatening hemorrhage",
    clinicalPearls: [
      "INR 4.5-10 without major bleed: hold warfarin + oral vitamin K 2.5-5 mg",
      "INR >10 without bleeding: hold warfarin + vitamin K 5-10 mg PO",
      "Life-threatening bleed: IV vitamin K + PCC or FFP for immediate reversal",
      "Check for drug interactions causing supratherapeutic INR (antibiotics, NSAIDs, etc.)"
    ],
    safetyNote: "IV vitamin K can cause anaphylactoid reactions - administer slowly over 20-30 minutes and only for life-threatening bleeding",
    distractorRationales: [
      "IV vitamin K 10 mg + FFP is for life-threatening bleeding, not minor epistaxis",
      "PCC is reserved for major hemorrhage requiring immediate reversal",
      "Observation alone is inappropriate with supratherapeutic INR and active bleeding"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "A 28-year-old male presents to the ED after a motor vehicle collision with a steering wheel impact to the chest. He is restless, tachycardic (HR 130 bpm), and hypotensive (BP 72/40 mmHg). Point-of-care ultrasound (POCUS) reveals a pericardial effusion with right ventricular diastolic collapse. What is the definitive emergency intervention?",
    options: [
      "Aggressive IV fluid resuscitation with 2 liters of normal saline",
      "Emergency pericardiocentesis or thoracotomy",
      "Administration of IV epinephrine 1 mg push",
      "Bilateral chest tube insertion"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has traumatic cardiac tamponade, confirmed by the POCUS findings of pericardial effusion with right ventricular diastolic collapse in the setting of penetrating or blunt chest trauma with hemodynamic instability. The definitive treatment for traumatic cardiac tamponade is emergency pericardiocentesis (needle drainage of pericardial fluid) or emergency department thoracotomy (EDT). In the trauma setting, EDT is often preferred over pericardiocentesis because traumatic tamponade is frequently caused by cardiac injury that requires surgical repair, and the pericardial blood may be clotted, making needle aspiration difficult. Pericardiocentesis can provide temporary stabilization by removing even 15-20 mL of pericardial fluid, which can significantly improve cardiac output while preparing for definitive surgical intervention. IV fluid resuscitation is a temporizing measure that increases preload and may transiently improve cardiac output, but it does not address the underlying problem and should not delay definitive intervention. The emergency nurse should establish large-bore IV access and begin fluid resuscitation while simultaneously preparing for pericardiocentesis or thoracotomy. IV epinephrine 1 mg push is inappropriate as the patient has a pulse; epinephrine infusion may be used for hemodynamic support but does not treat the mechanical cause. Bilateral chest tubes are for tension pneumothorax or hemothorax, not cardiac tamponade. The nurse should prepare a pericardiocentesis tray with an 18-gauge spinal needle, 60 mL syringe, and have bedside ultrasound for guidance. Massive transfusion protocol should be activated for this hemodynamically unstable trauma patient.",
    learningObjective: "Implement emergency interventions for traumatic cardiac tamponade including pericardiocentesis or thoracotomy",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Tamponade",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Traumatic tamponade often requires thoracotomy rather than pericardiocentesis because blood may be clotted and cardiac injury needs repair",
    clinicalPearls: [
      "RV diastolic collapse on POCUS is an early and specific sign of tamponade physiology",
      "Removing as little as 15-20 mL of pericardial fluid can dramatically improve hemodynamics",
      "IV fluids are a temporizing bridge but not definitive treatment for tamponade",
      "Traumatic tamponade blood is often clotted, making needle aspiration less effective"
    ],
    safetyNote: "Do not delay pericardiocentesis for imaging studies in hemodynamically unstable patients with confirmed tamponade on POCUS",
    distractorRationales: [
      "IV fluids are temporizing only and do not address the mechanical compression",
      "IV epinephrine push is for cardiac arrest, not tamponade with a pulse",
      "Chest tubes treat pneumothorax/hemothorax, not pericardial effusion"
    ],
    lessonLink: "/emergency/lessons/cardiac-tamponade"
  },
  {
    stem: "A 74-year-old female with diabetes presents to the ED feeling 'generally unwell' with nausea, fatigue, and mild shortness of breath but denies chest pain. Her ECG shows new ST depression in leads V4-V6 and troponin I is elevated at 2.4 ng/mL. Which statement best explains this presentation?",
    options: [
      "The patient is not having an acute coronary event because there is no chest pain",
      "This represents an atypical NSTEMI presentation commonly seen in diabetic and elderly patients",
      "The troponin elevation is likely due to sepsis rather than cardiac ischemia",
      "The ST depression is a normal finding in elderly patients and requires no intervention"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is presenting with an atypical NSTEMI (Non-ST Elevation Myocardial Infarction). Atypical presentations of ACS are common in certain patient populations, including elderly patients, women, diabetic patients, and those with chronic kidney disease. Diabetic patients frequently have diabetic neuropathy affecting cardiac pain fibers (cardiac autonomic neuropathy), which blunts the perception of ischemic chest pain. Instead, they may present with vague symptoms such as general malaise, nausea, fatigue, dyspnea, or confusion - often described as 'atypical equivalents' of angina. The combination of new ST depression in leads V4-V6 and elevated troponin I at 2.4 ng/mL (significantly above normal of <0.04 ng/mL) in a patient with cardiac risk factors (diabetes, advanced age) strongly indicates an acute myocardial infarction. Up to 30-40% of patients with acute MI may not present with classic chest pain, and this percentage is even higher in diabetic patients. The emergency nurse must maintain a high index of suspicion for ACS in these populations even when the chief complaint does not include chest pain. The nursing assessment should include asking about dyspnea equivalents, changes in exercise tolerance, and other subtle symptoms. While sepsis can cause demand ischemia and troponin elevation, the degree of elevation (2.4 ng/mL) combined with new ECG changes strongly favors a primary cardiac event. ST depression in the setting of elevated troponin is pathological and requires treatment, not observation. This patient should receive full ACS protocol including antiplatelet therapy, anticoagulation, serial troponins, and cardiology consultation.",
    learningObjective: "Recognize atypical presentations of NSTEMI in diabetic and elderly populations who may not present with chest pain",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "STEMI/NSTEMI Recognition",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Absence of chest pain does NOT rule out MI, especially in diabetic, elderly, and female patients - always consider atypical presentations",
    clinicalPearls: [
      "30-40% of MI patients present without classic chest pain",
      "Diabetic neuropathy blunts cardiac pain perception",
      "Dyspnea is the most common anginal equivalent in atypical ACS presentations",
      "Elderly, female, and diabetic patients have the highest rates of atypical presentation"
    ],
    safetyNote: "Maintain high index of suspicion for ACS in diabetic patients with vague symptoms - missed atypical MI has high mortality",
    distractorRationales: [
      "Absence of chest pain does not rule out ACS; atypical presentations are common",
      "While sepsis can cause troponin elevation, new ST changes + high troponin favors primary MI",
      "ST depression with troponin elevation is never a 'normal finding' regardless of age"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndrome"
  },
  {
    stem: "A patient on a heparin drip for acute coronary syndrome develops heparin-induced thrombocytopenia (HIT). The platelet count has dropped from 240,000 to 78,000 over 5 days. What should the emergency nurse do immediately?",
    options: [
      "Reduce the heparin infusion rate by 50% and recheck platelets in 24 hours",
      "Stop all heparin products immediately and initiate an alternative anticoagulant such as argatroban or bivalirudin",
      "Continue heparin and transfuse platelets to maintain count above 100,000",
      "Switch from unfractionated heparin to low-molecular-weight heparin (enoxaparin)"
    ],
    correctAnswer: 1,
    rationaleLong: "Heparin-induced thrombocytopenia (HIT) is a serious immune-mediated complication of heparin therapy characterized by a significant decrease in platelet count (typically >50% from baseline or to below 100,000) occurring 5-14 days after heparin initiation. This patient demonstrates the classic timeline with a drop from 240,000 to 78,000 (67% decrease) over 5 days. HIT is caused by antibodies against the heparin-platelet factor 4 (PF4) complex, which paradoxically causes a hypercoagulable state rather than bleeding, leading to potentially fatal arterial and venous thrombosis. The immediate nursing action upon suspicion of HIT is to discontinue ALL heparin products, including heparin flushes for IV lines, heparin-coated catheters, and low-molecular-weight heparins (which cross-react with HIT antibodies in approximately 90% of cases). An alternative non-heparin anticoagulant must be initiated because HIT creates a hypercoagulable state with a 30-50% risk of thrombotic events. Direct thrombin inhibitors such as argatroban or bivalirudin are the recommended alternatives. Reducing the heparin rate is inadequate because any amount of heparin can perpetuate the immune response. Platelet transfusion is relatively contraindicated in HIT because it can fuel the thrombotic process - adding platelets provides more substrate for the HIT antibodies. Switching to LMWH is contraindicated due to cross-reactivity with HIT antibodies. The 4T scoring system (Timing, Thrombocytopenia, Thrombosis, oTher causes) should be applied, and HIT antibody testing (PF4/heparin ELISA) should be ordered.",
    learningObjective: "Manage heparin-induced thrombocytopenia by immediately stopping all heparin products and initiating alternative anticoagulation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Acute Coronary Syndrome",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "LMWH cross-reacts with HIT antibodies and cannot be substituted for UFH in HIT - use a direct thrombin inhibitor instead",
    clinicalPearls: [
      "HIT: >50% platelet drop or count <100,000, typically day 5-14 of heparin therapy",
      "HIT causes THROMBOSIS, not bleeding - 30-50% thrombotic event risk",
      "Stop ALL heparin including flushes and coated catheters",
      "4T score: Timing, Thrombocytopenia, Thrombosis, oTher causes"
    ],
    safetyNote: "Do NOT transfuse platelets in HIT - this fuels the thrombotic process and can cause fatal thrombosis",
    distractorRationales: [
      "Reducing heparin is inadequate; any amount perpetuates the immune reaction",
      "Platelet transfusion is contraindicated as it provides substrate for HIT antibodies",
      "LMWH cross-reacts with HIT antibodies in ~90% of cases"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndrome"
  },
  {
    stem: "A 66-year-old male post-cardiac catheterization develops sudden severe back pain, a rapidly expanding ecchymotic area in the groin extending to the flank, and his blood pressure drops from 138/82 to 84/52 mmHg within 15 minutes. The femoral access site appears hemostatic. What complication should the emergency nurse suspect?",
    options: [
      "Femoral artery pseudoaneurysm",
      "Retroperitoneal hemorrhage",
      "Arteriovenous fistula formation",
      "Vasovagal reaction from groin compression"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is presenting with classic signs of retroperitoneal hemorrhage (RPH), a serious and potentially life-threatening complication of femoral arterial access during cardiac catheterization. The key indicators are: sudden onset of severe back or flank pain (from blood tracking retroperitoneally along the iliopsoas muscle), rapidly expanding ecchymosis from the groin extending to the flank (Grey Turner sign), and hemodynamic instability with significant blood pressure drop despite the puncture site appearing hemostatic. The femoral access site can appear externally controlled because the arterial bleeding tracks posteriorly into the retroperitoneal space rather than externally. This is what makes RPH particularly dangerous - the bleeding is occult and can result in massive blood loss (several liters) before it becomes clinically apparent. RPH occurs in approximately 0.5-1% of cardiac catheterization procedures and is more common with high femoral puncture above the inguinal ligament. The emergency nurse should immediately establish large-bore IV access (if not already present), initiate aggressive fluid resuscitation, type and crossmatch blood, activate massive transfusion protocol if indicated, and obtain emergent CT angiography of the abdomen and pelvis to confirm the diagnosis and identify the bleeding source. Vascular surgery consultation should be obtained immediately. A femoral pseudoaneurysm would present as a pulsatile mass at the access site with a bruit, not back pain with hemodynamic instability. An AV fistula presents with a continuous machinery-type murmur at the access site. A vasovagal reaction causes bradycardia with hypotension, not tachycardia with back pain and expanding ecchymosis.",
    learningObjective: "Identify retroperitoneal hemorrhage as a complication of femoral arterial access presenting with back pain, flank ecchymosis, and hemodynamic instability",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Acute Coronary Syndrome",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A hemostatic-appearing femoral access site does NOT rule out hemorrhage - retroperitoneal bleeding tracks posteriorly and is occult",
    clinicalPearls: [
      "RPH triad: back/flank pain + expanding groin/flank ecchymosis + hemodynamic instability",
      "Access site may appear hemostatic because blood tracks retroperitoneally",
      "Several liters of blood can accumulate in the retroperitoneal space before detection",
      "High femoral puncture above the inguinal ligament increases RPH risk"
    ],
    safetyNote: "Monitor all post-catheterization patients for back pain and vital sign changes - retroperitoneal hemorrhage can be rapidly fatal if not recognized early",
    distractorRationales: [
      "Pseudoaneurysm presents as a pulsatile mass with bruit at the access site",
      "AV fistula presents with a continuous machinery murmur, not back pain and hemodynamic instability",
      "Vasovagal reaction causes bradycardia, not tachycardia with expanding ecchymosis"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndrome"
  },
  {
    stem: "A 45-year-old female presents to the ED after a syncopal episode. She reports she was standing in line when she felt lightheaded and briefly lost consciousness, recovering within 30 seconds. She has no cardiac history. Her ECG shows a Brugada pattern (coved ST elevation in V1-V2 with right bundle branch block morphology). Which action is most appropriate?",
    options: [
      "Discharge with outpatient cardiology follow-up in 2 weeks",
      "Admit for continuous cardiac monitoring and urgent electrophysiology consultation for potential ICD placement",
      "Obtain a tilt-table test to confirm vasovagal syncope",
      "Administer IV fluids and discharge if symptoms resolve"
    ],
    correctAnswer: 1,
    rationaleLong: "A Brugada ECG pattern (Type 1: coved ST elevation >=2mm in V1-V3 with RBBB morphology) in a patient with syncope represents Brugada syndrome, which is a significant risk factor for sudden cardiac death due to polymorphic ventricular tachycardia or ventricular fibrillation. Syncope in a patient with a Brugada pattern is a high-risk feature that increases the risk of fatal arrhythmic events. This patient requires admission to a monitored bed for continuous cardiac monitoring and urgent electrophysiology (EP) consultation. EP study may be performed to assess arrhythmia inducibility, and implantable cardioverter-defibrillator (ICD) placement is often recommended for patients with Brugada syndrome and syncope, as an ICD is the only proven therapy to prevent sudden cardiac death in this population. The syncope should not be attributed to a vasovagal mechanism without first evaluating the Brugada pattern, as the syncope may have been caused by a self-terminating ventricular arrhythmia. Brugada syndrome is an inherited channelopathy affecting sodium channels, with autosomal dominant inheritance and incomplete penetrance. It is more common in males and in individuals of Southeast Asian descent. Fever can unmask or exacerbate the Brugada pattern, so patients should be counseled to treat fevers aggressively. Certain medications (sodium channel blockers, tricyclic antidepressants, some anesthetics) can worsen the condition and must be avoided. Discharging this patient without addressing the Brugada finding could result in sudden cardiac death. The emergency nurse should ensure continuous monitoring is maintained, have a defibrillator at bedside, and avoid medications that can exacerbate Brugada pattern.",
    learningObjective: "Recognize Brugada pattern on ECG as a risk factor for sudden cardiac death requiring admission and electrophysiology evaluation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "12-Lead ECG Interpretation",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Syncope + Brugada pattern = high-risk for sudden cardiac death. Never attribute syncope to vasovagal without evaluating the ECG findings",
    clinicalPearls: [
      "Brugada Type 1: coved ST elevation >=2mm in V1-V3 with RBBB morphology",
      "ICD is the only proven therapy to prevent sudden cardiac death in Brugada syndrome",
      "Fever can unmask or worsen Brugada pattern - treat aggressively",
      "Avoid sodium channel blockers, TCAs, and certain anesthetics in Brugada patients"
    ],
    safetyNote: "A Brugada pattern with syncope is never benign - maintain continuous monitoring and have defibrillator at bedside",
    distractorRationales: [
      "Discharging with outpatient follow-up risks sudden cardiac death",
      "Tilt-table testing does not address the arrhythmic risk of Brugada syndrome",
      "Simple IV fluid administration ignores the life-threatening ECG finding"
    ],
    lessonLink: "/emergency/lessons/ecg-interpretation"
  },
  {
    stem: "During CPR, the end-tidal CO2 (EtCO2) monitoring shows a sudden increase from 12 mmHg to 38 mmHg. What does this finding most likely indicate?",
    options: [
      "The endotracheal tube has become dislodged",
      "Return of spontaneous circulation (ROSC)",
      "Hyperventilation by the bag-valve-mask operator",
      "Equipment malfunction of the capnography device"
    ],
    correctAnswer: 1,
    rationaleLong: "A sudden and sustained increase in end-tidal CO2 (EtCO2) during CPR from a low value (12 mmHg) to a near-normal value (38 mmHg) is the most reliable early indicator of return of spontaneous circulation (ROSC). During cardiac arrest, EtCO2 values are typically low (10-20 mmHg) because cardiac output is dependent on chest compressions, which generate only 25-33% of normal cardiac output. When spontaneous circulation returns, the restored cardiac output dramatically increases CO2 delivery to the lungs, causing a rapid and significant rise in EtCO2. This increase often precedes a palpable pulse or blood pressure measurement, making EtCO2 monitoring an invaluable tool during resuscitation. The AHA recommends continuous quantitative waveform capnography during CPR for multiple purposes: confirming endotracheal tube placement, monitoring CPR quality (higher EtCO2 correlates with better chest compression quality), detecting ROSC, and providing prognostic information (persistently low EtCO2 <10 mmHg after 20 minutes of CPR is associated with poor outcomes). An ETT dislodgement would cause EtCO2 to drop to near zero, not increase. Hyperventilation would decrease EtCO2 by washing out CO2 from the lungs. Equipment malfunction would typically show erratic readings rather than a physiologically consistent increase. The emergency nurse should immediately check for a pulse, assess for other signs of ROSC (spontaneous breathing, purposeful movement), and obtain vital signs. If ROSC is confirmed, post-ROSC care should be initiated including targeted temperature management, hemodynamic optimization, and identification of the arrest etiology.",
    learningObjective: "Interpret continuous EtCO2 monitoring during CPR as an early indicator of return of spontaneous circulation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Arrest Management (ACLS)",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Sudden EtCO2 increase during CPR = likely ROSC, not tube dislodgement (which would cause EtCO2 to DROP to near zero)",
    clinicalPearls: [
      "EtCO2 rise during CPR = earliest sign of ROSC, often before palpable pulse",
      "Normal EtCO2 during cardiac arrest: 10-20 mmHg with compressions",
      "EtCO2 <10 mmHg after 20 min CPR = poor prognosis",
      "Higher EtCO2 during CPR correlates with better compression quality"
    ],
    safetyNote: "Do not interrupt CPR for a pulse check based on EtCO2 alone - verify during scheduled rhythm checks to minimize compression interruptions",
    distractorRationales: [
      "ETT dislodgement would cause EtCO2 to drop to near zero, not increase",
      "Hyperventilation decreases EtCO2 by excessive CO2 washout",
      "Equipment malfunction would show erratic readings, not a physiologically consistent pattern"
    ],
    lessonLink: "/emergency/lessons/cardiac-arrest-acls"
  },
  {
    stem: "A 52-year-old female presents to the ED with rapid-onset dyspnea and pleuritic chest pain. Her ECG shows sinus tachycardia with S1Q3T3 pattern and right axis deviation. Bedside echocardiography reveals RV dilation with McConnell's sign. What does McConnell's sign indicate?",
    options: [
      "Left ventricular wall motion abnormality consistent with MI",
      "RV free wall akinesis with preserved apical contractility, highly specific for acute PE",
      "Pericardial effusion with tamponade physiology",
      "Aortic root dilation consistent with aortic dissection"
    ],
    correctAnswer: 1,
    rationaleLong: "McConnell's sign is a distinctive echocardiographic finding that is highly specific (approximately 94%) for acute pulmonary embolism. It is defined as right ventricular free wall akinesis (inability to contract) with preserved or hyperkinetic contractility of the RV apex. This paradoxical pattern occurs because in acute PE, the sudden increase in RV afterload from pulmonary vascular obstruction causes the RV free wall to dilate and become akinetic, while the RV apex is tethered to and supported by the contracting left ventricle, maintaining its motion. This distinguishes acute PE from other causes of RV dysfunction such as RV infarction or chronic pulmonary hypertension, where the entire RV including the apex is typically hypokinetic. In this patient, the combination of acute dyspnea, pleuritic chest pain, sinus tachycardia, S1Q3T3 pattern (S wave in lead I, Q wave and inverted T wave in lead III), right axis deviation, and McConnell's sign on bedside echo creates a compelling clinical picture for acute massive or submassive PE. The S1Q3T3 pattern, while not sensitive, is specific for acute right heart strain from PE. The emergency nurse should prepare for anticoagulation (unfractionated heparin bolus and infusion), and if the patient becomes hemodynamically unstable, systemic thrombolysis with alteplase should be ready. CT pulmonary angiography should be obtained for definitive diagnosis. The nurse should monitor closely for hemodynamic deterioration and have vasopressors available.",
    learningObjective: "Identify McConnell's sign on bedside echocardiography as a specific indicator of acute pulmonary embolism",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "PE Management",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "McConnell's sign is specific for PE - RV free wall akinesis with PRESERVED apical motion distinguishes PE from RV infarction",
    clinicalPearls: [
      "McConnell's sign: RV free wall akinesis + preserved/hyperkinetic apical motion = PE",
      "S1Q3T3 pattern is specific but not sensitive for PE",
      "Bedside echo can rapidly assess for RV strain before CT is available",
      "RV dilation (RV:LV ratio >1:1) indicates significant hemodynamic burden from PE"
    ],
    safetyNote: "Submassive PE (RV strain without hypotension) may rapidly deteriorate to massive PE - prepare thrombolytics and vasopressors proactively",
    distractorRationales: [
      "LV wall motion abnormalities indicate MI, not PE",
      "Pericardial effusion with tamponade has different echo findings (diastolic RV collapse)",
      "Aortic root dilation is seen on echo in aortic dissection, not the pattern described"
    ],
    lessonLink: "/emergency/lessons/pe-management"
  },
  {
    stem: "A 58-year-old male is being treated in the ED for an acute STEMI. He suddenly becomes ashen, diaphoretic, and his blood pressure drops to 62/38 mmHg. The cardiac monitor shows a new third-degree heart block with a ventricular escape rate of 28 bpm. Atropine is administered without effect. While preparing for transcutaneous pacing, which medication should the nurse prepare as a temporizing measure?",
    options: [
      "Dopamine infusion at 5-20 mcg/kg/min",
      "Amiodarone 150 mg IV over 10 minutes",
      "Adenosine 6 mg rapid IV push",
      "Diltiazem 0.25 mg/kg IV over 2 minutes"
    ],
    correctAnswer: 0,
    rationaleLong: "In the setting of symptomatic bradycardia (third-degree heart block with ventricular rate of 28 bpm) that is unresponsive to atropine, the ACLS bradycardia algorithm recommends transcutaneous pacing as the definitive intervention. While preparing for TCP, a dopamine infusion at 5-20 mcg/kg/min can serve as a temporizing chronotropic agent. Dopamine at these doses stimulates beta-1 adrenergic receptors, increasing heart rate and contractility. An alternative temporizing agent is an epinephrine infusion at 2-10 mcg/min. Both dopamine and epinephrine can increase the heart rate and blood pressure while transcutaneous pacing is being set up. The choice between them often depends on institutional preference and availability. Amiodarone is an antiarrhythmic that slows conduction and would worsen bradycardia. It is used for tachyarrhythmias, not bradycardia. Adenosine causes transient AV nodal blockade and would further slow or temporarily arrest cardiac activity, which is extremely dangerous in a patient who already has complete heart block. Diltiazem is a calcium channel blocker that would further depress AV conduction and worsen the heart block. The emergency nurse should simultaneously prepare transcutaneous pacing equipment, ensure sedation medications are available (midazolam or fentanyl), and have the dopamine or epinephrine drip running through a dedicated IV line. In the context of acute STEMI with complete heart block, emergent cardiac catheterization should not be delayed, as revascularization may resolve the conduction abnormality caused by ischemic injury to the conduction system.",
    learningObjective: "Select appropriate temporizing pharmacological agents for symptomatic bradycardia while preparing for transcutaneous pacing",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Pacing/Cardioversion/Defibrillation",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Never give AV-blocking drugs (adenosine, diltiazem, beta-blockers) to patients with symptomatic bradycardia or heart block",
    clinicalPearls: [
      "Dopamine 5-20 mcg/kg/min or epinephrine 2-10 mcg/min for bradycardia temporization",
      "Complete heart block in STEMI may resolve with revascularization",
      "Atropine is often ineffective in infranodal block (wide QRS escape)",
      "TCP is the bridge to transvenous pacing or definitive treatment"
    ],
    safetyNote: "Adenosine and calcium channel blockers are CONTRAINDICATED in complete heart block - they can cause asystole",
    distractorRationales: [
      "Amiodarone slows conduction and would worsen bradycardia",
      "Adenosine causes AV nodal blockade and would be catastrophic in complete heart block",
      "Diltiazem depresses AV conduction and would worsen the heart block"
    ],
    lessonLink: "/emergency/lessons/pacing-cardioversion"
  },
  {
    stem: "A nurse in the ED is caring for a patient with acute decompensated heart failure who is receiving IV nitroglycerin at 40 mcg/min. The patient reports sudden severe headache and the blood pressure has dropped from 142/86 to 78/44 mmHg. What is the priority nursing action?",
    options: [
      "Administer acetaminophen for the headache and continue the nitroglycerin infusion",
      "Immediately reduce or stop the nitroglycerin infusion and administer a normal saline bolus",
      "Increase the nitroglycerin infusion rate to improve coronary perfusion",
      "Obtain a CT scan of the head to rule out intracranial hemorrhage before making changes"
    ],
    correctAnswer: 1,
    rationaleLong: "The sudden development of severe headache and significant hypotension (drop from 142/86 to 78/44 mmHg) in a patient receiving IV nitroglycerin indicates excessive vasodilation causing dangerous hypotension. Nitroglycerin works by releasing nitric oxide, which causes smooth muscle relaxation, venodilation (reducing preload), and at higher doses, arterial dilation (reducing afterload). Headache is a common side effect caused by meningeal artery dilation, and severe hypotension occurs when the dose causes excessive preload and afterload reduction. The priority nursing action is to immediately reduce or stop the nitroglycerin infusion and administer an IV fluid bolus (250-500 mL normal saline) to restore intravascular volume and blood pressure. The patient should be placed in the Trendelenburg or supine position with legs elevated to augment venous return. Vital signs should be monitored every 2-5 minutes until blood pressure stabilizes. Continuing or increasing the nitroglycerin infusion would worsen the hypotension and could cause end-organ damage including myocardial ischemia (paradoxically), renal injury, or cerebral hypoperfusion. While an intracranial hemorrhage could present with headache and hypotension, the temporal relationship with nitroglycerin infusion makes drug-induced hypotension far more likely, and the immediate intervention should focus on the hemodynamic instability. CT head can be obtained after hemodynamic stabilization if clinically indicated. Simply treating the headache with acetaminophen while ignoring the dangerous hypotension demonstrates failure to recognize the clinical significance of the blood pressure change.",
    learningObjective: "Manage nitroglycerin-induced hypotension by stopping the infusion and restoring intravascular volume",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Heart Failure Exacerbation",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Headache + hypotension on nitroglycerin = excessive vasodilation. Stop the drug first before pursuing other diagnoses",
    clinicalPearls: [
      "Nitroglycerin causes headache from meningeal artery dilation - a common side effect",
      "Monitor BP every 5 minutes when titrating nitroglycerin",
      "Trendelenburg position and IV fluid bolus can rapidly restore preload",
      "Nitroglycerin-induced hypotension usually resolves within 5-10 minutes of stopping the drug"
    ],
    safetyNote: "Always have IV access and fluid readily available when administering nitroglycerin infusion - rapid hypotension can occur at any dose",
    distractorRationales: [
      "Treating only the headache while ignoring dangerous hypotension is negligent",
      "Increasing nitroglycerin would worsen vasodilation and potentially cause cardiac arrest",
      "CT scan should not delay hemodynamic stabilization when the cause is clearly medication-related"
    ],
    lessonLink: "/emergency/lessons/heart-failure-management"
  },
  {
    stem: "A 40-year-old male presents to the ED complaining of palpitations. His ECG shows atrial fibrillation with a ventricular rate of 210 bpm and intermittent wide QRS complexes with a delta wave. This finding is most consistent with which condition?",
    options: [
      "Atrial fibrillation with rapid ventricular response in a normal heart",
      "Atrial fibrillation with pre-excitation (Wolff-Parkinson-White syndrome)",
      "Atrial fibrillation with left bundle branch block",
      "Ventricular tachycardia with retrograde atrial activation"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has atrial fibrillation with pre-excitation due to Wolff-Parkinson-White (WPW) syndrome. The key findings are: atrial fibrillation with an extremely rapid ventricular rate (210 bpm exceeding typical AV nodal conduction capacity), intermittent wide QRS complexes, and delta waves. In WPW syndrome, an accessory pathway (Bundle of Kent) provides an additional electrical connection between the atria and ventricles that bypasses the AV node. During atrial fibrillation, the accessory pathway can conduct impulses much faster than the AV node because it lacks the rate-limiting properties of the AV node, resulting in extremely rapid ventricular rates that can exceed 250 bpm. This is a life-threatening emergency because the rapid ventricular rates can degenerate into ventricular fibrillation and cardiac arrest. The management of atrial fibrillation with WPW differs critically from standard atrial fibrillation management. AV nodal blocking agents including adenosine, beta-blockers, calcium channel blockers, and digoxin are CONTRAINDICATED because they slow or block conduction through the AV node while allowing uninhibited rapid conduction through the accessory pathway, potentially accelerating the ventricular rate to fatal levels. The appropriate treatment is synchronized cardioversion if the patient is unstable, or IV procainamide or ibutilide if stable. Procainamide slows conduction through the accessory pathway. The emergency nurse must recognize this pattern and ensure that standard rate-controlling agents are NOT administered. Left bundle branch block would show a consistent wide QRS without delta waves. Ventricular tachycardia would show a regular wide-complex rhythm without the irregular R-R intervals characteristic of atrial fibrillation.",
    learningObjective: "Recognize atrial fibrillation with Wolff-Parkinson-White syndrome and understand why AV nodal blockers are contraindicated",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "AV nodal blockers (adenosine, diltiazem, metoprolol, digoxin) are LETHAL in WPW with atrial fibrillation - they promote exclusive accessory pathway conduction",
    clinicalPearls: [
      "WPW + AFib: very rapid irregular wide complex with delta waves",
      "NEVER give AV nodal blockers for AFib with WPW",
      "Treatment: cardioversion if unstable; procainamide or ibutilide if stable",
      "Ventricular rates >250 bpm in AFib suggest accessory pathway conduction"
    ],
    safetyNote: "Adenosine, beta-blockers, calcium channel blockers, and digoxin can cause ventricular fibrillation in WPW with atrial fibrillation",
    distractorRationales: [
      "Normal AFib with RVR rarely exceeds 170 bpm due to AV nodal rate-limiting",
      "LBBB shows consistent wide QRS without delta waves or extremely rapid rates",
      "VT is regular; AFib with WPW shows irregular R-R intervals with varying QRS morphology"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "A triage nurse assesses a 50-year-old male who reports new-onset exertional chest pressure that resolves with rest. He has no chest pain at present, vital signs are normal, and his ECG is unremarkable. Using the Emergency Severity Index (ESI), what triage level is most appropriate?",
    options: [
      "ESI Level 1 - Immediate resuscitation",
      "ESI Level 2 - Emergent, high-risk situation",
      "ESI Level 3 - Urgent, requires multiple resources",
      "ESI Level 4 - Less urgent, requires one resource"
    ],
    correctAnswer: 1,
    rationaleLong: "New-onset exertional chest pressure in a 50-year-old male should be triaged as ESI Level 2 (Emergent). ESI Level 2 is assigned to high-risk situations where the patient should not wait to be seen. Although this patient is currently pain-free with normal vital signs and a normal ECG, the history of new-onset exertional chest pressure is a high-risk presentation that could represent unstable angina or evolving acute coronary syndrome. The ESI Level 2 criteria include patients who present with high-risk chief complaints where delay in treatment could result in adverse outcomes. Chest pain or pressure with cardiac risk factors meets this criterion. ESI Level 1 is reserved for patients requiring immediate life-saving interventions such as intubation, CPR, or immediate medication administration for conditions like anaphylaxis or cardiac arrest. This patient is currently stable and does not require immediate resuscitation. ESI Level 3 patients are urgent and require multiple resources (labs, imaging, etc.) but are not considered high-risk. While this patient will likely need multiple resources, the high-risk nature of the complaint elevates him to Level 2. ESI Level 4 patients need only one resource (such as a single X-ray or prescription) and are lower acuity. The emergency nurse must recognize that a normal ECG does not rule out ACS, and that new-onset exertional symptoms represent a potentially time-sensitive condition requiring rapid evaluation. Even though the patient appears stable, delaying assessment could result in progression to unstable angina or acute MI.",
    learningObjective: "Apply ESI triage criteria to appropriately categorize chest pain as ESI Level 2 high-risk presentation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "STEMI/NSTEMI Recognition",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Normal vital signs and normal ECG do NOT make chest pain low-acuity - new-onset exertional symptoms are high-risk and require ESI Level 2",
    clinicalPearls: [
      "ESI 2: high-risk situations where delay could cause adverse outcomes",
      "New-onset exertional chest symptoms are high-risk regardless of current presentation",
      "Normal ECG does not rule out ACS - serial testing is needed",
      "HEART score can supplement triage assessment for chest pain risk stratification"
    ],
    safetyNote: "Under-triaging chest pain patients increases time to treatment and mortality risk for unrecognized ACS",
    distractorRationales: [
      "ESI 1 requires immediate resuscitation - this patient is currently stable",
      "ESI 3 underestimates the high-risk nature of new-onset exertional chest symptoms",
      "ESI 4 is for low-acuity complaints needing one resource - inappropriate for cardiac symptoms"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndrome"
  },
  {
    stem: "A patient in the ED is being monitored after receiving alteplase (tPA) for acute STEMI. Thirty minutes after infusion completion, the patient develops a severe headache, vomiting, and right-sided weakness. BP is 186/112 mmHg. What is the most likely complication and what should the nurse do first?",
    options: [
      "Allergic reaction to tPA - administer epinephrine and diphenhydramine",
      "Intracranial hemorrhage - stop any remaining tPA, obtain emergent CT head, and lower blood pressure",
      "Recurrent STEMI - obtain repeat 12-lead ECG and prepare for catheterization",
      "Hypertensive encephalopathy - administer IV labetalol for blood pressure control"
    ],
    correctAnswer: 1,
    rationaleLong: "The sudden onset of severe headache, vomiting, and focal neurological deficit (right-sided weakness) in a patient who recently received thrombolytic therapy is highly concerning for intracranial hemorrhage (ICH), the most feared complication of fibrinolytic therapy. ICH occurs in approximately 0.5-1% of patients receiving tPA for STEMI, and the mortality rate is approximately 50-60%. The immediate nursing actions include: (1) Stop any remaining thrombolytic infusion immediately (although in this case the infusion was completed 30 minutes ago); (2) Activate the stroke team and obtain an emergent non-contrast CT head to confirm the diagnosis; (3) Prepare for blood pressure reduction targeting SBP <140 mmHg using IV nicardipine or labetalol; (4) Obtain stat coagulation studies (PT/INR, PTT, fibrinogen, CBC); (5) Prepare for potential reversal of fibrinolytic effect with cryoprecipitate (to replace fibrinogen), tranexamic acid, or aminocaproic acid; (6) Ensure two large-bore IVs and type and screen for potential blood product administration. Neurosurgical consultation should be obtained immediately for potential surgical evacuation. The triad of headache, vomiting, and focal neurological deficit should always raise immediate suspicion for ICH, especially in patients who have received thrombolytic therapy. An allergic reaction would present with urticaria, angioedema, and anaphylaxis symptoms, not focal neurological deficits. Recurrent STEMI would present with chest pain and ECG changes, not neurological symptoms. Hypertensive encephalopathy typically develops over hours to days with more gradual symptom onset.",
    learningObjective: "Recognize intracranial hemorrhage as a complication of thrombolytic therapy and implement emergency interventions",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "STEMI/NSTEMI Recognition",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Headache + focal neurological deficit after tPA = ICH until proven otherwise. Do not assume it is hypertensive encephalopathy",
    clinicalPearls: [
      "ICH complicates ~0.5-1% of STEMI thrombolysis with ~50% mortality",
      "Stop thrombolytics, emergent CT head, lower BP, check coagulation studies",
      "Cryoprecipitate (to raise fibrinogen) and TXA for fibrinolytic reversal",
      "Neurosurgical consultation for potential surgical evacuation"
    ],
    safetyNote: "Any new neurological symptom after thrombolytic therapy is ICH until proven otherwise - obtain emergent CT head immediately",
    distractorRationales: [
      "Allergic reaction presents with urticaria and angioedema, not focal deficits",
      "Recurrent STEMI presents with chest pain and ECG changes, not neurological symptoms",
      "Hypertensive encephalopathy develops gradually, not acutely with focal deficits"
    ],
    lessonLink: "/emergency/lessons/stemi-management"
  },
  {
    stem: "A 35-year-old cocaine user presents to the ED with severe chest pain, diaphoresis, and ST elevation in leads V1-V4. BP is 192/118 mmHg, HR 124 bpm. Which medication is CONTRAINDICATED in this patient's management?",
    options: [
      "Benzodiazepines (lorazepam or diazepam)",
      "Beta-blockers (metoprolol or atenolol)",
      "Nitroglycerin",
      "Aspirin"
    ],
    correctAnswer: 1,
    rationaleLong: "Beta-blockers are CONTRAINDICATED in cocaine-associated chest pain and acute coronary syndrome. Cocaine acts as a sympathomimetic agent that causes coronary vasoconstriction through alpha-adrenergic stimulation, increases myocardial oxygen demand through sympathetic activation, and can cause direct myocardial toxicity. When beta-blockers are administered to a patient with cocaine toxicity, they block the beta-adrenergic receptors (which normally cause vasodilation) while leaving alpha-adrenergic receptors unopposed. This leads to unopposed alpha-stimulation, which worsens coronary and peripheral vasoconstriction, potentially exacerbating myocardial ischemia, causing severe hypertension, and increasing the risk of death. This is one of the most important drug contraindications in emergency medicine. The appropriate management of cocaine-associated ACS includes: benzodiazepines (first-line) to reduce sympathetic stimulation and provide anxiolysis; nitroglycerin for coronary vasodilation and preload/afterload reduction; calcium channel blockers (verapamil or diltiazem) if nitroglycerin is insufficient; aspirin for antiplatelet therapy; and phentolamine (alpha-blocker) for refractory hypertension. Benzodiazepines are particularly effective because they address the underlying sympathetic surge caused by cocaine. If beta-blockade is deemed necessary after cocaine has been metabolized, labetalol (which has both alpha and beta blocking properties) may be considered, but pure beta-blockers should be strictly avoided. The emergency nurse must ascertain substance use history in all young patients presenting with ACS to avoid this potentially fatal medication error.",
    learningObjective: "Identify beta-blockers as contraindicated in cocaine-associated chest pain due to unopposed alpha-adrenergic stimulation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Acute Coronary Syndrome",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Beta-blockers in cocaine chest pain cause UNOPPOSED ALPHA stimulation leading to worsened coronary vasoconstriction and hypertension",
    clinicalPearls: [
      "Cocaine ACS: benzodiazepines FIRST, then nitro, then calcium channel blockers",
      "Beta-blockers cause unopposed alpha stimulation in cocaine toxicity",
      "Always ask about substance use in young patients with ACS",
      "Phentolamine (alpha-blocker) for refractory hypertension in cocaine toxicity"
    ],
    safetyNote: "Beta-blockers in cocaine-induced ACS can precipitate fatal coronary vasospasm, hypertensive crisis, and cardiac arrest",
    distractorRationales: [
      "Benzodiazepines are first-line treatment for cocaine-associated ACS",
      "Nitroglycerin is appropriate for coronary vasodilation in cocaine ACS",
      "Aspirin is indicated for antiplatelet therapy in all ACS presentations"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndrome"
  },
  {
    stem: "A patient arrives to the ED in cardiac arrest. High-quality CPR is in progress. The cardiac monitor shows fine ventricular fibrillation. What modification to defibrillation technique may improve the chance of successful conversion?",
    options: [
      "Use lower energy (50J) to avoid myocardial damage",
      "Administer epinephrine 1 mg IV before the first defibrillation attempt",
      "Use anterior-posterior pad placement and consider double sequential defibrillation if standard shocks fail",
      "Delay defibrillation until CPR has been performed for at least 5 minutes"
    ],
    correctAnswer: 2,
    rationaleLong: "Fine ventricular fibrillation can be more resistant to defibrillation than coarse VF because the lower amplitude waveform reflects diminishing myocardial energy reserves and viability. Several strategies can be employed to improve defibrillation success in refractory VF. Anterior-posterior (AP) pad placement directs the defibrillation current vector through a greater mass of ventricular myocardium compared to the standard anterolateral position, potentially improving the chance of successful termination. Double sequential defibrillation (DSD), also known as dual defibrillation, involves using two defibrillators to deliver near-simultaneous shocks through different vectors. While evidence for DSD is primarily from case series and observational studies, it has shown promise in refractory VF and is increasingly being considered in situations where standard defibrillation has failed. Using lower energy would decrease the chance of successful conversion, not improve it. Higher energy levels are generally more effective for terminating VF. Epinephrine, while part of the ACLS algorithm, should not delay the first defibrillation attempt. The AHA guidelines emphasize that in witnessed cardiac arrest with a shockable rhythm, defibrillation should be performed as quickly as possible. Every minute of delay reduces survival by 7-10%. Delaying defibrillation for CPR is controversial but current guidelines recommend immediate defibrillation when VF is identified, with CPR continuing between shocks. The emergency nurse should ensure maximum energy settings on the defibrillator and verify good pad contact and proper pad positioning.",
    learningObjective: "Apply advanced defibrillation strategies including pad positioning and double sequential defibrillation for refractory VF",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Pacing/Cardioversion/Defibrillation",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Fine VF may be confused with asystole - increase monitor gain and check in two leads before withholding defibrillation",
    clinicalPearls: [
      "AP pad placement improves current delivery through more ventricular myocardium",
      "Double sequential defibrillation may benefit refractory VF",
      "Fine VF reflects diminishing myocardial viability - time is critical",
      "CPR between shocks helps maintain myocardial perfusion and improve subsequent shock success"
    ],
    safetyNote: "Fine VF can resemble asystole - confirm in two leads and increase gain before declaring a non-shockable rhythm",
    distractorRationales: [
      "Lower energy decreases defibrillation success - use maximum energy for refractory VF",
      "Epinephrine should not delay first defibrillation in witnessed VF arrest",
      "Delaying defibrillation reduces survival by 7-10% per minute"
    ],
    lessonLink: "/emergency/lessons/cardiac-arrest-acls"
  },
  {
    stem: "An ED nurse receives a 62-year-old patient transported from a skilled nursing facility with altered mental status and an irregular heart rhythm. The ECG shows peaked T waves, widened QRS complexes, and absent P waves. Serum potassium is 7.8 mEq/L. What is the most time-critical intervention?",
    options: [
      "Administer oral sodium polystyrene sulfonate (Kayexalate) 30 grams",
      "Administer IV calcium gluconate 10 mL of 10% solution over 2-3 minutes",
      "Administer IV insulin 10 units with dextrose 50% 25 grams",
      "Initiate emergent hemodialysis"
    ],
    correctAnswer: 1,
    rationaleLong: "Severe hyperkalemia (K+ 7.8 mEq/L) with ECG changes (peaked T waves, widened QRS, absent P waves) represents an imminent cardiac arrest risk. The progression of hyperkalemic ECG changes follows a predictable pattern: peaked T waves -> PR prolongation -> P wave loss -> QRS widening -> sine wave pattern -> VF/asystole. This patient has progressed to absent P waves and widened QRS, indicating severe cardiac membrane instability. The most time-critical intervention is IV calcium gluconate (or calcium chloride), which acts within 1-3 minutes to stabilize the cardiac cell membrane by antagonizing the effects of potassium on myocardial conduction. Calcium does NOT lower the serum potassium level; it simply protects the heart from the arrhythmogenic effects of hyperkalemia while other treatments work to reduce the actual potassium concentration. The recommended dose is 10 mL of 10% calcium gluconate administered IV over 2-3 minutes, which can be repeated in 5 minutes if ECG changes persist. After cardiac membrane stabilization, the emergency nurse should prepare potassium-lowering interventions: IV insulin 10 units with D50W 25 grams (shifts potassium intracellularly, onset 15-30 minutes), nebulized albuterol 10-20 mg (shifts potassium intracellularly), IV sodium bicarbonate if acidotic, and potassium elimination therapies (loop diuretics, sodium zirconium cyclosilicate, or hemodialysis). Oral Kayexalate works too slowly (hours) and has limited evidence of efficacy, making it inappropriate as the first intervention. Hemodialysis is definitive for potassium removal but takes time to arrange and initiate.",
    learningObjective: "Administer IV calcium as the most time-critical intervention for severe hyperkalemia with ECG changes to stabilize the cardiac membrane",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Calcium does NOT lower potassium - it only stabilizes the cardiac membrane. You still need insulin/dextrose and other K-lowering therapies",
    clinicalPearls: [
      "Hyperkalemia ECG progression: peaked T -> PR prolongation -> lost P -> wide QRS -> sine wave -> VF",
      "IV calcium stabilizes membrane in 1-3 minutes but does NOT lower K+",
      "Insulin + D50W shifts K+ intracellularly (onset 15-30 min)",
      "High-dose nebulized albuterol (10-20 mg) provides additional K+ shift"
    ],
    safetyNote: "Calcium chloride is 3x more concentrated than calcium gluconate - use calcium gluconate via peripheral IV to avoid tissue necrosis",
    distractorRationales: [
      "Kayexalate works too slowly (hours) for an acute emergency with ECG changes",
      "Insulin/dextrose is important but onset is 15-30 minutes; calcium provides immediate protection",
      "Hemodialysis is definitive but takes time to arrange and cannot be started immediately"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "A 67-year-old male arrives in the ED via EMS after experiencing sudden cardiac arrest at a shopping mall. Bystander CPR was initiated immediately and an AED delivered one shock with ROSC achieved in the field. Upon arrival, the patient is intubated, GCS 3T, BP 108/72 mmHg on vasopressors. ECG shows no ST elevation. What is the priority component of post-cardiac arrest care the nurse should initiate?",
    options: [
      "Obtain emergent cardiac catheterization since all cardiac arrest patients need PCI",
      "Initiate targeted temperature management (TTM) maintaining temperature between 32-36C",
      "Administer prophylactic amiodarone infusion to prevent rearrest",
      "Perform an emergent CT head before any other intervention"
    ],
    correctAnswer: 1,
    rationaleLong: "For this post-cardiac arrest patient who achieved ROSC but remains comatose (GCS 3T), the priority is targeted temperature management (TTM). Current AHA guidelines recommend maintaining core temperature between 32-36C for at least 24 hours in comatose adult patients after cardiac arrest. TTM has been shown to improve neurological outcomes by reducing cerebral metabolic demand, decreasing neuroinflammation, minimizing reperfusion injury, and reducing apoptosis in the vulnerable post-arrest brain. The emergency nurse should initiate cooling measures in the ED, which may include cold IV saline infusion (30 mL/kg at 4C), surface cooling devices (Arctic Sun or cooling blankets), and continuous core temperature monitoring (esophageal or bladder temperature probe). The nurse should also prevent and treat shivering, which increases metabolic demand and can interfere with cooling (using sedation, neuromuscular blockade if necessary, and counter-warming of extremities). Emergent cardiac catheterization is recommended only when there is ST elevation on the post-ROSC ECG, not in all cardiac arrest survivors. Without ST elevation, the decision for catheterization is individualized based on clinical suspicion for ACS. Prophylactic amiodarone infusion is not routinely recommended for all post-ROSC patients. While CT head may be obtained to evaluate for neurological cause of arrest, it should not delay initiation of TTM if the clinical picture suggests a cardiac etiology. Additional post-ROSC care includes hemodynamic optimization (target MAP >65 mmHg), mechanical ventilation targeting normoxia (PaO2 60-100 mmHg, avoid hyperoxia) and normocapnia (PaCO2 35-45 mmHg), and glucose management.",
    learningObjective: "Initiate targeted temperature management as a priority intervention for comatose post-cardiac arrest patients",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Post-ROSC Care",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Not all post-arrest patients need emergent cath - only those with STEMI on post-ROSC ECG. All comatose post-arrest patients need TTM",
    clinicalPearls: [
      "TTM 32-36C for 24+ hours in comatose post-arrest patients",
      "Prevent shivering with sedation, counter-warming, or neuromuscular blockade",
      "Avoid hyperoxia (PaO2 >300 mmHg) and hyperthermia (>37.5C) post-ROSC",
      "Emergent cath only for STEMI on post-ROSC ECG; otherwise individualized"
    ],
    safetyNote: "Avoid hyperthermia in the first 72 hours post-ROSC - even mild fever worsens neurological outcomes",
    distractorRationales: [
      "Emergent cath is indicated only with post-ROSC STEMI, not all cardiac arrest survivors",
      "Prophylactic amiodarone is not routinely recommended post-ROSC",
      "CT head should not delay TTM when cardiac etiology is suspected"
    ],
    lessonLink: "/emergency/lessons/post-rosc-care"
  },
  {
    stem: "A 71-year-old female with a history of aortic stenosis presents to the ED after a syncopal episode. She reports recent worsening of exertional dyspnea and chest pain over the past month. BP 104/72 mmHg, HR 76 bpm. A systolic crescendo-decrescendo murmur is heard best at the right upper sternal border radiating to the carotids. What does the emergency nurse understand about this patient's condition?",
    options: [
      "The triad of syncope, angina, and heart failure in aortic stenosis indicates severe disease with poor prognosis without surgical intervention",
      "Aortic stenosis with these symptoms is a benign condition that can be managed with medications alone",
      "The syncope is likely vasovagal and unrelated to the aortic stenosis",
      "This patient should receive aggressive IV fluid resuscitation to increase cardiac output"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with the classic symptomatic triad of severe aortic stenosis: syncope, angina (chest pain), and heart failure symptoms (exertional dyspnea). The development of these symptoms in aortic stenosis marks a critical transition from compensated to decompensated disease with significantly reduced survival if left untreated. Historical data shows that without aortic valve replacement, mean survival after the onset of angina is approximately 5 years, after syncope approximately 3 years, and after heart failure symptoms approximately 2 years. The crescendo-decrescendo (diamond-shaped) systolic murmur at the right upper sternal border (aortic area) radiating to the carotid arteries is the classic murmur of aortic stenosis, caused by turbulent flow across the stenotic valve. As stenosis becomes more severe, the murmur peaks later in systole (late-peaking). The emergency nurse should understand that this patient needs urgent cardiology evaluation for valve replacement (either surgical AVR or transcatheter aortic valve replacement - TAVR). In the ED, management includes maintaining adequate preload (but not aggressive fluid boluses which can cause pulmonary edema), avoiding vasodilators (nitroglycerin can cause severe hypotension in aortic stenosis), maintaining sinus rhythm, and monitoring for arrhythmias. The syncope in aortic stenosis is related to fixed cardiac output and exercise-induced vasodilation that the heart cannot compensate for, not vasovagal in nature. This is a surgical disease, not one that can be managed with medications alone.",
    learningObjective: "Recognize the symptomatic triad of severe aortic stenosis (syncope, angina, heart failure) as indicating poor prognosis requiring urgent surgical evaluation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Heart Failure Exacerbation",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Avoid nitroglycerin in severe aortic stenosis - can cause profound hypotension due to fixed cardiac output and inability to compensate for afterload reduction",
    clinicalPearls: [
      "AS triad: syncope (3yr survival), angina (5yr), heart failure (2yr) without intervention",
      "Crescendo-decrescendo murmur at RUSB radiating to carotids = classic AS murmur",
      "Avoid vasodilators (nitroglycerin) - can cause severe hypotension",
      "Maintain sinus rhythm - AS patients are preload-dependent"
    ],
    safetyNote: "Symptomatic aortic stenosis has high mortality without valve replacement - ensure urgent cardiology consultation",
    distractorRationales: [
      "Symptomatic AS is not benign - it has high mortality without surgical intervention",
      "Syncope in AS is due to fixed cardiac output, not vasovagal mechanism",
      "Aggressive IV fluids can cause pulmonary edema in decompensated aortic stenosis"
    ],
    lessonLink: "/emergency/lessons/heart-failure-management"
  },
  {
    stem: "An emergency nurse is caring for a patient receiving IV amiodarone for refractory ventricular tachycardia. The nurse notices the infusion site has become erythematous, swollen, and painful. What is the most appropriate immediate action?",
    options: [
      "Slow the infusion rate and apply warm compresses to the site",
      "Stop the infusion immediately, remove the IV catheter, and restart the infusion through a central venous catheter",
      "Continue the infusion and apply a topical steroid cream to the area",
      "Reduce the concentration by adding more diluent to the current bag"
    ],
    correctAnswer: 1,
    rationaleLong: "Amiodarone is a vesicant medication that can cause phlebitis and tissue necrosis when administered through peripheral IV access, particularly with prolonged infusions or concentrations greater than 2 mg/mL. The erythema, swelling, and pain at the infusion site indicate phlebitis or early extravasation, requiring immediate action. The appropriate response is to stop the infusion immediately, remove the peripheral IV catheter to prevent further tissue damage, and restart the amiodarone infusion through a central venous catheter (CVC). Central access is strongly preferred for amiodarone infusions lasting more than 1 hour to reduce the risk of phlebitis and tissue injury. In the emergency setting, if a central line cannot be placed immediately, amiodarone can be temporarily administered through a large-bore peripheral IV in a large proximal vein (antecubital fossa) at a concentration no greater than 2 mg/mL, with frequent site assessment every 15-30 minutes. The nurse should document the extravasation, assess the extent of tissue involvement, and consider cold compresses and elevation of the affected limb. If significant tissue necrosis occurs, plastic surgery consultation may be needed. Slowing the infusion rate does not address the ongoing tissue injury. Continuing the infusion at any rate will worsen the phlebitis and potentially cause tissue necrosis. Reducing the concentration in the current bag does not address the existing site injury and may affect the drug dosing. The emergency nurse should proactively advocate for central access whenever amiodarone infusions are anticipated to continue beyond the initial bolus dose.",
    learningObjective: "Manage amiodarone extravasation by stopping the peripheral infusion and converting to central venous access",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Amiodarone is a vesicant that requires central access for prolonged infusions - peripheral administration risks phlebitis and tissue necrosis",
    clinicalPearls: [
      "Amiodarone causes phlebitis at peripheral concentration >2 mg/mL",
      "Central access is preferred for infusions lasting >1 hour",
      "Assess peripheral IV site every 15-30 minutes during amiodarone infusion",
      "If peripheral access is necessary, use a large proximal vein with dilute concentration"
    ],
    safetyNote: "Amiodarone extravasation can cause tissue necrosis - never continue infusing through a compromised IV site",
    distractorRationales: [
      "Slowing the rate does not address existing tissue damage from a vesicant",
      "Continuing the infusion through a damaged site will worsen tissue injury",
      "Reducing concentration does not fix the existing extravasation injury"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "A 82-year-old female presents with acute shortness of breath. She has bilateral lower extremity edema, an S3 gallop, hepatojugular reflux, and bilateral crackles. Her BNP level is 1,850 pg/mL (normal <100). Previous echocardiogram showed EF 25%. She is currently on home medications of furosemide, lisinopril, carvedilol, and spironolactone. Which assessment finding would indicate her heart failure management requires urgent modification?",
    options: [
      "Weight gain of 5 pounds in the last 3 days",
      "Heart rate of 72 bpm on carvedilol",
      "Serum creatinine of 1.0 mg/dL",
      "Serum potassium of 4.2 mEq/L"
    ],
    correctAnswer: 0,
    rationaleLong: "A weight gain of 5 pounds (2.3 kg) in 3 days is a critical indicator of acute fluid retention and worsening heart failure that requires urgent intervention. In heart failure management, daily weight monitoring is one of the most important self-care behaviors. A weight gain of 2 or more pounds (1 kg) per day or 5 or more pounds (2.3 kg) per week is a significant red flag indicating fluid accumulation that may precede clinical decompensation. One liter of fluid retention corresponds to approximately 2.2 pounds (1 kg) of weight gain. This patient has gained 5 pounds in 3 days, indicating approximately 2.3 liters of excess fluid accumulation. Combined with her current symptoms (bilateral edema, S3 gallop, hepatojugular reflux, crackles) and markedly elevated BNP (1,850 pg/mL, normal <100), this represents acute decompensated heart failure requiring intensification of diuretic therapy. The emergency nurse should anticipate IV diuretic administration (furosemide IV at 1-2x the patient's current oral daily dose), fluid and sodium restriction, strict intake and output monitoring, and daily weights. A heart rate of 72 bpm on carvedilol represents appropriate rate control and is not concerning. Serum creatinine of 1.0 mg/dL is within normal limits and does not indicate renal deterioration. Serum potassium of 4.2 mEq/L is normal, especially notable because she is on both an ACE inhibitor and spironolactone, which can cause hyperkalemia. The nurse should continue to monitor renal function and potassium closely with diuretic intensification.",
    learningObjective: "Identify rapid weight gain as a critical indicator of acute fluid retention requiring urgent heart failure management modification",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Heart Failure Exacerbation",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Weight gain >2 lbs/day or >5 lbs/week in HF patients indicates fluid retention requiring intervention, even before symptoms worsen",
    clinicalPearls: [
      "1 kg weight gain = ~1 liter fluid retention",
      "2+ lbs/day or 5+ lbs/week = urgent heart failure red flag",
      "IV furosemide dose typically 1-2x the oral home dose for acute decompensation",
      "BNP >400 pg/mL strongly supports acute HF diagnosis; levels correlate with severity"
    ],
    safetyNote: "Monitor renal function and potassium closely when intensifying diuretics, especially in patients on ACE inhibitors and aldosterone antagonists",
    distractorRationales: [
      "HR 72 on carvedilol is appropriate beta-blockade, not a concern",
      "Creatinine 1.0 is normal and does not indicate renal deterioration",
      "Potassium 4.2 is normal despite dual RAAS blockade"
    ],
    lessonLink: "/emergency/lessons/heart-failure-management"
  },
  {
    stem: "A patient presents to the ED with a wide-complex tachycardia at 160 bpm. The nurse is trying to differentiate between ventricular tachycardia (VT) and supraventricular tachycardia (SVT) with aberrant conduction. Which ECG finding most strongly supports a diagnosis of VT?",
    options: [
      "QRS duration of 140 ms",
      "AV dissociation with more P waves than QRS complexes",
      "Regular R-R intervals throughout the tracing",
      "Heart rate greater than 150 bpm"
    ],
    correctAnswer: 1,
    rationaleLong: "AV dissociation (more P waves than QRS complexes, indicating independent atrial and ventricular activity) is the most specific ECG finding for ventricular tachycardia and essentially confirms the diagnosis. In VT, the ventricular focus fires independently of the atria, and the sinus node continues to fire at its own rate. This creates a situation where P waves march through the rhythm at a different rate than the QRS complexes. When there are more P waves than QRS complexes, it means the atria and ventricles are beating independently - a hallmark of VT. Other ECG findings that support VT over SVT with aberrancy include: fusion beats (a beat that results from simultaneous activation of the ventricle by the sinus impulse and the ventricular focus), capture beats (a normal-appearing narrow QRS amidst wide complexes indicating the sinus impulse briefly 'captured' the ventricles), concordance (all precordial leads showing either positive or negative QRS complexes), very wide QRS (>160 ms), and northwest axis. The Brugada criteria and Vereckei algorithm are systematic approaches to differentiate VT from SVT with aberrancy. While a QRS duration >140 ms is suggestive of VT, it is not specific as some forms of SVT with pre-existing bundle branch block can have wide QRS complexes. Regular R-R intervals can be seen in both VT and SVT. Heart rate does not reliably distinguish between VT and SVT. The clinical pearl for emergency nurses is: when in doubt, treat wide-complex tachycardia as VT - it is safer to treat SVT as VT than to miss true VT.",
    learningObjective: "Identify AV dissociation as the most specific ECG finding for differentiating ventricular tachycardia from SVT with aberrant conduction",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "12-Lead ECG Interpretation",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "When in doubt about wide-complex tachycardia, treat as VT - it is safer than missing true VT",
    clinicalPearls: [
      "AV dissociation is virtually diagnostic of VT",
      "Fusion and capture beats also confirm VT",
      "Brugada criteria: absence of RS complex in any precordial lead = VT",
      "When in doubt, all wide-complex tachycardia should be treated as VT"
    ],
    safetyNote: "Never assume a wide-complex tachycardia is SVT with aberrancy without definitive proof - treating VT as SVT can be fatal",
    distractorRationales: [
      "QRS >140 ms suggests VT but can also occur in SVT with bundle branch block",
      "Regular R-R intervals occur in both VT and regular SVT",
      "Heart rate does not reliably differentiate VT from SVT"
    ],
    lessonLink: "/emergency/lessons/ecg-interpretation"
  },
  {
    stem: "A 58-year-old male is being rapidly assessed in the ED for acute chest pain. The emergency nurse obtains a HEART score to risk-stratify the patient. Which component is NOT part of the HEART score assessment?",
    options: [
      "History (clinical presentation characteristics)",
      "ECG findings",
      "D-dimer level",
      "Age of the patient"
    ],
    correctAnswer: 2,
    rationaleLong: "The HEART score is a validated risk stratification tool for patients presenting with chest pain in the emergency department. The acronym HEART stands for: H - History (typical, moderately suspicious, or slightly suspicious characteristics); E - ECG (significant ST deviation, non-specific repolarization changes, or normal); A - Age (<45, 45-64, or >=65 years); R - Risk factors (diabetes, hypertension, hypercholesterolemia, obesity, smoking, family history of CAD); T - Troponin (normal, 1-3x normal, or >3x normal). D-dimer is NOT a component of the HEART score. D-dimer is used primarily in the diagnostic workup of pulmonary embolism and venous thromboembolism, not for ACS risk stratification. Each component of the HEART score is assigned 0, 1, or 2 points for a maximum total of 10 points. Interpretation: 0-3 points = low risk (1.7% chance of major adverse cardiac event in 6 weeks, candidates for early discharge); 4-6 points = moderate risk (12-16.6% MACE rate, observation and further workup recommended); 7-10 points = high risk (50-65% MACE rate, admission and aggressive treatment indicated). The emergency nurse can rapidly calculate the HEART score at the bedside to assist with disposition decisions and resource allocation. The HEART score has been shown to be superior to clinical gestalt alone and helps identify low-risk patients who may be safely discharged from the ED with appropriate follow-up.",
    learningObjective: "Apply the HEART score components (History, ECG, Age, Risk factors, Troponin) for chest pain risk stratification",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Acute Coronary Syndrome",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "HEART score uses Troponin, not D-dimer. D-dimer is for PE risk stratification, not ACS",
    clinicalPearls: [
      "HEART: History, ECG, Age, Risk factors, Troponin (0-10 points)",
      "Score 0-3: low risk (1.7% MACE), consider discharge",
      "Score 4-6: moderate risk, observe and further workup",
      "Score 7-10: high risk (50-65% MACE), admit and treat aggressively"
    ],
    safetyNote: "HEART score is an adjunct to clinical judgment - always use serial troponins and clinical reassessment regardless of initial score",
    distractorRationales: [
      "History IS a HEART score component (typical vs atypical presentation)",
      "ECG IS a HEART score component (ST changes vs normal)",
      "Age IS a HEART score component (<45, 45-64, >=65 years)"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndrome"
  },
  {
    stem: "A 44-year-old previously healthy female is brought to the ED after being found unconscious in the bathroom. ECG rhythm strip shows a regular wide-complex rhythm at 280 bpm with a sinusoidal waveform. A medication bottle of flecainide is found in her purse. What is the most appropriate treatment?",
    options: [
      "IV amiodarone 300 mg bolus",
      "IV sodium bicarbonate 1-2 mEq/kg bolus",
      "Synchronized cardioversion at 100 joules",
      "IV lidocaine 100 mg bolus"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with sodium channel blocker toxicity from flecainide, manifesting as a wide-complex tachycardia with a sinusoidal waveform at a very rapid rate. Flecainide is a Class IC antiarrhythmic that works by blocking sodium channels, slowing Phase 0 depolarization and reducing conduction velocity. In overdose, excessive sodium channel blockade causes progressive QRS widening that can evolve into a sinusoidal waveform, hemodynamic collapse, and eventually ventricular fibrillation or asystole. The treatment of choice for sodium channel blocker toxicity is IV sodium bicarbonate (1-2 mEq/kg bolus, repeated as needed). Sodium bicarbonate works by two mechanisms: (1) the sodium load increases the extracellular sodium concentration, which helps overcome the sodium channel blockade by increasing the sodium gradient across the cell membrane, and (2) the alkalinization of the blood decreases the binding of the drug to sodium channels (since flecainide binding is pH-dependent and increases in acidotic conditions). The target pH is 7.50-7.55. Sodium bicarbonate should be given until the QRS narrows or the pH reaches 7.55. Amiodarone would worsen the situation as it also has sodium channel blocking properties and could potentiate the toxicity. Cardioversion alone does not address the underlying sodium channel blockade and the rhythm will recur. Lidocaine, while a sodium channel blocker itself, actually has different binding kinetics and may be considered as a secondary agent, but it is not the first-line treatment. IV lipid emulsion (Intralipid 20%) may also be considered for severe local anesthetic or sodium channel blocker toxicity as a rescue therapy.",
    learningObjective: "Treat sodium channel blocker toxicity with IV sodium bicarbonate to overcome sodium channel blockade and alkalinize the blood",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Wide QRS + sinusoidal pattern + sodium channel blocker exposure = sodium bicarbonate is the antidote, NOT amiodarone (which worsens toxicity)",
    clinicalPearls: [
      "Sodium bicarbonate 1-2 mEq/kg for sodium channel blocker toxicity",
      "Target pH 7.50-7.55; repeat until QRS narrows",
      "Amiodarone has sodium channel blocking properties - avoid in sodium channel toxicity",
      "IV lipid emulsion (Intralipid) is a rescue therapy for severe toxicity"
    ],
    safetyNote: "Sinusoidal wide-complex rhythm from sodium channel blocker toxicity can rapidly degenerate to VF - have defibrillator ready",
    distractorRationales: [
      "Amiodarone has sodium channel blocking properties and would worsen toxicity",
      "Cardioversion alone does not treat the underlying pharmacological cause",
      "Lidocaine is not first-line; sodium bicarbonate addresses the fundamental toxicity mechanism"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "An ED nurse is preparing to assist with rapid sequence intubation (RSI) for a patient in cardiogenic shock with severe pulmonary edema. BP is 72/44 mmHg on norepinephrine. Which induction agent is most appropriate for this hemodynamically unstable patient?",
    options: [
      "Propofol 2 mg/kg IV",
      "Etomidate 0.3 mg/kg IV or ketamine at reduced dose",
      "Midazolam 0.3 mg/kg IV",
      "Thiopental 3-5 mg/kg IV"
    ],
    correctAnswer: 1,
    rationaleLong: "In a hemodynamically unstable patient requiring rapid sequence intubation, the choice of induction agent is critical because many commonly used agents cause significant hypotension through vasodilation, myocardial depression, or both. Etomidate at 0.3 mg/kg IV is the preferred induction agent in hemodynamically compromised patients because it provides rapid onset of unconsciousness (within 30-60 seconds) with minimal cardiovascular effects - it does not significantly alter heart rate, blood pressure, or cardiac output. Ketamine at a reduced dose (0.5-1 mg/kg instead of the standard 1.5-2 mg/kg) is an alternative as it generally maintains or increases blood pressure through sympathetic stimulation, although in severely catecholamine-depleted patients (such as those in prolonged shock), ketamine's direct myocardial depressant effects may predominate. Propofol causes significant vasodilation and myocardial depression, leading to profound hypotension, and is CONTRAINDICATED in hemodynamically unstable patients. A standard induction dose of propofol can reduce blood pressure by 25-40%. Midazolam at induction doses also causes hypotension, though less severe than propofol. However, its onset is slower and less predictable than etomidate. Thiopental (a barbiturate) causes substantial myocardial depression and vasodilation, making it highly dangerous in shock states. The emergency nurse should prepare push-dose vasopressors (phenylephrine 100 mcg or epinephrine 10-20 mcg) to have available during intubation in case of further hemodynamic deterioration, regardless of which induction agent is selected.",
    learningObjective: "Select hemodynamically stable induction agents (etomidate or ketamine) for RSI in patients with cardiogenic shock",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiogenic Pulmonary Edema",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Propofol causes 25-40% blood pressure drop - NEVER use for induction in hemodynamically unstable patients",
    clinicalPearls: [
      "Etomidate: hemodynamically neutral, ideal for unstable patients",
      "Ketamine: sympathomimetic but may cause depression in catecholamine-depleted patients",
      "Have push-dose vasopressors ready during RSI of any hypotensive patient",
      "Reduce all induction agent doses by 50% in shock states"
    ],
    safetyNote: "All induction agents can worsen hypotension in shock - have push-dose epinephrine or phenylephrine at bedside",
    distractorRationales: [
      "Propofol causes severe hypotension through vasodilation and myocardial depression",
      "Midazolam has slower onset and causes hypotension at induction doses",
      "Thiopental causes substantial myocardial depression and is dangerous in shock"
    ],
    lessonLink: "/emergency/lessons/cardiogenic-pulmonary-edema"
  },
  {
    stem: "A 50-year-old female presents to the ED with acute onset crushing chest pain, ST elevation in leads V1-V4, and hemodynamic instability. Emergent echocardiography reveals severe apical ballooning with hyperkinetic basal segments and a left ventricular outflow tract (LVOT) obstruction. Her troponin is elevated but coronary angiography shows no obstructive coronary disease. What is the most likely diagnosis?",
    options: [
      "Anterior STEMI from LAD occlusion",
      "Takotsubo (stress) cardiomyopathy with dynamic LVOT obstruction",
      "Hypertrophic obstructive cardiomyopathy (HOCM) with MI",
      "Acute myocarditis from viral infection"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation is classic for Takotsubo (stress) cardiomyopathy, also known as broken heart syndrome or apical ballooning syndrome. The key features include: (1) acute chest pain with ST elevation mimicking STEMI; (2) elevated troponin; (3) characteristic apical ballooning with hyperkinetic basal segments on echocardiography (creating the classic 'takotsubo' or Japanese octopus pot shape); and (4) no obstructive coronary artery disease on angiography. The presence of dynamic LVOT obstruction occurs in approximately 10-25% of Takotsubo cases due to the hyperkinetic basal segments creating systolic anterior motion of the mitral valve. This is a critical complication because it changes management. In Takotsubo with LVOT obstruction, catecholamines and inotropes (dobutamine, milrinone) are CONTRAINDICATED as they worsen the obstruction. Instead, treatment includes IV fluids (cautious volume loading), phenylephrine (pure alpha agonist to increase afterload), and short-acting beta-blockers (esmolol) to reduce the dynamic obstruction. Takotsubo predominantly affects postmenopausal women and is typically triggered by emotional or physical stress. The exact mechanism involves catecholamine-mediated myocardial stunning. Recovery of ventricular function usually occurs within days to weeks. Anterior STEMI is ruled out by the clean coronary arteries. HOCM is a chronic condition with asymmetric septal hypertrophy, different from the acute apical ballooning pattern. Acute myocarditis usually shows diffuse wall motion abnormalities without the characteristic apical ballooning pattern.",
    learningObjective: "Recognize Takotsubo cardiomyopathy with LVOT obstruction and understand the contraindication of inotropes",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Heart Failure Exacerbation",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Takotsubo with LVOT obstruction is worsened by inotropes and catecholamines - treat with fluids, phenylephrine, and beta-blockers",
    clinicalPearls: [
      "Takotsubo: apical ballooning + hyperkinetic base + clean coronaries + emotional/physical stress trigger",
      "LVOT obstruction occurs in 10-25% of cases - avoid inotropes",
      "Predominantly affects postmenopausal women",
      "Ventricular function typically recovers within days to weeks"
    ],
    safetyNote: "Do NOT give catecholamines or inotropes for Takotsubo with LVOT obstruction - will worsen obstruction and can cause cardiogenic shock",
    distractorRationales: [
      "Anterior STEMI is ruled out by clean coronary arteries on angiography",
      "HOCM has asymmetric septal hypertrophy, not acute apical ballooning",
      "Myocarditis shows diffuse wall motion abnormalities without the takotsubo pattern"
    ],
    lessonLink: "/emergency/lessons/heart-failure-management"
  },
  {
    stem: "A nurse in the ED is caring for a patient with an acute STEMI who has received aspirin, heparin, and is awaiting cardiac catheterization. The patient suddenly develops a wide-complex irregular rhythm at 150 bpm on the monitor and becomes unresponsive with no palpable pulse. The rhythm appears to be ventricular fibrillation. What is the first action?",
    options: [
      "Administer epinephrine 1 mg IV push",
      "Begin chest compressions and deliver an unsynchronized defibrillation shock as soon as possible",
      "Administer amiodarone 300 mg IV push",
      "Perform synchronized cardioversion at 200 joules"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has developed pulseless ventricular fibrillation (VF) - a cardiac arrest requiring immediate initiation of the ACLS VF/pVT algorithm. The first actions in any cardiac arrest are: (1) Call for help/activate the code team; (2) Begin high-quality chest compressions (rate 100-120/min, depth at least 2 inches, full chest recoil, minimize interruptions); and (3) Defibrillation as soon as possible. In witnessed VF arrest (as this is, occurring on a monitored patient), defibrillation should be performed as quickly as possible. Defibrillation for VF must be UNSYNCHRONIZED because VF has no organized QRS complexes for the defibrillator to synchronize with. Attempting synchronized cardioversion in VF will result in the defibrillator failing to discharge because it cannot identify a QRS complex to synchronize to, wasting critical time. Each minute of delay in defibrillation reduces survival by approximately 7-10%. Epinephrine is important but should not be given before the first defibrillation attempt in witnessed VF arrest. Per the ACLS algorithm, epinephrine is given after the second shock (during the second cycle of CPR). Amiodarone follows after the third shock. The emergency nurse should ensure the defibrillator is set to the maximum biphasic energy (typically 200J) for VF, verify the rhythm quickly, clear the patient, and deliver the shock. CPR should resume immediately after the shock without checking for a pulse, continuing for 2 minutes before the next rhythm check. The nurse should also ensure that endotracheal or supraglottic airway equipment is prepared and that IV access is confirmed for medication delivery.",
    learningObjective: "Initiate immediate CPR and unsynchronized defibrillation as the first response to witnessed ventricular fibrillation cardiac arrest",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Arrest Management (ACLS)",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "VF requires UNSYNCHRONIZED defibrillation - synchronized cardioversion will not discharge because there is no QRS to sync to",
    clinicalPearls: [
      "VF = unsynchronized defibrillation; organized rhythms = synchronized cardioversion",
      "Each minute of VF without defibrillation reduces survival by 7-10%",
      "Resume CPR immediately after shock without pulse check for 2 minutes",
      "Medications follow shock delivery in the ACLS algorithm, not before"
    ],
    safetyNote: "Ensure all team members are clear of the patient and conducting surfaces before defibrillation - 'I'm clear, you're clear, everyone's clear'",
    distractorRationales: [
      "Epinephrine comes after the second shock in the ACLS algorithm, not before the first",
      "Amiodarone comes after the third shock, not before the first",
      "Synchronized cardioversion cannot work in VF - no QRS to synchronize to"
    ],
    lessonLink: "/emergency/lessons/cardiac-arrest-acls"
  },
  {
    stem: "A 68-year-old male with known atrial fibrillation on rivaroxaban presents to the ED after a fall, with a large scalp laceration and altered mental status. CT head shows an acute subdural hematoma. His last dose of rivaroxaban was 4 hours ago. What reversal agent should the emergency nurse prepare?",
    options: [
      "Protamine sulfate",
      "Vitamin K 10 mg IV",
      "Andexanet alfa (Andexxa)",
      "Fresh frozen plasma (FFP) 4 units"
    ],
    correctAnswer: 2,
    rationaleLong: "Rivaroxaban is a direct oral anticoagulant (DOAC) that works as a Factor Xa inhibitor. For life-threatening bleeding in patients on Factor Xa inhibitors (rivaroxaban, apixaban, edoxaban), the specific reversal agent is andexanet alfa (Andexxa). Andexanet alfa is a recombinant modified human Factor Xa protein that acts as a decoy receptor, binding to Factor Xa inhibitors with high affinity and sequestering them, thereby restoring normal Factor Xa activity and thrombin generation. The dosing of andexanet alfa depends on the specific Factor Xa inhibitor, the dose, and the time since the last dose. For rivaroxaban taken within 8 hours, the high-dose regimen is used: an IV bolus of 800 mg over 30 minutes followed by an infusion of 960 mg over 2 hours. If andexanet alfa is unavailable, 4-factor prothrombin complex concentrate (4F-PCC, such as Kcentra) at 50 units/kg can be used as an alternative, though it is not a specific reversal agent. Protamine sulfate reverses unfractionated heparin and partially reverses low-molecular-weight heparin, but has no effect on Factor Xa inhibitors. Vitamin K reverses warfarin (a vitamin K antagonist) but has no effect on DOACs, which do not work through the vitamin K pathway. Fresh frozen plasma replaces clotting factors but the volume required to overcome DOAC effects is impractical and ineffective. The emergency nurse should also ensure the neurosurgical team is consulted immediately, maintain blood pressure control, and prepare for potential operative evacuation of the subdural hematoma.",
    learningObjective: "Identify andexanet alfa as the specific reversal agent for Factor Xa inhibitor-related life-threatening bleeding",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 3,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Vitamin K only reverses warfarin; protamine only reverses heparin. DOACs have specific reversal agents: andexanet alfa for Factor Xa inhibitors, idarucizumab for dabigatran",
    clinicalPearls: [
      "Andexanet alfa: reverses rivaroxaban, apixaban, edoxaban (Factor Xa inhibitors)",
      "Idarucizumab (Praxbind): reverses dabigatran (direct thrombin inhibitor)",
      "4F-PCC (Kcentra) is alternative if specific reversal agent unavailable",
      "Dosing depends on drug, dose, and time since last dose"
    ],
    safetyNote: "Know which DOAC the patient is on to select the correct reversal agent - Factor Xa inhibitor vs direct thrombin inhibitor reversal is different",
    distractorRationales: [
      "Protamine reverses heparin, not Factor Xa inhibitors",
      "Vitamin K reverses warfarin, not DOACs",
      "FFP is ineffective against DOACs and impractical in volume required"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "A patient arrives in the ED with chest pain. The initial 12-lead ECG shows ST elevation in leads aVR with diffuse ST depression in multiple other leads. What does this pattern suggest?",
    options: [
      "Isolated right ventricular infarction",
      "Left main coronary artery occlusion or severe three-vessel disease requiring emergent catheterization",
      "Pericarditis with typical diffuse ST changes",
      "Benign early repolarization"
    ],
    correctAnswer: 1,
    rationaleLong: "ST elevation in lead aVR with diffuse ST depression in multiple other leads is a critical ECG pattern that suggests left main coronary artery (LMCA) occlusion or severe three-vessel coronary artery disease. Lead aVR is unique because it is the only standard ECG lead that directly views the left ventricular cavity and the basal septum from the right shoulder perspective. In the setting of severe diffuse subendocardial ischemia (as occurs with LMCA disease or severe three-vessel disease), the ischemic current is directed toward the cavity of the left ventricle, which is best seen as ST elevation in aVR. The reciprocal changes appear as diffuse ST depression in the remaining leads. This pattern carries an extremely high mortality rate (approximately 70% in-hospital mortality for acute LMCA occlusion) and requires emergent cardiac catheterization. Some guidelines now consider ST elevation in aVR with diffuse ST depression as a STEMI equivalent warranting emergent cath lab activation. The magnitude of ST elevation in aVR (>1.5 mm) correlates with worse prognosis. This pattern is not consistent with pericarditis, which shows diffuse ST elevation (not depression) with PR depression. Benign early repolarization typically shows concave ST elevation in the inferior and lateral leads with notching of the J point. Isolated RV infarction would show ST elevation in right-sided leads (V4R) and inferior leads, not the diffuse depression pattern described. The emergency nurse must recognize this as a life-threatening finding requiring the same urgency as any STEMI.",
    learningObjective: "Recognize ST elevation in lead aVR with diffuse ST depression as a marker for left main coronary artery disease requiring emergent intervention",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "12-Lead ECG Interpretation",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ST elevation in aVR is often overlooked but can indicate the deadliest form of ACS - left main occlusion with 70% in-hospital mortality",
    clinicalPearls: [
      "ST elevation aVR + diffuse ST depression = LMCA or severe 3-vessel disease",
      "Consider as STEMI equivalent requiring emergent catheterization",
      "ST elevation >1.5 mm in aVR correlates with worse outcomes",
      "aVR is the most frequently ignored lead but contains critical information"
    ],
    safetyNote: "ST elevation in aVR with diffuse ST depression has the highest mortality of any ECG ACS pattern - do not delay cath lab activation",
    distractorRationales: [
      "RV infarction shows ST elevation in right-sided and inferior leads, not diffuse depression",
      "Pericarditis shows diffuse ST elevation, not diffuse ST depression",
      "Benign early repolarization shows concave ST elevation without ST depression in other leads"
    ],
    lessonLink: "/emergency/lessons/ecg-interpretation"
  },
  {
    stem: "A 55-year-old male with known heart failure (EF 20%) arrives in the ED with progressive dyspnea over 3 days. He is on optimal medical therapy including sacubitril/valsartan, carvedilol, spironolactone, and dapagliflozin. Current assessment: BP 96/58, HR 110, RR 28, SpO2 91%. Bilateral crackles, JVD, and 3+ pitting edema. BNP 2,400. What initial diuretic approach is recommended?",
    options: [
      "IV furosemide 40 mg once and reassess in 6 hours",
      "IV furosemide at 2.5 times the oral home dose, given as a bolus, with close monitoring of urine output",
      "Oral metolazone 5 mg only and avoid IV diuretics due to hypotension risk",
      "Thiazide diuretic alone for gentle diuresis"
    ],
    correctAnswer: 1,
    rationaleLong: "For acute decompensated heart failure in patients already on chronic loop diuretic therapy, current guidelines recommend an IV loop diuretic dose of at least 1-2.5 times the patient's total daily oral dose, administered as an IV bolus. Patients on chronic oral diuretics often develop diuretic resistance, requiring higher IV doses to achieve adequate natriuresis and diuresis. The IV route bypasses intestinal edema that impairs oral absorption in volume-overloaded patients. The recommended approach is to administer the initial IV bolus, then closely monitor urine output (target >100-150 mL/hr in the first 2 hours) and assess response within 2-6 hours. If urine output is inadequate, the dose should be escalated or a second agent (such as metolazone or chlorothiazide, which work on different parts of the nephron) can be added for sequential nephron blockade. A single 40 mg IV furosemide dose is likely inadequate for a patient already on chronic oral diuretics, as they have developed tolerance and require higher doses. Oral metolazone alone is insufficient for acute decompensation with significant volume overload and hypoxemia, and oral absorption is unreliable in edematous patients. Thiazide diuretics alone are not potent enough for acute decompensated heart failure. The nurse should place a Foley catheter for accurate output monitoring, obtain baseline labs (BMP, BNP, hepatic panel), monitor electrolytes (especially potassium and magnesium) every 6-8 hours, and track daily weights. Hypotension should be monitored but is not an absolute contraindication to IV diuretics when the patient is severely fluid overloaded.",
    learningObjective: "Calculate and administer appropriate IV loop diuretic dosing for acute decompensated heart failure based on home oral dose",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Heart Failure Exacerbation",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Patients on chronic oral diuretics need higher IV doses due to diuretic resistance - the IV dose should be at least 1-2.5x the oral home dose",
    clinicalPearls: [
      "IV furosemide dose: 1-2.5x total daily oral dose as starting bolus",
      "Target urine output >100-150 mL/hr in first 2 hours post-diuretic",
      "Sequential nephron blockade with metolazone if loop diuretic response is inadequate",
      "IV route bypasses impaired oral absorption from intestinal edema"
    ],
    safetyNote: "Monitor potassium and magnesium every 6-8 hours during aggressive diuresis - hypokalemia and hypomagnesemia increase arrhythmia risk",
    distractorRationales: [
      "40 mg IV furosemide is inadequate for patients on chronic diuretics with diuretic resistance",
      "Oral metolazone alone is insufficient and has unreliable absorption in edematous patients",
      "Thiazide diuretics alone are not potent enough for acute decompensated heart failure"
    ],
    lessonLink: "/emergency/lessons/heart-failure-management"
  },
  {
    stem: "A nurse is triaging a 72-year-old female who presents with bilateral arm weakness and jaw pain that started 2 hours ago. She denies chest pain. She appears anxious, diaphoretic, and slightly short of breath. BP 158/94, HR 92, RR 22, SpO2 96%. What should the triage nurse suspect?",
    options: [
      "Bilateral musculoskeletal strain from overexertion",
      "Atypical acute myocardial infarction presentation in an elderly female",
      "Anxiety disorder with somatic symptoms",
      "Dental abscess causing jaw pain with referred arm pain"
    ],
    correctAnswer: 1,
    rationaleLong: "This elderly female patient is presenting with an atypical acute myocardial infarction. Key features that should alert the triage nurse include: bilateral arm pain (which is cardiac referred pain along the C8-T1 dermatomes), jaw pain (common cardiac pain referral along the trigeminal nerve distribution), diaphoresis (autonomic activation from myocardial ischemia), anxiety (sensation of impending doom), and dyspnea (anginal equivalent). Importantly, she DENIES chest pain, which is a common feature of atypical MI presentations. Studies consistently show that women, elderly patients, and diabetic patients are more likely to present with atypical symptoms. The landmark study by Canto et al. found that approximately 33% of MI patients present without chest pain, and this percentage is even higher in women over 65. Common atypical symptoms include: dyspnea (most common anginal equivalent), fatigue, nausea/vomiting, back pain, jaw pain, arm pain without chest pain, and epigastric discomfort. The triage nurse should immediately obtain a 12-lead ECG (within 10 minutes of arrival per guidelines), assign ESI Level 2, and initiate ACS protocol. Bilateral arm weakness could also suggest stroke, so a brief neurological screening (Cincinnati Stroke Scale) should be performed, but the combination of bilateral arm pain with jaw pain and diaphoresis is more consistent with cardiac ischemia. Attributing these symptoms to musculoskeletal strain, anxiety, or dental pathology in an elderly female with risk factors would be a dangerous misdiagnosis that could lead to delayed treatment and increased mortality.",
    learningObjective: "Recognize atypical MI presentation in elderly females including arm and jaw pain without chest pain",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "STEMI/NSTEMI Recognition",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "33% of MI patients (especially women and elderly) present WITHOUT chest pain. Jaw pain + arm pain + diaphoresis in an elderly female = MI until proven otherwise",
    clinicalPearls: [
      "Women present with atypical MI symptoms more often than men",
      "Jaw pain, bilateral arm pain, dyspnea, and fatigue are common MI equivalents",
      "33% of MI patients present without chest pain",
      "12-lead ECG within 10 minutes of arrival for any suspected ACS"
    ],
    safetyNote: "Never dismiss arm or jaw pain as musculoskeletal in patients with cardiac risk factors without performing an ECG and troponin",
    distractorRationales: [
      "Bilateral arm weakness from MSK strain would not cause diaphoresis and dyspnea",
      "Anxiety should be a diagnosis of exclusion after ruling out life-threatening causes",
      "Dental abscess does not cause bilateral arm pain and diaphoresis"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndrome"
  },
  {
    stem: "A 63-year-old male post-CABG surgery 3 days ago presents to the ED with fever (38.9C), sternal wound erythema, and purulent drainage from the surgical incision. Blood cultures are drawn. What is the most critical concern the emergency nurse should communicate to the surgical team?",
    options: [
      "Superficial wound infection requiring oral antibiotics",
      "Deep sternal wound infection/mediastinitis requiring emergent surgical exploration and IV antibiotics",
      "Normal post-operative inflammation that will resolve spontaneously",
      "Contact dermatitis from surgical dressing materials"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with signs and symptoms highly concerning for deep sternal wound infection (DSWI) or mediastinitis, a serious and potentially life-threatening complication of median sternotomy following cardiac surgery. The clinical findings of fever, sternal wound erythema, and purulent drainage at post-operative day 3 are red flags that require immediate evaluation and intervention. Mediastinitis occurs in approximately 1-5% of cardiac surgery patients and carries a mortality rate of 14-47% if not treated aggressively. Deep sternal wound infection can extend to the mediastinal structures including the great vessels, heart, and sternal bone (osteomyelitis). The emergency nurse should immediately communicate the findings to the cardiothoracic surgical team, as this condition requires emergent surgical exploration with wound debridement, sternal rewiring or reconstruction, and placement of wound VAC (vacuum-assisted closure) therapy or muscle flap coverage. Broad-spectrum IV antibiotics should be initiated immediately after blood cultures are obtained, covering both gram-positive organisms (especially Staphylococcus aureus, including MRSA) and gram-negative organisms. Empiric coverage often includes vancomycin plus a broad-spectrum beta-lactam. This is NOT a superficial infection that can be treated with oral antibiotics alone, and the purulent drainage with fever indicates more than normal post-operative inflammation. Contact dermatitis would cause a rash pattern corresponding to the dressing without purulent drainage or fever. The nurse should also assess for sternal instability (click or movement on palpation) which further supports deep infection.",
    learningObjective: "Recognize post-cardiac surgery deep sternal wound infection as a surgical emergency requiring immediate intervention",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Post-ROSC Care",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Post-cardiac surgery sternal wound infection with purulent drainage is NEVER superficial until proven otherwise - always assume deep/mediastinitis",
    clinicalPearls: [
      "Mediastinitis mortality: 14-47% without aggressive treatment",
      "Signs: fever, sternal erythema, purulent drainage, sternal instability",
      "S. aureus (including MRSA) is the most common pathogen",
      "Requires surgical debridement + IV antibiotics, not just oral antibiotics"
    ],
    safetyNote: "Post-cardiac surgery wound infections can rapidly progress to septic shock and multi-organ failure - emergent surgical consultation is mandatory",
    distractorRationales: [
      "Purulent drainage with fever is not superficial - oral antibiotics are insufficient",
      "Normal post-operative inflammation does not include purulent drainage and high fever",
      "Contact dermatitis does not cause purulent drainage or systemic fever"
    ],
    lessonLink: "/emergency/lessons/post-rosc-care"
  },
  {
    stem: "An emergency nurse is administering a continuous IV heparin infusion for a patient with NSTEMI. The current aPTT result is 28 seconds (target 60-80 seconds). According to the heparin nomogram, what adjustment should the nurse make?",
    options: [
      "Continue the current infusion rate and recheck aPTT in 6 hours",
      "Administer a heparin bolus and increase the infusion rate per the weight-based nomogram",
      "Stop the heparin infusion because the aPTT is too low",
      "Switch to enoxaparin (LMWH) since the patient is not responding to heparin"
    ],
    correctAnswer: 1,
    rationaleLong: "An aPTT of 28 seconds in a patient on a heparin infusion targeting 60-80 seconds indicates a significantly subtherapeutic anticoagulation level. This patient is not adequately anticoagulated for their NSTEMI, placing them at risk for thrombus propagation and further ischemic events. According to standard weight-based heparin nomograms, when the aPTT is significantly below the therapeutic range (typically <35-40 seconds or more than 20 seconds below target), the protocol calls for both a heparin bolus (typically 80 units/kg) and an increase in the infusion rate (typically by 4 units/kg/hour). The specific bolus dose and rate increase depend on the institution's weight-based heparin protocol, but the principle is the same: a bolus provides immediate anticoagulation while the increased rate achieves a new steady state. After the adjustment, the aPTT should be rechecked in 6 hours to assess the response. Simply continuing the current rate is inappropriate because the patient remains at risk for thrombotic events at this subtherapeutic level. Stopping the infusion is the opposite of what is needed - the patient needs MORE anticoagulation, not less. Switching to enoxaparin based on a single subtherapeutic aPTT is premature; the heparin dose simply needs adjustment. The emergency nurse should verify the infusion rate and concentration, check that the heparin bag is not empty or disconnected, confirm the IV site is patent, and accurately document the bolus administration and rate change.",
    learningObjective: "Adjust heparin infusion based on aPTT results using weight-based nomogram for subtherapeutic anticoagulation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Acute Coronary Syndrome",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Subtherapeutic aPTT on heparin requires BOTH a bolus (for immediate effect) AND a rate increase (for new steady state)",
    clinicalPearls: [
      "aPTT well below target: bolus + rate increase per nomogram",
      "aPTT slightly below target: rate increase only (no bolus)",
      "Recheck aPTT 6 hours after any dose adjustment",
      "Verify infusion rate, concentration, and IV patency before adjusting"
    ],
    safetyNote: "Always double-check heparin calculations with a second nurse - heparin dosing errors are a common cause of adverse drug events",
    distractorRationales: [
      "Continuing the current rate leaves the patient at risk for thrombotic complications",
      "Stopping heparin would worsen the situation by removing anticoagulation entirely",
      "Switching to LMWH is premature; the UFH dose simply needs adjustment"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndrome"
  },
  {
    stem: "A 30-year-old male presents to the ED after an electrical injury from a high-voltage power line. He is conscious, alert, and has entrance and exit wounds. ECG shows sinus tachycardia with no ST changes. CK is markedly elevated. Why should the emergency nurse continue cardiac monitoring for this patient?",
    options: [
      "A normal initial ECG guarantees no cardiac complications will develop",
      "High-voltage electrical injuries can cause delayed arrhythmias up to 24 hours after exposure, regardless of initial ECG findings",
      "Cardiac monitoring is only needed if the patient has chest pain",
      "CK elevation is always from skeletal muscle and has no cardiac significance in electrical injury"
    ],
    correctAnswer: 1,
    rationaleLong: "High-voltage electrical injuries (>1000 volts) pose significant risk for delayed cardiac arrhythmias and require continuous cardiac monitoring for at least 24 hours, even when the initial ECG appears normal. The electric current can cause direct myocardial damage through thermal injury to the conduction system and myocardial cells, potentially leading to ventricular fibrillation, ventricular tachycardia, atrial fibrillation, heart block, and other arrhythmias. These arrhythmias may not manifest immediately but can develop hours after the initial injury as myocardial edema progresses and repolarization abnormalities evolve. The mechanism involves direct cellular damage from the electrical current, thermal injury to cardiac tissue, and electroporation (formation of pores in cell membranes). The markedly elevated CK in this patient could reflect both skeletal muscle injury (rhabdomyolysis from extensive tissue damage along the current pathway) and myocardial injury. Cardiac-specific troponin should be obtained to differentiate cardiac from skeletal muscle damage. A normal initial ECG does not exclude the risk of delayed arrhythmias, and the patient must be monitored continuously. Additional concerns in high-voltage electrical injury include rhabdomyolysis (requiring aggressive IV fluid resuscitation targeting urine output >1 mL/kg/hr), compartment syndrome in the extremities, spinal cord injury, and internal organ damage along the current pathway. Low-voltage (<1000V) household current injuries with a normal ECG may be observed for a shorter period (4-6 hours) before discharge if asymptomatic. The emergency nurse should maintain the patient on continuous cardiac monitoring, establish IV access with isotonic fluid resuscitation, monitor urine for myoglobinuria, and obtain serial troponins.",
    learningObjective: "Implement continuous cardiac monitoring for high-voltage electrical injuries due to risk of delayed arrhythmias",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Normal initial ECG after high-voltage electrical injury does NOT exclude delayed arrhythmias - monitor for at least 24 hours",
    clinicalPearls: [
      "High-voltage (>1000V): 24-hour cardiac monitoring regardless of initial ECG",
      "Low-voltage (<1000V) with normal ECG: 4-6 hour observation may suffice",
      "CK elevation in electrical injury may reflect both myocardial and skeletal damage",
      "Aggressive IV fluids to prevent rhabdomyolysis-induced renal failure"
    ],
    safetyNote: "Current path through the thorax (hand-to-hand or hand-to-foot) carries highest risk of cardiac injury",
    distractorRationales: [
      "A normal initial ECG does NOT guarantee safety - delayed arrhythmias are well-documented",
      "Cardiac monitoring is needed regardless of symptoms after high-voltage injury",
      "CK elevation can reflect myocardial injury - cardiac troponin differentiates the source"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "A patient with acute inferior STEMI develops sudden onset of a new loud holosystolic murmur, bilateral crackles, and worsening hypotension. Bedside echocardiography shows severe mitral regurgitation. What mechanical complication has most likely occurred?",
    options: [
      "Ventricular septal rupture",
      "Papillary muscle rupture causing acute mitral regurgitation",
      "Left ventricular free wall rupture",
      "Aortic valve papillary fibroelastoma embolization"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has developed papillary muscle rupture, a catastrophic mechanical complication of acute myocardial infarction that causes sudden severe mitral regurgitation. The posteromedial papillary muscle is supplied by a single coronary artery (typically the posterior descending artery from the RCA), making it particularly vulnerable to ischemic necrosis in inferior MIs. The anterolateral papillary muscle has dual blood supply and is less commonly affected. Papillary muscle rupture typically occurs 2-7 days after MI. The sudden rupture causes the mitral valve leaflet to become flail, resulting in torrential mitral regurgitation. The clinical presentation includes a new loud holosystolic murmur (which may actually be soft or absent in severe MR with equalization of pressures), acute pulmonary edema (bilateral crackles from blood regurgitating into the left atrium and pulmonary veins), and cardiogenic shock. This is a surgical emergency requiring emergent mitral valve replacement or repair. Medical stabilization includes IV vasodilators (nitroprusside to reduce afterload and the regurgitant fraction), inotropes, and intra-aortic balloon pump (IABP) counterpulsation as a bridge to surgery. Ventricular septal rupture also presents with a new holosystolic murmur but would show a VSD on echocardiography with left-to-right shunt, not mitral regurgitation. Free wall rupture presents with sudden pulseless electrical activity (PEA) and tamponade, not a murmur. The emergency nurse should prepare for emergent surgical consultation, IABP insertion, and hemodynamic support.",
    learningObjective: "Recognize papillary muscle rupture as a mechanical complication of inferior MI presenting with acute mitral regurgitation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "STEMI/NSTEMI Recognition",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Posteromedial papillary muscle has SINGLE blood supply and is most vulnerable in inferior MI - anterolateral has dual supply",
    clinicalPearls: [
      "Papillary muscle rupture: day 2-7 post-MI, new holosystolic murmur + pulmonary edema",
      "Posteromedial papillary muscle is most commonly affected (single blood supply)",
      "Surgical emergency requiring mitral valve repair/replacement",
      "IABP as bridge to surgery to reduce afterload and regurgitant fraction"
    ],
    safetyNote: "Papillary muscle rupture has 50% mortality within 24 hours without surgery - emergent surgical consultation is mandatory",
    distractorRationales: [
      "Ventricular septal rupture shows VSD on echo, not mitral regurgitation",
      "Free wall rupture causes PEA and tamponade, not a murmur",
      "Aortic valve fibroelastoma is a rare tumor, not a post-MI mechanical complication"
    ],
    lessonLink: "/emergency/lessons/stemi-management"
  },
  {
    stem: "An ED nurse receives a 48-year-old patient from triage with a complaint of 'heart racing' for 1 hour. Vital signs: BP 124/78, HR 148 bpm, RR 18, SpO2 98%. The ECG shows a regular narrow-complex tachycardia. Before attempting vagal maneuvers, which assessment should the nurse perform?",
    options: [
      "Check if the patient has taken any caffeine today",
      "Auscultate for carotid bruits before performing carotid sinus massage",
      "Check a pregnancy test if the patient is of childbearing age",
      "Both B and C should be performed before vagal maneuvers"
    ],
    correctAnswer: 3,
    rationaleLong: "Before performing vagal maneuvers for SVT, two critical assessments should be completed: (1) Auscultation for carotid bruits before carotid sinus massage (CSM), and (2) A pregnancy test for patients of childbearing age. Carotid sinus massage involves applying firm pressure to the carotid body at the bifurcation of the common carotid artery. If the patient has significant carotid artery stenosis (indicated by a bruit), CSM could dislodge atherosclerotic plaque and cause a stroke. Therefore, auscultation for bruits is a mandatory safety check before CSM. If a bruit is detected, alternative vagal maneuvers should be used, such as the modified Valsalva maneuver, ice water facial immersion (diving reflex), or bearing down. A pregnancy test is important because: (a) pregnancy itself can cause SVT due to physiological changes; (b) the management approach may differ in pregnant patients (some medications like adenosine are considered relatively safe, but others may not be); and (c) if the tachycardia does not convert and the patient requires cardioversion, sedation medications have varying safety profiles in pregnancy; and (d) underlying conditions causing SVT in pregnancy (such as thyrotoxicosis or pulmonary embolism) must be considered. While caffeine intake is part of a thorough history, it does not change the safety of vagal maneuvers and is not a critical pre-procedure assessment. The emergency nurse should document the pre-procedure assessment, have resuscitation equipment at bedside, and obtain IV access before attempting any vagal maneuver.",
    learningObjective: "Perform essential safety assessments before vagal maneuvers including carotid auscultation and pregnancy testing",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER perform carotid sinus massage without first auscultating for bruits - risk of stroke from plaque embolization",
    clinicalPearls: [
      "Auscultate for carotid bruits before carotid sinus massage",
      "Modified Valsalva has higher SVT conversion rates than traditional techniques",
      "Check pregnancy test in childbearing-age patients before treatment",
      "Have IV access and resuscitation equipment ready before vagal maneuvers"
    ],
    safetyNote: "Carotid sinus massage is contraindicated with carotid bruits, recent stroke/TIA, or history of ventricular arrhythmias",
    distractorRationales: [
      "Caffeine history is relevant but does not change vagal maneuver safety",
      "Carotid auscultation alone is necessary but pregnancy testing is also important",
      "Pregnancy test alone misses the critical carotid bruit assessment"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "A 75-year-old patient in the ED develops acute pulmonary edema with respiratory failure requiring intubation. Post-intubation chest X-ray confirms ETT placement and shows bilateral infiltrates consistent with pulmonary edema. The patient's SpO2 remains at 88% despite FiO2 of 100%. The emergency nurse should anticipate which ventilator adjustment?",
    options: [
      "Increase the tidal volume to 12 mL/kg to improve oxygenation",
      "Apply positive end-expiratory pressure (PEEP) of 8-12 cmH2O to recruit alveoli and improve oxygenation",
      "Decrease the respiratory rate to reduce air trapping",
      "Switch to pressure support ventilation mode"
    ],
    correctAnswer: 1,
    rationaleLong: "In acute cardiogenic pulmonary edema with persistent hypoxemia despite 100% FiO2, the application of positive end-expiratory pressure (PEEP) is the appropriate ventilator adjustment. PEEP works by maintaining positive pressure in the airways at the end of expiration, which prevents alveolar collapse (atelectasis), recruits fluid-filled alveoli, improves ventilation-perfusion matching, and increases functional residual capacity. In cardiogenic pulmonary edema specifically, PEEP provides additional benefits: it reduces venous return (preload), which decreases pulmonary congestion, and it reduces left ventricular afterload by increasing intrathoracic pressure, thereby improving cardiac output in the failing heart. Starting PEEP at 8-12 cmH2O is appropriate, with titration based on oxygenation response and hemodynamic tolerance. Higher PEEP levels may be needed but should be applied cautiously as excessive PEEP can reduce venous return and cardiac output, particularly in hypovolemic patients. Increasing tidal volume to 12 mL/kg would violate lung-protective ventilation principles (target 6-8 mL/kg ideal body weight) and increase the risk of ventilator-induced lung injury (VILI) including barotrauma and volutrauma. Decreasing the respiratory rate would worsen respiratory acidosis. Switching to pressure support ventilation is a spontaneous mode that requires patient effort and is not appropriate for a newly intubated patient with acute respiratory failure who may be paralyzed or deeply sedated. The nurse should monitor blood pressure closely after PEEP adjustments as hemodynamic compromise can occur.",
    learningObjective: "Apply PEEP as a ventilator strategy to improve oxygenation in intubated patients with cardiogenic pulmonary edema",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiogenic Pulmonary Edema",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "PEEP in cardiogenic pulmonary edema has dual benefit: improves oxygenation AND reduces preload/afterload to help the failing heart",
    clinicalPearls: [
      "PEEP recruits collapsed alveoli and reduces shunt in pulmonary edema",
      "PEEP reduces preload and LV afterload, benefiting the failing heart",
      "Start at 8-12 cmH2O, titrate based on SpO2 and hemodynamics",
      "Maintain lung-protective ventilation: Vt 6-8 mL/kg IBW"
    ],
    safetyNote: "Monitor blood pressure closely after PEEP changes - excessive PEEP can decrease venous return and worsen hypotension",
    distractorRationales: [
      "High tidal volumes (12 mL/kg) cause ventilator-induced lung injury",
      "Decreasing respiratory rate would worsen respiratory acidosis",
      "Pressure support requires patient effort and is inappropriate for acute respiratory failure"
    ],
    lessonLink: "/emergency/lessons/cardiogenic-pulmonary-edema"
  }
];
