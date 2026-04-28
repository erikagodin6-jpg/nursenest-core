"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ActiveStudySession, type ActiveStudyCard, type ActiveStudyHeader } from "@/components/study/active-study-session";
import { buildAppFlashcardsHubHref } from "@/lib/flashcards/flashcards-hub-url";
import { parseFlashcardCustomSessionResponse } from "@/lib/flashcards/flashcard-custom-session-response";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";

type ApiCard = {
  id: string;
  front: string;
  back: string;
  topic?: string;
  subtopic?: string | null;
  sourceKey?: string | null;
  pathwayId?: string | null;
  explanation?: string;
  examMicroQuestion?: ExamMicroQuestionPayload | null;
};

function toActiveCards(rows: ApiCard[]): ActiveStudyCard[] {
  return rows.map((c) => ({
    id: c.id,
    prompt: c.front,
    answer: c.back,
    explanation: c.explanation,
    examMicroQuestion: c.examMicroQuestion ?? null,
    topic: c.topic ?? null,
    subtopic: c.subtopic ?? null,
    sourceKey: c.sourceKey ?? null,
    pathwayId: c.pathwayId ?? null,
  }));
}

export function FlashcardCustomStudyClient() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<ActiveStudyCard[]>([]);

  const pathwayId = searchParams.get("pathwayId")?.trim() || "";

  const apiQuery = useMemo(() => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("includeCards", "1");
    if (!sp.get("pathwayId")?.trim()) return null;
    return sp.toString();
  }, [searchParams]);

  const exitHref = useMemo(() => {
    if (!pathwayId) return "/app/flashcards";
    return buildAppFlashcardsHubHref({ pathwayId });
  }, [pathwayId]);

  const header: ActiveStudyHeader = useMemo(
    () => ({
      sessionTitle: "Custom flashcards",
      modeLabel: "Study",
      categoriesLabel: "",
      exitHref,
    }),
    [exitHref],
  );

  const load = useCallback(async () => {
    if (!apiQuery) {
      setError("Missing pathway");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/flashcards/custom-session?${apiQuery}`, { credentials: "include" });
      const json: unknown = await res.json();
      const parsed = parseFlashcardCustomSessionResponse(res.ok, json);
      if (!parsed.ok) {
        setError(parsed.message);
        setCards([]);
        return;
      }
      const raw = (json as { cards?: ApiCard[] }).cards ?? [];
      setCards(toActiveCards(Array.isArray(raw) ? raw : []));
      void parsed.summary;
    } catch {
      setError("Could not load session");
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [apiQuery]);

  useEffect(() => {
    void load();
  }, [load]);

  const onRate = useCallback(async (cardId: string, rating: "incorrect" | "unsure" | "known") => {
    await fetch(`/api/flashcards/cards/${encodeURIComponent(cardId)}/review`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });
  }, []);

  if (!apiQuery) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-[var(--semantic-text-secondary)]">
        Choose a pathway from the flashcards hub to start a session.
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <p className="text-sm text-[var(--semantic-danger)]">{error}</p>
        <a className="text-sm font-medium text-primary underline" href={exitHref}>
          Back to flashcards
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <ActiveStudySession
        cards={cards}
        header={header}
        loading={loading}
        onRate={onRate}
        sessionMode="learn"
      />
    </div>
  );
}
