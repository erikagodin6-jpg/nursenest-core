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
  Wind,
} from "lucide-react";
import { LessonBubble } from "@/components/pathway-lessons/lesson-bubble";
import type {
  PathwayLessonSystemSection,
} from "@/lib/lessons/pathway-lesson-body-system-groups";
import {
  pathwayLessonMarketingDetailHref,
} from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

type SystemVisual = {
  icon: LucideIcon;
  accentVar: string;
};

const SYSTEM_VISUALS: Record<string, SystemVisual> = {
  cardiovascular: { icon: HeartPulse, accentVar: "--semantic-danger" },
  respiratory: { icon: Wind, accentVar: "--semantic-info" },
  neurological: { icon: Brain, accentVar: "--semantic-chart-2" },
  endocrine: { icon: Activity, accentVar: "--semantic-chart-3" },
  gi: { icon: Sparkles, accentVar: "--semantic-chart-5" },
  renal: { icon: Timer, accentVar: "--semantic-chart-3" },
  pharmacology: { icon: Pill, accentVar: "--semantic-brand" },
  "maternal-newborn": { icon: Baby, accentVar: "--semantic-chart-5" },
  pediatrics: { icon: Sparkles, accentVar: "--semantic-chart-1" },
  "mental-health": { icon: Brain, accentVar: "--semantic-chart-4" },
  "prioritization-safety": { icon: AlertTriangle, accentVar: "--semantic-warning" },
  "assessment-triage": { icon: AlertTriangle, accentVar: "--semantic-warning" },
  "diagnostics-monitoring": { icon: Timer, accentVar: "--semantic-chart-3" },
  "interventions-procedures": { icon: Activity, accentVar: "--semantic-chart-2" },
  "pharmacology-medication-safety": { icon: Pill, accentVar: "--semantic-brand" },
  "communication-teamwork": { icon: MessageSquare, accentVar: "--semantic-chart-4" },
  "professional-safety": { icon: Shield, accentVar: "--semantic-warning" },
  fundamentals: { icon: Stethoscope, accentVar: "--semantic-chart-1" },
  foundations: { icon: Stethoscope, accentVar: "--semantic-chart-1" },
};

export function SystemSection({
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
      className="rounded-[1.9rem] border border-[color-mix(in_srgb,var(--nn-system-accent)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
      aria-labelledby={`section-heading-${section.id}`}
    >
      <header className="flex min-w-0 items-start gap-3.5">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--nn-system-accent)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_9%,var(--semantic-panel-muted))] text-[var(--nn-system-accent)]">
            <Icon className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2
              id={`section-heading-${section.id}`}
              className="text-xl font-semibold tracking-tight text-[var(--theme-heading-text)]"
            >
              {section.label}
            </h2>
          </div>
      </header>

      <ul className="mt-4 grid list-none gap-3 p-0 sm:grid-cols-2 xl:grid-cols-3">
        {section.lessons.map((lesson, lessonIndex) => {
          const href = pathwayLessonMarketingDetailHref(lessonsBasePath, lesson.slug);
          if (!href) return null;

          return (
            <li
              key={lesson.slug}
              data-nn-qa-primary-lesson={sectionIndex === 0 && lessonIndex === 0 ? "true" : undefined}
            >
              <LessonBubble
                href={href}
                title={lesson.title}
                progressStatus={progressMap[lesson.slug] ?? "not_started"}
                showProgress={showProgress}
                showLockedState={showLockedState}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
