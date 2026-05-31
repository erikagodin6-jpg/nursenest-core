export type SmartFormulaCategory = "medication_math" | "clinical";

export type SmartFormulaSubcategory =
  | "dosage_calculations"
  | "iv_rates"
  | "drip_factors"
  | "infusion_calculations"
  | "abg_interpretation"
  | "ecg_intervals"
  | "hemodynamic_values"
  | "lab_references";

export type SmartFormulaItem = {
  id: string;
  category: SmartFormulaCategory;
  subcategory: SmartFormulaSubcategory;
  title: string;
  formula: string;
  useWhen: string;
  steps: readonly string[];
  safetyNote: string;
  searchTerms: readonly string[];
};

export const SMART_FORMULA_CATEGORY_LABELS: Record<SmartFormulaCategory, string> = {
  medication_math: "Medication Math",
  clinical: "Clinical",
};

export const SMART_FORMULA_SUBCATEGORY_LABELS: Record<SmartFormulaSubcategory, string> = {
  dosage_calculations: "Dosage Calculations",
  iv_rates: "IV Rates",
  drip_factors: "Drip Factors",
  infusion_calculations: "Infusion Calculations",
  abg_interpretation: "ABG Interpretation",
  ecg_intervals: "ECG Intervals",
  hemodynamic_values: "Hemodynamic Values",
  lab_references: "Lab References",
};

export const SMART_FORMULA_ITEMS: readonly SmartFormulaItem[] = [
  {
    id: "dose-desired-over-have",
    category: "medication_math",
    subcategory: "dosage_calculations",
    title: "Oral / Injectable Dose",
    formula: "(Desired dose / Dose on hand) × Quantity = Amount to give",
    useWhen: "Use when the order and supply are in the same unit or can be safely converted to the same unit.",
    steps: ["Convert units first.", "Divide desired by available.", "Multiply by the quantity supplied."],
    safetyNote: "Do not round until the final step. Recheck high-alert medications against facility policy.",
    searchTerms: ["dose", "dosage", "desired over have", "tablet", "injection", "amount to give"],
  },
  {
    id: "weight-based-dose",
    category: "medication_math",
    subcategory: "dosage_calculations",
    title: "Weight-Based Dose",
    formula: "Dose = ordered mg/kg × weight in kg",
    useWhen: "Use for pediatric, heparin, antibiotic, and other weight-based medication orders.",
    steps: ["Convert pounds to kg when needed.", "Multiply kg by ordered dose.", "Compare with safe dose range."],
    safetyNote: "Verify the patient weight source and timing before calculating high-risk doses.",
    searchTerms: ["mg/kg", "weight", "pediatric", "safe dose", "kilogram"],
  },
  {
    id: "iv-pump-rate",
    category: "medication_math",
    subcategory: "iv_rates",
    title: "IV Pump Rate",
    formula: "mL/hr = total volume (mL) / time (hr)",
    useWhen: "Use for pump-programmed fluids or medication infusions ordered over a set time.",
    steps: ["Convert infusion time to hours.", "Divide volume by hours.", "Program and independently verify when required."],
    safetyNote: "Confirm concentration, line compatibility, and whether the order requires a smart-pump guardrail.",
    searchTerms: ["iv rate", "ml/hr", "pump", "infusion", "fluids"],
  },
  {
    id: "gravity-drip-rate",
    category: "medication_math",
    subcategory: "drip_factors",
    title: "Gravity Drip Rate",
    formula: "gtt/min = (volume mL × drop factor gtt/mL) / time min",
    useWhen: "Use when calculating manual IV tubing flow without an infusion pump.",
    steps: ["Convert time to minutes.", "Multiply volume by tubing drop factor.", "Divide by minutes and round to a whole drop."],
    safetyNote: "Manual drip rates require frequent reassessment because flow changes with height, position, and tubing resistance.",
    searchTerms: ["gtt", "drops", "drop factor", "gravity", "manual iv"],
  },
  {
    id: "mcg-kg-min",
    category: "medication_math",
    subcategory: "infusion_calculations",
    title: "mcg/kg/min Infusion",
    formula: "mL/hr = (mcg/kg/min × kg × 60) / concentration (mcg/mL)",
    useWhen: "Use for titratable vasoactive or critical-care infusions when concentration and weight are known.",
    steps: ["Calculate mcg per minute.", "Convert to mcg per hour.", "Divide by concentration in mcg/mL."],
    safetyNote: "This is high-risk math. Use approved calculators, smart pumps, and independent double checks in real care.",
    searchTerms: ["mcg/kg/min", "dopamine", "dobutamine", "vasopressor", "infusion"],
  },
  {
    id: "abg-basic-interpretation",
    category: "clinical",
    subcategory: "abg_interpretation",
    title: "ABG First Pass",
    formula: "pH 7.35-7.45 · PaCO2 35-45 · HCO3 22-26",
    useWhen: "Use to classify acid-base direction and whether the respiratory or metabolic value explains the pH.",
    steps: ["Check pH: acidotic, alkalotic, or normal.", "Compare PaCO2 direction.", "Compare HCO3 direction.", "Assess compensation and oxygenation."],
    safetyNote: "A worsening PaCO2 with fatigue or altered mentation can signal ventilatory failure even before arrest.",
    searchTerms: ["abg", "acid base", "pH", "PaCO2", "HCO3", "respiratory acidosis"],
  },
  {
    id: "ecg-intervals-core",
    category: "clinical",
    subcategory: "ecg_intervals",
    title: "Core ECG Intervals",
    formula: "PR 0.12-0.20 sec · QRS <0.12 sec · QTc usually <0.44 sec",
    useWhen: "Use when screening rhythm strips for conduction delay, wide-complex rhythms, or QT risk.",
    steps: ["Measure PR from P start to QRS start.", "Measure QRS width.", "Assess QTc in medication or electrolyte risk contexts."],
    safetyNote: "Treat wide-complex tachycardia as ventricular until proven otherwise when the patient is unstable.",
    searchTerms: ["ecg", "ekg", "PR", "QRS", "QTc", "intervals", "heart block"],
  },
  {
    id: "map-formula",
    category: "clinical",
    subcategory: "hemodynamic_values",
    title: "Mean Arterial Pressure",
    formula: "MAP = (SBP + 2 × DBP) / 3",
    useWhen: "Use to estimate perfusion pressure, especially in shock, sepsis, and critical care trends.",
    steps: ["Double the diastolic pressure.", "Add systolic pressure.", "Divide by three."],
    safetyNote: "A low or falling MAP paired with altered mentation, oliguria, or cool skin requires escalation.",
    searchTerms: ["MAP", "mean arterial pressure", "hemodynamic", "shock", "perfusion"],
  },
  {
    id: "cvp-reference",
    category: "clinical",
    subcategory: "hemodynamic_values",
    title: "Central Venous Pressure",
    formula: "CVP commonly 2-6 mmHg",
    useWhen: "Use as one data point in volume status and right-sided filling pressure interpretation.",
    steps: ["Confirm level/zeroing.", "Trend with lung sounds, edema, urine output, and perfusion.", "Avoid interpreting in isolation."],
    safetyNote: "CVP is context-dependent; trends and the whole patient matter more than a single number.",
    searchTerms: ["CVP", "central venous pressure", "hemodynamics", "right sided", "volume"],
  },
  {
    id: "common-lab-critical-frame",
    category: "clinical",
    subcategory: "lab_references",
    title: "Common Critical Lab Frame",
    formula: "K+ 3.5-5.0 · Na+ 135-145 · Glucose 70-110 mg/dL · Lactate often concerning >2",
    useWhen: "Use for rapid triage of electrolyte, glucose, and perfusion-related lab patterns.",
    steps: ["Look for symptoms and trend direction.", "Connect the abnormality to ECG, neuro, fluid, or perfusion risk.", "Escalate critical or symptomatic values."],
    safetyNote: "Reference ranges vary by lab. Follow local critical-value policy and provider notification requirements.",
    searchTerms: ["labs", "potassium", "sodium", "glucose", "lactate", "critical values"],
  },
];

export function searchSmartFormulaItems(query: string, favorites: readonly string[] = []): SmartFormulaItem[] {
  const q = query.trim().toLowerCase();
  const favoriteSet = new Set(favorites);
  const sorted = [...SMART_FORMULA_ITEMS].sort((a, b) => {
    const af = favoriteSet.has(a.id) ? 0 : 1;
    const bf = favoriteSet.has(b.id) ? 0 : 1;
    if (af !== bf) return af - bf;
    return a.title.localeCompare(b.title);
  });
  if (!q) return sorted;
  return sorted.filter((item) => {
    const haystack = [
      item.title,
      item.formula,
      item.useWhen,
      item.safetyNote,
      SMART_FORMULA_CATEGORY_LABELS[item.category],
      SMART_FORMULA_SUBCATEGORY_LABELS[item.subcategory],
      ...item.searchTerms,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
