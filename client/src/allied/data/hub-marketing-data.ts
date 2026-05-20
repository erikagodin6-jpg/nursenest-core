export interface SalaryRange {
  entry: string;
  median: string;
  experienced: string;
  source: string;
}

export interface LicensingStep {
  step: number;
  title: string;
  description: string;
}

export interface JobOutlook {
  growthRate: string;
  growthPeriod: string;
  openingsPerYear: string;
  demandLevel: "High" | "Very High" | "Moderate" | "Growing";
  source: string;
}

export interface DayInTheLife {
  title: string;
  narrative: string;
  typicalTasks: string[];
}

export interface ExamPrepTip {
  title: string;
  description: string;
}

export interface InstructorBio {
  name: string;
  credentials: string;
  specialty: string;
  bio: string;
}

export interface PlatformStats {
  totalQuestions: string;
  totalLessons: string;
  flashcardDecks: string;
  mockExams: string;
}

export interface HubTestimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

export interface HubFaqItem {
  question: string;
  answer: string;
}

export interface CareerBenefit {
  title: string;
  description: string;
}

export interface HubMarketingData {
  careerOverview: string;
  whyChoose: string;
  salary: SalaryRange;
  licensingPathway: LicensingStep[];
  jobOutlook: JobOutlook;
  benefits: CareerBenefit[];
  dayInTheLife: DayInTheLife;
  examPrepTips: ExamPrepTip[];
  instructors: InstructorBio[];
  platformStats: PlatformStats;
  testimonials: HubTestimonial[];
  faq: HubFaqItem[];
}

export const HUB_MARKETING: Record<string, HubMarketingData> = {
  rrt: {
    careerOverview: "Registered Respiratory Therapists (RRTs) are specialized healthcare professionals who assess, treat, and manage patients with cardiopulmonary disorders. From neonatal ICUs to adult critical care units, RRTs play a vital role in airway management, mechanical ventilation, oxygen therapy, and pulmonary rehabilitation. The profession requires strong clinical judgment, technical proficiency with complex equipment, and the ability to respond rapidly in life-threatening situations.",
    whyChoose: "Respiratory therapy offers a dynamic healthcare career with hands-on patient care, strong job security, and the opportunity to work across diverse clinical settings. RRTs are essential members of every critical care team, providing life-saving interventions for patients with COPD, asthma, pneumonia, and acute respiratory failure. The profession offers competitive salaries, flexible scheduling, and opportunities for specialization in neonatal care, sleep medicine, pulmonary function testing, and critical care transport.",
    salary: {
      entry: "$52,000 – $60,000",
      median: "$62,810",
      experienced: "$75,000 – $95,000",
      source: "U.S. Bureau of Labor Statistics, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Complete an Accredited RT Program", description: "Earn an associate's or bachelor's degree from a CoARC-accredited respiratory therapy program (typically 2–4 years)." },
      { step: 2, title: "Pass the TMC Exam", description: "The Therapist Multiple-Choice (TMC) exam, administered by the NBRC, tests foundational respiratory therapy knowledge." },
      { step: 3, title: "Pass the Clinical Simulation Exam (CSE)", description: "The CSE tests your ability to manage clinical scenarios and is required for the RRT credential." },
      { step: 4, title: "Obtain State Licensure", description: "Most states require licensure or registration beyond NBRC credentials. Requirements vary by state." },
      { step: 5, title: "Maintain Continuing Education", description: "Complete continuing education credits to maintain your RRT credential and state licensure." },
    ],
    jobOutlook: {
      growthRate: "14%",
      growthPeriod: "2022–2032",
      openingsPerYear: "8,800",
      demandLevel: "Very High",
      source: "U.S. Bureau of Labor Statistics",
    },
    benefits: [
      { title: "Critical Care Impact", description: "Work directly with patients in ICUs, emergency departments, and NICUs, providing life-saving respiratory interventions." },
      { title: "Flexible Career Paths", description: "Specialize in neonatal care, sleep medicine, pulmonary rehab, critical care transport, or education." },
      { title: "Strong Job Market", description: "14% projected growth rate means excellent job security and opportunities across the country." },
      { title: "Team-Based Medicine", description: "Collaborate closely with physicians, nurses, and other healthcare professionals in fast-paced clinical environments." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of an RRT",
      narrative: "Your shift begins at 6:45 AM with a handoff report from the night team. You review ventilator settings for your ICU patients, assess ABG results drawn at 6 AM, and adjust FiO2 on a COPD patient whose PaO2 has dropped. By 8 AM, you're performing a bronchoscopy assist in the procedure suite. Mid-morning brings a rapid response call — a post-surgical patient in respiratory distress needs emergent intubation. You secure the airway, set up the ventilator, and coordinate with the intensivist on initial settings. After lunch, you round on your NICU patients, adjusting CPAP settings on a 32-week preemie, then conduct a pulmonary function test in the outpatient lab. Your day ends with thorough charting and a detailed handoff to the evening shift.",
      typicalTasks: [
        "Assess patients and interpret ABG results",
        "Manage mechanical ventilators and adjust settings",
        "Administer aerosolized medications and oxygen therapy",
        "Perform bronchoscopy assistance and airway management",
        "Conduct pulmonary function testing",
        "Respond to rapid response and code blue events",
        "Educate patients on inhaler technique and home oxygen",
        "Collaborate with physicians on weaning protocols",
      ],
    },
    examPrepTips: [
      { title: "Master ABG Interpretation", description: "ABG analysis appears on nearly every section of the TMC and CSE. Practice systematic interpretation using the Romaine method until it becomes second nature." },
      { title: "Know Your Ventilator Modes", description: "Understand AC, SIMV, PSV, APRV, and HFOV — including when to initiate, adjust, and troubleshoot each mode." },
      { title: "Practice Clinical Simulations", description: "The CSE tests decision-making in realistic scenarios. Practice branching logic questions that simulate patient management decisions." },
      { title: "Study Neonatal/Pediatric Content", description: "Don't overlook NICU-specific content. Surfactant therapy, CPAP management, and neonatal resuscitation are high-yield topics." },
      { title: "Use Spaced Repetition for Pharmacology", description: "Bronchodilators, corticosteroids, and mucolytics are tested frequently. Use flashcards with spaced repetition to lock in drug names, doses, and side effects." },
    ],
    instructors: [
      { name: "Dr. Sarah Chen, PhD, RRT-NPS", credentials: "PhD in Respiratory Care, RRT-NPS, AE-C", specialty: "Neonatal & Pediatric Respiratory Care", bio: "Dr. Chen has 15 years of clinical experience in level IV NICUs and currently teaches respiratory physiology at a major university respiratory care program." },
      { name: "Marcus Williams, MS, RRT-ACCS", credentials: "MS in Health Sciences, RRT-ACCS, CPFT", specialty: "Adult Critical Care & Ventilator Management", bio: "Marcus spent 12 years as a senior respiratory therapist in trauma ICUs and now develops advanced ventilator management curricula for respiratory care education." },
    ],
    platformStats: {
      totalQuestions: "500+",
      totalLessons: "120+",
      flashcardDecks: "45+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The ABG interpretation drills alone were worth it. I went from guessing on acid-base questions to getting them right consistently. The rationales actually explain the clinical reasoning, not just the answer.", name: "Jordan T.", role: "RRT Student, Texas", rating: 5 },
      { quote: "I used two other platforms before NurseNest Allied. The difference is the depth of the rationales and the ventilator mode simulator. It made the CSE feel familiar instead of intimidating.", name: "Priya M.", role: "New Grad RRT, California", rating: 5 },
      { quote: "The mock exams are weighted to the actual NBRC blueprint, which none of the free resources do. I passed the TMC on my first attempt with a high-cut score.", name: "Alex R.", role: "RRT, Florida", rating: 5 },
    ],
    faq: [
      { question: "What exams does NurseNest Allied cover for respiratory therapy?", answer: "NurseNest Allied covers the NBRC Therapist Multiple-Choice (TMC) exam and the Clinical Simulation Exam (CSE). Our questions are mapped to the official NBRC exam blueprint, and our mock exams simulate both the TMC format and the branching-logic CSE format. We also cover the CBRC exam for Canadian respiratory therapists." },
      { question: "How are the respiratory therapy questions different from generic test banks?", answer: "Every question includes a 600+ word rationale that explains the clinical reasoning — not just which answer is correct. Questions cover ABG interpretation, ventilator management, pharmacology, and patient assessment in the depth you need for the TMC and CSE." },
      { question: "Does the platform cover ventilator management?", answer: "Yes. We have an interactive Ventilator Mode Simulator that lets you practice adjusting settings and interpreting waveforms. The question bank also includes hundreds of ventilator management scenarios across AC, SIMV, PSV, APRV, and HFOV modes." },
      { question: "Is the content aligned with the NBRC exam blueprint?", answer: "Yes. Our question bank and mock exams are mapped to the current NBRC TMC and CSE exam blueprints. Each practice session shows your performance by exam domain so you can target weak areas." },
      { question: "Can I practice ABG interpretation?", answer: "Absolutely. Our ABG Interpretation Engine provides unlimited ABG scenarios with step-by-step feedback on acid-base classification, compensation analysis, and clinical decision-making. It's one of the most popular tools on the platform." },
      { question: "How many questions are available for respiratory therapy?", answer: "We currently have 500+ respiratory therapy exam questions with a roadmap to 2,000+. New questions are added weekly and reviewed by practicing RRTs and respiratory care educators." },
      { question: "Is there a free option to try before subscribing?", answer: "Yes. You can take a free 15-question diagnostic assessment to see your readiness score and domain breakdown. You also get 5 free practice questions to experience the depth of our rationales." },
      { question: "Does NurseNest Allied cover the CBRC exam for Canadian students?", answer: "Yes. Our platform includes content relevant to the Canadian Board for Respiratory Care (CBRC) exam. You can toggle between US and Canadian exam tracks to see region-specific content and regulatory information." },
      { question: "What study tools are included beyond the question bank?", answer: "In addition to the question bank, you get unlimited blueprint-weighted mock exams, spaced repetition flashcards, a personalized study planner, the ABG Interpretation Engine, Ventilator Mode Simulator, case simulations, and detailed performance analytics." },
      { question: "Can I study on my phone?", answer: "Yes. NurseNest Allied is fully responsive and works on phones, tablets, and desktop computers. Study anywhere, anytime — your progress syncs across all devices." },
    ],
  },

  paramedic: {
    careerOverview: "Paramedics are frontline emergency medical professionals who provide advanced pre-hospital care in high-pressure environments. From cardiac arrests and trauma to medical emergencies and pediatric crises, paramedics must make rapid clinical decisions with limited resources. The role demands proficiency in advanced airway management, cardiac monitoring, pharmacology, and patient assessment — skills tested rigorously on certification exams like the NREMT and COPR.",
    whyChoose: "A career in paramedicine offers unmatched variety, adrenaline, and the ability to make immediate, life-saving differences. No two shifts are the same, and the profession provides opportunities across ground EMS, flight medicine, tactical medicine, community paramedicine, and critical care transport. With growing demand for pre-hospital care providers and expanding scopes of practice, paramedicine offers strong career growth and the satisfaction of direct patient impact.",
    salary: {
      entry: "$35,000 – $42,000",
      median: "$49,000",
      experienced: "$60,000 – $85,000",
      source: "U.S. Bureau of Labor Statistics, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Complete an Accredited Paramedic Program", description: "Complete a CAAHEP-accredited paramedic program (typically 1–2 years, or a degree program)." },
      { step: 2, title: "Complete Clinical & Field Internship Hours", description: "Accumulate required clinical rotations in hospitals and field internship hours on an ambulance." },
      { step: 3, title: "Pass the NREMT Cognitive Exam", description: "Pass the National Registry of Emergency Medical Technicians computer-adaptive paramedic exam." },
      { step: 4, title: "Pass the NREMT Psychomotor Exam", description: "Demonstrate competency in hands-on skills stations including patient assessment, cardiac management, and airway management." },
      { step: 5, title: "Obtain State/Provincial Licensure", description: "Apply for state EMS licensure (US) or provincial certification (Canada) based on NREMT or COPR results." },
    ],
    jobOutlook: {
      growthRate: "5%",
      growthPeriod: "2022–2032",
      openingsPerYear: "17,400",
      demandLevel: "High",
      source: "U.S. Bureau of Labor Statistics",
    },
    benefits: [
      { title: "Immediate Patient Impact", description: "Provide life-saving care in the field where every second counts and your interventions directly affect patient outcomes." },
      { title: "Dynamic Work Environment", description: "No two calls are the same — respond to trauma, cardiac events, pediatric emergencies, and medical crises across diverse settings." },
      { title: "Career Advancement", description: "Advance into flight medicine, critical care transport, community paramedicine, tactical EMS, or fire service leadership." },
      { title: "Team Camaraderie", description: "Build strong bonds with your crew and the broader first responder community through shared challenging experiences." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of a Paramedic",
      narrative: "Your 12-hour shift starts at 7 AM with a vehicle check — oxygen levels, medication expiration dates, cardiac monitor batteries, and airway equipment. By 7:30, your first call comes in: a 68-year-old male with chest pain. You obtain a 12-lead ECG en route, identify ST elevation in leads II, III, and aVF, and activate a STEMI alert. At the ED, you give a concise handoff to the cardiology team. Before lunch, you respond to a multi-vehicle accident, triaging three patients and managing a patient with a tension pneumothorax using needle decompression. The afternoon brings a pediatric seizure call where you administer intranasal midazolam and monitor the child's airway during transport. Between calls, you restock supplies, complete patient care reports, and review protocols with your partner.",
      typicalTasks: [
        "Perform patient assessments in the field",
        "Obtain and interpret 12-lead ECGs",
        "Manage advanced airways (intubation, supraglottic devices)",
        "Administer medications via IV, IO, and intranasal routes",
        "Perform needle decompression and other critical interventions",
        "Triage multiple patients at mass casualty incidents",
        "Complete detailed patient care reports",
        "Maintain and check ambulance equipment daily",
      ],
    },
    examPrepTips: [
      { title: "Focus on Patient Assessment", description: "Patient assessment is the foundation of every NREMT question. Master the primary and secondary survey until the sequence is automatic." },
      { title: "Know Your Cardiac Rhythms", description: "ECG interpretation is heavily tested. Be able to identify all lethal rhythms, STEMI patterns, and common dysrhythmias at a glance." },
      { title: "Master Pharmacology Dosages", description: "Know drug names, doses, routes, indications, and contraindications cold. Use flashcards with spaced repetition for high-yield medications." },
      { title: "Practice CAT-Style Questions", description: "The NREMT uses computer-adaptive testing. Practice with adaptive test banks that adjust difficulty based on your performance." },
      { title: "Don't Neglect Operations and Ethics", description: "Questions on scene safety, triage protocols, documentation, and ethical decision-making appear on every exam. Don't skip these domains." },
    ],
    instructors: [
      { name: "Captain James Rivera, NRP, FP-C", credentials: "NRP, FP-C, CCP-C, CCEMTP", specialty: "Critical Care Transport & Flight Medicine", bio: "Captain Rivera has 18 years of EMS experience including 10 years in critical care transport and flight paramedicine. He has trained over 500 paramedic students." },
      { name: "Dr. Anika Patel, MD, FACEP", credentials: "MD, FACEP, EMS Medical Director", specialty: "Emergency Medicine & EMS Education", bio: "Dr. Patel serves as an EMS medical director and emergency physician with expertise in pre-hospital protocols and paramedic education curriculum development." },
    ],
    platformStats: {
      totalQuestions: "500+",
      totalLessons: "100+",
      flashcardDecks: "40+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The clinical scenario simulations prepared me better than any textbook. Going through dispatch-to-disposition scenarios with branching decisions made the NREMT feel like a routine call.", name: "Tyler K.", role: "Newly Certified Paramedic, Ohio", rating: 5 },
      { quote: "I failed my first NREMT attempt using a different platform. NurseNest's adaptive questions identified my weak areas in pharmacology and cardiac, and I drilled those domains until I was confident. Passed on my second attempt.", name: "Maria S.", role: "Paramedic Student, Arizona", rating: 5 },
      { quote: "As a Canadian PCP student, finding quality prep material aligned with COPR was nearly impossible until NurseNest Allied. The region toggle for Canadian protocols is a game-changer.", name: "Derek L.", role: "PCP Student, Alberta", rating: 5 },
    ],
    faq: [
      { question: "Does NurseNest Allied cover both NREMT and COPR exams?", answer: "Yes. Our paramedic content covers both the US-based NREMT (EMT, AEMT, Paramedic) and Canadian COPR/provincial exams (PCP, ACP). Use the region toggle to see exam-specific content, protocols, and regulatory information for your certification track." },
      { question: "Are the questions aligned with the NREMT blueprint?", answer: "Yes. Our question bank and mock exams are mapped to the current NREMT paramedic exam blueprint domains including airway, cardiology, trauma, medical, OB/peds, and operations. Each practice session shows domain-level performance." },
      { question: "Does the platform include ECG interpretation practice?", answer: "Yes. Our ECG Recognition Drill provides unlimited rhythm identification practice with progressive difficulty levels. The question bank also includes hundreds of 12-lead ECG interpretation scenarios." },
      { question: "How do the mock exams simulate the NREMT CAT format?", answer: "Our adaptive mock exams use computer-adaptive testing logic similar to the NREMT. Question difficulty adjusts based on your performance, and the exam ends when statistical confidence in your ability level is established." },
      { question: "Is there content for trauma assessment and management?", answer: "Absolutely. Trauma is one of our most comprehensive domains, covering primary/secondary surveys, hemorrhage control, spinal motion restriction, chest trauma management, and multi-system trauma scenarios." },
      { question: "Can I practice pharmacology calculations?", answer: "Yes. The question bank includes dosage calculation scenarios for weight-based dosing, drip rate calculations, and concentration-based medication administration. Flashcard decks cover all NREMT-tested medications." },
      { question: "How many practice questions are available for paramedic?", answer: "We currently have 500+ paramedic-specific questions with a roadmap to 2,000+. Questions are reviewed by practicing paramedics, flight medics, and EMS medical directors." },
      { question: "Is there a free trial available?", answer: "Yes. Take a free 15-question diagnostic assessment and access 5 free practice questions with full rationales. No credit card required." },
      { question: "Does the platform cover pediatric and OB emergencies?", answer: "Yes. We have dedicated question sets for pediatric assessment, PALS algorithms, neonatal resuscitation, OB emergencies including eclampsia and postpartum hemorrhage, and age-specific pharmacology." },
      { question: "Can I study on mobile devices?", answer: "Yes. NurseNest Allied is fully responsive. Study on your phone between calls, review flashcards on your tablet, or take full mock exams on desktop. Progress syncs across all devices." },
    ],
  },

  "pharmacy-tech": {
    careerOverview: "Pharmacy Technicians are essential members of the pharmacy team who assist pharmacists in dispensing medications, managing inventory, compounding prescriptions, and ensuring patient safety. Working in retail pharmacies, hospitals, long-term care facilities, and specialty pharmacies, pharmacy technicians handle prescription processing, insurance billing, sterile compounding, and medication distribution. Certification through the PTCB or ExCPT demonstrates competency and is required or preferred in most states.",
    whyChoose: "Pharmacy technology offers a stable, in-demand healthcare career with multiple specialization paths and room for advancement. The profession provides the opportunity to work in diverse settings — from community pharmacies to hospital IV rooms to nuclear pharmacy. With the healthcare system increasingly relying on pharmacy technicians for expanded roles including medication therapy management support and immunization assistance, the career offers growing responsibilities and professional development.",
    salary: {
      entry: "$30,000 – $34,000",
      median: "$37,790",
      experienced: "$42,000 – $52,000",
      source: "U.S. Bureau of Labor Statistics, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Complete Education Requirements", description: "Complete a PTCB-recognized education/training program or equivalent work experience as defined by your state." },
      { step: 2, title: "Pass the PTCB or ExCPT Exam", description: "Pass the Pharmacy Technician Certification Board (PTCB) exam or the Exam for the Certification of Pharmacy Technicians (ExCPT)." },
      { step: 3, title: "Register with Your State Board of Pharmacy", description: "Register or obtain licensure from your state board of pharmacy. Requirements vary by state." },
      { step: 4, title: "Complete Continuing Education", description: "Maintain certification with 20 hours of continuing education every 2 years, including 1 hour of pharmacy law." },
    ],
    jobOutlook: {
      growthRate: "6%",
      growthPeriod: "2022–2032",
      openingsPerYear: "44,800",
      demandLevel: "High",
      source: "U.S. Bureau of Labor Statistics",
    },
    benefits: [
      { title: "High Demand", description: "With 44,800 openings projected annually, pharmacy technicians are consistently in demand across all healthcare settings." },
      { title: "Diverse Work Settings", description: "Work in retail pharmacy, hospital pharmacy, compounding pharmacy, mail-order, nuclear pharmacy, or specialty infusion centers." },
      { title: "Career Advancement", description: "Advance into lead technician, pharmacy buyer, compounding specialist, or pharmacy management roles. Some technicians pursue pharmacist (PharmD) education." },
      { title: "Patient Impact", description: "Help ensure patients receive the right medications safely and understand their prescriptions, directly contributing to positive health outcomes." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of a Pharmacy Technician",
      narrative: "Your day starts at 8 AM in a hospital pharmacy. You begin by reviewing the overnight medication orders and preparing IV admixtures in the clean room using aseptic technique. By mid-morning, you're filling automated dispensing cabinet restocks for the nursing floors, double-checking NDC numbers and expiration dates. A STAT order comes in for an antibiotic drip — you calculate the compounding ratios, prepare the IV bag, and have it verified by the pharmacist within 15 minutes. After lunch, you process prescription refills, verify insurance claims, and help a patient understand their discharge medications. The afternoon includes conducting a controlled substance inventory count, updating the pharmacy's drug formulary database, and preparing chemotherapy agents in the biological safety cabinet with full PPE.",
      typicalTasks: [
        "Process and fill prescription orders accurately",
        "Compound sterile and non-sterile medications",
        "Manage pharmacy inventory and automated dispensing systems",
        "Perform dosage calculations for compounding",
        "Process insurance claims and prior authorizations",
        "Maintain clean room standards and aseptic technique",
        "Conduct controlled substance counts and documentation",
        "Assist patients with medication pickup and basic questions",
      ],
    },
    examPrepTips: [
      { title: "Master Dosage Calculations", description: "Calculations appear throughout the PTCB exam. Practice conversions, dilutions, alligation, and day's supply calculations until they're automatic." },
      { title: "Know Top 200 Drugs", description: "Memorize brand/generic names, drug classifications, common side effects, and interactions for the most frequently prescribed medications." },
      { title: "Study Pharmacy Law Thoroughly", description: "Federal and state pharmacy law questions are weighted heavily. Know DEA schedules, record-keeping requirements, and HIPAA regulations." },
      { title: "Understand Compounding Standards", description: "USP <795> and USP <797> standards for non-sterile and sterile compounding are high-yield topics. Know beyond-use dating and clean room classifications." },
      { title: "Practice with Timed Exams", description: "The PTCB gives you 2 hours for 90 questions. Practice under timed conditions to build pacing and confidence." },
    ],
    instructors: [
      { name: "Dr. Lisa Nguyen, PharmD, BCPS", credentials: "PharmD, BCPS, CPhT", specialty: "Clinical Pharmacy & Medication Safety", bio: "Dr. Nguyen is a board-certified clinical pharmacist with 12 years of experience in hospital pharmacy and pharmacy technician education. She specializes in medication safety and sterile compounding training." },
      { name: "Robert Garcia, CPhT, BS", credentials: "CPhT, BS in Pharmaceutical Sciences", specialty: "Pharmacy Operations & Compounding", bio: "Robert has 15 years of experience as a lead pharmacy technician in both retail and hospital settings. He develops pharmacy technician certification prep materials and compounding workshops." },
    ],
    platformStats: {
      totalQuestions: "1,500+",
      totalLessons: "90+",
      flashcardDecks: "50+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The dosage calculation practice was exactly what I needed. I went from struggling with alligation problems to solving them in under a minute. The step-by-step solutions in the rationales really teach you the method.", name: "Amanda W.", role: "CPhT, Hospital Pharmacy, Michigan", rating: 5 },
      { quote: "I studied the Top 200 drugs using the flashcard decks with spaced repetition and it made a huge difference on exam day. The drug classification drills are incredibly well-organized.", name: "Chris P.", role: "Pharmacy Tech Student, Georgia", rating: 5 },
      { quote: "The mock exams matched the real PTCB format perfectly — the timing, the question styles, the difficulty. I felt completely prepared walking into the testing center.", name: "Nina K.", role: "Newly Certified CPhT, Washington", rating: 5 },
    ],
    faq: [
      { question: "Does NurseNest Allied cover the PTCB exam?", answer: "Yes. Our pharmacy technician content is aligned with the current PTCB exam blueprint covering medications, federal requirements, patient safety, order entry, pharmacology, and quality assurance. We also cover content relevant to the ExCPT and Canadian PEBC Qualifying exams." },
      { question: "Are dosage calculation problems included?", answer: "Yes. Our Dosage Calculator tool provides unlimited practice with pharmaceutical calculations including conversions, dilutions, alligation, day's supply, and compounding ratios. Every problem includes step-by-step solutions." },
      { question: "Does the platform cover pharmacy law?", answer: "Yes. Federal pharmacy law — including DEA schedules, HIPAA, FDA regulations, and record-keeping requirements — is covered extensively in the question bank, lessons, and flashcard decks." },
      { question: "Is Top 200 drug content included?", answer: "Yes. We have comprehensive flashcard decks and question sets covering the Top 200 prescribed medications with brand/generic names, classifications, common side effects, interactions, and patient counseling points." },
      { question: "Does the content cover sterile compounding?", answer: "Yes. Our content includes USP <795> and USP <797> standards, clean room classifications, beyond-use dating, aseptic technique principles, and sterile compounding calculations." },
      { question: "How many questions are available?", answer: "We currently have 1,500+ pharmacy technician exam questions with a roadmap to 2,000+. Questions are written and reviewed by pharmacists and experienced pharmacy technicians." },
      { question: "Is there a free trial?", answer: "Yes. Take a free 15-question diagnostic assessment and access 5 free practice questions with detailed rationales. No credit card required." },
      { question: "Does this cover the Canadian PEBC exam?", answer: "Yes. Our platform includes content relevant to the Pharmacy Examining Board of Canada (PEBC) Qualifying Exam. Use the region toggle to access Canadian-specific pharmacy regulations and drug information." },
      { question: "What study tools are included?", answer: "Beyond the question bank, you get unlimited mock exams, spaced repetition flashcards, a Dosage Calculator, Compounding Math Simulator, personalized study planner, and detailed performance analytics by exam domain." },
      { question: "Can I study on my phone?", answer: "Yes. NurseNest Allied works on all devices. Review flashcards on your phone, practice calculations on your tablet, or take mock exams on desktop. Progress syncs automatically." },
    ],
  },

  mlt: {
    careerOverview: "Medical Laboratory Technologists (MLTs) are diagnostic specialists who perform complex laboratory tests that are critical to disease detection, treatment monitoring, and public health. Working behind the scenes in hospital labs, reference laboratories, public health facilities, and research institutions, MLTs analyze blood, tissue, and body fluid samples across disciplines including hematology, clinical chemistry, microbiology, immunohematology, and molecular diagnostics. Their precise analytical work directly informs physician decision-making.",
    whyChoose: "Medical laboratory science offers an intellectually stimulating healthcare career for those who love science, precision, and problem-solving. MLTs are essential to modern medicine — 70% of all medical decisions depend on laboratory results. The profession offers competitive salaries, strong job security, and the ability to specialize in high-demand areas like molecular diagnostics, blood banking, and cytotechnology. With a nationwide shortage of laboratory professionals, qualified MLTs are in exceptional demand.",
    salary: {
      entry: "$48,000 – $54,000",
      median: "$57,380",
      experienced: "$68,000 – $82,000",
      source: "U.S. Bureau of Labor Statistics, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Complete an Accredited MLS/MLT Program", description: "Earn a bachelor's degree (MLS) or associate's degree (MLT) from a NAACLS-accredited program." },
      { step: 2, title: "Complete Clinical Rotations", description: "Complete required clinical practicum rotations in hematology, chemistry, microbiology, blood banking, and urinalysis." },
      { step: 3, title: "Pass the ASCP Board of Certification Exam", description: "Pass the ASCP BOC exam for MLS or MLT certification. The exam covers all major laboratory disciplines." },
      { step: 4, title: "Obtain State Licensure (if required)", description: "Some states require additional licensure beyond ASCP certification. Check your state's requirements." },
      { step: 5, title: "Maintain Certification", description: "Complete continuing education through the ASCP Credential Maintenance Program (CMP) to maintain active certification." },
    ],
    jobOutlook: {
      growthRate: "5%",
      growthPeriod: "2022–2032",
      openingsPerYear: "24,600",
      demandLevel: "Very High",
      source: "U.S. Bureau of Labor Statistics",
    },
    benefits: [
      { title: "Critical Diagnostic Role", description: "70% of medical decisions depend on lab results. Your analytical work directly guides patient diagnosis and treatment." },
      { title: "Intellectual Challenge", description: "Apply advanced science daily — from interpreting cell morphology to running molecular assays and troubleshooting complex instruments." },
      { title: "Nationwide Shortage", description: "The laboratory workforce shortage means excellent job availability, sign-on bonuses, and competitive compensation packages." },
      { title: "Specialization Options", description: "Specialize in blood banking, molecular diagnostics, cytotechnology, histotechnology, microbiology, or laboratory management." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of a Medical Laboratory Technologist",
      narrative: "Your 7 AM shift begins in the hematology department where you review the overnight analyzer flags. A patient's CBC shows blast cells — you make a peripheral smear, stain it, and perform a manual differential, identifying promyelocytes consistent with APL. You call the critical value to the oncologist immediately. By mid-morning, you rotate to the blood bank where you perform antibody identification on a complex panel for a patient needing an emergency transfusion. After lunch, you process cultures in microbiology, identifying a multi-drug resistant organism and performing susceptibility testing. The afternoon brings quality control runs on the chemistry analyzers, troubleshooting a delta check failure on a potassium result, and running point-of-care testing proficiency samples. Your day ends with a thorough bench log and handoff to the evening technologist.",
      typicalTasks: [
        "Perform and interpret CBCs, differentials, and coagulation studies",
        "Analyze chemistry panels, enzymes, and therapeutic drug levels",
        "Perform blood typing, antibody screens, and crossmatches",
        "Culture, identify, and perform susceptibility testing on microorganisms",
        "Prepare and examine microscope slides for cell morphology",
        "Run and troubleshoot automated laboratory analyzers",
        "Perform quality control and quality assurance procedures",
        "Report critical values to physicians and nursing staff",
      ],
    },
    examPrepTips: [
      { title: "Focus on Hematology and Chemistry", description: "These two disciplines make up the largest portion of the ASCP exam. Master CBC interpretation, cell morphology, and clinical chemistry analytes." },
      { title: "Study Blood Banking Systematically", description: "ABO/Rh typing, antibody identification panels, and transfusion reactions are high-yield. Practice working through antibody panels step by step." },
      { title: "Know Your Microbiology ID Methods", description: "Understand Gram stain morphology, biochemical reactions, and colonial morphology for the most commonly tested organisms." },
      { title: "Practice with Images", description: "The ASCP exam includes microscope images. Practice identifying cell morphology, parasites, and crystal types from images." },
      { title: "Master Quality Management Concepts", description: "Westgard rules, Levey-Jennings charts, proficiency testing, and delta checks are tested across all sections." },
    ],
    instructors: [
      { name: "Dr. Rachel Kim, PhD, MLS(ASCP)CM", credentials: "PhD in Clinical Laboratory Sciences, MLS(ASCP)CM, MB(ASCP)", specialty: "Microbiology & Molecular Diagnostics", bio: "Dr. Kim has 14 years of experience in clinical microbiology and molecular diagnostics. She currently directs the MLS program at a major university and has authored multiple ASCP exam prep publications." },
      { name: "David Okonkwo, MS, MLS(ASCP)CM SBB", credentials: "MS in Transfusion Medicine, MLS(ASCP)CM, SBB(ASCP)", specialty: "Blood Banking & Transfusion Medicine", bio: "David is a specialist in blood banking with 16 years of experience in hospital blood banks and reference laboratories. He develops blood banking education content and antibody identification training programs." },
    ],
    platformStats: {
      totalQuestions: "500+",
      totalLessons: "150+",
      flashcardDecks: "60+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The Lab Critical Value Engine helped me recognize panic values instantly. On the real exam, I got several critical value questions right because the pattern recognition was drilled into me.", name: "Stephanie L.", role: "MLS Student, New York", rating: 5 },
      { quote: "Blood banking was my weakest area until I used the antibody panel practice questions. The rationales walk you through the elimination process step by step. I scored highest in that section on the ASCP.", name: "Michael T.", role: "Newly Certified MLT, Minnesota", rating: 5 },
      { quote: "As a Canadian CSMLS student, finding quality prep material was difficult. NurseNest Allied covers all the disciplines I need and the content depth matches what CSMLS expects.", name: "Fatima A.", role: "MLT Student, Ontario", rating: 5 },
    ],
    faq: [
      { question: "Does NurseNest Allied cover the ASCP MLS and MLT exams?", answer: "Yes. Our content is aligned with both the ASCP MLS (Medical Laboratory Scientist) and MLT (Medical Laboratory Technician) exam blueprints. We also cover the CSMLS (Canadian Society for Medical Laboratory Science) certification exam." },
      { question: "Which laboratory disciplines are covered?", answer: "We cover all major disciplines: hematology, clinical chemistry, hemostasis/coagulation, immunohematology (blood banking), microbiology, urinalysis, immunology/serology, molecular diagnostics, and laboratory operations/quality management." },
      { question: "Does the platform include image-based questions?", answer: "Yes. Our question bank includes cell morphology images, Gram stain images, culture plate images, and parasitology images — matching the format you'll encounter on the ASCP exam." },
      { question: "Is blood banking content comprehensive enough for the exam?", answer: "Yes. We cover ABO/Rh typing, antibody identification panels, crossmatching, transfusion reactions, hemolytic disease of the fetus/newborn, and component therapy in depth." },
      { question: "How are the questions different from other MLT prep resources?", answer: "Every question includes a 600+ word rationale explaining the clinical significance, laboratory methodology, and reasoning process. Our questions test application and analysis, not just recall." },
      { question: "Does the platform cover quality management and lab operations?", answer: "Yes. We cover Westgard rules, Levey-Jennings charts, proficiency testing, delta checks, method validation, laboratory safety, and regulatory compliance (CLIA, CAP)." },
      { question: "How many questions are available?", answer: "We currently have 500+ MLT/MLS exam questions with a roadmap to 2,500+. Questions are written and reviewed by practicing laboratory scientists and MLS educators." },
      { question: "Is there a free option?", answer: "Yes. Take a free 15-question diagnostic and access 5 free practice questions with full rationales. No credit card required." },
      { question: "Does this cover the CSMLS exam for Canadian students?", answer: "Yes. Our content covers the Canadian Society for Medical Laboratory Science (CSMLS) MLT certification exam. Toggle to the Canadian region to see CSMLS-specific exam information." },
      { question: "What study tools are included?", answer: "You get the full question bank, unlimited mock exams, Lab Critical Value Engine, Morphology Drill, spaced repetition flashcards, personalized study planner, and performance analytics by laboratory discipline." },
    ],
  },

  imaging: {
    careerOverview: "Diagnostic Imaging professionals — including radiologic technologists, MRI technologists, and sonographers — use advanced imaging equipment to produce diagnostic images that guide medical decision-making. Working in hospitals, outpatient imaging centers, and specialty clinics, imaging professionals must combine technical expertise with anatomy knowledge, radiation safety principles, and compassionate patient care. Certification through the ARRT or ARDMS validates competency across multiple imaging modalities.",
    whyChoose: "Diagnostic imaging offers a technology-driven healthcare career with excellent work-life balance, competitive salaries, and the satisfaction of contributing to accurate medical diagnoses. The field is rapidly advancing with new imaging technologies, AI-assisted diagnostics, and expanding modalities. Imaging professionals can specialize in CT, MRI, interventional radiography, mammography, nuclear medicine, or sonography — each offering unique career opportunities and earning potential.",
    salary: {
      entry: "$52,000 – $58,000",
      median: "$65,140",
      experienced: "$78,000 – $95,000",
      source: "U.S. Bureau of Labor Statistics, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Complete an Accredited Imaging Program", description: "Complete a JRCERT-accredited radiography, MRI, or sonography program (typically 2–4 years)." },
      { step: 2, title: "Complete Clinical Competency Requirements", description: "Accumulate required clinical rotations demonstrating competency in patient positioning, image production, and safety." },
      { step: 3, title: "Pass the ARRT or ARDMS Certification Exam", description: "Pass the American Registry of Radiologic Technologists (ARRT) or ARDMS exam for your specific modality." },
      { step: 4, title: "Obtain State Licensure", description: "Most states require licensure for radiologic technologists. Requirements vary by state and modality." },
      { step: 5, title: "Pursue Advanced Modality Certification", description: "Obtain additional ARRT certifications in CT, MRI, mammography, or interventional radiography to expand your career." },
    ],
    jobOutlook: {
      growthRate: "6%",
      growthPeriod: "2022–2032",
      openingsPerYear: "18,200",
      demandLevel: "High",
      source: "U.S. Bureau of Labor Statistics",
    },
    benefits: [
      { title: "Technology-Driven Career", description: "Work with cutting-edge imaging technology including digital radiography, multi-slice CT, 3T MRI, and AI-assisted image analysis." },
      { title: "Multiple Specializations", description: "Specialize in CT, MRI, mammography, interventional radiography, nuclear medicine, sonography, or radiation therapy." },
      { title: "Work-Life Balance", description: "Many imaging positions offer set schedules, and outpatient imaging centers provide Monday–Friday daytime hours." },
      { title: "Competitive Compensation", description: "Imaging professionals earn competitive salaries, with advanced modality certifications commanding premium pay." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of a Radiologic Technologist",
      narrative: "You arrive at 7 AM in the radiology department of a busy trauma hospital. Your first case is a portable chest X-ray in the ICU for a patient with a new central line — you verify line placement and check for pneumothorax. By 9 AM, you're performing a barium swallow study, carefully positioning the patient and coordinating with the radiologist in real-time. A trauma activation brings a patient from the ED needing a full trauma series — you complete the portable AP chest, pelvis, and C-spine in under 5 minutes. After lunch, you assist with a fluoroscopy-guided lumbar puncture, maintaining sterile field and documenting image captures. The afternoon includes outpatient extremity exams, a hip arthrogram, and quality assurance testing on the digital radiography equipment. You finish your shift by reviewing repeat rates and ensuring all images are properly archived in PACS.",
      typicalTasks: [
        "Position patients and produce diagnostic radiographic images",
        "Operate X-ray, fluoroscopy, and portable imaging equipment",
        "Apply radiation safety principles (ALARA, shielding, collimation)",
        "Assist radiologists with interventional and fluoroscopic procedures",
        "Evaluate image quality and repeat if necessary",
        "Maintain equipment and perform quality assurance testing",
        "Document procedures and archive images in PACS",
        "Educate patients about procedures and safety measures",
      ],
    },
    examPrepTips: [
      { title: "Master Radiographic Positioning", description: "Positioning is the most heavily weighted domain on the ARRT exam. Know standard projections, CR angles, and anatomy demonstrated for every body part." },
      { title: "Understand Radiation Physics", description: "Exposure factors (kVp, mAs), scatter radiation, filtration, and the inverse square law are tested extensively. Build a strong foundation in imaging physics." },
      { title: "Study Image Production Factors", description: "Know how each technical factor affects image quality — density, contrast, spatial resolution, and distortion. Practice adjusting techniques for pathology." },
      { title: "Know Radiation Safety Cold", description: "ALARA, dose limits, shielding, and personnel monitoring are high-yield. Understand both patient and occupational safety requirements." },
      { title: "Practice Anatomy Identification", description: "The ARRT includes anatomy identification questions. Practice labeling anatomical structures on radiographic images across all body systems." },
    ],
    instructors: [
      { name: "Jennifer Hayes, MS, RT(R)(CT)(MR)", credentials: "MS in Radiologic Sciences, RT(R)(CT)(MR), ARRT", specialty: "Cross-Sectional Imaging & MRI", bio: "Jennifer has 16 years of clinical experience across radiography, CT, and MRI. She currently serves as clinical coordinator for a radiography program and develops advanced imaging education content." },
      { name: "Dr. Omar Hassan, EdD, RT(R)", credentials: "EdD in Health Sciences Education, RT(R), FASRT", specialty: "Radiographic Positioning & Imaging Physics", bio: "Dr. Hassan is a Fellow of the American Society of Radiologic Technologists with 20 years of experience in radiography education and ARRT exam preparation." },
    ],
    platformStats: {
      totalQuestions: "500+",
      totalLessons: "110+",
      flashcardDecks: "45+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The Anatomy Labeling Simulator was my favorite tool. Being able to identify structures on actual radiographic images instead of textbook diagrams made a huge difference on the ARRT exam.", name: "Hannah J.", role: "Rad Tech Student, Pennsylvania", rating: 5 },
      { quote: "I struggled with radiation physics until I used the NurseNest question bank. The rationales break down complex physics concepts into understandable explanations with clinical context.", name: "Carlos M.", role: "Newly Certified RT(R), Texas", rating: 5 },
      { quote: "The blueprint-weighted mock exams told me exactly where I stood in each domain. I focused my last two weeks on positioning and patient care, which were my weak areas. Passed with confidence.", name: "Jessica W.", role: "RT(R), Colorado", rating: 5 },
    ],
    faq: [
      { question: "Which imaging certification exams does NurseNest Allied cover?", answer: "We cover the ARRT Radiography exam, with content relevant to ARRT MRI, ARRT CT, ARDMS sonography, and CAMRT (Canadian Association of Medical Radiation Technologists) exams. Our question bank and mock exams are mapped to official exam blueprints." },
      { question: "Does the platform include positioning content?", answer: "Yes. Radiographic positioning is our most comprehensive domain, covering standard projections, CR angles, patient positioning, anatomy demonstrated, and common positioning errors for every body part." },
      { question: "Is radiation physics covered?", answer: "Yes. We cover exposure factors, X-ray production, scatter radiation, filtration, image receptors, digital imaging principles, and the inverse square law — all at the depth expected on the ARRT exam." },
      { question: "Does the platform include anatomy identification practice?", answer: "Yes. Our Anatomy Labeling Simulator provides interactive anatomy identification on diagnostic images. The question bank also includes image-based anatomy identification questions matching the ARRT format." },
      { question: "Are patient care and safety topics covered?", answer: "Yes. Patient care domains including radiation safety, ALARA principles, contrast media reactions, patient communication, and infection control are covered in the question bank and dedicated lessons." },
      { question: "How many questions are available for imaging?", answer: "We currently have 500+ diagnostic imaging exam questions with a roadmap to 2,000+. Questions are reviewed by practicing radiologic technologists and imaging educators." },
      { question: "Is there a free option?", answer: "Yes. Take a free 15-question diagnostic and access 5 free practice questions. No credit card required." },
      { question: "Does this cover the CAMRT exam for Canadian students?", answer: "Yes. Our content includes material relevant to the Canadian Association of Medical Radiation Technologists (CAMRT) certification. Toggle to the Canadian region for CAMRT-specific information." },
      { question: "What study tools are included?", answer: "You get the full question bank, unlimited mock exams, Anatomy Labeling Simulator, Image Recognition Drill, spaced repetition flashcards, personalized study planner, and performance analytics." },
      { question: "Can I specialize in CT or MRI content?", answer: "Our current content focuses on primary radiography certification. CT and MRI-specific content modules are on our development roadmap and will be available for advanced modality certification prep." },
    ],
  },

  "critical-care": {
    careerOverview: "Critical Care Certified Nurses (CCRNs) are specialized registered nurses who provide expert-level care to acutely and critically ill patients in intensive care units. The CCRN certification, administered by the AACN Certification Corporation, validates advanced knowledge in hemodynamic monitoring, ventilator management, pharmacological interventions, and multisystem organ failure management. CCRNs work in medical, surgical, cardiac, neurological, and trauma ICUs.",
    whyChoose: "Critical care nursing offers the highest level of clinical challenge, professional respect, and earning potential in bedside nursing. CCRNs are recognized experts who lead rapid response teams, manage complex life-support equipment, and make time-sensitive clinical decisions. The certification opens doors to clinical nurse specialist roles, nurse anesthesia programs, acute care NP tracks, and ICU leadership positions. CCRN-certified nurses earn 10–20% more than non-certified ICU nurses.",
    salary: {
      entry: "$65,000 – $75,000",
      median: "$82,750",
      experienced: "$95,000 – $120,000",
      source: "Salary.com & AACN Salary Survey, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Earn Your RN License", description: "Complete an accredited nursing program and pass the NCLEX-RN to become a registered nurse." },
      { step: 2, title: "Gain ICU Experience", description: "Work a minimum of 1,750 hours in direct care of acutely/critically ill patients within the last 2 years." },
      { step: 3, title: "Apply for the CCRN Exam", description: "Apply through the AACN Certification Corporation for the CCRN-Adult, CCRN-Pediatric, or CCRN-Neonatal exam." },
      { step: 4, title: "Pass the CCRN Certification Exam", description: "Pass the 150-question CCRN exam covering clinical judgment across all critical care body systems." },
      { step: 5, title: "Maintain Certification", description: "Renew every 3 years through continuing education points or re-examination." },
    ],
    jobOutlook: {
      growthRate: "6%",
      growthPeriod: "2022–2032",
      openingsPerYear: "193,100",
      demandLevel: "Very High",
      source: "U.S. Bureau of Labor Statistics (RN overall)",
    },
    benefits: [
      { title: "Expert-Level Clinical Skills", description: "Develop advanced competencies in hemodynamic monitoring, mechanical ventilation, vasoactive drips, and multisystem assessment." },
      { title: "Higher Earning Potential", description: "CCRN-certified nurses earn 10–20% more than non-certified peers, with additional differentials for specialty ICUs." },
      { title: "Career Advancement", description: "CCRN opens pathways to CRNA programs, acute care NP tracks, clinical nurse specialist roles, and ICU management." },
      { title: "Professional Recognition", description: "CCRN is the gold standard certification for critical care nursing, recognized by employers and colleagues nationwide." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of a CCRN",
      narrative: "Your 12-hour shift in the medical ICU begins at 7 AM with bedside report on your two patients. Patient 1 is a 55-year-old on mechanical ventilation with ARDS — you assess ventilator settings, review the ABG drawn at 6 AM, and perform a spontaneous breathing trial. Patient 2 is post-cardiac catheterization on a heparin drip with a femoral sheath still in place — you monitor aPTT, assess the groin site, and titrate the vasopressor to maintain MAP above 65. By mid-morning, a rapid response call pulls you to the step-down unit where a patient is deteriorating — you recognize sepsis, initiate the sepsis bundle, and coordinate transfer to your unit. The afternoon brings a complex medication reconciliation, family conference about goals of care, and preparation for your ARDS patient's prone positioning session with the respiratory therapist.",
      typicalTasks: [
        "Monitor and interpret hemodynamic waveforms (arterial lines, CVP, PA catheters)",
        "Manage mechanical ventilation and perform weaning trials",
        "Titrate vasoactive medications and sedation drips",
        "Perform comprehensive head-to-toe assessments on critically ill patients",
        "Respond to rapid response and code events",
        "Coordinate care with intensivists, pharmacists, and respiratory therapists",
        "Manage complex medication regimens including continuous infusions",
        "Provide family support and participate in goals-of-care discussions",
      ],
    },
    examPrepTips: [
      { title: "Master Hemodynamic Monitoring", description: "Understand normal and abnormal values for CVP, PAP, PCWP, CO/CI, and SVR. Know which conditions cause which hemodynamic profiles." },
      { title: "Focus on Cardiovascular Content", description: "Cardiovascular is the most heavily weighted domain on the CCRN exam. Master cardiac rhythms, MI management, heart failure, and vasoactive medications." },
      { title: "Know Your Ventilator Settings", description: "Understand initial settings, troubleshooting, and weaning criteria for all common ventilator modes. Know how to respond to high-pressure alarms." },
      { title: "Study Multisystem Scenarios", description: "The CCRN tests your ability to manage patients with multiple organ involvement. Practice prioritizing interventions in complex scenarios." },
      { title: "Don't Skip Behavioral/Psychosocial", description: "While it's a smaller percentage, behavioral and psychosocial questions are frequently missed. Study delirium assessment, pain management, and family dynamics." },
    ],
    instructors: [
      { name: "Dr. Michelle Torres, DNP, ACNP-BC, CCRN", credentials: "DNP, ACNP-BC, CCRN, FCCM", specialty: "Adult Critical Care & Hemodynamic Monitoring", bio: "Dr. Torres is a critical care nurse practitioner with 20 years of ICU experience. She is a Fellow of the Society of Critical Care Medicine and develops CCRN exam prep curricula for nursing education programs." },
      { name: "Kevin Park, MSN, RN, CCRN-K", credentials: "MSN, RN, CCRN-K, PCCN", specialty: "Cardiac Critical Care & Pharmacology", bio: "Kevin has 14 years of cardiac ICU experience and currently serves as a critical care clinical educator, specializing in vasoactive medication management and cardiac rhythm interpretation." },
    ],
    platformStats: {
      totalQuestions: "500+",
      totalLessons: "130+",
      flashcardDecks: "50+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The Hemodynamic Monitoring Simulator transformed how I read waveforms. I went from being unsure about PA catheter values to confidently interpreting hemodynamic profiles on the CCRN exam.", name: "Rachel S.", role: "CCRN-Certified, Surgical ICU, Illinois", rating: 5 },
      { quote: "The depth of the cardiovascular rationales is outstanding. Every question teaches you the pathophysiology behind the intervention, not just the right answer. I scored 92% on my CCRN exam.", name: "James B.", role: "ICU RN, California", rating: 5 },
    ],
    faq: [
      { question: "Does NurseNest Allied cover the CCRN-Adult exam?", answer: "Yes. Our critical care content is aligned with the AACN CCRN-Adult exam blueprint covering cardiovascular, pulmonary, neurological, renal, GI, endocrine, hematology/immunology, multisystem, and behavioral/psychosocial domains." },
      { question: "Is hemodynamic monitoring content included?", answer: "Yes. Our Hemodynamic Monitoring Simulator provides interactive practice interpreting arterial line waveforms, CVP, PA pressures, PCWP, and cardiac output/index values." },
      { question: "How are the questions different from NCLEX-style questions?", answer: "CCRN questions are written at a higher clinical application level than NCLEX. They test advanced critical care decision-making, hemodynamic interpretation, and complex pharmacological management." },
      { question: "Does the content cover ventilator management?", answer: "Yes. We cover initial ventilator settings, mode selection, troubleshooting, weaning protocols, and ARDS management including lung-protective ventilation strategies." },
      { question: "How many questions are available?", answer: "We currently have 500+ critical care exam questions with a roadmap to 2,000+. Questions are written at the CCRN application/analysis level by experienced critical care nurses." },
      { question: "Is there a free trial?", answer: "Yes. Take a free 15-question diagnostic and access 5 free practice questions with full rationales. No credit card required." },
      { question: "Does this cover CCRN-Pediatric or CCRN-Neonatal?", answer: "Our primary focus is CCRN-Adult. CCRN-Pediatric and CCRN-Neonatal content is on our development roadmap." },
      { question: "What study tools are included?", answer: "You get the full question bank, unlimited mock exams, Hemodynamic Monitoring Simulator, ICU Case Simulator, spaced repetition flashcards, personalized study planner, and performance analytics." },
    ],
  },

  "emergency-nursing": {
    careerOverview: "Certified Emergency Nurses (CENs) are specialized registered nurses who provide expert care in fast-paced emergency departments, managing everything from minor injuries to multi-system trauma, cardiac emergencies, and pediatric crises. The CEN certification, administered by the Board of Certification for Emergency Nursing (BCEN), validates advanced knowledge in triage, trauma, medical emergencies, and emergency nursing practice.",
    whyChoose: "Emergency nursing offers the most dynamic, unpredictable, and rewarding nursing specialty. CENs are skilled clinicians who thrive on variety — no two shifts are the same. The certification enhances career mobility, earning potential, and professional recognition. CENs can advance into trauma coordinator, flight nursing, ED management, or emergency nurse practitioner roles.",
    salary: {
      entry: "$60,000 – $70,000",
      median: "$78,500",
      experienced: "$90,000 – $115,000",
      source: "Salary.com & BCEN Salary Data, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Earn Your RN License", description: "Complete an accredited nursing program and pass the NCLEX-RN." },
      { step: 2, title: "Gain ED Experience", description: "While BCEN recommends 2+ years of ED experience, there is no minimum requirement to sit for the CEN exam." },
      { step: 3, title: "Apply for the CEN Exam", description: "Apply through BCEN for the 175-question CEN certification exam." },
      { step: 4, title: "Pass the CEN Exam", description: "Pass the CEN exam covering cardiovascular, respiratory, neurological, GI/GU, OB/GYN, orthopedic, and psychosocial emergencies." },
      { step: 5, title: "Maintain Certification", description: "Renew every 4 years through continuing education or re-examination." },
    ],
    jobOutlook: {
      growthRate: "6%",
      growthPeriod: "2022–2032",
      openingsPerYear: "193,100",
      demandLevel: "Very High",
      source: "U.S. Bureau of Labor Statistics (RN overall)",
    },
    benefits: [
      { title: "Variety and Excitement", description: "Manage a diverse range of patients and emergencies — from chest pain and stroke to trauma and pediatric emergencies." },
      { title: "Rapid Skill Development", description: "Develop broad clinical skills quickly through exposure to every body system and acuity level." },
      { title: "Career Flexibility", description: "CEN opens pathways to flight nursing, trauma coordination, ED management, and emergency NP programs." },
      { title: "Team Dynamics", description: "Work alongside physicians, paramedics, and specialists in a high-energy team environment." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of a CEN",
      narrative: "Your 12-hour shift starts at 7 PM in a Level I trauma center. Within the first hour, you triage a 45-year-old with crushing chest pain — you run a 12-lead ECG, identify STEMI, and activate the cath lab team in under 10 minutes. By 9 PM, a trauma activation brings a patient from a motorcycle crash. You're the primary nurse — assessing ABCs, managing bilateral chest tubes, and coordinating with the trauma surgeon. Between critical patients, you manage a waiting room of 30+ patients, performing rapid assessments and prioritizing care. Midnight brings a pediatric febrile seizure, an intoxicated patient needing medical clearance, and a elderly patient with a hip fracture. You handle each with clinical precision, compassion, and unwavering focus on patient safety.",
      typicalTasks: [
        "Perform ESI triage assessments and prioritize patient care",
        "Manage cardiac emergencies including STEMI activations",
        "Provide primary nursing care for trauma patients",
        "Administer medications and manage IV access",
        "Assist with emergency procedures (intubation, chest tubes, central lines)",
        "Monitor multiple patients simultaneously across acuity levels",
        "Coordinate rapid transfers to surgery, ICU, or cath lab",
        "Document patient care and ensure continuity during shift changes",
      ],
    },
    examPrepTips: [
      { title: "Master Triage Principles", description: "ESI triage is tested heavily. Know the 5-level triage system and be able to correctly assign acuity levels to various patient presentations." },
      { title: "Focus on Cardiovascular Emergencies", description: "STEMI management, cardiac arrest algorithms, and dysrhythmia recognition are high-yield CEN topics." },
      { title: "Study Trauma Systematically", description: "Know the primary and secondary surveys, mechanism of injury implications, and management priorities for head, chest, abdominal, and orthopedic trauma." },
      { title: "Don't Neglect Medical Emergencies", description: "Stroke, sepsis, DKA, anaphylaxis, and toxicology presentations are frequently tested." },
      { title: "Practice Time Management", description: "The CEN has 175 questions in 3 hours. Practice under timed conditions to build pacing and confidence." },
    ],
    instructors: [
      { name: "Sarah Mitchell, MSN, RN, CEN, TCRN", credentials: "MSN, RN, CEN, TCRN, CPEN", specialty: "Emergency & Trauma Nursing", bio: "Sarah has 18 years of emergency nursing experience in Level I trauma centers and currently serves as an ED educator developing CEN certification prep programs." },
      { name: "Dr. Eric Johnson, DNP, FNP-BC, CEN", credentials: "DNP, FNP-BC, CEN, ENP-BC", specialty: "Emergency Medicine & Advanced Practice", bio: "Dr. Johnson is an emergency nurse practitioner with 15 years of ED experience who develops evidence-based emergency nursing education content." },
    ],
    platformStats: {
      totalQuestions: "500+",
      totalLessons: "120+",
      flashcardDecks: "45+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The Triage Decision Simulator is brilliant. Practicing ESI assignments with realistic patient scenarios made me so much more confident on the CEN exam and in my daily triage practice.", name: "Nicole R.", role: "CEN-Certified, Level I Trauma Center, Maryland", rating: 5 },
      { quote: "I used the trauma nursing content to prepare for both my CEN and TCRN exams. The depth of the rationales and the clinical scenario format match exactly what these exams test.", name: "Brandon K.", role: "ED RN, Georgia", rating: 5 },
    ],
    faq: [
      { question: "Does NurseNest Allied cover the CEN exam?", answer: "Yes. Our emergency nursing content is aligned with the BCEN CEN exam blueprint covering cardiovascular, respiratory, neurological, GI/GU, OB/GYN, orthopedic, psychosocial, medical emergencies, maxillofacial/ocular, and environment/toxicology." },
      { question: "Is triage content included?", answer: "Yes. Our Triage Decision Simulator provides practice with ESI triage levels using realistic patient scenarios, and the question bank includes extensive triage-related content." },
      { question: "Does the platform cover trauma nursing?", answer: "Yes. We cover primary/secondary surveys, trauma assessment, mechanism of injury, and management of head, chest, abdominal, and orthopedic trauma." },
      { question: "How many questions are available?", answer: "We currently have 500+ emergency nursing exam questions with a roadmap to 2,000+." },
      { question: "Is there a free trial?", answer: "Yes. Take a free 15-question diagnostic and 5 free practice questions with full rationales." },
      { question: "Does this help with TCRN or CPEN certification?", answer: "While our primary focus is CEN, much of the trauma and pediatric content is relevant to TCRN and CPEN exam preparation." },
      { question: "What study tools are included?", answer: "You get the question bank, mock exams, Triage Decision Simulator, Trauma Nursing Simulator, flashcards, study planner, and analytics." },
      { question: "Can I study on mobile?", answer: "Yes. Fully responsive on all devices with synced progress." },
    ],
  },

  perioperative: {
    careerOverview: "Certified Perioperative Nurses (CNORs) are specialized registered nurses who provide expert care throughout the surgical continuum — preoperative, intraoperative, and postoperative. The CNOR certification, administered by the Competency & Credentialing Institute (CCI), validates advanced knowledge in surgical procedures, sterile technique, patient safety, and operating room management.",
    whyChoose: "Perioperative nursing offers a unique combination of technical precision, advanced clinical knowledge, and direct patient advocacy in one of healthcare's most demanding environments. CNORs earn higher salaries, have greater career mobility, and are recognized leaders in patient safety. The certification opens doors to RNFA (Registered Nurse First Assistant), OR management, and surgical education roles.",
    salary: {
      entry: "$62,000 – $72,000",
      median: "$80,000",
      experienced: "$92,000 – $110,000",
      source: "CCI Salary Survey & Salary.com, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Earn Your RN License", description: "Complete an accredited nursing program and pass the NCLEX-RN." },
      { step: 2, title: "Gain Perioperative Experience", description: "CCI recommends at least 2 years of perioperative nursing experience before sitting for the CNOR exam." },
      { step: 3, title: "Apply for the CNOR Exam", description: "Apply through CCI for the 200-question CNOR certification exam." },
      { step: 4, title: "Pass the CNOR Exam", description: "Pass the CNOR covering preoperative assessment, intraoperative care, sterilization, equipment, and patient safety." },
      { step: 5, title: "Maintain Certification", description: "Renew every 5 years through professional development points or re-examination." },
    ],
    jobOutlook: {
      growthRate: "6%",
      growthPeriod: "2022–2032",
      openingsPerYear: "193,100",
      demandLevel: "High",
      source: "U.S. Bureau of Labor Statistics (RN overall)",
    },
    benefits: [
      { title: "Technical Precision", description: "Master the art and science of surgical nursing, from sterile technique to advanced surgical technology." },
      { title: "Patient Safety Leadership", description: "Serve as the primary advocate for patient safety in the operating room — preventing errors, ensuring correct procedures, and maintaining sterile environments." },
      { title: "Predictable Schedule", description: "Many OR positions offer weekday daytime hours with call coverage, providing better work-life balance than many nursing specialties." },
      { title: "Career Growth", description: "Advance into RNFA, surgical education, OR management, or surgical product consultation roles." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of a CNOR",
      narrative: "Your day begins at 6:30 AM reviewing the surgical schedule and confirming room assignments. You perform a preoperative assessment on your first patient — a total knee arthroplasty — verifying consent, surgical site marking, and NPO status. In the OR, you set up the sterile field, perform instrument counts with the scrub tech, and complete the surgical safety checklist with the entire team. During the procedure, you manage positioning, monitor fluid intake/output, and maintain documentation. Between cases, you turn over the room, perform terminal cleaning, and prepare for the next procedure. The afternoon brings a laparoscopic cholecystectomy where you troubleshoot the insufflator alarm and ensure all specimens are properly labeled and sent to pathology. You end the day with final counts confirmed and your patients safely in PACU.",
      typicalTasks: [
        "Perform preoperative patient assessments and verify surgical consent",
        "Prepare and maintain the sterile field for surgical procedures",
        "Perform surgical instrument and sponge counts",
        "Manage patient positioning and safety during surgery",
        "Monitor and document intraoperative events",
        "Coordinate with surgeons, anesthesia, and scrub technicians",
        "Handle surgical specimens and maintain chain of custody",
        "Manage emergency situations in the operating room",
      ],
    },
    examPrepTips: [
      { title: "Focus on Intraoperative Care", description: "Intraoperative content is the most heavily weighted domain on the CNOR. Master surgical counts, sterile technique, and patient safety protocols." },
      { title: "Know Sterilization Standards", description: "AAMI standards, sterilization methods, biological indicators, and high-level disinfection are high-yield topics." },
      { title: "Study Surgical Positioning", description: "Know the risks, interventions, and safety considerations for every surgical position — supine, lithotomy, lateral, prone, and Trendelenburg." },
      { title: "Understand Electrosurgery Safety", description: "Active electrode monitoring, dispersive pad placement, and fire prevention in the OR are frequently tested." },
      { title: "Practice Patient Safety Scenarios", description: "Wrong-site surgery prevention, retained surgical items, and malignant hyperthermia management are critical topics." },
    ],
    instructors: [
      { name: "Patricia Cole, MSN, RN, CNOR, RNFA", credentials: "MSN, RN, CNOR, RNFA, CSSM", specialty: "Perioperative Nursing & Surgical First Assisting", bio: "Patricia has 22 years of perioperative nursing experience and currently serves as OR educator at a major academic medical center, developing CNOR certification preparation programs." },
    ],
    platformStats: {
      totalQuestions: "500+",
      totalLessons: "100+",
      flashcardDecks: "40+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The Sterile Field Simulator was invaluable. Practicing sterile technique scenarios and identifying breaks in sterility prepared me for the trickiest CNOR questions.", name: "Laura M.", role: "CNOR-Certified, Academic Medical Center, Ohio", rating: 5 },
      { quote: "I passed my CNOR on the first attempt thanks to NurseNest Allied. The question rationales are detailed enough that I learned new things even after 10 years in the OR.", name: "Diana F.", role: "OR RN, Florida", rating: 5 },
    ],
    faq: [
      { question: "Does NurseNest Allied cover the CNOR exam?", answer: "Yes. Our perioperative content is aligned with the CCI CNOR exam blueprint covering preoperative assessment, intraoperative care, postoperative care, sterilization, equipment, and patient safety." },
      { question: "Is sterile technique content included?", answer: "Yes. Our Sterile Field Simulator and extensive question bank cover sterile technique principles, breaks in sterility, AAMI sterilization standards, and biological monitoring." },
      { question: "How many questions are available?", answer: "We have 500+ perioperative nursing questions with a roadmap to 1,500+." },
      { question: "Is there a free trial?", answer: "Yes. Free 15-question diagnostic and 5 practice questions with rationales." },
      { question: "Does this help with RNFA certification?", answer: "While primarily focused on CNOR, much of the intraoperative and surgical content is relevant to RNFA preparation." },
      { question: "What study tools are included?", answer: "Question bank, mock exams, Sterile Field Simulator, Surgical Count Drill, flashcards, study planner, and analytics." },
      { question: "Is patient safety content covered?", answer: "Yes. Wrong-site surgery prevention, surgical counts, fire safety, malignant hyperthermia, and the surgical safety checklist are covered extensively." },
      { question: "Can I study on mobile?", answer: "Yes. Fully responsive on all devices." },
    ],
  },

  "oncology-nursing": {
    careerOverview: "Oncology Certified Nurses (OCNs) are specialized registered nurses who care for patients across the cancer continuum — from prevention and diagnosis through treatment, survivorship, and end-of-life care. The OCN certification, administered by the Oncology Nursing Certification Corporation (ONCC), validates expertise in cancer pathophysiology, treatment modalities, symptom management, and psychosocial support.",
    whyChoose: "Oncology nursing combines deep clinical knowledge with meaningful patient relationships. OCNs develop expertise in chemotherapy, immunotherapy, radiation therapy, and targeted therapies while providing holistic support to patients and families navigating a cancer diagnosis. The field offers specialization in bone marrow transplant, pediatric oncology, radiation, surgical oncology, and research. OCN certification is increasingly required by Magnet hospitals.",
    salary: {
      entry: "$62,000 – $70,000",
      median: "$79,000",
      experienced: "$88,000 – $108,000",
      source: "ONCC & Salary.com, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Earn Your RN License", description: "Complete an accredited nursing program and pass the NCLEX-RN." },
      { step: 2, title: "Gain Oncology Experience", description: "Accumulate a minimum of 1,000 hours of oncology nursing practice within 2.5 years and 10 contact hours of oncology CE." },
      { step: 3, title: "Apply for the OCN Exam", description: "Apply through ONCC for the 165-question OCN certification exam." },
      { step: 4, title: "Pass the OCN Exam", description: "Pass the OCN exam covering cancer pathophysiology, treatment, symptom management, and professional practice." },
      { step: 5, title: "Maintain Certification", description: "Renew every 4 years through ILNA (Individual Learning Needs Assessment) or re-examination." },
    ],
    jobOutlook: {
      growthRate: "6%",
      growthPeriod: "2022–2032",
      openingsPerYear: "193,100",
      demandLevel: "High",
      source: "U.S. Bureau of Labor Statistics (RN overall)",
    },
    benefits: [
      { title: "Meaningful Patient Relationships", description: "Build deep therapeutic relationships with patients and families throughout their cancer journey." },
      { title: "Advanced Clinical Knowledge", description: "Develop expertise in chemotherapy, immunotherapy, targeted therapy, and radiation treatment management." },
      { title: "Growing Specialty", description: "With cancer incidence increasing and treatment options expanding, oncology nursing demand continues to grow." },
      { title: "Research Opportunities", description: "Participate in clinical trials and contribute to advancing cancer treatment through evidence-based practice." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of an OCN",
      narrative: "Your day starts at 7 AM in the outpatient infusion center. You review today's treatment plans — 8 patients receiving various chemotherapy regimens. Your first patient is receiving FOLFOX for colon cancer — you verify the regimen, perform pre-treatment labs review, administer antiemetics, and begin the infusion while monitoring for hypersensitivity reactions. By mid-morning, you're educating a newly diagnosed breast cancer patient about her upcoming AC-T regimen, discussing expected side effects, and creating a symptom management plan. A patient calls reporting grade 2 peripheral neuropathy — you assess using CTCAE criteria and coordinate with the oncologist about dose modification. The afternoon brings an end-of-life conversation with a patient and family transitioning to hospice care, requiring all your psychosocial skills and compassion.",
      typicalTasks: [
        "Administer chemotherapy, immunotherapy, and targeted therapy safely",
        "Monitor for and manage treatment-related side effects and toxicities",
        "Educate patients and families about cancer diagnosis and treatment plans",
        "Perform pre-treatment assessments including lab review",
        "Manage central venous access devices (ports, PICCs, tunneled catheters)",
        "Assess and manage oncologic emergencies (tumor lysis, spinal cord compression)",
        "Coordinate multidisciplinary care with oncologists, social workers, and palliative care",
        "Provide psychosocial support and navigate end-of-life conversations",
      ],
    },
    examPrepTips: [
      { title: "Master Treatment Modalities", description: "Know the major chemotherapy regimens, their indications, mechanisms, and toxicity profiles. Understand immunotherapy, targeted therapy, and hormonal therapy principles." },
      { title: "Focus on Symptom Management", description: "The OCN exam heavily tests symptom management — nausea/vomiting, pain, fatigue, mucositis, myelosuppression, and peripheral neuropathy." },
      { title: "Know Oncologic Emergencies", description: "Tumor lysis syndrome, superior vena cava syndrome, spinal cord compression, hypercalcemia, and DIC are high-yield emergency topics." },
      { title: "Study Safe Handling Practices", description: "Chemotherapy safe handling, PPE requirements, spill management, and exposure protocols are frequently tested." },
      { title: "Understand Cancer Staging", description: "Know TNM staging, cancer grading systems, and how staging impacts treatment decisions." },
    ],
    instructors: [
      { name: "Dr. Catherine Lee, PhD, RN, OCN, AOCNS", credentials: "PhD, RN, OCN, AOCNS", specialty: "Oncology Nursing & Symptom Management", bio: "Dr. Lee has 18 years of oncology nursing experience and currently leads cancer survivorship research at a comprehensive cancer center while developing OCN certification education." },
    ],
    platformStats: {
      totalQuestions: "500+",
      totalLessons: "110+",
      flashcardDecks: "45+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The Chemotherapy Safety Simulator prepared me for the safe handling questions on the OCN exam. Understanding how to manage spills and exposures gave me confidence on test day and in clinical practice.", name: "Jessica H.", role: "OCN-Certified, Infusion Center, Virginia", rating: 5 },
      { quote: "The symptom management content is outstanding. The rationales explain the pathophysiology behind each side effect and the evidence-based interventions. I use what I learned even in my daily practice.", name: "Andrea M.", role: "Oncology RN, Massachusetts", rating: 5 },
    ],
    faq: [
      { question: "Does NurseNest Allied cover the OCN exam?", answer: "Yes. Our oncology nursing content is aligned with the ONCC OCN exam blueprint covering cancer pathophysiology, treatment modalities, symptom management, oncologic emergencies, psychosocial support, and professional practice." },
      { question: "Is chemotherapy content included?", answer: "Yes. We cover major chemotherapy regimens, mechanisms of action, toxicity profiles, safe handling, and administration principles." },
      { question: "Does the platform cover symptom management?", answer: "Yes. Symptom management is one of our most comprehensive domains, covering nausea/vomiting, pain, fatigue, myelosuppression, neuropathy, and mucositis." },
      { question: "How many questions are available?", answer: "We have 500+ oncology nursing questions with a roadmap to 1,500+." },
      { question: "Is there a free trial?", answer: "Yes. Free diagnostic and 5 practice questions with rationales." },
      { question: "Does this help with AOCNP certification?", answer: "While focused on OCN, the advanced oncology content provides a foundation for AOCNP preparation." },
      { question: "What study tools are included?", answer: "Question bank, mock exams, Chemotherapy Safety Simulator, Cancer Staging Drill, flashcards, study planner, and analytics." },
      { question: "Can I study on mobile?", answer: "Yes. Fully responsive on all devices." },
    ],
  },

  "pediatric-cert": {
    careerOverview: "Certified Pediatric Nurses (CPNs) are specialized registered nurses who provide expert care to children from birth through adolescence. The CPN certification, administered by the Pediatric Nursing Certification Board (PNCB), validates advanced knowledge in growth and development, pediatric assessment, family-centered care, and age-specific clinical management across all pediatric settings.",
    whyChoose: "Pediatric nursing combines clinical expertise with the joy of caring for children and supporting families. CPNs work across diverse settings including pediatric units, PICUs, outpatient clinics, schools, and community health. The certification demonstrates specialized competency, enhances career mobility, and opens pathways to pediatric NP programs, nurse management, and clinical education roles.",
    salary: {
      entry: "$58,000 – $66,000",
      median: "$75,000",
      experienced: "$85,000 – $100,000",
      source: "PNCB & Salary.com, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Earn Your RN License", description: "Complete an accredited nursing program and pass the NCLEX-RN." },
      { step: 2, title: "Gain Pediatric Experience", description: "Accumulate 1,800 hours of pediatric nursing practice within the last 24 months." },
      { step: 3, title: "Apply for the CPN Exam", description: "Apply through PNCB for the CPN certification exam." },
      { step: 4, title: "Pass the CPN Exam", description: "Pass the 175-question CPN exam covering growth/development, clinical care, and professional practice." },
      { step: 5, title: "Maintain Certification", description: "Renew every 3 years through continuing education or re-examination." },
    ],
    jobOutlook: {
      growthRate: "6%",
      growthPeriod: "2022–2032",
      openingsPerYear: "193,100",
      demandLevel: "High",
      source: "U.S. Bureau of Labor Statistics (RN overall)",
    },
    benefits: [
      { title: "Rewarding Patient Population", description: "Make a difference in children's lives during their most vulnerable moments, with the unique reward of seeing pediatric patients recover and thrive." },
      { title: "Family-Centered Care", description: "Develop expertise in supporting entire families through illness, trauma, and chronic condition management." },
      { title: "Developmental Expertise", description: "Master age-specific assessment, communication, and clinical management from neonates through adolescents." },
      { title: "Diverse Career Options", description: "Work in pediatric units, PICUs, clinics, schools, camp nursing, or advance to PNP or pediatric CNS roles." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of a CPN",
      narrative: "Your day starts at 7 AM on a pediatric medical-surgical unit. You receive report on four patients: a 3-year-old with croup, a 7-year-old post-appendectomy, a 14-year-old newly diagnosed with Type 1 diabetes, and a 6-month-old being monitored for RSV bronchiolitis. You perform age-appropriate assessments — using a modified scale for the infant, engaging the toddler with play during your exam, and having a private conversation with your adolescent about managing diabetes at school. Mid-morning, you administer racemic epinephrine to the croup patient and monitor for rebound stridor. You coordinate with the diabetes educator for the teenager's insulin teaching. The afternoon brings discharge teaching for the appendectomy patient, IV fluid adjustments for the infant, and a family care conference for the diabetes patient. You document using pediatric-specific assessment tools and hand off to the evening nurse with detailed plans for each child.",
      typicalTasks: [
        "Perform age-appropriate pediatric assessments",
        "Calculate and administer weight-based medications",
        "Monitor growth and development milestones",
        "Provide family-centered education and support",
        "Manage pediatric IV therapy and fluid calculations",
        "Recognize and respond to pediatric emergencies",
        "Use age-appropriate pain assessment scales",
        "Coordinate with pediatric specialists and child life therapists",
      ],
    },
    examPrepTips: [
      { title: "Master Growth and Development", description: "Developmental milestones by age are tested extensively. Know physical, cognitive, and psychosocial development from infancy through adolescence." },
      { title: "Know Pediatric Medication Calculations", description: "Weight-based dosing is fundamental to pediatric nursing. Practice mg/kg calculations until they're second nature." },
      { title: "Study Age-Specific Assessment", description: "Know normal vital sign ranges by age, pediatric-specific assessment findings, and age-appropriate communication techniques." },
      { title: "Focus on Common Pediatric Conditions", description: "Asthma, RSV, croup, appendicitis, diabetes, sickle cell disease, and congenital heart defects are high-yield topics." },
      { title: "Understand Family-Centered Care Principles", description: "The CPN exam emphasizes family dynamics, cultural sensitivity, and involving families in care decisions." },
    ],
    instructors: [
      { name: "Dr. Amanda Fischer, DNP, CPNP-AC, CPN", credentials: "DNP, CPNP-AC, CPN", specialty: "Pediatric Acute Care & Development", bio: "Dr. Fischer is a pediatric acute care nurse practitioner with 16 years of experience in pediatric ICU and medical-surgical settings. She develops pediatric nursing certification education programs." },
    ],
    platformStats: {
      totalQuestions: "500+",
      totalLessons: "100+",
      flashcardDecks: "40+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The Growth & Development Drill made memorizing developmental milestones actually manageable. The spaced repetition approach helped me retain information I'd been struggling with for months.", name: "Emily D.", role: "CPN-Certified, Children's Hospital, Texas", rating: 5 },
      { quote: "The pediatric assessment content is exactly what the CPN exam tests — age-specific normals, pain scales, and family communication. I felt fully prepared on exam day.", name: "Mark T.", role: "Pediatric RN, California", rating: 5 },
    ],
    faq: [
      { question: "Does NurseNest Allied cover the CPN exam?", answer: "Yes. Our pediatric content is aligned with the PNCB CPN exam blueprint covering growth/development, clinical care across all pediatric age groups, and professional practice." },
      { question: "Is growth and development content included?", answer: "Yes. Our Growth & Development Drill and question bank cover developmental milestones from neonatal through adolescent stages." },
      { question: "Does the platform cover pediatric medication calculations?", answer: "Yes. Weight-based dosing calculations, IV fluid management, and age-specific pharmacology are covered extensively." },
      { question: "How many questions are available?", answer: "We have 500+ pediatric nursing questions with a roadmap to 1,500+." },
      { question: "Is there a free trial?", answer: "Yes. Free diagnostic and 5 practice questions with rationales." },
      { question: "Does this help with PCCN or CPEN certification?", answer: "While focused on CPN, pediatric critical care and emergency content is included and relevant to PCCN and CPEN preparation." },
      { question: "What study tools are included?", answer: "Question bank, mock exams, Pediatric Assessment Simulator, Growth & Development Drill, flashcards, study planner, and analytics." },
      { question: "Can I study on mobile?", answer: "Yes. Fully responsive on all devices." },
    ],
  },

  psychotherapist: {
    careerOverview: "Registered Psychotherapists (RPs) in Canada and Licensed Professional Counselors/Licensed Mental Health Counselors in the US are regulated mental health professionals who provide therapeutic services using evidence-based modalities. The profession requires passing qualifying exams administered by regulatory bodies such as CRPO in Ontario, or the NCE/CMHCE for US licensure. Psychotherapists work with individuals, couples, families, and groups across diverse practice settings.",
    whyChoose: "Psychotherapy offers a deeply meaningful career focused on helping people overcome mental health challenges, process trauma, and improve their quality of life. The profession provides autonomy, flexible practice settings (private practice, hospitals, community agencies, telehealth), and the opportunity to develop expertise in specialized therapeutic modalities. With growing public awareness of mental health and increasing demand for services, qualified psychotherapists are in high demand.",
    salary: {
      entry: "$45,000 – $55,000",
      median: "$59,660",
      experienced: "$72,000 – $95,000",
      source: "U.S. Bureau of Labor Statistics & PayScale, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Complete a Graduate Degree", description: "Earn a master's degree or higher in psychotherapy, counseling, psychology, or a related field from an accredited institution." },
      { step: 2, title: "Complete Supervised Clinical Hours", description: "Accumulate required supervised clinical practice hours (typically 2,000–4,000 hours depending on jurisdiction)." },
      { step: 3, title: "Pass the Registration/Licensing Exam", description: "Pass the CRPO Registration Exam (Ontario), RP Qualifying Exam (other provinces), NCE, or CMHCE." },
      { step: 4, title: "Register with Your Regulatory College", description: "Apply for registration with your provincial college (Canada) or state licensing board (US)." },
      { step: 5, title: "Maintain Registration", description: "Complete continuing education, supervision, and quality assurance requirements as mandated by your regulatory body." },
    ],
    jobOutlook: {
      growthRate: "18%",
      growthPeriod: "2022–2032",
      openingsPerYear: "19,500",
      demandLevel: "Very High",
      source: "U.S. Bureau of Labor Statistics (Substance Abuse, Behavioral Disorder, and Mental Health Counselors)",
    },
    benefits: [
      { title: "Meaningful Work", description: "Help people overcome depression, anxiety, trauma, relationship difficulties, and other mental health challenges." },
      { title: "Practice Autonomy", description: "Build a private practice with flexible hours, choose your therapeutic modalities, and set your own clinical direction." },
      { title: "High Demand", description: "18% projected growth reflects increasing recognition of mental health services and expanding insurance coverage." },
      { title: "Lifelong Learning", description: "Continuously deepen your clinical skills through advanced training in CBT, DBT, EMDR, somatic therapy, and other modalities." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of a Registered Psychotherapist",
      narrative: "Your day begins at 9 AM reviewing session notes and preparing for your client schedule. Your first session is a follow-up with an adult client working through generalized anxiety using CBT — you review thought records completed since the last session and introduce cognitive restructuring techniques. At 10:30, you see a couple navigating communication challenges using Emotionally Focused Therapy principles. After a brief break, you conduct an initial intake assessment for a new client presenting with PTSD symptoms, carefully establishing rapport while gathering a thorough clinical history. The afternoon includes a DBT skills group, individual sessions using EMDR for trauma processing, and a supervision meeting with a trainee. Between sessions, you complete session notes, update treatment plans, and consult with a psychiatrist about medication questions.",
      typicalTasks: [
        "Conduct individual, couples, family, and group therapy sessions",
        "Perform clinical assessments and develop treatment plans",
        "Apply evidence-based modalities (CBT, DBT, EMDR, EFT, psychodynamic)",
        "Maintain clinical documentation and session notes",
        "Provide crisis intervention and safety planning",
        "Consult with other healthcare professionals",
        "Participate in clinical supervision and continuing education",
        "Navigate ethical dilemmas and maintain professional boundaries",
      ],
    },
    examPrepTips: [
      { title: "Know Your Therapeutic Modalities", description: "Understand the theoretical foundations, key techniques, and evidence base for CBT, DBT, EMDR, psychodynamic, humanistic, and systems theories." },
      { title: "Master Ethics and Boundaries", description: "Ethics questions are heavily weighted. Know dual relationships, confidentiality limits, duty to warn, informed consent, and cultural competence principles." },
      { title: "Study Psychopathology Thoroughly", description: "Know DSM-5 diagnostic criteria, differential diagnosis, and the relationship between diagnosis and treatment planning." },
      { title: "Practice Case Vignettes", description: "Qualifying exams test your ability to apply theory to clinical situations. Practice analyzing case vignettes and selecting appropriate interventions." },
      { title: "Understand Canadian/US Regulatory Frameworks", description: "Know the regulatory requirements, professional standards, and scope of practice for your specific jurisdiction." },
    ],
    instructors: [
      { name: "Dr. Samantha Pugh, PhD, RP, C.Psych", credentials: "PhD, RP, C.Psych", specialty: "CBT, Trauma Therapy & Clinical Supervision", bio: "Dr. Pugh is a registered psychotherapist and clinical psychologist with 17 years of experience. She specializes in trauma-informed care and has trained hundreds of therapists for qualifying exams." },
      { name: "Michael Torres, MA, RP, CCC", credentials: "MA, RP, CCC, Certified EMDR Therapist", specialty: "EMDR, Addictions & Counseling Ethics", bio: "Michael is a registered psychotherapist and certified Canadian counsellor with 14 years of clinical practice. He develops ethics education content and EMDR training programs." },
    ],
    platformStats: {
      totalQuestions: "500+",
      totalLessons: "90+",
      flashcardDecks: "35+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The Therapeutic Modality Simulator was incredibly helpful for my qualifying exam. Practicing how to apply CBT, DBT, and EMDR to specific case vignettes built my confidence in choosing the right intervention.", name: "Laura R.", role: "Newly Registered Psychotherapist, Ontario", rating: 5 },
      { quote: "Ethics was my weakest area until I used NurseNest Allied. The scenario-based ethics questions with detailed rationales taught me how to think through complex boundary and confidentiality issues.", name: "David K.", role: "RP Candidate, British Columbia", rating: 5 },
      { quote: "As an NCE candidate, I appreciated how the content covers both Canadian and US perspectives. The DSM-5 diagnostic content and case vignettes are excellent preparation.", name: "Sarah J.", role: "Licensed Professional Counselor, New York", rating: 5 },
    ],
    faq: [
      { question: "Does NurseNest Allied cover the CRPO Registration Exam?", answer: "Yes. Our psychotherapist content covers the CRPO Registration Exam (Ontario), RP qualifying exams, NCE, and CMHCE. Content spans therapeutic modalities, ethics, psychopathology, assessment, treatment planning, and crisis intervention." },
      { question: "Are multiple therapeutic modalities covered?", answer: "Yes. We cover CBT, DBT, EMDR, psychodynamic therapy, humanistic/person-centered therapy, systems theory, solution-focused therapy, and motivational interviewing." },
      { question: "Does the platform include ethics content?", answer: "Yes. Ethics is one of our most comprehensive domains, covering dual relationships, confidentiality, duty to warn, informed consent, cultural competence, and professional boundaries." },
      { question: "Is DSM-5 content included?", answer: "Yes. We cover major DSM-5 diagnostic categories, diagnostic criteria, differential diagnosis, and the relationship between assessment and treatment planning." },
      { question: "How many questions are available?", answer: "We have 500+ psychotherapy exam questions with a roadmap to 1,500+." },
      { question: "Is there a free trial?", answer: "Yes. Free diagnostic and 5 practice questions with rationales." },
      { question: "Does this cover both Canadian and US licensing exams?", answer: "Yes. Content is designed for both Canadian (CRPO, provincial) and US (NCE, CMHCE) qualifying exams. Use the region toggle for jurisdiction-specific regulatory information." },
      { question: "What study tools are included?", answer: "Question bank, mock exams, Therapeutic Modality Simulator, Ethics Scenario Drill, flashcards, study planner, and analytics." },
    ],
  },

  "social-worker": {
    careerOverview: "Licensed Clinical Social Workers (LCSWs) are mental health professionals who provide clinical assessment, diagnosis, treatment, and advocacy for individuals, families, and communities. Social workers practice across healthcare, mental health, child welfare, schools, and community agencies. Licensure requires passing the ASWB (Association of Social Work Boards) exam at the appropriate level — Bachelors, Masters, Advanced Generalist, or Clinical.",
    whyChoose: "Social work offers one of the most versatile and impactful careers in human services. LCSWs address the intersection of mental health, social justice, and systemic barriers that affect vulnerable populations. The profession provides diverse career paths — from clinical therapy to policy advocacy, hospital social work to community organizing. With strong projected growth and increasing recognition of social workers as essential healthcare providers, the field offers meaningful work with expanding opportunities.",
    salary: {
      entry: "$42,000 – $50,000",
      median: "$55,350",
      experienced: "$68,000 – $88,000",
      source: "U.S. Bureau of Labor Statistics, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Complete an Accredited Social Work Degree", description: "Earn a BSW or MSW from a CSWE-accredited program. An MSW is required for clinical licensure." },
      { step: 2, title: "Complete Supervised Clinical Hours", description: "Accumulate required supervised clinical hours (typically 2,000–4,000 hours post-MSW) for clinical licensure." },
      { step: 3, title: "Pass the ASWB Licensing Exam", description: "Pass the appropriate ASWB exam — Bachelors, Masters, Advanced Generalist, or Clinical — for your licensure level." },
      { step: 4, title: "Apply for State Licensure", description: "Apply for licensure through your state's social work licensing board. Requirements vary by state." },
      { step: 5, title: "Maintain Licensure", description: "Complete continuing education requirements as mandated by your state licensing board." },
    ],
    jobOutlook: {
      growthRate: "7%",
      growthPeriod: "2022–2032",
      openingsPerYear: "63,100",
      demandLevel: "Very High",
      source: "U.S. Bureau of Labor Statistics",
    },
    benefits: [
      { title: "Diverse Career Paths", description: "Practice in clinical therapy, hospital social work, child welfare, school settings, policy, administration, or community organizing." },
      { title: "Social Impact", description: "Advocate for vulnerable populations and work toward systemic change in healthcare, education, and social services." },
      { title: "Clinical Autonomy", description: "LCSWs can independently diagnose, treat, and bill for mental health services in most states." },
      { title: "Strong Job Market", description: "63,100 openings projected annually across all social work settings." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of an LCSW",
      narrative: "Your day begins at 8:30 AM in a community mental health center. Your first session is with a client managing major depression — you use cognitive behavioral therapy to address negative thought patterns and update the treatment plan. At 10 AM, you conduct a biopsychosocial assessment for a new client presenting with anxiety and substance use, using motivational interviewing to explore readiness for change. Mid-morning brings a crisis call — a client reports suicidal ideation. You perform a thorough risk assessment, create a safety plan, and coordinate with the psychiatrist for medication evaluation. After lunch, you facilitate a DBT skills group, complete insurance preauthorizations, and consult with a case manager about housing resources for a client experiencing homelessness. Your day ends with clinical documentation and a supervision meeting reviewing complex cases.",
      typicalTasks: [
        "Conduct biopsychosocial assessments and diagnostic evaluations",
        "Provide individual, group, and family therapy",
        "Develop and update individualized treatment plans",
        "Perform crisis intervention and safety planning",
        "Apply evidence-based interventions (CBT, DBT, MI, trauma-informed care)",
        "Coordinate care with psychiatrists, case managers, and community resources",
        "Complete clinical documentation and insurance requirements",
        "Advocate for clients and navigate systemic barriers",
      ],
    },
    examPrepTips: [
      { title: "Focus on Ethics and Professional Practice", description: "Ethics is the most heavily tested domain on ASWB exams. Know the NASW Code of Ethics, duty to warn, confidentiality limits, and dual relationship guidelines." },
      { title: "Master DSM-5 Diagnosis", description: "Know major diagnostic categories, differential diagnosis principles, and how diagnosis informs treatment planning." },
      { title: "Study Human Behavior Across the Lifespan", description: "Development theories (Erikson, Piaget, attachment theory) and their application to clinical practice are high-yield." },
      { title: "Know Evidence-Based Interventions", description: "Understand when to apply CBT, DBT, MI, solution-focused therapy, and trauma-informed approaches based on client presentation." },
      { title: "Practice with Case Vignettes", description: "ASWB exams present clinical scenarios requiring you to choose the best intervention, ethical response, or assessment approach." },
    ],
    instructors: [
      { name: "Dr. Karen Washington, PhD, LCSW, ACSW", credentials: "PhD, LCSW, ACSW, Clinical Social Work Diplomate", specialty: "Clinical Social Work & DSM-5 Diagnosis", bio: "Dr. Washington has 20 years of clinical social work practice and currently directs an MSW program, specializing in ASWB exam preparation and clinical assessment education." },
      { name: "Thomas Reilly, DSW, LCSW", credentials: "DSW, LCSW, CASAC", specialty: "Addiction Treatment & Crisis Intervention", bio: "Thomas has 16 years of clinical experience in community mental health and substance abuse treatment. He develops ASWB Clinical exam preparation content and crisis intervention training." },
    ],
    platformStats: {
      totalQuestions: "1,000+",
      totalLessons: "100+",
      flashcardDecks: "45+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The DSM-5 Diagnosis Simulator was exactly what I needed. Practicing differential diagnosis with case vignettes prepared me perfectly for the clinical scenarios on the ASWB exam.", name: "Michelle P.", role: "Newly Licensed LCSW, Pennsylvania", rating: 5 },
      { quote: "Ethics was my biggest worry going into the ASWB. The NurseNest question bank has the most thorough ethics rationales I've found anywhere — they explain the reasoning behind every ethical decision.", name: "Robert C.", role: "MSW Student, Illinois", rating: 5 },
      { quote: "I passed the ASWB Clinical exam on my first attempt after studying with NurseNest for 6 weeks. The intervention matching practice helped me confidently select the best therapeutic approach for each vignette.", name: "Diana L.", role: "LCSW, New York", rating: 5 },
    ],
    faq: [
      { question: "Does NurseNest Allied cover the ASWB Clinical exam?", answer: "Yes. Our social work content covers ASWB Clinical, Masters, and Advanced Generalist exams. Content spans human behavior, assessment/diagnosis, intervention/treatment planning, ethics, and professional practice." },
      { question: "Is DSM-5 content included?", answer: "Yes. Our DSM-5 Diagnosis Simulator provides practice with differential diagnosis using case vignettes, and the question bank covers major diagnostic categories." },
      { question: "Does the platform cover ethics?", answer: "Yes. Ethics is one of our most comprehensive domains, covering the NASW Code of Ethics, boundary issues, confidentiality, dual relationships, and professional responsibilities." },
      { question: "Are evidence-based interventions covered?", answer: "Yes. We cover CBT, DBT, MI, solution-focused therapy, trauma-informed care, and their application to clinical social work practice." },
      { question: "How many questions are available?", answer: "We have 1,000+ ASWB-aligned practice questions spanning 20 content domains including ethics, mental health, crisis intervention, trauma-informed care, child & family services, and more. New questions are added regularly." },
      { question: "Is there a free trial?", answer: "Yes. Free diagnostic and 5 practice questions with rationales." },
      { question: "Does this cover Canadian social work licensing?", answer: "Our content primarily targets ASWB exams. Canadian social work regulatory requirements vary by province, but the clinical knowledge content is broadly applicable." },
      { question: "What study tools are included?", answer: "Question bank, mock exams, DSM-5 Diagnosis Simulator, Intervention Matching Engine, flashcards, study planner, and analytics." },
    ],
  },

  "addictions-counsellor": {
    careerOverview: "Addiction Counsellors are specialized behavioral health professionals who help individuals and families affected by substance use disorders and behavioral addictions. Working in residential treatment centers, outpatient clinics, hospitals, and community organizations, addiction counsellors provide assessment, individual and group counseling, crisis intervention, and relapse prevention planning. Certification through IC&RC, CASAC, or provincial boards validates specialized competency in addiction treatment.",
    whyChoose: "Addiction counselling offers deeply meaningful work at the intersection of healthcare and human services. With the opioid epidemic and growing awareness of substance use disorders driving unprecedented demand for qualified counsellors, the field offers strong job security and the opportunity to make a transformative impact on individuals and families. The profession values lived experience, provides multiple entry pathways, and offers specialization in areas like co-occurring disorders, adolescent treatment, and medication-assisted treatment.",
    salary: {
      entry: "$35,000 – $42,000",
      median: "$49,710",
      experienced: "$58,000 – $75,000",
      source: "U.S. Bureau of Labor Statistics, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Complete Education Requirements", description: "Complete required education hours in addiction counseling, typically including a degree or certificate program in substance abuse counseling." },
      { step: 2, title: "Complete Supervised Experience", description: "Accumulate required supervised clinical hours in addiction counseling settings (typically 2,000–6,000 hours depending on credential level)." },
      { step: 3, title: "Pass the Certification Exam", description: "Pass the IC&RC ADC exam, CASAC exam, or your provincial/state-specific certification exam." },
      { step: 4, title: "Obtain State/Provincial Certification", description: "Apply for certification through your state certification board or provincial regulatory body." },
      { step: 5, title: "Maintain Certification", description: "Complete continuing education in addiction counseling topics to maintain active certification." },
    ],
    jobOutlook: {
      growthRate: "18%",
      growthPeriod: "2022–2032",
      openingsPerYear: "43,600",
      demandLevel: "Very High",
      source: "U.S. Bureau of Labor Statistics",
    },
    benefits: [
      { title: "Transformative Impact", description: "Witness recovery and transformation in clients who overcome addiction, rebuild relationships, and reclaim their lives." },
      { title: "Critical Public Health Need", description: "The addiction treatment workforce shortage means qualified counsellors are in exceptional demand across all settings." },
      { title: "Multiple Entry Pathways", description: "The profession values diverse backgrounds including lived experience, with multiple education and certification pathways." },
      { title: "Specialization Options", description: "Specialize in adolescent treatment, co-occurring disorders, medication-assisted treatment, criminal justice, or prevention." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of an Addiction Counsellor",
      narrative: "Your day begins at 8 AM in a residential treatment center. You start with a morning check-in group, assessing the emotional state of 12 clients in various stages of recovery. At 9 AM, you conduct an individual session using motivational interviewing with a new admission struggling with ambivalence about sobriety. Mid-morning brings a psychoeducation group on relapse prevention, where you teach clients to identify triggers, develop coping strategies, and build a recovery support network. After lunch, you complete a comprehensive biopsychosocial assessment for a newly admitted client, documenting substance use history, mental health symptoms, and social determinants. The afternoon includes a family session helping rebuild trust, a treatment team meeting to coordinate care, and a discharge planning session for a client transitioning to outpatient services.",
      typicalTasks: [
        "Conduct substance use assessments and develop treatment plans",
        "Facilitate individual counseling sessions using MI, CBT, and other modalities",
        "Lead group therapy sessions on topics like relapse prevention and coping skills",
        "Perform crisis intervention for clients in acute distress",
        "Coordinate care with psychiatrists, social workers, and medical providers",
        "Develop discharge and aftercare plans",
        "Facilitate family education and counseling sessions",
        "Document client progress and maintain clinical records",
      ],
    },
    examPrepTips: [
      { title: "Master Motivational Interviewing", description: "MI techniques — OARS, rolling with resistance, developing discrepancy — are heavily tested. Know the stages of change model thoroughly." },
      { title: "Know Substance Pharmacology", description: "Understand mechanisms of action, withdrawal timelines, and medical management for alcohol, opioids, benzodiazepines, stimulants, and cannabis." },
      { title: "Study Co-Occurring Disorders", description: "Dual diagnosis content is high-yield. Know how to assess and treat substance use alongside depression, anxiety, PTSD, and personality disorders." },
      { title: "Focus on Ethics", description: "42 CFR Part 2, confidentiality in substance abuse treatment, and ethical boundary management are critical exam topics." },
      { title: "Practice Case Conceptualization", description: "The exam tests your ability to develop treatment plans based on assessment data, matching interventions to client needs and readiness." },
    ],
    instructors: [
      { name: "Dr. James Mitchell, PsyD, CASAC-2, LPC", credentials: "PsyD, CASAC-2, LPC, MAC", specialty: "Addiction Counseling & Co-Occurring Disorders", bio: "Dr. Mitchell has 19 years of experience in addiction treatment across residential, outpatient, and criminal justice settings. He develops addiction counselor certification prep curricula." },
      { name: "Andrea Kim, MSW, CASAC, CRC", credentials: "MSW, CASAC, CRC, Certified ARISE Interventionist", specialty: "Family Systems & Intervention", bio: "Andrea specializes in family therapy for addiction, motivational interviewing training, and intervention facilitation with 13 years of clinical experience." },
    ],
    platformStats: {
      totalQuestions: "500+",
      totalLessons: "80+",
      flashcardDecks: "35+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The Motivational Interviewing Simulator was a game-changer. Practicing MI techniques with different client scenarios made me confident in applying OARS and recognizing change talk on the exam.", name: "Brandon W.", role: "Newly Certified CASAC, New York", rating: 5 },
      { quote: "I struggled with pharmacology until NurseNest Allied. The substance identification drills and withdrawal timeline flashcards finally made the pharmacology content click.", name: "Lisa H.", role: "Addiction Counselor Candidate, California", rating: 5 },
    ],
    faq: [
      { question: "Does NurseNest Allied cover the IC&RC ADC exam?", answer: "Yes. Our addiction counseling content covers IC&RC ADC, CASAC, CCAC, and related certification exams. Content spans substance pharmacology, assessment, treatment planning, counseling approaches, ethics, and relapse prevention." },
      { question: "Is motivational interviewing content included?", answer: "Yes. Our MI Simulator provides interactive practice with MI techniques, and the question bank extensively covers the stages of change model and MI principles." },
      { question: "Does the platform cover co-occurring disorders?", answer: "Yes. Dual diagnosis content covers assessment and treatment of substance use alongside mental health conditions including depression, anxiety, PTSD, and personality disorders." },
      { question: "Is substance pharmacology covered?", answer: "Yes. We cover mechanisms of action, withdrawal patterns, and medical management for all major substance categories." },
      { question: "How many questions are available?", answer: "We have 500+ addiction counseling questions with a roadmap to 1,500+." },
      { question: "Is there a free trial?", answer: "Yes. Free diagnostic and 5 practice questions with rationales." },
      { question: "Does this cover Canadian addiction counselor certification?", answer: "Yes. Content is relevant to CCAC and provincial certification exams. Toggle to the Canadian region for jurisdiction-specific information." },
      { question: "What study tools are included?", answer: "Question bank, mock exams, MI Simulator, Substance Identification Drill, flashcards, study planner, and analytics." },
    ],
  },

  "occupational-therapy": {
    careerOverview: "Occupational Therapists (OTs) help people of all ages participate in the activities they want and need to do through the therapeutic use of everyday activities (occupations). OTs work with individuals experiencing physical disabilities, cognitive impairments, developmental delays, and mental health conditions to improve their ability to perform daily tasks. Licensure requires passing the NBCOT OTR exam (US) or NOTCE (Canada).",
    whyChoose: "Occupational therapy combines clinical science with creative problem-solving to help people live life to the fullest. OTs enjoy strong job satisfaction, competitive salaries, and the ability to work across diverse settings including hospitals, rehabilitation centers, schools, home health, and private practice. The profession is consistently ranked among the best healthcare careers for work-life balance and job outlook.",
    salary: {
      entry: "$65,000 – $73,000",
      median: "$93,180",
      experienced: "$100,000 – $120,000",
      source: "U.S. Bureau of Labor Statistics, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Complete an Accredited OT Program", description: "Earn an entry-level master's (MOT) or doctoral (OTD) degree from an ACOTE-accredited program." },
      { step: 2, title: "Complete Level II Fieldwork", description: "Complete a minimum of 24 weeks of Level II fieldwork in supervised clinical settings." },
      { step: 3, title: "Pass the NBCOT OTR Exam", description: "Pass the National Board for Certification in Occupational Therapy (NBCOT) OTR exam." },
      { step: 4, title: "Obtain State Licensure", description: "Apply for licensure through your state's occupational therapy licensing board." },
      { step: 5, title: "Maintain Certification and Licensure", description: "Complete continuing education and professional development activities for certification renewal." },
    ],
    jobOutlook: {
      growthRate: "12%",
      growthPeriod: "2022–2032",
      openingsPerYear: "10,100",
      demandLevel: "Very High",
      source: "U.S. Bureau of Labor Statistics",
    },
    benefits: [
      { title: "Holistic Patient Care", description: "Address physical, cognitive, emotional, and environmental factors to help clients achieve meaningful daily activities." },
      { title: "Diverse Practice Settings", description: "Work in hospitals, rehab centers, schools, home health, outpatient clinics, or private practice." },
      { title: "Strong Job Outlook", description: "12% projected growth rate driven by aging populations and increased recognition of OT's value in healthcare." },
      { title: "Work-Life Balance", description: "Many OT positions offer predictable schedules, especially in outpatient, school, and private practice settings." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of an Occupational Therapist",
      narrative: "Your day begins at 8 AM in an acute rehabilitation hospital. Your first patient is recovering from a stroke — you work on upper extremity strengthening, adapted dressing techniques, and kitchen task simulation. By mid-morning, you evaluate a patient with a traumatic brain injury, assessing cognitive function, visual perception, and safety awareness for discharge planning. After lunch, you treat a patient with a hand injury, fabricating a custom orthotic and establishing a home exercise program. The afternoon includes a pediatric home health visit where you work with a 4-year-old with autism on sensory processing and fine motor skills. Between patients, you document SMART goals, write discharge summaries, and consult with the rehab team about equipment recommendations.",
      typicalTasks: [
        "Evaluate patients' functional abilities and develop treatment plans",
        "Provide therapeutic interventions for ADL/IADL performance",
        "Fabricate custom orthotics and recommend adaptive equipment",
        "Conduct cognitive rehabilitation and visual-perceptual training",
        "Assess home environments and recommend modifications",
        "Provide pediatric interventions for developmental and sensory needs",
        "Write SMART goals and document patient progress",
        "Collaborate with the rehabilitation team on discharge planning",
      ],
    },
    examPrepTips: [
      { title: "Master Clinical Reasoning", description: "The NBCOT exam tests clinical reasoning through case-based scenarios. Practice analyzing vignettes and selecting the best evaluation and intervention approaches." },
      { title: "Know Evaluation and Assessment Tools", description: "Understand standardized assessments (FIM, Barthel Index, COPM, AMPS) — their purpose, administration, and interpretation." },
      { title: "Study Across Practice Settings", description: "The NBCOT covers pediatric, adult, geriatric, and mental health content. Don't neglect any practice area." },
      { title: "Understand Frames of Reference", description: "Know MOHO, biomechanical, sensory integration, cognitive behavioral, and developmental frames of reference and when to apply each." },
      { title: "Focus on Intervention Planning", description: "The exam heavily tests your ability to choose appropriate interventions based on patient presentation, goals, and functional outcomes." },
    ],
    instructors: [
      { name: "Dr. Rebecca Santos, OTD, OTR/L, CHT", credentials: "OTD, OTR/L, CHT, BCPR", specialty: "Hand Therapy & Physical Rehabilitation", bio: "Dr. Santos is a certified hand therapist with 15 years of clinical experience across acute care, rehabilitation, and outpatient settings. She develops NBCOT exam preparation resources." },
      { name: "Christine Park, MOT, OTR/L", credentials: "MOT, OTR/L, SWC", specialty: "Pediatric OT & Sensory Integration", bio: "Christine has 12 years of pediatric occupational therapy experience in schools and clinics, specializing in sensory processing and developmental interventions." },
    ],
    platformStats: {
      totalQuestions: "400+",
      totalLessons: "100+",
      flashcardDecks: "40+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The Case Analysis Simulator prepared me perfectly for the NBCOT. Practicing clinical reasoning with OT-specific vignettes helped me develop a systematic approach to exam questions.", name: "Megan T.", role: "Newly Certified OTR/L, Maryland", rating: 5 },
      { quote: "The SMART Goal Writer tool improved not just my exam performance but my clinical writing. Learning to write measurable, functional goals translated directly to my fieldwork documentation.", name: "Jason R.", role: "OTD Student, California", rating: 5 },
    ],
    faq: [
      { question: "Does NurseNest Allied cover the NBCOT OTR exam?", answer: "Yes. Our OT content is aligned with the NBCOT OTR exam blueprint covering evaluation, intervention planning, implementation, and professional practice. We also cover content relevant to the Canadian NOTCE." },
      { question: "Are all practice settings covered?", answer: "Yes. Content spans pediatric, adult physical rehabilitation, geriatric, mental health, and community-based practice settings." },
      { question: "Does the platform include case-based questions?", answer: "Yes. Our Case Analysis Simulator and question bank provide extensive clinical reasoning practice with OT-specific case vignettes." },
      { question: "Is pediatric content included?", answer: "Yes. We cover developmental milestones, sensory processing, fine motor development, school-based OT, and pediatric evaluation tools." },
      { question: "How many questions are available?", answer: "We currently have 400+ OT exam questions with a roadmap to 1,500+." },
      { question: "Is there a free trial?", answer: "Yes. Free diagnostic and 5 practice questions with rationales." },
      { question: "Does this cover the NOTCE for Canadian students?", answer: "Yes. Content is relevant to both NBCOT (US) and NOTCE (Canada) exams. Clinical knowledge and reasoning content applies across both." },
      { question: "What study tools are included?", answer: "Question bank, mock exams, Case Analysis Simulator, SMART Goal Writer, flashcards, study planner, and analytics." },
    ],
  },

  "physical-therapy": {
    careerOverview: "Physical Therapists (PTs) are movement science experts who diagnose and treat individuals with health conditions that limit their ability to move and perform functional activities. Working across musculoskeletal, neurological, cardiopulmonary, and integumentary systems, PTs develop individualized treatment plans to reduce pain, restore function, and prevent disability. Licensure requires passing the NPTE (US) or PCE (Canada).",
    whyChoose: "Physical therapy combines exercise science, clinical reasoning, and hands-on patient care to restore people's quality of life. PTs enjoy high job satisfaction, excellent earning potential, and the ability to practice autonomously with direct patient access. The profession offers diverse specialization paths including orthopedics, sports medicine, neurology, pediatrics, and geriatrics, with strong job growth driven by aging populations and increased awareness of rehabilitation services.",
    salary: {
      entry: "$70,000 – $78,000",
      median: "$99,710",
      experienced: "$110,000 – $130,000",
      source: "U.S. Bureau of Labor Statistics, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Complete a DPT Program", description: "Earn a Doctor of Physical Therapy (DPT) degree from a CAPTE-accredited program (typically 3 years post-baccalaureate)." },
      { step: 2, title: "Complete Clinical Education", description: "Accumulate required clinical education experiences across multiple practice settings during your DPT program." },
      { step: 3, title: "Pass the NPTE", description: "Pass the National Physical Therapy Examination administered by the FSBPT." },
      { step: 4, title: "Obtain State Licensure", description: "Apply for licensure through your state's physical therapy licensing board." },
      { step: 5, title: "Pursue Board Certification (Optional)", description: "Earn ABPTS specialist certification in orthopedics, sports, neurology, pediatrics, geriatrics, or other areas." },
    ],
    jobOutlook: {
      growthRate: "15%",
      growthPeriod: "2022–2032",
      openingsPerYear: "14,800",
      demandLevel: "Very High",
      source: "U.S. Bureau of Labor Statistics",
    },
    benefits: [
      { title: "Autonomous Practice", description: "PTs have direct access in most states — patients can see you without a physician referral." },
      { title: "Excellent Compensation", description: "Median salary near $100,000 with strong earning potential in specialty areas and private practice." },
      { title: "Patient-Centered Relationships", description: "Build meaningful therapeutic relationships through extended treatment episodes — see patients progress and celebrate milestones." },
      { title: "Diverse Specializations", description: "Specialize in orthopedics, sports medicine, neurology, pediatrics, geriatrics, women's health, or aquatic therapy." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of a Physical Therapist",
      narrative: "Your day begins at 7:30 AM in an outpatient orthopedic clinic. Your first patient is 6 weeks post-ACL reconstruction — you assess range of motion, quadriceps strength, and gait quality, then progress their exercise program. By 9 AM, you're evaluating a new patient with chronic low back pain, performing a comprehensive musculoskeletal examination including special tests, and developing a treatment plan combining manual therapy and therapeutic exercise. Mid-morning brings a neurological patient recovering from a stroke — you work on balance training, gait re-education, and functional mobility. After lunch, you treat a runner with IT band syndrome using instrument-assisted soft tissue mobilization and hip strengthening exercises. The afternoon includes a post-surgical shoulder patient, a Medicare patient completing their plan of care reassessment, and documentation of progress notes with functional outcome measures.",
      typicalTasks: [
        "Perform comprehensive musculoskeletal and neuromuscular evaluations",
        "Develop individualized treatment plans with measurable goals",
        "Provide manual therapy (joint mobilization, soft tissue techniques)",
        "Design and progress therapeutic exercise programs",
        "Assess and train gait, balance, and functional mobility",
        "Apply therapeutic modalities (ultrasound, electrical stimulation, dry needling)",
        "Educate patients on injury prevention and home exercise programs",
        "Document using functional outcome measures and progress toward goals",
      ],
    },
    examPrepTips: [
      { title: "Master Musculoskeletal Content", description: "Musculoskeletal is the most heavily weighted domain on the NPTE. Know special tests, joint mobilization grades, and post-surgical rehab protocols." },
      { title: "Study Neuromuscular Thoroughly", description: "Stroke, TBI, spinal cord injury, and neurological conditions are high-yield. Know motor control theories and neurological assessment tools." },
      { title: "Know Cardiopulmonary Principles", description: "Exercise physiology, cardiac rehab, vitals interpretation, and energy conservation are frequently tested." },
      { title: "Practice Clinical Decision-Making", description: "The NPTE tests your ability to select the best evaluation, intervention, and discharge plan based on clinical scenarios." },
      { title: "Understand Professional Responsibilities", description: "Ethics, documentation requirements, supervision, referral, and evidence-based practice are tested in the non-systems domain." },
    ],
    instructors: [
      { name: "Dr. Ryan Mitchell, DPT, OCS, CSCS", credentials: "DPT, OCS, CSCS, FAAOMPT", specialty: "Orthopedic Physical Therapy & Manual Therapy", bio: "Dr. Mitchell is a board-certified orthopedic clinical specialist with 18 years of clinical and academic experience. He develops NPTE examination preparation resources and teaches musculoskeletal PT courses." },
      { name: "Dr. Ashley Kim, DPT, NCS", credentials: "DPT, NCS, CBIS", specialty: "Neurological Physical Therapy", bio: "Dr. Kim is a board-certified neurologic clinical specialist with 14 years of experience in stroke rehabilitation and traumatic brain injury. She develops neurological PT education content." },
    ],
    platformStats: {
      totalQuestions: "400+",
      totalLessons: "120+",
      flashcardDecks: "50+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The Differential Diagnosis Trainer was incredible for NPTE prep. Practicing with realistic patient presentations helped me develop a systematic approach to clinical reasoning that I still use in practice.", name: "Daniel S.", role: "Newly Licensed DPT, Massachusetts", rating: 5 },
      { quote: "The musculoskeletal content is outstanding. Special tests, joint mobilization techniques, and post-surgical protocols are covered in a depth that perfectly matches NPTE expectations.", name: "Emma W.", role: "DPT Student, Colorado", rating: 5 },
      { quote: "As a Canadian PCE candidate, the NurseNest content covered everything I needed. The clinical reasoning approach transcends borders, and the Canadian content toggle is helpful for regulatory questions.", name: "Jared C.", role: "PT Student, British Columbia", rating: 5 },
    ],
    faq: [
      { question: "Does NurseNest Allied cover the NPTE?", answer: "Yes. Our physical therapy content is aligned with the FSBPT NPTE exam blueprint covering musculoskeletal, neuromuscular, cardiopulmonary, integumentary, and non-systems domains. We also cover content relevant to the Canadian PCE." },
      { question: "Is musculoskeletal content comprehensive?", answer: "Yes. Musculoskeletal is our most extensive domain, covering special tests, joint mobilization, post-surgical rehabilitation, therapeutic exercise, and orthopedic conditions." },
      { question: "Does the platform cover neurological PT?", answer: "Yes. We cover stroke rehabilitation, TBI, SCI, Parkinson's, MS, and other neurological conditions with assessment tools, intervention strategies, and clinical scenarios." },
      { question: "Are clinical reasoning questions included?", answer: "Yes. Our Differential Diagnosis Trainer and question bank provide extensive clinical reasoning practice with patient presentations requiring evaluation and intervention decisions." },
      { question: "How many questions are available?", answer: "We currently have 400+ physical therapy exam questions with a roadmap to 2,500+." },
      { question: "Is there a free trial?", answer: "Yes. Free diagnostic and 5 practice questions with rationales." },
      { question: "Does this cover the PCE for Canadian students?", answer: "Yes. Content is relevant to both NPTE (US) and PCE (Canada) exams. Clinical knowledge content applies across both jurisdictions." },
      { question: "What study tools are included?", answer: "Question bank, mock exams, Differential Diagnosis Trainer, Gait Analysis Simulator, flashcards, study planner, and analytics." },
    ],
  },

  "occupational-therapy-assistant": {
    careerOverview: "Occupational Therapy Assistants (OTAs/COTAs) are essential rehabilitation professionals who work under the supervision of licensed Occupational Therapists to help patients develop, recover, and improve the skills needed for daily living and working. From teaching ADL techniques in skilled nursing facilities to fabricating splints in outpatient clinics, OTAs implement evidence-based interventions that directly impact patient independence. The NBCOT COTA certification validates competency in intervention implementation, clinical documentation, and professional responsibilities.",
    whyChoose: "OTA is one of the fastest-growing healthcare careers with 25% projected growth through 2032. OTAs enjoy meaningful patient interactions, diverse work settings (SNFs, hospitals, schools, home health), competitive salaries, and the flexibility to specialize in pediatrics, hand therapy, mental health, or geriatrics. The associate degree pathway makes it one of the most accessible rehabilitation careers with strong earning potential.",
    salary: {
      entry: "$42,000 – $48,000",
      median: "$62,940",
      experienced: "$68,000 – $78,000",
      source: "U.S. Bureau of Labor Statistics, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Complete an Accredited OTA Program", description: "Earn an associate degree from an ACOTE-accredited occupational therapy assistant program (typically 2 years)." },
      { step: 2, title: "Complete Level II Fieldwork", description: "Complete supervised clinical fieldwork rotations in at least two different practice settings." },
      { step: 3, title: "Pass the NBCOT COTA Exam", description: "Pass the National Board for Certification in Occupational Therapy exam to earn the COTA credential." },
      { step: 4, title: "Obtain State Licensure", description: "Apply for state licensure or registration — requirements vary by state but typically require passing the NBCOT exam." },
      { step: 5, title: "Maintain Continuing Education", description: "Complete continuing education units (CEUs) to maintain NBCOT certification and state licensure." },
    ],
    jobOutlook: {
      growthRate: "25%",
      growthPeriod: "2022–2032",
      openingsPerYear: "11,500",
      demandLevel: "Very High",
      source: "U.S. Bureau of Labor Statistics, 2024",
    },
    benefits: [
      { title: "High Job Growth", description: "25% projected growth rate — one of the fastest-growing healthcare occupations in the United States." },
      { title: "Accessible Education", description: "Associate degree pathway takes only 2 years, making it one of the most efficient routes into rehabilitation healthcare." },
      { title: "Diverse Work Settings", description: "Work in skilled nursing, hospitals, schools, home health, outpatient clinics, or mental health facilities." },
      { title: "Meaningful Patient Impact", description: "Help patients regain independence in daily activities — from dressing and cooking to returning to work." },
      { title: "Specialization Options", description: "Specialize in pediatrics, hand therapy, geriatrics, mental health, or assistive technology." },
      { title: "Work-Life Balance", description: "Many settings offer standard business hours with flexible scheduling options and part-time opportunities." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of an OTA",
      narrative: "An OTA's day begins reviewing the treatment plans set by their supervising OT. Throughout the day, they guide patients through ADL training, lead therapeutic groups, fabricate and adjust splints, and document patient progress. Each session focuses on helping patients achieve greater independence.",
      typicalTasks: [
        "Implementing ADL training (dressing, grooming, cooking, bathing)",
        "Fabricating and adjusting splints and orthotic devices",
        "Leading therapeutic group sessions for social skills or cognitive rehabilitation",
        "Selecting and training patients on adaptive equipment",
        "Documenting treatment sessions and patient progress",
        "Collaborating with OTs, nurses, and other team members",
        "Administering sensory processing interventions for pediatric patients",
        "Educating family members on home exercise programs and safety modifications",
      ],
    },
    examPrepTips: [
      { title: "Master ADL Interventions", description: "ADL training is heavily weighted on the NBCOT COTA exam. Know dressing techniques, feeding strategies, and bathing adaptations for various diagnoses." },
      { title: "Study Adaptive Equipment", description: "Be able to match specific adaptive devices (sock aids, reachers, built-up handles) to patient needs and diagnoses." },
      { title: "Know Splinting Fundamentals", description: "Understand resting hand splints, wrist cock-up splints, and thumb spica splints — including indications, positions, and wearing schedules." },
      { title: "Review Pediatric OT Content", description: "Developmental milestones, sensory processing, handwriting interventions, and school-based OT are high-yield exam topics." },
      { title: "Practice Clinical Reasoning", description: "The exam tests your ability to select and implement appropriate interventions based on clinical scenarios — not just factual recall." },
    ],
    instructors: [
      { name: "Dr. Sarah Chen, OTD, OTR/L, CHT", credentials: "OTD, OTR/L, CHT", specialty: "Hand Therapy & Upper Extremity Rehabilitation", bio: "Dr. Chen is a certified hand therapist with 15 years of clinical experience. She develops NBCOT COTA exam prep content specializing in splinting, hand therapy, and upper extremity rehabilitation." },
      { name: "Dr. Maria Rodriguez, OTD, OTR/L, SCSS", credentials: "OTD, OTR/L, SCSS", specialty: "Pediatric OT & Sensory Integration", bio: "Dr. Rodriguez is a board-certified specialist in sensory integration with 12 years of experience in pediatric OT. She develops content covering developmental milestones, sensory processing, and school-based interventions." },
    ],
    platformStats: {
      totalQuestions: "400+",
      totalLessons: "80+",
      flashcardDecks: "40+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The ADL intervention scenarios were exactly what I needed for the NBCOT COTA exam. The detailed rationales helped me understand not just the right answer, but why each option was correct or incorrect.", name: "Jessica M.", role: "Newly Certified COTA, Ohio", rating: 5 },
      { quote: "The splinting drills saved me on exam day. I had multiple questions about splint positioning and wearing schedules that I would not have gotten right without this practice.", name: "David K.", role: "OTA Student, California", rating: 5 },
      { quote: "As someone returning to OT practice after a career break, this platform helped me refresh my clinical knowledge systematically. The adaptive flashcards were especially helpful for retaining terminology.", name: "Amanda L.", role: "Returning COTA, Florida", rating: 5 },
    ],
    faq: [
      { question: "Does NurseNest Allied cover the NBCOT COTA exam?", answer: "Yes. Our OTA content is aligned with the NBCOT COTA exam blueprint covering all four domains: intervention implementation, activity analysis, clinical reasoning, and professional practice management." },
      { question: "Is the content specific to the OTA (assistant) level?", answer: "Yes. All questions and content are written at the assistant level — focusing on intervention implementation and clinical skills under OT supervision, not evaluation or treatment planning." },
      { question: "How many practice questions are available?", answer: "We currently have 400+ NBCOT COTA-aligned practice questions with a roadmap to 1,500+. Every question includes 600+ word rationales." },
      { question: "Are there mock exams?", answer: "Yes. Take unlimited full-length mock exams with blueprint-weighted question distribution, timed conditions, and domain-level scoring analytics." },
      { question: "Is there a free trial?", answer: "Yes. Free diagnostic assessment plus 5 practice questions with full rationales — no credit card required." },
    ],
  },

  "physiotherapy-assistant": {
    careerOverview: "Physical Therapist Assistants (PTAs), also known as Physiotherapy Assistants in Canada, are skilled rehabilitation professionals who work under the direction of physical therapists to help patients improve movement, manage pain, and restore function. PTAs implement treatment plans involving therapeutic exercises, manual therapy techniques, gait training, and physical modalities. The NPTE-PTA certification from the FSBPT validates competency in implementing physical therapy interventions across musculoskeletal, neuromuscular, cardiopulmonary, and integumentary systems.",
    whyChoose: "PTA is one of the fastest-growing healthcare careers with 26% projected growth through 2032. PTAs enjoy hands-on patient care, strong job security, competitive salaries, and the opportunity to work across diverse settings including hospitals, outpatient clinics, home health, skilled nursing, and sports rehabilitation. The associate degree pathway provides an efficient entry into a rewarding rehabilitation career.",
    salary: {
      entry: "$42,000 – $48,000",
      median: "$62,770",
      experienced: "$65,000 – $80,000",
      source: "U.S. Bureau of Labor Statistics, 2024",
    },
    licensingPathway: [
      { step: 1, title: "Complete an Accredited PTA Program", description: "Earn an associate degree from a CAPTE-accredited physical therapist assistant program (typically 2 years)." },
      { step: 2, title: "Complete Clinical Rotations", description: "Complete supervised clinical education experiences in multiple practice settings as required by your program." },
      { step: 3, title: "Pass the NPTE-PTA", description: "Pass the National Physical Therapy Examination for PTAs, administered by the FSBPT, to demonstrate clinical competency." },
      { step: 4, title: "Obtain State Licensure", description: "Apply for state licensure — all US states require PTA licensure beyond the NPTE-PTA. Requirements vary by state." },
      { step: 5, title: "Maintain Continuing Education", description: "Complete continuing education requirements for state licensure renewal and optional specialty certifications." },
    ],
    jobOutlook: {
      growthRate: "26%",
      growthPeriod: "2022–2032",
      openingsPerYear: "14,400",
      demandLevel: "Very High",
      source: "U.S. Bureau of Labor Statistics, 2024",
    },
    benefits: [
      { title: "Exceptional Job Growth", description: "26% projected growth rate — one of the fastest-growing healthcare occupations in the country." },
      { title: "Accessible Education", description: "Associate degree pathway takes only 2 years, providing an efficient entry into rehabilitation healthcare." },
      { title: "Hands-On Patient Care", description: "Work directly with patients to improve mobility, reduce pain, and restore function through therapeutic interventions." },
      { title: "Diverse Practice Settings", description: "Work in hospitals, outpatient clinics, home health, skilled nursing, sports rehab, or school systems." },
      { title: "Strong Earning Potential", description: "Competitive salaries with opportunities for advancement through specialization and continuing education." },
      { title: "Physical Activity", description: "An active career that keeps you moving — demonstrating exercises, assisting with gait training, and performing manual techniques." },
    ],
    dayInTheLife: {
      title: "A Day in the Life of a PTA",
      narrative: "A PTA's day involves guiding patients through therapeutic exercises, applying physical modalities like ultrasound or electrical stimulation, assisting with gait training, and collecting clinical data to track progress. Each treatment session is tailored to the patient's plan of care set by the supervising PT.",
      typicalTasks: [
        "Implementing therapeutic exercise programs for orthopedic and neurological patients",
        "Applying physical modalities (ultrasound, TENS, NMES, iontophoresis, hot/cold)",
        "Assisting patients with gait training using assistive devices",
        "Performing manual therapy techniques within the plan of care",
        "Collecting clinical data (ROM, MMT, vitals, functional measures)",
        "Documenting treatment sessions and patient progress",
        "Educating patients on home exercise programs and body mechanics",
        "Collaborating with PTs, physicians, and other healthcare team members",
      ],
    },
    examPrepTips: [
      { title: "Master Musculoskeletal Content", description: "Musculoskeletal is the most heavily weighted content area on the NPTE-PTA (approximately 35%). Know special tests, therapeutic exercises, and post-surgical protocols." },
      { title: "Study Neuromuscular Thoroughly", description: "Stroke, TBI, spinal cord injury, and neurological conditions are high-yield. Know motor control theories, gait deviations, and neurological assessment tools." },
      { title: "Know Modality Parameters", description: "Be able to select appropriate modalities and set parameters for ultrasound, electrical stimulation, iontophoresis, and thermal agents." },
      { title: "Practice Gait Analysis", description: "Identify gait deviations, determine causes, and select appropriate assistive devices and corrective interventions." },
      { title: "Understand Non-Systems Topics", description: "Safety, professional responsibilities, documentation, supervision, and evidence-based practice make up approximately 20% of the exam." },
    ],
    instructors: [
      { name: "Dr. James Thompson, DPT, SCS", credentials: "DPT, SCS, CSCS", specialty: "Sports Physical Therapy & Orthopedics", bio: "Dr. Thompson is a board-certified sports clinical specialist with 16 years of clinical and teaching experience. He develops NPTE-PTA examination preparation resources focusing on musculoskeletal assessment and sports rehabilitation." },
      { name: "Dr. Lisa Park, DPT, GCS", credentials: "DPT, GCS, CEEAA", specialty: "Geriatric Physical Therapy", bio: "Dr. Park is a board-certified geriatric clinical specialist with 13 years of experience. She develops PTA education content covering geriatric rehabilitation, balance training, and fall prevention." },
    ],
    platformStats: {
      totalQuestions: "2,000+",
      totalLessons: "150+",
      flashcardDecks: "60+",
      mockExams: "Unlimited",
    },
    testimonials: [
      { quote: "The NPTE-PTA question bank is incredible. 2,000+ questions with detailed rationales helped me feel completely prepared on exam day. The domain-level scoring showed me exactly where to focus.", name: "Tyler R.", role: "Newly Licensed PTA, Texas", rating: 5 },
      { quote: "The Modality Selection Trainer was a game-changer. I had multiple modality questions on my exam and got them all right because of the practice scenarios on this platform.", name: "Sarah K.", role: "PTA Student, New York", rating: 5 },
      { quote: "As a Canadian physiotherapy assistant student, this platform covered everything I needed. The gait analysis tool and therapeutic exercise library are outstanding for both NPTE-PTA and provincial exams.", name: "Michael W.", role: "PTA Student, Ontario", rating: 5 },
    ],
    faq: [
      { question: "Does NurseNest Allied cover the NPTE-PTA?", answer: "Yes. Our PTA content is aligned with the FSBPT NPTE-PTA exam blueprint covering musculoskeletal, neuromuscular, cardiopulmonary, integumentary, and non-systems content areas." },
      { question: "Is this different from NPTE-PT content?", answer: "Yes. All questions and content are written at the PTA (assistant) level — focusing on intervention implementation and data collection within the plan of care, not evaluation or diagnosis." },
      { question: "How many practice questions are available?", answer: "We have 2,000+ NPTE-PTA-aligned practice questions across 20 clinical domains. Every question includes 600+ word rationales." },
      { question: "Does this cover Canadian physiotherapy assistant content?", answer: "Yes. We use dual terminology and include content relevant to both NPTE-PTA (US) and provincial certification (Canada)." },
      { question: "Is there a free trial?", answer: "Yes. Free diagnostic assessment plus 5 practice questions with full rationales — no credit card required." },
    ],
  },
};

export function getHubMarketingData(slug: string): HubMarketingData | undefined {
  return HUB_MARKETING[slug];
}
