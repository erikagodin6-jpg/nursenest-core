import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { pathwayLessonPublicDetailPath } from "@/lib/lessons/pathway-lesson-types";
import { HUB } from "@/lib/marketing/marketing-entry-routes";

/**
 * Hrefs already surfaced in the lesson detail footer / category strip — omit from
 * {@link AutomaticRelatedContentForPublic} to avoid duplicate link blocks.
 */
export function buildLessonDetailAutomaticRelatedExcludeHrefs(input: {
  pathway: ExamPathwayDefinition;
  lessonSlug: string;
  lessonTopicSlug: string;
  blogHubPath: string;
}): string[] {
  const { pathway, lessonSlug, lessonTopicSlug, blogHubPath } = input;
  const self = pathwayLessonPublicDetailPath(pathway, lessonSlug);
  const topicTag = `/blog/tag/${encodeURIComponent(lessonTopicSlug.trim())}`;
  const lessonsHub = marketingPathwayLessonsIndexPath(pathway);
  const pathwayHub = buildExamPathwayPath(pathway);
  const pathwayQuestions = buildExamPathwayPath(pathway, "questions");

  return [
    self,
    blogHubPath,
    topicTag,
    HUB.flashcards,
    HUB.questionBank,
    HUB.examLessons,
    HUB.practiceExams,
    "/tools",
    "/lessons",
    "/blog",
    pathwayHub,
    lessonsHub,
    pathwayQuestions,
    buildExamPathwayPath(pathway, "flashcards"),
    buildExamPathwayPath(pathway, "cat"),
  ].filter((href): href is string => typeof href === "string" && href.length > 0);
}
