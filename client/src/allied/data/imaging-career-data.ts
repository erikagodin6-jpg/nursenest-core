export interface StudyTopicCard {
  slug: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  topicCount?: number;
}

export interface FlashcardDeck {
  slug: string;
  title: string;
  cardCount: number;
  description: string;
  topicFocus: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface ExamEntry {
  slug: string;
  title: string;
  description: string;
  questionCount: number;
  timeLimit: string;
  type: "diagnostic" | "topic-quiz" | "practice-set";
}

export interface CareerGuideData {
  educationPath: { step: string; description: string; duration: string }[];
  certificationOptions: { name: string; organization: string; description: string }[];
  workSettings: { setting: string; description: string }[];
  skillsNeeded: string[];
  examPrepRoadmap: { phase: string; weeks: string; focus: string }[];
}

export interface ImagingCareerSubPageData {
  slug: string;
  name: string;
  shortName: string;
  color: string;
  colorAccent: string;
  studyTopics: StudyTopicCard[];
  flashcardDecks: FlashcardDeck[];
  examEntries: ExamEntry[];
  careerGuide: CareerGuideData;
  studyTips: string[];
  featuredTopics: string[];
  mostTestedConcepts: string[];
}

export const IMAGING_CAREER_DATA: Record<string, ImagingCareerSubPageData> = {
  "radiologic-technologist": {
    slug: "radiologic-technologist",
    name: "Radiologic Technologist",
    shortName: "Rad Tech",
    color: "#FF9800",
    colorAccent: "#FFF3E0",
    studyTopics: [
      { slug: "radiographic-positioning", title: "Radiographic Positioning", description: "Master patient positioning for upper extremity, lower extremity, spine, chest, and abdomen projections with central ray angles and anatomy landmarks.", difficulty: "Intermediate", estimatedTime: "4-6 hours", topicCount: 24 },
      { slug: "radiation-protection-safety", title: "Radiation Protection & Safety", description: "ALARA principles, shielding techniques, dose limits, radiation monitoring, and regulatory compliance for patient and operator safety.", difficulty: "Beginner", estimatedTime: "3-4 hours", topicCount: 18 },
      { slug: "image-production-evaluation", title: "Image Production & Evaluation", description: "Technical factors (kVp, mAs), image quality criteria, exposure indicators, digital imaging artifacts, and repeat analysis.", difficulty: "Intermediate", estimatedTime: "4-5 hours", topicCount: 20 },
      { slug: "radiographic-anatomy", title: "Radiographic Anatomy & Physiology", description: "Cross-sectional anatomy, skeletal system, organ systems, and anatomical landmarks essential for accurate radiographic interpretation.", difficulty: "Beginner", estimatedTime: "5-7 hours", topicCount: 22 },
      { slug: "equipment-operation-qc", title: "Equipment Operation & Quality Control", description: "X-ray tube components, generator types, automatic exposure control, digital detector systems, and QC testing protocols.", difficulty: "Advanced", estimatedTime: "3-5 hours", topicCount: 16 },
      { slug: "patient-care-management", title: "Patient Care & Management", description: "Vital signs, patient assessment, contrast media reactions, infection control, transfer techniques, and emergency procedures.", difficulty: "Beginner", estimatedTime: "2-3 hours", topicCount: 14 },
      { slug: "ct-imaging-fundamentals", title: "CT Imaging Fundamentals", description: "CT acquisition parameters, slice thickness, windowing, reconstruction algorithms, and cross-sectional anatomy for the ARRT exam.", difficulty: "Advanced", estimatedTime: "3-4 hours", topicCount: 15 },
      { slug: "contrast-media-pharmacology", title: "Contrast Media & Pharmacology", description: "Iodinated and barium contrast agents, administration routes, adverse reactions, contraindications, and emergency response protocols.", difficulty: "Intermediate", estimatedTime: "2-3 hours", topicCount: 12 },
      { slug: "digital-imaging-pacs", title: "Digital Imaging & PACS", description: "Computed radiography, digital radiography, DICOM standards, PACS workflows, image processing, and digital artifact recognition.", difficulty: "Intermediate", estimatedTime: "3-4 hours", topicCount: 14 },
      { slug: "pediatric-geriatric-imaging", title: "Pediatric & Geriatric Imaging", description: "Age-appropriate techniques, immobilization methods, dose reduction strategies, and special considerations for pediatric and elderly patients.", difficulty: "Intermediate", estimatedTime: "2-3 hours", topicCount: 10 },
    ],
    flashcardDecks: [
      { slug: "positioning-landmarks", title: "Positioning Landmarks & CR Angles", cardCount: 120, description: "Central ray angles, SID, patient positioning, and anatomy demonstrated for every standard radiographic projection.", topicFocus: "Radiographic Positioning", difficulty: "Intermediate" },
      { slug: "radiation-safety-standards", title: "Radiation Safety & Dose Limits", cardCount: 80, description: "NCRP dose limits, ALARA principles, shielding materials, half-value layers, and radiation monitoring concepts.", topicFocus: "Radiation Protection", difficulty: "Beginner" },
      { slug: "exposure-factors", title: "Exposure Factors & Image Quality", cardCount: 95, description: "kVp/mAs relationships, exposure indicators, image density, contrast, and technical factor adjustments.", topicFocus: "Image Production", difficulty: "Intermediate" },
      { slug: "skeletal-anatomy", title: "Skeletal Anatomy & Landmarks", cardCount: 110, description: "Bone names, anatomical landmarks, joint classifications, and skeletal variations for radiographic positioning.", topicFocus: "Anatomy", difficulty: "Beginner" },
      { slug: "equipment-components", title: "X-ray Equipment Components", cardCount: 65, description: "X-ray tube construction, generator types, AEC chambers, grid ratios, and digital detector specifications.", topicFocus: "Equipment", difficulty: "Advanced" },
      { slug: "contrast-reactions", title: "Contrast Media & Reactions", cardCount: 50, description: "Contrast agent types, osmolality, adverse reaction classifications, treatment protocols, and contraindications.", topicFocus: "Pharmacology", difficulty: "Intermediate" },
      { slug: "ct-basics", title: "CT Imaging Essentials", cardCount: 70, description: "CT acquisition parameters, Hounsfield units, windowing, reconstruction kernels, and cross-sectional anatomy identification.", topicFocus: "CT Imaging", difficulty: "Advanced" },
    ],
    examEntries: [
      { slug: "diagnostic-assessment", title: "Rad Tech Diagnostic Assessment", description: "25-question assessment covering all ARRT domains to identify your strengths and weak areas before focused study.", questionCount: 25, timeLimit: "30 min", type: "diagnostic" },
      { slug: "positioning-quiz", title: "Positioning & Procedures Quiz", description: "Focused quiz on radiographic positioning, central ray angles, anatomy demonstrated, and positioning criteria.", questionCount: 30, timeLimit: "35 min", type: "topic-quiz" },
      { slug: "radiation-safety-quiz", title: "Radiation Protection Quiz", description: "Test your knowledge of ALARA, dose limits, shielding, and radiation monitoring for patient and operator safety.", questionCount: 25, timeLimit: "25 min", type: "topic-quiz" },
      { slug: "full-practice-exam", title: "Full-Length ARRT Practice Exam", description: "200-question blueprint-weighted practice exam simulating real ARRT Radiography certification conditions.", questionCount: 200, timeLimit: "3.5 hours", type: "practice-set" },
    ],
    careerGuide: {
      educationPath: [
        { step: "Complete prerequisite courses", description: "Anatomy & physiology, physics, algebra, and general biology at community college or university.", duration: "1-2 semesters" },
        { step: "Enroll in JRCERT-accredited radiography program", description: "Associate or bachelor's degree program in radiologic technology with didactic coursework and clinical rotations.", duration: "2-4 years" },
        { step: "Complete clinical rotations", description: "Hands-on training in hospital radiology departments performing supervised imaging examinations.", duration: "Included in program" },
        { step: "Pass the ARRT Radiography exam", description: "National certification exam covering radiation protection, equipment, image production, procedures, and patient care.", duration: "Exam day" },
        { step: "Obtain state licensure", description: "Apply for state radiologic technology license (requirements vary by state).", duration: "2-8 weeks" },
        { step: "Pursue advanced certifications (optional)", description: "Specialty certifications in CT, MRI, mammography, or interventional radiography through ARRT.", duration: "6-12 months each" },
      ],
      certificationOptions: [
        { name: "ARRT Radiography (R)", organization: "American Registry of Radiologic Technologists", description: "Primary certification for general radiographic imaging in the United States." },
        { name: "ARRT CT (CT)", organization: "American Registry of Radiologic Technologists", description: "Advanced certification for computed tomography." },
        { name: "CAMRT Certification", organization: "Canadian Association of Medical Radiation Technologists", description: "National certification for radiologic technologists in Canada." },
      ],
      workSettings: [
        { setting: "Hospital Radiology Department", description: "Full-service imaging in emergency, inpatient, and outpatient settings with diverse case variety." },
        { setting: "Outpatient Imaging Center", description: "Scheduled diagnostic imaging with predictable workflow and regular hours." },
        { setting: "Urgent Care / Orthopedic Clinic", description: "Walk-in and scheduled extremity and spine imaging with focused case types." },
        { setting: "Mobile Imaging Services", description: "Portable X-ray services to nursing homes, home health, and remote facilities." },
        { setting: "Operating Room", description: "Intraoperative fluoroscopy and C-arm imaging during surgical procedures." },
      ],
      skillsNeeded: [
        "Radiographic positioning and patient assessment",
        "Radiation safety and ALARA application",
        "Technical factor selection (kVp, mAs, SID)",
        "Image quality evaluation and repeat analysis",
        "Patient communication and empathy",
        "Anatomy knowledge and cross-sectional understanding",
        "Critical thinking and problem-solving",
        "Equipment operation and troubleshooting",
        "Sterile technique and infection control",
        "Teamwork and collaboration with radiologists",
      ],
      examPrepRoadmap: [
        { phase: "Foundation Review", weeks: "Weeks 1-2", focus: "Review anatomy, positioning fundamentals, and radiation physics basics." },
        { phase: "Domain Deep Dives", weeks: "Weeks 3-5", focus: "Focus on weak areas identified in diagnostic assessment. Study positioning, image production, and radiation safety in depth." },
        { phase: "Practice & Application", weeks: "Weeks 6-7", focus: "Complete topic quizzes, flashcard drills, and positioning exercises. Apply knowledge to clinical scenarios." },
        { phase: "Mock Exams & Review", weeks: "Weeks 8-10", focus: "Take full-length practice exams, review incorrect answers, and refine weak areas before exam day." },
      ],
    },
    studyTips: [
      "Start with a diagnostic assessment to identify your weakest ARRT content areas",
      "Practice positioning on yourself or study partners to build muscle memory",
      "Create flashcards for central ray angles and positioning criteria for each projection",
      "Review anatomy atlases alongside positioning guides to understand what structures are demonstrated",
      "Use the mnemonic 'ALARA' daily — apply it to every clinical scenario question",
      "Take timed practice exams to build stamina for the 3.5-hour ARRT exam",
    ],
    featuredTopics: ["radiographic-positioning", "radiation-protection-safety", "image-production-evaluation"],
    mostTestedConcepts: ["Patient positioning criteria", "Technical factor selection", "Radiation dose limits", "Image quality evaluation", "Contrast media reactions"],
  },

  "diagnostic-sonography": {
    slug: "diagnostic-sonography",
    name: "Diagnostic Medical Sonographer",
    shortName: "Sonographer",
    color: "#00BCD4",
    colorAccent: "#E0F7FA",
    studyTopics: [
      { slug: "abdominal-sonography", title: "Abdominal Sonography", description: "Liver, gallbladder, pancreas, spleen, and kidney sonographic anatomy, pathology recognition, and scanning techniques.", difficulty: "Intermediate", estimatedTime: "5-7 hours", topicCount: 26 },
      { slug: "obstetric-sonography", title: "Obstetric Sonography", description: "Fetal anatomy surveys, biometric measurements, gestational age determination, placental evaluation, and high-risk pregnancy imaging.", difficulty: "Advanced", estimatedTime: "5-6 hours", topicCount: 22 },
      { slug: "vascular-sonography", title: "Vascular Sonography", description: "Carotid Doppler, venous insufficiency, arterial assessment, DVT evaluation, and hemodynamic calculations.", difficulty: "Advanced", estimatedTime: "4-5 hours", topicCount: 18 },
      { slug: "ultrasound-physics-spi", title: "Ultrasound Physics (SPI)", description: "Sound wave properties, transducer types, beam characteristics, Doppler principles, artifacts, and quality assurance.", difficulty: "Intermediate", estimatedTime: "6-8 hours", topicCount: 28 },
      { slug: "gynecologic-sonography", title: "Gynecologic Sonography", description: "Uterine anatomy, ovarian pathology, endometrial assessment, ectopic pregnancy, and pelvic mass evaluation.", difficulty: "Intermediate", estimatedTime: "3-4 hours", topicCount: 16 },
      { slug: "small-parts-sonography", title: "Small Parts Sonography", description: "Thyroid, breast, scrotum, and superficial structure imaging with pathology recognition and biopsy guidance.", difficulty: "Intermediate", estimatedTime: "3-4 hours", topicCount: 14 },
      { slug: "musculoskeletal-ultrasound", title: "Musculoskeletal Ultrasound", description: "Tendon, ligament, joint, and muscle evaluation techniques with dynamic scanning and pathology identification.", difficulty: "Advanced", estimatedTime: "3-4 hours", topicCount: 12 },
      { slug: "neonatal-neurosonography", title: "Neonatal Neurosonography", description: "Cranial ultrasound in premature infants, ventricular assessment, hemorrhage classification, and brain anatomy.", difficulty: "Advanced", estimatedTime: "2-3 hours", topicCount: 10 },
      { slug: "doppler-hemodynamics", title: "Doppler Principles & Hemodynamics", description: "Spectral Doppler, color flow, power Doppler, velocity calculations, resistive index, and hemodynamic assessment.", difficulty: "Intermediate", estimatedTime: "4-5 hours", topicCount: 16 },
    ],
    flashcardDecks: [
      { slug: "abdominal-pathology", title: "Abdominal Pathology Recognition", cardCount: 100, description: "Sonographic appearance of liver masses, gallstones, renal cysts, pancreatic pathology, and splenic abnormalities.", topicFocus: "Abdominal Sonography", difficulty: "Intermediate" },
      { slug: "ultrasound-physics", title: "Ultrasound Physics & Instrumentation", cardCount: 120, description: "Frequency, wavelength, attenuation, transducer types, Doppler equations, and imaging artifacts.", topicFocus: "SPI Exam", difficulty: "Intermediate" },
      { slug: "obstetric-measurements", title: "OB Measurements & Biometrics", cardCount: 85, description: "BPD, HC, AC, FL measurements, dating criteria, growth charts, amniotic fluid index, and biophysical profiles.", topicFocus: "Obstetric Sonography", difficulty: "Advanced" },
      { slug: "vascular-protocols", title: "Vascular Protocols & Criteria", cardCount: 75, description: "Carotid stenosis criteria, DVT compression technique, arterial waveform patterns, and velocity thresholds.", topicFocus: "Vascular Sonography", difficulty: "Advanced" },
      { slug: "sonographic-anatomy", title: "Sonographic Anatomy Atlas", cardCount: 95, description: "Normal sonographic appearance of organs, vessels, and structures with labeled image flashcards.", topicFocus: "Anatomy", difficulty: "Beginner" },
      { slug: "gyn-pathology", title: "Gynecologic Pathology", cardCount: 60, description: "Uterine fibroids, ovarian cysts, endometriosis, ectopic pregnancy, and pelvic mass sonographic patterns.", topicFocus: "Gynecologic Sonography", difficulty: "Intermediate" },
    ],
    examEntries: [
      { slug: "diagnostic-assessment", title: "Sonography Diagnostic Assessment", description: "25-question assessment covering ultrasound physics, abdominal, OB/GYN, and vascular domains to map your readiness.", questionCount: 25, timeLimit: "30 min", type: "diagnostic" },
      { slug: "spi-physics-quiz", title: "SPI Physics & Instrumentation Quiz", description: "Focused quiz on ultrasound physics, transducer technology, Doppler principles, and imaging artifacts.", questionCount: 30, timeLimit: "35 min", type: "topic-quiz" },
      { slug: "abdominal-quiz", title: "Abdominal Sonography Quiz", description: "Test your knowledge of abdominal organ anatomy, pathology, scanning techniques, and clinical correlations.", questionCount: 25, timeLimit: "25 min", type: "topic-quiz" },
      { slug: "full-practice-exam", title: "Full-Length ARDMS Practice Exam", description: "Complete practice exam covering SPI fundamentals and specialty content for RDMS certification preparation.", questionCount: 150, timeLimit: "3 hours", type: "practice-set" },
    ],
    careerGuide: {
      educationPath: [
        { step: "Complete prerequisite courses", description: "Anatomy & physiology, physics, medical terminology, and college-level math.", duration: "1-2 semesters" },
        { step: "Enroll in CAAHEP-accredited sonography program", description: "Associate or bachelor's degree in diagnostic medical sonography with clinical externships.", duration: "2-4 years" },
        { step: "Complete clinical externships", description: "Supervised scanning experience in hospital and outpatient ultrasound departments.", duration: "Included in program" },
        { step: "Pass ARDMS SPI exam", description: "Sonography Principles and Instrumentation exam — the prerequisite for all ARDMS specialty credentials.", duration: "Exam day" },
        { step: "Pass ARDMS specialty exam(s)", description: "Choose your specialty: Abdomen (AB), OB/GYN, Vascular Technology (VT), or multiple credentials.", duration: "Exam day" },
        { step: "Maintain credentials", description: "Complete 30 CME credits every 3 years to maintain ARDMS credentials.", duration: "Ongoing" },
      ],
      certificationOptions: [
        { name: "RDMS (Registered Diagnostic Medical Sonographer)", organization: "ARDMS", description: "Specialty credentials in Abdomen (AB), OB/GYN, Breast (BR), and Fetal Echocardiography (FE)." },
        { name: "RVT (Registered Vascular Technologist)", organization: "ARDMS", description: "Credential for vascular sonography including carotid, venous, and arterial studies." },
        { name: "Sonography Canada Certification", organization: "Sonography Canada", description: "National certification for diagnostic medical sonographers in Canada." },
      ],
      workSettings: [
        { setting: "Hospital Imaging Department", description: "Full-range sonographic examinations in emergency, inpatient, and outpatient settings." },
        { setting: "OB/GYN & Maternal-Fetal Medicine", description: "Obstetric and gynecologic ultrasound in physician offices and high-risk pregnancy centers." },
        { setting: "Vascular Lab", description: "Dedicated vascular imaging including carotid, venous, and arterial Doppler studies." },
        { setting: "Outpatient Imaging Center", description: "Scheduled diagnostic ultrasound with predictable workflow and patient variety." },
        { setting: "Mobile Ultrasound Services", description: "Portable ultrasound imaging at remote clinics, nursing homes, and rural facilities." },
      ],
      skillsNeeded: [
        "Sonographic anatomy and pathology recognition",
        "Transducer manipulation and scanning technique",
        "Doppler assessment and hemodynamic calculations",
        "Critical thinking and clinical correlation",
        "Hand-eye coordination and spatial awareness",
        "Patient communication and positioning",
        "Image optimization and artifact recognition",
        "Knowledge of ultrasound physics and instrumentation",
        "Professional reporting and documentation",
        "Time management and workflow efficiency",
      ],
      examPrepRoadmap: [
        { phase: "SPI Foundation", weeks: "Weeks 1-3", focus: "Master ultrasound physics, instrumentation, and artifacts — the foundation for all ARDMS specialty exams." },
        { phase: "Specialty Content", weeks: "Weeks 4-7", focus: "Deep dive into your chosen specialty (Abdomen, OB/GYN, or Vascular) with anatomy, pathology, and protocols." },
        { phase: "Pathology & Protocols", weeks: "Weeks 8-9", focus: "Review pathology recognition, scanning protocols, and clinical correlations through case-based practice." },
        { phase: "Mock Exams & Final Review", weeks: "Weeks 10-12", focus: "Take full-length practice exams, review weak areas, and refine timing for exam day." },
      ],
    },
    studyTips: [
      "Master ultrasound physics (SPI) first — it's the foundation for every specialty exam",
      "Practice identifying sonographic anatomy on real scan images, not just diagrams",
      "Create labeled image flashcards for common pathology appearances",
      "Study Doppler principles deeply — spectral analysis appears across all specialties",
      "Review measurement protocols and normal values for your specialty area",
      "Take practice exams under timed conditions to build exam-day stamina",
    ],
    featuredTopics: ["abdominal-sonography", "ultrasound-physics-spi", "obstetric-sonography"],
    mostTestedConcepts: ["Ultrasound physics & artifacts", "Abdominal organ pathology", "Doppler principles", "OB measurements", "Vascular criteria"],
  },

  "cardiac-sonographer": {
    slug: "cardiac-sonographer",
    name: "Cardiac Sonographer",
    shortName: "Echo Tech",
    color: "#E91E63",
    colorAccent: "#FCE4EC",
    studyTopics: [
      { slug: "cardiac-anatomy-physiology", title: "Cardiac Anatomy & Physiology", description: "Heart chambers, valves, great vessels, coronary arteries, conduction system, and cardiac cycle hemodynamics.", difficulty: "Beginner", estimatedTime: "4-5 hours", topicCount: 20 },
      { slug: "echocardiography-views", title: "Standard Echocardiography Views", description: "Parasternal, apical, subcostal, and suprasternal windows with standard views, anatomy demonstrated, and optimization tips.", difficulty: "Intermediate", estimatedTime: "5-6 hours", topicCount: 22 },
      { slug: "cardiac-hemodynamics", title: "Cardiac Hemodynamics & Doppler", description: "Bernoulli equation, continuity equation, pressure gradients, cardiac output, dP/dt, and hemodynamic calculations.", difficulty: "Advanced", estimatedTime: "5-7 hours", topicCount: 24 },
      { slug: "valvular-heart-disease", title: "Valvular Heart Disease", description: "Stenosis and regurgitation of mitral, aortic, tricuspid, and pulmonic valves with severity grading and quantification.", difficulty: "Advanced", estimatedTime: "4-6 hours", topicCount: 20 },
      { slug: "lv-systolic-function", title: "LV Systolic Function Assessment", description: "Ejection fraction calculation methods (biplane Simpson's, visual estimation), wall motion scoring, and strain imaging basics.", difficulty: "Intermediate", estimatedTime: "3-4 hours", topicCount: 16 },
      { slug: "diastolic-function", title: "Diastolic Function Assessment", description: "Mitral inflow patterns, tissue Doppler, LA pressure estimation, diastolic grading algorithms, and clinical significance.", difficulty: "Advanced", estimatedTime: "3-5 hours", topicCount: 14 },
      { slug: "congenital-heart-disease", title: "Congenital Heart Defects", description: "ASD, VSD, PDA, tetralogy of Fallot, transposition, and other congenital abnormalities on echocardiography.", difficulty: "Advanced", estimatedTime: "4-5 hours", topicCount: 18 },
      { slug: "stress-echocardiography", title: "Stress Echocardiography", description: "Exercise and pharmacological stress protocols, wall motion analysis, test interpretation, and safety considerations.", difficulty: "Intermediate", estimatedTime: "2-3 hours", topicCount: 12 },
      { slug: "pericardial-disease", title: "Pericardial Disease & Cardiomyopathies", description: "Pericardial effusion, tamponade, constrictive pericarditis, dilated/hypertrophic/restrictive cardiomyopathies.", difficulty: "Intermediate", estimatedTime: "3-4 hours", topicCount: 14 },
    ],
    flashcardDecks: [
      { slug: "echo-views-anatomy", title: "Echo Views & Cardiac Anatomy", cardCount: 100, description: "Standard echocardiographic views, transducer positions, anatomy demonstrated, and optimization techniques.", topicFocus: "Echocardiography Views", difficulty: "Intermediate" },
      { slug: "hemodynamic-calculations", title: "Hemodynamic Calculations", cardCount: 85, description: "Bernoulli equation, continuity equation, PISA, cardiac output, stroke volume, and pressure gradient formulas.", topicFocus: "Cardiac Hemodynamics", difficulty: "Advanced" },
      { slug: "valve-disease-grading", title: "Valvular Disease Severity Grading", cardCount: 90, description: "Stenosis and regurgitation grading criteria for all four cardiac valves with quantitative parameters.", topicFocus: "Valvular Heart Disease", difficulty: "Advanced" },
      { slug: "lv-function-parameters", title: "LV Function & Measurements", cardCount: 70, description: "Normal values for EF, fractional shortening, wall thickness, chamber dimensions, and mass calculations.", topicFocus: "LV Assessment", difficulty: "Intermediate" },
      { slug: "congenital-defects", title: "Congenital Heart Defects", cardCount: 65, description: "Sonographic features, Doppler findings, and hemodynamic consequences of common congenital heart abnormalities.", topicFocus: "Congenital Disease", difficulty: "Advanced" },
      { slug: "diastology-essentials", title: "Diastology Essentials", cardCount: 55, description: "Mitral inflow patterns, E/A ratio, tissue Doppler e' velocity, E/e' ratio, and diastolic grading algorithms.", topicFocus: "Diastolic Function", difficulty: "Advanced" },
      { slug: "cardiac-pathology", title: "Cardiac Pathology Recognition", cardCount: 80, description: "Echocardiographic appearance of cardiomyopathies, masses, thrombi, vegetations, and pericardial disease.", topicFocus: "Pathology", difficulty: "Intermediate" },
    ],
    examEntries: [
      { slug: "diagnostic-assessment", title: "Echo Tech Diagnostic Assessment", description: "25-question assessment spanning cardiac anatomy, hemodynamics, valve disease, and echo physics to gauge your readiness.", questionCount: 25, timeLimit: "30 min", type: "diagnostic" },
      { slug: "hemodynamics-quiz", title: "Cardiac Hemodynamics Quiz", description: "Focused quiz on Doppler calculations, pressure gradients, cardiac output, and hemodynamic principles.", questionCount: 25, timeLimit: "30 min", type: "topic-quiz" },
      { slug: "valvular-quiz", title: "Valvular Heart Disease Quiz", description: "Test your knowledge of valve stenosis and regurgitation grading, quantification methods, and clinical significance.", questionCount: 30, timeLimit: "35 min", type: "topic-quiz" },
      { slug: "full-practice-exam", title: "Full-Length RDCS Practice Exam", description: "Comprehensive practice exam covering adult echocardiography content for ARDMS RDCS certification.", questionCount: 150, timeLimit: "3 hours", type: "practice-set" },
    ],
    careerGuide: {
      educationPath: [
        { step: "Complete prerequisite courses", description: "Anatomy & physiology with emphasis on cardiovascular system, physics, and medical terminology.", duration: "1-2 semesters" },
        { step: "Enroll in cardiac sonography program", description: "Associate or bachelor's degree in cardiovascular technology or echocardiography from a CAAHEP-accredited program.", duration: "2-4 years" },
        { step: "Complete clinical rotations", description: "Supervised echocardiography training in hospital cardiac labs, including TTE, TEE, and stress echo exposure.", duration: "Included in program" },
        { step: "Pass ARDMS SPI exam", description: "Sonography Principles and Instrumentation — the prerequisite physics exam for ARDMS cardiac credentials.", duration: "Exam day" },
        { step: "Pass ARDMS RDCS (AE) exam", description: "Adult Echocardiography specialty exam covering cardiac anatomy, hemodynamics, pathology, and echo techniques.", duration: "Exam day" },
        { step: "Pursue advanced credentials (optional)", description: "Pediatric Echocardiography (PE), Fetal Echocardiography (FE), or CCI RCS credential.", duration: "6-12 months each" },
      ],
      certificationOptions: [
        { name: "RDCS-AE (Adult Echocardiography)", organization: "ARDMS", description: "Primary credential for adult transthoracic and transesophageal echocardiography." },
        { name: "RDCS-PE (Pediatric Echocardiography)", organization: "ARDMS", description: "Specialty credential for pediatric and congenital heart disease echocardiography." },
        { name: "RCS (Registered Cardiac Sonographer)", organization: "CCI", description: "Alternative credential from Cardiovascular Credentialing International." },
        { name: "CSCT Cardiac Sonography", organization: "Sonography Canada (formerly CSDMS)", description: "Canadian credential for cardiac sonographers. Requires graduation from an accredited program and passing the Sonography Canada cardiac sonography exam." },
      ],
      workSettings: [
        { setting: "Hospital Echocardiography Lab", description: "Comprehensive cardiac imaging including TTE, TEE, stress echo, and intraoperative echo." },
        { setting: "Cardiology Private Practice", description: "Outpatient echocardiography with cardiologists in office-based settings." },
        { setting: "Cardiac Catheterization Lab", description: "Intra-procedural echocardiography during structural heart interventions." },
        { setting: "Pediatric Cardiology", description: "Echocardiography for congenital heart disease in pediatric patients." },
        { setting: "Mobile Cardiac Imaging", description: "Portable echocardiography services to clinics and remote healthcare facilities." },
      ],
      skillsNeeded: [
        "Cardiac anatomy and physiology expertise",
        "Echocardiographic image acquisition and optimization",
        "Doppler assessment and hemodynamic calculations",
        "Valvular disease recognition and quantification",
        "LV function assessment (systolic and diastolic)",
        "Congenital heart disease recognition",
        "Patient communication and positioning",
        "Critical thinking and clinical correlation",
        "3D echocardiography and strain imaging",
        "Emergency cardiac assessment skills",
      ],
      examPrepRoadmap: [
        { phase: "Cardiac Foundations", weeks: "Weeks 1-2", focus: "Review cardiac anatomy, physiology, and hemodynamic principles. Master standard echo views." },
        { phase: "Valve Disease & LV Function", weeks: "Weeks 3-5", focus: "Deep dive into valvular pathology grading, EF calculation methods, and diastolic function assessment." },
        { phase: "Hemodynamics & Calculations", weeks: "Weeks 6-8", focus: "Master Doppler calculations, pressure gradients, continuity equation, and hemodynamic formulas." },
        { phase: "Mock Exams & Review", weeks: "Weeks 9-10", focus: "Take full-length practice exams, review weak areas, and refine timing for the RDCS exam." },
      ],
    },
    studyTips: [
      "Start by mastering the standard echo views — you need to know every structure in every window",
      "Practice hemodynamic calculations daily — Bernoulli, continuity equation, and PISA are heavily tested",
      "Create comparison tables for valve stenosis vs regurgitation grading criteria",
      "Study diastolic function grading algorithms step-by-step",
      "Review congenital heart defects with labeled echo images, not just text descriptions",
      "Time yourself on practice exams — the RDCS exam requires efficient question management",
    ],
    featuredTopics: ["echocardiography-views", "cardiac-hemodynamics", "valvular-heart-disease"],
    mostTestedConcepts: ["Hemodynamic calculations", "Valve disease grading", "EF assessment methods", "Diastolic function", "Standard echo views"],
  },
};
