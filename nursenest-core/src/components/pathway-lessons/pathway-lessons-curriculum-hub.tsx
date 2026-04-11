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

function lessonSubtitle(lesson: PathwayLessonRecord): string | null {
  const text = lesson.seoDescription?.trim();
  if (!text) return null;
  return text.length > 110 ? `${text.slice(0, 107)}…` : text;
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
  const systemStyle = { "--nn-system-accent": `var(${visual.accentVar})` } as CSSProperties;

  return (
    <section
      id={section.id}
      style={systemStyle}
      className="flex flex-col rounded-3xl border border-[color-mix(in_srgb,var(--nn-system-accent)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)]"
      aria-labelledby={`section-heading-${section.id}`}
    >
      {/* Section header */}
      <header className="flex items-start gap-3.5 border-b border-[color-mix(in_srgb,var(--nn-system-accent)_12%,var(--semantic-border-soft))] px-5 py-4 sm:px-6">
        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-system-accent)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_8%,var(--semantic-panel-muted))] text-[var(--nn-system-accent)]">
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
            <h2
              id={`section-heading-${section.id}`}
              className="text-[0.95rem] font-semibold tracking-tight text-[var(--theme-heading-text)]"
            >
              {section.label}
            </h2>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-tertiary)]">
              {section.count} lesson{section.count === 1 ? "" : "s"}
            </span>
          </div>
          <p className="mt-0.5 text-[0.8rem] leading-snug text-[var(--theme-muted-text)]">
            {section.description}
          </p>
        </div>
      </header>

      {/* Flat lesson list — all lessons, no collapse */}
      <ul className="flex list-none flex-col divide-y divide-[var(--semantic-border-soft)] p-0">
        {section.lessons.map((lesson, lessonIndex) => {
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
                className="group flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-[color-mix(in_srgb,var(--nn-system-accent)_4%,var(--semantic-panel-muted))] sm:px-6"
              >
                <div className="min-w-0">
                  <p className="text-[0.875rem] font-medium leading-snug text-[var(--theme-heading-text)] group-hover:text-[var(--nn-system-accent)]">
                    {lesson.title}
                  </p>
                  {subtitle ? (
                    <p className="mt-0.5 line-clamp-1 text-[0.75rem] text-[var(--theme-muted-text)]">
                      {subtitle}
                    </p>
                  ) : null}
                  {showLockedState ? (
                    <div className="mt-1.5">
                      <StatusBadge status="locked" size="xs" />
                    </div>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {showProgress ? <PathwayLessonProgressBadge status={progressStatus} /> : null}
                  <ChevronRight className="h-3.5 w-3.5 text-[var(--semantic-text-tertiary)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--nn-system-accent)]" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
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
    <div className="grid gap-4 md:grid-cols-2 xl:gap-5">
      {sections.map((section, sectionIndex) => (
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
