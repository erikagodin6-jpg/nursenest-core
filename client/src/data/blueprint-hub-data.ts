export interface BlueprintFaqItem {
  question: string;
  answer: string;
}

export interface BlueprintStudyStrategy {
  title: string;
  description: string;
}

export interface BlueprintCategoryConfig {
  slug: string;
  name: string;
  parentExamSlug: string;
  weight: string;
  description: string;
  topicsList: string[];
  guideLinks: { label: string; href: string }[];
  flashcardLinks: { label: string; href: string }[];
  previewQuestionLinks: { label: string; href: string }[];
  lessonLinks: { label: string; href: string }[];
  faqItems: BlueprintFaqItem[];
  keywords: string[];
}

export interface BlueprintHubConfig {
  slug: string;
  examName: string;
  examCode: string;
  region: "US" | "CA" | "both";
  tier: "rpn" | "rn" | "np" | "allied";
  h1Title: string;
  introText: string;
  questionCount: string;
  timeLimit: string;
  adaptiveOrFixed: "adaptive" | "fixed" | "linear-scaled";
  passInfo: string;
  questionTypes: string[];
  categories: { name: string; slug: string; weight: string; description: string }[];
  studyStrategies: BlueprintStudyStrategy[];
  faqItems: BlueprintFaqItem[];
  keywords: string[];
}

export const BLUEPRINT_HUBS: BlueprintHubConfig[] = [
  {
    slug: "rexpn-exam-blueprint",
    examName: "REx-PN",
    examCode: "REX-PN",
    region: "CA",
    tier: "rpn",
    h1Title: "REx-PN Exam Blueprint: Complete Test Plan & Category Breakdown",
    introText: "The Regulatory Exam – Practical Nurse (REx-PN) is organized around competency domains defined by the NCSBN for Canadian Registered Practical Nurses. Understanding the REx-PN blueprint is essential for focused exam preparation. This page breaks down every exam category, its percentage weighting, and the key topics tested within each domain so you can build a targeted study plan.",
    questionCount: "60–90 questions (adaptive)",
    timeLimit: "3 hours maximum",
    adaptiveOrFixed: "adaptive",
    passInfo: "Pass/fail based on competency standard",
    questionTypes: ["Multiple Choice (MCQ)", "Select All That Apply", "Ordered Response", "Clinical Scenario-Based Items"],
    categories: [
      { name: "Foundations of Practice", slug: "rexpn-foundations-of-practice", weight: "36%", description: "Clinical knowledge and skills essential for safe entry-level practical nursing, including anatomy and physiology, pathophysiology, pharmacology, and clinical procedures." },
      { name: "Collaborative Practice", slug: "rexpn-collaborative-practice", weight: "30%", description: "Working within the interprofessional team, delegation, communication, and contributing to care planning under the RPN scope." },
      { name: "Professional Practice", slug: "rexpn-professional-practice", weight: "16%", description: "Standards of practice, regulatory frameworks, continuing competence, reflective practice, and professional accountability." },
      { name: "Ethical Practice", slug: "rexpn-ethical-practice", weight: "10%", description: "Ethical decision-making, client advocacy, informed consent, confidentiality, and applying the nursing code of ethics." },
      { name: "Legal Practice", slug: "rexpn-legal-practice", weight: "8%", description: "Legal obligations, documentation standards, scope of practice boundaries, mandatory reporting, and regulated acts." },
      { name: "Safety and Infection Control", slug: "rexpn-safety-and-infection-control", weight: "10–16%", description: "Routine practices, additional precautions, fall prevention, restraint use, safe medication administration, and workplace safety." },
      { name: "Health Promotion and Maintenance", slug: "rexpn-health-promotion", weight: "6–12%", description: "Growth and development, health screening, immunizations, prenatal and postpartum care, aging-related changes, and client education." },
      { name: "Pharmacological Therapies", slug: "rexpn-pharmacological-therapies", weight: "10–16%", description: "Drug classifications, dosage calculations in metric units, medication administration, adverse effects, drug interactions, and Health Canada-approved medications." },
    ],
    studyStrategies: [
      { title: "Study by Domain Weight", description: "Allocate the most study time to Foundations of Practice (36%) and Collaborative Practice (30%), as they make up the majority of the exam." },
      { title: "Use Canadian Context", description: "Study with Canadian-specific content including metric units, Health Canada drug names, and Canadian scope of practice standards." },
      { title: "Practice with Adaptive Questions", description: "Simulate the CAT format with practice exams that adjust difficulty based on your performance." },
      { title: "Master Delegation Principles", description: "Understand what tasks RPNs can delegate to unregulated care providers and when to escalate to RNs." },
    ],
    faqItems: [
      { question: "What is the REx-PN exam blueprint?", answer: "The REx-PN exam blueprint is the official test plan that defines the competency domains and their percentage weighting on the exam. It is developed by the NCSBN based on a practice analysis of entry-level practical nurses in Canada." },
      { question: "How many categories are on the REx-PN?", answer: "The REx-PN is organized around five core competency domains: Foundations of Practice (36%), Collaborative Practice (30%), Professional Practice (16%), Ethical Practice (10%), and Legal Practice (8%), plus additional content areas." },
      { question: "How often does the REx-PN blueprint change?", answer: "The NCSBN reviews and updates the exam blueprint periodically based on practice analysis surveys of working practical nurses. Changes reflect evolving entry-level practice requirements." },
      { question: "Should I study all categories equally?", answer: "No. Focus your study time proportionally to each domain's weight. Foundations of Practice and Collaborative Practice together account for 66% of the exam and should receive the most attention." },
      { question: "Where can I find the official REx-PN test plan?", answer: "The official REx-PN test plan is published by the NCSBN. NurseNest aligns all practice questions and study materials to the current test plan framework." },
    ],
    keywords: ["REx-PN exam blueprint", "REx-PN test plan", "REx-PN categories", "REx-PN competency domains", "REx-PN exam structure", "Canadian RPN exam blueprint"],
  },
  {
    slug: "nclex-rn-exam-blueprint",
    examName: "NCLEX-RN",
    examCode: "NCLEX-RN",
    region: "both",
    tier: "rn",
    h1Title: "NCLEX-RN Exam Blueprint: Client Needs Categories & Test Plan Guide",
    introText: "The NCLEX-RN test plan is organized around the Client Needs framework, consisting of four major categories and eight subcategories. Understanding the NCLEX-RN blueprint and the percentage weighting of each category is critical for building an effective study plan. This page provides a complete breakdown of every exam domain, question distribution, and study strategies aligned to the current NCSBN test plan.",
    questionCount: "60–85 questions (adaptive)",
    timeLimit: "5 hours maximum",
    adaptiveOrFixed: "adaptive",
    passInfo: "Approximately 88% first-time pass rate",
    questionTypes: ["Multiple Choice (MCQ)", "Select All That Apply (SATA)", "Ordered Response / Drag-and-Drop", "Hot Spot", "Fill-in-the-Blank Calculation", "Bowtie Items (NGN)", "Case Study Clusters (NGN)"],
    categories: [
      { name: "Management of Care", slug: "nclex-management-of-care", weight: "17–23%", description: "Advance directives, advocacy, assignment/delegation/supervision, case management, informed consent, ethical and legal practice, and collaboration with the interprofessional team." },
      { name: "Safety and Infection Control", slug: "nclex-safety-and-infection-control", weight: "9–15%", description: "Accident and injury prevention, emergency response, ergonomic principles, handling hazardous materials, standard precautions, surgical asepsis, and use of restraints." },
      { name: "Health Promotion and Maintenance", slug: "nclex-health-promotion", weight: "6–12%", description: "Ante/intra/postpartum and newborn care, developmental stages, health screening, high-risk behaviors, lifestyle choices, self-care, and physical assessment techniques." },
      { name: "Psychosocial Integrity", slug: "nclex-psychosocial-integrity", weight: "6–12%", description: "Abuse/neglect, behavioral interventions, chemical dependency, coping mechanisms, crisis intervention, cultural awareness, end-of-life care, and therapeutic communication." },
      { name: "Basic Care and Comfort", slug: "nclex-basic-care-and-comfort", weight: "6–12%", description: "Assistive devices, elimination, mobility/immobility, non-pharmacological comfort interventions, nutrition, personal hygiene, rest and sleep." },
      { name: "Pharmacological Therapies", slug: "nclex-pharmacology", weight: "13–19%", description: "Adverse effects/interactions, blood products, central venous access, dosage calculation, expected outcomes, IV therapies, medication administration, and total parenteral nutrition." },
      { name: "Reduction of Risk Potential", slug: "nclex-reduction-of-risk", weight: "9–15%", description: "Changes in body systems, diagnostic tests, lab values, potential complications, system-specific assessments, therapeutic procedures, and vital signs interpretation." },
      { name: "Physiological Adaptation", slug: "nclex-physiological-adaptation", weight: "11–17%", description: "Alterations in body systems, fluid/electrolyte imbalances, hemodynamics, illness management, medical emergencies, pathophysiology, and unexpected response to therapies." },
    ],
    studyStrategies: [
      { title: "Follow the 60/30/10 Rule", description: "Spend 60% of study time on practice questions with rationale review, 30% on content review focusing on weak areas, and 10% on test-taking strategies." },
      { title: "Prioritize High-Weight Domains", description: "Physiological Integrity (38–62%) and Management of Care (17–23%) together account for over 60% of the exam. These categories deserve the most preparation time." },
      { title: "Master NGN Question Types", description: "Practice with Next Generation NCLEX formats including bowtie items, case study clusters, and trend items using the Clinical Judgment Measurement Model." },
      { title: "Complete 2,000+ Practice Questions", description: "Aim for 2,000–3,000 practice questions total during your study period. Always review rationales for both correct and incorrect answers." },
    ],
    faqItems: [
      { question: "What is the NCLEX-RN test plan?", answer: "The NCLEX-RN test plan is the official blueprint published by the NCSBN that defines the Client Needs categories and percentage weighting for the exam. It is updated every three years based on practice analysis." },
      { question: "How many Client Needs categories are on the NCLEX-RN?", answer: "The NCLEX-RN has four major Client Needs categories subdivided into eight subcategories: Safe and Effective Care Environment (Management of Care, Safety and Infection Control), Health Promotion and Maintenance, Psychosocial Integrity, and Physiological Integrity (Basic Care and Comfort, Pharmacological Therapies, Reduction of Risk Potential, Physiological Adaptation)." },
      { question: "Which NCLEX-RN category is tested the most?", answer: "Physiological Integrity is the largest category at 38–62% of the exam. Within it, Pharmacological Therapies (13–19%) is the most heavily weighted subcategory." },
      { question: "Does the NCLEX-RN blueprint include NGN question types?", answer: "Yes. Since April 2023, the NCLEX-RN includes Next Generation NCLEX items such as case study clusters and bowtie items. These questions are distributed across all Client Needs categories." },
      { question: "How should I use the blueprint to study?", answer: "Allocate study time proportionally to each category's percentage weight. Focus on Physiological Integrity and Management of Care first, then address weaker areas identified through practice exams." },
    ],
    keywords: ["NCLEX-RN exam blueprint", "NCLEX-RN test plan", "NCLEX-RN client needs categories", "NCLEX-RN content breakdown", "NCLEX-RN study guide", "NCLEX-RN category weighting"],
  },
  {
    slug: "nclex-pn-exam-blueprint",
    examName: "NCLEX-PN",
    examCode: "NCLEX-PN",
    region: "US",
    tier: "rpn",
    h1Title: "NCLEX-PN Exam Blueprint: Client Needs Categories & Test Plan for LPN/LVN",
    introText: "The NCLEX-PN test plan follows the same Client Needs framework as the NCLEX-RN but is scoped to practical/vocational nursing practice. Understanding the NCLEX-PN blueprint helps LPN and LVN candidates focus their study time on the most heavily weighted categories. This page breaks down every exam domain, the percentage of questions from each category, and practical study strategies for the NCLEX-PN.",
    questionCount: "60–85 questions (adaptive)",
    timeLimit: "5 hours maximum",
    adaptiveOrFixed: "adaptive",
    passInfo: "Approximately 86% first-time pass rate for US-educated candidates",
    questionTypes: ["Multiple Choice (MCQ)", "Select All That Apply (SATA)", "Ordered Response", "Fill-in-the-Blank Calculation", "Hot Spot", "NGN Case Studies"],
    categories: [
      { name: "Coordinated Care", slug: "nclex-pn-coordinated-care", weight: "18–24%", description: "Advance directives, advocacy, client rights, collaboration, continuity of care, ethical practice, informed consent, legal responsibilities, and prioritization within the LPN/LVN scope." },
      { name: "Safety and Infection Control", slug: "nclex-pn-safety-infection-control", weight: "10–16%", description: "Accident prevention, emergency response, ergonomics, handling hazardous materials, infection control practices, safe use of equipment, and restraint use." },
      { name: "Health Promotion and Maintenance", slug: "nclex-pn-health-promotion", weight: "6–12%", description: "Aging process, ante/intra/postpartum care, developmental stages, health screening, immunizations, lifestyle choices, and self-care education." },
      { name: "Psychosocial Integrity", slug: "nclex-pn-psychosocial-integrity", weight: "9–15%", description: "Abuse/neglect, behavioral management, chemical dependency, coping mechanisms, crisis intervention, cultural awareness, grief/loss, mental health concepts, and therapeutic communication." },
      { name: "Basic Care and Comfort", slug: "nclex-pn-basic-care", weight: "7–13%", description: "Assistive devices, elimination, mobility, non-pharmacological comfort measures, nutrition, personal hygiene, rest and sleep within the LPN/LVN scope." },
      { name: "Pharmacological Therapies", slug: "nclex-pn-pharmacology", weight: "10–16%", description: "Adverse effects, blood products, dosage calculations, drug interactions, expected actions, medication administration, and parenteral therapies." },
      { name: "Reduction of Risk Potential", slug: "nclex-pn-reduction-of-risk", weight: "9–15%", description: "Changes in condition, diagnostic tests, lab value interpretation, potential complications, system-specific assessments, therapeutic procedures, and vital signs." },
      { name: "Physiological Adaptation", slug: "nclex-pn-physiological-adaptation", weight: "7–13%", description: "Alterations in body systems, basic pathophysiology, fluid/electrolyte imbalances, medical emergencies, and unexpected responses to therapies." },
    ],
    studyStrategies: [
      { title: "Focus on LPN/LVN Scope", description: "All NCLEX-PN questions are written within the practical nursing scope. Focus on data collection, contributing to care plans, and supervised clinical decision-making." },
      { title: "Master Coordinated Care", description: "Coordinated Care (18–24%) is the single largest subcategory. Understand delegation, prioritization, and collaboration within the LPN/LVN role." },
      { title: "Practice Dosage Calculations", description: "Fill-in-the-blank calculation questions test dosage math. Practice oral, IM, and IV rate calculations until they are automatic." },
      { title: "Use Practice Exams with Rationales", description: "Complete at least 1,500 practice questions with rationale review. Focus on understanding why answers are correct, not just memorizing facts." },
    ],
    faqItems: [
      { question: "What is the NCLEX-PN test plan?", answer: "The NCLEX-PN test plan is the official NCSBN blueprint that outlines the Client Needs categories and their percentage weighting. It is specific to the LPN/LVN scope of practice and is updated every three years." },
      { question: "How is the NCLEX-PN blueprint different from the NCLEX-RN?", answer: "The NCLEX-PN uses the same Client Needs framework but the content is scoped to practical/vocational nursing. The PN exam emphasizes data collection over comprehensive assessment, and contributing to care plans rather than independent planning." },
      { question: "Which category is most important on the NCLEX-PN?", answer: "Coordinated Care (18–24%) and Pharmacological Therapies (10–16%) are the most heavily weighted individual subcategories. Overall, Physiological Integrity accounts for the largest share of questions." },
      { question: "Does the NCLEX-PN include NGN questions?", answer: "Yes. The NCLEX-PN includes Next Generation NCLEX item types including case studies that assess clinical judgment using the NCSBN Clinical Judgment Measurement Model." },
      { question: "How many questions should I practice for the NCLEX-PN?", answer: "Most successful candidates complete 1,500–2,000 practice questions during their study period. Quality matters more than quantity — always review rationales for every answer choice." },
    ],
    keywords: ["NCLEX-PN exam blueprint", "NCLEX-PN test plan", "NCLEX-PN categories", "LPN exam blueprint", "LVN exam plan", "NCLEX-PN content breakdown"],
  },
  {
    slug: "allied-health-exam-blueprint",
    examName: "Allied Health Certifications",
    examCode: "Allied Health",
    region: "both",
    tier: "allied",
    h1Title: "Allied Health Certification Exam Blueprints: Study Guides & Test Plans",
    introText: "Allied health certification exams cover a wide range of healthcare professions including respiratory therapy, medical laboratory technology, radiography, paramedic science, occupational therapy, social work, and more. Each profession has its own certification body and exam blueprint. This page serves as a central hub for understanding allied health exam structures, content domains, and study strategies across multiple healthcare disciplines.",
    questionCount: "Varies by exam (100–250 questions typical)",
    timeLimit: "Varies by exam (2–5 hours typical)",
    adaptiveOrFixed: "fixed",
    passInfo: "Varies by certification body — scaled score passing standards",
    questionTypes: ["Multiple Choice", "Case-Based Scenarios", "Fill-in-the-Blank", "Matching", "Simulation Items"],
    categories: [
      { name: "Respiratory Therapy (RRT/CSRT)", slug: "allied-respiratory-therapy", weight: "Full exam", description: "Ventilator management, airway management, ABG interpretation, pulmonary function testing, pharmacology, and patient assessment for respiratory therapists." },
      { name: "Medical Laboratory Technology (MLT)", slug: "allied-medical-lab-tech", weight: "Full exam", description: "Hematology, clinical chemistry, microbiology, blood banking, urinalysis, immunology, and laboratory safety for medical laboratory technologists." },
      { name: "Radiography (ARRT/CAMRT)", slug: "allied-radiography", weight: "Full exam", description: "Imaging procedures, patient care, radiation protection, equipment operation, image evaluation, and radiographic positioning." },
      { name: "Paramedic (NREMT/ACP)", slug: "allied-paramedic", weight: "Full exam", description: "Airway and breathing, cardiology, trauma, medical emergencies, EMS operations, pharmacology, and patient assessment for paramedic certification." },
      { name: "Occupational Therapy (NBCOT)", slug: "allied-occupational-therapy", weight: "Full exam", description: "Evaluation and assessment, intervention planning, intervention implementation, and management of occupational therapy services." },
      { name: "Social Work (ASWB)", slug: "allied-social-work", weight: "Full exam", description: "Human development, assessment/diagnosis/treatment planning, direct and indirect practice, professional relationships, ethics, and supervision." },
      { name: "Pharmacy Technician (PEBC/PTCB)", slug: "allied-pharmacy-tech", weight: "Full exam", description: "Pharmacology, prescription processing, compounding, inventory management, pharmacy law and ethics, and medication safety." },
      { name: "Psychotherapy and Addictions", slug: "allied-psychotherapy-addictions", weight: "Full exam", description: "Therapeutic modalities, assessment, treatment planning, substance use interventions, crisis management, and ethical practice in counseling." },
    ],
    studyStrategies: [
      { title: "Know Your Exam Blueprint", description: "Each allied health certification has a unique test plan. Start by reviewing the official blueprint published by your certification body to understand content weighting." },
      { title: "Focus on Clinical Application", description: "Most allied health exams emphasize clinical application over rote memorization. Practice with scenario-based questions that require you to apply knowledge to real-world situations." },
      { title: "Use Profession-Specific Resources", description: "Study with materials designed for your specific profession. Generic resources may not cover the specialized content tested on your certification exam." },
      { title: "Practice Under Timed Conditions", description: "Simulate exam conditions by completing practice tests within the official time limit. Time management is essential for fixed-length exams." },
    ],
    faqItems: [
      { question: "What allied health certification exams does NurseNest support?", answer: "NurseNest provides practice questions and study materials for respiratory therapy (RRT/CSRT), medical laboratory technology (MLT), radiography (ARRT/CAMRT), paramedic (NREMT/ACP), occupational therapy (NBCOT), social work (ASWB), pharmacy technician, and psychotherapy/addictions counseling exams." },
      { question: "Are allied health exam blueprints the same as nursing exam blueprints?", answer: "No. Each allied health profession has its own certification body that publishes a unique exam blueprint. The content domains, question formats, and passing standards vary by profession." },
      { question: "How should I study for an allied health certification exam?", answer: "Start by reviewing your exam's official blueprint. Allocate study time proportionally to each content domain's weighting. Use profession-specific practice questions and review rationales for every answer." },
      { question: "Do allied health exams use adaptive testing?", answer: "Some do. The NREMT paramedic exam uses computer adaptive testing. Most other allied health exams (ARRT, NBCOT, ASWB, PTCB) use fixed-length formats with scaled scoring." },
      { question: "How long should I study for an allied health certification exam?", answer: "Most candidates study for 8–12 weeks. The timeline depends on your background, the exam's difficulty, and how recently you completed your education program." },
    ],
    keywords: ["allied health exam blueprint", "allied health certification exams", "healthcare certification study guide", "allied health test plans", "respiratory therapy exam", "MLT exam", "radiography exam", "paramedic exam"],
  },
];

export const BLUEPRINT_CATEGORIES: BlueprintCategoryConfig[] = [
  {
    slug: "rexpn-foundations-of-practice",
    name: "Foundations of Practice",
    parentExamSlug: "rexpn-exam-blueprint",
    weight: "36%",
    description: "Foundations of Practice is the most heavily weighted domain on the REx-PN exam at 36%. This category tests your clinical knowledge and skills essential for safe entry-level practical nursing practice in Canada, including anatomy and physiology, pathophysiology, pharmacology, clinical procedures, and health assessment. Mastering this domain is critical for exam success.",
    topicsList: [
      "Anatomy and physiology across body systems",
      "Pathophysiology of common acute and chronic conditions",
      "Pharmacology: drug classifications, mechanisms of action, side effects",
      "Health assessment and data collection techniques",
      "Vital signs interpretation and monitoring",
      "Diagnostic test interpretation (lab values in SI units)",
      "Clinical procedures and nursing interventions",
      "Nutrition and therapeutic diets",
      "Fluid and electrolyte balance",
      "Pain assessment and management",
    ],
    guideLinks: [
      { label: "REx-PN Study Guide", href: "/rex-pn-guide" },
      { label: "REx-PN Content Blueprint", href: "/rex-pn-guide/blueprint" },
      { label: "Pharmacology Review", href: "/pharmacology" },
    ],
    flashcardLinks: [
      { label: "Pharmacology Flashcards", href: "/flashcards" },
      { label: "Lab Values Flashcards", href: "/flashcards" },
    ],
    previewQuestionLinks: [
      { label: "REx-PN Practice Questions", href: "/rex-pn-practice-questions" },
      { label: "Practice Questions by Topic", href: "/practice-questions" },
    ],
    lessonLinks: [
      { label: "Cardiovascular Lessons", href: "/lessons" },
      { label: "Respiratory Lessons", href: "/lessons" },
      { label: "Lab Values Reference", href: "/lab-values" },
    ],
    faqItems: [
      { question: "What percentage of the REx-PN is Foundations of Practice?", answer: "Foundations of Practice accounts for 36% of the REx-PN exam, making it the single most heavily weighted domain." },
      { question: "What topics are covered in Foundations of Practice?", answer: "This domain covers anatomy and physiology, pathophysiology, pharmacology, health assessment, clinical procedures, nutrition, fluid and electrolyte balance, and diagnostic test interpretation." },
    ],
    keywords: ["REx-PN foundations of practice", "REx-PN clinical knowledge", "REx-PN pharmacology", "REx-PN pathophysiology"],
  },
  {
    slug: "rexpn-collaborative-practice",
    name: "Collaborative Practice",
    parentExamSlug: "rexpn-exam-blueprint",
    weight: "30%",
    description: "Collaborative Practice is the second-largest domain on the REx-PN at 30%. This category tests your ability to work within the interprofessional healthcare team, understand delegation principles, communicate effectively, and contribute to client care planning within the RPN scope of practice.",
    topicsList: [
      "Interprofessional collaboration and teamwork",
      "Delegation to unregulated care providers (UCPs)",
      "Communication with clients, families, and team members",
      "Contributing to the nursing care plan",
      "Reporting and documenting client status",
      "Continuity of care and discharge planning",
      "Client and family education (reinforcing teaching)",
      "Conflict resolution in healthcare settings",
    ],
    guideLinks: [
      { label: "REx-PN Study Guide", href: "/rex-pn-guide" },
      { label: "Clinical Skills Guide", href: "/clinical-skills" },
    ],
    flashcardLinks: [
      { label: "Nursing Fundamentals Flashcards", href: "/flashcards" },
    ],
    previewQuestionLinks: [
      { label: "REx-PN Practice Questions", href: "/rex-pn-practice-questions" },
    ],
    lessonLinks: [
      { label: "Delegation & Scope Lessons", href: "/lessons" },
    ],
    faqItems: [
      { question: "What is tested in Collaborative Practice?", answer: "This domain covers interprofessional collaboration, delegation, communication, contributing to care plans, discharge planning, and client education within the RPN scope." },
      { question: "Why is Collaborative Practice so heavily weighted?", answer: "RPNs work closely with RNs, physicians, and other team members. The exam tests your ability to collaborate effectively while staying within your scope of practice." },
    ],
    keywords: ["REx-PN collaborative practice", "REx-PN delegation", "REx-PN teamwork", "RPN scope of practice"],
  },
  {
    slug: "rexpn-professional-practice",
    name: "Professional Practice",
    parentExamSlug: "rexpn-exam-blueprint",
    weight: "16%",
    description: "Professional Practice accounts for 16% of the REx-PN and tests your understanding of nursing standards, regulatory frameworks, continuing competence, reflective practice, and professional accountability within the Canadian healthcare system.",
    topicsList: [
      "Standards of practice and professional accountability",
      "Regulatory frameworks and nursing legislation",
      "Continuing competence and professional development",
      "Reflective practice and self-assessment",
      "Evidence-based nursing practice",
      "Quality improvement in nursing care",
      "Documentation standards and record-keeping",
      "Professional boundaries and therapeutic relationships",
    ],
    guideLinks: [
      { label: "REx-PN Study Guide", href: "/rex-pn-guide" },
    ],
    flashcardLinks: [
      { label: "Professional Practice Flashcards", href: "/flashcards" },
    ],
    previewQuestionLinks: [
      { label: "REx-PN Practice Questions", href: "/rex-pn-practice-questions" },
    ],
    lessonLinks: [
      { label: "Nursing Fundamentals", href: "/lessons" },
    ],
    faqItems: [
      { question: "What percentage of the REx-PN is Professional Practice?", answer: "Professional Practice accounts for 16% of the REx-PN exam." },
    ],
    keywords: ["REx-PN professional practice", "RPN professional standards", "RPN regulatory framework"],
  },
  {
    slug: "rexpn-ethical-practice",
    name: "Ethical Practice",
    parentExamSlug: "rexpn-exam-blueprint",
    weight: "10%",
    description: "Ethical Practice accounts for 10% of the REx-PN and tests your ability to apply ethical decision-making frameworks, advocate for clients, maintain confidentiality, obtain informed consent, and apply the nursing code of ethics in clinical situations.",
    topicsList: [
      "Ethical decision-making frameworks",
      "Client advocacy and autonomy",
      "Informed consent and capacity",
      "Confidentiality and privacy (PHIPA/PIPEDA)",
      "Code of ethics application",
      "Advance directives and end-of-life decisions",
      "Cultural safety and sensitivity",
      "Ethical dilemmas in clinical practice",
    ],
    guideLinks: [
      { label: "REx-PN Study Guide", href: "/rex-pn-guide" },
    ],
    flashcardLinks: [
      { label: "Ethics Flashcards", href: "/flashcards" },
    ],
    previewQuestionLinks: [
      { label: "REx-PN Practice Questions", href: "/rex-pn-practice-questions" },
    ],
    lessonLinks: [],
    faqItems: [
      { question: "How is ethical practice tested on the REx-PN?", answer: "Questions present clinical scenarios requiring you to apply ethical principles such as autonomy, beneficence, non-maleficence, and justice. You may need to identify the most ethical nursing action." },
    ],
    keywords: ["REx-PN ethical practice", "RPN ethics", "nursing ethics Canada"],
  },
  {
    slug: "rexpn-legal-practice",
    name: "Legal Practice",
    parentExamSlug: "rexpn-exam-blueprint",
    weight: "8%",
    description: "Legal Practice accounts for 8% of the REx-PN and covers the legal obligations of practical nurses in Canada, including documentation standards, scope of practice boundaries, mandatory reporting, regulated acts, and legal issues such as negligence and malpractice.",
    topicsList: [
      "Legal obligations and responsibilities of RPNs",
      "Scope of practice boundaries and controlled acts",
      "Mandatory reporting requirements",
      "Documentation and legal record-keeping",
      "Negligence and malpractice concepts",
      "Workplace safety legislation",
      "Client rights and consent in legal context",
      "Incident reporting and risk management",
    ],
    guideLinks: [
      { label: "REx-PN Study Guide", href: "/rex-pn-guide" },
    ],
    flashcardLinks: [],
    previewQuestionLinks: [
      { label: "REx-PN Practice Questions", href: "/rex-pn-practice-questions" },
    ],
    lessonLinks: [],
    faqItems: [
      { question: "What legal topics are tested on the REx-PN?", answer: "Legal Practice covers scope of practice, mandatory reporting, documentation standards, negligence, malpractice, controlled acts, and client rights." },
    ],
    keywords: ["REx-PN legal practice", "RPN legal obligations", "nursing law Canada"],
  },
  {
    slug: "rexpn-safety-and-infection-control",
    name: "Safety and Infection Control",
    parentExamSlug: "rexpn-exam-blueprint",
    weight: "10–16%",
    description: "Safety and Infection Control tests your knowledge of maintaining a safe environment for clients, staff, and visitors. This domain covers routine practices, additional precautions, fall prevention, restraint use, safe medication administration, and workplace safety within the Canadian healthcare context.",
    topicsList: [
      "Routine practices and additional precautions",
      "Hand hygiene and personal protective equipment (PPE)",
      "Fall prevention and safety assessments",
      "Restraint use: alternatives, monitoring, documentation",
      "Safe medication administration practices",
      "Workplace safety and ergonomics",
      "Emergency preparedness and response",
      "Sharps safety and waste management",
    ],
    guideLinks: [
      { label: "REx-PN Content Blueprint", href: "/rex-pn-guide/blueprint" },
    ],
    flashcardLinks: [
      { label: "Infection Control Flashcards", href: "/flashcards" },
    ],
    previewQuestionLinks: [
      { label: "REx-PN Practice Questions", href: "/rex-pn-practice-questions" },
    ],
    lessonLinks: [
      { label: "Infection Control Lessons", href: "/lessons" },
    ],
    faqItems: [
      { question: "How important is Safety and Infection Control on the REx-PN?", answer: "Safety and Infection Control accounts for 10–16% of the exam and is a critical domain. Patient safety questions require you to identify priority actions to prevent harm." },
    ],
    keywords: ["REx-PN safety", "REx-PN infection control", "RPN safety practices"],
  },
  {
    slug: "rexpn-health-promotion",
    name: "Health Promotion and Maintenance",
    parentExamSlug: "rexpn-exam-blueprint",
    weight: "6–12%",
    description: "Health Promotion and Maintenance tests the RPN's role in promoting health and preventing illness across the lifespan. Content includes growth and development, health screening, immunization schedules, prenatal and postpartum care, aging-related changes, and client education.",
    topicsList: [
      "Growth and development across the lifespan",
      "Health screening recommendations (Canadian guidelines)",
      "Canadian immunization schedules",
      "Prenatal, intrapartum, and postpartum care",
      "Newborn care and developmental milestones",
      "Aging-related changes and care",
      "Health promotion strategies and client education",
      "Disease prevention and lifestyle modification",
    ],
    guideLinks: [
      { label: "REx-PN Content Blueprint", href: "/rex-pn-guide/blueprint" },
    ],
    flashcardLinks: [],
    previewQuestionLinks: [
      { label: "REx-PN Practice Questions", href: "/rex-pn-practice-questions" },
    ],
    lessonLinks: [
      { label: "Maternal/Newborn Lessons", href: "/lessons" },
      { label: "Pediatric Lessons", href: "/lessons" },
    ],
    faqItems: [
      { question: "What health promotion topics are tested on the REx-PN?", answer: "This domain covers growth and development, health screening, immunizations, prenatal/postpartum care, aging, and client education using Canadian healthcare guidelines." },
    ],
    keywords: ["REx-PN health promotion", "RPN health promotion", "Canadian health screening"],
  },
  {
    slug: "rexpn-pharmacological-therapies",
    name: "Pharmacological Therapies",
    parentExamSlug: "rexpn-exam-blueprint",
    weight: "10–16%",
    description: "Pharmacological Therapies tests your knowledge of medication administration, drug classifications, dosage calculations using metric units, adverse effects, drug interactions, and Health Canada-approved medications within the RPN scope of practice.",
    topicsList: [
      "Drug classifications and mechanisms of action",
      "Dosage calculations (metric units: mg, mL, mcg)",
      "Rights of medication administration",
      "Adverse effects and contraindications",
      "Drug interactions and nursing implications",
      "High-alert medications and safety protocols",
      "IV therapy and parenteral medication administration",
      "Health Canada drug names and formulary",
    ],
    guideLinks: [
      { label: "Pharmacology Review", href: "/pharmacology" },
      { label: "Medication Mastery", href: "/medication-mastery" },
    ],
    flashcardLinks: [
      { label: "Pharmacology Flashcards", href: "/flashcards" },
    ],
    previewQuestionLinks: [
      { label: "REx-PN Practice Questions", href: "/rex-pn-practice-questions" },
    ],
    lessonLinks: [
      { label: "Pharmacology Lessons", href: "/lessons" },
    ],
    faqItems: [
      { question: "How important is pharmacology on the REx-PN?", answer: "Pharmacological Therapies accounts for 10–16% of the exam. You need to know drug classifications, dosage calculations, side effects, and nursing considerations for commonly prescribed medications." },
    ],
    keywords: ["REx-PN pharmacology", "RPN medication administration", "Canadian pharmacology exam"],
  },
  {
    slug: "nclex-management-of-care",
    name: "Management of Care",
    parentExamSlug: "nclex-rn-exam-blueprint",
    weight: "17–23%",
    description: "Management of Care is the single largest subcategory on the NCLEX-RN, accounting for 17–23% of the exam. This category tests your ability to manage nursing care delivery, make delegation decisions, advocate for clients, apply ethical and legal principles, and collaborate with the interprofessional team.",
    topicsList: [
      "Advance directives and end-of-life care",
      "Client advocacy and rights",
      "Assignment, delegation, and supervision",
      "Case management and continuity of care",
      "Informed consent and client education",
      "Ethical practice and professional standards",
      "Legal rights and responsibilities",
      "Performance improvement and quality assurance",
      "Referrals and interprofessional collaboration",
      "Establishing priorities of care",
    ],
    guideLinks: [
      { label: "NCLEX-RN Content Blueprint", href: "/nclex-rn-guide/blueprint" },
      { label: "NCLEX-RN Study Strategies", href: "/nclex-rn-guide/study-plan" },
    ],
    flashcardLinks: [
      { label: "Management of Care Flashcards", href: "/flashcards" },
      { label: "Delegation Flashcards", href: "/flashcards" },
    ],
    previewQuestionLinks: [
      { label: "NCLEX-RN Practice Questions", href: "/nclex-rn-practice-questions" },
      { label: "Management of Care Questions", href: "/practice-questions" },
    ],
    lessonLinks: [
      { label: "Delegation & Prioritization Lessons", href: "/lessons" },
      { label: "Ethical & Legal Nursing Lessons", href: "/lessons" },
    ],
    faqItems: [
      { question: "What percentage of the NCLEX-RN is Management of Care?", answer: "Management of Care accounts for 17–23% of the NCLEX-RN, making it the largest single subcategory on the exam." },
      { question: "What delegation topics are tested?", answer: "You need to know the five rights of delegation, what tasks can be delegated to LPNs and UAPs, and when to escalate to the charge nurse or provider." },
    ],
    keywords: ["NCLEX-RN management of care", "NCLEX delegation", "NCLEX prioritization", "NCLEX ethical practice"],
  },
  {
    slug: "nclex-safety-and-infection-control",
    name: "Safety and Infection Control",
    parentExamSlug: "nclex-rn-exam-blueprint",
    weight: "9–15%",
    description: "Safety and Infection Control accounts for 9–15% of the NCLEX-RN and tests your knowledge of maintaining a safe care environment, preventing injuries, managing emergencies, and applying standard and transmission-based precautions.",
    topicsList: [
      "Accident, error, and injury prevention",
      "Emergency response planning",
      "Ergonomic principles",
      "Handling hazardous and infectious materials",
      "Home safety assessment",
      "Reporting of incidents and safety events",
      "Safe use of equipment and technology",
      "Standard precautions and transmission-based precautions",
      "Surgical asepsis and sterile technique",
      "Use of restraints and alternatives",
    ],
    guideLinks: [
      { label: "NCLEX-RN Content Blueprint", href: "/nclex-rn-guide/blueprint" },
    ],
    flashcardLinks: [
      { label: "Infection Control Flashcards", href: "/flashcards" },
    ],
    previewQuestionLinks: [
      { label: "NCLEX-RN Practice Questions", href: "/nclex-rn-practice-questions" },
    ],
    lessonLinks: [
      { label: "Safety & Infection Control Lessons", href: "/lessons" },
    ],
    faqItems: [
      { question: "What safety topics are tested on the NCLEX-RN?", answer: "This category covers accident prevention, emergency response, infection control, sterile technique, restraint use, and safe equipment operation." },
    ],
    keywords: ["NCLEX-RN safety", "NCLEX infection control", "NCLEX standard precautions"],
  },
  {
    slug: "nclex-health-promotion",
    name: "Health Promotion and Maintenance",
    parentExamSlug: "nclex-rn-exam-blueprint",
    weight: "6–12%",
    description: "Health Promotion and Maintenance accounts for 6–12% of the NCLEX-RN and covers the entire lifespan from prenatal through aging. This category tests your ability to provide anticipatory guidance, recognize developmental milestones, and promote wellness across all age groups.",
    topicsList: [
      "Ante/intra/postpartum and newborn care",
      "Developmental stages and milestones",
      "Health promotion and disease prevention",
      "Health screening recommendations",
      "High-risk behaviors identification",
      "Lifestyle choices and wellness",
      "Self-care education",
      "Physical assessment techniques",
    ],
    guideLinks: [
      { label: "NCLEX-RN Content Blueprint", href: "/nclex-rn-guide/blueprint" },
    ],
    flashcardLinks: [],
    previewQuestionLinks: [
      { label: "NCLEX-RN Practice Questions", href: "/nclex-rn-practice-questions" },
    ],
    lessonLinks: [
      { label: "Maternal & Newborn Lessons", href: "/lessons" },
      { label: "Pediatric Lessons", href: "/lessons" },
    ],
    faqItems: [
      { question: "What is tested in Health Promotion and Maintenance?", answer: "This category covers the lifespan from prenatal to aging, including developmental milestones, health screening, disease prevention, and client education." },
    ],
    keywords: ["NCLEX health promotion", "NCLEX developmental stages", "NCLEX maternal newborn"],
  },
  {
    slug: "nclex-psychosocial-integrity",
    name: "Psychosocial Integrity",
    parentExamSlug: "nclex-rn-exam-blueprint",
    weight: "6–12%",
    description: "Psychosocial Integrity accounts for 6–12% of the NCLEX-RN and covers mental health concepts, coping mechanisms, crisis intervention, therapeutic communication, and cultural awareness. Questions often require understanding therapeutic vs. non-therapeutic nursing responses.",
    topicsList: [
      "Abuse and neglect recognition and reporting",
      "Behavioral interventions",
      "Chemical and substance dependency",
      "Coping mechanisms and stress management",
      "Crisis intervention",
      "Cultural awareness and sensitivity",
      "End-of-life care and grief/loss",
      "Family dynamics and support systems",
      "Mental health concepts and disorders",
      "Therapeutic communication techniques",
    ],
    guideLinks: [
      { label: "NCLEX-RN Content Blueprint", href: "/nclex-rn-guide/blueprint" },
    ],
    flashcardLinks: [
      { label: "Mental Health Flashcards", href: "/flashcards" },
    ],
    previewQuestionLinks: [
      { label: "NCLEX-RN Practice Questions", href: "/nclex-rn-practice-questions" },
    ],
    lessonLinks: [
      { label: "Mental Health Nursing Lessons", href: "/lessons" },
    ],
    faqItems: [
      { question: "What is Psychosocial Integrity on the NCLEX-RN?", answer: "This category covers mental health, therapeutic communication, crisis intervention, cultural awareness, grief/loss, and substance dependency. Questions test your ability to provide therapeutic responses." },
    ],
    keywords: ["NCLEX psychosocial integrity", "NCLEX mental health", "NCLEX therapeutic communication"],
  },
  {
    slug: "nclex-basic-care-and-comfort",
    name: "Basic Care and Comfort",
    parentExamSlug: "nclex-rn-exam-blueprint",
    weight: "6–12%",
    description: "Basic Care and Comfort accounts for 6–12% of the NCLEX-RN and tests fundamental nursing care skills including nutrition, elimination, mobility, non-pharmacological comfort measures, and personal hygiene.",
    topicsList: [
      "Assistive devices and mobility aids",
      "Elimination patterns and interventions",
      "Mobility and immobility management",
      "Non-pharmacological comfort interventions",
      "Nutrition and therapeutic diets",
      "Personal hygiene and self-care",
      "Rest and sleep promotion",
      "Pain management strategies",
    ],
    guideLinks: [
      { label: "NCLEX-RN Content Blueprint", href: "/nclex-rn-guide/blueprint" },
    ],
    flashcardLinks: [],
    previewQuestionLinks: [
      { label: "NCLEX-RN Practice Questions", href: "/nclex-rn-practice-questions" },
    ],
    lessonLinks: [
      { label: "Nursing Fundamentals Lessons", href: "/lessons" },
    ],
    faqItems: [
      { question: "What is tested in Basic Care and Comfort?", answer: "This category covers nutrition, elimination, mobility, comfort measures, personal hygiene, rest, sleep, and pain management using non-pharmacological interventions." },
    ],
    keywords: ["NCLEX basic care", "NCLEX comfort measures", "NCLEX nutrition"],
  },
  {
    slug: "nclex-pharmacology",
    name: "Pharmacological Therapies",
    parentExamSlug: "nclex-rn-exam-blueprint",
    weight: "13–19%",
    description: "Pharmacological Therapies is one of the most heavily weighted subcategories on the NCLEX-RN at 13–19%. This category tests your knowledge of medication administration, adverse effects, drug interactions, dosage calculations, IV therapies, blood products, and total parenteral nutrition.",
    topicsList: [
      "Adverse effects, interactions, and contraindications",
      "Blood and blood product administration",
      "Central venous access device management",
      "Dosage calculation and safe administration",
      "Expected actions and outcomes of medications",
      "IV therapies and fluid management",
      "Medication administration routes and techniques",
      "Parenteral and IV therapy management",
      "Pharmacological agents and classifications",
      "Total parenteral nutrition (TPN)",
    ],
    guideLinks: [
      { label: "NCLEX-RN Content Blueprint", href: "/nclex-rn-guide/blueprint" },
      { label: "Pharmacology Review", href: "/pharmacology" },
      { label: "Medication Mastery", href: "/medication-mastery" },
    ],
    flashcardLinks: [
      { label: "Pharmacology Flashcards", href: "/flashcards" },
      { label: "Drug Classification Flashcards", href: "/flashcards" },
    ],
    previewQuestionLinks: [
      { label: "NCLEX-RN Practice Questions", href: "/nclex-rn-practice-questions" },
      { label: "Pharmacology Practice Questions", href: "/practice-questions" },
    ],
    lessonLinks: [
      { label: "Pharmacology Lessons", href: "/lessons" },
      { label: "Lab Values Reference", href: "/lab-values" },
    ],
    faqItems: [
      { question: "How heavily is pharmacology tested on the NCLEX-RN?", answer: "Pharmacological Therapies accounts for 13–19% of the NCLEX-RN, making it one of the most heavily weighted subcategories. Combined with the rest of Physiological Integrity, this domain area is critical." },
      { question: "What medications should I focus on?", answer: "Focus on high-alert medications, common drug classifications, dosage calculations, adverse effects, and nursing implications. Know drugs by classification rather than memorizing individual medications." },
    ],
    keywords: ["NCLEX pharmacology", "NCLEX medications", "NCLEX drug calculations", "NCLEX IV therapy"],
  },
  {
    slug: "nclex-reduction-of-risk",
    name: "Reduction of Risk Potential",
    parentExamSlug: "nclex-rn-exam-blueprint",
    weight: "9–15%",
    description: "Reduction of Risk Potential accounts for 9–15% of the NCLEX-RN and tests your ability to monitor for complications, interpret diagnostic tests, recognize changes in body systems, and implement interventions to reduce risk.",
    topicsList: [
      "Changes in body systems and deterioration signs",
      "Diagnostic test interpretation",
      "Laboratory value analysis and trending",
      "Potential complications of procedures/treatments",
      "System-specific assessments",
      "Therapeutic procedures and pre/post care",
      "Vital signs interpretation",
      "Risk assessment tools and frameworks",
    ],
    guideLinks: [
      { label: "NCLEX-RN Content Blueprint", href: "/nclex-rn-guide/blueprint" },
    ],
    flashcardLinks: [
      { label: "Lab Values Flashcards", href: "/flashcards" },
    ],
    previewQuestionLinks: [
      { label: "NCLEX-RN Practice Questions", href: "/nclex-rn-practice-questions" },
    ],
    lessonLinks: [
      { label: "Lab Values Reference", href: "/lab-values" },
      { label: "Assessment Lessons", href: "/lessons" },
    ],
    faqItems: [
      { question: "What is Reduction of Risk Potential?", answer: "This category tests your ability to monitor for complications, interpret diagnostic and lab results, recognize deterioration, and implement preventive interventions." },
    ],
    keywords: ["NCLEX risk reduction", "NCLEX diagnostic tests", "NCLEX lab values", "NCLEX complications"],
  },
  {
    slug: "nclex-physiological-adaptation",
    name: "Physiological Adaptation",
    parentExamSlug: "nclex-rn-exam-blueprint",
    weight: "11–17%",
    description: "Physiological Adaptation accounts for 11–17% of the NCLEX-RN and tests your ability to manage acute and chronic conditions, recognize medical emergencies, understand pathophysiology, and manage fluid/electrolyte imbalances.",
    topicsList: [
      "Alterations in body systems",
      "Fluid and electrolyte imbalances",
      "Hemodynamic monitoring and management",
      "Illness management and chronic disease",
      "Medical emergencies and rapid response",
      "Pathophysiology of major conditions",
      "Unexpected response to therapies",
      "Acid-base balance and ABG interpretation",
    ],
    guideLinks: [
      { label: "NCLEX-RN Content Blueprint", href: "/nclex-rn-guide/blueprint" },
      { label: "Clinical Clarity", href: "/clinical-clarity" },
    ],
    flashcardLinks: [
      { label: "Pathophysiology Flashcards", href: "/flashcards" },
    ],
    previewQuestionLinks: [
      { label: "NCLEX-RN Practice Questions", href: "/nclex-rn-practice-questions" },
    ],
    lessonLinks: [
      { label: "Pathophysiology Lessons", href: "/lessons" },
      { label: "Fluid & Electrolyte Lessons", href: "/lessons" },
    ],
    faqItems: [
      { question: "What is Physiological Adaptation on the NCLEX-RN?", answer: "This category tests your ability to manage alterations in body systems, fluid/electrolyte imbalances, hemodynamics, medical emergencies, and pathophysiology." },
    ],
    keywords: ["NCLEX physiological adaptation", "NCLEX pathophysiology", "NCLEX fluid electrolytes", "NCLEX emergencies"],
  },
  {
    slug: "nclex-pn-coordinated-care",
    name: "Coordinated Care",
    parentExamSlug: "nclex-pn-exam-blueprint",
    weight: "18–24%",
    description: "Coordinated Care is the largest subcategory on the NCLEX-PN at 18–24%. This category tests the LPN/LVN's role in coordinating client care, understanding delegation within the practical nursing scope, advocating for clients, and applying ethical and legal principles.",
    topicsList: [
      "Advance directives and client rights",
      "Client advocacy within LPN/LVN scope",
      "Collaboration with the healthcare team",
      "Continuity of care and discharge planning",
      "Delegation and assignment within PN scope",
      "Ethical practice and professional standards",
      "Informed consent and legal responsibilities",
      "Prioritization of client care",
    ],
    guideLinks: [
      { label: "NCLEX-PN Study Resources", href: "/nclex-pn" },
    ],
    flashcardLinks: [
      { label: "Coordinated Care Flashcards", href: "/flashcards" },
    ],
    previewQuestionLinks: [
      { label: "NCLEX-PN Practice Questions", href: "/nclex-pn-practice-questions" },
    ],
    lessonLinks: [
      { label: "LPN/LVN Scope Lessons", href: "/lessons" },
    ],
    faqItems: [
      { question: "What is Coordinated Care on the NCLEX-PN?", answer: "Coordinated Care tests the LPN/LVN's ability to coordinate client care, delegate within scope, advocate for clients, and apply ethical and legal principles." },
    ],
    keywords: ["NCLEX-PN coordinated care", "LPN delegation", "LVN coordinated care"],
  },
  {
    slug: "nclex-pn-safety-infection-control",
    name: "Safety and Infection Control",
    parentExamSlug: "nclex-pn-exam-blueprint",
    weight: "10–16%",
    description: "Safety and Infection Control on the NCLEX-PN tests the practical nurse's ability to maintain a safe care environment, implement infection control measures, and respond to emergency situations.",
    topicsList: [
      "Accident and injury prevention",
      "Emergency response procedures",
      "Ergonomic principles in nursing care",
      "Handling hazardous materials",
      "Infection control practices and standard precautions",
      "Safe use of medical equipment",
      "Restraint use and alternatives",
      "Home safety assessment",
    ],
    guideLinks: [{ label: "NCLEX-PN Study Resources", href: "/nclex-pn" }],
    flashcardLinks: [{ label: "Safety Flashcards", href: "/flashcards" }],
    previewQuestionLinks: [{ label: "NCLEX-PN Practice Questions", href: "/nclex-pn-practice-questions" }],
    lessonLinks: [{ label: "Infection Control Lessons", href: "/lessons" }],
    faqItems: [
      { question: "What safety topics are on the NCLEX-PN?", answer: "Safety and Infection Control covers accident prevention, emergency response, infection control, equipment safety, and restraint use within the LPN/LVN scope." },
    ],
    keywords: ["NCLEX-PN safety", "NCLEX-PN infection control", "LPN safety practices"],
  },
  {
    slug: "nclex-pn-health-promotion",
    name: "Health Promotion and Maintenance",
    parentExamSlug: "nclex-pn-exam-blueprint",
    weight: "6–12%",
    description: "Health Promotion and Maintenance on the NCLEX-PN covers the practical nurse's role in supporting health promotion activities, recognizing developmental milestones, and reinforcing health education across the lifespan.",
    topicsList: [
      "Aging process and related changes",
      "Ante/intra/postpartum and newborn care",
      "Developmental stages across the lifespan",
      "Health screening and disease prevention",
      "Immunization schedules",
      "Lifestyle choices and health education",
      "Self-care promotion",
    ],
    guideLinks: [{ label: "NCLEX-PN Study Resources", href: "/nclex-pn" }],
    flashcardLinks: [],
    previewQuestionLinks: [{ label: "NCLEX-PN Practice Questions", href: "/nclex-pn-practice-questions" }],
    lessonLinks: [{ label: "Health Promotion Lessons", href: "/lessons" }],
    faqItems: [
      { question: "What health promotion topics are on the NCLEX-PN?", answer: "Topics include developmental stages, health screening, immunizations, prenatal/postpartum care, aging, and client education." },
    ],
    keywords: ["NCLEX-PN health promotion", "LPN health promotion"],
  },
  {
    slug: "nclex-pn-psychosocial-integrity",
    name: "Psychosocial Integrity",
    parentExamSlug: "nclex-pn-exam-blueprint",
    weight: "9–15%",
    description: "Psychosocial Integrity on the NCLEX-PN tests the practical nurse's ability to provide emotional support, use therapeutic communication, recognize mental health conditions, and respond to crisis situations.",
    topicsList: [
      "Abuse and neglect recognition",
      "Behavioral management interventions",
      "Chemical and substance dependency",
      "Coping mechanisms and stress management",
      "Crisis intervention techniques",
      "Cultural awareness and sensitivity",
      "Grief, loss, and end-of-life support",
      "Mental health concepts",
      "Therapeutic communication",
    ],
    guideLinks: [{ label: "NCLEX-PN Study Resources", href: "/nclex-pn" }],
    flashcardLinks: [{ label: "Psychosocial Flashcards", href: "/flashcards" }],
    previewQuestionLinks: [{ label: "NCLEX-PN Practice Questions", href: "/nclex-pn-practice-questions" }],
    lessonLinks: [{ label: "Mental Health Lessons", href: "/lessons" }],
    faqItems: [
      { question: "What psychosocial topics are on the NCLEX-PN?", answer: "This category covers therapeutic communication, mental health, crisis intervention, cultural awareness, grief/loss, and substance dependency." },
    ],
    keywords: ["NCLEX-PN psychosocial", "LPN mental health", "LVN therapeutic communication"],
  },
  {
    slug: "nclex-pn-basic-care",
    name: "Basic Care and Comfort",
    parentExamSlug: "nclex-pn-exam-blueprint",
    weight: "7–13%",
    description: "Basic Care and Comfort on the NCLEX-PN tests fundamental practical nursing skills including nutrition, elimination, mobility, comfort measures, and personal hygiene within the LPN/LVN scope of practice.",
    topicsList: [
      "Assistive devices and mobility aids",
      "Elimination care and management",
      "Mobility and positioning",
      "Non-pharmacological comfort measures",
      "Nutrition and therapeutic diets",
      "Personal hygiene and self-care assistance",
      "Rest and sleep promotion",
    ],
    guideLinks: [{ label: "NCLEX-PN Study Resources", href: "/nclex-pn" }],
    flashcardLinks: [],
    previewQuestionLinks: [{ label: "NCLEX-PN Practice Questions", href: "/nclex-pn-practice-questions" }],
    lessonLinks: [{ label: "Nursing Fundamentals", href: "/lessons" }],
    faqItems: [
      { question: "What basic care topics are on the NCLEX-PN?", answer: "This category covers nutrition, elimination, mobility, comfort measures, hygiene, rest, and sleep within the LPN/LVN scope." },
    ],
    keywords: ["NCLEX-PN basic care", "LPN comfort measures", "LVN basic care"],
  },
  {
    slug: "nclex-pn-pharmacology",
    name: "Pharmacological Therapies",
    parentExamSlug: "nclex-pn-exam-blueprint",
    weight: "10–16%",
    description: "Pharmacological Therapies on the NCLEX-PN tests the practical nurse's knowledge of medication administration, drug classifications, dosage calculations, adverse effects, and parenteral therapies within the LPN/LVN scope.",
    topicsList: [
      "Adverse effects and drug interactions",
      "Blood product administration",
      "Dosage calculation (oral, IM, IV rates)",
      "Drug classifications and expected actions",
      "Medication administration routes",
      "Parenteral and IV therapy",
      "Pharmacological agents commonly used in PN practice",
    ],
    guideLinks: [
      { label: "NCLEX-PN Study Resources", href: "/nclex-pn" },
      { label: "Pharmacology Review", href: "/pharmacology" },
    ],
    flashcardLinks: [{ label: "Pharmacology Flashcards", href: "/flashcards" }],
    previewQuestionLinks: [{ label: "NCLEX-PN Practice Questions", href: "/nclex-pn-practice-questions" }],
    lessonLinks: [{ label: "Pharmacology Lessons", href: "/lessons" }],
    faqItems: [
      { question: "How important is pharmacology on the NCLEX-PN?", answer: "Pharmacological Therapies accounts for 10–16% of the NCLEX-PN. Focus on medication administration, dosage calculations, adverse effects, and drug interactions." },
    ],
    keywords: ["NCLEX-PN pharmacology", "LPN medications", "LVN drug calculations"],
  },
  {
    slug: "nclex-pn-reduction-of-risk",
    name: "Reduction of Risk Potential",
    parentExamSlug: "nclex-pn-exam-blueprint",
    weight: "9–15%",
    description: "Reduction of Risk Potential on the NCLEX-PN tests the practical nurse's ability to monitor for changes in condition, interpret basic diagnostic and lab results, and implement interventions to reduce complications.",
    topicsList: [
      "Changes in client condition recognition",
      "Diagnostic test preparation and monitoring",
      "Lab value interpretation",
      "Potential complications identification",
      "System-specific assessments",
      "Therapeutic procedures (pre/post care)",
      "Vital signs monitoring and interpretation",
    ],
    guideLinks: [{ label: "NCLEX-PN Study Resources", href: "/nclex-pn" }],
    flashcardLinks: [{ label: "Lab Values Flashcards", href: "/flashcards" }],
    previewQuestionLinks: [{ label: "NCLEX-PN Practice Questions", href: "/nclex-pn-practice-questions" }],
    lessonLinks: [{ label: "Lab Values Reference", href: "/lab-values" }],
    faqItems: [
      { question: "What risk reduction topics are on the NCLEX-PN?", answer: "This category covers monitoring for changes, diagnostic tests, lab values, potential complications, and vital signs interpretation." },
    ],
    keywords: ["NCLEX-PN risk reduction", "LPN diagnostic tests", "LVN lab values"],
  },
  {
    slug: "nclex-pn-physiological-adaptation",
    name: "Physiological Adaptation",
    parentExamSlug: "nclex-pn-exam-blueprint",
    weight: "7–13%",
    description: "Physiological Adaptation on the NCLEX-PN tests the practical nurse's ability to provide care for clients with alterations in body systems, manage basic pathophysiology, and respond to medical emergencies within the LPN/LVN scope.",
    topicsList: [
      "Alterations in body systems",
      "Basic pathophysiology concepts",
      "Fluid and electrolyte imbalances",
      "Medical emergencies response",
      "Unexpected response to therapies",
      "Chronic disease management",
    ],
    guideLinks: [{ label: "NCLEX-PN Study Resources", href: "/nclex-pn" }],
    flashcardLinks: [{ label: "Pathophysiology Flashcards", href: "/flashcards" }],
    previewQuestionLinks: [{ label: "NCLEX-PN Practice Questions", href: "/nclex-pn-practice-questions" }],
    lessonLinks: [{ label: "Pathophysiology Lessons", href: "/lessons" }],
    faqItems: [
      { question: "What is Physiological Adaptation on the NCLEX-PN?", answer: "This category tests management of body system alterations, basic pathophysiology, fluid/electrolyte imbalances, and medical emergencies within the LPN/LVN scope." },
    ],
    keywords: ["NCLEX-PN physiological adaptation", "LPN pathophysiology", "LVN emergencies"],
  },
  {
    slug: "allied-respiratory-therapy",
    name: "Respiratory Therapy (RRT/CSRT)",
    parentExamSlug: "allied-health-exam-blueprint",
    weight: "Full exam",
    description: "Respiratory therapy certification exams (NBRC in the US, CSRT in Canada) test competency in ventilator management, airway management, ABG interpretation, pulmonary function testing, pharmacology, and patient assessment across all ages.",
    topicsList: [
      "Ventilator management and weaning protocols",
      "Airway management and intubation",
      "Arterial blood gas (ABG) interpretation",
      "Pulmonary function testing (PFT)",
      "Respiratory pharmacology (bronchodilators, steroids)",
      "Neonatal and pediatric respiratory care",
      "Critical care respiratory interventions",
      "Patient assessment and monitoring",
    ],
    guideLinks: [
      { label: "Respiratory Therapy Resources", href: "/allied-health/rrt" },
    ],
    flashcardLinks: [{ label: "Respiratory Flashcards", href: "/flashcards" }],
    previewQuestionLinks: [{ label: "RRT Practice Questions", href: "/allied-health/rrt" }],
    lessonLinks: [{ label: "Respiratory Lessons", href: "/lessons" }],
    faqItems: [
      { question: "What exams do respiratory therapists take?", answer: "In the US, the NBRC administers the TMC and CSE exams. In Canada, the CSRT oversees certification. Both test ventilator management, airway skills, ABG interpretation, and patient assessment." },
    ],
    keywords: ["respiratory therapy exam", "RRT certification", "CSRT exam", "respiratory therapist study guide"],
  },
  {
    slug: "allied-medical-lab-tech",
    name: "Medical Laboratory Technology (MLT)",
    parentExamSlug: "allied-health-exam-blueprint",
    weight: "Full exam",
    description: "Medical laboratory technology certification exams test competency in hematology, clinical chemistry, microbiology, blood banking/transfusion medicine, urinalysis, immunology, and laboratory safety.",
    topicsList: [
      "Hematology: CBC, differential, coagulation",
      "Clinical chemistry: metabolic panels, enzymes",
      "Microbiology: culture, sensitivity, Gram stain",
      "Blood banking: ABO/Rh typing, crossmatch, transfusion",
      "Urinalysis: physical, chemical, microscopic",
      "Immunology: serology, immunoassays",
      "Laboratory safety and quality assurance",
      "Specimen collection and processing",
    ],
    guideLinks: [{ label: "MLT Resources", href: "/allied-health/mlt" }],
    flashcardLinks: [{ label: "MLT Flashcards", href: "/flashcards" }],
    previewQuestionLinks: [{ label: "MLT Practice Questions", href: "/allied-health/mlt" }],
    lessonLinks: [{ label: "Lab Science Lessons", href: "/lessons" }],
    faqItems: [
      { question: "What is tested on the MLT certification exam?", answer: "MLT exams cover hematology, chemistry, microbiology, blood banking, urinalysis, immunology, and laboratory safety. The emphasis is on clinical application and problem-solving." },
    ],
    keywords: ["MLT certification exam", "medical lab technologist exam", "MLT study guide"],
  },
  {
    slug: "allied-radiography",
    name: "Radiography (ARRT/CAMRT)",
    parentExamSlug: "allied-health-exam-blueprint",
    weight: "Full exam",
    description: "Radiography certification exams (ARRT in the US, CAMRT in Canada) test competency in imaging procedures, patient care, radiation protection, equipment operation, image evaluation, and radiographic positioning.",
    topicsList: [
      "Radiographic positioning and anatomy",
      "Patient care and safety",
      "Radiation protection and safety",
      "Equipment operation and quality control",
      "Image production and evaluation",
      "Radiographic procedures (routine and special)",
      "Image processing and digital imaging",
      "Radiobiology and radiation physics",
    ],
    guideLinks: [
      { label: "Radiography Resources", href: "/medical-imaging" },
      { label: "Imaging Positioning Guide", href: "/radiography-positioning-guide" },
    ],
    flashcardLinks: [{ label: "Radiography Flashcards", href: "/flashcards" }],
    previewQuestionLinks: [{ label: "Radiography Practice Questions", href: "/radiography-practice-questions" }],
    lessonLinks: [{ label: "Imaging Lessons", href: "/medical-imaging/canada/lessons" }],
    faqItems: [
      { question: "What is the ARRT exam?", answer: "The ARRT (American Registry of Radiologic Technologists) exam certifies radiologic technologists in the US. It covers patient care, safety, image production, procedures, and equipment operation." },
    ],
    keywords: ["radiography exam", "ARRT certification", "CAMRT exam", "radiologic technologist study guide"],
  },
  {
    slug: "allied-paramedic",
    name: "Paramedic (NREMT/ACP)",
    parentExamSlug: "allied-health-exam-blueprint",
    weight: "Full exam",
    description: "Paramedic certification exams (NREMT in the US, ACP certification in Canada) test competency in airway management, cardiology, trauma care, medical emergencies, EMS operations, pharmacology, and patient assessment.",
    topicsList: [
      "Airway management and ventilation",
      "Cardiology: ECG interpretation, ACLS algorithms",
      "Trauma assessment and management",
      "Medical emergencies: stroke, MI, DKA, overdose",
      "EMS operations and scene management",
      "Pharmacology for prehospital care",
      "Pediatric and geriatric emergencies",
      "Patient assessment: primary and secondary surveys",
    ],
    guideLinks: [{ label: "Paramedic Resources", href: "/allied-health/paramedic" }],
    flashcardLinks: [{ label: "Paramedic Flashcards", href: "/flashcards" }],
    previewQuestionLinks: [{ label: "Paramedic Practice Questions", href: "/allied-health/paramedic" }],
    lessonLinks: [{ label: "Emergency Medicine Lessons", href: "/lessons" }],
    faqItems: [
      { question: "What is the NREMT paramedic exam?", answer: "The NREMT (National Registry of Emergency Medical Technicians) paramedic exam is a computer-adaptive test covering airway, cardiology, trauma, medical emergencies, and EMS operations." },
    ],
    keywords: ["paramedic certification exam", "NREMT paramedic", "ACP certification", "paramedic study guide"],
  },
  {
    slug: "allied-occupational-therapy",
    name: "Occupational Therapy (NBCOT)",
    parentExamSlug: "allied-health-exam-blueprint",
    weight: "Full exam",
    description: "The NBCOT (National Board for Certification in Occupational Therapy) exam tests competency in evaluation, intervention planning, intervention implementation, and management of occupational therapy services.",
    topicsList: [
      "Evaluation and assessment of client needs",
      "Intervention planning and goal setting",
      "Intervention implementation",
      "Management of OT services",
      "Activity analysis and adaptation",
      "Assistive technology and adaptive equipment",
      "Pediatric and adult occupational therapy",
      "Evidence-based practice in OT",
    ],
    guideLinks: [{ label: "OT Resources", href: "/allied-health/occupational-therapy" }],
    flashcardLinks: [],
    previewQuestionLinks: [{ label: "OT Practice Questions", href: "/allied-health/occupational-therapy" }],
    lessonLinks: [],
    faqItems: [
      { question: "What is the NBCOT exam?", answer: "The NBCOT exam certifies occupational therapists and occupational therapy assistants. It covers evaluation, intervention planning, implementation, and service management." },
    ],
    keywords: ["NBCOT exam", "occupational therapy certification", "OT exam study guide"],
  },
  {
    slug: "allied-social-work",
    name: "Social Work (ASWB)",
    parentExamSlug: "allied-health-exam-blueprint",
    weight: "Full exam",
    description: "The ASWB (Association of Social Work Boards) exam tests competency in human development, assessment and diagnosis, treatment planning, direct and indirect practice, professional relationships, ethics, and supervision.",
    topicsList: [
      "Human development and behavior",
      "Assessment, diagnosis, and treatment planning",
      "Direct practice interventions",
      "Indirect practice: policy, advocacy, community",
      "Professional relationships and boundaries",
      "Ethics and professional standards",
      "Supervision and consultation",
      "Research and evidence-based practice",
    ],
    guideLinks: [{ label: "Social Work Resources", href: "/allied-health/social-work" }],
    flashcardLinks: [],
    previewQuestionLinks: [{ label: "Social Work Practice Questions", href: "/allied-health/social-work" }],
    lessonLinks: [],
    faqItems: [
      { question: "What is the ASWB exam?", answer: "The ASWB exam is used for social work licensure across the US and Canada. There are four exam levels: Bachelors, Masters, Advanced Generalist, and Clinical." },
    ],
    keywords: ["ASWB exam", "social work licensure exam", "social work exam study guide"],
  },
  {
    slug: "allied-pharmacy-tech",
    name: "Pharmacy Technician (PEBC/PTCB)",
    parentExamSlug: "allied-health-exam-blueprint",
    weight: "Full exam",
    description: "Pharmacy technician certification exams (PTCB in the US, PEBC in Canada) test competency in pharmacology, prescription processing, compounding, inventory management, pharmacy law, and medication safety.",
    topicsList: [
      "Pharmacology and drug classifications",
      "Prescription processing and verification",
      "Compounding and sterile preparation",
      "Inventory management and purchasing",
      "Pharmacy law and regulations",
      "Medication safety and error prevention",
      "Patient communication and education",
      "Pharmaceutical calculations",
    ],
    guideLinks: [{ label: "Pharmacy Tech Resources", href: "/allied-health/pharmacy-technician" }],
    flashcardLinks: [{ label: "Pharmacy Flashcards", href: "/flashcards" }],
    previewQuestionLinks: [{ label: "Pharmacy Tech Practice Questions", href: "/allied-health/pharmacy-technician" }],
    lessonLinks: [],
    faqItems: [
      { question: "What is the PTCB exam?", answer: "The PTCB (Pharmacy Technician Certification Board) exam certifies pharmacy technicians in the US. It covers medications, pharmacy law, patient safety, and order processing." },
    ],
    keywords: ["PTCB exam", "pharmacy technician certification", "PEBC pharmacy tech exam"],
  },
  {
    slug: "allied-psychotherapy-addictions",
    name: "Psychotherapy and Addictions Counseling",
    parentExamSlug: "allied-health-exam-blueprint",
    weight: "Full exam",
    description: "Psychotherapy and addictions counseling certification exams test competency in therapeutic modalities, clinical assessment, treatment planning, substance use interventions, crisis management, and ethical practice.",
    topicsList: [
      "Therapeutic modalities (CBT, DBT, MI, psychodynamic)",
      "Clinical assessment and diagnosis",
      "Treatment planning and goal setting",
      "Substance use disorder interventions",
      "Crisis management and safety planning",
      "Ethical practice and professional boundaries",
      "Group therapy facilitation",
      "Cultural competence in counseling",
    ],
    guideLinks: [
      { label: "Psychotherapy Resources", href: "/allied-health/psychotherapy" },
      { label: "Addictions Counseling Resources", href: "/allied-health/addictions" },
    ],
    flashcardLinks: [],
    previewQuestionLinks: [
      { label: "Psychotherapy Practice Questions", href: "/allied-health/psychotherapy" },
      { label: "Addictions Practice Questions", href: "/allied-health/addictions" },
    ],
    lessonLinks: [],
    faqItems: [
      { question: "What certification exams are available for counselors?", answer: "Certifications vary by jurisdiction and specialty. Common exams include the NCE (National Counselor Exam), CRPO qualifying exam (Ontario), and provincial addictions counselor certifications." },
    ],
    keywords: ["psychotherapy certification exam", "addictions counselor exam", "counseling exam study guide"],
  },
];

export function getBlueprintHubBySlug(slug: string): BlueprintHubConfig | undefined {
  return BLUEPRINT_HUBS.find(h => h.slug === slug);
}

export function getBlueprintCategoryBySlug(slug: string): BlueprintCategoryConfig | undefined {
  return BLUEPRINT_CATEGORIES.find(c => c.slug === slug);
}

export function getCategoriesForHub(hubSlug: string): BlueprintCategoryConfig[] {
  return BLUEPRINT_CATEGORIES.filter(c => c.parentExamSlug === hubSlug);
}

export function getParentHub(categorySlug: string): BlueprintHubConfig | undefined {
  const category = getBlueprintCategoryBySlug(categorySlug);
  if (!category) return undefined;
  return getBlueprintHubBySlug(category.parentExamSlug);
}
