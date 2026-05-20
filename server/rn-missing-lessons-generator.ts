import crypto from "crypto";
import { createLazyPrimaryPoolProxy } from "./db";

const pool = createLazyPrimaryPoolProxy();

type MissingDomain =
  | "Cardiovascular"
  | "Congenital Cardiac"
  | "Hematology/Oncology"
  | "Pediatrics"
  | "Respiratory"
  | "GI"
  | "Endocrine"
  | "Neurology"
  | "Infectious Disease"
  | "Renal"
  | "Maternal/OB"
  | "Mental Health"
  | "Toxicology"
  | "Musculoskeletal"
  | "Neonatal"
  | "Emergency/Critical Care";

interface MissingTopic {
  title: string;
  slug: string;
  domain: MissingDomain;
  bodySystem: string;
  tags: string[];
  keywords: string[];
}

const MISSING_TOPICS: Array<{ title: string; domain: MissingDomain; tags: string[]; keywords: string[] }> = [
  { title: "Acute Coronary Syndrome", domain: "Cardiovascular", tags: ["ACS", "STEMI", "NSTEMI", "unstable angina"], keywords: ["acute coronary syndrome", "ACS management"] },
  { title: "Pulmonary Edema", domain: "Cardiovascular", tags: ["pulmonary edema", "fluid overload", "crackles", "dyspnea"], keywords: ["pulmonary edema", "flash pulmonary edema"] },
  { title: "Pericarditis", domain: "Cardiovascular", tags: ["pericarditis", "friction rub", "chest pain", "pericardial effusion"], keywords: ["pericarditis", "pericardial inflammation"] },
  { title: "Mitral Valve Insufficiency", domain: "Cardiovascular", tags: ["mitral regurgitation", "valve insufficiency", "murmur", "heart valve"], keywords: ["mitral valve insufficiency", "mitral regurgitation"] },
  { title: "Ventricular Bigeminy", domain: "Cardiovascular", tags: ["bigeminy", "PVC", "ventricular ectopy", "ECG pattern"], keywords: ["ventricular bigeminy", "PVC pattern"] },
  { title: "Hypertensive Encephalopathy", domain: "Cardiovascular", tags: ["hypertensive emergency", "encephalopathy", "cerebral edema", "seizure"], keywords: ["hypertensive encephalopathy", "malignant hypertension"] },
  { title: "Hypertension", domain: "Cardiovascular", tags: ["hypertension", "blood pressure", "antihypertensives", "target organ damage"], keywords: ["hypertension", "HTN management"] },
  { title: "Coronary Artery Aneurysm", domain: "Cardiovascular", tags: ["coronary aneurysm", "Kawasaki complication", "coronary dilation", "thrombosis"], keywords: ["coronary artery aneurysm", "coronary dilation"] },

  { title: "Ventricular Septal Defect", domain: "Congenital Cardiac", tags: ["VSD", "septal defect", "left-to-right shunt", "murmur"], keywords: ["ventricular septal defect", "VSD management"] },
  { title: "Pulmonary Stenosis", domain: "Congenital Cardiac", tags: ["pulmonary stenosis", "right ventricular outflow", "valvuloplasty", "congenital"], keywords: ["pulmonary stenosis", "pulmonic valve stenosis"] },
  { title: "Right Ventricular Hypertrophy", domain: "Congenital Cardiac", tags: ["RVH", "right heart strain", "pulmonary hypertension", "ECG changes"], keywords: ["right ventricular hypertrophy", "RVH"] },
  { title: "Atrioventricular Canal Defect", domain: "Congenital Cardiac", tags: ["AV canal", "endocardial cushion defect", "Down syndrome", "complete AVSD"], keywords: ["atrioventricular canal defect", "endocardial cushion defect"] },

  { title: "Thrombocytopenia", domain: "Hematology/Oncology", tags: ["thrombocytopenia", "low platelets", "bleeding risk", "petechiae"], keywords: ["thrombocytopenia", "low platelet management"] },
  { title: "Sickle Cell Disease", domain: "Hematology/Oncology", tags: ["sickle cell", "HbS", "crisis", "hydroxyurea"], keywords: ["sickle cell disease", "SCD management"] },
  { title: "Vaso-occlusive Crisis", domain: "Hematology/Oncology", tags: ["vaso-occlusive", "pain crisis", "sickle cell", "hydration"], keywords: ["vaso-occlusive crisis", "sickle cell pain crisis"] },
  { title: "Sequestration Crisis", domain: "Hematology/Oncology", tags: ["splenic sequestration", "sickle cell", "splenomegaly", "hypovolemia"], keywords: ["sequestration crisis", "splenic sequestration"] },
  { title: "Hyperhemolytic Crisis", domain: "Hematology/Oncology", tags: ["hyperhemolytic", "sickle cell", "hemolysis", "transfusion reaction"], keywords: ["hyperhemolytic crisis", "sickle cell hemolysis"] },
  { title: "Hemophilia", domain: "Hematology/Oncology", tags: ["hemophilia", "factor VIII", "factor IX", "bleeding disorder"], keywords: ["hemophilia", "hemophilia management"] },

  { title: "Wilms Tumor", domain: "Pediatrics", tags: ["Wilms tumor", "nephroblastoma", "abdominal mass", "pediatric renal"], keywords: ["Wilms tumor", "nephroblastoma"] },
  { title: "Cystic Fibrosis", domain: "Pediatrics", tags: ["cystic fibrosis", "CF", "CFTR", "pancreatic insufficiency"], keywords: ["cystic fibrosis", "CF management"] },
  { title: "Hypertrophic Pyloric Stenosis", domain: "Pediatrics", tags: ["pyloric stenosis", "projectile vomiting", "olive-shaped mass", "pyloromyotomy"], keywords: ["hypertrophic pyloric stenosis", "pyloric stenosis management"] },
  { title: "Cleft Palate", domain: "Pediatrics", tags: ["cleft palate", "craniofacial", "feeding difficulties", "surgical repair"], keywords: ["cleft palate", "cleft palate repair"] },
  { title: "Tracheoesophageal Fistula", domain: "Pediatrics", tags: ["TEF", "esophageal atresia", "drooling", "aspiration risk"], keywords: ["tracheoesophageal fistula", "TEF management"] },
  { title: "Esophageal Atresia", domain: "Pediatrics", tags: ["esophageal atresia", "EA", "surgical repair", "feeding tube"], keywords: ["esophageal atresia", "EA management"] },

  { title: "Bronchiolitis", domain: "Respiratory", tags: ["bronchiolitis", "RSV", "wheezing", "pediatric respiratory"], keywords: ["bronchiolitis", "bronchiolitis management"] },
  { title: "Respiratory Syncytial Virus Infection", domain: "Respiratory", tags: ["RSV", "bronchiolitis", "palivizumab", "respiratory virus"], keywords: ["RSV infection", "respiratory syncytial virus"] },
  { title: "Acute Otitis Media", domain: "Respiratory", tags: ["otitis media", "ear infection", "tympanic membrane", "antibiotics"], keywords: ["acute otitis media", "ear infection management"] },
  { title: "Chronic Obstructive Pulmonary Disease", domain: "Respiratory", tags: ["COPD", "emphysema", "chronic bronchitis", "FEV1"], keywords: ["COPD", "chronic obstructive pulmonary disease"] },
  { title: "Chronic Bronchitis", domain: "Respiratory", tags: ["chronic bronchitis", "productive cough", "airway inflammation", "COPD"], keywords: ["chronic bronchitis", "chronic airway disease"] },
  { title: "Emphysema", domain: "Respiratory", tags: ["emphysema", "alveolar destruction", "barrel chest", "air trapping"], keywords: ["emphysema", "emphysema management"] },
  { title: "Pleurisy", domain: "Respiratory", tags: ["pleurisy", "pleuritis", "chest pain", "friction rub"], keywords: ["pleurisy", "pleural inflammation"] },
  { title: "Aspiration Pneumonia", domain: "Respiratory", tags: ["aspiration", "pneumonia", "dysphagia", "aspiration precautions"], keywords: ["aspiration pneumonia", "aspiration prevention"] },
  { title: "Hypoxia", domain: "Respiratory", tags: ["hypoxia", "low oxygen", "cyanosis", "SpO2"], keywords: ["hypoxia", "hypoxia management"] },

  { title: "Gallstones", domain: "GI", tags: ["cholelithiasis", "gallstones", "biliary colic", "cholecystectomy"], keywords: ["gallstones", "cholelithiasis"] },
  { title: "Mechanical Bowel Obstruction", domain: "GI", tags: ["mechanical obstruction", "adhesions", "hernia", "volvulus"], keywords: ["mechanical bowel obstruction", "surgical obstruction"] },
  { title: "Paralytic Ileus", domain: "GI", tags: ["paralytic ileus", "adynamic ileus", "absent bowel sounds", "postoperative"], keywords: ["paralytic ileus", "ileus management"] },
  { title: "Appendiceal Rupture", domain: "GI", tags: ["ruptured appendix", "peritonitis", "sepsis", "surgical emergency"], keywords: ["appendiceal rupture", "perforated appendix"] },
  { title: "Peritonitis", domain: "GI", tags: ["peritonitis", "abdominal infection", "rigid abdomen", "surgical emergency"], keywords: ["peritonitis", "peritoneal infection"] },
  { title: "Hiatal Hernia", domain: "GI", tags: ["hiatal hernia", "sliding hernia", "paraesophageal", "GERD"], keywords: ["hiatal hernia", "diaphragmatic hernia"] },
  { title: "Inguinal Hernia", domain: "GI", tags: ["inguinal hernia", "direct", "indirect", "incarceration"], keywords: ["inguinal hernia", "groin hernia"] },
  { title: "Encopresis", domain: "GI", tags: ["encopresis", "fecal soiling", "constipation", "pediatric"], keywords: ["encopresis", "fecal incontinence pediatric"] },
  { title: "Functional Fecal Incontinence", domain: "GI", tags: ["fecal incontinence", "bowel control", "biofeedback", "pelvic floor"], keywords: ["functional fecal incontinence", "bowel incontinence"] },

  { title: "Hypoparathyroidism", domain: "Endocrine", tags: ["hypoparathyroidism", "low PTH", "hypocalcemia", "Chvostek sign"], keywords: ["hypoparathyroidism", "parathyroid deficiency"] },
  { title: "Hypocalcemia", domain: "Endocrine", tags: ["hypocalcemia", "low calcium", "Trousseau sign", "tetany"], keywords: ["hypocalcemia", "calcium deficiency"] },
  { title: "Addison Disease", domain: "Endocrine", tags: ["Addison disease", "adrenal insufficiency", "cortisol deficiency", "hyperpigmentation"], keywords: ["Addison disease", "primary adrenal insufficiency"] },
  { title: "Hypokalemia", domain: "Endocrine", tags: ["hypokalemia", "low potassium", "U wave", "muscle weakness"], keywords: ["hypokalemia", "potassium deficit"] },
  { title: "Hypophosphatemia", domain: "Endocrine", tags: ["hypophosphatemia", "low phosphate", "muscle weakness", "respiratory failure"], keywords: ["hypophosphatemia", "phosphate deficiency"] },
  { title: "Hypomagnesemia", domain: "Endocrine", tags: ["hypomagnesemia", "low magnesium", "tremors", "seizure risk"], keywords: ["hypomagnesemia", "magnesium deficiency"] },
  { title: "Hyperkalemia", domain: "Endocrine", tags: ["hyperkalemia", "high potassium", "peaked T waves", "cardiac arrest risk"], keywords: ["hyperkalemia", "elevated potassium"] },
  { title: "Hypoglycemia", domain: "Endocrine", tags: ["hypoglycemia", "low blood sugar", "diaphoresis", "confusion"], keywords: ["hypoglycemia", "low blood glucose management"] },
  { title: "Newborn Hypoglycemia", domain: "Endocrine", tags: ["neonatal hypoglycemia", "newborn", "feeding", "dextrose gel"], keywords: ["newborn hypoglycemia", "neonatal glucose management"] },

  { title: "Increased Intracranial Pressure", domain: "Neurology", tags: ["ICP", "Cushing triad", "herniation", "mannitol"], keywords: ["increased intracranial pressure", "elevated ICP"] },
  { title: "Sydenham Chorea", domain: "Neurology", tags: ["Sydenham chorea", "rheumatic fever", "involuntary movements", "basal ganglia"], keywords: ["Sydenham chorea", "rheumatic chorea"] },

  { title: "Acute Rheumatic Fever", domain: "Infectious Disease", tags: ["rheumatic fever", "Jones criteria", "carditis", "streptococcal"], keywords: ["acute rheumatic fever", "rheumatic heart disease"] },
  { title: "Streptococcal Infection", domain: "Infectious Disease", tags: ["group A strep", "pharyngitis", "rapid strep test", "antibiotics"], keywords: ["streptococcal infection", "GAS infection"] },
  { title: "Mononucleosis", domain: "Infectious Disease", tags: ["mononucleosis", "EBV", "fatigue", "splenomegaly"], keywords: ["mononucleosis", "Epstein-Barr virus"] },
  { title: "Hepatitis B", domain: "Infectious Disease", tags: ["hepatitis B", "HBV", "HBsAg", "vaccination"], keywords: ["hepatitis B", "HBV management"] },
  { title: "Botulism", domain: "Infectious Disease", tags: ["botulism", "Clostridium botulinum", "descending paralysis", "antitoxin"], keywords: ["botulism", "botulism management"] },

  { title: "Nephrotic Syndrome", domain: "Renal", tags: ["nephrotic syndrome", "proteinuria", "edema", "hypoalbuminemia"], keywords: ["nephrotic syndrome", "nephrotic syndrome management"] },

  { title: "Placental Abruption", domain: "Maternal/OB", tags: ["abruption", "painful bleeding", "concealed hemorrhage", "DIC risk"], keywords: ["placental abruption", "abruptio placentae"] },
  { title: "Uterine Rupture", domain: "Maternal/OB", tags: ["uterine rupture", "VBAC complication", "hemorrhage", "fetal distress"], keywords: ["uterine rupture", "ruptured uterus"] },
  { title: "Menopause", domain: "Maternal/OB", tags: ["menopause", "hormone changes", "hot flashes", "osteoporosis risk"], keywords: ["menopause", "menopausal management"] },
  { title: "Morning Sickness", domain: "Maternal/OB", tags: ["morning sickness", "nausea in pregnancy", "hyperemesis", "first trimester"], keywords: ["morning sickness", "pregnancy nausea management"] },

  { title: "Conversion Disorder", domain: "Mental Health", tags: ["conversion disorder", "functional neurological", "psychogenic", "somatic symptom"], keywords: ["conversion disorder", "functional neurological disorder"] },

  { title: "Magnesium Toxicity", domain: "Toxicology", tags: ["magnesium toxicity", "hypermagnesemia", "areflexia", "respiratory depression"], keywords: ["magnesium toxicity", "hypermagnesemia"] },
  { title: "Medication Extravasation", domain: "Toxicology", tags: ["extravasation", "vesicant", "tissue damage", "antidote"], keywords: ["medication extravasation", "IV extravasation"] },

  { title: "Acute Lumbosacral Strain", domain: "Musculoskeletal", tags: ["lumbar strain", "back pain", "muscle spasm", "conservative management"], keywords: ["acute lumbosacral strain", "low back strain"] },
  { title: "Lumbosacral Disc Herniation", domain: "Musculoskeletal", tags: ["disc herniation", "sciatica", "radiculopathy", "nerve compression"], keywords: ["lumbosacral disc herniation", "herniated disc"] },
  { title: "Testicular Torsion", domain: "Musculoskeletal", tags: ["testicular torsion", "scrotal pain", "surgical emergency", "ischemia"], keywords: ["testicular torsion", "testicular emergency"] },
  { title: "Septic Arthritis", domain: "Musculoskeletal", tags: ["septic arthritis", "joint infection", "synovial fluid", "IV antibiotics"], keywords: ["septic arthritis", "infectious arthritis"] },

  { title: "Neonatal Abstinence Syndrome", domain: "Neonatal", tags: ["NAS", "neonatal withdrawal", "opioid exposure", "Finnegan score"], keywords: ["neonatal abstinence syndrome", "NAS management"] },
  { title: "Submersion Injury", domain: "Neonatal", tags: ["submersion", "drowning", "near-drowning", "hypothermia"], keywords: ["submersion injury", "drowning management"] },

  { title: "Cardiac Dysrhythmias", domain: "Emergency/Critical Care", tags: ["dysrhythmia", "arrhythmia", "ACLS", "defibrillation"], keywords: ["cardiac dysrhythmias", "rhythm disturbances"] },
  { title: "Ischemia", domain: "Emergency/Critical Care", tags: ["ischemia", "tissue perfusion", "oxygen deficit", "reperfusion injury"], keywords: ["ischemia", "tissue ischemia management"] },
  { title: "Hemorrhage", domain: "Emergency/Critical Care", tags: ["hemorrhage", "blood loss", "hypovolemia", "transfusion"], keywords: ["hemorrhage", "hemorrhage management"] },
  { title: "Aspiration", domain: "Emergency/Critical Care", tags: ["aspiration", "airway obstruction", "aspiration pneumonitis", "suctioning"], keywords: ["aspiration", "aspiration management"] },
  { title: "Metabolic Alkalosis", domain: "Emergency/Critical Care", tags: ["metabolic alkalosis", "elevated pH", "bicarbonate excess", "hypokalemia"], keywords: ["metabolic alkalosis", "alkalosis management"] },
  { title: "Electrolyte Imbalances", domain: "Emergency/Critical Care", tags: ["electrolytes", "sodium", "potassium", "calcium", "magnesium"], keywords: ["electrolyte imbalances", "electrolyte management"] },
];

function generateSlug(title: string): string {
  return `rn-${title}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function mapDomainToBodySystem(domain: MissingDomain): string {
  const mapping: Record<MissingDomain, string> = {
    "Cardiovascular": "Cardiovascular",
    "Congenital Cardiac": "Cardiovascular",
    "Hematology/Oncology": "Hematological",
    "Pediatrics": "Pediatrics",
    "Respiratory": "Respiratory",
    "GI": "Gastrointestinal",
    "Endocrine": "Endocrine",
    "Neurology": "Neurological",
    "Infectious Disease": "Infectious Disease",
    "Renal": "Renal/Urinary",
    "Maternal/OB": "Maternal/Newborn",
    "Mental Health": "Mental Health",
    "Toxicology": "Toxicology",
    "Musculoskeletal": "Musculoskeletal",
    "Neonatal": "Neonatal",
    "Emergency/Critical Care": "Critical Care",
  };
  return mapping[domain];
}

function generateLessonContent(title: string, domain: MissingDomain, tags: string[], keywords: string[]): any[] {
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

function generateFlashcards(title: string, domain: MissingDomain, tags: string[]): Array<{ front: string; back: string }> {
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

function buildAllMissingTopics(): MissingTopic[] {
  return MISSING_TOPICS.map(t => ({
    title: t.title,
    slug: generateSlug(t.title),
    domain: t.domain,
    bodySystem: mapDomainToBodySystem(t.domain),
    tags: t.tags,
    keywords: t.keywords,
  }));
}

export async function generateMissingRnLessons(): Promise<{ lessonsInserted: number; flashcardsInserted: number; errors: string[] }> {
  const topics = buildAllMissingTopics();
  let lessonsInserted = 0;
  let flashcardsInserted = 0;
  const errors: string[] = [];

  console.log(`[RN-Missing] Starting generation of ${topics.length} missing RN lessons...`);

  const BATCH_SIZE = 10;
  for (let i = 0; i < topics.length; i += BATCH_SIZE) {
    const batch = topics.slice(i, i + BATCH_SIZE);
    console.log(`[RN-Missing] Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(topics.length / BATCH_SIZE)} (lessons ${i + 1}-${Math.min(i + BATCH_SIZE, topics.length)})`);

    for (const topic of batch) {
      try {
        const existingResult = await pool.query(
          `SELECT id, title, slug FROM content_items WHERE slug = $1 OR LOWER(title) = LOWER($2) LIMIT 1`,
          [topic.slug, topic.title]
        );
        if (existingResult.rows.length > 0) {
          console.warn(`[RN-Missing] Duplicate detected: "${topic.slug}" matches existing "${existingResult.rows[0].title}" (slug: ${existingResult.rows[0].slug}, id: ${existingResult.rows[0].id}). Skipping.`);
          continue;
        }

        const content = generateLessonContent(topic.title, topic.domain, topic.tags, topic.keywords);
        const summary = `Comprehensive NCLEX-RN study guide covering ${topic.title.toLowerCase()} in ${topic.domain} nursing. Includes pathophysiology, signs and symptoms, assessment, nursing interventions, clinical pearls, and common exam pitfalls.`;
        console.log(`[RN-Missing] Publishing: title="${topic.title}", slug="${topic.slug}", domain="${topic.domain}", bodySystem="${topic.bodySystem}", tier=rn`);

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

        lessonsInserted++;

        const flashcards = generateFlashcards(topic.title, topic.domain, topic.tags);
        for (const fc of flashcards) {
          try {
            const contentHash = crypto.createHash("sha256").update(fc.front.toLowerCase().trim()).digest("hex");
            const fcResult = await pool.query(
              `INSERT INTO flashcard_bank (id, tier, topic_tag, front, back, status, content_hash, body_system, topic, source_type, lesson_links, region_scope, flashcard_enabled, career_type, created_at)
               VALUES (gen_random_uuid(), 'rn', $1, $2, $3, 'published', $4, $5, $6, 'lesson_generated', $7, 'BOTH', true, 'nursing', NOW())
               ON CONFLICT (content_hash) DO NOTHING
               RETURNING id`,
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
            if (fcResult.rowCount && fcResult.rowCount > 0) {
              flashcardsInserted++;
            }
          } catch (fcErr: unknown) {
            const fcErrObj = fcErr instanceof Error ? fcErr : { message: String(fcErr), code: undefined };
            if ((fcErr as Record<string, unknown>)?.code !== "23505") {
              errors.push(`Flashcard error for ${topic.title}: ${fcErrObj.message}`);
            }
          }
        }

      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        errors.push(`Lesson error for ${topic.title}: ${errMsg}`);
        console.error(`[RN-Missing] Error inserting ${topic.title}:`, errMsg);
      }
    }
  }

  console.log(`[RN-Missing] Generation complete: ${lessonsInserted} lessons, ${flashcardsInserted} flashcards`);
  if (errors.length > 0) {
    console.log(`[RN-Missing] ${errors.length} errors encountered`);
  }

  return { lessonsInserted, flashcardsInserted, errors };
}

export { buildAllMissingTopics, MISSING_TOPICS };
