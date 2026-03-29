export interface SalaryRange {
  entry: string;
  mid: string;
  senior: string;
  source: string;
}

export interface EducationRequirement {
  level: string;
  duration: string;
  description: string;
}

export interface CareerStep {
  title: string;
  description: string;
  yearsExperience: string;
}

export interface LicensingInfo {
  body: string;
  country: string;
  requirements: string[];
}

export interface ProfessionAuthorityData {
  slug: string;
  canonicalPath: string;
  heroTitle: string;
  heroSubtitle: string;
  overview: string;
  color: string;
  colorAccent: string;
  colorGradientFrom: string;
  colorGradientTo: string;
  icon: string;
  salaryCanada: SalaryRange;
  salaryUSA: SalaryRange;
  education: EducationRequirement[];
  careerPathway: CareerStep[];
  licensing: LicensingInfo[];
  examInfo: { name: string; format: string; passingScore: string; duration: string }[];
  keySkills: string[];
  workSettings: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  flashcardsHref: string;
}

export const PROFESSION_AUTHORITY_DATA: Record<string, ProfessionAuthorityData> = {
  nursing: {
    slug: "nursing",
    canonicalPath: "/nursing",
    heroTitle: "Nursing Career & Exam Prep Guide",
    heroSubtitle: "Everything you need to know about becoming a nurse — education, licensing, career pathways, salary expectations, and exam preparation resources.",
    overview: "Nursing is one of the most in-demand healthcare professions worldwide. Registered Nurses (RNs), Registered Practical Nurses (RPNs/LPNs), and Nurse Practitioners (NPs) provide direct patient care across hospitals, clinics, long-term care facilities, and community settings. The profession offers diverse specialization opportunities, competitive salaries, and strong job security with projected growth of 6% through 2032.",
    color: "#3B82F6",
    colorAccent: "#DBEAFE",
    colorGradientFrom: "from-blue-50",
    colorGradientTo: "to-indigo-50/50",
    icon: "🩺",
    salaryCanada: { entry: "$55,000 – $65,000", mid: "$70,000 – $90,000", senior: "$95,000 – $120,000+", source: "Canadian Institute for Health Information (CIHI), 2024" },
    salaryUSA: { entry: "$60,000 – $70,000", mid: "$77,000 – $95,000", senior: "$100,000 – $130,000+", source: "U.S. Bureau of Labor Statistics, 2024" },
    education: [
      { level: "Practical Nursing Diploma", duration: "2 years", description: "College diploma program preparing graduates for RPN/LPN licensure. Covers foundational nursing skills, pharmacology, and clinical placements." },
      { level: "Bachelor of Science in Nursing (BScN/BSN)", duration: "4 years", description: "University degree required for RN licensure in most jurisdictions. Includes advanced pathophysiology, research methods, leadership, and extensive clinical rotations." },
      { level: "Master of Nursing / Nurse Practitioner", duration: "2–3 years (post-BScN)", description: "Graduate-level education for advanced practice roles. NP programs include advanced health assessment, pharmacology, and supervised clinical practice." },
    ],
    careerPathway: [
      { title: "Student Nurse", description: "Complete nursing education program with clinical placements in various healthcare settings.", yearsExperience: "0" },
      { title: "New Graduate Nurse", description: "Pass licensing exam (NCLEX-RN/REx-PN) and begin practice under supervision with a transition-to-practice program.", yearsExperience: "0–1" },
      { title: "Staff Nurse", description: "Develop clinical expertise in a specialty area. Build assessment, medication administration, and patient education skills.", yearsExperience: "1–3" },
      { title: "Senior / Charge Nurse", description: "Take on leadership responsibilities including shift coordination, mentoring students, and quality improvement projects.", yearsExperience: "3–7" },
      { title: "Clinical Nurse Specialist / Educator", description: "Advance into education, research, or clinical specialization roles. May pursue specialty certifications.", yearsExperience: "5–10" },
      { title: "Nurse Practitioner / Manager", description: "Provide autonomous primary care (NP) or lead nursing units. Prescribe medications, diagnose conditions, and manage teams.", yearsExperience: "7+" },
    ],
    licensing: [
      { body: "NCSBN", country: "USA", requirements: ["Graduate from accredited nursing program", "Pass NCLEX-RN or NCLEX-PN exam", "Meet state Board of Nursing requirements", "Complete background check", "Maintain continuing education credits"] },
      { body: "CNO / Provincial College", country: "Canada", requirements: ["Graduate from approved nursing program", "Pass NCLEX-RN (RN) or REx-PN (RPN)", "Register with provincial nursing regulatory body", "Complete jurisprudence exam (Ontario)", "Maintain annual registration and continuing competence"] },
    ],
    examInfo: [
      { name: "NCLEX-RN", format: "Computer Adaptive Test (CAT), 85–150 questions", passingScore: "Pass/Fail (logit-based passing standard)", duration: "Up to 5 hours" },
      { name: "REx-PN", format: "Computer Adaptive Test (CAT), 150 questions (Canada)", passingScore: "Pass/Fail", duration: "4 hours" },
      { name: "NP Certification", format: "Multiple-choice, scenario-based", passingScore: "Varies by certifying body", duration: "3–4 hours" },
    ],
    keySkills: ["Patient assessment", "Clinical decision-making", "Medication administration", "Therapeutic communication", "Critical thinking", "Evidence-based practice", "Team collaboration", "Patient education"],
    workSettings: ["Hospitals", "Long-term care", "Community health centres", "Home care", "Public health", "Occupational health", "Telehealth", "Military/forensic nursing"],
    seoTitle: "Nursing Career Guide — Education, Licensing, Salary & Exam Prep | NurseNest",
    seoDescription: "Complete guide to nursing careers in Canada and the USA. Learn about education requirements, NCLEX/REx-PN licensing, salary ranges ($55K–$130K+), career pathways, and exam prep resources.",
    seoKeywords: "nursing career, NCLEX-RN, REx-PN, nursing salary, nursing education, RN career path, nurse practitioner, nursing exam prep, nursing license requirements",
    ctaPrimary: { label: "Start Free Diagnostic", href: "/mock-exams" },
    ctaSecondary: { label: "Browse Lessons", href: "/lessons" },
    flashcardsHref: "/flashcards",
  },

  paramedic: {
    slug: "paramedic",
    canonicalPath: "/paramedic",
    heroTitle: "Paramedic Career & Exam Prep Guide",
    heroSubtitle: "Your complete guide to becoming a paramedic — from education and certification to salary expectations and career advancement.",
    overview: "Paramedics are frontline emergency medical professionals who provide critical pre-hospital care. Working in ambulances, air medical services, and emergency departments, paramedics assess, treat, and transport patients during medical emergencies. The profession demands rapid decision-making, advanced clinical skills, and composure under pressure. With growing demand and diverse career paths, paramedicine offers a rewarding career with opportunities to specialize in critical care, flight medicine, and community paramedicine.",
    color: "#7C3AED",
    colorAccent: "#EDE9FE",
    colorGradientFrom: "from-purple-50",
    colorGradientTo: "to-violet-50/50",
    icon: "🚑",
    salaryCanada: { entry: "$50,000 – $60,000", mid: "$65,000 – $85,000", senior: "$90,000 – $110,000+", source: "Paramedic Association of Canada, 2024" },
    salaryUSA: { entry: "$36,000 – $45,000", mid: "$49,000 – $65,000", senior: "$70,000 – $95,000+", source: "U.S. Bureau of Labor Statistics, 2024" },
    education: [
      { level: "EMT-Basic Certificate", duration: "3–6 months", description: "Entry-level training covering basic life support, patient assessment, and emergency response. Required for EMT certification in the US." },
      { level: "Primary Care Paramedic (PCP) Diploma", duration: "1–2 years", description: "College diploma program covering BLS, pharmacology, trauma management, and clinical placements. Standard entry level in Canada." },
      { level: "Advanced Care Paramedic (ACP) Degree", duration: "2–4 years", description: "Advanced education including ACLS, PALS, 12-lead ECG interpretation, advanced pharmacology, and critical care transport." },
    ],
    careerPathway: [
      { title: "Student Paramedic / EMT Student", description: "Complete paramedic education program with field and hospital clinical placements.", yearsExperience: "0" },
      { title: "Primary Care Paramedic / EMT", description: "Obtain PCP or NREMT certification. Begin responding to 911 calls and providing pre-hospital care.", yearsExperience: "0–2" },
      { title: "Experienced PCP / Paramedic", description: "Build proficiency in clinical assessment, multi-patient scenarios, and specialized environments.", yearsExperience: "2–5" },
      { title: "Advanced Care Paramedic", description: "Upgrade to ACP scope with advanced airway management, IV therapy, cardiac monitoring, and drug administration.", yearsExperience: "3–7" },
      { title: "Critical Care / Flight Paramedic", description: "Specialize in inter-facility transport, rotor or fixed-wing air medical, and ICU-level interventions.", yearsExperience: "5–10" },
      { title: "Supervisor / Educator / Community Paramedic", description: "Move into leadership, education, or community paramedicine roles focused on preventive care.", yearsExperience: "7+" },
    ],
    licensing: [
      { body: "NREMT", country: "USA", requirements: ["Graduate from accredited paramedic program", "Pass NREMT cognitive and psychomotor exams", "Obtain state EMS license", "Maintain NREMT recertification every 2 years", "Complete continuing education hours"] },
      { body: "Provincial EMS Regulator", country: "Canada", requirements: ["Graduate from approved paramedic program", "Pass COPR or provincial licensing exam", "Register with provincial EMS regulatory authority", "Maintain CPR, ACLS, PALS certifications", "Complete continuing education requirements"] },
    ],
    examInfo: [
      { name: "NREMT Paramedic", format: "Computer Adaptive Test (CAT), 80–150 questions", passingScore: "Pass/Fail (competency-based)", duration: "2.5 hours" },
      { name: "COPR (Canada)", format: "Multiple-choice, scenario-based", passingScore: "Pass/Fail", duration: "3 hours" },
      { name: "Provincial PCP/ACP Exams", format: "Written and practical components", passingScore: "Varies by province", duration: "Varies" },
    ],
    keySkills: ["Patient assessment", "Airway management", "Cardiac monitoring", "Trauma care", "Pharmacology", "ACLS/PALS protocols", "Clinical decision-making", "Scene management"],
    workSettings: ["Ambulance services", "Fire departments", "Air medical transport", "Emergency departments", "Industrial/remote medicine", "Community paramedicine", "Event medical services", "Military EMS"],
    seoTitle: "Paramedic Career Guide — PCP, ACP & NREMT Exam Prep | NurseNest",
    seoDescription: "Complete guide to paramedic careers. Education requirements, PCP/ACP/NREMT certification, salary ranges ($36K–$110K+), career pathways, and exam preparation resources.",
    seoKeywords: "paramedic career, NREMT exam, PCP paramedic, ACP paramedic, paramedic salary, paramedic education, EMS career, paramedic certification",
    ctaPrimary: { label: "Start Free Diagnostic", href: "/paramedic/mock-exams" },
    ctaSecondary: { label: "Explore Study Tools", href: "/paramedic/question-bank" },
    flashcardsHref: "/paramedic/flashcards",
  },

  "respiratory-therapy": {
    slug: "respiratory-therapy",
    canonicalPath: "/respiratory-therapy",
    heroTitle: "Respiratory Therapy Career & Exam Prep Guide",
    heroSubtitle: "Everything you need to know about becoming a Registered Respiratory Therapist — education, licensing, salary, and exam preparation.",
    overview: "Respiratory Therapists (RRTs) are specialized healthcare professionals who assess, treat, and manage patients with cardiopulmonary disorders. They operate life-support equipment including mechanical ventilators, administer aerosolized medications, perform arterial blood gas analysis, and manage oxygen therapy. RRTs play a critical role in ICUs, emergency departments, neonatal units, and pulmonary rehabilitation programs. Demand for respiratory therapists has surged, with the profession projected to grow 13% through 2032.",
    color: "#2196F3",
    colorAccent: "#E3F2FD",
    colorGradientFrom: "from-sky-50",
    colorGradientTo: "to-blue-50/50",
    icon: "🌬️",
    salaryCanada: { entry: "$55,000 – $65,000", mid: "$70,000 – $85,000", senior: "$90,000 – $110,000+", source: "Canadian Society of Respiratory Therapists, 2024" },
    salaryUSA: { entry: "$55,000 – $62,000", mid: "$62,000 – $75,000", senior: "$80,000 – $100,000+", source: "U.S. Bureau of Labor Statistics, 2024" },
    education: [
      { level: "Associate Degree in Respiratory Therapy", duration: "2 years", description: "Minimum education for entry-level practice in the US. Covers respiratory anatomy, ventilator management, and clinical rotations." },
      { level: "Bachelor of Science in Respiratory Therapy", duration: "4 years", description: "Preferred degree for advanced roles. Includes research methods, leadership, advanced critical care, and neonatal respiratory care." },
      { level: "Advanced Diploma (Canada)", duration: "3 years", description: "College diploma program accredited by CoARC or provincial regulator. Prepares graduates for CBRC or NBRC certification exams." },
    ],
    careerPathway: [
      { title: "Student Respiratory Therapist", description: "Complete respiratory therapy education with clinical rotations in ICU, NICU, emergency, and general medicine.", yearsExperience: "0" },
      { title: "Entry-Level RRT", description: "Pass TMC exam and begin practice. Provide oxygen therapy, nebulizer treatments, and assist with ventilator management.", yearsExperience: "0–2" },
      { title: "Staff Respiratory Therapist", description: "Develop expertise in mechanical ventilation, ABG interpretation, pulmonary function testing, and airway management.", yearsExperience: "2–5" },
      { title: "Senior / Critical Care RRT", description: "Specialize in ICU, NICU, or ECMO support. Lead ventilator management protocols and mentor junior staff.", yearsExperience: "5–8" },
      { title: "Clinical Specialist / Educator", description: "Advance into clinical education, quality improvement, or respiratory care research roles.", yearsExperience: "7–12" },
      { title: "Director of Respiratory Care", description: "Lead respiratory departments, manage budgets, develop policies, and oversee staff across multiple units.", yearsExperience: "10+" },
    ],
    licensing: [
      { body: "NBRC", country: "USA", requirements: ["Graduate from CoARC-accredited program", "Pass TMC (Therapist Multiple-Choice) exam", "Pass Clinical Simulation Exam (CSE) for RRT credential", "Obtain state license", "Maintain continuing education"] },
      { body: "CBRC / Provincial Regulator", country: "Canada", requirements: ["Graduate from accredited respiratory therapy program", "Pass CBRC national exam", "Register with provincial regulatory college", "Maintain CPR and ACLS certifications", "Complete annual continuing competency requirements"] },
    ],
    examInfo: [
      { name: "NBRC TMC", format: "160 multiple-choice questions (scored: 140)", passingScore: "Low Cut Score (CRT) and High Cut Score (RRT)", duration: "3 hours" },
      { name: "NBRC CSE", format: "Clinical simulation scenarios (22 problems)", passingScore: "Pass/Fail", duration: "4 hours" },
      { name: "CBRC (Canada)", format: "Multiple-choice, scenario-based", passingScore: "Pass/Fail", duration: "3 hours" },
    ],
    keySkills: ["Mechanical ventilation", "ABG interpretation", "Airway management", "Oxygen therapy", "PFT administration", "Neonatal respiratory care", "Patient assessment", "ECMO support"],
    workSettings: ["Intensive care units", "Emergency departments", "Neonatal ICUs", "Pulmonary rehab", "Sleep labs", "Home care", "Operating rooms", "Long-term acute care"],
    seoTitle: "Respiratory Therapy Career Guide — RRT Exam Prep, Salary & Education | NurseNest",
    seoDescription: "Complete guide to respiratory therapy careers. Education requirements, NBRC/CBRC certification, salary ranges ($55K–$110K+), career pathways, and exam preparation resources.",
    seoKeywords: "respiratory therapist career, RRT exam, NBRC TMC, CBRC exam, respiratory therapy salary, respiratory therapy education, RRT certification, respiratory care",
    ctaPrimary: { label: "Start Free Diagnostic", href: "/rrt/mock-exams" },
    ctaSecondary: { label: "Explore Study Tools", href: "/rrt/question-bank" },
    flashcardsHref: "/rrt/flashcards",
  },

  mlt: {
    slug: "mlt",
    canonicalPath: "/mlt",
    heroTitle: "Medical Laboratory Technologist Career & Exam Prep Guide",
    heroSubtitle: "Your complete guide to becoming an MLT — education, CSMLS/ASCP certification, salary expectations, and career advancement.",
    overview: "Medical Laboratory Technologists (MLTs) are essential healthcare professionals who perform diagnostic testing on blood, tissue, and body fluids to help physicians diagnose and treat diseases. Working behind the scenes, MLTs operate sophisticated laboratory equipment, analyze specimens, and ensure quality control across disciplines including hematology, clinical chemistry, microbiology, and blood banking. The profession offers stable employment, diverse specialization opportunities, and the satisfaction of directly impacting patient care through accurate diagnostic results.",
    color: "#9C27B0",
    colorAccent: "#F3E5F5",
    colorGradientFrom: "from-purple-50",
    colorGradientTo: "to-fuchsia-50/50",
    icon: "🔬",
    salaryCanada: { entry: "$50,000 – $60,000", mid: "$65,000 – $80,000", senior: "$85,000 – $100,000+", source: "CSMLS Compensation Survey, 2024" },
    salaryUSA: { entry: "$48,000 – $56,000", mid: "$57,000 – $72,000", senior: "$75,000 – $95,000+", source: "U.S. Bureau of Labor Statistics, 2024" },
    education: [
      { level: "Associate Degree (MLT - USA)", duration: "2 years", description: "Minimum for MLT certification through ASCP. Covers foundational laboratory skills across all major disciplines." },
      { level: "Bachelor of Science (MLS/MLT - Canada)", duration: "3–4 years", description: "Required for MLT certification through CSMLS. Includes advanced training in all 16 laboratory disciplines with clinical internship." },
      { level: "Master's / Specialist Certification", duration: "1–2 years (post-bachelor)", description: "Advanced study in specific disciplines like molecular diagnostics, cytogenetics, or laboratory management." },
    ],
    careerPathway: [
      { title: "Student MLT", description: "Complete MLT education program with laboratory clinical rotations across all disciplines.", yearsExperience: "0" },
      { title: "Entry-Level MLT", description: "Pass CSMLS or ASCP certification exam. Begin performing diagnostic testing under supervision.", yearsExperience: "0–2" },
      { title: "General MLT", description: "Develop competency across multiple laboratory departments. Work independently with quality assurance responsibilities.", yearsExperience: "2–5" },
      { title: "Specialized MLT", description: "Focus on a specific discipline such as microbiology, blood banking, or molecular diagnostics.", yearsExperience: "4–8" },
      { title: "Senior Technologist / Team Lead", description: "Mentor junior staff, validate complex results, and oversee quality control programs.", yearsExperience: "6–10" },
      { title: "Laboratory Manager / Director", description: "Oversee laboratory operations, manage budgets, ensure accreditation compliance, and lead quality improvement initiatives.", yearsExperience: "10+" },
    ],
    licensing: [
      { body: "ASCP Board of Certification", country: "USA", requirements: ["Graduate from NAACLS-accredited MLS/MLT program", "Pass ASCP BOC certification exam", "Maintain certification through continuing education", "Some states require additional state licensure"] },
      { body: "CSMLS", country: "Canada", requirements: ["Graduate from accredited MLT program", "Pass CSMLS national certification exam", "Register with provincial regulatory college (where applicable)", "Maintain continuing professional development"] },
    ],
    examInfo: [
      { name: "ASCP BOC MLS/MLT", format: "100 multiple-choice questions", passingScore: "400/999 scaled score", duration: "2.5 hours" },
      { name: "CSMLS MLT (Canada)", format: "120 multiple-choice questions", passingScore: "65% (approximately)", duration: "3 hours" },
    ],
    keySkills: ["Specimen analysis", "Quality control", "Microscopy", "Instrument operation", "Result interpretation", "Infection control", "Critical value recognition", "Laboratory safety"],
    workSettings: ["Hospital laboratories", "Reference laboratories", "Public health labs", "Research facilities", "Blood banks", "Veterinary labs", "Forensic labs", "Industry/pharma"],
    seoTitle: "MLT Career Guide — CSMLS & ASCP Exam Prep, Salary & Education | NurseNest",
    seoDescription: "Complete guide to medical laboratory technologist careers. Education requirements, CSMLS/ASCP certification, salary ranges ($48K–$100K+), career pathways, and exam prep.",
    seoKeywords: "MLT career, medical laboratory technologist, CSMLS exam, ASCP certification, MLT salary, medical lab tech education, lab technologist career path",
    ctaPrimary: { label: "Start Free Diagnostic", href: "/mlt/mock-exams" },
    ctaSecondary: { label: "Explore Study Tools", href: "/mlt/question-bank" },
    flashcardsHref: "/mlt/flashcards",
  },

  imaging: {
    slug: "imaging",
    canonicalPath: "/imaging",
    heroTitle: "Medical Imaging & Radiography Career Guide",
    heroSubtitle: "Your complete guide to a career in diagnostic imaging — education, CAMRT/ARRT certification, salary, and exam preparation.",
    overview: "Medical Imaging Technologists (also called Radiologic Technologists or Radiographers) produce diagnostic images using X-rays, CT, MRI, ultrasound, and other modalities. They position patients, operate imaging equipment, ensure radiation safety, and work closely with radiologists and physicians. The profession combines technical expertise with patient care skills, offering diverse specialization paths in computed tomography, magnetic resonance imaging, mammography, interventional radiology, and nuclear medicine.",
    color: "#FF9800",
    colorAccent: "#FFF3E0",
    colorGradientFrom: "from-amber-50",
    colorGradientTo: "to-orange-50/50",
    icon: "📡",
    salaryCanada: { entry: "$52,000 – $62,000", mid: "$65,000 – $82,000", senior: "$85,000 – $105,000+", source: "CAMRT Compensation Report, 2024" },
    salaryUSA: { entry: "$55,000 – $63,000", mid: "$65,000 – $80,000", senior: "$85,000 – $100,000+", source: "U.S. Bureau of Labor Statistics, 2024" },
    education: [
      { level: "Associate Degree in Radiologic Technology", duration: "2 years", description: "Minimum for ARRT certification in the US. Covers radiographic positioning, image production, radiation safety, and patient care." },
      { level: "Bachelor of Science in Medical Imaging", duration: "3–4 years", description: "Required for CAMRT certification in Canada. Includes advanced imaging physics, cross-sectional anatomy, and clinical rotations." },
      { level: "Post-Graduate Certificate / Specialty", duration: "1–2 years", description: "Advanced training in CT, MRI, mammography, or sonography for specialty certification." },
    ],
    careerPathway: [
      { title: "Student Radiographer", description: "Complete imaging education with clinical rotations across modalities.", yearsExperience: "0" },
      { title: "Junior Radiographer", description: "Pass CAMRT or ARRT certification. Begin performing general radiographic examinations.", yearsExperience: "0–2" },
      { title: "Staff Radiographer", description: "Develop proficiency in general radiography, fluoroscopy, and portable imaging.", yearsExperience: "2–5" },
      { title: "Specialist Technologist", description: "Specialize in CT, MRI, mammography, interventional, or nuclear medicine imaging.", yearsExperience: "3–7" },
      { title: "Senior / Lead Technologist", description: "Oversee imaging quality, mentor students, and manage department workflows.", yearsExperience: "5–10" },
      { title: "Imaging Manager / Educator", description: "Lead imaging departments, teach in academic programs, or move into clinical applications specialist roles.", yearsExperience: "8+" },
    ],
    licensing: [
      { body: "ARRT", country: "USA", requirements: ["Graduate from JRCERT-accredited radiography program", "Pass ARRT certification exam", "Maintain ARRT registration with continuing education", "Comply with state licensing requirements"] },
      { body: "CAMRT", country: "Canada", requirements: ["Graduate from accredited medical radiation technology program", "Pass CAMRT national certification exam", "Register with provincial regulatory body", "Maintain continuing professional development"] },
    ],
    examInfo: [
      { name: "ARRT Radiography", format: "200 multiple-choice questions (scored: 175)", passingScore: "75 scaled score (approximate)", duration: "3.5 hours" },
      { name: "CAMRT Certification (Canada)", format: "200 multiple-choice questions", passingScore: "Pass/Fail", duration: "3.5 hours" },
    ],
    keySkills: ["Radiographic positioning", "Radiation safety", "Image evaluation", "Patient care", "Anatomy knowledge", "Equipment operation", "Cross-sectional imaging", "Quality assurance"],
    workSettings: ["Hospitals", "Outpatient imaging centres", "Emergency departments", "Orthopedic clinics", "Mobile imaging units", "Interventional suites", "Research facilities", "Equipment vendor support"],
    seoTitle: "Medical Imaging Career Guide — CAMRT & ARRT Exam Prep | NurseNest",
    seoDescription: "Complete guide to medical imaging and radiography careers. CAMRT/ARRT certification, salary ranges ($52K–$105K+), education requirements, and exam prep resources.",
    seoKeywords: "medical imaging career, radiography career, CAMRT exam, ARRT certification, radiologic technologist salary, radiography education, medical imaging exam prep",
    ctaPrimary: { label: "Start Exam Prep", href: "/medical-imaging" },
    ctaSecondary: { label: "Explore Study Tools", href: "/imaging/question-bank" },
    flashcardsHref: "/imaging/flashcards",
  },

  "social-work": {
    slug: "social-work",
    canonicalPath: "/social-work",
    heroTitle: "Social Work Career & Licensing Exam Guide",
    heroSubtitle: "Your complete guide to becoming a licensed clinical social worker — education, ASWB licensing, salary expectations, and exam preparation.",
    overview: "Social workers are vital healthcare and community professionals who help individuals, families, and groups navigate complex social, emotional, and economic challenges. Licensed Clinical Social Workers (LCSWs) provide psychotherapy, conduct assessments, develop treatment plans, and advocate for vulnerable populations. The profession spans mental health, child welfare, healthcare, school settings, and community organizations, offering meaningful career opportunities with strong job growth projected at 7% through 2032.",
    color: "#00ACC1",
    colorAccent: "#E0F7FA",
    colorGradientFrom: "from-cyan-50",
    colorGradientTo: "to-teal-50/50",
    icon: "🤝",
    salaryCanada: { entry: "$45,000 – $55,000", mid: "$58,000 – $75,000", senior: "$80,000 – $100,000+", source: "Canadian Association of Social Workers, 2024" },
    salaryUSA: { entry: "$45,000 – $53,000", mid: "$55,000 – $72,000", senior: "$75,000 – $95,000+", source: "U.S. Bureau of Labor Statistics, 2024" },
    education: [
      { level: "Bachelor of Social Work (BSW)", duration: "4 years", description: "Entry-level degree for generalist social work practice. Covers human behavior, social policy, research methods, and field practicum." },
      { level: "Master of Social Work (MSW)", duration: "2 years (1 year advanced standing)", description: "Required for clinical licensure. Includes advanced clinical practice, DSM-5 diagnosis, intervention methods, and 900+ hours of supervised field placement." },
      { level: "Doctor of Social Work (DSW/PhD)", duration: "3–5 years", description: "Terminal degree for research, academia, and advanced clinical leadership roles." },
    ],
    careerPathway: [
      { title: "BSW Student", description: "Complete bachelor's degree with field practicum placements in community and healthcare settings.", yearsExperience: "0" },
      { title: "Entry-Level Social Worker", description: "Obtain BSW-level licensure. Work in case management, community services, or child welfare.", yearsExperience: "0–2" },
      { title: "MSW Graduate / Clinical Intern", description: "Complete MSW with clinical concentration. Accumulate supervised post-graduate clinical hours.", yearsExperience: "2–4" },
      { title: "Licensed Clinical Social Worker (LCSW)", description: "Pass ASWB Clinical exam. Provide independent psychotherapy, diagnosis, and treatment planning.", yearsExperience: "4–7" },
      { title: "Senior Clinician / Supervisor", description: "Supervise clinical interns, develop programs, and specialize in areas like trauma, substance abuse, or family therapy.", yearsExperience: "7–12" },
      { title: "Director / Private Practice", description: "Lead social work departments, open private practice, or transition into policy and advocacy leadership.", yearsExperience: "10+" },
    ],
    licensing: [
      { body: "ASWB", country: "USA", requirements: ["Graduate from CSWE-accredited MSW program", "Complete supervised clinical hours (varies by state, typically 2,000–4,000)", "Pass ASWB Clinical licensing exam", "Obtain state social work license", "Maintain continuing education credits"] },
      { body: "Provincial Regulatory College", country: "Canada", requirements: ["Graduate from accredited social work program", "Register with provincial regulatory body (e.g., OCSWSSW, BCCSW)", "Complete supervised practice hours", "Pass provincial registration exam (where applicable)", "Maintain continuing competence requirements"] },
    ],
    examInfo: [
      { name: "ASWB Clinical Exam", format: "170 multiple-choice questions (scored: 150)", passingScore: "Varies by jurisdiction (typically ~99/150)", duration: "4 hours" },
      { name: "ASWB Masters Exam", format: "170 multiple-choice questions (scored: 150)", passingScore: "Varies by jurisdiction", duration: "4 hours" },
      { name: "ASWB Advanced Generalist", format: "170 multiple-choice questions (scored: 150)", passingScore: "Varies by jurisdiction", duration: "4 hours" },
    ],
    keySkills: ["Clinical assessment", "Psychotherapy", "DSM-5 diagnosis", "Treatment planning", "Crisis intervention", "Case management", "Advocacy", "Cultural competence"],
    workSettings: ["Mental health clinics", "Hospitals", "Schools", "Child welfare agencies", "Community health centres", "Private practice", "Government agencies", "Correctional facilities"],
    seoTitle: "Social Work Career Guide — ASWB Exam Prep, Salary & Licensing | NurseNest",
    seoDescription: "Complete guide to social work careers. MSW education, ASWB licensing exam prep, salary ranges ($45K–$100K+), career pathways from BSW to LCSW.",
    seoKeywords: "social work career, ASWB exam, LCSW licensing, social worker salary, MSW education, social work career path, clinical social worker, social work exam prep",
    ctaPrimary: { label: "Start Free Diagnostic", href: "/social-worker/mock-exams" },
    ctaSecondary: { label: "Explore Study Tools", href: "/social-worker/question-bank" },
    flashcardsHref: "/social-worker/flashcards",
  },

  psychotherapy: {
    slug: "psychotherapy",
    canonicalPath: "/psychotherapy",
    heroTitle: "Psychotherapy Career & Licensing Exam Guide",
    heroSubtitle: "Your complete guide to becoming a Registered Psychotherapist — education, CRPO registration, salary expectations, and exam preparation.",
    overview: "Psychotherapists are regulated mental health professionals who use evidence-based therapeutic modalities to treat psychological disorders, emotional difficulties, and behavioural challenges. In Canada, Registered Psychotherapists (RPs) are regulated by provincial colleges such as CRPO in Ontario. In the US, Licensed Professional Counselors (LPCs) and Licensed Mental Health Counselors (LMHCs) fill comparable roles. The profession is experiencing rapid growth as awareness of mental health increases, with demand projected to grow 18% through 2032.",
    color: "#5C6BC0",
    colorAccent: "#E8EAF6",
    colorGradientFrom: "from-indigo-50",
    colorGradientTo: "to-violet-50/50",
    icon: "🧠",
    salaryCanada: { entry: "$48,000 – $58,000", mid: "$62,000 – $80,000", senior: "$85,000 – $120,000+", source: "CRPO / Provincial data, 2024" },
    salaryUSA: { entry: "$42,000 – $52,000", mid: "$55,000 – $72,000", senior: "$75,000 – $100,000+", source: "U.S. Bureau of Labor Statistics, 2024" },
    education: [
      { level: "Bachelor's Degree (Psychology/Related)", duration: "4 years", description: "Foundation in psychology, human development, and research methods. Required before pursuing graduate training." },
      { level: "Master's in Psychotherapy / Counselling", duration: "2–3 years", description: "Graduate-level training in therapeutic modalities (CBT, DBT, EMDR, etc.), clinical assessment, ethics, and supervised practicum." },
      { level: "Doctoral (PhD/PsyD) – Optional", duration: "4–6 years", description: "Advanced clinical training and research. Required for psychologist designation but not for psychotherapist registration." },
    ],
    careerPathway: [
      { title: "Graduate Student", description: "Complete master's program with supervised clinical practicum in psychotherapy.", yearsExperience: "0" },
      { title: "Qualifying Member / Intern", description: "Register as qualifying member with regulatory college. Accumulate supervised direct client contact hours.", yearsExperience: "0–2" },
      { title: "Registered Psychotherapist", description: "Pass registration exam and obtain full RP designation. Provide independent psychotherapy.", yearsExperience: "2–5" },
      { title: "Experienced Clinician", description: "Develop expertise in specialized modalities. Build private practice or work in agency settings.", yearsExperience: "5–8" },
      { title: "Clinical Supervisor", description: "Supervise qualifying psychotherapists. Contribute to training programs and professional development.", yearsExperience: "7–12" },
      { title: "Director / Practice Owner", description: "Lead group practices, direct mental health programs, or teach at the graduate level.", yearsExperience: "10+" },
    ],
    licensing: [
      { body: "CRPO (Ontario, Canada)", country: "Canada", requirements: ["Complete approved graduate psychotherapy program", "Accumulate supervised direct client hours", "Pass CRPO registration examination", "Register with College of Registered Psychotherapists", "Maintain continuing competence requirements"] },
      { body: "State Licensing Board", country: "USA", requirements: ["Complete CACREP-accredited master's program", "Accumulate supervised clinical hours (2,000–4,000)", "Pass NCE (National Counselor Examination) or CMHCE", "Obtain state LPC/LMHC license", "Maintain continuing education credits"] },
    ],
    examInfo: [
      { name: "CRPO Registration Exam", format: "Multiple-choice and vignette-based", passingScore: "Pass/Fail", duration: "3 hours" },
      { name: "NCE (National Counselor Exam)", format: "200 multiple-choice questions (scored: 160)", passingScore: "Varies by state", duration: "3 hours 45 minutes" },
      { name: "CMHCE", format: "Clinical simulation (10 cases)", passingScore: "Pass/Fail", duration: "Limited time per case" },
    ],
    keySkills: ["Therapeutic alliance building", "CBT/DBT/EMDR techniques", "Clinical assessment", "Treatment planning", "Crisis intervention", "Ethical decision-making", "Cultural competence", "Trauma-informed care"],
    workSettings: ["Private practice", "Community mental health centres", "Employee assistance programs", "Hospitals", "Schools/universities", "Addiction treatment centres", "Telehealth platforms", "Group homes"],
    seoTitle: "Psychotherapy Career Guide — RP Exam Prep, Salary & Licensing | NurseNest",
    seoDescription: "Complete guide to psychotherapy careers. Education, CRPO/NCE licensing, salary ranges ($42K–$120K+), career pathways, and exam preparation resources.",
    seoKeywords: "psychotherapy career, registered psychotherapist, CRPO exam, NCE exam, psychotherapist salary, counselling career, LPC licensing, psychotherapy education",
    ctaPrimary: { label: "Start Free Diagnostic", href: "/psychotherapist/mock-exams" },
    ctaSecondary: { label: "Explore Study Tools", href: "/psychotherapist/question-bank" },
    flashcardsHref: "/psychotherapist/flashcards",
  },

  addictions: {
    slug: "addictions",
    canonicalPath: "/addictions",
    heroTitle: "Addictions Counsellor Career & Certification Guide",
    heroSubtitle: "Your complete guide to becoming a certified addictions counsellor — education, IC&RC/CCAC certification, salary, and exam preparation.",
    overview: "Addictions Counsellors (also called Substance Abuse Counselors) are specialized professionals who help individuals overcome substance use disorders and behavioural addictions. They conduct assessments, develop treatment plans, facilitate individual and group counselling, implement relapse prevention strategies, and coordinate care with other healthcare providers. The opioid crisis and increased awareness of addiction as a health issue have driven significant demand, with the profession growing 18% through 2032 — much faster than average.",
    color: "#558B2F",
    colorAccent: "#DCEDC8",
    colorGradientFrom: "from-lime-50",
    colorGradientTo: "to-green-50/50",
    icon: "🛡️",
    salaryCanada: { entry: "$42,000 – $52,000", mid: "$55,000 – $70,000", senior: "$75,000 – $95,000+", source: "Canadian Centre on Substance Use and Addiction, 2024" },
    salaryUSA: { entry: "$38,000 – $46,000", mid: "$49,000 – $62,000", senior: "$65,000 – $85,000+", source: "U.S. Bureau of Labor Statistics, 2024" },
    education: [
      { level: "Certificate / Diploma in Addictions", duration: "1–2 years", description: "Foundational training in substance use disorders, motivational interviewing, and group facilitation. Qualifies for entry-level counselling positions." },
      { level: "Bachelor's Degree (Social Sciences/Related)", duration: "4 years", description: "Degree in psychology, social work, or human services with addictions specialization. Preferred by most employers." },
      { level: "Master's Degree (Counselling/Psychology)", duration: "2 years", description: "Advanced clinical training for senior roles, private practice, and clinical supervision. Required for some advanced certifications." },
    ],
    careerPathway: [
      { title: "Student / Practicum", description: "Complete addictions education program with supervised practicum in treatment settings.", yearsExperience: "0" },
      { title: "Entry-Level Counsellor", description: "Begin working in treatment centres, community agencies, or outpatient programs under supervision.", yearsExperience: "0–2" },
      { title: "Certified Addictions Counsellor", description: "Obtain IC&RC, CASAC, or CCAC certification. Provide independent counselling and case management.", yearsExperience: "2–5" },
      { title: "Senior Counsellor / Specialist", description: "Specialize in populations (youth, Indigenous, corrections) or modalities (MI, CBT, harm reduction).", yearsExperience: "5–8" },
      { title: "Clinical Supervisor", description: "Supervise counselling staff, develop programs, and contribute to policy development.", yearsExperience: "7–12" },
      { title: "Program Director / Manager", description: "Lead addiction treatment programs, manage budgets, and oversee clinical operations.", yearsExperience: "10+" },
    ],
    licensing: [
      { body: "IC&RC", country: "USA", requirements: ["Meet education requirements (varies by credential level)", "Complete supervised experience hours (typically 2,000–6,000)", "Pass IC&RC ADC or AADC examination", "Obtain state substance abuse counselor credential", "Maintain continuing education requirements"] },
      { body: "CCAC / Provincial Body", country: "Canada", requirements: ["Complete approved addictions education program", "Accumulate supervised counselling hours", "Pass CCAC certification exam (where applicable)", "Register with provincial certifying body", "Maintain continuing professional development"] },
    ],
    examInfo: [
      { name: "IC&RC ADC Exam", format: "150 multiple-choice questions", passingScore: "Pass/Fail (criterion-referenced)", duration: "3 hours" },
      { name: "CASAC Exam (NY)", format: "150 multiple-choice questions", passingScore: "Pass/Fail", duration: "3 hours" },
      { name: "CCAC Exam (Canada)", format: "Multiple-choice, scenario-based", passingScore: "Pass/Fail", duration: "3 hours" },
    ],
    keySkills: ["Motivational interviewing", "Group facilitation", "Assessment/screening", "Treatment planning", "Relapse prevention", "Crisis intervention", "Harm reduction", "Cultural competence"],
    workSettings: ["Residential treatment centres", "Outpatient clinics", "Hospitals", "Detox facilities", "Correctional facilities", "Community health centres", "Private practice", "Mobile outreach"],
    seoTitle: "Addictions Counsellor Career Guide — IC&RC Exam Prep & Certification | NurseNest",
    seoDescription: "Complete guide to addictions counsellor careers. Education, IC&RC/CCAC certification, salary ranges ($38K–$95K+), career pathways, and exam preparation.",
    seoKeywords: "addictions counsellor career, substance abuse counselor, IC&RC exam, CCAC certification, addictions salary, addiction counselling education, substance use counselor",
    ctaPrimary: { label: "Start Free Diagnostic", href: "/addictions-counsellor/mock-exams" },
    ctaSecondary: { label: "Explore Study Tools", href: "/addictions-counsellor/question-bank" },
    flashcardsHref: "/addictions-counsellor/flashcards",
  },

  "occupational-therapy": {
    slug: "occupational-therapy",
    canonicalPath: "/occupational-therapy",
    heroTitle: "Occupational Therapy Career & Exam Prep Guide",
    heroSubtitle: "Your complete guide to becoming an Occupational Therapist — education, NBCOT/NOTCE licensing, salary, and exam preparation.",
    overview: "Occupational Therapists (OTs) help people of all ages participate in meaningful daily activities — from self-care and work to leisure and social participation. OTs evaluate clients' functional abilities, design individualized intervention plans, recommend adaptive equipment, and modify environments to promote independence. The profession addresses physical, cognitive, psychosocial, and developmental barriers across diverse settings. With an aging population and growing recognition of OT's role in mental health and rehabilitation, the profession is projected to grow 12% through 2032.",
    color: "#6A1B9A",
    colorAccent: "#E1BEE7",
    colorGradientFrom: "from-purple-50",
    colorGradientTo: "to-pink-50/50",
    icon: "🖐️",
    salaryCanada: { entry: "$58,000 – $68,000", mid: "$72,000 – $88,000", senior: "$92,000 – $110,000+", source: "Canadian Association of Occupational Therapists, 2024" },
    salaryUSA: { entry: "$68,000 – $78,000", mid: "$82,000 – $95,000", senior: "$100,000 – $120,000+", source: "U.S. Bureau of Labor Statistics, 2024" },
    education: [
      { level: "Bachelor's Degree (Pre-OT Prerequisites)", duration: "4 years", description: "Complete undergraduate degree with prerequisite courses in anatomy, physiology, psychology, and statistics." },
      { level: "Master of Occupational Therapy (MOT/MSOT)", duration: "2–3 years", description: "Professional master's degree required for practice. Includes clinical reasoning, intervention methods, fieldwork placements, and research." },
      { level: "Doctor of Occupational Therapy (OTD)", duration: "3–4 years", description: "Entry-level or post-professional doctoral degree with advanced clinical practice and scholarly project. Becoming standard in the US." },
    ],
    careerPathway: [
      { title: "OT Student", description: "Complete master's or doctoral OT program with Level I and Level II fieldwork placements.", yearsExperience: "0" },
      { title: "New Graduate OT", description: "Pass NBCOT or NOTCE exam and obtain state/provincial registration. Begin supervised practice.", yearsExperience: "0–2" },
      { title: "Staff Occupational Therapist", description: "Develop clinical expertise in a practice area. Build assessment, intervention, and documentation skills.", yearsExperience: "2–5" },
      { title: "Senior OT / Specialist", description: "Specialize in pediatrics, hand therapy, neuro-rehab, mental health, or geriatrics. Pursue specialty certifications.", yearsExperience: "5–8" },
      { title: "Clinical Lead / Educator", description: "Lead OT teams, precept students, and contribute to evidence-based practice and program development.", yearsExperience: "7–12" },
      { title: "OT Director / Program Manager", description: "Oversee rehabilitation departments, develop clinical programs, or open private practice.", yearsExperience: "10+" },
    ],
    licensing: [
      { body: "NBCOT", country: "USA", requirements: ["Graduate from ACOTE-accredited OT program", "Pass NBCOT OTR examination", "Obtain state OT license", "Renew NBCOT certification every 3 years", "Complete continuing competency requirements"] },
      { body: "Provincial OT Regulatory College", country: "Canada", requirements: ["Graduate from accredited OT program", "Pass NOTCE (National OT Certification Exam)", "Register with provincial regulatory college (e.g., COTO)", "Complete jurisprudence requirements", "Maintain continuing competence"] },
    ],
    examInfo: [
      { name: "NBCOT OTR Exam", format: "200 multiple-choice and clinical simulation items", passingScore: "Pass/Fail (scaled score)", duration: "4 hours" },
      { name: "NOTCE (Canada)", format: "200 multiple-choice questions", passingScore: "Pass/Fail", duration: "4 hours" },
    ],
    keySkills: ["Functional assessment", "Activity analysis", "Intervention planning", "Adaptive equipment", "Cognitive rehabilitation", "Pediatric development", "Ergonomic assessment", "Therapeutic use of self"],
    workSettings: ["Hospitals", "Rehabilitation centres", "Schools", "Home health", "Outpatient clinics", "Mental health facilities", "Long-term care", "Private practice"],
    seoTitle: "Occupational Therapy Career Guide — NBCOT Exam Prep & Salary | NurseNest",
    seoDescription: "Complete guide to occupational therapy careers. OT education, NBCOT/NOTCE certification, salary ranges ($58K–$120K+), career pathways, and exam preparation.",
    seoKeywords: "occupational therapy career, OT exam, NBCOT certification, NOTCE exam, occupational therapist salary, OT education, OTR licensing, occupational therapy career path",
    ctaPrimary: { label: "Start Free Diagnostic", href: "/diagnostic-assessment" },
    ctaSecondary: { label: "Explore Study Tools", href: "/start-free" },
    flashcardsHref: "/flashcards",
  },
};

export function getProfessionAuthorityData(slug: string): ProfessionAuthorityData | undefined {
  return PROFESSION_AUTHORITY_DATA[slug];
}

export function getAllProfessionAuthoritySlugs(): string[] {
  return Object.keys(PROFESSION_AUTHORITY_DATA);
}
