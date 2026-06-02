import Link from "next/link";
import { flashcardDeckHref, withStudyToolPathwayQuery, STUDY_TOOL_ROUTES } from "@/lib/study-tools/study-tool-routes";
import type { DeckListRow } from "@/lib/flashcards/flashcard-session-dal.server";

export function FlashcardDeckList({
  decks,
  pathwayId,
  activeSessionDeckIds = [],
}: {
  decks: DeckListRow[];
  pathwayId: string | null;
  activeSessionDeckIds?: string[];
}) {
  if (decks.length === 0) {
    return (
      <p className="rounded-xl border border-[var(--semantic-border-soft)] px-6 py-10 text-center text-sm text-[var(--theme-body-text)]">
        No flashcard decks are available yet.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {decks.map((deck) => {
        const href = withStudyToolPathwayQuery(flashcardDeckHref(deck.id), pathwayId);
        const hasActive = activeSessionDeckIds.includes(deck.id);
        return (
          <li key={deck.id}>
            <Link
              href={href}
              className="group flex h-full flex-col gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] p-4 transition-colors hover:border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] hover:bg-[var(--bg-card-hover,var(--bg-card))]"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold text-[var(--semantic-text-primary)] group-hover:text-[var(--semantic-brand)]">
                  {deck.title}
                </span>
                {hasActive ? (
                  <span className="shrink-0 rounded-full bg-[color-mix(in_srgb,var(--semantic-success)_18%,transparent)] px-2 py-0.5 text-xs font-medium text-[var(--semantic-success)]">
                    In progress
                  </span>
                ) : null}
              </div>

              {deck.description ? (
                <p className="line-clamp-2 text-xs text-[var(--theme-body-text)]">{deck.description}</p>
              ) : null}

              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                <span className="rounded-full border border-[var(--semantic-border-soft)] px-2 py-0.5 text-xs text-[var(--theme-body-text)]">
                  {deck.cardCount} cards
                </span>
                <span className="rounded-full border border-[var(--semantic-border-soft)] px-2 py-0.5 text-xs text-[var(--theme-body-text)]">
                  {deck.tier}
                </span>
                <span className="rounded-full border border-[var(--semantic-border-soft)] px-2 py-0.5 text-xs text-[var(--theme-body-text)]">
                  {deck.country}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
