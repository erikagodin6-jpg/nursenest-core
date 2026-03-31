/** Tag applied to `exam_questions.tags` for the RN/PN Replit materialization batch (mixed practice draw). */
export const MIXED_PRACTICE_2026_RN_PN_TAG = "mixed-practice-2026-rn-pn";

/** Tag for RN-only pool (questions carry `exam_questions.tier` = `rn`). */
export const EXAM_PRESET_RN_MIXED_2026_TAG = "exam-preset-rn-mixed-2026";

/** Tag for PN-only pool (questions carry `rpn` / `lvn` tiers). */
export const EXAM_PRESET_PN_MIXED_2026_TAG = "exam-preset-pn-mixed-2026";

/** Default length for preset sessions when using a tagged pool (20 items). */
export const MIXED_PRACTICE_2026_QUESTION_TARGET = 20;

/** `Exam` row id (upserted by `scripts/apply-materialized-rn-pn-batch.ts`). Tier `RPN` so RN and PN ladders can record attempts. */
export const MIXED_PRACTICE_2026_EXAM_ID = "exam_mixed_practice_2026_rn_pn";

/** RN-only mixed preset — tier `RN` on `Exam` (RN/NP subscribers). */
export const EXAM_RN_MIXED_PRACTICE_2026_ID = "exam_rn_mixed_practice_2026";

/** PN-only mixed preset — tier `RPN` on `Exam` (RPN + higher ladders). */
export const EXAM_PN_MIXED_PRACTICE_2026_ID = "exam_pn_mixed_practice_2026";

/** Tag for NP clinical pool (`exam_questions.tier` = `np`). */
export const EXAM_PRESET_NP_CLINICAL_2026_TAG = "exam-preset-np-clinical-2026";

/** NP preset session length (server shuffles tagged pool then slices). */
export const NP_CLINICAL_2026_QUESTION_TARGET = 25;

/** NP-only exam — tier `NP` on `Exam` (NP subscribers only). */
export const EXAM_NP_CLINICAL_PRACTICE_2026_ID = "exam_np_clinical_practice_2026";

/** Country + track full exams (75 Q), tagged in materialized batch. */
export const FULL_EXAM_2026_QUESTION_TARGET = 75;
export const EXAM_PRESET_US_RN_FULL_2026_TAG = "exam-preset-us-rn-full-2026";
export const EXAM_PRESET_CA_RN_FULL_2026_TAG = "exam-preset-ca-rn-full-2026";
export const EXAM_PRESET_US_PN_FULL_2026_TAG = "exam-preset-us-pn-full-2026";
export const EXAM_PRESET_CA_RPN_FULL_2026_TAG = "exam-preset-ca-rpn-full-2026";
export const EXAM_US_RN_FULL_2026_ID = "exam_us_rn_full_2026";
export const EXAM_CA_RN_FULL_2026_ID = "exam_ca_rn_full_2026";
export const EXAM_US_PN_FULL_2026_ID = "exam_us_pn_full_2026";
export const EXAM_CA_RPN_FULL_2026_ID = "exam_ca_rpn_full_2026";
