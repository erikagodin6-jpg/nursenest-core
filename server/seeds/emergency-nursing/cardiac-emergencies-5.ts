import { EmergencyNursingQuestion } from "./types";

export const cardiacEmergency5Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 58-year-old male on metoprolol presents with symptomatic bradycardia at 38 bpm. BP is 80/50 mmHg. Atropine and transcutaneous pacing have failed. Which medication should the emergency nurse prepare?",
    options: [
      "IV glucagon 3-5 mg bolus followed by infusion",
      "IV epinephrine 1 mg push (cardiac arrest dose)",
      "IV phenylephrine 100 mcg bolus",
      "IV calcium chloride 1 gram for calcium channel support"
    ],
    correctAnswer: 0,
    rationaleLong: "In beta-blocker toxicity or overdose causing symptomatic bradycardia refractory to standard treatments (atropine and pacing), IV glucagon is the specific antidote. Glucagon activates adenylyl cyclase through a non-beta-receptor mechanism, bypassing the blocked beta-receptors to increase heart rate and cardiac contractility. The recommended dose is 3-5 mg IV bolus (50-150 mcg/kg) over 1 minute, followed by a continuous infusion of 2-5 mg/hour if effective. Glucagon's mechanism is unique because it does not require functional beta-receptors to exert its positive chronotropic and inotropic effects. This makes it invaluable when beta-receptors are saturated by beta-blocker drugs. The onset of action is typically 1-3 minutes with a duration of 10-15 minutes, necessitating a continuous infusion. Common side effects include nausea and vomiting, so the nurse should have suction ready. Epinephrine at cardiac arrest doses (1 mg) is inappropriate for a patient with a pulse; if used for bradycardia, low-dose infusion (2-10 mcg/min) would be appropriate but does not address the specific beta-blocker blockade. Phenylephrine is a pure alpha agonist that increases blood pressure through vasoconstriction but does not increase heart rate. Calcium chloride is the antidote for calcium channel blocker toxicity, not beta-blocker toxicity, though it may be used adjunctively. High-dose insulin euglycemic therapy (1 unit/kg bolus then 1 unit/kg/hr) is another emerging treatment for severe beta-blocker toxicity refractory to glucagon.",
    learningObjective: "Identify glucagon as the specific antidote for beta-blocker-induced bradycardia refractory to standard therapy",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Toxicological Cardiac Emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Glucagon bypasses beta-receptors entirely - it's the specific antidote for beta-blocker toxicity",
    clinicalPearls: [
      "Glucagon dose for beta-blocker toxicity: 3-5 mg IV bolus, then 2-5 mg/hr infusion",
      "Glucagon activates adenylyl cyclase independently of beta-receptors",
      "Have suction ready - glucagon commonly causes nausea and vomiting",
      "High-dose insulin (1 unit/kg/hr) is an emerging alternative for refractory cases"
    ],
    safetyNote: "Glucagon can deplete glycogen stores - monitor blood glucose closely and supplement with dextrose as needed",
    distractorRationales: [
      "Glucagon is the specific antidote that bypasses blocked beta-receptors",
      "Cardiac arrest dose epinephrine is inappropriate for a patient with a pulse",
      "Phenylephrine is a pure alpha agonist and won't address bradycardia",
      "Calcium chloride is for calcium channel blocker toxicity, not beta-blocker"
    ],
    lessonLink: "/emergency/lessons/toxicological-cardiac-emergencies"
  },
  {
    stem: "A 30-year-old male presents after cocaine use with severe chest pain, diaphoresis, and anxiety. ECG shows ST elevation in V1-V4. HR 128 bpm, BP 198/112 mmHg. Which medication is contraindicated?",
    options: [
      "IV nitroglycerin infusion",
      "IV metoprolol 5 mg",
      "Oral aspirin 325 mg",
      "IV lorazepam 2 mg"
    ],
    correctAnswer: 1,
    rationaleLong: "Beta-blockers (including metoprolol) are contraindicated in cocaine-induced acute coronary syndrome. Cocaine acts as a sympathomimetic by blocking the reuptake of norepinephrine and dopamine, causing intense alpha-adrenergic and beta-adrenergic stimulation leading to coronary vasospasm, tachycardia, and hypertension. When a beta-blocker is administered in the setting of cocaine use, it blocks the beta-adrenergic receptors (which normally provide vasodilation) while leaving the alpha-adrenergic receptors (which cause vasoconstriction) unopposed. This results in 'unopposed alpha stimulation,' which can paradoxically worsen coronary vasospasm, increase blood pressure, and precipitate acute coronary occlusion and death. The correct management of cocaine-induced ACS includes: (1) IV benzodiazepines (lorazepam or diazepam) as first-line to reduce sympathetic drive, anxiety, and blood pressure, (2) nitroglycerin for coronary vasodilation and afterload reduction, (3) aspirin for antiplatelet effect, and (4) phentolamine (an alpha-blocker) if hypertension is refractory to benzodiazepines and nitroglycerin. Calcium channel blockers (verapamil or diltiazem) can be used for persistent vasospasm. If the patient truly has STEMI that does not resolve with these measures, emergent cardiac catheterization is indicated. The emergency nurse must obtain a thorough substance use history in all young patients presenting with ACS to avoid administering contraindicated medications.",
    learningObjective: "Recognize that beta-blockers are contraindicated in cocaine-induced ACS due to unopposed alpha stimulation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Toxicological Cardiac Emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Never give beta-blockers for cocaine-induced chest pain - unopposed alpha stimulation worsens vasospasm",
    clinicalPearls: [
      "Cocaine + beta-blocker = unopposed alpha stimulation → worsened vasospasm and hypertension",
      "First-line for cocaine chest pain: benzodiazepines + nitroglycerin",
      "Phentolamine (alpha-blocker) for refractory hypertension in cocaine use",
      "Always ask about substance use in young patients with ACS"
    ],
    safetyNote: "Beta-blockers in cocaine-induced ACS can cause fatal coronary vasospasm - this is an absolute contraindication",
    distractorRationales: [
      "Nitroglycerin is beneficial for cocaine-induced coronary vasospasm",
      "Metoprolol is contraindicated due to risk of unopposed alpha stimulation",
      "Aspirin is indicated for antiplatelet effects in ACS regardless of etiology",
      "Benzodiazepines are first-line to reduce sympathetic drive in cocaine toxicity"
    ],
    lessonLink: "/emergency/lessons/toxicological-cardiac-emergencies"
  },
  {
    stem: "A 82-year-old female presents with exertional dyspnea and fatigue. Her ECG shows low voltage QRS complexes with electrical alternans. Echocardiography reveals a large pericardial effusion with right atrial collapse. BP is 94/60 mmHg with pulsus paradoxus of 18 mmHg. Which procedure should the emergency nurse prepare for?",
    options: [
      "Emergent thoracotomy for surgical drainage",
      "Ultrasound-guided pericardiocentesis with catheter drainage",
      "Chest tube insertion for pleural drainage",
      "Central venous catheter placement for aggressive fluid resuscitation"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with cardiac tamponade, as evidenced by the large pericardial effusion with right atrial collapse on echocardiography, hypotension, electrical alternans on ECG, and pulsus paradoxus > 10 mmHg. The definitive treatment for cardiac tamponade is pericardiocentesis - drainage of the pericardial fluid to relieve the pressure on the cardiac chambers and restore normal diastolic filling. Ultrasound-guided pericardiocentesis is the preferred approach in the ED because it allows real-time visualization of the needle trajectory, reducing the risk of cardiac perforation and other complications. The standard approach is subxiphoid, with an 18-gauge spinal needle or catheter-over-needle advanced toward the left shoulder while using echocardiographic guidance. A pigtail catheter is often left in place for continuous drainage. Even removal of as little as 50-100 mL of fluid can result in significant hemodynamic improvement due to the steep pressure-volume relationship of the pericardium. While aggressive IV fluid resuscitation (500-1000 mL boluses) can be used as a temporizing measure to increase preload and maintain cardiac output before definitive drainage, it is not the definitive treatment. A central line is not necessary solely for fluid resuscitation. Emergent thoracotomy is reserved for traumatic tamponade or when pericardiocentesis fails. Chest tube insertion drains pleural fluid, not pericardial fluid. The emergency nurse should prepare the pericardiocentesis tray, ensure bedside ultrasound is available, place the patient on continuous monitoring, and have atropine and vasopressors readily available.",
    learningObjective: "Prepare for ultrasound-guided pericardiocentesis as definitive treatment for cardiac tamponade",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Pericardial Emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Even 50-100 mL of pericardial fluid removal can dramatically improve hemodynamics in tamponade",
    clinicalPearls: [
      "Electrical alternans on ECG = large pericardial effusion causing the heart to swing",
      "Pulsus paradoxus > 10 mmHg is a sensitive clinical sign of tamponade",
      "Subxiphoid approach toward left shoulder is standard for pericardiocentesis",
      "IV fluid boluses are a temporizing measure while preparing for drainage"
    ],
    safetyNote: "Always use ultrasound guidance for pericardiocentesis to minimize risk of cardiac perforation",
    distractorRationales: [
      "Thoracotomy is reserved for traumatic tamponade or failed pericardiocentesis",
      "Ultrasound-guided pericardiocentesis is the definitive ED treatment for tamponade",
      "Chest tubes drain pleural space, not pericardial space",
      "Fluid resuscitation is temporizing but does not address the underlying pericardial compression"
    ],
    lessonLink: "/emergency/lessons/pericardial-emergencies"
  },
  {
    stem: "A 56-year-old male with recent hip replacement surgery presents with sudden dyspnea, pleuritic chest pain, and hemoptysis. HR 118 bpm, BP 88/54 mmHg, SpO2 87% on room air. ECG shows S1Q3T3 pattern and right axis deviation. What should the emergency nurse anticipate?",
    options: [
      "Emergent CT pulmonary angiography to confirm diagnosis",
      "Systemic thrombolysis with alteplase 100 mg IV for massive pulmonary embolism",
      "Immediate intubation for respiratory failure",
      "Bilateral lower extremity compression ultrasound for DVT evaluation"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with a massive (high-risk) pulmonary embolism based on the combination of hemodynamic instability (hypotension, tachycardia), respiratory compromise (hypoxemia, dyspnea), classic ECG findings (S1Q3T3 pattern, right axis deviation indicating right heart strain), risk factor (recent hip replacement surgery), and symptom triad of PE (dyspnea, pleuritic chest pain, hemoptysis). Massive PE is defined as PE with sustained systemic hypotension (SBP < 90 mmHg for > 15 minutes) or requiring vasopressors. In massive PE with hemodynamic instability, systemic thrombolysis is the first-line treatment and should not be delayed for confirmatory imaging. Alteplase (tPA) 100 mg IV infused over 2 hours is the standard regimen for massive PE. The mortality benefit of thrombolysis in massive PE is well-established, with studies showing reduction in mortality from approximately 25-65% (without thrombolysis) to 5-15% (with thrombolysis). While CT pulmonary angiography is the gold standard diagnostic test for PE, this hemodynamically unstable patient should not be sent to the CT scanner as delays can be fatal. Bedside echocardiography showing right ventricular dilation and dysfunction can provide sufficient diagnostic support for empiric thrombolysis. Intubation should be avoided if possible in massive PE because positive pressure ventilation reduces venous return and can cause cardiovascular collapse. Lower extremity ultrasound may show DVT but will not change the immediate management plan.",
    learningObjective: "Recognize massive pulmonary embolism and prioritize systemic thrombolysis over diagnostic imaging when hemodynamically unstable",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Pulmonary Embolism",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "In massive PE with hypotension, don't delay thrombolysis for CT confirmation - bedside echo is sufficient",
    clinicalPearls: [
      "S1Q3T3 on ECG: deep S in lead I, Q wave and inverted T in lead III = right heart strain",
      "Massive PE = PE with sustained hypotension (SBP < 90 for > 15 min)",
      "Alteplase for PE: 100 mg IV over 2 hours",
      "Avoid intubation in massive PE if possible - positive pressure ventilation can cause cardiovascular collapse"
    ],
    safetyNote: "Intubation in massive PE can cause cardiovascular collapse due to decreased venous return from positive pressure ventilation",
    distractorRationales: [
      "CT is gold standard but should not delay treatment in hemodynamically unstable massive PE",
      "Systemic thrombolysis is first-line for massive PE with hemodynamic instability",
      "Intubation should be avoided if possible as it can worsen hemodynamics in massive PE",
      "Lower extremity ultrasound will not change immediate management"
    ],
    lessonLink: "/emergency/lessons/pulmonary-embolism"
  },
  {
    stem: "A 71-year-old female is receiving tPA for acute ischemic stroke when she develops acute hypotension (BP 76/42 mmHg), tachycardia (HR 132 bpm), and the nurse notices a rapidly expanding ecchymosis in the right flank. Which complication should be suspected and what is the priority intervention?",
    options: [
      "Hemorrhagic stroke transformation - stop tPA and obtain emergent CT head",
      "Retroperitoneal hemorrhage - stop tPA, transfuse blood products, and prepare cryoprecipitate",
      "Anaphylaxis to tPA - administer IM epinephrine and IV diphenhydramine",
      "Cardiogenic shock from concurrent MI - start vasopressor infusion"
    ],
    correctAnswer: 1,
    rationaleLong: "The clinical presentation of acute hypotension, tachycardia, and rapidly expanding flank ecchymosis during tPA administration is classic for retroperitoneal hemorrhage (RPH). RPH is a life-threatening bleeding complication of thrombolytic therapy that can result in massive blood loss into the retroperitoneal space. The retroperitoneum can accommodate several liters of blood before external signs become apparent, making early recognition crucial. Key signs include: flank ecchymosis (Grey Turner sign), hemodynamic instability disproportionate to visible blood loss, back or flank pain, and dropping hemoglobin. The immediate management priorities are: (1) Stop the tPA infusion immediately to halt further fibrinolysis, (2) Obtain STAT labs including CBC, fibrinogen, PT/INR, and type & crossmatch, (3) Begin aggressive transfusion with packed red blood cells and fresh frozen plasma, (4) Administer cryoprecipitate (10 units) to replace fibrinogen that has been depleted by the tPA (target fibrinogen > 200 mg/dL), (5) Consider aminocaproic acid (Amicar) 4-5 grams IV as an antifibrinolytic to reverse tPA effects, and (6) Obtain CT abdomen/pelvis for definitive diagnosis. Interventional radiology may be needed for embolization if bleeding continues. While hemorrhagic stroke transformation is a feared complication of tPA, the flank ecchymosis points to retroperitoneal rather than intracranial hemorrhage. Anaphylaxis would present with urticaria, angioedema, and bronchospasm rather than flank ecchymosis.",
    learningObjective: "Recognize retroperitoneal hemorrhage as a life-threatening complication of thrombolytic therapy",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Thrombolytic Complications",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Flank ecchymosis during tPA = retroperitoneal hemorrhage until proven otherwise - stop tPA immediately",
    clinicalPearls: [
      "Grey Turner sign (flank ecchymosis) = retroperitoneal hemorrhage",
      "Retroperitoneum can hold several liters of blood before signs appear",
      "Cryoprecipitate replaces fibrinogen depleted by tPA (target > 200 mg/dL)",
      "Aminocaproic acid (Amicar) can reverse tPA-induced fibrinolysis"
    ],
    safetyNote: "All patients receiving tPA must be monitored for bleeding at all sites - retroperitoneal hemorrhage can be occult and fatal",
    distractorRationales: [
      "Hemorrhagic stroke transformation does not cause flank ecchymosis",
      "Retroperitoneal hemorrhage is the correct diagnosis given the flank ecchymosis and hemodynamic instability",
      "Anaphylaxis would present with urticaria and bronchospasm, not flank ecchymosis",
      "Cardiogenic shock would not explain the rapidly expanding flank ecchymosis"
    ],
    lessonLink: "/emergency/lessons/thrombolytic-management"
  },
  {
    stem: "A 49-year-old male with Brugada syndrome presents after a witnessed syncopal episode. His ECG shows the classic coved-type ST elevation in V1-V3. He has an ICD, which has not fired. What is the most appropriate management?",
    options: [
      "Discharge home with cardiology follow-up since the ICD is functioning",
      "Admit for continuous monitoring, ICD interrogation, and consideration of isoproterenol if arrhythmias occur",
      "Administer IV amiodarone for arrhythmia prophylaxis",
      "Start oral flecainide for long-term arrhythmia suppression"
    ],
    correctAnswer: 1,
    rationaleLong: "Brugada syndrome is a genetic channelopathy that predisposes to malignant ventricular arrhythmias (polymorphic VT and VF) and sudden cardiac death. A syncopal episode in a patient with known Brugada syndrome is a high-risk event that may represent an aborted sudden cardiac death, even if the ICD did not fire. The ICD may not have fired for several reasons: the arrhythmia may have self-terminated before reaching the ICD detection criteria, the ICD programming may need adjustment, or there could be a device malfunction. The appropriate management includes: (1) Hospital admission for continuous cardiac monitoring, (2) ICD interrogation by electrophysiology to review stored events and ensure proper device function, (3) Correction of any provocative factors (fever must be treated aggressively as it can unmask Brugada pattern and trigger arrhythmias), and (4) If ventricular arrhythmias occur, isoproterenol infusion is the drug of choice because it increases the L-type calcium current, which counteracts the underlying sodium channel dysfunction in Brugada syndrome. Amiodarone is contraindicated in Brugada syndrome because its sodium channel blocking properties can worsen the underlying channelopathy and actually increase arrhythmia risk. Similarly, flecainide and other Class IC antiarrhythmics are contraindicated as they are actually used to provoke the Brugada pattern during diagnostic testing. Quinidine is the only oral antiarrhythmic that has shown benefit in Brugada syndrome. Discharging a Brugada patient after syncope without thorough evaluation is dangerous.",
    learningObjective: "Manage syncopal episodes in Brugada syndrome with admission, monitoring, and appropriate antiarrhythmic selection",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Channelopathies",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Amiodarone and flecainide are CONTRAINDICATED in Brugada syndrome - they worsen the sodium channel dysfunction",
    clinicalPearls: [
      "Isoproterenol is the drug of choice for Brugada-related arrhythmias",
      "Fever can unmask or worsen Brugada pattern - treat aggressively with antipyretics",
      "Amiodarone, flecainide, and procainamide are contraindicated in Brugada syndrome",
      "Quinidine is the only oral antiarrhythmic with benefit in Brugada syndrome"
    ],
    safetyNote: "Fever in Brugada syndrome patients is a medical emergency - aggressive antipyretic therapy and cooling are essential",
    distractorRationales: [
      "Discharging without evaluation is dangerous - syncope in Brugada may represent aborted sudden death",
      "Admission with monitoring and ICD interrogation is the correct approach",
      "Amiodarone is contraindicated in Brugada syndrome due to sodium channel blocking effects",
      "Flecainide is contraindicated and is actually used to provoke the Brugada pattern diagnostically"
    ],
    lessonLink: "/emergency/lessons/channelopathies"
  },
  {
    stem: "A 63-year-old female presents with acute onset of severe back pain between the shoulder blades. She has a history of poorly controlled hypertension. CT angiography reveals a Stanford Type B aortic dissection without organ malperfusion. What is the primary management approach?",
    options: [
      "Emergent surgical repair of the descending aorta",
      "Medical management with IV anti-impulse therapy targeting HR < 60 and SBP 100-120 mmHg",
      "Endovascular stent graft placement within 24 hours",
      "Serial CT angiography every 6 hours to monitor for progression"
    ],
    correctAnswer: 1,
    rationaleLong: "Uncomplicated Stanford Type B aortic dissection (involving the descending aorta distal to the left subclavian artery) without evidence of organ malperfusion, rupture, or rapid expansion is managed medically with anti-impulse therapy. This is a key distinction from Type A dissection, which always requires emergent surgical repair. Medical management of Type B dissection focuses on reducing aortic wall stress through aggressive blood pressure and heart rate control. The target is HR < 60 bpm and SBP 100-120 mmHg using IV beta-blockers (esmolol or labetalol) as first-line agents, followed by vasodilators (nicardipine, nitroprusside) if additional BP reduction is needed after adequate beta-blockade. As with Type A dissection, beta-blockers must be given before vasodilators to prevent reflex tachycardia. The patient should be admitted to an ICU for close hemodynamic monitoring, pain control (IV opioids as needed - pain can drive sympathetic activation and worsen hypertension), and serial imaging. Emergent surgery for Type B dissection is reserved for complicated cases: organ malperfusion (renal, mesenteric, limb ischemia), contained or free rupture, rapid aortic expansion, or refractory pain/hypertension despite maximal medical therapy. Endovascular stent grafting (TEVAR) may be considered for complicated Type B dissections as an alternative to open surgery but is not indicated urgently for uncomplicated cases. Serial CTA every 6 hours is excessive surveillance and is not standard protocol.",
    learningObjective: "Differentiate management of uncomplicated Type B aortic dissection (medical) from Type A (surgical)",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Aortic Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Type A = always surgical; uncomplicated Type B = medical management with anti-impulse therapy",
    clinicalPearls: [
      "Type A (ascending) = emergent surgery; uncomplicated Type B (descending) = medical management",
      "Complicated Type B (malperfusion, rupture, refractory symptoms) requires intervention",
      "Pain control is essential - pain drives sympathetic activation and worsens hypertension",
      "Long-term follow-up with serial imaging is essential even after successful medical management"
    ],
    safetyNote: "Monitor for signs of malperfusion in Type B dissection: new renal failure, mesenteric ischemia, limb ischemia",
    distractorRationales: [
      "Surgery is reserved for complicated Type B dissection or Type A dissection",
      "Medical anti-impulse therapy is first-line for uncomplicated Type B dissection",
      "Endovascular repair is considered for complicated cases, not uncomplicated Type B",
      "Serial CTA every 6 hours is excessive; standard surveillance intervals are longer"
    ],
    lessonLink: "/emergency/lessons/aortic-emergencies"
  },
  {
    stem: "A 75-year-old male with heart failure (EF 30%) and a biventricular pacemaker/ICD presents with worsening dyspnea. Chest X-ray shows bilateral pleural effusions and pulmonary edema. His device was interrogated 2 weeks ago and showed 92% biventricular pacing. Current ECG shows native rhythm with no pacing spikes. What should the emergency nurse suspect?",
    options: [
      "Acute decompensated heart failure requiring diuresis",
      "Device malfunction with loss of cardiac resynchronization therapy",
      "Lead displacement from vigorous coughing",
      "Battery depletion requiring urgent generator change"
    ],
    correctAnswer: 1,
    rationaleLong: "The absence of pacing spikes on ECG in a patient who was recently confirmed to have 92% biventricular pacing indicates device malfunction with loss of cardiac resynchronization therapy (CRT). CRT is a critical therapy in patients with severe systolic heart failure and wide QRS complex - it coordinates the contraction of both ventricles to improve cardiac output and reduce heart failure symptoms. When CRT is lost, the patient returns to dyssynchronous ventricular contraction, which can cause rapid hemodynamic deterioration and acute decompensated heart failure. The sudden loss of pacing can be caused by several mechanisms: lead fracture, lead dislodgement, connection problems at the header, oversensing causing inappropriate inhibition, or device malfunction. While the presentation may look like simple acute decompensated heart failure, the underlying cause (loss of CRT) must be identified and corrected for the patient to recover. The emergency nurse should: (1) Obtain a 12-lead ECG and compare to baseline paced ECG, (2) Request urgent device interrogation by electrophysiology or device representative, (3) Obtain chest X-ray to evaluate lead position, (4) Start appropriate heart failure treatment (IV diuretics, vasodilators) while the device issue is being addressed. Battery depletion and lead displacement are possible causes of the device malfunction but the overarching clinical issue is loss of CRT. Simple diuresis without addressing the device malfunction will not resolve the underlying problem.",
    learningObjective: "Recognize loss of cardiac resynchronization therapy as a cause of acute heart failure decompensation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Device Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "In CRT-dependent patients, loss of pacing can cause acute heart failure that won't respond to diuresis alone",
    clinicalPearls: [
      "Loss of CRT pacing can cause rapid hemodynamic deterioration in HFrEF patients",
      "Compare current ECG to baseline paced ECG to identify loss of pacing",
      "Urgent device interrogation is essential to determine cause of malfunction",
      "Treat the heart failure AND the device malfunction simultaneously"
    ],
    safetyNote: "Patients who are pacemaker-dependent may develop life-threatening bradycardia if pacing is lost - have transcutaneous pacing ready",
    distractorRationales: [
      "Diuresis alone won't resolve decompensation caused by loss of CRT",
      "Device malfunction with loss of CRT is the underlying cause requiring correction",
      "Lead displacement is a possible cause but the key clinical issue is loss of CRT",
      "Battery depletion is possible but the presenting issue is loss of pacing function"
    ],
    lessonLink: "/emergency/lessons/cardiac-device-emergencies"
  },
  {
    stem: "A 40-year-old male IV drug user presents with fever (39.8°C), new-onset heart murmur, and petechiae on his conjunctivae and fingertips. Blood cultures are drawn. Which valve is most likely affected?",
    options: [
      "Mitral valve",
      "Aortic valve",
      "Tricuspid valve",
      "Pulmonary valve"
    ],
    correctAnswer: 2,
    rationaleLong: "In IV drug users (IVDU), the tricuspid valve is the most commonly affected valve in infective endocarditis, accounting for approximately 50-70% of cases. This is because unsterile IV injection introduces bacteria (most commonly Staphylococcus aureus) directly into the venous system, which returns to the right side of the heart. The bacteria-laden blood first encounters the tricuspid valve, where turbulent flow across the valve can damage the endothelium and allow bacterial adherence and vegetation formation. Right-sided endocarditis (tricuspid valve) has a different clinical presentation than left-sided endocarditis. Tricuspid valve vegetations can embolize to the lungs, causing septic pulmonary emboli (presenting as multiple peripheral lung infiltrates, chest pain, hemoptysis, and cavitary lesions on chest imaging). Left-sided endocarditis (mitral and aortic valves) causes systemic emboli to the brain, kidneys, spleen, and periphery. The physical findings described in this patient - petechiae on conjunctivae (Roth spots) and fingertips - actually suggest systemic embolization, which would indicate left-sided valve involvement or paradoxical embolization. However, in an IVDU, the tricuspid valve should be the primary suspect and the systemic findings may represent immunological phenomena rather than emboli. The emergency nurse should obtain at least 3 sets of blood cultures from separate sites before antibiotics, obtain a chest X-ray to evaluate for septic pulmonary emboli, and prepare for urgent echocardiography (TEE preferred over TTE for better valve visualization). Empiric antibiotic therapy for IVDU endocarditis should cover MRSA (vancomycin) and gram-negative organisms (gentamicin).",
    learningObjective: "Identify the tricuspid valve as most commonly affected in IV drug use-associated endocarditis",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Infective Endocarditis",
    difficulty: 3,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "IVDU endocarditis = tricuspid valve (right-sided); non-IVDU endocarditis = mitral/aortic (left-sided)",
    clinicalPearls: [
      "Tricuspid valve endocarditis in IVDU: most common organism is Staph aureus",
      "Right-sided endocarditis causes septic pulmonary emboli (cavitary lung lesions)",
      "Duke criteria: 2 major, 1 major + 3 minor, or 5 minor criteria = definite endocarditis",
      "Obtain 3 sets of blood cultures from separate sites before starting antibiotics"
    ],
    safetyNote: "Start empiric antibiotics within 1 hour of suspected endocarditis after blood cultures are drawn - do not delay",
    distractorRationales: [
      "Mitral valve is most common in non-IVDU endocarditis",
      "Aortic valve is second most common in non-IVDU endocarditis",
      "Tricuspid valve is most commonly affected in IVDU due to direct venous seeding",
      "Pulmonary valve endocarditis is rare even in IVDU"
    ],
    lessonLink: "/emergency/lessons/infective-endocarditis"
  },
  {
    stem: "A 66-year-old female presents with acute onset tearing chest pain. Initial chest X-ray shows a widened mediastinum. While preparing for CT angiography, her blood pressure suddenly drops from 170/95 to 60/40 mmHg, and she becomes obtunded. Beck's triad is present. What has likely occurred?",
    options: [
      "Aortic rupture into the left pleural space causing massive hemothorax",
      "Aortic dissection extending into the pericardium causing cardiac tamponade",
      "Acute myocardial infarction from coronary artery involvement",
      "Tension pneumothorax from ruptured pulmonary bleb"
    ],
    correctAnswer: 1,
    rationaleLong: "The sudden hemodynamic collapse with Beck's triad (hypotension, jugular venous distension, muffled heart sounds) in a patient with suspected aortic dissection indicates extension of the dissection into the pericardial space, causing acute hemopericardium and cardiac tamponade. This is one of the most feared complications of Type A aortic dissection, occurring when the dissection flap extends proximally to involve the aortic root, and blood from the false lumen ruptures through the adventitia into the pericardial space. This creates acute cardiac tamponade with rapid hemodynamic collapse because the pericardium cannot acutely stretch to accommodate the accumulating blood. Unlike chronic pericardial effusions where the pericardium can gradually stretch to hold large volumes, acute hemopericardium can cause tamponade with as little as 100-200 mL of blood. The mortality is extremely high without emergent surgical intervention. The emergency nurse must immediately prepare for: (1) emergent pericardiocentesis as a temporizing bridge to surgery (removing even 20-50 mL can temporarily restore hemodynamics), (2) massive transfusion protocol activation, (3) emergent surgical consultation for operative repair, and (4) intubation if not already performed. While aortic rupture into the pleural space can cause massive hemothorax and hypotension, it would not produce Beck's triad (specifically JVD and muffled heart sounds). MI from coronary involvement is possible but would not explain Beck's triad. Tension pneumothorax would show absent breath sounds and tracheal deviation.",
    learningObjective: "Recognize aortic dissection extending into the pericardium as a cause of acute tamponade with Beck's triad",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Aortic Emergencies",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Beck's triad in a patient with aortic dissection = pericardial extension with tamponade, not simple rupture",
    clinicalPearls: [
      "Beck's triad: hypotension, JVD, muffled heart sounds = cardiac tamponade",
      "Acute hemopericardium can cause tamponade with as little as 100-200 mL",
      "Even 20-50 mL pericardiocentesis can temporarily restore hemodynamics in acute tamponade",
      "Type A dissection extending to pericardium carries extremely high mortality without surgery"
    ],
    safetyNote: "Pericardiocentesis in aortic dissection tamponade is a bridge to surgery only - do not drain fully as BP rise can worsen aortic bleeding",
    distractorRationales: [
      "Pleural rupture causes hemothorax but not Beck's triad (no JVD or muffled heart sounds)",
      "Pericardial extension with tamponade explains Beck's triad in the setting of dissection",
      "MI from coronary involvement would not produce JVD and muffled heart sounds acutely",
      "Tension pneumothorax would show absent breath sounds and tracheal deviation, not Beck's triad"
    ],
    lessonLink: "/emergency/lessons/aortic-emergencies"
  },
  {
    stem: "A 57-year-old male presents after a witnessed ventricular fibrillation arrest. ROSC was achieved with 2 shocks and 4 minutes of CPR. He is now responsive to voice commands, BP 118/72 mmHg, HR 84 bpm. His ECG shows no ST elevation. Which targeted temperature management approach is recommended?",
    options: [
      "Cool to 32°C for 24 hours to maximize neuroprotection",
      "Maintain normothermia at 37.5°C and actively prevent fever for 72 hours",
      "Cool to 33-36°C for 24 hours, then controlled rewarming at 0.25°C/hour",
      "No temperature management needed since the patient is responsive"
    ],
    correctAnswer: 2,
    rationaleLong: "Current guidelines recommend targeted temperature management (TTM) for all comatose survivors of cardiac arrest, maintaining a target temperature between 33-36°C for at least 24 hours. However, the 2023 AHA guidelines have evolved to include the option of targeting normothermia (37.5°C) with active fever prevention based on the TTM2 trial, which showed no difference in outcomes between 33°C and normothermia with active fever prevention. For this patient who has achieved ROSC after VF arrest and is responsive to voice commands, the decision requires careful consideration. While the patient appears neurologically intact, delayed neurological deterioration can occur, and TTM is still recommended as a protective measure. The target temperature should be selected between 33-36°C based on institutional protocol, with cooling initiated as soon as possible and maintained for at least 24 hours. After the cooling period, controlled rewarming should proceed slowly at a rate of 0.25-0.5°C per hour to prevent rebound hyperthermia and secondary brain injury. Rapid rewarming can cause cerebral edema and hemodynamic instability. Cooling to 32°C exceeds the recommended range and increases the risk of complications (coagulopathy, arrhythmias, infections) without proven additional benefit. The idea that no temperature management is needed because the patient is responsive is incorrect - neurological deterioration can occur hours to days after arrest. The emergency nurse should initiate cooling with ice packs, cold IV saline, and/or commercial cooling devices while monitoring core temperature continuously.",
    learningObjective: "Apply current targeted temperature management guidelines for post-cardiac arrest patients",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Post-Cardiac Arrest Care",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "TTM target is 33-36°C, not lower - temperatures below 33°C increase complications without benefit",
    clinicalPearls: [
      "TTM target: 33-36°C for at least 24 hours (or normothermia with active fever prevention)",
      "Controlled rewarming: 0.25-0.5°C per hour to prevent rebound hyperthermia",
      "Monitor for shivering during cooling - treat with sedation and paralytics if needed",
      "Core temperature monitoring is essential - esophageal or bladder probe preferred"
    ],
    safetyNote: "Rebound hyperthermia after TTM is associated with worse neurological outcomes - actively prevent fever for at least 72 hours after rewarming",
    distractorRationales: [
      "32°C is below the recommended target range and increases complication risk",
      "Normothermia with fever prevention is an option but not the only recommended approach",
      "33-36°C for 24 hours with controlled rewarming follows current guidelines",
      "Responsive patients can still deteriorate - TTM should still be considered"
    ],
    lessonLink: "/emergency/lessons/post-rosc-care"
  },
  {
    stem: "A 45-year-old female presents with acute chest pain radiating to the jaw. She has no cardiac risk factors. ECG shows ST elevation in leads II, III, aVF. Coronary angiography reveals no atherosclerotic disease but shows spontaneous dissection of the right coronary artery. Which condition is the most likely underlying diagnosis?",
    options: [
      "Fibromuscular dysplasia",
      "Ehlers-Danlos syndrome",
      "Spontaneous coronary artery dissection (SCAD) associated with peripartum period or hormonal factors",
      "Polyarteritis nodosa affecting the coronary vessels"
    ],
    correctAnswer: 2,
    rationaleLong: "Spontaneous coronary artery dissection (SCAD) is an increasingly recognized cause of acute coronary syndrome, particularly in younger women without traditional cardiovascular risk factors. SCAD occurs when a tear develops in the coronary artery wall, creating a false lumen that compresses the true lumen and obstructs blood flow, causing myocardial ischemia or infarction. SCAD accounts for approximately 1-4% of all ACS cases but up to 35% of ACS in women under 50 years of age. The most common associations include: (1) peripartum period (within weeks to months of pregnancy/delivery), (2) hormonal factors (oral contraceptives, hormone replacement therapy), (3) fibromuscular dysplasia (FMD) - found in 50-75% of SCAD patients on screening, (4) extreme emotional or physical stress, and (5) connective tissue disorders. While FMD is frequently associated with SCAD, SCAD itself is the primary diagnosis in this clinical scenario - FMD is a predisposing condition. The key distinction is that the question asks about the most likely underlying diagnosis, and for a young woman without cardiac risk factors presenting with coronary dissection, SCAD associated with hormonal factors or peripartum period is the most likely primary diagnosis. Management of SCAD differs from atherosclerotic ACS: conservative medical management is generally preferred as the majority of SCAD lesions heal spontaneously. PCI carries higher complication rates in SCAD due to the fragile vessel wall. Beta-blockers are commonly used long-term. The emergency nurse should be aware that SCAD patients are at risk for recurrence and extension.",
    learningObjective: "Recognize SCAD as a cause of ACS in young women without traditional cardiovascular risk factors",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Coronary Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ACS in a young woman without risk factors should raise suspicion for SCAD rather than atherosclerotic disease",
    clinicalPearls: [
      "SCAD accounts for up to 35% of ACS in women under 50",
      "50-75% of SCAD patients have underlying fibromuscular dysplasia",
      "Conservative management preferred for SCAD - PCI has higher complication rates",
      "SCAD can recur - long-term follow-up and screening for FMD are essential"
    ],
    safetyNote: "PCI in SCAD carries higher risk of complications due to fragile vessel wall - conservative management is generally preferred",
    distractorRationales: [
      "FMD is commonly associated with SCAD but is a predisposing condition, not the primary diagnosis",
      "Ehlers-Danlos can cause vascular dissection but is less common than SCAD in this demographic",
      "SCAD is the primary diagnosis in a young woman with coronary dissection and no atherosclerosis",
      "Polyarteritis nodosa can affect coronary vessels but is much rarer than SCAD"
    ],
    lessonLink: "/emergency/lessons/coronary-emergencies"
  },
  {
    stem: "A 70-year-old male with a permanent pacemaker presents with hiccups, chest wall twitching, and pectoral muscle stimulation on the side of his pacemaker. He also reports worsening dyspnea over the past week. What is the most likely diagnosis?",
    options: [
      "Pacemaker syndrome from loss of AV synchrony",
      "Lead perforation through the myocardium with extracardiac stimulation",
      "Twiddler syndrome from device rotation in the pocket",
      "Electromagnetic interference from household appliances"
    ],
    correctAnswer: 1,
    rationaleLong: "The combination of hiccups, chest wall twitching, and pectoral muscle stimulation in a pacemaker patient suggests lead perforation through the myocardium. When a pacing lead perforates through the ventricular wall, the electrical impulse can stimulate extracardiac structures including the diaphragm (causing hiccups), intercostal muscles (causing chest wall twitching), and the pectoralis muscle (causing pectoral stimulation). Lead perforation can be acute (within hours to days of implantation) or delayed (weeks to months later). The lead tip may perforate completely through the myocardium into the pericardial space or adjacent structures, or it may be a micro-perforation where the lead partially penetrates the wall. Clinical manifestations depend on the degree of perforation and the structures stimulated. Worsening dyspnea may indicate pericardial effusion from the perforation, which could progress to tamponade. Diagnostic evaluation includes: (1) chest X-ray (may show lead tip beyond the cardiac silhouette), (2) CT chest (definitive for identifying lead position), (3) echocardiography (to evaluate for pericardial effusion), and (4) device interrogation (may show elevated pacing thresholds, loss of capture, or impedance changes). Pacemaker syndrome causes fatigue, dyspnea, and hypotension from loss of AV synchrony but does not cause extracardiac stimulation. Twiddler syndrome involves the patient rotating the device in the pocket, causing lead dislodgement, but presents differently. EMI would cause temporary oversensing, not continuous muscle stimulation.",
    learningObjective: "Recognize extracardiac stimulation (hiccups, muscle twitching) as signs of pacemaker lead perforation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Device Emergencies",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Hiccups in a pacemaker patient = think diaphragmatic stimulation from lead perforation",
    clinicalPearls: [
      "Hiccups + muscle twitching in pacemaker patient = suspect lead perforation",
      "Lead perforation can be acute or delayed (weeks to months post-implant)",
      "CT chest is definitive for confirming lead position relative to myocardium",
      "Always check for pericardial effusion when lead perforation is suspected"
    ],
    safetyNote: "Lead perforation can cause life-threatening pericardial tamponade - obtain urgent echocardiography",
    distractorRationales: [
      "Pacemaker syndrome causes hemodynamic symptoms but not extracardiac muscle stimulation",
      "Lead perforation best explains the diaphragmatic and chest wall stimulation",
      "Twiddler syndrome causes lead displacement but typically doesn't cause extracardiac stimulation pattern",
      "EMI causes temporary device behavior changes, not continuous extracardiac stimulation"
    ],
    lessonLink: "/emergency/lessons/cardiac-device-emergencies"
  },
  {
    stem: "A 38-year-old female presents with sudden onset of severe headache, chest pain, and BP 228/134 mmHg. She is 28 weeks pregnant. Urine protein is 4+. The emergency nurse should recognize this as which condition?",
    options: [
      "Chronic gestational hypertension with superimposed preeclampsia",
      "Severe preeclampsia with risk of eclampsia requiring emergent management",
      "HELLP syndrome with hepatic involvement",
      "Essential hypertension exacerbated by pregnancy"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with severe preeclampsia, characterized by severe hypertension (SBP ≥ 160 or DBP ≥ 110), significant proteinuria (4+ urine protein), and symptoms suggesting end-organ involvement (severe headache indicating cerebral edema/impending eclampsia, chest pain suggesting cardiac or hepatic involvement). Severe preeclampsia is a life-threatening obstetric emergency that requires emergent management to prevent progression to eclampsia (seizures), HELLP syndrome, placental abruption, stroke, or maternal death. The emergency nurse should: (1) Initiate IV magnesium sulfate for seizure prophylaxis (4-6 g loading dose over 15-20 minutes, then 1-2 g/hour maintenance), (2) Administer IV antihypertensives to lower BP to < 160/110 within 30-60 minutes - IV labetalol (20 mg initial bolus) or IV hydralazine (5-10 mg) are first-line agents for acute BP control in preeclampsia, (3) Obtain STAT labs including CBC with platelets, LFTs, creatinine, LDH, and uric acid to evaluate for HELLP syndrome, (4) Arrange continuous fetal monitoring, and (5) Consult obstetrics emergently for delivery planning. At 28 weeks, the decision to deliver involves balancing maternal safety against fetal prematurity. However, the definitive treatment for preeclampsia is delivery of the baby and placenta. While the patient may also have HELLP syndrome, the clinical information given (no mention of hemolysis, elevated liver enzymes, or low platelets) does not confirm this diagnosis. Chronic gestational hypertension would have been diagnosed earlier in pregnancy. The emergency nurse must monitor for signs of impending eclampsia: worsening headache, visual changes (scotomata, blurred vision), right upper quadrant pain, and hyperreflexia.",
    learningObjective: "Recognize severe preeclampsia and initiate emergent management with magnesium sulfate and antihypertensives",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Hypertensive Emergencies in Pregnancy",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Magnesium sulfate is for seizure PROPHYLAXIS in severe preeclampsia, not for blood pressure reduction",
    clinicalPearls: [
      "Severe preeclampsia criteria: SBP ≥ 160 or DBP ≥ 110 + proteinuria + end-organ symptoms",
      "MgSO4 loading dose: 4-6 g IV over 15-20 min; maintenance: 1-2 g/hr",
      "First-line BP agents in preeclampsia: IV labetalol or IV hydralazine",
      "Definitive treatment is delivery of the baby and placenta"
    ],
    safetyNote: "Monitor for magnesium toxicity: loss of deep tendon reflexes, respiratory depression (keep calcium gluconate at bedside as antidote)",
    distractorRationales: [
      "Chronic gestational HTN would have been diagnosed earlier and doesn't explain the acute presentation",
      "Severe preeclampsia best fits the clinical picture of severe HTN, proteinuria, and end-organ symptoms",
      "HELLP syndrome is possible but not confirmed without labs showing hemolysis, elevated LFTs, low platelets",
      "Essential hypertension would not explain the proteinuria and acute symptoms"
    ],
    lessonLink: "/emergency/lessons/hypertensive-emergencies-pregnancy"
  },
  {
    stem: "A 55-year-old male is found unresponsive. CPR is in progress. The monitor shows fine ventricular fibrillation. After 3 shocks and 6 minutes of CPR, the rhythm persists. What medication adjustment should the emergency nurse anticipate?",
    options: [
      "Increase epinephrine to 3 mg IV push for refractory VF",
      "Administer amiodarone 300 mg IV push as first antiarrhythmic dose",
      "Switch from epinephrine to vasopressin 40 units IV",
      "Administer lidocaine 1.5 mg/kg IV instead of amiodarone"
    ],
    correctAnswer: 1,
    rationaleLong: "According to current ACLS guidelines for refractory ventricular fibrillation (VF that persists after the initial 1-2 shocks), amiodarone 300 mg IV/IO push is the first-line antiarrhythmic medication. The ACLS cardiac arrest algorithm specifies that amiodarone should be given after the third shock if VF/pulseless VT persists despite defibrillation and epinephrine. Amiodarone is a class III antiarrhythmic with properties spanning all four Vaughan-Williams classes, making it particularly effective for refractory ventricular arrhythmias. The initial dose is 300 mg IV push, and a second dose of 150 mg may be given if VF/pVT continues. Amiodarone has demonstrated improved survival to hospital admission compared to placebo and lidocaine in the ARREST and ALIVE trials. The medication should be given as an IV push during CPR, followed by a 20 mL saline flush. Increasing epinephrine beyond the standard 1 mg dose has not shown benefit and may increase complications. The standard epinephrine dose in cardiac arrest is 1 mg IV/IO every 3-5 minutes. Vasopressin was previously included in ACLS algorithms as an alternative to the first or second dose of epinephrine, but the 2020 AHA guidelines removed vasopressin from the cardiac arrest algorithm due to lack of additional benefit over epinephrine. Lidocaine (1-1.5 mg/kg IV) is an alternative to amiodarone if amiodarone is unavailable, but amiodarone is the preferred first-line antiarrhythmic.",
    learningObjective: "Apply correct ACLS medication sequence for refractory ventricular fibrillation including amiodarone timing",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Arrest Management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Vasopressin has been removed from the 2020 ACLS cardiac arrest algorithm - epinephrine is the sole vasopressor",
    clinicalPearls: [
      "Amiodarone 300 mg IV push after 3rd shock for refractory VF/pVT",
      "Second amiodarone dose is 150 mg if first dose ineffective",
      "Epinephrine 1 mg every 3-5 minutes - do NOT increase dose",
      "Vasopressin removed from 2020 ACLS cardiac arrest algorithm"
    ],
    safetyNote: "Never interrupt CPR for medication administration - medications should be given during CPR and followed by flush",
    distractorRationales: [
      "High-dose epinephrine has not shown benefit and may increase harm",
      "Amiodarone 300 mg IV push is the correct first antiarrhythmic after 3rd shock",
      "Vasopressin was removed from the 2020 ACLS cardiac arrest algorithm",
      "Lidocaine is second-line to amiodarone for refractory VF/pVT"
    ],
    lessonLink: "/emergency/lessons/cardiac-arrest-management"
  },
  {
    stem: "A 62-year-old female with a history of paroxysmal atrial fibrillation presents with rapid atrial fibrillation at 156 bpm for the past 2 hours. She is hemodynamically stable. Her cardiologist started her on oral flecainide for 'pill-in-the-pocket' rhythm control. Which assessment must the emergency nurse perform before the patient takes flecainide?",
    options: [
      "Verify the patient has taken her morning dose of beta-blocker or calcium channel blocker",
      "Check serum magnesium and potassium levels",
      "Obtain a baseline QTc measurement on 12-lead ECG",
      "Assess renal function with serum creatinine and BUN"
    ],
    correctAnswer: 0,
    rationaleLong: "Before a patient takes flecainide for the 'pill-in-the-pocket' approach to atrial fibrillation cardioversion, the most critical assessment is ensuring that the patient has taken a rate-controlling medication (beta-blocker or calcium channel blocker) first or concurrently. Flecainide is a Class IC antiarrhythmic that can paradoxically convert atrial fibrillation to atrial flutter with 1:1 AV conduction. In normal atrial fibrillation, the AV node acts as a gatekeeper, conducting only a fraction of the atrial impulses to the ventricles. Flecainide can organize the chaotic atrial fibrillation into atrial flutter, slowing the atrial rate enough that the AV node can conduct every impulse (1:1 conduction). Since the atrial flutter rate is typically 250-300 bpm, 1:1 conduction can result in ventricular rates of 250-300 bpm, causing hemodynamic collapse and potentially ventricular fibrillation. Taking a beta-blocker or calcium channel blocker BEFORE flecainide provides AV nodal blockade that prevents this dangerous 1:1 conduction. The 'pill-in-the-pocket' approach was validated in the FLEC-SL trial, where patients were trained to self-administer flecainide (200-300 mg) or propafenone (450-600 mg) at symptom onset, but only after taking a rate-controlling agent. While checking electrolytes and ECG are reasonable assessments, the most critical safety check is ensuring AV nodal blockade is in place before flecainide administration.",
    learningObjective: "Ensure AV nodal blockade is in place before flecainide administration to prevent 1:1 atrial flutter conduction",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 5,
    cognitiveLevel: "evaluation",
    questionType: "MCQ_SINGLE",
    examTrap: "Flecainide without AV nodal blockade can convert AF to flutter with 1:1 conduction at 250-300 bpm",
    clinicalPearls: [
      "Always ensure AV nodal blockade before Class IC antiarrhythmics (flecainide, propafenone)",
      "Pill-in-the-pocket: patient self-administers antiarrhythmic at symptom onset",
      "Flecainide can convert AF to organized atrial flutter with dangerous 1:1 conduction",
      "Class IC antiarrhythmics are contraindicated in structural heart disease"
    ],
    safetyNote: "Flecainide without rate control can cause 1:1 atrial flutter with rates of 250-300 bpm - always confirm AV blockade first",
    distractorRationales: [
      "Confirming rate-control medication is the most critical safety check before flecainide",
      "Electrolyte levels are important but not the most critical pre-medication check",
      "QTc is relevant for Class III agents (sotalol, dofetilide) but less critical for Class IC",
      "Renal function affects flecainide clearance but is not the immediate safety concern"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "A 50-year-old male with ESRD on hemodialysis misses his scheduled dialysis session and presents with severe dyspnea. SpO2 is 82% on room air. Chest X-ray shows bilateral pulmonary edema. BP is 188/104 mmHg. Potassium is 6.2 mEq/L. Which intervention takes priority?",
    options: [
      "Emergent hemodialysis for fluid and potassium removal",
      "BiPAP ventilation with IV nitroglycerin for acute pulmonary edema",
      "IV furosemide 80 mg for diuresis",
      "IV calcium gluconate followed by insulin/dextrose for hyperkalemia"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with acute pulmonary edema from fluid overload in the setting of missed hemodialysis, with concurrent hyperkalemia and hypertension. The immediate life-threatening problem is severe hypoxemia (SpO2 82%) from pulmonary edema. BiPAP (bilevel positive airway pressure) is the first-line intervention for acute cardiogenic pulmonary edema as it: (1) reduces work of breathing and respiratory distress, (2) improves oxygenation by recruiting collapsed alveoli and providing positive end-expiratory pressure, (3) reduces preload by increasing intrathoracic pressure and decreasing venous return, and (4) reduces afterload by decreasing left ventricular transmural pressure. Studies have shown that BiPAP reduces the need for intubation by up to 50% in acute pulmonary edema. Concurrent IV nitroglycerin provides rapid preload and afterload reduction, helping to redistribute pulmonary fluid. While emergent hemodialysis is the definitive treatment for this patient, it takes time to arrange (vascular access, dialysis nurse, machine setup) and cannot address the immediate respiratory failure. The patient needs stabilization FIRST. IV furosemide is ineffective in anuric/oliguric ESRD patients because diuretics work on the kidneys, which are non-functional. The hyperkalemia at 6.2 mEq/L needs treatment (calcium gluconate for membrane stabilization, insulin/dextrose for shifting), but the immediate respiratory failure is the more acute threat. The emergency nurse should apply BiPAP at 10/5 cm H2O (IPAP/EPAP), start IV nitroglycerin, prepare hyperkalemia medications, and arrange emergent hemodialysis simultaneously.",
    learningObjective: "Prioritize respiratory stabilization with BiPAP and nitroglycerin for acute pulmonary edema in dialysis patients",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Heart Failure Management",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "PRIORITIZATION",
    examTrap: "IV furosemide is USELESS in anuric ESRD patients - diuretics require functioning kidneys",
    clinicalPearls: [
      "BiPAP reduces intubation rates by 50% in acute pulmonary edema",
      "BiPAP settings for pulmonary edema: IPAP 10-15, EPAP 5-10 cm H2O",
      "Furosemide is ineffective in anuric ESRD patients",
      "Stabilize the patient FIRST, then arrange definitive therapy (hemodialysis)"
    ],
    safetyNote: "BiPAP is contraindicated in patients who are obtunded, vomiting, or unable to protect their airway - intubate instead",
    distractorRationales: [
      "Hemodialysis is definitive but takes time to arrange - stabilize respiratory failure first",
      "BiPAP with nitroglycerin addresses the immediate life threat of respiratory failure",
      "Furosemide is ineffective in anuric ESRD patients",
      "Hyperkalemia treatment is important but respiratory failure is the more acute threat"
    ],
    lessonLink: "/emergency/lessons/heart-failure-management"
  },
  {
    stem: "A 33-year-old female marathon runner collapses at mile 24 and is brought to the medical tent. She is confused, HR 160 bpm, BP 78/40 mmHg, rectal temperature 41.2°C (106.2°F). ECG shows sinus tachycardia with diffuse ST depression. What is the most critical intervention?",
    options: [
      "IV normal saline bolus 2 liters for volume resuscitation",
      "Immediate whole-body cold water immersion to rapidly reduce core temperature",
      "IV acetaminophen 1 gram for temperature reduction",
      "Obtain CT head to rule out intracranial pathology causing altered mental status"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with exertional heat stroke, defined as core body temperature > 40°C (104°F) with central nervous system dysfunction (confusion, altered mental status) occurring during strenuous physical activity. Heat stroke is a medical emergency with mortality rates of 10-70% depending on duration of hyperthermia and speed of cooling. The single most important intervention is rapid body cooling, and the most effective method is cold water immersion (CWI) - immersing the body in an ice water bath at 1-3°C (34-37°F). CWI provides cooling rates of 0.15-0.35°C per minute, which is 2-3 times faster than any other cooling modality. The target is to reduce core temperature to 38.5-39°C (101-102°F) within 30 minutes. Every minute of delay in cooling increases morbidity and mortality. The phrase 'cool first, transport second' is the guiding principle for exertional heat stroke management. While IV fluid resuscitation is important for the associated dehydration and hypotension, it does not address the primary pathology of hyperthermia. Fluids should be administered concurrently with cooling but should not delay the initiation of CWI. Acetaminophen and other antipyretics are INEFFECTIVE for heat stroke because the hyperthermia is not caused by a reset hypothalamic set point (as in fever) but by the body's inability to dissipate heat generated by muscle activity. CT head is not indicated as the altered mental status is explained by the heat stroke. The ECG changes (diffuse ST depression and sinus tachycardia) are secondary to heat-induced myocardial stress and should resolve with cooling.",
    learningObjective: "Prioritize rapid cold water immersion as the most critical intervention for exertional heat stroke",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Environmental Cardiac Emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Antipyretics (acetaminophen, ibuprofen) are INEFFECTIVE for heat stroke - the mechanism is not hypothalamic",
    clinicalPearls: [
      "Heat stroke: core temp > 40°C + CNS dysfunction = medical emergency",
      "Cold water immersion provides fastest cooling at 0.15-0.35°C per minute",
      "Cool first, transport second - every minute of delay increases mortality",
      "Antipyretics are ineffective for heat stroke - mechanism is not hypothalamic"
    ],
    safetyNote: "Do not stop cooling at 38.5°C if using CWI - the body will continue to cool after removal (afterdrop is minimal with CWI)",
    distractorRationales: [
      "IV fluids are important but should not delay cold water immersion",
      "Cold water immersion is the most effective and time-critical intervention",
      "Acetaminophen is ineffective for heat stroke - hyperthermia is not fever-mediated",
      "CT head is unnecessary as altered mental status is explained by heat stroke"
    ],
    lessonLink: "/emergency/lessons/environmental-emergencies"
  }
];
