"use client";

/**
 * LessonRecallBlock
 *
 * Renders a set of reveal-answer recall cards for a lesson section.
 * Each card shows a prompt and allows the learner to reveal the answer inline.
 *
 * Design surfaces:
 *   outer card (question)  → --surface-soft-a  (gentle primary brand tint)
 *   inner reveal panel     → --surface-soft-b  (gentle success/green tint)
 *
 * Visibility: controlled by LessonRecallContext (hidden when recall is toggled off).
 * Collapsed by default — answers revealed per-card on demand and can be re-hidden.
 */

import { useState } from "react";
import type { RecallPrompt } from "@/lib/lessons/lesson-recall-types";
import { useLessonRecall } from "@/components/lessons/lesson-recall-context";

const DEFAULT_HINT = "Think first, then reveal";

function RecallCard({ prompt }: { prompt: RecallPrompt }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className="overflow-hidden rounded-2xl transition-all duration-200"
      style={{
        background:
          "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 3.5%, var(--bg-page)))",
        border: "1px solid color-mix(in srgb, var(--border-subtle, var(--theme-border)) 70%, transparent)",
      }}
    >
      <div className="px-5 py-4 sm:px-6 sm:py-5">
        {/* Label */}
        <p
          className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em] leading-none"
          style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
          aria-hidden="true"
        >
          Active recall
        </p>

        {/* Prompt text */}
        <p
          className="text-sm leading-relaxed sm:text-[15px]"
          style={{ color: "var(--theme-text, var(--foreground))" }}
        >
          {prompt.prompt}
        </p>

        {/* Hint + reveal button (collapsed state) */}
        {!revealed ? (
          <div className="mt-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
            <span
              className="text-xs italic"
              style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
            >
              {prompt.hint ?? DEFAULT_HINT}
            </span>
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 hover:opacity-85 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{
                background: "var(--theme-primary)",
                color: "var(--theme-primary-foreground, #fff)",
              }}
              aria-expanded="false"
            >
              Reveal answer
              <span aria-hidden="true" className="opacity-75">▾</span>
            </button>
          </div>
        ) : null}

        {/* Answer panel (revealed state) */}
        {revealed ? (
          <div className="mt-4">
            <div
              className="overflow-hidden rounded-xl px-5 py-4"
              style={{
                background:
                  "var(--surface-soft-b, color-mix(in srgb, var(--semantic-success) 5%, var(--bg-card)))",
                border:
                  "1px solid color-mix(in srgb, var(--semantic-success, #22c55e) 18%, var(--border-subtle, var(--theme-border)))",
              }}
            >
              <p
                className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
                aria-hidden="true"
              >
                Answer
              </p>
              <p
                className="text-sm leading-relaxed sm:text-[15px]"
                style={{ color: "var(--theme-text, var(--foreground))" }}
              >
                {prompt.answer}
              </p>

              {prompt.explanation ? (
                <p
                  className="mt-2.5 text-xs leading-relaxed"
                  style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
                >
                  {prompt.explanation}
                </p>
              ) : null}
            </div>

            {/* Re-hide control */}
            <button
              type="button"
              onClick={() => setRevealed(false)}
              className="mt-3 text-xs underline-offset-2 hover:underline focus-visible:outline-none"
              style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
              aria-expanded="true"
            >
              Hide answer
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export type LessonRecallBlockProps = {
  prompts: RecallPrompt[];
};

export function LessonRecallBlock({ prompts }: LessonRecallBlockProps) {
  const { enabled } = useLessonRecall();

  if (!enabled || prompts.length === 0) return null;

  return (
    <div className="mt-6 space-y-3" role="region" aria-label="Active recall prompts">
      {prompts.map((p) => (
        <RecallCard key={p.id} prompt={p} />
      ))}
    </div>
  );
}
