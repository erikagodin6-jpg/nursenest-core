export interface DifferentialDiagnosis {
  condition: string;
  keyFeatures: string;
  urgency: "emergent" | "urgent" | "non-urgent";
}

export interface AssessmentStep {
  step: string;
  description: string;
}

export interface SymptomPracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

export interface SymptomAssessment {
  slug: string;
  symptom: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  introduction: string;
  redFlags: string[];
  differentialDiagnoses: DifferentialDiagnosis[];
  assessmentSteps: AssessmentStep[];
  clinicalDecisionMaking: string;
  nursingInterventions: string[];
  examTips: string[];
  practiceQuestions: SymptomPracticeQuestion[];
  faq: { question: string; answer: string }[];
  relatedSymptomSlugs: string[];
}

export const symptomAssessments: SymptomAssessment[] = [
  {
    slug: "chest-pain",
    symptom: "Chest Pain",
    title: "Chest Pain Nursing Assessment: Differential Diagnosis & Clinical Decision-Making",
    metaTitle: "Chest Pain Nursing Assessment | Differential Diagnosis & Red Flags",
    metaDescription: "Comprehensive chest pain nursing assessment guide: differential diagnoses, red flags, PQRST assessment, clinical decision-making, and NCLEX practice questions.",
    keywords: "chest pain nursing assessment, chest pain differential diagnosis, PQRST assessment, cardiac chest pain vs non-cardiac, NCLEX chest pain",
    introduction: "Chest pain is one of the most common and critical presenting complaints in clinical practice. The nurse's ability to rapidly assess, differentiate, and prioritize chest pain can be the difference between life and death. Chest pain can originate from cardiac, pulmonary, gastrointestinal, musculoskeletal, or psychological causes. A systematic approach using PQRST assessment and recognition of red flags is essential for safe clinical decision-making.",
    redFlags: [
      "Crushing, pressure-like pain radiating to left arm, jaw, or back (acute MI)",
      "Sudden onset with diaphoresis, dyspnea, and nausea (ACS)",
      "Tearing pain radiating to back (aortic dissection)",
      "Pleuritic chest pain with sudden dyspnea and tachycardia (pulmonary embolism)",
      "Pain with fever, muffled heart sounds, and JVD (cardiac tamponade — Beck's triad)",
      "Chest pain with unequal breath sounds (tension pneumothorax)",
      "Chest pain with hemodynamic instability (hypotension, altered consciousness)",
    ],
    differentialDiagnoses: [
      { condition: "Acute Myocardial Infarction", keyFeatures: "Crushing/pressure pain, radiation to left arm/jaw, diaphoresis, nausea, ST changes on ECG, elevated troponin", urgency: "emergent" },
      { condition: "Unstable Angina", keyFeatures: "Chest pain at rest or with minimal exertion, not relieved by nitroglycerin, negative troponin", urgency: "emergent" },
      { condition: "Pulmonary Embolism", keyFeatures: "Sudden pleuritic chest pain, dyspnea, tachycardia, hypoxemia, risk factors (immobility, recent surgery)", urgency: "emergent" },
      { condition: "Aortic Dissection", keyFeatures: "Sudden tearing/ripping pain radiating to back, unequal BP in arms, widened mediastinum on CXR", urgency: "emergent" },
      { condition: "Cardiac Tamponade", keyFeatures: "Beck's triad: hypotension, muffled heart sounds, JVD; pulsus paradoxus", urgency: "emergent" },
      { condition: "Tension Pneumothorax", keyFeatures: "Sudden chest pain, dyspnea, absent breath sounds on one side, tracheal deviation", urgency: "emergent" },
      { condition: "Stable Angina", keyFeatures: "Predictable exertional chest pain, relieved by rest/NTG within 5 min", urgency: "urgent" },
      { condition: "Pericarditis", keyFeatures: "Sharp pleuritic pain relieved by leaning forward, friction rub, diffuse ST elevation", urgency: "urgent" },
      { condition: "GERD/Esophageal Spasm", keyFeatures: "Burning pain, worse after meals/lying flat, relieved by antacids, no ECG changes", urgency: "non-urgent" },
      { condition: "Costochondritis", keyFeatures: "Localized tenderness at costochondral junctions, reproducible with palpation", urgency: "non-urgent" },
      { condition: "Anxiety/Panic Attack", keyFeatures: "Chest tightness, hyperventilation, tingling, normal ECG and troponin", urgency: "non-urgent" },
    ],
    assessmentSteps: [
      { step: "P — Provocation/Palliation", description: "What triggers the pain? What makes it better or worse? Activity, rest, breathing, position changes, meals?" },
      { step: "Q — Quality", description: "How does the pain feel? Crushing, sharp, burning, tearing, pressure, squeezing? Quality helps differentiate cardiac from non-cardiac causes." },
      { step: "R — Region/Radiation", description: "Where is the pain located? Does it radiate? Left arm/jaw (MI), back (aortic dissection), shoulder (pericarditis/diaphragmatic irritation)?" },
      { step: "S — Severity", description: "Rate the pain on a 0-10 scale. Document the patient's subjective pain rating and observe objective signs (grimacing, guarding)." },
      { step: "T — Timing", description: "When did the pain start? How long does it last? Constant, intermittent, or episodic? Onset correlates with different diagnoses." },
      { step: "Vital Signs", description: "Obtain complete vital signs including BP in both arms (aortic dissection screening), heart rate, respiratory rate, SpO2, and temperature." },
      { step: "12-Lead ECG", description: "Obtain within 10 minutes of presentation. Look for ST elevation (STEMI), ST depression (NSTEMI/ischemia), T-wave changes, or new arrhythmias." },
      { step: "Physical Exam", description: "Auscultate heart and lung sounds. Palpate chest wall for tenderness. Assess JVD, peripheral pulses, and bilateral BP." },
    ],
    clinicalDecisionMaking: "The priority in chest pain assessment is to rapidly identify life-threatening causes (MI, PE, aortic dissection, tamponade, tension pneumothorax) through a combination of history, physical exam, ECG, and lab work. Cardiac chest pain is typically described as pressure or squeezing, radiates to the left arm or jaw, and is associated with diaphoresis and dyspnea. Always assume chest pain is cardiac until proven otherwise. The golden rule: time is muscle — every minute of delay in treating acute MI results in progressive myocardial necrosis.",
    nursingInterventions: [
      "Obtain 12-lead ECG within 10 minutes of arrival",
      "Establish IV access and draw cardiac biomarkers (troponin, CK-MB)",
      "Administer aspirin 325 mg chewable if ACS suspected and not contraindicated",
      "Administer nitroglycerin SL for ischemic chest pain (hold if systolic BP <90)",
      "Apply continuous cardiac monitoring",
      "Administer oxygen if SpO2 <94%",
      "Maintain bedrest to reduce myocardial oxygen demand",
      "Prepare for cardiac catheterization if STEMI identified",
      "Repeat troponin at 3 and 6 hours for serial monitoring",
      "Document pain assessment using PQRST and reassess after interventions",
    ],
    examTips: [
      "ECG within 10 minutes of chest pain presentation — time is muscle",
      "Aspirin 325 mg chewable is priority for suspected ACS (NOT enteric-coated)",
      "Nitroglycerin: do NOT give if systolic BP <90 mmHg or if patient took PDE5 inhibitor (Viagra) within 24-48 hours",
      "Aortic dissection: tearing pain to back + unequal BP in arms = do NOT give thrombolytics",
      "Chest pain diagnosis of exclusion: always rule out cardiac causes first",
    ],
    practiceQuestions: [
      {
        question: "A patient presents with sudden onset tearing chest pain radiating to the back with BP 180/100 in the right arm and 140/80 in the left arm. What should the nurse suspect?",
        options: ["Acute myocardial infarction", "Pulmonary embolism", "Aortic dissection", "Pericarditis"],
        correctIndex: 2,
        rationale: "Sudden tearing pain radiating to the back with unequal blood pressures in the arms is the classic presentation of aortic dissection. This is a surgical emergency. Thrombolytics are contraindicated."
      },
      {
        question: "A patient with chest pain is diaphoretic with ST elevation in leads V1-V4. What is the nurse's priority action?",
        options: ["Obtain a repeat ECG in 1 hour", "Administer aspirin and prepare for cardiac catheterization", "Schedule an echocardiogram", "Administer a beta-blocker orally"],
        correctIndex: 1,
        rationale: "ST elevation in V1-V4 indicates an anterior STEMI. The priority is aspirin 325 mg chewable and emergent cardiac catheterization for PCI. Door-to-balloon time should be less than 90 minutes."
      },
      {
        question: "Which chest pain finding suggests a NON-cardiac cause?",
        options: ["Pain radiating to left jaw", "Pain reproduced by chest wall palpation", "Pain with diaphoresis and nausea", "Pain with ST depression on ECG"],
        correctIndex: 1,
        rationale: "Chest pain that is reproducible with palpation of the chest wall is characteristic of musculoskeletal causes such as costochondritis. Cardiac chest pain is not typically reproduced by palpation."
      },
    ],
    faq: [
      { question: "How do you differentiate cardiac from non-cardiac chest pain?", answer: "Cardiac chest pain is typically described as pressure, squeezing, or heaviness; radiates to the left arm, jaw, or back; is associated with diaphoresis, dyspnea, and nausea; and is NOT reproducible with palpation. Non-cardiac chest pain may be sharp, localized, reproducible with palpation, or related to meals/positioning. However, atypical presentations are common, especially in women, elderly, and diabetic patients." },
      { question: "What is the PQRST assessment for chest pain?", answer: "PQRST is a systematic pain assessment mnemonic: P (Provocation/Palliation — what triggers or relieves it), Q (Quality — how it feels), R (Region/Radiation — where it is and where it spreads), S (Severity — pain scale 0-10), T (Timing — when it started, duration, constant vs intermittent)." },
    ],
    relatedSymptomSlugs: ["shortness-of-breath", "tachycardia", "hypotension"],
  },
  {
    slug: "shortness-of-breath",
    symptom: "Shortness of Breath (Dyspnea)",
    title: "Shortness of Breath Nursing Assessment: Differential Diagnosis & Red Flags",
    metaTitle: "Dyspnea Nursing Assessment | Differential Diagnosis & Clinical Guide",
    metaDescription: "Comprehensive shortness of breath nursing assessment: differential diagnoses, red flags, assessment framework, clinical decision-making, and NCLEX practice questions.",
    keywords: "shortness of breath nursing, dyspnea assessment nursing, respiratory distress differential, SOB nursing NCLEX",
    introduction: "Shortness of breath (dyspnea) is a subjective sensation of difficulty breathing and one of the most common reasons patients seek emergency care. Dyspnea can result from cardiac, pulmonary, metabolic, neuromuscular, or psychological causes. Rapid assessment and identification of life-threatening causes is essential because respiratory failure can progress to cardiac arrest within minutes.",
    redFlags: [
      "Severe respiratory distress with accessory muscle use and inability to speak",
      "Silent chest in an asthmatic (no air movement = imminent respiratory arrest)",
      "Sudden onset with pleuritic chest pain and tachycardia (PE)",
      "Stridor (upper airway obstruction — anaphylaxis, epiglottitis, foreign body)",
      "Unilateral absent breath sounds (pneumothorax)",
      "Pink frothy sputum (acute pulmonary edema)",
      "Oxygen saturation <90% despite supplemental oxygen",
      "Altered mental status with respiratory distress (impending respiratory failure)",
    ],
    differentialDiagnoses: [
      { condition: "Pulmonary Embolism", keyFeatures: "Sudden onset, pleuritic chest pain, tachycardia, hypoxemia, risk factors", urgency: "emergent" },
      { condition: "Acute Pulmonary Edema", keyFeatures: "Pink frothy sputum, crackles bilaterally, orthopnea, JVD, S3 gallop", urgency: "emergent" },
      { condition: "Tension Pneumothorax", keyFeatures: "Absent breath sounds unilaterally, tracheal deviation, hypotension", urgency: "emergent" },
      { condition: "Anaphylaxis", keyFeatures: "Stridor, urticaria, angioedema, hypotension, known allergen exposure", urgency: "emergent" },
      { condition: "Status Asthmaticus", keyFeatures: "Severe wheezing progressing to silent chest, refractory to bronchodilators", urgency: "emergent" },
      { condition: "COPD Exacerbation", keyFeatures: "Increased sputum production, wheezing, pursed-lip breathing, history of COPD", urgency: "urgent" },
      { condition: "Pneumonia", keyFeatures: "Fever, productive cough, crackles, consolidation on CXR", urgency: "urgent" },
      { condition: "Heart Failure", keyFeatures: "Orthopnea, PND, peripheral edema, elevated BNP", urgency: "urgent" },
      { condition: "Pleural Effusion", keyFeatures: "Decreased breath sounds at base, dullness to percussion, pleuritic pain", urgency: "urgent" },
      { condition: "Anxiety/Hyperventilation", keyFeatures: "Tingling, carpopedal spasm, respiratory alkalosis on ABG, normal CXR", urgency: "non-urgent" },
    ],
    assessmentSteps: [
      { step: "Airway Assessment", description: "Is the airway patent? Assess for stridor, gurgling, or obstruction. If compromised, intervene immediately (chin lift, jaw thrust, suctioning)." },
      { step: "Breathing Assessment", description: "Rate, depth, pattern, effort. Auscultate all lung fields for crackles, wheezes, absent sounds. Note accessory muscle use, retractions, nasal flaring." },
      { step: "Circulation Assessment", description: "Heart rate, blood pressure, capillary refill, skin color. Assess JVD and peripheral edema." },
      { step: "Oxygen Saturation", description: "Apply pulse oximetry. Target SpO2 >94% (>88-92% in COPD patients to avoid suppressing hypoxic drive)." },
      { step: "History (OLDCARTS)", description: "Onset, Location, Duration, Character, Aggravating factors, Relieving factors, Timing, Severity of dyspnea." },
      { step: "ABG Analysis", description: "Assess acid-base status. Respiratory acidosis = hypoventilation. Respiratory alkalosis = hyperventilation. Metabolic acidosis = Kussmaul compensation." },
      { step: "Chest X-Ray", description: "Assess for pneumonia, pneumothorax, pleural effusion, pulmonary edema, cardiomegaly." },
    ],
    clinicalDecisionMaking: "The priority in dyspnea assessment follows the ABCs: ensure Airway patency, assess Breathing adequacy, evaluate Circulation. Life-threatening causes requiring immediate intervention include tension pneumothorax (needle decompression), anaphylaxis (epinephrine), acute pulmonary edema (diuretics, oxygen, positioning), and PE (anticoagulation). A key decision point is whether dyspnea is primarily cardiac or pulmonary in origin — BNP levels help differentiate: BNP >100 pg/mL suggests cardiac cause, while a normal BNP favors pulmonary cause.",
    nursingInterventions: [
      "Position patient in high-Fowler's or tripod position for breathing ease",
      "Apply supplemental oxygen to maintain SpO2 >94% (88-92% for COPD)",
      "Obtain ABG, BNP, CBC, and chest X-ray as ordered",
      "Auscultate breath sounds before and after interventions",
      "Administer bronchodilators for wheezing (albuterol nebulizer)",
      "Administer diuretics for pulmonary edema (furosemide IV)",
      "Prepare for intubation if respiratory failure imminent",
      "Monitor respiratory rate, effort, and SpO2 continuously",
      "Maintain calm environment to reduce anxiety and oxygen demand",
      "Provide reassurance and remain with the patient",
    ],
    examTips: [
      "Silent chest in asthma = MOST dangerous finding (imminent respiratory arrest, worse than loud wheezing)",
      "COPD: oxygen target 88-92% to avoid suppressing hypoxic drive",
      "BNP >100 pg/mL = cardiac dyspnea. Normal BNP = likely pulmonary cause",
      "Pink frothy sputum = acute pulmonary edema (left heart failure)",
      "ABCs always come first — airway, breathing, circulation in that order",
    ],
    practiceQuestions: [
      {
        question: "A COPD patient arrives with dyspnea and SpO2 of 82%. The nurse applies oxygen via nasal cannula at 2 L/min. The target SpO2 for this patient is:",
        options: ["95-100%", "92-95%", "88-92%", "85-88%"],
        correctIndex: 2,
        rationale: "COPD patients rely on hypoxic drive to breathe. Giving too much oxygen can suppress this drive and worsen hypercapnia. The target SpO2 for COPD patients is 88-92%, not the standard 94%+ for other patients."
      },
      {
        question: "An asthmatic patient who was wheezing loudly now has a 'silent chest.' What should the nurse do?",
        options: ["Document improvement in symptoms", "Continue monitoring every 4 hours", "Notify the provider immediately — this is a medical emergency", "Administer an oral corticosteroid"],
        correctIndex: 2,
        rationale: "A silent chest in an asthmatic is the most dangerous finding — it means NO air is moving through the airways, indicating imminent respiratory arrest. This requires immediate intervention: continuous nebulized bronchodilators, IV corticosteroids, and preparation for intubation."
      },
    ],
    faq: [
      { question: "What is the difference between dyspnea and respiratory distress?", answer: "Dyspnea is the subjective sensation of difficulty breathing — the patient feels short of breath. Respiratory distress includes objective signs: tachypnea, accessory muscle use, retractions, nasal flaring, diaphoresis, and inability to speak in full sentences. A patient can be dyspneic without being in respiratory distress, and occasionally patients in respiratory distress may not complain of dyspnea." },
      { question: "Why is oxygen dangerous in COPD?", answer: "In chronic COPD, patients develop chronically elevated CO2 levels. Their respiratory drive shifts from the normal CO2-driven stimulus to a hypoxic drive (low O2 triggers breathing). Giving high-flow oxygen removes this hypoxic stimulus, potentially reducing respiratory drive and worsening CO2 retention (hypercapnia), leading to respiratory failure." },
    ],
    relatedSymptomSlugs: ["chest-pain", "tachycardia", "dyspnea"],
  },
  {
    slug: "hyperkalemia",
    symptom: "Hyperkalemia",
    title: "Hyperkalemia Nursing Assessment: Causes, ECG Changes & Emergency Management",
    metaTitle: "Hyperkalemia Assessment | ECG Changes, Causes & Nursing Interventions",
    metaDescription: "Complete hyperkalemia nursing assessment: causes, ECG progression, emergency management, medications, nursing interventions, and NCLEX practice questions.",
    keywords: "hyperkalemia nursing assessment, hyperkalemia ECG changes, potassium management nursing, hyperkalemia emergency NCLEX",
    introduction: "Hyperkalemia (serum potassium >5.0 mEq/L) is a potentially life-threatening electrolyte imbalance that directly affects cardiac conduction. Recognizing the progressive ECG changes and initiating rapid treatment is a critical nursing competency. Even small increases in serum potassium can cause fatal cardiac arrhythmias, making hyperkalemia one of the most dangerous electrolyte emergencies.",
    redFlags: [
      "Serum potassium >6.0 mEq/L (critical value requiring immediate intervention)",
      "Peaked T waves on ECG (earliest sign of cardiac effects)",
      "Widened QRS complex (indicates severe hyperkalemia — risk of VF)",
      "Sine wave pattern on ECG (pre-arrest rhythm)",
      "Muscle weakness progressing to flaccid paralysis",
      "Cardiac arrest (PEA or asystole)",
      "Concurrent acidosis (drives more potassium extracellularly)",
    ],
    differentialDiagnoses: [
      { condition: "Acute Kidney Injury / Renal Failure", keyFeatures: "Elevated creatinine/BUN, decreased urine output, most common cause of sustained hyperkalemia", urgency: "emergent" },
      { condition: "Metabolic Acidosis", keyFeatures: "Low pH drives K+ out of cells; concurrent elevated K+ with low bicarbonate", urgency: "emergent" },
      { condition: "Tissue Destruction (Crush Injury, Burns, Rhabdomyolysis)", keyFeatures: "Massive release of intracellular K+ from damaged cells, elevated CK", urgency: "emergent" },
      { condition: "Medication-Induced", keyFeatures: "ACE inhibitors, ARBs, K-sparing diuretics, potassium supplements, NSAIDs", urgency: "urgent" },
      { condition: "Tumor Lysis Syndrome", keyFeatures: "After chemotherapy, with elevated K+, phosphate, uric acid, and low calcium", urgency: "emergent" },
      { condition: "Adrenal Insufficiency (Addison's)", keyFeatures: "Low cortisol and aldosterone, concurrent hyperkalemia and hyponatremia", urgency: "urgent" },
      { condition: "Pseudohyperkalemia (Lab Artifact)", keyFeatures: "Hemolyzed sample, tourniquet too tight, fist clenching during draw", urgency: "non-urgent" },
    ],
    assessmentSteps: [
      { step: "Verify the Result", description: "Rule out pseudohyperkalemia. Was the sample hemolyzed? Was there prolonged tourniquet time? Repeat lab if suspected artifact." },
      { step: "ECG Assessment", description: "Obtain immediate 12-lead ECG. Progression: peaked T waves → prolonged PR → widened QRS → sine wave → VF/asystole." },
      { step: "Identify the Cause", description: "Review medications (ACE-I, ARBs, K-sparing diuretics), renal function (creatinine, BUN, GFR), acid-base status (pH, bicarb)." },
      { step: "Assess Symptoms", description: "Muscle weakness, paresthesias, decreased deep tendon reflexes, palpitations, nausea." },
      { step: "Review Potassium Sources", description: "IV potassium infusions, potassium-containing medications, diet (bananas, oranges, potatoes), blood transfusions (stored blood releases K+)." },
    ],
    clinicalDecisionMaking: "Treatment of hyperkalemia follows three principles: (1) STABILIZE the cardiac membrane with calcium gluconate (does not lower K+ but protects the heart), (2) SHIFT potassium intracellularly with insulin + dextrose, sodium bicarbonate, or beta-2 agonists, and (3) ELIMINATE potassium from the body with kayexalate, loop diuretics, or dialysis. The urgency depends on the potassium level and presence of ECG changes. Any ECG changes require immediate treatment.",
    nursingInterventions: [
      "Place on continuous cardiac monitoring immediately",
      "Obtain stat 12-lead ECG and repeat with any rhythm change",
      "Administer calcium gluconate IV to stabilize cardiac membrane (does NOT lower K+)",
      "Administer regular insulin 10 units IV with D50 (25g dextrose) to shift K+ into cells",
      "Administer sodium bicarbonate if acidotic (shifts K+ intracellularly)",
      "Administer kayexalate (sodium polystyrene sulfonate) to promote GI excretion of K+",
      "Restrict dietary potassium intake",
      "Hold all potassium-sparing medications and potassium supplements",
      "Monitor blood glucose after insulin administration (hypoglycemia risk)",
      "Prepare for dialysis if refractory to medical management",
    ],
    examTips: [
      "Calcium gluconate FIRST for ECG changes — it stabilizes the heart but does NOT lower potassium",
      "Insulin + dextrose is the fastest way to SHIFT potassium intracellularly",
      "Peaked T waves are the EARLIEST ECG sign of hyperkalemia",
      "ECG progression: peaked T waves → prolonged PR → widened QRS → sine wave → arrest",
      "Always check K+ before giving insulin in DKA — treat hypokalemia FIRST",
    ],
    practiceQuestions: [
      {
        question: "A patient has K+ 7.2 mEq/L with peaked T waves on the monitor. What is the FIRST medication to administer?",
        options: ["Regular insulin with dextrose", "Sodium polystyrene sulfonate (Kayexalate)", "Calcium gluconate IV", "Sodium bicarbonate"],
        correctIndex: 2,
        rationale: "Calcium gluconate is administered FIRST when ECG changes are present because it immediately stabilizes the cardiac cell membrane, reducing the risk of fatal arrhythmias. It does not lower potassium but buys time for other treatments (insulin/dextrose, kayexalate) to take effect."
      },
      {
        question: "Which ECG change indicates the MOST severe hyperkalemia?",
        options: ["Peaked T waves", "Prolonged PR interval", "Widened QRS complex", "Sine wave pattern"],
        correctIndex: 3,
        rationale: "Sine wave pattern is the most severe ECG finding in hyperkalemia and represents a pre-arrest rhythm. The progression is: peaked T waves (mild) → prolonged PR interval → widened QRS (moderate-severe) → sine wave pattern (pre-arrest) → ventricular fibrillation/asystole."
      },
    ],
    faq: [
      { question: "Why is hyperkalemia so dangerous?", answer: "Potassium directly controls the electrical activity of the heart. Elevated extracellular potassium reduces the resting membrane potential of cardiac cells, impairing normal depolarization and repolarization. This causes progressive conduction abnormalities that can lead to fatal arrhythmias (VF, asystole) with little warning." },
      { question: "What foods should be avoided with hyperkalemia?", answer: "High-potassium foods to restrict include: bananas, oranges, potatoes, tomatoes, avocados, spinach, beans, dried fruits, chocolate, and dairy products. Salt substitutes often contain potassium chloride and should be avoided." },
    ],
    relatedSymptomSlugs: ["chest-pain", "tachycardia", "altered-level-of-consciousness"],
  },
  {
    slug: "altered-level-of-consciousness",
    symptom: "Altered Level of Consciousness (Altered LOC)",
    title: "Altered LOC Nursing Assessment: Causes, GCS & Clinical Decision-Making",
    metaTitle: "Altered LOC Nursing Assessment | GCS, Causes & Emergency Response",
    metaDescription: "Comprehensive altered LOC nursing assessment: Glasgow Coma Scale, differential diagnoses, red flags, neurological assessment, and NCLEX practice questions.",
    keywords: "altered level of consciousness nursing, altered LOC assessment, Glasgow Coma Scale nursing, neurological assessment NCLEX",
    introduction: "Altered level of consciousness (LOC) ranges from mild confusion to deep coma and can result from neurological, metabolic, toxicological, or infectious causes. It is always a sign of underlying pathology requiring urgent investigation. The nurse's ability to rapidly assess, quantify (using the Glasgow Coma Scale), and identify the cause is critical for patient outcomes, as some causes are rapidly reversible while others require emergent intervention.",
    redFlags: [
      "GCS ≤8 (coma — consider intubation for airway protection)",
      "Unequal pupils (anisocoria — suggests herniation or stroke)",
      "Fixed, dilated pupils (suggests brain death or severe herniation)",
      "Cushing's triad: hypertension, bradycardia, irregular respirations (increased ICP)",
      "Rapidly deteriorating consciousness (expanding intracranial lesion)",
      "Focal neurological deficits (suggests stroke or mass lesion)",
      "Fever with nuchal rigidity (meningitis until proven otherwise)",
      "Hypoglycemia <40 mg/dL (immediately reversible cause)",
    ],
    differentialDiagnoses: [
      { condition: "Stroke (Ischemic or Hemorrhagic)", keyFeatures: "Focal deficits, unilateral weakness, aphasia, facial droop, sudden onset", urgency: "emergent" },
      { condition: "Increased Intracranial Pressure", keyFeatures: "Cushing's triad, vomiting, papilledema, decreasing GCS", urgency: "emergent" },
      { condition: "Hypoglycemia", keyFeatures: "Diaphoresis, tremors, confusion, rapid improvement with glucose", urgency: "emergent" },
      { condition: "Meningitis/Encephalitis", keyFeatures: "Fever, nuchal rigidity, photophobia, headache, Kernig's/Brudzinski's signs", urgency: "emergent" },
      { condition: "Drug/Alcohol Intoxication", keyFeatures: "Pinpoint pupils (opioids), alcohol on breath, toxicology screen positive", urgency: "emergent" },
      { condition: "Seizure (Postictal State)", keyFeatures: "Witnessed seizure activity, confusion clearing over minutes to hours, incontinence", urgency: "urgent" },
      { condition: "Hepatic Encephalopathy", keyFeatures: "Liver disease history, elevated ammonia, asterixis (liver flap), jaundice", urgency: "urgent" },
      { condition: "Diabetic Emergencies (DKA/HHS)", keyFeatures: "Hyperglycemia, dehydration, Kussmaul respirations (DKA), history of diabetes", urgency: "emergent" },
      { condition: "Delirium", keyFeatures: "Acute onset, fluctuating, inattention, disorganized thinking, often from infection/meds", urgency: "urgent" },
      { condition: "Uremia (Renal Failure)", keyFeatures: "Elevated BUN/creatinine, asterixis, history of kidney disease", urgency: "urgent" },
    ],
    assessmentSteps: [
      { step: "Glasgow Coma Scale (GCS)", description: "Eye Opening (1-4) + Verbal Response (1-5) + Motor Response (1-6) = 3-15. GCS ≤8 = severe/coma. Document baseline and trend over time." },
      { step: "AVPU Scale (Quick Screen)", description: "A = Alert, V = responds to Voice, P = responds to Pain, U = Unresponsive. Quick initial assessment while preparing full GCS." },
      { step: "Pupil Assessment", description: "Size, shape, reactivity, equality. Unequal pupils (anisocoria) = herniation or cranial nerve III compression. Fixed dilated = severe injury." },
      { step: "Vital Signs with Neuro Focus", description: "Assess for Cushing's triad (HTN, bradycardia, irregular respirations). Check glucose immediately." },
      { step: "Focused History (AEIOU-TIPS)", description: "Alcohol, Epilepsy, Insulin (hypo/hyperglycemia), Opioids/Overdose, Uremia, Trauma, Infection, Psychiatric, Stroke/Shock." },
      { step: "Motor and Sensory Exam", description: "Assess for focal deficits: grip strength, pronator drift, plantar reflex. Asymmetry suggests structural lesion." },
    ],
    clinicalDecisionMaking: "The AEIOU-TIPS mnemonic helps systematically identify causes of altered LOC. The immediate priorities are: (1) Secure the airway (GCS ≤8 = intubation), (2) Check blood glucose (hypoglycemia is immediately reversible), (3) Administer naloxone if opioid overdose suspected (pinpoint pupils), (4) Obtain CT head to rule out hemorrhage or mass lesion, (5) Assess for signs of meningitis. Time-sensitive diagnoses include stroke (tPA window), increased ICP (herniation prevention), and hypoglycemia.",
    nursingInterventions: [
      "Secure airway — GCS ≤8 requires intubation consideration",
      "Check blood glucose immediately and treat hypoglycemia with D50 IV",
      "Perform neurological assessment (GCS, pupils, motor) every 15-30 minutes",
      "Position head of bed at 30 degrees if increased ICP suspected",
      "Administer naloxone if opioid overdose suspected (pinpoint pupils)",
      "Prepare for CT scan without contrast",
      "Implement aspiration precautions (NPO, lateral position if not intubated)",
      "Monitor I&O with Foley catheter if prolonged altered LOC",
      "Implement seizure precautions",
      "Maintain normothermia (fever increases cerebral metabolic demand)",
    ],
    examTips: [
      "GCS ≤8 = coma = consider intubation for airway protection",
      "ALWAYS check glucose in any patient with altered LOC — it's immediately reversible",
      "Cushing's triad (HTN, bradycardia, irregular respirations) = increased ICP — late and ominous sign",
      "Naloxone reverses opioid overdose — pinpoint pupils are the clue",
      "AEIOU-TIPS: Alcohol, Epilepsy, Insulin, Opioids, Uremia, Trauma, Infection, Psychiatric, Stroke/Shock",
    ],
    practiceQuestions: [
      {
        question: "A patient arrives unresponsive with pinpoint pupils and respiratory rate of 6. What is the priority intervention?",
        options: ["Start an IV and draw blood glucose", "Administer naloxone IV", "Obtain a CT scan", "Insert a Foley catheter"],
        correctIndex: 1,
        rationale: "Pinpoint pupils with respiratory depression is the classic presentation of opioid overdose. Naloxone is the priority because it rapidly reverses opioid effects and can restore respirations. Without naloxone, the patient may develop respiratory arrest."
      },
      {
        question: "A patient's GCS is: Eyes 2 (opens to pain), Verbal 3 (inappropriate words), Motor 4 (flexion withdrawal). The total GCS score is:",
        options: ["7", "8", "9", "10"],
        correctIndex: 2,
        rationale: "GCS is calculated by adding Eye (2) + Verbal (3) + Motor (4) = 9. A GCS of 9 is severe but above the intubation threshold of ≤8. Serial GCS assessments should be performed to monitor for deterioration."
      },
    ],
    faq: [
      { question: "What is the Glasgow Coma Scale?", answer: "The GCS is a standardized tool for assessing level of consciousness. It evaluates three components: Eye Opening (1-4), Verbal Response (1-5), and Motor Response (1-6), with a total score ranging from 3 (deep coma) to 15 (fully alert). GCS ≤8 indicates coma and need for airway protection." },
      { question: "What does AEIOU-TIPS stand for?", answer: "AEIOU-TIPS is a mnemonic for causes of altered LOC: A (Alcohol), E (Epilepsy/seizures), I (Insulin/glucose problems), O (Opioids/Overdose), U (Uremia/renal failure), T (Trauma), I (Infection/meningitis), P (Psychiatric/psychogenic), S (Stroke/Shock)." },
    ],
    relatedSymptomSlugs: ["chest-pain", "hyperkalemia", "hypotension"],
  },
  {
    slug: "abdominal-pain",
    symptom: "Abdominal Pain",
    title: "Abdominal Pain Nursing Assessment: Differential Diagnosis & Clinical Approach",
    metaTitle: "Abdominal Pain Assessment | Differential Diagnosis & Nursing Guide",
    metaDescription: "Complete abdominal pain nursing assessment: quadrant-based differential diagnosis, red flags, assessment techniques, clinical decision-making, and NCLEX questions.",
    keywords: "abdominal pain nursing assessment, abdominal pain differential diagnosis, abdominal assessment quadrants, acute abdomen NCLEX",
    introduction: "Abdominal pain is a common but potentially serious symptom that requires systematic assessment. The location, quality, and associated symptoms help narrow the differential diagnosis from benign conditions to surgical emergencies. Understanding the anatomical basis for quadrant-based assessment is essential for clinical decision-making in nursing practice.",
    redFlags: [
      "Rigid, board-like abdomen (peritonitis — surgical emergency)",
      "Rebound tenderness (suggests peritoneal irritation)",
      "Abdominal pain with hemodynamic instability (ruptured AAA, ectopic pregnancy)",
      "Severe pain with absent bowel sounds (bowel obstruction or ileus)",
      "Abdominal pain with GI bleeding (hematemesis or melena)",
      "Pain with fever and guarding (appendicitis, cholecystitis, diverticulitis)",
      "Pulsatile abdominal mass (abdominal aortic aneurysm)",
    ],
    differentialDiagnoses: [
      { condition: "Appendicitis", keyFeatures: "RLQ pain (McBurney's point), rebound tenderness, fever, nausea, migration from periumbilical area", urgency: "emergent" },
      { condition: "Cholecystitis", keyFeatures: "RUQ pain after fatty meals, positive Murphy's sign, fever, nausea/vomiting", urgency: "urgent" },
      { condition: "Bowel Obstruction", keyFeatures: "Cramping pain, distension, absent/hyperactive bowel sounds, vomiting, no flatus", urgency: "emergent" },
      { condition: "Ruptured Abdominal Aortic Aneurysm", keyFeatures: "Sudden severe pain radiating to back, pulsatile mass, hypotension, shock", urgency: "emergent" },
      { condition: "Ectopic Pregnancy", keyFeatures: "Lower abdominal pain in female of childbearing age, vaginal bleeding, positive pregnancy test", urgency: "emergent" },
      { condition: "Diverticulitis", keyFeatures: "LLQ pain, fever, change in bowel habits, history of diverticulosis, older adults", urgency: "urgent" },
      { condition: "Pancreatitis", keyFeatures: "Epigastric pain radiating to back, worse after eating, elevated lipase/amylase", urgency: "urgent" },
      { condition: "Peptic Ulcer Disease", keyFeatures: "Epigastric burning/gnawing pain, related to meals, history of NSAID use or H. pylori", urgency: "urgent" },
      { condition: "Kidney Stones", keyFeatures: "Severe flank pain radiating to groin, hematuria, colicky, patient unable to find comfortable position", urgency: "urgent" },
      { condition: "Gastroenteritis", keyFeatures: "Diffuse cramping, diarrhea, nausea/vomiting, usually self-limiting", urgency: "non-urgent" },
    ],
    assessmentSteps: [
      { step: "Inspect", description: "Observe for distension, visible peristalsis, scars, discoloration (Cullen's sign periumbilical = internal bleeding; Grey Turner's flank = retroperitoneal bleeding)." },
      { step: "Auscultate (Before Palpation)", description: "Listen in all 4 quadrants for bowel sounds. Absent = ileus/obstruction. Hyperactive/high-pitched = early obstruction. Always auscultate BEFORE palpation." },
      { step: "Percuss", description: "Assess for tympany (air/gas) vs dullness (fluid/mass). Shifting dullness suggests ascites." },
      { step: "Palpate (Light Then Deep)", description: "Start away from the painful area. Assess for guarding, rigidity, rebound tenderness, masses, and organomegaly." },
      { step: "Focused Assessment", description: "Murphy's sign (cholecystitis), McBurney's point tenderness (appendicitis), Rovsing's sign (appendicitis), psoas sign, obturator sign." },
      { step: "Associated Symptoms", description: "Nausea/vomiting, bowel pattern changes, fever, urinary symptoms, last menstrual period (always consider ectopic pregnancy)." },
    ],
    clinicalDecisionMaking: "The key clinical question is whether the abdominal pain represents a surgical emergency (peritonitis, ruptured AAA, ruptured ectopic, bowel obstruction) or a medical condition that can be managed non-surgically. Signs of surgical abdomen include: rigid board-like abdomen, rebound tenderness, hemodynamic instability, and absent bowel sounds. Always check pregnancy status in women of childbearing age. Remember the sequence: inspect, auscultate, percuss, palpate — auscultate BEFORE palpation to avoid altering bowel sounds.",
    nursingInterventions: [
      "Assess pain using PQRST and document location, quality, and severity",
      "Maintain NPO status until diagnosis is established (surgical consideration)",
      "Establish IV access for fluid resuscitation and medication administration",
      "Monitor vital signs frequently for hemodynamic instability",
      "Obtain labs: CBC, CMP, lipase, urinalysis, pregnancy test (women of childbearing age)",
      "Position for comfort (knee-to-chest may help with peritoneal irritation)",
      "Administer pain management as ordered (do NOT withhold analgesics for assessment)",
      "Auscultate bowel sounds in all four quadrants",
      "Monitor I&O strictly",
      "Prepare for imaging: CT abdomen, ultrasound, or KUB as ordered",
    ],
    examTips: [
      "ALWAYS auscultate BEFORE palpation — palpation can alter bowel sounds",
      "McBurney's point = appendicitis (RLQ, 1/3 distance from ASIS to umbilicus)",
      "Murphy's sign = cholecystitis (inspiratory arrest during RUQ palpation)",
      "Rigid abdomen = peritonitis = surgical emergency",
      "ALWAYS check pregnancy test in women of childbearing age with abdominal pain",
    ],
    practiceQuestions: [
      {
        question: "A patient presents with RLQ pain, rebound tenderness, and fever. What should the nurse suspect?",
        options: ["Cholecystitis", "Appendicitis", "Diverticulitis", "Pancreatitis"],
        correctIndex: 1,
        rationale: "Right lower quadrant pain with rebound tenderness and fever is the classic presentation of appendicitis. The pain typically starts periumbilically and migrates to McBurney's point (RLQ). Cholecystitis is RUQ, diverticulitis is LLQ, and pancreatitis is epigastric."
      },
      {
        question: "Which step should the nurse perform FIRST during an abdominal assessment?",
        options: ["Deep palpation", "Auscultation", "Percussion", "Inspection"],
        correctIndex: 3,
        rationale: "The correct order for abdominal assessment is: Inspect, Auscultate, Percuss, Palpate. Inspection comes first to observe distension, scars, and visible abnormalities. Auscultation is done before palpation because palpation can alter bowel sounds."
      },
    ],
    faq: [
      { question: "Why do we auscultate before palpation in abdominal assessment?", answer: "Palpation and percussion can stimulate peristalsis and change bowel sounds, giving inaccurate findings. Auscultation must be done first to get a true baseline of bowel sound frequency and quality. The order is: inspect, auscultate, percuss, palpate." },
      { question: "What is the difference between guarding and rigidity?", answer: "Guarding is voluntary contraction of abdominal muscles when the patient anticipates pain from palpation. Rigidity is involuntary, sustained contraction of the abdominal wall muscles indicating peritoneal irritation (peritonitis). A rigid, board-like abdomen is a surgical emergency." },
    ],
    relatedSymptomSlugs: ["chest-pain", "fever", "hypotension"],
  },
  {
    slug: "fever",
    symptom: "Fever (Pyrexia)",
    title: "Fever Nursing Assessment: Differential Diagnosis & Management",
    metaTitle: "Fever Nursing Assessment | Causes, Assessment & Interventions",
    metaDescription: "Comprehensive fever nursing assessment: differential diagnoses, red flags, sepsis screening, medications, nursing interventions, and NCLEX practice questions.",
    keywords: "fever nursing assessment, pyrexia differential diagnosis, sepsis screening nursing, fever management NCLEX",
    introduction: "Fever (pyrexia) is an elevation of core body temperature above 100.4°F (38°C) and represents the body's inflammatory response to infection, tissue injury, or other stimuli. While fever is usually a protective mechanism, persistent or high fevers can indicate serious underlying pathology. The nurse's role is to identify the source, assess for sepsis, and implement appropriate interventions while monitoring for complications.",
    redFlags: [
      "Temperature >104°F (40°C) — risk of febrile seizures and organ damage",
      "Fever with hemodynamic instability (septic shock)",
      "Fever with nuchal rigidity (meningitis)",
      "Fever with neutropenia (ANC <500 — neutropenic fever is a medical emergency)",
      "Fever with new heart murmur (endocarditis)",
      "Fever with altered mental status (CNS infection or severe sepsis)",
      "Fever post-surgery with wound erythema (surgical site infection)",
      "Persistent fever >3 days despite antibiotics (drug resistance or abscess)",
    ],
    differentialDiagnoses: [
      { condition: "Sepsis / Septic Shock", keyFeatures: "qSOFA ≥2 (altered mental status, tachypnea ≥22, SBP ≤100), suspected infection, lactate >2", urgency: "emergent" },
      { condition: "Meningitis", keyFeatures: "Fever, nuchal rigidity, headache, photophobia, positive Kernig's/Brudzinski's", urgency: "emergent" },
      { condition: "Neutropenic Fever", keyFeatures: "Temperature ≥100.4°F with ANC <500, often in chemotherapy patients", urgency: "emergent" },
      { condition: "Pneumonia", keyFeatures: "Fever, productive cough, crackles, consolidation on CXR", urgency: "urgent" },
      { condition: "Urinary Tract Infection", keyFeatures: "Fever, dysuria, frequency, urgency, positive UA and culture", urgency: "urgent" },
      { condition: "Surgical Site Infection", keyFeatures: "Fever post-op (typically day 3-5), wound erythema, drainage, warmth", urgency: "urgent" },
      { condition: "Drug Fever", keyFeatures: "New medication recently started, no infectious source identified, resolves with drug discontinuation", urgency: "non-urgent" },
      { condition: "Malignant Hyperthermia", keyFeatures: "Rapid temperature rise during anesthesia, muscle rigidity, elevated CK, metabolic acidosis", urgency: "emergent" },
    ],
    assessmentSteps: [
      { step: "Temperature Measurement", description: "Use core temperature when accuracy is critical (rectal, esophageal). Oral and tympanic are acceptable for routine monitoring. Axillary is least accurate." },
      { step: "Sepsis Screening (qSOFA)", description: "Quick SOFA criteria: altered mental status, respiratory rate ≥22, systolic BP ≤100. Score ≥2 = suspected sepsis." },
      { step: "Source Identification", description: "Systematic search: lungs (auscultate), urine (UA), blood (cultures x2), wounds (inspect), lines (central line infection)." },
      { step: "Vital Signs and Trending", description: "Complete vital signs with trend analysis. Fever pattern can help identify cause: intermittent, remittent, continuous, or relapsing." },
      { step: "Lab Assessment", description: "CBC with differential (leukocytosis or leukopenia), blood cultures (x2 from different sites), lactate, procalcitonin, urinalysis." },
    ],
    clinicalDecisionMaking: "The critical distinction is between fever as a benign inflammatory response and fever as a sign of sepsis or life-threatening infection. Sepsis screening (qSOFA) should be performed in any febrile patient. The 1-hour sepsis bundle includes: blood cultures before antibiotics, broad-spectrum antibiotics within 1 hour, lactate measurement, and IV fluid resuscitation (30 mL/kg crystalloid for hypotension or lactate ≥4). Neutropenic fever (ANC <500) requires emergent broad-spectrum antibiotics regardless of symptoms.",
    nursingInterventions: [
      "Obtain blood cultures (x2 from different sites) BEFORE starting antibiotics",
      "Administer antipyretics (acetaminophen) as ordered for comfort",
      "Initiate IV fluid resuscitation if signs of sepsis or dehydration",
      "Administer broad-spectrum antibiotics within 1 hour if sepsis suspected",
      "Apply cooling measures: lightweight clothing, cool compresses, fan",
      "Monitor I&O (fever increases insensible fluid losses)",
      "Assess for source of infection: lungs, urine, wounds, central lines, skin",
      "Implement neutropenic precautions if ANC <500 (reverse isolation)",
      "Monitor lactate levels as a marker of tissue perfusion in sepsis",
      "Encourage oral fluid intake if able",
    ],
    examTips: [
      "Blood cultures BEFORE antibiotics — but do NOT delay antibiotics to obtain cultures",
      "Sepsis 1-hour bundle: cultures, antibiotics, lactate, fluids (30 mL/kg if hypotensive)",
      "Neutropenic fever (ANC <500 + fever ≥100.4°F) = medical emergency requiring immediate antibiotics",
      "Malignant hyperthermia = anesthesia emergency → administer dantrolene",
      "Post-op fever mnemonic (5 Ws): Wind (atelectasis day 1-2), Water (UTI day 3-5), Wound (SSI day 5-7), Walking (DVT day 5+), Wonder drugs (drug fever any time)",
    ],
    practiceQuestions: [
      {
        question: "A post-chemotherapy patient has a temperature of 101.2°F and ANC of 350. What is the priority nursing action?",
        options: ["Administer acetaminophen and recheck in 1 hour", "Obtain blood cultures and administer broad-spectrum antibiotics immediately", "Apply cooling blankets", "Encourage oral fluid intake"],
        correctIndex: 1,
        rationale: "Neutropenic fever (ANC <500 + temperature ≥100.4°F) is a medical emergency. The priority is obtaining blood cultures and administering broad-spectrum antibiotics within 1 hour. Delaying antibiotics in a neutropenic patient can result in overwhelming sepsis and death."
      },
      {
        question: "When should blood cultures be drawn in a febrile patient?",
        options: ["After the first dose of antibiotics", "Before starting antibiotics", "Only if fever persists for 48 hours", "When the patient becomes afebrile"],
        correctIndex: 1,
        rationale: "Blood cultures should ALWAYS be drawn before starting antibiotics to maximize the chance of identifying the causative organism. However, antibiotics should not be delayed beyond 1 hour — draw cultures, then immediately administer antibiotics."
      },
    ],
    faq: [
      { question: "What is the difference between fever and hyperthermia?", answer: "Fever is a regulated increase in the body's temperature set point caused by pyrogens (inflammatory mediators). The hypothalamus 'resets' to a higher temperature. Hyperthermia is an unregulated rise in body temperature where heat production exceeds heat dissipation (heat stroke, malignant hyperthermia). Antipyretics work for fever but NOT for hyperthermia." },
      { question: "What are the 5 Ws of post-operative fever?", answer: "Wind (atelectasis, days 1-2), Water (UTI, days 3-5), Wound (surgical site infection, days 5-7), Walking (DVT/PE, days 5+), and Wonder drugs (drug fever, any time). This mnemonic helps systematically identify the source of post-op fever." },
    ],
    relatedSymptomSlugs: ["tachycardia", "hypotension", "altered-level-of-consciousness"],
  },
  {
    slug: "edema",
    symptom: "Edema",
    title: "Edema Nursing Assessment: Causes, Grading & Clinical Management",
    metaTitle: "Edema Nursing Assessment | Pitting Scale, Causes & Interventions",
    metaDescription: "Complete edema nursing assessment: pitting edema grading, differential diagnoses, red flags, nursing interventions, and NCLEX practice questions.",
    keywords: "edema nursing assessment, pitting edema scale, peripheral edema causes, edema management nursing NCLEX",
    introduction: "Edema is the accumulation of excess interstitial fluid in tissues, resulting in swelling. It can be localized (DVT, cellulitis) or generalized (heart failure, nephrotic syndrome, liver disease). Understanding the underlying pathophysiology — whether from increased hydrostatic pressure, decreased oncotic pressure, increased capillary permeability, or impaired lymphatic drainage — guides nursing assessment and intervention.",
    redFlags: [
      "Unilateral leg edema with pain and warmth (DVT until proven otherwise)",
      "Pulmonary edema with dyspnea, crackles, and pink frothy sputum (acute HF)",
      "Generalized edema with oliguria (acute kidney injury or nephrotic syndrome)",
      "Periorbital edema in children (nephrotic syndrome or allergic reaction)",
      "Rapid weight gain (>2 lbs/day or >5 lbs/week = fluid retention)",
      "Edema with pitting >3+ and skin changes (chronic venous insufficiency)",
      "Angioedema with lip/tongue swelling (anaphylaxis or ACE inhibitor reaction)",
    ],
    differentialDiagnoses: [
      { condition: "Heart Failure", keyFeatures: "Bilateral dependent edema, JVD, dyspnea, orthopnea, elevated BNP, S3 gallop", urgency: "urgent" },
      { condition: "Deep Vein Thrombosis", keyFeatures: "Unilateral leg edema, pain, warmth, positive Homans' (unreliable), risk factors", urgency: "emergent" },
      { condition: "Nephrotic Syndrome", keyFeatures: "Generalized edema, heavy proteinuria (>3.5g/day), hypoalbuminemia, hyperlipidemia", urgency: "urgent" },
      { condition: "Liver Cirrhosis", keyFeatures: "Ascites, peripheral edema, jaundice, spider angiomas, low albumin", urgency: "urgent" },
      { condition: "Chronic Venous Insufficiency", keyFeatures: "Bilateral lower extremity edema, worse with standing, skin changes, varicosities", urgency: "non-urgent" },
      { condition: "Lymphedema", keyFeatures: "Non-pitting edema, unilateral, often after lymph node dissection or radiation", urgency: "non-urgent" },
      { condition: "Cellulitis", keyFeatures: "Localized erythema, warmth, tenderness, fever, unilateral", urgency: "urgent" },
      { condition: "Medication-Induced", keyFeatures: "Calcium channel blockers (amlodipine), NSAIDs, corticosteroids, thiazolidinediones", urgency: "non-urgent" },
    ],
    assessmentSteps: [
      { step: "Pitting Edema Grading", description: "Press firmly for 5 seconds over bony prominence (tibia, malleolus). Grade: 1+ (2mm, rebounds immediately), 2+ (4mm, rebounds in 15 sec), 3+ (6mm, rebounds in 30 sec), 4+ (8mm, rebounds >30 sec)." },
      { step: "Distribution Assessment", description: "Unilateral vs bilateral. Dependent (gravity) vs generalized. Sacral edema in bed-bound patients. Periorbital in renal disease." },
      { step: "Daily Weights", description: "Weigh daily at same time, same scale, same clothing. 1 kg (2.2 lbs) weight gain = approximately 1 liter of fluid retention." },
      { step: "Skin Assessment", description: "Assess for skin integrity, color changes, stasis dermatitis, weeping, temperature, and tissue turgor." },
      { step: "Underlying Cause Assessment", description: "Heart sounds (S3?), lung sounds (crackles?), JVD, abdominal girth (ascites?), albumin level, urine protein." },
    ],
    clinicalDecisionMaking: "The key question is whether edema is caused by increased hydrostatic pressure (heart failure, DVT, venous insufficiency), decreased oncotic pressure (low albumin from liver disease, nephrotic syndrome, malnutrition), increased capillary permeability (burns, sepsis, allergic reactions), or lymphatic obstruction (lymphedema). Unilateral edema requires urgent DVT evaluation. Bilateral dependent edema with dyspnea suggests heart failure. Generalized edema with proteinuria suggests renal disease.",
    nursingInterventions: [
      "Weigh patient daily — most accurate measure of fluid balance in edema",
      "Elevate affected extremities above heart level when possible",
      "Monitor strict I&O",
      "Administer diuretics as ordered (furosemide for heart failure)",
      "Restrict sodium intake as ordered (typically <2g/day)",
      "Restrict fluids as ordered for heart failure or renal failure",
      "Assess skin integrity under and around edematous areas",
      "Apply compression stockings for chronic venous insufficiency (NOT for DVT)",
      "Monitor serum albumin (low albumin = low oncotic pressure = edema)",
      "Reposition frequently to prevent pressure injuries in edematous tissue",
    ],
    examTips: [
      "Daily weight is the MOST accurate assessment of fluid balance — not I&O",
      "1 kg weight gain = approximately 1 liter of retained fluid",
      "Unilateral leg edema = think DVT until proven otherwise",
      "Low albumin (<3.5 g/dL) causes edema due to decreased oncotic pressure",
      "Pitting edema scale: 1+ (2mm), 2+ (4mm), 3+ (6mm), 4+ (8mm)",
    ],
    practiceQuestions: [
      {
        question: "A patient with heart failure has gained 4 lbs overnight. What does this suggest?",
        options: ["The patient ate a large meal", "Approximately 2 liters of fluid retention", "Normal daily weight fluctuation", "Muscle mass gain from bed exercises"],
        correctIndex: 1,
        rationale: "1 kg (2.2 lbs) of weight gain equals approximately 1 liter of fluid retention. A 4 lb (1.8 kg) overnight gain represents approximately 2 liters of fluid retention, indicating inadequate diuresis or non-compliance with sodium/fluid restrictions."
      },
      {
        question: "The nurse presses on a patient's ankle for 5 seconds and observes a 6mm indentation that takes 30 seconds to rebound. This is classified as:",
        options: ["1+ pitting edema", "2+ pitting edema", "3+ pitting edema", "4+ pitting edema"],
        correctIndex: 2,
        rationale: "Pitting edema is graded by depth and rebound time: 1+ (2mm, immediate), 2+ (4mm, 15 seconds), 3+ (6mm, 30 seconds), 4+ (8mm, >30 seconds). A 6mm depression with 30-second rebound is 3+ pitting edema."
      },
    ],
    faq: [
      { question: "What is the difference between pitting and non-pitting edema?", answer: "Pitting edema occurs when pressure leaves an indentation that slowly rebounds — common in heart failure, venous insufficiency, and renal disease. Non-pitting edema does not indent with pressure — characteristic of lymphedema and myxedema (hypothyroidism). The distinction helps identify the underlying cause." },
      { question: "Why do daily weights matter more than I&O for edema?", answer: "Insensible fluid losses (breathing, perspiration) are difficult to measure accurately, making I&O inherently imprecise. Daily weights capture ALL fluid changes including insensible losses. A change of 1 kg (2.2 lbs) equals approximately 1 liter of fluid gain or loss." },
    ],
    relatedSymptomSlugs: ["shortness-of-breath", "hypotension", "chest-pain"],
  },
  {
    slug: "tachycardia",
    symptom: "Tachycardia",
    title: "Tachycardia Nursing Assessment: Causes, Types & Clinical Management",
    metaTitle: "Tachycardia Nursing Assessment | Types, Causes & Nursing Guide",
    metaDescription: "Comprehensive tachycardia nursing assessment: sinus vs SVT vs VT, differential diagnoses, red flags, nursing interventions, and NCLEX practice questions.",
    keywords: "tachycardia nursing assessment, sinus tachycardia causes, SVT nursing, ventricular tachycardia NCLEX",
    introduction: "Tachycardia is defined as a heart rate greater than 100 beats per minute. It can be a normal physiological response (exercise, fever, pain) or indicate a dangerous cardiac arrhythmia. The nurse must differentiate between benign sinus tachycardia and life-threatening arrhythmias (ventricular tachycardia, SVT with hemodynamic instability), as management differs dramatically.",
    redFlags: [
      "Heart rate >150 bpm with hemodynamic instability (hypotension, altered LOC)",
      "Wide-complex tachycardia (QRS >0.12 sec = VT until proven otherwise)",
      "Tachycardia with chest pain and ST changes (ischemia/ACS)",
      "Pulseless ventricular tachycardia (cardiac arrest — defibrillate)",
      "Tachycardia with signs of shock (cool/clammy skin, weak pulses)",
      "New-onset tachycardia with dyspnea (PE, tension pneumothorax)",
      "Tachycardia with fever and hypotension (sepsis)",
    ],
    differentialDiagnoses: [
      { condition: "Sinus Tachycardia", keyFeatures: "Rate 100-160, normal P waves, gradual onset/offset, usually from underlying cause (fever, pain, hypovolemia)", urgency: "urgent" },
      { condition: "Supraventricular Tachycardia (SVT)", keyFeatures: "Rate 150-250, narrow QRS, sudden onset/offset, P waves often hidden, regular rhythm", urgency: "urgent" },
      { condition: "Ventricular Tachycardia (VT)", keyFeatures: "Rate 100-250, wide QRS (>0.12 sec), regular, can be pulseless (arrest) or with pulse", urgency: "emergent" },
      { condition: "Atrial Fibrillation with Rapid Ventricular Response", keyFeatures: "Irregularly irregular rhythm, absent P waves, rate >100", urgency: "urgent" },
      { condition: "Atrial Flutter", keyFeatures: "Sawtooth P waves, ventricular rate depends on AV block ratio (2:1, 3:1)", urgency: "urgent" },
      { condition: "Sepsis/SIRS", keyFeatures: "Tachycardia as compensatory response, fever, hypotension, elevated WBC", urgency: "emergent" },
      { condition: "Hypovolemia/Hemorrhage", keyFeatures: "Tachycardia as early compensatory response, hypotension (late sign), weak pulses", urgency: "emergent" },
      { condition: "Pulmonary Embolism", keyFeatures: "Sudden tachycardia with dyspnea, pleuritic chest pain, hypoxemia", urgency: "emergent" },
    ],
    assessmentSteps: [
      { step: "12-Lead ECG", description: "Differentiate narrow-complex (SVT, sinus tachycardia, AF, flutter) vs wide-complex (VT, SVT with aberrancy). Wide-complex = treat as VT until proven otherwise." },
      { step: "Hemodynamic Assessment", description: "Is the patient stable (normal BP, alert, no chest pain) or unstable (hypotension, altered LOC, chest pain, acute HF)? Unstable = synchronized cardioversion." },
      { step: "Identify Underlying Cause", description: "Sinus tachycardia is always secondary — treat the cause: fever, pain, hypovolemia, anxiety, PE, sepsis, thyrotoxicosis." },
      { step: "Pulse Assessment", description: "Check pulse quality. Pulseless VT = cardiac arrest (defibrillate). Weak/thready pulse = hemodynamic compromise." },
      { step: "Associated Symptoms", description: "Chest pain, dyspnea, dizziness, syncope, diaphoresis. These suggest hemodynamic significance." },
    ],
    clinicalDecisionMaking: "The critical decision tree for tachycardia: (1) Pulseless? → CPR + defibrillation. (2) Pulse present but unstable? → Synchronized cardioversion. (3) Pulse present and stable? → Identify rhythm and treat cause. For stable SVT: vagal maneuvers → adenosine 6mg rapid IV push. For stable VT with pulse: amiodarone or procainamide. For sinus tachycardia: treat the underlying cause (fluids for hypovolemia, antibiotics for sepsis, analgesics for pain).",
    nursingInterventions: [
      "Place on continuous cardiac monitoring and obtain 12-lead ECG",
      "Assess hemodynamic stability: BP, LOC, chest pain, perfusion status",
      "For unstable tachycardia with pulse: prepare for synchronized cardioversion",
      "For pulseless VT/VF: initiate CPR and defibrillation per ACLS",
      "For stable SVT: attempt vagal maneuvers (Valsalva, carotid massage) then adenosine",
      "For sinus tachycardia: identify and treat underlying cause",
      "Establish IV access and draw labs (CBC, BMP, troponin, TSH)",
      "Administer IV fluids if hypovolemic",
      "Monitor oxygen saturation and apply supplemental O2 if needed",
      "Keep defibrillator and emergency medications at bedside",
    ],
    examTips: [
      "Wide-complex tachycardia = VT until proven otherwise — treat as VT",
      "Pulseless VT = defibrillate (unsynchronized). VT with pulse but unstable = synchronized cardioversion",
      "SVT treatment ladder: vagal maneuvers → adenosine 6mg rapid IV push → adenosine 12mg → cardioversion",
      "Adenosine: rapid IV push followed by rapid saline flush (half-life is 6 seconds)",
      "Sinus tachycardia is always SECONDARY — find and treat the cause, not the rhythm",
    ],
    practiceQuestions: [
      {
        question: "A patient has a regular narrow-complex tachycardia at 180 bpm with stable hemodynamics. What is the first intervention?",
        options: ["Defibrillation", "Adenosine 6mg IV push", "Vagal maneuvers", "Amiodarone drip"],
        correctIndex: 2,
        rationale: "For stable SVT, vagal maneuvers (Valsalva maneuver, carotid sinus massage) are attempted FIRST because they are non-invasive and may terminate the arrhythmia. If vagal maneuvers fail, adenosine 6mg rapid IV push is the next step."
      },
      {
        question: "A patient on the monitor shows a wide-complex tachycardia at 170 bpm with a blood pressure of 70/40. What is the priority action?",
        options: ["Administer adenosine 6mg rapid IV push", "Perform synchronized cardioversion", "Start an amiodarone drip", "Obtain a 12-lead ECG"],
        correctIndex: 1,
        rationale: "Wide-complex tachycardia with hemodynamic instability (BP 70/40) requires immediate synchronized cardioversion. The patient is unstable — synchronized cardioversion is the treatment regardless of whether the rhythm is VT or SVT with aberrancy."
      },
    ],
    faq: [
      { question: "What is the difference between sinus tachycardia and SVT?", answer: "Sinus tachycardia has a gradual onset/offset, normal P waves before each QRS, is usually secondary to an underlying cause (fever, pain, hypovolemia), and the rate is typically 100-160 bpm. SVT has a sudden onset/offset, P waves are often hidden or retrograde, the rate is typically 150-250 bpm, and it responds to vagal maneuvers or adenosine." },
      { question: "When do you defibrillate vs cardiovert?", answer: "Defibrillation (unsynchronized shock) is used for pulseless VT and ventricular fibrillation (cardiac arrest). Synchronized cardioversion (shock timed to R wave) is used for unstable tachycardias WITH a pulse (unstable SVT, VT with pulse, unstable AF). Synchronization prevents the shock from landing on the T wave and causing VF." },
    ],
    relatedSymptomSlugs: ["chest-pain", "shortness-of-breath", "hypotension"],
  },
  {
    slug: "hypotension",
    symptom: "Hypotension",
    title: "Hypotension Nursing Assessment: Causes, Types & Emergency Management",
    metaTitle: "Hypotension Nursing Assessment | Shock Types & Nursing Interventions",
    metaDescription: "Complete hypotension nursing assessment: types of shock, differential diagnoses, fluid resuscitation, vasopressors, nursing interventions, and NCLEX questions.",
    keywords: "hypotension nursing assessment, types of shock nursing, fluid resuscitation nursing, vasopressors NCLEX",
    introduction: "Hypotension is a systolic blood pressure below 90 mmHg or a drop of >20 mmHg from baseline. While orthostatic hypotension may be benign, acute hypotension often indicates shock — a life-threatening state of inadequate tissue perfusion. The nurse must rapidly identify the type of shock (hypovolemic, cardiogenic, distributive, or obstructive) because treatment differs fundamentally between types.",
    redFlags: [
      "Systolic BP <90 mmHg with altered mental status (shock)",
      "Hypotension with tachycardia (compensatory — early shock)",
      "Hypotension with bradycardia (neurogenic shock or severe cardiac depression)",
      "Hypotension with JVD (cardiogenic or obstructive shock)",
      "Hypotension with flat neck veins (hypovolemic shock)",
      "Hypotension unresponsive to IV fluid bolus (consider vasopressors)",
      "Warm, flushed skin with hypotension (distributive/septic shock)",
      "Cool, clammy skin with hypotension (hypovolemic or cardiogenic shock)",
    ],
    differentialDiagnoses: [
      { condition: "Hypovolemic Shock (Hemorrhagic)", keyFeatures: "Tachycardia, flat neck veins, cool/clammy skin, obvious or occult bleeding, decreased Hgb", urgency: "emergent" },
      { condition: "Cardiogenic Shock", keyFeatures: "JVD, crackles, S3 gallop, poor cardiac output, often post-MI, elevated BNP", urgency: "emergent" },
      { condition: "Septic Shock (Distributive)", keyFeatures: "Warm/flushed initially, fever, tachycardia, elevated lactate, suspected infection source", urgency: "emergent" },
      { condition: "Anaphylactic Shock (Distributive)", keyFeatures: "Urticaria, angioedema, stridor, bronchospasm, known allergen exposure", urgency: "emergent" },
      { condition: "Neurogenic Shock (Distributive)", keyFeatures: "Hypotension with BRADYCARDIA (unique), warm/dry skin below injury, spinal cord injury", urgency: "emergent" },
      { condition: "Obstructive Shock (PE, Tamponade, Tension PTX)", keyFeatures: "JVD, hypotension, muffled heart sounds (tamponade), unilateral absent breath sounds (PTX)", urgency: "emergent" },
      { condition: "Orthostatic Hypotension", keyFeatures: "SBP drop ≥20 or DBP drop ≥10 upon standing, dizziness, resolves with position change", urgency: "non-urgent" },
      { condition: "Medication-Induced", keyFeatures: "Antihypertensives, diuretics, nitrates, alpha-blockers, recent dose change", urgency: "urgent" },
    ],
    assessmentSteps: [
      { step: "Vital Signs Assessment", description: "BP in both arms (aortic dissection screening), heart rate, respiratory rate, temperature, SpO2. Orthostatic vitals if stable enough." },
      { step: "Shock Type Identification", description: "JVD present = cardiogenic or obstructive. JVD absent = hypovolemic or distributive. Warm skin = distributive. Cool skin = hypovolemic or cardiogenic." },
      { step: "Perfusion Assessment", description: "Capillary refill (>3 sec = poor perfusion), skin color/temperature, mental status, urine output (<0.5 mL/kg/hr = inadequate perfusion)." },
      { step: "Fluid Status Assessment", description: "I&O, daily weight, skin turgor, mucous membranes, recent fluid losses (bleeding, vomiting, diarrhea)." },
      { step: "Lab Assessment", description: "CBC (Hgb for bleeding), lactate (tissue hypoperfusion marker >2 mmol/L), BMP, BNP, troponin, blood cultures if infection suspected." },
    ],
    clinicalDecisionMaking: "The fundamental question in hypotension is: what type of shock? Hypovolemic = give fluids. Cardiogenic = fluids may worsen it (inotropes and vasopressors instead). Distributive = fluids first, then vasopressors. Obstructive = treat the obstruction (pericardiocentesis for tamponade, needle decompression for tension PTX, anticoagulation for PE). Lactate >2 mmol/L is a marker of tissue hypoperfusion. MAP (mean arterial pressure) target is ≥65 mmHg to maintain organ perfusion.",
    nursingInterventions: [
      "Establish two large-bore IV accesses (18G or larger)",
      "Initiate IV fluid bolus: 500 mL-1 L NS or LR (30 mL/kg for sepsis)",
      "Position patient supine or Trendelenburg (legs elevated) — EXCEPT in cardiogenic shock",
      "Monitor MAP target ≥65 mmHg",
      "Administer vasopressors as ordered (norepinephrine is first-line for septic shock)",
      "Monitor urine output hourly (goal >0.5 mL/kg/hr)",
      "Draw serial lactate levels to monitor tissue perfusion",
      "Administer blood products for hemorrhagic shock (type and crossmatch)",
      "Administer epinephrine IM for anaphylactic shock",
      "Continuous cardiac and hemodynamic monitoring",
    ],
    examTips: [
      "JVD + hypotension = cardiogenic or obstructive shock (NOT hypovolemic)",
      "Flat neck veins + hypotension = hypovolemic shock",
      "Neurogenic shock is unique: hypotension + BRADYCARDIA (all others have tachycardia)",
      "Norepinephrine is first-line vasopressor for septic shock",
      "MAP target ≥65 mmHg for adequate organ perfusion",
      "Lactate >2 mmol/L indicates tissue hypoperfusion even if BP appears acceptable",
    ],
    practiceQuestions: [
      {
        question: "A patient in the ICU has BP 78/42, HR 120, flat neck veins, cool/clammy skin, and Hgb 6.2 g/dL. What type of shock is this?",
        options: ["Cardiogenic shock", "Septic shock", "Hypovolemic (hemorrhagic) shock", "Neurogenic shock"],
        correctIndex: 2,
        rationale: "Flat neck veins, tachycardia, cool/clammy skin, and low hemoglobin indicate hypovolemic hemorrhagic shock. The flat neck veins distinguish it from cardiogenic and obstructive shock (which have JVD). The cool skin distinguishes it from distributive/septic shock (which has warm skin initially)."
      },
      {
        question: "A patient with a spinal cord injury at T4 has BP 70/40 and HR 48. This presentation is most consistent with:",
        options: ["Hypovolemic shock", "Cardiogenic shock", "Neurogenic shock", "Septic shock"],
        correctIndex: 2,
        rationale: "Neurogenic shock is the ONLY type of shock that presents with hypotension AND bradycardia. Loss of sympathetic tone below the level of spinal cord injury causes vasodilation (hypotension) and unopposed vagal tone (bradycardia). All other shock types present with compensatory tachycardia."
      },
    ],
    faq: [
      { question: "What is the difference between hypotension and shock?", answer: "Hypotension is simply low blood pressure (SBP <90 mmHg). Shock is inadequate tissue perfusion regardless of blood pressure. A patient can be in shock with a 'normal' blood pressure (compensated shock). Markers of shock include elevated lactate, oliguria, altered mental status, and poor capillary refill." },
      { question: "Why is Trendelenburg position controversial?", answer: "Traditional teaching recommended Trendelenburg (head-down) for hypotension to improve venous return. Current evidence shows it provides only transient benefit, may compromise respiratory function by pushing abdominal contents against the diaphragm, and increases intracranial pressure. Passive leg elevation (legs up, trunk flat) is preferred for temporary hemodynamic support." },
    ],
    relatedSymptomSlugs: ["tachycardia", "altered-level-of-consciousness", "chest-pain"],
  },
  {
    slug: "dyspnea",
    symptom: "Dyspnea on Exertion",
    title: "Dyspnea on Exertion Nursing Assessment: Causes & Clinical Guide",
    metaTitle: "Dyspnea on Exertion | Differential Diagnosis & Nursing Assessment",
    metaDescription: "Complete dyspnea on exertion nursing assessment: cardiac vs pulmonary causes, NYHA classification, diagnostic workup, nursing interventions, and NCLEX questions.",
    keywords: "dyspnea on exertion nursing, DOE assessment nursing, exertional dyspnea differential, NYHA classification NCLEX",
    introduction: "Dyspnea on exertion (DOE) is shortness of breath triggered by physical activity that was previously tolerated. Unlike acute dyspnea at rest, DOE often develops gradually and reflects progressive cardiac or pulmonary disease. Systematic assessment to distinguish cardiac from pulmonary causes is essential because the treatment approach differs fundamentally.",
    redFlags: [
      "DOE progressing to dyspnea at rest (worsening heart failure or pulmonary disease)",
      "DOE with chest pain (cardiac ischemia)",
      "DOE with syncope or near-syncope (severe aortic stenosis, pulmonary hypertension)",
      "DOE with significant desaturation on exertion (pulmonary fibrosis, PE)",
      "Orthopnea and PND developing alongside DOE (heart failure progression)",
      "Progressive DOE over weeks to months (cardiac, pulmonary, or anemia)",
      "DOE with peripheral edema (right heart failure)",
    ],
    differentialDiagnoses: [
      { condition: "Heart Failure (HFrEF/HFpEF)", keyFeatures: "DOE, orthopnea, PND, edema, elevated BNP, S3 gallop, NYHA class II-IV", urgency: "urgent" },
      { condition: "COPD", keyFeatures: "DOE with wheezing, chronic productive cough, barrel chest, smoking history, low FEV1/FVC", urgency: "urgent" },
      { condition: "Coronary Artery Disease (Anginal Equivalent)", keyFeatures: "DOE as anginal equivalent (especially women/elderly), improves with rest, positive stress test", urgency: "urgent" },
      { condition: "Valvular Heart Disease (Aortic Stenosis)", keyFeatures: "DOE, systolic crescendo-decrescendo murmur, syncope triad (DOE + syncope + angina)", urgency: "urgent" },
      { condition: "Pulmonary Hypertension", keyFeatures: "Progressive DOE, syncope with exertion, RV heave, elevated PA pressures", urgency: "urgent" },
      { condition: "Anemia", keyFeatures: "DOE with fatigue, pallor, tachycardia, low Hgb, normal lung sounds and CXR", urgency: "urgent" },
      { condition: "Interstitial Lung Disease", keyFeatures: "Progressive DOE, dry cough, fine crackles (Velcro sounds), restrictive PFTs", urgency: "urgent" },
      { condition: "Deconditioning/Obesity", keyFeatures: "DOE in sedentary patients, no cardiac or pulmonary abnormalities, BMI >30", urgency: "non-urgent" },
    ],
    assessmentSteps: [
      { step: "Quantify Severity (NYHA Classification)", description: "Class I: no limitation. Class II: slight limitation (ordinary activity). Class III: marked limitation (less than ordinary activity). Class IV: symptoms at rest." },
      { step: "Cardiac Assessment", description: "Auscultate heart sounds (murmurs, S3), assess JVD, check BNP, obtain echocardiogram for EF." },
      { step: "Pulmonary Assessment", description: "Auscultate breath sounds, obtain PFTs (obstructive vs restrictive), CXR, SpO2 at rest and with exertion." },
      { step: "6-Minute Walk Test", description: "Standardized measure of functional capacity. Document distance walked and SpO2 changes during exertion." },
      { step: "Lab Assessment", description: "BNP (cardiac vs pulmonary), CBC (anemia), TSH (thyroid), D-dimer if PE considered." },
    ],
    clinicalDecisionMaking: "The BNP level is the most useful initial test for differentiating cardiac from pulmonary DOE. BNP >100 pg/mL suggests cardiac cause; normal BNP favors pulmonary cause. Echocardiography evaluates ventricular function and valvular disease. PFTs distinguish obstructive (COPD, asthma) from restrictive (fibrosis) lung disease. DOE in women and elderly may be an anginal equivalent — exercise stress testing should be considered even without typical chest pain.",
    nursingInterventions: [
      "Assess functional capacity using NYHA classification",
      "Monitor oxygen saturation at rest and with exertion",
      "Administer diuretics for heart failure-related DOE (furosemide)",
      "Administer bronchodilators for COPD-related DOE (albuterol, tiotropium)",
      "Educate on energy conservation techniques (pace activities, rest periods)",
      "Monitor daily weights for fluid retention (heart failure)",
      "Encourage cardiac and pulmonary rehabilitation",
      "Provide supplemental oxygen during exertion if desaturation occurs",
      "Educate on medication adherence (HF meds, inhalers)",
      "Teach patient to report worsening DOE, new orthopnea, or PND",
    ],
    examTips: [
      "BNP >100 pg/mL = cardiac cause of dyspnea. Normal BNP = likely pulmonary cause",
      "NYHA Classification: I = no limitation, II = slight, III = marked, IV = symptoms at rest",
      "DOE can be an anginal equivalent, especially in women and elderly",
      "Aortic stenosis triad: DOE + syncope + angina (all exercise-related)",
      "Anemia causes DOE due to reduced oxygen-carrying capacity — check Hgb",
    ],
    practiceQuestions: [
      {
        question: "A patient reports shortness of breath when climbing one flight of stairs but not at rest. BNP is 450 pg/mL. What is the most likely cause?",
        options: ["COPD exacerbation", "Heart failure", "Pulmonary embolism", "Anxiety"],
        correctIndex: 1,
        rationale: "DOE with significantly elevated BNP (450 pg/mL, normal <100) strongly suggests heart failure as the cause of dyspnea. BNP is released by ventricular myocytes in response to increased wall stress from volume overload."
      },
      {
        question: "According to NYHA classification, a patient who is comfortable at rest but has marked limitation with ordinary physical activity is classified as:",
        options: ["Class I", "Class II", "Class III", "Class IV"],
        correctIndex: 2,
        rationale: "NYHA Class III indicates marked limitation — symptoms occur with less-than-ordinary activity. Class I = no limitation, Class II = slight limitation (ordinary activity), Class IV = symptoms at rest."
      },
    ],
    faq: [
      { question: "What is the NYHA classification?", answer: "The New York Heart Association (NYHA) functional classification grades heart failure severity: Class I (no symptoms with ordinary activity), Class II (slight limitation — symptoms with ordinary activity), Class III (marked limitation — symptoms with less than ordinary activity), Class IV (unable to carry out any activity without symptoms; symptoms at rest)." },
      { question: "Can dyspnea on exertion be the only symptom of a heart attack?", answer: "Yes. Dyspnea on exertion can be an 'anginal equivalent' — the only presentation of myocardial ischemia, especially in women, elderly patients, and diabetics who may not experience typical chest pain. Any new or unexplained DOE should be evaluated for cardiac causes." },
    ],
    relatedSymptomSlugs: ["chest-pain", "shortness-of-breath", "edema"],
  },
];

export function getSymptomAssessmentBySlug(slug: string): SymptomAssessment | undefined {
  return symptomAssessments.find(s => s.slug === slug);
}

export function getAllSymptomAssessmentSlugs(): string[] {
  return symptomAssessments.map(s => s.slug);
}
