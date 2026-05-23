import type { Metadata } from "next";
import Link from "next/link";
import { StudyToolsActivityShell } from "@/components/study-tools/study-tools-activity-shell";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";
import { listVerifiedStudyDecksForPathway } from "@/lib/verified-study/verified-study-decks.server";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export async function generateMetadata(): Promise<Metadata> {
  return buildStudyToolsActivityMetadata("Verified study decks");
}

async function pathwayIdFromSearch(sp: PageProps["searchParams"]): Promise<string | null> {
  const raw = await sp;
  const pid = raw.pathwayId;
  if (typeof pid === "string" && pid.trim()) return pid.trim();
  if (Array.isArray(pid) && typeof pid[0] === "string" && pid[0].trim()) return pid[0].trim();
  return null;
}

export default async function VerifiedStudyDecksPage({ searchParams }: PageProps) {
  const pathwayId = await pathwayIdFromSearch(searchParams);
  const session = await getProtectedRouteSession("(student).app.(learner).study-tools.decks");
  const userId = (session?.user as { id?: string })?.id ?? "";

  const decks =
    userId && pathwayId ? await listVerifiedStudyDecksForPathway({ userId, pathwayId }) : [];

  return (
    <StudyToolsActivityShell
      title="Verified study decks"
      description="Private, shared, and moderated community decks scoped to your pathway. Public clinical decks require references, verification, and staff approval."
      pathwayId={pathwayId}
    >
      {!pathwayId ? (
        <p className="text-sm text-[var(--semantic-warning)]">Add pathwayId to the query string to list decks.</p>
      ) : decks.length === 0 ? (
        <p className="text-sm text-[var(--theme-body-text)]">No decks yet for this pathway.</p>
      ) : (
        <ul className="space-y-2">
          {decks.map((d) => (
            <li key={d.id}>
              <Link
                href={`${withStudyToolPathwayQuery(`${STUDY_TOOL_ROUTES.decks}/${d.id}`, pathwayId)}`}
                className="block rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_10%,var(--bg-card))] px-3 py-2 text-sm font-medium text-[var(--semantic-text-primary)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))]"
              >
                {d.title}{" "}
                <span className="text-xs font-normal text-[var(--theme-body-text)]">
                  · {d.visibility.toLowerCase()} · {d.cardCount} cards
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </StudyToolsActivityShell>
  );
}
