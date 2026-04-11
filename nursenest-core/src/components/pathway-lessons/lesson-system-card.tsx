"use client";

import { useMemo, useState, type CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
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
import { LessonRow } from "@/components/pathway-lessons/lesson-row";
import type { PathwayLessonBoardSection } from "@/lib/lessons/pathway-lesson-board";
import type { PathwayLessonBoardIconKey } from "@/lib/lessons/pathway-lesson-board-config";
import { pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";

const ICONS: Record<PathwayLessonBoardIconKey, LucideIcon> = {
  activity: Activity,
  baby: Baby,
  brain: Brain,
  "heart-pulse": HeartPulse,
  "message-square": MessageSquare,
  pill: Pill,
  shield: Shield,
  sparkles: Sparkles,
  stethoscope: Stethoscope,
  timer: Timer,
  users: Users,
  wind: Wind,
};

export function LessonSystemCard({
  section,
  lessonsBasePath,
  showLockedState,
  sectionIndex,
}: {
  section: PathwayLessonBoardSection;
  lessonsBasePath: string;
  showLockedState: boolean;
  sectionIndex: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICONS[section.icon] ?? Activity;
  const cardStyle = useMemo(
    () =>
      ({
        "--nn-board-accent": `var(${section.accentVar})`,
      }) as CSSProperties,
    [section.accentVar],
  );
  const rows = expanded ? section.rows : section.visibleRows;

  return (
    <section
      style={cardStyle}
      className="rounded-[1.6rem] border border-[color-mix(in_srgb,var(--nn-board-accent)_14%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-5"
      aria-labelledby={`lesson-system-card-${section.id}`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--nn-board-accent)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-board-accent)_9%,var(--semantic-panel-muted))] text-[var(--nn-board-accent)]">
              <Icon className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2
                id={`lesson-system-card-${section.id}`}
                className="truncate text-base font-semibold tracking-tight text-[var(--theme-heading-text)]"
              >
                {section.label}
              </h2>
              <p className="text-xs font-medium text-[var(--semantic-text-secondary)]">
                {section.completedCount}/{section.totalCount} complete
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-3">
        <CategoryProgressBar value={section.progressPercent} />
      </div>

      <ul className="mt-4 space-y-2.5">
        {rows.map((row, rowIndex) => {
          const href = pathwayLessonMarketingDetailHref(lessonsBasePath, row.slug);
          if (!href) return null;
          return (
            <li key={row.slug} data-nn-qa-primary-lesson={sectionIndex === 0 && rowIndex === 0 ? "true" : undefined}>
              <LessonRow href={href} row={row} showLockedState={showLockedState} />
            </li>
          );
        })}
      </ul>

      {section.overflowCount > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 inline-flex min-h-10 items-center rounded-full border border-[color-mix(in_srgb,var(--nn-board-accent)_16%,var(--semantic-border-soft))] px-3.5 text-xs font-semibold text-[var(--theme-heading-text)] transition hover:bg-[color-mix(in_srgb,var(--nn-board-accent)_8%,var(--semantic-panel-muted))]"
        >
          {expanded ? "Show less" : `Show more (${section.overflowCount})`}
        </button>
      ) : null}
    </section>
  );
}
