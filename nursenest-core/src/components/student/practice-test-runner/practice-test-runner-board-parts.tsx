"use client";

import type { ReactNode } from "react";
import { Flag } from "lucide-react";
import { EcgVideoQuestionMedia } from "@/components/study/ecg-video-question-media";
import type { AnswerOptionState } from "@/components/study/cat-question-card";
import { AnswerOptionRow } from "@/components/study/cat-question-card";
import { RationalePanel, type RationalePanelMode } from "@/components/study/cat-rationale-panel";
import type { CatStudyFeedbackPayload } from "@/lib/practice-tests/types";

const MCQ_OPTION_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

/** Leading clinical image extracted from stem HTML (presentational). */
export function PracticeTestClinicalFigure({ src, className }: { src: string; className?: string }) {
  return (
    <div
      className={
        className ??
        "nn-cat-exam-clinical-figure mb-4 flex justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-text-primary))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,var(--semantic-surface))] p-3"
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- stems may reference CDN URLs from trusted exam content */}
      <img src={src} alt="" className="max-h-[min(36vh,20rem)] w-auto max-w-full object-contain" />
    </div>
  );
}

export function PracticeTestMcqChoicesInstruction({
  isSata,
  selectAllLabel,
  selectBestLabel,
}: {
  isSata: boolean;
  selectAllLabel: string;
  selectBestLabel: string;
}) {
  return (
    <p className="nn-cat-options-label">{isSata ? selectAllLabel : selectBestLabel}</p>
  );
}

export function PracticeTestFlagForReviewButton({
  flagged,
  disabled,
  titleFlagged,
  titleUnflagged,
  srFlagged,
  srUnflagged,
  onToggle,
}: {
  flagged: boolean;
  disabled: boolean;
  titleFlagged: string;
  titleUnflagged: string;
  srFlagged: string;
  srUnflagged: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={flagged}
      disabled={disabled}
      title={flagged ? titleFlagged : titleUnflagged}
      className={`rounded-md p-2 transition ${
        flagged
          ? "text-[var(--semantic-brand)]"
          : "text-[var(--semantic-text-muted)] hover:bg-[color-mix(in_srgb,var(--semantic-text-primary)_6%,var(--semantic-surface))]"
      }`}
      onClick={onToggle}
    >
      {flagged ? (
        <Flag className="h-4 w-4 fill-current text-[var(--semantic-brand)]" aria-hidden />
      ) : (
        <Flag className="h-4 w-4 text-[var(--semantic-text-muted)]" strokeWidth={1.75} aria-hidden />
      )}
      <span className="sr-only">{flagged ? srFlagged : srUnflagged}</span>
    </button>
  );
}

export function PracticeTestCatStudyRationaleAside({
  rationalePanelMode,
  catStudyFeedback,
  optionKeys,
  optionTexts,
}: {
  rationalePanelMode: RationalePanelMode;
  catStudyFeedback?: CatStudyFeedbackPayload | null;
  optionKeys: readonly string[];
  optionTexts: readonly string[];
}) {
  return (
    <aside className="nn-question-session-rationale flex min-h-0 flex-col">
      <RationalePanel
        mode={rationalePanelMode}
        feedback={rationalePanelMode === "feedback" ? catStudyFeedback ?? undefined : undefined}
        optionKeys={optionKeys}
        optionTexts={optionTexts}
      />
    </aside>
  );
}

export function PracticeTestTimedSessionAlert({ message }: { message: string }) {
  return (
    <div className="nn-cat-exam-timing-alert mb-4" role="alert">
      {message}
    </div>
  );
}

export function PracticeTestTimedSessionAlertCompact({ message }: { message: string }) {
  return (
    <div className="nn-cat-exam-timing-alert mb-2 sm:mb-3" role="alert">
      {message}
    </div>
  );
}

type EcgMode = "cat" | "practice";
type EcgPhase = "pre_submit" | "post_submit";

export function PracticeTestQuestionMediaBlock({
  exhibitData,
  images,
  mode,
  phase,
}: {
  exhibitData: unknown;
  images: unknown;
  mode: EcgMode;
  phase: EcgPhase;
}) {
  return <EcgVideoQuestionMedia exhibitData={exhibitData} images={images} mode={mode} phase={phase} />;
}

/** Radiogroup MCQ option list (presentational); parent supplies row state and selection handler. */
export function PracticeTestMcqRadiogroupOptions({
  canonicalKeys,
  displayTexts,
  rowState,
  disabled,
  ariaLabel,
  onSelectCanonical,
}: {
  canonicalKeys: readonly string[];
  displayTexts: readonly string[];
  rowState: (canonical: string) => AnswerOptionState;
  disabled: boolean;
  ariaLabel: string;
  onSelectCanonical: (canonical: string) => void;
}) {
  return (
    <ul className="nn-cat-opt-list" role="radiogroup" aria-label={ariaLabel}>
      {canonicalKeys.map((canonical, i) => (
        <li key={canonical}>
          <AnswerOptionRow
            letter={MCQ_OPTION_LETTERS[i] ?? String(i + 1)}
            text={displayTexts[i] ?? canonical}
            state={rowState(canonical)}
            disabled={disabled}
            onClick={() => onSelectCanonical(canonical)}
          />
        </li>
      ))}
    </ul>
  );
}

/** CAT adaptive exam board footer: previous (disabled), progress label, submit/advance (presentational slots). */
export function PracticeTestCatAdaptiveExamFooter({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <footer
      data-nn-qa-cat-adaptive-exam-footer
      className="nn-cat-exam-board-footer nn-cat-exam-board-footer--adaptive flex shrink-0 flex-col border-t border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))]"
    >
      <div className="mx-auto flex w-full max-w-[48.75rem] items-center justify-between gap-2 px-3 py-1.5 sm:gap-3 sm:px-4 sm:py-2">
        {children}
      </div>
    </footer>
  );
}
