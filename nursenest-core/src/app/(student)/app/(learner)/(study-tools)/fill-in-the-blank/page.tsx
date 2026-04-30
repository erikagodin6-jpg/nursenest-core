import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { StudyToolsActivityShell } from "@/components/study-tools/study-tools-activity-shell";
import { StudyToolsWorkspaceClient } from "@/components/study-tools/study-tools-workspace-client";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";
import { pathwayIdFromLearnerSearchParams } from "@/lib/study-tools/study-tools-page-params.server";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export async function generateMetadata(): Promise<Metadata> {
  return buildStudyToolsActivityMetadata("Fill-in-the-blank");
}

export default async function FillInTheBlankStudyToolsPage({ searchParams }: PageProps) {
  const pathwayId = await pathwayIdFromLearnerSearchParams(searchParams);
  const session = await getProtectedRouteSession("(student).app.(learner).study-tools.fill-in-the-blank");
  const userId = (session?.user as { id?: string })?.id ?? "";
  return (
    <StudyToolsActivityShell
      title="Fill-in-the-blank"
      description="Cloze-style recall from stems in your pathway-scoped question bank."
      pathwayId={pathwayId}
    >
      <StudyToolsWorkspaceClient
        userId={userId}
        pathwayId={pathwayId}
        mode="fill_in_the_blank"
        heroTitle="Fill-in-the-blank"
        heroSubtitle="Blanks are derived from high-signal terms in item stems (bounded, non-destructive)."
      />
    </StudyToolsActivityShell>
  );
}
