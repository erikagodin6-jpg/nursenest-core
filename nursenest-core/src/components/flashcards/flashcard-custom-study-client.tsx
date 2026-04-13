"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ActiveStudySession, type ActiveStudyCard } from "@/components/study/active-study-session";
import { cardMatchesStudyFilters } from "@/lib/flashcards/study-session-persistence";

type SessionPayload = {
  ok: boolean;
  summary: {
    pathwayId: string | null;
    selectedCategories: string[];
    matchingCards: number;
    returnedCards: number;
    mode: "term_to_definition" | "definition_to_term" | "mixed";
    shuffle: boolean;
    weakOnly: boolean;
    incorrectOnly: boolean;
    starredOnly: boolean;
    cardLimit: string;
    savedOnly?: boolean;
    notesOnly?: boolean;
    revisitOnly?: boolean;
  };
  categoryOptions: Array<{ id: string; title: string; count: number }>;
  cards: Array<{
    id: string;
    front: string;
    back: string;
    topic?: string | null;
    subtopic?: string | null;
    explanation?: string;
    sourceKey?: string | null;
    pathwayId?: string | null;
  }>;
};

const MODE_LABEL: Record<SessionPayload["summary"]["mode"], string> = {
  term_to_definition: "Term → Definition",
  definition_to_term: "Definition → Term",
  mixed: "Mixed",
};

export function FlashcardCustomStudyClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<SessionPayload | null>(null);

  const query = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.search;
  }, []);

  const localFilters = useMemo(() => {
    const params = new URLSearchParams(query);
    return {
      starredOnly: params.get("starredOnly") === "1",
      savedOnly: params.get("savedOnly") === "1",
      notesOnly: params.get("notesOnly") === "1",
      confusingOnly: params.get("revisitOnly") === "1",
    };
  }, [query]);

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams(query);
        params.set("includeCards", "1");
        const res = await fetch(`/api/flashcards/custom-session?${params.toString()}`, { credentials: "include" });
        const json = (await res.json()) as SessionPayload & { error?: string };
        if (!res.ok) throw new Error(json.error ?? "Unable to load custom session");
        if (active) setPayload(json);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Unable to load custom session");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [query]);

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-[var(--theme-muted-text)]">Building your custom flashcard session…</div>;
  }

  if (error || !payload) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-[var(--semantic-danger)]">{error ?? "Unable to load session."}</p>
        <Link href="/app/flashcards" className="mt-4 inline-block text-sm font-semibold text-primary">
          ← Back to Flashcards Builder
        </Link>
      </div>
    );
  }

  const selectedTitles = payload.categoryOptions
    .filter((c) => payload.summary.selectedCategories.includes(c.id))
    .map((c) => c.title);

  const filteredCards = payload.cards.filter((card) => cardMatchesStudyFilters(card.id, localFilters));
  const activeCards: ActiveStudyCard[] = filteredCards.map((card) => ({
    id: card.id,
    prompt: card.front,
    answer: card.back,
    explanation: card.explanation,
    topic: card.topic,
    subtopic: card.subtopic,
    sourceKey: card.sourceKey ?? null,
    pathwayId: card.pathwayId ?? payload.summary.pathwayId,
  }));
  const enabledQuickFilters = [
    localFilters.starredOnly ? "Starred" : null,
    localFilters.savedOnly ? "Saved" : null,
    localFilters.notesOnly ? "With Notes" : null,
    localFilters.confusingOnly ? "Marked for Revisit" : null,
  ].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 rounded-2xl border border-border bg-[var(--theme-card-bg)] p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Custom Session</p>
        <h1 className="mt-1 text-xl font-bold text-[var(--theme-heading-text)]">Flashcards Study Builder Session</h1>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Pathway: {payload.summary.pathwayId ?? "Scoped by your plan"} · Categories: {selectedTitles.join(", ") || "All"}
        </p>
        <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
          Cards: {payload.summary.returnedCards} of {payload.summary.matchingCards} · Mode: {MODE_LABEL[payload.summary.mode]} · Shuffle:{" "}
          {payload.summary.shuffle ? "On" : "Off"}
        </p>
        {enabledQuickFilters.length > 0 ? (
          <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
            Review Filters: {enabledQuickFilters.join(", ")} · Session Items: {activeCards.length}
          </p>
        ) : null}
      </div>

      <ActiveStudySession
        cards={activeCards}
        header={{
          sessionTitle: "Custom Active Study Session",
          modeLabel: MODE_LABEL[payload.summary.mode],
          categoriesLabel: selectedTitles.join(", ") || "All Categories",
          exitHref: "/app/flashcards",
        }}
      />

      <div className="mt-6">
        <Link href="/app/flashcards" className="text-sm font-semibold text-primary">
          ← Back to Flashcards Builder
        </Link>
      </div>
    </div>
  );
}
