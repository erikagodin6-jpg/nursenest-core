import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { StudyToolsActivityShell } from "@/components/study-tools/study-tools-activity-shell";
import { StudyToolsWorkspaceClient } from "@/components/study-tools/study-tools-workspace-client";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";
import { pathwayIdFromLearnerSearchParams } from "@/lib/study-tools/study-tools-page-params.server";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export async function generateMetadata(): Promise<Metadata> {
  return buildStudyToolsActivityMetadata("Matching");
}

export default async function MatchingStudyToolsPage({ searchParams }: PageProps) {
  const pathwayId = await pathwayIdFromLearnerSearchParams(searchParams);
  const session = await getProtectedRouteSession("(student).app.(learner).study-tools.matching");
  const userId = (session?.user as { id?: string })?.id ?? "";
  return (
    <StudyToolsActivityShell
      title="Matching game"
      description="Match stems to the keyed correct option from your pathway-scoped exam bank. Uses the same category model as flashcards and practice."
      pathwayId={pathwayId}
    >
      <StudyToolsWorkspaceClient
        userId={userId}
        pathwayId={pathwayId}
        mode="matching"
        heroTitle="Matching"
        heroSubtitle="Draws stems and keyed answers from published MCQs in your subscription scope."
      />
    </StudyToolsActivityShell>
  );
}
