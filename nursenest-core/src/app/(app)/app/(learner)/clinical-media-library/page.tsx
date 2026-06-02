import type { Metadata } from "next";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { ClinicalMediaLibraryClient } from "@/components/clinical-media/clinical-media-library-client";
import {
  clinicalMediaCoverageByType,
  clinicalMediaPathwayCoverage,
  listClinicalMediaAssets,
} from "@/lib/clinical-media/clinical-media-library";
import type { BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";

export const metadata: Metadata = {
  title: "Clinical media library | NurseNest",
  description: "Reusable respiratory sounds, cardiac sounds, ECG visuals, and clinical media assets for pathway-aware clinical judgment learning.",
  robots: { index: false, follow: false },
};

const breadcrumbResolution: BreadcrumbResolution = {
  crumbs: [
    { name: "App", href: "/app" },
    { name: "Clinical Media Library", href: "/app/clinical-media-library" },
  ],
  schemaItems: [],
  schemaOwner: "none",
};

export default function ClinicalMediaLibraryPage() {
  const items = listClinicalMediaAssets();
  const typeCoverage = clinicalMediaCoverageByType(items);
  const pathwayCoverage = clinicalMediaPathwayCoverage(items);

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail resolution={breadcrumbResolution} pathname="/app/clinical-media-library" />
      <ClinicalMediaLibraryClient
        items={items}
        typeCoverage={typeCoverage}
        pathwayCoverage={pathwayCoverage}
      />
    </div>
  );
}
