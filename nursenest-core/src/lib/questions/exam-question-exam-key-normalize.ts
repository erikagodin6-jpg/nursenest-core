/**
 * Single entry point for normalizing `ExamQuestion.exam` on writes (imports, generators, merges).
 * Re-exports the canonical pathway-aligned normalizer from content-quality.
 */
export {
  canonicalExamQuestionExamForDbWrite as normalizeExamQuestionExamKey,
  coerceRecordedExamQuestionExamValue,
  normalizeExamQuestionExamForStorage,
  normExamKeyForMatching,
  expandedExamKeysForPathwayPool,
  examKeyNormsForPathwayPool,
  examQuestionExamNormExprSql,
  examQuestionExamNormInSql,
} from "@/lib/content-quality/exam-question-exam-normalization";
