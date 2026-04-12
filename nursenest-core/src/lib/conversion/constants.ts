/** Logged-in learners without a subscription may answer this many questions (lifetime, server-enforced). */
export const FREEMIUM_QUESTION_BUDGET = 10;

/**
 * Max questions per list API response for non-subscribers (ignores client pageSize; abuse-resistant).
 * Preview lists do not consume the lifetime budget; {@link FREEMIUM_QUESTION_BUDGET} is enforced on grade.
 */
export const FREEMIUM_QUESTION_LIST_MAX_PER_REQUEST = 5;

/** Preview lesson rows (titles/summaries only on page; API may return capped list). */
export const FREEMIUM_LESSON_BUDGET = 4;

/** Env key prefix for A/B style copy swaps (see experiment-config). */
export const CONVERSION_VARIANT_ENV = "NN_CONVERSION_VARIANT";
