import type { Metadata } from "next";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { LabsHubPage } from "@/components/labs/labs-hub-page";
import {
  buildLabsStudyLinks,
  countLabsInventoryForTrack,
  listLabCategoriesForTrack,
} from "@/lib/labs/labs-engine";
import { loadLabsRouteContext } from "@/lib/labs/labs-route-loader";

export const metadata: Metadata = {
  title: "Labs | NurseNest",
  description: "Clinical lab reasoning engine: prioritization, trends, patterns, and integrated study loops.",
};

export default async function LabsHubRoute() {
  const context = await loadLabsRouteContext("(student).app.(learner).labs");
  const entitlementScope = context.entitlement !== "error" ? context.entitlement : undefined;
  const categories = listLabCategoriesForTrack(context.track, entitlementScope);
  const inventory = countLabsInventoryForTrack(context.track, entitlementScope);
  const studyLinks = buildLabsStudyLinks(context.pathwayId);

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail kind="labs-hub" pathname="/app/labs" />
      <LabsHubPage
        trackLabel={context.trackLabel}
        labTrack={context.track}
        hasAccess={context.hasAccess}
        categories={categories}
        inventory={inventory}
        studyLinks={studyLinks}
      />
    </div>
  );
}
