/**
 * High-level clinical systems for exam-complete coverage planning.
 * Maps each bucket to existing `topicSlug` values used in `catalog.json` so hubs, question expansion JSON,
 * and flashcards can share vocabulary without ad-hoc strings.
 *
 * This is a **coverage map**, not an assertion that every condition is already authored.
 */
export const EXAM_COMPLETE_SYSTEM_KEYS = [
  "cardiovascular",
  "respiratory",
  "neurological",
  "endocrine",
  "renal_gu",
  "gastrointestinal",
  "maternity",
  "pediatrics",
  "mental_health",
  "infectious_disease",
  "pharmacology",
  "emergency_critical_care",
  "hematology_immuno",
  "musculoskeletal_integumentary",
  "leadership_safety",
  "fluids_electrolytes_acid_base",
] as const;

export type ExamCompleteSystemKey = (typeof EXAM_COMPLETE_SYSTEM_KEYS)[number];

/** Primary hub `topicSlug` values per system (subset of catalog). */
export const EXAM_COMPLETE_SYSTEM_TOPIC_SLUGS: Record<ExamCompleteSystemKey, readonly string[]> = {
  cardiovascular: ["cardiovascular", "acute-coronary", "heart-failure", "angina", "dysrhythmias", "hypertension", "shock", "pulmonary-embolism"],
  respiratory: ["asthma", "ards", "pneumonia", "copd", "abg", "respiratory"],
  neurological: ["neurological"],
  endocrine: ["endocrine", "diabetes-meds", "nutrition"],
  renal_gu: ["renal-gu", "fluids-electrolytes", "sodium", "potassium", "acid-base"],
  gastrointestinal: ["gastrointestinal"],
  maternity: ["maternity"],
  pediatrics: ["pediatrics"],
  mental_health: ["mental-health"],
  infectious_disease: ["infectious", "sepsis", "infection-control", "antibiotics"],
  pharmacology: ["pharmacology", "anticoagulation", "pain", "diabetes-meds"],
  emergency_critical_care: ["shock", "sepsis", "ards", "fluids-electrolytes", "prioritization", "clinical-judgment"],
  hematology_immuno: ["hematology"],
  musculoskeletal_integumentary: ["musculoskeletal", "integumentary", "wounds"],
  leadership_safety: ["delegation", "leadership", "safety", "safety-scope"],
  fluids_electrolytes_acid_base: ["fluids-electrolytes", "sodium", "potassium", "acid-base"],
};

/** Suggested default `examRelevance` when seeding new high-stakes lessons. */
export const EXAM_COMPLETE_DEFAULT_RELEVANCE_BY_SYSTEM: Record<ExamCompleteSystemKey, "high_yield" | "core" | "specialty"> = {
  cardiovascular: "high_yield",
  respiratory: "high_yield",
  neurological: "high_yield",
  endocrine: "high_yield",
  renal_gu: "high_yield",
  gastrointestinal: "core",
  maternity: "high_yield",
  pediatrics: "high_yield",
  mental_health: "high_yield",
  infectious_disease: "high_yield",
  pharmacology: "high_yield",
  emergency_critical_care: "high_yield",
  hematology_immuno: "core",
  musculoskeletal_integumentary: "core",
  leadership_safety: "high_yield",
  fluids_electrolytes_acid_base: "high_yield",
};
