"use client";

/**
 * NotesPanel — premium, palette-varied notes editor for lesson and practice surfaces.
 *
 * Replaces the basic StudyNotesPanel for new surfaces; existing StudyNotesPanel
 * remains untouched in places already using it.
 *
 * Design surfaces:
 *   - Outer panel card:    --surface-soft-a
 *   - Editor focus state:  --surface-emphasis border + ring
 *   - Save indicator:      --semantic-success tint
 *   - Action pills:        neutral chips
 *
 * API: calls existing /api/learner/notes (GET, POST, DELETE) — no new routes needed.
 *
 * Usage:
 *   <NotesPanel
 *     scope="PATHWAY_LESSON"
 *     contextId={lesson.slug}
 *     topic={lesson.topic}
 *     sourceLabel={lesson.title}
 *   />
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { LearnerNoteScope } from "@prisma/client";

// ── Types ─────────────────────────────────────────────────────────────────────

export type NotesPanelProps = {
  scope: LearnerNoteScope;
  /** Unique identifier for the content being noted (lesson slug, question id, etc.) */
  contextId: string;
  pathwayId?: string | null;
  topic?: string | null;
  /** Short source label for print/export (e.g. lesson title). */
  sourceLabel: string;
  /** Optional subscriber label for the print header. */
  userLabel?: string;
  /** Initial collapsed/expanded state. Default: false (collapsed). */
  defaultOpen?: boolean;
};

type SaveState = "idle" | "saving" | "saved" | "error";

// ── API helpers ───────────────────────────────────────────────────────────────

async function fetchNote(scope: string, contextId: string) {
  const qs = new URLSearchParams({ scope, contextId });
  const res = await fetch(`/api/learner/notes?${qs}`);
  if (!res.ok) throw new Error("fetch failed");
  const data = (await res.json()) as { note?: { title: string | null; body: string } | null };
  return data.note ?? null;
}

async function upsertNote(payload: {
  scope: string;
  contextId: string;
  pathwayId?: string;
  topic?: string;
  title?: string;
  body: string;
}) {
  const res = await fetch("/api/learner/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("save failed");
}

async function deleteNote(scope: string, contextId: string) {
  const qs = new URLSearchParams({ scope, contextId });
  const res = await fetch(`/api/learner/notes?${qs}`, { method: "DELETE" });
  if (!res.ok) throw new Error("delete failed");
}

// ── NoteEditorCard (inner component) ─────────────────────────────────────────

export function NoteEditorCard({
  title,
  body,
  onTitleChange,
  onBodyChange,
  saveState,
  onClear,
  onPrint,
  onExport,
  hasContent,
}: {
  title: string;
  body: string;
  onTitleChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  saveState: SaveState;
  onClear: () => void;
  onPrint: () => void;
  onExport: () => void;
  hasContent: boolean;
}) {
  const [focused, setFocused] = useState(false);

  const editorSurface = focused
    ? "color-mix(in srgb, var(--semantic-brand) 4%, var(--semantic-surface))"
    : "var(--semantic-surface)";
  const editorBorder = focused
    ? "color-mix(in srgb, var(--semantic-brand) 40%, var(--semantic-border-soft))"
    : "var(--semantic-border-soft)";

  return (
    <div className="space-y-2.5">
      {/* Title */}
      <input
        type="text"
        placeholder="Optional title or keyword…"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-xl px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none"
        style={{
          background: editorSurface,
          border: `1px solid ${editorBorder}`,
          color: "var(--semantic-text-primary)",
        }}
        aria-label="Note title"
        maxLength={200}
      />

      {/* Body */}
      <div
        className="overflow-hidden rounded-xl transition-all"
        style={{
          background: editorSurface,
          border: `1px solid ${editorBorder}`,
          boxShadow: focused
            ? `0 0 0 3px color-mix(in srgb, var(--semantic-brand) 12%, transparent)`
            : "none",
        }}
      >
        <textarea
          placeholder="Your notes, mnemonics, or study reminders…&#10;Use this space freely — your notes stay in your account."
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={5}
          className="min-h-[120px] w-full resize-y bg-transparent px-3 py-2.5 text-sm leading-relaxed focus-visible:outline-none"
          style={{ color: "var(--semantic-text-primary)" }}
          aria-label="Note body"
        />
        {/* Character count + save state */}
        <div
          className="flex items-center justify-between border-t px-3 py-1.5"
          style={{ borderColor: "var(--semantic-border-soft)" }}
        >
          <span
            className="text-[10px] tabular-nums"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            {body.length.toLocaleString()} chars
          </span>
          <SaveIndicator state={saveState} />
        </div>
      </div>

      {/* Action pills */}
      <div className="flex flex-wrap gap-1.5">
        <ActionPill onClick={onPrint} label="Print" />
        <ActionPill onClick={onExport} label="Export .txt" />
        {hasContent && (
          <ActionPill onClick={onClear} label="Clear note" variant="danger" />
        )}
      </div>
    </div>
  );
}

function SaveIndicator({ state }: { state: SaveState }) {
  if (state === "idle") return null;
  const map = {
    saving: { text: "Saving…", color: "var(--semantic-text-muted)" },
    saved: { text: "Saved ✓", color: "var(--semantic-success)" },
    error: { text: "Save failed", color: "var(--semantic-danger)" },
  } as const;
  const { text, color } = map[state];
  return (
    <span className="text-[10px] font-medium transition-all" style={{ color }}>
      {text}
    </span>
  );
}

function ActionPill({
  onClick,
  label,
  variant = "neutral",
}: {
  onClick: () => void;
  label: string;
  variant?: "neutral" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3 py-1 text-[11px] font-semibold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={
        variant === "danger"
          ? {
              background: "color-mix(in srgb, var(--semantic-danger) 8%, var(--semantic-surface))",
              border: "1px solid color-mix(in srgb, var(--semantic-danger) 20%, transparent)",
              color: "var(--semantic-danger)",
            }
          : {
              background: "color-mix(in srgb, var(--semantic-text-muted) 8%, var(--semantic-surface))",
              border: "1px solid var(--semantic-border-soft)",
              color: "var(--semantic-text-secondary)",
            }
      }
    >
      {label}
    </button>
  );
}

// ── NotesPanel ────────────────────────────────────────────────────────────────

export function NotesPanel({
  scope,
  contextId,
  pathwayId,
  topic,
  sourceLabel,
  userLabel,
  defaultOpen = false,
}: NotesPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialDone, setInitialDone] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load existing note when panel opens
  useEffect(() => {
    if (!contextId || initialDone) return;
    setLoading(true);
    fetchNote(scope, contextId)
      .then((note) => {
        if (note) {
          setTitle(note.title ?? "");
          setBody(note.body ?? "");
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        setInitialDone(true);
      });
  }, [scope, contextId, initialDone]);

  // Debounced auto-save
  useEffect(() => {
    if (!open || !initialDone || loading) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaveState("saving");
      upsertNote({
        scope,
        contextId,
        pathwayId: pathwayId ?? undefined,
        topic: topic ?? undefined,
        title: title.trim() || undefined,
        body,
      })
        .then(() => {
          setSaveState("saved");
          savedTimer.current = setTimeout(() => setSaveState("idle"), 2000);
        })
        .catch(() => setSaveState("error"));
    }, 700);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [title, body, open, initialDone, loading, scope, contextId, pathwayId, topic]);

  async function handleClear() {
    if (!title.trim() && !body.trim()) return;
    if (!window.confirm("Clear this saved note?")) return;
    try {
      await deleteNote(scope, contextId);
      setTitle("");
      setBody("");
      setSaveState("idle");
    } catch {
      setSaveState("error");
    }
  }

  function handlePrint() {
    const html = buildPrintHtml({ sourceLabel, userLabel, scope, title, body });
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  }

  function handleExport() {
    const blob = new Blob(
      [`My study notes\nSource: ${sourceLabel}\nScope: ${scope}\n---\n${title ? `${title}\n\n` : ""}${body}\n`],
      { type: "text/plain;charset=utf-8" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `notes-${contextId.slice(0, 12)}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const hasContent = Boolean(title.trim() || body.trim());

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: "var(--surface-soft-a, var(--semantic-panel-cool))",
        border: "1px solid color-mix(in srgb, var(--semantic-brand) 15%, var(--semantic-border-soft))",
      }}
    >
      {/* Header — always visible */}
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-opacity hover:opacity-90 focus-visible:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          {/* Notes icon */}
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
            style={{ background: "color-mix(in srgb, var(--semantic-brand) 15%, var(--semantic-surface))" }}
            aria-hidden
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--semantic-brand)" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </span>
          <span className="text-sm font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
            My Notes
          </span>
          {hasContent && !loading && (
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
              style={{
                background: "color-mix(in srgb, var(--semantic-brand) 15%, var(--semantic-surface))",
                color: "var(--semantic-brand)",
              }}
            >
              Saved
            </span>
          )}
        </div>
        <span
          className="text-[11px] font-medium"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          {open ? "Collapse" : "Expand"}
        </span>
      </button>

      {/* Collapsible body */}
      {open && (
        <div className="border-t px-5 pb-5 pt-4" style={{ borderColor: "var(--semantic-border-soft)" }}>
          <p className="mb-3 text-xs leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
            Your notes save to your account automatically. They are yours to print and export.
          </p>
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 animate-pulse rounded-xl" style={{ background: "var(--semantic-border-soft)" }} />
              <div className="h-24 animate-pulse rounded-xl" style={{ background: "var(--semantic-border-soft)" }} />
            </div>
          ) : (
            <NoteEditorCard
              title={title}
              body={body}
              onTitleChange={setTitle}
              onBodyChange={setBody}
              saveState={saveState}
              onClear={handleClear}
              onPrint={handlePrint}
              onExport={handleExport}
              hasContent={hasContent}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ── Print HTML builder ────────────────────────────────────────────────────────

function buildPrintHtml({
  sourceLabel,
  userLabel,
  scope,
  title,
  body,
}: {
  sourceLabel: string;
  userLabel?: string;
  scope: string;
  title: string;
  body: string;
}) {
  const printedAt = new Date().toLocaleString();
  const labelLine = userLabel
    ? `<div class="meta">Subscriber: ${esc(userLabel)} · For individual study use only</div>`
    : "";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Study notes</title>
<style>
body { font-family: system-ui, sans-serif; padding: 28px; max-width: 720px; margin: 0 auto; color: #111; }
h1 { font-size: 1rem; margin: 0 0 4px; }
.meta { font-size: 12px; color: #555; margin-bottom: 16px; }
.title { font-size: 14px; font-weight: 600; margin: 12px 0 8px; }
.body { white-space: pre-wrap; font-size: 14px; line-height: 1.6; }
.foot { margin-top: 28px; font-size: 10px; color: #888; border-top: 1px solid #ddd; padding-top: 12px; }
</style></head><body>
<h1>My Study Notes</h1>
${labelLine}
<div class="meta">Source: ${esc(sourceLabel)} · Scope: ${esc(scope)} · Printed ${esc(printedAt)}</div>
${title.trim() ? `<div class="title">${esc(title.trim())}</div>` : ""}
<div class="body">${esc(body)}</div>
<p class="foot">User notes only. Premium content from NurseNest is not included. Please respect your subscription terms.</p>
</body></html>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
