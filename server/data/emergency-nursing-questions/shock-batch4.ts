import { EmergencyNursingQuestion } from "./types";

export const shockBatch4Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 62-year-old male in the ICU with septic shock is receiving norepinephrine at 30 mcg/min and vasopressin at 0.04 units/min. His MAP is 58 mmHg and his echocardiogram shows a left ventricular ejection fraction (LVEF) of 25%. Before sepsis, his cardiac function was normal. What is this cardiac phenomenon called, and what agent should be added?",
    options: [
      "Takotsubo cardiomyopathy — add a calcium channel blocker",
      "Sepsis-induced cardiomyopathy (septic cardiomyopathy) — add dobutamine for inotropic support to improve cardiac contractility",
      "Acute decompensated heart failure — add furosemide for diuresis",
      "Right ventricular failure — add milrinone for pulmonary vasodilation"
    ],
    correctAnswer: 1,
    rationaleLong: "Sepsis-induced cardiomyopathy (also called septic cardiomyopathy or myocardial depression of sepsis) occurs in approximately 40-60% of patients with septic shock. It is characterized by biventricular dilation, reduced ejection fraction, and impaired contractility that develops acutely during sepsis and is typically reversible within 7-10 days if the patient survives. The pathophysiology involves circulating myocardial depressant factors (including TNF-alpha, IL-1beta, and nitric oxide), mitochondrial dysfunction in cardiomyocytes, and calcium handling abnormalities. This patient has a new LVEF of 25% (normal is >55%) in the setting of previously normal cardiac function, confirming septic cardiomyopathy. When septic shock is complicated by myocardial depression, the shock becomes a mixed distributive and cardiogenic picture. The Surviving Sepsis Campaign recommends adding dobutamine as the first-line inotrope in this scenario. Dobutamine is a synthetic catecholamine with primarily beta-1 agonist activity (positive inotrope and chronotrope) and some beta-2 activity (mild vasodilation). It increases cardiac output by improving contractility and reducing afterload. The typical starting dose is 2-5 mcg/kg/min, titrated to clinical endpoints (improved MAP, decreased lactate, improved mixed venous oxygen saturation, improved urine output). The emergency nurse should monitor for dobutamine-related complications: tachycardia (which increases myocardial oxygen demand), arrhythmias (both atrial and ventricular), and hypotension (from beta-2 mediated vasodilation — which is why vasopressors should already be optimized before adding dobutamine). If dobutamine fails, milrinone (a phosphodiesterase-3 inhibitor) is an alternative inotrope, though it also causes vasodilation and may worsen hypotension. Furosemide would be harmful because these patients typically need volume, and diuresis would further reduce preload in an already hypoperfused state.",
    learningObjective: "Recognize sepsis-induced cardiomyopathy and initiate dobutamine for inotropic support in mixed distributive-cardiogenic shock",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Septic cardiomyopathy is REVERSIBLE (7-10 days) — unlike ischemic cardiomyopathy. Do not assume permanent cardiac dysfunction.",
    clinicalPearls: [
      "Septic cardiomyopathy occurs in 40-60% of septic shock patients — always assess cardiac function with echo",
      "Dobutamine is first-line for inotropic support in septic cardiomyopathy — start 2-5 mcg/kg/min",
      "Septic cardiomyopathy is typically reversible within 7-10 days if the patient survives the sepsis"
    ],
    safetyNote: "Optimize vasopressors before adding dobutamine — dobutamine's beta-2 vasodilation can worsen hypotension if vasopressor support is inadequate",
    distractorRationales: [
      "Takotsubo (stress cardiomyopathy) has a characteristic apical ballooning pattern on echo — septic cardiomyopathy shows global hypokinesis",
      "Diuresis with furosemide reduces preload and would worsen hypoperfusion in septic shock — contraindicated",
      "Milrinone is a second-line option but causes more vasodilation than dobutamine — higher risk of worsening hypotension"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 45-year-old female with a history of systemic lupus erythematosus presents with progressive dyspnea over 2 weeks. Vitals: BP 88/60, HR 120, RR 28. Physical exam reveals JVD, muffled heart sounds, and pulsus paradoxus of 22 mmHg. What type of shock is this, and what is pulsus paradoxus?",
    options: [
      "Distributive shock — pulsus paradoxus is an irregular pulse rhythm",
      "Obstructive shock from cardiac tamponade — pulsus paradoxus is an exaggerated drop in systolic blood pressure (>10 mmHg) during inspiration caused by impaired ventricular filling",
      "Cardiogenic shock from myocarditis — pulsus paradoxus is an elevated pulse pressure",
      "Hypovolemic shock — pulsus paradoxus is a pulse that disappears during expiration"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has obstructive shock from cardiac tamponade, a condition where fluid accumulates in the pericardial space and compresses the heart, preventing adequate filling during diastole. The classic findings are Beck's triad: hypotension, JVD (jugular venous distension), and muffled (distant) heart sounds. Pulsus paradoxus is defined as an exaggerated (>10 mmHg) drop in systolic blood pressure during inspiration. Normal physiology: during inspiration, negative intrathoracic pressure increases venous return to the right heart and slightly expands the pulmonary vasculature, which transiently reduces left ventricular filling and systolic pressure by up to 10 mmHg. In tamponade, the rigid, fluid-filled pericardium prevents the heart from expanding to accommodate the increased right ventricular volume during inspiration. The interventricular septum is forced leftward (interventricular interdependence), further reducing left ventricular filling and stroke volume. This causes the normal inspiratory drop in systolic BP to be dramatically amplified — in this case, 22 mmHg, well above the >10 mmHg threshold. Measuring pulsus paradoxus: (1) Inflate the BP cuff above the systolic pressure; (2) Slowly deflate until the first Korotkoff sounds are heard — these will initially be heard only during EXPIRATION; (3) Continue deflating until Korotkoff sounds are heard throughout the respiratory cycle; (4) The difference between these two pressures is the pulsus paradoxus. The SLE connection: autoimmune pericarditis is common in SLE (serositis is one of the diagnostic criteria). Pericardial effusion can develop insidiously, as in this case with 2 weeks of progressive dyspnea. Treatment is emergent pericardiocentesis. Important: do NOT administer diuretics or vasodilators — they reduce preload, which the tamponading heart desperately needs to generate any cardiac output. IV fluid bolus can temporize by increasing preload while preparing for pericardiocentesis.",
    learningObjective: "Define pulsus paradoxus, explain its mechanism in cardiac tamponade, and measure it at the bedside",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Pulsus paradoxus >10 mmHg is significant. It is NOT paradoxical because the pulse disappears — it is an exaggeration of normal respiratory variation in BP.",
    clinicalPearls: [
      "Pulsus paradoxus: >10 mmHg drop in systolic BP during inspiration — measure with manual BP cuff, not automated",
      "Beck's triad: hypotension + JVD + muffled heart sounds = cardiac tamponade",
      "SLE patients are at risk for pericardial effusion — serositis is a diagnostic criterion for SLE"
    ],
    safetyNote: "IV fluids can temporize tamponade by increasing preload — give a 500 mL NS bolus while preparing for pericardiocentesis",
    distractorRationales: [
      "Distributive shock causes low SVR with warm extremities — this patient has signs of obstructed cardiac output, not vasodilation",
      "Pulsus paradoxus is not an elevated pulse pressure — it is a specific BP measurement during the respiratory cycle",
      "The pulse does not disappear during expiration — it decreases during INSPIRATION"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 70-year-old male with a history of COPD is intubated and mechanically ventilated for respiratory failure. Shortly after intubation, he becomes acutely hypotensive (BP 60/30) with HR 130. The ventilator shows high peak airway pressures. Breath sounds are diminished bilaterally. What is the most likely cause and the immediate intervention?",
    options: [
      "Cardiogenic shock from acute MI — obtain a 12-lead ECG and start vasopressors",
      "Tension pneumothorax from positive-pressure ventilation barotrauma — disconnect the ventilator to allow passive exhalation and perform bilateral needle decompression if auto-PEEP is excluded",
      "Massive pulmonary embolism — administer systemic thrombolytics",
      "Anaphylaxis to the intubation medications — administer epinephrine 0.3 mg IM"
    ],
    correctAnswer: 1,
    rationaleLong: "This scenario describes a common and dangerous complication of positive-pressure mechanical ventilation in COPD patients: either tension pneumothorax or severe auto-PEEP (breath stacking). Both can present identically with acute hypotension, tachycardia, high airway pressures, and diminished breath sounds after intubation. The critical first step is to DISCONNECT THE PATIENT FROM THE VENTILATOR. This is both diagnostic and therapeutic: (1) If the cause is AUTO-PEEP (dynamic hyperinflation/breath stacking): disconnecting allows trapped air to escape passively during a prolonged exhalation. COPD patients have severely prolonged expiratory times, and the ventilator may not allow enough time for complete exhalation before delivering the next breath. Air progressively stacks in the lungs, increasing intrathoracic pressure, compressing the vena cava, and reducing venous return — causing obstructive shock physiology identical to tension pneumothorax. The hemodynamic compromise often resolves within seconds of disconnection as the trapped air escapes; (2) If the cause is TENSION PNEUMOTHORAX: disconnecting will not resolve the hemodynamic compromise because the air has escaped from a ruptured bleb into the pleural space and cannot re-enter the airway. If the patient does not improve within 10-15 seconds of disconnection, proceed immediately to needle decompression (14-gauge needle, 2nd intercostal space, midclavicular line, or 5th intercostal space, mid-axillary line) followed by chest tube placement. COPD patients are at high risk for ventilator-induced pneumothorax because their hyperinflated lungs with blebs and bullae are susceptible to rupture from positive-pressure ventilation. This is why protective ventilation strategies (low tidal volumes, adequate expiratory time, low respiratory rates, permissive hypercapnia) are essential. The emergency nurse must be prepared for this complication whenever intubating a COPD patient and should have needle decompression supplies immediately available.",
    learningObjective: "Differentiate tension pneumothorax from auto-PEEP in ventilated COPD patients and perform the disconnect test",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "DISCONNECT FROM THE VENTILATOR FIRST — this simple step resolves auto-PEEP immediately and helps differentiate it from tension pneumothorax",
    clinicalPearls: [
      "Disconnect test: if BP improves within seconds of disconnection, the cause was auto-PEEP, not pneumothorax",
      "COPD patients are high-risk for both auto-PEEP and barotrauma-induced pneumothorax during mechanical ventilation",
      "Protective ventilation in COPD: low rate (10-12/min), prolonged expiratory time (I:E ratio 1:4-1:5), low tidal volumes"
    ],
    safetyNote: "Always have needle decompression supplies at the bedside when ventilating COPD patients — pneumothorax can occur at any time during mechanical ventilation",
    distractorRationales: [
      "While acute MI is possible, the temporal relationship to intubation and high airway pressures strongly suggests a ventilator-related complication",
      "PE would not cause high peak airway pressures — PE causes hemodynamic compromise but does not typically increase ventilator pressures",
      "Anaphylaxis would cause low airway pressures from bronchospasm (decreased breath sounds with wheezing), not high peak pressures"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 38-year-old female presents to the ED with acute-onset severe headache, neck stiffness, and photophobia. Her temperature is 39.8°C, HR 128, BP 76/40. She has a petechial rash on her trunk and extremities that does not blanch with pressure. What is the most likely diagnosis, and what must be administered within the first hour?",
    options: [
      "Viral meningitis — IV acyclovir within 6 hours",
      "Meningococcal meningitis with meningococcemia causing septic shock — IV antibiotics (ceftriaxone) and dexamethasone must be administered within the first hour, ideally within 30 minutes",
      "Rocky Mountain spotted fever — doxycycline within 24 hours",
      "Immune thrombocytopenic purpura — platelet transfusion within 4 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation is classic for meningococcal meningitis with meningococcemia — infection with Neisseria meningitidis that has progressed to septic shock. The key findings are: (1) Meningeal signs: severe headache, neck stiffness (nuchal rigidity), and photophobia; (2) High fever (39.8°C); (3) Hemodynamic instability: tachycardia and hypotension indicating septic shock; (4) Non-blanching petechial rash: this is the hallmark of meningococcemia — the rash is caused by DIC (disseminated intravascular coagulation) and direct endothelial damage by the meningococcal bacteria, leading to microvascular thrombosis and hemorrhagic skin lesions. A petechial rash that does not blanch with pressure (the 'glass test' — pressing a clear glass against the skin to see if the rash disappears) indicates blood has extravasated into the tissue, distinguishing it from erythematous rashes caused by vasodilation. Meningococcal disease can progress from early symptoms to death in as little as 12-24 hours, making it one of the most rapidly fatal infections. Time to antibiotics is the single most important modifiable factor affecting survival. The Surviving Sepsis Campaign mandates antibiotics within 1 hour for septic shock, but for suspected bacterial meningitis, the goal is even more aggressive — within 30 minutes of presentation. Empiric antibiotic therapy: ceftriaxone 2g IV (covers N. meningitidis, S. pneumoniae, and H. influenzae) plus vancomycin (for resistant pneumococcus) plus dexamethasone 0.15 mg/kg IV (given before or with the first antibiotic dose — reduces inflammation, improves outcomes, particularly in pneumococcal meningitis). Do NOT delay antibiotics for lumbar puncture or CT scan. If LP will be delayed, give antibiotics immediately and perform LP afterward — blood cultures and CSF can still yield organisms even after antibiotic administration. Droplet precautions are essential for suspected meningococcal disease. Close contacts require chemoprophylaxis (ciprofloxacin, rifampin, or ceftriaxone) and the case must be reported to public health authorities.",
    learningObjective: "Recognize meningococcal meningitis with septic shock and initiate antibiotics within 30-60 minutes without delay for diagnostics",
    blueprintCategory: "Shock",
    subtopic: "septic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER delay antibiotics for CT or LP in suspected bacterial meningitis — time to antibiotics is the strongest predictor of survival",
    clinicalPearls: [
      "Non-blanching petechial rash + meningeal signs + shock = meningococcemia until proven otherwise",
      "Give dexamethasone before or with the first dose of antibiotics — not after (reduces inflammatory damage)",
      "Meningococcal disease can progress from symptoms to death in 12-24 hours — treat as extreme emergency"
    ],
    safetyNote: "Initiate droplet precautions immediately and arrange chemoprophylaxis for close contacts — meningococcal disease is highly transmissible",
    distractorRationales: [
      "Viral meningitis does not typically cause petechial rash or septic shock — and acyclovir treats HSV encephalitis, not meningococcus",
      "RMSF causes a rash but it typically starts on extremities and becomes petechial later — and the meningeal signs point to meningitis",
      "ITP causes petechiae from low platelets but does not cause fever, meningeal signs, or septic shock"
    ],
    lessonPath: "/emergency/lessons/septic-shock"
  },
  {
    stem: "A 50-year-old male with a history of chronic alcoholism presents with hematemesis and melena. He is confused, jaundiced, with spider angiomata and palmar erythema. Vitals: BP 72/38, HR 138, RR 24. His hemoglobin is 5.2 g/dL. The nurse initiates massive transfusion. After 8 units of PRBCs, his ionized calcium drops to 0.82 mmol/L (normal 1.15-1.35). What is causing the hypocalcemia?",
    options: [
      "Calcium loss through the GI hemorrhage",
      "Citrate toxicity from massive transfusion — citrate anticoagulant in banked blood chelates ionized calcium, and the cirrhotic liver cannot metabolize the citrate load",
      "Vitamin D deficiency from chronic alcoholism",
      "Hypoparathyroidism triggered by the acute blood loss"
    ],
    correctAnswer: 1,
    rationaleLong: "Citrate toxicity is a critically important complication of massive transfusion. All banked blood products (PRBCs, FFP, platelets) contain citrate as an anticoagulant preservative. Citrate works by chelating (binding) ionized calcium, which is required for multiple steps in the coagulation cascade. Under normal circumstances, citrate from transfused blood is rapidly metabolized by the liver through the Krebs cycle. However, in this patient with cirrhotic liver disease from chronic alcoholism, hepatic citrate metabolism is severely impaired. As citrate accumulates from massive transfusion (8 units of PRBCs), it progressively chelates circulating ionized calcium, causing life-threatening hypocalcemia. The clinical consequences of citrate-induced hypocalcemia include: (1) CARDIAC — prolonged QT interval, decreased myocardial contractility, bradycardia, hypotension, and in severe cases cardiac arrest; (2) COAGULATION — worsened coagulopathy (calcium is Factor IV in the clotting cascade — without ionized calcium, coagulation cannot proceed normally); (3) NEUROMUSCULAR — perioral tingling, muscle tremors, tetany, laryngospasm. The ionized calcium of 0.82 mmol/L is critically low and requires emergent treatment: IV calcium chloride 1 g (10 mL of 10% solution) via central line (calcium chloride provides 3x more elemental calcium than calcium gluconate but is vesicant and requires central access), or calcium gluconate 3 g IV if central access is not available. The emergency nurse should: (1) Monitor ionized calcium every 30 minutes during massive transfusion; (2) Administer calcium empirically after every 4 units of PRBCs (or sooner in liver disease); (3) Monitor the ECG for QT prolongation continuously; (4) Be aware that hypothermia also impairs citrate metabolism, creating a compound problem when combined with liver dysfunction. Patients with liver disease are particularly vulnerable to citrate toxicity and require more aggressive calcium supplementation during massive transfusion.",
    learningObjective: "Recognize citrate toxicity from massive transfusion and implement prophylactic calcium supplementation, especially in liver disease",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Liver disease dramatically increases citrate toxicity risk — the liver cannot metabolize citrate, causing accelerated calcium chelation during massive transfusion",
    clinicalPearls: [
      "Citrate in banked blood chelates ionized calcium — give calcium empirically after every 4 units PRBCs",
      "Calcium chloride provides 3x more elemental calcium than calcium gluconate but requires central access (vesicant)",
      "Monitor ionized calcium (not total calcium) during massive transfusion — ionized is the physiologically active form"
    ],
    safetyNote: "Never infuse calcium through the same IV line as blood products — calcium reverses the citrate anticoagulant and causes clotting in the tubing",
    distractorRationales: [
      "GI hemorrhage does not directly cause calcium loss — calcium is an intracellular and skeletal ion, not significantly present in GI secretions",
      "Vitamin D deficiency is chronic and would not cause acute hypocalcemia in this timeframe — the temporal relationship to transfusion confirms citrate toxicity",
      "Hypoparathyroidism is not triggered by acute blood loss — PTH is regulated by calcium levels, not blood volume"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 28-year-old female presents to the ED with severe abdominal pain, vaginal spotting, and dizziness. Her last menstrual period was 7 weeks ago. Vitals: BP 82/50, HR 132, RR 22. Bedside ultrasound shows free fluid in Morrison's pouch and an empty uterus. Quantitative hCG is 6,500 mIU/mL. What is the diagnosis and priority intervention?",
    options: [
      "Threatened miscarriage — reassure and discharge with OB follow-up",
      "Ruptured ectopic pregnancy with hemorrhagic shock — emergent OB/surgical consultation for operative intervention and simultaneous volume resuscitation",
      "Ruptured ovarian cyst — observation and pain management",
      "Molar pregnancy — schedule for suction curettage within one week"
    ],
    correctAnswer: 1,
    rationaleLong: "This is a classic presentation of ruptured ectopic pregnancy causing hemorrhagic shock. The key diagnostic findings are: (1) Positive pregnancy (hCG 6,500 mIU/mL) with an EMPTY uterus on ultrasound — at an hCG level above the discriminatory zone (typically 1,500-2,000 mIU/mL for transvaginal ultrasound), an intrauterine pregnancy should be visible. An empty uterus above the discriminatory zone is ectopic pregnancy until proven otherwise; (2) Free fluid in Morrison's pouch (hepatorenal recess) — this represents hemoperitoneum from the ruptured ectopic pregnancy. Morrison's pouch is the most dependent space in the peritoneal cavity when the patient is supine, so free fluid accumulates here first; (3) Hemodynamic instability (hypotension, tachycardia) — indicates significant hemorrhage. Ectopic pregnancy is the leading cause of first-trimester maternal death and remains one of the most commonly missed diagnoses in emergency medicine. The ectopic pregnancy (most commonly in the fallopian tube — 95% of cases) ruptures when the growing gestational tissue erodes through the tubal wall, lacerating tubal blood vessels and causing rapid intraperitoneal hemorrhage. Emergency nursing priorities: (1) Two large-bore IV access (16-gauge or larger) with aggressive fluid resuscitation; (2) Type and crossmatch for at least 4 units PRBCs — may need to give O-negative uncrossmatched blood if hemodynamically unstable; (3) Emergent OB/GYN consultation for operative management (salpingectomy or salpingostomy via laparotomy or laparoscopy); (4) Rh status determination — Rh-negative patients require RhoGAM; (5) NPO (patient needs emergent surgery); (6) Continuous cardiac monitoring. The FAST exam (Focused Assessment with Sonography in Trauma) technique is used to detect free fluid — any emergency nurse should be proficient in identifying fluid in Morrison's pouch, the splenorenal recess, the pelvis, and the pericardial space. This patient's presentation is not subtle — she is in hemorrhagic shock from a ruptured ectopic — but earlier presentations can be easily missed if pregnancy testing is not performed on all females of reproductive age with abdominal pain.",
    learningObjective: "Diagnose ruptured ectopic pregnancy using hCG levels, ultrasound findings, and clinical presentation, and initiate emergent surgical intervention",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Empty uterus + hCG above discriminatory zone + free fluid = ruptured ectopic until proven otherwise. NEVER discharge this patient.",
    clinicalPearls: [
      "hCG above discriminatory zone (1,500-2,000) with empty uterus = ectopic pregnancy until proven otherwise",
      "Morrison's pouch (hepatorenal recess) is the most dependent peritoneal space in supine position — free fluid collects here first",
      "Ectopic pregnancy is the leading cause of first-trimester maternal death — maintain high clinical suspicion"
    ],
    safetyNote: "Perform a urine pregnancy test on ALL females of reproductive age with abdominal pain, syncope, or vaginal bleeding — ectopic pregnancy is a commonly missed diagnosis",
    distractorRationales: [
      "Threatened miscarriage would show an intrauterine pregnancy with a fetal heartbeat — this has an empty uterus and hemoperitoneum",
      "Ruptured ovarian cyst can cause free fluid but would not explain the empty uterus with elevated hCG",
      "Molar pregnancy typically shows a 'snowstorm' pattern within the uterus with markedly elevated hCG — not an empty uterus"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 55-year-old male presents to the ED with acute chest pain, diaphoresis, and dyspnea. ECG shows ST elevation in leads II, III, and aVF with ST depression in I and aVL. His BP is 74/40, HR 42, and JVD is prominent. He has clear lung fields. What is the diagnosis, and why is nitroglycerin contraindicated?",
    options: [
      "Anterior STEMI with cardiogenic shock — nitroglycerin is contraindicated because of the bradycardia",
      "Inferior STEMI with right ventricular involvement — nitroglycerin is contraindicated because it reduces preload, and the failing right ventricle is critically preload-dependent to maintain cardiac output",
      "Pericarditis with tamponade — nitroglycerin is contraindicated because of the low blood pressure",
      "Aortic dissection — nitroglycerin is contraindicated because it may worsen the dissection"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has an inferior STEMI (ST elevation in II, III, aVF — the inferior leads) with right ventricular (RV) infarction. The clues to RV involvement are: (1) Inferior STEMI — the right coronary artery (RCA) supplies both the inferior wall of the left ventricle and the right ventricle in 85% of people. Approximately 30-50% of inferior STEMIs have concomitant RV infarction; (2) Hypotension with bradycardia — RV infarction causes decreased RV output, which reduces LV preload, causing systemic hypotension. The bradycardia results from RCA occlusion affecting the SA node (supplied by the RCA in 60% of people) and AV node (supplied by the RCA in 85%); (3) JVD with clear lungs — the failing right ventricle causes venous congestion (JVD) but because it cannot effectively pump blood to the left heart, the lungs remain clear (no pulmonary edema). This is the classic 'clear lungs with JVD' that distinguishes RV infarction from LV failure. Nitroglycerin is CONTRAINDICATED in RV infarction because it is a potent venodilator that reduces preload. The failing right ventricle operates on the steep portion of the Frank-Starling curve and is critically dependent on adequate preload to maintain any cardiac output. Reducing preload with nitroglycerin (or morphine, or diuretics) can cause catastrophic hemodynamic collapse — patients can become profoundly hypotensive or arrest. Treatment of RV infarction: (1) IV fluid challenge — give 250-500 mL NS boluses, monitoring for improvement in BP and urine output (total 1-2 L may be needed); (2) Avoid ALL preload reducers: nitroglycerin, morphine, diuretics, ACE inhibitors; (3) If fluids fail to restore BP, dobutamine for inotropic support; (4) Emergent PCI (percutaneous coronary intervention) to open the occluded RCA. Right-sided ECG (V4R) would confirm RV infarction with ST elevation >1 mm in V4R — this lead should be obtained in ALL inferior STEMIs.",
    learningObjective: "Identify right ventricular infarction complicating inferior STEMI and explain why preload reduction is contraindicated",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Inferior STEMI + hypotension + JVD + clear lungs = RV infarction. NEVER give nitroglycerin, morphine, or diuretics — the RV needs preload to survive.",
    clinicalPearls: [
      "Always obtain right-sided ECG (V4R) in inferior STEMI — ST elevation in V4R confirms RV infarction",
      "RV infarction triad: hypotension + JVD + clear lungs — treat with IV fluids, not nitroglycerin",
      "30-50% of inferior STEMIs have concomitant RV infarction — always assess for it"
    ],
    safetyNote: "A single dose of sublingual nitroglycerin in RV infarction can cause cardiovascular collapse — always check right-sided leads before administering nitroglycerin in inferior STEMI",
    distractorRationales: [
      "Anterior STEMI shows ST elevation in V1-V4 — this ECG shows inferior lead changes (II, III, aVF)",
      "Pericarditis shows diffuse ST elevation without reciprocal changes — this has clear reciprocal ST depression in I and aVL",
      "Aortic dissection typically presents with tearing chest/back pain and pulse/BP differentials — and would not show focal ST elevation"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 60-year-old female with metastatic breast cancer presents to the ED with confusion, weakness, nausea, and constipation. Her ECG shows a shortened QT interval. Labs reveal calcium of 14.8 mg/dL (normal 8.5-10.5). She becomes hypotensive with BP 80/50. What is the initial treatment for this hypercalcemic crisis?",
    options: [
      "IV furosemide as the first-line treatment to promote calciuresis",
      "Aggressive IV normal saline resuscitation (200-500 mL/hr) to restore intravascular volume and promote renal calcium excretion — followed by calcitonin and bisphosphonates",
      "Immediate hemodialysis to remove excess calcium",
      "Oral phosphate supplements to bind calcium in the GI tract"
    ],
    correctAnswer: 1,
    rationaleLong: "Hypercalcemic crisis (calcium >14 mg/dL with symptoms) is a medical emergency that can cause cardiac arrest if not treated promptly. In this patient with metastatic breast cancer, the hypercalcemia is most likely due to either osteolytic bone metastases (releasing calcium from bone destruction) or humoral hypercalcemia of malignancy (tumor secretion of PTHrP — parathyroid hormone-related peptide). The initial and most critical treatment is aggressive IV normal saline infusion at 200-500 mL/hour. The rationale is multifold: (1) VOLUME REPLETION — hypercalcemia causes nephrogenic diabetes insipidus (the kidneys cannot concentrate urine normally), leading to polyuria and severe dehydration. Most hypercalcemic patients are profoundly volume-depleted, which worsens the hypercalcemia by reducing renal calcium excretion; (2) PROMOTE CALCIURESIS — restoring intravascular volume and increasing renal blood flow enhances glomerular filtration of calcium. Sodium and calcium share reabsorption pathways in the proximal tubule and loop of Henle — increased sodium delivery promotes calcium excretion; (3) RESTORE BLOOD PRESSURE — the hypotension is primarily from dehydration. After adequate volume resuscitation (typically 3-6 liters in the first 24 hours), additional therapies are layered: (1) Calcitonin 4 IU/kg SC or IM every 12 hours — works within 4-6 hours by inhibiting osteoclast bone resorption and increasing renal calcium excretion. Calcitonin is the fastest-acting calcium-lowering agent but its effect is modest (lowers calcium 1-2 mg/dL) and tachyphylaxis develops within 48 hours; (2) Zoledronic acid 4 mg IV over 15 minutes (or pamidronate 60-90 mg IV over 2-4 hours) — bisphosphonates are the most effective calcium-lowering agents but take 2-4 days to reach full effect. They work by inhibiting osteoclast-mediated bone resorption. IV furosemide was historically used to promote calciuresis but is NO LONGER recommended as first-line — it can worsen dehydration if given before adequate volume resuscitation and provides minimal calcium-lowering benefit.",
    learningObjective: "Treat hypercalcemic crisis with aggressive saline hydration as first-line therapy and layer additional agents based on onset of action",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Furosemide is NO LONGER first-line for hypercalcemia — it can worsen dehydration. IV saline is the cornerstone of treatment.",
    clinicalPearls: [
      "Hypercalcemia treatment layering: NS hydration (immediate) → calcitonin (hours) → bisphosphonates (days)",
      "Shortened QT interval is the classic ECG finding of hypercalcemia — the opposite of hypocalcemia's prolonged QT",
      "Most hypercalcemic patients are severely dehydrated — replace volume aggressively before any other intervention"
    ],
    safetyNote: "Monitor for fluid overload during aggressive hydration — check lung sounds, JVD, and SpO2 frequently, especially in patients with cardiac or renal disease",
    distractorRationales: [
      "Furosemide before adequate hydration worsens dehydration and can precipitate renal failure — no longer recommended as first-line",
      "Hemodialysis is reserved for refractory hypercalcemia with renal failure — not first-line treatment",
      "Oral phosphate can cause dangerous calcium-phosphate precipitation in soft tissues — IV therapy is needed in this acute setting"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 32-year-old male is brought to the ED after a motorcycle accident. He has a GCS of 14, an open right femur fracture, and is receiving 2 liters of normal saline. His initial vitals are: BP 100/70, HR 110. After 30 minutes, repeat vitals show BP 88/55, HR 128. He remains anxious with delayed capillary refill. What class of hemorrhagic shock is this patient in based on ATLS classification, and what is the priority intervention?",
    options: [
      "Class I (up to 15% blood loss) — continue observation and crystalloid infusion",
      "Class III (30-40% blood loss) — activate massive transfusion protocol and prepare for operative fixation of the femur fracture",
      "Class II (15-30% blood loss) — continue crystalloid and reassess in one hour",
      "Class IV (>40% blood loss) — perform emergency department thoracotomy"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is in Class III hemorrhagic shock based on the ATLS (Advanced Trauma Life Support) classification. The four classes of hemorrhagic shock are: CLASS I (<750 mL, <15% blood volume): HR <100, normal BP, normal RR, slightly anxious — minimal symptoms, no intervention beyond crystalloid usually needed; CLASS II (750-1500 mL, 15-30%): HR 100-120, normal systolic BP (narrowed pulse pressure), RR 20-30, anxious — may respond to crystalloid alone; CLASS III (1500-2000 mL, 30-40%): HR >120, decreased systolic BP, RR 30-40, confused/anxious, decreased urine output — requires blood transfusion; CLASS IV (>2000 mL, >40%): HR >140, profoundly hypotensive, RR >35, confused/lethargic, negligible urine output — immediately life-threatening, requires massive transfusion and surgical hemostasis. This patient's findings place him in Class III: HR 128 (>120), systolic BP 88 (decreased), anxiety with delayed capillary refill, and failure to respond to 2L crystalloid (a 'non-responder' or 'transient responder'). The failure to improve with crystalloid is itself a critical indicator — the 2013 ATLS update de-emphasized large-volume crystalloid resuscitation in favor of early blood product administration. Current evidence supports limiting crystalloid to 1-2 liters maximum and transitioning to blood products (1:1:1 ratio of PRBCs:FFP:platelets) if the patient does not respond. The open femur fracture is likely the source of hemorrhage — femur fractures can cause 1,000-2,000 mL of blood loss into the thigh compartment. Priority interventions: (1) Activate massive transfusion protocol; (2) Apply temporary traction splint to reduce the fracture and tamponade bleeding; (3) Administer TXA 1g IV over 10 minutes if within 3 hours of injury; (4) Prepare for operative fixation as definitive hemostasis. Emergency department thoracotomy is indicated for penetrating thoracic trauma with loss of vital signs — not for an extremity injury.",
    learningObjective: "Classify hemorrhagic shock severity using ATLS parameters and recognize the transition point from crystalloid to blood product resuscitation",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A patient who fails to respond to 2L crystalloid needs BLOOD, not more crystalloid. Limit crystalloid to 1-2L then transition to blood products.",
    clinicalPearls: [
      "ATLS Class III: HR >120, decreased BP, 30-40% blood loss — the threshold for mandatory blood transfusion",
      "Femur fractures can sequester 1,000-2,000 mL of blood — a single closed femur fracture can cause Class III shock",
      "Failure to respond to initial crystalloid = likely Class III or IV — activate massive transfusion protocol immediately"
    ],
    safetyNote: "Apply a traction splint to femur fractures early — it reduces the fracture, limits compartment expansion, and can significantly reduce blood loss",
    distractorRationales: [
      "Class I has minimal hemodynamic changes and HR <100 — this patient has HR 128 and hypotension",
      "Class II may respond to crystalloid with normal systolic BP — this patient has failed crystalloid and has decreased BP",
      "Class IV has HR >140 and profound shock — this patient's parameters are severe but not yet in the most extreme category"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 48-year-old female with a history of Graves' disease presents to the ED with agitation, fever of 40.5°C, HR 180 (atrial fibrillation), BP 90/50, and profuse diaphoresis. She admits to stopping her methimazole 2 weeks ago. What is this life-threatening condition, and what are the three pillars of treatment?",
    options: [
      "Pheochromocytoma crisis — alpha-blockade, beta-blockade, and surgical resection",
      "Thyroid storm — the three pillars are: (1) beta-blockade to control heart rate, (2) thionamide to block new thyroid hormone synthesis, and (3) iodine to block thyroid hormone release (given at least 1 hour after thionamide)",
      "Serotonin syndrome — cyproheptadine, benzodiazepines, and active cooling",
      "Malignant hyperthermia — dantrolene, active cooling, and hyperventilation"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is in thyroid storm (thyrotoxic crisis), a life-threatening exacerbation of hyperthyroidism with a mortality rate of 10-30% even with treatment. The Burch-Wartofsky Point Scale (BWPS) can help quantify the diagnosis — this patient scores very high with temperature >40°C, HR >140 with atrial fibrillation, CNS agitation, and GI involvement likely (nausea/vomiting). The precipitant was abrupt discontinuation of antithyroid medication (methimazole). The three pillars of treatment target different aspects of thyroid hormone physiology: PILLAR 1 — BETA-BLOCKADE: Propranolol is the preferred beta-blocker because it provides rate control AND inhibits peripheral conversion of T4 to the more active T3. The dose is propranolol 60-80 mg PO every 4-6 hours or 1 mg IV every 10-15 minutes with continuous cardiac monitoring. For patients who cannot tolerate beta-blockers (asthma, severe heart failure), esmolol IV infusion is an alternative; PILLAR 2 — THIONAMIDE (PTU or methimazole): Propylthiouracil (PTU) is preferred over methimazole in thyroid storm because it both blocks new thyroid hormone synthesis AND inhibits peripheral T4-to-T3 conversion. Dose: PTU 500-1000 mg loading dose, then 250 mg every 4 hours; PILLAR 3 — IODINE (Lugol's solution, SSKI, or sodium iodide): Iodine exploits the Wolff-Chaikoff effect — high iodine concentrations paradoxically BLOCK thyroid hormone release from the gland. CRITICAL: iodine must be given at least 1 HOUR AFTER the thionamide. If iodine is given first, the thyroid gland will use the iodine as substrate to synthesize MORE thyroid hormone, worsening the storm. Additional supportive measures: (1) Hydrocortisone 100 mg IV every 8 hours — stress-dose steroids because thyroid storm increases cortisol metabolism and relative adrenal insufficiency may develop. Glucocorticoids also inhibit T4-to-T3 conversion; (2) Active cooling for hyperthermia — acetaminophen for antipyresis (avoid aspirin — it displaces T4 from binding proteins, increasing free T4); (3) Aggressive IV fluid resuscitation for dehydration; (4) Treat the precipitant (restart antithyroid medication).",
    learningObjective: "Diagnose thyroid storm and implement the three pillars of treatment with correct sequencing of iodine after thionamide",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 5,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Give iodine at least 1 HOUR AFTER thionamide — giving iodine first provides substrate for more hormone synthesis, worsening the storm",
    clinicalPearls: [
      "PTU is preferred over methimazole in thyroid storm — it blocks both synthesis AND peripheral T4-to-T3 conversion",
      "Avoid aspirin for fever in thyroid storm — it displaces T4 from binding proteins, increasing free hormone levels",
      "Propranolol is preferred because it also blocks peripheral T4-to-T3 conversion — dual benefit"
    ],
    safetyNote: "Thyroid storm with atrial fibrillation and hypotension may require cardioversion — prepare for electrical cardioversion if rate control fails",
    distractorRationales: [
      "Pheochromocytoma presents with paroxysmal hypertension, not the sustained hyperthermia and known thyroid history seen here",
      "Serotonin syndrome requires serotonergic medication exposure — not present in this patient's history",
      "Malignant hyperthermia occurs in response to volatile anesthetics or succinylcholine — not spontaneously"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 72-year-old male with an LVAD (left ventricular assist device) presents to the ED with altered mental status. The LVAD controller shows a low-flow alarm. His wife reports the device has been alarming for 30 minutes. Traditional blood pressure measurement with an automated cuff shows 'error — unable to read.' What should the nurse understand about vital sign assessment in LVAD patients?",
    options: [
      "The automated BP cuff is malfunctioning and should be replaced with another device",
      "LVAD patients have continuous (non-pulsatile) flow, so traditional BP cuffs cannot detect a pulse — use a manual BP cuff with a Doppler to measure the mean arterial pressure as a single number",
      "LVAD patients do not need blood pressure monitoring because the device controls their hemodynamics automatically",
      "Call the LVAD coordinator and wait for instructions before taking any vital signs"
    ],
    correctAnswer: 1,
    rationaleLong: "Left ventricular assist devices (LVADs), particularly the current generation of continuous-flow devices (HeartMate 3, HeartWare HVAD), create non-pulsatile or minimally pulsatile blood flow. Unlike the natural heart which generates pulsatile pressure waves (systolic and diastolic), continuous-flow LVADs propel blood using a rapidly spinning impeller that creates steady, laminar flow. This has critical implications for vital sign assessment: (1) BLOOD PRESSURE — Automated oscillometric BP cuffs measure BP by detecting pulsatile oscillations in the cuff pressure. With minimal or no pulsatility, the machine cannot detect these oscillations and displays an error. The correct technique is: apply a manual BP cuff and inflate above the expected MAP, then use a handheld Doppler probe over the brachial artery while slowly deflating the cuff. The pressure at which the Doppler signal first appears is the MAP (mean arterial pressure), recorded as a single number (e.g., 'MAP 75 by Doppler'). Target MAP is typically 70-90 mmHg. MAP >90 mmHg increases afterload against which the pump must work, reducing flow and risking hemorrhagic stroke; (2) PULSE — Many LVAD patients will not have a palpable pulse. The absence of a pulse does NOT mean the patient is in cardiac arrest; (3) PULSE OXIMETRY — May not function reliably due to minimal pulsatility. Use arterial blood gas for accurate SpO2; (4) CARDIAC ARREST ASSESSMENT — Cannot use pulse check alone. If the LVAD patient is unresponsive, assess for other signs: breathing, responsiveness, and check the LVAD controller for alarms and flow parameters. The low-flow alarm in this patient indicates either pump malfunction (thrombosis, mechanical failure), hypovolemia (reduced preload to the pump), arrhythmia (RV failure from arrhythmia reduces blood flow to the LV and therefore the LVAD), or increased afterload (hypertension). The emergency nurse should: assess the controller display (flow, speed, power, pulsatility index), check Doppler MAP, obtain a 12-lead ECG, basic labs including LDH and free hemoglobin (elevated in pump thrombosis), and contact the LVAD team. NEVER turn off the LVAD.",
    learningObjective: "Perform vital sign assessment in LVAD patients using Doppler blood pressure technique and understand non-pulsatile flow physiology",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "No pulse ≠ cardiac arrest in LVAD patients. No BP reading ≠ equipment failure. These patients have continuous flow — assess differently.",
    clinicalPearls: [
      "LVAD BP: use manual cuff + handheld Doppler — record the single number where Doppler signal appears as the MAP",
      "Target LVAD MAP: 70-90 mmHg — high MAP increases afterload and reduces pump flow",
      "NEVER turn off an LVAD — even in cardiac arrest, the LVAD provides critical perfusion"
    ],
    safetyNote: "Do not perform chest compressions on LVAD patients unless the LVAD is confirmed non-functional — compressions can dislodge the cannulae causing fatal hemorrhage",
    distractorRationales: [
      "The automated cuff is working correctly — it cannot read non-pulsatile flow by design, not due to malfunction",
      "LVAD patients absolutely require BP monitoring — uncontrolled hypertension is a leading cause of LVAD-related complications",
      "Waiting for the LVAD coordinator is appropriate for complex management questions but not for initial assessment — the ED nurse must be able to obtain vital signs immediately"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 25-year-old female presents to the ED with anaphylaxis after a bee sting. She received epinephrine 0.3 mg IM in the field by EMS. Upon arrival, her symptoms have improved: BP 110/70, HR 100, no stridor, and mild urticaria remains. She feels much better and requests discharge. What is the appropriate observation period and why?",
    options: [
      "She can be discharged immediately since she responded to epinephrine",
      "Minimum 4-6 hours observation (some guidelines recommend up to 8-12 hours) due to the risk of biphasic anaphylaxis — a recurrence of symptoms hours after initial resolution",
      "24-hour ICU admission is mandatory for all anaphylaxis patients",
      "2-hour observation is sufficient if the initial response to epinephrine was good"
    ],
    correctAnswer: 1,
    rationaleLong: "All patients who have experienced anaphylaxis require a minimum observation period of 4-6 hours (with some guidelines recommending up to 8-12 hours for severe reactions) due to the risk of biphasic anaphylaxis. Biphasic anaphylaxis is a recurrence of anaphylactic symptoms that occurs after apparent complete resolution of the initial episode, without re-exposure to the allergen. It occurs in approximately 5-20% of anaphylaxis cases, with the second phase typically occurring 1-72 hours after the initial reaction (most commonly within 8-10 hours). The second phase can be as severe as or more severe than the initial reaction, including cardiovascular collapse and death. Risk factors for biphasic reactions include: (1) Severe initial reaction requiring multiple doses of epinephrine; (2) Delayed administration of epinephrine; (3) Wide pulse pressure during the initial reaction; (4) Unknown or unavoidable triggers; (5) History of previous biphasic reactions. During the observation period, the emergency nurse should: (1) Continuous cardiac monitoring for at least the first 2 hours; (2) IV access maintained throughout the observation period; (3) Serial vital signs every 30-60 minutes; (4) Monitor for recurrence of any symptoms: urticaria, angioedema, wheezing, stridor, hypotension, tachycardia, GI symptoms; (5) Ensure epinephrine is immediately available at bedside. At discharge, the patient should receive: (1) Epinephrine auto-injector prescription (EpiPen or equivalent) — prescribe at least 2 devices and educate on proper use; (2) Action plan for future reactions; (3) Referral to an allergist for evaluation and potential desensitization; (4) Oral medications: antihistamines (H1 + H2 blockers) for 3-5 days and consideration of a short course of oral corticosteroids (prednisone 40-60 mg daily for 3-5 days), though evidence for steroids preventing biphasic reactions is limited; (5) Medical alert bracelet recommendation; (6) Clear return precautions: return immediately for ANY recurrence of symptoms. Immediate discharge is dangerous because biphasic reactions can occur and be fatal without prompt treatment. Conversely, mandatory 24-hour ICU admission is unnecessarily resource-intensive for most uncomplicated anaphylaxis that responds to initial treatment.",
    learningObjective: "Apply the appropriate observation period after anaphylaxis and educate patients on biphasic reaction risk and discharge requirements",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Feeling better after epinephrine does NOT mean the episode is over — biphasic anaphylaxis occurs in 5-20% of cases, hours after apparent resolution",
    clinicalPearls: [
      "Biphasic anaphylaxis occurs in 5-20% of cases — typically within 8-10 hours of the initial reaction",
      "Prescribe at least 2 epinephrine auto-injectors at discharge — one may fail or a second dose may be needed",
      "The second phase of biphasic anaphylaxis can be MORE severe than the initial reaction"
    ],
    safetyNote: "Never discharge an anaphylaxis patient without an epinephrine auto-injector prescription and clear instructions to return immediately for any symptom recurrence",
    distractorRationales: [
      "Immediate discharge ignores the 5-20% risk of biphasic anaphylaxis — this is a known and preventable cause of death",
      "24-hour ICU admission is excessive for uncomplicated anaphylaxis that responds to initial treatment",
      "2-hour observation is insufficient — most biphasic reactions occur 4-10 hours after the initial event"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 68-year-old male with a history of atrial fibrillation on warfarin presents to the ED with acute-onset right leg pain, pallor, and absence of pulses distal to the right groin. The leg is cold and mottled. His INR is 1.1 (subtherapeutic). What is the diagnosis, and what are the '6 Ps' the nurse should assess?",
    options: [
      "Deep vein thrombosis — assess for Homan's sign, calf tenderness, and leg circumference",
      "Acute arterial occlusion (acute limb ischemia) — the 6 Ps are Pain, Pallor, Pulselessness, Paresthesias, Paralysis, and Poikilothermia (coolness) — this is a vascular emergency",
      "Peripheral arterial disease with chronic claudication — assess ankle-brachial index",
      "Compartment syndrome — assess the 5 Ps of compartment syndrome"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has acute arterial occlusion (acute limb ischemia — ALI) of the right lower extremity, most likely from an embolus originating from the left atrial appendage in the setting of atrial fibrillation with subtherapeutic anticoagulation (INR 1.1 on warfarin). The atrial fibrillation causes blood stasis in the left atrial appendage, promoting thrombus formation. When anticoagulation is subtherapeutic, these thrombi can embolize, traveling through the arterial system to lodge at arterial bifurcations (most commonly the femoral bifurcation). The 6 Ps of acute limb ischemia are: (1) PAIN — sudden onset, severe, often described as the worst pain the patient has ever experienced, usually distal to the occlusion; (2) PALLOR — the limb appears white/pale due to absent arterial blood flow, progressing to mottled/cyanotic as ischemia worsens; (3) PULSELESSNESS — absent pulses distal to the occlusion (in this case, absent femoral, popliteal, dorsalis pedis, and posterior tibial pulses on the right); (4) PARESTHESIAS — numbness and tingling from peripheral nerve ischemia, often the first neurological sign; (5) PARALYSIS — inability to move the affected limb, indicates severe ischemia affecting motor nerves and muscle, and is an ominous sign suggesting non-viable tissue; (6) POIKILOTHERMIA — the limb becomes cold to touch, reflecting the absence of warm arterial blood flow. The limb assumes the ambient temperature. Acute limb ischemia is a surgical/interventional emergency — tissue viability is time-dependent. The 'golden window' for limb salvage is approximately 6 hours from symptom onset, after which irreversible muscle necrosis, nerve damage, and eventual limb loss occur. Emergency nursing priorities: (1) Immediate vascular surgery consultation; (2) IV heparin anticoagulation (unless contraindicated) to prevent thrombus propagation; (3) Position the limb in a dependent position (below the heart) to maximize gravity-assisted arterial perfusion; (4) Avoid compression, elevation, or external warming of the limb; (5) Mark the level of pallor/pulse deficit to track progression; (6) Prepare for either surgical embolectomy (Fogarty catheter thrombectomy) or catheter-directed thrombolysis. After reperfusion, monitor for reperfusion syndrome — similar to crush injury, the ischemic limb releases potassium, myoglobin, and acidotic metabolites into the systemic circulation when blood flow is restored.",
    learningObjective: "Diagnose acute limb ischemia using the 6 Ps and initiate emergent vascular consultation within the limb salvage window",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Paralysis is the most ominous of the 6 Ps — it indicates severe ischemia with likely irreversible damage. Time to intervention is critical.",
    clinicalPearls: [
      "6 Ps of ALI: Pain, Pallor, Pulselessness, Paresthesias, Paralysis, Poikilothermia",
      "Atrial fibrillation with subtherapeutic anticoagulation is the most common cause of peripheral arterial embolism",
      "Golden window for limb salvage is approximately 6 hours — after this, irreversible tissue death occurs"
    ],
    safetyNote: "Do NOT elevate the ischemic limb — keep it dependent (below heart level) to maximize gravity-assisted perfusion",
    distractorRationales: [
      "DVT causes a swollen, warm, painful leg — the opposite of the cold, pale, pulseless limb seen in arterial occlusion",
      "Chronic PAD causes claudication with exertion — not sudden-onset acute ischemia at rest",
      "Compartment syndrome has intact proximal pulses (compartment pressure affects the microvasculature, not the major arteries)"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 35-year-old male presents to the ED after a witnessed cardiac arrest at a gym. Bystanders performed CPR and used an AED, which delivered one shock with ROSC achieved after 8 minutes. He is intubated with GCS 3T. His initial post-ROSC ECG shows ST elevation in V1-V4. What are the two simultaneous priorities for this patient?",
    options: [
      "CT head to rule out stroke and lumbar puncture to rule out meningitis",
      "Emergent cardiac catheterization for STEMI AND targeted temperature management (TTM) — both should be initiated simultaneously, not sequentially",
      "Therapeutic hypothermia alone — cardiac catheterization should be delayed until neurological status improves",
      "Induced coma with propofol and observation in the ICU for 72 hours before any intervention"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient requires two simultaneous, equally important interventions: emergent cardiac catheterization for the STEMI and initiation of targeted temperature management (TTM) for neuroprotection. These should proceed in PARALLEL, not sequentially. STEMI MANAGEMENT: The ST elevation in V1-V4 (anterior leads) indicates an acute anterior STEMI, likely from LAD (left anterior descending) artery occlusion, which was the probable cause of his cardiac arrest. Current guidelines recommend emergent cardiac catheterization and PCI for all post-cardiac arrest patients with STEMI, regardless of neurological status. The cath lab team should not delay because the patient is comatose — early revascularization improves both cardiac and neurological outcomes. TTM can be initiated and maintained during and after the catheterization procedure; TARGETED TEMPERATURE MANAGEMENT: TTM (maintaining core temperature 32-36°C for at least 24 hours) is recommended for all comatose post-cardiac arrest patients to reduce hypoxic-ischemic brain injury. The mechanism: controlled hypothermia reduces cerebral metabolic rate (6-10% per degree Celsius below 37°C), decreases excitotoxic neurotransmitter release, reduces free radical production, attenuates the post-ischemic inflammatory cascade, and preserves the blood-brain barrier. Cooling should begin as soon as possible after ROSC. Methods include cold IV saline (4°C, 30 mL/kg), surface cooling devices (Arctic Sun), and endovascular cooling catheters (Thermogard). During TTM, the nurse should: (1) Monitor core temperature continuously (esophageal, bladder, or PA catheter thermistor); (2) Manage shivering aggressively (shivering increases metabolic demand and generates heat, counteracting cooling — treat with sedation, neuromuscular blockade if needed, buspirone, and surface counter-warming to trick skin thermoreceptors); (3) Monitor for complications of hypothermia: bradycardia, coagulopathy, electrolyte shifts (potassium and magnesium decrease during cooling and rebound during rewarming), hyperglycemia, and increased infection risk; (4) Rewarm slowly at 0.25-0.5°C per hour after the cooling period; (5) Avoid hyperthermia (>37.5°C) for at least 72 hours post-ROSC — fever is independently associated with worse neurological outcomes.",
    learningObjective: "Implement simultaneous cardiac catheterization and targeted temperature management in post-cardiac arrest STEMI patients",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Do NOT delay cardiac catheterization because the patient is comatose — PCI and TTM should proceed simultaneously",
    clinicalPearls: [
      "Post-cardiac arrest STEMI: cath lab AND TTM simultaneously — do not delay one for the other",
      "TTM reduces cerebral metabolic rate 6-10% per degree Celsius — every degree matters for neuroprotection",
      "Rewarm slowly at 0.25-0.5°C/hr — rapid rewarming causes rebound cerebral edema and hemodynamic instability"
    ],
    safetyNote: "Aggressively prevent hyperthermia (>37.5°C) for at least 72 hours post-ROSC — fever independently worsens neurological outcomes",
    distractorRationales: [
      "CT head and LP are not the priority — the STEMI is the likely cause of arrest and requires immediate intervention",
      "Delaying catheterization for neurological recovery misses the time-sensitive window for myocardial salvage",
      "Induced coma alone without addressing the underlying STEMI leaves the coronary artery occluded — ongoing ischemia and re-arrest risk"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 42-year-old female with a history of IV drug use presents with fever of 39.5°C, a new holosystolic murmur heard best at the left lower sternal border, splinter hemorrhages in her nails, and painful erythematous nodules on her finger pads. Blood cultures are drawn. She becomes hypotensive with BP 78/40 and HR 130. What is the diagnosis and the immediate concern?",
    options: [
      "Rheumatic fever with carditis — start aspirin and penicillin",
      "Acute infective endocarditis with septic shock — the immediate concern is acute valvular regurgitation causing cardiogenic shock, and potential for septic emboli to the brain, lungs, spleen, and kidneys",
      "Systemic lupus erythematosus with Libman-Sacks endocarditis — start corticosteroids",
      "Drug-induced vasculitis — stop the offending drug and observe"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has acute infective endocarditis (IE) in the setting of IV drug use — the most common risk factor for IE in younger patients. The classic findings present include: (1) Fever — present in >90% of IE cases; (2) New cardiac murmur — the holosystolic murmur at the left lower sternal border suggests tricuspid regurgitation (IV drug use-associated endocarditis most commonly affects the TRICUSPID valve because injected bacteria enter the venous circulation and first contact the right-sided valves) or mitral regurgitation; (3) Splinter hemorrhages — linear, red-brown streaks under the nails caused by microemboli to the nail bed capillaries; (4) Osler nodes — the painful erythematous nodules on finger pads, caused by immune complex deposition or septic microemboli. The patient is now in shock, which in IE can be multifactorial: SEPTIC SHOCK from overwhelming bloodstream infection AND CARDIOGENIC SHOCK from acute valvular destruction. Vegetations on the valve leaflets destroy valve tissue, causing acute regurgitation. If the mitral or aortic valve is involved, acute regurgitation causes sudden volume overload of the left ventricle, pulmonary edema, and cardiogenic shock. Even tricuspid regurgitation, if severe, can cause right heart failure. The immediate concern is that IE causes septic emboli — fragments of vegetation break off and travel to end-organ arteries: (1) Brain — stroke, mycotic aneurysm, brain abscess; (2) Lungs — septic pulmonary emboli (especially with right-sided IE); (3) Spleen — splenic abscess or infarction; (4) Kidneys — renal infarction, glomerulonephritis; (5) Skin — Janeway lesions (painless erythematous macules on palms and soles). Emergency nursing priorities: (1) At least 3 sets of blood cultures from different sites before antibiotics; (2) Empiric IV antibiotics (vancomycin + ceftriaxone for native valve, or vancomycin + gentamicin + rifampin for prosthetic valve); (3) Emergent echocardiography (TEE is more sensitive than TTE for detecting vegetations); (4) Hemodynamic support; (5) Cardiothoracic surgery consultation — patients with acute heart failure from valvular regurgitation, large vegetations (>10 mm), or persistent sepsis despite appropriate antibiotics may require emergent valve surgery.",
    learningObjective: "Diagnose acute infective endocarditis, recognize its embolic complications, and initiate emergent antibiotic therapy and surgical consultation",
    blueprintCategory: "Shock",
    subtopic: "septic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "IE causes TWO types of shock simultaneously — septic (from bacteremia) AND cardiogenic (from acute valve destruction). Treat BOTH.",
    clinicalPearls: [
      "IV drug use endocarditis typically affects the TRICUSPID valve — bacteria enter venous circulation and hit right-sided valves first",
      "Osler nodes (painful, finger pads) vs. Janeway lesions (painless, palms/soles) — both are stigmata of IE",
      "Draw 3 sets of blood cultures from different sites before antibiotics — this increases diagnostic yield to >95%"
    ],
    safetyNote: "Perform a thorough neurological exam before anticoagulation — mycotic aneurysms from IE can rupture with anticoagulation, causing fatal intracranial hemorrhage",
    distractorRationales: [
      "Rheumatic fever occurs weeks after streptococcal pharyngitis and does not cause acute septic shock with embolic phenomena",
      "Libman-Sacks endocarditis (SLE) produces sterile vegetations — does not cause septic shock or embolic complications",
      "Drug-induced vasculitis does not cause new cardiac murmurs or the classic embolic stigmata of IE"
    ],
    lessonPath: "/emergency/lessons/septic-shock"
  },
  {
    stem: "A 58-year-old male is being resuscitated for septic shock. His lactate level was initially 6.2 mmol/L. After 3 hours of treatment with 30 mL/kg crystalloid and norepinephrine, his repeat lactate is 5.8 mmol/L. His MAP is now 67 mmHg. The attending physician asks the nurse to evaluate the lactate clearance. Is the resuscitation adequate?",
    options: [
      "Yes — the MAP is above 65 mmHg which is the only target that matters",
      "No — lactate clearance of only 6.5% at 3 hours is inadequate; the target is ≥10-20% clearance every 2 hours, suggesting ongoing tissue hypoperfusion despite achieving MAP goals",
      "Yes — any decrease in lactate confirms adequate resuscitation",
      "Lactate levels are unreliable in sepsis and should not guide resuscitation decisions"
    ],
    correctAnswer: 1,
    rationaleLong: "Lactate clearance is one of the most important dynamic markers of resuscitation adequacy in septic shock. The Surviving Sepsis Campaign guidelines recommend targeting lactate clearance of ≥10-20% every 2 hours as a marker of adequate tissue perfusion. This patient's lactate decreased from 6.2 to 5.8 mmol/L over 3 hours — a clearance of only 6.5% [(6.2-5.8)/6.2 × 100], which is below the target and suggests that resuscitation is INADEQUATE despite achieving the MAP goal of ≥65 mmHg. Understanding lactate in sepsis: Lactate is produced primarily by anaerobic glycolysis when tissue oxygen delivery is insufficient to meet metabolic demand (type A hyperlactatemia). In sepsis, lactate elevation results from: (1) Macrocirculatory failure — inadequate cardiac output and blood pressure cause global tissue hypoperfusion; (2) Microcirculatory dysfunction — even with adequate MAP, sepsis causes endothelial dysfunction, capillary obstruction, and arteriovenous shunting that prevent oxygen from reaching tissue mitochondria; (3) Increased glycolysis driven by catecholamines and inflammatory mediators. This is precisely why MAP alone is insufficient — a MAP ≥65 mmHg may still be associated with significant microcirculatory dysfunction and tissue hypoperfusion. Lactate clearance provides a dynamic assessment of whether the tissues are actually receiving adequate oxygen delivery, not just whether the blood pressure looks acceptable on the monitor. When lactate clearance is inadequate despite MAP goals being met, the nurse should collaborate with the physician to: (1) Assess volume status — does the patient need more fluid? (passive leg raise test can assess fluid responsiveness without administering additional fluid); (2) Optimize cardiac output — is dobutamine needed for septic cardiomyopathy? Obtain a bedside echo; (3) Evaluate source control — is there an uncontrolled source of infection (abscess, perforated viscus, necrotizing fasciitis)? Source control failure is the most common reason for persistent lactic acidosis; (4) Consider additional hemodynamic monitoring (central venous oxygen saturation, cardiac output monitoring); (5) Rule out non-perfusion causes of lactate elevation (mesenteric ischemia, seizures, medication effects). Studies have shown that failure to clear lactate by ≥10% within the first 6 hours of resuscitation is associated with significantly higher mortality.",
    learningObjective: "Calculate lactate clearance as a marker of resuscitation adequacy and recognize when MAP targets alone are insufficient",
    blueprintCategory: "Shock",
    subtopic: "septic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "MAP ≥65 mmHg does NOT guarantee adequate tissue perfusion — microcirculatory dysfunction can persist despite acceptable blood pressure. Track lactate clearance.",
    clinicalPearls: [
      "Target lactate clearance: ≥10-20% every 2 hours — failure to clear is associated with increased mortality",
      "Lactate clearance = (initial - repeat) / initial × 100 — calculate this at every reassessment",
      "MAP goals and lactate clearance are COMPLEMENTARY targets — use both, not just one"
    ],
    safetyNote: "Persistent lactic acidosis despite MAP goals should trigger re-evaluation of source control — uncontrolled infection is the most common cause of resuscitation failure",
    distractorRationales: [
      "MAP ≥65 is a minimum threshold but does not guarantee tissue perfusion — lactate clearance is a more direct measure of cellular oxygenation",
      "Any decrease in lactate is not sufficient — the rate of clearance matters and must meet minimum thresholds",
      "Lactate is one of the most validated biomarkers in sepsis resuscitation and is explicitly recommended by SSC guidelines"
    ],
    lessonPath: "/emergency/lessons/septic-shock"
  },
  {
    stem: "A 40-year-old female with no medical history presents with sudden-onset severe dyspnea, pleuritic chest pain, and hemoptysis. She returned from a 14-hour international flight 3 days ago. Vitals: HR 130, BP 80/50, RR 32, SpO2 82%. ECG shows right axis deviation with S1Q3T3 pattern and new right bundle branch block. What is the diagnosis and the definitive treatment for this hemodynamically unstable patient?",
    options: [
      "Community-acquired pneumonia — IV antibiotics and supplemental oxygen",
      "Massive pulmonary embolism with obstructive shock — systemic thrombolysis (alteplase 100 mg IV over 2 hours) is the definitive treatment for hemodynamically unstable PE",
      "Spontaneous pneumothorax — needle decompression followed by chest tube",
      "Acute pericarditis with tamponade — pericardiocentesis"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has a massive (high-risk) pulmonary embolism causing obstructive shock. The clinical picture is classic: (1) Risk factor: prolonged immobility from a 14-hour flight (venous stasis promotes DVT formation); (2) Symptoms: sudden dyspnea, pleuritic chest pain, and hemoptysis (pulmonary infarction from the PE); (3) Hemodynamic instability: tachycardia, hypotension, tachypnea, and severe hypoxemia — indicating massive PE with right ventricular failure; (4) ECG findings: the S1Q3T3 pattern (deep S wave in lead I, Q wave and inverted T wave in lead III) is the classic ECG finding of acute right heart strain from PE, though it is neither sensitive nor specific. New right bundle branch block indicates acute RV dilation stretching the right bundle. The massive PE obstructs pulmonary blood flow, dramatically increasing pulmonary vascular resistance. The thin-walled right ventricle, which normally pumps against low resistance, acutely fails when faced with this sudden afterload increase. RV dilation shifts the interventricular septum leftward, compressing the left ventricle and reducing LV filling (interventricular interdependence), further decreasing cardiac output and causing systemic hypotension — obstructive shock. Systemic thrombolysis is the definitive treatment for hemodynamically unstable (massive) PE. The standard regimen is alteplase (tPA) 100 mg IV infused over 2 hours. Thrombolytics work by converting plasminogen to plasmin, which dissolves the fibrin clot. The benefits of thrombolysis in massive PE include: rapid clot dissolution restoring pulmonary blood flow, reduction in pulmonary artery pressure, improved RV function, and improved survival. The major risk is bleeding, including intracranial hemorrhage (approximately 2-3% incidence). The decision to lyse should not be delayed for CT angiography if the clinical picture is clear and the patient is in extremis — bedside echocardiogram showing RV dilation and dysfunction is sufficient to support the decision. Alternatives if thrombolysis is contraindicated or fails: surgical embolectomy, catheter-directed therapy, or ECMO as a bridge.",
    learningObjective: "Diagnose massive pulmonary embolism causing obstructive shock and initiate systemic thrombolysis as definitive treatment",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do NOT delay thrombolysis for CT angiography in hemodynamically unstable PE — bedside echo showing RV dysfunction is sufficient to initiate treatment",
    clinicalPearls: [
      "S1Q3T3 is the classic ECG pattern of PE but is neither sensitive nor specific — absence does not exclude PE",
      "Massive PE = hemodynamically unstable PE = systemic thrombolysis is indicated",
      "tPA 100 mg over 2 hours — the standard thrombolysis regimen for PE"
    ],
    safetyNote: "Bleeding risk from thrombolysis is approximately 2-3% for ICH — but mortality from untreated massive PE exceeds 50%, making the risk-benefit calculation strongly favor treatment",
    distractorRationales: [
      "Pneumonia does not cause acute right heart strain on ECG or hemoptysis with this acute presentation pattern",
      "Pneumothorax would show absent breath sounds and hyperresonance — not the ECG findings of right heart strain",
      "Tamponade causes global low voltage and electrical alternans on ECG — not S1Q3T3 and RBBB"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 78-year-old nursing home resident with dementia presents to the ED with fever, tachycardia, and hypotension. She has a stage IV pressure ulcer on her sacrum with purulent drainage and surrounding cellulitis. Wound culture grows MRSA. Despite 30 mL/kg crystalloid, she remains hypotensive. What antibiotic should be initiated for MRSA septic shock, and what is the vasopressor of choice?",
    options: [
      "Oral clindamycin and dopamine infusion",
      "IV vancomycin (with trough goal 15-20 mcg/mL or AUC/MIC ≥400) and norepinephrine as the first-line vasopressor",
      "IV nafcillin and phenylephrine infusion",
      "IV cephalexin and dobutamine infusion"
    ],
    correctAnswer: 1,
    rationaleLong: "This nursing home resident has septic shock from an infected stage IV pressure ulcer caused by MRSA (methicillin-resistant Staphylococcus aureus). The management follows Surviving Sepsis Campaign guidelines with MRSA-specific antibiotic selection. ANTIBIOTIC: IV vancomycin is the first-line antibiotic for serious MRSA infections including septic shock. Vancomycin is a glycopeptide antibiotic that inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors. Dosing in serious infections targets pharmacokinetic/pharmacodynamic goals — the current recommendation (updated 2020 guidelines) is to target AUC/MIC ≥400 (area under the concentration-time curve divided by the minimum inhibitory concentration) rather than the older trough-based monitoring (15-20 mcg/mL). The loading dose is 25-30 mg/kg IV based on actual body weight, followed by maintenance dosing guided by Bayesian AUC monitoring. For septic shock, vancomycin should be administered within the first hour of recognition. Alternative MRSA agents include linezolid (better tissue penetration for soft tissue infections) and daptomycin (not for pneumonia — inactivated by surfactant). VASOPRESSOR: Norepinephrine is the first-line vasopressor for septic shock per SSC guidelines. Norepinephrine is a potent alpha-1 agonist (vasoconstriction) with modest beta-1 activity (inotropic support). It increases MAP primarily through vasoconstriction while maintaining or slightly improving cardiac output, unlike pure vasoconstrictors (phenylephrine) which can reduce cardiac output. The typical starting dose is 5-10 mcg/min, titrated to MAP ≥65 mmHg. Norepinephrine was shown to be superior to dopamine in the SOAP II trial — dopamine was associated with more arrhythmias and higher mortality in cardiogenic shock patients (though overall mortality was similar in the full study population). Nafcillin and cephalexin are beta-lactam antibiotics that are ineffective against MRSA — the 'MR' in MRSA literally means methicillin-resistant, and this resistance extends to all beta-lactams. Using these agents would be a critical error resulting in untreated MRSA sepsis. Source control is equally important — the infected stage IV pressure ulcer requires debridement of necrotic tissue and possibly negative-pressure wound therapy.",
    learningObjective: "Select appropriate MRSA-directed antibiotic therapy in septic shock and identify norepinephrine as the first-line vasopressor per SSC guidelines",
    blueprintCategory: "Shock",
    subtopic: "septic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "MRSA is resistant to ALL beta-lactams (penicillins, cephalosporins, carbapenems except ceftaroline) — never use nafcillin or cephalexin for MRSA",
    clinicalPearls: [
      "Vancomycin dosing: load 25-30 mg/kg, target AUC/MIC ≥400 (preferred over trough monitoring per 2020 guidelines)",
      "Norepinephrine is SSC first-line vasopressor — superior to dopamine (SOAP II trial: fewer arrhythmias)",
      "Source control in infected pressure ulcers: debridement of necrotic tissue is essential alongside antibiotics"
    ],
    safetyNote: "Rapid vancomycin infusion can cause 'red man syndrome' (histamine-mediated flushing, not an allergy) — infuse over at least 1 hour, or 2 hours for doses >1 gram",
    distractorRationales: [
      "Oral antibiotics are inappropriate for septic shock — IV administration is mandatory for adequate drug levels",
      "Nafcillin is a beta-lactam and is ineffective against MRSA — using it would leave the infection untreated",
      "Cephalexin is an oral cephalosporin ineffective against MRSA, and dobutamine is not a vasopressor — it is an inotrope"
    ],
    lessonPath: "/emergency/lessons/septic-shock"
  },
  {
    stem: "A 30-year-old male presents to the ED in acute anaphylactic shock after eating shellfish. He has severe laryngeal edema with stridor, diffuse urticaria, BP 60/30, and HR 150. The nurse administers epinephrine 0.3 mg IM to the anterolateral thigh. After 5 minutes, there is minimal improvement. What is the next step?",
    options: [
      "Administer diphenhydramine 50 mg IV and wait for it to take effect",
      "Repeat epinephrine 0.3 mg IM every 5-15 minutes — if no response after 2-3 IM doses, prepare IV epinephrine infusion and advanced airway management",
      "Switch to subcutaneous epinephrine for better absorption",
      "Administer methylprednisolone 125 mg IV as the next priority"
    ],
    correctAnswer: 1,
    rationaleLong: "In anaphylactic shock that is not responding to initial IM epinephrine, the next step is to REPEAT IM epinephrine. Epinephrine is the ONLY first-line medication for anaphylaxis — there is no substitute, and no other medication should be prioritized over repeat dosing. Epinephrine 0.3-0.5 mg IM (1:1,000 concentration, or 1 mg/mL) can be repeated every 5-15 minutes as needed. The anterolateral thigh (vastus lateralis) is the preferred injection site because it provides the fastest and highest peak absorption compared to the deltoid or subcutaneous routes. If the patient fails to respond after 2-3 IM doses, the next escalation is IV epinephrine. IV epinephrine for anaphylaxis is given as a DILUTE INFUSION — NOT as an IV push of 1:1,000 (this concentration given IV can cause fatal arrhythmias and hypertensive crisis). The dilution for IV infusion: mix 1 mg epinephrine in 250 mL NS (concentration 4 mcg/mL) and infuse at 2-10 mcg/min, titrated to blood pressure and heart rate. Alternatively, in extremis, epinephrine 1:10,000 (0.1 mg/mL — the cardiac arrest concentration) can be given in 50-100 mcg IV boluses with continuous monitoring. Simultaneously, this patient needs advanced airway management — the severe laryngeal edema with stridor indicates the airway is critically compromised. Prepare for endotracheal intubation (which may be extremely difficult due to edema) and have surgical cricothyrotomy equipment at bedside as a backup. Additional measures (all secondary to epinephrine): (1) IV fluid resuscitation — 1-2 L NS bolus for hypotension (anaphylaxis causes massive vasodilation and third-spacing); (2) Albuterol nebulization for bronchospasm; (3) H1 blocker (diphenhydramine 50 mg IV) and H2 blocker (famotidine 20 mg IV); (4) Corticosteroids (methylprednisolone 125 mg IV) — these take 4-6 hours to work and DO NOT treat the acute episode, but may help prevent biphasic reactions. Diphenhydramine and steroids are ADJUNCT therapies — they should NEVER delay or replace epinephrine.",
    learningObjective: "Manage refractory anaphylaxis with repeat IM epinephrine and escalation to IV epinephrine infusion when IM dosing fails",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER give epinephrine 1:1,000 (1 mg/mL) IV push — this can cause fatal cardiac arrhythmias. IV epinephrine for anaphylaxis must be DILUTED and given as an infusion.",
    clinicalPearls: [
      "Epinephrine IM can be repeated every 5-15 minutes — there is no maximum number of doses in life-threatening anaphylaxis",
      "IV epinephrine for anaphylaxis: 1 mg in 250 mL NS = 4 mcg/mL, infuse at 2-10 mcg/min",
      "Antihistamines and steroids are ADJUNCTS — they do not treat the acute life-threatening manifestations of anaphylaxis"
    ],
    safetyNote: "Subcutaneous epinephrine is NEVER recommended for anaphylaxis — absorption is too slow and unreliable due to peripheral vasoconstriction in shock",
    distractorRationales: [
      "Diphenhydramine treats urticaria and itching but does NOT reverse bronchospasm, laryngeal edema, or cardiovascular collapse — it is never a substitute for epinephrine",
      "Subcutaneous epinephrine has slower and less reliable absorption than IM — it is inferior and not recommended",
      "Corticosteroids take 4-6 hours to work and have no effect on the acute phase of anaphylaxis — they should not delay repeat epinephrine"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 65-year-old male with a history of heart failure (EF 20%) presents in acute cardiogenic shock. His PA catheter shows: CVP 22 mmHg, PCWP 28 mmHg, CI 1.6 L/min/m², and SVR 2,400 dynes·s/cm⁵. What do these hemodynamic values indicate, and what is the appropriate pharmacological support?",
    options: [
      "Volume depletion — administer IV fluid bolus to increase preload",
      "Classic cardiogenic shock profile (elevated filling pressures, low cardiac index, high SVR) — initiate dobutamine or milrinone for inotropic support and consider vasodilator therapy to reduce afterload",
      "Septic shock — start norepinephrine for the low cardiac index",
      "Right ventricular failure — fluid resuscitation and pulmonary vasodilators"
    ],
    correctAnswer: 1,
    rationaleLong: "This PA catheter data demonstrates the classic hemodynamic profile of cardiogenic shock: (1) CVP 22 mmHg (elevated, normal 2-8) — indicates right-sided volume overload and elevated right atrial pressure; (2) PCWP 28 mmHg (elevated, normal 6-12) — the pulmonary capillary wedge pressure reflects left atrial pressure and left ventricular end-diastolic pressure. Elevation indicates the failing left ventricle cannot effectively eject its volume, causing backup into the pulmonary vasculature (pulmonary edema occurs when PCWP exceeds 18-20 mmHg); (3) Cardiac Index 1.6 L/min/m² (critically low, normal 2.5-4.0) — indicates severely reduced cardiac pump function. CI below 2.2 indicates cardiogenic shock; below 1.8 is severe; (4) SVR 2,400 dynes·s/cm⁵ (elevated, normal 800-1,200) — the body compensates for low cardiac output by increasing systemic vascular resistance through sympathetic activation and RAAS activation, attempting to maintain blood pressure. However, this increased afterload further impairs the already failing ventricle, creating a vicious cycle. Pharmacological management targets TWO goals: improving contractility and reducing afterload. INOTROPES: Dobutamine (2-20 mcg/kg/min) — beta-1 agonist that increases contractility and heart rate, with beta-2 mediated mild vasodilation (reduces afterload). First-line for cardiogenic shock with adequate blood pressure (systolic >90). Milrinone (0.375-0.75 mcg/kg/min) — phosphodiesterase-3 inhibitor ('inodilator') that increases contractility AND reduces both preload and afterload. Useful when beta-receptor downregulation has occurred from chronic heart failure. Causes more vasodilation than dobutamine — may require concurrent vasopressor support. VASODILATORS: If blood pressure permits (systolic >90), IV nitroglycerin or nitroprusside can reduce preload (venodilation) and afterload (arteriolar dilation), breaking the vicious cycle of high SVR worsening LV function. IV fluid would be HARMFUL — the filling pressures are already critically elevated. Adding more volume would worsen pulmonary edema and further distend the failing ventricle (moving further up the flat portion of the Frank-Starling curve where additional volume provides no additional stroke volume). If the patient is hypotensive (systolic <90), a vasopressor with inotropic properties (norepinephrine or dopamine) may be needed before adding dobutamine.",
    learningObjective: "Interpret PA catheter hemodynamics in cardiogenic shock and select appropriate inotropic and vasodilator therapy",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "High SVR in cardiogenic shock is a COMPENSATORY response — it is NOT beneficial. Afterload reduction (when BP allows) breaks the vicious cycle.",
    clinicalPearls: [
      "Cardiogenic shock hemodynamics: ↑CVP, ↑PCWP, ↓CI, ↑SVR — the opposite of septic shock (↓CVP, ↓PCWP, ↑CI early, ↓SVR)",
      "CI <2.2 with PCWP >18 = cardiogenic shock. CI <1.8 = severe cardiogenic shock",
      "Milrinone works even when beta-receptors are downregulated from chronic heart failure — useful when dobutamine is ineffective"
    ],
    safetyNote: "Never give IV fluid boluses when PCWP is already elevated — additional volume worsens pulmonary edema without improving cardiac output",
    distractorRationales: [
      "Volume depletion would show LOW CVP and LOW PCWP — these are elevated, indicating the heart is already overloaded",
      "Septic shock shows LOW SVR (vasodilation) and HIGH CI (early, hyperdynamic phase) — the opposite of this profile",
      "Isolated RV failure would show elevated CVP but LOW or normal PCWP — this patient has elevated PCWP indicating LV failure"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 22-year-old male is brought to the ED after a stabbing to the left chest at the 5th intercostal space. He is diaphoretic with BP 70/40, HR 140, and JVD. Bedside ultrasound shows a pericardial effusion with right ventricular diastolic collapse. An emergent pericardiocentesis yields 15 mL of non-clotting blood and his BP immediately improves to 100/65. Why did the blood not clot, and what does this confirm?",
    options: [
      "The patient has a coagulation disorder preventing normal clotting",
      "Blood in the pericardial space is defibrinated by cardiac motion and does not clot — non-clotting blood confirms the aspirate is from the pericardial space and not from inadvertent cardiac puncture",
      "The pericardiocentesis needle was coated with anticoagulant",
      "The blood is too diluted with pericardial fluid to form clots"
    ],
    correctAnswer: 1,
    rationaleLong: "Non-clotting blood aspirated during pericardiocentesis is an important diagnostic finding that confirms the blood was obtained from the pericardial space rather than from inadvertent puncture of a cardiac chamber. Blood that enters the pericardial space is rapidly defibrinated by the constant mechanical motion of the beating heart. The rhythmic contraction and relaxation of the myocardium essentially 'whips' the blood, causing fibrin strands to form, separate, and be consumed — similar to how beating whole blood in a bowl will prevent it from clotting. This process consumes the available fibrinogen and fibrin, rendering the remaining blood incapable of forming a stable clot. In contrast, blood obtained by accidentally puncturing the right or left ventricle during pericardiocentesis WILL clot normally because it has not been exposed to the mechanical defibrination process — it is fresh intracardiac blood with intact coagulation factors. This distinction is clinically critical because: if the aspirated blood clots, the operator must consider that the needle may have punctured a cardiac chamber, and aspiration should stop immediately to avoid further cardiac injury. The dramatic hemodynamic improvement after removing only 15 mL of blood illustrates the steep pericardial pressure-volume relationship. The pericardium is a relatively non-compliant fibrous sac. Once it reaches its compliance limit, even small additional volumes cause large increases in intrapericardial pressure. Conversely, removing even 15-20 mL can dramatically reduce the pressure and restore cardiac filling and output. This patient has traumatic hemopericardium from the stab wound — the penetrating injury has lacerated the pericardium and likely the myocardium or a coronary vessel. Pericardiocentesis is a temporizing measure — this patient requires emergent thoracotomy (or sternotomy) for definitive surgical repair of the cardiac injury. The pericardiocentesis buys time for surgical preparation.",
    learningObjective: "Distinguish pericardial blood (non-clotting, defibrinated) from cardiac chamber blood (clotting) during pericardiocentesis",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "If aspirated blood CLOTS during pericardiocentesis — suspect cardiac chamber puncture and stop advancing the needle immediately",
    clinicalPearls: [
      "Pericardial blood does not clot — cardiac motion defibrrinates the blood, consuming fibrinogen",
      "Removing as little as 15-20 mL from the pericardium can dramatically improve hemodynamics — steep pressure-volume curve",
      "Pericardiocentesis is a TEMPORIZING measure in traumatic tamponade — definitive care is surgical repair"
    ],
    safetyNote: "Penetrating chest wounds medial to the nipple line are cardiac injuries until proven otherwise — always perform bedside ultrasound for pericardial effusion",
    distractorRationales: [
      "The patient does not have a coagulation disorder — the non-clotting is a property of pericardial blood, not the patient's clotting system",
      "Pericardiocentesis needles are not coated with anticoagulant — this is not a standard practice",
      "Dilution is not the mechanism — even concentrated pericardial blood does not clot due to mechanical defibrination"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 55-year-old female with type 2 diabetes presents to the ED with confusion, Kussmaul breathing, fruity breath odor, and severe dehydration. Labs: glucose 620 mg/dL, pH 7.08, HCO3 8 mEq/L, K+ 6.1 mEq/L. She is hypotensive with BP 78/42. What is the diagnosis, and what is the correct initial fluid management?",
    options: [
      "Diabetic ketoacidosis — start insulin drip immediately at 0.1 units/kg/hr before any other intervention",
      "Diabetic ketoacidosis with hypovolemic shock — begin aggressive IV normal saline (1-2 liters in the first hour) to restore intravascular volume BEFORE starting insulin",
      "Hyperosmolar hyperglycemic state — start 0.45% half-normal saline immediately",
      "Lactic acidosis from metformin toxicity — start hemodialysis immediately"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has diabetic ketoacidosis (DKA) with concurrent hypovolemic shock. DKA is defined by the triad of: hyperglycemia (glucose >250 mg/dL — this patient has 620), metabolic acidosis (pH <7.3 and HCO3 <18 — this patient has pH 7.08 and HCO3 8, indicating severe DKA), and ketonemia/ketonuria. The fruity breath odor is from acetone (a ketone body) being exhaled. Kussmaul breathing is deep, rapid respiratory pattern that is the body's attempt to compensate for metabolic acidosis by blowing off CO2. The MOST IMPORTANT initial intervention in DKA is aggressive IV fluid resuscitation — NOT insulin. DKA patients are profoundly volume-depleted (average fluid deficit 5-10 liters) due to osmotic diuresis from hyperglycemia. The fluid resuscitation priorities are: (1) FIRST HOUR: 1-2 liters of 0.9% normal saline (NS) — this restores intravascular volume, improves renal perfusion (necessary for glucose excretion), improves tissue perfusion (reduces lactic acid component), and dilutes both glucose and counter-regulatory hormones. In this hypotensive patient, even more aggressive bolusing may be needed; (2) SUBSEQUENT HOURS: continue NS at 250-500 mL/hr, adjusting based on corrected sodium — if corrected sodium is normal or elevated, switch to 0.45% NS; if corrected sodium is low, continue 0.9% NS; (3) WHEN GLUCOSE REACHES 200 mg/dL: add dextrose to IV fluids (D5 0.45% NS) to prevent hypoglycemia while continuing insulin to clear ketones. Insulin should be started AFTER the first 1-2 liters of fluid for several reasons: (1) Insulin drives potassium intracellularly — starting insulin before volume resuscitation can cause life-threatening hypokalemia. If K+ is <3.3, insulin should be HELD until potassium is repleted; (2) Fluid alone will lower glucose by 35-70 mg/dL per hour through dilution and improved renal glucose clearance; (3) Fluid resuscitation improves tissue perfusion, which enhances the effectiveness of subsequently administered insulin. This patient's K+ is 6.1 (hyperkalemia) — but this is misleading. In DKA, acidosis drives potassium out of cells, creating artificially elevated serum levels despite total body potassium DEPLETION. As acidosis is corrected with insulin and fluids, potassium will shift back intracellularly and serum levels will drop rapidly. The nurse must monitor potassium every 1-2 hours and begin potassium replacement when K+ drops below 5.0-5.3 mEq/L.",
    learningObjective: "Prioritize IV fluid resuscitation before insulin in DKA and understand the relationship between acidosis and potassium shifts",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Serum K+ of 6.1 in DKA is FALSELY elevated from acidosis — total body potassium is depleted. K+ will crash when insulin is given. Monitor closely and replace early.",
    clinicalPearls: [
      "FLUIDS FIRST, then insulin in DKA — average fluid deficit is 5-10 liters",
      "Hold insulin if K+ <3.3 mEq/L — insulin drives potassium intracellularly and can cause fatal hypokalemia",
      "DKA hyperkalemia is misleading — total body K+ is depleted due to osmotic diuresis. Replace K+ when <5.0-5.3"
    ],
    safetyNote: "Monitor potassium every 1-2 hours during DKA treatment — the transition from hyperkalemia to hypokalemia can happen rapidly and cause cardiac arrest",
    distractorRationales: [
      "Starting insulin before fluids can cause hypokalemia and cardiovascular collapse — volume resuscitation is the priority",
      "HHS (hyperosmolar hyperglycemic state) typically has glucose >600 with minimal acidosis — this patient has severe acidosis consistent with DKA",
      "Metformin-induced lactic acidosis has a normal glucose and no ketones — this patient has classic DKA findings"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 44-year-old female presents to the ED with high-grade fever, diffuse erythroderma (sunburn-like rash), desquamation of her palms, and hypotension. She reports using a vaginal tampon that has been in place for 3 days. Her labs show elevated creatinine, elevated liver enzymes, and thrombocytopenia. What is the diagnosis, and what is the critical non-pharmacological intervention?",
    options: [
      "Scarlet fever — administer penicillin",
      "Toxic shock syndrome (TSS) — immediately remove the tampon (source control), initiate aggressive fluid resuscitation, and start IV anti-staphylococcal antibiotics with toxin-suppressing agents",
      "Stevens-Johnson syndrome — stop all medications and consult dermatology",
      "Meningococcemia — initiate droplet precautions and IV ceftriaxone"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has menstrual toxic shock syndrome (TSS), a rapidly progressive, life-threatening toxin-mediated illness caused by Staphylococcus aureus (or less commonly, Group A Streptococcus). The clinical criteria include: (1) Fever ≥38.9°C (102°F); (2) Diffuse macular erythroderma (sunburn-like rash); (3) Desquamation 1-2 weeks after onset (particularly palms and soles); (4) Hypotension (systolic ≤90 mmHg); (5) Involvement of ≥3 organ systems — this patient has renal (elevated creatinine), hepatic (elevated liver enzymes), and hematologic (thrombocytopenia) involvement. The pathophysiology involves superantigen toxins (TSST-1 — toxic shock syndrome toxin 1) produced by S. aureus colonizing the tampon. Superantigens bypass normal antigen processing and directly crosslink MHC II molecules on antigen-presenting cells with T-cell receptors, causing massive non-specific T-cell activation. This triggers a cytokine storm (massive release of TNF-alpha, IL-1, IL-2, IL-6, IFN-gamma) causing diffuse capillary leak, vasodilation, and multiorgan dysfunction. The CRITICAL non-pharmacological intervention is immediate REMOVAL OF THE TAMPON — this is source control. The retained tampon provides the environment for S. aureus proliferation and continued toxin production. Removing the tampon eliminates the ongoing source of superantigen and is the single most important mechanical intervention. Pharmacological management: (1) Aggressive IV fluid resuscitation — these patients can require 10-20 liters in the first 24 hours due to massive capillary leak; (2) IV anti-staphylococcal antibiotics: vancomycin (MRSA coverage) PLUS clindamycin. Clindamycin is critical because it is a protein synthesis inhibitor that directly suppresses toxin production — beta-lactam antibiotics (which act on cell wall synthesis) do not inhibit toxin production and may even transiently increase toxin release as bacteria lyse; (3) Vasopressors (norepinephrine) for refractory hypotension; (4) IVIG (intravenous immunoglobulin) may be considered in severe cases — it contains antibodies that can neutralize superantigens. TSS mortality is approximately 3-5% with appropriate treatment but can be much higher with delayed recognition.",
    learningObjective: "Diagnose toxic shock syndrome, perform source control by removing the tampon, and initiate clindamycin for toxin suppression",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Always add CLINDAMYCIN for toxin-mediated infections — it suppresses bacterial toxin production, unlike beta-lactams which only kill bacteria",
    clinicalPearls: [
      "TSS requires ≥3 organ system involvement plus fever, rash, desquamation, and hypotension for diagnosis",
      "Clindamycin suppresses toxin production — essential adjunct in all toxin-mediated staphylococcal/streptococcal infections",
      "TSS patients may require 10-20 L of IV fluid in 24 hours — massive capillary leak from cytokine storm"
    ],
    safetyNote: "Perform a thorough vaginal exam to ensure the entire tampon is removed — retained fragments can perpetuate toxin production",
    distractorRationales: [
      "Scarlet fever is caused by Group A Strep toxins in the setting of pharyngitis — not associated with tampon use or multiorgan failure",
      "Stevens-Johnson syndrome is a drug reaction causing mucocutaneous blistering — not the diffuse sunburn-like rash with tampon association",
      "Meningococcemia presents with petechiae/purpura and meningeal signs — not the diffuse erythroderma pattern"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 58-year-old male with cirrhosis presents to the ED with massive hematemesis. He has a history of esophageal varices. Vitals: BP 70/35, HR 145. The nurse initiates massive transfusion. What medication should be administered immediately to reduce portal pressure and variceal bleeding?",
    options: [
      "Propranolol 40 mg PO for portal pressure reduction",
      "Octreotide 50 mcg IV bolus followed by 50 mcg/hr infusion — a somatostatin analog that reduces splanchnic blood flow and portal pressure",
      "Tranexamic acid 1 g IV to stabilize the clot",
      "Vitamin K 10 mg IV to correct the coagulopathy"
    ],
    correctAnswer: 1,
    rationaleLong: "Acute variceal hemorrhage is a life-threatening emergency with a mortality rate of 15-20% per episode. This patient is in hemorrhagic shock from ruptured esophageal varices — dilated submucosal veins in the esophagus that develop from portal hypertension in cirrhosis. When portal pressure exceeds a hepatic venous pressure gradient (HVPG) of 12 mmHg, varices are at risk of rupture. Octreotide is a synthetic somatostatin analog that should be administered immediately upon suspicion of variceal bleeding. Its mechanism: (1) Reduces splanchnic (mesenteric) blood flow by inhibiting the release of vasodilatory hormones (glucagon, VIP) that maintain splanchnic vasodilation in cirrhosis; (2) Reduces portal venous pressure and portal blood flow; (3) Reduces azygos blood flow (which directly feeds esophageal varices). Dosing: 50 mcg IV bolus followed by a continuous infusion of 50 mcg/hour for 3-5 days. Octreotide reduces the rate of active bleeding, improves the success rate of subsequent endoscopic therapy, and reduces transfusion requirements. The complete management algorithm for acute variceal hemorrhage includes: (1) Airway protection — intubation if massive hematemesis or altered mental status (these patients aspirate blood); (2) Volume resuscitation — be conservative with blood product targets (hemoglobin target 7-8 g/dL, not normal) because over-transfusion increases portal pressure and can worsen bleeding; (3) Octreotide infusion; (4) IV antibiotics (ceftriaxone 1 g IV) — prophylactic antibiotics reduce bacterial infections (SBP) and mortality in cirrhotic patients with GI bleeding; (5) Emergent endoscopy (within 12 hours, ideally within 6) for variceal band ligation; (6) If endoscopy fails: balloon tamponade (Sengstaken-Blakemore or Minnesota tube) as a bridge to TIPS (transjugular intrahepatic portosystemic shunt). Propranolol is used for PRIMARY and SECONDARY PROPHYLAXIS of variceal bleeding, NOT for acute hemorrhage — it is a negative inotrope and chronotrope that would worsen hemodynamic instability in this actively bleeding, hypotensive patient.",
    learningObjective: "Initiate octreotide and prophylactic antibiotics for acute variceal hemorrhage and understand the complete management algorithm",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Target hemoglobin 7-8 g/dL in variceal bleeding — overtransfusion increases portal pressure and can worsen hemorrhage",
    clinicalPearls: [
      "Octreotide: 50 mcg IV bolus then 50 mcg/hr for 3-5 days — start immediately, do not wait for endoscopy",
      "Prophylactic antibiotics (ceftriaxone 1g IV) reduce mortality in cirrhotic GI bleeding — give to ALL cirrhotics with GI bleed",
      "Restrictive transfusion (Hgb target 7-8) is safer than liberal transfusion in variceal bleeding"
    ],
    safetyNote: "Propranolol is CONTRAINDICATED during acute variceal hemorrhage — its negative inotropic effect worsens shock. It is for prophylaxis only.",
    distractorRationales: [
      "Oral propranolol during active hemorrhage would worsen hypotension and is contraindicated — it is used for prophylaxis only",
      "TXA has not shown clear mortality benefit in GI bleeding (HALT-IT trial) — octreotide is the variceal-specific intervention",
      "Vitamin K takes hours to work and does not address the immediate need to reduce portal pressure and bleeding"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 60-year-old male with an implanted permanent pacemaker presents with progressive fatigue, lightheadedness, and near-syncope over 2 days. His HR is 35 bpm and does not increase with activity. The ECG shows native atrial rhythm at 80 bpm with no ventricular pacing spikes. His underlying rhythm is complete heart block. What pacemaker malfunction is occurring?",
    options: [
      "Oversensing — the pacemaker is detecting artifact and inhibiting pacing",
      "Failure to capture — the pacemaker is firing but the myocardium is not responding",
      "Failure to output (failure to pace) — the pacemaker is not generating any pacing stimuli, leaving the patient dependent on a slow ventricular escape rhythm",
      "Lead fracture with inappropriate sensing — the broken lead is generating noise that the pacemaker interprets as cardiac activity"
    ],
    correctAnswer: 2,
    rationaleLong: "This patient has failure to output (also called failure to pace), the most dangerous pacemaker malfunction. In failure to output, the pacemaker fails to generate any electrical pacing stimulus. On ECG, this manifests as the ABSENCE of pacing spikes where they should be present. In this patient with complete heart block (no conduction from atria to ventricles), the pacemaker should be pacing the ventricle every time the native ventricular rate falls below the programmed lower rate limit. Instead, there are no ventricular pacing spikes, and the patient is surviving on a slow ventricular escape rhythm (35 bpm) — which is unreliable and can cease at any time, causing cardiac arrest. Causes of failure to output include: (1) Battery depletion (most common) — pacemaker batteries have a finite lifespan (typically 8-12 years). As the battery depletes, the pacemaker enters an 'elective replacement indicator' (ERI) mode with reduced function before ultimately ceasing to output; (2) Lead fracture — a break in the lead wire prevents electrical transmission from the pulse generator to the myocardium; (3) Connection failure — the lead may have become dislodged from the header of the pulse generator; (4) Circuit failure within the pulse generator (rare in modern devices). This is distinct from: FAILURE TO CAPTURE — where pacing spikes ARE visible on ECG but are not followed by a QRS complex (the electrical stimulus is delivered but fails to depolarize the myocardium — causes include lead dislodgement, exit block from fibrosis at the lead tip, metabolic abnormalities, or output set below the capture threshold); OVERSENSING — where the pacemaker detects non-cardiac signals (muscle artifact, electromagnetic interference, T-wave oversensing) and inappropriately inhibits pacing. Emergency management: (1) Apply transcutaneous pacing pads immediately — set output to maximum and rate to 70-80 bpm; (2) Administer atropine 1 mg IV (may not work in complete heart block but trial is warranted); (3) If transcutaneous pacing fails or is not tolerated, prepare for transvenous temporary pacemaker insertion; (4) Emergent cardiology/electrophysiology consultation for device interrogation and likely generator replacement or lead revision.",
    learningObjective: "Differentiate pacemaker failure to output from failure to capture and oversensing, and initiate emergent transcutaneous pacing",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Failure to OUTPUT = no pacing spikes at all. Failure to CAPTURE = pacing spikes present but no QRS follows. Both are emergencies but have different causes.",
    clinicalPearls: [
      "No pacing spikes on ECG in a pacemaker-dependent patient = failure to output — apply transcutaneous pacing immediately",
      "Pacemaker batteries last 8-12 years — always ask when the device was implanted",
      "Complete heart block patients are pacemaker-dependent — failure of the device is immediately life-threatening"
    ],
    safetyNote: "Apply transcutaneous pacing pads to ALL pacemaker-dependent patients who present with symptomatic bradycardia — even before device interrogation",
    distractorRationales: [
      "Oversensing would show intermittent pauses with some pacing present — this patient has NO pacing at all",
      "Failure to capture shows pacing spikes without following QRS complexes — this patient has no visible pacing spikes",
      "Lead fracture can cause failure to output OR oversensing (noise from the fracture site) — but the ECG description here shows failure to output pattern"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A paramedic brings in a 50-year-old male found unresponsive in a house fire. He has soot around his nose and mouth, singed nasal hairs, and carbonaceous sputum. His SpO2 reads 100% on the pulse oximeter. The paramedic reports the patient was in a closed space. Should the nurse trust this SpO2 reading?",
    options: [
      "Yes — SpO2 of 100% confirms adequate oxygenation and the patient is stable",
      "No — standard pulse oximetry cannot differentiate carboxyhemoglobin from oxyhemoglobin, so the SpO2 reading is falsely normal; co-oximetry is needed to measure true oxygen saturation and carboxyhemoglobin level",
      "Yes — pulse oximetry is always accurate regardless of hemoglobin variants",
      "No — the pulse oximeter is malfunctioning due to soot on the patient's fingers"
    ],
    correctAnswer: 1,
    rationaleLong: "This is a critical concept in emergency nursing: standard pulse oximetry is UNRELIABLE in carbon monoxide (CO) poisoning and will give FALSELY NORMAL or FALSELY ELEVATED readings. Standard pulse oximetry works by measuring the ratio of light absorption at two wavelengths (660 nm red and 940 nm infrared) to differentiate oxyhemoglobin (HbO2) from deoxyhemoglobin (Hb). The problem: carboxyhemoglobin (COHb — hemoglobin bound to carbon monoxide) absorbs light at 660 nm almost identically to oxyhemoglobin. The pulse oximeter cannot distinguish between HbO2 and COHb, so it reads COHb AS IF it were HbO2, producing a falsely reassuring SpO2. A patient with a COHb level of 40% (severely poisoned, carrying essentially no oxygen) may display an SpO2 of 99-100% on standard pulse oximetry. This false reassurance can delay diagnosis and treatment, with potentially fatal consequences. CO-OXIMETRY is required to accurately assess oxygenation in suspected CO poisoning. A co-oximeter (available in most blood gas analyzers) measures absorption at multiple wavelengths (4-8 wavelengths), allowing it to separately quantify HbO2, Hb, COHb, and methemoglobin (MetHb). The result provides the TRUE oxygen saturation and the COHb percentage. This patient has every risk factor for CO poisoning: closed-space fire exposure, soot around nose and mouth, singed nasal hairs (indicating superheated gas inhalation), carbonaceous sputum (inhaled soot from incomplete combustion), and altered mental status. CO exposure should be assumed until disproven by co-oximetry. Treatment: 100% high-flow oxygen via non-rebreather mask (displaces CO from hemoglobin — CO half-life: room air 4-6 hours, 100% O2 60-90 minutes, hyperbaric O2 20-30 minutes). Consider hyperbaric oxygen therapy for: loss of consciousness, neurological symptoms, COHb >25%, cardiac ischemia, or pregnancy.",
    learningObjective: "Recognize that standard pulse oximetry is unreliable in CO poisoning and obtain co-oximetry for accurate assessment",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "SpO2 of 100% in a fire victim is NOT reassuring — it may be reading carboxyhemoglobin as oxyhemoglobin. ALWAYS get co-oximetry.",
    clinicalPearls: [
      "Standard pulse oximetry CANNOT detect CO poisoning — COHb is read as HbO2, giving falsely normal SpO2",
      "CO half-life: room air 4-6 hours, 100% O2 60-90 min, hyperbaric O2 20-30 min — start 100% O2 immediately",
      "Closed-space fire + soot + singed hairs + AMS = assume CO poisoning until co-oximetry proves otherwise"
    ],
    safetyNote: "Place ALL smoke inhalation patients on 100% high-flow oxygen immediately — do not wait for co-oximetry results to initiate treatment",
    distractorRationales: [
      "SpO2 of 100% cannot be trusted in CO poisoning — it is a known false reading that has contributed to missed diagnoses and deaths",
      "Pulse oximeters are NOT accurate with hemoglobin variants — COHb and MetHb both cause inaccurate readings",
      "While soot could affect probe placement, the fundamental issue is the physics of how pulse oximetry measures light absorption, not probe contamination"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 34-year-old female G2P1 at 36 weeks gestation presents to the ED with a seizure. She has a BP of 190/120, 4+ proteinuria, and is now postictal. Her platelet count is 68,000/μL, AST is 340 U/L, and LDH is 890 U/L. What syndrome is this, and what is the definitive treatment?",
    options: [
      "Gestational diabetes with hypoglycemic seizure — administer D50 and insulin adjustment",
      "HELLP syndrome (Hemolysis, Elevated Liver enzymes, Low Platelets) with eclampsia — the definitive treatment is delivery of the fetus, with IV magnesium sulfate for seizure prophylaxis",
      "Idiopathic thrombocytopenic purpura — platelet transfusion and IVIG",
      "Thrombotic thrombocytopenic purpura — emergent plasmapheresis"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has HELLP syndrome (Hemolysis, Elevated Liver enzymes, Low Platelets) complicated by eclampsia (seizures in the setting of preeclampsia). HELLP syndrome is a severe variant of preeclampsia that occurs in 10-20% of women with severe preeclampsia. The diagnostic criteria are: (1) HEMOLYSIS — evidenced by elevated LDH (890 U/L, normal <600), schistocytes on peripheral smear, elevated indirect bilirubin, and decreased haptoglobin. The elevated LDH reflects red blood cell destruction from microangiopathic hemolytic anemia (MAHA); (2) ELEVATED LIVER ENZYMES — AST 340 U/L (normal <40), indicating hepatocellular injury from hepatic sinusoidal fibrin deposition and periportal necrosis; (3) LOW PLATELETS — 68,000/μL (normal 150,000-400,000), from consumptive thrombocytopenia. The eclamptic seizure (seizure in a patient with severe preeclampsia/HELLP) indicates severe disease and is life-threatening to both mother and fetus. The DEFINITIVE treatment is DELIVERY — removal of the placenta is the only way to halt the disease process, as the placenta is the source of the antiangiogenic factors (soluble fms-like tyrosine kinase-1, or sFlt-1) that cause the systemic endothelial dysfunction underlying preeclampsia. Emergency management: (1) IV MAGNESIUM SULFATE — the drug of choice for both treatment and prevention of eclamptic seizures. Loading dose: 4-6 g IV over 15-20 minutes, maintenance: 1-2 g/hour continuous infusion. Magnesium works by blocking NMDA receptors, reducing cerebral vasospasm, and raising the seizure threshold. Monitor for magnesium toxicity: loss of patellar reflexes (earliest sign, occurs at Mg 8-12 mEq/L), respiratory depression (>12 mEq/L), and cardiac arrest (>20 mEq/L). The antidote is calcium gluconate 1 g IV; (2) ANTIHYPERTENSIVE THERAPY — IV labetalol (20 mg IV, then escalating doses) or IV hydralazine (5-10 mg IV) to acutely lower BP. Target is systolic 140-150 and diastolic 90-100 — do NOT lower too rapidly or too aggressively (risk of placental hypoperfusion); (3) DELIVERY — at 36 weeks, the fetus is near-term and delivery should proceed emergently. The route depends on obstetric factors (cervical readiness, fetal status), but cesarean section is often necessary given the urgency; (4) Platelet transfusion if count <20,000 or if active bleeding (the consumptive thrombocytopenia usually resolves within 72 hours of delivery).",
    learningObjective: "Diagnose HELLP syndrome with eclampsia and initiate magnesium sulfate, antihypertensive therapy, and emergent delivery",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Magnesium sulfate, NOT phenytoin or diazepam, is the drug of choice for eclamptic seizures — superior evidence for both treatment and prevention",
    clinicalPearls: [
      "HELLP: Hemolysis (↑LDH, schistocytes), Elevated Liver enzymes (↑AST), Low Platelets (<100,000)",
      "Magnesium toxicity sequence: loss of reflexes → respiratory depression → cardiac arrest. Antidote: calcium gluconate",
      "Delivery is the ONLY definitive treatment for preeclampsia/HELLP — the placenta is the source of disease"
    ],
    safetyNote: "Check patellar reflexes before each magnesium dose — loss of reflexes is the earliest sign of toxicity and should prompt holding the infusion",
    distractorRationales: [
      "Hypoglycemic seizures would show low glucose without hypertension, proteinuria, or liver/platelet abnormalities",
      "ITP causes isolated thrombocytopenia without liver enzyme elevation or hemolysis — and is not associated with hypertension",
      "TTP also causes MAHA and thrombocytopenia but presents with neurological symptoms, renal failure, and fever — not with hypertension and proteinuria in pregnancy"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 72-year-old male with a prosthetic mechanical aortic valve presents to the ED with acute dyspnea, pulmonary edema, and cardiogenic shock. His INR is 1.3 (subtherapeutic — target 2.5-3.5 for mechanical valve). Echocardiogram shows restricted valve leaflet motion with a high transvalvular gradient. What is the most likely diagnosis?",
    options: [
      "Prosthetic valve endocarditis — start empiric antibiotics",
      "Prosthetic valve thrombosis — the subtherapeutic anticoagulation allowed thrombus formation on the mechanical valve, obstructing leaflet motion and causing acute valvular obstruction",
      "Pannus formation (fibrous tissue ingrowth) — schedule elective valve replacement",
      "Patient-prosthesis mismatch — the valve is too small for the patient's body surface area"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has acute prosthetic valve thrombosis (PVT) of his mechanical aortic valve. Mechanical prosthetic heart valves require lifelong anticoagulation (typically warfarin with target INR 2.5-3.5 for aortic mechanical valves) because the non-biological valve surface activates the coagulation cascade. When anticoagulation is subtherapeutic (INR 1.3 in this patient), thrombus forms on the valve surfaces and hinges, restricting leaflet motion and causing functional valvular stenosis (obstruction) or regurgitation. The echocardiographic findings confirm the diagnosis: restricted valve leaflet motion (thrombus physically preventing the leaflets from opening fully) and high transvalvular gradient (the obstructed valve creates a pressure difference across it — the heart must generate much higher pressure to force blood through the narrowed orifice). The acute obstruction causes sudden hemodynamic decompensation — the left ventricle cannot effectively eject through the obstructed valve, leading to acute heart failure, pulmonary edema, and cardiogenic shock. This is a life-threatening emergency. Management depends on the patient's hemodynamic status and the location of the thrombosed valve: FOR LEFT-SIDED (AORTIC/MITRAL) PVT WITH HEMODYNAMIC INSTABILITY: (1) Systemic thrombolysis with alteplase (tPA) — slow infusion protocol (25 mg over 25 hours, repeated if needed) or accelerated protocol based on institutional preference. Thrombolysis dissolves the clot and restores leaflet motion; (2) Emergent surgical valve replacement — if thrombolysis fails, is contraindicated, or the patient is in extremis; (3) Concurrent IV heparin anticoagulation. FOR STABLE PVT: IV heparin anticoagulation with monitoring and possible planned surgical intervention. The distinction from pannus ingrowth is important: pannus (fibrous tissue that grows over the valve sewing ring) causes gradual, chronic obstruction that develops over months to years, while PVT typically presents acutely. Fluoroscopy can help differentiate — thrombus restricts leaflet motion that was previously normal, while pannus shows gradual progression.",
    learningObjective: "Diagnose acute prosthetic valve thrombosis from subtherapeutic anticoagulation and understand the urgency of thrombolysis or surgical intervention",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Subtherapeutic INR + mechanical valve + acute valve obstruction = prosthetic valve thrombosis until proven otherwise",
    clinicalPearls: [
      "Mechanical valves require lifelong warfarin — missed doses or drug interactions causing subtherapeutic INR can be rapidly fatal",
      "Prosthetic valve thrombosis is acute; pannus formation is chronic — the tempo of symptom onset helps differentiate",
      "Systemic thrombolysis is an option for left-sided PVT with hemodynamic instability — not just surgical replacement"
    ],
    safetyNote: "Always check the INR in any mechanical valve patient presenting with new dyspnea or hemodynamic instability — subtherapeutic anticoagulation is a clue to PVT",
    distractorRationales: [
      "Prosthetic valve endocarditis presents with fever, bacteremia, and vegetations — not the acute mechanical obstruction pattern seen here",
      "Pannus develops gradually over months-years — not acutely as in this presentation",
      "Patient-prosthesis mismatch is identified at the time of implantation — it does not present acutely with sudden hemodynamic collapse"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 45-year-old male presents to the ED after being stung by a scorpion while hiking in Arizona. He develops severe hypertension (BP 210/130), tachycardia (HR 160), profuse salivation, muscle fasciculations, and abdominal cramping. His ECG shows sinus tachycardia with ST changes. What type of shock can scorpion envenomation cause?",
    options: [
      "Only distributive shock from allergic reaction to the venom",
      "Scorpion venom causes a massive catecholamine surge that can produce both cardiogenic shock (toxic myocarditis, stress cardiomyopathy) and distributive shock from autonomic dysfunction — a mixed shock picture",
      "Only hemorrhagic shock from venom-induced coagulopathy",
      "Only neurogenic shock from venom's effects on the spinal cord"
    ],
    correctAnswer: 1,
    rationaleLong: "Severe scorpion envenomation (particularly from Centruroides species in the southwestern United States or Leiurus/Androctonus species in the Middle East/North Africa) can cause a complex, mixed shock picture through multiple mechanisms. The venom contains neurotoxins that affect sodium channels, keeping them in an open (activated) state, which causes massive and sustained release of catecholamines (epinephrine, norepinephrine) from the adrenal medulla and sympathetic nerve endings, as well as acetylcholine from parasympathetic nerve endings. This creates an 'autonomic storm' with simultaneous sympathetic AND parasympathetic overstimulation. The cardiovascular effects include: (1) CATECHOLAMINE-INDUCED CARDIOMYOPATHY — the massive catecholamine surge causes direct myocardial toxicity through calcium overload, oxidative stress, and contraction band necrosis. This can produce a takotsubo-like (stress) cardiomyopathy with severely reduced ejection fraction and cardiogenic shock. ECG may show ST changes, T-wave inversions, and troponin elevation mimicking acute MI; (2) HYPERTENSIVE CRISIS — severe catecholamine-driven hypertension can cause encephalopathy, aortic dissection, or intracranial hemorrhage; (3) PULMONARY EDEMA — from both cardiogenic (LV failure) and non-cardiogenic (capillary leak from inflammatory mediators) mechanisms; (4) ARRHYTHMIAS — both tachyarrhythmias (SVT, VT, VF) and bradyarrhythmias from cholinergic overstimulation. Cholinergic effects include: salivation, lacrimation, urination, defecation (SLUDGE), bronchospasm, bradycardia, and miosis. The autonomic dysregulation can cause a distributive component to the shock. Management: (1) Scorpion-specific antivenom (Anascorp in the US for Centruroides) — most effective when given early; (2) Prazosin (alpha-blocker) — reduces catecholamine-driven hypertension; (3) Dobutamine for cardiogenic shock if myocardial depression is present; (4) Benzodiazepines for muscle fasciculations and agitation; (5) Atropine for severe bradycardia/cholinergic symptoms; (6) Continuous cardiac monitoring — arrhythmias can be life-threatening. The mixed cardiogenic/distributive shock from autonomic dysfunction makes scorpion envenomation one of the most complex toxicological shock presentations.",
    learningObjective: "Recognize the mixed cardiogenic-distributive shock mechanism of severe scorpion envenomation and initiate antivenom and hemodynamic support",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Scorpion envenomation causes MIXED shock — do not treat as a single shock type. The catecholamine surge damages the heart (cardiogenic) AND causes autonomic dysfunction (distributive).",
    clinicalPearls: [
      "Scorpion venom opens sodium channels causing massive catecholamine release — an 'autonomic storm'",
      "Catecholamine-induced cardiomyopathy from envenomation mimics acute MI with ST changes and troponin elevation",
      "Antivenom (Anascorp) is most effective when given early — do not delay for diagnostic workup"
    ],
    safetyNote: "Severe scorpion envenomation can cause fulminant pulmonary edema within hours — have intubation equipment ready and monitor respiratory status closely",
    distractorRationales: [
      "Allergic/distributive shock alone does not explain the catecholamine surge, myocardial toxicity, and mixed autonomic effects",
      "Scorpion venom does not cause coagulopathy-induced hemorrhage — that is more typical of snake envenomation (pit vipers)",
      "Scorpion venom affects peripheral sodium channels and autonomic nervous system — it does not directly affect the spinal cord"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 65-year-old male presents to the ED with severe epigastric pain radiating to the back, nausea, and vomiting. His lipase is 2,400 U/L (normal <60). Over the next 6 hours, he develops tachycardia (HR 130), hypotension (BP 78/45), oliguria, and his abdomen becomes distended with diffuse tenderness. What is causing his hemodynamic deterioration?",
    options: [
      "Peptic ulcer perforation with peritonitis — emergent surgical repair needed",
      "Severe acute pancreatitis with distributive shock — massive inflammatory response and third-spacing of fluid into the retroperitoneal and peritoneal spaces causing hypovolemia and SIRS-mediated vasodilation",
      "Mesenteric ischemia with bowel necrosis — emergent laparotomy needed",
      "Ruptured abdominal aortic aneurysm — emergent vascular surgery consultation"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has severe acute pancreatitis progressing to distributive shock. The massively elevated lipase (2,400 U/L — 40x normal) confirms acute pancreatitis. The hemodynamic deterioration over 6 hours reflects two simultaneous processes: (1) MASSIVE FLUID THIRD-SPACING — in severe acute pancreatitis, the inflammatory process causes extensive capillary leak in and around the pancreas, allowing protein-rich fluid to sequester in the retroperitoneal space, peritoneal cavity, and surrounding tissues. This third-spacing can account for 5-10 liters of fluid loss from the intravascular compartment within the first 24-48 hours, causing severe hypovolemia. The abdominal distension reflects this fluid accumulation; (2) SYSTEMIC INFLAMMATORY RESPONSE SYNDROME (SIRS) — the pancreatic injury releases activated digestive enzymes (trypsin, lipase, phospholipase A2) and pro-inflammatory cytokines (TNF-alpha, IL-1, IL-6) into the systemic circulation, causing widespread vasodilation, capillary leak, and distributive shock physiology. In severe cases, this can progress to multiorgan dysfunction syndrome (MODS) affecting the lungs (ARDS), kidneys (acute kidney injury), and coagulation system (DIC). Emergency management: (1) AGGRESSIVE IV FLUID RESUSCITATION — this is the cornerstone of treatment. Current guidelines recommend lactated Ringer's solution (preferred over normal saline — evidence suggests LR may have anti-inflammatory properties in pancreatitis and avoids hyperchloremic acidosis) at 5-10 mL/kg/hour for the first 24 hours, with reassessment using urine output (target >0.5 mL/kg/hr), heart rate, and blood pressure to guide ongoing fluid therapy; (2) Pain management — IV hydromorphone or fentanyl (morphine was historically avoided due to theoretical sphincter of Oddi spasm, but this concern is likely overstated); (3) NPO initially, with early enteral nutrition via nasogastric or nasojejunal tube within 24-48 hours (enteral nutrition maintains gut barrier integrity and reduces infectious complications compared to TPN); (4) Monitor for complications: pancreatic necrosis (CT abdomen at 72-96 hours if not improving), infected necrosis, pseudocyst, and organ failure. Early aggressive fluid resuscitation within the first 12-24 hours is associated with significantly better outcomes — delayed resuscitation allows progression to irreversible organ dysfunction.",
    learningObjective: "Recognize hemodynamic deterioration in severe acute pancreatitis and initiate aggressive fluid resuscitation as the cornerstone of treatment",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Severe pancreatitis can sequester 5-10 liters of fluid through third-spacing — the hypovolemia is often underestimated. Fluid resuscitation is aggressive and early.",
    clinicalPearls: [
      "Lactated Ringer's is preferred over NS for pancreatitis resuscitation — may have anti-inflammatory benefits and avoids hyperchloremic acidosis",
      "Third-spacing in severe pancreatitis: 5-10 L can shift out of the intravascular space in 24-48 hours",
      "Early enteral nutrition (within 24-48 hours) is preferred over NPO — maintains gut barrier and reduces infection risk"
    ],
    safetyNote: "Monitor for abdominal compartment syndrome — massive fluid resuscitation can increase intra-abdominal pressure, worsening organ perfusion. Measure bladder pressures if abdomen is tense.",
    distractorRationales: [
      "Peptic ulcer perforation presents with free air on imaging — not the elevated lipase pattern of pancreatitis",
      "Mesenteric ischemia presents with pain out of proportion to exam and lactic acidosis — not the elevated lipase of pancreatitis",
      "Ruptured AAA presents with sudden-onset back/abdominal pain with pulsatile abdominal mass — not progressive inflammation with lipase elevation"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 28-year-old female is receiving her first unit of packed red blood cells when she develops sudden high fever (40.2°C), rigors, flank pain, dark urine, and hypotension (BP 70/40). Her urine appears port-wine colored. What type of transfusion reaction is this, and what is the immediate priority?",
    options: [
      "Febrile non-hemolytic transfusion reaction — slow the infusion rate and administer acetaminophen",
      "Acute hemolytic transfusion reaction (ABO incompatibility) — STOP the transfusion immediately, disconnect the blood product, maintain IV access with NS, and send blood bank verification samples",
      "Transfusion-related acute lung injury (TRALI) — stop the transfusion and intubate for respiratory support",
      "Allergic transfusion reaction — administer diphenhydramine and continue the transfusion"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is experiencing an acute hemolytic transfusion reaction (AHTR), the most dangerous and potentially fatal transfusion reaction, most commonly caused by ABO blood group incompatibility. When ABO-incompatible blood is transfused, pre-existing IgM antibodies (isohemagglutinins) in the recipient's plasma bind to the corresponding A or B antigens on the transfused red blood cells, activating the classical complement cascade. This causes rapid intravascular hemolysis — the destruction of transfused RBCs within the bloodstream. The clinical manifestations include: (1) Fever and rigors — from release of pyrogenic cytokines (IL-1, IL-6, TNF-alpha); (2) Flank/back pain — from renal capsular distension as hemoglobin deposits in the renal tubules; (3) Dark/port-wine colored urine — hemoglobinuria from free hemoglobin being filtered by the kidneys; (4) Hypotension — from DIC, complement activation, and cytokine-mediated vasodilation; (5) DIC — complement activation triggers the coagulation cascade, causing consumptive coagulopathy. IMMEDIATE ACTIONS: (1) STOP THE TRANSFUSION IMMEDIATELY — every additional mL of incompatible blood worsens the reaction; (2) DISCONNECT the blood product from the IV line — do NOT flush the blood in the tubing into the patient. Keep the bag for blood bank analysis; (3) MAINTAIN IV ACCESS with normal saline — use a new tubing set; (4) AGGRESSIVE FLUID RESUSCITATION — NS at 200-300 mL/hr to maintain renal perfusion and flush hemoglobin through the tubules, preventing acute tubular necrosis; (5) Send to blood bank: the blood product bag, a fresh patient sample (for repeat type and crossmatch), and a direct antiglobulin test (DAT/Coombs test); (6) Send labs: free hemoglobin, haptoglobin (will be undetectable — consumed binding free hemoglobin), LDH, bilirubin, coagulation studies, UA for hemoglobinuria; (7) Monitor for DIC — if present, transfuse appropriate products (FFP, cryoprecipitate, platelets); (8) Consider furosemide or mannitol to maintain urine output if adequate volume has been given. ABO incompatibility is almost always caused by clerical error — wrong patient identification, mislabeled samples, or failure to verify the blood product against the patient's identification band. This is why the bedside verification process (checking the patient's name, medical record number, blood type, and unit number at the bedside with two nurses) is one of the most critical safety steps in transfusion medicine.",
    learningObjective: "Recognize acute hemolytic transfusion reaction, stop the transfusion immediately, and initiate treatment to prevent renal failure and DIC",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "ABO transfusion reactions are almost ALWAYS caused by clerical/identification errors — not lab errors. The bedside verification process is the last line of defense.",
    clinicalPearls: [
      "Dark (port-wine) urine + fever + flank pain during transfusion = acute hemolytic reaction — STOP immediately",
      "Haptoglobin will be undetectable in hemolysis — it is consumed binding free hemoglobin. This is the most sensitive marker.",
      "Maintain aggressive urine output (>1 mL/kg/hr) with NS to prevent hemoglobin-induced acute tubular necrosis"
    ],
    safetyNote: "Two-nurse bedside verification of patient identity against the blood product label is MANDATORY before every transfusion — this prevents the most common cause of fatal ABO reactions",
    distractorRationales: [
      "Febrile non-hemolytic reactions cause mild fever without hemolysis, dark urine, or hemodynamic instability — far less severe",
      "TRALI presents with acute respiratory distress and bilateral pulmonary infiltrates — not the hemolysis pattern seen here",
      "Allergic reactions cause urticaria and possibly anaphylaxis — not intravascular hemolysis with port-wine urine"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 50-year-old male in the ICU with septic shock is on norepinephrine, vasopressin, and stress-dose hydrocortisone. His nurse is preparing to administer a vasopressin bolus to increase his blood pressure faster. Why is this incorrect?",
    options: [
      "Vasopressin should be given orally, not IV",
      "Vasopressin in septic shock is administered as a FIXED-RATE infusion (0.03-0.04 units/min), NOT as a bolus or titrated dose — bolus administration can cause severe mesenteric and digital ischemia, myocardial ischemia, and cardiac arrest",
      "Vasopressin is only effective in cardiogenic shock, not septic shock",
      "Vasopressin must be given before norepinephrine, not as a second agent"
    ],
    correctAnswer: 1,
    rationaleLong: "Vasopressin (antidiuretic hormone, ADH) in septic shock is administered as a FIXED-RATE continuous infusion, typically at 0.03-0.04 units/minute. It is NEVER given as a bolus and is NOT titrated up and down like norepinephrine or epinephrine. Understanding why requires knowledge of vasopressin's unique pharmacology: (1) MECHANISM — In septic shock, there is a relative deficiency of endogenous vasopressin (initially levels rise in early shock but become depleted within hours as pituitary stores are exhausted). Exogenous vasopressin restores physiological levels and acts on V1 receptors on vascular smooth muscle to cause vasoconstriction. At low doses (0.03-0.04 U/min), this vasoconstriction is relatively selective for the splanchnic and cutaneous vasculature, augmenting the effects of norepinephrine; (2) DANGER OF BOLUS — A bolus of vasopressin causes sudden, intense vasoconstriction that can produce: (a) Severe mesenteric ischemia — the splanchnic circulation is highly sensitive to vasopressin, and bolus dosing can cause bowel ischemia and infarction; (b) Digital and extremity ischemia — vasopressin-induced vasoconstriction of digital arteries can cause ischemic necrosis of fingers and toes; (c) Myocardial ischemia — coronary vasoconstriction can precipitate angina or MI; (d) Cardiac arrest — the sudden increase in afterload can cause acute left ventricular failure; (3) FIXED RATE — The VASST trial (Vasopressin and Septic Shock Trial) used a fixed rate of 0.03 U/min. Rates above 0.04 U/min have not shown additional benefit and increase the risk of ischemic complications. Vasopressin is the SECOND-LINE vasopressor in septic shock (added to norepinephrine, not as a replacement). Its unique mechanism (V1 receptor, non-catecholamine) means it works through a different pathway than norepinephrine (alpha-1 adrenergic), providing additive effect. The emergency nurse must understand that vasopressin is NOT like other vasopressors — it is not titrated to a MAP target. Instead, norepinephrine is the agent that should be titrated up and down to achieve the MAP goal of ≥65 mmHg, with vasopressin running as a fixed-rate adjunct.",
    learningObjective: "Administer vasopressin correctly as a fixed-rate infusion in septic shock and understand why bolus dosing is dangerous",
    blueprintCategory: "Shock",
    subtopic: "septic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Vasopressin is a FIXED-RATE infusion (0.03-0.04 U/min) — NEVER bolus, NEVER titrate. Titrate norepinephrine instead.",
    clinicalPearls: [
      "Vasopressin 0.03-0.04 U/min is a fixed-rate infusion — do not titrate up or down, do not bolus",
      "Vasopressin is added TO norepinephrine as a second-line agent — it does not replace norepinephrine",
      "Vasopressin works on V1 receptors (non-catecholamine pathway) — additive effect with catecholamine vasopressors"
    ],
    safetyNote: "Monitor fingers, toes, and skin for signs of ischemia during vasopressin infusion — digital necrosis is a known complication even at standard doses",
    distractorRationales: [
      "Vasopressin for hemodynamic support is always IV — oral formulations (desmopressin) exist but are for diabetes insipidus, not shock",
      "Vasopressin is specifically recommended for septic shock as a second-line agent — it has no role in primary cardiogenic shock",
      "Vasopressin is added as a second agent to norepinephrine per SSC guidelines — norepinephrine is always first-line"
    ],
    lessonPath: "/emergency/lessons/septic-shock"
  },
  {
    stem: "A 38-year-old male construction worker is brought to the ED on a hot summer day (ambient temperature 42°C/108°F). He collapsed at the work site and is unresponsive. His core temperature is 41.5°C (106.7°F), his skin is HOT and DRY, GCS is 6, HR 160, and BP 80/50. What is the diagnosis, and what is the most effective cooling method?",
    options: [
      "Heat exhaustion — oral rehydration and rest in a cool environment",
      "Exertional heat stroke — cold water immersion (CWI) in an ice bath is the gold standard cooling method, targeting a temperature drop to <39°C within 30 minutes",
      "Neuroleptic malignant syndrome — administer dantrolene and bromocriptine",
      "Severe dehydration — IV normal saline is sufficient without active cooling"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has exertional heat stroke (EHS), defined as core temperature >40°C (104°F) with neurological dysfunction (altered mental status, seizures, coma) in the setting of physical exertion in a hot environment. Heat stroke is a true medical emergency with a mortality rate of 10-50% if not treated rapidly. The key distinction from heat exhaustion: heat stroke involves CNS dysfunction (confusion, seizures, coma) and is a LIFE-THREATENING emergency, while heat exhaustion presents with fatigue, nausea, headache, and profuse sweating WITHOUT altered mental status. The hot, dry skin in this patient indicates the body's thermoregulatory mechanisms have failed — the hypothalamus can no longer mount an effective sweating response, and heat production exceeds heat dissipation. COLD WATER IMMERSION (CWI) is the GOLD STANDARD cooling method for heat stroke. The patient is immersed in a tub of ice water (temperature approximately 1-4°C/34-39°F) up to the neck. CWI achieves the fastest cooling rates of any method: 0.15-0.35°C per minute, compared to 0.03-0.06°C per minute for evaporative cooling (misting fans). The goal is to reduce core temperature to <39°C (102.2°F) within 30 minutes — survival and neurological outcomes are directly proportional to the speed of cooling. If CWI is not available, alternative methods (in order of effectiveness): (1) Evaporative cooling — undress the patient, mist skin with tepid water, and direct high-velocity fans over the body; (2) Ice packs to the neck, axillae, and groin (areas of large blood vessels close to the skin); (3) Cold IV saline (4°C) — provides internal cooling but slower than external methods; (4) Peritoneal lavage with cold saline (rarely needed). Emergency nursing considerations during cooling: (1) Core temperature monitoring — use a rectal or esophageal probe (tympanic and axillary are unreliable in heat stroke). Stop cooling at 38-39°C to avoid overshoot hypothermia; (2) Continuous cardiac monitoring — arrhythmias are common with both hyperthermia and rapid cooling; (3) Secure the airway — GCS 6 requires intubation; (4) Aggressive IV fluid resuscitation — heat stroke causes severe dehydration and rhabdomyolysis; (5) Monitor for complications: DIC, rhabdomyolysis (check CK and urine myoglobin), acute kidney injury, hepatic failure, and ARDS. Do NOT administer antipyretics (acetaminophen, ibuprofen) — they act on the hypothalamic set point, which is normal in heat stroke. The problem is not an elevated set point (as in infection) but an overwhelming environmental/metabolic heat load exceeding dissipation capacity.",
    learningObjective: "Diagnose exertional heat stroke and implement cold water immersion as the gold standard cooling method within 30 minutes",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Antipyretics (acetaminophen, NSAIDs) do NOT work in heat stroke — the hypothalamic set point is normal. The problem is heat overload, not a reset thermostat.",
    clinicalPearls: [
      "Cold water immersion cools at 0.15-0.35°C/min — 5-10x faster than evaporative cooling methods",
      "Goal: reduce core temp to <39°C within 30 minutes — survival is directly proportional to cooling speed",
      "Use rectal or esophageal probe for core temperature — tympanic and axillary are unreliable in heat stroke"
    ],
    safetyNote: "Stop active cooling at 38-39°C to prevent overshoot hypothermia — temperature will continue to drift down after cooling is stopped",
    distractorRationales: [
      "Heat exhaustion does not cause altered mental status — this patient's GCS of 6 indicates heat STROKE, which is life-threatening",
      "NMS presents in the context of antipsychotic medication use and develops over days — not acute exertional exposure",
      "IV fluids alone are insufficient — external cooling is mandatory. Fluid resuscitation supports but does not replace active cooling"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 52-year-old female with a history of Addison's disease (primary adrenal insufficiency) presents to the ED after a motor vehicle crash with femur fracture. She takes hydrocortisone 20 mg daily and fludrocortisone 0.1 mg daily at baseline. She is hemodynamically stable initially but over 2 hours develops progressive hypotension (BP 72/40) refractory to 3 liters of IV fluid. What is the most likely cause of her refractory hypotension?",
    options: [
      "Massive internal hemorrhage from the femur fracture requiring surgical intervention",
      "Acute adrenal crisis precipitated by physiological stress — her baseline hydrocortisone dose is insufficient for the stress of trauma and she needs stress-dose hydrocortisone 100 mg IV immediately",
      "Neurogenic shock from a missed spinal cord injury — perform a thorough neurological assessment",
      "Tension pneumothorax — perform needle decompression"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has known primary adrenal insufficiency (Addison's disease) and is experiencing an acute adrenal crisis precipitated by the physiological stress of trauma (femur fracture). Under normal conditions, the adrenal glands increase cortisol production 5-10 fold during acute illness, injury, or surgery. This cortisol surge is essential for: (1) Maintaining vascular tone and responsiveness to catecholamines; (2) Supporting cardiac contractility; (3) Maintaining intravascular volume through mineralocorticoid effects; (4) Modulating the inflammatory response. In a patient with Addison's disease, the adrenal glands are destroyed (usually by autoimmune adrenalitis) and cannot mount this cortisol surge. Her baseline replacement dose of hydrocortisone 20 mg daily is adequate for normal daily requirements but is grossly insufficient for the physiological stress of trauma. Without adequate cortisol, the vasculature loses tone, becomes unresponsive to catecholamines (vasopressors will not work effectively without cortisol), and cardiovascular collapse ensues. Treatment: STRESS-DOSE HYDROCORTISONE — 100 mg IV bolus immediately, followed by 50 mg IV every 8 hours (or 200 mg/24 hours as continuous infusion) until the acute stress resolves. The response to stress-dose hydrocortisone is often dramatic — blood pressure may improve significantly within 1-2 hours. Hydrocortisone is preferred because at high doses (100 mg), it provides significant mineralocorticoid activity (sodium and water retention), supplementing her fludrocortisone. The emergency nurse should also: (1) Check glucose — hypoglycemia is common in adrenal crisis; (2) Check electrolytes — hyponatremia and hyperkalemia are classic; (3) Start dextrose-containing IV fluids if hypoglycemic; (4) Document the patient's medical alert bracelet/identification and home steroid dose; (5) Educate the patient about stress dosing for future events. The key teaching point: ANY patient with known adrenal insufficiency (Addison's disease, chronic steroid use, bilateral adrenalectomy) who presents with acute illness, trauma, or surgery needs immediate stress-dose steroids regardless of initial hemodynamic status — do not wait for hypotension to develop. This patient's progressive hypotension refractory to fluids is the hallmark presentation of adrenal crisis — vasopressors will also be ineffective without cortisol replacement.",
    learningObjective: "Recognize adrenal crisis in patients with known adrenal insufficiency during physiological stress and initiate stress-dose hydrocortisone immediately",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Vasopressors will NOT work effectively without cortisol — if a patient is on chronic steroids and develops refractory hypotension, give stress-dose hydrocortisone BEFORE escalating vasopressors",
    clinicalPearls: [
      "Stress-dose hydrocortisone: 100 mg IV bolus then 50 mg IV q8h — response is often dramatic within hours",
      "Any Addison's patient with acute illness/trauma/surgery needs stress-dose steroids — do not wait for hemodynamic deterioration",
      "At high doses (≥100 mg), hydrocortisone provides significant mineralocorticoid activity — additional fludrocortisone is not needed during stress dosing"
    ],
    safetyNote: "Check for medical alert identification (bracelet, necklace, card) in any trauma patient with unexplained refractory hypotension — adrenal insufficiency may not be in the medical record",
    distractorRationales: [
      "While femur fractures cause significant blood loss, 3 liters of fluid would typically show some response in pure hemorrhagic shock — the refractory nature suggests an additional etiology",
      "Neurogenic shock causes bradycardia (not just hypotension) and would not explain the progressive deterioration after an initially stable presentation",
      "Tension pneumothorax would present with unilateral absent breath sounds and tracheal deviation — not described here"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 70-year-old male with severe aortic stenosis (valve area 0.6 cm², normal >3.0 cm²) presents to the ED with syncope and a BP of 78/50. His echocardiogram shows a hyperdynamic left ventricle with LVEF 65%. The nurse notes that despite the low blood pressure, the cardiac contractility appears preserved. Why is this patient in shock despite a normal ejection fraction?",
    options: [
      "The echocardiogram is incorrect and needs to be repeated",
      "Severe aortic stenosis causes fixed outflow obstruction — the ventricle cannot increase stroke volume despite adequate contractility because the severely narrowed valve limits the amount of blood that can be ejected per beat, causing obstructive-type cardiogenic shock",
      "The patient has concurrent sepsis causing distributive shock — the aortic stenosis is incidental",
      "The patient has hypovolemic shock from dehydration — the aortic stenosis is not contributing to the hypotension"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient demonstrates an important concept: a normal or preserved ejection fraction does NOT mean the heart is pumping effectively. In severe aortic stenosis (valve area 0.6 cm² compared to normal >3.0 cm²), the severely narrowed aortic valve creates a fixed obstruction to left ventricular outflow. Even though the left ventricle is contracting vigorously (LVEF 65%, which is actually hyperdynamic), the amount of blood that can pass through the critically stenotic valve per beat is severely limited. This results in a fixed, low stroke volume regardless of contractility, causing low cardiac output and hypotension. The pathophysiology: the left ventricle in severe aortic stenosis has undergone concentric hypertrophy (the walls thicken to generate the higher pressures needed to force blood through the narrowed valve). This hypertrophied ventricle has: (1) Increased dependence on atrial contraction for ventricular filling (the stiff, hypertrophied ventricle has impaired diastolic filling, and the 'atrial kick' contributes 25-40% of ventricular filling, compared to 15-25% in normal hearts — this is why atrial fibrillation is particularly dangerous in aortic stenosis); (2) Increased myocardial oxygen demand (thicker walls require more perfusion); (3) Fixed stroke volume that cannot increase to meet physiological demands. The syncope occurred because the fixed cardiac output could not maintain cerebral perfusion during a transient increase in demand (standing, exertion, or any vasodilatory stimulus). Critical nursing considerations: (1) Avoid vasodilators (nitroglycerin, nitroprusside, ACE inhibitors) — these reduce preload and afterload, causing catastrophic hypotension because the ventricle cannot compensate by increasing stroke volume; (2) Maintain sinus rhythm — loss of atrial contraction (AF) can precipitate acute decompensation due to the loss of the critical atrial kick; (3) Volume resuscitation should be cautious — small fluid boluses (250 mL) with reassessment, as the stiff ventricle has a narrow optimal filling range; (4) Phenylephrine (pure alpha-agonist) may be used for refractory hypotension — it increases afterload and coronary perfusion pressure without the tachycardia that would shorten diastolic filling time; (5) Definitive treatment is valve replacement (surgical or transcatheter — TAVR). The classic triad of symptomatic aortic stenosis (syncope, angina, heart failure) indicates a poor prognosis without valve replacement — 2-year mortality is approximately 50% once symptoms develop.",
    learningObjective: "Understand why preserved ejection fraction does not preclude cardiogenic shock in severe aortic stenosis and avoid vasodilators",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "LVEF can be normal or HIGH in severe aortic stenosis — the problem is the fixed obstruction, not the contractility. Do not be falsely reassured by a normal EF.",
    clinicalPearls: [
      "Severe AS: valve area <1.0 cm² with mean gradient >40 mmHg — critical when <0.6 cm²",
      "Loss of atrial kick (AF) can cause acute decompensation — atrial contraction provides 25-40% of ventricular filling in AS",
      "Symptomatic AS triad: syncope, angina, heart failure — 50% 2-year mortality without valve replacement"
    ],
    safetyNote: "Nitroglycerin is CONTRAINDICATED in severe aortic stenosis — even a single sublingual dose can cause irreversible cardiovascular collapse",
    distractorRationales: [
      "The echocardiogram findings are consistent with severe AS — the LVEF is preserved because contractility is maintained, but output is limited by the valve",
      "Concurrent sepsis would show additional signs (fever, leukocytosis, source) — the presentation is entirely explained by the severe AS",
      "Pure hypovolemia would respond to fluids — the fixed obstruction from AS limits cardiac output regardless of volume status"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 24-year-old female presents to the ED after a sexual assault reporting that she was strangled during the attack. She appears well, with a hoarse voice, petechiae above the clavicles, and mild anterior neck tenderness. She says she 'feels fine now.' What is the concern, and can she be discharged?",
    options: [
      "She appears stable and can be discharged with follow-up if she has no respiratory symptoms",
      "Strangulation injuries can have delayed airway compromise from progressive laryngeal edema, vascular injury, or tracheal cartilage fracture — she requires a minimum 4-6 hour observation period, CT angiography of the neck, and laryngoscopy",
      "She only needs psychiatric evaluation and can be medically cleared",
      "Soft tissue neck X-ray is sufficient to evaluate for injury before discharge"
    ],
    correctAnswer: 1,
    rationaleLong: "Non-fatal strangulation is a high-risk injury pattern that can have delayed, life-threatening complications appearing hours to days after the initial event. The hoarseness, petechiae above the clavicles (indicating venous congestion above the point of compression), and neck tenderness are all warning signs of significant injury. The emergency nurse must understand that a patient who 'feels fine now' may develop catastrophic complications: (1) DELAYED AIRWAY COMPROMISE — Laryngeal edema can progress over hours. The laryngeal structures (epiglottis, aryepiglottic folds, false and true vocal cords) can develop progressive swelling that narrows the airway. What starts as mild hoarseness can progress to stridor, respiratory distress, and complete airway obstruction. Laryngeal cartilage fracture (hyoid bone, thyroid cartilage, cricoid cartilage) may not be apparent initially but can cause progressive airway compromise as hematoma and edema develop around the fracture site; (2) VASCULAR INJURY — Compression of the carotid arteries can cause intimal dissection, thrombosis, or pseudoaneurysm formation. These vascular injuries may be asymptomatic initially but can lead to delayed stroke from thromboembolism hours to days later. CT angiography (CTA) of the neck should be obtained to evaluate the carotid and vertebral arteries; (3) ESOPHAGEAL INJURY — Though rare, compression can damage the esophagus; (4) NEUROLOGICAL INJURY — Anoxic brain injury from even brief cerebral hypoperfusion, delayed stroke from carotid injury. Evaluation should include: (1) CT angiography of the neck (evaluate carotid/vertebral arteries and detect cartilage fractures); (2) Flexible laryngoscopy to directly visualize the laryngeal structures for edema, hemorrhage, or fracture; (3) A minimum 4-6 hour observation period for delayed airway compromise; (4) Serial respiratory assessments; (5) Thorough documentation of injuries (this is a forensic case — document injuries with photographs, measurements, and detailed descriptions for legal proceedings). Strangulation is the strongest predictor of future homicide in domestic violence — prior non-fatal strangulation increases the risk of homicide by 7.5 times. The emergency nurse should ensure a domestic violence safety assessment, social work consultation, and safety planning are completed. A plain neck X-ray is insufficient — it misses vascular injuries, subtle cartilage fractures, and soft tissue edema that CT identifies.",
    learningObjective: "Recognize delayed complications of strangulation injury and implement appropriate observation, imaging, and safety assessment",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A patient who 'feels fine' after strangulation can develop fatal airway obstruction hours later — NEVER discharge without observation, CTA, and laryngoscopy",
    clinicalPearls: [
      "Petechiae above the clavicles indicate venous congestion above the point of compression — a sign of significant force",
      "Prior strangulation increases future homicide risk by 7.5x — always complete a domestic violence safety assessment",
      "Hoarseness after strangulation indicates laryngeal injury — progressive edema can cause complete airway obstruction hours later"
    ],
    safetyNote: "Have difficult airway equipment at the bedside during observation — if the airway deteriorates, intubation may be extremely difficult due to distorted anatomy from edema",
    distractorRationales: [
      "Discharge based on current stability ignores the documented risk of delayed airway compromise and vascular injury — strangulation requires mandatory observation",
      "Psychiatric evaluation is important but medical evaluation and observation are the priority — life-threatening physical injuries must be identified first",
      "Plain X-ray misses vascular injuries and subtle cartilage fractures — CT angiography and laryngoscopy are the appropriate studies"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 48-year-old male is brought to the ED in septic shock from a perforated appendix. His initial lactate is 8.4 mmol/L. The Surviving Sepsis Campaign recommends specific time-based targets. What should be accomplished within the first HOUR of recognition?",
    options: [
      "Source control (surgery for the perforated appendix) within 1 hour",
      "Within 1 hour: (1) Measure lactate, (2) obtain blood cultures before antibiotics, (3) administer broad-spectrum IV antibiotics, (4) begin 30 mL/kg crystalloid for hypotension or lactate ≥4 mmol/L, (5) start vasopressors for MAP <65 after initial fluid resuscitation",
      "CT scan of the abdomen, surgical consultation, and ICU admission within 1 hour",
      "Central line placement, arterial line, and PA catheter insertion within 1 hour"
    ],
    correctAnswer: 1,
    rationaleLong: "The Surviving Sepsis Campaign (SSC) Hour-1 Bundle represents the critical time-sensitive interventions that should be initiated within the first hour of sepsis/septic shock recognition. The evidence is clear that delays in any of these interventions increase mortality. The five components are: (1) MEASURE LACTATE — Lactate is the single best biomarker for assessing the severity of tissue hypoperfusion in sepsis. The initial lactate level guides the aggressiveness of resuscitation. This patient's lactate of 8.4 mmol/L is severely elevated (normal <2.0, >4.0 indicates severe tissue hypoperfusion). Serial lactate measurements every 2-4 hours guide resuscitation adequacy (target ≥10-20% clearance every 2 hours); (2) OBTAIN BLOOD CULTURES — At least 2 sets of blood cultures (aerobic + anaerobic from 2 separate sites) should be obtained BEFORE antibiotic administration. Blood cultures obtained after antibiotics have significantly reduced sensitivity. However, obtaining cultures should NOT delay antibiotic administration — if there is any logistical delay in obtaining cultures, give antibiotics first; (3) ADMINISTER BROAD-SPECTRUM IV ANTIBIOTICS — For each hour of delay in antibiotic administration in septic shock, mortality increases by approximately 7.6%. Empiric antibiotics should cover all likely pathogens based on the suspected source. For this patient with perforated appendix (intra-abdominal source), coverage should include gram-negative bacilli, gram-positive cocci, AND anaerobes — e.g., piperacillin-tazobactam or meropenem; (4) BEGIN RAPID FLUID RESUSCITATION — 30 mL/kg of crystalloid within the first 3 hours for hypotension or lactate ≥4 mmol/L. This initial bolus should be started within the first hour and completed within 3 hours. For a 70 kg patient, this is 2,100 mL; (5) VASOPRESSORS — If the patient remains hypotensive (MAP <65 mmHg) during or after the initial fluid resuscitation, start vasopressors (norepinephrine first-line). Vasopressors should not be delayed for fluid completion if the patient is profoundly hypotensive. Source control (surgery for the perforated appendix) is critically important but is NOT part of the Hour-1 Bundle — it should be achieved as soon as possible (ideally within 6-12 hours) but is not a 60-minute target because surgical preparation takes time. The Hour-1 Bundle can be completed in any ED.",
    learningObjective: "Execute the Surviving Sepsis Campaign Hour-1 Bundle components and understand the time-mortality relationship for each intervention",
    blueprintCategory: "Shock",
    subtopic: "septic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Blood cultures before antibiotics — but NEVER delay antibiotics for cultures. If obtaining cultures will cause any delay, give antibiotics first and then draw cultures.",
    clinicalPearls: [
      "SSC Hour-1 Bundle: lactate, cultures, antibiotics, fluids, vasopressors — all initiated within 60 minutes",
      "Each hour of antibiotic delay in septic shock increases mortality by approximately 7.6%",
      "30 mL/kg crystalloid is a STARTING point — reassess and give more if the patient is still hypoperfused"
    ],
    safetyNote: "Do not delay the Hour-1 Bundle for imaging, procedures, or transfer — these interventions save lives and can be performed in any clinical setting",
    distractorRationales: [
      "Source control is essential but is not a 60-minute target — surgical preparation and OR availability require more time",
      "CT scan and ICU admission are important but secondary to the immediate resuscitation interventions in the Hour-1 Bundle",
      "Invasive monitoring (central line, arterial line) is helpful but not required within the first hour — peripheral IVs are sufficient to begin resuscitation"
    ],
    lessonPath: "/emergency/lessons/septic-shock"
  },
  {
    stem: "A 55-year-old male presents to the ED with acute substernal chest pain. His ECG shows ST elevation in leads V1-V4. He undergoes emergent PCI with stent placement to the LAD. Post-procedure, he develops cardiogenic shock with BP 72/40, HR 110, and pulmonary edema. An intra-aortic balloon pump (IABP) is placed. When does the IABP inflate and deflate, and what hemodynamic effects does it produce?",
    options: [
      "The IABP inflates during systole and deflates during diastole — this increases afterload to support blood pressure",
      "The IABP inflates during DIASTOLE (augmenting coronary perfusion and organ perfusion) and deflates just before SYSTOLE (reducing afterload and myocardial oxygen demand) — this creates a dual benefit of improved supply and decreased demand",
      "The IABP provides continuous inflation to maintain blood pressure — it does not cycle with the cardiac rhythm",
      "The IABP inflates during both systole and diastole to provide maximal hemodynamic support"
    ],
    correctAnswer: 1,
    rationaleLong: "The intra-aortic balloon pump (IABP) is a mechanical circulatory support device that augments hemodynamics through the principle of counterpulsation — it works in COUNTER to the cardiac cycle, providing support exactly when the heart needs it most. The balloon (25-50 mL) is positioned in the descending thoracic aorta, just distal to the left subclavian artery and proximal to the renal arteries. INFLATION (DIASTOLE): The balloon rapidly inflates with helium gas at the onset of diastole (triggered by the dicrotic notch of the arterial waveform or the T wave on the ECG). This does two things: (1) DIASTOLIC AUGMENTATION — the inflated balloon displaces blood in the aorta both proximally and distally. Proximal displacement retrograde toward the aortic root increases coronary artery perfusion pressure (coronary arteries fill during diastole), improving oxygen delivery to the ischemic myocardium. Distal displacement increases perfusion to the kidneys, mesentery, and periphery; (2) The augmented diastolic pressure is visible on the arterial waveform as an elevated peak during diastole that exceeds the patient's unassisted systolic pressure — this is the 'augmented diastolic pressure.' DEFLATION (PRE-SYSTOLE): The balloon rapidly deflates just before the next systole. This creates a sudden decrease in aortic volume (vacuum effect), which: (1) REDUCES AFTERLOAD — the left ventricle encounters less resistance when it begins to eject, reducing myocardial wall stress and oxygen demand; (2) REDUCES AORTIC END-DIASTOLIC PRESSURE — visible on the arterial waveform as a 'dip' just before the next systolic upstroke. This is called 'afterload reduction' or 'systolic unloading.' The net effect is improved myocardial oxygen SUPPLY (increased coronary perfusion during diastole) AND decreased myocardial oxygen DEMAND (reduced afterload during systole) — the ideal combination for a failing, ischemic heart. Emergency nursing responsibilities for IABP management: (1) Verify timing on the arterial waveform — augmented diastolic pressure should be higher than the patient's systolic pressure, and the assisted systolic pressure should be lower than the unassisted systolic; (2) Monitor for complications: limb ischemia (check distal pulses, capillary refill, and sensation of the cannulated leg every 15-30 minutes), balloon rupture (blood in the tubing, loss of augmentation), aortic dissection, thrombocytopenia (mechanical platelet destruction), and infection; (3) Maintain anticoagulation (usually heparin) to prevent thrombus formation on the balloon surface; (4) Do NOT allow the patient to sit up more than 30 degrees (risk of balloon migration) or flex the hip of the cannulated leg (risk of kinking the catheter).",
    learningObjective: "Explain IABP counterpulsation timing and hemodynamic effects, and monitor for complications",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The IABP works in COUNTER to the heart: inflate in diastole (improve supply), deflate before systole (decrease demand). Never inflate during systole.",
    clinicalPearls: [
      "IABP timing: inflate at dicrotic notch (start of diastole), deflate just before systole — counterpulsation principle",
      "Augmented diastolic pressure should EXCEED unassisted systolic pressure — if not, timing or inflation volume needs adjustment",
      "Check distal pulses on the cannulated leg every 15-30 minutes — limb ischemia is the most common complication"
    ],
    safetyNote: "NEVER turn off the IABP suddenly — wean gradually (from 1:1 to 1:2 to 1:3 ratio) over hours. Abrupt cessation can cause aortic thrombosis on the stationary balloon",
    distractorRationales: [
      "Inflation during systole would INCREASE afterload — the exact opposite of what the failing heart needs, and would impede ejection",
      "The IABP must cycle with the cardiac rhythm — continuous inflation would obstruct aortic blood flow",
      "Inflation during both systole and diastole would obstruct normal cardiac ejection and could be immediately fatal"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 33-year-old female presents to the ED with a 5-day history of progressive weakness, double vision, difficulty swallowing, and now respiratory distress. She recently recovered from a Campylobacter gastroenteritis. She has areflexia and ascending symmetric weakness. Her vital capacity is measured at 12 mL/kg (normal >60 mL/kg). What is the diagnosis, and why is this a shock emergency?",
    options: [
      "Myasthenia gravis exacerbation — administer pyridostigmine and discharge",
      "Guillain-Barré syndrome (GBS) with impending respiratory failure and autonomic instability — the autonomic dysfunction can cause cardiovascular collapse from severe bradycardia, cardiac arrest, or blood pressure lability",
      "Botulism — administer antitoxin and observe",
      "Multiple sclerosis relapse — administer IV methylprednisolone"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has Guillain-Barré syndrome (GBS), an acute inflammatory demyelinating polyradiculoneuropathy triggered by the preceding Campylobacter jejuni gastroenteritis (the most common infectious trigger, found in 25-40% of GBS cases). The molecular mimicry between Campylobacter surface lipooligosaccharides and peripheral nerve gangliosides triggers an autoimmune attack on the peripheral nerve myelin sheaths. The classic presentation includes: ascending, symmetric weakness starting in the legs and progressing proximally; areflexia (loss of deep tendon reflexes); and potential cranial nerve involvement (diplopia from CN III/IV/VI, dysphagia from CN IX/X). The vital capacity of 12 mL/kg is critically low — impending respiratory failure. GBS is a shock emergency not primarily because of respiratory failure (which is well-recognized) but because of AUTONOMIC DYSFUNCTION, which occurs in 65-70% of GBS patients and is the second leading cause of death (after respiratory failure). Autonomic dysfunction in GBS can cause: (1) Severe bradycardia — abrupt, profound bradycardia that can progress to asystole without warning. This occurs because demyelination affects the vagal nerve (CN X), causing inappropriate parasympathetic activation; (2) Tachycardia — alternating with bradycardia, often labile; (3) Blood pressure lability — severe hypertension alternating with hypotension (loss of baroreflex function); (4) Cardiac arrhythmias — including heart block and ventricular arrhythmias; (5) Orthostatic hypotension; (6) Bowel and bladder dysfunction. Emergency nursing priorities: (1) Serial measurement of vital capacity (VC) and negative inspiratory force (NIF) every 2-4 hours — intubation criteria: VC <20 mL/kg, NIF weaker than -30 cmH2O, or VC declining >30% from baseline (the '20/30/40 rule': VC <20, NIF <-30, or >40% decline from peak VC); (2) Continuous cardiac monitoring — for dysrhythmias from autonomic instability; (3) External pacing equipment at bedside — in case of sudden severe bradycardia; (4) Avoid succinylcholine for RSI — GBS patients can develop lethal hyperkalemia from denervation hypersensitivity; (5) Definitive treatment: IVIG (0.4 g/kg/day for 5 days) or plasmapheresis — both are equally effective and should be initiated early. Corticosteroids are NOT effective in GBS.",
    learningObjective: "Recognize GBS as a shock emergency due to autonomic dysfunction and monitor vital capacity for impending respiratory failure",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "GBS patients can develop sudden cardiac arrest from autonomic dysfunction — continuous cardiac monitoring and external pacing capability are mandatory",
    clinicalPearls: [
      "20/30/40 rule for GBS intubation: VC <20 mL/kg, NIF <-30 cmH2O, or >40% decline from peak VC",
      "Autonomic dysfunction in GBS can cause sudden asystole — have transcutaneous pacing at the bedside",
      "NEVER use succinylcholine in GBS — risk of lethal hyperkalemia from denervation hypersensitivity"
    ],
    safetyNote: "Corticosteroids are NOT effective in GBS and should not be used — this is different from most autoimmune conditions. IVIG or plasmapheresis are the treatments.",
    distractorRationales: [
      "Myasthenia gravis has a descending (not ascending) weakness pattern and fluctuating symptoms — GBS is ascending with areflexia",
      "Botulism causes descending paralysis starting from cranial nerves — not the ascending pattern seen here",
      "MS does not cause areflexia (it causes hyperreflexia from upper motor neuron lesions) and does not present with acute ascending weakness"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 62-year-old male with heart failure and an ICD (implantable cardioverter-defibrillator) presents to the ED reporting that his ICD has fired 5 times in the past hour. He is diaphoretic and anxious. His rhythm shows polymorphic ventricular tachycardia that converts to sinus rhythm after each shock. What is the emergency management priority?",
    options: [
      "Disable the ICD — it is malfunctioning and causing unnecessary shocks",
      "Treat the underlying cause of the electrical storm — administer IV amiodarone and IV beta-blocker (esmolol or metoprolol), correct electrolytes, and sedate the patient for comfort while keeping the ICD active",
      "Perform external cardioversion to override the ICD",
      "Remove the ICD immediately and place transcutaneous pacing pads"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is experiencing 'electrical storm' (also called VT storm or arrhythmic storm), defined as ≥3 sustained episodes of ventricular tachycardia (VT) or ventricular fibrillation (VF) within 24 hours. The ICD is functioning CORRECTLY — it is detecting and appropriately treating the life-threatening arrhythmia. The problem is not the device but the underlying arrhythmogenic substrate causing recurrent VT. Disabling the ICD would be potentially fatal, as the next VT episode might degenerate into VF without the ICD available to terminate it. Management of electrical storm: (1) IV AMIODARONE — 150 mg IV bolus over 10 minutes, followed by infusion of 1 mg/min for 6 hours, then 0.5 mg/min for 18 hours. Amiodarone is a class III antiarrhythmic that blocks potassium, sodium, and calcium channels, and has antiadrenergic properties. It raises the VT/VF threshold and reduces the frequency of ICD discharges; (2) IV BETA-BLOCKER — Esmolol (loading dose 500 mcg/kg over 1 minute, then 50-200 mcg/kg/min infusion) or metoprolol (5 mg IV every 5 minutes for up to 3 doses). Beta-blockers reduce the sympathetic drive that perpetuates the arrhythmia cycle. The ICD shocks themselves cause pain, fear, and catecholamine release, which in turn can trigger more VT — creating a vicious cycle of shock → sympathetic surge → VT → shock. Beta-blockade breaks this cycle; (3) ELECTROLYTE CORRECTION — Check and aggressively correct magnesium (target >2.0 mg/dL) and potassium (target >4.0 mEq/L). Both are critical for myocardial electrical stability; (4) SEDATION — IV midazolam or propofol for anxiolysis and comfort. The psychological trauma of repeated ICD shocks is significant, and the stress response perpetuates the arrhythmia; (5) IDENTIFY AND TREAT REVERSIBLE CAUSES — acute ischemia (consider repeat coronary angiography), electrolyte abnormalities, medication changes, worsening heart failure, or thyroid dysfunction; (6) If pharmacological therapy fails, catheter ablation of the VT focus may be needed as a definitive intervention. The ICD should remain ACTIVE throughout — it is the safety net preventing sudden cardiac death between treatment interventions.",
    learningObjective: "Manage ICD electrical storm with IV amiodarone, beta-blockade, and electrolyte correction while keeping the ICD active",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The ICD is working CORRECTLY in electrical storm — the device is appropriately treating recurrent VT/VF. Do NOT disable it. Treat the underlying arrhythmia.",
    clinicalPearls: [
      "Electrical storm: ≥3 sustained VT/VF episodes in 24 hours — treat the arrhythmia, not the device",
      "ICD shocks cause pain → sympathetic surge → more VT → more shocks — beta-blockade breaks this vicious cycle",
      "Target K+ >4.0 and Mg2+ >2.0 in electrical storm — both are critical for myocardial electrical stability"
    ],
    safetyNote: "Place a magnet over the ICD ONLY if the device is delivering INAPPROPRIATE shocks (e.g., shocking sinus tachycardia interpreted as VT) — a magnet disables tachyarrhythmia detection but the patient loses the safety net",
    distractorRationales: [
      "Disabling the ICD in the setting of recurrent VT would leave the patient without protection from sudden cardiac death",
      "External cardioversion does not address the underlying arrhythmia substrate and the ICD is already providing this function",
      "ICD removal is an elective procedure — in the acute setting, the focus is on treating the arrhythmia while the device provides backup protection"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 75-year-old female with a history of atrial fibrillation and mechanical mitral valve presents to the ED with sudden-onset left-sided weakness and facial droop. Her INR is 4.2 (supratherapeutic). CT head shows a large left MCA territory intracerebral hemorrhage. She is becoming progressively obtunded with BP 200/110. What is the immediate priority for this anticoagulation-related intracranial hemorrhage?",
    options: [
      "Administer tPA for the acute stroke symptoms",
      "Emergent INR reversal with IV vitamin K, 4-factor prothrombin complex concentrate (4F-PCC), and aggressive blood pressure reduction to ≤140 mmHg systolic to limit hematoma expansion",
      "Administer protamine sulfate to reverse the warfarin",
      "Observe the patient and recheck CT in 24 hours — anticoagulation-related hemorrhages are typically self-limited"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has anticoagulant-associated intracerebral hemorrhage (ICH), the most devastating complication of warfarin therapy. ICH in the setting of supratherapeutic anticoagulation (INR 4.2) has a particularly high mortality (50-60% at 30 days) because the coagulopathy promotes ongoing bleeding and HEMATOMA EXPANSION — the single most important modifiable prognostic factor. Hematoma expansion occurs in 40-70% of warfarin-associated ICH within the first few hours. IMMEDIATE PRIORITIES: (1) EMERGENT INR REVERSAL — The goal is to normalize the INR as rapidly as possible (target INR ≤1.4): (a) 4-FACTOR PROTHROMBIN COMPLEX CONCENTRATE (4F-PCC, e.g., Kcentra) — This is the preferred reversal agent because it provides immediate INR normalization within 10-15 minutes. 4F-PCC contains concentrated factors II, VII, IX, and X plus proteins C and S. Dosing is INR-based: INR 4-6 → 35 units/kg; INR >6 → 50 units/kg; (b) IV VITAMIN K (phytonadione) 10 mg IV over 10-20 minutes — Vitamin K must be given CONCURRENTLY with 4F-PCC because PCC factors have a finite half-life (6-8 hours) and without vitamin K, the INR will re-elevate when the PCC factors are consumed. Vitamin K takes 6-12 hours to produce new functional clotting factors via hepatic synthesis; (c) FFP is NO LONGER the preferred agent — it requires thawing time (30-45 minutes), large volumes (15-30 mL/kg = 1,000-2,000 mL), and provides slower/less reliable INR normalization compared to PCC. (2) AGGRESSIVE BLOOD PRESSURE REDUCTION — Target systolic BP ≤140 mmHg (INTERACT2 and ATACH-2 trials). IV nicardipine or labetalol infusions are preferred. Elevated blood pressure drives continued bleeding and hematoma expansion. (3) NEUROSURGICAL CONSULTATION — for potential surgical evacuation of the hematoma, especially if >30 mL, superficial location, or progressive neurological decline. tPA is ABSOLUTELY CONTRAINDICATED — this is an ICH (hemorrhagic stroke), not an ischemic stroke. Administering tPA would catastrophically worsen the hemorrhage. Protamine reverses heparin, not warfarin — it has no role here.",
    learningObjective: "Reverse warfarin-associated ICH with 4-factor PCC plus IV vitamin K and aggressively reduce blood pressure to limit hematoma expansion",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 5,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Give 4F-PCC AND vitamin K together — PCC provides immediate reversal, vitamin K sustains the reversal after PCC factors are consumed",
    clinicalPearls: [
      "4F-PCC normalizes INR within 10-15 minutes — far superior to FFP (requires thawing, large volumes, slower onset)",
      "Hematoma expansion in warfarin ICH occurs in 40-70% of patients — every minute of delay in reversal worsens outcomes",
      "Target SBP ≤140 mmHg in acute ICH — reduces hematoma expansion and improves functional outcomes"
    ],
    safetyNote: "NEVER administer tPA to a patient with intracranial hemorrhage — this is the most important contraindication. CT MUST be completed before thrombolytics in any stroke.",
    distractorRationales: [
      "tPA is for ISCHEMIC stroke — in ICH it would cause fatal hemorrhage expansion. This is an absolute contraindication.",
      "Protamine reverses heparin, not warfarin — different anticoagulants require different reversal agents",
      "Anticoagulant ICH is NOT self-limited — without emergent reversal, hematoma expansion occurs in the majority of patients with high mortality"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 29-year-old male with sickle cell disease presents to the ED with severe chest pain, fever of 39.2°C, cough, bilateral infiltrates on chest X-ray, and an SpO2 of 85% on room air. His hemoglobin is 5.8 g/dL (baseline 8.0). He is tachycardic (HR 130) and hypotensive (BP 80/50). What is this life-threatening complication, and what are the treatment priorities?",
    options: [
      "Community-acquired pneumonia — antibiotics and supplemental oxygen are sufficient",
      "Acute chest syndrome (ACS) — the treatment priorities are supplemental oxygen, simple or exchange transfusion to reduce HbS% below 30%, IV antibiotics, pain management, and incentive spirometry to prevent atelectasis",
      "Pulmonary embolism — systemic thrombolysis is indicated",
      "Acute respiratory distress syndrome — prone positioning and lung-protective ventilation"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has acute chest syndrome (ACS), the leading cause of death and second most common cause of hospitalization in sickle cell disease. ACS is defined as a new pulmonary infiltrate on chest X-ray in a patient with sickle cell disease, accompanied by one or more of: fever, chest pain, respiratory symptoms, or hypoxemia. ACS can be triggered by multiple mechanisms: (1) FAT EMBOLISM from bone marrow necrosis (the most common trigger in adults); (2) Infection (bacterial pneumonia, particularly Streptococcus pneumoniae, Mycoplasma, and Chlamydia); (3) Pulmonary infarction from in-situ sickling of RBCs in the pulmonary vasculature; (4) Hypoventilation from pain (rib/chest pain causes splinting, leading to atelectasis that promotes sickling in the poorly ventilated lung segments — creating a vicious cycle). This patient is critically ill with hemodynamic instability, making this a severe ACS with potential for rapid deterioration to multiorgan failure. Treatment priorities: (1) SUPPLEMENTAL OXYGEN — Target SpO2 ≥95%. Hypoxemia promotes further sickling, creating a vicious cycle. May need high-flow nasal cannula, BiPAP, or intubation; (2) TRANSFUSION — This is the most critical intervention. Simple transfusion (goal hemoglobin 10 g/dL) or exchange transfusion (automated erythrocytapheresis) to reduce the HbS percentage below 30%. Exchange transfusion is preferred in severe ACS because it reduces HbS without increasing blood viscosity (simple transfusion can increase viscosity by raising hemoglobin above 10-11 g/dL). The new, normal HbA red cells improve oxygen delivery and do not sickle; (3) BROAD-SPECTRUM IV ANTIBIOTICS — Must cover typical AND atypical organisms: ceftriaxone (for typical bacteria including pneumococcus) PLUS azithromycin or doxycycline (for Mycoplasma and Chlamydia); (4) PAIN MANAGEMENT — Adequate analgesia (IV opioids) to prevent splinting and hypoventilation. Undertreatment of pain promotes atelectasis and worsens ACS; (5) INCENTIVE SPIROMETRY — 10 breaths every 2 hours while awake to prevent atelectasis. Studies show incentive spirometry reduces ACS incidence in hospitalized sickle cell patients with chest/rib pain; (6) IV FLUID HYDRATION — cautious hydration (avoid fluid overload which can worsen pulmonary edema); (7) Bronchodilators if wheezing is present. Do NOT over-transfuse — hemoglobin should not exceed 10-11 g/dL because increased viscosity from higher hemoglobin levels can paradoxically worsen sickling in the microvasculature.",
    learningObjective: "Diagnose acute chest syndrome in sickle cell disease and prioritize transfusion therapy, antibiotics, and incentive spirometry",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do NOT transfuse hemoglobin above 10-11 g/dL in sickle cell disease — increased viscosity worsens sickling. Exchange transfusion is preferred in severe ACS.",
    clinicalPearls: [
      "ACS = new infiltrate + fever/respiratory symptoms in sickle cell — leading cause of death in SCD",
      "Exchange transfusion reduces HbS% without increasing viscosity — preferred over simple transfusion in severe ACS",
      "Incentive spirometry every 2 hours prevents atelectasis — proven to reduce ACS incidence in hospitalized SCD patients"
    ],
    safetyNote: "Undertreating pain in sickle cell patients causes splinting and hypoventilation, which promotes atelectasis and worsens ACS — adequate analgesia is a MEDICAL necessity",
    distractorRationales: [
      "Simple pneumonia treatment alone is insufficient — ACS requires transfusion therapy and the full ACS protocol",
      "While PE can occur in SCD, the bilateral infiltrates and clinical picture are more consistent with ACS — and thrombolysis is not first-line",
      "ARDS management alone misses the sickle-cell-specific interventions (transfusion, incentive spirometry) that are essential for ACS"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 45-year-old male is brought to the ED by EMS in cardiac arrest. ROSC is achieved after 12 minutes of CPR. His post-ROSC ECG shows no ST elevation. His temperature is 37.2°C. Should targeted temperature management (TTM) be initiated despite the lack of STEMI?",
    options: [
      "No — TTM is only indicated for cardiac arrest caused by STEMI",
      "Yes — TTM (32-36°C for 24 hours) is recommended for ALL comatose adult patients after cardiac arrest regardless of the initial rhythm or cause, to reduce hypoxic-ischemic brain injury",
      "No — TTM is only indicated for witnessed VF arrest with bystander CPR",
      "Only if the patient has persistent neurological deficits at 6 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "Targeted temperature management (TTM) is recommended for ALL comatose adult patients after cardiac arrest, regardless of the initial rhythm (VF/VT or PEA/asystole), regardless of the location of arrest (in-hospital or out-of-hospital), and regardless of the underlying cause (cardiac or non-cardiac). The key criterion is that the patient remains comatose (does not follow commands) after ROSC. The evidence basis has evolved: the landmark 2002 HACA and Bernard trials demonstrated benefit of hypothermia (32-34°C) specifically in VF arrest. Subsequent studies (TTM trial 2013, TTM2 trial 2021) showed that the critical factor is AVOIDING HYPERTHERMIA (>37.7°C) rather than achieving a specific temperature target. Current guidelines recommend maintaining temperature at 32-36°C for at least 24 hours after cardiac arrest. The neuroprotective mechanisms include: (1) Reduced cerebral metabolic rate (6-10% reduction per degree Celsius below 37°C), slowing the cascade of cellular injury; (2) Decreased excitotoxic neurotransmitter release (glutamate) — excessive glutamate triggers calcium influx into neurons, causing cell death; (3) Reduced free radical production and oxidative stress; (4) Attenuation of the post-ischemic inflammatory response; (5) Preservation of the blood-brain barrier integrity; (6) Reduced cerebral edema. Implementation: (1) Begin cooling as soon as possible after ROSC; (2) Methods: cold IV saline (4°C, 30 mL/kg), surface cooling devices (Arctic Sun, cooling blankets), endovascular cooling catheters; (3) Monitor core temperature continuously (esophageal or bladder probe); (4) Manage shivering aggressively — shivering generates heat and increases metabolic demand, counteracting the cooling effort. Use buspirone, acetaminophen, surface counter-warming, magnesium, dexmedetomidine, or if refractory, neuromuscular blockade with cisatracurium; (5) Monitor for complications: bradycardia (usually does not require treatment unless hemodynamically significant), QT prolongation, electrolyte shifts (K+ and Mg2+ decrease during cooling and INCREASE during rewarming — monitor closely), hyperglycemia (insulin resistance occurs during hypothermia), and increased infection risk; (6) REWARM SLOWLY (0.25-0.5°C per hour) after the cooling period; (7) PREVENT FEVER for at least 72 hours after ROSC — fever in the post-arrest period independently worsens neurological outcomes.",
    learningObjective: "Apply TTM to all comatose post-cardiac arrest patients regardless of initial rhythm or cause, and manage cooling complications",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "TTM is for ALL comatose post-arrest patients — not just VF arrest, not just STEMI. The key criterion is persistent coma after ROSC.",
    clinicalPearls: [
      "TTM indication: any adult who remains comatose after ROSC — regardless of initial rhythm, location, or cause of arrest",
      "Electrolytes shift during TTM: K+ and Mg2+ decrease during cooling and REBOUND during rewarming — monitor every 4-6 hours",
      "Shivering is the enemy of cooling — manage aggressively to maintain target temperature"
    ],
    safetyNote: "Neurological prognostication should be delayed at least 72 hours after ROSC and after rewarming — earlier assessment is unreliable and can lead to premature withdrawal of care",
    distractorRationales: [
      "TTM is not limited to STEMI-related cardiac arrest — all comatose post-arrest patients benefit from temperature control",
      "TTM benefit extends beyond witnessed VF arrest — guidelines now recommend it for all arrest rhythms",
      "Waiting 6 hours to decide on TTM misses the critical window — cooling should begin as soon as possible after ROSC"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 60-year-old male with known abdominal aortic aneurysm (AAA) presents to the ED with sudden-onset severe abdominal and back pain. He is diaphoretic with BP 70/40 and HR 130. On palpation, a pulsatile abdominal mass is felt. What is the critical decision the emergency team faces regarding blood pressure management?",
    options: [
      "Raise the blood pressure to normal (MAP >80 mmHg) with aggressive fluid resuscitation and vasopressors",
      "Maintain permissive hypotension (target systolic 80-90 mmHg or MAP 50-60 mmHg) to limit hemorrhage while rapidly preparing for emergent surgical repair — aggressive volume resuscitation can disrupt clot formation and worsen bleeding",
      "Administer IV antihypertensives to prevent aneurysm rupture",
      "Blood pressure management is not important — focus only on rapid surgical transfer"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has a ruptured abdominal aortic aneurysm (rAAA), one of the most time-critical surgical emergencies in medicine. The mortality of rAAA is approximately 80% overall and 50% even with surgical repair. The critical concept in rAAA resuscitation is PERMISSIVE HYPOTENSION (also called hypotensive resuscitation or controlled hypotension). The rationale for permissive hypotension: When an aortic aneurysm ruptures, the initial hemorrhage is often temporarily contained by a retroperitoneal hematoma and fragile clot formation at the rupture site. This 'contained rupture' is what allows the patient to survive long enough to reach the hospital. Aggressive fluid resuscitation that raises the blood pressure to normal levels can: (1) DISRUPT THE CLOT — increased blood pressure creates higher shear stress at the rupture site, dislodging the fragile clot and converting a contained rupture into free intraperitoneal hemorrhage (which is rapidly fatal); (2) DILUTE CLOTTING FACTORS — large-volume crystalloid resuscitation causes dilutional coagulopathy, further impairing the body's ability to form and maintain the clot; (3) WORSEN HYPOTHERMIA — room-temperature IV fluids cause hypothermia, which impairs coagulation (the lethal triad). The target is systolic BP 80-90 mmHg or MAP 50-60 mmHg — enough to maintain consciousness and minimal organ perfusion but not enough to disrupt the containing clot. Fluid resuscitation should be limited to small, judicious boluses (250 mL at a time) titrated to the minimum acceptable blood pressure. If blood products are available, they are preferred over crystalloid. The ONLY definitive treatment is emergent surgical repair — either open surgical repair (laparotomy with aortic cross-clamping and graft placement) or endovascular aneurysm repair (EVAR) if the anatomy is suitable and the team is available. Every minute of delay to the OR increases mortality. Emergency nursing priorities: (1) Two large-bore IV access; (2) Type and crossmatch for at least 6 units PRBCs plus activate massive transfusion protocol; (3) Maintain permissive hypotension; (4) Notify the OR and vascular surgery immediately; (5) NPO; (6) Keep the patient warm; (7) Have uncrossmatched O-negative blood available. Do NOT send the patient for CT if the diagnosis is clinically obvious and the patient is hemodynamically unstable — CT only delays surgical intervention.",
    learningObjective: "Apply permissive hypotension in ruptured AAA to maintain clot integrity while preparing for emergent surgical repair",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do NOT normalize blood pressure in ruptured AAA — aggressive resuscitation disrupts the containing clot and converts contained rupture to free rupture",
    clinicalPearls: [
      "Permissive hypotension in rAAA: target SBP 80-90 mmHg — enough for consciousness, not enough to disrupt the clot",
      "Pulsatile abdominal mass + acute pain + hypotension = ruptured AAA until proven otherwise — do NOT delay for CT if clinically obvious",
      "rAAA mortality: 80% overall, 50% even with surgery — time to OR is the most important variable"
    ],
    safetyNote: "Do NOT send hemodynamically unstable rAAA patients to CT — clinical diagnosis is sufficient to proceed directly to the OR. CT delays only benefit stable patients where the diagnosis is uncertain.",
    distractorRationales: [
      "Raising BP to normal levels disrupts clot formation at the rupture site — this can convert a survivable contained rupture to a non-survivable free rupture",
      "Antihypertensives are for INTACT aneurysms to prevent rupture — not for an already ruptured AAA with hemorrhagic shock",
      "Blood pressure management is critically important — permissive hypotension is a key evidence-based strategy that improves survival"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A nurse in the ED is caring for a patient in septic shock who requires central venous access for vasopressor administration. During internal jugular central line placement, the patient suddenly develops respiratory distress, decreased breath sounds on the ipsilateral side, and tracheal deviation toward the contralateral side. What iatrogenic complication has occurred?",
    options: [
      "Air embolism from the central line insertion",
      "Iatrogenic pneumothorax progressing to tension pneumothorax — the introducing needle punctured the lung apex, and positive-pressure ventilation is converting a simple pneumothorax to tension physiology",
      "Hemothorax from subclavian artery laceration",
      "Phrenic nerve injury causing diaphragm paralysis"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has developed an iatrogenic pneumothorax that has progressed to tension pneumothorax as a complication of internal jugular (IJ) central line placement. The IJ vein is anatomically close to the lung apex, and during needle insertion (particularly if the needle trajectory is too posterior or too low), the lung can be punctured, allowing air to enter the pleural space. If the patient is on positive-pressure mechanical ventilation (as many septic shock patients are), each ventilator breath can force additional air through the puncture site into the pleural space. Because the puncture acts as a one-way valve (air enters during positive-pressure inspiration but cannot escape during expiration), pressure builds progressively in the pleural space — this is the mechanism of tension pneumothorax. The classic findings of tension pneumothorax include: (1) Acute respiratory distress (the ipsilateral lung is collapsed and the contralateral lung may be compressed); (2) Decreased or absent breath sounds on the affected side; (3) Tracheal deviation AWAY from the affected side (the mediastinum is pushed contralaterally by the increasing pleural pressure); (4) Hypotension (the increased intrathoracic pressure compresses the vena cava, reducing venous return and cardiac output); (5) JVD (venous congestion from impaired venous return); (6) Hyperresonance to percussion on the affected side (air in the pleural space). Immediate management: (1) NEEDLE DECOMPRESSION — 14-gauge angiocatheter inserted in the 2nd intercostal space, midclavicular line, or the 5th intercostal space, anterior axillary line on the affected side. This converts the tension pneumothorax to a simple pneumothorax by releasing the trapped pressure; (2) CHEST TUBE placement (28-32 Fr) for definitive drainage; (3) Confirm with chest X-ray after stabilization. This complication reinforces the importance of: (1) Ultrasound-guided central line placement — real-time ultrasound visualization of the needle and the IJ vein reduces the risk of pneumothorax by ensuring the needle enters the vein and does not travel too deep; (2) Post-procedure chest X-ray — mandatory after any IJ or subclavian central line placement to evaluate for pneumothorax, hemothorax, and confirm line position; (3) Having the patient in Trendelenburg position during IJ access (reduces air embolism risk and distends the IJ vein). The subclavian approach carries a higher pneumothorax risk than the IJ approach, and the femoral approach has virtually no pneumothorax risk (but higher infection rates for long-term use).",
    learningObjective: "Recognize iatrogenic tension pneumothorax from central line placement and perform emergent needle decompression",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "ALWAYS obtain a post-procedure chest X-ray after IJ or subclavian central line placement — pneumothorax may be present but asymptomatic initially",
    clinicalPearls: [
      "Ultrasound-guided central line placement significantly reduces pneumothorax risk — it is now the standard of care",
      "Tension pneumothorax is a CLINICAL diagnosis — do NOT delay needle decompression for imaging",
      "Subclavian lines have higher pneumothorax risk than IJ; femoral lines have virtually zero pneumothorax risk"
    ],
    safetyNote: "If a patient develops respiratory distress during or immediately after central line placement, assume iatrogenic pneumothorax until proven otherwise — have needle decompression supplies at every central line insertion",
    distractorRationales: [
      "Air embolism causes acute cardiovascular collapse with a 'mill wheel' murmur — not the unilateral breath sound changes described",
      "Hemothorax causes dullness (not hyperresonance) to percussion and would not typically cause tracheal deviation unless massive",
      "Phrenic nerve injury causes elevated hemidiaphragm but not acute respiratory distress with tracheal deviation"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 40-year-old female is admitted to the ICU with septic shock. She is on norepinephrine 15 mcg/min with MAP 68 mmHg. The nurse notes that her urine output has been 15 mL/hour for the past 3 hours (0.2 mL/kg/hr). Labs show creatinine rising from 1.0 to 2.8 mg/dL. What is the target urine output in sepsis resuscitation, and should 'renal-dose' dopamine be considered?",
    options: [
      "Target urine output 100 mL/hr — administer furosemide to achieve this goal",
      "Target urine output ≥0.5 mL/kg/hr — 'renal-dose' dopamine is NOT recommended as it has been definitively proven to have no renal protective benefit in multiple randomized trials",
      "Urine output is not a useful resuscitation marker in sepsis — rely only on lactate clearance",
      "Target urine output ≥2 mL/kg/hr — this requires aggressive diuretic therapy"
    ],
    correctAnswer: 1,
    rationaleLong: "The target urine output in sepsis resuscitation is ≥0.5 mL/kg/hour (approximately 35 mL/hour for a 70 kg patient). This patient's urine output of 0.2 mL/kg/hr is significantly below target and, combined with the rising creatinine, indicates acute kidney injury (AKI) from either inadequate renal perfusion (pre-renal AKI from sepsis-mediated hypotension and microvascular dysfunction) or sepsis-related direct tubular injury. Urine output is one of the key resuscitation endpoints recommended by the Surviving Sepsis Campaign, along with MAP ≥65 mmHg and lactate clearance ≥10-20% every 2 hours. However, it is important to note that oliguria in sepsis is multifactorial and may persist even with adequate resuscitation due to direct tubular injury. Regarding 'renal-dose' dopamine: LOW-DOSE DOPAMINE (1-3 mcg/kg/min, so-called 'renal dose') was historically used with the belief that it selectively dilated renal arteries via dopamine D1 receptors, increasing renal blood flow and urine output, thereby protecting against or treating AKI. This theory has been DEFINITIVELY DISPROVEN by multiple large randomized controlled trials, most notably the Australian and New Zealand Intensive Care Society (ANZICS) trial by Bellomo et al. (2000, Lancet) — a 328-patient RCT that showed NO difference in peak creatinine, need for dialysis, ICU length of stay, or mortality between low-dose dopamine and placebo. While low-dose dopamine does increase urine output (through dopaminergic effects on renal tubular sodium reabsorption — causing natriuresis), this increased urine output does NOT translate to improved renal outcomes. The kidneys simply excrete more dilute urine without any protective effect on glomerular filtration or tubular function. Current evidence-based interventions for AKI prevention in sepsis: (1) Adequate fluid resuscitation to optimize renal perfusion; (2) MAP ≥65 mmHg (some evidence suggests targeting MAP 80-85 mmHg may benefit patients with chronic hypertension); (3) Avoid nephrotoxic agents (NSAIDs, aminoglycosides, IV contrast when possible); (4) Early initiation of renal replacement therapy (CRRT) if standard criteria for dialysis are met (refractory hyperkalemia, severe acidosis, volume overload, uremic symptoms).",
    learningObjective: "Target urine output ≥0.5 mL/kg/hr in sepsis resuscitation and recognize that 'renal-dose' dopamine has no renal protective benefit",
    blueprintCategory: "Shock",
    subtopic: "septic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "'Renal-dose' dopamine is DEFINITIVELY DISPROVEN — it increases urine output but provides zero renal protection. Never order or administer it.",
    clinicalPearls: [
      "Target urine output ≥0.5 mL/kg/hr in sepsis — but oliguria may persist despite adequate resuscitation due to direct tubular injury",
      "Low-dose dopamine increases urine output via natriuresis but provides NO renal protection — definitively disproven by RCTs",
      "AKI in sepsis is multifactorial: hypoperfusion + microvascular dysfunction + direct inflammatory tubular injury"
    ],
    safetyNote: "Avoid nephrotoxic agents in septic patients: contrast dye, NSAIDs, aminoglycosides — each additional nephrotoxic exposure compounds AKI risk",
    distractorRationales: [
      "Forcing urine output to 100 mL/hr with furosemide risks dehydration and worsening renal perfusion — furosemide does not protect against AKI",
      "Urine output IS a useful resuscitation marker — it is one of the three key endpoints recommended by SSC alongside MAP and lactate",
      "Targeting 2 mL/kg/hr is excessive and would require aggressive diuretics that could worsen hemodynamic instability"
    ],
    lessonPath: "/emergency/lessons/septic-shock"
  },
  {
    stem: "A 18-year-old male with known severe peanut allergy accidentally ingested peanut butter. He presents with generalized urticaria, facial angioedema, wheezing, and throat tightness. He used his EpiPen (0.3 mg IM) before arrival. In the ED, his symptoms persist: BP 95/60, HR 115, with continued wheezing and stridor. The nurse prepares to administer a second dose of IM epinephrine. In addition to repeat epinephrine, what is the critical ADJUNCT medication for persistent bronchospasm in anaphylaxis?",
    options: [
      "IV corticosteroids alone are sufficient for bronchospasm — epinephrine only treats the hypotension",
      "Nebulized albuterol (2.5-5 mg) should be administered for persistent bronchospasm — albuterol is a beta-2 agonist that provides additional bronchodilation beyond what epinephrine achieves",
      "Nebulized ipratropium alone is the first-choice bronchodilator in anaphylaxis",
      "IV aminophylline should be administered for refractory bronchospasm"
    ],
    correctAnswer: 1,
    rationaleLong: "In anaphylaxis with persistent bronchospasm despite IM epinephrine, nebulized albuterol (salbutamol) is the critical adjunct medication. While epinephrine is the first-line treatment for ALL manifestations of anaphylaxis (it has alpha-1 effects for vasoconstriction and blood pressure support, beta-1 effects for cardiac output, and beta-2 effects for bronchodilation and reduced mediator release from mast cells), the beta-2 bronchodilatory effect of IM epinephrine may be insufficient to fully reverse severe bronchospasm. Nebulized albuterol provides additional, targeted beta-2 agonism directly to the airways. Albuterol dosing in anaphylactic bronchospasm: 2.5-5 mg (0.5-1 mL of 0.5% solution) via nebulizer, can be repeated every 15-20 minutes or given continuously if needed. Albuterol acts directly on beta-2 receptors in bronchial smooth muscle, causing relaxation and bronchodilation. In severe cases, continuous nebulization (10-15 mg/hour) may be needed. Adding ipratropium (0.5 mg) to the albuterol nebulization provides additional anticholinergic bronchodilation through a different mechanism and is reasonable as an adjunct, but ipratropium alone is NOT the first-choice bronchodilator — albuterol has a faster onset and more potent bronchodilatory effect. The complete medication approach for anaphylaxis includes: (1) EPINEPHRINE IM — first-line, repeat every 5-15 minutes as needed; (2) Nebulized albuterol — for persistent bronchospasm; (3) H1 antihistamine — diphenhydramine 50 mg IV (treats urticaria and pruritus but does NOT treat bronchospasm or hypotension); (4) H2 antihistamine — famotidine 20 mg IV (may help with some GI and cardiovascular symptoms); (5) Corticosteroids — methylprednisolone 125 mg IV or dexamethasone 10 mg IV (onset 4-6 hours, used to potentially prevent biphasic reactions but does NOT treat the acute phase); (6) IV normal saline bolus — 1-2 L for hypotension (anaphylaxis causes massive vasodilation and capillary leak); (7) Glucagon 1-5 mg IV — specifically for patients on beta-blockers who are not responding to epinephrine (glucagon increases cAMP through a non-beta-receptor pathway, providing inotropic and bronchodilatory effects independent of beta-receptor stimulation).",
    learningObjective: "Add nebulized albuterol as an adjunct to epinephrine for persistent bronchospasm in anaphylaxis and understand the complete medication algorithm",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Patients on beta-blockers may not respond to epinephrine — glucagon 1-5 mg IV bypasses the blocked beta-receptors and is the rescue agent",
    clinicalPearls: [
      "Nebulized albuterol targets airways directly — essential adjunct when IM epinephrine does not fully resolve bronchospasm",
      "Glucagon is the rescue agent for anaphylaxis in patients on beta-blockers — works through non-beta receptor cAMP pathway",
      "Corticosteroids take 4-6 hours to work — they do NOT treat the acute phase of anaphylaxis"
    ],
    safetyNote: "If the patient has stridor (upper airway edema) in addition to wheezing (lower airway bronchospasm), nebulized racemic epinephrine (0.5 mL of 2.25% in 3 mL NS) can reduce laryngeal edema",
    distractorRationales: [
      "Corticosteroids do not treat acute bronchospasm — their onset of action is hours, and they should never be relied upon for immediate symptom relief",
      "Ipratropium is a useful adjunct but has slower onset and less potent bronchodilation than albuterol — it should be combined with albuterol, not used alone",
      "IV aminophylline has a narrow therapeutic index and significant toxicity — it is no longer recommended for acute bronchospasm when safer alternatives exist"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  }
];
