import Link from "next/link";
import { PracticeTestStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { getCatBlueprintQualityThresholds } from "@/lib/exams/cat-blueprint-thresholds";
import { prisma } from "@/lib/db";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import type { CatExamReport } from "@/lib/exams/cat-types";

export const dynamic = "force-dynamic";

export default async function AdminCatBlueprintSessionsPage() {
  await requireAdmin();
  const thresholds = getCatBlueprintQualityThresholds();

  const rows = await prisma.practiceTest.findMany({
    where: { status: PracticeTestStatus.COMPLETED },
    orderBy: { updatedAt: "desc" },
    take: 120,
    select: {
      id: true,
      userId: true,
      status: true,
      updatedAt: true,
      config: true,
      results: true,
    },
  });

  const sessions = rows
    .filter((r) => (r.config as PracticeTestConfigJson | null)?.selectionMode === "cat")
    .slice(0, 40)
    .map((r) => {
      const cfg = r.config as PracticeTestConfigJson | null;
      const res = r.results as PracticeTestResultsJson | null;
      const report = res?.catReport as CatExamReport | undefined;
      const d = report?.blueprintDiagnostics;
      const a = report?.blueprintAdminDiagnostics;
      return {
        id: r.id,
        userId: r.userId.slice(0, 8),
        mode: cfg?.catPresentationMode ?? "practice",
        poolPct: d?.poolMappedFraction != null ? Math.round(d.poolMappedFraction * 100) : null,
        sessionPct: d?.sessionMappedFraction != null ? Math.round(d.sessionMappedFraction * 100) : null,
        mapped: a?.deliveredMappedCount ?? null,
        fallback: a?.deliveredFallbackCount ?? null,
        topFallback: a?.topFallbackBlueprintKeysDelivered?.[0]?.blueprintKey ?? null,
        warnings: a?.mappingQualityWarnings?.length ?? 0,
        hasDiag: Boolean(d),
      };
    });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Operations</p>
      <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">CAT blueprint session diagnostics</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Completed adaptive practice tests only (recent). Pool/session mapping rates and fallback hints come from stored{" "}
        <code className="rounded bg-muted px-1 text-xs">results.catReport</code>. Warning thresholds (non-blocking): pool{" "}
        {thresholds.poolMappedFractionWarning * 100}% (exam simulation), session{" "}
        {thresholds.sessionMappedFractionWarning * 100}%.
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <a
          className="rounded-lg border border-border bg-primary/10 px-3 py-2 font-semibold text-primary hover:bg-primary/15"
          href="/api/admin/cat-blueprint-sessions?limit=40&status=COMPLETED"
          target="_blank"
          rel="noreferrer"
        >
          Full JSON API
        </a>
        <Link href="/admin/questions/nclex-mapping" className="rounded-lg border border-border px-3 py-2 hover:bg-muted">
          NCLEX mapping backfill
        </Link>
        <Link href="/admin/diagnostics" className="rounded-lg border border-border px-3 py-2 hover:bg-muted">
          Diagnostics home
        </Link>
      </div>

      <div className="mt-6 overflow-auto rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-2">
        <table className="w-full min-w-[720px] text-left text-xs sm:text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="p-2">Practice test</th>
              <th className="p-2">User</th>
              <th className="p-2">Mode</th>
              <th className="p-2 text-right">Pool %</th>
              <th className="p-2 text-right">Session %</th>
              <th className="p-2 text-right">Mapped</th>
              <th className="p-2 text-right">Fallback</th>
              <th className="p-2">Top fallback key</th>
              <th className="p-2 text-right">Warnings</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-b border-border/40">
                <td className="p-2 font-mono text-[11px]">{s.id.slice(0, 12)}…</td>
                <td className="p-2 font-mono">{s.userId}…</td>
                <td className="p-2">{s.mode}</td>
                <td className="p-2 text-right tabular-nums">{s.hasDiag ? (s.poolPct ?? "—") : "—"}</td>
                <td className="p-2 text-right tabular-nums">{s.hasDiag ? (s.sessionPct ?? "—") : "—"}</td>
                <td className="p-2 text-right tabular-nums">{s.mapped ?? "—"}</td>
                <td className="p-2 text-right tabular-nums">{s.fallback ?? "—"}</td>
                <td className="max-w-[140px] truncate p-2" title={s.topFallback ?? ""}>
                  {s.topFallback ?? "—"}
                </td>
                <td className="p-2 text-right tabular-nums">{s.warnings}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {sessions.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No completed CAT sessions found in recent window.</p>
        ) : null}
      </div>
    </main>
  );
}
