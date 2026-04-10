import Link from "next/link";
import type { ReactNode } from "react";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { PathwayLessonProgressBadge } from "@/components/lessons/pathway-lesson-progress-badge";
import { MetaRow, StatusBadge } from "@/components/ui/study-card";
import type { CardMetaItem, CardStatus } from "@/components/ui/study-card";

export type LessonCardChipVariant = "category" | "pathway" | "exam" | "body" | "neutral";

/**
 * Small metadata pill for lesson / pathway surfaces — category, exam scope, body system, etc.
 */
export function LessonCardChip({
  variant,
  children,
  className = "",
}: {
  variant: LessonCardChipVariant;
  children: ReactNode;
  className?: string;
}) {
  const base =
    "inline-flex max-w-full items-center truncate rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide";
  const styles: Record<LessonCardChipVariant, string> = {
    category:
      "border-[color-mix(in_srgb,var(--semantic-info)_26%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] text-[var(--semantic-info-contrast)]",
    pathway:
      "border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] text-[var(--semantic-text-primary)]",
    exam:
      "border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] text-[var(--semantic-success-contrast)]",
    body:
      "border-[color-mix(in_srgb,var(--semantic-warning)_24%,var(--semantic-border-soft))] bg-[var(--semantic-panel-warm)] text-[var(--semantic-warning-contrast)]",
    neutral:
      "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-secondary)]",
  };
  return <span className={`${base} ${styles[variant]} ${className}`}>{children}</span>;
}

/**
 * Pathway / app lesson row — soft card, optional metadata chips, optional completion state.
 *
 * Uses `MetaRow` and `StatusBadge` from the shared StudyCard system so chips and badges
 * stay visually consistent across marketing and app surfaces.
 */
export function LessonCard({
  title,
  href,
  summary,
  chips,
  meta,
  footer,
  status,
  progressStatus,
}: {
  title: ReactNode;
  href: string;
  summary?: ReactNode;
  chips?: ReactNode;
  /** Structured meta items (e.g. topic, estimated time). Renders via MetaRow for consistency. */
  meta?: CardMetaItem[];
  footer?: ReactNode;
  /** Status badge from the shared StatusBadge component (free, premium, completed, etc.). */
  status?: CardStatus;
  /** When set, shows progress badge and a subtle left accent on the card. */
  progressStatus?: PathwayLessonProgressStatus;
}) {
  const statusAccent =
    progressStatus === "completed"
      ? "border-l-[3px] border-l-[var(--role-success)] nn-card--completed"
      : progressStatus === "in_progress"
        ? "border-l-[3px] border-l-[color-mix(in_srgb,var(--semantic-brand)_70%,var(--semantic-border-soft))]"
        : "";

  return (
    <article
      className={`nn-card overflow-hidden border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-[var(--theme-primary)]/40 ${statusAccent}`}
    >
      {/* Header row: chips, meta row, and status/progress badges */}
      {chips || meta || progressStatus || status ? (
        <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            {chips ? <div className="flex flex-wrap gap-1.5">{chips}</div> : null}
            {meta && meta.length > 0 ? <MetaRow items={meta} /> : null}
          </div>
          <div className="flex shrink-0 flex-wrap gap-1.5">
            {status ? <StatusBadge status={status} size="xs" /> : null}
            {progressStatus ? <PathwayLessonProgressBadge status={progressStatus} /> : null}
          </div>
        </div>
      ) : null}

      <h2 className="font-semibold text-[var(--semantic-text-primary)]">
        <Link href={href} className="hover:text-[var(--semantic-brand)] hover:underline">
          {title}
        </Link>
      </h2>
      {summary ? <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{summary}</p> : null}
      {footer ? <div className="mt-3">{footer}</div> : null}
    </article>
  );
}

// Re-export shared types so callers can stay on a single import path
export type { CardMetaItem, CardStatus };
