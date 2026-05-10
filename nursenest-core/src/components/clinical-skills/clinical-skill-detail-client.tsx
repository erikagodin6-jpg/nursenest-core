"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import type { ClinicalSkillDefinition } from "@/lib/clinical-skills/clinical-skills-catalog";
import { useClinicalSkillsProgress } from "@/lib/clinical-skills/clinical-skills-progress.client";
import { cn } from "@/lib/utils";

export function ClinicalSkillDetailClient({
  skill,
  pathwayId,
  userId,
}: {
  skill: ClinicalSkillDefinition;
  pathwayId: string | null;
  userId: string | null;
}) {
  const qp = pathwayId?.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : "";
  const hubHref = `/app/clinical-skills${qp}`;
  const { state, markViewed, markCompleted } = useClinicalSkillsProgress(userId);

  useEffect(() => {
    markViewed(skill.slug);
  }, [markViewed, skill.slug]);

  const done = state.completedSlugs.includes(skill.slug);

  return (
    <article className="min-w-0 space-y-8" data-nn-clinical-skill-detail="">
      <Link
        href={hubHref}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color-mix(in_srgb,var(--semantic-brand)_88%,var(--semantic-text-primary))] hover:underline"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Back to clinical skills
      </Link>

      <header className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--semantic-info)]">Clinical competency</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-[var(--semantic-text-primary)] sm:text-[2rem]">{skill.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{skill.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[var(--semantic-text-muted)]">
          <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1 font-semibold text-[var(--semantic-text-primary)]">
            ~{skill.estimatedMinutes} min walkthrough
          </span>
          <span>{done ? "Marked complete on this device" : "Mark complete when your lab/sim policy aligns"}</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={done}
            onClick={() => markCompleted(skill.slug)}
            className={cn(
              "inline-flex min-h-10 items-center justify-center rounded-full px-5 text-sm font-semibold shadow-[var(--semantic-shadow-soft)] transition-colors disabled:cursor-default disabled:opacity-70",
              done
                ? "border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-[var(--semantic-success)]"
                : "bg-[var(--role-cta)] text-[var(--role-cta-foreground)] shadow-[0_2px_10px_var(--role-cta-shadow)]",
            )}
          >
            {done ? "Completed" : "Mark competency complete"}
          </button>
        </div>
      </header>

      <section aria-labelledby="clinical-skill-steps-heading" className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
        <h2 id="clinical-skill-steps-heading" className="text-lg font-semibold text-[var(--semantic-text-primary)]">
          Step-by-step guidance
        </h2>
        <ol className="mt-5 space-y-4">
          {skill.steps.map((step, idx) => (
            <li
              key={`${skill.slug}-step-${idx}`}
              className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-4)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_05%,var(--semantic-surface))] p-4"
            >
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-4)_30%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] text-xs font-bold text-[color-mix(in_srgb,var(--semantic-chart-4)_90%,var(--semantic-text-primary))]">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{step.detail}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_06%,var(--semantic-surface))] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">Adaptive remediation</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          When practice analytics flag related weakness signals (for example wound care, injections, or airway skills), your dashboard can surface this workstation alongside labs and scenarios — keeping bedside practice inside one NurseNest shell.
        </p>
      </section>
    </article>
  );
}
