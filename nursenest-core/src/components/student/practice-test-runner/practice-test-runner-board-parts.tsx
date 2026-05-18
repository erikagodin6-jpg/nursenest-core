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
      data-nn-qa-exam-format="hotspot"
      className={
        className ??
        "nn-cat-exam-clinical-figure nn-premium-exam-clinical-figure mb-4 flex justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-text-primary))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,var(--semantic-surface))] p-3"
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
    <div
      className="nn-cat-answer-instruction-stack space-y-1"
      data-nn-qa-cat-format={isSata ? "sata" : "mcq"}
    >
      {isSata ? (
        <div className="nn-cat-ngn-format-row flex flex-wrap items-center gap-2">
          <span className="nn-cat-ngn-format-badge shrink-0">SATA</span>
          <p className="nn-cat-options-label m-0 min-w-0 flex-1">{selectAllLabel}</p>
        </div>
      ) : (
        <p className="nn-cat-options-label m-0">{selectBestLabel}</p>
      )}
    </div>
  );
}

/** Bowtie / NGN — compact format label above slots (exam + practice shells). */
export function PracticeTestBowtieChoicesInstruction({ instruction }: { instruction: string }) {
  return (
    <div
      className="nn-cat-ngn-format-row mb-0.5 flex flex-wrap items-baseline gap-2"
      data-nn-qa-cat-format="bowtie"
    >
      <span className="nn-cat-ngn-format-badge shrink-0" aria-hidden>
        NGN
      </span>
      <p className="nn-cat-options-label m-0 min-w-0 flex-1">{instruction}</p>
    </div>
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
      className={`rounded-md p-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)] ${
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
        optionKeys={Array.from(optionKeys)}
        optionTexts={Array.from(optionTexts)}
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
  return (
    <EcgVideoQuestionMedia
      exhibitData={exhibitData}
      images={images}
      mode={mode}
      phase={phase}
      className="nn-premium-exam-ecg-media"
    />
  );
}

type PracticeOptionTeachingMap = Record<string, string | null | undefined>;

function PracticeOptionTeachingAside({
  state,
  text,
  label,
}: {
  state: AnswerOptionState;
  text: string;
  label: string;
}) {
  const correct = state === "correct";
  const incorrect = state === "incorrect";
  return (
    <aside
      className="mt-2 rounded-lg border px-3 py-2 text-[12.5px] leading-[1.5] md:mt-0 md:min-w-[17.5rem] md:max-w-[24rem] md:flex-[0_0_36%]"
      data-nn-practice-option-rationale=""
      style={{
        borderColor: correct
          ? "color-mix(in srgb, var(--semantic-success) 28%, var(--semantic-border-soft))"
          : incorrect
            ? "color-mix(in srgb, var(--semantic-danger) 24%, var(--semantic-border-soft))"
            : "var(--semantic-border-soft)",
        background: correct
          ? "color-mix(in srgb, var(--semantic-success) 7%, var(--semantic-surface))"
          : incorrect
            ? "color-mix(in srgb, var(--semantic-danger) 6%, var(--semantic-surface))"
            : "var(--semantic-surface)",
        color: "var(--semantic-text-secondary)",
      }}
    >
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
        {label}
      </p>
      <p className="m-0">{text}</p>
    </aside>
  );
}

/** Radiogroup MCQ option list (presentational); parent supplies row state and selection handler. */
export function PracticeTestMcqRadiogroupOptions({
  canonicalKeys,
  displayTexts,
  rowState,
  disabled,
  ariaLabel,
  onSelectCanonical,
  optionTeachingMap,
  showOptionTeaching = false,
  teachingLabel = "Rationale",
}: {
  canonicalKeys: readonly string[];
  displayTexts: readonly string[];
  rowState: (canonical: string) => AnswerOptionState;
  disabled: boolean;
  ariaLabel: string;
  onSelectCanonical: (canonical: string) => void;
  optionTeachingMap?: PracticeOptionTeachingMap | null;
  showOptionTeaching?: boolean;
  teachingLabel?: string;
}) {
  return (
    <ul
      className={showOptionTeaching ? "nn-cat-opt-list nn-practice-option-rationale-list" : "nn-cat-opt-list"}
      role="radiogroup"
      aria-label={ariaLabel}
      data-nn-practice-option-rationales={showOptionTeaching ? "visible" : undefined}
    >
      {canonicalKeys.map((canonical, i) => {
        const state = rowState(canonical);
        const teaching = optionTeachingMap?.[canonical]?.trim();
        return (
          <li key={canonical}>
            <div className={showOptionTeaching ? "md:flex md:items-stretch md:gap-3" : undefined}>
              <div className="min-w-0 flex-1">
                <AnswerOptionRow
                  letter={MCQ_OPTION_LETTERS[i] ?? String(i + 1)}
                  text={displayTexts[i] ?? canonical}
                  state={state}
                  disabled={disabled}
                  onClick={() => onSelectCanonical(canonical)}
                />
              </div>
              {showOptionTeaching && teaching ? (
                <PracticeOptionTeachingAside state={state} text={teaching} label={teachingLabel} />
              ) : null}
            </div>
          </li>
        );
      })}
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
      className="nn-premium-cat-adaptive-footer nn-cat-exam-board-footer nn-cat-exam-board-footer--adaptive flex shrink-0 flex-col border-t border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]"
    >
      <div className="mx-auto flex w-full max-w-[48.75rem] items-center justify-between gap-2 px-3 py-1.5 sm:gap-3 sm:px-4 sm:py-2">
        {children}
      </div>
    </footer>
  );
}
