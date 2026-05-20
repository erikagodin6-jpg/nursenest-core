/**
 * Single source of truth for nursing content taxonomy (all tiers share this list).
 * IDs use snake_case. No AI / embeddings — classification is keyword-only in `classifier.ts`.
 */

export const TAXONOMY = {
  CLINICAL: [
    "cardiovascular",
    "respiratory",
    "neurological",
    "endocrine",
    "renal_genitourinary",
    "gastrointestinal",
    "hematology_oncology",
    "musculoskeletal",
    "integumentary",
    "immune_infectious",
    "reproductive_obstetrics",
    "pediatrics",
  ],
  PROFESSIONAL_PRACTICE: [
    "ethics",
    "legal_regulation",
    "documentation",
    "communication",
    "scope_of_practice",
    "delegation_supervision",
    "leadership_management",
    "patient_safety_quality",
  ],
  PHARMACOLOGY: ["cardiovascular_drugs", "cns_drugs", "endocrine_drugs", "anti_infectives", "pain_sedation"],
  EXAM_META: ["test_taking", "study_strategy"],
} as const;

export type TaxonomyDomainKey = keyof typeof TAXONOMY;

export type ClinicalCategory = (typeof TAXONOMY.CLINICAL)[number];
export type ProfessionalCategory = (typeof TAXONOMY.PROFESSIONAL_PRACTICE)[number];
export type PharmacologyCategory = (typeof TAXONOMY.PHARMACOLOGY)[number];
export type ExamMetaCategory = (typeof TAXONOMY.EXAM_META)[number];

export type TaxonomyLeafCategory =
  | ClinicalCategory
  | ProfessionalCategory
  | PharmacologyCategory
  | ExamMetaCategory;

/** Sentinel when keyword evidence is insufficient — never guess a clinical/pro bucket. */
export const REVIEW_REQUIRED = "REVIEW_REQUIRED" as const;
export type ReviewRequiredCategory = typeof REVIEW_REQUIRED;

export type ClassifiedCategory = TaxonomyLeafCategory | ReviewRequiredCategory;

/**
 * Tier overlay: visibility / depth per audience. Category is tier-agnostic; only these flags vary by product.
 * (Persist to DB in a follow-up migration as Json on content rows if needed.)
 */
export type ContentTierOverlay = {
  RN: boolean;
  RPN: boolean;
  NP: boolean;
  ALLIED: boolean;
  NEW_GRAD: boolean;
};

export const DEFAULT_CONTENT_TIER_OVERLAY: ContentTierOverlay = {
  RN: true,
  RPN: true,
  NP: true,
  ALLIED: true,
  NEW_GRAD: true,
};

const ALL_LEAVES = new Set<string>([
  ...TAXONOMY.CLINICAL,
  ...TAXONOMY.PROFESSIONAL_PRACTICE,
  ...TAXONOMY.PHARMACOLOGY,
  ...TAXONOMY.EXAM_META,
  REVIEW_REQUIRED,
]);

export function isTaxonomyLeafOrReview(id: string): id is ClassifiedCategory {
  return ALL_LEAVES.has(id);
}

export function allTaxonomyLeaves(): readonly string[] {
  return [...TAXONOMY.CLINICAL, ...TAXONOMY.PROFESSIONAL_PRACTICE, ...TAXONOMY.PHARMACOLOGY, ...TAXONOMY.EXAM_META];
}
