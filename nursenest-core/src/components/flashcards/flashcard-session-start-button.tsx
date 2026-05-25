"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { startOrResumeSessionAction } from "@/app/actions/flashcards/session-actions";

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
 * - Component: Trusts page-level auth, calls action directly
 * - Action: Validates auth again (defense in depth)
 */
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
    // No client-side auth check needed - page already verified server-side.
    // If this component rendered, user IS authenticated.
    startTransition(async () => {
      const result = await startOrResumeSessionAction(deckId);
      if (result.ok) {
        const qs = pathwayId?.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : "";
        router.push(
          `/app/flashcards/decks/${encodeURIComponent(deckId)}/session/${encodeURIComponent(result.data.sessionId)}${qs}`,
        );
      } else {
        // Action failed (should not happen if page auth worked)
        console.error("Failed to start flashcard session:", result.error);
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
