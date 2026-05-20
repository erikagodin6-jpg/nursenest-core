"use client";

/**
 * SavedRationaleCard
 *
 * A "Save this rationale" action that persists the rationale text into
 * the learner's notes account using scope=QUESTION_BANK and a
 * prefixed contextId: "rationale:<questionId>".
 *
 * Two visual states:
 *   1. Unsaved  → subtle "Save this rationale" chip button
 *   2. Saved    → soft card (surface-soft-b) showing the saved excerpt + a link
 *                 to the Notes Index
 *
 * The saved state is optimistic: immediately shown on click; the API call
 * is in the background. If it fails, we revert with an error hint.
 *
 * Usage:
 *   <SavedRationaleCard
 *     questionId="clxyz123"
 *     rationale="The correct answer is A because..."
 *     topic="Cardiovascular"
 *   />
 */

import { useState } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────

export type SavedRationaleCardProps = {
  questionId: string;
  /** Full rationale text — will be trimmed to 5 000 chars for storage. */
  rationale: string;
  topic?: string | null;
  /** If true, shows as already saved on first render (e.g. loaded from DB). */
  initialSaved?: boolean;
};

// ── Helper: contextId for rationale notes ─────────────────────────────────────

function rationaleContextId(questionId: string): string {
  // "rationale:" prefix (10 chars) + questionId.slice(0, 118) ≤ 128 chars max
  return `rationale:${questionId.slice(0, 118)}`;
}

// ── API call ──────────────────────────────────────────────────────────────────

async function saveRationaleNote({
  questionId,
  rationale,
  topic,
}: {
  questionId: string;
  rationale: string;
  topic?: string | null;
}): Promise<void> {
  const body = JSON.stringify({
    scope: "QUESTION_BANK",
    contextId: rationaleContextId(questionId),
    topic: topic ?? undefined,
    title: "Saved rationale",
    body: rationale.slice(0, 5_000),
  });
  const res = await fetch("/api/learner/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  if (!res.ok) throw new Error("save failed");
}

async function deleteRationaleNote(questionId: string): Promise<void> {
  const qs = new URLSearchParams({ scope: "QUESTION_BANK", contextId: rationaleContextId(questionId) });
  const res = await fetch(`/api/learner/notes?${qs}`, { method: "DELETE" });
  if (!res.ok) throw new Error("delete failed");
}

// ── SavedRationaleCard ────────────────────────────────────────────────────────

export function SavedRationaleCard({
  questionId,
  rationale,
  topic,
  initialSaved = false,
}: SavedRationaleCardProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setPending(true);
    setError(null);
    setSaved(true); // optimistic
    try {
      await saveRationaleNote({ questionId, rationale, topic });
    } catch {
      setSaved(false);
      setError("Couldn't save — please try again.");
    } finally {
      setPending(false);
    }
  }

  async function handleUnsave() {
    setPending(true);
    setError(null);
    setSaved(false); // optimistic
    try {
      await deleteRationaleNote(questionId);
    } catch {
      setSaved(true);
      setError("Couldn't remove — please try again.");
    } finally {
      setPending(false);
    }
  }

  // ── Unsaved state: subtle chip button ─────────────────────────────────────

  if (!saved) {
    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          disabled={pending}
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-[11px] font-semibold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50"
          style={{
            background: "color-mix(in srgb, var(--semantic-info) 10%, var(--semantic-surface))",
            border: "1px solid color-mix(in srgb, var(--semantic-info) 25%, transparent)",
            color: "var(--semantic-info)",
          }}
        >
          {/* Bookmark icon */}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          {pending ? "Saving…" : "Save this rationale"}
        </button>
        {error && (
          <span className="text-[10px]" style={{ color: "var(--semantic-danger)" }}>
            {error}
          </span>
        )}
      </div>
    );
  }

  // ── Saved state: soft card with excerpt ──────────────────────────────────

  const snippet = rationale.slice(0, 220);
  const truncated = rationale.length > 220;

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: "var(--surface-soft-b, color-mix(in srgb, var(--semantic-success) 5%, var(--bg-card)))",
        border: "1px solid color-mix(in srgb, var(--semantic-success) 20%, var(--semantic-border-soft))",
      }}
    >
      {/* Card header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: "1px solid color-mix(in srgb, var(--semantic-success) 15%, var(--semantic-border-soft))" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full"
            style={{ background: "color-mix(in srgb, var(--semantic-success) 18%, var(--semantic-surface))" }}
            aria-hidden
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--semantic-success)" stroke="none" aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <span className="text-xs font-semibold" style={{ color: "var(--semantic-success)" }}>
            Saved to your notes
          </span>
          {topic && (
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
              style={{
                background: "color-mix(in srgb, var(--semantic-success) 12%, var(--semantic-surface))",
                color: "var(--semantic-success)",
              }}
            >
              {topic}
            </span>
          )}
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={handleUnsave}
          className="text-[10px] transition-opacity hover:opacity-70 focus-visible:outline-none disabled:opacity-40"
          style={{ color: "var(--semantic-text-muted)" }}
          aria-label="Remove saved rationale"
        >
          {pending ? "Removing…" : "Remove"}
        </button>
      </div>

      {/* Rationale excerpt */}
      <div className="px-4 py-3">
        <p
          className="text-[12px] leading-relaxed"
          style={{ color: "var(--semantic-text-secondary)" }}
        >
          {snippet}
          {truncated && <span style={{ color: "var(--semantic-text-muted)" }}>…</span>}
        </p>
      </div>

      {/* Footer link */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderTop: "1px solid color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-border-soft))" }}
      >
        <Link
          href="/app/account/notes"
          className="text-[10px] font-medium transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 rounded"
          style={{ color: "var(--semantic-brand)" }}
        >
          View all saved notes →
        </Link>
        {error && (
          <span className="text-[10px]" style={{ color: "var(--semantic-danger)" }}>
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
