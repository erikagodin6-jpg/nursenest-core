export type Region = "US" | "CA";

export interface LabConversion {
  name: string;
  usUnit: string;
  caUnit: string;
  conversionFactor: number;
  usReference: string;
  caReference: string;
}

export interface LegalModule {
  id: string;
  name: string;
  description: string;
}

export interface RegionExamConfig {
  examBoard: string;
  examName: string;
  labValueSystem: "mg_dL" | "mmol_L";
  calculationSystem: "US_customary" | "metric";
  legalModules: LegalModule[];
  compoundingStandard: string;
  passThreshold: number;
  domainMinimum: number;
  scaledScoreMin: number;
  scaledScoreMax: number;
  scaledPassScore: number;
  totalQuestions: number;
  timeLimit: number;
  blueprintWeights: Record<string, number>;
}

export const LAB_CONVERSIONS: Record<string, LabConversion> = {
  glucose: {
    name: "Glucose",
    usUnit: "mg/dL",
    caUnit: "mmol/L",
    conversionFactor: 0.0555,
    usReference: "70-100 mg/dL",
    caReference: "3.9-5.6 mmol/L",
  },
  creatinine: {
    name: "Creatinine",
    usUnit: "mg/dL",
    caUnit: "umol/L",
    conversionFactor: 88.4,
    usReference: "0.7-1.3 mg/dL",
    caReference: "62-115 umol/L",
  },
  bun: {
    name: "BUN / Urea",
    usUnit: "mg/dL",
    caUnit: "mmol/L",
    conversionFactor: 0.357,
    usReference: "7-20 mg/dL",
    caReference: "2.5-7.1 mmol/L",
  },
  sodium: {
    name: "Sodium",
    usUnit: "mEq/L",
    caUnit: "mmol/L",
    conversionFactor: 1,
    usReference: "136-145 mEq/L",
    caReference: "136-145 mmol/L",
  },
  potassium: {
    name: "Potassium",
    usUnit: "mEq/L",
    caUnit: "mmol/L",
    conversionFactor: 1,
    usReference: "3.5-5.0 mEq/L",
    caReference: "3.5-5.0 mmol/L",
  },
  calcium: {
    name: "Calcium",
    usUnit: "mg/dL",
    caUnit: "mmol/L",
    conversionFactor: 0.25,
    usReference: "8.5-10.5 mg/dL",
    caReference: "2.12-2.62 mmol/L",
  },
  hemoglobin: {
    name: "Hemoglobin",
    usUnit: "g/dL",
    caUnit: "g/L",
    conversionFactor: 10,
    usReference: "12-16 g/dL (F), 14-18 g/dL (M)",
    caReference: "120-160 g/L (F), 140-180 g/L (M)",
  },
  inr: {
    name: "INR",
    usUnit: "ratio",
    caUnit: "ratio",
    conversionFactor: 1,
    usReference: "0.8-1.2 (therapeutic 2.0-3.0)",
    caReference: "0.8-1.2 (therapeutic 2.0-3.0)",
  },
};

export function convertLabValue(value: number, labKey: string, toRegion: Region): { value: number; unit: string } {
  const conv = LAB_CONVERSIONS[labKey];
  if (!conv) return { value, unit: "" };
  if (toRegion === "CA") {
    return { value: Math.round(value * conv.conversionFactor * 100) / 100, unit: conv.caUnit };
  }
  return { value, unit: conv.usUnit };
}

export function getLabReference(labKey: string, region: Region): string {
  const conv = LAB_CONVERSIONS[labKey];
  if (!conv) return "";
  return region === "CA" ? conv.caReference : conv.usReference;
}

export function getLabUnit(labKey: string, region: Region): string {
  const conv = LAB_CONVERSIONS[labKey];
  if (!conv) return "";
  return region === "CA" ? conv.caUnit : conv.usUnit;
}

const PHARMACY_TECH_US_LEGAL: LegalModule[] = [
  { id: "dea", name: "DEA Regulations", description: "Drug Enforcement Administration schedules, registration, and controlled substance requirements" },
  { id: "dscsa", name: "DSCSA Compliance", description: "Drug Supply Chain Security Act track-and-trace requirements" },
  { id: "hipaa", name: "HIPAA Privacy", description: "Health Insurance Portability and Accountability Act patient privacy regulations" },
  { id: "usp795", name: "USP <795>", description: "Non-sterile compounding standards and beyond-use dating" },
  { id: "usp797", name: "USP <797>", description: "Sterile compounding standards, cleanroom requirements, and personnel training" },
  { id: "usp800", name: "USP <800>", description: "Hazardous drug handling and safety requirements" },
  { id: "obra90", name: "OBRA-90", description: "Omnibus Budget Reconciliation Act counseling and DUR requirements" },
  { id: "fdca", name: "FD&C Act", description: "Federal Food, Drug, and Cosmetic Act drug approval and labeling" },
];

const PHARMACY_TECH_CA_LEGAL: LegalModule[] = [
  { id: "napra", name: "NAPRA Standards", description: "National Association of Pharmacy Regulatory Authorities competency standards" },
  { id: "cdsa", name: "CDSA", description: "Controlled Drugs and Substances Act scheduling and documentation" },
  { id: "pipeda", name: "PIPEDA", description: "Personal Information Protection and Electronic Documents Act privacy requirements" },
  { id: "provincial-boards", name: "Provincial Pharmacy Boards", description: "Province-specific pharmacy technician regulation and licensing" },
  { id: "napra-model", name: "NAPRA Model Standards", description: "Model standards for pharmacy compounding of non-sterile and sterile preparations" },
  { id: "food-drug-act", name: "Food and Drugs Act", description: "Federal drug scheduling, labeling, and safety requirements" },
  { id: "narcotic-control", name: "Narcotic Control Regulations", description: "Federal narcotic prescribing, dispensing, and record-keeping" },
  { id: "pharm-tech-regulation", name: "Provincial Technician Regulation", description: "Province-specific scope of practice and delegation frameworks" },
];

const RRT_US_LEGAL: LegalModule[] = [
  { id: "aarc-scope", name: "AARC Scope of Practice", description: "American Association for Respiratory Care practice guidelines" },
  { id: "hipaa-rt", name: "HIPAA Compliance", description: "Patient privacy and documentation requirements for respiratory therapists" },
  { id: "cms-regulations", name: "CMS Regulations", description: "Centers for Medicare and Medicaid Services respiratory care requirements" },
  { id: "tjc-standards", name: "TJC Standards", description: "The Joint Commission accreditation standards for respiratory care" },
];

const RRT_CA_LEGAL: LegalModule[] = [
  { id: "csrt", name: "CSRT Standards", description: "Canadian Society of Respiratory Therapists national standards" },
  { id: "provincial-rt", name: "Provincial RT Regulation", description: "Province-specific respiratory therapy licensing and scope" },
  { id: "pipeda-rt", name: "PIPEDA Compliance", description: "Privacy regulations applicable to respiratory care documentation" },
  { id: "medical-devices", name: "Medical Devices Regulations", description: "Health Canada medical device safety and reporting requirements" },
];

const PARAMEDIC_US_LEGAL: LegalModule[] = [
  { id: "nremt-scope", name: "NREMT Scope", description: "National Registry of Emergency Medical Technicians certification levels" },
  { id: "emtala", name: "EMTALA", description: "Emergency Medical Treatment and Active Labor Act patient rights" },
  { id: "hipaa-ems", name: "HIPAA in EMS", description: "Patient confidentiality in prehospital care settings" },
  { id: "state-protocols", name: "State Protocols", description: "State-specific medical direction and standing orders" },
];

const PARAMEDIC_CA_LEGAL: LegalModule[] = [
  { id: "provincial-directives", name: "Provincial Medical Directives", description: "Province-specific paramedic medical directives and delegation" },
  { id: "base-hospital", name: "Base Hospital Programs", description: "Medical oversight and online/offline medical direction" },
  { id: "phipa", name: "PHIPA/PIPEDA", description: "Provincial and federal patient health information privacy" },
  { id: "pac-competencies", name: "PAC Competencies", description: "Paramedic Association of Canada national competency profile" },
];

const IMAGING_US_LEGAL: LegalModule[] = [
  { id: "arrt-ethics", name: "ARRT Ethics", description: "American Registry of Radiologic Technologists Standards of Ethics" },
  { id: "nrc-regulations", name: "NRC Regulations", description: "Nuclear Regulatory Commission radiation safety standards" },
  { id: "hipaa-imaging", name: "HIPAA in Imaging", description: "Patient privacy in diagnostic imaging departments" },
  { id: "mqsa", name: "MQSA", description: "Mammography Quality Standards Act requirements" },
  { id: "state-licensure", name: "State Licensure", description: "State-specific radiologic technologist licensing requirements" },
];

const IMAGING_CA_LEGAL: LegalModule[] = [
  { id: "camrt", name: "CAMRT Standards", description: "Canadian Association of Medical Radiation Technologists practice standards" },
  { id: "cnsc", name: "CNSC Regulations", description: "Canadian Nuclear Safety Commission radiation protection requirements" },
  { id: "provincial-imaging", name: "Provincial Registration", description: "Province-specific radiation technologist licensing" },
  { id: "pipeda-imaging", name: "PIPEDA in Imaging", description: "Privacy requirements for medical imaging records" },
];

const MLT_US_LEGAL: LegalModule[] = [
  { id: "clia", name: "CLIA Regulations", description: "Clinical Laboratory Improvement Amendments quality standards" },
  { id: "cap-accreditation", name: "CAP Accreditation", description: "College of American Pathologists laboratory accreditation" },
  { id: "osha-lab", name: "OSHA Lab Safety", description: "Occupational Safety and Health Administration laboratory standards" },
  { id: "hipaa-lab", name: "HIPAA in Lab", description: "Patient privacy in laboratory settings" },
];

const MLT_CA_LEGAL: LegalModule[] = [
  { id: "csmls", name: "CSMLS Standards", description: "Canadian Society for Medical Laboratory Science competency standards" },
  { id: "provincial-mlt", name: "Provincial MLT Regulation", description: "Province-specific medical laboratory technologist licensing" },
  { id: "pipeda-lab", name: "PIPEDA in Lab", description: "Privacy regulations for laboratory data and results" },
  { id: "accreditation-canada", name: "Accreditation Canada", description: "National laboratory quality and safety standards" },
];

export const REGION_EXAM_CONFIGS: Record<string, Record<Region, RegionExamConfig>> = {
  pharmacyTech: {
    US: {
      examBoard: "PTCB",
      examName: "PTCE (Pharmacy Technician Certification Exam)",
      labValueSystem: "mg_dL",
      calculationSystem: "US_customary",
      legalModules: PHARMACY_TECH_US_LEGAL,
      compoundingStandard: "USP <795> / <797> / <800>",
      passThreshold: 70,
      domainMinimum: 60,
      scaledScoreMin: 1000,
      scaledScoreMax: 1600,
      scaledPassScore: 1400,
      totalQuestions: 90,
      timeLimit: 120,
      blueprintWeights: {
        "Medications": 40,
        "Federal Requirements": 12.5,
        "Patient Safety & Quality Assurance": 26.25,
        "Order Entry & Processing": 21.25,
      },
    },
    CA: {
      examBoard: "PEBC / Provincial Boards",
      examName: "PEBC Qualifying Examination for Pharmacy Technicians",
      labValueSystem: "mmol_L",
      calculationSystem: "metric",
      legalModules: PHARMACY_TECH_CA_LEGAL,
      compoundingStandard: "NAPRA Model Standards",
      passThreshold: 70,
      domainMinimum: 60,
      scaledScoreMin: 0,
      scaledScoreMax: 100,
      scaledPassScore: 70,
      totalQuestions: 100,
      timeLimit: 130,
      blueprintWeights: {
        "Product Distribution": 35,
        "Pharmacy Practice": 30,
        "Pharmaceutical Compounding": 15,
        "Professional Practice": 20,
      },
    },
  },
  rrt: {
    US: {
      examBoard: "NBRC",
      examName: "TMC (Therapist Multiple-Choice) Examination",
      labValueSystem: "mg_dL",
      calculationSystem: "US_customary",
      legalModules: RRT_US_LEGAL,
      compoundingStandard: "N/A",
      passThreshold: 68,
      domainMinimum: 60,
      scaledScoreMin: 0,
      scaledScoreMax: 200,
      scaledPassScore: 130,
      totalQuestions: 160,
      timeLimit: 180,
      blueprintWeights: {
        "Patient Data Evaluation & Recommendations": 30,
        "Troubleshooting & Quality Control": 20,
        "Initiation & Modification of Interventions": 50,
      },
    },
    CA: {
      examBoard: "CSRT / Provincial",
      examName: "CBRC National Examination",
      labValueSystem: "mmol_L",
      calculationSystem: "metric",
      legalModules: RRT_CA_LEGAL,
      compoundingStandard: "N/A",
      passThreshold: 65,
      domainMinimum: 55,
      scaledScoreMin: 0,
      scaledScoreMax: 100,
      scaledPassScore: 65,
      totalQuestions: 150,
      timeLimit: 180,
      blueprintWeights: {
        "Patient Assessment": 30,
        "Therapeutic Interventions": 35,
        "Equipment & Diagnostics": 20,
        "Professional Practice": 15,
      },
    },
  },
  paramedic: {
    US: {
      examBoard: "NREMT",
      examName: "NREMT Paramedic Certification",
      labValueSystem: "mg_dL",
      calculationSystem: "US_customary",
      legalModules: PARAMEDIC_US_LEGAL,
      compoundingStandard: "N/A",
      passThreshold: 70,
      domainMinimum: 65,
      scaledScoreMin: 0,
      scaledScoreMax: 100,
      scaledPassScore: 70,
      totalQuestions: 120,
      timeLimit: 150,
      blueprintWeights: {
        "Airway, Respiration & Ventilation": 18,
        "Cardiology & Resuscitation": 20,
        "Trauma": 17,
        "Medical/OB/GYN": 18,
        "EMS Operations": 12,
        "Pharmacology": 15,
      },
    },
    CA: {
      examBoard: "Provincial / PAC",
      examName: "Provincial Paramedic Certification",
      labValueSystem: "mmol_L",
      calculationSystem: "metric",
      legalModules: PARAMEDIC_CA_LEGAL,
      compoundingStandard: "N/A",
      passThreshold: 65,
      domainMinimum: 60,
      scaledScoreMin: 0,
      scaledScoreMax: 100,
      scaledPassScore: 65,
      totalQuestions: 120,
      timeLimit: 150,
      blueprintWeights: {
        "Patient Assessment": 25,
        "Patient Management": 30,
        "Clinical Decision Making": 20,
        "Professional Practice": 10,
        "Health & Safety": 15,
      },
    },
  },
  mlt: {
    US: {
      examBoard: "ASCP",
      examName: "ASCP Board of Certification MLS/MLT Examination",
      labValueSystem: "mg_dL",
      calculationSystem: "US_customary",
      legalModules: MLT_US_LEGAL,
      compoundingStandard: "N/A",
      passThreshold: 70,
      domainMinimum: 60,
      scaledScoreMin: 0,
      scaledScoreMax: 999,
      scaledPassScore: 400,
      totalQuestions: 100,
      timeLimit: 150,
      blueprintWeights: {
        "Hematology": 25,
        "Clinical Chemistry": 25,
        "Microbiology": 20,
        "Immunohematology / Blood Banking": 15,
        "Urinalysis & Body Fluids": 10,
        "Laboratory Operations": 5,
      },
    },
    CA: {
      examBoard: "CSMLS",
      examName: "CSMLS National Certification Examination",
      labValueSystem: "mmol_L",
      calculationSystem: "metric",
      legalModules: MLT_CA_LEGAL,
      compoundingStandard: "N/A",
      passThreshold: 65,
      domainMinimum: 55,
      scaledScoreMin: 0,
      scaledScoreMax: 100,
      scaledPassScore: 65,
      totalQuestions: 120,
      timeLimit: 180,
      blueprintWeights: {
        "Hematology & Coagulation": 25,
        "Clinical Chemistry": 20,
        "Microbiology": 20,
        "Transfusion Science": 15,
        "Histotechnology": 10,
        "Quality Management": 10,
      },
    },
  },
  imaging: {
    US: {
      examBoard: "ARRT",
      examName: "ARRT Radiography Certification",
      labValueSystem: "mg_dL",
      calculationSystem: "US_customary",
      legalModules: IMAGING_US_LEGAL,
      compoundingStandard: "N/A",
      passThreshold: 70,
      domainMinimum: 65,
      scaledScoreMin: 0,
      scaledScoreMax: 99,
      scaledPassScore: 75,
      totalQuestions: 200,
      timeLimit: 210,
      blueprintWeights: {
        "Image Production": 30,
        "Procedures": 30,
        "Patient Care & Education": 20,
        "Radiation Protection": 15,
        "Equipment Operation & Quality Control": 5,
      },
    },
    CA: {
      examBoard: "CAMRT",
      examName: "CAMRT National Certification Examination",
      labValueSystem: "mmol_L",
      calculationSystem: "metric",
      legalModules: IMAGING_CA_LEGAL,
      compoundingStandard: "N/A",
      passThreshold: 65,
      domainMinimum: 55,
      scaledScoreMin: 0,
      scaledScoreMax: 100,
      scaledPassScore: 65,
      totalQuestions: 180,
      timeLimit: 210,
      blueprintWeights: {
        "Radiographic Imaging": 30,
        "Clinical Procedures": 25,
        "Patient Care": 20,
        "Radiation Safety": 15,
        "Professional Practice": 10,
      },
    },
  },
};

export function getRegionConfig(careerSlug: string, region: Region): RegionExamConfig | null {
  const careerMap: Record<string, string> = {
    "pharmacy-tech": "pharmacyTech",
    "rrt": "rrt",
    "paramedic": "paramedic",
    "mlt": "mlt",
    "imaging": "imaging",
  };
  const key = careerMap[careerSlug] || careerSlug;
  return REGION_EXAM_CONFIGS[key]?.[region] || null;
}

export function getRegionLabel(region: Region): string {
  return region === "US" ? "United States" : "Canada";
}

export function getRegionFlag(region: Region): string {
  return region === "US" ? "US" : "CA";
}
