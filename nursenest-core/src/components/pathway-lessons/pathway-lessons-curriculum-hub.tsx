import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Baby,
  Brain,
  BriefcaseMedical,
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

const SYSTEM_ICONS: Record<PathwayLessonSystemLabel, LucideIcon> = {
  cardiovascular: HeartPulse,
  respiratory: Wind,
  "vital-signs": Timer,
  neurological: Brain,
  "clinical-deterioration": AlertTriangle,
  "infection-immunity": Sparkles,
  pharmacology: Pill,
  "special-populations": Baby,
  "communication-safety": BriefcaseMedical,
  fundamentals: Activity,
};

const SYSTEM_SORT_ORDER = new Map<PathwayLessonSystemLabel, number>(
  PATHWAY_LESSON_SYSTEM_ORDER.map((label, index) => [label, index]),
);
const DEFAULT_VISIBLE_LESSON_COUNT = 8;

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
  const Icon = SYSTEM_ICONS[section.systemLabel] ?? Activity;
  const primaryLessons = section.lessons.slice(0, DEFAULT_VISIBLE_LESSON_COUNT);
  const overflowLessons = section.lessons.slice(DEFAULT_VISIBLE_LESSON_COUNT);
  return (
    <section
      id={section.id}
      className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 sm:p-6"
      aria-labelledby={`section-heading-${section.id}`}
    >
      <header className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--semantic-info)]">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 id={`section-heading-${section.id}`} className="text-base font-semibold text-[var(--theme-heading-text)] sm:text-lg">
            {section.label}
          </h2>
          <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{section.description}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--semantic-text-tertiary)]">
            {section.count} lesson{section.count === 1 ? "" : "s"}
          </p>
        </div>
      </header>

      <ul className="mt-5 list-none divide-y divide-[var(--semantic-border-soft)] rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--theme-page-bg)] p-0">
        {primaryLessons.map((lesson, lessonIndex) => {
          const href = pathwayLessonMarketingDetailHref(lessonsBasePath, lesson.slug);
          if (!href) return null;
          const progressStatus = progressMap[lesson.slug] ?? "not_started";

          return (
            <li
              key={lesson.slug}
              data-nn-qa-primary-lesson={sectionIndex === 0 && lessonIndex === 0 ? "true" : undefined}
              className="p-4 sm:px-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={href}
                    className="text-sm font-semibold text-[var(--theme-heading-text)] underline-offset-4 transition hover:text-primary hover:underline sm:text-base"
                  >
                    {lesson.title}
                  </Link>
                  {showLockedState ? <div className="mt-2"><StatusBadge status="locked" size="xs" /></div> : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {showProgress ? <PathwayLessonProgressBadge status={progressStatus} /> : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {overflowLessons.length > 0 ? (
        <details className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--theme-page-bg)] p-4">
          <summary className="cursor-pointer text-sm font-semibold text-[var(--semantic-brand)]">
            View all ({overflowLessons.length} more)
          </summary>
          <ul className="mt-3 list-none divide-y divide-[var(--semantic-border-soft)] rounded-lg border border-[var(--semantic-border-soft)] p-0">
            {overflowLessons.map((lesson) => {
              const href = pathwayLessonMarketingDetailHref(lessonsBasePath, lesson.slug);
              if (!href) return null;
              const progressStatus = progressMap[lesson.slug] ?? "not_started";
              return (
                <li key={lesson.slug} className="p-3 sm:px-4">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={href}
                      className="text-sm font-semibold text-[var(--theme-heading-text)] underline-offset-4 transition hover:text-primary hover:underline"
                    >
                      {lesson.title}
                    </Link>
                    {showProgress ? <PathwayLessonProgressBadge status={progressStatus} /> : null}
                  </div>
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
    <div className="space-y-6">
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
