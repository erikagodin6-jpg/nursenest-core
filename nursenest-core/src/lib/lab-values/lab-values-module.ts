import {
  ECG_MASTERY_PAID,
  LAB_VALUES_BASICS_FREE,
  LAB_VALUES_MASTERY_PAID,
} from "@/lib/modules/module-entitlement-placeholders";

export const ENABLE_LAB_VALUES_MODULE_FLAG = "ENABLE_LAB_VALUES_MODULE" as const;

export const LAB_VALUES_ENTITLEMENTS = {
  BASICS_FREE: LAB_VALUES_BASICS_FREE,
  MASTERY_PAID: LAB_VALUES_MASTERY_PAID,
} as const;

export const ECG_ENTITLEMENT_PLACEHOLDERS = {
  MASTERY_PAID: ECG_MASTERY_PAID,
} as const;

export type LabValuesLevel = "basics" | "basic" | "advanced";
export type LabValuesFutureAccess = "free" | "paid";

export type LabValuesPreviewModule = {
  id: string;
  slug: LabValuesLevel;
  title: string;
  description: string;
  level: LabValuesLevel;
  futureAccess: LabValuesFutureAccess;
  isPublic: false;
  adminPreviewOnly: true;
  entitlementKey: string;
  route: string;
  lessons: string[];
  quizFocus: string[];
  caseScenarios: string[];
  rapidDrills: string[];
  worksheets: string[];
  patternMaps: string[];
  nursingActionLayer: string[];
};

function hiddenTrack(input: Omit<LabValuesPreviewModule, "isPublic" | "adminPreviewOnly" | "route">): LabValuesPreviewModule {
  return {
    ...input,
    isPublic: false,
    adminPreviewOnly: true,
    route: `/modules/lab-values/${input.slug}`,
  };
}

export const LAB_VALUES_MODULES: readonly LabValuesPreviewModule[] = [
  hiddenTrack({
    id: "lab-values-basics",
    slug: "basics",
    title: "Lab Values Basics",
    description: "Single-lab foundations for meaning, purpose, normal ranges, and early recognition of abnormal values.",
    level: "basics",
    futureAccess: "free",
    entitlementKey: LAB_VALUES_ENTITLEMENTS.BASICS_FREE,
    lessons: [
      "Hemoglobin",
      "Hematocrit",
      "RBC",
      "WBC",
      "Platelets",
      "Sodium",
      "Potassium",
      "Calcium",
      "Magnesium",
      "Creatinine",
      "BUN",
      "Glucose",
      "INR / PT / PTT",
      "Liver enzymes",
    ],
    quizFocus: ["Normal vs high vs low", "Purpose of each lab", "Meaning-based explanations"],
    caseScenarios: ["Single-value meaning checks", "Early abnormality recognition", "Introductory symptom connections"],
    rapidDrills: [],
    worksheets: ["Identify abnormal values", "Define lab purpose", "Fill in normal ranges"],
    patternMaps: ["Low Hb + low Hct = anemia pattern", "High WBC + neutrophils = infection pattern"],
    nursingActionLayer: [],
  }),
  hiddenTrack({
    id: "lab-values-basic",
    slug: "basic",
    title: "Lab Values Basic Mastery",
    description: "Deeper lab interpretation with clustered patterns, learning-mode quizzes, and guided worksheet review.",
    level: "basic",
    futureAccess: "paid",
    entitlementKey: LAB_VALUES_ENTITLEMENTS.MASTERY_PAID,
    lessons: [
      "CBC clusters",
      "Electrolyte relationships",
      "Renal markers",
      "Coagulation basics",
      "Liver marker interpretation",
    ],
    quizFocus: ["Pattern recognition", "Meaning with rationale", "Wrong-answer review"],
    caseScenarios: [
      "Low Hb + low Hct + low MCV",
      "High WBC + fever + neutrophils",
      "High creatinine + low urine output",
    ],
    rapidDrills: [],
    worksheets: ["Panel interpretation", "Normal range recall", "Guided clinical prompts"],
    patternMaps: [
      "Low Hb + low Hct + low MCV = microcytic / iron deficiency pattern",
      "High creatinine + BUN = renal impairment pattern",
    ],
    nursingActionLayer: ["What is happening?", "Why it matters", "What to assess", "What should the nurse do first?"],
  }),
  hiddenTrack({
    id: "lab-values-advanced",
    slug: "advanced",
    title: "Lab Values Advanced Mastery",
    description: "Multi-lab clinical reasoning, case scenarios, rapid drills, pattern maps, and nursing-priority action layers.",
    level: "advanced",
    futureAccess: "paid",
    entitlementKey: LAB_VALUES_ENTITLEMENTS.MASTERY_PAID,
    lessons: [
      "Complex CBC interpretation",
      "Electrolyte emergencies",
      "Renal + fluid balance clusters",
      "Coagulation risk patterns",
      "Liver injury pattern recognition",
      "ABG basics readiness",
    ],
    quizFocus: ["Multi-lab reasoning", "Priority recognition", "Post-quiz rationale review"],
    caseScenarios: [
      "High K + ECG changes",
      "High creatinine + low urine output",
      "Low Hb + low Hct + low MCV",
      "High WBC + fever + neutrophils",
    ],
    rapidDrills: ["Timed pattern-recognition prompts", "Abnormal cluster recognition", "Priority action triage"],
    worksheets: ["Full panel interpretation", "Clinical priority questions", "What should the nurse do first?"],
    patternMaps: [
      "Low Hb + low Hct = anemia pattern",
      "High WBC + high neutrophils = likely bacterial infection pattern",
      "High K + ECG changes = urgent cardiac instability pattern",
    ],
    nursingActionLayer: [
      "What is happening?",
      "Why does it matter?",
      "What should the nurse assess?",
      "What should the nurse do first?",
      "When should the nurse escalate?",
    ],
  }),
] as const;

export function isLabValuesModuleEnabled(
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): boolean {
  const raw = env[ENABLE_LAB_VALUES_MODULE_FLAG]?.trim().toLowerCase();
  return raw === "1" || raw === "true";
}

export function findLabValuesModule(level: string): LabValuesPreviewModule | null {
  return LAB_VALUES_MODULES.find((module) => module.slug === level) ?? null;
}
