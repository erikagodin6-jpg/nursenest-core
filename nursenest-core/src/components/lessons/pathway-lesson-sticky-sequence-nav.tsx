"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PathwayLessonAdjacentHrefs } from "@/components/lessons/pathway-lesson-sequence-nav";

/**
 * Mobile-only fixed bottom bar echoing the monolith `FixedLessonNav` pattern for pathway lessons.
 * Desktop uses {@link PathwayLessonSequenceNavBar} in the article chrome.
 */
export function PathwayLessonStickySequenceNav({ adjacent }: { adjacent: PathwayLessonAdjacentHrefs }) {
  const { prev, next } = adjacent;
  if (!prev && !next) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-brand)_10%)] bg-[color-mix(in_srgb,var(--theme-page-bg)_96%,var(--nn-presentation-wash)_4%)]/95 py-2.5 shadow-[0_-4px_24px_color-mix(in_srgb,var(--theme-heading-text)_8%,transparent)] backdrop-blur-md md:hidden"
      data-testid="pathway-lesson-sticky-sequence"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4">
        <div className="min-w-0 flex-1">
          {prev ? (
            <Link
              href={prev.href}
              className="inline-flex max-w-full items-center gap-1 text-sm font-medium text-[var(--theme-muted-text)] hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{prev.title}</span>
            </Link>
          ) : (
            <span className="text-sm text-transparent select-none" aria-hidden>
              —
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 text-right">
          {next ? (
            <Link
              href={next.href}
              className="inline-flex max-w-full items-center justify-end gap-1 text-sm font-medium text-[var(--theme-muted-text)] hover:text-primary"
            >
              <span className="truncate">{next.title}</span>
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          ) : (
            <span className="text-sm text-transparent select-none" aria-hidden>
              —
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
