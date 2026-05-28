"use client";

import { useState } from "react";
import type { ClinicalSkillRetentionItem } from "@/lib/clinical-skills/clinical-skills-enrichment";
import { cn } from "@/lib/utils";

export function ClinicalSkillsRetentionQuickSet({
  items,
  onFinished,
}: {
  items: ClinicalSkillRetentionItem[];
  onFinished?: (score: number, total: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  if (!items.length) return null;

  const allAnswered = items.every((q) => typeof answers[q.id] === "number");

  const submitAll = () => {
    const score = items.reduce((acc, q) => (answers[q.id] === q.correct ? acc + 1 : acc), 0);
    const next: Record<string, boolean> = {};
    for (const q of items) next[q.id] = true;
    setRevealed(next);
    onFinished?.(score, items.length);
  };

  return (
    <div className="space-y-4">
      {items.map((q) => {
        const picked = answers[q.id];
        const show = revealed[q.id];
        return (
          <fieldset key={q.id} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <legend className="px-1 text-sm font-semibold text-[var(--semantic-text-primary)]">{q.question}</legend>
            <ul className="mt-3 space-y-2">
              {q.options.map((opt, i) => (
                <li key={opt}>
                  <button
                    type="button"
                    disabled={show}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2 text-left text-sm",
                      picked === i && !show && "border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))]",
                      show && i === q.correct && "border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))]",
                      show && picked === i && i !== q.correct && "border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))]",
                      !show && picked !== i && "border-[var(--semantic-border-soft)]",
                    )}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
            {show ? (
              <p className="mt-3 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                <span className="font-semibold text-[var(--semantic-text-primary)]">Rationale:</span> {q.rationale}
              </p>
            ) : null}
          </fieldset>
        );
      })}
      <button
        type="button"
        className="nn-clinical-skills-sequencing__primary"
        disabled={!allAnswered || Object.keys(revealed).length > 0}
        onClick={submitAll}
      >
        Reveal retention feedback
      </button>
    </div>
  );
}
