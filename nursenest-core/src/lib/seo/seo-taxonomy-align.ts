import { REVIEW_REQUIRED, TAXONOMY, type TaxonomyLeafCategory } from "@/lib/taxonomy/taxonomy";

/** Domains allowed in {@link generateSeo} (excludes `REVIEW_PENDING`). */
export type SeoContentDomain = "CLINICAL" | "PROFESSIONAL_PRACTICE" | "PHARMACOLOGY" | "EXAM_META";

export type SeoTier = "RN" | "RPN" | "NP" | "ALLIED" | "NEW_GRAD";

const CLINICAL = new Set<string>(TAXONOMY.CLINICAL);
const PRO = new Set<string>(TAXONOMY.PROFESSIONAL_PRACTICE);
const PHARM = new Set<string>(TAXONOMY.PHARMACOLOGY);
const EXAM = new Set<string>(TAXONOMY.EXAM_META);

export class SeoTaxonomyMismatchError extends Error {
  readonly code = "SEO_TAXONOMY_MISMATCH" as const;

  constructor(message: string) {
    super(message);
    this.name = "SeoTaxonomyMismatchError";
  }
}

/** Resolve taxonomy domain for a known leaf id. */
export function seoDomainForTaxonomyCategory(category: string): SeoContentDomain {
  if (category === REVIEW_REQUIRED || !category.trim()) {
    throw new SeoTaxonomyMismatchError("SEO requires a resolved taxonomy leaf (not REVIEW_REQUIRED).");
  }
  if (CLINICAL.has(category)) return "CLINICAL";
  if (PRO.has(category)) return "PROFESSIONAL_PRACTICE";
  if (PHARM.has(category)) return "PHARMACOLOGY";
  if (EXAM.has(category)) return "EXAM_META";
  throw new SeoTaxonomyMismatchError(`Unknown taxonomy category for SEO: "${category}"`);
}

/** @throws SeoTaxonomyMismatchError when domain does not match the category bucket. */
export function assertSeoCategoryDomainAlignment(category: string, domain: SeoContentDomain): void {
  const expected = seoDomainForTaxonomyCategory(category);
  if (expected !== domain) {
    throw new SeoTaxonomyMismatchError(
      `SEO domain "${domain}" does not match taxonomy bucket for category "${category}" (expected "${expected}").`,
    );
  }
}

export function isTaxonomyLeafForSeo(category: string): category is TaxonomyLeafCategory {
  return CLINICAL.has(category) || PRO.has(category) || PHARM.has(category) || EXAM.has(category);
}

/** Map pipeline / blog exam strings into SEO tier labels. */
export function mapExamStringToSeoTier(exam: string | null | undefined): SeoTier {
  const u = (exam ?? "").toUpperCase();
  if (u.includes("ALLIED")) return "ALLIED";
  if (u.includes("NP") || u.includes("CNPLE") || u.includes("FNP") || u.includes("PMHNP") || u.includes("AGPCNP")) {
    return "NP";
  }
  if (u.includes("RPN") || u.includes("REX") || u.includes("PN") || u.includes("LPN") || u.includes("LVN")) {
    return "RPN";
  }
  if (u.includes("NEW") && u.includes("GRAD")) return "NEW_GRAD";
  return "RN";
}
