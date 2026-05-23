import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { StudyToolsActivityShell } from "@/components/study-tools/study-tools-activity-shell";
import { StudyToolsWorkspaceClient } from "@/components/study-tools/study-tools-workspace-client";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";
import { pathwayIdFromLearnerSearchParams } from "@/lib/study-tools/study-tools-page-params.server";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export async function generateMetadata(): Promise<Metadata> {
  return buildStudyToolsActivityMetadata("Lab drills");
}

export default async function LabDrillsStudyToolsPage({ searchParams }: PageProps) {
  const pathwayId = await pathwayIdFromLearnerSearchParams(searchParams);
  const session = await getProtectedRouteSession("(student).app.(learner).study-tools.lab-drills");
  const userId = (session?.user as { id?: string })?.id ?? "";
  return (
    <StudyToolsActivityShell
      title="Lab value drills"
      description="Items pulled from pathway-scoped questions with lab-rich stems or rationales."
      pathwayId={pathwayId}
    >
      <StudyToolsWorkspaceClient
        userId={userId}
        pathwayId={pathwayId}
        mode="lab_drills"
        heroTitle="Lab drills"
        heroSubtitle="Short-answer checks against numeric tokens or protocol-style accept lists."
      />
    </StudyToolsActivityShell>
  );
}
