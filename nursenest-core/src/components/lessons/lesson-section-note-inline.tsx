"use client";

/**
 * LessonSectionNoteInline — per-section note button and inline editor.
 *
 * Appears as a small "📝 Note" button beneath each lesson section.
 * Clicking opens a compact inline editor that autosaves to LearnerNote
 * using contextId = "sn:{sectionId}" (same scope as the lesson).
 *
 * Because section IDs are short CUIDs (~25 chars), contextId stays well
 * within the VarChar(128) limit (28 chars with "sn:" prefix).
 *
 * Notes are visible in /app/account/notes under "All notes" (isSectionNote flag
 * marks them as section-level for filtering/display).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { LearnerNoteScope } from "@prisma/client";

// ─── Save state ────────────────────────────────────────────────────────────────

type SaveState = "idle" | "saving" | "saved" | "error";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function sectionContextId(sectionId: string): string {
  return `sn:${sectionId}`;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function LessonSectionNoteInline({
  userId,
  sectionId,
  sectionHeading,
  scope,
  pathwayId,
  topic,
}: {
  userId: string;
  sectionId: string;
  sectionHeading: string;
  scope: LearnerNoteScope;
  pathwayId?: string | null;
  topic?: string | null;
}) {
  const contextId = sectionContextId(sectionId);

  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasContent = body.trim().length > 0;

  // ── Load existing note ─────────────────────────────────────────────────────
  const loadNote = useCallback(async () => {
    if (!userId) return;
    try {
      const qs = new URLSearchParams({ scope, contextId });
      const res = await fetch(`/api/learner/notes?${qs.toString()}`);
      if (!res.ok) return;
      const data = (await res.json()) as {
        note?: { body: string; updatedAt: string } | null;
      };
      if (data.note?.body) {
        setBody(data.note.body);
        setHasExisting(true);
        if (data.note.updatedAt) setSavedAt(new Date(data.note.updatedAt));
      }
    } finally {
      setLoaded(true);
    }
  }, [userId, scope, contextId]);

  useEffect(() => {
    void loadNote();
  }, [loadNote]);

  // ── Focus on open ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (open && loaded && textareaRef.current) {
      const t = setTimeout(() => textareaRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open, loaded]);

  // ── Autosave ───────────────────────────────────────────────────────────────
  const persist = useCallback(
    async (nextBody: string) => {
      if (!userId || !nextBody.trim()) return;
      setSaveState("saving");
      try {
        const res = await fetch("/api/learner/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scope,
            contextId,
            pathwayId: pathwayId ?? undefined,
            topic: topic ?? undefined,
            title: sectionHeading ? `Section: ${sectionHeading}` : undefined,
            body: nextBody,
          }),
        });
        if (res.ok) {
          setSaveState("saved");
          setSavedAt(new Date());
          setHasExisting(true);
          setTimeout(() => setSaveState("idle"), 2500);
        } else {
          setSaveState("error");
        }
      } catch {
        setSaveState("error");
      }
    },
    [userId, scope, contextId, pathwayId, topic, sectionHeading],
  );

  useEffect(() => {
    if (!loaded || !open) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persist(body);
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [body, loaded, open, persist]);

  // ── Clear ──────────────────────────────────────────────────────────────────
  async function clearNote() {
    if (!window.confirm("Remove this section note?")) return;
    const qs = new URLSearchParams({ scope, contextId });
    await fetch(`/api/learner/notes?${qs.toString()}`, { method: "DELETE" });
    setBody("");
    setSaveState("idle");
    setSavedAt(null);
    setHasExisting(false);
    setOpen(false);
  }

  // ── Save status display ────────────────────────────────────────────────────
  const statusText =
    saveState === "saving"
      ? "Saving…"
      : saveState === "saved"
      ? `Saved ${savedAt ? formatTime(savedAt) : ""}`
      : saveState === "error"
      ? "Save failed"
      : hasExisting && savedAt
      ? `Saved ${formatTime(savedAt)}`
      : null;

  const statusColor =
    saveState === "error"
      ? "var(--semantic-danger)"
      : saveState === "saved"
      ? "var(--semantic-success)"
      : "var(--semantic-text-muted)";

  return (
    <div className="mt-4">
      {/* Trigger button */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: hasExisting
              ? "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))"
              : "color-mix(in srgb, var(--semantic-text-muted) 8%, var(--semantic-surface))",
            border: hasExisting
              ? "1px solid color-mix(in srgb, var(--semantic-brand) 25%, transparent)"
              : "1px dashed color-mix(in srgb, var(--semantic-text-muted) 40%, transparent)",
            color: hasExisting
              ? "var(--semantic-brand)"
              : "var(--semantic-text-muted)",
          }}
          aria-label={hasExisting ? "Edit section note" : "Add a note for this section"}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1.5 2.5A1 1 0 012.5 1.5h5.086L9.5 3.414V9.5A1 1 0 018.5 10.5h-6A1 1 0 011.5 9.5v-7z"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path d="M7.5 1.5v2h2" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
            <path d="M3.5 5.5h5M3.5 7.5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          {hasExisting ? "Section note ✓" : "Add section note"}
        </button>
      ) : (
        /* Inline editor */
        <div
          className="overflow-hidden rounded-xl border"
          style={{
            background: "color-mix(in srgb, var(--semantic-brand) 4%, var(--semantic-surface))",
            borderColor: "color-mix(in srgb, var(--semantic-brand) 22%, var(--semantic-border-soft))",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between border-b px-3 py-2"
            style={{
              borderColor: "color-mix(in srgb, var(--semantic-brand) 15%, var(--semantic-border-soft))",
              background: "color-mix(in srgb, var(--semantic-brand) 7%, var(--semantic-surface))",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: "var(--semantic-brand)" }}>
                📝 Section note
              </span>
              {sectionHeading ? (
                <span
                  className="max-w-[180px] truncate text-[10px]"
                  style={{ color: "var(--semantic-text-muted)" }}
                >
                  — {sectionHeading}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              {statusText ? (
                <span className="text-[10px]" style={{ color: statusColor }}>
                  {statusText}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs"
                style={{ color: "var(--semantic-text-muted)" }}
                aria-label="Collapse section note"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Textarea */}
          <div className="p-3">
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Notes for this section… saves automatically."
              rows={4}
              className="w-full resize-none rounded-lg border bg-transparent px-3 py-2.5 text-sm leading-relaxed placeholder-[var(--semantic-text-muted)] focus:outline-none"
              style={{
                color: "var(--semantic-text-primary)",
                borderColor: "var(--semantic-border-soft)",
              }}
              aria-label="Section note body"
              maxLength={10000}
            />
          </div>

          {/* Footer */}
          <div
            className="flex flex-wrap items-center gap-2 border-t px-3 py-2"
            style={{
              borderColor: "color-mix(in srgb, var(--semantic-brand) 15%, var(--semantic-border-soft))",
            }}
          >
            <span className="text-[10px]" style={{ color: "var(--semantic-text-muted)" }}>
              {body.length.toLocaleString()} chars
            </span>
            {hasContent ? (
              <button
                type="button"
                onClick={() => void clearNote()}
                className="ml-auto text-[10px] transition-opacity hover:opacity-70"
                style={{ color: "var(--semantic-danger)" }}
              >
                Remove note
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-auto text-[10px] transition-opacity hover:opacity-70"
                style={{ color: "var(--semantic-text-muted)" }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(d: Date): string {
  const mins = Math.floor((Date.now() - d.getTime()) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
