"use client";

import Link from "next/link";
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

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] px-3 py-2">
      <div className="text-[0.7rem] uppercase tracking-[0.08em] text-[var(--semantic-text-muted)]">{label}</div>
      <div className="mt-1 text-base font-semibold text-[var(--semantic-text-primary)]">{value}</div>
    </div>
  );
}

export function MedCalculationsHubPage({ trackLabel, hasAccess, categories, inventory, studyLinks }: Props) {
  return (
    <div className="min-w-0 space-y-8">
      <header className="nn-learner-page-hero">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="max-w-3xl min-w-0 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--semantic-brand)]">Medication calculations</p>
            <h1 className="text-3xl font-bold text-[var(--semantic-text-primary)]">High-stakes med calculations training</h1>
            <p className="text-sm text-[var(--semantic-text-secondary)]">
              Built for {trackLabel}. Lessons teach dimensional analysis, ratio-proportion, formula setup, equation
              rearrangement, conversion discipline, and clinical safety. Practice mode expects 100% when strict mode is on.
            </p>
          </div>
          <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:w-auto sm:min-w-[240px]">
            <Stat label="Categories" value={inventory.categoryCount} />
            <Stat label="Lessons" value={inventory.lessonCount} />
            <Stat label="Questions" value={inventory.questionCount} />
            <Stat label="Flashcards" value={inventory.flashcardCount} />
          </div>
        </div>
        <div className="mt-4 flex min-w-0 flex-wrap gap-3 text-sm">
          <Link
            href={studyLinks.flashcardsHref}
            className="inline-flex min-h-10 touch-manipulation items-center rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]"
          >
            Flashcards
          </Link>
          <Link
            href={studyLinks.questionsHref}
            className="inline-flex min-h-10 touch-manipulation items-center rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]"
          >
            Practice questions
          </Link>
          <Link
            href={studyLinks.catHref}
            className="inline-flex min-h-10 touch-manipulation items-center rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]"
          >
            Practice tests
          </Link>
          <Link
            href={studyLinks.medicationDrillsHref}
            className="inline-flex min-h-10 touch-manipulation items-center rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]"
          >
            Medication drills
          </Link>
        </div>
        {!hasAccess ? (
          <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">
            Free access includes lesson previews and a limited question subset. Paid access unlocks the full question sets,
            timed sessions, and strict-mode passes.
          </p>
        ) : null}
      </header>

      <div className="space-y-6">
        {categories.map((category) => (
          <section key={category.slug} className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">{category.title}</h2>
              <p className="text-sm text-[var(--semantic-text-secondary)]">{category.description}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {category.lessons.map((lesson) => (
                <article
                  key={lesson.slug}
                  className="min-w-0 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4"
                >
                  <div className="min-w-0 space-y-2">
                    <h3 className="break-words text-base font-semibold text-[var(--semantic-text-primary)]">{lesson.shortTitle}</h3>
                    <p className="break-words text-sm text-[var(--semantic-text-secondary)]">{lesson.description}</p>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-[var(--semantic-text-secondary)]">
                    <li>Dimensional analysis</li>
                    <li>Ratio-proportion</li>
                    <li>Formula method</li>
                    <li>Strict practice mode</li>
                  </ul>
                  <Link
                    href={`/app/med-calculations/${lesson.category}/${lesson.slug}`}
                    className="mt-4 inline-flex min-h-10 touch-manipulation items-center text-sm font-semibold text-primary hover:underline"
                  >
                    Open topic
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
