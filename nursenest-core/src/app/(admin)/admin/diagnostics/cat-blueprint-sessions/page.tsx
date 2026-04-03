import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { getCatBlueprintQualityThresholds } from "@/lib/exams/cat-blueprint-thresholds";
import { queryCatBlueprintSessionsForAdmin } from "@/lib/admin/cat-blueprint-sessions-admin";

export const dynamic = "force-dynamic";

function buildSessionsSearchParams(
  raw: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const sp = new URLSearchParams();
  const lim = Math.min(80, Math.max(1, Number(String(raw.limit ?? "40")) || 40));
  sp.set("limit", String(lim));

  const scope = String(raw.statusScope ?? "completed");
  if (scope === "all") {
    sp.set("completedOnly", "0");
  } else if (scope === "in_progress") {
    sp.set("status", "IN_PROGRESS");
  }

  const pathwayId = typeof raw.pathwayId === "string" ? raw.pathwayId.trim() : "";
  if (pathwayId) sp.set("pathwayId", pathwayId);

  const catExamConfigId = typeof raw.catExamConfigId === "string" ? raw.catExamConfigId.trim() : "";
  if (catExamConfigId) sp.set("catExamConfigId", catExamConfigId);

  if (raw.lowQualityOnly === "1") {
    sp.set("lowQualityOnly", "1");
  }

  return sp;
}

export default async function AdminCatBlueprintSessionsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const thresholds = getCatBlueprintQualityThresholds();
  const raw = (await searchParams) ?? {};
  const querySp = buildSessionsSearchParams(raw);
  const { sessions } = await queryCatBlueprintSessionsForAdmin(querySp);

  const csvSp = new URLSearchParams(querySp);
  csvSp.set("format", "csv");
  const csvHref = `/api/admin/cat-blueprint-sessions?${csvSp.toString()}`;
  const jsonSp = new URLSearchParams(querySp);
  const jsonHref = `/api/admin/cat-blueprint-sessions?${jsonSp.toString()}`;

  const statusScope = String(raw.statusScope ?? "completed");
  const pathwayIdValue = typeof raw.pathwayId === "string" ? raw.pathwayId : "";
  const catExamConfigIdValue = typeof raw.catExamConfigId === "string" ? raw.catExamConfigId : "";
  const lowQualityChecked = raw.lowQualityOnly === "1";
  const limitValue = String(querySp.get("limit") ?? "40");

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Operations</p>
      <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">CAT blueprint session diagnostics</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Pool/session mapping rates and fallback hints come from stored{" "}
        <code className="rounded bg-muted px-1 text-xs">results.catReport</code>. Default view is{" "}
        <span className="font-medium text-foreground">completed</span> sessions only; widen with filters below. Warning
        thresholds (non-blocking): pool {thresholds.poolMappedFractionWarning * 100}% (exam simulation), session{" "}
        {thresholds.sessionMappedFractionWarning * 100}% — from{" "}
        <code className="rounded bg-muted px-1 text-xs">cat-blueprint-thresholds.ts</code>.
      </p>

      <form
        method="get"
        className="mt-4 flex flex-col gap-3 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 text-sm"
      >
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Status scope</span>
            <select
              name="statusScope"
              defaultValue={statusScope}
              className="rounded-md border border-border bg-background px-2 py-1.5"
            >
              <option value="completed">Completed only (default)</option>
              <option value="all">All statuses</option>
              <option value="in_progress">In progress only</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Limit</span>
            <input
              name="limit"
              type="number"
              min={1}
              max={80}
              defaultValue={limitValue}
              className="w-24 rounded-md border border-border bg-background px-2 py-1.5 tabular-nums"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">pathwayId</span>
            <input
              name="pathwayId"
              type="text"
              placeholder="e.g. us-np-fnp"
              defaultValue={pathwayIdValue}
              className="min-w-[180px] rounded-md border border-border bg-background px-2 py-1.5 font-mono text-xs"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">catExamConfigId</span>
            <input
              name="catExamConfigId"
              type="text"
              placeholder="e.g. nclex-rn-us"
              defaultValue={catExamConfigIdValue}
              className="min-w-[180px] rounded-md border border-border bg-background px-2 py-1.5 font-mono text-xs"
            />
          </label>
          <label className="flex items-center gap-2 pt-5">
            <input type="checkbox" name="lowQualityOnly" value="1" defaultChecked={lowQualityChecked} />
            <span className="text-muted-foreground">Low quality only</span>
          </label>
          <button
            type="submit"
            className="mt-5 rounded-lg bg-primary px-3 py-2 font-semibold text-primary-foreground hover:opacity-90"
          >
            Apply
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <a
          className="rounded-lg border border-border bg-primary/10 px-3 py-2 font-semibold text-primary hover:bg-primary/15"
          href={jsonHref}
          target="_blank"
          rel="noreferrer"
        >
          JSON API (current filters)
        </a>
        <a
          className="rounded-lg border border-border px-3 py-2 font-semibold text-foreground hover:bg-muted"
          href={csvHref}
          target="_blank"
          rel="noreferrer"
        >
          Export CSV (current filters)
        </a>
        <Link href="/admin/questions/nclex-mapping" className="rounded-lg border border-border px-3 py-2 hover:bg-muted">
          NCLEX mapping remediation
        </Link>
        <Link href="/admin/diagnostics" className="rounded-lg border border-border px-3 py-2 hover:bg-muted">
          Diagnostics home
        </Link>
      </div>

      <div className="mt-6 overflow-auto rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-2">
        <table className="w-full min-w-[900px] text-left text-xs sm:text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="p-2">Practice test</th>
              <th className="p-2">User</th>
              <th className="p-2">Pathway</th>
              <th className="p-2">Exam cfg</th>
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
            {sessions.map((s) => {
              const poolPct = s.poolMappedFraction != null ? Math.round(s.poolMappedFraction * 100) : null;
              const sessionPct = s.sessionMappedFraction != null ? Math.round(s.sessionMappedFraction * 100) : null;
              const warnCount = s.mappingQualityWarnings?.length ?? 0;
              const topFallback = s.topFallbackBlueprintKeysDelivered?.[0]?.blueprintKey ?? null;
              return (
                <tr key={s.practiceTestId} className="border-b border-border/40">
                  <td className="p-2 font-mono text-[11px]">{s.practiceTestId.slice(0, 12)}…</td>
                  <td className="p-2 font-mono">{s.userId.slice(0, 8)}…</td>
                  <td className="max-w-[100px] truncate p-2 font-mono text-[11px]" title={s.pathwayId ?? ""}>
                    {s.pathwayId ?? "—"}
                  </td>
                  <td className="max-w-[120px] truncate p-2 font-mono text-[11px]" title={s.catExamConfigId ?? ""}>
                    {s.catExamConfigId ?? "—"}
                  </td>
                  <td className="p-2">{s.catPresentationMode}</td>
                  <td className="p-2 text-right tabular-nums">{s.hasBlueprintReport ? (poolPct ?? "—") : "—"}</td>
                  <td className="p-2 text-right tabular-nums">{s.hasBlueprintReport ? (sessionPct ?? "—") : "—"}</td>
                  <td className="p-2 text-right tabular-nums">{s.deliveredMappedCount ?? "—"}</td>
                  <td className="p-2 text-right tabular-nums">{s.deliveredFallbackCount ?? "—"}</td>
                  <td className="max-w-[140px] truncate p-2" title={topFallback ?? ""}>
                    {topFallback ?? "—"}
                  </td>
                  <td className="p-2 text-right tabular-nums">{warnCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sessions.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No CAT sessions match the current filters.</p>
        ) : null}
      </div>
    </main>
  );
}
