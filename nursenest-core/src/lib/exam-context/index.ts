/**
 * Global exam context — registry, terminology, guardrails, and query helpers.
 * Add new countries by extending Prisma CountryCode + EXAM_PATHWAYS + terminology profiles.
 */
export type {
  ExamCountryCode,
  ExamLanguageCode,
  ExamProductKey,
  ExamRegistryKey,
  ExamTierLabel,
  GlobalExamContext,
} from "@/lib/exam-context/global-exam-context";
export { ExamContextError, examContextAnalyticsProps, requireGlobalExamContext } from "@/lib/exam-context/global-exam-context";

export type { ExamRegistryEntry, TerminologyProfileId } from "@/lib/exam-context/exam-registry";
export {
  buildGlobalExamContext,
  EXAM_REGISTRY_BY_KEY,
  EXAM_REGISTRY_BY_PATHWAY_ID,
  getExamRegistryEntryByPathwayId,
  getExamRegistryEntryByRegistryKey,
  registryKeyFromPathway,
} from "@/lib/exam-context/exam-registry";

export type { TerminologyKey } from "@/lib/exam-context/terminology";
export { getTerminology, getTerminologyForPathway } from "@/lib/exam-context/terminology";

export type { ContentGuardrailViolation } from "@/lib/exam-context/content-guardrails";
export { validateLearnerCopyForExamContext } from "@/lib/exam-context/content-guardrails";

export { examQuestionPoolWhereForContext, pathwayLessonWhere } from "@/lib/exam-context/query-scope";
