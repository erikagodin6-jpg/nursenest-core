import type { Metadata } from "next";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { MedCalculationsHubPage } from "@/components/med-calculations/med-calculations-hub-page";
import {
  buildMedCalcStudyLinks,
  countMedCalcInventoryForTrack,
  listMedCalcCategoriesForTrack,
} from "@/lib/med-calculations/med-calculations-engine";
import { loadMedCalculationsRouteContext } from "@/lib/med-calculations/med-calculations-route-loader";

export const metadata: Metadata = {
  title: "Medication Calculations | NurseNest",
  description: "Medication calculations lessons, strict practice mode, and high-stakes nursing math training.",
};

export default async function MedCalculationsHubRoute() {
  const context = await loadMedCalculationsRouteContext("(student).app.(learner).med-calculations");
  const categories = listMedCalcCategoriesForTrack(context.track);
  const inventory = countMedCalcInventoryForTrack(context.track);
  const studyLinks = buildMedCalcStudyLinks(context.pathwayId);

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail kind="med-cal-hub" pathname="/app/med-calculations" />
      <MedCalculationsHubPage
        trackLabel={context.trackLabel}
        hasAccess={context.hasAccess}
        categories={categories}
        inventory={inventory}
        studyLinks={studyLinks}
      />
    </div>
  );
}
