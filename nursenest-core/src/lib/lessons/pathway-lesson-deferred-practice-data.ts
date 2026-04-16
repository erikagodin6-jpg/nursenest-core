import { cache } from "react";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { loadRelatedExamQuestionStemsForPathwayLesson } from "@/lib/lessons/lesson-question-cross-links";
import {
  getRelatedPathwayLessons,
  RELATED_PATHWAY_LESSONS_LIMIT,
} from "@/lib/lessons/pathway-lesson-loader";
import type { PathwayLessonDeferredServerSnapshot } from "@/lib/lessons/marketing-pathway-lesson-client-contract";
import { mergeRelatedLessonDisplayList, pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";

export type PathwayLessonDeferredPracticeBundle = {
  relatedDisplay: { slug: string; title: string }[];
  relatedQuestionStems: Awaited<ReturnType<typeof loadRelatedExamQuestionStemsForPathwayLesson>>;
};

/**
 * Related lessons + question stems for lesson detail footers and side rails.
 * Wrapped in `cache()` so multiple deferred server components can share one request without duplicate queries.
 */
export const loadPathwayLessonDeferredPracticeBundle = cache(
  async (
    pathwayId: string,
    contentLocale: string,
    lesson: PathwayLessonDeferredServerSnapshot,
  ): Promise<PathwayLessonDeferredPracticeBundle | null> => {
    const pathway = getExamPathwayById(pathwayId);
    if (!pathway) return null;
    const [relatedRaw, relatedQuestionStems] = await Promise.all([
      getRelatedPathwayLessons(pathway.id, lesson.topicSlug, lesson.slug, undefined, contentLocale, lesson.bodySystem),
      loadRelatedExamQuestionStemsForPathwayLesson({
        pathway,
        lessonSlug: lesson.slug,
        lessonTitle: lesson.title,
        lessonTopic: lesson.topic,
        lessonTopicSlug: lesson.topicSlug,
        bodySystem: lesson.bodySystem,
      }),
    ]);
    const relatedTopicRows = relatedRaw.filter(pathwayLessonHasRenderableHubSlug);
    const relatedDisplay = mergeRelatedLessonDisplayList(
      lesson.relatedLessonRefs,
      relatedTopicRows,
      RELATED_PATHWAY_LESSONS_LIMIT,
    );
    return { relatedDisplay, relatedQuestionStems };
  },
);
