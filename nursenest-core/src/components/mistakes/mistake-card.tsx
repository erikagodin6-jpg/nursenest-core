"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, Repeat, Target } from "lucide-react";
import Link from "next/link";
import { MistakeTagPicker } from "./mistake-tag-picker";
import {
  MISTAKE_REASON_LABELS,
  MISTAKE_REASON_ROLE,
  type MistakeEntry,
  type MistakeReason,
} from "@/lib/mistakes/mistake-types";

const ROLE_DOT_COLOR: Record<string, string> = {
  info:        "var(--semantic-info)",
  warning:     "color-mix(in srgb, var(--semantic-warning) 85%, var(--semantic-text-primary))",
  concept:     "var(--semantic-violet, #7c3aed)",
  action:      "var(--semantic-teal, #0d9488)",
  diagnostic:  "var(--semantic-cyan, #0891b2)",
  application: "var(--semantic-chart-5, #6366f1)",
};

function getRoleColor(role: string) {
  return ROLE_DOT_COLOR[role] ?? ROLE_DOT_COLOR["info"];
}

function ReasonBadge({ reason }: { reason: MistakeReason }) {
  const role = MISTAKE_REASON_ROLE[reason];
  const color = getRoleColor(role);
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{
        background: `color-mix(in srgb, ${color} 12%, var(--bg-card))`,
        color,
        border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
      }}
    >
      {MISTAKE_REASON_LABELS[reason]}
    </span>
  );
}

function MissCountBadge({ count }: { count: number }) {
  const isRecurring = count >= 3;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
      style={{
        background: isRecurring
          ? "color-mix(in srgb, var(--semantic-danger) 10%, var(--bg-card))"
          : "var(--semantic-surface)",
        color: isRecurring ? "var(--semantic-danger)" : "var(--semantic-text-muted)",
        border: isRecurring
          ? "1px solid color-mix(in srgb, var(--semantic-danger) 22%, transparent)"
          : "1px solid var(--semantic-border-soft)",
      }}
      title={`Missed ${count} time${count !== 1 ? "s" : ""}`}
    >
      <Repeat className="h-2.5 w-2.5" aria-hidden="true" />
      ×{count}
    </span>
  );
}

type Props = {
  entry: MistakeEntry;
  drillHref?: string | null;
  onTagSaved?: (questionId: string, reason: MistakeReason | null, note: string) => void;
};

/**
 * Premium mistake entry card.
 * Shows stem preview, badges, expandable rationale, and inline tag picker.
 */
export function MistakeCard({ entry, drillHref, onTagSaved }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showTagger, setShowTagger] = useState(false);
  const [localReason, setLocalReason] = useState<MistakeReason | null>(entry.reason);
  const [localNote, setLocalNote] = useState(entry.note);
  const [localTagged, setLocalTagged] = useState(entry.tagged);

  function handleTagSaved(reason: MistakeReason | null, note: string) {
    setLocalReason(reason);
    setLocalNote(note);
    setLocalTagged(reason !== null || note.trim() !== "");
    setShowTagger(false);
    onTagSaved?.(entry.questionId, reason, note);
  }

  const options = Array.isArray(entry.options) ? (entry.options as string[]) : [];
  const correct = typeof entry.correctAnswer === "number" ? entry.correctAnswer : null;

  return (
    <article
      className="nn-mistake-card"
      aria-label={`Missed question: ${entry.stemPreview.slice(0, 60)}`}
    >
      {/* Card header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Recurring / frequency badge */}
          <MissCountBadge count={entry.missCount} />

          {/* Topic badge */}
          {entry.topic && (
            <span
              className="rounded-md px-2 py-0.5 text-xs font-medium"
              style={{
                background: "color-mix(in srgb, var(--semantic-brand) 8%, var(--bg-card))",
                color: "var(--semantic-brand)",
                border: "1px solid color-mix(in srgb, var(--semantic-brand) 18%, transparent)",
              }}
            >
              {entry.topic}
            </span>
          )}

          {/* Body system */}
          {entry.bodySystem && (
            <span
              className="rounded-md px-2 py-0.5 text-xs font-medium capitalize"
              style={{
                background: "var(--semantic-surface)",
                color: "var(--semantic-text-muted)",
                border: "1px solid var(--semantic-border-soft)",
              }}
            >
              {(entry.bodySystem as string).replace(/_/g, " ")}
            </span>
          )}

          {/* Question type */}
          {entry.questionType && entry.questionType.toLowerCase().includes("sata") && (
            <span
              className="rounded-md px-2 py-0.5 text-xs font-semibold"
              style={{
                background: "color-mix(in srgb, var(--semantic-cyan, #0891b2) 10%, var(--bg-card))",
                color: "var(--semantic-cyan, #0891b2)",
                border: "1px solid color-mix(in srgb, var(--semantic-cyan, #0891b2) 22%, transparent)",
              }}
            >
              SATA
            </span>
          )}

          {/* Reason tag */}
          {localReason && <ReasonBadge reason={localReason} />}
        </div>

        {/* Recency */}
        <span className="text-xs" style={{ color: "var(--semantic-text-muted)" }}>
          {formatRelativeDate(entry.lastMissedAt)}
        </span>
      </div>

      {/* Question stem */}
      <p
        className="mt-3 text-sm leading-relaxed"
        style={{ color: "var(--semantic-text-primary)" }}
      >
        {entry.stemPreview}
        {entry.stemPreview.length >= 298 ? "…" : ""}
      </p>

      {/* User note preview */}
      {localNote && !showTagger && (
        <p
          className="mt-2 rounded-lg px-3 py-2 text-xs italic"
          style={{
            background: "var(--semantic-surface)",
            color: "var(--semantic-text-secondary)",
            border: "1px solid var(--semantic-border-soft)",
          }}
        >
          {localNote}
        </p>
      )}

      {/* Inline tag picker */}
      {showTagger && (
        <div
          className="mt-3 rounded-xl p-4"
          style={{
            background: "var(--semantic-surface)",
            border: "1px solid var(--semantic-border-soft)",
          }}
        >
          <MistakeTagPicker
            questionId={entry.questionId}
            initialReason={localReason}
            initialNote={localNote}
            topic={entry.topic}
            onSaved={handleTagSaved}
          />
        </div>
      )}

      {/* Expanded rationale + options */}
      {expanded && (
        <div
          className="mt-3 space-y-3 rounded-xl p-4"
          style={{
            background: "var(--semantic-surface)",
            border: "1px solid var(--semantic-border-soft)",
          }}
        >
          {options.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--semantic-text-muted)" }}>
                Answer choices
              </p>
              <ol className="space-y-1.5">
                {options.map((opt, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-lg px-3 py-2 text-sm"
                    style={{
                      background: i === correct
                        ? "color-mix(in srgb, var(--semantic-success) 10%, var(--bg-card))"
                        : "transparent",
                      border: i === correct
                        ? "1px solid color-mix(in srgb, var(--semantic-success) 25%, transparent)"
                        : "1px solid transparent",
                      color: i === correct ? "var(--semantic-success)" : "var(--semantic-text-primary)",
                      fontWeight: i === correct ? 600 : 400,
                    }}
                  >
                    <span className="flex-shrink-0 font-bold" style={{ minWidth: "1.1rem" }}>
                      {String.fromCharCode(65 + i)}.
                    </span>
                    <span>{typeof opt === "string" ? opt : JSON.stringify(opt)}</span>
                    {i === correct && (
                      <span className="ml-auto flex-shrink-0 text-xs font-bold" style={{ color: "var(--semantic-success)" }}>
                        ✓ Correct
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {entry.rationale && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--semantic-text-muted)" }}>
                Rationale
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
                {entry.rationale}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action row */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:opacity-80"
          style={{
            background: "var(--semantic-surface)",
            color: "var(--semantic-text-secondary)",
            border: "1px solid var(--semantic-border-soft)",
          }}
        >
          {expanded ? <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" /> : <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />}
          {expanded ? "Hide" : "Review answer"}
        </button>

        <button
          type="button"
          onClick={() => setShowTagger((v) => !v)}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:opacity-80"
          style={{
            background: localTagged
              ? "color-mix(in srgb, var(--semantic-brand) 8%, var(--bg-card))"
              : "var(--semantic-surface)",
            color: localTagged ? "var(--semantic-brand)" : "var(--semantic-text-secondary)",
            border: localTagged
              ? "1px solid color-mix(in srgb, var(--semantic-brand) 20%, transparent)"
              : "1px solid var(--semantic-border-soft)",
          }}
        >
          <Target className="h-3.5 w-3.5" aria-hidden="true" />
          {localTagged ? "Edit tag" : "Tag this mistake"}
        </button>

        {drillHref && (
          <Link
            href={drillHref}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
            style={{
              background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--bg-card))",
              color: "var(--semantic-brand)",
              border: "1px solid color-mix(in srgb, var(--semantic-brand) 22%, transparent)",
            }}
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            Study topic
          </Link>
        )}
      </div>
    </article>
  );
}

function formatRelativeDate(iso: string): string {
  try {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86_400_000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  } catch {
    return "";
  }
}
