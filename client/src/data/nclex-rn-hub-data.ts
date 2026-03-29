export type NclexRnContentType = "category" | "condition" | "medication" | "lab-value" | "comparison" | "strategy";

export interface NclexRnPracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  isFree: boolean;
}

export interface NclexRnInternalLink {
  title: string;
  href: string;
  type: NclexRnContentType | "hub" | "question-bank";
}

export interface NclexRnFAQ {
  question: string;
  answer: string;
}

export interface NclexRnCategoryPage {
  slug: string;
  contentType: "category";
  tier: "nclex-rn";
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  introText: string;
  sections: { heading: string; content: string }[];
  practiceQuestions: NclexRnPracticeQuestion[];
  faqs: NclexRnFAQ[];
  internalLinks: NclexRnInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export interface NclexRnConditionPage {
  slug: string;
  contentType: "condition";
  tier: "nclex-rn";
  name: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  definition: string;
  pathophysiology: string;
  causesRiskFactors: string[];
  signsSymptoms: { early: string[]; late: string[] };
  assessmentFindings: string[];
  labs: { name: string; normalRange: string; significance: string }[];
  medications: { name: string; drugClass: string; action: string; sideEffects: string; nursingConsiderations: string }[];
  nursingInterventions: string[];
  complications: string[];
  patientTeaching: string[];
  examPearls: string[];
  commonTrapAnswers: string[];
  practiceQuestions: NclexRnPracticeQuestion[];
  faqs: NclexRnFAQ[];
  internalLinks: NclexRnInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export interface NclexRnMedicationPage {
  slug: string;
  contentType: "medication";
  tier: "nclex-rn";
  genericName: string;
  brandNames: string[];
  drugClass: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  mechanism: string;
  indications: string[];
  sideEffects: { effect: string; severity: string; detail: string }[];
  adverseEffects: string[];
  contraindications: string[];
  nursingConsiderations: string[];
  monitoring: string[];
  patientTeaching: string[];
  examTips: string[];
  practiceQuestions: NclexRnPracticeQuestion[];
  faqs: NclexRnFAQ[];
  internalLinks: NclexRnInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export interface NclexRnLabValuePage {
  slug: string;
  contentType: "lab-value";
  tier: "nclex-rn";
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
  interpretation: string;
  associatedConditions: string[];
  nursingImplications: string[];
  examAlerts: string[];
  practiceQuestions: NclexRnPracticeQuestion[];
  faqs: NclexRnFAQ[];
  internalLinks: NclexRnInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export interface NclexRnComparisonPage {
  slug: string;
  contentType: "comparison";
  tier: "nclex-rn";
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
  practiceQuestions: NclexRnPracticeQuestion[];
  faqs: NclexRnFAQ[];
  internalLinks: NclexRnInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export interface NclexRnStrategyPage {
  slug: string;
  contentType: "strategy";
  tier: "nclex-rn";
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  introText: string;
  sections: { heading: string; content: string; tips?: string[] }[];
  practiceQuestions: NclexRnPracticeQuestion[];
  faqs: NclexRnFAQ[];
  internalLinks: NclexRnInternalLink[];
  references?: string[];
  lastReviewed: string;
  reviewer: string;
}

export type NclexRnPage = NclexRnCategoryPage | NclexRnConditionPage | NclexRnMedicationPage | NclexRnLabValuePage | NclexRnComparisonPage | NclexRnStrategyPage;

export const nclexRnCategories: NclexRnCategoryPage[] = [
  {
    slug: "practice-questions",
    contentType: "category",
    tier: "nclex-rn",
    title: "NCLEX-RN Practice Questions",
    metaTitle: "NCLEX-RN Practice Questions: Free NGN & Clinical Judgment Questions (2025)",
    metaDescription: "Practice with free NCLEX-RN exam questions including Next Generation NCLEX formats. CAT-style questions with clinical judgment rationales for RN candidates.",
    keywords: "NCLEX-RN practice questions, NGN practice questions, NCLEX-RN free questions, RN exam practice, clinical judgment questions",
    h1: "NCLEX-RN Practice Questions",
    introText: "Sharpen your clinical judgment with NCLEX-RN practice questions designed to replicate the rigor and complexity of the actual exam. Each question emphasizes higher-order thinking — prioritization, delegation, and clinical reasoning — with detailed rationales explaining why each option is correct or incorrect.",
    sections: [
      { heading: "Why Clinical Judgment Questions Matter", content: "The NCLEX-RN tests your ability to apply the Clinical Judgment Measurement Model (CJMM): Recognize Cues → Analyze Cues → Prioritize Hypotheses → Generate Solutions → Take Action → Evaluate Outcomes. Unlike simple knowledge recall, these questions require you to synthesize assessment data, identify the most likely problem, and determine the priority nursing action. Practicing with clinical judgment questions builds the cognitive framework needed for safe, competent entry-level RN practice." },
      { heading: "Next Generation NCLEX (NGN) Question Formats", content: "Since April 2023, the NCLEX-RN includes NGN item types: Extended Multiple Response, Extended Drag and Drop, Cloze (Drop-Down), Enhanced Hot Spot, Matrix/Grid, Trend Items, Bowtie Items, and Unfolding Case Studies with 6 linked questions. NGN items use polytomous scoring (partial credit), meaning partially correct responses earn partial credit rather than zero. Our practice questions include both traditional and NGN-style formats to ensure comprehensive preparation." },
      { heading: "How to Use NCLEX-RN Practice Questions Effectively", content: "Complete 2,000-3,000 practice questions during your study period. For each question, read the rationale for ALL options — understanding why incorrect answers are wrong is as valuable as knowing the correct answer. Track your performance by Client Needs category and focus additional study time on your weakest areas. In the final 2 weeks, take full-length CAT practice exams to build stamina and simulate the test experience." }
    ],
    practiceQuestions: [
      { question: "A nurse is caring for four clients. Which client should the nurse assess first?", options: ["A client with COPD and SpO2 of 89% on 2L nasal cannula", "A client post-hip replacement reporting pain of 6/10", "A client with heart failure who gained 3 pounds overnight", "A client with diabetes scheduled for a fasting blood glucose"], correctIndex: 0, rationale: "Prioritize by ABCs and acuity. The COPD client with SpO2 of 89% despite supplemental oxygen indicates respiratory compromise and potential deterioration. This requires immediate assessment. The heart failure client with weight gain is concerning but not immediately life-threatening. Pain management and routine labs can wait.", isFree: true },
      { question: "The charge nurse is making assignments. Which task is appropriate to delegate to unlicensed assistive personnel (UAP)?", options: ["Assess a newly admitted client's lung sounds", "Administer oral medications to a stable client", "Obtain vital signs on a post-operative client", "Educate a client about a new diabetes diagnosis"], correctIndex: 2, rationale: "Obtaining vital signs on a stable post-operative client is within the UAP scope. Assessment (lung sounds), medication administration, and patient education require the knowledge and judgment of a licensed nurse and cannot be delegated to UAP. The 5 Rights of Delegation: Right Task, Right Circumstance, Right Person, Right Direction, Right Supervision.", isFree: true },
      { question: "A client receiving IV vancomycin reports facial flushing, neck redness, and itching. Vital signs: BP 90/58, HR 110. What is the nurse's priority action?", options: ["Document the findings and continue the infusion", "Stop the infusion and notify the provider", "Administer diphenhydramine as needed", "Slow the infusion rate by 50%"], correctIndex: 1, rationale: "These symptoms indicate Red Man Syndrome (vancomycin flushing syndrome) with hypotension, which is a serious adverse reaction. The priority is to stop the infusion immediately and notify the provider. Diphenhydramine may be ordered, but the infusion must be stopped first. Simply slowing the rate is insufficient when the client is hemodynamically unstable.", isFree: true },
      { question: "A nurse is reviewing labs for a client on heparin therapy. The aPTT is 120 seconds (therapeutic range 60-80 seconds). What should the nurse do first?", options: ["Continue the heparin drip at the current rate", "Increase the heparin drip rate per protocol", "Stop the heparin drip and notify the provider", "Administer protamine sulfate IV push"], correctIndex: 2, rationale: "An aPTT of 120 seconds is significantly supratherapeutic, placing the client at high risk for hemorrhage. The nurse should stop the heparin drip and notify the provider. Protamine sulfate is the antidote for heparin, but its administration requires a provider order. The provider will determine whether to hold heparin, adjust the dose, or administer the antidote based on the clinical picture.", isFree: true },
      { question: "A nurse is preparing to insert a peripheral IV catheter. Which action demonstrates proper infection control?", options: ["Apply clean gloves before palpating the vein", "Cleanse the site with alcohol and allow it to dry", "Apply a tourniquet directly over the insertion site", "Document the procedure before performing hand hygiene"], correctIndex: 1, rationale: "Proper infection control for peripheral IV insertion includes cleansing the site with an appropriate antiseptic (alcohol, chlorhexidine) and allowing it to dry completely before insertion. This reduces the microbial load at the insertion site and prevents introducing organisms into the vascular system. Hand hygiene should occur before the procedure, and documentation follows completion.", isFree: true }
    ],
    faqs: [
      { question: "How many practice questions should I complete before the NCLEX-RN?", answer: "Most successful candidates complete 2,000-3,000 practice questions during their preparation period. Focus on quality over quantity: always read rationales for both correct and incorrect answers, track performance by Client Needs category, and dedicate extra time to weak areas." },
      { question: "Are NGN questions harder than traditional NCLEX-RN questions?", answer: "NGN questions test the same content at the same cognitive level but use different item formats. They assess the full clinical judgment process and offer partial credit scoring. Many candidates find NGN items more intuitive because they mirror real clinical decision-making rather than selecting a single best answer." },
      { question: "Should I focus on content review or practice questions?", answer: "Use the 60/30/10 rule: spend 60% of study time on practice questions with rationale review, 30% on targeted content review of weak areas, and 10% on test-taking strategies and self-care. Practice questions teach both content and critical thinking simultaneously." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "NGN Complete Guide", href: "/nclex-rn/ngn", type: "category" },
      { title: "Prioritization & Delegation", href: "/nclex-rn/prioritization-and-delegation", type: "category" },
      { title: "Pharmacology Review", href: "/nclex-rn/pharmacology", type: "category" },
      { title: "Exam Strategy", href: "/nclex-rn/exam-strategy", type: "category" },
      { title: "Mock Exams", href: "/mock-exams", type: "question-bank" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "ngn",
    contentType: "category",
    tier: "nclex-rn",
    title: "Next Generation NCLEX (NGN)",
    metaTitle: "Next Generation NCLEX (NGN): Question Types, CJMM & Preparation Guide (2025)",
    metaDescription: "Master Next Generation NCLEX question types, the Clinical Judgment Measurement Model, unfolding case studies, and polytomous scoring for NCLEX-RN success.",
    keywords: "Next Generation NCLEX, NGN question types, CJMM clinical judgment, unfolding case studies, NGN preparation, NCLEX-RN NGN",
    h1: "Next Generation NCLEX (NGN) Complete Guide",
    introText: "The Next Generation NCLEX represents the most significant evolution of the NCLEX since computerized adaptive testing. NGN items measure clinical judgment through innovative question formats that mirror real-world clinical decision-making. This guide covers every NGN item type, the Clinical Judgment Measurement Model, and proven strategies to master these new formats.",
    sections: [
      { heading: "The Clinical Judgment Measurement Model (CJMM)", content: "Every NGN item maps to the CJMM, NCSBN's theoretical framework for clinical decision-making. Layer 3 consists of 6 testable cognitive skills: (1) Recognize Cues — identify relevant clinical data from the noise; (2) Analyze Cues — interpret what the data means clinically; (3) Prioritize Hypotheses — rank possible conditions by urgency and likelihood; (4) Generate Solutions — identify appropriate interventions; (5) Take Action — implement priority interventions; (6) Evaluate Outcomes — determine if interventions were effective and what to do next. Understanding which skill is being tested helps you approach each question systematically." },
      { heading: "Unfolding Case Studies", content: "Unfolding case studies are the signature NGN format. Each case presents a patient evolving through a clinical scenario across 6 linked questions mapping to the CJMM. New information is revealed at each phase — vital sign trends, lab changes, treatment responses. The key is to identify what has CHANGED rather than what stayed the same. Read the entire clinical picture before answering, integrate data across phases, and adapt your clinical reasoning as the situation evolves." },
      { heading: "NGN Item Types & Scoring", content: "NGN uses polytomous scoring (partial credit). Extended Multiple Response may specify exact selections (e.g., 'Select 3'). Extended Drag and Drop requires categorizing or sequencing items. Cloze (Drop-Down) items embed dropdown menus in clinical documentation. Matrix/Grid items require selections across multiple rows and columns. Trend Items present time-series data requiring pattern recognition. Bowtie Items map risk factors → condition → interventions. Each format rewards systematic clinical thinking rather than guessing." },
      { heading: "How to Prepare for NGN", content: "Practice with all NGN formats regularly. For case studies, practice with unfolding patient scenarios that progress over time. For trend items, practice interpreting vital sign and lab value trends. For bowtie items, practice connecting pathophysiology to risk factors and interventions. For matrix items, practice making multiple clinical decisions simultaneously. The CJMM framework provides the underlying approach — learn to recognize which cognitive skill each question tests." }
    ],
    practiceQuestions: [
      { question: "A nurse reviewing a patient's chart identifies the following: temperature 38.9°C, heart rate 112, blood pressure 88/54, WBC 18,500, lactate 4.2 mmol/L. Using the CJMM, which cognitive skill is being applied when the nurse identifies these findings as relevant?", options: ["Analyze Cues", "Recognize Cues", "Prioritize Hypotheses", "Generate Solutions"], correctIndex: 1, rationale: "Recognizing Cues is the first step in the CJMM — identifying which assessment data is clinically relevant. The nurse is identifying abnormal findings (fever, tachycardia, hypotension, elevated WBC, elevated lactate) as significant. Analyzing Cues comes next (connecting these to possible sepsis). Prioritizing Hypotheses would rank sepsis as the most likely/urgent condition.", isFree: true },
      { question: "In an unfolding case study, a patient's condition worsens from Phase 1 to Phase 2. Blood pressure drops from 130/82 to 92/56, and urine output decreases to 15 mL/hr. What should the nurse prioritize?", options: ["Continue monitoring and reassess in 1 hour", "Notify the rapid response team immediately", "Administer an oral antihypertensive", "Encourage increased oral fluid intake"], correctIndex: 1, rationale: "The significant drop in blood pressure combined with oliguria (<30 mL/hr) indicates hemodynamic instability and possible shock. This is a clinical deterioration requiring immediate escalation. The rapid response team can provide advanced assessment and intervention. Monitoring alone delays critical intervention, antihypertensives would worsen hypotension, and oral fluids are insufficient for hemodynamic instability.", isFree: true },
      { question: "An NGN matrix item asks the nurse to evaluate which assessment findings are 'expected' vs 'unexpected' for a post-operative Day 1 knee replacement client. Which finding is unexpected?", options: ["Moderate surgical site pain (5/10)", "Temperature 37.2°C", "Positive Homans sign with calf tenderness", "Mild swelling at the operative site"], correctIndex: 2, rationale: "A positive Homans sign (calf pain on dorsiflexion) with calf tenderness is unexpected and suggests deep vein thrombosis (DVT), a serious post-operative complication. Post-operative Day 1 moderate pain, low-grade temperature, and mild swelling are expected findings. DVT requires immediate assessment and intervention.", isFree: true }
    ],
    faqs: [
      { question: "What percentage of the NCLEX-RN is NGN items?", answer: "Approximately 20-25% of scored items use NGN formats. Every candidate receives 3 unfolding case studies (18 case study items total) plus standalone NGN items. The remaining items are traditional formats (multiple-choice, SATA, fill-in-the-blank, ordered response, hot spot)." },
      { question: "Can I get partial credit on NGN items?", answer: "Yes. NGN items use polytomous scoring. If a matrix item has 8 correct selections and you identify 6, you earn partial credit proportional to your correct selections. Completely wrong answers still earn zero. This scoring model is fairer and provides more precise measurement of ability." },
      { question: "Are NGN items weighted more heavily?", answer: "NGN items are weighted similarly to traditional items in the CAT algorithm. Getting NGN items wrong does not disproportionately hurt you. They provide additional information about your clinical judgment ability and feed into the same pass/fail decision as all other items." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Practice Questions", href: "/nclex-rn/practice-questions", type: "category" },
      { title: "Exam Strategy", href: "/nclex-rn/exam-strategy", type: "category" },
      { title: "Prioritization & Delegation", href: "/nclex-rn/prioritization-and-delegation", type: "category" },
      { title: "NCLEX-RN Guide", href: "/nclex-rn-guide", type: "hub" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "prioritization-and-delegation",
    contentType: "category",
    tier: "nclex-rn",
    title: "Prioritization & Delegation",
    metaTitle: "NCLEX-RN Prioritization & Delegation: ABCs, Maslow's & 5 Rights (2025)",
    metaDescription: "Master prioritization and delegation for the NCLEX-RN. Learn ABCs, Maslow's hierarchy, acute vs chronic, and the 5 Rights of Delegation with practice questions.",
    keywords: "NCLEX-RN prioritization, nursing delegation, 5 Rights of Delegation, ABCs nursing, Maslow priority, NCLEX-RN delegation questions",
    h1: "Prioritization & Delegation for the NCLEX-RN",
    introText: "Prioritization and delegation account for a significant portion of NCLEX-RN questions, particularly within the Management of Care subcategory (17-23% of the exam). These questions test your ability to determine which client to assess first, which interventions take priority, and which tasks can be safely delegated to LPNs and UAPs.",
    sections: [
      { heading: "Prioritization Frameworks", content: "Use these frameworks in order of application: (1) ABCs — Airway always comes first, then Breathing, then Circulation. A clear airway is always the priority unless the client is in cardiac arrest. (2) Maslow's Hierarchy — Physiological needs (oxygenation, circulation, nutrition) before safety, then psychosocial needs. (3) Acute vs. Chronic — New-onset or acute changes take priority over stable chronic conditions. (4) Actual vs. Potential — Actual problems take priority over risk-for problems. (5) Unstable vs. Stable — Unstable clients require assessment before stable clients." },
      { heading: "The 5 Rights of Delegation", content: "Right Task — Is the task within the delegatee's scope of practice? Stable, routine, non-complex tasks can be delegated. Right Circumstance — Is the client stable enough for the task to be performed by this person? Right Person — Does the delegatee have the competency and training? Right Direction — Did you provide clear, specific, measurable instructions? Right Supervision — Will you provide appropriate monitoring and follow-up? Never delegate: initial assessment, care planning, evaluation of outcomes, patient education, or tasks requiring nursing judgment." },
      { heading: "Delegation to LPNs vs. UAPs", content: "LPNs can perform: medication administration (oral, subcutaneous, IM — varies by state), wound care, catheter insertion, tracheostomy suctioning, VS monitoring on stable clients, and data collection. LPNs cannot: perform initial assessments, create care plans, administer IV push medications, or give blood. UAPs can perform: vital signs, I&O, ambulation, hygiene, repositioning, feeding, and routine specimen collection. UAPs cannot: assess, administer medications, perform sterile procedures, or provide patient education." },
      { heading: "Common NCLEX-RN Prioritization Traps", content: "Trap 1: Choosing to 'notify the provider' when the nurse should take action first. Trap 2: Selecting reassessment when immediate intervention is needed. Trap 3: Choosing a psychosocial intervention when a physiological need exists. Trap 4: Delegating assessment or evaluation tasks. Trap 5: Prioritizing a stable chronic condition over an acute change. Always ask: What is the most immediate threat to life? What can only an RN do?" }
    ],
    practiceQuestions: [
      { question: "The nurse has four clients. Which should be assessed first?", options: ["A client with pneumonia and SpO2 94% on room air", "A client post-cardiac catheterization with a hematoma at the groin site", "A client with heart failure reporting new-onset dyspnea at rest", "A client 2 days post-appendectomy with a temperature of 37.8°C"], correctIndex: 2, rationale: "New-onset dyspnea at rest in a heart failure client indicates acute decompensation — a potentially life-threatening change in status (ABCs: Breathing). The groin hematoma is concerning but stable for monitoring. SpO2 of 94% on room air for a pneumonia client is expected. A low-grade temperature 2 days post-op is common and non-emergent.", isFree: true },
      { question: "Which task should the nurse delegate to the UAP?", options: ["Assess a diabetic client's foot wound", "Obtain a stool specimen for occult blood testing", "Administer a scheduled oral antihypertensive", "Provide discharge teaching about warfarin therapy"], correctIndex: 1, rationale: "Collecting a stool specimen for occult blood testing is a routine, non-invasive task within the UAP scope. Assessment (foot wound), medication administration (antihypertensive), and patient education (warfarin teaching) all require the clinical judgment of a licensed nurse.", isFree: true },
      { question: "A nurse delegates vital signs to a UAP for a stable post-operative client. The UAP reports: BP 82/50, HR 118, RR 24. What is the nurse's priority action?", options: ["Thank the UAP and document the findings", "Ask the UAP to recheck the vital signs in 15 minutes", "Immediately assess the client", "Delegate a fluid intake increase to the UAP"], correctIndex: 2, rationale: "These vital signs indicate possible hypovolemic shock (hypotension, tachycardia, tachypnea) in a post-operative client. The RN must immediately assess the client — this is the 'Right Supervision' aspect of delegation. Assessment cannot be delegated, and the clinical picture warrants urgent evaluation for hemorrhage or other post-operative complications.", isFree: true }
    ],
    faqs: [
      { question: "How much of the NCLEX-RN is prioritization and delegation?", answer: "Management of Care, which heavily features prioritization and delegation, accounts for 17-23% of the NCLEX-RN — the single largest subcategory. Combined with prioritization elements in other categories, up to 30-40% of questions may test your ability to prioritize or delegate." },
      { question: "Can LPNs give IV medications?", answer: "Generally, LPNs cannot administer IV push medications. Some states allow LPNs to monitor IV infusions and add medications to existing IV lines after special training, but this varies significantly by jurisdiction. On the NCLEX-RN, assume LPNs cannot give IV push medications unless the question specifies otherwise." },
      { question: "What is the difference between delegation and assignment?", answer: "Delegation transfers a specific task to someone not originally responsible for it (e.g., RN delegates vital signs to UAP). Assignment refers to the distribution of work that falls within each team member's scope of practice (e.g., charge nurse assigns a client to an RN). Both require consideration of competency, client stability, and appropriate supervision." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Practice Questions", href: "/nclex-rn/practice-questions", type: "category" },
      { title: "Exam Strategy", href: "/nclex-rn/exam-strategy", type: "category" },
      { title: "Adult Health", href: "/nclex-rn/adult-health", type: "category" },
      { title: "Mock Exams", href: "/mock-exams", type: "question-bank" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "pharmacology",
    contentType: "category",
    tier: "nclex-rn",
    title: "NCLEX-RN Pharmacology",
    metaTitle: "NCLEX-RN Pharmacology Review: High-Yield Medications & Drug Classes (2025)",
    metaDescription: "Comprehensive NCLEX-RN pharmacology review covering high-alert medications, drug classifications, adverse effects, nursing considerations, and practice questions.",
    keywords: "NCLEX-RN pharmacology, nursing pharmacology review, high-alert medications NCLEX, drug classifications nursing, pharmacology practice questions",
    h1: "NCLEX-RN Pharmacology Review",
    introText: "Pharmacological and Parenteral Therapies account for 13-19% of the NCLEX-RN — the most heavily weighted subcategory within Physiological Integrity. At the RN level, you are expected to understand not just medication administration but also pharmacokinetics, adverse effects, drug interactions, and the clinical reasoning behind medication selection.",
    sections: [
      { heading: "High-Alert Medications", content: "High-alert medications cause significant patient harm when used in error. These are the most frequently tested medications: Insulin (all types — know onset, peak, duration; only regular IV), Heparin (aPTT monitoring, antidote: protamine sulfate), Warfarin (INR monitoring, antidote: vitamin K/phytonadione), Digoxin (check apical pulse x1 min, hold if <60, therapeutic level 0.5-2.0 ng/mL), Potassium chloride IV (never IV push, always diluted), Opioids (respiratory depression, naloxone reversal), and Chemotherapy agents (safe handling, nadir monitoring). Know mechanism, monitoring parameters, adverse effects, and antidotes for each." },
      { heading: "Drug Classification Stems", content: "Mastering drug stems allows you to identify drug classes for medications you have never studied: -olol = beta-blockers (metoprolol, atenolol), -pril = ACE inhibitors (lisinopril, enalapril), -sartan = ARBs (losartan, valsartan), -dipine = calcium channel blockers (amlodipine, nifedipine), -statin = HMG-CoA reductase inhibitors (atorvastatin), -pam/-lam = benzodiazepines (lorazepam, diazepam), -mycin/-micin = aminoglycosides (gentamicin), -floxacin = fluoroquinolones (ciprofloxacin), -prazole = proton pump inhibitors (omeprazole)." },
      { heading: "IV Medication Safety", content: "At the RN scope, you are responsible for IV push medication administration, IV titration, and blood product administration — tasks not delegated to LPNs or UAPs. Key principles: always verify the 6 Rights (patient, drug, dose, route, time, documentation), perform independent double-checks for high-alert IV medications, know IV compatibility before administering, and monitor for infusion reactions. For blood products: verify with two nurses, use a blood administration set (170-micron filter), monitor vital signs per protocol, and stop immediately for signs of transfusion reaction." }
    ],
    practiceQuestions: [
      { question: "A nurse is administering IV potassium chloride. Which action is most important?", options: ["Administer by IV push for rapid correction", "Verify the infusion rate does not exceed 10 mEq/hr", "Mix the medication with dextrose 5% in water only", "Administer in the antecubital vein for best absorption"], correctIndex: 1, rationale: "IV potassium chloride must NEVER be given by IV push — it can cause fatal cardiac arrest. The maximum infusion rate is typically 10 mEq/hr (up to 20 mEq/hr with cardiac monitoring in critical care). Always administer via infusion pump, never by gravity. The nurse must verify the rate and concentration before administration.", isFree: true },
      { question: "A patient on digoxin has a serum level of 2.4 ng/mL. What symptom should the nurse assess for?", options: ["Hypertension and flushing", "Visual disturbances and bradycardia", "Tachycardia and chest pain", "Hyperglycemia and polyuria"], correctIndex: 1, rationale: "The therapeutic range for digoxin is 0.5-2.0 ng/mL. A level of 2.4 ng/mL indicates toxicity. Early signs of digoxin toxicity include visual disturbances (yellow-green halos, blurred vision), bradycardia, nausea, vomiting, and anorexia. Life-threatening toxicity can cause fatal dysrhythmias. The antidote is digoxin immune Fab (Digibind).", isFree: true }
    ],
    faqs: [
      { question: "How many medications do I need to know for the NCLEX-RN?", answer: "Focus on 75-100 core medications across major drug classifications. Understanding drug class characteristics (stems, shared mechanisms, shared side effects) allows you to answer questions about medications you have never specifically studied. Prioritize high-alert medications, cardiovascular drugs, diabetic medications, and antibiotics." },
      { question: "What is the difference between side effects and adverse effects?", answer: "Side effects are expected, often unavoidable effects that occur at therapeutic doses (e.g., drowsiness with antihistamines). Adverse effects are unexpected, harmful, or potentially dangerous reactions (e.g., Stevens-Johnson syndrome). On the NCLEX, knowing which effects require immediate action versus patient education is critical." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Insulin Guide", href: "/nclex-rn/medications/insulin-types", type: "medication" },
      { title: "Warfarin Guide", href: "/nclex-rn/medications/warfarin", type: "medication" },
      { title: "Heparin Guide", href: "/nclex-rn/medications/heparin", type: "medication" },
      { title: "Digoxin Guide", href: "/nclex-rn/medications/digoxin", type: "medication" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "adult-health",
    contentType: "category",
    tier: "nclex-rn",
    title: "NCLEX-RN Adult Health",
    metaTitle: "NCLEX-RN Adult Health Nursing: Physiological Integrity Review (2025)",
    metaDescription: "Comprehensive adult health review for the NCLEX-RN covering cardiovascular, respiratory, neurological, GI, and endocrine systems with clinical judgment focus.",
    keywords: "NCLEX-RN adult health, physiological integrity NCLEX, medical-surgical nursing NCLEX, adult health nursing review",
    h1: "NCLEX-RN Adult Health Review",
    introText: "Physiological Integrity is the largest NCLEX-RN category (38-62%), and adult health conditions form the backbone of this domain. At the RN level, you must demonstrate clinical judgment in managing complex, multi-system conditions — recognizing deterioration, prioritizing interventions, and coordinating care across the interdisciplinary team.",
    sections: [
      { heading: "Cardiovascular System", content: "High-yield topics: Heart failure (left vs. right-sided, acute decompensation), acute coronary syndromes (STEMI vs. NSTEMI management), dysrhythmia recognition and intervention, hypertensive emergency, peripheral vascular disease, and post-cardiac catheterization care. Focus on: hemodynamic monitoring interpretation, emergency medication administration (nitroglycerin, morphine, heparin, thrombolytics), and discharge teaching for anticoagulation therapy." },
      { heading: "Respiratory System", content: "High-yield topics: COPD exacerbation (oxygen titration, do NOT exceed 2L for chronic CO2 retainers), pneumonia (community-acquired vs. hospital-acquired), ARDS (mechanical ventilation management), chest tube management, pulmonary embolism (Wells criteria, anticoagulation), and tracheostomy care. Focus on: ABG interpretation (ROME: Respiratory Opposite, Metabolic Equal), ventilator settings and alarms, and respiratory assessment including auscultation patterns." },
      { heading: "Neurological System", content: "High-yield topics: Stroke (ischemic vs. hemorrhagic, tPA window, NIH Stroke Scale), increased intracranial pressure (Cushing triad, positioning, osmotic diuretics), seizure management, spinal cord injury (neurogenic shock, autonomic dysreflexia), and meningitis. Focus on: neurological assessment (GCS, pupillary response, motor function), ICP monitoring, and acute stroke protocol." },
      { heading: "Endocrine System", content: "High-yield topics: DKA vs. HHS (pathophysiology, management differences), thyroid storm, myxedema coma, Addisonian crisis, Cushing syndrome, and SIADH vs. diabetes insipidus. Focus on: insulin administration protocols, fluid and electrolyte management in diabetic emergencies, and hormone replacement therapy." }
    ],
    practiceQuestions: [
      { question: "A client with COPD on 2L nasal cannula has an ABG: pH 7.32, PaCO2 58 mmHg, HCO3 32 mEq/L, PaO2 62 mmHg. How does the nurse interpret this?", options: ["Uncompensated respiratory acidosis", "Partially compensated respiratory acidosis", "Fully compensated respiratory alkalosis", "Uncompensated metabolic alkalosis"], correctIndex: 1, rationale: "pH 7.32 is acidotic (below 7.35), PaCO2 58 is elevated (respiratory cause), and HCO3 32 is elevated (kidneys compensating by retaining bicarbonate). Since the pH has not returned to normal range, this is partially compensated respiratory acidosis — typical for chronic COPD with acute exacerbation. The elevated HCO3 indicates the kidneys are attempting to buffer the chronic CO2 retention.", isFree: true }
    ],
    faqs: [
      { question: "How is adult health tested differently on the NCLEX-RN vs. NCLEX-PN?", answer: "The NCLEX-RN tests adult health at a higher cognitive level — emphasis on clinical judgment, prioritization, delegation, and management of complex multi-system conditions. RN-level questions expect you to independently make clinical decisions, manage emergency situations, and coordinate care. PN-level questions focus more on monitoring, reporting, and performing tasks within a directed care plan." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Heart Failure Guide", href: "/nclex-rn/conditions/heart-failure", type: "condition" },
      { title: "COPD Guide", href: "/nclex-rn/conditions/copd", type: "condition" },
      { title: "Diabetes/DKA/HHS Guide", href: "/nclex-rn/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "Stroke Guide", href: "/nclex-rn/conditions/stroke", type: "condition" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "maternal-child",
    contentType: "category",
    tier: "nclex-rn",
    title: "NCLEX-RN Maternal-Child Nursing",
    metaTitle: "NCLEX-RN Maternal-Child Nursing: OB, Peds & Newborn Review (2025)",
    metaDescription: "Complete NCLEX-RN maternal-child review covering antepartum, intrapartum, postpartum care, newborn assessment, pediatric emergencies, and growth/development.",
    keywords: "NCLEX-RN maternal child, obstetric nursing NCLEX, pediatric nursing NCLEX, newborn assessment, labor and delivery NCLEX",
    h1: "NCLEX-RN Maternal-Child Nursing Review",
    introText: "Maternal-child health is tested within Health Promotion and Maintenance (6-12%) and Physiological Integrity. At the RN level, you must demonstrate independent judgment in managing obstetric emergencies, neonatal assessment, and pediatric clinical reasoning. Focus on recognizing complications early and knowing priority interventions.",
    sections: [
      { heading: "Antepartum Care", content: "High-yield topics: Preeclampsia (mild vs. severe, HELLP syndrome, magnesium sulfate therapy), gestational diabetes (blood glucose targets, insulin management), placenta previa vs. abruptio placentae (painless vs. painful bleeding, management differences), Rh incompatibility (RhoGAM administration timing), and teratogenic medications. Focus on: fetal monitoring interpretation (accelerations = reassuring, late decelerations = uteroplacental insufficiency), Bishop score, and maternal lab monitoring." },
      { heading: "Intrapartum & Postpartum", content: "High-yield topics: Stages of labor, fetal heart rate patterns (variable decelerations = cord compression, change position; late decelerations = turn off Pitocin, position left lateral, O2), postpartum hemorrhage (uterine atony is #1 cause, fundal massage), amniotic fluid embolism, and postpartum depression screening. Focus on: Pitocin administration safety, C-section post-operative care, breastfeeding assessment and support." },
      { heading: "Newborn Assessment", content: "High-yield topics: APGAR scoring (1 and 5 minutes), gestational age assessment, newborn thermoregulation, hyperbilirubinemia and phototherapy, congenital anomalies, and neonatal abstinence syndrome. Focus on: recognizing signs of respiratory distress in neonates (nasal flaring, grunting, retractions), newborn reflexes, and parent teaching about safe sleep, feeding, and car seat safety." },
      { heading: "Pediatric Nursing", content: "High-yield topics: Growth and development milestones, pediatric dosage calculations (weight-based), common childhood illnesses (croup vs. epiglottitis, pyloric stenosis, intussusception), pediatric dehydration assessment, and child abuse recognition. Focus on: age-appropriate communication, informed consent and assent, and pediatric emergency management (choking, seizures, anaphylaxis)." }
    ],
    practiceQuestions: [
      { question: "A laboring client's fetal heart rate tracing shows late decelerations with each contraction. Pitocin is infusing at 6 mU/min. What is the nurse's priority action?", options: ["Increase the Pitocin rate to expedite delivery", "Turn off the Pitocin and reposition the client to left lateral", "Document the findings and continue monitoring", "Prepare for immediate cesarean section"], correctIndex: 1, rationale: "Late decelerations indicate uteroplacental insufficiency — the placenta is not adequately oxygenating the fetus during contractions. Priority interventions: stop Pitocin (removes the stress), reposition to left lateral (improves uterine blood flow), administer oxygen, and increase IV fluids. Notify the provider. These interventions must be implemented before considering operative delivery.", isFree: true }
    ],
    faqs: [
      { question: "How much of the NCLEX-RN is maternal-child content?", answer: "While Health Promotion and Maintenance (which includes maternal-child content) is 6-12% of the exam, maternal-child topics also appear in Physiological Integrity and Management of Care. You may see 15-25 questions involving maternal-child content across multiple categories. It is a smaller portion than adult health but equally important to study." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Practice Questions", href: "/nclex-rn/practice-questions", type: "category" },
      { title: "Adult Health Review", href: "/nclex-rn/adult-health", type: "category" },
      { title: "Pharmacology Review", href: "/nclex-rn/pharmacology", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "mental-health",
    contentType: "category",
    tier: "nclex-rn",
    title: "NCLEX-RN Mental Health Nursing",
    metaTitle: "NCLEX-RN Mental Health Nursing: Psych Nursing & Therapeutic Communication (2025)",
    metaDescription: "NCLEX-RN mental health review covering therapeutic communication, psychiatric disorders, crisis intervention, substance abuse, and psychopharmacology.",
    keywords: "NCLEX-RN mental health, psychiatric nursing NCLEX, therapeutic communication, crisis intervention nursing, psychopharmacology NCLEX",
    h1: "NCLEX-RN Mental Health Nursing Review",
    introText: "Psychosocial Integrity accounts for 6-12% of the NCLEX-RN. Mental health questions test your ability to use therapeutic communication, manage psychiatric emergencies, understand psychopharmacology, and maintain appropriate professional boundaries. These questions often have two 'good' answers — the key is identifying the MOST therapeutic response.",
    sections: [
      { heading: "Therapeutic Communication", content: "The gold standard responses are: open-ended questions, reflection, restating, clarification, and silence. Non-therapeutic responses include: giving advice, using clichés ('everything happens for a reason'), false reassurance, asking 'why,' changing the subject, and sharing personal experiences. When two answers seem correct, choose the one that acknowledges the client's feelings and encourages exploration." },
      { heading: "Psychiatric Emergencies", content: "Suicidal ideation: Always assess for a plan, means, intent, and timeline. A specific plan with available means is highest risk. Place on one-to-one observation, remove all potential weapons, and maintain a therapeutic, non-judgmental approach. Violent/aggressive client: Maintain a safe distance, speak calmly, offer choices, use least restrictive intervention first (verbal de-escalation → chemical restraint → physical restraint). Seclusion and restraint require a provider order within 1 hour." },
      { heading: "Key Psychiatric Disorders", content: "Schizophrenia: Positive symptoms (hallucinations, delusions, disorganized speech/behavior) respond better to antipsychotics than negative symptoms (flat affect, social withdrawal, avolition). Bipolar Disorder: Lithium is first-line (therapeutic level 0.6-1.2 mEq/L, narrow therapeutic index). Major Depressive Disorder: SSRIs first-line, monitor for suicidal ideation especially in adolescents, serotonin syndrome risk. Eating Disorders: Medical stabilization before psychological treatment, refeeding syndrome risk." },
      { heading: "Substance Use Disorders", content: "Alcohol withdrawal: Can be life-threatening. Assess with CIWA-Ar. Peak withdrawal 48-72 hours. Seizures and delirium tremens are medical emergencies. Treatment: benzodiazepines (lorazepam, chlordiazepoxide), thiamine (before glucose to prevent Wernicke encephalopathy), and IV fluids. Opioid withdrawal: Uncomfortable but rarely life-threatening. Symptoms: rhinorrhea, lacrimation, GI distress, muscle aches. Treatment: methadone, buprenorphine, or clonidine." }
    ],
    practiceQuestions: [
      { question: "A client says, 'Nobody cares whether I live or die.' What is the most therapeutic response?", options: ["That's not true — your family loves you very much.", "Are you thinking about hurting yourself?", "Let's talk about something more positive.", "Everyone feels that way sometimes."], correctIndex: 1, rationale: "The client's statement may indicate suicidal ideation. The most therapeutic response directly assesses for suicidal thoughts. Asking about suicidal ideation does NOT 'put the idea in their head' — it opens the door for honest communication and safety assessment. The other options are non-therapeutic: false reassurance, changing the subject, and minimizing feelings.", isFree: true }
    ],
    faqs: [
      { question: "How do I choose between two therapeutic-sounding answers?", answer: "When two responses seem therapeutic, choose the one that: (1) directly addresses the client's expressed concern, (2) encourages the client to explore their feelings, (3) uses reflection or open-ended questioning. Avoid responses that give advice, offer false reassurance, or shift focus away from the client's stated feelings." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Practice Questions", href: "/nclex-rn/practice-questions", type: "category" },
      { title: "Prioritization & Delegation", href: "/nclex-rn/prioritization-and-delegation", type: "category" },
      { title: "Pharmacology Review", href: "/nclex-rn/pharmacology", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "exam-strategy",
    contentType: "category",
    tier: "nclex-rn",
    title: "NCLEX-RN Exam Strategy",
    metaTitle: "NCLEX-RN Exam Strategy: Study Plan, Test Tips & How to Pass (2025)",
    metaDescription: "Proven strategies for passing the NCLEX-RN on your first attempt. Study plan templates, test-taking tips, CAT strategy, and NGN preparation techniques.",
    keywords: "NCLEX-RN study strategy, how to pass NCLEX-RN, NCLEX-RN study plan, NCLEX test-taking tips, CAT strategy NCLEX",
    h1: "NCLEX-RN Exam Strategy",
    introText: "Success on the NCLEX-RN requires more than content knowledge — it demands strategic preparation, effective test-taking skills, and mental readiness. This guide provides evidence-based strategies for building a study plan, mastering CAT logic, and performing at your best on exam day.",
    sections: [
      { heading: "Building Your Study Plan", content: "Most successful candidates study 6-12 weeks after graduation. Structure your plan around the Client Needs blueprint: Physiological Integrity (38-62%), Management of Care (17-23%), and Pharmacology (13-19%) deserve the most time. Use the 60/30/10 rule: 60% practice questions with rationale review, 30% targeted content review of weak areas, 10% test-taking strategies and self-care. Schedule full-length CAT practice exams weekly in the final 3 weeks." },
      { heading: "Mastering CAT Logic", content: "The CAT algorithm continuously estimates your ability. The exam stops when: (1) it is 95% confident you are above or below the passing standard, (2) you reach 150 questions, or (3) you reach 5 hours. Do NOT interpret question difficulty or count as indicators of pass/fail. Finishing at 85 questions can mean pass OR fail. Focus on answering each question to the best of your ability without worrying about the algorithm." },
      { heading: "Test-Taking Strategies", content: "Read every word carefully — NCLEX questions are precisely worded. Identify the client (age, diagnosis, acuity), the clinical situation, and exactly what is being asked. Use process of elimination: eliminate options with absolute words (always, never), eliminate non-nursing actions, and eliminate options outside the nurse's scope. For 'priority' questions, apply ABCs → Maslow's → Acute vs. Chronic. For SATA, evaluate each option independently as true or false." },
      { heading: "Exam Day Preparation", content: "Sleep 7-8 hours the night before. Eat a balanced meal. Arrive 30 minutes early. Bring required identification. Use the tutorial to familiarize yourself with the interface. Take both scheduled breaks (after 2 hours and 3.5 hours) even if you feel fine — fatigue impairs judgment after 3 hours. Trust your preparation. If you have been consistently performing above the passing standard on practice exams, you are ready." }
    ],
    practiceQuestions: [
      { question: "A nursing graduate has been studying for 8 weeks and consistently scores 65-70% on practice exams across all content areas. The NCLEX-RN is in 2 weeks. What is the best study approach?", options: ["Continue studying all content areas equally", "Focus on the weakest 2-3 content areas while maintaining practice questions", "Stop studying to avoid burnout and rely on prior preparation", "Switch to a new review course for a fresh perspective"], correctIndex: 1, rationale: "With consistent scores of 65-70% (near or at passing level) and 2 weeks remaining, the most efficient strategy is targeted review of the weakest areas while continuing daily practice questions. Spreading time equally ignores the opportunity to raise scores in weak areas. Stopping completely risks losing sharpness. Switching courses wastes time relearning study systems.", isFree: true }
    ],
    faqs: [
      { question: "How long should I study for the NCLEX-RN?", answer: "Most successful candidates study 6-12 weeks, dedicating 4-8 hours daily. Full-time studiers may need 4-6 weeks; part-time studiers 8-12 weeks. Consistency is more important than total hours — daily practice is better than occasional marathon sessions." },
      { question: "Does getting 85 questions mean I passed?", answer: "No. The exam stops at 85 questions when the computer is 95% confident in its decision — this can be pass OR fail. Finishing quickly means the algorithm was decisive, not necessarily favorable. Similarly, answering 150 questions does not mean failure." },
      { question: "What if I fail the NCLEX-RN?", answer: "You must wait 45 days before retesting. You will receive a Candidate Performance Report (CPR) showing your performance in each Client Needs category. Use this to focus your study on weak areas. Many candidates pass on the second attempt with targeted preparation. Contact your state board for specific retake policies." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Practice Questions", href: "/nclex-rn/practice-questions", type: "category" },
      { title: "NGN Guide", href: "/nclex-rn/ngn", type: "category" },
      { title: "Prioritization & Delegation", href: "/nclex-rn/prioritization-and-delegation", type: "category" },
      { title: "Mock Exams", href: "/mock-exams", type: "question-bank" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "top-conditions",
    contentType: "category",
    tier: "nclex-rn",
    title: "NCLEX-RN Top Conditions",
    metaTitle: "NCLEX-RN Top Conditions: High-Yield Medical Conditions to Study (2025)",
    metaDescription: "The most commonly tested medical conditions on the NCLEX-RN with clinical depth, prioritization focus, and practice questions for each condition.",
    keywords: "NCLEX-RN conditions, most tested NCLEX conditions, NCLEX-RN medical conditions, nursing conditions review",
    h1: "NCLEX-RN Top Conditions",
    introText: "These are the highest-yield medical conditions tested on the NCLEX-RN. Each condition guide includes full clinical depth: pathophysiology, assessment findings, labs, medications, nursing interventions, complications, patient teaching, exam pearls, and practice questions. Focus on understanding the clinical reasoning behind each intervention.",
    sections: [
      { heading: "Cardiovascular Conditions", content: "Heart Failure (left-sided vs. right-sided, acute decompensation management), Myocardial Infarction / Acute Coronary Syndrome (STEMI vs. NSTEMI, thrombolytic therapy, MONA), Hypertension (hypertensive emergency, medication management), and Stroke (ischemic vs. hemorrhagic, tPA criteria, NIH Stroke Scale). These conditions frequently appear in prioritization, delegation, and NGN case study questions." },
      { heading: "Respiratory Conditions", content: "COPD (oxygen management, exacerbation recognition), Pneumonia (community-acquired vs. hospital-acquired, sepsis risk), Pulmonary Embolism (Wells criteria, anticoagulation), and ARDS (mechanical ventilation, prone positioning). Respiratory conditions commonly test ABG interpretation and prioritization skills." },
      { heading: "Metabolic & Endocrine Conditions", content: "Diabetes / DKA / HHS (insulin management, fluid resuscitation, potassium monitoring), Sepsis (early recognition using qSOFA/SIRS, Surviving Sepsis Campaign bundles), and Thyroid emergencies (thyroid storm, myxedema coma). These conditions test your ability to manage multi-system derangements and prioritize interventions." }
    ],
    practiceQuestions: [
      { question: "A nurse is triaging four emergency department clients. Which client requires the most immediate intervention?", options: ["A client with chest pain radiating to the left arm and diaphoresis", "A client with a displaced ankle fracture and pain of 8/10", "A client with vomiting and diarrhea for 2 days", "A client with a laceration requiring 6 sutures"], correctIndex: 0, rationale: "Chest pain radiating to the left arm with diaphoresis is a classic presentation of acute myocardial infarction — a life-threatening cardiovascular emergency requiring immediate assessment, ECG, and treatment (MONA: Morphine, Oxygen, Nitroglycerin, Aspirin). While the fracture is painful, it is not immediately life-threatening.", isFree: true }
    ],
    faqs: [
      { question: "Which conditions are most commonly tested on the NCLEX-RN?", answer: "The most frequently tested conditions include heart failure, diabetes/DKA/HHS, COPD, pneumonia, stroke, sepsis, hypertension, and MI/ACS. These conditions appear across multiple question formats including prioritization, delegation, and NGN case studies." }
    ],
    internalLinks: [
      { title: "Heart Failure", href: "/nclex-rn/conditions/heart-failure", type: "condition" },
      { title: "Diabetes/DKA/HHS", href: "/nclex-rn/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "COPD", href: "/nclex-rn/conditions/copd", type: "condition" },
      { title: "Sepsis", href: "/nclex-rn/conditions/sepsis", type: "condition" },
      { title: "Stroke", href: "/nclex-rn/conditions/stroke", type: "condition" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "lab-values",
    contentType: "category",
    tier: "nclex-rn",
    title: "NCLEX-RN Lab Values",
    metaTitle: "NCLEX-RN Lab Values: Normal Ranges, Interpretation & Nursing Actions (2025)",
    metaDescription: "Essential lab values for the NCLEX-RN with normal ranges (US & SI units), clinical interpretation, associated conditions, and nursing implications.",
    keywords: "NCLEX-RN lab values, nursing lab values, normal ranges NCLEX, lab interpretation nursing, critical lab values",
    h1: "NCLEX-RN Lab Values Reference",
    introText: "Lab value interpretation is tested throughout the NCLEX-RN, particularly in Reduction of Risk Potential (9-15%) and Physiological Adaptation (11-17%). At the RN level, you must not only know normal ranges but also interpret results in clinical context, correlate with assessment findings, and determine appropriate nursing actions.",
    sections: [
      { heading: "Critical Lab Values", content: "Know these critical values that require immediate notification: Potassium <3.0 or >6.0 mEq/L (cardiac arrhythmias), Sodium <120 or >160 mEq/L (neurological changes), Glucose <50 or >400 mg/dL, Troponin elevated (myocardial injury), INR >4.0 (bleeding risk), Hemoglobin <7 g/dL (transfusion threshold), WBC >30,000 or <2,000 (sepsis or neutropenia), and Lactate >4 mmol/L (tissue hypoperfusion/sepsis)." },
      { heading: "Lab-Medication Connections", content: "Key lab-drug pairings tested on the NCLEX-RN: Warfarin → INR (therapeutic 2.0-3.0), Heparin → aPTT (therapeutic 1.5-2.5x control), Digoxin → serum level (0.5-2.0 ng/mL) + potassium (hypokalemia increases toxicity risk), Lithium → serum level (0.6-1.2 mEq/L), Aminoglycosides → trough levels + creatinine (nephrotoxicity), Metformin → creatinine/eGFR (hold if eGFR <30), ACE inhibitors → potassium + creatinine." },
      { heading: "ABG Interpretation", content: "Use ROME (Respiratory Opposite, Metabolic Equal): Step 1: Look at pH (<7.35 = acidosis, >7.45 = alkalosis). Step 2: Look at PaCO2 (if opposite direction of pH → respiratory cause). Step 3: Look at HCO3 (if same direction as pH → metabolic cause). Step 4: Determine compensation (is the non-causative value trying to normalize pH?). Normal ABG: pH 7.35-7.45, PaCO2 35-45 mmHg, HCO3 22-26 mEq/L, PaO2 80-100 mmHg." }
    ],
    practiceQuestions: [
      { question: "A client's lab results show: K+ 6.2 mEq/L, Na+ 136 mEq/L, Glucose 182 mg/dL, BUN 28 mg/dL. Which finding requires the most urgent nursing action?", options: ["Sodium 136 mEq/L", "Potassium 6.2 mEq/L", "Glucose 182 mg/dL", "BUN 28 mg/dL"], correctIndex: 1, rationale: "Potassium 6.2 mEq/L is critically elevated (hyperkalemia) and can cause fatal cardiac dysrhythmias including ventricular fibrillation and cardiac arrest. This requires immediate notification and intervention (cardiac monitoring, IV calcium gluconate, insulin + dextrose, kayexalate). The sodium is normal, glucose is mildly elevated, and BUN is slightly elevated — none pose immediate threat.", isFree: true }
    ],
    faqs: [
      { question: "Do I need to memorize exact lab value ranges?", answer: "You need to know the approximate normal ranges and, more importantly, the clinical significance of abnormal values. Know what conditions cause high or low values, what symptoms to assess for, what medications are affected, and what nursing actions are required. The NCLEX tests application of lab knowledge, not rote memorization of numbers." }
    ],
    internalLinks: [
      { title: "Potassium Guide", href: "/nclex-rn/lab-values/potassium", type: "lab-value" },
      { title: "Sodium Guide", href: "/nclex-rn/lab-values/sodium", type: "lab-value" },
      { title: "ABGs Guide", href: "/nclex-rn/lab-values/abgs", type: "lab-value" },
      { title: "Troponin Guide", href: "/nclex-rn/lab-values/troponin", type: "lab-value" },
      { title: "Pharmacology Review", href: "/nclex-rn/pharmacology", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "medications",
    contentType: "category",
    tier: "nclex-rn",
    title: "NCLEX-RN Medications",
    metaTitle: "NCLEX-RN Medications: High-Alert Drug Guides for Nursing Exams (2025)",
    metaDescription: "Detailed NCLEX-RN medication guides for high-alert drugs: insulin, furosemide, warfarin, heparin, metformin, lisinopril, metoprolol, and digoxin.",
    keywords: "NCLEX-RN medications, nursing drug guides, high-alert medications NCLEX, insulin nursing, warfarin nursing, heparin nursing",
    h1: "NCLEX-RN Medication Guides",
    introText: "Master the most commonly tested medications on the NCLEX-RN. Each medication guide covers mechanism of action, indications, side effects, adverse effects, contraindications, nursing considerations, monitoring parameters, patient teaching, and exam tips written at the RN clinical depth.",
    sections: [
      { heading: "Medication Guide Index", content: "Insulin Types (rapid-acting, short-acting, intermediate, long-acting) — know onset, peak, duration, and mixing rules. Furosemide (Lasix) — loop diuretic, potassium monitoring, ototoxicity risk. Warfarin (Coumadin) — INR monitoring, vitamin K interactions, pregnancy contraindication. Heparin — aPTT monitoring, protamine sulfate antidote, HIT risk. Metformin — first-line T2DM, hold for contrast, lactic acidosis risk. Lisinopril — ACE inhibitor, dry cough, angioedema, pregnancy contraindication. Metoprolol — beta-blocker, check HR before giving, do not stop abruptly. Digoxin — check apical pulse, narrow therapeutic index, toxicity signs." }
    ],
    practiceQuestions: [],
    faqs: [
      { question: "Which medications are most commonly tested on the NCLEX-RN?", answer: "The most frequently tested medications include insulin (all types), heparin, warfarin, digoxin, potassium chloride IV, morphine/opioids, ACE inhibitors, beta-blockers, loop diuretics, and antibiotics. Focus on high-alert medications and drugs with narrow therapeutic indices." }
    ],
    internalLinks: [
      { title: "Insulin Types", href: "/nclex-rn/medications/insulin-types", type: "medication" },
      { title: "Furosemide", href: "/nclex-rn/medications/furosemide", type: "medication" },
      { title: "Warfarin", href: "/nclex-rn/medications/warfarin", type: "medication" },
      { title: "Heparin", href: "/nclex-rn/medications/heparin", type: "medication" },
      { title: "Digoxin", href: "/nclex-rn/medications/digoxin", type: "medication" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  }
];

export const nclexRnConditions: NclexRnConditionPage[] = [
  {
    slug: "heart-failure",
    contentType: "condition",
    tier: "nclex-rn",
    name: "Heart Failure",
    metaTitle: "Heart Failure NCLEX-RN Study Guide: Clinical Judgment & Prioritization (2025)",
    metaDescription: "Master heart failure for the NCLEX-RN: left vs right-sided HF, acute decompensation, hemodynamic monitoring, medications, nursing interventions, and NGN practice questions.",
    keywords: "heart failure NCLEX-RN, left-sided heart failure, right-sided heart failure, acute decompensation, HF nursing interventions, NCLEX heart failure questions",
    definition: "Heart failure (HF) is a complex clinical syndrome in which the heart is unable to pump sufficient blood to meet the body's metabolic demands. It can result from structural or functional cardiac disorders that impair ventricular filling or ejection. HF is classified as left-sided (systolic or diastolic), right-sided, or biventricular, and staged from A (at risk) through D (refractory).",
    pathophysiology: "In systolic HF (HFrEF, EF <40%), impaired myocardial contractility reduces stroke volume and cardiac output. Neurohormonal compensatory mechanisms activate: the sympathetic nervous system increases heart rate and contractility (short-term benefit, long-term harm), RAAS causes vasoconstriction and sodium/water retention (increasing preload and afterload), and natriuretic peptides promote vasodilation and diuresis (overwhelmed in HF). These mechanisms initially maintain cardiac output but progressively worsen ventricular remodeling. In diastolic HF (HFpEF, EF >50%), the ventricle is stiff and cannot relax properly during diastole, impairing filling despite preserved contractility.",
    causesRiskFactors: ["Coronary artery disease / myocardial infarction (#1 cause)", "Chronic hypertension", "Valvular heart disease", "Cardiomyopathy (dilated, hypertrophic, restrictive)", "Diabetes mellitus", "Obesity", "Atrial fibrillation", "Chronic kidney disease", "Excessive alcohol use", "Cardiotoxic medications (doxorubicin)"],
    signsSymptoms: {
      early: ["Fatigue and exercise intolerance", "Dyspnea on exertion", "Orthopnea (requiring multiple pillows)", "Paroxysmal nocturnal dyspnea (PND)", "Mild peripheral edema", "Nocturia", "Weight gain (2-3 lb over 24-48 hours)"],
      late: ["Dyspnea at rest", "Severe bilateral pitting edema", "Ascites and hepatomegaly", "Jugular venous distention (JVD)", "Bibasilar crackles (pulmonary edema)", "S3 heart sound (ventricular gallop)", "Pink, frothy sputum (acute pulmonary edema)", "Cyanosis and altered mental status"]
    },
    assessmentFindings: ["S3 gallop (increased ventricular volume)", "JVD (right-sided failure or biventricular)", "Hepatojugular reflux", "Displaced PMI (cardiomegaly)", "Bilateral crackles (left-sided failure)", "Pitting edema (dependent areas)", "Narrow pulse pressure", "Cool, clammy extremities"],
    labs: [
      { name: "BNP", normalRange: "<100 pg/mL", significance: "Elevated BNP (>400 pg/mL) strongly suggests heart failure. Used to differentiate cardiac vs. pulmonary dyspnea. Levels correlate with HF severity and prognosis." },
      { name: "Troponin", normalRange: "<0.04 ng/mL", significance: "Elevated troponin indicates myocardial injury. In HF, mild elevation may indicate ongoing myocardial stress or acute coronary syndrome as the precipitant." },
      { name: "Sodium", normalRange: "136-145 mEq/L", significance: "Dilutional hyponatremia common in HF due to water retention exceeding sodium retention. Na+ <130 mEq/L associated with poor prognosis." },
      { name: "Creatinine/BUN", normalRange: "Cr 0.7-1.3 mg/dL, BUN 7-20 mg/dL", significance: "Elevated levels indicate cardiorenal syndrome — reduced cardiac output impairs renal perfusion. Monitor for worsening with diuretic therapy." }
    ],
    medications: [
      { name: "Furosemide (Lasix)", drugClass: "Loop Diuretic", action: "Inhibits sodium-potassium-chloride cotransporter in the loop of Henle, producing rapid diuresis to reduce fluid overload", sideEffects: "Hypokalemia, hyponatremia, ototoxicity, dehydration", nursingConsiderations: "Monitor potassium, administer in the morning to avoid nocturia, weigh daily, monitor I&O, assess for orthostatic hypotension" },
      { name: "Lisinopril", drugClass: "ACE Inhibitor", action: "Reduces preload and afterload by blocking RAAS, slows ventricular remodeling", sideEffects: "Dry cough, hyperkalemia, angioedema", nursingConsiderations: "Monitor potassium and renal function, contraindicated in pregnancy, first-line neurohormonal blockade for HFrEF" },
      { name: "Metoprolol Succinate", drugClass: "Beta-Blocker", action: "Reduces heart rate and myocardial oxygen demand, reverses negative remodeling", sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm", nursingConsiderations: "Check apical HR before administration, hold if HR <60, start low and titrate slowly in HF, NEVER discontinue abruptly" },
      { name: "Digoxin", drugClass: "Cardiac Glycoside", action: "Increases contractility (positive inotrope) and slows conduction through AV node", sideEffects: "Bradycardia, visual disturbances, nausea, fatal dysrhythmias at toxic levels", nursingConsiderations: "Check apical pulse x1 full minute, hold if HR <60, therapeutic level 0.5-2.0 ng/mL, hypokalemia increases toxicity risk" }
    ],
    nursingInterventions: [
      "Weigh daily at the same time, same clothing, same scale — report gain >2 lb/day or 5 lb/week",
      "Monitor strict I&O, target net negative fluid balance in acute decompensation",
      "Assess lung sounds every 4 hours — crackles indicate worsening pulmonary congestion",
      "Elevate HOB 45-90 degrees to reduce preload and improve ventilation",
      "Restrict sodium intake to <2,000 mg/day, restrict fluids to 1.5-2 L/day as ordered",
      "Monitor for signs of decreased cardiac output: cool extremities, decreased urine output, confusion",
      "Administer oxygen to maintain SpO2 >94%, prepare for BiPAP/CPAP in acute pulmonary edema",
      "Monitor serum potassium closely (hypokalemia from diuretics increases digoxin toxicity risk)",
      "Assess for medication effectiveness and adverse effects at each encounter",
      "Coordinate cardiac rehabilitation referral for chronic HF management"
    ],
    complications: ["Acute pulmonary edema", "Cardiogenic shock", "Cardiorenal syndrome", "Pleural effusion", "Atrial fibrillation", "Ventricular dysrhythmias", "Deep vein thrombosis / pulmonary embolism", "Hepatic congestion"],
    patientTeaching: [
      "Weigh yourself daily and report weight gain >2 lb/day or 5 lb/week",
      "Restrict sodium intake to <2,000 mg/day — read food labels, avoid processed foods",
      "Take all medications as prescribed — do not skip doses or stop abruptly",
      "Recognize worsening symptoms: increasing shortness of breath, swelling, fatigue",
      "Elevate legs when sitting, avoid prolonged standing",
      "Moderate physical activity as tolerated — cardiac rehabilitation is beneficial",
      "Get annual influenza and pneumococcal vaccinations",
      "Avoid NSAIDs (worsen fluid retention) and limit alcohol"
    ],
    examPearls: [
      "Left-sided HF = pulmonary symptoms (crackles, dyspnea, pink frothy sputum). Right-sided HF = systemic symptoms (JVD, edema, hepatomegaly).",
      "Weight gain is the EARLIEST indicator of fluid retention — assess before edema or crackles appear.",
      "BNP differentiates cardiac dyspnea from pulmonary dyspnea — elevated BNP = heart failure.",
      "High-Fowler's position reduces preload and improves breathing — priority nursing action for acute dyspnea.",
      "Hypokalemia + digoxin = increased toxicity risk — always check potassium in digoxin patients."
    ],
    commonTrapAnswers: [
      "Choosing to restrict ALL fluids when the question asks about sodium restriction",
      "Administering digoxin without checking the apical pulse for a full minute",
      "Choosing to increase the Lasix dose without checking potassium levels first",
      "Selecting flat positioning for a client in acute pulmonary edema",
      "Choosing to educate about diet before addressing acute respiratory distress"
    ],
    practiceQuestions: [
      { question: "A client with heart failure has a BNP of 850 pg/mL, bilateral crackles, and SpO2 of 88%. What is the priority nursing intervention?", options: ["Weigh the client and document findings", "Elevate the HOB and administer oxygen", "Restrict fluids to 1.5 L/day", "Notify dietary services for sodium restriction"], correctIndex: 1, rationale: "With acute respiratory distress (SpO2 88%, crackles), the priority is addressing the airway and breathing: elevate HOB to high-Fowler's (reduces preload, improves ventilation) and administer oxygen. Weight, fluid restriction, and dietary changes are important but not the immediate priority when the client is hypoxic.", isFree: true },
      { question: "A nurse is preparing to administer digoxin to a heart failure client. The apical heart rate is 54 bpm. Potassium level is 3.2 mEq/L. What should the nurse do?", options: ["Administer the digoxin and recheck the heart rate in 1 hour", "Hold the digoxin and notify the provider about both findings", "Administer the digoxin with a potassium supplement", "Hold only the potassium supplement and give the digoxin"], correctIndex: 1, rationale: "Two concerns: HR <60 bpm (hold digoxin per standard parameters) AND hypokalemia (K+ 3.2 mEq/L increases digoxin toxicity risk). The nurse should hold digoxin and notify the provider about both the bradycardia and hypokalemia. Potassium should be corrected before resuming digoxin.", isFree: true },
      { question: "Which assessment finding indicates right-sided heart failure?", options: ["Bilateral crackles and pink frothy sputum", "Jugular venous distention and hepatomegaly", "Paroxysmal nocturnal dyspnea", "S3 gallop with tachycardia"], correctIndex: 1, rationale: "JVD and hepatomegaly are hallmarks of right-sided heart failure — blood backs up into the systemic venous circulation. Bilateral crackles, pink frothy sputum, and PND are left-sided HF symptoms (pulmonary congestion). S3 gallop can occur in both types.", isFree: true },
      { question: "A client with chronic heart failure reports a 4-pound weight gain over the past 2 days. The nurse should recognize this most likely indicates:", options: ["Increased dietary protein intake", "Fluid volume excess", "Muscle mass gain from exercise", "Medication non-adherence with diuretics"], correctIndex: 1, rationale: "A rapid weight gain of 4 lbs in 2 days indicates fluid retention (1 liter of fluid = approximately 2.2 lbs). In heart failure, this signals worsening fluid overload and requires assessment, possible diuretic adjustment, and evaluation of sodium and fluid compliance. While medication non-adherence could contribute, the clinical finding itself indicates fluid excess.", isFree: true },
      { question: "A client with heart failure is on furosemide 40 mg IV daily. Which lab value is most important for the nurse to monitor?", options: ["Hemoglobin", "Potassium", "Calcium", "Albumin"], correctIndex: 1, rationale: "Furosemide (loop diuretic) causes significant potassium loss. Hypokalemia is dangerous: it can cause cardiac dysrhythmias, muscle weakness, and increased digoxin toxicity (common combination in HF). Monitor potassium before and after diuretic administration.", isFree: false }
    ],
    faqs: [
      { question: "What is the difference between systolic and diastolic heart failure?", answer: "Systolic HF (HFrEF, EF <40%) involves impaired contractility — the heart cannot pump effectively. Diastolic HF (HFpEF, EF >50%) involves impaired relaxation — the ventricle is stiff and cannot fill properly during diastole. Both result in inadequate cardiac output, but treatment approaches differ." },
      { question: "Why is daily weight more important than I&O in heart failure?", answer: "Daily weight is the most reliable indicator of fluid balance changes because I&O measurements are often inaccurate (insensible losses, measurement errors). A weight gain of 2+ lbs in 24 hours or 5 lbs in a week indicates fluid retention before edema or crackles become clinically apparent." },
      { question: "Why do ACE inhibitors and beta-blockers help in heart failure?", answer: "Both provide neurohormonal blockade. ACE inhibitors block RAAS, reducing preload and afterload while slowing ventricular remodeling. Beta-blockers reduce heart rate and myocardial oxygen demand, reversing the harmful effects of chronic sympathetic activation. Together, they significantly reduce mortality in HFrEF." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Furosemide Guide", href: "/nclex-rn/medications/furosemide", type: "medication" },
      { title: "Digoxin Guide", href: "/nclex-rn/medications/digoxin", type: "medication" },
      { title: "Potassium Lab Values", href: "/nclex-rn/lab-values/potassium", type: "lab-value" },
      { title: "BNP Lab Values", href: "/nclex-rn/lab-values/bnp", type: "lab-value" },
      { title: "MI/ACS Guide", href: "/nclex-rn/conditions/mi-acs", type: "condition" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "diabetes-dka-hhs",
    contentType: "condition",
    tier: "nclex-rn",
    name: "Diabetes Mellitus / DKA / HHS",
    metaTitle: "Diabetes, DKA & HHS NCLEX-RN Guide: Insulin, Fluid Management & Clinical Judgment (2025)",
    metaDescription: "Master diabetes, DKA, and HHS for the NCLEX-RN: insulin administration, fluid resuscitation, potassium management, and clinical judgment practice questions.",
    keywords: "diabetes NCLEX-RN, DKA nursing, HHS nursing, insulin administration NCLEX, diabetic ketoacidosis, hyperosmolar hyperglycemic state",
    definition: "Diabetes mellitus encompasses metabolic disorders characterized by chronic hyperglycemia. Type 1 DM involves autoimmune beta-cell destruction requiring insulin. Type 2 DM involves insulin resistance and progressive beta-cell dysfunction. Diabetic Ketoacidosis (DKA) is an acute, life-threatening complication primarily of Type 1 DM characterized by hyperglycemia, metabolic acidosis, and ketonemia. Hyperosmolar Hyperglycemic State (HHS) is an acute complication of Type 2 DM characterized by profound hyperglycemia (>600 mg/dL), severe dehydration, and hyperosmolality without significant ketosis.",
    pathophysiology: "In DKA, absolute insulin deficiency prevents glucose utilization. Counter-regulatory hormones (glucagon, cortisol, epinephrine) stimulate lipolysis. Free fatty acids undergo hepatic beta-oxidation to ketone bodies (acetoacetate, beta-hydroxybutyrate, acetone), causing metabolic acidosis. Osmotic diuresis from hyperglycemia causes profound dehydration and electrolyte losses. In HHS, residual insulin prevents ketogenesis but is insufficient to control glucose. Extreme hyperglycemia (often >600-1000 mg/dL) causes severe osmotic diuresis, leading to profound dehydration (average fluid deficit 9-12 liters), hyperosmolality, and altered mental status.",
    causesRiskFactors: ["Type 1 DM (DKA), Type 2 DM (HHS)", "Infection (most common precipitant for both)", "Medication non-adherence (missed insulin)", "New diagnosis (DKA may be presenting feature of Type 1)", "Physiological stress (surgery, trauma, MI)", "Corticosteroid therapy", "Eating disorders in Type 1 DM patients"],
    signsSymptoms: {
      early: ["Polyuria, polydipsia, polyphagia (Type 1)", "Fatigue and blurred vision", "Nausea and abdominal pain (DKA)", "Gradual mental status changes (HHS)"],
      late: ["Kussmaul respirations and fruity breath (DKA)", "Severe dehydration (dry mucous membranes, poor turgor)", "Altered mental status progressing to coma", "Hypotension and tachycardia", "Seizures (HHS due to hyperosmolality)"]
    },
    assessmentFindings: ["Blood glucose: DKA typically 250-800 mg/dL, HHS typically >600 mg/dL", "pH: DKA <7.30, HHS usually >7.30", "Serum ketones: DKA strongly positive, HHS absent/minimal", "Serum osmolality: DKA 300-320, HHS >320 mOsm/kg", "Anion gap: DKA elevated (>12), HHS normal", "Dehydration: DKA 3-6L deficit, HHS 8-12L deficit"],
    labs: [
      { name: "Blood Glucose", normalRange: "70-100 mg/dL fasting", significance: "DKA: 250-800 mg/dL. HHS: >600 mg/dL (often >1000). Monitor hourly during treatment. Target glucose reduction of 50-75 mg/dL/hr." },
      { name: "Serum Potassium", normalRange: "3.5-5.0 mEq/L", significance: "May appear normal or elevated initially despite total body depletion. Insulin drives K+ intracellularly — check potassium BEFORE starting insulin. If K+ <3.3 mEq/L, replace FIRST." },
      { name: "ABG (pH)", normalRange: "7.35-7.45", significance: "DKA: pH <7.30 (metabolic acidosis from ketoacids). HHS: pH usually >7.30 (no significant ketosis). Degree of acidosis guides treatment intensity." },
      { name: "HbA1C", normalRange: "<5.7%", significance: "Reflects average glucose control over 2-3 months. Target <7% for most adults with diabetes. Not used for acute management but important for assessing chronic control." }
    ],
    medications: [
      { name: "Regular Insulin IV", drugClass: "Short-acting Insulin", action: "Facilitates cellular glucose uptake, suppresses ketogenesis, corrects acidosis", sideEffects: "Hypoglycemia, hypokalemia", nursingConsiderations: "Only regular insulin given IV. Check K+ before starting — replace K+ first if <3.3. When glucose reaches 200-250, add dextrose to IV — do NOT stop insulin until acidosis resolves." },
      { name: "0.9% Normal Saline", drugClass: "Isotonic Crystalloid", action: "Restores intravascular volume, corrects dehydration", sideEffects: "Fluid overload if excessive, hyperchloremic acidosis", nursingConsiderations: "Initial bolus 1-2 L in first hour, then 250-500 mL/hr. Switch to 0.45% NS when Na+ normalizes. Add dextrose when glucose approaches 200-250 mg/dL." },
      { name: "Potassium Chloride IV", drugClass: "Electrolyte Replacement", action: "Replaces total body potassium depleted by osmotic diuresis and corrected by insulin", sideEffects: "Hyperkalemia, cardiac arrhythmias if given too fast", nursingConsiderations: "NEVER IV push. Max rate 10-20 mEq/hr with cardiac monitoring. Add to maintenance fluids once K+ <5.3 mEq/L and UOP established." }
    ],
    nursingInterventions: [
      "Check serum potassium BEFORE initiating insulin — replace K+ first if <3.3 mEq/L",
      "Administer regular insulin IV drip per protocol — only regular insulin can be given IV",
      "Monitor blood glucose hourly — target reduction of 50-75 mg/dL per hour",
      "When glucose approaches 200-250 mg/dL, add dextrose to IV fluids — do NOT stop insulin",
      "Monitor potassium every 1-2 hours during treatment — insulin shifts K+ intracellularly",
      "Monitor strict I&O — dehydration correction is a treatment priority",
      "Assess neurological status frequently — cerebral edema risk with rapid fluid/glucose shifts",
      "Monitor ABGs or venous blood gases to assess acidosis resolution (DKA)",
      "Assess for precipitating cause (infection, MI, medication non-adherence)",
      "Transition to subcutaneous insulin when patient is eating, acidosis resolved, and glucose stable"
    ],
    complications: ["Cerebral edema (especially in children with rapid correction)", "Hypokalemia (from insulin therapy)", "Hypoglycemia (from insulin therapy)", "ARDS (from fluid resuscitation)", "Thromboembolism", "Rhabdomyolysis (HHS)", "Recurrent DKA"],
    patientTeaching: [
      "Never skip insulin — even when sick, continue basal insulin (sick day management)",
      "Monitor blood glucose more frequently during illness (every 4 hours minimum)",
      "Test urine for ketones when blood glucose >240 mg/dL or during illness",
      "Stay hydrated — drink 8 oz of sugar-free fluids every hour when sick",
      "Know the signs of DKA: nausea, vomiting, abdominal pain, fruity breath, deep rapid breathing",
      "Wear medical identification at all times",
      "Carry a fast-acting glucose source for hypoglycemia (Rule of 15)"
    ],
    examPearls: [
      "Check potassium BEFORE giving insulin in DKA — hypokalemia kills before hyperglycemia.",
      "Only REGULAR insulin can be given IV — the most tested insulin fact.",
      "Do NOT stop insulin in DKA when glucose normalizes — add dextrose instead. Stop insulin only when acidosis resolves.",
      "Kussmaul respirations + fruity breath = DKA. No ketones + extreme hyperglycemia + altered mental status = HHS.",
      "DKA = Type 1 (absolute insulin deficiency). HHS = Type 2 (relative insulin deficiency)."
    ],
    commonTrapAnswers: [
      "Starting insulin without checking potassium level first",
      "Stopping the insulin drip when blood glucose drops to 200 mg/dL",
      "Choosing to give NPH insulin IV (only regular insulin can be given IV)",
      "Administering IV potassium by push (never — always infusion)",
      "Choosing oral rehydration for a client with altered mental status and severe dehydration"
    ],
    practiceQuestions: [
      { question: "A client in DKA has K+ of 3.1 mEq/L. The provider has ordered an insulin drip. What is the nurse's priority action?", options: ["Start the insulin drip at the ordered rate", "Hold insulin, notify the provider, replace potassium first", "Give half the ordered insulin rate", "Administer oral potassium supplements"], correctIndex: 1, rationale: "Potassium 3.1 mEq/L is critically low. Insulin drives potassium intracellularly, which could cause fatal cardiac dysrhythmias. Potassium must be replaced to at least 3.3 mEq/L before starting insulin. Oral potassium is inappropriate in an acutely ill client who may be vomiting.", isFree: true },
      { question: "Which clinical finding differentiates DKA from HHS?", options: ["Blood glucose >300 mg/dL", "Severe dehydration", "Kussmaul respirations and fruity breath", "Tachycardia"], correctIndex: 2, rationale: "Kussmaul respirations (deep, rapid breathing to blow off CO2) and fruity acetone breath are unique to DKA because they result from metabolic acidosis caused by ketone body accumulation. HHS does NOT produce significant ketones. Both conditions present with hyperglycemia, dehydration, and tachycardia.", isFree: true },
      { question: "A client on an insulin drip for DKA has blood glucose 215 mg/dL. The anion gap is still 18 (elevated). What should the nurse do?", options: ["Discontinue the insulin drip and transition to subcutaneous insulin", "Continue the insulin drip and add dextrose to the IV fluids", "Increase the insulin drip rate to lower glucose faster", "Hold the insulin and recheck glucose in 1 hour"], correctIndex: 1, rationale: "The anion gap is still elevated (normal <12), indicating ongoing ketoacidosis. Insulin must continue until acidosis resolves (anion gap closes). Add dextrose to prevent hypoglycemia while continuing insulin. Never stop insulin based on glucose alone in DKA — the goal is resolving acidosis, not just normalizing glucose.", isFree: true },
      { question: "A nurse is mixing insulin for a client who requires both NPH and regular insulin. What is the correct technique?", options: ["Draw up NPH first, then regular insulin", "Draw up regular insulin first, then NPH", "Mix the two insulins in a single vial before drawing up", "These insulins cannot be mixed together"], correctIndex: 1, rationale: "When mixing insulins, draw up Regular (clear) before NPH (cloudy) to prevent contamination of the regular insulin vial with the longer-acting NPH particles. Remember: 'Clear before cloudy.' Note: Glargine and detemir should NEVER be mixed with other insulins.", isFree: true },
      { question: "What is the priority assessment for a client with newly diagnosed Type 2 diabetes starting metformin?", options: ["Liver function tests", "Serum potassium level", "Renal function (eGFR)", "Hemoglobin A1C"], correctIndex: 2, rationale: "Before starting metformin, renal function (eGFR) must be assessed. Metformin is contraindicated in severe renal impairment (eGFR <30 mL/min) because reduced clearance increases the risk of lactic acidosis. eGFR should be monitored at least annually while on metformin.", isFree: false }
    ],
    faqs: [
      { question: "Why must potassium be checked before starting insulin in DKA?", answer: "Although serum potassium may appear normal or elevated in DKA (acidosis shifts K+ out of cells), total body potassium is depleted from osmotic diuresis. Insulin activates Na+/K+ ATPase, driving potassium back into cells and causing serum potassium to drop rapidly. Starting insulin with low potassium can cause fatal cardiac arrhythmias." },
      { question: "Why don't you stop insulin when glucose normalizes in DKA?", answer: "DKA treatment goals are twofold: normalize glucose AND resolve ketoacidosis. Glucose often normalizes before the anion gap closes and bicarbonate normalizes. Stopping insulin prematurely allows ketogenesis to continue, worsening acidosis. Instead, add dextrose to IV fluids to prevent hypoglycemia while continuing insulin until the anion gap closes." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Insulin Types Guide", href: "/nclex-rn/medications/insulin-types", type: "medication" },
      { title: "Metformin Guide", href: "/nclex-rn/medications/metformin", type: "medication" },
      { title: "Potassium Lab Values", href: "/nclex-rn/lab-values/potassium", type: "lab-value" },
      { title: "DKA vs HHS Comparison", href: "/nclex-rn/compare/dka-vs-hhs", type: "comparison" },
      { title: "A1C Lab Values", href: "/nclex-rn/lab-values/a1c", type: "lab-value" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "copd",
    contentType: "condition",
    tier: "nclex-rn",
    name: "Chronic Obstructive Pulmonary Disease (COPD)",
    metaTitle: "COPD NCLEX-RN Study Guide: Oxygen Therapy, ABGs & Exacerbation Management (2025)",
    metaDescription: "Master COPD for the NCLEX-RN: oxygen therapy in CO2 retainers, ABG interpretation, exacerbation management, medications, and clinical judgment questions.",
    keywords: "COPD NCLEX-RN, oxygen therapy COPD, COPD exacerbation nursing, ABG interpretation COPD, COPD nursing interventions",
    definition: "COPD is a progressive, largely irreversible obstructive airway disease characterized by persistent airflow limitation. It encompasses chronic bronchitis (productive cough ≥3 months in 2 consecutive years) and emphysema (destruction of alveolar walls with air trapping). Smoking causes >80% of cases. COPD is the third leading cause of death worldwide.",
    pathophysiology: "Chronic exposure to noxious particles (primarily cigarette smoke) activates neutrophils and macrophages, releasing proteases that destroy elastin in alveolar walls (emphysema) and cause mucus gland hyperplasia with goblet cell metaplasia (chronic bronchitis). In emphysema, alveolar destruction reduces surface area for gas exchange and causes air trapping (loss of elastic recoil). In chronic bronchitis, mucus hypersecretion and airway edema narrow the airways. Chronic CO2 retention shifts the respiratory drive from the normal CO2-mediated central chemoreceptor drive to a hypoxic drive via peripheral chemoreceptors — this is why high-flow oxygen can be dangerous.",
    causesRiskFactors: ["Cigarette smoking (>80% of cases)", "Alpha-1 antitrypsin deficiency (genetic)", "Occupational dust and chemical exposure", "Indoor air pollution (biomass fuel)", "Recurrent respiratory infections", "Aging (cumulative exposure)"],
    signsSymptoms: {
      early: ["Progressive dyspnea on exertion", "Chronic productive cough (chronic bronchitis)", "Wheezing", "Prolonged expiratory phase", "Use of pursed-lip breathing"],
      late: ["Barrel chest (hyperinflation)", "Tripod positioning", "Cyanosis", "Cor pulmonale (right-sided heart failure)", "Severe hypoxemia and hypercapnia", "Accessory muscle use", "Diminished breath sounds"]
    },
    assessmentFindings: ["Barrel chest (increased AP diameter)", "Hyperresonance on percussion", "Diminished breath sounds", "Prolonged expiratory phase", "Clubbing of fingers (chronic hypoxia)", "JVD and peripheral edema (cor pulmonale)"],
    labs: [
      { name: "ABG", normalRange: "pH 7.35-7.45, PaCO2 35-45, HCO3 22-26, PaO2 80-100", significance: "Chronic COPD: compensated respiratory acidosis (normal pH, elevated PaCO2, elevated HCO3). Acute exacerbation: uncompensated or partially compensated respiratory acidosis." },
      { name: "SpO2", normalRange: ">95%", significance: "Target SpO2 in COPD: 88-92%. Higher levels may suppress hypoxic respiratory drive in chronic CO2 retainers." }
    ],
    medications: [
      { name: "Albuterol", drugClass: "Short-acting Beta-2 Agonist (SABA)", action: "Rapid bronchodilation via smooth muscle relaxation", sideEffects: "Tachycardia, tremors, hypokalemia", nursingConsiderations: "Rescue inhaler for acute symptoms. If using >2 days/week, controller medication needed. Rinse mouth after use." },
      { name: "Tiotropium (Spiriva)", drugClass: "Long-acting Anticholinergic (LAMA)", action: "Sustained bronchodilation by blocking muscarinic receptors", sideEffects: "Dry mouth, urinary retention, blurred vision", nursingConsiderations: "Maintenance medication (not for acute rescue). Contraindicated in narrow-angle glaucoma. Once-daily dosing improves adherence." },
      { name: "Prednisone", drugClass: "Systemic Corticosteroid", action: "Reduces airway inflammation during acute exacerbation", sideEffects: "Hyperglycemia, immunosuppression, osteoporosis, adrenal suppression", nursingConsiderations: "Short course (5-7 days) for exacerbations. Taper if >7 days to prevent adrenal crisis. Monitor blood glucose." }
    ],
    nursingInterventions: [
      "Administer low-flow oxygen (1-2 L/min via nasal cannula) — target SpO2 88-92%",
      "NEVER administer high-flow oxygen to chronic CO2 retainers — can suppress respiratory drive",
      "Monitor ABGs to assess oxygenation and ventilation during exacerbation",
      "Position in high-Fowler's or tripod position to optimize breathing",
      "Administer bronchodilators as ordered — SABA first, then LAMA if prescribed",
      "Encourage pursed-lip breathing to prevent air trapping and promote CO2 exhalation",
      "Monitor for signs of respiratory failure: increasing confusion, somnolence, rising PaCO2",
      "Educate on smoking cessation — the single most effective intervention to slow disease progression",
      "Coordinate pulmonary rehabilitation referral",
      "Administer annual influenza and pneumococcal vaccinations"
    ],
    complications: ["Acute respiratory failure", "Cor pulmonale (right-sided heart failure)", "Pneumothorax (ruptured bleb)", "Pneumonia", "Respiratory acidosis", "Polycythemia (chronic hypoxia)"],
    patientTeaching: ["Smoking cessation is the #1 priority", "Use pursed-lip breathing during activity", "Take maintenance inhalers daily even when feeling well", "Use rescue inhaler BEFORE activity to prevent dyspnea", "Avoid respiratory irritants (smoke, dust, cold air)", "Maintain adequate nutrition (increased caloric needs from work of breathing)", "Report worsening symptoms early: increased sputum, color change, fever"],
    examPearls: [
      "Low-flow O2 (1-2 L) for chronic COPD — high-flow O2 can suppress hypoxic drive and cause respiratory arrest.",
      "Barrel chest = COPD (air trapping, hyperinflation).",
      "Pursed-lip breathing = prevents premature airway collapse and promotes CO2 exhalation.",
      "Compensated respiratory acidosis = chronic COPD (normal pH, high PaCO2, high HCO3).",
      "Smoking cessation is the ONLY intervention proven to slow COPD progression."
    ],
    commonTrapAnswers: [
      "Placing a COPD client on a 100% non-rebreather mask (too much O2)",
      "Choosing to increase O2 flow when SpO2 is 89% in a chronic COPD client (this may be their target)",
      "Selecting deep breathing exercises instead of pursed-lip breathing for COPD"
    ],
    practiceQuestions: [
      { question: "A client with COPD is admitted with an acute exacerbation. SpO2 is 86% on room air. What is the appropriate oxygen therapy?", options: ["High-flow oxygen via non-rebreather mask at 15 L/min", "Low-flow oxygen via nasal cannula at 1-2 L/min", "No oxygen — wait for ABG results first", "Bilevel positive airway pressure (BiPAP) immediately"], correctIndex: 1, rationale: "Chronic COPD patients who retain CO2 have shifted to a hypoxic respiratory drive. High-flow oxygen can suppress this drive, causing hypoventilation, CO2 narcosis, and respiratory arrest. Start with low-flow oxygen (1-2 L/min) targeting SpO2 88-92%. Monitor ABGs to guide oxygen titration.", isFree: true },
      { question: "A COPD client's ABG shows: pH 7.36, PaCO2 56 mmHg, HCO3 32 mEq/L. How does the nurse interpret this?", options: ["Uncompensated respiratory acidosis", "Fully compensated respiratory acidosis", "Partially compensated metabolic alkalosis", "Normal ABG"], correctIndex: 1, rationale: "pH is within normal range (7.35-7.45), PaCO2 is elevated (>45, respiratory acidosis), and HCO3 is elevated (>26, metabolic compensation). Since the pH is normal but the values are abnormal, this is fully compensated respiratory acidosis — the typical ABG pattern in chronic, stable COPD. The kidneys have retained bicarbonate to buffer the chronic CO2 retention.", isFree: true },
      { question: "A nurse is teaching breathing techniques to a COPD client. Which technique should be emphasized?", options: ["Deep diaphragmatic breathing with quick exhalation", "Pursed-lip breathing with prolonged exhalation", "Rapid shallow breathing to conserve energy", "Breath-holding exercises to improve lung capacity"], correctIndex: 1, rationale: "Pursed-lip breathing creates back pressure that keeps small airways open during exhalation, preventing premature airway collapse (which is the fundamental problem in COPD). Prolonged exhalation promotes CO2 removal. This technique improves gas exchange and reduces air trapping.", isFree: true }
    ],
    faqs: [
      { question: "Why is high-flow oxygen dangerous in COPD?", answer: "Chronic COPD patients with CO2 retention have adapted their respiratory drive. Instead of the normal CO2-mediated drive (central chemoreceptors), they rely on low oxygen levels to stimulate breathing (peripheral chemoreceptors — the hypoxic drive). If you give high-flow oxygen, PaO2 rises, the hypoxic drive is removed, breathing slows or stops, CO2 accumulates further, and the patient develops CO2 narcosis and respiratory failure." },
      { question: "What is cor pulmonale and why does it occur in COPD?", answer: "Cor pulmonale is right-sided heart failure caused by pulmonary hypertension. In COPD, chronic hypoxia causes pulmonary vasoconstriction (hypoxic pulmonary vasoconstriction), increasing resistance in the pulmonary vasculature. The right ventricle must pump against this increased resistance, eventually leading to right ventricular hypertrophy and failure. Symptoms include JVD, peripheral edema, and hepatomegaly." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "ABG Lab Values", href: "/nclex-rn/lab-values/abgs", type: "lab-value" },
      { title: "Pneumonia Guide", href: "/nclex-rn/conditions/pneumonia", type: "condition" },
      { title: "Adult Health Review", href: "/nclex-rn/adult-health", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "pneumonia",
    contentType: "condition", tier: "nclex-rn", name: "Pneumonia",
    metaTitle: "Pneumonia NCLEX-RN Study Guide: Assessment, Treatment & Nursing Care (2025)",
    metaDescription: "Complete pneumonia guide for NCLEX-RN: community-acquired vs hospital-acquired, assessment findings, antibiotics, respiratory nursing interventions, and practice questions.",
    keywords: "pneumonia NCLEX-RN, community-acquired pneumonia, hospital-acquired pneumonia, pneumonia nursing interventions, pneumonia assessment",
    definition: "Pneumonia is an acute infection of the lung parenchyma causing inflammation and consolidation of the alveoli with exudate. Community-Acquired Pneumonia (CAP) develops outside of healthcare settings. Hospital-Acquired Pneumonia (HAP) develops ≥48 hours after hospital admission. Ventilator-Associated Pneumonia (VAP) develops ≥48 hours after endotracheal intubation.",
    pathophysiology: "Pathogens enter the lower respiratory tract via aspiration of oropharyngeal secretions, inhalation of aerosolized droplets, or hematogenous spread. Bacteria (Streptococcus pneumoniae is #1 cause of CAP) or viruses trigger an inflammatory response. Alveoli fill with exudate (fluid, WBCs, debris), impairing gas exchange (ventilation-perfusion mismatch). Consolidation reduces lung compliance and increases the work of breathing.",
    causesRiskFactors: ["Age >65 years", "Smoking", "COPD or chronic lung disease", "Immunosuppression", "Aspiration risk (dysphagia, sedation, impaired consciousness)", "Mechanical ventilation", "Recent hospitalization", "Poor oral hygiene"],
    signsSymptoms: { early: ["Productive cough (purulent sputum)", "Fever and chills", "Pleuritic chest pain", "Tachypnea", "Dyspnea"], late: ["High fever >39°C", "Severe hypoxemia", "Altered mental status (especially elderly)", "Sepsis signs (tachycardia, hypotension)", "Cyanosis"] },
    assessmentFindings: ["Crackles (rales) over affected area", "Bronchial breath sounds over consolidation", "Dullness to percussion", "Increased tactile fremitus", "Egophony (E-to-A changes)"],
    labs: [
      { name: "WBC", normalRange: "5,000-10,000/μL", significance: "Elevated WBC (leukocytosis) indicates infection. Very high WBC (>15,000) suggests bacterial pneumonia. Low WBC (leukopenia) in pneumonia suggests overwhelming infection or sepsis — poor prognostic sign." },
      { name: "Sputum Culture", normalRange: "No pathogenic organisms", significance: "Identifies causative organism and guides antibiotic selection. Collect BEFORE starting antibiotics. Gram stain provides preliminary identification." }
    ],
    medications: [
      { name: "Azithromycin", drugClass: "Macrolide Antibiotic", action: "Inhibits bacterial protein synthesis by binding 50S ribosomal subunit", sideEffects: "GI upset, QT prolongation, hepatotoxicity", nursingConsiderations: "First-line for outpatient CAP. Take on empty stomach. Complete full course even if symptoms improve." },
      { name: "Ceftriaxone", drugClass: "Third-generation Cephalosporin", action: "Inhibits bacterial cell wall synthesis", sideEffects: "Allergic reactions (cross-reactivity with penicillin ~1-2%), C. difficile, biliary sludging", nursingConsiderations: "First-line IV antibiotic for inpatient CAP. Assess for penicillin allergy. Monitor for C. difficile diarrhea." }
    ],
    nursingInterventions: [
      "Monitor respiratory status: rate, depth, effort, SpO2, lung sounds",
      "Administer oxygen to maintain SpO2 >94% (unless COPD)",
      "Position in semi-Fowler's or high-Fowler's to optimize lung expansion",
      "Encourage incentive spirometry every 1-2 hours while awake",
      "Administer antibiotics promptly — early antibiotic administration improves outcomes",
      "Obtain sputum culture BEFORE first antibiotic dose",
      "Encourage adequate fluid intake (2-3 L/day) to thin secretions",
      "Turn, cough, and deep breathe every 2 hours",
      "Monitor for sepsis: fever, tachycardia, hypotension, altered mental status",
      "Implement VAP prevention bundle for intubated clients"
    ],
    complications: ["Sepsis and septic shock", "Pleural effusion / empyema", "Lung abscess", "Respiratory failure / ARDS", "Bacteremia"],
    patientTeaching: ["Complete the full antibiotic course", "Get pneumococcal and annual influenza vaccinations", "Practice good hand hygiene", "Quit smoking", "Report worsening symptoms: increasing dyspnea, high fever, chest pain"],
    examPearls: [
      "Obtain sputum culture BEFORE starting antibiotics — timing matters for accurate results.",
      "Elderly clients may present atypically: confusion is often the first sign of pneumonia in the elderly.",
      "VAP prevention: elevate HOB 30-45°, oral care with chlorhexidine, daily sedation vacations, early mobility.",
      "Crackles + fever + productive cough + dullness to percussion = pneumonia."
    ],
    commonTrapAnswers: [
      "Starting antibiotics before obtaining the sputum culture",
      "Choosing flat positioning for a client with pneumonia and dyspnea",
      "Restricting fluids (should encourage fluids to thin secretions)"
    ],
    practiceQuestions: [
      { question: "A nurse is caring for a client admitted with community-acquired pneumonia. An antibiotic is ordered. What should the nurse do first?", options: ["Administer the antibiotic immediately", "Obtain a sputum culture specimen", "Check the client's allergy history", "Review the chest X-ray results"], correctIndex: 1, rationale: "The sputum culture should be obtained BEFORE the first antibiotic dose to ensure accurate identification of the causative organism. Antibiotics can kill bacteria and produce false-negative culture results. However, obtaining the culture should not significantly delay antibiotic administration — both should happen within a short timeframe.", isFree: true },
      { question: "An 82-year-old client is confused and lethargic but afebrile. WBC is 14,200. Chest X-ray shows right lower lobe infiltrate. What is the most likely diagnosis?", options: ["Stroke", "Pneumonia", "Urinary tract infection", "Medication side effect"], correctIndex: 1, rationale: "Elderly patients often present atypically with pneumonia. Instead of classic fever, cough, and chest pain, they may present primarily with confusion and altered mental status. The elevated WBC and chest X-ray infiltrate confirm pneumonia. On the NCLEX-RN, always consider pneumonia in an elderly patient with acute confusion, even without typical respiratory symptoms.", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between community-acquired and hospital-acquired pneumonia?", answer: "CAP develops outside healthcare settings and is typically caused by S. pneumoniae, H. influenzae, or atypical organisms. HAP develops ≥48 hours after admission and is often caused by more resistant organisms (MRSA, Pseudomonas). HAP requires broader-spectrum antibiotics and carries higher mortality due to resistant organisms and patient comorbidities." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "COPD Guide", href: "/nclex-rn/conditions/copd", type: "condition" },
      { title: "Sepsis Guide", href: "/nclex-rn/conditions/sepsis", type: "condition" },
      { title: "Viral vs Bacterial Pneumonia", href: "/nclex-rn/compare/viral-vs-bacterial-pneumonia", type: "comparison" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "sepsis",
    contentType: "condition", tier: "nclex-rn", name: "Sepsis",
    metaTitle: "Sepsis NCLEX-RN Study Guide: Early Recognition, Bundles & Nursing Interventions (2025)",
    metaDescription: "Master sepsis for the NCLEX-RN: SIRS criteria, qSOFA, Surviving Sepsis bundles, fluid resuscitation, vasopressor management, and clinical judgment questions.",
    keywords: "sepsis NCLEX-RN, sepsis nursing, SIRS criteria, qSOFA, Surviving Sepsis Campaign, sepsis bundles, septic shock nursing",
    definition: "Sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection. Septic shock is sepsis with persistent hypotension requiring vasopressors and serum lactate >2 mmol/L despite adequate fluid resuscitation. Sepsis is the leading cause of death in hospitalized patients and requires early recognition and aggressive treatment.",
    pathophysiology: "Infection triggers a massive systemic inflammatory response. Pro-inflammatory cytokines (TNF-α, IL-1, IL-6) cause widespread vasodilation, increased capillary permeability, and microthrombi formation. Vasodilation leads to distributive (warm) shock with hypotension. Capillary leak causes third-spacing and tissue edema. Microthrombi impair tissue perfusion, causing organ ischemia. As sepsis progresses, organs fail sequentially: coagulopathy (DIC), acute kidney injury, ARDS, hepatic failure, and cardiovascular collapse.",
    causesRiskFactors: ["Pneumonia (#1 source)", "Urinary tract infections", "Abdominal infections", "Skin/soft tissue infections", "Age >65 years", "Immunosuppression", "Chronic diseases (diabetes, cancer, CKD)", "Indwelling devices (central lines, Foley catheters)", "Recent surgery"],
    signsSymptoms: { early: ["Fever >38°C or hypothermia <36°C", "Tachycardia >90 bpm", "Tachypnea >20/min", "Altered mental status (confusion, agitation)", "Warm, flushed skin (warm shock)"], late: ["Hypotension (MAP <65 mmHg)", "Oliguria (<0.5 mL/kg/hr)", "Mottled, cool extremities (cold shock)", "Lactate >4 mmol/L", "Coagulopathy (DIC)", "Multi-organ failure"] },
    assessmentFindings: ["qSOFA: altered mental status, SBP ≤100, respiratory rate ≥22 (≥2 = high risk)", "SIRS criteria: temp >38 or <36, HR >90, RR >20, WBC >12,000 or <4,000", "Elevated lactate indicates tissue hypoperfusion", "Positive blood cultures identify causative organism"],
    labs: [
      { name: "Lactate", normalRange: "<2.0 mmol/L", significance: "Elevated lactate indicates tissue hypoperfusion and anaerobic metabolism. Lactate >4 mmol/L = septic shock criteria. Lactate clearance (>10% reduction in 6 hours) is a prognostic indicator." },
      { name: "WBC", normalRange: "5,000-10,000/μL", significance: "May be elevated (>12,000 — leukocytosis) or critically low (<4,000 — leukopenia). Leukopenia in sepsis indicates bone marrow suppression and carries poor prognosis." },
      { name: "Procalcitonin", normalRange: "<0.1 ng/mL", significance: "Biomarker for bacterial infection. Levels >2 ng/mL strongly suggest bacterial sepsis. Useful for differentiating bacterial from viral infection and guiding antibiotic therapy duration." }
    ],
    medications: [
      { name: "Broad-spectrum Antibiotics", drugClass: "Anti-infective", action: "Empiric coverage of likely pathogens until cultures identify the organism", sideEffects: "Allergic reactions, C. difficile, nephrotoxicity/ototoxicity (aminoglycosides)", nursingConsiderations: "Administer within 1 hour of sepsis recognition (each hour delay increases mortality 7%). Obtain blood cultures BEFORE first dose. De-escalate to targeted therapy when cultures return." },
      { name: "Norepinephrine", drugClass: "Vasopressor", action: "Alpha-1 agonist causing vasoconstriction to raise MAP", sideEffects: "Tissue necrosis with extravasation, hypertension, dysrhythmias", nursingConsiderations: "First-line vasopressor for septic shock. Administer via central line. Target MAP ≥65 mmHg. Monitor for extravasation. Titrate to effect." },
      { name: "Normal Saline (0.9%)", drugClass: "Isotonic Crystalloid", action: "Intravascular volume expansion", sideEffects: "Fluid overload, hyperchloremic acidosis", nursingConsiderations: "30 mL/kg IV bolus within first 3 hours for sepsis-induced hypoperfusion. Reassess fluid responsiveness after each bolus. Monitor for fluid overload (crackles, JVD)." }
    ],
    nursingInterventions: [
      "Recognize sepsis early: screen using qSOFA and SIRS criteria",
      "Obtain blood cultures (2 sets from different sites) BEFORE antibiotics",
      "Administer broad-spectrum IV antibiotics within 1 hour of recognition",
      "Initiate 30 mL/kg crystalloid bolus for hypotension or lactate ≥4 mmol/L",
      "Monitor MAP — target ≥65 mmHg. Initiate vasopressors if MAP remains low after fluid resuscitation",
      "Monitor lactate every 2-4 hours — target >10% clearance as a resuscitation goal",
      "Monitor strict I&O — target urine output ≥0.5 mL/kg/hr",
      "Assess for source control: drain abscesses, remove infected devices, debride wounds",
      "Monitor for multi-organ dysfunction: renal function, coagulation, liver function, mental status",
      "Reassess fluid responsiveness — passive leg raise, pulse pressure variation"
    ],
    complications: ["Septic shock", "Multi-organ dysfunction syndrome (MODS)", "DIC", "ARDS", "Acute kidney injury", "Death (mortality 25-50% in septic shock)"],
    patientTeaching: ["Recognize early signs of infection: fever, chills, confusion", "Seek medical attention promptly for signs of infection", "Complete prescribed antibiotic courses", "Practice good hand hygiene and wound care", "Maintain vaccinations"],
    examPearls: [
      "Administer antibiotics within 1 HOUR of sepsis recognition — each hour delay increases mortality ~7%.",
      "Blood cultures BEFORE antibiotics — but do not delay antibiotics for cultures.",
      "Lactate >4 mmol/L = septic shock criteria (even if blood pressure is initially normal).",
      "First-line vasopressor = norepinephrine. Target MAP ≥65 mmHg.",
      "30 mL/kg crystalloid bolus within first 3 hours for sepsis-induced hypoperfusion."
    ],
    commonTrapAnswers: [
      "Delaying antibiotics to wait for culture results (administer within 1 hour)",
      "Choosing a maintenance fluid rate instead of bolus resuscitation in septic shock",
      "Administering vasopressors before adequate fluid resuscitation"
    ],
    practiceQuestions: [
      { question: "A nurse suspects sepsis in a client with pneumonia: temperature 39.2°C, HR 118, BP 86/52, RR 26, lactate 4.8 mmol/L. What are the priority interventions? (Select all that apply approaches are common in NGN.)", options: ["Draw blood cultures from two sites", "Administer broad-spectrum IV antibiotics within 1 hour", "Initiate 30 mL/kg IV crystalloid bolus", "Wait for culture results before starting antibiotics", "Obtain a chest X-ray to confirm pneumonia diagnosis"], correctIndex: 0, rationale: "The first three options are all priority interventions per the Surviving Sepsis Campaign 1-hour bundle: (1) Draw blood cultures, (2) Administer antibiotics within 1 hour, (3) Begin IV fluid resuscitation with 30 mL/kg crystalloid. Never delay antibiotics for culture results. Chest X-ray is appropriate but not a priority over resuscitation.", isFree: true },
      { question: "A septic client has received 2 liters of normal saline. MAP remains 58 mmHg. What should the nurse anticipate?", options: ["Additional 2 liters of crystalloid bolus", "Initiation of norepinephrine via central line", "Oral fluid supplementation", "Observation for 4 more hours"], correctIndex: 1, rationale: "After adequate fluid resuscitation (30 mL/kg), if MAP remains <65 mmHg, vasopressor therapy is indicated. Norepinephrine is the first-line vasopressor for septic shock, administered via central line. Additional fluids may be given, but vasopressors should not be delayed when fluids alone are insufficient to maintain perfusion.", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between SIRS, sepsis, and septic shock?", answer: "SIRS (Systemic Inflammatory Response Syndrome) is a clinical syndrome with ≥2 criteria: temp >38 or <36°C, HR >90, RR >20, WBC >12,000 or <4,000. Sepsis is SIRS caused by a confirmed or suspected infection with evidence of organ dysfunction. Septic shock is sepsis with persistent hypotension requiring vasopressors AND lactate >2 mmol/L despite adequate fluid resuscitation." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Pneumonia Guide", href: "/nclex-rn/conditions/pneumonia", type: "condition" },
      { title: "Prioritization & Delegation", href: "/nclex-rn/prioritization-and-delegation", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "hypertension", contentType: "condition", tier: "nclex-rn", name: "Hypertension",
    metaTitle: "Hypertension NCLEX-RN Study Guide: Medications, Crisis Management & Nursing Care (2025)",
    metaDescription: "Master hypertension for the NCLEX-RN: classification, medication management, hypertensive emergency, nursing interventions, and clinical judgment questions.",
    keywords: "hypertension NCLEX-RN, antihypertensive medications, hypertensive emergency, blood pressure nursing, HTN nursing interventions",
    definition: "Hypertension is a sustained elevation of systemic arterial blood pressure ≥130/80 mmHg (ACC/AHA 2017). Primary (essential) hypertension accounts for 90-95% of cases with no identifiable cause. Secondary hypertension results from an underlying condition. Hypertensive emergency is BP >180/120 with target organ damage requiring immediate intervention.",
    pathophysiology: "Chronic elevation of systemic vascular resistance damages endothelial lining, promoting atherosclerosis. RAAS activation causes vasoconstriction and sodium/water retention. Sustained pressure overload causes left ventricular hypertrophy, eventually leading to diastolic dysfunction and heart failure. End-organ damage affects the heart (LVH, HF, CAD), brain (stroke), kidneys (nephrosclerosis), eyes (retinopathy), and peripheral vasculature.",
    causesRiskFactors: ["Family history", "High sodium diet", "Obesity (BMI >30)", "Sedentary lifestyle", "Smoking", "Excessive alcohol", "Age >55", "African American descent", "Diabetes", "Chronic kidney disease"],
    signsSymptoms: { early: ["Usually asymptomatic ('silent killer')", "Mild occipital headache (morning)", "Fatigue", "Elevated BP on routine screening"], late: ["Severe headache with visual changes", "Chest pain/dyspnea (cardiac damage)", "Epistaxis", "Altered mental status (hypertensive encephalopathy)", "Hematuria (renal damage)"] },
    assessmentFindings: ["Elevated BP on ≥2 separate occasions", "S4 heart sound (LVH)", "Retinal changes on fundoscopy", "Bruit over renal or carotid arteries"],
    labs: [
      { name: "BMP", normalRange: "Cr 0.7-1.3 mg/dL", significance: "Elevated creatinine suggests hypertensive nephropathy. Monitor renal function in all hypertensive patients, especially those on ACE inhibitors/ARBs." },
      { name: "Lipid Panel", normalRange: "LDL <100 mg/dL", significance: "Dyslipidemia often coexists. Cardiovascular risk assessment guides treatment intensity." }
    ],
    medications: [
      { name: "Lisinopril", drugClass: "ACE Inhibitor", action: "Blocks RAAS, reduces preload/afterload", sideEffects: "Dry cough, hyperkalemia, angioedema", nursingConsiderations: "Monitor K+ and renal function. Contraindicated in pregnancy. First-line for HTN with diabetes or HF." },
      { name: "Amlodipine", drugClass: "Calcium Channel Blocker", action: "Relaxes vascular smooth muscle", sideEffects: "Peripheral edema, dizziness, flushing", nursingConsiderations: "No grapefruit juice. No K+ monitoring needed. First-line for HTN in African Americans." },
      { name: "Hydrochlorothiazide", drugClass: "Thiazide Diuretic", action: "Reduces blood volume by inhibiting Na+ reabsorption in distal tubule", sideEffects: "Hypokalemia, hyperglycemia, hyperuricemia", nursingConsiderations: "Administer in morning. Monitor K+. First-line for uncomplicated HTN." },
      { name: "Metoprolol", drugClass: "Beta-Blocker", action: "Reduces HR and cardiac output", sideEffects: "Bradycardia, fatigue, bronchospasm", nursingConsiderations: "Check HR before giving, hold if <60. Never stop abruptly. Avoid in asthma/COPD." }
    ],
    nursingInterventions: [
      "Measure BP in both arms at initial visit using correct cuff size",
      "Educate on medication adherence — do not skip doses",
      "Teach orthostatic precautions — rise slowly",
      "Monitor for hypertensive crisis: severe headache, visual changes, chest pain",
      "Encourage DASH diet and sodium restriction (<2,300 mg/day)",
      "Promote regular aerobic exercise (150 min/week)",
      "Teach to avoid OTC decongestants and NSAIDs (can elevate BP)",
      "Home BP monitoring education"
    ],
    complications: ["Left ventricular hypertrophy", "Heart failure", "Coronary artery disease", "Stroke", "Chronic kidney disease", "Retinopathy", "Aortic dissection"],
    patientTeaching: ["Take medications at the same time daily", "Do not stop medications because BP is 'normal' — it is normal because of the medications", "Follow DASH diet", "Reduce sodium, increase potassium-rich foods", "Limit alcohol, quit smoking", "Monitor BP at home and keep a log"],
    examPearls: [
      "Hypertension is the 'silent killer' — most patients are asymptomatic until organ damage occurs.",
      "Stage 1 HTN per ACC/AHA: 130-139/80-89 mmHg. Stage 2: ≥140/90 mmHg.",
      "ACE inhibitors: dry cough → switch to ARB. Pregnancy → absolute contraindication.",
      "Thiazide diuretics cause hypoKALemia. ACE inhibitors cause hyperKALemia.",
      "Hypertensive emergency: IV labetalol or nitroprusside. Reduce MAP by 25% in first hour — not to normal."
    ],
    commonTrapAnswers: [
      "Reducing BP to normal immediately in hypertensive emergency (reduce by 25% in first hour, not to normal)",
      "Choosing to stop antihypertensive when BP normalizes",
      "Selecting a non-selective beta-blocker (propranolol) for a client with asthma"
    ],
    practiceQuestions: [
      { question: "A client taking hydrochlorothiazide reports muscle cramps, weakness, and irregular heartbeat. Which lab should the nurse check first?", options: ["Serum calcium", "Serum potassium", "Serum sodium", "Blood glucose"], correctIndex: 1, rationale: "These symptoms (muscle cramps, weakness, irregular heartbeat) are classic manifestations of hypokalemia. Thiazide diuretics cause potassium wasting. Hypokalemia can cause dangerous cardiac arrhythmias and requires immediate assessment and intervention.", isFree: true },
      { question: "A client's BP is 210/130 mmHg with severe headache, confusion, and visual changes. What type of emergency is this?", options: ["Hypertensive urgency", "Hypertensive emergency", "Primary hypertension", "White coat hypertension"], correctIndex: 1, rationale: "BP >180/120 WITH target organ damage (neurological symptoms: headache, confusion, visual changes) constitutes hypertensive emergency requiring immediate IV antihypertensive therapy and ICU admission. Hypertensive urgency is BP >180/120 WITHOUT acute organ damage. The goal is to reduce MAP by 25% in the first hour — not to normal, which could cause cerebral hypoperfusion.", isFree: true }
    ],
    faqs: [
      { question: "Why shouldn't you lower BP too quickly in hypertensive emergency?", answer: "The brain and other organs have adapted to high perfusion pressures. Rapidly lowering BP to normal can cause cerebral hypoperfusion, ischemic stroke, or MI. The guideline is to lower MAP by no more than 25% in the first hour, then gradually to 160/100 over 2-6 hours, then to normal over 24-48 hours." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Lisinopril Guide", href: "/nclex-rn/medications/lisinopril", type: "medication" },
      { title: "Metoprolol Guide", href: "/nclex-rn/medications/metoprolol", type: "medication" },
      { title: "Heart Failure Guide", href: "/nclex-rn/conditions/heart-failure", type: "condition" },
      { title: "Stroke Guide", href: "/nclex-rn/conditions/stroke", type: "condition" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "mi-acs", contentType: "condition", tier: "nclex-rn", name: "Myocardial Infarction / Acute Coronary Syndrome",
    metaTitle: "MI & ACS NCLEX-RN Study Guide: STEMI, NSTEMI & Emergency Nursing (2025)",
    metaDescription: "Master MI and ACS for the NCLEX-RN: STEMI vs NSTEMI, thrombolytic therapy, MONA protocol, post-MI care, and clinical judgment practice questions.",
    keywords: "myocardial infarction NCLEX-RN, ACS nursing, STEMI NSTEMI, thrombolytic therapy nursing, MONA protocol, MI nursing interventions",
    definition: "Acute Coronary Syndrome (ACS) encompasses conditions caused by acute reduction in coronary blood flow: Unstable Angina (ischemia without necrosis, normal troponin), NSTEMI (subendocardial infarction, elevated troponin, no ST elevation), and STEMI (transmural infarction, elevated troponin, ST elevation on ECG). STEMI is a medical emergency requiring reperfusion within 90 minutes (PCI) or 30 minutes (thrombolytics) from first medical contact.",
    pathophysiology: "Atherosclerotic plaque rupture exposes subendothelial collagen, triggering platelet aggregation and thrombus formation. The thrombus partially or completely occludes the coronary artery. Complete occlusion (STEMI) causes transmural ischemia progressing to infarction within 20-40 minutes. Cell death begins in the subendocardium and extends transmurally over 4-6 hours ('time is muscle'). Infarcted myocardium loses contractility, potentially causing heart failure, cardiogenic shock, or lethal arrhythmias.",
    causesRiskFactors: ["Atherosclerosis", "Hypertension", "Hyperlipidemia", "Smoking", "Diabetes", "Obesity", "Family history of premature CAD", "Sedentary lifestyle", "Cocaine use (coronary vasospasm)"],
    signsSymptoms: { early: ["Chest pain: crushing, substernal, radiating to left arm/jaw/back", "Diaphoresis", "Dyspnea", "Nausea/vomiting", "Anxiety / 'feeling of impending doom'"], late: ["Cardiogenic shock (hypotension, tachycardia, cool clammy skin)", "Heart failure (crackles, JVD, S3 gallop)", "Dysrhythmias (PVCs, VT, VF)", "Papillary muscle rupture (new systolic murmur)"] },
    assessmentFindings: ["ECG changes: ST elevation (STEMI), ST depression/T-wave inversion (NSTEMI)", "Elevated cardiac biomarkers (troponin I or T)", "New wall motion abnormalities on echocardiogram"],
    labs: [
      { name: "Troponin I/T", normalRange: "<0.04 ng/mL", significance: "Gold standard biomarker for myocardial necrosis. Rises within 3-6 hours, peaks 12-24 hours. Serial troponins (0, 3, 6 hours) confirm or rule out MI." },
      { name: "CK-MB", normalRange: "<5 ng/mL", significance: "Rises within 4-6 hours, peaks 12-24 hours, returns to normal in 48-72 hours. Useful for detecting reinfarction." }
    ],
    medications: [
      { name: "Aspirin", drugClass: "Antiplatelet", action: "Irreversibly inhibits COX-1, preventing thromboxane A2 synthesis and platelet aggregation", sideEffects: "GI bleeding, tinnitus", nursingConsiderations: "Administer 325 mg chewed immediately on suspicion of ACS. Contraindicated in aspirin allergy or active bleeding." },
      { name: "Nitroglycerin", drugClass: "Nitrate", action: "Venous dilation (reduces preload) and coronary vasodilation", sideEffects: "Hypotension, headache, reflex tachycardia", nursingConsiderations: "SL q5 min x3, then IV if pain persists. Monitor BP — hold if SBP <90. Contraindicated within 24-48 hrs of PDE5 inhibitors (sildenafil)." },
      { name: "Morphine", drugClass: "Opioid Analgesic", action: "Pain relief, reduces preload (venodilation), decreases oxygen demand", sideEffects: "Respiratory depression, hypotension, bradycardia", nursingConsiderations: "Administer after nitroglycerin if pain persists. Monitor RR — hold if <12. Have naloxone available." },
      { name: "Alteplase (tPA)", drugClass: "Thrombolytic", action: "Activates plasminogen to plasmin, dissolving fibrin clot", sideEffects: "Hemorrhage (including intracranial hemorrhage)", nursingConsiderations: "For STEMI when PCI unavailable within 90 min. Door-to-needle time ≤30 min. Assess for contraindications: recent surgery, active bleeding, stroke history, uncontrolled HTN." }
    ],
    nursingInterventions: [
      "Obtain 12-lead ECG within 10 minutes of presentation",
      "Administer MONA: Morphine, Oxygen (if SpO2 <94%), Nitroglycerin, Aspirin",
      "Establish IV access — at least two large-bore IVs",
      "Prepare for cardiac catheterization / PCI (door-to-balloon ≤90 minutes for STEMI)",
      "Continuous cardiac monitoring — watch for reperfusion arrhythmias",
      "Serial troponin levels (0, 3, 6 hours)",
      "Monitor for complications: heart failure, cardiogenic shock, dysrhythmias",
      "Maintain bed rest during acute phase",
      "Provide calm, supportive environment to reduce anxiety and oxygen demand"
    ],
    complications: ["Cardiogenic shock", "Heart failure", "Ventricular dysrhythmias (VT/VF)", "Papillary muscle rupture (mitral regurgitation)", "Ventricular septal rupture", "Ventricular aneurysm", "Pericarditis (Dressler syndrome 1-8 weeks post-MI)"],
    patientTeaching: ["Take daily aspirin and medications as prescribed", "Cardiac rehabilitation participation", "Activity modification — gradual return to activity", "Recognize warning signs: chest pain, SOB, diaphoresis — call 911", "Risk factor modification: diet, exercise, smoking cessation, stress management", "Sexual activity can resume 4-6 weeks post-MI if medically cleared"],
    examPearls: [
      "MONA: Morphine, Oxygen (if SpO2 <94%), Nitroglycerin, Aspirin. Aspirin is given FIRST.",
      "Door-to-balloon ≤90 min (PCI), Door-to-needle ≤30 min (thrombolytics).",
      "Nitroglycerin contraindicated if SBP <90 or within 24-48 hrs of PDE5 inhibitors.",
      "Troponin is the gold standard biomarker for myocardial necrosis.",
      "STEMI = ST elevation + positive troponin = emergent reperfusion."
    ],
    commonTrapAnswers: [
      "Giving nitroglycerin to a client who took sildenafil (Viagra) within 24 hours — causes severe hypotension",
      "Choosing to wait for troponin results before treating a suspected MI",
      "Delaying aspirin administration"
    ],
    practiceQuestions: [
      { question: "A client presents with crushing chest pain, diaphoresis, and ST elevation on ECG. Aspirin 325 mg has been given. BP is 140/90. What is the next priority intervention?", options: ["Obtain serial troponin levels", "Administer nitroglycerin sublingual", "Prepare for cardiac catheterization", "Apply oxygen via nasal cannula at 6 L/min"], correctIndex: 1, rationale: "After aspirin, nitroglycerin is the next priority to relieve chest pain and reduce myocardial oxygen demand through coronary vasodilation and preload reduction. BP is adequate (140/90). While cardiac catheterization is the definitive treatment, nitroglycerin provides immediate symptom relief. Oxygen is only indicated if SpO2 <94%.", isFree: true },
      { question: "A post-MI client develops a new systolic murmur, hypotension, and pulmonary edema on Day 3. What complication should the nurse suspect?", options: ["Dressler syndrome", "Papillary muscle rupture", "Ventricular aneurysm", "Coronary reocclusion"], correctIndex: 1, rationale: "A new systolic murmur + hemodynamic instability + pulmonary edema 2-7 days post-MI strongly suggests papillary muscle rupture causing acute mitral regurgitation. This is a surgical emergency. Dressler syndrome presents with pericarditis (friction rub, chest pain), not a murmur. Ventricular aneurysm develops later.", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between STEMI and NSTEMI?", answer: "STEMI shows ST segment elevation on ECG indicating complete coronary artery occlusion and transmural infarction — it requires emergent reperfusion (PCI or thrombolytics). NSTEMI shows ST depression or T-wave inversion indicating partial occlusion and subendocardial injury — it is managed medically with anticoagulation and risk stratification, with PCI within 24-72 hours." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Heart Failure Guide", href: "/nclex-rn/conditions/heart-failure", type: "condition" },
      { title: "Troponin Lab Values", href: "/nclex-rn/lab-values/troponin", type: "lab-value" },
      { title: "Heparin Guide", href: "/nclex-rn/medications/heparin", type: "medication" },
      { title: "Stable vs Unstable Angina", href: "/nclex-rn/compare/stable-vs-unstable-angina", type: "comparison" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "stroke", contentType: "condition", tier: "nclex-rn", name: "Stroke (CVA)",
    metaTitle: "Stroke NCLEX-RN Study Guide: Ischemic vs Hemorrhagic, tPA & Nursing Interventions (2025)",
    metaDescription: "Master stroke for the NCLEX-RN: ischemic vs hemorrhagic stroke, tPA criteria, NIH Stroke Scale, ICP management, and clinical judgment practice questions.",
    keywords: "stroke NCLEX-RN, ischemic stroke nursing, hemorrhagic stroke, tPA nursing, NIH Stroke Scale, stroke nursing interventions",
    definition: "Stroke (cerebrovascular accident) is the sudden interruption of cerebral blood flow causing neurological deficits. Ischemic stroke (87% of cases) results from thrombotic or embolic occlusion of a cerebral artery. Hemorrhagic stroke (13%) results from rupture of a cerebral vessel. Transient ischemic attack (TIA) resolves within 24 hours without permanent damage but is a warning sign.",
    pathophysiology: "In ischemic stroke, arterial occlusion deprives brain tissue of oxygen and glucose. The ischemic core dies within minutes, but the surrounding penumbra (at-risk tissue) can be salvaged with timely reperfusion — the basis for the tPA treatment window. In hemorrhagic stroke, vessel rupture causes direct tissue destruction and increased intracranial pressure (ICP) from expanding hematoma. Rising ICP compresses brain tissue and reduces cerebral perfusion pressure (CPP).",
    causesRiskFactors: ["Atrial fibrillation (#1 cause of embolic stroke)", "Hypertension (#1 modifiable risk factor)", "Atherosclerosis", "Diabetes", "Smoking", "Hyperlipidemia", "Previous TIA/stroke", "Carotid stenosis", "Cocaine/amphetamine use"],
    signsSymptoms: { early: ["Sudden facial drooping (unilateral)", "Arm weakness/drift (unilateral)", "Speech difficulty (slurred or aphasia)", "Sudden severe headache ('worst headache of my life' — hemorrhagic)", "Visual disturbances"], late: ["Increasing ICP: Cushing triad (hypertension, bradycardia, irregular respirations)", "Altered level of consciousness", "Contralateral hemiplegia", "Homonymous hemianopia", "Dysphagia"] },
    assessmentFindings: ["BE FAST: Balance, Eyes, Face, Arms, Speech, Time", "NIH Stroke Scale score", "Unilateral weakness or paralysis", "Aphasia (Broca's = expressive, Wernicke's = receptive)", "Neglect syndrome (unilateral spatial neglect)"],
    labs: [
      { name: "CT Scan (non-contrast)", normalRange: "No hemorrhage or mass", significance: "FIRST diagnostic test — must rule out hemorrhagic stroke before considering tPA. Ischemic stroke may not show on CT for 6-12 hours." },
      { name: "Coagulation Studies", normalRange: "INR <1.7 for tPA eligibility", significance: "Must be checked before tPA administration. INR >1.7 is a contraindication to thrombolytic therapy." }
    ],
    medications: [
      { name: "Alteplase (tPA)", drugClass: "Thrombolytic", action: "Dissolves clot to restore cerebral blood flow", sideEffects: "Intracranial hemorrhage (most feared complication)", nursingConsiderations: "Window: within 4.5 hours of symptom onset. Contraindicated in hemorrhagic stroke, recent surgery, active bleeding, INR >1.7. Monitor neuro checks q15min during infusion. No anticoagulants or antiplatelets for 24 hours post-tPA." },
      { name: "Mannitol", drugClass: "Osmotic Diuretic", action: "Reduces ICP by creating osmotic gradient pulling fluid from brain tissue", sideEffects: "Dehydration, electrolyte imbalances, rebound ICP elevation", nursingConsiderations: "Administer through filter (crystallization risk). Monitor serum osmolality (hold if >320 mOsm/kg). Monitor I&O and electrolytes. Used for increased ICP in hemorrhagic stroke." }
    ],
    nursingInterventions: [
      "Activate stroke protocol — 'Time is brain'",
      "Obtain STAT non-contrast CT to differentiate ischemic vs. hemorrhagic",
      "Administer tPA within 4.5 hours of symptom onset if eligible (ischemic stroke only)",
      "Perform neurological assessments every 15 minutes during acute phase (NIH Stroke Scale)",
      "Monitor BP closely — target depends on tPA status (avoid hypotension and severe hypertension)",
      "Assess swallowing (dysphagia screening) BEFORE any oral intake — aspiration risk is high",
      "Position HOB 30 degrees to reduce ICP and promote venous drainage",
      "Maintain normoglycemia — hyperglycemia worsens ischemic injury",
      "Implement fall prevention and unilateral neglect precautions",
      "Early rehabilitation referral: PT, OT, speech therapy"
    ],
    complications: ["Cerebral edema and increased ICP", "Hemorrhagic transformation (with or without tPA)", "Aspiration pneumonia", "DVT/PE (immobility)", "Seizures", "Depression"],
    patientTeaching: ["Recognize stroke signs: BE FAST (Balance, Eyes, Face, Arms, Speech, Time)", "Call 911 immediately — do NOT drive to the hospital", "Take anticoagulants/antiplatelets as prescribed (secondary prevention)", "Control risk factors: BP, glucose, cholesterol, smoking cessation", "Attend rehabilitation sessions consistently", "Home safety modifications for mobility deficits"],
    examPearls: [
      "CT scan FIRST to rule out hemorrhagic stroke before giving tPA.",
      "tPA window: ≤4.5 hours from symptom onset (door-to-needle ≤60 minutes).",
      "NO tPA in hemorrhagic stroke — it would worsen the bleeding.",
      "Dysphagia screening BEFORE oral intake — aspiration is a major post-stroke complication.",
      "Cushing triad = late sign of increased ICP: hypertension + bradycardia + irregular respirations."
    ],
    commonTrapAnswers: [
      "Administering tPA without ruling out hemorrhage on CT scan first",
      "Giving food or fluids before dysphagia screening",
      "Lowering BP aggressively in acute ischemic stroke (can worsen cerebral ischemia)",
      "Positioning flat after hemorrhagic stroke (HOB should be elevated to 30°)"
    ],
    practiceQuestions: [
      { question: "A client presents to the ED with sudden left-sided weakness and aphasia. Symptom onset was 2 hours ago. The CT scan shows no hemorrhage. What is the priority intervention?", options: ["Administer aspirin 325 mg", "Initiate tPA infusion per protocol", "Order an MRI for further evaluation", "Schedule carotid Doppler ultrasound"], correctIndex: 1, rationale: "The client has an ischemic stroke (CT negative for hemorrhage) within the tPA treatment window (≤4.5 hours). tPA is the priority — 'time is brain.' Every minute of delay results in the death of approximately 1.9 million neurons. Aspirin should not be given until 24 hours after tPA. MRI and carotid studies can be done after thrombolytic therapy.", isFree: true },
      { question: "A nurse is caring for a post-stroke client. Before offering breakfast, what must the nurse do first?", options: ["Check the blood glucose level", "Elevate the HOB to 90 degrees", "Perform a dysphagia screening", "Administer the morning medications"], correctIndex: 2, rationale: "Dysphagia (difficulty swallowing) is extremely common after stroke and creates a high aspiration risk. The nurse MUST screen for swallowing ability before any oral intake (food, fluids, or oral medications). Aspiration pneumonia is a leading cause of post-stroke mortality. If the client fails the screening, keep NPO and consult speech-language pathology.", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between ischemic and hemorrhagic stroke management?", answer: "Ischemic stroke (clot): tPA within 4.5 hours OR mechanical thrombectomy within 24 hours. Goal is to restore blood flow. BP management is permissive (allow moderate hypertension to maintain perfusion). Hemorrhagic stroke (bleed): NO tPA. Goal is to stop bleeding, reduce ICP, and prevent rebleeding. BP management is aggressive (lower to <140 systolic). Surgical evacuation may be needed." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Hypertension Guide", href: "/nclex-rn/conditions/hypertension", type: "condition" },
      { title: "Warfarin Guide", href: "/nclex-rn/medications/warfarin", type: "medication" },
      { title: "Prioritization & Delegation", href: "/nclex-rn/prioritization-and-delegation", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  }
];

export const nclexRnMedications: NclexRnMedicationPage[] = [
  {
    slug: "insulin-types", contentType: "medication", tier: "nclex-rn", genericName: "Insulin", brandNames: ["Humulin R", "Novolin R", "Humalog", "NovoLog", "Lantus", "Levemir", "NPH"], drugClass: "Hormone / Antidiabetic",
    metaTitle: "Insulin Types NCLEX-RN Guide: Onset, Peak, Duration & Nursing Considerations (2025)",
    metaDescription: "Master all insulin types for the NCLEX-RN: rapid-acting, short-acting, intermediate, long-acting. Onset, peak, duration, mixing rules, DKA management, and practice questions.",
    keywords: "insulin types NCLEX-RN, insulin onset peak duration, insulin nursing, DKA insulin management, regular insulin IV, insulin mixing rules",
    mechanism: "Insulin binds to tyrosine kinase receptors, promoting GLUT-4 translocation for cellular glucose uptake. It stimulates glycogen synthesis, suppresses hepatic gluconeogenesis, and inhibits lipolysis. Also activates Na+/K+ ATPase, driving potassium intracellularly.",
    indications: ["Type 1 diabetes (all types)", "Type 2 diabetes (when oral agents insufficient)", "DKA (regular insulin IV)", "HHS", "Hyperkalemia (with dextrose)"],
    sideEffects: [
      { effect: "Hypoglycemia", severity: "Life-threatening", detail: "Excessive glucose uptake causing neuroglycopenia: tremors, diaphoresis, confusion, seizures, coma." },
      { effect: "Hypokalemia", severity: "Life-threatening", detail: "Insulin activates Na+/K+ ATPase, shifting K+ intracellularly. Can cause fatal arrhythmias." },
      { effect: "Lipodystrophy", severity: "Common", detail: "Repeated injection at same site causes lipohypertrophy or lipoatrophy." },
      { effect: "Weight gain", severity: "Common", detail: "Anabolic effects and reduced glucosuria retain calories." }
    ],
    adverseEffects: ["Severe hypoglycemia (seizures, coma, death)", "Hypokalemia with cardiac arrhythmias", "Allergic reactions at injection site"],
    contraindications: ["Hypoglycemia (<70 mg/dL)", "Hypokalemia (<3.3 mEq/L) before insulin in DKA"],
    nursingConsiderations: [
      "Only REGULAR insulin can be given IV",
      "Rapid-acting (lispro/aspart): onset 15 min, peak 1-2 hr, duration 3-5 hr — give immediately before meals",
      "Short-acting (regular): onset 30-60 min, peak 2-4 hr, duration 6-8 hr — give 30 min before meals",
      "Intermediate (NPH): onset 1-2 hr, peak 4-12 hr, duration 18-24 hr — cloudy, can mix with regular",
      "Long-acting (glargine/detemir): onset 1-2 hr, NO peak (peakless), duration 24 hr — NEVER mix with other insulins",
      "Mixing rule: draw Regular (clear) BEFORE NPH (cloudy) — 'clear before cloudy'",
      "In DKA: check K+ BEFORE starting insulin — replace K+ first if <3.3 mEq/L",
      "Independent double-check required (high-alert medication)"
    ],
    monitoring: ["Blood glucose (before meals, at bedtime, and as ordered)", "Serum potassium (especially in DKA)", "HbA1C every 3 months", "Injection sites for lipodystrophy"],
    patientTeaching: ["Rotate injection sites to prevent lipodystrophy", "Carry fast-acting glucose at all times for hypoglycemia", "Never skip meals when taking insulin", "Sick day management: never skip insulin, monitor glucose q4h, check ketones if BG >240", "Store unopened insulin in refrigerator; in-use vials at room temperature for up to 28 days", "Recognize hypoglycemia: shaking, sweating, confusion — treat with Rule of 15"],
    examTips: ["Only REGULAR insulin can be given IV — #1 tested insulin fact", "Check K+ BEFORE giving insulin in DKA — hypokalemia kills before hyperglycemia", "Rule of 15 for hypoglycemia — 15g carbs, recheck in 15 minutes", "Do NOT stop insulin in DKA when glucose normalizes — add dextrose instead", "Clear before cloudy when mixing insulins — never mix glargine"],
    practiceQuestions: [
      { question: "A client in DKA has serum K+ of 3.0 mEq/L. An insulin drip is ordered. What is the nurse's priority action?", options: ["Start the insulin drip as ordered", "Hold insulin and replace potassium first", "Give half the ordered insulin dose", "Administer oral potassium supplements"], correctIndex: 1, rationale: "K+ 3.0 is critically low. Insulin drives potassium intracellularly, which could cause fatal cardiac arrhythmias. Replace potassium to at least 3.3 mEq/L before starting insulin.", isFree: true },
      { question: "Which insulin type can be administered intravenously?", options: ["NPH insulin", "Insulin glargine", "Regular insulin", "Insulin lispro"], correctIndex: 2, rationale: "Only regular insulin can be given IV. NPH contains protamine (cloudy suspension — would cause emboli IV). Glargine forms microprecipitates at physiological pH. Lispro is designed for subcutaneous rapid action.", isFree: true },
      { question: "A nurse is mixing regular and NPH insulin. Which should be drawn up first?", options: ["NPH (cloudy)", "Regular (clear)", "Either can be first", "These cannot be mixed"], correctIndex: 1, rationale: "Draw regular (clear) before NPH (cloudy) to prevent contamination of the regular insulin vial. If NPH enters the regular vial, it alters the onset/peak of future regular doses. Remember: 'clear before cloudy.'", isFree: true }
    ],
    faqs: [
      { question: "Why can only regular insulin be given IV?", answer: "Regular insulin is the only insulin type that is a clear, soluble solution suitable for IV administration. NPH contains protamine (particulate suspension), glargine forms microprecipitates at physiological pH, and rapid-acting analogs are designed for subcutaneous absorption kinetics. IV regular insulin provides immediate, titratable glycemic control needed in critical situations like DKA." }
    ],
    internalLinks: [
      { title: "Diabetes/DKA/HHS Guide", href: "/nclex-rn/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "Potassium Lab Values", href: "/nclex-rn/lab-values/potassium", type: "lab-value" },
      { title: "Metformin Guide", href: "/nclex-rn/medications/metformin", type: "medication" },
      { title: "Pharmacology Review", href: "/nclex-rn/pharmacology", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "furosemide", contentType: "medication", tier: "nclex-rn", genericName: "Furosemide", brandNames: ["Lasix"], drugClass: "Loop Diuretic",
    metaTitle: "Furosemide (Lasix) NCLEX-RN Guide: Mechanism, Side Effects & Nursing Considerations (2025)",
    metaDescription: "Master furosemide for the NCLEX-RN: loop diuretic mechanism, potassium monitoring, ototoxicity, nursing considerations, and practice questions.",
    keywords: "furosemide NCLEX-RN, Lasix nursing, loop diuretic, furosemide potassium, furosemide nursing considerations",
    mechanism: "Inhibits the sodium-potassium-chloride cotransporter (NKCC2) in the thick ascending loop of Henle, blocking reabsorption of ~25% of filtered sodium. This produces potent diuresis, reducing intravascular volume, preload, and pulmonary congestion. Also causes venodilation, providing rapid symptom relief in acute pulmonary edema before diuresis begins.",
    indications: ["Heart failure (acute and chronic)", "Pulmonary edema", "Edema from hepatic cirrhosis or nephrotic syndrome", "Hypertension (adjunctive)", "Acute kidney injury (to maintain urine output)", "Hypercalcemia"],
    sideEffects: [
      { effect: "Hypokalemia", severity: "Serious", detail: "Increased potassium excretion in the collecting duct. Can cause cardiac arrhythmias, muscle weakness, and increased digoxin toxicity risk." },
      { effect: "Ototoxicity", severity: "Serious", detail: "Dose-related damage to cochlear hair cells, especially with rapid IV administration or concurrent aminoglycoside use." },
      { effect: "Dehydration/Hypotension", severity: "Serious", detail: "Aggressive diuresis can cause hypovolemia and orthostatic hypotension." },
      { effect: "Hyponatremia/Hypomagnesemia", severity: "Serious", detail: "Loss of sodium and magnesium in urine." }
    ],
    adverseEffects: ["Severe hypokalemia with cardiac arrest", "Irreversible ototoxicity (especially with aminoglycosides)", "Severe dehydration and prerenal azotemia"],
    contraindications: ["Anuria", "Severe hypokalemia or hyponatremia", "Hepatic coma", "Sulfonamide allergy (cross-reactivity possible)"],
    nursingConsiderations: [
      "Monitor potassium levels — hypokalemia is the most dangerous complication",
      "Administer in the morning to avoid nocturia",
      "Weigh daily and monitor I&O",
      "Assess for orthostatic hypotension",
      "IV push: administer slowly (no faster than 20 mg/min) to prevent ototoxicity",
      "Monitor for signs of hypokalemia: muscle cramps, weakness, irregular heartbeat",
      "Teach potassium-rich foods: bananas, oranges, potatoes, spinach"
    ],
    monitoring: ["Serum potassium (before and after doses)", "Serum sodium and magnesium", "BUN/creatinine (renal function)", "Daily weight and I&O", "Blood pressure (orthostatic measurements)", "Hearing assessment (especially with high doses or aminoglycosides)"],
    patientTeaching: ["Take in the morning to avoid nighttime urination", "Rise slowly from sitting/lying positions", "Eat potassium-rich foods unless on potassium supplement", "Report muscle cramps, weakness, or dizziness", "Weigh yourself daily — report gains >2 lbs/day"],
    examTips: [
      "Hypokalemia is the #1 concern with loop diuretics — always check potassium",
      "Hypokalemia + digoxin = increased toxicity risk — critical exam connection",
      "Loop diuretics waste K+, ACE inhibitors retain K+ — opposite effects",
      "IV furosemide: push slowly to prevent ototoxicity",
      "Give in the MORNING to avoid nocturia"
    ],
    practiceQuestions: [
      { question: "A client on furosemide and digoxin reports nausea, visual disturbances, and bradycardia. K+ is 2.8 mEq/L. What should the nurse do first?", options: ["Administer the next scheduled digoxin dose", "Hold digoxin, notify provider, prepare for potassium replacement", "Give an antiemetic for nausea", "Increase the furosemide dose"], correctIndex: 1, rationale: "These symptoms indicate digoxin toxicity precipitated by hypokalemia. Furosemide-induced potassium loss increases digoxin toxicity risk. Hold digoxin, notify the provider, and prepare for IV potassium replacement. Potassium correction must precede digoxin resumption.", isFree: true },
      { question: "A nurse is administering IV furosemide 80 mg. What is the maximum rate of IV push administration?", options: ["80 mg over 1 minute", "80 mg over 4 minutes (20 mg/min)", "80 mg over 30 seconds", "The entire dose can be given as a bolus"], correctIndex: 1, rationale: "IV furosemide should not be administered faster than 20 mg/min to prevent ototoxicity. 80 mg should be given over at least 4 minutes. Rapid IV administration can cause irreversible hearing loss, especially in patients receiving concurrent aminoglycoside antibiotics.", isFree: true }
    ],
    faqs: [
      { question: "Why does hypokalemia increase digoxin toxicity?", answer: "Digoxin and potassium compete for the same binding site on the Na+/K+ ATPase pump. When potassium is low, more digoxin binds to the pump, increasing its effect. This can cause bradycardia, heart block, and fatal dysrhythmias. Always check potassium before administering digoxin, especially in patients on loop diuretics." }
    ],
    internalLinks: [
      { title: "Heart Failure Guide", href: "/nclex-rn/conditions/heart-failure", type: "condition" },
      { title: "Digoxin Guide", href: "/nclex-rn/medications/digoxin", type: "medication" },
      { title: "Potassium Lab Values", href: "/nclex-rn/lab-values/potassium", type: "lab-value" },
      { title: "Pharmacology Review", href: "/nclex-rn/pharmacology", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "warfarin", contentType: "medication", tier: "nclex-rn", genericName: "Warfarin", brandNames: ["Coumadin", "Jantoven"], drugClass: "Vitamin K Antagonist (Oral Anticoagulant)",
    metaTitle: "Warfarin (Coumadin) NCLEX-RN Guide: INR Monitoring & Nursing Considerations (2025)",
    metaDescription: "Master warfarin for the NCLEX-RN: INR monitoring, vitamin K interactions, reversal agents, patient teaching, and clinical judgment practice questions.",
    keywords: "warfarin NCLEX-RN, INR monitoring nursing, warfarin vitamin K, Coumadin nursing, warfarin patient teaching",
    mechanism: "Inhibits vitamin K epoxide reductase (VKORC1), preventing recycling of vitamin K needed for synthesis of clotting factors II, VII, IX, and X. Full anticoagulation takes 5-7 days as existing factors must be depleted. Does not dissolve existing clots — prevents new clot formation.",
    indications: ["Atrial fibrillation (stroke prevention)", "Mechanical heart valves", "DVT/PE treatment and prevention", "Hypercoagulable states"],
    sideEffects: [
      { effect: "Hemorrhage", severity: "Life-threatening", detail: "Risk increases with INR >4.0. Can be fatal (intracranial, GI, retroperitoneal)." },
      { effect: "Skin necrosis", severity: "Life-threatening", detail: "Protein C (shortest half-life) depletes first, creating paradoxical hypercoagulable state." },
      { effect: "Purple toe syndrome", severity: "Serious", detail: "Cholesterol crystal embolization." }
    ],
    adverseEffects: ["Fatal hemorrhage", "Teratogenicity (pregnancy Category X)", "Skin necrosis"],
    contraindications: ["Pregnancy (Category X)", "Active bleeding", "Recent CNS surgery", "Severe hepatic disease", "Unsupervised fall-risk patients"],
    nursingConsiderations: [
      "Monitor INR regularly: target 2.0-3.0 (most indications), 2.5-3.5 (mechanical mitral valves)",
      "Teach CONSISTENT vitamin K intake — do not eliminate, keep stable",
      "Extensive drug interactions: antibiotics, NSAIDs, herbal supplements",
      "Reversal: vitamin K (12-24 hr), FFP/4-factor PCC (immediate)",
      "Requires heparin bridge for 5-7 days until INR therapeutic",
      "Pregnancy is ABSOLUTE contraindication"
    ],
    monitoring: ["INR (baseline, then regularly until stable, then monthly)", "Signs of bleeding (bruising, black stools, hematuria, gum bleeding)", "Hemoglobin/hematocrit if bleeding suspected"],
    patientTeaching: ["Keep CONSISTENT vitamin K intake — do not suddenly increase or decrease green vegetables", "Report unusual bruising, nosebleeds, blood in urine/stool", "Avoid aspirin and NSAIDs unless prescribed", "Wear medical identification", "Inform all healthcare providers and dentists", "Use electric razor, soft toothbrush"],
    examTips: [
      "INR monitors warfarin (NOT aPTT — that's heparin)",
      "CONSISTENT vitamin K intake — not elimination",
      "Pregnancy is absolute contraindication",
      "Antidote: vitamin K; emergent reversal: FFP/4-factor PCC",
      "Takes 5-7 days for full effect — heparin bridge required"
    ],
    practiceQuestions: [
      { question: "A client on warfarin has INR 5.2 with no active bleeding. What is the priority nursing action?", options: ["Administer protamine sulfate", "Hold warfarin and notify the provider", "Prepare for blood transfusion", "Continue current dose and recheck in 1 week"], correctIndex: 1, rationale: "INR 5.2 is supratherapeutic (target 2.0-3.0), increasing bleeding risk. Without active bleeding, hold warfarin and notify the provider. Vitamin K may be ordered. Protamine sulfate is the antidote for HEPARIN, not warfarin.", isFree: true },
      { question: "Which patient statement indicates a need for further warfarin education?", options: ["I will have my INR checked regularly", "I stopped eating all green vegetables to stabilize my INR", "I will avoid taking aspirin unless approved by my doctor", "I will report unusual bruising to my doctor"], correctIndex: 1, rationale: "Patients should NOT eliminate vitamin K-rich foods — they should maintain CONSISTENT intake. Dramatic changes in vitamin K consumption cause INR fluctuations and increase either bleeding or clotting risk.", isFree: true }
    ],
    faqs: [
      { question: "Why do patients need a heparin bridge when starting warfarin?", answer: "Warfarin takes 5-7 days for full anticoagulant effect because it only prevents synthesis of NEW clotting factors — existing factors must be naturally depleted. Heparin provides immediate anticoagulation during this overlap period. Additionally, warfarin initially depletes Protein C (a natural anticoagulant) faster than procoagulant factors, potentially creating a paradoxical hypercoagulable state." }
    ],
    internalLinks: [
      { title: "Heparin Guide", href: "/nclex-rn/medications/heparin", type: "medication" },
      { title: "Stroke Guide", href: "/nclex-rn/conditions/stroke", type: "condition" },
      { title: "Pharmacology Review", href: "/nclex-rn/pharmacology", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "heparin", contentType: "medication", tier: "nclex-rn", genericName: "Heparin", brandNames: ["Hep-Lock"], drugClass: "Anticoagulant (Unfractionated Heparin)",
    metaTitle: "Heparin NCLEX-RN Guide: aPTT Monitoring, HIT & Nursing Considerations (2025)",
    metaDescription: "Master heparin for the NCLEX-RN: aPTT monitoring, protamine sulfate reversal, HIT, IV administration, and clinical judgment practice questions.",
    keywords: "heparin NCLEX-RN, aPTT monitoring nursing, heparin protamine sulfate, HIT nursing, heparin IV administration",
    mechanism: "Binds to antithrombin III (AT-III), accelerating its inhibition of thrombin (Factor IIa) and Factor Xa by 1000-fold. This prevents conversion of fibrinogen to fibrin and inhibits thrombin-mediated activation of Factors V, VIII, XI, and XIII. Immediate onset when given IV (unlike warfarin).",
    indications: ["DVT/PE treatment and prevention", "Acute coronary syndromes", "Atrial fibrillation", "Cardiopulmonary bypass", "Hemodialysis anticoagulation", "Heparin bridge while initiating warfarin"],
    sideEffects: [
      { effect: "Hemorrhage", severity: "Life-threatening", detail: "Most common serious complication. Risk increases with supratherapeutic aPTT." },
      { effect: "Heparin-induced thrombocytopenia (HIT)", severity: "Life-threatening", detail: "Type II HIT: immune-mediated platelet activation causing paradoxical thrombosis despite thrombocytopenia. Platelets <50% of baseline or <100,000. Occurs 5-14 days after heparin initiation." },
      { effect: "Osteoporosis", severity: "Common (long-term)", detail: "Long-term use (>6 months) reduces bone density." }
    ],
    adverseEffects: ["Fatal hemorrhage", "HIT with paradoxical thromboembolism", "Hyperkalemia (aldosterone suppression)"],
    contraindications: ["Active bleeding", "Severe thrombocytopenia", "History of HIT", "Recent CNS surgery", "Uncontrolled hypertension"],
    nursingConsiderations: [
      "Monitor aPTT: target 1.5-2.5x control (typically 60-80 seconds)",
      "aPTT is to heparin as INR is to warfarin — critical distinction",
      "Antidote: protamine sulfate (1 mg per 100 units heparin)",
      "Monitor platelet count: baseline, then every 2-3 days for HIT",
      "NEVER administer IM — causes hematoma",
      "High-alert medication requiring independent double-check",
      "Assess for bleeding: gum bleeding, bruising, hematuria, melena"
    ],
    monitoring: ["aPTT (baseline, then q6h until therapeutic, then daily)", "Platelet count (baseline, then q2-3 days)", "Signs of bleeding", "Hemoglobin/hematocrit"],
    patientTeaching: ["Report any signs of bleeding immediately", "Use electric razor and soft toothbrush", "Avoid contact sports", "Inform all healthcare providers about anticoagulant therapy", "Apply pressure to venipuncture sites for at least 5 minutes"],
    examTips: [
      "aPTT monitors heparin (NOT INR — that's warfarin). This is the most tested anticoagulant distinction.",
      "Antidote for heparin = protamine sulfate. Antidote for warfarin = vitamin K.",
      "HIT: paradoxical thrombosis + thrombocytopenia — STOP all heparin immediately",
      "Never give heparin IM — only IV or subcutaneous",
      "Heparin works immediately; warfarin takes 5-7 days — heparin bridges the gap"
    ],
    practiceQuestions: [
      { question: "A client on heparin therapy has an aPTT of 120 seconds (therapeutic range 60-80 seconds). What should the nurse do?", options: ["Continue heparin at the current rate", "Stop the heparin and notify the provider", "Administer vitamin K IV", "Increase the heparin rate per protocol"], correctIndex: 1, rationale: "aPTT of 120 seconds is significantly supratherapeutic, placing the client at high risk for hemorrhage. Stop heparin and notify the provider. The provider will determine if protamine sulfate is needed or if simply holding heparin is sufficient. Vitamin K is the antidote for warfarin, not heparin.", isFree: true },
      { question: "A client on heparin for 8 days develops a platelet count of 45,000 (baseline was 220,000). What should the nurse suspect?", options: ["Normal heparin response", "Heparin-induced thrombocytopenia (HIT)", "Disseminated intravascular coagulation", "Bone marrow suppression"], correctIndex: 1, rationale: "A >50% drop in platelets (220,000 → 45,000) occurring 5-14 days after heparin initiation is the classic presentation of HIT Type II. Despite the low platelet count, HIT paradoxically causes thrombosis. ALL heparin (including flushes and coated lines) must be immediately discontinued, and an alternative anticoagulant (argatroban, bivalirudin) started.", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between HIT Type I and Type II?", answer: "HIT Type I is a benign, non-immune decrease in platelets (mild, resolves on its own, no need to stop heparin). HIT Type II is an immune-mediated condition where antibodies against the heparin-PF4 complex activate platelets, causing paradoxical thrombosis. Type II requires immediate cessation of ALL heparin and initiation of alternative anticoagulation." }
    ],
    internalLinks: [
      { title: "Warfarin Guide", href: "/nclex-rn/medications/warfarin", type: "medication" },
      { title: "MI/ACS Guide", href: "/nclex-rn/conditions/mi-acs", type: "condition" },
      { title: "Pharmacology Review", href: "/nclex-rn/pharmacology", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "metformin", contentType: "medication", tier: "nclex-rn", genericName: "Metformin", brandNames: ["Glucophage", "Glumetza"], drugClass: "Biguanide",
    metaTitle: "Metformin NCLEX-RN Guide: Mechanism, Lactic Acidosis & Contrast Dye (2025)",
    metaDescription: "Master metformin for the NCLEX-RN: mechanism, lactic acidosis risk, contrast dye precautions, renal monitoring, and practice questions.",
    keywords: "metformin NCLEX-RN, metformin nursing, lactic acidosis metformin, metformin contrast dye, biguanide nursing",
    mechanism: "Activates AMP-activated protein kinase (AMPK), suppressing hepatic gluconeogenesis and improving peripheral insulin sensitivity. Does NOT stimulate insulin release — hypoglycemia does not occur as monotherapy.",
    indications: ["Type 2 diabetes mellitus (first-line therapy)", "Prediabetes (off-label)", "PCOS (off-label)", "Insulin resistance syndromes"],
    sideEffects: [
      { effect: "GI disturbances", severity: "Common", detail: "Nausea, diarrhea, cramping. Taking with meals and using ER formulation reduces symptoms." },
      { effect: "Lactic acidosis", severity: "Life-threatening", detail: "Rare but fatal. Risk increases with renal impairment, hepatic disease, excessive alcohol, sepsis, hypoxia." },
      { effect: "Vitamin B12 deficiency", severity: "Common (long-term)", detail: "Interferes with B12 absorption in the ileum. Monitor periodically." }
    ],
    adverseEffects: ["Fatal lactic acidosis", "Severe vitamin B12 deficiency with neuropathy"],
    contraindications: ["eGFR <30 mL/min", "Metabolic acidosis/DKA", "Within 48 hours of iodinated contrast procedures", "Severe hepatic impairment", "Conditions causing tissue hypoxia (sepsis, shock)"],
    nursingConsiderations: [
      "Monitor renal function (eGFR) before starting and at least annually",
      "Hold 48 hours before and after iodinated contrast procedures",
      "Take with meals to reduce GI side effects",
      "Does NOT cause hypoglycemia as monotherapy",
      "Monitor B12 levels periodically, especially with neuropathy symptoms"
    ],
    monitoring: ["eGFR (at least annually)", "HbA1C (every 3 months)", "Vitamin B12 levels (periodically)", "Liver function (if symptomatic)"],
    patientTeaching: ["Take with food to minimize stomach upset", "This medication alone will not cause low blood sugar", "Report symptoms of lactic acidosis: muscle pain, weakness, difficulty breathing, unusual fatigue", "Inform radiology staff about metformin before any contrast procedures", "Limit alcohol consumption"],
    examTips: [
      "First-line therapy for Type 2 diabetes — always the correct initial choice",
      "Does NOT cause hypoglycemia as monotherapy — key differentiator from sulfonylureas",
      "Hold before contrast dye — classic exam question about procedure preparation",
      "Lactic acidosis is rare but life-threatening — know risk factors"
    ],
    practiceQuestions: [
      { question: "A Type 2 diabetic patient on metformin is scheduled for a CT scan with IV contrast. What should the nurse do?", options: ["Continue metformin as scheduled", "Hold metformin 48 hours before and after the procedure", "Switch to insulin for the procedure day only", "Double the metformin dose the day before"], correctIndex: 1, rationale: "Metformin must be held 48 hours before and after iodinated contrast procedures. Contrast-induced nephropathy can reduce metformin clearance, leading to toxic accumulation and potentially fatal lactic acidosis. Renal function should be verified before resuming metformin.", isFree: true }
    ],
    faqs: [
      { question: "Why doesn't metformin cause hypoglycemia?", answer: "Metformin works by reducing hepatic glucose production and improving insulin sensitivity — it does NOT stimulate insulin secretion from pancreatic beta cells. Since it doesn't increase insulin levels, blood glucose doesn't drop below normal when used alone. However, hypoglycemia can occur when combined with insulin or sulfonylureas." }
    ],
    internalLinks: [
      { title: "Diabetes/DKA/HHS Guide", href: "/nclex-rn/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "Insulin Types Guide", href: "/nclex-rn/medications/insulin-types", type: "medication" },
      { title: "A1C Lab Values", href: "/nclex-rn/lab-values/a1c", type: "lab-value" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "lisinopril", contentType: "medication", tier: "nclex-rn", genericName: "Lisinopril", brandNames: ["Prinivil", "Zestril"], drugClass: "ACE Inhibitor",
    metaTitle: "Lisinopril (ACE Inhibitor) NCLEX-RN Guide: Dry Cough, Angioedema & Nursing Care (2025)",
    metaDescription: "Master lisinopril for the NCLEX-RN: ACE inhibitor mechanism, dry cough, angioedema, hyperkalemia, pregnancy contraindication, and practice questions.",
    keywords: "lisinopril NCLEX-RN, ACE inhibitor nursing, dry cough ACE inhibitor, angioedema lisinopril, ACE inhibitor pregnancy",
    mechanism: "Inhibits ACE, blocking conversion of angiotensin I to angiotensin II. Reduces vasoconstriction and aldosterone secretion. Preserves bradykinin (causing vasodilation but also dry cough).",
    indications: ["Hypertension", "Heart failure (HFrEF)", "Post-MI (LV dysfunction)", "Diabetic nephropathy (renoprotective)"],
    sideEffects: [
      { effect: "Dry cough", severity: "Common", detail: "Bradykinin accumulation stimulates airway C-fibers. Not dose-dependent. Resolves 1-4 weeks after discontinuation." },
      { effect: "Hyperkalemia", severity: "Serious", detail: "Reduced aldosterone decreases potassium excretion." },
      { effect: "Angioedema", severity: "Life-threatening", detail: "Bradykinin-mediated vascular permeability. Face, lips, tongue, larynx — can be fatal." },
      { effect: "Teratogenicity", severity: "Life-threatening", detail: "Causes fetal renal dysgenesis, oligohydramnios. Absolutely contraindicated in pregnancy." }
    ],
    adverseEffects: ["Fatal angioedema", "Renal failure in bilateral renal artery stenosis", "Fetal death"],
    contraindications: ["Pregnancy", "History of angioedema", "Bilateral renal artery stenosis", "Concurrent use with aliskiren in diabetic patients"],
    nursingConsiderations: [
      "Monitor potassium — ACE inhibitors cause hyperKALemia",
      "Monitor BUN/creatinine — rising creatinine may indicate renal artery stenosis",
      "Dry cough is NOT an allergic reaction — switch to ARB if intolerable",
      "Pregnancy test before starting in women of childbearing age",
      "Monitor for angioedema — requires immediate discontinuation and airway management",
      "First-dose hypotension risk — advise taking first dose at bedtime"
    ],
    monitoring: ["Serum potassium", "BUN/creatinine", "Blood pressure", "Signs of angioedema"],
    patientTeaching: ["Report persistent dry cough to provider", "Report swelling of face, lips, or tongue immediately (emergency)", "Do not become pregnant while taking this medication", "Rise slowly to prevent dizziness", "Avoid potassium supplements and salt substitutes (contain KCl)"],
    examTips: [
      "Dry cough = ACE inhibitor. Switch to ARB if intolerable.",
      "Pregnancy = absolute contraindication for ACE inhibitors",
      "ACE inhibitors cause hyperKALemia (opposite of diuretics)",
      "Angioedema = medical emergency — stop ACE inhibitor, manage airway",
      "Renoprotective in diabetic nephropathy"
    ],
    practiceQuestions: [
      { question: "A patient on lisinopril reports a persistent dry cough. What is the best nursing response?", options: ["Take a cough suppressant with the medication", "Notify the provider — may switch to an ARB", "Stop the medication immediately", "This side effect will resolve on its own"], correctIndex: 1, rationale: "Dry cough from ACE inhibitors is caused by bradykinin accumulation and will not resolve on its own while taking the medication. Notify the provider — switching to an ARB (which does not affect bradykinin) typically resolves the cough while maintaining RAAS blockade.", isFree: true }
    ],
    faqs: [
      { question: "Why are ACE inhibitors contraindicated in pregnancy?", answer: "ACE inhibitors cross the placenta and cause fetal renal dysgenesis (the developing kidneys need angiotensin II for proper formation). This leads to oligohydramnios, pulmonary hypoplasia, limb contractures, and fetal death. The risk is highest in the 2nd and 3rd trimesters but ACE inhibitors should be avoided throughout pregnancy." }
    ],
    internalLinks: [
      { title: "Hypertension Guide", href: "/nclex-rn/conditions/hypertension", type: "condition" },
      { title: "Heart Failure Guide", href: "/nclex-rn/conditions/heart-failure", type: "condition" },
      { title: "Potassium Lab Values", href: "/nclex-rn/lab-values/potassium", type: "lab-value" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "metoprolol", contentType: "medication", tier: "nclex-rn", genericName: "Metoprolol", brandNames: ["Lopressor", "Toprol-XL"], drugClass: "Beta-1 Selective Blocker",
    metaTitle: "Metoprolol NCLEX-RN Guide: Beta-Blocker Nursing Considerations & Practice Questions (2025)",
    metaDescription: "Master metoprolol for the NCLEX-RN: beta-blocker mechanism, HR monitoring, abrupt discontinuation risks, and clinical judgment practice questions.",
    keywords: "metoprolol NCLEX-RN, beta-blocker nursing, metoprolol heart rate, beta-blocker discontinuation, Lopressor nursing",
    mechanism: "Selectively blocks beta-1 adrenergic receptors in the heart, reducing heart rate, contractility, conduction velocity, and myocardial oxygen demand. At higher doses, may also block beta-2 receptors (bronchospasm risk).",
    indications: ["Hypertension", "Heart failure (HFrEF — metoprolol succinate)", "Post-MI", "Atrial fibrillation/flutter (rate control)", "Angina"],
    sideEffects: [
      { effect: "Bradycardia", severity: "Serious", detail: "Excessive beta-1 blockade slows heart rate. Can cause symptomatic bradycardia." },
      { effect: "Hypotension", severity: "Serious", detail: "Reduced cardiac output lowers blood pressure." },
      { effect: "Fatigue", severity: "Common", detail: "Reduced cardiac output and peripheral blood flow." },
      { effect: "Bronchospasm", severity: "Serious", detail: "Beta-2 blockade at higher doses can trigger bronchospasm in asthma/COPD patients." }
    ],
    adverseEffects: ["Heart block", "Severe bronchospasm", "Rebound hypertension/tachycardia with abrupt discontinuation", "Masking of hypoglycemia symptoms in diabetic patients"],
    contraindications: ["Bradycardia (HR <60 bpm)", "Heart block (2nd or 3rd degree)", "Cardiogenic shock", "Decompensated heart failure", "Asthma (relative — use cardioselective at low doses)"],
    nursingConsiderations: [
      "Check apical pulse for one full minute before administration — hold if HR <60 bpm",
      "NEVER discontinue abruptly — taper over 1-2 weeks to prevent rebound hypertension/tachycardia/MI",
      "Monitor blood pressure — hold if SBP <100 mmHg",
      "Use cautiously in patients with asthma or COPD (bronchospasm risk at higher doses)",
      "May mask signs of hypoglycemia in diabetic patients (tachycardia) — sweating is preserved"
    ],
    monitoring: ["Heart rate (apical pulse before each dose)", "Blood pressure", "Blood glucose in diabetic patients", "Signs of heart failure exacerbation"],
    patientTeaching: ["Never stop this medication suddenly — can cause heart attack or dangerous BP spike", "Check your pulse daily — report HR <60", "Rise slowly to prevent dizziness", "Report shortness of breath, wheezing, or excessive fatigue", "Carry medical identification"],
    examTips: [
      "Check apical HR for 1 full minute BEFORE giving — hold if <60 bpm",
      "NEVER stop abruptly — taper over 1-2 weeks (rebound crisis risk)",
      "-olol suffix = beta-blocker (metoprolol, atenolol, propranolol)",
      "Masks tachycardia in hypoglycemia — sweating is the preserved sign",
      "Avoid in asthma — risk of bronchospasm"
    ],
    practiceQuestions: [
      { question: "A nurse prepares to administer metoprolol. The client's apical heart rate is 52 bpm. What should the nurse do?", options: ["Administer the medication as prescribed", "Hold the medication and notify the provider", "Give half the prescribed dose", "Administer the medication with food"], correctIndex: 1, rationale: "An apical heart rate of 52 bpm is below the hold parameter of 60 bpm. Administering metoprolol to a bradycardic client could cause dangerously slow heart rates, heart block, or cardiovascular collapse. Hold the medication and notify the provider for further orders.", isFree: true }
    ],
    faqs: [
      { question: "Why can't you stop beta-blockers abruptly?", answer: "Chronic beta-blocker use causes upregulation of beta-adrenergic receptors. Abrupt discontinuation exposes these increased receptors to normal catecholamine levels, producing an exaggerated sympathetic response: rebound hypertension, tachycardia, angina, and potentially myocardial infarction. Always taper beta-blockers over 1-2 weeks." }
    ],
    internalLinks: [
      { title: "Hypertension Guide", href: "/nclex-rn/conditions/hypertension", type: "condition" },
      { title: "Heart Failure Guide", href: "/nclex-rn/conditions/heart-failure", type: "condition" },
      { title: "MI/ACS Guide", href: "/nclex-rn/conditions/mi-acs", type: "condition" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "digoxin", contentType: "medication", tier: "nclex-rn", genericName: "Digoxin", brandNames: ["Lanoxin"], drugClass: "Cardiac Glycoside",
    metaTitle: "Digoxin NCLEX-RN Guide: Therapeutic Level, Toxicity & Nursing Considerations (2025)",
    metaDescription: "Master digoxin for the NCLEX-RN: narrow therapeutic index, toxicity signs, potassium connection, apical pulse assessment, and practice questions.",
    keywords: "digoxin NCLEX-RN, digoxin toxicity, digoxin nursing, Lanoxin therapeutic level, cardiac glycoside nursing",
    mechanism: "Inhibits Na+/K+ ATPase pump, increasing intracellular calcium, which enhances myocardial contractility (positive inotrope). Also slows conduction through the AV node (negative chronotrope/dromotrope), useful for rate control in atrial fibrillation.",
    indications: ["Heart failure (HFrEF — symptom improvement, not mortality reduction)", "Atrial fibrillation (rate control)", "Atrial flutter"],
    sideEffects: [
      { effect: "Bradycardia", severity: "Serious", detail: "AV nodal suppression slows heart rate. Can progress to heart block." },
      { effect: "Visual disturbances", severity: "Serious", detail: "Yellow-green halos, blurred vision — classic early toxicity sign." },
      { effect: "GI symptoms", severity: "Common", detail: "Nausea, vomiting, anorexia — often first signs of toxicity." },
      { effect: "Fatal dysrhythmias", severity: "Life-threatening", detail: "Toxic levels can cause any cardiac dysrhythmia including VT, VF, and complete heart block." }
    ],
    adverseEffects: ["Digoxin toxicity with fatal dysrhythmias", "Complete heart block"],
    contraindications: ["Hypokalemia (increases toxicity risk)", "Ventricular tachycardia/fibrillation", "Hypertrophic obstructive cardiomyopathy"],
    nursingConsiderations: [
      "Check apical pulse for ONE FULL MINUTE before administration — hold if HR <60 bpm in adults",
      "Therapeutic level: 0.5-2.0 ng/mL — narrow therapeutic index",
      "Hypokalemia INCREASES digoxin toxicity risk — always check potassium",
      "Signs of toxicity: visual changes (yellow-green halos), nausea, bradycardia, dysrhythmias",
      "Antidote for toxicity: digoxin immune Fab (Digibind)",
      "Monitor concurrent diuretic therapy (loop diuretics deplete potassium)"
    ],
    monitoring: ["Serum digoxin level (therapeutic 0.5-2.0 ng/mL)", "Serum potassium", "Apical heart rate", "ECG for dysrhythmias", "Renal function (digoxin is renally excreted)"],
    patientTeaching: ["Take pulse before each dose — do not take if <60 bpm and call provider", "Report nausea, vomiting, vision changes, or fatigue", "Maintain consistent potassium intake", "Do not double dose if missed", "Regular blood level monitoring is essential"],
    examTips: [
      "Check apical pulse x1 FULL minute — hold if HR <60 bpm",
      "Therapeutic level 0.5-2.0 ng/mL — narrow therapeutic index",
      "HypoKALemia + digoxin = increased toxicity risk — ALWAYS check K+",
      "Early toxicity signs: nausea, visual disturbances (yellow-green halos), anorexia",
      "Antidote: digoxin immune Fab (Digibind)"
    ],
    practiceQuestions: [
      { question: "A client on digoxin and furosemide reports nausea, blurred vision, and seeing yellow halos. Digoxin level is 2.8 ng/mL. K+ is 3.0 mEq/L. What is the priority action?", options: ["Administer the next digoxin dose with food", "Hold digoxin, notify provider, anticipate Digibind and potassium replacement", "Give an antiemetic and reassess", "Increase the furosemide dose"], correctIndex: 1, rationale: "Digoxin level 2.8 ng/mL (>2.0 = toxic) + classic toxicity symptoms (nausea, visual disturbances) + hypokalemia (K+ 3.0 facilitates toxicity). Hold digoxin immediately, notify the provider, anticipate digoxin immune Fab (Digibind) and IV potassium replacement. The combination of furosemide (K+ wasting) and digoxin is a classic exam scenario.", isFree: true }
    ],
    faqs: [
      { question: "Why does hypokalemia increase digoxin toxicity?", answer: "Digoxin and potassium compete for the same binding site on the Na+/K+ ATPase pump. When potassium is low, more digoxin molecules bind to the pump, amplifying digoxin's effect and increasing the risk of life-threatening arrhythmias. This is why potassium must be monitored closely in patients taking both digoxin and potassium-wasting diuretics (furosemide, HCTZ)." }
    ],
    internalLinks: [
      { title: "Heart Failure Guide", href: "/nclex-rn/conditions/heart-failure", type: "condition" },
      { title: "Furosemide Guide", href: "/nclex-rn/medications/furosemide", type: "medication" },
      { title: "Potassium Lab Values", href: "/nclex-rn/lab-values/potassium", type: "lab-value" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  }
];

export const nclexRnLabValues: NclexRnLabValuePage[] = [
  {
    slug: "potassium", contentType: "lab-value", tier: "nclex-rn", name: "Potassium", fullName: "Serum Potassium (K+)",
    metaTitle: "Potassium Lab Values NCLEX-RN Guide: Normal Range, Hypo/Hyperkalemia & Nursing Actions (2025)",
    metaDescription: "Master potassium for the NCLEX-RN: normal range, hypokalemia vs hyperkalemia, ECG changes, medication connections, nursing implications, and practice questions.",
    keywords: "potassium NCLEX-RN, hypokalemia nursing, hyperkalemia nursing, potassium lab values, serum potassium normal range",
    normalRangeUS: { value: "3.5-5.0", unit: "mEq/L" },
    normalRangeCA: { value: "3.5-5.0", unit: "mmol/L" },
    overview: "Potassium is the major intracellular cation, critical for cardiac conduction, muscle contraction, and nerve transmission. Even small deviations from the normal range can cause life-threatening cardiac dysrhythmias. Potassium is the most commonly tested lab value on the NCLEX-RN due to its critical importance and numerous medication connections.",
    highSignificance: [
      { condition: "Hyperkalemia (>5.0 mEq/L)", explanation: "Causes: renal failure, ACE inhibitors/ARBs, potassium-sparing diuretics, tissue destruction (burns, crush injuries), metabolic acidosis. ECG changes: tall peaked T waves → widened QRS → sine wave → cardiac arrest." },
      { condition: "Treatment of Hyperkalemia", explanation: "Calcium gluconate (cardiac membrane stabilization — does NOT lower K+), insulin + dextrose (shifts K+ intracellularly), sodium bicarbonate (shifts K+ into cells), kayexalate (GI excretion), dialysis (definitive removal). Monitor cardiac rhythm continuously." }
    ],
    lowSignificance: [
      { condition: "Hypokalemia (<3.5 mEq/L)", explanation: "Causes: loop/thiazide diuretics, vomiting, diarrhea, NG suction, insulin therapy. Symptoms: muscle weakness, cramps, fatigue, constipation, U waves on ECG, cardiac dysrhythmias." },
      { condition: "Hypokalemia + Digoxin", explanation: "LOW potassium INCREASES digoxin toxicity risk. K+ and digoxin compete for the same binding site. When K+ is low, more digoxin binds → toxicity. ALWAYS check K+ in digoxin patients." }
    ],
    interpretation: "Potassium imbalances directly affect cardiac conduction. The heart is the organ most sensitive to potassium changes. Both hypo- and hyperkalemia can cause fatal dysrhythmias. Clinical interpretation must always consider medications (diuretics, ACE inhibitors, insulin), renal function, acid-base status, and concurrent digoxin therapy.",
    associatedConditions: ["Heart failure (diuretic-induced hypokalemia)", "Diabetic ketoacidosis (total body depletion despite normal/high serum levels)", "Acute kidney injury/CKD (hyperkalemia)", "Burns/crush injuries (hyperkalemia from cell destruction)"],
    nursingImplications: [
      "IV potassium: NEVER push — always dilute and infuse via pump (max 10-20 mEq/hr)",
      "Oral potassium: take with food and full glass of water (GI irritation risk)",
      "Monitor cardiac rhythm in hypo- and hyperkalemia",
      "Correlate with medication regimen (diuretics, ACE inhibitors, digoxin)",
      "In DKA: check K+ BEFORE starting insulin — replace first if <3.3 mEq/L",
      "Monitor I&O — renal function directly affects potassium balance"
    ],
    examAlerts: [
      "K+ <3.0 or >6.0 mEq/L = critical value requiring immediate notification",
      "IV potassium is NEVER given by push — fatal cardiac arrest risk",
      "Hypokalemia + digoxin = increased toxicity — critical exam connection",
      "Loop diuretics WASTE potassium; ACE inhibitors RETAIN potassium",
      "In DKA: serum K+ may be normal/high, but TOTAL BODY K+ is depleted"
    ],
    practiceQuestions: [
      { question: "A client's K+ is 6.5 mEq/L. ECG shows peaked T waves. What is the priority intervention?", options: ["Administer oral kayexalate", "Administer IV calcium gluconate", "Initiate hemodialysis", "Restrict dietary potassium"], correctIndex: 1, rationale: "IV calcium gluconate is the FIRST intervention — it stabilizes the cardiac membrane to prevent fatal dysrhythmias. It does NOT lower potassium. After cardiac stabilization, insulin + dextrose, bicarbonate, and kayexalate are used to shift or remove potassium. Dialysis is definitive but takes time to arrange.", isFree: true },
      { question: "A client on furosemide has K+ of 3.1 mEq/L. Which finding should the nurse most closely assess?", options: ["Blood pressure", "Respiratory rate", "ECG rhythm", "Temperature"], correctIndex: 2, rationale: "Hypokalemia (3.1 mEq/L) causes cardiac conduction abnormalities: U waves, flat T waves, ST depression, and potentially fatal dysrhythmias. ECG monitoring is the priority assessment to detect rhythm changes. The cardiac effects of hypokalemia are the most immediately life-threatening concern.", isFree: true }
    ],
    faqs: [
      { question: "Why can't IV potassium be given by push?", answer: "IV push potassium can cause cardiac arrest by suddenly increasing the extracellular potassium concentration around cardiac cells, disrupting the electrical gradient needed for normal cardiac conduction. It must always be diluted and administered via infusion pump at a controlled rate (maximum 10-20 mEq/hr) with cardiac monitoring." }
    ],
    internalLinks: [
      { title: "Heart Failure Guide", href: "/nclex-rn/conditions/heart-failure", type: "condition" },
      { title: "Diabetes/DKA/HHS Guide", href: "/nclex-rn/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "Furosemide Guide", href: "/nclex-rn/medications/furosemide", type: "medication" },
      { title: "Digoxin Guide", href: "/nclex-rn/medications/digoxin", type: "medication" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "sodium", contentType: "lab-value", tier: "nclex-rn", name: "Sodium", fullName: "Serum Sodium (Na+)",
    metaTitle: "Sodium Lab Values NCLEX-RN Guide: Hypo/Hypernatremia & Fluid Balance (2025)",
    metaDescription: "Master sodium for the NCLEX-RN: normal range, hyponatremia vs hypernatremia, fluid balance, SIADH vs DI, nursing implications, and practice questions.",
    keywords: "sodium NCLEX-RN, hyponatremia nursing, hypernatremia nursing, sodium lab values, SIADH diabetes insipidus",
    normalRangeUS: { value: "136-145", unit: "mEq/L" },
    normalRangeCA: { value: "136-145", unit: "mmol/L" },
    overview: "Sodium is the major extracellular cation and primary determinant of serum osmolality and fluid distribution. Sodium imbalances reflect water balance disorders more than actual sodium gain or loss. Hyponatremia is the most common electrolyte disorder in hospitalized patients.",
    highSignificance: [
      { condition: "Hypernatremia (>145 mEq/L)", explanation: "Causes: dehydration, diabetes insipidus, excessive sodium intake, hypertonic IV solutions. Cells shrink as water moves out by osmosis. Neurological symptoms: confusion, lethargy, seizures, coma." }
    ],
    lowSignificance: [
      { condition: "Hyponatremia (<136 mEq/L)", explanation: "Causes: SIADH, heart failure, cirrhosis, excessive hypotonic IV fluids, diuretic use. Cells swell as water moves in. Neurological symptoms: headache, confusion, nausea, seizures, cerebral edema." }
    ],
    interpretation: "Sodium reflects WATER balance. Hyponatremia usually means too much water (dilutional). Hypernatremia usually means not enough water (concentration). Treatment focuses on correcting the water imbalance. Correct sodium slowly (≤10-12 mEq/L per 24 hours) to prevent osmotic demyelination syndrome (central pontine myelinolysis).",
    associatedConditions: ["SIADH (dilutional hyponatremia — excess ADH retains water)", "Diabetes insipidus (hypernatremia — insufficient ADH loses water)", "Heart failure (dilutional hyponatremia)", "Burns (hypernatremia from fluid loss)"],
    nursingImplications: [
      "Monitor neurological status — sodium changes affect brain function first",
      "Correct sodium SLOWLY: ≤10-12 mEq/L per 24 hours to prevent osmotic demyelination",
      "Hyponatremia: fluid restriction for SIADH, hypertonic saline (3%) only for severe/symptomatic",
      "Hypernatremia: replace free water (hypotonic fluids — 0.45% NS or D5W)",
      "Monitor I&O and daily weights",
      "Seizure precautions for severe imbalances"
    ],
    examAlerts: [
      "Na+ <120 or >160 mEq/L = critical values",
      "SIADH = low sodium (dilutional). DI = high sodium (concentrated).",
      "Correct sodium SLOWLY — rapid correction causes osmotic demyelination syndrome",
      "Sodium is about WATER balance — hyponatremia usually means too much water"
    ],
    practiceQuestions: [
      { question: "A client with SIADH has Na+ of 118 mEq/L. What is the priority nursing intervention?", options: ["Administer normal saline wide open", "Implement fluid restriction and seizure precautions", "Encourage oral fluid intake", "Administer hypertonic (3%) saline rapidly"], correctIndex: 1, rationale: "SIADH causes dilutional hyponatremia from excess water retention. Fluid restriction is the primary intervention. Seizure precautions are essential because Na+ <120 mEq/L significantly increases seizure risk. Hypertonic saline may be used for severe/symptomatic hyponatremia but must be given slowly via pump with frequent Na+ monitoring — never 'rapidly.'", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between SIADH and diabetes insipidus?", answer: "SIADH (excess ADH): body retains too much water → dilutional hyponatremia, concentrated urine, fluid overload. Treatment: fluid restriction. Diabetes Insipidus (insufficient ADH): body loses too much water → hypernatremia, dilute urine, dehydration. Treatment: desmopressin (DDAVP) for central DI, fluid replacement." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Heart Failure Guide", href: "/nclex-rn/conditions/heart-failure", type: "condition" },
      { title: "Lab Values Overview", href: "/nclex-rn/lab-values", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "abgs", contentType: "lab-value", tier: "nclex-rn", name: "ABGs", fullName: "Arterial Blood Gases",
    metaTitle: "ABG Interpretation NCLEX-RN Guide: ROME Method, Compensation & Practice Questions (2025)",
    metaDescription: "Master ABG interpretation for the NCLEX-RN: ROME method, respiratory vs metabolic, compensation levels, clinical applications, and practice questions.",
    keywords: "ABG interpretation NCLEX-RN, arterial blood gases nursing, ROME method ABG, respiratory acidosis nursing, metabolic acidosis nursing",
    normalRangeUS: { value: "pH 7.35-7.45, PaCO2 35-45, HCO3 22-26, PaO2 80-100", unit: "mmHg" },
    normalRangeCA: { value: "pH 7.35-7.45, PaCO2 35-45, HCO3 22-26, PaO2 80-100", unit: "mmHg" },
    overview: "ABGs are the definitive assessment of oxygenation, ventilation, and acid-base balance. Interpreting ABGs requires understanding the relationship between pH, PaCO2 (respiratory component), and HCO3 (metabolic component). ABG interpretation is one of the most heavily tested clinical skills on the NCLEX-RN.",
    highSignificance: [
      { condition: "Respiratory Acidosis (pH <7.35, PaCO2 >45)", explanation: "Causes: COPD, respiratory depression (opioids, sedation), pneumonia, airway obstruction. CO2 is an acid — when retained, pH drops. Treatment: improve ventilation (bronchodilators, naloxone for opioid-induced, mechanical ventilation)." },
      { condition: "Metabolic Acidosis (pH <7.35, HCO3 <22)", explanation: "Causes: DKA, lactic acidosis (sepsis, shock), renal failure, diarrhea. Treatment: treat underlying cause (insulin for DKA, fluids for lactic acidosis), sodium bicarbonate for severe acidosis (pH <7.1)." }
    ],
    lowSignificance: [
      { condition: "Respiratory Alkalosis (pH >7.45, PaCO2 <35)", explanation: "Causes: hyperventilation (anxiety, pain, PE, fever), mechanical ventilation over-ventilation. Treatment: treat underlying cause, rebreathing techniques for anxiety-induced hyperventilation." },
      { condition: "Metabolic Alkalosis (pH >7.45, HCO3 >26)", explanation: "Causes: vomiting, NG suctioning, excessive antacids, hypokalemia. Treatment: replace chloride and potassium, treat underlying cause." }
    ],
    interpretation: "Use ROME: Respiratory Opposite (pH and PaCO2 move in opposite directions), Metabolic Equal (pH and HCO3 move in same direction). Step 1: pH → acidosis or alkalosis? Step 2: PaCO2 → respiratory cause? Step 3: HCO3 → metabolic cause? Step 4: Compensation → is the non-causative value trying to normalize pH?",
    associatedConditions: ["COPD (compensated respiratory acidosis)", "DKA (metabolic acidosis with Kussmaul breathing as respiratory compensation)", "PE (respiratory alkalosis from hyperventilation)", "Pyloric stenosis (metabolic alkalosis from vomiting HCl)"],
    nursingImplications: [
      "Allen test before arterial puncture to verify collateral circulation",
      "Apply firm pressure for 5 minutes after arterial blood draw",
      "Transport specimen on ice to the lab immediately",
      "Correlate ABG with clinical picture — never treat numbers alone",
      "Monitor for signs of acid-base imbalance: confusion, arrhythmias, muscle twitching"
    ],
    examAlerts: [
      "ROME: Respiratory = Opposite, Metabolic = Equal — the ABG interpretation framework",
      "Kussmaul respirations = body compensating for metabolic acidosis (DKA) by blowing off CO2",
      "COPD: expect compensated respiratory acidosis (normal pH, high PaCO2, high HCO3)",
      "If pH is normal but other values abnormal = fully compensated",
      "If pH is abnormal = uncompensated or partially compensated"
    ],
    practiceQuestions: [
      { question: "ABG results: pH 7.28, PaCO2 32, HCO3 16, PaO2 96. What is the interpretation?", options: ["Respiratory acidosis", "Partially compensated metabolic acidosis", "Respiratory alkalosis", "Fully compensated metabolic acidosis"], correctIndex: 1, rationale: "pH 7.28 = acidosis. HCO3 16 = low (metabolic cause — pH and HCO3 move in same direction = Metabolic Equal). PaCO2 32 = low (respiratory compensation — lungs are blowing off CO2 to raise pH). Since pH is still abnormal, this is PARTIALLY compensated metabolic acidosis. This pattern is classic for DKA (ketoacids consume bicarbonate).", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between compensated and uncompensated acid-base disorders?", answer: "Uncompensated: the pH is abnormal and only one component (PaCO2 or HCO3) is abnormal — the body has not yet tried to compensate. Partially compensated: the pH is still abnormal, but both PaCO2 and HCO3 are abnormal — the body is trying but hasn't fully corrected. Fully compensated: the pH has returned to normal range, but both PaCO2 and HCO3 remain abnormal — compensation was successful." }
    ],
    internalLinks: [
      { title: "COPD Guide", href: "/nclex-rn/conditions/copd", type: "condition" },
      { title: "Diabetes/DKA/HHS Guide", href: "/nclex-rn/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "Lab Values Overview", href: "/nclex-rn/lab-values", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "bnp", contentType: "lab-value", tier: "nclex-rn", name: "BNP", fullName: "B-type Natriuretic Peptide",
    metaTitle: "BNP Lab Values NCLEX-RN Guide: Heart Failure Biomarker & Nursing Implications (2025)",
    metaDescription: "Master BNP for the NCLEX-RN: normal range, heart failure diagnosis, cardiac vs pulmonary dyspnea differentiation, and clinical interpretation.",
    keywords: "BNP NCLEX-RN, BNP heart failure, natriuretic peptide nursing, BNP normal range, cardiac biomarker nursing",
    normalRangeUS: { value: "<100", unit: "pg/mL" },
    normalRangeCA: { value: "<100", unit: "pg/mL" },
    overview: "BNP is released by ventricular cardiomyocytes in response to volume overload and wall stretch. It is the key biomarker for diagnosing and monitoring heart failure. BNP helps differentiate cardiac dyspnea from pulmonary dyspnea — a common NCLEX-RN question.",
    highSignificance: [
      { condition: "Heart Failure", explanation: "BNP >400 pg/mL strongly suggests heart failure. Levels correlate with HF severity and prognosis. Used to guide treatment (higher levels = more aggressive diuresis)." },
      { condition: "Acute Decompensation", explanation: "Rising BNP from baseline indicates worsening heart failure. Trending BNP guides treatment response — falling levels indicate improvement." }
    ],
    lowSignificance: [
      { condition: "Normal BNP (<100 pg/mL)", explanation: "Normal BNP essentially rules out heart failure as the cause of dyspnea. Look for pulmonary causes (COPD, PE, pneumonia)." }
    ],
    interpretation: "BNP <100 pg/mL: HF unlikely. BNP 100-400 pg/mL: gray zone (may be HF or other conditions). BNP >400 pg/mL: HF highly likely. Values can be elevated in renal failure, PE, and atrial fibrillation. Obesity can falsely lower BNP levels.",
    associatedConditions: ["Heart failure (primary use)", "Acute coronary syndromes", "Pulmonary embolism", "Renal failure (reduced clearance)"],
    nursingImplications: [
      "Use BNP to help differentiate cardiac vs pulmonary dyspnea in the ED",
      "Trend BNP levels to monitor heart failure treatment response",
      "Correlate with clinical assessment: weight, edema, lung sounds, JVD",
      "Higher BNP = more severe heart failure = more aggressive treatment"
    ],
    examAlerts: [
      "BNP >400 = heart failure likely. BNP <100 = heart failure unlikely.",
      "BNP differentiates cardiac dyspnea from pulmonary dyspnea — key exam distinction",
      "Trending BNP monitors treatment response in heart failure"
    ],
    practiceQuestions: [
      { question: "A client presents with dyspnea. BNP is 750 pg/mL. What does this suggest?", options: ["COPD exacerbation", "Heart failure", "Pneumonia", "Pulmonary embolism"], correctIndex: 1, rationale: "BNP 750 pg/mL is significantly elevated (>400), strongly suggesting heart failure as the cause of dyspnea. While PE and renal failure can also elevate BNP, the level strongly points to cardiac origin. This distinction is critical in the ED for guiding treatment decisions (diuretics for HF vs. bronchodilators for COPD).", isFree: true }
    ],
    faqs: [
      { question: "Can BNP be elevated without heart failure?", answer: "Yes. BNP can be elevated in PE, renal failure (reduced clearance), atrial fibrillation, advanced age, and sepsis. However, levels >400 pg/mL are most commonly associated with heart failure. Clinical correlation with symptoms, exam findings, and other diagnostic tests is essential." }
    ],
    internalLinks: [
      { title: "Heart Failure Guide", href: "/nclex-rn/conditions/heart-failure", type: "condition" },
      { title: "Lab Values Overview", href: "/nclex-rn/lab-values", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "troponin", contentType: "lab-value", tier: "nclex-rn", name: "Troponin", fullName: "Cardiac Troponin I/T",
    metaTitle: "Troponin Lab Values NCLEX-RN Guide: MI Diagnosis & Nursing Implications (2025)",
    metaDescription: "Master troponin for the NCLEX-RN: gold standard MI biomarker, serial testing, clinical interpretation, and nursing implications.",
    keywords: "troponin NCLEX-RN, cardiac troponin nursing, MI biomarker, troponin normal range, myocardial infarction labs",
    normalRangeUS: { value: "<0.04", unit: "ng/mL" },
    normalRangeCA: { value: "<0.04", unit: "ng/mL" },
    overview: "Cardiac troponin (I or T) is the gold standard biomarker for detecting myocardial necrosis. It is highly specific to cardiac muscle and is the definitive lab test for diagnosing myocardial infarction. Serial troponin measurements (0, 3, 6 hours) are used to confirm or rule out MI.",
    highSignificance: [
      { condition: "Myocardial Infarction", explanation: "Troponin rises within 3-6 hours of myocardial injury, peaks at 12-24 hours, and remains elevated for 7-14 days. Rising pattern on serial measurements confirms acute MI." },
      { condition: "Other causes of elevated troponin", explanation: "Heart failure, myocarditis, PE, renal failure, sepsis, cardiac contusion. Elevated troponin without ACS context requires clinical correlation." }
    ],
    lowSignificance: [
      { condition: "Normal troponin", explanation: "Normal troponin (<0.04 ng/mL) rules out myocardial necrosis at the time of testing. Serial measurements are needed because troponin may be normal in the first 3-6 hours after symptom onset." }
    ],
    interpretation: "A single normal troponin does NOT rule out MI — serial measurements (0, 3, 6 hours) are required. A rising pattern (delta troponin) is more diagnostic than a single elevated value. High-sensitivity troponin assays can detect smaller infarctions and rise earlier.",
    associatedConditions: ["Acute myocardial infarction (STEMI, NSTEMI)", "Myocarditis", "Pulmonary embolism", "Heart failure", "Cardiac contusion"],
    nursingImplications: [
      "Draw serial troponins per protocol (0, 3, 6 hours)",
      "Correlate with ECG findings and clinical presentation",
      "Do not delay treatment while awaiting troponin results in suspected STEMI",
      "Elevated troponin + ST elevation + chest pain = STEMI — emergent cath lab activation"
    ],
    examAlerts: [
      "Troponin is the GOLD STANDARD for MI diagnosis",
      "Serial troponins needed — single normal value does NOT rule out MI",
      "Troponin rises 3-6 hours after injury — may be normal early",
      "Do NOT delay STEMI treatment for troponin results (ECG + clinical picture sufficient)"
    ],
    practiceQuestions: [
      { question: "A client with chest pain has a troponin of 0.02 ng/mL. The ECG is normal. Can MI be ruled out?", options: ["Yes — normal troponin rules out MI", "No — serial troponins are needed because it may be too early", "Yes — normal ECG and troponin together rule out MI", "No — CK-MB is needed to confirm"], correctIndex: 1, rationale: "A single normal troponin does NOT rule out MI. Troponin may not rise above the detection threshold for 3-6 hours after symptom onset. Serial measurements (0, 3, 6 hours) are required for definitive rule-out. The chest pain occurred recently enough that troponin elevation may not have developed yet.", isFree: true }
    ],
    faqs: [
      { question: "What is the difference between troponin I and troponin T?", answer: "Both are highly specific to cardiac muscle and equally effective for diagnosing MI. Troponin I is only found in cardiac muscle. Troponin T is found in cardiac muscle but can also be mildly elevated in skeletal muscle disease. Most hospitals use one or the other — the clinical interpretation is the same." }
    ],
    internalLinks: [
      { title: "MI/ACS Guide", href: "/nclex-rn/conditions/mi-acs", type: "condition" },
      { title: "Heart Failure Guide", href: "/nclex-rn/conditions/heart-failure", type: "condition" },
      { title: "Lab Values Overview", href: "/nclex-rn/lab-values", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "a1c", contentType: "lab-value", tier: "nclex-rn", name: "A1C", fullName: "Hemoglobin A1C (Glycosylated Hemoglobin)",
    metaTitle: "A1C Lab Values NCLEX-RN Guide: Diabetes Monitoring & Target Ranges (2025)",
    metaDescription: "Master HbA1C for the NCLEX-RN: 2-3 month glucose average, diagnostic criteria, target ranges, and nursing implications for diabetes management.",
    keywords: "A1C NCLEX-RN, hemoglobin A1C nursing, HbA1C diabetes, glycosylated hemoglobin, A1C target range",
    normalRangeUS: { value: "<5.7%", unit: "%" },
    normalRangeCA: { value: "<5.7%", unit: "%" },
    overview: "HbA1C measures the percentage of hemoglobin glycosylated by glucose over the lifespan of red blood cells (approximately 120 days), reflecting average blood glucose control over the past 2-3 months. It is the gold standard for monitoring long-term diabetes management and is used for diagnosis.",
    highSignificance: [
      { condition: "Diabetes Diagnosis: A1C ≥6.5%", explanation: "Diagnostic for diabetes mellitus. Does not require fasting. Confirms chronic hyperglycemia." },
      { condition: "Prediabetes: A1C 5.7-6.4%", explanation: "Indicates increased risk for developing Type 2 diabetes. Lifestyle modifications recommended." }
    ],
    lowSignificance: [
      { condition: "Normal: A1C <5.7%", explanation: "Normal glucose metabolism. No further diabetes screening needed at this time." }
    ],
    interpretation: "A1C <7% is the target for most adults with diabetes (per ADA). Each 1% change in A1C corresponds to approximately 30 mg/dL change in average blood glucose. A1C results can be falsely affected by hemolytic anemias, chronic kidney disease, hemoglobin variants, recent transfusions, and pregnancy.",
    associatedConditions: ["Type 1 diabetes mellitus", "Type 2 diabetes mellitus", "Gestational diabetes (not used for screening — use OGTT)", "Prediabetes"],
    nursingImplications: [
      "A1C reflects 2-3 month average — not affected by recent meals or acute illness",
      "Target <7% for most adults with diabetes (may be individualized by provider)",
      "Educate patients that A1C is a 'big picture' view of glucose control",
      "Use to assess adherence to treatment plan and guide medication adjustments",
      "Monitor every 3 months until at goal, then every 6 months if stable"
    ],
    examAlerts: [
      "A1C ≥6.5% = diabetes. A1C 5.7-6.4% = prediabetes.",
      "Target <7% for most diabetic adults",
      "Reflects 2-3 MONTHS of glucose control — not a snapshot",
      "Does NOT require fasting — can be drawn anytime"
    ],
    practiceQuestions: [
      { question: "A Type 2 diabetic client has an A1C of 9.2%. What does this indicate?", options: ["Well-controlled diabetes", "Poorly controlled diabetes over the past 2-3 months", "Acute hyperglycemia", "Prediabetes"], correctIndex: 1, rationale: "A1C of 9.2% is significantly above the target of <7%, indicating poor glycemic control over the past 2-3 months. This warrants medication adjustment, reinforcement of dietary and exercise recommendations, and assessment for barriers to adherence. It does not reflect acute status — it is a long-term measure.", isFree: true }
    ],
    faqs: [
      { question: "Can a patient have a normal fasting glucose but elevated A1C?", answer: "Yes. A1C captures average glucose over 2-3 months, including postprandial spikes that fasting glucose misses. A patient may have well-controlled fasting glucose but significant post-meal hyperglycemia, resulting in an elevated A1C. This is why A1C provides a more complete picture of glucose management than fasting glucose alone." }
    ],
    internalLinks: [
      { title: "Diabetes/DKA/HHS Guide", href: "/nclex-rn/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "Metformin Guide", href: "/nclex-rn/medications/metformin", type: "medication" },
      { title: "Insulin Types Guide", href: "/nclex-rn/medications/insulin-types", type: "medication" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  }
];

export const nclexRnComparisons: NclexRnComparisonPage[] = [
  {
    slug: "dka-vs-hhs", contentType: "comparison", tier: "nclex-rn",
    metaTitle: "DKA vs HHS: Side-by-Side Comparison for the NCLEX-RN (2025)",
    metaDescription: "Compare DKA and HHS for the NCLEX-RN: pathophysiology, clinical presentation, lab differences, treatment, and clinical judgment practice questions.",
    keywords: "DKA vs HHS, diabetic ketoacidosis vs HHS, NCLEX-RN DKA HHS, DKA HHS comparison nursing",
    h1: "DKA vs HHS — NCLEX-RN Clinical Comparison",
    introText: "Diabetic Ketoacidosis (DKA) and Hyperosmolar Hyperglycemic State (HHS) are both diabetic emergencies, but they have critical differences in pathophysiology, presentation, and management. This comparison is one of the most frequently tested topics on the NCLEX-RN.",
    conditionA: {
      name: "DKA (Diabetic Ketoacidosis)",
      features: {
        "Type": "Primarily Type 1 DM", "Onset": "Hours (rapid)", "Glucose": "250-800 mg/dL",
        "pH": "<7.30 (metabolic acidosis)", "Ketones": "Strongly positive",
        "Osmolality": "300-320 mOsm/kg", "Fluid Deficit": "3-6 liters",
        "Key Sign": "Kussmaul respirations, fruity breath", "Mortality": "~1-5%",
        "Insulin": "Absolute deficiency", "Treatment Priority": "Insulin + IV fluids + K+ monitoring"
      }
    },
    conditionB: {
      name: "HHS (Hyperosmolar Hyperglycemic State)",
      features: {
        "Type": "Primarily Type 2 DM", "Onset": "Days to weeks (gradual)", "Glucose": ">600 mg/dL (often >1000)",
        "pH": ">7.30 (usually no significant acidosis)", "Ketones": "Absent or minimal",
        "Osmolality": ">320 mOsm/kg (severely elevated)", "Fluid Deficit": "8-12 liters",
        "Key Sign": "Altered mental status, seizures", "Mortality": "~10-20%",
        "Insulin": "Relative deficiency (enough to prevent ketosis)", "Treatment Priority": "Aggressive fluid resuscitation (priority) + insulin"
      }
    },
    comparisonCategories: ["Type", "Onset", "Glucose", "pH", "Ketones", "Osmolality", "Fluid Deficit", "Key Sign", "Mortality", "Insulin", "Treatment Priority"],
    keyDifferences: [
      "DKA has ketones and acidosis; HHS does NOT — this is the fundamental pathophysiological difference.",
      "HHS has much higher glucose levels (often >1000 mg/dL) and more severe dehydration (8-12 liters).",
      "HHS has higher mortality (10-20%) despite appearing less 'dramatic' than DKA.",
      "In DKA, the primary metabolic derangement is ACIDOSIS. In HHS, it is DEHYDRATION and HYPEROSMOLALITY.",
      "DKA develops rapidly (hours). HHS develops gradually over days to weeks."
    ],
    clinicalPearls: [
      "Kussmaul respirations + fruity breath = DKA. Altered mental status + extreme hyperglycemia = HHS.",
      "Both require: IV fluids, insulin, potassium monitoring — but the priorities differ.",
      "In DKA, insulin is critical to stop ketogenesis. In HHS, fluid resuscitation is the first priority.",
      "Check potassium BEFORE insulin in BOTH conditions — hypokalemia can be fatal.",
      "Do NOT stop insulin in DKA when glucose normalizes — continue until anion gap closes."
    ],
    practiceQuestions: [
      { question: "A client presents with BG 1,050 mg/dL, pH 7.35, negative ketones, and severe dehydration. The nurse recognizes this as:", options: ["DKA", "HHS", "Type 1 diabetes onset", "Metabolic acidosis"], correctIndex: 1, rationale: "Extremely elevated glucose (>1000), normal pH (no acidosis), negative ketones, and severe dehydration = classic HHS. DKA would present with acidosis (pH <7.30) and positive ketones. This distinction is critical because HHS management prioritizes aggressive fluid resuscitation.", isFree: true },
      { question: "What differentiates DKA from HHS on a cellular level?", options: ["Glucose levels", "Degree of dehydration", "Presence of residual insulin preventing ketogenesis", "Type of diabetes"], correctIndex: 2, rationale: "The fundamental difference is insulin: DKA has ABSOLUTE insulin deficiency (no insulin → fat breakdown → ketones → acidosis). HHS has RELATIVE insulin deficiency — enough residual insulin to prevent lipolysis and ketogenesis, but not enough to control glucose. This is why HHS has no significant ketosis or acidosis.", isFree: true }
    ],
    faqs: [
      { question: "Can a Type 2 diabetic develop DKA?", answer: "Yes, though rare. Type 2 diabetics can develop DKA during severe physiological stress (sepsis, major surgery, MI) when counter-regulatory hormones overwhelm residual insulin production. This is sometimes called 'ketosis-prone Type 2 diabetes.' SGLT2 inhibitors can also cause euglycemic DKA in Type 2 diabetics." }
    ],
    internalLinks: [
      { title: "Diabetes/DKA/HHS Guide", href: "/nclex-rn/conditions/diabetes-dka-hhs", type: "condition" },
      { title: "Insulin Types Guide", href: "/nclex-rn/medications/insulin-types", type: "medication" },
      { title: "Potassium Lab Values", href: "/nclex-rn/lab-values/potassium", type: "lab-value" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "viral-vs-bacterial-pneumonia", contentType: "comparison", tier: "nclex-rn",
    metaTitle: "Viral vs Bacterial Pneumonia: NCLEX-RN Comparison Guide (2025)",
    metaDescription: "Compare viral and bacterial pneumonia for the NCLEX-RN: etiology, presentation, diagnostics, treatment differences, and practice questions.",
    keywords: "viral vs bacterial pneumonia, pneumonia comparison NCLEX-RN, pneumonia nursing comparison",
    h1: "Viral vs Bacterial Pneumonia — NCLEX-RN Comparison",
    introText: "Distinguishing viral from bacterial pneumonia guides treatment decisions — antibiotics are effective only against bacteria. Understanding the key differences in presentation, diagnostics, and management is essential for NCLEX-RN success.",
    conditionA: { name: "Viral Pneumonia", features: { "Onset": "Gradual (over days)", "Sputum": "Scant, clear/white", "WBC": "Normal or mildly elevated", "Fever": "Low-grade", "CXR": "Diffuse, bilateral interstitial infiltrates", "Treatment": "Supportive care; antivirals for influenza (oseltamivir)", "Complications": "Secondary bacterial pneumonia", "Common Causes": "Influenza, RSV, COVID-19, adenovirus" } },
    conditionB: { name: "Bacterial Pneumonia", features: { "Onset": "Sudden (hours)", "Sputum": "Productive, purulent (yellow/green/rust)", "WBC": "Elevated (>15,000) with left shift", "Fever": "High (>38.9°C/102°F)", "CXR": "Lobar consolidation (focal)", "Treatment": "Antibiotics (azithromycin, ceftriaxone)", "Complications": "Sepsis, empyema, lung abscess", "Common Causes": "S. pneumoniae (#1), H. influenzae, S. aureus" } },
    comparisonCategories: ["Onset", "Sputum", "WBC", "Fever", "CXR", "Treatment", "Complications", "Common Causes"],
    keyDifferences: [
      "Bacterial pneumonia has a more SUDDEN onset with HIGH fever and PURULENT sputum.",
      "Viral pneumonia is more GRADUAL with LOW-grade fever and SCANT/clear sputum.",
      "Bacterial pneumonia shows LOBAR consolidation on CXR; viral shows DIFFUSE bilateral infiltrates.",
      "Antibiotics are effective ONLY for bacterial pneumonia — not viral.",
      "Procalcitonin >2 ng/mL strongly suggests bacterial etiology."
    ],
    clinicalPearls: [
      "Purulent sputum + high fever + lobar CXR = bacterial. Treat with antibiotics.",
      "Obtain sputum culture BEFORE starting antibiotics to identify organism.",
      "Elderly may present atypically — confusion may be the FIRST and only sign.",
      "Viral pneumonia can predispose to secondary bacterial infection — monitor for worsening."
    ],
    practiceQuestions: [
      { question: "A client presents with gradual onset of dry cough, low-grade fever, and diffuse bilateral infiltrates on CXR. WBC is 9,500. What type of pneumonia is most likely?", options: ["Bacterial pneumonia", "Viral pneumonia", "Aspiration pneumonia", "Fungal pneumonia"], correctIndex: 1, rationale: "Gradual onset, dry/nonproductive cough, low-grade fever, normal WBC, and bilateral diffuse infiltrates are characteristic of viral pneumonia. Bacterial pneumonia presents with sudden onset, productive purulent sputum, high fever, elevated WBC, and focal lobar consolidation.", isFree: true }
    ],
    faqs: [
      { question: "Should antibiotics be given for viral pneumonia?", answer: "Antibiotics are NOT effective against viruses and should not be given for confirmed viral pneumonia. However, in practice, bacterial pneumonia is often difficult to completely rule out, so empiric antibiotics may be started pending culture results. For influenza pneumonia, oseltamivir (Tamiflu) may be given within 48 hours of symptom onset." }
    ],
    internalLinks: [
      { title: "Pneumonia Guide", href: "/nclex-rn/conditions/pneumonia", type: "condition" },
      { title: "Sepsis Guide", href: "/nclex-rn/conditions/sepsis", type: "condition" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "iron-deficiency-vs-b12-deficiency", contentType: "comparison", tier: "nclex-rn",
    metaTitle: "Iron Deficiency vs B12 Deficiency Anemia: NCLEX-RN Comparison (2025)",
    metaDescription: "Compare iron deficiency and B12 deficiency anemia for the NCLEX-RN: pathophysiology, lab findings, clinical presentation, treatment, and practice questions.",
    keywords: "iron deficiency vs B12 deficiency, anemia comparison NCLEX-RN, microcytic vs macrocytic anemia nursing",
    h1: "Iron Deficiency vs B12 Deficiency Anemia — NCLEX-RN Comparison",
    introText: "Both iron deficiency and B12 deficiency cause anemia, but they have distinctly different pathophysiology, lab findings, and treatments. Understanding the RBC size difference (microcytic vs. macrocytic) is key to differentiating these on the NCLEX-RN.",
    conditionA: { name: "Iron Deficiency Anemia", features: { "RBC Size": "Microcytic (MCV <80 fL)", "Cause": "Blood loss (GI, menstruation), poor dietary intake, malabsorption", "Key Labs": "Low ferritin, low serum iron, high TIBC", "Symptoms": "Fatigue, pallor, tachycardia, pica, koilonychia (spoon nails)", "Treatment": "Oral iron (ferrous sulfate) with vitamin C, IV iron if intolerant", "Nursing": "Take iron on empty stomach with OJ (vitamin C enhances absorption). Expect dark/black stools. Liquid iron through straw (stains teeth)." } },
    conditionB: { name: "B12 Deficiency Anemia", features: { "RBC Size": "Macrocytic (MCV >100 fL)", "Cause": "Pernicious anemia (no intrinsic factor), malabsorption, vegetarian diet, long-term metformin", "Key Labs": "Low B12 level, elevated MCV, elevated methylmalonic acid", "Symptoms": "Fatigue, pallor, glossitis, peripheral neuropathy (tingling, numbness), balance problems", "Treatment": "IM cyanocobalamin (B12) injections (monthly for life if pernicious anemia)", "Nursing": "B12 injections if intrinsic factor absent (oral won't be absorbed). Monitor neurological symptoms. Neurological damage may be irreversible if treatment delayed." } },
    comparisonCategories: ["RBC Size", "Cause", "Key Labs", "Symptoms", "Treatment", "Nursing"],
    keyDifferences: [
      "Iron deficiency = MICROCYTIC (small RBCs). B12 deficiency = MACROCYTIC (large RBCs).",
      "B12 deficiency causes NEUROLOGICAL symptoms (peripheral neuropathy, balance problems). Iron deficiency does NOT.",
      "Iron deficiency is treated with ORAL iron. B12 deficiency (pernicious anemia) requires IM INJECTIONS.",
      "Iron deficiency anemia is the MOST COMMON anemia worldwide.",
      "Ferritin is the BEST indicator of iron stores."
    ],
    clinicalPearls: [
      "Microcytic (small) = Iron deficiency. Macrocytic (large) = B12/folate deficiency.",
      "Neurological symptoms (paresthesias, ataxia) = think B12 deficiency, NOT iron.",
      "Pernicious anemia = autoimmune destruction of parietal cells → no intrinsic factor → can't absorb B12 orally → need IM injections.",
      "Long-term metformin use can cause B12 deficiency — monitor levels periodically."
    ],
    practiceQuestions: [
      { question: "A client has fatigue, pallor, and peripheral neuropathy with tingling in the hands and feet. MCV is 112 fL. What type of anemia is most likely?", options: ["Iron deficiency anemia", "B12 deficiency anemia", "Folate deficiency anemia", "Anemia of chronic disease"], correctIndex: 1, rationale: "Macrocytic anemia (MCV 112 fL >100) + neurological symptoms (peripheral neuropathy, tingling) = B12 deficiency. While folate deficiency also causes macrocytic anemia, it does NOT cause neurological symptoms. This distinction is critical for the NCLEX-RN.", isFree: true }
    ],
    faqs: [
      { question: "Why does B12 deficiency cause neurological symptoms but iron deficiency doesn't?", answer: "Vitamin B12 is essential for myelin synthesis in the nervous system. Without B12, myelin sheaths deteriorate, causing demyelination of peripheral nerves and the spinal cord — resulting in paresthesias, peripheral neuropathy, and balance problems. Iron is not involved in myelin synthesis, so iron deficiency does not cause neurological damage." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Metformin Guide", href: "/nclex-rn/medications/metformin", type: "medication" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "stable-vs-unstable-angina", contentType: "comparison", tier: "nclex-rn",
    metaTitle: "Stable vs Unstable Angina: NCLEX-RN Comparison Guide (2025)",
    metaDescription: "Compare stable and unstable angina for the NCLEX-RN: pathophysiology, presentation, ECG findings, treatment, and emergency management.",
    keywords: "stable vs unstable angina, angina comparison NCLEX-RN, chest pain nursing assessment, ACS angina nursing",
    h1: "Stable vs Unstable Angina — NCLEX-RN Comparison",
    introText: "Differentiating stable from unstable angina is critical because unstable angina is a medical emergency (acute coronary syndrome) that can progress to myocardial infarction. Understanding the key differences guides immediate nursing actions.",
    conditionA: { name: "Stable Angina", features: { "Pattern": "Predictable — occurs with exertion, stress, or heavy meals", "Duration": "<5 minutes (typically 3-5 minutes)", "Relief": "Relieved by rest and/or nitroglycerin", "Troponin": "Normal (no myocardial necrosis)", "ECG": "ST depression during episode, normalizes at rest", "Pathology": "Fixed atherosclerotic plaque causing narrowing", "Treatment": "Lifestyle modifications, beta-blockers, nitrates, aspirin, statins", "Emergency": "Not a medical emergency — managed outpatient" } },
    conditionB: { name: "Unstable Angina", features: { "Pattern": "Unpredictable — occurs at REST or with minimal exertion", "Duration": ">20 minutes or crescendo pattern", "Relief": "NOT fully relieved by rest or nitroglycerin", "Troponin": "Normal (distinguishes from NSTEMI)", "ECG": "ST depression or T-wave inversion (may be dynamic)", "Pathology": "Ruptured plaque with partial thrombus formation", "Treatment": "Hospitalization, anticoagulation, risk stratification, possible PCI", "Emergency": "Medical emergency — part of Acute Coronary Syndrome" } },
    comparisonCategories: ["Pattern", "Duration", "Relief", "Troponin", "ECG", "Pathology", "Treatment", "Emergency"],
    keyDifferences: [
      "Stable angina is PREDICTABLE and relieved by rest/NTG. Unstable angina is UNPREDICTABLE and NOT fully relieved.",
      "Unstable angina is an ACS emergency — admit, anticoagulate, and risk-stratify. Stable angina is managed outpatient.",
      "Both have NORMAL troponin. Elevated troponin + unstable angina features = NSTEMI.",
      "Unstable angina can progress to MI at any time — continuous cardiac monitoring required."
    ],
    clinicalPearls: [
      "If chest pain occurs at REST, assume unstable angina until proven otherwise — treat as ACS.",
      "NTG test: if 3 SL NTG doses (q5 min) do not relieve pain → unstable angina/MI → activate ACS protocol.",
      "Unstable angina + elevated troponin = NSTEMI (upgrade in severity).",
      "New-onset exertional angina or a CHANGE in stable angina pattern → treat as unstable."
    ],
    practiceQuestions: [
      { question: "A client reports chest pain that occurs at rest, lasts >20 minutes, and is not relieved by nitroglycerin. Troponin is normal. What is the most likely diagnosis?", options: ["Stable angina", "Unstable angina", "NSTEMI", "STEMI"], correctIndex: 1, rationale: "Chest pain at rest, duration >20 minutes, and unresponsive to nitroglycerin with NORMAL troponin = unstable angina. If troponin were elevated, this would be NSTEMI. Stable angina is predictable, brief, and relieved by rest/NTG. This is an ACS emergency requiring hospitalization.", isFree: true }
    ],
    faqs: [
      { question: "Why is unstable angina an emergency if troponin is normal?", answer: "Although troponin is normal (no myocardial necrosis yet), unstable angina indicates a ruptured atherosclerotic plaque with partial thrombus formation. The thrombus can progress to complete coronary occlusion at any time, causing acute MI. This 'pre-infarction' state requires immediate hospitalization, anticoagulation, and cardiac monitoring to prevent progression." }
    ],
    internalLinks: [
      { title: "MI/ACS Guide", href: "/nclex-rn/conditions/mi-acs", type: "condition" },
      { title: "Troponin Lab Values", href: "/nclex-rn/lab-values/troponin", type: "lab-value" },
      { title: "Heparin Guide", href: "/nclex-rn/medications/heparin", type: "medication" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  }
];

export const nclexRnStrategies: NclexRnStrategyPage[] = [
  {
    slug: "how-to-study-for-nclex-rn", contentType: "strategy", tier: "nclex-rn",
    metaTitle: "How to Study for the NCLEX-RN: Complete Study Guide & Strategy (2025)",
    metaDescription: "Proven NCLEX-RN study strategies: structured study plan, content prioritization, practice question approach, NGN preparation, and test day tips.",
    keywords: "how to study for NCLEX-RN, NCLEX-RN study guide, NCLEX study plan, NCLEX preparation tips, pass NCLEX first time",
    h1: "How to Study for the NCLEX-RN: A Complete Guide",
    introText: "Passing the NCLEX-RN on your first attempt requires a systematic, evidence-based approach to preparation. This guide provides a structured study plan, content prioritization framework, and proven strategies used by successful candidates.",
    sections: [
      { heading: "Create a Structured Study Plan", content: "A 6-12 week study plan structured around the Client Needs blueprint is the foundation of NCLEX preparation. Allocate study time proportionally: Physiological Integrity (38-62%) and Management of Care (17-23%) deserve the most attention. Use the 60/30/10 rule daily: 60% practice questions with rationale review, 30% targeted content review, 10% test-taking strategies and self-care.", tips: ["Block 4-8 hours daily for dedicated study", "Take one full day off per week to prevent burnout", "Start with your weakest content areas", "Schedule full-length CAT practice exams weekly in the final 3 weeks"] },
      { heading: "Master the Practice Question Approach", content: "Active recall through practice questions is the single most effective NCLEX preparation strategy. Aim for 2,000-3,000 questions during your study period. Quality matters more than quantity — read EVERY rationale, even for questions you answer correctly. Track performance by Client Needs category to identify and address weak areas.", tips: ["Read the question stem carefully — what is actually being asked?", "Identify the client (age, diagnosis, acuity) before selecting an answer", "Use ABCs → Maslow's → Acute vs Chronic for prioritization questions", "Review rationales for ALL four options, not just the correct one"] },
      { heading: "Prepare for NGN Question Types", content: "20-25% of scored items use NGN formats. Practice with unfolding case studies, matrix items, trend items, and bowtie items. Focus on the Clinical Judgment Measurement Model (CJMM): Recognize Cues → Analyze Cues → Prioritize Hypotheses → Generate Solutions → Take Action → Evaluate Outcomes.", tips: ["Practice with 6-question case studies that follow a patient over time", "For trend items, look for patterns — what changed and why?", "For bowtie items, connect risk factors → condition → interventions", "NGN items offer partial credit — attempt every part even if unsure"] },
      { heading: "Test Day Readiness", content: "Sleep 7-8 hours the night before. Eat a balanced meal with protein. Arrive 30 minutes early. Use the tutorial time to get comfortable. Read every word of every question. Take both scheduled breaks. Trust your preparation.", tips: ["Do NOT cram the night before — light review only, then relax", "Bring your approved ID and a light snack for breaks", "Take the optional breaks even if you feel fine — fatigue impairs judgment", "If you finish early, do not second-guess — you likely did well"] }
    ],
    practiceQuestions: [
      { question: "A nursing graduate has been studying for 10 weeks using primarily content reading without practice questions. On practice exams, they score 55-60%. What is the most effective change to their study approach?", options: ["Study for 4 more weeks with the same approach", "Switch to 60% practice questions with rationale review", "Focus exclusively on pharmacology", "Take the exam immediately"], correctIndex: 1, rationale: "The student's approach (passive reading) is ineffective — active recall through practice questions with rationale review is significantly more effective. The 60/30/10 rule (60% questions, 30% content review, 10% strategies) would shift their approach to evidence-based learning. More passive studying will not improve scores.", isFree: true }
    ],
    faqs: [
      { question: "How many practice questions should I do before the NCLEX-RN?", answer: "Aim for 2,000-3,000 total practice questions during your preparation. In the final 2-3 weeks, complete 100-150 questions daily across all content areas. Quality matters: always read rationales for both correct and incorrect answers." },
      { question: "What if I am consistently scoring 60-65% on practice tests?", answer: "Scores of 60-65% indicate you are near the passing threshold but need improvement. Identify your weakest Client Needs categories and dedicate extra practice time to those areas. Ensure you are reading rationales thoroughly and understanding WHY answers are correct or incorrect, not just whether you got them right." }
    ],
    internalLinks: [
      { title: "NCLEX-RN Exam Prep Hub", href: "/nclex-rn", type: "hub" },
      { title: "Practice Questions", href: "/nclex-rn/practice-questions", type: "category" },
      { title: "NGN Guide", href: "/nclex-rn/ngn", type: "category" },
      { title: "Exam Strategy", href: "/nclex-rn/exam-strategy", type: "category" },
      { title: "Mock Exams", href: "/mock-exams", type: "question-bank" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "prioritization-tips", contentType: "strategy", tier: "nclex-rn",
    metaTitle: "NCLEX-RN Prioritization Tips: ABCs, Maslow's & Decision Frameworks (2025)",
    metaDescription: "Master prioritization for the NCLEX-RN with proven frameworks: ABCs, Maslow's Hierarchy, acute vs chronic, and delegation decision trees.",
    keywords: "NCLEX-RN prioritization tips, nursing prioritization framework, ABCs nursing, Maslow priority nursing",
    h1: "NCLEX-RN Prioritization Tips & Decision Frameworks",
    introText: "Prioritization questions are among the most challenging on the NCLEX-RN because multiple options may seem correct. Using systematic frameworks helps you consistently identify the MOST important action. This guide provides the decision trees and frameworks used by successful candidates.",
    sections: [
      { heading: "The Priority Assessment Framework", content: "Apply frameworks in order: (1) ABCs — Airway always first unless cardiac arrest. (2) Maslow's — Physiological before safety before psychosocial. (3) Acute vs Chronic — New or changing status before stable chronic conditions. (4) Actual vs Risk — Active problems before potential problems. (5) Nursing Process — Assessment before intervention (assess first, then act).", tips: ["If two options address ABCs, choose the MORE life-threatening situation", "If two options are both physiological, choose the UNSTABLE client", "If the question asks 'what to do FIRST,' assessment is often correct", "If assessment data is already provided, choose the appropriate INTERVENTION"] },
      { heading: "Who to See First?", content: "When asked which client to assess first: look for the client whose condition is NEW, UNEXPECTED, or CHANGING. A post-op client with new symptoms takes priority over a stable chronic client. An unexpected finding takes priority over an expected finding. Any airway or breathing compromise takes priority over everything else.", tips: ["New-onset symptoms > chronic stable symptoms", "Unexpected findings > expected findings", "Altered vitals > stable vitals", "Changes from baseline > assessments that match the disease process"] },
      { heading: "Common Prioritization Traps", content: "Trap 1: Choosing 'call the provider' when an independent nursing action should come first. Trap 2: Choosing reassessment when the data clearly indicates a need for intervention. Trap 3: Selecting a teaching/psychosocial intervention when a physiological need exists. Trap 4: Choosing a risk-for diagnosis over an actual problem.", tips: ["Nurses can act independently within scope — don't always 'call the doctor'", "If ABG/vital signs are clearly abnormal, ACT — don't just 'monitor and reassess'", "Teaching can wait; breathing cannot", "Actual bleeding > risk for bleeding"] }
    ],
    practiceQuestions: [
      { question: "The nurse has four clients. Which should be assessed FIRST? A) COPD with SpO2 90% on 2L NC. B) Post-op appendectomy with temp 37.8°C. C) Heart failure with new dyspnea at rest. D) Type 2 diabetes with fasting glucose 180.", options: ["Client A", "Client B", "Client C", "Client D"], correctIndex: 2, rationale: "Client C has NEW dyspnea at rest — this is a change from baseline indicating acute HF decompensation (potential pulmonary edema). Client A's SpO2 90% on 2L may be expected for COPD. Client B has a low-grade post-op temp (expected). Client D has mildly elevated glucose (chronic, stable). Always prioritize NEW/CHANGING over STABLE/EXPECTED.", isFree: true }
    ],
    faqs: [
      { question: "How do I choose between two clients who both have abnormal vitals?", answer: "When two clients both have abnormal findings, ask: (1) Which condition is more immediately life-threatening? (2) Which finding represents a CHANGE from expected? (3) Which requires RN-level assessment (vs. something a UAP could monitor)? The more acute, unexpected, and life-threatening situation takes priority." }
    ],
    internalLinks: [
      { title: "Prioritization & Delegation", href: "/nclex-rn/prioritization-and-delegation", type: "category" },
      { title: "Practice Questions", href: "/nclex-rn/practice-questions", type: "category" },
      { title: "Exam Strategy", href: "/nclex-rn/exam-strategy", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "clinical-judgment-framework", contentType: "strategy", tier: "nclex-rn",
    metaTitle: "NCLEX-RN Clinical Judgment Framework: CJMM & NGN Strategy (2025)",
    metaDescription: "Master the Clinical Judgment Measurement Model for the NCLEX-RN: 6 cognitive skills, NGN question mapping, and systematic approach to clinical reasoning.",
    keywords: "clinical judgment NCLEX-RN, CJMM nursing, clinical judgment measurement model, NGN clinical judgment, clinical reasoning nursing",
    h1: "Clinical Judgment Framework for the NCLEX-RN",
    introText: "The Clinical Judgment Measurement Model (CJMM) is the foundation of every NGN item on the NCLEX-RN. Understanding this framework transforms how you approach questions — instead of guessing, you systematically apply the same cognitive process used by expert clinicians.",
    sections: [
      { heading: "The 6 Cognitive Skills of the CJMM", content: "1. RECOGNIZE CUES: Identify relevant clinical data from the background noise. What findings are abnormal? What information matters? 2. ANALYZE CUES: Interpret what the data means. Connect findings to possible conditions. 3. PRIORITIZE HYPOTHESES: Rank possible explanations by urgency and likelihood. What is the MOST likely problem? 4. GENERATE SOLUTIONS: Identify appropriate interventions for the priority hypothesis. 5. TAKE ACTION: Implement the priority intervention(s). 6. EVALUATE OUTCOMES: Was the intervention effective? What should you do next?", tips: ["Each NGN item targets 1-2 of these cognitive skills", "Identifying WHICH skill is being tested helps you approach the question correctly", "Case studies progress through all 6 skills across their 6 questions"] },
      { heading: "Applying CJMM to NCLEX Questions", content: "For every question, ask yourself: (1) What type of question is this? (Recognize, Analyze, Prioritize, Generate, Act, Evaluate). (2) What clinical data is provided? (vitals, labs, assessment findings, history). (3) What changed or what is abnormal? (focus on deviations from normal). (4) What is the most important/urgent finding? (prioritize). (5) What should the nurse do? (independent nursing action first, then collaborative).", tips: ["'Which findings are concerning?' = Recognize Cues", "'What condition does this data suggest?' = Analyze Cues", "'What is the priority problem?' = Prioritize Hypotheses", "'What should the nurse do?' = Generate Solutions or Take Action", "'Was the intervention effective?' = Evaluate Outcomes"] },
      { heading: "CJMM for Unfolding Case Studies", content: "Case studies present a patient evolving through a clinical scenario. Phase 1 typically tests Recognize Cues and Analyze Cues. Phase 2 tests Prioritize Hypotheses and Generate Solutions. Phase 3 tests Take Action and Evaluate Outcomes. The key is to read each phase carefully, integrate NEW information with PREVIOUS data, and adapt your clinical reasoning as the situation evolves.", tips: ["New information in Phase 2 may change your initial hypothesis — be flexible", "What CHANGED between phases is usually more important than what stayed the same", "The evaluation phase asks: Did the intervention work? If not, what next?", "Don't assume your Phase 1 hypothesis is correct — the case may reveal a different diagnosis"] }
    ],
    practiceQuestions: [
      { question: "A client's chart shows: temperature trending from 37.5°C to 38.8°C over 12 hours, increasing heart rate from 88 to 112, WBC 14,500, and cloudy urine. The nurse is asked to identify the most likely condition. Which CJMM cognitive skill is being assessed?", options: ["Recognize Cues", "Analyze Cues", "Prioritize Hypotheses", "Generate Solutions"], correctIndex: 2, rationale: "The question provides pre-analyzed data (trending vitals, lab results, clinical findings) and asks you to determine the MOST LIKELY condition. This is Prioritize Hypotheses — ranking possible diagnoses. If it asked 'which findings are relevant?' that would be Recognize Cues. If it asked 'what do these findings suggest?' that would be Analyze Cues. The distinction between analyzing and prioritizing is that prioritization requires RANKING by likelihood/urgency.", isFree: true }
    ],
    faqs: [
      { question: "Is the CJMM only relevant for NGN questions?", answer: "No. While the CJMM was explicitly developed for NGN items, the same clinical judgment process applies to ALL NCLEX questions. Traditional multiple-choice questions also test clinical reasoning — they just do it within a single-item format rather than across a case study. Using CJMM thinking improves your performance on all question types." }
    ],
    internalLinks: [
      { title: "NGN Complete Guide", href: "/nclex-rn/ngn", type: "category" },
      { title: "Practice Questions", href: "/nclex-rn/practice-questions", type: "category" },
      { title: "Exam Strategy", href: "/nclex-rn/exam-strategy", type: "category" },
      { title: "Prioritization Tips", href: "/nclex-rn/strategy/prioritization-tips", type: "strategy" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  },
  {
    slug: "ngn-question-strategy", contentType: "strategy", tier: "nclex-rn",
    metaTitle: "NGN Question Strategy: How to Approach Every NGN Item Type (2025)",
    metaDescription: "Specific strategies for each NGN question type on the NCLEX-RN: case studies, matrix items, trend items, bowtie items, and partial credit maximization.",
    keywords: "NGN question strategy, NGN item types NCLEX, unfolding case study strategy, matrix item approach, NGN partial credit",
    h1: "NGN Question Strategy: Approaching Every Item Type",
    introText: "Each NGN item type requires a specific approach. This guide provides targeted strategies for unfolding case studies, matrix items, trend items, bowtie items, and other NGN formats to help you maximize partial credit and demonstrate clinical judgment.",
    sections: [
      { heading: "Unfolding Case Study Strategy", content: "You will receive 3 case studies with 6 questions each (18 total items). Each case follows a patient through a clinical scenario. Strategy: (1) Read the entire initial scenario carefully before answering. (2) At each new phase, identify what CHANGED. (3) Integrate new information with previous data. (4) Don't assume your initial hypothesis is final — the case may pivot. (5) Each question maps to a CJMM skill — identify which one.", tips: ["The first 1-2 questions usually test Recognize/Analyze Cues — identify the important data", "Middle questions test Prioritize/Generate — what is the problem and what should you do", "Final questions test Evaluate Outcomes — was the treatment effective", "If you get a question wrong, the case continues — don't let it throw you off"] },
      { heading: "Matrix/Grid Item Strategy", content: "Matrix items present a table where you make selections across multiple rows and columns. Common formats: 'For each assessment finding, indicate if it is Expected or Unexpected.' Strategy: (1) Evaluate each row INDEPENDENTLY — don't let one answer influence another. (2) Consider the specific client context (diagnosis, procedure, timeline). (3) 'Expected' means consistent with the disease/situation, not that it's 'good.' (4) Check every row — unmarked rows count against you.", tips: ["A slightly elevated temperature post-op Day 1 is EXPECTED (atelectasis)", "Decreasing urine output is UNEXPECTED in most situations", "Read the column headers carefully — 'Expected' vs 'Requires intervention' are very different", "You earn partial credit — attempt every row even if unsure about some"] },
      { heading: "Trend Item Strategy", content: "Trend items present data over time (serial vitals, labs) and ask you to identify patterns or determine nursing actions. Strategy: (1) Look at the DIRECTION of change, not just individual values. (2) Identify which trends are improving vs worsening. (3) Correlate trends with interventions given between timepoints. (4) A stable abnormal value may be less concerning than a rapidly changing normal value.", tips: ["Rising temperature + rising WBC + falling BP = sepsis progression", "Improving ABGs after intervention = treatment working", "Worsening despite treatment = escalation needed", "Focus on what changed between the LAST two data points, not just first and last"] },
      { heading: "Bowtie Item Strategy", content: "Bowtie items present a central condition with risk factors on one side and interventions on the other. Strategy: (1) Start with the central condition — what diagnosis does the clinical data support? (2) Work LEFT to identify risk factors that contributed. (3) Work RIGHT to identify appropriate interventions. (4) Use pathophysiology knowledge to connect risk factors → condition → treatment.", tips: ["The central condition is usually identified for you — focus on matching risk factors and interventions", "Risk factors should be SPECIFIC to that condition, not general health factors", "Interventions should be SPECIFIC and APPROPRIATE, not generic 'monitor vitals'", "Think about pathophysiology to make logical connections"] }
    ],
    practiceQuestions: [
      { question: "In a matrix item, a post-operative Day 1 knee replacement client has: mild swelling at the surgical site, temperature 37.4°C, moderate pain (5/10), and absent pedal pulse on the operative leg. Which finding should be marked as 'Requires Immediate Follow-Up'?", options: ["Mild swelling at the surgical site", "Temperature 37.4°C", "Moderate pain (5/10)", "Absent pedal pulse on the operative leg"], correctIndex: 3, rationale: "An absent pedal pulse on the operative extremity is a critical finding suggesting vascular compromise — possibly from swelling, hematoma, or compartment syndrome. This requires IMMEDIATE follow-up because it threatens limb viability. The other findings (mild swelling, low-grade temp, moderate pain) are expected post-operative findings.", isFree: true }
    ],
    faqs: [
      { question: "Does partial credit really help on NGN items?", answer: "Yes. Partial credit means each correct selection within an NGN item earns points proportional to its difficulty. If a matrix item has 6 correct answers and you identify 4, you earn approximately 4/6 of the possible points rather than zero. This is why you should attempt EVERY part of an NGN item, even if you are unsure about some selections." }
    ],
    internalLinks: [
      { title: "NGN Complete Guide", href: "/nclex-rn/ngn", type: "category" },
      { title: "Clinical Judgment Framework", href: "/nclex-rn/strategy/clinical-judgment-framework", type: "strategy" },
      { title: "Practice Questions", href: "/nclex-rn/practice-questions", type: "category" }
    ],
    lastReviewed: "2025-03-15",
    reviewer: "NurseNest Clinical Review Team"
  }
];

export function getNclexRnCategoryBySlug(slug: string): NclexRnCategoryPage | undefined {
  return nclexRnCategories.find(c => c.slug === slug);
}

export function getNclexRnConditionBySlug(slug: string): NclexRnConditionPage | undefined {
  return nclexRnConditions.find(c => c.slug === slug);
}

export function getNclexRnMedicationBySlug(slug: string): NclexRnMedicationPage | undefined {
  return nclexRnMedications.find(m => m.slug === slug);
}

export function getNclexRnLabValueBySlug(slug: string): NclexRnLabValuePage | undefined {
  return nclexRnLabValues.find(l => l.slug === slug);
}

export function getNclexRnComparisonBySlug(slug: string): NclexRnComparisonPage | undefined {
  return nclexRnComparisons.find(c => c.slug === slug);
}

export function getNclexRnStrategyBySlug(slug: string): NclexRnStrategyPage | undefined {
  return nclexRnStrategies.find(s => s.slug === slug);
}

export function getAllNclexRnSlugs(): { categories: string[]; conditions: string[]; medications: string[]; labValues: string[]; comparisons: string[]; strategies: string[] } {
  return {
    categories: nclexRnCategories.map(c => c.slug),
    conditions: nclexRnConditions.map(c => c.slug),
    medications: nclexRnMedications.map(m => m.slug),
    labValues: nclexRnLabValues.map(l => l.slug),
    comparisons: nclexRnComparisons.map(c => c.slug),
    strategies: nclexRnStrategies.map(s => s.slug),
  };
}
