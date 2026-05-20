"use client";

/**
 * LessonSectionBookmark
 *
 * A lightweight "Mark this section" / "Bookmarked ✓" toggle for lesson sections.
 * Persists as a LearnerNote with:
 *   - scope:     PATHWAY_LESSON
 *   - contextId: "bk:<sectionId>" (max 128 chars, "bk:" prefix = 3 chars)
 *   - body:      section heading (used as display label in Notes Index)
 *   - title:     "Section: <sectionHeading>"
 *
 * State is optimistic: toggled immediately on click, API call in background.
 * No fetch on mount — avoids extra requests for every section on long lessons.
 * Users who want to see all bookmarks can visit /app/account/notes.
 *
 * Design surface: --surface-soft-c (cool info tint)
 *
 * Usage:
 *   <LessonSectionBookmark
 *     sectionId={section.id}
 *     sectionHeading={section.heading}
 *     pathwayId="rn"
 *     topic="Cardiovascular"
 *   />
 */

import { useState } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────

function bookmarkContextId(sectionId: string): string {
  // "bk:" prefix (3 chars) + up to 125 chars of sectionId ≤ 128 max
  return `bk:${sectionId.slice(0, 125)}`;
}

async function saveBookmark({
  sectionId,
  sectionHeading,
  pathwayId,
  topic,
}: {
  sectionId: string;
  sectionHeading: string;
  pathwayId?: string | null;
  topic?: string | null;
}): Promise<void> {
  const res = await fetch("/api/learner/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scope: "PATHWAY_LESSON",
      contextId: bookmarkContextId(sectionId),
      pathwayId: pathwayId ?? undefined,
      topic: topic ?? undefined,
      title: `Section: ${sectionHeading.slice(0, 180)}`,
      body: sectionHeading.slice(0, 500),
    }),
  });
  if (!res.ok) throw new Error("save failed");
}

async function removeBookmark(sectionId: string): Promise<void> {
  const qs = new URLSearchParams({
    scope: "PATHWAY_LESSON",
    contextId: bookmarkContextId(sectionId),
  });
  const res = await fetch(`/api/learner/notes?${qs}`, { method: "DELETE" });
  if (!res.ok) throw new Error("delete failed");
}

// ── Component ─────────────────────────────────────────────────────────────────

export type LessonSectionBookmarkProps = {
  sectionId: string;
  sectionHeading: string;
  pathwayId?: string | null;
  topic?: string | null;
  /** Initial saved state (can be passed from server if pre-loaded). Default: false. */
  initialSaved?: boolean;
};

export function LessonSectionBookmark({
  sectionId,
  sectionHeading,
  pathwayId,
  topic,
  initialSaved = false,
}: LessonSectionBookmarkProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    if (pending) return;
    setPending(true);
    setError(null);
    const nextSaved = !saved;
    setSaved(nextSaved); // optimistic
    try {
      if (nextSaved) {
        await saveBookmark({ sectionId, sectionHeading, pathwayId, topic });
      } else {
        await removeBookmark(sectionId);
      }
    } catch {
      setSaved(!nextSaved); // revert
      setError("Couldn't save");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50"
        style={
          saved
            ? {
                background: "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-surface))",
                border: "1px solid color-mix(in srgb, var(--semantic-info) 30%, transparent)",
                color: "var(--semantic-info)",
              }
            : {
                background: "color-mix(in srgb, var(--semantic-text-muted) 5%, var(--semantic-surface))",
                border: "1px solid var(--semantic-border-soft)",
                color: "var(--semantic-text-muted)",
              }
        }
        aria-label={saved ? "Remove section bookmark" : "Bookmark this section"}
        aria-pressed={saved}
      >
        {/* Bookmark icon */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        {pending
          ? saved
            ? "Saving…"
            : "Removing…"
          : saved
            ? "Bookmarked"
            : "Mark section"}
      </button>
      {error && (
        <span className="text-[10px]" style={{ color: "var(--semantic-danger)" }}>
          {error}
        </span>
      )}
    </div>
  );
}
