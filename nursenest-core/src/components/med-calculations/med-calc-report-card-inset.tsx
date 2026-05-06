"use client";

import Link from "next/link";
import { useMedCalcProgress } from "@/lib/med-calculations/med-calculations-progress";

/**
 * Client-local summary of medication calculations practice (localStorage). Shown on the learner report card
 * alongside server-backed analytics — does not replace bank/CAT metrics.
 */
export function MedCalcReportCardInset({ userId }: { userId: string }) {
  const { totals } = useMedCalcProgress(userId);

  if (totals.totalAnswered === 0 && totals.strictAttempts === 0) return null;

  const accuracyPct =
    totals.totalAnswered > 0 ? Math.round((totals.correctAnswered / totals.totalAnswered) * 100) : 0;

  return (
    <aside
      className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--bg-card))] p-4 text-sm text-[var(--semantic-text-primary)]"
      data-nn-med-calc-report-inset
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">Medication calculations</p>
      <p className="mt-1 text-[var(--theme-body-text)]">
        {totals.totalAnswered} checks · {accuracyPct}% correct on this device · {totals.strictPasses} strict pass
        {totals.strictPasses === 1 ? "" : "es"} · {totals.strictAttempts} strict attempt{totals.strictAttempts === 1 ? "" : "s"}.
      </p>
      <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">
        Progress is stored locally in your browser until synced study surfaces are extended for med-calc.
      </p>
      <Link
        href="/app/med-calculations"
        className="mt-3 inline-flex min-h-10 items-center rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 text-sm font-semibold text-[var(--semantic-brand)] hover:bg-[var(--semantic-surface-muted)]"
      >
        Open med calculations hub
      </Link>
    </aside>
  );
}
