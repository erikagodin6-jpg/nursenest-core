/** Word-count targets for published premium content (validation / reporting — not padding). */

export const RATIONALE_MIN_WORDS = 120;
export const RATIONALE_STRONG_MIN_WORDS = 160;
export const RATIONALE_PREFERRED_MAX_WORDS = 300;

export const LESSON_MIN_WORDS = 500;
export const LESSON_STRONG_MIN_WORDS = 700;
export const LESSON_PREFERRED_MAX_WORDS = 1400;

export type ContentQualityTier = "missing" | "thin" | "acceptable" | "strong";
