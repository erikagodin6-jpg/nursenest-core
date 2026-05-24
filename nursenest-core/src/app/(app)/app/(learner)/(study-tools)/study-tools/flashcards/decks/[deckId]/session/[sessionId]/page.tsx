import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StudyToolsActivityShell } from "@/components/study-tools/study-tools-activity-shell";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { prisma } from "@/lib/db";
import { flashcardDeckHref, STUDY_TOOL_ROUTES } from "@/lib/study-tools/study-tool-routes";

type PageProps = {
  params: Promise<{ deckId: string; sessionId: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return buildStudyToolsActivityMetadata("Study session");
}

export default async function FlashcardSessionPage({ params }: PageProps) {
  const { deckId, sessionId } = await params;

  const session = await getProtectedRouteSession("flashcards.session");
  const userId = (session?.user as { id?: string })?.id ?? null;
  if (!userId) notFound();

  const [flashcardSession, deck] = await Promise.all([
    prisma.flashcardSession.findFirst({
      where: { id: sessionId, userId },
      select: { id: true, status: true, cardCount: true, startedAt: true },
    }),
    prisma.flashcardDeck.findUnique({
      where: { id: deckId },
      select: { id: true, title: true },
    }),
  ]);

  if (!flashcardSession || !deck) notFound();

  const deckHref = flashcardDeckHref(deckId);
  const allDecksHref = STUDY_TOOL_ROUTES.flashcardsDecks;

  return (
    <StudyToolsActivityShell
      title={deck.title}
      description="Session created. The interactive study player is coming in the next phase."
      pathwayId={null}
    >
      <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))] px-5 py-4">
        <p className="text-sm font-semibold text-[var(--semantic-success)]">
          Session ready
        </p>
        <p className="mt-1 text-xs text-[var(--theme-body-text)]">
          Session ID: <span className="font-mono">{sessionId}</span>
        </p>
        <p className="text-xs text-[var(--theme-body-text)]">
          {flashcardSession.cardCount} cards · Status: {flashcardSession.status}
        </p>
        <p className="mt-2 text-xs text-[var(--theme-body-text)]">
          The full question-by-question study player arrives in Phase 2. Your session is saved
          and will resume automatically when you return.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href={deckHref}
          className="rounded-xl border border-[var(--semantic-border-soft)] px-4 py-2 text-sm text-[var(--semantic-text-primary)] hover:border-[var(--semantic-brand)]"
        >
          ← Back to deck
        </Link>
        <Link
          href={allDecksHref}
          className="rounded-xl border border-[var(--semantic-border-soft)] px-4 py-2 text-sm text-[var(--semantic-text-primary)] hover:border-[var(--semantic-brand)]"
        >
          All decks
        </Link>
      </div>
    </StudyToolsActivityShell>
  );
}
