export type RexPnContentType = "category" | "condition" | "medication" | "lab-value" | "comparison" | "strategy";

export interface RexPnPracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  isFree: boolean;
}

export interface RexPnInternalLink {
  title: string;
  href: string;
  type: RexPnContentType | "hub" | "question-bank";
}

export interface RexPnFAQ {
  question: string;
  answer: string;
}

export interface RexPnCategoryPage {
  slug: string;
  contentType: "category";
  tier: "rex-pn";
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  introText: string;
  sections: { heading: string; content: string }[];
  practiceQuestions: RexPnPracticeQuestion[];
  faqs: RexPnFAQ[];
  internalLinks: RexPnInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export interface RexPnConditionPage {
  slug: string;
  contentType: "condition";
  tier: "rex-pn";
  name: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  definition: string;
  pathophysiology: string;
  causesRiskFactors: string[];
  signsSymptoms: { early: string[]; late: string[] };
  labs: { name: string; normalRange: string; significance: string }[];
  medications: { name: string; drugClass: string; action: string; sideEffects: string; nursingConsiderations: string }[];
  nursingInterventions: string[];
  complications: string[];
  patientTeaching: string[];
  examPearls: string[];
  commonTrapAnswers: string[];
  practiceQuestions: RexPnPracticeQuestion[];
  faqs: RexPnFAQ[];
  internalLinks: RexPnInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export interface RexPnMedicationPage {
  slug: string;
  contentType: "medication";
  tier: "rex-pn";
  genericName: string;
  brandNames: string[];
  drugClass: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  mechanism: string;
  indications: string[];
  sideEffects: { effect: string; severity: string; detail: string }[];
  contraindications: string[];
  nursingConsiderations: string[];
  monitoring: string[];
  patientTeaching: string[];
  examTips: string[];
  practiceQuestions: RexPnPracticeQuestion[];
  faqs: RexPnFAQ[];
  internalLinks: RexPnInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export interface RexPnLabValuePage {
  slug: string;
  contentType: "lab-value";
  tier: "rex-pn";
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
  associatedConditions: string[];
  nursingImplications: string[];
  examAlerts: string[];
  practiceQuestions: RexPnPracticeQuestion[];
  faqs: RexPnFAQ[];
  internalLinks: RexPnInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export interface RexPnComparisonPage {
  slug: string;
  contentType: "comparison";
  tier: "rex-pn";
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
  practiceQuestions: RexPnPracticeQuestion[];
  faqs: RexPnFAQ[];
  internalLinks: RexPnInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export interface RexPnStrategyPage {
  slug: string;
  contentType: "strategy";
  tier: "rex-pn";
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  introText: string;
  sections: { heading: string; content: string; tips?: string[] }[];
  practiceQuestions: RexPnPracticeQuestion[];
  faqs: RexPnFAQ[];
  internalLinks: RexPnInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export type RexPnPage = RexPnCategoryPage | RexPnConditionPage | RexPnMedicationPage | RexPnLabValuePage | RexPnComparisonPage | RexPnStrategyPage;

export const rexPnCategories: RexPnCategoryPage[] = [
  {
    slug: "practice-questions",
    contentType: "category",
    tier: "rex-pn",
    title: "REx-PN Practice Questions",
    metaTitle: "REx-PN Practice Questions: Free Canadian RPN Exam Questions (2025)",
    metaDescription: "Practice with free REx-PN exam questions covering all content domains. CAT-style questions with detailed rationales for Canadian practical nurse candidates.",
    keywords: "REx-PN practice questions, RPN exam questions, Canadian nursing exam practice, REx-PN free questions, practical nurse exam prep",
    h1: "REx-PN Practice Questions",
    introText: "Build your clinical reasoning skills with practice questions aligned to the REx-PN exam blueprint. Each question includes a detailed rationale explaining the correct answer and why other options are incorrect, helping you develop the critical thinking skills tested on exam day.",
    sections: [
      { heading: "Why Practice Questions Matter", content: "Active recall through practice questions is one of the most effective study strategies. Research consistently shows that testing yourself on material produces better long-term retention than passive review. For the REx-PN, this is particularly important because the exam tests application and analysis-level thinking, not rote memorization." },
      { heading: "Question Types You Will Encounter", content: "The REx-PN uses multiple question formats including multiple-choice questions (MCQ) with a single best answer, select-all-that-apply (SATA) questions, ordered-response items, fill-in-the-blank dosage calculations, and graphic/exhibit items. Our practice questions cover all these formats to ensure comprehensive preparation." },
      { heading: "How to Use Practice Questions Effectively", content: "Do not simply answer questions and move on. Read the rationale for every question — including ones you get correct. Understanding why an answer is right and why others are wrong builds the clinical reasoning framework you need. Aim to complete at least 75-100 practice questions per day during your final 2-3 weeks of preparation." }
    ],
    practiceQuestions: [
      { question: "A client with heart failure reports waking up at night feeling short of breath. The nurse recognizes this as which finding?", options: ["Orthopnea", "Paroxysmal nocturnal dyspnea", "Dyspnea on exertion", "Cheyne-Stokes respirations"], correctIndex: 1, rationale: "Paroxysmal nocturnal dyspnea (PND) is the sudden onset of shortness of breath that wakes the patient from sleep, typically 1-2 hours after lying flat. It is a classic symptom of left-sided heart failure caused by redistribution of fluid from the periphery to the pulmonary circulation when supine.", isFree: true },
      { question: "Which assessment finding should the nurse report immediately for a client receiving a blood transfusion?", options: ["Temperature increase of 0.5°C", "Urticaria on the chest", "Flank pain and dark urine", "Mild anxiety"], correctIndex: 2, rationale: "Flank pain and dark urine indicate a hemolytic transfusion reaction, which is a medical emergency. This occurs when incompatible blood destroys recipient red blood cells, causing hemoglobinuria (dark urine) and back/flank pain. Stop the transfusion immediately, maintain IV access with NS, and notify the provider.", isFree: true },
      { question: "A nurse is caring for a postoperative client who has not voided in 8 hours. What is the priority assessment?", options: ["Auscultate bowel sounds", "Palpate the bladder for distention", "Check the surgical incision", "Review intake and output records"], correctIndex: 1, rationale: "Bladder distention assessment is the priority when a postoperative client has not voided. Urinary retention is common after surgery due to anesthesia effects, opioid use, and positioning. Palpating the suprapubic area assesses for a distended bladder, which may require straight catheterization.", isFree: true },
      { question: "The nurse is preparing to administer digoxin to an adult client. Which assessment must be completed before administration?", options: ["Blood pressure in both arms", "Apical pulse for one full minute", "Respiratory rate and depth", "Capillary refill time"], correctIndex: 1, rationale: "Before administering digoxin, the nurse must assess the apical pulse for one full minute. Hold the medication and notify the provider if the heart rate is below 60 bpm in adults. Digoxin slows the heart rate (negative chronotropic effect) and can cause fatal bradycardia or heart block at toxic levels.", isFree: true },
      { question: "A client with diabetes reports feeling shaky, sweaty, and confused. Blood glucose is 3.2 mmol/L. What is the priority intervention?", options: ["Administer rapid-acting insulin", "Give 15 g of fast-acting carbohydrate", "Start an IV of D5W", "Contact the physician"], correctIndex: 1, rationale: "A blood glucose of 3.2 mmol/L (<4.0 mmol/L) with symptoms indicates hypoglycemia. The priority intervention for a conscious client is to give 15 g of fast-acting carbohydrate (Rule of 15): glucose tablets, 4 oz juice, or regular pop. Recheck in 15 minutes. Insulin would worsen hypoglycemia.", isFree: true }
    ],
    faqs: [
      { question: "How many practice questions should I do before the REx-PN?", answer: "Most successful candidates complete 1,500-2,500 practice questions during their preparation period. Aim for at least 75-100 questions per day in the final 2-3 weeks, covering all content domains proportionally to their exam weighting." },
      { question: "Are these practice questions the same as the real REx-PN?", answer: "Our practice questions are designed to match the style, difficulty, and cognitive level of the REx-PN but are independently developed for educational purposes. They cover the same content domains and use similar clinical scenarios to prepare you for the types of questions you will encounter on exam day." },
      { question: "Should I focus on questions I get wrong?", answer: "Review all questions, including correct answers. Understanding rationales for both correct and incorrect options builds a deeper understanding of the clinical concepts. However, track your weak areas and dedicate extra practice time to content domains where your scores are lowest." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "REx-PN Study Plan", href: "/rex-pn/study-plan", type: "category" },
      { title: "Clinical Judgment Framework", href: "/rex-pn/clinical-judgment", type: "category" },
      { title: "Pharmacology Review", href: "/rex-pn/pharmacology", type: "category" },
      { title: "Mock Exams", href: "/mock-exams", type: "question-bank" },
      { title: "Heart Failure", href: "/rex-pn/conditions/heart-failure", type: "condition" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "fundamentals",
    contentType: "category",
    tier: "rex-pn",
    title: "REx-PN Fundamentals of Nursing",
    metaTitle: "REx-PN Fundamentals of Nursing: Core Concepts for the RPN Exam (2025)",
    metaDescription: "Master fundamentals of nursing for the REx-PN: vital signs, asepsis, documentation, client safety, therapeutic communication, and medication administration.",
    keywords: "REx-PN fundamentals, nursing fundamentals RPN, basic nursing skills, vital signs nursing, aseptic technique, medication administration safety",
    h1: "Fundamentals of Nursing for the REx-PN",
    introText: "Fundamentals of nursing form the foundation of every REx-PN content domain. These core concepts — vital signs interpretation, aseptic technique, therapeutic communication, client safety, documentation, and medication administration — appear throughout the exam regardless of the clinical scenario.",
    sections: [
      { heading: "Vital Signs Assessment", content: "Accurate vital signs measurement and interpretation is a foundational nursing skill tested extensively on the REx-PN. Know the normal adult ranges: Temperature 36.5-37.5°C, Heart rate 60-100 bpm, Respiratory rate 12-20 breaths/min, Blood pressure <130/80 mmHg, SpO2 >94%. Understand when to report abnormal findings and which deviations require immediate intervention." },
      { heading: "Infection Prevention and Aseptic Technique", content: "Routine practices (formerly Standard Precautions) apply to ALL clients regardless of diagnosis. Additional precautions include Contact, Droplet, and Airborne isolation. Know which infections require which precautions: MRSA (contact), influenza (droplet), tuberculosis (airborne/N95). Surgical asepsis requires sterile technique — anything below the waist, below table level, or wet is considered contaminated." },
      { heading: "Medication Administration Safety", content: "The RPN must verify the 10 rights of medication administration: right client, drug, dose, route, time, documentation, reason, response, to refuse, and education. High-alert medications (insulin, anticoagulants, opioids) require independent double-checks. Know common dosage calculations using metric units and the principles of safe IV medication administration." },
      { heading: "Therapeutic Communication", content: "Therapeutic communication techniques tested on the REx-PN include active listening, open-ended questions, reflection, paraphrasing, and empathetic responses. Non-therapeutic responses include giving false reassurance ('Don't worry'), asking 'why' questions, changing the subject, and offering personal opinions. Always choose the response that acknowledges the client's feelings." }
    ],
    practiceQuestions: [
      { question: "A nurse enters a client's room and finds the sterile field has a wet area from a spilled solution. What should the nurse do?", options: ["Blot the area with a sterile towel and continue", "Set up a new sterile field with fresh supplies", "Cover the wet area with a sterile drape", "Document the incident and continue the procedure"], correctIndex: 1, rationale: "A wet sterile field is considered contaminated because moisture allows microorganisms to wick through the barrier (strike-through contamination). The entire field must be discarded and a new sterile setup established. Covering or blotting does not restore sterility.", isFree: true },
      { question: "Which client statement demonstrates therapeutic communication by the nurse?", options: ["'Everything will be fine, don't worry about the surgery.'", "'Why did you wait so long to come to the hospital?'", "'It sounds like you are feeling anxious about the procedure.'", "'I had the same surgery and I was fine.'"], correctIndex: 2, rationale: "Reflecting feelings ('It sounds like you are feeling anxious') is a therapeutic communication technique that acknowledges the client's emotional state and encourages further expression. False reassurance, 'why' questions, and sharing personal experiences are non-therapeutic.", isFree: true },
      { question: "A nurse is preparing to administer medications. Which action demonstrates safe medication practice?", options: ["Crushing an enteric-coated tablet for a client with dysphagia", "Scanning the client's identification band before administration", "Leaving medications at the bedside for the client to take later", "Accepting a verbal order without reading it back"], correctIndex: 1, rationale: "Scanning the client's identification band verifies right client and supports medication safety. Enteric-coated tablets must not be crushed (destroys the protective coating). Medications should not be left unattended. Verbal orders require read-back verification.", isFree: true }
    ],
    faqs: [
      { question: "How much of the REx-PN covers fundamentals?", answer: "Fundamentals concepts are woven throughout all four Client Needs categories. While there is no single 'fundamentals' section, concepts like vital signs, safety, communication, and medication administration appear in questions across all domains. Mastering fundamentals is essential for success across the entire exam." },
      { question: "What is the difference between medical asepsis and surgical asepsis?", answer: "Medical asepsis (clean technique) reduces the number of microorganisms and prevents their spread — examples include handwashing and gloving for standard care. Surgical asepsis (sterile technique) eliminates ALL microorganisms from an area — used for invasive procedures, wound care, and catheter insertion. On the REx-PN, know when each is appropriate." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Safety & Infection Control", href: "/rex-pn/safety-and-infection-control", type: "category" },
      { title: "Pharmacology Review", href: "/rex-pn/pharmacology", type: "category" },
      { title: "Practice Questions", href: "/rex-pn/practice-questions", type: "category" },
      { title: "Potassium Lab Values", href: "/rex-pn/lab-values/potassium", type: "lab-value" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "pharmacology",
    contentType: "category",
    tier: "rex-pn",
    title: "REx-PN Pharmacology Review",
    metaTitle: "REx-PN Pharmacology: Essential Medications for the RPN Exam (2025)",
    metaDescription: "Comprehensive pharmacology review for the REx-PN exam. Drug classifications, mechanisms, side effects, nursing considerations, and dosage calculations for Canadian RPN candidates.",
    keywords: "REx-PN pharmacology, RPN medication review, nursing pharmacology, drug classifications nursing, dosage calculations RPN",
    h1: "Pharmacology Review for the REx-PN",
    introText: "Pharmacological Therapies accounts for 10-16% of the REx-PN exam. This section covers the essential drug classifications, mechanisms of action, side effects, contraindications, and nursing considerations that every RPN candidate must know. Focus on high-alert medications, common drug interactions, and dosage calculations using metric units.",
    sections: [
      { heading: "High-Yield Drug Classifications", content: "Focus your study on these high-yield drug classes for the REx-PN: ACE inhibitors (-pril), Beta-blockers (-olol), Calcium channel blockers (-dipine), Diuretics (thiazide, loop, potassium-sparing), Insulins (rapid, short, intermediate, long-acting), Anticoagulants (heparin, warfarin, DOACs), Opioid analgesics, Antibiotics (penicillins, cephalosporins, fluoroquinolones), and Antidepressants (SSRIs, SNRIs)." },
      { heading: "Medication Safety Principles", content: "The REx-PN tests your ability to identify unsafe medication practices. Know the 10 rights of medication administration. Understand high-alert medications that require independent double-checks: insulin, heparin, opioids, potassium chloride IV, chemotherapy. Know sound-alike/look-alike drug pairs and how to prevent medication errors." },
      { heading: "Dosage Calculations", content: "The REx-PN includes fill-in-the-blank calculation questions. Master these formulas: Desired/Have × Quantity for oral and injectable medications. For IV flow rates: Volume (mL) ÷ Time (hours) = mL/hr, or Volume (mL) × Drop factor ÷ Time (min) = gtt/min. Practice converting between metric units and always double-check your decimal placement." }
    ],
    practiceQuestions: [
      { question: "A client is prescribed heparin 5,000 units subcutaneously. The vial contains 10,000 units/mL. How many mL should the nurse administer?", options: ["0.25 mL", "0.5 mL", "1 mL", "2 mL"], correctIndex: 1, rationale: "Using Desired/Have × Quantity: 5,000 units ÷ 10,000 units/mL × 1 mL = 0.5 mL. Always double-check calculation and have another nurse verify high-alert medications like heparin.", isFree: true },
      { question: "A client taking furosemide reports muscle cramps and weakness. Which lab value should the nurse check first?", options: ["Serum sodium", "Serum potassium", "Serum calcium", "Serum magnesium"], correctIndex: 1, rationale: "Furosemide is a loop diuretic that causes potassium wasting. Muscle cramps and weakness are classic signs of hypokalemia. Serum potassium should be checked immediately, and potassium supplementation may be needed.", isFree: true },
      { question: "Which instruction should the nurse give to a client prescribed warfarin?", options: ["Eliminate all green vegetables from your diet", "Take aspirin for headaches as needed", "Maintain a consistent intake of vitamin K-rich foods", "Double the dose if you miss one"], correctIndex: 2, rationale: "Clients on warfarin should maintain CONSISTENT vitamin K intake, not eliminate it. Sudden changes in vitamin K consumption cause INR fluctuations. Aspirin increases bleeding risk. Never double a missed dose of an anticoagulant.", isFree: true }
    ],
    faqs: [
      { question: "How many pharmacology questions are on the REx-PN?", answer: "Pharmacological Therapies accounts for approximately 10-16% of the REx-PN, meaning you can expect roughly 15-25 pharmacology-related questions depending on the total number of scored questions you receive." },
      { question: "Do I need to memorize brand names for the REx-PN?", answer: "The REx-PN primarily uses generic drug names, but knowing common brand names (e.g., Lasix/furosemide, Coumadin/warfarin) is helpful. Focus on generic names, drug classifications (stem names like -pril, -olol), and mechanisms of action rather than exhaustive brand name memorization." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Furosemide Guide", href: "/rex-pn/medications/furosemide", type: "medication" },
      { title: "Potassium Lab Values", href: "/rex-pn/lab-values/potassium", type: "lab-value" },
      { title: "Sodium Lab Values", href: "/rex-pn/lab-values/sodium", type: "lab-value" },
      { title: "ABG Interpretation", href: "/rex-pn/lab-values/abgs", type: "lab-value" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "safety-and-infection-control",
    contentType: "category",
    tier: "rex-pn",
    title: "REx-PN Safety & Infection Control",
    metaTitle: "REx-PN Safety & Infection Control: Key Concepts for RPN Exam (2025)",
    metaDescription: "Master safety and infection control for the REx-PN: fall prevention, restraints, infection precautions, medication safety, and emergency response for Canadian RPNs.",
    keywords: "REx-PN safety, infection control nursing, fall prevention, isolation precautions, restraint nursing, patient safety RPN",
    h1: "Safety & Infection Control for the REx-PN",
    introText: "Safety and Infection Control accounts for 10-16% of the REx-PN exam. This domain tests your ability to maintain a safe environment for clients, staff, and visitors. Master routine practices, additional precautions, fall prevention, restraint use, and safe medication administration to succeed on exam day.",
    sections: [
      { heading: "Routine Practices and Additional Precautions", content: "Routine Practices (standard precautions) apply to ALL clients regardless of diagnosis and include hand hygiene, PPE use based on anticipated exposure, safe injection practices, and respiratory hygiene. Additional precautions include Contact (MRSA, VRE, C. difficile — gown and gloves), Droplet (influenza, pertussis — surgical mask within 2 metres), and Airborne (TB, measles, varicella — N95 respirator, negative pressure room)." },
      { heading: "Fall Prevention", content: "Falls are the most common adverse event in healthcare. Risk factors include advanced age, medication effects (sedatives, antihypertensives, diuretics), impaired mobility, altered cognition, environmental hazards, and a history of previous falls. Interventions include keeping the bed in the lowest position, ensuring call bell is within reach, adequate lighting, non-slip footwear, and using bed alarms for high-risk clients." },
      { heading: "Restraint Use", content: "Restraints are a last resort when all less restrictive alternatives have failed. The RPN must assess the client every 1-2 hours when restraints are applied: check circulation, sensation, and range of motion. Document the rationale for restraint use, client assessment findings, and release attempts. Chemical restraints (sedating medications) also require monitoring and documentation." }
    ],
    practiceQuestions: [
      { question: "A nurse is caring for a client with active pulmonary tuberculosis. Which isolation precaution should be implemented?", options: ["Contact precautions with gown and gloves", "Droplet precautions with a surgical mask", "Airborne precautions with an N95 respirator", "Standard precautions only"], correctIndex: 2, rationale: "Pulmonary tuberculosis requires airborne precautions: N95 respirator (fit-tested), negative pressure room, and the door must remain closed. TB bacilli are small enough to remain suspended in air for extended periods and travel on air currents.", isFree: true },
      { question: "Which intervention should the nurse implement first for a client at high risk for falls?", options: ["Apply bilateral wrist restraints", "Place the bed in the lowest position with side rails up", "Administer a sedative to prevent ambulation", "Request a 1:1 sitter for 24-hour observation"], correctIndex: 1, rationale: "Placing the bed in the lowest position is a first-line fall prevention intervention. Restraints and sedatives can actually increase fall risk and are used only as a last resort. A 1:1 sitter may be appropriate but is not the first intervention.", isFree: true },
      { question: "A nurse notes that a client in wrist restraints has cool, pale fingers. What is the priority action?", options: ["Document the finding and reassess in 1 hour", "Release the restraints and assess circulation", "Apply warm compresses to the hands", "Loosen the restraints slightly and recheck in 30 minutes"], correctIndex: 1, rationale: "Cool, pale fingers indicate impaired circulation from the restraints. The priority is to immediately release the restraints and perform a thorough neurovascular assessment. Impaired circulation can lead to tissue damage if not addressed promptly.", isFree: true }
    ],
    faqs: [
      { question: "What percentage of the REx-PN covers safety and infection control?", answer: "Safety and Infection Control accounts for approximately 10-16% of the REx-PN exam. Questions test your ability to maintain a safe environment, apply infection prevention practices, and respond to safety emergencies." },
      { question: "What is the most important infection control measure?", answer: "Hand hygiene is the single most important measure to prevent healthcare-associated infections. The REx-PN tests when to perform hand hygiene (before and after client contact, before aseptic procedures, after exposure to body fluids, and after touching the client's environment) and the difference between handwashing and alcohol-based hand rub use." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Fundamentals Review", href: "/rex-pn/fundamentals", type: "category" },
      { title: "Sepsis Guide", href: "/rex-pn/conditions/sepsis", type: "condition" },
      { title: "Pneumonia Guide", href: "/rex-pn/conditions/pneumonia", type: "condition" },
      { title: "Practice Questions", href: "/rex-pn/practice-questions", type: "category" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "clinical-judgment",
    contentType: "category",
    tier: "rex-pn",
    title: "REx-PN Clinical Judgment Framework",
    metaTitle: "REx-PN Clinical Judgment: NCSBN Framework & Decision-Making (2025)",
    metaDescription: "Master clinical judgment for the REx-PN using the NCSBN Clinical Judgment Measurement Model. Learn to recognize cues, analyze, prioritize, and evaluate outcomes.",
    keywords: "REx-PN clinical judgment, NCSBN clinical judgment model, nursing clinical reasoning, prioritization nursing, RPN clinical decision making",
    h1: "Clinical Judgment Framework for the REx-PN",
    introText: "Clinical judgment is the cornerstone of safe nursing practice and the central skill tested on the REx-PN. The NCSBN Clinical Judgment Measurement Model (CJMM) describes six cognitive processes that experienced nurses use to make clinical decisions. Understanding this framework will help you approach exam questions systematically.",
    sections: [
      { heading: "The Six Steps of Clinical Judgment", content: "The NCSBN CJMM includes: (1) Recognize Cues — identify relevant client data from assessment findings, (2) Analyze Cues — link information to conditions and determine significance, (3) Prioritize Hypotheses — rank possible explanations by urgency, (4) Generate Solutions — identify interventions that address the priority hypothesis, (5) Take Action — implement the most appropriate intervention, (6) Evaluate Outcomes — assess the effectiveness of the intervention and decide next steps." },
      { heading: "Prioritization Frameworks", content: "The REx-PN frequently tests your ability to prioritize. Use these frameworks: ABCs (Airway, Breathing, Circulation) for physiological priorities. Maslow's Hierarchy (physiological needs first, then safety, then psychosocial). Nursing Process (assess before intervening, unless an emergency). Least Restrictive (try the least invasive option first). Acute over Chronic (new or unstable conditions take priority)." },
      { heading: "Recognizing Relevant vs Irrelevant Cues", content: "Many REx-PN questions include extra information designed to distract you. Practice identifying which assessment findings are relevant to the clinical scenario. Ask yourself: Does this finding match the expected presentation? Is this finding abnormal for this client's baseline? Does this change require immediate action? Relevant cues drive your clinical decision; irrelevant details should not influence your answer." }
    ],
    practiceQuestions: [
      { question: "A nurse is assessing four clients. Which client should the nurse see first?", options: ["A client with diabetes who has a blood glucose of 8.5 mmol/L", "A client with COPD who has a new onset of confusion", "A client who is 2 days postoperative and reports incisional pain of 4/10", "A client with hypertension whose blood pressure is 148/92 mmHg"], correctIndex: 1, rationale: "New onset of confusion in a COPD client could indicate hypoxia, hypercapnia, or a serious change in respiratory status. This is an acute change requiring immediate assessment. The other findings are either expected or stable.", isFree: true },
      { question: "A nurse is caring for a client who suddenly becomes unresponsive. What is the nurse's first action?", options: ["Call for help", "Assess the airway", "Begin chest compressions", "Administer naloxone"], correctIndex: 1, rationale: "Following the ABCs of emergency response, the first action is to assess the airway. Establishing airway patency takes priority over other interventions. Once the airway is assessed, proceed with breathing and circulation evaluation. Call for help should be initiated simultaneously if possible.", isFree: true },
      { question: "Which nursing action demonstrates the 'Evaluate Outcomes' step of clinical judgment?", options: ["Measuring blood pressure after administering an antihypertensive", "Reviewing the client's medication list on admission", "Reporting a change in vital signs to the provider", "Applying a pulse oximeter to a client with dyspnea"], correctIndex: 0, rationale: "Measuring blood pressure after administering an antihypertensive evaluates the effectiveness of the intervention (the outcome). The other options represent different steps: reviewing medications is 'Recognize Cues,' reporting is 'Take Action,' and applying monitoring is part of assessment.", isFree: true }
    ],
    faqs: [
      { question: "What is the NCSBN Clinical Judgment Measurement Model?", answer: "The NCSBN CJMM is a framework that describes six cognitive processes nurses use to make clinical decisions: Recognize Cues, Analyze Cues, Prioritize Hypotheses, Generate Solutions, Take Action, and Evaluate Outcomes. The REx-PN tests these processes through various question formats." },
      { question: "How do I improve my clinical judgment skills?", answer: "Practice with clinical scenarios that require you to identify relevant data, form hypotheses, and choose interventions. Use practice questions that include rationales explaining the reasoning process. Study prioritization frameworks (ABCs, Maslow's) and apply them consistently. Clinical judgment improves with deliberate practice and reflection." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Practice Questions", href: "/rex-pn/practice-questions", type: "category" },
      { title: "Exam Tips", href: "/rex-pn/exam-tips", type: "category" },
      { title: "How to Pass the REx-PN", href: "/rex-pn/strategy/how-to-pass-rex-pn", type: "strategy" },
      { title: "Mock Exams", href: "/mock-exams", type: "question-bank" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "exam-tips",
    contentType: "category",
    tier: "rex-pn",
    title: "REx-PN Exam Tips",
    metaTitle: "REx-PN Exam Tips: Proven Strategies for Exam Day Success (2025)",
    metaDescription: "Essential REx-PN exam tips: test-taking strategies, time management, CAT-specific techniques, anxiety management, and common mistakes to avoid on the Canadian RPN exam.",
    keywords: "REx-PN exam tips, RPN exam strategies, CAT test taking strategies, nursing exam tips, REx-PN test day tips",
    h1: "REx-PN Exam Tips & Test-Taking Strategies",
    introText: "Success on the REx-PN requires not only clinical knowledge but also effective test-taking strategies. These evidence-based tips address the unique challenges of the Computer Adaptive Testing format and help you maximize your performance on exam day.",
    sections: [
      { heading: "CAT-Specific Strategies", content: "In the CAT format, each question is selected based on your previous answer. You cannot go back to change answers. This means: (1) Take time to read each question carefully before answering — there is no going back. (2) Do not read difficulty into the question — harder questions do not mean you are failing. (3) Answer every question to the best of your ability; there is no penalty for wrong answers. (4) If you feel the questions are getting harder, that may mean you are performing well." },
      { heading: "Process of Elimination", content: "For MCQ questions, eliminate options that are clearly wrong before selecting your answer. Look for absolute words ('always,' 'never') which are usually incorrect. Choose the most therapeutic, least restrictive, and safest option. When two options seem similar, one is usually more complete or addresses a higher priority. Focus on what the question is actually asking — reread the stem if needed." },
      { heading: "Time Management", content: "You have up to 5 hours for 85-150 questions. This averages about 2 minutes per question. Do not rush, but do not spend more than 3-4 minutes on any single question. If you are unsure, make your best educated choice and move on. Mark nothing — you cannot return to previous questions in the CAT format." },
      { heading: "Exam Day Preparation", content: "Get 7-8 hours of sleep the night before. Eat a balanced breakfast. Arrive 30 minutes early with your required identification. Use the tutorial time to familiarize yourself with the interface. Take the optional break after 2 hours to reset your focus. Stay calm if you feel the exam is difficult — trust your preparation." }
    ],
    practiceQuestions: [
      { question: "A nurse is trying to decide between two answer options that both seem correct. Using test-taking strategy, what should the nurse do?", options: ["Choose the longer, more detailed answer", "Select the first answer that came to mind", "Consider which option addresses the highest priority need", "Eliminate both options and look for another answer"], correctIndex: 2, rationale: "When two options seem correct, choose the one that addresses the highest priority need. Use prioritization frameworks (ABCs, safety, acute over chronic) to determine which intervention is most critical. This is the most reliable test-taking strategy for differentiating between seemingly correct answers.", isFree: true },
      { question: "During the REx-PN, a candidate has answered 90 questions and the exam has not ended. What does this indicate?", options: ["The candidate is failing the exam", "The CAT algorithm has not reached a confident decision yet", "The candidate has answered too many questions incorrectly", "The exam is malfunctioning"], correctIndex: 1, rationale: "The exam continues until the CAT algorithm reaches 95% confidence in a pass/fail decision, the maximum questions (150) are reached, or time runs out. Answering more than 85 questions simply means the algorithm needs more data — it does not indicate pass or fail.", isFree: true }
    ],
    faqs: [
      { question: "What should I do the day before the REx-PN?", answer: "Do light review only — no heavy studying. Review key mnemonics and high-yield concepts briefly. Prepare your identification documents and know your testing centre location. Eat well, hydrate, and get 7-8 hours of sleep. Avoid studying new material the night before." },
      { question: "Can I bring anything into the testing room?", answer: "No personal items are allowed in the testing room: no phones, watches, food, drinks, notes, or study materials. The testing centre provides an erasable note board and marker. A basic on-screen calculator is available. Everything must be stored in a provided locker." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "How to Pass the REx-PN", href: "/rex-pn/strategy/how-to-pass-rex-pn", type: "strategy" },
      { title: "Study Plan", href: "/rex-pn/study-plan", type: "category" },
      { title: "Clinical Judgment", href: "/rex-pn/clinical-judgment", type: "category" },
      { title: "Practice Questions", href: "/rex-pn/practice-questions", type: "category" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "study-plan",
    contentType: "category",
    tier: "rex-pn",
    title: "REx-PN Study Plan",
    metaTitle: "REx-PN Study Plan: 10-Week Structured Preparation Guide (2025)",
    metaDescription: "Follow this structured 10-week REx-PN study plan with weekly goals, content domain coverage, and practice question targets for Canadian RPN candidates.",
    keywords: "REx-PN study plan, RPN exam study schedule, how to study for REx-PN, REx-PN preparation timeline, Canadian nursing exam study plan",
    h1: "10-Week REx-PN Study Plan",
    introText: "This structured 10-week study plan helps you cover all REx-PN content domains systematically while building the clinical reasoning skills tested on exam day. Consistent daily study of 2-3 hours is more effective than irregular marathon sessions.",
    sections: [
      { heading: "Weeks 1-2: Foundation Building", content: "Focus on Physiological Integrity — the most heavily weighted domain (38-44%). Cover pharmacological therapies (drug classifications, mechanisms, side effects), physiological adaptation (acute and chronic conditions, fluid and electrolyte balance), and basic care and comfort (nutrition, elimination, mobility). Complete 50 practice questions daily with rationale review." },
      { heading: "Weeks 3-4: Safety and Environment", content: "Study Safe and Effective Care Environment (26-32%). Cover coordinated care (delegation, collaboration, ethical/legal principles), safety and infection control (fall prevention, restraints, infection precautions, medication safety). Begin integrated practice questions that combine multiple content areas. Increase to 75 questions daily." },
      { heading: "Weeks 5-6: Health Promotion and Psychosocial", content: "Cover Health Promotion and Maintenance (6-12%) and Psychosocial Integrity (6-12%). Focus on growth and development, health screening, immunizations, therapeutic communication, mental health concepts, cultural safety, and crisis intervention. Practice SATA and ordered-response questions." },
      { heading: "Weeks 7-8: Integration and Application", content: "Shift from content review to application. Take full-length CAT practice exams to build endurance and test-taking stamina. Review rationales for all questions — correct and incorrect. Identify weak areas through performance analytics and target those domains for additional study. Complete 100+ questions daily." },
      { heading: "Weeks 9-10: Final Preparation", content: "Take 2-3 full-length mock exams under timed conditions. Review exam-day logistics (testing centre location, identification requirements, timing). Focus only on weak areas identified in practice exams. Reduce study intensity in the final 2-3 days — light review and rest. Trust your preparation." }
    ],
    practiceQuestions: [
      { question: "A student nurse is creating a study plan for the REx-PN. Which approach is most effective?", options: ["Study one content domain exclusively for 2 weeks before moving to the next", "Complete practice questions in all domains weekly with focused content review", "Read the entire nursing textbook cover to cover", "Study only pharmacology since it is the hardest topic"], correctIndex: 1, rationale: "Distributed practice (studying multiple domains regularly) produces better retention than massed practice (focusing on one topic for extended periods). Combining content review with daily practice questions in all domains mirrors the integrated nature of the REx-PN.", isFree: true }
    ],
    faqs: [
      { question: "How long should I study for the REx-PN?", answer: "Most candidates benefit from 8-12 weeks of structured preparation. If you are studying full-time, 8 weeks may be sufficient. If you are working while studying, 10-12 weeks is recommended. The key is consistency — 2-3 hours of focused study daily is more effective than occasional 8-hour sessions." },
      { question: "What if I only have 4 weeks to prepare?", answer: "Focus on high-yield content: Physiological Integrity (especially pharmacology and physiological adaptation), Safety and Infection Control, and practice questions. Complete at least 100 practice questions daily with thorough rationale review. Take 2-3 full-length CAT practice exams. Prioritize weak areas identified through practice performance." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Practice Questions", href: "/rex-pn/practice-questions", type: "category" },
      { title: "Pharmacology Review", href: "/rex-pn/pharmacology", type: "category" },
      { title: "Clinical Judgment", href: "/rex-pn/clinical-judgment", type: "category" },
      { title: "Mock Exams", href: "/mock-exams", type: "question-bank" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  }
];

export const rexPnConditions: RexPnConditionPage[] = [
  {
    slug: "heart-failure",
    contentType: "condition",
    tier: "rex-pn",
    name: "Heart Failure",
    metaTitle: "Heart Failure for REx-PN: Complete Nursing Study Guide (2025)",
    metaDescription: "Master heart failure for the REx-PN exam: pathophysiology, left vs right-sided HF, medications, nursing interventions, complications, and practice questions.",
    keywords: "heart failure nursing, CHF REx-PN, left sided heart failure, right sided heart failure, heart failure medications nursing",
    definition: "Heart failure (HF) is a clinical syndrome in which the heart is unable to pump sufficient blood to meet the body's metabolic demands, resulting in inadequate tissue perfusion and fluid accumulation. It can involve the left ventricle (left-sided HF), right ventricle (right-sided HF), or both (biventricular failure).",
    pathophysiology: "In left-sided heart failure, the left ventricle fails to eject blood effectively into the systemic circulation. Blood backs up into the pulmonary veins and capillaries, causing pulmonary congestion and edema. The increased pulmonary pressures impair gas exchange, leading to dyspnea. In right-sided heart failure, the right ventricle fails to pump blood into the pulmonary artery, causing blood to back up into the systemic venous circulation. This produces peripheral edema, jugular venous distention (JVD), hepatomegaly, and ascites. Compensatory mechanisms include sympathetic activation (tachycardia, vasoconstriction), RAAS activation (sodium and water retention), and ventricular hypertrophy. These mechanisms initially maintain cardiac output but eventually worsen the condition.",
    causesRiskFactors: ["Coronary artery disease / myocardial infarction", "Chronic hypertension", "Valvular heart disease", "Cardiomyopathy", "Diabetes mellitus", "Obesity", "Excessive alcohol use", "Atrial fibrillation", "COPD / pulmonary hypertension (right-sided HF)", "Age >65 years"],
    signsSymptoms: {
      early: ["Fatigue and exercise intolerance", "Dyspnea on exertion", "Orthopnea (difficulty breathing when lying flat)", "Paroxysmal nocturnal dyspnea (PND)", "Mild peripheral edema", "Nocturia", "S3 heart sound (ventricular gallop)"],
      late: ["Severe dyspnea at rest", "Pulmonary crackles (rales)", "Pink, frothy sputum (pulmonary edema)", "Jugular venous distention (JVD)", "Hepatomegaly and ascites", "Anasarca (generalized edema)", "Weight gain >1 kg/day", "Cyanosis", "Altered mental status"]
    },
    labs: [
      { name: "BNP (B-type Natriuretic Peptide)", normalRange: "<100 pg/mL", significance: "Elevated BNP (>400 pg/mL) strongly suggests heart failure. BNP is released when ventricular walls are stretched, making it a key diagnostic marker." },
      { name: "Troponin", normalRange: "<0.04 ng/mL", significance: "Elevated troponin indicates myocardial injury and helps identify MI as the cause of acute HF decompensation." },
      { name: "Serum Sodium", normalRange: "135-145 mEq/L", significance: "Hyponatremia is common in advanced HF due to water retention exceeding sodium retention. Associated with poor prognosis." },
      { name: "Serum Potassium", normalRange: "3.5-5.0 mEq/L", significance: "Monitor closely — diuretics cause hypokalemia while ACE inhibitors and potassium-sparing diuretics cause hyperkalemia." }
    ],
    medications: [
      { name: "Furosemide (Lasix)", drugClass: "Loop Diuretic", action: "Inhibits sodium and chloride reabsorption in the loop of Henle, promoting diuresis to reduce fluid overload", sideEffects: "Hypokalemia, hypotension, ototoxicity (high doses)", nursingConsiderations: "Monitor potassium, daily weights, intake/output. Give in the morning to avoid nocturia. Monitor for signs of dehydration." },
      { name: "Lisinopril", drugClass: "ACE Inhibitor", action: "Blocks RAAS to reduce preload and afterload, preventing ventricular remodeling", sideEffects: "Dry cough, hyperkalemia, angioedema", nursingConsiderations: "Monitor potassium and renal function. Contraindicated in pregnancy. First-dose hypotension risk." },
      { name: "Metoprolol", drugClass: "Beta-Blocker", action: "Reduces heart rate and myocardial oxygen demand, prevents harmful compensatory tachycardia", sideEffects: "Bradycardia, fatigue, bronchospasm", nursingConsiderations: "Check apical pulse before administration. Hold if HR <60. Never discontinue abruptly." },
      { name: "Digoxin", drugClass: "Cardiac Glycoside", action: "Increases contractility (positive inotrope) and slows conduction through AV node", sideEffects: "Bradycardia, nausea, visual changes (yellow-green halos), dysrhythmias", nursingConsiderations: "Check apical pulse for 1 full minute. Hold if HR <60. Monitor digoxin level (therapeutic: 0.5-2.0 ng/mL). Hypokalemia increases toxicity risk." }
    ],
    nursingInterventions: ["Monitor daily weights (same time, same scale, same clothing) — report gain of >1 kg/day", "Assess respiratory status every 2-4 hours: lung sounds, SpO2, respiratory effort", "Maintain fluid restriction as ordered (typically 1.5-2 L/day)", "Encourage sodium-restricted diet (<2 g/day)", "Elevate head of bed 30-45 degrees (high Fowler's position)", "Monitor intake and output strictly", "Apply oxygen as needed to maintain SpO2 >92%", "Administer medications as ordered and monitor for therapeutic/adverse effects", "Educate on energy conservation techniques", "Assess for signs of digoxin toxicity if applicable"],
    complications: ["Pulmonary edema", "Cardiogenic shock", "Renal failure (cardiorenal syndrome)", "Hepatic congestion", "Pleural effusion", "Cardiac dysrhythmias", "Deep vein thrombosis", "Death"],
    patientTeaching: ["Weigh yourself daily at the same time and report weight gain >1 kg/day", "Restrict sodium intake to <2 g/day — read food labels", "Restrict fluids as directed by your healthcare provider", "Take medications exactly as prescribed — do not skip doses", "Report worsening shortness of breath, swelling, or difficulty lying flat", "Keep follow-up appointments and lab work as scheduled", "Avoid alcohol and tobacco", "Balance activity with rest periods"],
    examPearls: ["Left-sided HF = lungs (dyspnea, crackles, pink frothy sputum)", "Right-sided HF = rest of body (JVD, peripheral edema, hepatomegaly)", "BNP is the definitive lab marker for HF", "Daily weights are the most reliable indicator of fluid status", "Digoxin + hypokalemia = increased toxicity risk"],
    commonTrapAnswers: ["Choosing to restrict potassium instead of sodium", "Selecting IV fluid bolus for a fluid-overloaded patient", "Forgetting to check apical pulse before digoxin administration", "Choosing a flat (supine) position instead of high Fowler's", "Reporting a BNP of 50 as abnormal (it is normal)"],
    practiceQuestions: [
      { question: "A client with heart failure has gained 2 kg overnight. The nurse should:", options: ["Encourage increased oral fluid intake", "Administer the prescribed diuretic and notify the provider", "Document the finding and reassess tomorrow", "Restrict the client's dietary potassium"], correctIndex: 1, rationale: "A weight gain of 2 kg overnight indicates significant fluid retention. The nurse should administer the prescribed diuretic and notify the provider, as this represents acute decompensation requiring intervention. A weight gain >1 kg/day in HF is a critical finding.", isFree: true },
      { question: "Which assessment finding is associated with LEFT-sided heart failure?", options: ["Jugular venous distention", "Hepatomegaly", "Pulmonary crackles and dyspnea", "Peripheral pitting edema"], correctIndex: 2, rationale: "Left-sided HF causes blood to back up into the pulmonary circulation, producing pulmonary crackles (rales), dyspnea, orthopnea, and PND. JVD, hepatomegaly, and peripheral edema are signs of RIGHT-sided HF.", isFree: true },
      { question: "A nurse is about to administer digoxin. The client's apical pulse is 56 bpm. What should the nurse do?", options: ["Administer the medication as prescribed", "Hold the medication and notify the provider", "Give half the prescribed dose", "Administer the medication with food to increase absorption"], correctIndex: 1, rationale: "Digoxin must be held if the adult heart rate is below 60 bpm. Digoxin slows the heart rate, and administering it with existing bradycardia can cause dangerously slow rhythms or heart block. Notify the provider for further orders.", isFree: true },
      { question: "A client with HF asks why they need to weigh themselves daily. The best response is:", options: ["'It helps us monitor your heart function over time.'", "'Daily weights are the most reliable way to detect fluid retention early.'", "'Your insurance company requires daily weight documentation.'", "'It helps determine if your diet is working.'"], correctIndex: 1, rationale: "Daily weights are the most reliable indicator of fluid status changes in heart failure. A weight gain of 1 kg represents approximately 1 litre of retained fluid. This allows early detection of fluid overload before symptoms become severe.", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between left-sided and right-sided heart failure?", answer: "Left-sided HF affects the pulmonary system — blood backs up into the lungs causing dyspnea, pulmonary crackles, orthopnea, and PND. Right-sided HF affects the systemic circulation — blood backs up into the body causing JVD, peripheral edema, hepatomegaly, and ascites. Right-sided HF often results from chronic left-sided HF." },
      { question: "Why is potassium monitoring important in heart failure?", answer: "Heart failure medications affect potassium levels in opposite directions. Loop diuretics (furosemide) cause potassium loss, while ACE inhibitors and potassium-sparing diuretics cause potassium retention. Potassium imbalances can cause fatal cardiac arrhythmias. Additionally, hypokalemia increases the risk of digoxin toxicity." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Furosemide Guide", href: "/rex-pn/medications/furosemide", type: "medication" },
      { title: "Potassium Lab Values", href: "/rex-pn/lab-values/potassium", type: "lab-value" },
      { title: "Sodium Lab Values", href: "/rex-pn/lab-values/sodium", type: "lab-value" },
      { title: "Hypertension", href: "/rex-pn/conditions/hypertension", type: "condition" },
      { title: "DKA vs HHS Comparison", href: "/rex-pn/compare/dka-vs-hhs", type: "comparison" }
    ],
    references: [
      "American Heart Association. (2022). 2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure. Circulation, 145(18), e895-e1032.",
      "Hinkle, J. L., & Cheever, K. H. (2022). Brunner & Suddarth's Textbook of Medical-Surgical Nursing (15th ed.). Wolters Kluwer.",
      "Yancy, C. W., et al. (2017). ACC/AHA/HFSA Focused Update of the 2013 ACCF/AHA Guideline for the Management of Heart Failure. Circulation, 136(6), e137-e161."
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "diabetes-dka-hhs",
    contentType: "condition",
    tier: "rex-pn",
    name: "Diabetes Mellitus, DKA & HHS",
    metaTitle: "Diabetes, DKA & HHS for REx-PN: Complete Nursing Guide (2025)",
    metaDescription: "Master diabetes mellitus, DKA, and HHS for the REx-PN exam: insulin management, blood glucose monitoring, emergency care, and practice questions.",
    keywords: "diabetes nursing REx-PN, DKA nursing care, HHS nursing, insulin administration, blood glucose management RPN",
    definition: "Diabetes mellitus is a group of metabolic diseases characterized by chronic hyperglycemia. Type 1 involves autoimmune destruction of pancreatic beta cells. Type 2 involves insulin resistance and progressive beta-cell dysfunction. DKA (diabetic ketoacidosis) and HHS (hyperosmolar hyperglycemic state) are acute, life-threatening complications.",
    pathophysiology: "In Type 1 DM, autoimmune destruction of beta cells causes absolute insulin deficiency. Without insulin, glucose cannot enter cells. The body shifts to fat metabolism, producing ketone bodies and causing metabolic acidosis (DKA). In Type 2 DM, insulin resistance prevents normal glucose uptake. In HHS, enough insulin is present to prevent ketosis, but not enough to prevent extreme hyperglycemia (often >33 mmol/L), causing severe osmotic diuresis and profound dehydration.",
    causesRiskFactors: ["Family history", "Obesity (Type 2)", "Sedentary lifestyle", "Autoimmune conditions (Type 1)", "Infection or illness (DKA/HHS trigger)", "Medication non-adherence (DKA/HHS trigger)", "Corticosteroid use", "Gestational diabetes history"],
    signsSymptoms: {
      early: ["Polyuria, polydipsia, polyphagia (3 Ps)", "Unexplained weight loss (Type 1)", "Fatigue", "Blurred vision", "Slow wound healing"],
      late: ["Kussmaul respirations and fruity breath (DKA)", "Severe dehydration", "Altered mental status", "Seizures (HHS)", "Peripheral neuropathy", "Diabetic foot ulcers"]
    },
    labs: [
      { name: "Blood Glucose (Fasting)", normalRange: "3.9-5.5 mmol/L (70-100 mg/dL)", significance: "Fasting glucose >7.0 mmol/L on two occasions is diagnostic of diabetes. In DKA: typically >14 mmol/L. In HHS: typically >33 mmol/L." },
      { name: "HbA1C", normalRange: "<5.7%", significance: "Reflects average glucose over 2-3 months. Target for most diabetics is <7%. Diagnostic of diabetes at ≥6.5%." },
      { name: "Serum Potassium", normalRange: "3.5-5.0 mEq/L", significance: "Critical in DKA management. Must check K+ BEFORE starting insulin. If K+ <3.3, replace potassium first. Insulin drives K+ into cells." },
      { name: "Arterial Blood Gases", normalRange: "pH 7.35-7.45", significance: "DKA shows metabolic acidosis: pH <7.35, low HCO3, low pCO2 (respiratory compensation). HHS typically has normal or near-normal pH." }
    ],
    medications: [
      { name: "Regular Insulin (IV)", drugClass: "Short-Acting Insulin", action: "Facilitates glucose uptake into cells. Only insulin type that can be given IV.", sideEffects: "Hypoglycemia, hypokalemia", nursingConsiderations: "Check potassium before starting in DKA. When glucose reaches 11-14 mmol/L, add dextrose to IV — do NOT stop insulin until ketoacidosis resolves." },
      { name: "Metformin", drugClass: "Biguanide", action: "Decreases hepatic glucose production and increases insulin sensitivity", sideEffects: "GI upset, lactic acidosis (rare)", nursingConsiderations: "First-line for Type 2. Hold before contrast dye procedures. Does not cause hypoglycemia as monotherapy." },
      { name: "Insulin Glargine", drugClass: "Long-Acting Insulin", action: "Provides basal insulin coverage over 24 hours", sideEffects: "Hypoglycemia, injection site reactions", nursingConsiderations: "Peakless, given at the same time daily. Do NOT mix with other insulins. Clear solution." }
    ],
    nursingInterventions: ["Monitor blood glucose before meals and at bedtime", "Assess for hypoglycemia: tremors, diaphoresis, confusion, tachycardia", "Rule of 15 for hypoglycemia: 15 g fast-acting carbs, recheck in 15 minutes", "In DKA: aggressive IV fluid resuscitation (NS initially), continuous insulin drip, frequent K+ monitoring", "In HHS: priority is fluid replacement (may need 6-10 L), then insulin", "Rotate insulin injection sites to prevent lipodystrophy", "Comprehensive foot assessment (monofilament testing, inspect for ulcers)", "Educate on sick day management: never skip insulin, monitor glucose more frequently"],
    complications: ["Diabetic ketoacidosis (DKA)", "Hyperosmolar hyperglycemic state (HHS)", "Hypoglycemia", "Diabetic retinopathy", "Diabetic nephropathy", "Peripheral neuropathy", "Diabetic foot ulcers / amputation", "Cardiovascular disease"],
    patientTeaching: ["Monitor blood glucose as directed by your healthcare provider", "Never skip insulin doses, even when feeling ill", "Carry a fast-acting glucose source at all times", "Inspect feet daily for sores, blisters, or colour changes", "Rotate injection sites to prevent tissue damage", "Know the signs of hypoglycemia and hyperglycemia", "Wear medical identification", "Keep follow-up appointments for A1C, eye exams, and foot exams"],
    examPearls: ["DKA = Type 1, ketones present, Kussmaul respirations, fruity breath, pH <7.35", "HHS = Type 2, NO ketones, extreme hyperglycemia (>33 mmol/L), severe dehydration", "Check K+ BEFORE insulin in DKA — hypokalemia kills before hyperglycemia", "Only REGULAR insulin can be given IV", "Rule of 15 for conscious hypoglycemia; glucagon IM for unconscious"],
    commonTrapAnswers: ["Starting insulin before checking potassium in DKA", "Stopping insulin when glucose normalizes in DKA (ketoacidosis may still be present)", "Choosing NPH or glargine for IV administration (only regular can be given IV)", "Selecting orange juice for an unconscious hypoglycemic client (aspiration risk)"],
    practiceQuestions: [
      { question: "A client in DKA has a serum potassium of 3.1 mEq/L. The provider orders an insulin drip. What is the nurse's priority action?", options: ["Start the insulin drip immediately as ordered", "Hold insulin, notify the provider, and replace potassium first", "Administer insulin with supplemental potassium", "Reduce the insulin drip rate by half"], correctIndex: 1, rationale: "Insulin drives potassium intracellularly. Starting insulin with a K+ of 3.1 (already critically low) can cause fatal cardiac arrhythmias. Potassium must be replaced to ≥3.3 mEq/L before starting insulin in DKA.", isFree: true },
      { question: "Which finding differentiates DKA from HHS?", options: ["Hyperglycemia", "Dehydration", "Kussmaul respirations and fruity breath", "Altered mental status"], correctIndex: 2, rationale: "Kussmaul respirations (deep, rapid breathing to blow off CO2) and fruity acetone breath indicate ketoacidosis, which occurs in DKA but NOT in HHS. Both conditions have hyperglycemia, dehydration, and altered mental status.", isFree: true },
      { question: "A client with Type 1 diabetes on an insulin drip for DKA now has a blood glucose of 12 mmol/L. What should the nurse do?", options: ["Discontinue the insulin drip", "Continue insulin and add dextrose to IV fluids", "Switch to subcutaneous insulin immediately", "Hold insulin for 2 hours then resume"], correctIndex: 1, rationale: "In DKA, insulin must continue until the anion gap closes and ketoacidosis resolves — NOT just until glucose normalizes. When glucose approaches 11-14 mmol/L, add dextrose (D5W) to IV fluids to prevent hypoglycemia while continuing insulin.", isFree: true }
    ],
    faqs: [
      { question: "How do DKA and HHS differ?", answer: "DKA occurs primarily in Type 1 diabetes with absolute insulin deficiency. Ketone bodies accumulate, causing metabolic acidosis (pH <7.35), Kussmaul respirations, and fruity breath. HHS occurs in Type 2 diabetes where enough insulin prevents ketosis but not hyperglycemia. HHS features extreme hyperglycemia (>33 mmol/L) and severe dehydration without significant acidosis." },
      { question: "Why must potassium be checked before starting insulin in DKA?", answer: "Insulin activates Na+/K+ ATPase pumps, driving potassium from the blood into cells. In DKA, total body potassium is already depleted (lost through osmotic diuresis) even if serum levels appear normal or elevated (due to acidosis-driven potassium shift). Starting insulin without adequate potassium replacement can cause fatal hypokalemia and cardiac arrest." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Insulin Guide", href: "/medications/insulin", type: "medication" },
      { title: "Metformin Guide", href: "/medications/metformin", type: "medication" },
      { title: "Potassium Lab Values", href: "/rex-pn/lab-values/potassium", type: "lab-value" },
      { title: "DKA vs HHS Comparison", href: "/rex-pn/compare/dka-vs-hhs", type: "comparison" },
      { title: "ABG Interpretation", href: "/rex-pn/lab-values/abgs", type: "lab-value" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "copd",
    contentType: "condition",
    tier: "rex-pn",
    name: "COPD",
    metaTitle: "COPD for REx-PN: Nursing Study Guide & Practice Questions (2025)",
    metaDescription: "Complete COPD guide for the REx-PN exam: chronic bronchitis vs emphysema, oxygen therapy, medications, nursing interventions, and practice questions.",
    keywords: "COPD nursing REx-PN, chronic bronchitis, emphysema, oxygen therapy COPD, COPD medications nursing",
    definition: "Chronic Obstructive Pulmonary Disease (COPD) is a progressive, irreversible obstructive airway disease characterized by chronic airflow limitation. It encompasses chronic bronchitis (productive cough ≥3 months for 2 consecutive years) and emphysema (destruction of alveolar walls with air trapping). Smoking is the primary cause (>80% of cases).",
    pathophysiology: "In chronic bronchitis, chronic irritation causes inflammation, mucous gland hyperplasia, excessive mucus production, and airway narrowing. In emphysema, proteolytic enzymes (neutrophil elastase) destroy alveolar walls, reducing surface area for gas exchange and causing air trapping. Loss of elastic recoil prevents complete exhalation. Over time, chronic hypoxemia leads to pulmonary vasoconstriction and right-sided heart failure (cor pulmonale).",
    causesRiskFactors: ["Cigarette smoking (primary cause)", "Occupational dust and chemical exposure", "Alpha-1 antitrypsin deficiency (genetic)", "Air pollution", "Recurrent respiratory infections", "Secondhand smoke exposure", "Age >40 years"],
    signsSymptoms: {
      early: ["Chronic productive cough (chronic bronchitis)", "Dyspnea on exertion", "Wheezing", "Barrel chest (emphysema)", "Use of accessory muscles", "Pursed-lip breathing"],
      late: ["Dyspnea at rest", "Cyanosis", "Cor pulmonale (right-sided HF)", "Polycythemia (compensatory)", "Severe hypoxemia", "CO2 retention (hypercapnia)", "Clubbing of fingers (late)"]
    },
    labs: [
      { name: "ABGs", normalRange: "pH 7.35-7.45, PaCO2 35-45 mmHg, PaO2 80-100 mmHg", significance: "COPD patients may have compensated respiratory acidosis (elevated PaCO2 with near-normal pH due to renal compensation). Acute decompensation shows uncompensated respiratory acidosis." },
      { name: "SpO2", normalRange: ">94%", significance: "In COPD, target SpO2 is typically 88-92%. Excessive oxygen suppresses the hypoxic drive in CO2 retainers. Never give high-flow oxygen without a provider order." },
      { name: "CBC", normalRange: "Hgb 120-160 g/L", significance: "Polycythemia (elevated hemoglobin and hematocrit) is a compensatory response to chronic hypoxemia — the body produces more RBCs to carry oxygen." }
    ],
    medications: [
      { name: "Albuterol", drugClass: "Short-Acting Beta-2 Agonist (SABA)", action: "Rapid bronchodilation by relaxing airway smooth muscle", sideEffects: "Tachycardia, tremors, hypokalemia", nursingConsiderations: "Rescue inhaler for acute bronchospasm. If using MDI, use a spacer device. Shake well before use." },
      { name: "Tiotropium (Spiriva)", drugClass: "Long-Acting Anticholinergic (LAMA)", action: "Sustained bronchodilation by blocking muscarinic receptors in airway smooth muscle", sideEffects: "Dry mouth, urinary retention, constipation", nursingConsiderations: "Maintenance medication — NOT for acute relief. Contraindicated with narrow-angle glaucoma." },
      { name: "Fluticasone/Salmeterol (Advair)", drugClass: "ICS/LABA Combination", action: "Reduces inflammation and provides sustained bronchodilation", sideEffects: "Oral thrush, hoarseness, pneumonia risk (long-term ICS)", nursingConsiderations: "Rinse mouth after use. Maintenance only — NOT for acute bronchospasm. Salmeterol alone is NOT recommended without an ICS." }
    ],
    nursingInterventions: ["Administer low-flow oxygen (1-2 L/min via nasal cannula) to maintain SpO2 88-92%", "Position in high Fowler's or tripod position for breathing ease", "Teach pursed-lip breathing to prevent air trapping", "Encourage smoking cessation — most important intervention", "Administer bronchodilators as ordered — SABA before ICS", "Monitor ABGs and SpO2", "Encourage high-calorie, high-protein diet in small frequent meals", "Space activities with rest periods (energy conservation)", "Administer annual influenza and pneumococcal vaccines"],
    complications: ["Acute exacerbation", "Cor pulmonale (right-sided heart failure)", "Respiratory failure", "Pneumothorax (ruptured blebs in emphysema)", "Pulmonary hypertension", "Polycythemia", "Depression and anxiety"],
    patientTeaching: ["Stop smoking — use cessation aids and support programs", "Use pursed-lip breathing during activity", "Take medications as prescribed — use SABA before ICS", "Report changes in sputum colour, amount, or consistency", "Stay up to date on influenza and pneumococcal vaccinations", "Avoid respiratory irritants (dust, chemicals, extreme cold)", "Maintain adequate nutrition — eat small, frequent, high-calorie meals"],
    examPearls: ["Low-flow O2 (1-2 L/min) for COPD — target SpO2 88-92%", "COPD patients rely on hypoxic drive — high-flow O2 can suppress respiratory drive", "Pursed-lip breathing prevents alveolar collapse and air trapping", "Use SABA (albuterol) before ICS (fluticasone) — bronchodilate first, then anti-inflammatory", "Smoking cessation is the ONLY intervention that slows disease progression"],
    commonTrapAnswers: ["Applying high-flow O2 (100%) to a COPD patient", "Choosing a low-protein diet (COPD patients need high-calorie, high-protein)", "Administering ICS before SABA (reverse order)", "Selecting 'cure' as a treatment goal (COPD is irreversible)"],
    practiceQuestions: [
      { question: "A client with COPD has an SpO2 of 87% on room air. What is the appropriate nursing action?", options: ["Apply a non-rebreather mask at 15 L/min", "Apply nasal cannula at 1-2 L/min", "Begin CPAP at 10 cm H2O", "Administer albuterol nebulizer and reassess"], correctIndex: 1, rationale: "COPD patients should receive low-flow oxygen (1-2 L/min nasal cannula) to maintain SpO2 at 88-92%. High-flow oxygen (non-rebreather) can suppress the hypoxic drive in CO2 retainers, leading to respiratory depression.", isFree: true },
      { question: "Which assessment finding indicates an acute exacerbation of COPD?", options: ["Barrel-shaped chest", "SpO2 of 90% on nasal cannula", "Increased sputum production with purulent appearance", "Chronic productive morning cough"], correctIndex: 2, rationale: "Increased sputum production with a change to purulent (yellow-green) appearance indicates an acute exacerbation, often triggered by bacterial infection. Barrel chest and morning cough are chronic baseline findings. SpO2 of 90% is within the target range.", isFree: true },
      { question: "A nurse is teaching a client with COPD about pursed-lip breathing. What is the primary purpose?", options: ["To increase oxygen intake during inhalation", "To prevent airway collapse and reduce air trapping during exhalation", "To strengthen the diaphragm muscle", "To clear mucus from the airways"], correctIndex: 1, rationale: "Pursed-lip breathing creates positive back-pressure that keeps small airways open during exhalation, preventing collapse and reducing air trapping. This improves gas exchange and reduces dyspnea. It does not primarily increase O2 intake or clear mucus.", isFree: true }
    ],
    faqs: [
      { question: "Why can't COPD patients have high-flow oxygen?", answer: "In healthy individuals, the primary respiratory drive is elevated CO2 levels. In chronic COPD, patients develop a tolerance to high CO2 (chronic hypercapnia), and their respiratory drive shifts to low O2 levels (hypoxic drive). Administering high-flow O2 removes this hypoxic stimulus, which can suppress their drive to breathe and cause respiratory depression or arrest." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "ABG Interpretation", href: "/rex-pn/lab-values/abgs", type: "lab-value" },
      { title: "Pneumonia", href: "/rex-pn/conditions/pneumonia", type: "condition" },
      { title: "Pharmacology Review", href: "/rex-pn/pharmacology", type: "category" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "pneumonia",
    contentType: "condition",
    tier: "rex-pn",
    name: "Pneumonia",
    metaTitle: "Pneumonia for REx-PN: Nursing Study Guide & Practice Questions (2025)",
    metaDescription: "Master pneumonia for the REx-PN: types, pathophysiology, assessment, antibiotics, nursing interventions, and practice questions for Canadian RPN candidates.",
    keywords: "pneumonia nursing REx-PN, community acquired pneumonia, hospital acquired pneumonia, pneumonia nursing care, respiratory nursing RPN",
    definition: "Pneumonia is an acute infection of the lung parenchyma causing inflammation and consolidation of alveolar spaces with exudate. It can be community-acquired (CAP), hospital-acquired (HAP), ventilator-associated (VAP), or aspiration pneumonia.",
    pathophysiology: "Infectious organisms (bacteria, viruses, fungi) invade the lower respiratory tract, triggering an inflammatory response. Alveoli fill with fluid, inflammatory cells, and debris (consolidation), impairing gas exchange. The infection may spread to adjacent lobes (lobar pneumonia) or present as patchy infiltrates (bronchopneumonia).",
    causesRiskFactors: ["Age >65 or <2 years", "Smoking", "Chronic lung disease (COPD, asthma)", "Immunosuppression", "Swallowing dysfunction (aspiration risk)", "Mechanical ventilation", "Recent hospitalization", "Poor oral hygiene"],
    signsSymptoms: {
      early: ["Cough (productive with purulent sputum)", "Fever and chills", "Pleuritic chest pain", "Tachypnea", "Crackles on auscultation", "Dyspnea"],
      late: ["Severe hypoxemia", "Cyanosis", "Altered mental status (especially in elderly)", "Sepsis", "Respiratory failure", "Pleural effusion"]
    },
    labs: [
      { name: "WBC", normalRange: "4,500-11,000/μL", significance: "Leukocytosis (elevated WBC) indicates infection. Elderly or immunocompromised patients may not mount an elevated WBC." },
      { name: "Chest X-ray", normalRange: "Clear lung fields", significance: "Shows infiltrates, consolidation, or pleural effusion. Essential for diagnosis." },
      { name: "Sputum Culture", normalRange: "Normal flora", significance: "Identifies the causative organism and guides antibiotic selection." }
    ],
    medications: [
      { name: "Azithromycin", drugClass: "Macrolide Antibiotic", action: "Inhibits bacterial protein synthesis by binding to 50S ribosomal subunit", sideEffects: "GI upset, QT prolongation, hepatotoxicity", nursingConsiderations: "Often first-line for outpatient CAP. Complete the full course. Monitor for allergic reactions." },
      { name: "Ceftriaxone", drugClass: "3rd-Generation Cephalosporin", action: "Inhibits bacterial cell wall synthesis", sideEffects: "Allergic reactions, diarrhea, superinfection (C. difficile)", nursingConsiderations: "Ask about penicillin allergy (cross-reactivity possible). Monitor for C. difficile symptoms (watery diarrhea)." }
    ],
    nursingInterventions: ["Assess respiratory status frequently: lung sounds, SpO2, respiratory rate/effort", "Administer oxygen to maintain SpO2 >92%", "Encourage deep breathing and coughing exercises", "Incentive spirometry 10 times/hour while awake", "Position in semi-Fowler's or high Fowler's", "Encourage fluids (2-3 L/day unless contraindicated) to thin secretions", "Administer antibiotics as prescribed — note allergies", "Monitor temperature and report persistent fever", "Implement aspiration precautions for at-risk clients"],
    complications: ["Sepsis / septic shock", "Pleural effusion / empyema", "Lung abscess", "ARDS", "Respiratory failure"],
    patientTeaching: ["Complete the full course of antibiotics even if feeling better", "Use incentive spirometry as directed", "Increase fluid intake to thin secretions", "Report worsening symptoms: increasing dyspnea, high fever, changes in sputum", "Stay up to date on pneumococcal and influenza vaccines", "Avoid smoking"],
    examPearls: ["In elderly: confusion may be the FIRST sign of pneumonia (not fever)", "Aspiration pneumonia: elevate HOB, assess swallowing before oral intake", "Incentive spirometry prevents atelectasis — 10 times/hour while awake", "HAP occurs ≥48 hours after hospital admission"],
    commonTrapAnswers: ["Choosing to lay the client flat (HOB should be elevated)", "Selecting fluid restriction (fluids should be encouraged to thin secretions)", "Forgetting to ask about penicillin allergy before giving cephalosporins"],
    practiceQuestions: [
      { question: "An elderly client admitted with pneumonia is alert but confused and has a temperature of 37.2°C. The family states 'she is usually very sharp.' What should the nurse recognize?", options: ["The confusion is a normal finding in hospitalized elderly clients", "The confusion may be the primary manifestation of pneumonia in the elderly", "The low-grade fever rules out pneumonia", "The confusion is likely caused by medication side effects"], correctIndex: 1, rationale: "In elderly patients, confusion or altered mental status may be the first or only sign of pneumonia. Elderly patients may not present with classic symptoms (high fever, productive cough) due to a blunted immune response. A change in baseline mental status always warrants investigation.", isFree: true },
      { question: "Which intervention is most important for preventing aspiration pneumonia?", options: ["Administering prophylactic antibiotics", "Elevating the head of bed and assessing swallow function", "Restricting oral intake to liquids only", "Suctioning the client every 2 hours"], correctIndex: 1, rationale: "Aspiration pneumonia prevention focuses on elevating the head of bed (30-45 degrees) and performing a swallowing assessment before allowing oral intake. Clients with dysphagia, decreased LOC, or tube feedings are at highest risk.", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between CAP and HAP?", answer: "Community-acquired pneumonia (CAP) develops outside the hospital or within 48 hours of admission. Hospital-acquired pneumonia (HAP) develops ≥48 hours after admission and was not incubating at the time of admission. HAP is often caused by more resistant organisms (MRSA, Pseudomonas) and carries a higher mortality rate." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Sepsis", href: "/rex-pn/conditions/sepsis", type: "condition" },
      { title: "COPD", href: "/rex-pn/conditions/copd", type: "condition" },
      { title: "Safety & Infection Control", href: "/rex-pn/safety-and-infection-control", type: "category" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "sepsis",
    contentType: "condition",
    tier: "rex-pn",
    name: "Sepsis",
    metaTitle: "Sepsis for REx-PN: Early Recognition & Nursing Management (2025)",
    metaDescription: "Master sepsis for the REx-PN exam: SIRS criteria, qSOFA, Sepsis-3 definitions, fluid resuscitation, vasopressors, and nursing interventions.",
    keywords: "sepsis nursing REx-PN, septic shock nursing, SIRS criteria, sepsis management nursing, sepsis bundle",
    definition: "Sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection. Septic shock is sepsis with persistent hypotension requiring vasopressors and serum lactate >2 mmol/L despite adequate fluid resuscitation.",
    pathophysiology: "An infection triggers a systemic inflammatory response. Pro-inflammatory cytokines cause widespread vasodilation, increased capillary permeability, and microthrombi formation. This leads to distributive shock: massive vasodilation decreases SVR, causing hypotension. Fluid leaks into interstitial spaces. Organ perfusion decreases, leading to multiple organ dysfunction syndrome (MODS).",
    causesRiskFactors: ["Pneumonia (most common source)", "Urinary tract infection", "Abdominal infection", "Skin/soft tissue infection", "Age >65 or neonates", "Immunosuppression", "Chronic disease", "Invasive devices (central lines, urinary catheters)", "Recent surgery or hospitalization"],
    signsSymptoms: {
      early: ["Fever >38.3°C or hypothermia <36°C", "Tachycardia (HR >90)", "Tachypnea (RR >20)", "WBC >12,000 or <4,000", "Altered mental status", "Warm, flushed skin (warm shock)"],
      late: ["Hypotension (MAP <65 mmHg)", "Cool, mottled, cyanotic skin (cold shock)", "Oliguria (<0.5 mL/kg/hr)", "Elevated lactate (>2 mmol/L)", "Coagulopathy (DIC)", "Multi-organ failure"]
    },
    labs: [
      { name: "Serum Lactate", normalRange: "<2 mmol/L", significance: "Elevated lactate indicates tissue hypoperfusion and anaerobic metabolism. Lactate >4 mmol/L is associated with high mortality. Serial lactate helps guide resuscitation." },
      { name: "Blood Cultures", normalRange: "No growth", significance: "Must be drawn BEFORE antibiotics are started. Draw 2 sets from 2 different sites. Identifies the causative organism." },
      { name: "WBC", normalRange: "4,500-11,000/μL", significance: "May be elevated (leukocytosis) or critically low (leukopenia). A left shift (increased bands) indicates acute infection." },
      { name: "Procalcitonin", normalRange: "<0.1 ng/mL", significance: "Elevated procalcitonin (>0.5 ng/mL) supports bacterial infection as the cause. Helps differentiate bacterial from viral infections." }
    ],
    medications: [
      { name: "Broad-Spectrum Antibiotics", drugClass: "Various", action: "Empiric coverage of likely pathogens until culture results available", sideEffects: "Allergic reactions, C. difficile, nephrotoxicity", nursingConsiderations: "Administer within 1 hour of sepsis recognition — every hour of delay increases mortality by 7-8%. Draw blood cultures BEFORE first dose." },
      { name: "Norepinephrine", drugClass: "Vasopressor", action: "Alpha-1 agonist causing vasoconstriction to increase SVR and blood pressure", sideEffects: "Tissue necrosis if extravasates, tachyarrhythmias", nursingConsiderations: "First-line vasopressor for septic shock. Must be given through central line (preferred). Monitor blood pressure continuously. Titrate to MAP ≥65 mmHg." },
      { name: "IV Normal Saline", drugClass: "Crystalloid", action: "Volume expansion to restore intravascular volume", sideEffects: "Fluid overload, hyperchloremic acidosis", nursingConsiderations: "Initial bolus: 30 mL/kg within the first 3 hours. Reassess fluid responsiveness frequently. Monitor for pulmonary edema." }
    ],
    nursingInterventions: ["Recognize sepsis early — assess for SIRS criteria and organ dysfunction", "Draw blood cultures (2 sets) BEFORE starting antibiotics", "Administer broad-spectrum antibiotics within 1 hour", "Initiate IV fluid resuscitation: 30 mL/kg crystalloid in first 3 hours", "Monitor MAP — target ≥65 mmHg", "Monitor hourly urine output — target ≥0.5 mL/kg/hr", "Obtain serial lactate levels to guide resuscitation", "Continuous hemodynamic monitoring in ICU setting", "Assess mental status frequently", "Implement central line bundle if central access needed"],
    complications: ["Septic shock", "Multiple organ dysfunction syndrome (MODS)", "Disseminated intravascular coagulation (DIC)", "Acute respiratory distress syndrome (ARDS)", "Acute kidney injury", "Death (mortality 30-50% in septic shock)"],
    patientTeaching: ["Seek medical attention immediately for signs of infection with fever, confusion, or rapid heart rate", "Complete all prescribed antibiotic courses", "Keep vaccinations up to date", "Proper wound care and hand hygiene reduce infection risk"],
    examPearls: ["Sepsis Hour-1 Bundle: cultures, antibiotics, lactate, fluids — all within 1 hour", "Blood cultures BEFORE antibiotics — but do NOT delay antibiotics for cultures", "30 mL/kg crystalloid in first 3 hours", "Norepinephrine is first-line vasopressor", "Lactate >4 mmol/L = severe tissue hypoperfusion"],
    commonTrapAnswers: ["Waiting for culture results before starting antibiotics (start empiric antibiotics immediately)", "Choosing dopamine over norepinephrine as first-line vasopressor", "Administering IV fluids through a peripheral line for vasopressors (central line preferred)"],
    practiceQuestions: [
      { question: "A nurse suspects sepsis in a client with pneumonia who develops fever, tachycardia, and confusion. What is the first nursing action?", options: ["Administer the prescribed antibiotic immediately", "Draw blood cultures from 2 different sites", "Start a 30 mL/kg IV fluid bolus", "Notify the provider and await orders"], correctIndex: 1, rationale: "Blood cultures must be drawn BEFORE starting antibiotics to ensure accurate identification of the causative organism. However, drawing cultures should not delay antibiotic administration — both should occur within the first hour. The sequence is: draw cultures → start antibiotics → start fluids.", isFree: true },
      { question: "A client in septic shock has a MAP of 55 mmHg after receiving 30 mL/kg of IV crystalloid. What does the nurse anticipate?", options: ["A second fluid bolus of 30 mL/kg", "Initiation of norepinephrine (vasopressor)", "Oral fluid intake to supplement IV fluids", "Observation and reassessment in 2 hours"], correctIndex: 1, rationale: "If hypotension persists (MAP <65 mmHg) after adequate fluid resuscitation, vasopressor therapy is indicated. Norepinephrine is the first-line vasopressor for septic shock. Continued observation without intervention would be unsafe.", isFree: true }
    ],
    faqs: [
      { question: "What is the Sepsis Hour-1 Bundle?", answer: "The Surviving Sepsis Campaign Hour-1 Bundle includes: (1) Measure serum lactate, (2) Obtain blood cultures before antibiotics, (3) Administer broad-spectrum antibiotics, (4) Begin IV crystalloid 30 mL/kg for hypotension or lactate ≥4 mmol/L, (5) Apply vasopressors if MAP <65 mmHg during or after fluid resuscitation. All elements should be initiated within 1 hour of sepsis recognition." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Pneumonia", href: "/rex-pn/conditions/pneumonia", type: "condition" },
      { title: "Safety & Infection Control", href: "/rex-pn/safety-and-infection-control", type: "category" },
      { title: "Potassium Lab Values", href: "/rex-pn/lab-values/potassium", type: "lab-value" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "hypertension",
    contentType: "condition",
    tier: "rex-pn",
    name: "Hypertension",
    metaTitle: "Hypertension for REx-PN: Nursing Study Guide (2025)",
    metaDescription: "Master hypertension for the REx-PN: pathophysiology, classifications, medications (ACE inhibitors, beta-blockers, diuretics), nursing care, and practice questions.",
    keywords: "hypertension nursing REx-PN, high blood pressure nursing, antihypertensive medications, DASH diet, HTN nursing care",
    definition: "Hypertension is a chronic elevation of systemic arterial blood pressure defined as a sustained systolic BP ≥130 mmHg or diastolic BP ≥80 mmHg. Primary (essential) hypertension accounts for 90-95% of cases with no identifiable cause. Secondary hypertension results from an underlying condition.",
    pathophysiology: "Chronic elevation of systemic vascular resistance damages endothelial lining, promoting atherosclerosis. Sustained pressure overload forces the left ventricle to hypertrophy, eventually leading to diastolic dysfunction and heart failure. The RAAS system plays a central role: renin → angiotensin I → angiotensin II (vasoconstriction) + aldosterone (sodium/water retention).",
    causesRiskFactors: ["Family history", "High sodium diet", "Obesity", "Sedentary lifestyle", "Smoking", "Excessive alcohol", "Age >55", "Diabetes mellitus", "Chronic kidney disease", "Stress"],
    signsSymptoms: {
      early: ["Usually asymptomatic (silent killer)", "Mild headache (occipital, morning)", "Fatigue", "Elevated BP on routine screening"],
      late: ["Severe headache with visual changes", "Epistaxis", "Chest pain or dyspnea", "Altered mental status (hypertensive encephalopathy)", "Papilledema"]
    },
    labs: [
      { name: "Blood Pressure", normalRange: "<120/80 mmHg", significance: "Serial measurements on ≥2 occasions needed for diagnosis. Proper technique: correct cuff size, seated 5 min, supported arm at heart level." },
      { name: "Serum Creatinine", normalRange: "53-106 μmol/L (0.6-1.2 mg/dL)", significance: "Assesses for hypertensive nephropathy. Elevated creatinine indicates kidney damage from chronic HTN." },
      { name: "Serum Potassium", normalRange: "3.5-5.0 mEq/L", significance: "Monitor during diuretic and ACE inhibitor therapy. Thiazides cause hypokalemia; ACE inhibitors cause hyperkalemia." }
    ],
    medications: [
      { name: "Hydrochlorothiazide", drugClass: "Thiazide Diuretic", action: "Inhibits sodium reabsorption in distal tubule to reduce blood volume", sideEffects: "Hypokalemia, hyperglycemia, hyperuricemia", nursingConsiderations: "First-line for uncomplicated HTN. Give in morning. Monitor potassium. Encourage potassium-rich foods." },
      { name: "Lisinopril", drugClass: "ACE Inhibitor", action: "Blocks RAAS to reduce vasoconstriction and aldosterone secretion", sideEffects: "Dry cough, hyperkalemia, angioedema", nursingConsiderations: "Monitor K+ and renal function. Contraindicated in pregnancy. Report persistent dry cough." },
      { name: "Amlodipine", drugClass: "Calcium Channel Blocker", action: "Relaxes vascular smooth muscle to reduce peripheral resistance", sideEffects: "Peripheral edema, dizziness, flushing", nursingConsiderations: "No grapefruit juice. Monitor BP and HR. Does not require K+ monitoring." },
      { name: "Metoprolol", drugClass: "Beta-Blocker", action: "Decreases heart rate and cardiac output by blocking beta-1 receptors", sideEffects: "Bradycardia, fatigue, bronchospasm, masking hypoglycemia", nursingConsiderations: "Check apical pulse before administration. Hold if HR <60. Never stop abruptly." }
    ],
    nursingInterventions: ["Assess BP in both arms at initial visit using correct cuff size", "Educate on medication adherence — do not skip doses", "Teach orthostatic precautions (rise slowly)", "Monitor for hypertensive crisis (severe headache, visual changes, chest pain)", "Educate on DASH diet and sodium restriction (<2 g/day)", "Promote regular aerobic exercise (150 min/week)", "Encourage home BP monitoring", "Avoid OTC decongestants and NSAIDs that elevate BP"],
    complications: ["Heart failure (left ventricular hypertrophy)", "Coronary artery disease / MI", "Stroke (hemorrhagic or ischemic)", "Chronic kidney disease", "Hypertensive retinopathy", "Aortic dissection", "Hypertensive emergency"],
    patientTeaching: ["Take medications as prescribed, even if feeling well", "Monitor BP at home and keep a log", "Follow the DASH diet: fruits, vegetables, low-fat dairy, reduced sodium", "Limit sodium to <2 g/day — read food labels", "Exercise regularly — 150 minutes/week of moderate activity", "Limit alcohol to ≤2 drinks/day", "Do not smoke", "Report symptoms: severe headache, chest pain, visual changes"],
    examPearls: ["Hypertension is the 'silent killer' — most patients are asymptomatic", "DASH diet + sodium restriction + exercise = lifestyle management triad", "ACE inhibitor cough → switch to ARB", "Thiazide diuretics: monitor potassium (hypoKalemia)", "ACE inhibitors: monitor potassium (hyperKalemia)", "Never stop beta-blockers abruptly (rebound hypertension/tachycardia)"],
    commonTrapAnswers: ["Choosing to restrict potassium with thiazide diuretics (potassium is already being lost)", "Recommending exercise immediately after a hypertensive crisis", "Selecting calcium channel blocker for a patient with heart failure (amlodipine is acceptable, but diltiazem/verapamil are not)"],
    practiceQuestions: [
      { question: "A client on hydrochlorothiazide reports muscle cramps and weakness. Which lab should the nurse check first?", options: ["Serum calcium", "Serum potassium", "Serum sodium", "Blood glucose"], correctIndex: 1, rationale: "Thiazide diuretics cause potassium wasting (hypokalemia). Muscle cramps and weakness are classic signs of hypokalemia. Serum potassium should be checked immediately.", isFree: true },
      { question: "A client taking lisinopril develops a persistent dry cough. What should the nurse anticipate?", options: ["Increasing the dose", "Switching to an ARB", "Adding a cough suppressant", "Discontinuing all antihypertensives"], correctIndex: 1, rationale: "Dry cough is a well-known side effect of ACE inhibitors caused by bradykinin accumulation. Switching to an ARB (angiotensin receptor blocker) eliminates this side effect while maintaining RAAS blockade.", isFree: true },
      { question: "Which lifestyle modification should the nurse prioritize when teaching a newly diagnosed hypertensive client?", options: ["Eliminating all carbohydrates", "Following the DASH diet with sodium restriction", "Increasing protein intake to 40% of calories", "Taking daily potassium supplements"], correctIndex: 1, rationale: "The DASH diet (Dietary Approaches to Stop Hypertension) combined with sodium restriction (<2 g/day) is the most evidence-based lifestyle modification for hypertension management. It emphasizes fruits, vegetables, whole grains, and low-fat dairy.", isFree: true }
    ],
    faqs: [
      { question: "Why is hypertension called the 'silent killer'?", answer: "Most patients with hypertension have no symptoms until significant organ damage has occurred. Damage to the heart, kidneys, brain, and blood vessels progresses silently for years, which is why regular BP screening is essential." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Heart Failure", href: "/rex-pn/conditions/heart-failure", type: "condition" },
      { title: "Lisinopril Guide", href: "/medications/lisinopril", type: "medication" },
      { title: "Potassium Lab Values", href: "/rex-pn/lab-values/potassium", type: "lab-value" },
      { title: "Sodium Lab Values", href: "/rex-pn/lab-values/sodium", type: "lab-value" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "mi-acs",
    contentType: "condition",
    tier: "rex-pn",
    name: "Myocardial Infarction / ACS",
    metaTitle: "MI & ACS for REx-PN: Nursing Study Guide (2025)",
    metaDescription: "Master myocardial infarction and acute coronary syndrome for the REx-PN: STEMI vs NSTEMI, MONA-B, troponin, nursing care, and practice questions.",
    keywords: "MI nursing REx-PN, acute coronary syndrome, STEMI NSTEMI, troponin, MONA nursing, myocardial infarction nursing care",
    definition: "Acute Coronary Syndrome (ACS) encompasses unstable angina, non-ST-elevation MI (NSTEMI), and ST-elevation MI (STEMI). MI occurs when coronary artery occlusion causes irreversible myocardial cell death due to prolonged ischemia.",
    pathophysiology: "Atherosclerotic plaque rupture exposes the thrombogenic core to circulating platelets, initiating thrombus formation. The thrombus partially or completely occludes the coronary artery. Complete occlusion causes transmural ischemia (STEMI). Partial occlusion causes subendocardial ischemia (NSTEMI/unstable angina). Irreversible myocardial necrosis begins within 20-40 minutes of complete occlusion.",
    causesRiskFactors: ["Atherosclerosis", "Hypertension", "Dyslipidemia", "Smoking", "Diabetes", "Obesity", "Family history of CAD", "Age (men >45, women >55)", "Sedentary lifestyle"],
    signsSymptoms: {
      early: ["Crushing substernal chest pain (unrelieved by rest or nitroglycerin)", "Pain radiating to left arm, jaw, neck, or back", "Diaphoresis", "Nausea and vomiting", "Dyspnea", "Anxiety / sense of impending doom"],
      late: ["Hypotension", "Dysrhythmias", "Heart failure symptoms", "Cardiogenic shock", "Cardiac arrest"]
    },
    labs: [
      { name: "Troponin I/T", normalRange: "<0.04 ng/mL", significance: "Gold standard for MI diagnosis. Rises 3-6 hours after injury, peaks at 12-24 hours. Serial troponins are drawn." },
      { name: "CK-MB", normalRange: "<5 ng/mL", significance: "Rises 3-6 hours after MI. Used to detect reinfarction since it returns to normal within 48-72 hours." },
      { name: "12-Lead ECG", normalRange: "Normal sinus rhythm", significance: "STEMI shows ST elevation. NSTEMI shows ST depression or T-wave inversion. Changes help localize the infarction and guide treatment." }
    ],
    medications: [
      { name: "Aspirin", drugClass: "Antiplatelet", action: "Irreversibly inhibits COX, preventing thromboxane A2 production and platelet aggregation", sideEffects: "GI bleeding, tinnitus", nursingConsiderations: "Give 162-325 mg chewed immediately upon MI suspicion. Do NOT give enteric-coated in emergencies." },
      { name: "Nitroglycerin", drugClass: "Nitrate Vasodilator", action: "Relaxes vascular smooth muscle, reducing preload and myocardial oxygen demand", sideEffects: "Headache, hypotension, reflex tachycardia", nursingConsiderations: "Give sublingual: 1 tab q5min × 3 doses max. Hold if SBP <90. Contraindicated with PDE-5 inhibitors (sildenafil). Store in dark glass container." },
      { name: "Morphine", drugClass: "Opioid Analgesic", action: "Reduces pain, anxiety, and preload through venodilation", sideEffects: "Respiratory depression, hypotension, nausea", nursingConsiderations: "Monitor respiratory rate (hold if RR <12). Antidote: naloxone. Used when nitroglycerin fails to relieve pain." }
    ],
    nursingInterventions: ["Activate rapid response / call code if applicable", "Obtain 12-lead ECG within 10 minutes", "Administer aspirin 162-325 mg chewed immediately", "Administer nitroglycerin SL as ordered", "Administer oxygen only if SpO2 <94%", "Establish IV access", "Continuous cardiac monitoring", "Monitor vital signs every 5-15 minutes", "Prepare for PCI (percutaneous coronary intervention) for STEMI — door-to-balloon time <90 min", "Reduce anxiety — calm environment, reassurance", "Monitor for complications: dysrhythmias, heart failure, cardiogenic shock"],
    complications: ["Cardiac dysrhythmias (most common cause of death)", "Heart failure", "Cardiogenic shock", "Papillary muscle rupture (mitral regurgitation)", "Ventricular septal defect", "Ventricular aneurysm", "Pericarditis (Dressler syndrome)", "Death"],
    patientTeaching: ["Call emergency services immediately for chest pain unrelieved by rest", "Take nitroglycerin SL: 1 tab q5min × 3 doses, then call 911 if no relief", "Take all prescribed medications as directed", "Cardiac rehabilitation after discharge", "Lifestyle modifications: smoking cessation, DASH diet, exercise", "Report any return of chest pain, shortness of breath, or dizziness"],
    examPearls: ["MONA-B: Morphine, Oxygen (if SpO2 <94%), Nitroglycerin, Aspirin, Beta-blocker", "Door-to-balloon time for STEMI: <90 minutes", "Troponin = gold standard marker for MI", "Aspirin should be CHEWED (not swallowed whole) for rapid absorption", "Nitroglycerin contraindicated if SBP <90 or with PDE-5 inhibitors"],
    commonTrapAnswers: ["Giving oxygen to an MI patient with SpO2 of 97% (not needed if SpO2 >94%)", "Choosing enteric-coated aspirin in an emergency (regular aspirin, chewed)", "Administering nitroglycerin to a patient who took sildenafil within 24-48 hours"],
    practiceQuestions: [
      { question: "A client arrives at the emergency department with crushing chest pain. After calling for help, what is the nurse's priority action?", options: ["Administer morphine IV for pain", "Obtain a 12-lead ECG", "Give aspirin 325 mg chewed", "Start oxygen at 4 L/min via nasal cannula"], correctIndex: 2, rationale: "Aspirin administration is the immediate priority to inhibit further platelet aggregation and thrombus formation. A 12-lead ECG should be obtained within 10 minutes but aspirin should not be delayed. Oxygen is only indicated if SpO2 <94%.", isFree: true },
      { question: "A client with an MI asks for nitroglycerin. The nurse checks blood pressure: 82/56 mmHg. What should the nurse do?", options: ["Give half a tablet of nitroglycerin", "Withhold nitroglycerin and notify the provider", "Give nitroglycerin with IV fluids", "Elevate the head of the bed and give nitroglycerin"], correctIndex: 1, rationale: "Nitroglycerin is contraindicated when systolic blood pressure is below 90 mmHg because it causes vasodilation that would further decrease blood pressure. Withhold the medication and notify the provider for alternative pain management.", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between STEMI and NSTEMI?", answer: "STEMI (ST-Elevation MI) involves complete coronary artery occlusion with transmural (full-thickness) myocardial damage. ECG shows ST segment elevation. Treatment is emergent PCI (door-to-balloon <90 min) or thrombolytics. NSTEMI involves partial occlusion with subendocardial damage. ECG shows ST depression or T-wave inversion. Troponin is elevated. Treatment includes anticoagulation and possible PCI." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Heart Failure", href: "/rex-pn/conditions/heart-failure", type: "condition" },
      { title: "Hypertension", href: "/rex-pn/conditions/hypertension", type: "condition" },
      { title: "Stable vs Unstable Angina", href: "/rex-pn/compare/stable-vs-unstable-angina", type: "comparison" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "stroke",
    contentType: "condition",
    tier: "rex-pn",
    name: "Stroke (CVA)",
    metaTitle: "Stroke (CVA) for REx-PN: Nursing Study Guide (2025)",
    metaDescription: "Master stroke management for the REx-PN: ischemic vs hemorrhagic, FAST assessment, thrombolytics, nursing interventions, and practice questions.",
    keywords: "stroke nursing REx-PN, CVA nursing care, ischemic stroke, hemorrhagic stroke, tPA nursing, FAST assessment",
    definition: "A stroke (cerebrovascular accident/CVA) is an acute neurological deficit caused by disruption of blood flow to the brain. Ischemic stroke (87% of strokes) results from arterial occlusion by thrombus or embolism. Hemorrhagic stroke results from rupture of a cerebral blood vessel.",
    pathophysiology: "In ischemic stroke, a thrombus or embolus blocks a cerebral artery, causing ischemia in the territory supplied by that vessel. Brain tissue dies within minutes without blood flow. The ischemic penumbra (surrounding area) can be salvaged with rapid reperfusion. In hemorrhagic stroke, a ruptured vessel causes bleeding into brain tissue (intracerebral) or subarachnoid space, causing direct tissue damage and increased intracranial pressure.",
    causesRiskFactors: ["Hypertension (primary risk factor)", "Atrial fibrillation (embolic stroke)", "Atherosclerosis", "Diabetes", "Smoking", "Obesity", "Dyslipidemia", "Previous TIA", "Age >55", "Family history"],
    signsSymptoms: {
      early: ["Sudden onset of symptoms (hallmark)", "Facial drooping (unilateral)", "Arm/leg weakness (unilateral)", "Slurred speech or aphasia", "Sudden severe headache (hemorrhagic)", "Visual disturbances", "Confusion"],
      late: ["Altered level of consciousness", "Signs of increased ICP (Cushing triad: bradycardia, hypertension, irregular respirations)", "Seizures", "Herniation (fixed dilated pupil, posturing)"]
    },
    labs: [
      { name: "CT Scan (Non-contrast)", normalRange: "No acute findings", significance: "FIRST diagnostic study — must be done BEFORE thrombolytics to rule out hemorrhagic stroke. Ischemic stroke may not show on CT for 6-24 hours." },
      { name: "Coagulation Studies", normalRange: "INR 1.0, PT 11-13.5 sec", significance: "Must assess before thrombolytic therapy. Elevated INR/PT may be a contraindication for tPA." },
      { name: "Blood Glucose", normalRange: "3.9-5.5 mmol/L", significance: "Hypoglycemia can mimic stroke symptoms. Must be checked early to rule out metabolic cause." }
    ],
    medications: [
      { name: "Alteplase (tPA)", drugClass: "Thrombolytic", action: "Dissolves clot by converting plasminogen to plasmin", sideEffects: "Hemorrhage (most serious), angioedema", nursingConsiderations: "For ISCHEMIC stroke only. Window: within 4.5 hours of symptom onset. CT must rule out hemorrhage first. Monitor for bleeding. No anticoagulants for 24 hours after." },
      { name: "Aspirin", drugClass: "Antiplatelet", action: "Prevents platelet aggregation for secondary prevention", sideEffects: "GI bleeding", nursingConsiderations: "Given within 24-48 hours of ischemic stroke onset (not if tPA given within 24 hours)." }
    ],
    nursingInterventions: ["Recognize stroke FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency", "Obtain CT scan immediately to differentiate ischemic vs hemorrhagic", "If ischemic and within window: prepare for tPA administration", "Monitor neurological status every 1-2 hours (NIH Stroke Scale)", "Maintain HOB at 30 degrees (reduce ICP)", "NPO until swallowing assessment completed", "Monitor blood pressure per protocol (permissive hypertension initially)", "Implement aspiration precautions", "Prevent complications: DVT, pneumonia, skin breakdown"],
    complications: ["Cerebral edema", "Increased intracranial pressure", "Herniation", "Aspiration pneumonia", "DVT / PE", "Depression", "Recurrent stroke"],
    patientTeaching: ["FAST signs: Face drooping, Arm weakness, Speech difficulty, Time to call 911", "Take all medications as prescribed", "Attend rehabilitation appointments", "Manage risk factors: BP control, smoking cessation, diabetes management", "Report new symptoms immediately"],
    examPearls: ["CT scan BEFORE tPA — must rule out hemorrhage", "tPA window: within 4.5 hours of symptom onset for ischemic stroke", "tPA is CONTRAINDICATED in hemorrhagic stroke", "NPO until swallowing assessment — aspiration is a major risk", "FAST: Face, Arms, Speech, Time", "Do NOT lower BP aggressively in acute ischemic stroke (permissive hypertension)"],
    commonTrapAnswers: ["Giving tPA without a CT scan first", "Administering tPA for hemorrhagic stroke", "Lowering blood pressure aggressively in acute ischemic stroke", "Offering oral fluids before swallowing assessment"],
    practiceQuestions: [
      { question: "A client presents with sudden right-sided weakness and slurred speech. Symptoms started 2 hours ago. What is the priority nursing action?", options: ["Administer tPA immediately", "Obtain a non-contrast CT scan of the head", "Start aspirin 325 mg", "Position the client flat in bed"], correctIndex: 1, rationale: "A non-contrast CT scan must be performed BEFORE any treatment to differentiate ischemic from hemorrhagic stroke. tPA is indicated for ischemic stroke but is contraindicated and lethal in hemorrhagic stroke. CT is the essential first step.", isFree: true },
      { question: "A client received tPA 30 minutes ago. The nurse notes blood oozing from the IV site. What is the priority action?", options: ["Apply pressure to the IV site and continue monitoring", "Document the finding and recheck in 1 hour", "Stop the tPA infusion and notify the provider immediately", "Apply a pressure dressing and continue the infusion"], correctIndex: 0, rationale: "Minor bleeding at access sites is an expected side effect of thrombolytic therapy. Apply direct pressure and continue monitoring. However, if major bleeding occurs (intracranial, GI, large hematoma), stop the infusion immediately. This question tests differentiating minor vs major bleeding.", isFree: true }
    ],
    faqs: [
      { question: "What is the time window for tPA in ischemic stroke?", answer: "Alteplase (tPA) must be administered within 4.5 hours of symptom onset for ischemic stroke. A non-contrast CT scan must rule out hemorrhage before administration. The earlier tPA is given within this window, the better the outcome. 'Time is brain' — every minute without treatment, approximately 1.9 million neurons die." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Hypertension", href: "/rex-pn/conditions/hypertension", type: "condition" },
      { title: "Clinical Judgment", href: "/rex-pn/clinical-judgment", type: "category" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  }
];

export const rexPnMedications: RexPnMedicationPage[] = [
  {
    slug: "furosemide",
    contentType: "medication",
    tier: "rex-pn",
    genericName: "Furosemide",
    brandNames: ["Lasix"],
    drugClass: "Loop Diuretic",
    metaTitle: "Furosemide (Lasix) for REx-PN: Pharmacology Guide (2025)",
    metaDescription: "Master furosemide for the REx-PN exam: mechanism of action, side effects, potassium monitoring, nursing considerations, and practice questions.",
    keywords: "furosemide nursing, Lasix REx-PN, loop diuretic nursing, furosemide side effects, potassium monitoring diuretics",
    mechanism: "Inhibits the sodium-potassium-2-chloride (Na-K-2Cl) cotransporter in the thick ascending loop of Henle. This blocks reabsorption of sodium, potassium, and chloride, producing a potent diuretic effect. Also increases renal blood flow through prostaglandin-mediated vasodilation.",
    indications: ["Heart failure (fluid overload)", "Pulmonary edema", "Hypertension", "Edema (hepatic, renal)", "Acute kidney injury (to maintain urine output)", "Hypercalcemia"],
    sideEffects: [
      { effect: "Hypokalemia", severity: "Serious", detail: "Massive potassium loss in urine due to increased sodium delivery to the distal tubule, where sodium is exchanged for potassium. Can cause fatal cardiac arrhythmias." },
      { effect: "Dehydration / Hypotension", severity: "Serious", detail: "Rapid fluid loss can cause orthostatic hypotension, dizziness, and prerenal azotemia." },
      { effect: "Ototoxicity", severity: "Serious", detail: "High doses or rapid IV administration can cause hearing loss (usually reversible). Risk increases with concurrent aminoglycoside use." },
      { effect: "Hyperglycemia", severity: "Common", detail: "Impairs glucose tolerance by reducing insulin secretion. Monitor blood glucose in diabetic patients." }
    ],
    contraindications: ["Anuria (no urine output)", "Severe electrolyte depletion", "Hypersensitivity to sulfonamides (cross-reactivity possible)", "Hepatic coma"],
    nursingConsiderations: ["Monitor serum potassium before and during therapy — hypokalemia is the most dangerous side effect", "Assess daily weights (same time, same scale) — most reliable indicator of fluid status", "Monitor intake and output strictly", "Administer in the morning to avoid nocturia (or early afternoon for second dose)", "IV furosemide: push slowly over 1-2 minutes to prevent ototoxicity", "Monitor blood pressure for orthostatic hypotension — teach client to rise slowly", "Assess for signs of dehydration: dry mucous membranes, poor skin turgor, concentrated urine"],
    monitoring: ["Serum potassium (before starting and regularly during therapy)", "Serum sodium, chloride, magnesium, calcium", "BUN and creatinine (renal function)", "Blood glucose (especially in diabetic clients)", "Daily weights and intake/output", "Blood pressure (orthostatic measurements)", "Hearing assessment with high-dose or prolonged therapy"],
    patientTeaching: ["Take in the morning to avoid nighttime urination", "Eat potassium-rich foods: bananas, oranges, potatoes, spinach, avocados", "Take potassium supplements if prescribed", "Rise slowly from sitting or lying positions to prevent dizziness", "Report muscle cramps, weakness, or irregular heartbeat (signs of hypokalemia)", "Weigh yourself daily and report weight loss >1 kg/day", "Avoid excessive sun exposure (photosensitivity)"],
    examTips: ["Furosemide causes hypoKALemia — always monitor potassium", "IV push slowly (1-2 min) to prevent ototoxicity", "Digoxin + furosemide = dangerous combo (hypokalemia increases digoxin toxicity)", "Give in the morning to avoid nocturia", "Daily weights are the best indicator of diuretic effectiveness"],
    practiceQuestions: [
      { question: "A client taking furosemide and digoxin has a serum potassium of 2.9 mEq/L. What is the nurse's priority concern?", options: ["Risk of orthostatic hypotension", "Increased risk of digoxin toxicity", "Development of metabolic alkalosis", "Risk of hyperglycemia"], correctIndex: 1, rationale: "Hypokalemia (K+ 2.9) dramatically increases the risk of digoxin toxicity because digoxin and potassium compete for the same binding sites on the Na+/K+ ATPase pump. With low potassium, more digoxin binds, increasing its toxic effects (bradycardia, dysrhythmias, visual changes).", isFree: true },
      { question: "A nurse is administering IV furosemide. Which action is most important?", options: ["Administer the medication as a rapid IV push", "Push the medication slowly over 1-2 minutes", "Dilute in 500 mL of D5W and infuse over 4 hours", "Administer intramuscularly if IV access is difficult"], correctIndex: 1, rationale: "IV furosemide must be pushed slowly over 1-2 minutes to prevent ototoxicity (hearing loss). Rapid IV administration causes high peak drug concentrations in the inner ear, damaging cochlear hair cells.", isFree: true },
      { question: "Which food should the nurse recommend to a client taking furosemide?", options: ["White bread", "Canned soup", "Banana", "Processed deli meat"], correctIndex: 2, rationale: "Bananas are rich in potassium and help replace potassium lost through furosemide-induced diuresis. Canned soup and deli meat are high in sodium, which should be limited. White bread has minimal potassium content.", isFree: true }
    ],
    faqs: [
      { question: "Why is potassium monitoring so important with furosemide?", answer: "Furosemide blocks sodium reabsorption in the loop of Henle, causing massive sodium and water excretion. As more sodium reaches the distal tubule, the kidney exchanges sodium for potassium, leading to significant potassium loss. Hypokalemia can cause fatal cardiac arrhythmias (especially V-fib) and is particularly dangerous when combined with digoxin." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Heart Failure", href: "/rex-pn/conditions/heart-failure", type: "condition" },
      { title: "Potassium Lab Values", href: "/rex-pn/lab-values/potassium", type: "lab-value" },
      { title: "Pharmacology Review", href: "/rex-pn/pharmacology", type: "category" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  }
];

export const rexPnLabValues: RexPnLabValuePage[] = [
  {
    slug: "potassium",
    contentType: "lab-value",
    tier: "rex-pn",
    name: "Potassium",
    fullName: "Serum Potassium (K+)",
    metaTitle: "Potassium Lab Values for REx-PN: Normal Range & Nursing Guide (2025)",
    metaDescription: "Master potassium lab values for the REx-PN: normal range 3.5-5.0 mEq/L, hypokalemia, hyperkalemia, ECG changes, nursing interventions, and practice questions.",
    keywords: "potassium lab values REx-PN, hypokalemia nursing, hyperkalemia nursing, potassium normal range, electrolyte imbalance RPN",
    normalRangeUS: { value: "3.5-5.0", unit: "mEq/L" },
    normalRangeCA: { value: "3.5-5.0", unit: "mmol/L" },
    overview: "Potassium is the primary intracellular cation, critical for cardiac conduction, muscle contraction, and nerve impulse transmission. Even small deviations from the normal range (3.5-5.0 mEq/L) can cause life-threatening cardiac arrhythmias. Potassium imbalances are among the most common and most dangerous electrolyte disorders tested on the REx-PN.",
    highSignificance: [
      { condition: "Renal failure", explanation: "Kidneys cannot excrete potassium, causing dangerous accumulation" },
      { condition: "ACE inhibitors / potassium-sparing diuretics", explanation: "Reduce aldosterone-mediated potassium excretion" },
      { condition: "Metabolic acidosis", explanation: "H+ ions move into cells, displacing K+ into the bloodstream (transcellular shift)" },
      { condition: "Tissue destruction (crush injury, burns, hemolysis)", explanation: "Intracellular potassium released into circulation" },
      { condition: "Excessive supplementation", explanation: "Oral or IV potassium administration exceeding excretion capacity" }
    ],
    lowSignificance: [
      { condition: "Loop diuretics (furosemide)", explanation: "Increased sodium delivery to distal tubule promotes potassium excretion" },
      { condition: "Vomiting / NG suction", explanation: "Loss of potassium in GI secretions and metabolic alkalosis-driven renal K+ wasting" },
      { condition: "Insulin administration", explanation: "Insulin activates Na+/K+ ATPase, driving K+ into cells" },
      { condition: "Metabolic alkalosis", explanation: "H+ moves out of cells, K+ moves in (transcellular shift)" },
      { condition: "Inadequate dietary intake", explanation: "Poor nutrition or NPO status without supplementation" }
    ],
    associatedConditions: ["Heart failure", "DKA", "Renal failure", "Digoxin therapy", "Burns"],
    nursingImplications: ["Monitor cardiac rhythm continuously when K+ is <3.0 or >5.5 mEq/L", "IV potassium: NEVER give by IV push — always dilute and infuse slowly (max 10 mEq/hr via peripheral line, 20 mEq/hr via central line)", "For hyperkalemia: prepare calcium gluconate (cardiac membrane stabilizer), insulin + glucose (drives K+ intracellularly), sodium bicarbonate, kayexalate", "For hypokalemia: administer potassium supplements (oral preferred), encourage potassium-rich foods", "Assess for ECG changes: hypokalemia = flat T waves, U waves; hyperkalemia = peaked T waves, widened QRS", "Monitor clients on digoxin closely — hypokalemia increases digoxin toxicity"],
    examAlerts: ["NEVER give IV potassium by push — fatal arrhythmias", "Peaked T waves on ECG = think hyperKALemia", "Flat T waves and U waves = hypoKALemia", "Hypokalemia + digoxin = increased toxicity risk", "In DKA: check K+ BEFORE insulin — insulin drives K+ into cells", "Loop diuretics (furosemide) cause K+ LOSS; ACE inhibitors cause K+ RETENTION"],
    practiceQuestions: [
      { question: "A client's serum potassium is 6.2 mEq/L. Which ECG change should the nurse expect?", options: ["Prolonged QT interval", "Peaked T waves", "ST depression", "U waves"], correctIndex: 1, rationale: "Hyperkalemia (K+ >5.0) causes peaked, tall, narrow T waves on ECG. As potassium rises further, the QRS widens and eventually sinusoidal waves appear before cardiac arrest. Peaked T waves are the earliest ECG sign of hyperkalemia.", isFree: true },
      { question: "A nurse receives an order for IV potassium 40 mEq in 1000 mL NS. Which action is correct?", options: ["Administer by IV push for rapid correction", "Infuse over 4 hours via infusion pump", "Administer over 30 minutes by gravity drip", "Dilute in 50 mL and give over 15 minutes"], correctIndex: 1, rationale: "IV potassium must NEVER be given by IV push — it can cause fatal cardiac arrest. It must be diluted and infused slowly using an infusion pump. Typical rate is 10 mEq/hr via peripheral IV. Concentrated solutions require a central line.", isFree: true },
      { question: "A client taking furosemide and digoxin reports nausea, blurred vision, and seeing yellow-green halos. Serum potassium is 3.1 mEq/L. What is occurring?", options: ["Furosemide toxicity", "Digoxin toxicity precipitated by hypokalemia", "Normal side effects of both medications", "Hyperkalemia from drug interaction"], correctIndex: 1, rationale: "Nausea, visual changes (yellow-green halos), and blurred vision are classic signs of digoxin toxicity. Hypokalemia (K+ 3.1) increases digoxin toxicity because potassium and digoxin compete for the same binding sites. With less potassium, more digoxin binds, causing toxic effects.", isFree: true }
    ],
    faqs: [
      { question: "Why can't potassium be given by IV push?", answer: "Rapid IV potassium administration causes a sudden spike in serum potassium concentration near the heart, which can cause fatal cardiac arrest (ventricular fibrillation). Potassium must always be diluted in IV solution and infused slowly via an infusion pump. Maximum recommended rate is 10 mEq/hr through a peripheral IV." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Heart Failure", href: "/rex-pn/conditions/heart-failure", type: "condition" },
      { title: "DKA & HHS", href: "/rex-pn/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "Furosemide Guide", href: "/rex-pn/medications/furosemide", type: "medication" },
      { title: "Sodium Lab Values", href: "/rex-pn/lab-values/sodium", type: "lab-value" },
      { title: "ABG Interpretation", href: "/rex-pn/lab-values/abgs", type: "lab-value" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "sodium",
    contentType: "lab-value",
    tier: "rex-pn",
    name: "Sodium",
    fullName: "Serum Sodium (Na+)",
    metaTitle: "Sodium Lab Values for REx-PN: Normal Range & Nursing Guide (2025)",
    metaDescription: "Master sodium lab values for the REx-PN: normal range 135-145 mEq/L, hyponatremia, hypernatremia, fluid balance, nursing interventions, and practice questions.",
    keywords: "sodium lab values REx-PN, hyponatremia nursing, hypernatremia nursing, sodium normal range, fluid balance nursing",
    normalRangeUS: { value: "135-145", unit: "mEq/L" },
    normalRangeCA: { value: "135-145", unit: "mmol/L" },
    overview: "Sodium is the primary extracellular cation and the main determinant of serum osmolality and fluid distribution. Sodium imbalances directly affect the central nervous system through osmotic shifts of water across the blood-brain barrier. Hyponatremia causes cerebral edema; hypernatremia causes cellular dehydration.",
    highSignificance: [
      { condition: "Dehydration", explanation: "Water loss exceeds sodium loss, concentrating serum sodium" },
      { condition: "Diabetes insipidus", explanation: "Insufficient ADH causes massive water loss through dilute urine" },
      { condition: "Excessive sodium intake", explanation: "Hypertonic IV solutions or excessive dietary sodium" },
      { condition: "Cushing syndrome", explanation: "Excess cortisol promotes sodium retention" }
    ],
    lowSignificance: [
      { condition: "SIADH", explanation: "Excess ADH causes water retention, diluting serum sodium" },
      { condition: "Heart failure", explanation: "Decreased cardiac output triggers ADH release and water retention" },
      { condition: "Diuretic use (thiazides)", explanation: "Impair sodium reabsorption in the distal tubule" },
      { condition: "Water intoxication", explanation: "Excessive free water intake dilutes serum sodium" }
    ],
    associatedConditions: ["Heart failure", "SIADH", "Diabetes insipidus", "Burns", "Liver cirrhosis"],
    nursingImplications: ["For hypernatremia: administer hypotonic fluids (0.45% NaCl), encourage oral water intake, monitor neurological status", "For hyponatremia: fluid restriction (1-1.5 L/day), administer hypertonic saline (3% NaCl) via IV pump if severe", "Correct sodium slowly — maximum 8-10 mEq/L per 24 hours to prevent osmotic demyelination syndrome", "Monitor neurological status every 2-4 hours during correction", "Implement seizure precautions for severe imbalances", "Monitor daily weights and I&O"],
    examAlerts: ["SIADH = dilutional hyponatremia (too much water, not too little sodium)", "Diabetes insipidus = hypernatremia (massive water loss)", "Correct sodium SLOWLY — rapid correction causes osmotic demyelination (central pontine myelinolysis)", "Max correction: 8-10 mEq/L per 24 hours", "Hyponatremia: restrict fluids. Hypernatremia: give fluids"],
    practiceQuestions: [
      { question: "A client with SIADH has a serum sodium of 118 mEq/L. What is the priority nursing intervention?", options: ["Encourage oral fluid intake of 3 L/day", "Implement fluid restriction and administer hypertonic saline as ordered", "Administer IV normal saline bolus", "Give oral sodium supplements"], correctIndex: 1, rationale: "SIADH causes dilutional hyponatremia from excess water retention. Treatment includes fluid restriction (to reduce dilution) and hypertonic saline (3% NaCl) for severe symptomatic hyponatremia. Encouraging fluids would worsen hyponatremia.", isFree: true },
      { question: "A client with hypernatremia is receiving IV correction. The serum sodium dropped from 162 to 140 mEq/L in 12 hours. What should the nurse report?", options: ["The correction is appropriate and within safe limits", "The correction is too rapid and poses a risk of cerebral edema", "The sodium is now normal and no further monitoring is needed", "Additional hypotonic fluids should be given"], correctIndex: 1, rationale: "A drop of 22 mEq/L in 12 hours far exceeds the safe correction rate of 8-10 mEq/L per 24 hours. Overly rapid correction of hypernatremia can cause cerebral edema as water shifts into brain cells. This must be reported immediately.", isFree: true }
    ],
    faqs: [
      { question: "Why must sodium be corrected slowly?", answer: "In chronic sodium imbalances, brain cells adapt by adjusting their internal osmolytes. If serum sodium is corrected too rapidly, water shifts across the blood-brain barrier can cause severe neurological damage. Rapid correction of hyponatremia causes osmotic demyelination syndrome; rapid correction of hypernatremia causes cerebral edema." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Heart Failure", href: "/rex-pn/conditions/heart-failure", type: "condition" },
      { title: "Potassium Lab Values", href: "/rex-pn/lab-values/potassium", type: "lab-value" },
      { title: "Fundamentals", href: "/rex-pn/fundamentals", type: "category" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "abgs",
    contentType: "lab-value",
    tier: "rex-pn",
    name: "ABGs",
    fullName: "Arterial Blood Gases",
    metaTitle: "ABG Interpretation for REx-PN: Complete Nursing Guide (2025)",
    metaDescription: "Master ABG interpretation for the REx-PN: normal values, acid-base disorders, ROME method, respiratory vs metabolic, compensation, and practice questions.",
    keywords: "ABG interpretation REx-PN, arterial blood gases nursing, acid base balance, respiratory acidosis, metabolic acidosis, ROME method",
    normalRangeUS: { value: "pH 7.35-7.45, PaCO2 35-45 mmHg, HCO3 22-26 mEq/L, PaO2 80-100 mmHg", unit: "" },
    normalRangeCA: { value: "pH 7.35-7.45, PaCO2 35-45 mmHg, HCO3 22-26 mmol/L, PaO2 80-100 mmHg", unit: "" },
    overview: "Arterial blood gases measure the pH, partial pressures of oxygen (PaO2) and carbon dioxide (PaCO2), and bicarbonate (HCO3) in arterial blood. ABG interpretation is essential for identifying acid-base disorders and guiding respiratory and metabolic management. The body maintains pH within a narrow range (7.35-7.45) through respiratory (CO2) and renal (HCO3) buffer systems.",
    highSignificance: [
      { condition: "Respiratory Acidosis (pH <7.35, PaCO2 >45)", explanation: "Hypoventilation causes CO2 retention. Causes: COPD, opioid overdose, respiratory failure, pneumothorax." },
      { condition: "Metabolic Acidosis (pH <7.35, HCO3 <22)", explanation: "Excess acid or loss of bicarbonate. Causes: DKA, renal failure, lactic acidosis, diarrhea." },
      { condition: "Respiratory Alkalosis (pH >7.45, PaCO2 <35)", explanation: "Hyperventilation blows off excess CO2. Causes: anxiety, pain, PE, early salicylate toxicity." },
      { condition: "Metabolic Alkalosis (pH >7.45, HCO3 >26)", explanation: "Excess bicarbonate or loss of acid. Causes: vomiting, NG suction, excessive antacid use, diuretics." }
    ],
    lowSignificance: [],
    associatedConditions: ["COPD", "DKA", "Renal failure", "Pneumonia", "PE", "Sepsis", "Respiratory failure"],
    nursingImplications: ["Use the ROME method: Respiratory = Opposite (pH and CO2 go opposite directions), Metabolic = Equal (pH and HCO3 go same direction)", "For respiratory acidosis: improve ventilation — position upright, incentive spirometry, bronchodilators, possible mechanical ventilation", "For metabolic acidosis: treat the underlying cause — insulin for DKA, dialysis for renal failure, fluids for lactic acidosis", "For respiratory alkalosis: reduce hyperventilation — rebreathing, treat pain/anxiety, reduce ventilator settings", "For metabolic alkalosis: replace fluids and electrolytes, treat underlying cause (stop NG suction, antiemetics for vomiting)", "After radial artery puncture: hold pressure for 5 minutes, assess Allen test before draw"],
    examAlerts: ["ROME: Respiratory Opposite, Metabolic Equal", "Look at pH first: <7.35 = acidosis, >7.45 = alkalosis", "Then look at CO2 (respiratory) and HCO3 (metabolic) to determine the cause", "Compensation: the body's other system tries to normalize pH — partial or full", "In COPD: expect compensated respiratory acidosis (elevated CO2 with near-normal pH)", "DKA = metabolic acidosis with Kussmaul respirations (respiratory compensation)"],
    practiceQuestions: [
      { question: "A client's ABG shows: pH 7.28, PaCO2 58 mmHg, HCO3 24 mEq/L. What acid-base disorder is present?", options: ["Respiratory acidosis, uncompensated", "Metabolic acidosis, uncompensated", "Respiratory alkalosis, compensated", "Mixed acid-base disorder"], correctIndex: 0, rationale: "pH 7.28 = acidosis. PaCO2 58 = elevated (respiratory cause). HCO3 24 = normal (kidneys have not compensated yet). Using ROME: Respiratory = Opposite — pH is low, CO2 is high = respiratory acidosis. HCO3 is normal = uncompensated.", isFree: true },
      { question: "A client in DKA has ABGs showing: pH 7.22, PaCO2 24 mmHg, HCO3 12 mEq/L. Interpret these results.", options: ["Respiratory acidosis with metabolic compensation", "Metabolic acidosis with respiratory compensation", "Respiratory alkalosis, uncompensated", "Metabolic alkalosis, uncompensated"], correctIndex: 1, rationale: "pH 7.22 = acidosis. HCO3 12 = low (metabolic cause — acid accumulation in DKA). PaCO2 24 = low (respiratory compensation — lungs are blowing off CO2 via Kussmaul respirations to raise pH). This is metabolic acidosis with partial respiratory compensation.", isFree: true },
      { question: "A nurse is preparing to draw an ABG from the radial artery. Which assessment must be done first?", options: ["Check blood pressure in both arms", "Perform the Allen test", "Assess capillary refill in all fingers", "Apply a tourniquet above the wrist"], correctIndex: 1, rationale: "The Allen test must be performed before radial artery puncture to verify adequate collateral circulation through the ulnar artery. If the ulnar artery is insufficient, the radial artery should not be punctured because it could compromise blood supply to the hand.", isFree: true }
    ],
    faqs: [
      { question: "What is the ROME method for ABG interpretation?", answer: "ROME is a mnemonic: Respiratory = Opposite (in respiratory disorders, pH and PaCO2 move in opposite directions — one goes up, the other goes down), Metabolic = Equal (in metabolic disorders, pH and HCO3 move in the same direction — both go up or both go down). This helps quickly identify whether the primary disorder is respiratory or metabolic." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "COPD", href: "/rex-pn/conditions/copd", type: "condition" },
      { title: "DKA & HHS", href: "/rex-pn/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "Potassium Lab Values", href: "/rex-pn/lab-values/potassium", type: "lab-value" },
      { title: "Sodium Lab Values", href: "/rex-pn/lab-values/sodium", type: "lab-value" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  }
];

export const rexPnComparisons: RexPnComparisonPage[] = [
  {
    slug: "dka-vs-hhs",
    contentType: "comparison",
    tier: "rex-pn",
    metaTitle: "DKA vs HHS: Side-by-Side Comparison for REx-PN (2025)",
    metaDescription: "Compare DKA vs HHS for the REx-PN exam: pathophysiology, lab values, clinical presentation, treatment priorities, and practice questions.",
    keywords: "DKA vs HHS, diabetic ketoacidosis vs hyperosmolar hyperglycemic state, DKA HHS comparison nursing, REx-PN diabetes",
    h1: "DKA vs HHS: A Side-by-Side Comparison",
    introText: "Diabetic ketoacidosis (DKA) and hyperosmolar hyperglycemic state (HHS) are both acute, life-threatening complications of diabetes mellitus. Differentiating between them is a high-yield topic on the REx-PN exam. While both involve severe hyperglycemia, their pathophysiology, presentation, and treatment priorities differ significantly.",
    conditionA: {
      name: "DKA (Diabetic Ketoacidosis)",
      features: {
        "Type of Diabetes": "Primarily Type 1 (can occur in Type 2)",
        "Onset": "Rapid (hours to days)",
        "Blood Glucose": "Typically >14 mmol/L (250 mg/dL)",
        "Ketones": "Present (blood and urine)",
        "pH": "<7.35 (metabolic acidosis)",
        "Serum Osmolality": "Variable (usually <320 mOsm/kg)",
        "Respirations": "Kussmaul (deep, rapid — compensatory)",
        "Breath Odor": "Fruity / acetone",
        "Dehydration": "Moderate",
        "Mental Status": "Alert to confused",
        "Mortality Rate": "1-5%",
        "Treatment Priority": "Insulin drip + IV fluids + K+ monitoring"
      }
    },
    conditionB: {
      name: "HHS (Hyperosmolar Hyperglycemic State)",
      features: {
        "Type of Diabetes": "Primarily Type 2",
        "Onset": "Gradual (days to weeks)",
        "Blood Glucose": "Typically >33 mmol/L (600 mg/dL)",
        "Ketones": "Minimal or absent",
        "pH": "Usually >7.30 (no significant acidosis)",
        "Serum Osmolality": ">320 mOsm/kg (often >350)",
        "Respirations": "Normal or tachypneic",
        "Breath Odor": "Normal",
        "Dehydration": "Severe (may lose 8-12 L)",
        "Mental Status": "Significantly altered (stupor, coma, seizures)",
        "Mortality Rate": "10-20% (higher than DKA)",
        "Treatment Priority": "Aggressive IV fluid resuscitation FIRST, then insulin"
      }
    },
    comparisonCategories: ["Type of Diabetes", "Onset", "Blood Glucose", "Ketones", "pH", "Serum Osmolality", "Respirations", "Breath Odor", "Dehydration", "Mental Status", "Mortality Rate", "Treatment Priority"],
    keyDifferences: [
      "DKA has ketones and acidosis; HHS does not (enough insulin to prevent ketosis)",
      "HHS has much higher blood glucose (>33 mmol/L vs >14 mmol/L in DKA)",
      "HHS has more severe dehydration and higher mortality",
      "DKA has Kussmaul respirations and fruity breath; HHS does not",
      "DKA treatment prioritizes insulin; HHS treatment prioritizes fluid resuscitation"
    ],
    clinicalPearls: [
      "In DKA: check potassium BEFORE starting insulin — hypokalemia kills before hyperglycemia",
      "In DKA: do NOT stop insulin when glucose normalizes — continue until anion gap closes",
      "In HHS: the priority is massive fluid resuscitation — patients may be 8-12 L deficit",
      "Both conditions: monitor potassium closely during treatment (insulin drives K+ into cells)",
      "Kussmaul respirations + fruity breath = DKA until proven otherwise"
    ],
    practiceQuestions: [
      { question: "A client presents with blood glucose of 42 mmol/L, serum osmolality of 365 mOsm/kg, no ketones in urine, and pH of 7.38. Which condition is most likely?", options: ["DKA", "HHS", "Hypoglycemia", "Metabolic acidosis"], correctIndex: 1, rationale: "Extremely high glucose (42 mmol/L), very high osmolality (365), absent ketones, and normal pH are hallmarks of HHS. DKA would show ketones and acidosis (pH <7.35).", isFree: true },
      { question: "What is the KEY clinical finding that differentiates DKA from HHS?", options: ["Hyperglycemia", "Dehydration", "Presence of ketones and metabolic acidosis", "Altered mental status"], correctIndex: 2, rationale: "The presence of ketones and metabolic acidosis (Kussmaul respirations, fruity breath, pH <7.35) differentiates DKA from HHS. Both conditions have hyperglycemia, dehydration, and can alter mental status.", isFree: true },
      { question: "The treatment priority for HHS differs from DKA in that HHS prioritizes:", options: ["Insulin administration", "Aggressive IV fluid resuscitation", "Bicarbonate administration", "Potassium replacement"], correctIndex: 1, rationale: "HHS treatment prioritizes aggressive IV fluid resuscitation because dehydration is typically more severe (8-12 L fluid deficit). In DKA, insulin is a higher priority because ketoacidosis needs to be corrected. Both require fluids and insulin, but the emphasis differs.", isFree: true }
    ],
    faqs: [
      { question: "Can DKA and HHS occur simultaneously?", answer: "Yes, some patients can present with features of both DKA and HHS, particularly Type 2 diabetics who develop ketoacidosis. This overlap presentation has high blood glucose, ketones, acidosis, AND severe hyperosmolality. Treatment addresses both components." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Diabetes, DKA & HHS", href: "/rex-pn/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "Insulin Guide", href: "/medications/insulin", type: "medication" },
      { title: "Potassium Lab Values", href: "/rex-pn/lab-values/potassium", type: "lab-value" },
      { title: "ABG Interpretation", href: "/rex-pn/lab-values/abgs", type: "lab-value" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "crohns-vs-uc",
    contentType: "comparison",
    tier: "rex-pn",
    metaTitle: "Crohn's Disease vs Ulcerative Colitis: REx-PN Comparison (2025)",
    metaDescription: "Compare Crohn's disease vs ulcerative colitis for the REx-PN: location, depth, complications, surgery, and practice questions.",
    keywords: "Crohns vs UC, inflammatory bowel disease nursing, Crohn's disease ulcerative colitis comparison, IBD REx-PN",
    h1: "Crohn's Disease vs Ulcerative Colitis",
    introText: "Crohn's disease and ulcerative colitis are the two major forms of inflammatory bowel disease (IBD). While they share some symptoms, their location, depth of inflammation, complications, and surgical management differ significantly. This comparison is commonly tested on the REx-PN.",
    conditionA: {
      name: "Crohn's Disease",
      features: {
        "Location": "Any part of GI tract (mouth to anus), most common in terminal ileum",
        "Distribution": "Skip lesions (patchy, non-continuous)",
        "Depth": "Transmural (full-thickness inflammation)",
        "Rectal Involvement": "Uncommon",
        "Stool Pattern": "Diarrhea (non-bloody, frequent)",
        "Key Complications": "Fistulas, strictures, abscesses, malabsorption",
        "Surgical Cure": "No — surgery is not curative (disease can recur)",
        "Cancer Risk": "Slightly increased (less than UC)",
        "Nutritional Deficiency": "Common (B12, fat-soluble vitamins due to ileal involvement)",
        "Appearance": "Cobblestone mucosa, creeping fat"
      }
    },
    conditionB: {
      name: "Ulcerative Colitis",
      features: {
        "Location": "Colon and rectum ONLY",
        "Distribution": "Continuous inflammation (starts at rectum, extends proximally)",
        "Depth": "Mucosal and submucosal (superficial)",
        "Rectal Involvement": "Always involved",
        "Stool Pattern": "Bloody diarrhea with mucus (hallmark)",
        "Key Complications": "Toxic megacolon, perforation, massive hemorrhage",
        "Surgical Cure": "Yes — total colectomy is curative",
        "Cancer Risk": "Significantly increased (especially with long duration)",
        "Nutritional Deficiency": "Less common (colon does not absorb nutrients significantly)",
        "Appearance": "Pseudopolyps, friable mucosa with ulceration"
      }
    },
    comparisonCategories: ["Location", "Distribution", "Depth", "Rectal Involvement", "Stool Pattern", "Key Complications", "Surgical Cure", "Cancer Risk", "Nutritional Deficiency", "Appearance"],
    keyDifferences: [
      "Crohn's can affect ANY part of GI tract; UC is limited to the colon/rectum",
      "Crohn's is transmural; UC is superficial (mucosal/submucosal only)",
      "Crohn's has skip lesions; UC is continuous from the rectum",
      "UC produces BLOODY diarrhea; Crohn's diarrhea is typically non-bloody",
      "Crohn's causes fistulas and strictures; UC causes toxic megacolon",
      "UC is surgically curable; Crohn's is not"
    ],
    clinicalPearls: [
      "Bloody diarrhea on the REx-PN = think UC first",
      "Fistulas and strictures = think Crohn's disease",
      "Crohn's patients need B12 monitoring (terminal ileum absorption site)",
      "UC patients need colonoscopy surveillance for colorectal cancer",
      "Both conditions are treated with aminosalicylates, corticosteroids, and immunomodulators"
    ],
    practiceQuestions: [
      { question: "A client with IBD reports frequent non-bloody diarrhea, right lower quadrant pain, and a perianal fistula. Which condition is most likely?", options: ["Ulcerative colitis", "Crohn's disease", "Irritable bowel syndrome", "Diverticulitis"], correctIndex: 1, rationale: "Non-bloody diarrhea, RLQ pain (terminal ileum location), and perianal fistula are hallmarks of Crohn's disease. UC would present with bloody diarrhea and does not cause fistulas.", isFree: true },
      { question: "Which surgical option offers a potential cure for ulcerative colitis?", options: ["Partial colectomy", "Total colectomy with ileostomy", "Bowel resection with reanastomosis", "Stricturoplasty"], correctIndex: 1, rationale: "Total colectomy (removal of the entire colon) is curative for ulcerative colitis because the disease is limited to the colon and rectum. Crohn's disease cannot be cured surgically because it can recur in any part of the GI tract.", isFree: true }
    ],
    faqs: [
      { question: "How do you tell Crohn's from UC on the REx-PN?", answer: "Key differentiators: Crohn's = skip lesions, transmural, any GI location, fistulas, NON-bloody diarrhea. UC = continuous from rectum, superficial, colon only, BLOODY diarrhea, toxic megacolon. If the question mentions blood in stool, think UC. If it mentions fistula or terminal ileum, think Crohn's." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Practice Questions", href: "/rex-pn/practice-questions", type: "category" },
      { title: "Fundamentals", href: "/rex-pn/fundamentals", type: "category" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "stable-vs-unstable-angina",
    contentType: "comparison",
    tier: "rex-pn",
    metaTitle: "Stable vs Unstable Angina: REx-PN Comparison Guide (2025)",
    metaDescription: "Compare stable vs unstable angina for the REx-PN: triggers, duration, treatment, when to call 911, and practice questions for Canadian RPN candidates.",
    keywords: "stable angina vs unstable angina, angina comparison nursing, chest pain assessment, ACS nursing REx-PN",
    h1: "Stable Angina vs Unstable Angina",
    introText: "Differentiating stable angina from unstable angina is critical for nursing assessment and a common REx-PN exam topic. Stable angina is predictable and manageable; unstable angina is a medical emergency that signals impending myocardial infarction.",
    conditionA: {
      name: "Stable Angina",
      features: {
        "Pattern": "Predictable — occurs with exertion, emotional stress, or cold exposure",
        "Duration": "Usually <5 minutes, relieved by rest or nitroglycerin",
        "Frequency": "Consistent pattern over months/years",
        "Nitroglycerin Response": "Relieved within 1-3 minutes",
        "ECG Changes": "ST depression during episode (resolves at rest)",
        "Troponin": "Normal (no myocardial damage)",
        "Urgency": "Outpatient management — not a medical emergency",
        "Risk": "Lower risk of acute MI"
      }
    },
    conditionB: {
      name: "Unstable Angina",
      features: {
        "Pattern": "Unpredictable — occurs at rest, increasing frequency, or new onset",
        "Duration": ">15-20 minutes, NOT fully relieved by rest or nitroglycerin",
        "Frequency": "Increasing in frequency, duration, or severity (crescendo pattern)",
        "Nitroglycerin Response": "Partial or no relief",
        "ECG Changes": "ST depression or T-wave inversion (may persist)",
        "Troponin": "Normal or borderline (no frank necrosis)",
        "Urgency": "Medical emergency — part of acute coronary syndrome (ACS)",
        "Risk": "High risk of progression to MI"
      }
    },
    comparisonCategories: ["Pattern", "Duration", "Frequency", "Nitroglycerin Response", "ECG Changes", "Troponin", "Urgency", "Risk"],
    keyDifferences: [
      "Stable = predictable with exertion, relieved by rest/NTG; Unstable = unpredictable, occurs at rest, NOT relieved",
      "Stable angina does not damage heart muscle (normal troponin); Unstable may progress to MI",
      "Unstable angina is a medical emergency; stable angina is managed outpatient",
      "New onset angina is always classified as unstable until proven otherwise"
    ],
    clinicalPearls: [
      "If angina changes pattern (more frequent, more severe, or at rest) = unstable = emergency",
      "Chest pain NOT relieved by 3 doses of NTG (1 q5min) = call 911",
      "Unstable angina + NSTEMI + STEMI = Acute Coronary Syndrome spectrum",
      "Stable angina is managed with lifestyle changes, nitrates, beta-blockers, and antiplatelets"
    ],
    practiceQuestions: [
      { question: "A client reports chest pain that occurs only when climbing stairs and is relieved within 2 minutes of rest. This is consistent with:", options: ["Unstable angina", "Stable angina", "Myocardial infarction", "Pericarditis"], correctIndex: 1, rationale: "Chest pain that is predictable (occurs with exertion like climbing stairs) and relieved by rest within a few minutes is characteristic of stable angina. Unstable angina would occur at rest or show a change in pattern.", isFree: true },
      { question: "A client with a history of stable angina now reports chest pain at rest that is not relieved after 2 doses of sublingual nitroglycerin. What should the nurse do?", options: ["Give a third dose of nitroglycerin and reassess", "Document the finding and schedule a follow-up appointment", "Activate emergency response — this represents unstable angina", "Administer an anxiolytic for anxiety-related chest pain"], correctIndex: 2, rationale: "A change from stable to unstable angina pattern (pain at rest, not relieved by NTG) is a medical emergency. This represents progression along the acute coronary syndrome spectrum and requires immediate evaluation for possible MI.", isFree: true }
    ],
    faqs: [
      { question: "When should a patient call 911 for chest pain?", answer: "Call 911 if chest pain occurs at rest, lasts more than 5 minutes, is not relieved after 3 doses of nitroglycerin (1 every 5 minutes), is more severe than usual, or is accompanied by shortness of breath, diaphoresis, or radiation to the arm/jaw. Any change in the usual pattern of angina is a red flag." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "MI / ACS", href: "/rex-pn/conditions/mi-acs", type: "condition" },
      { title: "Hypertension", href: "/rex-pn/conditions/hypertension", type: "condition" },
      { title: "Heart Failure", href: "/rex-pn/conditions/heart-failure", type: "condition" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  }
];

export const rexPnStrategies: RexPnStrategyPage[] = [
  {
    slug: "how-to-pass-rex-pn",
    contentType: "strategy",
    tier: "rex-pn",
    metaTitle: "How to Pass the REx-PN: Complete Strategy Guide (2025)",
    metaDescription: "Evidence-based strategies for passing the REx-PN exam: study planning, content mastery, test-taking techniques, CAT strategies, and exam day preparation.",
    keywords: "how to pass REx-PN, REx-PN pass rate, RPN exam preparation strategy, REx-PN study tips, Canadian nursing exam success",
    h1: "How to Pass the REx-PN: A Complete Strategy Guide",
    introText: "Passing the REx-PN requires a combination of content knowledge, clinical reasoning skills, and effective test-taking strategies. This guide provides evidence-based recommendations from nursing educators and successful candidates to help you prepare systematically and pass with confidence.",
    sections: [
      { heading: "Understand the Exam Structure", content: "The REx-PN uses Computer Adaptive Testing (CAT) with 85-150 questions over a maximum of 5 hours. Questions test application and analysis-level thinking, not rote memorization. Understanding the blueprint is essential: Physiological Integrity (38-44%), Safe and Effective Care Environment (26-32%), Health Promotion and Maintenance (6-12%), and Psychosocial Integrity (6-12%). Allocate study time proportionally.", tips: ["Study Physiological Integrity first — it is the largest domain", "Understand how CAT works to reduce test-day anxiety", "Harder questions may indicate you are performing well"] },
      { heading: "Build a Structured Study Plan", content: "Successful candidates study consistently for 8-12 weeks, 2-3 hours daily. Phase your preparation: content review (weeks 1-4), clinical application and practice questions (weeks 5-7), and exam readiness and mock exams (weeks 8-10). Use active learning strategies like practice questions, flashcards, and clinical scenarios rather than passive reading.", tips: ["Set daily and weekly goals with specific content targets", "Take one rest day per week to prevent burnout", "Track your progress and adjust your plan based on practice exam results"] },
      { heading: "Master Clinical Reasoning", content: "The REx-PN primarily tests clinical judgment, not factual recall. Learn the NCSBN Clinical Judgment Measurement Model: Recognize Cues → Analyze Cues → Prioritize Hypotheses → Generate Solutions → Take Action → Evaluate Outcomes. Practice applying this framework to every practice question.", tips: ["For every question, identify what clinical reasoning step is being tested", "Use prioritization frameworks: ABCs, Maslow's, Acute vs Chronic", "Read rationales for ALL questions — correct and incorrect"] },
      { heading: "Practice Questions: The Key to Success", content: "Research consistently shows that active recall through practice questions is the most effective study strategy. Complete 1,500-2,500 questions during your preparation. Focus on quality over quantity — read every rationale and understand why each option is correct or incorrect.", tips: ["Start with 50 questions/day, increase to 100+ in final weeks", "Track your performance by content domain to identify weak areas", "Take full-length CAT practice exams to build stamina and simulate exam conditions"] },
      { heading: "Exam Day Strategies", content: "Get 7-8 hours of sleep. Eat a balanced breakfast. Arrive 30 minutes early with proper identification. Use the tutorial time to get comfortable with the interface. Read each question carefully — you cannot go back. Use process of elimination. If unsure, choose the safest, most therapeutic, least restrictive option. Take the optional break after 2 hours.", tips: ["Do not read into question difficulty — harder questions may mean you are doing well", "Trust your preparation and your first instinct", "Stay calm — anxiety impairs clinical reasoning"] }
    ],
    practiceQuestions: [
      { question: "A candidate has studied for 10 weeks using passive reading of textbooks without practice questions. On practice exams, they consistently score 55%. What should they change?", options: ["Study for 4 more weeks with the same approach", "Switch to active learning with daily practice questions and rationale review", "Focus only on pharmacology since it is the hardest topic", "Take the exam immediately since more studying will not help"], correctIndex: 1, rationale: "Active learning through practice questions with rationale review is significantly more effective than passive reading. Research shows that testing yourself on material produces superior retention and clinical reasoning development. The student needs to change their study method, not just study longer.", isFree: true }
    ],
    faqs: [
      { question: "What is the REx-PN pass rate?", answer: "The REx-PN pass rate varies by jurisdiction and year but generally ranges from 70-85% for first-time Canadian-educated candidates. Candidates who prepare systematically with practice questions and structured study plans have significantly higher pass rates." },
      { question: "How many times can I retake the REx-PN?", answer: "A mandatory 45-day waiting period is required between attempts. Maximum attempt limits vary by province/territory. Most jurisdictions allow multiple retakes, but some may require additional education or remediation after several unsuccessful attempts. Contact your regulatory body for specific policies." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Study Plan", href: "/rex-pn/study-plan", type: "category" },
      { title: "Practice Questions", href: "/rex-pn/practice-questions", type: "category" },
      { title: "Clinical Judgment", href: "/rex-pn/clinical-judgment", type: "category" },
      { title: "Exam Tips", href: "/rex-pn/exam-tips", type: "category" },
      { title: "Mock Exams", href: "/mock-exams", type: "question-bank" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "pharmacology-fundamentals",
    contentType: "strategy",
    tier: "rex-pn",
    metaTitle: "REx-PN Pharmacology Fundamentals: Drug Study Strategy (2025)",
    metaDescription: "Learn the most efficient way to study pharmacology for the REx-PN: drug classification stems, mechanism-based learning, high-yield medications, and dosage calculations.",
    keywords: "pharmacology study strategy, REx-PN drug study, nursing pharmacology tips, medication classification stems, dosage calculations",
    h1: "Pharmacology Fundamentals: How to Study Medications for the REx-PN",
    introText: "Pharmacology is one of the most challenging domains for REx-PN candidates. This guide teaches you an efficient, systematic approach to learning medications using drug classification stems, mechanism-based understanding, and clinical application rather than rote memorization.",
    sections: [
      { heading: "Learn by Drug Class, Not Individual Drugs", content: "Instead of memorizing hundreds of individual medications, focus on drug classifications and their shared characteristics. All drugs within a class share a mechanism of action, general side effects, and nursing considerations. Once you understand ACE inhibitors (-pril), you can apply that knowledge to lisinopril, enalapril, ramipril, and any other -pril drug.", tips: ["Beta-blockers end in -olol (metoprolol, atenolol, propranolol)", "ACE inhibitors end in -pril (lisinopril, enalapril, captopril)", "ARBs end in -sartan (losartan, valsartan, irbesartan)", "Calcium channel blockers: -dipine = dihydropyridines (amlodipine, nifedipine)"] },
      { heading: "Focus on High-Alert Medications", content: "High-alert medications cause significant harm if used in error. These are the most heavily tested medications on the REx-PN: insulin (all types), heparin/warfarin, opioids (morphine, fentanyl), digoxin, potassium chloride IV, chemotherapy agents, and neuromuscular blocking agents. Know their mechanisms, side effects, monitoring parameters, and antidotes.", tips: ["Insulin: only regular can be given IV", "Warfarin: monitor INR (target 2-3), antidote = vitamin K", "Heparin: monitor aPTT, antidote = protamine sulfate", "Digoxin: check apical pulse, hold if HR <60, therapeutic level 0.5-2.0 ng/mL"] },
      { heading: "Master Dosage Calculations", content: "The REx-PN includes fill-in-the-blank calculation questions. Master the Desired/Have × Quantity formula. Practice IV flow rate calculations: mL/hr = Volume ÷ Time, and gtt/min = Volume × Drop factor ÷ Time (minutes). Always double-check your decimal placement and units.", tips: ["Always convert to the same units before calculating", "For weight-based dosing: mg/kg × client weight (kg) = total dose", "Practice mental math with common conversions: 1 g = 1000 mg, 1 L = 1000 mL", "On the exam, use the on-screen calculator and verify your answer"] }
    ],
    practiceQuestions: [
      { question: "A nurse needs to administer 250 mg of a medication. The medication is available as 500 mg/5 mL. How many mL should the nurse give?", options: ["1.25 mL", "2.5 mL", "5 mL", "10 mL"], correctIndex: 1, rationale: "Using Desired/Have × Quantity: 250 mg ÷ 500 mg × 5 mL = 2.5 mL. Always set up the calculation systematically and check that units cancel properly.", isFree: true },
      { question: "A client is prescribed a medication ending in '-olol.' The nurse recognizes this drug class as:", options: ["ACE inhibitor", "Beta-blocker", "Calcium channel blocker", "ARB"], correctIndex: 1, rationale: "The -olol stem identifies beta-blockers (metoprolol, atenolol, propranolol, carvedilol). Knowing drug stems allows you to identify the class and anticipate side effects (bradycardia, fatigue, bronchospasm) and nursing considerations (check HR before administration).", isFree: true }
    ],
    faqs: [
      { question: "How many medications do I need to know for the REx-PN?", answer: "Focus on approximately 50-75 core medications across the major drug classifications. You do not need to memorize every drug in the Canadian formulary. Understanding drug CLASS characteristics allows you to answer questions about medications you have never specifically studied." }
    ],
    internalLinks: [
      { title: "REx-PN Exam Prep Hub", href: "/rex-pn", type: "hub" },
      { title: "Pharmacology Review", href: "/rex-pn/pharmacology", type: "category" },
      { title: "Insulin Guide", href: "/medications/insulin", type: "medication" },
      { title: "Furosemide Guide", href: "/rex-pn/medications/furosemide", type: "medication" },
      { title: "Metformin Guide", href: "/medications/metformin", type: "medication" },
      { title: "Lisinopril Guide", href: "/medications/lisinopril", type: "medication" }
    ],
    lastReviewed: "2025-03-01",
    reviewer: "NurseNest Clinical Review Team"
  }
];

export function getRexPnCategoryBySlug(slug: string): RexPnCategoryPage | undefined {
  return rexPnCategories.find(c => c.slug === slug);
}

export function getRexPnConditionBySlug(slug: string): RexPnConditionPage | undefined {
  return rexPnConditions.find(c => c.slug === slug);
}

export function getRexPnMedicationBySlug(slug: string): RexPnMedicationPage | undefined {
  return rexPnMedications.find(m => m.slug === slug);
}

export function getRexPnLabValueBySlug(slug: string): RexPnLabValuePage | undefined {
  return rexPnLabValues.find(l => l.slug === slug);
}

export function getRexPnComparisonBySlug(slug: string): RexPnComparisonPage | undefined {
  return rexPnComparisons.find(c => c.slug === slug);
}

export function getRexPnStrategyBySlug(slug: string): RexPnStrategyPage | undefined {
  return rexPnStrategies.find(s => s.slug === slug);
}

export function getAllRexPnSlugs(): { categories: string[]; conditions: string[]; medications: string[]; labValues: string[]; comparisons: string[]; strategies: string[] } {
  return {
    categories: rexPnCategories.map(c => c.slug),
    conditions: rexPnConditions.map(c => c.slug),
    medications: rexPnMedications.map(m => m.slug),
    labValues: rexPnLabValues.map(l => l.slug),
    comparisons: rexPnComparisons.map(c => c.slug),
    strategies: rexPnStrategies.map(s => s.slug),
  };
}
