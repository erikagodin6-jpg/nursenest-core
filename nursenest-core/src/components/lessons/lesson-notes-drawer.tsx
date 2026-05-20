"use client";

/**
 * LessonNotesDrawer — premium notes experience for lesson pages.
 *
 * Surfaces:
 *   - A floating pill FAB (fixed bottom-right, always accessible)
 *   - Desktop: slides in from the right as a fixed side drawer (~380px)
 *   - Mobile: slides up as a bottom sheet (60vh)
 *
 * Features:
 *   - Autosave with 700ms debounce (same timing as StudyNotesPanel)
 *   - Rich save states: idle / saving / saved / error
 *   - Character count + word count
 *   - Keyboard shortcut: Cmd/Ctrl+Shift+N to toggle
 *   - Print and .txt export (preserves existing StudyNotesPanel behavior)
 *   - Clear note with confirm
 *   - Empty state with helpful prompt
 *   - Full theme/palette compatibility via CSS variables
 *
 * Drop-in replacement for StudyNotesPanel (same props).
 */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { LearnerNoteScope } from "@prisma/client";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";

// ─── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  userId: string;
  scope: LearnerNoteScope;
  contextId: string;
  pathwayId?: string | null;
  topic?: string | null;
  sourceLabel: string;
  userLabel?: string;
  flags: PremiumProtectionFlags;
};

// ─── Save state ────────────────────────────────────────────────────────────────

type SaveState = "idle" | "saving" | "saved" | "error";

function SaveIndicator({ state, savedAt }: { state: SaveState; savedAt: Date | null }) {
  if (state === "saving") {
    return (
      <span
        className="flex items-center gap-1 text-[10px] font-medium"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        <span
          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ background: "var(--semantic-info)" }}
        />
        Saving…
      </span>
    );
  }
  if (state === "saved" && savedAt) {
    return (
      <span
        className="flex items-center gap-1 text-[10px] font-medium"
        style={{ color: "var(--semantic-success)" }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--semantic-success)" }}
        />
        Saved {formatSavedTime(savedAt)}
      </span>
    );
  }
  if (state === "error") {
    return (
      <span
        className="flex items-center gap-1 text-[10px] font-medium"
        style={{ color: "var(--semantic-danger)" }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--semantic-danger)" }}
        />
        Save failed
      </span>
    );
  }
  return null;
}

function formatSavedTime(d: Date): string {
  const mins = Math.floor((Date.now() - d.getTime()) / 60_000);
  if (mins < 1) return "just now";
  if (mins === 1) return "1m ago";
  if (mins < 60) return `${mins}m ago`;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Floating Action Button ────────────────────────────────────────────────────

function NotesFAB({
  open,
  hasContent,
  onClick,
}: {
  open: boolean;
  hasContent: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={open ? "Close lesson notes" : "Open lesson notes (Ctrl+Shift+N)"}
      aria-expanded={open}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-[1.04] hover:shadow-xl active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        background: open
          ? "var(--semantic-surface)"
          : "var(--semantic-brand)",
        color: open
          ? "var(--semantic-brand)"
          : "#fff",
        border: open
          ? "1.5px solid color-mix(in srgb, var(--semantic-brand) 35%, var(--semantic-border-soft))"
          : "none",
        boxShadow: open
          ? "0 2px 12px color-mix(in srgb, var(--semantic-brand) 20%, transparent)"
          : "0 4px 16px color-mix(in srgb, var(--semantic-brand) 28%, transparent)",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M2 3.5A1.5 1.5 0 013.5 2h7.586L13 3.914V12.5A1.5 1.5 0 0111.5 14h-8A1.5 1.5 0 012 12.5v-9z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path
          d="M10 2v2.5h2.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path
          d="M5 7.5h6M5 10h4"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        {hasContent && !open && (
          <circle cx="12.5" cy="3.5" r="2.5" fill="var(--semantic-success)" />
        )}
      </svg>
      <span>{open ? "Close" : "Notes"}</span>
      {hasContent && !open ? (
        <span
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
          style={{ background: "var(--semantic-success)", color: "var(--text-inverse, #fff)" }}
          aria-label="Note saved"
        >
          ✓
        </span>
      ) : null}
    </button>
  );
}

// ─── Drawer shell ──────────────────────────────────────────────────────────────

function DrawerShell({
  open,
  onClose,
  headingId,
  children,
}: {
  open: boolean;
  onClose: () => void;
  headingId: string;
  children: React.ReactNode;
}) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      {/* Desktop: side drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="fixed bottom-0 right-0 top-0 z-50 hidden w-[380px] flex-col overflow-hidden shadow-2xl transition-transform duration-300 sm:flex"
        style={{
          background: "var(--semantic-surface, var(--bg-card, #fff))",
          borderLeft: "1px solid var(--semantic-border-soft)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
        aria-hidden={!open}
        tabIndex={open ? undefined : -1}
      >
        {children}
      </div>

      {/* Mobile: bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-t-2xl shadow-2xl transition-transform duration-300 sm:hidden"
        style={{
          background: "var(--semantic-surface, var(--bg-card, #fff))",
          borderTop: "1px solid var(--semantic-border-soft)",
          transform: open ? "translateY(0)" : "translateY(100%)",
        }}
        aria-hidden={!open}
        tabIndex={open ? undefined : -1}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pb-1 pt-3" aria-hidden="true">
          <div
            className="h-1 w-10 rounded-full"
            style={{ background: "var(--semantic-border-soft)" }}
          />
        </div>
        {children}
      </div>

      {/* Backdrop (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 z-40 sm:hidden"
          style={{ background: "rgba(0,0,0,0.35)" }}
          aria-hidden="true"
          onClick={onClose}
        />
      )}
    </>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function LessonNotesDrawer({
  userId,
  scope,
  contextId,
  pathwayId,
  topic,
  sourceLabel,
  userLabel,
  flags,
}: Props) {
  const headingId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const notesEditedTracked = useRef(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [initialDone, setInitialDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasContent = title.trim().length > 0 || body.trim().length > 0;
  const charCount = body.length;
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  // ── Keyboard shortcut (Ctrl/Cmd + Shift + N) ───────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Focus textarea when opening ────────────────────────────────────────────
  useEffect(() => {
    if (open && initialDone && textareaRef.current) {
      const t = setTimeout(() => textareaRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [open, initialDone]);

  // ── Load note on mount ─────────────────────────────────────────────────────
  const load = useCallback(async () => {
    if (!userId || !contextId) return;
    setLoading(true);
    setInitialDone(false);
    try {
      const qs = new URLSearchParams({ scope, contextId });
      const res = await fetch(`/api/learner/notes?${qs.toString()}`);
      if (!res.ok) return;
      const data = (await res.json()) as {
        note?: { title: string | null; body: string; updatedAt: string } | null;
      };
      if (data.note) {
        setTitle(data.note.title ?? "");
        setBody(data.note.body ?? "");
        if (data.note.updatedAt) setSavedAt(new Date(data.note.updatedAt));
      }
    } finally {
      setLoading(false);
      setInitialDone(true);
    }
  }, [userId, scope, contextId]);

  useEffect(() => {
    void load();
  }, [load]);

  // ── Persist (debounced) ────────────────────────────────────────────────────
  const persist = useCallback(
    async (nextTitle: string, nextBody: string) => {
      if (!userId) return;
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
            title: nextTitle.trim() || undefined,
            body: nextBody,
          }),
        });
        if (res.ok) {
          setSaveState("saved");
          setSavedAt(new Date());
          if (
            scope === "PATHWAY_LESSON" &&
            nextBody.trim().length > 24 &&
            !notesEditedTracked.current
          ) {
            notesEditedTracked.current = true;
            trackClientEvent(PH.learnerLessonNotesEdited, {
              pathway_id: (pathwayId ?? "").slice(0, 64),
              context_id_prefix: contextId.slice(0, 8),
            });
          }
          setTimeout(() => setSaveState("idle"), 3000);
        } else {
          setSaveState("error");
        }
      } catch {
        setSaveState("error");
      }
    },
    [userId, scope, contextId, pathwayId, topic],
  );

  useEffect(() => {
    if (!initialDone || loading) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persist(title, body);
    }, 700);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [title, body, initialDone, loading, persist]);

  // ── Clear ──────────────────────────────────────────────────────────────────
  async function clearNote() {
    if (!hasContent) return;
    if (!window.confirm("Clear this note from your account?")) return;
    const qs = new URLSearchParams({ scope, contextId });
    await fetch(`/api/learner/notes?${qs.toString()}`, { method: "DELETE" });
    setTitle("");
    setBody("");
    setSaveState("idle");
    setSavedAt(null);
  }

  // ── Print ──────────────────────────────────────────────────────────────────
  function printNote() {
    const labelLine = userLabel
      ? `<div class="meta">Subscriber: ${escHtml(userLabel)} · Individual study use only</div>`
      : "";
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>My notes — ${escHtml(sourceLabel)}</title>
<style>
  body{font-family:system-ui,sans-serif;padding:24px;max-width:720px;margin:0 auto;color:#111}
  h1{font-size:1.1rem;margin-bottom:4px}
  .meta{font-size:12px;color:#555;margin-bottom:16px}
  .body{white-space:pre-wrap;font-size:14px;line-height:1.6}
  .foot{margin-top:24px;font-size:10px;color:#888}
</style></head><body>
  <h1>My study notes</h1>
  ${labelLine}
  <div class="meta">Source: ${escHtml(sourceLabel)} · ${new Date().toISOString()}</div>
  ${title.trim() ? `<h2 style="font-size:14px;margin:12px 0 8px">${escHtml(title.trim())}</h2>` : ""}
  <div class="body">${escHtml(body)}</div>
  <p class="foot">Notes only. Premium content is not included.</p>
</body></html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  }

  // ── Export .txt ────────────────────────────────────────────────────────────
  function exportTxt() {
    const content = `My study notes\nSource: ${sourceLabel}\n---\n${title ? `${title}\n\n` : ""}${body}\n`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `notes-${contextId.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* ── FAB ────────────────────────────────────────────────────────────── */}
      <NotesFAB
        open={open}
        hasContent={hasContent}
        onClick={() =>
          setOpen((o) => {
            const next = !o;
            if (!o && next && scope === "PATHWAY_LESSON") {
              trackClientEvent(PH.learnerLessonNotesOpened, {
                pathway_id: (pathwayId ?? "").slice(0, 64),
                context_id_prefix: contextId.slice(0, 8),
              });
            }
            return next;
          })
        }
      />

      {/* ── Drawer (desktop side panel + mobile bottom sheet) ─────────────── */}
      <DrawerShell open={open} onClose={handleClose} headingId={headingId}>
        {/* Header */}
        <div
          className="flex shrink-0 items-center justify-between border-b px-4 py-3"
          style={{
            borderColor: "var(--semantic-border-soft)",
            background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))",
          }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs"
              style={{
                background: "color-mix(in srgb, var(--semantic-brand) 15%, var(--semantic-surface))",
                color: "var(--semantic-brand)",
              }}
              aria-hidden="true"
            >
              📝
            </span>
            <div>
              <h2
                id={headingId}
                className="text-sm font-semibold leading-tight"
                style={{ color: "var(--semantic-text-primary)" }}
              >
                Lesson notes
              </h2>
              <p
                className="text-[10px] leading-tight"
                style={{ color: "var(--semantic-text-muted)" }}
              >
                {sourceLabel.length > 40 ? sourceLabel.slice(0, 40) + "…" : sourceLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SaveIndicator state={saveState} savedAt={savedAt} />
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close notes"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-sm transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))]"
              style={{ color: "var(--semantic-text-muted)" }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Keyboard hint */}
        <div
          className="shrink-0 border-b px-4 py-1.5"
          style={{
            borderColor: "var(--semantic-border-soft)",
            background: "color-mix(in srgb, var(--semantic-brand) 3%, var(--semantic-surface))",
          }}
        >
          <p className="text-[10px]" style={{ color: "var(--semantic-text-muted)" }}>
            Shortcut: <kbd className="rounded px-1 py-0.5 font-mono text-[9px]" style={{ background: "var(--semantic-border-soft)" }}>Ctrl+Shift+N</kbd> to toggle
          </p>
        </div>

        {/* Editor area */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-5 animate-pulse rounded"
                  style={{
                    background: "color-mix(in srgb, var(--semantic-border-soft) 70%, transparent)",
                    width: i === 1 ? "60%" : i === 2 ? "85%" : "45%",
                  }}
                />
              ))}
            </div>
          ) : (
            <>
              {/* Optional title */}
              <input
                type="text"
                data-notes-editor
                placeholder="Optional title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm font-medium placeholder-[var(--semantic-text-muted)] transition-colors focus:outline-none focus:ring-1"
                style={{
                  color: "var(--semantic-text-primary)",
                  borderColor: "var(--semantic-border-soft)",
                }}
                aria-label="Note title"
                maxLength={200}
              />

              {/* Body */}
              <textarea
                ref={textareaRef}
                data-notes-editor
                placeholder={
                  hasContent
                    ? undefined
                    : "Write your own summary, mnemonics, connections, or questions… Notes save automatically."
                }
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="w-full flex-1 resize-none rounded-lg border bg-transparent px-3 py-3 text-sm leading-relaxed placeholder-[var(--semantic-text-muted)] transition-colors focus:outline-none focus:ring-1"
                style={{
                  color: "var(--semantic-text-primary)",
                  borderColor: "var(--semantic-border-soft)",
                  minHeight: "160px",
                }}
                aria-label="Note body"
                maxLength={80000}
              />

              {/* Empty state nudge */}
              {!hasContent && !loading ? (
                <div
                  className="rounded-lg px-3 py-3 text-xs leading-5"
                  style={{
                    background: "color-mix(in srgb, var(--semantic-info) 7%, var(--semantic-surface))",
                    border: "1px dashed color-mix(in srgb, var(--semantic-info) 30%, transparent)",
                    color: "var(--semantic-text-secondary)",
                  }}
                >
                  <strong style={{ color: "var(--semantic-text-primary)" }}>Tips:</strong>
                  {" "}Summarize key concepts in your own words. Add mnemonics. Note what surprised you. Connect it to what you already know.
                </div>
              ) : null}

              {/* Stats */}
              {hasContent ? (
                <div className="flex items-center justify-between text-[10px]" style={{ color: "var(--semantic-text-muted)" }}>
                  <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
                  <span>{charCount.toLocaleString()} / 80,000 chars</span>
                </div>
              ) : null}
            </>
          )}
        </div>

        {/* Footer actions */}
        <div
          className="shrink-0 space-y-3 border-t px-4 py-3"
          style={{ borderColor: "var(--semantic-border-soft)" }}
        >
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={printNote}
              disabled={!hasContent}
              className="rounded-full px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{
                background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
                color: "var(--semantic-brand)",
                border: "1px solid color-mix(in srgb, var(--semantic-brand) 25%, transparent)",
              }}
            >
              Print
            </button>
            <button
              type="button"
              onClick={exportTxt}
              disabled={!hasContent}
              className="rounded-full px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{
                background: "var(--semantic-surface)",
                color: "var(--semantic-text-secondary)",
                border: "1px solid var(--semantic-border-soft)",
              }}
            >
              Export .txt
            </button>
            {hasContent ? (
              <button
                type="button"
                onClick={() => void clearNote()}
                className="ml-auto rounded-full px-3 py-1.5 text-xs transition-opacity hover:opacity-80"
                style={{ color: "var(--semantic-danger)" }}
              >
                Clear note
              </button>
            ) : null}
          </div>
          {flags.hideProtectedOnPrint ? (
            <p className="text-[10px]" style={{ color: "var(--semantic-text-muted)" }}>
              Protected lesson content is hidden from browser print.
            </p>
          ) : null}
          <a
            href="/app/account/notes"
            className="block text-center text-[11px] font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--semantic-brand)" }}
          >
            View all your notes →
          </a>
        </div>
      </DrawerShell>
    </>
  );
}

// ─── HTML escape helper ────────────────────────────────────────────────────────

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
