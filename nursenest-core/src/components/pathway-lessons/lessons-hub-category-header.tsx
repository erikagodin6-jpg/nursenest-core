import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CategoryProgressBar } from "@/components/pathway-lessons/category-progress-bar";

type ProgressSnapshot = {
  percentComplete: number;
  completedCount: number;
  inProgressCount: number;
  totalCount: number;
};

type Props = {
  title: string;
  description?: string | null;
  lessonCount: number;
  hubHref: string;
  accentStyle: CSSProperties;
  icon: ReactNode;
  progress?: ProgressSnapshot | null;
};

export function LessonsHubCategoryHeader({
  title,
  description,
  lessonCount,
  hubHref,
  accentStyle,
  icon,
  progress,
}: Props) {
  return (
    <header
      className="nn-lessons-hub-category-header mb-6 border-b border-[var(--semantic-border-soft)] pb-6 sm:mb-8 sm:pb-8"
      style={accentStyle}
    >
      <Link
        href={hubHref}
        className="mb-4 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-semibold text-[var(--theme-muted-text)] transition hover:text-[var(--nn-hub-cat-accent)] sm:mb-5"
      >
        <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
        All categories
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <span className="mb-3 block h-1 w-12 rounded-full bg-[var(--nn-hub-cat-accent)]" aria-hidden />
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-hub-cat-accent)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-hub-cat-accent)_10%,var(--semantic-panel-muted))] text-[var(--nn-hub-cat-accent)] sm:h-11 sm:w-11">
              {icon}
            </span>
            <div className="min-w-0">
              <h2 id="lesson-category-heading" className="nn-marketing-h3 text-[var(--theme-heading-text)]">
                {title}
              </h2>
              {description ? (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--theme-muted-text)]">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <span className="inline-flex h-fit shrink-0 items-center gap-1.5 self-start rounded-full border border-[color-mix(in_srgb,var(--nn-hub-cat-accent)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-hub-cat-accent)_6%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
          <span className="font-bold text-[var(--nn-hub-cat-accent)]">{lessonCount.toLocaleString()}</span>
          {lessonCount === 1 ? "lesson" : "lessons"}
        </span>
      </div>

      {progress ? (
        <div className="mt-5 max-w-xl">
          <p className="text-xs text-[var(--theme-muted-text)]">
            <span className="font-semibold text-[var(--theme-heading-text)]">
              {progress.percentComplete}% complete
            </span>
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline" aria-hidden="true">
              {progress.completedCount.toLocaleString()}/{progress.totalCount.toLocaleString()} in this area
            </span>
          </p>
          <CategoryProgressBar
            completedCount={progress.completedCount}
            inProgressCount={progress.inProgressCount}
            totalCount={Math.max(progress.totalCount, 1)}
          />
        </div>
      ) : null}
    </header>
  );
}
