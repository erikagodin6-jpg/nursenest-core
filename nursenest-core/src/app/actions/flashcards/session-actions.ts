"use server";

import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import {
  completeFlashcardSession,
  createOrResumeFlashcardSession,
  getActiveSession,
  getDeckWithMcqCards,
  recordFlashcardAttempt,
  type RecordAttemptInput,
} from "@/lib/flashcards/flashcard-session-dal.server";

type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

function userId(session: Awaited<ReturnType<typeof getProtectedRouteSession>>): string | null {
  return (session?.user as { id?: string })?.id ?? null;
}

export async function startOrResumeSessionAction(
  deckId: string,
): Promise<ActionResult<{ sessionId: string; isResumed: boolean }>> {
  const session = await getProtectedRouteSession("flashcards.startOrResumeSession");
  const uid = userId(session);
  if (!uid) return { ok: false, error: "Not authenticated" };
  if (!deckId?.trim()) return { ok: false, error: "Invalid deck" };

  const deck = await getDeckWithMcqCards(deckId);
  if (!deck) return { ok: false, error: "Deck not found" };
  if (deck.cards.length === 0) return { ok: false, error: "Deck has no playable cards" };

  const existing = await getActiveSession(uid, deckId);

  const flashcardSession = await createOrResumeFlashcardSession(uid, deckId, deck.cards.length);

  return {
    ok: true,
    data: { sessionId: flashcardSession.id, isResumed: existing !== null },
  };
}

export async function recordAttemptAction(
  input: Omit<RecordAttemptInput, "userId">,
): Promise<ActionResult<{ masteryLevel: number }>> {
  const session = await getProtectedRouteSession("flashcards.recordAttempt");
  const uid = userId(session);
  if (!uid) return { ok: false, error: "Not authenticated" };

  const sanitized: RecordAttemptInput = {
    sessionId: input.sessionId,
    userId: uid,
    flashcardId: input.flashcardId,
    selectedKey: input.selectedKey,
    isCorrect: input.isCorrect,
    guessed: input.guessed ?? false,
    confidence: input.confidence ?? null,
    bookmarked: input.bookmarked ?? false,
  };

  const { mastery } = await recordFlashcardAttempt(sanitized);
  return { ok: true, data: { masteryLevel: mastery.level } };
}

export async function completeSessionAction(sessionId: string): Promise<ActionResult> {
  const session = await getProtectedRouteSession("flashcards.completeSession");
  const uid = userId(session);
  if (!uid) return { ok: false, error: "Not authenticated" };
  if (!sessionId?.trim()) return { ok: false, error: "Invalid session" };

  await completeFlashcardSession(sessionId, uid);
  return { ok: true, data: undefined };
}
