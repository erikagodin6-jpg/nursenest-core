"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ClinicalSkillErrorScenario } from "@/lib/clinical-skills/clinical-skills-enrichment";
import { cn } from "@/lib/utils";

export function ClinicalSkillsErrorSpotting({
  scenario,
  passed,
  onPassed,
}: {
  scenario: ClinicalSkillErrorScenario;
  passed: boolean;
  onPassed: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const revealed = selected !== null;

  const choose = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    if (idx === scenario.correctIndex) onPassed();
  };

  return (
    <div className="nn-clinical-skills-error-spot">
      <p className="flex items-start gap-2 text-sm font-medium text-[var(--semantic-text-primary)]">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-warning)]" aria-hidden />
        {scenario.stem}
      </p>
      <ul className="mt-4 space-y-2">
        {scenario.options.map((opt, i) => {
          const isSel = selected === i;
          const correct = i === scenario.correctIndex;
          return (
            <li key={opt}>
              <button
                type="button"
                disabled={revealed}
                onClick={() => choose(i)}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                  !revealed && "hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))]",
                  revealed && correct && "border-[color-mix(in_srgb,var(--semantic-success)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))]",
                  revealed && isSel && !correct && "border-[color-mix(in_srgb,var(--semantic-danger)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))]",
                  !revealed && "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]",
                )}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      {revealed ? (
        <p className="mt-4 rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_30%,var(--semantic-surface))] px-3 py-2 text-sm text-[var(--semantic-text-secondary)]">
          <span className="font-semibold text-[var(--semantic-text-primary)]">Rationale:</span> {scenario.rationale}
        </p>
      ) : null}
      {passed ? (
        <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--semantic-success)]">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Safety judgment reinforced
        </p>
      ) : null}
    </div>
  );
}
