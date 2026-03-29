import type { Express } from "express";
import { pool } from "./storage";

interface ProfessionConfig {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  h1: string;
  introText: string;
  examNames: string[];
  routePrefix: string;
  keywords: string[];
  questionSource: "allied" | "mlt" | "imaging" | "exam";
  careerType: string;
  examCareerType?: string;
  freeLimit: number;
  faqs: { q: string; a: string }[];
  relatedLinks: { label: string; href: string }[];
}

const PROFESSION_CONFIGS: Record<string, ProfessionConfig> = {
  "paramedic-practice-questions": {
    slug: "paramedic-practice-questions",
    name: "Paramedic",
    title: "Free Paramedic Practice Questions | EMT & PCP Exam Prep",
    metaDescription: "Practice free paramedic exam questions with detailed explanations. Covers NREMT, COPR, trauma management, cardiac emergencies, and pharmacology for EMT, PCP, and ACP certification.",
    h1: "Free Paramedic Practice Questions",
    introText: "Test your knowledge with these curated paramedic practice questions covering trauma management, cardiac emergencies, airway management, pharmacology, and medical assessment. Each question includes detailed rationales to help you prepare for your NREMT, COPR, or provincial paramedic certification exam.",
    examNames: ["NREMT", "COPR", "PCP", "ACP"],
    routePrefix: "/paramedic",
    keywords: ["paramedic practice questions", "EMT exam questions", "NREMT practice test", "PCP exam prep", "paramedic quiz", "EMS practice questions"],
    questionSource: "allied",
    careerType: "paramedic",
    freeLimit: 10,
    faqs: [
      { q: "What topics are covered on paramedic certification exams?", a: "Paramedic exams cover airway management, trauma assessment, cardiac emergencies (including ECG interpretation), medical emergencies, OB/GYN emergencies, pediatric emergencies, pharmacology, and operations/scene management." },
      { q: "How many questions are on the NREMT paramedic exam?", a: "The NREMT paramedic exam uses computer adaptive testing (CAT) with 80-150 questions. The exam adapts to your ability level and covers all domains of paramedic practice." },
      { q: "What is a passing score for paramedic exams?", a: "The NREMT uses a competency-based passing standard rather than a percentage. You need to demonstrate consistent performance above the passing standard across all content areas. Scoring 70%+ on practice exams generally indicates readiness." },
      { q: "How should I study for the paramedic exam?", a: "Focus on clinical decision-making and patient assessment. Practice 50-75 questions daily, review rationales carefully, and concentrate on your weak areas. Use mock exams to simulate test conditions." },
    ],
    relatedLinks: [
      { label: "Paramedic Question Bank", href: "/paramedic/question-bank" },
      { label: "Paramedic Flashcards", href: "/paramedic/flashcards" },
      { label: "Paramedic Mock Exams", href: "/paramedic/mock-exams" },
      { label: "ECG Interpretation Drill", href: "/paramedic/ecg-drill" },
      { label: "Trauma Simulator", href: "/paramedic/trauma-sim" },
    ],
  },
  "rrt-practice-questions": {
    slug: "rrt-practice-questions",
    name: "Respiratory Therapist",
    title: "Free RRT Practice Questions | NBRC TMC & CSE Exam Prep",
    metaDescription: "Practice free respiratory therapy exam questions with detailed rationales. Covers mechanical ventilation, ABG interpretation, neonatal care, and pulmonary diagnostics for NBRC TMC and CSE certification.",
    h1: "Free Respiratory Therapy Practice Questions",
    introText: "Prepare for your NBRC TMC or CSE certification with these curated respiratory therapy practice questions. Topics include mechanical ventilation, arterial blood gas interpretation, oxygen therapy, pulmonary function testing, neonatal/pediatric respiratory care, and airway management.",
    examNames: ["NBRC TMC", "CSE", "CBRC"],
    routePrefix: "/rrt",
    keywords: ["RRT practice questions", "respiratory therapy exam", "NBRC TMC practice test", "CSE exam prep", "respiratory therapist quiz", "ventilator questions"],
    questionSource: "allied",
    careerType: "rrt",
    examCareerType: "respiratory_therapy",
    freeLimit: 10,
    faqs: [
      { q: "What is the NBRC TMC exam?", a: "The Therapist Multiple-Choice (TMC) examination is administered by the National Board for Respiratory Care. It covers patient data evaluation, troubleshooting, disease management, and equipment operation. The TMC has 160 questions (140 scored) with a 3-hour time limit." },
      { q: "What is the difference between the TMC and CSE?", a: "The TMC is a multiple-choice exam for the CRT credential. A high-cut score on the TMC qualifies you for the Clinical Simulation Exam (CSE), which uses patient management scenarios requiring clinical decision-making for the RRT credential." },
      { q: "What topics are most tested on the TMC?", a: "Key topics include mechanical ventilation (modes, settings, weaning), ABG interpretation, oxygen therapy devices, pulmonary function testing, airway management, and neonatal/pediatric respiratory care." },
      { q: "How should I prepare for the RRT exam?", a: "Study 2-4 hours daily for 6-8 weeks. Focus heavily on ABG interpretation, ventilator management, and clinical decision-making. Complete 50-100 practice questions daily and review all rationales." },
    ],
    relatedLinks: [
      { label: "RRT Question Bank", href: "/rrt/question-bank" },
      { label: "RRT Flashcards", href: "/rrt/flashcards" },
      { label: "RRT Mock Exams", href: "/rrt/mock-exams" },
      { label: "ABG Interpretation Engine", href: "/rrt/abg-engine" },
      { label: "Ventilator Simulator", href: "/rrt/ventilator-sim" },
    ],
  },
  "mlt-practice-questions": {
    slug: "mlt-practice-questions",
    name: "Medical Laboratory Technologist",
    title: "Free MLT Practice Questions | CSMLS & ASCP Exam Prep",
    metaDescription: "Practice free medical laboratory technologist exam questions with detailed explanations. Covers hematology, microbiology, clinical chemistry, blood banking, and urinalysis for CSMLS and ASCP certification.",
    h1: "Free MLT Practice Questions",
    introText: "Test your medical laboratory knowledge with these curated practice questions covering hematology, clinical chemistry, microbiology, blood banking/transfusion medicine, urinalysis, and immunology. Each question includes detailed rationales aligned to CSMLS and ASCP MLS/MLT exam blueprints.",
    examNames: ["CSMLS", "ASCP MLS", "ASCP MLT"],
    routePrefix: "/mlt",
    keywords: ["MLT practice questions", "CSMLS exam prep", "ASCP MLS practice test", "medical lab technologist quiz", "hematology questions", "clinical chemistry exam"],
    questionSource: "mlt",
    careerType: "mlt",
    freeLimit: 10,
    faqs: [
      { q: "What is the CSMLS certification exam?", a: "The Canadian Society for Medical Laboratory Science (CSMLS) administers the certification exam for Medical Laboratory Technologists (MLT) and Medical Laboratory Assistants (MLA) in Canada. It covers all major laboratory disciplines." },
      { q: "What topics are on the ASCP MLS exam?", a: "The ASCP Board of Certification MLS exam covers chemistry, hematology, immunohematology (blood banking), microbiology, immunology, urinalysis/body fluids, laboratory operations, and molecular diagnostics." },
      { q: "How many questions are on MLT certification exams?", a: "The ASCP MLS exam has 100 questions with a 2.5-hour time limit. The CSMLS exam format varies by credential level but typically includes 150-200 multiple-choice questions." },
      { q: "What is the best way to study for MLT exams?", a: "Focus on understanding laboratory principles rather than memorizing facts. Practice with case-based questions, review critical values, and study microscopic identification. Complete 50-75 practice questions daily." },
    ],
    relatedLinks: [
      { label: "MLT Question Bank", href: "/mlt/question-bank" },
      { label: "MLT Flashcards", href: "/mlt/flashcards" },
      { label: "MLT Mock Exams", href: "/mlt/mock-exams" },
      { label: "Order of the Draw", href: "/order-of-the-draw" },
      { label: "Lab Critical Values", href: "/mlt/lab-critical" },
    ],
  },
  "imaging-practice-questions": {
    slug: "imaging-practice-questions",
    name: "Diagnostic Imaging",
    title: "Free Radiography Practice Questions | ARRT & CAMRT Exam Prep",
    metaDescription: "Practice free radiography and medical imaging exam questions with detailed explanations. Covers positioning, radiation safety, image evaluation, and physics for ARRT and CAMRT certification.",
    h1: "Free Radiography & Imaging Practice Questions",
    introText: "Prepare for your ARRT or CAMRT certification with these curated radiography practice questions. Topics include patient positioning, radiation protection and safety, image evaluation, equipment operation, radiographic physics, and clinical procedures across all body systems.",
    examNames: ["ARRT", "CAMRT", "ARDMS"],
    routePrefix: "/imaging",
    keywords: ["radiography practice questions", "ARRT exam prep", "CAMRT practice test", "radiology tech quiz", "imaging exam questions", "radiographic positioning"],
    questionSource: "imaging",
    careerType: "imaging",
    freeLimit: 10,
    faqs: [
      { q: "What is the ARRT certification exam?", a: "The American Registry of Radiologic Technologists (ARRT) administers the certification exam for radiologic technologists. The radiography exam has 200 questions (175 scored) covering radiation protection, equipment operation, image production, procedures, and patient care." },
      { q: "What topics are most important for the ARRT exam?", a: "Focus on patient positioning (largest section), radiation protection principles, image production factors (mAs, kVp, SID), equipment operation, and patient care procedures. Understanding radiographic anatomy is essential." },
      { q: "What is a passing score on the ARRT exam?", a: "The ARRT uses a scaled scoring system. The passing standard is set using psychometric methods and is not a simple percentage. Generally, scoring 75%+ on practice exams indicates readiness." },
      { q: "How is the CAMRT exam different from ARRT?", a: "The CAMRT (Canadian Association of Medical Radiation Technologists) exam tests Canadian-specific content including SI units, Canadian regulations, and provincial scope of practice. The core radiographic principles are similar." },
    ],
    relatedLinks: [
      { label: "Imaging Question Bank", href: "/imaging/question-bank" },
      { label: "Imaging Flashcards", href: "/imaging/flashcards" },
      { label: "Radiography Positioning Guide", href: "/radiography-positioning-guide" },
      { label: "Imaging Practice Exams", href: "/imaging/mock-exams" },
      { label: "Medical Imaging Hub", href: "/medical-imaging" },
    ],
  },
  "cardiac-sonographer-practice-questions": {
    slug: "cardiac-sonographer-practice-questions",
    name: "Cardiac Sonography",
    title: "Free Echocardiography Practice Questions | ARDMS RDCS, CCI RCS & CSCT Exam Prep",
    metaDescription: "Practice free echocardiography exam questions with detailed explanations. Covers cardiac anatomy, hemodynamics, Doppler physics, valve disease, congenital defects, and cardiomyopathies for ARDMS RDCS, CCI RCS, and CSCT certification.",
    h1: "Free Cardiac Sonography Practice Questions",
    introText: "Prepare for your ARDMS RDCS, CCI RCS, or Sonography Canada CSCT cardiac sonography certification with these curated echocardiography practice questions. Topics include cardiac anatomy and physiology, hemodynamic calculations, Doppler ultrasound principles, valvular heart disease assessment, congenital heart defects, and cardiomyopathies.",
    examNames: ["ARDMS RDCS (AE)", "CCI RCS", "CSCT Cardiac Sonography"],
    routePrefix: "/imaging",
    keywords: ["echocardiography practice questions", "RDCS exam prep", "CCI RCS practice test", "cardiac sonography quiz", "echo tech exam questions", "CSCT cardiac exam prep", "hemodynamic calculations", "valve disease grading"],
    questionSource: "imaging",
    careerType: "imaging",
    freeLimit: 10,
    faqs: [
      { q: "What is the ARDMS RDCS exam?", a: "The Registered Diagnostic Cardiac Sonographer (RDCS) exam is offered by ARDMS with Adult Echocardiography (AE) and Pediatric Echocardiography (PE) specialties. The AE exam has 170 questions covering cardiac anatomy, hemodynamics, valve disease, cardiomyopathies, and echo techniques." },
      { q: "What is the CCI RCS exam?", a: "The Registered Cardiac Sonographer (RCS) credential from Cardiovascular Credentialing International is an alternative to the ARDMS RDCS. It tests cardiac imaging competency with similar content domains." },
      { q: "What is the CSCT exam in Canada?", a: "Sonography Canada (formerly CSDMS) offers the CSCT Cardiac Sonography credential for Canadian cardiac sonographers. It tests cardiac anatomy, hemodynamics, pathology, and imaging techniques aligned with Canadian clinical standards." },
      { q: "What hemodynamic calculations are tested most?", a: "The Bernoulli equation (pressure gradient = 4V²), continuity equation (for valve area), cardiac output calculations, dP/dt, PISA method, and E/e' ratio for filling pressures are heavily tested across all echo certification exams." },
    ],
    relatedLinks: [
      { label: "Echo Question Bank", href: "/allied-health/cardiac-sonographer" },
      { label: "Echo Flashcards", href: "/allied-health/cardiac-sonographer/flashcards" },
      { label: "Cardiac Sonographer Career Guide", href: "/allied-health/cardiac-sonographer/career-guide" },
      { label: "Echo Practice Exams", href: "/allied-health/cardiac-sonographer/exams" },
      { label: "Imaging Hub", href: "/medical-imaging" },
    ],
  },
  "social-work-practice-questions": {
    slug: "social-work-practice-questions",
    name: "Social Work",
    title: "Free Social Work Practice Questions | ASWB LCSW Exam Prep",
    metaDescription: "Practice free social work exam questions with detailed explanations. Covers human development, DSM-5 diagnosis, ethics, treatment planning, and clinical interventions for ASWB LCSW and Masters-level licensure.",
    h1: "Free Social Work Practice Questions",
    introText: "Prepare for your ASWB licensure exam with these curated social work practice questions. Topics include human development and behavior, DSM-5 assessment and diagnosis, clinical interventions, professional ethics, diversity and cultural competence, and treatment planning.",
    examNames: ["ASWB Clinical", "ASWB Masters", "LCSW", "LMSW"],
    routePrefix: "/social-worker",
    keywords: ["social work practice questions", "ASWB exam prep", "LCSW practice test", "social work licensure", "DSM-5 questions", "clinical social work exam"],
    questionSource: "allied",
    careerType: "socialWorker",
    freeLimit: 10,
    faqs: [
      { q: "What is the ASWB exam?", a: "The Association of Social Work Boards (ASWB) develops licensing exams for social workers at multiple levels: Bachelors, Masters, Advanced Generalist, and Clinical. Each exam has 170 questions (150 scored) with a 4-hour time limit." },
      { q: "What topics are on the ASWB Clinical exam?", a: "The Clinical exam covers human development/behavior (28%), assessment/diagnosis/treatment planning (24%), psychotherapy/clinical interventions (27%), and professional values/ethics (21%). DSM-5 knowledge is heavily tested." },
      { q: "What is the passing score for the ASWB exam?", a: "The ASWB uses a scaled scoring system from 0-175. The minimum passing score varies by exam level (typically around 99-107 on the scaled score). This is not a simple percentage—it's determined through psychometric analysis." },
      { q: "How should I study for the ASWB exam?", a: "Focus on understanding theoretical frameworks and their clinical applications. Practice applying ethics codes to vignettes. Study DSM-5 diagnostic criteria for common disorders. Complete 50-75 practice questions daily for 6-8 weeks." },
    ],
    relatedLinks: [
      { label: "Social Work Question Bank", href: "/social-worker/question-bank" },
      { label: "Social Work Flashcards", href: "/social-worker/flashcards" },
      { label: "Social Work Mock Exams", href: "/social-worker/mock-exams" },
      { label: "Social Work Lessons", href: "/social-worker/lessons" },
      { label: "Social Work Hub", href: "/social-work" },
    ],
  },
  "psychotherapy-practice-questions": {
    slug: "psychotherapy-practice-questions",
    name: "Psychotherapy",
    title: "Free Psychotherapy Practice Questions | CRPO & NCE Exam Prep",
    metaDescription: "Practice free psychotherapy exam questions with detailed explanations. Covers therapeutic modalities, psychopathology, ethics, assessment, and treatment planning for CRPO, NCE, and CMHCE certification.",
    h1: "Free Psychotherapy Practice Questions",
    introText: "Test your psychotherapy knowledge with these curated practice questions covering therapeutic modalities (CBT, DBT, psychodynamic), psychopathology and DSM-5 diagnosis, professional ethics, clinical assessment, treatment planning, and crisis intervention. Aligned to CRPO, NCE, and CMHCE exam blueprints.",
    examNames: ["CRPO", "NCE", "CMHCE"],
    routePrefix: "/psychotherapist",
    keywords: ["psychotherapy practice questions", "CRPO exam prep", "NCE practice test", "counseling exam questions", "psychotherapist quiz", "CBT DBT questions"],
    questionSource: "allied",
    careerType: "psychotherapist",
    freeLimit: 10,
    faqs: [
      { q: "What is the CRPO registration exam?", a: "The College of Registered Psychotherapists of Ontario (CRPO) registration exam tests entry-level competencies for psychotherapists in Ontario, Canada. It covers safe and effective practice, therapeutic relationships, professional responsibilities, and professional development." },
      { q: "What is the NCE?", a: "The National Counselor Examination (NCE) is administered by the National Board for Certified Counselors (NBCC). It has 200 questions (160 scored) covering human growth, social/cultural foundations, helping relationships, group work, career development, appraisal, research, and professional orientation." },
      { q: "What therapeutic modalities are most tested?", a: "Common modalities tested include Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), psychodynamic/psychoanalytic therapy, person-centered therapy, solution-focused brief therapy, and motivational interviewing." },
      { q: "How do I prepare for psychotherapy licensing exams?", a: "Study theoretical orientations and their clinical applications. Practice applying ethical principles to clinical vignettes. Review DSM-5 criteria for common disorders. Complete practice questions daily and focus on clinical decision-making." },
    ],
    relatedLinks: [
      { label: "Psychotherapy Question Bank", href: "/psychotherapist/question-bank" },
      { label: "Psychotherapy Flashcards", href: "/psychotherapist/flashcards" },
      { label: "Psychotherapy Mock Exams", href: "/psychotherapist/mock-exams" },
      { label: "Psychotherapy Hub", href: "/psychotherapy" },
    ],
  },
  "addictions-practice-questions": {
    slug: "addictions-practice-questions",
    name: "Addictions Counselling",
    title: "Free Addictions Counselling Practice Questions | IC&RC & CASAC Exam Prep",
    metaDescription: "Practice free addictions counselling exam questions with detailed explanations. Covers substance use pharmacology, motivational interviewing, relapse prevention, and ethics for IC&RC ADC, CASAC, and CCAC certification.",
    h1: "Free Addictions Counselling Practice Questions",
    introText: "Prepare for your addictions counselling certification with these curated practice questions covering substance use pharmacology, motivational interviewing techniques, relapse prevention strategies, co-occurring disorders, group facilitation, professional ethics, and evidence-based treatment approaches.",
    examNames: ["IC&RC ADC", "CASAC", "CCAC"],
    routePrefix: "/addictions-counsellor",
    keywords: ["addictions counselling practice questions", "IC&RC ADC exam prep", "CASAC practice test", "substance abuse counselor exam", "addictions certification quiz"],
    questionSource: "allied",
    careerType: "addictionsCounsellor",
    freeLimit: 10,
    faqs: [
      { q: "What is the IC&RC ADC exam?", a: "The International Certification & Reciprocity Consortium (IC&RC) Alcohol and Drug Counselor (ADC) exam tests competencies in screening, intake, orientation, assessment, treatment planning, counseling, case management, crisis intervention, client education, referral, reports, and professional responsibility." },
      { q: "What topics are most tested on addictions certification exams?", a: "Key topics include pharmacology of substances of abuse, stages of change model, motivational interviewing, relapse prevention, co-occurring mental health disorders, group therapy techniques, professional ethics, and evidence-based treatment modalities." },
      { q: "What is the difference between CASAC and ADC?", a: "CASAC (Credentialed Alcoholism and Substance Abuse Counselor) is a New York State credential. ADC (Alcohol and Drug Counselor) is an IC&RC international credential. Both test similar competencies but may have different education and experience requirements." },
      { q: "How should I study for addictions counselling exams?", a: "Focus on understanding the 12 core functions of substance abuse counseling. Study pharmacology of common substances, practice applying motivational interviewing principles, and review ethical decision-making frameworks. Complete 40-60 practice questions daily." },
    ],
    relatedLinks: [
      { label: "Addictions Question Bank", href: "/addictions-counsellor/question-bank" },
      { label: "Addictions Flashcards", href: "/addictions-counsellor/flashcards" },
      { label: "Addictions Mock Exams", href: "/addictions-counsellor/mock-exams" },
      { label: "Addictions Hub", href: "/addictions" },
    ],
  },
  "occupational-therapy-practice-questions": {
    slug: "occupational-therapy-practice-questions",
    name: "Occupational Therapy",
    title: "Free Occupational Therapy Practice Questions | NBCOT OTR Exam Prep",
    metaDescription: "Practice free occupational therapy exam questions with detailed explanations. Covers ADL assessment, pediatric OT, assistive technology, and treatment planning for NBCOT OTR and NOTCE certification.",
    h1: "Free Occupational Therapy Practice Questions",
    introText: "Test your occupational therapy knowledge with these curated practice questions covering ADL/IADL assessment, pediatric occupational therapy, assistive technology, upper extremity rehabilitation, cognitive rehabilitation, treatment planning, and professional ethics. Aligned to NBCOT OTR and NOTCE exam blueprints.",
    examNames: ["NBCOT OTR", "NOTCE", "NBCOT COTA"],
    routePrefix: "/occupational-therapy",
    keywords: ["occupational therapy practice questions", "NBCOT OTR exam prep", "OT practice test", "occupational therapist quiz", "NBCOT review", "OT certification exam"],
    questionSource: "allied",
    careerType: "occupationalTherapist",
    freeLimit: 10,
    faqs: [
      { q: "What is the NBCOT OTR exam?", a: "The National Board for Certification in Occupational Therapy (NBCOT) administers the OTR (Occupational Therapist Registered) exam. It has 200 questions including clinical simulation test items covering evaluation, intervention, management, and competency/practice." },
      { q: "What topics are on the NBCOT exam?", a: "The NBCOT exam covers four domains: Evaluation and Assessment (25%), Analysis and Interpretation (23%), Intervention Management (29%), and Competency and Practice Management (23%). Topics span across physical disabilities, mental health, pediatrics, and geriatrics." },
      { q: "What is the NOTCE?", a: "The National Occupational Therapy Certification Examination (NOTCE) is the Canadian certification exam for occupational therapists, administered by the Canadian Association of Occupational Therapists (CAOT). It tests Canadian-specific scope of practice and regulations." },
      { q: "How should I prepare for the NBCOT exam?", a: "Focus on clinical reasoning and application rather than memorization. Study across all practice settings (physical rehab, pediatrics, mental health, geriatrics). Complete 50-75 practice questions daily for 8-12 weeks. Pay special attention to clinical simulation items." },
    ],
    relatedLinks: [
      { label: "OT Question Bank", href: "/occupational-therapy/question-bank" },
      { label: "OT Flashcards", href: "/occupational-therapy/flashcards" },
      { label: "OT Mock Exams", href: "/occupational-therapy/mock-exams" },
      { label: "Occupational Therapy Hub", href: "/occupational-therapy" },
    ],
  },
};

function mapAlliedRow(row: any, fallbackName: string) {
  return {
    id: row.id,
    stem: row.stem,
    options: typeof row.options === "string" ? JSON.parse(row.options) : (row.options || []),
    correctAnswer: Array.isArray(row.correct_answer) ? row.correct_answer : [String(row.correct_answer)],
    rationale: row.rationale_long || "",
    topic: row.blueprint_category || fallbackName,
    bodySystem: row.subtopic || row.blueprint_category || "",
    difficulty: row.difficulty || 3,
    questionType: row.question_type || "MCQ_SINGLE",
    clinicalPearl: Array.isArray(row.clinical_pearls) ? row.clinical_pearls[0] : (typeof row.clinical_pearls === "string" ? row.clinical_pearls : null),
    distractorRationales: row.distractor_rationales,
  };
}

function mapExamRow(row: any, fallbackName: string) {
  return {
    id: row.id,
    stem: row.stem,
    options: typeof row.options === "string" ? JSON.parse(row.options) : (row.options || []),
    correctAnswer: Array.isArray(row.correct_answer) ? row.correct_answer : [String(row.correct_answer)],
    rationale: row.rationale || "",
    topic: row.topic || row.body_system || fallbackName,
    bodySystem: row.body_system || row.topic || "",
    difficulty: row.difficulty || 3,
    questionType: row.question_type || "MCQ_SINGLE",
    clinicalPearl: row.clinical_pearl || null,
    distractorRationales: null,
  };
}

async function fetchQuestionsForProfession(config: ProfessionConfig, limit: number = 20): Promise<any[]> {
  try {
    let result;

    switch (config.questionSource) {
      case "allied":
        result = await pool.query(
          `SELECT id, stem, options, correct_answer, rationale_long, blueprint_category, subtopic, difficulty, cognitive_level, question_type, clinical_pearls, distractor_rationales
           FROM allied_questions
           WHERE career_type = $1 AND status IN ('approved', 'published')
           ORDER BY RANDOM()
           LIMIT $2`,
          [config.careerType, limit]
        );
        if (result.rows.length > 0) {
          return result.rows.map((row: any) => mapAlliedRow(row, config.name));
        }
        if (config.examCareerType) {
          result = await pool.query(
            `SELECT id, stem, options, correct_answer, rationale, topic, body_system, difficulty, question_type, clinical_pearl
             FROM exam_questions
             WHERE career_type = $1 AND status = 'published'
             ORDER BY RANDOM()
             LIMIT $2`,
            [config.examCareerType, limit]
          );
          return result.rows.map((row: any) => mapExamRow(row, config.name));
        }
        return [];

      case "mlt":
        result = await pool.query(
          `SELECT id, stem, options, correct_answer, rationale_long, blueprint_category, subtopic, difficulty, cognitive_level, question_type, clinical_pearls, distractor_rationales
           FROM allied_questions
           WHERE career_type = 'mlt' AND status IN ('approved', 'published')
           ORDER BY RANDOM()
           LIMIT $1`,
          [limit]
        );
        return result.rows.map((row: any) => ({
          id: row.id,
          stem: row.stem,
          options: typeof row.options === "string" ? JSON.parse(row.options) : (row.options || []),
          correctAnswer: Array.isArray(row.correct_answer) ? row.correct_answer : [String(row.correct_answer)],
          rationale: row.rationale_long || "",
          topic: row.blueprint_category || "Medical Laboratory",
          bodySystem: row.subtopic || row.blueprint_category || "",
          difficulty: row.difficulty || 3,
          questionType: row.question_type || "MCQ_SINGLE",
          clinicalPearl: Array.isArray(row.clinical_pearls) ? row.clinical_pearls[0] : null,
          distractorRationales: row.distractor_rationales,
        }));

      case "imaging":
        result = await pool.query(
          `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer, rationale, category, body_part, modality, difficulty
           FROM imaging_questions
           ORDER BY RANDOM()
           LIMIT $1`,
          [limit]
        );
        return result.rows.map((row: any) => {
          const optLabels = ["A", "B", "C", "D"];
          const opts = [row.option_a, row.option_b, row.option_c, row.option_d].map((text: string, i: number) => ({
            label: optLabels[i],
            text: text || "",
          }));
          return {
            id: row.id,
            stem: row.question || "",
            options: opts,
            correctAnswer: [String(row.correct_answer || "A")],
            rationale: row.rationale || "",
            topic: row.category || "Diagnostic Imaging",
            bodySystem: row.body_part || row.modality || "",
            difficulty: row.difficulty || 3,
            questionType: "MCQ_SINGLE",
            clinicalPearl: null,
            distractorRationales: null,
          };
        });

      default:
        return [];
    }
  } catch (e: any) {
    console.error(`Error fetching questions for ${config.name}:`, e.message);
    return [];
  }
}

function generateStructuredData(config: ProfessionConfig, questionCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: config.h1,
    description: config.metaDescription,
    educationalLevel: "Professional Certification",
    about: {
      "@type": "Thing",
      name: config.name,
    },
    numberOfQuestions: questionCount,
    provider: {
      "@type": "Organization",
      name: "NurseNest",
      url: "https://www.nursenest.ca",
    },
  };
}

export function registerProfessionPracticeQuestionsRoutes(app: Express) {
  app.get("/api/profession-practice-questions/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const config = PROFESSION_CONFIGS[slug];

      if (!config) {
        return res.status(404).json({ error: "Profession practice page not found" });
      }

      const questions = await fetchQuestionsForProfession(config, 20);

      const freeQuestions = questions.slice(0, config.freeLimit).map((q) => ({
        ...q,
        locked: false,
      }));
      const lockedQuestions = questions.slice(config.freeLimit).map((q) => ({
        id: q.id,
        stem: "",
        options: [],
        correctAnswer: [],
        rationale: "",
        topic: q.topic,
        bodySystem: q.bodySystem,
        difficulty: q.difficulty,
        questionType: q.questionType,
        clinicalPearl: null,
        locked: true,
      }));

      const allQuestions = [...freeQuestions, ...lockedQuestions];

      let totalQuestions = questions.length;
      try {
        let countResult;
        if (config.questionSource === "allied" || config.questionSource === "mlt") {
          countResult = await pool.query(
            `SELECT COUNT(*)::int AS count FROM allied_questions WHERE career_type = $1 AND status IN ('approved', 'published')`,
            [config.careerType]
          );
          if (countResult.rows[0]?.count === 0 && config.examCareerType) {
            countResult = await pool.query(
              `SELECT COUNT(*)::int AS count FROM exam_questions WHERE career_type = $1 AND status = 'published'`,
              [config.examCareerType]
            );
          }
        } else if (config.questionSource === "imaging") {
          countResult = await pool.query(
            `SELECT COUNT(*)::int AS count FROM imaging_questions`
          );
        }
        if (countResult && countResult.rows[0]) {
          totalQuestions = countResult.rows[0].count;
        }
      } catch {}

      const otherProfessions = Object.values(PROFESSION_CONFIGS)
        .filter((p) => p.slug !== slug)
        .map((p) => ({
          slug: p.slug,
          title: p.name + " Practice Questions",
          questionCount: 0,
        }));

      res.json({
        page: {
          slug: config.slug,
          title: config.title,
          metaDescription: config.metaDescription,
          h1: config.h1,
          introText: config.introText,
          examNames: config.examNames,
          routePrefix: config.routePrefix,
          keywords: config.keywords,
          structuredData: generateStructuredData(config, totalQuestions),
        },
        questions: allQuestions,
        totalQuestions,
        freeLimit: config.freeLimit,
        faqs: config.faqs,
        relatedLinks: config.relatedLinks,
        otherProfessions,
      });
    } catch (e: any) {
      console.error("Profession practice questions error:", e.message);
      res.status(500).json({ error: "Failed to load practice questions" });
    }
  });

  app.get("/api/profession-practice-questions", (_req, res) => {
    const pages = Object.values(PROFESSION_CONFIGS).map((config) => ({
      slug: config.slug,
      name: config.name,
      title: config.title,
      routePrefix: config.routePrefix,
    }));
    res.json({ pages });
  });
}
