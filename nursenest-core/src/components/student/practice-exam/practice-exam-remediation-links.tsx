"use client";

import Link from "next/link";
import { Layers, Library } from "lucide-react";
import { buildAppTopicDrillHref } from "@/lib/learner/study-loop-recommendations";
import {
  pathwayHubAppFlashcardsHref,
  pathwayHubAppWeakAreasFlashcardsHref,
} from "@/lib/marketing/pathway-hub-app-questions-href";

/**
 * Post-commit study-loop shortcuts for linear practice tutor sessions — lessons already
 * surface in {@link PracticeRationaleFullPanel}; this card adds flashcards + targeted drills.
 */
export function PracticeExamRemediationLinks({
  pathwayId,
  topicLabel,
  visible,
  copy,
}: {
  pathwayId: string | null;
  topicLabel: string | null | undefined;
  visible: boolean;
  copy: {
    title: string;
    topicLabel: string;
    flashcardsCta: string;
    topicDrillCta: string;
    weakFlashcardsCta: string;
  };
}) {
  if (!visible || !pathwayId?.trim()) return null;
  const pid = pathwayId.trim();
  const topic = typeof topicLabel === "string" && topicLabel.trim().length > 0 ? topicLabel.trim() : null;

  const flashHref = pathwayHubAppFlashcardsHref(pid);
  const weakHref = pathwayHubAppWeakAreasFlashcardsHref(pid);
  const drillHref = topic
    ? buildAppTopicDrillHref({ topic, topicCode: null, pathwayId: pid })
    : null;

  return (
    <div className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_10%,var(--semantic-surface))] p-3 sm:p-4">
      <p className="m-0 text-xs font-bold uppercase tracking-wide text-[var(--semantic-brand)]">{copy.title}</p>
      {topic ? (
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
          <span className="font-semibold text-[var(--semantic-text-primary)]">{copy.topicLabel}:</span> {topic}
        </p>
      ) : (
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{copy.flashcardsCta}</p>
      )}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          href={flashHref}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_8%,var(--semantic-surface))] px-3 py-2 text-xs font-semibold text-[var(--semantic-text-primary)] shadow-none transition hover:bg-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-surface))] sm:min-h-0 sm:flex-none"
        >
          <Library className="h-4 w-4 shrink-0 text-[var(--semantic-info)]" aria-hidden />
          {copy.flashcardsCta}
        </Link>
        <Link
          href={weakHref}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] px-3 py-2 text-xs font-semibold text-[var(--semantic-text-primary)] shadow-none transition hover:bg-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-surface))] sm:min-h-0 sm:flex-none"
        >
          <Layers className="h-4 w-4 shrink-0 text-[var(--semantic-warning)]" aria-hidden />
          {copy.weakFlashcardsCta}
        </Link>
        {drillHref ? (
          <Link
            href={drillHref}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))] px-3 py-2 text-xs font-semibold text-[var(--semantic-text-primary)] shadow-none transition hover:bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))] sm:min-h-0 sm:flex-none"
          >
            {copy.topicDrillCta}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
