"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { startOrResumeSessionAction } from "@/app/actions/flashcards/session-actions";

export function FlashcardSessionStartButton({
  deckId,
  isResuming,
  cardCount,
  pathwayId,
}: {
  deckId: string;
  isResuming: boolean;
  cardCount: number;
  pathwayId?: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleStart() {
    startTransition(async () => {
      const result = await startOrResumeSessionAction(deckId);
      if (result.ok) {
        const qs = pathwayId?.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : "";
        router.push(
          `/app/flashcards/decks/${encodeURIComponent(deckId)}/session/${encodeURIComponent(result.data.sessionId)}${qs}`,
        );
      }
    });
  }

  return (
    <button
      onClick={handleStart}
      disabled={isPending || cardCount === 0}
      className="rounded-xl bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Starting…" : isResuming ? "Resume session" : `Start session · ${cardCount} cards`}
    </button>
  );
}
