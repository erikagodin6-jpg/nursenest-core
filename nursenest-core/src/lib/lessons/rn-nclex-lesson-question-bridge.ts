/**
 * Canonical entry point name for the RN NCLEX lesson ↔ question bank bridge.
 * Implementation: {@link ./rn-nclex-lesson-question-bank-bridge} (single source of truth; no DB access).
 */
export {
  RN_NCLEX_BRIDGE_MAX_CLAUSES,
  RN_NCLEX_PRIORITIZED_LESSON_SLUGS,
  getRnNclexLessonQuestionBankBridgeClauses,
  hasExplicitRnNclexLessonBridge,
} from "./rn-nclex-lesson-question-bank-bridge";
