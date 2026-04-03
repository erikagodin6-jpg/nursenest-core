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

const BY_ID: Record<string, ExamConfig> = {
  [NCLEX_RN_US_EXAM_CONFIG.id]: NCLEX_RN_US_EXAM_CONFIG,
  [NCLEX_RN_CA_EXAM_CONFIG.id]: NCLEX_RN_CA_EXAM_CONFIG,
};

export function getExamConfig(id: string): ExamConfig | null {
  return BY_ID[id] ?? null;
}

export function listExamConfigs(): ExamConfig[] {
  return Object.values(BY_ID);
}

/** Normalized blueprint weights (sum ≈ 1) for CAT client-needs balancing. */
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
