import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";

const ROW_BASE =
  "flex w-full min-h-[52px] items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm leading-snug text-[var(--semantic-text-primary)] transition";

const LETTER_BASE =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold tabular-nums transition";

type McqVisualStateArgs = {
  letter: string;
  exam: ExamMicroQuestionPayload;
  revealed: boolean;
  pickedLetter: string | null;
  /** True when the row is a live choice control (tutor mode, not yet revealed). */
  interactive: boolean;
};

/**
 * Single source of truth for exam-style flashcard MCQ row chrome.
 *
 * States:
 * - **Unanswered** (`!revealed`, no pick on this row): neutral; if `interactive`, hover affordance.
 * - **Selected before reveal** (`!revealed`, `pickedLetter === letter`): subtle brand-tinted highlight (no red/green).
 * - **Revealed**: correct = success row; incorrect picked = danger; other options = muted.
 */
export function flashcardExamMcqOptionClass(args: McqVisualStateArgs): string {
  const { letter, exam, revealed, pickedLetter, interactive } = args;

  if (!revealed) {
    const selected = pickedLetter === letter;
    if (selected) {
      return `${ROW_BASE} border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_9%,var(--semantic-surface))] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--semantic-brand)_16%,transparent)]`;
    }
    if (interactive) {
      return `${ROW_BASE} border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,var(--semantic-text-primary))] bg-[var(--semantic-surface)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_38%,var(--semantic-surface))]`;
    }
    return `${ROW_BASE} border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,var(--semantic-text-primary))] bg-[var(--semantic-surface)]`;
  }

  const isCorrect = letter === exam.correctLetter;
  const wasPicked = pickedLetter === letter;
  if (isCorrect) {
    return `${ROW_BASE} border-[color-mix(in_srgb,var(--semantic-success)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_11%,var(--semantic-surface))] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--semantic-success)_22%,transparent)]`;
  }
  if (wasPicked) {
    return `${ROW_BASE} border-[color-mix(in_srgb,var(--semantic-danger)_50%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))]`;
  }
  return `${ROW_BASE} border-[color-mix(in_srgb,var(--semantic-border-soft)_95%,var(--semantic-text-primary))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_42%,var(--semantic-surface))] opacity-[0.78]`;
}

/** Circular A–D badge aligned with {@link flashcardExamMcqOptionClass} (same state machine). */
export function optionLetterCircleClass(args: McqVisualStateArgs): string {
  const { letter, exam, revealed, pickedLetter, interactive } = args;

  if (!revealed) {
    const selected = pickedLetter === letter;
    if (selected) {
      return `${LETTER_BASE} border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))] text-[var(--semantic-text-primary)]`;
    }
    if (interactive) {
      return `${LETTER_BASE} border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,var(--semantic-text-primary))] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]`;
    }
    return `${LETTER_BASE} border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,var(--semantic-text-primary))] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]`;
  }

  const isCorrect = letter === exam.correctLetter;
  const wasPicked = pickedLetter === letter;
  if (isCorrect) {
    return `${LETTER_BASE} border-[color-mix(in_srgb,var(--semantic-success)_55%,transparent)] bg-[var(--semantic-success)] text-[var(--semantic-surface)]`;
  }
  if (wasPicked) {
    return `${LETTER_BASE} border-[color-mix(in_srgb,var(--semantic-danger)_50%,transparent)] bg-[color-mix(in_srgb,var(--semantic-danger)_12%,var(--semantic-surface))] text-[var(--semantic-danger)]`;
  }
  return `${LETTER_BASE} border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-text-primary))] bg-[var(--semantic-surface)] text-[var(--semantic-text-muted)]`;
}
