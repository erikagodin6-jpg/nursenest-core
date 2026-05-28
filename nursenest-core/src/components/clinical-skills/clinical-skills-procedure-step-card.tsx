"use client";

import { ChevronDown, ShieldAlert, Stethoscope, UserRound } from "lucide-react";
import type { EnrichedClinicalSkillStep } from "@/lib/clinical-skills/clinical-skills-enrichment";
import { cn } from "@/lib/utils";

export function ClinicalSkillsProcedureStepCard({
  step,
  index,
  completed,
  active,
  onToggleComplete,
  id,
}: {
  step: EnrichedClinicalSkillStep;
  index: number;
  completed: boolean;
  active: boolean;
  onToggleComplete: () => void;
  id: string;
}) {
  return (
    <article
      id={id}
      className={cn(
        "nn-clinical-skills-procedure-step scroll-mt-28 transition-shadow",
        active && "nn-clinical-skills-procedure-step--active",
        completed && "nn-clinical-skills-procedure-step--done",
      )}
    >
      <div className="nn-clinical-skills-procedure-step__head">
        <span className="nn-clinical-skills-procedure-step__num" aria-hidden>
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">{step.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{step.detail}</p>
        </div>
        <button
          type="button"
          onClick={onToggleComplete}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
            completed
              ? "border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--semantic-success)]"
              : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-primary)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))]",
          )}
          aria-pressed={completed}
        >
          {completed ? "Reviewed" : "Mark reviewed"}
        </button>
      </div>

      <details className="nn-clinical-skills-procedure-step__details group mt-3">
        <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-brand)_90%,var(--semantic-text-primary))]">
          <ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden />
          Clinical depth and recall
        </summary>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {step.rationale ? (
            <div className="nn-clinical-skills-procedure-step__callout nn-clinical-skills-procedure-step__callout--info">
              <Stethoscope className="h-4 w-4 shrink-0" aria-hidden />
              <div>
                <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">Clinical rationale</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{step.rationale}</p>
              </div>
            </div>
          ) : null}
          {step.safetyWarning ? (
            <div className="nn-clinical-skills-procedure-step__callout nn-clinical-skills-procedure-step__callout--warning">
              <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden />
              <div>
                <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">Safety checkpoint</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{step.safetyWarning}</p>
              </div>
            </div>
          ) : null}
          {step.bedsideTip ? (
            <div className="nn-clinical-skills-procedure-step__callout">
              <UserRound className="h-4 w-4 shrink-0 text-[var(--semantic-info)]" aria-hidden />
              <div>
                <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">Bedside communication</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{step.bedsideTip}</p>
              </div>
            </div>
          ) : null}
          {step.commonError ? (
            <div className="nn-clinical-skills-procedure-step__callout nn-clinical-skills-procedure-step__callout--danger">
              <p className="text-xs font-semibold text-[var(--semantic-danger)]">High-risk mistake</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{step.commonError}</p>
            </div>
          ) : null}
        </div>
        {step.recallPrompt ? (
          <p className="mt-3 rounded-lg border border-dashed border-[color-mix(in_srgb,var(--semantic-brand)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))] px-3 py-2 text-xs text-[var(--semantic-text-secondary)]">
            <span className="font-semibold text-[var(--semantic-text-primary)]">Active recall:</span> {step.recallPrompt}
          </p>
        ) : null}
      </details>
    </article>
  );
}
