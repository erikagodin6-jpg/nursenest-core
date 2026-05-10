"use client";

import Link from "next/link";
import { Calculator } from "lucide-react";
import type {
  MedCalcCategoryDefinition,
  MedCalcLessonDefinition,
  MedCalcStudyLinks,
} from "@/lib/med-calculations/med-calculations-engine";

type Props = {
  trackLabel: string;
  hasAccess: boolean;
  categories: Array<MedCalcCategoryDefinition & { lessons: MedCalcLessonDefinition[] }>;
  inventory: { lessonCount: number; questionCount: number; flashcardCount: number; categoryCount: number };
  studyLinks: MedCalcStudyLinks;
};

const STAT_ACCENT = [
  "border-[color-mix(in_srgb,var(--semantic-chart-3)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_08%,var(--semantic-surface))]",
  "border-[color-mix(in_srgb,var(--semantic-chart-4)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_09%,var(--semantic-surface))]",
  "border-[color-mix(in_srgb,var(--semantic-chart-5)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-5)_07%,var(--semantic-surface))]",
  "border-[color-mix(in_srgb,var(--semantic-success)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_06%,var(--semantic-surface))]",
] as const;

function Stat({ label, value, accentIndex }: { label: string; value: string | number; accentIndex: number }) {
  const wrap = STAT_ACCENT[accentIndex % STAT_ACCENT.length] ?? STAT_ACCENT[0];
  return (
    <div className={`rounded-xl border px-3 py-2.5 shadow-[var(--semantic-shadow-soft)] ${wrap}`}>
      <div className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--semantic-text-muted)]">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums text-[var(--semantic-text-primary)]">{value}</div>
    </div>
  );
}

/** Premium medication math workstation — Ocean structure, semantic tokens only (theme-aware). */
export function MedCalculationsHubPage({ trackLabel, hasAccess, categories, inventory, studyLinks }: Props) {
  const frameworkChips = ["Dosage drills", "IV drip & pumps", "Weight-based dosing", "Dimensional analysis"] as const;

  return (
    <div
      className="min-w-0 space-y-10"
      data-nn-med-calc-hub=""
      data-nn-premium-full-platform-convergence=""
      data-nn-premium-platform-family="clinical"
      data-nn-premium-platform-module="med-calculations"
    >
      <header className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-5)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_16%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--semantic-chart-5)_65%,transparent),color-mix(in_srgb,var(--semantic-info)_50%,transparent),color-mix(in_srgb,var(--semantic-chart-3)_45%,transparent))]"
          aria-hidden
        />
        <div className="relative flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl min-w-0 space-y-3">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--semantic-chart-5)_88%,var(--semantic-text-primary))]">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-5)_10%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-5)_85%,var(--semantic-text-primary))]">
                <Calculator className="h-4 w-4" aria-hidden strokeWidth={2} />
              </span>
              Medication calculations
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-[var(--semantic-text-primary)] sm:text-[2rem]">
              High-stakes med calculations training
            </h1>
            <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Built for {trackLabel}. Interactive drills for dimensional analysis, ratio-proportion, formula setup, conversions,
              IV rates, and weight-based safety — strict practice and timed runs when your plan unlocks them.
            </p>
            <ul className="flex flex-wrap gap-2 pt-1" aria-label="Medication math focus areas">
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
          <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:max-w-sm lg:w-[min(100%,280px)] lg:shrink-0">
            <Stat label="Categories" value={inventory.categoryCount} accentIndex={0} />
            <Stat label="Lessons" value={inventory.lessonCount} accentIndex={1} />
            <Stat label="Questions" value={inventory.questionCount} accentIndex={2} />
            <Stat label="Flashcards" value={inventory.flashcardCount} accentIndex={3} />
          </div>
        </div>

        <div className="relative mt-6 flex min-w-0 flex-wrap gap-2.5 text-sm">
          <Link
            href={studyLinks.flashcardsHref}
            className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-3)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_08%,var(--semantic-surface))] px-4 font-semibold text-[color-mix(in_srgb,var(--semantic-chart-3)_92%,var(--semantic-text-primary))] shadow-[var(--semantic-shadow-soft)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-chart-3)_14%,var(--semantic-surface))]"
          >
            Flashcards
          </Link>
          <Link
            href={studyLinks.questionsHref}
            className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-4)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_07%,var(--semantic-surface))] px-4 font-semibold text-[color-mix(in_srgb,var(--semantic-chart-4)_90%,var(--semantic-text-primary))] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-chart-4)_12%,var(--semantic-surface))]"
          >
            Practice questions
          </Link>
          <Link
            href={studyLinks.catHref}
            className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_07%,var(--semantic-surface))] px-4 font-semibold text-[color-mix(in_srgb,var(--semantic-info)_88%,var(--semantic-text-primary))] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))]"
          >
            Practice tests
          </Link>
          <Link
            href={studyLinks.medicationDrillsHref}
            className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-5)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-5)_06%,var(--semantic-surface))] px-4 font-semibold text-[color-mix(in_srgb,var(--semantic-chart-5)_90%,var(--semantic-text-primary))] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-chart-5)_12%,var(--semantic-surface))]"
          >
            Medication drills
          </Link>
        </div>
        {!hasAccess ? (
          <p className="relative mt-4 text-sm text-[var(--semantic-text-secondary)]">
            Free access includes lesson previews and a limited question subset. Paid access unlocks the full question sets,
            timed sessions, and strict-mode passes.
          </p>
        ) : null}
      </header>

      <div className="space-y-10">
        {categories.map((category) => (
          <section key={category.slug} className="space-y-4" data-nn-med-calc-category={category.slug}>
            <div className="space-y-2 border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,transparent)] pb-3">
              <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">{category.title}</h2>
              <p className="max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{category.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {category.lessons.map((lesson, li) => (
                <article
                  key={lesson.slug}
                  className={`group flex min-h-full min-w-0 flex-col rounded-2xl border p-4 shadow-[var(--semantic-shadow-soft)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none sm:p-5 ${
                    li % 3 === 0
                      ? "border-[color-mix(in_srgb,var(--semantic-chart-3)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--semantic-surface))]"
                      : li % 3 === 1
                        ? "border-[color-mix(in_srgb,var(--semantic-chart-4)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_05%,var(--semantic-surface))]"
                        : "border-[color-mix(in_srgb,var(--semantic-chart-5)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-5)_05%,var(--semantic-surface))]"
                  }`}
                >
                  <div className="min-w-0 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-2)_85%,var(--semantic-text-secondary))]">
                      {category.title}
                    </p>
                    <h3 className="break-words text-base font-semibold text-[var(--semantic-text-primary)]">{lesson.shortTitle}</h3>
                    <p className="break-words text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{lesson.description}</p>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-medium text-[var(--semantic-text-secondary)]">
                    <li className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-0.5">Dimensional analysis</li>
                    <li className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-0.5">Strict mode</li>
                    <li className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-0.5">Timed drills</li>
                  </ul>
                  <Link
                    href={`/app/med-calculations/${lesson.category}/${lesson.slug}`}
                    className="mt-4 inline-flex min-h-11 w-fit touch-manipulation items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] px-4 text-sm font-semibold text-[color-mix(in_srgb,var(--semantic-brand)_92%,var(--semantic-text-primary))] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))]"
                  >
                    Open lesson
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
