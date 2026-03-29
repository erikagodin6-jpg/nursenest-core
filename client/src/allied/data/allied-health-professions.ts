export interface TopicTemplate {
  slug: string;
  title: string;
  targetKeyword: string;
}

export interface AlliedHealthProfession {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  color: string;
  colorAccent: string;
  icon: string;
  overview: string;
  whereTheyWork: string[];
  responsibilities: string[];
  patientPopulations: string[];
  educationPathways: string[];
  certificationOverview: string;
  examNames: string[];
  salaryRange: string;
  jobOutlook: string;
  medianSalary: string;
  growthRate: string;
  educationRequired: string;
  studyResources: {
    questionBanks: { label: string; link: string };
    flashcards: { label: string; link: string };
    mockExams: { label: string; link: string };
    clinicalCases: { label: string; link: string };
  };
  studyResourceCTAs: {
    questionBank: string;
    mockExams: string;
    flashcards: string;
    clinicalCases: string;
  };
  topicTemplates: TopicTemplate[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  relatedProfessions: string[];
  hasStudyContent?: boolean;
}

export const ALLIED_HEALTH_PROFESSIONS: Record<string, AlliedHealthProfession> = {
  "respiratory-therapy": {
    slug: "respiratory-therapy",
    name: "Respiratory Therapy",
    shortName: "RRT",
    tagline: "Breathe life into your career as a Registered Respiratory Therapist",
    description: "Respiratory therapists are essential members of the healthcare team who specialize in cardiopulmonary care, ventilator management, and airway management for patients of all ages.",
    color: "#2196F3",
    colorAccent: "#E3F2FD",
    icon: "Wind",
    overview: "Respiratory therapists (RTs) are licensed healthcare professionals who evaluate, treat, and manage patients with breathing disorders and cardiopulmonary diseases. They work alongside physicians and nurses to provide life-sustaining treatments including mechanical ventilation, oxygen therapy, aerosol medication delivery, and pulmonary rehabilitation. RTs play a critical role in emergency departments, intensive care units, neonatal units, and pulmonary function laboratories. The profession requires strong clinical judgment, technical expertise with complex equipment, and the ability to respond quickly in life-threatening situations.",
    whereTheyWork: [
      "Hospitals (ICU, NICU, Emergency Department, Operating Room)",
      "Long-term acute care facilities",
      "Pulmonary rehabilitation centers",
      "Sleep disorder clinics",
      "Home health agencies",
      "Physician offices and outpatient clinics",
      "Universities and teaching hospitals"
    ],
    responsibilities: [
      "Managing mechanical ventilators and monitoring ventilator waveforms",
      "Performing and interpreting arterial blood gas (ABG) analysis",
      "Administering bronchodilators and aerosolized medications",
      "Conducting pulmonary function testing (PFT)",
      "Managing artificial airways (intubation, tracheostomy care)",
      "Providing oxygen therapy and monitoring SpO2",
      "Performing chest physiotherapy and airway clearance techniques",
      "Assisting with cardiopulmonary resuscitation (CPR)",
      "Educating patients on disease management and inhaler technique",
      "Monitoring and adjusting CPAP/BiPAP for sleep disorders"
    ],
    patientPopulations: [
      "Critically ill adults in ICU",
      "Premature infants and neonates",
      "Pediatric patients with asthma and cystic fibrosis",
      "COPD and chronic lung disease patients",
      "Post-surgical patients requiring respiratory support",
      "Trauma patients with chest injuries",
      "Patients with neuromuscular diseases affecting breathing"
    ],
    educationPathways: [
      "Associate degree in Respiratory Therapy (2 years) — entry-level",
      "Bachelor's degree in Respiratory Therapy (4 years) — preferred by many employers",
      "Master's degree for advanced practice and leadership roles",
      "Clinical rotations in hospitals and specialty settings",
      "Continuing education requirements for license renewal"
    ],
    certificationOverview: "In the United States, respiratory therapists must pass the NBRC Therapist Multiple-Choice (TMC) exam to earn the Certified Respiratory Therapist (CRT) credential. The Registered Respiratory Therapist (RRT) credential requires passing both the TMC at the high cut score and the Clinical Simulation Exam (CSE). In Canada, the Canadian Board for Respiratory Care (CBRC) administers the national certification exam.",
    examNames: ["NBRC TMC", "NBRC CSE", "CBRC"],
    salaryRange: "$55,000 – $85,000 USD",
    jobOutlook: "14% growth projected through 2032 (much faster than average)",
    medianSalary: "$62,810",
    growthRate: "14%",
    educationRequired: "Associate's degree minimum; Bachelor's preferred",
    studyResources: {
      questionBanks: { label: "RRT Test Bank", link: "/allied-health/rrt/practice-questions" },
      flashcards: { label: "RRT Flashcards", link: "/allied-health/rrt/flashcards" },
      mockExams: { label: "RRT Mock Exams", link: "/allied-health/rrt/mock-exams" },
      clinicalCases: { label: "Clinical Case Studies", link: "/allied-health/rrt/study-guide" },
    },
    studyResourceCTAs: {
      questionBank: "/allied-health/rrt/practice-questions",
      mockExams: "/allied-health/rrt/mock-exams",
      flashcards: "/allied-health/rrt/flashcards",
      clinicalCases: "/allied-health/rrt/study-guide",
    },
    topicTemplates: [
      { slug: "mechanical-ventilation-modes", title: "Mechanical Ventilation Modes Explained", targetKeyword: "mechanical ventilation modes" },
      { slug: "abg-interpretation-guide", title: "ABG Interpretation: A Complete Guide", targetKeyword: "ABG interpretation" },
      { slug: "oxygen-therapy-devices", title: "Oxygen Therapy Devices and Delivery Systems", targetKeyword: "oxygen therapy devices" },
      { slug: "pulmonary-function-testing", title: "Pulmonary Function Testing (PFT) Guide", targetKeyword: "pulmonary function testing" },
      { slug: "neonatal-respiratory-care", title: "Neonatal Respiratory Care Essentials", targetKeyword: "neonatal respiratory care" },
      { slug: "airway-management-techniques", title: "Airway Management Techniques for RRTs", targetKeyword: "airway management techniques" },
    ],
    seo: {
      title: "Respiratory Therapy Practice Questions & Exam Prep | NurseNest",
      description: "Prepare for the NBRC TMC, CSE, and CBRC exams with 500+ respiratory therapy practice questions, mock exams, ABG interpretation drills, and ventilator management scenarios. Build exam confidence today.",
      keywords: "respiratory therapy exam prep, RRT practice questions, NBRC TMC questions, NBRC CSE prep, CBRC exam, ABG interpretation practice, ventilator management quiz, respiratory therapist certification",
    },
    relatedProfessions: ["paramedic", "surgical-technologist", "diagnostic-sonography"],
  },
  "medical-laboratory-technologist": {
    slug: "medical-laboratory-technologist",
    name: "Medical Laboratory Technologist",
    shortName: "MLT",
    tagline: "Uncover answers in the lab that drive patient diagnoses",
    description: "Medical laboratory technologists perform complex analyses on blood, tissue, and body fluids to help physicians diagnose diseases, monitor treatments, and prevent illness.",
    color: "#9C27B0",
    colorAccent: "#F3E5F5",
    icon: "Microscope",
    overview: "Medical Laboratory Technologists (MLTs) are highly trained scientists who work behind the scenes in healthcare, performing laboratory tests essential for diagnosing and treating diseases. They analyze blood, urine, body fluids, and tissue samples using sophisticated instruments and manual techniques. MLTs work across multiple disciplines including clinical chemistry, hematology, microbiology, immunohematology (blood banking), and molecular diagnostics. Their work directly impacts patient outcomes — approximately 70% of all medical decisions rely on laboratory test results.",
    whereTheyWork: [
      "Hospital clinical laboratories",
      "Reference and commercial laboratories",
      "Public health laboratories",
      "Research institutions and universities",
      "Forensic laboratories",
      "Pharmaceutical companies",
      "Blood banks and donor centers",
      "Veterinary laboratories"
    ],
    responsibilities: [
      "Performing hematology tests (CBC, differential, coagulation studies)",
      "Conducting clinical chemistry analyses (metabolic panels, liver function, cardiac markers)",
      "Identifying microorganisms through culture, staining, and sensitivity testing",
      "Performing blood typing, crossmatching, and antibody identification",
      "Analyzing urine and body fluids",
      "Operating and maintaining automated analyzers",
      "Performing quality control and quality assurance procedures",
      "Evaluating and validating test results for accuracy",
      "Recognizing critical values and communicating them to providers",
      "Performing molecular diagnostic testing (PCR, sequencing)"
    ],
    patientPopulations: [
      "All hospitalized patients requiring diagnostic testing",
      "Emergency department patients needing stat lab results",
      "Oncology patients undergoing treatment monitoring",
      "Surgical patients requiring blood typing and crossmatching",
      "Prenatal patients requiring screening tests",
      "Patients with infectious diseases",
      "Newborns requiring metabolic screening"
    ],
    educationPathways: [
      "Bachelor's degree in Medical Laboratory Science or Clinical Laboratory Science (4 years)",
      "Associate degree in Medical Laboratory Technology (2 years) — for MLT certification",
      "Post-baccalaureate certificate programs for career changers",
      "Clinical practicum in hospital laboratory settings",
      "Specialty certifications available in blood banking, microbiology, chemistry, etc."
    ],
    certificationOverview: "In the United States, the American Society for Clinical Pathology (ASCP) Board of Certification offers the MLS (Medical Laboratory Scientist) and MLT (Medical Laboratory Technician) credentials. In Canada, the Canadian Society for Medical Laboratory Science (CSMLS) administers the national certification examination for Medical Laboratory Technologists.",
    examNames: ["CSMLS MLT", "ASCP MLS", "ASCP MLT"],
    salaryRange: "$50,000 – $78,000 USD",
    jobOutlook: "7% growth projected through 2032 (faster than average)",
    medianSalary: "$57,380",
    growthRate: "7%",
    educationRequired: "Bachelor's degree (MLS); Associate's degree (MLT)",
    studyResources: {
      questionBanks: { label: "MLT Test Bank", link: "/allied-health/mlt/questions" },
      flashcards: { label: "MLT Flashcards", link: "/allied-health/mlt/flashcard-prep" },
      mockExams: { label: "MLT Mock Exams", link: "/allied-health/mlt/mock-exams" },
      clinicalCases: { label: "Lab Case Studies", link: "/allied-health/mlt/study-guide" },
    },
    studyResourceCTAs: {
      questionBank: "/allied-health/mlt/questions",
      mockExams: "/allied-health/mlt/mock-exams",
      flashcards: "/allied-health/mlt/flashcard-prep",
      clinicalCases: "/allied-health/mlt/study-guide",
    },
    topicTemplates: [
      { slug: "hematology-cbc-interpretation", title: "Complete Blood Count (CBC) Interpretation Guide", targetKeyword: "CBC interpretation" },
      { slug: "blood-banking-crossmatch", title: "Blood Banking and Crossmatch Procedures", targetKeyword: "blood banking crossmatch" },
      { slug: "clinical-chemistry-panels", title: "Clinical Chemistry: Metabolic Panels Explained", targetKeyword: "clinical chemistry panels" },
      { slug: "microbiology-culture-identification", title: "Microbiology Culture and Organism Identification", targetKeyword: "microbiology culture identification" },
      { slug: "coagulation-studies-guide", title: "Coagulation Studies: PT, PTT, and INR Guide", targetKeyword: "coagulation studies" },
      { slug: "urinalysis-body-fluids", title: "Urinalysis and Body Fluid Analysis", targetKeyword: "urinalysis body fluids" },
    ],
    seo: {
      title: "MLT Practice Questions & CSMLS/ASCP Exam Prep | NurseNest",
      description: "Ace your CSMLS or ASCP certification with MLT practice questions covering hematology, microbiology, blood banking, and clinical chemistry. Mock exams, flashcards, and detailed rationales included.",
      keywords: "MLT exam prep, CSMLS practice questions, ASCP MLS exam, medical laboratory technologist certification, hematology questions, microbiology quiz, blood banking practice, clinical chemistry exam",
    },
    relatedProfessions: ["respiratory-therapy", "radiologic-technologist", "pharmacy-technician"],
  },
  "paramedic": {
    slug: "paramedic",
    name: "Paramedic",
    shortName: "Paramedic",
    tagline: "Be the first responder who makes the critical difference",
    description: "Paramedics provide advanced prehospital emergency medical care, performing life-saving interventions in the field for patients experiencing medical emergencies and traumatic injuries.",
    color: "#F44336",
    colorAccent: "#FFEBEE",
    icon: "Ambulance",
    overview: "Paramedics are highly trained emergency medical professionals who provide advanced life support (ALS) in prehospital settings. They respond to 911 calls, assess patients, make rapid clinical decisions, and deliver life-saving interventions including advanced airway management, cardiac monitoring and defibrillation, IV medication administration, and trauma care. Paramedics operate in high-stress, unpredictable environments and must be prepared to manage any medical or traumatic emergency from cardiac arrests to multi-vehicle collisions. They are the highest-level prehospital care providers and serve as the critical link between the scene and the emergency department.",
    whereTheyWork: [
      "Municipal ambulance services (fire-based and third-service EMS)",
      "Private ambulance companies",
      "Hospital emergency departments",
      "Air medical transport (helicopter EMS)",
      "Critical care transport teams",
      "Industrial and event medical services",
      "Military and tactical EMS",
      "Community paramedicine programs"
    ],
    responsibilities: [
      "Performing rapid patient assessments in emergency situations",
      "Managing cardiac emergencies (12-lead ECG, defibrillation, cardioversion, pacing)",
      "Advanced airway management (intubation, surgical airways, RSI)",
      "Establishing IV/IO access and administering emergency medications",
      "Performing trauma assessments and spinal immobilization",
      "Managing pediatric and neonatal emergencies",
      "Conducting obstetric assessments and emergency deliveries",
      "Interpreting ECG rhythms and managing dysrhythmias",
      "Operating cardiac monitors, ventilators, and infusion pumps",
      "Documenting patient care and communicating with receiving facilities"
    ],
    patientPopulations: [
      "Cardiac arrest and acute coronary syndrome patients",
      "Trauma victims (motor vehicle accidents, falls, assaults)",
      "Pediatric emergencies",
      "Obstetric emergencies",
      "Stroke patients",
      "Respiratory distress patients",
      "Psychiatric and behavioral emergencies",
      "Geriatric patients with medical emergencies"
    ],
    educationPathways: [
      "Primary Care Paramedic (PCP) certificate — 1-2 years",
      "Advanced Care Paramedic (ACP) diploma — 2-3 years",
      "Associate degree in Paramedicine — USA entry level (2 years)",
      "Bachelor's degree in Paramedicine — increasingly common",
      "Clinical rotations in ambulance services and emergency departments",
      "Continuing education and recertification requirements"
    ],
    certificationOverview: "In the United States, the National Registry of Emergency Medical Technicians (NREMT) administers the paramedic certification exam, which includes both cognitive and psychomotor components. In Canada, certification is managed provincially, with many provinces using the COPR (Canadian Organization of Paramedic Regulators) competency framework. Paramedics must maintain certification through continuing education and periodic recertification.",
    examNames: ["NREMT Paramedic", "COPR", "PCP/ACP Provincial"],
    salaryRange: "$40,000 – $72,000 USD",
    jobOutlook: "5% growth projected through 2032 (average)",
    medianSalary: "$49,590",
    growthRate: "5%",
    educationRequired: "Certificate or Associate's degree",
    studyResources: {
      questionBanks: { label: "Paramedic Test Bank", link: "/allied-health/paramedic/questions" },
      flashcards: { label: "Paramedic Flashcards", link: "/allied-health/paramedic/flashcards" },
      mockExams: { label: "Paramedic Mock Exams", link: "/allied-health/paramedic/practice-exams" },
      clinicalCases: { label: "Field Scenarios", link: "/allied-health/paramedic/scenarios" },
    },
    studyResourceCTAs: {
      questionBank: "/allied-health/paramedic/questions",
      mockExams: "/allied-health/paramedic/practice-exams",
      flashcards: "/allied-health/paramedic/flashcards",
      clinicalCases: "/allied-health/paramedic/scenarios",
    },
    topicTemplates: [
      { slug: "cardiac-arrest-management", title: "Cardiac Arrest Management: ACLS Algorithms", targetKeyword: "cardiac arrest management ACLS" },
      { slug: "trauma-assessment-primary-survey", title: "Trauma Assessment: Primary and Secondary Survey", targetKeyword: "trauma assessment primary survey" },
      { slug: "pediatric-emergencies-pals", title: "Pediatric Emergencies and PALS Protocols", targetKeyword: "pediatric emergencies PALS" },
      { slug: "pharmacology-emergency-medications", title: "Emergency Pharmacology: Field Medications Guide", targetKeyword: "emergency pharmacology medications" },
      { slug: "ecg-rhythm-interpretation", title: "ECG Rhythm Interpretation for Paramedics", targetKeyword: "ECG rhythm interpretation paramedic" },
      { slug: "airway-management-rsi", title: "Advanced Airway Management and RSI", targetKeyword: "airway management RSI paramedic" },
    ],
    seo: {
      title: "Paramedic Practice Questions & NREMT Exam Prep | NurseNest",
      description: "Pass your NREMT or COPR paramedic exam with realistic practice questions, ACLS/PALS scenarios, trauma assessment drills, and timed mock exams. Detailed rationales for every question.",
      keywords: "paramedic exam prep, NREMT practice questions, COPR paramedic exam, paramedic mock exam, ACLS questions, trauma assessment quiz, EMS certification prep, advanced life support practice",
    },
    relatedProfessions: ["respiratory-therapy", "surgical-technologist", "radiologic-technologist"],
  },
  "radiologic-technologist": {
    slug: "radiologic-technologist",
    name: "Radiologic Technologist",
    shortName: "Rad Tech",
    tagline: "See beyond the surface with diagnostic imaging expertise",
    description: "Radiologic technologists perform diagnostic imaging examinations including X-rays, CT scans, and fluoroscopy to help physicians diagnose injuries and diseases.",
    color: "#FF9800",
    colorAccent: "#FFF3E0",
    icon: "ScanLine",
    overview: "Radiologic technologists (also called radiographers) are healthcare professionals who perform diagnostic imaging examinations on patients. They operate X-ray machines, CT scanners, fluoroscopy units, and other imaging equipment to produce images that physicians use to diagnose and treat medical conditions. Rad techs must have strong knowledge of anatomy, positioning techniques, radiation physics, and patient safety. They balance producing high-quality diagnostic images while minimizing radiation exposure to patients and staff through the ALARA (As Low As Reasonably Achievable) principle.",
    whereTheyWork: [
      "Hospitals (radiology departments, emergency departments, operating rooms)",
      "Outpatient imaging centers",
      "Urgent care clinics",
      "Orthopedic offices",
      "Mobile imaging services",
      "Veterans Affairs medical centers",
      "Research facilities"
    ],
    responsibilities: [
      "Positioning patients for X-ray, CT, and fluoroscopic examinations",
      "Operating radiographic and CT equipment",
      "Adjusting technical factors (kVp, mAs) for optimal image quality",
      "Applying radiation protection principles (shielding, collimation, ALARA)",
      "Evaluating image quality and repeating images when necessary",
      "Preparing and administering contrast media",
      "Maintaining imaging equipment and quality control protocols",
      "Assisting radiologists during fluoroscopic and interventional procedures",
      "Documenting procedures and patient information",
      "Managing pediatric and trauma imaging challenges"
    ],
    patientPopulations: [
      "Emergency department patients with injuries",
      "Orthopedic patients requiring bone and joint imaging",
      "Chest imaging for respiratory conditions",
      "Surgical patients requiring intraoperative imaging",
      "Pediatric patients requiring age-appropriate techniques",
      "Bariatric patients requiring modified positioning",
      "Geriatric patients with mobility limitations"
    ],
    educationPathways: [
      "Associate degree in Radiologic Technology (2 years) — minimum requirement",
      "Bachelor's degree in Radiologic Sciences (4 years) — preferred",
      "Clinical rotations in hospital imaging departments",
      "Advanced certifications in CT, MRI, mammography, or interventional",
      "Continuing education for license renewal (24 CE credits every 2 years)"
    ],
    certificationOverview: "In the United States, the American Registry of Radiologic Technologists (ARRT) administers the radiography certification exam. Candidates must graduate from an accredited program and pass the ARRT exam. In Canada, the Canadian Association of Medical Radiation Technologists (CAMRT) oversees national certification. Many states and provinces require licensure in addition to national certification.",
    examNames: ["ARRT Radiography", "CAMRT", "State Licensure"],
    salaryRange: "$52,000 – $82,000 USD",
    jobOutlook: "6% growth projected through 2032 (faster than average)",
    medianSalary: "$65,140",
    growthRate: "6%",
    educationRequired: "Associate's degree minimum; Bachelor's preferred",
    studyResources: {
      questionBanks: { label: "Imaging Test Bank", link: "/allied-health/imaging/questions" },
      flashcards: { label: "Imaging Flashcards", link: "/allied-health/imaging/flashcards" },
      mockExams: { label: "Imaging Mock Exams", link: "/allied-health/imaging/practice-exam" },
      clinicalCases: { label: "Positioning Cases", link: "/allied-health/imaging/positioning" },
    },
    studyResourceCTAs: {
      questionBank: "/allied-health/imaging/questions",
      mockExams: "/allied-health/imaging/practice-exam",
      flashcards: "/allied-health/imaging/flashcards",
      clinicalCases: "/allied-health/imaging/positioning",
    },
    topicTemplates: [
      { slug: "radiographic-positioning-guide", title: "Radiographic Positioning: Complete Guide", targetKeyword: "radiographic positioning" },
      { slug: "radiation-safety-alara", title: "Radiation Safety and ALARA Principles", targetKeyword: "radiation safety ALARA" },
      { slug: "ct-imaging-fundamentals", title: "CT Imaging Fundamentals for Rad Techs", targetKeyword: "CT imaging fundamentals" },
      { slug: "contrast-media-administration", title: "Contrast Media Administration and Reactions", targetKeyword: "contrast media administration" },
      { slug: "image-quality-factors", title: "Image Quality Factors: kVp, mAs, and Exposure", targetKeyword: "image quality factors" },
      { slug: "pediatric-imaging-techniques", title: "Pediatric Imaging Techniques and Safety", targetKeyword: "pediatric imaging techniques" },
    ],
    seo: {
      title: "Radiography Practice Questions & ARRT/CAMRT Exam Prep | NurseNest",
      description: "Prepare for the ARRT or CAMRT radiography exam with positioning questions, radiation safety drills, image quality scenarios, and timed mock exams. Exam-aligned content with detailed rationales.",
      keywords: "ARRT exam prep, CAMRT practice questions, radiography exam, radiologic technologist certification, positioning quiz, radiation safety questions, CT exam prep, diagnostic imaging practice",
    },
    relatedProfessions: ["diagnostic-sonography", "cardiac-sonographer", "medical-laboratory-technologist"],
  },
  "diagnostic-sonography": {
    slug: "diagnostic-sonography",
    name: "Diagnostic Medical Sonography",
    shortName: "Sonographer",
    tagline: "Use ultrasound technology to reveal critical diagnostic information",
    description: "Diagnostic medical sonographers use ultrasound equipment to produce images of internal organs, tissues, and blood flow to assist physicians in diagnosing medical conditions.",
    color: "#00BCD4",
    colorAccent: "#E0F7FA",
    icon: "Monitor",
    overview: "Diagnostic medical sonographers are skilled professionals who use high-frequency sound waves (ultrasound) to produce real-time images of the body's internal structures. Unlike X-rays and CT scans, ultrasound does not use ionizing radiation, making it a preferred imaging method for many clinical applications. Sonographers must have excellent knowledge of anatomy, pathology, and ultrasound physics. They perform abdominal, obstetric, vascular, musculoskeletal, and small parts examinations, and their findings directly influence clinical decisions. The role requires strong hand-eye coordination, analytical thinking, and the ability to recognize normal versus abnormal sonographic findings.",
    whereTheyWork: [
      "Hospital imaging departments",
      "OB/GYN and maternal-fetal medicine offices",
      "Vascular surgery practices",
      "Outpatient imaging centers",
      "Mobile ultrasound services",
      "Emergency departments (point-of-care ultrasound)",
      "Research facilities"
    ],
    responsibilities: [
      "Performing abdominal sonographic examinations (liver, gallbladder, kidneys, pancreas)",
      "Conducting obstetric ultrasounds (fetal anatomy, biophysical profiles, dating scans)",
      "Performing vascular studies (carotid, venous, arterial Doppler)",
      "Evaluating thyroid, breast, and other superficial structures",
      "Applying Doppler techniques to assess blood flow",
      "Recognizing normal and abnormal sonographic patterns",
      "Documenting findings and preparing preliminary reports",
      "Maintaining ultrasound equipment and performing QA checks",
      "Guiding interventional procedures (biopsies, drainages)",
      "Communicating critical findings to physicians"
    ],
    patientPopulations: [
      "Pregnant patients (routine and high-risk obstetrics)",
      "Patients with abdominal pain requiring organ evaluation",
      "Vascular patients at risk for DVT or carotid stenosis",
      "Thyroid and breast abnormality patients",
      "Emergency patients requiring FAST exams",
      "Neonatal patients requiring cranial ultrasound",
      "Patients with musculoskeletal injuries"
    ],
    educationPathways: [
      "Associate degree in Diagnostic Medical Sonography (2 years)",
      "Bachelor's degree in Diagnostic Medical Sonography (4 years)",
      "Certificate programs for imaging professionals (12-18 months)",
      "Clinical externships in hospital and outpatient settings",
      "Specialty concentrations: Abdomen, OB/GYN, Vascular, Cardiac"
    ],
    certificationOverview: "In the United States, the American Registry for Diagnostic Medical Sonography (ARDMS) offers specialty-specific credentials including RDMS (Registered Diagnostic Medical Sonographer), RVT (Registered Vascular Technologist), and RDCS (Registered Diagnostic Cardiac Sonographer). Candidates must pass the Sonography Principles and Instrumentation (SPI) exam plus a specialty exam. In Canada, Sonography Canada administers the national certification.",
    examNames: ["ARDMS RDMS", "ARDMS SPI", "Sonography Canada"],
    salaryRange: "$58,000 – $90,000 USD",
    jobOutlook: "10% growth projected through 2032 (much faster than average)",
    medianSalary: "$81,350",
    growthRate: "10%",
    educationRequired: "Associate's or Bachelor's degree in Diagnostic Medical Sonography",
    studyResources: {
      questionBanks: { label: "Sonography Test Bank", link: "/allied-health/imaging/questions" },
      flashcards: { label: "Sonography Flashcards", link: "/allied-health/imaging/flashcards" },
      mockExams: { label: "Sonography Mock Exams", link: "/allied-health/imaging/practice-exam" },
      clinicalCases: { label: "Ultrasound Cases", link: "/allied-health/imaging/positioning" },
    },
    studyResourceCTAs: {
      questionBank: "/allied-health/imaging/questions",
      mockExams: "/allied-health/imaging/practice-exam",
      flashcards: "/allied-health/imaging/flashcards",
      clinicalCases: "/allied-health/imaging/positioning",
    },
    topicTemplates: [
      { slug: "abdominal-sonography-guide", title: "Abdominal Sonography: Organ Assessment Guide", targetKeyword: "abdominal sonography" },
      { slug: "obstetric-ultrasound-protocols", title: "Obstetric Ultrasound Protocols and Measurements", targetKeyword: "obstetric ultrasound" },
      { slug: "vascular-doppler-techniques", title: "Vascular Doppler Techniques and Interpretation", targetKeyword: "vascular Doppler techniques" },
      { slug: "ultrasound-physics-spi", title: "Ultrasound Physics for the SPI Exam", targetKeyword: "ultrasound physics SPI" },
      { slug: "musculoskeletal-sonography", title: "Musculoskeletal Sonography Fundamentals", targetKeyword: "musculoskeletal sonography" },
      { slug: "small-parts-thyroid-breast", title: "Small Parts Sonography: Thyroid and Breast", targetKeyword: "thyroid breast sonography" },
    ],
    seo: {
      title: "Sonography Practice Questions & ARDMS Exam Prep | NurseNest",
      description: "Pass the ARDMS RDMS and SPI exams with sonography practice questions covering abdominal, OB/GYN, vascular, and physics. Mock exams, flashcards, and case-based scenarios included.",
      keywords: "ARDMS exam prep, sonography practice questions, RDMS exam, SPI practice test, ultrasound certification, abdominal sonography quiz, OB ultrasound questions, vascular sonography practice",
    },
    relatedProfessions: ["cardiac-sonographer", "radiologic-technologist", "medical-laboratory-technologist"],
  },
  "cardiac-sonographer": {
    slug: "cardiac-sonographer",
    name: "Cardiac Sonographer",
    shortName: "Echo Tech",
    tagline: "Visualize the heart in motion with echocardiography expertise",
    description: "Cardiac sonographers (echocardiographers) use specialized ultrasound equipment to produce detailed images of the heart's structure and function to help diagnose cardiovascular conditions.",
    color: "#E91E63",
    colorAccent: "#FCE4EC",
    icon: "HeartPulse",
    overview: "Cardiac sonographers, also known as echocardiographers or echo techs, specialize in using ultrasound to image the heart and great vessels. They perform transthoracic echocardiograms (TTE), transesophageal echocardiograms (TEE), stress echocardiograms, and other cardiac imaging procedures. Their examinations evaluate heart valve function, chamber size, wall motion abnormalities, congenital heart defects, and hemodynamic parameters. Cardiac sonographers work closely with cardiologists and play a vital role in diagnosing conditions such as heart failure, valvular disease, cardiomyopathy, and pericardial effusion.",
    whereTheyWork: [
      "Hospital cardiology departments",
      "Cardiac catheterization labs",
      "Cardiology private practices",
      "Outpatient cardiac imaging centers",
      "Pediatric cardiology clinics",
      "Cardiac surgery operating rooms",
      "Mobile cardiac imaging services"
    ],
    responsibilities: [
      "Performing transthoracic echocardiograms (TTE)",
      "Assisting with transesophageal echocardiograms (TEE)",
      "Conducting stress echocardiography (exercise and pharmacological)",
      "Evaluating cardiac valves, chambers, and hemodynamic parameters",
      "Measuring ejection fraction and cardiac output",
      "Identifying wall motion abnormalities and structural defects",
      "Applying Doppler and color flow techniques to assess blood flow",
      "Performing contrast echocardiography",
      "Documenting measurements and preliminary findings",
      "Recognizing critical findings requiring immediate physician notification"
    ],
    patientPopulations: [
      "Heart failure patients requiring ejection fraction monitoring",
      "Patients with suspected valvular heart disease",
      "Congenital heart disease patients (pediatric and adult)",
      "Pre-surgical cardiac patients",
      "Patients with chest pain or dyspnea",
      "Stroke patients requiring cardiac source evaluation",
      "Patients with pericardial disease"
    ],
    educationPathways: [
      "Associate degree in Cardiac Sonography or Echocardiography (2 years)",
      "Bachelor's degree in Cardiovascular Technology (4 years)",
      "Certificate programs for sonographers adding cardiac specialization (12-18 months)",
      "Clinical rotations in echocardiography labs",
      "Continuing education for credential maintenance"
    ],
    certificationOverview: "The ARDMS offers the Registered Diagnostic Cardiac Sonographer (RDCS) credential for adult echocardiography (AE) and pediatric echocardiography (PE). Cardiovascular Credentialing International (CCI) offers the Registered Cardiac Sonographer (RCS) credential. In Canada, Sonography Canada (formerly CSDMS) offers the CSCT Cardiac Sonography credential. All require passing specialty exams and maintaining continuing education credits.",
    examNames: ["ARDMS RDCS", "CCI RCS", "ARDMS PE", "CSCT Cardiac Sonography"],
    salaryRange: "$60,000 – $95,000 USD",
    jobOutlook: "10% growth projected through 2032 (much faster than average)",
    medianSalary: "$77,740",
    growthRate: "10%",
    educationRequired: "Associate's or Bachelor's degree in Cardiovascular Technology",
    studyResources: {
      questionBanks: { label: "Cardiac Sonography Questions", link: "/allied-health/imaging/questions" },
      flashcards: { label: "Echo Flashcards", link: "/allied-health/imaging/flashcards" },
      mockExams: { label: "Echo Mock Exams", link: "/allied-health/imaging/practice-exam" },
      clinicalCases: { label: "Echo Case Studies", link: "/allied-health/imaging/positioning" },
    },
    studyResourceCTAs: {
      questionBank: "/allied-health/imaging/questions",
      mockExams: "/allied-health/imaging/practice-exam",
      flashcards: "/allied-health/imaging/flashcards",
      clinicalCases: "/allied-health/imaging/positioning",
    },
    topicTemplates: [
      { slug: "echocardiography-views-guide", title: "Standard Echocardiography Views and Windows", targetKeyword: "echocardiography views" },
      { slug: "cardiac-hemodynamics-doppler", title: "Cardiac Hemodynamics and Doppler Assessment", targetKeyword: "cardiac hemodynamics Doppler" },
      { slug: "valvular-heart-disease-echo", title: "Valvular Heart Disease on Echocardiography", targetKeyword: "valvular heart disease echo" },
      { slug: "ejection-fraction-calculation", title: "Ejection Fraction Calculation Methods", targetKeyword: "ejection fraction calculation" },
      { slug: "congenital-heart-defects-echo", title: "Congenital Heart Defects on Echocardiography", targetKeyword: "congenital heart defects echo" },
      { slug: "stress-echocardiography-protocols", title: "Stress Echocardiography Protocols", targetKeyword: "stress echocardiography" },
    ],
    seo: {
      title: "Cardiac Sonography Practice Questions & RDCS Exam Prep | NurseNest",
      description: "Prepare for the ARDMS RDCS or CCI RCS exam with echocardiography practice questions, hemodynamics drills, valve assessment scenarios, and timed mock exams. Build exam confidence.",
      keywords: "RDCS exam prep, cardiac sonography practice questions, echocardiography exam, CCI RCS certification, echo tech practice test, cardiac hemodynamics quiz, valve disease questions, stress echo prep",
    },
    relatedProfessions: ["diagnostic-sonography", "radiologic-technologist", "respiratory-therapy"],
  },
  "occupational-therapy-assistant": {
    slug: "occupational-therapy-assistant",
    name: "Occupational Therapy Assistant",
    shortName: "OTA",
    tagline: "Help patients regain independence in daily life activities",
    description: "Occupational therapy assistants work under the supervision of occupational therapists to help patients develop, recover, and improve the skills needed for daily living and working.",
    color: "#8BC34A",
    colorAccent: "#F1F8E9",
    icon: "Hand",
    overview: "Occupational Therapy Assistants (OTAs) are essential members of the rehabilitation team who help patients achieve functional independence in their daily activities. Working under the direction of a licensed Occupational Therapist (OT), OTAs implement treatment plans that address physical, cognitive, developmental, and psychosocial barriers to independence. They help patients relearn activities of daily living (ADLs) such as dressing, bathing, cooking, and working after injury, illness, or disability. OTAs use therapeutic activities, adaptive equipment, and environmental modifications to maximize each patient's ability to participate fully in life.",
    whereTheyWork: [
      "Hospitals and rehabilitation centers",
      "Skilled nursing facilities",
      "Home health agencies",
      "Outpatient rehabilitation clinics",
      "Schools and early intervention programs",
      "Mental health facilities",
      "Community-based programs"
    ],
    responsibilities: [
      "Implementing occupational therapy treatment plans",
      "Teaching patients activities of daily living (ADLs)",
      "Selecting and training patients on adaptive equipment",
      "Performing therapeutic activities and exercises",
      "Fabricating orthotic devices and splints",
      "Conducting cognitive rehabilitation activities",
      "Modifying home and work environments for accessibility",
      "Documenting patient progress and treatment sessions",
      "Educating patients and families on compensatory strategies",
      "Leading therapeutic group activities"
    ],
    patientPopulations: [
      "Stroke and neurological rehabilitation patients",
      "Orthopedic patients recovering from surgery or injury",
      "Pediatric patients with developmental delays",
      "Geriatric patients with functional decline",
      "Mental health patients requiring life skills training",
      "Hand and upper extremity injury patients",
      "Patients with cognitive impairments"
    ],
    educationPathways: [
      "Associate degree in Occupational Therapy Assistant (2 years)",
      "Accreditation by ACOTE (Accreditation Council for Occupational Therapy Education)",
      "Level II fieldwork (minimum 16 weeks clinical placement)",
      "Continuing competence requirements for license renewal",
      "Bridge programs to OTD (Occupational Therapy Doctorate) available"
    ],
    certificationOverview: "In the United States, OTAs must pass the National Board for Certification in Occupational Therapy (NBCOT) exam to earn the COTA (Certified Occupational Therapy Assistant) credential. Most states require licensure in addition to national certification. In Canada, provincial regulatory colleges oversee OTA practice with varying requirements.",
    examNames: ["NBCOT COTA", "State Licensure"],
    salaryRange: "$48,000 – $68,000 USD",
    jobOutlook: "25% growth projected through 2032 (much faster than average)",
    medianSalary: "$62,940",
    growthRate: "25%",
    educationRequired: "Associate's degree from ACOTE-accredited program",
    studyResources: {
      questionBanks: { label: "OTA Test Bank", link: "/allied-health/occupational-therapy/questions" },
      flashcards: { label: "OTA Flashcards", link: "/allied-health/occupational-therapy/flashcards" },
      mockExams: { label: "OTA Mock Exams", link: "/allied-health/occupational-therapy/mock-exams" },
      clinicalCases: { label: "OT Case Studies", link: "/allied-health/occupational-therapy/study-guide" },
    },
    studyResourceCTAs: {
      questionBank: "/allied-health/occupational-therapy/questions",
      mockExams: "/allied-health/occupational-therapy/mock-exams",
      flashcards: "/allied-health/occupational-therapy/flashcards",
      clinicalCases: "/allied-health/occupational-therapy/study-guide",
    },
    topicTemplates: [
      { slug: "activities-daily-living-adl", title: "Activities of Daily Living (ADL) Assessment Guide", targetKeyword: "activities of daily living ADL" },
      { slug: "cognitive-rehabilitation-techniques", title: "Cognitive Rehabilitation Techniques in OT", targetKeyword: "cognitive rehabilitation OT" },
      { slug: "pediatric-developmental-milestones", title: "Pediatric Developmental Milestones for OTAs", targetKeyword: "developmental milestones OT" },
      { slug: "adaptive-equipment-selection", title: "Adaptive Equipment Selection and Training", targetKeyword: "adaptive equipment OT" },
      { slug: "splinting-orthotic-fabrication", title: "Splinting and Orthotic Fabrication Guide", targetKeyword: "splinting orthotic fabrication" },
      { slug: "sensory-processing-interventions", title: "Sensory Processing Interventions in OT", targetKeyword: "sensory processing interventions" },
    ],
    seo: {
      title: "OTA Practice Questions & NBCOT COTA Exam Prep | NurseNest",
      description: "Pass the NBCOT COTA exam with OTA practice questions covering ADLs, cognitive rehabilitation, pediatric milestones, and adaptive equipment. Mock exams and detailed rationales included.",
      keywords: "NBCOT COTA exam prep, OTA practice questions, occupational therapy assistant certification, ADL assessment quiz, pediatric OT exam, cognitive rehabilitation questions, COTA mock exam",
    },
    relatedProfessions: ["physiotherapy-assistant", "diagnostic-sonography", "pharmacy-technician"],
  },
  "physiotherapy-assistant": {
    slug: "physiotherapy-assistant",
    name: "Physiotherapy Assistant",
    shortName: "PTA",
    tagline: "Restore movement and function through evidence-based rehabilitation",
    description: "Physiotherapy assistants work under the supervision of physical therapists to help patients improve movement, reduce pain, and restore physical function following injury, surgery, or illness.",
    color: "#009688",
    colorAccent: "#E0F2F1",
    icon: "Activity",
    overview: "Physical Therapy Assistants (PTAs), also called Physiotherapy Assistants in Canada, are licensed healthcare professionals who provide physical therapy treatments under the direction and supervision of physical therapists. PTAs help patients of all ages who have conditions that limit their ability to move and perform daily activities. They implement treatment plans that include therapeutic exercises, manual therapy techniques, functional training, modalities (heat, cold, electrical stimulation, ultrasound), gait training, and patient education. PTAs play a vital role in helping patients recover from orthopedic surgery, sports injuries, neurological conditions, and cardiopulmonary disorders.",
    whereTheyWork: [
      "Hospital rehabilitation departments",
      "Outpatient physical therapy clinics",
      "Skilled nursing and long-term care facilities",
      "Home health agencies",
      "Sports medicine clinics",
      "Pediatric therapy centers",
      "Industrial and occupational health programs"
    ],
    responsibilities: [
      "Implementing physical therapy treatment plans",
      "Instructing patients in therapeutic exercises and activities",
      "Performing manual therapy techniques (soft tissue mobilization)",
      "Applying physical therapy modalities (ultrasound, electrical stimulation, hot/cold packs)",
      "Assisting with gait training and balance exercises",
      "Teaching patients proper use of assistive devices (crutches, walkers, wheelchairs)",
      "Performing wound care and dressing changes",
      "Documenting patient progress and treatment notes",
      "Educating patients and families on home exercise programs",
      "Collecting objective data (ROM, strength measurements, functional assessments)"
    ],
    patientPopulations: [
      "Post-surgical orthopedic patients (joint replacements, rotator cuff, ACL)",
      "Sports injury rehabilitation patients",
      "Stroke and neurological rehabilitation patients",
      "Geriatric patients with fall risk and deconditioning",
      "Pediatric patients with developmental motor delays",
      "Cardiac and pulmonary rehabilitation patients",
      "Workers' compensation and industrial injury patients"
    ],
    educationPathways: [
      "Associate degree in Physical Therapy Assisting (2 years) — CAPTE accredited",
      "Clinical education experiences in multiple settings",
      "Continuing education for license renewal",
      "Bridge programs to DPT (Doctor of Physical Therapy) available",
      "Specialty certifications in areas like geriatrics or orthopedics"
    ],
    certificationOverview: "In the United States, PTAs must pass the National Physical Therapy Exam for PTAs (NPTE-PTA) administered by the Federation of State Boards of Physical Therapy (FSBPT). All states require licensure or certification. In Canada, PTA education and regulation varies by province, with most requiring graduation from an accredited program.",
    examNames: ["NPTE-PTA", "FSBPT", "Provincial Certification"],
    salaryRange: "$48,000 – $65,000 USD",
    jobOutlook: "26% growth projected through 2032 (much faster than average)",
    medianSalary: "$61,180",
    growthRate: "26%",
    educationRequired: "Associate's degree from CAPTE-accredited program",
    studyResources: {
      questionBanks: { label: "PTA Test Bank", link: "/allied-health/physical-therapy/questions" },
      flashcards: { label: "PTA Flashcards", link: "/allied-health/physical-therapy/flashcards" },
      mockExams: { label: "PTA Mock Exams", link: "/allied-health/physical-therapy/mock-exams" },
      clinicalCases: { label: "PT Case Studies", link: "/allied-health/physical-therapy/study-guide" },
    },
    studyResourceCTAs: {
      questionBank: "/allied-health/physical-therapy/questions",
      mockExams: "/allied-health/physical-therapy/mock-exams",
      flashcards: "/allied-health/physical-therapy/flashcards",
      clinicalCases: "/allied-health/physical-therapy/study-guide",
    },
    topicTemplates: [
      { slug: "therapeutic-exercise-modalities", title: "Therapeutic Exercise and Modalities Guide", targetKeyword: "therapeutic exercise modalities PT" },
      { slug: "gait-training-assistive-devices", title: "Gait Training and Assistive Device Selection", targetKeyword: "gait training assistive devices" },
      { slug: "musculoskeletal-special-tests", title: "Musculoskeletal Special Tests for PTAs", targetKeyword: "musculoskeletal special tests" },
      { slug: "neurological-rehabilitation-pt", title: "Neurological Rehabilitation in Physical Therapy", targetKeyword: "neurological rehabilitation PT" },
      { slug: "range-of-motion-measurement", title: "Range of Motion Measurement and Documentation", targetKeyword: "range of motion measurement" },
      { slug: "wound-care-physical-therapy", title: "Wound Care Principles for Physical Therapy", targetKeyword: "wound care physical therapy" },
    ],
    seo: {
      title: "PTA Practice Questions & NPTE-PTA Exam Prep | NurseNest",
      description: "Ace the NPTE-PTA exam with physical therapy assistant practice questions, therapeutic exercise scenarios, gait training drills, and timed mock exams. Exam-aligned content with rationales.",
      keywords: "NPTE-PTA exam prep, PTA practice questions, physical therapy assistant certification, FSBPT exam, therapeutic exercise quiz, gait training questions, musculoskeletal PT exam, rehabilitation practice",
    },
    relatedProfessions: ["occupational-therapy-assistant", "paramedic", "respiratory-therapy"],
  },
  "pharmacy-technician": {
    slug: "pharmacy-technician",
    name: "Pharmacy Technician",
    shortName: "Pharm Tech",
    tagline: "Ensure safe and accurate medication dispensing for every patient",
    description: "Pharmacy technicians assist pharmacists in preparing and dispensing medications, managing inventory, and ensuring patient safety in various pharmacy settings.",
    color: "#4CAF50",
    colorAccent: "#E8F5E9",
    icon: "Pill",
    overview: "Pharmacy Technicians are essential members of the pharmacy team who assist licensed pharmacists in preparing, dispensing, and distributing medications to patients. They work in community pharmacies, hospital pharmacies, and specialized compounding facilities. Pharmacy techs handle prescription processing, medication preparation, inventory management, insurance billing, and patient interactions. They must have strong attention to detail, knowledge of drug names and classifications, mathematical skills for dosage calculations, and understanding of pharmacy law and regulations. As pharmacy practice evolves, technicians are taking on expanded roles including medication therapy management support, immunization administration, and medication reconciliation.",
    whereTheyWork: [
      "Community and retail pharmacies",
      "Hospital inpatient pharmacies",
      "Mail-order and specialty pharmacies",
      "Long-term care pharmacy services",
      "Compounding pharmacies",
      "Nuclear pharmacy",
      "Pharmaceutical wholesalers and distributors",
      "Insurance and PBM companies"
    ],
    responsibilities: [
      "Receiving and processing prescription orders",
      "Preparing and packaging medications",
      "Performing sterile and non-sterile compounding",
      "Maintaining medication inventory and reordering supplies",
      "Processing insurance claims and prior authorizations",
      "Operating automated dispensing systems",
      "Performing dosage calculations",
      "Managing controlled substance records and documentation",
      "Assisting with medication therapy management",
      "Ensuring compliance with pharmacy laws and regulations"
    ],
    patientPopulations: [
      "Chronic disease patients on multiple medications",
      "Hospitalized patients requiring IV medications",
      "Oncology patients needing chemotherapy preparation",
      "Pediatric patients requiring liquid formulations",
      "Geriatric patients in long-term care facilities",
      "Patients requiring compounded medications",
      "Patients needing immunizations and vaccinations"
    ],
    educationPathways: [
      "Pharmacy Technician certificate program (6-12 months)",
      "Associate degree in Pharmacy Technology (2 years)",
      "On-the-job training programs (varies by state/province)",
      "ASHP-accredited technician training programs",
      "Advanced certifications (CPhT-Adv, sterile compounding, etc.)"
    ],
    certificationOverview: "In the United States, the Pharmacy Technician Certification Board (PTCB) offers the CPhT credential, which requires passing the Pharmacy Technician Certification Exam (PTCE). The National Healthcareer Association (NHA) offers the ExCPT as an alternative. In Canada, the Pharmacy Examining Board of Canada (PEBC) administers the Pharmacy Technician Qualifying Examination for national certification.",
    examNames: ["PTCB (PTCE)", "ExCPT", "PEBC Qualifying"],
    salaryRange: "$35,000 – $52,000 USD",
    jobOutlook: "6% growth projected through 2032 (faster than average)",
    medianSalary: "$38,350",
    growthRate: "6%",
    educationRequired: "Certificate or Associate's degree; ASHP-accredited preferred",
    studyResources: {
      questionBanks: { label: "Pharm Tech Test Bank", link: "/allied-health/pharmacy-technician/practice-questions" },
      flashcards: { label: "Pharm Tech Flashcards", link: "/allied-health/pharmacy-technician/flashcards" },
      mockExams: { label: "Pharm Tech Mock Exams", link: "/allied-health/pharmacy-technician/exams" },
      clinicalCases: { label: "Pharmacy Cases", link: "/allied-health/pharmacy-technician/study-guide" },
    },
    studyResourceCTAs: {
      questionBank: "/allied-health/pharmacy-technician/practice-questions",
      mockExams: "/allied-health/pharmacy-technician/exams",
      flashcards: "/allied-health/pharmacy-technician/flashcards",
      clinicalCases: "/allied-health/pharmacy-technician/study-guide",
    },
    topicTemplates: [
      { slug: "dosage-calculations-guide", title: "Pharmacy Dosage Calculations Guide", targetKeyword: "pharmacy dosage calculations" },
      { slug: "drug-classifications-top-200", title: "Top 200 Drug Classifications for Pharm Techs", targetKeyword: "top 200 drug classifications" },
      { slug: "sterile-compounding-usp-797", title: "Sterile Compounding and USP 797 Standards", targetKeyword: "sterile compounding USP 797" },
      { slug: "pharmacy-law-regulations", title: "Pharmacy Law and Regulations Overview", targetKeyword: "pharmacy law regulations" },
      { slug: "controlled-substances-scheduling", title: "Controlled Substances and DEA Scheduling", targetKeyword: "controlled substances DEA scheduling" },
      { slug: "insurance-billing-prescription", title: "Insurance Billing and Prescription Processing", targetKeyword: "pharmacy insurance billing" },
    ],
    seo: {
      title: "Pharmacy Tech Practice Questions & PTCB/PEBC Exam Prep | NurseNest",
      description: "Pass the PTCB PTCE or PEBC exam with pharmacy technician practice questions covering dosage calculations, drug classifications, sterile compounding, and pharmacy law. Mock exams included.",
      keywords: "PTCB exam prep, pharmacy technician practice questions, PTCE study guide, PEBC pharmacy exam, dosage calculation quiz, drug classification practice, sterile compounding questions, ExCPT prep",
    },
    relatedProfessions: ["medical-laboratory-technologist", "respiratory-therapy", "surgical-technologist"],
  },
  "surgical-technologist": {
    slug: "surgical-technologist",
    name: "Surgical Technologist",
    shortName: "Surg Tech",
    tagline: "Be the essential team member in every operating room",
    description: "Surgical technologists assist in surgical operations by preparing operating rooms, arranging equipment, and helping surgeons during procedures.",
    color: "#607D8B",
    colorAccent: "#ECEFF1",
    icon: "Scissors",
    overview: "Surgical Technologists, also known as scrub techs or operating room technicians, are integral members of the surgical team. They work alongside surgeons, anesthesiologists, and perioperative nurses to ensure surgical procedures run safely and efficiently. Surgical techs are responsible for preparing the operating room, arranging instruments and supplies on the sterile field, anticipating the surgeon's needs, and maintaining strict sterile technique throughout the procedure. They must have thorough knowledge of surgical instruments, anatomy, surgical procedures, and infection control principles. The role requires excellent manual dexterity, attention to detail, and the ability to remain calm under pressure.",
    whereTheyWork: [
      "Hospital operating rooms",
      "Ambulatory surgery centers",
      "Labor and delivery units",
      "Cardiac surgery suites",
      "Orthopedic surgery centers",
      "Ophthalmology surgery centers",
      "Dental surgery offices",
      "Organ procurement organizations"
    ],
    responsibilities: [
      "Preparing operating rooms for surgical procedures",
      "Sterilizing instruments and setting up the sterile field",
      "Passing instruments and supplies to the surgeon during procedures",
      "Maintaining sterile technique and monitoring for breaks in sterility",
      "Performing surgical counts (instruments, sponges, sharps, needles)",
      "Preparing and handling surgical specimens",
      "Operating sterilization equipment (autoclaves)",
      "Assisting with wound closure and dressing application",
      "Anticipating the needs of the surgical team",
      "Managing surgical supplies and instrument sets"
    ],
    patientPopulations: [
      "Elective surgery patients (orthopedic, general, plastic)",
      "Emergency surgery patients (trauma, appendectomy, C-section)",
      "Cardiac surgery patients",
      "Neurosurgery patients",
      "Pediatric surgery patients",
      "Ophthalmic surgery patients",
      "Transplant surgery patients"
    ],
    educationPathways: [
      "Associate degree in Surgical Technology (2 years) — most common",
      "Certificate programs in Surgical Technology (12-15 months)",
      "CAAHEP-accredited programs required for certification eligibility",
      "Clinical rotations in operating rooms (multiple surgical specialties)",
      "Continuing education for credential maintenance"
    ],
    certificationOverview: "The National Board of Surgical Technology and Surgical Assisting (NBSTSA) offers the Certified Surgical Technologist (CST) credential, which requires passing a national certification exam. The National Center for Competency Testing (NCCT) offers the Tech in Surgery (TS-C) as an alternative credential. Many employers and states require or strongly prefer national certification.",
    examNames: ["NBSTSA CST", "NCCT TS-C"],
    salaryRange: "$45,000 – $65,000 USD",
    jobOutlook: "5% growth projected through 2032 (average)",
    medianSalary: "$56,350",
    growthRate: "5%",
    educationRequired: "Associate's degree or Certificate from CAAHEP-accredited program",
    studyResources: {
      questionBanks: { label: "Surg Tech Test Bank", link: "/allied-health/surgical-technologist/exams" },
      flashcards: { label: "Surg Tech Flashcards", link: "/allied-health/surgical-technologist/flashcards" },
      mockExams: { label: "Surg Tech Mock Exams", link: "/allied-health/surgical-technologist/exams" },
      clinicalCases: { label: "Surgical Cases", link: "/allied-health/surgical-technologist/study" },
    },
    studyResourceCTAs: {
      questionBank: "/allied-health/surgical-technologist/exams",
      mockExams: "/allied-health/surgical-technologist/exams",
      flashcards: "/allied-health/surgical-technologist/flashcards",
      clinicalCases: "/allied-health/surgical-technologist/study",
    },
    topicTemplates: [
      { slug: "sterile-technique-principles", title: "Sterile Technique Principles for the OR", targetKeyword: "sterile technique operating room" },
      { slug: "surgical-instruments-identification", title: "Surgical Instruments Identification Guide", targetKeyword: "surgical instruments identification" },
      { slug: "surgical-counts-procedures", title: "Surgical Counts: Instruments, Sponges, and Sharps", targetKeyword: "surgical counts procedures" },
      { slug: "surgical-positioning-guide", title: "Surgical Patient Positioning Guide", targetKeyword: "surgical positioning" },
      { slug: "wound-closure-suturing", title: "Wound Closure and Suturing Techniques", targetKeyword: "wound closure suturing" },
      { slug: "operating-room-safety", title: "Operating Room Safety and Fire Prevention", targetKeyword: "operating room safety" },
    ],
    seo: {
      title: "Surgical Tech Practice Questions & CST Exam Prep | NurseNest",
      description: "Prepare for the NBSTSA CST exam with 1,500+ surgical technologist practice questions on sterile technique, instrument identification, surgical counts, and OR safety.",
      keywords: "CST exam prep, surgical technologist practice questions, NBSTSA certification, sterile technique quiz, surgical instruments identification, scrub tech exam, operating room safety practice",
    },
    relatedProfessions: ["paramedic", "radiologic-technologist", "respiratory-therapy"],
    hasStudyContent: true,
  },
  "health-information-management": {
    slug: "health-information-management",
    name: "Health Information Management",
    shortName: "HIM",
    tagline: "Manage the data that drives healthcare decisions and patient outcomes",
    description: "Health information management professionals oversee the acquisition, analysis, and protection of health data — ensuring accuracy, accessibility, and security across healthcare organizations.",
    color: "#3F51B5",
    colorAccent: "#E8EAF6",
    icon: "Database",
    overview: "Health Information Management (HIM) professionals are the stewards of healthcare data. They manage the systems and processes that capture, maintain, analyze, and protect the clinical and administrative information essential to delivering quality healthcare. HIM professionals work at the intersection of healthcare, technology, and business — ensuring that health records are complete, accurate, coded correctly, and compliant with federal and state regulations (HIPAA, HITECH). They play a critical role in revenue cycle management through medical coding (ICD-10-CM/PCS, CPT, HCPCS), clinical documentation improvement (CDI), data analytics, EHR implementation, and health information exchange (HIE). As healthcare continues to digitize, HIM professionals are increasingly vital in areas like data governance, cybersecurity, telehealth compliance, and population health management.",
    whereTheyWork: [
      "Hospitals and health systems (HIM departments)",
      "Physician practices and ambulatory care centers",
      "Insurance companies and managed care organizations",
      "Government agencies (CMS, CDC, state health departments)",
      "Health information technology vendors",
      "Consulting firms and revenue cycle companies",
      "Long-term care and rehabilitation facilities",
      "Remote coding and auditing companies"
    ],
    responsibilities: [
      "Assigning ICD-10-CM, ICD-10-PCS, CPT, and HCPCS codes to diagnoses and procedures",
      "Managing electronic health record (EHR) systems and data integrity",
      "Ensuring HIPAA compliance and health information privacy/security",
      "Performing clinical documentation improvement (CDI) reviews",
      "Conducting coding audits and quality assurance reviews",
      "Managing release of information (ROI) requests",
      "Analyzing health data for quality reporting and decision support",
      "Overseeing revenue cycle management and reimbursement optimization",
      "Leading EHR implementation and optimization projects",
      "Managing cancer registry and trauma registry data"
    ],
    patientPopulations: [
      "All patients across the healthcare continuum (inpatient, outpatient, ambulatory)",
      "Medicare and Medicaid beneficiaries requiring compliant coding",
      "Oncology patients requiring cancer registry abstraction",
      "Surgical patients requiring procedural coding (ICD-10-PCS)",
      "Emergency department patients with complex documentation",
      "Behavioral health patients with specialized coding requirements",
      "Patients involved in legal proceedings requiring record disclosure"
    ],
    educationPathways: [
      "Associate's degree in Health Information Technology (RHIT pathway, 2 years)",
      "Bachelor's degree in Health Information Management (RHIA pathway, 4 years)",
      "Master's degree in Health Informatics or HIM (leadership roles)",
      "CAHIIM-accredited program required for AHIMA credentials",
      "Coding certificate programs (CCS, CPC) for coding specialization",
      "Continuing education for credential maintenance (CEs every 2 years)"
    ],
    certificationOverview: "The American Health Information Management Association (AHIMA) offers the primary HIM credentials: RHIT (Registered Health Information Technician) for associate-level professionals and RHIA (Registered Health Information Administrator) for bachelor-level professionals. AHIMA also offers specialty credentials including CCS (Certified Coding Specialist) and CDIP (Certified Documentation Improvement Practitioner). The AAPC offers the CPC (Certified Professional Coder) as an alternative coding credential. All credentials require passing national exams and maintaining continuing education.",
    examNames: ["AHIMA RHIT", "AHIMA RHIA", "AHIMA CCS", "AAPC CPC"],
    salaryRange: "$45,000 – $85,000 USD / $48,000 – $82,000 CAD",
    jobOutlook: "17% growth projected through 2032 (much faster than average)",
    medianSalary: "$62,990",
    growthRate: "17%",
    educationRequired: "Associate's degree (RHIT); Bachelor's degree (RHIA)",
    studyResources: {
      questionBanks: { label: "HIM Question Bank", link: "/allied-health/health-info-mgmt/practice-questions" },
      flashcards: { label: "HIM Flashcards", link: "/allied-health/health-info-mgmt/flashcards" },
      mockExams: { label: "HIM Mock Exams", link: "/allied-health/health-info-mgmt/mock-exams" },
      clinicalCases: { label: "Coding Case Studies", link: "/allied-health/health-info-mgmt/study-guide" },
    },
    studyResourceCTAs: {
      questionBank: "/allied-health/health-info-mgmt/practice-questions",
      mockExams: "/allied-health/health-info-mgmt/mock-exams",
      flashcards: "/allied-health/health-info-mgmt/flashcards",
      clinicalCases: "/allied-health/health-info-mgmt/study-guide",
    },
    topicTemplates: [
      { slug: "icd-10-cm-coding-guidelines", title: "ICD-10-CM Coding Guidelines: Complete Overview", targetKeyword: "ICD-10-CM coding guidelines" },
      { slug: "cpt-coding-evaluation-management", title: "CPT Coding: Evaluation and Management (E/M) Guide", targetKeyword: "CPT E/M coding" },
      { slug: "hipaa-privacy-security-rules", title: "HIPAA Privacy and Security Rules for HIM", targetKeyword: "HIPAA privacy security rules" },
      { slug: "clinical-documentation-improvement", title: "Clinical Documentation Improvement (CDI) Strategies", targetKeyword: "clinical documentation improvement" },
      { slug: "revenue-cycle-management-guide", title: "Revenue Cycle Management in Healthcare", targetKeyword: "revenue cycle management healthcare" },
      { slug: "ehr-implementation-optimization", title: "EHR Implementation and Optimization Guide", targetKeyword: "EHR implementation optimization" },
    ],
    seo: {
      title: "HIM Practice Questions & RHIT/RHIA Exam Prep | NurseNest",
      description: "Pass the AHIMA RHIT, RHIA, or CCS exam with health information management practice questions covering ICD-10 coding, HIPAA compliance, CDI, and revenue cycle management. Mock exams included.",
      keywords: "RHIT exam prep, RHIA practice questions, AHIMA certification, CCS exam prep, ICD-10 coding quiz, HIPAA compliance questions, health information management practice, medical coding exam",
    },
    relatedProfessions: ["medical-laboratory-technologist", "pharmacy-technician", "respiratory-therapy"],
  },
};

export const ALLIED_HEALTH_PROFESSION_SLUGS = Object.keys(ALLIED_HEALTH_PROFESSIONS);

export function getAlliedHealthProfession(slug: string): AlliedHealthProfession | undefined {
  return ALLIED_HEALTH_PROFESSIONS[slug];
}
