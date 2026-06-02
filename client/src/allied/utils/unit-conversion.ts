import type { ParamedicRegion } from "../contexts/paramedic-region-context";

interface ConversionFactor {
  name: string;
  siUnit: string;
  usUnit: string;
  factor: number;
}

const LAB_CONVERSIONS: Record<string, ConversionFactor> = {
  glucose: { name: "Glucose", siUnit: "mmol/L", usUnit: "mg/dL", factor: 18.0182 },
  cholesterol: { name: "Cholesterol", siUnit: "mmol/L", usUnit: "mg/dL", factor: 38.67 },
  triglycerides: { name: "Triglycerides", siUnit: "mmol/L", usUnit: "mg/dL", factor: 88.57 },
  creatinine: { name: "Creatinine", siUnit: "µmol/L", usUnit: "mg/dL", factor: 88.42 },
  bilirubin: { name: "Bilirubin", siUnit: "µmol/L", usUnit: "mg/dL", factor: 17.1 },
  bun: { name: "BUN", siUnit: "mmol/L", usUnit: "mg/dL", factor: 2.801 },
  calcium: { name: "Calcium", siUnit: "mmol/L", usUnit: "mg/dL", factor: 4.008 },
  uricAcid: { name: "Uric Acid", siUnit: "µmol/L", usUnit: "mg/dL", factor: 59.48 },
  hemoglobin: { name: "Hemoglobin", siUnit: "g/L", usUnit: "g/dL", factor: 10 },
};

export function convertLabValue(
  analyte: string,
  value: number,
  targetRegion: ParamedicRegion
): { value: number; unit: string } {
  const conv = LAB_CONVERSIONS[analyte];
  if (!conv) return { value, unit: "" };

  if (targetRegion === "CA") {
    return { value: Math.round((value / conv.factor) * 100) / 100, unit: conv.siUnit };
  }
  return { value: Math.round(value * conv.factor * 100) / 100, unit: conv.usUnit };
}

export function formatLabValue(
  analyte: string,
  siValue: number,
  region: ParamedicRegion
): string {
  const conv = LAB_CONVERSIONS[analyte];
  if (!conv) return `${siValue}`;

  if (region === "CA") {
    return `${siValue} ${conv.siUnit}`;
  }
  const usValue = Math.round(siValue * conv.factor * 100) / 100;
  return `${usValue} ${conv.usUnit}`;
}

export function getLabUnit(analyte: string, region: ParamedicRegion): string {
  const conv = LAB_CONVERSIONS[analyte];
  if (!conv) return "";
  return region === "CA" ? conv.siUnit : conv.usUnit;
}

export type RegionScope = "CA" | "US" | "BOTH";

export function isQuestionVisibleForRegion(
  questionRegionScope: RegionScope | undefined,
  currentRegion: ParamedicRegion
): boolean {
  if (!questionRegionScope || questionRegionScope === "BOTH") return true;
  return questionRegionScope === currentRegion;
}
