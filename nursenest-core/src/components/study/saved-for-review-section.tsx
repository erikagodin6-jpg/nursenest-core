/**
 * SavedForReviewSection
 *
 * Compact preview of saved notes, rationales, and lesson bookmarks.
 * Client component — lazy-loaded after initial page paint.
 *
 * Loads up to 5 recent notes via the passed action; links to full notes index.
 * Uses soft neutral/accent surfaces to feel personal and sticky.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type SavedNotePreview = {
  title: string | null;
  scopeLabel: string;
  href: string;
  updatedAt: string;
  isBookmark?: boolean;
  isSavedRationale?: boolean;
};

type Props = {
  loadAction: () => Promise<SavedNotePreview[]>;
};

function NoteChip({ note }: { note: SavedNotePreview }) {
  const accent = note.isBookmark
    ? "var(--semantic-info)"
    : note.isSavedRationale
    ? "var(--semantic-success)"
    : "var(--semantic-brand)";

  const displayTitle = note.title?.trim() || "Untitled note";

  return (
    <Link
      href={note.href}
      className="flex flex-col gap-1 rounded-xl p-3 transition hover:opacity-90"
      style={{
        background: `color-mix(in srgb, ${accent} 6%, var(--bg-page))`,
        border: `1px solid color-mix(in srgb, ${accent} 15%, transparent)`,
      }}
    >
      <div className="flex items-center gap-1.5">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{
            background: `color-mix(in srgb, ${accent} 12%, var(--semantic-surface))`,
            color: accent,
          }}
        >
          {note.scopeLabel}
        </span>
      </div>
      <p
        className="line-clamp-1 text-xs font-medium"
        style={{ color: "var(--semantic-text-primary)" }}
      >
        {displayTitle}
      </p>
      <p className="text-[10px]" style={{ color: "var(--semantic-text-muted)" }}>
        {new Date(note.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
      </p>
    </Link>
  );
}

export function SavedForReviewSection({ loadAction }: Props) {
  const [notes, setNotes] = useState<SavedNotePreview[] | null>(null);

  useEffect(() => {
    loadAction()
      .then(setNotes)
      .catch(() => setNotes([]));
  }, [loadAction]);

  if (notes === null) {
    return (
      <section aria-labelledby="saved-review-heading">
        <h2
          id="saved-review-heading"
          className="mb-3 text-lg font-bold"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          Saved for Review
        </h2>
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--semantic-panel-muted)",
            border: "1px solid var(--semantic-border-soft)",
          }}
        >
          <p className="text-sm animate-pulse" style={{ color: "var(--semantic-text-muted)" }}>
            Loading saved items…
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="saved-review-heading">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2
            id="saved-review-heading"
            className="text-lg font-bold"
            style={{ color: "var(--semantic-text-primary)" }}
          >
            Saved for Review
          </h2>
          <p className="mt-0.5 text-sm" style={{ color: "var(--semantic-text-muted)" }}>
            Recent notes, saved rationales, and lesson bookmarks.
          </p>
        </div>
        <Link
          href="/app/account/notes"
          className="shrink-0 text-xs font-semibold underline underline-offset-2"
          style={{ color: "var(--semantic-brand)" }}
        >
          All notes
        </Link>
      </div>

      {notes.length === 0 ? (
        <div
          className="rounded-2xl p-5 text-center"
          style={{
            background: "color-mix(in srgb, var(--semantic-brand) 4%, var(--bg-page))",
            border: "1px solid var(--semantic-border-soft)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--semantic-text-secondary)" }}>
            Nothing saved yet. Use the notes panel in lessons or click &ldquo;Save this rationale&rdquo; in practice to start your personal library.
          </p>
          <Link
            href="/app/lessons"
            className="mt-3 inline-flex rounded-full px-4 py-2 text-xs font-semibold transition hover:opacity-90"
            style={{
              background: "color-mix(in srgb, var(--semantic-brand) 12%, var(--semantic-surface))",
              color: "var(--semantic-brand)",
              border: "1px solid color-mix(in srgb, var(--semantic-brand) 20%, transparent)",
            }}
          >
            Browse lessons
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {notes.slice(0, 6).map((note, i) => (
            <NoteChip key={i} note={note} />
          ))}
        </div>
      )}
    </section>
  );
}
