import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Baby,
  Brain,
  HeartPulse,
  MessageSquare,
  Pill,
  Shield,
  Sparkles,
  Stethoscope,
  Timer,
  Users,
  Wind,
} from "lucide-react";
import { CategoryProgressBar } from "@/components/pathway-lessons/category-progress-bar";
import {
  lessonDifficultyLabel,
  lessonEstimatedDurationLabel,
} from "@/components/pathway-lessons/lesson-board-metadata";
import { LessonRow } from "@/components/pathway-lessons/lesson-row";
import { pathwayLessonYieldLabel } from "@/lib/lessons/pathway-lesson-yield";
import type {
  PathwayLessonSystemLabel,
  PathwayLessonSystemSection,
} from "@/lib/lessons/pathway-lesson-body-system-groups";
import { pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

type SystemVisual = {
  icon: LucideIcon;
  accentVar: string;
};

const SYSTEM_VISUALS: Record<PathwayLessonSystemLabel, SystemVisual> = {
  cardiovascular: { icon: HeartPulse, accentVar: "--semantic-danger" },
  respiratory: { icon: Wind, accentVar: "--semantic-info" },
  neurological: { icon: Brain, accentVar: "--semantic-chart-2" },
  "vital-signs": { icon: Timer, accentVar: "--semantic-chart-3" },
  "clinical-deterioration": { icon: AlertTriangle, accentVar: "--semantic-warning" },
  pharmacology: { icon: Pill, accentVar: "--semantic-brand" },
  "infection-immunity": { icon: Shield, accentVar: "--semantic-success" },
  "maternal-newborn": { icon: Baby, accentVar: "--semantic-chart-5" },
  pediatrics: { icon: Sparkles, accentVar: "--semantic-chart-1" },
  "mental-health": { icon: Brain, accentVar: "--semantic-chart-4" },
  "special-populations": { icon: Users, accentVar: "--semantic-chart-5" },
  communication: { icon: MessageSquare, accentVar: "--semantic-chart-4" },
  safety: { icon: Shield, accentVar: "--semantic-warning" },
  fundamentals: { icon: Stethoscope, accentVar: "--semantic-chart-1" },
};

type Props = {
  section: PathwayLessonSystemSection;
  lessonsBasePath: string;
  progressMap: Record<string, PathwayLessonProgressStatus>;
  showProgress: boolean;
  defaultVisibleRows?: number;
};

export function LessonSystemCard({
  section,
  lessonsBasePath,
  progressMap,
  showProgress,
  defaultVisibleRows = 5,
}: Props) {
  const visual = SYSTEM_VISUALS[section.systemLabel] ?? { icon: Activity, accentVar: "--semantic-brand" };
  const Icon = visual.icon;
  const systemStyle = { "--nn-system-accent": `var(${visual.accentVar})` } as CSSProperties;
  const visibleLessons = section.lessons.slice(0, defaultVisibleRows);
  const overflowLessons = section.lessons.slice(defaultVisibleRows);
  const completedCount = showProgress
    ? section.lessons.filter((lesson) => progressMap[lesson.slug] === "completed").length
    : 0;
  const inProgressCount = showProgress
    ? section.lessons.filter((lesson) => progressMap[lesson.slug] === "in_progress").length
    : 0;

  return (
    <section
      id={section.id}
      style={systemStyle}
      className="rounded-[1.5rem] border border-[color-mix(in_srgb,var(--nn-system-accent)_16%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-5"
      aria-labelledby={`lesson-system-card-${section.id}`}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-system-accent)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_9%,var(--semantic-panel-muted))] text-[var(--nn-system-accent)]">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h2
              id={`lesson-system-card-${section.id}`}
              className="truncate text-base font-semibold text-[var(--theme-heading-text)]"
            >
              {section.label}
            </h2>
            <span className="shrink-0 text-xs font-semibold text-[var(--theme-muted-text)]">
              {completedCount}/{section.count}
            </span>
          </div>
          <CategoryProgressBar
            completedCount={completedCount}
            inProgressCount={inProgressCount}
            totalCount={section.count}
          />
        </div>
      </div>

      <div className="mt-3.5 space-y-1">
        {visibleLessons.map((lesson) => {
          const href = pathwayLessonMarketingDetailHref(lessonsBasePath, lesson.slug);
          if (!href) return null;

          return (
            <LessonRow
              key={lesson.slug}
              href={href}
              title={lesson.title}
              progressStatus={showProgress ? (progressMap[lesson.slug] ?? "not_started") : "not_started"}
              yieldBadgeLabel={pathwayLessonYieldLabel(lesson.activeExamMeta?.yieldLevel)}
              durationLabel={lessonEstimatedDurationLabel(lesson)}
              difficulty={lessonDifficultyLabel(lesson)}
            />
          );
        })}
      </div>

      {overflowLessons.length > 0 ? (
        <details className="mt-2 group">
          <summary className="cursor-pointer list-none rounded-lg px-3 py-2 text-sm font-medium text-[var(--semantic-brand)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]">
            <span className="group-open:hidden">+{overflowLessons.length} more</span>
            <span className="hidden group-open:inline">Show less</span>
          </summary>
          <div className="mt-1 space-y-1">
            {overflowLessons.map((lesson) => {
              const href = pathwayLessonMarketingDetailHref(lessonsBasePath, lesson.slug);
              if (!href) return null;

              return (
                <LessonRow
                  key={lesson.slug}
                  href={href}
                  title={lesson.title}
                  progressStatus={showProgress ? (progressMap[lesson.slug] ?? "not_started") : "not_started"}
                  yieldBadgeLabel={pathwayLessonYieldLabel(lesson.activeExamMeta?.yieldLevel)}
                  durationLabel={lessonEstimatedDurationLabel(lesson)}
                  difficulty={lessonDifficultyLabel(lesson)}
                />
              );
            })}
          </div>
        </details>
      ) : null}
    </section>
  );
}
