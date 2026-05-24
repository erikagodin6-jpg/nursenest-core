import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StudyToolsActivityShell } from "@/components/study-tools/study-tools-activity-shell";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";
import { getDeckWithMcqCards, getActiveSession } from "@/lib/flashcards/flashcard-session-dal.server";
import { FlashcardSessionStartButton } from "@/components/flashcards/flashcard-session-start-button";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";

type PageProps = {
  params: Promise<{ deckId: string }>;
  searchParams: Promise<{ pathwayId?: string | string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { deckId } = await params;
  const deck = await getDeckWithMcqCards(deckId);
  return buildStudyToolsActivityMetadata(deck?.title ?? "Flashcard deck");
}

export default async function FlashcardDeckDetailPage({ params, searchParams }: PageProps) {
  const [{ deckId }, sp, session] = await Promise.all([
    params,
    searchParams,
    getProtectedRouteSession("flashcards.deck-detail"),
  ]);

  const raw = sp.pathwayId;
  const pathwayId =
    typeof raw === "string" && raw.trim() ? raw.trim()
    : Array.isArray(raw) && typeof raw[0] === "string" ? raw[0].trim()
    : null;

  const userId = (session?.user as { id?: string })?.id ?? null;
  if (!userId) notFound();

  const [deck, activeSession] = await Promise.all([
    getDeckWithMcqCards(deckId),
    getActiveSession(userId, deckId),
  ]);

  if (!deck) notFound();

  const backHref = withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.flashcardsDecks, pathwayId);

  return (
    <StudyToolsActivityShell
      title={deck.title}
      description={deck.description ?? "Study this deck to build mastery. Your progress is saved after every card."}
      pathwayId={pathwayId ?? deck.pathwayId}
    >
      {/* Back link */}
      <div>
        <Link
          href={backHref}
          className="text-xs text-[var(--semantic-brand)] hover:underline"
        >
          ← All decks
        </Link>
      </div>

      {/* Deck meta */}
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-[var(--semantic-border-soft)] px-2 py-0.5 text-xs text-[var(--theme-body-text)]">
          {deck.cards.length} playable cards
        </span>
        <span className="rounded-full border border-[var(--semantic-border-soft)] px-2 py-0.5 text-xs text-[var(--theme-body-text)]">
          {deck.tier}
        </span>
        <span className="rounded-full border border-[var(--semantic-border-soft)] px-2 py-0.5 text-xs text-[var(--theme-body-text)]">
          {deck.country}
        </span>
      </div>

      {/* Resume progress bar */}
      {activeSession ? (
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_8%,var(--semantic-surface))] px-4 py-3">
          <p className="text-xs font-semibold text-[var(--semantic-info)]">Session in progress</p>
          <p className="mt-1 text-xs text-[var(--theme-body-text)]">
            {activeSession.answeredCount} of {deck.cards.length} cards answered ·{" "}
            {activeSession.answeredCount > 0
              ? Math.round((activeSession.correctCount / activeSession.answeredCount) * 100)
              : 0}
            % correct
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--semantic-border-soft)]">
            <div
              className="h-full rounded-full bg-[var(--semantic-info)] transition-[width]"
              style={{
                width: `${deck.cards.length > 0 ? Math.round((activeSession.answeredCount / deck.cards.length) * 100) : 0}%`,
              }}
            />
          </div>
        </div>
      ) : null}

      {/* Start / resume */}
      <FlashcardSessionStartButton
        deckId={deck.id}
        isResuming={activeSession !== null}
        cardCount={deck.cards.length}
      />

      {/* Card preview (first 3) */}
      {deck.cards.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-chart-3)]">
            Preview · {deck.cards.length} cards
          </h2>
          <ol className="space-y-3">
            {deck.cards.slice(0, 3).map((card, i) => (
              <li
                key={card.id}
                className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] p-4"
              >
                <p className="text-xs font-semibold text-[var(--theme-body-text)]">
                  Card {i + 1}
                </p>
                <p className="mt-1 text-sm text-[var(--semantic-text-primary)]">{card.questionStem}</p>
                <ul className="mt-2 space-y-1">
                  {card.options.map((opt) => (
                    <li
                      key={opt.key}
                      className="text-xs text-[var(--theme-body-text)]"
                    >
                      <span className="font-mono mr-1">{opt.key}.</span>
                      {opt.content}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          {deck.cards.length > 3 ? (
            <p className="text-xs text-[var(--theme-body-text)]">
              + {deck.cards.length - 3} more cards in session
            </p>
          ) : null}
        </section>
      ) : null}
    </StudyToolsActivityShell>
  );
}
