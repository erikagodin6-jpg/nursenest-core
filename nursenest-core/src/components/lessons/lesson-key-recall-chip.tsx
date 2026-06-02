"use client";

/**
 * LessonKeyRecallChip
 *
 * Renders a compact grid of blur-to-reveal fact chips.
 * Each chip shows a label and conceals the fact behind a soft blur.
 * Tapping/clicking reveals the fact with a smooth transition.
 *
 * Design surfaces:
 *   chip background  → --surface-emphasis  (brand-tinted callout surface)
 *   chip revealed    → same surface, no visual change (just the text becomes legible)
 *
 * Blur technique: CSS `filter: blur(5px)` → `blur(0)` with a short transition.
 * This is elegant, accessible (screenreaders still read the text), and cross-browser safe.
 *
 * Visibility: controlled by LessonRecallContext.
 */

import { useState } from "react";
import type { KeyRecallFact } from "@/lib/lessons/lesson-recall-types";
import { useLessonRecall } from "@/components/lessons/lesson-recall-context";

function FactChip({ fact }: { fact: KeyRecallFact }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setRevealed((r) => !r)}
      aria-pressed={revealed}
      aria-label={
        revealed
          ? `Hide: ${fact.label ?? "Key fact"}`
          : `Reveal: ${fact.label ?? "Key fact"}`
      }
      className="group w-full cursor-pointer overflow-hidden rounded-xl p-3.5 text-left transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={{
        background:
          "var(--surface-emphasis, color-mix(in srgb, var(--semantic-brand) 8%, var(--bg-card)))",
        border:
          "1px solid color-mix(in srgb, var(--palette-primary) 18%, var(--border-subtle, var(--palette-border)))",
      }}
    >
      {/* Label row */}
      <div className="mb-1.5 flex items-center justify-between gap-2">
        {fact.label ? (
          <span
            className="text-[10px] font-bold uppercase tracking-[0.1em] leading-none"
            style={{ color: "var(--palette-text-muted, var(--muted-foreground))" }}
          >
            {fact.label}
          </span>
        ) : (
          <span
            className="text-[10px] font-bold uppercase tracking-[0.1em] leading-none"
            style={{ color: "var(--palette-text-muted, var(--muted-foreground))" }}
          >
            Key fact
          </span>
        )}
        <span
          className="shrink-0 text-[10px] font-medium transition-opacity duration-150"
          style={{
            color: "var(--palette-primary)",
            opacity: revealed ? 0 : 0.75,
          }}
          aria-hidden="true"
        >
          {revealed ? "" : "tap to reveal"}
        </span>
      </div>

      {/* Fact text — blurred until revealed */}
      <p
        className="text-xs leading-snug sm:text-sm"
        style={{
          color: "var(--palette-text, var(--foreground))",
          filter: revealed ? "blur(0px)" : "blur(4.5px)",
          transition: "filter 0.22s ease",
          userSelect: revealed ? "text" : "none",
        }}
      >
        {fact.fact}
      </p>
    </button>
  );
}

export type LessonKeyRecallChipProps = {
  facts: KeyRecallFact[];
};

export function LessonKeyRecallChip({ facts }: LessonKeyRecallChipProps) {
  const { enabled } = useLessonRecall();

  if (!enabled || facts.length === 0) return null;

  return (
    <div className="mt-5" role="region" aria-label="Key recall facts">
      <p
        className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em] leading-none"
        style={{ color: "var(--palette-text-muted, var(--muted-foreground))" }}
        aria-hidden="true"
      >
        Key recall
      </p>
      <div
        className={
          facts.length === 1
            ? "grid grid-cols-1 gap-2"
            : facts.length === 2
            ? "grid grid-cols-2 gap-2"
            : "grid grid-cols-2 gap-2 sm:grid-cols-3"
        }
      >
        {facts.map((f) => (
          <FactChip key={f.id} fact={f} />
        ))}
      </div>
    </div>
  );
}
