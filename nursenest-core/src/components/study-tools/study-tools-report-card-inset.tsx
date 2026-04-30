"use client";

import { useEffect, useState } from "react";
import { summarizeStudyToolsProgress } from "@/lib/study-tools/study-tools-progress-persistence";

/**
 * Client-only summary of Quizlet-style study tools (local persistence). Shown on the report card when the learner
 * has practiced in staff preview or after public launch — does not replace server-backed bank analytics.
 */
export function StudyToolsReportCardInset({ userId }: { userId: string }) {
  const [summary, setSummary] = useState<{ totalAttempts: number; mastered: number; weak: number } | null>(null);

  useEffect(() => {
    setSummary(summarizeStudyToolsProgress(userId));
  }, [userId]);

  if (!summary || summary.totalAttempts === 0) return null;

  return (
    <aside
      className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_12%,var(--bg-card))] p-4 text-sm text-[var(--semantic-text-primary)]"
      data-nn-study-tools-report-inset
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-success)]">Study tools (beta)</p>
      <p className="mt-1 text-[var(--theme-body-text)]">
        {summary.totalAttempts} checks · {summary.mastered} mastered rows · {summary.weak} weak rows (this device).
      </p>
    </aside>
  );
}
