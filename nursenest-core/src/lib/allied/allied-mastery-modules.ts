export type AlliedMasteryModuleLevel = "basics" | "basic" | "advanced";
export type AlliedMasteryModuleAccess = "free_preview" | "paid" | "admin_preview_only";

export type AlliedMasteryContentType =
  | "lessons"
  | "quizzes"
  | "case_scenarios"
  | "rapid_drills"
  | "worksheets"
  | "pattern_maps"
  | "clinical_action_layer";

export type AlliedMasteryModule = {
  id: string;
  slug: string;
  title: string;
  description: string;
  professionKeys: string[];
  level: AlliedMasteryModuleLevel;
  access: AlliedMasteryModuleAccess;
  isPublic: false;
  adminPreviewOnly: true;
  entitlementKey: string;
  tags: string[];
  contentTypes: AlliedMasteryContentType[];
  route: string;
  sections: string[];
  actionLayer: string[];
};

export const ENABLE_ALLIED_MASTERY_MODULES_FLAG = "ENABLE_ALLIED_MASTERY_MODULES" as const;
export const ENABLE_ADMIN_MODULE_PREVIEW_FLAG = "ENABLE_ADMIN_MODULE_PREVIEW" as const;

export const ALLIED_MASTERY_ENTITLEMENTS = {
  ABG_MASTERY: "ALLIED_ABG_MASTERY_PAID",
  VENTILATOR_BASICS: "ALLIED_VENTILATOR_BASICS_PAID",
  ADVANCED_LAB_INTERPRETATION: "ALLIED_ADVANCED_LAB_INTERPRETATION_PAID",
  PHARMACOLOGY_PATTERNS: "ALLIED_PHARMACOLOGY_PATTERNS_PAID",
  DOSAGE_CALCULATIONS: "ALLIED_DOSAGE_CALCULATIONS_PAID",
  ADL_FUNCTIONAL_ASSESSMENT: "ALLIED_ADL_FUNCTIONAL_ASSESSMENT_PAID",
  MSK_REHAB_ASSESSMENT: "ALLIED_MSK_REHAB_ASSESSMENT_PAID",
  IMAGE_RECOGNITION: "ALLIED_IMAGE_RECOGNITION_PAID",
  CARDIAC_PATTERN_RECOGNITION: "ALLIED_CARDIAC_PATTERN_RECOGNITION_PAID",
  EMERGENCY_PATTERN_RECOGNITION: "ALLIED_EMERGENCY_PATTERN_RECOGNITION_PAID",
} as const;

export const ALLIED_MASTERY_PROFESSION_LABELS: Record<string, string> = {
  respiratory: "Respiratory Therapy",
  mlt: "Medical Laboratory Technology",
  "pharmacy-tech": "Pharmacy Technician",
  ota: "Occupational Therapy",
  pta: "Physiotherapy",
  imaging: "Diagnostic Imaging",
  sonography: "Cardiology Technology / Cardiac Sonography",
  paramedic: "Paramedic / EMS",
};

const allContentTypes: AlliedMasteryContentType[] = [
  "lessons",
  "quizzes",
  "case_scenarios",
  "rapid_drills",
  "worksheets",
  "pattern_maps",
  "clinical_action_layer",
];

function hiddenModule(input: Omit<AlliedMasteryModule, "access" | "isPublic" | "adminPreviewOnly" | "route">): AlliedMasteryModule {
  const professionKey = input.professionKeys[0];
  return {
    ...input,
    access: "admin_preview_only",
    isPublic: false,
    adminPreviewOnly: true,
    route: `/allied/${professionKey}/modules/${input.slug}`,
  };
}

export const ALLIED_MASTERY_MODULES: AlliedMasteryModule[] = [
  hiddenModule({
    id: "respiratory-abg-mastery",
    slug: "abg",
    title: "ABG Interpretation Mastery",
    description: "Respiratory therapy ABG interpretation from single-value meaning through compensation and priority action.",
    professionKeys: ["respiratory"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.ABG_MASTERY,
    tags: ["abg", "acid-base", "respiratory-therapy", "oxygenation", "ventilation"],
    contentTypes: allContentTypes,
    sections: [
      "What is an ABG?",
      "pH, PaCO2, HCO3, PaO2, and SaO2 basics",
      "Acidosis vs alkalosis",
      "Respiratory vs metabolic patterns",
      "Uncompensated, partially compensated, fully compensated, and mixed disorders",
      "Cases: COPD exacerbation, DKA, sepsis/lactic acidosis, opioid overdose, pulmonary embolism",
      "Rapid drills, worksheets, and pH + CO2 + HCO3 pattern maps",
    ],
    actionLayer: [
      "What is happening?",
      "Why it matters",
      "Oxygenation or ventilation concern",
      "What to assess",
      "When to escalate",
    ],
  }),
  hiddenModule({
    id: "respiratory-ventilator-basics",
    slug: "ventilator-basics",
    title: "Ventilator Basics",
    description: "Core ventilator terms, settings, alarms, patient-ventilator safety, and escalation patterns for RT learners.",
    professionKeys: ["respiratory"],
    level: "basic",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.VENTILATOR_BASICS,
    tags: ["ventilator", "airway", "respiratory-therapy"],
    contentTypes: allContentTypes,
    sections: ["Modes and settings", "Alarm basics", "Oxygenation vs ventilation", "Patient assessment", "Escalation triggers"],
    actionLayer: ["What is happening?", "Why it matters", "What to assess", "What to do first", "When to escalate"],
  }),
  hiddenModule({
    id: "mlt-advanced-lab-interpretation",
    slug: "advanced-lab-interpretation",
    title: "Advanced Lab Interpretation",
    description: "Medical laboratory pattern recognition across CBC, chemistry, renal, liver, coagulation, and critical value escalation.",
    professionKeys: ["mlt"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.ADVANCED_LAB_INTERPRETATION,
    tags: ["mlt", "lab-panels", "hematology", "chemistry", "critical-values"],
    contentTypes: allContentTypes,
    sections: [
      "CBC review, electrolytes, renal markers, liver markers, and coagulation basics",
      "Anemia, infection/inflammation, renal impairment, electrolyte imbalance, liver injury, and coagulation patterns",
      "Cases: iron deficiency anemia, sepsis pattern, acute kidney injury, DKA pattern, liver dysfunction, bleeding/clotting risk",
      "Rapid drills: abnormal cluster, likely pattern, critical value",
      "Worksheets and CBC, renal/electrolyte, and coagulation pattern maps",
    ],
    actionLayer: [
      "What pattern is present?",
      "Why it matters",
      "What values are critical",
      "What requires escalation",
      "What should be verified or rechecked",
    ],
  }),
  hiddenModule({
    id: "pharmacy-tech-pharmacology-patterns",
    slug: "pharmacology-patterns",
    title: "Pharmacology Pattern Recognition",
    description: "Drug class patterns, contraindications, adverse effects, and interaction recognition for pharmacy technician learners.",
    professionKeys: ["pharmacy-tech"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.PHARMACOLOGY_PATTERNS,
    tags: ["pharmacy-tech", "pharmacology", "drug-classes", "interactions"],
    contentTypes: allContentTypes,
    sections: ["Drug class lessons", "Contraindications", "Adverse effects", "Interactions", "Worksheet review"],
    actionLayer: ["What is happening?", "Why it matters", "What to verify", "What to do first", "When to escalate"],
  }),
  hiddenModule({
    id: "pharmacy-tech-dosage-calculations",
    slug: "dosage-calculations",
    title: "Dosage Calculations",
    description: "Calculation drills, unit conversion, medication safety checks, and pharmacy workflow accuracy.",
    professionKeys: ["pharmacy-tech"],
    level: "basic",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.DOSAGE_CALCULATIONS,
    tags: ["pharmacy-tech", "dosage-calculation", "medication-safety"],
    contentTypes: allContentTypes,
    sections: ["Unit conversion", "Dose calculations", "Safety checks", "Rapid calculation drills", "Answer key worksheets"],
    actionLayer: ["What is being calculated?", "Why it matters", "What to verify", "What to do first", "When to escalate"],
  }),
  hiddenModule({
    id: "ota-adl-functional-assessment",
    slug: "adl-functional-assessment",
    title: "ADL + Functional Assessment Mastery",
    description: "ADL assessment, adaptive strategies, care planning, goal writing, and occupation-focused case reasoning.",
    professionKeys: ["ota"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.ADL_FUNCTIONAL_ASSESSMENT,
    tags: ["occupational-therapy", "adl", "functional-assessment", "goal-writing"],
    contentTypes: allContentTypes,
    sections: ["ADL lessons", "Assessment cases", "Care planning", "Goal writing", "Worksheets"],
    actionLayer: ["What is happening?", "Why it matters", "What to assess", "What to do first", "When to escalate"],
  }),
  hiddenModule({
    id: "pta-msk-rehab-assessment",
    slug: "msk-rehab-assessment",
    title: "Musculoskeletal Rehab + Movement Assessment",
    description: "ROM, gait, injury patterns, rehab progression, and movement assessment cases for physiotherapy learners.",
    professionKeys: ["pta"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.MSK_REHAB_ASSESSMENT,
    tags: ["physiotherapy", "msk", "rehab", "gait", "rom"],
    contentTypes: allContentTypes,
    sections: ["ROM", "Gait", "Injury patterns", "Rehab progression", "Assessment cases", "Worksheets"],
    actionLayer: ["What is happening?", "Why it matters", "What to assess", "What to do first", "When to escalate"],
  }),
  hiddenModule({
    id: "imaging-image-recognition",
    slug: "image-recognition",
    title: "Image Recognition Basics",
    description: "Normal vs abnormal imaging, chest X-ray basics, CT/MRI safety concepts, and image case review.",
    professionKeys: ["imaging"],
    level: "basic",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.IMAGE_RECOGNITION,
    tags: ["diagnostic-imaging", "x-ray", "ct", "mri", "image-recognition"],
    contentTypes: allContentTypes,
    sections: ["Normal vs abnormal imaging", "Chest X-ray basics", "CT/MRI safety concepts", "Image cases", "Worksheets"],
    actionLayer: ["What is visible?", "Why it matters", "What to verify", "What to do first", "When to escalate"],
  }),
  hiddenModule({
    id: "sonography-ecg-cardiac-patterns",
    slug: "ecg-cardiac-patterns",
    title: "ECG + Cardiac Pattern Recognition",
    description: "Rhythm strips, cardiac findings, echo and imaging basics where appropriate, and cardiac pattern cases.",
    professionKeys: ["sonography"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.CARDIAC_PATTERN_RECOGNITION,
    tags: ["cardiology-technology", "ecg", "cardiac-patterns"],
    contentTypes: allContentTypes,
    sections: ["Rhythm strips", "Cardiac findings", "Echo/imaging basics", "Cases", "Worksheets"],
    actionLayer: ["What is happening?", "Why it matters", "What to assess", "What to do first", "When to escalate"],
  }),
  hiddenModule({
    id: "paramedic-emergency-pattern-recognition",
    slug: "emergency-pattern-recognition",
    title: "Emergency Pattern Recognition",
    description: "Triage, shock, trauma, ECG basics, respiratory distress, priority actions, and rapid drills for EMS learners.",
    professionKeys: ["paramedic"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.EMERGENCY_PATTERN_RECOGNITION,
    tags: ["paramedic", "ems", "triage", "shock", "trauma", "rapid-drills"],
    contentTypes: allContentTypes,
    sections: ["Triage", "Shock", "Trauma", "ECG basics", "Respiratory distress", "Priority actions", "Rapid drills"],
    actionLayer: ["What is happening?", "Why it matters", "What to assess", "What to do first", "When to escalate"],
  }),
];

export function isAlliedMasteryModulesPublicEnabled(env: Record<string, string | undefined> = process.env): boolean {
  const raw = env[ENABLE_ALLIED_MASTERY_MODULES_FLAG]?.trim().toLowerCase();
  return raw === "1" || raw === "true";
}

export function isAdminModulePreviewEnabled(env: Record<string, string | undefined> = process.env): boolean {
  const raw = env[ENABLE_ADMIN_MODULE_PREVIEW_FLAG]?.trim().toLowerCase();
  return raw == null || raw === "" || raw === "1" || raw === "true";
}

export function alliedMasteryModulesForProfession(professionKey: string): AlliedMasteryModule[] {
  return ALLIED_MASTERY_MODULES.filter((module) => module.professionKeys.includes(professionKey));
}

export function findAlliedMasteryModule(professionKey: string, moduleSlug: string): AlliedMasteryModule | null {
  return ALLIED_MASTERY_MODULES.find((module) => module.slug === moduleSlug && module.professionKeys.includes(professionKey)) ?? null;
}

export function groupedAlliedMasteryModules(): Array<{ professionKey: string; professionLabel: string; modules: AlliedMasteryModule[] }> {
  return Object.entries(ALLIED_MASTERY_PROFESSION_LABELS).map(([professionKey, professionLabel]) => ({
    professionKey,
    professionLabel,
    modules: alliedMasteryModulesForProfession(professionKey),
  }));
}
