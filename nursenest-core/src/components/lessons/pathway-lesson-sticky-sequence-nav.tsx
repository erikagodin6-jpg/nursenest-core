"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PathwayLessonAdjacentHrefs } from "@/components/lessons/pathway-lesson-sequence-nav";

const pill =
  "inline-flex min-h-10 min-w-0 max-w-[48%] flex-1 flex-col items-stretch justify-center gap-0.5 rounded-lg border px-2.5 py-1.5 text-left text-xs font-semibold sm:text-sm";

const pillLinkStart =
  `${pill} border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-brand)_12%)] bg-[color-mix(in_srgb,var(--bg-card)_92%,var(--semantic-panel-muted)_8%)] text-[var(--theme-heading-text)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_25%,var(--semantic-border-soft))]`;

const pillLinkEnd =
  `${pill} items-end border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-brand)_12%)] bg-[color-mix(in_srgb,var(--bg-card)_92%,var(--semantic-panel-muted)_8%)] text-right text-[var(--theme-heading-text)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_25%,var(--semantic-border-soft))]`;

const pillDisabled = `${pill} cursor-not-allowed border-[var(--semantic-border-soft)] opacity-55`;

const pillDisabledEnd = `${pill} items-end cursor-not-allowed border-[var(--semantic-border-soft)] text-right opacity-55`;

/**
 * Mobile fixed bottom bar for pathway lesson prev/next. Desktop uses {@link PathwayLessonSequenceNavBar}.
 */
export function PathwayLessonStickySequenceNav({
  adjacent,
  previousLessonLabel = "Previous lesson",
  nextLessonLabel = "Next lesson",
}: {
  adjacent: PathwayLessonAdjacentHrefs;
  previousLessonLabel?: string;
  nextLessonLabel?: string;
}) {
  const { prev, next } = adjacent;
  if (!prev && !next) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-brand)_10%)] bg-[color-mix(in_srgb,var(--theme-page-bg)_96%,var(--nn-presentation-wash)_4%)]/95 py-2.5 shadow-[0_-4px_24px_color-mix(in_srgb,var(--theme-heading-text)_8%,transparent)] backdrop-blur-md md:hidden"
      data-testid="pathway-lesson-sticky-sequence"
    >
      <div className="mx-auto flex max-w-6xl items-stretch justify-between gap-2 px-3">
        <div className="min-w-0 flex-1">
          {prev ? (
            <Link href={prev.href} className={`group ${pillLinkStart}`} aria-label={`${previousLessonLabel}: ${prev.title}`}>
              <span className="inline-flex items-center gap-1">
                <ChevronLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">{previousLessonLabel}</span>
              </span>
              <span className="truncate text-[0.65rem] font-normal text-[var(--theme-muted-text)]">{prev.title}</span>
            </Link>
          ) : (
            <span className={pillDisabled} aria-disabled="true">
              <span className="inline-flex items-center gap-1">
                <ChevronLeft className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
                <span className="truncate">{previousLessonLabel}</span>
              </span>
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          {next ? (
            <Link href={next.href} className={`group ${pillLinkEnd}`} aria-label={`${nextLessonLabel}: ${next.title}`}>
              <span className="inline-flex items-center gap-1">
                <span className="truncate">{nextLessonLabel}</span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
              </span>
              <span className="truncate text-[0.65rem] font-normal text-[var(--theme-muted-text)]">{next.title}</span>
            </Link>
          ) : (
            <span className={pillDisabledEnd} aria-disabled="true">
              <span className="inline-flex items-center gap-1">
                <span className="truncate">{nextLessonLabel}</span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
