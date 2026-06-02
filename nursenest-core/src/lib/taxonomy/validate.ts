/**
 * Hard validation for taxonomy classification results. Throws on illegal domain/category pairs.
 */

import {
  isTaxonomyLeafOrReview,
  REVIEW_REQUIRED,
  TAXONOMY,
  type ClassifiedCategory,
  type TaxonomyDomainKey,
} from "@/lib/taxonomy/taxonomy";
import type { ClassificationResult } from "@/lib/taxonomy/classifier";

const CLINICAL = new Set<string>(TAXONOMY.CLINICAL);
const PROFESSIONAL = new Set<string>(TAXONOMY.PROFESSIONAL_PRACTICE);
const PHARM = new Set<string>(TAXONOMY.PHARMACOLOGY);
const EXAM = new Set<string>(TAXONOMY.EXAM_META);

function categoryDomain(category: ClassifiedCategory): TaxonomyDomainKey | null {
  if (category === REVIEW_REQUIRED) return null;
  if (CLINICAL.has(category)) return "CLINICAL";
  if (PROFESSIONAL.has(category)) return "PROFESSIONAL_PRACTICE";
  if (PHARM.has(category)) return "PHARMACOLOGY";
  if (EXAM.has(category)) return "EXAM_META";
  return null;
}

/**
 * @throws Error when classification violates taxonomy invariants or category is unknown.
 */
export function validateClassification(result: ClassificationResult): void {
  const { domain, category } = result;

  if (category === REVIEW_REQUIRED) {
    if (domain !== "REVIEW_PENDING") {
      throw new Error(`taxonomy: REVIEW_REQUIRED requires domain REVIEW_PENDING (got ${domain})`);
    }
    return;
  }

  if (!isTaxonomyLeafOrReview(category)) {
    throw new Error(`taxonomy: unknown category "${category}"`);
  }

  const expected = categoryDomain(category);
  if (!expected) {
    throw new Error(`taxonomy: could not resolve domain for category "${category}"`);
  }

  if (domain === "REVIEW_PENDING") {
    throw new Error(`taxonomy: domain REVIEW_PENDING is only valid with REVIEW_REQUIRED`);
  }

  if (domain !== expected) {
    throw new Error(
      `taxonomy: domain "${domain}" incompatible with category "${category}" (expected "${expected}")`,
    );
  }

  if (domain === "CLINICAL" && PROFESSIONAL.has(category)) {
    throw new Error(`taxonomy: clinical domain cannot carry professional category "${category}"`);
  }
  if (domain === "PROFESSIONAL_PRACTICE" && (CLINICAL.has(category) || PHARM.has(category) || EXAM.has(category))) {
    throw new Error(`taxonomy: professional domain cannot carry clinical/pharm/exam category "${category}"`);
  }
  if (domain === "PHARMACOLOGY" && !PHARM.has(category)) {
    throw new Error(`taxonomy: pharmacology domain requires pharmacology category (got "${category}")`);
  }
  if (domain === "EXAM_META" && !EXAM.has(category)) {
    throw new Error(`taxonomy: exam_meta domain requires exam_meta category (got "${category}")`);
  }
}

export function validateClassificationOrThrow(result: ClassificationResult): void {
  validateClassification(result);
}
