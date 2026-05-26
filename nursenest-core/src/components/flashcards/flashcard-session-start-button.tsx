"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * Flashcard session start button for PROTECTED learner pages.
 * 
 * This component is ONLY used on pages under /app/flashcards that already
 * require authentication via getProtectedRouteSession().
 * 
 * Server-side auth is enforced at the PAGE level. If this component renders,
 * the user IS authenticated. No need to check useSession() - doing so creates
 * a client/server desync race condition.
 * 
 * Architecture:
 * - Page: getProtectedRouteSession() → redirects if not authenticated
 * - Component: Trusts page-level auth, opens the current learner flashcard shell
 * - Study route/API: Validates auth and entitlement again (defense in depth)
 */
export function FlashcardSessionStartButton({
  deckId,
  deckRef,
  isResuming,
  cardCount,
  pathwayId,
}: {
  deckId: string;
  deckRef?: string | null;
  isResuming: boolean;
  cardCount: number;
  pathwayId?: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleStart() {
    startTransition(() => {
      const ref = deckRef?.trim() || deckId;
      const params = new URLSearchParams({ start: "1", mode: "learn" });
      if (pathwayId?.trim()) params.set("pathwayId", pathwayId.trim());
      router.push(`/app/flashcards/${encodeURIComponent(ref)}?${params.toString()}`);
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
