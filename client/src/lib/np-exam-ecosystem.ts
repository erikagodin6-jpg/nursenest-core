import { EXAM_BLUEPRINTS, type ExamBlueprint } from "./question-pool";

export type NpExamCode = "AANP" | "ANCC" | "CNPLE" | "UPCOMING_CANADA_NP" | "AANP-FNP" | "ANCC-FNP" | "AGPCNP" | "AGACNP" | "PMHNP" | "PNP" | "WHNP" | "ENP";

export const NP_QUESTION_POOLS = {
  NP_CORE_BANK: {
    id: "NP_CORE_BANK",
    label: "NP Core Bank",
    description: "Shared foundation questions across all NP exams",
    exams: ["AANP", "ANCC", "CNPLE", "AANP-FNP", "ANCC-FNP", "AGPCNP", "AGACNP", "PMHNP", "PNP", "WHNP", "ENP"] as NpExamCode[],
  },
  AANP_BANK: {
    id: "AANP_BANK",
    label: "AANP-FNP Question Bank",
    description: "AANP-FNP certification exam questions",
    examFilter: "AANP-FNP",
    region: "US" as const,
  },
  ANCC_BANK: {
    id: "ANCC_BANK",
    label: "ANCC-FNP Question Bank",
    description: "ANCC-FNP certification exam questions",
    examFilter: "ANCC-FNP",
    region: "US" as const,
  },
  CANADA_NP_BANK: {
    id: "CANADA_NP_BANK",
    label: "Canadian NP Question Bank",
    description: "Canadian NP licensing exam questions (CNPE)",
    examFilter: "CNPE",
    region: "CA" as const,
  },
  AANP_FNP_BANK: {
    id: "AANP_FNP_BANK",
    label: "AANP-FNP Question Bank",
    description: "AANP Family Nurse Practitioner certification questions",
    examFilter: "AANP-FNP",
    region: "US" as const,
  },
  ANCC_FNP_BANK: {
    id: "ANCC_FNP_BANK",
    label: "ANCC-FNP Question Bank",
    description: "ANCC Family Nurse Practitioner Board Certification questions",
    examFilter: "ANCC-FNP",
    region: "US" as const,
  },
  AGPCNP_AANP_BANK: {
    id: "AGPCNP_AANP_BANK",
    label: "AGPCNP (AANP) Question Bank",
    description: "Adult-Gerontology Primary Care NP exam questions (AANP pathway)",
    examFilter: "AGPCNP-AANP",
    region: "US" as const,
  },
  AGPCNP_ANCC_BANK: {
    id: "AGPCNP_ANCC_BANK",
    label: "AGPCNP (ANCC) Question Bank",
    description: "Adult-Gerontology Primary Care NP exam questions (ANCC pathway)",
    examFilter: "AGPCNP-ANCC",
    region: "US" as const,
  },
  AGACNP_BANK: {
    id: "AGACNP_BANK",
    label: "AGACNP Question Bank",
    description: "Adult-Gerontology Acute Care NP certification questions",
    examFilter: "AGACNP",
    region: "US" as const,
  },
  PMHNP_BANK: {
    id: "PMHNP_BANK",
    label: "PMHNP Question Bank",
    description: "Psychiatric-Mental Health NP certification questions",
    examFilter: "PMHNP",
    region: "US" as const,
  },
  PNP_BANK: {
    id: "PNP_BANK",
    label: "PNP Question Bank",
    description: "Pediatric Nurse Practitioner certification questions",
    examFilter: "PNP",
    region: "US" as const,
  },
  WHNP_BANK: {
    id: "WHNP_BANK",
    label: "WHNP Question Bank",
    description: "Women's Health Nurse Practitioner certification questions",
    examFilter: "WHNP",
    region: "US" as const,
  },
  ENP_BANK: {
    id: "ENP_BANK",
    label: "ENP Question Bank",
    description: "Emergency Nurse Practitioner certification questions",
    examFilter: "ENP",
    region: "US" as const,
  },
} as const;

export const NP_EXAM_TAGS = {
  exam: ["AANP-FNP", "ANCC-FNP", "CNPE", "AGPCNP-AANP", "AGPCNP-ANCC", "AGACNP", "PMHNP", "PNP", "WHNP", "ENP"] as const,
  domain: [
    "Health Assessment",
    "Diagnosis",
    "Therapeutics",
    "Health Promotion & Disease Prevention",
    "Professional Role & Responsibility",
  ] as const,
  difficulty: ["easy", "moderate", "hard"] as const,
};

export const BODY_SYSTEM_TO_NP_DOMAIN: Record<string, string> = {
  "Cardiovascular": "Health Assessment",
  "Respiratory": "Health Assessment",
  "Neurological": "Diagnosis",
  "Endocrine & Metabolic": "Diagnosis",
  "Renal & Nephrology": "Therapeutics",
  "Hematology & Oncology": "Diagnosis",
  "Maternity & Obstetrics": "Health Assessment",
  "Neonatal": "Health Assessment",
  "Immune System": "Diagnosis",
  "Pharmacology": "Therapeutics",
  "Procedures": "Health Assessment",
  "Musculoskeletal": "Health Assessment",
  "GI & Hepatology": "Therapeutics",
  "Dermatology": "Health Assessment",
  "Psychiatry & Mental Health": "Therapeutics",
  "Women's Health & Gynecology": "Health Assessment",
  "Family Medicine Primary Care": "Health Promotion & Disease Prevention",
  "Palliative & Ethics": "Professional Role & Responsibility",
  "Infectious Disease": "Therapeutics",
  "Trauma & Emergency": "Therapeutics",
  "Geriatric Medicine": "Health Assessment",
  "Pain Management": "Therapeutics",
  "Assessment Skills": "Health Assessment",
  "Rheumatology": "Diagnosis",
  "Toxicology": "Therapeutics",
  "Rare & Genetic Disorders": "Diagnosis",
  "Critical Care Advanced": "Therapeutics",
  "Core Advanced Pathophysiology": "Diagnosis",
  "Delegation & Prioritization": "Professional Role & Responsibility",
  "Clinical Scenarios & Prioritization": "Professional Role & Responsibility",
  "Gastrointestinal": "Therapeutics",
  "Endocrine": "Diagnosis",
  "Pediatrics": "Health Assessment",
  "Mental Health": "Therapeutics",
  "Reproductive Health": "Health Assessment",
  "Obstetrics & Prenatal": "Health Assessment",
  "Postpartum & Lactation": "Health Assessment",
  "Gynecology": "Diagnosis",
  "Menopause & Hormonal": "Therapeutics",
  "Pediatric Growth & Development": "Health Assessment",
  "Pediatric Immunizations": "Health Promotion & Disease Prevention",
  "Child & Adolescent Behavioral": "Therapeutics",
  "Neonatal & Congenital": "Diagnosis",
  "Emergency Triage": "Health Assessment",
  "Trauma & Acute Injury": "Therapeutics",
  "Toxicology & Overdose": "Therapeutics",
  "Psychopharmacology": "Therapeutics",
  "Psychiatric Disorders": "Diagnosis",
  "Crisis & Suicidality": "Therapeutics",
  "Geriatric Syndromes": "Health Assessment",
  "Palliative & End-of-Life": "Professional Role & Responsibility",
  "Critical Care & ICU": "Therapeutics",
  "Hemodynamic Monitoring": "Health Assessment",
  "Ventilator Management": "Therapeutics",
};

export interface NpLessonDomainMapping {
  domain: string;
  lessonCategories: string[];
  description: string;
}

export const NP_LESSON_DOMAIN_MAP: NpLessonDomainMapping[] = [
  {
    domain: "Health Assessment",
    lessonCategories: [
      "Cardiovascular", "Respiratory", "Musculoskeletal", "Dermatology",
      "Women's Health & Gynecology", "Maternity & Obstetrics", "Neonatal",
      "Geriatric Medicine", "Assessment Skills", "Procedures",
    ],
    description: "Comprehensive and focused health assessments, physical examination techniques, and clinical findings interpretation",
  },
  {
    domain: "Diagnosis",
    lessonCategories: [
      "Neurological", "Endocrine & Metabolic", "Hematology & Oncology",
      "Immune System", "Rheumatology", "Rare & Genetic Disorders",
      "Core Advanced Pathophysiology",
    ],
    description: "Differential diagnosis formulation, diagnostic test interpretation, and clinical reasoning frameworks",
  },
  {
    domain: "Therapeutics",
    lessonCategories: [
      "Pharmacology", "Renal & Nephrology", "GI & Hepatology",
      "Psychiatry & Mental Health", "Infectious Disease", "Trauma & Emergency",
      "Pain Management", "Toxicology", "Critical Care Advanced", "Cardiovascular",
      "Respiratory",
    ],
    description: "Pharmacological and non-pharmacological management, drug selection, dosing, monitoring, and treatment guidelines",
  },
  {
    domain: "Health Promotion & Disease Prevention",
    lessonCategories: [
      "Family Medicine Primary Care", "Pre-Nursing Foundations",
      "Nursing Fundamentals", "Community Health",
    ],
    description: "Screening guidelines, immunization schedules, risk factor modification, and anticipatory guidance",
  },
  {
    domain: "Professional Role & Responsibility",
    lessonCategories: [
      "Palliative & Ethics", "Delegation & Prioritization",
      "Clinical Scenarios & Prioritization", "Safety & Ethics",
    ],
    description: "Scope of practice, collaborative practice, professional accountability, and quality improvement",
  },
];

export function getLessonDomainForBodySystem(bodySystem: string): string {
  return BODY_SYSTEM_TO_NP_DOMAIN[bodySystem] || "Health Assessment";
}

export function getQuestionPoolForExam(examCode: NpExamCode): string {
  switch (examCode) {
    case "AANP": return "AANP_BANK";
    case "ANCC": return "ANCC_BANK";
    case "CNPLE": return "CANADA_NP_BANK";
    case "UPCOMING_CANADA_NP": return "CANADA_NP_BANK";
    case "AANP-FNP": return "AANP_FNP_BANK";
    case "ANCC-FNP": return "ANCC_FNP_BANK";
    case "AGPCNP": return "AGPCNP_AANP_BANK";
    case "AGACNP": return "AGACNP_BANK";
    case "PMHNP": return "PMHNP_BANK";
    case "PNP": return "PNP_BANK";
    case "WHNP": return "WHNP_BANK";
    case "ENP": return "ENP_BANK";
    default: return "NP_CORE_BANK";
  }
}

export function getExamFilterParams(examCode: NpExamCode): { exam?: string; region?: string } {
  switch (examCode) {
    case "AANP": return { exam: "AANP-FNP", region: "US" };
    case "ANCC": return { exam: "ANCC-FNP", region: "US" };
    case "CNPLE": return { exam: "CNPE", region: "CA" };
    case "UPCOMING_CANADA_NP": return { exam: "CNPE", region: "CA" };
    case "AANP-FNP": return { exam: "AANP-FNP", region: "US" };
    case "ANCC-FNP": return { exam: "ANCC-FNP", region: "US" };
    case "AGPCNP": return { exam: "AGPCNP-AANP", region: "US" };
    case "AGACNP": return { exam: "AGACNP", region: "US" };
    case "PMHNP": return { exam: "PMHNP", region: "US" };
    case "PNP": return { exam: "PNP", region: "US" };
    case "WHNP": return { exam: "WHNP", region: "US" };
    case "ENP": return { exam: "ENP", region: "US" };
    default: return {};
  }
}

export function getNpBlueprint(code: string): ExamBlueprint | null {
  return EXAM_BLUEPRINTS[code] || null;
}

export interface NpExamPageData {
  examCode: NpExamCode;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  region: "US" | "CA";
  heroIntro: string;
  overview: string;
  whoIsItFor: string;
  formatExplanation: string;
  scoringInfo: string;
  studyRoadmap: { phase: string; weeks: string; description: string }[];
  examStrategy: string[];
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const AANP_PAGE_DATA: NpExamPageData = {
  examCode: "AANP",
  slug: "np/aanp-exam",
  title: "AANP Certification Exam",
  seoTitle: "AANP Certification Exam Prep: Practice Questions, Study Guide & Mock Exams | NurseNest",
  seoDescription: "Complete AANP certification exam preparation with practice questions, study guides, mock exams, and domain-specific analytics. Prepare for the American Academy of Nurse Practitioners exam.",
  h1: "AANP Certification Exam: Complete Preparation Guide",
  region: "US",
  heroIntro: "The American Academy of Nurse Practitioners Certification Board (AANPCB) administers the AANP certification exam, one of the two primary pathways to NP certification in the United States. NurseNest provides comprehensive AANP-aligned preparation tools including practice questions, mock exams, and domain-specific performance analytics.",
  overview: "The AANP certification exam is a competency-based assessment designed to evaluate entry-level nurse practitioner knowledge and clinical decision-making. The exam covers five core domains: Health Assessment, Diagnosis, Therapeutics, Health Promotion & Disease Prevention, and Professional Role & Responsibility. It is available for Family Nurse Practitioners (FNP), Adult-Gerontology Primary Care NPs (AGPCNP), and Emergency Nurse Practitioners (ENP).",
  whoIsItFor: "The AANP certification exam is designed for nurse practitioners who have completed an accredited graduate-level NP program (Master's or Doctoral). Candidates must hold a current, active RN license and have completed the required clinical hours in their specialty. The exam is recognized by all U.S. states for NP licensure and prescriptive authority.",
  formatExplanation: "The AANP exam consists of 150 questions (135 scored, 15 pretest items for validation). You have 4 hours to complete the exam. Questions are multiple-choice with four options and one best answer. The exam uses a fixed-length, linear format — not computer adaptive. All candidates receive the same number of questions regardless of performance.",
  scoringInfo: "The AANP exam uses a scaled scoring system from 200 to 800. The passing score is 500. Raw scores are converted to scaled scores using psychometric equating methods to ensure fairness across different exam forms. Results are available immediately upon completion at the testing center.",
  studyRoadmap: [
    { phase: "Foundation Review", weeks: "Weeks 1-3", description: "Review core clinical content across all five domains. Focus on advanced health assessment, pathophysiology, and pharmacology. Use NurseNest NP lessons mapped to AANP domains." },
    { phase: "Clinical Application", weeks: "Weeks 4-6", description: "Complete AANP-filtered practice questions daily. Focus on clinical decision-making, differential diagnosis, and treatment selection. Review rationales for all answer choices." },
    { phase: "Domain Deep Dive", weeks: "Weeks 7-9", description: "Target weak domains identified through practice analytics. Focus on Therapeutics and Diagnosis domains which comprise 45% of the exam. Study FDA-approved medications and prescribing guidelines." },
    { phase: "Exam Readiness", weeks: "Weeks 10-12", description: "Take full-length AANP mock exams under timed conditions. Review performance by domain. Focus final review on high-yield topics and commonly tested clinical scenarios." },
  ],
  examStrategy: [
    "Read each question stem completely before looking at answer options",
    "Identify the clinical priority in each scenario — what is the most important finding?",
    "For pharmacology questions, consider mechanism of action, contraindications, and monitoring parameters",
    "When choosing between two similar answers, select the one that addresses the most immediate clinical concern",
    "Use the process of elimination — rule out clearly incorrect options first",
    "Manage your time: aim for approximately 1.5 minutes per question with time reserved for review",
  ],
  faqs: [
    { q: "How many questions are on the AANP exam?", a: "The AANP exam has 150 questions total: 135 scored items and 15 unscored pretest items. You cannot distinguish between scored and pretest questions during the exam." },
    { q: "What is the passing score for the AANP exam?", a: "The passing score is 500 on a 200-800 scaled score. Raw scores are converted using psychometric equating to ensure consistency across exam forms." },
    { q: "How long is the AANP certification exam?", a: "You have 4 hours (240 minutes) to complete all 150 questions. This includes time for reviewing flagged questions." },
    { q: "What domains does the AANP exam cover?", a: "The AANP exam covers five domains: Health Assessment (25%), Diagnosis (20%), Therapeutics (25%), Health Promotion & Disease Prevention (15%), and Professional Role & Responsibility (15%)." },
    { q: "Can I retake the AANP exam if I fail?", a: "Yes. You can retake the exam up to 3 times within a 365-day period. After 3 attempts, you must wait 365 days from your first attempt before testing again." },
    { q: "Is the AANP exam the same as the ANCC exam?", a: "No. The AANP and ANCC are separate certifying bodies with different exams. The AANP focuses more on clinical management scenarios, while the ANCC includes additional professional role and research questions. Both are accepted for NP licensure." },
  ],
  keywords: ["AANP exam prep", "AANP certification", "AANP practice questions", "AANP mock exam", "nurse practitioner certification AANP", "AANP study guide", "FNP certification exam"],
};

export const ANCC_PAGE_DATA: NpExamPageData = {
  examCode: "ANCC",
  slug: "np/ancc-exam",
  title: "ANCC Certification Exam",
  seoTitle: "ANCC Certification Exam Prep: Practice Questions, Study Guide & Mock Exams | NurseNest",
  seoDescription: "Complete ANCC certification exam preparation with practice questions, study guides, mock exams, and domain-specific analytics. Prepare for the American Nurses Credentialing Center exam.",
  h1: "ANCC Certification Exam: Complete Preparation Guide",
  region: "US",
  heroIntro: "The American Nurses Credentialing Center (ANCC) administers NP certification exams across multiple specialties. NurseNest provides ANCC-aligned preparation tools including practice questions mapped to the ANCC exam blueprint, mock exams with ANCC-specific scoring (100-500 scale), and detailed performance analytics.",
  overview: "The ANCC certification exam evaluates nurse practitioner competency using a comprehensive assessment aligned to the ANCC exam blueprint. The exam covers advanced clinical knowledge, evidence-based practice, professional role development, and healthcare systems. ANCC offers certification for FNP-BC, AGPCNP-BC, AGACNP-BC, PMHNP-BC, PNP-BC, and other NP specialties.",
  whoIsItFor: "The ANCC certification exam is for nurse practitioners who have completed an accredited Master's or Doctoral NP program. Candidates must hold a current RN license and have completed the required clinical practice hours. ANCC certification is recognized in all U.S. states and is often preferred by academic medical centers and VA hospitals.",
  formatExplanation: "The ANCC exam contains 175 questions (150 scored, 25 pretest items). You have 3.5 hours to complete the exam. Questions are multiple-choice with four options. The exam uses a fixed-length format. ANCC exams include clinical judgment questions as well as questions about professional role, research methodology, and healthcare policy.",
  scoringInfo: "The ANCC exam uses a scaled scoring system from 100 to 500. The passing score is 350. Scores are calculated using a criterion-referenced method — your performance is measured against a fixed standard, not against other candidates. Results are typically available within 24-48 hours of testing.",
  studyRoadmap: [
    { phase: "Content Foundation", weeks: "Weeks 1-3", description: "Review clinical content and professional role competencies. The ANCC exam includes more professional role, research, and healthcare policy questions than the AANP. Study evidence-based practice frameworks and quality improvement methods." },
    { phase: "Clinical Practice", weeks: "Weeks 4-6", description: "Complete ANCC-filtered practice questions covering clinical management, pharmacology, and diagnostic reasoning. Review questions that integrate professional role competencies with clinical scenarios." },
    { phase: "Specialty Focus", weeks: "Weeks 7-9", description: "Concentrate on your specialty area (FNP, AGPCNP, PMHNP, etc.). Use NurseNest analytics to identify domain-specific gaps. Review ANCC-specific content including healthcare systems, research application, and professional development." },
    { phase: "Final Preparation", weeks: "Weeks 10-12", description: "Complete full-length ANCC mock exams with the 100-500 scoring scale. Target the 350 passing threshold. Review high-frequency clinical topics and professional role questions." },
  ],
  examStrategy: [
    "Pay attention to professional role and research-oriented questions — these are more prevalent on the ANCC than the AANP",
    "For clinical questions, identify the patient's primary problem before selecting a management strategy",
    "Consider evidence-based guidelines and their levels of evidence when choosing interventions",
    "Healthcare systems questions may address quality improvement, patient safety initiatives, and interprofessional collaboration",
    "Pharmacology questions include FDA black box warnings, contraindications, and monitoring requirements",
    "Budget approximately 1.2 minutes per question to allow time for review of flagged items",
  ],
  faqs: [
    { q: "How many questions are on the ANCC exam?", a: "The ANCC exam has 175 questions total: 150 scored items and 25 unscored pretest items used for exam development." },
    { q: "What is the passing score for the ANCC exam?", a: "The passing score is 350 on a 100-500 scaled score. This is a criterion-referenced standard based on minimum competency requirements." },
    { q: "How does the ANCC exam differ from the AANP?", a: "The ANCC exam includes more questions about professional role, research, healthcare policy, and evidence-based practice. The AANP focuses more heavily on clinical management scenarios. Both cover the same core clinical domains." },
    { q: "Which ANCC certifications are available for NPs?", a: "ANCC offers FNP-BC (Family), AGPCNP-BC (Adult-Gerontology Primary Care), AGACNP-BC (Acute Care), PMHNP-BC (Psychiatric Mental Health), PNP-BC (Pediatric), and other specialty certifications." },
    { q: "How long is the ANCC certification exam?", a: "You have 3.5 hours (210 minutes) to complete 175 questions. This includes time for the exam tutorial and post-exam survey." },
    { q: "Can I switch from ANCC to AANP certification?", a: "Yes. You can hold certification from both bodies simultaneously. Many NPs choose one based on employer preference, cost, or exam content focus. Both are accepted nationwide for NP licensure." },
  ],
  keywords: ["ANCC exam prep", "ANCC certification", "ANCC practice questions", "ANCC mock exam", "ANCC FNP-BC", "ANCC AGPCNP-BC", "ANCC PMHNP-BC", "nurse practitioner certification ANCC"],
};

export const UPCOMING_CANADA_NP_DATA: NpExamPageData = {
  examCode: "UPCOMING_CANADA_NP",
  slug: "np/upcoming-canada-np-exam",
  title: "Upcoming Canadian NP Exam Changes",
  seoTitle: "Upcoming Canadian NP Exam Changes: New Pathways, Format & Preparation Guide | NurseNest",
  seoDescription: "Stay ahead of upcoming changes to the Canadian Nurse Practitioner licensing examination. Learn about expected exam structure, new competency domains, and preparation strategies for the evolving Canadian NP exam landscape.",
  h1: "Upcoming Canadian NP Exam: Changes, New Pathways & Preparation",
  region: "CA",
  heroIntro: "The Canadian NP examination landscape is evolving as regulatory bodies review and update competency frameworks, exam formats, and licensing pathways. NurseNest is committed to providing the most current preparation tools aligned to both current and upcoming Canadian NP exam changes. This page provides comprehensive guidance on anticipated developments and how to prepare.",
  overview: "Canadian NP licensing is undergoing significant evolution as the Canadian Council of Registered Nurse Regulators (CCRNR) and provincial regulatory bodies work to modernize the NP competency assessment process. Expected changes include updates to the competency framework, potential introduction of new question formats, enhanced integration of clinical reasoning assessment, and alignment with evolving NP scope of practice across Canadian provinces and territories. These changes reflect the growing role of NPs in Canadian healthcare, including expanded prescribing authority, independent practice models, and primary care leadership.",
  whoIsItFor: "This page is essential for NP students currently in Canadian graduate programs, recent NP graduates preparing for their licensing exam, practicing NPs seeking re-certification, and internationally educated NPs pursuing Canadian licensure. Understanding upcoming changes early allows you to align your study strategy with the evolving exam format.",
  formatExplanation: "While final details of upcoming exam changes are still being determined, several developments are anticipated based on regulatory consultations and competency framework reviews. The current CNPLE format (approximately 170 questions, 4-hour time limit, linear format) may transition to include enhanced clinical reasoning items, integrated case-based question clusters, and potentially a multi-stage assessment model. Questions will continue to be available in both English and French.",
  scoringInfo: "The current CNPLE uses a criterion-referenced passing standard. Upcoming changes may refine the scoring methodology to better differentiate competency levels across domains. Provincial regulatory bodies are expected to maintain the pass/fail reporting model with diagnostic domain-level feedback for unsuccessful candidates. Any scoring changes will be communicated well in advance of implementation to allow candidates adequate preparation time.",
  studyRoadmap: [
    { phase: "Current Competency Mastery", weeks: "Weeks 1-4", description: "Build a strong foundation in the five core NP competency domains: Health Assessment, Diagnosis, Therapeutics, Health Promotion & Disease Prevention, and Professional Role & Responsibility. These domains are expected to remain central to any updated exam." },
    { phase: "Clinical Reasoning Focus", weeks: "Weeks 5-8", description: "Develop advanced clinical reasoning skills through case-based practice. Upcoming exam formats are expected to emphasize multi-step clinical reasoning, differential diagnosis refinement, and evidence-based treatment selection. Practice with NurseNest's Canadian NP question bank." },
    { phase: "Canadian Healthcare Integration", weeks: "Weeks 9-11", description: "Review Canadian-specific healthcare frameworks including provincial formularies, NACI immunization guidelines, Canadian clinical practice guidelines, and interprofessional collaboration models. Upcoming exams will continue to emphasize Canadian healthcare context." },
    { phase: "Exam Readiness", weeks: "Week 12", description: "Complete practice exams using the Canadian NP question pool. Review performance analytics by domain. Focus final preparation on identified gaps and high-yield Canadian clinical content." },
  ],
  examStrategy: [
    "Master the current CNPLE competencies — foundational knowledge remains essential regardless of format changes",
    "Develop strong clinical reasoning skills that transfer across any exam format",
    "Stay current with Canadian clinical practice guidelines and provincial NP scope of practice regulations",
    "Practice with case-based questions that require multi-step clinical reasoning",
    "Focus on Canadian-specific content: SI units, Health Canada formulary, NACI guidelines, provincial drug schedules",
    "Engage with NurseNest's Canadian NP community for updates on exam changes and shared preparation strategies",
    "Review pharmacology with attention to Canadian prescribing frameworks and controlled substance regulations",
  ],
  faqs: [
    { q: "When will the Canadian NP exam changes take effect?", a: "Specific implementation dates have not been finalized. The CCRNR and provincial regulatory bodies are currently in the review and consultation phase. NurseNest will update this page as official timelines are announced." },
    { q: "Will the current CNPLE be replaced entirely?", a: "The current CNPLE is expected to evolve rather than be replaced entirely. Core competency domains will remain consistent with potential changes to question format, scoring methodology, and assessment structure." },
    { q: "Should I wait for the new exam or take the current CNPLE?", a: "If you are eligible to take the current CNPLE, proceeding with your exam is recommended. The core knowledge and competencies being tested will remain relevant. Delaying your exam may result in knowledge decay and delayed entry to practice." },
    { q: "How can I prepare for exam changes I don't know about yet?", a: "Focus on mastering the five core NP competency domains and developing strong clinical reasoning skills. These are transferable regardless of exam format changes. Use NurseNest's adaptive practice tools to identify and address knowledge gaps." },
    { q: "Will NurseNest update its content for the new exam format?", a: "Yes. NurseNest is actively monitoring all Canadian NP exam developments and will update question banks, mock exams, and study resources to align with any confirmed changes as soon as details are published." },
    { q: "Are Canadian NP exam questions different from US NP questions?", a: "Yes. Canadian NP questions use SI units (mmol/L, umol/L), reference Health Canada formulary and provincial drug schedules, use Canadian clinical practice guidelines, and reflect Canadian healthcare system context. NurseNest never mixes US and Canadian NP questions." },
  ],
  keywords: ["Canadian NP exam changes", "CNPLE updates", "upcoming NP exam Canada", "Canadian nurse practitioner licensing exam", "NP exam Canada 2025 2026", "CCRNR NP exam", "Canadian NP certification changes"],
};

export const AGPCNP_PAGE_DATA: NpExamPageData = {
  examCode: "AGPCNP",
  slug: "np/agpcnp-exam",
  title: "AGPCNP Certification Exam",
  seoTitle: "AGPCNP Certification Exam Prep: Practice Questions & Study Guide | NurseNest",
  seoDescription: "Complete Adult-Gerontology Primary Care NP (AGPCNP) exam preparation with practice questions, study guides, and domain-specific analytics.",
  h1: "AGPCNP Certification Exam: Complete Preparation Guide",
  region: "US",
  heroIntro: "The Adult-Gerontology Primary Care Nurse Practitioner (AGPCNP) certification is offered by both AANP and ANCC. NurseNest provides comprehensive AGPCNP-aligned preparation tools including practice questions mapped to exam blueprints and detailed performance analytics.",
  overview: "The AGPCNP certification exam evaluates competency in managing primary care for adults from adolescence through older adulthood. It covers chronic disease management, acute episodic care, health promotion, and disease prevention across the adult-geriatric lifespan.",
  whoIsItFor: "The AGPCNP certification is for nurse practitioners who have completed an accredited Adult-Gerontology Primary Care NP program. Candidates must hold a current RN license and have completed the required clinical hours focused on adult and geriatric primary care populations.",
  formatExplanation: "The AGPCNP exam format varies by certifying body. AANP: 150 questions (135 scored), 4 hours. ANCC: 175 questions (150 scored), 3.5 hours. Both use multiple-choice format with one best answer.",
  scoringInfo: "AANP uses a 200-800 scale with 500 passing. ANCC uses a 100-500 scale with 350 passing. Both use criterion-referenced scoring methods.",
  studyRoadmap: [
    { phase: "Foundation Review", weeks: "Weeks 1-3", description: "Review adult and geriatric pathophysiology, chronic disease management, and health promotion across the lifespan." },
    { phase: "Clinical Application", weeks: "Weeks 4-6", description: "Complete AGPCNP-filtered practice questions focusing on chronic illness management, acute episodic care, and pharmacology." },
    { phase: "Domain Deep Dive", weeks: "Weeks 7-9", description: "Target weak domains. Focus on adult/geriatric disease management and palliative care which comprise the majority of the exam." },
    { phase: "Exam Readiness", weeks: "Weeks 10-12", description: "Take full-length AGPCNP mock exams under timed conditions. Review performance by domain and focus on high-yield geriatric topics." },
  ],
  examStrategy: [
    "Focus on chronic disease management across the adult lifespan",
    "Know geriatric-specific considerations: polypharmacy, fall risk, cognitive screening",
    "Understand age-appropriate screening guidelines and preventive care",
    "Review pharmacology with attention to age-related pharmacokinetic changes",
    "Practice clinical reasoning for multi-morbidity scenarios",
    "Budget time appropriately based on your certifying body's exam format",
  ],
  faqs: [
    { q: "What is the difference between AGPCNP-AANP and AGPCNP-ANCC?", a: "Both certify the same specialty. AANP focuses more on clinical management while ANCC includes professional role and research questions. Both are accepted for licensure nationwide." },
    { q: "What population does the AGPCNP serve?", a: "The AGPCNP serves adults from adolescence (13+) through older adulthood in primary care settings." },
    { q: "How does AGPCNP differ from AGACNP?", a: "AGPCNP focuses on primary care and chronic disease management. AGACNP focuses on acute and critical care of adults in hospital settings." },
  ],
  keywords: ["AGPCNP exam prep", "AGPCNP certification", "adult-gerontology primary care NP", "AGPCNP practice questions", "AGPCNP study guide"],
};

export const AGACNP_PAGE_DATA: NpExamPageData = {
  examCode: "AGACNP",
  slug: "np/agacnp-exam",
  title: "AGACNP Certification Exam",
  seoTitle: "AGACNP Certification Exam Prep: Practice Questions & Study Guide | NurseNest",
  seoDescription: "Complete Adult-Gerontology Acute Care NP (AGACNP) exam preparation with practice questions, study guides, and domain-specific analytics.",
  h1: "AGACNP Certification Exam: Complete Preparation Guide",
  region: "US",
  heroIntro: "The Adult-Gerontology Acute Care Nurse Practitioner (AGACNP) certification evaluates competency in managing complex, acutely ill adult patients. NurseNest provides comprehensive AGACNP-aligned preparation with critical care-focused practice questions and performance analytics.",
  overview: "The AGACNP certification exam assesses advanced practice competency in complex acute care, critical care management, diagnostic reasoning, and procedural skills for adult patients in acute care settings including ICU, emergency departments, and specialty units.",
  whoIsItFor: "The AGACNP certification is for nurse practitioners who have completed an accredited Adult-Gerontology Acute Care NP program with clinical hours in acute and critical care settings.",
  formatExplanation: "The AGACNP exam is offered by ANCC. It contains 175 questions (150 scored, 25 pretest), with 3.5 hours to complete. Questions emphasize complex clinical scenarios in acute care settings.",
  scoringInfo: "The ANCC AGACNP exam uses a 100-500 scale with a passing score of 350. Scores are criterion-referenced.",
  studyRoadmap: [
    { phase: "Critical Care Foundation", weeks: "Weeks 1-3", description: "Review advanced pathophysiology, hemodynamics, ventilator management, and critical care pharmacology." },
    { phase: "Clinical Scenarios", weeks: "Weeks 4-6", description: "Complete AGACNP practice questions focusing on complex acute presentations and multi-system management." },
    { phase: "Procedural & Diagnostic Focus", weeks: "Weeks 7-9", description: "Study diagnostic reasoning, procedural skills, and lab interpretation in acute care contexts." },
    { phase: "Exam Readiness", weeks: "Weeks 10-12", description: "Take timed mock exams. Focus on transitional care and complex decision-making scenarios." },
  ],
  examStrategy: [
    "Prioritize patient safety and hemodynamic stability in acute scenarios",
    "Know ventilator modes, settings, and troubleshooting",
    "Understand critical lab values and their clinical significance",
    "Review procedural knowledge: central lines, intubation, chest tubes",
    "Practice rapid clinical decision-making for deteriorating patients",
    "Focus on evidence-based guidelines for sepsis, stroke, and MI management",
  ],
  faqs: [
    { q: "What settings do AGACNPs practice in?", a: "AGACNPs practice in ICUs, emergency departments, specialty acute care units, surgical services, and hospitalist programs." },
    { q: "How does AGACNP differ from AGPCNP?", a: "AGACNP focuses on acute and critical care of adults in hospital settings, while AGPCNP focuses on primary care and chronic disease management in outpatient settings." },
    { q: "Is the AGACNP exam only offered by ANCC?", a: "Yes, the AGACNP-BC certification is offered exclusively by ANCC." },
  ],
  keywords: ["AGACNP exam prep", "AGACNP certification", "acute care NP exam", "AGACNP practice questions", "AGACNP study guide"],
};

export const PMHNP_PAGE_DATA: NpExamPageData = {
  examCode: "PMHNP",
  slug: "np/pmhnp-exam",
  title: "PMHNP Certification Exam",
  seoTitle: "PMHNP Certification Exam Prep: Practice Questions & Study Guide | NurseNest",
  seoDescription: "Complete Psychiatric-Mental Health NP (PMHNP) exam preparation with practice questions, psychopharmacology review, and domain-specific analytics.",
  h1: "PMHNP Certification Exam: Complete Preparation Guide",
  region: "US",
  heroIntro: "The Psychiatric-Mental Health Nurse Practitioner (PMHNP) certification is offered by ANCC. NurseNest provides PMHNP-aligned preparation tools including psychopharmacology-focused practice questions, therapy modality review, and crisis intervention scenarios.",
  overview: "The PMHNP certification exam evaluates competency in psychiatric assessment, psychopharmacology, therapy modalities, crisis intervention, and professional practice across the lifespan. The exam emphasizes clinical reasoning in psychiatric care.",
  whoIsItFor: "The PMHNP certification is for nurse practitioners who have completed an accredited Psychiatric-Mental Health NP program with clinical hours in psychiatric and mental health settings across the lifespan.",
  formatExplanation: "The PMHNP-BC exam is offered by ANCC with 175 questions (150 scored, 25 pretest), 3.5 hours to complete. Questions emphasize psychiatric clinical scenarios and psychopharmacology decision-making.",
  scoringInfo: "The ANCC PMHNP exam uses a 100-500 scale with a passing score of 350. Criterion-referenced scoring is used.",
  studyRoadmap: [
    { phase: "Psychiatric Foundations", weeks: "Weeks 1-3", description: "Review psychopathology, DSM-5 diagnostic criteria, and psychiatric assessment frameworks across the lifespan." },
    { phase: "Psychopharmacology", weeks: "Weeks 4-6", description: "Deep dive into psychotropic medications: mechanisms, side effects, interactions, and monitoring. This domain comprises 30% of the exam." },
    { phase: "Therapy & Crisis", weeks: "Weeks 7-9", description: "Study evidence-based therapy modalities, crisis intervention, suicide risk assessment, and substance use disorders." },
    { phase: "Exam Readiness", weeks: "Weeks 10-12", description: "Take PMHNP mock exams. Focus on complex psychiatric scenarios requiring integrated pharmacological and therapeutic reasoning." },
  ],
  examStrategy: [
    "Master psychopharmacology — it is the highest-weighted domain",
    "Know DSM-5 diagnostic criteria for major psychiatric disorders",
    "Understand suicide and violence risk assessment frameworks",
    "Review therapy modalities: CBT, DBT, motivational interviewing",
    "Practice lifespan psychiatric care — pediatric, adult, and geriatric presentations",
    "Know controlled substance prescribing regulations and monitoring requirements",
  ],
  faqs: [
    { q: "What is the most important domain for the PMHNP exam?", a: "Psychiatric Assessment and Psychopharmacology are the two highest-weighted domains, together comprising approximately 60% of the exam." },
    { q: "Does the PMHNP exam cover therapy modalities?", a: "Yes. The exam includes questions on evidence-based therapy modalities such as CBT, DBT, and motivational interviewing, though pharmacology is more heavily weighted." },
    { q: "Is the PMHNP certification lifespan or adult-only?", a: "The PMHNP-BC certification is a lifespan certification, covering psychiatric care from childhood through older adulthood." },
  ],
  keywords: ["PMHNP exam prep", "PMHNP certification", "psychiatric NP exam", "PMHNP practice questions", "PMHNP psychopharmacology", "PMHNP study guide"],
};

export const PNP_PAGE_DATA: NpExamPageData = {
  examCode: "PNP",
  slug: "np/pnp-exam",
  title: "PNP Certification Exam",
  seoTitle: "PNP Certification Exam Prep: Practice Questions & Study Guide | NurseNest",
  seoDescription: "Complete Pediatric NP (PNP) exam preparation with practice questions, developmental milestones review, and domain-specific analytics.",
  h1: "PNP Certification Exam: Complete Preparation Guide",
  region: "US",
  heroIntro: "The Pediatric Nurse Practitioner (PNP) certification evaluates competency in pediatric primary care. NurseNest provides PNP-aligned preparation tools including pediatric-focused practice questions, developmental assessment review, and performance analytics.",
  overview: "The PNP certification exam assesses advanced practice competency in pediatric assessment, growth and development, pediatric disease management, pediatric pharmacology, and family-centered care from birth through young adulthood.",
  whoIsItFor: "The PNP certification is for nurse practitioners who have completed an accredited Pediatric NP program with clinical hours focused on pediatric populations from birth through young adulthood.",
  formatExplanation: "The PNP-BC exam is offered by ANCC and PNCB. PNCB: 200 questions, 4 hours. ANCC: 175 questions, 3.5 hours. Both use multiple-choice format.",
  scoringInfo: "PNCB uses a pass/fail result with scaled scoring. ANCC uses a 100-500 scale with 350 passing score.",
  studyRoadmap: [
    { phase: "Pediatric Foundations", weeks: "Weeks 1-3", description: "Review developmental milestones, growth assessment, immunization schedules, and well-child visit guidelines." },
    { phase: "Disease Management", weeks: "Weeks 4-6", description: "Complete PNP practice questions covering common childhood illnesses, acute and chronic pediatric conditions." },
    { phase: "Pharmacology & Family Care", weeks: "Weeks 7-9", description: "Focus on weight-based dosing, pediatric-specific medications, and family-centered care approaches." },
    { phase: "Exam Readiness", weeks: "Weeks 10-12", description: "Take PNP mock exams. Review developmental screening tools and anticipatory guidance." },
  ],
  examStrategy: [
    "Know developmental milestones by age — this is heavily tested",
    "Master immunization schedules and catch-up schedules",
    "Understand weight-based medication dosing calculations",
    "Review common pediatric emergencies and red flag symptoms",
    "Practice family-centered communication and anticipatory guidance",
    "Know age-appropriate screening and preventive care guidelines",
  ],
  faqs: [
    { q: "What age range does the PNP cover?", a: "The PNP-PC (Primary Care) covers birth through young adulthood (typically 21 years)." },
    { q: "What is the difference between PNP-PC and PNP-AC?", a: "PNP-PC focuses on primary care pediatrics. PNP-AC focuses on acute care pediatric settings such as PICU and pediatric emergency." },
    { q: "Which certifying bodies offer PNP certification?", a: "Both ANCC (PNP-BC) and PNCB (CPNP-PC/CPNP-AC) offer pediatric NP certification." },
  ],
  keywords: ["PNP exam prep", "PNP certification", "pediatric NP exam", "PNP practice questions", "PNP study guide", "CPNP exam"],
};

export const WHNP_PAGE_DATA: NpExamPageData = {
  examCode: "WHNP",
  slug: "np/whnp-exam",
  title: "WHNP Certification Exam",
  seoTitle: "WHNP Certification Exam Prep: Practice Questions & Study Guide | NurseNest",
  seoDescription: "Complete Women's Health NP (WHNP) exam preparation with practice questions, obstetric and gynecologic review, and domain-specific analytics.",
  h1: "WHNP Certification Exam: Complete Preparation Guide",
  region: "US",
  heroIntro: "The Women's Health Nurse Practitioner (WHNP) certification evaluates competency in gynecologic health, obstetric care, and primary care of women. NurseNest provides WHNP-aligned preparation tools including specialty-focused practice questions and performance analytics.",
  overview: "The WHNP certification exam covers gynecologic health, obstetric care, contraception management, menopause, reproductive health, and primary care of women across the lifespan. It emphasizes clinical reasoning specific to women's health.",
  whoIsItFor: "The WHNP certification is for nurse practitioners who have completed an accredited Women's Health NP program with clinical hours in obstetric, gynecologic, and women's primary care settings.",
  formatExplanation: "The WHNP-BC exam is offered by NCC. It contains approximately 175 questions with 3 hours to complete. Questions emphasize clinical scenarios in women's health settings.",
  scoringInfo: "NCC uses a scaled scoring system. The passing standard is determined by criterion-referenced methods.",
  studyRoadmap: [
    { phase: "Gynecologic Foundation", weeks: "Weeks 1-3", description: "Review gynecologic health, cervical screening guidelines, STI management, and common gynecologic conditions." },
    { phase: "Obstetric Care", weeks: "Weeks 4-6", description: "Study prenatal care, labor and delivery complications, postpartum management, and high-risk pregnancy scenarios." },
    { phase: "Reproductive & Primary Care", weeks: "Weeks 7-9", description: "Focus on contraception counseling, menopause management, infertility workup, and primary care of women." },
    { phase: "Exam Readiness", weeks: "Weeks 10-12", description: "Take WHNP mock exams. Review high-yield obstetric and gynecologic clinical scenarios." },
  ],
  examStrategy: [
    "Master prenatal care guidelines and screening timelines",
    "Know contraception options, contraindications, and counseling",
    "Understand cervical cancer screening guidelines and HPV management",
    "Review menopause management including HRT indications and contraindications",
    "Practice clinical reasoning for obstetric emergencies",
    "Know STI screening, diagnosis, and treatment guidelines",
  ],
  faqs: [
    { q: "What does the WHNP certification cover?", a: "The WHNP covers gynecologic health, obstetric care, contraception, menopause, reproductive health, and primary care of women across the lifespan." },
    { q: "Which organization certifies WHNPs?", a: "The National Certification Corporation (NCC) offers the WHNP-BC certification." },
    { q: "Can WHNPs provide primary care?", a: "Yes. WHNPs are trained to provide primary care to women, including health promotion, disease prevention, and management of common health conditions." },
  ],
  keywords: ["WHNP exam prep", "WHNP certification", "women's health NP exam", "WHNP practice questions", "WHNP study guide"],
};

export const ENP_PAGE_DATA: NpExamPageData = {
  examCode: "ENP",
  slug: "np/enp-exam",
  title: "ENP Certification Exam",
  seoTitle: "ENP Certification Exam Prep: Practice Questions & Study Guide | NurseNest",
  seoDescription: "Complete Emergency NP (ENP) exam preparation with practice questions, trauma and triage review, and domain-specific analytics.",
  h1: "ENP Certification Exam: Complete Preparation Guide",
  region: "US",
  heroIntro: "The Emergency Nurse Practitioner (ENP) certification evaluates competency in emergency assessment, triage, acute care management, and trauma. NurseNest provides ENP-aligned preparation tools including emergency-focused practice questions and performance analytics.",
  overview: "The ENP certification exam assesses competency in emergency assessment and triage, acute care management, trauma and resuscitation, procedural skills, and professional practice in emergency care settings.",
  whoIsItFor: "The ENP certification is for nurse practitioners who have completed an ENP-focused NP program or have significant clinical experience in emergency care settings. Certification is offered by AANP.",
  formatExplanation: "The ENP-C exam is offered by AANP with 150 questions (135 scored, 15 pretest), 4 hours to complete. Questions emphasize emergency clinical scenarios and rapid decision-making.",
  scoringInfo: "The AANP ENP exam uses a 200-800 scale with 500 passing. Scaled scoring ensures consistency across exam forms.",
  studyRoadmap: [
    { phase: "Emergency Foundations", weeks: "Weeks 1-3", description: "Review triage systems, emergency assessment frameworks, and acute presentation management." },
    { phase: "Trauma & Resuscitation", weeks: "Weeks 4-6", description: "Study trauma assessment, resuscitation protocols, airway management, and emergency procedures." },
    { phase: "Acute Care Management", weeks: "Weeks 7-9", description: "Focus on chest pain, stroke, sepsis, toxicology, and other common emergency presentations." },
    { phase: "Exam Readiness", weeks: "Weeks 10-12", description: "Take ENP mock exams. Practice rapid clinical decision-making under time pressure." },
  ],
  examStrategy: [
    "Prioritize life threats — ABCs always come first",
    "Know triage systems and severity classification",
    "Master common emergency presentations: chest pain, stroke, sepsis",
    "Review procedural skills: suturing, splinting, wound management",
    "Understand toxicology management for common poisonings and overdoses",
    "Practice rapid clinical decision-making with time constraints",
  ],
  faqs: [
    { q: "What is the ENP certification?", a: "The ENP-C (Emergency Nurse Practitioner - Certified) is offered by AANP for NPs specializing in emergency care." },
    { q: "What settings do ENPs practice in?", a: "ENPs practice in emergency departments, urgent care centers, and freestanding emergency centers." },
    { q: "Is the ENP certification different from FNP working in the ED?", a: "Yes. The ENP certification specifically validates emergency care competency, while FNP is a generalist certification. Some states require ENP certification for independent emergency practice." },
  ],
  keywords: ["ENP exam prep", "ENP certification", "emergency NP exam", "ENP practice questions", "ENP study guide", "ENP-C exam"],
};

export const NP_EXAM_HUB_CARDS = [
  {
    examCode: "AANP" as NpExamCode,
    title: "AANP Certification",
    subtitle: "American Academy of Nurse Practitioners",
    description: "150 questions, 4-hour exam, 500/800 passing score. Clinical management-focused certification for FNP, AGPCNP, and ENP specialties.",
    region: "US" as const,
    href: "/np/aanp-exam",
    badge: "US Certification",
    color: "blue",
  },
  {
    examCode: "ANCC" as NpExamCode,
    title: "ANCC Certification",
    subtitle: "American Nurses Credentialing Center",
    description: "175 questions, 3.5-hour exam, 350/500 passing score. Includes professional role, research, and clinical management for FNP-BC, PMHNP-BC, and more.",
    region: "US" as const,
    href: "/np/ancc-exam",
    badge: "US Certification",
    color: "indigo",
  },
  {
    examCode: "AGPCNP" as NpExamCode,
    title: "AGPCNP Certification",
    subtitle: "Adult-Gerontology Primary Care NP",
    description: "Primary care certification for adult and geriatric populations. Covers chronic disease management, health promotion, and acute episodic care across the adult lifespan.",
    region: "US" as const,
    href: "/np/agpcnp-exam",
    badge: "US Certification",
    color: "teal",
  },
  {
    examCode: "AGACNP" as NpExamCode,
    title: "AGACNP Certification",
    subtitle: "Adult-Gerontology Acute Care NP",
    description: "Acute care certification for complex, critically ill adult patients. Covers ICU management, procedural skills, and diagnostic reasoning in hospital settings.",
    region: "US" as const,
    href: "/np/agacnp-exam",
    badge: "US Certification",
    color: "orange",
  },
  {
    examCode: "PMHNP" as NpExamCode,
    title: "PMHNP Certification",
    subtitle: "Psychiatric-Mental Health NP",
    description: "Psychiatric certification covering psychopharmacology, therapy modalities, crisis intervention, and lifespan psychiatric care.",
    region: "US" as const,
    href: "/np/pmhnp-exam",
    badge: "US Certification",
    color: "purple",
  },
  {
    examCode: "PNP" as NpExamCode,
    title: "PNP Certification",
    subtitle: "Pediatric Nurse Practitioner",
    description: "Pediatric primary care certification covering developmental milestones, growth assessment, immunizations, and family-centered care from birth through young adulthood.",
    region: "US" as const,
    href: "/np/pnp-exam",
    badge: "US Certification",
    color: "green",
  },
  {
    examCode: "WHNP" as NpExamCode,
    title: "WHNP Certification",
    subtitle: "Women's Health Nurse Practitioner",
    description: "Women's health certification covering gynecologic health, obstetric care, contraception, menopause, and primary care of women across the lifespan.",
    region: "US" as const,
    href: "/np/whnp-exam",
    badge: "US Certification",
    color: "pink",
  },
  {
    examCode: "ENP" as NpExamCode,
    title: "ENP Certification",
    subtitle: "Emergency Nurse Practitioner",
    description: "Emergency care certification covering triage, trauma, resuscitation, acute management, and procedural skills in emergency settings.",
    region: "US" as const,
    href: "/np/enp-exam",
    badge: "US Certification",
    color: "red",
  },
  {
    examCode: "CNPLE" as NpExamCode,
    title: "Canadian NP Exam (CNPLE)",
    subtitle: "Canadian Nurse Practitioner Licensing Examination",
    description: "180 questions, 5-hour exam, criterion-referenced passing standard. National licensing exam for all Canadian NP candidates with bilingual (English/French) administration.",
    region: "CA" as const,
    href: "/canada-np",
    badge: "Canadian Licensing",
    color: "red",
  },
  {
    examCode: "UPCOMING_CANADA_NP" as NpExamCode,
    title: "Upcoming Canadian NP Exam",
    subtitle: "Future Canadian NP Examination Pathways",
    description: "Stay ahead of upcoming changes to the Canadian NP licensing exam. Learn about expected format changes, new competency domains, and preparation strategies.",
    region: "CA" as const,
    href: "/np/upcoming-canada-np-exam",
    badge: "Coming Soon",
    color: "amber",
  },
  {
    examCode: "PMHNP" as NpExamCode,
    title: "PMHNP Certification",
    subtitle: "Psychiatric-Mental Health Nurse Practitioner",
    description: "Board certification for psychiatric-mental health NPs. Covers psychopharmacology, psychiatric assessment, therapy modalities, and crisis intervention across the lifespan.",
    region: "US" as const,
    href: "/np",
    badge: "Coming Soon",
    color: "violet",
  },
  {
    examCode: "AGPCNP" as NpExamCode,
    title: "AGPCNP Certification",
    subtitle: "Adult-Gerontology Primary Care NP",
    description: "Primary care certification for adult-gerontology NPs. Focuses on chronic disease management, health promotion, geriatric assessment, and primary care across the adult lifespan.",
    region: "US" as const,
    href: "/np",
    badge: "Coming Soon",
    color: "teal",
  },
  {
    examCode: "AGACNP" as NpExamCode,
    title: "AGACNP Certification",
    subtitle: "Adult-Gerontology Acute Care NP",
    description: "Acute care certification for adult-gerontology NPs. Covers complex acute care, critical care management, diagnostic reasoning, and procedural knowledge in hospital settings.",
    region: "US" as const,
    href: "/np",
    badge: "Coming Soon",
    color: "orange",
  },
  {
    examCode: "PNP" as NpExamCode,
    title: "PNP Certification",
    subtitle: "Pediatric Nurse Practitioner",
    description: "Board certification for pediatric NPs. Covers pediatric health assessment, developmental milestones, immunizations, pediatric disease management, and family-centered care.",
    region: "US" as const,
    href: "/np",
    badge: "Coming Soon",
    color: "green",
  },
  {
    examCode: "WHNP" as NpExamCode,
    title: "WHNP Certification",
    subtitle: "Women's Health Nurse Practitioner",
    description: "Board certification for women's health NPs. Covers reproductive health, prenatal and postpartum care, gynecology, menopause management, and women's primary care.",
    region: "US" as const,
    href: "/np",
    badge: "Coming Soon",
    color: "pink",
  },
  {
    examCode: "ENP" as NpExamCode,
    title: "ENP Certification",
    subtitle: "Emergency Nurse Practitioner",
    description: "Board certification for emergency NPs. Covers emergency assessment and triage, acute illness and injury management, trauma care, procedures, and emergency diagnostics.",
    region: "US" as const,
    href: "/np",
    badge: "Coming Soon",
    color: "red",
  },
];
