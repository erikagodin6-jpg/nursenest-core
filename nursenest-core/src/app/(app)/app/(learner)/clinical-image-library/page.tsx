import type { Metadata } from "next";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import type { BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";
import { ClinicalImageLibraryClient } from "@/components/clinical-images/clinical-image-library-client";
import {
  clinicalImageCoverageByCategory,
  listClinicalImageLibraryItems,
} from "@/lib/clinical-images/clinical-image-library";

export const metadata: Metadata = {
  title: "Clinical image library | NurseNest",
  description: "Accessible visual learning library for clinical image questions, hotspot prompts, SATA image items, and clinical judgment cases.",
  robots: { index: false, follow: false },
};

const breadcrumbResolution: BreadcrumbResolution = {
  crumbs: [
    { name: "App", href: "/app" },
    { name: "Clinical Image Library", href: "/app/clinical-image-library" },
  ],
  schemaItems: [],
  schemaOwner: "none",
};

export default function ClinicalImageLibraryPage() {
  const items = listClinicalImageLibraryItems();
  const coverage = clinicalImageCoverageByCategory(items);

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail resolution={breadcrumbResolution} pathname="/app/clinical-image-library" />
      <ClinicalImageLibraryClient items={items} coverage={coverage} />
    </div>
  );
}
