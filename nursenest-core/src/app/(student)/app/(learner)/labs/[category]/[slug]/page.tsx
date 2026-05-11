import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LabLessonPage } from "@/components/labs/lab-lesson-page";
import {
  buildLabsStudyLinks,
  getLabLessonByCategoryAndSlug,
  getLabLessonFlashcards,
  getLabLessonQuestions,
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

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <BreadcrumbTrail
          items={[
            { name: "Home", href: "/" },
            { name: "Dashboard", href: "/app" },
            { name: "Labs", href: "/app/labs" },
            { name: lesson.shortTitle, href: undefined },
          ]}
        />
      </div>
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
