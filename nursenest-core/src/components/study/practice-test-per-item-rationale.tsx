"use client";

import type { ConfidenceLevel } from "@/components/study/confidence-selector";
import {
  PracticeRationaleFullPanel,
  type PracticeRationaleFullPanelStatus,
} from "@/components/study/practice-rationale-full-panel";
import type { PracticeRationaleFullPanelCopy } from "@/components/study/practice-rationale-full-panel.types";

/**
 * Per-item rationale block for linear Practice Tests — rendered inside the CAT
 * {@link QuestionCard} exam scroll region (below options) so the shell matches
 * CAT exam viewport-fit layout while still surfacing post-submit teaching content.
 *
 * When `showDistractorFallback` is true, incorrect option rows that have no stored
 * per-option explanation display the copy default instead of rendering empty — so
 * every incorrect answer always has visible rationale after submission.
 */
export function PracticeTestPerItemRationale({
  status,
  correctKeys,
  optionDisplayMap,
  allOptionKeys,
  correctAnswerExplanation,
  rationale,
  distractorRationalesMap,
  keyTakeaway,
  relatedLessons,
  confidenceLevel,
  showDistractorFallback = false,
  copy,
}: {
  status: PracticeRationaleFullPanelStatus;
  correctKeys?: string[];
  optionDisplayMap?: Record<string, string>;
  allOptionKeys?: string[];
  correctAnswerExplanation?: string | null;
  rationale?: string | null;
  distractorRationalesMap?: Record<string, string> | null;
  keyTakeaway?: string | null;
  relatedLessons?: { title: string; href: string }[];
  confidenceLevel?: ConfidenceLevel | null;
  /**
   * When true, incorrect option rows without a stored distractor rationale show
   * the fallback copy instead of rendering empty. Ensures all answers always have
   * visible rationale after submission. Defaults to false for backward compat.
   */
  showDistractorFallback?: boolean;
  copy?: Partial<PracticeRationaleFullPanelCopy>;
}) {
  return (
    <div
      data-nn-practice-per-item-rationale
      className="mt-4 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,var(--semantic-text-primary))] pt-4"
    >
      <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-text-primary))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_35%,var(--semantic-surface))] p-3 sm:p-4">
        <PracticeRationaleFullPanel
          status={status}
          correctKeys={correctKeys}
          optionDisplayMap={optionDisplayMap}
          allOptionKeys={allOptionKeys}
          correctAnswerExplanation={correctAnswerExplanation}
          rationale={rationale}
          distractorRationalesMap={distractorRationalesMap}
          keyTakeaway={keyTakeaway}
          relatedLessons={relatedLessons}
          confidenceLevel={confidenceLevel}
          showDistractorFallback={showDistractorFallback}
          copy={copy}
        />
      </div>
    </div>
  );
}
