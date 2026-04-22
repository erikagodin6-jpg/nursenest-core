import { LessonTopicPracticeSection } from "@/components/lessons/lesson-topic-practice-section";
import { PathwayLessonStudyLoopCta } from "@/components/lessons/pathway-lesson-study-loop-cta";
import { PathwayLessonWayfinding } from "@/components/lessons/pathway-lesson-wayfinding";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { loadPathwayLessonDeferredPracticeBundle } from "@/lib/lessons/pathway-lesson-deferred-practice-data";
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
  bankEntitlement,
  fullQuizAccess,
  userId,
}: {
  pathway: ExamPathwayDefinition;
  lesson: PathwayLessonDeferredServerSnapshot;
  lessonsBasePath: string;
  contentLocale: string;
  bankEntitlement: AccessScope | null;
  fullQuizAccess: boolean;
  userId: string;
}) {
  const bundle = await loadPathwayLessonDeferredPracticeBundle(pathway.id, contentLocale, lesson);
  const relatedQuestionStems = bundle?.relatedQuestionStems ?? [];
  const relatedDisplay = bundle?.relatedDisplay ?? [];

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
      <div className="xl:hidden">
        <LessonTopicPracticeSection
          pathway={pathway}
          lessonTopic={lesson.topic}
          topicSlug={lesson.topicSlug}
          lessonSlug={lesson.slug}
          relatedQuestionStems={relatedQuestionStems}
          bankEntitlement={bankEntitlement}
          fullQuizAccess={fullQuizAccess}
          userId={userId}
        />
      </div>
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

/** Sticky-rail related stems — shares {@link loadPathwayLessonDeferredPracticeBundle} with the footer lane. */
export async function PathwayLessonDeferredRelatedRail({
  pathway,
  lesson,
  contentLocale,
  bankEntitlement,
  fullQuizAccess,
  userId,
}: {
  pathway: ExamPathwayDefinition;
  lesson: PathwayLessonDeferredServerSnapshot;
  contentLocale: string;
  bankEntitlement: AccessScope | null;
  fullQuizAccess: boolean;
  userId: string;
}) {
  const bundle = await loadPathwayLessonDeferredPracticeBundle(pathway.id, contentLocale, lesson);
  if (!bundle) return null;
  return (
    <LessonTopicPracticeSection
      pathway={pathway}
      lessonTopic={lesson.topic}
      topicSlug={lesson.topicSlug}
      lessonSlug={lesson.slug}
      relatedQuestionStems={bundle.relatedQuestionStems}
      bankEntitlement={bankEntitlement}
      fullQuizAccess={fullQuizAccess}
      userId={userId}
      compact
    />
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

/** Compact skeleton for the sticky study rail’s deferred question stems. */
export function PathwayLessonRelatedRailSkeleton() {
  return (
    <div
      className="min-h-[10rem] rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]/40 p-4"
      aria-busy="true"
      aria-label="Loading related questions"
    >
      <div className="h-4 w-40 animate-pulse rounded bg-muted/30" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-muted/25" />
        <div className="h-3 w-[92%] animate-pulse rounded bg-muted/25" />
        <div className="h-3 w-[88%] animate-pulse rounded bg-muted/25" />
      </div>
      <div className="mt-4 h-9 w-full animate-pulse rounded-full bg-muted/20" />
    </div>
  );
}
