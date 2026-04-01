"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { asArray } from "@/lib/runtime/collections";

type DeckRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  country: string;
  tier: string;
  examFamily: string;
  pathwayId: string | null;
  visibility: string;
  cardCount: number;
  locked: boolean;
};

type Stats = {
  currentStreak: number;
  longestStreak: number;
  cardsReviewedTotal: number;
  lastStudyDate: string | null;
};

export function FlashcardsHubClient() {
  const [decks, setDecks] = useState<DeckRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const [dRes, sRes] = await Promise.all([
        fetch(`/api/flashcards/decks?page=${p}&pageSize=18`, { credentials: "include" }),
        fetch("/api/flashcards/stats", { credentials: "include" }).catch(() => null),
      ]);
      const dJson = (await dRes.json()) as { decks?: DeckRow[]; error?: string; page?: number; pageCount?: number };
      if (!dRes.ok) throw new Error(dJson.error ?? "Failed to load decks");
      setDecks(asArray(dJson.decks));
      setPage(dJson.page ?? 1);
      setTotalPages(dJson.pageCount ?? 1);
      if (sRes?.ok) {
        const sJson = await sRes.json();
        setStats(sJson);
      } else {
        setStats(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setDecks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(1);
  }, [load]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">Flashcards</h1>
      <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
        Pathway-scoped decks with spaced repetition. Preview decks show a short sample; subscribers get full decks and review
        scheduling.
      </p>

      {stats && (stats.currentStreak > 0 || stats.cardsReviewedTotal > 0) ? (
        <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-4 text-center">
          <div>
            <p className="text-2xl font-bold tabular-nums text-primary">{stats.currentStreak}</p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">Day streak</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{stats.longestStreak}</p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">Best streak</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{stats.cardsReviewedTotal}</p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">Reviews</p>
          </div>
        </div>
      ) : null}

      {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

      {loading ? <p className="mt-8 text-sm text-[var(--theme-muted-text)]">Loading decks…</p> : null}

      {!loading && decks.length === 0 && !error ? (
        <p className="mt-8 text-sm text-[var(--theme-muted-text)]">
          No decks available yet. Check back soon, or explore the{" "}
          <Link href="/app/questions" className="font-semibold text-primary underline">
            question bank
          </Link>
          .
        </p>
      ) : null}

      <ul className="mt-8 space-y-4">
        {decks.map((d) => (
          <li key={d.id} className="nn-card p-4 transition hover:border-primary/30">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {d.examFamily.replace(/_/g, " ")} · {d.country}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">{d.title}</h2>
                {d.description ? (
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--theme-muted-text)]">{d.description}</p>
                ) : null}
                <p className="mt-2 text-xs text-[var(--theme-muted-text)]">{d.cardCount} cards</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                {d.locked ? (
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    Subscription required
                  </span>
                ) : null}
                {d.locked ? (
                  <Link
                    href="/pricing"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
                  >
                    Subscribe to unlock
                  </Link>
                ) : (
                  <Link
                    href={`/app/flashcards/${d.slug}`}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
                  >
                    Study
                  </Link>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 ? (
        <nav className="mt-10 flex items-center justify-between text-sm" aria-label="Deck pagination">
          <button
            type="button"
            disabled={page <= 1 || loading}
            className="font-medium text-primary disabled:opacity-40"
            onClick={() => void load(page - 1)}
          >
            Previous
          </button>
          <span className="text-[var(--theme-muted-text)]">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            className="font-medium text-primary disabled:opacity-40"
            onClick={() => void load(page + 1)}
          >
            Next
          </button>
        </nav>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-2">
        <Link
          href="/app/questions"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/50"
        >
          Question bank
        </Link>
        <Link
          href="/exam-lessons"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/50"
        >
          Exam lessons
        </Link>
      </div>
    </div>
  );
}
