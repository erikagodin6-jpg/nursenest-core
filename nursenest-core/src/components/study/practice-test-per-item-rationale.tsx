"use client";

import type { ConfidenceLevel } from "@/components/study/confidence-selector";
import {
  PracticeRationaleFullPanel,
  type PracticeRationaleFullPanelStatus,
} from "@/components/study/practice-rationale-full-panel";

/**
 * Per-item rationale block for linear Practice Tests — rendered inside the CAT
 * {@link QuestionCard} exam scroll region (below options) so the shell matches
 * CAT exam viewport-fit layout while still surfacing post-submit teaching content.
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
        />
      </div>
    </div>
  );
}
