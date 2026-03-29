import { EmergencyNursingQuestion } from "./types";

export const shockBatch3Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 56-year-old male presents to the ED with septic shock from necrotizing fasciitis of the right lower extremity. Despite aggressive resuscitation with 60 mL/kg crystalloid, norepinephrine at 25 mcg/min, vasopressin at 0.04 units/min, and stress-dose hydrocortisone, his MAP remains 52 mmHg. What is the next vasopressor to add?",
    options: [
      "Phenylephrine as a third vasopressor",
      "Epinephrine as the third-line vasopressor — it provides additional alpha-1, beta-1, and beta-2 effects through a different adrenergic receptor binding profile",
      "Dopamine at renal-dose for kidney protection",
      "Nitroprusside to reduce afterload"
    ],
    correctAnswer: 1,
    rationaleLong: "In refractory septic shock failing norepinephrine plus vasopressin, epinephrine is the recommended third-line vasopressor per the Surviving Sepsis Campaign guidelines. Epinephrine is one of the most potent catecholamines, providing: (1) ALPHA-1 AGONISM — potent vasoconstriction (similar to norepinephrine); (2) BETA-1 AGONISM — significant inotropic and chronotropic effects (increases cardiac contractility and heart rate); (3) BETA-2 AGONISM — bronchodilation and some vasodilation (particularly in skeletal muscle beds). Epinephrine's strong inotropic effect can be particularly beneficial in late septic shock where myocardial depression (septic cardiomyopathy) has developed, causing a mixed distributive/cardiogenic shock picture. The typical starting dose is 0.01-0.05 mcg/kg/min (1-5 mcg/min for a 70 kg patient), titrated to MAP target. Important consideration: epinephrine stimulates beta-2 receptors in skeletal muscle, which promotes aerobic glycolysis (NOT anaerobic metabolism) and can cause lactate elevation. This epinephrine-induced hyperlactatemia is NOT a sign of worsening tissue hypoperfusion — it is a direct pharmacological effect. The emergency nurse must understand this distinction to avoid misinterpreting a rising lactate as treatment failure when epinephrine is the cause. This source of infection (necrotizing fasciitis) requires urgent surgical debridement — source control is the most important determinant of survival in septic shock. No amount of vasopressor or antibiotic therapy will succeed without surgical removal of the necrotic, infected tissue. The nurse should ensure the OR is notified emergently and that the patient is prepared for surgical debridement while continuing resuscitation. 'Low-dose' or 'renal-dose' dopamine has been definitively shown to provide no renal protective benefit and is no longer recommended.",
    learningObjective: "Apply the vasopressor escalation sequence in refractory septic shock and understand epinephrine's pharmacological effects",
    blueprintCategory: "Shock",
    subtopic: "vasopressor management",
    difficulty: 5,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Epinephrine causes lactate elevation through beta-2-mediated aerobic glycolysis — this is NOT a sign of worsening tissue hypoperfusion",
    clinicalPearls: [
      "SSC vasopressor escalation: norepinephrine first → vasopressin second → epinephrine third",
      "Epinephrine-induced hyperlactatemia is a pharmacological effect, not a sign of tissue hypoperfusion",
      "Low-dose dopamine provides NO renal protection — this has been definitively disproven"
    ],
    safetyNote: "Source control (surgical debridement in necrotizing fasciitis) is the most critical intervention — no amount of vasopressors will succeed without removing the infected tissue",
    distractorRationales: [
      "Phenylephrine (pure alpha) lacks inotropic support and may worsen cardiac output in late septic shock with myocardial depression",
      "Low-dose dopamine has no renal protective benefit and is no longer recommended in sepsis",
      "Nitroprusside causes vasodilation and would worsen distributive shock — it is contraindicated"
    ],
    lessonPath: "/emergency/lessons/vasopressor-management"
  },
  {
    stem: "A 35-year-old male presents to the ED after a motorcycle crash with an unstable pelvic fracture. He is in hemorrhagic shock (HR 140, BP 68/38). The massive transfusion protocol has been activated and he has received 6 units of PRBCs, 6 units of FFP, and 1 unit of platelets. His temperature is now 34.8°C, INR is 2.4, and pH is 7.18. What dangerous triad is developing?",
    options: [
      "Beck's triad of cardiac tamponade",
      "The lethal triad of trauma: hypothermia, coagulopathy, and metabolic acidosis — each component worsens the others in a vicious cycle",
      "Cushing's triad of increased intracranial pressure",
      "Charcot's triad of cholangitis"
    ],
    correctAnswer: 1,
    rationaleLong: "The lethal triad (also called the trauma triad of death or the vicious cycle of trauma) consists of hypothermia, coagulopathy, and metabolic acidosis. Each component potentiates the others, creating a self-perpetuating downward spiral that, if not interrupted, leads to irreversible physiological failure and death. (1) HYPOTHERMIA (34.8°C in this patient): Results from exposure, massive fluid/blood resuscitation with room-temperature products, open body cavities, and impaired thermoregulation in shock. Hypothermia impairs the coagulation cascade (enzymatic reactions are temperature-dependent — coagulation factors function optimally at 37°C), impairs platelet function, and worsens acidosis by reducing hepatic metabolism of lactate and citrate; (2) COAGULOPATHY (INR 2.4): Results from dilution of coagulation factors by massive resuscitation, consumption of factors in hemorrhage and DIC, hypothermia-induced enzyme dysfunction, acidosis-induced factor dysfunction, and citrate toxicity from banked blood. Coagulopathy prevents hemostasis, perpetuating hemorrhage; (3) METABOLIC ACIDOSIS (pH 7.18): Results from tissue hypoperfusion (lactic acidosis), massive citrate load from transfused blood products, and impaired hepatic clearance. Acidosis impairs coagulation factor function, reduces cardiac contractility, and blunts the response to catecholamines (vasopressors). Interrupting the lethal triad is the goal of damage control resuscitation (DCR) and damage control surgery (DCS): DCR principles include: warm all blood products and IV fluids, use active warming devices (forced-air warming blankets, warmed IV fluid infusers), maintain balanced transfusion ratios (1:1:1 PRBC:FFP:platelets), minimize crystalloid use (which worsens hypothermia and dilutional coagulopathy), administer tranexamic acid (TXA, 1g IV over 10 minutes followed by 1g over 8 hours — reduces fibrinolysis), and correct acidosis by restoring tissue perfusion. DCS involves abbreviated surgical procedures focused only on hemorrhage control and contamination control, leaving definitive repairs for later after the lethal triad is corrected.",
    learningObjective: "Recognize the lethal triad of trauma and implement damage control resuscitation principles",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The lethal triad is self-perpetuating — hypothermia worsens coagulopathy, coagulopathy worsens bleeding causing more acidosis, acidosis worsens coagulopathy. BREAK THE CYCLE.",
    clinicalPearls: [
      "Lethal triad: hypothermia + coagulopathy + acidosis — each worsens the others",
      "Warm ALL blood products and IV fluids — hypothermia is the most easily correctable component",
      "TXA within 3 hours of injury reduces mortality from hemorrhage by approximately 10%"
    ],
    safetyNote: "Monitor temperature continuously during massive resuscitation — hypothermia can develop rapidly and is often overlooked in the chaos of trauma resuscitation",
    distractorRationales: [
      "Beck's triad (JVD, muffled heart sounds, hypotension) is for cardiac tamponade — not the pattern described",
      "Cushing's triad (hypertension, bradycardia, irregular respirations) is for increased ICP — not this pattern",
      "Charcot's triad (fever, jaundice, RUQ pain) is for cholangitis — unrelated to trauma"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 70-year-old female presents to the ED with progressive dyspnea and peripheral edema over 3 weeks. She has a history of breast cancer treated 5 years ago. Physical exam reveals distant heart sounds, JVD, hepatomegaly, and pulsus paradoxus of 18 mmHg. Echocardiogram shows a large circumferential pericardial effusion with right atrial collapse during diastole. Despite fluid resuscitation, her BP drops to 82/54. What is the emergency intervention?",
    options: [
      "CT-guided percutaneous biopsy of the pericardium",
      "Emergency pericardiocentesis with ultrasound guidance to drain the effusion and relieve cardiac tamponade",
      "Start diuretics to reduce fluid overload",
      "Administer IV nitroglycerin for preload reduction"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has cardiac tamponade from a malignant pericardial effusion (history of breast cancer — one of the most common cancers to metastasize to the pericardium). Right atrial collapse during diastole on echocardiogram is one of the most sensitive and specific findings for hemodynamically significant tamponade — it indicates that the intrapericardial pressure exceeds the right atrial pressure during diastole, causing the RA wall to collapse inward. The treatment for hemodynamically significant cardiac tamponade is emergency pericardiocentesis — percutaneous drainage of the pericardial fluid using a needle (typically 18-gauge spinal needle or 16-gauge catheter-over-needle) advanced under ultrasound or fluoroscopic guidance through the subxiphoid approach into the pericardial space. Ultrasound guidance is strongly preferred as it reduces complications (cardiac puncture, pneumothorax, coronary artery laceration). The procedure is dramatically therapeutic: removal of even 20-50 mL of fluid can produce immediate hemodynamic improvement because the pericardial pressure-volume relationship follows a steep curve — once the pericardium reaches its compliance limit, small additional volumes cause large pressure increases (and conversely, small volume removals cause large pressure decreases). The emergency nurse should: position the patient at 30-45 degrees (fluid pools inferiorly), connect the pericardiocentesis needle to an ECG lead for cardiac monitoring during advancement (ST elevation on the needle ECG indicates contact with the epicardium — withdraw slightly), prepare a drainage collection system, send pericardial fluid for cytology, cell count, protein, glucose, and culture, and monitor hemodynamics closely after the procedure. Diuretics are CONTRAINDICATED in tamponade — they reduce preload which is already compromised, worsening cardiac output. Similarly, nitroglycerin reduces preload and would worsen tamponade physiology.",
    learningObjective: "Perform emergency pericardiocentesis for cardiac tamponade and understand why preload reduction is contraindicated",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Diuretics and nitrates are CONTRAINDICATED in cardiac tamponade — they reduce preload which the compromised heart desperately needs to maintain output",
    clinicalPearls: [
      "RA diastolic collapse on echo is highly sensitive and specific for hemodynamically significant tamponade",
      "Removal of as little as 20-50 mL can produce immediate hemodynamic improvement",
      "Breast cancer, lung cancer, and lymphoma are the most common causes of malignant pericardial effusion"
    ],
    safetyNote: "IV fluid bolus can temporarily improve tamponade hemodynamics by increasing preload — use as a bridge while preparing for pericardiocentesis",
    distractorRationales: [
      "Biopsy does not relieve the hemodynamic emergency — drainage must occur first, biopsy can be done from the drained fluid",
      "Diuretics reduce preload which is already compromised — absolutely contraindicated in tamponade",
      "Nitroglycerin reduces preload and would worsen cardiac output in tamponade"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 44-year-old male presents to the ED with sepsis from a perforated diverticulum. He meets qSOFA criteria with altered mental status, RR 24, and SBP 92. His initial lactate is 4.8 mmol/L. The nurse initiates the SSC Hour-1 bundle. What is the significance of the elevated lactate even before the patient becomes hypotensive?",
    options: [
      "Lactate elevation is normal during exercise and stress — it is not clinically significant",
      "Elevated lactate (≥4 mmol/L) indicates tissue hypoperfusion even when blood pressure may appear adequate — it is an early marker of shock before overt hemodynamic decompensation",
      "Lactate is only significant when greater than 10 mmol/L",
      "Lactate should only be checked after fluid resuscitation is complete"
    ],
    correctAnswer: 1,
    rationaleLong: "Lactate elevation is one of the most important early biomarkers of tissue hypoperfusion in sepsis and shock. Serum lactate level greater than or equal to 4 mmol/L (or even greater than 2 mmol/L in some guidelines) indicates that tissues are not receiving adequate oxygen delivery and have shifted to anaerobic metabolism. This is critically important because lactate elevation can PRECEDE overt hemodynamic decompensation (hypotension) — making it a more sensitive early indicator of shock than blood pressure alone. The concept of 'cryptic shock' or 'compensated shock' refers to states where the patient maintains a near-normal blood pressure through compensatory mechanisms (tachycardia, vasoconstriction) but has significant tissue hypoperfusion detectable by elevated lactate. In this patient, the SBP of 92 mmHg might not seem alarming in isolation, but the lactate of 4.8 mmol/L indicates significant tissue-level oxygen deficit. The SSC guidelines specifically identify lactate ≥4 mmol/L as a trigger for aggressive resuscitation (30 mL/kg crystalloid bolus) REGARDLESS of blood pressure — recognizing that this lactate level identifies patients at high risk for poor outcomes who need immediate intervention. The sources of lactate in sepsis include: (1) Tissue hypoperfusion causing anaerobic glycolysis (Type A lactic acidosis — the most common cause in shock); (2) Microcirculatory dysfunction causing regional hypoperfusion despite normal macro-hemodynamics; (3) Accelerated aerobic glycolysis from catecholamine-driven beta-2 stimulation; (4) Impaired hepatic lactate clearance (the liver normally clears approximately 60% of circulating lactate). Serial lactate monitoring guides resuscitation adequacy — a 10-20% decrease over 2-4 hours is associated with improved outcomes, while failure to clear suggests inadequate resuscitation or ongoing source of infection.",
    learningObjective: "Interpret lactate as an early biomarker of tissue hypoperfusion that precedes hemodynamic decompensation",
    blueprintCategory: "Shock",
    subtopic: "early vs late shock recognition",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Lactate ≥4 mmol/L triggers aggressive resuscitation (30 mL/kg crystalloid) REGARDLESS of blood pressure — don't wait for hypotension",
    clinicalPearls: [
      "Cryptic shock: elevated lactate with near-normal blood pressure — tissue hypoperfusion is already occurring",
      "Lactate ≥4 mmol/L is associated with >30% mortality in sepsis — aggressive resuscitation is indicated",
      "The liver clears ~60% of circulating lactate — hepatic dysfunction impairs lactate clearance"
    ],
    safetyNote: "Check lactate on ALL patients with suspected sepsis — it identifies cryptic shock before vital signs deteriorate",
    distractorRationales: [
      "While exercise causes transient lactate elevation, a level of 4.8 in a septic patient indicates pathological tissue hypoperfusion",
      "Lactate levels >2 mmol/L in sepsis are clinically significant — there is no threshold of 10 for significance",
      "Lactate should be checked BEFORE resuscitation as a baseline and then serially to guide therapy"
    ],
    lessonPath: "/emergency/lessons/early-vs-late-shock-recognition"
  },
  {
    stem: "A 65-year-old male presents to the ED in septic shock. He is adequately volume resuscitated and on norepinephrine. His MAP target is 65 mmHg. The attending asks the nurse to titrate the norepinephrine. What is the correct technique for titrating vasopressors?",
    options: [
      "Increase the dose by 50% every 5 minutes until the target MAP is reached",
      "Titrate in small increments (1-2 mcg/min) every 5-10 minutes, reassessing MAP and clinical perfusion markers (urine output, mental status, lactate) with each adjustment",
      "Set the dose at maximum and decrease slowly",
      "Change the entire vasopressor to a different agent if the first dose doesn't work"
    ],
    correctAnswer: 1,
    rationaleLong: "Vasopressor titration is a critical nursing skill that requires understanding of pharmacokinetics, hemodynamic monitoring, and clinical assessment. The principles of safe vasopressor titration include: (1) TITRATE IN SMALL INCREMENTS — norepinephrine is typically titrated in 1-2 mcg/min increments (or 0.01-0.05 mcg/kg/min increments). Large jumps in dosing can cause dangerous overshoot (hypertensive crisis, tachyarrhythmias, organ ischemia); (2) ALLOW TIME FOR EFFECT — norepinephrine has a rapid onset (1-2 minutes) with a peak effect at approximately 5-10 minutes. Reassess the MAP 5-10 minutes after each dose change before making further adjustments; (3) ASSESS CLINICAL ENDPOINTS beyond MAP — MAP is the primary target (≥65 mmHg in septic shock per SSC guidelines), but the nurse should also monitor urine output (target ≥0.5 mL/kg/hr — indicates adequate renal perfusion), mental status (improving cognition indicates adequate cerebral perfusion), skin perfusion (capillary refill, mottling — particularly over the knees), and serial lactate (decreasing lactate indicates improving tissue perfusion); (4) DOCUMENT every dose change with the corresponding MAP and clinical assessment; (5) When WEANING, reduce the dose in small increments (1-2 mcg/min) every 15-30 minutes, closely monitoring for hemodynamic deterioration. Weaning should be attempted once the underlying cause is being treated and the patient demonstrates hemodynamic stability; (6) Use the MINIMUM effective dose — higher vasopressor doses increase the risk of arrhythmias, mesenteric ischemia, digital ischemia, and myocardial oxygen demand. The nurse should also be aware that vasopressor extravasation can cause severe tissue necrosis — continuous monitoring of the IV site is essential, and phentolamine should be available for immediate local injection if extravasation occurs.",
    learningObjective: "Apply correct vasopressor titration technique with appropriate monitoring and clinical assessment",
    blueprintCategory: "Shock",
    subtopic: "vasopressor management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "MAP is the primary target, but urine output, mental status, skin perfusion, and lactate clearance are equally important clinical endpoints",
    clinicalPearls: [
      "Titrate in small increments (1-2 mcg/min) every 5-10 minutes",
      "Monitor clinical endpoints beyond MAP: urine output, mental status, skin perfusion, lactate",
      "Knee mottling score correlates with lactate levels and mortality — a useful bedside assessment"
    ],
    safetyNote: "Vasopressor extravasation causes severe tissue necrosis — monitor IV sites continuously and have phentolamine available for immediate injection if extravasation occurs",
    distractorRationales: [
      "Increasing by 50% every 5 minutes risks dangerous overshoot with hypertensive crisis and arrhythmias",
      "Starting at maximum dose is dangerous and unnecessary — titrate up from a low starting dose",
      "Changing agents entirely is premature — optimize the current agent first before adding or switching"
    ],
    lessonPath: "/emergency/lessons/vasopressor-management"
  },
  {
    stem: "A 50-year-old male with ESRD on hemodialysis presents to the ED after missing his last 2 dialysis sessions. He is in respiratory distress with bilateral crackles, JVD, and hypertension (BP 210/120). His potassium is 7.2 mEq/L with peaked T waves and widened QRS on ECG. He has flash pulmonary edema. What type of shock is he at risk for, and what is the priority intervention?",
    options: [
      "Distributive shock — administer vasodilators",
      "Cardiogenic shock from fluid overload — administer IV calcium gluconate for immediate cardiac membrane stabilization, then emergent hemodialysis for volume and potassium removal",
      "Hypovolemic shock — administer IV fluids",
      "Obstructive shock — perform needle decompression"
    ],
    correctAnswer: 1,
    rationaleLong: "This ESRD patient who missed dialysis has two immediately life-threatening problems: (1) Severe hyperkalemia (7.2 with ECG changes) threatening lethal cardiac dysrhythmia; (2) Volume overload with flash pulmonary edema threatening respiratory failure. Without intervention, he will develop cardiogenic shock (the overloaded heart cannot pump effectively against the massive volume burden) and/or hyperkalemic cardiac arrest. The immediate priority intervention is IV calcium gluconate (10 mL of 10% solution over 2-3 minutes) because: (1) Calcium stabilizes the cardiac membrane WITHIN 1-3 MINUTES by raising the threshold potential, reducing the risk of lethal dysrhythmias (VT, VF, asystole) from hyperkalemia; (2) It provides immediate cardiac protection while other slower interventions are being initiated. Calcium does NOT lower the potassium level — it only protects the heart. After calcium, simultaneous interventions include: temporary potassium-lowering measures (insulin 10 units + D50 25g to shift K+ intracellularly, sodium bicarbonate IV for acidosis correction and K+ shifting, nebulized albuterol 10-20 mg for beta-2-mediated K+ shifting), and respiratory support for pulmonary edema (NIPPV — BiPAP or CPAP — provides positive pressure to push fluid out of alveoli and support gas exchange). The DEFINITIVE treatment is emergent hemodialysis, which addresses BOTH problems simultaneously: removes excess fluid (relieving pulmonary edema) and removes excess potassium (correcting the hyperkalemia). The emergency nurse should: administer calcium gluconate immediately, prepare for emergent dialysis (contact the dialysis team), initiate potassium-shifting medications, apply NIPPV for respiratory support, place on continuous cardiac monitoring, and prepare for possible intubation if respiratory failure progresses.",
    learningObjective: "Manage the dual emergency of hyperkalemia and volume overload in missed-dialysis ESRD patients",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Calcium gluconate does NOT lower potassium — it provides temporary CARDIAC PROTECTION. Definitive K+ removal requires dialysis.",
    clinicalPearls: [
      "Hyperkalemia ECG progression: peaked T waves → widened QRS → sine wave → VF/asystole",
      "Calcium effect: 1-3 min onset, 30-60 min duration — buy time for definitive treatment",
      "Emergent dialysis addresses both hyperkalemia AND volume overload in ESRD patients"
    ],
    safetyNote: "Never give calcium through the same line as sodium bicarbonate — they precipitate as calcium carbonate. Use separate IV lines.",
    distractorRationales: [
      "This patient has the opposite of distributive shock — he has volume overload and hypertension",
      "IV fluids would be catastrophic — the patient is already fluid overloaded with pulmonary edema",
      "There is no evidence of obstructive shock — the problem is intrinsic cardiac overload"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 38-year-old male presents to the ED with anaphylactic shock. He has urticaria, angioedema, wheezing, and hypotension. The nurse administers IM epinephrine 0.3 mg. Two minutes later, the patient develops sustained ventricular tachycardia. What is the relationship between epinephrine and the dysrhythmia?",
    options: [
      "The dysrhythmia is unrelated to the epinephrine",
      "Epinephrine's beta-1 effects can provoke tachyarrhythmias, especially in patients with underlying cardiac disease or when given IV. However, epinephrine remains the first-line treatment for anaphylaxis — the risk of withholding it exceeds the arrhythmia risk",
      "The epinephrine dose was too low and should be doubled",
      "Epinephrine should never be used in anaphylaxis due to arrhythmia risk"
    ],
    correctAnswer: 1,
    rationaleLong: "This scenario illustrates an important clinical tension: epinephrine can cause dysrhythmias (including ventricular tachycardia, ventricular fibrillation, and supraventricular tachycardia) through its beta-1 adrenergic effects, which increase myocardial excitability, contractility, and conduction velocity. Risk factors for epinephrine-induced dysrhythmias include: underlying coronary artery disease, electrolyte abnormalities, concomitant use of drugs that prolong QT interval, excessive dose, and IV administration (which produces much higher peak plasma levels than IM). HOWEVER — and this is the critical teaching point — the risk of NOT giving epinephrine in anaphylaxis is far greater than the risk of epinephrine-induced dysrhythmia. Anaphylaxis is rapidly fatal without epinephrine: airway obstruction from angioedema, cardiovascular collapse from vasodilation and capillary leak, and bronchospasm can all cause death within minutes. Epinephrine is the ONLY first-line treatment that addresses all three pathological mechanisms simultaneously: alpha-1 vasoconstriction (restores blood pressure), beta-1 cardiac stimulation (improves cardiac output), and beta-2 bronchodilation (relieves bronchospasm) and beta-2 mast cell stabilization (reduces further mediator release). In this case, the sustained VT should be treated according to ACLS protocols (amiodarone 150 mg IV over 10 minutes for stable VT, synchronized cardioversion for unstable VT), while continuing to manage the anaphylaxis. Future epinephrine doses may need to be given at reduced doses or via controlled IV infusion. The emergency nurse should: treat the VT per protocol, continue managing the anaphylaxis, maintain continuous cardiac monitoring, and communicate the adverse effect to the team for adjusted dosing.",
    learningObjective: "Understand epinephrine's arrhythmogenic potential in anaphylaxis while recognizing it remains the essential first-line treatment",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Epinephrine CAN cause arrhythmias, but the risk of WITHHOLDING epinephrine in anaphylaxis is FAR greater than the arrhythmia risk — always give it",
    clinicalPearls: [
      "IM epinephrine is safer than IV for anaphylaxis — lower peak levels reduce arrhythmia risk",
      "Risk factors for epinephrine dysrhythmia: CAD, electrolyte imbalance, QT-prolonging drugs",
      "Epinephrine addresses all 3 anaphylaxis mechanisms: vasoconstriction, inotropy, and bronchodilation"
    ],
    safetyNote: "If arrhythmia occurs, treat the arrhythmia AND continue managing the anaphylaxis — stopping anaphylaxis treatment would be more dangerous",
    distractorRationales: [
      "The temporal relationship (VT 2 minutes after epinephrine) makes a causal relationship very likely",
      "Increasing the dose would increase arrhythmia risk — adjust dosing strategy instead",
      "Epinephrine is THE essential treatment for anaphylaxis — it should never be withheld"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 55-year-old male presents to the ED with an acute aortic dissection (Stanford Type A). He has severe tearing chest pain radiating to the back, a blood pressure differential of 40 mmHg between arms (right 180/110, left 140/90), and a diastolic decrescendo murmur. His CT angiography confirms ascending aortic dissection. He develops cardiogenic shock. What is the mechanism of shock in Type A dissection?",
    options: [
      "Hemorrhagic shock from external bleeding",
      "The dissection flap can cause acute aortic regurgitation, cardiac tamponade, or coronary malperfusion — any of which produces cardiogenic/obstructive shock",
      "Distributive shock from inflammatory mediator release",
      "Neurogenic shock from aortic nerve plexus disruption"
    ],
    correctAnswer: 1,
    rationaleLong: "Stanford Type A aortic dissection (involving the ascending aorta) can cause cardiogenic/obstructive shock through multiple mechanisms: (1) ACUTE AORTIC REGURGITATION — the dissection flap can disrupt the aortic valve annulus or prolapse into the valve orifice, causing acute severe aortic regurgitation (the diastolic decrescendo murmur in this patient). The left ventricle suddenly must handle the regurgitant volume in addition to the normal forward stroke volume, causing acute LV volume overload and failure; (2) CARDIAC TAMPONADE — the dissection can rupture through the adventitia into the pericardial space (since the ascending aorta is within the pericardial reflection), causing hemopericardium and tamponade. This is the most common cause of death from acute Type A dissection; (3) CORONARY MALPERFUSION — the dissection flap can extend into the coronary ostia (particularly the right coronary artery), occluding coronary blood flow and causing acute myocardial infarction and cardiogenic shock; (4) All three mechanisms can coexist simultaneously in a single patient. The emergency nurse's management priorities include: (1) Immediate anti-impulse therapy — reduce heart rate (target less than 60 bpm) and blood pressure (target SBP 100-120 mmHg) using IV esmolol (short-acting beta-blocker) to reduce aortic wall shear stress and prevent dissection propagation. ALWAYS start beta-blocker BEFORE vasodilator — vasodilators alone cause reflex tachycardia that increases aortic shear stress; (2) If beta-blocker alone is insufficient, add IV nicardipine or nitroprusside; (3) Adequate pain control (morphine) — pain drives sympathetic activation increasing HR and BP; (4) Type and crossmatch 10+ units PRBCs; (5) Emergent cardiothoracic surgery consultation — Type A dissection requires emergent surgical repair (mortality increases approximately 1% per hour without surgery).",
    learningObjective: "Identify the multiple mechanisms of shock in Type A aortic dissection and implement anti-impulse therapy",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "In aortic dissection, ALWAYS start beta-blocker BEFORE vasodilator — vasodilators alone cause reflex tachycardia that worsens aortic shear stress",
    clinicalPearls: [
      "Type A dissection mortality increases ~1% per HOUR without surgery — emergent surgical consultation",
      "Three shock mechanisms: acute AR, cardiac tamponade, coronary malperfusion — can coexist",
      "BP differential >20 mmHg between arms suggests aortic dissection involving branch vessels"
    ],
    safetyNote: "Blood pressure targets in dissection are LOWER than typical shock (SBP 100-120, HR <60) — hypertension propagates the dissection",
    distractorRationales: [
      "While hemorrhagic shock can occur if the dissection ruptures externally, the acute shock mechanisms are cardiac/obstructive",
      "Inflammatory mediator release does not cause the primary shock in acute dissection",
      "The aortic nerve plexus does not produce neurogenic shock — neurogenic shock results from spinal cord injury"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 28-year-old female presents to the ED with suspected septic shock from a tubo-ovarian abscess. She has an allergy to penicillin documented as 'anaphylaxis.' The physician orders piperacillin-tazobactam (Zosyn). The nurse identifies a potential medication safety issue. What should the nurse do?",
    options: [
      "Administer the piperacillin-tazobactam since it's different from penicillin",
      "Clarify the allergy history, inform the physician of the penicillin anaphylaxis, and advocate for an alternative antibiotic regimen — piperacillin is a penicillin derivative with significant cross-reactivity risk",
      "Give a test dose of piperacillin-tazobactam first",
      "Administer the drug but have epinephrine at bedside"
    ],
    correctAnswer: 1,
    rationaleLong: "This scenario highlights a critical medication safety issue. Piperacillin-tazobactam (Zosyn) is a beta-lactam antibiotic — specifically, piperacillin is a synthetic penicillin derivative. In a patient with a documented history of anaphylaxis to penicillin, administering ANY penicillin derivative carries a significant risk of triggering a severe, potentially fatal anaphylactic reaction. The cross-reactivity between penicillin and other penicillin derivatives (ampicillin, amoxicillin, piperacillin, nafcillin, oxacillin) is approximately 100% — they share the same beta-lactam ring structure. The emergency nurse's responsibility is to: (1) STOP — do not administer the medication; (2) CLARIFY — review the allergy documentation, ask the patient about the specific reaction (true anaphylaxis vs. mild rash), and document the exact nature of the allergy; (3) COMMUNICATE — inform the prescribing physician of the penicillin anaphylaxis allergy and the cross-reactivity risk with piperacillin-tazobactam; (4) ADVOCATE — recommend alternative antibiotic regimens. For intra-abdominal sepsis in penicillin-allergic patients, alternatives include: carbapenem (meropenem — lower cross-reactivity with penicillin, approximately 1%, and current data suggests even lower actual risk), fluoroquinolone plus metronidazole (ciprofloxacin + metronidazole), or aztreonam plus metronidazole plus vancomycin. It is important to note that the cross-reactivity between penicillins and cephalosporins is much lower than historically believed (approximately 1-2%, primarily with first-generation cephalosporins), and between penicillins and carbapenems is approximately 0.5-1%. In true penicillin anaphylaxis, many allergists would still cautiously recommend carbapenems with appropriate monitoring, but this decision should involve the physician. 'Test doses' of known allergens that previously caused anaphylaxis are NOT safe practice.",
    learningObjective: "Identify beta-lactam cross-reactivity risks and advocate for patient safety in antibiotic selection",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Piperacillin IS a penicillin derivative — the cross-reactivity with penicillin allergy is essentially 100%. Never administer to a patient with documented penicillin anaphylaxis.",
    clinicalPearls: [
      "Penicillin→penicillin derivative cross-reactivity: ~100%. Penicillin→cephalosporin: ~1-2%. Penicillin→carbapenem: ~0.5-1%",
      "Alternatives for beta-lactam allergic patients: fluoroquinolone + metronidazole, or aztreonam-based regimens",
      "Document the EXACT nature of the allergy — rash vs. anaphylaxis determines management differently"
    ],
    safetyNote: "Medication reconciliation and allergy verification is a CRITICAL nursing safety check — never bypass allergy alerts",
    distractorRationales: [
      "Piperacillin IS a penicillin — it is not 'different from penicillin' in terms of allergy risk",
      "Test doses of known anaphylactic allergens are dangerous and not safe practice",
      "Having epinephrine at bedside does not justify administering a known allergen — avoid the exposure entirely"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 70-year-old male presents to the ED with an acute right ventricular myocardial infarction (RVMI). ECG shows ST elevation in leads II, III, aVF and right-sided leads (V4R). His BP is 82/50 with JVD and clear lung fields. Why are IV fluids the initial treatment for RVMI-associated shock?",
    options: [
      "IV fluids reduce the work of the right ventricle",
      "The failing right ventricle is preload-dependent — IV fluid boluses increase RV filling to maintain adequate output through the damaged RV and into the LV",
      "IV fluids treat the pulmonary edema caused by RVMI",
      "IV fluids are given to increase coronary perfusion pressure"
    ],
    correctAnswer: 1,
    rationaleLong: "Right ventricular myocardial infarction (RVMI) presents with a unique hemodynamic profile that requires a counterintuitive treatment approach compared to left ventricular MI. The key clinical triad is: (1) Hypotension; (2) JVD (right heart failure causing venous congestion); (3) Clear lung fields (the left ventricle may function normally — there is no pulmonary edema because the problem is on the RIGHT side). The pathophysiology: when the right ventricle infarcted (typically from right coronary artery occlusion), it loses contractile function. The RV becomes dilated, compliant, and functions as a passive conduit rather than an active pump. In this state, the RV is exquisitely PRELOAD-DEPENDENT — it needs higher filling pressures (more volume) to push blood through the pulmonary vasculature and into the left ventricle. Without adequate preload, the RV cannot generate sufficient output, and the LV 'starves' for blood, causing systemic hypotension. IV fluid bolus (typically 500 mL-1 L NS bolus, repeated as needed based on clinical response) increases RV preload, stretching the still-functional myocardial fibers (Starling mechanism), improving RV output, and subsequently improving LV filling and systemic blood pressure. CRITICALLY, treatments that REDUCE preload are CONTRAINDICATED in RVMI: (1) Nitroglycerin — reduces preload through venodilation, can cause catastrophic hypotension; (2) Morphine — causes venodilation and preload reduction; (3) Diuretics — reduce preload. These are all standard treatments for LEFT ventricular MI/heart failure but are dangerous in RVMI. The emergency nurse must recognize the RVMI presentation (right-sided ST elevation, especially V4R, hypotension, JVD, clear lungs), initiate IV fluid bolus, AVOID nitroglycerin and morphine, and prepare for primary PCI (the definitive treatment for the underlying RCA occlusion).",
    learningObjective: "Understand the preload-dependent physiology of RVMI and why IV fluids are the initial hemodynamic treatment",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Nitroglycerin and morphine are CONTRAINDICATED in RVMI — they reduce preload and can cause fatal hypotension. Always check right-sided leads!",
    clinicalPearls: [
      "RVMI triad: hypotension + JVD + clear lung fields — the opposite of LV failure",
      "V4R ST elevation is the most sensitive ECG finding for RVMI — always obtain right-sided leads in inferior STEMI",
      "RVMI is preload-dependent — IV fluids FIRST, avoid all preload reducers"
    ],
    safetyNote: "Always obtain right-sided ECG leads (V4R) in inferior STEMI before administering nitroglycerin — RVMI can be unmasked by catastrophic hypotension from nitrates",
    distractorRationales: [
      "IV fluids do not reduce RV work — they increase preload which is exactly what the failing RV needs",
      "RVMI produces clear lungs, not pulmonary edema — fluids are not treating edema here",
      "While maintaining coronary perfusion is important, the primary mechanism of IV fluid benefit is restoring RV preload"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 42-year-old male is brought to the ED in undifferentiated shock. His vital signs: HR 128, BP 72/44, RR 30, T 36.8°C. He is obtunded. The nurse must rapidly assess the shock type. What bedside assessment tool can help differentiate the shock categories within minutes?",
    options: [
      "Serum cortisol level",
      "Point-of-care ultrasound (POCUS) — the RUSH exam (Rapid Ultrasound in Shock) evaluates cardiac function, volume status, and identifies causes of obstructive shock within minutes",
      "Full metabolic panel",
      "CT angiography of the chest"
    ],
    correctAnswer: 1,
    rationaleLong: "The RUSH exam (Rapid Ultrasound in Shock and Hypotension) is a systematic bedside ultrasound protocol that can differentiate shock types within minutes. The protocol evaluates three components using the mnemonic 'the pump, the tank, and the pipes': (1) THE PUMP (cardiac assessment) — evaluates cardiac contractility (hyperdynamic in distributive shock, hypodynamic in cardiogenic shock), pericardial effusion (tamponade causing obstructive shock), and RV dilation (PE or RV failure); (2) THE TANK (volume status) — evaluates IVC diameter and collapsibility (flat, collapsing IVC suggests hypovolemia; distended, non-collapsible IVC suggests volume overload or obstructive shock), lung sliding and B-lines (absent sliding suggests pneumothorax; B-lines suggest pulmonary edema), and free fluid in abdomen/pelvis (hemorrhage, ascites); (3) THE PIPES (great vessels) — evaluates aorta for aneurysm or dissection, and femoral/popliteal veins for DVT (source for PE). The RUSH exam findings allow rapid categorization: HYPOVOLEMIC: hyperdynamic heart, flat IVC, no free fluid or positive FAST; CARDIOGENIC: hypodynamic heart, distended IVC, possible B-lines; DISTRIBUTIVE: hyperdynamic heart, IVC variable (may be small or normal), no structural cause; OBSTRUCTIVE: depends on cause — tamponade (pericardial effusion), PE (RV dilation), tension pneumothorax (absent lung sliding). The emergency nurse should be proficient in assisting with or performing focused cardiac ultrasound, IVC assessment, and E-FAST (Extended Focused Assessment with Sonography in Trauma). Having the ultrasound machine readily available and positioned at the bedside for critically ill patients is a key nursing role. The entire RUSH exam can be completed in 2-5 minutes by an experienced operator.",
    learningObjective: "Apply the RUSH exam protocol for rapid bedside differentiation of shock types",
    blueprintCategory: "Shock",
    subtopic: "early vs late shock recognition",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The RUSH exam evaluates 'pump, tank, pipes' — cardiac function, volume status, and great vessels. It can differentiate shock types in 2-5 minutes.",
    clinicalPearls: [
      "RUSH: Pump (cardiac function), Tank (IVC + lungs + free fluid), Pipes (aorta + DVT assessment)",
      "Flat collapsing IVC = volume depletion; distended non-collapsible IVC = volume overload or obstruction",
      "B-lines on lung ultrasound indicate extravascular lung water (pulmonary edema)"
    ],
    safetyNote: "POCUS findings should be integrated with clinical assessment — do not rely on a single ultrasound finding to determine shock type",
    distractorRationales: [
      "Serum cortisol is useful for adrenal insufficiency but takes time and does not differentiate shock types broadly",
      "Full metabolic panel provides useful data but takes 30-60 minutes — too slow for acute shock differentiation",
      "CT angiography is valuable but requires transport, contrast, and time — POCUS is faster and safer at bedside"
    ],
    lessonPath: "/emergency/lessons/early-vs-late-shock-recognition"
  },
  {
    stem: "A 60-year-old male with chronic heart failure is being treated for cardiogenic shock with dobutamine. His heart rate increases from 78 to 130 bpm and he develops palpitations with a new irregular rhythm on the monitor. What is the nurse's concern regarding dobutamine?",
    options: [
      "Dobutamine has no cardiac side effects",
      "Dobutamine's beta-1 stimulation can cause dose-dependent tachyarrhythmias including atrial fibrillation, ventricular tachycardia, and increased myocardial oxygen demand — which can worsen ischemia",
      "The tachycardia is beneficial and indicates the medication is working",
      "The arrhythmia is caused by the patient's underlying disease and is unrelated to dobutamine"
    ],
    correctAnswer: 1,
    rationaleLong: "Dobutamine is a synthetic catecholamine that acts primarily as a beta-1 adrenergic agonist (with some beta-2 and alpha-1 activity). In cardiogenic shock, dobutamine is used for its positive inotropic effect — increasing myocardial contractility to improve cardiac output. However, beta-1 stimulation also increases: (1) Heart rate (positive chronotropy) — this is often an unwanted side effect because tachycardia reduces diastolic filling time (reducing preload and coronary perfusion) and increases myocardial oxygen demand; (2) Myocardial automaticity — beta-1 stimulation increases the rate of phase 4 depolarization in cardiac pacemaker cells and can trigger ectopic foci, leading to various arrhythmias including atrial fibrillation, atrial flutter, ventricular premature beats, ventricular tachycardia, and in severe cases, ventricular fibrillation; (3) Myocardial oxygen demand — the combination of increased contractility, heart rate, and afterload increases the heart's oxygen consumption, which can worsen ischemia in patients with underlying coronary artery disease (common in the cardiogenic shock population). This creates a dangerous paradox: the medication meant to improve cardiac output can simultaneously worsen myocardial ischemia, potentially extending the infarct zone and worsening the underlying problem. The emergency nurse should: report the tachyarrhythmia immediately to the physician, prepare to reduce the dobutamine infusion rate (the arrhythmogenic effects are dose-dependent), have antiarrhythmic medications available (amiodarone for atrial or ventricular arrhythmias), monitor for signs of myocardial ischemia (chest pain, new ST changes on the monitor), and consider alternative inotropic strategies. Milrinone is an alternative inotrope that may have a lower arrhythmia risk (though it causes more hypotension). Mechanical circulatory support (IABP, Impella, ECMO) provides hemodynamic support without increasing myocardial oxygen demand.",
    learningObjective: "Recognize dobutamine-induced tachyarrhythmias as a dose-dependent adverse effect and implement appropriate monitoring",
    blueprintCategory: "Shock",
    subtopic: "vasopressor management",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Dobutamine increases myocardial oxygen DEMAND while trying to improve cardiac OUTPUT — this paradox can worsen ischemia in CAD patients",
    clinicalPearls: [
      "Dobutamine arrhythmias are dose-dependent — reduce the dose if tachyarrhythmia develops",
      "Milrinone (PDE3 inhibitor) is an alternative with potentially lower arrhythmia risk but more hypotension",
      "Mechanical circulatory support (IABP, Impella) provides hemodynamic support without increasing O2 demand"
    ],
    safetyNote: "Monitor for dobutamine-induced ischemia in CAD patients — new chest pain or ST changes during dobutamine infusion require immediate dose reduction",
    distractorRationales: [
      "Dobutamine has significant cardiac side effects — it is not without cardiac risk",
      "Tachycardia to 130 bpm is not beneficial — it reduces diastolic filling, coronary perfusion, and increases O2 demand",
      "The temporal relationship between dobutamine administration and arrhythmia onset makes a causal relationship very likely"
    ],
    lessonPath: "/emergency/lessons/vasopressor-management"
  },
  {
    stem: "A 45-year-old male is brought to the ED by EMS in cardiac arrest. He was found face-down in a pool. He has been in ventricular fibrillation for approximately 15 minutes before arrival with ongoing CPR and 3 rounds of epinephrine. His core temperature on arrival is 28°C (82.4°F). The resuscitation team considers whether to continue or terminate efforts. What principle guides this decision?",
    options: [
      "Terminate resuscitation after 20 minutes of VF without ROSC",
      "Continue resuscitation — the patient is NOT dead until warm and dead. Hypothermia provides neuroprotection and patients have survived with good neurological outcomes after prolonged hypothermic cardiac arrest",
      "Hypothermia worsens survival and efforts should be terminated",
      "Switch to defibrillation-only protocol without medications"
    ],
    correctAnswer: 1,
    rationaleLong: "The critical principle in hypothermic cardiac arrest is: 'A patient is not dead until they are warm and dead.' Hypothermia (core temperature less than 35°C) provides significant neuroprotection by reducing cerebral metabolic rate — for every 1°C decrease in body temperature, cerebral metabolic rate decreases by approximately 6-7%. At 28°C, the brain's metabolic demand is approximately 50% of normal, meaning the brain can tolerate significantly longer periods of ischemia without irreversible damage. There are well-documented cases of patients surviving with good neurological outcomes after prolonged (60-90+ minutes) hypothermic cardiac arrest, including drowning victims and avalanche burial patients. Guidelines for hypothermic cardiac arrest management include: (1) Continue CPR — do NOT terminate resuscitation until the patient has been rewarmed to at least 32-35°C (some guidelines state 30°C) without ROSC; (2) Core rewarming — active core rewarming methods include warmed IV fluids (42°C), warm humidified oxygen, peritoneal lavage with warm fluid, thoracic lavage, and in severe cases, extracorporeal membrane oxygenation (ECMO) or cardiopulmonary bypass (the gold standard for hypothermic cardiac arrest rewarming); (3) Medications — ACLS medications (epinephrine, amiodarone) may be LESS effective at low temperatures because enzymatic drug metabolism is impaired. Below 30°C, some protocols recommend withholding or spacing medications and limiting defibrillation attempts (the hypothermic myocardium may be refractory to defibrillation until rewarmed); (4) At temperatures below 30°C, limit defibrillation to 3 attempts — if VF persists, rewarm before attempting further defibrillation. The emergency nurse should: initiate active rewarming immediately, prepare warmed IV fluids (42°C), apply warm blankets and forced-air warming, insert a Foley catheter for warm bladder irrigation if available, monitor core temperature continuously (esophageal or rectal), and prepare for potential ECMO cannulation if available.",
    learningObjective: "Apply the 'warm and dead' principle in hypothermic cardiac arrest and implement active rewarming strategies",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do NOT terminate resuscitation in hypothermic cardiac arrest until the patient is rewarmed to at least 32°C — remarkable survival is possible after prolonged hypothermic arrest",
    clinicalPearls: [
      "Every 1°C decrease in temperature reduces cerebral metabolic rate by 6-7%",
      "ECMO/cardiopulmonary bypass is the gold standard for rewarming in hypothermic cardiac arrest",
      "Below 30°C: limit defibrillation to 3 attempts, consider withholding ACLS medications"
    ],
    safetyNote: "Core temperature measurement must be esophageal or rectal — peripheral methods (tympanic, axillary) are unreliable in hypothermia",
    distractorRationales: [
      "Standard time-based termination criteria do not apply in hypothermic cardiac arrest — rewarm first",
      "Hypothermia IMPROVES neurological survival by reducing metabolic demand — it does not worsen outcomes",
      "Medications and defibrillation both have roles but must be adapted for the hypothermic physiology"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 50-year-old female presents to the ED with septic shock from cholangitis. She has Charcot's triad (fever, jaundice, right upper quadrant pain) and is hemodynamically unstable. After initial resuscitation, what is the critical 'source control' intervention?",
    options: [
      "Continue antibiotics alone and monitor for improvement",
      "Emergent biliary decompression (ERCP with stenting or percutaneous transhepatic drainage) to drain the obstructed and infected biliary system",
      "Surgical cholecystectomy within 24 hours",
      "CT-guided abscess drainage"
    ],
    correctAnswer: 1,
    rationaleLong: "Source control is a fundamental principle in sepsis management — identifying and treating the anatomical source of infection is often MORE important than antibiotic therapy. In cholangitis (infection of the biliary system), the source is an obstructed common bile duct (usually by a gallstone, stricture, or tumor) that has become infected. The obstructed bile becomes a culture medium for bacteria (typically enteric organisms: E. coli, Klebsiella, Enterococcus), and the elevated ductal pressure forces bacteria and toxins into the bloodstream (bacteremia). Antibiotics alone cannot adequately penetrate an obstructed, pressurized biliary system — the key intervention is DECOMPRESSION to drain the infected bile and relieve the obstruction. The methods of biliary decompression include: (1) ERCP (endoscopic retrograde cholangiopancreatography) — the preferred method. A gastroenterologist passes an endoscope into the duodenum, accesses the bile duct through the ampulla of Vater, removes the obstructing stone, and places a stent for drainage. ERCP is less invasive than surgery and can be performed emergently; (2) Percutaneous transhepatic cholangiography/drainage (PTC/PTD) — a needle is passed through the skin and liver into the dilated biliary system under fluoroscopic guidance, and a drainage catheter is placed. This is used when ERCP fails or is not available; (3) Surgical common bile duct exploration — used when endoscopic and percutaneous methods fail. Cholangitis progresses to Reynolds' pentad (Charcot's triad plus altered mental status and hypotension) as it worsens, which is present in this patient (she has septic shock). The emergency nurse should: prepare for emergent ERCP by ensuring the GI team is notified, prepare for potential procedural sedation, administer broad-spectrum antibiotics covering enteric organisms (piperacillin-tazobactam or meropenem), and maintain continuous hemodynamic monitoring.",
    learningObjective: "Identify the source control intervention for cholangitis-related septic shock",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Charcot's triad + shock + altered mental status = Reynolds' pentad — this indicates severe cholangitis requiring emergent biliary decompression",
    clinicalPearls: [
      "Charcot's triad: fever, jaundice, RUQ pain. Reynolds' pentad adds: hypotension and altered mental status",
      "ERCP is the preferred emergent biliary decompression method — less invasive than surgery",
      "Antibiotics alone cannot adequately treat an obstructed infected biliary system — decompression is essential"
    ],
    safetyNote: "Source control (drainage) is the most critical determinant of survival in cholangitis-related sepsis — no amount of antibiotics will succeed without relieving the obstruction",
    distractorRationales: [
      "Antibiotics alone are insufficient — they cannot penetrate an obstructed pressurized biliary system",
      "Cholecystectomy treats gallbladder disease but does not directly decompress the common bile duct obstruction",
      "CT-guided abscess drainage is for hepatic or other fluid collections, not for biliary obstruction"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 35-year-old male is resuscitated from cardiac arrest. He achieves ROSC (return of spontaneous circulation) after 12 minutes of CPR. Post-ROSC, he remains comatose. His MAP is 72 mmHg and temperature is 37.8°C. The ICU team recommends targeted temperature management (TTM). What is the evidence-based temperature target?",
    options: [
      "Cool to 28°C for maximum neuroprotection",
      "Maintain temperature between 32-36°C and actively prevent fever (>37.5°C) for at least 24 hours post-arrest — the TTM2 trial showed that preventing fever is as important as active cooling",
      "No temperature management is needed post-ROSC",
      "Warm the patient to 40°C to improve cerebral blood flow"
    ],
    correctAnswer: 1,
    rationaleLong: "Targeted temperature management (TTM) is a cornerstone of post-cardiac arrest care aimed at improving neurological outcomes. The evolution of TTM evidence: the original 2002 trials (HACA and Bernard) demonstrated improved neurological outcomes with cooling to 32-34°C for 12-24 hours after cardiac arrest. The TTM trial (2013) showed no difference between 33°C and 36°C targets. The landmark TTM2 trial (2021) showed that hypothermia at 33°C did not provide benefit over normothermia (targeting 37.5°C) with active fever prevention. Current guidelines (2020 AHA/2021 ERC) recommend: (1) Maintain core temperature between 32-36°C for at least 24 hours post-ROSC — the specific target within this range should be based on institutional protocol and patient factors; (2) ACTIVELY PREVENT FEVER (temperature greater than 37.5°C) for at least 72 hours — fever after cardiac arrest is independently associated with worse neurological outcomes; (3) Avoid rebound hyperthermia during the rewarming phase — rewarm slowly at 0.25-0.5°C per hour. The neuroprotective mechanisms of temperature management include: reduced cerebral metabolic rate, decreased excitotoxic neurotransmitter release (glutamate), reduced free radical production, decreased blood-brain barrier permeability, reduced inflammation, and suppression of apoptotic pathways. The emergency nurse's role in TTM includes: applying surface cooling devices (Arctic Sun, cooling blankets) or initiating intravascular cooling catheter management, monitoring core temperature continuously (esophageal or bladder probe), administering sedation and paralysis (to suppress shivering, which generates heat and can prevent achieving target temperature), monitoring for complications of hypothermia (coagulopathy, hyperglycemia, electrolyte shifts — potassium, magnesium, phosphate), and maintaining a shivering assessment tool (BSAS — Bedside Shivering Assessment Scale).",
    learningObjective: "Apply targeted temperature management principles in post-cardiac arrest care",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "TTM2 trial: preventing fever is at least as important as active cooling — fever after cardiac arrest is independently harmful",
    clinicalPearls: [
      "TTM target: maintain 32-36°C for 24 hours; prevent fever (>37.5°C) for at least 72 hours",
      "Rewarm slowly at 0.25-0.5°C per hour to prevent rebound hyperthermia",
      "Shivering must be aggressively managed — it generates heat and counteracts cooling"
    ],
    safetyNote: "Monitor for hypothermia-induced complications: coagulopathy, hyperglycemia, hypokalemia (K+ shifts intracellularly during cooling — may rebound during rewarming)",
    distractorRationales: [
      "28°C is too cold — temperatures below 32°C increase complications (coagulopathy, arrhythmias) without proven additional benefit",
      "Temperature management IS indicated post-ROSC — it improves neurological outcomes",
      "Warming to 40°C would worsen neurological injury — hyperthermia is independently harmful after cardiac arrest"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 55-year-old male with a history of chronic alcoholism presents to the ED with upper GI bleeding and hemorrhagic shock. Despite receiving 8 units PRBCs, 6 units FFP, and 2 units platelets, his bleeding continues. His labs show fibrinogen of 80 mg/dL (normal 200-400). What does the low fibrinogen indicate, and what is the treatment?",
    options: [
      "Normal fibrinogen level — no intervention needed",
      "Consumptive coagulopathy (DIC) or dilutional coagulopathy — administer cryoprecipitate (10 units) to replace fibrinogen, which is essential for clot formation",
      "The fibrinogen will correct on its own with continued FFP infusion",
      "Administer vitamin K to correct the fibrinogen deficit"
    ],
    correctAnswer: 1,
    rationaleLong: "A fibrinogen level of 80 mg/dL is critically low and explains the ongoing hemorrhage despite massive transfusion. Fibrinogen (Factor I) is the final common substrate of the coagulation cascade — it is converted to fibrin by thrombin, forming the structural meshwork of blood clots. Without adequate fibrinogen, clot formation is severely impaired regardless of how many other coagulation factors are present. The critical fibrinogen threshold for hemostasis is approximately 150-200 mg/dL. Below 100 mg/dL, significant coagulopathic bleeding occurs. In this patient, the low fibrinogen likely results from: (1) Dilutional coagulopathy — massive transfusion with PRBCs (which contain no coagulation factors) and FFP (which contains all factors but in lower concentrations than normal plasma) dilutes the fibrinogen; (2) Consumptive coagulopathy — ongoing hemorrhage consumes fibrinogen at the clot formation sites; (3) Possible DIC — disseminated intravascular coagulation from the hemorrhagic shock causes widespread microthrombi that consume fibrinogen and platelets; (4) Hepatic dysfunction — chronic alcoholism may have caused liver disease, reducing fibrinogen production. The treatment is CRYOPRECIPITATE — a concentrated blood product derived from FFP that is rich in fibrinogen (each unit contains approximately 200-300 mg of fibrinogen), factor VIII, factor XIII, von Willebrand factor, and fibronectin. The standard dose is 10 units (one pool), which typically raises the fibrinogen level by approximately 60-100 mg/dL. The target is fibrinogen greater than 150-200 mg/dL. FFP also contains fibrinogen but at much lower concentrations (approximately 2 mg/mL) — you would need approximately 15-20 units of FFP to achieve the same fibrinogen replacement as 10 units of cryoprecipitate, which would cause dangerous volume overload. Alternatively, fibrinogen concentrate (RiaSTAP) provides purified fibrinogen in a small volume — typical dose is 70 mg/kg IV.",
    learningObjective: "Identify critical fibrinogen deficiency in massive hemorrhage and administer cryoprecipitate for replacement",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Fibrinogen <100 mg/dL causes significant coagulopathic bleeding — cryoprecipitate is the most concentrated source. FFP alone provides insufficient fibrinogen.",
    clinicalPearls: [
      "Fibrinogen is the first coagulation factor to reach critically low levels in massive hemorrhage",
      "10 units cryoprecipitate raises fibrinogen by ~60-100 mg/dL; target >150-200 mg/dL",
      "Fibrinogen concentrate (RiaSTAP) provides purified fibrinogen in a small volume — alternative to cryoprecipitate"
    ],
    safetyNote: "Monitor fibrinogen levels every 30-60 minutes during massive transfusion — it depletes faster than other coagulation factors",
    distractorRationales: [
      "80 mg/dL is critically low — the normal range is 200-400 mg/dL and hemostasis requires >150 mg/dL",
      "FFP contains insufficient fibrinogen to adequately replace the deficit without dangerous volume overload",
      "Vitamin K corrects factor II, VII, IX, X deficiency (warfarin effect) — it does not correct fibrinogen deficiency"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 40-year-old male presents to the ED with septic shock from community-acquired pneumonia. He has been resuscitated with 30 mL/kg NS and started on norepinephrine. His MAP is 68 mmHg. The nurse prepares to place a central venous catheter (CVC). What are the TWO primary reasons for CVC placement in shock management?",
    options: [
      "CVC is needed to administer oral medications and draw blood cultures",
      "Reliable IV access for vasopressor infusion (reduces extravasation risk) and central venous pressure monitoring for assessing volume status and guiding fluid therapy",
      "CVC is needed for CT contrast administration and blood transfusion only",
      "CVC placement is no longer indicated in shock management"
    ],
    correctAnswer: 1,
    rationaleLong: "Central venous catheter placement in shock management serves two primary purposes: (1) RELIABLE VASOPRESSOR ACCESS — vasopressors (norepinephrine, vasopressin, epinephrine) are ideally administered through a central venous catheter because: (a) Central veins are large-caliber, high-flow vessels that rapidly dilute the vasopressor, reducing the risk of local tissue effects; (b) Peripheral vasopressor extravasation can cause severe tissue necrosis — norepinephrine's potent alpha-1 vasoconstriction causes intense local vasoconstriction and ischemic necrosis if it leaks into subcutaneous tissue; (c) Central access is more reliable than peripheral IV in shock patients who may have poor peripheral access due to vasoconstriction. HOWEVER — it is important to note that current evidence supports SHORT-TERM peripheral vasopressor infusion (through a well-functioning 18-gauge or larger IV in an antecubital or larger vein) when central access is not immediately available. The danger is in delaying vasopressor initiation while obtaining central access. (2) HEMODYNAMIC MONITORING — the CVC allows measurement of: central venous pressure (CVP — which, while imperfect, helps assess right heart filling pressure and volume status), central venous oxygen saturation (ScvO2 — drawn from the distal port of the CVC, reflecting the balance between oxygen delivery and consumption. Normal ScvO2 is 65-75%; values below 65% indicate increased oxygen extraction from inadequate delivery, while values above 80% in sepsis may indicate mitochondrial dysfunction or shunting). The emergency nurse's role in CVC placement includes: preparing the insertion kit, positioning the patient (Trendelenburg for IJ or subclavian, head turned away from insertion site), maintaining sterile technique (maximal sterile barrier precautions per CVC insertion bundle), monitoring for complications (pneumothorax, arterial puncture, air embolism), confirming placement with chest X-ray, and documenting the procedure.",
    learningObjective: "Understand the indications for central venous access in shock management",
    blueprintCategory: "Shock",
    subtopic: "vasopressor management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do NOT delay vasopressor initiation to place a CVC — peripheral vasopressor infusion through a well-functioning large-bore IV is acceptable as a bridge",
    clinicalPearls: [
      "ScvO2 <65% indicates inadequate oxygen delivery; >80% in sepsis may indicate mitochondrial dysfunction",
      "Peripheral vasopressor infusion is acceptable short-term — do not delay treatment for CVC placement",
      "If vasopressor extravasation occurs, inject phentolamine 5-10 mg locally to reverse the vasoconstriction"
    ],
    safetyNote: "CVC insertion bundle (maximal sterile barriers, chlorhexidine prep, ultrasound guidance) reduces central line-associated bloodstream infections (CLABSI)",
    distractorRationales: [
      "CVC is not needed for oral medications or blood cultures — these can be done peripherally",
      "CT contrast and blood transfusion are typically administered through peripheral IVs — they do not require central access",
      "CVC placement remains an important component of shock management, though its urgency should not delay treatment"
    ],
    lessonPath: "/emergency/lessons/vasopressor-management"
  },
  {
    stem: "A 25-year-old female presents to the ED with hemolytic uremic syndrome (HUS) following an E. coli O157:H7 infection. She has microangiopathic hemolytic anemia, thrombocytopenia, and acute kidney injury. Her platelet count is 18,000 and she has evidence of active hemorrhage from her GI tract. The physician considers platelet transfusion. Why might platelet transfusion be potentially harmful in HUS?",
    options: [
      "Platelets are always safe to transfuse regardless of the condition",
      "In thrombotic microangiopathies like HUS, platelet transfusion may 'fuel the fire' — providing substrate for ongoing microvascular thrombosis, potentially worsening organ damage despite treating the bleeding",
      "Platelet transfusion causes hyperkalemia",
      "Platelet transfusion is only harmful if the patient is allergic to platelets"
    ],
    correctAnswer: 1,
    rationaleLong: "This question addresses one of the most challenging clinical dilemmas in hematology/emergency medicine: the management of thrombocytopenia with active bleeding in thrombotic microangiopathy (TMA). In HUS and its related condition TTP (thrombotic thrombocytopenic purpura), the pathophysiology involves widespread microvascular thrombosis — small blood clots form throughout the microvasculature of target organs (kidneys in HUS, brain and kidneys in TTP), consuming platelets and mechanically shearing red blood cells as they pass through the partially occluded vessels (creating schistocytes — the hallmark of microangiopathic hemolysis). In this context, the thrombocytopenia is a CONSUMPTIVE process — platelets are being used up in the pathological microvascular thrombosis. Transfusing additional platelets theoretically provides MORE substrate for the ongoing thrombotic process, potentially worsening microvascular occlusion and organ damage. This is analogized as 'adding fuel to the fire.' However, this must be balanced against the reality that the patient has active GI hemorrhage with critically low platelets (18,000). Current consensus is: (1) Platelet transfusion should be AVOIDED in TMA unless there is life-threatening bleeding or a needed invasive procedure; (2) If active life-threatening hemorrhage is present (as in this patient), platelets should be given to control the bleeding — the risk of exsanguination from hemorrhage is more immediate than the theoretical risk of worsening thrombotic microangiopathy; (3) The definitive treatment for HUS is supportive (dialysis for renal failure, blood pressure management, possibly eculizumab for atypical HUS) and for TTP is plasma exchange (PLEX). The emergency nurse should: communicate the TMA context to the physician, ensure that the decision to transfuse platelets is made deliberately with awareness of the risk-benefit balance, and prepare for potential plasma exchange therapy.",
    learningObjective: "Understand the risk-benefit considerations of platelet transfusion in thrombotic microangiopathies",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "In TMA (HUS/TTP), platelet transfusion may worsen organ damage — but life-threatening hemorrhage overrides this concern. Treat the most immediate threat first.",
    clinicalPearls: [
      "TMA triad: microangiopathic hemolytic anemia (schistocytes), thrombocytopenia, organ injury (kidneys/brain)",
      "Avoid platelet transfusion in TMA unless life-threatening bleeding — it may worsen microvascular thrombosis",
      "TTP requires emergent plasma exchange (PLEX); HUS is primarily supportive with dialysis"
    ],
    safetyNote: "If platelet transfusion is given for life-threatening hemorrhage in TMA, closely monitor for worsening renal function and neurological status",
    distractorRationales: [
      "Platelet transfusion is not universally safe — the clinical context determines risk and benefit",
      "Hyperkalemia is not the primary concern with platelet transfusion",
      "The concern is not allergic reaction but rather fueling the pathological thrombotic process"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 62-year-old male presents to the ED with acute onset chest pain and dyspnea. He has a mechanical mitral valve. His INR is 1.2 (subtherapeutic — target 2.5-3.5). Echocardiogram shows a thrombus on the mechanical valve with severe stenosis. He is developing cardiogenic shock. What is the most likely diagnosis?",
    options: [
      "Infective endocarditis",
      "Prosthetic valve thrombosis from subtherapeutic anticoagulation causing mechanical obstruction and cardiogenic shock",
      "Degenerative valve disease",
      "Papillary muscle rupture"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has prosthetic valve thrombosis (PVT) — a potentially fatal complication of mechanical heart valves that occurs when anticoagulation falls below the therapeutic range, allowing thrombus formation on the valve prosthesis. Mechanical valves require lifelong anticoagulation because the artificial materials (pyrolytic carbon, titanium) are thrombogenic. The target INR varies by valve type and position: mitral mechanical valves typically require INR 2.5-3.5 (higher than aortic valves at 2.0-3.0) due to lower flow velocities across the mitral position. This patient's INR of 1.2 is significantly subtherapeutic, creating conditions for thrombus formation on the valve. The thrombus causes mechanical obstruction of the valve (functional stenosis), restricting blood flow from the left atrium to the left ventricle, causing: reduced cardiac output → hypotension → cardiogenic shock, as well as increased left atrial pressure → pulmonary edema → dyspnea. Treatment options depend on hemodynamic stability: (1) THROMBOLYSIS — for hemodynamically unstable patients with obstructive PVT, slow infusion of alteplase (tPA 25 mg over 6 hours, repeated if needed) can dissolve the thrombus and restore valve function. This is preferred over surgery in critically ill patients who may not survive the operative risk; (2) SURGICAL THROMBECTOMY or VALVE REPLACEMENT — for patients who fail thrombolysis or have large mobile thrombi with high embolic risk; (3) IV HEPARIN — for small non-obstructive thrombi without hemodynamic compromise, heparin anticoagulation may allow gradual thrombus resolution. The emergency nurse should: recognize the significance of subtherapeutic INR in a mechanical valve patient, initiate IV heparin immediately (bolus + infusion, targeting aPTT 60-80 seconds), prepare for possible thrombolysis, monitor for thromboembolic events (stroke — the thrombus can embolize), and ensure the INR is returned to the therapeutic range. Prevention education: the patient must understand the critical importance of maintaining therapeutic anticoagulation and regular INR monitoring.",
    learningObjective: "Recognize prosthetic valve thrombosis from subtherapeutic anticoagulation and understand treatment options",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Subtherapeutic INR in a mechanical valve patient presenting with new cardiac symptoms = prosthetic valve thrombosis until proven otherwise",
    clinicalPearls: [
      "Mitral mechanical valve target INR: 2.5-3.5; Aortic: 2.0-3.0",
      "Thrombolysis is preferred over surgery for hemodynamically unstable obstructive PVT",
      "PVT can present as valve stenosis (obstruction) or regurgitation (leaflet immobility)"
    ],
    safetyNote: "Initiate IV heparin immediately — do not wait for additional diagnostic confirmation if clinical suspicion is high",
    distractorRationales: [
      "Infective endocarditis typically presents with fever, positive blood cultures, and vegetations — this patient has a thrombus with subtherapeutic INR",
      "Degenerative valve disease develops over years, not acutely — and is uncommon in mechanical valves",
      "Papillary muscle rupture affects native valves — mechanical valves have a different failure mechanism"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 48-year-old male presents to the ED with septic shock. He receives 30 mL/kg crystalloid, norepinephrine, and broad-spectrum antibiotics. His MAP is 68 mmHg and lactate is clearing. However, his urine output remains at 0.2 mL/kg/hr. The team considers adding low-dose dopamine to 'protect the kidneys.' Is this appropriate?",
    options: [
      "Yes — low-dose dopamine increases renal blood flow and protects against acute kidney injury",
      "No — multiple trials have definitively shown that low-dose (renal-dose) dopamine does NOT protect against AKI, does NOT reduce the need for dialysis, and does NOT improve outcomes in septic shock",
      "Yes — dopamine is always beneficial when urine output is low",
      "Low-dose dopamine should replace norepinephrine in this scenario"
    ],
    correctAnswer: 1,
    rationaleLong: "The concept of 'renal-dose' or 'low-dose' dopamine (typically 1-3 mcg/kg/min) was historically based on the pharmacological observation that at low doses, dopamine stimulates D1 receptors in the renal vasculature, causing renal vasodilation and increased renal blood flow, glomerular filtration rate (GFR), and sodium excretion. This led to the widespread practice of using low-dose dopamine to 'protect' the kidneys in critically ill patients. However, this practice has been DEFINITIVELY DISPROVEN by multiple randomized controlled trials: (1) The Australian and New Zealand Intensive Care Society (ANZICS) Clinical Trials Group trial (Bellomo et al., Lancet 2000) — 328 patients: no difference in peak creatinine, renal replacement therapy need, ICU/hospital length of stay, or survival; (2) Multiple subsequent meta-analyses confirmed no benefit; (3) The Surviving Sepsis Campaign guidelines explicitly recommend AGAINST the use of low-dose dopamine for renal protection. Furthermore, even low-dose dopamine has adverse effects: it can suppress anterior pituitary hormone release (growth hormone, prolactin, TSH), impair gut mucosal blood flow, suppress T-cell function, and at slightly higher doses causes tachyarrhythmias. The oliguria in this patient (0.2 mL/kg/hr, target greater than 0.5) is likely from: (1) Inadequate resuscitation (despite MAp 68, the kidneys may need higher perfusion pressure); (2) Sepsis-induced acute kidney injury (inflammatory mediators, microcirculatory dysfunction); (3) Pre-renal azotemia from inadequate cardiac output. Appropriate management of oliguria in septic shock includes: ensuring adequate MAP (some patients need MAP greater than 65 for adequate renal perfusion — consider trialing higher MAP targets), optimizing volume status, monitoring for fluid responsiveness, and serial renal function assessment. If AKI develops requiring dialysis, initiate continuous renal replacement therapy (CRRT).",
    learningObjective: "Debunk the myth of renal-dose dopamine and apply evidence-based management of oliguria in septic shock",
    blueprintCategory: "Shock",
    subtopic: "vasopressor management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Renal-dose dopamine has been DEFINITIVELY DISPROVEN — it does not protect kidneys, reduce dialysis need, or improve survival. Do not use it.",
    clinicalPearls: [
      "ANZICS trial (2000): low-dose dopamine provides NO renal protection in critically ill patients",
      "SSC guidelines explicitly recommend AGAINST low-dose dopamine for renal protection",
      "Some septic patients need MAP >65 for adequate renal perfusion — trial of higher MAP targets may improve UOP"
    ],
    safetyNote: "Low-dose dopamine can suppress anterior pituitary hormones and impair immune function — it has adverse effects without benefit",
    distractorRationales: [
      "Low-dose dopamine does NOT protect kidneys — this has been definitively disproven by multiple trials",
      "Dopamine is not always beneficial for low urine output — no evidence supports this practice in sepsis",
      "Dopamine should not replace norepinephrine — norepinephrine is the first-line vasopressor in septic shock"
    ],
    lessonPath: "/emergency/lessons/vasopressor-management"
  },
  {
    stem: "A 58-year-old male presents to the ED after a total knee replacement 5 days ago. He develops sudden severe dyspnea, hypoxia (SpO2 78%), and cardiovascular collapse. He has a cardiac arrest with PEA (pulseless electrical activity). The team suspects massive PE. Can thrombolytics be administered during CPR?",
    options: [
      "No — thrombolytics are contraindicated during CPR due to bleeding risk",
      "Yes — systemic thrombolysis with tPA 50 mg IV bolus can be administered during cardiac arrest when PE is strongly suspected. CPR should continue for at least 60-90 minutes after thrombolytic administration",
      "Yes — but only if CT confirms PE first",
      "Thrombolytics are only given after ROSC is achieved"
    ],
    correctAnswer: 1,
    rationaleLong: "Systemic thrombolysis DURING cardiac arrest is indicated when massive PE is the suspected cause of PEA arrest. The rationale is that without dissolving the obstructing clot, ROSC is unlikely to be achieved because the mechanical obstruction prevents blood flow through the pulmonary vasculature regardless of how effective the chest compressions are. The key points regarding thrombolysis during cardiac arrest for PE: (1) DOSE — alteplase (tPA) 50 mg IV bolus (this is half the standard 100 mg dose used for non-arrest PE, reflecting the reduced distribution volume during arrest) — some protocols use the full 100 mg IV bolus; (2) TIMING — administer the thrombolytic through a central or large peripheral IV during ongoing CPR; (3) CONTINUE CPR — high-quality CPR must continue for at least 60-90 minutes after thrombolytic administration. This extended CPR duration is necessary because the thrombolytic takes time to dissolve the clot. Standard duration-based termination criteria do NOT apply when thrombolytics have been given — the resuscitation must continue long enough for the drug to work; (4) DIAGNOSIS — in cardiac arrest, CT is not feasible. The diagnosis of PE as the cause of arrest is based on clinical suspicion: history of DVT risk factors (recent surgery, as in this patient), pre-arrest symptoms (sudden dyspnea, pleuritic chest pain), and bedside echo during CPR (RV dilation, interventricular septal bowing). Regarding bleeding risk: while thrombolysis during CPR does increase the risk of hemorrhagic complications, the alternative (death from refractory PEA arrest) makes the risk-benefit calculation clearly favorable. CPR itself causes chest trauma (rib fractures, liver laceration) that can bleed with thrombolytics, but this is accepted given the otherwise fatal prognosis. The emergency nurse should: push the tPA bolus, continue high-quality CPR for 60-90 minutes, document the time of thrombolytic administration, and monitor for ROSC.",
    learningObjective: "Administer thrombolytics during cardiac arrest for suspected massive PE and extend CPR duration accordingly",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 5,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "When thrombolytics are given during CPR, continue chest compressions for 60-90 MINUTES — standard time-based termination criteria do NOT apply",
    clinicalPearls: [
      "tPA dose in cardiac arrest: 50 mg IV bolus (some protocols use 100 mg bolus)",
      "Continue CPR for 60-90 minutes after thrombolytic to allow clot dissolution",
      "PE should be suspected as cause of PEA arrest in patients with DVT risk factors"
    ],
    safetyNote: "Inform the entire resuscitation team when thrombolytics are administered — CPR duration must be extended and bleeding precautions implemented",
    distractorRationales: [
      "Thrombolytics are indicated during CPR for suspected PE — the risk of NOT treating is death",
      "CT is not feasible during cardiac arrest — clinical suspicion and bedside echo guide the decision",
      "Waiting for ROSC defeats the purpose — the PE obstruction is preventing ROSC from occurring"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 35-year-old female presents to the ED with sepsis from a complicated UTI. Her initial BP is 108/68 and HR is 112. She does not appear critically ill but has a lactate of 4.2 mmol/L. The nurse initiates a 30 mL/kg crystalloid bolus. One hour later, her BP is 96/58, HR 118, and lactate is now 5.8 mmol/L. She is more lethargic. What does this clinical trajectory indicate?",
    options: [
      "She is improving — the slight BP decrease is normal during fluid administration",
      "She is progressing from sepsis to septic shock — the rising lactate, worsening hemodynamics, and declining mental status indicate inadequate resuscitation and need for vasopressor initiation",
      "The fluid bolus caused fluid overload requiring diuretics",
      "The lactate increase is expected and normal in sepsis"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is demonstrating the progression from sepsis to septic shock, and the clinical trajectory demands escalation of care. The key indicators of deterioration include: (1) RISING LACTATE — the increase from 4.2 to 5.8 mmol/L indicates WORSENING tissue hypoperfusion despite fluid resuscitation. This is the opposite of the expected response (lactate should decrease by 10-20% over 2-4 hours if resuscitation is adequate); (2) DECLINING BLOOD PRESSURE — the decrease from 108/68 to 96/58 despite a 30 mL/kg fluid bolus indicates that the patient's hemodynamic reserve is being overwhelmed by the septic vasodilation; (3) WORSENING MENTAL STATUS — increasing lethargy indicates inadequate cerebral perfusion, representing end-organ dysfunction; (4) PERSISTENT TACHYCARDIA — HR remains elevated at 118, suggesting ongoing sympathetic compensation for inadequate cardiac output. This patient now meets criteria for SEPTIC SHOCK: she has sepsis with persistent hypotension after adequate fluid resuscitation (or she is demonstrating tissue hypoperfusion evidenced by the rising lactate). Per SSC guidelines, vasopressor therapy should be initiated when fluid resuscitation fails to restore hemodynamic stability — norepinephrine is first-line. The emergency nurse should: (1) Initiate norepinephrine infusion immediately (can start peripherally while central access is being obtained); (2) Communicate the clinical deterioration to the physician; (3) Consider additional fluid bolus if the patient appears volume-responsive (IVC assessment); (4) Ensure blood cultures have been obtained and antibiotics are infusing; (5) Reassess for source control (is there an abscess or obstruction that needs drainage?); (6) Repeat lactate in 2-4 hours to assess treatment response. This case illustrates the importance of serial assessment — initial stability does NOT guarantee continued stability in sepsis.",
    learningObjective: "Recognize the clinical trajectory of deterioration from sepsis to septic shock and escalate treatment accordingly",
    blueprintCategory: "Shock",
    subtopic: "early vs late shock recognition",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A RISING lactate despite fluid resuscitation is one of the most ominous findings in sepsis — it indicates treatment failure and mandates escalation",
    clinicalPearls: [
      "The transition from sepsis to septic shock can occur rapidly — serial assessment is essential",
      "Rising lactate + declining BP + worsening mental status = treatment failure requiring vasopressors",
      "Don't delay vasopressors because the BP 'isn't low enough' — lactate trends are as important as BP"
    ],
    safetyNote: "Sepsis is a dynamic process — a patient can go from stable to septic shock within hours. Serial reassessment every 1-2 hours is mandatory",
    distractorRationales: [
      "A declining BP with rising lactate is NOT normal — this is clinical deterioration requiring escalation",
      "There is no evidence of fluid overload (no crackles, no desaturation mentioned) — the problem is inadequate resuscitation, not volume excess",
      "Rising lactate in sepsis is NEVER normal or expected — it always indicates worsening tissue hypoperfusion"
    ],
    lessonPath: "/emergency/lessons/early-vs-late-shock-recognition"
  },
  {
    stem: "A 45-year-old male with known Addison's disease is brought to the ED unconscious after a car accident. He has multiple injuries including a femur fracture. His BP is 62/34, HR 148, and he is not responding to standard trauma resuscitation with 2L crystalloid and 2 units PRBCs. His sodium is 124 and potassium is 6.4. The nurse suspects an additional contributing factor to his shock. What is it?",
    options: [
      "The low sodium indicates SIADH unrelated to the shock",
      "Addisonian crisis triggered by the physiological stress of trauma — his adrenal glands cannot produce the cortisol needed for the stress response, compounding hemorrhagic shock with distributive shock",
      "The hyperkalemia is from the blood transfusion only",
      "His Addison's disease has no impact on his trauma response"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has DUAL shock mechanisms: hemorrhagic shock from his injuries AND adrenal crisis triggered by the physiological stress of trauma. In Addison's disease (primary adrenal insufficiency), the adrenal glands cannot produce adequate cortisol or aldosterone. Under normal daily conditions, exogenous replacement (typically hydrocortisone 15-25 mg/day) is sufficient. However, physiological stress (trauma, surgery, infection) dramatically increases the body's cortisol demand — normal adrenal glands produce 200-300 mg of cortisol per day during severe stress, compared to 15-25 mg daily at baseline. A patient with Addison's disease cannot mount this stress response, leading to: (1) VASODILATORY SHOCK — cortisol is essential for vascular tone and catecholamine responsiveness. Without it, blood vessels cannot vasoconstrict in response to hemorrhage, and vasopressors are less effective; (2) HYPONATREMIA (124) — aldosterone deficiency causes sodium wasting in the kidney; (3) HYPERKALEMIA (6.4) — aldosterone deficiency prevents potassium excretion; (4) HYPOGLYCEMIA — cortisol is essential for gluconeogenesis. The combination explains why this patient is not responding to standard trauma resuscitation — you cannot effectively treat hemorrhagic shock in a patient who simultaneously has adrenal crisis because the vascular system cannot respond normally without cortisol. The treatment is STRESS-DOSE HYDROCORTISONE (100 mg IV bolus immediately, then 50 mg every 6-8 hours) in addition to standard trauma resuscitation. The emergency nurse must: check MedicAlert jewelry/documentation, administer stress-dose hydrocortisone, continue standard hemorrhagic shock management, monitor potassium (the hyperkalemia is from both adrenal crisis and trauma), and check blood glucose. This case illustrates why a thorough medical history and medication reconciliation is critical in trauma patients — pre-existing conditions can dramatically alter the shock response.",
    learningObjective: "Recognize adrenal crisis as a complicating factor in trauma shock and administer stress-dose hydrocortisone",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Trauma patients with Addison's disease who fail standard resuscitation may have superimposed adrenal crisis — always check for adrenal disease and Medic Alert identification",
    clinicalPearls: [
      "Stress cortisol demand: 200-300 mg/day (vs. 15-25 mg daily baseline) — Addison's patients cannot meet this",
      "Hyponatremia + hyperkalemia pattern in trauma = consider adrenal insufficiency",
      "Stress-dose hydrocortisone: 100 mg IV bolus, then 50 mg q6-8h"
    ],
    safetyNote: "Always check MedicAlert identification in trauma patients — pre-existing conditions like adrenal insufficiency change resuscitation requirements",
    distractorRationales: [
      "The low sodium is from aldosterone deficiency (Addison's), not SIADH — the clinical context makes this clear",
      "While transfused blood contains potassium, the combination of hyperkalemia + hyponatremia in an Addison's patient indicates adrenal crisis",
      "Addison's disease has PROFOUND impact on the stress response — it can make shock refractory to standard treatment"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 52-year-old male presents to the ED with severe abdominal pain, bloody diarrhea, and shock (HR 130, BP 78/42). He has a history of atrial fibrillation and is on warfarin. CT angiography reveals superior mesenteric artery thromboembolism with bowel ischemia. What type of shock is this patient developing?",
    options: [
      "Pure hypovolemic shock from GI bleeding",
      "Mixed hypovolemic and distributive shock — mesenteric ischemia causes both hemorrhage (bloody stool) and release of inflammatory mediators/bacterial translocation from the dying gut wall",
      "Obstructive shock from the mesenteric artery thrombus",
      "Cardiogenic shock from the atrial fibrillation"
    ],
    correctAnswer: 1,
    rationaleLong: "Acute mesenteric ischemia from superior mesenteric artery (SMA) embolism causes a mixed shock state with multiple pathophysiological mechanisms: (1) HYPOVOLEMIC component — the ischemic bowel wall becomes edematous and hemorrhagic, causing bloody diarrhea (GI hemorrhage) and massive third-spacing of fluid into the bowel wall and peritoneal cavity. Significant intravascular volume loss occurs; (2) DISTRIBUTIVE component — the dying bowel wall loses its barrier function, allowing bacterial translocation (gut bacteria and endotoxin cross into the portal and systemic circulation), triggering a sepsis-like systemic inflammatory response with vasodilation, capillary leak, and cytokine release. The ischemic bowel itself releases inflammatory mediators (lactate, potassium, phosphate, myoglobin from smooth muscle breakdown); (3) Additionally, the massive lactic acidosis from the ischemic tissue causes myocardial depression and further cardiovascular compromise. SMA embolism is the most common cause of acute mesenteric ischemia (approximately 50% of cases), and atrial fibrillation is the most common source of the embolus. The clinical presentation of acute mesenteric ischemia has a classic pattern: severe abdominal pain 'out of proportion to physical examination findings' (early — the pain is from ischemia, but the abdomen may be soft before peritonitis develops), bloody diarrhea (bowel mucosal sloughing), and progressive cardiovascular collapse. The emergency nurse should: initiate aggressive fluid resuscitation, type and crossmatch, administer broad-spectrum antibiotics (covering enteric organisms — the gut barrier has failed), start IV heparin anticoagulation (to prevent clot propagation), prepare for emergent surgical consultation (bowel resection of necrotic segments), and/or interventional radiology consultation (catheter-directed thrombolysis or thrombectomy). The serum lactate is typically markedly elevated (often greater than 10 mmol/L) and is an important prognostic indicator.",
    learningObjective: "Understand the mixed shock mechanism in acute mesenteric ischemia and initiate appropriate multi-faceted management",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Abdominal pain 'out of proportion to exam' in a patient with atrial fibrillation = suspect acute mesenteric ischemia until proven otherwise",
    clinicalPearls: [
      "SMA embolism from A-fib is the most common cause of acute mesenteric ischemia",
      "Mesenteric ischemia causes mixed shock: hypovolemic (hemorrhage/third-spacing) + distributive (bacterial translocation/inflammation)",
      "Markedly elevated lactate (often >10) is characteristic of mesenteric ischemia"
    ],
    safetyNote: "Acute mesenteric ischemia has 60-80% mortality — early diagnosis and intervention (before full-thickness bowel necrosis) dramatically improves survival",
    distractorRationales: [
      "The shock is not purely hypovolemic — bacterial translocation and inflammatory mediators cause a significant distributive component",
      "The arterial thrombus is in the mesenteric vasculature, not obstructing cardiac output — this is not obstructive shock",
      "While A-fib is the source of the embolus, the shock is from mesenteric ischemia, not the arrhythmia itself"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A nurse is caring for a patient on a vasopressin infusion at 0.04 units/min for septic shock. She notices the patient's fingers and toes are becoming dusky and cyanotic. What complication is developing?",
    options: [
      "Normal skin color changes from the vasopressin infusion",
      "Digital ischemia from vasopressin-mediated vasoconstriction of the peripheral microcirculation — a dose-dependent complication that can lead to digital gangrene",
      "Raynaud's phenomenon unrelated to the medication",
      "Allergic reaction to vasopressin"
    ],
    correctAnswer: 1,
    rationaleLong: "Digital ischemia is a recognized and potentially devastating complication of vasopressin infusion. Vasopressin acts through V1 receptors on vascular smooth muscle, causing vasoconstriction in both the systemic and peripheral circulations. In the peripheral microcirculation (particularly the digits, earlobes, and nasal tip), vasopressin-mediated vasoconstriction can be severe enough to cause ischemia, cyanosis, and if prolonged, dry gangrene requiring amputation. This complication is: (1) DOSE-DEPENDENT — higher doses (typically greater than 0.04 units/min) carry greater risk, though it can occur at any dose, especially with concurrent high-dose catecholamine use; (2) More common in patients with pre-existing peripheral vascular disease, diabetes, or Raynaud's phenomenon; (3) Exacerbated by concurrent use of other vasoconstrictive agents (norepinephrine, phenylephrine); (4) More common with prolonged infusion duration. The emergency nurse should: (1) Immediately report the dusky appearance to the physician; (2) Document the findings with photographs and written descriptions; (3) Assess all digits, ears, and nose for ischemic changes; (4) Anticipate potential dose reduction — however, in the septic shock setting, the vasopressin dose may be necessary for survival, creating a difficult risk-benefit decision; (5) Consider adding a selective vasodilator to the affected extremity (topical nitroglycerin to the affected digits has been used with varying success); (6) Elevate affected extremities to reduce dependent edema that worsens ischemia; (7) Keep the patient warm (cold causes additional peripheral vasoconstriction). Similar digital ischemia can occur with high-dose catecholamine vasopressors (norepinephrine, epinephrine). The complication reminds clinicians that vasopressors maintain vital organ perfusion (heart, brain, kidneys) at the expense of non-vital peripheral perfusion — a necessary tradeoff in shock, but one with potential consequences.",
    learningObjective: "Recognize vasopressin-induced digital ischemia and implement monitoring and mitigation strategies",
    blueprintCategory: "Shock",
    subtopic: "vasopressor management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Digital ischemia from vasopressors can progress to gangrene requiring amputation — early recognition and dose adjustment can prevent irreversible damage",
    clinicalPearls: [
      "Monitor digits, earlobes, and nose for ischemic changes during all vasopressor infusions",
      "Vasopressin is typically dosed at 0.03-0.04 units/min — doses above this increase ischemia risk",
      "Topical nitroglycerin to affected digits may improve local perfusion without systemic effect"
    ],
    safetyNote: "Photo-document digital ischemia progression — this helps guide the risk-benefit discussion about vasopressor dosing with the medical team",
    distractorRationales: [
      "Dusky cyanotic digits are NOT normal — they indicate pathological vasoconstriction requiring attention",
      "While the patient may have underlying Raynaud's, the temporal relationship with vasopressin infusion makes drug-induced ischemia most likely",
      "Allergic reactions present with urticaria, angioedema, or anaphylaxis — not digital cyanosis"
    ],
    lessonPath: "/emergency/lessons/vasopressor-management"
  },
  {
    stem: "A 30-year-old male presents to the ED with fever, sore throat, and rapidly progressive neck swelling. He has trismus, drooling, and a 'hot potato' voice. Over 30 minutes, he becomes stridorous and hypotensive (BP 84/48). CT confirms a retropharyngeal abscess extending into the mediastinum. What TWO life-threatening emergencies is this patient facing?",
    options: [
      "Allergic reaction and esophageal rupture",
      "Airway obstruction from the abscess AND septic shock from descending mediastinitis — both require simultaneous management",
      "Cardiac tamponade and pneumothorax",
      "Anaphylaxis and tension pneumothorax"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has two simultaneous life-threatening emergencies that must be managed in parallel: (1) AIRWAY OBSTRUCTION — the retropharyngeal abscess is expanding and compressing the airway from behind, causing stridor (indicating critical narrowing of the airway). The trismus (inability to open the mouth fully), drooling (inability to manage secretions), and 'hot potato' voice (muffled voice from oropharyngeal edema) are all ominous signs of impending complete airway obstruction. This is a difficult airway situation — the distorted anatomy, edema, and pus make conventional intubation extremely challenging. Options include: awake fiberoptic intubation (preserving spontaneous respirations while visualizing the distorted airway), surgical airway (cricothyrotomy may be needed if oral/nasal intubation fails), and the airway team should be prepared for emergent surgical airway before any sedation is administered; (2) SEPTIC SHOCK from descending mediastinitis — the infection has spread from the retropharyngeal space into the mediastinum, a rapidly fatal condition with mortality rates of 40-50%. The mediastinal infection causes severe sepsis with cardiovascular collapse. Descending necrotizing mediastinitis requires: emergent surgical drainage (thoracotomy or thoracoscopic drainage), broad-spectrum antibiotics covering oropharyngeal flora (ampicillin-sulbactam or clindamycin plus a cephalosporin, covering streptococci, anaerobes, and staphylococci), and aggressive hemodynamic resuscitation (IV fluids, vasopressors). The emergency nurse must: (1) Prepare for difficult airway management (have surgical airway kit, fiberoptic scope, and multiple intubation approaches ready); (2) Do NOT lay the patient flat (this worsens airway obstruction — keep upright or in a position of comfort); (3) Initiate sepsis resuscitation (IV fluids, broad-spectrum antibiotics, vasopressors); (4) Notify ENT/thoracic surgery emergently for operative drainage; (5) Have suction immediately available for the anticipated pus and secretions.",
    learningObjective: "Manage the dual emergency of airway obstruction and septic shock from deep neck space infection with mediastinal extension",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Retropharyngeal abscess extending into the mediastinum = descending mediastinitis with 40-50% mortality — this is a surgical emergency",
    clinicalPearls: [
      "Hot potato voice + trismus + drooling = deep space neck infection with airway compromise",
      "Descending mediastinitis has 40-50% mortality — requires emergent surgical drainage",
      "Keep the patient upright — supine positioning worsens airway obstruction"
    ],
    safetyNote: "Do NOT sedate the patient for intubation without a surgical airway backup plan — loss of spontaneous respirations in a critically narrowed airway can be fatal",
    distractorRationales: [
      "No evidence of allergic reaction or esophageal rupture in this presentation",
      "No evidence of cardiac tamponade or pneumothorax — the shock is from sepsis/mediastinitis",
      "No evidence of anaphylaxis or tension pneumothorax — the findings are consistent with deep neck infection"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 65-year-old male with a left ventricular assist device (LVAD) presents to the ED feeling dizzy and weak. His LVAD controller shows a low-flow alarm. The nurse cannot obtain a blood pressure with a standard cuff. What should the nurse understand about hemodynamic assessment in LVAD patients?",
    options: [
      "The LVAD is malfunctioning and should be turned off immediately",
      "LVAD patients often have non-pulsatile (continuous) flow — standard BP cuffs may not detect a blood pressure. Use a Doppler to obtain a MAP, and assess the LVAD parameters (flow, speed, power) displayed on the controller",
      "Use a rectal temperature probe to measure blood pressure",
      "LVAD patients always have normal blood pressure readings"
    ],
    correctAnswer: 1,
    rationaleLong: "Left ventricular assist devices (LVADs) are mechanical pumps that augment or replace left ventricular function in patients with advanced heart failure. Most modern LVADs (HeartMate 3, HeartWare HVAD) are continuous-flow devices that provide non-pulsatile blood flow — this means the blood flows through the arterial system at a steady rate rather than in the pulsatile waves generated by a native heartbeat. As a result: (1) Standard blood pressure cuffs rely on detecting the pulsatile wave (Korotkoff sounds) and may NOT register a blood pressure in continuous-flow LVAD patients; (2) A Doppler ultrasound placed over the brachial artery can detect the continuous flow and provide a mean arterial pressure (MAP) — this is the standard method for measuring BP in LVAD patients. The target MAP is typically 70-90 mmHg; (3) Pulse oximetry may also fail to register in non-pulsatile flow, though most modern oximeters can detect low-pulsatility signals; (4) The LVAD controller displays critical parameters: pump speed (RPM), estimated flow (L/min), and power consumption (watts). Low-flow alarms indicate decreased pump output, which can result from: hypovolemia (decreased preload), RV failure (the RV must still pump blood through the lungs to fill the LVAD), pump thrombosis (clot in the pump impeller — characterized by increased power consumption), suction events (the pump is pulling faster than the ventricle can fill, causing the ventricle to collapse around the inflow cannula), or arrhythmias. The emergency nurse should: NEVER turn off the LVAD (this is immediately life-threatening — the patient is LVAD-dependent), obtain a Doppler MAP, assess the LVAD controller for alarms and parameter trends, assess the patient clinically (mental status, skin perfusion, urine output), perform a focused echocardiogram if available, and contact the patient's LVAD center coordinator for remote troubleshooting.",
    learningObjective: "Perform hemodynamic assessment of LVAD patients using Doppler and LVAD controller parameters",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER turn off an LVAD — the patient is dependent on it for cardiac output. Even in cardiac arrest, the LVAD should continue running.",
    clinicalPearls: [
      "Use Doppler to measure MAP in LVAD patients — standard BP cuffs may not work with non-pulsatile flow",
      "Target MAP in LVAD patients: 70-90 mmHg (excessive hypertension reduces pump flow)",
      "LVAD low-flow alarm causes: hypovolemia, RV failure, pump thrombosis, suction events, arrhythmias"
    ],
    safetyNote: "Contact the patient's LVAD center for any device alarms or malfunction — they can provide remote troubleshooting and expertise",
    distractorRationales: [
      "Turning off the LVAD would be immediately life-threatening — the patient depends on it for cardiac output",
      "A rectal temperature probe cannot measure blood pressure — this is not a valid assessment technique",
      "LVAD patients frequently have undetectable BP by standard methods — this is expected, not a sign of device failure"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 40-year-old female presents to the ED with suspected spinal epidural abscess. She has fever, severe localized back pain, and progressive leg weakness over 48 hours. She becomes hypotensive (BP 78/42) with altered mental status. What are the TWO simultaneous emergencies requiring immediate management?",
    options: [
      "Migraine headache and anxiety",
      "Septic shock from the spinal infection AND spinal cord compression from the abscess requiring emergent decompression to prevent permanent paralysis",
      "Lumbar disc herniation and urinary tract infection",
      "Osteoporotic compression fracture and pneumonia"
    ],
    correctAnswer: 1,
    rationaleLong: "Spinal epidural abscess presents a dual emergency: (1) SEPTIC SHOCK — the spinal infection is causing systemic sepsis with hemodynamic instability. The abscess serves as a focus of infection that seeds the bloodstream with bacteria (most commonly Staphylococcus aureus). Management follows standard sepsis protocols: IV fluid resuscitation (30 mL/kg crystalloid), vasopressors (norepinephrine) for refractory hypotension, blood cultures, and broad-spectrum IV antibiotics with excellent CNS penetration and S. aureus coverage (typically vancomycin plus a third/fourth-generation cephalosporin or meropenem); (2) SPINAL CORD COMPRESSION — the expanding abscess in the epidural space compresses the spinal cord, causing progressive neurological deficit. The classic presentation follows a triad: Stage 1 — localized back pain (often severe, constant, worse with percussion), Stage 2 — radiculopathy (nerve root pain), Stage 3 — motor weakness, sensory deficits, bowel/bladder dysfunction, Stage 4 — paralysis. This patient is in Stage 3 (leg weakness), and progression to Stage 4 (paralysis) may be irreversible if not surgically decompressed within a time-sensitive window. MRI is the diagnostic imaging of choice (95% sensitivity). The emergency nurse must: treat both emergencies simultaneously, recognize that time is critical for spinal cord preservation, prepare for emergent MRI, notify the neurosurgical team for potential emergent laminectomy and abscess drainage, and maintain strict neurological monitoring (serial motor/sensory exams every 1-2 hours). Risk factors for spinal epidural abscess include: IV drug use, diabetes, immunosuppression, recent spinal procedure (epidural injection, surgery), and bacteremia from any source.",
    learningObjective: "Recognize the dual emergency of septic shock and spinal cord compression in spinal epidural abscess",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Progressive neurological deficit from spinal epidural abscess is a SURGICAL EMERGENCY — delay in decompression can result in permanent paralysis",
    clinicalPearls: [
      "Classic triad progression: back pain → radiculopathy → motor deficit → paralysis",
      "MRI is 95% sensitive for spinal epidural abscess — obtain emergently",
      "S. aureus is the most common organism — cover with vancomycin empirically"
    ],
    safetyNote: "Serial neurological exams every 1-2 hours — any progression of motor deficit mandates IMMEDIATE neurosurgical intervention",
    distractorRationales: [
      "This presentation is far more serious than migraine and anxiety — it is a surgical and septic emergency",
      "Disc herniation does not cause fever and septic shock — the systemic signs indicate infection",
      "Compression fracture does not cause progressive neurological deficit or septic shock"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 55-year-old male in septic shock has been on norepinephrine for 12 hours. The nurse notes that the norepinephrine concentration running through a peripheral 20-gauge IV in the dorsum of the hand has been extravasating — there is a 4cm area of blanching and induration around the IV site. What is the immediate treatment for vasopressor extravasation?",
    options: [
      "Apply warm compresses and observe",
      "Immediately inject phentolamine (5-10 mg diluted in 10-15 mL NS) subcutaneously around the extravasation site using a 25-gauge needle to reverse the local vasoconstriction",
      "Apply a tourniquet above the extravasation site",
      "No treatment is needed — the blanching will resolve on its own"
    ],
    correctAnswer: 1,
    rationaleLong: "Norepinephrine extravasation is a medical emergency requiring immediate intervention. The potent alpha-1 vasoconstriction from norepinephrine causes intense local vasoconstriction in the subcutaneous tissue, which can rapidly progress to tissue ischemia, necrosis, and sloughing if not promptly treated. The treatment of choice is LOCAL INJECTION OF PHENTOLAMINE — an alpha-adrenergic antagonist that reverses the norepinephrine-induced vasoconstriction. The procedure: (1) Draw up phentolamine 5-10 mg diluted in 10-15 mL of normal saline; (2) Using a 25-gauge needle, infiltrate the solution subcutaneously into and around the area of extravasation (multiple small injections distributed throughout the affected area); (3) Massage the area gently to distribute the phentolamine; (4) The blanching should begin to resolve within minutes as the vasoconstriction reverses; (5) Monitor the site for 24-48 hours — if ischemia persists or progresses, repeat phentolamine injection may be needed. Time is critical — phentolamine is most effective when administered within 12 hours of extravasation. Beyond 12 hours, tissue necrosis may already be established and irreversible. Prevention is the best strategy: (1) Central venous access is preferred for vasopressor infusion; (2) If peripheral administration is necessary, use the largest vein possible (antecubital preferred over hand veins), with the largest catheter possible (18-gauge minimum); (3) Monitor the IV site every 1-2 hours for signs of extravasation (blanching, edema, pain, induration); (4) Have phentolamine readily available on any unit where vasopressors are administered peripherally. The emergency nurse should also document the extravasation event, including the size of the affected area, the time of discovery, and the treatment administered.",
    learningObjective: "Treat vasopressor extravasation with local phentolamine injection and understand prevention strategies",
    blueprintCategory: "Shock",
    subtopic: "vasopressor management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Phentolamine must be injected within 12 hours of extravasation for maximum effectiveness — beyond this window, tissue necrosis may be irreversible",
    clinicalPearls: [
      "Phentolamine dose: 5-10 mg in 10-15 mL NS, injected subcutaneously around the extravasation site",
      "Use a 25-gauge needle for multiple small injections distributed throughout the affected area",
      "Monitor IV sites every 1-2 hours during peripheral vasopressor infusion"
    ],
    safetyNote: "Have phentolamine available on ALL units where vasopressors are administered — delay in treatment causes irreversible tissue necrosis",
    distractorRationales: [
      "Warm compresses alone will not reverse the alpha-1 vasoconstriction — phentolamine is required",
      "A tourniquet would worsen ischemia by further reducing blood flow to the affected area",
      "Vasopressor extravasation does NOT resolve on its own — without treatment, the vasoconstriction progresses to tissue necrosis"
    ],
    lessonPath: "/emergency/lessons/vasopressor-management"
  },
  {
    stem: "A 68-year-old female presents to the ED with new-onset atrial fibrillation with rapid ventricular response (HR 178 bpm). She has been symptomatic for approximately 4 hours with palpitations, dyspnea, and dizziness. Her BP is now 82/50 mmHg. She is pale and diaphoretic. What is the immediate treatment for this hemodynamically unstable tachycardia?",
    options: [
      "IV amiodarone to control the heart rate",
      "Synchronized cardioversion — hemodynamically unstable tachycardia requires immediate electrical cardioversion regardless of rhythm type",
      "IV diltiazem for rate control",
      "Vagal maneuvers to slow the heart rate"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has hemodynamically unstable tachycardia — defined as a tachyarrhythmia causing significant hemodynamic compromise (hypotension, altered mental status, acute heart failure, or ischemic chest pain). The treatment per ACLS guidelines is immediate synchronized cardioversion — electrical conversion of the arrhythmia back to normal sinus rhythm or at least to a more hemodynamically tolerable rate. In hemodynamically unstable tachycardia, the primary survey takes priority: the rapid ventricular rate is causing the hemodynamic compromise (the heart cannot fill adequately at rates this high, reducing stroke volume and cardiac output), and the fastest way to restore hemodynamic stability is to electrically convert the rhythm. Synchronized cardioversion differs from defibrillation: the defibrillator is set to 'sync' mode, which delivers the shock synchronized to the R wave of the QRS complex. This avoids delivering the shock during the vulnerable period of ventricular repolarization (the T wave), which could induce ventricular fibrillation. For atrial fibrillation, the initial energy for synchronized cardioversion is typically 120-200 Joules biphasic. The emergency nurse should: apply defibrillation pads, set the defibrillator to synchronized mode, verify the machine is sensing and marking the R waves correctly, provide procedural sedation if the patient is conscious and time permits (etomidate 0.2 mg/kg or midazolam/fentanyl — but do NOT delay cardioversion for sedation if the patient is critically unstable), ensure the team is clear before delivering the shock, and be prepared for immediate post-cardioversion assessment. If the first shock is unsuccessful, increase the energy and repeat. IV medications (amiodarone, diltiazem) work too slowly in the setting of hemodynamic instability — they are appropriate for STABLE patients with rapid A-fib.",
    learningObjective: "Apply synchronized cardioversion for hemodynamically unstable tachycardia",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Hemodynamically UNSTABLE tachycardia = cardioversion. Hemodynamically STABLE tachycardia = medication. The hemodynamic status determines the approach.",
    clinicalPearls: [
      "Synchronized cardioversion delivers the shock on the R wave — avoiding the vulnerable T wave period",
      "A-fib cardioversion energy: 120-200J biphasic initially; increase if unsuccessful",
      "Procedural sedation is preferred but should NOT delay cardioversion in critically unstable patients"
    ],
    safetyNote: "Verify the defibrillator is in SYNC mode before cardioversion — unsynchronized shock in a patient with a perfusing rhythm can cause VF",
    distractorRationales: [
      "IV amiodarone works too slowly for hemodynamic instability — it takes 15-30 minutes to effect and is for stable patients",
      "IV diltiazem is appropriate for stable A-fib with RVR but not for hemodynamically unstable patients",
      "Vagal maneuvers are for narrow-complex SVT, not atrial fibrillation, and are inappropriate in hemodynamic instability"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 38-year-old male presents to the ED with a witnessed bee sting 45 minutes ago. He received IM epinephrine from his EpiPen at the scene. His symptoms (urticaria, mild wheezing) initially improved but have now returned 40 minutes later. The nurse recognizes this as a biphasic anaphylactic reaction. How common is this, and what is the appropriate management?",
    options: [
      "Biphasic reactions are extremely rare and this is likely a new allergen exposure",
      "Biphasic anaphylaxis occurs in up to 20% of anaphylactic reactions and presents 1-72 hours after initial resolution — the patient needs repeat epinephrine and a minimum 6-8 hour observation period",
      "The initial treatment was inadequate and a different medication should be used",
      "Biphasic reactions only occur with food allergens, not insect stings"
    ],
    correctAnswer: 1,
    rationaleLong: "Biphasic anaphylaxis is a well-recognized phenomenon in which anaphylactic symptoms recur after initial resolution, without re-exposure to the allergen. The recurrence occurs due to a delayed release of inflammatory mediators from mast cells and basophils (the 'late-phase response'). Key facts about biphasic anaphylaxis: (1) INCIDENCE — reported in 1-20% of anaphylactic reactions (estimates vary based on study methodology and definition used). Most commonly cited rate is approximately 5-10%; (2) TIMING — the second phase typically occurs 1-8 hours after initial resolution, but can occur up to 72 hours later. The median time to second phase is approximately 6-11 hours; (3) SEVERITY — the second phase can be MORE severe than the initial reaction, including fatal anaphylaxis; (4) RISK FACTORS for biphasic reaction include: severity of the initial reaction, delayed epinephrine administration, requirement for multiple epinephrine doses, wide pulse pressure on initial presentation, and potentially inadequate corticosteroid dosing (though corticosteroid prevention of biphasic reactions remains debated). Management of the biphasic reaction follows the same protocol as initial anaphylaxis: (1) Repeat IM epinephrine (0.3-0.5 mg of 1:1,000); (2) Aggressive fluid resuscitation if hypotensive; (3) Antihistamines (H1 and H2 blockers); (4) Corticosteroids if not already given; (5) Close hemodynamic and respiratory monitoring. This is why ALL anaphylaxis patients should be observed for a minimum of 6-8 hours after symptom resolution — some guidelines recommend 24 hours for patients with severe initial reactions, airway involvement, or known risk factors for biphasic reaction. The emergency nurse should: re-administer epinephrine, maintain monitoring, educate the patient about the importance of the observation period, and ensure the patient is not discharged prematurely after initial symptom improvement.",
    learningObjective: "Recognize biphasic anaphylaxis and understand the importance of the minimum observation period",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Initial improvement after epinephrine does NOT mean the patient is safe — biphasic reactions can be MORE severe than the initial event",
    clinicalPearls: [
      "Biphasic anaphylaxis occurs in 5-10% of cases, typically 1-8 hours after initial resolution",
      "Minimum 6-8 hour observation after anaphylaxis — some guidelines recommend 24 hours for severe reactions",
      "The second phase can be MORE severe than the initial reaction — including fatal anaphylaxis"
    ],
    safetyNote: "Never discharge an anaphylaxis patient before the minimum observation period — biphasic reactions can be fatal",
    distractorRationales: [
      "Biphasic reactions are not extremely rare — they occur in up to 20% of cases",
      "The initial treatment was appropriate — the biphasic reaction is a separate physiological event, not a treatment failure",
      "Biphasic reactions occur with all allergen types — insect stings, foods, medications, and latex"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 70-year-old male presents to the ED with cardiogenic shock from an acute inferior STEMI. His BP is 78/50, HR 44 (complete heart block), and he has bilateral crackles. He needs emergent PCI but is hemodynamically too unstable for transport to the catheterization lab. What mechanical circulatory support device can be rapidly inserted to stabilize him for transport?",
    options: [
      "Ventricular assist device (VAD) implantation in the ED",
      "Intra-aortic balloon pump (IABP) — can be inserted percutaneously via the femoral artery at the bedside, providing counterpulsation that augments coronary perfusion and reduces afterload",
      "Extracorporeal membrane oxygenation (ECMO) as the first-line device",
      "Total artificial heart"
    ],
    correctAnswer: 1,
    rationaleLong: "The intra-aortic balloon pump (IABP) is the most commonly used mechanical circulatory support (MCS) device in cardiogenic shock and can be inserted rapidly at the bedside through the femoral artery using a percutaneous technique. The IABP works through counterpulsation — the helium-filled balloon inflates during diastole and deflates during systole: (1) DIASTOLIC AUGMENTATION — the balloon inflates during diastole, displacing blood in the aorta both proximally and distally. The proximal displacement augments coronary perfusion pressure (the coronary arteries fill during diastole), delivering more oxygen to the ischemic myocardium; (2) SYSTOLIC UNLOADING — the balloon deflates immediately before systole, creating a relative void in the aorta that reduces the afterload (resistance) against which the left ventricle must eject. This reduces myocardial work and oxygen demand. The net effect is: increased coronary perfusion, decreased myocardial oxygen demand, increased cardiac output (approximately 0.5-1.0 L/min augmentation), and improved hemodynamic stability — often enough to stabilize a patient for transport to the catheterization lab for PCI. The IABP is triggered by the ECG or arterial pressure waveform and inflates/deflates in synchrony with the cardiac cycle. In this patient, the complete heart block with bradycardia may require transcutaneous pacing to optimize IABP timing. The emergency nurse's role includes: preparing the insertion kit (IABP catheter, insertion tray, sterile supplies), assisting with the percutaneous femoral artery insertion, monitoring the IABP timing (the augmented diastolic pressure should be higher than the unassisted systolic pressure), monitoring the insertion site for hemorrhage, assessing distal pulses in the catheterized extremity (the IABP can cause leg ischemia), and documenting IABP parameters. While the SHOCK II trial showed no survival benefit of IABP in cardiogenic shock, it remains widely used as a bridge to definitive intervention.",
    learningObjective: "Understand the mechanism and application of intra-aortic balloon pump counterpulsation in cardiogenic shock",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "IABP inflates in DIASTOLE (augments coronary perfusion) and deflates in SYSTOLE (reduces afterload). Timing is critical for benefit.",
    clinicalPearls: [
      "IABP: diastolic inflation augments coronary perfusion; systolic deflation reduces afterload",
      "Can be inserted percutaneously at bedside via femoral artery — no operating room needed",
      "IABP timing is critical: augmented diastolic pressure should exceed unassisted systolic pressure"
    ],
    safetyNote: "Monitor distal pulses in the catheterized extremity — IABP can cause leg ischemia. Absent pulses require immediate intervention.",
    distractorRationales: [
      "VAD implantation requires surgery and cannot be performed at the bedside",
      "ECMO requires specialized cannulation and is typically a second-line escalation after IABP",
      "Total artificial heart requires major surgery — this is not a bedside intervention"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 50-year-old male with septic shock is being managed in the ED. His initial lactate was 8.4 mmol/L. After 6 hours of resuscitation with 60 mL/kg crystalloid, norepinephrine, vasopressin, and stress-dose hydrocortisone, his lactate has decreased to 2.8 mmol/L. His MAP is 70 mmHg and urine output is 0.6 mL/kg/hr. What do these parameters collectively indicate about the patient's resuscitation status?",
    options: [
      "Resuscitation is complete and all medications can be weaned immediately",
      "The resuscitation is EFFECTIVE — lactate is clearing (66% clearance), MAP is at target, and urine output is adequate. Continue current therapy with serial reassessment and begin cautious vasopressor weaning when hemodynamic stability is sustained",
      "The resuscitation has failed and the patient needs surgical intervention",
      "The lactate decrease is meaningless without a normal ABG"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient demonstrates a favorable response to sepsis resuscitation, as evidenced by improvement across multiple clinical endpoints: (1) LACTATE CLEARANCE — the lactate has decreased from 8.4 to 2.8 mmol/L, representing a 67% clearance. The SSC guidelines recommend targeting lactate clearance of at least 10-20% over 2-4 hours; this patient has far exceeded that goal. The lactate is approaching normal (less than 2 mmol/L), indicating that tissue perfusion is being restored; (2) MAP AT TARGET — MAP of 70 mmHg exceeds the minimum target of 65 mmHg, indicating adequate systemic perfusion pressure; (3) URINE OUTPUT ADEQUATE — 0.6 mL/kg/hr exceeds the target of 0.5 mL/kg/hr, indicating adequate renal perfusion. The combination of these three parameters provides a comprehensive picture of resuscitation adequacy — they represent different aspects of perfusion: lactate (tissue level), MAP (systemic pressure), and urine output (organ perfusion). However, the resuscitation is NOT complete: (1) The lactate is still above normal (2.8 vs. goal less than 2); (2) The patient is on significant vasopressor support (norepinephrine + vasopressin + hydrocortisone); (3) Source control must be verified (is the infection being adequately treated?). The appropriate approach is to continue current therapy with serial reassessment. Vasopressor weaning should be attempted cautiously when hemodynamic stability is sustained for several hours — wean one agent at a time (typically vasopressin first, then norepinephrine). The emergency nurse should continue monitoring all three endpoints (lactate, MAP, UOP) during the weaning process and be prepared to reverse any decremental changes.",
    learningObjective: "Interpret multiple resuscitation endpoints to assess the adequacy of septic shock management",
    blueprintCategory: "Shock",
    subtopic: "early vs late shock recognition",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Effective resuscitation requires improvement across MULTIPLE endpoints — lactate clearance, MAP, and urine output should all be trending favorably",
    clinicalPearls: [
      "Three key resuscitation endpoints: lactate (tissue), MAP (systemic), urine output (organ perfusion)",
      "Wean vasopressors one at a time — typically vasopressin first, then norepinephrine",
      "Lactate clearance ≥10-20% over 2-4 hours indicates adequate resuscitation response"
    ],
    safetyNote: "Do not wean vasopressors too quickly — premature weaning can cause hemodynamic collapse. Ensure stability is sustained for several hours before weaning.",
    distractorRationales: [
      "Immediately weaning all medications risks hemodynamic collapse — the patient is still on significant support",
      "The improving clinical endpoints indicate the resuscitation is working, not failing",
      "Lactate clearance is one of the most validated markers of resuscitation adequacy — it is highly meaningful"
    ],
    lessonPath: "/emergency/lessons/early-vs-late-shock-recognition"
  }
];
