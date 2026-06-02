export interface CountryAdaptation {
  countryCode: string;
  countryName: string;
  labUnitSystem: "SI" | "conventional" | "both";
  temperatureUnit: "C" | "F";
  weightUnit: "kg" | "lbs";
  medicationNaming: "generic-international" | "generic-us" | "brand-preferred";
  licensingBodies: string[];
  examTypes: string[];
  labReferenceRanges: Record<string, { unit: string; normalRange: string }>;
  regulatoryNotes: string;
}

export const COUNTRY_ADAPTATIONS: Record<string, CountryAdaptation> = {
  CA: {
    countryCode: "CA",
    countryName: "Canada",
    labUnitSystem: "SI",
    temperatureUnit: "C",
    weightUnit: "kg",
    medicationNaming: "generic-international",
    licensingBodies: [
      "NNAS",
      "CNO",
      "BCCNM",
      "CRPNM",
      "NANB",
      "CRNNS",
      "CLPNNS",
    ],
    examTypes: [
      "REx-PN",
      "NCLEX-RN",
      "NP-Certification",
    ],
    labReferenceRanges: {
      glucose: { unit: "mmol/L", normalRange: "3.9-5.5" },
      sodium: { unit: "mmol/L", normalRange: "136-145" },
      potassium: { unit: "mmol/L", normalRange: "3.5-5.0" },
      creatinine: { unit: "umol/L", normalRange: "44-97" },
      hemoglobin: { unit: "g/L", normalRange: "120-160" },
      hematocrit: { unit: "L/L", normalRange: "0.36-0.44" },
      platelets: { unit: "x10^9/L", normalRange: "150-400" },
      wbc: { unit: "x10^9/L", normalRange: "4.5-11.0" },
      bilirubin: { unit: "umol/L", normalRange: "3.4-17.1" },
      albumin: { unit: "g/L", normalRange: "35-50" },
      calcium: { unit: "mmol/L", normalRange: "2.12-2.62" },
      magnesium: { unit: "mmol/L", normalRange: "0.65-1.05" },
      phosphate: { unit: "mmol/L", normalRange: "0.81-1.45" },
      bun: { unit: "mmol/L", normalRange: "2.5-7.1" },
      inr: { unit: "ratio", normalRange: "0.8-1.2" },
      ptt: { unit: "seconds", normalRange: "25-35" },
    },
    regulatoryNotes: "Regulated by provincial nursing colleges. REx-PN replaced CPNRE in 2022. NCLEX-RN adopted nationally in 2015.",
  },
  US: {
    countryCode: "US",
    countryName: "United States",
    labUnitSystem: "conventional",
    temperatureUnit: "F",
    weightUnit: "lbs",
    medicationNaming: "generic-us",
    licensingBodies: [
      "NCSBN",
      "State Boards of Nursing",
    ],
    examTypes: [
      "NCLEX-PN",
      "NCLEX-RN",
      "ANCC-NP",
      "AANP-NP",
    ],
    labReferenceRanges: {
      glucose: { unit: "mg/dL", normalRange: "70-100" },
      sodium: { unit: "mEq/L", normalRange: "136-145" },
      potassium: { unit: "mEq/L", normalRange: "3.5-5.0" },
      creatinine: { unit: "mg/dL", normalRange: "0.5-1.1" },
      hemoglobin: { unit: "g/dL", normalRange: "12-16" },
      hematocrit: { unit: "%", normalRange: "36-44" },
      platelets: { unit: "x10^3/uL", normalRange: "150-400" },
      wbc: { unit: "x10^3/uL", normalRange: "4.5-11.0" },
      bilirubin: { unit: "mg/dL", normalRange: "0.2-1.0" },
      albumin: { unit: "g/dL", normalRange: "3.5-5.0" },
      calcium: { unit: "mg/dL", normalRange: "8.5-10.5" },
      magnesium: { unit: "mg/dL", normalRange: "1.6-2.6" },
      phosphate: { unit: "mg/dL", normalRange: "2.5-4.5" },
      bun: { unit: "mg/dL", normalRange: "7-20" },
      inr: { unit: "ratio", normalRange: "0.8-1.2" },
      ptt: { unit: "seconds", normalRange: "25-35" },
    },
    regulatoryNotes: "Regulated by state boards of nursing under NCSBN. NCLEX is the national licensure exam.",
  },
  GB: {
    countryCode: "GB",
    countryName: "United Kingdom",
    labUnitSystem: "SI",
    temperatureUnit: "C",
    weightUnit: "kg",
    medicationNaming: "generic-international",
    licensingBodies: [
      "NMC",
    ],
    examTypes: [
      "NMC-CBT",
      "NMC-OSCE",
    ],
    labReferenceRanges: {
      glucose: { unit: "mmol/L", normalRange: "3.9-5.5" },
      sodium: { unit: "mmol/L", normalRange: "136-145" },
      potassium: { unit: "mmol/L", normalRange: "3.5-5.0" },
      creatinine: { unit: "umol/L", normalRange: "44-97" },
      hemoglobin: { unit: "g/L", normalRange: "120-160" },
      hematocrit: { unit: "L/L", normalRange: "0.36-0.44" },
      platelets: { unit: "x10^9/L", normalRange: "150-400" },
      wbc: { unit: "x10^9/L", normalRange: "4.5-11.0" },
      bilirubin: { unit: "umol/L", normalRange: "3.4-17.1" },
      albumin: { unit: "g/L", normalRange: "35-50" },
      calcium: { unit: "mmol/L", normalRange: "2.12-2.62" },
      magnesium: { unit: "mmol/L", normalRange: "0.65-1.05" },
      phosphate: { unit: "mmol/L", normalRange: "0.81-1.45" },
      bun: { unit: "mmol/L", normalRange: "2.5-7.1" },
      inr: { unit: "ratio", normalRange: "0.8-1.2" },
      ptt: { unit: "seconds", normalRange: "25-35" },
    },
    regulatoryNotes: "Regulated by the Nursing and Midwifery Council (NMC). International nurses must pass CBT and OSCE.",
  },
  AU: {
    countryCode: "AU",
    countryName: "Australia",
    labUnitSystem: "SI",
    temperatureUnit: "C",
    weightUnit: "kg",
    medicationNaming: "generic-international",
    licensingBodies: [
      "NMBA",
      "AHPRA",
    ],
    examTypes: [
      "NMBA-Registration",
    ],
    labReferenceRanges: {
      glucose: { unit: "mmol/L", normalRange: "3.9-5.5" },
      sodium: { unit: "mmol/L", normalRange: "136-145" },
      potassium: { unit: "mmol/L", normalRange: "3.5-5.0" },
      creatinine: { unit: "umol/L", normalRange: "44-97" },
      hemoglobin: { unit: "g/L", normalRange: "120-160" },
      hematocrit: { unit: "L/L", normalRange: "0.36-0.44" },
      platelets: { unit: "x10^9/L", normalRange: "150-400" },
      wbc: { unit: "x10^9/L", normalRange: "4.5-11.0" },
      bilirubin: { unit: "umol/L", normalRange: "3.4-17.1" },
      albumin: { unit: "g/L", normalRange: "35-50" },
      calcium: { unit: "mmol/L", normalRange: "2.12-2.62" },
      magnesium: { unit: "mmol/L", normalRange: "0.65-1.05" },
      phosphate: { unit: "mmol/L", normalRange: "0.81-1.45" },
      bun: { unit: "mmol/L", normalRange: "2.5-7.1" },
      inr: { unit: "ratio", normalRange: "0.8-1.2" },
      ptt: { unit: "seconds", normalRange: "25-35" },
    },
    regulatoryNotes: "Regulated by AHPRA and the Nursing and Midwifery Board of Australia (NMBA).",
  },
};

export function getCountryAdaptation(countryCode: string): CountryAdaptation | undefined {
  return COUNTRY_ADAPTATIONS[countryCode.toUpperCase()];
}

export function getLabReference(countryCode: string, labTest: string): { unit: string; normalRange: string } | undefined {
  const adaptation = getCountryAdaptation(countryCode);
  if (!adaptation) return undefined;
  return adaptation.labReferenceRanges[labTest.toLowerCase()];
}

export function getMedicationNamingConvention(countryCode: string): string {
  const adaptation = getCountryAdaptation(countryCode);
  return adaptation?.medicationNaming || "generic-international";
}

export function getLicensingBodies(countryCode: string): string[] {
  const adaptation = getCountryAdaptation(countryCode);
  return adaptation?.licensingBodies || [];
}

export function getSupportedCountryCodes(): string[] {
  return Object.keys(COUNTRY_ADAPTATIONS);
}
