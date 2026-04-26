"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Home, RefreshCw, XCircle } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  getStudyItemState,
  setStudyItemState,
  type StudyItemState,
} from "@/lib/flashcards/study-session-persistence";
import { resolveFlashcardRelatedLessonLink } from "@/lib/flashcards/flashcard-study-links";
import { ExamSessionThemeTrigger } from "@/components/exam/exam-session-theme-trigger";
import { ExamSessionProgressStrip } from "@/components/exam/exam-session-shell";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";
import { FlashcardExamMcqAnswerList } from "@/components/flashcards/flashcard-exam-mcq-answer-list";
import { firstTeachingLine, FlashcardStudyQuestionStack } from "@/components/flashcards/flashcard-study-question-stack";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";

/* ================= TYPES ================= */

export type ActiveStudyCard = {
  id: string;
  prompt: string;
  answer: string;
  explanation?: string;
  examMicroQuestion?: ExamMicroQuestionPayload | null;
  topic?: string | null;
  subtopic?: string | null;
  sourceKey?: string | null;
  pathwayId?: string | null;
  topicSlug?: string | null;
  distractors?: Array<{ option: string; rationale: string }>;
};

export type ActiveStudyHeader = {
  sessionTitle: string;
  modeLabel: string;
  categoriesLabel: string;
  exitHref: string;
};

type Props = {
  cards: ActiveStudyCard[];
  header: ActiveStudyHeader;
  loading?: boolean;
  onRate?: (cardId: string, rating: "incorrect" | "unsure" | "known") => Promise<void>;
  onExit?: () => void;
  sessionMeta?: {
    requestedCount?: number;
    returnedCount?: number;
    totalAvailable?: number;
    hasMore?: boolean;
  };
  layout?: "split" | "card";
  sessionMode?: "learn" | "test";
  initialCardIndex?: number;
  initialRevealed?: boolean;
  onStudyProgress?: (state: { index: number; revealed: boolean }) => void;
  onSessionComplete?: () => void;
  onSessionRestart?: () => void;
};

/* ================= HELPERS ================= */

function dedupeCardsById(cards: ActiveStudyCard[]): ActiveStudyCard[] {
  const seen = new Set<string>();
  return cards.filter((c) => {
    if (!c.id || seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

function buildClinicalPearl(card: ActiveStudyCard, fallback: string): string {
  const src =
    card.examMicroQuestion?.rationaleCorrect ||
    card.explanation ||
    card.answer ||
    "";

  const first = src.split(".").map((s) => s.trim()).find(Boolean);
  return first ? (first.endsWith(".") ? first : `${first}.`) : fallback;
}

function formatElapsed(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/* ================= COMPONENT ================= */

export function ActiveStudySession({
  cards,
  header,
  loading = false,
  onRate,
  onExit,
  sessionMeta,
  layout = "split",
  sessionMode = "learn",
  initialCardIndex = 0,
  initialRevealed = false,
  onStudyProgress,
  onSessionComplete,
  onSessionRestart,
}: Props) {
  const { t } = useMarketingI18n();

  const deduped = useMemo(() => dedupeCardsById(cards), [cards]);

  const [sessionCards, setSessionCards] = useState(deduped);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const current = sessionCards[index] ?? null;

  useEffect(() => {
    setSessionCards(deduped);
    setIndex(initialCardIndex);
    setRevealed(initialRevealed);
    setCompleted(false);
    setElapsed(0);
  }, [deduped, initialCardIndex, initialRevealed]);

  useEffect(() => {
    onStudyProgress?.({ index, revealed });
  }, [index, revealed]);

  useEffect(() => {
    if (sessionMode !== "test" || completed) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [sessionMode, completed]);

  if (loading) {
    return <div className="p-4 text-sm">Loading session...</div>;
  }

  if (!current) {
    return <div className="p-4 text-sm">No cards available.</div>;
  }

  if (completed) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-bold">Session complete</h2>
        <button
          onClick={() => {
            onSessionRestart?.();
            setIndex(0);
            setCompleted(false);
          }}
        >
          Restart
        </button>
      </div>
    );
  }

  async function submitRating(rating: "incorrect" | "unsure" | "known") {
    if (!current) return;
    setSaving(true);

    await onRate?.(current.id, rating);

    if (index >= sessionCards.length - 1) {
      setCompleted(true);
      onSessionComplete?.();
    } else {
      setIndex((i) => i + 1);
      setRevealed(false);
    }

    setSaving(false);
  }

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between border p-3 rounded-xl">
        <div>
          <h1 className="font-bold">{header.sessionTitle}</h1>
          <p className="text-xs text-gray-500">
            {index + 1} / {sessionCards.length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {sessionMode === "test" && (
            <span className="font-mono text-sm">{formatElapsed(elapsed)}</span>
          )}

          <Link href={header.exitHref} onClick={onExit}>
            <Home />
          </Link>
        </div>
      </div>

      {/* MAIN CARD */}
      <FlashcardStudyQuestionStack
        sessionModeLabel={header.modeLabel}
        topicLine={current.topic}
        examMicroQuestion={current.examMicroQuestion}
        prompt={current.prompt}
        answer={current.answer}
        explanation={current.explanation}
        pearl={buildClinicalPearl(current, "No clinical pearl available.")}
        revealed={revealed}
        onReveal={() => setRevealed(true)}
        labels={{
          revealHint: "Tap to reveal",
          answerHeading: "Answer",
          whyCorrectHeading: "Why correct",
          whyIncorrectHeading: "Why incorrect",
          takeawayHeading: "Clinical pearl",
          answerChoicesHeading: "Choices",
        }}
      />

      {/* RATING */}
      {revealed && (
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => submitRating("incorrect")} disabled={saving}>
            <XCircle /> Incorrect
          </button>
          <button onClick={() => submitRating("unsure")} disabled={saving}>
            <RefreshCw /> Unsure
          </button>
          <button onClick={() => submitRating("known")} disabled={saving}>
            <CheckCircle2 /> Known
          </button>
        </div>
      )}

      {/* NAV */}
      <div className="flex justify-between">
        <button onClick={() => setIndex((i) => Math.max(0, i - 1))}>
          <ChevronLeft /> Prev
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(sessionCards.length - 1, i + 1))}
          disabled={!revealed}
        >
          Next <ChevronRight />
        </button>
      </div>
    </div>
  );
}