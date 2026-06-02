export interface CareerGuideData {
  slug: string;
  profession: string;
  articleTitle: string;
  heroDescription: string;
  overview: string;
  educationPathway: {
    title: string;
    steps: { step: string; description: string; duration?: string }[];
  };
  licensingRequirements: {
    title: string;
    canada?: { body: string; exams: string[]; notes?: string };
    usa?: { body: string; exams: string[]; notes?: string };
    generalNotes?: string;
  };
  jobOutlook: {
    growthRate: string;
    growthPeriod: string;
    demandDrivers: string[];
    topEmploymentAreas?: string[];
  };
  salary: {
    entryLevel: string;
    median: string;
    experienced: string;
    notes?: string;
  };
  workEnvironments: string[];
  dayInTheLife: string[];
  keySkills: string[];
  careerSlug: string;
  examPrepLink: string;
  studyResourcesLink: string;
}

export const CAREER_GUIDES: Record<string, CareerGuideData> = {
  "paramedic": {
    slug: "how-to-become-a-paramedic",
    profession: "Paramedic",
    articleTitle: "How to Become a Paramedic: Career Guide for 2026",
    heroDescription: "Learn the steps to becoming a paramedic, including education requirements, certification exams, salary expectations, and career outlook in Canada and the United States.",
    overview: "Paramedics are advanced pre-hospital emergency medical professionals who respond to 911 calls, assess patients in the field, and provide life-saving interventions such as advanced airway management, cardiac monitoring, IV therapy, and medication administration. They work in high-pressure environments and must make rapid clinical decisions. In Canada, the profession is divided into Primary Care Paramedic (PCP) and Advanced Care Paramedic (ACP) levels, while in the United States, certification levels include EMT-Basic, EMT-Intermediate/Advanced, and Paramedic (EMT-P) through the National Registry of Emergency Medical Technicians (NREMT).",
    educationPathway: {
      title: "Education Pathway",
      steps: [
        { step: "High School Diploma", description: "Complete high school with strong grades in biology, chemistry, and math. CPR/First Aid certification is a valuable early step.", duration: "4 years" },
        { step: "EMT-Basic Certification (USA) or PCP Program (Canada)", description: "Complete an EMT-Basic or Primary Care Paramedic program covering patient assessment, basic life support, oxygen therapy, and emergency response.", duration: "6-12 months" },
        { step: "Paramedic Program / ACP Program", description: "Enroll in an accredited paramedic or Advanced Care Paramedic diploma program. Curriculum covers advanced pharmacology, cardiac monitoring (12-lead ECG), advanced airway management, trauma care, and field clinical rotations.", duration: "1-2 years" },
        { step: "Clinical Practicum & Field Experience", description: "Complete supervised clinical hours in hospital emergency departments and ambulance ride-along shifts. Most programs require 300-500+ patient contact hours.", duration: "Included in program" },
        { step: "National Certification Exam", description: "Pass the NREMT Paramedic exam (USA) or the provincial licensing exam such as COPR (Canada) to become a certified/registered paramedic.", duration: "Exam preparation" },
      ],
    },
    licensingRequirements: {
      title: "Licensing & Certification",
      canada: { body: "Provincial regulatory bodies (e.g., Ontario MOHLTC, Alberta College of Paramedics)", exams: ["COPR (Canadian Organization of Paramedic Regulators) exam", "Provincial licensing requirements vary by province"], notes: "PCP and ACP are distinct certification levels. Some provinces require additional Advanced Care Paramedic certification." },
      usa: { body: "National Registry of Emergency Medical Technicians (NREMT)", exams: ["NREMT Paramedic cognitive exam", "NREMT Paramedic psychomotor exam", "State-specific licensure requirements"], notes: "Must maintain certification through continuing education (CE) hours every 2 years." },
    },
    jobOutlook: {
      growthRate: "7-11%",
      growthPeriod: "2024-2034",
      demandDrivers: ["Aging population increasing emergency call volume", "Expanding community paramedicine programs", "Rural and remote area staffing needs", "Growth in event medicine and industrial settings"],
      topEmploymentAreas: ["Municipal ambulance services", "Hospital-based transport teams", "Fire department EMS", "Air ambulance / critical care transport", "Industrial and oil-field paramedic services"],
    },
    salary: {
      entryLevel: "$40,000 - $50,000 USD / $45,000 - $55,000 CAD",
      median: "$50,000 - $65,000 USD / $60,000 - $80,000 CAD",
      experienced: "$65,000 - $90,000+ USD / $80,000 - $110,000+ CAD",
      notes: "ACP/critical care paramedics and flight paramedics typically earn 20-40% more than base-level paramedics. Overtime and shift premiums can significantly increase total compensation.",
    },
    workEnvironments: ["Ambulance services (ground transport)", "Air ambulance and helicopter EMS", "Hospital emergency departments", "Fire departments with integrated EMS", "Community paramedicine programs", "Industrial sites and remote camps", "Special events and mass gatherings", "Military and tactical EMS"],
    dayInTheLife: ["Respond to 911 emergency calls for medical, trauma, and psychiatric emergencies", "Perform patient assessment including vitals, 12-lead ECG, and physical examination", "Administer medications, start IVs, manage airways, and perform advanced interventions", "Communicate with dispatch, hospital receiving staff, and other first responders", "Document patient care reports (PCRs) and maintain equipment readiness", "Participate in continuing medical education and quality assurance reviews"],
    keySkills: ["Advanced patient assessment", "Critical thinking under pressure", "ACLS/PALS/ITLS protocols", "12-lead ECG interpretation", "Advanced airway management", "IV/IO access and medication administration", "Trauma management", "Communication and teamwork"],
    careerSlug: "paramedic",
    examPrepLink: "/paramedic",
    studyResourcesLink: "/paramedic/question-bank",
  },

  "respiratory-therapist": {
    slug: "how-to-become-a-respiratory-therapist",
    profession: "Respiratory Therapist",
    articleTitle: "How to Become a Respiratory Therapist (RRT): Career Guide for 2026",
    heroDescription: "Discover the education, certification, salary, and career outlook for respiratory therapists in Canada and the United States.",
    overview: "Registered Respiratory Therapists (RRTs) are healthcare professionals who specialize in cardiopulmonary care. They assess, treat, and manage patients with breathing difficulties ranging from premature infants to elderly adults with chronic lung disease. RRTs operate mechanical ventilators, administer oxygen therapy, perform arterial blood gas (ABG) analysis, manage airways, and provide pulmonary rehabilitation. They work closely with physicians, nurses, and other healthcare professionals in critical care, emergency, and general medicine settings.",
    educationPathway: {
      title: "Education Pathway",
      steps: [
        { step: "High School Diploma", description: "Focus on sciences including biology, chemistry, physics, and math. Anatomy and physiology courses are highly recommended.", duration: "4 years" },
        { step: "Respiratory Therapy Diploma or Degree Program", description: "Complete a CoARC-accredited (USA) or nationally accredited (Canada) respiratory therapy program. Curriculum includes cardiopulmonary anatomy, pharmacology, mechanical ventilation, neonatal/pediatric respiratory care, and diagnostics.", duration: "2-4 years" },
        { step: "Clinical Rotations", description: "Complete supervised clinical rotations in ICU, NICU, emergency department, pulmonary function labs, sleep labs, and general wards.", duration: "Included in program" },
        { step: "National Certification Exam", description: "Pass the NBRC TMC (Therapist Multiple Choice) exam in the USA, or the CBRC national exam in Canada.", duration: "Exam preparation" },
        { step: "Advanced Credentials (Optional)", description: "Earn the RRT credential by passing the NBRC Clinical Simulation Exam (CSE). Specialty certifications include NPS (Neonatal/Pediatric), SDS (Sleep Disorders), ACCS (Adult Critical Care).", duration: "Ongoing" },
      ],
    },
    licensingRequirements: {
      title: "Licensing & Certification",
      canada: { body: "Canadian Board for Respiratory Care (CBRC) and provincial regulatory colleges", exams: ["CBRC National Competency Exam", "Provincial registration requirements"], notes: "Licensing varies by province. Ontario, BC, Alberta, and other provinces have their own regulatory colleges." },
      usa: { body: "National Board for Respiratory Care (NBRC)", exams: ["NBRC Therapist Multiple Choice (TMC) Exam", "NBRC Clinical Simulation Exam (CSE) for RRT credential"], notes: "State licensure required in most states. Continuing education required for recertification." },
    },
    jobOutlook: {
      growthRate: "12-14%",
      growthPeriod: "2024-2034",
      demandDrivers: ["Aging population with increasing COPD and chronic respiratory disease", "Post-COVID-19 demand for pulmonary specialists", "Growth in sleep medicine and home ventilation", "Expansion of respiratory care in outpatient and home health settings"],
      topEmploymentAreas: ["Hospitals (ICU, NICU, Emergency)", "Long-term acute care facilities", "Home health agencies", "Sleep disorder centers", "Pulmonary rehabilitation clinics", "Physician offices"],
    },
    salary: {
      entryLevel: "$50,000 - $60,000 USD / $55,000 - $65,000 CAD",
      median: "$62,000 - $75,000 USD / $70,000 - $85,000 CAD",
      experienced: "$75,000 - $95,000+ USD / $85,000 - $110,000+ CAD",
      notes: "Specialty certifications in neonatal, critical care, or sleep medicine can increase earning potential. Travel respiratory therapists may earn significantly more.",
    },
    workEnvironments: ["Hospital ICUs and NICUs", "Emergency departments", "Pulmonary function laboratories", "Sleep disorder clinics", "Home health and home ventilation", "Long-term acute care facilities", "Outpatient rehabilitation clinics", "Education and research"],
    dayInTheLife: ["Assess patients with respiratory distress and perform pulmonary function tests", "Set up, manage, and troubleshoot mechanical ventilators", "Perform arterial blood gas (ABG) draws and interpretation", "Administer bronchodilator and respiratory medications via nebulizer or MDI", "Respond to code blue and rapid response emergencies", "Educate patients on inhaler technique, oxygen use, and disease self-management"],
    keySkills: ["Mechanical ventilation management", "ABG interpretation", "Airway management and intubation assistance", "Pulmonary function testing", "Neonatal and pediatric respiratory care", "Critical thinking and rapid decision-making", "Patient education", "Collaboration with interdisciplinary teams"],
    careerSlug: "rrt",
    examPrepLink: "/rrt",
    studyResourcesLink: "/rrt/question-bank",
  },

  "medical-lab-technologist": {
    slug: "how-to-become-a-medical-lab-technologist",
    profession: "Medical Laboratory Technologist",
    articleTitle: "How to Become a Medical Lab Technologist (MLT): Career Guide for 2026",
    heroDescription: "Explore the education, certification, salary, and career outlook for medical laboratory technologists (MLTs) in Canada and the United States.",
    overview: "Medical Laboratory Technologists (MLTs), also known as Medical Laboratory Scientists (MLS) in the USA, are healthcare professionals who perform complex diagnostic testing on patient samples including blood, urine, tissue, and body fluids. They work in areas such as clinical chemistry, hematology, microbiology, immunohematology (blood banking), urinalysis, and molecular diagnostics. Their test results are critical for diagnosing diseases, monitoring treatment effectiveness, and guiding physician decision-making. MLTs work behind the scenes but are essential to 70-80% of all medical diagnoses.",
    educationPathway: {
      title: "Education Pathway",
      steps: [
        { step: "High School Diploma", description: "Strong background in biology, chemistry, math, and computer science. Advanced science courses are recommended.", duration: "4 years" },
        { step: "MLT Diploma or Bachelor's Degree", description: "Complete an accredited Medical Laboratory Technology program (2-3 year diploma in Canada, 4-year bachelor's in USA). Coursework covers clinical chemistry, hematology, microbiology, immunology, blood banking, and quality management.", duration: "2-4 years" },
        { step: "Clinical Practicum", description: "Complete supervised clinical rotations in hospital and reference laboratory settings across all major disciplines (chemistry, hematology, microbiology, blood bank).", duration: "6-12 months (included in program)" },
        { step: "National Certification Exam", description: "Pass the CSMLS national exam (Canada) or ASCP Board of Certification exam (USA) to become a certified/registered MLT.", duration: "Exam preparation" },
      ],
    },
    licensingRequirements: {
      title: "Licensing & Certification",
      canada: { body: "Canadian Society for Medical Laboratory Science (CSMLS)", exams: ["CSMLS General MLT Certification Exam"], notes: "Provincial regulation varies. Some provinces require registration with a provincial college." },
      usa: { body: "American Society for Clinical Pathology (ASCP) Board of Certification", exams: ["ASCP MLS (Medical Laboratory Scientist) Certification", "ASCP MLT (Medical Laboratory Technician) Certification"], notes: "Some states require state-specific licensure. ASCP certification is widely recognized as the gold standard." },
    },
    jobOutlook: {
      growthRate: "5-7%",
      growthPeriod: "2024-2034",
      demandDrivers: ["Aging population requiring more diagnostic testing", "Advances in molecular diagnostics and genetic testing", "Laboratory workforce shortages due to retirements", "Growth in point-of-care and reference laboratory testing"],
      topEmploymentAreas: ["Hospital clinical laboratories", "Reference laboratories (e.g., LifeLabs, Quest Diagnostics)", "Public health laboratories", "Research institutions", "Blood banks and transfusion services"],
    },
    salary: {
      entryLevel: "$45,000 - $55,000 USD / $50,000 - $60,000 CAD",
      median: "$55,000 - $70,000 USD / $65,000 - $80,000 CAD",
      experienced: "$70,000 - $90,000+ USD / $80,000 - $100,000+ CAD",
      notes: "Specialists in molecular diagnostics, cytotechnology, or management roles can earn significantly more. Travel MLTs may earn premium rates.",
    },
    workEnvironments: ["Hospital clinical laboratories", "Private reference laboratories", "Public health laboratories", "Blood banks and donor centers", "Research and academic institutions", "Forensic laboratories", "Veterinary laboratories", "Pharmaceutical and biotech companies"],
    dayInTheLife: ["Analyze blood, urine, and tissue samples using automated analyzers and manual techniques", "Perform cross-matching and compatibility testing for blood transfusions", "Culture and identify bacteria, viruses, and fungi from patient specimens", "Calibrate, maintain, and troubleshoot laboratory instruments", "Review and verify test results, flagging critical values for immediate physician notification", "Participate in quality control and quality assurance programs"],
    keySkills: ["Attention to detail and accuracy", "Clinical chemistry and hematology analysis", "Microbiology culture and identification", "Blood banking and immunohematology", "Quality control and quality assurance", "Laboratory information systems (LIS)", "Critical value recognition", "Infection control and safety protocols"],
    careerSlug: "mlt",
    examPrepLink: "/mlt",
    studyResourcesLink: "/mlt/question-bank",
  },

  "radiologic-technologist": {
    slug: "how-to-become-a-radiologic-technologist",
    profession: "Radiologic Technologist",
    articleTitle: "How to Become a Radiologic Technologist: Career Guide for 2026",
    heroDescription: "Learn how to become a radiologic technologist, including education requirements, ARRT/CAMRT certification, salary expectations, and career growth.",
    overview: "Radiologic Technologists (also called radiographers or X-ray technologists) are healthcare professionals who produce diagnostic medical images using X-ray, CT, MRI, mammography, and fluoroscopy equipment. They position patients for imaging procedures, operate sophisticated imaging equipment, ensure radiation safety, and work with radiologists and physicians to obtain high-quality diagnostic images. The field also encompasses specialized modalities such as MRI technology, CT scanning, interventional radiography, and sonography.",
    educationPathway: {
      title: "Education Pathway",
      steps: [
        { step: "High School Diploma", description: "Strong background in physics, biology, chemistry, and math. Anatomy courses are especially helpful.", duration: "4 years" },
        { step: "Radiography Program", description: "Complete a JRCERT-accredited (USA) or nationally accredited (Canada) radiography program. Programs are available as associate's degrees (2 years) or bachelor's degrees (4 years). Curriculum covers radiographic positioning, radiation physics, image production, patient care, and anatomy.", duration: "2-4 years" },
        { step: "Clinical Rotations", description: "Complete supervised clinical hours in hospital radiology departments covering general radiography, fluoroscopy, OR imaging, portable radiography, and specialty rotations.", duration: "Included in program (1,500+ hours typical)" },
        { step: "National Certification Exam", description: "Pass the ARRT Radiography exam (USA) or CAMRT certification exam (Canada) to become a certified radiologic technologist.", duration: "Exam preparation" },
        { step: "Advanced Modality Certification (Optional)", description: "Specialize with additional certifications in CT, MRI, mammography, interventional radiography, or sonography.", duration: "6-24 months additional training" },
      ],
    },
    licensingRequirements: {
      title: "Licensing & Certification",
      canada: { body: "Canadian Association of Medical Radiation Technologists (CAMRT) and provincial regulatory bodies", exams: ["CAMRT National Certification Exam in Radiological Technology"], notes: "Provincial licensure required. Continuing professional development (CPD) required for maintenance." },
      usa: { body: "American Registry of Radiologic Technologists (ARRT)", exams: ["ARRT Radiography Certification Exam", "State-specific licensure (varies by state)"], notes: "Must complete 24 CE credits every 2 years. Advanced certifications available for CT, MRI, mammography, and more." },
    },
    jobOutlook: {
      growthRate: "6-9%",
      growthPeriod: "2024-2034",
      demandDrivers: ["Aging population requiring more diagnostic imaging", "Advances in imaging technology (AI-assisted imaging, 3D imaging)", "Expanding outpatient imaging centers", "Growth in interventional radiology procedures"],
      topEmploymentAreas: ["Hospitals (radiology departments)", "Outpatient imaging centers", "Physician offices and urgent care clinics", "Mobile imaging services", "Government and military facilities"],
    },
    salary: {
      entryLevel: "$48,000 - $58,000 USD / $50,000 - $62,000 CAD",
      median: "$60,000 - $75,000 USD / $65,000 - $82,000 CAD",
      experienced: "$75,000 - $95,000+ USD / $82,000 - $105,000+ CAD",
      notes: "CT and MRI technologists typically earn 10-20% more than general radiographers. Interventional radiology and travel technologists command premium rates.",
    },
    workEnvironments: ["Hospital radiology departments", "Outpatient diagnostic imaging centers", "Urgent care and walk-in clinics", "Operating rooms (surgical imaging)", "Mobile imaging units", "Specialty clinics (orthopedic, oncology)", "Research facilities", "Equipment manufacturer applications"],
    dayInTheLife: ["Position patients and adjust equipment for optimal diagnostic images", "Operate X-ray, CT, fluoroscopy, and other imaging equipment", "Apply radiation safety principles to protect patients, staff, and self", "Evaluate image quality and retake images when necessary", "Assist radiologists during fluoroscopic and interventional procedures", "Maintain equipment, perform quality control checks, and document procedures"],
    keySkills: ["Radiographic positioning and anatomy", "Radiation safety and protection", "Image quality assessment", "CT and advanced modality operation", "Patient communication and positioning", "Equipment troubleshooting", "Anatomy and physiology knowledge", "Attention to detail"],
    careerSlug: "imaging",
    examPrepLink: "/imaging",
    studyResourcesLink: "/imaging/question-bank",
  },

  "social-worker": {
    slug: "how-to-become-a-social-worker",
    profession: "Social Worker",
    articleTitle: "How to Become a Licensed Clinical Social Worker (LCSW): Career Guide for 2026",
    heroDescription: "Explore the path to becoming a licensed clinical social worker, including MSW degree requirements, ASWB exam preparation, salary expectations, and career outlook.",
    overview: "Licensed Clinical Social Workers (LCSWs) are mental health professionals who diagnose and treat mental health disorders, provide psychotherapy, and help individuals, families, and communities navigate complex social and emotional challenges. They work across healthcare, schools, government agencies, and private practice settings. Social workers use evidence-based therapeutic modalities including CBT, DBT, and motivational interviewing. In Canada, social workers are regulated provincially, while in the United States, the ASWB (Association of Social Work Boards) provides the national licensing exam at multiple levels.",
    educationPathway: {
      title: "Education Pathway",
      steps: [
        { step: "Bachelor's Degree (BSW or related)", description: "Complete a bachelor's degree, ideally a Bachelor of Social Work (BSW) from a CSWE-accredited program. BSW graduates may be eligible for advanced standing MSW programs.", duration: "4 years" },
        { step: "Master of Social Work (MSW)", description: "Complete an accredited MSW program with clinical concentration. Curriculum covers human behavior, social welfare policy, research methods, clinical practice, psychopathology, and DSM-5 diagnosis.", duration: "2 years (1 year with advanced standing)" },
        { step: "Clinical Field Placements", description: "Complete supervised clinical field placements (typically 900+ hours) in settings such as hospitals, community mental health centers, schools, or private practice.", duration: "Included in MSW program" },
        { step: "Post-Graduate Supervised Clinical Hours", description: "Complete 2,000-4,000 hours of post-graduate supervised clinical practice (requirements vary by state/province).", duration: "2-3 years" },
        { step: "ASWB Licensing Exam", description: "Pass the ASWB Clinical exam (USA) or applicable provincial/national licensing exam (Canada).", duration: "Exam preparation" },
      ],
    },
    licensingRequirements: {
      title: "Licensing & Certification",
      canada: { body: "Provincial regulatory bodies (e.g., Ontario College of Social Workers and Social Service Workers, BC College of Social Workers)", exams: ["Provincial registration exam (varies)", "Jurisprudence exam in some provinces"], notes: "Requirements vary significantly by province. RSW (Registered Social Worker) is the standard designation." },
      usa: { body: "Association of Social Work Boards (ASWB)", exams: ["ASWB Bachelors Exam", "ASWB Masters Exam", "ASWB Advanced Generalist Exam", "ASWB Clinical Exam"], notes: "LCSW requires MSW degree plus 2,000-4,000 supervised clinical hours. State licensure requirements vary." },
    },
    jobOutlook: {
      growthRate: "7-9%",
      growthPeriod: "2024-2034",
      demandDrivers: ["Growing demand for mental health services", "Integration of behavioral health into primary care", "Increased awareness of social determinants of health", "Expansion of telehealth therapy services"],
      topEmploymentAreas: ["Hospitals and healthcare systems", "Community mental health centers", "Schools and universities", "Government social services agencies", "Private practice", "Substance abuse treatment centers"],
    },
    salary: {
      entryLevel: "$42,000 - $52,000 USD / $48,000 - $58,000 CAD",
      median: "$55,000 - $70,000 USD / $60,000 - $78,000 CAD",
      experienced: "$70,000 - $95,000+ USD / $75,000 - $100,000+ CAD",
      notes: "LCSWs in private practice can earn significantly more. Specializations in substance abuse, healthcare social work, or clinical supervision increase earning potential.",
    },
    workEnvironments: ["Hospitals and healthcare facilities", "Community mental health centers", "Schools and universities", "Government agencies (child welfare, veterans affairs)", "Private and group practice", "Substance abuse treatment centers", "Hospice and palliative care", "Employee assistance programs (EAPs)"],
    dayInTheLife: ["Conduct biopsychosocial assessments and develop treatment plans", "Provide individual, family, and group psychotherapy", "Diagnose mental health conditions using DSM-5 criteria", "Coordinate care with psychiatrists, physicians, and other providers", "Advocate for clients' access to community resources and services", "Maintain clinical documentation and participate in case conferences"],
    keySkills: ["Clinical assessment and diagnosis (DSM-5)", "Evidence-based therapy (CBT, DBT, MI)", "Crisis intervention", "Cultural competency and diversity awareness", "Case management and care coordination", "Ethical practice and professional boundaries", "Documentation and treatment planning", "Active listening and empathy"],
    careerSlug: "social-worker",
    examPrepLink: "/social-worker",
    studyResourcesLink: "/social-worker/question-bank",
  },

  "psychotherapist": {
    slug: "how-to-become-a-psychotherapist",
    profession: "Psychotherapist",
    articleTitle: "How to Become a Registered Psychotherapist: Career Guide for 2026",
    heroDescription: "Learn about the education, registration, salary, and career outlook for registered psychotherapists in Canada and licensed counselors in the United States.",
    overview: "Registered Psychotherapists (RPs) in Canada and Licensed Professional Counselors (LPCs) or Licensed Mental Health Counselors (LMHCs) in the United States provide psychotherapy to individuals, couples, families, and groups. They use evidence-based therapeutic approaches including Cognitive Behavioural Therapy (CBT), Dialectical Behaviour Therapy (DBT), EMDR, psychodynamic therapy, and person-centered therapy to treat anxiety, depression, trauma, relationship issues, and other mental health concerns. Psychotherapists must meet specific educational, clinical, and regulatory requirements to practice independently.",
    educationPathway: {
      title: "Education Pathway",
      steps: [
        { step: "Bachelor's Degree", description: "Complete a bachelor's degree in psychology, counseling, or a related field. Strong foundation in research methods, developmental psychology, and abnormal psychology.", duration: "4 years" },
        { step: "Master's Degree in Counseling/Psychotherapy", description: "Complete a graduate program in counseling psychology, psychotherapy, or clinical mental health counseling. Programs typically require 60+ credit hours covering therapeutic modalities, ethics, psychopathology, and group counseling.", duration: "2-3 years" },
        { step: "Supervised Clinical Hours", description: "Complete 1,500-4,000 hours of supervised direct client contact (requirements vary by jurisdiction). Supervision must be provided by an approved supervisor.", duration: "2-3 years post-graduation" },
        { step: "Registration/Licensing Exam", description: "Pass the CRPO Registration Exam (Ontario, Canada), or the NCE/NCMHCE (USA), or other jurisdiction-specific exams.", duration: "Exam preparation" },
      ],
    },
    licensingRequirements: {
      title: "Licensing & Registration",
      canada: { body: "College of Registered Psychotherapists of Ontario (CRPO) and equivalents in other provinces", exams: ["CRPO Registration Exam (Ontario)", "Canadian Certified Counsellor (CCC) designation through CCPA"], notes: "The title 'Psychotherapist' is regulated in Ontario. Other provinces may use different titles and regulatory frameworks." },
      usa: { body: "State licensing boards for professional counselors", exams: ["National Counselor Examination (NCE)", "National Clinical Mental Health Counseling Examination (NCMHCE)", "State-specific jurisprudence exams"], notes: "License titles vary by state: LPC, LMHC, LPCC, LCPC. Requirements for supervised hours vary (2,000-4,000 hours)." },
    },
    jobOutlook: {
      growthRate: "18-22%",
      growthPeriod: "2024-2034",
      demandDrivers: ["Growing mental health awareness and destigmatization", "Insurance parity laws expanding coverage for psychotherapy", "Post-pandemic surge in demand for mental health services", "Growth of telehealth/virtual therapy platforms"],
      topEmploymentAreas: ["Private practice", "Community mental health agencies", "Hospitals and healthcare systems", "Employee assistance programs", "Schools and universities", "Addiction treatment centers"],
    },
    salary: {
      entryLevel: "$40,000 - $50,000 USD / $45,000 - $58,000 CAD",
      median: "$50,000 - $65,000 USD / $58,000 - $75,000 CAD",
      experienced: "$65,000 - $100,000+ USD / $75,000 - $110,000+ CAD",
      notes: "Private practice therapists with established caseloads can earn significantly more. Specializations in trauma, couples therapy, or EMDR are in high demand.",
    },
    workEnvironments: ["Private practice (solo or group)", "Community mental health centers", "Hospitals and medical clinics", "University counseling centers", "Employee assistance programs (EAPs)", "Addiction treatment facilities", "Telehealth/virtual practice", "Corporate wellness programs"],
    dayInTheLife: ["Conduct intake assessments and develop individualized treatment plans", "Provide evidence-based psychotherapy (CBT, DBT, EMDR, psychodynamic)", "Assess for risk of self-harm, suicidal ideation, and safety planning", "Maintain detailed clinical notes and session documentation", "Consult with psychiatrists, physicians, and other providers as needed", "Participate in continuing education and clinical supervision"],
    keySkills: ["Evidence-based therapeutic modalities (CBT, DBT, EMDR)", "Clinical assessment and treatment planning", "Active listening and empathic communication", "Cultural sensitivity and inclusive practice", "Crisis intervention and safety assessment", "Professional ethics and boundary management", "Group facilitation skills", "Self-care and burnout prevention"],
    careerSlug: "psychotherapist",
    examPrepLink: "/psychotherapist",
    studyResourcesLink: "/psychotherapist/question-bank",
  },

  "addictions-counselor": {
    slug: "how-to-become-an-addictions-counselor",
    profession: "Addictions Counselor",
    articleTitle: "How to Become an Addictions Counselor: Career Guide for 2026",
    heroDescription: "Discover the steps to becoming a certified addictions counselor, including education pathways, IC&RC certification, salary expectations, and career growth.",
    overview: "Addictions Counselors (also called Substance Abuse Counselors or Chemical Dependency Counselors) are specialized professionals who help individuals struggling with substance use disorders and behavioral addictions. They conduct assessments, develop treatment plans, facilitate individual and group therapy, provide crisis intervention, and support clients through recovery. They employ evidence-based approaches including Motivational Interviewing (MI), Cognitive Behavioural Therapy (CBT), 12-step facilitation, and contingency management. In Canada, the profession is certified through organizations like the Canadian Addiction Counsellors Certification Federation (CACCF), while the USA uses the IC&RC (International Certification & Reciprocity Consortium) framework.",
    educationPathway: {
      title: "Education Pathway",
      steps: [
        { step: "High School Diploma", description: "Complete high school. Courses in psychology, sociology, and health are beneficial preparation.", duration: "4 years" },
        { step: "Post-Secondary Education", description: "Complete a certificate, diploma, or bachelor's degree in addictions counseling, social work, psychology, or a related field. Some jurisdictions accept relevant work experience in lieu of a degree.", duration: "1-4 years" },
        { step: "Supervised Clinical Experience", description: "Complete 2,000-6,000 hours of supervised clinical experience in addiction treatment settings (requirements vary by certification body and jurisdiction).", duration: "1-3 years" },
        { step: "Certification Exam", description: "Pass the IC&RC ADC (Alcohol and Drug Counselor) exam, CASAC exam (New York), CCAC exam (Canada), or equivalent jurisdiction-specific exam.", duration: "Exam preparation" },
      ],
    },
    licensingRequirements: {
      title: "Licensing & Certification",
      canada: { body: "Canadian Addiction Counsellors Certification Federation (CACCF) and provincial bodies", exams: ["CACCF National Certification Exam", "Provincial certification requirements"], notes: "Certification designations include CCAC (Canadian Certified Addictions Counsellor) and ICADC (International)." },
      usa: { body: "IC&RC (International Certification & Reciprocity Consortium) and state boards", exams: ["IC&RC ADC (Alcohol and Drug Counselor) Exam", "CASAC (Credentialed Alcoholism and Substance Abuse Counselor) in NY", "State-specific licensing exams"], notes: "Many states use IC&RC-affiliated certification. Requirements for education and supervised hours vary significantly." },
    },
    jobOutlook: {
      growthRate: "18-25%",
      growthPeriod: "2024-2034",
      demandDrivers: ["Ongoing opioid and substance abuse crisis", "Expansion of medication-assisted treatment (MAT) programs", "Integration of addiction services into primary care", "Growing recognition of behavioral addictions (gambling, gaming)"],
      topEmploymentAreas: ["Substance abuse treatment centers (residential and outpatient)", "Community mental health agencies", "Hospitals and detoxification units", "Correctional facilities", "Private practice", "Government health agencies"],
    },
    salary: {
      entryLevel: "$35,000 - $45,000 USD / $40,000 - $52,000 CAD",
      median: "$45,000 - $58,000 USD / $52,000 - $68,000 CAD",
      experienced: "$58,000 - $80,000+ USD / $68,000 - $90,000+ CAD",
      notes: "Advanced certifications (ICADC, MAC) and clinical supervision roles increase earning potential. Government positions often offer better benefits and pension.",
    },
    workEnvironments: ["Residential treatment centers", "Outpatient addiction clinics", "Hospital detoxification units", "Community health centers", "Correctional facilities and drug courts", "Harm reduction programs", "Private practice", "Employee assistance programs (EAPs)"],
    dayInTheLife: ["Conduct substance use assessments and develop individualized treatment plans", "Facilitate individual counseling and group therapy sessions", "Apply Motivational Interviewing and CBT techniques", "Monitor client progress and adjust treatment plans as needed", "Coordinate with medical staff for medication-assisted treatment (MAT)", "Provide crisis intervention and relapse prevention planning"],
    keySkills: ["Motivational Interviewing (MI)", "Cognitive Behavioural Therapy (CBT) for addictions", "Substance use assessment and screening tools", "Group counseling facilitation", "Relapse prevention planning", "Crisis intervention", "Cultural competence in addiction services", "Knowledge of pharmacology of substances"],
    careerSlug: "addictions-counsellor",
    examPrepLink: "/addictions-counsellor",
    studyResourcesLink: "/addictions-counsellor/question-bank",
  },

  "occupational-therapist": {
    slug: "how-to-become-an-occupational-therapist",
    profession: "Occupational Therapist",
    articleTitle: "How to Become an Occupational Therapist (OT): Career Guide for 2026",
    heroDescription: "Learn the education, licensing, salary, and career outlook for occupational therapists in Canada and the United States.",
    overview: "Occupational Therapists (OTs) are healthcare professionals who help people of all ages participate in the activities (occupations) that matter most to them. They work with individuals who have physical, cognitive, developmental, or emotional challenges that affect their ability to perform daily activities such as self-care, work, school, and leisure. OTs evaluate clients, develop individualized intervention plans, recommend adaptive equipment, modify environments, and provide rehabilitation therapy. They use a holistic, client-centered approach to promote independence and quality of life across the lifespan.",
    educationPathway: {
      title: "Education Pathway",
      steps: [
        { step: "Bachelor's Degree", description: "Complete a bachelor's degree with prerequisites in anatomy, physiology, psychology, sociology, statistics, and human development.", duration: "4 years" },
        { step: "Master's or Doctoral Degree in Occupational Therapy", description: "Complete an accredited Master of Occupational Therapy (MOT/MScOT) or Doctorate of Occupational Therapy (OTD) program. Programs cover neuroscience, biomechanics, therapeutic interventions, pediatric OT, mental health OT, and assistive technology.", duration: "2-3 years (master's) or 3-4 years (doctorate)" },
        { step: "Fieldwork Placements", description: "Complete Level I and Level II fieldwork placements (minimum 24 weeks full-time) in diverse clinical settings including pediatrics, acute care, rehabilitation, mental health, and community settings.", duration: "Included in program" },
        { step: "National Certification Exam", description: "Pass the NBCOT OTR exam (USA) or NOTCE (National Occupational Therapy Certification Exam, Canada).", duration: "Exam preparation" },
      ],
    },
    licensingRequirements: {
      title: "Licensing & Certification",
      canada: { body: "Canadian Association of Occupational Therapists (CAOT) and provincial regulatory colleges", exams: ["NOTCE (National Occupational Therapy Certification Exam)"], notes: "Provincial registration required. Must maintain continuing competency requirements." },
      usa: { body: "National Board for Certification in Occupational Therapy (NBCOT)", exams: ["NBCOT OTR (Occupational Therapist Registered) Exam"], notes: "State licensure required in all states. Must complete continuing education for renewal. Entry-level OTD required for new programs starting 2027." },
    },
    jobOutlook: {
      growthRate: "12-14%",
      growthPeriod: "2024-2034",
      demandDrivers: ["Aging population needing rehabilitation services", "Growth in pediatric early intervention and autism services", "Expansion of community-based and home health OT", "Increasing demand for ergonomic and workplace health services"],
      topEmploymentAreas: ["Hospitals and rehabilitation centers", "Schools and early intervention programs", "Home health agencies", "Skilled nursing facilities", "Outpatient clinics", "Private practice"],
    },
    salary: {
      entryLevel: "$60,000 - $72,000 USD / $60,000 - $70,000 CAD",
      median: "$72,000 - $88,000 USD / $72,000 - $90,000 CAD",
      experienced: "$88,000 - $110,000+ USD / $90,000 - $115,000+ CAD",
      notes: "Specializations in hand therapy (CHT), pediatrics, or neurorehabilitation can increase earning potential. Travel OTs and OTs in underserved areas often earn premium rates.",
    },
    workEnvironments: ["Hospitals and acute care", "Inpatient rehabilitation centers", "Schools and pediatric clinics", "Skilled nursing facilities", "Home health agencies", "Outpatient rehabilitation clinics", "Community mental health", "Ergonomic and workplace health consulting"],
    dayInTheLife: ["Evaluate clients' physical, cognitive, and functional abilities", "Develop individualized treatment plans with measurable SMART goals", "Provide therapeutic interventions to improve ADL/IADL performance", "Recommend and train clients on adaptive equipment and assistive devices", "Modify home and work environments for accessibility and safety", "Collaborate with physicians, PTs, SLPs, and other team members"],
    keySkills: ["Functional assessment and evaluation", "Treatment planning with SMART goals", "Therapeutic activity design", "Adaptive equipment recommendation", "Pediatric developmental assessment", "Cognitive rehabilitation", "Home modification planning", "Client and family education"],
    careerSlug: "occupational-therapy",
    examPrepLink: "/occupational-therapy",
    studyResourcesLink: "/occupational-therapy/question-bank",
  },

  "pharmacy-technician": {
    slug: "how-to-become-a-pharmacy-technician",
    profession: "Pharmacy Technician",
    articleTitle: "How to Become a Pharmacy Technician: Career Guide for 2026",
    heroDescription: "Learn about pharmacy technician education, PTCB/PEBC certification, salary expectations, and career growth in Canada and the United States.",
    overview: "Pharmacy Technicians are healthcare professionals who work under the supervision of licensed pharmacists to prepare and dispense medications, manage inventory, process prescriptions, and provide customer service in pharmacy settings. They play a critical role in medication safety by verifying prescription information, compounding medications, managing drug inventory, and counseling patients on proper medication use. In both Canada and the United States, pharmacy technicians are increasingly taking on expanded roles including medication reconciliation, immunization support, and patient intake services.",
    educationPathway: {
      title: "Education Pathway",
      steps: [
        { step: "High School Diploma", description: "Complete high school with strong grades in science, math, and chemistry. Basic computer skills and customer service experience are valuable.", duration: "4 years" },
        { step: "Pharmacy Technician Training Program", description: "Complete an ASHP-accredited (USA) or nationally approved (Canada) pharmacy technician program. Programs cover pharmacology, pharmacy law, dosage calculations, sterile and non-sterile compounding, and prescription processing.", duration: "6 months - 2 years" },
        { step: "Experiential Training", description: "Complete supervised practice hours in community pharmacy, hospital pharmacy, or both settings. Hands-on training in prescription filling, compounding, and inventory management.", duration: "Included in program" },
        { step: "National Certification Exam", description: "Pass the PTCB (Pharmacy Technician Certification Board) or ExCPT exam (USA), or the PEBC Qualifying Exam (Canada).", duration: "Exam preparation" },
      ],
    },
    licensingRequirements: {
      title: "Licensing & Certification",
      canada: { body: "Pharmacy Examining Board of Canada (PEBC) and provincial pharmacy regulatory authorities", exams: ["PEBC Pharmacy Technician Qualifying Exam", "Provincial registration exam (if applicable)"], notes: "Pharmacy technicians are regulated professionals in most Canadian provinces. Must register with the provincial college of pharmacy." },
      usa: { body: "Pharmacy Technician Certification Board (PTCB) or NHA ExCPT", exams: ["PTCB Certification Exam (PTCE)", "ExCPT (Exam for the Certification of Pharmacy Technicians)"], notes: "Most states require national certification. CE requirements vary by state. Advanced certifications available (CPhT-Adv, CSPT)." },
    },
    jobOutlook: {
      growthRate: "5-6%",
      growthPeriod: "2024-2034",
      demandDrivers: ["Expanding role of pharmacy technicians in healthcare", "Growth in specialty pharmacy and compounding", "Increased prescription volumes from aging population", "Expansion of pharmacy services (immunizations, clinical services)"],
      topEmploymentAreas: ["Retail/community pharmacies (CVS, Walgreens, Shoppers Drug Mart)", "Hospital pharmacies", "Specialty pharmacies", "Mail-order and online pharmacies", "Long-term care pharmacy", "Compounding pharmacies"],
    },
    salary: {
      entryLevel: "$30,000 - $37,000 USD / $35,000 - $42,000 CAD",
      median: "$37,000 - $45,000 USD / $42,000 - $52,000 CAD",
      experienced: "$45,000 - $55,000+ USD / $52,000 - $62,000+ CAD",
      notes: "Hospital pharmacy technicians and compounding specialists typically earn more than retail pharmacy technicians. Certified and specialized technicians command higher salaries.",
    },
    workEnvironments: ["Retail/community pharmacies", "Hospital inpatient pharmacies", "Specialty pharmacies (oncology, infusion)", "Mail-order and central fill pharmacies", "Compounding pharmacies", "Long-term care and nursing home pharmacies", "Nuclear pharmacies", "Pharmaceutical distribution companies"],
    dayInTheLife: ["Receive and verify prescription orders from physicians and patients", "Count, measure, and package medications accurately", "Perform sterile and non-sterile compounding procedures", "Manage drug inventory, ordering, and expiration tracking", "Process insurance claims and handle prior authorizations", "Provide customer service and medication pickup coordination"],
    keySkills: ["Prescription processing and verification", "Dosage calculations and conversions", "Sterile and non-sterile compounding", "Pharmacy law and regulations", "Drug classification and interaction awareness", "Inventory management", "Customer service and patient communication", "Attention to detail and accuracy"],
    careerSlug: "pharmacy-tech",
    examPrepLink: "/pharmacy-tech",
    studyResourcesLink: "/pharmacy-tech/question-bank",
  },
};

export function getCareerGuideBySlug(slug: string): CareerGuideData | undefined {
  return Object.values(CAREER_GUIDES).find(g => g.slug === slug);
}

export function getAllCareerGuideSlugs(): string[] {
  return Object.values(CAREER_GUIDES).map(g => g.slug);
}
