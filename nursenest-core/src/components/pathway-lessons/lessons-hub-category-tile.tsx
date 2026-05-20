import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryProgressBar } from "@/components/pathway-lessons/category-progress-bar";

type Props = {
  href: string;
  title: string;
  description?: string | null;
  lessonCount: number;
  accentStyle: CSSProperties;
  icon: ReactNode;
  isEmpty?: boolean;
  isExamCritical?: boolean;
  showProgress?: boolean;
  percentComplete?: number;
  completedCount?: number;
  inProgressCount?: number;
  totalCount?: number;
};

/**
 * H11 hub category tile — vertical card, top accent bar, lesson count + progress, open affordance.
 */
export function LessonsHubCategoryTile({
  href,
  title,
  description,
  lessonCount,
  accentStyle,
  icon,
  isEmpty = false,
  isExamCritical = false,
  showProgress = false,
  percentComplete = 0,
  completedCount = 0,
  inProgressCount = 0,
  totalCount = 0,
}: Props) {
  const cardClass = [
    "nn-hub-category-tile group relative flex min-h-[8.75rem] flex-col rounded-2xl border px-5 py-5 text-left transition-all",
    "border-[color-mix(in_srgb,var(--nn-hub-cat-accent)_18%,var(--semantic-border-soft))]",
    "bg-[color-mix(in_srgb,var(--nn-hub-cat-accent)_5%,var(--semantic-surface))]",
    "hover:border-[color-mix(in_srgb,var(--nn-hub-cat-accent)_34%,var(--semantic-border-soft))]",
    "hover:bg-[color-mix(in_srgb,var(--nn-hub-cat-accent)_9%,var(--semantic-surface))]",
    "hover:shadow-[0_8px_28px_color-mix(in_srgb,var(--nn-hub-cat-accent)_12%,transparent)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--nn-hub-cat-accent)_50%,transparent)] focus-visible:ring-offset-2",
    isExamCritical ? "nn-hub-category-card--exam-critical" : "",
    isEmpty ? "nn-hub-category-card--empty pointer-events-none" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const metaLabel = showProgress
    ? `${percentComplete}% complete`
    : `${lessonCount.toLocaleString()} ${lessonCount === 1 ? "lesson" : "lessons"}`;

  return (
    <Link
      href={href}
      style={accentStyle}
      className={cardClass}
      aria-disabled={isEmpty || undefined}
      data-testid="hub-category-tile"
    >
      <span
        className="mb-3 block h-1 w-12 shrink-0 rounded-full bg-[var(--nn-hub-cat-accent)]"
        aria-hidden
      />
      <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--nn-hub-cat-accent)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-hub-cat-accent)_10%,var(--semantic-panel-muted))] text-[var(--nn-hub-cat-accent)]">
        {icon}
      </span>
      <span className="text-base font-bold leading-snug text-[var(--theme-heading-text)] transition-colors group-hover:text-[var(--nn-hub-cat-accent)]">
        {title}
      </span>
      {description ? (
        <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--theme-muted-text)]">
          {description}
        </span>
      ) : (
        <span className="mt-1.5 text-xs text-[var(--theme-muted-text)]">
          {lessonCount.toLocaleString()} structured lessons
        </span>
      )}
      <span className="mt-auto flex items-center justify-between gap-2 pt-4 text-[11px] font-medium text-[var(--theme-muted-text)]">
        <span>{metaLabel}</span>
        <span className="inline-flex items-center gap-0.5 font-bold text-[var(--nn-hub-cat-accent)]">
          Open
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
        </span>
      </span>
      {showProgress && totalCount > 0 ? (
        <CategoryProgressBar
          completedCount={completedCount}
          inProgressCount={inProgressCount}
          totalCount={totalCount}
        />
      ) : null}
    </Link>
  );
}
