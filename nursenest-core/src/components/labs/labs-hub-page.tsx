"use client";

import Link from "next/link";
import { MeasurementInterpretationPanel } from "@/components/measurements/measurement-interpretation-panel";
import { MeasurementSystemToggle } from "@/components/measurements/measurement-system-toggle";
import type { LabCategoryDefinition, LabLessonDefinition, LabTrack, LabsStudyLinks } from "@/lib/labs/labs-engine";
import { labLessonStatusLabel, labTrackFocusLabel } from "@/lib/labs/labs-display";
import { useMeasurementPreference } from "@/lib/measurements/use-measurement-preference";
import { formatDisplayTitle } from "@/lib/format/text-case";

export type LabsHubPageProps = {
  trackLabel: string;
  labTrack: LabTrack;
  hasAccess: boolean;
  categories: Array<LabCategoryDefinition & { lessons: LabLessonDefinition[] }>;
  inventory: { lessonCount: number; questionCount: number; flashcardCount: number; categoryCount: number };
  studyLinks: LabsStudyLinks;
};

const CHART_ACCENTS = [
  "--semantic-chart-1",
  "--semantic-chart-2",
  "--semantic-chart-3",
  "--semantic-chart-4",
  "--semantic-chart-5",
] as const;

function chartBorderVar(i: number): string {
  return CHART_ACCENTS[i % CHART_ACCENTS.length] ?? "--semantic-chart-3";
}

function SummaryChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_28%,var(--semantic-surface))] px-3 py-2.5 shadow-[var(--semantic-shadow-soft)]">
      <div className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[var(--semantic-text-muted)]">{label}</div>
      <div className="mt-1 text-lg font-bold tabular-nums text-[var(--semantic-text-primary)]">{value}</div>
    </div>
  );
}

function LabsTelemetryStrip() {
  return (
    <svg className="nn-labs-hub__telemetry h-14 w-full max-w-xl overflow-visible" viewBox="0 0 320 56" aria-hidden role="presentation">
      <path
        d="M0 38 Q40 18 80 30 T160 28 T240 22 T320 26"
        fill="none"
        stroke="color-mix(in srgb, var(--semantic-info) 55%, var(--semantic-border-soft))"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M0 42 Q48 34 96 36 T192 40 T288 34"
        fill="none"
        stroke="color-mix(in srgb, var(--semantic-chart-3) 65%, var(--semantic-border-soft))"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.85}
      />
      <path
        d="M12 48 L308 48"
        stroke="color-mix(in srgb, var(--semantic-success) 35%, var(--semantic-border-soft))"
        strokeWidth="1"
        strokeDasharray="4 6"
      />
    </svg>
  );
}

function buildCriticalWatchlist(
  categories: LabsHubPageProps["categories"],
): Array<{ label: string; threshold: string; whyItMatters: string; categoryTitle: string }> {
  const out: Array<{ label: string; threshold: string; whyItMatters: string; categoryTitle: string }> = [];
  for (const cat of categories) {
    for (const lesson of cat.lessons) {
      const th = lesson.priorityThresholds[0];
      if (th) out.push({ ...th, categoryTitle: cat.title });
      if (out.length >= 10) return out;
    }
  }
  return out;
}

function TopicCard({
  lesson,
  hasAccess,
  labTrack,
  accentIndex,
}: {
  lesson: LabLessonDefinition;
  hasAccess: boolean;
  labTrack: LabTrack;
  accentIndex: number;
}) {
  const tierLines = lesson.tierFocus[labTrack] ?? [];
  const accent = chartBorderVar(accentIndex);
  const trendHint = lesson.trendInterpretation[0] ?? lesson.clinicalPearls[0] ?? "";
  const href = hasAccess ? `/app/labs/${lesson.category}/${lesson.slug}` : "/pricing?feature=labs";
  const cta = hasAccess ? "Start" : "Upgrade to Access Labs";
  return (
    <Link
      href={href}
      className="group flex min-h-full flex-col rounded-2xl border bg-[var(--semantic-surface)] p-4 text-left no-underline shadow-[var(--semantic-shadow-soft)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--semantic-brand)] motion-reduce:transform-none sm:p-5"
      style={{
        borderColor: `color-mix(in srgb, var(${accent}) 30%, var(--semantic-border-soft))`,
      }}
      data-nn-learning-module-card=""
      data-nn-labs-topic-card={lesson.slug}
      data-nn-labs-card-access={hasAccess ? "subscribed" : "locked"}
      aria-label={`${hasAccess ? "Start" : "Upgrade to access"} ${lesson.shortTitle}`}
      onKeyDown={(event) => {
        if (event.key !== " ") return;
        event.preventDefault();
        event.currentTarget.click();
      }}
    >
      <div className="flex items-start justify-between gap-3 border-b border-[var(--semantic-border-soft)] pb-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold leading-snug text-[var(--semantic-text-primary)]">{lesson.shortTitle}</h3>
          <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{lesson.description}</p>
        </div>
        <span className="shrink-0 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] px-2 py-1 text-[0.65rem] font-semibold text-[var(--semantic-text-muted)]">
          {labLessonStatusLabel(hasAccess)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[var(--semantic-text-secondary)]">
        <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-panel-warm)_35%,var(--semantic-surface-muted))] px-2.5 py-1 font-medium text-[var(--semantic-text-primary)]">
          Range: {lesson.normalRange}
        </span>
        <span className="rounded-full border border-[var(--semantic-border-soft)] px-2.5 py-1">
          {lesson.supportedTracks.map((track) => track.toUpperCase()).join(" · ")}
        </span>
      </div>

      {lesson.priorityThresholds[0] ? (
        <div className="mt-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_06%,var(--semantic-surface))] px-3 py-2">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--semantic-danger)]">Critical-value cue</p>
          <p className="mt-1 text-sm font-semibold text-[var(--semantic-text-primary)]">{lesson.priorityThresholds[0].label}</p>
          <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">{lesson.priorityThresholds[0].threshold}</p>
        </div>
      ) : null}

      {tierLines.length > 0 ? (
        <div className="mt-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,var(--semantic-surface))] px-3 py-2">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-[var(--semantic-text-muted)]">{labTrackFocusLabel(labTrack)}</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-[var(--semantic-text-secondary)]">
            {tierLines.slice(0, 4).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {trendHint ? (
        <p className="mt-3 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
          <span className="font-semibold text-[var(--semantic-text-primary)]">Trend / significance: </span>
          {trendHint}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--semantic-border-soft)] pt-3">
        <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface-muted))] px-2 py-0.5 text-[10px] font-semibold text-[var(--semantic-success)]">
          Interpretation
        </span>
        <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface-muted))] px-2 py-0.5 text-[10px] font-semibold text-[color-mix(in_srgb,var(--semantic-warning)_85%,var(--semantic-text-primary))]">
          Escalation logic
        </span>
        <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface-muted))] px-2 py-0.5 text-[10px] font-semibold text-[var(--semantic-info)]">
          Pattern checks
        </span>
      </div>

      <span
        className="mt-4 inline-flex w-fit rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] px-3 py-1.5 text-sm font-semibold text-[color-mix(in_srgb,var(--semantic-brand)_92%,var(--semantic-text-primary))] transition-colors group-hover:bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))]"
        aria-hidden="true"
      >
        {cta} →
      </span>
    </Link>
  );
}

const STUDY_LOOP_LINKS: Array<{ hrefKey: keyof LabsStudyLinks; label: string }> = [
  { hrefKey: "lessonsHubHref", label: "Pathway lessons" },
  { hrefKey: "flashcardsHref", label: "Flashcards" },
  { hrefKey: "questionBankHref", label: "Practice questions" },
  { hrefKey: "practiceTestsTopicHref", label: "Practice tests" },
  { hrefKey: "catLaunchHref", label: "Start" },
  { hrefKey: "catHref", label: "CAT builder" },
  { hrefKey: "labDrillsHref", label: "Lab drills" },
];

export function LabsHubPage({ trackLabel, labTrack, hasAccess, categories, inventory, studyLinks }: LabsHubPageProps) {
  const { measurementSystem, preference } = useMeasurementPreference("SI");
  const criticalRows = buildCriticalWatchlist(categories);

  return (
    <div
      className="nn-labs-hub space-y-10"
      data-nn-labs-hub=""
      data-nn-premium-full-platform-convergence=""
      data-nn-premium-platform-family="clinical"
      data-nn-premium-platform-module="labs"
    >
      <header className="nn-learner-page-hero nn-labs-hub__hero overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_55%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-info)]">Labs</p>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-4xl">
              {formatDisplayTitle("Clinical lab workstation")}
            </h1>
            <p className="text-base leading-relaxed text-[var(--semantic-text-secondary)]">
              Premium Labs clinical reasoning engine for {trackLabel}: prioritization, critical-value recognition, trend interpretation, and study loops wired into
              lessons, flashcards, practice, CAT, and drills — one NurseNest surface, not a side utility.
            </p>
            <p className="text-xs text-[var(--semantic-text-secondary)]">
              Display units:{" "}
              <span className="font-semibold text-[var(--semantic-text-primary)]">{measurementSystem === "US" ? "US customary / imperial anchors" : "Metric / SI anchors"}</span>
            </p>
          </div>
          <div className="w-full min-w-[min(100%,280px)] max-w-md shrink-0 space-y-3">
            <LabsTelemetryStrip />
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <SummaryChip label="Systems" value={inventory.categoryCount} />
              <SummaryChip label="Lessons" value={inventory.lessonCount} />
              <SummaryChip label="Questions" value={inventory.questionCount} />
              <SummaryChip label="Flashcards" value={inventory.flashcardCount} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex max-w-md flex-col gap-2">
          <MeasurementSystemToggle
            fallbackSystem="SI"
            initialPreference={preference}
            title="Lab unit display"
            description="Switch metric vs US customary anchors for teaching clarity."
            compact
          />
        </div>

        <nav className="nn-labs-hub__study-loop mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" aria-label="Labs study loops">
          {STUDY_LOOP_LINKS.map(({ hrefKey, label }, i) => (
            <Link
              key={hrefKey}
              href={studyLinks[hrefKey]}
              className="rounded-xl border px-3 py-2.5 text-center text-sm font-semibold shadow-[var(--semantic-shadow-soft)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-chart-2)_08%,var(--semantic-surface))]"
              style={{
                borderColor: `color-mix(in srgb, var(${chartBorderVar(i)}) 28%, var(--semantic-border-soft))`,
              }}
            >
              {formatDisplayTitle(label)}
            </Link>
          ))}
        </nav>

        {!hasAccess ? (
          <p className="mt-6 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_06%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
            Preview mode surfaces framing and priorities; paid access unlocks full drill sets, scenarios, and adaptive layers — entitlement enforced server-side.
          </p>
        ) : null}
      </header>

      <section
        className="rounded-3xl border border-[color-mix(in_srgb,var(--semantic-danger)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_04%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8"
        aria-labelledby="labs-critical-watchlist"
      >
        <h2 id="labs-critical-watchlist" className="text-lg font-semibold text-[var(--semantic-text-primary)]">
          Critical-value and escalation watchlist
        </h2>
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
          Cross-cutting thresholds pulled from lesson priorities — use them as bedside cues, not memorized trivia.
        </p>
        {criticalRows.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--semantic-text-secondary)]">Priority thresholds appear as lessons load into your inventory.</p>
        ) : (
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {criticalRows.map((row) => (
              <li
                key={`${row.categoryTitle}-${row.label}`}
                className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-danger)_15%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-4"
              >
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--semantic-danger)]">{row.categoryTitle}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--semantic-text-primary)]">{row.label}</p>
                <p className="mt-1 text-xs font-medium text-[var(--semantic-text-secondary)]">{row.threshold}</p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{row.whyItMatters}</p>
                {/potassium|hyperkalemia|\bK\+/i.test(row.label) ? (
                  <div className="mt-3">
                    <MeasurementInterpretationPanel
                      measurement={{
                        category: "electrolytes",
                        kind: "potassium",
                        valueSi: 6.2,
                        authoredSystem: "si",
                      }}
                      measurementSystem={measurementSystem}
                      trendValuesSi={[5.2, 5.8, 6.2]}
                      compact
                    />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8" aria-labelledby="labs-framework">
        <h2 id="labs-framework" className="text-lg font-semibold text-[var(--semantic-text-primary)]">
          Interpretation framework
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { title: "Trend first", body: "Direction matters as much as the absolute — compare trajectory with symptoms and meds." },
            { title: "Pattern clusters", body: "Pair labs that explain each other (renal + electrolytes, liver + coags + albumin)." },
            { title: "Safety actions", body: "Escalate with critical combinations; document reassessment targets." },
          ].map((item, idx) => (
            <li
              key={item.title}
              className="rounded-2xl border p-4 text-sm shadow-[var(--semantic-shadow-soft)]"
              style={{
                borderColor: `color-mix(in srgb, var(${chartBorderVar(idx)}) 26%, var(--semantic-border-soft))`,
                background: `color-mix(in srgb, var(${chartBorderVar(idx)}) 06%, var(--semantic-surface))`,
              }}
            >
              <p className="font-semibold text-[var(--semantic-text-primary)]">{item.title}</p>
              <p className="mt-2 leading-relaxed text-[var(--semantic-text-secondary)]">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-10">
        {categories.map((category, catIdx) => (
          <section key={category.slug} className="space-y-4" data-nn-labs-category={category.slug}>
            <div className="flex flex-col gap-2 border-b border-[var(--semantic-border-soft)] pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: `var(${chartBorderVar(catIdx)})` }}
                    aria-hidden
                  />
                  <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">
                    <Link href={`/app/labs/${category.slug}`} className="hover:text-[color-mix(in_srgb,var(--semantic-brand)_90%,var(--semantic-text-primary))] hover:underline">
                      {category.title}
                    </Link>
                  </h2>
                </div>
                <p className="max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{category.description}</p>
              </div>
              <Link
                href={`/app/labs/${category.slug}`}
                className="inline-flex shrink-0 text-sm font-semibold text-[color-mix(in_srgb,var(--semantic-brand)_92%,var(--semantic-text-primary))] hover:underline"
              >
                Browse {category.title.toLowerCase()} →
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {category.lessons.map((lesson, lessonIdx) => (
                <TopicCard
                  key={lesson.slug}
                  lesson={lesson}
                  hasAccess={hasAccess}
                  labTrack={labTrack}
                  accentIndex={catIdx + lessonIdx}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
