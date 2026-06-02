"use client";

import Link from "next/link";
import { Layers3, ListChecks } from "lucide-react";
import {
  buildSimilarQuestionsHref,
  deriveSimilarQuestionBasis,
  similarQuestionAdaptiveReason,
  type SimilarQuestionContext,
} from "@/lib/questions/similar-question-links";

export function ShowSimilarQuestions({
  context,
  compact = false,
}: {
  context: SimilarQuestionContext | null | undefined;
  compact?: boolean;
}) {
  if (!context) return null;
  const basis = deriveSimilarQuestionBasis(context);
  if (!basis) return null;

  const threeHref = buildSimilarQuestionsHref(context, 3);
  const fiveHref = buildSimilarQuestionsHref(context, 5);
  const allHref = buildSimilarQuestionsHref(context, "all");
  if (!threeHref || !fiveHref || !allHref) return null;

  return (
    <section
      className={[
        "mt-3 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] first:mt-0",
        compact ? "p-3" : "p-4 sm:p-5",
      ].join(" ")}
      data-nn-show-similar-questions
      aria-label="Show similar questions"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-brand)]">
          <Layers3 className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Show Similar Questions</h3>
          <p className="mt-1 text-xs leading-5 text-[var(--semantic-text-secondary)]">
            {similarQuestionAdaptiveReason(context)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={threeHref}
              className="inline-flex min-h-10 items-center rounded-full bg-[var(--role-cta)] px-4 text-xs font-semibold text-[var(--role-cta-foreground)] shadow-sm"
            >
              3 Similar Questions
            </Link>
            <Link
              href={fiveHref}
              className="inline-flex min-h-10 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-xs font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
            >
              5 Similar Questions
            </Link>
            <Link
              href={allHref}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-xs font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
            >
              <ListChecks className="h-3.5 w-3.5" aria-hidden />
              Study All Related Questions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
