import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";

const ROW_BASE =
  "flex w-full min-h-[56px] items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm leading-snug text-[var(--semantic-text-primary)] transition-all duration-200";

const LETTER_BASE =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold tabular-nums transition-all duration-150";

/** Soft theme border — no text-primary mix (avoids harsh black outlines). */
const BORDER_REST =
  "border-[color-mix(in_srgb,var(--semantic-border-soft)_82%,var(--semantic-brand)_14%)]";

const BORDER_HOVER =
  "hover:border-[color-mix(in_srgb,var(--semantic-border-soft)_62%,var(--semantic-brand)_32%)]";

const BORDER_SELECTED =
  "border-[color-mix(in_srgb,var(--semantic-brand)_44%,var(--semantic-border-soft))]";

const BG_SELECTED =
  "bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))]";

const LETTER_BORDER_REST =
  "border-[color-mix(in_srgb,var(--semantic-border-soft)_78%,var(--semantic-brand)_16%)]";

const LETTER_BORDER_SELECTED =
  "border-[color-mix(in_srgb,var(--semantic-brand)_48%,var(--semantic-border-soft))]";

const LETTER_BG_SELECTED =
  "bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))]";

type McqVisualStateArgs = {
  letter: string;
  exam: ExamMicroQuestionPayload;
  revealed: boolean;
  pickedLetter: string | null;
  interactive: boolean;
};

export function flashcardExamMcqOptionClass(args: McqVisualStateArgs): string {
  const { letter, exam, revealed, pickedLetter, interactive } = args;

  if (!revealed) {
    const selected = pickedLetter === letter;

    if (selected) {
      return `${ROW_BASE} ${BORDER_SELECTED} ${BG_SELECTED}`;
    }

    if (interactive) {
      return `${ROW_BASE} ${BORDER_REST} bg-[var(--semantic-surface)] ${BORDER_HOVER} hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))] cursor-pointer`;
    }

    return `${ROW_BASE} ${BORDER_REST} bg-[var(--semantic-surface)]`;
  }

  const isCorrect = letter === exam.correctLetter;
  const wasPicked = pickedLetter === letter;

  if (isCorrect) {
    return `${ROW_BASE}
      border-[color-mix(in_srgb,var(--semantic-success)_60%,var(--semantic-border-soft))]
      bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))]
      shadow-[inset_4px_0_0_color-mix(in_srgb,var(--semantic-success)_78%,transparent),var(--semantic-shadow-soft)]`;
  }

  if (wasPicked) {
    return `${ROW_BASE}
      border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))]
      bg-[color-mix(in_srgb,var(--semantic-danger)_7%,var(--semantic-surface))]
      text-[var(--semantic-text-secondary)]`;
  }

  return `${ROW_BASE}
    border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-text-muted)_8%)]
    bg-[color-mix(in_srgb,var(--semantic-panel-muted)_35%,var(--semantic-surface))]
    opacity-70`;
}

export function optionLetterCircleClass(args: McqVisualStateArgs): string {
  const { letter, exam, revealed, pickedLetter, interactive } = args;

  if (!revealed) {
    const selected = pickedLetter === letter;

    if (selected) {
      return `${LETTER_BASE} ${LETTER_BORDER_SELECTED} ${LETTER_BG_SELECTED} text-[var(--semantic-text-primary)]`;
    }

    if (interactive) {
      return `${LETTER_BASE} ${LETTER_BORDER_REST} bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]`;
    }

    return `${LETTER_BASE} ${LETTER_BORDER_REST} bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]`;
  }

  const isCorrect = letter === exam.correctLetter;
  const wasPicked = pickedLetter === letter;

  if (isCorrect) {
    return `${LETTER_BASE}
      border-[color-mix(in_srgb,var(--semantic-success)_60%,transparent)]
      bg-[var(--semantic-success)]
      text-[var(--semantic-surface)]`;
  }

  if (wasPicked) {
    return `${LETTER_BASE}
      border-[color-mix(in_srgb,var(--semantic-danger)_55%,transparent)]
      bg-[color-mix(in_srgb,var(--semantic-danger)_14%,var(--semantic-surface))]
      text-[var(--semantic-danger)]`;
  }

  return `${LETTER_BASE}
    border-[color-mix(in_srgb,var(--semantic-border-soft)_82%,var(--semantic-text-muted)_10%)]
    bg-[var(--semantic-surface)]
    text-[var(--semantic-text-muted)]`;
}
