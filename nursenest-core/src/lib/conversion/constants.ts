/** Logged-in learners without a subscription may answer this many questions (lifetime, server-enforced). */
export const FREEMIUM_QUESTION_BUDGET = 5;

/**
 * Max questions per list API response for non-subscribers (ignores client pageSize; abuse-resistant).
 * Preview lists do not consume the lifetime budget; {@link FREEMIUM_QUESTION_BUDGET} is enforced on grade.
 */
export const FREEMIUM_QUESTION_LIST_MAX_PER_REQUEST = 5;

/**
 * Complimentary lesson list rows per account (lifetime). One batch load increments usage by rows returned.
 * Keep in sync with {@link FREEMIUM_LESSON_LIST_PAGE_SIZE} for predictable spend (1 row = 1 open).
 */
export const FREEMIUM_LESSON_BUDGET = 1;

/** Freemium lesson API / peek should request at most this many rows (matches budget for predictable gating). */
export const FREEMIUM_LESSON_LIST_PAGE_SIZE = 1;

/** Env key prefix for A/B style copy swaps (see experiment-config). */
export const CONVERSION_VARIANT_ENV = "NN_CONVERSION_VARIANT";
