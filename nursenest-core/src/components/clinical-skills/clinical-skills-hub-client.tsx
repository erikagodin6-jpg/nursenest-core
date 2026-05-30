"use client";

import Link from "next/link";
import { ChevronRight, HeartPulse } from "lucide-react";
import {
  clinicalSkillsForCategory,
  listClinicalSkillCategories,
  type ClinicalSkillCategory,
  type ClinicalSkillDefinition,
} from "@/lib/clinical-skills/clinical-skills-catalog";
import { clinicalSkillTierLabel } from "@/lib/clinical-skills/clinical-skills-display";
import { useClinicalSkillsProgress } from "@/lib/clinical-skills/clinical-skills-progress.client";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { cn } from "@/lib/utils";

const CARD_ACCENTS = [
  "border-[color-mix(in_srgb,var(--semantic-chart-3)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--semantic-surface))]",
  "border-[color-mix(in_srgb,var(--semantic-chart-4)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_06%,var(--semantic-surface))]",
  "border-[color-mix(in_srgb,var(--semantic-chart-2)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_06%,var(--semantic-surface))]",
  "border-[color-mix(in_srgb,var(--semantic-success)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_05%,var(--semantic-surface))]",
] as const;

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

function SkillModuleCard({
  skill,
  href,
  progress,
  accentIndex,
}: {
  skill: ClinicalSkillDefinition;
  href: string;
  progress: PathwayLessonProgressStatus;
  accentIndex: number;
}) {
  const wrap = CARD_ACCENTS[accentIndex % CARD_ACCENTS.length] ?? CARD_ACCENTS[0];
  return (
    <Link
      href={href}
      data-nn-learning-module-card=""
      className={cn(
        "group flex min-h-full min-w-0 flex-col justify-between rounded-2xl border p-4 shadow-[var(--semantic-shadow-soft)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none sm:p-5",
        wrap,
      )}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tierBadgeClass(skill.competencyTier)}`}>
            {clinicalSkillTierLabel(skill.competencyTier)}
          </span>
          {progress === "completed" ? (
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_08%,var(--semantic-surface))] px-2 py-0.5 text-[11px] font-semibold text-[var(--semantic-success)]">
              Completed
            </span>
          ) : progress === "in_progress" ? (
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))] px-2 py-0.5 text-[11px] font-semibold text-[var(--semantic-info)]">
              In progress
            </span>
          ) : null}
        </div>
        <h3 className="mt-3 text-sm font-semibold leading-snug text-[var(--semantic-text-primary)]">{skill.title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{skill.summary}</p>
        <p className="mt-2 text-[11px] font-medium text-[var(--semantic-text-muted)]">~{skill.estimatedMinutes} min · interactive checkpoint</p>
      </div>
      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[color-mix(in_srgb,var(--semantic-brand)_88%,var(--semantic-text-primary))]">
        Open competency lab
        <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

export function ClinicalSkillsHubClient({
  pathwayId,
  userId,
  progressSummary,
  continueHref,
  continueTitle,
  progressMap = {},
}: {
  pathwayId: string | null;
  userId: string | null;
  progressSummary?: { completed: number; inProgress: number; total: number };
  continueHref?: string;
  continueTitle?: string;
  progressMap?: Record<string, PathwayLessonProgressStatus>;
}) {
  const categories = listClinicalSkillCategories();
  const { state } = useClinicalSkillsProgress(userId);

  const qp = pathwayId?.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : "";
  const localContinue =
    state.lastSlug != null ? `/app/clinical-skills/${encodeURIComponent(state.lastSlug)}${qp}` : null;
  const resolvedContinue = continueHref ?? localContinue;

  const frameworkChips = [
    "Sterile technique",
    "Injection training",
    "Airway and devices",
    "Interactive checkpoints",
  ] as const;

  return (
    <div className="min-w-0 space-y-10" data-nn-clinical-skills-hub="">
      <header className="relative overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-8 shadow-[0_2px_20px_-6px_color-mix(in_srgb,var(--semantic-text-primary)_10%,transparent),var(--semantic-shadow-soft)] sm:p-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--semantic-chart-1)_55%,transparent),color-mix(in_srgb,var(--semantic-brand)_45%,transparent),color-mix(in_srgb,var(--semantic-chart-3)_40%,transparent))]"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl min-w-0 space-y-3">
            <p className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-1)_88%,var(--semantic-text-primary))]">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-1)_10%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-1)_85%,var(--semantic-text-primary))]">
                <HeartPulse className="h-4 w-4" aria-hidden strokeWidth={2} />
              </span>
              Clinical skills competency lab
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-[var(--semantic-text-primary)] sm:text-[2rem]">
              Practice nursing skills with simulation-style guidance
            </h1>
            <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Step-by-step procedural walkthroughs, safety checkpoints, and multiple-choice competency questions with rationales — built for NCLEX readiness and bedside performance.
            </p>
            <ul className="flex flex-wrap gap-2 pt-1" aria-label="Clinical skills focus areas">
              {frameworkChips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-4)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_06%,var(--semantic-surface))] px-3 py-1 text-[11px] font-semibold text-[var(--semantic-text-primary)]"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full min-w-0 grid-cols-2 gap-3 sm:max-w-xs">
            <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 shadow-[var(--semantic-shadow-soft)]">
              <div className="text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--semantic-text-muted)]">Completed</div>
              <div className="mt-1.5 text-2xl font-bold tabular-nums text-[var(--semantic-success)]">
                {progressSummary?.completed ?? state.completedSlugs.length}
              </div>
            </div>
            <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 shadow-[var(--semantic-shadow-soft)]">
              <div className="text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--semantic-text-muted)]">Procedures</div>
              <div className="mt-1.5 text-2xl font-bold tabular-nums text-[var(--semantic-text-primary)]">
                {progressSummary?.total ?? categories.reduce((n, c) => n + clinicalSkillsForCategory(c.id).length, 0)}
              </div>
            </div>
          </div>
        </div>

        {resolvedContinue && continueTitle ? (
          <div className="relative mt-7 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface-muted)_55%,var(--semantic-surface))] px-5 py-4">
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Continue where you left off</p>
            <Link
              href={resolvedContinue}
              className="inline-flex min-h-10 items-center rounded-full bg-[var(--role-cta)] px-5 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_14px_var(--role-cta-shadow)]"
            >
              {continueTitle}
            </Link>
          </div>
        ) : null}
      </header>

      <p className="text-sm text-[var(--semantic-text-secondary)] lg:hidden">
        Use the category strip above or open a procedure below. Desktop learners get the full competency sidebar.
      </p>

      {categories.map((cat: ClinicalSkillCategory) => (
        <section
          key={cat.id}
          className="scroll-mt-24 space-y-5 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-7 shadow-[var(--semantic-shadow-soft)] sm:p-8"
          id={`clinical-skill-cat-${cat.id}`}
        >
          <div className="max-w-3xl space-y-1">
            <h2 className="text-xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">{cat.title}</h2>
            <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{cat.summary}</p>
          </div>
          <ul className="grid list-none grid-cols-1 gap-4 p-0 min-[560px]:grid-cols-2">
            {clinicalSkillsForCategory(cat.id).map((skill, li) => (
              <li key={skill.slug}>
                <SkillModuleCard
                  skill={skill}
                  href={`/app/clinical-skills/${encodeURIComponent(skill.slug)}${qp}`}
                  progress={progressMap[skill.slug] ?? (state.completedSlugs.includes(skill.slug) ? "completed" : "not_started")}
                  accentIndex={li}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
