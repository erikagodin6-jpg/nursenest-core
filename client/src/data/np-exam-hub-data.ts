export type NpExamContentType = "category" | "condition" | "medication" | "lab-value" | "comparison" | "strategy";

export interface NpExamPracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  isFree: boolean;
}

export interface NpExamInternalLink {
  title: string;
  href: string;
  type: NpExamContentType | "hub" | "question-bank";
}

export interface NpExamFAQ {
  question: string;
  answer: string;
}

export interface NpExamCategoryPage {
  slug: string;
  contentType: "category";
  tier: "np";
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  introText: string;
  sections: { heading: string; content: string }[];
  practiceQuestions: NpExamPracticeQuestion[];
  faqs: NpExamFAQ[];
  internalLinks: NpExamInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export interface NpExamConditionPage {
  slug: string;
  contentType: "condition";
  tier: "np";
  name: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  definition: string;
  pathophysiology: string;
  causesRiskFactors: string[];
  signsSymptoms: { early: string[]; late: string[] };
  differentialDiagnosis: { condition: string; distinguishingFeature: string }[];
  workup: { test: string; rationale: string; expectedFindings: string }[];
  redFlags: string[];
  labs: { name: string; normalRange: string; significance: string }[];
  medications: { name: string; drugClass: string; action: string; sideEffects: string; prescribingNotes: string }[];
  firstLineManagement: string[];
  secondLineManagement: string[];
  nursingInterventions: string[];
  complications: string[];
  followUpConsiderations: string[];
  prescribingPearls: string[];
  patientCounselling: string[];
  examPearls: string[];
  commonTrapAnswers: string[];
  practiceQuestions: NpExamPracticeQuestion[];
  faqs: NpExamFAQ[];
  internalLinks: NpExamInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export interface NpExamMedicationPage {
  slug: string;
  contentType: "medication";
  tier: "np";
  genericName: string;
  brandNames: string[];
  drugClass: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  mechanism: string;
  indications: string[];
  dosing: { indication: string; initialDose: string; targetDose: string; maxDose: string }[];
  titration: string;
  sideEffects: { effect: string; severity: string; detail: string }[];
  contraindications: string[];
  monitoring: string[];
  drugInteractions: { drug: string; interaction: string; severity: string }[];
  prescribingConsiderations: string[];
  patientCounselling: string[];
  examTips: string[];
  practiceQuestions: NpExamPracticeQuestion[];
  faqs: NpExamFAQ[];
  internalLinks: NpExamInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export interface NpExamLabValuePage {
  slug: string;
  contentType: "lab-value";
  tier: "np";
  name: string;
  fullName: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  normalRangeUS: { value: string; unit: string };
  normalRangeCA: { value: string; unit: string };
  overview: string;
  highSignificance: { condition: string; explanation: string }[];
  lowSignificance: { condition: string; explanation: string }[];
  diagnosticWorkupImplications: string[];
  whenToOrder: string[];
  associatedDifferentials: string[];
  associatedConditions: string[];
  nursingImplications: string[];
  examAlerts: string[];
  practiceQuestions: NpExamPracticeQuestion[];
  faqs: NpExamFAQ[];
  internalLinks: NpExamInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export interface NpExamComparisonPage {
  slug: string;
  contentType: "comparison";
  tier: "np";
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  introText: string;
  conditionA: { name: string; features: Record<string, string> };
  conditionB: { name: string; features: Record<string, string> };
  comparisonCategories: string[];
  keyDifferences: string[];
  clinicalPearls: string[];
  practiceQuestions: NpExamPracticeQuestion[];
  faqs: NpExamFAQ[];
  internalLinks: NpExamInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export interface NpExamStrategyPage {
  slug: string;
  contentType: "strategy";
  tier: "np";
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  introText: string;
  sections: { heading: string; content: string; tips?: string[] }[];
  practiceQuestions: NpExamPracticeQuestion[];
  faqs: NpExamFAQ[];
  internalLinks: NpExamInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export type NpExamPage = NpExamCategoryPage | NpExamConditionPage | NpExamMedicationPage | NpExamLabValuePage | NpExamComparisonPage | NpExamStrategyPage;

export const npExamCategories: NpExamCategoryPage[] = [
  {
    slug: "practice-questions",
    contentType: "category",
    tier: "np",
    title: "NP Exam Practice Questions",
    metaTitle: "NP Exam Practice Questions: Free Nurse Practitioner Exam Questions (2025)",
    metaDescription: "Practice with free NP certification exam questions covering advanced clinical reasoning, differential diagnosis, pharmacology, and primary care management with detailed rationales.",
    keywords: "NP exam practice questions, nurse practitioner exam questions, AANP practice questions, ANCC practice questions, NP certification exam prep",
    h1: "NP Exam Practice Questions",
    introText: "Sharpen your advanced clinical reasoning with practice questions designed for NP certification exams. Each question tests your ability to independently diagnose, prescribe, and manage patients — the core competencies assessed on the AANP and ANCC examinations.",
    sections: [
      { heading: "Why NP-Level Practice Questions Are Different", content: "Unlike RN-level questions that focus on nursing interventions and patient safety, NP exam questions require you to think as an independent provider. You must formulate differential diagnoses, select appropriate diagnostic workups, prescribe medications with correct dosing, and develop comprehensive management plans. Each question tests clinical decision-making at the provider level." },
      { heading: "Question Domains on NP Certification Exams", content: "The AANP and ANCC exams cover assessment and diagnosis (differential diagnosis, history and physical exam findings, diagnostic test interpretation), pharmacology (prescribing, drug interactions, monitoring), and clinical management (treatment plans, follow-up, referrals, patient education). Our questions are weighted to match the actual exam blueprint proportions." },
      { heading: "Effective Strategies for NP Exam Questions", content: "Read the stem carefully for age, sex, and comorbidities — these drive the differential. Identify the most likely diagnosis before looking at the options. For pharmacology questions, consider mechanism of action, contraindications, and monitoring requirements. Always think about what the next best step would be in clinical practice." }
    ],
    practiceQuestions: [
      { question: "A 58-year-old male presents with progressive exertional dyspnea, bilateral lower extremity edema, and an S3 gallop. BNP is 850 pg/mL. Chest X-ray shows cardiomegaly with bilateral pleural effusions. What is the most appropriate initial pharmacologic management?", options: ["Metoprolol succinate 25 mg daily", "Furosemide 40 mg IV plus lisinopril 5 mg daily", "Digoxin 0.125 mg daily", "Amlodipine 5 mg daily"], correctIndex: 1, rationale: "Acute decompensated heart failure with volume overload requires loop diuretics for decongestion (furosemide IV) combined with an ACE inhibitor (lisinopril) for afterload reduction and neurohormonal modulation. Beta-blockers are essential but should not be initiated during acute decompensation — they are started after the patient is euvolemic. Digoxin is second-line, and CCBs like amlodipine are generally avoided in systolic HF.", isFree: true },
      { question: "A 34-year-old female presents with palpitations, heat intolerance, unintentional weight loss of 8 kg over 3 months, and a diffuse, non-tender goiter. TSH is <0.01 mIU/L, free T4 is 4.8 ng/dL. What is the next best diagnostic step?", options: ["Thyroid ultrasound", "Radioactive iodine uptake scan", "Fine needle aspiration biopsy", "CT of the neck"], correctIndex: 1, rationale: "With suppressed TSH and elevated free T4 confirming hyperthyroidism plus a diffuse goiter, the next step is a radioactive iodine uptake (RAIU) scan to differentiate the etiology: Graves' disease shows diffuse increased uptake, toxic multinodular goiter shows patchy uptake, and thyroiditis shows decreased uptake. This distinction is critical because management differs significantly. Ultrasound cannot distinguish functional status, and FNA is for nodules suspicious of malignancy.", isFree: true },
      { question: "A 72-year-old male with type 2 diabetes and CKD stage 3b (eGFR 38 mL/min) has an A1C of 8.2%. Current medications include metformin 1000 mg BID. What is the most appropriate medication adjustment?", options: ["Continue metformin, add glipizide 5 mg daily", "Reduce metformin to 500 mg BID, add a GLP-1 receptor agonist", "Discontinue metformin, start insulin glargine", "Continue metformin, add pioglitazone 15 mg daily"], correctIndex: 1, rationale: "With eGFR 38 mL/min (CKD 3b), metformin dose should be reduced to 500 mg BID (FDA recommends dose reduction at eGFR <45 and discontinuation at <30). A GLP-1 receptor agonist (e.g., semaglutide, liraglutide) provides cardiovascular and renal benefit and does not require renal dose adjustment. Sulfonylureas increase hypoglycemia risk in CKD. Pioglitazone causes fluid retention and is risky with potential HF in elderly CKD patients.", isFree: true },
      { question: "A 45-year-old female presents with a 2-week history of fatigue, joint pain, and a butterfly-shaped facial rash. ANA is positive at 1:640 with a homogeneous pattern. Which additional test is most specific for confirming the suspected diagnosis?", options: ["Anti-dsDNA antibodies", "Rheumatoid factor", "ESR", "C-reactive protein"], correctIndex: 0, rationale: "The presentation (butterfly rash, fatigue, joint pain, high-titer ANA with homogeneous pattern) strongly suggests systemic lupus erythematosus (SLE). Anti-dsDNA antibodies are highly specific for SLE (>95% specificity) and correlate with disease activity, particularly lupus nephritis. ANA is sensitive but not specific. RF is associated with rheumatoid arthritis. ESR and CRP are non-specific inflammatory markers.", isFree: true },
      { question: "A 28-year-old female presents with sudden onset severe headache described as 'the worst headache of my life,' neck stiffness, and photophobia. CT head without contrast is negative. What is the next best step?", options: ["Administer sumatriptan and reassess", "Perform lumbar puncture", "Order CT angiography of the head", "Prescribe NSAIDs and schedule follow-up in 48 hours"], correctIndex: 1, rationale: "The classic thunderclap headache with meningismus raises high suspicion for subarachnoid hemorrhage (SAH). CT head is approximately 95% sensitive within 6 hours but misses 5-10% of cases. When CT is negative but clinical suspicion remains high, lumbar puncture is mandatory to evaluate for xanthochromia and elevated RBCs, which confirm SAH. Never dismiss a thunderclap headache with a negative CT alone — missed SAH has catastrophic consequences.", isFree: false }
    ],
    faqs: [
      { question: "How do NP exam questions differ from NCLEX-style questions?", answer: "NP exam questions test at the provider level rather than the nursing level. Instead of asking about nursing interventions, they require you to independently formulate diagnoses, order and interpret diagnostics, prescribe medications with appropriate dosing, and develop comprehensive management plans including referrals and follow-up. The clinical reasoning is at the autonomous provider level." },
      { question: "How many practice questions should I complete before my NP certification exam?", answer: "Most successful candidates complete 2,000-3,000 practice questions across all content domains. Focus on quality over quantity — thoroughly review each rationale, understand why incorrect options are wrong, and identify patterns in your weak areas. Aim for 50-75 questions per study session with full rationale review." },
      { question: "Should I study for the AANP and ANCC differently?", answer: "Both exams test the same core competencies but differ in emphasis. The AANP tends to be more clinically focused with patient scenarios, while the ANCC includes more theory, research, and professional role questions. Review the specific exam blueprint for your chosen certification to allocate study time appropriately." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Differential Diagnosis Guide", href: "/np-exam/differential-diagnosis", type: "category" },
      { title: "Pharmacology for NPs", href: "/np-exam/pharmacology", type: "category" },
      { title: "Primary Care Management", href: "/np-exam/primary-care", type: "category" },
      { title: "Heart Failure — NP Guide", href: "/np-exam/conditions/heart-failure", type: "condition" },
      { title: "ACE Inhibitors", href: "/np-exam/medications/ace-inhibitors", type: "medication" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "differential-diagnosis",
    contentType: "category",
    tier: "np",
    title: "Differential Diagnosis for NP Exams",
    metaTitle: "Differential Diagnosis for Nurse Practitioners: NP Exam Guide (2025)",
    metaDescription: "Master differential diagnosis for NP certification exams. Learn systematic approaches to forming differentials, ruling in/out conditions, and selecting appropriate workups.",
    keywords: "differential diagnosis NP, nurse practitioner differential, NP exam differential diagnosis, clinical reasoning NP, diagnostic workup NP",
    h1: "Differential Diagnosis for Nurse Practitioners",
    introText: "Differential diagnosis is the cornerstone of NP clinical practice and a heavily tested domain on certification exams. Learn to systematically generate, narrow, and confirm diagnoses using evidence-based clinical reasoning.",
    sections: [
      { heading: "The Systematic Approach to Differential Diagnosis", content: "Start with a broad differential based on the chief complaint, then systematically narrow using patient demographics, history, physical exam findings, and targeted diagnostics. Use frameworks such as VINDICATE (Vascular, Infectious, Neoplastic, Degenerative, Iatrogenic, Congenital, Autoimmune, Traumatic, Endocrine/metabolic) to ensure you consider all categories of disease." },
      { heading: "Red Flags That Change Your Differential", content: "Certain clinical findings should immediately shift your thinking toward emergent or life-threatening diagnoses. Thunderclap headache suggests SAH, chest pain with diaphoresis suggests ACS, unilateral leg swelling suggests DVT, and new-onset worst headache of life in a patient over 50 suggests temporal arteritis or mass lesion. Always rule out the most dangerous diagnoses first." },
      { heading: "Choosing the Right Diagnostic Workup", content: "Select tests based on pre-test probability and clinical impact. High-sensitivity tests are best for screening and ruling out (SnNOut), while high-specificity tests confirm diagnoses (SpPIn). Consider cost-effectiveness, invasiveness, and turnaround time. Order the test that will most change your management decision." }
    ],
    practiceQuestions: [
      { question: "A 62-year-old male presents with acute onset right-sided weakness, slurred speech, and facial droop that began 90 minutes ago. Which diagnostic study should be obtained first?", options: ["MRI with diffusion weighting", "CT head without contrast", "CT angiography of head and neck", "Carotid duplex ultrasonography"], correctIndex: 1, rationale: "In acute stroke presentation, non-contrast CT head is the first-line imaging study. The primary purpose is to rapidly exclude hemorrhagic stroke before considering thrombolytic therapy (tPA). CT is faster, more available, and sufficient to rule out hemorrhage. MRI is more sensitive for ischemic stroke but takes longer and delays treatment decisions within the critical tPA window.", isFree: true },
      { question: "A 35-year-old female presents with episodic palpitations, diaphoresis, and severe headaches with blood pressure of 210/120 mmHg. Which laboratory study is most appropriate for initial evaluation?", options: ["Serum cortisol level", "24-hour urine for catecholamines and metanephrines", "Plasma aldosterone/renin ratio", "Thyroid function tests"], correctIndex: 1, rationale: "The classic triad of episodic headaches, diaphoresis, and palpitations with severe hypertension suggests pheochromocytoma. The recommended initial test is 24-hour urine collection for catecholamines and metanephrines (or plasma-free metanephrines). This has high sensitivity (~97%) for detecting pheochromocytoma. Cortisol would assess for Cushing syndrome, aldosterone/renin for Conn syndrome, and TFTs for thyroid disease — all less likely given this classic presentation.", isFree: true },
      { question: "A 48-year-old male presents with 3 months of progressive dysphagia to both solids and liquids simultaneously. What is the most likely category of dysphagia?", options: ["Mechanical obstruction", "Motility disorder", "Inflammatory stricture", "Malignancy"], correctIndex: 1, rationale: "Dysphagia to both solids and liquids simultaneously from the onset suggests a motility disorder (e.g., achalasia, diffuse esophageal spasm, scleroderma esophagus). Mechanical obstruction (stricture, malignancy, web) typically begins with dysphagia to solids only, progressing to liquids as the obstruction worsens. This distinction is a high-yield exam concept.", isFree: true }
    ],
    faqs: [
      { question: "How many differentials should I list on the NP exam?", answer: "Exam questions typically present a scenario and ask you to identify the most likely diagnosis from options. However, in clinical practice and case-study questions, you should be prepared to generate 3-5 differential diagnoses ranked by probability, then explain which findings support or refute each one." },
      { question: "What is the best way to practice differential diagnosis?", answer: "Use clinical vignettes and work through them systematically before looking at the answer choices. Practice generating your own differential before reading the options. Review cases organized by chief complaint (e.g., chest pain, dyspnea, headache) to build pattern recognition across multiple etiologies." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Practice Questions", href: "/np-exam/practice-questions", type: "category" },
      { title: "Diagnostics Guide", href: "/np-exam/diagnostics", type: "category" },
      { title: "DKA vs HHS", href: "/np-exam/compare/dka-vs-hhs", type: "comparison" },
      { title: "Differential Diagnosis Approach", href: "/np-exam/strategy/differential-diagnosis-approach", type: "strategy" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "primary-care",
    contentType: "category",
    tier: "np",
    title: "Primary Care Management for NPs",
    metaTitle: "Primary Care Management for Nurse Practitioners: NP Exam Guide (2025)",
    metaDescription: "Comprehensive primary care management guide for NP certification exams. Covers chronic disease management, preventive care, health maintenance, and evidence-based treatment guidelines.",
    keywords: "primary care NP exam, nurse practitioner primary care, chronic disease management NP, preventive care NP, health maintenance NP exam",
    h1: "Primary Care Management for Nurse Practitioners",
    introText: "Primary care management represents the largest domain on most NP certification exams. Master evidence-based approaches to chronic disease management, preventive care, health screening, and comprehensive patient care across the lifespan.",
    sections: [
      { heading: "Chronic Disease Management", content: "NPs must independently manage chronic conditions including hypertension, diabetes, heart failure, COPD, asthma, thyroid disorders, and depression. This requires understanding guideline-based treatment algorithms, titrating medications to target, monitoring for adverse effects, and coordinating care. Each condition has specific treatment targets, escalation criteria, and referral thresholds that are heavily tested." },
      { heading: "Preventive Care and Screening Guidelines", content: "Know USPSTF recommendations for cancer screening (breast, cervical, colorectal, lung, prostate), cardiovascular risk assessment (ASCVD calculator, lipid screening, hypertension screening), and infectious disease screening. Understand age-specific and risk-factor-specific recommendations, including when to initiate and discontinue screening." },
      { heading: "Patient-Centered Medical Home", content: "NPs function as primary care providers in the patient-centered medical home model. This includes coordinating care across specialties, managing transitions of care, addressing social determinants of health, and integrating behavioral health. Exam questions may test your understanding of the NP role in team-based care and care coordination." }
    ],
    practiceQuestions: [
      { question: "A 55-year-old female with hypertension and type 2 diabetes has a blood pressure of 148/92 mmHg on lisinopril 10 mg daily. A1C is 7.1%. What is the appropriate blood pressure target and next step?", options: ["Target <140/90; increase lisinopril to 20 mg", "Target <130/80; increase lisinopril to 20 mg", "Target <130/80; add amlodipine 5 mg", "Target <120/80; add hydrochlorothiazide 25 mg"], correctIndex: 1, rationale: "Per AHA/ACC 2017 guidelines, the BP target for patients with diabetes is <130/80 mmHg. Current BP is 148/92 on lisinopril 10 mg — the first step is to uptitrate the current medication to its optimal dose (lisinopril 20-40 mg) before adding a second agent. ACE inhibitors are preferred first-line in diabetics for renal protection. Adding a second agent is appropriate if BP remains uncontrolled at maximum dose.", isFree: true },
      { question: "A 50-year-old male with no significant history has a 10-year ASCVD risk score of 12%. LDL is 145 mg/dL. What is the recommended intervention?", options: ["Lifestyle modifications only, recheck in 6 months", "Start moderate-intensity statin therapy", "Start high-intensity statin therapy", "Start ezetimibe"], correctIndex: 1, rationale: "Per ACC/AHA cholesterol guidelines, patients with a 10-year ASCVD risk of 7.5-19.9% (borderline to intermediate risk) should be started on moderate-intensity statin therapy (e.g., atorvastatin 10-20 mg, rosuvastatin 5-10 mg). High-intensity statins are reserved for ASCVD risk ≥20% or established cardiovascular disease. Risk-enhancing factors can further inform the decision in borderline cases.", isFree: true },
      { question: "Which screening test does the USPSTF recommend for colorectal cancer starting at age 45 in average-risk adults?", options: ["Colonoscopy every 10 years only", "FIT (fecal immunochemical test) annually or colonoscopy every 10 years", "Flexible sigmoidoscopy every 5 years only", "CT colonography every 5 years only"], correctIndex: 1, rationale: "The USPSTF recommends colorectal cancer screening beginning at age 45 (updated from 50) for average-risk adults. Multiple strategies are acceptable: annual FIT/FOBT, colonoscopy every 10 years, flexible sigmoidoscopy every 5 years, CT colonography every 5 years, or stool DNA test every 1-3 years. The choice should be based on patient preference and access. Screening continues through age 75.", isFree: true }
    ],
    faqs: [
      { question: "How much of the NP exam covers primary care?", answer: "Primary care management typically accounts for 40-60% of NP certification exam content depending on the specialty track. For family NP (FNP) and adult-gerontology primary care NP (AGPCNP) tracks, it is the dominant domain. Understanding chronic disease guidelines, preventive care, and evidence-based treatment algorithms is essential." },
      { question: "Which clinical guidelines should I know for the NP exam?", answer: "Key guidelines include JNC 8/AHA-ACC for hypertension, ADA Standards of Care for diabetes, GOLD for COPD, GINA for asthma, ACC/AHA for cholesterol management, USPSTF for preventive screening, and CDC immunization schedules. Focus on treatment targets, first-line therapies, and escalation criteria." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Chronic Disease Management", href: "/np-exam/chronic-disease-management", type: "category" },
      { title: "Pharmacology for NPs", href: "/np-exam/pharmacology", type: "category" },
      { title: "Hypertension — NP Guide", href: "/np-exam/conditions/hypertension", type: "condition" },
      { title: "Diabetes (DKA/HHS)", href: "/np-exam/conditions/diabetes-dka-hhs", type: "condition" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "pharmacology",
    contentType: "category",
    tier: "np",
    title: "Pharmacology for NP Exams",
    metaTitle: "NP Pharmacology Review: Prescribing, Drug Interactions & Exam Prep (2025)",
    metaDescription: "Master NP-level pharmacology for certification exams. Covers prescribing principles, dosing, titration, drug interactions, monitoring, and evidence-based prescribing for nurse practitioners.",
    keywords: "NP pharmacology, nurse practitioner prescribing, NP drug interactions, pharmacology NP exam, prescribing for nurse practitioners",
    h1: "Pharmacology for Nurse Practitioners",
    introText: "Pharmacology is the second-largest domain on NP certification exams, accounting for approximately 20-25% of exam content. NP-level pharmacology goes beyond drug knowledge to include autonomous prescribing decisions, dosing, titration, drug-drug interactions, and monitoring parameters.",
    sections: [
      { heading: "Prescribing Principles for NPs", content: "NP prescribing requires integration of pharmacokinetics, pharmacodynamics, patient-specific factors (age, renal/hepatic function, comorbidities, pregnancy), and evidence-based guidelines. Always consider the risk-benefit ratio, start low and go slow in elderly patients, and adjust dosing for organ impairment. Know which drugs require renal dose adjustment and which are hepatically metabolized." },
      { heading: "High-Yield Drug Classes", content: "Focus on drug classes most commonly prescribed in primary care: antihypertensives (ACEi, ARBs, CCBs, thiazides, beta-blockers), diabetes medications (metformin, sulfonylureas, GLP-1 RAs, SGLT2 inhibitors, insulin), lipid-lowering agents (statins, ezetimibe), thyroid medications, antidepressants (SSRIs, SNRIs), antibiotics, and respiratory medications (ICS, LABAs, SABAs, anticholinergics)." },
      { heading: "Drug Interactions and Safety", content: "Know clinically significant drug interactions: warfarin with numerous medications, serotonin syndrome risk with SSRIs + MAOIs/tramadol/triptans, QT prolongation with multiple drug classes, hyperkalemia risk with ACEi + spironolactone + K+ supplements, metformin and contrast dye, and cytochrome P450 inducers/inhibitors. Understanding CYP3A4 and CYP2D6 pathways is high-yield." }
    ],
    practiceQuestions: [
      { question: "A 68-year-old female on warfarin for atrial fibrillation is prescribed fluconazole for a vaginal yeast infection. What is the most important consideration?", options: ["Fluconazole is contraindicated with warfarin", "Monitor INR closely; fluconazole inhibits CYP2C9 and potentiates warfarin", "Switch warfarin to a DOAC before starting fluconazole", "No interaction; proceed with standard dosing"], correctIndex: 1, rationale: "Fluconazole is a potent inhibitor of CYP2C9 and CYP3A4, the primary enzymes responsible for warfarin metabolism. This interaction significantly increases INR and bleeding risk. The NP should prescribe fluconazole at the lowest effective dose, reduce warfarin dose empirically, and check INR within 3-5 days. This is not an absolute contraindication but requires careful management.", isFree: true },
      { question: "Which class of diabetes medications has demonstrated cardiovascular and renal protective benefits independent of glucose lowering?", options: ["Sulfonylureas", "DPP-4 inhibitors", "GLP-1 receptor agonists and SGLT2 inhibitors", "Thiazolidinediones"], correctIndex: 2, rationale: "Multiple landmark trials (EMPA-REG OUTCOME, LEADER, SUSTAIN-6, CREDENCE, DAPA-HF) have demonstrated that SGLT2 inhibitors and GLP-1 receptor agonists provide cardiovascular and renal protection independent of their glucose-lowering effects. Current ADA guidelines recommend these agents for patients with established ASCVD, heart failure, or CKD regardless of A1C. This has fundamentally changed the diabetes treatment algorithm.", isFree: true },
      { question: "An NP is considering starting an SSRI for a patient currently taking tramadol for chronic pain. What is the primary safety concern?", options: ["Hepatotoxicity", "Serotonin syndrome", "QT prolongation", "Respiratory depression"], correctIndex: 1, rationale: "Both SSRIs and tramadol have serotonergic activity. Combining them increases the risk of serotonin syndrome, a potentially fatal condition characterized by mental status changes, autonomic instability, and neuromuscular abnormalities (clonus, hyperreflexia, hyperthermia). If an SSRI is necessary, consider switching the pain medication or using the lowest effective doses with close monitoring. Other serotonergic drugs to watch: MAOIs, SNRIs, triptans, linezolid, and St. John's Wort.", isFree: true }
    ],
    faqs: [
      { question: "How much pharmacology is on the NP certification exam?", answer: "Pharmacology typically accounts for 20-25% of NP certification exam content. Questions test prescribing decisions, dosing, drug interactions, monitoring, and safety considerations. You need to know first-line agents for common conditions, contraindications, and how to adjust therapy based on patient-specific factors." },
      { question: "What are the most commonly tested drug interactions on the NP exam?", answer: "High-yield drug interactions include: warfarin with CYP inhibitors (azoles, macrolides, amiodarone), serotonin syndrome combinations (SSRIs with tramadol, MAOIs, triptans), ACE inhibitors with potassium-sparing diuretics (hyperkalemia), metformin with renal impairment/contrast dye, and QT-prolonging drug combinations. Understanding the CYP450 system is essential." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "ACE Inhibitors", href: "/np-exam/medications/ace-inhibitors", type: "medication" },
      { title: "Beta-Blockers", href: "/np-exam/medications/beta-blockers", type: "medication" },
      { title: "SSRIs", href: "/np-exam/medications/ssris", type: "medication" },
      { title: "Metformin", href: "/np-exam/medications/metformin", type: "medication" },
      { title: "Statins", href: "/np-exam/medications/statins", type: "medication" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "diagnostics",
    contentType: "category",
    tier: "np",
    title: "Diagnostics for NP Exams",
    metaTitle: "Diagnostic Test Interpretation for Nurse Practitioners: NP Exam Guide (2025)",
    metaDescription: "Learn to order, interpret, and act on diagnostic tests for NP certification exams. Covers lab values, imaging, sensitivity/specificity, and evidence-based diagnostic algorithms.",
    keywords: "NP diagnostics, nurse practitioner lab interpretation, diagnostic tests NP exam, lab values NP, imaging interpretation NP",
    h1: "Diagnostics and Test Interpretation for Nurse Practitioners",
    introText: "As an NP, you independently order and interpret diagnostic studies. This guide covers essential lab values, imaging interpretation, and evidence-based diagnostic algorithms tested on certification exams.",
    sections: [
      { heading: "Ordering Appropriate Diagnostic Tests", content: "The key principle is clinical utility — will the test result change your management? Consider pre-test probability (how likely is the diagnosis before testing), sensitivity and specificity (SnNOut and SpPIn), and the clinical context. Avoid shotgun testing; instead, use a hypothesis-driven approach where each test is ordered to confirm or rule out a specific differential." },
      { heading: "Interpreting Lab Values in Clinical Context", content: "Lab values must be interpreted within the clinical picture, not in isolation. A mildly elevated troponin in an elderly patient with renal insufficiency has different significance than in a 45-year-old with acute chest pain. Understand the factors that cause false positives and false negatives for common tests. Know critical values that require immediate action." },
      { heading: "Imaging Interpretation Basics", content: "NPs should be able to identify key findings on chest X-rays (consolidation, effusion, cardiomegaly, pneumothorax), ECGs (STEMI, atrial fibrillation, heart blocks, bundle branch blocks), and understand when to order advanced imaging (CT, MRI, ultrasound). Know the appropriate imaging study for common presentations and radiation-free alternatives when available." }
    ],
    practiceQuestions: [
      { question: "A 55-year-old male with suspected pulmonary embolism has a Wells score of 2. D-dimer is 450 ng/mL (normal <500 ng/mL). What is the most appropriate next step?", options: ["Order CT pulmonary angiography", "Start empiric anticoagulation", "PE is effectively ruled out; pursue alternative diagnoses", "Order bilateral lower extremity duplex ultrasound"], correctIndex: 2, rationale: "With a low pre-test probability (Wells score ≤4) and a negative D-dimer (<500 ng/mL), PE can be effectively ruled out with a negative predictive value >99%. D-dimer has high sensitivity but low specificity — it is useful for ruling out PE in low-to-moderate probability patients (SnNOut principle). No further imaging is needed. If D-dimer were elevated, CT-PA would be the next step.", isFree: true },
      { question: "Which ECG finding is most consistent with acute ST-elevation myocardial infarction (STEMI) of the inferior wall?", options: ["ST elevation in leads V1-V4", "ST elevation in leads II, III, and aVF", "ST elevation in leads I and aVL", "ST depression in leads V1-V3 with tall R waves"], correctIndex: 1, rationale: "Inferior STEMI shows ST elevation in leads II, III, and aVF, which correspond to the inferior wall of the heart supplied by the right coronary artery (RCA) in most patients. V1-V4 indicates anterior STEMI (LAD territory). I and aVL indicate lateral STEMI (LCx territory). Posterior STEMI shows reciprocal changes in V1-V3 with ST depression and tall R waves.", isFree: true },
      { question: "A 40-year-old female has a TSH of 8.2 mIU/L and free T4 of 1.0 ng/dL (normal). Anti-TPO antibodies are positive. What is the diagnosis and recommended management?", options: ["Overt hypothyroidism; start levothyroxine immediately", "Subclinical hypothyroidism with Hashimoto's; monitor TSH in 6-8 weeks", "Hashimoto's thyroiditis; start levothyroxine 50 mcg daily", "Euthyroid sick syndrome; no treatment needed"], correctIndex: 2, rationale: "TSH of 8.2 with normal free T4 is subclinical hypothyroidism. However, with positive anti-TPO antibodies (confirming Hashimoto's thyroiditis) and TSH >7-10, treatment with levothyroxine is generally recommended as progression to overt hypothyroidism is likely. Starting dose is typically 1.6 mcg/kg/day for younger patients, or 25-50 mcg in elderly/cardiac patients. Recheck TSH in 6-8 weeks.", isFree: true }
    ],
    faqs: [
      { question: "What lab values should NPs know for the certification exam?", answer: "Key lab values include CBC with differential, BMP/CMP (electrolytes, glucose, renal function, liver function), thyroid panel (TSH, free T4, free T3), lipid panel, A1C, BNP/NT-proBNP, troponin, D-dimer, ABGs, urinalysis, coagulation studies (PT/INR, PTT), and inflammatory markers (CRP, ESR). Know normal ranges, critical values, and clinical significance of abnormalities." },
      { question: "How do I approach imaging questions on the NP exam?", answer: "Focus on first-line imaging for common presentations: chest X-ray for respiratory complaints, CT head without contrast for acute stroke/headache, ultrasound for RUQ pain/pregnancy/thyroid, CT abdomen for acute abdomen, and MRI for soft tissue/CNS evaluation. Know when to use contrast and when radiation-free alternatives are preferred." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Lab Values Overview", href: "/np-exam/lab-values", type: "category" },
      { title: "Potassium", href: "/np-exam/lab-values/potassium", type: "lab-value" },
      { title: "ABGs", href: "/np-exam/lab-values/abgs", type: "lab-value" },
      { title: "CBC Interpretation", href: "/np-exam/lab-values/cbc-interpretation", type: "lab-value" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "chronic-disease-management",
    contentType: "category",
    tier: "np",
    title: "Chronic Disease Management for NPs",
    metaTitle: "Chronic Disease Management for Nurse Practitioners: NP Exam Guide (2025)",
    metaDescription: "Master chronic disease management for NP certification exams. Evidence-based treatment algorithms, medication titration, monitoring, and follow-up for common chronic conditions.",
    keywords: "chronic disease management NP, nurse practitioner chronic care, NP exam chronic conditions, disease management NP certification",
    h1: "Chronic Disease Management for Nurse Practitioners",
    introText: "Chronic disease management is a core NP competency requiring you to independently initiate, titrate, and monitor treatment plans over time. Master the evidence-based algorithms that guide long-term management of the most common conditions in primary care.",
    sections: [
      { heading: "Treatment Algorithm Mastery", content: "Know step-wise treatment algorithms for hypertension (JNC/AHA-ACC guidelines), diabetes (ADA standards of care), hyperlipidemia (ACC/AHA cholesterol guidelines), COPD (GOLD guidelines), asthma (GINA/NAEPP guidelines), and heart failure (AHA/ACC HF guidelines). Understand when to initiate therapy, how to titrate to target, when to add agents, and when to refer." },
      { heading: "Monitoring and Follow-Up", content: "Each chronic condition has specific monitoring parameters and follow-up intervals. Hypertension: recheck BP 4 weeks after medication change. Diabetes: A1C every 3 months until stable, then every 6 months; annual eye, foot, and renal exams. Hypothyroidism: TSH 6-8 weeks after dose change. Statins: lipid panel and LFTs 4-12 weeks after initiation. Know when to order baseline labs before starting medications." },
      { heading: "Lifestyle Modifications as First-Line Therapy", content: "Many chronic conditions benefit from lifestyle modifications before or alongside pharmacotherapy. DASH diet and sodium restriction for hypertension, therapeutic lifestyle changes for dyslipidemia, structured exercise programs for diabetes, smoking cessation for COPD, and weight management for metabolic syndrome. Know the expected magnitude of benefit from each intervention (e.g., DASH diet reduces SBP by 8-14 mmHg)." }
    ],
    practiceQuestions: [
      { question: "A 60-year-old male with newly diagnosed type 2 diabetes has an A1C of 7.4% and eGFR of 72 mL/min. He has a history of heart failure with reduced ejection fraction (HFrEF). What is the most appropriate initial diabetes medication?", options: ["Metformin monotherapy", "Metformin plus an SGLT2 inhibitor", "Glipizide monotherapy", "Insulin glargine"], correctIndex: 1, rationale: "Per ADA 2024 guidelines, patients with type 2 diabetes and established heart failure should receive an SGLT2 inhibitor (empagliflozin or dapagliflozin) regardless of A1C, as these agents reduce HF hospitalization and cardiovascular mortality. Metformin remains first-line for glucose lowering. The combination addresses both glycemic control and the cardio-renal comorbidity. SGLT2 inhibitors are safe with eGFR >20 mL/min.", isFree: true },
      { question: "A patient with COPD has been on a LAMA (tiotropium) monotherapy and continues to have 2 exacerbations per year with persistent dyspnea (mMRC ≥2). What is the next step per GOLD guidelines?", options: ["Add ICS", "Add LABA to form LAMA + LABA combination", "Switch to ICS + LABA", "Add oral theophylline"], correctIndex: 1, rationale: "Per GOLD guidelines, for patients on LAMA monotherapy with persistent symptoms and exacerbations, the next step is escalation to LAMA + LABA combination therapy. ICS is added (triple therapy: ICS + LAMA + LABA) only if blood eosinophils are ≥300 or if the patient has ≥2 moderate exacerbations despite dual bronchodilator therapy. ICS + LABA without LAMA is no longer the preferred escalation pathway.", isFree: true }
    ],
    faqs: [
      { question: "How do I remember all the treatment algorithms for the NP exam?", answer: "Focus on the decision points rather than memorizing entire algorithms. Know first-line therapy for each condition, when to add a second agent, which comorbidities change your drug choice (e.g., ACEi in diabetic hypertension, SGLT2i in HF), and when to refer. Practice with clinical scenarios that require you to apply algorithms to specific patients." },
      { question: "What monitoring is required when starting common medications?", answer: "Key monitoring: ACEi/ARBs — BMP at baseline and 1-2 weeks (creatinine, potassium); Statins — lipid panel and LFTs at 4-12 weeks; Metformin — renal function annually; Levothyroxine — TSH at 6-8 weeks; SSRIs — suicidality risk in first weeks, especially age <25; Warfarin — INR weekly until stable, then monthly." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Heart Failure", href: "/np-exam/conditions/heart-failure", type: "condition" },
      { title: "COPD", href: "/np-exam/conditions/copd", type: "condition" },
      { title: "Hypertension", href: "/np-exam/conditions/hypertension", type: "condition" },
      { title: "Diabetes (DKA/HHS)", href: "/np-exam/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "ACE Inhibitors", href: "/np-exam/medications/ace-inhibitors", type: "medication" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "case-studies",
    contentType: "category",
    tier: "np",
    title: "NP Clinical Case Studies",
    metaTitle: "NP Clinical Case Studies: Practice Clinical Reasoning for NP Exams (2025)",
    metaDescription: "Work through advanced clinical case studies designed for NP certification exam preparation. Develop differential diagnosis, workup, and management skills with realistic patient scenarios.",
    keywords: "NP case studies, nurse practitioner clinical cases, NP exam case scenarios, clinical reasoning NP, case-based learning NP",
    h1: "NP Clinical Case Studies",
    introText: "Clinical case studies are the gold standard for developing the autonomous clinical reasoning tested on NP certification exams. Work through realistic patient presentations from chief complaint through diagnosis, management, and follow-up.",
    sections: [
      { heading: "How to Approach Clinical Cases", content: "Use a systematic approach: (1) Identify the chief complaint and key history elements, (2) Generate a differential diagnosis ranked by probability, (3) Determine the focused physical exam findings needed, (4) Select targeted diagnostic studies, (5) Interpret results in context, (6) Formulate a treatment plan including pharmacologic and non-pharmacologic interventions, (7) Plan follow-up and monitoring, (8) Identify when to refer." },
      { heading: "Case Study Format on NP Exams", content: "NP certification exams use clinical vignettes of varying complexity. Simple vignettes present classic presentations and test pattern recognition. Complex vignettes include comorbidities, atypical presentations, or management complications that require nuanced clinical reasoning. Some questions present a case that evolves over multiple items, testing your ability to modify management as new information becomes available." },
      { heading: "High-Yield Case Categories", content: "Focus on cases involving: acute presentations in primary care (chest pain, dyspnea, abdominal pain, headache), chronic disease exacerbations (HF decompensation, COPD exacerbation, DKA), medication management complications (adverse effects, drug interactions, therapeutic failures), and preventive care decision-making (screening, immunizations, risk factor modification)." }
    ],
    practiceQuestions: [
      { question: "A 52-year-old obese male presents with sudden onset substernal chest pressure radiating to the left arm, diaphoresis, and nausea for 45 minutes. BP 162/98, HR 96. ECG shows ST elevation in V1-V4. What is the immediate priority?", options: ["Administer aspirin 325 mg, activate cardiac catheterization lab", "Order troponin and wait for results", "Start nitroglycerin drip and morphine", "Perform complete history and physical"], correctIndex: 0, rationale: "Anterior STEMI (ST elevation in V1-V4) is a time-critical emergency. Immediate priorities: aspirin 325 mg chewed, activate the cardiac catheterization lab for primary PCI (door-to-balloon time <90 minutes), and initiate adjunctive therapy. Do not delay for troponin results — the ECG is diagnostic. Time is myocardium: every 30-minute delay increases mortality by 7.5%.", isFree: true },
      { question: "A 68-year-old female presents with 3-day history of productive cough with rust-colored sputum, fever 39.2°C, and right lower lobe consolidation on chest X-ray. She has COPD and takes tiotropium. CURB-65 score is 2. What is the most appropriate management?", options: ["Outpatient azithromycin for 5 days", "Hospital admission; IV ceftriaxone plus azithromycin", "Outpatient amoxicillin-clavulanate plus azithromycin", "Hospital admission; IV levofloxacin monotherapy"], correctIndex: 1, rationale: "CURB-65 score of 2 indicates moderate-severity community-acquired pneumonia (CAP) requiring hospital admission (scores 0-1: outpatient, 2: consider admission, 3-5: admission/ICU). Inpatient CAP treatment per ATS/IDSA guidelines is a beta-lactam (ceftriaxone) plus a macrolide (azithromycin) or respiratory fluoroquinolone monotherapy. The combination provides coverage for typical and atypical organisms. Her COPD is a risk factor for Pseudomonas but does not change empiric therapy unless she has structural lung disease or recent antibiotic exposure.", isFree: true }
    ],
    faqs: [
      { question: "How should I practice case studies for the NP exam?", answer: "Work through cases in timed conditions (2-3 minutes per question) to simulate exam pace. Start by covering the answer choices and formulating your own differential and plan, then compare with the options. After answering, thoroughly review rationales for all options. Group cases by chief complaint to build pattern recognition." },
      { question: "Are case studies different from regular practice questions?", answer: "Case studies typically involve more clinical complexity and may require integrating multiple data points (history, exam, labs, imaging) to reach a clinical decision. They test the same competencies as individual questions but in a more integrated, realistic format. Some cases evolve over multiple questions, testing your ability to reassess and modify management." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Practice Questions", href: "/np-exam/practice-questions", type: "category" },
      { title: "Case Study Approach", href: "/np-exam/strategy/case-study-approach", type: "strategy" },
      { title: "SOAP Notes Methodology", href: "/np-exam/strategy/soap-notes-methodology", type: "strategy" },
      { title: "Heart Failure", href: "/np-exam/conditions/heart-failure", type: "condition" },
      { title: "Pneumonia", href: "/np-exam/conditions/pneumonia", type: "condition" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "exam-strategy",
    contentType: "category",
    tier: "np",
    title: "NP Exam Strategy",
    metaTitle: "NP Exam Strategy: Study Plan, Test-Taking Tips & Certification Guide (2025)",
    metaDescription: "Comprehensive NP exam strategy guide with study planning, test-taking techniques, time management, and strategies specific to AANP and ANCC certification examinations.",
    keywords: "NP exam strategy, nurse practitioner exam tips, AANP exam strategy, ANCC exam tips, NP certification strategy, NP study plan",
    h1: "NP Exam Strategy and Test-Taking Guide",
    introText: "Success on NP certification exams requires both clinical knowledge and effective test-taking strategy. This guide covers study planning, question analysis techniques, time management, and certification-specific strategies for the AANP and ANCC examinations.",
    sections: [
      { heading: "Building Your NP Exam Study Plan", content: "Begin studying 3-4 months before your exam date. Divide your study time proportionally based on the exam blueprint: assessment and diagnosis (40-45%), pharmacology (20-25%), and clinical management (25-30%). Use a combination of review courses, textbooks, practice questions, and clinical case studies. Schedule practice exams at regular intervals to track progress and identify weak areas." },
      { heading: "Test-Taking Strategies for NP Exams", content: "Read the stem completely before looking at options — identify the patient age, sex, comorbidities, and what is being asked. Determine what level of Bloom's taxonomy is being tested (knowledge, application, analysis). Eliminate obviously incorrect options first, then choose the best remaining answer. For 'next best step' questions, think about what you would do in clinical practice. Avoid overthinking — the exam tests standard-of-care, evidence-based medicine." },
      { heading: "Managing Exam Anxiety and Test Day", content: "Taper studying 2-3 days before the exam and focus on high-yield review rather than learning new material. Get adequate sleep the night before. During the exam, pace yourself (approximately 1.5 minutes per question), flag difficult questions for review, and take allowed breaks. Trust your clinical judgment — your first instinct is usually correct unless you have a specific reason to change your answer." }
    ],
    practiceQuestions: [
      { question: "When an NP exam question asks 'What is the most appropriate next step?', what cognitive level is being tested?", options: ["Knowledge recall", "Comprehension", "Application/Analysis", "Synthesis/Evaluation"], correctIndex: 2, rationale: "'Next best step' questions test application and analysis — you must apply clinical knowledge to a specific patient scenario and analyze the best course of action. These are higher-order questions that require clinical reasoning, not just factual recall. Approach them by thinking about the clinical algorithm and what you would do in practice.", isFree: true },
      { question: "A practice exam reveals your weakest area is pharmacology (58% correct). You have 6 weeks until your certification exam. What is the most effective study strategy?", options: ["Dedicate all study time to pharmacology only", "Maintain balanced study across all domains but increase pharmacology focus to 40% of study time", "Take more practice exams to improve your score", "Focus on memorizing drug names and classifications"], correctIndex: 1, rationale: "The most effective approach is to increase focus on your weak area while maintaining competency in stronger domains. Dedicating 40% of study time to pharmacology while continuing to review other domains prevents attrition of existing knowledge. Use active learning strategies (practice questions with rationale review, drug comparison tables, clinical scenarios) rather than passive memorization.", isFree: true }
    ],
    faqs: [
      { question: "How long should I study for the NP certification exam?", answer: "Most graduates need 3-4 months of dedicated study, spending 15-20 hours per week. Those further from clinical practice or with challenging schedules may need up to 6 months. The key is consistent, structured study rather than cramming. Complete 2,000-3,000 practice questions and at least 2-3 full-length practice exams." },
      { question: "Should I take the AANP or ANCC exam?", answer: "Both certifications are equally valid and accepted. The AANP tends to focus more on clinical scenarios and diagnosis/management, while the ANCC includes more questions on research, theory, and professional role. Review sample questions from both exams and choose the one that aligns better with your strengths. Check with your state board for any specific requirements." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Practice Questions", href: "/np-exam/practice-questions", type: "category" },
      { title: "NP Exam Study Strategy", href: "/np-exam/strategy/np-exam-study-strategy", type: "strategy" },
      { title: "Case Study Approach", href: "/np-exam/strategy/case-study-approach", type: "strategy" },
      { title: "Differential Diagnosis Approach", href: "/np-exam/strategy/differential-diagnosis-approach", type: "strategy" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  }
];

export const npExamConditions: NpExamConditionPage[] = [
  {
    slug: "heart-failure",
    contentType: "condition",
    tier: "np",
    name: "Heart Failure",
    metaTitle: "Heart Failure for Nurse Practitioners: Diagnosis, Management & Prescribing (2025)",
    metaDescription: "Comprehensive NP-level heart failure guide covering differential diagnosis, workup, GDMT prescribing (ACEi, ARBs, beta-blockers, SGLT2i), red flags, and follow-up management.",
    keywords: "heart failure NP, HFrEF management, HFpEF nurse practitioner, heart failure prescribing NP, GDMT heart failure, heart failure differential diagnosis",
    definition: "Heart failure is a clinical syndrome resulting from structural or functional cardiac impairment leading to reduced cardiac output and/or elevated intracardiac pressures. Classified as HFrEF (EF ≤40%), HFmrEF (EF 41-49%), or HFpEF (EF ≥50%), each requiring distinct management approaches.",
    pathophysiology: "Cardiac injury triggers neurohormonal activation (RAAS, sympathetic nervous system) as compensatory mechanisms. Initially maintaining perfusion, these mechanisms become maladaptive over time, causing progressive ventricular remodeling, myocyte hypertrophy, fibrosis, and further deterioration of cardiac function. Volume overload occurs due to sodium and water retention via aldosterone and ADH. Understanding this pathophysiology is essential because GDMT targets these maladaptive pathways: ACEi/ARBs block RAAS, beta-blockers reduce sympathetic overdrive, MRAs block aldosterone, and SGLT2 inhibitors provide osmotic diuresis and cardioprotective effects.",
    causesRiskFactors: [
      "Coronary artery disease (ischemic cardiomyopathy — most common cause)",
      "Hypertension (leading to hypertensive heart disease)",
      "Valvular heart disease (aortic stenosis, mitral regurgitation)",
      "Dilated cardiomyopathy (idiopathic, familial, alcohol-related, peripartum)",
      "Diabetes mellitus (diabetic cardiomyopathy)",
      "Obesity and metabolic syndrome",
      "Arrhythmias (persistent tachycardia-induced cardiomyopathy)",
      "Cardiotoxic agents (anthracyclines, trastuzumab, radiation)",
      "Thyroid disease (both hypothyroidism and thyrotoxicosis)",
      "Infiltrative diseases (amyloidosis, sarcoidosis, hemochromatosis)"
    ],
    signsSymptoms: {
      early: [
        "Dyspnea on exertion (most common initial symptom)",
        "Fatigue and exercise intolerance",
        "Mild peripheral edema (bilateral pitting)",
        "Nocturia (redistribution of fluid when supine)",
        "Paroxysmal nocturnal dyspnea"
      ],
      late: [
        "Orthopnea (requiring multiple pillows to sleep)",
        "S3 gallop (volume overload, high specificity for HF)",
        "Jugular venous distention (JVD)",
        "Hepatojugular reflux",
        "Ascites and hepatomegaly",
        "Pulmonary crackles/rales (may be absent in chronic compensated HF)",
        "Cardiogenic cachexia",
        "Cool, mottled extremities (low cardiac output)"
      ]
    },
    differentialDiagnosis: [
      { condition: "COPD exacerbation", distinguishingFeature: "History of smoking/COPD, absent S3, no peripheral edema, BNP <100, wheezing predominant" },
      { condition: "Pneumonia", distinguishingFeature: "Fever, productive cough, focal consolidation on CXR, elevated WBC/procalcitonin" },
      { condition: "Pulmonary embolism", distinguishingFeature: "Acute onset, pleuritic chest pain, risk factors for VTE, elevated D-dimer, CT-PA positive" },
      { condition: "Nephrotic syndrome", distinguishingFeature: "Proteinuria >3.5 g/day, hypoalbuminemia, peripheral edema without elevated JVP or S3" },
      { condition: "Hepatic cirrhosis", distinguishingFeature: "Ascites, spider angiomata, jaundice, coagulopathy, no pulmonary congestion on CXR" },
      { condition: "Pericardial effusion/tamponade", distinguishingFeature: "Beck's triad (hypotension, JVD, muffled heart sounds), pulsus paradoxus, low-voltage ECG" }
    ],
    workup: [
      { test: "BNP / NT-proBNP", rationale: "Biomarker for myocardial wall stress; highly sensitive for ruling out HF", expectedFindings: "BNP >100 pg/mL or NT-proBNP >300 pg/mL suggests HF; >400/>900 strongly supportive" },
      { test: "Echocardiogram", rationale: "Gold standard for assessing cardiac structure and function", expectedFindings: "Assess EF (HFrEF ≤40%, HFmrEF 41-49%, HFpEF ≥50%), wall motion abnormalities, valvular disease, diastolic dysfunction" },
      { test: "Chest X-ray", rationale: "Assess for pulmonary congestion and cardiomegaly", expectedFindings: "Cardiomegaly (CTR >0.5), cephalization of vessels, Kerley B lines, pleural effusions" },
      { test: "ECG", rationale: "Identify arrhythmias, ischemia, conduction abnormalities", expectedFindings: "LVH, LBBB, atrial fibrillation, Q waves suggesting prior MI" },
      { test: "BMP", rationale: "Assess renal function and electrolytes before starting GDMT", expectedFindings: "Elevated creatinine/BUN (cardiorenal syndrome), hyponatremia (dilutional), hyperkalemia risk with RAAS inhibitors" },
      { test: "CBC, TSH, Iron studies", rationale: "Identify reversible causes and comorbidities", expectedFindings: "Anemia exacerbates HF; hypothyroidism and iron deficiency are treatable causes" }
    ],
    redFlags: [
      "Cardiogenic shock: hypotension, altered mental status, cool extremities, oliguria — requires emergent transfer",
      "Acute pulmonary edema with respiratory failure — immediate IV diuresis, oxygen, possible NIV",
      "New-onset atrial fibrillation with rapid ventricular response destabilizing HF",
      "Acute coronary syndrome precipitating HF decompensation",
      "Severely reduced EF (<20%) with syncope — risk of sudden cardiac death, needs ICD evaluation",
      "Refractory fluid overload despite maximum diuretic therapy — consider ultrafiltration or advanced HF referral"
    ],
    labs: [
      { name: "BNP", normalRange: "<100 pg/mL", significance: "Elevated in HF proportional to severity; guides diagnosis and treatment response" },
      { name: "NT-proBNP", normalRange: "<300 pg/mL", significance: "More accurate than BNP in renal impairment; age-adjusted cutoffs needed in elderly" },
      { name: "Troponin", normalRange: "<0.04 ng/mL", significance: "Mildly elevated in acute decompensation; markedly elevated suggests ACS as trigger" },
      { name: "Sodium", normalRange: "136-145 mEq/L", significance: "Hyponatremia (<135) indicates poor prognosis and excess ADH/water retention" },
      { name: "Creatinine/BUN", normalRange: "0.7-1.3/7-20 mg/dL", significance: "Elevated indicates cardiorenal syndrome; affects ACEi/ARB dosing decisions" }
    ],
    medications: [
      { name: "Lisinopril/Enalapril", drugClass: "ACE Inhibitor", action: "Blocks angiotensin-converting enzyme, reducing afterload and preventing ventricular remodeling", sideEffects: "Dry cough (10-15%), hyperkalemia, angioedema (rare but life-threatening)", prescribingNotes: "Start low (lisinopril 2.5-5 mg daily), uptitrate every 2 weeks to target dose (20-40 mg). Check K+ and creatinine at baseline and 1-2 weeks after each dose change. Hold if K+ >5.5 or creatinine rises >30% from baseline." },
      { name: "Carvedilol/Metoprolol succinate", drugClass: "Beta-Blocker", action: "Reduces sympathetic overdrive, slows HR, prevents remodeling; improves survival in HFrEF", sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm", prescribingNotes: "Start only when patient is euvolemic (not in acute decompensation). Carvedilol 3.125 mg BID or metoprolol succinate 12.5-25 mg daily; uptitrate every 2 weeks. Target: carvedilol 25 mg BID or metoprolol succinate 200 mg daily." },
      { name: "Spironolactone/Eplerenone", drugClass: "Mineralocorticoid Receptor Antagonist", action: "Blocks aldosterone, reducing fibrosis, fluid retention, and potassium wasting", sideEffects: "Hyperkalemia (monitor closely), gynecomastia (spironolactone), renal impairment", prescribingNotes: "Add when EF ≤35% and NYHA II-IV on ACEi + BB. Spironolactone 12.5-25 mg daily. Contraindicated if K+ >5.0 or eGFR <30. Monitor K+ and creatinine weekly for first month." },
      { name: "Empagliflozin/Dapagliflozin", drugClass: "SGLT2 Inhibitor", action: "Osmotic diuresis, reduces preload/afterload, cardioprotective mechanisms beyond glucose lowering", sideEffects: "Genital mycotic infections, UTI, euglycemic DKA (rare), volume depletion", prescribingNotes: "Now a pillar of GDMT for all HFrEF patients regardless of diabetes status. Empagliflozin 10 mg or dapagliflozin 10 mg daily. Safe with eGFR >20. No titration needed. Can be started early, even during hospitalization." },
      { name: "Sacubitril/Valsartan", drugClass: "ARNI", action: "Combines neprilysin inhibitor (increases natriuretic peptides) with ARB; superior to ACEi alone in HFrEF", sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment", prescribingNotes: "Replace ACEi/ARB with sacubitril/valsartan in HFrEF patients who remain symptomatic. Must have 36-hour washout from ACEi before starting (risk of angioedema). Start 24/26 mg BID, target 97/103 mg BID." }
    ],
    firstLineManagement: [
      "GDMT quadruple therapy for HFrEF: ACEi/ARB/ARNI + evidence-based beta-blocker + MRA + SGLT2 inhibitor",
      "Loop diuretics (furosemide) for volume management — not mortality benefit, symptom relief only",
      "Sodium restriction <2 g/day and fluid restriction 1.5-2 L/day in advanced HF",
      "Daily weight monitoring with patient action plan (call if weight gain >2 lb/day or >5 lb/week)",
      "Cardiac rehabilitation referral for stable NYHA I-III"
    ],
    secondLineManagement: [
      "Hydralazine/isosorbide dinitrate for patients intolerant of ACEi/ARB (particularly beneficial in African American patients)",
      "Ivabradine for persistent HR ≥70 bpm despite maximum beta-blocker in sinus rhythm",
      "Digoxin for symptom control in patients with persistent symptoms on GDMT (maintain level 0.5-0.9 ng/mL)",
      "ICD implantation for primary prevention (EF ≤35% after 3 months of optimal GDMT, NYHA II-III)",
      "CRT (cardiac resynchronization therapy) for EF ≤35% + LBBB + QRS ≥150 ms",
      "Advanced HF referral for mechanical circulatory support or transplant evaluation"
    ],
    nursingInterventions: [
      "Assess volume status: daily weights, I&O, JVP assessment, peripheral edema grading",
      "Monitor for medication side effects: orthostatic hypotension with ACEi/BB, hyperkalemia with ACEi/MRA",
      "Cardiac rehabilitation education and exercise prescription",
      "Medication reconciliation at each visit — ensure GDMT optimization",
      "Depression screening (PHQ-9) — high prevalence in HF patients"
    ],
    complications: [
      "Cardiogenic shock and hemodynamic instability",
      "Acute decompensated heart failure requiring hospitalization",
      "Cardiorenal syndrome (worsening renal function with HF progression)",
      "Arrhythmias (atrial fibrillation, ventricular tachycardia, sudden cardiac death)",
      "Thromboembolic events (stroke, DVT/PE)",
      "Hepatic congestion and cardiac cirrhosis"
    ],
    followUpConsiderations: [
      "Follow-up within 7 days of hospital discharge for decompensated HF",
      "Recheck BMP 1-2 weeks after starting or uptitrating ACEi/ARB/ARNI/MRA",
      "Repeat echocardiogram in 3-6 months after initiating GDMT to reassess EF",
      "Annual influenza and pneumococcal vaccination",
      "Consider palliative care referral for NYHA IV with poor prognosis"
    ],
    prescribingPearls: [
      "The four pillars of GDMT (ACEi/ARB/ARNI + BB + MRA + SGLT2i) each independently reduce mortality — all should be initiated early",
      "Start GDMT at low doses and uptitrate to target doses every 2 weeks as tolerated — many patients are under-dosed",
      "Beta-blockers should NOT be started during acute decompensation but should be continued if already on them (reduce dose if needed)",
      "SGLT2 inhibitors can be started regardless of diabetes status — this is now guideline-recommended for all HFrEF",
      "Switch ACEi to ARNI when patient is stable on ACEi — 36-hour washout required to prevent angioedema",
      "Loop diuretics are for symptom management only — no mortality benefit; titrate to the lowest dose that maintains euvolemia"
    ],
    patientCounselling: [
      "Weigh yourself every morning at the same time, same scale, after voiding — call if you gain more than 2 pounds in a day or 5 pounds in a week",
      "Restrict sodium intake to less than 2 grams per day — read food labels carefully, avoid processed foods",
      "Take all heart failure medications as prescribed even when feeling well — these medications protect your heart long-term",
      "Report any dizziness, fainting, or lightheadedness when standing (may indicate medication adjustment needed)",
      "Avoid NSAIDs (ibuprofen, naproxen) — they cause fluid retention and can worsen heart failure",
      "Moderate fluid intake as directed — typically 1.5-2 liters per day in advanced cases",
      "Get a yearly flu shot and stay up to date on pneumonia vaccines"
    ],
    examPearls: [
      "BNP <100 pg/mL effectively rules out heart failure (high negative predictive value)",
      "S3 gallop is the most specific physical exam finding for heart failure",
      "GDMT should include all four pillars — exam questions test whether you can identify missing agents",
      "EF ≤35% after 3 months of optimal GDMT = ICD evaluation for primary prevention of sudden cardiac death",
      "Hyponatremia in heart failure is dilutional (excess water retention via ADH) — treat the HF, not the sodium",
      "ACEi cough is due to bradykinin accumulation — switch to ARB (which does not cause cough)"
    ],
    commonTrapAnswers: [
      "Starting a beta-blocker during acute decompensated heart failure (BB should only be initiated when euvolemic)",
      "Ordering a BNP in a patient already diagnosed with HF to monitor treatment (use symptoms and exam instead, though NT-proBNP trends can guide some decisions)",
      "Choosing digoxin as first-line therapy (it is second-line, used for symptom control after GDMT optimization)",
      "Missing the 36-hour washout between ACEi and ARNI (concurrent use causes dangerous angioedema)",
      "Treating dilutional hyponatremia with normal saline (worsens fluid overload)"
    ],
    practiceQuestions: [
      { question: "A 65-year-old male with HFrEF (EF 30%) is on lisinopril 40 mg, carvedilol 25 mg BID, and furosemide 40 mg daily. He remains symptomatic with NYHA class III symptoms. What is the most appropriate addition to his regimen?", options: ["Digoxin 0.125 mg daily", "Spironolactone 25 mg daily and an SGLT2 inhibitor", "Amlodipine 5 mg daily", "Increase furosemide to 80 mg daily"], correctIndex: 1, rationale: "This patient is on ACEi and BB but is missing two pillars of GDMT: MRA and SGLT2 inhibitor. Both spironolactone and an SGLT2 inhibitor independently reduce mortality in HFrEF and should be added. Digoxin is for symptom control after GDMT optimization. Amlodipine is not indicated in HFrEF. Increasing furosemide addresses symptoms but not mortality.", isFree: true },
      { question: "A patient with newly diagnosed HFrEF is started on lisinopril. When should the NP first reassess renal function and potassium?", options: ["At the next annual physical", "In 6-8 weeks", "In 1-2 weeks", "Only if symptoms develop"], correctIndex: 2, rationale: "ACEi/ARBs can cause hyperkalemia and acute kidney injury by reducing efferent arteriolar pressure in the glomerulus. BMP (creatinine, potassium) should be checked 1-2 weeks after initiation and after each dose increase. Hold the medication if potassium >5.5 mEq/L or creatinine rises >30% from baseline.", isFree: true },
      { question: "Which of the following patients is NOT a candidate for sacubitril/valsartan?", options: ["HFrEF patient on lisinopril with persistent symptoms", "HFrEF patient who took enalapril 12 hours ago", "HFrEF patient on losartan with NYHA III symptoms", "HFpEF patient with recent hospitalization for HF"], correctIndex: 1, rationale: "Sacubitril/valsartan requires a 36-hour washout from any ACE inhibitor before initiation due to the risk of life-threatening angioedema. A patient who took enalapril only 12 hours ago is not a safe candidate. The washout does not apply to ARBs (losartan), so that patient can be switched directly.", isFree: true },
      { question: "A 70-year-old female with HFrEF and CKD stage 3a (eGFR 55 mL/min) asks about starting dapagliflozin. What is the correct guidance?", options: ["SGLT2 inhibitors are contraindicated in CKD", "Dapagliflozin is safe and recommended — no dose adjustment needed with eGFR >20", "Start at half dose and titrate", "Only use if she also has diabetes"], correctIndex: 1, rationale: "SGLT2 inhibitors (dapagliflozin, empagliflozin) are recommended for all HFrEF patients regardless of diabetes status. They are safe to use with eGFR >20 mL/min (updated from previous eGFR >30 threshold). No dose adjustment is needed. The DAPA-HF and EMPEROR-Reduced trials demonstrated mortality benefit irrespective of diabetes or renal function.", isFree: false }
    ],
    faqs: [
      { question: "What are the four pillars of heart failure GDMT?", answer: "The four pillars of guideline-directed medical therapy for HFrEF are: (1) ACE inhibitor, ARB, or ARNI (sacubitril/valsartan preferred), (2) Evidence-based beta-blocker (carvedilol, metoprolol succinate, or bisoprolol), (3) Mineralocorticoid receptor antagonist (spironolactone or eplerenone), and (4) SGLT2 inhibitor (dapagliflozin or empagliflozin). Each independently reduces mortality and should be initiated early at low doses and uptitrated to target doses." },
      { question: "When should you refer a heart failure patient to a cardiologist?", answer: "Refer for: new diagnosis for echocardiogram and etiology workup, EF ≤35% for ICD/CRT evaluation, refractory symptoms despite optimized GDMT, recurrent hospitalizations, consideration of advanced therapies (LVAD, transplant), significant valvular disease, or suspected infiltrative cardiomyopathy. Maintain co-management with primary care for medication management and chronic disease monitoring." },
      { question: "How does HFpEF management differ from HFrEF?", answer: "HFpEF management focuses on treating underlying conditions (hypertension, diabetes, obesity, atrial fibrillation), managing volume with diuretics, and exercise training. Unlike HFrEF, traditional GDMT (ACEi, BB, MRA) has not shown mortality benefit in HFpEF. However, SGLT2 inhibitors (empagliflozin per EMPEROR-Preserved) have shown benefit in reducing HF hospitalizations in HFpEF, representing a major treatment advance." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "ACE Inhibitors", href: "/np-exam/medications/ace-inhibitors", type: "medication" },
      { title: "Beta-Blockers", href: "/np-exam/medications/beta-blockers", type: "medication" },
      { title: "Potassium Lab Values", href: "/np-exam/lab-values/potassium", type: "lab-value" },
      { title: "MI / ACS", href: "/np-exam/conditions/mi-acs", type: "condition" },
      { title: "Hypertension", href: "/np-exam/conditions/hypertension", type: "condition" }
    ],
    references: [
      "Heidenreich PA, et al. 2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure. Circulation. 2022;145(18):e895-e1032.",
      "McMurray JJV, et al. Dapagliflozin in Patients with Heart Failure and Reduced Ejection Fraction (DAPA-HF). N Engl J Med. 2019;381:1995-2008.",
      "Packer M, et al. Cardiovascular and Renal Outcomes with Empagliflozin in Heart Failure (EMPEROR-Reduced). N Engl J Med. 2020;383:1413-1424."
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "hypertension",
    contentType: "condition",
    tier: "np",
    name: "Hypertension",
    metaTitle: "Hypertension Management for Nurse Practitioners: NP Prescribing Guide (2025)",
    metaDescription: "NP-level hypertension guide covering diagnosis, staging, treatment algorithms, first-line prescribing, resistant hypertension workup, and evidence-based BP targets.",
    keywords: "hypertension NP, blood pressure management nurse practitioner, antihypertensive prescribing NP, resistant hypertension, hypertension guidelines NP exam",
    definition: "Hypertension is defined as sustained systolic blood pressure ≥130 mmHg or diastolic blood pressure ≥80 mmHg (2017 ACC/AHA guidelines). It is the leading modifiable risk factor for cardiovascular disease, stroke, and chronic kidney disease.",
    pathophysiology: "Blood pressure is determined by cardiac output and systemic vascular resistance (BP = CO × SVR). Hypertension develops through multiple mechanisms including increased sympathetic nervous system activity, RAAS activation, endothelial dysfunction, arterial stiffness, renal sodium retention, and genetic predisposition. Over time, sustained elevated pressure causes end-organ damage to the heart (LVH, HF), brain (stroke, vascular dementia), kidneys (nephrosclerosis, CKD), and vasculature (atherosclerosis, aneurysm).",
    causesRiskFactors: [
      "Primary/essential hypertension (90-95% of cases — multifactorial: genetics, diet, obesity, sedentary lifestyle)",
      "Excess dietary sodium (>2,300 mg/day)",
      "Obesity (BMI >30, especially central/visceral adiposity)",
      "Physical inactivity",
      "Excessive alcohol consumption",
      "Chronic kidney disease (both cause and consequence)",
      "Obstructive sleep apnea",
      "Secondary causes: renal artery stenosis, pheochromocytoma, primary aldosteronism, Cushing syndrome, thyroid disorders, coarctation of aorta"
    ],
    signsSymptoms: {
      early: [
        "Usually asymptomatic (silent killer)",
        "Mild headaches (non-specific)",
        "Elevated BP on routine screening (≥130/80 mmHg confirmed on ≥2 occasions)"
      ],
      late: [
        "Severe headache with hypertensive emergency (>180/120)",
        "Visual changes (hypertensive retinopathy — cotton wool spots, flame hemorrhages)",
        "Chest pain (from LVH, coronary disease)",
        "Dyspnea (from heart failure secondary to HTN)",
        "Hematuria or elevated creatinine (hypertensive nephrosclerosis)",
        "Neurological deficits (hypertensive encephalopathy, stroke)"
      ]
    },
    differentialDiagnosis: [
      { condition: "White coat hypertension", distinguishingFeature: "Elevated office BP but normal ambulatory or home BP; confirm with 24-hour ABPM or serial home readings" },
      { condition: "Masked hypertension", distinguishingFeature: "Normal office BP but elevated ambulatory/home BP; suspect if end-organ damage present despite normal office readings" },
      { condition: "Primary aldosteronism", distinguishingFeature: "Resistant hypertension, hypokalemia, metabolic alkalosis; check aldosterone-to-renin ratio (ARR >30 is suggestive)" },
      { condition: "Renal artery stenosis", distinguishingFeature: "Young female (fibromuscular dysplasia) or elderly male (atherosclerotic); abdominal bruit, >30% rise in creatinine on ACEi; confirm with renal duplex ultrasound or CTA" },
      { condition: "Pheochromocytoma", distinguishingFeature: "Paroxysmal hypertension with triad of headache, diaphoresis, palpitations; elevated plasma/urine metanephrines" },
      { condition: "Obstructive sleep apnea", distinguishingFeature: "Resistant or nocturnal hypertension, obesity, daytime somnolence, snoring; polysomnography diagnostic" }
    ],
    workup: [
      { test: "Office BP (proper technique)", rationale: "Diagnosis requires ≥2 elevated readings on ≥2 occasions using proper technique", expectedFindings: "Patient seated 5 min, back supported, feet flat, arm at heart level, appropriate cuff size; average of 2-3 readings" },
      { test: "BMP (creatinine, K+, glucose)", rationale: "Assess renal function, electrolytes, and glucose at baseline before starting therapy", expectedFindings: "Elevated creatinine suggests CKD (target organ damage); hypokalemia suggests secondary cause (aldosteronism)" },
      { test: "Lipid panel", rationale: "Assess cardiovascular risk; guides treatment intensity and statin eligibility", expectedFindings: "Calculate 10-year ASCVD risk score to guide treatment decisions" },
      { test: "Urinalysis with albumin/creatinine ratio", rationale: "Screen for proteinuria/albuminuria indicating renal end-organ damage", expectedFindings: "Microalbuminuria (30-300 mg/g) indicates early nephropathy; macroalbuminuria (>300 mg/g) indicates overt nephropathy" },
      { test: "ECG", rationale: "Assess for left ventricular hypertrophy and arrhythmias", expectedFindings: "LVH criteria (Sokolow-Lyon, Cornell), strain pattern, atrial fibrillation" },
      { test: "TSH", rationale: "Screen for thyroid disease as secondary cause", expectedFindings: "Both hypothyroidism (diastolic HTN) and hyperthyroidism (systolic HTN) can cause hypertension" }
    ],
    redFlags: [
      "Hypertensive emergency (>180/120 with acute end-organ damage): requires immediate IV antihypertensive, reduce MAP by 25% in first hour",
      "New-onset hypertension in patient <30 or >55 suggests secondary cause — requires workup",
      "Resistant hypertension (uncontrolled on 3 agents including a diuretic) — screen for secondary causes and medication adherence",
      "Sudden severe hypertension with headache, visual changes, and papilledema (hypertensive encephalopathy)",
      "Flash pulmonary edema with hypertension in elderly — suspect bilateral renal artery stenosis",
      "Hypertension with hypokalemia (unprovoked) — screen for primary aldosteronism"
    ],
    labs: [
      { name: "Creatinine/eGFR", normalRange: "0.7-1.3 mg/dL / >60 mL/min", significance: "Elevated creatinine or reduced eGFR indicates hypertensive nephropathy or CKD as comorbidity" },
      { name: "Potassium", normalRange: "3.5-5.0 mEq/L", significance: "Hypokalemia may indicate aldosteronism; monitor closely with ACEi/ARB/MRA therapy" },
      { name: "Fasting glucose/A1C", normalRange: "<100 mg/dL / <5.7%", significance: "Diabetes is a common comorbidity that influences drug choice (prefer ACEi/ARB) and BP target (<130/80)" },
      { name: "Urine albumin/creatinine ratio", normalRange: "<30 mg/g", significance: "Microalbuminuria indicates early renal damage; supports ACEi/ARB as preferred agent" }
    ],
    medications: [
      { name: "Lisinopril/Enalapril (ACE inhibitors)", drugClass: "ACE Inhibitor", action: "Blocks RAAS, reduces peripheral resistance, provides renal protection in diabetes/CKD", sideEffects: "Dry cough (10-15%), hyperkalemia, angioedema, teratogenic", prescribingNotes: "First-line in diabetes, CKD with proteinuria, HF. Start lisinopril 10 mg daily, target 20-40 mg. Contraindicated in pregnancy (category X). Check K+ and creatinine at 1-2 weeks." },
      { name: "Amlodipine (CCB)", drugClass: "Calcium Channel Blocker", action: "Vasodilation by blocking L-type calcium channels in smooth muscle; reduces SVR", sideEffects: "Peripheral edema (dose-dependent), headache, flushing, gingival hyperplasia", prescribingNotes: "First-line option; particularly effective in African American patients and elderly. Start 5 mg daily, max 10 mg. No renal dose adjustment needed. Safe in pregnancy (category C)." },
      { name: "Chlorthalidone/HCTZ (Thiazide diuretics)", drugClass: "Thiazide Diuretic", action: "Inhibits sodium reabsorption in distal tubule, reduces plasma volume and SVR over time", sideEffects: "Hypokalemia, hyperuricemia (gout exacerbation), hyperglycemia, hyponatremia", prescribingNotes: "First-line option. Chlorthalidone 12.5-25 mg preferred over HCTZ (longer acting, stronger evidence). Less effective when eGFR <30 — switch to loop diuretic. Check BMP in 2-4 weeks." },
      { name: "Losartan/Valsartan (ARBs)", drugClass: "Angiotensin II Receptor Blocker", action: "Blocks AT1 receptors, similar benefits to ACEi without bradykinin accumulation (no cough)", sideEffects: "Hyperkalemia, hypotension, teratogenic (same as ACEi without cough)", prescribingNotes: "Use when ACEi-intolerant (cough). Do NOT combine with ACEi (dual RAAS blockade increases adverse events without benefit). Same monitoring as ACEi." }
    ],
    firstLineManagement: [
      "Stage 1 HTN (130-139/80-89) with ASCVD risk <10%: lifestyle modifications for 3-6 months before pharmacotherapy",
      "Stage 1 HTN with ASCVD risk ≥10% or stage 2 HTN (≥140/90): initiate pharmacotherapy plus lifestyle modifications",
      "First-line drug classes: ACEi/ARB, CCB (amlodipine), or thiazide diuretic (chlorthalidone preferred)",
      "African American patients without CKD or diabetes: CCB or thiazide preferred first-line (ALLHAT trial data)",
      "Diabetes or CKD with proteinuria: ACEi or ARB preferred for renal protection",
      "Stage 2 HTN ≥160/100: consider starting with 2 agents or a single-pill combination"
    ],
    secondLineManagement: [
      "If uncontrolled on monotherapy: add second agent from a different class (ACEi/ARB + CCB or ACEi/ARB + thiazide)",
      "Triple therapy if needed: ACEi/ARB + CCB + thiazide diuretic",
      "Resistant hypertension (uncontrolled on 3 agents including diuretic): add spironolactone 25-50 mg (PATHWAY-2 trial)",
      "Consider beta-blockers for specific indications (HF, post-MI, rate control in AF) — not preferred as first-line for uncomplicated HTN",
      "Evaluate for secondary causes and medication adherence in resistant cases"
    ],
    nursingInterventions: [
      "Verify proper BP measurement technique at every visit",
      "Assess medication adherence and identify barriers",
      "Screen for secondary causes if resistant or atypical presentation",
      "Calculate ASCVD risk score to guide treatment intensity",
      "Annual monitoring: BMP, lipids, urine albumin/creatinine ratio"
    ],
    complications: [
      "Left ventricular hypertrophy and heart failure",
      "Coronary artery disease and myocardial infarction",
      "Stroke (ischemic and hemorrhagic) and vascular dementia",
      "Chronic kidney disease and end-stage renal disease",
      "Peripheral arterial disease",
      "Hypertensive retinopathy",
      "Aortic aneurysm and dissection"
    ],
    followUpConsiderations: [
      "Recheck BP in 4 weeks after initiating or changing medication",
      "Check BMP 1-2 weeks after starting ACEi/ARB or thiazide",
      "Once at target, follow up every 3-6 months",
      "Annual assessment for target organ damage (renal function, urine albumin, ECG)",
      "Home BP monitoring encouraged — more predictive of outcomes than office readings"
    ],
    prescribingPearls: [
      "Chlorthalidone is preferred over HCTZ — longer duration, stronger mortality evidence",
      "African American patients respond better to CCBs and thiazides than ACEi/ARBs as initial monotherapy",
      "Never combine ACEi + ARB — increased adverse events without CV benefit (ONTARGET trial)",
      "Spironolactone is the most effective add-on for resistant hypertension (PATHWAY-2 trial)",
      "ACEi/ARBs are absolutely contraindicated in pregnancy — switch to labetalol, nifedipine, or methyldopa",
      "Amlodipine-related peripheral edema can be reduced by combining with ACEi/ARB"
    ],
    patientCounselling: [
      "Take your blood pressure medication at the same time every day, even if you feel fine — high blood pressure usually has no symptoms",
      "Reduce sodium intake to less than 2,300 mg per day (ideally <1,500 mg) — this alone can lower BP by 5-8 mmHg",
      "Engage in at least 150 minutes of moderate-intensity aerobic exercise per week",
      "Limit alcohol to ≤2 drinks/day for men and ≤1 drink/day for women",
      "Maintain a healthy weight — losing 10 kg can lower systolic BP by 5-20 mmHg",
      "Monitor your blood pressure at home and bring your log to appointments",
      "Do not stop taking your medication without consulting your provider, even if your BP is normal (it is normal because of the medication)"
    ],
    examPearls: [
      "Proper BP measurement technique questions are commonly tested — know the steps",
      "Know the ACC/AHA staging: Elevated (120-129/<80), Stage 1 (130-139/80-89), Stage 2 (≥140/≥90)",
      "ACEi/ARBs are preferred in diabetes and CKD for renal protection — this is a frequently tested concept",
      "Thiazide diuretics can worsen gout (hyperuricemia) and cause hyponatremia — classic trap question",
      "The most common cause of resistant hypertension is medication non-adherence",
      "Hypertensive emergency requires IV meds with goal of reducing MAP by 25% in the first hour — do not normalize BP rapidly"
    ],
    commonTrapAnswers: [
      "Combining ACEi + ARB (dual RAAS blockade is harmful — never combine)",
      "Choosing HCTZ over chlorthalidone (chlorthalidone has stronger evidence)",
      "Using beta-blockers as first-line for uncomplicated hypertension (not preferred first-line)",
      "Prescribing ACEi/ARB in pregnancy (category X — teratogenic)",
      "Rapidly normalizing BP in hypertensive emergency (should reduce MAP by only 25% in first hour)"
    ],
    practiceQuestions: [
      { question: "A 54-year-old African American male with newly diagnosed stage 2 hypertension (BP 158/96) has no diabetes or CKD. What is the most appropriate initial antihypertensive therapy?", options: ["Lisinopril 10 mg daily", "Amlodipine 5 mg plus chlorthalidone 12.5 mg", "Metoprolol succinate 50 mg daily", "Losartan 50 mg daily"], correctIndex: 1, rationale: "Stage 2 HTN (≥140/90) often requires 2-drug therapy for adequate control. In African American patients without diabetes or CKD, CCB and thiazide diuretics are preferred first-line agents (ALLHAT trial evidence). ACEi/ARBs are less effective as monotherapy in this population. Beta-blockers are not first-line for uncomplicated HTN. Starting combination therapy achieves target faster and with lower doses of each agent.", isFree: true },
      { question: "A patient on lisinopril 20 mg, amlodipine 10 mg, and chlorthalidone 25 mg has a BP of 152/94 mmHg. Adherence is confirmed. What is the most appropriate next step?", options: ["Add metoprolol 50 mg", "Add spironolactone 25 mg", "Switch chlorthalidone to furosemide", "Order renal artery duplex ultrasound"], correctIndex: 1, rationale: "This patient has resistant hypertension (uncontrolled on 3 agents including a diuretic at adequate doses with confirmed adherence). The PATHWAY-2 trial demonstrated that spironolactone is the most effective fourth agent for resistant hypertension. Before adding spironolactone, check K+ (contraindicated if K+ >5.0) and eGFR. Secondary cause workup (including primary aldosteronism screening) should also be considered.", isFree: true },
      { question: "A 28-year-old female with newly diagnosed hypertension is found to have a unilateral renal artery bruit. What is the most likely secondary cause?", options: ["Primary aldosteronism", "Pheochromocytoma", "Fibromuscular dysplasia", "Coarctation of the aorta"], correctIndex: 2, rationale: "In a young female with hypertension and renal artery bruit, fibromuscular dysplasia (FMD) is the most likely diagnosis. FMD typically affects young to middle-aged women and involves the renal arteries, causing renovascular hypertension. Confirm with CTA or MRA showing characteristic 'string of beads' appearance. In elderly males, atherosclerotic renal artery stenosis is more common.", isFree: true }
    ],
    faqs: [
      { question: "When should I suspect secondary hypertension?", answer: "Suspect secondary causes when hypertension presents before age 30 or after age 55, is resistant to 3+ medications, is severe at onset (stage 2), or is associated with unprovoked hypokalemia, episodic symptoms (pheochromocytoma), renal bruits (RAS), or cushingoid features. Secondary causes account for 5-10% of all hypertension cases." },
      { question: "What is the difference between hypertensive urgency and emergency?", answer: "Both involve BP >180/120. Hypertensive urgency has no acute end-organ damage — managed with oral medications and close follow-up. Hypertensive emergency has acute end-organ damage (stroke, ACS, aortic dissection, acute renal failure, hypertensive encephalopathy, papilledema) — requires ICU admission and IV antihypertensives with gradual BP reduction (25% in first hour)." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "ACE Inhibitors", href: "/np-exam/medications/ace-inhibitors", type: "medication" },
      { title: "Heart Failure", href: "/np-exam/conditions/heart-failure", type: "condition" },
      { title: "Potassium Lab Values", href: "/np-exam/lab-values/potassium", type: "lab-value" },
      { title: "Sodium Lab Values", href: "/np-exam/lab-values/sodium", type: "lab-value" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "diabetes-dka-hhs",
    contentType: "condition",
    tier: "np",
    name: "Diabetes Mellitus (DKA & HHS)",
    metaTitle: "Diabetes DKA & HHS for Nurse Practitioners: Diagnosis & Management (2025)",
    metaDescription: "NP-level guide to diabetes management including DKA vs HHS differentiation, insulin prescribing, A1C targets, oral hypoglycemic agents, and acute complication management.",
    keywords: "diabetes NP exam, DKA management nurse practitioner, HHS treatment, insulin prescribing NP, diabetes medications NP, A1C targets",
    definition: "Diabetes mellitus is a group of metabolic diseases characterized by chronic hyperglycemia resulting from defects in insulin secretion, insulin action, or both. DKA (diabetic ketoacidosis) and HHS (hyperosmolar hyperglycemic state) are life-threatening acute complications requiring urgent management.",
    pathophysiology: "Type 1 DM results from autoimmune destruction of pancreatic beta cells leading to absolute insulin deficiency. Type 2 DM involves progressive insulin resistance followed by relative insulin deficiency. DKA occurs with absolute insulin deficiency causing lipolysis, free fatty acid oxidation, and ketone body production (acetoacetate, beta-hydroxybutyrate, acetone), leading to anion gap metabolic acidosis. HHS occurs with enough insulin to prevent ketosis but insufficient to prevent severe hyperglycemia, causing profound osmotic diuresis and dehydration.",
    causesRiskFactors: [
      "Type 1: Autoimmune (HLA-DR3/DR4 associated), genetic predisposition, environmental triggers",
      "Type 2: Insulin resistance, obesity, sedentary lifestyle, family history, age >45, ethnicity (higher in African American, Hispanic, Native American)",
      "DKA precipitants: Infection (most common), medication non-compliance, new-onset T1DM, myocardial infarction, pancreatitis, medications (corticosteroids, SGLT2i-associated euglycemic DKA)",
      "HHS precipitants: Infection, medication non-adherence, new-onset T2DM, acute illness, dehydration"
    ],
    signsSymptoms: {
      early: [
        "Polyuria, polydipsia, polyphagia (classic triad)",
        "Fatigue and blurred vision",
        "Unintentional weight loss (especially Type 1)",
        "Recurrent infections (candidiasis, UTI)"
      ],
      late: [
        "DKA: Kussmaul respirations, fruity breath odor, abdominal pain, nausea/vomiting, altered mental status",
        "HHS: Profound dehydration, extreme hyperglycemia (>600 mg/dL), hyperosmolality, altered consciousness/coma, absent ketosis",
        "Chronic complications: peripheral neuropathy, retinopathy, nephropathy, cardiovascular disease"
      ]
    },
    differentialDiagnosis: [
      { condition: "DKA vs HHS", distinguishingFeature: "DKA: glucose 250-800, pH <7.3, bicarb <18, ketones positive, anion gap. HHS: glucose >600, pH >7.3, bicarb >18, minimal/no ketones, serum osmolality >320" },
      { condition: "Alcoholic ketoacidosis", distinguishingFeature: "History of alcohol use, glucose normal or low, anion gap metabolic acidosis with ketones, low or normal glucose distinguishes from DKA" },
      { condition: "Starvation ketosis", distinguishingFeature: "Mild ketosis with near-normal pH, glucose low to normal, history of prolonged fasting" },
      { condition: "LADA (Latent Autoimmune Diabetes of Adults)", distinguishingFeature: "Adult onset with positive GAD antibodies, slower progression than T1DM, initially responds to oral agents" },
      { condition: "Drug-induced hyperglycemia", distinguishingFeature: "Corticosteroids, atypical antipsychotics, thiazides — resolves with medication adjustment" }
    ],
    workup: [
      { test: "Fasting glucose / Random glucose", rationale: "Diagnostic criteria: fasting ≥126 mg/dL or random ≥200 with symptoms", expectedFindings: "Confirm on two separate occasions if asymptomatic" },
      { test: "A1C", rationale: "Reflects 2-3 month average glucose; diagnostic if ≥6.5%", expectedFindings: "6.5-6.9% mild; 7-8.9% moderate; ≥9% severe. Target <7% for most adults, <8% for elderly/comorbid" },
      { test: "ABG / VBG (for DKA/HHS)", rationale: "Assess acid-base status in acute presentations", expectedFindings: "DKA: pH <7.3, bicarb <18, anion gap >12. HHS: pH >7.3, bicarb >18" },
      { test: "Serum ketones (beta-hydroxybutyrate)", rationale: "Confirm ketosis in suspected DKA", expectedFindings: "Elevated >3 mmol/L in DKA; normal or mildly elevated in HHS" },
      { test: "BMP", rationale: "Assess electrolytes, renal function, calculate anion gap", expectedFindings: "Pseudohyponatremia (corrected Na), K+ may be normal/high initially but total body K+ depleted, elevated BUN/Cr in dehydration" },
      { test: "Serum osmolality", rationale: "Assess for hyperosmolality in HHS", expectedFindings: "HHS: >320 mOsm/kg. Calculate: 2(Na) + glucose/18 + BUN/2.8" }
    ],
    redFlags: [
      "DKA with pH <7.0 or bicarb <5 — severe DKA requiring ICU admission",
      "HHS with serum osmolality >350 or obtundation — high mortality risk",
      "Cerebral edema during DKA treatment (especially in children) — rapid neurological deterioration",
      "Severe hypokalemia (<3.3 mEq/L) — must correct K+ before starting insulin in DKA",
      "Myocardial infarction as precipitant of DKA/HHS — silent MI common in diabetics",
      "Euglycemic DKA in patients on SGLT2 inhibitors — check ketones even with normal glucose"
    ],
    labs: [
      { name: "A1C", normalRange: "<5.7% (pre-DM 5.7-6.4%)", significance: "Primary monitoring parameter. Target <7% most adults; check every 3 months until stable, then every 6 months" },
      { name: "Fasting glucose", normalRange: "70-99 mg/dL", significance: "Diagnostic if ≥126 mg/dL on two occasions; guides medication titration" },
      { name: "Serum beta-hydroxybutyrate", normalRange: "<0.6 mmol/L", significance: "Preferred ketone test for DKA diagnosis and monitoring; >3 mmol/L indicates DKA" },
      { name: "Urine albumin/creatinine ratio", normalRange: "<30 mg/g", significance: "Screen annually for diabetic nephropathy; microalbuminuria (30-300) indicates early nephropathy" }
    ],
    medications: [
      { name: "Metformin", drugClass: "Biguanide", action: "Decreases hepatic glucose production, increases insulin sensitivity, decreases intestinal glucose absorption", sideEffects: "GI (nausea, diarrhea — dose-related), vitamin B12 deficiency, lactic acidosis (very rare)", prescribingNotes: "First-line for T2DM. Start 500 mg daily with meals, increase by 500 mg weekly. Max 2000-2550 mg/day. Reduce dose at eGFR <45, discontinue at eGFR <30. Hold 48 hours before/after iodinated contrast." },
      { name: "Semaglutide/Liraglutide (GLP-1 RA)", drugClass: "GLP-1 Receptor Agonist", action: "Incretin mimetic: stimulates insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety", sideEffects: "Nausea (dose-related, usually transient), vomiting, diarrhea, injection site reactions, pancreatitis (rare)", prescribingNotes: "Second-line with CV or renal benefit. Semaglutide: start 0.25 mg SC weekly × 4 weeks, increase to 0.5 mg, then 1 mg. Weight loss benefit. Contraindicated with personal/family history of medullary thyroid carcinoma or MEN2." },
      { name: "Empagliflozin/Dapagliflozin (SGLT2i)", drugClass: "SGLT2 Inhibitor", action: "Inhibits SGLT2 in proximal tubule, reducing glucose reabsorption; glucosuria causes osmotic diuresis", sideEffects: "Genital mycotic infections (common), UTI, volume depletion, euglycemic DKA (rare)", prescribingNotes: "Second-line with HF or CKD benefit. Empagliflozin 10-25 mg daily. Safe with eGFR >20 for cardiorenal benefit. Warn about euglycemic DKA risk — hold before surgery and during acute illness." },
      { name: "Insulin (basal and bolus)", drugClass: "Insulin", action: "Replaces endogenous insulin; basal covers fasting glucose, bolus covers prandial glucose excursions", sideEffects: "Hypoglycemia (most dangerous), weight gain, injection site lipodystrophy", prescribingNotes: "Basal: glargine/detemir 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose target. Add prandial (rapid-acting) insulin if A1C still above target on optimized basal. In DKA: continuous IV insulin infusion 0.1-0.14 U/kg/hr." }
    ],
    firstLineManagement: [
      "Lifestyle modifications for all patients: medical nutrition therapy, 150 min/week exercise, weight management",
      "Metformin as first-line pharmacotherapy for T2DM (unless contraindicated)",
      "For T2DM with established ASCVD: metformin + GLP-1 RA or SGLT2 inhibitor (regardless of A1C)",
      "For T2DM with HF: metformin + SGLT2 inhibitor",
      "For T2DM with CKD: metformin (if eGFR allows) + SGLT2 inhibitor or GLP-1 RA",
      "A1C target <7% for most non-pregnant adults; <8% for elderly with comorbidities/limited life expectancy"
    ],
    secondLineManagement: [
      "If A1C not at target on metformin + lifestyle: add second agent based on comorbidities (SGLT2i, GLP-1 RA, DPP-4i, SU, TZD, or insulin)",
      "If A1C ≥10% or symptoms of hyperglycemia at diagnosis: consider starting insulin immediately",
      "DKA management: IV fluids (NS 1-1.5 L/hr initially), IV insulin drip (0.1-0.14 U/kg/hr after K+ >3.3), potassium replacement (goal 4-5 mEq/L), monitor glucose/electrolytes hourly",
      "HHS management: aggressive IV fluid resuscitation (can be 6-9 L deficit), IV insulin at lower rates, correct electrolytes, identify and treat precipitant"
    ],
    nursingInterventions: [
      "Blood glucose monitoring per protocol (every 1-2 hours in DKA/HHS)",
      "Assess for hypoglycemia symptoms especially with insulin therapy",
      "Foot exam at every visit; comprehensive foot exam annually",
      "Diabetic self-management education and support",
      "Depression screening (diabetes increases depression risk 2-3x)"
    ],
    complications: [
      "Microvascular: diabetic retinopathy, nephropathy, neuropathy",
      "Macrovascular: coronary artery disease, peripheral arterial disease, cerebrovascular disease",
      "DKA complications: cerebral edema, hypokalemia, ARDS, venous thromboembolism",
      "HHS complications: rhabdomyolysis, seizures, coma, cardiovascular collapse",
      "Diabetic foot ulcers and amputation",
      "Hypoglycemia (from treatment — especially insulin and sulfonylureas)"
    ],
    followUpConsiderations: [
      "A1C every 3 months until at target, then every 6 months",
      "Annual comprehensive diabetes review: dilated eye exam, comprehensive foot exam, urine albumin/creatinine ratio, lipid panel",
      "BMP 1-2 weeks after starting ACEi/ARB (renal protection), metformin dose changes",
      "Annual flu vaccine; pneumococcal and hepatitis B vaccines per CDC schedule",
      "Statin therapy for all diabetic patients aged 40-75 (at minimum moderate-intensity)"
    ],
    prescribingPearls: [
      "Always choose diabetes medications based on comorbidities (ASCVD → GLP-1 RA/SGLT2i; HF → SGLT2i; CKD → SGLT2i/GLP-1 RA) before considering A1C lowering alone",
      "In DKA, do NOT start insulin until potassium is ≥3.3 mEq/L — insulin drives K+ intracellularly and can cause fatal hypokalemia",
      "Transition from IV insulin to subcutaneous: give SC basal insulin 2 hours before stopping IV drip to prevent rebound hyperglycemia",
      "Metformin has a black box warning for lactic acidosis but this is extremely rare with appropriate patient selection",
      "SGLT2 inhibitors can cause euglycemic DKA — think of this in any diabetic patient on SGLT2i with anion gap acidosis even if glucose is normal",
      "GLP-1 RAs cause significant weight loss — consider as preferred second-line in obese T2DM patients"
    ],
    patientCounselling: [
      "Check your blood sugar as instructed — keep a log to bring to appointments",
      "Learn to recognize signs of low blood sugar (shakiness, sweating, confusion) and treat immediately with 15 grams of fast-acting carbohydrate",
      "Inspect your feet daily for cuts, blisters, or color changes — never walk barefoot",
      "Keep follow-up appointments for eye exams, foot checks, and lab work — early detection prevents complications",
      "If you take an SGLT2 inhibitor, stay well hydrated and contact your provider if you feel unusually unwell, even if blood sugar is normal (risk of euglycemic DKA)",
      "Carry a medical identification card or bracelet indicating you have diabetes",
      "If you are sick and cannot eat, do not stop your insulin — contact your provider for sick day management instructions"
    ],
    examPearls: [
      "DKA presents with anion gap metabolic acidosis, fruity breath, Kussmaul respirations; HHS presents with extreme hyperglycemia (>600), high osmolality, and altered mental status WITHOUT significant acidosis",
      "The most common precipitant of DKA and HHS is infection — always look for the underlying trigger",
      "Potassium must be ≥3.3 mEq/L before starting insulin in DKA — this is a safety-critical exam concept",
      "The ADA recommends choosing diabetes medications based on comorbidities (ASCVD, HF, CKD) rather than solely on glucose lowering — this represents a major paradigm shift",
      "A1C of 9% corresponds to an estimated average glucose of approximately 212 mg/dL",
      "Metformin should be held 48 hours before and after iodinated contrast (risk of contrast-induced nephropathy potentiating lactic acidosis)"
    ],
    commonTrapAnswers: [
      "Starting insulin in DKA before confirming K+ ≥3.3 (can cause fatal hypokalemia)",
      "Choosing a sulfonylurea in an elderly patient with CKD (high hypoglycemia risk)",
      "Using A1C for diagnosis in patients with hemoglobinopathies or recent transfusion (unreliable)",
      "Treating HHS the same as DKA (HHS requires more aggressive fluid resuscitation and lower insulin rates)",
      "Stopping metformin permanently after contrast — only hold for 48 hours, then resume if renal function is stable"
    ],
    practiceQuestions: [
      { question: "A patient presents with blood glucose of 320 mg/dL, pH 7.18, bicarb 10 mEq/L, positive serum ketones, and potassium of 3.0 mEq/L. What is the immediate priority?", options: ["Start IV insulin infusion at 0.1 U/kg/hr", "Administer IV potassium replacement", "Give subcutaneous insulin lispro 10 units", "Start IV normal saline at 1 L/hr"], correctIndex: 1, rationale: "This patient has DKA (hyperglycemia, acidosis, ketosis) with hypokalemia (K+ 3.0). The critical first step is potassium replacement. Starting insulin before K+ is ≥3.3 mEq/L will drive potassium further intracellularly and can cause fatal cardiac arrhythmias. Replace K+ to ≥3.3 before initiating insulin. IV fluids should also be started simultaneously, but K+ replacement takes priority over insulin.", isFree: true },
      { question: "A 52-year-old with T2DM, A1C 7.8%, and recently diagnosed HFrEF (EF 35%) is on metformin 1000 mg BID. Which additional agent provides the most benefit?", options: ["Glipizide 5 mg daily", "Pioglitazone 30 mg daily", "Empagliflozin 10 mg daily", "Sitagliptin 100 mg daily"], correctIndex: 2, rationale: "Per ADA guidelines, patients with T2DM and heart failure should receive an SGLT2 inhibitor (empagliflozin or dapagliflozin) regardless of A1C level due to proven cardiovascular and HF outcomes benefits (EMPA-REG OUTCOME, DAPA-HF trials). Pioglitazone is contraindicated in HF (fluid retention). Sulfonylureas increase hypoglycemia without CV benefit. DPP-4 inhibitors are CV-neutral.", isFree: true },
      { question: "How does HHS differ from DKA in terms of insulin requirements and fluid management?", options: ["HHS requires higher insulin doses and less fluid", "HHS requires similar insulin but more aggressive fluid resuscitation", "HHS requires less insulin and more aggressive fluid resuscitation", "There is no difference in management"], correctIndex: 2, rationale: "HHS involves more profound dehydration (fluid deficit often 6-9 liters vs 3-6 liters in DKA) requiring more aggressive IV fluid resuscitation. Insulin requirements in HHS are typically lower because the primary problem is dehydration and hyperosmolality rather than absolute insulin deficiency. Fluid resuscitation alone can significantly reduce blood glucose in HHS through dilution and improved renal perfusion.", isFree: true },
      { question: "A 62-year-old with T2DM on metformin has an A1C of 8.1%. She has no ASCVD or HF but has a BMI of 38. What is the preferred second-line agent?", options: ["Insulin glargine", "Semaglutide (GLP-1 RA)", "Glipizide (sulfonylurea)", "Sitagliptin (DPP-4 inhibitor)"], correctIndex: 1, rationale: "For an obese patient with T2DM needing additional glucose lowering without established ASCVD or HF, a GLP-1 receptor agonist (semaglutide) is preferred for its dual benefit of glucose reduction and significant weight loss (average 5-15% body weight reduction). It also has cardiovascular risk reduction benefits. Insulin and sulfonylureas cause weight gain. DPP-4 inhibitors are weight-neutral but less effective for A1C reduction.", isFree: false }
    ],
    faqs: [
      { question: "What is the ADA's recommended A1C target?", answer: "The ADA recommends an A1C target of <7% for most non-pregnant adults with diabetes. However, targets should be individualized: <6.5% for selected patients without significant hypoglycemia risk, and <8% for elderly patients with limited life expectancy, extensive comorbidities, or history of severe hypoglycemia. The key principle is patient-centered decision making." },
      { question: "When should you start insulin in type 2 diabetes?", answer: "Consider starting insulin when A1C is ≥10% at diagnosis or with significant hyperglycemic symptoms, after failure of 2-3 oral/injectable agents to reach A1C target, during acute illness or hospitalization, and during pregnancy. Start with basal insulin (glargine or detemir) at 10 units or 0.1-0.2 U/kg at bedtime and titrate by 2 units every 3 days based on fasting glucose." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "DKA vs HHS Comparison", href: "/np-exam/compare/dka-vs-hhs", type: "comparison" },
      { title: "Metformin", href: "/np-exam/medications/metformin", type: "medication" },
      { title: "Insulin", href: "/np-exam/medications/insulin", type: "medication" },
      { title: "A1C Lab Values", href: "/np-exam/lab-values/a1c", type: "lab-value" },
      { title: "Potassium Lab Values", href: "/np-exam/lab-values/potassium", type: "lab-value" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "copd",
    contentType: "condition",
    tier: "np",
    name: "COPD",
    metaTitle: "COPD Management for Nurse Practitioners: GOLD Guidelines & Prescribing (2025)",
    metaDescription: "NP-level COPD guide covering GOLD classification, inhaler prescribing, exacerbation management, differential diagnosis, and long-term management strategies.",
    keywords: "COPD NP exam, COPD management nurse practitioner, GOLD guidelines NP, COPD inhaler prescribing, COPD exacerbation management",
    definition: "Chronic obstructive pulmonary disease (COPD) is a chronic, progressive respiratory disease characterized by persistent airflow limitation that is not fully reversible. It encompasses emphysema (alveolar destruction) and chronic bronchitis (chronic productive cough for ≥3 months in ≥2 consecutive years).",
    pathophysiology: "Chronic exposure to noxious particles (primarily cigarette smoke) triggers an inflammatory response in the airways and lung parenchyma. This causes mucus hypersecretion and goblet cell hyperplasia (chronic bronchitis), destruction of alveolar walls and loss of elastic recoil (emphysema), and small airway fibrosis. The result is progressive airflow limitation, gas trapping, hyperinflation, and ventilation-perfusion mismatch leading to hypoxemia and eventually hypercapnia.",
    causesRiskFactors: ["Cigarette smoking (most common, 80-90% of cases)", "Occupational dust and chemical exposure", "Indoor air pollution (biomass fuel use)", "Alpha-1 antitrypsin deficiency (suspect in young non-smokers or family history)", "Childhood respiratory infections", "Asthma (accelerates lung function decline)"],
    signsSymptoms: { early: ["Progressive exertional dyspnea", "Chronic productive cough (especially morning)", "Wheezing", "Prolonged expiratory phase"], late: ["Barrel chest (hyperinflation)", "Use of accessory muscles", "Pursed-lip breathing", "Cyanosis", "Cor pulmonale (right heart failure from pulmonary HTN)", "Cachexia and muscle wasting"] },
    differentialDiagnosis: [
      { condition: "Asthma", distinguishingFeature: "Reversible airflow obstruction (>12% FEV1 improvement post-bronchodilator), atopy, younger onset, symptom variability, eosinophilic inflammation" },
      { condition: "Heart failure", distinguishingFeature: "Elevated BNP, cardiomegaly on CXR, S3 gallop, bilateral peripheral edema, orthopnea — may coexist with COPD" },
      { condition: "Bronchiectasis", distinguishingFeature: "Large volume purulent sputum, recurrent infections, CT showing dilated airways with signet ring sign" },
      { condition: "Lung cancer", distinguishingFeature: "Hemoptysis, weight loss, chest pain, mass on imaging — COPD patients have increased lung cancer risk" },
      { condition: "Interstitial lung disease", distinguishingFeature: "Restrictive pattern on PFTs (reduced TLC), bilateral ground-glass or reticular opacities on CT, dry cough" }
    ],
    workup: [
      { test: "Spirometry (pre- and post-bronchodilator)", rationale: "Gold standard for diagnosis — confirms airflow limitation", expectedFindings: "Post-bronchodilator FEV1/FVC <0.70 confirms COPD. FEV1 determines severity: GOLD 1 ≥80%, GOLD 2 50-79%, GOLD 3 30-49%, GOLD 4 <30%" },
      { test: "Chest X-ray", rationale: "Rule out other causes of dyspnea; assess for hyperinflation", expectedFindings: "Hyperinflation, flattened diaphragms, increased AP diameter, bullae; may be normal in early COPD" },
      { test: "CBC", rationale: "Assess for polycythemia (chronic hypoxemia) and eosinophilia", expectedFindings: "Polycythemia (Hgb >17 in males) suggests chronic hypoxemia; eosinophils >300 may predict ICS responsiveness" },
      { test: "ABGs", rationale: "Assess oxygenation and ventilation in severe COPD", expectedFindings: "Hypoxemia ± hypercapnia; chronic respiratory acidosis with metabolic compensation in advanced disease" },
      { test: "Alpha-1 antitrypsin level", rationale: "Screen once in all COPD patients per ATS/ERS", expectedFindings: "Low level (<80 mg/dL) suggests alpha-1 antitrypsin deficiency; confirm with phenotyping" }
    ],
    redFlags: ["Acute exacerbation with respiratory failure (pH <7.35, PaCO2 >45, severe dyspnea at rest)", "Massive hemoptysis — suspect lung cancer or pulmonary embolism", "Pneumothorax (sudden worsening dyspnea, absent breath sounds, hyperresonance)", "Acute PE (sudden onset dyspnea, pleuritic chest pain — COPD is a VTE risk factor)", "Right heart failure signs (cor pulmonale) — peripheral edema, JVD, hepatomegaly"],
    labs: [
      { name: "FEV1/FVC ratio", normalRange: "≥0.70", significance: "Post-BD FEV1/FVC <0.70 is diagnostic of COPD; FEV1 determines severity grade" },
      { name: "ABG", normalRange: "pH 7.35-7.45, PaCO2 35-45, PaO2 80-100", significance: "Chronic hypercapnia with compensatory metabolic alkalosis in advanced COPD" },
      { name: "CBC", normalRange: "Hgb 13.5-17.5 (M), 12-16 (F)", significance: "Polycythemia from chronic hypoxemia; eosinophils >300 guide ICS use" }
    ],
    medications: [
      { name: "Tiotropium (LAMA)", drugClass: "Long-Acting Muscarinic Antagonist", action: "Blocks M3 receptors in bronchial smooth muscle causing sustained bronchodilation (24-hour duration)", sideEffects: "Dry mouth, urinary retention, constipation, blurred vision", prescribingNotes: "First-line maintenance for GOLD B-E. Tiotropium 18 mcg inhaled daily via HandiHaler or 2.5 mcg via Respimat. Avoid in narrow-angle glaucoma and bladder outflow obstruction." },
      { name: "Fluticasone/Salmeterol (ICS/LABA)", drugClass: "Inhaled Corticosteroid + Long-Acting Beta-Agonist", action: "ICS reduces airway inflammation; LABA provides 12-hour bronchodilation via beta-2 receptor agonism", sideEffects: "Oral candidiasis, dysphonia, pneumonia risk (ICS in COPD), adrenal suppression (high-dose)", prescribingNotes: "Add ICS only if eosinophils >300 or ≥2 moderate exacerbations/year despite LAMA+LABA. Not first-line monotherapy. Rinse mouth after use to prevent candidiasis. Consider ICS withdrawal if eosinophils <100 and no exacerbations." },
      { name: "Albuterol (SABA)", drugClass: "Short-Acting Beta-Agonist", action: "Rapid beta-2 agonism causing bronchial smooth muscle relaxation (onset 5-15 min, duration 4-6 hr)", sideEffects: "Tachycardia, tremor, hypokalemia, palpitations", prescribingNotes: "Rescue inhaler for all COPD patients. 2 puffs PRN for acute dyspnea. If using >2x/week, reassess maintenance therapy. Nebulized albuterol 2.5 mg for acute exacerbation." }
    ],
    firstLineManagement: ["Smoking cessation (most important intervention — slows FEV1 decline)", "Influenza, pneumococcal, COVID-19, and Tdap vaccinations", "GOLD A: SABA or SAMA PRN", "GOLD B: LABA or LAMA (tiotropium preferred)", "GOLD E (≥2 moderate exacerbations or ≥1 hospitalization): LAMA + LABA; add ICS if eosinophils >300", "Pulmonary rehabilitation for symptomatic patients (evidence-based)"],
    secondLineManagement: ["Triple therapy (ICS + LAMA + LABA) for patients with continued exacerbations on LAMA + LABA", "Roflumilast (PDE4 inhibitor) for frequent exacerbators with FEV1 <50% and chronic bronchitis phenotype", "Long-term oxygen therapy if PaO2 ≤55 mmHg or SpO2 ≤88% at rest (improves survival)", "Lung volume reduction surgery or bronchoscopic valve placement in selected emphysema patients", "Azithromycin 250 mg daily for exacerbation prevention in select patients (watch for QT prolongation, hearing loss)"],
    nursingInterventions: ["Inhaler technique assessment and education at every visit", "Smoking cessation counseling with pharmacotherapy (varenicline, NRT, bupropion)", "Action plan for exacerbation self-management", "Fall risk assessment (COPD increases osteoporosis and fall risk)", "Nutritional assessment (cachexia common in advanced COPD)"],
    complications: ["Acute exacerbations (most common cause of COPD hospitalization)", "Pneumonia (increased risk with ICS use)", "Pneumothorax", "Pulmonary hypertension and cor pulmonale", "Lung cancer (increased risk in COPD independent of smoking)", "Depression and anxiety (high prevalence)", "Osteoporosis (systemic inflammation + corticosteroid use)"],
    followUpConsiderations: ["Post-exacerbation follow-up within 1-2 weeks", "Annual spirometry to assess FEV1 decline", "Assess symptom burden (CAT score or mMRC dyspnea scale) at each visit", "Review inhaler technique — up to 70% of patients use inhalers incorrectly", "Screen for depression and anxiety annually"],
    prescribingPearls: ["ICS is NOT first-line in COPD (unlike asthma) — only add based on eosinophils or exacerbation history", "Tiotropium (LAMA) is the preferred first maintenance agent for COPD", "Blood eosinophils guide ICS use: >300 supports ICS addition, <100 supports ICS withdrawal", "Oxygen therapy is the only intervention besides smoking cessation proven to reduce mortality in COPD", "Do not use LABA monotherapy without LAMA — always combine bronchodilators", "Short course oral prednisone (40 mg × 5 days) for acute exacerbation — longer courses have no additional benefit"],
    patientCounselling: ["Quitting smoking is the single most important thing you can do to slow COPD progression", "Use your rescue inhaler (albuterol) for sudden breathing difficulty — keep it with you at all times", "Use your maintenance inhaler(s) every day as prescribed, even when feeling well", "Rinse your mouth with water after using steroid inhalers to prevent oral thrush", "If you use home oxygen, use it as prescribed — at least 15 hours per day for maximum benefit", "Call your provider if your symptoms worsen, your rescue inhaler is not helping, or you have increased sputum production/color change"],
    examPearls: ["Post-bronchodilator FEV1/FVC <0.70 is required for COPD diagnosis — never diagnose from symptoms alone", "ICS use in COPD increases pneumonia risk (unlike asthma where ICS is first-line)", "Smoking cessation and long-term O2 are the only interventions proven to reduce COPD mortality", "COPD exacerbation treatment: bronchodilators + systemic corticosteroids ± antibiotics (if purulent sputum)", "GOLD E classification replaced old GOLD C/D; based on exacerbation history"],
    commonTrapAnswers: ["Starting ICS monotherapy in COPD (never use ICS alone — it is always combined with LABA)", "Diagnosing COPD without spirometry (cannot diagnose from clinical features alone)", "Using long-term systemic corticosteroids for COPD (only short courses for exacerbations)", "Prescribing oxygen for COPD patients with SpO2 >92% at rest (no mortality benefit)"],
    practiceQuestions: [
      { question: "A patient with COPD GOLD E has blood eosinophils of 350 cells/μL and has had 3 moderate exacerbations in the past year despite LAMA + LABA therapy. What is the next step?", options: ["Add roflumilast", "Escalate to triple therapy (ICS + LAMA + LABA)", "Add azithromycin prophylaxis", "Start long-term oral prednisone"], correctIndex: 1, rationale: "Per GOLD guidelines, patients on LAMA + LABA with continued exacerbations and blood eosinophils ≥300 should be escalated to triple therapy by adding ICS. The eosinophil count >300 supports ICS responsiveness. Roflumilast and azithromycin are options if exacerbations persist on triple therapy. Long-term systemic corticosteroids are never indicated for stable COPD.", isFree: true },
      { question: "What is the target SpO2 range during oxygen therapy in an acute COPD exacerbation?", options: ["94-98%", "88-92%", "92-96%", "85-88%"], correctIndex: 1, rationale: "In acute COPD exacerbation, the target SpO2 is 88-92%. COPD patients with chronic hypercapnia rely on hypoxic drive for ventilation. Excessive oxygen (targeting >92%) can suppress this drive, worsen hypercapnia, and cause CO2 narcosis with respiratory failure. This is different from the general population target of 94-98%.", isFree: true },
      { question: "Which COPD patients should be screened for alpha-1 antitrypsin deficiency?", options: ["Only patients under age 40", "All patients with COPD (at least once)", "Only non-smokers with COPD", "Only patients with family history"], correctIndex: 1, rationale: "WHO and ATS/ERS guidelines recommend screening ALL COPD patients for alpha-1 antitrypsin (AAT) deficiency at least once, regardless of age, smoking status, or family history. AAT deficiency is underdiagnosed, present in 1-5% of COPD patients, and has specific augmentation therapy available. Early diagnosis enables family screening and avoidance of liver-toxic substances.", isFree: true }
    ],
    faqs: [
      { question: "How does COPD management differ from asthma management?", answer: "Key differences: COPD uses LAMA (tiotropium) as first-line maintenance whereas asthma uses ICS; COPD adds ICS based on eosinophils/exacerbations whereas asthma uses ICS from the start; COPD has irreversible airflow limitation whereas asthma is reversible; COPD treatment focuses on exacerbation prevention and symptom reduction whereas asthma targets inflammation control and achieving normal lung function." },
      { question: "When should you refer a COPD patient to a pulmonologist?", answer: "Refer for: diagnostic uncertainty (asthma-COPD overlap), severe COPD (FEV1 <50%), frequent exacerbations despite optimized therapy, consideration of oxygen therapy, evaluation for lung volume reduction surgery, suspected alpha-1 antitrypsin deficiency, or rapid FEV1 decline." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "ABG Interpretation", href: "/np-exam/lab-values/abgs", type: "lab-value" },
      { title: "Pneumonia", href: "/np-exam/conditions/pneumonia", type: "condition" },
      { title: "Heart Failure", href: "/np-exam/conditions/heart-failure", type: "condition" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "pneumonia",
    contentType: "condition",
    tier: "np",
    name: "Pneumonia",
    metaTitle: "Pneumonia for Nurse Practitioners: Diagnosis, Antibiotic Prescribing & Management (2025)",
    metaDescription: "NP-level pneumonia guide covering CAP vs HAP, severity scoring (CURB-65, PSI), empiric antibiotic selection, atypical organisms, and disposition decisions.",
    keywords: "pneumonia NP exam, community acquired pneumonia nurse practitioner, antibiotic prescribing pneumonia, CURB-65 NP, pneumonia management NP",
    definition: "Pneumonia is an acute infection of the lung parenchyma causing inflammation and consolidation of alveolar tissue. Community-acquired pneumonia (CAP) develops outside healthcare settings, while hospital-acquired pneumonia (HAP) develops ≥48 hours after admission.",
    pathophysiology: "Pathogens reach the lower respiratory tract via aspiration of oropharyngeal secretions (most common), inhalation of aerosolized organisms, or hematogenous spread. When local defenses (cough reflex, mucociliary clearance, alveolar macrophages) are overwhelmed, organisms proliferate in alveoli, triggering an inflammatory response with neutrophil influx, exudate production, and consolidation. This impairs gas exchange, causing ventilation-perfusion mismatch and hypoxemia.",
    causesRiskFactors: ["Streptococcus pneumoniae (most common CAP pathogen)", "Mycoplasma pneumoniae (most common atypical — young adults)", "Haemophilus influenzae (COPD patients, smokers)", "Legionella (contaminated water, immunocompromised)", "Staphylococcus aureus (post-influenza pneumonia, MRSA risk)", "Influenza and SARS-CoV-2 (viral pneumonia)", "Risk factors: age >65, smoking, COPD, immunosuppression, aspiration risk, recent hospitalization"],
    signsSymptoms: { early: ["Acute onset cough (productive with purulent sputum in typical; dry in atypical)", "Fever and chills", "Pleuritic chest pain", "Tachypnea and dyspnea"], late: ["High-grade fever with rigors", "Rust-colored sputum (pneumococcal)", "Hypoxemia (SpO2 <94%)", "Altered mental status (especially elderly — may be only sign)", "Sepsis/septic shock (hypotension, tachycardia, end-organ dysfunction)"] },
    differentialDiagnosis: [
      { condition: "Acute bronchitis", distinguishingFeature: "Cough with no consolidation on CXR, no focal exam findings, usually viral, does not warrant antibiotics" },
      { condition: "Pulmonary embolism", distinguishingFeature: "Acute onset pleuritic chest pain, dyspnea, risk factors for VTE, no consolidation, elevated D-dimer" },
      { condition: "Heart failure exacerbation", distinguishingFeature: "Bilateral infiltrates, cardiomegaly, elevated BNP, bilateral pleural effusions, S3 gallop" },
      { condition: "Lung cancer", distinguishingFeature: "Non-resolving infiltrate despite antibiotics, weight loss, hemoptysis — requires CT and biopsy" },
      { condition: "Tuberculosis", distinguishingFeature: "Chronic cough >3 weeks, night sweats, weight loss, upper lobe cavitary lesion, endemic area exposure" }
    ],
    workup: [
      { test: "Chest X-ray (PA and lateral)", rationale: "Confirm pneumonia diagnosis and identify complications", expectedFindings: "Lobar consolidation (typical), diffuse/patchy infiltrates (atypical), pleural effusion, cavitation (necrotizing)" },
      { test: "CBC with differential", rationale: "Assess for leukocytosis/leukopenia indicating infection severity", expectedFindings: "Leukocytosis (WBC >11,000) typical; leukopenia (<4,000) indicates severe infection/poor prognosis" },
      { test: "BMP", rationale: "Assess renal function (guides antibiotic dosing) and BUN for CURB-65", expectedFindings: "BUN >20 mg/dL scores one point on CURB-65" },
      { test: "Procalcitonin", rationale: "Helps differentiate bacterial vs viral; guides antibiotic decisions", expectedFindings: "<0.1 suggests viral (withhold antibiotics); >0.25 supports bacterial (initiate antibiotics)" },
      { test: "Blood cultures × 2 (if admitted)", rationale: "Identify bacteremia and guide targeted antibiotic therapy", expectedFindings: "Positive in 5-14% of CAP; most commonly S. pneumoniae. Obtain before antibiotics." },
      { test: "Sputum culture and Gram stain (if productive cough)", rationale: "Identify pathogen and sensitivities for targeted therapy", expectedFindings: "Gram-positive diplococci (pneumococcus), gram-negative rods (H. influenzae), no organisms in atypical" }
    ],
    redFlags: ["SpO2 <90% on room air requiring supplemental oxygen", "Sepsis criteria: qSOFA ≥2 (altered mental status, RR ≥22, SBP ≤100)", "Multilobar infiltrates with rapid progression", "Pneumonia with cavitation (necrotizing pneumonia — consider MRSA, anaerobes)", "Non-resolving pneumonia after 72 hours of appropriate antibiotics — consider resistant organism, empyema, or alternative diagnosis"],
    labs: [
      { name: "WBC", normalRange: "4,500-11,000/μL", significance: "Leukocytosis supports bacterial infection; leukopenia indicates severe disease/poor prognosis" },
      { name: "Procalcitonin", normalRange: "<0.1 ng/mL", significance: ">0.25 supports bacterial etiology; useful for antibiotic stewardship" },
      { name: "Lactate", normalRange: "<2 mmol/L", significance: ">2 indicates tissue hypoperfusion (sepsis); >4 indicates septic shock" }
    ],
    medications: [
      { name: "Amoxicillin (outpatient, no comorbidities)", drugClass: "Penicillin", action: "Inhibits cell wall synthesis; covers S. pneumoniae, H. influenzae (with clavulanate)", sideEffects: "GI upset, diarrhea, rash, allergic reactions", prescribingNotes: "Outpatient CAP without comorbidities: amoxicillin 1g TID × 5 days PLUS doxycycline or azithromycin for atypical coverage (ATS/IDSA 2019)." },
      { name: "Ceftriaxone + Azithromycin (inpatient)", drugClass: "Cephalosporin + Macrolide", action: "Ceftriaxone: broad-spectrum beta-lactam; Azithromycin: covers atypicals (Mycoplasma, Legionella)", sideEffects: "Ceftriaxone: diarrhea, rash; Azithromycin: QT prolongation, GI upset", prescribingNotes: "Standard inpatient CAP regimen. Ceftriaxone 1-2g IV daily + azithromycin 500 mg IV/PO daily. Duration 5-7 days minimum with clinical stability criteria." },
      { name: "Levofloxacin (respiratory fluoroquinolone)", drugClass: "Fluoroquinolone", action: "Inhibits DNA gyrase and topoisomerase IV; covers typical and atypical organisms", sideEffects: "Tendon rupture, QT prolongation, C. difficile, peripheral neuropathy, aortic aneurysm risk", prescribingNotes: "Alternative for inpatient or outpatient with comorbidities when penicillin allergy. 750 mg PO/IV daily × 5 days. Reserve as monotherapy alternative — not first choice due to resistance concerns and side effects. FDA black box warning." }
    ],
    firstLineManagement: ["Outpatient, healthy: amoxicillin 1g TID + doxycycline 100 mg BID (or azithromycin) × 5 days", "Outpatient with comorbidities: amoxicillin-clavulanate 875/125 BID + macrolide OR respiratory fluoroquinolone monotherapy", "Inpatient (non-ICU): ceftriaxone 1-2g IV daily + azithromycin 500 mg daily", "Inpatient (ICU): ceftriaxone + azithromycin (or fluoroquinolone); add vancomycin if MRSA risk", "Severity assessment: use CURB-65 (0-1: outpatient, 2: consider admission, 3-5: admit, ≥4 consider ICU)"],
    secondLineManagement: ["MRSA risk: add vancomycin 15-20 mg/kg IV q8-12h or linezolid 600 mg q12h", "Pseudomonas risk: piperacillin-tazobactam or cefepime + fluoroquinolone or aminoglycoside", "Aspiration pneumonia: ampicillin-sulbactam or clindamycin for anaerobic coverage", "Non-resolving pneumonia: repeat CXR, consider CT, bronchoscopy if no improvement in 72 hours"],
    nursingInterventions: ["Assess respiratory status (RR, SpO2, work of breathing) every 2-4 hours", "Obtain sputum and blood cultures before initiating antibiotics", "Incentive spirometry and early mobilization", "Assess need for supplemental oxygen; titrate to SpO2 ≥94% (88-92% if COPD)", "Monitor for clinical stability: afebrile, hemodynamically stable, able to eat, improving WBC"],
    complications: ["Parapneumonic effusion and empyema", "Lung abscess", "Sepsis and septic shock", "Acute respiratory distress syndrome (ARDS)", "Bacteremia with metastatic infection"],
    followUpConsiderations: ["Follow-up within 1 week for outpatient CAP", "Repeat CXR in 6-8 weeks to document radiographic resolution (especially in smokers >50 to rule out underlying malignancy)", "Assess need for pneumococcal and influenza vaccination", "Antibiotic duration: minimum 5 days AND clinically stable for ≥48 hours before discontinuation"],
    prescribingPearls: ["ATS/IDSA 2019 guidelines recommend AGAINST monotherapy with a macrolide for outpatient CAP due to rising pneumococcal resistance", "Procalcitonin-guided therapy can safely reduce antibiotic duration", "Duration of therapy: 5-7 days is sufficient for most CAP if patient meets clinical stability criteria", "Fluoroquinolones should be reserved for patients with true beta-lactam allergy or as alternatives — not default first-line due to resistance and adverse effects", "Switch from IV to oral antibiotics when patient is hemodynamically stable, afebrile, improving, and tolerating oral intake"],
    patientCounselling: ["Complete the full course of antibiotics even if you feel better before finishing them", "Rest and drink plenty of fluids", "Cough may persist for several weeks after infection resolves — this is normal", "Seek immediate medical attention if you develop difficulty breathing, high fever, or chest pain", "Get vaccinated against pneumonia and influenza to reduce future risk", "Avoid smoking — it significantly increases your risk of pneumonia"],
    examPearls: ["S. pneumoniae is the most common cause of CAP across all ages", "CURB-65 determines disposition: Confusion, Uremia (BUN >20), Respiratory rate ≥30, Blood pressure <90/60, age ≥65", "Atypical pneumonia (Mycoplasma, Chlamydia, Legionella) presents with dry cough, gradual onset, extrapulmonary symptoms", "Legionella: think contaminated water, GI symptoms, hyponatremia — diagnose with urine antigen", "Aspiration pneumonia involves anaerobes — use antibiotics with anaerobic coverage"],
    commonTrapAnswers: ["Using azithromycin monotherapy for outpatient CAP (no longer recommended due to pneumococcal resistance)", "Starting antibiotics for viral pneumonia/bronchitis (procalcitonin can help differentiate)", "Forgetting to add atypical coverage for inpatient CAP", "Not obtaining cultures before starting antibiotics in admitted patients"],
    practiceQuestions: [
      { question: "A 70-year-old male with COPD presents with acute cough, rust-colored sputum, fever 39.5°C, RR 28, BP 100/60, and confusion. BUN is 24 mg/dL. Chest X-ray shows right lower lobe consolidation. What is his CURB-65 score and recommended disposition?", options: ["Score 2 — consider admission", "Score 4 — ICU admission", "Score 3 — hospital admission", "Score 1 — outpatient treatment"], correctIndex: 1, rationale: "CURB-65: Confusion (1) + Uremia BUN >20 (1) + Respiratory rate ≥30 (0, but 28 is close) + BP <90 systolic (0, but diastolic meets criteria in some scoring) + age ≥65 (1). Actually: C=1, U=1, R=0 (28, not ≥30), B=0 (SBP 100 ≥90), 65=1 = Score 3. With score 3, hospital admission is warranted. With hypotension and confusion, ICU consideration is appropriate. Score 4-5 = consider ICU.", isFree: true },
      { question: "What empiric antibiotic regimen is recommended for non-ICU inpatient community-acquired pneumonia?", options: ["Azithromycin monotherapy", "Ceftriaxone plus azithromycin", "Piperacillin-tazobactam plus vancomycin", "Amoxicillin monotherapy"], correctIndex: 1, rationale: "ATS/IDSA 2019 guidelines recommend beta-lactam (ceftriaxone 1-2g IV daily) plus macrolide (azithromycin 500 mg daily) for non-ICU inpatient CAP. Alternative is respiratory fluoroquinolone monotherapy (levofloxacin 750 mg). This combination covers both typical (S. pneumoniae, H. influenzae) and atypical (Mycoplasma, Legionella) organisms.", isFree: true },
      { question: "A patient with CAP has been on IV ceftriaxone and azithromycin for 3 days. She is now afebrile for 24 hours, HR 78, RR 18, SpO2 96% on room air, and eating normally. What is the appropriate next step?", options: ["Continue IV antibiotics for a total of 14 days", "Switch to oral antibiotics and discharge with close follow-up", "Discontinue all antibiotics — clinical stability achieved", "Add vancomycin for broader coverage"], correctIndex: 1, rationale: "This patient meets clinical stability criteria (afebrile, hemodynamically stable, improving respiratory status, tolerating oral intake). Per ATS/IDSA, switch from IV to oral antibiotics (e.g., oral amoxicillin-clavulanate + azithromycin or levofloxacin) and consider discharge with follow-up. Minimum total duration is 5 days AND stable ≥48 hours before stopping.", isFree: true }
    ],
    faqs: [
      { question: "How do you differentiate typical from atypical pneumonia?", answer: "Typical pneumonia (S. pneumoniae, H. influenzae, S. aureus) presents with acute onset, high fever, productive cough with purulent sputum, and focal lobar consolidation. Atypical pneumonia (Mycoplasma, Chlamydia, Legionella) presents more gradually with dry cough, lower-grade fever, extrapulmonary symptoms (headache, myalgias, GI symptoms), and diffuse/patchy infiltrates. However, clinical features overlap significantly, which is why empiric CAP regimens cover both." },
      { question: "When should you suspect drug-resistant pneumonia?", answer: "Risk factors for drug-resistant pneumonia include: recent antibiotic use within 90 days, hospitalization within 90 days, residence in a nursing home, immunosuppression, and COPD with frequent exacerbations requiring antibiotics. Consider broader spectrum coverage with respiratory fluoroquinolone or beta-lactam + macrolide combination." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "COPD", href: "/np-exam/conditions/copd", type: "condition" },
      { title: "Antibiotics Overview", href: "/np-exam/medications/antibiotics-overview", type: "medication" },
      { title: "CBC Interpretation", href: "/np-exam/lab-values/cbc-interpretation", type: "lab-value" },
      { title: "Viral vs Bacterial Pneumonia", href: "/np-exam/compare/viral-vs-bacterial-pneumonia", type: "comparison" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "sepsis",
    contentType: "condition",
    tier: "np",
    name: "Sepsis",
    metaTitle: "Sepsis for Nurse Practitioners: Early Recognition, Workup & Management (2025)",
    metaDescription: "NP-level sepsis guide covering Sepsis-3 criteria, qSOFA, early recognition, antibiotic selection, fluid resuscitation, vasopressor use, and the 1-hour bundle.",
    keywords: "sepsis NP exam, sepsis management nurse practitioner, qSOFA, sepsis-3 criteria, sepsis antibiotic selection, sepsis bundle NP",
    definition: "Sepsis is life-threatening organ dysfunction caused by a dysregulated host response to infection. Septic shock is a subset with circulatory and cellular/metabolic dysfunction associated with higher mortality, defined by persistent hypotension requiring vasopressors and lactate >2 mmol/L despite adequate fluid resuscitation (Sepsis-3 definition).",
    pathophysiology: "Infection triggers a systemic inflammatory response with release of pro-inflammatory mediators (TNF-alpha, IL-1, IL-6). This causes widespread endothelial dysfunction, vasodilation, capillary leak, microvascular thrombosis, and mitochondrial dysfunction. The result is distributive shock (warm initially, then cold), tissue hypoperfusion, organ dysfunction, and if untreated, multi-organ failure and death. Lactate rises from tissue hypoperfusion and anaerobic metabolism.",
    causesRiskFactors: ["Pneumonia (most common source)", "Urinary tract infections", "Intra-abdominal infections (peritonitis, cholangitis, diverticulitis)", "Skin and soft tissue infections (cellulitis, necrotizing fasciitis)", "Central line-associated bloodstream infections", "Risk factors: age >65, immunosuppression, diabetes, CKD, chronic liver disease, malignancy, recent surgery/procedures, indwelling devices"],
    signsSymptoms: { early: ["Fever (or hypothermia in elderly/immunocompromised)", "Tachycardia (HR >90)", "Tachypnea (RR >20)", "Altered mental status (confusion, restlessness)", "Warm, flushed skin (early distributive shock)"], late: ["Hypotension (SBP <90 or MAP <65 despite fluids)", "Cool, mottled extremities (vasoconstriction, late shock)", "Oliguria (<0.5 mL/kg/hr)", "Elevated lactate (>2 mmol/L)", "Coagulopathy (DIC)", "Multi-organ failure"] },
    differentialDiagnosis: [
      { condition: "Cardiogenic shock", distinguishingFeature: "Elevated JVP, S3 gallop, pulmonary edema, low cardiac output on echo — not responsive to fluids alone" },
      { condition: "Hypovolemic shock", distinguishingFeature: "History of hemorrhage or fluid loss, flat JVP, responds to fluid resuscitation without vasopressors" },
      { condition: "Anaphylaxis", distinguishingFeature: "Acute allergen exposure, urticaria, angioedema, bronchospasm — responds to epinephrine" },
      { condition: "Adrenal crisis", distinguishingFeature: "History of chronic steroid use or adrenal insufficiency, hypoglycemia, hyperkalemia — responds to stress-dose hydrocortisone" }
    ],
    workup: [
      { test: "Blood cultures × 2 (from 2 sites)", rationale: "Identify causative organism before antibiotics", expectedFindings: "Positive in 30-40% of sepsis; guides de-escalation of antibiotics" },
      { test: "Lactate level", rationale: "Assess tissue perfusion; prognostic marker", expectedFindings: ">2 mmol/L indicates tissue hypoperfusion; >4 mmol/L indicates severe sepsis/septic shock" },
      { test: "CBC, BMP, LFTs, coagulation studies", rationale: "Assess organ dysfunction (SOFA score components)", expectedFindings: "Leukocytosis or leukopenia, thrombocytopenia (DIC), elevated creatinine (AKI), elevated bilirubin, coagulopathy" },
      { test: "Procalcitonin", rationale: "Support bacterial infection diagnosis; guide antibiotic duration", expectedFindings: ">0.5 strongly suggests bacterial infection; serial levels guide de-escalation" },
      { test: "Urinalysis and urine culture", rationale: "Identify urinary source of sepsis", expectedFindings: "Pyuria, bacteriuria; most common source in elderly" },
      { test: "Imaging (CXR, CT abdomen/pelvis)", rationale: "Identify source of infection", expectedFindings: "Pneumonia on CXR; abscess, perforation, or fluid collection on CT" }
    ],
    redFlags: ["MAP <65 mmHg despite 30 mL/kg IV crystalloid (septic shock — initiate vasopressors)", "Lactate >4 mmol/L (high mortality risk — aggressive resuscitation)", "Acute mental status change (septic encephalopathy)", "DIC (thrombocytopenia, elevated D-dimer, prolonged PT/PTT) — indicates severe disease", "New organ failure (AKI, hepatic dysfunction, ARDS) — escalate care"],
    labs: [
      { name: "Lactate", normalRange: "<2 mmol/L", significance: "Key marker of tissue hypoperfusion; guide resuscitation adequacy; repeat every 2-4 hours until normalizing" },
      { name: "Procalcitonin", normalRange: "<0.1 ng/mL", significance: ">0.5 supports bacterial sepsis; trend to guide antibiotic duration" },
      { name: "WBC", normalRange: "4,500-11,000/μL", significance: "Leukocytosis (>12,000) or leukopenia (<4,000) both associated with sepsis" }
    ],
    medications: [
      { name: "Broad-spectrum antibiotics", drugClass: "Antimicrobials", action: "Target likely pathogens based on suspected source; empiric until cultures guide de-escalation", sideEffects: "Varies by agent; C. difficile risk, nephrotoxicity (vancomycin, aminoglycosides), allergic reactions", prescribingNotes: "Administer within 1 hour of sepsis recognition. Empiric choices: piperacillin-tazobactam or meropenem (intra-abdominal, broad coverage), ceftriaxone + vancomycin (unknown source), vancomycin + cefepime (healthcare-associated). De-escalate when culture data available." },
      { name: "Norepinephrine", drugClass: "Vasopressor", action: "Alpha-1 and beta-1 agonist; increases SVR and blood pressure", sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis if extravasation", prescribingNotes: "First-line vasopressor for septic shock. Start at 0.1-0.5 mcg/kg/min, titrate to MAP ≥65. Central line preferred but can be given peripherally in emergency. Add vasopressin 0.03-0.04 U/min as second agent if needed." },
      { name: "IV Crystalloid (lactated Ringer's or NS)", drugClass: "IV Fluid", action: "Volume expansion to restore intravascular volume and improve cardiac output/tissue perfusion", sideEffects: "Fluid overload, pulmonary edema; hyperchloremic acidosis (with NS)", prescribingNotes: "30 mL/kg within first 3 hours for sepsis-induced hypotension or lactate ≥4. Balanced crystalloid (LR) may be preferred over NS (less hyperchloremic acidosis). Reassess fluid responsiveness frequently." }
    ],
    firstLineManagement: ["1-Hour Bundle: measure lactate, obtain blood cultures, administer broad-spectrum antibiotics, begin 30 mL/kg crystalloid for hypotension or lactate ≥4, start vasopressors if MAP <65 despite fluids", "Source control: drain abscess, remove infected devices, surgical debridement as needed", "Repeat lactate if initial lactate >2 — target normalization", "Target MAP ≥65 mmHg with fluids and vasopressors"],
    secondLineManagement: ["Vasopressin 0.03-0.04 U/min as second vasopressor (norepinephrine-sparing)", "Stress-dose hydrocortisone (200 mg/day) if refractory shock despite adequate fluids + vasopressors", "Consider mechanical ventilation for ARDS (lung-protective strategy: TV 6 mL/kg IBW, PEEP)", "RBC transfusion target Hgb >7 g/dL (restrictive strategy unless active hemorrhage or ACS)", "Procalcitonin-guided antibiotic de-escalation to shorten duration"],
    nursingInterventions: ["Continuous hemodynamic monitoring (MAP, HR, UO, CVP)", "Strict I&O monitoring with hourly urine output measurement (target >0.5 mL/kg/hr)", "Serial lactate monitoring every 2-4 hours until normalizing", "Central line care bundle to prevent CLABSI", "Early mobilization when hemodynamically stable"],
    complications: ["Multi-organ dysfunction syndrome (MODS)", "Acute respiratory distress syndrome (ARDS)", "Acute kidney injury (sepsis-related AKI)", "Disseminated intravascular coagulation (DIC)", "ICU-acquired weakness and long-term functional decline"],
    followUpConsiderations: ["Post-sepsis syndrome awareness: cognitive impairment, physical disability, psychological effects", "Follow-up within 1 week of discharge for clinical reassessment", "Review antibiotic duration (7-10 days for most sources; procalcitonin-guided de-escalation)", "Assess for and manage sepsis sequelae: AKI recovery, deconditioning, PTSD"],
    prescribingPearls: ["Give antibiotics within 1 hour — every hour of delay increases mortality by ~7.6%", "Norepinephrine is the first-line vasopressor in septic shock (not dopamine)", "Do not delay antibiotics waiting for culture results — obtain cultures but give antibiotics immediately", "Balanced crystalloids (LR) may be superior to normal saline for large-volume resuscitation", "Stress-dose steroids are only for refractory septic shock — not routine sepsis", "Procalcitonin-guided de-escalation can safely reduce antibiotic duration by 2-3 days"],
    patientCounselling: ["Sepsis is a medical emergency — getting treatment quickly saves lives", "Recovery from sepsis can take weeks to months — fatigue, weakness, and cognitive changes are common", "Complete all prescribed antibiotics", "Seek immediate medical attention if you develop fever, rapid breathing, confusion, or feel severely unwell after discharge", "Post-sepsis follow-up is important to monitor for organ recovery and address ongoing symptoms"],
    examPearls: ["Sepsis-3 definition: suspected infection + SOFA score increase ≥2 points", "qSOFA screening: ≥2 of altered mental status, RR ≥22, SBP ≤100 — prompts further assessment", "The 1-hour bundle is the cornerstone of sepsis management on exam questions", "Norepinephrine is first-line vasopressor — dopamine has higher arrhythmia risk", "Lactate clearance (>10-20% decrease in 2-4 hours) is a marker of adequate resuscitation"],
    commonTrapAnswers: ["Choosing dopamine as first-line vasopressor (norepinephrine is preferred — SOAP II trial)", "Delaying antibiotics to wait for culture results", "Administering routine stress-dose steroids for all sepsis (only indicated for refractory shock)", "Using albumin as initial resuscitation fluid (crystalloid is first-line)"],
    practiceQuestions: [
      { question: "A 72-year-old male presents with fever 39.5°C, HR 118, RR 26, BP 78/50, and confusion. Lactate is 4.8 mmol/L. What should be done within the first hour?", options: ["Start IV fluids, obtain cultures, then wait for culture results before antibiotics", "Obtain cultures, administer broad-spectrum antibiotics, start 30 mL/kg crystalloid, remeasure lactate", "Administer stress-dose hydrocortisone and start vasopressors", "Obtain CT scan to identify source before starting treatment"], correctIndex: 1, rationale: "The Surviving Sepsis Campaign 1-hour bundle includes: measure lactate (done — 4.8), obtain blood cultures (before antibiotics but do not delay), administer broad-spectrum antibiotics immediately, begin 30 mL/kg crystalloid for hypotension/lactate ≥4, and start vasopressors if MAP <65 despite fluids. Do not delay antibiotics for cultures or imaging.", isFree: true },
      { question: "After administering 30 mL/kg of crystalloid, a septic patient's MAP remains 58 mmHg. What is the first-line vasopressor?", options: ["Dopamine", "Norepinephrine", "Phenylephrine", "Epinephrine"], correctIndex: 1, rationale: "Norepinephrine is the first-line vasopressor for septic shock per Surviving Sepsis Campaign guidelines. It provides both alpha-1 (vasoconstriction) and beta-1 (cardiac output) stimulation. The SOAP II trial demonstrated lower arrhythmia rates and mortality with norepinephrine compared to dopamine. Vasopressin is added as a second agent if needed.", isFree: true },
      { question: "Which of the following is a component of the qSOFA score?", options: ["Temperature ≥38°C", "Heart rate ≥100 bpm", "Respiratory rate ≥22 breaths/min", "WBC >12,000/μL"], correctIndex: 2, rationale: "qSOFA (Quick Sequential Organ Failure Assessment) has 3 components: altered mental status (GCS <15), respiratory rate ≥22, and systolic blood pressure ≤100 mmHg. A score ≥2 suggests higher risk of poor outcomes and should prompt further assessment for organ dysfunction. Note that temperature, heart rate, and WBC were part of the older SIRS criteria, not qSOFA.", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between SIRS and Sepsis-3?", answer: "SIRS (Systemic Inflammatory Response Syndrome) criteria (2 of: temp >38 or <36, HR >90, RR >20, WBC >12K or <4K) were used in earlier definitions but were too nonspecific. Sepsis-3 (2016) redefined sepsis as suspected infection plus organ dysfunction (SOFA score increase ≥2), which better identifies patients at risk of poor outcomes. qSOFA is a bedside screening tool, not a diagnostic criterion." },
      { question: "When should you start vasopressors in sepsis?", answer: "Start vasopressors if MAP remains <65 mmHg despite initial fluid resuscitation (30 mL/kg crystalloid). In practice, vasopressors may be started concurrently with fluids in severe cases to maintain organ perfusion while volume resuscitation continues. Norepinephrine is first-line. Central access is preferred but peripheral administration is acceptable in emergency situations." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Pneumonia", href: "/np-exam/conditions/pneumonia", type: "condition" },
      { title: "Antibiotics Overview", href: "/np-exam/medications/antibiotics-overview", type: "medication" },
      { title: "CBC Interpretation", href: "/np-exam/lab-values/cbc-interpretation", type: "lab-value" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "mi-acs",
    contentType: "condition",
    tier: "np",
    name: "Myocardial Infarction / Acute Coronary Syndrome",
    metaTitle: "MI & ACS for Nurse Practitioners: Diagnosis, ECG Interpretation & Management (2025)",
    metaDescription: "NP-level ACS guide covering STEMI vs NSTEMI vs unstable angina, ECG interpretation, troponin dynamics, antiplatelet therapy, and acute management protocols.",
    keywords: "ACS NP exam, STEMI management nurse practitioner, myocardial infarction NP, troponin interpretation, antiplatelet therapy NP",
    definition: "Acute coronary syndrome (ACS) encompasses a spectrum of conditions caused by acute myocardial ischemia: unstable angina (UA), non-ST elevation myocardial infarction (NSTEMI), and ST-elevation myocardial infarction (STEMI). The distinction guides urgency of intervention — STEMI requires emergent reperfusion.",
    pathophysiology: "ACS is caused by acute disruption of an atherosclerotic plaque in a coronary artery, triggering platelet aggregation and thrombus formation. In STEMI, complete thrombotic occlusion causes transmural ischemia and infarction. In NSTEMI/UA, partial or transient occlusion causes subendocardial ischemia. Prolonged ischemia leads to irreversible myocyte death within 20-30 minutes, extending from endocardium to epicardium (wavefront of necrosis).",
    causesRiskFactors: ["Atherosclerotic plaque rupture or erosion (primary mechanism)", "Non-modifiable: age >45 (M) or >55 (F), male sex, family history of premature CAD", "Modifiable: hypertension, dyslipidemia, diabetes, smoking, obesity, sedentary lifestyle", "Cocaine/stimulant use (coronary vasospasm)", "Spontaneous coronary artery dissection (SCAD — young women)"],
    signsSymptoms: { early: ["Substernal chest pressure/tightness radiating to left arm, jaw, or back", "Diaphoresis", "Nausea and vomiting", "Dyspnea", "Anxiety/sense of impending doom"], late: ["Cardiogenic shock (hypotension, tachycardia, pulmonary edema)", "Arrhythmias (ventricular tachycardia, ventricular fibrillation, heart block)", "Mechanical complications (papillary muscle rupture, ventricular septal defect, free wall rupture)", "Heart failure", "Atypical presentation in women, elderly, diabetics: fatigue, dyspnea, epigastric pain without classic chest pain"] },
    differentialDiagnosis: [
      { condition: "Stable vs unstable angina", distinguishingFeature: "Stable: predictable with exertion, relieved by rest/NTG. Unstable: new onset, increasing frequency/severity, or at rest — part of ACS" },
      { condition: "Aortic dissection", distinguishingFeature: "Sudden tearing chest/back pain, BP differential between arms, widened mediastinum on CXR — thrombolytics contraindicated" },
      { condition: "Pulmonary embolism", distinguishingFeature: "Acute dyspnea, pleuritic pain, DVT risk factors, elevated D-dimer, RV strain on ECG (S1Q3T3)" },
      { condition: "Pericarditis", distinguishingFeature: "Sharp pleuritic pain relieved by sitting forward, diffuse ST elevation with PR depression on ECG, friction rub" },
      { condition: "GERD/Esophageal spasm", distinguishingFeature: "Burning quality, related to meals, relieved by antacids — may mimic cardiac pain closely" }
    ],
    workup: [
      { test: "12-lead ECG (within 10 minutes)", rationale: "Identify STEMI vs NSTEMI vs UA; localize ischemia", expectedFindings: "STEMI: ST elevation ≥1 mm in ≥2 contiguous leads. NSTEMI: ST depression, T-wave inversion. UA: may be normal or nonspecific" },
      { test: "Serial troponin (high-sensitivity)", rationale: "Confirm myocardial injury; distinguish NSTEMI from UA", expectedFindings: "Rise and fall pattern; detectable within 1-3 hours with hs-troponin; peak at 12-24 hours. UA has normal troponin." },
      { test: "CBC, BMP, PT/INR, lipid panel", rationale: "Baseline labs before anticoagulation and intervention", expectedFindings: "Check renal function (affects contrast and dosing), coagulation status, lipids for statin initiation" },
      { test: "Chest X-ray", rationale: "Evaluate for pulmonary edema, cardiomegaly, or alternative diagnoses", expectedFindings: "Pulmonary congestion if LV failure present; rule out aortic dissection (widened mediastinum)" },
      { test: "Echocardiogram", rationale: "Assess LV function, wall motion abnormalities, mechanical complications", expectedFindings: "Regional wall motion abnormalities correspond to infarct territory; assess EF for post-MI risk stratification" }
    ],
    redFlags: ["STEMI on ECG — activate cardiac catheterization lab immediately (door-to-balloon <90 min)", "Cardiogenic shock — emergent mechanical support and PCI", "Ventricular fibrillation/tachycardia — immediate defibrillation/cardioversion", "Mechanical complications (new murmur with hemodynamic instability) — emergent surgical consultation", "Right ventricular infarction (inferior STEMI + ST elevation V4R) — avoid nitroglycerin and diuretics"],
    labs: [
      { name: "Troponin (high-sensitivity)", normalRange: "<14 ng/L (hs-TnI) or <22 ng/L (hs-TnT)", significance: "Gold standard biomarker for myocardial injury; rise/fall pattern confirms MI. Serial testing at 0 and 3 hours." },
      { name: "CK-MB", normalRange: "<5 ng/mL", significance: "Less sensitive than troponin but useful for detecting reinfarction (shorter half-life)" },
      { name: "BNP", normalRange: "<100 pg/mL", significance: "Elevated in ACS with LV dysfunction; prognostic marker" }
    ],
    medications: [
      { name: "Aspirin", drugClass: "Antiplatelet", action: "Irreversibly inhibits COX-1, blocking thromboxane A2-mediated platelet aggregation", sideEffects: "GI bleeding, gastric ulceration, aspirin sensitivity", prescribingNotes: "Give 325 mg chewed immediately in suspected ACS. Continue 81 mg daily indefinitely post-ACS. Do NOT delay for allergy testing if ACS suspected." },
      { name: "Ticagrelor/Clopidogrel (P2Y12 inhibitor)", drugClass: "Antiplatelet", action: "Blocks P2Y12 ADP receptor on platelets, inhibiting aggregation", sideEffects: "Bleeding (major concern), dyspnea (ticagrelor), thrombotic thrombocytopenic purpura (clopidogrel, rare)", prescribingNotes: "Dual antiplatelet therapy (DAPT): aspirin + P2Y12 inhibitor for 12 months post-ACS. Ticagrelor 180 mg loading then 90 mg BID preferred (faster onset, no CYP2C19 variability). Clopidogrel 300-600 mg loading then 75 mg daily." },
      { name: "Heparin (UFH or enoxaparin)", drugClass: "Anticoagulant", action: "Potentiates antithrombin III, preventing clot propagation", sideEffects: "Bleeding, HIT (heparin-induced thrombocytopenia), osteoporosis (long-term)", prescribingNotes: "Anticoagulation during ACS: enoxaparin 1 mg/kg SC q12h or UFH bolus + drip (target aPTT 1.5-2.5x). Duration: until PCI or discharge. Monitor platelets for HIT." },
      { name: "High-intensity statin (atorvastatin 80 mg)", drugClass: "HMG-CoA Reductase Inhibitor", action: "Inhibits cholesterol synthesis; plaque stabilization independent of lipid levels", sideEffects: "Myalgias, elevated LFTs, rhabdomyolysis (rare)", prescribingNotes: "ALL ACS patients should receive high-intensity statin (atorvastatin 40-80 mg or rosuvastatin 20-40 mg) regardless of baseline LDL. Initiate during hospitalization." }
    ],
    firstLineManagement: ["MONA is outdated — current approach: Aspirin 325 mg chewed, obtain ECG within 10 min, serial troponins, risk stratification", "STEMI: activate cath lab for primary PCI (door-to-balloon <90 min); if PCI not available within 120 min, give fibrinolytics (door-to-needle <30 min)", "NSTEMI/UA: antiplatelet therapy (ASA + P2Y12), anticoagulation, risk stratification with TIMI/GRACE score; early invasive strategy for high-risk features", "Beta-blocker (metoprolol) within 24 hours if no contraindications (cardiogenic shock, bradycardia, heart block)", "High-intensity statin initiated in hospital"],
    secondLineManagement: ["ACEi/ARB starting within 24 hours for anterior MI, EF <40%, HF, or diabetes", "Nitrates for ongoing ischemic chest pain (sublingual or IV) — contraindicated in RV infarction, PDE5 inhibitor use, hypotension", "Cardiac rehabilitation referral post-MI", "ICD evaluation if EF ≤35% persists after 40 days post-MI (primary prevention)", "Long-term management: DAPT × 12 months, statin, beta-blocker, ACEi/ARB as indicated"],
    nursingInterventions: ["Continuous cardiac monitoring for arrhythmias", "Serial ECGs to detect evolving changes", "Pain assessment and management", "Bedrest initially; progressive activity as tolerated", "Emotional support and anxiety management"],
    complications: ["Cardiogenic shock (most common cause of in-hospital death from MI)", "Arrhythmias (VF/VT most common cause of pre-hospital death)", "Heart failure", "Mechanical complications (typically day 3-5 post-MI): papillary muscle rupture, VSD, free wall rupture", "Pericarditis (early: within 24-72 hours; Dressler syndrome: 2-10 weeks post-MI)"],
    followUpConsiderations: ["Follow-up within 1-2 weeks post-discharge", "Repeat echocardiogram in 6-12 weeks to reassess EF", "DAPT duration: 12 months post-ACS (may be shortened or extended based on bleeding/ischemic risk)", "Cardiac rehabilitation — improves outcomes and quality of life", "Address modifiable risk factors: smoking cessation, lipid management, BP control, diabetes management, exercise"],
    prescribingPearls: ["Aspirin should never be withheld in suspected ACS — the benefit far outweighs bleeding risk", "Ticagrelor is preferred over clopidogrel in ACS (PLATO trial) — faster onset, no CYP2C19 genetic variability", "Nitroglycerin is contraindicated in right ventricular MI — causes dangerous hypotension (preload-dependent)", "All post-ACS patients need high-intensity statin regardless of LDL level", "Beta-blockers should NOT be given in cardiogenic shock, severe bradycardia, or decompensated heart failure", "Morphine should be used cautiously — may reduce antiplatelet absorption and has been associated with worse outcomes in some studies"],
    patientCounselling: ["If you experience chest pain, call 911 immediately — do not drive yourself to the hospital", "Take aspirin 81 mg daily and your P2Y12 inhibitor (ticagrelor or clopidogrel) as prescribed — do not stop without consulting your provider", "Do not stop your medications even if you feel well — they prevent future heart attacks", "Participate in cardiac rehabilitation — it significantly improves recovery and reduces future cardiac events", "Control risk factors: stop smoking, follow a heart-healthy diet, exercise regularly, manage blood pressure and diabetes", "Carry nitroglycerin sublingual tablets for chest pain — use as directed and call 911 if pain persists after 1 dose"],
    examPearls: ["The first test in suspected ACS is a 12-lead ECG — must be obtained within 10 minutes of presentation", "STEMI requires emergent reperfusion: PCI preferred (door-to-balloon <90 min) or thrombolytics (door-to-needle <30 min)", "Serial high-sensitivity troponin at 0 and 3 hours — a rise/fall pattern confirms MI", "Right ventricular MI complicates inferior STEMI — check right-sided ECG leads (V4R), avoid nitroglycerin and diuretics, treat with IV fluids", "Clopidogrel is a prodrug metabolized by CYP2C19 — poor metabolizers get suboptimal antiplatelet effect (ticagrelor avoids this)"],
    commonTrapAnswers: ["Giving nitroglycerin in right ventricular MI (causes dangerous hypotension)", "Delaying aspirin to check for allergy in acute ACS (immediate aspirin is standard of care)", "Using low-intensity statin post-ACS (all ACS patients need high-intensity statin)", "Ordering troponin once and ruling out MI (serial troponin testing is required)", "Choosing dopamine for cardiogenic shock complicating MI (norepinephrine or dobutamine preferred based on hemodynamics)"],
    practiceQuestions: [
      { question: "A 55-year-old male presents with 30 minutes of substernal chest pressure, diaphoresis, and ECG showing ST elevation in leads V1-V4. What is the immediate priority action?", options: ["Order troponin and wait for results", "Aspirin 325 mg chewed and activate cardiac catheterization lab", "Start IV heparin drip and admit to telemetry", "Administer nitroglycerin sublingual × 3 before further evaluation"], correctIndex: 1, rationale: "This is an anterior STEMI (V1-V4) — a time-critical emergency. The priorities are: aspirin 325 mg chewed immediately and activate the cardiac catheterization lab for primary PCI with a door-to-balloon target <90 minutes. Do not wait for troponin — the ECG is diagnostic. Every 30-minute delay in reperfusion increases mortality.", isFree: true },
      { question: "An ECG shows ST elevation in leads II, III, and aVF with ST elevation in V4R. The patient is hypotensive (BP 82/50). Which intervention should be AVOIDED?", options: ["IV normal saline bolus", "Aspirin 325 mg", "Sublingual nitroglycerin", "Dobutamine infusion"], correctIndex: 2, rationale: "This patient has an inferior STEMI with right ventricular involvement (ST elevation in V4R). RV infarction causes preload-dependent hemodynamics — nitroglycerin and diuretics reduce preload and can cause severe hypotension or cardiovascular collapse. Management includes IV fluid resuscitation to maintain RV preload. Dobutamine may be needed for RV failure.", isFree: true },
      { question: "Which antiplatelet agent is preferred over clopidogrel in ACS and why?", options: ["Prasugrel — because it has lower bleeding risk", "Ticagrelor — because it has faster onset and no CYP2C19 variability", "Aspirin alone is sufficient — no P2Y12 inhibitor needed", "Dipyridamole — because it provides longer antiplatelet effect"], correctIndex: 1, rationale: "Ticagrelor is preferred over clopidogrel in ACS per the PLATO trial, which demonstrated reduced cardiovascular death, MI, and stroke. Ticagrelor has faster onset of action (30 minutes vs 2-6 hours), is a direct-acting agent (does not require hepatic activation), and avoids CYP2C19 genetic variability that causes clopidogrel resistance in 2-14% of patients.", isFree: true }
    ],
    faqs: [
      { question: "How do you differentiate STEMI, NSTEMI, and unstable angina?", answer: "STEMI: ST elevation on ECG + positive troponin = complete coronary occlusion requiring emergent PCI. NSTEMI: no ST elevation but positive troponin = partial occlusion with myocardial injury. Unstable angina: no ST elevation and normal troponin = ischemia without injury. All three are ACS and require urgent evaluation, but STEMI has the most time-critical management." },
      { question: "How long should dual antiplatelet therapy (DAPT) be continued after ACS?", answer: "Standard DAPT duration post-ACS is 12 months (aspirin + P2Y12 inhibitor). In patients with high bleeding risk, shorter duration (3-6 months) may be considered. In patients with high ischemic risk and low bleeding risk, extended DAPT beyond 12 months may benefit. This decision should be individualized using tools like the DAPT score." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Heart Failure", href: "/np-exam/conditions/heart-failure", type: "condition" },
      { title: "Beta-Blockers", href: "/np-exam/medications/beta-blockers", type: "medication" },
      { title: "Statins", href: "/np-exam/medications/statins", type: "medication" },
      { title: "Stable vs Unstable Angina", href: "/np-exam/compare/stable-vs-unstable-angina", type: "comparison" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "stroke",
    contentType: "condition",
    tier: "np",
    name: "Stroke (CVA)",
    metaTitle: "Stroke for Nurse Practitioners: Ischemic vs Hemorrhagic, tPA Criteria & Management (2025)",
    metaDescription: "NP-level stroke guide covering ischemic vs hemorrhagic differentiation, tPA eligibility, acute management, secondary prevention, and NIHSS scoring.",
    keywords: "stroke NP exam, CVA management nurse practitioner, tPA criteria, ischemic stroke NP, hemorrhagic stroke, NIHSS scoring NP",
    definition: "Stroke is the sudden onset of a focal neurological deficit due to a vascular cause. Ischemic stroke (87% of cases) results from arterial occlusion by thrombosis or embolism. Hemorrhagic stroke (13%) results from vessel rupture causing intracerebral hemorrhage (ICH) or subarachnoid hemorrhage (SAH).",
    pathophysiology: "Ischemic stroke: arterial occlusion deprives brain tissue of oxygen and glucose. The ischemic core (irreversible damage) is surrounded by the penumbra (tissue at risk but potentially salvageable with reperfusion). Time is critical — every minute of large vessel occlusion destroys ~1.9 million neurons. Hemorrhagic stroke: vessel rupture causes mass effect from expanding hematoma, increased ICP, and secondary ischemia from vasospasm (SAH).",
    causesRiskFactors: ["Atrial fibrillation (most common source of cardioembolism)", "Carotid atherosclerosis", "Hypertension (strongest modifiable risk factor for both ischemic and hemorrhagic)", "Diabetes mellitus", "Smoking", "Dyslipidemia", "Prior stroke/TIA", "Hemorrhagic: hypertension (most common), cerebral amyloid angiopathy, anticoagulation, AVM, aneurysm (SAH)"],
    signsSymptoms: { early: ["Sudden onset focal neurological deficit (hallmark)", "Unilateral weakness or numbness (face, arm, leg)", "Aphasia (dominant hemisphere) or neglect (non-dominant hemisphere)", "Visual field deficits (homonymous hemianopia)", "Dysarthria", "Ataxia/vertigo (posterior circulation)"], late: ["Herniation syndromes (fixed dilated pupil, Cushing triad)", "Hemorrhagic transformation of ischemic stroke", "Cerebral edema (peaks at 3-5 days)", "Aspiration pneumonia", "DVT/PE from immobility"] },
    differentialDiagnosis: [
      { condition: "TIA (transient ischemic attack)", distinguishingFeature: "Symptoms resolve completely within 24 hours (typically <60 min); no infarction on imaging — still a medical emergency" },
      { condition: "Hypoglycemia", distinguishingFeature: "Can perfectly mimic stroke; always check fingerstick glucose before tPA — glucose <60 can cause focal deficits that resolve with glucose correction" },
      { condition: "Todd's paralysis (post-ictal)", distinguishingFeature: "Focal weakness following seizure; resolves within 24-48 hours; history of witnessed seizure" },
      { condition: "Complex migraine with aura", distinguishingFeature: "Gradual onset (over minutes), march of symptoms, headache follows, history of similar episodes" },
      { condition: "Brain tumor/abscess", distinguishingFeature: "Progressive symptoms (not sudden onset), headache, possible seizures, MRI shows mass lesion" }
    ],
    workup: [
      { test: "CT head without contrast (STAT)", rationale: "First-line to rule out hemorrhage before thrombolytic therapy", expectedFindings: "Normal or early ischemic changes (loss of gray-white differentiation, sulcal effacement) in ischemic stroke; hyperdense lesion in hemorrhagic stroke" },
      { test: "CT angiography (CTA head/neck)", rationale: "Identify large vessel occlusion (LVO) for thrombectomy candidacy", expectedFindings: "Occlusion of ICA, MCA, basilar artery; also evaluates carotid stenosis" },
      { test: "Fingerstick glucose", rationale: "Rule out hypoglycemia as stroke mimic — must be checked before tPA", expectedFindings: "Glucose <60 mg/dL can cause focal deficits; must correct before attributing symptoms to stroke" },
      { test: "MRI with DWI", rationale: "Most sensitive for acute ischemia; defines extent of infarction", expectedFindings: "DWI restriction (bright signal) within minutes of ischemia; ADC map confirms acute infarction" },
      { test: "ECG and telemetry", rationale: "Identify atrial fibrillation and other arrhythmias as embolic source", expectedFindings: "AF found in 20-25% of ischemic strokes; guides anticoagulation for secondary prevention" },
      { test: "CBC, BMP, PT/INR, PTT", rationale: "Baseline labs; check coagulation status before thrombolysis", expectedFindings: "Ensure platelets >100,000 and INR <1.7 for tPA eligibility" }
    ],
    redFlags: ["Acute stroke symptoms within tPA window (4.5 hours) — time-critical evaluation for thrombolysis", "Large vessel occlusion (LVO) — evaluate for mechanical thrombectomy up to 24 hours in select patients", "Hemorrhagic stroke with expanding hematoma — neurosurgical emergency", "Posterior circulation stroke (basilar artery) — risk of rapid deterioration, locked-in syndrome", "Malignant MCA infarction with cerebral edema — may require decompressive craniectomy"],
    labs: [
      { name: "Glucose (fingerstick)", normalRange: "70-100 mg/dL", significance: "Must rule out hypoglycemia before tPA — ONLY lab required before treatment" },
      { name: "INR", normalRange: "<1.7 for tPA", significance: "Supratherapeutic anticoagulation is contraindication to tPA" },
      { name: "Troponin", normalRange: "<0.04 ng/mL", significance: "Mildly elevated in stroke (myocardial stress); markedly elevated suggests concurrent ACS" }
    ],
    medications: [
      { name: "Alteplase (tPA)", drugClass: "Thrombolytic", action: "Converts plasminogen to plasmin, which degrades fibrin clots; restores blood flow to ischemic brain", sideEffects: "Intracranial hemorrhage (6-7% risk), systemic bleeding, angioedema", prescribingNotes: "0.9 mg/kg IV (max 90 mg): 10% bolus over 1 min, remainder over 60 min. Must be within 4.5 hours of symptom onset. Check exclusion criteria: recent surgery, active bleeding, platelets <100K, INR >1.7, glucose <50." },
      { name: "Aspirin 325 mg (after tPA window)", drugClass: "Antiplatelet", action: "Inhibits platelet aggregation; reduces recurrent stroke risk", sideEffects: "GI bleeding", prescribingNotes: "Give within 24-48 hours of ischemic stroke onset. If tPA given, wait 24 hours and confirm no hemorrhage on repeat CT before starting aspirin. DAPT (aspirin + clopidogrel) for minor stroke/TIA × 21 days (POINT trial)." },
      { name: "Apixaban/Rivaroxaban (for AF-related stroke)", drugClass: "Direct Oral Anticoagulant", action: "Factor Xa inhibition; prevents cardioembolism from atrial fibrillation", sideEffects: "Bleeding (less ICH risk than warfarin), GI upset", prescribingNotes: "Start anticoagulation 4-14 days after ischemic stroke (timing based on infarct size — 1-3-6-12 day rule). DOACs preferred over warfarin for non-valvular AF (ARISTOTLE, ROCKET-AF trials). Contraindicated in hemorrhagic stroke." }
    ],
    firstLineManagement: ["CT head WITHOUT contrast within 20 minutes of arrival to rule out hemorrhage", "tPA (alteplase 0.9 mg/kg) if within 4.5 hours and no contraindications — only fingerstick glucose needed before administration", "Mechanical thrombectomy for LVO up to 24 hours in selected patients (DAWN, DEFUSE-3 criteria)", "Admit to stroke unit or ICU for monitoring", "BP management: permissive hypertension (allow up to 220/120) in ischemic stroke without tPA; target <185/110 before tPA and <180/105 after"],
    secondLineManagement: ["Carotid endarterectomy or stenting for symptomatic carotid stenosis ≥70%", "Long-term anticoagulation for AF-related stroke (DOAC preferred over warfarin)", "Statin therapy for atherosclerotic stroke (high-intensity)", "Dual antiplatelet therapy (aspirin + clopidogrel × 21 days) for minor stroke or high-risk TIA", "Rehabilitation: physical therapy, occupational therapy, speech therapy — early initiation improves outcomes"],
    nursingInterventions: ["NIHSS assessment (National Institutes of Health Stroke Scale)", "NPO until swallowing screen completed (dysphagia screening before oral intake)", "Continuous cardiac monitoring for arrhythmias", "Neurological checks every 15 minutes during/after tPA", "Head of bed 30 degrees; avoid excessive BP lowering"],
    complications: ["Hemorrhagic transformation (especially after thrombolysis)", "Cerebral edema (peaks 3-5 days post-stroke)", "Aspiration pneumonia (due to dysphagia)", "DVT/PE (from immobility)", "Depression (affects up to 30% of stroke survivors)", "Post-stroke seizures"],
    followUpConsiderations: ["Follow-up within 1-2 weeks for secondary prevention optimization", "Comprehensive stroke rehabilitation assessment", "Echocardiogram and prolonged cardiac monitoring (30-day event monitor) to detect AF", "Lipid panel and statin optimization", "Evaluate for modifiable risk factors: HTN control, diabetes management, smoking cessation, exercise"],
    prescribingPearls: ["Time is brain — tPA must be given within 4.5 hours; thrombectomy up to 24 hours for LVO", "Only fingerstick glucose is required before tPA administration — do not delay for other labs", "Permissive hypertension in acute ischemic stroke (allow up to 220/120 if not giving tPA) — lowering BP can worsen ischemia", "For AF-related stroke, DOACs are preferred over warfarin for secondary prevention", "DAPT (aspirin + clopidogrel) for 21 days is recommended for minor stroke/high-risk TIA (POINT trial)", "Do not give anticoagulants or antiplatelets within 24 hours of tPA administration"],
    patientCounselling: ["Learn the signs of stroke using BE-FAST: Balance, Eyes (vision), Face drooping, Arm weakness, Speech difficulty, Time to call 911", "If you experience any stroke symptoms, call 911 immediately — treatments work best when given quickly", "Take your blood pressure and cholesterol medications as prescribed to prevent future strokes", "If you have atrial fibrillation, take your blood thinner exactly as prescribed — missing doses increases stroke risk", "Participate actively in rehabilitation — consistent effort improves recovery outcomes", "Do not smoke — smoking doubles your stroke risk"],
    examPearls: ["CT head without contrast is the FIRST imaging in acute stroke — rules out hemorrhage before tPA", "tPA window: 4.5 hours from symptom onset (or last known well)", "Thrombectomy can extend to 24 hours for large vessel occlusion with favorable imaging (DAWN/DEFUSE-3)", "Check fingerstick glucose before tPA — hypoglycemia mimics stroke and is a reversible cause", "Permissive hypertension in ischemic stroke — do NOT lower BP unless >220/120 (or >185/110 if tPA candidate)", "Hemorrhagic stroke: lower BP to SBP <140 mmHg (opposite of ischemic management)"],
    commonTrapAnswers: ["Ordering MRI before CT in acute stroke (CT is first-line — faster, rules out hemorrhage for tPA decision)", "Aggressively lowering BP in acute ischemic stroke (permissive hypertension maintains perfusion to penumbra)", "Giving tPA after 4.5 hours from symptom onset (outside the window — no benefit, only risk)", "Starting anticoagulation immediately after large ischemic stroke (wait 4-14 days based on infarct size)", "Attributing symptoms to stroke without checking glucose (hypoglycemia is a common mimic)"],
    practiceQuestions: [
      { question: "A 68-year-old female presents 2 hours after sudden onset right-sided weakness and aphasia. CT head is negative for hemorrhage. BP is 192/104. What is the most appropriate next step?", options: ["Lower BP to <140/90 before considering tPA", "Administer tPA 0.9 mg/kg IV after confirming no contraindications", "Order MRI to confirm ischemic stroke before treatment", "Administer aspirin 325 mg and admit to observation"], correctIndex: 1, rationale: "This patient is within the tPA window (2 hours from onset), CT has ruled out hemorrhage, and she has a significant neurological deficit. BP of 192/104 is above the threshold for tPA (must be <185/110), so brief IV labetalol or nicardipine to lower BP, then administer tPA. Do not delay for MRI. Aspirin alone is not adequate for acute ischemic stroke within the tPA window.", isFree: true },
      { question: "A patient received tPA for ischemic stroke 18 hours ago. Repeat CT shows no hemorrhage. When should aspirin be started?", options: ["Immediately", "24 hours after tPA with confirmatory CT showing no hemorrhage", "48-72 hours after tPA", "Only after discharge"], correctIndex: 1, rationale: "After tPA administration, antiplatelet and anticoagulant agents should be held for 24 hours. A repeat CT at 24 hours confirms no hemorrhagic transformation. If CT is clear, aspirin 81-325 mg daily should be initiated for secondary stroke prevention. This is the standard protocol per AHA/ASA guidelines.", isFree: true },
      { question: "Which stroke patients are candidates for mechanical thrombectomy beyond the standard tPA window?", options: ["All ischemic strokes within 12 hours", "Large vessel occlusion with favorable perfusion imaging up to 24 hours", "Only patients who received tPA first", "Small vessel strokes with NIHSS <5"], correctIndex: 1, rationale: "The DAWN and DEFUSE-3 trials extended the thrombectomy window to 24 hours for patients with large vessel occlusion (ICA or MCA M1) who have favorable perfusion imaging (small core infarct with large ischemic penumbra). This is based on imaging-guided selection, not time alone. Patients can receive thrombectomy with or without prior tPA.", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between ischemic and hemorrhagic stroke management?", answer: "Ischemic stroke: permissive hypertension, tPA if within 4.5 hours, thrombectomy for LVO, antiplatelet therapy. Hemorrhagic stroke: LOWER BP to SBP <140, reverse any anticoagulation, neurosurgical consultation, NO tPA or antiplatelets. The management is essentially opposite in terms of blood pressure and antithrombotic therapy, which is why CT head is mandatory before treatment." },
      { question: "How do you assess stroke severity?", answer: "The NIHSS (National Institutes of Health Stroke Scale) is the standardized tool for quantifying stroke severity. It assesses level of consciousness, gaze, visual fields, facial palsy, motor function (arms and legs), ataxia, sensation, language, dysarthria, and neglect. Scores range from 0-42; higher scores indicate more severe stroke. NIHSS >6 often warrants tPA; NIHSS >10 with LVO guides thrombectomy decisions." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Hypertension", href: "/np-exam/conditions/hypertension", type: "condition" },
      { title: "Lipid Panel Lab Values", href: "/np-exam/lab-values/lipid-panel", type: "lab-value" },
      { title: "Statins", href: "/np-exam/medications/statins", type: "medication" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "thyroid-disorders",
    contentType: "condition",
    tier: "np",
    name: "Thyroid Disorders",
    metaTitle: "Thyroid Disorders for Nurse Practitioners: Hypothyroid vs Hyperthyroid Management (2025)",
    metaDescription: "NP-level thyroid guide covering hypothyroidism, hyperthyroidism, Hashimoto's, Graves' disease, TSH interpretation, levothyroxine prescribing, and thyroid nodule workup.",
    keywords: "thyroid disorders NP exam, hypothyroidism nurse practitioner, hyperthyroidism NP, levothyroxine prescribing, TSH interpretation, Graves disease NP",
    definition: "Thyroid disorders encompass conditions of thyroid hormone excess (hyperthyroidism) or deficiency (hypothyroidism). Hypothyroidism (most commonly Hashimoto's thyroiditis) and hyperthyroidism (most commonly Graves' disease) are among the most commonly managed endocrine conditions in primary care.",
    pathophysiology: "The hypothalamic-pituitary-thyroid axis regulates thyroid function: TRH stimulates TSH release, which stimulates T4 and T3 production. Negative feedback maintains homeostasis. Hashimoto's: autoimmune destruction of thyroid tissue (anti-TPO, anti-thyroglobulin antibodies) causes progressive hypothyroidism. Graves': TSH receptor-stimulating antibodies (TRAb/TSI) cause unregulated thyroid hormone production. Understanding the inverse TSH-T4 relationship is critical: low TSH = high T4 (hyper); high TSH = low T4 (hypo).",
    causesRiskFactors: ["Hypothyroidism: Hashimoto's thyroiditis (most common), post-thyroidectomy, post-radioiodine ablation, iodine deficiency (global), medications (lithium, amiodarone), central/secondary (pituitary)", "Hyperthyroidism: Graves' disease (most common), toxic multinodular goiter, toxic adenoma, thyroiditis (subacute, postpartum), iodine excess, exogenous thyroid hormone", "Risk factors: female sex (5-8x more common), autoimmune diseases, family history, age >60, radiation exposure"],
    signsSymptoms: { early: ["Hypothyroid: fatigue, weight gain, cold intolerance, constipation, dry skin, menstrual irregularities", "Hyperthyroid: weight loss despite increased appetite, heat intolerance, palpitations, tremor, anxiety, diarrhea"], late: ["Hypothyroid: myxedema (non-pitting edema), bradycardia, delayed relaxation of DTRs, myxedema coma (severe)", "Hyperthyroid: atrial fibrillation, Graves' ophthalmopathy (proptosis, lid lag), thyroid storm (severe tachycardia, hyperthermia, AMS)", "Both: goiter (diffuse or nodular)"] },
    differentialDiagnosis: [
      { condition: "Depression vs hypothyroidism", distinguishingFeature: "Significant symptom overlap (fatigue, weight gain, cognitive slowing); TSH differentiates — always check thyroid function in new depression" },
      { condition: "Anxiety disorder vs hyperthyroidism", distinguishingFeature: "Both present with anxiety, palpitations, tremor; TSH distinguishes — check in all new-onset anxiety" },
      { condition: "Subclinical thyroid disease", distinguishingFeature: "Abnormal TSH but normal free T4 — subclinical hypothyroidism (TSH mildly elevated) or subclinical hyperthyroidism (TSH mildly low)" },
      { condition: "Euthyroid sick syndrome", distinguishingFeature: "Abnormal thyroid tests in acute illness without thyroid disease; low T3, variable TSH — resolves when illness resolves; do not treat" },
      { condition: "Thyroid cancer", distinguishingFeature: "Thyroid nodule, usually euthyroid, hard/fixed nodule, rapid growth, lymphadenopathy — FNA for suspicious features" }
    ],
    workup: [
      { test: "TSH (first-line screening)", rationale: "Most sensitive test for thyroid dysfunction; inverse relationship with thyroid hormones", expectedFindings: "Elevated TSH (>4.5) = hypothyroidism; Suppressed TSH (<0.4) = hyperthyroidism" },
      { test: "Free T4 (if TSH abnormal)", rationale: "Confirms and quantifies thyroid dysfunction", expectedFindings: "Low free T4 + high TSH = overt hypothyroidism; High free T4 + low TSH = overt hyperthyroidism; Normal free T4 + abnormal TSH = subclinical" },
      { test: "Anti-TPO antibodies", rationale: "Confirm autoimmune etiology (Hashimoto's)", expectedFindings: "Positive in >95% of Hashimoto's; helps predict progression of subclinical hypothyroidism to overt" },
      { test: "TSH receptor antibodies (TRAb/TSI)", rationale: "Confirm Graves' disease", expectedFindings: "Positive in >95% of Graves' disease; useful when RAIU is contraindicated (pregnancy)" },
      { test: "Radioactive iodine uptake (RAIU) scan", rationale: "Differentiate causes of hyperthyroidism", expectedFindings: "Diffuse increased uptake = Graves'; patchy uptake = toxic MNG; focal uptake = toxic adenoma; decreased uptake = thyroiditis" },
      { test: "Thyroid ultrasound", rationale: "Evaluate thyroid nodules, guide FNA", expectedFindings: "ACR TI-RADS classification guides FNA decisions; suspicious features: solid, hypoechoic, irregular margins, calcifications" }
    ],
    redFlags: ["Myxedema coma: hypothermia, bradycardia, hypotension, AMS — treat with IV levothyroxine + stress-dose steroids", "Thyroid storm: extreme tachycardia, hyperthermia (>40°C), AMS — Burch-Wartofsky score >45 = likely; treat with PTU, beta-blocker, iodine, steroids", "Rapidly growing thyroid nodule with hard consistency — suspect malignancy, urgent FNA", "New atrial fibrillation with hyperthyroidism — rate control and evaluate for thyroid-driven AF", "Graves' ophthalmopathy with vision changes — urgent ophthalmology referral"],
    labs: [
      { name: "TSH", normalRange: "0.4-4.5 mIU/L", significance: "Most sensitive first-line test; inverse relationship with thyroid hormones" },
      { name: "Free T4", normalRange: "0.8-1.8 ng/dL", significance: "Confirms thyroid dysfunction when TSH abnormal; represents unbound, active hormone" },
      { name: "Free T3", normalRange: "2.3-4.2 pg/mL", significance: "Useful in T3 thyrotoxicosis (elevated T3 with normal T4); also monitors response to hyperthyroid treatment" },
      { name: "Anti-TPO antibodies", normalRange: "<35 IU/mL", significance: "Positive in Hashimoto's; predicts progression of subclinical to overt hypothyroidism" }
    ],
    medications: [
      { name: "Levothyroxine (T4)", drugClass: "Thyroid Hormone Replacement", action: "Synthetic T4 that is peripherally converted to T3; replaces deficient thyroid hormone", sideEffects: "Overreplacement: palpitations, tachycardia, anxiety, insomnia, bone loss; Underreplacement: persistent hypothyroid symptoms", prescribingNotes: "Dose: 1.6 mcg/kg/day for full replacement in young healthy adults. Start 25-50 mcg in elderly or cardiac patients (lower starting dose to prevent cardiac stress). Take on empty stomach, 30-60 min before breakfast. Recheck TSH in 6-8 weeks after initiation or dose change." },
      { name: "Methimazole", drugClass: "Thionamide (Anti-thyroid)", action: "Inhibits thyroid peroxidase, blocking thyroid hormone synthesis", sideEffects: "Agranulocytosis (rare but serious — fever + sore throat = stop drug + CBC), hepatotoxicity (cholestatic), rash", prescribingNotes: "First-line anti-thyroid drug for Graves'. Start 10-30 mg daily depending on severity. Monitor CBC and LFTs. Preferred over PTU except in first trimester pregnancy (PTU preferred then). Must counsel patients about agranulocytosis symptoms." },
      { name: "Propranolol", drugClass: "Beta-Blocker", action: "Controls adrenergic symptoms (tachycardia, tremor, anxiety); also blocks peripheral T4→T3 conversion", sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm", prescribingNotes: "Adjunctive for symptom control in any cause of hyperthyroidism. Propranolol 10-40 mg TID-QID. Does not treat the underlying thyroid disease. Continue until thyroid levels normalize." }
    ],
    firstLineManagement: ["Hypothyroidism: levothyroxine replacement with TSH-guided dose adjustment", "Hyperthyroidism (Graves'): methimazole (first-line in most countries), radioactive iodine ablation, or thyroidectomy", "Subclinical hypothyroidism: treat if TSH >10 or TSH 5-10 with symptoms/positive anti-TPO/pregnancy", "Subclinical hyperthyroidism: treat if TSH <0.1 and age >65 or cardiac disease or osteoporosis", "Thyroid nodule: ultrasound → ACR TI-RADS classification → FNA if indicated"],
    secondLineManagement: ["RAI (radioactive iodine) ablation for Graves' disease refractory to methimazole or patient preference", "Thyroidectomy for large goiter, suspicion of malignancy, or methimazole intolerance/failure", "Selenium supplementation for mild Graves' ophthalmopathy (EUGOGO guidelines)", "PTU (propylthiouracil) for first trimester pregnancy (methimazole is teratogenic in first trimester)", "Central hypothyroidism: dose guided by free T4 level (not TSH — TSH is unreliable in pituitary disease)"],
    nursingInterventions: ["Medication education: levothyroxine timing (empty stomach, 30-60 min before meals, separate from calcium/iron by 4 hours)", "Monitor for signs of thyroid storm or myxedema coma", "Assess for medication interactions affecting thyroid absorption", "Fall risk assessment in hypothyroid patients (myopathy, cognitive changes)"],
    complications: ["Hypothyroid: myxedema coma, hyperlipidemia/accelerated atherosclerosis, infertility, cognitive impairment", "Hyperthyroid: thyroid storm, atrial fibrillation/stroke, osteoporosis, heart failure", "Treatment complications: RAI-induced hypothyroidism (expected — lifelong levothyroxine needed), methimazole agranulocytosis"],
    followUpConsiderations: ["Recheck TSH 6-8 weeks after any levothyroxine dose change", "For Graves' on methimazole: monitor free T4 every 4-6 weeks initially, then every 2-3 months", "Annual TSH monitoring once stable on levothyroxine", "Thyroid nodules: follow-up ultrasound based on TI-RADS classification (6-12 months for suspicious, 12-24 months for mildly suspicious)"],
    prescribingPearls: ["Levothyroxine dose: 1.6 mcg/kg/day for full replacement; start lower in elderly/cardiac patients", "Medications that impair levothyroxine absorption: calcium, iron, PPIs, cholestyramine — separate by 4 hours", "TSH takes 6-8 weeks to reach steady state after dose change — do not recheck too early", "Methimazole is preferred over PTU for Graves' except in first trimester pregnancy (PTU has less teratogenic risk in T1)", "Biotin supplements can interfere with thyroid lab assays — hold for 2-3 days before testing", "In pregnancy, TSH targets are trimester-specific (T1: 0.1-2.5, T2: 0.2-3.0, T3: 0.3-3.0 in some guidelines)"],
    patientCounselling: ["Take levothyroxine on an empty stomach, 30-60 minutes before eating or drinking anything besides water", "Do not take calcium, iron, or antacids within 4 hours of levothyroxine", "If on methimazole, seek immediate medical attention for sore throat with fever (could indicate agranulocytosis — a rare but serious side effect)", "Thyroid medication adjustments take 6-8 weeks to take full effect — be patient with dose changes", "Do not stop your thyroid medication without consulting your provider", "If you have a thyroid nodule, follow-up imaging is important even if the initial biopsy was benign"],
    examPearls: ["TSH is the single best screening test for thyroid dysfunction — always order first", "Inverse relationship: high TSH = hypothyroid; low TSH = hyperthyroid", "RAIU scan differentiates causes of hyperthyroidism: high uptake (Graves') vs low uptake (thyroiditis)", "Myxedema coma treatment: IV levothyroxine + stress-dose hydrocortisone (must give steroids before thyroid hormone to prevent adrenal crisis)", "Methimazole is teratogenic in first trimester — use PTU instead", "Subclinical hypothyroidism with anti-TPO antibodies progresses to overt hypothyroidism at ~4.3% per year"],
    commonTrapAnswers: ["Ordering free T4 first instead of TSH (TSH is the screening test)", "Starting high-dose levothyroxine in elderly/cardiac patients (risk of arrhythmias and angina)", "Using methimazole in first trimester of pregnancy (teratogenic — use PTU)", "Rechecking TSH 2 weeks after dose change (need 6-8 weeks for steady state)", "Treating euthyroid sick syndrome (abnormal thyroid tests in acute illness resolve when illness resolves)"],
    practiceQuestions: [
      { question: "A 50-year-old female with newly diagnosed hypothyroidism (TSH 42, free T4 0.3) has a history of coronary artery disease. What is the appropriate starting dose of levothyroxine?", options: ["1.6 mcg/kg/day (full replacement dose)", "25 mcg daily", "100 mcg daily", "200 mcg daily"], correctIndex: 1, rationale: "In patients with cardiac disease, levothyroxine should be started at a low dose (25 mcg daily, or even 12.5 mcg) and increased gradually by 12.5-25 mcg every 4-6 weeks. Starting at full replacement dose risks precipitating angina, arrhythmias, or MI by suddenly increasing metabolic demand. Despite her very low T4, slow titration is safer in cardiac patients.", isFree: true },
      { question: "A 30-year-old female with Graves' disease is 6 weeks pregnant. She is currently on methimazole 20 mg daily. What medication change is indicated?", options: ["Continue methimazole — it is safe in pregnancy", "Switch to PTU for the first trimester", "Discontinue all anti-thyroid medications", "Switch to radioactive iodine therapy"], correctIndex: 1, rationale: "Methimazole is associated with teratogenic effects in the first trimester (aplasia cutis, choanal atresia, esophageal atresia). PTU is preferred in the first trimester of pregnancy. After the first trimester, switching back to methimazole is recommended because PTU has a higher risk of hepatotoxicity. RAI is absolutely contraindicated in pregnancy.", isFree: true },
      { question: "A patient on levothyroxine reports taking her medication with her morning calcium supplement and breakfast. TSH remains elevated despite dose increases. What is the most likely cause?", options: ["Levothyroxine resistance syndrome", "Non-adherence to medication", "Impaired absorption due to calcium and food", "Need for T3 supplementation"], correctIndex: 2, rationale: "Calcium significantly impairs levothyroxine absorption and should be separated by at least 4 hours. Food also reduces absorption by 20-30%. Levothyroxine should be taken on an empty stomach, 30-60 minutes before breakfast, with water only. Other absorption-impairing substances include iron, PPIs, soy, and cholestyramine. Correcting the timing often resolves persistently elevated TSH.", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between Hashimoto's and Graves' disease?", answer: "Both are autoimmune thyroid diseases but with opposite effects. Hashimoto's: autoimmune destruction of thyroid tissue (anti-TPO antibodies) → hypothyroidism. Graves': stimulating antibodies (TRAb/TSI) activate TSH receptors → hyperthyroidism. Hashimoto's may initially present with transient hyperthyroidism (hashitoxicosis) before progressing to permanent hypothyroidism. Graves' has unique features including ophthalmopathy, pretibial myxedema, and thyroid acropachy." },
      { question: "When should thyroid nodules be biopsied?", answer: "FNA is recommended based on ultrasound features (ACR TI-RADS) and size: TR5 (highly suspicious) ≥1 cm, TR4 (moderately suspicious) ≥1.5 cm, TR3 (mildly suspicious) ≥2.5 cm. Pure cysts and nodules <1 cm generally do not require FNA. Always check TSH first — if TSH is low (suggesting a functional/hot nodule), perform RAIU scan before FNA, as functional nodules are rarely malignant." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Levothyroxine", href: "/np-exam/medications/levothyroxine", type: "medication" },
      { title: "TSH/T3/T4 Lab Values", href: "/np-exam/lab-values/tsh-t3-t4", type: "lab-value" },
      { title: "Hypothyroid vs Hyperthyroid", href: "/np-exam/compare/hypothyroid-vs-hyperthyroid", type: "comparison" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  }
];

export const npExamLabValues: NpExamLabValuePage[] = [
  {
    slug: "potassium",
    contentType: "lab-value",
    tier: "np",
    name: "Potassium (K+)",
    fullName: "Serum Potassium",
    metaTitle: "Potassium (K+) Lab Values for Nurse Practitioners: Interpretation & Management (2025)",
    metaDescription: "NP-level potassium interpretation guide covering hyperkalemia and hypokalemia causes, ECG changes, emergency management, medication-induced imbalances, and clinical decision-making.",
    keywords: "potassium NP exam, hyperkalemia management NP, hypokalemia nurse practitioner, K+ interpretation, potassium ECG changes",
    normalRangeUS: { value: "3.5-5.0", unit: "mEq/L" },
    normalRangeCA: { value: "3.5-5.0", unit: "mmol/L" },
    overview: "Potassium is the primary intracellular cation critical for maintaining resting membrane potential, cardiac conduction, and neuromuscular function. Even small deviations from normal can cause life-threatening cardiac arrhythmias. NPs must understand the common medications that affect potassium levels and the clinical contexts that require urgent intervention.",
    highSignificance: [
      { condition: "ACEi/ARB + spironolactone combination", explanation: "Dual RAAS blockade with MRA significantly increases hyperkalemia risk, especially with CKD. Monitor K+ within 1 week of starting and after dose changes." },
      { condition: "Acute kidney injury / CKD", explanation: "Reduced renal potassium excretion is the most common cause of sustained hyperkalemia. eGFR <30 significantly increases risk." },
      { condition: "DKA (before insulin)", explanation: "Total body K+ is depleted but serum K+ may be normal/high due to acidosis-driven extracellular shift. K+ drops rapidly with insulin — must ensure K+ ≥3.3 before insulin." },
      { condition: "Metabolic acidosis", explanation: "H+ enters cells in exchange for K+, causing transcellular shift and elevated serum K+. Treat the underlying acidosis." },
      { condition: "Tissue destruction (rhabdomyolysis, tumor lysis, hemolysis)", explanation: "Massive cellular release of potassium; may cause severe hyperkalemia requiring emergent treatment." }
    ],
    lowSignificance: [
      { condition: "Diuretic use (thiazides, loop diuretics)", explanation: "Most common cause of hypokalemia in primary care. Thiazides and furosemide increase renal K+ wasting. Monitor and supplement as needed." },
      { condition: "GI losses (vomiting, diarrhea, NG suction)", explanation: "Direct K+ loss and metabolic alkalosis causing renal K+ wasting. Replace K+ aggressively in severe GI losses." },
      { condition: "Insulin administration", explanation: "Insulin drives K+ intracellularly — used therapeutically in hyperkalemia but can cause dangerous hypokalemia if K+ not monitored." },
      { condition: "Primary aldosteronism", explanation: "Aldosterone causes renal K+ excretion. Suspect in resistant hypertension with unprovoked hypokalemia. Screen with aldosterone/renin ratio." },
      { condition: "Hypomagnesemia", explanation: "Magnesium deficiency causes refractory hypokalemia — always check and correct Mg2+ when K+ is low and not responding to replacement." }
    ],
    diagnosticWorkupImplications: [
      "Hyperkalemia >6.0 or with ECG changes: emergent treatment (calcium gluconate for cardiac stabilization, insulin + D50 for intracellular shift, kayexalate/patiromer for elimination)",
      "ECG changes with hyperkalemia: peaked T waves → widened QRS → sine wave → cardiac arrest",
      "Hypokalemia <3.0: risk of life-threatening arrhythmias (torsades de pointes); IV replacement needed",
      "Pseudohyperkalemia: hemolyzed sample, prolonged tourniquet, fist clenching — repeat test if clinical picture inconsistent"
    ],
    whenToOrder: [
      "Baseline before starting ACEi, ARB, MRA, or SGLT2 inhibitor",
      "1-2 weeks after starting or dose-changing ACEi/ARB/MRA",
      "With new diuretic prescription or dose change",
      "In DKA/HHS — check hourly during treatment",
      "Any patient with arrhythmia, muscle weakness, or AKI",
      "All patients with CKD (at least annually, more often if on RAAS inhibitors)"
    ],
    associatedDifferentials: [
      "Hyperkalemia: CKD, medication-induced (ACEi/ARB/MRA/TMP-SMX/NSAIDs), adrenal insufficiency, DKA, rhabdomyolysis",
      "Hypokalemia: diuretics, GI losses, primary aldosteronism, renal tubular acidosis, hypomagnesemia"
    ],
    associatedConditions: ["Heart failure", "Chronic kidney disease", "DKA/HHS", "Hypertension (medication-related)", "Adrenal insufficiency"],
    nursingImplications: [
      "Never administer IV potassium faster than 10-20 mEq/hour via peripheral line (risk of cardiac arrest)",
      "Potassium must be diluted — NEVER give undiluted IV push",
      "Monitor cardiac rhythm during IV potassium replacement",
      "Check K+ before and during DKA insulin infusion",
      "Educate patients on dietary potassium sources (bananas, oranges, potatoes, tomatoes)"
    ],
    examAlerts: [
      "In DKA: K+ must be ≥3.3 before starting insulin — this is the most commonly tested potassium concept",
      "Peaked T waves are the earliest ECG change in hyperkalemia",
      "Hypokalemia and hypomagnesemia often coexist — correct Mg2+ first or K+ replacement will be ineffective",
      "ACEi + ARB + spironolactone = high hyperkalemia risk — never combine ACEi + ARB",
      "Thiazide diuretics cause hypokalemia; potassium-sparing diuretics (spironolactone, amiloride) cause hyperkalemia"
    ],
    practiceQuestions: [
      { question: "A patient on lisinopril and spironolactone has a potassium of 5.8 mEq/L. ECG shows peaked T waves. What is the immediate priority?", options: ["Discontinue both medications", "Administer IV calcium gluconate", "Give oral kayexalate", "Recheck potassium to confirm"], correctIndex: 1, rationale: "With K+ 5.8 and ECG changes (peaked T waves), this is an emergency. IV calcium gluconate is the immediate priority as it stabilizes the cardiac membrane and prevents arrhythmia within 1-3 minutes (does not lower K+ but protects the heart). Then give insulin + D50 to shift K+ intracellularly, and discontinue/hold the offending medications.", isFree: true },
      { question: "A patient with hypokalemia (K+ 2.8) is not responding to IV potassium replacement. What should be checked?", options: ["Calcium level", "Magnesium level", "Phosphorus level", "Sodium level"], correctIndex: 1, rationale: "Refractory hypokalemia often indicates concurrent hypomagnesemia. Magnesium is required for proper function of the Na+/K+-ATPase pump and renal potassium conservation. If Mg2+ is low, potassium replacement will be ineffective until magnesium is corrected. Always check and replace Mg2+ in hypokalemia that does not respond to K+ supplementation.", isFree: true },
      { question: "Which medication combination poses the highest risk for hyperkalemia?", options: ["Amlodipine + hydrochlorothiazide", "Lisinopril + spironolactone + TMP-SMX", "Metformin + glipizide", "Atorvastatin + aspirin"], correctIndex: 1, rationale: "This triple combination is extremely high risk: lisinopril (ACEi reduces aldosterone → ↓K+ excretion), spironolactone (blocks aldosterone receptor → ↓K+ excretion), and TMP-SMX (blocks ENaC in collecting duct → ↓K+ excretion). This combination can cause fatal hyperkalemia, especially in patients with CKD or diabetes.", isFree: true }
    ],
    faqs: [
      { question: "What ECG changes indicate hyperkalemia?", answer: "Progressive ECG changes with rising potassium: peaked T waves (earliest, K+ 5.5-6.5), prolonged PR interval, widened QRS complex (K+ 6.5-7.0), loss of P waves, sine wave pattern (K+ >8.0), and ultimately cardiac arrest (VF or asystole). The presence of any ECG changes mandates emergent treatment regardless of the absolute potassium level." },
      { question: "How fast can IV potassium be administered?", answer: "Via peripheral IV: maximum 10-20 mEq/hour in concentrations not exceeding 40 mEq/L. Via central line: up to 40 mEq/hour in concentrations up to 80 mEq/L with continuous cardiac monitoring. Oral replacement is preferred when possible: 40-80 mEq/day for mild-moderate hypokalemia. Never give IV potassium as an undiluted push — it is immediately fatal." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Heart Failure", href: "/np-exam/conditions/heart-failure", type: "condition" },
      { title: "DKA/HHS", href: "/np-exam/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "ACE Inhibitors", href: "/np-exam/medications/ace-inhibitors", type: "medication" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "sodium",
    contentType: "lab-value", tier: "np", name: "Sodium (Na+)", fullName: "Serum Sodium",
    metaTitle: "Sodium (Na+) Lab Values for Nurse Practitioners: Hypo/Hypernatremia Management (2025)",
    metaDescription: "NP-level sodium interpretation covering hyponatremia classification, SIADH vs cerebral salt wasting, correction rates, osmolality assessment, and clinical management.",
    keywords: "sodium NP exam, hyponatremia nurse practitioner, hypernatremia management NP, SIADH, sodium correction rate",
    normalRangeUS: { value: "136-145", unit: "mEq/L" }, normalRangeCA: { value: "136-145", unit: "mmol/L" },
    overview: "Sodium is the primary extracellular cation and the main determinant of serum osmolality. Sodium disorders are water balance disorders — hyponatremia reflects relative water excess, and hypernatremia reflects relative water deficit. Rapid correction of either can cause severe neurological complications.",
    highSignificance: [
      { condition: "Dehydration / Free water deficit", explanation: "Most common cause of hypernatremia; inability to access water (elderly, altered mental status, intubated patients)" },
      { condition: "Diabetes insipidus", explanation: "Central (insufficient ADH) or nephrogenic (renal ADH resistance) causing massive free water loss and hypernatremia" },
      { condition: "Osmotic diuresis", explanation: "Hyperglycemia, mannitol, or contrast dye causing excessive water loss relative to sodium" }
    ],
    lowSignificance: [
      { condition: "SIADH", explanation: "Excess ADH causes water retention and dilutional hyponatremia with concentrated urine (urine osmolality >100). Common causes: CNS disorders, pulmonary disease, medications (SSRIs, carbamazepine)" },
      { condition: "Heart failure", explanation: "Neurohormonal activation causes water retention exceeding sodium retention → dilutional hyponatremia. Low Na+ in HF indicates poor prognosis." },
      { condition: "Thiazide diuretics", explanation: "Most common medication cause of hyponatremia; impairs diluting ability of the kidney. More common than loop diuretics causing hyponatremia." },
      { condition: "Psychogenic polydipsia", explanation: "Excessive free water intake overwhelming renal diluting capacity; often in psychiatric patients" },
      { condition: "Adrenal insufficiency", explanation: "Cortisol deficiency impairs free water excretion; associated with hyperkalemia (unlike SIADH)" }
    ],
    diagnosticWorkupImplications: [
      "Classify hyponatremia by volume status: hypovolemic (depleted), euvolemic (SIADH), or hypervolemic (HF, cirrhosis, nephrotic syndrome)",
      "Check serum osmolality: low (<280) = true hyponatremia; normal = pseudohyponatremia (hyperlipidemia, hyperproteinemia); high = hyperglycemia",
      "Check urine osmolality and urine Na+: urine osm >100 and urine Na >40 in euvolemic hyponatremia = SIADH",
      "Correction rate: maximum 8-10 mEq/L in 24 hours for chronic hyponatremia (risk of osmotic demyelination syndrome if faster)"
    ],
    whenToOrder: ["Any patient with altered mental status, seizures, or neurological symptoms", "Patients on thiazide diuretics, SSRIs, or carbamazepine", "Heart failure patients (prognostic marker)", "Pre-operative assessment", "Monitoring during IV fluid administration"],
    associatedDifferentials: ["Hyponatremia: SIADH, HF, cirrhosis, thiazide diuretics, adrenal insufficiency, hypothyroidism, psychogenic polydipsia", "Hypernatremia: dehydration, diabetes insipidus, osmotic diuresis"],
    associatedConditions: ["Heart failure", "SIADH", "Liver cirrhosis", "Adrenal insufficiency"],
    nursingImplications: ["Monitor neurological status closely during sodium correction", "Ensure correction rate does not exceed 8-10 mEq/L per 24 hours for chronic hyponatremia", "Assess volume status (JVP, edema, orthostatics) to classify hyponatremia", "Seizure precautions for Na+ <120 mEq/L"],
    examAlerts: [
      "Maximum correction rate for chronic hyponatremia: 8-10 mEq/L in 24 hours — exceeding this causes osmotic demyelination syndrome (central pontine myelinolysis)",
      "SIADH: euvolemic hyponatremia with concentrated urine (urine osm >100, urine Na >40)",
      "Hyponatremia in heart failure is dilutional — treat the HF (diuretics, fluid restriction), not with NS",
      "Thiazides cause hyponatremia more than loop diuretics (impair diluting segment vs loop affects concentrating mechanism)",
      "Severe symptomatic hyponatremia (Na+ <120 with seizures/coma): give 3% hypertonic saline to raise Na+ by 4-6 mEq/L acutely"
    ],
    practiceQuestions: [
      { question: "A 75-year-old with heart failure has a sodium of 128 mEq/L. She is asymptomatic. What is the most appropriate management?", options: ["Administer 3% hypertonic saline", "Fluid restriction to 1.5 L/day and optimize HF medications", "Administer normal saline bolus", "Start tolvaptan immediately"], correctIndex: 1, rationale: "Hyponatremia in heart failure is dilutional (hypervolemic hyponatremia from excess ADH and water retention). Treatment is fluid restriction and optimizing HF therapy (diuretics, ACEi/ARB, SGLT2i). Normal saline would worsen volume overload. Hypertonic saline is reserved for severe symptomatic hyponatremia. Tolvaptan (vasopressin antagonist) is second-line.", isFree: true },
      { question: "A patient with chronic hyponatremia (Na+ 118) is being corrected. After 24 hours, Na+ has risen from 118 to 131 mEq/L. What complication is the patient at risk for?", options: ["Cerebral edema", "Osmotic demyelination syndrome (central pontine myelinolysis)", "Hyperkalemia", "Rhabdomyolysis"], correctIndex: 1, rationale: "A rise of 13 mEq/L in 24 hours exceeds the safe correction rate (8-10 mEq/L per 24 hours for chronic hyponatremia). This puts the patient at risk for osmotic demyelination syndrome (ODS, formerly central pontine myelinolysis), which causes irreversible neurological damage including quadriplegia, dysarthria, and pseudobulbar palsy. If overcorrection is detected, lower sodium back with D5W or DDAVP.", isFree: true },
      { question: "Which lab findings are most consistent with SIADH?", options: ["Low serum osmolality, high urine osmolality (>100), high urine sodium (>40), euvolemic", "High serum osmolality, low urine osmolality, hypervolemic", "Low serum osmolality, low urine osmolality (<100), euvolemic", "Normal serum osmolality, high urine sodium, hypervolemic"], correctIndex: 0, rationale: "SIADH is characterized by euvolemic hyponatremia with: low serum osmolality (<280), inappropriately concentrated urine (osmolality >100, often >300), elevated urine sodium (>40 mEq/L), and normal adrenal and thyroid function. The key is that the urine is inappropriately concentrated despite low serum osmolality — the kidneys should be producing dilute urine but ADH prevents it.", isFree: true }
    ],
    faqs: [
      { question: "What is the safe correction rate for chronic hyponatremia?", answer: "The safe correction rate for chronic hyponatremia (>48 hours duration or unknown duration) is 8-10 mEq/L in 24 hours and no more than 18 mEq/L in 48 hours. Exceeding these rates risks osmotic demyelination syndrome. For acute hyponatremia (<48 hours, known onset), faster correction is safe because brain adaptation has not occurred." },
      { question: "How do you differentiate between causes of hyponatremia?", answer: "Assess volume status first: hypovolemic (dry mucous membranes, orthostatic hypotension → GI/renal losses), euvolemic (normal exam → SIADH, hypothyroidism, adrenal insufficiency), hypervolemic (edema, JVD → HF, cirrhosis, nephrotic syndrome). Then check serum and urine osmolality and urine sodium to further narrow the diagnosis." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Heart Failure", href: "/np-exam/conditions/heart-failure", type: "condition" },
      { title: "Potassium", href: "/np-exam/lab-values/potassium", type: "lab-value" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "abgs", contentType: "lab-value", tier: "np", name: "ABGs", fullName: "Arterial Blood Gases",
    metaTitle: "ABG Interpretation for Nurse Practitioners: Acid-Base Disorders & Clinical Application (2025)",
    metaDescription: "NP-level ABG interpretation guide covering metabolic and respiratory acidosis/alkalosis, compensation, anion gap calculation, and clinical decision-making.",
    keywords: "ABG interpretation NP, arterial blood gas nurse practitioner, acid base disorders NP exam, anion gap metabolic acidosis, respiratory acidosis NP",
    normalRangeUS: { value: "pH 7.35-7.45, PaCO2 35-45, HCO3 22-26, PaO2 80-100", unit: "mmHg" },
    normalRangeCA: { value: "pH 7.35-7.45, PaCO2 35-45, HCO3 22-26, PaO2 80-100", unit: "mmHg" },
    overview: "ABG interpretation is an essential NP skill for managing respiratory failure, DKA, sepsis, and other acute conditions. The systematic approach: (1) Assess pH, (2) Identify primary disorder, (3) Calculate expected compensation, (4) Calculate anion gap if metabolic acidosis, (5) Determine clinical significance.",
    highSignificance: [
      { condition: "Respiratory acidosis (pH low, PaCO2 high)", explanation: "Hypoventilation: COPD exacerbation, opioid overdose, neuromuscular disease, severe asthma. Acute vs chronic distinguished by compensation (acute: HCO3 rises 1 per 10 PaCO2; chronic: HCO3 rises 3.5 per 10 PaCO2)." },
      { condition: "Metabolic acidosis with elevated anion gap", explanation: "MUDPILES: Methanol, Uremia, DKA, Propylene glycol, INH/Iron, Lactic acidosis, Ethylene glycol, Salicylates" },
      { condition: "Respiratory alkalosis (pH high, PaCO2 low)", explanation: "Hyperventilation: anxiety, PE, early sepsis, pregnancy, salicylate toxicity (early), hepatic encephalopathy" }
    ],
    lowSignificance: [
      { condition: "Metabolic alkalosis (pH high, HCO3 high)", explanation: "Vomiting/NG suction (loss of HCl), diuretic use, excess alkali administration. Check urine chloride to classify." },
      { condition: "Normal anion gap metabolic acidosis", explanation: "HARDASS: Hyperalimentation, Addison's, RTA, Diarrhea, Acetazolamide, Spironolactone, Saline (excessive NS)" }
    ],
    diagnosticWorkupImplications: [
      "Calculate anion gap: Na - (Cl + HCO3); normal 8-12. Elevated AG narrows differential to MUDPILES.",
      "Calculate delta-delta ratio for mixed disorders: delta AG / delta HCO3. <1 = additional non-AG metabolic acidosis; >2 = additional metabolic alkalosis.",
      "Winter's formula for expected PaCO2 compensation in metabolic acidosis: PaCO2 = 1.5(HCO3) + 8 ± 2. If actual PaCO2 differs, a second disorder is present.",
      "Chronic COPD patients have compensated respiratory acidosis at baseline — their normal pH is slightly low with elevated HCO3"
    ],
    whenToOrder: ["Acute respiratory distress or failure", "DKA/HHS (monitor treatment response)", "Suspected PE or acute respiratory deterioration", "Sepsis or shock (lactate assessment)", "Altered mental status with unknown cause", "Monitoring ventilator settings", "COPD exacerbation to assess need for NIV or intubation"],
    associatedDifferentials: ["AGMA: DKA, lactic acidosis, uremia, toxic ingestions", "Respiratory acidosis: COPD, asthma, opioid overdose, neuromuscular disease", "Respiratory alkalosis: PE, anxiety, early sepsis, pregnancy"],
    associatedConditions: ["COPD", "DKA", "Sepsis", "Respiratory failure", "Pulmonary embolism"],
    nursingImplications: ["Apply pressure to arterial puncture site for 5 minutes post-draw", "Ensure sample is on ice and analyzed within 30 minutes", "Correlate ABG with clinical picture — isolated lab values can be misleading", "Monitor respiratory status continuously in patients with acid-base disorders"],
    examAlerts: [
      "Step-wise ABG interpretation: pH → primary disorder → compensation → anion gap → delta-delta",
      "Anion gap = Na - (Cl + HCO3); normal 8-12. Elevated = MUDPILES causes",
      "Winter's formula: PaCO2 = 1.5(HCO3) + 8 ± 2 — checks for appropriate respiratory compensation",
      "In COPD, target SpO2 88-92% — chronic CO2 retainers rely on hypoxic drive",
      "DKA ABG: low pH, low HCO3, low PaCO2 (compensatory hyperventilation = Kussmaul respirations), elevated AG"
    ],
    practiceQuestions: [
      { question: "A DKA patient has the following ABG: pH 7.22, PaCO2 24, HCO3 10, PaO2 96. Anion gap is 22. What is the primary acid-base disorder?", options: ["Respiratory acidosis", "Anion gap metabolic acidosis with respiratory compensation", "Mixed metabolic and respiratory acidosis", "Respiratory alkalosis"], correctIndex: 1, rationale: "pH 7.22 = acidosis. HCO3 10 = metabolic cause. PaCO2 24 = respiratory compensation (hyperventilation/Kussmaul breathing). AG 22 = elevated (normal 8-12). Winter's formula: expected PaCO2 = 1.5(10) + 8 ± 2 = 23 ± 2 → actual PaCO2 of 24 is within expected range, confirming appropriate compensation. This is pure anion gap metabolic acidosis (from ketoacids in DKA) with appropriate respiratory compensation.", isFree: true },
      { question: "A COPD patient presents with pH 7.32, PaCO2 68, HCO3 34. Is this acute or chronic respiratory acidosis?", options: ["Acute — no compensation present", "Chronic — appropriate metabolic compensation (HCO3 elevated)", "Mixed respiratory and metabolic acidosis", "Respiratory alkalosis"], correctIndex: 1, rationale: "This is chronic respiratory acidosis. PaCO2 68 (elevated by 23 above normal 45). In chronic respiratory acidosis, HCO3 rises by 3.5 for every 10 mmHg rise in PaCO2: expected HCO3 = 24 + (3.5 × 2.3) = 24 + 8 = ~32 (actual 34, close). In acute respiratory acidosis, HCO3 would only rise by 1 per 10 → expected 26.3. The degree of compensation confirms chronicity — this is a COPD patient's baseline.", isFree: true },
      { question: "A patient has pH 7.48, PaCO2 30, HCO3 22. What is the primary disorder?", options: ["Metabolic alkalosis", "Respiratory alkalosis", "Compensated metabolic acidosis", "Normal ABG"], correctIndex: 1, rationale: "pH 7.48 = alkalosis. PaCO2 30 = low (respiratory alkalosis). HCO3 22 = normal (minimal or no metabolic compensation yet, suggesting acute process). This is acute respiratory alkalosis. Common causes include hyperventilation from anxiety, pain, PE, early sepsis, or CNS pathology. If chronic, HCO3 would be lower (5 mEq/L drop per 10 mmHg decrease in PaCO2).", isFree: true }
    ],
    faqs: [
      { question: "What is the step-by-step approach to ABG interpretation?", answer: "1) Look at pH: <7.35 = acidosis, >7.45 = alkalosis. 2) Identify primary disorder: if pH is low, check if PaCO2 is high (respiratory acidosis) or HCO3 is low (metabolic acidosis). 3) Assess compensation: is the other value moving in the expected direction? 4) Calculate anion gap if metabolic acidosis (AG = Na - Cl - HCO3). 5) If AG is elevated, calculate delta-delta to check for additional disorders." },
      { question: "What is the anion gap and why does it matter?", answer: "Anion gap (AG) = Na - (Cl + HCO3), normally 8-12. An elevated AG indicates the presence of unmeasured anions (ketoacids, lactic acid, toxic alcohols, uremic toxins). The mnemonic MUDPILES covers the causes. A normal AG metabolic acidosis (NAGMA) has different causes (diarrhea, RTA, excessive saline). This distinction is critical for diagnosis and treatment." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "COPD", href: "/np-exam/conditions/copd", type: "condition" },
      { title: "DKA/HHS", href: "/np-exam/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "Potassium", href: "/np-exam/lab-values/potassium", type: "lab-value" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "a1c", contentType: "lab-value", tier: "np", name: "A1C", fullName: "Hemoglobin A1C (Glycated Hemoglobin)",
    metaTitle: "A1C Lab Values for Nurse Practitioners: Targets, Interpretation & Clinical Use (2025)",
    metaDescription: "NP-level A1C interpretation guide covering diagnostic thresholds, individualized targets, factors affecting accuracy, and medication management decisions.",
    keywords: "A1C NP exam, hemoglobin A1C nurse practitioner, A1C target diabetes, glycated hemoglobin interpretation NP",
    normalRangeUS: { value: "<5.7%", unit: "%" }, normalRangeCA: { value: "<5.7% / <39", unit: "% / mmol/mol" },
    overview: "A1C reflects average blood glucose over the preceding 2-3 months (lifespan of red blood cells). It is the primary monitoring tool for diabetes management and is used for both diagnosis (≥6.5%) and treatment target assessment. NPs must understand factors that affect A1C accuracy and how to individualize targets.",
    highSignificance: [
      { condition: "Uncontrolled diabetes mellitus", explanation: "A1C ≥9% indicates significantly elevated average glucose (~212 mg/dL). May warrant insulin initiation or aggressive therapy adjustment." },
      { condition: "Increased cardiovascular risk", explanation: "Every 1% reduction in A1C is associated with ~14% reduction in MI risk and ~37% reduction in microvascular complications (UKPDS)." },
      { condition: "Falsely elevated A1C", explanation: "Iron deficiency anemia, B12/folate deficiency (reduced RBC turnover → older cells with more glycation), splenectomy, uremia." }
    ],
    lowSignificance: [
      { condition: "Overtreatment/hypoglycemia risk", explanation: "A1C <6.5% in patients on insulin or sulfonylureas may indicate over-treatment with hypoglycemia risk, especially in elderly." },
      { condition: "Falsely low A1C", explanation: "Hemolytic anemia, recent transfusion, sickle cell disease/trait, chronic liver disease (increased RBC turnover → younger cells)." }
    ],
    diagnosticWorkupImplications: [
      "Diagnostic thresholds: <5.7% normal, 5.7-6.4% prediabetes, ≥6.5% diabetes (confirm with repeat testing if asymptomatic)",
      "Unreliable in hemoglobinopathies (sickle cell, thalassemia), recent transfusion, iron/B12 deficiency — use fructosamine or CGM instead",
      "Correlation: A1C 7% ≈ avg glucose 154 mg/dL; A1C 8% ≈ 183; A1C 9% ≈ 212; A1C 10% ≈ 240"
    ],
    whenToOrder: ["Diagnosis of diabetes (confirm ≥6.5% on two occasions)", "Every 3 months when adjusting diabetes therapy", "Every 6 months once at target", "Annual screening in high-risk patients (obesity, family history, gestational diabetes history, prediabetes)"],
    associatedDifferentials: ["Elevated: diabetes (type 1, type 2, LADA), prediabetes, conditions that prolong RBC lifespan (iron deficiency)", "Low: conditions that shorten RBC lifespan (hemolytic anemia, blood loss, sickle cell)"],
    associatedConditions: ["Type 1 diabetes", "Type 2 diabetes", "Prediabetes", "Gestational diabetes (not recommended for diagnosis — use OGTT)"],
    nursingImplications: ["No fasting required for A1C testing", "Educate patients on the meaning of A1C and their individual target", "Discuss factors that may make A1C unreliable for their specific situation"],
    examAlerts: [
      "A1C ≥6.5% = diabetes diagnosis (confirm on two separate tests if asymptomatic)",
      "A1C target <7% for most adults; <8% for elderly or complex comorbidities (individualize)",
      "A1C is unreliable in hemoglobinopathies, recent transfusion, and hemolytic anemia — use fructosamine",
      "UKPDS: every 1% reduction in A1C → 14% reduction in MI, 37% reduction in microvascular complications",
      "A1C does not reflect glucose variability or hypoglycemia — CGM provides this information"
    ],
    practiceQuestions: [
      { question: "A 78-year-old with T2DM, CKD stage 4, and history of severe hypoglycemia has an A1C of 6.2% on glipizide and insulin. What is the appropriate action?", options: ["Continue current regimen — A1C is at target", "Reduce insulin and/or discontinue glipizide — A1C is too low for this patient", "Add metformin to improve control", "Switch to a higher A1C target and add an SGLT2 inhibitor"], correctIndex: 1, rationale: "For an elderly patient with CKD and history of severe hypoglycemia, an A1C of 6.2% is too aggressive. The ADA recommends a less stringent target (<8%) for patients with limited life expectancy, extensive comorbidities, or history of severe hypoglycemia. Glipizide (sulfonylurea) carries high hypoglycemia risk especially in CKD. The regimen should be reduced to achieve a safer target.", isFree: true },
      { question: "A patient with sickle cell trait has a measured A1C of 5.9%. Is this reliable?", options: ["Yes — sickle cell trait does not affect A1C", "No — hemoglobinopathies can interfere with A1C assays, potentially giving falsely low results", "No — sickle cell trait always causes falsely high A1C", "Yes — A1C is accurate regardless of hemoglobin variants"], correctIndex: 1, rationale: "Hemoglobin variants (sickle cell trait/disease, thalassemia) can interfere with A1C assays, typically causing falsely low values due to increased hemolysis and shortened RBC lifespan. The degree of interference depends on the assay method used. For patients with hemoglobinopathies, alternative monitoring methods such as fructosamine (reflects 2-3 week average) or continuous glucose monitoring should be used.", isFree: true }
    ],
    faqs: [
      { question: "What A1C target should NPs use for their patients?", answer: "ADA recommends A1C <7% for most non-pregnant adults. More stringent (<6.5%) may be appropriate for younger patients without significant hypoglycemia risk. Less stringent (<8%) is appropriate for elderly, extensive comorbidities, limited life expectancy, or history of severe hypoglycemia. The target should be individualized based on patient-specific factors, shared decision-making, and risk of hypoglycemia." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "DKA/HHS", href: "/np-exam/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "Metformin", href: "/np-exam/medications/metformin", type: "medication" },
      { title: "Insulin", href: "/np-exam/medications/insulin", type: "medication" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "tsh-t3-t4", contentType: "lab-value", tier: "np", name: "TSH/T3/T4", fullName: "Thyroid Function Tests (TSH, Free T4, Free T3)",
    metaTitle: "TSH, Free T4, Free T3 for Nurse Practitioners: Thyroid Lab Interpretation (2025)",
    metaDescription: "NP-level thyroid lab interpretation covering TSH as first-line screening, subclinical disease, medication effects, and pregnancy-specific ranges.",
    keywords: "TSH interpretation NP, thyroid labs nurse practitioner, free T4 NP exam, thyroid function test interpretation, subclinical thyroid disease",
    normalRangeUS: { value: "TSH 0.4-4.5 mIU/L, fT4 0.8-1.8 ng/dL, fT3 2.3-4.2 pg/mL", unit: "mIU/L, ng/dL, pg/mL" },
    normalRangeCA: { value: "TSH 0.4-4.5 mIU/L, fT4 10-23 pmol/L, fT3 3.5-6.5 pmol/L", unit: "mIU/L, pmol/L" },
    overview: "TSH is the most sensitive first-line screening test for thyroid dysfunction due to the log-linear relationship with thyroid hormones — small changes in T4/T3 cause large TSH changes. Free T4 and T3 confirm and quantify the dysfunction. Understanding the TSH-T4 axis is essential for diagnosis, monitoring, and medication management.",
    highSignificance: [
      { condition: "Elevated TSH + low free T4 = overt hypothyroidism", explanation: "Most commonly Hashimoto's. Requires levothyroxine replacement. Full replacement dose ~1.6 mcg/kg/day." },
      { condition: "Elevated TSH + normal free T4 = subclinical hypothyroidism", explanation: "Treat if TSH >10, or TSH 5-10 with symptoms, positive anti-TPO, pregnancy, or infertility." },
      { condition: "Low TSH + high free T4/T3 = overt hyperthyroidism", explanation: "Graves' disease, toxic nodule, or thyroiditis. RAIU scan differentiates etiology. Treatment depends on cause." }
    ],
    lowSignificance: [
      { condition: "Low TSH + normal T4/T3 = subclinical hyperthyroidism", explanation: "Treat if TSH <0.1 in elderly, osteoporosis, or cardiac disease. Monitor if TSH 0.1-0.4." },
      { condition: "Central hypothyroidism", explanation: "Low/normal TSH with low T4 — pituitary or hypothalamic cause. TSH unreliable for monitoring; follow free T4 instead." }
    ],
    diagnosticWorkupImplications: [
      "Always start with TSH — it is the most sensitive and specific screening test",
      "If TSH abnormal, order free T4 (and free T3 if hyperthyroid — T3 thyrotoxicosis possible)",
      "Anti-TPO for Hashimoto's confirmation; TRAb/TSI for Graves' confirmation",
      "RAIU scan to differentiate hyperthyroidism causes (not for hypothyroidism)",
      "Biotin supplements interfere with thyroid assays — hold for 2-3 days before testing"
    ],
    whenToOrder: ["Symptoms of thyroid dysfunction (fatigue, weight changes, palpitations, cold/heat intolerance)", "New-onset depression or anxiety", "New-onset atrial fibrillation", "Pregnancy (first prenatal visit; trimester-specific targets)", "Monitoring levothyroxine therapy (6-8 weeks after dose change)", "Monitoring anti-thyroid drug therapy (every 4-6 weeks initially)"],
    associatedDifferentials: ["Elevated TSH: Hashimoto's, iodine deficiency, post-thyroidectomy, lithium, amiodarone, recovery from non-thyroidal illness", "Suppressed TSH: Graves', toxic nodule, thyroiditis, excessive levothyroxine, pregnancy (hCG effect)"],
    associatedConditions: ["Hashimoto's thyroiditis", "Graves' disease", "Thyroid nodules", "Thyroid cancer"],
    nursingImplications: ["TSH requires 6-8 weeks to reach steady state after levothyroxine dose change — do not recheck too early", "Levothyroxine should be taken on empty stomach, separated from calcium/iron by 4 hours", "Patients on anti-thyroid drugs must report sore throat with fever immediately (agranulocytosis risk)"],
    examAlerts: [
      "TSH is the FIRST test to order for thyroid screening — not T4, not T3",
      "Inverse relationship: high TSH = low thyroid function; low TSH = high thyroid function",
      "TSH takes 6-8 weeks to reflect dose changes — timing is critical",
      "In pregnancy, TSH targets are trimester-specific: T1 0.1-2.5, T2 0.2-3.0, T3 0.3-3.0",
      "Biotin (in many supplements) can cause falsely low TSH and falsely high T4/T3 — hold before testing",
      "Euthyroid sick syndrome: abnormal labs in acute illness that normalize with recovery — do not treat"
    ],
    practiceQuestions: [
      { question: "A patient has TSH 12.4, free T4 1.1 (normal), and positive anti-TPO antibodies. What is the diagnosis and recommended management?", options: ["Overt hypothyroidism — start levothyroxine 100 mcg", "Subclinical hypothyroidism with Hashimoto's — start levothyroxine 50 mcg", "Euthyroid sick syndrome — observe", "Subclinical hypothyroidism — observe without treatment"], correctIndex: 1, rationale: "TSH 12.4 with normal free T4 is subclinical hypothyroidism. With TSH >10 AND positive anti-TPO antibodies (confirming Hashimoto's autoimmune etiology, with ~4.3%/year progression risk to overt disease), treatment with levothyroxine is recommended. Starting dose for subclinical disease is typically 25-50 mcg daily. Recheck TSH in 6-8 weeks.", isFree: true },
      { question: "A patient's thyroid labs show TSH 0.02, free T4 3.8, free T3 elevated. RAIU shows diffuse increased uptake. What is the diagnosis?", options: ["Toxic multinodular goiter", "Graves' disease", "Subacute thyroiditis", "Factitious hyperthyroidism"], correctIndex: 1, rationale: "Suppressed TSH with elevated T4/T3 confirms hyperthyroidism. RAIU with diffuse increased uptake is diagnostic of Graves' disease (autoimmune stimulation of the entire thyroid gland). Toxic MNG shows patchy uptake, thyroiditis shows decreased uptake (inflammation releases stored hormone without new production), and factitious hyperthyroidism shows low uptake with low thyroglobulin.", isFree: true }
    ],
    faqs: [
      { question: "Why is TSH the best screening test for thyroid disease?", answer: "TSH has a log-linear relationship with thyroid hormones — a 2-fold change in free T4 causes a 100-fold change in TSH. This makes TSH the most sensitive detector of thyroid dysfunction, often becoming abnormal before T4/T3 leave the normal range (subclinical disease). TSH is also the most standardized and reproducible thyroid assay." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Thyroid Disorders", href: "/np-exam/conditions/thyroid-disorders", type: "condition" },
      { title: "Levothyroxine", href: "/np-exam/medications/levothyroxine", type: "medication" },
      { title: "Hypothyroid vs Hyperthyroid", href: "/np-exam/compare/hypothyroid-vs-hyperthyroid", type: "comparison" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "lipid-panel", contentType: "lab-value", tier: "np", name: "Lipid Panel", fullName: "Lipid Panel (Total Cholesterol, LDL, HDL, Triglycerides)",
    metaTitle: "Lipid Panel Interpretation for Nurse Practitioners: Statin Prescribing Guide (2025)",
    metaDescription: "NP-level lipid panel interpretation covering LDL targets, ASCVD risk calculation, statin intensity selection, and evidence-based dyslipidemia management.",
    keywords: "lipid panel NP exam, cholesterol management nurse practitioner, statin prescribing NP, LDL target, ASCVD risk score NP",
    normalRangeUS: { value: "TC <200, LDL <100, HDL >40 (M) >50 (F), TG <150", unit: "mg/dL" },
    normalRangeCA: { value: "TC <5.2, LDL <2.6, HDL >1.0, TG <1.7", unit: "mmol/L" },
    overview: "The lipid panel is essential for cardiovascular risk assessment and guiding statin therapy. NPs must understand ASCVD risk calculation, statin benefit groups, intensity selection, and monitoring. Current guidelines focus on statin intensity rather than treating to specific LDL targets, though LDL thresholds guide additional therapy.",
    highSignificance: [
      { condition: "LDL ≥190 mg/dL", explanation: "High-intensity statin regardless of ASCVD risk score. Suspect familial hypercholesterolemia — genetic lipid disorder requiring aggressive treatment." },
      { condition: "Established ASCVD", explanation: "High-intensity statin for secondary prevention. If LDL remains ≥70 on maximally tolerated statin, add ezetimibe; if still ≥70, add PCSK9 inhibitor." },
      { condition: "Triglycerides ≥500 mg/dL", explanation: "Risk of acute pancreatitis. Treat with fibrate (fenofibrate), omega-3 fatty acids, and lifestyle modifications. Triglycerides 150-499: focus on LDL-lowering first." }
    ],
    lowSignificance: [
      { condition: "Low HDL (<40 M, <50 F)", explanation: "Independent CV risk factor but no evidence that pharmacologically raising HDL improves outcomes. Niacin and CETP inhibitors failed to show benefit despite raising HDL." }
    ],
    diagnosticWorkupImplications: [
      "Calculate 10-year ASCVD risk score (pooled cohort equations) for adults 40-75 to guide statin decisions",
      "Four statin benefit groups: (1) ASCVD, (2) LDL ≥190, (3) Diabetes age 40-75, (4) 10-year ASCVD risk ≥7.5%",
      "Fasting vs non-fasting: non-fasting is acceptable for screening; fasting preferred if triglycerides >400 or monitoring treatment"
    ],
    whenToOrder: ["Universal screening: all adults ≥20 every 4-6 years", "Annually in patients on statin therapy", "4-12 weeks after starting or adjusting statin dose", "Patients with diabetes, ASCVD, or family history of premature CVD", "Before starting medications that affect lipids (corticosteroids, atypical antipsychotics, antiretrovirals)"],
    associatedDifferentials: ["Elevated LDL: familial hypercholesterolemia, hypothyroidism, nephrotic syndrome, obstructive liver disease, medications (thiazides, corticosteroids)", "Elevated TG: diabetes, obesity, alcohol, medications, familial hypertriglyceridemia"],
    associatedConditions: ["Atherosclerotic cardiovascular disease", "Familial hypercholesterolemia", "Metabolic syndrome", "Pancreatitis (severe hypertriglyceridemia)"],
    nursingImplications: ["Assess and educate on lifestyle modifications (diet, exercise, weight loss)", "Screen for statin side effects (myalgias, new-onset diabetes)", "Check LFTs at baseline; recheck only if symptomatic", "Medication reconciliation for drug interactions (statins with CYP3A4 inhibitors)"],
    examAlerts: [
      "ACC/AHA guidelines identify 4 statin benefit groups — know them for the exam",
      "High-intensity statins: atorvastatin 40-80 mg or rosuvastatin 20-40 mg (≥50% LDL reduction)",
      "Moderate-intensity: atorvastatin 10-20 mg, rosuvastatin 5-10 mg, simvastatin 20-40 mg (30-49% reduction)",
      "ASCVD risk ≥7.5% = moderate-to-high intensity statin; ≥20% = high-intensity statin",
      "LDL ≥190 = high-intensity statin regardless of risk score — this is a must-treat group",
      "Ezetimibe or PCSK9 inhibitor added if LDL remains ≥70 in ASCVD patients on maximally tolerated statin"
    ],
    practiceQuestions: [
      { question: "A 48-year-old male with type 2 diabetes, no ASCVD, has LDL 118 mg/dL. 10-year ASCVD risk is 9%. What statin intensity is recommended?", options: ["No statin needed — LDL is acceptable", "Low-intensity statin", "Moderate-intensity statin", "High-intensity statin"], correctIndex: 2, rationale: "Per ACC/AHA guidelines, all patients with diabetes aged 40-75 should receive at least moderate-intensity statin therapy regardless of LDL level. With his ASCVD risk of 9% (≥7.5%), moderate-to-high intensity statin is appropriate. Diabetes is one of the 4 statin benefit groups that warrants treatment independent of LDL threshold.", isFree: true },
      { question: "A 55-year-old with history of MI is on atorvastatin 80 mg. LDL is 78 mg/dL. What is the appropriate next step?", options: ["Continue current therapy — LDL is at target", "Add ezetimibe to achieve LDL <70 mg/dL", "Reduce statin dose since LDL is close to target", "Switch to rosuvastatin"], correctIndex: 1, rationale: "In patients with established ASCVD (prior MI), the LDL goal is <70 mg/dL (some guidelines recommend <55 for very high-risk). Current LDL is 78 on maximum statin dose. Adding ezetimibe (10 mg daily) is the recommended next step, which typically provides an additional 15-20% LDL reduction. If still not at goal, a PCSK9 inhibitor (evolocumab, alirocumab) can be considered.", isFree: true }
    ],
    faqs: [
      { question: "Do patients need to fast for a lipid panel?", answer: "Non-fasting lipid panels are acceptable for initial screening and risk assessment per 2018 AHA/ACC guidelines. Fasting (9-12 hours) is recommended when triglycerides are >400 mg/dL (non-fasting values unreliable) or when monitoring triglyceride-specific treatment. Total cholesterol, LDL, and HDL are minimally affected by fasting status." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Statins", href: "/np-exam/medications/statins", type: "medication" },
      { title: "MI/ACS", href: "/np-exam/conditions/mi-acs", type: "condition" },
      { title: "Hypertension", href: "/np-exam/conditions/hypertension", type: "condition" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "cbc-interpretation", contentType: "lab-value", tier: "np", name: "CBC", fullName: "Complete Blood Count (CBC) with Differential",
    metaTitle: "CBC Interpretation for Nurse Practitioners: WBC, Hgb, Platelets & Differential (2025)",
    metaDescription: "NP-level CBC interpretation covering anemia classification, leukocytosis/leukopenia, thrombocytopenia, differential analysis, and clinical decision-making.",
    keywords: "CBC interpretation NP, complete blood count nurse practitioner, anemia classification NP exam, WBC differential, thrombocytopenia NP",
    normalRangeUS: { value: "WBC 4.5-11K, Hgb 13.5-17.5(M)/12-16(F), Plt 150-400K, MCV 80-100", unit: "/μL, g/dL, /μL, fL" },
    normalRangeCA: { value: "WBC 4.5-11, Hgb 135-175(M)/120-160(F), Plt 150-400, MCV 80-100", unit: "×10⁹/L, g/L, ×10⁹/L, fL" },
    overview: "The CBC is the most commonly ordered laboratory test in medicine. NPs must be able to systematically interpret all components: WBC with differential (infection, immune status), hemoglobin/hematocrit with red cell indices (anemia classification), and platelet count (bleeding/clotting risk). Interpretation must always consider the clinical context.",
    highSignificance: [
      { condition: "Leukocytosis (WBC >11,000)", explanation: "Most commonly bacterial infection; also stress response, corticosteroids, CML, smoking. Extreme leukocytosis >50,000 = leukemoid reaction or leukemia." },
      { condition: "Anemia (low Hgb)", explanation: "Classified by MCV: microcytic (<80: iron deficiency, thalassemia, chronic disease), normocytic (80-100: ACD, renal disease, hemolysis, acute blood loss), macrocytic (>100: B12/folate deficiency, hypothyroidism, MDS, alcohol, medications)." },
      { condition: "Thrombocytosis (Plt >400,000)", explanation: "Reactive (infection, inflammation, iron deficiency, post-splenectomy) or primary (essential thrombocythemia, CML). Reactive is most common." }
    ],
    lowSignificance: [
      { condition: "Leukopenia (WBC <4,500)", explanation: "Viral infection, medications (chemo, clozapine, methimazole), autoimmune, bone marrow failure. Neutropenia <1,500 increases infection risk; <500 = severe, requires urgent evaluation." },
      { condition: "Thrombocytopenia (Plt <150,000)", explanation: "<100K: increased bleeding risk with surgery. <50K: spontaneous bleeding risk. <20K: risk of spontaneous CNS hemorrhage. Causes: ITP, TTP, HIT, DIC, medications, liver disease, hypersplenism." }
    ],
    diagnosticWorkupImplications: [
      "Anemia workup: MCV-guided approach → microcytic: iron studies, thalassemia screen → normocytic: reticulocyte count (production vs destruction), renal function, ACD → macrocytic: B12, folate, TSH, reticulocyte count",
      "Neutrophilia with left shift (bands >10%): suggests acute bacterial infection or severe stress response",
      "Eosinophilia (>500): allergies, parasites, drug reactions, eosinophilic conditions, COPD (guides ICS use)",
      "Pancytopenia (all lines low): aplastic anemia, myelodysplastic syndrome, bone marrow infiltration, megaloblastic anemia — requires hematology referral"
    ],
    whenToOrder: ["Screening: preoperative assessment, annual physical", "Infection workup", "Fatigue, weakness, pallor (anemia evaluation)", "Unexplained bleeding or bruising", "Monitoring chemotherapy, immunosuppressants, anti-thyroid drugs", "Follow-up of known hematologic abnormalities"],
    associatedDifferentials: ["Microcytic anemia: iron deficiency (most common), thalassemia, lead poisoning, sideroblastic anemia", "Macrocytic anemia: B12 deficiency, folate deficiency, hypothyroidism, MDS, alcohol, medications (methotrexate, hydroxyurea)"],
    associatedConditions: ["Iron deficiency anemia", "B12 deficiency", "Chronic kidney disease (anemia of CKD)", "Leukemia/lymphoma", "Infections"],
    nursingImplications: ["Correlate CBC findings with clinical presentation", "Neutropenic precautions if ANC <1,500", "Bleeding precautions if platelets <50,000", "Iron deficiency anemia: assess for GI blood loss in men and postmenopausal women"],
    examAlerts: [
      "MCV is the key to classifying anemia: <80 (microcytic: think iron deficiency), 80-100 (normocytic: think ACD, renal), >100 (macrocytic: think B12/folate)",
      "Iron deficiency: low ferritin (most specific), low iron, high TIBC, low transferrin saturation",
      "B12 deficiency causes megaloblastic anemia AND neurological symptoms (peripheral neuropathy, subacute combined degeneration)",
      "Reticulocyte count differentiates production problems (low retic: bone marrow failure) from destruction/loss (high retic: hemolysis, bleeding)",
      "Eosinophils >300 in COPD predict ICS responsiveness (GOLD guidelines)"
    ],
    practiceQuestions: [
      { question: "A 65-year-old male presents with fatigue. CBC shows Hgb 9.2, MCV 72, ferritin 8. What is the most important next step?", options: ["Start oral iron supplementation", "Refer for colonoscopy to evaluate for GI blood loss", "Order B12 and folate levels", "Start EPO injection"], correctIndex: 1, rationale: "In a male (or postmenopausal female) with iron deficiency anemia (low Hgb, low MCV, low ferritin), GI blood loss must be ruled out — this is colorectal cancer until proven otherwise. Colonoscopy and potentially upper endoscopy should be performed before attributing the anemia to dietary iron deficiency. Iron supplementation should also be started, but the critical step is identifying the source of blood loss.", isFree: true },
      { question: "A patient has Hgb 8.5, MCV 115, and peripheral neuropathy. Which vitamin deficiency is most likely?", options: ["Iron", "Vitamin D", "Vitamin B12", "Folate"], correctIndex: 2, rationale: "Macrocytic anemia (MCV >100) with neurological symptoms (peripheral neuropathy) is classic for vitamin B12 deficiency. B12 deficiency causes megaloblastic anemia AND neurological damage (subacute combined degeneration of the spinal cord — peripheral neuropathy, loss of proprioception, ataxia). Folate deficiency causes megaloblastic anemia without neurological symptoms. This distinction is high-yield.", isFree: true },
      { question: "A patient on methimazole calls reporting severe sore throat and fever. CBC shows WBC 1,200 with ANC 200. What is this condition?", options: ["Viral pharyngitis", "Agranulocytosis — discontinue methimazole immediately", "Neutrophilia from infection", "Normal response to anti-thyroid medication"], correctIndex: 1, rationale: "Agranulocytosis (ANC <500) is a rare but life-threatening side effect of methimazole (and PTU). Presenting with fever and sore throat in a patient on anti-thyroid medication is a classic presentation. The medication must be stopped immediately, the patient requires hospitalization, blood cultures, and broad-spectrum antibiotics. All patients starting methimazole must be counseled to report fever or sore throat immediately.", isFree: true }
    ],
    faqs: [
      { question: "How do you systematically interpret a CBC?", answer: "1) WBC: high = infection/inflammation/malignancy; low = immunosuppression/viral/medication. Check differential for neutrophilia, eosinophilia, lymphocytosis. 2) Hemoglobin: low = anemia; classify by MCV (micro/normo/macrocytic). 3) Platelets: low = bleeding risk (ITP, DIC, medications, liver disease); high = reactive or myeloproliferative. 4) Always correlate with clinical context and consider ordering targeted follow-up tests." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Sepsis", href: "/np-exam/conditions/sepsis", type: "condition" },
      { title: "Pneumonia", href: "/np-exam/conditions/pneumonia", type: "condition" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  }
];

export const npExamMedications: NpExamMedicationPage[] = [
  {
    slug: "ace-inhibitors", contentType: "medication", tier: "np", genericName: "ACE Inhibitors (Lisinopril, Enalapril, Ramipril)", brandNames: ["Zestril", "Vasotec", "Altace"], drugClass: "Angiotensin-Converting Enzyme Inhibitor",
    metaTitle: "ACE Inhibitors for Nurse Practitioners: Prescribing, Dosing & Monitoring (2025)",
    metaDescription: "NP prescribing guide for ACE inhibitors covering indications, dosing, titration, monitoring, drug interactions, contraindications, and clinical pearls for lisinopril, enalapril, and ramipril.",
    keywords: "ACE inhibitors NP, lisinopril prescribing nurse practitioner, enalapril dosing NP, ACE inhibitor monitoring, ACE inhibitor drug interactions",
    mechanism: "ACE inhibitors block the conversion of angiotensin I to angiotensin II by inhibiting angiotensin-converting enzyme. This reduces vasoconstriction, aldosterone secretion, and sympathetic activity, lowering blood pressure and reducing cardiac afterload. They also prevent bradykinin degradation, which contributes to vasodilation (and causes the characteristic cough). In the kidney, they reduce intraglomerular pressure by dilating the efferent arteriole, providing renal protection in diabetes and CKD.",
    indications: ["Hypertension (first-line, especially with diabetes or CKD)", "Heart failure with reduced ejection fraction (HFrEF)", "Post-myocardial infarction (reduces remodeling and mortality)", "Diabetic nephropathy (reduces proteinuria and slows CKD progression)", "Secondary stroke prevention in patients with diabetes"],
    dosing: [
      { indication: "Hypertension", initialDose: "Lisinopril 10 mg daily", targetDose: "Lisinopril 20-40 mg daily", maxDose: "40 mg daily" },
      { indication: "Heart failure", initialDose: "Lisinopril 2.5-5 mg daily", targetDose: "Lisinopril 20-40 mg daily", maxDose: "40 mg daily" },
      { indication: "Post-MI", initialDose: "Lisinopril 5 mg within 24 hours", targetDose: "Lisinopril 10 mg daily", maxDose: "40 mg daily" },
      { indication: "Diabetic nephropathy", initialDose: "Enalapril 5 mg daily", targetDose: "Enalapril 20 mg daily", maxDose: "40 mg daily" }
    ],
    titration: "Start at the lowest dose and uptitrate every 1-2 weeks as BP and renal function allow. For heart failure, uptitrate to maximum tolerated dose (not just until BP is at target). Check BMP (creatinine, potassium) 1-2 weeks after each dose increase. Hold if K+ >5.5 or creatinine rises >30% from baseline.",
    sideEffects: [
      { effect: "Dry cough", severity: "Common (10-15%)", detail: "Due to bradykinin accumulation in the lungs. Non-productive, persistent cough that resolves 1-4 weeks after discontinuation. Switch to ARB if intolerable." },
      { effect: "Hyperkalemia", severity: "Serious", detail: "Reduced aldosterone decreases renal K+ excretion. Risk highest with CKD, diabetes, concurrent K+-sparing diuretics, or NSAIDs. Monitor K+ closely." },
      { effect: "Angioedema", severity: "Life-threatening", detail: "Bradykinin-mediated swelling of face, lips, tongue, larynx. Occurs in 0.1-0.5% but higher in African Americans. Contraindication to all ACEi and requires lifetime avoidance of the class." },
      { effect: "Acute kidney injury", severity: "Serious", detail: "Efferent arteriolar dilation reduces GFR. Expected creatinine rise of 10-20% is acceptable and protective long-term. Rise >30% requires dose reduction or discontinuation." },
      { effect: "Hypotension", severity: "Common", detail: "First-dose hypotension, especially in volume-depleted patients or those on high-dose diuretics. Start low, go slow." }
    ],
    contraindications: ["Pregnancy (category X — teratogenic: renal agenesis, oligohydramnios, fetal death)", "History of angioedema with ACEi", "Bilateral renal artery stenosis (risk of acute renal failure)", "Concurrent use with ARB or aliskiren (dual RAAS blockade)", "Hypersensitivity to ACE inhibitors"],
    monitoring: ["BMP (creatinine, potassium) at baseline, 1-2 weeks after initiation, and after each dose increase", "Blood pressure at each visit", "Urine albumin/creatinine ratio annually in diabetic patients", "Watch for cough — develops in first few months, resolves with discontinuation"],
    drugInteractions: [
      { drug: "Potassium-sparing diuretics (spironolactone, amiloride)", interaction: "Additive hyperkalemia risk — monitor K+ closely", severity: "Moderate to High" },
      { drug: "NSAIDs", interaction: "Reduce ACEi efficacy by blocking prostaglandin-mediated vasodilation; increase AKI and hyperkalemia risk", severity: "Moderate" },
      { drug: "ARBs", interaction: "Dual RAAS blockade — increased hyperkalemia, hypotension, and renal failure without added CV benefit (ONTARGET trial)", severity: "High — contraindicated" },
      { drug: "Lithium", interaction: "ACEi reduces renal lithium excretion, increasing lithium levels and toxicity risk", severity: "High" },
      { drug: "Sacubitril/valsartan (ARNI)", interaction: "36-hour washout required before switching to ARNI — concurrent use causes life-threatening angioedema", severity: "High — contraindicated" }
    ],
    prescribingConsiderations: [
      "First-line for hypertension with diabetes or CKD with proteinuria — provides renal protection beyond BP lowering",
      "In HFrEF, uptitrate to maximum tolerated dose — not just until BP is controlled",
      "Switch to ARB if patient develops cough (angioedema is class contraindication for both ACEi and ARB)",
      "A creatinine rise of 10-20% on initiation is expected and protective — do not discontinue for this",
      "In pregnancy planning: switch to labetalol, nifedipine, or methyldopa before conception"
    ],
    patientCounselling: [
      "Report any persistent cough to your provider — we may need to switch medications",
      "Seek emergency care immediately for any facial swelling, lip/tongue swelling, or difficulty breathing (angioedema)",
      "Do not use potassium supplements or salt substitutes (often contain KCl) without consulting your provider",
      "Avoid NSAIDs (ibuprofen, naproxen) — they can reduce the effectiveness of this medication and harm your kidneys",
      "If you are planning to become pregnant, inform your provider immediately — this medication must be stopped before pregnancy",
      "You may feel dizzy when standing, especially in the first few days — rise slowly from sitting or lying positions"
    ],
    examTips: [
      "ACEi are first-line in diabetic patients with hypertension for renal protection",
      "Cough is due to bradykinin accumulation — switch to ARB (which blocks AT1 receptors without affecting bradykinin)",
      "Never combine ACEi + ARB — dual RAAS blockade increases adverse events",
      "36-hour washout between ACEi and ARNI (sacubitril/valsartan) — risk of angioedema",
      "Angioedema is more common in African Americans — monitor closely in this population",
      "Creatinine rise >30% = stop ACEi and investigate (consider bilateral renal artery stenosis)"
    ],
    practiceQuestions: [
      { question: "A patient on lisinopril develops a persistent dry cough over the past 3 months. What is the best management?", options: ["Add a cough suppressant", "Switch to losartan (ARB)", "Discontinue lisinopril without replacement", "Increase lisinopril dose"], correctIndex: 1, rationale: "ACEi-induced cough occurs in 10-15% of patients due to bradykinin accumulation. It does not improve with cough suppressants or dose adjustment. Switching to an ARB (losartan, valsartan) resolves the cough because ARBs do not inhibit bradykinin degradation while providing the same RAAS blockade benefits.", isFree: true },
      { question: "A patient on lisinopril has a baseline creatinine of 1.2 mg/dL. Two weeks later, creatinine is 1.4 mg/dL. Potassium is 4.8. What is the appropriate action?", options: ["Discontinue lisinopril immediately", "Continue lisinopril — the creatinine rise is expected and acceptable", "Reduce lisinopril dose by 50%", "Add furosemide to protect the kidneys"], correctIndex: 1, rationale: "A creatinine rise of ≤30% from baseline (1.2 → 1.4 = 17% rise) is expected and acceptable when starting ACEi. This reflects reduced intraglomerular pressure from efferent arteriolar dilation, which is the mechanism of renal protection. Only discontinue or reduce dose if creatinine rises >30% from baseline. Continue monitoring.", isFree: true },
      { question: "Which patient should NOT be prescribed an ACE inhibitor?", options: ["65-year-old male with type 2 diabetes and hypertension", "45-year-old female with HFrEF (EF 30%)", "30-year-old female planning pregnancy in 6 months", "70-year-old male post-MI"], correctIndex: 2, rationale: "ACE inhibitors are absolutely contraindicated in pregnancy (category X) due to teratogenic effects including renal agenesis, oligohydramnios, and fetal death. Women planning pregnancy should be switched to pregnancy-safe alternatives (labetalol, nifedipine, methyldopa) before conception. The other patients all have strong indications for ACEi therapy.", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between ACE inhibitors and ARBs?", answer: "Both block the RAAS system but at different points. ACEi blocks the enzyme that converts angiotensin I to II, also preventing bradykinin degradation (causing cough). ARBs block the angiotensin II receptor directly without affecting bradykinin (no cough). Efficacy is equivalent for hypertension and heart failure. ARBs are used when patients cannot tolerate ACEi due to cough. Both carry the same risks of hyperkalemia, AKI, and teratogenicity." },
      { question: "Can you combine an ACEi with a potassium-sparing diuretic?", answer: "Yes, but with careful monitoring. ACEi + spironolactone is standard GDMT for HFrEF (RALES trial demonstrated mortality benefit). However, the combination significantly increases hyperkalemia risk. Monitor potassium and creatinine at 1 week, 1 month, and regularly thereafter. Hold if K+ >5.5. The combination is contraindicated if eGFR <30 without specialist oversight." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Hypertension", href: "/np-exam/conditions/hypertension", type: "condition" },
      { title: "Heart Failure", href: "/np-exam/conditions/heart-failure", type: "condition" },
      { title: "Potassium Lab Values", href: "/np-exam/lab-values/potassium", type: "lab-value" },
      { title: "Beta-Blockers", href: "/np-exam/medications/beta-blockers", type: "medication" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "beta-blockers", contentType: "medication", tier: "np", genericName: "Beta-Blockers (Metoprolol, Carvedilol, Atenolol, Propranolol)", brandNames: ["Lopressor/Toprol-XL", "Coreg", "Tenormin", "Inderal"], drugClass: "Beta-Adrenergic Receptor Antagonist",
    metaTitle: "Beta-Blockers for Nurse Practitioners: Prescribing Guide & Clinical Pearls (2025)",
    metaDescription: "NP prescribing guide for beta-blockers covering cardioselective vs non-selective, HF-specific agents, dosing, contraindications, and clinical decision-making.",
    keywords: "beta-blockers NP, metoprolol prescribing nurse practitioner, carvedilol heart failure NP, beta-blocker contraindications, cardioselective beta-blocker",
    mechanism: "Beta-blockers competitively antagonize beta-adrenergic receptors. Beta-1 selective agents (metoprolol, atenolol, bisoprolol) primarily affect the heart, reducing heart rate, contractility, and conduction velocity. Non-selective agents (propranolol, carvedilol) also block beta-2 receptors (bronchial smooth muscle, peripheral vasculature) and may block alpha-1 receptors (carvedilol). In heart failure, chronic beta-blockade reverses maladaptive sympathetic activation, reduces remodeling, and improves survival.",
    indications: ["Heart failure with reduced ejection fraction (only carvedilol, metoprolol succinate, or bisoprolol)", "Post-myocardial infarction (mortality reduction)", "Rate control in atrial fibrillation/flutter", "Hypertension (not first-line for uncomplicated HTN)", "Stable angina (anti-anginal)", "Hyperthyroidism symptom control (propranolol preferred — also blocks T4→T3 conversion)", "Migraine prophylaxis (propranolol)", "Essential tremor (propranolol)"],
    dosing: [
      { indication: "HFrEF", initialDose: "Carvedilol 3.125 mg BID or metoprolol succinate 12.5-25 mg daily", targetDose: "Carvedilol 25 mg BID (50 mg BID if >85 kg) or metoprolol succinate 200 mg daily", maxDose: "Carvedilol 50 mg BID / Metoprolol succ 200 mg daily" },
      { indication: "Hypertension", initialDose: "Metoprolol succinate 25-50 mg daily", targetDose: "100-200 mg daily", maxDose: "400 mg daily" },
      { indication: "Rate control (AF)", initialDose: "Metoprolol tartrate 25 mg BID-TID", targetDose: "Titrate to HR 60-110", maxDose: "200 mg TID" },
      { indication: "Hyperthyroidism symptoms", initialDose: "Propranolol 10-20 mg TID-QID", targetDose: "Titrate to symptom control", maxDose: "120 mg daily" }
    ],
    titration: "For HF: start at lowest dose when patient is euvolemic (NOT during acute decompensation). Uptitrate every 2 weeks by doubling the dose as tolerated. Monitor HR and BP. Hold uptitration if HR <60 or SBP <90. Target: highest tolerated dose up to the evidence-based target.",
    sideEffects: [
      { effect: "Bradycardia", severity: "Common", detail: "Negative chronotropic effect. Hold if HR <60. May require pacemaker in patients who need beta-blockers but develop symptomatic bradycardia." },
      { effect: "Hypotension", severity: "Common", detail: "Especially with carvedilol (alpha-blocking effect). Start low, go slow. Orthostatic hypotension more common in elderly." },
      { effect: "Fatigue and exercise intolerance", severity: "Common", detail: "Blunted heart rate response to exercise. May affect quality of life. Consider agent change if severe." },
      { effect: "Bronchospasm", severity: "Serious", detail: "Beta-2 blockade causes airway constriction. Non-selective agents contraindicated in asthma. Cardioselective agents (metoprolol, bisoprolol) safer but use cautiously in moderate-severe COPD." },
      { effect: "Masking hypoglycemia symptoms", severity: "Serious", detail: "Beta-blockers blunt tachycardia and tremor associated with hypoglycemia. Sweating is preserved. Counsel diabetic patients about this risk." },
      { effect: "Rebound hypertension/tachycardia", severity: "Serious", detail: "Abrupt discontinuation can cause rebound sympathetic activation. Always taper over 1-2 weeks — never stop abruptly." }
    ],
    contraindications: ["Decompensated heart failure (start only when euvolemic)", "Severe bradycardia (HR <50) or heart block (2nd/3rd degree without pacemaker)", "Asthma (non-selective agents absolutely contraindicated; cardioselective with extreme caution)", "Cardiogenic shock", "Pheochromocytoma without prior alpha-blockade (unopposed alpha stimulation can cause hypertensive crisis)", "Severe peripheral arterial disease (non-selective)"],
    monitoring: ["Heart rate (target 55-70 in HF, 60-110 for AF rate control)", "Blood pressure (SBP should remain >90)", "Symptoms of heart failure exacerbation during uptitration", "Blood glucose in diabetic patients (may mask hypoglycemia)", "Respiratory status in COPD patients"],
    drugInteractions: [
      { drug: "Calcium channel blockers (non-DHP: verapamil, diltiazem)", interaction: "Additive bradycardia and AV block risk — avoid combination", severity: "High" },
      { drug: "Clonidine", interaction: "Concurrent use then stopping clonidine first → rebound hypertension. Must stop beta-blocker first, then taper clonidine.", severity: "High" },
      { drug: "Insulin/sulfonylureas", interaction: "Beta-blockers mask hypoglycemia symptoms (tremor, tachycardia) — sweating preserved", severity: "Moderate" },
      { drug: "Digoxin", interaction: "Additive bradycardia and AV block — monitor HR closely", severity: "Moderate" }
    ],
    prescribingConsiderations: [
      "Only 3 beta-blockers are evidence-based for HFrEF mortality reduction: carvedilol, metoprolol SUCCINATE, bisoprolol",
      "Metoprolol tartrate (Lopressor) is NOT equivalent to metoprolol succinate (Toprol-XL) for HF — only succinate has mortality data",
      "Do NOT initiate beta-blockers during acute decompensated HF — start when euvolemic and stable",
      "For AF rate control, metoprolol tartrate is often used acutely; switch to succinate (or carvedilol if HF) for maintenance",
      "Propranolol is preferred in hyperthyroidism — it blocks peripheral T4→T3 conversion in addition to symptom control"
    ],
    patientCounselling: [
      "Do not stop this medication suddenly — stopping abruptly can cause dangerous rebound effects including rapid heart rate and high blood pressure",
      "Check your pulse daily if instructed — contact your provider if it drops below 60 or you feel dizzy/lightheaded",
      "If you have diabetes, be aware that this medication may mask some symptoms of low blood sugar (shakiness, fast heartbeat) — sweating will still occur",
      "Rise slowly from sitting or lying positions to prevent dizziness",
      "Report any new shortness of breath, swelling, or weight gain (may indicate worsening heart failure during dose adjustment)"
    ],
    examTips: [
      "Only carvedilol, metoprolol SUCCINATE, and bisoprolol have HF mortality benefit — metoprolol TARTRATE does NOT",
      "Never start BB in acute decompensated HF — wait until patient is euvolemic",
      "Non-selective BB (propranolol) contraindicated in asthma; cardioselective (metoprolol, bisoprolol) safer but still cautious",
      "BB mask hypoglycemia symptoms — high-yield exam concept in diabetic patients",
      "Never abruptly discontinue — must taper over 1-2 weeks to prevent rebound tachycardia/HTN",
      "Propranolol blocks T4→T3 conversion — preferred BB for thyrotoxicosis/thyroid storm"
    ],
    practiceQuestions: [
      { question: "A patient with HFrEF (EF 25%) is being discharged after treatment for acute decompensated heart failure. He is now euvolemic. Which beta-blocker should be initiated?", options: ["Metoprolol tartrate 50 mg BID", "Carvedilol 3.125 mg BID", "Propranolol 20 mg TID", "Atenolol 50 mg daily"], correctIndex: 1, rationale: "Only carvedilol, metoprolol succinate, or bisoprolol have evidence-based mortality benefit in HFrEF. Starting dose should be very low (carvedilol 3.125 mg BID) and uptitrated every 2 weeks. The patient must be euvolemic before initiation. Metoprolol tartrate, propranolol, and atenolol are NOT evidence-based for HF mortality reduction.", isFree: true },
      { question: "A patient with well-controlled asthma needs a beta-blocker for atrial fibrillation rate control. Which is the safest choice?", options: ["Propranolol", "Carvedilol", "Metoprolol succinate", "Nadolol"], correctIndex: 2, rationale: "Cardioselective beta-1 agents (metoprolol, bisoprolol, atenolol) are safer in patients with reactive airway disease because they have minimal beta-2 effect at therapeutic doses. Non-selective agents (propranolol, carvedilol, nadolol) block beta-2 receptors in bronchial smooth muscle and can trigger severe bronchospasm. Even with cardioselective agents, use caution and start at low doses in asthma/COPD.", isFree: true },
      { question: "Why must a 36-hour washout period NOT be observed when switching from a beta-blocker to another beta-blocker, but IS required when switching from an ACEi to sacubitril/valsartan?", options: ["Beta-blockers and ACEi have different receptor targets", "The 36-hour washout applies to any medication switch", "Concurrent ACEi and neprilysin inhibition causes dangerous angioedema via dual bradykinin elevation", "There is no clinical reason — it is a regulatory requirement"], correctIndex: 2, rationale: "The 36-hour washout between ACEi and sacubitril/valsartan (ARNI) is specifically because both ACE inhibition and neprilysin inhibition increase bradykinin levels. The combination dramatically increases angioedema risk. Beta-blockers do not affect the bradykinin pathway, so no washout is needed when switching between beta-blockers or between beta-blocker classes.", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between metoprolol succinate and metoprolol tartrate?", answer: "Metoprolol succinate (Toprol-XL) is the extended-release formulation dosed once daily with evidence-based mortality benefit in HFrEF (MERIT-HF trial). Metoprolol tartrate (Lopressor) is the immediate-release formulation dosed BID-TID, commonly used for acute rate control in AF and acute settings. For heart failure, only succinate should be used. This distinction is frequently tested on NP exams." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Heart Failure", href: "/np-exam/conditions/heart-failure", type: "condition" },
      { title: "MI/ACS", href: "/np-exam/conditions/mi-acs", type: "condition" },
      { title: "Thyroid Disorders", href: "/np-exam/conditions/thyroid-disorders", type: "condition" },
      { title: "ACE Inhibitors", href: "/np-exam/medications/ace-inhibitors", type: "medication" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "metformin", contentType: "medication", tier: "np", genericName: "Metformin", brandNames: ["Glucophage", "Glucophage XR", "Fortamet"], drugClass: "Biguanide",
    metaTitle: "Metformin for Nurse Practitioners: Prescribing, Renal Dosing & Safety (2025)",
    metaDescription: "NP prescribing guide for metformin covering dosing, GI tolerability strategies, renal adjustment, contrast precautions, and evidence-based use in type 2 diabetes.",
    keywords: "metformin NP, metformin prescribing nurse practitioner, metformin renal dosing, metformin lactic acidosis, metformin GI side effects",
    mechanism: "Metformin primarily decreases hepatic glucose production by activating AMP-activated protein kinase (AMPK). It also increases insulin sensitivity in peripheral tissues (especially skeletal muscle), decreases intestinal glucose absorption, and does not stimulate insulin secretion (no hypoglycemia risk as monotherapy). It does not cause weight gain and may promote modest weight loss.",
    indications: ["Type 2 diabetes mellitus (first-line pharmacotherapy)", "Prediabetes (off-label for diabetes prevention)", "Polycystic ovary syndrome (off-label — improves insulin resistance and ovulatory function)", "Gestational diabetes (used in some guidelines when insulin is not feasible)"],
    dosing: [
      { indication: "Type 2 diabetes", initialDose: "500 mg once daily with dinner", targetDose: "1000 mg BID (2000 mg/day)", maxDose: "2550 mg/day (IR) or 2000 mg/day (XR)" },
      { indication: "Prediabetes prevention", initialDose: "500 mg daily", targetDose: "850 mg BID", maxDose: "1700 mg/day" }
    ],
    titration: "Start at 500 mg once daily with the largest meal. Increase by 500 mg weekly to reduce GI side effects. Target dose is 1000 mg BID (2000 mg/day) for optimal glucose lowering. Extended-release (XR) formulation reduces GI side effects and can be taken once daily with dinner. If GI side effects persist, try XR formulation before discontinuing.",
    sideEffects: [
      { effect: "GI symptoms (nausea, diarrhea, bloating)", severity: "Common (20-30%)", detail: "Most common reason for discontinuation. Dose-related — start low, increase slowly. XR formulation better tolerated. Usually improve after 2-4 weeks." },
      { effect: "Vitamin B12 deficiency", severity: "Common (5-10% long-term)", detail: "Metformin reduces B12 absorption in the terminal ileum. Check B12 levels periodically, especially with peripheral neuropathy symptoms." },
      { effect: "Lactic acidosis", severity: "Life-threatening (very rare)", detail: "Black box warning but extremely rare (4.3 per 100,000 patient-years) with appropriate patient selection. Risk factors: renal impairment, hepatic disease, acute illness with tissue hypoxia, contrast dye." },
      { effect: "Metallic taste", severity: "Common", detail: "Reported by some patients; usually mild and may diminish over time." }
    ],
    contraindications: ["eGFR <30 mL/min (absolute contraindication — risk of lactic acidosis)", "Acute or chronic metabolic acidosis including DKA", "Severe hepatic impairment", "Active alcohol abuse (impairs lactate metabolism)", "Acute conditions with risk of tissue hypoxia (sepsis, decompensated HF, acute MI, respiratory failure)"],
    monitoring: ["Renal function (eGFR) at baseline, annually, and before dose changes", "Vitamin B12 level every 2-3 years (especially if symptoms of neuropathy)", "A1C every 3 months until at target, then every 6 months", "No routine monitoring for lactic acidosis needed in appropriate patients"],
    drugInteractions: [
      { drug: "Iodinated contrast dye", interaction: "Hold metformin 48 hours before and after contrast to prevent contrast-induced nephropathy potentiating lactic acidosis. Resume when renal function confirmed stable.", severity: "Moderate" },
      { drug: "Alcohol", interaction: "Excessive alcohol impairs hepatic lactate metabolism, increasing lactic acidosis risk. Moderate use acceptable.", severity: "Moderate" },
      { drug: "Carbonic anhydrase inhibitors (topiramate, acetazolamide)", interaction: "May increase lactic acidosis risk by promoting acidosis", severity: "Low-Moderate" }
    ],
    prescribingConsiderations: [
      "Reduce dose to 500 mg BID when eGFR 30-45; do not initiate if eGFR <30; discontinue if eGFR drops <30",
      "Extended-release (XR) formulation significantly reduces GI side effects — consider first-line for GI-sensitive patients",
      "No hypoglycemia risk as monotherapy — one of the safest diabetes medications",
      "Does not cause weight gain — may cause 1-3 kg weight loss (advantage over sulfonylureas and insulin)",
      "Can be continued with eGFR 30-45 at reduced dose (FDA updated guidance); reassess risk/benefit frequently",
      "In hospitalized patients: hold metformin during acute illness, procedures, or when renal function is unstable"
    ],
    patientCounselling: [
      "Take metformin with meals to reduce stomach upset — the largest meal of the day is best",
      "If you experience nausea or diarrhea, this often improves after the first few weeks — do not stop without consulting your provider",
      "This medication does not cause low blood sugar when taken alone, but combining it with insulin or other diabetes medications may increase that risk",
      "Inform any healthcare provider that you take metformin before any procedure involving contrast dye (CT scans with contrast)",
      "Limit alcohol intake — excessive alcohol increases the risk of a rare but serious side effect",
      "If you become severely ill, have surgery, or are dehydrated, contact your provider — metformin may need to be temporarily stopped"
    ],
    examTips: [
      "Metformin is FIRST-LINE for all T2DM (unless contraindicated) — this is universally agreed upon",
      "Hold metformin 48 hours before/after iodinated contrast — resume when renal function confirmed stable",
      "Dose reduce at eGFR <45; contraindicated at eGFR <30",
      "No hypoglycemia risk as monotherapy — it does not stimulate insulin secretion",
      "Check B12 periodically — deficiency can mimic diabetic neuropathy",
      "Lactic acidosis is the black box warning but is extremely rare with proper patient selection",
      "Metformin does NOT cause weight gain — it is weight-neutral to slightly weight-reducing"
    ],
    practiceQuestions: [
      { question: "A 65-year-old with T2DM has an eGFR of 38 mL/min. She is currently on metformin 1000 mg BID. What is the appropriate dose adjustment?", options: ["Continue current dose", "Reduce to 500 mg BID", "Discontinue metformin", "Switch to metformin XR 2000 mg daily"], correctIndex: 1, rationale: "With eGFR 30-45, metformin dose should be reduced to 500 mg BID per FDA guidelines. Metformin should not be initiated at eGFR <30 and should be discontinued if eGFR drops below 30. The reduced dose at eGFR 30-45 balances the glucose-lowering benefit with the reduced renal clearance.", isFree: true },
      { question: "A patient on metformin for 5 years reports numbness and tingling in both feet. A1C is well controlled at 6.8%. What should be evaluated?", options: ["Increase metformin for better diabetic neuropathy prevention", "Check vitamin B12 level", "Start gabapentin for neuropathy", "Refer to podiatry only"], correctIndex: 1, rationale: "Long-term metformin use (>3-5 years) can cause vitamin B12 deficiency by reducing absorption in the terminal ileum. B12 deficiency causes peripheral neuropathy that can mimic or exacerbate diabetic neuropathy. With an A1C of 6.8% (well controlled), this is less likely to be diabetic neuropathy progression. Check B12 and methylmalonic acid levels; supplement if deficient.", isFree: true }
    ],
    faqs: [
      { question: "Is the lactic acidosis risk with metformin really significant?", answer: "The risk is extremely low (4.3 per 100,000 patient-years) when metformin is used in appropriate patients. The original black box warning was based on phenformin data (a related drug withdrawn for lactic acidosis). Metformin is safe when contraindications are respected (eGFR >30, no severe hepatic/cardiac disease, no acute illness with hypoxia). The cardiovascular and glycemic benefits far outweigh the minimal lactic acidosis risk." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "DKA/HHS", href: "/np-exam/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "A1C Lab Values", href: "/np-exam/lab-values/a1c", type: "lab-value" },
      { title: "Insulin", href: "/np-exam/medications/insulin", type: "medication" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "statins", contentType: "medication", tier: "np", genericName: "Statins (Atorvastatin, Rosuvastatin, Simvastatin, Pravastatin)", brandNames: ["Lipitor", "Crestor", "Zocor", "Pravachol"], drugClass: "HMG-CoA Reductase Inhibitor",
    metaTitle: "Statins for Nurse Practitioners: Intensity Selection, Monitoring & Prescribing (2025)",
    metaDescription: "NP prescribing guide for statins covering high vs moderate intensity, ASCVD risk-based prescribing, muscle symptoms management, LDL targets, and add-on therapies.",
    keywords: "statin prescribing NP, atorvastatin nurse practitioner, statin intensity NP exam, statin myopathy, ASCVD statin guidelines",
    mechanism: "Statins competitively inhibit HMG-CoA reductase, the rate-limiting enzyme in hepatic cholesterol synthesis. This reduces intracellular cholesterol, upregulates LDL receptors on hepatocytes, and increases LDL clearance from blood. Beyond lipid lowering, statins have pleiotropic effects: plaque stabilization, anti-inflammatory properties, endothelial function improvement, and antithrombotic effects.",
    indications: ["Established ASCVD (secondary prevention — high-intensity)", "LDL ≥190 mg/dL (high-intensity regardless of risk score)", "Type 2 diabetes ages 40-75 (at least moderate-intensity)", "10-year ASCVD risk ≥7.5% ages 40-75 (moderate-to-high intensity)", "Post-ACS (high-intensity, initiate in hospital)"],
    dosing: [
      { indication: "High-intensity (≥50% LDL reduction)", initialDose: "Atorvastatin 40-80 mg daily OR rosuvastatin 20-40 mg daily", targetDose: "Maximally tolerated dose", maxDose: "Atorvastatin 80 mg / Rosuvastatin 40 mg" },
      { indication: "Moderate-intensity (30-49% LDL reduction)", initialDose: "Atorvastatin 10-20 mg daily OR rosuvastatin 5-10 mg", targetDose: "Dose that achieves desired LDL reduction", maxDose: "Varies by agent" }
    ],
    titration: "Start at the guideline-recommended intensity based on statin benefit group. Check lipid panel 4-12 weeks after initiation. If LDL response is inadequate (<30% reduction on moderate or <50% on high intensity), assess adherence and consider increasing dose or adding ezetimibe. In ASCVD patients, if LDL remains ≥70 on maximally tolerated statin, add ezetimibe; if still ≥70, consider PCSK9 inhibitor.",
    sideEffects: [
      { effect: "Myalgias (muscle aches)", severity: "Common (5-10%)", detail: "Most common reason for discontinuation. Check CK if symptomatic. True statin myopathy is less common than perceived (nocebo effect). Trial a different statin or lower dose before permanently discontinuing." },
      { effect: "Elevated liver enzymes", severity: "Common (1-3%)", detail: "Mild ALT elevation (<3× ULN) is common and usually benign. Check LFTs at baseline. Routine monitoring no longer recommended unless symptomatic. Discontinue if ALT >3× ULN with symptoms." },
      { effect: "New-onset diabetes", severity: "Moderate", detail: "Statins slightly increase diabetes risk (~0.1% per year), primarily in patients already at risk. The cardiovascular benefit far outweighs this small risk. Do not withhold statins for this reason." },
      { effect: "Rhabdomyolysis", severity: "Life-threatening (very rare)", detail: "Severe muscle breakdown with CK >10× ULN, myoglobinuria, and AKI. Risk increased with high doses, drug interactions (CYP3A4 inhibitors with simvastatin/atorvastatin), and renal impairment." }
    ],
    contraindications: ["Active liver disease or unexplained persistent LFT elevation", "Pregnancy (category X) and breastfeeding", "Concurrent use of potent CYP3A4 inhibitors with simvastatin (itraconazole, HIV protease inhibitors, clarithromycin)"],
    monitoring: ["Lipid panel at baseline, 4-12 weeks after initiation or dose change, then annually", "LFTs at baseline (routine monitoring no longer required unless symptomatic)", "CK only if patient reports muscle symptoms (do not routinely check)", "A1C monitoring in patients at risk for diabetes"],
    drugInteractions: [
      { drug: "CYP3A4 inhibitors (azole antifungals, macrolides, HIV PIs, grapefruit juice)", interaction: "Increase statin levels — risk of myopathy/rhabdomyolysis. Highest risk with simvastatin and lovastatin. Rosuvastatin and pravastatin are safer (not CYP3A4 metabolized).", severity: "High" },
      { drug: "Gemfibrozil", interaction: "Significantly increases risk of rhabdomyolysis when combined with statins. Fenofibrate is safer if fibrate needed.", severity: "High" },
      { drug: "Warfarin", interaction: "Statins may potentiate warfarin effect, increasing INR. Monitor INR when starting or changing statin dose.", severity: "Moderate" }
    ],
    prescribingConsiderations: [
      "Focus on statin intensity (high vs moderate) rather than treating to a specific LDL number — though LDL thresholds guide add-on therapy",
      "Rosuvastatin and pravastatin are NOT metabolized by CYP3A4 — safer choices in patients on multiple medications",
      "Statin-associated muscle symptoms (SAMS): try a different statin (rosuvastatin has lower myopathy rates), lower dose, or alternate-day dosing before permanently discontinuing",
      "The nocebo effect accounts for up to 50% of reported statin muscle symptoms — blinded trials show similar myalgia rates in statin and placebo groups",
      "Evening dosing preferred for simvastatin and fluvastatin (short half-life); atorvastatin and rosuvastatin can be taken any time (long half-life)"
    ],
    patientCounselling: [
      "Take this medication at the same time each day — it works best when taken consistently",
      "Muscle aches are a common concern, but most muscle symptoms are not caused by the statin — talk to your provider before stopping",
      "If you experience severe muscle pain, tenderness, or weakness, especially with dark urine, seek medical attention immediately (this is rare but serious)",
      "You will need periodic blood tests to check your cholesterol response and liver function",
      "This medication is for long-term use — stopping it increases your risk of heart attack and stroke",
      "Maintain a healthy diet and exercise program alongside your medication — statins work best as part of a comprehensive approach",
      "Avoid excessive grapefruit juice if you take simvastatin or lovastatin"
    ],
    examTips: [
      "4 statin benefit groups: (1) ASCVD, (2) LDL ≥190, (3) DM age 40-75, (4) ASCVD risk ≥7.5% — KNOW THESE",
      "High-intensity = atorvastatin 40-80 mg OR rosuvastatin 20-40 mg (≥50% LDL reduction)",
      "Moderate-intensity = atorvastatin 10-20 mg OR rosuvastatin 5-10 mg (30-49% LDL reduction)",
      "CYP3A4 interactions most relevant for simvastatin and lovastatin — rosuvastatin/pravastatin are safer",
      "New-onset diabetes risk exists but CV benefit far outweighs — never withhold statin for this reason",
      "ASCVD secondary prevention: high-intensity statin → add ezetimibe if LDL ≥70 → add PCSK9 inhibitor if still ≥70"
    ],
    practiceQuestions: [
      { question: "A 50-year-old female with type 2 diabetes and no ASCVD has LDL 112 mg/dL. What statin intensity is recommended?", options: ["No statin — LDL is not elevated enough", "Low-intensity statin", "At least moderate-intensity statin", "High-intensity statin"], correctIndex: 2, rationale: "All patients with diabetes aged 40-75 should receive at least moderate-intensity statin therapy regardless of baseline LDL (ACC/AHA guideline statin benefit group 3). If additional risk factors are present (long-standing diabetes, albuminuria, family history of premature ASCVD), high-intensity statin is reasonable. The decision is based on the diabetes diagnosis, not the LDL level.", isFree: true },
      { question: "A patient on simvastatin 40 mg reports diffuse muscle aches. CK level is normal. What is the best next step?", options: ["Discontinue statins permanently", "Increase simvastatin to 80 mg", "Switch to rosuvastatin at equivalent intensity and reassess", "Add CoQ10 supplement and continue simvastatin"], correctIndex: 2, rationale: "Statin-associated muscle symptoms with normal CK should prompt a trial of a different statin before permanent discontinuation. Rosuvastatin has a lower myopathy rate and is not CYP3A4 metabolized (reducing interaction risk). Most patients who report muscle symptoms on one statin can tolerate a different one. Permanent discontinuation should only be considered after trying at least 2-3 different statins at various doses.", isFree: true }
    ],
    faqs: [
      { question: "Should statins be taken at night?", answer: "It depends on the statin. Short-acting statins (simvastatin, fluvastatin) should be taken in the evening because cholesterol synthesis is highest at night. Long-acting statins (atorvastatin, rosuvastatin) can be taken at any time of day because they provide 24-hour HMG-CoA reductase inhibition. Adherence is most important — patients should take their statin at whatever time helps them remember consistently." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "MI/ACS", href: "/np-exam/conditions/mi-acs", type: "condition" },
      { title: "Lipid Panel", href: "/np-exam/lab-values/lipid-panel", type: "lab-value" },
      { title: "Hypertension", href: "/np-exam/conditions/hypertension", type: "condition" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "levothyroxine", contentType: "medication", tier: "np", genericName: "Levothyroxine", brandNames: ["Synthroid", "Levoxyl", "Tirosint", "Unithroid"], drugClass: "Thyroid Hormone Replacement",
    metaTitle: "Levothyroxine for Nurse Practitioners: Dosing, Absorption & Monitoring Guide (2025)",
    metaDescription: "NP prescribing guide for levothyroxine covering weight-based dosing, absorption interactions, TSH monitoring intervals, and special populations.",
    keywords: "levothyroxine NP, synthroid prescribing nurse practitioner, levothyroxine dosing, levothyroxine absorption, TSH monitoring levothyroxine",
    mechanism: "Levothyroxine is synthetic T4 (thyroxine) identical to the endogenous hormone. It is peripherally converted to T3 (the active form) by deiodinases. T3 binds to nuclear receptors, regulating gene expression affecting metabolism, growth, development, and energy homeostasis. Levothyroxine has a long half-life (~7 days), providing stable daily T4 levels with once-daily dosing.",
    indications: ["Primary hypothyroidism (Hashimoto's thyroiditis, post-thyroidectomy, post-RAI ablation)", "Subclinical hypothyroidism (when TSH >10, or TSH 5-10 with symptoms/anti-TPO+/pregnancy)", "Myxedema coma (IV formulation for emergency use)", "TSH suppression in thyroid cancer (post-thyroidectomy)"],
    dosing: [
      { indication: "Hypothyroidism (young, healthy)", initialDose: "1.6 mcg/kg/day (e.g., ~100-112 mcg for 70 kg)", targetDose: "Dose adjusted to TSH target", maxDose: "Rarely >200 mcg; higher doses suggest non-adherence or malabsorption" },
      { indication: "Elderly or cardiac disease", initialDose: "25 mcg daily (start very low)", targetDose: "Increase by 12.5-25 mcg every 4-6 weeks", maxDose: "Titrate slowly to avoid cardiac complications" },
      { indication: "Subclinical hypothyroidism", initialDose: "25-50 mcg daily", targetDose: "Adjusted to normalize TSH", maxDose: "Lower doses typically sufficient" }
    ],
    titration: "Recheck TSH 6-8 weeks after any dose change (TSH has a long feedback loop). Adjust dose by 12.5-25 mcg increments based on TSH. Goal TSH depends on indication: 0.5-2.5 for most hypothyroidism, <0.1 for thyroid cancer suppression, trimester-specific in pregnancy. Do not recheck TSH too early (<6 weeks) — it has not reached steady state and will give misleading results.",
    sideEffects: [
      { effect: "Signs of overreplacement (iatrogenic hyperthyroidism)", severity: "Common with dose adjustment", detail: "Palpitations, tachycardia, anxiety, insomnia, heat intolerance, weight loss, bone density loss (especially postmenopausal women). Reduce dose if symptomatic or TSH suppressed." },
      { effect: "Angina or arrhythmia in cardiac patients", severity: "Serious", detail: "Increased metabolic demand can precipitate angina or arrhythmias. Start at 25 mcg or lower in cardiac patients and titrate very slowly." },
      { effect: "Osteoporosis", severity: "Moderate (with chronic overreplacement)", detail: "Chronic TSH suppression accelerates bone turnover. Monitor bone density in postmenopausal women on thyroid hormone suppressive therapy." }
    ],
    contraindications: ["Untreated adrenal insufficiency (thyroid hormone increases cortisol metabolism — can precipitate adrenal crisis)", "Acute MI (relative — balance risk/benefit)", "Uncorrected thyrotoxicosis"],
    monitoring: ["TSH 6-8 weeks after initiation or dose change", "Annual TSH once stable", "More frequent monitoring in pregnancy (every 4 weeks through second trimester)", "Bone density in postmenopausal women on suppressive doses"],
    drugInteractions: [
      { drug: "Calcium and iron supplements", interaction: "Significantly reduce levothyroxine absorption — separate by ≥4 hours", severity: "High" },
      { drug: "Proton pump inhibitors (PPIs)", interaction: "Reduce gastric acid needed for levothyroxine dissolution and absorption — may require dose increase", severity: "Moderate" },
      { drug: "Cholestyramine/colestipol", interaction: "Bile acid sequestrants bind levothyroxine in GI tract — separate by ≥4 hours", severity: "High" },
      { drug: "Biotin supplements", interaction: "Interfere with thyroid lab assays causing falsely low TSH and falsely high T4/T3 — hold biotin 2-3 days before testing", severity: "Moderate (lab interference, not drug interaction)" },
      { drug: "Warfarin", interaction: "Levothyroxine increases warfarin sensitivity — monitor INR when starting or adjusting thyroid dose", severity: "Moderate" }
    ],
    prescribingConsiderations: [
      "Take on empty stomach, 30-60 minutes before breakfast (or at bedtime, 3+ hours after last meal) with water only",
      "Separate from calcium, iron, PPIs, antacids, and cholestyramine by ≥4 hours",
      "TSH takes 6-8 weeks to reach steady state — never recheck TSH too early after dose change",
      "Brand-to-generic or generic-to-generic switches can affect bioavailability — recheck TSH 6-8 weeks after any switch",
      "In pregnancy: dose typically increases by 30-50% — adjust early and monitor TSH every 4 weeks",
      "In myxedema coma: give IV levothyroxine AND stress-dose hydrocortisone before thyroid replacement (prevent adrenal crisis)"
    ],
    patientCounselling: [
      "Take on an empty stomach, at least 30-60 minutes before eating or drinking anything besides water",
      "Do not take calcium, iron supplements, or antacids within 4 hours of your thyroid medication",
      "If you miss a dose, take it as soon as you remember — if it is almost time for the next dose, take both the next morning",
      "Do not stop taking this medication without your provider's guidance, even if you feel well",
      "It takes 6-8 weeks for dose changes to take full effect — be patient with adjustments",
      "If you switch brands or go from brand to generic, tell your provider so your levels can be rechecked",
      "If you are planning pregnancy or become pregnant, notify your provider immediately — your dose will likely need to be increased"
    ],
    examTips: [
      "Levothyroxine absorption is impaired by calcium, iron, PPIs, soy, and cholestyramine — SEPARATE BY 4 HOURS",
      "Wait 6-8 weeks after dose change before rechecking TSH — this is a commonly tested timing concept",
      "Start LOW (25 mcg) in elderly and cardiac patients — rapid replacement can precipitate angina/MI",
      "In myxedema coma: IV levothyroxine + stress-dose hydrocortisone (steroids BEFORE thyroid hormone)",
      "In pregnancy: increase dose by 30-50% and monitor TSH every 4 weeks (trimester-specific targets)",
      "Biotin supplements cause assay interference — not a true drug interaction but affects lab results"
    ],
    practiceQuestions: [
      { question: "A newly diagnosed hypothyroid patient starts levothyroxine 75 mcg daily. When should TSH be rechecked to assess dose adequacy?", options: ["2 weeks", "4 weeks", "6-8 weeks", "3 months"], correctIndex: 2, rationale: "TSH should be rechecked 6-8 weeks after starting levothyroxine or changing the dose. This is because the TSH feedback loop has a slow response time — levothyroxine has a 7-day half-life and the pituitary takes several weeks to adjust TSH secretion to new T4 levels. Checking TSH too early will give misleading results (TSH may still be elevated despite adequate dosing).", isFree: true },
      { question: "A patient's TSH remains elevated despite increasing doses of levothyroxine. She takes her medication with breakfast, along with calcium and a PPI. What is the likely problem?", options: ["Levothyroxine resistance", "Non-adherence", "Impaired absorption from food, calcium, and PPI", "Need for T3 supplementation"], correctIndex: 2, rationale: "Food reduces levothyroxine absorption by 20-30%, calcium significantly chelates levothyroxine in the GI tract, and PPIs reduce the gastric acid needed for tablet dissolution. This combination drastically reduces bioavailability. Correcting the timing (empty stomach, 30-60 min before meals, calcium separated by 4 hours) often resolves persistently elevated TSH without needing higher doses.", isFree: true }
    ],
    faqs: [
      { question: "Is brand levothyroxine better than generic?", answer: "ATA (American Thyroid Association) recommends consistency — if a patient is well-controlled on a specific product (brand or generic), avoid unnecessary switches. Different manufacturers have slightly different bioavailability. If a switch occurs (pharmacy substitution, insurance changes), recheck TSH in 6-8 weeks. Tirosint (gel cap) may be better absorbed in patients with GI absorption issues or those on PPIs." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Thyroid Disorders", href: "/np-exam/conditions/thyroid-disorders", type: "condition" },
      { title: "TSH/T3/T4 Lab Values", href: "/np-exam/lab-values/tsh-t3-t4", type: "lab-value" },
      { title: "Hypothyroid vs Hyperthyroid", href: "/np-exam/compare/hypothyroid-vs-hyperthyroid", type: "comparison" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "ssris", contentType: "medication", tier: "np", genericName: "SSRIs (Sertraline, Fluoxetine, Escitalopram, Paroxetine, Citalopram)", brandNames: ["Zoloft", "Prozac", "Lexapro", "Paxil", "Celexa"], drugClass: "Selective Serotonin Reuptake Inhibitor",
    metaTitle: "SSRIs for Nurse Practitioners: Prescribing, Safety Monitoring & Drug Interactions (2025)",
    metaDescription: "NP prescribing guide for SSRIs covering agent selection, dosing, black box warning, serotonin syndrome, discontinuation syndrome, and special populations.",
    keywords: "SSRI prescribing NP, sertraline nurse practitioner, SSRI drug interactions, serotonin syndrome NP, SSRI discontinuation, antidepressant NP exam",
    mechanism: "SSRIs selectively inhibit the reuptake of serotonin (5-HT) at the presynaptic neuron, increasing serotonin availability in the synaptic cleft. This modulates mood, anxiety, and emotional regulation. Therapeutic effect takes 2-4 weeks as downstream receptor desensitization and neuroplasticity changes occur. SSRIs have minimal effect on norepinephrine and dopamine reuptake, resulting in a favorable side effect profile compared to TCAs and MAOIs.",
    indications: ["Major depressive disorder (first-line)", "Generalized anxiety disorder", "Panic disorder", "Obsessive-compulsive disorder (higher doses often needed)", "Social anxiety disorder", "PTSD", "Premenstrual dysphoric disorder (PMDD)"],
    dosing: [
      { indication: "Depression/Anxiety", initialDose: "Sertraline 25-50 mg daily; Escitalopram 5-10 mg daily", targetDose: "Sertraline 50-100 mg; Escitalopram 10-20 mg", maxDose: "Sertraline 200 mg; Escitalopram 20 mg" },
      { indication: "OCD", initialDose: "Sertraline 50 mg daily; Fluoxetine 20 mg daily", targetDose: "Sertraline 100-200 mg; Fluoxetine 40-80 mg", maxDose: "Higher doses than depression/anxiety" }
    ],
    titration: "Start at the lowest effective dose. Allow 2-4 weeks at each dose before assessing efficacy. Increase by one dose increment every 2-4 weeks. Full therapeutic effect may take 6-8 weeks. If inadequate response after 6-8 weeks at adequate dose, consider augmentation, switching, or re-evaluating diagnosis.",
    sideEffects: [
      { effect: "GI symptoms (nausea, diarrhea)", severity: "Common", detail: "Usually transient (1-2 weeks). Take with food if bothersome. Serotonin receptors in the GI tract explain this effect." },
      { effect: "Sexual dysfunction", severity: "Common (30-60%)", detail: "Decreased libido, anorgasmia, erectile dysfunction. Most common reason for long-term non-adherence. Consider bupropion switch/augmentation or dose reduction." },
      { effect: "Weight gain", severity: "Common (long-term)", detail: "Paroxetine has the highest weight gain; escitalopram and sertraline are more weight-neutral. Average gain 5-10 lbs over months." },
      { effect: "Suicidality (FDA Black Box Warning)", severity: "Serious", detail: "Increased suicidal ideation in patients <25 years, particularly in first few weeks. Monitor closely — weekly contact in first month, then biweekly. Not a contraindication to treatment." },
      { effect: "Serotonin syndrome", severity: "Life-threatening", detail: "When combined with other serotonergic drugs (MAOIs, tramadol, triptans, SNRIs, linezolid, St. John's Wort). Triad: mental status changes, autonomic instability, neuromuscular abnormalities (clonus, hyperreflexia, hyperthermia)." },
      { effect: "QT prolongation (citalopram)", severity: "Serious", detail: "Citalopram max dose limited to 40 mg daily (20 mg in elderly/hepatic impairment) due to dose-dependent QT prolongation." }
    ],
    contraindications: ["Concurrent use with MAOIs (14-day washout required between SSRI and MAOI)", "Concurrent use with pimozide or thioridazine (QT prolongation)", "Fluoxetine: 5-week washout needed before starting MAOI (longest SSRI half-life)"],
    monitoring: ["PHQ-9 at baseline and follow-up visits to track depression severity", "Suicidality assessment in first 4-6 weeks, especially in patients <25", "Sexual function assessment (patients may not volunteer these symptoms)", "QTc if prescribing citalopram in high-risk patients", "Sodium levels if elderly or on diuretics (SIADH risk)"],
    drugInteractions: [
      { drug: "MAO inhibitors", interaction: "ABSOLUTE CONTRAINDICATION — risk of fatal serotonin syndrome. Require 14-day washout (5 weeks for fluoxetine due to long half-life of norfluoxetine).", severity: "Contraindicated" },
      { drug: "Tramadol, triptans, St. John's Wort", interaction: "Serotonergic drugs — increased risk of serotonin syndrome", severity: "High" },
      { drug: "Warfarin", interaction: "SSRIs inhibit platelet aggregation and may increase bleeding risk; fluoxetine/fluvoxamine inhibit CYP2C9 increasing warfarin levels", severity: "Moderate" },
      { drug: "NSAIDs", interaction: "Additive GI bleeding risk (SSRIs + NSAIDs = 4× increased GI bleed risk vs either alone)", severity: "Moderate" },
      { drug: "Tamoxifen + fluoxetine/paroxetine", interaction: "Fluoxetine and paroxetine are strong CYP2D6 inhibitors — reduce conversion of tamoxifen to active metabolite (endoxifen), reducing efficacy. Use sertraline, escitalopram, or venlafaxine instead.", severity: "High" }
    ],
    prescribingConsiderations: [
      "Sertraline and escitalopram are often first choices due to favorable side effect profiles and fewer drug interactions",
      "Fluoxetine has the longest half-life — least likely to cause discontinuation syndrome but longest MAOI washout (5 weeks)",
      "Paroxetine is the most anticholinergic SSRI and has the most weight gain — avoid in elderly; also most likely to cause discontinuation symptoms",
      "SSRIs in pregnancy: sertraline has the most safety data; paroxetine is category D (cardiac malformations); balance risk of untreated depression vs medication risk",
      "Discontinuation syndrome: dizziness, nausea, anxiety, insomnia, 'brain zaps' — taper over 2-4 weeks; most common with paroxetine and venlafaxine (SNRI)"
    ],
    patientCounselling: [
      "It takes 2-4 weeks to start feeling the full benefit — do not stop taking it because you do not feel better right away",
      "Do not stop this medication suddenly — stopping abruptly can cause uncomfortable withdrawal symptoms. Always taper with your provider's guidance",
      "If you are under 25, there is a small increased risk of suicidal thoughts in the first few weeks — please reach out to your provider or crisis line if you experience this",
      "Report any sexual side effects — there are strategies to manage this, including dose adjustment or medication changes",
      "Avoid alcohol — it can worsen depression and interact with this medication",
      "Inform your provider about all other medications, supplements, and herbal products — some combinations can be dangerous"
    ],
    examTips: [
      "SSRIs are first-line for depression AND anxiety disorders — most commonly tested antidepressant class",
      "FDA Black Box Warning: increased suicidality in patients <25, particularly in first weeks — monitor closely but do not withhold treatment",
      "Serotonin syndrome = SSRI + MAOI/tramadol/triptans — triad: AMS, autonomic instability, neuromuscular (clonus, hyperreflexia, hyperthermia)",
      "14-day washout between SSRI and MAOI; 5 weeks for fluoxetine (long half-life)",
      "Paroxetine is category D in pregnancy — avoid; sertraline preferred in pregnancy",
      "SSRI + NSAID = 4× increased GI bleeding risk — consider PPI for gastroprotection",
      "Citalopram max dose is 40 mg (20 mg in elderly) due to dose-dependent QT prolongation"
    ],
    practiceQuestions: [
      { question: "A 22-year-old female is started on sertraline 50 mg for major depression. What monitoring is essential in the first month?", options: ["Weekly liver function tests", "Monthly ECG", "Close follow-up with suicidality assessment (weekly contact recommended)", "Quarterly A1C monitoring"], correctIndex: 2, rationale: "Per the FDA black box warning, patients under 25 starting antidepressants have an increased risk of suicidal ideation, particularly in the first few weeks. Close monitoring with weekly contact (phone or in-person) during the first month, then biweekly for the next month, is recommended. This is the most important monitoring consideration in this age group.", isFree: true },
      { question: "A patient on sertraline is prescribed tramadol for back pain. What is the primary safety concern?", options: ["Liver toxicity", "Serotonin syndrome", "Respiratory depression", "QT prolongation"], correctIndex: 1, rationale: "Both sertraline (SSRI) and tramadol have serotonergic activity. The combination increases the risk of serotonin syndrome — a potentially life-threatening condition characterized by altered mental status, autonomic instability (hyperthermia, tachycardia, diaphoresis), and neuromuscular abnormalities (clonus, hyperreflexia, rigidity). Consider alternative analgesics or use lowest effective doses with close monitoring.", isFree: true },
      { question: "A patient on fluoxetine for 6 months wants to switch to an MAOI for treatment-resistant depression. How long must fluoxetine be stopped before starting the MAOI?", options: ["48 hours", "14 days", "5 weeks", "No washout needed"], correctIndex: 2, rationale: "Fluoxetine requires a 5-week washout before starting an MAOI. This is because fluoxetine's active metabolite (norfluoxetine) has an extremely long half-life of 4-16 days, and serotonergic activity persists for weeks after discontinuation. All other SSRIs require a standard 14-day washout. This unique washout period for fluoxetine is a high-yield exam concept.", isFree: true }
    ],
    faqs: [
      { question: "Which SSRI should be used in pregnancy?", answer: "Sertraline has the most safety data in pregnancy and is generally considered first-choice. Paroxetine is category D and should be avoided due to risk of cardiac malformations (particularly ventricular septal defects). The decision to use antidepressants in pregnancy must balance the risks of medication against the significant risks of untreated depression (poor prenatal care, preeclampsia, preterm birth, postpartum depression)." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Pharmacology for NPs", href: "/np-exam/pharmacology", type: "category" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "insulin", contentType: "medication", tier: "np", genericName: "Insulin (Glargine, Detemir, Lispro, Aspart, Regular)", brandNames: ["Lantus/Basaglar/Toujeo", "Levemir", "Humalog", "NovoLog", "Humulin R"], drugClass: "Insulin",
    metaTitle: "Insulin Prescribing for Nurse Practitioners: Basal-Bolus, Dosing & Safety (2025)",
    metaDescription: "NP prescribing guide for insulin covering basal vs bolus, dosing initiation, titration protocols, hypoglycemia prevention, and DKA insulin management.",
    keywords: "insulin prescribing NP, basal bolus insulin nurse practitioner, insulin dosing NP exam, insulin titration, hypoglycemia insulin NP",
    mechanism: "Insulin is an anabolic hormone that binds to insulin receptors, facilitating glucose uptake into cells, suppressing hepatic glucose production, inhibiting lipolysis, and promoting glycogen synthesis. Exogenous insulin replaces deficient endogenous production. Basal insulin (glargine, detemir) provides steady 24-hour coverage for fasting glucose. Bolus/prandial insulin (lispro, aspart) covers postprandial glucose excursions. Regular insulin has intermediate onset and is used in DKA (IV) and sliding scales.",
    indications: ["Type 1 diabetes (absolute requirement — lifelong)", "Type 2 diabetes (when oral agents insufficient, A1C ≥10% at diagnosis, severe hyperglycemia symptoms)", "DKA management (continuous IV insulin infusion)", "Hyperkalemia treatment (insulin + D50 drives K+ intracellularly)", "Gestational diabetes (when diet fails)", "Hospital glucose management (basal-bolus preferred over sliding scale alone)"],
    dosing: [
      { indication: "T2DM basal initiation", initialDose: "Glargine 10 units at bedtime OR 0.1-0.2 U/kg/day", targetDose: "Titrate by 2 units every 3 days to fasting BG target (80-130 mg/dL)", maxDose: "No absolute max; >0.5 U/kg suggests need for add-on therapy or insulin resistance evaluation" },
      { indication: "T2DM basal-bolus", initialDose: "50% as basal, 50% divided among meals", targetDose: "Adjust based on pre-meal and post-meal glucose readings", maxDose: "Total daily dose varies widely (0.5-2 U/kg)" },
      { indication: "DKA (IV insulin)", initialDose: "0.1-0.14 U/kg/hr continuous infusion (after K+ ≥3.3)", targetDose: "Glucose reduction 50-75 mg/dL/hr", maxDose: "Adjust to glucose response; switch to SC when AG closes and patient eating" }
    ],
    titration: "Basal insulin: patient-directed titration — increase by 2 units every 3 days if fasting glucose above target. If fasting BG consistently <70, reduce by 2-4 units. Prandial insulin: adjust based on pre-meal glucose and carb intake. Use insulin correction factor (1800 rule for rapid-acting: 1800/TDD = mg/dL drop per unit) and carb ratio (500 rule: 500/TDD = grams carb covered per unit).",
    sideEffects: [
      { effect: "Hypoglycemia", severity: "Life-threatening", detail: "Most dangerous side effect. Symptoms: tremor, diaphoresis, confusion, seizure, loss of consciousness. Treat with 15g fast-acting carbs (Rule of 15). Severe: glucagon IM/SC/intranasal. Educate patients on recognition and treatment." },
      { effect: "Weight gain", severity: "Common", detail: "Insulin promotes anabolic effects and fat storage. Average 2-4 kg with basal insulin initiation. Counsel on diet and exercise." },
      { effect: "Lipodystrophy", severity: "Common", detail: "Subcutaneous fat hypertrophy or atrophy at injection sites from repeated injection in same area. Educate on injection site rotation." },
      { effect: "Hypokalemia", severity: "Serious", detail: "Insulin drives potassium intracellularly. In DKA, must ensure K+ ≥3.3 before starting insulin. Monitor K+ closely during insulin infusions." }
    ],
    contraindications: ["Hypoglycemia (do not administer during active hypoglycemia)", "Hypokalemia <3.3 mEq/L (in DKA — correct K+ first)", "Allergy to insulin formulation components (rare)"],
    monitoring: ["Self-monitoring blood glucose (SMBG): fasting daily for basal titration; pre-meal and 2-hr post-meal for basal-bolus", "A1C every 3 months until at target, then every 6 months", "Continuous glucose monitoring (CGM) for patients on intensive insulin therapy", "Hypoglycemia awareness assessment", "Injection site inspection for lipodystrophy"],
    drugInteractions: [
      { drug: "Beta-blockers", interaction: "Mask hypoglycemia symptoms (tachycardia, tremor) — sweating preserved. Counsel patients.", severity: "Moderate" },
      { drug: "Thiazolidinediones (pioglitazone)", interaction: "Additive hypoglycemia risk and fluid retention when combined with insulin", severity: "Moderate" },
      { drug: "Corticosteroids", interaction: "Increase insulin resistance and blood glucose — may require significant insulin dose increases during steroid therapy", severity: "Moderate" }
    ],
    prescribingConsiderations: [
      "Start with basal insulin in T2DM before adding prandial — simpler regimen improves adherence",
      "In DKA: only use IV regular insulin; do NOT give subcutaneous insulin during DKA management",
      "When transitioning from IV to SC insulin in DKA: give SC basal insulin 2 hours BEFORE stopping IV drip (prevents rebound hyperglycemia)",
      "Insulin pens are preferred over vials/syringes for accuracy and adherence in outpatient settings",
      "Concentrated insulins exist (U-200, U-300, U-500) — dose conversion errors are dangerous; ensure patient understands their specific insulin",
      "Sliding scale insulin alone is NOT recommended for inpatient glucose management — use basal-bolus protocol"
    ],
    patientCounselling: [
      "Always carry a fast-acting glucose source (glucose tablets, juice) in case of low blood sugar",
      "Learn to recognize signs of low blood sugar: shakiness, sweating, confusion, rapid heartbeat — treat immediately with 15 grams of fast-acting sugar",
      "Rotate your injection sites to prevent skin changes (lumps) — rotate within and between areas (abdomen, thighs, arms, buttocks)",
      "Store unopened insulin in the refrigerator; once opened, most pens/vials can be kept at room temperature for 28 days",
      "Never share insulin pens, even with family members, even if you change the needle — this is a biohazard",
      "If you are sick and cannot eat, do not stop your basal insulin — contact your provider for sick-day instructions",
      "Wear a medical alert bracelet indicating you use insulin"
    ],
    examTips: [
      "In DKA: K+ must be ≥3.3 before starting insulin — MOST TESTED insulin safety concept",
      "Transition IV to SC: give SC basal insulin 2 hours before stopping IV insulin drip",
      "Basal insulin (glargine/detemir) = flat, 24-hour profile; cannot be mixed with other insulins",
      "Rapid-acting (lispro/aspart) onset: 15-30 min, peak: 1-2 hours — give immediately before meals",
      "Regular insulin onset: 30-60 min, peak: 2-4 hours — give 30 min before meals; used IV in DKA",
      "1800 Rule: 1800/TDD = correction factor (mg/dL drop per unit of rapid-acting insulin)",
      "Sliding scale alone is inadequate for inpatient management — use basal-bolus protocol"
    ],
    practiceQuestions: [
      { question: "A T2DM patient is started on glargine 10 units at bedtime. His fasting glucose readings over 3 days are 156, 162, and 148 mg/dL. What is the appropriate adjustment?", options: ["No change — wait 2 more weeks", "Increase glargine by 2 units", "Add prandial insulin lispro before meals", "Switch to metformin"], correctIndex: 1, rationale: "Basal insulin titration uses a patient-directed protocol: increase by 2 units every 3 days if fasting glucose is consistently above target (80-130 mg/dL). His fasting readings are all above target, so increase by 2 units (to 12 units). This gradual titration continues until fasting glucose reaches target. Prandial insulin is only added after basal insulin is optimized and A1C is still above target.", isFree: true },
      { question: "A DKA patient on IV insulin has a glucose of 250 mg/dL (down from 580). Anion gap has closed. She is tolerating oral intake. What is the next step?", options: ["Stop IV insulin and start oral metformin", "Give SC glargine, continue IV insulin for 2 more hours, then discontinue IV", "Stop IV insulin immediately and start SC lispro", "Continue IV insulin until glucose is <100 mg/dL"], correctIndex: 1, rationale: "When transitioning from IV to SC insulin in DKA resolution (closed AG, eating, improved), give SC basal insulin (glargine) 2 hours BEFORE stopping IV insulin to prevent rebound hyperglycemia and recurrence of DKA. Stopping IV insulin without overlap allows glucose to spike. Do not transition to oral agents during the initial recovery — SC insulin should be used first.", isFree: true }
    ],
    faqs: [
      { question: "When should you add prandial insulin to basal insulin in T2DM?", answer: "Add prandial insulin when fasting glucose is at target on optimized basal insulin but A1C remains above goal (suggesting postprandial hyperglycemia). Start with one prandial dose before the largest meal (basal-plus approach), then add to other meals as needed (basal-bolus). Alternative: consider GLP-1 RA before prandial insulin for weight benefit." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "DKA/HHS", href: "/np-exam/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "Metformin", href: "/np-exam/medications/metformin", type: "medication" },
      { title: "A1C Lab Values", href: "/np-exam/lab-values/a1c", type: "lab-value" },
      { title: "Potassium Lab Values", href: "/np-exam/lab-values/potassium", type: "lab-value" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "antibiotics-overview", contentType: "medication", tier: "np", genericName: "Antibiotics Overview (Penicillins, Cephalosporins, Macrolides, Fluoroquinolones, Others)", brandNames: ["Various"], drugClass: "Antimicrobial Agents",
    metaTitle: "Antibiotic Prescribing for Nurse Practitioners: Selection, Spectrum & Stewardship (2025)",
    metaDescription: "NP antibiotic prescribing guide covering empiric selection by infection site, spectrum of activity, key drug interactions, resistance patterns, and antibiotic stewardship principles.",
    keywords: "antibiotic prescribing NP, empiric antibiotic selection nurse practitioner, antibiotic stewardship NP, antibiotic spectrum NP exam, antibiotic resistance",
    mechanism: "Antibiotics target essential bacterial processes: cell wall synthesis (penicillins, cephalosporins, carbapenems, vancomycin), protein synthesis (macrolides, tetracyclines, aminoglycosides, linezolid), DNA/RNA synthesis (fluoroquinolones, metronidazole, rifampin), and folate metabolism (TMP-SMX). Selection depends on the suspected pathogen, infection site, local resistance patterns, patient allergies, and organ function.",
    indications: ["Community-acquired pneumonia", "Urinary tract infections (simple and complicated)", "Skin and soft tissue infections", "Otitis media and sinusitis", "Streptococcal pharyngitis", "Intra-abdominal infections", "Sepsis (empiric broad-spectrum)"],
    dosing: [
      { indication: "Simple UTI (uncomplicated cystitis)", initialDose: "Nitrofurantoin 100 mg BID × 5 days OR TMP-SMX DS BID × 3 days", targetDose: "Complete prescribed course", maxDose: "As per regimen" },
      { indication: "Community-acquired pneumonia (outpatient)", initialDose: "Amoxicillin 1g TID + doxycycline 100 mg BID × 5 days", targetDose: "Complete course", maxDose: "Per ATS/IDSA guidelines" },
      { indication: "Strep pharyngitis", initialDose: "Amoxicillin 500 mg BID or 1g daily × 10 days", targetDose: "Complete 10-day course", maxDose: "Or penicillin V 500 mg BID-TID × 10 days" }
    ],
    titration: "Antibiotics are not titrated in the traditional sense. However, de-escalation from broad-spectrum to narrow-spectrum based on culture and sensitivity results is a core stewardship principle. Duration should be the shortest effective course supported by evidence.",
    sideEffects: [
      { effect: "C. difficile infection", severity: "Serious", detail: "Any antibiotic can cause C. diff but highest risk with fluoroquinolones, clindamycin, and broad-spectrum cephalosporins. Suspect with new diarrhea during or after antibiotics." },
      { effect: "Allergic reactions", severity: "Varies", detail: "Penicillin allergy reported in 10% but true allergy confirmed in <1%. Cross-reactivity with cephalosporins is 1-2% (not 10% as previously thought). Carbapenems safe in most penicillin allergy." },
      { effect: "Tendon rupture (fluoroquinolones)", severity: "Serious", detail: "FDA black box: tendon rupture/tendinitis, peripheral neuropathy, CNS effects, aortic aneurysm. Risk highest in elderly, concurrent corticosteroids, renal impairment." },
      { effect: "QT prolongation", severity: "Serious", detail: "Macrolides (azithromycin, erythromycin) and fluoroquinolones prolong QT interval. Avoid in patients with known QT prolongation or concurrent QT-prolonging drugs." },
      { effect: "Antibiotic resistance", severity: "Public health concern", detail: "Overuse and inappropriate prescribing drive resistance. Follow stewardship principles: right drug, right dose, right duration, de-escalate when possible." }
    ],
    contraindications: ["Known true allergy to specific antibiotic class", "Fluoroquinolones: avoid in patients with tendon disorders, myasthenia gravis, or QT prolongation", "Nitrofurantoin: avoid if eGFR <30 (ineffective and risk of pulmonary toxicity)", "Doxycycline: avoid in children <8 and pregnancy (tooth discoloration, bone effects)", "TMP-SMX: caution with hyperkalemia risk (blocks ENaC), sulfa allergy, folate deficiency"],
    monitoring: ["Clinical response (fever curve, symptoms, WBC trend)", "Renal function for renally-dosed antibiotics (vancomycin, aminoglycosides, carbapenems)", "Drug levels for vancomycin (AUC-guided or trough-based) and aminoglycosides", "Watch for C. difficile symptoms (watery diarrhea, abdominal pain, fever)"],
    drugInteractions: [
      { drug: "Warfarin + most antibiotics", interaction: "Many antibiotics (fluoroquinolones, macrolides, metronidazole, TMP-SMX) potentiate warfarin by inhibiting CYP enzymes or reducing vitamin K-producing gut flora. Monitor INR closely.", severity: "High" },
      { drug: "Macrolides + statins", interaction: "Erythromycin and clarithromycin inhibit CYP3A4, increasing simvastatin/lovastatin levels → rhabdomyolysis risk. Azithromycin is safer.", severity: "High" },
      { drug: "Fluoroquinolones + cations (Ca, Mg, Fe, Al)", interaction: "Divalent and trivalent cations chelate fluoroquinolones, reducing absorption. Separate by 2-4 hours.", severity: "Moderate" },
      { drug: "Metronidazole + alcohol", interaction: "Disulfiram-like reaction: nausea, vomiting, flushing, headache. Avoid alcohol during and 48 hours after metronidazole.", severity: "Moderate" }
    ],
    prescribingConsiderations: [
      "Always consider the most likely pathogen based on infection site and patient risk factors",
      "Use the narrowest effective spectrum — broad-spectrum when source unknown, then de-escalate based on cultures",
      "Fluoroquinolones should be reserved for situations where no safer alternative exists (FDA black box warnings)",
      "Antibiotic duration: shorter courses are often equally effective (UTI 3-5 days, CAP 5 days, skin infections 5-7 days) — avoid unnecessarily long courses",
      "For recurrent UTIs in women: consider prophylactic strategies (post-coital prophylaxis, cranberry products, vaginal estrogen in postmenopausal women)",
      "Penicillin allergy: true IgE-mediated allergy is rare; most reported allergies are not confirmed on testing — penicillin allergy testing can safely expand treatment options"
    ],
    patientCounselling: [
      "Complete the full course of antibiotics as prescribed, even if you feel better before finishing",
      "Antibiotics do not treat viral infections (colds, most sore throats, flu) — using them unnecessarily contributes to antibiotic resistance",
      "Report any rash, difficulty breathing, or severe diarrhea to your provider immediately",
      "If you develop watery diarrhea during or after antibiotics, contact your provider — this could be a C. difficile infection",
      "Take antibiotics as directed regarding timing with food — some must be taken with food, others on an empty stomach",
      "Avoid alcohol with metronidazole (and for 48 hours after completing it)"
    ],
    examTips: [
      "Empiric antibiotic selection by site: UTI (nitrofurantoin/TMP-SMX), CAP (amoxicillin + macrolide or respiratory FQ), skin (cephalexin for MSSA, TMP-SMX/doxycycline for MRSA), strep throat (amoxicillin or penicillin V)",
      "C. difficile risk is highest with fluoroquinolones, clindamycin, and broad-spectrum cephalosporins",
      "Fluoroquinolone FDA black box: tendon rupture, peripheral neuropathy, aortic aneurysm — reserve for when no safer alternative exists",
      "Penicillin cross-reactivity with cephalosporins is only 1-2% (not the old 10% figure) — cephalosporins are generally safe in penicillin allergy",
      "Azithromycin monotherapy is no longer recommended for outpatient CAP (pneumococcal resistance >25%)",
      "Nitrofurantoin is ineffective at eGFR <30 — cannot achieve adequate urinary concentration"
    ],
    practiceQuestions: [
      { question: "A 25-year-old female presents with dysuria, urgency, and frequency. UA shows pyuria and bacteriuria. She has no comorbidities. What is the first-line empiric treatment?", options: ["Ciprofloxacin 500 mg BID × 7 days", "Nitrofurantoin 100 mg BID × 5 days", "Amoxicillin 500 mg TID × 7 days", "Cephalexin 500 mg QID × 7 days"], correctIndex: 1, rationale: "Per IDSA guidelines, first-line treatment for uncomplicated cystitis is nitrofurantoin 100 mg BID × 5 days or TMP-SMX DS BID × 3 days (if local resistance <20%). Fluoroquinolones should NOT be used for uncomplicated UTI due to adverse effect profile and resistance concerns — they are reserved for complicated UTIs. Amoxicillin and cephalexin have lower cure rates for uncomplicated cystitis.", isFree: true },
      { question: "A patient on warfarin (INR target 2-3) is prescribed levofloxacin for a complicated UTI. What monitoring is most important?", options: ["Serum creatinine daily", "INR within 3-5 days of starting levofloxacin", "ECG before first dose", "CBC with differential"], correctIndex: 1, rationale: "Fluoroquinolones (and many other antibiotics) interact with warfarin by inhibiting CYP enzymes involved in warfarin metabolism and by reducing vitamin K-producing gut flora. This can significantly increase INR and bleeding risk. INR should be checked within 3-5 days of starting the antibiotic and the warfarin dose adjusted as needed.", isFree: true }
    ],
    faqs: [
      { question: "How do you approach antibiotic selection for a patient with a penicillin allergy?", answer: "First, characterize the allergy: rash only (low risk), hives (moderate risk), or anaphylaxis (high risk). For low-risk reactions, cephalosporins are safe (1-2% cross-reactivity, not 10%). For anaphylaxis history, avoid penicillins and carbapenems; use aztreonam (no cross-reactivity), fluoroquinolones, or vancomycin as alternatives. Consider penicillin allergy testing to de-label patients — 90% of reported penicillin allergies are not confirmed on testing." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Pneumonia", href: "/np-exam/conditions/pneumonia", type: "condition" },
      { title: "Sepsis", href: "/np-exam/conditions/sepsis", type: "condition" },
      { title: "CBC Interpretation", href: "/np-exam/lab-values/cbc-interpretation", type: "lab-value" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  }
];

export const npExamComparisons: NpExamComparisonPage[] = [
  {
    slug: "dka-vs-hhs", contentType: "comparison", tier: "np",
    metaTitle: "DKA vs HHS: Key Differences for Nurse Practitioners (2025)",
    metaDescription: "NP-level comparison of diabetic ketoacidosis (DKA) and hyperosmolar hyperglycemic state (HHS) covering pathophysiology, lab values, management differences, and clinical decision-making.",
    keywords: "DKA vs HHS NP, diabetic ketoacidosis vs HHS, DKA HHS comparison nurse practitioner, DKA HHS management differences",
    h1: "DKA vs HHS: Key Differences for NP Exams",
    introText: "Distinguishing between DKA and HHS is a critical NP skill tested on certification exams. Both are diabetic emergencies but have different pathophysiology, presentations, and management priorities.",
    conditionA: { name: "DKA (Diabetic Ketoacidosis)", features: { "Typical patient": "Type 1 diabetes (can occur in T2DM)", "Glucose level": "250-800 mg/dL", "pH": "<7.3", "Bicarbonate": "<18 mEq/L", "Ketones": "Strongly positive", "Anion gap": "Elevated (>12)", "Serum osmolality": "Variable (may be elevated)", "Onset": "Rapid (hours to 1-2 days)", "Mental status": "Alert to obtunded", "Kussmaul respirations": "Present (compensatory hyperventilation)", "Fluid deficit": "3-6 liters", "Mortality": "1-5%", "Primary treatment": "IV insulin + IV fluids + K+ replacement", "Key lab to check before insulin": "Potassium (must be ≥3.3)" } },
    conditionB: { name: "HHS (Hyperosmolar Hyperglycemic State)", features: { "Typical patient": "Type 2 diabetes (often elderly)", "Glucose level": ">600 mg/dL (often >1000)", "pH": ">7.3", "Bicarbonate": ">18 mEq/L", "Ketones": "Minimal or absent", "Anion gap": "Normal or mildly elevated", "Serum osmolality": ">320 mOsm/kg (often >350)", "Onset": "Gradual (days to weeks)", "Mental status": "More severely altered (confusion, coma)", "Kussmaul respirations": "Absent (no acidosis)", "Fluid deficit": "6-9 liters (more severe)", "Mortality": "10-20% (higher than DKA)", "Primary treatment": "Aggressive IV fluids + lower-dose insulin", "Key lab to check before insulin": "Potassium (same as DKA)" } },
    comparisonCategories: ["Typical patient", "Glucose level", "pH", "Bicarbonate", "Ketones", "Anion gap", "Serum osmolality", "Onset", "Mental status", "Kussmaul respirations", "Fluid deficit", "Mortality", "Primary treatment", "Key lab to check before insulin"],
    keyDifferences: [
      "DKA has significant acidosis (pH <7.3, low bicarb, elevated AG) while HHS does not — this is the defining distinction",
      "HHS has much higher glucose levels (>600, often >1000) and serum osmolality (>320) compared to DKA",
      "HHS has more profound dehydration (6-9L deficit vs 3-6L in DKA) requiring more aggressive fluid resuscitation",
      "DKA occurs rapidly (hours) while HHS develops gradually over days to weeks",
      "HHS has higher mortality (10-20%) than DKA (1-5%), largely due to older patient population and comorbidities",
      "DKA treatment prioritizes insulin and potassium management; HHS prioritizes aggressive fluid resuscitation"
    ],
    clinicalPearls: [
      "DKA has ketones because of ABSOLUTE insulin deficiency (no insulin → lipolysis → ketoacids); HHS has enough insulin to prevent ketosis but not enough to prevent hyperglycemia",
      "In DKA, ALWAYS check potassium before starting insulin — insulin drives K+ intracellularly and can cause fatal hypokalemia if K+ <3.3",
      "HHS fluid deficit can be 6-9 liters — initial NS resuscitation at 1-1.5 L/hr until hemodynamically stable, then switch to half-NS",
      "Overlap can occur ('DKA-HHS overlap') with features of both — treat as DKA (more aggressive approach)",
      "The most common precipitant for both conditions is infection — always look for and treat the underlying trigger"
    ],
    practiceQuestions: [
      { question: "A 72-year-old with T2DM presents with glucose 890 mg/dL, pH 7.38, serum osmolality 338 mOsm/kg, and confusion. Ketones are trace. What is the diagnosis?", options: ["DKA", "HHS", "DKA-HHS overlap", "Lactic acidosis"], correctIndex: 1, rationale: "This presentation is classic HHS: very high glucose (890), normal pH (7.38 — no significant acidosis), elevated osmolality (>320), minimal ketones, and altered mental status. The absence of significant acidosis and the high osmolality distinguish HHS from DKA. Management priority is aggressive IV fluid resuscitation for the profound dehydration.", isFree: true },
      { question: "A DKA patient's potassium is 3.1 mEq/L. The intern wants to start the insulin drip. What is the correct guidance?", options: ["Start insulin — potassium can be replaced simultaneously", "Do NOT start insulin until K+ is ≥3.3 — replace potassium first", "Start insulin at half-rate with potassium replacement", "Potassium level is adequate — proceed with insulin"], correctIndex: 1, rationale: "This is a critical safety concept. K+ must be ≥3.3 mEq/L before starting insulin in DKA. Insulin drives potassium intracellularly, and starting insulin with K+ of 3.1 can cause fatal cardiac arrhythmias. Replace potassium aggressively (20-40 mEq/hr with cardiac monitoring) and recheck before initiating insulin. IV fluids can be started simultaneously.", isFree: true }
    ],
    faqs: [
      { question: "Can DKA occur in type 2 diabetes?", answer: "Yes. While DKA is classically associated with type 1 diabetes, it can occur in type 2 diabetes, particularly in the setting of severe illness/infection, medication non-adherence, new-onset T2DM (especially in African Americans — 'ketosis-prone T2DM'), and SGLT2 inhibitor use (euglycemic DKA — where glucose may be only mildly elevated or even normal)." },
      { question: "Why does HHS have higher mortality than DKA?", answer: "HHS mortality (10-20%) is higher than DKA (1-5%) due to several factors: HHS typically affects older patients with more comorbidities, the fluid deficit is more severe (6-9L), the gradual onset leads to delayed presentation, and the extreme hyperosmolality causes more severe neurological complications. The underlying precipitating illness (e.g., MI, sepsis) also contributes to mortality." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Diabetes (DKA/HHS)", href: "/np-exam/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "Potassium Lab Values", href: "/np-exam/lab-values/potassium", type: "lab-value" },
      { title: "Insulin", href: "/np-exam/medications/insulin", type: "medication" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "stable-vs-unstable-angina", contentType: "comparison", tier: "np",
    metaTitle: "Stable vs Unstable Angina: NP Clinical Guide (2025)",
    metaDescription: "NP-level comparison of stable angina vs unstable angina covering presentation differences, workup, management, and clinical decision-making for NP certification exams.",
    keywords: "stable vs unstable angina NP, angina comparison nurse practitioner, ACS vs stable angina, chest pain evaluation NP",
    h1: "Stable vs Unstable Angina: NP Clinical Guide",
    introText: "Differentiating stable from unstable angina is a critical NP skill that determines the urgency of evaluation and management. Unstable angina is part of acute coronary syndrome (ACS) and requires emergent evaluation.",
    conditionA: { name: "Stable Angina", features: { "Pattern": "Predictable with exertion, emotional stress, or cold exposure", "Duration": "Minutes (typically <10-15 min); relieved by rest or NTG", "ECG": "Often normal at rest; may show ST changes with stress", "Troponin": "Normal (no myocardial injury)", "Risk level": "Not an acute emergency; outpatient workup appropriate", "Management": "Anti-anginal therapy (BB, NTG, CCB), risk factor modification, stress testing", "Referral urgency": "Elective cardiology referral" } },
    conditionB: { name: "Unstable Angina (ACS)", features: { "Pattern": "New onset, accelerating (crescendo), or occurring at rest", "Duration": "Prolonged (>20 min), not fully relieved by rest or NTG", "ECG": "May show ST depression, T-wave inversion, or dynamic changes", "Troponin": "Normal (distinguishes from NSTEMI — both are ACS)", "Risk level": "Part of ACS spectrum — requires emergent evaluation", "Management": "Hospitalization, DAPT, anticoagulation, risk stratification (TIMI/GRACE), possible catheterization", "Referral urgency": "Emergent/urgent cardiology evaluation" } },
    comparisonCategories: ["Pattern", "Duration", "ECG", "Troponin", "Risk level", "Management", "Referral urgency"],
    keyDifferences: [
      "Stable angina is predictable and reproducible with the same level of exertion; unstable angina is unpredictable, new, or worsening",
      "Stable angina resolves with rest or nitroglycerin; unstable angina is prolonged and may not respond to NTG",
      "Troponin is normal in both — positive troponin with ACS features = NSTEMI, not unstable angina",
      "Stable angina is managed outpatient with anti-anginal medications; unstable angina requires hospitalization as part of ACS protocol",
      "The defining question: Has the angina pattern CHANGED? If yes → unstable = ACS workup"
    ],
    clinicalPearls: [
      "Any CHANGE in a stable angina pattern (new onset, increased frequency, lower threshold, occurring at rest, longer duration) converts it to unstable angina — part of ACS",
      "Unstable angina + NSTEMI = NSTE-ACS — managed similarly with the presence or absence of troponin elevation distinguishing them",
      "Risk stratify UA/NSTEMI with TIMI or GRACE scores to determine early invasive vs conservative strategy",
      "Women, elderly, and diabetics may present with atypical angina equivalents (dyspnea, fatigue, nausea) — maintain high clinical suspicion"
    ],
    practiceQuestions: [
      { question: "A 60-year-old male with known stable angina reports that his chest pain now occurs while walking one block instead of the usual two blocks, and it takes longer to resolve with rest. ECG shows no acute changes. Troponin is negative. What is the most appropriate classification?", options: ["Stable angina — same type of pain", "Unstable angina — change in pattern", "NSTEMI", "Non-cardiac chest pain"], correctIndex: 1, rationale: "This patient's angina pattern has CHANGED: lower exertional threshold (1 block vs 2 blocks) and longer duration. Any change in a stable angina pattern — even without ECG changes or troponin elevation — reclassifies it as unstable angina (part of the ACS spectrum). He requires hospitalization, DAPT, anticoagulation, and cardiology consultation with risk stratification.", isFree: true },
      { question: "What distinguishes unstable angina from NSTEMI?", options: ["ECG findings", "Troponin levels", "Symptom severity", "Patient age"], correctIndex: 1, rationale: "Both unstable angina and NSTEMI present with ACS symptoms without ST elevation on ECG. The key distinguishing factor is troponin: NSTEMI has elevated troponin (indicating myocardial injury/necrosis), while unstable angina has normal troponin (ischemia without infarction). Both require the same initial management approach — the troponin result determines the diagnosis.", isFree: true }
    ],
    faqs: [
      { question: "How should stable angina be evaluated in the outpatient setting?", answer: "Initial workup includes resting ECG, baseline labs (lipid panel, BMP, glucose/A1C, CBC), and risk factor assessment. If symptoms are typical and patient can exercise, an exercise stress test is first-line. If unable to exercise, pharmacologic stress (dobutamine or adenosine) with imaging (echo or nuclear) is used. Positive stress test or intermediate/high-risk features warrant cardiology referral for possible catheterization." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "MI/ACS", href: "/np-exam/conditions/mi-acs", type: "condition" },
      { title: "Beta-Blockers", href: "/np-exam/medications/beta-blockers", type: "medication" },
      { title: "Statins", href: "/np-exam/medications/statins", type: "medication" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "hypothyroid-vs-hyperthyroid", contentType: "comparison", tier: "np",
    metaTitle: "Hypothyroid vs Hyperthyroid: NP Differential Diagnosis Guide (2025)",
    metaDescription: "NP-level comparison of hypothyroidism vs hyperthyroidism covering symptoms, lab interpretation, management differences, and prescribing considerations.",
    keywords: "hypothyroid vs hyperthyroid NP, thyroid comparison nurse practitioner, Hashimoto vs Graves, hypothyroidism vs hyperthyroidism NP exam",
    h1: "Hypothyroid vs Hyperthyroid: NP Clinical Guide",
    introText: "Thyroid disorders are among the most common endocrine conditions managed by NPs. Understanding the clinical, laboratory, and management differences between hypothyroidism and hyperthyroidism is essential for diagnosis and appropriate treatment.",
    conditionA: { name: "Hypothyroidism", features: { "Most common cause": "Hashimoto's thyroiditis (autoimmune, anti-TPO+)", "TSH": "Elevated (>4.5 mIU/L)", "Free T4": "Low (or normal in subclinical)", "Symptoms": "Fatigue, weight gain, cold intolerance, constipation, dry skin, bradycardia", "Physical exam": "Delayed DTR relaxation, myxedema, bradycardia, goiter (Hashimoto's)", "Treatment": "Levothyroxine (T4 replacement)", "Monitoring": "TSH 6-8 weeks after dose change; annual when stable", "Emergency": "Myxedema coma (hypothermia, obtundation, bradycardia)", "Pregnancy consideration": "Increase levothyroxine dose by 30-50%; trimester-specific TSH targets" } },
    conditionB: { name: "Hyperthyroidism", features: { "Most common cause": "Graves' disease (autoimmune, TRAb/TSI+)", "TSH": "Suppressed (<0.4 mIU/L)", "Free T4": "Elevated (or normal in subclinical or T3 toxicosis)", "Symptoms": "Weight loss, heat intolerance, palpitations, tremor, anxiety, diarrhea", "Physical exam": "Tremor, lid lag, proptosis (Graves'), tachycardia/AF, goiter (diffuse in Graves')", "Treatment": "Methimazole (first-line anti-thyroid), RAI, or thyroidectomy", "Monitoring": "Free T4 every 4-6 weeks initially; TSH may remain suppressed for months", "Emergency": "Thyroid storm (extreme tachycardia, hyperthermia >40°C, AMS)", "Pregnancy consideration": "PTU in first trimester (methimazole teratogenic); methimazole in 2nd/3rd trimester" } },
    comparisonCategories: ["Most common cause", "TSH", "Free T4", "Symptoms", "Physical exam", "Treatment", "Monitoring", "Emergency", "Pregnancy consideration"],
    keyDifferences: [
      "TSH is the key differentiator: elevated in hypothyroidism, suppressed in hyperthyroidism",
      "Treatment is fundamentally different: replacement (levothyroxine) vs suppression/ablation (methimazole, RAI, surgery)",
      "Emergency presentations are opposite: myxedema coma (cold, slow) vs thyroid storm (hot, fast)",
      "Pregnancy management differs: hypothyroidism needs dose increase; hyperthyroidism needs PTU in first trimester then methimazole",
      "Autoimmune pathophysiology differs: Hashimoto's = destructive (anti-TPO); Graves' = stimulatory (TRAb/TSI)"
    ],
    clinicalPearls: [
      "RAIU scan differentiates CAUSES of hyperthyroidism, not hypothyroidism: diffuse uptake = Graves', patchy = toxic MNG, low = thyroiditis",
      "Hashimoto's can initially present with transient HYPERthyroidism (hashitoxicosis) before progressing to permanent hypothyroidism",
      "In elderly patients, hypothyroidism may present as depression; hyperthyroidism may present as 'apathetic thyrotoxicosis' (fatigue, AF without typical hyperadrenergic symptoms)",
      "Anti-TPO antibodies predict progression of subclinical hypothyroidism to overt disease (~4.3%/year)"
    ],
    practiceQuestions: [
      { question: "A patient has TSH 0.01, free T4 4.2, diffuse goiter, and exophthalmos. What is the most likely diagnosis?", options: ["Hashimoto's thyroiditis", "Toxic multinodular goiter", "Graves' disease", "Thyroid cancer"], correctIndex: 2, rationale: "Suppressed TSH with elevated free T4 (overt hyperthyroidism) combined with diffuse goiter and exophthalmos (ophthalmopathy) is pathognomonic for Graves' disease. Exophthalmos/proptosis is unique to Graves' and occurs due to immune-mediated retro-orbital inflammation. Toxic MNG causes patchy goiter without ophthalmopathy. Hashimoto's causes hypothyroidism (high TSH).", isFree: true },
      { question: "A patient with hypothyroidism on levothyroxine becomes pregnant. What is the recommended action?", options: ["Discontinue levothyroxine — it is harmful in pregnancy", "Maintain the same dose throughout pregnancy", "Increase the dose by 30-50% and monitor TSH every 4 weeks", "Switch to methimazole for pregnancy"], correctIndex: 2, rationale: "Levothyroxine requirements increase by 30-50% in pregnancy due to increased TBG, expanded plasma volume, and placental deiodination. The dose should be increased as soon as pregnancy is confirmed (some guidelines recommend increasing by 2 extra doses per week immediately) and TSH monitored every 4 weeks through the second trimester. Untreated hypothyroidism in pregnancy increases risk of miscarriage, preeclampsia, and neurodevelopmental deficits.", isFree: true }
    ],
    faqs: [
      { question: "Can a patient have both hypothyroidism and hyperthyroidism?", answer: "Not simultaneously, but sequentially. Hashimoto's thyroiditis can initially present with transient hyperthyroidism (hashitoxicosis) as thyroid cells are destroyed and release stored hormone. This is followed by permanent hypothyroidism. Similarly, Graves' disease can 'burn out' over time or after treatment (RAI, surgery) and result in hypothyroidism requiring levothyroxine replacement." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Thyroid Disorders", href: "/np-exam/conditions/thyroid-disorders", type: "condition" },
      { title: "Levothyroxine", href: "/np-exam/medications/levothyroxine", type: "medication" },
      { title: "TSH/T3/T4 Lab Values", href: "/np-exam/lab-values/tsh-t3-t4", type: "lab-value" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "viral-vs-bacterial-pneumonia", contentType: "comparison", tier: "np",
    metaTitle: "Viral vs Bacterial Pneumonia: NP Differential Diagnosis Guide (2025)",
    metaDescription: "NP-level comparison of viral and bacterial pneumonia covering presentation differences, diagnostic workup, antibiotic decision-making, and procalcitonin use.",
    keywords: "viral vs bacterial pneumonia NP, pneumonia differential nurse practitioner, procalcitonin pneumonia, antibiotic pneumonia NP exam",
    h1: "Viral vs Bacterial Pneumonia: NP Differential Guide",
    introText: "Distinguishing viral from bacterial pneumonia guides antibiotic prescribing decisions — a key NP competency and antibiotic stewardship responsibility.",
    conditionA: { name: "Viral Pneumonia", features: { "Onset": "Gradual, preceded by URI symptoms", "Cough": "Dry/non-productive", "Fever": "Low-grade or moderate", "Chest X-ray": "Diffuse, bilateral, interstitial infiltrates", "WBC": "Normal or mildly elevated; lymphocytic predominance", "Procalcitonin": "<0.1 ng/mL (supports viral etiology)", "Common pathogens": "Influenza, RSV, SARS-CoV-2, adenovirus, rhinovirus", "Treatment": "Supportive care; antivirals for influenza (oseltamivir) if within 48 hours", "Antibiotic role": "Not indicated unless bacterial superinfection suspected" } },
    conditionB: { name: "Bacterial Pneumonia", features: { "Onset": "Acute, rapid", "Cough": "Productive with purulent sputum (rust-colored in pneumococcal)", "Fever": "High-grade with rigors", "Chest X-ray": "Lobar consolidation (typical) or focal infiltrate", "WBC": "Elevated with left shift (neutrophilia, bands >10%)", "Procalcitonin": ">0.25 ng/mL (supports bacterial etiology)", "Common pathogens": "S. pneumoniae (most common), H. influenzae, S. aureus, Klebsiella", "Treatment": "Empiric antibiotics per ATS/IDSA guidelines based on setting and severity", "Antibiotic role": "Required — delayed antibiotics increase morbidity and mortality" } },
    comparisonCategories: ["Onset", "Cough", "Fever", "Chest X-ray", "WBC", "Procalcitonin", "Common pathogens", "Treatment", "Antibiotic role"],
    keyDifferences: [
      "Viral: gradual onset, dry cough, bilateral infiltrates, normal WBC. Bacterial: acute onset, productive cough, lobar consolidation, leukocytosis",
      "Procalcitonin <0.1 strongly suggests viral; >0.25 supports bacterial — useful for antibiotic stewardship",
      "Viral pneumonia is treated supportively (antivirals for influenza); bacterial requires antibiotics",
      "Clinical features overlap significantly — in practice, empiric antibiotic coverage for CAP covers both"
    ],
    clinicalPearls: [
      "In clinical practice, definitive viral vs bacterial distinction is often impossible — ATS/IDSA CAP guidelines recommend empiric antibiotics covering both typical and atypical bacteria",
      "Procalcitonin-guided therapy can safely reduce antibiotic use by identifying patients unlikely to benefit from antibiotics",
      "Bacterial superinfection can complicate viral pneumonia (post-influenza S. aureus pneumonia is a classic example with high mortality)",
      "Influenza pneumonia should be treated with oseltamivir within 48 hours of symptom onset; benefit decreases after 48 hours but may still help in hospitalized patients"
    ],
    practiceQuestions: [
      { question: "A patient with CAP has procalcitonin of 0.08 ng/mL, normal WBC, and bilateral interstitial infiltrates. What is the most appropriate approach?", options: ["Start empiric antibiotics immediately", "Withhold antibiotics and treat supportively; reassess in 24-48 hours", "Order blood cultures before starting antibiotics", "Start antiviral therapy"], correctIndex: 1, rationale: "With procalcitonin <0.1 ng/mL, normal WBC, and bilateral interstitial infiltrates, the presentation favors viral pneumonia. Current evidence supports procalcitonin-guided antibiotic therapy: levels <0.1 suggest antibiotics can be safely withheld with close clinical monitoring and reassessment. If clinical deterioration occurs, antibiotics should be started promptly.", isFree: true }
    ],
    faqs: [
      { question: "Should you always give antibiotics for pneumonia?", answer: "No. If viral etiology is strongly suspected (low procalcitonin, viral symptoms, bilateral infiltrates, no leukocytosis), antibiotics may be withheld with close monitoring. However, in practice, most patients with CAP receive empiric antibiotics because the clinical overlap between viral and bacterial pneumonia is significant, and untreated bacterial pneumonia has serious consequences. Antibiotic stewardship involves reassessing and de-escalating based on culture and clinical response." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Pneumonia", href: "/np-exam/conditions/pneumonia", type: "condition" },
      { title: "Antibiotics Overview", href: "/np-exam/medications/antibiotics-overview", type: "medication" },
      { title: "CBC Interpretation", href: "/np-exam/lab-values/cbc-interpretation", type: "lab-value" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "crohns-vs-uc", contentType: "comparison", tier: "np",
    metaTitle: "Crohn's Disease vs Ulcerative Colitis: NP Differential Guide (2025)",
    metaDescription: "NP-level comparison of Crohn's disease and ulcerative colitis covering pathology differences, presentation, diagnostic findings, and management approaches.",
    keywords: "Crohns vs UC NP, IBD comparison nurse practitioner, Crohn disease vs ulcerative colitis, IBD differential diagnosis NP exam",
    h1: "Crohn's Disease vs Ulcerative Colitis",
    introText: "Inflammatory bowel disease (IBD) encompasses two major conditions with distinct pathological and clinical features. Accurate differentiation guides treatment selection, surgical decision-making, and long-term management.",
    conditionA: { name: "Crohn's Disease", features: { "GI involvement": "Mouth to anus; most commonly terminal ileum and colon", "Distribution": "Skip lesions (segmental, discontinuous)", "Depth of inflammation": "Transmural (full thickness)", "Rectal involvement": "Often spared", "Gross appearance": "Cobblestone mucosa, deep ulcers, strictures, fistulae", "Histology": "Non-caseating granulomas (pathognomonic but found in only 30%)", "Complications": "Fistulae, abscesses, strictures, obstruction, perianal disease", "Bloody diarrhea": "Less common (more common: abdominal pain, non-bloody diarrhea, weight loss)", "Smoking effect": "Worsens Crohn's disease (smoking is a risk factor)", "Surgery": "Not curative; recurrence common at anastomosis", "Extraintestinal": "Erythema nodosum, aphthous ulcers, kidney stones (oxalate), gallstones" } },
    conditionB: { name: "Ulcerative Colitis", features: { "GI involvement": "Colon only; starts at rectum and extends proximally in continuous fashion", "Distribution": "Continuous (no skip lesions)", "Depth of inflammation": "Mucosal and submucosal only (superficial)", "Rectal involvement": "Always involved (hallmark)", "Gross appearance": "Pseudopolyps, friable mucosa, loss of haustra (lead pipe sign on imaging)", "Histology": "Crypt abscesses, mucosal ulceration, no granulomas", "Complications": "Toxic megacolon, perforation, increased colorectal cancer risk", "Bloody diarrhea": "Hallmark symptom (frequent, bloody, mucoid stools)", "Smoking effect": "Protective (quitting smoking may trigger UC flare)", "Surgery": "Total proctocolectomy is curative", "Extraintestinal": "Primary sclerosing cholangitis (PSC), pyoderma gangrenosum, uveitis" } },
    comparisonCategories: ["GI involvement", "Distribution", "Depth of inflammation", "Rectal involvement", "Gross appearance", "Histology", "Complications", "Bloody diarrhea", "Smoking effect", "Surgery", "Extraintestinal"],
    keyDifferences: [
      "Crohn's can affect any part of the GI tract with skip lesions and transmural inflammation; UC is limited to the colon with continuous mucosal inflammation always starting at the rectum",
      "Bloody diarrhea is the hallmark of UC; Crohn's more commonly presents with abdominal pain and non-bloody diarrhea",
      "Crohn's has transmural complications (fistulae, strictures, abscesses); UC has mucosal complications (toxic megacolon, cancer risk)",
      "Smoking worsens Crohn's but is paradoxically protective in UC",
      "UC can be cured surgically (total proctocolectomy); Crohn's cannot be cured surgically and recurs at anastomosis"
    ],
    clinicalPearls: [
      "The presence of perianal disease (fistulae, abscesses, skin tags) strongly suggests Crohn's over UC",
      "Primary sclerosing cholangitis (PSC) is strongly associated with UC — screen with alkaline phosphatase and MRCP",
      "Colorectal cancer surveillance: begin 8-10 years after IBD diagnosis with annual colonoscopy (higher risk in extensive UC)",
      "Both conditions have similar extraintestinal manifestations (arthritis, eye inflammation, skin lesions) but the specific manifestations differ"
    ],
    practiceQuestions: [
      { question: "A 25-year-old presents with chronic bloody diarrhea (10 episodes/day), tenesmus, and lower abdominal cramping. Colonoscopy shows continuous inflammation from the rectum to the splenic flexure with pseudopolyps. No skip lesions. What is the most likely diagnosis?", options: ["Crohn's disease", "Ulcerative colitis", "Irritable bowel syndrome", "C. difficile colitis"], correctIndex: 1, rationale: "This presentation is classic UC: bloody diarrhea (hallmark), continuous inflammation starting at the rectum and extending proximally (left-sided UC in this case), pseudopolyps, and no skip lesions. Crohn's would show skip lesions, transmural inflammation, and potentially any GI segment. IBS does not cause visible inflammation or bloody diarrhea. C. difficile typically follows antibiotic use.", isFree: true },
      { question: "A patient with known Crohn's disease develops right lower quadrant pain, fever, and a palpable mass. What complication should be suspected?", options: ["Appendicitis", "Intra-abdominal abscess", "Colorectal cancer", "Toxic megacolon"], correctIndex: 1, rationale: "In Crohn's disease (commonly affecting the terminal ileum in the RLQ), fever with a palpable mass strongly suggests an intra-abdominal abscess — a transmural complication. Crohn's transmural inflammation leads to fistulae and abscesses, which is a key distinguishing feature from UC. Evaluation with CT abdomen with contrast is needed, and treatment involves drainage and antibiotics.", isFree: true }
    ],
    faqs: [
      { question: "How do you treat IBD in primary care?", answer: "Mild UC: 5-ASA agents (mesalamine) are first-line. Moderate-severe UC and Crohn's: immunomodulators (azathioprine, methotrexate) and/or biologics (anti-TNF agents like infliximab/adalimumab, vedolizumab, ustekinumab). Acute flares may require corticosteroids (prednisone, budesonide). NPs should co-manage with GI specialists for biologic therapy, monitoring, and cancer surveillance." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Primary Care", href: "/np-exam/primary-care", type: "category" },
      { title: "Diagnostics", href: "/np-exam/diagnostics", type: "category" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  }
];

export const npExamStrategies: NpExamStrategyPage[] = [
  {
    slug: "np-exam-study-strategy", contentType: "strategy", tier: "np",
    metaTitle: "NP Exam Study Strategy: 3-Month Study Plan for Certification Success (2025)",
    metaDescription: "Structured NP exam study strategy with 3-month timeline, daily study plans, resource recommendations, and evidence-based learning techniques for AANP/ANCC certification.",
    keywords: "NP exam study strategy, nurse practitioner study plan, AANP study guide, ANCC preparation, NP certification study schedule",
    h1: "NP Exam Study Strategy: Your Path to Certification",
    introText: "A structured, evidence-based study strategy is essential for NP certification success. This guide provides a proven 3-month framework incorporating spaced repetition, active recall, and targeted content review aligned to the exam blueprint.",
    sections: [
      { heading: "Month 1: Foundation Building (Weeks 1-4)", content: "Focus on comprehensive content review using a primary review resource (Leik, Fitzgerald, or Barkley). Study 3-4 hours daily, covering 1-2 content domains per week. Begin with assessment/diagnosis (largest domain). Take a baseline practice exam to identify your starting point and weak areas.", tips: ["Use the exam blueprint to allocate study time proportionally", "Create summary sheets for each content domain", "Begin doing 25-50 practice questions daily", "Start a 'weak areas' notebook to track recurring mistakes"] },
      { heading: "Month 2: Deepening Knowledge (Weeks 5-8)", content: "Shift focus to active learning through practice questions, case studies, and pharmacology deep dives. Increase daily practice questions to 75-100. Focus extra time on your identified weak areas. Complete pharmacology review focusing on prescribing decisions, drug interactions, and monitoring.", tips: ["Use question rationales as your primary study tool — learn from every question", "Create drug comparison tables for commonly tested medications", "Practice clinical scenarios requiring multi-step decision-making", "Review clinical guidelines (JNC, ADA, GOLD, USPSTF) focusing on treatment algorithms"] },
      { heading: "Month 3: Exam Readiness (Weeks 9-12)", content: "Focus on timed practice exams, high-yield review, and exam strategy refinement. Take at least 2-3 full-length practice exams under timed conditions. Review areas where your scores are lowest. Focus on commonly tested topics and exam pearls during the final 2 weeks. Taper studying 2-3 days before the exam.", tips: ["Simulate exam conditions: no breaks, timed, quiet environment", "Target 75-80% on practice exams as an indicator of readiness", "Review your 'weak areas' notebook for final high-yield review", "Focus on test-taking strategy and time management in the final week", "Trust your preparation — avoid learning new material in the last 3 days"] }
    ],
    practiceQuestions: [
      { question: "Which study technique has the strongest evidence for long-term knowledge retention?", options: ["Re-reading textbook chapters", "Highlighting key terms", "Practice testing (active recall) with spaced repetition", "Watching video lectures passively"], correctIndex: 2, rationale: "Research consistently shows that active recall through practice testing, combined with spaced repetition (reviewing material at increasing intervals), produces the strongest long-term retention. Re-reading and highlighting are passive strategies that create an illusion of learning without deep encoding. Active recall forces the brain to retrieve information, strengthening neural pathways.", isFree: true },
      { question: "A student scores 62% on a practice exam 6 weeks before the certification exam. What is the best response?", options: ["Postpone the exam", "Increase study hours to 8+ per day", "Analyze weak areas, adjust study plan to focus on lowest-scoring domains, and continue practice questions", "Switch to a completely different review resource"], correctIndex: 2, rationale: "A score of 62% at 6 weeks out is recoverable with a targeted approach. Analyze the practice exam to identify specific weak domains, reallocate study time to those areas, increase practice question volume in weak topics, and review rationales thoroughly. Most students improve 10-15% from their baseline practice exam scores with focused preparation. Postponing is premature at this stage.", isFree: true }
    ],
    faqs: [
      { question: "How many hours should I study per week?", answer: "Most successful candidates study 15-20 hours per week over a 3-4 month period. Quality matters more than quantity — focused, active study sessions of 2-3 hours with breaks are more effective than marathon sessions. Consistency is key: regular daily study produces better results than sporadic cramming." },
      { question: "Which review resources are recommended?", answer: "Popular and effective resources include: Leik FNP Review (comprehensive, exam-focused), Fitzgerald NP Review Course (clinical case-based), Barkley AGNP Review, and various question banks (BoardVitals, APEA, Pocket Prep). Use one primary comprehensive resource supplemented by a question bank. Avoid using too many resources — depth in one is better than breadth across many." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Practice Questions", href: "/np-exam/practice-questions", type: "category" },
      { title: "Exam Strategy", href: "/np-exam/exam-strategy", type: "category" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "differential-diagnosis-approach", contentType: "strategy", tier: "np",
    metaTitle: "Systematic Differential Diagnosis Approach for NP Exams (2025)",
    metaDescription: "Master the systematic approach to differential diagnosis for NP certification exams. Learn frameworks, clinical reasoning techniques, and common exam patterns.",
    keywords: "differential diagnosis approach NP, clinical reasoning nurse practitioner, NP exam diagnosis strategy, VINDICATE mnemonic, diagnostic reasoning NP",
    h1: "Systematic Approach to Differential Diagnosis",
    introText: "Differential diagnosis is the foundational clinical reasoning skill tested on NP certification exams. This guide provides systematic frameworks and practical techniques for generating, narrowing, and confirming diagnoses.",
    sections: [
      { heading: "Step 1: Identify the Chief Complaint and Key Features", content: "Start by identifying the patient's primary complaint, then note the critical modifiers: age, sex, chronicity (acute vs chronic), severity, location, quality, associated symptoms, and relevant medical history. These features drive the initial differential before any testing.", tips: ["Read the entire question stem before looking at answers", "Circle or note the patient's age, sex, and comorbidities — they narrow the differential significantly", "Identify the 'pivot word' — what changes the differential (e.g., sudden onset, bilateral, worst headache of my life)"] },
      { heading: "Step 2: Generate a Broad Differential Using VINDICATE", content: "Use the VINDICATE framework to systematically consider all categories of disease: Vascular, Infectious/Inflammatory, Neoplastic, Degenerative, Iatrogenic/Intoxication, Congenital, Autoimmune/Allergic, Traumatic, Endocrine/Metabolic. This prevents anchoring bias and ensures dangerous diagnoses are not missed.", tips: ["Always consider life-threatening diagnoses first — rule out the worst case scenario", "Generate 3-5 differential diagnoses ranked by probability before looking at answer options", "Consider what diagnoses would change management most urgently"] },
      { heading: "Step 3: Narrow with Targeted Questions and Testing", content: "Use specific history questions, physical exam findings, and targeted diagnostics to narrow the differential. Apply Bayesian reasoning: consider pre-test probability and how each test result changes the probability. High-sensitivity tests rule OUT (SnNOut); high-specificity tests rule IN (SpPIn).", tips: ["Ask yourself: 'What one test would most change my management?'", "Consider the cost-effectiveness and invasiveness of diagnostic testing", "Remember that common things are common — the most likely diagnosis is usually a common condition presenting typically"] }
    ],
    practiceQuestions: [
      { question: "A 35-year-old female presents with fatigue, joint pain, malar rash, and oral ulcers. ANA is positive at 1:640. What is the most likely diagnosis?", options: ["Rheumatoid arthritis", "Systemic lupus erythematosus", "Dermatomyositis", "Mixed connective tissue disease"], correctIndex: 1, rationale: "This presentation has classic features of SLE: malar (butterfly) rash, oral ulcers, arthritis, fatigue, and high-titer ANA. The key features are the malar rash (highly specific for SLE) and oral ulcers. While ANA is present in many autoimmune conditions, the clinical constellation strongly points to SLE. Next step would be anti-dsDNA antibodies (most specific for SLE) and complement levels (C3/C4).", isFree: true }
    ],
    faqs: [
      { question: "How do I avoid anchoring bias on the NP exam?", answer: "Anchoring bias occurs when you fixate on the first diagnosis that comes to mind and ignore contradictory evidence. To combat this: generate multiple differentials before committing, actively look for features that CONTRADICT your leading diagnosis, consider 'what else could this be?', and re-read the stem after choosing an answer to ensure you haven't missed key information." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Differential Diagnosis", href: "/np-exam/differential-diagnosis", type: "category" },
      { title: "Case Studies", href: "/np-exam/case-studies", type: "category" },
      { title: "Practice Questions", href: "/np-exam/practice-questions", type: "category" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "soap-notes-methodology", contentType: "strategy", tier: "np",
    metaTitle: "SOAP Notes for Nurse Practitioners: Documentation & Clinical Reasoning (2025)",
    metaDescription: "Master SOAP note methodology for NP clinical practice and certification exams. Covers structured documentation, clinical reasoning documentation, and billing/coding considerations.",
    keywords: "SOAP notes NP, nurse practitioner documentation, SOAP note writing, clinical documentation NP, NP charting methodology",
    h1: "SOAP Notes Methodology for Nurse Practitioners",
    introText: "SOAP (Subjective, Objective, Assessment, Plan) is the standard documentation framework for NP clinical encounters. Mastering SOAP methodology improves clinical reasoning, supports billing/coding, and is tested on certification exams.",
    sections: [
      { heading: "Subjective: The Patient's Story", content: "Document the chief complaint in the patient's own words, history of present illness (HPI) using OLDCARTS (Onset, Location, Duration, Character, Aggravating factors, Relieving factors, Timing, Severity), review of systems (pertinent positives and negatives), past medical/surgical history, medications, allergies, family history, and social history.", tips: ["Include pertinent negatives — they demonstrate clinical reasoning and help narrow the differential", "Document the patient's exact words for the chief complaint", "HPI should tell a clinical story that logically leads to your differential"] },
      { heading: "Objective: Clinical Data", content: "Document vital signs, physical examination findings (organized by system), and relevant diagnostic results. Focus on findings pertinent to the differential diagnosis. Note both positive and negative findings that influence your clinical decision-making.", tips: ["Be systematic and thorough but focused on the relevant systems", "Include specific measurements (e.g., 'bilateral 2+ pitting edema to mid-shin' vs 'edema present')", "Document pertinent normal findings that help rule out differentials"] },
      { heading: "Assessment: Clinical Reasoning", content: "This is the most important section — it demonstrates your clinical reasoning. List diagnoses (or differential diagnoses) with ICD-10 codes. For each diagnosis, briefly justify your reasoning linking subjective and objective data to the assessment. Prioritize diagnoses by acuity and clinical significance.", tips: ["List diagnoses in order of priority/severity", "Link your reasoning: 'Consistent with X based on [specific findings]'", "Include differential diagnoses for uncertain presentations", "Document medical decision-making complexity for billing support"] },
      { heading: "Plan: Management Decisions", content: "Document each component of the management plan: medications (with dose, route, frequency, duration), diagnostic testing ordered, referrals, patient education, follow-up timing, and return precautions. Each plan item should correspond to an assessment diagnosis.", tips: ["Organize the plan by diagnosis for clarity", "Include specific medication details (not just 'start antibiotic')", "Document patient education and shared decision-making", "Include return precautions and follow-up timeline"] }
    ],
    practiceQuestions: [
      { question: "In a SOAP note, where should the NP document the differential diagnosis and clinical reasoning?", options: ["Subjective section", "Objective section", "Assessment section", "Plan section"], correctIndex: 2, rationale: "The Assessment section is where the NP documents the diagnosis (or differential diagnoses) and clinical reasoning that connects the subjective and objective data to the diagnostic conclusion. This section demonstrates the provider's medical decision-making, which is also critical for billing and coding purposes. The higher the complexity of medical decision-making documented, the higher the billing level supported.", isFree: true }
    ],
    faqs: [
      { question: "How detailed should SOAP notes be?", answer: "SOAP notes should be thorough enough to support clinical decision-making, continuity of care, and billing requirements, but concise enough to be efficient. Key elements: complete HPI with pertinent positives/negatives, focused physical exam, clear diagnostic reasoning in the assessment, and specific plan for each diagnosis. Avoid excessive templated language that does not add clinical value." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Exam Strategy", href: "/np-exam/exam-strategy", type: "category" },
      { title: "Case Studies", href: "/np-exam/case-studies", type: "category" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  },
  {
    slug: "case-study-approach", contentType: "strategy", tier: "np",
    metaTitle: "Case Study Approach for NP Exams: Clinical Reasoning Framework (2025)",
    metaDescription: "Master the systematic approach to clinical case studies for NP certification exams. Covers case analysis techniques, common case patterns, and clinical decision-making frameworks.",
    keywords: "NP case study approach, clinical reasoning framework NP, case analysis nurse practitioner, NP exam case strategy",
    h1: "Case Study Approach for NP Certification Exams",
    introText: "Clinical case studies test your ability to integrate history, physical exam, diagnostics, and management into a comprehensive clinical decision. This guide provides a systematic framework for approaching any case on the NP certification exam.",
    sections: [
      { heading: "The 7-Step Case Analysis Framework", content: "Apply this framework to every clinical case: (1) Identify the chief complaint and key demographics. (2) Extract the most significant history and exam findings. (3) Generate your top 3 differential diagnoses. (4) Determine what diagnostic tests would confirm/exclude each differential. (5) Identify the most likely diagnosis. (6) Formulate the management plan. (7) Identify red flags requiring urgent intervention.", tips: ["Practice this framework until it becomes automatic — it works for any clinical scenario", "Pay attention to age and sex — they dramatically change pre-test probabilities", "Focus on 'what would you do NEXT' — the question usually tests the next best step, not the final diagnosis"] },
      { heading: "Common Case Patterns on NP Exams", content: "Recognize these recurring patterns: (1) Classic presentation of common disease — test pattern recognition. (2) Atypical presentation requiring deeper differential — test clinical reasoning. (3) Stable patient with acute change — test recognition of decompensation. (4) Management complication (drug interaction, side effect) — test pharmacology knowledge. (5) Prevention and screening decision — test guideline knowledge.", tips: ["If a case seems too straightforward, look for the clinical nuance being tested", "Pay attention to medications already prescribed — the question may be testing your knowledge of interactions or side effects", "Consider the patient's comorbidities — they often drive the 'best' answer among otherwise correct options"] },
      { heading: "Time Management for Case-Based Questions", content: "NP certification exams allow approximately 1.5 minutes per question. For complex cases, read the stem once carefully (noting key features), generate your answer before looking at options, then select the best match. If uncertain, eliminate clearly wrong answers and choose among the remaining options based on clinical reasoning.", tips: ["Never spend more than 3 minutes on a single question — flag and return if needed", "Read the last sentence of the stem first to know what is being asked", "Trust your clinical judgment — your first instinct is usually correct unless you have a specific reason to change"] }
    ],
    practiceQuestions: [
      { question: "A 58-year-old male with type 2 diabetes, hypertension, and CKD stage 3 presents for routine follow-up. A1C is 8.4%, BP is 148/92, LDL is 128 mg/dL. He takes metformin 1000 mg BID. What is the highest priority intervention?", options: ["Start insulin for uncontrolled diabetes", "Add an SGLT2 inhibitor for cardiorenal protection and glucose control", "Start a statin for LDL management", "All of the above are equally important"], correctIndex: 1, rationale: "While all issues need addressing, the SGLT2 inhibitor is the highest-priority addition because it provides triple benefit: glucose lowering (helps A1C), renal protection (CKD stage 3), and cardiovascular risk reduction — all major concerns in this patient. Per ADA guidelines, patients with CKD should receive an SGLT2 inhibitor regardless of A1C. A statin should also be initiated, but the SGLT2 inhibitor addresses more clinical priorities simultaneously.", isFree: true }
    ],
    faqs: [
      { question: "How do I approach questions where multiple answers seem correct?", answer: "This is common on NP exams. When multiple answers seem correct, ask: (1) Which addresses the most acute/dangerous problem? (2) Which is the FIRST thing you would do (priority)? (3) Which is supported by the strongest evidence/guidelines? (4) Which addresses the most clinical priorities simultaneously? The 'best' answer is typically the one with the highest clinical impact and strongest evidence base, not just any correct intervention." }
    ],
    internalLinks: [
      { title: "NP Exam Prep Hub", href: "/np-exam", type: "hub" },
      { title: "Case Studies", href: "/np-exam/case-studies", type: "category" },
      { title: "Practice Questions", href: "/np-exam/practice-questions", type: "category" },
      { title: "Differential Diagnosis Approach", href: "/np-exam/strategy/differential-diagnosis-approach", type: "strategy" }
    ],
    lastReviewed: "2025-03-15", reviewer: "NurseNest NP Clinical Review Team"
  }
];

export function getNpExamCategoryBySlug(slug: string): NpExamCategoryPage | undefined {
  return npExamCategories.find(c => c.slug === slug);
}

export function getNpExamConditionBySlug(slug: string): NpExamConditionPage | undefined {
  return npExamConditions.find(c => c.slug === slug);
}

export function getNpExamMedicationBySlug(slug: string): NpExamMedicationPage | undefined {
  return npExamMedications.find(m => m.slug === slug);
}

export function getNpExamLabValueBySlug(slug: string): NpExamLabValuePage | undefined {
  return npExamLabValues.find(l => l.slug === slug);
}

export function getNpExamComparisonBySlug(slug: string): NpExamComparisonPage | undefined {
  return npExamComparisons.find(c => c.slug === slug);
}

export function getNpExamStrategyBySlug(slug: string): NpExamStrategyPage | undefined {
  return npExamStrategies.find(s => s.slug === slug);
}
