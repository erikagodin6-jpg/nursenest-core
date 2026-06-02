/**
 * Deterministic nursing content placement: **keyword hits only** (no embeddings, no LLM).
 *
 * Delegates to {@link classifyStrings} with `placementStrictUnique: true` so ambiguous
 * top-score ties map to {@link REVIEW_REQUIRED} instead of arbitrary lexicographic winners.
 *
 * Canonical taxonomy leaves live in `taxonomy.ts` + `keyword-map.ts` — this module is a thin
 * façade for callers that want a simplified `{ domain, category }` contract.
 */

import { classifyStrings, type ClassificationResult } from "@/lib/taxonomy/classifier";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";

/** Simplified domain for placement UIs (maps pharmacology into clinical, exam meta into professional). */
export type DeterministicPlacementDomain = "clinical" | "professional" | "review_required";

export type DeterministicContentClassification = {
  domain: DeterministicPlacementDomain;
  /** Taxonomy leaf id (snake_case) or {@link REVIEW_REQUIRED}. */
  category: string;
  /** Echo of full classifier output for audits / dashboards. */
  raw: ClassificationResult;
};

function toPlacementDomain(r: ClassificationResult): DeterministicPlacementDomain {
  if (r.domain === "REVIEW_PENDING" || r.category === REVIEW_REQUIRED) return "review_required";
  if (r.domain === "CLINICAL" || r.domain === "PHARMACOLOGY") return "clinical";
  if (r.domain === "PROFESSIONAL_PRACTICE" || r.domain === "EXAM_META") return "professional";
  return "review_required";
}

function toPlacementCategory(r: ClassificationResult): string {
  if (r.domain === "REVIEW_PENDING" || r.category === REVIEW_REQUIRED) return REVIEW_REQUIRED;
  return r.category;
}

/**
 * Classify arbitrary title/body/keywords for **auto-placement** decisions.
 * Ties for the strongest leaf within the winning domain → `REVIEW_REQUIRED` (never guess).
 */
export function classifyDeterministicContent(input: {
  title?: string | null;
  content?: string | null;
  keywords?: readonly string[] | null;
}): DeterministicContentClassification {
  const raw = classifyStrings({ ...input, placementStrictUnique: true });
  return {
    domain: toPlacementDomain(raw),
    category: toPlacementCategory(raw),
    raw,
  };
}
