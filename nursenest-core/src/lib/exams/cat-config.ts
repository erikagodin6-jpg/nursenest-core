const rawMin = process.env.CAT_RELAX_MIN_QUESTIONS;
/** Default 85; set CAT_RELAX_MIN_QUESTIONS (e.g. 10) for local/CI with small banks. */
export const CAT_MIN_QUESTIONS =
  rawMin != null && rawMin !== ""
    ? Math.max(5, Math.min(150, Number.parseInt(rawMin, 10) || 85))
    : 85;

const rawMax = process.env.CAT_MAX_QUESTIONS;
export const CAT_MAX_QUESTIONS =
  rawMax != null && rawMax !== ""
    ? Math.max(CAT_MIN_QUESTIONS, Math.min(200, Number.parseInt(rawMax, 10) || 150))
    : 150;

export const CAT_START_THETA = 0;
export const CAT_START_TARGET_DIFFICULTY = 3;

/** Early stop after min questions when estimate is confident. */
export const CAT_EARLY_PASS_THETA = 0.42;
export const CAT_EARLY_FAIL_THETA = -0.42;
export const CAT_EARLY_STOP_SE = 0.34;

/** Final pass/fail thresholds on theta (softer than early stop). */
export const CAT_FINAL_PASS_THETA = 0.12;
export const CAT_FINAL_FAIL_THETA = -0.12;
