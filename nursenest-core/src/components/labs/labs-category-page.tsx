"use client";

import Link from "next/link";
import type { LabLessonDefinition, LabTrack } from "@/lib/labs/labs-engine";
import { estimateLabLessonMinutes, labLessonStatusLabel, labTrackFocusLabel } from "@/lib/labs/labs-display";
import { formatDisplayTitle } from "@/lib/format/text-case";

export type LabsCategoryPageProps = {
  heading: string;
  description: string;
  categorySlug: string;
  lessons: LabLessonDefinition[];
  hasAccess: boolean;
  labTrack: LabTrack;
};

export function LabsCategoryPage({ heading, description, categorySlug, lessons, hasAccess, labTrack }: LabsCategoryPageProps) {
  return (
    <div className="space-y-6">
      <header className="nn-learner-page-hero space-y-2 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_35%,var(--semantic-surface))] p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--semantic-brand)]">Labs</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">{heading}</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{description}</p>
        <p className="text-xs text-[var(--semantic-text-muted)]">{labTrackFocusLabel(labTrack)} · {lessons.length} lessons</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
        <div className="grid gap-4 sm:grid-cols-2">
          {lessons.map((lesson) => {
            const minutes = estimateLabLessonMinutes(
              lesson.physiology.length + lesson.microScenarios.length + lesson.priorityThresholds.length,
            );
            const href = hasAccess ? `/app/labs/${categorySlug}/${lesson.slug}` : "/pricing?feature=labs";
            const cta = hasAccess ? "Start" : "Upgrade to Access Labs";
            return (
              <Link
                key={lesson.slug}
                href={href}
                className="group flex min-h-full flex-col rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-left no-underline shadow-[var(--semantic-shadow-soft)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-brand)_38%,var(--semantic-border-soft))] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--semantic-brand)] motion-reduce:transform-none sm:p-5"
                data-nn-learning-module-card=""
                data-nn-labs-category-card={lesson.slug}
                data-nn-labs-card-access={hasAccess ? "subscribed" : "locked"}
                aria-label={`${hasAccess ? "Start" : "Upgrade to access"} ${lesson.shortTitle}`}
                onKeyDown={(event) => {
                  if (event.key !== " ") return;
                  event.preventDefault();
                  event.currentTarget.click();
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">{lesson.shortTitle}</h2>
                  <span className="shrink-0 rounded-full border border-[var(--semantic-border-soft)] px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--semantic-text-muted)]">
                    {labLessonStatusLabel(hasAccess)}
                  </span>
                </div>
                <p className="mt-2 flex-grow text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{lesson.description}</p>
                <p className="mt-3 text-xs text-[var(--semantic-text-muted)]">About {minutes} min</p>
                <span
                  className="mt-4 inline-flex w-fit rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] px-3 py-1.5 text-sm font-semibold text-[var(--semantic-brand)] transition-colors group-hover:bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))]"
                  aria-hidden="true"
                >
                  {cta} →
                </span>
              </Link>
            );
          })}
        </div>

        <aside className="nn-labs-lesson-rail__card lg:sticky lg:top-[calc(var(--nn-learner-sticky-offset,4.5rem)+0.5rem)]">
          <h3 className="text-xs font-bold uppercase tracking-[0.07em] text-[var(--semantic-text-muted)]">
            {formatDisplayTitle("Category focus")}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Work through lessons in any order. The sidebar keeps you inside the Labs workstation while you move between topics.
          </p>
          <Link href="/app/labs" className="mt-4 inline-flex text-sm font-semibold text-[var(--semantic-brand)] hover:underline">
            {formatDisplayTitle("Back to Labs overview")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
