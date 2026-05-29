"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type FlashcardRow = {
  id: string;
  front: string;
  status: string;
  tier: string;
  country: string;
  updatedAt: string;
};

type FlashcardSummary = {
  generatedAt: string;
  decks: { total: number; published: number; hidden: number };
  cards: {
    total: number;
    published: number;
    publishedOrphans: number;
    publishedMissingTopicCode: number;
    perExamFamily: Record<string, number>;
  };
  quality: {
    publishedDecksWithCardCountUnder3: number;
    deckAndTagSlugCollisions: string[];
    sampledCards?: number;
    sampledNeedsReview?: number;
    sampledCritical?: number;
    reviewQueueSample?: Array<{ id: string; score: number; severity: string; flags: string[] }>;
  };
  health?: {
    recentAttempts7d: number;
    recentOptionResponses7d: number;
    recentSessions7d: number;
  };
};

export function AdminFlashcardListClient() {
  const [rows, setRows] = useState<FlashcardRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<FlashcardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/api/admin/flashcards?page=${page}&pageSize=25`, { credentials: "include" }).then((r) => r.json()),
      fetch("/api/admin/flashcards/summary", { credentials: "include" }).then((r) => r.json()).catch(() => null),
    ])
      .then(([data, summaryData]: [{ flashcards?: FlashcardRow[]; total?: number }, FlashcardSummary | null]) => {
        setRows(data.flashcards ?? []);
        setTotal(data.total ?? 0);
        setSummary(summaryData);
      })
      .catch(() => setError("Failed to load flashcards."))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-8 text-center text-sm text-[var(--semantic-text-muted)]">
        Loading…
      </div>
    );
  }
  if (error) {
    return (
      <p className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_30%,transparent)] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))] p-4 text-sm text-[var(--semantic-danger)]">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {summary ? (
        <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)]">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--semantic-text-primary)]">Flashcard Health</h2>
              <p className="text-xs text-[var(--semantic-text-muted)]">
                Learner intelligence, completion, and content-quality signals.
              </p>
            </div>
            <span className="text-[11px] text-[var(--semantic-text-muted)]">
              Updated {new Date(summary.generatedAt).toLocaleString()}
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Published cards", summary.cards.published.toLocaleString()],
              ["Sessions 7d", (summary.health?.recentSessions7d ?? 0).toLocaleString()],
              ["Attempts 7d", (summary.health?.recentAttempts7d ?? 0).toLocaleString()],
              ["Quality flags", `${summary.quality.sampledCritical ?? 0} critical`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-3">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">{label}</span>
                <strong className="mt-1 block text-lg text-[var(--semantic-text-primary)]">{value}</strong>
              </div>
            ))}
          </div>
          {summary.quality.reviewQueueSample?.length ? (
            <div className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                Question quality review queue
              </h3>
              <div className="mt-2 space-y-2">
                {summary.quality.reviewQueueSample.slice(0, 4).map((row) => (
                  <Link
                    key={row.id}
                    href={`/admin/flashcards/${row.id}`}
                    className="flex flex-col gap-1 rounded-lg border border-[var(--semantic-border-soft)] px-3 py-2 text-xs hover:bg-[var(--semantic-panel-muted)] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-semibold text-[var(--semantic-text-primary)]">{row.id}</span>
                    <span className="text-[var(--semantic-text-muted)]">
                      {row.severity} · score {row.score} · {row.flags.join(", ")}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
      <p className="text-xs text-[var(--semantic-text-muted)]">{total} total flashcards</p>
      <div className="overflow-x-auto rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]">
            <tr>
              {["Front", "Status", "Tier", "Country", "Updated", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[var(--semantic-border-soft)] last:border-0 hover:bg-[var(--semantic-panel-muted)]"
              >
                <td className="max-w-[280px] truncate px-4 py-3 text-[var(--semantic-text-primary)]">
                  {row.front}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      row.status === "PUBLISHED"
                        ? "bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))] text-[var(--semantic-success)]"
                        : row.status === "DRAFT"
                          ? "bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-muted)]"
                          : "bg-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-surface))] text-[var(--semantic-warning)]"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[var(--semantic-text-muted)]">{row.tier}</td>
                <td className="px-4 py-3 text-xs text-[var(--semantic-text-muted)]">{row.country}</td>
                <td className="px-4 py-3 text-xs text-[var(--semantic-text-muted)]">
                  {new Date(row.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/flashcards/${row.id}`}
                    className="text-xs font-semibold text-[var(--semantic-brand)] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-[var(--semantic-text-muted)]">
                  No flashcards yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {total > 25 ? (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-[var(--semantic-border-soft)] px-3 py-1.5 text-xs disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="self-center text-xs text-[var(--semantic-text-muted)]">
            Page {page} of {Math.ceil(total / 25)}
          </span>
          <button
            type="button"
            disabled={page >= Math.ceil(total / 25)}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-[var(--semantic-border-soft)] px-3 py-1.5 text-xs disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      ) : null}
    </div>
  );
}
