"use client";

import type { ReactNode } from "react";
import { FlashcardRichContent, flashcardTextMayContainMarkup } from "@/components/flashcards/flashcard-rich-content";
import type { PracticeLinearRightColumnPhase } from "@/lib/practice-tests/practice-linear-right-column-phase";

export type PracticeTestLinearRightColumnLabels = {
  clinicalReferenceHeading: string;
  clinicalReferenceEmpty: string;
  tutorHintBeforeSubmit: string;
};

type PracticeTestLinearRightColumnProps = {
  phase: PracticeLinearRightColumnPhase;
  clinicalImageSrc: string | null;
  labels: PracticeTestLinearRightColumnLabels;
  /** Shown after submit when `phase === "post_submit"` — use {@link PracticeRationaleFullPanel} from the runner. */
  rationaleSlot: ReactNode;
};

/**
 * Right column for linear practice **tutor / review** inside the CAT exam shell — mirrors the flashcard
 * exam board reference column + dashed pre-submit hint, then swaps to the shared rationale stack.
 * Does not render MCQ rows (those stay {@link AnswerOptionRow} in the question well).
 */
export function PracticeTestLinearRightColumn({
  phase,
  clinicalImageSrc,
  labels,
  rationaleSlot,
}: PracticeTestLinearRightColumnProps) {
  return (
    <aside className="flex min-h-0 min-w-0 flex-col gap-4 overflow-y-auto border-t border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] pt-4 lg:border-l lg:border-t-0 lg:pt-0 lg:pl-4">
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-text-primary))] bg-[var(--semantic-surface)] p-4 shadow-sm sm:p-5">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
          {labels.clinicalReferenceHeading}
        </p>
        <div className="mt-4 flex min-h-[12rem] items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-text-primary))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_28%,var(--semantic-surface))] p-4">
          {clinicalImageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- stems may reference CDN URLs from trusted exam content
            <img
              src={clinicalImageSrc}
              alt=""
              className="max-h-[min(42vh,22rem)] w-auto max-w-full object-contain"
            />
          ) : (
            <p className="max-w-xs text-center text-xs leading-relaxed text-[var(--semantic-text-muted)]">
              {labels.clinicalReferenceEmpty}
            </p>
          )}
        </div>
      </div>

      {phase === "post_submit" ? (
        <div className="min-h-0 flex-1">{rationaleSlot}</div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--semantic-border-soft)_95%,var(--semantic-text-primary))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] p-5 text-center text-sm text-[var(--semantic-text-muted)]">
          {flashcardTextMayContainMarkup(labels.tutorHintBeforeSubmit) ? (
            <FlashcardRichContent
              text={labels.tutorHintBeforeSubmit}
              className="text-sm leading-relaxed text-[var(--semantic-text-muted)] [&_p]:mb-2 [&_p:last-child]:mb-0"
            />
          ) : (
            labels.tutorHintBeforeSubmit
          )}
        </div>
      )}
    </aside>
  );
}
