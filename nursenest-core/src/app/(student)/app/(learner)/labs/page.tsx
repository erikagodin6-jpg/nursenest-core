import type { Metadata } from "next";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LabsHubPage } from "@/components/labs/labs-hub-page";
import {
  buildLabsStudyLinks,
  countLabsInventoryForTrack,
  listLabCategoriesForTrack,
} from "@/lib/labs/labs-engine";
import { loadLabsRouteContext } from "@/lib/labs/labs-route-loader";

export const metadata: Metadata = {
  title: "Labs | NurseNest",
  description: "Clinical lab interpretation, trend recognition, and scenario-based nursing study.",
};

export default async function LabsHubRoute() {
  const context = await loadLabsRouteContext("(student).app.(learner).labs");
  const categories = listLabCategoriesForTrack(context.track);
  const inventory = countLabsInventoryForTrack(context.track);
  const studyLinks = buildLabsStudyLinks(context.pathwayId);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <BreadcrumbTrail
          items={[
            { name: "Home", href: "/" },
            { name: "Dashboard", href: "/app" },
            { name: "Labs", href: undefined },
          ]}
        />
      </div>
      <LabsHubPage
        trackLabel={context.trackLabel}
        hasAccess={context.hasAccess}
        categories={categories}
        inventory={inventory}
        studyLinks={studyLinks}
      />
    </div>
  );
}
