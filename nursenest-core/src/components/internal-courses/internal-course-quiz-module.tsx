"use client";

import Link from "next/link";
import { useState } from "react";

export type InternalQuizOption = { id: string; text: string };

export type InternalQuizModuleContent = {
  question: string;
  options: InternalQuizOption[];
  correctId: string;
  rationale: string;
};

export function InternalCourseQuizModule({
  content,
  lessonAppHref,
}: {
  content: InternalQuizModuleContent;
  lessonAppHref: string | null;
}) {
  const [choice, setChoice] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const correct = submitted && choice === content.correctId;
  const wrong = submitted && choice && choice !== content.correctId;

  return (
    <div className="space-y-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_10%,transparent)] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">Quick check</h3>
        <span className="nn-badge-semantic-success rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
          MCQ
        </span>
      </div>
      <p className="text-sm font-medium text-foreground">{content.question}</p>
      {lessonAppHref ? (
        <p className="text-xs text-muted-foreground">
          <Link href={lessonAppHref} className="font-semibold text-primary underline-offset-2 hover:underline">
            Related pathway lesson
          </Link>
        </p>
      ) : null}
      <div className="flex flex-col gap-2" role="radiogroup">
        {content.options.map((o) => (
          <label
            key={o.id}
            className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
              choice === o.id
                ? "border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,transparent)]"
                : "border-border bg-background/70"
            }`}
          >
            <input
              type="radio"
              name="mcq"
              className="mt-1"
              checked={choice === o.id}
              onChange={() => {
                setChoice(o.id);
                setSubmitted(false);
              }}
            />
            <span>{o.text}</span>
          </label>
        ))}
      </div>
      <button
        type="button"
        disabled={!choice}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        onClick={() => setSubmitted(true)}
      >
        Check answer
      </button>
      {submitted ? (
        <div
          className={`rounded-lg border p-3 text-sm ${
            correct
              ? "border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,transparent)]"
              : wrong
                ? "border-[color-mix(in_srgb,var(--semantic-danger)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,transparent)]"
                : "border-border bg-muted/30"
          }`}
        >
          {correct ? <p className="font-semibold text-foreground">Correct.</p> : null}
          {wrong ? <p className="font-semibold text-foreground">Not quite — review the rationale.</p> : null}
          <p className="mt-2 text-muted-foreground">{content.rationale}</p>
        </div>
      ) : null}
    </div>
  );
}
