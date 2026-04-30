import type { Metadata } from "next";
import Link from "next/link";
import { StudyToolsActivityShell } from "@/components/study-tools/study-tools-activity-shell";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";
import { listPublicCommunityVerifiedStudyDecks } from "@/lib/verified-study/verified-study-decks.server";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export async function generateMetadata(): Promise<Metadata> {
  return buildStudyToolsActivityMetadata("Community study decks");
}

async function pathwayIdFromSearch(sp: PageProps["searchParams"]): Promise<string | null> {
  const raw = await sp;
  const pid = raw.pathwayId;
  if (typeof pid === "string" && pid.trim()) return pid.trim();
  if (Array.isArray(pid) && typeof pid[0] === "string" && pid[0].trim()) return pid[0].trim();
  return null;
}

export default async function VerifiedStudyPublicDecksPage({ searchParams }: PageProps) {
  const pathwayId = await pathwayIdFromSearch(searchParams);
  const decks = pathwayId ? await listPublicCommunityVerifiedStudyDecks(pathwayId) : [];

  return (
    <StudyToolsActivityShell
      title="Community decks"
      description="Only NurseNest-verified, reference-backed decks that cleared moderation appear here."
      pathwayId={pathwayId}
    >
      {!pathwayId ? (
        <p className="text-sm text-[var(--semantic-warning)]">Add pathwayId to the query string.</p>
      ) : decks.length === 0 ? (
        <p className="text-sm text-[var(--theme-body-text)]">No published community decks for this pathway yet.</p>
      ) : (
        <ul className="space-y-2">
          {decks.map((d) => (
            <li key={d.id}>
              <Link
                href={withStudyToolPathwayQuery(`${STUDY_TOOL_ROUTES.decks}/${d.id}`, pathwayId)}
                className="block rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--bg-card))] px-3 py-2 text-sm font-medium text-[var(--semantic-text-primary)]"
              >
                {d.title}{" "}
                <span className="text-xs font-normal text-[var(--theme-body-text)]">· {d._count.cards} cards</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </StudyToolsActivityShell>
  );
}
