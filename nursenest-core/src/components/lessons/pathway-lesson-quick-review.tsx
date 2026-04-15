"use client";

import { useMemo, useState } from "react";
import type { MarketingPathwayLessonQuickReviewClientProps } from "@/lib/lessons/marketing-pathway-lesson-client-contract";

/**
 * Marketing-only condensed review. Props are intentionally thin — full `PathwayLessonRecord` / `sections`
 * must never be passed here (see `marketing-pathway-lesson-client-contract.ts`).
 */
export function PathwayLessonQuickReview({ quickReviewLines }: MarketingPathwayLessonQuickReviewClientProps) {
  const [on, setOn] = useState(false);
  const safe = useMemo(() => [...quickReviewLines].filter(Boolean), [quickReviewLines]);
  if (safe.length === 0) return null;

  return (
    <div className="nn-card rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--bg-card)_92%,var(--semantic-warning-soft)_8%)] p-3.5 dark:border-amber-900/35 dark:bg-amber-950/15">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--theme-heading-text)]">Quick review (condensed)</p>
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--theme-muted-text)]">
            Short revision bullets only, not a replacement for the full lesson sections below.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--theme-body-text)] hover:bg-[var(--theme-muted-surface)] sm:text-sm"
        >
          {on ? "Show full lesson" : "Show condensed review"}
        </button>
      </div>
      {on ? (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--theme-body-text)]">
          {safe.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-muted">Toggle for a short revision list before a mock or question block.</p>
      )}
    </div>
  );
}
