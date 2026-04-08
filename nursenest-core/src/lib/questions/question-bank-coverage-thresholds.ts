/**
 * Editorial targets for published `exam_questions` — reporting only; does not gate product access.
 */
export const RATIONALE_MIN_WORDS = 120;

/** Word-count floor for “strong” rationale tier (operational audit only). */
export const RATIONALE_STRONG_MIN_WORDS = 200;

/** Minimum published questions per aggregate study bucket (globally, by exam key union). */
export const MIN_PUBLISHED_BY_BUCKET = {
  rn: 1500,
  pn: 1000,
  np: 1000,
  alliedPerCountry: 300,
} as const;

/**
 * Flag a canonical topic as "thin" when count is below this share of the bucket minimum
 * (floor), capped so tiny buckets still expect a few items.
 */
export function minQuestionsPerCanonicalTopic(bucketMinTotal: number, topicShare = 0.02): number {
  return Math.max(5, Math.floor(bucketMinTotal * topicShare));
}
