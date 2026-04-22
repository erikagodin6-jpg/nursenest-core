"use client";

import { FlashcardStudyClient } from "@/components/flashcards/flashcard-study-client";
import { FlashcardDeckStudyGate } from "@/components/flashcards/flashcard-deck-study-gate";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";

export function FlashcardDeckStudyShell({
  deckRef,
  userId,
  userLabel,
  protectionFlags,
  shuffleInitially,
  studyMode,
  startImmediately,
}: {
  deckRef: string;
  userId: string;
  userLabel: string;
  protectionFlags: PremiumProtectionFlags;
  shuffleInitially: boolean;
  studyMode: "learn" | "test";
  startImmediately: boolean;
}) {
  if (!startImmediately) {
    return <FlashcardDeckStudyGate deckRef={deckRef} />;
  }
  return (
    <FlashcardStudyClient
      deckRef={deckRef}
      userId={userId}
      userLabel={userLabel}
      protectionFlags={protectionFlags}
      shuffleInitially={shuffleInitially}
      studyMode={studyMode}
    />
  );
}
