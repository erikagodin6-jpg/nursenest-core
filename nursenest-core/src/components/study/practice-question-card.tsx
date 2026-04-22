import type { ReactNode } from "react";

export type PracticeOptionState =
  | "default"
  | "selected"
  | "correct"
  | "incorrect"
  | "dim";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

function optStateClass(state: PracticeOptionState): string {
  switch (state) {
    case "selected":
      return "nn-practice-opt--selected";
    case "correct":
      return "nn-practice-opt--correct";
    case "incorrect":
      return "nn-practice-opt--incorrect";
    case "dim":
      return "nn-practice-opt--dim";
    default:
      return "";
  }
}

/**
 * PracticeAnswerOptionRow — single answer option with circular letter badge.
 *
 * Supports MCQ (button) and SATA (checkbox label) modes.
 * States follow spec §4: default → selected → correct / incorrect / dim.
 */
export function PracticeAnswerOptionRow({
  index,
  text,
  state,
  disabled,
  isCheckbox,
  checked,
  onClick,
  onChange,
}: {
  index: number;
  text: string;
  state: PracticeOptionState;
  disabled?: boolean;
  isCheckbox?: boolean;
  checked?: boolean;
  onClick?: () => void;
  onChange?: (checked: boolean) => void;
}) {
  const letter = LETTERS[index] ?? String(index + 1);
  const stateClass = optStateClass(state);
  const baseClass = `nn-practice-opt ${stateClass}`;

  if (isCheckbox) {
    return (
      <label className={`${baseClass} cursor-pointer`}>
        <input
          type="checkbox"
          disabled={disabled}
          checked={checked ?? false}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
        />
        <span className="nn-practice-opt__letter" aria-hidden="true">
          {letter}
        </span>
        <span
          className={`nn-practice-opt__control ${checked ? "nn-practice-opt__control--checked" : ""}`}
          aria-hidden="true"
        />
        <span className="nn-practice-opt__text">{text}</span>
      </label>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={baseClass}
      aria-pressed={state === "selected" || state === "correct" || state === "incorrect"}
    >
      <span className="nn-practice-opt__letter" aria-hidden="true">
        {letter}
      </span>
      <span
        className={`nn-practice-opt__control ${state === "selected" ? "nn-practice-opt__control--checked" : ""}`}
        aria-hidden="true"
      />
      <span className="nn-practice-opt__text">{text}</span>
    </button>
  );
}

export type PracticeQuestionCardMode = "practice" | "lesson" | "flashcard" | "exam" | "cat";

/**
 * PracticeQuestionCard — left-column card containing the question stem,
 * answer options, and the nav bar (spec §4).
 */
export function PracticeQuestionCard({
  stem,
  topic,
  subtopic,
  difficultyLabel,
  optionsLabel,
  mode = "practice",
  children,
}: {
  stem: string;
  topic?: string | null;
  subtopic?: string | null;
  difficultyLabel?: string | null;
  optionsLabel?: string;
  /** Surface hint for analytics/tests; default preserves existing layout/classes. */
  mode?: PracticeQuestionCardMode;
  children: ReactNode;
}) {
  const hasMeta = Boolean(topic ?? subtopic ?? difficultyLabel);
  return (
    <div className="nn-practice-q-card" data-question-surface={mode}>
      {hasMeta ? (
        <div className="nn-practice-q-card__meta">
          {topic ? (
            <span className="nn-practice-q-card__meta-chip">{topic}</span>
          ) : null}
          {subtopic ? (
            <span className="text-xs text-[var(--semantic-text-muted)]">
              · {subtopic}
            </span>
          ) : null}
          {difficultyLabel ? (
            <span className="text-xs text-[var(--semantic-text-muted)]">
              · {difficultyLabel}
            </span>
          ) : null}
        </div>
      ) : null}

      <p className="nn-practice-q-card__stem">{stem}</p>

      {optionsLabel ? (
        <p className="nn-practice-q-opts-label">{optionsLabel}</p>
      ) : null}

      {children}
    </div>
  );
}
