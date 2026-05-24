import type { Metadata } from "next";
import { StudyToolsActivityShell } from "@/components/study-tools/study-tools-activity-shell";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";
import { getPublishedFlashcardDecks } from "@/lib/flashcards/flashcard-session-dal.server";
import { FlashcardDeckList } from "@/components/flashcards/flashcard-deck-list";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getActiveSession } from "@/lib/flashcards/flashcard-session-dal.server";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export async function generateMetadata(): Promise<Metadata> {
  return buildStudyToolsActivityMetadata("Flashcards");
}

export default async function FlashcardsHubPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const raw = sp.pathwayId;
  const pathwayId =
    typeof raw === "string" && raw.trim() ? raw.trim()
    : Array.isArray(raw) && typeof raw[0] === "string" ? raw[0].trim()
    : null;

  const [session, decks] = await Promise.all([
    getProtectedRouteSession("flashcards.hub"),
    getPublishedFlashcardDecks({ pathwayId, limit: 50 }),
  ]);

  const userId = (session?.user as { id?: string })?.id ?? null;

  // Detect which decks have an active session for this user
  let activeSessionDeckIds: string[] = [];
  if (userId && decks.length > 0) {
    const checks = await Promise.all(
      decks.slice(0, 20).map(async (d) => {
        const s = await getActiveSession(userId, d.id);
        return s ? d.id : null;
      }),
    );
    activeSessionDeckIds = checks.filter((id): id is string => id !== null);
  }

  const decksHref = withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.flashcardsDecks, pathwayId);

  return (
    <StudyToolsActivityShell
      title="Flashcards"
      description="Study curated NCLEX-style flashcard decks. Your progress is saved automatically so you can pick up where you left off."
      pathwayId={pathwayId}
    >
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--semantic-info)]">
            Available decks{decks.length > 0 ? ` (${decks.length})` : ""}
          </h2>
          <a
            href={decksHref}
            className="text-xs text-[var(--semantic-brand)] hover:underline"
          >
            Browse all →
          </a>
        </div>

        <FlashcardDeckList
          decks={decks.slice(0, 8)}
          pathwayId={pathwayId}
          activeSessionDeckIds={activeSessionDeckIds}
        />
      </section>
    </StudyToolsActivityShell>
  );
}
