"use client";

import { useEffect, useState } from "react";
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // small delay prevents flicker when navigating with ?start=1
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  // 🧠 Gate screen (entry UX)
  if (!startImmediately) {
    return (
      <div className="animate-fade-in">
        <FlashcardDeckStudyGate deckRef={deckRef} />
      </div>
    );
  }

  // ⏳ Soft loading state (prevents blank flash)
  if (!ready) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center text-sm text-[var(--semantic-text-muted)]">
        Preparing your study session…
      </div>
    );
  }

  // 🚀 Study session
  return (
    <div className="animate-fade-in">
      <FlashcardStudyClient
        deckRef={deckRef}
        userId={userId}
        userLabel={userLabel}
        protectionFlags={protectionFlags}
        shuffleInitially={shuffleInitially}
        studyMode={studyMode}
      />
    </div>
  );
}