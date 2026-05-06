/**
 * 200 long-tail clinical nursing + allied health blog topics for batch generation.
 *
 * Distribution across 10 clinical categories (20 topics each):
 *   cardiovascular, respiratory, endocrine, neuro, renal,
 *   gi, pharmacology, critical-care, pediatrics, mental-health
 *
 * Topic patterns used:
 *   - "<condition> nursing interventions nclex"
 *   - "<condition> pathophysiology nursing care"
 *   - "<condition> vs <condition> nursing"
 *   - "<condition> nclex questions rationale"
 *   - "<symptom> clinical signs nursing assessment"
 *
 * Tier mapping drives exam + country selection in the runner script.
 */

export type ClinicalBlogTier = "rn" | "rpn" | "pn" | "np" | "new-grad" | "allied";

export type ClinicalBlogTopicEntry = {
  topic: string;
  tier: ClinicalBlogTier;
  category: string;
  /** Primary SEO keyword (shorter phrase for targetKeyword). */
  primaryKeyword: string;
};

// ── 1. Cardiovascular (20) ─────────────────────────────────────────────────

const CARDIOVASCULAR: ClinicalBlogTopicEntry[] = [
  { topic: "Heart failure nursing interventions: fluid balance, daily weights, and discharge teaching", tier: "rn", category: "cardiovascular", primaryKeyword: "heart failure nursing interventions" },
  { topic: "Acute coronary syndrome STEMI vs NSTEMI: pathophysiology, nursing priorities, and NCLEX prep", tier: "rn", category: "cardiovascular", primaryKeyword: "acute coronary syndrome nursing" },
  { topic: "Atrial fibrillation pathophysiology, anticoagulation nursing, and stroke risk management", tier: "rn", category: "cardiovascular", primaryKeyword: "atrial fibrillation nursing care" },
  { topic: "Hypertensive urgency vs emergency: blood pressure targets, IV drips, and nursing monitoring", tier: "rn", category: "cardiovascular", primaryKeyword: "hypertensive emergency nursing" },
  { topic: "Cardiac tamponade: Beck's triad, pericardiocentesis, and critical care nursing interventions", tier: "rn", category: "cardiovascular", primaryKeyword: "cardiac tamponade nursing" },
  { topic: "Aortic stenosis vs mitral regurgitation: murmur characteristics and nursing care comparison", tier: "np", category: "cardiovascular", primaryKeyword: "valvular heart disease nursing" },
  { topic: "Deep vein thrombosis DVT prevention: anticoagulation nursing, sequential compression, and NCLEX questions", tier: "rn", category: "cardiovascular", primaryKeyword: "dvt prevention nursing nclex" },
  { topic: "Cardiogenic shock pathophysiology: low cardiac output signs, vasopressor monitoring, and nursing", tier: "rn", category: "cardiovascular", primaryKeyword: "cardiogenic shock nursing" },
  { topic: "Post-cardiac surgery nursing care: chest tube management, arrhythmia monitoring, sternal precautions", tier: "rn", category: "cardiovascular", primaryKeyword: "post cardiac surgery nursing" },
  { topic: "Peripheral artery disease PAD nursing assessment: ABI, wound care, and lifestyle teaching", tier: "rn", category: "cardiovascular", primaryKeyword: "peripheral artery disease nursing" },
  { topic: "Heart block first second third degree: ECG interpretation and pacemaker nursing care", tier: "rn", category: "cardiovascular", primaryKeyword: "heart block nursing ecg" },
  { topic: "Endocarditis nursing care: IV antibiotics, emboli risk, and fever management NCLEX questions", tier: "rn", category: "cardiovascular", primaryKeyword: "endocarditis nursing interventions" },
  { topic: "Aortic aneurysm dissection nursing: pain assessment, blood pressure control, and surgical prep", tier: "rn", category: "cardiovascular", primaryKeyword: "aortic dissection nursing" },
  { topic: "Pericarditis vs pleuritis: chest pain distinction and nursing documentation for new nurses", tier: "new-grad", category: "cardiovascular", primaryKeyword: "pericarditis nursing assessment" },
  { topic: "Cardiac catheterization post-procedure nursing: groin care, hematoma prevention, activity restrictions", tier: "rn", category: "cardiovascular", primaryKeyword: "cardiac catheterization nursing care" },
  { topic: "Ventricular fibrillation and defibrillation: BLS/ACLS review for nursing students", tier: "rn", category: "cardiovascular", primaryKeyword: "ventricular fibrillation nursing nclex" },
  { topic: "Long QT syndrome nursing: drug triggers, ECG surveillance, and patient safety teaching", tier: "np", category: "cardiovascular", primaryKeyword: "long qt syndrome nursing" },
  { topic: "Hypertrophic cardiomyopathy nursing: symptom management, sudden cardiac death risk, activity restrictions", tier: "np", category: "cardiovascular", primaryKeyword: "hypertrophic cardiomyopathy nursing" },
  { topic: "Orthostatic hypotension nursing assessment: causes, fall prevention, and medication review", tier: "rn", category: "cardiovascular", primaryKeyword: "orthostatic hypotension nursing" },
  { topic: "Anticoagulation therapy monitoring: heparin vs warfarin vs NOACs nursing priorities and lab values", tier: "rn", category: "cardiovascular", primaryKeyword: "anticoagulation nursing monitoring" },
];

// ── 2. Respiratory (20) ────────────────────────────────────────────────────

const RESPIRATORY: ClinicalBlogTopicEntry[] = [
  { topic: "COPD exacerbation nursing interventions: oxygen therapy, bronchodilators, and respiratory failure prevention", tier: "rn", category: "respiratory", primaryKeyword: "copd exacerbation nursing" },
  { topic: "Asthma vs COPD nursing comparison: pathophysiology, triggers, and NCLEX priority questions", tier: "rn", category: "respiratory", primaryKeyword: "asthma vs copd nursing" },
  { topic: "Pneumonia nursing care: positioning, secretion clearance, antibiotic monitoring, and aspiration prevention", tier: "rn", category: "respiratory", primaryKeyword: "pneumonia nursing interventions" },
  { topic: "Pulmonary embolism PE nursing: Wells criteria, anticoagulation, oxygen, and hemodynamic monitoring", tier: "rn", category: "respiratory", primaryKeyword: "pulmonary embolism nursing care" },
  { topic: "ARDS acute respiratory distress syndrome: low tidal volume ventilation and prone positioning nursing", tier: "rn", category: "respiratory", primaryKeyword: "ards nursing interventions" },
  { topic: "Pneumothorax tension vs spontaneous: chest tube nursing care and emergency interventions", tier: "rn", category: "respiratory", primaryKeyword: "pneumothorax nursing care" },
  { topic: "ABG arterial blood gas interpretation for nursing students: acidosis, alkalosis, compensation", tier: "new-grad", category: "respiratory", primaryKeyword: "abg interpretation nursing" },
  { topic: "Pleural effusion nursing assessment: thoracentesis preparation, monitoring, and patient education", tier: "rn", category: "respiratory", primaryKeyword: "pleural effusion nursing" },
  { topic: "Mechanical ventilation nursing: modes, alarms, VAP prevention, and weaning criteria", tier: "rn", category: "respiratory", primaryKeyword: "mechanical ventilation nursing" },
  { topic: "Sleep apnea CPAP nursing education: mask fitting, compliance barriers, and complication prevention", tier: "rn", category: "respiratory", primaryKeyword: "sleep apnea nursing education" },
  { topic: "Cystic fibrosis nursing management: airway clearance, enzyme therapy, and psychosocial support", tier: "rn", category: "respiratory", primaryKeyword: "cystic fibrosis nursing care" },
  { topic: "Tuberculosis TB nursing isolation precautions, medication teaching, and contact tracing", tier: "rn", category: "respiratory", primaryKeyword: "tuberculosis nursing interventions" },
  { topic: "Lung cancer nursing care: hemoptysis management, dyspnea relief, and palliative planning", tier: "rn", category: "respiratory", primaryKeyword: "lung cancer nursing care" },
  { topic: "Respiratory therapy bronchodilator nebulizer technique and medication teaching for COPD patients", tier: "allied", category: "respiratory", primaryKeyword: "respiratory therapy bronchodilator" },
  { topic: "Oxygen therapy delivery devices: nursing selection of nasal cannula, mask, Venturi, and non-rebreather", tier: "rn", category: "respiratory", primaryKeyword: "oxygen therapy nursing nclex" },
  { topic: "Epiglottitis and croup nursing: pediatric airway emergency assessment and do-not-disturb approach", tier: "rn", category: "respiratory", primaryKeyword: "epiglottitis croup nursing" },
  { topic: "Pulmonary hypertension nursing: vasodilator therapy, right heart failure signs, and exercise guidance", tier: "np", category: "respiratory", primaryKeyword: "pulmonary hypertension nursing" },
  { topic: "Sarcoidosis respiratory nursing: corticosteroid teaching, monitoring for extrapulmonary manifestations", tier: "np", category: "respiratory", primaryKeyword: "sarcoidosis nursing care" },
  { topic: "Tracheostomy nursing care: suctioning technique, inner cannula cleaning, and decannulation readiness", tier: "rn", category: "respiratory", primaryKeyword: "tracheostomy nursing care" },
  { topic: "Pursed lip breathing and diaphragmatic breathing: teaching COPD patients energy conservation techniques", tier: "rn", category: "respiratory", primaryKeyword: "breathing techniques copd nursing" },
];

// ── 3. Endocrine (20) ─────────────────────────────────────────────────────

const ENDOCRINE: ClinicalBlogTopicEntry[] = [
  { topic: "DKA vs HHS diabetic emergencies: pathophysiology, insulin protocols, and nursing priority actions", tier: "rn", category: "endocrine", primaryKeyword: "dka hhs nursing comparison" },
  { topic: "Type 1 vs type 2 diabetes nursing: pathophysiology, insulin types, and patient self-management teaching", tier: "rn", category: "endocrine", primaryKeyword: "type 1 vs type 2 diabetes nursing" },
  { topic: "Hypoglycemia nursing management: symptoms, 15-15 rule, glucagon administration, and NCLEX questions", tier: "rn", category: "endocrine", primaryKeyword: "hypoglycemia nursing interventions" },
  { topic: "Hypothyroidism vs hyperthyroidism nursing: signs, levothyroxine monitoring, and thyroid storm recognition", tier: "rn", category: "endocrine", primaryKeyword: "thyroid disorder nursing" },
  { topic: "Cushing syndrome vs Addison disease nursing: cortisol imbalances, crisis prevention, steroid teaching", tier: "np", category: "endocrine", primaryKeyword: "cushing addison nursing comparison" },
  { topic: "SIADH vs diabetes insipidus nursing: sodium dysregulation, urine osmolality, and fluid management", tier: "np", category: "endocrine", primaryKeyword: "siadh diabetes insipidus nursing" },
  { topic: "Hyperparathyroidism and hypercalcemia nursing: bones, groans, stones, moans assessment and intervention", tier: "rn", category: "endocrine", primaryKeyword: "hypercalcemia nursing" },
  { topic: "Insulin administration nursing: site rotation, pen vs vial technique, lipohypertrophy prevention", tier: "rn", category: "endocrine", primaryKeyword: "insulin administration nursing" },
  { topic: "Continuous glucose monitoring CGM nursing education: alert thresholds, sensor placement, accuracy limits", tier: "rn", category: "endocrine", primaryKeyword: "continuous glucose monitoring nursing" },
  { topic: "Perioperative diabetes management nursing: glucose monitoring, insulin drip, and complication prevention", tier: "rn", category: "endocrine", primaryKeyword: "perioperative diabetes nursing" },
  { topic: "Polycystic ovary syndrome PCOS nursing: insulin resistance, metformin teaching, and fertility counselling", tier: "np", category: "endocrine", primaryKeyword: "pcos nursing care" },
  { topic: "Acromegaly and gigantism nursing: growth hormone excess signs and transsphenoidal surgery nursing care", tier: "np", category: "endocrine", primaryKeyword: "acromegaly nursing" },
  { topic: "Diabetic neuropathy and foot care nursing: monofilament testing, wound prevention, patient education", tier: "rn", category: "endocrine", primaryKeyword: "diabetic neuropathy nursing" },
  { topic: "Diabetic nephropathy and kidney disease nursing: proteinuria monitoring, BP targets, diet restrictions", tier: "rn", category: "endocrine", primaryKeyword: "diabetic nephropathy nursing" },
  { topic: "Carcinoid syndrome nursing: flushing, diarrhea, octreotide injection teaching for neuroendocrine tumors", tier: "np", category: "endocrine", primaryKeyword: "carcinoid syndrome nursing" },
  { topic: "Hyperkalemia from diabetes nursing: potassium monitoring, insulin-glucose, kayexalate, and ECG changes", tier: "rn", category: "endocrine", primaryKeyword: "diabetic hyperkalemia nursing" },
  { topic: "Gestational diabetes nursing management: glucose monitoring, dietary counselling, and fetal monitoring", tier: "rn", category: "endocrine", primaryKeyword: "gestational diabetes nursing" },
  { topic: "Thyroid cancer nursing: post-thyroidectomy hypocalcemia, radioactive iodine isolation, and follow-up", tier: "rn", category: "endocrine", primaryKeyword: "thyroid cancer nursing care" },
  { topic: "Pheochromocytoma nursing: hypertensive crisis triggers, pre-operative alpha-blockade, surgical preparation", tier: "np", category: "endocrine", primaryKeyword: "pheochromocytoma nursing" },
  { topic: "Metformin nursing teaching: GI side effects, lactic acidosis risk, contrast dye hold protocols", tier: "rn", category: "endocrine", primaryKeyword: "metformin nursing teaching" },
];

// ── 4. Neurological (20) ──────────────────────────────────────────────────

const NEUROLOGICAL: ClinicalBlogTopicEntry[] = [
  { topic: "Ischemic stroke nursing care: FAST recognition, tPA window, post-thrombolysis monitoring, swallowing assessment", tier: "rn", category: "neuro", primaryKeyword: "ischemic stroke nursing care" },
  { topic: "Increased intracranial pressure ICP nursing: Cushing's triad, head positioning, osmotic therapy monitoring", tier: "rn", category: "neuro", primaryKeyword: "increased icp nursing" },
  { topic: "Seizure nursing management: seizure precautions, status epilepticus protocol, and anticonvulsant teaching", tier: "rn", category: "neuro", primaryKeyword: "seizure nursing interventions" },
  { topic: "Traumatic brain injury TBI nursing: GCS monitoring, secondary injury prevention, and family education", tier: "rn", category: "neuro", primaryKeyword: "traumatic brain injury nursing" },
  { topic: "Guillain-Barré syndrome nursing: ascending paralysis, respiratory failure monitoring, plasmapheresis care", tier: "rn", category: "neuro", primaryKeyword: "guillain barre syndrome nursing" },
  { topic: "Multiple sclerosis MS nursing: exacerbation triggers, fatigue management, bladder care, and disease-modifying therapy", tier: "rn", category: "neuro", primaryKeyword: "multiple sclerosis nursing care" },
  { topic: "Parkinson disease nursing: medication timing, aspiration risk, fall prevention, and caregiver education", tier: "rn", category: "neuro", primaryKeyword: "parkinson disease nursing" },
  { topic: "Myasthenia gravis nursing: cholinergic crisis vs myasthenic crisis distinction and safe medication list", tier: "np", category: "neuro", primaryKeyword: "myasthenia gravis nursing" },
  { topic: "Spinal cord injury nursing: autonomic dysreflexia recognition, bowel bladder program, skin integrity", tier: "rn", category: "neuro", primaryKeyword: "spinal cord injury nursing" },
  { topic: "Meningitis vs encephalitis nursing: lumbar puncture prep, isolation precautions, and antibiotic timing", tier: "rn", category: "neuro", primaryKeyword: "meningitis nursing care" },
  { topic: "Dementia vs delirium nursing: acute confusion assessment, safety, sundowning, and caregiver support", tier: "rn", category: "neuro", primaryKeyword: "dementia vs delirium nursing" },
  { topic: "Subarachnoid hemorrhage nursing: nimodipine administration, cerebral vasospasm monitoring, rebleed prevention", tier: "rn", category: "neuro", primaryKeyword: "subarachnoid hemorrhage nursing" },
  { topic: "Brain tumor nursing: pre and post craniotomy care, seizure prophylaxis, and steroid side effect monitoring", tier: "rn", category: "neuro", primaryKeyword: "brain tumor nursing care" },
  { topic: "Trigeminal neuralgia nursing: pain triggers, carbamazepine teaching, and surgical option counselling", tier: "np", category: "neuro", primaryKeyword: "trigeminal neuralgia nursing" },
  { topic: "Peripheral neuropathy nursing assessment: sensory testing, fall prevention, and pain management", tier: "rn", category: "neuro", primaryKeyword: "peripheral neuropathy nursing" },
  { topic: "ALS amyotrophic lateral sclerosis nursing: respiratory planning, communication aids, palliative support", tier: "rn", category: "neuro", primaryKeyword: "als nursing care" },
  { topic: "Huntington disease nursing: chorea safety, cognitive decline, and advance care planning", tier: "np", category: "neuro", primaryKeyword: "huntington disease nursing" },
  { topic: "Post-stroke rehabilitation nursing: swallowing assessment, aphasia communication, ADL retraining", tier: "rn", category: "neuro", primaryKeyword: "post stroke rehabilitation nursing" },
  { topic: "Lumbar puncture nursing: positioning, specimen labeling, post-procedure headache, and normal values", tier: "rn", category: "neuro", primaryKeyword: "lumbar puncture nursing" },
  { topic: "Neurogenic bladder nursing: intermittent catheterization teaching, UTI prevention, and autonomic symptoms", tier: "rn", category: "neuro", primaryKeyword: "neurogenic bladder nursing" },
];

// ── 5. Renal (20) ─────────────────────────────────────────────────────────

const RENAL: ClinicalBlogTopicEntry[] = [
  { topic: "Acute kidney injury AKI nursing: prerenal vs intrarenal vs postrenal causes, fluids, and output monitoring", tier: "rn", category: "renal", primaryKeyword: "acute kidney injury nursing" },
  { topic: "Chronic kidney disease CKD stages nursing: dietary restrictions, fluid management, and dialysis preparation", tier: "rn", category: "renal", primaryKeyword: "chronic kidney disease nursing" },
  { topic: "Hemodialysis nursing care: AV fistula assessment, fluid removal targets, and intradialytic hypotension", tier: "rn", category: "renal", primaryKeyword: "hemodialysis nursing care" },
  { topic: "Peritoneal dialysis nursing: catheter care, peritonitis recognition, and patient self-care education", tier: "rn", category: "renal", primaryKeyword: "peritoneal dialysis nursing" },
  { topic: "Hyperkalemia nursing: ECG changes, insulin-glucose drip, Kayexalate, and diet counselling", tier: "rn", category: "renal", primaryKeyword: "hyperkalemia nursing interventions" },
  { topic: "Nephrotic syndrome nursing: edema management, albumin infusion, infection risk, and proteinuria teaching", tier: "rn", category: "renal", primaryKeyword: "nephrotic syndrome nursing" },
  { topic: "Urinary tract infection UTI nursing: prevention strategies, antibiotic teaching, and catheter care", tier: "rn", category: "renal", primaryKeyword: "uti nursing interventions" },
  { topic: "Kidney stone nephrolithiasis nursing: pain management, strain urine, IV fluids, and dietary prevention", tier: "rn", category: "renal", primaryKeyword: "kidney stones nursing care" },
  { topic: "Glomerulonephritis nursing: blood pressure monitoring, hematuria assessment, and fluid restriction", tier: "rn", category: "renal", primaryKeyword: "glomerulonephritis nursing" },
  { topic: "Renal transplant nursing care: immunosuppressant teaching, rejection signs, and infection prevention", tier: "rn", category: "renal", primaryKeyword: "renal transplant nursing" },
  { topic: "Polycystic kidney disease PKD nursing: hypertension management, pain control, and genetic counselling", tier: "np", category: "renal", primaryKeyword: "polycystic kidney disease nursing" },
  { topic: "ESRD end stage renal disease dietary restrictions: phosphorus, potassium, sodium, protein nursing teaching", tier: "rn", category: "renal", primaryKeyword: "esrd dietary restrictions nursing" },
  { topic: "Urinary retention nursing: bladder scanning, intermittent catheterization, and underlying cause assessment", tier: "rn", category: "renal", primaryKeyword: "urinary retention nursing" },
  { topic: "Pyelonephritis nursing: IV antibiotics, flank pain assessment, and preventing sepsis progression", tier: "rn", category: "renal", primaryKeyword: "pyelonephritis nursing care" },
  { topic: "Contrast induced nephropathy nursing prevention: pre-hydration, NAC protocol, metformin hold", tier: "rn", category: "renal", primaryKeyword: "contrast nephropathy nursing" },
  { topic: "Metabolic acidosis nursing: bicarb replacement, ventilator compensation, and cause-directed treatment", tier: "rn", category: "renal", primaryKeyword: "metabolic acidosis nursing" },
  { topic: "Hyponatremia nursing: fluid restriction, sodium correction rate, central pontine myelinolysis prevention", tier: "rn", category: "renal", primaryKeyword: "hyponatremia nursing" },
  { topic: "BUN and creatinine trends nursing: interpreting rising levels, hold medications, and provider notification", tier: "new-grad", category: "renal", primaryKeyword: "bun creatinine nursing interpretation" },
  { topic: "Bladder cancer nursing care: cystoscopy preparation, BCG instillation teaching, and hematuria monitoring", tier: "rn", category: "renal", primaryKeyword: "bladder cancer nursing" },
  { topic: "Urosepsis nursing: sepsis bundle, broad spectrum antibiotics, source control, and hemodynamic support", tier: "rn", category: "renal", primaryKeyword: "urosepsis nursing care" },
];

// ── 6. Gastrointestinal (20) ──────────────────────────────────────────────

const GASTROINTESTINAL: ClinicalBlogTopicEntry[] = [
  { topic: "Upper GI bleed nursing: hematemesis assessment, NG tube care, endoscopy preparation, and hemodynamic monitoring", tier: "rn", category: "gi", primaryKeyword: "upper gi bleed nursing" },
  { topic: "Lower GI bleed vs upper GI bleed nursing assessment and priority interventions comparison", tier: "rn", category: "gi", primaryKeyword: "lower gi bleed nursing" },
  { topic: "Bowel obstruction nursing: NG tube management, abdominal assessment, surgical preparation", tier: "rn", category: "gi", primaryKeyword: "bowel obstruction nursing" },
  { topic: "Crohn disease vs ulcerative colitis nursing: pathophysiology, flare management, and stoma care comparison", tier: "rn", category: "gi", primaryKeyword: "crohn vs ulcerative colitis nursing" },
  { topic: "Liver cirrhosis nursing: ascites management, hepatic encephalopathy prevention, variceal bleed risk", tier: "rn", category: "gi", primaryKeyword: "liver cirrhosis nursing care" },
  { topic: "Hepatic encephalopathy nursing: lactulose administration, ammonia reduction, and neurological monitoring", tier: "rn", category: "gi", primaryKeyword: "hepatic encephalopathy nursing" },
  { topic: "Acute pancreatitis nursing: NPO, pain management, fluid resuscitation, and complication monitoring", tier: "rn", category: "gi", primaryKeyword: "acute pancreatitis nursing" },
  { topic: "Cholecystitis and cholecystectomy nursing: pre-op care, laparoscopic vs open, and post-op fat restriction", tier: "rn", category: "gi", primaryKeyword: "cholecystitis nursing care" },
  { topic: "Colostomy and ileostomy nursing: stoma care, pouch change teaching, output monitoring, and skin protection", tier: "rn", category: "gi", primaryKeyword: "ostomy nursing care" },
  { topic: "Celiac disease nursing: gluten-free diet teaching, malabsorption, and anemia monitoring", tier: "rn", category: "gi", primaryKeyword: "celiac disease nursing" },
  { topic: "Esophageal varices nursing: vasopressin drip, balloon tamponade, aspiration prevention in cirrhosis", tier: "rn", category: "gi", primaryKeyword: "esophageal varices nursing" },
  { topic: "C. diff Clostridium difficile nursing: contact precautions, Flagyl vs vancomycin, hand hygiene", tier: "rn", category: "gi", primaryKeyword: "c diff nursing interventions" },
  { topic: "GERD vs peptic ulcer disease nursing: H2 blockers, PPIs, lifestyle modifications, and H. pylori treatment", tier: "rn", category: "gi", primaryKeyword: "gerd peptic ulcer nursing" },
  { topic: "Enteral feeding NG tube nursing: residual checks, aspiration prevention, and medication administration", tier: "rn", category: "gi", primaryKeyword: "enteral feeding nursing" },
  { topic: "Total parenteral nutrition TPN nursing: central line care, glucose monitoring, and infection prevention", tier: "rn", category: "gi", primaryKeyword: "tpn nursing care" },
  { topic: "Hepatitis B and C nursing: transmission precautions, antiviral therapy, and liver function monitoring", tier: "rn", category: "gi", primaryKeyword: "hepatitis nursing care" },
  { topic: "Colorectal cancer nursing care: bowel prep, surgical recovery, adjuvant therapy, and stoma education", tier: "rn", category: "gi", primaryKeyword: "colorectal cancer nursing" },
  { topic: "Gastroparesis nursing: small frequent meals, prokinetic agents, glycemic control, and motility testing", tier: "np", category: "gi", primaryKeyword: "gastroparesis nursing care" },
  { topic: "Abdominal compartment syndrome nursing: bladder pressure, decompression, ventilator adjustments", tier: "rn", category: "gi", primaryKeyword: "abdominal compartment syndrome nursing" },
  { topic: "Diverticulitis nursing: bowel rest, antibiotic therapy, diet progression, and recurrence prevention", tier: "rn", category: "gi", primaryKeyword: "diverticulitis nursing care" },
];

// ── 7. Pharmacology (20) ──────────────────────────────────────────────────

const PHARMACOLOGY: ClinicalBlogTopicEntry[] = [
  { topic: "High alert medications nursing: insulin, heparin, opioids, KCl — the five rights and double-check protocols", tier: "rn", category: "pharmacology", primaryKeyword: "high alert medications nursing" },
  { topic: "Opioid analgesics nursing: morphine vs hydromorphone, respiratory depression monitoring, reversal with naloxone", tier: "rn", category: "pharmacology", primaryKeyword: "opioid nursing monitoring" },
  { topic: "Beta blockers nursing: atenolol, metoprolol — bradycardia monitoring, hold parameters, and patient teaching", tier: "rn", category: "pharmacology", primaryKeyword: "beta blockers nursing" },
  { topic: "ACE inhibitors vs ARBs nursing: kidney protection, angioedema warning, and potassium monitoring", tier: "rn", category: "pharmacology", primaryKeyword: "ace inhibitors arbs nursing" },
  { topic: "Diuretics nursing: furosemide vs spironolactone — electrolyte monitoring, output tracking, ototoxicity risk", tier: "rn", category: "pharmacology", primaryKeyword: "diuretics nursing monitoring" },
  { topic: "Anticoagulants nursing comparison: heparin, enoxaparin, warfarin, and direct oral anticoagulants NCLEX", tier: "rn", category: "pharmacology", primaryKeyword: "anticoagulants nursing nclex" },
  { topic: "Antibiotics nursing overview: penicillins, cephalosporins, vancomycin trough monitoring, and allergy cross-reactivity", tier: "rn", category: "pharmacology", primaryKeyword: "antibiotics nursing monitoring" },
  { topic: "Corticosteroids nursing: adrenal suppression, blood glucose spikes, infection masking, and taper teaching", tier: "rn", category: "pharmacology", primaryKeyword: "corticosteroids nursing" },
  { topic: "Chemotherapy safety nursing: PPE, extravasation, neutropenia precautions, and antiemetic timing", tier: "rn", category: "pharmacology", primaryKeyword: "chemotherapy safety nursing" },
  { topic: "Antipsychotics nursing: EPS, tardive dyskinesia, NMS recognition, and metabolic monitoring", tier: "rn", category: "pharmacology", primaryKeyword: "antipsychotics nursing" },
  { topic: "Antidepressants SSRI nursing: serotonin syndrome, suicidal ideation monitoring, and therapeutic lag teaching", tier: "rn", category: "pharmacology", primaryKeyword: "ssri nursing monitoring" },
  { topic: "Lithium nursing: narrow therapeutic index, toxicity signs, sodium intake teaching, and renal function monitoring", tier: "rn", category: "pharmacology", primaryKeyword: "lithium nursing toxicity" },
  { topic: "Digoxin nursing: therapeutic vs toxic levels, hypokalemia risk, and apical pulse check before administration", tier: "rn", category: "pharmacology", primaryKeyword: "digoxin nursing" },
  { topic: "IV push medications nursing: compatible solutions, rate limits, flush technique, and adverse reaction monitoring", tier: "rn", category: "pharmacology", primaryKeyword: "iv push medications nursing" },
  { topic: "Herbal supplements drug interactions nursing: warfarin, St. John's wort, ginkgo — patient assessment", tier: "rn", category: "pharmacology", primaryKeyword: "herbal supplements drug interactions nursing" },
  { topic: "Medication reconciliation nursing: admission history, hold medications, high-risk transitions of care", tier: "rn", category: "pharmacology", primaryKeyword: "medication reconciliation nursing" },
  { topic: "Controlled substances nursing: Schedule II documentation, diversion prevention, and waste protocol", tier: "rn", category: "pharmacology", primaryKeyword: "controlled substances nursing" },
  { topic: "Pediatric medication dosing nursing: weight-based calculations, SBAR for prescriber clarity, and double checks", tier: "rn", category: "pharmacology", primaryKeyword: "pediatric medication dosing nursing" },
  { topic: "Elderly polypharmacy nursing: Beers criteria, fall risk medications, and deprescribing conversations", tier: "np", category: "pharmacology", primaryKeyword: "polypharmacy elderly nursing" },
  { topic: "Medication error prevention nursing: six rights, bar-code scanning, verbal order read-back, and near-miss reporting", tier: "new-grad", category: "pharmacology", primaryKeyword: "medication error prevention nursing" },
];

// ── 8. Critical Care (20) ─────────────────────────────────────────────────

const CRITICAL_CARE: ClinicalBlogTopicEntry[] = [
  { topic: "Sepsis bundle nursing: early recognition, blood cultures before antibiotics, fluid resuscitation, vasopressors", tier: "rn", category: "critical-care", primaryKeyword: "sepsis bundle nursing" },
  { topic: "ACLS review for nurses: VF, VT, pulseless electrical activity management and medication timing", tier: "rn", category: "critical-care", primaryKeyword: "acls nursing review" },
  { topic: "Central venous catheter CVC nursing: dressing change, blood draw technique, and CLABSI prevention", tier: "rn", category: "critical-care", primaryKeyword: "central line nursing care" },
  { topic: "Swan-Ganz pulmonary artery catheter nursing: wedge pressure interpretation and hemodynamic profile", tier: "rn", category: "critical-care", primaryKeyword: "pulmonary artery catheter nursing" },
  { topic: "Ventilator-associated pneumonia VAP bundle nursing: HOB elevation, oral care, and sedation vacation", tier: "rn", category: "critical-care", primaryKeyword: "vap prevention nursing bundle" },
  { topic: "ICU sedation and pain assessment nursing: RASS scale, CPOT tool, and dexmedetomidine vs propofol", tier: "rn", category: "critical-care", primaryKeyword: "icu sedation nursing" },
  { topic: "Burn injury nursing care: fluid resuscitation Parkland formula, wound care, and inhalation injury", tier: "rn", category: "critical-care", primaryKeyword: "burn injury nursing care" },
  { topic: "Massive transfusion protocol MTP nursing: blood products ratio, hypothermia, and coagulopathy prevention", tier: "rn", category: "critical-care", primaryKeyword: "massive transfusion protocol nursing" },
  { topic: "Rapid sequence intubation RSI nursing: pre-oxygenation, medication sequence, and post-intubation care", tier: "rn", category: "critical-care", primaryKeyword: "rapid sequence intubation nursing" },
  { topic: "IABP intra-aortic balloon pump nursing: inflation timing, limb assessment, and weaning criteria", tier: "rn", category: "critical-care", primaryKeyword: "iabp nursing care" },
  { topic: "Anaphylaxis nursing response: epinephrine timing, airway management, and diphenhydramine adjuncts", tier: "rn", category: "critical-care", primaryKeyword: "anaphylaxis nursing interventions" },
  { topic: "Rhabdomyolysis nursing: CK monitoring, aggressive IV hydration, urine output targets, and renal protection", tier: "rn", category: "critical-care", primaryKeyword: "rhabdomyolysis nursing care" },
  { topic: "Post-cardiac arrest targeted temperature management nursing: cooling protocols and rewarming monitoring", tier: "rn", category: "critical-care", primaryKeyword: "targeted temperature management nursing" },
  { topic: "DIC disseminated intravascular coagulation nursing: oozing assessment, clotting factor replacement, paradox", tier: "rn", category: "critical-care", primaryKeyword: "dic nursing care" },
  { topic: "Critical care nutrition nursing: enteral vs parenteral, start timing, glucose control targets in ICU", tier: "rn", category: "critical-care", primaryKeyword: "icu nutrition nursing" },
  { topic: "ICU delirium prevention nursing: ABCDEF bundle, sleep hygiene, early mobility, and family engagement", tier: "rn", category: "critical-care", primaryKeyword: "icu delirium prevention nursing" },
  { topic: "Arterial line nursing: blood pressure waveform interpretation, blood draw technique, and site care", tier: "rn", category: "critical-care", primaryKeyword: "arterial line nursing care" },
  { topic: "Trauma nursing primary and secondary survey: ABCDE assessment, hemorrhage control, and disability check", tier: "rn", category: "critical-care", primaryKeyword: "trauma nursing assessment" },
  { topic: "Palliative care in ICU nursing: comfort measures, goals of care conversations, and family support", tier: "rn", category: "critical-care", primaryKeyword: "icu palliative care nursing" },
  { topic: "ECMO extracorporeal membrane oxygenation nursing: anticoagulation, circuit monitoring, and limb perfusion", tier: "rn", category: "critical-care", primaryKeyword: "ecmo nursing care" },
];

// ── 9. Pediatrics (20) ────────────────────────────────────────────────────

const PEDIATRICS: ClinicalBlogTopicEntry[] = [
  { topic: "Pediatric respiratory distress nursing: accessory muscle use, stridor vs wheeze, and position interventions", tier: "rn", category: "pediatrics", primaryKeyword: "pediatric respiratory distress nursing" },
  { topic: "Pediatric dehydration nursing: fontanelle assessment, skin turgor, rehydration, and urine output monitoring", tier: "rn", category: "pediatrics", primaryKeyword: "pediatric dehydration nursing" },
  { topic: "RSV bronchiolitis nursing: high-flow oxygen, suction, strict droplet precautions, and parental education", tier: "rn", category: "pediatrics", primaryKeyword: "rsv bronchiolitis nursing" },
  { topic: "Febrile seizure nursing: safe environment, antipyretics, parental reassurance, and recurrence education", tier: "rn", category: "pediatrics", primaryKeyword: "febrile seizure nursing" },
  { topic: "Croup nursing management: racemic epinephrine, mist therapy controversy, and observation criteria", tier: "rn", category: "pediatrics", primaryKeyword: "croup nursing care" },
  { topic: "Sickle cell crisis nursing: pain management, hydration, oxygen, and infection prevention in children", tier: "rn", category: "pediatrics", primaryKeyword: "sickle cell crisis nursing pediatric" },
  { topic: "Kawasaki disease nursing: fever monitoring, aspirin therapy, echocardiogram preparation, and IVIG infusion", tier: "rn", category: "pediatrics", primaryKeyword: "kawasaki disease nursing" },
  { topic: "Pediatric head injury nursing: GCS, AVPU, pupillary response, and safeguarding red flags", tier: "rn", category: "pediatrics", primaryKeyword: "pediatric head injury nursing" },
  { topic: "Congenital heart defects nursing: acyanotic vs cyanotic classification, tet spells, and pre-surgical care", tier: "rn", category: "pediatrics", primaryKeyword: "congenital heart defects nursing" },
  { topic: "Pediatric diabetes type 1 nursing: sick day rules, DKA prevention, school management plans", tier: "rn", category: "pediatrics", primaryKeyword: "pediatric type 1 diabetes nursing" },
  { topic: "Child abuse recognition nursing: mandatory reporting, documentation, bruising pattern assessment", tier: "rn", category: "pediatrics", primaryKeyword: "child abuse nursing assessment" },
  { topic: "Neonatal jaundice phototherapy nursing: bilirubin thresholds, eye protection, hydration, and parent teaching", tier: "rn", category: "pediatrics", primaryKeyword: "neonatal jaundice nursing" },
  { topic: "Pediatric sepsis nursing: PEWS score, early antibiotics, fluid bolus, and PICU escalation criteria", tier: "rn", category: "pediatrics", primaryKeyword: "pediatric sepsis nursing" },
  { topic: "Intussusception nursing: currant jelly stool, abdominal assessment, barium enema preparation, and surgery", tier: "rn", category: "pediatrics", primaryKeyword: "intussusception nursing care" },
  { topic: "Appendicitis pediatric nursing: rebound tenderness, NPO, surgical preparation, and post-op wound care", tier: "rn", category: "pediatrics", primaryKeyword: "pediatric appendicitis nursing" },
  { topic: "Childhood asthma nursing management: peak flow monitoring, spacer technique, and school action plan", tier: "rn", category: "pediatrics", primaryKeyword: "childhood asthma nursing" },
  { topic: "Pediatric medication safety nursing: weight-based dosing, double checks, oral syringes, and family verification", tier: "rn", category: "pediatrics", primaryKeyword: "pediatric medication safety nursing" },
  { topic: "Cerebral palsy nursing care: spasticity management, nutrition support, positioning, and communication aids", tier: "rn", category: "pediatrics", primaryKeyword: "cerebral palsy nursing care" },
  { topic: "NICU preterm nursing: thermoregulation, feeding milestones, skin care, kangaroo care benefits", tier: "rn", category: "pediatrics", primaryKeyword: "nicu preterm nursing care" },
  { topic: "Autism spectrum disorder ASD nursing: sensory adaptations, procedural preparation, and family-centred care", tier: "rn", category: "pediatrics", primaryKeyword: "autism nursing care" },
];

// ── 10. Mental Health (20) ────────────────────────────────────────────────

const MENTAL_HEALTH: ClinicalBlogTopicEntry[] = [
  { topic: "Therapeutic communication nursing: active listening, open-ended questions, and avoiding advice traps", tier: "rn", category: "mental-health", primaryKeyword: "therapeutic communication nursing" },
  { topic: "Suicide risk assessment nursing: Columbia Protocol, safety planning, and mandatory documentation", tier: "rn", category: "mental-health", primaryKeyword: "suicide risk assessment nursing" },
  { topic: "Schizophrenia nursing care: positive vs negative symptoms, antipsychotic adherence, and relapse prevention", tier: "rn", category: "mental-health", primaryKeyword: "schizophrenia nursing care" },
  { topic: "Bipolar disorder nursing: manic episode management, lithium monitoring, and safety in acute settings", tier: "rn", category: "mental-health", primaryKeyword: "bipolar disorder nursing" },
  { topic: "Major depressive disorder nursing: PHQ-9 screening, antidepressant teaching, and ECT nursing care", tier: "rn", category: "mental-health", primaryKeyword: "major depression nursing care" },
  { topic: "Anxiety disorders nursing: GABA mechanism, benzodiazepine fall risk in elderly, and non-pharmacological management", tier: "rn", category: "mental-health", primaryKeyword: "anxiety disorder nursing" },
  { topic: "Alcohol withdrawal nursing: CIWA scale, seizure risk, thiamine administration, and delirium tremens", tier: "rn", category: "mental-health", primaryKeyword: "alcohol withdrawal nursing" },
  { topic: "Opioid use disorder nursing: ORT screening, buprenorphine induction, naloxone kit teaching, and stigma reduction", tier: "rn", category: "mental-health", primaryKeyword: "opioid use disorder nursing" },
  { topic: "PTSD nursing assessment and trauma-informed care principles for inpatient psychiatric settings", tier: "rn", category: "mental-health", primaryKeyword: "ptsd nursing trauma informed care" },
  { topic: "Eating disorders nursing: anorexia vs bulimia vital sign monitoring, refeeding syndrome, and therapeutic milieu", tier: "rn", category: "mental-health", primaryKeyword: "eating disorders nursing" },
  { topic: "De-escalation techniques nursing: verbal calming, environmental modifications, and least restrictive approach", tier: "rn", category: "mental-health", primaryKeyword: "de-escalation nursing techniques" },
  { topic: "Restraint use nursing: legal requirements, 1:1 monitoring, circulation checks, and documentation", tier: "rn", category: "mental-health", primaryKeyword: "restraint nursing legal" },
  { topic: "Psychiatric emergency nursing: excited delirium, agitated patient approach, and medical clearance protocol", tier: "rn", category: "mental-health", primaryKeyword: "psychiatric emergency nursing" },
  { topic: "Borderline personality disorder nursing: splitting behavior recognition, limit setting, and consistent team communication", tier: "rn", category: "mental-health", primaryKeyword: "borderline personality disorder nursing" },
  { topic: "Grief and loss nursing: Kübler-Ross stages, complicated grief, and therapeutic presence", tier: "rn", category: "mental-health", primaryKeyword: "grief nursing interventions" },
  { topic: "Mental health in primary care nursing: PHQ-9, GAD-7, collaborative care model, and referral criteria", tier: "np", category: "mental-health", primaryKeyword: "mental health primary care nursing" },
  { topic: "Psychosis first episode nursing: medication initiation, psychoeducation, and community support planning", tier: "rn", category: "mental-health", primaryKeyword: "first episode psychosis nursing" },
  { topic: "Self-harm nursing assessment: wound care, no-harm contract, therapeutic alliance, and family notification", tier: "rn", category: "mental-health", primaryKeyword: "self harm nursing assessment" },
  { topic: "Substance abuse motivational interviewing nursing: FRAMES approach, ambivalence, and change talk", tier: "rn", category: "mental-health", primaryKeyword: "motivational interviewing nursing" },
  { topic: "Co-occurring disorders dual diagnosis nursing: integrated treatment, sequential vs parallel approach", tier: "rn", category: "mental-health", primaryKeyword: "dual diagnosis nursing care" },
];

// ── Consolidated catalog ──────────────────────────────────────────────────

export const LONGTAIL_200_CLINICAL_TOPIC_CATALOG: readonly ClinicalBlogTopicEntry[] = [
  ...CARDIOVASCULAR,
  ...RESPIRATORY,
  ...ENDOCRINE,
  ...NEUROLOGICAL,
  ...RENAL,
  ...GASTROINTESTINAL,
  ...PHARMACOLOGY,
  ...CRITICAL_CARE,
  ...PEDIATRICS,
  ...MENTAL_HEALTH,
];

export const LONGTAIL_200_CATEGORY_COUNTS = {
  cardiovascular: CARDIOVASCULAR.length,
  respiratory: RESPIRATORY.length,
  endocrine: ENDOCRINE.length,
  neuro: NEUROLOGICAL.length,
  renal: RENAL.length,
  gi: GASTROINTESTINAL.length,
  pharmacology: PHARMACOLOGY.length,
  "critical-care": CRITICAL_CARE.length,
  pediatrics: PEDIATRICS.length,
  "mental-health": MENTAL_HEALTH.length,
} as const;

if (LONGTAIL_200_CLINICAL_TOPIC_CATALOG.length !== 200) {
  throw new Error(
    `longtail-200-clinical-topic-catalog: expected exactly 200 entries, got ${LONGTAIL_200_CLINICAL_TOPIC_CATALOG.length}`,
  );
}
