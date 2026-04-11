"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import type { PracticeTestPathwayOption } from "@/lib/practice-tests/types";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";

/**
 * Shown when the API returns `cat_pathway_ambiguous` — the user's subscription has more than
 * one CAT-eligible pathway and the client did not (or could not) pass a `pathwayId`.
 *
 * Renders one CTA button per eligible pathway, each linking to the pathway-scoped CAT start
 * page (`/app/practice-tests/start?pathwayId=<id>`), preserving CAT intent without silently
 * picking a pathway or falling back to the generic hub.
 *
 * Keep this component small and self-contained — no heavy dashboard dependencies.
 */
export function CatAmbiguityPathwayPicker({
  catEligibleOptions,
  className = "",
}: {
  /** The CAT-eligible pathway options for this user's subscription. */
  catEligibleOptions: PracticeTestPathwayOption[];
  className?: string;
}) {
  if (catEligibleOptions.length === 0) return null;

  return (
    <div
      data-nn-qa-cat-ambiguity-picker
      className={`rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] p-4 ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <GraduationCap
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-brand)]"
          strokeWidth={2}
          aria-hidden
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
            Choose your exam pathway
          </p>
          <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">
            Your plan includes more than one adaptive exam track. Select which CAT you want to start.
          </p>
        </div>
      </div>

      <ul className="mt-3 flex list-none flex-col gap-2">
        {catEligibleOptions.map((option) => (
          <li key={option.id}>
            <Link
              href={appPathwayCatSessionStartPath(option.id)}
              data-nn-qa-cat-ambiguity-option={option.id}
              className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-brand)]/40"
            >
              <span>{option.label}</span>
              <span className="shrink-0 text-xs font-normal text-[var(--semantic-brand)]">
                Start CAT →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
