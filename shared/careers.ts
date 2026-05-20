export const CAREER_TYPES = [
  "nursing",
  "rrt",
  "paramedic",
  "pharmacyTech",
  "mlt",
  "imaging",
  "criticalCare",
  "emergencyNursing",
  "perioperative",
  "oncologyNursing",
  "pediatricCert",
  "psychotherapist",
  "socialWorker",
  "addictionsCounsellor",
  "occupationalTherapy",
  "physicalTherapy",
  "healthInfoMgmt",
  "occupationalTherapyAssistant",
  "physiotherapyAssistant",
  "surgicalTechnologist",
  "diagnosticSonography",
  "cardiacSonographer",
] as const;

export type CareerType = (typeof CAREER_TYPES)[number];

export interface CareerTier {
  id: string;
  name: string;
  level: number;
}

export interface CareerAITool {
  id: string;
  name: string;
  description: string;
  route: string;
}

export interface CareerConfig {
  id: CareerType;
  name: string;
  shortName: string;
  slug: string;
  description: string;
  icon: string;
  routePrefix: string;
  tiers: CareerTier[];
  examNames: string[];
  color: string;
  colorAccent: string;
  aiTools: CareerAITool[];
  domains: string[];
  enabled: boolean;
}

export const CAREER_CONFIGS: Record<CareerType, CareerConfig> = {
  nursing: {
    id: "nursing",
    name: "Nursing",
    shortName: "Nursing",
    slug: "nursing",
    description: "RPN, RN, and NP exam preparation with 2,400+ clinical lessons",
    icon: "Stethoscope",
    routePrefix: "",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "rpn", name: "RPN / LPN", level: 1 },
      { id: "rn", name: "RN", level: 2 },
      { id: "np", name: "NP", level: 3 },
    ],
    examNames: ["REx-PN", "NCLEX-PN", "NCLEX-RN", "NP Certification"],
    color: "#6C63FF",
    colorAccent: "#E8E6FF",
    aiTools: [],
    domains: [
      "Cardiovascular",
      "Respiratory",
      "Neurological",
      "Gastrointestinal",
      "Renal",
      "Endocrine",
      "Hematology",
      "Musculoskeletal",
      "Maternity",
      "Pediatrics",
      "Mental Health",
      "Pharmacology",
    ],
    enabled: true,
  },
  rrt: {
    id: "rrt",
    name: "Registered Respiratory Therapist",
    shortName: "RRT",
    slug: "rrt",
    description: "Respiratory therapy exam prep covering ventilator management, ABG analysis, and airway management",
    icon: "Wind",
    routePrefix: "/rrt",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "rrt-basic", name: "RRT Basic", level: 1 },
      { id: "rrt-advanced", name: "RRT Advanced", level: 2 },
    ],
    examNames: ["NBRC TMC", "NBRC CSE", "CBRC"],
    color: "#2196F3",
    colorAccent: "#E3F2FD",
    aiTools: [
      { id: "abg-engine", name: "ABG Interpretation Engine", description: "Practice arterial blood gas analysis with instant AI feedback", route: "/rrt/abg-engine" },
      { id: "ventilator-sim", name: "Ventilator Mode Simulator", description: "Interactive ventilator settings and waveform analysis", route: "/rrt/ventilator-sim" },
    ],
    domains: [
      "Airway Management",
      "Oxygen Therapy",
      "ABG Interpretation",
      "Mechanical Ventilation",
      "Pulmonary Function Testing",
      "Neonatal & Pediatric Respiratory Care",
      "Critical Care Respiratory Therapy",
      "Cardiopulmonary Physiology",
      "Aerosol & Medication Delivery",
      "Sleep & Noninvasive Ventilation",
      "Emergency Respiratory Care",
      "Patient Assessment",
      "Infection Control & Equipment",
    ],
    enabled: true,
  },
  paramedic: {
    id: "paramedic",
    name: "Paramedic / Advanced Care Paramedic",
    shortName: "Paramedic",
    slug: "paramedic",
    description: "Paramedic certification exam prep with trauma algorithms, ACLS/PALS, and field pharmacology",
    icon: "Ambulance",
    routePrefix: "/paramedic",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "pcp", name: "Primary Care Paramedic", level: 1 },
      { id: "acp", name: "Advanced Care Paramedic", level: 2 },
    ],
    examNames: ["NREMT", "COPR", "PCP/ACP Provincial"],
    color: "#F44336",
    colorAccent: "#FFEBEE",
    aiTools: [
      { id: "trauma-algorithm", name: "Trauma Algorithm Simulator", description: "Step-through trauma assessment and management algorithms", route: "/paramedic/trauma-algorithm" },
      { id: "ecg-drill", name: "ECG Recognition Drill", description: "Identify cardiac rhythms with progressive difficulty", route: "/paramedic/ecg-drill" },
    ],
    domains: [
      "Trauma",
      "Medical Emergencies",
      "Cardiac/ACLS",
      "Pediatric/PALS",
      "OB Emergencies",
      "Pharmacology",
      "Airway Management",
      "Assessment",
      "Operations",
      "Legal/Ethics",
    ],
    enabled: true,
  },
  pharmacyTech: {
    id: "pharmacyTech",
    name: "Pharmacy Technician",
    shortName: "Pharm Tech",
    slug: "pharmacy-tech",
    description: "Pharmacy technician certification prep with dosage calculations, compounding, and drug classification",
    icon: "Pill",
    routePrefix: "/pharmacy-tech",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "ptcb-basic", name: "PTCB Basic", level: 1 },
      { id: "ptcb-advanced", name: "PTCB Advanced", level: 2 },
    ],
    examNames: ["PTCB", "ExCPT", "PEBC Qualifying"],
    color: "#4CAF50",
    colorAccent: "#E8F5E9",
    aiTools: [
      { id: "dosage-calc", name: "Dosage Calculator", description: "Practice pharmaceutical calculations with step-by-step solutions", route: "/pharmacy-tech/dosage-calc" },
      { id: "compounding-sim", name: "Compounding Math Simulator", description: "Master compounding ratios, dilutions, and alligation methods", route: "/pharmacy-tech/compounding-sim" },
    ],
    domains: [
      "Pharmacology",
      "Dosage Calculations",
      "Compounding",
      "Drug Interactions",
      "Regulations/Law",
      "Sterile Products",
      "Inventory Management",
      "Patient Safety",
      "Drug Classifications",
      "Prescription Processing",
    ],
    enabled: true,
  },
  mlt: {
    id: "mlt",
    name: "Medical Laboratory Technologist",
    shortName: "MLT",
    slug: "mlt",
    description: "Medical lab technologist exam prep covering hematology, clinical chemistry, microbiology, and blood banking for CSMLS (Canada) and ASCP (USA) certification",
    icon: "Microscope",
    routePrefix: "/mlt",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "mlt-basic", name: "MLT Basic", level: 1 },
      { id: "mlt-advanced", name: "MLT Advanced", level: 2 },
    ],
    examNames: ["CSMLS MLT", "ASCP MLS", "ASCP MLT"],
    color: "#9C27B0",
    colorAccent: "#F3E5F5",
    aiTools: [
      { id: "lab-critical", name: "Lab Critical Value Engine", description: "Recognize and respond to critical laboratory values", route: "/mlt/lab-critical" },
      { id: "morphology-drill", name: "Morphology Drill", description: "Identify cell morphology and abnormalities", route: "/mlt/morphology-drill" },
    ],
    domains: [
      "Clinical Chemistry",
      "Hematology",
      "Hemostasis / Coagulation",
      "Immunohematology / Blood Banking",
      "Microbiology",
      "Urinalysis & Body Fluids",
      "Immunology / Serology",
      "Molecular Diagnostics",
      "Histotechnology",
      "Cytotechnology",
      "Mycology",
      "Parasitology",
      "Virology",
      "Phlebotomy & Specimen Collection",
      "Laboratory Operations & Quality Management",
      "Point-of-Care Testing",
    ],
    enabled: true,
  },
  imaging: {
    id: "imaging",
    name: "Diagnostic Imaging",
    shortName: "Imaging",
    slug: "imaging",
    description: "Radiologic, MRI, and sonography exam prep with anatomy positioning, radiation safety, and image analysis",
    icon: "ScanLine",
    routePrefix: "/imaging",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "img-basic", name: "Imaging Basic", level: 1 },
      { id: "img-advanced", name: "Imaging Advanced", level: 2 },
    ],
    examNames: ["ARRT Radiography", "ARRT MRI", "ARDMS Sonography", "CAMRT"],
    color: "#FF9800",
    colorAccent: "#FFF3E0",
    aiTools: [
      { id: "anatomy-labeling", name: "Anatomy Labeling Simulator", description: "Interactive anatomy identification on diagnostic images", route: "/imaging/anatomy-labeling" },
      { id: "image-recognition", name: "Image Recognition Drill", description: "Identify pathology and normal variants on radiographic images", route: "/imaging/image-recognition" },
    ],
    domains: [
      "Radiographic Positioning",
      "Radiation Safety",
      "Anatomy/Physiology",
      "Image Production",
      "Equipment Operation",
      "Patient Care",
      "Pathology Recognition",
      "CT Imaging",
      "MRI Physics",
      "Ultrasound Physics",
    ],
    enabled: true,
  },
  criticalCare: {
    id: "criticalCare",
    name: "Critical Care Certification (CCRN)",
    shortName: "Critical Care",
    slug: "critical-care",
    description: "CCRN exam preparation for ICU and critical care nurses covering hemodynamic monitoring, ventilator management, and multisystem failure",
    icon: "HeartPulse",
    routePrefix: "/critical-care",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "ccrn-basic", name: "CCRN Basic", level: 1 },
      { id: "ccrn-advanced", name: "CCRN Advanced", level: 2 },
    ],
    examNames: ["CCRN-Adult", "CCRN-Pediatric", "CCRN-Neonatal"],
    color: "#D32F2F",
    colorAccent: "#FFCDD2",
    aiTools: [
      { id: "hemodynamic-sim", name: "Hemodynamic Monitoring Simulator", description: "Interpret hemodynamic waveforms, CVP, PAP, and cardiac output values", route: "/critical-care/hemodynamic-sim" },
      { id: "icu-case-sim", name: "ICU Case Simulator", description: "Manage complex ICU patients with multisystem assessment", route: "/critical-care/icu-case-sim" },
    ],
    domains: [
      "Cardiovascular",
      "Pulmonary",
      "Neurological",
      "Multisystem",
      "Renal",
      "Endocrine",
      "Hematology/Immunology",
      "GI",
      "Behavioral/Psychosocial",
      "Professional Caring",
    ],
    enabled: true,
  },
  emergencyNursing: {
    id: "emergencyNursing",
    name: "Emergency Nursing Certification (CEN)",
    shortName: "Emergency",
    slug: "emergency-nursing",
    description: "CEN exam preparation for emergency department nurses covering triage, trauma, and acute care management",
    icon: "Siren",
    routePrefix: "/emergency-nursing",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "cen-basic", name: "CEN Basic", level: 1 },
      { id: "cen-advanced", name: "CEN Advanced", level: 2 },
    ],
    examNames: ["CEN", "TCRN", "CPEN"],
    color: "#E65100",
    colorAccent: "#FFE0B2",
    aiTools: [
      { id: "triage-sim", name: "Triage Decision Simulator", description: "Practice ESI triage with realistic patient scenarios", route: "/emergency-nursing/triage-sim" },
      { id: "trauma-nursing-sim", name: "Trauma Nursing Simulator", description: "Manage trauma patients using TNCC principles", route: "/emergency-nursing/trauma-nursing-sim" },
    ],
    domains: [
      "Cardiovascular Emergencies",
      "Respiratory Emergencies",
      "Neurological Emergencies",
      "GI/GU Emergencies",
      "Obstetric/Gynecological",
      "Orthopedic/Wound",
      "Psychosocial/Mental Health",
      "Medical Emergencies",
      "Maxillofacial/Ocular",
      "Environment/Toxicology",
    ],
    enabled: true,
  },
  perioperative: {
    id: "perioperative",
    name: "Perioperative Nursing Certification (CNOR)",
    shortName: "Perioperative",
    slug: "perioperative",
    description: "CNOR exam preparation for OR nurses covering surgical procedures, sterile technique, and patient safety in the operating room",
    icon: "Scissors",
    routePrefix: "/perioperative",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "cnor-basic", name: "CNOR Basic", level: 1 },
      { id: "cnor-advanced", name: "CNOR Advanced", level: 2 },
    ],
    examNames: ["CNOR", "CRNFA", "CSSM"],
    color: "#00897B",
    colorAccent: "#E0F2F1",
    aiTools: [
      { id: "sterile-field-sim", name: "Sterile Field Simulator", description: "Practice maintaining sterile technique in surgical scenarios", route: "/perioperative/sterile-field-sim" },
      { id: "surgical-count-drill", name: "Surgical Count Drill", description: "Practice surgical instrument and sponge count protocols", route: "/perioperative/surgical-count-drill" },
    ],
    domains: [
      "Preoperative Patient Assessment",
      "Intraoperative Care",
      "Postoperative Patient Care",
      "Sterilization/Disinfection",
      "Equipment/Supplies",
      "Emergency Situations",
      "Infection Prevention",
      "Patient Safety",
      "Professional Accountability",
      "Management of Personnel",
    ],
    enabled: true,
  },
  oncologyNursing: {
    id: "oncologyNursing",
    name: "Oncology Nursing Certification (OCN)",
    shortName: "Oncology",
    slug: "oncology-nursing",
    description: "OCN exam preparation for oncology nurses covering cancer treatment modalities, symptom management, and survivorship",
    icon: "Ribbon",
    routePrefix: "/oncology-nursing",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "ocn-basic", name: "OCN Basic", level: 1 },
      { id: "ocn-advanced", name: "OCN Advanced", level: 2 },
    ],
    examNames: ["OCN", "AOCNP", "CBCN"],
    color: "#7B1FA2",
    colorAccent: "#E1BEE7",
    aiTools: [
      { id: "chemo-safety-sim", name: "Chemotherapy Safety Simulator", description: "Practice safe handling and administration of chemotherapy agents", route: "/oncology-nursing/chemo-safety-sim" },
      { id: "staging-drill", name: "Cancer Staging Drill", description: "Practice TNM staging and cancer classification systems", route: "/oncology-nursing/staging-drill" },
    ],
    domains: [
      "Cancer Pathophysiology",
      "Treatment Modalities",
      "Symptom Management",
      "Oncologic Emergencies",
      "Psychosocial Support",
      "Survivorship",
      "End-of-Life Care",
      "Safe Handling",
      "Screening/Prevention",
      "Professional Practice",
    ],
    enabled: true,
  },
  pediatricCert: {
    id: "pediatricCert",
    name: "Pediatric Nursing Certification (CPN)",
    shortName: "Pediatric",
    slug: "pediatric-cert",
    description: "CPN exam preparation for pediatric nurses covering growth and development, pediatric assessment, and family-centered care",
    icon: "Baby",
    routePrefix: "/pediatric-cert",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "cpn-basic", name: "CPN Basic", level: 1 },
      { id: "cpn-advanced", name: "CPN Advanced", level: 2 },
    ],
    examNames: ["CPN", "CPEN", "PCCN"],
    color: "#E91E63",
    colorAccent: "#FCE4EC",
    aiTools: [
      { id: "peds-assessment-sim", name: "Pediatric Assessment Simulator", description: "Practice age-appropriate pediatric assessment techniques", route: "/pediatric-cert/peds-assessment-sim" },
      { id: "growth-dev-drill", name: "Growth & Development Drill", description: "Master developmental milestones by age group", route: "/pediatric-cert/growth-dev-drill" },
    ],
    domains: [
      "Growth/Development",
      "Cardiovascular",
      "Respiratory",
      "Neurological",
      "GI/Nutrition",
      "Renal/GU",
      "Hematology/Oncology",
      "Musculoskeletal",
      "Infectious Disease",
      "Psychosocial/Mental Health",
    ],
    enabled: true,
  },
  psychotherapist: {
    id: "psychotherapist",
    name: "Registered Psychotherapist (Canada)",
    shortName: "Psychotherapist",
    slug: "psychotherapist",
    description: "Registered Psychotherapist qualifying exam preparation covering therapeutic modalities, ethics, and clinical practice in Canadian regulation",
    icon: "Brain",
    routePrefix: "/psychotherapist",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "rp-basic", name: "RP Basic", level: 1 },
      { id: "rp-advanced", name: "RP Advanced", level: 2 },
    ],
    examNames: ["CRPO Registration Exam", "RP Qualifying Exam", "National Counselor Examination (NCE)", "Clinical Mental Health Counseling Exam (CMHCE)", "Canadian Certified Counsellor (CCC) Exam"],
    color: "#5C6BC0",
    colorAccent: "#E8EAF6",
    aiTools: [
      { id: "therapeutic-modality-sim", name: "Therapeutic Modality Simulator", description: "Practice applying CBT, DBT, EMDR, and other modalities to case vignettes", route: "/psychotherapist/therapeutic-modality-sim" },
      { id: "ethics-scenario-drill", name: "Ethics Scenario Drill", description: "Navigate ethical dilemmas in psychotherapy practice", route: "/psychotherapist/ethics-scenario-drill" },
    ],
    domains: [
      "Therapeutic Modalities",
      "Psychopathology",
      "Assessment and Diagnosis",
      "Ethics and Boundaries",
      "Treatment Planning",
      "Crisis Intervention",
    ],
    enabled: true,
  },
  socialWorker: {
    id: "socialWorker",
    name: "Licensed Clinical Social Worker",
    shortName: "Social Work",
    slug: "social-worker",
    description: "ASWB (Bachelors, Masters, Clinical) and Canadian Social Work licensing exam preparation covering clinical practice, DSM-5 diagnosis, and evidence-based interventions",
    icon: "Users",
    routePrefix: "/social-worker",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "lcsw-basic", name: "LCSW Basic", level: 1 },
      { id: "lcsw-advanced", name: "LCSW Advanced", level: 2 },
    ],
    examNames: ["ASWB Clinical", "ASWB Masters", "ASWB Advanced Generalist"],
    color: "#00ACC1",
    colorAccent: "#E0F7FA",
    aiTools: [
      { id: "dsm5-diagnosis-sim", name: "DSM-5 Diagnosis Simulator", description: "Practice differential diagnosis using DSM-5 criteria and case vignettes", route: "/social-worker/dsm5-diagnosis-sim" },
      { id: "intervention-matching", name: "Intervention Matching Engine", description: "Match evidence-based interventions to client presentations", route: "/social-worker/intervention-matching" },
    ],
    domains: [
      "Human Behavior & Development",
      "Assessment & Diagnosis",
      "Intervention & Treatment Planning",
      "Ethics & Professional Practice",
      "Community Resources",
      "Crisis Intervention",
    ],
    enabled: true,
  },
  addictionsCounsellor: {
    id: "addictionsCounsellor",
    name: "Addictions Counsellor Certification",
    shortName: "Addictions",
    slug: "addictions-counsellor",
    description: "Addiction counsellor certification exam preparation covering substance use disorders, motivational interviewing, and relapse prevention",
    icon: "ShieldCheck",
    routePrefix: "/addictions-counsellor",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "cac-basic", name: "CAC Basic", level: 1 },
      { id: "cac-advanced", name: "CAC Advanced", level: 2 },
    ],
    examNames: ["IC&RC ADC", "CASAC", "CCAC"],
    color: "#558B2F",
    colorAccent: "#DCEDC8",
    aiTools: [
      { id: "mi-practice-sim", name: "Motivational Interviewing Simulator", description: "Practice MI techniques with AI-generated client responses", route: "/addictions-counsellor/mi-practice-sim" },
      { id: "substance-id-drill", name: "Substance Identification Drill", description: "Identify substances, mechanisms, and withdrawal patterns", route: "/addictions-counsellor/substance-id-drill" },
    ],
    domains: [
      "Pharmacology of Substances",
      "Assessment/Screening",
      "Treatment Planning",
      "Counseling Approaches",
      "Relapse Prevention",
      "Co-occurring Disorders",
      "Ethics/Professional Practice",
      "Cultural Competence",
      "Group Counseling",
      "Crisis Intervention",
    ],
    enabled: true,
  },
  occupationalTherapy: {
    id: "occupationalTherapy",
    name: "Occupational Therapy Certification",
    shortName: "Occupational Therapy",
    slug: "occupational-therapy",
    description: "Occupational therapy licensing exam preparation covering evaluation, intervention planning, professional practice, and pediatric development",
    icon: "Hand",
    routePrefix: "/occupational-therapy",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "ot-standard", name: "OT Standard", level: 1 },
      { id: "ot-premium", name: "OT Premium", level: 2 },
    ],
    examNames: ["NBCOT OTR", "NOTCE"],
    color: "#6A1B9A",
    colorAccent: "#E1BEE7",
    aiTools: [
      { id: "ot-case-analysis", name: "Case Analysis Simulator", description: "Practice clinical reasoning with OT-specific patient vignettes", route: "/occupational-therapy/case-analysis" },
      { id: "ot-goal-writer", name: "SMART Goal Writer", description: "Practice writing measurable treatment goals for OT interventions", route: "/occupational-therapy/goal-writer" },
    ],
    domains: [
      "Evaluation & Assessment",
      "Intervention Planning & Implementation",
      "Professional Practice & Ethics",
      "Psychosocial & Mental Health",
      "Pediatrics & Development",
      "ADL/IADL Performance",
      "Cognitive Rehabilitation",
      "Assistive Technology",
      "Documentation & Reimbursement",
      "Evidence-Based Practice",
    ],
    enabled: true,
  },
  physicalTherapy: {
    id: "physicalTherapy",
    name: "Physical Therapy Certification",
    shortName: "Physical Therapy",
    slug: "physical-therapy",
    description: "Physical therapy licensing exam preparation covering musculoskeletal, neuromuscular, cardiopulmonary systems, and professional responsibilities",
    icon: "Activity",
    routePrefix: "/physical-therapy",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "pt-standard", name: "PT Standard", level: 1 },
      { id: "pt-premium", name: "PT Premium", level: 2 },
    ],
    examNames: ["NPTE", "PCE"],
    color: "#00695C",
    colorAccent: "#B2DFDB",
    aiTools: [
      { id: "pt-differential-dx", name: "Differential Diagnosis Trainer", description: "Practice differential diagnosis with realistic patient presentations", route: "/physical-therapy/differential-dx" },
      { id: "pt-gait-analysis", name: "Gait Analysis Simulator", description: "Analyze gait patterns and identify deviations with clinical correlations", route: "/physical-therapy/gait-analysis" },
    ],
    domains: [
      "Musculoskeletal",
      "Neuromuscular",
      "Cardiopulmonary",
      "Integumentary",
      "Non-System/Professional Responsibilities",
      "Biomechanics & Kinesiology",
      "Therapeutic Exercise",
      "Patient Education",
      "Discharge Planning",
      "Evidence-Based Practice",
    ],
    enabled: true,
  },
  healthInfoMgmt: {
    id: "healthInfoMgmt",
    name: "Health Information Management",
    shortName: "HIM",
    slug: "health-info-mgmt",
    description: "Health information management exam preparation covering ICD-10 coding, EHR management, HIPAA compliance, revenue cycle, and clinical documentation improvement for AHIMA RHIT/RHIA certification",
    icon: "Database",
    routePrefix: "/health-info-mgmt",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "him-standard", name: "HIM Standard", level: 1 },
      { id: "him-premium", name: "HIM Premium", level: 2 },
    ],
    examNames: ["AHIMA RHIT", "AHIMA RHIA", "AHIMA CCS", "AAPC CPC"],
    color: "#3F51B5",
    colorAccent: "#E8EAF6",
    aiTools: [
      { id: "coding-drill", name: "ICD-10/CPT Coding Drill", description: "Practice assigning ICD-10-CM, ICD-10-PCS, and CPT codes to clinical scenarios", route: "/health-info-mgmt/coding-drill" },
      { id: "hipaa-scenario-sim", name: "HIPAA Scenario Simulator", description: "Navigate privacy and security compliance scenarios", route: "/health-info-mgmt/hipaa-scenario-sim" },
    ],
    domains: [
      "ICD-10-CM/PCS Coding",
      "CPT/HCPCS Coding",
      "Health Data Management",
      "HIPAA Privacy & Security",
      "Revenue Cycle Management",
      "Clinical Documentation Improvement",
      "EHR Systems & Health IT",
      "Data Analytics & Quality",
      "Compliance & Legal",
      "Health Information Exchange",
    ],
    enabled: true,
  },
  occupationalTherapyAssistant: {
    id: "occupationalTherapyAssistant",
    name: "Occupational Therapy Assistant",
    shortName: "OTA",
    slug: "occupational-therapy-assistant",
    description: "OTA exam preparation covering ADL training, adaptive equipment, cognitive rehabilitation, and pediatric OT for NBCOT COTA certification",
    icon: "Hand",
    routePrefix: "/occupational-therapy-assistant",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "ota-standard", name: "OTA Standard", level: 1 },
      { id: "ota-premium", name: "OTA Premium", level: 2 },
    ],
    examNames: ["NBCOT COTA", "State Licensure"],
    color: "#8BC34A",
    colorAccent: "#F1F8E9",
    aiTools: [
      { id: "adl-assessment-sim", name: "ADL Assessment Simulator", description: "Practice evaluating and planning ADL interventions", route: "/occupational-therapy-assistant/adl-assessment-sim" },
      { id: "splinting-guide", name: "Splinting & Orthotics Guide", description: "Interactive orthotic fabrication and splinting scenarios", route: "/occupational-therapy-assistant/splinting-guide" },
    ],
    domains: [
      "Activities of Daily Living (ADLs)",
      "Adaptive Equipment & Assistive Technology",
      "Cognitive Rehabilitation",
      "Hand Therapy & Splinting",
      "Pediatric OT Interventions",
      "Psychosocial OT",
      "Sensory Processing",
      "Documentation & Ethics",
      "Geriatric OT",
      "Group Facilitation",
    ],
    enabled: true,
  },
  physiotherapyAssistant: {
    id: "physiotherapyAssistant",
    name: "Physical Therapist Assistant / Physiotherapy Assistant",
    shortName: "PTA",
    slug: "physiotherapy-assistant",
    description: "PTA exam preparation covering therapeutic exercises, gait training, modalities, and musculoskeletal interventions for NPTE-PTA certification",
    icon: "Activity",
    routePrefix: "/physiotherapy-assistant",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "pta-standard", name: "PTA Standard", level: 1 },
      { id: "pta-premium", name: "PTA Premium", level: 2 },
    ],
    examNames: ["NPTE-PTA", "FSBPT", "Provincial Certification"],
    color: "#009688",
    colorAccent: "#E0F2F1",
    aiTools: [
      { id: "modality-selector", name: "Modality Selection Trainer", description: "Practice selecting appropriate physical therapy modalities for clinical scenarios", route: "/physiotherapy-assistant/modality-selector" },
      { id: "gait-deviation-drill", name: "Gait Deviation Drill", description: "Identify gait deviations and select corrective interventions", route: "/physiotherapy-assistant/gait-deviation-drill" },
    ],
    domains: [
      "Musculoskeletal Rehabilitation",
      "Neurological Rehabilitation",
      "Cardiopulmonary Physical Therapy",
      "Pediatric Rehabilitation",
      "Geriatric Rehabilitation",
      "Therapeutic Modalities",
      "Gait Training & Assistive Devices",
      "Patient Safety & Body Mechanics",
      "Documentation & Communication",
      "Ethics & Professional Practice",
      "Integumentary & Wound Care",
      "Prosthetics & Orthotics",
      "Biomechanics & Kinesiology",
      "Pain Management",
      "Evidence-Based Practice",
      "Therapeutic Exercise",
      "Data Collection & Measurement",
      "Patient Education & Home Programs",
      "Pharmacology for PTAs",
      "Clinical Prioritization & Workflow",
    ],
    enabled: true,
  },
  surgicalTechnologist: {
    id: "surgicalTechnologist",
    name: "Surgical Technologist",
    shortName: "Surg Tech",
    slug: "surgical-technologist",
    description: "Surgical technology exam preparation covering sterile technique, surgical instrumentation, anatomy, and perioperative care for CST and TS-C certification",
    icon: "Scissors",
    routePrefix: "/surgical-technologist",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "st-standard", name: "Surg Tech Standard", level: 1 },
      { id: "st-premium", name: "Surg Tech Premium", level: 2 },
    ],
    examNames: ["NBSTSA CST", "NCCT TS-C", "CSTA Standards"],
    color: "#607D8B",
    colorAccent: "#ECEFF1",
    aiTools: [
      { id: "instrument-id-drill", name: "Instrument Identification Drill", description: "Practice identifying surgical instruments by name and function", route: "/surgical-technologist/instrument-id-drill" },
      { id: "sterile-field-sim", name: "Sterile Field Simulator", description: "Navigate sterile technique scenarios and identify breaks in sterility", route: "/surgical-technologist/sterile-field-sim" },
    ],
    domains: [
      "Sterile Technique & Asepsis",
      "Operating Room Protocols",
      "Surgical Instrumentation",
      "Surgical Procedures",
      "Patient Positioning",
      "Infection Prevention",
      "Anesthesia Basics",
      "Surgical Complications",
      "Perioperative Care",
      "Wound Closure & Hemostasis",
      "Sterilization & Disinfection",
      "Emergency Situations in the OR",
    ],
    enabled: true,
  },
  diagnosticSonography: {
    id: "diagnosticSonography",
    name: "Diagnostic Sonography",
    shortName: "Sonography",
    slug: "diagnostic-sonography",
    description: "Diagnostic medical sonography exam preparation covering ultrasound physics, abdominal, OB/GYN, vascular, and small parts imaging for ARDMS certification",
    icon: "Radio",
    routePrefix: "/diagnostic-sonography",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "sono-standard", name: "Sonography Standard", level: 1 },
      { id: "sono-premium", name: "Sonography Premium", level: 2 },
    ],
    examNames: ["ARDMS SPI", "ARDMS RDMS", "ARDMS RVT"],
    color: "#0097A7",
    colorAccent: "#E0F7FA",
    aiTools: [],
    domains: [
      "Ultrasound Physics & Instrumentation",
      "Abdominal Sonography",
      "Obstetric Sonography",
      "Vascular Sonography",
      "Gynecologic Sonography",
      "Small Parts & Superficial Structures",
      "Musculoskeletal Ultrasound",
      "Sonographic Pathology Recognition",
    ],
    enabled: true,
  },
  cardiacSonographer: {
    id: "cardiacSonographer",
    name: "Cardiac Sonography",
    shortName: "Cardiac Sono",
    slug: "cardiac-sonographer",
    description: "Cardiac sonography exam preparation covering echocardiography views, hemodynamics, valve disease, cardiomyopathies, and advanced techniques for ARDMS RDCS and CCI RCS certification",
    icon: "Heart",
    routePrefix: "/cardiac-sonographer",
    tiers: [
      { id: "free", name: "Free", level: 0 },
      { id: "cs-standard", name: "Cardiac Sono Standard", level: 1 },
      { id: "cs-premium", name: "Cardiac Sono Premium", level: 2 },
    ],
    examNames: ["ARDMS RDCS", "CCI RCS"],
    color: "#E91E63",
    colorAccent: "#FCE4EC",
    aiTools: [],
    domains: [
      "Cardiac Anatomy & Physiology",
      "Standard Echocardiography Views",
      "Cardiac Hemodynamics & Doppler",
      "Valvular Heart Disease",
      "LV Systolic Function Assessment",
      "Diastolic Function Assessment",
      "Congenital Heart Disease",
      "Stress Echocardiography",
      "Pericardial Disease & Cardiomyopathies",
      "TEE & Advanced Techniques",
    ],
    enabled: true,
  },
};

export const CAREER_SLUG_TO_CANONICAL_ROUTE: Record<string, string> = {
  "rrt": "/rrt",
  "paramedic": "/paramedic",
  "pharmacy-tech": "/pharmacy-technician",
  "mlt": "/mlt",
  "imaging": "/imaging",
  "psychotherapist": "/psychotherapy",
  "social-worker": "/social-work",
  "addictions-counsellor": "/addictions",
  "occupational-therapy": "/occupational-therapy",
  "physical-therapy": "/physical-therapy",
  "health-info-mgmt": "/health-info-mgmt",
  "occupational-therapy-assistant": "/occupational-therapy-assistant",
  "physiotherapy-assistant": "/physiotherapy-assistant",
  "surgical-technologist": "/surgical-technologist",
  "radiologic-technologist": "/radiologic-technologist",
  "diagnostic-sonography": "/diagnostic-sonography",
  "cardiac-sonographer": "/cardiac-sonographer",
  "nursing": "/nursing",
  "critical-care": "/critical-care",
  "emergency-nursing": "/emergency-nursing",
  "perioperative": "/perioperative",
  "oncology-nursing": "/oncology-nursing",
  "pediatric-cert": "/pediatric-cert",
};

const ALLIED_HEALTH_CAREER_SLUGS = new Set([
  "rrt", "paramedic", "pharmacy-tech", "mlt", "imaging",
  "psychotherapist", "social-worker", "addictions-counsellor",
  "occupational-therapy", "physical-therapy", "health-info-mgmt",
  "occupational-therapy-assistant", "physiotherapy-assistant", "surgical-technologist",
  "radiologic-technologist", "diagnostic-sonography", "cardiac-sonographer",
]);

export function getCanonicalRoute(careerSlug: string): string {
  const base = CAREER_SLUG_TO_CANONICAL_ROUTE[careerSlug] || `/careers/${careerSlug}`;
  if (ALLIED_HEALTH_CAREER_SLUGS.has(careerSlug)) {
    return `/allied-health${base}`;
  }
  return base;
}

export function getBaseCanonicalRoute(careerSlug: string): string {
  return CAREER_SLUG_TO_CANONICAL_ROUTE[careerSlug] || `/careers/${careerSlug}`;
}

export const CANONICAL_ROUTE_SLUG_TO_CAREER_SLUG: Record<string, string> = Object.entries(
  CAREER_SLUG_TO_CANONICAL_ROUTE
).reduce((acc, [careerSlug, route]) => {
  const routeSlug = route.replace(/^\//, "");
  if (routeSlug !== careerSlug) {
    acc[routeSlug] = careerSlug;
  }
  return acc;
}, {} as Record<string, string>);

export function getCareerByRouteSlug(routeSlug: string): CareerConfig | undefined {
  const cleanSlug = routeSlug.replace(/^allied-health\//, "");
  const careerSlug = CANONICAL_ROUTE_SLUG_TO_CAREER_SLUG[cleanSlug] || cleanSlug;
  return getCareerBySlug(careerSlug);
}

export function getCareerBySlug(slug: string): CareerConfig | undefined {
  return Object.values(CAREER_CONFIGS).find((c) => c.slug === slug);
}

export function getCareerById(id: CareerType): CareerConfig {
  return CAREER_CONFIGS[id];
}

export function getEnabledCareers(): CareerConfig[] {
  return Object.values(CAREER_CONFIGS).filter((c) => c.enabled);
}

export function getCareerRoutePrefix(careerType: CareerType): string {
  return CAREER_CONFIGS[careerType].routePrefix;
}

export const ACTIVE_BUILD_PRIORITY: CareerType[] = [
  "occupationalTherapyAssistant",
  "physiotherapyAssistant",
] as const as unknown as CareerType[];

export interface ContentExpansionItem {
  career: string;
  slug: string;
  status: "active" | "planned" | "research";
  searchVolume: "high" | "medium" | "low";
  seoOpportunity: "high" | "medium" | "low";
  conversionPotential: "high" | "medium" | "low";
  contentDepth: "deep" | "moderate" | "shallow";
  notes: string;
}

export const CONTENT_EXPANSION_ROADMAP: ContentExpansionItem[] = [
  { career: "Pre-Nursing", slug: "pre-nursing", status: "planned", searchVolume: "high", seoOpportunity: "high", conversionPotential: "high", contentDepth: "deep", notes: "Massive search volume for TEAS/HESI A2 prep. High conversion — funnels directly into RN/LPN tracks." },
  { career: "New Grad Nurse", slug: "new-grad", status: "planned", searchVolume: "high", seoOpportunity: "high", conversionPotential: "high", contentDepth: "moderate", notes: "New grad transition content, residency prep, first-year clinical competency. Strong retention driver." },
  { career: "Addictions Counsellor", slug: "addictions-counsellor", status: "active", searchVolume: "medium", seoOpportunity: "medium", conversionPotential: "medium", contentDepth: "deep", notes: "IC&RC, CASAC, CADC certification prep. Growing demand with opioid crisis. Already has base content." },
  { career: "Psychotherapist", slug: "psychotherapist", status: "active", searchVolume: "medium", seoOpportunity: "high", conversionPotential: "medium", contentDepth: "deep", notes: "NCE, NCMHCE, state licensure prep. Mental health demand driving search volume growth." },
];
