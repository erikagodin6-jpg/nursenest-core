"use client";

import Link from "next/link";
import { ChevronRight, HeartPulse } from "lucide-react";
import {
  clinicalSkillsForCategory,
  listClinicalSkillCategories,
  type ClinicalSkillCategory,
  type ClinicalSkillDefinition,
} from "@/lib/clinical-skills/clinical-skills-catalog";
import { useClinicalSkillsProgress } from "@/lib/clinical-skills/clinical-skills-progress.client";
import { cn } from "@/lib/utils";

function tierBadgeClass(tier: ClinicalSkillDefinition["competencyTier"]): string {
  switch (tier) {
    case "foundation":
      return "border-[color-mix(in_srgb,var(--semantic-chart-4)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_08%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-4)_90%,var(--semantic-text-primary))]";
    case "proficiency":
      return "border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))] text-[var(--semantic-info)]";
    case "simulation_ready":
    default:
      return "border-[color-mix(in_srgb,var(--semantic-chart-2)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_08%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-2)_90%,var(--semantic-text-primary))]";
  }
}

function tierLabel(tier: ClinicalSkillDefinition["competencyTier"]): string {
  switch (tier) {
    case "foundation":
      return "Foundation";
    case "proficiency":
      return "Proficiency";
    case "simulation_ready":
      return "Simulation-ready";
    default:
      return tier;
  }
}

function SkillCard({
  skill,
  href,
  completed,
}: {
  skill: ClinicalSkillDefinition;
  href: string;
  completed: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex min-h-[8.5rem] flex-col justify-between rounded-2xl border p-4 shadow-[var(--semantic-shadow-soft)] transition-[transform,box-shadow] duration-200 sm:min-h-0 sm:p-5",
        "border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--semantic-surface))] hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none",
      )}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tierBadgeClass(skill.competencyTier)}`}>
            {tierLabel(skill.competencyTier)}
          </span>
          {completed ? (
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_08%,var(--semantic-surface))] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-success)]">
              Completed
            </span>
          ) : null}
        </div>
        <h3 className="mt-3 text-sm font-semibold leading-snug text-[var(--semantic-text-primary)]">{skill.title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{skill.summary}</p>
      </div>
      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[color-mix(in_srgb,var(--semantic-brand)_88%,var(--semantic-text-primary))]">
        Open walkthrough
        <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

export function ClinicalSkillsHubClient({
  pathwayId,
  userId,
}: {
  pathwayId: string | null;
  userId: string | null;
}) {
  const categories = listClinicalSkillCategories();
  const { state } = useClinicalSkillsProgress(userId);

  const qp = pathwayId?.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : "";
  const continueHref =
    state.lastSlug != null ? `/app/clinical-skills/${encodeURIComponent(state.lastSlug)}${qp}` : null;

  const completedCount = state.completedSlugs.length;

  return (
    <div className="min-w-0 space-y-10" data-nn-clinical-skills-hub="">
      <header className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_12%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--semantic-chart-1)_55%,transparent),color-mix(in_srgb,var(--semantic-brand)_45%,transparent),color-mix(in_srgb,var(--semantic-chart-3)_40%,transparent))]"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl min-w-0 space-y-3">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--semantic-chart-1)_88%,var(--semantic-text-primary))]">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-1)_10%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-1)_85%,var(--semantic-text-primary))]">
                <HeartPulse className="h-4 w-4" aria-hidden strokeWidth={2} />
              </span>
              Clinical skills
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-[var(--semantic-text-primary)] sm:text-[2rem]">
              Premium competency practice
            </h1>
            <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Structured procedures with step-by-step guidance and competency tiers. Progress saves on this device when you mark steps complete — pair with your adaptive dashboard for remediation cues.
            </p>
          </div>
          <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:max-w-xs">
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_08%,var(--semantic-surface))] px-3 py-2.5 shadow-[var(--semantic-shadow-soft)]">
              <div className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--semantic-text-muted)]">Tracked complete</div>
              <div className="mt-1 text-xl font-semibold tabular-nums text-[var(--semantic-text-primary)]">{completedCount}</div>
            </div>
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-4)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_08%,var(--semantic-surface))] px-3 py-2.5 shadow-[var(--semantic-shadow-soft)]">
              <div className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--semantic-text-muted)]">Library size</div>
              <div className="mt-1 text-xl font-semibold tabular-nums text-[var(--semantic-text-primary)]">8</div>
            </div>
          </div>
        </div>
        {continueHref ? (
          <div className="relative mt-6 flex flex-wrap gap-3 border-t border-[var(--semantic-border-soft)] pt-5">
            <Link
              href={continueHref}
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--role-cta)] px-5 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_10px_var(--role-cta-shadow)]"
            >
              Continue last skill
            </Link>
            <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              Resume where you left off — adaptive study rails may also surface skills when weak-area topics match procedures.
            </p>
          </div>
        ) : null}
      </header>

      {categories.map((cat: ClinicalSkillCategory) => (
        <section
          key={cat.id}
          className="scroll-mt-24 space-y-4 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
          id={`clinical-skill-cat-${cat.id}`}
        >
          <div className="max-w-3xl">
            <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{cat.title}</h2>
            <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{cat.summary}</p>
          </div>
          <ul className="grid list-none grid-cols-1 gap-4 p-0 min-[560px]:grid-cols-2">
            {clinicalSkillsForCategory(cat.id).map((skill) => (
              <li key={skill.slug}>
                <SkillCard
                  skill={skill}
                  href={`/app/clinical-skills/${encodeURIComponent(skill.slug)}${qp}`}
                  completed={state.completedSlugs.includes(skill.slug)}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
