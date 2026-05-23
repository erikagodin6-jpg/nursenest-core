import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { StudyToolsActivityShell } from "@/components/study-tools/study-tools-activity-shell";
import { StudyToolsWorkspaceClient } from "@/components/study-tools/study-tools-workspace-client";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";
import { pathwayIdFromLearnerSearchParams } from "@/lib/study-tools/study-tools-page-params.server";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export async function generateMetadata(): Promise<Metadata> {
  return buildStudyToolsActivityMetadata("Medication drills");
}

export default async function MedicationDrillsStudyToolsPage({ searchParams }: PageProps) {
  const pathwayId = await pathwayIdFromLearnerSearchParams(searchParams);
  const session = await getProtectedRouteSession("(student).app.(learner).study-tools.medication-drills");
  const userId = (session?.user as { id?: string })?.id ?? "";
  return (
    <StudyToolsActivityShell
      title="Medication drills"
      description="Combines pharmacology-scoped flashcards (when available) with medication-signal MCQs from the bank."
      pathwayId={pathwayId}
    >
      <StudyToolsWorkspaceClient
        userId={userId}
        pathwayId={pathwayId}
        mode="medication_drills"
        heroTitle="Medication drills"
        heroSubtitle="Front/back flashcard pairs plus pharmacology-pattern stems from your scoped exam pool."
      />
    </StudyToolsActivityShell>
  );
}
