"use client";

import { useMemo, useState } from "react";
import { BookmarkPlus, CheckCircle2 } from "lucide-react";
import type { NotebookCategory, NotebookSourceType } from "@/lib/learner/personal-study-notebook";

export type SaveToNotebookButtonProps = {
  category: NotebookCategory;
  sourceType: NotebookSourceType;
  sourceId: string;
  title: string;
  content: string;
  sourceHref?: string;
  pathwayId?: string | null;
  system?: string | null;
  topic?: string | null;
  tags?: string[];
  favorite?: boolean;
  label?: string;
  compact?: boolean;
};

export function SaveToNotebookButton({
  category,
  sourceType,
  sourceId,
  title,
  content,
  sourceHref,
  pathwayId,
  system,
  topic,
  tags,
  favorite = false,
  label = "Save to Notebook",
  compact = false,
}: SaveToNotebookButtonProps) {
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = useMemo(() => pending || !content.trim() || !sourceId.trim(), [content, pending, sourceId]);

  async function handleSave() {
    if (disabled) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/learner/notebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          sourceType,
          sourceId,
          title,
          content,
          sourceHref,
          pathwayId: pathwayId ?? undefined,
          system: system ?? undefined,
          topic: topic ?? undefined,
          tags,
          favorite,
        }),
      });
      if (!res.ok) throw new Error("save failed");
      setSaved(true);
    } catch {
      setError("Couldn't save. Please try again.");
      setSaved(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={disabled}
        onClick={handleSave}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${
          compact ? "min-h-8 px-3 py-1 text-[11px]" : "min-h-10 px-4 py-2 text-xs"
        }`}
        style={{
          background: saved
            ? "color-mix(in srgb, var(--semantic-success) 14%, var(--semantic-surface))"
            : "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
          border: saved
            ? "1px solid color-mix(in srgb, var(--semantic-success) 24%, var(--semantic-border-soft))"
            : "1px solid color-mix(in srgb, var(--semantic-brand) 24%, var(--semantic-border-soft))",
          color: saved ? "var(--semantic-success)" : "var(--semantic-brand)",
          boxShadow: "var(--semantic-shadow-soft)",
        }}
        data-nn-save-to-notebook=""
      >
        {saved ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : <BookmarkPlus className="h-4 w-4" aria-hidden />}
        {pending ? "Saving..." : saved ? "Saved" : label}
      </button>
      {error ? (
        <span className="text-[10px] font-medium" style={{ color: "var(--semantic-danger)" }}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
