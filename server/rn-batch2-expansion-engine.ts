import crypto from "crypto";
import { pool } from "./storage";
import { getProdPool, hasSeparateProdDb } from "./db";
import OpenAI from "openai";
import { checkDuplicateStem } from "./question-bank-validation";

const BATCH_SIZE = 25;
const MAX_TOPIC_RETRIES = 3;

const DIFFICULTY_DISTRIBUTION = { easy: 0.30, moderate: 0.40, hard: 0.20, critical_thinking: 0.10 };
const DIFFICULTY_MAP: Record<string, number> = { easy: 1, moderate: 3, hard: 5, critical_thinking: 7 };
const MASTERY_MAP: Record<string, string> = {
  easy: "low_mastery",
  moderate: "moderate_mastery",
  hard: "high_mastery",
  critical_thinking: "high_mastery",
};

const CATEGORY_FALLBACK_LESSONS: Record<string, { title: string; slug: string }> = {
  "Maternal/Newborn": { title: "Maternal-Newborn Nursing", slug: "maternal-newborn-nursing" },
  "Pediatrics": { title: "Pediatric Nursing", slug: "pediatrics" },
  "Mental Health": { title: "Mental Health Nursing", slug: "mental-health-nursing" },
  "Leadership/Delegation": { title: "Nursing Leadership & Management", slug: "leadership-management" },
  "Critical Care": { title: "Critical Care Nursing", slug: "critical-care-nursing" },
  "Community Health": { title: "Community Health Nursing", slug: "community-health" },
  "Emergency Nursing": { title: "Emergency Nursing", slug: "emergency-nursing" },
};

interface CategoryConfig {
  name: string;
  domain: string;
  targetCount: number;
  topics: string[];
  scopePrompt: string;
}

const BATCH2_CATEGORIES: CategoryConfig[] = [
  {
    name: "Maternal/Newborn",
    domain: "Maternal/Newborn Nursing",
    targetCount: 100,
    topics: [
      "Antepartum Assessment & Prenatal Care",
      "High-Risk Pregnancy: Gestational Diabetes & Hypertensive Disorders",
      "Preeclampsia & Eclampsia Management",
      "Placenta Previa & Placental Abruption",
      "Fetal Heart Rate Monitoring & Interpretation",
      "Intrapartum Nursing: Stages of Labor",
      "Labor Induction & Augmentation",
      "Cesarean Section Nursing Care",
      "Postpartum Assessment & Complications",
      "Postpartum Hemorrhage & Uterine Atony",
      "Breastfeeding Support & Lactation",
      "Newborn Assessment: APGAR & Gestational Age",
      "Newborn Complications: Jaundice & Hypoglycemia",
      "Rh Incompatibility & Blood Type Sensitization",
      "Ectopic Pregnancy & Spontaneous Abortion",
      "Prenatal Screening & Diagnostic Testing",
      "Magnesium Sulfate Administration & Monitoring",
      "Oxytocin Administration & Safety",
      "Maternal Infection: GBS, TORCH, STI",
      "Neonatal Resuscitation & Transitional Care",
    ],
    scopePrompt: `You are a senior NCLEX-RN Maternal/Newborn Nursing exam item writer with extensive labor & delivery and postpartum experience.
Focus on: antepartum assessment, high-risk pregnancy management, intrapartum nursing care, fetal monitoring interpretation, postpartum assessment and complications, newborn assessment and care, breastfeeding support, and maternal-newborn pharmacology.
RN scope includes: initiating interventions for complications, interpreting fetal heart rate patterns, administering high-alert medications (magnesium sulfate, oxytocin), performing comprehensive maternal and newborn assessments, and coordinating care for high-risk patients.
Questions must include realistic obstetric vital signs, fetal heart rate data, laboratory values, and time-critical clinical scenarios.`,
  },
  {
    name: "Pediatrics",
    domain: "Pediatric Nursing",
    targetCount: 100,
    topics: [
      "Growth & Development Milestones: Infant to Adolescent",
      "Pediatric Respiratory: Croup, Epiglottitis, RSV, Bronchiolitis",
      "Pediatric Asthma Management",
      "Pediatric Cardiac: Congenital Heart Defects",
      "Pediatric GI: Pyloric Stenosis, Intussusception, Hirschsprung",
      "Pediatric Dehydration & Fluid Management",
      "Pediatric Diabetes: Type 1 DM & DKA",
      "Pediatric Seizure Disorders & Febrile Seizures",
      "Pediatric Infectious Diseases: Measles, Varicella, Pertussis",
      "Childhood Immunization Schedules",
      "Pediatric Oncology: Leukemia & Wilms Tumor",
      "Pediatric Orthopedic: Fractures, Scoliosis, Hip Dysplasia",
      "Pediatric Burns & Poisoning",
      "Pediatric Pain Assessment: FLACC, Wong-Baker",
      "Family-Centered Care & Parental Teaching",
      "Pediatric Pharmacology: Weight-Based Dosing",
      "Pediatric Neurological: Hydrocephalus, Spina Bifida, Meningitis",
      "Pediatric Renal: Nephrotic Syndrome & UTI",
      "Pediatric Hematology: Sickle Cell Disease & ITP",
      "Child Abuse Recognition & Mandatory Reporting",
    ],
    scopePrompt: `You are a senior NCLEX-RN Pediatric Nursing exam item writer with extensive pediatric clinical experience.
Focus on: growth and development milestones, age-appropriate assessment, common childhood illnesses, pediatric-specific pharmacology and weight-based dosing, family-centered care, developmental considerations in nursing care, pediatric emergency recognition, and child safety.
RN scope includes: performing age-appropriate assessments, calculating weight-based medication doses, recognizing developmental delays, teaching families about disease management, identifying signs of child abuse, and managing acute pediatric conditions.
Questions must include specific age-related vital sign ranges, growth parameters, weight-based calculations, and developmentally appropriate clinical scenarios.`,
  },
  {
    name: "Mental Health",
    domain: "Mental Health Nursing",
    targetCount: 80,
    topics: [
      "Therapeutic Communication Techniques",
      "Nurse-Patient Relationship Boundaries",
      "Major Depressive Disorder: Assessment & Interventions",
      "Bipolar Disorder: Mania & Depression Management",
      "Schizophrenia: Positive & Negative Symptoms",
      "Anxiety Disorders: GAD, Panic, Phobias, OCD",
      "PTSD & Trauma-Informed Care",
      "Substance Use Disorders & Withdrawal Management",
      "Alcohol Withdrawal & Delirium Tremens",
      "Suicide Risk Assessment & Safety Planning",
      "Crisis Intervention & De-escalation",
      "Psychopharmacology: Antidepressants (SSRIs, SNRIs, TCAs, MAOIs)",
      "Psychopharmacology: Antipsychotics & Side Effects",
      "Psychopharmacology: Mood Stabilizers & Lithium Monitoring",
      "Psychopharmacology: Anxiolytics & Benzodiazepines",
      "Eating Disorders: Anorexia & Bulimia Nervosa",
      "Personality Disorders: Borderline & Antisocial",
      "Cognitive Disorders: Delirium vs Dementia",
      "Involuntary Commitment & Patient Rights",
      "Milieu Therapy & Group Therapy",
    ],
    scopePrompt: `You are a senior NCLEX-RN Mental Health Nursing exam item writer with extensive psychiatric nursing experience.
Focus on: therapeutic communication, crisis intervention, psychopharmacology, psychiatric assessment, safety planning, de-escalation techniques, substance use disorders, involuntary commitment, patient rights, and evidence-based psychiatric interventions.
RN scope includes: establishing therapeutic relationships, performing suicide risk assessments, administering and monitoring psychiatric medications, implementing safety precautions, facilitating group therapy, recognizing medication side effects (EPS, NMS, serotonin syndrome, lithium toxicity), and managing acute psychiatric crises.
Questions must include realistic psychiatric presentations, medication parameters, therapeutic communication scenarios, and ethical/legal dilemmas.`,
  },
  {
    name: "Leadership/Delegation",
    domain: "Leadership & Management",
    targetCount: 80,
    topics: [
      "Delegation Principles: Five Rights of Delegation",
      "Delegation to UAP, LPN/LVN vs RN Scope",
      "Prioritization: ABC Framework & Maslow's Hierarchy",
      "Triage & Priority Setting in Multiple Patient Scenarios",
      "Ethical Decision-Making: Autonomy, Beneficence, Justice",
      "Informed Consent & Patient Rights",
      "Advance Directives & End-of-Life Decisions",
      "HIPAA & Patient Confidentiality",
      "Incident Reporting & Error Disclosure",
      "Quality Improvement & Evidence-Based Practice",
      "Chain of Command & Conflict Resolution",
      "Supervision & Assignment Making",
      "Resource Management & Staffing",
      "Legal Issues: Malpractice, Negligence, Scope of Practice",
      "Restraint Use: Legal & Safety Considerations",
      "Organ Donation & Ethical Considerations",
      "Cultural Competency & Health Disparities",
      "Patient Education & Health Literacy",
      "Disaster Response & Emergency Preparedness Roles",
      "Interprofessional Collaboration & SBAR Communication",
    ],
    scopePrompt: `You are a senior NCLEX-RN Leadership & Management exam item writer with extensive nursing leadership experience.
Focus on: delegation principles, prioritization frameworks, ethical decision-making, legal issues in nursing, patient rights, quality improvement, interprofessional collaboration, conflict resolution, staffing decisions, and management of care.
RN scope includes: making delegation decisions based on scope of practice, prioritizing care for multiple patients, applying ethical principles, understanding legal responsibilities, implementing quality improvement measures, using SBAR communication, making assignment decisions, and supervising delegated care.
Questions must include realistic multi-patient scenarios, delegation dilemmas, prioritization challenges, and ethical/legal case studies with specific clinical contexts.`,
  },
  {
    name: "Critical Care",
    domain: "Critical Care Nursing",
    targetCount: 50,
    topics: [
      "Hemodynamic Monitoring: CVP, PA Catheter, Arterial Lines",
      "Mechanical Ventilation: Modes, Settings, Weaning",
      "ARDS: Pathophysiology & Nursing Management",
      "Sepsis & Septic Shock: Early Recognition & Bundles",
      "Cardiogenic Shock & Intra-Aortic Balloon Pump",
      "Cardiac Dysrhythmia Recognition & Treatment",
      "Acute Myocardial Infarction: STEMI & NSTEMI Management",
      "Intracranial Pressure Monitoring & Management",
      "Traumatic Brain Injury: Assessment & Interventions",
      "Post-Cardiac Surgery Nursing Care",
      "Acute Kidney Injury & CRRT",
      "DIC: Disseminated Intravascular Coagulation",
      "Electrolyte Emergencies: Hyper/Hypokalemia, Calcium, Sodium",
      "ABG Interpretation & Acid-Base Disorders",
      "Vasopressor & Inotrope Administration",
      "Blood Product Administration & Transfusion Reactions",
      "Sedation & Pain Management in ICU",
      "Ventilator-Associated Pneumonia Prevention",
      "Code Blue Management & ACLS Protocols",
      "End-of-Life Care in ICU & Organ Donation",
    ],
    scopePrompt: `You are a senior NCLEX-RN Critical Care Nursing exam item writer with extensive ICU experience.
Focus on: hemodynamic monitoring, mechanical ventilation, advanced cardiac care, neurological monitoring, sepsis management, complex medication administration, multi-system organ failure, and critical care pharmacology.
RN scope in critical care includes: interpreting hemodynamic data, managing ventilator settings, titrating vasoactive medications, performing continuous cardiac monitoring, managing invasive lines, interpreting ABGs, recognizing and responding to acute deterioration, and coordinating complex care.
Questions must include specific hemodynamic values, ventilator parameters, lab values, medication dosages, and time-critical clinical scenarios requiring rapid clinical judgment.`,
  },
  {
    name: "Community Health",
    domain: "Community Health Nursing",
    targetCount: 50,
    topics: [
      "Public Health Nursing Principles & Population Health",
      "Epidemiology: Disease Surveillance & Outbreak Investigation",
      "Communicable Disease Control & Contact Tracing",
      "Immunization Programs & Vaccine Administration",
      "Health Promotion & Disease Prevention Strategies",
      "Home Health Nursing Assessment & Care Planning",
      "School Health Nursing & Adolescent Health",
      "Case Management & Care Coordination",
      "Social Determinants of Health & Health Disparities",
      "Vulnerable Populations: Homeless, Elderly, Refugees",
      "Disaster Preparedness & Community Response",
      "Environmental Health Hazards",
      "Community Needs Assessment",
      "Occupational Health Nursing & Workplace Safety",
      "Telehealth & Remote Patient Monitoring",
      "Cultural Competency in Community Settings",
      "Chronic Disease Self-Management Programs",
      "Maternal & Child Community Health Programs",
      "Mental Health in the Community",
      "Community Health Program Evaluation",
    ],
    scopePrompt: `You are a senior NCLEX-RN Community Health Nursing exam item writer with extensive public health and community nursing experience.
Focus on: population health assessment, health promotion, disease prevention, community resource coordination, home health nursing, school health nursing, epidemiology, immunization programs, disaster preparedness, and vulnerable population care.
RN scope in community health includes: conducting community assessments, implementing health promotion programs, managing communicable disease outbreaks, performing home health assessments, coordinating case management, teaching community health education, and advocating for vulnerable populations.
Questions must include realistic community health scenarios, population data, epidemiological concepts, and public health policy applications.`,
  },
  {
    name: "Emergency Nursing",
    domain: "Emergency Nursing",
    targetCount: 50,
    topics: [
      "Emergency Triage: ESI Levels & Rapid Assessment",
      "Cardiac Emergencies: STEMI, Cardiac Arrest, Dysrhythmias",
      "Respiratory Emergencies: Status Asthmaticus, PE, Pneumothorax",
      "Neurological Emergencies: Stroke (NIHSS), Seizures",
      "Sepsis Recognition & Sepsis Bundle Implementation",
      "Toxicological Emergencies: Overdose & Poisoning",
      "Environmental Emergencies: Heat/Cold Injuries, Drowning",
      "Shock Recognition & Fluid Resuscitation",
      "Trauma Assessment: Primary & Secondary Survey",
      "Hemorrhage Control & Massive Transfusion Protocol",
      "Burn Assessment & Emergency Management",
      "Pain Assessment & Emergency Analgesia",
      "Psychiatric Emergencies & Behavioral Crises",
      "Pediatric Emergencies: Assessment & Interventions",
      "Obstetric Emergencies: Eclampsia, Precipitous Delivery",
      "Emergency Pharmacology: High-Alert Medications",
      "Procedural Sedation & Airway Management",
      "ECG Interpretation in Emergency Settings",
      "Mass Casualty Incident & Disaster Triage",
      "Patient Stabilization & Transfer Protocols",
    ],
    scopePrompt: `You are a senior NCLEX-RN Emergency Nursing exam item writer with extensive emergency department experience.
Focus on: triage decision-making, rapid assessment, emergency interventions, stabilization, time-critical protocols, emergency pharmacology, and multi-system emergency management.
RN scope in emergency settings includes: performing ESI triage, initiating life-saving interventions, administering emergency medications, interpreting ECGs, managing trauma patients, coordinating rapid diagnostics, and making time-critical clinical decisions.
Questions must include realistic vital signs, lab values, ECG findings, and emergency clinical scenarios requiring rapid clinical judgment and prioritization.`,
  },
];

const IMAGE_KEYWORD_MAP: Record<string, { file: string; alt: string; caption: string; description: string }[]> = {
  "preeclampsia": [{ file: "preeclampsia", alt: "Preeclampsia illustration", caption: "Preeclampsia", description: "Hypertensive disorder of pregnancy" }],
  "placental abruption": [{ file: "placentalabruption_1773375118294", alt: "Placental abruption illustration", caption: "Placental Abruption", description: "Premature placental separation" }],
  "postpartum hemorrhage": [{ file: "postpartumhemorrhage", alt: "Postpartum hemorrhage illustration", caption: "Postpartum Hemorrhage", description: "PPH: uterine atony, 4 T's, fundal massage" }],
  "gestational diabetes": [{ file: "gestationaldiabetes", alt: "Gestational diabetes illustration", caption: "Gestational Diabetes", description: "Glucose intolerance in pregnancy" }],
  "fetal monitoring": [{ file: "fetalmonitoring", alt: "Fetal monitoring illustration", caption: "Fetal Monitoring", description: "EFM categories, decelerations, interventions" }],
  "pyloric stenosis": [{ file: "pyloricstenosis_1773375303320.png", alt: "Pyloric stenosis illustration", caption: "Pyloric Stenosis", description: "Non-bilious projectile vomiting, olive-shaped mass" }],
  "sickle cell": [{ file: "sicklecell", alt: "Sickle cell illustration", caption: "Sickle Cell Disease", description: "Sickle cell crisis prevention and management" }],
  "asthma": [{ file: "asthma", alt: "Asthma illustration", caption: "Asthma", description: "Airway inflammation and bronchospasm" }],
  "seizure": [{ file: "seizure", alt: "Seizure illustration", caption: "Seizure Management", description: "Seizure types, medications, nursing care" }],
  "diabetes": [{ file: "diabetes", alt: "Diabetes management infographic", caption: "Diabetes Overview", description: "Key concepts in diabetes management and monitoring" }],
  "heart failure": [{ file: "heartfailure", alt: "Heart failure illustration", caption: "Heart Failure", description: "HF pathophysiology, left vs right-sided, treatment" }],
  "cardiac tamponade": [{ file: "cardiactamponade", alt: "Cardiac tamponade illustration", caption: "Cardiac Tamponade", description: "Beck's triad: hypotension, muffled heart sounds, JVD" }],
  "schizophrenia": [{ file: "schizophrenia", alt: "Schizophrenia illustration", caption: "Schizophrenia", description: "Positive and negative symptoms, antipsychotics" }],
  "depression": [{ file: "depression", alt: "Depression illustration", caption: "Depression", description: "Major depressive disorder assessment and treatment" }],
  "bipolar": [{ file: "bipolar", alt: "Bipolar disorder illustration", caption: "Bipolar Disorder", description: "Mania, depression, lithium monitoring" }],
  "stroke": [{ file: "stroke", alt: "Stroke illustration", caption: "Stroke", description: "Ischemic vs hemorrhagic stroke" }],
  "pneumonia": [{ file: "pneumonia", alt: "Pneumonia illustration", caption: "Pneumonia", description: "Lung infection: types, assessment, treatment" }],
  "copd": [{ file: "copd", alt: "COPD illustration", caption: "COPD", description: "Chronic obstructive pulmonary disease management" }],
  "burns": [{ file: "burns", alt: "Burns illustration", caption: "Burns", description: "Burn classification and nursing management" }],
  "opioid overdose": [{ file: "opioid", alt: "Opioid overdose illustration", caption: "Opioid Overdose", description: "Respiratory depression, naloxone reversal" }],
  "compartment syndrome": [{ file: "compartmentsyndrome.png", alt: "Compartment syndrome illustration", caption: "Compartment Syndrome", description: "5 P's, fasciotomy, neurovascular assessment" }],
  "fracture": [{ file: "fracture", alt: "Fracture illustration", caption: "Fracture", description: "Types, assessment, and management" }],
  "anemia": [{ file: "anemia", alt: "Anemia illustration", caption: "Anemia", description: "Types of anemia and nursing management" }],
  "abg": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ABG Interpretation", description: "Arterial blood gas interpretation guide" }],
  "arterial blood gas": [{ file: "ABGreference", alt: "ABG reference chart", caption: "ABG Interpretation", description: "Arterial blood gas interpretation guide" }],
  "pulmonary embolism": [{ file: "pe", alt: "Pulmonary embolism illustration", caption: "Pulmonary Embolism", description: "PE signs, treatment, prevention" }],
  "dvt": [{ file: "dvt", alt: "DVT illustration", caption: "Deep Vein Thrombosis", description: "Venous thromboembolism prevention and treatment" }],
  "hypothyroidism": [{ file: "hypothyroidism_1773374939606", alt: "Hypothyroidism illustration", caption: "Hypothyroidism", description: "Decreased thyroid hormone, weight gain, fatigue" }],
  "hyperthyroidism": [{ file: "hyperthyroidism", alt: "Hyperthyroidism illustration", caption: "Hyperthyroidism", description: "Thyroid storm, weight loss, tachycardia" }],
  "pancreatitis": [{ file: "pancreatitis", alt: "Pancreatitis illustration", caption: "Pancreatitis", description: "Pancreatic inflammation: Cullen's, Grey Turner's" }],
  "hepatitis": [{ file: "hepatitisb", alt: "Hepatitis illustration", caption: "Hepatitis", description: "Viral hepatitis: transmission and management" }],
  "osteoporosis": [{ file: "osteoporosis", alt: "Osteoporosis illustration", caption: "Osteoporosis", description: "Bone density loss, bisphosphonates" }],
  "cushing": [{ file: "cushing.png", alt: "Cushing syndrome illustration", caption: "Cushing Syndrome", description: "Cortisol excess: moon face, buffalo hump" }],
  "addison": [{ file: "addisons", alt: "Addison's disease illustration", caption: "Addison's Disease", description: "Adrenal insufficiency: hypotension, hyperpigmentation" }],
  "multiple sclerosis": [{ file: "MS", alt: "Multiple sclerosis illustration", caption: "Multiple Sclerosis", description: "Autoimmune demyelinating disease" }],
  "myasthenia gravis": [{ file: "myastheniagravis", alt: "Myasthenia gravis illustration", caption: "Myasthenia Gravis", description: "Autoimmune neuromuscular junction disorder" }],
};

const LESSON_TOPIC_MAP: Record<string, { title: string; slug: string }> = {
  "preeclampsia": { title: "Preeclampsia & Eclampsia", slug: "preeclampsia" },
  "gestational diabetes": { title: "Gestational Diabetes", slug: "gestational-diabetes" },
  "labor": { title: "Stages of Labor", slug: "stages-of-labor" },
  "postpartum": { title: "Postpartum Care", slug: "postpartum" },
  "newborn": { title: "Newborn Assessment", slug: "newborn-assessment" },
  "breastfeeding": { title: "Breastfeeding & Lactation", slug: "breastfeeding" },
  "fetal monitoring": { title: "Fetal Heart Rate Monitoring", slug: "fetal-monitoring" },
  "magnesium sulfate": { title: "Magnesium Sulfate Administration", slug: "magnesium-sulfate" },
  "oxytocin": { title: "Oxytocin Administration", slug: "oxytocin-administration" },
  "placenta previa": { title: "Placenta Previa", slug: "placenta-previa" },
  "placental abruption": { title: "Placental Abruption", slug: "placental-abruption" },
  "pediatric": { title: "Pediatric Nursing", slug: "pediatrics" },
  "growth and development": { title: "Growth & Development", slug: "growth-development" },
  "immunization": { title: "Immunization Schedules", slug: "immunization-schedules" },
  "croup": { title: "Croup Management", slug: "croup" },
  "epiglottitis": { title: "Epiglottitis", slug: "epiglottitis" },
  "pyloric stenosis": { title: "Pyloric Stenosis", slug: "pyloric-stenosis" },
  "congenital heart": { title: "Congenital Heart Defects", slug: "congenital-heart-defects" },
  "sickle cell": { title: "Sickle Cell Disease", slug: "sickle-cell-crisis" },
  "leukemia": { title: "Childhood Leukemia", slug: "childhood-leukemia" },
  "child abuse": { title: "Child Abuse Recognition", slug: "child-abuse-recognition" },
  "depression": { title: "Depression", slug: "depression" },
  "anxiety": { title: "Anxiety Disorders", slug: "anxiety" },
  "schizophrenia": { title: "Schizophrenia", slug: "schizophrenia" },
  "bipolar": { title: "Bipolar Disorder", slug: "bipolar" },
  "therapeutic communication": { title: "Therapeutic Communication", slug: "therapeutic-communication" },
  "suicide": { title: "Suicide Risk Assessment", slug: "suicide-risk-assessment" },
  "substance abuse": { title: "Substance Use Disorders", slug: "substance-use-disorders" },
  "alcohol withdrawal": { title: "Alcohol Withdrawal", slug: "alcohol-withdrawal" },
  "lithium": { title: "Lithium Monitoring", slug: "lithium-monitoring" },
  "antidepressant": { title: "Antidepressant Therapy", slug: "antidepressant-therapy" },
  "antipsychotic": { title: "Antipsychotic Medications", slug: "antipsychotic-medications" },
  "eating disorder": { title: "Eating Disorders", slug: "eating-disorders" },
  "delirium": { title: "Delirium vs Dementia", slug: "delirium-vs-dementia" },
  "delegation": { title: "Delegation", slug: "delegation" },
  "prioritization": { title: "Prioritization", slug: "prioritization" },
  "informed consent": { title: "Informed Consent", slug: "informed-consent" },
  "restraint": { title: "Restraint Use", slug: "restraints" },
  "ethics": { title: "Nursing Ethics", slug: "ethics" },
  "hipaa": { title: "HIPAA & Confidentiality", slug: "hipaa-confidentiality" },
  "malpractice": { title: "Malpractice & Negligence", slug: "malpractice-negligence" },
  "advance directive": { title: "Advance Directives", slug: "advance-directives" },
  "quality improvement": { title: "Quality Improvement", slug: "quality-improvement" },
  "sbar": { title: "SBAR Communication", slug: "sbar-communication" },
  "disaster": { title: "Disaster Preparedness", slug: "disaster-preparedness" },
  "mechanical ventilation": { title: "Mechanical Ventilation", slug: "mechanical-ventilation" },
  "hemodynamic": { title: "Hemodynamic Monitoring", slug: "hemodynamic-monitoring" },
  "ards": { title: "ARDS Management", slug: "ards" },
  "sepsis": { title: "Sepsis Management", slug: "sepsis" },
  "shock": { title: "Types of Shock", slug: "shock-management" },
  "cardiac dysrhythmia": { title: "Cardiac Dysrhythmias", slug: "cardiac-dysrhythmias" },
  "myocardial infarction": { title: "Acute MI Management", slug: "acute-mi" },
  "intracranial pressure": { title: "ICP Management", slug: "icp-management" },
  "electrolyte": { title: "Electrolyte Imbalances", slug: "electrolyte-imbalances" },
  "abg": { title: "ABG Interpretation", slug: "abg-interpretation" },
  "acid-base": { title: "Acid-Base Disorders", slug: "acid-base-disorders" },
  "blood transfusion": { title: "Blood Product Administration", slug: "blood-transfusion" },
  "triage": { title: "Emergency Triage", slug: "triage" },
  "stroke": { title: "Stroke Assessment", slug: "stroke" },
  "seizure": { title: "Seizure Management", slug: "seizure-disorders" },
  "pneumonia": { title: "Pneumonia", slug: "pneumonia" },
  "burns": { title: "Burns", slug: "burns" },
  "fracture": { title: "Fracture Management", slug: "fractures" },
  "trauma": { title: "Trauma Assessment", slug: "trauma" },
  "anemia": { title: "Anemia", slug: "anemia" },
  "heart failure": { title: "Heart Failure Management", slug: "heart-failure" },
  "diabetes": { title: "Diabetes Management", slug: "diabetes-management" },
  "hypertension": { title: "Hypertension", slug: "hypertension" },
  "renal": { title: "Renal Disorders", slug: "renal" },
  "thyroid": { title: "Thyroid Disorders", slug: "thyroid" },
  "dvt": { title: "Deep Vein Thrombosis", slug: "dvt" },
  "pulmonary embolism": { title: "Pulmonary Embolism", slug: "pulmonary-embolism" },
  "compartment syndrome": { title: "Compartment Syndrome", slug: "compartment-syndrome" },
  "infection control": { title: "Infection Control", slug: "infection-control" },
  "epidemiology": { title: "Epidemiology Fundamentals", slug: "epidemiology" },
  "communicable disease": { title: "Communicable Disease Control", slug: "communicable-disease" },
  "home health": { title: "Home Health Nursing", slug: "home-health-nursing" },
  "community health": { title: "Community Health Nursing", slug: "community-health" },
  "cultural competency": { title: "Cultural Competency", slug: "cultural-competency" },
  "telehealth": { title: "Telehealth Nursing", slug: "telehealth-nursing" },
  "pain management": { title: "Pain Management", slug: "pain-management" },
  "copd": { title: "COPD Management", slug: "copd" },
  "asthma": { title: "Asthma Management", slug: "asthma" },
};

interface Batch2Progress {
  category: string;
  batchNumber: number;
  questionsGenerated: number;
  flashcardsCreated: number;
  imagesAttached: number;
  lessonLinksAdded: number;
  duplicatesRejected: number;
}

interface Batch2Summary {
  totalQuestionsInserted: number;
  totalFlashcardsCreated: number;
  totalImagesAttached: number;
  totalLessonLinksAdded: number;
  totalDuplicatesRejected: number;
  categoryDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  startedAt: string;
  completedAt: string;
  batches: Batch2Progress[];
}

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

function computeStemHash(stem: string): string {
  return crypto.createHash("md5").update(stem.toLowerCase().trim()).digest("hex");
}

function computeContentHash(stem: string): string {
  return crypto.createHash("sha256").update(`rn-batch2:${stem}`).digest("hex").slice(0, 32);
}

function assignDifficulty(batchIndex: number, totalInBatch: number): string {
  const easyCount = Math.round(totalInBatch * DIFFICULTY_DISTRIBUTION.easy);
  const modCount = Math.round(totalInBatch * DIFFICULTY_DISTRIBUTION.moderate);
  const hardCount = Math.round(totalInBatch * DIFFICULTY_DISTRIBUTION.hard);
  if (batchIndex < easyCount) return "easy";
  if (batchIndex < easyCount + modCount) return "moderate";
  if (batchIndex < easyCount + modCount + hardCount) return "hard";
  return "critical_thinking";
}

function buildBatch2Prompt(
  config: CategoryConfig,
  topic: string,
  count: number,
  difficulties: string[],
  existingStems: string[],
): { system: string; user: string } {
  const diffCounts: Record<string, number> = {};
  for (const d of difficulties) diffCounts[d] = (diffCounts[d] || 0) + 1;

  const diffBlock = Object.entries(diffCounts)
    .map(([d, c]) => `- ${d}: ${c} questions`)
    .join("\n");

  const antiDupe = existingStems.length > 0
    ? `\nAvoid duplicating these recent stems:\n${existingStems.slice(-15).map((s, i) => `${i + 1}. ${s.substring(0, 80)}...`).join("\n")}`
    : "";

  const system = `${config.scopePrompt}

CRITICAL RULES:
1. Output ONLY valid JSON. No markdown, no code fences, no prose.
2. NEVER copy or reference instructions in any output field.
3. Every question must have a unique, distinct clinical scenario.
4. Do NOT use any emoji characters. Plain text only.
5. Each question's rationale MUST be 80-150 words and include:
   - Why the correct answer is right
   - Why EACH distractor (wrong answer) is wrong
   - A clinical application note
   - A nursing intervention note
6. Include a clinical pearl for each question.
7. All scenarios must be NCLEX-RN style requiring clinical judgment at the application/analysis level.
8. Include specific patient data: vital signs, lab values, assessment findings, patient demographics.
9. Each correct answer must be clearly the BEST answer, not just a correct one.

Domain: ${config.domain}
Topic Focus: ${topic}

You will generate exactly ${count} questions for "${topic}" within ${config.domain}.

Difficulty distribution:
${diffBlock}

Return JSON: {"items": [...]} with exactly ${count} question objects.

Each question object schema:
{
  "stem": "A detailed clinical scenario question (min 60 chars, includes specific patient data)",
  "scenario": "Extended clinical context with additional patient history and presentation details",
  "options": [{"label": "A", "text": "..."}, {"label": "B", "text": "..."}, {"label": "C", "text": "..."}, {"label": "D", "text": "..."}],
  "correct_answer": "B",
  "difficulty": "easy" | "moderate" | "hard" | "critical_thinking",
  "domain": "${config.domain}",
  "rationale": "Detailed 80-150 word rationale: why correct + why each wrong + clinical application + nursing intervention",
  "clinical_pearl": "A concise clinical pearl for exam prep",
  "topic": "${topic}",
  "subtopic": "Specific subtopic within ${topic}",
  "body_system": "Related body system"
}

MCQ rules: exactly 4 choices (A-D), exactly 1 correct answer letter.
${antiDupe}

Return EXACTLY ${count} items. JSON only. No extra text.`;

  const user = `Generate ${count} unique NCLEX-RN exam questions for "${topic}" in ${config.domain}. Each must have a distinct clinical scenario with specific patient data, realistic vital signs or assessment findings, and require clinical judgment at the application/analysis level.`;

  return { system, user };
}

function matchImagesForQuestion(stem: string, rationale: string, topic: string, domain: string): { imageUrl: string; imageAlt: string; imageCaption: string; imageDescription: string }[] {
  const searchText = `${stem} ${rationale} ${topic} ${domain}`.toLowerCase();
  const matches: { imageUrl: string; imageAlt: string; imageCaption: string; imageDescription: string }[] = [];

  for (const [keyword, images] of Object.entries(IMAGE_KEYWORD_MAP)) {
    if (searchText.includes(keyword)) {
      for (const img of images) {
        if (!matches.find(m => m.imageUrl.includes(img.file))) {
          matches.push({
            imageUrl: `/attached_assets/${img.file}`,
            imageAlt: img.alt,
            imageCaption: img.caption,
            imageDescription: img.description,
          });
        }
      }
    }
  }

  return matches.slice(0, 3);
}

function findLessonLink(stem: string, rationale: string, topic: string, categoryName: string): { title: string; url: string } {
  const searchText = `${stem} ${rationale} ${topic}`.toLowerCase();

  for (const [keyword, lesson] of Object.entries(LESSON_TOPIC_MAP)) {
    if (searchText.includes(keyword)) {
      return {
        title: lesson.title,
        url: `/lessons/${lesson.slug}-rn`,
      };
    }
  }

  const fallback = CATEGORY_FALLBACK_LESSONS[categoryName] || { title: "Nursing Review", slug: "nursing-review" };
  return {
    title: fallback.title,
    url: `/lessons/${fallback.slug}-rn`,
  };
}

function appendLessonLinkToRationale(rationale: string, lessonLink: { title: string; url: string }): string {
  return `${rationale}\n\nTo review this concept, see the NurseNest lesson: ${lessonLink.title} → ${lessonLink.url}`;
}

function buildFlashcardBack(
  correctAnswer: string,
  options: { label: string; text: string }[],
  rationale: string,
  clinicalPearl: string,
  lessonLink: { title: string; url: string } | null,
): string {
  const parts: string[] = [];
  const correctOpt = options.find(o => o.label === correctAnswer);
  if (correctOpt) {
    parts.push(`Correct Answer: ${correctOpt.label}. ${correctOpt.text}`);
  }
  parts.push(`\nRationale: ${rationale}`);
  if (clinicalPearl) {
    parts.push(`\nClinical Pearl: ${clinicalPearl}`);
  }
  if (lessonLink) {
    parts.push(`\nTo review this concept, see the NurseNest lesson: ${lessonLink.title} → ${lessonLink.url}`);
  }
  return parts.join("\n");
}

function validateQuestion(q: any): boolean {
  if (!q.stem || typeof q.stem !== "string" || q.stem.length < 40) return false;
  if (!Array.isArray(q.options) || q.options.length < 4) return false;
  if (!q.correct_answer) return false;
  if (!q.rationale || typeof q.rationale !== "string" || q.rationale.length < 20) return false;
  return true;
}

async function getExistingStemHashes(dbPool: any): Promise<Set<string>> {
  const { rows } = await dbPool.query(
    `SELECT stem_hash FROM exam_questions WHERE stem_hash IS NOT NULL`
  );
  return new Set(rows.map((r: any) => r.stem_hash));
}

async function generateBatch(
  openai: OpenAI,
  config: CategoryConfig,
  topic: string,
  count: number,
  existingStems: string[],
  maxRetries: number = 2,
): Promise<any[]> {
  const difficulties: string[] = [];
  for (let i = 0; i < count; i++) {
    difficulties.push(assignDifficulty(i, count));
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { system, user } = buildBatch2Prompt(config, topic, count, difficulties, existingStems);

      const resp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.4,
        max_tokens: Math.min(count * 700 + 500, 16384),
        response_format: { type: "json_object" },
      });

      const content = resp.choices[0]?.message?.content || "{}";
      let cleaned = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }

      const parsed = JSON.parse(cleaned);
      const items = Array.isArray(parsed.items) ? parsed.items
        : Array.isArray(parsed.questions) ? parsed.questions
        : Array.isArray(parsed) ? parsed : [];

      if (items.length > 0) return items;

      console.log(`[RN-Batch2] Attempt ${attempt + 1}: 0 items parsed for ${topic}, retrying...`);
    } catch (err: any) {
      console.error(`[RN-Batch2] Attempt ${attempt + 1} failed for ${topic}:`, err.message);
    }

    if (attempt < maxRetries) await new Promise(r => setTimeout(r, 1500));
  }

  return [];
}

export async function runRNBatch2Expansion(
  onProgress?: (p: Batch2Progress) => void,
): Promise<Batch2Summary> {
  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;

  console.log(`[RN-Batch2] Starting RN Batch 2 expansion: 510 questions across 7 categories, targeting ${hasSeparateProdDb() ? "PRODUCTION" : "DEVELOPMENT"} database`);

  const openai = getOpenAI();
  const existingHashes = await getExistingStemHashes(dbPool);
  const startedAt = new Date().toISOString();
  const batches: Batch2Progress[] = [];

  let totalInserted = 0;
  let totalFlashcards = 0;
  let totalImages = 0;
  let totalLessonLinks = 0;
  let totalDuplicates = 0;
  let batchNumber = 0;
  const recentStems: string[] = [];

  const categoryDistribution: Record<string, number> = {};
  const difficultyDistribution: Record<string, number> = {};

  for (const config of BATCH2_CATEGORIES) {
    console.log(`[RN-Batch2] Starting category: ${config.name} (target: ${config.targetCount} questions)`);

    const perTopic = Math.floor(config.targetCount / config.topics.length);
    const remainder = config.targetCount % config.topics.length;
    const topicPlan: { topic: string; count: number }[] = config.topics.map((t, i) => ({
      topic: t,
      count: perTopic + (i < remainder ? 1 : 0),
    }));

    for (const { topic, count: topicTarget } of topicPlan) {
      let topicRemaining = topicTarget;
      let topicRetries = 0;

      while (topicRemaining > 0) {
        const thisBatchSize = Math.min(BATCH_SIZE, topicRemaining);
        batchNumber++;

        console.log(`[RN-Batch2] Batch ${batchNumber}: ${thisBatchSize} questions for "${topic}" (${config.name})`);

        try {
          await dbPool.query(
            `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
             VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
            [
              `rn-batch2-${config.name.toLowerCase().replace(/[\s/]+/g, "-")}`,
              "rn_batch2_start",
              JSON.stringify({ category: config.name, batchNumber, topic, batchSize: thisBatchSize, totalInserted }),
            ]
          );
        } catch (logErr: any) {
          console.error(`[RN-Batch2] Event log error:`, logErr.message);
        }

        const items = await generateBatch(openai, config, topic, thisBatchSize, recentStems);

        let batchInserted = 0;
        let batchFlashcards = 0;
        let batchImages = 0;
        let batchLessonLinks = 0;
        let batchDuplicates = 0;

        for (const item of items) {
          if (!validateQuestion(item)) continue;

          const stemHash = computeStemHash(item.stem);
          if (existingHashes.has(stemHash)) {
            batchDuplicates++;
            continue;
          }

          const dupCheck = await checkDuplicateStem(item.stem, "rn");
          if (dupCheck.isDuplicate) {
            batchDuplicates++;
            continue;
          }

          const difficulty = item.difficulty || "moderate";
          const difficultyNum = DIFFICULTY_MAP[difficulty] || 3;
          const masteryCategory = MASTERY_MAP[difficulty] || "moderate_mastery";
          const lessonLink = findLessonLink(item.stem, item.rationale, item.topic || topic, config.name);
          const rationaleWithLink = appendLessonLinkToRationale(item.rationale, lessonLink);
          const images = matchImagesForQuestion(item.stem, item.rationale, item.topic || topic, config.domain);

          const options = Array.isArray(item.options) ? item.options.map((o: any, i: number) => {
            if (typeof o === "string") {
              const match = o.match(/^([A-H])\)\s*(.+)/);
              if (match) return { label: match[1], text: match[2] };
              return { label: String.fromCharCode(65 + i), text: o };
            }
            return { label: o.label || String.fromCharCode(65 + i), text: o.text || String(o) };
          }) : [];

          const correctAnswer = typeof item.correct_answer === "string" ? item.correct_answer : "A";

          const client = await dbPool.connect();
          try {
            await client.query("BEGIN");

            const tagsArray = [config.domain, config.name, masteryCategory, `difficulty_${difficulty}`, "rn_batch2_expansion"];

            const { rows: inserted } = await client.query(
              `INSERT INTO exam_questions (
                id, tier, exam, question_type, status, stem, options, correct_answer,
                rationale, difficulty, tags, body_system, topic, subtopic, region_scope,
                stem_hash, career_type, scenario, clinical_pearl, created_at, updated_at
              ) VALUES (
                gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7,
                $8, $9, $10::text[], $11, $12, $13, $14,
                $15, $16, $17, $18, NOW(), NOW()
              ) ON CONFLICT DO NOTHING RETURNING id`,
              [
                "rn",
                "RN-CAT",
                "multiple_choice",
                "approved",
                item.stem,
                JSON.stringify(options),
                JSON.stringify([correctAnswer]),
                rationaleWithLink,
                difficultyNum,
                tagsArray,
                item.body_system || config.domain,
                item.topic || topic,
                item.subtopic || topic,
                "BOTH",
                stemHash,
                "nursing",
                item.scenario || item.stem,
                item.clinical_pearl || "",
              ]
            );

            if (!inserted || inserted.length === 0) {
              await client.query("ROLLBACK");
              batchDuplicates++;
            } else {
              const questionId = inserted[0].id;
              existingHashes.add(stemHash);
              batchInserted++;
              categoryDistribution[config.name] = (categoryDistribution[config.name] || 0) + 1;
              difficultyDistribution[difficulty] = (difficultyDistribution[difficulty] || 0) + 1;
              recentStems.push(item.stem.substring(0, 100));
              if (recentStems.length > 30) recentStems.splice(0, recentStems.length - 20);

              batchLessonLinks++;
              if (images.length > 0) batchImages++;

              const flashcardFront = item.stem;
              const flashcardBack = buildFlashcardBack(
                correctAnswer, options, item.rationale, item.clinical_pearl || "", lessonLink,
              );
              const flashcardHash = computeContentHash(item.stem);

              const lessonLinks = [{ lessonTitle: lessonLink.title, lessonUrl: lessonLink.url, relevanceNote: `Related to ${config.domain}` }];

              const { rowCount: fcInserted } = await client.query(
                `INSERT INTO flashcard_bank (
                  id, tier, front, back, content_hash, status, source_type, source_question_id,
                  question_type, options, correct_answer, rationale_correct,
                  clinical_takeaway, exam_pearl, rationale_media, lesson_links,
                  difficulty, body_system, topic, subtopic, region_scope, flashcard_enabled,
                  category, career_type, created_at
                ) VALUES (
                  gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7,
                  $8, $9, $10, $11, $12, $13, $14, $15,
                  $16, $17, $18, $19, $20, $21, $22, $23, NOW()
                ) ON CONFLICT (content_hash) DO NOTHING`,
                [
                  "rn",
                  flashcardFront,
                  flashcardBack,
                  flashcardHash,
                  "approved",
                  "rn_batch2_expansion",
                  questionId,
                  "multiple_choice",
                  JSON.stringify(options),
                  JSON.stringify([correctAnswer]),
                  item.rationale,
                  item.clinical_pearl || null,
                  item.clinical_pearl || null,
                  JSON.stringify(images),
                  JSON.stringify(lessonLinks),
                  difficultyNum,
                  item.body_system || config.domain,
                  item.topic || topic,
                  item.subtopic || topic,
                  "BOTH",
                  true,
                  config.domain,
                  "nursing",
                ]
              );

              await client.query("COMMIT");
              if (fcInserted && fcInserted > 0) batchFlashcards++;
            }
          } catch (err: any) {
            await client.query("ROLLBACK").catch(() => {});
            if (err.code === "23505") {
              batchDuplicates++;
            } else {
              console.error(`[RN-Batch2] Insert error:`, err.message);
            }
          } finally {
            client.release();
          }
        }

        totalInserted += batchInserted;
        totalFlashcards += batchFlashcards;
        totalImages += batchImages;
        totalLessonLinks += batchLessonLinks;
        totalDuplicates += batchDuplicates;

        if (batchInserted > 0) {
          topicRemaining -= batchInserted;
        } else {
          topicRetries++;
          if (topicRetries >= MAX_TOPIC_RETRIES) {
            console.log(`[RN-Batch2] Max retries (${MAX_TOPIC_RETRIES}) reached for topic "${topic}" in ${config.name}, moving on`);
            topicRemaining = 0;
          }
        }

        const progress: Batch2Progress = {
          category: config.name,
          batchNumber,
          questionsGenerated: batchInserted,
          flashcardsCreated: batchFlashcards,
          imagesAttached: batchImages,
          lessonLinksAdded: batchLessonLinks,
          duplicatesRejected: batchDuplicates,
        };
        batches.push(progress);

        if (onProgress) onProgress(progress);

        try {
          await dbPool.query(
            `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
             VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
            [
              `rn-batch2-${config.name.toLowerCase().replace(/[\s/]+/g, "-")}`,
              "rn_batch2_complete",
              JSON.stringify({
                ...progress,
                totalInserted,
                totalFlashcards,
                totalImages,
                totalLessonLinks,
                totalDuplicates,
              }),
            ]
          );
        } catch (logErr: any) {
          console.error(`[RN-Batch2] Event log error:`, logErr.message);
        }

        console.log(`[RN-Batch2] Batch ${batchNumber} complete: ${batchInserted} inserted, ${batchFlashcards} flashcards, ${batchImages} images, ${batchLessonLinks} lessons, ${batchDuplicates} duplicates. Total: ${totalInserted}/510`);

        await new Promise(r => setTimeout(r, 500));
      }
    }

    console.log(`[RN-Batch2] Category "${config.name}" complete: ${categoryDistribution[config.name] || 0} questions inserted`);
  }

  const completedAt = new Date().toISOString();

  const summary: Batch2Summary = {
    totalQuestionsInserted: totalInserted,
    totalFlashcardsCreated: totalFlashcards,
    totalImagesAttached: totalImages,
    totalLessonLinksAdded: totalLessonLinks,
    totalDuplicatesRejected: totalDuplicates,
    categoryDistribution,
    difficultyDistribution,
    startedAt,
    completedAt,
    batches,
  };

  try {
    await dbPool.query(
      `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
      [
        "rn-batch2-expansion",
        "rn_batch2_expansion_complete",
        JSON.stringify(summary),
      ]
    );
  } catch (logErr: any) {
    console.error(`[RN-Batch2] Final event log error:`, logErr.message);
  }

  console.log(`[RN-Batch2] EXPANSION COMPLETE: ${totalInserted} questions inserted, ${totalFlashcards} flashcards, ${totalDuplicates} duplicates rejected`);
  console.log(`[RN-Batch2] Category distribution:`, JSON.stringify(categoryDistribution));
  console.log(`[RN-Batch2] Difficulty distribution:`, JSON.stringify(difficultyDistribution));

  return summary;
}

export async function runRNBatch2Category(
  categoryName: string,
  targetCount?: number,
  onProgress?: (p: Batch2Progress) => void,
): Promise<Batch2Summary> {
  const config = BATCH2_CATEGORIES.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
  if (!config) {
    throw new Error(`Unknown category: ${categoryName}. Valid categories: ${BATCH2_CATEGORIES.map(c => c.name).join(", ")}`);
  }

  const effectiveConfig = targetCount ? { ...config, targetCount } : config;
  const dbPool = hasSeparateProdDb() ? getProdPool() : pool;

  console.log(`[RN-Batch2] Starting single category: ${config.name} (target: ${effectiveConfig.targetCount} questions)`);

  const openai = getOpenAI();
  const existingHashes = await getExistingStemHashes(dbPool);
  const startedAt = new Date().toISOString();
  const batches: Batch2Progress[] = [];

  let totalInserted = 0;
  let totalFlashcards = 0;
  let totalImages = 0;
  let totalLessonLinks = 0;
  let totalDuplicates = 0;
  let batchNumber = 0;
  const recentStems: string[] = [];

  const categoryDistribution: Record<string, number> = {};
  const difficultyDistribution: Record<string, number> = {};

  const perTopic = Math.floor(effectiveConfig.targetCount / effectiveConfig.topics.length);
  const remainder = effectiveConfig.targetCount % effectiveConfig.topics.length;
  const topicPlan: { topic: string; count: number }[] = effectiveConfig.topics.map((t, i) => ({
    topic: t,
    count: perTopic + (i < remainder ? 1 : 0),
  }));

  for (const { topic, count: topicTarget } of topicPlan) {
    let topicRemaining = topicTarget;
    let topicRetries = 0;

    while (topicRemaining > 0) {
      const thisBatchSize = Math.min(BATCH_SIZE, topicRemaining);
      batchNumber++;

      console.log(`[RN-Batch2] Batch ${batchNumber}: ${thisBatchSize} questions for "${topic}" (${config.name})`);

      const items = await generateBatch(openai, effectiveConfig, topic, thisBatchSize, recentStems);

      let batchInserted = 0;
      let batchFlashcards = 0;
      let batchImages = 0;
      let batchLessonLinks = 0;
      let batchDuplicates = 0;

      for (const item of items) {
        if (!validateQuestion(item)) continue;

        const stemHash = computeStemHash(item.stem);
        if (existingHashes.has(stemHash)) {
          batchDuplicates++;
          continue;
        }

        const dupCheck = await checkDuplicateStem(item.stem, "rn");
        if (dupCheck.isDuplicate) {
          batchDuplicates++;
          continue;
        }

        const difficulty = item.difficulty || "moderate";
        const difficultyNum = DIFFICULTY_MAP[difficulty] || 3;
        const masteryCategory = MASTERY_MAP[difficulty] || "moderate_mastery";
        const lessonLink = findLessonLink(item.stem, item.rationale, item.topic || topic, config.name);
        const rationaleWithLink = appendLessonLinkToRationale(item.rationale, lessonLink);
        const images = matchImagesForQuestion(item.stem, item.rationale, item.topic || topic, config.domain);

        const options = Array.isArray(item.options) ? item.options.map((o: any, i: number) => {
          if (typeof o === "string") {
            const match = o.match(/^([A-H])\)\s*(.+)/);
            if (match) return { label: match[1], text: match[2] };
            return { label: String.fromCharCode(65 + i), text: o };
          }
          return { label: o.label || String.fromCharCode(65 + i), text: o.text || String(o) };
        }) : [];

        const correctAnswer = typeof item.correct_answer === "string" ? item.correct_answer : "A";

        const client = await dbPool.connect();
        try {
          await client.query("BEGIN");

          const tagsArray = [config.domain, config.name, masteryCategory, `difficulty_${difficulty}`, "rn_batch2_expansion"];

          const { rows: inserted } = await client.query(
            `INSERT INTO exam_questions (
              id, tier, exam, question_type, status, stem, options, correct_answer,
              rationale, difficulty, tags, body_system, topic, subtopic, region_scope,
              stem_hash, career_type, scenario, clinical_pearl, created_at, updated_at
            ) VALUES (
              gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7,
              $8, $9, $10::text[], $11, $12, $13, $14,
              $15, $16, $17, $18, NOW(), NOW()
            ) ON CONFLICT DO NOTHING RETURNING id`,
            [
              "rn",
              "RN-CAT",
              "multiple_choice",
              "approved",
              item.stem,
              JSON.stringify(options),
              JSON.stringify([correctAnswer]),
              rationaleWithLink,
              difficultyNum,
              tagsArray,
              item.body_system || config.domain,
              item.topic || topic,
              item.subtopic || topic,
              "BOTH",
              stemHash,
              "nursing",
              item.scenario || item.stem,
              item.clinical_pearl || "",
            ]
          );

          if (!inserted || inserted.length === 0) {
            await client.query("ROLLBACK");
            batchDuplicates++;
          } else {
            const questionId = inserted[0].id;
            existingHashes.add(stemHash);
            batchInserted++;
            categoryDistribution[config.name] = (categoryDistribution[config.name] || 0) + 1;
            difficultyDistribution[difficulty] = (difficultyDistribution[difficulty] || 0) + 1;
            recentStems.push(item.stem.substring(0, 100));
            if (recentStems.length > 30) recentStems.splice(0, recentStems.length - 20);

            batchLessonLinks++;
            if (images.length > 0) batchImages++;

            const flashcardFront = item.stem;
            const flashcardBack = buildFlashcardBack(
              correctAnswer, options, item.rationale, item.clinical_pearl || "", lessonLink,
            );
            const flashcardHash = computeContentHash(item.stem);

            const lessonLinks = [{ lessonTitle: lessonLink.title, lessonUrl: lessonLink.url, relevanceNote: `Related to ${config.domain}` }];

            const { rowCount: fcInserted } = await client.query(
              `INSERT INTO flashcard_bank (
                id, tier, front, back, content_hash, status, source_type, source_question_id,
                question_type, options, correct_answer, rationale_correct,
                clinical_takeaway, exam_pearl, rationale_media, lesson_links,
                difficulty, body_system, topic, subtopic, region_scope, flashcard_enabled,
                category, career_type, created_at
              ) VALUES (
                gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7,
                $8, $9, $10, $11, $12, $13, $14, $15,
                $16, $17, $18, $19, $20, $21, $22, $23, NOW()
              ) ON CONFLICT (content_hash) DO NOTHING`,
              [
                "rn",
                flashcardFront,
                flashcardBack,
                flashcardHash,
                "approved",
                "rn_batch2_expansion",
                questionId,
                "multiple_choice",
                JSON.stringify(options),
                JSON.stringify([correctAnswer]),
                item.rationale,
                item.clinical_pearl || null,
                item.clinical_pearl || null,
                JSON.stringify(images),
                JSON.stringify(lessonLinks),
                difficultyNum,
                item.body_system || config.domain,
                item.topic || topic,
                item.subtopic || topic,
                "BOTH",
                true,
                config.domain,
                "nursing",
              ]
            );

            await client.query("COMMIT");
            if (fcInserted && fcInserted > 0) batchFlashcards++;
          }
        } catch (err: any) {
          await client.query("ROLLBACK").catch(() => {});
          if (err.code === "23505") {
            batchDuplicates++;
          } else {
            console.error(`[RN-Batch2] Insert error:`, err.message);
          }
        } finally {
          client.release();
        }
      }

      totalInserted += batchInserted;
      totalFlashcards += batchFlashcards;
      totalImages += batchImages;
      totalLessonLinks += batchLessonLinks;
      totalDuplicates += batchDuplicates;

      if (batchInserted > 0) {
        topicRemaining -= batchInserted;
      } else {
        topicRetries++;
        if (topicRetries >= MAX_TOPIC_RETRIES) {
          console.log(`[RN-Batch2] Max retries (${MAX_TOPIC_RETRIES}) reached for topic "${topic}" in ${config.name}, moving on`);
          topicRemaining = 0;
        }
      }

      const progress: Batch2Progress = {
        category: config.name,
        batchNumber,
        questionsGenerated: batchInserted,
        flashcardsCreated: batchFlashcards,
        imagesAttached: batchImages,
        lessonLinksAdded: batchLessonLinks,
        duplicatesRejected: batchDuplicates,
      };
      batches.push(progress);

      if (onProgress) onProgress(progress);

      console.log(`[RN-Batch2] Batch ${batchNumber} complete: ${batchInserted} inserted, ${batchFlashcards} flashcards. Total: ${totalInserted}/${effectiveConfig.targetCount}`);

      await new Promise(r => setTimeout(r, 500));
    }
  }

  const completedAt = new Date().toISOString();

  return {
    totalQuestionsInserted: totalInserted,
    totalFlashcardsCreated: totalFlashcards,
    totalImagesAttached: totalImages,
    totalLessonLinksAdded: totalLessonLinks,
    totalDuplicatesRejected: totalDuplicates,
    categoryDistribution,
    difficultyDistribution,
    startedAt,
    completedAt,
    batches,
  };
}

export function getBatch2Categories(): { name: string; domain: string; targetCount: number; topicCount: number }[] {
  return BATCH2_CATEGORIES.map(c => ({
    name: c.name,
    domain: c.domain,
    targetCount: c.targetCount,
    topicCount: c.topics.length,
  }));
}

export async function getRNBatch2Status(dbPool?: any): Promise<{
  totalRNQuestions: number;
  batch2CategoryCounts: Record<string, number>;
  recentBatch2Events: any[];
}> {
  const db = dbPool || (hasSeparateProdDb() ? getProdPool() : pool);

  const { rows: totalRows } = await db.query(
    `SELECT COUNT(*) as count FROM exam_questions WHERE tier = 'rn' AND status = 'approved'`
  );

  const { rows: categoryCounts } = await db.query(
    `SELECT tag, COUNT(*) as count FROM (
       SELECT unnest(tags) as tag FROM exam_questions
       WHERE tier = 'rn' AND status = 'approved'
       AND tags @> ARRAY['rn_batch2_expansion']::text[]
     ) sub
     WHERE tag IN ('Maternal/Newborn', 'Pediatrics', 'Mental Health', 'Leadership/Delegation', 'Critical Care', 'Community Health', 'Emergency Nursing')
     GROUP BY tag`
  );

  const batch2CategoryCounts: Record<string, number> = {};
  for (const row of categoryCounts) {
    batch2CategoryCounts[row.tag] = parseInt(row.count);
  }

  const { rows: recentEvents } = await db.query(
    `SELECT * FROM generation_events
     WHERE generation_id LIKE 'rn-batch2-%'
     ORDER BY created_at DESC LIMIT 10`
  );

  return {
    totalRNQuestions: parseInt(totalRows[0]?.count || "0"),
    batch2CategoryCounts,
    recentBatch2Events: recentEvents,
  };
}
