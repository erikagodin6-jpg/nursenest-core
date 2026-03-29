export interface LicensingExam {
  slug: string;
  name: string;
  shortName: string;
  fullName: string;
  countries: string[];
  region: string;
  examBody: string;
  whoIsItFor: string;
  examFormat: string;
  questionCount: string;
  timeLimit: string;
  passRate: string;
  cost: string;
  languages: string[];
  description: string;
  preparationStrategies: string[];
  sections: { heading: string; content: string }[];
  faqs: { question: string; answer: string }[];
  relatedExamSlugs: string[];
  nurseNestLinks: { label: string; href: string }[];
}

export const LICENSING_EXAMS: LicensingExam[] = [
  {
    slug: "nclex",
    name: "NCLEX",
    shortName: "NCLEX",
    fullName: "National Council Licensure Examination",
    countries: ["United States", "Canada"],
    region: "North America",
    examBody: "National Council of State Boards of Nursing (NCSBN)",
    whoIsItFor: "Graduates of approved nursing programs seeking RN or LPN/LVN licensure in the United States or Canada. The NCLEX-RN is for registered nurse candidates, and the NCLEX-PN is for practical/vocational nurse candidates.",
    examFormat: "Computer Adaptive Testing (CAT) with multiple-choice, select-all-that-apply, ordered response, fill-in-the-blank, hot spot, and Next Generation NCLEX (NGN) item types including case studies, bowtie items, and trend items.",
    questionCount: "85–150 questions (NCLEX-RN) or 85–150 questions (NCLEX-PN), including 15 pretest items",
    timeLimit: "5 hours maximum testing time",
    passRate: "~88% first-time pass rate (NCLEX-RN), ~86% (NCLEX-PN)",
    cost: "$200 USD registration fee plus Pearson VUE testing center fees",
    languages: ["English", "French (Canada only)"],
    description: "The NCLEX is the gold standard nursing licensure examination used across the United States and Canada. Developed by NCSBN, it uses Computer Adaptive Testing to precisely measure whether candidates demonstrate the competencies required for safe, effective entry-level nursing practice. Since April 2023, the exam includes Next Generation NCLEX (NGN) item types that assess clinical judgment through case studies, bowtie items, and trend analysis.",
    preparationStrategies: [
      "Complete 2,000–3,000 practice questions with detailed rationale review",
      "Focus on the Client Needs framework: Physiological Integrity (38–62%), Safe and Effective Care Environment (26–38%), Health Promotion (6–12%), and Psychosocial Integrity (6–12%)",
      "Master NGN clinical judgment question types using the CJMM model",
      "Practice with timed CAT-format mock exams to build test-day stamina",
      "Study pharmacology classifications, lab values, and priority-setting frameworks",
      "Use spaced repetition and active recall techniques for long-term retention",
    ],
    sections: [
      { heading: "Who Needs the NCLEX?", content: "All nursing graduates in the United States must pass the NCLEX to obtain RN or LPN/LVN licensure. In Canada, the NCLEX-RN is required for registered nurse licensure in most provinces. International nursing graduates seeking to practice in the US or Canada must also pass the NCLEX after meeting eligibility requirements through their state board or provincial regulatory body." },
      { heading: "Exam Structure", content: "The NCLEX uses Computer Adaptive Testing (CAT), meaning each question is selected based on your performance on previous questions. The exam ends when the algorithm determines with 95% confidence whether you are above or below the passing standard. The minimum number of questions is 85 and the maximum is 150. Since 2023, approximately 20–25% of scored items use NGN formats including unfolding case studies with 6 linked questions." },
      { heading: "Content Domains", content: "The NCLEX test plan organizes content into the Client Needs framework with 4 major categories and 8 subcategories. Physiological Integrity is the most heavily weighted at 38–62%, followed by Safe and Effective Care Environment at 26–38%. Management of Care (17–23%) and Pharmacological Therapies (13–19%) are the two largest individual subcategories. Understanding the percentage weighting helps candidates allocate study time effectively." },
      { heading: "Registration & Scheduling", content: "Candidates apply through their state board of nursing and register with Pearson VUE. After receiving Authorization to Test (ATT), candidates schedule their exam at a Pearson VUE testing center. The exam is available year-round at testing centers across the US and internationally. Results are typically available within 48 hours through the state board, with unofficial Quick Results available from Pearson VUE within 2 business days." },
    ],
    faqs: [
      { question: "How many questions are on the NCLEX?", answer: "The NCLEX has a minimum of 85 questions and a maximum of 150 questions. The exact number depends on when the CAT algorithm reaches a confident pass/fail decision. Of these, 15 are unscored pretest items." },
      { question: "What is the NCLEX passing score?", answer: "There is no fixed percentage passing score. The CAT algorithm determines whether your ability level is above or below the criterion-referenced passing standard. Results are reported as pass or fail only." },
      { question: "How long should I study for the NCLEX?", answer: "Most successful candidates study for 6–12 weeks after graduation, with full-time studiers typically needing 4–6 weeks. Aim for 2,000–3,000 practice questions with rationale review." },
      { question: "Can I take the NCLEX outside the United States?", answer: "Yes. The NCLEX is available at Pearson VUE testing centers in several countries including Canada, Australia, India, the Philippines, Mexico, England, and other locations." },
      { question: "What are NGN questions on the NCLEX?", answer: "Next Generation NCLEX (NGN) items include case studies, bowtie items, trend items, and enhanced multiple response formats. They assess clinical judgment using the Clinical Judgment Measurement Model and offer partial credit scoring." },
    ],
    relatedExamSlugs: ["rex-pn", "nmc-cbt", "ahpra"],
    nurseNestLinks: [
      { label: "NCLEX-RN Practice Questions", href: "/nclex-rn-practice-questions" },
      { label: "NCLEX-RN Study Hub", href: "/nclex-rn" },
      { label: "NCLEX-RN Guide", href: "/nclex-rn-guide" },
      { label: "Mock Exams", href: "/mock-exams" },
      { label: "Question Bank", href: "/question-bank" },
    ],
  },
  {
    slug: "rex-pn",
    name: "REx-PN",
    shortName: "REx-PN",
    fullName: "Regulatory Exam – Practical Nurse",
    countries: ["Canada"],
    region: "Canada",
    examBody: "National Council of State Boards of Nursing (NCSBN) in partnership with Canadian nursing regulatory bodies",
    whoIsItFor: "Graduates of approved practical nursing programs in Canada seeking registration as a Registered Practical Nurse (RPN) in Ontario or equivalent designation in other Canadian provinces.",
    examFormat: "Computer Adaptive Testing (CAT) with multiple-choice, select-all-that-apply, ordered-response, hot-spot, and fill-in-the-blank calculation questions.",
    questionCount: "85–150 questions, including 25 unscored pretest items",
    timeLimit: "5 hours maximum testing time",
    passRate: "Not publicly disclosed; criterion-referenced passing standard",
    cost: "Approximately $360 CAD (varies by province)",
    languages: ["English", "French"],
    description: "The REx-PN is the Canadian national licensing examination for practical nurse candidates. It replaced the CPNRE and uses Computer Adaptive Testing to assess whether candidates possess the entry-level competencies required for safe and effective practical nursing practice in the Canadian healthcare system. All questions are set within the Canadian context, using metric units, Canadian drug names, and Canadian clinical practice guidelines.",
    preparationStrategies: [
      "Follow a structured 10-week study plan covering all four Client Needs categories",
      "Focus on Physiological Integrity (38–44%) as the most heavily weighted domain",
      "Practice with Canadian-context questions using metric units and SI values",
      "Master medication administration, dosage calculations, and high-alert medications",
      "Study delegation principles and infection control within the RPN scope of practice",
      "Complete at least 1,500 practice questions with detailed rationale review",
    ],
    sections: [
      { heading: "Who Needs the REx-PN?", content: "All practical nursing graduates in Canada must pass the REx-PN to obtain registration as a Registered Practical Nurse (RPN) in Ontario or the equivalent designation in other provinces. The exam is required regardless of whether candidates graduated from a Canadian or internationally-educated program, provided they have met the regulatory body's eligibility requirements." },
      { heading: "Exam Structure", content: "The REx-PN uses Computer Adaptive Testing with a minimum of 85 questions and a maximum of 150 questions. Of these, 25 are unscored pretest items. The exam includes multiple-choice, select-all-that-apply, ordered-response, hot-spot, and calculation questions. All content is set within the Canadian healthcare context." },
      { heading: "Content Blueprint", content: "The exam covers four Client Needs categories: Safe and Effective Care Environment (26–32%), Health Promotion and Maintenance (6–12%), Psychosocial Integrity (6–12%), and Physiological Integrity (38–44%). Physiological Integrity includes pharmacological therapies, reduction of risk potential, and physiological adaptation, each weighted at 10–16%." },
      { heading: "Results & Retaking", content: "Results are typically available within 2–4 business days through the provincial nursing regulatory body. Candidates who do not pass receive a Candidate Performance Report showing performance in each content area. A mandatory 45-day waiting period is required between retake attempts." },
    ],
    faqs: [
      { question: "What replaced the CPNRE?", answer: "The REx-PN replaced the Canadian Practical Nurse Registration Examination (CPNRE) as the national entry-to-practice exam for practical nurses in Canada." },
      { question: "How is the REx-PN different from the NCLEX?", answer: "The REx-PN tests practical nursing competencies within the Canadian healthcare context, while the NCLEX-PN tests LPN/LVN competencies in the US context. The REx-PN uses Canadian drug names, metric units, and Canadian regulatory frameworks." },
      { question: "How many times can I retake the REx-PN?", answer: "A mandatory 45-day waiting period is required between attempts. Maximum attempt limits vary by province. Contact your regulatory body for specific retake policies." },
      { question: "Is the REx-PN available in French?", answer: "Yes. The REx-PN is available in both English and French at Pearson VUE testing centres across Canada." },
    ],
    relatedExamSlugs: ["nclex", "nmc-cbt"],
    nurseNestLinks: [
      { label: "REx-PN Practice Questions", href: "/rex-pn-practice-questions" },
      { label: "REx-PN Study Hub", href: "/rex-pn" },
      { label: "REx-PN Guide", href: "/rex-pn-guide" },
      { label: "Mock Exams", href: "/mock-exams" },
      { label: "Question Bank", href: "/question-bank" },
    ],
  },
  {
    slug: "nmc-cbt",
    name: "NMC CBT",
    shortName: "NMC CBT",
    fullName: "Nursing and Midwifery Council Computer-Based Test",
    countries: ["United Kingdom"],
    region: "United Kingdom",
    examBody: "Nursing and Midwifery Council (NMC)",
    whoIsItFor: "Internationally educated nurses and midwives seeking registration with the NMC to practice in the United Kingdom. UK-educated nurses register through a different pathway and do not take the CBT.",
    examFormat: "Computer-based test with multiple-choice and multiple-response questions. The test consists of two parts: Part 1 (CBT) tests nursing knowledge, and Part 2 (OSCE) tests clinical competency.",
    questionCount: "120 questions in Part 1 CBT (100 scored, 20 pilot items)",
    timeLimit: "4 hours for Part 1 CBT",
    passRate: "Varies by cohort; passing standard is criterion-referenced",
    cost: "£83 GBP for Part 1 CBT",
    languages: ["English"],
    description: "The NMC CBT is the knowledge-based component of the NMC Test of Competence for internationally educated nurses seeking registration in the United Kingdom. Part 1 (CBT) is a computer-based multiple-choice exam testing nursing knowledge across UK practice domains. Candidates who pass Part 1 proceed to Part 2, the Objective Structured Clinical Examination (OSCE), which tests clinical skills and competency in a simulated clinical environment.",
    preparationStrategies: [
      "Study the NMC Standards of Proficiency for Registered Nurses",
      "Focus on UK-specific clinical guidelines, drug names (BNF), and NHS policies",
      "Practice with UK nursing scenario questions covering all four domains",
      "Review UK medication dosage calculations using metric units",
      "Study safeguarding, Mental Health Act, and Duty of Candour requirements",
      "Prepare for OSCE Part 2 by practicing clinical skills with assessment checklists",
    ],
    sections: [
      { heading: "Who Needs the NMC CBT?", content: "Internationally educated nurses and midwives who want to register with the NMC and practice in the United Kingdom must pass the Test of Competence. This includes nurses from EU/EEA countries (post-Brexit), as well as nurses from all other countries. UK-educated nurses who graduated from NMC-approved programmes do not take this test." },
      { heading: "Test Structure", content: "The Test of Competence has two parts. Part 1 is the CBT, a computer-based exam with 120 questions (100 scored, 20 pilot) taken at a Pearson VUE test centre. Part 2 is the OSCE, a clinical skills examination conducted at an NMC-approved test centre with simulated patient scenarios. Both parts must be passed to achieve NMC registration." },
      { heading: "Content Domains", content: "The CBT covers four domains aligned with the NMC Standards of Proficiency: Professional Values and Practice, Communication and Interpersonal Skills, Nursing Practice and Decision Making, and Leadership, Management, and Team Working. Questions reflect UK healthcare practice, NHS policies, NICE guidelines, and BNF drug references." },
      { heading: "Registration Process", content: "After passing both parts of the Test of Competence, candidates apply for NMC registration. The process includes identity verification, qualification verification, English language evidence (IELTS or OET), and a health and character declaration. Processing time for NMC registration is typically 4–8 weeks after passing the OSCE." },
    ],
    faqs: [
      { question: "Do I need IELTS or OET for the NMC CBT?", answer: "Yes. International nurses must demonstrate English language proficiency through IELTS Academic (overall 7.0 with minimum 7.0 in each band) or OET (overall grade B with minimum B in each sub-test) as part of the NMC registration process." },
      { question: "Where can I take the NMC CBT?", answer: "The NMC CBT (Part 1) is available at Pearson VUE test centres worldwide. Part 2 (OSCE) must be taken at an NMC-approved test centre in the United Kingdom." },
      { question: "How long are NMC CBT results valid?", answer: "Part 1 CBT results are valid for 2 years. If you do not complete Part 2 OSCE within this period, you must retake Part 1." },
      { question: "What is the OSCE in the NMC Test of Competence?", answer: "The OSCE (Objective Structured Clinical Examination) is Part 2 of the Test of Competence. It consists of clinical skills stations where candidates demonstrate nursing competencies with simulated patients, including assessment, medication administration, and clinical decision-making." },
    ],
    relatedExamSlugs: ["nclex", "ielts-for-nurses", "oet-for-nurses"],
    nurseNestLinks: [
      { label: "NMC CBT Practice Questions", href: "/qbank-exam?exam=NMC-CBT" },
      { label: "NMC CBT Question Bank", href: "/question-bank?exam=NMC-CBT" },
      { label: "International Nurses Hub", href: "/international-nurses" },
      { label: "IELTS for Nurses", href: "/nursing-licensing-exams/ielts-for-nurses" },
      { label: "OET for Nurses", href: "/nursing-licensing-exams/oet-for-nurses" },
    ],
  },
  {
    slug: "ahpra",
    name: "AHPRA Nursing Exam",
    shortName: "AHPRA",
    fullName: "Australian Health Practitioner Regulation Agency Nursing Assessment",
    countries: ["Australia"],
    region: "Australia",
    examBody: "Nursing and Midwifery Board of Australia (NMBA) under AHPRA",
    whoIsItFor: "Internationally qualified nurses seeking registration with AHPRA to practice nursing in Australia. Australian-educated nurses who graduated from NMBA-approved programs are not required to sit the assessment.",
    examFormat: "The NMBA uses a multiple-choice computer-based assessment. Candidates may also need to complete a bridging program or period of supervised practice depending on their qualifications outcome assessment.",
    questionCount: "150 questions (standard assessment format)",
    timeLimit: "3.5 hours",
    passRate: "Not publicly disclosed",
    cost: "Approximately $500–$800 AUD depending on assessment pathway",
    languages: ["English"],
    description: "The AHPRA nursing assessment is part of the registration process for internationally qualified nurses seeking to practice in Australia. The Nursing and Midwifery Board of Australia (NMBA) assesses qualifications and may require candidates to complete a knowledge assessment, a bridging program, or supervised practice. The assessment tests competency against the NMBA Registered Nurse Standards for Practice.",
    preparationStrategies: [
      "Study the NMBA Registered Nurse Standards for Practice thoroughly",
      "Focus on Australian healthcare system policies and procedures",
      "Review Australian medication names and dosage calculations",
      "Practice clinical scenario questions aligned to Australian nursing practice",
      "Study infection control, patient safety, and documentation standards used in Australia",
      "Familiarize yourself with the Australian health system structure including Medicare and PBS",
    ],
    sections: [
      { heading: "Who Needs the AHPRA Assessment?", content: "Internationally qualified nurses (IQNs) seeking registration in Australia must have their qualifications assessed by the NMBA through AHPRA. Based on the outcomes assessment, candidates may need to complete a formal examination, a bridging program, or a period of supervised practice. The pathway depends on the country of education and the equivalency of qualifications." },
      { heading: "Assessment Pathways", content: "AHPRA offers multiple pathways for internationally qualified nurses. Outcome 1 means qualifications are substantially equivalent and registration is granted. Outcome 2 requires a bridging program. Outcome 3 requires a modified bridging program plus supervised practice. Outcome 4 requires a full assessment including a knowledge examination and supervised practice period." },
      { heading: "Content Coverage", content: "The knowledge assessment covers the NMBA Registered Nurse Standards for Practice including professional practice, provision and coordination of care, collaborative and therapeutic practice, and critical thinking and analysis. Questions reflect Australian healthcare context, drug names, and clinical guidelines." },
      { heading: "Registration Requirements", content: "In addition to passing the knowledge assessment, international nurses must provide evidence of English language proficiency (IELTS Academic or OET), criminal history checks, recency of practice evidence, and professional indemnity insurance. The full registration process typically takes 3–6 months." },
    ],
    faqs: [
      { question: "Do I need IELTS for AHPRA registration?", answer: "Yes. International nurses must demonstrate English proficiency through IELTS Academic (overall 7.0 with minimum 7.0 in each band) or OET (grade B in each sub-test). Some applicants may qualify for exemptions based on English-medium education." },
      { question: "How long does AHPRA registration take?", answer: "The assessment process typically takes 3–6 months from application to registration, depending on the pathway assigned. Complex cases or those requiring bridging programs may take longer." },
      { question: "Can I work while waiting for AHPRA registration?", answer: "You cannot practice as a registered nurse until your AHPRA registration is approved. Some candidates may be eligible for supervised practice arrangements during the assessment process." },
      { question: "What is the difference between AHPRA and NMBA?", answer: "AHPRA is the administrative agency that manages registration for all health practitioners in Australia. NMBA is the specific board that sets standards and assesses qualifications for nurses and midwives. They work together in the registration process." },
    ],
    relatedExamSlugs: ["nclex", "nmc-cbt", "ielts-for-nurses", "oet-for-nurses"],
    nurseNestLinks: [
      { label: "AHPRA RN Practice Questions", href: "/qbank-exam?exam=AHPRA-RN" },
      { label: "AHPRA RN Question Bank", href: "/question-bank?exam=AHPRA-RN" },
      { label: "International Nurses Hub", href: "/international-nurses" },
      { label: "IELTS for Nurses", href: "/nursing-licensing-exams/ielts-for-nurses" },
      { label: "OET for Nurses", href: "/nursing-licensing-exams/oet-for-nurses" },
    ],
  },
  {
    slug: "prometric",
    name: "Prometric Nursing Exams",
    shortName: "Prometric",
    fullName: "Prometric Professional Nursing Licensing Examinations",
    countries: ["Saudi Arabia", "UAE", "Qatar", "Kuwait", "Oman", "Bahrain"],
    region: "Middle East (Gulf States)",
    examBody: "Individual country health authorities (DHA, HAAD/DOH, MOH, SCFHS, QCHP) administered through Prometric",
    whoIsItFor: "Nurses seeking professional licensure to practice in Gulf Cooperation Council (GCC) countries. Each country has its own health authority examination, all administered through Prometric testing centres.",
    examFormat: "Computer-based multiple-choice examination. Format varies by country authority but typically includes single-best-answer and multiple-response questions.",
    questionCount: "100–200 questions depending on the specific country exam",
    timeLimit: "3–4 hours depending on the specific country exam",
    passRate: "Varies by country; typically 60–70% passing score required",
    cost: "$150–$400 USD depending on the country and specialty",
    languages: ["English", "Arabic (some countries)"],
    description: "Prometric nursing examinations are used by Gulf Cooperation Council (GCC) countries for professional nursing licensure. Each country's health authority — including DHA (Dubai), DOH (Abu Dhabi), Saudi MOH/SCFHS, QCHP (Qatar), and others — has developed its own examination administered through Prometric testing centres. These exams test nursing knowledge and competency relevant to healthcare practice in the Middle East region.",
    preparationStrategies: [
      "Identify which specific country exam you need (DHA, HAAD, MOH, SCFHS, QCHP)",
      "Study the exam-specific content outline provided by the health authority",
      "Focus on general nursing knowledge: medical-surgical, pharmacology, and patient safety",
      "Practice with multiple-choice questions covering core nursing competencies",
      "Review infection control, emergency procedures, and medication administration",
      "Study cultural competency and healthcare practices relevant to the Gulf region",
    ],
    sections: [
      { heading: "Country-Specific Exams", content: "Each GCC country has its own licensing exam: DHA exam for Dubai, DOH/HAAD exam for Abu Dhabi, Saudi MOH and SCFHS exams for Saudi Arabia, QCHP for Qatar, and MOH exams for Oman, Kuwait, and Bahrain. While all are administered through Prometric, content and difficulty vary by authority. Check with the specific country's health authority for exam details." },
      { heading: "Exam Content", content: "Prometric nursing exams generally cover medical-surgical nursing, pharmacology, pediatric nursing, obstetric nursing, psychiatric nursing, community health, and nursing management. The emphasis varies by country but all exams test core nursing competencies with a focus on patient safety and evidence-based practice." },
      { heading: "Eligibility & Application", content: "Eligibility requirements vary by country but generally include a nursing degree from an accredited institution, a valid nursing license from your home country, and relevant clinical experience (typically 2+ years). Some countries require dataflow verification of credentials. Apply through the specific country's health authority or licensing portal." },
      { heading: "After Passing", content: "After passing the Prometric exam, candidates apply for a professional license through the country's health authority. Additional requirements may include medical fitness certification, credential verification, and visa processing. The license is typically country-specific — passing the DHA exam does not automatically grant licensure in Saudi Arabia or other GCC countries." },
    ],
    faqs: [
      { question: "Which Prometric exam do I need?", answer: "It depends on which country you want to work in. DHA for Dubai, DOH for Abu Dhabi, SCFHS for Saudi Arabia, QCHP for Qatar. Each has its own exam and registration process." },
      { question: "Can I transfer my Prometric license between GCC countries?", answer: "Generally no. Each GCC country requires its own licensing exam and registration. However, some countries may offer expedited processing for nurses already licensed in another GCC country." },
      { question: "What is a dataflow report?", answer: "Dataflow is a primary source verification service used by GCC health authorities to verify the authenticity of nursing credentials, education, and work experience. Most GCC countries require a dataflow report as part of the licensing process." },
      { question: "How many times can I retake a Prometric exam?", answer: "Retake policies vary by country. Most allow retakes after a waiting period of 1–3 months. Check with the specific health authority for their retake policy and any limits on attempts." },
    ],
    relatedExamSlugs: ["nclex", "oet-for-nurses"],
    nurseNestLinks: [
      { label: "Gulf Nursing Practice Questions", href: "/qbank-exam?exam=GULF-NURSING" },
      { label: "Gulf Nursing Question Bank", href: "/question-bank?exam=GULF-NURSING" },
      { label: "International Nurses Hub", href: "/international-nurses" },
    ],
  },
  {
    slug: "ielts-for-nurses",
    name: "IELTS for Nurses",
    shortName: "IELTS",
    fullName: "International English Language Testing System for Nursing Registration",
    countries: ["United Kingdom", "Australia", "New Zealand", "Canada", "Ireland"],
    region: "Global",
    examBody: "British Council, IDP Education, and Cambridge Assessment English",
    whoIsItFor: "Internationally educated nurses who need to demonstrate English language proficiency as part of nursing registration requirements in English-speaking countries. Required by NMC (UK), AHPRA (Australia), NCNZ (New Zealand), and some Canadian provinces.",
    examFormat: "Four-component academic test: Listening (40 minutes), Reading (60 minutes), Writing (60 minutes), and Speaking (11–14 minutes face-to-face interview).",
    questionCount: "Listening: 40 questions, Reading: 40 questions, Writing: 2 tasks, Speaking: 3 parts",
    timeLimit: "2 hours 45 minutes total (plus 11–14 minutes speaking)",
    passRate: "N/A — candidates must achieve minimum band scores set by the regulatory body",
    cost: "£170–£210 GBP / $250–$300 AUD (varies by country and test centre)",
    languages: ["English"],
    description: "IELTS Academic is one of the most widely accepted English language proficiency tests for nursing registration globally. Nursing regulatory bodies in the UK, Australia, New Zealand, and other countries require internationally educated nurses to achieve specific IELTS band scores as evidence of English proficiency. The test assesses listening, reading, writing, and speaking skills in an academic context.",
    preparationStrategies: [
      "Understand the minimum band scores required by your target regulatory body (e.g., NMC requires 7.0 in each band)",
      "Practice academic reading with medical and healthcare journal articles",
      "Develop academic writing skills with structured essay and report formats",
      "Listen to English-language healthcare podcasts and lectures for listening practice",
      "Practice speaking about clinical scenarios, patient care, and professional nursing topics",
      "Take full-length practice tests under timed conditions to build test stamina",
    ],
    sections: [
      { heading: "Score Requirements by Country", content: "NMC (UK): Overall 7.0 with minimum 7.0 in each band. AHPRA (Australia): Overall 7.0 with minimum 7.0 in each band. NCNZ (New Zealand): Overall 7.0 with minimum 7.0 in each band. Some Canadian provinces accept IELTS Academic with varying minimums. Always check current requirements with your specific regulatory body as these may change." },
      { heading: "IELTS Academic vs. General Training", content: "Nursing regulatory bodies require IELTS Academic, not General Training. The Academic version includes more complex reading passages from academic sources and requires a more formal writing style. Make sure you register for the correct version." },
      { heading: "Test Components", content: "Listening (30 minutes + 10 transfer time): Four recorded sections with increasing difficulty. Reading (60 minutes): Three long passages with various question types. Writing (60 minutes): Task 1 is a 150-word report describing visual data; Task 2 is a 250-word essay. Speaking (11–14 minutes): Face-to-face interview in three parts covering personal topics, a cue card topic, and abstract discussion." },
      { heading: "Tips for Nursing Professionals", content: "Practice reading healthcare research articles and clinical guidelines in English. Develop vocabulary for describing clinical procedures, patient conditions, and nursing interventions. For the writing test, practice describing graphs, charts, and clinical data. For speaking, prepare to discuss healthcare topics, ethical dilemmas, and your nursing experience fluently." },
    ],
    faqs: [
      { question: "What IELTS score do I need for nursing in the UK?", answer: "The NMC requires an overall band score of 7.0 with a minimum of 7.0 in each of the four components (Listening, Reading, Writing, Speaking) on the IELTS Academic test." },
      { question: "Can I combine IELTS scores from multiple sittings?", answer: "Some regulatory bodies accept combined scores from two sittings taken within 6 months, provided you achieve at least 6.5 in each component in both sittings. Check your specific regulatory body's policy." },
      { question: "IELTS or OET — which is better for nurses?", answer: "OET is healthcare-specific and may feel more relevant to nursing professionals. IELTS is more widely accepted across different contexts. Both are accepted by NMC (UK) and AHPRA (Australia). Choose based on your strengths and preparation preferences." },
      { question: "How long are IELTS results valid?", answer: "IELTS results are valid for 2 years from the test date. After this period, you must retake the test to provide current evidence of English proficiency." },
    ],
    relatedExamSlugs: ["oet-for-nurses", "nmc-cbt", "ahpra"],
    nurseNestLinks: [
      { label: "International Nurses Hub", href: "/international-nurses" },
      { label: "NMC CBT Guide", href: "/nursing-licensing-exams/nmc-cbt" },
      { label: "AHPRA Guide", href: "/nursing-licensing-exams/ahpra" },
    ],
  },
  {
    slug: "oet-for-nurses",
    name: "OET for Nurses",
    shortName: "OET",
    fullName: "Occupational English Test for Nursing",
    countries: ["United Kingdom", "Australia", "New Zealand", "Ireland", "Singapore", "Dubai"],
    region: "Global",
    examBody: "Cambridge Boxhill Language Assessment (CBLA)",
    whoIsItFor: "Healthcare professionals, including nurses, who need to demonstrate English language proficiency for registration or employment in English-speaking countries. OET is healthcare-specific, making it particularly relevant for nursing professionals.",
    examFormat: "Four sub-tests: Listening (45 minutes, shared across all professions), Reading (60 minutes, shared), Writing (45 minutes, nursing-specific), and Speaking (20 minutes, nursing-specific role-play).",
    questionCount: "Listening: 42 questions, Reading: 42 questions, Writing: 1 nursing-specific letter, Speaking: 2 role-plays",
    timeLimit: "Approximately 3 hours total",
    passRate: "N/A — candidates must achieve minimum grade requirements set by the regulatory body",
    cost: "$587 AUD / £342 GBP (varies by location)",
    languages: ["English"],
    description: "OET (Occupational English Test) is a healthcare-specific English language proficiency test accepted by nursing regulatory bodies in the UK, Australia, New Zealand, Ireland, and other countries. Unlike IELTS, OET uses healthcare scenarios and clinical communication tasks, making it directly relevant to nursing practice. The writing and speaking sub-tests are nursing-specific, testing the ability to write referral letters and communicate with patients and colleagues.",
    preparationStrategies: [
      "Focus on healthcare-specific vocabulary and clinical communication skills",
      "Practice writing nursing referral letters, discharge summaries, and clinical correspondence",
      "Prepare for speaking role-plays based on common nursing clinical scenarios",
      "Listen to medical lectures and clinical discussions for listening preparation",
      "Read healthcare articles, clinical guidelines, and case studies for reading practice",
      "Take OET practice tests to familiarize yourself with the specific format and timing",
    ],
    sections: [
      { heading: "Score Requirements", content: "NMC (UK): Overall grade B with minimum B in each sub-test. AHPRA (Australia): Overall grade B with minimum B in each sub-test. Different regulatory bodies may have different minimum requirements. Grade B is equivalent to IELTS 7.0. Grade C+ is equivalent to IELTS 6.5. Always verify current requirements with your specific regulatory body." },
      { heading: "Nursing-Specific Components", content: "The OET Writing sub-test for nursing requires candidates to write a referral or discharge letter based on case notes. The Speaking sub-test consists of two role-plays based on typical nursing scenarios — for example, explaining a treatment plan to a patient, discussing medication side effects, or providing discharge instructions. These tasks directly reflect the communication skills needed in nursing practice." },
      { heading: "OET vs. IELTS for Nurses", content: "OET is designed specifically for healthcare professionals, making the content more familiar and relevant to nurses. The writing and speaking tasks simulate real clinical communication. IELTS tests general academic English with no healthcare focus. Many nurses find OET more comfortable because the context is familiar, though both are equally accepted by most regulatory bodies." },
      { heading: "Preparation Resources", content: "Official OET preparation materials include sample tests, preparation guides, and online courses. NurseNest provides nursing-focused English practice resources that complement OET preparation. Focus on clinical communication skills, medical terminology, and healthcare writing conventions." },
    ],
    faqs: [
      { question: "Is OET easier than IELTS for nurses?", answer: "Many nurses find OET more comfortable because the content is healthcare-specific. However, the required grade (B) is equivalent to IELTS 7.0, so the standard is similar. Choose based on your preparation preferences and comfort level." },
      { question: "What OET score do I need for UK nursing registration?", answer: "The NMC requires a minimum grade of B in each of the four sub-tests (Listening, Reading, Writing, Speaking). This is equivalent to IELTS 7.0 in each band." },
      { question: "Can I take OET online?", answer: "Yes. OET offers both centre-based and OET@Home options. The OET@Home version is identical in content and scoring to the centre-based test and is accepted by the same regulatory bodies." },
      { question: "How often can I retake OET?", answer: "You can retake OET as many times as needed. There is no maximum number of attempts. Results from two sittings within 6 months can sometimes be combined if accepted by your regulatory body." },
    ],
    relatedExamSlugs: ["ielts-for-nurses", "nmc-cbt", "ahpra"],
    nurseNestLinks: [
      { label: "International Nurses Hub", href: "/international-nurses" },
      { label: "NMC CBT Guide", href: "/nursing-licensing-exams/nmc-cbt" },
      { label: "AHPRA Guide", href: "/nursing-licensing-exams/ahpra" },
    ],
  },
];

export function getExamBySlug(slug: string): LicensingExam | undefined {
  return LICENSING_EXAMS.find(e => e.slug === slug);
}

export function getAllExamSlugs(): string[] {
  return LICENSING_EXAMS.map(e => e.slug);
}
