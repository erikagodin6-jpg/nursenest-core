import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { LabLessonPage } from "@/components/labs/lab-lesson-page";
import {
  buildLabsStudyLinks,
  getLabLessonByCategoryAndSlug,
  getLabLessonFlashcards,
  getLabLessonQuestions,
  LABS_CATEGORIES,
  type LabCategorySlug,
} from "@/lib/labs/labs-engine";
import { loadLabsRouteContext } from "@/lib/labs/labs-route-loader";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const context = await loadLabsRouteContext("(student).app.(learner).labs.[category].[slug].metadata");
  const entitlementScope = context.entitlement !== "error" ? context.entitlement : undefined;
  const lesson = getLabLessonByCategoryAndSlug(category as LabCategorySlug, slug, context.track, entitlementScope);
  if (!lesson) {
    return { title: "Labs | NurseNest" };
  }
  return {
    title: `${lesson.title} | NurseNest Labs`,
    description: lesson.description,
  };
}

export default async function LabLessonRoute({ params }: Props) {
  const { category, slug } = await params;
  const context = await loadLabsRouteContext("(student).app.(learner).labs.[category].[slug]");
  const entitlementScope = context.entitlement !== "error" ? context.entitlement : undefined;
  const lesson = getLabLessonByCategoryAndSlug(category as LabCategorySlug, slug, context.track, entitlementScope);
  if (!lesson) {
    notFound();
  }

  const questions = getLabLessonQuestions(lesson);
  const flashcards = getLabLessonFlashcards(lesson);
  const studyLinks = buildLabsStudyLinks(context.pathwayId, lesson.practiceQuestionTopic);
  const categoryLabel = LABS_CATEGORIES.find((c) => c.slug === lesson.category)?.title ?? category;

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail
        kind="labs-lesson"
        categoryLabel={categoryLabel}
        lessonTitle={lesson.shortTitle}
        pathname="/app/labs"
      />
      <LabLessonPage
        lesson={lesson}
        hasAccess={context.hasAccess}
        trackLabel={context.trackLabel}
        labTrack={context.track}
        questions={questions}
        flashcards={flashcards}
        studyLinks={studyLinks}
      />
    </div>
  );
}
