"use client";

import Link from "next/link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackClientEvent } from "@/lib/observability/posthog-client";
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
  const layers = feedback.layers;
  const level2 = layers?.level2Sections ?? [];
  const related = layers?.relatedLessons ?? [];
  const level3 = layers?.level3Strategy?.trim() ?? "";

  return (
    <div className="motion-reduce:transition-none space-y-4">
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
              {feedback.topic ? (
                <span className="font-semibold text-[var(--theme-heading-text)]">{feedback.topic}</span>
              ) : null}
              {feedback.topic && feedback.subtopic ? <span> · </span> : null}
              {feedback.subtopic ? <span>{feedback.subtopic}</span> : null}
            </p>
          )}

          {layers ? (
            <div className="space-y-3">
              <details className="rounded-lg border border-border/80 bg-background/60 px-3 py-2" open>
                <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                  Quick take (2–3 sentences)
                </summary>
                <p className="mt-2 leading-relaxed text-[var(--theme-body-text)]">
                  {layers.level1Short?.trim() || "Quick summary is not available for this item."}
                </p>
              </details>
              <details className="rounded-lg border border-border/80 bg-background/60 px-3 py-2">
                <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                  Full rationale
                </summary>
                <div className="mt-2 space-y-3">
                  {level2.length === 0 ? (
                    <p className="text-[var(--theme-muted-text)]">No structured rationale on file for this item.</p>
                  ) : (
                    level2.map((s) => (
                      <div key={`${s.heading}-${(s.body ?? "").slice(0, 40)}`}>
                        {s.heading?.trim() ? (
                          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                            {s.heading}
                          </p>
                        ) : null}
                        <p className="mt-1 whitespace-pre-wrap leading-relaxed text-[var(--theme-body-text)]">
                          {s.body ?? ""}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </details>
              <details className="rounded-lg border border-border/80 bg-background/60 px-3 py-2">
                <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                  Test-taking strategy
                </summary>
                <p className="mt-2 leading-relaxed text-[var(--theme-body-text)]">
                  {level3 || "Strategy notes are not on file for this item."}
                </p>
                {layers.examFramingNote ? (
                  <p className="mt-2 border-t border-border/60 pt-2 text-xs leading-relaxed text-[var(--theme-muted-text)]">
                    {layers.examFramingNote}
                  </p>
                ) : null}
              </details>
              {related.length ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                    Related learning (pathway-aware)
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {related.map((l, i) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="inline-flex rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/10"
                          onClick={() =>
                            trackClientEvent(PH.learnerCatLearningLinkClicked, {
                              surface: "cat_study_rationale",
                              link_index: i,
                              href_kind: "lesson",
                            })
                          }
                        >
                          {i === 0 ? "Review this lesson — " : "Related — "}
                          {l.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : !(feedback.sections ?? []).length ? (
            <p className="text-[var(--theme-muted-text)]">No structured rationale on file for this item.</p>
          ) : (
            (feedback.sections ?? []).map((s) => (
              <div key={`${s.heading}-${(s.body ?? "").slice(0, 40)}`}>
                {s.heading?.trim() ? (
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">{s.heading}</p>
                ) : null}
                {(s.body ?? "").trim() ? (
                  <p className="mt-1 whitespace-pre-wrap leading-relaxed text-[var(--theme-body-text)]">{s.body}</p>
                ) : null}
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
