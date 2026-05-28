import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { MedCalculationsLessonPage } from "@/components/med-calculations/med-calculations-lesson-page";
import {
  buildMedCalcStudyLinks,
  getMedCalcFlashcards,
  getMedCalcLessonByCategoryAndSlug,
  getMedCalcQuestions,
  listMedCalcCategoriesForTrack,
  type MedCalcCategorySlug,
} from "@/lib/med-calculations/med-calculations-engine";
import { auth } from "@/lib/auth";
import { loadMedCalcLessonProgressForLesson } from "@/lib/med-calculations/med-calc-lesson-progress";
import { loadMedCalculationsRouteContext } from "@/lib/med-calculations/med-calculations-route-loader";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const context = await loadMedCalculationsRouteContext("(student).app.(learner).med-calculations.[category].[slug].metadata");
  const lesson = getMedCalcLessonByCategoryAndSlug(category as MedCalcCategorySlug, slug, context.track);
  if (!lesson) return { title: "Medication Calculations | NurseNest" };
  return {
    title: `${lesson.title} | NurseNest`,
    description: lesson.description,
    robots: { index: false, follow: false },
  };
}

export default async function MedCalculationsLessonRoute({ params }: Props) {
  const { category, slug } = await params;
  const context = await loadMedCalculationsRouteContext("(student).app.(learner).med-calculations.[category].[slug]");
  const lesson = getMedCalcLessonByCategoryAndSlug(category as MedCalcCategorySlug, slug, context.track);
  if (!lesson) notFound();

  const questions = getMedCalcQuestions(lesson);
  const flashcards = getMedCalcFlashcards(lesson);
  const studyLinks = buildMedCalcStudyLinks(context.pathwayId, lesson.questionTopic);
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const initialProgress = userId
    ? await loadMedCalcLessonProgressForLesson(userId, context.track, lesson)
    : ("not_started" as const);
  const categoryLabel =
    listMedCalcCategoriesForTrack(context.track).find((c) => c.slug === lesson.category)?.title ?? category;

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail
        kind="med-cal-lesson"
        categoryLabel={categoryLabel}
        lessonTitle={lesson.shortTitle}
        pathname="/app/med-calculations"
      />
      <MedCalculationsLessonPage
        userId={context.userId}
        medTrack={context.track}
        initialProgress={initialProgress}
        lesson={lesson}
        questions={questions}
        flashcards={flashcards}
        hasAccess={context.hasAccess}
        trackLabel={context.trackLabel}
        studyLinks={studyLinks}
      />
    </div>
  );
}
