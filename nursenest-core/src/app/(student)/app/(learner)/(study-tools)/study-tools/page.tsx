import type { Metadata } from "next";
import { StudyToolsActivityShell } from "@/components/study-tools/study-tools-activity-shell";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export async function generateMetadata(): Promise<Metadata> {
  return buildStudyToolsActivityMetadata("Study hub");
}

async function pathwayIdFromSearch(sp: PageProps["searchParams"]): Promise<string | null> {
  const raw = await sp;
  const pid = raw.pathwayId;
  if (typeof pid === "string" && pid.trim()) return pid.trim();
  if (Array.isArray(pid) && typeof pid[0] === "string" && pid[0].trim()) return pid[0].trim();
  return null;
}

export default async function StudyToolsHubPage({ searchParams }: PageProps) {
  const pathwayId = await pathwayIdFromSearch(searchParams);
  return (
    <StudyToolsActivityShell
      title="Study tools hub"
      description="Central entry for Quizlet-style activities: matching, fill-in-the-blank, ordering, and drills. Launch is gated by NEXT_PUBLIC_ENABLE_STUDY_TOOLS."
      pathwayId={pathwayId}
    />
  );
}
