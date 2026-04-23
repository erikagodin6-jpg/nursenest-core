import type { CSSProperties } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Baby,
  BookOpen,
  Brain,
  Briefcase,
  ClipboardList,
  HeartPulse,
  MessageSquare,
  Pill,
  Scale,
  Shield,
  Sparkles,
  Stethoscope,
  Timer,
  Users,
  Wind,
} from "lucide-react";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";
import { CategoryProgressBar } from "@/components/pathway-lessons/category-progress-bar";
import {
  lessonDifficultyLabel,
  lessonEstimatedDurationLabel,
} from "@/components/pathway-lessons/lesson-board-metadata";
import { LessonRow } from "@/components/pathway-lessons/lesson-row";
import { pathwayLessonYieldLabel } from "@/lib/lessons/pathway-lesson-yield";
import type {
  PathwayLessonSystemSection,
} from "@/lib/lessons/pathway-lesson-body-system-groups";
import { pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

const LESSON_SYSTEM_PREVIEW = 12;

type SystemVisual = {
  icon: LucideIcon;
  accentVar: string;
};

const SYSTEM_VISUALS: Record<string, SystemVisual> = {
  cardiovascular: { icon: HeartPulse, accentVar: "--semantic-danger" },
  respiratory: { icon: Wind, accentVar: "--semantic-info" },
  neurology: { icon: Brain, accentVar: "--semantic-chart-2" },
  neurological: { icon: Brain, accentVar: "--semantic-chart-2" },
  endocrine: { icon: Activity, accentVar: "--semantic-chart-3" },
  gastrointestinal: { icon: Sparkles, accentVar: "--semantic-chart-5" },
  "renal-genitourinary": { icon: Timer, accentVar: "--semantic-chart-3" },
  renal_genitourinary: { icon: Timer, accentVar: "--semantic-chart-3" },
  musculoskeletal: { icon: Activity, accentVar: "--semantic-chart-2" },
  "hematology-oncology": { icon: HeartPulse, accentVar: "--semantic-danger" },
  hematology_oncology: { icon: HeartPulse, accentVar: "--semantic-danger" },
  "immune-infectious": { icon: AlertTriangle, accentVar: "--semantic-warning" },
  immune_infectious: { icon: AlertTriangle, accentVar: "--semantic-warning" },
  dermatology: { icon: Sparkles, accentVar: "--semantic-chart-1" },
  integumentary: { icon: Sparkles, accentVar: "--semantic-chart-1" },
  "reproductive-ob-gyn": { icon: Baby, accentVar: "--semantic-chart-5" },
  reproductive_obstetrics: { icon: Baby, accentVar: "--semantic-chart-5" },
  pharmacology: { icon: Pill, accentVar: "--semantic-brand" },
  cardiovascular_drugs: { icon: Pill, accentVar: "--semantic-danger" },
  cns_drugs: { icon: Pill, accentVar: "--semantic-chart-4" },
  endocrine_drugs: { icon: Pill, accentVar: "--semantic-chart-3" },
  anti_infectives: { icon: Pill, accentVar: "--semantic-warning" },
  pain_sedation: { icon: Pill, accentVar: "--semantic-info" },
  pediatrics: { icon: Sparkles, accentVar: "--semantic-chart-1" },
  "mental-health": { icon: Brain, accentVar: "--semantic-chart-4" },
  "professional-practice-ethics": { icon: MessageSquare, accentVar: "--semantic-chart-4" },
  ethics: { icon: MessageSquare, accentVar: "--semantic-chart-4" },
  legal_regulation: { icon: Scale, accentVar: "--semantic-chart-4" },
  documentation: { icon: ClipboardList, accentVar: "--semantic-chart-3" },
  communication: { icon: Users, accentVar: "--semantic-info" },
  scope_of_practice: { icon: Shield, accentVar: "--semantic-chart-2" },
  delegation_supervision: { icon: Briefcase, accentVar: "--semantic-chart-2" },
  leadership_management: { icon: Briefcase, accentVar: "--semantic-chart-5" },
  patient_safety_quality: { icon: AlertTriangle, accentVar: "--semantic-warning" },
  test_taking: { icon: BookOpen, accentVar: "--semantic-brand" },
  study_strategy: { icon: BookOpen, accentVar: "--semantic-chart-1" },
  fundamentals: { icon: Stethoscope, accentVar: "--semantic-chart-1" },
  [REVIEW_REQUIRED]: { icon: AlertTriangle, accentVar: "--semantic-warning" },
};

type Props = {
  section: PathwayLessonSystemSection;
  lessonsBasePath: string;
  progressMap: Record<string, PathwayLessonProgressStatus>;
  showProgress: boolean;
};

export function LessonSystemCard({
  section,
  lessonsBasePath,
  progressMap,
  showProgress,
}: Props) {
  const visual = SYSTEM_VISUALS[section.systemLabel] ?? { icon: Activity, accentVar: "--semantic-brand" };
  const Icon = visual.icon;
  const systemStyle = { "--nn-system-accent": `var(${visual.accentVar})` } as CSSProperties;
  const completedCount = showProgress
    ? section.lessons.filter((lesson) => progressMap[lesson.slug] === "completed").length
    : 0;
  const inProgressCount = showProgress
    ? section.lessons.filter((lesson) => progressMap[lesson.slug] === "in_progress").length
    : 0;
  const previewLessons = section.lessons.slice(0, LESSON_SYSTEM_PREVIEW);
  const hiddenLessonCount = Math.max(0, section.lessons.length - previewLessons.length);

  return (
    <section
      id={section.id}
      style={systemStyle}
      className="nn-lesson-system-card rounded-[1.35rem] border border-[color-mix(in_srgb,var(--nn-system-accent)_16%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-3.5 sm:p-4"
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
              className="line-clamp-2 text-base font-semibold leading-snug text-[var(--theme-heading-text)]"
            >
              {section.label}
            </h2>
            <span className="shrink-0 text-xs font-semibold text-[var(--theme-muted-text)]">
              {showProgress ? (
                <>
                  {completedCount} of {section.count} completed
                </>
              ) : (
                <>{section.count} lessons</>
              )}
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
        {previewLessons.map((lesson) => {
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
        {hiddenLessonCount > 0 ? (
          <div className="pt-1">
            <Link
              href={`${lessonsBasePath}#pathway-lesson-library`}
              className="inline-flex text-xs font-semibold text-primary underline-offset-2 hover:underline"
            >
              View all {section.count} lessons in library
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
