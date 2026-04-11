"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import type { PracticeTestPathwayOption } from "@/lib/practice-tests/types";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { catPathwayRegionalExamLine, tryCatPathwayFromId } from "@/lib/exam-pathways/cat-pathway-labels";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";

/**
 * Shown when the API returns `cat_pathway_ambiguous` — the user's subscription has more than
 * one CAT-eligible pathway and the client did not (or could not) pass a `pathwayId`.
 *
 * Renders one CTA per eligible pathway linking to `/app/practice-tests/start?pathwayId=<id>`.
 * Never auto-selects a pathway or falls back to the generic hub.
 *
 * Each option label shows full country + tier + exam copy (e.g. "US RN · NCLEX-RN") so
 * users with multiple active tracks always know which exam they are starting.
 */
export function CatAmbiguityPathwayPicker({
  catEligibleOptions,
  /** Identifies which surface this picker is shown on (for analytics). */
  surface = "unknown",
  className = "",
}: {
  catEligibleOptions: PracticeTestPathwayOption[];
  surface?: "start_page" | "practice_hub" | "unknown";
  className?: string;
}) {
  useEffect(() => {
    if (catEligibleOptions.length === 0) {
      // Contract violation: cat_pathway_ambiguous but no options — log for debugging.
      // eslint-disable-next-line no-console
      console.error(
        "[CatAmbiguityPathwayPicker] cat_pathway_ambiguous received but catEligibleOptions is empty. " +
          "The server indicates multiple CAT-eligible pathways exist yet the client has no options to render. " +
          "Check that catEligiblePathwayIds is populated on the page server component.",
      );
      return;
    }
    trackClientEvent(PH.learnerCatAmbiguityShown, {
      eligible_count: catEligibleOptions.length,
      surface,
    });
  }, [catEligibleOptions.length, surface]);

  const handleOptionClick = useCallback(
    (pathwayId: string) => {
      trackClientEvent(PH.learnerCatAmbiguityOptionSelected, {
        pathway_id: pathwayId,
        eligible_count: catEligibleOptions.length,
        surface,
      });
    },
    [catEligibleOptions.length, surface],
  );

  // Empty fallback: contract issue — server says ambiguous but client has no options.
  if (catEligibleOptions.length === 0) {
    return (
      <p
        role="alert"
        className="mt-2 text-xs text-[var(--semantic-text-secondary)]"
      >
        Your account has multiple exam tracks but none could be loaded here.{" "}
        <Link href="/app/practice-tests/start" className="font-medium text-[var(--semantic-brand)] underline underline-offset-2">
          Open the CAT start page
        </Link>{" "}
        to choose.
      </p>
    );
  }

  return (
    <div
      data-nn-qa-cat-ambiguity-picker
      role="region"
      aria-labelledby="cat-ambiguity-heading"
      className={`rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] p-4 ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <GraduationCap
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-brand)]"
          strokeWidth={2}
          aria-hidden
        />
        <div className="min-w-0">
          <p
            id="cat-ambiguity-heading"
            role="heading"
            aria-level={3}
            className="text-sm font-semibold text-[var(--semantic-text-primary)]"
          >
            Choose your exam pathway
          </p>
          <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">
            Your plan includes more than one adaptive exam track. Select which CAT you want to start.
          </p>
        </div>
      </div>

      <ul className="mt-3 flex list-none flex-col gap-2" role="list">
        {catEligibleOptions.map((option) => {
          const pathwayDef = tryCatPathwayFromId(option.id);
          // Prefer "US RN · NCLEX-RN" from the registry; fall back to server-provided label.
          const displayLabel = pathwayDef ? catPathwayRegionalExamLine(pathwayDef) : option.label;
          const href = appPathwayCatSessionStartPath(option.id);
          return (
            <li key={option.id}>
              <Link
                href={href}
                data-nn-qa-cat-ambiguity-option={option.id}
                aria-label={`Start CAT for ${displayLabel}`}
                onClick={() => handleOptionClick(option.id)}
                className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 py-2.5 text-sm text-[var(--semantic-text-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-brand)]/50 focus-visible:ring-offset-1"
              >
                <span className="font-semibold">{displayLabel}</span>
                <span className="shrink-0 text-xs font-medium text-[var(--semantic-brand)]" aria-hidden>
                  Start CAT →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
