export interface ConversionEntry {
  id: string;
  name: string;
  category: "blood-chemistry" | "lipids" | "hematology" | "physical" | "other";
  siUnit: string;
  conventionalUnit: string;
  factor: number;
  formula?: string;
  siNormalRange?: string;
  conventionalNormalRange?: string;
  notes?: string;
}

export const conversionEntries: ConversionEntry[] = [
  {
    id: "glucose",
    name: "Glucose",
    category: "blood-chemistry",
    siUnit: "mmol/L",
    conventionalUnit: "mg/dL",
    factor: 18.0182,
    siNormalRange: "3.9–5.5",
    conventionalNormalRange: "70–100",
    notes: "Fasting plasma glucose. Critical values: <2.2 mmol/L (<40 mg/dL) or >27.8 mmol/L (>500 mg/dL).",
  },
  {
    id: "creatinine",
    name: "Creatinine",
    category: "blood-chemistry",
    siUnit: "µmol/L",
    conventionalUnit: "mg/dL",
    factor: 0.01131,
    siNormalRange: "62–106",
    conventionalNormalRange: "0.7–1.2",
    notes: "Serum creatinine. 1 mg/dL = 88.42 µmol/L. Higher values may be normal in muscular individuals.",
  },
  {
    id: "urea-bun",
    name: "Urea / BUN",
    category: "blood-chemistry",
    siUnit: "mmol/L",
    conventionalUnit: "mg/dL",
    factor: 0.357,
    formula: "BUN (mg/dL) = Urea (mmol/L) × 2.801; Urea (mmol/L) = BUN (mg/dL) × 0.357",
    siNormalRange: "2.5–7.1",
    conventionalNormalRange: "7–20",
    notes: "SI measures urea; conventional measures blood urea nitrogen (BUN). The conversion is NOT a simple multiplication — molecular weight difference matters.",
  },
  {
    id: "calcium",
    name: "Calcium (Total)",
    category: "blood-chemistry",
    siUnit: "mmol/L",
    conventionalUnit: "mg/dL",
    factor: 4.0,
    siNormalRange: "2.12–2.62",
    conventionalNormalRange: "8.5–10.5",
    notes: "Total serum calcium. Always consider albumin levels — corrected calcium = measured Ca + 0.8 × (4.0 − albumin).",
  },
  {
    id: "bilirubin",
    name: "Bilirubin (Total)",
    category: "blood-chemistry",
    siUnit: "µmol/L",
    conventionalUnit: "mg/dL",
    factor: 0.05848,
    siNormalRange: "3.4–20.5",
    conventionalNormalRange: "0.2–1.2",
    notes: "Total bilirubin. 1 mg/dL = 17.1 µmol/L. Neonatal jaundice thresholds vary by age in hours.",
  },
  {
    id: "hemoglobin",
    name: "Hemoglobin",
    category: "hematology",
    siUnit: "g/L",
    conventionalUnit: "g/dL",
    factor: 0.1,
    siNormalRange: "120–160 (F), 140–180 (M)",
    conventionalNormalRange: "12.0–16.0 (F), 14.0–18.0 (M)",
    notes: "Hemoglobin concentration. 1 g/dL = 10 g/L. Transfusion typically considered at <70 g/L (<7 g/dL) in stable patients.",
  },
  {
    id: "cholesterol-total",
    name: "Cholesterol (Total)",
    category: "lipids",
    siUnit: "mmol/L",
    conventionalUnit: "mg/dL",
    factor: 38.67,
    siNormalRange: "<5.2",
    conventionalNormalRange: "<200",
    notes: "Desirable total cholesterol level.",
  },
  {
    id: "cholesterol-ldl",
    name: "LDL Cholesterol",
    category: "lipids",
    siUnit: "mmol/L",
    conventionalUnit: "mg/dL",
    factor: 38.67,
    siNormalRange: "<2.6",
    conventionalNormalRange: "<100",
    notes: "Optimal LDL. Target may be lower (<1.8 mmol/L / <70 mg/dL) for high-risk cardiovascular patients.",
  },
  {
    id: "cholesterol-hdl",
    name: "HDL Cholesterol",
    category: "lipids",
    siUnit: "mmol/L",
    conventionalUnit: "mg/dL",
    factor: 38.67,
    siNormalRange: ">1.0 (M), >1.3 (F)",
    conventionalNormalRange: ">40 (M), >50 (F)",
    notes: "Higher HDL is protective against cardiovascular disease.",
  },
  {
    id: "triglycerides",
    name: "Triglycerides",
    category: "lipids",
    siUnit: "mmol/L",
    conventionalUnit: "mg/dL",
    factor: 88.57,
    siNormalRange: "<1.7",
    conventionalNormalRange: "<150",
    notes: "Fasting triglycerides. Very high values (>11.3 mmol/L / >1000 mg/dL) risk pancreatitis.",
  },
  {
    id: "lactate",
    name: "Lactate",
    category: "blood-chemistry",
    siUnit: "mmol/L",
    conventionalUnit: "mg/dL",
    factor: 9.01,
    siNormalRange: "0.5–2.0",
    conventionalNormalRange: "4.5–18.0",
    notes: "Arterial or venous lactate. Elevated in sepsis, shock, and tissue hypoperfusion. Note: SI and conventional both use mmol/L in some labs.",
  },
  {
    id: "phosphate",
    name: "Phosphate (Inorganic)",
    category: "blood-chemistry",
    siUnit: "mmol/L",
    conventionalUnit: "mg/dL",
    factor: 3.097,
    siNormalRange: "0.81–1.45",
    conventionalNormalRange: "2.5–4.5",
    notes: "Serum phosphorus. Inversely related to calcium levels.",
  },
  {
    id: "magnesium",
    name: "Magnesium",
    category: "blood-chemistry",
    siUnit: "mmol/L",
    conventionalUnit: "mg/dL",
    factor: 2.431,
    siNormalRange: "0.75–1.0",
    conventionalNormalRange: "1.8–2.4",
    notes: "Serum magnesium. Low levels can cause cardiac arrhythmias and exacerbate hypokalemia.",
  },
  {
    id: "weight",
    name: "Weight (kg ↔ lb)",
    category: "physical",
    siUnit: "kg",
    conventionalUnit: "lb",
    factor: 2.2046,
    notes: "1 kg = 2.2046 lb. Critical for weight-based medication dosing.",
  },
  {
    id: "height",
    name: "Height (cm ↔ in)",
    category: "physical",
    siUnit: "cm",
    conventionalUnit: "in",
    factor: 0.3937,
    notes: "1 cm = 0.3937 in. Used for BSA and BMI calculations.",
  },
  {
    id: "temperature",
    name: "Temperature",
    category: "physical",
    siUnit: "°C",
    conventionalUnit: "°F",
    factor: 0,
    formula: "°F = (°C × 9/5) + 32; °C = (°F − 32) × 5/9",
    siNormalRange: "36.1–37.2",
    conventionalNormalRange: "97.0–99.0",
    notes: "Fever threshold: ≥38.0°C (100.4°F). Hypothermia: <35.0°C (95.0°F).",
  },
  {
    id: "volume-dosing",
    name: "Volume (mL ↔ tsp/tbsp)",
    category: "other",
    siUnit: "mL",
    conventionalUnit: "tsp",
    factor: 0.2029,
    formula: "1 tsp = 5 mL; 1 tbsp = 15 mL; 1 oz = 30 mL",
    notes: "Standard household-to-metric conversions used in medication administration and patient education.",
  },
];

export type ConversionDirection = "si-to-conv" | "conv-to-si";

export function convertValue(
  entry: ConversionEntry,
  value: number,
  direction: ConversionDirection
): number {
  if (entry.id === "temperature") {
    if (direction === "si-to-conv") {
      return (value * 9) / 5 + 32;
    } else {
      return ((value - 32) * 5) / 9;
    }
  }

  if (entry.id === "urea-bun") {
    if (direction === "si-to-conv") {
      return value * 2.801;
    } else {
      return value * 0.357;
    }
  }

  if (entry.id === "volume-dosing") {
    if (direction === "si-to-conv") {
      return value / 5;
    } else {
      return value * 5;
    }
  }

  if (direction === "si-to-conv") {
    return value * entry.factor;
  } else {
    return value / entry.factor;
  }
}

export function formatResult(value: number): { rounded: string; precise: string } {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return { rounded: "—", precise: "—" };
  }
  const rounded = value < 1 ? value.toFixed(2) : value < 100 ? value.toFixed(1) : Math.round(value).toString();
  const precise = value.toFixed(4);
  return { rounded, precise };
}

export const categoryLabels: Record<string, string> = {
  "blood-chemistry": "Blood Chemistry",
  "lipids": "Lipids / Cholesterol",
  "hematology": "Hematology",
  "physical": "Physical Measurements",
  "other": "Volume & Dosing",
};

export const quickReferenceEntries = [
  "glucose",
  "creatinine",
  "urea-bun",
  "hemoglobin",
  "bilirubin",
  "calcium",
  "cholesterol-total",
  "triglycerides",
  "weight",
  "temperature",
];
