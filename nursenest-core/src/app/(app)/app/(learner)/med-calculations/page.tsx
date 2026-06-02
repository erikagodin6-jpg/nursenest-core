import type { Metadata } from "next";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { MedCalculationsHubPage } from "@/components/med-calculations/med-calculations-hub-page";
import {
  buildMedCalcStudyLinks,
  countMedCalcInventoryForTrack,
  listMedCalcCategoriesForTrack,
} from "@/lib/med-calculations/med-calculations-engine";
import { auth } from "@/lib/auth";
import { aggregateMedCalcProgressCounts, loadMedCalcLessonProgressMap } from "@/lib/med-calculations/med-calc-lesson-progress";
import { listMedCalcLessonsForTrack } from "@/lib/med-calculations/med-calculations-engine";
import { pickMedCalcContinueTarget } from "@/lib/med-calculations/med-calc-workstation-nav";
import { loadMedCalculationsRouteContext } from "@/lib/med-calculations/med-calculations-route-loader";

export const metadata: Metadata = {
  title: "Medication Calculations | NurseNest",
  description: "Medication calculations lessons, strict practice mode, and high-stakes nursing math training.",
  robots: { index: false, follow: false },
};

export default async function MedCalculationsHubRoute() {
  const context = await loadMedCalculationsRouteContext("(student).app.(learner).med-calculations");
  const categories = listMedCalcCategoriesForTrack(context.track);
  const inventory = countMedCalcInventoryForTrack(context.track);
  const studyLinks = buildMedCalcStudyLinks(context.pathwayId);
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const allLessons = listMedCalcLessonsForTrack(context.track);
  const progressMap = userId ? await loadMedCalcLessonProgressMap(userId, context.track, allLessons) : {};
  const progressSummary = aggregateMedCalcProgressCounts(progressMap);
  const continueTarget = pickMedCalcContinueTarget(categories, progressMap, null);

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail kind="med-cal-hub" pathname="/app/med-calculations" />
      <MedCalculationsHubPage
        trackLabel={context.trackLabel}
        hasAccess={context.hasAccess}
        categories={categories}
        inventory={inventory}
        studyLinks={studyLinks}
        progressSummary={progressSummary}
        continueHref={continueTarget.href}
        continueTitle={continueTarget.title}
      />
    </div>
  );
}
