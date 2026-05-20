import { NCLEX_RN_US_EXAM_CONFIG } from "@/lib/exams/exam-config";

const rawMin = process.env.CAT_RELAX_MIN_QUESTIONS;
/**
 * Defaults follow NCLEX-RN US simulation bounds ({@link NCLEX_RN_US_EXAM_CONFIG}).
 * Set CAT_RELAX_MIN_QUESTIONS / CAT_MAX_QUESTIONS for local/CI with small banks.
 */
export const CAT_MIN_QUESTIONS =
  rawMin != null && rawMin !== ""
    ? Math.max(
        5,
        Math.min(NCLEX_RN_US_EXAM_CONFIG.maxQuestions, Number.parseInt(rawMin, 10) || NCLEX_RN_US_EXAM_CONFIG.minQuestions),
      )
    : NCLEX_RN_US_EXAM_CONFIG.minQuestions;

const rawMax = process.env.CAT_MAX_QUESTIONS;
export const CAT_MAX_QUESTIONS =
  rawMax != null && rawMax !== ""
    ? Math.max(
        CAT_MIN_QUESTIONS,
        Math.min(200, Number.parseInt(rawMax, 10) || NCLEX_RN_US_EXAM_CONFIG.maxQuestions),
      )
    : NCLEX_RN_US_EXAM_CONFIG.maxQuestions;

export const CAT_START_THETA = 0;
export const CAT_START_TARGET_DIFFICULTY = 3;

/**
 * Minimum scored items before confidence-based early stop (theta + SE) may fire.
 * Enforced in `cat-engine` `shouldStopAfterAnswer` alongside session `min` (e.g. NCLEX 85).
 */
export const CAT_MIN_ANSWERED_FOR_CONFIDENCE_STOP = 16;

/** Early stop after min questions when estimate is confident. */
export const CAT_EARLY_PASS_THETA = 0.42;
export const CAT_EARLY_FAIL_THETA = -0.42;
export const CAT_EARLY_STOP_SE = 0.34;

/** Weak prior precision so SE is finite before any items (roughly SE ≈ 1.1). */
export const CAT_PRIOR_INFORMATION = 0.82;

/** Final pass/fail thresholds on theta (softer than early stop). */
export const CAT_FINAL_PASS_THETA = 0.12;
export const CAT_FINAL_FAIL_THETA = -0.12;
