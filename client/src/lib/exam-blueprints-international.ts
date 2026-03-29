export interface InternationalDomainWeight {
  domain: string;
  weightMin: number;
  weightMax: number;
}

export interface InternationalExamBlueprint {
  examKey: string;
  examName: string;
  countryCode: string;
  licensingBody: string;
  totalQuestionsRange: [number, number];
  timeLimitMinutes: number;
  examDeliveryType: "fixed" | "adaptive" | "sectional";
  scoringModel: "dichotomous" | "partialCredit" | "scaled";
  passingStandardModel: "cutScore" | "scaledScore" | "competencyBased";
  labUnitVariant: string;
  medicationNamingVariant: string;
  domainWeights: InternationalDomainWeight[];
  questionTypesAllowed: string[];
  clinicalConventions: {
    temperatureUnit: string;
    weightUnit: string;
    glucoseUnit: string;
    cholesterolUnit: string;
    hemoglobinUnit: string;
    sodiumUnit: string;
    regulatoryReferences: string[];
    commonDrugNames: Record<string, string>;
  };
}

export const INTERNATIONAL_EXAM_BLUEPRINTS: Record<string, InternationalExamBlueprint> = {
  NMC_CBT: {
    examKey: "NMC_CBT",
    examName: "NMC Computer-Based Test (UK)",
    countryCode: "GB",
    licensingBody: "NMC",
    totalQuestionsRange: [100, 120],
    timeLimitMinutes: 240,
    examDeliveryType: "fixed",
    scoringModel: "dichotomous",
    passingStandardModel: "cutScore",
    labUnitVariant: "SI",
    medicationNamingVariant: "BNF",
    domainWeights: [
      { domain: "Professional Values & Practice", weightMin: 0.20, weightMax: 0.30 },
      { domain: "Communication & Interpersonal Skills", weightMin: 0.15, weightMax: 0.25 },
      { domain: "Nursing Practice & Decision Making", weightMin: 0.30, weightMax: 0.40 },
      { domain: "Leadership, Management & Team Working", weightMin: 0.15, weightMax: 0.25 },
    ],
    questionTypesAllowed: [
      "MCQ_SINGLE",
      "MCQ_MULTIPLE",
      "CASE_BASED_CLUSTER",
      "PRIORITIZATION",
    ],
    clinicalConventions: {
      temperatureUnit: "°C",
      weightUnit: "kg",
      glucoseUnit: "mmol/L",
      cholesterolUnit: "mmol/L",
      hemoglobinUnit: "g/L",
      sodiumUnit: "mmol/L",
      regulatoryReferences: [
        "NMC Code of Professional Standards",
        "NICE Clinical Guidelines",
        "British National Formulary (BNF)",
        "NHS Constitution",
        "Mental Health Act 1983/2007",
        "Mental Capacity Act 2005",
        "Duty of Candour",
        "Safeguarding Adults & Children",
        "Care Quality Commission (CQC)",
      ],
      commonDrugNames: {
        "acetaminophen": "paracetamol",
        "epinephrine": "adrenaline",
        "norepinephrine": "noradrenaline",
        "albuterol": "salbutamol",
        "meperidine": "pethidine",
        "furosemide": "furosemide",
        "acetylcysteine": "acetylcysteine",
        "metoprolol": "metoprolol",
      },
    },
  },

  AHPRA_RN: {
    examKey: "AHPRA_RN",
    examName: "AHPRA Registered Nurse Assessment (Australia)",
    countryCode: "AU",
    licensingBody: "AHPRA",
    totalQuestionsRange: [120, 150],
    timeLimitMinutes: 210,
    examDeliveryType: "fixed",
    scoringModel: "dichotomous",
    passingStandardModel: "competencyBased",
    labUnitVariant: "SI",
    medicationNamingVariant: "Australian_Approved_Names",
    domainWeights: [
      { domain: "Professional Practice", weightMin: 0.15, weightMax: 0.25 },
      { domain: "Provision & Coordination of Care", weightMin: 0.30, weightMax: 0.40 },
      { domain: "Collaborative & Therapeutic Practice", weightMin: 0.20, weightMax: 0.30 },
      { domain: "Critical Thinking & Analysis", weightMin: 0.15, weightMax: 0.25 },
    ],
    questionTypesAllowed: [
      "MCQ_SINGLE",
      "MCQ_MULTIPLE",
      "CASE_BASED_CLUSTER",
      "PRIORITIZATION",
    ],
    clinicalConventions: {
      temperatureUnit: "°C",
      weightUnit: "kg",
      glucoseUnit: "mmol/L",
      cholesterolUnit: "mmol/L",
      hemoglobinUnit: "g/L",
      sodiumUnit: "mmol/L",
      regulatoryReferences: [
        "NMBA Registered Nurse Standards for Practice",
        "NMBA Code of Conduct for Nurses",
        "Australian Commission on Safety and Quality in Health Care",
        "Therapeutic Goods Administration (TGA)",
        "Pharmaceutical Benefits Scheme (PBS)",
        "Medicare Benefits Schedule (MBS)",
        "National Safety and Quality Health Service Standards",
        "Australian Health Practitioner Regulation Agency Guidelines",
      ],
      commonDrugNames: {
        "acetaminophen": "paracetamol",
        "epinephrine": "adrenaline",
        "norepinephrine": "noradrenaline",
        "albuterol": "salbutamol",
        "meperidine": "pethidine",
        "furosemide": "frusemide",
        "acetylcysteine": "acetylcysteine",
        "metoprolol": "metoprolol",
      },
    },
  },

  GULF_NURSING: {
    examKey: "GULF_NURSING",
    examName: "Gulf Region Nursing Exam (DHA/HAAD/MOH/SCFHS)",
    countryCode: "AE",
    licensingBody: "DHA/HAAD/MOH/SCFHS",
    totalQuestionsRange: [100, 200],
    timeLimitMinutes: 210,
    examDeliveryType: "fixed",
    scoringModel: "dichotomous",
    passingStandardModel: "cutScore",
    labUnitVariant: "conventional",
    medicationNamingVariant: "generic_international",
    domainWeights: [
      { domain: "Medical-Surgical Nursing", weightMin: 0.25, weightMax: 0.35 },
      { domain: "Pharmacology & Medication Administration", weightMin: 0.15, weightMax: 0.25 },
      { domain: "Maternal & Child Health", weightMin: 0.10, weightMax: 0.20 },
      { domain: "Mental Health Nursing", weightMin: 0.05, weightMax: 0.15 },
      { domain: "Community & Public Health", weightMin: 0.05, weightMax: 0.15 },
      { domain: "Nursing Management & Leadership", weightMin: 0.10, weightMax: 0.20 },
      { domain: "Patient Safety & Infection Control", weightMin: 0.10, weightMax: 0.20 },
    ],
    questionTypesAllowed: [
      "MCQ_SINGLE",
      "CASE_BASED_CLUSTER",
      "PRIORITIZATION",
    ],
    clinicalConventions: {
      temperatureUnit: "°C",
      weightUnit: "kg",
      glucoseUnit: "mg/dL",
      cholesterolUnit: "mg/dL",
      hemoglobinUnit: "g/dL",
      sodiumUnit: "mEq/L",
      regulatoryReferences: [
        "Dubai Health Authority (DHA) Standards",
        "Department of Health Abu Dhabi (DOH/HAAD)",
        "Saudi Commission for Health Specialties (SCFHS)",
        "Ministry of Health UAE (MOH)",
        "Qatar Council for Healthcare Practitioners (QCHP)",
        "DataFlow Group Primary Source Verification",
        "Joint Commission International (JCI) Standards",
        "WHO Patient Safety Guidelines",
      ],
      commonDrugNames: {
        "acetaminophen": "paracetamol",
        "epinephrine": "epinephrine/adrenaline",
        "norepinephrine": "norepinephrine/noradrenaline",
        "albuterol": "salbutamol",
        "meperidine": "pethidine",
        "furosemide": "furosemide",
        "acetylcysteine": "acetylcysteine",
        "metoprolol": "metoprolol",
      },
    },
  },
};

export function getInternationalBlueprintByExam(examKey: string): InternationalExamBlueprint | undefined {
  return INTERNATIONAL_EXAM_BLUEPRINTS[examKey];
}

export function getAllInternationalExamKeys(): string[] {
  return Object.keys(INTERNATIONAL_EXAM_BLUEPRINTS);
}
