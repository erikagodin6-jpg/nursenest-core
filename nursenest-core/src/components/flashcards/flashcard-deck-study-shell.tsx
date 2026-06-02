"use client";

import { useEffect, useState } from "react";
import { FlashcardStudyClient } from "@/components/flashcards/flashcard-study-client";
import { FlashcardDeckStudyGate } from "@/components/flashcards/flashcard-deck-study-gate";
import { FlashcardStudySessionSkeleton } from "@/components/skeletons/hub-page-skeleton";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
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
  const { t } = useMarketingI18n();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // small delay prevents flicker when navigating with ?start=1
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!startImmediately) return;
    trackClientEvent(PH.flashcardsStarted, {
      deck_ref: deckRef,
      study_mode: studyMode,
      shuffle: shuffleInitially,
    });
  }, [deckRef, shuffleInitially, startImmediately, studyMode]);

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
      <FlashcardStudySessionSkeleton
        message={t("learner.loading.flashcards")}
        detail="Opening your deck workspace."
      />
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
