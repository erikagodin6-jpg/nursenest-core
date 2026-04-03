"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LearnerNoteScope } from "@prisma/client";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";

type Props = {
  userId: string;
  scope: LearnerNoteScope;
  contextId: string;
  pathwayId?: string | null;
  topic?: string | null;
  /** Short label for print/export (e.g. lesson title)—never full protected body. */
  sourceLabel: string;
  /** Masked subscriber label shown on printed notes only (not lesson content). */
  userLabel?: string;
  flags: PremiumProtectionFlags;
};

export function StudyNotesPanel({
  userId,
  scope,
  contextId,
  pathwayId,
  topic,
  sourceLabel,
  userLabel,
  flags,
}: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialDone, setInitialDone] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    if (!userId || !contextId) return;
    setLoading(true);
    setInitialDone(false);
    try {
      const qs = new URLSearchParams({ scope, contextId });
      const res = await fetch(`/api/learner/notes?${qs.toString()}`);
      if (!res.ok) return;
      const data = (await res.json()) as { note?: { title: string | null; body: string } | null };
      if (data.note) {
        setTitle(data.note.title ?? "");
        setBody(data.note.body ?? "");
      } else {
        setTitle("");
        setBody("");
      }
    } finally {
      setLoading(false);
      setInitialDone(true);
    }
  }, [userId, scope, contextId]);

  useEffect(() => {
    void load();
  }, [load]);

  const persist = useCallback(
    async (nextTitle: string, nextBody: string) => {
      if (!userId) return;
      setSaving(true);
      try {
        await fetch("/api/learner/notes", {
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
      } finally {
        setSaving(false);
      }
    },
    [userId, scope, contextId, pathwayId, topic],
  );

  useEffect(() => {
    if (!open || !initialDone || loading) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persist(title, body);
    }, 700);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [title, body, open, initialDone, loading, persist]);

  async function clearSavedNote() {
    if (!userId) return;
    if (!title.trim() && !body.trim()) return;
    if (!window.confirm("Clear this saved note from your account?")) return;
    const qs = new URLSearchParams({ scope, contextId });
    const res = await fetch(`/api/learner/notes?${qs.toString()}`, { method: "DELETE" });
    if (!res.ok) return;
    setTitle("");
    setBody("");
  }

  function printMyNotes() {
    const printedAt = new Date().toISOString();
    const labelLine = userLabel
      ? `<div class="meta">Subscriber: ${escapeHtml(userLabel)} · For individual study use only</div>`
      : "";
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>My study notes</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 24px; max-width: 720px; margin: 0 auto; color: #111; }
  h1 { font-size: 1.1rem; }
  .meta { font-size: 12px; color: #555; margin-bottom: 16px; }
  .body { white-space: pre-wrap; font-size: 14px; line-height: 1.5; }
  .foot { margin-top: 24px; font-size: 10px; color: #888; }
</style></head><body>
  <h1>My study notes</h1>
  ${labelLine}
  <div class="meta">Source: ${escapeHtml(sourceLabel)} · Scope: ${scope} · Saved ${escapeHtml(printedAt)}</div>
  ${title.trim() ? `<h2 style="font-size:14px;margin:12px 0 8px">${escapeHtml(title.trim())}</h2>` : ""}
  <div class="body">${escapeHtml(body)}</div>
  <p class="foot">User notes only. Premium lesson and question content from NurseNest is not included. Screenshots and sharing are not blocked by technology. Please respect your subscription terms.</p>
</body></html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  }

  function exportTxt() {
    const blob = new Blob(
      [
        `My study notes\nSource: ${sourceLabel}\nScope: ${scope}\n---\n${title ? `${title}\n\n` : ""}${body}\n`,
      ],
      { type: "text/plain;charset=utf-8" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `notes-${contextId.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-3">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-foreground"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        My notes
        <span className="text-xs font-normal text-muted">{open ? "Hide" : "Open"}</span>
      </button>
      {open ? (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-muted">
            Your notes save to your account. They are yours to copy, print, and export. Protected premium text stays in the
            app.
          </p>
          <input
            type="text"
            data-notes-editor
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="Optional title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            data-notes-editor
            className="min-h-[120px] w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed"
            placeholder="Write your own summary, mnemonics, or reminders…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold"
              onClick={() => printMyNotes()}
            >
              Print my notes
            </button>
            <button
              type="button"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold"
              onClick={() => exportTxt()}
            >
              Export .txt
            </button>
            {title.trim() || body.trim() ? (
              <button
                type="button"
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
                onClick={() => void clearSavedNote()}
              >
                Clear saved note
              </button>
            ) : null}
            {saving || loading ? <span className="text-xs text-muted">{loading ? "Loading…" : "Saving…"}</span> : null}
          </div>
          {flags.hideProtectedOnPrint ? (
            <p className="text-[11px] text-muted">Protected lesson and rationale text is hidden from browser print.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
