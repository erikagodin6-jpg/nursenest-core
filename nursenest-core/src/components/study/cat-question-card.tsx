import type { ReactNode } from "react";

/**
 * QuestionCard — left card in the CAT session layout.
 * Contains topic metadata (optional), question stem, and answer options (via children).
 * Spec: padding 32px, border-radius large, surface-elevated background, subtle border.
 */
export function QuestionCard({
  stem,
  topic,
  subtopic,
  difficultyLabel,
  children,
}: {
  stem: string;
  topic?: string | null;
  subtopic?: string | null;
  difficultyLabel?: string | null;
  /** Answer options list + nav bar — passed as children to keep layout separate from logic. */
  children: ReactNode;
}) {
  const hasMeta = topic ?? subtopic ?? difficultyLabel;

  return (
    <div className="nn-cat-question-card">
      {hasMeta ? (
        <div className="nn-cat-topic-meta">
          {topic ? <span className="nn-cat-topic-meta__name">{topic}</span> : null}
          {subtopic ? <span>· {subtopic}</span> : null}
          {difficultyLabel ? <span>· {difficultyLabel}</span> : null}
        </div>
      ) : null}

      <p className="nn-cat-question-stem">
        {typeof stem === "string" && stem.trim().length > 0
          ? stem
          : "Question text is unavailable. Try reloading this item."}
      </p>

      {children}
    </div>
  );
}

export type AnswerOptionState = "default" | "selected" | "correct" | "incorrect" | "dim";

/**
 * AnswerOptionRow — a single answer option in the CAT session.
 * Spec: full-width row, circular letter badge, 16px padding.
 * Uses `nn-cat-opt` CSS classes — NOT the lesson-style nn-qopt-surface.
 */
export function AnswerOptionRow({
  letter,
  text,
  state = "default",
  disabled = false,
  isCheckbox = false,
  checked = false,
  onClick,
  onChange,
}: {
  letter: string;
  text: string;
  state?: AnswerOptionState;
  disabled?: boolean;
  isCheckbox?: boolean;
  checked?: boolean;
  onClick?: () => void;
  onChange?: (checked: boolean) => void;
}) {
  const stateClass =
    state === "selected"
      ? "nn-cat-opt--selected"
      : state === "correct"
        ? "nn-cat-opt--correct"
        : state === "incorrect"
          ? "nn-cat-opt--incorrect"
          : state === "dim"
            ? "nn-cat-opt--dim"
            : "";

  const interactiveClass = !disabled && state !== "correct" && state !== "incorrect" && state !== "dim"
    ? "nn-cat-opt--interactive"
    : "";

  if (isCheckbox) {
    return (
      <label
        className={`nn-cat-opt ${stateClass} ${interactiveClass} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
        />
        <span className="nn-cat-opt__letter" aria-hidden="true">
          {letter}
        </span>
        <span
          className={`nn-cat-opt__control ${checked ? "nn-cat-opt__control--checked" : ""}`}
          aria-hidden="true"
        />
        <span className="nn-cat-opt__text">{text}</span>
      </label>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`nn-cat-opt ${stateClass} ${interactiveClass}`}
      aria-pressed={state === "selected"}
    >
      <span className="nn-cat-opt__letter" aria-hidden="true">
        {letter}
      </span>
      <span
        className={`nn-cat-opt__control ${state === "selected" ? "nn-cat-opt__control--checked" : ""}`}
        aria-hidden="true"
      />
      <span className="nn-cat-opt__text">{text}</span>
    </button>
  );
}
