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
 * Previous / next lesson navigation controls.
 * position="top" — compact back link with a subtle pill-style treatment.
 * position="bottom" — full nav row with back button and optional next lesson CTA.
 */
export function LessonNavButtons({ position, backHref, backLabel, nextLesson }: Props) {
  if (position === "top") {
    return (
      <div className="mb-7">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-80"
          style={{
            borderColor: "var(--border-subtle)",
            color: "var(--semantic-text-muted)",
            background: "var(--bg-card)",
          }}
        >
          <ArrowLeft className="h-3 w-3" aria-hidden="true" />
          {backLabel}
        </Link>
      </div>
    );
  }

  // Bottom: full nav row
  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t pt-7"
      style={{ borderColor: "color-mix(in srgb, var(--theme-primary) 14%, var(--border-subtle))" }}
      aria-label="Lesson navigation"
    >
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:opacity-80"
        style={{
          borderColor: "var(--border-subtle)",
          color: "var(--semantic-text-secondary)",
          background: "var(--bg-card)",
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
            background: "color-mix(in srgb, var(--theme-primary) 90%, var(--semantic-brand))",
            color: "#fff",
          }}
        >
          <span className="min-w-0 truncate">{nextLesson.title}</span>
          <ArrowRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        </Link>
      ) : null}
    </nav>
  );
}
