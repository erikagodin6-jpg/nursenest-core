export interface MedicalAbbreviation {
  abbreviation: string;
  slug: string;
  fullForm: string;
  definition: string;
  category: AbbreviationCategory;
  clinicalExamples: string[];
  usageContext: string;
  commonMistakes?: string[];
  relatedAbbreviations: string[];
  relatedLessonSlugs: string[];
  examRelevance: string;
  faqs: { question: string; answer: string }[];
}

export type AbbreviationCategory =
  | "Communication"
  | "Medication Orders"
  | "Charting"
  | "Assessment"
  | "Procedures"
  | "Time & Frequency"
  | "Lab & Diagnostics";

export const ABBREVIATION_CATEGORIES: AbbreviationCategory[] = [
  "Communication",
  "Medication Orders",
  "Charting",
  "Assessment",
  "Procedures",
  "Time & Frequency",
  "Lab & Diagnostics",
];

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const rawAbbreviations: Omit<MedicalAbbreviation, "slug">[] = [
  {
    abbreviation: "SBAR",
    fullForm: "Situation, Background, Assessment, Recommendation",
    definition: "A structured communication framework used by healthcare professionals to convey critical patient information clearly and concisely. SBAR ensures that all essential details are communicated during handoffs, phone calls to physicians, and interdisciplinary rounds.",
    category: "Communication",
    clinicalExamples: [
      "Calling a physician about a deteriorating patient: 'Situation: Mr. Jones in Room 412 has a blood pressure of 80/50. Background: He is post-op day 1 from a hip replacement. Assessment: I believe he may be hemorrhaging. Recommendation: I recommend you come assess him immediately.'",
      "Shift-to-shift handoff between nurses covering patient care transitions.",
      "Rapid response team activation where quick, clear communication is essential.",
    ],
    usageContext: "Used in verbal and written communication across all healthcare settings including hospitals, long-term care, and community health. Widely adopted as a patient safety tool endorsed by the Joint Commission and WHO.",
    commonMistakes: [
      "Skipping the 'Recommendation' portion and only reporting data without suggesting a plan",
      "Providing excessive background information that delays the urgent message",
    ],
    relatedAbbreviations: ["ISBAR", "I-PASS"],
    relatedLessonSlugs: ["patient-communication", "clinical-handoff"],
    examRelevance: "Frequently tested on NCLEX-RN and NCLEX-PN exams in questions about safe communication, delegation, and prioritization.",
    faqs: [
      { question: "What does SBAR stand for in nursing?", answer: "SBAR stands for Situation, Background, Assessment, and Recommendation. It is a structured communication tool used to ensure patient information is conveyed clearly and completely during handoffs and critical situations." },
      { question: "When should nurses use SBAR?", answer: "Nurses should use SBAR whenever communicating patient information to other healthcare providers, including shift handoffs, phone calls to physicians, rapid response activations, and interdisciplinary team meetings." },
    ],
  },
  {
    abbreviation: "ADPIE",
    fullForm: "Assessment, Diagnosis, Planning, Implementation, Evaluation",
    definition: "The five steps of the nursing process that guide systematic, patient-centered care delivery. ADPIE provides a framework for critical thinking and clinical decision-making in all nursing practice settings.",
    category: "Assessment",
    clinicalExamples: [
      "Assessment: Collecting vital signs, performing a head-to-toe assessment, and reviewing lab values.",
      "Diagnosis: Identifying 'Risk for Falls' based on assessment data.",
      "Planning: Setting a goal that the patient will remain fall-free during hospitalization.",
      "Implementation: Applying bed alarm, placing call light within reach, and educating the patient.",
      "Evaluation: Reassessing whether the patient remained fall-free and modifying the plan if needed.",
    ],
    usageContext: "Fundamental to all nursing practice. Used in documentation, care planning, and clinical decision-making across all healthcare settings.",
    relatedAbbreviations: ["NANDA", "NIC", "NOC"],
    relatedLessonSlugs: ["nursing-process", "care-planning"],
    examRelevance: "Core concept on all nursing licensure exams. NCLEX questions frequently test the ability to apply the nursing process to clinical scenarios.",
    faqs: [
      { question: "What is ADPIE in nursing?", answer: "ADPIE represents the five steps of the nursing process: Assessment, Diagnosis, Planning, Implementation, and Evaluation. It is the foundational framework for delivering systematic nursing care." },
      { question: "Why is the nursing process important?", answer: "The nursing process ensures that patient care is systematic, evidence-based, and individualized. It promotes critical thinking and provides a standardized approach to clinical decision-making." },
    ],
  },
  {
    abbreviation: "PRN",
    fullForm: "Pro Re Nata (As Needed)",
    definition: "A Latin abbreviation meaning 'as the situation demands' or 'as needed.' Used in medication orders and care plans to indicate that a treatment or medication should be administered based on the patient's condition or request rather than on a fixed schedule.",
    category: "Medication Orders",
    clinicalExamples: [
      "Acetaminophen 650 mg PO PRN for pain — administer only when the patient reports pain.",
      "Ondansetron 4 mg IV PRN for nausea — given when the patient experiences nausea.",
      "PRN suctioning for a patient with a tracheostomy who has excess secretions.",
    ],
    usageContext: "Found on medication administration records (MAR), physician orders, and care plans. Nurses must assess the patient before administering PRN medications and document the reason for administration and the patient's response.",
    commonMistakes: [
      "Administering PRN medications without first assessing the patient's current condition",
      "Failing to document the indication for giving a PRN medication and the patient's response",
    ],
    relatedAbbreviations: ["PO", "IV", "IM", "SQ"],
    relatedLessonSlugs: ["medication-administration", "pharmacology-basics"],
    examRelevance: "Commonly tested in NCLEX questions about medication administration, documentation, and safe nursing practice.",
    faqs: [
      { question: "What does PRN mean in medical terms?", answer: "PRN stands for 'pro re nata,' a Latin phrase meaning 'as needed.' In healthcare, it indicates that a medication or treatment should be given based on the patient's condition or request, not on a fixed schedule." },
      { question: "How often can PRN medications be given?", answer: "PRN medications can be given as often as the order specifies, but they must include a minimum time interval between doses (e.g., every 4-6 hours PRN). Nurses must always assess the patient before and after administration." },
    ],
  },
  {
    abbreviation: "BID",
    fullForm: "Bis In Die (Twice Daily)",
    definition: "A Latin abbreviation indicating a medication or treatment should be administered twice per day, typically spaced approximately 12 hours apart. Used in scheduled medication orders to establish dosing frequency.",
    category: "Time & Frequency",
    clinicalExamples: [
      "Metformin 500 mg PO BID — take one tablet in the morning and one in the evening.",
      "Blood glucose monitoring BID — check before breakfast and before dinner.",
      "Wound dressing change BID — morning and evening shifts.",
    ],
    usageContext: "Used in physician orders, medication administration records, and care plans. Timing is typically standardized by facility policy (e.g., 0800 and 2000).",
    relatedAbbreviations: ["TID", "QID", "QD", "QHS"],
    relatedLessonSlugs: ["medication-administration", "medication-scheduling"],
    examRelevance: "Tested on NCLEX in questions about medication scheduling, timing, and safe administration practices.",
    faqs: [
      { question: "What does BID mean in a prescription?", answer: "BID means 'twice a day' (from the Latin 'bis in die'). Medications ordered BID are typically given approximately 12 hours apart." },
      { question: "What time should BID medications be given?", answer: "BID medications are typically administered at standardized times set by facility policy, commonly 0800 (8 AM) and 2000 (8 PM), or 0900 and 2100." },
    ],
  },
  {
    abbreviation: "TID",
    fullForm: "Ter In Die (Three Times Daily)",
    definition: "A Latin abbreviation directing that a medication or treatment be administered three times per day, typically spaced approximately 8 hours apart.",
    category: "Time & Frequency",
    clinicalExamples: [
      "Amoxicillin 500 mg PO TID — take every 8 hours to maintain therapeutic drug levels.",
      "Albuterol nebulizer TID — administer scheduled breathing treatments three times daily.",
    ],
    usageContext: "Found on medication orders, MARs, and treatment plans. Facility-standardized administration times are typically 0800, 1400, and 2000.",
    relatedAbbreviations: ["BID", "QID", "Q8H"],
    relatedLessonSlugs: ["medication-administration", "antibiotic-therapy"],
    examRelevance: "Tested on NCLEX in the context of medication administration timing and safe practice.",
    faqs: [
      { question: "What does TID mean in medical terms?", answer: "TID means 'three times a day' from the Latin 'ter in die.' Medications ordered TID are given approximately every 8 hours." },
    ],
  },
  {
    abbreviation: "STAT",
    fullForm: "Statim (Immediately)",
    definition: "A Latin term meaning 'immediately' or 'at once.' Used in medical orders to indicate that a medication, test, or procedure must be carried out right away due to urgency.",
    category: "Medication Orders",
    clinicalExamples: [
      "Epinephrine 0.3 mg IM STAT for anaphylaxis — administer immediately.",
      "STAT CBC and BMP — draw labs immediately and send to the lab urgently.",
      "Chest X-ray STAT — obtain imaging immediately for suspected pneumothorax.",
    ],
    usageContext: "Used in emergency and urgent clinical situations. STAT orders take priority over routine orders. Nurses must act on STAT orders without delay and document the time of execution.",
    commonMistakes: [
      "Treating STAT orders as routine and delaying execution",
      "Failing to communicate STAT status to ancillary departments (lab, imaging)",
    ],
    relatedAbbreviations: ["ASAP", "NOW"],
    relatedLessonSlugs: ["emergency-nursing", "medication-administration"],
    examRelevance: "Frequently tested on NCLEX in prioritization and emergency response scenarios.",
    faqs: [
      { question: "What does STAT mean in a hospital?", answer: "STAT means 'immediately' from the Latin 'statim.' When a physician writes STAT on an order, it means the medication, test, or procedure must be carried out right away without delay." },
    ],
  },
  {
    abbreviation: "NPO",
    fullForm: "Nil Per Os (Nothing By Mouth)",
    definition: "A medical directive indicating that a patient must not receive any food, liquid, or oral medications. Commonly ordered before surgery, procedures requiring sedation, or when a patient has a compromised swallowing ability.",
    category: "Charting",
    clinicalExamples: [
      "NPO after midnight for scheduled surgery the next morning.",
      "NPO status for a patient with a bowel obstruction awaiting decompression.",
      "NPO for a stroke patient pending a swallowing evaluation.",
    ],
    usageContext: "Documented on diet orders, patient whiteboards, and wristbands. Nurses must verify NPO status before administering oral medications and educate patients and family members about the restriction.",
    commonMistakes: [
      "Forgetting to hold oral medications for an NPO patient without physician clarification",
      "Allowing patients to drink water or chew gum while on NPO status",
    ],
    relatedAbbreviations: ["PO", "NG", "TPN"],
    relatedLessonSlugs: ["preoperative-care", "gastrointestinal-nursing"],
    examRelevance: "High-yield NCLEX topic in perioperative care, aspiration precautions, and pre-procedure preparation questions.",
    faqs: [
      { question: "What does NPO mean in nursing?", answer: "NPO stands for 'nil per os,' which is Latin for 'nothing by mouth.' It means the patient should not eat, drink, or take oral medications." },
      { question: "Why are patients made NPO before surgery?", answer: "Patients are NPO before surgery to reduce the risk of aspiration during anesthesia. An empty stomach minimizes the chance of stomach contents entering the lungs." },
    ],
  },
  {
    abbreviation: "I&O",
    fullForm: "Intake and Output",
    definition: "A measurement and documentation system tracking all fluids entering (intake) and leaving (output) a patient's body. Critical for assessing fluid balance, kidney function, and hydration status.",
    category: "Charting",
    clinicalExamples: [
      "Recording PO fluid intake, IV fluids, and tube feeding volumes every shift.",
      "Measuring urine output via Foley catheter collection bag hourly in critical care.",
      "Tracking wound drainage, emesis, and NG tube output.",
    ],
    usageContext: "Documented on I&O flowsheets in the medical record. Essential in critical care, post-operative units, patients with heart failure, kidney disease, or fluid imbalances.",
    relatedAbbreviations: ["UOP", "IVF", "TPN"],
    relatedLessonSlugs: ["fluid-balance", "renal-nursing"],
    examRelevance: "Tested on NCLEX in fluid and electrolyte balance questions, heart failure management, and post-operative care.",
    faqs: [
      { question: "What is I&O monitoring in nursing?", answer: "I&O (Intake and Output) monitoring involves tracking all fluids a patient receives (oral, IV, tube feeding) and all fluids lost (urine, vomit, drainage) to assess fluid balance." },
    ],
  },
  {
    abbreviation: "VS",
    fullForm: "Vital Signs",
    definition: "The fundamental physiological measurements that indicate the status of the body's vital functions. Standard vital signs include temperature, pulse, respiration rate, blood pressure, and oxygen saturation (SpO2). Pain is often considered the 'fifth vital sign.'",
    category: "Assessment",
    clinicalExamples: [
      "VS q4h — obtain vital signs every 4 hours.",
      "VS with neuro checks q2h — monitor vital signs along with neurological assessment every 2 hours.",
      "Orthostatic VS — measure blood pressure and heart rate in lying, sitting, and standing positions.",
    ],
    usageContext: "Used universally across all healthcare settings. Documented in patient flowsheets and vital signs records. Frequency of monitoring depends on patient acuity and physician orders.",
    relatedAbbreviations: ["BP", "HR", "RR", "SpO2", "T"],
    relatedLessonSlugs: ["vital-signs-assessment", "patient-assessment"],
    examRelevance: "Foundational content on all nursing exams. NCLEX tests interpretation of vital signs and appropriate nursing responses to abnormal findings.",
    faqs: [
      { question: "What are the 5 vital signs in nursing?", answer: "The five vital signs are temperature, pulse (heart rate), respiratory rate, blood pressure, and oxygen saturation (SpO2). Pain is sometimes considered the sixth vital sign." },
    ],
  },
  {
    abbreviation: "WNL",
    fullForm: "Within Normal Limits",
    definition: "A charting abbreviation indicating that an assessment finding, lab result, or physiological measurement falls within the expected normal range for the patient's age and condition.",
    category: "Charting",
    clinicalExamples: [
      "Heart sounds WNL — regular rate and rhythm, no murmurs, gallops, or rubs.",
      "Lung sounds WNL — clear bilaterally, no crackles, wheezes, or diminished sounds.",
      "Lab values WNL — CBC, BMP, and liver panel all within normal reference ranges.",
    ],
    usageContext: "Widely used in nursing documentation, assessment notes, and physician progress notes. Indicates that no abnormality was detected during assessment.",
    relatedAbbreviations: ["NAD", "NKA", "NKDA"],
    relatedLessonSlugs: ["nursing-documentation", "patient-assessment"],
    examRelevance: "Tested in documentation and charting questions on NCLEX. Understanding normal vs. abnormal findings is critical.",
    faqs: [
      { question: "What does WNL mean in medical charting?", answer: "WNL stands for 'Within Normal Limits,' indicating that an assessment finding or lab result is within the expected normal range." },
    ],
  },
  {
    abbreviation: "SOB",
    fullForm: "Shortness of Breath",
    definition: "A subjective feeling of difficulty breathing or breathlessness reported by the patient. SOB can range from mild exertional dyspnea to severe respiratory distress and may indicate cardiovascular, pulmonary, or other systemic conditions.",
    category: "Assessment",
    clinicalExamples: [
      "Patient reports SOB with ambulation — assess SpO2, respiratory rate, and lung sounds.",
      "SOB at rest — may indicate worsening heart failure or acute pulmonary embolism.",
      "New onset SOB with chest pain — warrants immediate cardiac and respiratory evaluation.",
    ],
    usageContext: "Used in nursing assessments, triage notes, and physician documentation. A critical finding requiring prompt evaluation and intervention.",
    relatedAbbreviations: ["DOE", "RR", "SpO2", "O2"],
    relatedLessonSlugs: ["respiratory-assessment", "cardiac-nursing"],
    examRelevance: "Heavily tested on NCLEX in respiratory and cardiac assessment scenarios. Nurses must prioritize and respond to SOB appropriately.",
    faqs: [
      { question: "What does SOB mean in nursing assessment?", answer: "SOB stands for 'Shortness of Breath.' It describes a patient's subjective sensation of difficulty breathing and requires assessment of oxygen saturation, respiratory rate, and lung sounds." },
    ],
  },
  {
    abbreviation: "ABG",
    fullForm: "Arterial Blood Gas",
    definition: "A laboratory test performed on blood drawn from an artery that measures pH, partial pressure of oxygen (PaO2), partial pressure of carbon dioxide (PaCO2), bicarbonate (HCO3), and oxygen saturation. Used to evaluate acid-base balance and gas exchange.",
    category: "Lab & Diagnostics",
    clinicalExamples: [
      "ABG results: pH 7.30, PaCO2 55, HCO3 24 — indicates uncompensated respiratory acidosis.",
      "Draw ABG before and after ventilator setting changes to assess effectiveness.",
      "ABG monitoring in a patient with COPD exacerbation to guide oxygen therapy.",
    ],
    usageContext: "Ordered in critical care, emergency departments, and respiratory care settings. Nurses must know proper arterial puncture technique or assist with collection and interpret results.",
    relatedAbbreviations: ["PaO2", "PaCO2", "HCO3", "SpO2"],
    relatedLessonSlugs: ["acid-base-balance", "respiratory-assessment"],
    examRelevance: "High-yield NCLEX topic. Questions frequently test ABG interpretation, identification of acid-base imbalances, and appropriate nursing interventions.",
    faqs: [
      { question: "What is an ABG test used for?", answer: "An arterial blood gas (ABG) test measures blood pH, oxygen, carbon dioxide, and bicarbonate levels to assess acid-base balance and how well the lungs are exchanging gases." },
    ],
  },
  {
    abbreviation: "BMP",
    fullForm: "Basic Metabolic Panel",
    definition: "A blood test measuring eight key substances: glucose, calcium, sodium, potassium, chloride, carbon dioxide (bicarbonate), BUN, and creatinine. Provides an overview of kidney function, blood sugar, and electrolyte balance.",
    category: "Lab & Diagnostics",
    clinicalExamples: [
      "BMP ordered to monitor electrolytes in a patient receiving IV diuretics.",
      "Daily BMP for a patient with acute kidney injury to track BUN and creatinine.",
      "BMP as part of preoperative screening labs.",
    ],
    usageContext: "One of the most commonly ordered lab panels in hospitals and outpatient settings. Results guide fluid management, medication dosing, and identification of metabolic abnormalities.",
    relatedAbbreviations: ["CMP", "CBC", "BUN", "Cr"],
    relatedLessonSlugs: ["lab-values", "fluid-electrolytes"],
    examRelevance: "NCLEX tests interpretation of BMP components and appropriate nursing responses to abnormal values, especially potassium and sodium.",
    faqs: [
      { question: "What does a BMP blood test check?", answer: "A Basic Metabolic Panel (BMP) checks glucose, calcium, sodium, potassium, chloride, bicarbonate, BUN, and creatinine to assess kidney function, blood sugar, and electrolyte levels." },
    ],
  },
  {
    abbreviation: "CBC",
    fullForm: "Complete Blood Count",
    definition: "A comprehensive blood test that measures red blood cells (RBC), white blood cells (WBC), hemoglobin, hematocrit, and platelets. Used to screen for infection, anemia, clotting disorders, and immune system function.",
    category: "Lab & Diagnostics",
    clinicalExamples: [
      "CBC with differential ordered to evaluate elevated WBC in a febrile patient.",
      "CBC to monitor hemoglobin and hematocrit after gastrointestinal bleeding.",
      "Pre-chemotherapy CBC to assess bone marrow function and platelet count.",
    ],
    usageContext: "One of the most frequently ordered labs in all healthcare settings. Essential for monitoring patients on anticoagulants, those with infections, post-surgical patients, and oncology patients.",
    relatedAbbreviations: ["WBC", "RBC", "Hgb", "Hct", "PLT"],
    relatedLessonSlugs: ["lab-values", "hematology"],
    examRelevance: "High-yield NCLEX content. Questions test interpretation of CBC values and appropriate nursing interventions for abnormal findings.",
    faqs: [
      { question: "What does a CBC test show?", answer: "A Complete Blood Count (CBC) measures red blood cells, white blood cells, hemoglobin, hematocrit, and platelets. It helps detect infections, anemia, clotting disorders, and other conditions." },
    ],
  },
  {
    abbreviation: "AC",
    fullForm: "Ante Cibum (Before Meals)",
    definition: "A Latin abbreviation used in medication orders to indicate that a drug should be taken before eating. The typical timing is 30-60 minutes before a meal to optimize absorption or therapeutic effect.",
    category: "Time & Frequency",
    clinicalExamples: [
      "Regular insulin AC and HS — administer insulin before each meal and at bedtime.",
      "Blood glucose monitoring AC — check blood sugar before meals to guide insulin dosing.",
      "Proton pump inhibitor PO AC — take before breakfast for maximum acid suppression.",
    ],
    usageContext: "Used on medication orders and MARs. Important for medications whose absorption or effectiveness is affected by food intake.",
    relatedAbbreviations: ["PC", "HS", "BID", "TID"],
    relatedLessonSlugs: ["medication-administration", "diabetes-management"],
    examRelevance: "Tested on NCLEX in medication administration timing questions, especially for insulin and diabetes management.",
    faqs: [
      { question: "What does AC mean in medical orders?", answer: "AC stands for 'ante cibum,' which is Latin for 'before meals.' It indicates a medication should be taken before eating, typically 30-60 minutes prior." },
    ],
  },
  {
    abbreviation: "PC",
    fullForm: "Post Cibum (After Meals)",
    definition: "A Latin abbreviation indicating that a medication or treatment should be administered after eating. Used to improve tolerance, reduce GI irritation, or optimize drug absorption with food.",
    category: "Time & Frequency",
    clinicalExamples: [
      "NSAIDs PO PC — take after meals to reduce gastric irritation.",
      "Blood glucose 2-hour PC — check blood sugar two hours after eating.",
    ],
    usageContext: "Found on medication orders and MARs. Commonly applied to medications known to cause stomach upset when taken on an empty stomach.",
    relatedAbbreviations: ["AC", "HS", "PO"],
    relatedLessonSlugs: ["medication-administration", "pharmacology-basics"],
    examRelevance: "Tested on NCLEX regarding proper medication timing and patient education about when to take medications.",
    faqs: [
      { question: "What does PC mean in medication orders?", answer: "PC stands for 'post cibum,' Latin for 'after meals.' It indicates a medication should be taken after eating to improve tolerance or absorption." },
    ],
  },
  {
    abbreviation: "HS",
    fullForm: "Hora Somni (At Bedtime)",
    definition: "A Latin abbreviation meaning 'at the hour of sleep' or 'at bedtime.' Used to indicate that a medication or treatment should be administered before the patient goes to sleep.",
    category: "Time & Frequency",
    clinicalExamples: [
      "Melatonin 3 mg PO HS — take at bedtime to promote sleep.",
      "Insulin glargine SQ HS — administer long-acting insulin at bedtime.",
      "HS blood glucose check — monitor blood sugar before bed for overnight management.",
    ],
    usageContext: "Used in medication orders for sedatives, long-acting insulins, and other medications best given at night. Timing is typically standardized by facility (e.g., 2100 or 2200).",
    relatedAbbreviations: ["AC", "PC", "QHS"],
    relatedLessonSlugs: ["medication-administration", "diabetes-management"],
    examRelevance: "Tested on NCLEX in medication scheduling and insulin administration questions.",
    faqs: [
      { question: "What does HS mean in a prescription?", answer: "HS stands for 'hora somni,' Latin for 'at bedtime.' It indicates a medication should be taken at bedtime, typically around 9-10 PM." },
    ],
  },
  {
    abbreviation: "ROM",
    fullForm: "Range of Motion",
    definition: "The full movement potential of a joint, measured in degrees of a circle. ROM assessment evaluates joint flexibility and function. Types include active ROM (patient moves independently), passive ROM (clinician moves the joint), and active-assisted ROM.",
    category: "Assessment",
    clinicalExamples: [
      "Post-operative knee ROM exercises — physical therapy to restore joint mobility.",
      "ROM assessment of the shoulder after rotator cuff repair.",
      "Passive ROM exercises for immobilized or comatose patients to prevent contractures.",
    ],
    usageContext: "Used in rehabilitation, orthopedic, and neurological nursing settings. Documented in physical therapy notes and nursing assessments.",
    relatedAbbreviations: ["PT", "OT", "ADL"],
    relatedLessonSlugs: ["musculoskeletal-assessment", "rehabilitation-nursing"],
    examRelevance: "Tested on NCLEX in musculoskeletal assessment and post-operative mobility questions.",
    faqs: [
      { question: "What does ROM mean in healthcare?", answer: "ROM stands for 'Range of Motion,' referring to the full movement potential of a joint. It is assessed to evaluate joint function and guide rehabilitation." },
    ],
  },
  {
    abbreviation: "ADL",
    fullForm: "Activities of Daily Living",
    definition: "Basic self-care tasks necessary for everyday functioning, including bathing, dressing, toileting, eating, grooming, and transferring. Assessing ADL capability helps determine a patient's functional status and need for assistance.",
    category: "Assessment",
    clinicalExamples: [
      "Patient requires assistance with ADLs due to left-sided weakness post-stroke.",
      "ADL assessment using the Katz Index of Independence to evaluate functional status.",
      "Discharge planning: patient can perform ADLs independently — safe for home discharge.",
    ],
    usageContext: "Used in nursing assessments, rehabilitation evaluations, discharge planning, and long-term care documentation. Critical for determining level of care needed.",
    relatedAbbreviations: ["IADL", "ROM", "PT", "OT"],
    relatedLessonSlugs: ["patient-assessment", "rehabilitation-nursing"],
    examRelevance: "Tested on NCLEX in functional assessment, delegation, and discharge planning questions.",
    faqs: [
      { question: "What are ADLs in nursing?", answer: "Activities of Daily Living (ADLs) are basic self-care tasks including bathing, dressing, toileting, eating, grooming, and transferring. Nurses assess ADL capability to determine functional status and care needs." },
    ],
  },
  {
    abbreviation: "DNR",
    fullForm: "Do Not Resuscitate",
    definition: "A legally binding medical order that instructs healthcare providers not to perform cardiopulmonary resuscitation (CPR) if a patient's heart stops beating or breathing ceases. DNR orders are made in accordance with the patient's wishes and advance directives.",
    category: "Charting",
    clinicalExamples: [
      "Patient has a signed DNR order — do not initiate CPR or call a code blue.",
      "DNR does not mean 'do not treat' — continue providing comfort care, medications, and other treatments.",
      "Verifying DNR status during patient transfer between facilities.",
    ],
    usageContext: "Documented in the medical record and on patient identification. Nurses must verify DNR status, understand its scope, and communicate it to all team members. Does not preclude other treatments unless specifically addressed.",
    commonMistakes: [
      "Assuming DNR means 'do not treat' — DNR only applies to CPR and resuscitation efforts",
      "Failing to verify DNR status on admission or transfer",
    ],
    relatedAbbreviations: ["AND", "MOLST", "POLST", "AD"],
    relatedLessonSlugs: ["ethical-nursing", "end-of-life-care"],
    examRelevance: "High-yield NCLEX topic in ethics, patient rights, advance directives, and end-of-life care questions.",
    faqs: [
      { question: "What does DNR mean in a hospital?", answer: "DNR stands for 'Do Not Resuscitate.' It is a medical order directing healthcare providers not to perform CPR if the patient's heart stops or breathing ceases, in accordance with the patient's wishes." },
      { question: "Does DNR mean no treatment?", answer: "No. A DNR order only applies to CPR and resuscitation. Patients with DNR orders continue to receive all other appropriate medical treatments, medications, and comfort care." },
    ],
  },
  {
    abbreviation: "Dx",
    fullForm: "Diagnosis",
    definition: "An abbreviation for medical diagnosis — the identification of a disease or condition through evaluation of patient history, symptoms, physical examination, and diagnostic tests.",
    category: "Charting",
    clinicalExamples: [
      "Dx: Community-acquired pneumonia — initiating antibiotic therapy.",
      "Differential Dx includes DVT, cellulitis, or musculoskeletal injury.",
      "Nursing Dx: Impaired gas exchange related to pneumonia.",
    ],
    usageContext: "Used in medical records, physician notes, nursing care plans, and interdisciplinary communication. Distinguished from nursing diagnoses (NANDA) in documentation.",
    relatedAbbreviations: ["Tx", "Hx", "Rx", "Sx"],
    relatedLessonSlugs: ["nursing-process", "clinical-reasoning"],
    examRelevance: "NCLEX tests differentiation between medical and nursing diagnoses and the application of clinical reasoning to diagnostic findings.",
    faqs: [
      { question: "What does Dx mean in medical records?", answer: "Dx is an abbreviation for 'diagnosis' — the identification of a disease or condition based on patient assessment, history, and diagnostic testing." },
    ],
  },
  {
    abbreviation: "Tx",
    fullForm: "Treatment",
    definition: "An abbreviation for treatment — the management and care provided to a patient for a diagnosed condition. Includes pharmacological, surgical, and supportive interventions.",
    category: "Charting",
    clinicalExamples: [
      "Tx plan includes IV antibiotics, fluid resuscitation, and respiratory support.",
      "Tx for hyperkalemia: calcium gluconate, insulin with dextrose, and kayexalate.",
      "Surgical Tx recommended for acute appendicitis — appendectomy.",
    ],
    usageContext: "Used in physician orders, treatment plans, and interdisciplinary documentation. Nurses implement, monitor, and evaluate treatment plans.",
    relatedAbbreviations: ["Dx", "Rx", "Hx", "Sx"],
    relatedLessonSlugs: ["nursing-process", "pharmacology-basics"],
    examRelevance: "NCLEX tests the nurse's role in implementing and evaluating treatment plans across various clinical scenarios.",
    faqs: [
      { question: "What does Tx mean in healthcare?", answer: "Tx is an abbreviation for 'treatment' — the management and interventions provided to address a patient's diagnosed condition." },
    ],
  },
  {
    abbreviation: "Hx",
    fullForm: "History",
    definition: "An abbreviation for patient history — a comprehensive record of the patient's past and present health status, including medical, surgical, family, and social history. Essential for clinical decision-making.",
    category: "Charting",
    clinicalExamples: [
      "Hx of diabetes mellitus type 2 — managed with metformin and lifestyle modifications.",
      "Surgical Hx: appendectomy (2018), cholecystectomy (2020).",
      "Family Hx significant for breast cancer and coronary artery disease.",
    ],
    usageContext: "Used in admission assessments, progress notes, and referral documentation. Collecting a thorough patient history is a core nursing competency.",
    relatedAbbreviations: ["Dx", "Tx", "PMH", "FHx"],
    relatedLessonSlugs: ["patient-assessment", "nursing-documentation"],
    examRelevance: "NCLEX tests health history collection, prioritization of historical data, and integration of history into the nursing process.",
    faqs: [
      { question: "What does Hx mean in medical terms?", answer: "Hx is an abbreviation for 'history' — a comprehensive record of a patient's past and present health information including medical, surgical, family, and social history." },
    ],
  },
  {
    abbreviation: "QD",
    fullForm: "Quaque Die (Every Day / Once Daily)",
    definition: "A Latin abbreviation meaning 'every day' or 'once daily.' Indicates that a medication or treatment should be administered one time per day. Note: Many facilities have moved to writing 'daily' instead of QD to prevent confusion with QID.",
    category: "Time & Frequency",
    clinicalExamples: [
      "Aspirin 81 mg PO QD — take one low-dose aspirin daily.",
      "Levothyroxine 50 mcg PO QD before breakfast — take on an empty stomach every morning.",
    ],
    usageContext: "Used on medication orders but increasingly replaced by 'daily' in many healthcare facilities to reduce medication errors (QD can be misread as QID).",
    commonMistakes: [
      "Confusing QD (once daily) with QID (four times daily) — many facilities now prohibit QD abbreviation",
    ],
    relatedAbbreviations: ["BID", "TID", "QID", "QOD"],
    relatedLessonSlugs: ["medication-safety", "medication-administration"],
    examRelevance: "NCLEX tests knowledge of dangerous abbreviations and safe medication administration practices. QD is on the Joint Commission's 'Do Not Use' list.",
    faqs: [
      { question: "What does QD mean in prescriptions?", answer: "QD means 'every day' or 'once daily' from the Latin 'quaque die.' However, many healthcare facilities now write 'daily' instead because QD can be confused with QID (four times daily)." },
    ],
  },
  {
    abbreviation: "SpO2",
    fullForm: "Peripheral Oxygen Saturation",
    definition: "A non-invasive measurement of the percentage of hemoglobin molecules in arterial blood that are saturated with oxygen, obtained using a pulse oximeter. Normal SpO2 is typically 95-100% in healthy adults.",
    category: "Assessment",
    clinicalExamples: [
      "SpO2 88% on room air — apply supplemental oxygen and notify the physician.",
      "Continuous SpO2 monitoring for a patient on high-flow nasal cannula.",
      "SpO2 target 88-92% for a patient with COPD to avoid suppressing respiratory drive.",
    ],
    usageContext: "Used universally in all clinical settings as part of vital signs assessment. Measured using a pulse oximeter placed on the fingertip, toe, or earlobe.",
    relatedAbbreviations: ["PaO2", "FiO2", "O2", "ABG"],
    relatedLessonSlugs: ["respiratory-assessment", "oxygen-therapy"],
    examRelevance: "High-yield NCLEX topic. Tested in respiratory assessment, oxygen therapy, and COPD management questions.",
    faqs: [
      { question: "What is a normal SpO2 level?", answer: "Normal SpO2 (peripheral oxygen saturation) is 95-100% in healthy adults. For patients with COPD, a target of 88-92% may be acceptable. An SpO2 below 90% generally indicates hypoxemia requiring intervention." },
    ],
  },
];

export const medicalAbbreviations: MedicalAbbreviation[] = rawAbbreviations.map(a => ({
  ...a,
  slug: toSlug(a.abbreviation),
}));

export function getAbbreviationBySlug(slug: string): MedicalAbbreviation | undefined {
  return medicalAbbreviations.find(a => a.slug === slug);
}

export function searchAbbreviations(query: string): MedicalAbbreviation[] {
  const q = query.toLowerCase();
  return medicalAbbreviations.filter(a =>
    a.abbreviation.toLowerCase().includes(q) ||
    a.fullForm.toLowerCase().includes(q) ||
    a.definition.toLowerCase().includes(q)
  );
}

export function getAlphabetLetters(): string[] {
  const letters = new Set(medicalAbbreviations.map(a => a.abbreviation[0].toUpperCase()));
  return Array.from(letters).sort();
}

export function getAbbreviationsByLetter(letter: string): MedicalAbbreviation[] {
  return medicalAbbreviations.filter(a => a.abbreviation[0].toUpperCase() === letter);
}

export function getAbbreviationsByCategory(category: AbbreviationCategory | null): MedicalAbbreviation[] {
  if (!category) return medicalAbbreviations;
  return medicalAbbreviations.filter(a => a.category === category);
}

export function getRelatedAbbreviations(slug: string, limit = 5): MedicalAbbreviation[] {
  const current = getAbbreviationBySlug(slug);
  if (!current) return [];
  return medicalAbbreviations
    .filter(a => a.slug !== slug && (a.category === current.category || current.relatedAbbreviations.includes(a.abbreviation)))
    .slice(0, limit);
}
