#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// NP pathways configuration
const npPathways = [
  { pathwayId: "ca-np-cnple", examName: "CNPLE", region: "Canada", countryScope: "ca", countries: ["CA"] },
  { pathwayId: "us-np-fnp", examName: "FNP (AANP/ANCC)", region: "US", countryScope: "us", countries: ["US"] },
];

// Advanced practice nursing systems and concepts - NP depth with diagnostic reasoning, prescribing, and management
const systems = [
  {
    system: "Cardiovascular",
    topicSlug: "cardiovascular",
    concepts: [
      "hypertension diagnosis and guideline based management",
      "coronary artery disease risk stratification and management",
      "heart failure with reduced and preserved ejection fraction",
      "atrial fibrillation rate versus rhythm control decisions",
      "stable angina diagnostic workup and treatment",
      "acute coronary syndrome recognition and initial management",
      "valvular heart disease murmur recognition and referral",
      "peripheral artery disease diagnosis and management",
      "deep vein thrombosis and pulmonary embolism management",
      "hyperlipidemia statin selection and monitoring",
      "syncope differential diagnosis and workup",
      "palpitations evaluation and management",
      "anticoagulation management and reversal strategies",
      "cardiomyopathy classification and management",
      "pericarditis and myocarditis diagnosis",
      "aortic stenosis severity assessment and timing of intervention",
      "mitral valve prolapse evaluation and counseling",
      "hypertensive urgency versus emergency decision making",
      "cardiac biomarker interpretation in acute settings",
      "ECG interpretation for advanced practice",
      "stress test selection and result interpretation",
      "echocardiogram findings and clinical correlation",
      "cardiac CT and MRI indications in outpatient practice",
      "cardiovascular disease prevention strategies",
      "post MI secondary prevention and rehabilitation",
      "heart failure medication titration and monitoring",
      "device therapy indications pacemakers and ICDs",
      "endocarditis prophylaxis guidelines and risk stratification",
    ],
  },
  {
    system: "Respiratory",
    topicSlug: "respiratory",
    concepts: [
      "asthma diagnosis and stepwise management",
      "COPD diagnosis GOLD staging and management",
      "pneumonia CAP versus HAP diagnosis and treatment",
      "pulmonary nodule evaluation and follow up",
      "interstitial lung disease recognition and referral",
      "pulmonary embolism risk stratification and treatment",
      "sleep apnea diagnosis and CPAP management",
      "pleural effusion differential diagnosis and workup",
      "hemoptysis evaluation and management",
      "chronic cough diagnostic algorithm",
      "tuberculosis screening and treatment",
      "bronchiectasis diagnosis and management",
      "pulmonary function test interpretation",
      "oxygen therapy indications and prescribing",
      "lung cancer screening criteria and follow up",
      "allergic rhinitis and sinusitis management",
      "acute bronchitis versus pneumonia differentiation",
      "pulmonary hypertension recognition and referral",
      "sarcoidosis diagnosis and management",
      "occupational lung disease evaluation",
      "cystic fibrosis adult management basics",
      "respiratory infection in immunocompromised host",
      "thoracentesis indications and complications",
      "mechanical ventilation basics for NP",
      "asthma COPD overlap syndrome management",
    ],
  },
  {
    system: "Neurological",
    topicSlug: "neurological",
    concepts: [
      "headache differential diagnosis and management",
      "migraine prophylaxis and abortive therapy",
      "tension type headache management",
      "cluster headache diagnosis and treatment",
      "seizure classification and antiepileptic selection",
      "stroke acute management and secondary prevention",
      "TIA workup and risk stratification",
      "Parkinson disease diagnosis and management",
      "essential tremor evaluation and treatment",
      "multiple sclerosis diagnosis and disease modifying therapy",
      "peripheral neuropathy workup and management",
      "dementia diagnosis and disease modifying therapy",
      "delirium recognition and management",
      "meningitis and encephalitis recognition",
      "myasthenia gravis diagnosis and management",
      "Bell palsy evaluation and treatment",
      "carpal tunnel syndrome diagnosis and management",
      "low back pain with radiculopathy management",
      "cervical radiculopathy evaluation",
      "vertigo and dizziness differential diagnosis",
      "syncope neurologic evaluation",
      "neuroimaging in clinical neurology",
      "neuromuscular junction disorders",
      "movement disorders beyond Parkinson disease",
      "neurologic manifestations of systemic disease",
    ],
  },
  {
    system: "Endocrine",
    topicSlug: "endocrine",
    concepts: [
      "type 2 diabetes diagnosis and initial management",
      "type 1 diabetes insulin regimen selection",
      "diabetes medication selection beyond metformin",
      "insulin initiation and titration protocols",
      "continuous glucose monitoring interpretation",
      "diabetic ketoacidosis recognition and management",
      "hyperosmolar hyperglycemic state management",
      "hypoglycemia evaluation and prevention",
      "hypothyroidism diagnosis and levothyroxine dosing",
      "hyperthyroidism diagnosis and management",
      "thyroid nodule evaluation and FNA indications",
      "thyroid cancer follow up and surveillance",
      "adrenal insufficiency diagnosis and management",
      "Cushing syndrome evaluation",
      "pheochromocytoma recognition and workup",
      "hyperparathyroidism diagnosis and management",
      "hypoparathyroidism management",
      "vitamin D deficiency evaluation and treatment",
      "osteoporosis diagnosis and pharmacotherapy",
      "metabolic bone disease evaluation",
      "pituitary adenoma recognition and management",
      "polycystic ovary syndrome metabolic management",
      "lipid disorders diagnosis and management",
      "obesity pharmacotherapy selection",
      "electrolyte disorders sodium and potassium",
      "calcium disorders hypercalcemia and hypocalcemia",
    ],
  },
  {
    system: "Gastrointestinal",
    topicSlug: "gastrointestinal",
    concepts: [
      "gastroesophageal reflux disease diagnosis and management",
      "peptic ulcer disease and H pylori management",
      "dyspepsia evaluation and management",
      "inflammatory bowel disease diagnosis and management",
      "irritable bowel syndrome diagnosis and management",
      "celiac disease diagnosis and management",
      "hepatitis B and C evaluation and treatment",
      "nonalcoholic fatty liver disease management",
      "alcoholic liver disease evaluation",
      "cirrhosis complications management",
      "hepatic encephalopathy recognition and treatment",
      "pancreatitis diagnosis and management",
      "gallbladder disease evaluation and management",
      "colorectal cancer screening and surveillance",
      "colorectal polyp follow up guidelines",
      "chronic constipation evaluation and management",
      "chronic diarrhea workup",
      "GI bleeding evaluation and management",
      "dysphagia evaluation and management",
      "hemorrhoids and anorectal disorders",
      "abdominal pain diagnostic approach",
      "liver function test interpretation in GI disease",
      "tumor marker interpretation in GI disease",
      "endoscopy indications and follow up",
      "nutritional assessment and supplementation",
      "short bowel syndrome management",
    ],
  },
  {
    system: "Renal and Urology",
    topicSlug: "renal-urinary",
    concepts: [
      "chronic kidney disease staging and management",
      "acute kidney injury recognition and workup",
      "proteinuria evaluation and management",
      "hematuria workup and differential diagnosis",
      "urinary tract infection diagnosis and management",
      "pyelonephritis diagnosis and treatment",
      "nephrolithiasis evaluation and prevention",
      "glomerulonephritis recognition and referral",
      "diabetic nephropathy prevention and management",
      "hypertensive nephrosclerosis management",
      "electrolyte management in CKD",
      "anemia of CKD evaluation and treatment",
      "mineral bone disorder in CKD",
      "dialysis indications and preparation",
      "kidney transplant follow up basics",
      "drug dosing in renal impairment",
      "benign prostatic hyperplasia management",
      "urinary incontinence evaluation and treatment",
      "overactive bladder management",
      "erectile dysfunction evaluation and treatment",
      "prostatitis diagnosis and management",
      "testicular disorders evaluation",
      "renal imaging interpretation",
      "urinalysis in renal disease",
      "acid base disorders evaluation",
    ],
  },
  {
    system: "Dermatology",
    topicSlug: "dermatology",
    concepts: [
      "acne vulgaris diagnosis and treatment",
      "rosacea diagnosis and management",
      "atopic dermatitis management",
      "contact dermatitis evaluation and management",
      "psoriasis diagnosis and treatment",
      "seborrheic dermatitis management",
      "bacterial skin infections management",
      "viral skin infections diagnosis and treatment",
      "fungal skin infections diagnosis and treatment",
      "skin cancer screening and recognition",
      "melanoma recognition and referral",
      "basal cell carcinoma management",
      "squamous cell carcinoma management",
      "actinic keratosis treatment",
      "pigmented lesion evaluation",
      "urticaria and angioedema management",
      "drug eruptions recognition and management",
      "autoimmune blistering disorders recognition",
      "skin biopsy techniques and indications",
      "cryotherapy and electrosurgery basics",
      "wound care and healing principles",
      "leg ulcer evaluation and management",
      "hidradenitis suppurativa management",
      "hair loss evaluation and treatment",
      "nail disorders diagnosis",
      "pediatric dermatology common conditions",
    ],
  },
  {
    system: "Musculoskeletal",
    topicSlug: "musculoskeletal",
    concepts: [
      "osteoarthritis diagnosis and management",
      "rheumatoid arthritis diagnosis and management",
      "gout and pseudogout diagnosis and treatment",
      "systemic lupus erythematosus diagnosis and management",
      "polymyalgia rheumatica diagnosis and treatment",
      "fibromyalgia diagnosis and management",
      "low back pain evaluation and management",
      "neck pain evaluation and management",
      "shoulder pain differential diagnosis",
      "knee pain evaluation and management",
      "hip pain evaluation and management",
      "hand and wrist disorders",
      "foot and ankle disorders",
      "sports medicine common injuries",
      "tendonitis and bursitis management",
      "ligament injuries evaluation",
      "meniscal tears diagnosis and management",
      "rotator cuff disorders",
      "carpal tunnel syndrome management",
      "trigger finger diagnosis and treatment",
      "plantar fasciitis management",
      "osteoporosis screening and pharmacotherapy",
      "bone health in special populations",
      "musculoskeletal imaging interpretation",
      "joint injection techniques",
      "physical therapy referral and coordination",
    ],
  },
  {
    system: "Women's Health",
    topicSlug: "womens-health",
    concepts: [
      "contraceptive counseling and selection",
      "IUD insertion and management",
      "implantable contraceptive management",
      "oral contraceptive prescribing and monitoring",
      "emergency contraception counseling",
      "preconception counseling and care",
      "infertility initial evaluation",
      "abnormal uterine bleeding evaluation",
      "dysmenorrhea evaluation and management",
      "endometriosis diagnosis and management",
      "uterine fibroids evaluation and management",
      "polycystic ovary syndrome management",
      "premature ovarian insufficiency",
      "menopause diagnosis and hormone therapy",
      "osteoporosis prevention in women",
      "breast cancer screening and evaluation",
      "cervical cancer screening and management",
      "endometrial cancer recognition",
      "ovarian cancer recognition",
      "vaginitis diagnosis and treatment",
      "pelvic inflammatory disease diagnosis and treatment",
      "sexually transmitted infection management",
      "urinary tract infections in women",
      "pelvic floor disorders evaluation",
      "sexual dysfunction in women",
      "intimate partner violence screening and intervention",
    ],
  },
  {
    system: "Pediatrics",
    topicSlug: "pediatrics",
    concepts: [
      "well child care and anticipatory guidance",
      "immunization schedule and catch up",
      "newborn care and screening",
      "infant feeding and nutrition",
      "childhood growth and development",
      "developmental surveillance and screening",
      "autism spectrum disorder screening",
      "ADHD diagnosis and management",
      "childhood asthma diagnosis and management",
      "pediatric respiratory infections",
      "pediatric gastrointestinal disorders",
      "pediatric skin conditions",
      "childhood fever evaluation",
      "pediatric otitis media management",
      "pediatric pharyngitis evaluation",
      "childhood exanthems recognition",
      "pediatric cardiac murmurs evaluation",
      "pediatric orthopedic conditions",
      "adolescent health and confidentiality",
      "pediatric mental health screening",
      "child abuse recognition and reporting",
      "pediatric toxicology common exposures",
      "pediatric allergic conditions",
      "pediatric endocrine disorders",
      "pediatric neurologic conditions",
      "pediatric urgent care triage",
    ],
  },
  {
    system: "Geriatrics",
    topicSlug: "geriatrics",
    concepts: [
      "comprehensive geriatric assessment",
      "falls risk assessment and prevention",
      "frailty recognition and management",
      "polypharmacy and deprescribing",
      "dementia in older adults evaluation and management",
      "delirium prevention and management",
      "depression in older adults",
      "anxiety in older adults",
      "urinary incontinence in older adults",
      "constipation in older adults",
      "nutrition and weight loss in elderly",
      "sleep disorders in older adults",
      "chronic pain management in elderly",
      "osteoporosis management in older adults",
      "vision and hearing loss in elderly",
      "driving safety assessment",
      "elder abuse recognition and reporting",
      "advance care planning",
      "palliative care in geriatrics",
      "hypertension management in elderly",
      "diabetes management in elderly",
      "heart failure in elderly",
      "cognitive impairment screening",
      "functional assessment tools",
      "transitions of care for elderly",
      "long term care considerations",
    ],
  },
  {
    system: "Mental Health",
    topicSlug: "mental-health",
    concepts: [
      "depression screening and diagnosis",
      "depression pharmacotherapy selection",
      "anxiety disorders diagnosis and management",
      "panic disorder diagnosis and treatment",
      "generalized anxiety disorder management",
      "bipolar disorder recognition and management",
      "schizophrenia diagnosis and management",
      "substance use disorder screening",
      "alcohol use disorder management",
      "opioid use disorder treatment",
      "tobacco cessation counseling and pharmacotherapy",
      "insomnia evaluation and management",
      "eating disorders recognition and referral",
      "ADHD in adults diagnosis and management",
      "PTSD diagnosis and management",
      "personality disorders recognition",
      "suicide risk assessment",
      "psychopharmacology basics",
      "antidepressant selection and monitoring",
      "antipsychotic prescribing and monitoring",
      "mood stabilizer management",
      "benzodiazepine prescribing considerations",
      "mental health in primary care",
      "collaborative care models",
      "crisis intervention basics",
      "mental health referral indications",
    ],
  },
  {
    system: "Pharmacology",
    topicSlug: "pharmacology",
    concepts: [
      "prescribing fundamentals and safety",
      "controlled substance prescribing regulations",
      "drug interactions recognition and management",
      "adverse drug reaction evaluation",
      "pharmacokinetics and pharmacodynamics basics",
      "renal and hepatic dose adjustments",
      "antibiotic selection and stewardship",
      "anticoagulation management",
      "pain management and opioid prescribing",
      "diabetes medication management",
      "cardiovascular medication management",
      "psychiatric medication management",
      "immunizations and vaccine management",
      "herbal and supplement interactions",
      "medication reconciliation",
      "prescribing in pregnancy and lactation",
      "prescribing in pediatrics",
      "prescribing in geriatrics",
      "medication adherence strategies",
      "cost effective prescribing",
      "electronic prescribing best practices",
      "prescription error prevention",
      "high alert medication safety",
      "transdermal and injectable medications",
      "compounded medication considerations",
      "medication storage and stability",
    ],
  },
  {
    system: "Diagnostics",
    topicSlug: "diagnostics",
    concepts: [
      "complete blood count interpretation",
      "comprehensive metabolic panel interpretation",
      "lipid panel interpretation",
      "thyroid function test interpretation",
      "liver enzyme pattern recognition",
      "cardiac biomarker interpretation",
      "tumor marker interpretation",
      "inflammatory marker interpretation",
      "coagulation studies interpretation",
      "urinalysis fundamentals",
      "arterial blood gas interpretation",
      "ECG interpretation fundamentals",
      "chest x-ray interpretation",
      "abdominal imaging selection",
      "musculoskeletal imaging selection",
      "neuroimaging indications and interpretation",
      "ultrasound in primary care",
      "CT indications and contraindications",
      "MRI indications and contraindications",
      "nuclear medicine studies",
      "screening test interpretation",
      "diagnostic test sensitivity and specificity",
      "point of care testing",
      "microbiology test interpretation",
      "immunology test interpretation",
      "genetic testing considerations",
    ],
  },
  {
    system: "Primary Care",
    topicSlug: "primary-care",
    concepts: [
      "comprehensive preventive care",
      "health maintenance visit structure",
      "screening guidelines by age and risk",
      "immunization recommendations",
      "lifestyle counseling strategies",
      "nutrition counseling fundamentals",
      "exercise prescription",
      "weight management strategies",
      "tobacco cessation interventions",
      "alcohol screening and brief intervention",
      "substance use screening",
      "sexual health counseling",
      "travel medicine basics",
      "occupational health considerations",
      "disability determination basics",
      "workers compensation considerations",
      "school and sports physicals",
      "chronic disease management models",
      "care coordination and referral",
      "population health management",
      "quality improvement in practice",
      "patient centered medical home",
      "team based care models",
      "telehealth best practices",
      "documentation and coding basics",
      "practice management fundamentals",
    ],
  },
  {
    system: "Professional Practice",
    topicSlug: "professional-practice",
    concepts: [
      "NP scope of practice and regulation",
      "prescriptive authority and regulations",
      "controlled substance registration",
      "malpractice and liability",
      "informed consent",
      "confidentiality and HIPAA",
      "mandatory reporting requirements",
      "professional boundaries",
      "ethical decision making",
      "cultural competence in practice",
      "health equity and social determinants",
      "interprofessional collaboration",
      "leadership in healthcare",
      "quality and safety improvement",
      "evidence based practice",
      "clinical practice guidelines",
      "continuing education requirements",
      "certification and recertification",
      "career development for NPs",
      "practice transition and onboarding",
      "mentorship and precepting",
      "research utilization",
      "policy and advocacy",
      "healthcare systems and finance",
      "value based care",
      "population health and public health",
    ],
  },
];

function titleCase(input) {
  return input
    .replace(/\b[a-z]/g, (c) => c.toUpperCase())
    .replace(/\bAnd\b/g, "and")
    .replace(/\bFor\b/g, "for")
    .replace(/\bIn\b/g, "in")
    .replace(/\bOf\b/g, "of")
    .replace(/\bThe\b/g, "the")
    .replace(/\bA\b/g, "a")
    .replace(/\bAn\b/g, "an")
    .replace(/\bOr\b/g, "or")
    .replace(/\bTo\b/g, "to")
    .replace(/\bVs\b/g, "vs")
    .replace(/\bBeyond\b/g, "beyond");
}

function slugify(input) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72);
}

function buildNPOverview(title, system, focus, examName) {
  return `${title} is essential knowledge for nurse practitioners preparing for ${examName} certification. NPs must synthesize advanced assessment skills, diagnostic reasoning, and evidence-based management to provide safe, effective care. Learning objectives: perform a focused history and physical examination; generate an appropriate differential diagnosis; select and interpret diagnostic tests; develop a comprehensive management plan including pharmacologic and non-pharmacologic interventions; identify red flags requiring referral or escalation; and provide patient education for self-management. ${examName} questions test clinical judgment at the advanced practice level, emphasizing guideline-concordant care, risk stratification, and recognition of when to manage independently versus when to consult or refer. The NP integrates pathophysiologic understanding with clinical presentation to make diagnostic and therapeutic decisions that optimize patient outcomes.`;
}

function buildNPPathophysiology(title, system, focus) {
  return `The pathophysiology of ${focus} involves complex interactions between ${system.toLowerCase()} structures and systemic processes. NPs must understand the underlying mechanisms to accurately diagnose and effectively manage this condition. Key pathophysiologic concepts include: the initiating factors or triggers, the cascade of cellular and molecular events, the compensatory responses that may mask or modify presentation, and the potential for progression or complications. Understanding these mechanisms informs both diagnostic strategy and therapeutic selection. For example, recognizing the inflammatory cascade in ${focus} guides anti-inflammatory therapy choices, while understanding hemodynamic principles informs vasopressor or fluid management decisions. NPs apply this pathophysiologic framework to anticipate complications, select appropriate monitoring parameters, and educate patients about their condition.`;
}

function buildNPSymptoms(title, system, focus) {
  return `The clinical presentation of ${focus} varies based on disease stage, patient factors, and comorbidities. NPs must recognize both typical and atypical presentations to avoid diagnostic delay. Common symptoms include patient-reported concerns such as pain, fatigue, functional limitations, or specific organ-related complaints. Objective findings may include vital sign abnormalities, physical examination findings, and laboratory or imaging results. Important considerations: older adults and immunocompromised patients may present atypically with minimal or nonspecific symptoms; comorbidities can mask or mimic the primary condition; early disease may be asymptomatic or present with subtle findings; and certain populations (pregnant patients, pediatric patients, elderly) require modified diagnostic thresholds. The NP synthesizes subjective and objective data to generate a prioritized differential diagnosis and determine the urgency of intervention.`;
}

function buildNPAssessment(title, system, focus) {
  return `The NP approach to ${focus} begins with a comprehensive history including chief complaint, history of present illness, past medical history, medications, allergies, family history, and social history. The physical examination should be focused yet thorough, targeting the ${system.toLowerCase()} system while screening for systemic involvement. Diagnostic workup is guided by clinical presentation and pretest probability: initial tests may include basic laboratories, imaging, or functional studies; advanced testing is reserved for complex presentations or when initial evaluation is inconclusive. Risk stratification tools help guide management intensity and disposition decisions. The NP considers comorbidities, drug interactions, patient preferences, and social determinants when developing the diagnostic and management plan. Red flags requiring urgent evaluation or referral include: severe or worsening symptoms, signs of organ dysfunction, abnormal vital signs suggesting instability, laboratory values outside critical ranges, and findings suggestive of life-threatening complications.`;
}

function buildNPManagement(title, system, focus, examName) {
  return `Management of ${focus} requires a comprehensive, evidence-based approach. Pharmacologic therapy should be selected based on: guideline recommendations, patient-specific factors (age, comorbidities, renal/hepatic function), drug interactions, cost and access considerations, and patient preferences. NPs must understand mechanism of action, dosing, monitoring requirements, and potential adverse effects for all prescribed medications. Non-pharmacologic interventions include lifestyle modifications (diet, exercise, stress management), physical therapy or rehabilitation when indicated, patient education and self-management support, and coordination of care with other providers. Monitoring parameters should be established at the initial visit with clear follow-up intervals. The NP must recognize when to escalate therapy, when to refer to specialists, and when hospitalization is indicated. Patient education should address: the nature of the condition, expected course, medication administration and side effects, lifestyle modifications, warning signs requiring medical attention, and long-term prognosis. ${examName} questions often test the ability to select the most appropriate next step in management based on clinical scenario complexity.`;
}

function buildNPPearls(title, system, focus, examName) {
  return `Clinical pearls for ${focus}: do not anchor on the initial diagnosis—reassess when clinical course deviates from expected; consider atypical presentations in older adults, immunocompromised patients, and those with multiple comorbidities; use validated clinical decision rules when available to guide diagnostic and management decisions; recognize that guideline recommendations provide a framework but must be individualized to patient circumstances; and maintain a high index of suspicion for red flag conditions that require urgent intervention. Common ${examName} traps include: selecting a diagnostic test before completing the history and physical; choosing an expensive or invasive intervention when a simpler approach is equally effective; overlooking drug interactions or contraindications; failing to consider patient preferences and social context; and missing opportunities for preventive care or health promotion. The best answers demonstrate clinical judgment that balances evidence-based medicine with individualized patient care, recognizes when to manage independently versus when to consult, and prioritizes patient safety above all.`;
}

function buildNPLinkedMaterials(title, system, focus, examName, topicSlug) {
  const relatedTopics = {
    cardiovascular: ["lipid management", "hypertension guidelines", "anticoagulation management", "ECG interpretation"],
    respiratory: ["pulmonary function testing", "oxygen therapy", "asthma action plans", "sleep study interpretation"],
    neurological: ["neuroimaging selection", "seizure management", "headache classification", "cognitive assessment"],
    endocrine: ["insulin management", "thyroid disorders", "osteoporosis treatment", "metabolic syndrome"],
    gastrointestinal: ["liver disease management", "IBD treatment", "nutrition support", "endoscopy indications"],
    "renal-urinary": ["CKD management", "electrolyte disorders", "dialysis indications", "drug dosing in renal disease"],
    dermatology: ["skin biopsy techniques", "dermoscopy basics", "wound care principles", "skin cancer screening"],
    musculoskeletal: ["joint injection techniques", "imaging interpretation", "physical therapy referral", "pain management"],
    "womens-health": ["contraceptive management", "menopause care", "prenatal care basics", "breast health"],
    pediatrics: ["growth and development", "immunization schedules", "pediatric dosing", "adolescent health"],
    geriatrics: ["polypharmacy management", "falls prevention", "dementia care", "advance care planning"],
    "mental-health": ["psychopharmacology", "suicide risk assessment", "substance use screening", "collaborative care"],
    pharmacology: ["prescribing regulations", "drug interactions", "adverse reactions", "cost-effective prescribing"],
    diagnostics: ["lab interpretation", "imaging selection", "screening guidelines", "point of care testing"],
    "primary-care": ["preventive care", "health maintenance", "chronic disease management", "care coordination"],
    "professional-practice": ["scope of practice", "ethical decision making", "quality improvement", "interprofessional collaboration"],
    fundamentals: ["clinical reasoning", "evidence based practice", "patient communication", "care transitions"],
  };

  const related = relatedTopics[topicSlug] || ["evidence-based guidelines", "clinical decision making", "patient safety", "quality improvement"];

  return `Flashcards: What is the pathophysiology of ${focus}? What are the key historical features? What physical examination findings are most discriminating? What is the appropriate diagnostic workup? What are the first-line and second-line treatments? What monitoring is required? What are the indications for referral? Practice questions: use the pre-test and post-test stems attached to this lesson to rehearse diagnostic reasoning and management decisions. CAT pool connection: tag missed questions to ${system} and ${examName} competency frameworks so the learner reviews this topic again during adaptive practice. Related topics: ${related.join(", ")}. Continue with advanced assessment techniques, clinical pharmacology updates, and guideline review sessions.`;
}

function buildNPLesson(system, concept, index, examName) {
  const title = titleCase(concept);
  const slug = `np-${slugify(concept)}`;
  const focus = concept;

  const flashcardPrompts = [
    `What is the pathophysiology of ${focus}?`,
    `What are the key diagnostic criteria for ${focus}?`,
    `What is the first-line treatment for ${focus}?`,
    `What monitoring is required for ${focus} management?`,
    `What are the indications for referral in ${focus}?`,
    `What are the red flags that require urgent intervention?`,
    `How do comorbidities affect management of ${focus}?`,
  ];

  const isHighYield = index < 150;

  // Build base lesson without pathway-specific metadata
  // The seoTitle will be filled in by pathway-specific wrapper
  const seoDescription = `Nurse practitioner board review: ${title}. Comprehensive coverage of diagnosis, differential diagnosis, pharmacologic and non-pharmacologic management, and clinical decision-making for ${examName} certification.`;

  return {
    slug,
    title: `${title}: NP Diagnosis and Management`,
    topic: system.system,
    topicSlug: system.topicSlug,
    bodySystem: system.system,
    previewSectionCount: 1,
    // Use placeholder for seoTitle - will be filled by pathway wrapper
    seoTitle: `{{EXAM_NAME}}`,
    seoDescription,
    sections: [
      {
        id: "overview",
        kind: "introduction",
        heading: "Overview and Learning Objectives",
        body: buildNPOverview(title, system.system, focus, examName),
      },
      {
        id: "pathophysiology",
        kind: "pathophysiology_overview",
        heading: "Pathophysiology and Clinical Mechanisms",
        body: buildNPPathophysiology(title, system.system, focus),
      },
      {
        id: "differential-diagnosis",
        kind: "core_concept",
        heading: "Differential Diagnosis",
        body: `The differential diagnosis for ${focus} includes conditions that share similar presenting features. NPs must systematically consider: conditions with overlapping symptoms, conditions that are more serious and must not be missed, conditions that are more common in specific populations, and iatrogenic causes including medication side effects. Key differentiating features include: onset and tempo of symptoms, associated findings that point to specific organ systems, laboratory and imaging patterns that narrow the differential, and response to initial therapy. The NP uses clinical prediction rules and pretest probability to guide diagnostic testing efficiently, avoiding both under-testing (missing serious conditions) and over-testing (unnecessary cost and potential harm).`,
      },
      {
        id: "signs-symptoms",
        kind: "signs_symptoms",
        heading: "Clinical Presentation and Assessment",
        body: buildNPSymptoms(title, system.system, focus),
      },
      {
        id: "diagnostic-workup",
        kind: "labs_diagnostics",
        heading: "Diagnostic Workup",
        body: `Diagnostic evaluation for ${focus} should be systematic and evidence-based. Initial workup typically includes: focused history and physical examination findings, basic laboratory studies (CBC, CMP, and condition-specific markers), imaging studies when indicated by clinical presentation, and functional testing when appropriate. Advanced or specialized testing is reserved for: atypical presentations, failure to respond to initial therapy, suspicion of complications, or when the diagnosis remains uncertain after initial evaluation. NPs must consider test characteristics (sensitivity, specificity, predictive values), cost-effectiveness, patient factors (renal function, allergies, pregnancy), and the potential for incidental findings when selecting diagnostic tests.`,
      },
      {
        id: "assessment-interventions",
        kind: "nursing_assessment_interventions",
        heading: "NP Assessment and Clinical Reasoning",
        body: buildNPAssessment(title, system.system, focus),
      },
      {
        id: "pharmacologic-management",
        kind: "clinical_scenario",
        heading: "Pharmacologic Management",
        body: `Pharmacotherapy for ${focus} should follow evidence-based guidelines while accounting for patient-specific factors. First-line agents are selected based on: proven efficacy in clinical trials, favorable side effect profile, cost and access considerations, dosing convenience to support adherence, and compatibility with patient comorbidities and concurrent medications. NPs must monitor for: therapeutic response using validated measures, adverse effects and drug interactions, need for dose adjustment based on renal or hepatic function, and signs of toxicity or treatment failure. Second-line and adjunctive therapies are considered when: first-line therapy is ineffective or not tolerated, disease severity warrants combination therapy, or specific patient factors favor alternative agents.`,
      },
      {
        id: "non-pharmacologic-management",
        kind: "clinical_meaning",
        heading: "Non-Pharmacologic Management",
        body: `Non-pharmacologic interventions are integral to comprehensive management of ${focus}. Lifestyle modifications include: dietary changes appropriate to the condition (e.g., sodium restriction, carbohydrate modification, anti-inflammatory diet), physical activity recommendations tailored to patient capability and safety, stress management and sleep hygiene when relevant, and substance use modification (tobacco cessation, alcohol moderation). Additional interventions may include: physical or occupational therapy for functional limitations, cognitive behavioral therapy or counseling for condition-related psychological impact, complementary therapies with evidence of benefit, and assistive devices or adaptive equipment when indicated. NPs coordinate these interventions with other healthcare team members and monitor adherence and effectiveness.`,
      },
      {
        id: "red-flags-referral",
        kind: "exam_relevance",
        heading: "Red Flags and Referral Criteria",
        body: `NPs must recognize findings that warrant urgent evaluation or specialist referral. Red flags requiring immediate attention include: signs of hemodynamic instability, evidence of organ dysfunction or failure, symptoms suggesting life-threatening complications, laboratory values in critical ranges, and rapid clinical deterioration. Indications for specialist referral include: diagnostic uncertainty after initial workup, failure to respond to appropriate first-line therapy, need for procedures outside NP scope, complex comorbidities requiring subspecialty expertise, and conditions requiring advanced therapies or clinical trial enrollment. The NP maintains responsibility for overall care coordination even when specialty consultation is obtained, ensuring communication between providers and continuity of care.`,
      },
      {
        id: "patient-education",
        kind: "client_education",
        heading: "Patient Education and Follow-up",
        body: `Patient education for ${focus} should be comprehensive and tailored to health literacy level. Key teaching points include: the nature of the condition and expected course, medication purpose dosing and potential side effects, lifestyle modifications and their rationale, self-monitoring techniques when appropriate, warning signs that require medical attention, and strategies to improve adherence. Follow-up intervals should be established based on: disease severity and stability, need for medication titration or monitoring, presence of comorbidities, and patient understanding and confidence in self-management. The NP uses teach-back methodology to confirm understanding and addresses barriers to adherence including cost, access, health beliefs, and social determinants of health.`,
      },
      {
        id: "clinical-pearls",
        kind: "clinical_pearls",
        heading: "Clinical Pearls and Exam Tips",
        body: buildNPPearls(title, system.system, focus, examName),
      },
      {
        id: "linked-materials",
        kind: "related_next_steps",
        heading: "Linked Study Materials",
        body: buildNPLinkedMaterials(title, system.system, focus, examName, system.topicSlug),
      },
    ],
    studyTakeaways: [
      `Apply systematic diagnostic reasoning for ${focus}.`,
      "Select evidence-based pharmacologic and non-pharmacologic interventions.",
      "Recognize red flags requiring urgent intervention or referral.",
      "Coordinate care and educate patients for optimal self-management.",
      "Use clinical practice guidelines while individualizing care.",
    ],
    studyCommonTraps: [
      "Anchoring on initial diagnosis without reassessment.",
      "Overlooking atypical presentations in special populations.",
      "Missing drug interactions or contraindications.",
      "Failing to establish clear follow-up and monitoring plans.",
      "Not considering cost and access barriers to treatment.",
    ],
    memoryAnchor: `${system.system} NP: assess, diagnose, treat, educate, coordinate.`,
    premiumOmittedSections: [
      {
        kind: "country_specific_notes",
        reason: `NP scope and regulations are encoded in pathway, exam metadata, and the lesson body.`,
      },
    ],
    relatedLessonRefs: [],
    preTest: [
      {
        question: `A patient presents with symptoms suggestive of ${focus}. What is the most appropriate initial step in evaluation?`,
        options: [
          "Comprehensive history and focused physical examination",
          "Order advanced imaging immediately",
          "Start empiric treatment without workup",
          "Refer to specialist before evaluation",
        ],
        correct: 0,
        rationale: "The NP begins with thorough history and physical examination to guide targeted diagnostic testing and avoid unnecessary interventions.",
      },
    ],
    postTest: [
      {
        question: `Which management approach best demonstrates appropriate NP clinical judgment for ${focus}?`,
        options: [
          "Evidence-based treatment plan with patient education and follow-up",
          "Immediate referral without attempting management",
          "Treatment based solely on patient request",
          "Delaying treatment until all possible tests are completed",
        ],
        correct: 0,
        rationale: "NP practice integrates evidence-based guidelines with clinical judgment, patient preferences, and appropriate follow-up to optimize outcomes.",
      },
    ],
    linked_flashcard_prompts: flashcardPrompts,
    // These will be filled by pathway wrapper
    exams: ["NP"],
    countries: ["{{COUNTRY}}"],
    priority: isHighYield ? "high" : "medium",
    examMeta: [
      {
        exam: "NP",
        yieldLevel: isHighYield ? "must_know" : "common",
        clinicalPriority: "routine",
      },
    ],
    audienceTiers: ["np"],
    countryScope: "{{COUNTRY_SCOPE}}",
    examRelevance: isHighYield ? "high_yield" : "core",
  };
}

// Build the shared NP core lessons (without pathway-specific metadata)
const coreLessons = [];
let index = 0;
// Use a generic exam name for the core lessons
const genericExamName = "NP Board Certification";

for (const system of systems) {
  for (const concept of system.concepts) {
    coreLessons.push(buildNPLesson(system, concept, index++, genericExamName));
  }
}

// Verify no duplicate slugs in core
const coreSlugs = new Set();
for (const lesson of coreLessons) {
  if (coreSlugs.has(lesson.slug)) {
    throw new Error(`Duplicate generated slug in core: ${lesson.slug}`);
  }
  coreSlugs.add(lesson.slug);
}

// Write the NP core catalog (shared lessons without pathway-specific metadata)
const npCoreOutPath = path.join(coreRoot, "src/content/pathway-lessons/np-core-catalog.json");
const npCoreOut = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: "scripts/generate-np-parity-expansion-catalog.mjs",
  metadata: {
    description: "NP core lessons shared across all NP pathways (pathway-specific metadata applied at runtime)",
    totalLessons: coreLessons.length,
    systems: systems.map((s) => s.system),
    pathways: npPathways.map((p) => p.pathwayId),
  },
  lessons: coreLessons,
};

fs.writeFileSync(npCoreOutPath, `${JSON.stringify(npCoreOut, null, 2)}\n`, "utf8");

// Write pathway-specific catalogs that reference the core
for (const pathway of npPathways) {
  const pathwayOutPath = path.join(coreRoot, `src/content/pathway-lessons/np-${pathway.pathwayId}-catalog.json`);
  const pathwayOut = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: "scripts/generate-np-parity-expansion-catalog.mjs",
    metadata: {
      description: `NP lessons for ${pathway.pathwayId} (references core + pathway-specific metadata)`,
      pathwayId: pathway.pathwayId,
      examName: pathway.examName,
    },
    // Store pathway-specific metadata that should be applied to core lessons
    pathwayMetadata: {
      examName: pathway.examName,
      country: pathway.countries[0],
      countryScope: pathway.countryScope,
    },
    // Empty lessons array - all lessons come from core
    lessons: [],
  };
  fs.writeFileSync(pathwayOutPath, `${JSON.stringify(pathwayOut, null, 2)}\n`, "utf8");
}

// Also write the legacy combined format for backward compatibility during transition
const legacyOut = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: "scripts/generate-np-parity-expansion-catalog.mjs",
  metadata: {
    description: "NP parity expansion catalog (legacy combined format - use np-core-catalog.json for deduped version)",
    targetCount: "350-450 lessons per pathway",
    systems: systems.map((s) => s.system),
    pathways: npPathways.map((p) => p.pathwayId),
    deduped: true,
    coreLessons: coreLessons.length,
  },
  pathways: {},
};

// Generate pathway-specific lessons from core
for (const pathway of npPathways) {
  const pathwayLessons = coreLessons.map((lesson) => ({
    ...lesson,
    seoTitle: `${lesson.title.replace(": NP Diagnosis and Management", "")} - NP Board Review | ${pathway.examName} Preparation | NurseNest`,
    countries: pathway.countries,
    countryScope: pathway.countryScope,
  }));
  legacyOut.pathways[pathway.pathwayId] = pathwayLessons;
}

const legacyOutPath = path.join(coreRoot, "src/content/pathway-lessons/np-parity-expansion-catalog.json");
fs.writeFileSync(legacyOutPath, `${JSON.stringify(legacyOut, null, 2)}\n`, "utf8");

console.log(`NP Core lessons: ${coreLessons.length}`);
console.log(`Written to: ${path.relative(coreRoot, npCoreOutPath)}`);
for (const pathway of npPathways) {
  console.log(`Pathway metadata: ${pathway.pathwayId} -> ${pathway.examName}`);
}
console.log(`\nLegacy combined format: ${path.relative(coreRoot, legacyOutPath)}`);
console.log(`Total lessons in legacy: ${coreLessons.length * npPathways.length} (${coreLessons.length} per pathway x ${npPathways.length} pathways)`);