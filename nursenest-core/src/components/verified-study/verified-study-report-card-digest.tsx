import { aggregateVerifiedStudyProgressForReport } from "@/lib/verified-study/verified-study-decks.server";

/**
 * Server-backed verified study card progress (Postgres). Shown alongside the client-local study-tools strip.
 */
export async function VerifiedStudyReportCardDigest({ userId }: { userId: string }) {
  const s = await aggregateVerifiedStudyProgressForReport(userId);
  if (s.viewedTotal === 0) return null;

  return (
    <aside
      className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--bg-card))] p-4 text-sm text-[var(--semantic-text-primary)]"
      data-nn-verified-study-report-digest
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">Verified study cards</p>
      <p className="mt-1 text-[var(--theme-body-text)]">
        {s.viewedTotal} views · {s.correctTotal} correct · {s.incorrectTotal} incorrect · {s.weakCount} weak ·{" "}
        {s.masteredCount} mastered (synced).
      </p>
    </aside>
  );
}
