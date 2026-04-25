export const CANONICAL_LESSON_SYSTEMS = [
  "cardiovascular",
  "respiratory",
  "neurological",
  "endocrine",
  "renal-genitourinary",
  "gastrointestinal",
  "hematology-oncology-immunology",
  "integumentary-immune-autoimmune",
  "musculoskeletal",
  "maternity-newborn",
  "pediatrics",
  "mental-health",
  "pharmacology",
  "safety-prioritization",
  "critical-care",
  "general",
] as const;

export type CanonicalLessonSystem = (typeof CANONICAL_LESSON_SYSTEMS)[number];

const TOPIC_TO_SYSTEM: Record<string, CanonicalLessonSystem> = {
  cardiovascular: "cardiovascular",
  "heart-failure": "cardiovascular",
  "myocardial-infarction": "cardiovascular",

  respiratory: "respiratory",
  copd: "respiratory",
  pneumonia: "respiratory",
  "pulmonary-embolism": "respiratory",
  "respiratory-acute": "respiratory",
  "abg-acid-base": "respiratory",

  neurological: "neurological",

  endocrine: "endocrine",
  "diabetes-metabolic": "endocrine",
  "endocrine-metabolic-fluids": "endocrine",

  "renal-gu": "renal-genitourinary",
  "renal-genitourinary": "renal-genitourinary",

  gastrointestinal: "gastrointestinal",

  "fluids-electrolytes": "renal-genitourinary",
  "electrolytes-volume": "renal-genitourinary",

  "hematology-oncology-immunology": "hematology-oncology-immunology",
  "integumentary-immune-autoimmune": "integumentary-immune-autoimmune",
  musculoskeletal: "musculoskeletal",

  maternity: "maternity-newborn",
  "maternity-newborn": "maternity-newborn",
  "womens-health": "maternity-newborn",

  pediatrics: "pediatrics",
  "adolescent-health": "pediatrics",
  geriatrics: "general",
  "health-promotion": "general",

  "mental-health": "mental-health",
  psychosocial: "mental-health",

  "pharmacology-master": "pharmacology",
  antibiotics: "pharmacology",
  pain: "pharmacology",
  "medication-safety": "pharmacology",
  "np-differential-prescribing-chronic": "pharmacology",

  safety: "safety-prioritization",
  "infection-control": "safety-prioritization",
  "prioritization-delegation": "safety-prioritization",
  "clinical-reasoning": "safety-prioritization",
  "nclex-nursing-priorities-safety": "safety-prioritization",

  sepsis: "critical-care",
  shock: "critical-care",
  "sepsis-infection": "critical-care",
  "emergency-critical-perioperative": "critical-care",
};

export function canonicalLessonSystemForTopicSlug(
  topicSlug: string | null | undefined,
): CanonicalLessonSystem {
  const normalized = topicSlug?.trim().toLowerCase();
  if (!normalized) return "general";
  return TOPIC_TO_SYSTEM[normalized] ?? "general";
}

export function canonicalLessonSystemLabel(system: CanonicalLessonSystem): string {
  switch (system) {
    case "cardiovascular":
      return "Cardiovascular";
    case "respiratory":
      return "Respiratory";
    case "neurological":
      return "Neurological";
    case "endocrine":
      return "Endocrine";
    case "renal-genitourinary":
      return "Renal / Genitourinary";
    case "gastrointestinal":
      return "Gastrointestinal";
    case "hematology-oncology-immunology":
      return "Hematology / Oncology / Immunology";
    case "integumentary-immune-autoimmune":
      return "Integumentary / Immune / Autoimmune";
    case "musculoskeletal":
      return "Musculoskeletal";
    case "maternity-newborn":
      return "Maternity / Newborn";
    case "pediatrics":
      return "Pediatrics";
    case "mental-health":
      return "Mental Health";
    case "pharmacology":
      return "Pharmacology";
    case "safety-prioritization":
      return "Safety / Prioritization";
    case "critical-care":
      return "Critical Care";
    default:
      return "General";
  }
}
