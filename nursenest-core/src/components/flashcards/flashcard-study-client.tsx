"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ActiveStudySession, type ActiveStudyCard, type ActiveStudyHeader } from "@/components/study/active-study-session";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatTitleCase } from "@/lib/format/text-case";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import {
  clearDeckSessionCheckpoint,
  getDeckSessionCheckpoint,
  saveDeckSessionCheckpoint,
} from "@/lib/flashcards/study-session-persistence";
import { ExamSessionShell } from "@/components/exam/exam-session-shell";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";

type CardPayload = {
  id: string;
  front: string;
  back: string;
  fullBackAvailable: boolean;
  explanation?: string;
  examMicroQuestion?: ExamMicroQuestionPayload;
  topic?: string;
  subtopic?: string | null;
};

type StudyResponse = {
  mode: "preview" | "subscriber";
  cards: CardPayload[];
  sessionMeta?: {
    requestedCount?: number;
    returnedCount?: number;
    totalAvailable?: number;
    hasMore?: boolean;
  };
};

export function FlashcardStudyClient({
  deckRef,
  shuffleInitially = false,
  studyMode = "learn",
}: {
  deckRef: string;
  userId: string;
  userLabel: string;
  protectionFlags: PremiumProtectionFlags;
  shuffleInitially?: boolean;
  studyMode?: "learn" | "test";
}) {
  const { t } = useMarketingI18n();

  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<"preview" | "subscriber" | null>(null);
  const [queue, setQueue] = useState<CardPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumeGateOpen, setResumeGateOpen] = useState(false);
  const [resumeInitial, setResumeInitial] = useState({ index: 0, revealed: false });
  const [sessionKey, setSessionKey] = useState(0);

  // 🚀 fetch cards
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/flashcards/decks/${deckRef}/study`, {
          credentials: "include",
        });
        const data = (await res.json()) as StudyResponse;

        if (!cancelled) {
          setMode(data.mode);
          setQueue(data.cards);
        }
      } catch {
        setQueue([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [deckRef]);

  // 🧠 resume logic
  useLayoutEffect(() => {
    if (loading || queue.length === 0) return;

    const ck = getDeckSessionCheckpoint(deckRef);
    if (!ck) return;

    setResumeGateOpen(true);
    setResumeInitial({ index: ck.index, revealed: ck.revealed });
  }, [loading, queue.length, deckRef]);

  // 🏷 title
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/flashcards/decks/${deckRef}`);
      const data = await res.json();
      if (data?.deck?.title) {
        setTitle(formatTitleCase(data.deck.title));
      }
    })();
  }, [deckRef]);

  const activeCards: ActiveStudyCard[] = useMemo(
    () =>
      queue.map((c) => ({
        id: c.id,
        prompt: c.front,
        answer: c.back,
        explanation: c.explanation,
        examMicroQuestion: c.examMicroQuestion,
      })),
    [queue],
  );

  if (loading) {
    return (
      <div className="text-center py-16 text-sm text-muted">
        Preparing your study session…
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="text-center py-16 text-sm text-muted">
        No flashcards available
      </div>
    );
  }

  // 🟡 RESUME UI (cleaner)
  if (resumeGateOpen) {
    return (
      <div className="max-w-lg mx-auto mt-12 p-6 rounded-2xl border bg-white shadow">
        <h2 className="font-semibold text-lg">Resume session?</h2>

        <p className="text-sm text-muted mt-2">
          Continue where you left off or start fresh.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 bg-blue-600 text-white rounded-full py-2 font-semibold"
            onClick={() => {
              setResumeGateOpen(false);
              setSessionKey((k) => k + 1);
            }}
          >
            Resume
          </button>

          <button
            className="flex-1 border rounded-full py-2 font-semibold"
            onClick={() => {
              clearDeckSessionCheckpoint(deckRef);
              setResumeInitial({ index: 0, revealed: false });
              setResumeGateOpen(false);
              setSessionKey((k) => k + 1);
            }}
          >
            Start fresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* header */}
      <div className="flex justify-between items-center mb-4">
        <Link href="/app/flashcards" className="text-sm text-blue-600">
          ← Back
        </Link>

        <div className="text-sm font-medium">
          {title || "Flashcards"}
        </div>
      </div>

      {/* session */}
      <ExamSessionShell>
        <ActiveStudySession
          key={sessionKey}
          cards={activeCards}
          header={{
            sessionTitle: title || "Flashcards",
            modeLabel: studyMode === "test" ? "Test" : "Learn",
            categoriesLabel: "",
            exitHref: "/app/flashcards",
          } satisfies ActiveStudyHeader}
          layout="split"
          sessionMode={studyMode}
          initialCardIndex={resumeInitial.index}
          initialRevealed={resumeInitial.revealed}
          onStudyProgress={(s) =>
            saveDeckSessionCheckpoint(deckRef, s.index, s.revealed)
          }
          onSessionComplete={() =>
            clearDeckSessionCheckpoint(deckRef)
          }
        />
      </ExamSessionShell>
    </div>
  );
}