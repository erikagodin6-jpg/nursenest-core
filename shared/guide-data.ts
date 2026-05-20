export interface GuideFAQ {
  question: string;
  answer: string;
}

export interface GuideSection {
  id: string;
  title: string;
  content: string;
}

export interface GuideResource {
  label: string;
  href: string;
  platform: "nursenest" | "newgrad" | "applynest";
  description: string;
}

export interface AuthorityGuide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  heroSubtitle: string;
  color: string;
  colorAccent: string;
  introduction: string;
  examPrepSection: GuideSection;
  clinicalTransitionSection: GuideSection;
  careerPlacementSection: GuideSection;
  additionalSections: GuideSection[];
  resources: GuideResource[];
  faqs: GuideFAQ[];
  relatedGuides: string[];
}

export const AUTHORITY_GUIDES: AuthorityGuide[] = [
  {
    slug: "complete-guide-to-becoming-a-registered-nurse",
    title: "Complete Guide to Becoming a Registered Nurse (RN)",
    metaTitle: "Complete Guide to Becoming a Registered Nurse (RN) | Exam Prep, Clinical Skills & Career Path",
    metaDescription: "Everything you need to become a Registered Nurse: NCLEX-RN exam preparation strategies, clinical transition survival guide, job placement tips, salary data, and career advancement resources.",
    keywords: "how to become a registered nurse, RN career guide, NCLEX-RN preparation, nursing career path, new grad RN, registered nurse salary, nursing clinical skills, RN job placement",
    heroSubtitle: "From nursing school to confident clinical practice — your complete roadmap for passing the NCLEX-RN, surviving your first year, and building a rewarding nursing career.",
    color: "#6C63FF",
    colorAccent: "#E8E6FF",
    introduction: "Becoming a Registered Nurse is one of the most rewarding career paths in healthcare. With over 3 million RNs in the United States and Canada, nursing offers unparalleled job security, competitive salaries, and the opportunity to make a meaningful difference in patients' lives every day. This comprehensive guide walks you through every stage of the RN journey — from exam preparation and licensing through your critical first year of clinical practice to long-term career advancement and specialization. Whether you are a nursing student preparing for the NCLEX-RN, a new graduate navigating orientation, or an aspiring nurse researching the profession, this guide provides the evidence-based strategies and practical tools you need to succeed.",
    examPrepSection: {
      id: "exam-preparation",
      title: "NCLEX-RN Exam Preparation",
      content: "The NCLEX-RN is a computer-adaptive test (CAT) that determines whether a candidate is ready to practice safely as an entry-level registered nurse. The exam covers eight client needs categories: Safe and Effective Care Environment (Management of Care and Safety/Infection Control), Health Promotion and Maintenance, Psychosocial Integrity, and Physiological Integrity (Basic Care, Pharmacological Therapies, Reduction of Risk Potential, and Physiological Adaptation). Candidates receive between 75 and 145 questions with a maximum time limit of 5 hours.\n\nEffective NCLEX preparation combines content review with strategic practice. Focus on clinical judgment and prioritization rather than rote memorization. Use adaptive mock exams that simulate the real testing environment, and study high-yield topics including delegation, safety, infection control, pharmacology, and emergency nursing interventions. Build a structured study plan that targets your weakest domains first, and track your performance across all eight client needs categories to ensure balanced preparation.\n\nCanadian nursing graduates should also be aware that the NCLEX-RN is accepted in most Canadian provinces for RN licensure, though some jurisdictions may have additional requirements such as jurisprudence exams or language proficiency testing.",
    },
    clinicalTransitionSection: {
      id: "clinical-transition",
      title: "First-Year Clinical Transition",
      content: "The transition from nursing student to independent practitioner is widely recognized as one of the most challenging periods in a nurse's career. Research consistently shows that new graduate nurses experience reality shock — the gap between what they learned in school and the demands of real-world clinical practice. Understanding this transition and preparing for it can significantly reduce stress and improve both confidence and patient outcomes.\n\nDuring your first 90 days, focus on mastering your unit's workflow, building relationships with your preceptor and interdisciplinary team, and developing confidence in core clinical skills such as medication administration, assessment documentation, and SBAR communication. Use clinical quick-reference tools to reinforce critical thinking during shifts, and participate actively in your orientation program's skills labs and simulation exercises.\n\nTime management is often the biggest challenge for new graduates. Prioritize patient safety, develop a systematic approach to shift organization, and learn to delegate effectively within your scope of practice. Seek feedback regularly from your preceptor and don't hesitate to ask questions — it demonstrates professional growth, not weakness.",
    },
    careerPlacementSection: {
      id: "career-placement",
      title: "Job Search and Career Placement",
      content: "The nursing job market is exceptionally strong, with the Bureau of Labor Statistics projecting 6% growth through 2032. However, landing your ideal first position requires strategic preparation. New graduate RN programs are highly competitive, and candidates who prepare their application materials early have a significant advantage.\n\nYour nursing resume should highlight clinical rotation hours, patient populations served, and specific skills performed (IV insertion, catheterization, wound care, medication administration). Use ATS-compatible formatting and tailor each application to the specific unit and hospital system. Prepare for behavioral interview questions using the STAR framework (Situation, Task, Action, Result), and practice answering common nursing interview questions about conflict resolution, prioritization, and patient safety.\n\nAfter landing your position, focus on professional development from day one. Join professional nursing organizations (ANA, CNA, specialty associations), pursue specialty certifications within your first 2-3 years, and consider BSN-to-MSN pathway programs for advanced practice roles. The average RN salary ranges from $65,000 to $95,000 depending on location, specialty, and experience level.",
    },
    additionalSections: [
      {
        id: "education-requirements",
        title: "Education and Licensing Requirements",
        content: "To become a Registered Nurse, you must complete an accredited nursing program — either an Associate Degree in Nursing (ADN, typically 2-3 years) or a Bachelor of Science in Nursing (BSN, typically 4 years). While both pathways qualify you to sit for the NCLEX-RN, a BSN is increasingly preferred by employers and may be required for certain positions, particularly at Magnet-designated hospitals.\n\nAfter graduating, you must pass the NCLEX-RN administered by the National Council of State Boards of Nursing (NCSBN). In Canada, the NCLEX-RN is accepted in most provinces for RN licensure through the respective provincial regulatory body. Additional requirements may include criminal background checks, CPR/BLS certification, and meeting specific clinical hour requirements.",
      },
      {
        id: "specialization-paths",
        title: "Specialization and Advancement",
        content: "Nursing offers extraordinary career flexibility. After gaining 1-2 years of experience, RNs can pursue specialty certifications such as CCRN (Critical Care), CEN (Emergency), OCN (Oncology), CNOR (Perioperative), or CPN (Pediatric). Advanced practice roles — Nurse Practitioner (NP), Clinical Nurse Specialist (CNS), Nurse Anesthetist (CRNA), and Nurse Midwife (CNM) — require graduate education and offer expanded scope of practice, higher salaries, and greater autonomy.\n\nNon-clinical career paths include nursing education, healthcare administration, nursing informatics, legal nurse consulting, and pharmaceutical or medical device industry roles. Many experienced nurses transition into leadership positions such as charge nurse, nurse manager, director of nursing, or chief nursing officer.",
      },
    ],
    resources: [
      { label: "NCLEX-RN Study Hub", href: "/nclex-rn", platform: "nursenest", description: "Complete exam prep with mock exams, practice questions, and study guides" },
      { label: "NCLEX-RN Mock Exam", href: "/nclex-rn/mock-exam", platform: "nursenest", description: "Full-length CAT-adaptive mock exam mirroring the real testing experience" },
      { label: "Practice Questions", href: "/question-bank?exam=nclex-rn", platform: "nursenest", description: "Thousands of NCLEX-RN practice questions organized by body system" },
      { label: "Pharmacology Review", href: "/medications", platform: "nursenest", description: "High-yield medications with drug classes, side effects, and nursing considerations" },
      { label: "Lab Values Reference", href: "/lab-values", platform: "nursenest", description: "Normal ranges and clinical significance for critical lab values" },
      { label: "New Grad Nursing Hub", href: "/new-grad/nursing", platform: "newgrad", description: "First-year survival guide, clinical confidence tools, and orientation support" },
      { label: "Interview Prep Lab", href: "/new-grad#interview-lab", platform: "applynest", description: "100+ behavioral and clinical interview questions with STAR framework answers" },
      { label: "Resume Builder", href: "/new-grad#resume-builder", platform: "applynest", description: "Nursing-specific resume templates that pass ATS systems" },
      { label: "Career Journey: Nursing", href: "/career-journey/nursing", platform: "applynest", description: "Step-by-step career path from exam prep to job placement" },
    ],
    faqs: [
      { question: "How long does it take to become a Registered Nurse?", answer: "It typically takes 2-4 years depending on your educational path. An Associate Degree in Nursing (ADN) takes 2-3 years, while a Bachelor of Science in Nursing (BSN) takes 4 years. After graduation, you must pass the NCLEX-RN licensing exam before practicing." },
      { question: "What is the NCLEX-RN pass rate?", answer: "The first-time NCLEX-RN pass rate for US-educated candidates is approximately 88%. Canadian nursing graduates also take the NCLEX-RN in most provinces with similar pass rates. Proper preparation with adaptive practice exams and structured study plans significantly improves your chances." },
      { question: "How much do Registered Nurses earn?", answer: "RN salaries vary by location, specialty, and experience. Entry-level RNs typically earn $55,000-$70,000, while experienced RNs in high-demand specialties can earn $85,000-$120,000+. Travel nursing and advanced practice roles offer even higher compensation." },
      { question: "What is the hardest part of the first year as a new grad RN?", answer: "Most new graduates identify time management, confidence in clinical decision-making, and navigating workplace dynamics as the biggest challenges. Reality shock — the gap between nursing school and real-world practice — is normal and typically improves within the first 6-12 months with proper support." },
      { question: "Should I get my ADN or BSN?", answer: "While both qualify you for the NCLEX-RN, a BSN is increasingly preferred by employers. Many hospitals require or prefer BSN-prepared nurses, and a BSN opens doors to graduate education. If you pursue an ADN first, most employers support RN-to-BSN bridge programs." },
      { question: "What nursing specialties have the highest demand?", answer: "Critical care (ICU), emergency nursing, perioperative, oncology, and psychiatric nursing consistently have high demand. Labor and delivery, neonatal intensive care, and pediatric nursing also offer strong job markets. Med-surg nursing provides the strongest clinical foundation for new graduates." },
    ],
    relatedGuides: ["complete-guide-to-becoming-an-rpn-lvn", "complete-guide-to-becoming-a-respiratory-therapist"],
  },
  {
    slug: "complete-guide-to-becoming-an-rpn-lvn",
    title: "Complete Guide to Becoming an RPN / LVN",
    metaTitle: "Complete Guide to Becoming an RPN/LVN | REx-PN & NCLEX-PN Exam Prep, Career Path & Salary",
    metaDescription: "Everything you need to become a Registered Practical Nurse (RPN) or Licensed Vocational Nurse (LVN): REx-PN and NCLEX-PN exam prep, clinical transition guide, and career advancement strategies.",
    keywords: "how to become an RPN, how to become an LVN, REx-PN exam preparation, NCLEX-PN study guide, practical nursing career, RPN salary, LVN career path, new grad practical nurse",
    heroSubtitle: "Your complete guide to practical nursing — from passing the REx-PN or NCLEX-PN to thriving in your first clinical role and advancing your healthcare career.",
    color: "#10B981",
    colorAccent: "#D1FAE5",
    introduction: "Registered Practical Nurses (RPNs) in Canada and Licensed Practical/Vocational Nurses (LPN/LVNs) in the United States are essential members of the healthcare team, providing direct patient care in hospitals, long-term care facilities, clinics, and community settings. With a shorter educational pathway than registered nursing, practical nursing offers a faster entry into healthcare with strong job security and multiple advancement opportunities. This comprehensive guide covers everything from licensing exam preparation through your first year of practice to long-term career growth strategies.",
    examPrepSection: {
      id: "exam-preparation",
      title: "REx-PN and NCLEX-PN Exam Preparation",
      content: "Canadian practical nursing graduates write the Regulatory Exam - Practical Nurse (REx-PN), a computer-adaptive test with 60-90 questions and a 3-hour time limit mapped to five competency domains. American LPN/LVN candidates write the NCLEX-PN, a CAT exam with 85-150 questions covering client needs categories similar to the NCLEX-RN but within the practical nursing scope of practice.\n\nBoth exams emphasize clinical judgment, safe medication administration, patient assessment within scope, and collaborative practice. Focus your study on scope-of-practice boundaries, delegation principles (what you can and cannot delegate to UCPs), medication administration safety, and foundational nursing interventions. Use mock exams that simulate the adaptive testing format, and study high-yield practical nursing topics including vital signs interpretation, wound care, basic IV management, and patient teaching.\n\nFor REx-PN candidates, ensure you are familiar with Canadian healthcare terminology, SI units for lab values, and Health Canada-approved medications. Study materials should reflect the Canadian healthcare context, including collaboration with RNs, NPs, and unregulated care providers.",
    },
    clinicalTransitionSection: {
      id: "clinical-transition",
      title: "First-Year Clinical Transition",
      content: "New graduate practical nurses face unique transition challenges, particularly around scope-of-practice navigation. Understanding exactly what falls within your scope — and when to collaborate with or defer to an RN — is critical for patient safety and professional confidence. Your regulatory college or board of nursing provides detailed scope-of-practice documents that should be your primary reference.\n\nDuring your first 90 days, prioritize mastering medication administration safety, basic patient assessment skills, and accurate documentation. Build strong working relationships with your RN colleagues and learn the delegation framework used in your workplace. Time management with multiple patients is often the steepest learning curve — develop a systematic approach to organizing your shift and prioritizing care activities.\n\nLong-term care and community settings are common first positions for practical nurses and offer excellent opportunities to develop holistic patient care skills, chronic disease management expertise, and strong therapeutic communication abilities.",
    },
    careerPlacementSection: {
      id: "career-placement",
      title: "Job Search and Career Placement",
      content: "The demand for practical nurses remains strong across both Canada and the United States, with projected job growth of 5-6% through 2032. Long-term care, home health, rehabilitation, and outpatient clinics are the largest employers of practical nurses, though many acute care hospitals also hire LPN/LVNs in specific units.\n\nTailor your resume to highlight your clinical rotation experience, specific skills performed (medication administration, wound care, vital signs, patient teaching), and any relevant certifications (BLS, IV therapy, wound care). Interview preparation should focus on scope-of-practice scenarios, delegation questions, and patient safety situations specific to practical nursing.\n\nCareer advancement opportunities include RPN-to-RN bridge programs, specialty certifications in wound care, IV therapy, or gerontology, and leadership roles such as team lead or charge nurse. Many practical nurses eventually pursue RN education while continuing to work, making the RPN/LVN role an excellent stepping stone in a healthcare career.",
    },
    additionalSections: [
      {
        id: "scope-of-practice",
        title: "Understanding Your Scope of Practice",
        content: "The practical nursing scope of practice varies by jurisdiction but generally includes basic patient assessment, medication administration (including some IV medications with additional certification), wound care, patient education, and collaborative care planning under the direction of an RN or physician. Key limitations typically include initial comprehensive assessments, complex care planning, and certain high-risk procedures.\n\nUnderstanding your scope is not just an exam topic — it is essential for safe daily practice. When in doubt, consult your regulatory body's scope-of-practice guidelines, your facility's policies, and your supervising RN. Practicing within scope protects both your patients and your license.",
      },
    ],
    resources: [
      { label: "REx-PN Study Hub", href: "/rex-pn", platform: "nursenest", description: "Complete Canadian RPN exam prep with competency-mapped questions" },
      { label: "NCLEX-PN Study Hub", href: "/nclex-pn", platform: "nursenest", description: "LPN/LVN exam preparation with adaptive mock exams" },
      { label: "REx-PN Mock Exam", href: "/rex-pn/mock-exam", platform: "nursenest", description: "Full-length CAT-adaptive mock exam aligned to the REx-PN framework" },
      { label: "Practical Nursing Practice Questions", href: "/question-bank?exam=rex-pn", platform: "nursenest", description: "Scope-appropriate practice questions with detailed rationales" },
      { label: "Pharmacology Review", href: "/medications", platform: "nursenest", description: "Medications commonly administered by practical nurses" },
      { label: "New Grad Nursing Hub", href: "/new-grad/nursing", platform: "newgrad", description: "First-year survival guide and clinical confidence tools" },
      { label: "Interview Prep Lab", href: "/new-grad#interview-lab", platform: "applynest", description: "Interview questions tailored for practical nursing positions" },
      { label: "Resume Builder", href: "/new-grad#resume-builder", platform: "applynest", description: "LPN/RPN resume templates optimized for healthcare employers" },
    ],
    faqs: [
      { question: "What is the difference between an RPN and an LVN?", answer: "RPN (Registered Practical Nurse) is the Canadian title, while LPN (Licensed Practical Nurse) and LVN (Licensed Vocational Nurse) are the American titles. The roles are similar — providing direct patient care within a defined scope of practice under the direction of an RN or physician. The specific scope varies by jurisdiction." },
      { question: "How long is the practical nursing program?", answer: "Practical nursing diploma programs typically take 12-18 months (2-3 semesters) to complete. This includes classroom instruction, lab practice, and clinical rotations in various healthcare settings." },
      { question: "What is the REx-PN pass rate?", answer: "The REx-PN has a pass/fail result format. First-time pass rates for Canadian practical nursing graduates are generally strong, though specific rates vary by program. Structured preparation with adaptive practice exams significantly improves outcomes." },
      { question: "Can I become an RN after working as an RPN/LVN?", answer: "Yes. Many colleges and universities offer RPN-to-RN or LPN-to-RN bridge programs that recognize your prior education and experience. These programs typically take 1-2 years and allow you to work as a practical nurse while studying." },
      { question: "Where do most practical nurses work?", answer: "The largest employers of practical nurses are long-term care facilities, home health agencies, rehabilitation centers, outpatient clinics, and physicians' offices. Some acute care hospitals also employ practical nurses, particularly on medical-surgical and rehabilitation units." },
      { question: "How much do RPNs/LVNs earn?", answer: "Practical nurse salaries range from $40,000 to $60,000 depending on location, setting, and experience. Specialized roles, overtime, and shift differentials can increase total compensation. Canadian RPNs in urban centers typically earn $50,000-$65,000." },
    ],
    relatedGuides: ["complete-guide-to-becoming-a-registered-nurse", "complete-guide-to-becoming-a-paramedic"],
  },
  {
    slug: "complete-guide-to-becoming-a-respiratory-therapist",
    title: "Complete Guide to Becoming a Respiratory Therapist",
    metaTitle: "Complete Guide to Becoming a Respiratory Therapist | NBRC & CBRC Exam Prep, Career Path & Salary",
    metaDescription: "Everything you need to become a Respiratory Therapist: NBRC TMC/CSE and CBRC exam preparation, ventilator management skills, ABG interpretation, clinical transition guide, and career placement strategies.",
    keywords: "how to become a respiratory therapist, RRT career guide, NBRC TMC exam, CBRC exam preparation, respiratory therapy career path, respiratory therapist salary, ventilator management, ABG interpretation",
    heroSubtitle: "Your complete roadmap to a career in respiratory therapy — from acing the NBRC or CBRC exam to mastering ventilator management and building expertise in critical care.",
    color: "#2196F3",
    colorAccent: "#E3F2FD",
    introduction: "Respiratory Therapists (RTs) are specialized healthcare professionals who evaluate, treat, and manage patients with cardiopulmonary disorders. From managing life-support ventilators in the ICU to conducting pulmonary function tests in outpatient clinics, respiratory therapists play a critical role across the healthcare continuum. With growing demand driven by an aging population and increasing prevalence of chronic respiratory diseases, respiratory therapy offers excellent career prospects, competitive compensation, and the satisfaction of directly impacting patient outcomes. This guide covers every aspect of the respiratory therapy career path — from certification exams through clinical practice to career advancement.",
    examPrepSection: {
      id: "exam-preparation",
      title: "NBRC TMC/CSE and CBRC Exam Preparation",
      content: "In the United States, respiratory therapists must pass the Therapist Multiple-Choice (TMC) Examination administered by the National Board for Respiratory Care (NBRC). The TMC exam consists of 160 questions covering patient data evaluation, equipment manipulation, and clinical practice. Scoring at the high-cut score qualifies you to take the Clinical Simulation Examination (CSE) for the Registered Respiratory Therapist (RRT) credential.\n\nCanadian respiratory therapy graduates write the Canadian Board for Respiratory Care (CBRC) examination, which assesses competency across similar domains with a Canadian healthcare context. The exam covers airway management, mechanical ventilation, oxygen therapy, patient assessment, neonatal/pediatric respiratory care, and diagnostic procedures.\n\nFocus your exam preparation on ABG interpretation, ventilator management modes and settings, oxygen delivery systems, airway management techniques, and pulmonary function testing. Use adaptive mock exams that simulate real exam conditions, and study clinical scenarios that require integration of multiple concepts — particularly hemodynamic data, lab values, and chest X-ray interpretation in the context of respiratory care decisions.",
    },
    clinicalTransitionSection: {
      id: "clinical-transition",
      title: "First-Year Clinical Transition",
      content: "New graduate respiratory therapists often experience a steep learning curve, particularly in critical care settings where they manage complex ventilator patients, respond to rapid response and code blue calls, and make time-sensitive clinical decisions. The gap between classroom ventilator management and bedside practice is significant, and most new graduates benefit from a structured orientation program.\n\nDuring your first year, focus on mastering ventilator waveform interpretation, ABG analysis in clinical context, airway management (including difficult airways), and effective communication with physicians, nurses, and other team members. Develop confidence in emergency response — intubation assistance, manual ventilation, and ACLS protocols are skills you will use regularly.\n\nBuild strong relationships with experienced therapists who can mentor you through challenging situations. Night shifts often provide excellent learning opportunities as you manage patients more independently. Document your competencies and seek feedback actively — this builds both skill and confidence.",
    },
    careerPlacementSection: {
      id: "career-placement",
      title: "Job Search and Career Placement",
      content: "Respiratory therapy is projected to grow 13% through 2032, significantly faster than average. Hospitals (particularly ICUs, emergency departments, and neonatal units) are the largest employers, followed by home health agencies, sleep labs, pulmonary rehabilitation programs, and outpatient clinics.\n\nYour resume should emphasize clinical rotation experience in critical care, neonatal/pediatric settings, and pulmonary function labs. Highlight specific competencies such as ventilator management, arterial blood gas analysis, bronchoscopy assistance, and airway management. Include certifications (BLS, ACLS, PALS, NRP) and any specialized training.\n\nCareer advancement includes specialization in neonatal/pediatric respiratory care, pulmonary function testing, sleep medicine, or ECMO. Advanced roles include respiratory therapy supervisor, clinical educator, department manager, or transition to perfusion, anesthesia assistant, or physician assistant pathways. Graduate education in respiratory care or healthcare administration opens executive leadership opportunities. The average respiratory therapist salary ranges from $55,000 to $85,000, with critical care specialists and managers earning significantly more.",
    },
    additionalSections: [
      {
        id: "daily-practice",
        title: "What Respiratory Therapists Do Daily",
        content: "A typical day for a hospital-based respiratory therapist involves managing ventilator patients (adjusting settings, interpreting waveforms, performing spontaneous breathing trials), administering aerosolized medications, performing arterial blood gas draws and interpretation, responding to rapid responses and code blues, conducting patient assessments, and educating patients on inhaler technique and oxygen use.\n\nIn outpatient settings, RTs perform pulmonary function testing, conduct cardiopulmonary stress tests, manage sleep study equipment, and provide pulmonary rehabilitation education. The variety of settings and patient populations makes respiratory therapy a dynamic and engaging career.",
      },
    ],
    resources: [
      { label: "RRT Practice Questions", href: "/rrt-practice-questions", platform: "nursenest", description: "Respiratory therapy exam questions with detailed clinical rationales" },
      { label: "RRT Exam Study Guide", href: "/rrt-exam-study-guide", platform: "nursenest", description: "Comprehensive study guide covering all NBRC/CBRC exam domains" },
      { label: "ABG Interpretation Engine", href: "/rrt/abg-engine", platform: "nursenest", description: "Interactive ABG analysis practice with instant feedback" },
      { label: "Ventilator Mode Simulator", href: "/rrt/ventilator-sim", platform: "nursenest", description: "Practice ventilator settings and waveform interpretation" },
      { label: "Respiratory Therapy Authority Hub", href: "/respiratory-therapy", platform: "nursenest", description: "Complete respiratory therapy resources and study tools" },
      { label: "New Grad RT Hub", href: "/new-grad/respiratory-therapy", platform: "newgrad", description: "First-year RT survival guide and clinical transition resources" },
      { label: "RT Interview Prep", href: "/new-grad#interview-lab", platform: "applynest", description: "Behavioral and clinical interview questions for RT positions" },
      { label: "RT Resume Builder", href: "/new-grad#resume-builder", platform: "applynest", description: "Healthcare resume templates optimized for respiratory therapy roles" },
      { label: "Career Journey: Respiratory Therapy", href: "/career-journey/rrt", platform: "applynest", description: "Step-by-step career path from certification to advancement" },
    ],
    faqs: [
      { question: "How long does it take to become a Respiratory Therapist?", answer: "Associate degree programs take 2 years, while bachelor's degree programs take 4 years. Most entry-level positions require at minimum an associate degree from a CoARC-accredited program, though bachelor's degrees are increasingly preferred." },
      { question: "What is the difference between CRT and RRT?", answer: "The Certified Respiratory Therapist (CRT) is the entry-level credential earned by passing the TMC exam at the low-cut score. The Registered Respiratory Therapist (RRT) requires passing at the high-cut score and completing the Clinical Simulation Exam. Most employers prefer or require the RRT credential." },
      { question: "What does a Respiratory Therapist do differently from a nurse?", answer: "Respiratory therapists specialize in cardiopulmonary care — ventilator management, airway management, ABG interpretation, pulmonary function testing, and respiratory medication delivery. While nurses provide broader patient care, RTs have deeper expertise in respiratory assessment and intervention." },
      { question: "Is respiratory therapy a good career?", answer: "Yes. With 13% projected job growth, competitive salaries ($55,000-$85,000+), and the ability to work in diverse settings from ICUs to outpatient clinics, respiratory therapy offers excellent career prospects and job satisfaction." },
      { question: "What certifications should I pursue after becoming an RRT?", answer: "Valuable specialty certifications include ACCS (Adult Critical Care Specialist), NPS (Neonatal/Pediatric Specialist), SDS (Sleep Disorders Specialist), and RPFT (Registered Pulmonary Function Technologist). These enhance your expertise and earning potential." },
      { question: "Can Respiratory Therapists work in Canada and the US?", answer: "Each country has its own credentialing process. Canadian RTs write the CBRC exam, while American RTs write the NBRC TMC/CSE. Some reciprocity arrangements exist, but you typically need to meet the credentialing requirements of the country where you wish to practice." },
    ],
    relatedGuides: ["complete-guide-to-becoming-a-registered-nurse", "complete-guide-to-becoming-a-paramedic"],
  },
  {
    slug: "complete-guide-to-becoming-a-paramedic",
    title: "Complete Guide to Becoming a Paramedic",
    metaTitle: "Complete Guide to Becoming a Paramedic | NREMT & COPR Exam Prep, Career Path & Salary",
    metaDescription: "Everything you need to become a Paramedic: NREMT and COPR exam preparation, trauma management skills, ACLS/PALS protocols, first-year survival guide, and career advancement strategies.",
    keywords: "how to become a paramedic, paramedic career guide, NREMT exam preparation, COPR exam, paramedic career path, paramedic salary, emergency medical services, EMS career",
    heroSubtitle: "Your complete roadmap to a career in paramedicine — from mastering the NREMT or COPR exam to excelling in emergency medicine and building a rewarding EMS career.",
    color: "#F44336",
    colorAccent: "#FFEBEE",
    introduction: "Paramedics are the front line of emergency healthcare, providing critical medical care in the most challenging environments — from highway collisions and cardiac arrests to pediatric emergencies and natural disasters. As an Advanced Care Paramedic or Paramedic, you will make life-or-death decisions under pressure, administer life-saving medications, perform advanced procedures, and transport patients to definitive care. This high-stakes, high-reward profession demands exceptional clinical knowledge, rapid decision-making, and emotional resilience. This comprehensive guide covers every stage of the paramedic career path — from certification exams and clinical readiness through your first year in the field to long-term career advancement.",
    examPrepSection: {
      id: "exam-preparation",
      title: "NREMT, COPR and Provincial Exam Preparation",
      content: "In the United States, paramedics must pass the National Registry of Emergency Medical Technicians (NREMT) exam, a computer-adaptive test covering airway and breathing, cardiology and resuscitation, trauma, medical emergencies, and EMS operations. The exam adapts to your ability level and requires demonstrating competency across all domains.\n\nCanadian paramedics write the Canadian Organization of Paramedic Regulators (COPR) exam or provincial equivalents, which assess competency within the National Occupational Competency Profile (NOCP). Both Primary Care Paramedic (PCP) and Advanced Care Paramedic (ACP) levels have distinct exam requirements reflecting their different scopes of practice.\n\nEffective exam preparation requires mastering trauma assessment algorithms (ITLS/PHTLS), cardiac rhythm interpretation, pharmacology (drug calculations, indications, contraindications), pediatric assessment and management (PALS), and medical emergency protocols. Use scenario-based practice questions that require integrating multiple clinical concepts, and study the clinical decision-making frameworks used in prehospital medicine. Time-pressured mock exams help build the rapid assessment skills essential for both the exam and field practice.",
    },
    clinicalTransitionSection: {
      id: "clinical-transition",
      title: "First-Year Field Transition",
      content: "The transition from paramedic student to independent field practitioner is intense. Unlike hospital-based healthcare, prehospital medicine requires making critical decisions with limited resources, no immediate physician backup, and in physically demanding environments. New paramedics often describe their first unsupervised cardiac arrest, pediatric emergency, or major trauma call as defining moments in their career.\n\nDuring your orientation period, focus on building confidence in the systematic approach to patient assessment (ABCDE), refining your psychomotor skills (intubation, IV access, cardiac monitoring), and developing situational awareness on scene. Learn your service's protocols thoroughly — medical directives and standing orders define your scope of practice in the field.\n\nPartner with experienced paramedics who can debrief calls with you and provide constructive feedback. Critical incident stress management (CISM) is essential in EMS — learn to recognize signs of cumulative stress, compassion fatigue, and PTSD, and access peer support resources proactively.",
    },
    careerPlacementSection: {
      id: "career-placement",
      title: "Job Search and Career Placement",
      content: "The demand for paramedics is projected to grow 5% through 2032, with significant variation by region. Municipal ambulance services, fire departments with EMS divisions, private ambulance companies, hospital-based transport teams, and industrial/remote site operations all employ paramedics.\n\nYour resume should highlight clinical rotation hours, patient contact numbers, specific procedures performed (intubation, IO access, cardioversion, medication administration), and any specialized training (ITLS, ACLS, PALS, AMLS, PHTLS). Emphasize your physical fitness, driver training certifications, and ability to work in team-based environments.\n\nCareer advancement includes flight paramedic/critical care transport, tactical (SWAT) medic, community paramedicine, EMS education, and leadership roles (field supervisor, operations manager, EMS chief). Many paramedics use their clinical experience as a foundation for transitioning into nursing, physician assistant, or medical school programs. The average paramedic salary ranges from $40,000 to $70,000, with flight paramedics and supervisors earning significantly more.",
    },
    additionalSections: [
      {
        id: "ems-culture",
        title: "Navigating EMS Culture and Wellness",
        content: "Emergency medical services has a unique workplace culture built around teamwork, camaraderie, and shared challenging experiences. While this culture provides strong peer support, it can also normalize unhealthy coping mechanisms and discourage seeking help for mental health challenges. Research shows that paramedics experience PTSD, depression, and burnout at significantly higher rates than the general population.\n\nPrioritize your physical and mental health from the start of your career. Develop healthy sleep habits (especially important for shift workers), maintain physical fitness, build relationships outside of EMS, and access employee assistance programs and peer support services when needed. A long, sustainable career in paramedicine requires intentional wellness practices.",
      },
    ],
    resources: [
      { label: "Paramedic Practice Questions", href: "/paramedic-practice-questions", platform: "nursenest", description: "Exam-authentic questions covering all NREMT/COPR domains" },
      { label: "Paramedic Exam Study Guide", href: "/paramedic-exam-study-guide", platform: "nursenest", description: "Comprehensive study guide for paramedic certification exams" },
      { label: "Trauma Algorithm Simulator", href: "/paramedic/trauma-algorithm", platform: "nursenest", description: "Interactive trauma assessment and management practice" },
      { label: "ECG Recognition Drill", href: "/paramedic/ecg-drill", platform: "nursenest", description: "Cardiac rhythm identification with progressive difficulty" },
      { label: "Paramedic Authority Hub", href: "/paramedic", platform: "nursenest", description: "Complete paramedic exam prep and study resources" },
      { label: "New Grad Paramedic Hub", href: "/new-grad/paramedic", platform: "newgrad", description: "First-year EMS survival guide and clinical transition resources" },
      { label: "EMS Interview Prep", href: "/new-grad#interview-lab", platform: "applynest", description: "Behavioral and scenario-based interview questions for EMS" },
      { label: "Paramedic Resume Builder", href: "/new-grad#resume-builder", platform: "applynest", description: "EMS-specific resume templates for paramedic positions" },
      { label: "Career Journey: Paramedic", href: "/career-journey/paramedic", platform: "applynest", description: "Step-by-step career path from certification to advancement" },
    ],
    faqs: [
      { question: "How long does it take to become a Paramedic?", answer: "Primary Care Paramedic (PCP/EMT-Intermediate) programs take 1-2 years, while Advanced Care Paramedic (ACP/Paramedic) programs take 2-4 years depending on the educational institution and whether you are building on prior PCP certification." },
      { question: "What is the difference between an EMT and a Paramedic?", answer: "EMTs (or PCPs in Canada) provide basic life support including BVM ventilation, splinting, CPR, and basic medication administration. Paramedics (ACPs) have an expanded scope including advanced airway management, IV/IO access, cardiac monitoring, cardioversion, and a broader medication formulary." },
      { question: "Is paramedicine physically demanding?", answer: "Yes. Paramedics regularly lift patients and equipment, work in extreme weather, perform CPR for extended periods, and navigate challenging physical environments. Maintaining physical fitness is essential for both performance and injury prevention." },
      { question: "What is the NREMT pass rate?", answer: "The first-attempt NREMT pass rate varies by level. For the Paramedic level, first-time pass rates are approximately 70%. Structured preparation with practice exams and scenario-based study significantly improves your chances of passing on the first attempt." },
      { question: "Can paramedics specialize?", answer: "Yes. Specialization options include flight/critical care transport, tactical (SWAT) medicine, community paramedicine, wilderness medicine, and disaster response. Many specializations require additional certifications and clinical experience." },
      { question: "What shift schedules do paramedics work?", answer: "Shift schedules vary by service but commonly include 12-hour shifts (day/night rotation), 24-hour shifts, or variations like 48/96 schedules. Shift work is a fundamental aspect of EMS that requires adaptation and healthy sleep hygiene practices." },
    ],
    relatedGuides: ["complete-guide-to-becoming-a-registered-nurse", "complete-guide-to-becoming-a-respiratory-therapist"],
  },
  {
    slug: "complete-guide-to-becoming-a-medical-lab-technologist",
    title: "Complete Guide to Becoming a Medical Lab Technologist (MLT)",
    metaTitle: "Complete Guide to Becoming a Medical Lab Technologist | CSMLS & ASCP Exam Prep, Career Path & Salary",
    metaDescription: "Everything you need to become a Medical Laboratory Technologist: CSMLS and ASCP certification exam preparation, laboratory skills guide, clinical transition tips, and career advancement strategies.",
    keywords: "how to become a medical lab technologist, MLT career guide, CSMLS exam preparation, ASCP MLS exam, medical laboratory science career, MLT salary, clinical laboratory, hematology microbiology",
    heroSubtitle: "Your complete roadmap to medical laboratory science — from passing the CSMLS or ASCP certification exam to mastering laboratory techniques and building expertise in diagnostic medicine.",
    color: "#9C27B0",
    colorAccent: "#F3E5F5",
    introduction: "Medical Laboratory Technologists (MLTs) are the healthcare professionals behind every diagnosis. While physicians order tests and interpret results, it is the MLT who performs the complex analyses that generate those results — from blood banking crossmatches that prevent fatal transfusion reactions to microbiology cultures that identify life-threatening infections. MLTs work in clinical chemistry, hematology, microbiology, immunohematology (blood banking), urinalysis, molecular diagnostics, and more. With a growing shortage of qualified laboratory professionals and increasing demand for diagnostic testing, medical laboratory science offers outstanding career stability, competitive compensation, and the satisfaction of contributing to virtually every patient's care. This guide covers the complete MLT career path from certification through clinical practice to career advancement.",
    examPrepSection: {
      id: "exam-preparation",
      title: "CSMLS and ASCP Certification Exam Preparation",
      content: "Canadian MLT graduates write the Canadian Society for Medical Laboratory Science (CSMLS) certification exam, which covers clinical chemistry, hematology, hemostasis, microbiology, immunohematology, urinalysis, histotechnology, and laboratory management. The exam uses multiple-choice questions, case studies, and image-based identification items.\n\nAmerican medical laboratory science graduates write the ASCP Board of Certification exam (MLS or MLT level). The MLS exam covers clinical chemistry, hematology/hemostasis, immunohematology/blood banking, microbiology, urinalysis/body fluids, immunology/serology, molecular diagnostics, and laboratory operations.\n\nEffective exam preparation requires mastering both theoretical knowledge and practical application. Study cell morphology identification (peripheral blood smears, body fluids), quality control procedures (Westgard rules, Levy-Jennings charts), blood banking compatibility testing, gram stain interpretation, and clinical chemistry correlations. Use image-based practice questions to develop rapid morphology recognition skills, and study clinical case scenarios that require integrating results from multiple laboratory departments.",
    },
    clinicalTransitionSection: {
      id: "clinical-transition",
      title: "First-Year Laboratory Transition",
      content: "New graduate MLTs often describe the transition from student rotations to independent bench work as overwhelming. In training, you typically work on one department at a time with an instructor nearby. In practice, you may rotate through multiple departments, troubleshoot unexpected results independently, and manage critical value communication — all while maintaining accuracy and meeting turnaround time expectations.\n\nDuring your first year, focus on building speed without sacrificing accuracy. Develop systematic workflows for each department, learn your laboratory information system (LIS) thoroughly, and understand quality management procedures including daily QC, proficiency testing, and instrument maintenance. Critical value reporting — knowing what constitutes a critical result and who to notify — is one of the most important clinical responsibilities you will have.\n\nBuild relationships with colleagues across departments, as collaborative problem-solving is essential when results don't make clinical sense. Learn to correlate results across departments (for example, connecting an elevated D-dimer with abnormal coagulation studies and a low platelet count to suspect DIC).",
    },
    careerPlacementSection: {
      id: "career-placement",
      title: "Job Search and Career Placement",
      content: "Medical laboratory science faces a significant workforce shortage, with retirement rates outpacing new graduates. This supply-demand imbalance creates exceptional job security and negotiating power for qualified MLTs. Hospitals, reference laboratories, public health laboratories, research institutions, and point-of-care testing programs all employ MLTs.\n\nYour resume should highlight clinical rotation hours in each major department, specific instruments you are proficient with (Beckman Coulter, Siemens, Abbott, Roche), quality management experience, and any research or specialized training. Emphasize proficiency in critical areas like blood banking (antibody identification, crossmatching) and microbiology (gram stain, culture identification, susceptibility testing).\n\nCareer advancement includes specialization in molecular diagnostics, flow cytometry, HLA typing, forensic science, or laboratory management. Advanced roles include charge technologist, laboratory supervisor, quality manager, laboratory director (with additional education), or transition into laboratory sales, applications specialist, or healthcare informatics. Graduate education in clinical laboratory science, healthcare administration, or public health opens additional leadership pathways. The average MLT salary ranges from $50,000 to $80,000, with specialized and management roles exceeding $90,000.",
    },
    additionalSections: [
      {
        id: "laboratory-departments",
        title: "Understanding Laboratory Departments",
        content: "Clinical laboratories are organized into specialized departments, each requiring distinct knowledge and skills. Clinical Chemistry analyzes blood and body fluid components (electrolytes, enzymes, hormones, therapeutic drugs) using automated analyzers. Hematology examines blood cells through complete blood counts, differential counts, and peripheral blood smear microscopy. Hemostasis/Coagulation evaluates the clotting system using tests like PT/INR, aPTT, and D-dimer.\n\nMicrobiology identifies infectious organisms through culture, staining, biochemical testing, and antimicrobial susceptibility testing. Immunohematology (Blood Banking) ensures safe blood transfusions through ABO/Rh typing, antibody screening, and crossmatching. Urinalysis examines urine for chemical, microscopic, and physical abnormalities. Molecular Diagnostics uses DNA/RNA-based testing for genetic disorders, infectious diseases, and cancer markers. Understanding how these departments interconnect is essential for providing comprehensive diagnostic information.",
      },
    ],
    resources: [
      { label: "MLT Practice Questions", href: "/mlt-practice-questions", platform: "nursenest", description: "Exam-authentic questions covering all CSMLS/ASCP domains" },
      { label: "MLT Exam Study Guide", href: "/mlt-exam-study-guide", platform: "nursenest", description: "Comprehensive study guide for MLT certification exams" },
      { label: "Lab Critical Value Engine", href: "/mlt/lab-critical", platform: "nursenest", description: "Practice recognizing and responding to critical laboratory values" },
      { label: "Morphology Drill", href: "/mlt/morphology-drill", platform: "nursenest", description: "Cell morphology identification with image-based practice" },
      { label: "MLT Complete Guide", href: "/mlt/complete-guide-medical-laboratory-science", platform: "nursenest", description: "In-depth medical laboratory science study resources" },
      { label: "Order of the Draw", href: "/order-of-the-draw", platform: "nursenest", description: "Interactive guide to specimen collection tube order" },
      { label: "New Grad MLT Hub", href: "/new-grad/medical-laboratory", platform: "newgrad", description: "First-year lab transition guide and clinical confidence tools" },
      { label: "MLT Interview Prep", href: "/new-grad#interview-lab", platform: "applynest", description: "Technical and behavioral interview questions for laboratory positions" },
      { label: "Lab Resume Builder", href: "/new-grad#resume-builder", platform: "applynest", description: "MLT-specific resume templates highlighting laboratory competencies" },
    ],
    faqs: [
      { question: "How long does it take to become a Medical Lab Technologist?", answer: "MLT programs are typically 3-4 years at the bachelor's degree level (required for ASCP MLS or CSMLS MLT certification). Some jurisdictions offer a 2-year Medical Laboratory Technician (MLT) pathway at the associate degree level with a more limited scope." },
      { question: "What is the difference between MLT and MLS?", answer: "In the US, MLS (Medical Laboratory Scientist) refers to the bachelor's-level certification (formerly MT), while MLT (Medical Laboratory Technician) refers to the associate-level certification. In Canada, MLT (Medical Laboratory Technologist) is the primary credential equivalent to the US MLS." },
      { question: "Is there a shortage of lab technologists?", answer: "Yes, there is a significant and growing shortage. The vacancy rate for MLT positions exceeds 10% nationally, driven by retirements outpacing new graduates. This shortage creates excellent job security and competitive salaries for qualified candidates." },
      { question: "What are the most challenging lab departments?", answer: "Blood banking (immunohematology) and microbiology are generally considered the most challenging departments due to their complexity and the critical nature of results. Blood banking errors can cause fatal transfusion reactions, while microbiology requires extensive organism identification skills." },
      { question: "Can MLTs work in research?", answer: "Yes. MLTs are valued in clinical research laboratories, pharmaceutical companies, biotechnology firms, and academic research institutions. Research roles may focus on molecular diagnostics, immunology, genomics, or clinical trials support." },
      { question: "What certifications can MLTs pursue for advancement?", answer: "Specialty certifications include Specialist in Blood Banking (SBB), Specialist in Microbiology (SM), Specialist in Chemistry (SC), Specialist in Hematology (SH), and certifications in Molecular Biology, Cytogenetics, and Flow Cytometry. These enhance expertise and compensation." },
    ],
    relatedGuides: ["complete-guide-to-becoming-a-registered-nurse", "complete-guide-to-becoming-a-respiratory-therapist"],
  },
];

export function getGuideBySlug(slug: string): AuthorityGuide | undefined {
  return AUTHORITY_GUIDES.find(g => g.slug === slug);
}

export function getAllGuideSlugs(): string[] {
  return AUTHORITY_GUIDES.map(g => g.slug);
}
