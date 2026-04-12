"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";
import {
  MISTAKE_REASONS,
  MISTAKE_REASON_LABELS,
  MISTAKE_REASON_DESCRIPTIONS,
  MISTAKE_REASON_ROLE,
  type MistakeReason,
} from "@/lib/mistakes/mistake-types";

const ROLE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  info:        { bg: "color-mix(in srgb, var(--semantic-info) 10%, var(--bg-card))",        border: "color-mix(in srgb, var(--semantic-info) 28%, transparent)",        text: "var(--semantic-info)" },
  warning:     { bg: "color-mix(in srgb, var(--semantic-warning) 10%, var(--bg-card))",     border: "color-mix(in srgb, var(--semantic-warning) 28%, transparent)",     text: "color-mix(in srgb, var(--semantic-warning) 80%, var(--semantic-text-primary))" },
  concept:     { bg: "color-mix(in srgb, var(--semantic-violet, #7c3aed) 10%, var(--bg-card))", border: "color-mix(in srgb, var(--semantic-violet, #7c3aed) 28%, transparent)", text: "var(--semantic-violet, #7c3aed)" },
  action:      { bg: "color-mix(in srgb, var(--semantic-teal, #0d9488) 10%, var(--bg-card))",   border: "color-mix(in srgb, var(--semantic-teal, #0d9488) 28%, transparent)",   text: "var(--semantic-teal, #0d9488)" },
  diagnostic:  { bg: "color-mix(in srgb, var(--semantic-cyan, #0891b2) 10%, var(--bg-card))",   border: "color-mix(in srgb, var(--semantic-cyan, #0891b2) 28%, transparent)",   text: "var(--semantic-cyan, #0891b2)" },
  application: { bg: "color-mix(in srgb, var(--semantic-chart-5, #6366f1) 10%, var(--bg-card))", border: "color-mix(in srgb, var(--semantic-chart-5, #6366f1) 28%, transparent)", text: "var(--semantic-chart-5, #6366f1)" },
};

function getRoleColor(role: string) {
  return ROLE_COLORS[role] ?? ROLE_COLORS["info"];
}

type Props = {
  questionId: string;
  initialReason: MistakeReason | null;
  initialNote: string;
  topic?: string | null;
  onSaved?: (reason: MistakeReason | null, note: string) => void;
  compact?: boolean;
};

/**
 * Inline mistake reason picker + note textarea.
 * Saves via POST /api/learner/mistakes.
 */
export function MistakeTagPicker({ questionId, initialReason, initialNote, topic, onSaved, compact = false }: Props) {
  const [reason, setReason] = useState<MistakeReason | null>(initialReason);
  const [note, setNote] = useState(initialNote);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSelectReason(r: MistakeReason) {
    setReason((prev) => (prev === r ? null : r));
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      setError(null);
      try {
        const res = await fetch("/api/learner/mistakes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId, reason, note, topic }),
        });
        if (!res.ok) throw new Error("save failed");
        setSaved(true);
        onSaved?.(reason, note);
      } catch {
        setError("Failed to save. Please try again.");
      }
    });
  }

  function handleClearTag() {
    setReason(null);
    setNote("");
    setSaved(false);
    startTransition(async () => {
      await fetch("/api/learner/mistakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, reason: null, note: "", topic }),
      });
      onSaved?.(null, "");
    });
  }

  return (
    <div className="space-y-3">
      {/* Reason chips */}
      <div>
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Why did you miss this?
        </p>
        <div className="flex flex-wrap gap-2">
          {MISTAKE_REASONS.map((r) => {
            const role = MISTAKE_REASON_ROLE[r];
            const colors = getRoleColor(role);
            const isSelected = reason === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleSelectReason(r)}
                title={MISTAKE_REASON_DESCRIPTIONS[r]}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
                style={{
                  background: isSelected ? colors.bg : "var(--semantic-surface)",
                  border: `1.5px solid ${isSelected ? colors.border : "var(--semantic-border-soft)"}`,
                  color: isSelected ? colors.text : "var(--semantic-text-secondary)",
                  boxShadow: isSelected ? `0 0 0 1px ${colors.border}` : "none",
                }}
                aria-pressed={isSelected}
              >
                {isSelected && <Check className="h-3 w-3 flex-shrink-0" aria-hidden="true" />}
                {MISTAKE_REASON_LABELS[r]}
              </button>
            );
          })}
        </div>
        {reason ? (
          <p className="mt-1.5 text-xs italic" style={{ color: "var(--semantic-text-muted)" }}>
            {MISTAKE_REASON_DESCRIPTIONS[reason]}
          </p>
        ) : null}
      </div>

      {/* Note textarea */}
      {!compact && (
        <div>
          <label
            htmlFor={`mistake-note-${questionId}`}
            className="mb-1 block text-xs font-medium"
            style={{ color: "var(--semantic-text-secondary)" }}
          >
            Personal note (optional)
          </label>
          <textarea
            id={`mistake-note-${questionId}`}
            value={note}
            onChange={(e) => { setNote(e.target.value); setSaved(false); }}
            placeholder="What tripped you up? What will you remember next time?"
            rows={2}
            maxLength={2000}
            className="w-full resize-none rounded-xl border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1"
            style={{
              background: "var(--semantic-surface)",
              borderColor: "var(--semantic-border-soft)",
              color: "var(--semantic-text-primary)",
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || (reason === initialReason && note === initialNote)}
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-opacity disabled:opacity-40"
          style={{ background: "var(--semantic-brand)", color: "#fff" }}
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" /> : null}
          Save tag
        </button>
        {(reason !== null || note.trim() !== "") && !isPending && (
          <button
            type="button"
            onClick={handleClearTag}
            className="inline-flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-70"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            <X className="h-3 w-3" aria-hidden="true" />
            Clear
          </button>
        )}
        {saved && (
          <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--semantic-success)" }}>
            <Check className="h-3 w-3" aria-hidden="true" />
            Saved
          </span>
        )}
        {error && (
          <span className="text-xs" style={{ color: "var(--semantic-danger)" }}>
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
