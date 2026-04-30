import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { StudyToolsActivityShell } from "@/components/study-tools/study-tools-activity-shell";
import { StudyToolsWorkspaceClient } from "@/components/study-tools/study-tools-workspace-client";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";
import { pathwayIdFromLearnerSearchParams } from "@/lib/study-tools/study-tools-page-params.server";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export async function generateMetadata(): Promise<Metadata> {
  return buildStudyToolsActivityMetadata("Ordering");
}

export default async function OrderingStudyToolsPage({ searchParams }: PageProps) {
  const pathwayId = await pathwayIdFromLearnerSearchParams(searchParams);
  const session = await getProtectedRouteSession("(student).app.(learner).study-tools.ordering");
  const userId = (session?.user as { id?: string })?.id ?? "";
  return (
    <StudyToolsActivityShell
      title="Ordering practice"
      description="Reorder clinical and safety sequences aligned to canonical study categories (pathway-agnostic templates plus your filters)."
      pathwayId={pathwayId}
    >
      <StudyToolsWorkspaceClient
        userId={userId}
        pathwayId={pathwayId}
        mode="ordering"
        heroTitle="Ordering"
        heroSubtitle="Tap steps in the correct order. Sequences map to the same canonical buckets as practice and flashcards."
      />
    </StudyToolsActivityShell>
  );
}
