/**
 * Exam-complete **medication + safety family** injectables — merged Wave1 bulk rows.
 * @see exam-complete-med-rows.ts and exam-complete-safety-rows.ts
 */
import { MED_FAMILY_ROWS } from "@/lib/lessons/scoped-lessons/exam-complete-med-rows";
import { SAFETY_FAMILY_ROWS } from "@/lib/lessons/scoped-lessons/exam-complete-safety-rows";

/** 9 medication + 8 safety families (17 total). High-alert meds remain a separate canonical lesson — linked, not duplicated. */
export const EXAM_COMPLETE_MED_SAFETY_ROWS = [...MED_FAMILY_ROWS, ...SAFETY_FAMILY_ROWS];
