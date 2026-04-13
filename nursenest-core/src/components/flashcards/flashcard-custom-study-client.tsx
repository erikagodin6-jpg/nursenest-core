"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FlashcardViewer, type ViewerCard } from "@/components/study/flashcard-viewer";

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
  };
  categoryOptions: Array<{ id: string; title: string; count: number }>;
  cards: ViewerCard[];
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
      </div>

      <FlashcardViewer
        initialCards={payload.cards}
        session={null}
        onRate={async () => {
          // Quizlet-style custom sessions are practice-only in Phase 1.
        }}
        onReset={() => {
          window.location.reload();
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
