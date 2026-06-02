export type Region = "CA" | "US" | "UK" | "AU" | "PH" | "IN" | "INTL";

interface ExamConstants {
  practicalNurse: {
    designation: string;
    examName: string;
  };
  registeredNurse: {
    designation: string;
    examName: string;
  };
  nursePractitioner: {
    designation: string;
    examName: string;
  };
  designations: string[];
}

const REGION_CONSTANTS: Record<Region, ExamConstants> = {
  CA: {
    practicalNurse: { designation: "RPN", examName: "REx-PN" },
    registeredNurse: { designation: "RN", examName: "NCLEX-RN" },
    nursePractitioner: { designation: "NP", examName: "NP Exam" },
    designations: ["RPN", "RN", "NP"],
  },
  US: {
    practicalNurse: { designation: "LPN", examName: "NCLEX-PN" },
    registeredNurse: { designation: "RN", examName: "NCLEX-RN" },
    nursePractitioner: { designation: "NP", examName: "NP Exam" },
    designations: ["LPN", "RN", "NP"],
  },
  UK: {
    practicalNurse: { designation: "EN", examName: "NMC CBT" },
    registeredNurse: { designation: "RN", examName: "NMC OSCE" },
    nursePractitioner: { designation: "ANP", examName: "ANP Exam" },
    designations: ["EN", "RN", "ANP"],
  },
  AU: {
    practicalNurse: { designation: "EN", examName: "NMBA Exam" },
    registeredNurse: { designation: "RN", examName: "NMBA RN" },
    nursePractitioner: { designation: "NP", examName: "NP Exam" },
    designations: ["EN", "RN", "NP"],
  },
  PH: {
    practicalNurse: { designation: "RPN", examName: "NLE" },
    registeredNurse: { designation: "RN", examName: "NLE" },
    nursePractitioner: { designation: "NP", examName: "NP Exam" },
    designations: ["RPN", "RN", "NP"],
  },
  IN: {
    practicalNurse: { designation: "ANM", examName: "INC Exam" },
    registeredNurse: { designation: "RN", examName: "INC Exam" },
    nursePractitioner: { designation: "NP", examName: "NP Exam" },
    designations: ["ANM", "RN", "NP"],
  },
  INTL: {
    practicalNurse: { designation: "LPN", examName: "NCLEX-PN" },
    registeredNurse: { designation: "RN", examName: "NCLEX-RN" },
    nursePractitioner: { designation: "NP", examName: "NP Exam" },
    designations: ["LPN", "RN", "NP"],
  },
};

export function getExamConstants(region: Region | string): ExamConstants {
  return REGION_CONSTANTS[region as Region] || REGION_CONSTANTS.CA;
}

export function getPracticalNurseExamName(region: Region | string): string {
  const constants = getExamConstants(region);
  return constants.practicalNurse.examName;
}

export function getExamNameForTier(tier: string, region?: Region | string): string {
  const constants = getExamConstants(region || "CA");
  switch (tier) {
    case "rpn":
    case "lpn":
      return constants.practicalNurse.examName;
    case "rn":
      return constants.registeredNurse.examName;
    case "np":
      return constants.nursePractitioner.examName;
    default:
      return constants.practicalNurse.examName;
  }
}
