import { absoluteUrl } from "@/lib/seo/site-origin";

export type AuthorityContentCategory =
  | "conditions"
  | "medications"
  | "clinical-skills"
  | "labs"
  | "care-plans"
  | "allied-careers"
  | "allied-study"
  | "interview-prep"
  | "placements"
  | "certifications";

export type ClinicalReviewStatus = "clinically_reviewed" | "under_review" | "updated";

export type AuthorityReviewer = {
  name: string;
  credentials: string;
  specialty: string;
  reviewedAt: string;
};

export type AuthorityReference = {
  title: string;
  source: string;
  url: string;
};

export type AuthorityLink = {
  label: string;
  href: string;
  category?: AuthorityContentCategory | "lesson" | "question" | "flashcard" | "simulation";
};

export type AuthoritySection = {
  id: string;
  title: string;
  body: string[];
};

export type AuthorityPage = {
  category: AuthorityContentCategory;
  slug: string;
  title: string;
  deck: string;
  summary: string;
  synonyms: string[];
  clinicalReviewStatus: ClinicalReviewStatus;
  reviewer: AuthorityReviewer;
  governance: {
    publishedAt: string;
    updatedAt: string;
    reviewCycleDue: string;
    changeHistory: string[];
  };
  sections: AuthoritySection[];
  clinicalPearls: string[];
  commonMistakes: string[];
  faqs: Array<{ question: string; answer: string }>;
  related: AuthorityLink[];
  references: AuthorityReference[];
};

export type AuthorityContentTarget = {
  category: AuthorityContentCategory;
  phaseOneTarget: number;
  longTermTarget: number;
  primaryIntent: "clinical" | "career" | "study" | "conversion";
  monetizationPath: string;
};

export type AuthorityDashboardRow = AuthorityContentTarget & {
  title: string;
  publishedPages: number;
  draftGap: number;
  pagesAwaitingReview: number;
  internalLinkAverage: number;
  eeatCoverage: number;
  schemaCoverage: number;
  clinicalAuthorityCoverage: number;
  averageClinicalAuthorityScore: number;
  monetizationReadiness: "foundation" | "developing" | "strong";
};

export type ClinicalAuthorityStandardProfile = {
  wordTarget: { min: number; max: number };
  requiredElements: string[];
};

export type ClinicalAuthorityAudit = {
  score: number;
  minimumPublicationScore: number;
  publishReady: boolean;
  wordCount: number;
  targetWordRange: string;
  missingElements: string[];
  issues: string[];
  dimensionScores: {
    clinicalDepth: number;
    educationalValue: number;
    practicalUtility: number;
    examRelevance: number;
    clinicalAccuracy: number;
    internalLinking: number;
    eeatReadiness: number;
    contentCompleteness: number;
  };
};

export const CLINICAL_AUTHORITY_MINIMUM_PUBLICATION_SCORE = 90;

export const AUTHORITY_CATEGORY_META: Record<
  AuthorityContentCategory,
  { title: string; singular: string; description: string; futureTarget: string }
> = {
  conditions: {
    title: "Disease & Condition Library",
    singular: "Condition",
    description: "Clinically reasoned disease guides for nursing, NP, and allied health learners.",
    futureTarget: "5,000+ future condition pages",
  },
  medications: {
    title: "Medication Library",
    singular: "Medication",
    description: "Medication guides focused on safety, monitoring, teaching, and exam relevance.",
    futureTarget: "5,000+ future medication pages",
  },
  "clinical-skills": {
    title: "Clinical Skills Library",
    singular: "Clinical Skill",
    description: "Procedure and skill guides with safety checks, documentation, complications, and practice questions.",
    futureTarget: "2,000+ future skills",
  },
  labs: {
    title: "Laboratory Interpretation Library",
    singular: "Lab",
    description: "Lab interpretation pages connecting abnormal values to clinical meaning and nursing action.",
    futureTarget: "1,000+ future lab pages",
  },
  "care-plans": {
    title: "Nursing Care Plan Library",
    singular: "Care Plan",
    description: "Priority-ranked care plans with SMART goals, interventions, rationales, and clinical reasoning.",
    futureTarget: "1,000+ future care plans",
  },
  "allied-careers": {
    title: "Allied Health Career Library",
    singular: "Career Guide",
    description: "Career, salary, licensing, and profession-entry guides for allied health learners.",
    futureTarget: "100+ future career pages",
  },
  "allied-study": {
    title: "Allied Health Study Library",
    singular: "Study Guide",
    description: "Profession-specific study guides, clinical reasoning explainers, and quick review pages.",
    futureTarget: "300+ future allied study pages",
  },
  "interview-prep": {
    title: "Interview Preparation Library",
    singular: "Interview Guide",
    description: "Healthcare interview questions with model answers, common mistakes, and expert preparation tips.",
    futureTarget: "100+ future interview pages",
  },
  placements: {
    title: "Placement Success Library",
    singular: "Placement Guide",
    description: "Clinical placement survival guides covering preparation, expectations, skills, and professional habits.",
    futureTarget: "100+ future placement pages",
  },
  certifications: {
    title: "Certification & Licensing Library",
    singular: "Certification Guide",
    description: "Exam, certification, and licensing guides for nursing, NP, and allied health pathways.",
    futureTarget: "100+ future certification pages",
  },
};

export const AUTHORITY_CONTENT_PHASE_TARGETS: Record<AuthorityContentCategory, AuthorityContentTarget> = {
  conditions: {
    category: "conditions",
    phaseOneTarget: 200,
    longTermTarget: 1000,
    primaryIntent: "clinical",
    monetizationPath: "Related lessons, questions, care plans, labs, medications, and simulations.",
  },
  medications: {
    category: "medications",
    phaseOneTarget: 250,
    longTermTarget: 5000,
    primaryIntent: "clinical",
    monetizationPath: "Related pharmacology lessons, flashcards, medication questions, and safety practice.",
  },
  "care-plans": {
    category: "care-plans",
    phaseOneTarget: 500,
    longTermTarget: 1000,
    primaryIntent: "conversion",
    monetizationPath: "Care plan generator, related questions, lessons, flashcards, and clinical reasoning tools.",
  },
  labs: {
    category: "labs",
    phaseOneTarget: 500,
    longTermTarget: 1000,
    primaryIntent: "clinical",
    monetizationPath: "Lab interpretation activities, related conditions, questions, and clinical cases.",
  },
  "clinical-skills": {
    category: "clinical-skills",
    phaseOneTarget: 500,
    longTermTarget: 2000,
    primaryIntent: "clinical",
    monetizationPath: "Clinical skills activities, simulations, placement guides, and competency passports.",
  },
  "allied-careers": {
    category: "allied-careers",
    phaseOneTarget: 100,
    longTermTarget: 250,
    primaryIntent: "career",
    monetizationPath: "Allied health pathway hubs, placement resources, study guides, and interview prep.",
  },
  "allied-study": {
    category: "allied-study",
    phaseOneTarget: 300,
    longTermTarget: 1000,
    primaryIntent: "study",
    monetizationPath: "Allied health lessons, practice activities, flashcards, and clinical skills.",
  },
  "interview-prep": {
    category: "interview-prep",
    phaseOneTarget: 100,
    longTermTarget: 250,
    primaryIntent: "career",
    monetizationPath: "Career pathway pages, placement guides, new graduate resources, and coaching funnels.",
  },
  placements: {
    category: "placements",
    phaseOneTarget: 100,
    longTermTarget: 250,
    primaryIntent: "career",
    monetizationPath: "Placement readiness tools, skills checklists, simulations, and clinical readiness pathways.",
  },
  certifications: {
    category: "certifications",
    phaseOneTarget: 100,
    longTermTarget: 300,
    primaryIntent: "conversion",
    monetizationPath: "Exam pathway hubs, pricing, trial CTAs, practice questions, CAT exams, and readiness dashboards.",
  },
};

const DISEASE_REQUIRED_ELEMENTS = [
  "Definition",
  "Why This Matters Clinically",
  "Pathophysiology",
  "Disease Progression",
  "Risk Factors",
  "Causes",
  "Assessment Findings",
  "Signs And Symptoms",
  "Differential Diagnoses",
  "Diagnostics",
  "Laboratory Findings",
  "Imaging Findings",
  "Medical Management",
  "Pharmacology",
  "Nursing Management",
  "RT Considerations",
  "OT Considerations",
  "PT Considerations",
  "MLT Considerations",
  "Patient Education",
  "Complications",
  "Clinical Pearls",
  "Common Student Mistakes",
  "Common New Graduate Mistakes",
  "NCLEX Considerations",
  "REx-PN Considerations",
  "NP Considerations",
  "Case Study",
  "Practice Questions",
  "Related Conditions",
  "References",
];

const MEDICATION_REQUIRED_ELEMENTS = [
  "Why Patients Receive This Medication",
  "Mechanism Of Action",
  "How The Drug Works Physiologically",
  "Indications",
  "Contraindications",
  "Side Effects",
  "Serious Adverse Effects",
  "Monitoring",
  "Laboratory Monitoring",
  "Administration Considerations",
  "Patient Teaching",
  "Nursing Considerations",
  "Safety Alerts",
  "Medication Errors",
  "Clinical Pearls",
  "Case Example",
  "Exam Considerations",
  "Related Medications",
  "References",
];

const CARE_PLAN_REQUIRED_ELEMENTS = [
  "Patient Scenario",
  "Priority Diagnoses",
  "Clinical Reasoning",
  "Goals",
  "Interventions",
  "Rationales",
  "Evaluation",
  "Patient Education",
  "Complication Monitoring",
  "Escalation Triggers",
  "Clinical Pearls",
  "Exam Tips",
  "Case Progression",
  "Documentation Examples",
];

const CLINICAL_SKILL_REQUIRED_ELEMENTS = [
  "Purpose",
  "Indications",
  "Contraindications",
  "Preparation",
  "Equipment",
  "Procedure",
  "Safety Checks",
  "Clinical Decision Points",
  "Common Errors",
  "Complications",
  "Documentation",
  "Patient Teaching",
  "Case Examples",
  "Clinical Pearls",
  "Knowledge Check Questions",
];

const LAB_REQUIRED_ELEMENTS = [
  "Normal Values",
  "Function",
  "Causes Of High Values",
  "Causes Of Low Values",
  "Clinical Significance",
  "Nursing Actions",
  "Patient Implications",
  "Related Conditions",
  "FAQs",
  "References",
];

const CAREER_REQUIRED_ELEMENTS = [
  "Role Overview",
  "Why This Matters Clinically",
  "Education Pathway",
  "Licensing Or Registration",
  "Clinical Placement",
  "Core Competencies",
  "Common Mistakes",
  "Practical Tips",
  "Related Study Resources",
  "References",
];

const STUDY_REQUIRED_ELEMENTS = [
  "Learning Objectives",
  "Clinical Context",
  "Core Concepts",
  "Decision-Making Examples",
  "Common Errors",
  "Practice Questions",
  "Clinical Pearls",
  "Related Lessons",
  "Related Skills",
  "References",
];

const CERTIFICATION_REQUIRED_ELEMENTS = [
  "Exam Overview",
  "Blueprint",
  "Study Plan",
  "Readiness",
  "Clinical Judgment",
  "Common Exam Traps",
  "Practice Questions",
  "Related Lessons",
  "Related Flashcards",
  "References",
];

export const CLINICAL_AUTHORITY_STANDARD: Record<AuthorityContentCategory, ClinicalAuthorityStandardProfile> = {
  conditions: { wordTarget: { min: 3000, max: 5000 }, requiredElements: DISEASE_REQUIRED_ELEMENTS },
  medications: { wordTarget: { min: 2500, max: 4000 }, requiredElements: MEDICATION_REQUIRED_ELEMENTS },
  "care-plans": { wordTarget: { min: 2000, max: 3500 }, requiredElements: CARE_PLAN_REQUIRED_ELEMENTS },
  labs: { wordTarget: { min: 2000, max: 3000 }, requiredElements: LAB_REQUIRED_ELEMENTS },
  "clinical-skills": { wordTarget: { min: 2500, max: 4000 }, requiredElements: CLINICAL_SKILL_REQUIRED_ELEMENTS },
  "allied-careers": { wordTarget: { min: 3000, max: 5000 }, requiredElements: CAREER_REQUIRED_ELEMENTS },
  "allied-study": { wordTarget: { min: 2500, max: 4000 }, requiredElements: STUDY_REQUIRED_ELEMENTS },
  "interview-prep": { wordTarget: { min: 3000, max: 5000 }, requiredElements: CAREER_REQUIRED_ELEMENTS },
  placements: { wordTarget: { min: 3000, max: 5000 }, requiredElements: CAREER_REQUIRED_ELEMENTS },
  certifications: { wordTarget: { min: 4000, max: 8000 }, requiredElements: CERTIFICATION_REQUIRED_ELEMENTS },
};

export const AUTHORITY_CONTENT_PAGES: AuthorityPage[] = [
  {
    category: "conditions",
    slug: "heart-failure",
    title: "Heart Failure",
    deck: "A clinical reasoning guide to impaired cardiac pumping, fluid overload, perfusion changes, and nursing priorities.",
    summary:
      "Heart failure occurs when the heart cannot pump effectively enough to meet metabolic needs or accommodate venous return without elevated filling pressures. Nursing care focuses on oxygenation, perfusion, fluid balance, medication safety, early deterioration recognition, and patient self-management.",
    synonyms: ["CHF", "congestive heart failure", "left-sided heart failure", "right-sided heart failure", "HF"],
    clinicalReviewStatus: "under_review",
    reviewer: {
      name: "NurseNest Clinical Editorial Team",
      credentials: "RN, NP, Nursing Education Review",
      specialty: "Medical-Surgical Nursing",
      reviewedAt: "2026-05-31",
    },
    governance: {
      publishedAt: "2026-05-31",
      updatedAt: "2026-05-31",
      reviewCycleDue: "2026-11-30",
      changeHistory: ["Initial authority-engine seed page created for EEAT and internal-linking architecture."],
    },
    sections: [
      {
        id: "definition",
        title: "Definition",
        body: [
          "Heart failure is a clinical syndrome caused by structural or functional cardiac impairment that reduces ventricular filling or ejection of blood.",
          "For learners, the key idea is not simply fluid overload. The problem is ineffective cardiac performance that can cause pulmonary congestion, systemic venous congestion, reduced renal perfusion, fatigue, activity intolerance, and recurrent decompensation.",
        ],
      },
      {
        id: "pathophysiology",
        title: "Pathophysiology",
        body: [
          "Reduced cardiac output activates compensatory systems including sympathetic stimulation and the renin-angiotensin-aldosterone system. These responses may temporarily maintain perfusion but can worsen sodium and water retention, vasoconstriction, ventricular workload, and remodeling.",
          "Left-sided failure commonly produces pulmonary congestion, crackles, dyspnea, orthopnea, and hypoxemia. Right-sided failure commonly produces peripheral edema, jugular venous distention, hepatomegaly, abdominal fullness, and weight gain.",
        ],
      },
      {
        id: "assessment",
        title: "Assessment Findings",
        body: [
          "Priority assessment includes respiratory effort, oxygen saturation, lung sounds, edema, daily weight, intake and output, blood pressure, heart rate, urine output, fatigue, chest discomfort, medication adherence, and ability to perform activities of daily living.",
          "Worsening dyspnea, new confusion, falling oxygen saturation, rapid weight gain, hypotension, reduced urine output, or escalating edema should prompt timely reassessment and escalation.",
        ],
      },
      {
        id: "diagnostics",
        title: "Diagnostics, Labs, And Imaging",
        body: [
          "Common evaluation may include BNP or NT-proBNP, ECG, chest x-ray, echocardiography, renal function, electrolytes, troponin when ischemia is suspected, and medication-specific monitoring such as digoxin level when applicable.",
          "A rising creatinine or abnormal potassium can change medication safety, especially with diuretics, ACE inhibitors, ARBs, ARNIs, mineralocorticoid receptor antagonists, and digoxin.",
        ],
      },
      {
        id: "treatment",
        title: "Treatments And Pharmacology",
        body: [
          "Treatment depends on type and acuity. Common therapies include diuretics for congestion, guideline-directed cardiac medications, oxygen or ventilatory support when needed, sodium and fluid guidance, daily weights, and management of triggers such as infection, ischemia, dysrhythmia, or nonadherence.",
          "Nursing medication safety focuses on blood pressure, renal function, potassium, heart rate, symptom response, orthostasis, and patient understanding of when to report worsening symptoms.",
        ],
      },
      {
        id: "nursing",
        title: "Nursing And Allied Health Considerations",
        body: [
          "Nursing priorities include improving oxygenation, reducing fluid overload, preventing falls from orthostasis or weakness, monitoring response to diuretics, recognizing deterioration, and teaching self-management.",
          "Allied health involvement may include dietitian support for sodium guidance, physiotherapy for activity tolerance, respiratory therapy for oxygen needs, pharmacy for medication reconciliation, and social work for access barriers.",
        ],
      },
      {
        id: "exam",
        title: "NCLEX, REx-PN, And NP Tips",
        body: [
          "Exam items often test daily weights, lung sounds, oxygenation, diuretic safety, potassium monitoring, and priority action when pulmonary edema or poor perfusion appears.",
          "NP-level reasoning adds differential diagnosis, medication optimization, comorbidity management, diagnostic interpretation, and recognition of when acute decompensation requires emergency escalation.",
        ],
      },
    ],
    clinicalPearls: [
      "Daily weight often detects worsening fluid retention before edema or dyspnea becomes obvious.",
      "New confusion in a heart failure patient can be a perfusion or oxygenation warning sign, not just an age-related change.",
      "Diuretic response should be evaluated with symptoms, lung sounds, urine output, weight, renal function, and electrolytes together.",
    ],
    commonMistakes: [
      "Teaching sodium restriction before addressing acute respiratory distress.",
      "Ignoring potassium and renal function trends when diuretics or RAAS-affecting medications are used.",
      "Assuming normal oxygen saturation rules out worsening heart failure when work of breathing and weight are worsening.",
    ],
    faqs: [
      {
        question: "What is the priority nursing assessment for heart failure?",
        answer:
          "Respiratory status, oxygenation, lung sounds, work of breathing, perfusion, weight trend, edema, urine output, blood pressure, and response to medications are priority assessments.",
      },
      {
        question: "Why are daily weights important in heart failure?",
        answer:
          "Daily weights help identify fluid retention early and can reveal worsening congestion before symptoms are severe.",
      },
    ],
    related: [
      { label: "Heart Failure Care Plan", href: "/healthcare/care-plans/heart-failure-care-plan", category: "care-plans" },
      { label: "Furosemide", href: "/healthcare/medications/furosemide", category: "medications" },
      { label: "Potassium", href: "/healthcare/labs/potassium", category: "labs" },
      { label: "NCLEX-RN Lessons", href: "/canada/rn/nclex-rn/lessons", category: "lesson" },
      { label: "Practice Questions", href: "/question-bank", category: "question" },
    ],
    references: [
      { title: "Heart Failure Guidelines", source: "American Heart Association", url: "https://www.heart.org/" },
      { title: "Heart Failure Clinical Overview", source: "Mayo Clinic", url: "https://www.mayoclinic.org/" },
      { title: "Heart Failure", source: "MedlinePlus", url: "https://medlineplus.gov/heartfailure.html" },
    ],
  },
  {
    category: "medications",
    slug: "furosemide",
    title: "Furosemide",
    deck: "Loop diuretic safety, monitoring, patient teaching, and exam-relevant nursing considerations.",
    summary:
      "Furosemide is a loop diuretic used to reduce fluid overload and treat edema or hypertension in selected patients. Nursing care centers on volume status, blood pressure, renal function, electrolyte monitoring, fall prevention, and patient teaching.",
    synonyms: ["Lasix", "loop diuretic", "water pill"],
    clinicalReviewStatus: "under_review",
    reviewer: {
      name: "NurseNest Clinical Editorial Team",
      credentials: "RN, NP, Pharmacology Review",
      specialty: "Medication Safety",
      reviewedAt: "2026-05-31",
    },
    governance: {
      publishedAt: "2026-05-31",
      updatedAt: "2026-05-31",
      reviewCycleDue: "2026-11-30",
      changeHistory: ["Initial medication authority seed page created."],
    },
    sections: [
      {
        id: "classification",
        title: "Generic Name, Class, And Mechanism",
        body: [
          "Furosemide is a loop diuretic. It acts in the loop of Henle to promote sodium and water excretion.",
          "The clinical effect is reduced intravascular volume and reduced congestion. This can improve symptoms of fluid overload but may also cause dehydration, hypotension, renal stress, or electrolyte imbalance.",
        ],
      },
      {
        id: "indications",
        title: "Indications And Contraindications",
        body: [
          "Common indications include edema associated with heart failure, renal disease, liver disease, or other fluid overload states, and hypertension in selected patients.",
          "Contraindications and cautions depend on the patient and orders, but nurses should be alert for severe dehydration, anuria, significant electrolyte disturbances, sulfonamide allergy history, hypotension, and renal function changes.",
        ],
      },
      {
        id: "monitoring",
        title: "Monitoring And Hold Parameters",
        body: [
          "Monitor blood pressure, heart rate, intake and output, daily weight, edema, lung sounds, renal function, potassium, sodium, magnesium, dizziness, and symptom response.",
          "Hold parameters are provider- or policy-specific. Nurses should clarify orders for low blood pressure, severe electrolyte abnormalities, acute kidney injury, symptomatic dizziness, or unexpectedly low urine output.",
        ],
      },
      {
        id: "teaching",
        title: "Patient Teaching",
        body: [
          "Teach patients to take the medication as prescribed, report dizziness, muscle weakness, palpitations, severe thirst, decreased urination, hearing changes, or worsening swelling and shortness of breath.",
          "For chronic heart failure, connect furosemide teaching to daily weights and early reporting of rapid weight gain.",
        ],
      },
    ],
    clinicalPearls: [
      "A strong urine output after furosemide is expected, but falling blood pressure, dizziness, or rising creatinine may signal excessive volume loss.",
      "Loop diuretics can lower potassium, which matters for dysrhythmia risk and digoxin safety.",
    ],
    commonMistakes: [
      "Giving a diuretic without reviewing blood pressure, potassium, renal function, and recent urine output.",
      "Teaching only that the medication removes fluid without explaining when to report dehydration or electrolyte symptoms.",
    ],
    faqs: [
      {
        question: "What should nurses monitor with furosemide?",
        answer: "Monitor blood pressure, urine output, weight, edema, lung sounds, renal function, potassium, sodium, magnesium, dizziness, and therapeutic response.",
      },
    ],
    related: [
      { label: "Heart Failure", href: "/healthcare/conditions/heart-failure", category: "conditions" },
      { label: "Potassium", href: "/healthcare/labs/potassium", category: "labs" },
      { label: "Heart Failure Care Plan", href: "/healthcare/care-plans/heart-failure-care-plan", category: "care-plans" },
    ],
    references: [
      { title: "Furosemide Drug Information", source: "MedlinePlus", url: "https://medlineplus.gov/druginfo/meds/a682858.html" },
      { title: "Loop Diuretics", source: "NCBI Bookshelf", url: "https://www.ncbi.nlm.nih.gov/books/" },
    ],
  },
  {
    category: "labs",
    slug: "potassium",
    title: "Potassium",
    deck: "Interpret high and low potassium through cardiac, renal, medication, and safety lenses.",
    summary:
      "Potassium is a major intracellular electrolyte essential for cardiac conduction, neuromuscular function, and acid-base balance. Abnormal potassium can become life-threatening because it can trigger dangerous dysrhythmias.",
    synonyms: ["K", "K+", "serum potassium", "hyperkalemia", "hypokalemia"],
    clinicalReviewStatus: "under_review",
    reviewer: {
      name: "NurseNest Clinical Editorial Team",
      credentials: "RN, NP, Lab Interpretation Review",
      specialty: "Laboratory Interpretation",
      reviewedAt: "2026-05-31",
    },
    governance: {
      publishedAt: "2026-05-31",
      updatedAt: "2026-05-31",
      reviewCycleDue: "2026-11-30",
      changeHistory: ["Initial lab authority seed page created."],
    },
    sections: [
      {
        id: "normal",
        title: "Normal Values And Function",
        body: [
          "Typical adult reference ranges vary by lab, but serum potassium is commonly around 3.5-5.0 mmol/L.",
          "Potassium supports cardiac conduction and muscle function. A value must be interpreted with symptoms, renal function, medications, ECG changes, and hemolysis risk.",
        ],
      },
      {
        id: "high",
        title: "High Potassium",
        body: [
          "Hyperkalemia may be associated with kidney dysfunction, potassium-sparing medications, ACE inhibitors or ARBs, tissue breakdown, acidosis, adrenal disorders, or specimen hemolysis.",
          "Clinical concern increases with weakness, paresthesias, bradycardia, ECG changes, renal failure, or rapidly rising values.",
        ],
      },
      {
        id: "low",
        title: "Low Potassium",
        body: [
          "Hypokalemia may be associated with diuretics, vomiting, diarrhea, poor intake, insulin shifts, alkalosis, or certain medications.",
          "Low potassium increases risk for weakness, cramps, ileus, dysrhythmias, and digoxin toxicity concerns.",
        ],
      },
      {
        id: "actions",
        title: "Nursing Actions",
        body: [
          "Assess cardiac rhythm risk, medication contributors, renal function, symptoms, and whether the result fits the clinical picture.",
          "Escalate critical values according to policy, place the patient on appropriate monitoring when indicated, and verify replacement or lowering therapies are administered safely.",
        ],
      },
    ],
    clinicalPearls: [
      "Potassium abnormalities are ECG and patient-safety problems, not just lab memorization.",
      "A hemolyzed specimen can falsely elevate potassium, but symptomatic or ECG-changing hyperkalemia should never be dismissed.",
    ],
    commonMistakes: [
      "Memorizing the number without checking ECG risk, renal function, and medications.",
      "Replacing potassium without considering renal function or route safety.",
    ],
    faqs: [
      {
        question: "Why is abnormal potassium dangerous?",
        answer: "Potassium affects cardiac conduction and muscle function, so significant abnormalities can cause weakness and potentially life-threatening dysrhythmias.",
      },
    ],
    related: [
      { label: "Furosemide", href: "/healthcare/medications/furosemide", category: "medications" },
      { label: "Heart Failure", href: "/healthcare/conditions/heart-failure", category: "conditions" },
      { label: "ECG Interpretation", href: "/ecg-interpretation", category: "lesson" },
    ],
    references: [
      { title: "Potassium Blood Test", source: "MedlinePlus", url: "https://medlineplus.gov/lab-tests/potassium-blood-test/" },
      { title: "Hyperkalemia", source: "Merck Manual Professional", url: "https://www.merckmanuals.com/professional" },
    ],
  },
  {
    category: "clinical-skills",
    slug: "oxygen-administration",
    title: "Oxygen Administration",
    deck: "A clinical skill guide for safe oxygen delivery, assessment, documentation, and escalation.",
    summary:
      "Oxygen administration is a common clinical skill used to treat or prevent hypoxemia. Safe practice requires assessment, device selection, ordered flow or concentration, skin and fire safety, response evaluation, and escalation when oxygen needs increase.",
    synonyms: ["O2", "nasal cannula", "oxygen therapy", "supplemental oxygen"],
    clinicalReviewStatus: "under_review",
    reviewer: {
      name: "NurseNest Clinical Editorial Team",
      credentials: "RN, Respiratory Care Review",
      specialty: "Clinical Skills",
      reviewedAt: "2026-05-31",
    },
    governance: {
      publishedAt: "2026-05-31",
      updatedAt: "2026-05-31",
      reviewCycleDue: "2026-11-30",
      changeHistory: ["Initial clinical skill authority seed page created."],
    },
    sections: [
      {
        id: "purpose",
        title: "Purpose And Indications",
        body: [
          "Oxygen therapy increases delivered oxygen for patients with hypoxemia, increased work of breathing, acute illness, procedural needs, or specific provider-ordered indications.",
          "The nurse must assess whether oxygen is improving the patient and whether worsening oxygen needs signal deterioration.",
        ],
      },
      {
        id: "procedure",
        title: "Preparation And Procedure",
        body: [
          "Verify patient identity, order or protocol, target saturation, delivery device, flow rate, humidification need, allergies or skin risks, and baseline respiratory assessment.",
          "Apply the correct device, ensure tubing is connected and patent, set the prescribed flow, reassess respiratory status, and document device, flow, saturation, tolerance, and response.",
        ],
      },
      {
        id: "safety",
        title: "Safety Checks And Common Errors",
        body: [
          "Use oxygen safety precautions, avoid ignition sources, protect skin around ears and nares, monitor for dryness, and ensure the patient can call for help.",
          "Common errors include charting oxygen without reassessment, missing increasing oxygen requirements, using the wrong device, or failing to escalate when distress worsens.",
        ],
      },
    ],
    clinicalPearls: [
      "Increasing oxygen requirement is a deterioration cue even if saturation temporarily improves.",
      "The device and flow rate matter because they determine how much oxygen the patient may actually receive.",
    ],
    commonMistakes: [
      "Treating oxygen as a comfort measure instead of a therapy requiring reassessment.",
      "Documenting saturation without assessing work of breathing, mental status, and lung sounds.",
    ],
    faqs: [
      {
        question: "What should be documented after oxygen administration?",
        answer: "Document device, flow rate or oxygen concentration, oxygen saturation, respiratory assessment, patient tolerance, skin condition, and response.",
      },
    ],
    related: [
      { label: "Heart Failure", href: "/healthcare/conditions/heart-failure", category: "conditions" },
      { label: "ECG Interpretation", href: "/ecg-interpretation", category: "lesson" },
      { label: "Lab Interpretation", href: "/labs-interpretation", category: "lesson" },
    ],
    references: [
      { title: "Oxygen Therapy", source: "British Thoracic Society", url: "https://www.brit-thoracic.org.uk/" },
      { title: "Oxygen Safety", source: "FDA", url: "https://www.fda.gov/" },
    ],
  },
  {
    category: "care-plans",
    slug: "heart-failure-care-plan",
    title: "Heart Failure Nursing Care Plan",
    deck: "Priority diagnoses, SMART goals, interventions, rationales, teaching, and clinical reasoning for heart failure.",
    summary:
      "A heart failure care plan prioritizes oxygenation, cardiac output, fluid balance, activity tolerance, medication safety, and self-management. The nurse must connect findings such as dyspnea, crackles, edema, weight gain, and renal function changes to interventions and escalation thresholds.",
    synonyms: ["CHF care plan", "heart failure nursing diagnosis", "cardiac care plan"],
    clinicalReviewStatus: "under_review",
    reviewer: {
      name: "NurseNest Clinical Editorial Team",
      credentials: "RN, Nursing Care Plan Review",
      specialty: "Care Planning",
      reviewedAt: "2026-05-31",
    },
    governance: {
      publishedAt: "2026-05-31",
      updatedAt: "2026-05-31",
      reviewCycleDue: "2026-11-30",
      changeHistory: ["Initial care plan authority seed page created."],
    },
    sections: [
      {
        id: "overview",
        title: "Patient Overview",
        body: [
          "A typical heart failure patient may present with dyspnea, orthopnea, crackles, edema, fatigue, rapid weight gain, reduced activity tolerance, and medication complexity.",
          "Priority nursing care begins with respiratory status and perfusion, then fluid balance, activity tolerance, medication safety, education, and discharge planning.",
        ],
      },
      {
        id: "diagnoses",
        title: "Priority Nursing Diagnoses",
        body: [
          "Common priority diagnoses include impaired gas exchange, decreased cardiac output, excess fluid volume, activity intolerance, and deficient knowledge related to heart failure self-management.",
          "Each diagnosis should be supported by assessment findings rather than listed because it appears in a textbook.",
        ],
      },
      {
        id: "interventions",
        title: "Interventions And Rationales",
        body: [
          "Monitor respiratory status, oxygen saturation, lung sounds, daily weight, intake and output, edema, blood pressure, heart rate, renal function, electrolytes, and response to diuretics.",
          "Rationales should explain how each action detects worsening congestion, improves oxygenation, prevents medication harm, or supports safe self-management.",
        ],
      },
      {
        id: "teaching",
        title: "Patient Teaching And Evaluation",
        body: [
          "Teaching includes daily weights, medication adherence, sodium guidance, symptom monitoring, activity pacing, follow-up, and when to seek urgent help.",
          "Evaluation should be measurable: stable oxygenation, improved breathing, reduced edema or weight trend, safe medication understanding, and accurate teach-back.",
        ],
      },
    ],
    clinicalPearls: [
      "A care plan is stronger when each intervention responds to a specific patient cue.",
      "Heart failure teaching should always include what to do when symptoms worsen, not just what heart failure is.",
    ],
    commonMistakes: [
      "Using excess fluid volume for every heart failure patient without showing evidence.",
      "Listing interventions without rationales or measurable evaluation criteria.",
    ],
    faqs: [
      {
        question: "What is the priority nursing diagnosis for heart failure?",
        answer: "It depends on the patient cues. Impaired gas exchange or decreased cardiac output may be highest when oxygenation or perfusion is threatened; excess fluid volume is common when congestion dominates.",
      },
    ],
    related: [
      { label: "Heart Failure", href: "/healthcare/conditions/heart-failure", category: "conditions" },
      { label: "Furosemide", href: "/healthcare/medications/furosemide", category: "medications" },
      { label: "Nursing Care Plan Generator", href: "/tools/care-plan", category: "lesson" },
    ],
    references: [
      { title: "Heart Failure", source: "MedlinePlus", url: "https://medlineplus.gov/heartfailure.html" },
      { title: "Heart Failure Guidelines", source: "American Heart Association", url: "https://www.heart.org/" },
    ],
  },
  {
    category: "allied-careers",
    slug: "respiratory-therapist-canada",
    title: "How To Become A Respiratory Therapist In Canada",
    deck: "A career guide for learners comparing respiratory therapy education, clinical placement expectations, registration, and practice settings.",
    summary:
      "Respiratory therapists support patients with acute and chronic breathing problems through assessment, oxygen therapy, airway management, mechanical ventilation, patient education, and interprofessional decision-making. This guide explains the pathway into respiratory therapy in Canada and connects career planning to clinical readiness.",
    synonyms: ["RT career", "respiratory therapist Canada", "respiratory therapy school", "respiratory therapist licensing"],
    clinicalReviewStatus: "under_review",
    reviewer: {
      name: "NurseNest Clinical Editorial Team",
      credentials: "RN, RT Education Review",
      specialty: "Respiratory Therapy Education",
      reviewedAt: "2026-05-31",
    },
    governance: {
      publishedAt: "2026-05-31",
      updatedAt: "2026-05-31",
      reviewCycleDue: "2026-11-30",
      changeHistory: ["Initial allied health career authority seed page created."],
    },
    sections: [
      {
        id: "role",
        title: "Role Overview",
        body: [
          "Respiratory therapists assess breathing, oxygenation, ventilation, airway safety, and response to respiratory treatments. Their work may include oxygen delivery, aerosol therapy, airway clearance, ventilator support, arterial blood gas interpretation, emergency response, and patient teaching.",
          "The role is clinically demanding because small changes in respiratory status can signal deterioration. Learners should expect to connect physiology, equipment knowledge, patient assessment, and rapid communication with the healthcare team.",
        ],
      },
      {
        id: "education",
        title: "Education And Registration Pathway",
        body: [
          "Most learners complete an accredited respiratory therapy program, supervised clinical placements, and the required registration or certification steps for their province or jurisdiction. Exact requirements vary, so applicants should verify details with the school, provincial regulator, and national credentialing body.",
          "Strong applicants usually prepare in anatomy, physiology, cardiopulmonary science, patient communication, math for clinical calculations, and professional practice expectations before placement begins.",
        ],
      },
      {
        id: "readiness",
        title: "Clinical Readiness Skills",
        body: [
          "High-value readiness areas include respiratory assessment, oxygen delivery devices, ventilator terminology, ABG interpretation, airway equipment, infection prevention, documentation, handoff communication, and recognition of unstable patients.",
          "A student who can explain why oxygen saturation, work of breathing, CO2 retention, mental status, and breath sounds matter together is better prepared than a student who only memorizes device names.",
        ],
      },
    ],
    clinicalPearls: [
      "Respiratory therapy readiness depends on linking oxygenation, ventilation, work of breathing, and patient trajectory.",
      "Clinical placement success often comes from preparation, safe escalation, and clear communication more than perfect recall.",
    ],
    commonMistakes: [
      "Choosing a program without confirming provincial registration requirements and placement expectations.",
      "Studying respiratory equipment names without practicing the assessment cues that determine when equipment is needed.",
    ],
    faqs: [
      {
        question: "Is respiratory therapy only about ventilators?",
        answer:
          "No. Respiratory therapists support assessment, oxygen therapy, airway care, ABG interpretation, education, emergency response, and ventilator management when indicated.",
      },
      {
        question: "What should I study before respiratory therapy placement?",
        answer:
          "Focus on respiratory assessment, oxygen delivery, ABGs, infection prevention, documentation, patient communication, and escalation of deterioration.",
      },
    ],
    related: [
      { label: "ABG Interpretation Guide", href: "/healthcare/allied-study/abg-interpretation-guide", category: "allied-study" },
      { label: "Oxygen Administration", href: "/healthcare/clinical-skills/oxygen-administration", category: "clinical-skills" },
      { label: "Potassium Interpretation", href: "/healthcare/labs/potassium", category: "labs" },
    ],
    references: [
      { title: "National Competency Framework", source: "Canadian Society of Respiratory Therapists", url: "https://www.csrt.com/" },
      { title: "Respiratory Therapy Profession", source: "Government of Canada Job Bank", url: "https://www.jobbank.gc.ca/" },
    ],
  },
  {
    category: "allied-study",
    slug: "abg-interpretation-guide",
    title: "ABG Interpretation Guide",
    deck: "A respiratory and nursing study guide for interpreting pH, PaCO2, bicarbonate, oxygenation, compensation, and clinical context.",
    summary:
      "Arterial blood gas interpretation helps clinicians evaluate oxygenation, ventilation, acid-base status, and compensation. This guide teaches learners to reason through ABGs instead of memorizing isolated normal values.",
    synonyms: ["ABG", "arterial blood gas", "acid base", "PaCO2", "HCO3"],
    clinicalReviewStatus: "under_review",
    reviewer: {
      name: "NurseNest Clinical Editorial Team",
      credentials: "RN, RT, Lab Interpretation Review",
      specialty: "Respiratory And Laboratory Interpretation",
      reviewedAt: "2026-05-31",
    },
    governance: {
      publishedAt: "2026-05-31",
      updatedAt: "2026-05-31",
      reviewCycleDue: "2026-11-30",
      changeHistory: ["Initial allied health study authority seed page created."],
    },
    sections: [
      {
        id: "framework",
        title: "Interpretation Framework",
        body: [
          "Begin with pH to determine acidemia or alkalemia, then interpret PaCO2 for ventilation and bicarbonate for metabolic contribution. Finally, assess oxygenation and decide whether the patient picture matches the numbers.",
          "ABGs are safest when interpreted with respiratory rate, work of breathing, oxygen delivery, mental status, lung sounds, perfusion, renal function, and current therapies.",
        ],
      },
      {
        id: "clinical-meaning",
        title: "Clinical Meaning",
        body: [
          "A rising PaCO2 can signal hypoventilation, fatigue, severe obstructive disease, oversedation, or respiratory failure risk. A low bicarbonate may reflect metabolic acidosis from causes such as sepsis, renal failure, DKA, or severe diarrhea.",
          "The priority is not naming the imbalance alone. The learner should ask whether the patient is compensating, deteriorating, requiring oxygen or ventilation support, or needing escalation.",
        ],
      },
      {
        id: "study-tips",
        title: "Study And Exam Tips",
        body: [
          "Practice ABGs with a consistent sequence: pH, PaCO2, HCO3, compensation, oxygenation, patient context, priority action. This prevents jumping to an answer based on one value.",
          "Exam questions often hide the priority in the assessment data: confusion, severe dyspnea, low oxygen saturation, hypotension, or worsening work of breathing can matter more than a mild abnormality.",
        ],
      },
    ],
    clinicalPearls: [
      "ABG interpretation is a patient assessment skill, not a worksheet exercise.",
      "CO2 retention with decreasing alertness is an escalation cue because ventilation may be failing.",
    ],
    commonMistakes: [
      "Labeling respiratory acidosis without assessing whether the patient is tiring or needs ventilatory support.",
      "Ignoring oxygenation because the acid-base label seems obvious.",
    ],
    faqs: [
      {
        question: "What is the first step in ABG interpretation?",
        answer: "Start with pH to identify acidemia or alkalemia, then compare PaCO2 and bicarbonate to determine the primary process.",
      },
      {
        question: "Why does patient context matter with ABGs?",
        answer: "The same pattern can require different actions depending on oxygenation, mental status, respiratory effort, diagnosis, and trajectory.",
      },
    ],
    related: [
      { label: "Oxygen Administration", href: "/healthcare/clinical-skills/oxygen-administration", category: "clinical-skills" },
      { label: "Respiratory Therapist Career Guide", href: "/healthcare/allied-careers/respiratory-therapist-canada", category: "allied-careers" },
      { label: "Potassium Interpretation", href: "/healthcare/labs/potassium", category: "labs" },
    ],
    references: [
      { title: "Arterial Blood Gas Analysis", source: "NCBI Bookshelf", url: "https://www.ncbi.nlm.nih.gov/books/" },
      { title: "Oxygen Therapy Guidelines", source: "British Thoracic Society", url: "https://www.brit-thoracic.org.uk/" },
    ],
  },
  {
    category: "interview-prep",
    slug: "nursing-interview-questions",
    title: "50 Nursing Interview Questions",
    deck: "A practical interview guide with model-answer structure, safety-focused examples, and mistakes to avoid.",
    summary:
      "Nursing interviews evaluate clinical judgment, communication, accountability, patient safety, teamwork, and readiness for the role. Strong answers use real examples, explain reasoning, and show how the nurse protects patients while learning.",
    synonyms: ["nursing interview", "RN interview questions", "new grad nursing interview", "nurse interview answers"],
    clinicalReviewStatus: "under_review",
    reviewer: {
      name: "NurseNest Clinical Editorial Team",
      credentials: "RN, Clinical Education Review",
      specialty: "Professional Practice",
      reviewedAt: "2026-05-31",
    },
    governance: {
      publishedAt: "2026-05-31",
      updatedAt: "2026-05-31",
      reviewCycleDue: "2026-11-30",
      changeHistory: ["Initial interview preparation authority seed page created."],
    },
    sections: [
      {
        id: "question-types",
        title: "Common Interview Question Types",
        body: [
          "Nursing interviews commonly include behavioral questions, patient-safety scenarios, conflict questions, prioritization prompts, communication examples, and questions about professional growth.",
          "A strong answer names the situation, explains the nursing concern, describes the action taken, and reflects on what was learned or how patient safety was protected.",
        ],
      },
      {
        id: "model-answers",
        title: "Model Answer Structure",
        body: [
          "Use a clear structure such as situation, task, action, result, and reflection. For clinical scenarios, add what you assessed first, how you escalated, who you communicated with, and how you evaluated the outcome.",
          "For example, a question about a deteriorating patient should show assessment, ABC thinking, timely communication, documentation, and willingness to ask for help.",
        ],
      },
      {
        id: "preparation",
        title: "Preparation Strategy",
        body: [
          "Prepare examples for teamwork, conflict, medication safety, patient education, time management, delegation, and handling a mistake. Each example should be honest and specific rather than scripted.",
          "New graduates should emphasize safe practice, teachability, prioritization, and escalation. Experienced nurses should also demonstrate pattern recognition, leadership, and professional accountability.",
        ],
      },
    ],
    clinicalPearls: [
      "Interview answers are stronger when they show how the nurse thinks, not just what the nurse did.",
      "Patient safety examples should include assessment, communication, escalation, and follow-up.",
    ],
    commonMistakes: [
      "Giving vague answers such as 'I am a team player' without a specific clinical example.",
      "Describing a medication or safety mistake without explaining the corrective action and learning.",
    ],
    faqs: [
      {
        question: "How should a new nurse answer clinical scenario questions?",
        answer:
          "Use assessment-first reasoning, explain the priority concern, communicate early, ask for support when needed, and describe how you would evaluate the patient response.",
      },
      {
        question: "Should interview answers include mistakes?",
        answer:
          "Yes, when framed professionally. Explain what happened, how patient safety was protected, what you learned, and how your practice changed.",
      },
    ],
    related: [
      { label: "Nursing Placement Survival Guide", href: "/healthcare/placements/nursing-placement-survival-guide", category: "placements" },
      { label: "NCLEX-RN Study Guide", href: "/healthcare/certifications/nclex-rn-study-guide", category: "certifications" },
      { label: "Heart Failure Care Plan", href: "/healthcare/care-plans/heart-failure-care-plan", category: "care-plans" },
    ],
    references: [
      { title: "Professional Practice Guidance", source: "College of Nurses of Ontario", url: "https://www.cno.org/" },
      { title: "Nursing Career Resources", source: "Government of Canada Job Bank", url: "https://www.jobbank.gc.ca/" },
    ],
  },
  {
    category: "placements",
    slug: "nursing-placement-survival-guide",
    title: "Nursing Placement Survival Guide",
    deck: "A clinical placement guide for preparation, patient safety, communication, skill development, and reflective practice.",
    summary:
      "Nursing placement success depends on preparation, safe assessment habits, communication, accountability, and steady growth. This guide helps students understand what instructors and preceptors are looking for in real clinical environments.",
    synonyms: ["clinical placement", "nursing placement", "clinical practicum", "student nurse placement"],
    clinicalReviewStatus: "under_review",
    reviewer: {
      name: "NurseNest Clinical Editorial Team",
      credentials: "RN, Clinical Education Review",
      specialty: "Clinical Placement Readiness",
      reviewedAt: "2026-05-31",
    },
    governance: {
      publishedAt: "2026-05-31",
      updatedAt: "2026-05-31",
      reviewCycleDue: "2026-11-30",
      changeHistory: ["Initial placement success authority seed page created."],
    },
    sections: [
      {
        id: "preparation",
        title: "Before Placement",
        body: [
          "Review the unit population, common medications, infection prevention expectations, documentation system, scope limits, and escalation process. Preparation should focus on safe participation rather than trying to know everything.",
          "Bring a plan for assessment, notes, questions, and post-shift reflection. Know which skills require direct supervision and clarify expectations before attempting anything unfamiliar.",
        ],
      },
      {
        id: "clinical-day",
        title: "During The Clinical Day",
        body: [
          "Start with patient safety: identity checks, allergies, fall risk, vital signs, pain, respiratory status, lines and tubes, medication timing, and changes from baseline.",
          "Communicate early when findings are concerning. Instructors and preceptors do not expect perfection, but they do expect honesty, safe boundaries, and timely escalation.",
        ],
      },
      {
        id: "growth",
        title: "Reflection And Skill Growth",
        body: [
          "After each shift, identify one clinical judgment lesson, one communication lesson, and one skill to practice. This turns placement into deliberate learning instead of passive exposure.",
          "The strongest students connect assessment findings to priorities, document clearly, ask focused questions, and show improvement from feedback.",
        ],
      },
    ],
    clinicalPearls: [
      "Placement readiness is measured by safety, preparation, communication, and growth, not by pretending to know everything.",
      "A focused assessment and timely escalation can matter more than completing a long task list.",
    ],
    commonMistakes: [
      "Waiting until the end of shift to report a change in patient condition.",
      "Treating feedback as criticism instead of using it to guide the next clinical day.",
    ],
    faqs: [
      {
        question: "What should I review before my first nursing placement?",
        answer:
          "Review unit basics, common diagnoses, medication safety, infection prevention, documentation expectations, communication tools, and when to ask for help.",
      },
      {
        question: "What do preceptors expect from students?",
        answer:
          "They expect safe practice, preparation, honest communication, respect for scope, willingness to learn, and steady improvement.",
      },
    ],
    related: [
      { label: "50 Nursing Interview Questions", href: "/healthcare/interview-prep/nursing-interview-questions", category: "interview-prep" },
      { label: "Oxygen Administration", href: "/healthcare/clinical-skills/oxygen-administration", category: "clinical-skills" },
      { label: "Heart Failure", href: "/healthcare/conditions/heart-failure", category: "conditions" },
    ],
    references: [
      { title: "Entry-To-Practice Competencies", source: "College of Nurses of Ontario", url: "https://www.cno.org/" },
      { title: "Professional Standards", source: "Canadian Nurses Association", url: "https://www.cna-aiic.ca/" },
    ],
  },
  {
    category: "certifications",
    slug: "nclex-rn-study-guide",
    title: "NCLEX-RN Study Guide",
    deck: "A certification guide for planning NCLEX-RN preparation around clinical judgment, safety, prioritization, and adaptive practice.",
    summary:
      "The NCLEX-RN evaluates whether a candidate can provide safe entry-level nursing care. A strong study plan combines content review, clinical judgment practice, rationales, NGN item types, readiness tracking, and remediation of weak areas.",
    synonyms: ["NCLEX", "NCLEX-RN", "RN exam", "nursing board exam", "Next Generation NCLEX"],
    clinicalReviewStatus: "under_review",
    reviewer: {
      name: "NurseNest Clinical Editorial Team",
      credentials: "RN, NCLEX Education Review",
      specialty: "Exam Preparation",
      reviewedAt: "2026-05-31",
    },
    governance: {
      publishedAt: "2026-05-31",
      updatedAt: "2026-05-31",
      reviewCycleDue: "2026-11-30",
      changeHistory: ["Initial certification authority seed page created."],
    },
    sections: [
      {
        id: "exam-focus",
        title: "What The Exam Measures",
        body: [
          "The NCLEX-RN is not just a recall exam. It evaluates safe nursing judgment, prioritization, assessment, intervention, teaching, delegation, and evaluation across client needs and clinical contexts.",
          "Next Generation NCLEX items require learners to recognize cues, analyze data, prioritize hypotheses, generate solutions, take action, and evaluate outcomes.",
        ],
      },
      {
        id: "study-plan",
        title: "Study Plan Framework",
        body: [
          "Begin with a baseline readiness check, then combine targeted lessons, flashcards, practice questions, NGN cases, CAT-style practice, and review of missed rationales. Weak areas should drive the plan rather than raw question volume alone.",
          "High-yield content includes safety, infection control, pharmacology, maternal-child nursing, mental health, pediatrics, prioritization, delegation, labs, ECG basics, and clinical deterioration.",
        ],
      },
      {
        id: "readiness",
        title: "Readiness And Remediation",
        body: [
          "Readiness should be judged by consistency, rationale understanding, confidence accuracy, performance by topic, and ability to explain why an answer is safest.",
          "When practice reveals a weak area, remediation should connect the missed question to a lesson, flashcards, related conditions, medications, labs, and similar questions.",
        ],
      },
    ],
    clinicalPearls: [
      "A missed question becomes useful only when the learner understands the cue they missed and the priority they should have recognized.",
      "Strong NCLEX preparation balances content knowledge with clinical judgment and test-taking discipline.",
    ],
    commonMistakes: [
      "Doing large numbers of questions without reviewing rationales deeply.",
      "Studying only body systems while neglecting delegation, safety, prioritization, and communication.",
    ],
    faqs: [
      {
        question: "How should I start studying for the NCLEX-RN?",
        answer:
          "Start with a readiness baseline, identify weak areas, build a structured plan, practice NGN item types, and review rationales until you can explain the reasoning.",
      },
      {
        question: "Are flashcards enough for NCLEX-RN preparation?",
        answer:
          "Flashcards help retention, but they should be combined with practice questions, rationales, lessons, and clinical judgment activities.",
      },
    ],
    related: [
      { label: "Heart Failure", href: "/healthcare/conditions/heart-failure", category: "conditions" },
      { label: "50 Nursing Interview Questions", href: "/healthcare/interview-prep/nursing-interview-questions", category: "interview-prep" },
      { label: "Nursing Placement Survival Guide", href: "/healthcare/placements/nursing-placement-survival-guide", category: "placements" },
    ],
    references: [
      { title: "NCLEX-RN Examination", source: "National Council of State Boards of Nursing", url: "https://www.ncsbn.org/" },
      { title: "Entry-Level RN Competencies", source: "Canadian Council of Registered Nurse Regulators", url: "https://www.ccrnr.ca/" },
    ],
  },
];

export function getAuthorityPages(): AuthorityPage[] {
  return [...AUTHORITY_CONTENT_PAGES].sort((a, b) => a.title.localeCompare(b.title));
}

export function getAuthorityPagesByCategory(category: AuthorityContentCategory): AuthorityPage[] {
  return getAuthorityPages().filter((page) => page.category === category);
}

export function getAuthorityPage(category: string, slug: string): AuthorityPage | null {
  return AUTHORITY_CONTENT_PAGES.find((page) => page.category === category && page.slug === slug) ?? null;
}

export function authorityContentPath(page: Pick<AuthorityPage, "category" | "slug">): string {
  return `/healthcare/${page.category}/${page.slug}`;
}

export function listAuthorityContentPaths(): string[] {
  return ["/healthcare", ...getAuthorityPages().map((page) => authorityContentPath(page))];
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function authorityPageText(page: AuthorityPage): string {
  return [
    page.title,
    page.deck,
    page.summary,
    ...page.synonyms,
    ...page.sections.flatMap((section) => [section.id, section.title, ...section.body]),
    ...page.clinicalPearls,
    ...page.commonMistakes,
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ...page.related.map((link) => link.label),
    ...page.references.flatMap((reference) => [reference.title, reference.source]),
  ].join(" ");
}

function normalizedIncludes(text: string, needle: string): boolean {
  const normalizedText = text.toLowerCase().replace(/[^a-z0-9]+/g, " ");
  const normalizedNeedle = needle.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return normalizedText.includes(normalizedNeedle);
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function validateClinicalAuthorityStandard(page: AuthorityPage): ClinicalAuthorityAudit {
  const profile = CLINICAL_AUTHORITY_STANDARD[page.category];
  const text = authorityPageText(page);
  const wordCount = countWords(text);
  const missingElements = profile.requiredElements.filter((element) => !normalizedIncludes(text, element));
  const requiredCoverage = ((profile.requiredElements.length - missingElements.length) / Math.max(1, profile.requiredElements.length)) * 100;
  const relatedCategories = new Set(page.related.map((link) => link.category).filter(Boolean));
  const productLinks = page.related.filter((link) => !link.href.startsWith("/healthcare"));
  const issues: string[] = [];

  if (wordCount < profile.wordTarget.min) issues.push("below_minimum_depth_target");
  if (missingElements.length > 0) issues.push("missing_required_clinical_elements");
  if (page.references.length < 3) issues.push("needs_stronger_reference_set");
  if (page.related.length < 8) issues.push("needs_deeper_internal_linking");
  if (productLinks.length < 2) issues.push("needs_product_learning_links");
  if (page.clinicalReviewStatus !== "clinically_reviewed") issues.push("requires_clinical_review");

  const dimensionScores = {
    clinicalDepth: clampScore((wordCount / profile.wordTarget.min) * 100),
    educationalValue: clampScore(requiredCoverage),
    practicalUtility: clampScore(((page.clinicalPearls.length + page.commonMistakes.length + page.faqs.length) / 10) * 100),
    examRelevance: clampScore(
      ["nclex", "rex pn", "exam", "practice question", "knowledge check"].some((term) => normalizedIncludes(text, term)) ? 100 : 35,
    ),
    clinicalAccuracy: clampScore((Math.min(page.references.length, 5) / 5) * 70 + (page.reviewer.credentials ? 30 : 0)),
    internalLinking: clampScore((Math.min(page.related.length, 8) / 8) * 65 + (Math.min(relatedCategories.size, 5) / 5) * 20 + (Math.min(productLinks.length, 2) / 2) * 15),
    eeatReadiness: clampScore(
      (page.reviewer.name ? 20 : 0) +
        (page.reviewer.credentials ? 20 : 0) +
        (page.reviewer.specialty ? 15 : 0) +
        (page.reviewer.reviewedAt ? 15 : 0) +
        (page.governance.updatedAt ? 15 : 0) +
        (page.governance.reviewCycleDue ? 15 : 0),
    ),
    contentCompleteness: clampScore(requiredCoverage * 0.7 + (wordCount >= profile.wordTarget.min ? 30 : 0)),
  };
  const score = clampScore(
    Object.values(dimensionScores).reduce((sum, value) => sum + value, 0) / Object.values(dimensionScores).length,
  );

  return {
    score,
    minimumPublicationScore: CLINICAL_AUTHORITY_MINIMUM_PUBLICATION_SCORE,
    publishReady:
      score >= CLINICAL_AUTHORITY_MINIMUM_PUBLICATION_SCORE &&
      issues.length === 0 &&
      missingElements.length === 0 &&
      wordCount >= profile.wordTarget.min,
    wordCount,
    targetWordRange: `${profile.wordTarget.min}-${profile.wordTarget.max}`,
    missingElements,
    issues,
    dimensionScores,
  };
}

export function buildAuthorityContentDashboard(): {
  generatedAt: string;
  totalPublishedPages: number;
  totalPhaseOneTarget: number;
  totalLongTermTarget: number;
  rows: AuthorityDashboardRow[];
} {
  const rows = (Object.keys(AUTHORITY_CONTENT_PHASE_TARGETS) as AuthorityContentCategory[]).map((category) => {
    const target = AUTHORITY_CONTENT_PHASE_TARGETS[category];
    const pages = getAuthorityPagesByCategory(category);
    const qualityResults = pages.map((page) => validateAuthorityPage(page));
    const clinicalAuthorityAudits = pages.map((page) => validateClinicalAuthorityStandard(page));
    const eeatReady = qualityResults.filter((result) => result.publishReady).length;
    const clinicalAuthorityReady = clinicalAuthorityAudits.filter((result) => result.publishReady).length;
    const internalLinkAverage =
      Math.round((pages.reduce((sum, page) => sum + page.related.length, 0) / Math.max(1, pages.length)) * 10) / 10;
    const eeatCoverage = Math.round((eeatReady / Math.max(1, pages.length)) * 100);
    const schemaCoverage = pages.length > 0 ? 100 : 0;
    const clinicalAuthorityCoverage = Math.round((clinicalAuthorityReady / Math.max(1, pages.length)) * 100);
    const averageClinicalAuthorityScore = Math.round(
      clinicalAuthorityAudits.reduce((sum, audit) => sum + audit.score, 0) / Math.max(1, clinicalAuthorityAudits.length),
    );
    const linkedToMonetization = pages.filter((page) =>
      page.related.some((link) => !link.href.startsWith("/healthcare") || link.category === "question" || link.category === "flashcard"),
    ).length;
    const monetizationCoverage = Math.round((linkedToMonetization / Math.max(1, pages.length)) * 100);

    return {
      ...target,
      title: AUTHORITY_CATEGORY_META[category].title,
      publishedPages: pages.length,
      draftGap: Math.max(0, target.phaseOneTarget - pages.length),
      pagesAwaitingReview: pages.filter((page) => page.clinicalReviewStatus === "under_review").length,
      internalLinkAverage,
      eeatCoverage,
      schemaCoverage,
      clinicalAuthorityCoverage,
      averageClinicalAuthorityScore,
      monetizationReadiness: monetizationCoverage >= 80 ? "strong" : monetizationCoverage >= 40 ? "developing" : "foundation",
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    totalPublishedPages: rows.reduce((sum, row) => sum + row.publishedPages, 0),
    totalPhaseOneTarget: rows.reduce((sum, row) => sum + row.phaseOneTarget, 0),
    totalLongTermTarget: rows.reduce((sum, row) => sum + row.longTermTarget, 0),
    rows,
  };
}

export function searchAuthorityContent(query: string, limit = 8): AuthorityPage[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAuthorityPages().slice(0, limit);
  return getAuthorityPages()
    .map((page) => {
      const haystack = [page.title, page.summary, page.deck, ...page.synonyms, ...page.sections.map((section) => section.title)].join(" ").toLowerCase();
      const score = haystack.includes(q) ? 3 : page.synonyms.some((synonym) => synonym.toLowerCase().includes(q)) ? 2 : 0;
      return { page, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title))
    .slice(0, limit)
    .map((item) => item.page);
}

export function validateAuthorityPage(page: AuthorityPage): { score: number; issues: string[]; publishReady: boolean } {
  const issues: string[] = [];
  if (page.sections.length < 3) issues.push("missing_required_sections");
  if (page.references.length < 2) issues.push("insufficient_references");
  if (!page.reviewer.name || !page.reviewer.credentials || !page.reviewer.reviewedAt) issues.push("missing_reviewer");
  if (!page.governance.updatedAt || !page.governance.reviewCycleDue) issues.push("missing_governance_dates");
  if (page.related.length < 3) issues.push("weak_internal_linking");
  if (page.clinicalPearls.length < 2) issues.push("insufficient_clinical_pearls");
  if (page.commonMistakes.length < 2) issues.push("insufficient_common_mistakes");
  if (page.sections.some((section) => section.body.join(" ").length < 140)) issues.push("thin_section");
  const score = Math.max(0, 100 - issues.length * 10);
  return { score, issues, publishReady: score >= 85 && issues.length === 0 };
}

export function buildAuthorityBreadcrumbs(page?: AuthorityPage) {
  const base = [
    { name: "Home", href: "/" },
    { name: "Healthcare Library", href: "/healthcare" },
  ];
  if (!page) return base;
  return [
    ...base,
    { name: AUTHORITY_CATEGORY_META[page.category].title, href: `/healthcare#${page.category}` },
    { name: page.title, href: `/healthcare/${page.category}/${page.slug}` },
  ];
}

export function buildAuthorityJsonLd(page: AuthorityPage) {
  const path = `/healthcare/${page.category}/${page.slug}`;
  const url = absoluteUrl(path);
  const organizationId = `${absoluteUrl("/")}#organization`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.summary,
      datePublished: page.governance.publishedAt,
      dateModified: page.governance.updatedAt,
      reviewedBy: {
        "@type": "Person",
        name: page.reviewer.name,
        honorificSuffix: page.reviewer.credentials,
        knowsAbout: page.reviewer.specialty,
      },
      publisher: {
        "@id": organizationId,
      },
      about: page.synonyms.map((name) => ({ "@type": "MedicalCondition", name })),
      citation: page.references.map((reference) => reference.url),
      isPartOf: {
        "@type": "WebSite",
        name: "NurseNest",
        url: absoluteUrl("/"),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: page.title,
      description: page.summary,
      datePublished: page.governance.publishedAt,
      dateModified: page.governance.updatedAt,
      author: {
        "@type": "Organization",
        name: "NurseNest Clinical Editorial Team",
      },
      reviewedBy: {
        "@type": "Person",
        name: page.reviewer.name,
        honorificSuffix: page.reviewer.credentials,
        knowsAbout: page.reviewer.specialty,
      },
      publisher: {
        "@id": organizationId,
      },
      mainEntityOfPage: {
        "@id": `${url}#webpage`,
      },
      citation: page.references.map((reference) => reference.url),
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: "NurseNest",
      url: absoluteUrl("/"),
    },
  ];
}
