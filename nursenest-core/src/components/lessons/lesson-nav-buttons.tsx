import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type NextLesson = {
  title: string;
  href: string;
};

type Props = {
  position: "top" | "bottom";
  backHref: string;
  backLabel: string;
  nextLesson?: NextLesson | null;
};

/**
 * Previous / next lesson navigation.
 * position="top" — compact back link only, minimal footprint.
 * position="bottom" — full row with back and next buttons.
 */
export function LessonNavButtons({ position, backHref, backLabel, nextLesson }: Props) {
  if (position === "top") {
    return (
      <div className="mb-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:underline"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {backLabel}
        </Link>
      </div>
    );
  }

  // Bottom: full nav row
  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6"
      style={{ borderColor: "var(--semantic-border-soft)" }}
      aria-label="Lesson navigation"
    >
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-opacity-60"
        style={{
          borderColor: "var(--semantic-border-soft)",
          color: "var(--semantic-text-secondary)",
          background: "var(--semantic-surface)",
        }}
      >
        <ArrowLeft className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        {backLabel}
      </Link>

      {nextLesson ? (
        <Link
          href={nextLesson.href}
          className="inline-flex max-w-xs items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            background: "var(--semantic-brand)",
            color: "#fff",
          }}
        >
          <span className="min-w-0 truncate">
            {nextLesson.title}
          </span>
          <ArrowRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        </Link>
      ) : null}
    </nav>
  );
}
