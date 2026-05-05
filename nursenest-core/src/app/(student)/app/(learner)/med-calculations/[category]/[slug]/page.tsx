import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { MedCalculationsLessonPage } from "@/components/med-calculations/med-calculations-lesson-page";
import {
  buildMedCalcStudyLinks,
  getMedCalcFlashcards,
  getMedCalcLessonByCategoryAndSlug,
  getMedCalcQuestions,
  type MedCalcCategorySlug,
} from "@/lib/med-calculations/med-calculations-engine";
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

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <BreadcrumbTrail
          items={[
            { name: "Home", href: "/" },
            { name: "Dashboard", href: "/app" },
            { name: "Medication calculations", href: "/app/med-calculations" },
            { name: lesson.shortTitle, href: undefined },
          ]}
        />
      </div>
      <MedCalculationsLessonPage
        userId={context.userId}
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
