import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StudyToolsActivityShell } from "@/components/study-tools/study-tools-activity-shell";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";
import { getVerifiedStudyDeckForViewer } from "@/lib/verified-study/verified-study-decks.server";

type PageProps = {
  params: Promise<{ deckId: string }>;
  searchParams: Promise<{ unlistedSlug?: string | string[]; pathwayId?: string | string[] }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return buildStudyToolsActivityMetadata("Study deck");
}

async function firstString(v: string | string[] | undefined): Promise<string | null> {
  if (typeof v === "string" && v.trim()) return v.trim();
  if (Array.isArray(v) && typeof v[0] === "string" && v[0].trim()) return v[0].trim();
  return null;
}

export default async function VerifiedStudyDeckDetailPage({ params, searchParams }: PageProps) {
  const { deckId } = await params;
  const sp = await searchParams;
  const unlistedSlug = await firstString(sp.unlistedSlug);
  const pathwayHint = await firstString(sp.pathwayId);

  const session = await getProtectedRouteSession("(student).app.(learner).study-tools.deck-detail");
  const userId = (session?.user as { id?: string })?.id ?? "";
  if (!userId) notFound();

  const res = await getVerifiedStudyDeckForViewer({ viewerId: userId, deckId, unlistedSlug });
  if (!res.ok) notFound();

  const pathwayId = pathwayHint ?? res.deck.pathwayId;
  const backHref = withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.decks, pathwayId);

  return (
    <StudyToolsActivityShell
      title={res.deck.title}
      description={
        res.deck.description ??
        "Verified study card deck — study modes (flip, matching, SR) will plug in here without changing core flashcard routes."
      }
      pathwayId={pathwayId}
    >
      <p className="text-xs text-[var(--theme-body-text)]">
        Visibility: <span className="font-semibold text-[var(--semantic-text-primary)]">{res.deck.visibility}</span> ·
        Verification:{" "}
        <span className="font-semibold text-[var(--semantic-chart-2)]">{res.deck.verificationStatus}</span> ·
        Moderation:{" "}
        <span className="font-semibold text-[var(--semantic-chart-3)]">{res.deck.moderationStatus}</span>
      </p>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href={backHref}
          className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1 text-[var(--semantic-text-primary)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))]"
        >
          All decks
        </Link>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-[var(--semantic-info)]">Cards ({res.cards.length})</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--semantic-text-primary)]">
          {res.cards.map((c) => (
            <li key={c.id} className="rounded-md border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] p-2">
              <p className="font-medium">{c.promptFront}</p>
              <p className="text-[var(--theme-body-text)]">{c.answerBack}</p>
            </li>
          ))}
        </ol>
      </section>
    </StudyToolsActivityShell>
  );
}
