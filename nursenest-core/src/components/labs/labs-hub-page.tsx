"use client";

import Link from "next/link";
import { MeasurementSystemToggle } from "@/components/measurements/measurement-system-toggle";
import type { LabCategoryDefinition, LabLessonDefinition, LabTrack, LabsStudyLinks } from "@/lib/labs/labs-engine";
import { useMeasurementPreference } from "@/lib/measurements/use-measurement-preference";

export type LabsHubPageProps = {
  trackLabel: string;
  labTrack: LabTrack;
  hasAccess: boolean;
  categories: Array<LabCategoryDefinition & { lessons: LabLessonDefinition[] }>;
  inventory: { lessonCount: number; questionCount: number; flashcardCount: number; categoryCount: number };
  studyLinks: LabsStudyLinks;
};

function SummaryChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] px-3 py-2">
      <div className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[var(--semantic-text-muted)]">{label}</div>
      <div className="mt-1 text-base font-semibold text-[var(--semantic-text-primary)]">{value}</div>
    </div>
  );
}

function TopicCard({ lesson, hasAccess, labTrack }: { lesson: LabLessonDefinition; hasAccess: boolean; labTrack: LabTrack }) {
  const tierLines = lesson.tierFocus[labTrack] ?? [];
  return (
    <article className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">{lesson.shortTitle}</h3>
          <p className="text-sm text-[var(--semantic-text-secondary)]">{lesson.description}</p>
        </div>
        <span className="rounded-full border border-[var(--semantic-border-soft)] px-2 py-1 text-[0.7rem] font-medium text-[var(--semantic-text-muted)]">
          {hasAccess ? "Full lesson" : "Preview"}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--semantic-text-muted)]">
        <span className="rounded-full bg-[var(--semantic-surface-muted)] px-2 py-1">{lesson.normalRange}</span>
        <span className="rounded-full bg-[var(--semantic-surface-muted)] px-2 py-1">
          {lesson.supportedTracks.map((track) => track.toUpperCase()).join(" / ")}
        </span>
      </div>
      {tierLines.length > 0 ? (
        <div className="mt-3 rounded-md border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] px-3 py-2">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--semantic-text-muted)]">
            {labTrack.toUpperCase()} focus
          </p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-[var(--semantic-text-secondary)]">
            {tierLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <ul className="mt-4 space-y-1 text-sm text-[var(--semantic-text-secondary)]">
        <li>Trend interpretation</li>
        <li>Pattern recognition</li>
        <li>Priority action logic</li>
        <li>Case micro-scenarios</li>
      </ul>
      <Link
        href={`/app/labs/${lesson.category}/${lesson.slug}`}
        className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
      >
        Open lesson
      </Link>
    </article>
  );
}

export function LabsHubPage({ trackLabel, labTrack, hasAccess, categories, inventory, studyLinks }: LabsHubPageProps) {
  const { measurementSystem, preference } = useMeasurementPreference("SI");
  return (
    <div className="space-y-8">
      <header className="nn-learner-page-hero">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--semantic-brand)]">Labs</p>
            <h1 className="text-3xl font-bold text-[var(--semantic-text-primary)]">Labs clinical reasoning engine</h1>
            <p className="text-sm text-[var(--semantic-text-secondary)]">
              Premium lab vertical for {trackLabel}: prioritization, trend and pattern recognition, first-action algorithms,
              and wired study loops into pathway lessons, flashcards, practice tests, CAT, and drills.
            </p>
            <p className="text-xs text-[var(--semantic-text-secondary)]">
              Current lab display: <span className="font-semibold text-[var(--semantic-text-primary)]">{measurementSystem === "US" ? "imperial / US customary" : "metric / SI"}</span>
            </p>
          </div>
          <div className="grid min-w-[240px] grid-cols-2 gap-2">
            <SummaryChip label="Categories" value={inventory.categoryCount} />
            <SummaryChip label="Lessons" value={inventory.lessonCount} />
            <SummaryChip label="Questions" value={inventory.questionCount} />
            <SummaryChip label="Flashcards" value={inventory.flashcardCount} />
          </div>
        </div>
        <div className="mt-4 max-w-sm">
          <MeasurementSystemToggle
            fallbackSystem="SI"
            initialPreference={preference}
            title="Lab unit display"
            description="Switch between metric and imperial anchors. The content stays global."
            compact
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href={studyLinks.lessonsHubHref} className="rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]">
            Pathway lessons
          </Link>
          <Link href={studyLinks.flashcardsHref} className="rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]">
            Flashcards
          </Link>
          <Link href={studyLinks.questionBankHref} className="rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]">
            Practice questions
          </Link>
          <Link
            href={studyLinks.practiceTestsTopicHref}
            className="rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]"
          >
            Practice tests
          </Link>
          <Link href={studyLinks.catLaunchHref} className="rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]">
            Start CAT
          </Link>
          <Link href={studyLinks.catHref} className="rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]">
            CAT builder
          </Link>
          <Link href={studyLinks.labDrillsHref} className="rounded-md border px-3 py-2 font-medium hover:bg-[var(--semantic-surface-muted)]">
            Lab drills
          </Link>
        </div>
        {!hasAccess ? (
          <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">
            Preview mode shows lesson overviews and clinical framing. Paid access unlocks full algorithms, question sets,
            trend drills, and scenario layers.
          </p>
        ) : null}
      </header>

      <div className="space-y-6">
        {categories.map((category) => (
          <section key={category.slug} className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">
                <Link href={`/app/labs/${category.slug}`} className="hover:text-primary hover:underline">
                  {category.title}
                </Link>
              </h2>
              <p className="text-sm text-[var(--semantic-text-secondary)]">{category.description}</p>
              <Link href={`/app/labs/${category.slug}`} className="text-xs font-semibold text-primary hover:underline">
                View {category.title.toLowerCase()} lessons
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {category.lessons.map((lesson) => (
                <TopicCard key={lesson.slug} lesson={lesson} hasAccess={hasAccess} labTrack={labTrack} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
