export interface ExamBlueprintTopicCategory {
  slug: string;
  name: string;
  description: string;
  questionCount: number;
  difficulty: { easy: number; moderate: number; hard: number };
  dbCategories: string[];
  sampleQuestions: {
    question: string;
    options: string[];
    correct: number;
    rationale: string;
  }[];
}

export interface ExamBlueprintPageData {
  examSlug: string;
  examName: string;
  examShortName: string;
  tier: string;
  urlPrefix: string;
  heroDescription: string;
  totalQuestions: number;
  passingInfo: string;
  timeLimit: string;
  strategyTips: string[];
  faq: { question: string; answer: string }[];
  topicCategories: ExamBlueprintTopicCategory[];
}

export const EXAM_BLUEPRINT_PAGES: ExamBlueprintPageData[] = [
  {
    examSlug: "nclex",
    examName: "NCLEX-RN",
    examShortName: "NCLEX",
    tier: "rn",
    urlPrefix: "nclex",
    heroDescription: "Master the NCLEX-RN exam with topic-organized practice questions, difficulty breakdowns, and evidence-based study strategies. Our question bank covers every content area tested on the National Council Licensure Examination for Registered Nurses.",
    totalQuestions: 0,
    passingInfo: "Computer Adaptive Testing (CAT) — 75 to 145 questions",
    timeLimit: "5 hours maximum",
    strategyTips: [
      "Focus on clinical judgment and prioritization — the NCLEX-RN emphasizes higher-order thinking over memorization.",
      "Master the ABCs (Airway, Breathing, Circulation) for prioritization questions — this framework applies to nearly every clinical scenario.",
      "Practice SATA (Select All That Apply) questions extensively — they make up a significant portion of the exam.",
      "Review pharmacology daily — drug classifications, side effects, and nursing considerations appear across all content areas.",
      "Use the process of elimination strategically — rule out obviously incorrect answers first, then compare remaining options.",
    ],
    faq: [
      { question: "How many questions are on the NCLEX-RN?", answer: "The NCLEX-RN uses Computer Adaptive Testing (CAT) with 75 to 145 questions. The exam adjusts difficulty based on your performance. If you consistently answer above the passing standard, the exam may end at 75 questions." },
      { question: "What topics are covered on the NCLEX-RN?", answer: "The NCLEX-RN covers four major client needs categories: Safe and Effective Care Environment, Health Promotion and Maintenance, Psychosocial Integrity, and Physiological Integrity. Each category includes subcategories like pharmacology, management of care, and reduction of risk potential." },
      { question: "How should I prepare for NCLEX cardiac questions?", answer: "Focus on understanding pathophysiology of common cardiac conditions (heart failure, MI, arrhythmias), EKG interpretation basics, cardiac medications (antihypertensives, anticoagulants, antiarrhythmics), and nursing interventions for acute cardiac events." },
      { question: "What is the passing score for the NCLEX-RN?", answer: "The NCLEX-RN uses a pass/fail scoring system based on the logit scale. The passing standard is set by the NCSBN and is periodically reevaluated. You need to demonstrate competence above the passing standard consistently." },
    ],
    topicCategories: [
      {
        slug: "cardiac-questions",
        name: "Cardiac & Cardiovascular",
        description: "Practice questions covering heart failure, myocardial infarction, arrhythmias, EKG interpretation, cardiac medications, and hemodynamic monitoring.",
        questionCount: 0,
        difficulty: { easy: 30, moderate: 45, hard: 25 },
        dbCategories: ["Cardiac", "Cardiovascular", "Heart Failure", "Myocardial Infarction"],
        sampleQuestions: [
          { question: "A patient with heart failure is prescribed furosemide (Lasix). Which lab value should the nurse monitor most closely?", options: ["Sodium", "Potassium", "Calcium", "Magnesium"], correct: 1, rationale: "Furosemide is a loop diuretic that causes potassium loss. Hypokalemia can lead to dangerous cardiac arrhythmias, making potassium the priority lab value to monitor." },
          { question: "A patient presents with chest pain, diaphoresis, and ST-elevation on the 12-lead EKG. What is the nurse's priority action?", options: ["Administer morphine", "Obtain a troponin level", "Activate the cardiac catheterization lab", "Start an IV and administer normal saline"], correct: 2, rationale: "ST-elevation myocardial infarction (STEMI) requires emergent percutaneous coronary intervention. Activating the cath lab is the priority to restore coronary perfusion." },
          { question: "Which finding in a patient with atrial fibrillation requires immediate nursing intervention?", options: ["Heart rate of 82 bpm", "INR of 2.5", "Blood pressure of 78/50 mmHg", "Irregular pulse rhythm"], correct: 2, rationale: "A blood pressure of 78/50 mmHg indicates hemodynamic instability in a patient with atrial fibrillation and requires immediate intervention to prevent cardiogenic shock." },
          { question: "A nurse is monitoring a patient on a continuous heparin drip. The aPTT result is 120 seconds (therapeutic range: 60-80). What is the priority nursing action?", options: ["Continue the current infusion rate", "Stop the heparin infusion and notify the provider", "Increase the infusion rate", "Administer a heparin bolus"], correct: 1, rationale: "An aPTT of 120 seconds is significantly above the therapeutic range, indicating excessive anticoagulation and increased bleeding risk. The nurse should stop the infusion and notify the provider for dose adjustment." },
          { question: "A patient with a new pacemaker asks when they can resume normal activities. What is the best nursing response?", options: ["You can resume all activities immediately", "Avoid raising the affected arm above shoulder height for 4-6 weeks", "You will never be able to exercise again", "You can lift heavy objects after 1 week"], correct: 1, rationale: "After pacemaker insertion, patients should avoid raising the affected arm above shoulder height for 4-6 weeks to prevent lead displacement. Gradual return to activities is recommended based on provider guidance." },
        ],
      },
      {
        slug: "pharmacology-practice",
        name: "Pharmacology",
        description: "Drug classifications, mechanisms of action, side effects, nursing considerations, and patient education for commonly tested medications on the NCLEX-RN.",
        questionCount: 0,
        difficulty: { easy: 25, moderate: 50, hard: 25 },
        dbCategories: ["Pharmacology", "Pharmacological"],
        sampleQuestions: [
          { question: "A patient is prescribed warfarin (Coumadin). Which dietary instruction should the nurse provide?", options: ["Increase intake of foods high in vitamin K", "Maintain a consistent intake of vitamin K-rich foods", "Avoid all green vegetables completely", "Take the medication with grapefruit juice"], correct: 1, rationale: "Patients on warfarin should maintain a consistent intake of vitamin K-rich foods to prevent fluctuations in INR levels. Sudden changes in vitamin K intake can make the medication more or less effective." },
          { question: "A nurse is administering digoxin to a patient. Which assessment finding would cause the nurse to hold the medication?", options: ["Blood pressure of 130/80 mmHg", "Apical pulse of 56 bpm", "Respiratory rate of 18 breaths/min", "Temperature of 37.2°C"], correct: 1, rationale: "Digoxin slows the heart rate. An apical pulse below 60 bpm in an adult is a contraindication for administration due to the risk of bradycardia and heart block." },
          { question: "Which adverse effect of ACE inhibitors should the nurse teach the patient to report immediately?", options: ["Dry cough", "Angioedema", "Mild dizziness upon standing", "Slight decrease in blood pressure"], correct: 1, rationale: "Angioedema (swelling of the face, lips, tongue, or throat) is a serious and potentially life-threatening adverse effect of ACE inhibitors that requires immediate medical attention." },
          { question: "A patient is prescribed metoprolol (Lopressor). Which assessment is most important before administration?", options: ["Blood glucose level", "Heart rate and blood pressure", "Respiratory rate", "Temperature"], correct: 1, rationale: "Metoprolol is a beta-blocker that decreases heart rate and blood pressure. The nurse must assess both before administration and hold the medication if heart rate is below 60 bpm or blood pressure is significantly low." },
          { question: "A patient receiving IV vancomycin reports flushing, itching, and a rash on the upper body. What is the most likely cause?", options: ["Anaphylaxis", "Red man syndrome from rapid infusion", "Drug allergy requiring epinephrine", "Normal side effect requiring no intervention"], correct: 1, rationale: "Red man syndrome is caused by rapid IV infusion of vancomycin. The nurse should stop the infusion, slow the rate, and administer diphenhydramine as ordered. It is a histamine-mediated reaction, not a true allergy." },
        ],
      },
      {
        slug: "respiratory-questions",
        name: "Respiratory",
        description: "Questions covering COPD, asthma, pneumonia, pneumothorax, TB, oxygen therapy, mechanical ventilation, and ABG interpretation.",
        questionCount: 0,
        difficulty: { easy: 30, moderate: 45, hard: 25 },
        dbCategories: ["Respiratory", "Pulmonary", "Pulmonary Embolism"],
        sampleQuestions: [
          { question: "A patient with COPD has an oxygen saturation of 88%. The nurse should set the oxygen flow rate to maintain SpO2 at which target?", options: ["95-100%", "88-92%", "80-85%", "98-100%"], correct: 1, rationale: "COPD patients have a hypoxic drive for breathing. Maintaining SpO2 at 88-92% prevents suppression of the respiratory drive while providing adequate oxygenation." },
          { question: "A patient with a chest tube has continuous bubbling in the water seal chamber. What does this indicate?", options: ["Normal drainage function", "An air leak in the system", "The lung has fully re-expanded", "Fluid overload"], correct: 1, rationale: "Continuous bubbling in the water seal chamber indicates an air leak in the pleural drainage system. The nurse should check all connections and assess the insertion site." },
          { question: "An ABG result shows pH 7.30, PaCO2 55 mmHg, HCO3 24 mEq/L. Which condition does this represent?", options: ["Metabolic acidosis", "Respiratory acidosis", "Metabolic alkalosis", "Respiratory alkalosis"], correct: 1, rationale: "The low pH (acidosis) with elevated PaCO2 and normal HCO3 indicates uncompensated respiratory acidosis, suggesting the patient is retaining CO2 due to impaired ventilation." },
          { question: "A patient with asthma is using a metered-dose inhaler (MDI) with a spacer. What is the correct technique the nurse should teach?", options: ["Exhale fully, press the inhaler, then inhale slowly and deeply", "Inhale quickly and forcefully while pressing the inhaler", "Hold breath for 2 seconds after inhalation", "Take two quick puffs in rapid succession"], correct: 0, rationale: "The correct technique is to exhale fully, press the MDI into the spacer, then inhale slowly and deeply over 3-5 seconds, followed by holding the breath for 10 seconds to allow medication deposition in the lungs." },
          { question: "A patient is placed on airborne precautions for suspected tuberculosis. Which type of respiratory protection should the nurse wear?", options: ["Standard surgical mask", "N95 respirator", "Face shield only", "No mask is needed if the door is closed"], correct: 1, rationale: "Tuberculosis is transmitted via airborne droplet nuclei. An N95 respirator (or higher) is required for healthcare workers entering the room. The patient should be in a negative-pressure airborne infection isolation room." },
        ],
      },
      {
        slug: "mental-health-questions",
        name: "Mental Health & Psychiatric",
        description: "Psychosocial integrity questions covering therapeutic communication, crisis intervention, substance abuse, psychiatric medications, and nursing care for mental health disorders.",
        questionCount: 0,
        difficulty: { easy: 35, moderate: 40, hard: 25 },
        dbCategories: ["Mental Health", "Psychiatry"],
        sampleQuestions: [
          { question: "A patient states, 'I just can't go on anymore.' What is the nurse's best response?", options: ["Everything will be okay", "Are you thinking about hurting yourself?", "You should talk to your family about this", "Let me get the doctor for you"], correct: 1, rationale: "Directly asking about suicidal ideation is the most appropriate therapeutic response. It does not plant the idea but rather shows the patient it is safe to discuss their feelings and allows for proper safety assessment." },
          { question: "A patient with bipolar disorder is prescribed lithium. Which lab value is essential to monitor?", options: ["Lithium level", "Hemoglobin A1C", "Albumin", "Bilirubin"], correct: 0, rationale: "Lithium has a narrow therapeutic range (0.6-1.2 mEq/L). Regular lithium level monitoring is essential to prevent toxicity, which can cause seizures, renal failure, and cardiac arrhythmias." },
          { question: "Which behavior in a patient with anorexia nervosa indicates a positive response to treatment?", options: ["Hiding food in their room", "Expressing willingness to attend group therapy", "Excessive exercise after meals", "Wearing baggy clothing"], correct: 1, rationale: "Willingness to attend group therapy indicates engagement in treatment and recognition of the need for help, which is a positive step in recovery from anorexia nervosa." },
          { question: "A nurse is caring for a patient experiencing alcohol withdrawal. Which assessment finding indicates the most serious complication?", options: ["Mild hand tremors", "Anxiety and restlessness", "Visual hallucinations and seizures", "Nausea and diaphoresis"], correct: 2, rationale: "Visual hallucinations and seizures indicate delirium tremens, the most serious and potentially fatal complication of alcohol withdrawal. This requires immediate medical intervention including benzodiazepine administration." },
          { question: "A patient with schizophrenia is prescribed clozapine. Which lab test must be monitored regularly?", options: ["Liver function tests", "Absolute neutrophil count (ANC)", "Hemoglobin A1C", "Serum creatinine"], correct: 1, rationale: "Clozapine carries a risk of agranulocytosis, a life-threatening decrease in white blood cells. Regular ANC monitoring is mandatory through the Clozapine REMS program to detect this adverse effect early." },
        ],
      },
    ],
  },
  {
    examSlug: "rex-pn",
    examName: "REx-PN (Regulatory Exam — Practical Nurse)",
    examShortName: "REx-PN",
    tier: "rpn",
    urlPrefix: "rex-pn",
    heroDescription: "Prepare for the REx-PN (Regulatory Exam for Practical Nurses) with targeted practice questions organized by competency area. Our question bank aligns with the Canadian practical nursing exam blueprint to help you pass with confidence.",
    totalQuestions: 0,
    passingInfo: "Computer Adaptive Testing (CAT) — 60 to 150 questions",
    timeLimit: "4 hours maximum",
    strategyTips: [
      "Understand the REx-PN competency framework — questions are mapped to the four competency categories defined by the Canadian regulatory bodies.",
      "Focus on scope of practice questions — knowing what RPNs can and cannot do independently is heavily tested.",
      "Practice medication calculation questions — dosage calculations for oral, IV, and weight-based medications appear frequently.",
      "Review delegation and assignment principles — understanding which tasks can be delegated to unregulated care providers is essential.",
      "Familiarize yourself with the CAT format — the exam adapts difficulty based on your performance, so each question matters equally.",
    ],
    faq: [
      { question: "What is the REx-PN exam?", answer: "The REx-PN (Regulatory Exam — Practical Nurse) is the Canadian licensing examination for practical nurses (RPNs/LPNs). It uses Computer Adaptive Testing (CAT) and covers clinical competencies required for entry-level practical nursing practice in Canada." },
      { question: "How many questions are on the REx-PN?", answer: "The REx-PN uses CAT technology with 60 to 150 questions. The exam ends when it has enough information to determine whether you meet the passing standard, or when you reach the maximum number of questions." },
      { question: "What topics does the REx-PN cover?", answer: "The REx-PN covers four competency categories: Professional Responsibility and Accountability, Knowledge-Based Practice, Ethical Practice, and Service to the Public. Questions span clinical scenarios, pharmacology, patient safety, and legal/ethical considerations." },
      { question: "How should I study pharmacology for the REx-PN?", answer: "Focus on common medication classes prescribed in practical nursing settings, dosage calculations, drug interactions, and patient teaching. Pay special attention to medications you will encounter in medical-surgical, maternal-child, and mental health nursing." },
    ],
    topicCategories: [
      {
        slug: "pharmacology-practice",
        name: "Pharmacology & Medication Administration",
        description: "Drug classifications, dosage calculations, medication safety, side effects, and nursing considerations for practical nursing practice.",
        questionCount: 0,
        difficulty: { easy: 30, moderate: 45, hard: 25 },
        dbCategories: ["Pharmacology", "Pharmacological Therapies"],
        sampleQuestions: [
          { question: "A practical nurse is preparing to administer insulin to a patient. Which action is most important before administration?", options: ["Check the patient's blood glucose level", "Ask the patient if they are hungry", "Check the insulin expiry date only", "Administer the insulin immediately after drawing it up"], correct: 0, rationale: "Checking the blood glucose level before insulin administration is essential to prevent hypoglycemia and ensure the correct dose is appropriate for the patient's current glucose level." },
          { question: "A patient is prescribed amoxicillin 500mg PO TID. How many milligrams will the patient receive in 24 hours?", options: ["500 mg", "1000 mg", "1500 mg", "2000 mg"], correct: 2, rationale: "TID means three times daily. 500 mg × 3 = 1500 mg in 24 hours." },
          { question: "Which medication requires the nurse to check the apical pulse for one full minute before administration?", options: ["Metformin", "Digoxin", "Acetaminophen", "Omeprazole"], correct: 1, rationale: "Digoxin affects heart rate and rhythm. The apical pulse must be assessed for a full minute before administration. Hold if the rate is below 60 bpm in adults." },
          { question: "A patient is receiving an IV antibiotic and develops hives and difficulty breathing. What is the nurse's priority action?", options: ["Slow the infusion rate", "Stop the infusion immediately and call for help", "Administer diphenhydramine and continue the infusion", "Document the reaction and continue monitoring"], correct: 1, rationale: "Hives and difficulty breathing suggest anaphylaxis. The nurse must immediately stop the infusion to prevent further allergen exposure and call for emergency assistance. Epinephrine may be needed." },
          { question: "A patient on warfarin has an INR of 5.2. Which nursing action is most appropriate?", options: ["Administer the next scheduled dose", "Hold warfarin and notify the provider", "Double the dose to reach therapeutic range", "Give vitamin K without provider notification"], correct: 1, rationale: "An INR of 5.2 is supratherapeutic, placing the patient at high risk for bleeding. The nurse should hold the warfarin and notify the provider, who may order vitamin K or dose adjustment." },
        ],
      },
      {
        slug: "clinical-practice-questions",
        name: "Clinical Nursing Practice",
        description: "Medical-surgical nursing scenarios, patient assessment, vital signs interpretation, wound care, and clinical decision-making for practical nurses.",
        questionCount: 0,
        difficulty: { easy: 25, moderate: 50, hard: 25 },
        dbCategories: ["Clinical", "Fundamentals", "Medical-Surgical"],
        sampleQuestions: [
          { question: "A practical nurse is assessing a patient 2 hours post-operatively. Which finding requires immediate notification of the registered nurse?", options: ["Temperature of 37.1°C", "Pain level of 4/10", "Urine output of 10 mL in the past hour", "Mild drowsiness"], correct: 2, rationale: "Urine output below 30 mL/hour may indicate decreased renal perfusion or hypovolemia and requires immediate reporting for further assessment and intervention." },
          { question: "When performing a head-to-toe assessment, in what order should the nurse assess body systems?", options: ["Random order based on patient complaints", "Neurological, respiratory, cardiovascular, gastrointestinal, genitourinary, musculoskeletal, integumentary", "Integumentary first, then internal systems", "Only assess the system related to the chief complaint"], correct: 1, rationale: "A systematic head-to-toe assessment follows a consistent order starting with neurological (level of consciousness) and progressing through major body systems to ensure no findings are missed." },
          { question: "A patient's wound shows red, granulating tissue with no signs of infection. How should the nurse document this finding?", options: ["Wound is necrotic", "Wound is showing signs of healing", "Wound requires debridement", "Wound has dehisced"], correct: 1, rationale: "Red, granulating tissue is a sign of healthy wound healing. Granulation tissue indicates new blood vessel formation and tissue repair in the proliferative phase of wound healing." },
          { question: "A patient has a nasogastric (NG) tube for gastric decompression. The nurse notes that the tube has not drained in 2 hours. What is the first action?", options: ["Remove and replace the tube", "Irrigate the tube with 30 mL of normal saline", "Reposition the patient and check tube placement", "Notify the physician immediately"], correct: 2, rationale: "Before irrigating or replacing, the nurse should first reposition the patient and verify tube placement. The tube may be kinked, positioned against the gastric wall, or displaced." },
          { question: "A patient with diabetes reports tingling and numbness in both feet. Which nursing assessment is most important?", options: ["Check capillary blood glucose", "Perform a focused peripheral vascular and neurological foot assessment", "Assess for signs of dehydration", "Check the patient's last A1C result"], correct: 1, rationale: "Tingling and numbness in the feet suggest peripheral neuropathy, a common complication of diabetes. A focused foot assessment checks sensation, circulation, skin integrity, and reflexes to guide interventions." },
        ],
      },
      {
        slug: "professional-practice-questions",
        name: "Professional Responsibility & Ethics",
        description: "Scope of practice, delegation, ethical decision-making, documentation, patient rights, and professional accountability questions for practical nurses.",
        questionCount: 0,
        difficulty: { easy: 35, moderate: 45, hard: 20 },
        dbCategories: ["Leadership", "Ethics", "Delegation", "Safety"],
        sampleQuestions: [
          { question: "A practical nurse is asked by a family member to share information about a patient's diagnosis. What is the most appropriate response?", options: ["Share the information since they are family", "Refer the family member to the attending physician", "Tell them to ask the patient directly", "Check if the patient has given consent to share information with this person"], correct: 3, rationale: "Patient confidentiality is a legal and ethical obligation. The nurse must verify that the patient has authorized information sharing with the specific family member before disclosing any health information." },
          { question: "Which task can a practical nurse delegate to an unregulated care provider (UCP)?", options: ["Administering oral medications", "Performing an initial patient assessment", "Assisting a stable patient with ambulation", "Interpreting lab results"], correct: 2, rationale: "Assisting a stable patient with ambulation is within the scope of an unregulated care provider. Medication administration, initial assessments, and lab interpretation require the knowledge and judgment of a licensed nurse." },
          { question: "A practical nurse makes a medication error but no patient harm occurred. What is the most appropriate first action?", options: ["Do not report since no harm occurred", "Complete an incident report and notify the charge nurse", "Tell only the patient's family", "Wait to see if any symptoms develop"], correct: 1, rationale: "All medication errors must be reported regardless of patient outcome. Completing an incident report and notifying the charge nurse allows for proper follow-up, system improvement, and patient safety monitoring." },
          { question: "A patient refuses a prescribed treatment. What is the nurse's most appropriate response?", options: ["Administer the treatment anyway for the patient's benefit", "Document the refusal and notify the healthcare provider", "Tell the patient they must comply with medical orders", "Ignore the refusal and try again later"], correct: 1, rationale: "Patients have the right to refuse treatment. The nurse must respect this autonomy, document the refusal and the reason if given, educate the patient about consequences, and notify the healthcare provider." },
          { question: "During a fire alarm, which patients should the nurse evacuate first from the unit?", options: ["Patients closest to the exit", "Ambulatory patients who can walk independently", "Patients in immediate danger near the fire", "Patients with the most complex medical needs"], correct: 2, rationale: "Following the RACE protocol (Rescue, Alarm, Contain, Extinguish/Evacuate), patients in immediate danger near the fire should be rescued first, regardless of their mobility status or proximity to exits." },
        ],
      },
    ],
  },
  {
    examSlug: "np-primary-care",
    examName: "Nurse Practitioner Certification Exam",
    examShortName: "NP Exam",
    tier: "np",
    urlPrefix: "np-exam",
    heroDescription: "Prepare for Nurse Practitioner certification exams (AANP, ANCC) with advanced practice questions covering primary care, differential diagnosis, pharmacology, and clinical management. Our question bank reflects real exam complexity and clinical reasoning demands.",
    totalQuestions: 0,
    passingInfo: "150-200 questions (varies by certifying body)",
    timeLimit: "3-4 hours depending on certifying body",
    strategyTips: [
      "Master differential diagnosis — NP exams test your ability to distinguish between conditions with overlapping symptoms.",
      "Know your prescribing guidelines — pharmacology questions focus on first-line treatments, contraindications, and drug interactions at an advanced practice level.",
      "Study evidence-based guidelines — USPSTF screening recommendations, JNC hypertension guidelines, and ADA diabetes standards are heavily tested.",
      "Focus on clinical reasoning over memorization — NP exams require you to apply knowledge to complex patient scenarios.",
      "Practice time management — pace yourself through the exam, flagging difficult questions and returning to them after completing easier ones.",
    ],
    faq: [
      { question: "What NP certification exams are available?", answer: "The two main NP certification exams in the United States are the AANP (American Association of Nurse Practitioners) and ANCC (American Nurses Credentialing Center) exams. Specialty certifications include AGPCNP, AGACNP, PMHNP, PNP, WHNP, and ENP." },
      { question: "What topics are on the NP certification exam?", answer: "NP exams cover advanced health assessment, differential diagnosis, pharmacotherapy, clinical management, health promotion, disease prevention, and professional role development. The specific content areas and weightings vary between AANP and ANCC." },
      { question: "How do I prepare for NP exam pharmacology questions?", answer: "Focus on prescribing guidelines for common conditions (hypertension, diabetes, infections, mental health), drug interactions, contraindications in special populations (pregnancy, renal/hepatic impairment), and controlled substance regulations." },
      { question: "What is the pass rate for NP certification exams?", answer: "First-time pass rates vary by program and exam type. The AANP FNP exam has historically had a first-time pass rate around 80-85%. Thorough preparation with a structured study plan and practice questions significantly improves your chances of passing." },
    ],
    topicCategories: [
      {
        slug: "primary-care-questions",
        name: "Primary Care & Clinical Management",
        description: "Diagnosis and management of common primary care conditions, chronic disease management, health screenings, and patient education for nurse practitioners.",
        questionCount: 0,
        difficulty: { easy: 20, moderate: 45, hard: 35 },
        dbCategories: ["Community Health", "Preventive Medicine", "Fundamentals"],
        sampleQuestions: [
          { question: "A 55-year-old patient presents with a fasting blood glucose of 135 mg/dL on two separate occasions. A1C is 7.2%. What is the most appropriate initial management?", options: ["Start insulin therapy", "Initiate metformin and lifestyle modifications", "Recheck labs in 6 months with no treatment", "Refer to endocrinology immediately"], correct: 1, rationale: "Metformin is the first-line pharmacological treatment for newly diagnosed type 2 diabetes, combined with lifestyle modifications (diet, exercise, weight management). The A1C of 7.2% does not warrant insulin initiation at this stage." },
          { question: "According to USPSTF guidelines, at what age should average-risk patients begin colorectal cancer screening?", options: ["40 years", "45 years", "50 years", "55 years"], correct: 1, rationale: "The USPSTF updated guidelines in 2021 to recommend colorectal cancer screening beginning at age 45 for average-risk adults, lowered from the previous recommendation of age 50." },
          { question: "A patient with a history of GERD presents with worsening symptoms despite 8 weeks of PPI therapy. What is the most appropriate next step?", options: ["Double the PPI dose indefinitely", "Refer for upper endoscopy (EGD)", "Switch to an H2 blocker", "Discontinue all medications and reassess"], correct: 1, rationale: "Patients with GERD symptoms refractory to 8 weeks of PPI therapy should be referred for upper endoscopy to rule out complications such as Barrett's esophagus, esophagitis, or malignancy." },
          { question: "A 62-year-old patient with hypertension and a BMI of 32 asks about starting an exercise program. What is the most appropriate NP recommendation?", options: ["Avoid exercise until blood pressure is controlled", "Begin with 150 minutes per week of moderate-intensity aerobic activity", "Start with high-intensity interval training immediately", "Exercise is not recommended for patients with hypertension"], correct: 1, rationale: "Current guidelines recommend at least 150 minutes per week of moderate-intensity aerobic activity for adults with hypertension. Exercise helps reduce blood pressure by 5-8 mmHg and supports weight management." },
          { question: "A patient presents with a 2-week history of productive cough, low-grade fever, and night sweats. Chest X-ray shows an upper lobe infiltrate. What should the NP order next?", options: ["Azithromycin for community-acquired pneumonia", "Sputum for acid-fast bacilli (AFB) smear and culture", "Chest CT with contrast", "Oral prednisone for inflammation"], correct: 1, rationale: "Upper lobe infiltrate with night sweats and prolonged productive cough is suspicious for pulmonary tuberculosis. Sputum AFB smear and culture is the next step for diagnosis, and the patient should be placed on airborne precautions." },
        ],
      },
      {
        slug: "pharmacology-advanced",
        name: "Advanced Pharmacology",
        description: "Prescribing guidelines, drug interactions, pharmacokinetics, special population considerations, and evidence-based medication selection for nurse practitioners.",
        questionCount: 0,
        difficulty: { easy: 15, moderate: 45, hard: 40 },
        dbCategories: ["Pharmacology", "Pharmacological"],
        sampleQuestions: [
          { question: "A nurse practitioner is prescribing an antihypertensive for a patient with Type 2 diabetes and proteinuria. Which medication class is most appropriate?", options: ["Calcium channel blocker", "ACE inhibitor", "Beta blocker", "Thiazide diuretic"], correct: 1, rationale: "ACE inhibitors provide both antihypertensive effects and renal protective benefits in patients with diabetes and proteinuria by reducing intraglomerular pressure and slowing the progression of diabetic nephropathy." },
          { question: "Which antibiotic is contraindicated in a pregnant patient with a urinary tract infection?", options: ["Amoxicillin", "Cephalexin", "Trimethoprim-sulfamethoxazole in the first trimester", "Nitrofurantoin in the second trimester"], correct: 2, rationale: "Trimethoprim-sulfamethoxazole is contraindicated in the first trimester due to its folate antagonism, which increases the risk of neural tube defects. It should also be avoided near term due to risk of kernicterus." },
          { question: "A patient on warfarin is started on fluconazole for a vaginal yeast infection. What should the nurse practitioner anticipate?", options: ["Decreased INR — increase warfarin dose", "No interaction — continue current warfarin dose", "Increased INR — decrease warfarin dose and monitor closely", "Need to switch from warfarin to a DOAC"], correct: 2, rationale: "Fluconazole inhibits CYP2C9, the enzyme that metabolizes warfarin. This interaction significantly increases warfarin levels and INR, raising the risk of bleeding. The warfarin dose should be reduced and INR monitored closely." },
          { question: "An elderly patient is prescribed a new medication. The NP notes the patient has a creatinine clearance of 25 mL/min. Which pharmacokinetic consideration is most important?", options: ["Increased hepatic metabolism", "Decreased renal excretion requiring dose adjustment", "Enhanced drug absorption from the GI tract", "No dosing changes needed for renal function"], correct: 1, rationale: "A creatinine clearance of 25 mL/min indicates significant renal impairment. Many medications are renally excreted and require dose reduction or extended dosing intervals to prevent drug accumulation and toxicity." },
          { question: "A patient taking an SSRI for depression wants to start St. John's Wort for additional benefit. What should the NP advise?", options: ["It is safe to combine both treatments", "Avoid St. John's Wort due to risk of serotonin syndrome", "Replace the SSRI with St. John's Wort", "Add St. John's Wort at a low dose and titrate up"], correct: 1, rationale: "St. John's Wort has serotonergic properties. Combining it with an SSRI significantly increases the risk of serotonin syndrome, a potentially life-threatening condition characterized by agitation, hyperthermia, and neuromuscular changes." },
        ],
      },
      {
        slug: "differential-diagnosis",
        name: "Differential Diagnosis & Assessment",
        description: "Advanced health assessment, clinical reasoning, differential diagnosis processes, and diagnostic test interpretation for nurse practitioner practice.",
        questionCount: 0,
        difficulty: { easy: 15, moderate: 40, hard: 45 },
        dbCategories: ["Critical Care", "Emergency", "Multi-system"],
        sampleQuestions: [
          { question: "A 32-year-old female presents with fatigue, weight gain, constipation, and cold intolerance. TSH is 8.5 mU/L (normal 0.5-4.5). What is the most likely diagnosis?", options: ["Cushing syndrome", "Primary hypothyroidism", "Adrenal insufficiency", "Type 2 diabetes mellitus"], correct: 1, rationale: "Elevated TSH with symptoms of fatigue, weight gain, constipation, and cold intolerance are classic findings of primary hypothyroidism. The elevated TSH indicates the thyroid gland is not producing adequate thyroid hormone." },
          { question: "A patient presents with acute onset of unilateral leg swelling, warmth, and tenderness. D-dimer is elevated. What is the priority diagnostic test?", options: ["X-ray of the affected leg", "Compression ultrasound of the affected leg", "CT scan of the chest", "Complete blood count"], correct: 1, rationale: "Compression ultrasound is the gold standard for diagnosing deep vein thrombosis (DVT). The clinical presentation and elevated D-dimer are highly suggestive of DVT, and ultrasound provides rapid, non-invasive confirmation." },
          { question: "A 68-year-old presents with sudden-onset, painless vision loss in one eye. Fundoscopic exam reveals a 'cherry red spot' on the macula. What is the most likely diagnosis?", options: ["Acute angle-closure glaucoma", "Central retinal artery occlusion", "Diabetic retinopathy", "Age-related macular degeneration"], correct: 1, rationale: "A cherry red spot on the macula with sudden painless vision loss is pathognomonic for central retinal artery occlusion (CRAO). This is an ophthalmologic emergency requiring immediate referral." },
          { question: "A 45-year-old patient presents with episodic headaches, palpitations, and diaphoresis. Blood pressure is 210/120 mmHg. Which condition should the NP suspect?", options: ["Essential hypertension", "Pheochromocytoma", "Hyperthyroidism", "Panic disorder"], correct: 1, rationale: "The triad of episodic headaches, palpitations, and diaphoresis with severe hypertension is classic for pheochromocytoma, a catecholamine-secreting tumor of the adrenal medulla. Plasma metanephrines should be ordered." },
          { question: "A patient presents with a painful, swollen, erythematous first metatarsophalangeal joint. Serum uric acid is 9.2 mg/dL. What is the most likely diagnosis?", options: ["Rheumatoid arthritis", "Osteoarthritis", "Acute gouty arthritis", "Septic arthritis"], correct: 2, rationale: "Acute onset of a painful, swollen, erythematous first MTP joint (podagra) with elevated serum uric acid is the classic presentation of acute gouty arthritis. Joint aspiration showing monosodium urate crystals confirms the diagnosis." },
        ],
      },
    ],
  },
];

export function getExamBlueprintByPrefix(urlPrefix: string): ExamBlueprintPageData | undefined {
  return EXAM_BLUEPRINT_PAGES.find(p => p.urlPrefix === urlPrefix);
}

export function getExamBlueprintTopic(urlPrefix: string, topicSlug: string): { page: ExamBlueprintPageData; topic: ExamBlueprintTopicCategory } | undefined {
  const page = getExamBlueprintByPrefix(urlPrefix);
  if (!page) return undefined;
  const topic = page.topicCategories.find(t => t.slug === topicSlug);
  if (!topic) return undefined;
  return { page, topic };
}

export function getAllExamBlueprintRoutes(): { path: string; examName: string; topicName: string }[] {
  const routes: { path: string; examName: string; topicName: string }[] = [];
  for (const page of EXAM_BLUEPRINT_PAGES) {
    for (const topic of page.topicCategories) {
      routes.push({
        path: `/${page.urlPrefix}/${topic.slug}`,
        examName: page.examName,
        topicName: topic.name,
      });
    }
  }
  return routes;
}
