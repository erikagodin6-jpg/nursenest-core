import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PathwayLessonProgressBadge } from "@/components/lessons/pathway-lesson-progress-badge";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

type Props = {
  href: string;
  label: string;
  accentStyle?: CSSProperties;
  showProgress?: boolean;
  status?: PathwayLessonProgressStatus;
};

export function LessonsHubLessonRow({
  href,
  label,
  accentStyle,
  showProgress = false,
  status = "not_started",
}: Props) {
  return (
    <Link
      href={href}
      style={accentStyle}
      className="nn-lessons-hub-lesson-row nn-lessons-hub-lesson-row-h11 group flex min-h-[48px] items-center justify-between gap-3 rounded-xl border border-[color-mix(in_srgb,var(--nn-hub-cat-accent)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-hub-cat-accent)_5%,var(--semantic-surface))] px-4 py-3 text-sm font-medium text-[var(--theme-heading-text)] shadow-[var(--semantic-shadow-soft)] transition-all hover:border-[color-mix(in_srgb,var(--nn-hub-cat-accent)_34%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--nn-hub-cat-accent)_9%,var(--semantic-surface))] hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--nn-hub-cat-accent)_10%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--nn-hub-cat-accent)_45%,transparent)] focus-visible:ring-offset-1 sm:py-3.5"
    >
      <span className="min-w-0 flex-1 leading-snug">{label}</span>
      <span className="flex shrink-0 items-center gap-2">
        {showProgress ? <PathwayLessonProgressBadge status={status} /> : null}
        <ArrowRight
          className="h-4 w-4 text-[var(--theme-muted-text)] transition group-hover:translate-x-0.5 group-hover:text-[var(--nn-hub-cat-accent)]"
          aria-hidden
        />
      </span>
    </Link>
  );
}
