"use client";

/**
 * LessonRecallToggle
 *
 * A small, unobtrusive pill button that lets the learner toggle active recall blocks on/off.
 * Reads and writes via LessonRecallContext.
 *
 * Placement: top-right corner of the lesson article, before the first section card.
 * Design intent: visually quiet — noticed when wanted, ignorable otherwise.
 */

import { useLessonRecall } from "@/components/lessons/lesson-recall-context";

export function LessonRecallToggle() {
  const { enabled, toggle } = useLessonRecall();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Hide active recall blocks" : "Show active recall blocks"}
      className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={{
        background: enabled
          ? "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 3.5%, var(--bg-page)))"
          : "var(--bg-card, var(--theme-card-bg))",
        border: "1px solid var(--border-subtle, var(--theme-border))",
        color: enabled
          ? "var(--theme-primary)"
          : "var(--theme-muted-text, var(--muted-foreground))",
      }}
    >
      {/* Indicator dot */}
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full transition-all duration-200"
        style={{
          background: enabled
            ? "var(--theme-primary)"
            : "var(--theme-muted-text, var(--muted-foreground))",
          opacity: enabled ? 1 : 0.45,
        }}
      />
      <span className="uppercase tracking-[0.08em]">
        {enabled ? "Recall on" : "Recall off"}
      </span>
    </button>
  );
}
