"use client";

/**
 * ReviewQueueRow
 *
 * A single question row inside a DueReviewSection.
 * Shows topic, stem preview, last result, confidence, due timing, and a CTA.
 *
 * On "Review" click: toggles an inline rationale panel (consistent with
 * SmartReviewLayout's ReviewQuestionRow pattern).
 *
 * Design:
 *   - Row background: slightly elevated card surface, not flat white
 *   - Mode badge: semantic-color tinted pill
 *   - Urgency indicator: thin left border colored by priority
 *   - Inline rationale panel: --surface-soft-b
 */

import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import type { ScoredReviewItem, ReviewPriority } from "@/lib/study/srs-scheduler";

// ── Priority border color ─────────────────────────────────────────────────────

function priorityBorderColor(priority: ReviewPriority): string {
  switch (priority) {
    case "due_now":     return "var(--semantic-warning, #f59e0b)";
    case "review_soon": return "var(--semantic-info, #38bdf8)";
    case "stable":      return "var(--semantic-success, #22c55e)";
  }
}

// ── Mode badge ────────────────────────────────────────────────────────────────

function ModeBadge({ label }: { label: ScoredReviewItem["modeLabel"] }) {
  const colorMap: Record<typeof label, string> = {
    Overconfidence: "var(--semantic-danger, #ef4444)",
    "Needs Review": "var(--semantic-warning, #f59e0b)",
    Uncertain:      "var(--semantic-chart-3, #a78bfa)",
    Stable:         "var(--semantic-success, #22c55e)",
  };
  const color = colorMap[label];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]"
      style={{
        background: `color-mix(in srgb, ${color} 12%, var(--bg-card, var(--theme-card-bg)))`,
        border: `1px solid color-mix(in srgb, ${color} 30%, var(--border-subtle, var(--theme-border)))`,
        color,
      }}
    >
      {label}
    </span>
  );
}

// ── Due label chip ────────────────────────────────────────────────────────────

function DueChip({
  label,
  priority,
}: {
  label: string;
  priority: ReviewPriority;
}) {
  const color = priorityBorderColor(priority);
  return (
    <span
      className="whitespace-nowrap text-[11px] font-medium"
      style={{ color }}
    >
      {label}
    </span>
  );
}

// ── Attempt count pill ────────────────────────────────────────────────────────

function AttemptPill({
  total,
  incorrect,
}: {
  total: number;
  incorrect: number;
}) {
  if (total <= 1) return null;
  return (
    <span
      className="text-[11px]"
      style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
    >
      {total} attempt{total !== 1 ? "s" : ""}
      {incorrect > 0 ? `, ${incorrect} miss${incorrect !== 1 ? "es" : ""}` : ""}
    </span>
  );
}

// ── ReviewQueueRow ────────────────────────────────────────────────────────────

export function ReviewQueueRow({ item }: { item: ScoredReviewItem }) {
  const [expanded, setExpanded] = useState(false);
  const borderColor = priorityBorderColor(item.priority);

  const stemText = item.stem ?? "Question stem not available";
  const hasStem = Boolean(item.stem);

  return (
    <li
      className="overflow-hidden rounded-xl transition-shadow"
      style={{
        background: "var(--bg-card, var(--theme-card-bg))",
        border: "1px solid var(--border-subtle, var(--theme-border))",
        borderLeft: `3px solid ${borderColor}`,
      }}
    >
      {/* ── Main row ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-start sm:gap-4">
        {/* Left: stem + topic */}
        <div className="min-w-0 flex-1">
          {item.topic ? (
            <p
              className="mb-1 text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
            >
              {item.topic}
            </p>
          ) : null}
          <p
            className="line-clamp-2 text-sm leading-snug"
            style={{
              color: hasStem
                ? "var(--theme-text, var(--foreground))"
                : "var(--theme-muted-text, var(--muted-foreground))",
              fontStyle: hasStem ? "normal" : "italic",
            }}
            title={item.stem ?? undefined}
          >
            {stemText}
          </p>
          {/* Subrow: mode badge + due label + attempts */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <ModeBadge label={item.modeLabel} />
            <DueChip label={item.dueLabel} priority={item.priority} />
            <AttemptPill
              total={item.totalAttempts}
              incorrect={item.incorrectAttempts}
            />
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex shrink-0 items-center gap-2 sm:mt-0.5">
          {item.rationale ? (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              aria-expanded={expanded}
              aria-controls={`review-rationale-${item.questionId}`}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 hover:opacity-85 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2"
              style={{
                background: expanded
                  ? "var(--theme-primary)"
                  : "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 3.5%, var(--bg-page)))",
                border: "1px solid color-mix(in srgb, var(--theme-primary) 30%, var(--border-subtle, var(--theme-border)))",
                color: expanded
                  ? "var(--theme-primary-foreground, #fff)"
                  : "var(--theme-primary)",
              }}
            >
              {expanded ? "Close" : "Review"}
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
          ) : (
            <span
              className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs"
              style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
            >
              No rationale
            </span>
          )}
        </div>
      </div>

      {/* ── Inline rationale panel ─────────────────────────────────────────── */}
      {expanded && item.rationale ? (
        <div
          id={`review-rationale-${item.questionId}`}
          className="border-t px-4 py-4"
          style={{
            background:
              "var(--surface-soft-b, color-mix(in srgb, var(--semantic-success) 5%, var(--bg-card)))",
            borderColor:
              "color-mix(in srgb, var(--border-subtle, var(--theme-border)) 60%, transparent)",
          }}
          role="region"
          aria-label="Question explanation"
        >
          {/* Full stem */}
          {item.stem ? (
            <p
              className="mb-3 text-sm font-medium leading-snug"
              style={{ color: "var(--theme-text, var(--foreground))" }}
            >
              {item.stem}
            </p>
          ) : null}

          {/* Rationale label */}
          <p
            className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.1em]"
            style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
          >
            {item.lastAttempt.isCorrect ? "Why this is correct" : "Explanation"}
          </p>

          {/* Rationale body */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--theme-text, var(--foreground))" }}
          >
            {item.rationale}
          </p>

          {/* Attempt history note */}
          {item.totalAttempts > 1 ? (
            <p
              className="mt-3 text-xs"
              style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
            >
              You've seen this question {item.totalAttempts} time
              {item.totalAttempts !== 1 ? "s" : ""} — got it right{" "}
              {item.correctAttempts} time{item.correctAttempts !== 1 ? "s" : ""}.
            </p>
          ) : null}

          {/* Link to lessons (placeholder — extend when lesson-question cross-linking is available) */}
          {item.topic ? (
            <div className="mt-3">
              <a
                href={`/app/lessons?topic=${encodeURIComponent(item.topic)}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline focus-visible:outline-none"
                style={{ color: "var(--theme-primary)" }}
              >
                <BookOpen className="h-3 w-3" aria-hidden />
                Find lessons on {item.topic}
              </a>
            </div>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
