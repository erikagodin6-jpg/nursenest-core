/**
 * **Lesson ↔ question rationale mapping** — systematic registry + ranked matching.
 *
 * - **Registry:** `LESSON_RATIONALE_MAPPING_ENTRIES` maps haystack patterns + optional topic/tag bonuses
 *   to `lessonSlug`, with pathway and country gates.
 * - **Ranking:** `rankRelatedLessonSlugsForQuestion` scores, dedupes by slug, applies diversity caps.
 * - **Pathway:** use `pathwayRationaleContextFromId` before ranking for region/role-aware gates.
 */
export type {
  LessonConceptDomain,
  LessonRationaleMappingEntry,
  PathwayRationaleContext,
  QuestionRationaleSignals,
  RankedLessonSlug,
  RankRelatedLessonSlugsOptions,
  RationaleLessonLinkKind,
} from "@/lib/learner/lesson-question-rationale/types";

export { LESSON_RATIONALE_MAPPING_ENTRIES } from "@/lib/learner/lesson-question-rationale/registry";
export {
  haystackFromQuestionSignals,
  rankRelatedLessonSlugsForQuestion,
} from "@/lib/learner/lesson-question-rationale/match";
export { pathwayRationaleContextFromId } from "@/lib/learner/lesson-question-rationale/pathway-context";
