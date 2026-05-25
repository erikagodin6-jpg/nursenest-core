"use client";

import { useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleStart() {
    // Auth check BEFORE calling protected action
    if (status === "unauthenticated") {
      const callbackUrl = `/app/flashcards/decks/${encodeURIComponent(deckId)}`;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    if (status === "loading") {
      // Still checking auth, wait
      return;
    }

    // Authenticated - proceed with action
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

  const isLoading = isPending || status === "loading";
  const buttonText = isLoading
    ? "Starting…"
    : status === "unauthenticated"
      ? "Sign in to study"
      : isResuming
        ? "Resume session"
        : `Start session · ${cardCount} cards`;

  return (
    <button
      onClick={handleStart}
      disabled={isLoading || cardCount === 0}
      className="rounded-xl bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {buttonText}
    </button>
  );
}
