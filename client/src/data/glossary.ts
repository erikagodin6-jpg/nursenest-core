export interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  category: GlossaryCategory;
  relatedLessonIds: string[];
}

export type GlossaryCategory =
  | "Anatomy"
  | "Pharmacology"
  | "Pathophysiology"
  | "Assessment"
  | "Procedures"
  | "Lab Values"
  | "ECG";

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  "Anatomy",
  "Pharmacology",
  "Pathophysiology",
  "Assessment",
  "Procedures",
  "Lab Values",
  "ECG",
];

function toSlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const rawTerms: Omit<GlossaryTerm, "slug">[] = [
  { term: "Auscultation", definition: "The act of listening to internal body sounds, typically using a stethoscope. Used to assess heart, lung, and bowel sounds for abnormalities such as murmurs, crackles, or absent bowel sounds.", category: "Assessment", relatedLessonIds: ["cardiac-auscultation-rn", "head-to-toe-rpn"] },
  { term: "Blood Pressure", definition: "The force exerted by circulating blood on the walls of blood vessels. Measured as systolic over diastolic pressure in mmHg. Normal adult range is approximately 120/80 mmHg.", category: "Assessment", relatedLessonIds: ["vital-signs-assessment", "hypertension-management"] },
  { term: "Bradycardia", definition: "An abnormally slow heart rate, typically defined as fewer than 60 beats per minute in adults. May be normal in athletes or indicate underlying cardiac conduction problems.", category: "Pathophysiology", relatedLessonIds: ["cardiac-rhythm-rn", "cardiac-monitoring"] },
  { term: "Tachycardia", definition: "An abnormally rapid heart rate, generally defined as greater than 100 beats per minute in adults. Can result from fever, anxiety, dehydration, hemorrhage, or cardiac arrhythmias.", category: "Pathophysiology", relatedLessonIds: ["cardiac-rhythm-rn", "cardiac-monitoring"] },
  { term: "Cardiac Output", definition: "The volume of blood pumped by the heart per minute, calculated as heart rate multiplied by stroke volume. Normal resting cardiac output is approximately 4–8 liters per minute.", category: "Anatomy", relatedLessonIds: ["cardiovascular-rn", "cardiogenic-shock"] },
  { term: "Stroke Volume", definition: "The amount of blood ejected from the left ventricle with each heartbeat. Determined by preload, afterload, and contractility. Normal stroke volume is approximately 60–100 mL.", category: "Anatomy", relatedLessonIds: ["cardiovascular-rn", "hf-advanced"] },
  { term: "Preload", definition: "The degree of ventricular stretch at the end of diastole, determined by the volume of blood returning to the heart. Increased preload raises stroke volume up to a physiological limit (Frank-Starling mechanism).", category: "Anatomy", relatedLessonIds: ["cardiovascular-rn", "hf-advanced"] },
  { term: "Afterload", definition: "The resistance the left ventricle must overcome to eject blood during systole. Primarily determined by systemic vascular resistance. Elevated afterload increases cardiac workload.", category: "Anatomy", relatedLessonIds: ["cardiovascular-rn", "hypertension-management"] },
  { term: "Myocardial Infarction", definition: "Death of heart muscle tissue due to prolonged ischemia, most commonly caused by coronary artery occlusion. Presents with chest pain, diaphoresis, and ECG changes such as ST elevation.", category: "Pathophysiology", relatedLessonIds: ["mi-management", "mi-acute"] },
  { term: "Heart Failure", definition: "A chronic condition in which the heart cannot pump blood effectively to meet the body's metabolic demands. Classified as left-sided (pulmonary congestion) or right-sided (systemic congestion).", category: "Pathophysiology", relatedLessonIds: ["hf-advanced", "chf-basics"] },
  { term: "Pulmonary Embolism", definition: "A blockage of one or more pulmonary arteries, usually by a blood clot that has traveled from a deep vein (DVT). Presents with sudden dyspnea, chest pain, tachycardia, and hypoxemia.", category: "Pathophysiology", relatedLessonIds: ["pe-recognition", "pe-dvt"] },
  { term: "Deep Vein Thrombosis", definition: "Formation of a blood clot in a deep vein, most commonly in the lower extremities. Risk factors include immobility, surgery, and hypercoagulable states. Can lead to pulmonary embolism.", category: "Pathophysiology", relatedLessonIds: ["pe-dvt"] },
  { term: "Atrial Fibrillation", definition: "An irregular and often rapid heart rhythm originating from chaotic electrical activity in the atria. The atria quiver instead of contracting effectively, increasing risk of stroke due to blood stasis.", category: "ECG", relatedLessonIds: ["cardiac-rhythm-rn", "cardiac-monitoring"] },
  { term: "Sinus Rhythm", definition: "The normal heart rhythm originating from the sinoatrial (SA) node, characterized by a regular rate of 60–100 bpm, with consistent P waves preceding each QRS complex.", category: "ECG", relatedLessonIds: ["cardiac-rhythm-rn", "cardiac-monitoring"] },
  { term: "ST Elevation", definition: "An ECG finding where the ST segment is elevated above the baseline, indicating acute transmural myocardial ischemia or injury. A hallmark of ST-elevation myocardial infarction (STEMI).", category: "ECG", relatedLessonIds: ["mi-acute", "cardiac-monitoring"] },
  { term: "QRS Complex", definition: "The ECG waveform representing ventricular depolarization. Normal duration is 0.06–0.12 seconds. A widened QRS may indicate bundle branch block or ventricular rhythm.", category: "ECG", relatedLessonIds: ["cardiac-rhythm-rn"] },
  { term: "P Wave", definition: "The ECG waveform representing atrial depolarization. A normal P wave is upright in lead II and precedes each QRS complex in sinus rhythm.", category: "ECG", relatedLessonIds: ["cardiac-rhythm-rn"] },
  { term: "T Wave", definition: "The ECG waveform representing ventricular repolarization. Peaked T waves may indicate hyperkalemia; inverted T waves can suggest ischemia.", category: "ECG", relatedLessonIds: ["cardiac-rhythm-rn"] },
  { term: "Ventricular Tachycardia", definition: "A rapid heart rhythm originating from the ventricles, with a rate greater than 100 bpm and wide QRS complexes. Can be sustained or non-sustained and may degenerate into ventricular fibrillation.", category: "ECG", relatedLessonIds: ["cardiac-rhythm-rn", "cardiac-monitoring"] },
  { term: "Ventricular Fibrillation", definition: "A life-threatening cardiac arrhythmia characterized by chaotic, disorganized electrical activity in the ventricles, resulting in no effective cardiac output. Requires immediate defibrillation.", category: "ECG", relatedLessonIds: ["cardiac-rhythm-rn"] },
  { term: "Hemoglobin", definition: "The iron-containing protein in red blood cells responsible for oxygen transport. Normal values are approximately 12–16 g/dL for females and 14–18 g/dL for males.", category: "Lab Values", relatedLessonIds: [] },
  { term: "Hematocrit", definition: "The percentage of blood volume occupied by red blood cells. Normal range is approximately 36–46% for females and 40–54% for males. Elevated in dehydration; decreased in anemia.", category: "Lab Values", relatedLessonIds: [] },
  { term: "Potassium", definition: "An essential electrolyte critical for cardiac and neuromuscular function. Normal serum level is 3.5–5.0 mEq/L. Abnormal levels can cause life-threatening cardiac arrhythmias.", category: "Lab Values", relatedLessonIds: [] },
  { term: "Sodium", definition: "The primary extracellular cation responsible for maintaining fluid balance and osmolality. Normal serum level is 135–145 mEq/L. Imbalances affect neurological and cardiovascular function.", category: "Lab Values", relatedLessonIds: ["siadh-di"] },
  { term: "Calcium", definition: "An electrolyte essential for bone health, muscle contraction, nerve transmission, and blood clotting. Normal serum level is 8.5–10.5 mg/dL. Corrected for albumin levels.", category: "Lab Values", relatedLessonIds: [] },
  { term: "Magnesium", definition: "An electrolyte involved in enzyme function, neuromuscular transmission, and cardiac rhythm stability. Normal serum level is 1.5–2.5 mEq/L. Deficiency can worsen hypokalemia.", category: "Lab Values", relatedLessonIds: [] },
  { term: "BUN", definition: "Blood urea nitrogen; a measure of urea in the blood reflecting protein metabolism and kidney function. Normal range is 7–20 mg/dL. Elevated in dehydration, renal failure, and GI bleeding.", category: "Lab Values", relatedLessonIds: ["aki-management-np"] },
  { term: "Creatinine", definition: "A waste product of muscle metabolism filtered by the kidneys. Normal serum level is 0.6–1.2 mg/dL. Elevated levels indicate impaired renal function.", category: "Lab Values", relatedLessonIds: ["aki-management-np"] },
  { term: "INR", definition: "International Normalized Ratio; a standardized measure of blood clotting time used to monitor warfarin therapy. Therapeutic range is typically 2.0–3.0 for most indications.", category: "Lab Values", relatedLessonIds: [] },
  { term: "Troponin", definition: "A cardiac biomarker released into the blood when heart muscle is damaged. Elevated troponin I or T levels are highly sensitive and specific for myocardial injury.", category: "Lab Values", relatedLessonIds: ["mi-acute", "mi-management"] },
  { term: "ABG", definition: "Arterial blood gas analysis; a test measuring pH, PaCO2, PaO2, HCO3, and SaO2 in arterial blood. Used to assess acid-base balance, oxygenation, and ventilation status.", category: "Lab Values", relatedLessonIds: [] },
  { term: "Metabolic Acidosis", definition: "A condition characterized by decreased blood pH (<7.35) and low bicarbonate (<22 mEq/L). Causes include diabetic ketoacidosis, renal failure, lactic acidosis, and diarrhea.", category: "Pathophysiology", relatedLessonIds: ["dka-hhns-np"] },
  { term: "Metabolic Alkalosis", definition: "A condition characterized by elevated blood pH (>7.45) and high bicarbonate (>26 mEq/L). Common causes include prolonged vomiting, nasogastric suction, and diuretic use.", category: "Pathophysiology", relatedLessonIds: [] },
  { term: "Respiratory Acidosis", definition: "A condition resulting from CO2 retention due to hypoventilation, leading to decreased blood pH. Causes include COPD exacerbation, respiratory depression, and neuromuscular disease.", category: "Pathophysiology", relatedLessonIds: ["copd-exacerbation-np"] },
  { term: "Respiratory Alkalosis", definition: "A condition resulting from excessive CO2 elimination due to hyperventilation, leading to elevated blood pH. Causes include anxiety, pain, fever, and early sepsis.", category: "Pathophysiology", relatedLessonIds: [] },
  { term: "Anaphylaxis", definition: "A severe, potentially life-threatening systemic allergic reaction involving multiple organ systems. Characterized by airway edema, bronchospasm, hypotension, and urticaria. Treated with epinephrine.", category: "Pathophysiology", relatedLessonIds: ["transfusion-reactions-np"] },
  { term: "Sepsis", definition: "A life-threatening organ dysfunction caused by a dysregulated host response to infection. Defined by the presence of infection plus an increase in SOFA score ≥2.", category: "Pathophysiology", relatedLessonIds: ["sepsis-mastery", "sepsis-mastery-np", "sepsis-screening-rn"] },
  { term: "Septic Shock", definition: "A subset of sepsis with circulatory and cellular/metabolic dysfunction associated with higher mortality. Defined as sepsis requiring vasopressors and having a serum lactate >2 mmol/L.", category: "Pathophysiology", relatedLessonIds: ["sepsis-mastery-np", "shock-syndromes"] },
  { term: "Diabetic Ketoacidosis", definition: "A serious complication of diabetes characterized by hyperglycemia, ketonemia, and metabolic acidosis. Occurs when the body breaks down fat for energy due to insufficient insulin.", category: "Pathophysiology", relatedLessonIds: ["dka-hhns-np"] },
  { term: "SIADH", definition: "Syndrome of Inappropriate Antidiuretic Hormone secretion; excessive ADH release causes water retention, dilutional hyponatremia, and concentrated urine despite low serum osmolality.", category: "Pathophysiology", relatedLessonIds: ["siadh-di", "siadh-di-np"] },
  { term: "Diabetes Insipidus", definition: "A condition caused by insufficient ADH production (central) or renal resistance to ADH (nephrogenic), resulting in excretion of large volumes of dilute urine and hypernatremia.", category: "Pathophysiology", relatedLessonIds: ["siadh-di", "siadh-di-np"] },
  { term: "Pneumothorax", definition: "The presence of air in the pleural space causing partial or complete lung collapse. Types include spontaneous, traumatic, and tension pneumothorax. Tension type is a medical emergency.", category: "Pathophysiology", relatedLessonIds: [] },
  { term: "COPD", definition: "Chronic Obstructive Pulmonary Disease; a group of progressive lung diseases including emphysema and chronic bronchitis. Characterized by airflow limitation that is not fully reversible.", category: "Pathophysiology", relatedLessonIds: ["copd-exacerbation-np"] },
  { term: "Asthma", definition: "A chronic inflammatory airway disease characterized by reversible bronchoconstriction, airway hyperresponsiveness, and mucus hypersecretion. Triggered by allergens, exercise, or irritants.", category: "Pathophysiology", relatedLessonIds: [] },
  { term: "Stroke", definition: "Acute neurological deficit caused by interruption of blood supply to the brain (ischemic) or rupture of a cerebral blood vessel (hemorrhagic). Time-critical emergency—'time is brain.'", category: "Pathophysiology", relatedLessonIds: ["stroke"] },
  { term: "Increased Intracranial Pressure", definition: "Elevated pressure within the cranial vault caused by brain edema, hemorrhage, tumor, or hydrocephalus. Signs include headache, altered consciousness, and Cushing's triad (hypertension, bradycardia, irregular respirations).", category: "Pathophysiology", relatedLessonIds: ["increased-icp-np"] },
  { term: "Glasgow Coma Scale", definition: "A neurological assessment tool scoring eye opening (1–4), verbal response (1–5), and motor response (1–6). Total score ranges from 3 (deep coma) to 15 (fully alert). Score ≤8 indicates severe brain injury.", category: "Assessment", relatedLessonIds: ["gcs-assessment-rpn", "primary-survey-rn"] },
  { term: "APGAR Score", definition: "A rapid assessment of newborn health at 1 and 5 minutes after birth. Scores Appearance, Pulse, Grimace, Activity, and Respiration on a 0–2 scale. Total 7–10 is reassuring.", category: "Assessment", relatedLessonIds: [] },
  { term: "Braden Scale", definition: "A validated tool used to predict pressure injury risk. Assesses sensory perception, moisture, activity, mobility, nutrition, and friction/shear. Lower scores indicate higher risk.", category: "Assessment", relatedLessonIds: ["braden-scale-rpn"] },
  { term: "Pain Assessment", definition: "Systematic evaluation of a patient's pain using standardized tools. Includes numeric rating scale (0–10), Wong-Baker FACES, FLACC for nonverbal patients, and PQRST mnemonic.", category: "Assessment", relatedLessonIds: ["pain-assessment-rpn"] },
  { term: "SBAR", definition: "A structured communication framework: Situation, Background, Assessment, Recommendation. Used for concise handoff and escalation communication between healthcare providers.", category: "Assessment", relatedLessonIds: ["sbar-escalation"] },
  { term: "Head-to-Toe Assessment", definition: "A systematic physical examination performed in a cephalocaudal (head-to-toe) order. Includes inspection, palpation, percussion, and auscultation of all body systems.", category: "Assessment", relatedLessonIds: ["head-to-toe-rpn", "comprehensive-health-assessment"] },
  { term: "Vital Signs", definition: "The fundamental physiological measurements: temperature, pulse, respirations, blood pressure, and oxygen saturation. Often includes pain as the 'fifth vital sign.'", category: "Assessment", relatedLessonIds: ["vital-signs-assessment", "vital-signs-red-flags"] },
  { term: "Pulse Oximetry", definition: "A non-invasive method of measuring arterial oxygen saturation (SpO2) using a sensor placed on a finger or earlobe. Normal SpO2 is 95–100%. Does not measure CO2 or ventilation.", category: "Assessment", relatedLessonIds: ["vital-signs-assessment"] },
  { term: "Epinephrine", definition: "A catecholamine used as a first-line treatment for anaphylaxis and cardiac arrest. Acts on alpha and beta adrenergic receptors to increase heart rate, contractility, and vasoconstriction.", category: "Pharmacology", relatedLessonIds: [] },
  { term: "Warfarin", definition: "An oral anticoagulant that inhibits vitamin K-dependent clotting factors (II, VII, IX, X). Monitored via INR. Antidote is vitamin K. Multiple drug and food interactions.", category: "Pharmacology", relatedLessonIds: [] },
  { term: "Heparin", definition: "A parenteral anticoagulant that enhances antithrombin III activity. Available as unfractionated (IV/SQ) or low molecular weight (SQ). Monitored via aPTT. Antidote is protamine sulfate.", category: "Pharmacology", relatedLessonIds: [] },
  { term: "Digoxin", definition: "A cardiac glycoside that increases myocardial contractility and slows AV node conduction. Used in heart failure and atrial fibrillation. Therapeutic range 0.5–2.0 ng/mL. Monitor for toxicity.", category: "Pharmacology", relatedLessonIds: ["chf-basics"] },
  { term: "ACE Inhibitors", definition: "Angiotensin-converting enzyme inhibitors (e.g., lisinopril, enalapril) that lower blood pressure by preventing angiotensin II formation. Side effects include dry cough and hyperkalemia.", category: "Pharmacology", relatedLessonIds: ["hypertension-management", "hf-advanced"] },
  { term: "Beta Blockers", definition: "Medications (e.g., metoprolol, atenolol) that block beta-adrenergic receptors, reducing heart rate, contractility, and blood pressure. Used in hypertension, heart failure, and arrhythmias.", category: "Pharmacology", relatedLessonIds: ["hypertension-management", "cardiac-monitoring"] },
  { term: "Nitroglycerin", definition: "A vasodilator that relaxes vascular smooth muscle, primarily reducing preload. Used for angina and acute coronary syndromes. Administered sublingual, IV, or transdermal. Contraindicated with PDE5 inhibitors.", category: "Pharmacology", relatedLessonIds: ["mi-acute"] },
  { term: "Insulin", definition: "A peptide hormone produced by pancreatic beta cells that facilitates glucose uptake into cells. Exogenous insulin is classified by onset and duration: rapid-acting, short-acting, intermediate, and long-acting.", category: "Pharmacology", relatedLessonIds: ["dka-hhns-np"] },
  { term: "Morphine", definition: "An opioid analgesic used for moderate to severe pain. Acts on mu receptors in the CNS. Side effects include respiratory depression, constipation, and hypotension. Antidote is naloxone.", category: "Pharmacology", relatedLessonIds: [] },
  { term: "Naloxone", definition: "An opioid antagonist that rapidly reverses the effects of opioid overdose, including respiratory depression. Administered IV, IM, SQ, or intranasally. Short half-life may require repeat dosing.", category: "Pharmacology", relatedLessonIds: [] },
  { term: "Dopamine", definition: "A catecholamine vasopressor used in hemodynamically significant hypotension and shock. Dose-dependent effects: low dose (renal perfusion), moderate (cardiac contractility), high (vasoconstriction).", category: "Pharmacology", relatedLessonIds: ["shock-syndromes", "cardiogenic-shock"] },
  { term: "Furosemide", definition: "A loop diuretic that inhibits sodium and chloride reabsorption in the loop of Henle, promoting diuresis. Used in heart failure and fluid overload. Monitor for hypokalemia and ototoxicity.", category: "Pharmacology", relatedLessonIds: ["hf-advanced", "chf-basics"] },
  { term: "Amiodarone", definition: "A class III antiarrhythmic used for life-threatening ventricular and supraventricular arrhythmias. Has a long half-life and multiple organ toxicities including thyroid, pulmonary, and hepatic.", category: "Pharmacology", relatedLessonIds: ["cardiac-rhythm-rn"] },
  { term: "Foley Catheter", definition: "An indwelling urinary catheter inserted through the urethra into the bladder with an inflatable balloon for retention. Used when continuous urinary drainage is needed. Increases UTI risk.", category: "Procedures", relatedLessonIds: [] },
  { term: "Nasogastric Tube", definition: "A tube inserted through the nose into the stomach for decompression, medication administration, or enteral feeding. Placement verified by X-ray, pH testing, or aspiration of gastric contents.", category: "Procedures", relatedLessonIds: [] },
  { term: "Central Line", definition: "A venous catheter inserted into a large central vein (subclavian, internal jugular, or femoral) for IV access, medication administration, hemodynamic monitoring, or dialysis.", category: "Procedures", relatedLessonIds: ["central-line-np"] },
  { term: "Lumbar Puncture", definition: "A procedure in which a needle is inserted into the subarachnoid space at L3–L4 or L4–L5 to obtain cerebrospinal fluid for analysis or to administer medications. Patient positioned in lateral decubitus or sitting.", category: "Procedures", relatedLessonIds: ["lumbar-puncture-np"] },
  { term: "Tracheostomy", definition: "A surgical opening through the anterior neck into the trachea to establish an airway. Performed for prolonged mechanical ventilation, upper airway obstruction, or airway protection.", category: "Procedures", relatedLessonIds: [] },
  { term: "Chest Tube", definition: "A tube inserted into the pleural space to drain air, blood, or fluid. Connected to a drainage system with a water seal. Used for pneumothorax, hemothorax, or pleural effusion.", category: "Procedures", relatedLessonIds: [] },
  { term: "Blood Transfusion", definition: "The intravenous administration of blood products including packed red blood cells, fresh frozen plasma, platelets, or cryoprecipitate. Requires verification of patient identity and blood type compatibility.", category: "Procedures", relatedLessonIds: ["transfusion-reactions-np"] },
  { term: "Wound VAC", definition: "Vacuum-Assisted Closure therapy; applies negative pressure to a wound through a sealed dressing to promote healing by increasing blood flow, reducing edema, and removing exudate.", category: "Procedures", relatedLessonIds: ["wound-vac-np"] },
  { term: "Mechanical Ventilation", definition: "The use of a machine to assist or replace spontaneous breathing. Modes include assist-control, SIMV, and pressure support. Settings include tidal volume, rate, FiO2, and PEEP.", category: "Procedures", relatedLessonIds: ["mechanical-vent-np"] },
  { term: "Endotracheal Intubation", definition: "Placement of a tube through the mouth or nose into the trachea to establish a definitive airway. Used for mechanical ventilation, airway protection, and emergency resuscitation.", category: "Procedures", relatedLessonIds: ["mechanical-vent-np"] },
  { term: "IV Insertion", definition: "The placement of a peripheral intravenous catheter into a vein for fluid, medication, or blood product administration. Site selection, catheter gauge, and aseptic technique are critical considerations.", category: "Procedures", relatedLessonIds: [] },
  { term: "Sterile Technique", definition: "A set of practices used to maintain sterility and prevent contamination during invasive procedures. Includes hand hygiene, sterile gloving, draping, and maintaining a sterile field.", category: "Procedures", relatedLessonIds: [] },
  { term: "Atelectasis", definition: "Collapse or incomplete expansion of lung tissue resulting in reduced gas exchange. Common postoperatively. Prevented with incentive spirometry, early ambulation, and deep breathing exercises.", category: "Pathophysiology", relatedLessonIds: [] },
  { term: "Pleural Effusion", definition: "Abnormal accumulation of fluid in the pleural space between the visceral and parietal pleura. Causes include heart failure, infection, and malignancy. May require thoracentesis for diagnosis or treatment.", category: "Pathophysiology", relatedLessonIds: [] },
  { term: "Acute Kidney Injury", definition: "A sudden decline in kidney function characterized by rising serum creatinine, decreased urine output, or both. Classified as prerenal, intrarenal, or postrenal based on etiology.", category: "Pathophysiology", relatedLessonIds: ["aki-management-np"] },
  { term: "Cirrhosis", definition: "Chronic liver disease characterized by widespread fibrosis and formation of regenerative nodules. Leads to portal hypertension, ascites, varices, coagulopathy, and hepatic encephalopathy.", category: "Pathophysiology", relatedLessonIds: [] },
  { term: "Pancreatitis", definition: "Inflammation of the pancreas, acute or chronic. Acute form presents with severe epigastric pain radiating to the back, elevated amylase and lipase, nausea, and vomiting.", category: "Pathophysiology", relatedLessonIds: [] },
  { term: "Hypothyroidism", definition: "A condition of insufficient thyroid hormone production. Manifests with fatigue, weight gain, cold intolerance, constipation, bradycardia, and dry skin. Treated with levothyroxine.", category: "Pathophysiology", relatedLessonIds: ["hypothyroidism-basics"] },
  { term: "Hyperthyroidism", definition: "Excessive production of thyroid hormones causing a hypermetabolic state. Symptoms include weight loss, heat intolerance, tachycardia, tremor, and exophthalmos (Graves' disease).", category: "Pathophysiology", relatedLessonIds: [] },
  { term: "Addison Disease", definition: "Primary adrenal insufficiency resulting from destruction of the adrenal cortex. Characterized by cortisol and aldosterone deficiency, causing hypotension, hyperkalemia, and hyperpigmentation.", category: "Pathophysiology", relatedLessonIds: ["adrenal-insufficiency"] },
  { term: "Cushing Syndrome", definition: "A condition caused by prolonged exposure to excess cortisol. Features include central obesity, moon face, buffalo hump, striae, hyperglycemia, and immunosuppression.", category: "Pathophysiology", relatedLessonIds: [] },
  { term: "Compartment Syndrome", definition: "Increased pressure within a closed muscle compartment that compromises blood flow and tissue perfusion. The 5 P's: Pain (out of proportion), Pressure, Paralysis, Paresthesia, Pulselessness.", category: "Pathophysiology", relatedLessonIds: ["compartment-syndrome"] },
  { term: "Malignant Hyperthermia", definition: "A life-threatening pharmacogenetic reaction to certain anesthetic agents (succinylcholine, volatile anesthetics). Causes uncontrolled skeletal muscle hypermetabolism. Treated with dantrolene.", category: "Pathophysiology", relatedLessonIds: ["malignant-hyperthermia"] },
  { term: "DIC", definition: "Disseminated Intravascular Coagulation; a pathological process involving simultaneous widespread clotting and bleeding. Triggered by sepsis, trauma, obstetric complications, or malignancy.", category: "Pathophysiology", relatedLessonIds: [] },
  { term: "Tumor Lysis Syndrome", definition: "A metabolic emergency occurring after treatment of rapidly proliferating cancers. Characterized by hyperuricemia, hyperkalemia, hyperphosphatemia, and hypocalcemia.", category: "Pathophysiology", relatedLessonIds: ["tumor-lysis-np"] },
  { term: "Eclampsia", definition: "The occurrence of generalized tonic-clonic seizures in a patient with preeclampsia. A life-threatening obstetric emergency requiring magnesium sulfate and emergent delivery.", category: "Pathophysiology", relatedLessonIds: ["eclampsia-np"] },
  { term: "HELLP Syndrome", definition: "A severe variant of preeclampsia characterized by Hemolysis, Elevated Liver enzymes, and Low Platelets. Requires prompt delivery and supportive care.", category: "Pathophysiology", relatedLessonIds: ["hellp-syndrome-np"] },
  { term: "Placenta Previa", definition: "A condition where the placenta partially or completely covers the internal cervical os. Presents with painless, bright red vaginal bleeding in the third trimester.", category: "Pathophysiology", relatedLessonIds: ["obstetric-hemorrhage-np"] },
  { term: "Abruptio Placentae", definition: "Premature separation of a normally implanted placenta from the uterine wall before delivery. Presents with painful, dark red vaginal bleeding, rigid abdomen, and fetal distress.", category: "Pathophysiology", relatedLessonIds: ["obstetric-hemorrhage-np"] },
  { term: "Neonatal Respiratory Distress Syndrome", definition: "A condition in preterm infants caused by surfactant deficiency, leading to alveolar collapse. Presents with tachypnea, nasal flaring, grunting, and retractions shortly after birth.", category: "Pathophysiology", relatedLessonIds: ["neonatal-rds-np"] },
  { term: "Delegation", definition: "The transfer of responsibility for the performance of a task from one individual to another while retaining accountability. Nurses delegate based on the Five Rights: right task, circumstance, person, direction, and supervision.", category: "Assessment", relatedLessonIds: ["delegation-rules-scope"] },
  { term: "Nursing Process", definition: "A systematic framework for nursing care consisting of five steps: Assessment, Diagnosis, Planning, Implementation, and Evaluation (ADPIE).", category: "Assessment", relatedLessonIds: ["nursing-process-adpie"] },
  { term: "Informed Consent", definition: "A legal and ethical process ensuring a patient understands the nature, risks, benefits, and alternatives of a proposed treatment or procedure before agreeing to it.", category: "Procedures", relatedLessonIds: [] },
  { term: "Alveoli", definition: "Tiny air sacs at the terminal ends of bronchioles where gas exchange occurs. Oxygen diffuses into pulmonary capillaries and carbon dioxide diffuses out for exhalation.", category: "Anatomy", relatedLessonIds: [] },
  { term: "Diaphragm", definition: "The primary muscle of respiration. A dome-shaped musculotendinous structure separating the thoracic and abdominal cavities. Contraction flattens the diaphragm, creating negative pressure for inhalation.", category: "Anatomy", relatedLessonIds: [] },
  { term: "Sinoatrial Node", definition: "The heart's natural pacemaker located in the right atrium. Generates electrical impulses at 60–100 beats per minute, initiating each cardiac cycle.", category: "Anatomy", relatedLessonIds: ["cardiac-rhythm-rn"] },
  { term: "Atrioventricular Node", definition: "A cluster of specialized cardiac cells at the junction of the atria and ventricles. Delays electrical conduction briefly to allow complete atrial contraction before ventricular depolarization.", category: "Anatomy", relatedLessonIds: ["cardiac-rhythm-rn"] },
  { term: "Nephron", definition: "The functional unit of the kidney responsible for filtration, reabsorption, secretion, and excretion. Each kidney contains approximately 1 million nephrons.", category: "Anatomy", relatedLessonIds: ["aki-management-np"] },
  { term: "Glomerular Filtration Rate", definition: "The rate at which blood is filtered by the glomeruli of the kidneys. Normal GFR is approximately 90–120 mL/min. Used to classify chronic kidney disease stages.", category: "Lab Values", relatedLessonIds: ["aki-management-np"] },
  { term: "Cerebral Perfusion Pressure", definition: "The net pressure gradient driving cerebral blood flow, calculated as mean arterial pressure minus intracranial pressure (CPP = MAP − ICP). Normal CPP is 60–100 mmHg.", category: "Anatomy", relatedLessonIds: ["increased-icp-np"] },
  { term: "Myelin Sheath", definition: "The insulating lipid layer surrounding axons in the nervous system formed by Schwann cells (PNS) or oligodendrocytes (CNS). Enables rapid saltatory nerve impulse conduction.", category: "Anatomy", relatedLessonIds: [] },
  { term: "Peritoneum", definition: "The serous membrane lining the abdominal cavity (parietal) and covering abdominal organs (visceral). The peritoneal cavity contains a small amount of serous fluid for lubrication.", category: "Anatomy", relatedLessonIds: [] },
  { term: "Hemostasis", definition: "The physiological process of stopping bleeding through vascular spasm, platelet plug formation, and the coagulation cascade leading to fibrin clot formation.", category: "Anatomy", relatedLessonIds: [] },
  { term: "WBC Count", definition: "White blood cell count; measures the total number of leukocytes in the blood. Normal range is 4,500–11,000 cells/μL. Elevated in infection; decreased in immunosuppression.", category: "Lab Values", relatedLessonIds: [] },
  { term: "Platelet Count", definition: "The number of thrombocytes in the blood. Normal range is 150,000–400,000/μL. Low counts (thrombocytopenia) increase bleeding risk; elevated counts (thrombocytosis) increase clotting risk.", category: "Lab Values", relatedLessonIds: [] },
  { term: "Albumin", definition: "A plasma protein produced by the liver that maintains oncotic pressure and transports substances in the blood. Normal range is 3.5–5.0 g/dL. Low levels indicate malnutrition or liver disease.", category: "Lab Values", relatedLessonIds: [] },
  { term: "Lactate", definition: "A byproduct of anaerobic metabolism. Normal venous lactate is <2 mmol/L. Elevated levels indicate tissue hypoperfusion, sepsis, or shock and correlate with mortality.", category: "Lab Values", relatedLessonIds: ["sepsis-mastery-np", "shock-syndromes"] },
  { term: "Prothrombin Time", definition: "A coagulation test measuring the extrinsic and common pathways. Normal PT is 11–13.5 seconds. Prolonged in liver disease, vitamin K deficiency, and warfarin therapy.", category: "Lab Values", relatedLessonIds: [] },
  { term: "aPTT", definition: "Activated Partial Thromboplastin Time; measures the intrinsic and common coagulation pathways. Normal range is 25–35 seconds. Used to monitor unfractionated heparin therapy.", category: "Lab Values", relatedLessonIds: [] },
  { term: "Cardiogenic Shock", definition: "A state of critical end-organ hypoperfusion caused by failure of the heart as a pump. Most commonly caused by extensive myocardial infarction. Characterized by hypotension, tachycardia, and pulmonary edema.", category: "Pathophysiology", relatedLessonIds: ["cardiogenic-shock", "shock-syndromes"] },
  { term: "Hypovolemic Shock", definition: "Shock resulting from decreased intravascular volume due to hemorrhage or severe fluid loss. Characterized by tachycardia, hypotension, decreased urine output, and cool, clammy skin.", category: "Pathophysiology", relatedLessonIds: ["shock-syndromes"] },
  { term: "Distributive Shock", definition: "Shock caused by massive vasodilation leading to relative hypovolemia. Includes septic, anaphylactic, and neurogenic shock. Characterized by warm skin (early septic) and hypotension.", category: "Pathophysiology", relatedLessonIds: ["shock-syndromes"] },
  { term: "Infective Endocarditis", definition: "Infection of the endocardial surface of the heart, usually involving heart valves. Caused by bacteria (Streptococcus, Staphylococcus). Presents with fever, new murmur, and Janeway lesions.", category: "Pathophysiology", relatedLessonIds: ["infective-endocarditis"] },
  { term: "Aortic Dissection", definition: "A tear in the intimal layer of the aorta allowing blood to flow between the layers of the aortic wall. Presents with sudden, severe 'tearing' chest or back pain. Requires emergent management.", category: "Pathophysiology", relatedLessonIds: ["aortic-dissection"] },
  { term: "Peripheral Artery Disease", definition: "Atherosclerotic narrowing of peripheral arteries, most commonly in the lower extremities. Presents with intermittent claudication, diminished pulses, and poor wound healing.", category: "Pathophysiology", relatedLessonIds: ["peripheral-artery-disease"] },
  { term: "Autonomic Dysreflexia", definition: "A potentially life-threatening condition in patients with spinal cord injuries at T6 or above. Triggered by noxious stimuli below the injury level, causing severe hypertension, bradycardia, and headache.", category: "Pathophysiology", relatedLessonIds: [] },
  { term: "Rhabdomyolysis", definition: "Breakdown of skeletal muscle releasing myoglobin, potassium, and other intracellular contents into the blood. Can cause acute kidney injury, hyperkalemia, and cardiac arrhythmias.", category: "Pathophysiology", relatedLessonIds: [] },
  { term: "Guillain-Barré Syndrome", definition: "An acute autoimmune polyneuropathy causing ascending symmetric muscle weakness and areflexia. Can progress to respiratory failure. Treated with plasmapheresis or IV immunoglobulin.", category: "Pathophysiology", relatedLessonIds: [] },
  { term: "Meningitis", definition: "Inflammation of the meninges surrounding the brain and spinal cord, caused by bacterial, viral, or fungal infection. Presents with headache, fever, nuchal rigidity, and photophobia.", category: "Pathophysiology", relatedLessonIds: [] },
  { term: "Burns Classification", definition: "Burns are classified by depth: superficial (epidermis only), partial thickness (epidermis and dermis), and full thickness (all skin layers). Extent calculated using Rule of Nines or Lund-Browder chart.", category: "Pathophysiology", relatedLessonIds: ["burn-management"] },
  { term: "Pacemaker", definition: "An implanted or temporary electronic device that delivers electrical impulses to the heart to regulate rhythm. Indicated for symptomatic bradycardia, heart block, and certain tachyarrhythmias.", category: "Procedures", relatedLessonIds: ["pacemaker-care"] },
  { term: "Defibrillation", definition: "The delivery of a therapeutic dose of electrical energy to the heart to terminate ventricular fibrillation or pulseless ventricular tachycardia. A critical intervention in cardiac arrest.", category: "Procedures", relatedLessonIds: [] },
  { term: "Cardioversion", definition: "The delivery of a synchronized electrical shock to convert a tachyarrhythmia to sinus rhythm. Used for hemodynamically unstable atrial fibrillation, atrial flutter, or SVT.", category: "Procedures", relatedLessonIds: [] },
  { term: "Arterial Blood Gas Sampling", definition: "Collection of blood from an artery (radial, brachial, or femoral) for analysis of pH, PaCO2, PaO2, HCO3, and base excess. Allen test performed before radial artery puncture.", category: "Procedures", relatedLessonIds: ["abg-sampling-np"] },
  { term: "Incentive Spirometry", definition: "A device used to encourage deep breathing and prevent atelectasis, especially postoperatively. Patient takes slow, deep breaths to raise the indicator, holding at peak for 3–5 seconds.", category: "Procedures", relatedLessonIds: [] },
  { term: "Suctioning", definition: "Removal of secretions from the airway using negative pressure via a catheter. Used for patients unable to clear secretions effectively. Pre-oxygenate before suctioning; limit to 10–15 seconds.", category: "Procedures", relatedLessonIds: [] },
];

export const glossaryTerms: GlossaryTerm[] = rawTerms.map((t) => ({
  ...t,
  slug: toSlug(t.term),
}));

export function getTermBySlug(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug);
}

export function getTermsByCategory(category: GlossaryCategory): GlossaryTerm[] {
  return glossaryTerms.filter((t) => t.category === category);
}

export function searchTerms(query: string): GlossaryTerm[] {
  const q = query.toLowerCase().trim();
  if (!q) return glossaryTerms;
  return glossaryTerms.filter(
    (t) =>
      t.term.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
  );
}

export function getAlphabetLetters(): string[] {
  const letters = new Set(glossaryTerms.map((t) => t.term[0].toUpperCase()));
  return Array.from(letters).sort();
}

export function getTermsByLetter(letter: string): GlossaryTerm[] {
  return glossaryTerms.filter((t) => t.term[0].toUpperCase() === letter.toUpperCase());
}
