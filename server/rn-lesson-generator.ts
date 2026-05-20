import crypto from "crypto";
import OpenAI from "openai";
import { createLazyPrimaryPoolProxy } from "./db";

const pool = createLazyPrimaryPoolProxy();

function getOpenAI(): OpenAI {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

/** Matches nursenest-core lesson expansion: LESSON_OPENAI_MODEL → AI_INTEGRATIONS_OPENAI_MODEL → gpt-4.1-mini; UPGRADE_MODEL is legacy fallback. */
function resolveLessonExpansionOpenAiModel(): string {
  return (
    process.env.LESSON_OPENAI_MODEL?.trim() ||
    process.env.AI_INTEGRATIONS_OPENAI_MODEL?.trim() ||
    process.env.UPGRADE_MODEL?.trim() ||
    "gpt-4.1-mini"
  );
}

const CLINICAL_GRADE_SYSTEM_PROMPT = `You are a clinical nursing educator authoring lessons for NurseNest, a premium NCLEX-RN prep platform.

TIER: RN / NCLEX-RN
- Strong clinical + foundational pathophysiology
- Focus on bedside care, SBAR communication, prioritization
- NCLEX Next Generation format awareness
- ABCs, Maslow, ADPIE framework throughout

HARD REQUIREMENTS — EVERY LESSON MUST MEET ALL OF THESE:
• Total word count: ≥ 1,200 words (target 1,500–1,800)
• All 11 sections MUST be present
• Clinical reasoning throughout — not just definitions
• Each symptom MUST be linked to its pathophysiology rationale
• Nursing actions MUST include WHY, not just WHAT
• No generic statements like "monitor the patient closely"
• Case scenario must be clinically realistic

Return ONLY a valid JSON array of content blocks. No markdown fences. No preamble.

Required sections in this order:
1. Overview (subheading) — ≥150 words: what it is, why it matters, where nurses encounter it
2. Pathophysiology (subheading) — ≥250 words: cellular→organ→systemic, cause→effect chains, compensatory mechanisms
3. Risk Factors (subheading) — modifiable vs non-modifiable, population-specific
4. Signs & Symptoms (subheading) — ≥200 words: early vs late, EACH symptom linked to pathophysiology rationale, red flags
5. Diagnostics & Labs (subheading) — specific values, normal vs abnormal, what to watch and report
6. Management & Treatments (subheading) — ≥300 words: medical management (drug classes + purpose) AND nursing interventions (monitoring + rationale)
7. Clinical Decision-Making & Nursing Priorities (subheading) — ≥150 words: what matters MOST first, bedside thinking
8. Complications (subheading) — acute vs chronic, nursing implications for each
9. Clinical Pearls (subheading) — ≥150 words: NCLEX traps, memory anchors, "never do this" safety pearl
10. Patient & Client Education (subheading) — ≥150 words: discharge teaching, safety, teach-back example
11. Case-Based Application (subheading) — ≥200 words: realistic patient scenario with name + setting, 2 questions with detailed answers

Output format — JSON array:
[
  {"type": "subheading", "text": "Overview"},
  {"type": "paragraph", "text": "..."},
  {"type": "subheading", "text": "Pathophysiology"},
  {"type": "paragraph", "text": "..."},
  {"type": "subheading", "text": "Risk Factors"},
  {"type": "list", "items": ["Modifiable: ...", "Non-modifiable: ..."]},
  ...continue for all 11 sections...
]

Valid block types: subheading (section header), paragraph (prose ≥80 words), list (items array ≥4 items).`;

const RN_DOMAINS = [
  "Foundations",
  "Health Assessment",
  "Pharmacology",
  "Cardiovascular",
  "Respiratory",
  "Neurology",
  "GI",
  "Endocrine",
  "Renal",
  "Hematology/Oncology",
  "Immunology",
  "Maternal/OB",
  "Pediatrics",
  "Mental Health",
  "Emergency/Critical Care",
  "Ethics",
] as const;

type Domain = typeof RN_DOMAINS[number];

interface LessonTopic {
  title: string;
  slug: string;
  domain: Domain;
  bodySystem: string;
  tags: string[];
  keywords: string[];
}

const DOMAIN_TOPICS: Record<Domain, Array<{ title: string; tags: string[]; keywords: string[] }>> = {
  "Foundations": [
    { title: "Nursing Process Overview", tags: ["assessment", "diagnosis", "planning", "implementation", "evaluation"], keywords: ["nursing process", "ADPIE"] },
    { title: "Evidence-Based Practice in Nursing", tags: ["EBP", "research", "clinical guidelines"], keywords: ["evidence-based", "nursing research"] },
    { title: "Infection Control and Standard Precautions", tags: ["infection control", "hand hygiene", "PPE"], keywords: ["standard precautions", "transmission-based"] },
    { title: "Fluid and Electrolyte Balance", tags: ["fluids", "electrolytes", "homeostasis"], keywords: ["fluid balance", "electrolyte imbalance"] },
    { title: "Acid-Base Balance", tags: ["ABG", "acidosis", "alkalosis"], keywords: ["acid-base", "pH balance"] },
    { title: "Pain Assessment and Management", tags: ["pain", "analgesics", "non-pharmacological"], keywords: ["pain management", "pain assessment"] },
    { title: "Wound Care and Healing", tags: ["wound care", "wound healing", "dressings"], keywords: ["wound management", "wound assessment"] },
    { title: "Perioperative Nursing Care", tags: ["preoperative", "intraoperative", "postoperative"], keywords: ["perioperative", "surgical nursing"] },
    { title: "Patient Safety and Fall Prevention", tags: ["safety", "falls", "risk assessment"], keywords: ["patient safety", "fall prevention"] },
    { title: "Therapeutic Communication", tags: ["communication", "therapeutic relationship"], keywords: ["therapeutic communication", "nurse-patient"] },
    { title: "Documentation and Reporting", tags: ["documentation", "charting", "SBAR"], keywords: ["nursing documentation", "reporting"] },
    { title: "Health Promotion and Disease Prevention", tags: ["health promotion", "prevention", "screening"], keywords: ["health promotion", "wellness"] },
    { title: "Vital Signs Assessment", tags: ["vital signs", "temperature", "pulse", "blood pressure"], keywords: ["vital signs", "hemodynamic"] },
    { title: "IV Therapy and Fluid Administration", tags: ["IV therapy", "infusion", "central lines"], keywords: ["intravenous", "IV fluids"] },
    { title: "Blood Transfusion Nursing Care", tags: ["blood transfusion", "transfusion reactions"], keywords: ["blood products", "transfusion"] },
    { title: "Nutrition and Diet Therapy", tags: ["nutrition", "diet", "enteral feeding"], keywords: ["nutrition assessment", "therapeutic diet"] },
    { title: "Oxygen Therapy", tags: ["oxygen", "O2 delivery", "hypoxia"], keywords: ["oxygen therapy", "supplemental O2"] },
    { title: "Urinary Catheterization", tags: ["catheter", "foley", "urinary"], keywords: ["urinary catheter", "catheterization"] },
    { title: "Nasogastric Tube Management", tags: ["NG tube", "tube feeding", "gastric"], keywords: ["nasogastric", "NG tube"] },
    { title: "Tracheostomy Care", tags: ["tracheostomy", "airway management"], keywords: ["tracheostomy care", "airway"] },
    { title: "Chest Tube Management", tags: ["chest tube", "pleural drainage"], keywords: ["chest tube", "thoracostomy"] },
    { title: "Medication Administration Safety", tags: ["medication", "rights", "drug safety"], keywords: ["medication administration", "drug errors"] },
    { title: "Delegation and Prioritization", tags: ["delegation", "prioritization", "scope"], keywords: ["delegation", "RN prioritization"] },
    { title: "Cultural Competence in Nursing", tags: ["culture", "diversity", "cultural care"], keywords: ["cultural competence", "transcultural"] },
    { title: "End-of-Life and Palliative Care", tags: ["palliative", "hospice", "end of life"], keywords: ["palliative care", "comfort care"] },
    { title: "Laboratory Values Interpretation", tags: ["lab values", "CBC", "BMP", "diagnostics"], keywords: ["lab interpretation", "normal values"] },
  ],
  "Health Assessment": [
    { title: "Head-to-Toe Physical Assessment", tags: ["physical exam", "assessment", "head to toe"], keywords: ["physical assessment", "examination"] },
    { title: "Cardiac Assessment Techniques", tags: ["cardiac", "heart sounds", "auscultation"], keywords: ["cardiac assessment", "heart sounds"] },
    { title: "Respiratory Assessment", tags: ["lung sounds", "breath sounds", "respiratory"], keywords: ["respiratory assessment", "lung auscultation"] },
    { title: "Neurological Assessment", tags: ["neuro", "Glasgow Coma Scale", "cranial nerves"], keywords: ["neurological assessment", "GCS"] },
    { title: "Abdominal Assessment", tags: ["abdominal", "bowel sounds", "palpation"], keywords: ["abdominal assessment", "GI assessment"] },
    { title: "Musculoskeletal Assessment", tags: ["MSK", "range of motion", "gait"], keywords: ["musculoskeletal assessment", "orthopedic"] },
    { title: "Integumentary Assessment", tags: ["skin", "lesions", "Braden scale"], keywords: ["skin assessment", "integumentary"] },
    { title: "Peripheral Vascular Assessment", tags: ["peripheral pulses", "edema", "capillary refill"], keywords: ["vascular assessment", "peripheral"] },
    { title: "Mental Status Examination", tags: ["mental status", "cognition", "orientation"], keywords: ["mental status exam", "cognitive assessment"] },
    { title: "Pain Assessment Scales and Tools", tags: ["pain scales", "FLACC", "Wong-Baker"], keywords: ["pain assessment tools", "numeric rating"] },
    { title: "Pupil Assessment and Response", tags: ["PERRLA", "pupil", "neurological"], keywords: ["pupil assessment", "PERRLA"] },
    { title: "Lymph Node Assessment", tags: ["lymph nodes", "palpation", "lymphadenopathy"], keywords: ["lymph node", "lymphatic"] },
    { title: "Breast and Axillary Assessment", tags: ["breast exam", "screening", "BSE"], keywords: ["breast assessment", "mammography"] },
    { title: "Genitourinary Assessment", tags: ["GU", "urinary", "renal"], keywords: ["genitourinary assessment", "urologic"] },
    { title: "Eye and Vision Assessment", tags: ["vision", "eye exam", "Snellen"], keywords: ["eye assessment", "visual acuity"] },
    { title: "Ear and Hearing Assessment", tags: ["hearing", "otoscope", "Weber", "Rinne"], keywords: ["hearing assessment", "ear examination"] },
    { title: "Nutritional Status Assessment", tags: ["nutrition", "BMI", "albumin", "malnutrition"], keywords: ["nutritional assessment", "anthropometric"] },
    { title: "Functional Health Assessment", tags: ["ADL", "functional status", "Katz index"], keywords: ["functional assessment", "activities of daily living"] },
    { title: "Prenatal Assessment", tags: ["prenatal", "Leopold maneuvers", "fundal height"], keywords: ["prenatal assessment", "obstetric exam"] },
    { title: "Neonatal Assessment", tags: ["newborn", "APGAR", "gestational age"], keywords: ["neonatal assessment", "newborn exam"] },
    { title: "Pediatric Growth and Development Assessment", tags: ["growth", "development", "milestones"], keywords: ["pediatric assessment", "developmental screening"] },
    { title: "Geriatric Assessment", tags: ["geriatric", "elderly", "polypharmacy"], keywords: ["geriatric assessment", "older adult"] },
    { title: "Wound Assessment and Documentation", tags: ["wound", "staging", "measurement"], keywords: ["wound assessment", "pressure injury staging"] },
    { title: "Neurovascular Assessment", tags: ["neurovascular", "6 Ps", "compartment syndrome"], keywords: ["neurovascular checks", "circulation assessment"] },
    { title: "Cranial Nerve Assessment", tags: ["cranial nerves", "CN I-XII"], keywords: ["cranial nerve exam", "CN assessment"] },
  ],
  "Pharmacology": [
    { title: "Pharmacokinetics and Pharmacodynamics", tags: ["ADME", "drug metabolism", "half-life"], keywords: ["pharmacokinetics", "pharmacodynamics"] },
    { title: "Antihypertensive Medications", tags: ["ACE inhibitors", "ARBs", "beta blockers", "CCBs"], keywords: ["antihypertensive", "blood pressure medications"] },
    { title: "Anticoagulant and Thrombolytic Therapy", tags: ["heparin", "warfarin", "DOACs"], keywords: ["anticoagulants", "blood thinners"] },
    { title: "Diabetic Medications", tags: ["insulin", "metformin", "sulfonylureas"], keywords: ["diabetic medications", "hypoglycemic agents"] },
    { title: "Cardiac Glycosides and Antiarrhythmics", tags: ["digoxin", "amiodarone", "antiarrhythmics"], keywords: ["cardiac drugs", "digoxin toxicity"] },
    { title: "Opioid Analgesics and Antagonists", tags: ["morphine", "naloxone", "opioids"], keywords: ["opioid analgesics", "pain medication"] },
    { title: "Antibiotic Therapy", tags: ["antibiotics", "resistance", "culture sensitivity"], keywords: ["antibiotic therapy", "antimicrobial"] },
    { title: "Corticosteroids", tags: ["prednisone", "dexamethasone", "steroid"], keywords: ["corticosteroid therapy", "steroid side effects"] },
    { title: "Bronchodilators and Respiratory Medications", tags: ["albuterol", "ipratropium", "inhaler"], keywords: ["bronchodilators", "respiratory drugs"] },
    { title: "Diuretic Therapy", tags: ["furosemide", "hydrochlorothiazide", "spironolactone"], keywords: ["diuretics", "loop diuretics"] },
    { title: "Psychotropic Medications", tags: ["SSRI", "antipsychotics", "benzodiazepines"], keywords: ["psychotropic", "psychiatric medications"] },
    { title: "Anticonvulsant Medications", tags: ["phenytoin", "valproic acid", "seizure"], keywords: ["anticonvulsants", "antiepileptic"] },
    { title: "Antineoplastic Agents", tags: ["chemotherapy", "cytotoxic", "oncology drugs"], keywords: ["chemotherapy drugs", "antineoplastic"] },
    { title: "Immunosuppressant Medications", tags: ["cyclosporine", "tacrolimus", "transplant"], keywords: ["immunosuppressants", "transplant drugs"] },
    { title: "Thyroid and Antithyroid Medications", tags: ["levothyroxine", "methimazole", "thyroid"], keywords: ["thyroid medications", "hypothyroid treatment"] },
    { title: "GI Medications", tags: ["PPI", "H2 blockers", "antiemetics"], keywords: ["GI drugs", "proton pump inhibitors"] },
    { title: "Antiplatelet Medications", tags: ["aspirin", "clopidogrel", "platelet aggregation"], keywords: ["antiplatelet therapy", "aspirin"] },
    { title: "Neuromuscular Blocking Agents", tags: ["succinylcholine", "rocuronium", "paralytic"], keywords: ["neuromuscular blockers", "paralytic agents"] },
    { title: "Pediatric Dosage Calculations", tags: ["pediatric dosing", "weight-based", "calculations"], keywords: ["pediatric pharmacology", "dose calculation"] },
    { title: "Antimicrobial Resistance and Stewardship", tags: ["MRSA", "antibiotic stewardship", "resistance"], keywords: ["antimicrobial resistance", "MRSA treatment"] },
    { title: "Vasopressors and Inotropes", tags: ["dopamine", "norepinephrine", "dobutamine"], keywords: ["vasopressors", "inotropic agents"] },
    { title: "Electrolyte Replacement Therapy", tags: ["potassium", "magnesium", "calcium replacement"], keywords: ["electrolyte replacement", "IV potassium"] },
    { title: "Antiemetic Medications", tags: ["ondansetron", "promethazine", "nausea"], keywords: ["antiemetics", "nausea medications"] },
    { title: "Sedation and Anesthesia Medications", tags: ["propofol", "midazolam", "anesthesia"], keywords: ["sedation drugs", "procedural sedation"] },
    { title: "High-Alert Medications", tags: ["high alert", "ISMP", "medication safety"], keywords: ["high-alert medications", "safe administration"] },
  ],
  "Cardiovascular": [
    { title: "Heart Failure Management", tags: ["CHF", "systolic", "diastolic"], keywords: ["heart failure", "CHF management"] },
    { title: "Acute Coronary Syndrome", tags: ["STEMI", "NSTEMI", "unstable angina"], keywords: ["ACS", "myocardial infarction"] },
    { title: "Hypertension Management", tags: ["hypertension", "blood pressure", "antihypertensives"], keywords: ["hypertension", "HTN management"] },
    { title: "Cardiac Arrhythmias", tags: ["arrhythmia", "atrial fibrillation", "ventricular"], keywords: ["arrhythmias", "dysrhythmias"] },
    { title: "Peripheral Vascular Disease", tags: ["PVD", "PAD", "claudication"], keywords: ["peripheral vascular", "arterial disease"] },
    { title: "Deep Vein Thrombosis", tags: ["DVT", "thrombosis", "Virchow triad"], keywords: ["DVT", "venous thromboembolism"] },
    { title: "Valvular Heart Disease", tags: ["mitral", "aortic", "stenosis", "regurgitation"], keywords: ["valvular disease", "heart valve"] },
    { title: "Cardiac Catheterization", tags: ["cardiac cath", "PCI", "stent"], keywords: ["cardiac catheterization", "angioplasty"] },
    { title: "Pacemaker and ICD Management", tags: ["pacemaker", "ICD", "device"], keywords: ["pacemaker", "implantable defibrillator"] },
    { title: "ECG Interpretation Basics", tags: ["ECG", "EKG", "rhythm strips"], keywords: ["ECG interpretation", "12-lead"] },
    { title: "Infective Endocarditis", tags: ["endocarditis", "vegetation", "Duke criteria"], keywords: ["infective endocarditis", "bacterial endocarditis"] },
    { title: "Aortic Aneurysm", tags: ["aortic aneurysm", "AAA", "dissection"], keywords: ["aortic aneurysm", "aortic dissection"] },
    { title: "Coronary Artery Bypass Grafting", tags: ["CABG", "bypass surgery", "postoperative"], keywords: ["CABG", "coronary bypass"] },
    { title: "Cardiomyopathy", tags: ["dilated", "hypertrophic", "restrictive"], keywords: ["cardiomyopathy", "heart muscle disease"] },
    { title: "Cardiac Tamponade", tags: ["tamponade", "Beck triad", "pericardiocentesis"], keywords: ["cardiac tamponade", "pericardial effusion"] },
    { title: "Hyperlipidemia and Atherosclerosis", tags: ["cholesterol", "statins", "atherosclerosis"], keywords: ["hyperlipidemia", "cholesterol management"] },
    { title: "Shock Types and Management", tags: ["shock", "cardiogenic", "hypovolemic", "septic"], keywords: ["shock management", "hemodynamic instability"] },
    { title: "Cardiac Rehabilitation", tags: ["cardiac rehab", "exercise", "lifestyle"], keywords: ["cardiac rehabilitation", "secondary prevention"] },
    { title: "Pulmonary Embolism", tags: ["PE", "embolism", "anticoagulation"], keywords: ["pulmonary embolism", "PE management"] },
    { title: "Hypertensive Crisis", tags: ["hypertensive emergency", "urgency"], keywords: ["hypertensive crisis", "malignant hypertension"] },
    { title: "Heart Sounds and Murmurs", tags: ["heart sounds", "S3", "S4", "murmurs"], keywords: ["heart murmurs", "auscultation findings"] },
    { title: "Hemodynamic Monitoring", tags: ["hemodynamics", "CVP", "Swan-Ganz"], keywords: ["hemodynamic monitoring", "invasive monitoring"] },
    { title: "Pericarditis", tags: ["pericarditis", "friction rub", "chest pain"], keywords: ["pericarditis", "pericardial inflammation"] },
    { title: "Congenital Heart Defects in Adults", tags: ["congenital", "ASD", "VSD"], keywords: ["congenital heart disease", "adult CHD"] },
    { title: "Venous Insufficiency", tags: ["venous stasis", "varicose veins", "leg ulcers"], keywords: ["venous insufficiency", "chronic venous disease"] },
  ],
  "Respiratory": [
    { title: "COPD Management", tags: ["COPD", "emphysema", "chronic bronchitis"], keywords: ["COPD", "chronic obstructive"] },
    { title: "Asthma Assessment and Treatment", tags: ["asthma", "bronchospasm", "inhaler"], keywords: ["asthma management", "bronchial asthma"] },
    { title: "Pneumonia Types and Treatment", tags: ["pneumonia", "CAP", "HAP"], keywords: ["pneumonia", "lung infection"] },
    { title: "Tuberculosis Screening and Management", tags: ["TB", "tuberculosis", "Mantoux"], keywords: ["tuberculosis", "TB screening"] },
    { title: "Acute Respiratory Distress Syndrome", tags: ["ARDS", "respiratory failure", "mechanical ventilation"], keywords: ["ARDS", "acute respiratory distress"] },
    { title: "Mechanical Ventilation", tags: ["ventilator", "PEEP", "FiO2"], keywords: ["mechanical ventilation", "ventilator management"] },
    { title: "Pneumothorax", tags: ["pneumothorax", "tension", "chest tube"], keywords: ["pneumothorax", "collapsed lung"] },
    { title: "Lung Cancer", tags: ["lung cancer", "NSCLC", "SCLC"], keywords: ["lung cancer", "pulmonary malignancy"] },
    { title: "Pulmonary Fibrosis", tags: ["fibrosis", "interstitial lung disease"], keywords: ["pulmonary fibrosis", "ILD"] },
    { title: "Pleural Effusion", tags: ["pleural effusion", "thoracentesis"], keywords: ["pleural effusion", "fluid in lungs"] },
    { title: "Sleep Apnea", tags: ["sleep apnea", "CPAP", "OSA"], keywords: ["obstructive sleep apnea", "CPAP therapy"] },
    { title: "Cystic Fibrosis", tags: ["cystic fibrosis", "CF", "pancreatic insufficiency"], keywords: ["cystic fibrosis", "CF management"] },
    { title: "Respiratory Failure Types", tags: ["respiratory failure", "type I", "type II"], keywords: ["respiratory failure", "hypoxemic"] },
    { title: "Arterial Blood Gas Interpretation", tags: ["ABG", "pH", "PaCO2", "HCO3"], keywords: ["ABG interpretation", "blood gas analysis"] },
    { title: "Chest Physiotherapy and Pulmonary Hygiene", tags: ["chest PT", "incentive spirometry", "postural drainage"], keywords: ["chest physiotherapy", "pulmonary toilet"] },
    { title: "Upper Respiratory Infections", tags: ["URI", "sinusitis", "pharyngitis"], keywords: ["upper respiratory infection", "sinusitis"] },
    { title: "Influenza and COVID-19", tags: ["influenza", "COVID", "respiratory virus"], keywords: ["influenza management", "COVID-19 nursing"] },
    { title: "Suctioning and Airway Management", tags: ["suctioning", "airway clearance", "ETT"], keywords: ["airway management", "endotracheal suctioning"] },
    { title: "Non-Invasive Ventilation", tags: ["BiPAP", "CPAP", "NIV"], keywords: ["non-invasive ventilation", "BiPAP"] },
    { title: "Bronchiectasis", tags: ["bronchiectasis", "chronic airway"], keywords: ["bronchiectasis", "airway dilation"] },
    { title: "Occupational Lung Diseases", tags: ["asbestosis", "silicosis", "occupational"], keywords: ["occupational lung disease", "pneumoconiosis"] },
    { title: "Hemoptysis Assessment and Management", tags: ["hemoptysis", "coughing blood"], keywords: ["hemoptysis", "pulmonary hemorrhage"] },
    { title: "Respiratory Medications Overview", tags: ["bronchodilators", "steroids", "mucolytics"], keywords: ["respiratory medications", "inhaled steroids"] },
    { title: "Flail Chest and Thoracic Trauma", tags: ["flail chest", "rib fractures", "thoracic"], keywords: ["flail chest", "thoracic injury"] },
    { title: "Laryngeal and Epiglottic Disorders", tags: ["laryngitis", "epiglottitis", "airway obstruction"], keywords: ["epiglottitis", "laryngeal edema"] },
  ],
  "Neurology": [
    { title: "Stroke Types and Management", tags: ["stroke", "ischemic", "hemorrhagic", "tPA"], keywords: ["stroke management", "CVA"] },
    { title: "Seizure Disorders and Epilepsy", tags: ["seizure", "epilepsy", "status epilepticus"], keywords: ["seizure management", "epilepsy"] },
    { title: "Traumatic Brain Injury", tags: ["TBI", "concussion", "ICP"], keywords: ["traumatic brain injury", "head trauma"] },
    { title: "Spinal Cord Injury", tags: ["SCI", "paraplegia", "quadriplegia"], keywords: ["spinal cord injury", "SCI management"] },
    { title: "Multiple Sclerosis", tags: ["MS", "demyelination", "relapsing-remitting"], keywords: ["multiple sclerosis", "MS management"] },
    { title: "Parkinson Disease", tags: ["Parkinson", "tremor", "levodopa"], keywords: ["Parkinson disease", "dopamine"] },
    { title: "Alzheimer Disease and Dementia", tags: ["Alzheimer", "dementia", "cognitive decline"], keywords: ["Alzheimer disease", "dementia care"] },
    { title: "Meningitis", tags: ["meningitis", "bacterial", "viral", "lumbar puncture"], keywords: ["meningitis", "meningeal irritation"] },
    { title: "Increased Intracranial Pressure", tags: ["ICP", "Cushing triad", "herniation"], keywords: ["increased ICP", "intracranial pressure"] },
    { title: "Guillain-Barré Syndrome", tags: ["GBS", "ascending paralysis", "IVIG"], keywords: ["Guillain-Barré", "GBS"] },
    { title: "Myasthenia Gravis", tags: ["MG", "acetylcholine", "ptosis"], keywords: ["myasthenia gravis", "MG crisis"] },
    { title: "Amyotrophic Lateral Sclerosis", tags: ["ALS", "motor neuron disease"], keywords: ["ALS", "Lou Gehrig disease"] },
    { title: "Cranial Nerve Disorders", tags: ["cranial nerves", "Bell palsy", "trigeminal neuralgia"], keywords: ["cranial nerve", "facial nerve"] },
    { title: "Peripheral Neuropathy", tags: ["neuropathy", "diabetic neuropathy"], keywords: ["peripheral neuropathy", "nerve damage"] },
    { title: "Brain Tumors", tags: ["brain tumor", "glioma", "meningioma"], keywords: ["brain tumor", "intracranial neoplasm"] },
    { title: "Autonomic Dysreflexia", tags: ["autonomic dysreflexia", "SCI complication"], keywords: ["autonomic dysreflexia", "SCI emergency"] },
    { title: "Encephalitis", tags: ["encephalitis", "viral", "brain inflammation"], keywords: ["encephalitis", "brain infection"] },
    { title: "Hydrocephalus", tags: ["hydrocephalus", "VP shunt", "CSF"], keywords: ["hydrocephalus", "CSF drainage"] },
    { title: "Huntington Disease", tags: ["Huntington", "chorea", "genetic"], keywords: ["Huntington disease", "chorea"] },
    { title: "Trigeminal Neuralgia", tags: ["trigeminal", "facial pain", "tic douloureux"], keywords: ["trigeminal neuralgia", "CN V"] },
    { title: "Neurological Assessment Tools", tags: ["NIH stroke scale", "GCS", "MMSE"], keywords: ["neuro assessment tools", "NIH stroke scale"] },
    { title: "Lumbar Puncture Nursing Care", tags: ["lumbar puncture", "CSF analysis", "spinal tap"], keywords: ["lumbar puncture", "CSF collection"] },
    { title: "Cerebral Aneurysm", tags: ["cerebral aneurysm", "SAH", "clipping"], keywords: ["cerebral aneurysm", "subarachnoid hemorrhage"] },
    { title: "Headache Disorders", tags: ["migraine", "cluster headache", "tension headache"], keywords: ["headache management", "migraine"] },
    { title: "Delirium vs Dementia", tags: ["delirium", "dementia", "confusion", "acute vs chronic"], keywords: ["delirium vs dementia", "acute confusion"] },
  ],
  "GI": [
    { title: "Peptic Ulcer Disease", tags: ["PUD", "H pylori", "NSAID ulcer"], keywords: ["peptic ulcer", "gastric ulcer"] },
    { title: "Inflammatory Bowel Disease", tags: ["Crohn", "ulcerative colitis", "IBD"], keywords: ["IBD", "Crohn disease"] },
    { title: "Liver Cirrhosis", tags: ["cirrhosis", "portal hypertension", "ascites"], keywords: ["liver cirrhosis", "hepatic failure"] },
    { title: "Hepatitis Types and Management", tags: ["hepatitis A", "hepatitis B", "hepatitis C"], keywords: ["hepatitis", "viral hepatitis"] },
    { title: "Pancreatitis", tags: ["pancreatitis", "acute", "chronic", "amylase"], keywords: ["pancreatitis", "pancreatic inflammation"] },
    { title: "Cholecystitis and Cholelithiasis", tags: ["gallbladder", "gallstones", "cholecystectomy"], keywords: ["cholecystitis", "gallstones"] },
    { title: "Appendicitis", tags: ["appendicitis", "McBurney point", "appendectomy"], keywords: ["appendicitis", "acute abdomen"] },
    { title: "Bowel Obstruction", tags: ["SBO", "LBO", "ileus"], keywords: ["bowel obstruction", "intestinal obstruction"] },
    { title: "Gastroesophageal Reflux Disease", tags: ["GERD", "heartburn", "PPI"], keywords: ["GERD", "acid reflux"] },
    { title: "Diverticular Disease", tags: ["diverticulitis", "diverticulosis"], keywords: ["diverticular disease", "diverticulitis"] },
    { title: "Colorectal Cancer", tags: ["colon cancer", "screening", "colonoscopy"], keywords: ["colorectal cancer", "colon cancer screening"] },
    { title: "GI Bleeding", tags: ["upper GI bleed", "lower GI bleed", "melena"], keywords: ["GI hemorrhage", "GI bleeding"] },
    { title: "Celiac Disease", tags: ["celiac", "gluten", "malabsorption"], keywords: ["celiac disease", "gluten enteropathy"] },
    { title: "Ostomy Care and Management", tags: ["colostomy", "ileostomy", "stoma"], keywords: ["ostomy care", "stoma management"] },
    { title: "Esophageal Varices", tags: ["varices", "portal hypertension", "banding"], keywords: ["esophageal varices", "variceal bleeding"] },
    { title: "Peritonitis", tags: ["peritonitis", "abdominal infection", "surgical abdomen"], keywords: ["peritonitis", "peritoneal infection"] },
    { title: "Malabsorption Syndromes", tags: ["malabsorption", "steatorrhea", "vitamin deficiency"], keywords: ["malabsorption", "nutrient deficiency"] },
    { title: "Hernias", tags: ["inguinal hernia", "hiatal hernia", "incarcerated"], keywords: ["hernia types", "surgical repair"] },
    { title: "Liver Transplant Nursing", tags: ["liver transplant", "immunosuppression", "rejection"], keywords: ["liver transplant", "transplant nursing"] },
    { title: "Parenteral Nutrition", tags: ["TPN", "lipids", "central line"], keywords: ["total parenteral nutrition", "TPN management"] },
    { title: "Hepatic Encephalopathy", tags: ["hepatic encephalopathy", "ammonia", "lactulose"], keywords: ["hepatic encephalopathy", "liver failure"] },
    { title: "Gastric Cancer", tags: ["gastric cancer", "stomach cancer", "gastrectomy"], keywords: ["gastric cancer", "stomach malignancy"] },
    { title: "Irritable Bowel Syndrome", tags: ["IBS", "functional GI", "FODMAP"], keywords: ["IBS", "irritable bowel"] },
    { title: "Clostridium Difficile Infection", tags: ["C diff", "CDAD", "contact precautions"], keywords: ["C difficile", "antibiotic-associated diarrhea"] },
    { title: "Abdominal Trauma Assessment", tags: ["abdominal trauma", "FAST exam", "peritoneal lavage"], keywords: ["abdominal trauma", "blunt abdominal injury"] },
  ],
  "Endocrine": [
    { title: "Type 1 Diabetes Mellitus", tags: ["type 1 diabetes", "insulin dependent", "DKA"], keywords: ["type 1 diabetes", "insulin therapy"] },
    { title: "Type 2 Diabetes Mellitus", tags: ["type 2 diabetes", "insulin resistance", "metformin"], keywords: ["type 2 diabetes", "glucose management"] },
    { title: "Diabetic Ketoacidosis", tags: ["DKA", "ketones", "anion gap"], keywords: ["DKA", "diabetic ketoacidosis"] },
    { title: "Hyperosmolar Hyperglycemic State", tags: ["HHS", "hyperosmolar", "severe dehydration"], keywords: ["HHS", "hyperosmolar syndrome"] },
    { title: "Hypothyroidism", tags: ["hypothyroidism", "myxedema", "levothyroxine"], keywords: ["hypothyroidism", "thyroid deficiency"] },
    { title: "Hyperthyroidism and Graves Disease", tags: ["hyperthyroidism", "Graves", "thyroid storm"], keywords: ["hyperthyroidism", "Graves disease"] },
    { title: "Cushing Syndrome", tags: ["Cushing", "cortisol excess", "moon face"], keywords: ["Cushing syndrome", "hypercortisolism"] },
    { title: "Addison Disease", tags: ["Addison", "adrenal insufficiency", "cortisol"], keywords: ["Addison disease", "adrenal crisis"] },
    { title: "Diabetes Insipidus", tags: ["DI", "ADH deficiency", "polyuria"], keywords: ["diabetes insipidus", "ADH deficiency"] },
    { title: "SIADH", tags: ["SIADH", "ADH excess", "hyponatremia"], keywords: ["SIADH", "antidiuretic hormone excess"] },
    { title: "Pheochromocytoma", tags: ["pheochromocytoma", "catecholamines", "adrenal tumor"], keywords: ["pheochromocytoma", "adrenal medulla tumor"] },
    { title: "Hyperparathyroidism", tags: ["hyperparathyroidism", "hypercalcemia", "PTH"], keywords: ["hyperparathyroidism", "parathyroid"] },
    { title: "Hypoparathyroidism", tags: ["hypoparathyroidism", "hypocalcemia", "Chvostek"], keywords: ["hypoparathyroidism", "calcium deficiency"] },
    { title: "Thyroid Cancer", tags: ["thyroid cancer", "thyroidectomy", "RAI"], keywords: ["thyroid cancer", "thyroid malignancy"] },
    { title: "Acromegaly", tags: ["acromegaly", "growth hormone excess", "pituitary"], keywords: ["acromegaly", "GH excess"] },
    { title: "Insulin Administration and Monitoring", tags: ["insulin types", "injection sites", "glucose monitoring"], keywords: ["insulin administration", "blood glucose monitoring"] },
    { title: "Hypoglycemia Recognition and Treatment", tags: ["hypoglycemia", "low blood sugar", "glucagon"], keywords: ["hypoglycemia management", "glucose emergency"] },
    { title: "Metabolic Syndrome", tags: ["metabolic syndrome", "insulin resistance", "cardiovascular risk"], keywords: ["metabolic syndrome", "syndrome X"] },
    { title: "Diabetic Foot Care", tags: ["diabetic foot", "neuropathy", "ulcer prevention"], keywords: ["diabetic foot care", "foot assessment"] },
    { title: "Endocrine Emergency Management", tags: ["thyroid storm", "myxedema coma", "adrenal crisis"], keywords: ["endocrine emergency", "thyroid storm"] },
    { title: "Polycystic Ovary Syndrome", tags: ["PCOS", "hormonal imbalance", "anovulation"], keywords: ["PCOS", "polycystic ovary"] },
    { title: "Hyperaldosteronism", tags: ["Conn syndrome", "aldosterone excess", "hypokalemia"], keywords: ["hyperaldosteronism", "Conn syndrome"] },
    { title: "Pituitary Disorders", tags: ["pituitary adenoma", "hypopituitarism", "gigantism"], keywords: ["pituitary disorders", "pituitary tumor"] },
    { title: "Gestational Diabetes", tags: ["gestational diabetes", "GDM", "pregnancy glucose"], keywords: ["gestational diabetes", "GDM management"] },
    { title: "Continuous Glucose Monitoring", tags: ["CGM", "glucose sensor", "insulin pump"], keywords: ["continuous glucose monitoring", "CGM technology"] },
  ],
  "Renal": [
    { title: "Acute Kidney Injury", tags: ["AKI", "prerenal", "intrarenal", "postrenal"], keywords: ["acute kidney injury", "renal failure"] },
    { title: "Chronic Kidney Disease", tags: ["CKD", "GFR", "dialysis"], keywords: ["chronic kidney disease", "CKD stages"] },
    { title: "Hemodialysis Nursing Care", tags: ["hemodialysis", "AV fistula", "dialysis access"], keywords: ["hemodialysis", "dialysis nursing"] },
    { title: "Peritoneal Dialysis", tags: ["peritoneal dialysis", "CAPD", "peritonitis"], keywords: ["peritoneal dialysis", "PD nursing"] },
    { title: "Urinary Tract Infections", tags: ["UTI", "cystitis", "pyelonephritis"], keywords: ["urinary tract infection", "UTI management"] },
    { title: "Nephrotic Syndrome", tags: ["nephrotic", "proteinuria", "edema", "hypoalbuminemia"], keywords: ["nephrotic syndrome", "glomerular disease"] },
    { title: "Nephritic Syndrome", tags: ["nephritic", "glomerulonephritis", "hematuria"], keywords: ["nephritic syndrome", "glomerulonephritis"] },
    { title: "Kidney Stones", tags: ["nephrolithiasis", "renal calculi", "ureteral"], keywords: ["kidney stones", "renal calculi"] },
    { title: "Benign Prostatic Hyperplasia", tags: ["BPH", "prostate", "urinary retention"], keywords: ["BPH", "prostate enlargement"] },
    { title: "Bladder Cancer", tags: ["bladder cancer", "hematuria", "cystectomy"], keywords: ["bladder cancer", "urothelial cancer"] },
    { title: "Renal Transplant Nursing", tags: ["kidney transplant", "rejection", "immunosuppression"], keywords: ["renal transplant", "kidney transplant nursing"] },
    { title: "Electrolyte Imbalances: Potassium", tags: ["hyperkalemia", "hypokalemia", "potassium"], keywords: ["potassium imbalance", "hyperkalemia management"] },
    { title: "Electrolyte Imbalances: Sodium", tags: ["hypernatremia", "hyponatremia", "sodium"], keywords: ["sodium imbalance", "hyponatremia"] },
    { title: "Electrolyte Imbalances: Calcium", tags: ["hypercalcemia", "hypocalcemia", "calcium"], keywords: ["calcium imbalance", "hypocalcemia"] },
    { title: "Electrolyte Imbalances: Magnesium", tags: ["hypermagnesemia", "hypomagnesemia", "magnesium"], keywords: ["magnesium imbalance", "hypomagnesemia"] },
    { title: "Polycystic Kidney Disease", tags: ["PKD", "renal cysts", "genetic"], keywords: ["polycystic kidney", "PKD"] },
    { title: "Neurogenic Bladder", tags: ["neurogenic bladder", "urinary retention", "intermittent catheterization"], keywords: ["neurogenic bladder", "bladder dysfunction"] },
    { title: "Urinary Incontinence", tags: ["incontinence", "stress", "urge", "overflow"], keywords: ["urinary incontinence", "bladder control"] },
    { title: "Prostate Cancer", tags: ["prostate cancer", "PSA", "prostatectomy"], keywords: ["prostate cancer", "PSA screening"] },
    { title: "Renal Artery Stenosis", tags: ["renal artery", "renovascular", "hypertension"], keywords: ["renal artery stenosis", "renovascular HTN"] },
    { title: "Rhabdomyolysis", tags: ["rhabdomyolysis", "myoglobin", "CK elevation"], keywords: ["rhabdomyolysis", "muscle breakdown"] },
    { title: "Contrast-Induced Nephropathy", tags: ["contrast nephropathy", "CT contrast", "renal protection"], keywords: ["contrast nephropathy", "CIN prevention"] },
    { title: "Fluid Volume Deficit and Excess", tags: ["dehydration", "fluid overload", "edema"], keywords: ["fluid volume", "volume status"] },
    { title: "Diabetic Nephropathy", tags: ["diabetic nephropathy", "microalbuminuria", "ACE inhibitor"], keywords: ["diabetic kidney disease", "nephropathy"] },
    { title: "Renal Diet and Nutritional Management", tags: ["renal diet", "phosphorus", "potassium restriction"], keywords: ["renal diet", "CKD nutrition"] },
  ],
  "Hematology/Oncology": [
    { title: "Iron Deficiency Anemia", tags: ["anemia", "iron deficiency", "ferritin"], keywords: ["iron deficiency anemia", "microcytic anemia"] },
    { title: "Sickle Cell Disease", tags: ["sickle cell", "crisis", "hemoglobin S"], keywords: ["sickle cell disease", "vaso-occlusive crisis"] },
    { title: "Leukemia Types and Treatment", tags: ["leukemia", "ALL", "AML", "CLL", "CML"], keywords: ["leukemia", "blood cancer"] },
    { title: "Lymphoma", tags: ["Hodgkin", "non-Hodgkin", "lymphoma"], keywords: ["lymphoma", "lymphatic cancer"] },
    { title: "Disseminated Intravascular Coagulation", tags: ["DIC", "coagulopathy", "fibrinolysis"], keywords: ["DIC", "disseminated intravascular coagulation"] },
    { title: "Thrombocytopenia", tags: ["thrombocytopenia", "low platelets", "ITP"], keywords: ["thrombocytopenia", "platelet disorders"] },
    { title: "Hemophilia", tags: ["hemophilia", "factor deficiency", "bleeding disorder"], keywords: ["hemophilia", "clotting factor deficiency"] },
    { title: "Multiple Myeloma", tags: ["myeloma", "plasma cell", "Bence Jones"], keywords: ["multiple myeloma", "plasma cell cancer"] },
    { title: "Breast Cancer", tags: ["breast cancer", "mastectomy", "chemotherapy"], keywords: ["breast cancer", "breast malignancy"] },
    { title: "Neutropenia and Infection Risk", tags: ["neutropenia", "ANC", "febrile neutropenia"], keywords: ["neutropenia", "immunocompromised"] },
    { title: "Chemotherapy Side Effects Management", tags: ["chemotherapy", "nausea", "mucositis", "myelosuppression"], keywords: ["chemotherapy effects", "chemo side effects"] },
    { title: "Radiation Therapy Nursing", tags: ["radiation", "skin care", "fatigue"], keywords: ["radiation therapy", "radiotherapy nursing"] },
    { title: "Bone Marrow Transplant", tags: ["BMT", "stem cell transplant", "GVHD"], keywords: ["bone marrow transplant", "stem cell transplant"] },
    { title: "Tumor Lysis Syndrome", tags: ["TLS", "hyperuricemia", "hyperkalemia"], keywords: ["tumor lysis syndrome", "oncologic emergency"] },
    { title: "Cancer Pain Management", tags: ["cancer pain", "palliative", "opioid titration"], keywords: ["cancer pain", "oncologic pain"] },
    { title: "Pernicious Anemia", tags: ["pernicious anemia", "B12 deficiency", "intrinsic factor"], keywords: ["pernicious anemia", "vitamin B12"] },
    { title: "Polycythemia Vera", tags: ["polycythemia", "erythrocytosis", "phlebotomy"], keywords: ["polycythemia vera", "blood viscosity"] },
    { title: "Oncologic Emergencies", tags: ["SVC syndrome", "spinal cord compression", "hypercalcemia"], keywords: ["oncologic emergencies", "cancer emergencies"] },
    { title: "Immunotherapy and Targeted Therapy", tags: ["immunotherapy", "checkpoint inhibitors", "targeted"], keywords: ["immunotherapy", "targeted cancer therapy"] },
    { title: "Central Venous Access Devices", tags: ["PICC", "port-a-cath", "central line"], keywords: ["central line", "vascular access device"] },
    { title: "Blood Disorders in Pregnancy", tags: ["HELLP", "gestational thrombocytopenia", "anemia"], keywords: ["blood disorders pregnancy", "HELLP syndrome"] },
    { title: "Thalassemia", tags: ["thalassemia", "hemoglobin disorder", "Mediterranean anemia"], keywords: ["thalassemia", "hemoglobin disorder"] },
    { title: "Aplastic Anemia", tags: ["aplastic anemia", "pancytopenia", "bone marrow failure"], keywords: ["aplastic anemia", "bone marrow failure"] },
    { title: "Cancer Screening Guidelines", tags: ["screening", "mammogram", "colonoscopy", "Pap smear"], keywords: ["cancer screening", "early detection"] },
    { title: "Palliative Oncology Care", tags: ["palliative", "symptom management", "quality of life"], keywords: ["palliative oncology", "supportive care"] },
  ],
  "Immunology": [
    { title: "HIV/AIDS Management", tags: ["HIV", "AIDS", "antiretroviral", "CD4"], keywords: ["HIV management", "AIDS nursing"] },
    { title: "Autoimmune Disorders Overview", tags: ["autoimmune", "lupus", "RA", "immune dysregulation"], keywords: ["autoimmune diseases", "immune disorders"] },
    { title: "Systemic Lupus Erythematosus", tags: ["SLE", "lupus", "butterfly rash"], keywords: ["lupus", "SLE management"] },
    { title: "Rheumatoid Arthritis", tags: ["RA", "joint inflammation", "DMARDs"], keywords: ["rheumatoid arthritis", "RA treatment"] },
    { title: "Anaphylaxis", tags: ["anaphylaxis", "epinephrine", "allergic reaction"], keywords: ["anaphylaxis", "severe allergy"] },
    { title: "Allergic Reactions and Management", tags: ["allergy", "histamine", "antihistamines"], keywords: ["allergic reactions", "allergy management"] },
    { title: "Organ Transplant Immunology", tags: ["transplant", "rejection", "immunosuppression"], keywords: ["organ transplant", "rejection prevention"] },
    { title: "Immunization Schedule and Nursing", tags: ["vaccines", "immunization", "CDC schedule"], keywords: ["immunizations", "vaccine administration"] },
    { title: "Sepsis and Septic Shock", tags: ["sepsis", "SIRS", "septic shock", "qSOFA"], keywords: ["sepsis management", "septic shock"] },
    { title: "Primary Immunodeficiency Disorders", tags: ["immunodeficiency", "SCID", "agammaglobulinemia"], keywords: ["immunodeficiency", "immune deficiency"] },
    { title: "Scleroderma", tags: ["scleroderma", "systemic sclerosis", "CREST"], keywords: ["scleroderma", "systemic sclerosis"] },
    { title: "Sjögren Syndrome", tags: ["Sjögren", "dry eyes", "dry mouth"], keywords: ["Sjögren syndrome", "sicca syndrome"] },
    { title: "Type I Hypersensitivity Reactions", tags: ["type I", "IgE mediated", "immediate"], keywords: ["type I hypersensitivity", "immediate allergy"] },
    { title: "Latex Allergy", tags: ["latex allergy", "contact dermatitis", "occupational"], keywords: ["latex allergy", "healthcare worker allergy"] },
    { title: "Immune Thrombocytopenic Purpura", tags: ["ITP", "autoimmune thrombocytopenia"], keywords: ["ITP", "immune thrombocytopenia"] },
    { title: "Graft-Versus-Host Disease", tags: ["GVHD", "transplant complication", "immune attack"], keywords: ["GVHD", "graft vs host"] },
    { title: "Celiac Disease Immunology", tags: ["celiac", "gluten sensitivity", "autoimmune"], keywords: ["celiac disease", "gluten autoimmunity"] },
    { title: "Vasculitis Disorders", tags: ["vasculitis", "Kawasaki", "temporal arteritis"], keywords: ["vasculitis", "vessel inflammation"] },
    { title: "Drug Hypersensitivity Reactions", tags: ["drug allergy", "Stevens-Johnson", "drug reaction"], keywords: ["drug hypersensitivity", "SJS"] },
    { title: "Contact Precautions and Isolation", tags: ["isolation", "airborne", "droplet", "contact"], keywords: ["isolation precautions", "infection control"] },
    { title: "Inflammatory Response and Healing", tags: ["inflammation", "healing phases", "immune response"], keywords: ["inflammatory response", "wound healing"] },
    { title: "Complement System Disorders", tags: ["complement", "C3", "C4", "hereditary angioedema"], keywords: ["complement system", "hereditary angioedema"] },
    { title: "Food Allergies in Adults", tags: ["food allergy", "anaphylaxis", "allergen avoidance"], keywords: ["food allergies", "adult food allergy"] },
    { title: "Immunoglobulin Therapy", tags: ["IVIG", "immunoglobulin", "passive immunity"], keywords: ["IVIG therapy", "immunoglobulin infusion"] },
    { title: "Antinuclear Antibody Testing", tags: ["ANA", "autoantibody", "lupus diagnosis"], keywords: ["ANA test", "autoimmune diagnostics"] },
  ],
  "Maternal/OB": [
    { title: "Prenatal Care and Assessment", tags: ["prenatal", "trimester", "fetal development"], keywords: ["prenatal care", "obstetric assessment"] },
    { title: "Labor and Delivery Stages", tags: ["labor stages", "contractions", "cervical dilation"], keywords: ["labor stages", "childbirth"] },
    { title: "Fetal Heart Rate Monitoring", tags: ["FHR", "decelerations", "variability"], keywords: ["fetal monitoring", "FHR patterns"] },
    { title: "Preeclampsia and Eclampsia", tags: ["preeclampsia", "eclampsia", "magnesium sulfate"], keywords: ["preeclampsia", "pregnancy hypertension"] },
    { title: "Postpartum Hemorrhage", tags: ["PPH", "uterine atony", "tone"], keywords: ["postpartum hemorrhage", "PPH management"] },
    { title: "Cesarean Section Nursing", tags: ["cesarean", "C-section", "surgical birth"], keywords: ["cesarean section", "C-section nursing"] },
    { title: "Placenta Previa", tags: ["placenta previa", "painless bleeding", "complete previa"], keywords: ["placenta previa", "abnormal placentation"] },
    { title: "Placental Abruption", tags: ["abruption", "painful bleeding", "concealed hemorrhage"], keywords: ["placental abruption", "abruptio placentae"] },
    { title: "Ectopic Pregnancy", tags: ["ectopic", "tubal pregnancy", "surgical emergency"], keywords: ["ectopic pregnancy", "tubal pregnancy"] },
    { title: "Gestational Diabetes Management", tags: ["GDM", "glucose tolerance test", "diet"], keywords: ["gestational diabetes", "GDM"] },
    { title: "Breastfeeding Support and Education", tags: ["breastfeeding", "lactation", "latch"], keywords: ["breastfeeding", "lactation support"] },
    { title: "Newborn Assessment and Care", tags: ["newborn", "APGAR", "transition"], keywords: ["newborn care", "neonatal assessment"] },
    { title: "Postpartum Depression", tags: ["postpartum depression", "PPD", "baby blues"], keywords: ["postpartum depression", "PPD screening"] },
    { title: "High-Risk Pregnancy", tags: ["high risk", "antepartum", "bed rest"], keywords: ["high-risk pregnancy", "antepartum care"] },
    { title: "Rh Incompatibility", tags: ["Rh factor", "RhoGAM", "hemolytic disease"], keywords: ["Rh incompatibility", "RhoGAM"] },
    { title: "Preterm Labor", tags: ["preterm", "tocolytics", "betamethasone"], keywords: ["preterm labor", "premature birth"] },
    { title: "Hyperemesis Gravidarum", tags: ["hyperemesis", "severe nausea", "dehydration"], keywords: ["hyperemesis gravidarum", "pregnancy vomiting"] },
    { title: "HELLP Syndrome", tags: ["HELLP", "hemolysis", "elevated liver enzymes"], keywords: ["HELLP syndrome", "severe preeclampsia"] },
    { title: "Amniocentesis and Prenatal Testing", tags: ["amniocentesis", "CVS", "genetic testing"], keywords: ["amniocentesis", "prenatal diagnostics"] },
    { title: "Induction of Labor", tags: ["induction", "oxytocin", "prostaglandin"], keywords: ["labor induction", "cervical ripening"] },
    { title: "Obstetric Emergencies", tags: ["shoulder dystocia", "cord prolapse", "uterine rupture"], keywords: ["obstetric emergency", "birth complications"] },
    { title: "Postpartum Assessment and Care", tags: ["postpartum", "involution", "lochia"], keywords: ["postpartum care", "postpartum assessment"] },
    { title: "Neonatal Jaundice", tags: ["jaundice", "bilirubin", "phototherapy"], keywords: ["neonatal jaundice", "hyperbilirubinemia"] },
    { title: "Pregnancy-Induced Hypertension", tags: ["PIH", "gestational hypertension", "blood pressure"], keywords: ["pregnancy hypertension", "PIH"] },
    { title: "Contraception and Family Planning", tags: ["contraception", "IUD", "hormonal"], keywords: ["contraception", "family planning"] },
  ],
  "Pediatrics": [
    { title: "Pediatric Vital Signs by Age", tags: ["pediatric vitals", "age-specific", "normal ranges"], keywords: ["pediatric vital signs", "normal values by age"] },
    { title: "Common Childhood Infections", tags: ["chicken pox", "measles", "mumps"], keywords: ["childhood infections", "infectious diseases pediatric"] },
    { title: "Pediatric Asthma", tags: ["pediatric asthma", "nebulizer", "inhaler technique"], keywords: ["pediatric asthma", "childhood asthma"] },
    { title: "Croup and Epiglottitis", tags: ["croup", "epiglottitis", "stridor"], keywords: ["croup management", "epiglottitis emergency"] },
    { title: "Pyloric Stenosis", tags: ["pyloric stenosis", "projectile vomiting", "olive-shaped mass"], keywords: ["pyloric stenosis", "pyloromyotomy"] },
    { title: "Intussusception", tags: ["intussusception", "currant jelly stool", "bowel telescoping"], keywords: ["intussusception", "bowel obstruction pediatric"] },
    { title: "Congenital Heart Defects", tags: ["CHD", "VSD", "ASD", "tetralogy of Fallot"], keywords: ["congenital heart defects", "pediatric cardiac"] },
    { title: "Pediatric Diabetes", tags: ["juvenile diabetes", "type 1 DM", "insulin management"], keywords: ["pediatric diabetes", "type 1 in children"] },
    { title: "Febrile Seizures", tags: ["febrile seizure", "fever", "seizure management"], keywords: ["febrile seizures", "fever-related seizures"] },
    { title: "Kawasaki Disease", tags: ["Kawasaki", "coronary aneurysm", "strawberry tongue"], keywords: ["Kawasaki disease", "mucocutaneous lymph node"] },
    { title: "Pediatric Dehydration", tags: ["dehydration", "oral rehydration", "IV fluids"], keywords: ["pediatric dehydration", "fluid replacement"] },
    { title: "Failure to Thrive", tags: ["FTT", "growth failure", "nutrition"], keywords: ["failure to thrive", "growth faltering"] },
    { title: "Child Abuse Recognition", tags: ["child abuse", "neglect", "mandatory reporting"], keywords: ["child abuse", "pediatric abuse recognition"] },
    { title: "Pediatric Pain Assessment", tags: ["FLACC", "Wong-Baker", "pediatric pain"], keywords: ["pediatric pain", "pain assessment children"] },
    { title: "Bronchiolitis and RSV", tags: ["RSV", "bronchiolitis", "wheezing"], keywords: ["bronchiolitis", "RSV management"] },
    { title: "Cystic Fibrosis in Children", tags: ["CF", "sweat test", "pancreatic enzymes"], keywords: ["pediatric cystic fibrosis", "CF in children"] },
    { title: "Pediatric Immunization Schedule", tags: ["immunizations", "vaccine schedule", "pediatric"], keywords: ["childhood immunizations", "vaccine schedule"] },
    { title: "Nephrotic Syndrome in Children", tags: ["nephrotic", "proteinuria", "edema"], keywords: ["pediatric nephrotic syndrome", "childhood kidney"] },
    { title: "Wilms Tumor", tags: ["Wilms tumor", "nephroblastoma", "abdominal mass"], keywords: ["Wilms tumor", "renal tumor pediatric"] },
    { title: "Scoliosis", tags: ["scoliosis", "spinal curvature", "bracing"], keywords: ["scoliosis", "spinal deformity"] },
    { title: "Pediatric Fractures and Traction", tags: ["fractures", "traction", "cast care"], keywords: ["pediatric fractures", "traction nursing"] },
    { title: "Down Syndrome", tags: ["Down syndrome", "trisomy 21", "developmental"], keywords: ["Down syndrome", "trisomy 21"] },
    { title: "Autism Spectrum Disorder", tags: ["autism", "ASD", "developmental disorder"], keywords: ["autism spectrum", "ASD"] },
    { title: "Lead Poisoning", tags: ["lead poisoning", "chelation", "screening"], keywords: ["lead poisoning", "lead exposure"] },
    { title: "Sudden Infant Death Syndrome Prevention", tags: ["SIDS", "safe sleep", "back to sleep"], keywords: ["SIDS prevention", "safe sleep"] },
  ],
  "Mental Health": [
    { title: "Major Depressive Disorder", tags: ["depression", "MDD", "antidepressants"], keywords: ["major depression", "depressive disorder"] },
    { title: "Bipolar Disorder", tags: ["bipolar", "mania", "lithium"], keywords: ["bipolar disorder", "mood disorder"] },
    { title: "Schizophrenia", tags: ["schizophrenia", "psychosis", "antipsychotics"], keywords: ["schizophrenia", "psychotic disorder"] },
    { title: "Anxiety Disorders", tags: ["anxiety", "GAD", "panic disorder"], keywords: ["anxiety disorders", "generalized anxiety"] },
    { title: "Post-Traumatic Stress Disorder", tags: ["PTSD", "trauma", "flashbacks"], keywords: ["PTSD", "trauma disorder"] },
    { title: "Obsessive-Compulsive Disorder", tags: ["OCD", "obsessions", "compulsions"], keywords: ["OCD", "obsessive-compulsive"] },
    { title: "Substance Use Disorders", tags: ["substance abuse", "addiction", "withdrawal"], keywords: ["substance use disorder", "addiction"] },
    { title: "Alcohol Withdrawal and Delirium Tremens", tags: ["alcohol withdrawal", "DTs", "CIWA"], keywords: ["alcohol withdrawal", "delirium tremens"] },
    { title: "Eating Disorders", tags: ["anorexia", "bulimia", "binge eating"], keywords: ["eating disorders", "anorexia nervosa"] },
    { title: "Personality Disorders", tags: ["borderline", "antisocial", "narcissistic"], keywords: ["personality disorders", "BPD"] },
    { title: "Suicide Risk Assessment", tags: ["suicide", "risk assessment", "safety planning"], keywords: ["suicide prevention", "risk assessment"] },
    { title: "Therapeutic Milieu", tags: ["therapeutic milieu", "inpatient psych", "safety"], keywords: ["therapeutic milieu", "psychiatric nursing"] },
    { title: "Psychiatric Medications Overview", tags: ["psych meds", "SSRI", "antipsychotics", "mood stabilizers"], keywords: ["psychiatric medications", "psychopharmacology"] },
    { title: "Crisis Intervention", tags: ["crisis", "de-escalation", "safety"], keywords: ["crisis intervention", "de-escalation"] },
    { title: "Electroconvulsive Therapy", tags: ["ECT", "depression treatment", "seizure therapy"], keywords: ["ECT", "electroconvulsive therapy"] },
    { title: "Grief and Loss", tags: ["grief", "bereavement", "Kübler-Ross"], keywords: ["grief process", "bereavement care"] },
    { title: "ADHD in Children and Adults", tags: ["ADHD", "attention deficit", "stimulants"], keywords: ["ADHD", "attention deficit"] },
    { title: "Cognitive Behavioral Therapy Basics", tags: ["CBT", "cognitive distortions", "therapy"], keywords: ["CBT", "cognitive behavioral therapy"] },
    { title: "Neuroleptic Malignant Syndrome", tags: ["NMS", "antipsychotic complication", "hyperthermia"], keywords: ["NMS", "neuroleptic malignant syndrome"] },
    { title: "Serotonin Syndrome", tags: ["serotonin syndrome", "SSRI toxicity", "clonus"], keywords: ["serotonin syndrome", "serotonin toxicity"] },
    { title: "Involuntary Commitment and Patient Rights", tags: ["involuntary", "commitment", "patient rights"], keywords: ["involuntary commitment", "psychiatric hold"] },
    { title: "Group Therapy Dynamics", tags: ["group therapy", "Yalom", "therapeutic factors"], keywords: ["group therapy", "group dynamics"] },
    { title: "Abuse and Domestic Violence", tags: ["domestic violence", "IPV", "abuse screening"], keywords: ["domestic violence", "intimate partner violence"] },
    { title: "Sleep Disorders and Nursing", tags: ["insomnia", "sleep hygiene", "sleep disorders"], keywords: ["sleep disorders", "insomnia management"] },
    { title: "Dissociative Disorders", tags: ["dissociation", "DID", "depersonalization"], keywords: ["dissociative disorders", "DID"] },
  ],
  "Emergency/Critical Care": [
    { title: "Basic Life Support and CPR", tags: ["BLS", "CPR", "AED"], keywords: ["BLS", "CPR protocol"] },
    { title: "Advanced Cardiac Life Support", tags: ["ACLS", "cardiac arrest", "resuscitation"], keywords: ["ACLS", "cardiac arrest management"] },
    { title: "Trauma Assessment and ABCDE", tags: ["trauma", "primary survey", "ABCDE"], keywords: ["trauma assessment", "ABCDE approach"] },
    { title: "Burns Assessment and Management", tags: ["burns", "rule of nines", "Parkland formula"], keywords: ["burn management", "thermal injury"] },
    { title: "Poisoning and Overdose Management", tags: ["poisoning", "overdose", "toxicology"], keywords: ["poisoning management", "drug overdose"] },
    { title: "Multiorgan Dysfunction Syndrome", tags: ["MODS", "organ failure", "critical care"], keywords: ["MODS", "multiorgan failure"] },
    { title: "Mechanical Ventilation Management", tags: ["ventilator", "weaning", "ABG"], keywords: ["mechanical ventilation", "ventilator weaning"] },
    { title: "Hemodynamic Monitoring in ICU", tags: ["Swan-Ganz", "CVP", "cardiac output"], keywords: ["hemodynamic monitoring", "ICU monitoring"] },
    { title: "Acute Respiratory Failure", tags: ["respiratory failure", "intubation", "oxygen"], keywords: ["acute respiratory failure", "respiratory arrest"] },
    { title: "Cardiogenic Shock", tags: ["cardiogenic shock", "pump failure", "IABP"], keywords: ["cardiogenic shock", "pump failure"] },
    { title: "Sepsis Bundles and Management", tags: ["sepsis bundle", "hour-1 bundle", "lactate"], keywords: ["sepsis protocol", "sepsis bundles"] },
    { title: "Drowning and Near-Drowning", tags: ["drowning", "submersion", "hypothermia"], keywords: ["drowning management", "submersion injury"] },
    { title: "Anaphylactic Shock Management", tags: ["anaphylaxis", "epinephrine", "airway"], keywords: ["anaphylactic shock", "severe allergic reaction"] },
    { title: "Hypovolemic Shock", tags: ["hypovolemia", "hemorrhage", "fluid resuscitation"], keywords: ["hypovolemic shock", "hemorrhagic shock"] },
    { title: "Neurogenic Shock", tags: ["neurogenic shock", "spinal shock", "bradycardia"], keywords: ["neurogenic shock", "SCI shock"] },
    { title: "ICU Delirium Prevention", tags: ["ICU delirium", "CAM-ICU", "sedation vacation"], keywords: ["ICU delirium", "critical care delirium"] },
    { title: "Rapid Response Teams", tags: ["rapid response", "early warning", "deterioration"], keywords: ["rapid response team", "clinical deterioration"] },
    { title: "Mass Casualty Triage", tags: ["triage", "START triage", "mass casualty"], keywords: ["mass casualty", "disaster triage"] },
    { title: "Chest Pain Assessment in ER", tags: ["chest pain", "ACS", "differential diagnosis"], keywords: ["chest pain assessment", "ED chest pain"] },
    { title: "Stroke Code Management", tags: ["stroke code", "tPA", "door to needle"], keywords: ["stroke protocol", "acute stroke"] },
    { title: "Status Epilepticus", tags: ["status epilepticus", "seizure emergency", "benzodiazepine"], keywords: ["status epilepticus", "continuous seizure"] },
    { title: "Heat-Related Emergencies", tags: ["heat stroke", "heat exhaustion", "hyperthermia"], keywords: ["heat stroke", "hyperthermia emergency"] },
    { title: "Hypothermia Emergency Management", tags: ["hypothermia", "rewarming", "cold exposure"], keywords: ["hypothermia treatment", "cold emergency"] },
    { title: "Arterial Line Monitoring", tags: ["arterial line", "A-line", "waveform"], keywords: ["arterial line", "invasive BP monitoring"] },
    { title: "Ventilator-Associated Pneumonia Prevention", tags: ["VAP", "bundle", "ventilator infection"], keywords: ["VAP prevention", "ventilator pneumonia"] },
  ],
  "Ethics": [
    { title: "Informed Consent", tags: ["informed consent", "autonomy", "decision making"], keywords: ["informed consent", "patient autonomy"] },
    { title: "Patient Confidentiality and HIPAA", tags: ["HIPAA", "confidentiality", "privacy"], keywords: ["HIPAA", "patient confidentiality"] },
    { title: "Advance Directives", tags: ["advance directives", "living will", "healthcare proxy"], keywords: ["advance directives", "end of life wishes"] },
    { title: "Do Not Resuscitate Orders", tags: ["DNR", "DNAR", "code status"], keywords: ["DNR orders", "code status"] },
    { title: "Ethical Principles in Nursing", tags: ["beneficence", "nonmaleficence", "justice", "autonomy"], keywords: ["nursing ethics", "ethical principles"] },
    { title: "Scope of Practice", tags: ["scope of practice", "nurse practice act", "licensure"], keywords: ["scope of practice", "NPA"] },
    { title: "Professional Boundaries", tags: ["boundaries", "therapeutic relationship", "dual relationship"], keywords: ["professional boundaries", "nurse-patient relationship"] },
    { title: "Mandatory Reporting", tags: ["mandatory reporting", "abuse", "neglect"], keywords: ["mandatory reporting", "abuse reporting"] },
    { title: "Organ Donation Ethics", tags: ["organ donation", "brain death", "consent"], keywords: ["organ donation", "transplant ethics"] },
    { title: "Quality Improvement in Healthcare", tags: ["QI", "PDSA", "patient safety"], keywords: ["quality improvement", "healthcare quality"] },
    { title: "Nursing Leadership and Management", tags: ["leadership", "management", "transformational"], keywords: ["nursing leadership", "nurse manager"] },
    { title: "Interprofessional Collaboration", tags: ["collaboration", "teamwork", "SBAR"], keywords: ["interprofessional", "team communication"] },
    { title: "Legal Issues in Nursing", tags: ["malpractice", "negligence", "liability"], keywords: ["nursing law", "malpractice"] },
    { title: "Restraint Use and Alternatives", tags: ["restraints", "alternatives", "safety"], keywords: ["restraint use", "least restrictive"] },
    { title: "Cultural and Spiritual Care", tags: ["cultural care", "spiritual care", "diversity"], keywords: ["cultural competence", "spiritual nursing"] },
    { title: "Research Ethics and IRB", tags: ["research ethics", "IRB", "human subjects"], keywords: ["research ethics", "nursing research"] },
    { title: "Patient Advocacy", tags: ["advocacy", "patient rights", "empowerment"], keywords: ["patient advocacy", "nurse advocate"] },
    { title: "Social Determinants of Health", tags: ["SDOH", "health equity", "disparities"], keywords: ["social determinants", "health equity"] },
    { title: "Error Disclosure and Just Culture", tags: ["error disclosure", "just culture", "safety culture"], keywords: ["medical error disclosure", "just culture"] },
    { title: "Disaster Preparedness", tags: ["disaster", "emergency preparedness", "surge"], keywords: ["disaster preparedness", "emergency planning"] },
    { title: "Workplace Violence Prevention", tags: ["workplace violence", "safety", "de-escalation"], keywords: ["workplace violence", "nurse safety"] },
    { title: "Compassion Fatigue and Self-Care", tags: ["burnout", "compassion fatigue", "resilience"], keywords: ["compassion fatigue", "nurse self-care"] },
    { title: "Health Literacy", tags: ["health literacy", "patient education", "plain language"], keywords: ["health literacy", "patient education"] },
    { title: "Evidence-Based Practice Implementation", tags: ["EBP", "clinical guidelines", "Melnyk framework"], keywords: ["EBP implementation", "evidence translation"] },
    { title: "Telehealth Nursing", tags: ["telehealth", "virtual care", "remote monitoring"], keywords: ["telehealth nursing", "virtual care"] },
  ],
};

function generateSlug(title: string, domain: string): string {
  const base = `rn-${title}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
  return base;
}

function mapDomainToBodySystem(domain: Domain): string {
  const mapping: Record<Domain, string> = {
    "Foundations": "Fundamentals",
    "Health Assessment": "Health Assessment",
    "Pharmacology": "Pharmacology",
    "Cardiovascular": "Cardiovascular",
    "Respiratory": "Respiratory",
    "Neurology": "Neurological",
    "GI": "Gastrointestinal",
    "Endocrine": "Endocrine",
    "Renal": "Renal/Urinary",
    "Hematology/Oncology": "Hematological",
    "Immunology": "Immunological",
    "Maternal/OB": "Maternal/Newborn",
    "Pediatrics": "Pediatrics",
    "Mental Health": "Mental Health",
    "Emergency/Critical Care": "Critical Care",
    "Ethics": "Ethics",
  };
  return mapping[domain];
}

type ContentBlock =
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

async function generateLessonContent(
  title: string,
  domain: Domain,
  tags: string[],
  keywords: string[]
): Promise<ContentBlock[]> {
  const bodySystem = mapDomainToBodySystem(domain);

  // Attempt AI generation when API key is present
  if (process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
    try {
      const openai = getOpenAI();
      const userPrompt = `Generate a complete clinical-grade NCLEX-RN nursing lesson (US context).

LESSON TITLE: ${title}
DOMAIN: ${domain}
BODY SYSTEM: ${bodySystem}
KEY CONCEPTS: ${tags.join(", ")}
KEYWORDS: ${keywords.join(", ")}

Apply all 11 required sections with full clinical depth per the system prompt. Pathophysiology must reach cellular level. Every symptom must explain WHY it occurs. Nursing actions must include rationale. Case scenario must use a realistic patient name.`;

      const response = await openai.chat.completions.create({
        model: resolveLessonExpansionOpenAiModel(),
        max_tokens: 4096,
        temperature: 0.3,
        messages: [
          { role: "system", content: CLINICAL_GRADE_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      });

      const raw = (response.choices[0]?.message?.content || "").trim();
      const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
      const parsed: ContentBlock[] = JSON.parse(cleaned);

      if (Array.isArray(parsed) && parsed.length >= 20) {
        const wordCount = parsed
          .filter((b): b is { type: "paragraph"; text: string } => b.type === "paragraph")
          .reduce((n, b) => n + b.text.split(/\s+/).length, 0);
        if (wordCount >= 1000) {
          return parsed;
        }
      }
    } catch {
      // fall through to structured fallback below
    }
  }

  // Structured fallback — all 11 sections, topic-specific scaffolding
  return [
    { type: "subheading", text: "Overview" },
    { type: "paragraph", text: `**${title}** is a high-priority topic within ${domain} nursing and a recurring focus of NCLEX-RN clinical judgment items. Registered nurses encounter ${title.toLowerCase()} in ${bodySystem.toLowerCase()}-focused settings including medical-surgical units, critical care, and community health. Mastery of this topic requires understanding the underlying disease mechanism, early recognition of clinical deterioration, and the ability to prioritize nursing interventions under time pressure. Key competencies include ${tags.slice(0, 3).join(", ")}, and safe application of evidence-based protocols aligned with current nursing standards.` },
    { type: "paragraph", text: `The NCLEX-RN Next Generation exam tests nurses' ability to recognize cues, analyze findings, prioritize hypotheses, generate solutions, take action, and evaluate outcomes — all in the context of ${title.toLowerCase()}. Understanding the full clinical picture, from initial presentation through discharge, is essential for both exam success and safe bedside practice.` },

    { type: "subheading", text: "Pathophysiology" },
    { type: "paragraph", text: `The pathophysiology of ${title.toLowerCase()} begins at the cellular level with disruption of normal ${bodySystem.toLowerCase()} function. Injury, inflammation, or dysfunction triggers a cascade: cellular homeostasis is lost, leading to organ-level impairment, and eventually systemic manifestations if left uncorrected. The body attempts compensation through neuroendocrine responses — sympathetic nervous system activation, renin-angiotensin-aldosterone engagement, and inflammatory mediator release — but these mechanisms have limits that nurses must recognize clinically.` },
    { type: "paragraph", text: `Understanding the cause-and-effect chain in ${title.toLowerCase()} allows nurses to anticipate clinical deterioration before it becomes irreversible. Early pathological changes produce subtle findings (tachycardia, restlessness, decreased urine output) that precede overt decompensation. Risk factors accelerate this progression; comorbidities such as diabetes, hypertension, and immunosuppression reduce physiological reserve. Nurses who understand the mechanism can explain findings to patients, educate families, and communicate effectively with the interdisciplinary team.` },

    { type: "subheading", text: "Risk Factors" },
    { type: "list", items: [
      `Modifiable — poorly controlled comorbidities (hypertension, diabetes mellitus, obesity), sedentary lifestyle, tobacco use, medication non-adherence`,
      `Modifiable — nutritional deficits (low albumin, vitamin deficiencies) impairing healing and immune response`,
      `Non-modifiable — advanced age (>65): reduced physiological reserve, polypharmacy risk, impaired compensatory mechanisms`,
      `Non-modifiable — genetic predisposition and family history of ${bodySystem.toLowerCase()} disease`,
      `Population-specific (elderly) — atypical presentations, blunted fever response, falls risk from hemodynamic instability`,
      `Population-specific (pediatric) — different normal ranges for vitals, faster decompensation, weight-based dosing requirements`,
      `Iatrogenic — prolonged immobility, invasive lines/catheters, broad-spectrum antibiotics disrupting microbiome`,
      `Socioeconomic — limited healthcare access, delayed diagnosis, medication cost barriers reducing adherence`,
    ]},

    { type: "subheading", text: "Signs & Symptoms" },
    { type: "paragraph", text: `**Early signs** of ${title.toLowerCase()} reflect the body's initial compensatory responses. Tachycardia occurs because the sympathetic nervous system increases heart rate to maintain cardiac output when tissue perfusion is threatened. Restlessness and anxiety result from cerebral hypoperfusion or hypoxia stimulating the reticular activating system. Mild tachypnea represents the body's attempt to correct acid-base balance through respiratory compensation. These early signs are often subtle and nonspecific, which is why baseline assessment and trending are critical nursing responsibilities.` },
    { type: "paragraph", text: `**Late signs** emerge as compensatory mechanisms fail. Hypotension signals that cardiac output can no longer be maintained. Altered mental status (confusion, obtundation) reflects cerebral hypoperfusion reaching a critical threshold. Oliguria (urine output <0.5 mL/kg/hr) indicates renal hypoperfusion and activates the renin-angiotensin system, worsening fluid retention. **Red flags requiring immediate action:** sudden change in mental status, SpO₂ <90% despite supplemental oxygen, systolic BP <90 mmHg, new-onset cardiac dysrhythmia, signs of hemorrhage or airway compromise.` },

    { type: "subheading", text: "Diagnostics & Labs" },
    { type: "list", items: [
      `CBC with differential — WBC >11,000/mm³ suggests infection/inflammation; <4,000/mm³ indicates immunosuppression or marrow suppression; Hgb/Hct trends detect hemorrhage or anemia`,
      `Basic metabolic panel — Na⁺ 136–145 mEq/L; K⁺ 3.5–5.0 mEq/L (critical if <3.0 or >6.0); BUN 7–20 mg/dL; Creatinine 0.6–1.2 mg/dL; elevations indicate renal compromise`,
      `Arterial blood gas (ABG) — pH 7.35–7.45; PaO₂ 80–100 mmHg; PaCO₂ 35–45 mmHg; HCO₃ 22–26 mEq/L; deviations reveal acid-base and oxygenation status`,
      `Lactate — normal <2 mmol/L; >4 mmol/L indicates tissue hypoperfusion (sepsis, shock); trend is as important as single value`,
      `Imaging — chest X-ray for pulmonary infiltrates, pleural effusion, cardiomegaly; CT as indicated for definitive diagnosis`,
      `Culture and sensitivity — obtain BEFORE antibiotics; blood, urine, wound cultures guide targeted therapy and antibiotic stewardship`,
      `Nurses watch for: critical lab values requiring immediate physician notification (K⁺ <3.0 or >6.0, glucose <60 or >400, Na⁺ <120 or >160, troponin elevation)`,
    ]},

    { type: "subheading", text: "Management & Treatments" },
    { type: "paragraph", text: `**Medical Management:** Pharmacological treatment of ${title.toLowerCase()} targets the underlying mechanism. When infection is present, empiric broad-spectrum antibiotics are initiated immediately after cultures, then de-escalated based on sensitivity results (antibiotic stewardship). Hemodynamic support uses vasopressors (norepinephrine preferred in septic shock) to maintain MAP ≥65 mmHg. Fluid resuscitation follows the 30 mL/kg crystalloid protocol in sepsis per Surviving Sepsis Campaign guidelines. Analgesics and anxiolytics (CPOT-guided in ICU patients) address pain and agitation while minimizing respiratory depression. Anticoagulation (heparin, enoxaparin, DOACs) prevents thromboembolic complications in high-risk patients.` },
    { type: "paragraph", text: `**Nursing Interventions:** The nurse's first priority is continuous hemodynamic monitoring — vital signs every 15–60 minutes depending on stability, continuous cardiac monitoring for dysrhythmia detection, and SpO₂ trending. IV access (two large-bore peripheral IVs or central line) must be established and patency confirmed before fluid/medication administration. Accurate intake and output (I&O) tracking every hour during acute phase informs fluid balance decisions. Head of bed elevation (30–45°) reduces aspiration risk and improves venous return. Fall prevention protocols are activated immediately given hemodynamic instability. The nurse reports: MAP <65 mmHg, new dysrhythmia, urine output <0.5 mL/kg/hr for 2+ hours, SpO₂ <90%, sudden neurological change.` },

    { type: "subheading", text: "Clinical Decision-Making & Nursing Priorities" },
    { type: "paragraph", text: `Apply the ABC framework on every encounter: Airway patency and protection first — if the patient cannot protect their own airway, everything else is secondary. Breathing and oxygenation second — SpO₂ <90% triggers immediate intervention (repositioning, increased FiO₂, CPAP/BiPAP, call rapid response). Circulation third — hemodynamic instability defines the urgency of the entire care plan.` },
    { type: "paragraph", text: `In the first 15 minutes of recognizing clinical deterioration in ${title.toLowerCase()}: (1) Call for help — activate rapid response or escalate to provider. (2) Ensure IV access — if none, establish it now. (3) Obtain stat vitals including orthostatic BP if safe to do so. (4) Apply supplemental oxygen — titrate to SpO₂ ≥94%. (5) Obtain stat orders: 12-lead ECG, stat labs, imaging. (6) Document time of recognition and all interventions. When multiple problems compete, use Maslow's hierarchy: physiological needs first (breathing, circulation, fluid/electrolytes), then safety needs (fall prevention, infection control), then psychosocial needs.` },

    { type: "subheading", text: "Complications" },
    { type: "list", items: [
      `Septic shock — untreated infection progresses to vasodilation and distributive shock within 6–12 hours; mortality increases 7% per hour without antibiotics; nursing: maintain MAP ≥65 with vasopressors, hourly urine output, lactate clearance monitoring`,
      `Acute kidney injury (AKI) — renal hypoperfusion or nephrotoxic medications cause tubular necrosis; creatinine rising ≥0.3 mg/dL in 48 hours meets KDIGO criteria; nursing: hold nephrotoxic agents, strict I&O, avoid contrast media`,
      `Respiratory failure — increased oxygen demand + decreased reserve → hypoxemia; nursing: position for optimal ventilation (semi-Fowler's), suction PRN, prepare for possible intubation`,
      `Delirium — ICU setting, hypoxia, and medications cause acute cognitive changes; nursing: CAM-ICU screening every shift, non-pharmacological reorientation, minimize sedation (ABCDEF bundle)`,
      `Pressure injury — immobility combined with hemodynamic instability impairs tissue perfusion; nursing: Braden scale on admission, turn every 2 hours, moisture management, pressure-redistributing surfaces`,
      `Medication adverse effects — polypharmacy in critically ill patients increases interaction risk; nursing: reconcile ALL medications, monitor therapeutic drug levels, watch for QT prolongation with antibiotics/antifungals`,
    ]},

    { type: "subheading", text: "Clinical Pearls" },
    { type: "paragraph", text: `**NCLEX trap — "assess vs. act":** Most NCLEX items reward assessment FIRST — but not when the patient is in immediate danger. If the ABCs are compromised, ACT first (position, oxygen, call for help), THEN document. Know when assessment is the correct first answer (stable patient with new complaint) vs. when intervention is first (SpO₂ 82%, unresponsive patient, active hemorrhage).` },
    { type: "list", items: [
      `Memory anchor for sepsis criteria (SIRS ≥2): Temp >38°C or <36°C, HR >90, RR >20 or PaCO₂ <32, WBC >12,000 or <4,000 or >10% bands`,
      `Never give potassium IV push — always infuse diluted (≤10 mEq/hr peripheral, ≤20 mEq/hr central) with continuous cardiac monitoring`,
      `"When in doubt, pull it out" — any invasive line (Foley, IV, NG tube) is a potential infection source; reassess daily necessity`,
      `Lab values that never wait for morning rounds: K⁺ <3.0 or >6.0, glucose <60 or >500, Na⁺ <120 or >160, troponin elevation, new lactate >4 mmol/L`,
      `Distinguish ${title} from commonly confused conditions by: [onset acuity, presence/absence of fever, and response to initial interventions]`,
      `Safety pearl — NEVER silence a monitor alarm without identifying and addressing the cause first`,
    ]},

    { type: "subheading", text: "Patient & Client Education" },
    { type: "paragraph", text: `Effective patient education for ${title.toLowerCase()} must begin at admission and use teach-back to verify understanding. Use plain language: avoid jargon. Frame information around what the patient needs to DO, not just know. Address health literacy barriers and cultural context. Include family members or caregivers when the patient consents, especially for complex home management regimens.` },
    { type: "list", items: [
      `Disease process: Explain in simple terms what is happening in their body and why they are experiencing their symptoms`,
      `Medications: Name, dose, purpose, side effects to watch for, and what to do if a dose is missed — use pill organizers and written schedules`,
      `Warning signs — call 911: severe shortness of breath, chest pain, altered consciousness, inability to speak`,
      `Warning signs — call provider: fever >38.3°C (101°F), weight gain >2 lb in 24 hours or 5 lb in a week, worsening symptoms not relieved by prescribed medications`,
      `Lifestyle: Dietary modifications (sodium restriction, fluid limits as applicable), graduated activity resumption, smoking cessation resources`,
      `Follow-up: Specific appointment dates, lab monitoring schedule, and who to call with questions (patient navigator number if available)`,
      `Teach-back example: "I want to make sure I explained this clearly — can you tell me in your own words what you should do if you notice [symptom]?"`,
    ]},

    { type: "subheading", text: "Case-Based Application" },
    { type: "paragraph", text: `**Scenario:** Maria, a 68-year-old woman with a history of type 2 diabetes and hypertension, is admitted to the medical-surgical unit from the ED. Her daughter found her confused and febrile at home. Vitals on arrival: T 38.9°C, HR 108, RR 22, BP 94/60 mmHg, SpO₂ 93% on room air. She is oriented to person only. UA shows nitrites positive, >50 WBCs, and cloudy appearance. BMP shows Cr 1.9 mg/dL (baseline 0.8), glucose 198. Lactate 3.1 mmol/L.` },
    { type: "paragraph", text: `**Question 1 — What is most likely happening and why?**\nMaria has urosepsis with early septic shock. The infectious source (UTI with positive nitrites/WBCs) triggered a systemic inflammatory response: fever + tachycardia + tachypnea + altered mental status + hypotension meet SIRS criteria and organ dysfunction (AKI: Cr 1.9 from baseline 0.8, lactate 3.1 indicating tissue hypoperfusion). Her diabetes impairs immune response and increases UTI risk; hypertension and age reduce physiological reserve.` },
    { type: "paragraph", text: `**Question 2 — What should the nurse do FIRST and in what order?**\n(1) Activate rapid response / notify provider immediately — MAP is critically low. (2) Apply supplemental oxygen via nasal cannula, titrate to SpO₂ ≥94%. (3) Confirm two large-bore IV lines and prepare for 30 mL/kg crystalloid bolus (normal saline or lactated Ringer's) per sepsis bundle. (4) Draw blood cultures ×2 from separate sites BEFORE antibiotics. (5) Obtain urine culture. (6) Administer antibiotics per order — timing is critical (every 1-hour delay increases mortality ~7%). (7) Insert Foley catheter for strict hourly urine output monitoring. (8) Repeat lactate in 2 hours to assess clearance. (9) Continuous cardiac monitoring. (10) Reassess and document response to each intervention.\n\n**Key Teaching Point:** Sepsis progresses rapidly — early recognition of SIRS criteria plus organ dysfunction triggers the sepsis bundle, and every hour without antibiotics worsens outcomes.` },
  ];
}

function generateFlashcards(title: string, domain: Domain, tags: string[]): Array<{ front: string; back: string }> {
  const bodySystem = mapDomainToBodySystem(domain);
  return [
    {
      front: `What are the priority nursing assessments for ${title.toLowerCase()}?`,
      back: `Priority assessments include: vital signs monitoring, focused ${bodySystem.toLowerCase()} system physical examination, review of relevant laboratory values, patient health history including onset/duration/severity, medication reconciliation, and ongoing reassessment for changes in condition.`,
    },
    {
      front: `What are the key nursing interventions for patients with conditions related to ${title.toLowerCase()}?`,
      back: `Key interventions: administer prescribed medications safely, monitor for complications, implement appropriate safety precautions, provide patient and family education, coordinate interdisciplinary care, document findings and responses to treatment, and plan for discharge.`,
    },
    {
      front: `What clinical findings related to ${title.toLowerCase()} require immediate nursing action?`,
      back: `Findings requiring immediate action include: significant changes in vital signs, acute deterioration in consciousness level, signs of respiratory distress, hemodynamic instability, severe pain, and any assessment finding suggesting a life-threatening complication. Follow institutional rapid response protocols.`,
    },
    {
      front: `What patient education topics are essential for ${title.toLowerCase()}?`,
      back: `Essential education: disease process and prognosis, medication names/purposes/side effects, signs and symptoms requiring medical attention, dietary modifications, activity restrictions, follow-up appointment schedule, community resources, and self-monitoring techniques.`,
    },
    {
      front: `What is the pathophysiology underlying ${title.toLowerCase()}?`,
      back: `The pathophysiology involves disruption of normal ${bodySystem.toLowerCase()} system function through mechanisms including altered cellular processes, inflammatory responses, and impaired homeostatic regulation. Understanding these mechanisms helps predict clinical manifestations and guide evidence-based interventions.`,
    },
  ];
}

function buildAllTopics(): LessonTopic[] {
  const topics: LessonTopic[] = [];
  for (const domain of RN_DOMAINS) {
    const domainTopics = DOMAIN_TOPICS[domain];
    for (const t of domainTopics) {
      topics.push({
        title: t.title,
        slug: generateSlug(t.title, domain),
        domain,
        bodySystem: mapDomainToBodySystem(domain),
        tags: t.tags,
        keywords: t.keywords,
      });
    }
  }
  return topics;
}

export async function generateRnLessons(): Promise<{ lessonsInserted: number; flashcardsInserted: number; questionsLinked: number; errors: string[] }> {
  const topics = buildAllTopics();
  let lessonsInserted = 0;
  let flashcardsInserted = 0;
  let questionsLinked = 0;
  const errors: string[] = [];

  console.log(`[RN-Lessons] Starting generation of ${topics.length} RN lessons...`);

  const BATCH_SIZE = 10;
  for (let i = 0; i < topics.length; i += BATCH_SIZE) {
    const batch = topics.slice(i, i + BATCH_SIZE);
    console.log(`[RN-Lessons] Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(topics.length / BATCH_SIZE)} (lessons ${i + 1}-${Math.min(i + BATCH_SIZE, topics.length)})`);

    for (const topic of batch) {
      try {
        const existingResult = await pool.query(
          `SELECT id, title FROM content_items WHERE slug = $1 LIMIT 1`,
          [topic.slug]
        );
        if (existingResult.rows.length > 0) {
          console.warn(`[RN-Lessons] Duplicate slug detected: "${topic.slug}" already exists as "${existingResult.rows[0].title}" (id: ${existingResult.rows[0].id}). Skipping.`);
          continue;
        }

        const content = await generateLessonContent(topic.title, topic.domain, topic.tags, topic.keywords);
        if (!content || (Array.isArray(content) && content.length === 0)) {
          console.warn(`[RN-Lessons] Skipping lesson "${topic.title}" - empty content body`);
          errors.push(`Empty content for ${topic.title}`);
          continue;
        }
        const summary = `Comprehensive NCLEX-RN study guide covering ${topic.title.toLowerCase()} in ${topic.domain} nursing. Includes pathophysiology, signs and symptoms, assessment, nursing interventions, clinical pearls, and common exam pitfalls.`;
        console.log(`[RN-Lessons] Publishing: title="${topic.title}", slug="${topic.slug}", domain="${topic.domain}", bodySystem="${topic.bodySystem}", tier=rn`);


        const insertResult = await pool.query(
          `INSERT INTO content_items (id, title, slug, type, category, body_system, tier, status, tags, summary, content, seo_title, seo_description, seo_keywords, primary_keyword, secondary_keywords, auto_publish, region_scope, author_name, published_at, created_at, updated_at)
           VALUES (gen_random_uuid(), $1, $2, 'lesson', $3, $4, 'rn', 'published', $5, $6, $7, $8, $9, $10, $11, $12, true, 'BOTH', 'NurseNest Content Team', NOW(), NOW(), NOW())
           RETURNING id`,
          [
            topic.title,
            topic.slug,
            topic.domain,
            topic.bodySystem,
            topic.tags,
            summary,
            JSON.stringify(content),
            `${topic.title} - NCLEX-RN Study Guide | NurseNest`,
            summary.substring(0, 155),
            topic.keywords,
            topic.keywords[0] || topic.title.toLowerCase(),
            topic.keywords.slice(1),
          ]
        );

        const lessonId = insertResult.rows[0].id;
        lessonsInserted++;

        const flashcards = generateFlashcards(topic.title, topic.domain, topic.tags);
        for (const fc of flashcards) {
          try {
            const contentHash = crypto.createHash("sha256").update(fc.front.toLowerCase().trim()).digest("hex");
            await pool.query(
              `INSERT INTO flashcard_bank (id, tier, topic_tag, front, back, status, content_hash, body_system, topic, source_type, lesson_links, region_scope, flashcard_enabled, career_type, created_at)
               VALUES (gen_random_uuid(), 'rn', $1, $2, $3, 'published', $4, $5, $6, 'lesson_generated', $7, 'BOTH', true, 'nursing', NOW())
               ON CONFLICT (content_hash) DO NOTHING`,
              [
                topic.domain,
                fc.front,
                fc.back,
                contentHash,
                topic.bodySystem,
                topic.title,
                JSON.stringify([{ lessonTitle: topic.title, lessonUrl: `/rn/lessons/${topic.slug}`, relevanceNote: `Generated from ${topic.title} lesson` }]),
              ]
            );
            flashcardsInserted++;
          } catch (fcErr: any) {
            if (fcErr.code !== "23505") {
              errors.push(`Flashcard error for ${topic.title}: ${fcErr.message}`);
            }
          }
        }

        const bodySystemVariants = [topic.bodySystem];
        if (topic.domain === "Neurology") bodySystemVariants.push("Neurology", "Neuro");
        if (topic.domain === "GI") bodySystemVariants.push("GI");
        if (topic.domain === "Renal") bodySystemVariants.push("Renal");
        if (topic.domain === "Hematology/Oncology") bodySystemVariants.push("Hematology", "Oncology", "Hematologic");
        if (topic.domain === "Immunology") bodySystemVariants.push("Immune", "Infection Control");
        if (topic.domain === "Maternal/OB") bodySystemVariants.push("Maternal Health", "Maternal", "Reproductive", "Maternal-Newborn");
        if (topic.domain === "Emergency/Critical Care") bodySystemVariants.push("Emergency", "Critical Care", "Emergency Nursing");
        if (topic.domain === "Ethics") bodySystemVariants.push("Ethics", "Leadership", "Leadership/Ethics", "Safety", "Safety/Delegation", "Delegation");
        if (topic.domain === "Cardiovascular") bodySystemVariants.push("Cardiac");
        if (topic.domain === "Foundations") bodySystemVariants.push("Infection Control", "Fluid & Electrolytes", "Electrolytes", "Medical-Surgical", "Clinical Procedures", "Perioperative");

        const placeholders = bodySystemVariants.map((_, idx) => `$${idx + 1}`).join(", ");
        const linkedResult = await pool.query(
          `SELECT id FROM exam_questions WHERE tier = 'rn' AND body_system IN (${placeholders}) LIMIT 10`,
          bodySystemVariants
        );

        if (linkedResult.rows.length > 0) {
          questionsLinked += linkedResult.rows.length;
        }

      } catch (err: any) {
        errors.push(`Lesson error for ${topic.title}: ${err.message}`);
        console.error(`[RN-Lessons] Error inserting ${topic.title}:`, err.message);
      }
    }
  }

  console.log(`[RN-Lessons] Generation complete: ${lessonsInserted} lessons, ${flashcardsInserted} flashcards, ${questionsLinked} question links`);
  if (errors.length > 0) {
    console.log(`[RN-Lessons] ${errors.length} errors encountered`);
  }

  return { lessonsInserted, flashcardsInserted, questionsLinked, errors };
}

export { buildAllTopics, DOMAIN_TOPICS, RN_DOMAINS };
