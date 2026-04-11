import Link from "next/link";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Baby,
  Brain,
  BriefcaseMedical,
  ChevronRight,
  HeartPulse,
  Pill,
  Sparkles,
  Timer,
  Wind,
} from "lucide-react";
import { PathwayLessonProgressBadge } from "@/components/lessons/pathway-lesson-progress-badge";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { StatusBadge } from "@/components/ui/study-card";
import {
  buildPathwayLessonSystemSections,
  PATHWAY_LESSON_SYSTEM_ORDER,
  type PathwayLessonSystemSection,
  type PathwayLessonSystemLabel,
} from "@/lib/lessons/pathway-lesson-body-system-groups";
import {
  pathwayLessonHasRenderableHubSlug,
  pathwayLessonMarketingDetailHref,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";

type Props = {
  lessons: PathwayLessonRecord[];
  lessonsBasePath: string;
  progressMap?: Record<string, PathwayLessonProgressStatus>;
  canShowProgressMap?: boolean;
  showLockedState?: boolean;
};

type SystemVisual = {
  icon: LucideIcon;
  accentVar: string;
};

const SYSTEM_VISUALS: Record<PathwayLessonSystemLabel, SystemVisual> = {
  cardiovascular: { icon: HeartPulse, accentVar: "--semantic-danger" },
  respiratory: { icon: Wind, accentVar: "--semantic-info" },
  "vital-signs": { icon: Timer, accentVar: "--semantic-chart-3" },
  neurological: { icon: Brain, accentVar: "--semantic-chart-2" },
  "clinical-deterioration": { icon: AlertTriangle, accentVar: "--semantic-warning" },
  "infection-immunity": { icon: Sparkles, accentVar: "--semantic-success" },
  pharmacology: { icon: Pill, accentVar: "--semantic-brand" },
  "special-populations": { icon: Baby, accentVar: "--semantic-chart-5" },
  "communication-safety": { icon: BriefcaseMedical, accentVar: "--semantic-chart-4" },
  fundamentals: { icon: Activity, accentVar: "--semantic-chart-1" },
};

const SYSTEM_SORT_ORDER = new Map<PathwayLessonSystemLabel, number>(
  PATHWAY_LESSON_SYSTEM_ORDER.map((label, index) => [label, index]),
);
const DEFAULT_VISIBLE_LESSON_COUNT = 8;

function lessonSubtitle(lesson: PathwayLessonRecord): string | null {
  const text = lesson.seoDescription?.trim();
  if (!text) return null;
  const snippet = text.length > 110 ? `${text.slice(0, 107)}…` : text;
  return snippet;
}

function LessonSection({
  section,
  lessonsBasePath,
  progressMap,
  showProgress,
  showLockedState,
  sectionIndex,
}: {
  section: PathwayLessonSystemSection;
  lessonsBasePath: string;
  progressMap: Record<string, PathwayLessonProgressStatus>;
  showProgress: boolean;
  showLockedState: boolean;
  sectionIndex: number;
}) {
  const visual = SYSTEM_VISUALS[section.systemLabel] ?? { icon: Activity, accentVar: "--semantic-brand" };
  const Icon = visual.icon;
  const systemStyle = {
    "--nn-system-accent": `var(${visual.accentVar})`,
  } as CSSProperties;
  const primaryLessons = section.lessons.slice(0, DEFAULT_VISIBLE_LESSON_COUNT);
  const overflowLessons = section.lessons.slice(DEFAULT_VISIBLE_LESSON_COUNT);
  return (
    <section
      id={section.id}
      style={systemStyle}
      className="rounded-3xl border border-[color-mix(in_srgb,var(--nn-system-accent)_22%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
      aria-labelledby={`section-heading-${section.id}`}
    >
      <header className="flex items-start justify-between gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-system-accent)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_10%,var(--semantic-panel-muted))] text-[var(--nn-system-accent)]">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 id={`section-heading-${section.id}`} className="text-base font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-lg">
            {section.label}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-[var(--theme-muted-text)]">{section.description}</p>
          <p className="mt-2 inline-flex min-h-7 items-center rounded-full border border-[color-mix(in_srgb,var(--nn-system-accent)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_10%,var(--semantic-panel-muted))] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
            {section.count} lesson{section.count === 1 ? "" : "s"}
          </p>
        </div>
      </header>

      <ul className="mt-5 grid list-none gap-2.5 p-0">
        {primaryLessons.map((lesson, lessonIndex) => {
          const href = pathwayLessonMarketingDetailHref(lessonsBasePath, lesson.slug);
          if (!href) return null;
          const progressStatus = progressMap[lesson.slug] ?? "not_started";
          const subtitle = lessonSubtitle(lesson);

          return (
            <li
              key={lesson.slug}
              data-nn-qa-primary-lesson={sectionIndex === 0 && lessonIndex === 0 ? "true" : undefined}
            >
              <Link
                href={href}
                className="group flex items-start justify-between gap-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--theme-page-bg)] px-3.5 py-3 transition hover:border-[color-mix(in_srgb,var(--nn-system-accent)_28%,var(--semantic-border-soft))] hover:bg-[var(--semantic-panel-muted)] sm:px-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--theme-heading-text)] sm:text-[0.95rem]">
                    {lesson.title}
                  </p>
                  {subtitle ? <p className="mt-1 line-clamp-1 text-xs text-[var(--theme-muted-text)]">{subtitle}</p> : null}
                  {showLockedState ? (
                    <div className="mt-2">
                      <StatusBadge status="locked" size="xs" />
                    </div>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {showProgress ? <PathwayLessonProgressBadge status={progressStatus} /> : null}
                  <ChevronRight className="h-4 w-4 text-[var(--semantic-text-tertiary)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--nn-system-accent)]" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {overflowLessons.length > 0 ? (
        <details className="mt-4 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--theme-page-bg)] p-4">
          <summary className="cursor-pointer text-sm font-semibold text-[var(--nn-system-accent)]">
            View all ({overflowLessons.length} more)
          </summary>
          <ul className="mt-3 grid list-none gap-2 p-0">
            {overflowLessons.map((lesson) => {
              const href = pathwayLessonMarketingDetailHref(lessonsBasePath, lesson.slug);
              if (!href) return null;
              const progressStatus = progressMap[lesson.slug] ?? "not_started";
              const subtitle = lessonSubtitle(lesson);
              return (
                <li key={lesson.slug}>
                  <Link
                    href={href}
                    className="group flex items-start justify-between gap-3 rounded-xl border border-[var(--semantic-border-soft)] px-3 py-2.5 transition hover:border-[color-mix(in_srgb,var(--nn-system-accent)_28%,var(--semantic-border-soft))] hover:bg-[var(--semantic-panel-muted)]"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--theme-heading-text)]">
                        {lesson.title}
                      </p>
                      {subtitle ? <p className="mt-1 line-clamp-1 text-xs text-[var(--theme-muted-text)]">{subtitle}</p> : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {showProgress ? <PathwayLessonProgressBadge status={progressStatus} /> : null}
                      <ChevronRight className="h-4 w-4 text-[var(--semantic-text-tertiary)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--nn-system-accent)]" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </details>
      ) : null}
    </section>
  );
}

export function PathwayLessonsCurriculumHub({
  lessons,
  lessonsBasePath,
  progressMap = {},
  canShowProgressMap = false,
  showLockedState = false,
}: Props) {
  const safeLessons = lessons.filter(pathwayLessonHasRenderableHubSlug);
  const sections = buildPathwayLessonSystemSections(safeLessons);
  const orderedSections = [...sections].sort((a, b) => {
    const aRank = SYSTEM_SORT_ORDER.get(a.systemLabel) ?? Number.MAX_SAFE_INTEGER;
    const bRank = SYSTEM_SORT_ORDER.get(b.systemLabel) ?? Number.MAX_SAFE_INTEGER;
    if (aRank !== bRank) return aRank - bRank;
    return a.label.localeCompare(b.label);
  });

  if (sections.length === 0) {
    const thinInventoryCopy = emptyStateCopy.thinInventory();
    return (
      <PremiumEmptyState
        data-nn-empty="curriculum-hub-empty"
        tone="growth"
        density="compact"
        visualLayout="stack"
        headline={thinInventoryCopy.headline}
        body="No lessons are available in this pathway yet. The curriculum hub will expand here as more indexed sections go live."
        hint={thinInventoryCopy.hint}
        primaryCta={{ label: "Browse lessons", href: lessonsBasePath, variant: "primary" }}
      />
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:gap-6">
      {orderedSections.map((section, sectionIndex) => (
        <LessonSection
          key={section.id}
          section={section}
          lessonsBasePath={lessonsBasePath}
          progressMap={progressMap}
          showProgress={canShowProgressMap}
          showLockedState={showLockedState}
          sectionIndex={sectionIndex}
        />
      ))}
    </div>
  );
}
