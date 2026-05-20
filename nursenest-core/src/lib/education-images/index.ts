export { publicCdnUrlForObjectKey } from "@/lib/education-images/cdn-url";
export {
  getInventoryKeys,
  listInventoryBasenames,
  type EducationImageInventory,
} from "@/lib/education-images/inventory";
export {
  matchConceptImage,
  type ConceptImageMatchResult,
  type ConceptImageMatchTier,
  type ConceptImageQuery,
} from "@/lib/education-images/match-concept-image";
export {
  basenameWithoutExtension,
  inventoryBasenameCandidatesFromLabel,
  normalizeConceptToken,
  tokenizeForConceptMatch,
} from "@/lib/education-images/normalize-concept-token";

/** Stable alias for lesson pages, rationale review, and CAT post-exam review. */
export { matchConceptImage as resolveEducationImageForConcept } from "@/lib/education-images/match-concept-image";
