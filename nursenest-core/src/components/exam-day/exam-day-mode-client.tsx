"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Activity, ArrowRight, BookOpenCheck, Clock, FlaskConical, HeartPulse, Pill, Sparkles } from "lucide-react";
import { LearnerStudyPageShell } from "@/components/learner-study-ui";
import {
  EXAM_DAY_FILTERS,
  EXAM_DAY_HIGH_YIELD_BLOCKS,
  EXAM_DAY_SESSION_LENGTHS,
  buildExamDayReviewResources,
  type ExamDayActivityId,
  type ExamDayFilterId,
  type ExamDaySessionLength,
} from "@/lib/exam-day/exam-day-mode";

const activityIcons: Record<ExamDayActivityId, typeof BookOpenCheck> = {
  flashcards: BookOpenCheck,
  questions: Activity,
  ecg: HeartPulse,
  pharmacology: Pill,
  labs: FlaskConical,
};

export function ExamDayModeClient({
  pathwayId,
  pathwayDisplayName,
}: {
  pathwayId: string;
  pathwayDisplayName: string;
}) {
  const [filterId, setFilterId] = useState<ExamDayFilterId>("most-missed");
  const [sessionLength, setSessionLength] = useState<ExamDaySessionLength>(30);

  const resources = useMemo(
    () => buildExamDayReviewResources({ pathwayId, filterId, sessionLength }),
    [filterId, pathwayId, sessionLength],
  );
  const selectedFilter = EXAM_DAY_FILTERS.find((filter) => filter.id === filterId) ?? EXAM_DAY_FILTERS[0]!;

  return (
    <LearnerStudyPageShell
      className="py-5 sm:py-7"
      data-nn-exam-day-mode
      data-nn-premium-platform-family="exam-study"
      data-nn-premium-platform-module="exam-day"
    >
      <header className="nn-learner-page-hero">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]">
          <Sparkles className="h-3.5 w-3.5 text-[var(--semantic-brand)]" aria-hidden />
          Final Review
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.875rem]">
          Exam Day Mode
        </h1>
        <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:text-base">
          A rapid, focused review surface for {pathwayDisplayName}. Choose the final-review filter and session length,
          then move through flashcards, questions, ECG, pharmacology, and labs from one place.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.6fr)]">
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Review Filters</p>
              <h2 className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">Target what matters today</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-secondary)]">
              <Clock className="h-3.5 w-3.5 text-[var(--semantic-brand)]" aria-hidden />
              {sessionLength} min
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {EXAM_DAY_FILTERS.map((filter) => {
              const active = filter.id === filterId;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilterId(filter.id)}
                  className={[
                    "rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-focus-ring)]",
                    active
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] shadow-[var(--semantic-shadow-soft)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] hover:bg-[var(--semantic-panel-muted)]",
                  ].join(" ")}
                >
                  <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">{filter.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                    {filter.description}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 border-t border-[var(--semantic-border-soft)] pt-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Session Length</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {EXAM_DAY_SESSION_LENGTHS.map((length) => (
                <button
                  key={length}
                  type="button"
                  aria-pressed={length === sessionLength}
                  onClick={() => setSessionLength(length)}
                  className={[
                    "h-11 rounded-full border text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-focus-ring)]",
                    length === sessionLength
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_44%,var(--semantic-border-soft))] bg-[var(--semantic-brand)] text-[var(--semantic-on-brand)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]",
                  ].join(" ")}
                >
                  {length} min
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Current Focus</p>
          <h2 className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">{selectedFilter.label}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{selectedFilter.description}</p>
          <div className="mt-5 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Exam-day rhythm</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Start with recall, test the concept, then check ECG, medication, and lab implications when relevant.
            </p>
          </div>
        </aside>
      </section>

      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Focused Session</p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">Start from one review queue</h2>
          </div>
          <p className="text-sm text-[var(--semantic-text-secondary)]">{resources.length} study surfaces included</p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {resources.map((resource) => {
            const Icon = activityIcons[resource.id];
            return (
              <Link
                key={resource.id}
                href={resource.href}
                className="group flex min-h-[172px] flex-col rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 transition hover:bg-[var(--semantic-panel-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-focus-ring)]"
                data-nn-exam-day-resource={resource.id}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] text-[var(--semantic-brand)]">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="mt-4 text-sm font-semibold text-[var(--semantic-text-primary)]">{resource.label}</span>
                <span className="mt-2 flex-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                  {resource.description}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--semantic-brand)]">
                  {resource.estimatedMinutes} min <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2" aria-labelledby="exam-day-pearls-heading">
        <div className="lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">High-Yield Review</p>
          <h2 id="exam-day-pearls-heading" className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">
            Pearls, Memory Hooks, and NCLEX Takeaways
          </h2>
        </div>
        {EXAM_DAY_HIGH_YIELD_BLOCKS.map((block) => (
          <article
            key={block.id}
            className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]"
          >
            <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">{block.title}</h3>
            <dl className="mt-4 space-y-3 text-sm leading-relaxed">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-brand)]">High-yield pearl</dt>
                <dd className="mt-1 text-[var(--semantic-text-secondary)]">{block.pearl}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Memory hook</dt>
                <dd className="mt-1 text-[var(--semantic-text-primary)]">{block.memoryHook}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">NCLEX takeaway</dt>
                <dd className="mt-1 text-[var(--semantic-text-secondary)]">{block.nclexTakeaway}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </LearnerStudyPageShell>
  );
}
