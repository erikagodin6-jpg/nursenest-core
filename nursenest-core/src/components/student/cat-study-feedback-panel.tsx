"use client";

import type { CatStudyFeedbackPayload } from "@/lib/practice-tests/types";

/**
 * Shared CAT Study Mode rationale surface — matches linear practice / question-bank rationale card classes.
 */
export function CatStudyFeedbackPanel({
  feedback,
  continueLabel,
  onContinue,
  continueDisabled,
}: {
  feedback: CatStudyFeedbackPayload;
  continueLabel: string;
  onContinue: () => void;
  continueDisabled?: boolean;
}) {
  return (
    <div className="space-y-4">
      <details className="nn-question-rationale-card group" open={!feedback.isCorrect}>
        <summary
          className={`nn-question-rationale-card__verdict flex cursor-pointer list-none items-center justify-between gap-3 outline-none marker:hidden [&::-webkit-details-marker]:hidden ${
            feedback.isCorrect ? "nn-question-rationale-card__verdict--ok" : "nn-question-rationale-card__verdict--miss"
          }`}
        >
          <span
            className={`text-sm font-semibold sm:text-base ${
              feedback.isCorrect ? "text-[var(--role-success-text)]" : "text-[var(--theme-heading-text)]"
            }`}
          >
            {feedback.isCorrect ? "Correct" : "Incorrect"}
          </span>
          <span className="shrink-0 text-xs font-normal text-[var(--theme-muted-text)] group-open:hidden">
            Show explanation
          </span>
          <span className="hidden shrink-0 text-xs font-normal text-[var(--theme-muted-text)] group-open:inline">
            Hide explanation
          </span>
        </summary>
        <div className="nn-question-rationale-card__body nn-rationale-prose nn-marketing-body-sm space-y-4 px-4 py-4 sm:px-6 sm:py-5">
          {(feedback.topic || feedback.subtopic) && (
            <p className="text-xs text-[var(--theme-muted-text)]">
              {feedback.topic ? <span className="font-semibold text-[var(--theme-heading-text)]">{feedback.topic}</span> : null}
              {feedback.topic && feedback.subtopic ? <span> · </span> : null}
              {feedback.subtopic ? <span>{feedback.subtopic}</span> : null}
            </p>
          )}
          {feedback.sections.length === 0 ? (
            <p className="text-[var(--theme-muted-text)]">No structured rationale on file for this item.</p>
          ) : (
            feedback.sections.map((s) => (
              <div key={`${s.heading}-${s.body.slice(0, 40)}`}>
                {s.heading.trim() ? (
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">{s.heading}</p>
                ) : null}
                <p className="mt-1 whitespace-pre-wrap leading-relaxed text-[var(--theme-body-text)]">{s.body}</p>
              </div>
            ))
          )}
        </div>
      </details>
      <button
        type="button"
        disabled={continueDisabled}
        className="nn-btn-primary min-h-[3rem] w-full max-w-md rounded-full px-6 text-sm font-semibold shadow-none disabled:opacity-40 sm:w-auto"
        onClick={onContinue}
      >
        {continueLabel}
      </button>
    </div>
  );
}
