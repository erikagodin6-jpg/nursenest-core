/**
 * Canonical topic-slug mapping for the NurseNest content pipeline.
 *
 * The question bank tags questions with `topic:{key}` where `key` comes from
 * the TOPICS array in the sprint-batch generator. Lesson catalogs store a
 * shorter, human-readable `topicSlug` field. This module provides a single
 * source of truth that bridges the two conventions.
 *
 * Rule: always resolve to the CANONICAL slug (the shorter lesson-catalog form).
 * Both the pipeline normalizer and the UI linking layer must go through
 * `canonicalTopicSlug()` — never compare raw question keys to lesson slugs.
 */

/**
 * Maps question-bank `key` (from `topic:{key}` tags) → canonical topicSlug.
 *
 * Entries only needed where key !== canonical slug. Anything not listed here
 * is its own canonical form (identity mapping).
 */
export const QUESTION_KEY_TO_CANONICAL_SLUG: Readonly<Record<string, string>> = {
  // Respiratory
  "copd-respiratory": "copd",
  "abg-interpretation": "abg",
  "acid-base-advanced": "acid-base",

  // Cardiovascular
  "myocardial-infarction": "acute-coronary",

  // Renal / Fluids
  "sodium-imbalance": "sodium",
  "potassium-imbalance": "potassium",
  "fluid-balance": "fluids-electrolytes",

  // Endocrine
  "insulin-hypoglycemia": "diabetes-meds",

  // Pharmacology / Treatments
  "anticoagulants": "anticoagulation",
  "pain-management": "pain",
  "wound-care": "wounds",

  // Management / Safety
  "prioritization-abcs": "prioritization",

  // Catch-all bucket
  "general-nursing-clinical": "clinical-judgment",
};

/**
 * Reverse map: canonical slug → question-bank key.
 * One-to-one; if a canonical slug maps from multiple keys, only one is kept
 * (first registered wins).
 */
export const CANONICAL_SLUG_TO_QUESTION_KEY: Readonly<Record<string, string>> =
  Object.fromEntries(
    Object.entries(QUESTION_KEY_TO_CANONICAL_SLUG).map(([key, canon]) => [
      canon,
      key,
    ])
  );

/**
 * Resolve any slug — whether a raw question-bank key or already canonical —
 * to its canonical form. Safe to call multiple times (idempotent).
 *
 * @example
 * canonicalTopicSlug("copd-respiratory") // → "copd"
 * canonicalTopicSlug("copd")             // → "copd"   (already canonical)
 * canonicalTopicSlug("pneumonia")        // → "pneumonia" (identity)
 */
export function canonicalTopicSlug(slug: string): string {
  return QUESTION_KEY_TO_CANONICAL_SLUG[slug] ?? slug;
}

/**
 * Return the canonical slug for a question's topic tag value.
 * Strips the "topic:" prefix if present.
 *
 * @example
 * canonicalTopicSlugFromTag("topic:copd-respiratory") // → "copd"
 * canonicalTopicSlugFromTag("copd-respiratory")       // → "copd"
 */
export function canonicalTopicSlugFromTag(topicTagOrKey: string): string {
  const key = topicTagOrKey.startsWith("topic:")
    ? topicTagOrKey.slice(6)
    : topicTagOrKey;
  return canonicalTopicSlug(key);
}

/**
 * Given a set of question topic tags, return the canonical slug.
 * Prefers an explicit `topic:*` tag; falls back to slugifying the topic label.
 */
export function canonicalTopicSlugFromTags(
  tags: string[],
  fallbackTopic?: string
): string {
  const topicTag = tags.find((t) => t.startsWith("topic:"));
  if (topicTag) return canonicalTopicSlugFromTag(topicTag);
  if (fallbackTopic) {
    const slugified = fallbackTopic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return canonicalTopicSlug(slugified);
  }
  return "general";
}

/**
 * All known canonical topic slugs in the system (lesson catalog side).
 * Derived from: identity keys + resolved canonical values from the mapping.
 * Used for validation that a resolved slug is actually a known leaf topic.
 */
export const KNOWN_CANONICAL_LESSON_TOPIC_SLUGS: ReadonlySet<string> =
  new Set([
    // Direct question-bank keys that are their own canonical form
    "pulmonary-embolism",
    "heart-failure",
    "angina",
    "dysrhythmias",
    "hypertension",
    "shock",
    "asthma",
    "ards",
    "pneumonia",
    "sepsis",
    "infection-control",
    "antibiotics",
    "delegation",
    "neurological-acute-care",
    "mental-health-crisis",
    "pediatrics-care",
    "maternal-newborn-care",
    "gastrointestinal-acute-care",
    "renal-genitourinary-care",
    "hematology-oncology-care",
    "musculoskeletal-care",
    "integumentary-burn-wound",
    "emergency-triage-disaster",
    "fundamentals-patient-safety",
    // Canonical resolved slugs (shorter lesson-catalog form)
    "copd",
    "abg",
    "acid-base",
    "acute-coronary",
    "sodium",
    "potassium",
    "fluids-electrolytes",
    "diabetes-meds",
    "anticoagulation",
    "pain",
    "wounds",
    "prioritization",
    "clinical-judgment",
    // Hub/aggregate slugs used by extended lessons
    "cardiovascular",
    "respiratory",
    "pharmacology",
    "gastrointestinal",
    "neurological",
    "endocrine",
    "renal-gu",
    "hematology",
    "musculoskeletal",
    "infectious",
    "integumentary",
    "mental-health",
    "maternity",
    "pediatrics",
    "leadership",
    "safety",
    "nutrition",
  ]);

/**
 * Returns true if the given canonical slug maps to the question-bank catch-all bucket.
 * Used to flag questions that still need explicit topic assignment.
 */
export function isCatchAllTopic(canonicalSlug: string): boolean {
  return canonicalSlug === "clinical-judgment";
}
