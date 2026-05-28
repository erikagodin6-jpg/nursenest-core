"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, CheckCircle2 } from "lucide-react";
import { sequencingLabelsForSkill } from "@/lib/clinical-skills/clinical-skills-enrichment";
import type { ClinicalSkillDefinition } from "@/lib/clinical-skills/clinical-skills-catalog";
import { cn } from "@/lib/utils";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function ClinicalSkillsSequencingChallenge({
  skill,
  passed,
  onPassed,
}: {
  skill: ClinicalSkillDefinition;
  passed: boolean;
  onPassed: () => void;
}) {
  const correct = useMemo(() => sequencingLabelsForSkill(skill), [skill]);
  const [order, setOrder] = useState(() => shuffle(correct));
  const [checked, setChecked] = useState(false);
  const isCorrect = checked && order.every((label, i) => label === correct[i]);

  const move = (from: number, dir: -1 | 1) => {
    const to = from + dir;
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    [next[from], next[to]] = [next[to]!, next[from]!];
    setOrder(next);
    setChecked(false);
  };

  const check = () => {
    setChecked(true);
    if (order.every((label, i) => label === correct[i])) onPassed();
  };

  const reset = () => {
    setOrder(shuffle(correct));
    setChecked(false);
  };

  return (
    <div className="nn-clinical-skills-sequencing">
      <p className="text-sm text-[var(--semantic-text-secondary)]">
        Drag-free sequencing: use arrows to order steps correctly, then check your procedural memory.
      </p>
      <ol className="mt-4 space-y-2">
        {order.map((label, i) => (
          <li
            key={`${label}-${i}`}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm",
              checked && label === correct[i]
                ? "border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))]"
                : checked
                  ? "border-[color-mix(in_srgb,var(--semantic-danger)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_6%,var(--semantic-surface))]"
                  : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]",
            )}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-4)_12%,var(--semantic-surface))] text-xs font-bold text-[var(--semantic-text-primary)]">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 font-medium text-[var(--semantic-text-primary)]">{label}</span>
            <div className="flex shrink-0 gap-1">
              <button type="button" className="nn-clinical-skills-sequencing__arrow" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button type="button" className="nn-clinical-skills-sequencing__arrow" onClick={() => move(i, 1)} disabled={i === order.length - 1} aria-label="Move down">
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="nn-clinical-skills-sequencing__primary" onClick={check}>
          Check sequence
        </button>
        <button type="button" className="nn-clinical-skills-sequencing__ghost" onClick={reset}>
          Reshuffle
        </button>
        {passed || isCorrect ? (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--semantic-success)]">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Sequence mastered
          </span>
        ) : checked ? (
          <span className="text-sm text-[var(--semantic-danger)]">Not quite — adjust and try again.</span>
        ) : null}
      </div>
    </div>
  );
}
