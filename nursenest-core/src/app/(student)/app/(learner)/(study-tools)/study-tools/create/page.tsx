import type { Metadata } from "next";
import { StudyToolsActivityShell } from "@/components/study-tools/study-tools-activity-shell";
import { VerifiedStudyCreateDeckForm } from "@/components/verified-study/verified-study-create-deck-form";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export async function generateMetadata(): Promise<Metadata> {
  return buildStudyToolsActivityMetadata("Create study deck");
}

async function pathwayIdFromSearch(sp: PageProps["searchParams"]): Promise<string | null> {
  const raw = await sp;
  const pid = raw.pathwayId;
  if (typeof pid === "string" && pid.trim()) return pid.trim();
  if (Array.isArray(pid) && typeof pid[0] === "string" && pid[0].trim()) return pid[0].trim();
  return null;
}

export default async function VerifiedStudyCreateDeckPage({ searchParams }: PageProps) {
  const pathwayId = await pathwayIdFromSearch(searchParams);
  return (
    <StudyToolsActivityShell
      title="Create a deck"
      description="New decks start private. Public or community visibility stays in moderation until references and clinical verification pass."
      pathwayId={pathwayId}
    >
      {!pathwayId ? (
        <p className="text-sm text-[var(--semantic-warning)]">Add pathwayId to the query string first.</p>
      ) : (
        <VerifiedStudyCreateDeckForm pathwayId={pathwayId} />
      )}
    </StudyToolsActivityShell>
  );
}
