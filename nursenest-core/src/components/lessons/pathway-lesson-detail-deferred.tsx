import { PathwayLessonRelatedQuestions } from "@/components/lessons/pathway-lesson-related-questions";
import { PathwayLessonStudyLoopCta } from "@/components/lessons/pathway-lesson-study-loop-cta";
import { PathwayLessonWayfinding } from "@/components/lessons/pathway-lesson-wayfinding";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { loadRelatedExamQuestionStemsForPathwayLesson } from "@/lib/lessons/lesson-question-cross-links";
import {
  getRelatedPathwayLessons,
  RELATED_PATHWAY_LESSONS_LIMIT,
} from "@/lib/lessons/pathway-lesson-loader";
import { mergeRelatedLessonDisplayList, pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonDeferredServerSnapshot } from "@/lib/lessons/marketing-pathway-lesson-client-contract";

/**
 * Secondary lesson-detail payload: related questions + study-loop CTAs.
 * Render inside `<Suspense>` so the main article shell can stream first under load.
 *
 * **`lesson` is a server-only snapshot without `sections[]`** — built via `toPathwayLessonDeferredServerSnapshot`
 * so full article bodies never cross this boundary.
 */
export async function PathwayLessonDetailDeferred({
  pathway,
  lesson,
  lessonsBasePath,
  contentLocale,
}: {
  pathway: ExamPathwayDefinition;
  lesson: PathwayLessonDeferredServerSnapshot;
  lessonsBasePath: string;
  contentLocale: string;
}) {
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

  return (
    <>
      <PathwayLessonWayfinding
        pathway={pathway}
        lessonsBasePath={lessonsBasePath}
        lessonTopic={lesson.topic}
        topicSlug={lesson.topicSlug}
        currentSlug={lesson.slug}
        relatedLessonRefs={lesson.relatedLessonRefs}
      />
      <PathwayLessonRelatedQuestions
        pathway={pathway}
        lessonTopic={lesson.topic}
        topicSlug={lesson.topicSlug}
        items={relatedQuestionStems}
      />
      <PathwayLessonStudyLoopCta
        pathway={pathway}
        lessonsBasePath={lessonsBasePath}
        topicLabel={lesson.topic}
        topicSlug={lesson.topicSlug}
        relatedLessons={relatedDisplay}
        currentSlug={lesson.slug}
        catAuthState="public"
      />
    </>
  );
}

/** Shown while related-lesson + question-stem queries resolve (streaming slot). */
export function PathwayLessonDetailDeferredSkeleton() {
  return (
    <div
      className="mx-auto mt-10 max-w-[42rem] space-y-8"
      aria-busy="true"
      aria-label="Loading related practice"
    >
      <div className="h-28 animate-pulse rounded-xl bg-muted/20" />
      <div className="h-44 animate-pulse rounded-xl bg-muted/15" />
    </div>
  );
}
