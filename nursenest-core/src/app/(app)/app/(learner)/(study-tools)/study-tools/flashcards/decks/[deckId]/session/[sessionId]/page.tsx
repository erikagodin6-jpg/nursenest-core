import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildStudyToolsActivityMetadata } from "@/lib/study-tools/study-tools-metadata";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { hydrateFlashcardSession } from "@/lib/flashcards/flashcard-session-hydration.server";
import { FlashcardSessionPlayer } from "@/components/flashcards/flashcard-session-player";

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

  const hydrated = await hydrateFlashcardSession(sessionId, userId);
  if (!hydrated) notFound();

  return <FlashcardSessionPlayer session={hydrated} deckId={deckId} />;
}
