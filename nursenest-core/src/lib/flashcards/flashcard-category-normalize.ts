/**
 * Centralized flashcard category normalization.
 *
 * Problem: ExamQuestion rows use varied strings for body_system / topic / nclex_client_needs_category
 * (e.g. "cardio", "CV", "cardiovascular system", "Physiological Integrity"). This helper provides a
 * single place to normalize those strings to canonical flashcard hub row IDs without scattering
 * one-off mappings across React components or DB query files.
 *
 * Usage:
 *   normalizeFlashcardCategoryAlias("CV") → "cardiovascular"
 *   normalizeFlashcardCategoryAlias("maternity") → "maternity_reproductive"
 *   normalizeFlashcardCategoryAlias("infection control") → "immune_infection_control"
 */

import {
  CANONICAL_STUDY_CATEGORIES,
  normalizeStudyCategory,
  type CanonicalStudyCategoryId,
} from "@/lib/study/normalize-study-category";

/** Aliases not covered by the main normalizeStudyCategory keyword map. */
const ALIAS_OVERRIDES: Readonly<Record<string, string>> = {
  // Cardiovascular
  cv: "cardiovascular",
  "cv system": "cardiovascular",
  "cardiovascular system": "cardiovascular",
  cardio: "cardiovascular",
  cardiac: "cardiovascular",
  // Respiratory
  resp: "respiratory",
  pulm: "respiratory",
  pulmonary: "respiratory",
  // Neurological
  neuro: "neurological",
  neurology: "neurological",
  "nervous system": "neurological",
  cns: "neurological",
  // Renal / Urinary
  "renal & urinary": "renal_urinary",
  "renal and urinary": "renal_urinary",
  "renal & gu": "renal_urinary",
  "renal/gu": "renal_urinary",
  gu: "renal_urinary",
  "genitourinary system": "renal_urinary",
  genitourinary: "renal_urinary",
  "renal_genitourinary": "renal_urinary",
  // Gastrointestinal
  gi: "gastrointestinal",
  "gastrointestinal system": "gastrointestinal",
  "gi system": "gastrointestinal",
  hepatic: "gastrointestinal",
  gastro: "gastrointestinal",
  // Endocrine
  "endocrine system": "endocrine",
  metabolic: "endocrine",
  // Hematology / Oncology
  "hematology & oncology": "hematology_oncology",
  "hematology and oncology": "hematology_oncology",
  hematology: "hematology_oncology",
  oncology: "hematology_oncology",
  "hem-onc": "hematology_oncology",
  hemonc: "hematology_oncology",
  // Musculoskeletal
  msk: "musculoskeletal",
  orthopedic: "musculoskeletal",
  ortho: "musculoskeletal",
  // Integumentary
  skin: "integumentary",
  dermatology: "integumentary",
  dermatologic: "integumentary",
  wound: "integumentary",
  "wound care": "integumentary",
  // Immune / Infection Control — canonical ID + hub row alias
  "immune/infection control": "immune_infection_control",
  "immune and infection control": "immune_infection_control",
  "infection control": "immune_infection_control",
  infection: "immune_infection_control",
  immune: "immune_infection_control",
  immunology: "immune_infection_control",
  infection_control: "immune_infection_control",
  immune_infectious: "immune_infection_control",
  // Maternity / Reproductive — hub row alias
  maternity: "maternity_reproductive",
  "maternal & newborn": "maternity_reproductive",
  "maternal and newborn": "maternity_reproductive",
  "maternal-newborn": "maternity_reproductive",
  ob: "maternity_reproductive",
  "ob/gyn": "maternity_reproductive",
  obstetrics: "maternity_reproductive",
  reproductive: "maternity_reproductive",
  reproductive_maternal_newborn: "maternity_reproductive",
  "reproductive maternal newborn": "maternity_reproductive",
  reproductive_obstetrics: "maternity_reproductive",
  // Mental Health
  "mental health": "mental_health",
  psychiatry: "mental_health",
  psych: "mental_health",
  psychiatric: "mental_health",
  behavioral: "mental_health",
  // Pharmacology
  pharm: "pharmacology",
  meds: "pharmacology",
  medications: "pharmacology",
  "medication administration": "pharmacology",
  // Fundamentals / Safety
  fundamentals: "fundamentals_safety",
  safety: "fundamentals_safety",
  "safety and prioritization": "fundamentals_safety",
  "safety & prioritization": "fundamentals_safety",
  fundamentals_safety: "fundamentals_safety",
  // Delegation / Assignment
  delegation: "delegation_assignment",
  "delegation and assignment": "delegation_assignment",
  // Prioritization
  prioritization: "prioritization",
  // Leadership / Management
  leadership: "leadership_management",
  management: "leadership_management",
  // Community / Public Health
  community: "community_public_health",
  "public health": "community_public_health",
  "community health": "community_public_health",
  // Emergency / Critical Care
  emergency: "emergency_critical_care",
  "critical care": "emergency_critical_care",
  "emergency & critical care": "emergency_critical_care",
  "emergency and critical care": "emergency_critical_care",
  // Lab Values / Diagnostics
  "lab values": "lab_values_diagnostics",
  labs: "lab_values_diagnostics",
  diagnostics: "lab_values_diagnostics",
  "lab values & diagnostics": "lab_values_diagnostics",
  "lab values and diagnostics": "lab_values_diagnostics",
  // Ethics / Legal
  ethics: "ethics_legal",
  legal: "ethics_legal",
  "ethics & legal": "ethics_legal",
  "ethics and legal": "ethics_legal",
  // NCLEX client needs buckets → best-fit canonical
  "safe and effective care environment": "fundamentals_safety",
  "safety and infection control": "immune_infection_control",
  "health promotion and maintenance": "community_public_health",
  "psychosocial integrity": "mental_health",
  "basic care and comfort": "fundamentals_safety",
  "pharmacological and parenteral therapies": "pharmacology",
  "reduction of risk potential": "fundamentals_safety",
};

const CANONICAL_ID_SET = new Set<string>(CANONICAL_STUDY_CATEGORIES.map((c) => c.id));

/**
 * Normalize a raw category / body-system / topic string from ExamQuestion rows or hub builder rows
 * to a canonical study category ID. Returns the canonical ID, or `null` when no usable match found.
 *
 * Order of resolution:
 * 1. Direct alias override (case-insensitive, trimmed)
 * 2. Already a canonical ID (passthrough)
 * 3. normalizeStudyCategory keyword/taxonomy pipeline
 * 4. null (uncategorized)
 */
export function normalizeFlashcardCategoryAlias(raw: string | null | undefined): CanonicalStudyCategoryId | null {
  const t = (raw ?? "").trim().toLowerCase();
  if (!t) return null;

  // 1. Alias override
  const overrideTarget = ALIAS_OVERRIDES[t];
  if (typeof overrideTarget === "string" && CANONICAL_ID_SET.has(overrideTarget)) {
    return overrideTarget as CanonicalStudyCategoryId;
  }

  // 2. Already a canonical ID
  if (CANONICAL_ID_SET.has(t)) return t as CanonicalStudyCategoryId;

  // 3. normalizeStudyCategory pipeline
  const normalized = normalizeStudyCategory({ bodySystem: raw, topic: raw });
  if (normalized.id !== "uncategorized") return normalized.id;

  return null;
}

/**
 * Given a Record of raw category strings → counts (from ExamQuestion groupBy results),
 * produce a Record of canonical study category IDs → summed counts.
 *
 * Rows that cannot be categorized are collected under "uncategorized".
 */
export function normalizeFlashcardCategoryCountsToCanonical(
  rawCounts: Record<string, number>,
): Record<CanonicalStudyCategoryId, number> {
  const out: Record<string, number> = {};
  for (const c of CANONICAL_STUDY_CATEGORIES) {
    out[c.id] = 0;
  }

  for (const rawKey of Object.keys(rawCounts)) {
    const count = rawCounts[rawKey];
    if (typeof count !== "number" || !Number.isFinite(count) || count <= 0) continue;
    const canonical = normalizeFlashcardCategoryAlias(rawKey);
    const target = canonical ?? "uncategorized";
    out[target] = (out[target] ?? 0) + count;
  }

  return out as Record<CanonicalStudyCategoryId, number>;
}
