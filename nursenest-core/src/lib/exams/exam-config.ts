/**
 * Exam blueprints for simulations and CAT — single source for min/max length,
 * passing logic, and high-level category axes (aligned to NCLEX client-needs framing).
 */

export type ExamPassingLogic = "adaptive" | "fixed";

export type ExamConfigCategory = {
  /** Stable id for analytics / pooling (e.g. blueprint axis) */
  id: string;
  /** Human label */
  label: string;
  /** Optional approximate NCLEX-style weight hint (0–1), for future stratified sampling */
  weightHint?: number;
};

export type ExamConfig = {
  id: string;
  country: "US" | "CA";
  exam: "RN" | "PN" | "NP" | "ALLIED";
  type: "NCLEX" | "CUSTOM";
  minQuestions: number;
  maxQuestions: number;
  passingLogic: ExamPassingLogic;
  categories: ExamConfigCategory[];
  /** Timed exam-simulation default when the client omits `timeLimitSec` (seconds). */
  examSimulationTimeLimitSec?: number;
};

/**
 * US NCLEX-RN — official administration uses variable length (typically 85 scored as operational minimum
 * in many descriptions; product uses 75–145 as the configured simulation band; tune via env on cat-config if needed).
 */
export const NCLEX_RN_US_EXAM_CONFIG: ExamConfig = {
  id: "nclex-rn-us",
  country: "US",
  exam: "RN",
  type: "NCLEX",
  minQuestions: 75,
  maxQuestions: 145,
  passingLogic: "adaptive",
  examSimulationTimeLimitSec: 5 * 60 * 60,
  categories: [
    {
      id: "safe-effective",
      label: "Safe and Effective Care Environment",
      weightHint: 0.28,
    },
    {
      id: "health-promotion",
      label: "Health Promotion and Maintenance",
      weightHint: 0.18,
    },
    {
      id: "psychosocial",
      label: "Psychosocial Integrity",
      weightHint: 0.14,
    },
    {
      id: "physiological",
      label: "Physiological Integrity",
      weightHint: 0.4,
    },
  ],
};

/** Same item count band as US; Canadian candidates sit NCLEX-RN with the same exam program. */
export const NCLEX_RN_CA_EXAM_CONFIG: ExamConfig = {
  ...NCLEX_RN_US_EXAM_CONFIG,
  id: "nclex-rn-ca",
  country: "CA",
};

/**
 * AANP-style NP readiness simulation (US). Live AANP exams are not CAT-adaptive; this uses the same
 * NurseNest CAT engine with a four-domain blueprint for study. Tag NP items with these category ids in
 * `exam_questions.nclex_client_needs_category` (column name is legacy; values are blueprint ids).
 */
export const AANP_NP_US_EXAM_CONFIG: ExamConfig = {
  id: "aanp-np-us",
  country: "US",
  exam: "NP",
  type: "CUSTOM",
  minQuestions: 75,
  maxQuestions: 150,
  passingLogic: "adaptive",
  examSimulationTimeLimitSec: 3 * 60 * 60,
  categories: [
    {
      id: "aanp-assessment-diagnosis",
      label: "Assessment / Diagnosis",
      weightHint: 0.26,
    },
    {
      id: "aanp-clinical-management",
      label: "Clinical Management / Treatment",
      weightHint: 0.38,
    },
    {
      id: "aanp-health-promotion",
      label: "Health Promotion / Disease Prevention",
      weightHint: 0.18,
    },
    {
      id: "aanp-professional-practice",
      label: "Professional Practice / Ethics",
      weightHint: 0.18,
    },
  ],
};

/** Stable ids for NCLEX-RN client-needs major categories (pool tagging). */
export const NCLEX_RN_BLUEPRINT_CATEGORY_IDS = new Set(
  NCLEX_RN_US_EXAM_CONFIG.categories.map((c) => c.id),
);

/** Stable ids for AANP-style NP blueprint domains (pool tagging on NP items). */
export const AANP_NP_BLUEPRINT_CATEGORY_IDS = new Set(
  AANP_NP_US_EXAM_CONFIG.categories.map((c) => c.id),
);

/**
 * Classify how the blueprint key was derived for diagnostics (category keys are disjoint across NCLEX vs AANP).
 */
export function blueprintTagSourceForCategoryKey(
  categoryKey: string,
): "nclex_client_needs" | "aanp_blueprint" | "fallback" {
  if (NCLEX_RN_BLUEPRINT_CATEGORY_IDS.has(categoryKey)) return "nclex_client_needs";
  if (AANP_NP_BLUEPRINT_CATEGORY_IDS.has(categoryKey)) return "aanp_blueprint";
  return "fallback";
}

const BY_ID: Record<string, ExamConfig> = {
  [NCLEX_RN_US_EXAM_CONFIG.id]: NCLEX_RN_US_EXAM_CONFIG,
  [NCLEX_RN_CA_EXAM_CONFIG.id]: NCLEX_RN_CA_EXAM_CONFIG,
  [AANP_NP_US_EXAM_CONFIG.id]: AANP_NP_US_EXAM_CONFIG,
};

export function getExamConfig(id: string): ExamConfig | null {
  return BY_ID[id] ?? null;
}

export function listExamConfigs(): ExamConfig[] {
  return Object.values(BY_ID);
}

/** Normalized blueprint weights (sum ≈ 1) for CAT blueprint balancing (NCLEX client-needs or AANP domains). */
export function nclexBlueprintWeightMap(cfg: ExamConfig): Record<string, number> {
  const m: Record<string, number> = {};
  let sum = 0;
  for (const c of cfg.categories) {
    const w = typeof c.weightHint === "number" && c.weightHint > 0 ? c.weightHint : 0;
    m[c.id] = w;
    sum += w;
  }
  if (sum <= 0) return {};
  for (const k of Object.keys(m)) {
    m[k]! /= sum;
  }
  return m;
}
