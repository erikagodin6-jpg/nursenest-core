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

export function AdminFlashcardListClient() {
  const [rows, setRows] = useState<FlashcardRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/admin/flashcards?page=${page}&pageSize=25`, { credentials: "include" })
      .then((r) => r.json())
      .then((data: { flashcards?: FlashcardRow[]; total?: number }) => {
        setRows(data.flashcards ?? []);
        setTotal(data.total ?? 0);
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
