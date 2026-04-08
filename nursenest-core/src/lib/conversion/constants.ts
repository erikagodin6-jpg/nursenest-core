/** Logged-in learners without a subscription may preview this many questions (lifetime, server-enforced). */
export const FREEMIUM_QUESTION_BUDGET = 10;

/**
 * Max questions per list API response for non-subscribers (ignores client pageSize; abuse-resistant).
 * Aligns with product “1–3 question preview” while lifetime budget may be higher.
 */
export const FREEMIUM_QUESTION_LIST_MAX_PER_REQUEST = 3;

/** Preview lesson rows (titles/summaries only on page; API may return capped list). */
export const FREEMIUM_LESSON_BUDGET = 4;

/** Env key prefix for A/B style copy swaps (see experiment-config). */
export const CONVERSION_VARIANT_ENV = "NN_CONVERSION_VARIANT";
