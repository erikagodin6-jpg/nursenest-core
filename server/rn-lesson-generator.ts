import crypto from "crypto";
import { createLazyPrimaryPoolProxy } from "./db";

const pool = createLazyPrimaryPoolProxy();

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

function generateLessonContent(title: string, domain: Domain, tags: string[], keywords: string[]): any[] {
  const bodySystem = mapDomainToBodySystem(domain);
  const tagList = tags.join(", ");
  const keywordList = keywords.join(", ");

  return [
    { type: "heading", text: title },
    { type: "subheading", text: "Overview" },
    { type: "paragraph", text: `${title} is a critical topic in ${domain} nursing for NCLEX-RN preparation. This lesson covers the essential knowledge registered nurses need to understand about ${tagList}. Understanding these concepts is vital for safe, evidence-based clinical practice and exam success. The NCLEX-RN test plan emphasizes the application of clinical judgment in scenarios involving ${keywordList}, making this a high-priority study area.` },
    { type: "paragraph", text: `Registered nurses must demonstrate competency in assessing, planning, implementing, and evaluating care related to ${title.toLowerCase()}. This includes understanding the underlying pathophysiology, recognizing clinical manifestations, interpreting diagnostic findings, and implementing appropriate nursing interventions. The nursing process framework (ADPIE) guides the systematic approach to patient care in this domain.` },

    { type: "subheading", text: "Pathophysiology" },
    { type: "paragraph", text: `The pathophysiology of conditions related to ${title.toLowerCase()} involves disruptions in normal ${bodySystem.toLowerCase()} system function. Understanding the cellular and molecular mechanisms helps nurses anticipate clinical manifestations and predict patient responses to treatment. Key pathophysiological concepts include altered tissue perfusion, inflammatory responses, cellular injury patterns, and compensatory mechanisms that the body employs in response to disease processes.` },
    { type: "paragraph", text: `The progression from normal physiology to disease states follows predictable patterns that nurses must recognize. Early identification of pathological changes allows for timely intervention and improved patient outcomes. Risk factors, genetic predispositions, and environmental triggers all contribute to the development and progression of conditions within this topic area. Evidence-based understanding of these mechanisms directly informs clinical decision-making at the RN scope of practice.` },

    { type: "subheading", text: "Signs and Symptoms" },
    { type: "paragraph", text: `Clinical manifestations associated with ${title.toLowerCase()} can range from subtle early indicators to acute, life-threatening presentations. Nurses must be skilled in identifying both subjective symptoms (what the patient reports) and objective signs (what the nurse observes and measures). Systematic assessment ensures no critical findings are missed.` },
    { type: "paragraph", text: `Key clinical findings include changes in vital signs, alterations in laboratory values, physical examination findings specific to the ${bodySystem.toLowerCase()} system, and patient-reported symptoms. The NCLEX-RN frequently tests the nurse's ability to distinguish between expected findings and those requiring immediate intervention. Priority assessment findings that indicate deterioration or complications should trigger rapid nursing response.` },

    { type: "subheading", text: "Assessment" },
    { type: "paragraph", text: `Comprehensive nursing assessment for ${title.toLowerCase()} includes focused health history, physical examination, and interpretation of diagnostic studies. The health history should explore onset, duration, severity, associated symptoms, aggravating and alleviating factors, past medical history, medications, and family history. The physical assessment follows a systematic approach appropriate to the ${bodySystem.toLowerCase()} system.` },
    { type: "paragraph", text: `Diagnostic studies relevant to this topic may include laboratory tests, imaging studies, and specialized procedures. Nurses must understand normal reference ranges, the clinical significance of abnormal results, and their role in preparing patients for diagnostic procedures. Ongoing reassessment is essential to evaluate the effectiveness of interventions and detect changes in patient condition.` },

    { type: "subheading", text: "Management and Nursing Interventions" },
    { type: "paragraph", text: `Nursing management of conditions related to ${title.toLowerCase()} encompasses pharmacological interventions, non-pharmacological strategies, patient education, and collaborative care coordination. Evidence-based interventions should address both the underlying condition and symptom management while promoting patient safety and comfort.` },
    { type: "paragraph", text: `Priority nursing interventions include monitoring for complications, administering prescribed medications safely, implementing appropriate precautions, maintaining accurate documentation, and facilitating interprofessional communication. Patient education is a core nursing responsibility and should cover disease process, medication management, lifestyle modifications, warning signs requiring medical attention, and follow-up care requirements.` },
    { type: "paragraph", text: `Discharge planning begins at admission and includes assessment of the patient's understanding, home environment, support systems, and ability to manage self-care. Nurses should use teach-back methods to verify understanding and provide written instructions. Referrals to community resources, home health services, or rehabilitation may be appropriate depending on patient needs.` },

    { type: "subheading", text: "Clinical Pearls" },
    { type: "list", items: [
      `Always assess ABCs (Airway, Breathing, Circulation) first before addressing other concerns related to ${title.toLowerCase()}.`,
      `Document assessment findings thoroughly and report changes promptly using SBAR communication.`,
      `Medication safety: Verify the rights of medication administration (right patient, drug, dose, route, time, documentation, reason, response).`,
      `Patient education should be culturally sensitive and adapted to the patient's health literacy level.`,
      `Monitor for adverse drug reactions and drug interactions, especially with polypharmacy in elderly patients.`,
      `Prioritize nursing interventions using Maslow's hierarchy and the ABCs of emergency care.`,
      `Evidence-based practice guidelines should inform clinical decisions related to ${domain.toLowerCase()} nursing.`,
      `Collaborate with the interprofessional team for optimal patient outcomes.`,
    ]},

    { type: "subheading", text: "Common Exam Pitfalls" },
    { type: "list", items: [
      `Confusing similar-sounding conditions or medications within ${domain.toLowerCase()} - read each question stem carefully.`,
      `Selecting interventions outside the RN scope of practice (e.g., prescribing medications, ordering diagnostic tests independently).`,
      `Choosing to assess before intervening when the patient is in acute distress - safety-first actions take priority.`,
      `Overlooking the importance of patient education and discharge teaching as nursing interventions.`,
      `Failing to recognize priority assessment findings that indicate clinical deterioration.`,
      `Confusing subjective data (symptoms) with objective data (signs) in assessment documentation.`,
      `Not recognizing delegation principles - knowing what can be delegated to UAP vs. LPN vs. what requires RN assessment.`,
      `Selecting "notify the healthcare provider" as the first action when an independent nursing intervention is appropriate.`,
    ]},
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

        const content = generateLessonContent(topic.title, topic.domain, topic.tags, topic.keywords);
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
