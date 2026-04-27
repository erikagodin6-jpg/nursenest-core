import { cache } from "react";
import { pathwayLessonsSchemaDriftFromPrismaErrorMessage } from "@/lib/db/pathway-lessons-schema-contract";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { loadRelatedExamQuestionStemsForPathwayLesson } from "@/lib/lessons/lesson-question-cross-links";
import {
  getRelatedPathwayLessons,
  RELATED_PATHWAY_LESSONS_LIMIT,
} from "@/lib/lessons/pathway-lesson-loader";
import type { PathwayLessonDeferredServerSnapshot } from "@/lib/lessons/marketing-pathway-lesson-client-contract";
import { mergeRelatedLessonDisplayList, pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";
import { rethrowNextNavigationControlFlow } from "@/lib/next/navigation-abort";
import { safeServerLog } from "@/lib/observability/safe-server-log";

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
    try {
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
    } catch (e) {
      rethrowNextNavigationControlFlow(e);
      const msg = e instanceof Error ? e.message : String(e);
      const drift = pathwayLessonsSchemaDriftFromPrismaErrorMessage(msg);
      if (drift) {
        safeServerLog("pathway_lessons", "deferred_practice_bundle_schema_drift", {
          pathway_id: pathwayId,
          lesson_slug: lesson.slug.slice(0, 200),
          drift_code: drift.code,
        });
      } else {
        safeServerLog("pathway_lessons", "deferred_practice_bundle_failed", {
          pathway_id: pathwayId,
          lesson_slug: lesson.slug.slice(0, 200),
          detail: msg.slice(0, 400),
        });
      }
      return null;
    }
  },
);
