"use client";

import Link from "next/link";
import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { MistakeTagPicker } from "./mistake-tag-picker";
import { buildMissedQuestionRecommendations, missedQuestionReasonCoaching } from "@/lib/mistakes/missed-question-recommendations";
import type { MistakeReason } from "@/lib/mistakes/mistake-types";

type Props = {
  questionId: string;
  questionText?: string | null;
  topic?: string | null;
  pathwayId?: string | null;
  sourceType?: string | null;
  questionType?: string | null;
  sourceHref?: string | null;
  compact?: boolean;
};

export function MissedQuestionReflection({
  questionId,
  questionText,
  topic,
  pathwayId,
  sourceType,
  questionType,
  sourceHref,
  compact = false,
}: Props) {
  const [savedReason, setSavedReason] = useState<MistakeReason | null>(null);
  const recommendations = buildMissedQuestionRecommendations({ topic, pathwayId });

  function handleSaved(reason: MistakeReason | null) {
    setSavedReason(reason);
  }

  return (
    <section
      className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-danger)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_5%,var(--semantic-surface))] p-4"
      aria-label="Missed Question Journal reflection"
      data-nn-missed-question-reflection
    >
      <div className="flex items-start gap-3">
        <span
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_22%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] text-[var(--semantic-danger)]"
          aria-hidden="true"
        >
          <ClipboardList className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--semantic-text-primary)]">Add to Missed Question Journal</h3>
            <p className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Why did you miss this? Tag the pattern now so NurseNest can show what to fix next.
            </p>
          </div>
          <MistakeTagPicker
            questionId={questionId}
            initialReason={null}
            initialNote=""
            topic={topic}
            compact={compact}
            sourceType={sourceType}
            stemPreview={questionText}
            questionType={questionType}
            sourceHref={sourceHref}
            pathwayId={pathwayId}
            onSaved={handleSaved}
          />
          <div className="grid gap-2 sm:grid-cols-3">
            {recommendations.map((item) => (
              <Link
                key={`${item.kind}-${item.href}`}
                href={item.href}
                className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-xs font-semibold text-[var(--semantic-text-secondary)] transition-colors hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] hover:text-[var(--semantic-brand)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-[var(--semantic-text-muted)]">
            {missedQuestionReasonCoaching(savedReason)}
          </p>
        </div>
      </div>
    </section>
  );
}
