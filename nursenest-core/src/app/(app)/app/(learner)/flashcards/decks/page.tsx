import type { Metadata } from "next";
import { StudyToolsActivityShell } from "@/components/study-tools/study-tools-activity-shell";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";
import { getPublishedFlashcardDecks } from "@/lib/flashcards/flashcard-session-dal.server";
import { FlashcardDeckList } from "@/components/flashcards/flashcard-deck-list";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getActiveSession } from "@/lib/flashcards/flashcard-session-dal.server";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export async function generateMetadata(): Promise<Metadata> {
  return buildStudyToolsActivityMetadata("Browse flashcard decks");
}

export default async function LearnerFlashcardDecksPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const raw = sp.pathwayId;
  const pathwayId =
    typeof raw === "string" && raw.trim() ? raw.trim()
    : Array.isArray(raw) && typeof raw[0] === "string" ? raw[0].trim()
    : null;

  const [session, decks] = await Promise.all([
    getProtectedRouteSession("flashcards.decks"),
    getPublishedFlashcardDecks({ pathwayId }),
  ]);

  const userId = (session?.user as { id?: string })?.id ?? null;

  let activeSessionDeckIds: string[] = [];
  if (userId && decks.length > 0) {
    const checks = await Promise.all(
      decks.slice(0, 30).map(async (d) => {
        const s = await getActiveSession(userId, d.id);
        return s ? d.id : null;
      }),
    );
    activeSessionDeckIds = checks.filter((id): id is string => id !== null);
  }

  return (
    <StudyToolsActivityShell
      title="Browse flashcard decks"
      description="All published flashcard decks. Select a deck to view its cards and start a study session."
      pathwayId={pathwayId}
    >
      <FlashcardDeckList
        decks={decks}
        pathwayId={pathwayId}
        activeSessionDeckIds={activeSessionDeckIds}
      />
    </StudyToolsActivityShell>
  );
}
