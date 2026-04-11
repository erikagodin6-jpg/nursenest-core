import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";
import type { PathwayLessonBoardRow } from "@/lib/lessons/pathway-lesson-board";

function markerClass(status: PathwayLessonBoardRow["status"]): string {
  if (status === "completed") return "bg-[var(--semantic-success)]";
  if (status === "in_progress") return "bg-[var(--semantic-brand)]";
  return "bg-[var(--semantic-border-soft)]";
}

function difficultyClass(label: string): string {
  if (label === "Advanced") return "nn-badge-semantic-warning";
  if (label === "Core") return "nn-badge-semantic-info";
  return "nn-badge-semantic-success";
}

export function LessonRow({
  href,
  row,
  showLockedState,
}: {
  href: string;
  row: PathwayLessonBoardRow;
  showLockedState: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--nn-board-accent)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-board-accent)_4%,var(--semantic-surface))] px-3.5 py-3 transition hover:border-[color-mix(in_srgb,var(--nn-board-accent)_22%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--nn-board-accent)_7%,var(--semantic-panel-muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--nn-board-accent)_24%,transparent)]"
    >
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${markerClass(row.status)}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[var(--theme-heading-text)]">{row.title}</p>
      </div>
      <div className="hidden items-center gap-2 sm:flex">
        <span className="text-[11px] font-medium text-[var(--semantic-text-secondary)]">{row.durationLabel}</span>
        <span className={difficultyClass(row.difficultyLabel)}>{row.difficultyLabel}</span>
      </div>
      {showLockedState ? (
        <Lock className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-text-muted)]" aria-hidden />
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--nn-board-accent)]" aria-hidden />
      )}
    </Link>
  );
}
