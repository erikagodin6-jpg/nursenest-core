import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadRevenueProtectionDashboard } from "@/lib/business-protection/revenue-protection-center.server";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ q?: string }>;
};

function scoreTone(score: number): string {
  if (score >= 85) return "text-emerald-700 dark:text-emerald-300";
  if (score >= 70) return "text-amber-700 dark:text-amber-300";
  return "text-rose-700 dark:text-rose-300";
}

function stat(label: string, value: string | number, detail?: string) {
  return (
    <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{value}</p>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </div>
  );
}

export default async function AdminRevenueProtectionPage({ searchParams }: PageProps) {
  await requireAdmin();
  const sp = (await searchParams) ?? {};
  const query = sp.q?.trim() ?? "";
  const data = await loadRevenueProtectionDashboard({ query });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Revenue protection</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Revenue Protection Center</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Dispute-ready evidence for digital service acknowledgement, refund acknowledgement, subscription lifecycle,
            login history, study activity, content consumption, and session duration.
          </p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-primary underline">
          ← Overview
        </Link>
      </div>

      <form className="mt-6 flex flex-col gap-3 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 sm:flex-row sm:items-end">
        <label className="min-w-0 flex-1 text-sm font-semibold text-[var(--theme-heading-text)]">
          Search learner
          <input
            name="q"
            defaultValue={query}
            placeholder="Email, name, or user id"
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/60"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
        >
          Review evidence
        </button>
      </form>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stat("Reviewed", data.summary.subscribersReviewed, query ? "Search results" : "Recent subscription rows")}
        {stat("Avg. protection", `${data.summary.averageProtectionScore}/100`, "Evidence completeness")}
        {stat("Critical risk", data.summary.criticalRiskCount, "Missing multiple evidence groups")}
        {stat("Refund ack gaps", data.summary.missingRefundAcknowledgementCount, "Checkout wording missing")}
        {stat("Recent exports", data.summary.recentExportCount, "Audited evidence packages")}
      </section>

      <section className="mt-8 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Chargeback evidence packages</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              One-click exports are logged in immutable audit records.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Generated {new Date(data.generatedAt).toLocaleString()}</p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-2 pr-3">Learner</th>
                <th className="py-2 pr-3">Plan</th>
                <th className="py-2 pr-3">Evidence score</th>
                <th className="py-2 pr-3">Missing</th>
                <th className="py-2 pr-3">Last evidence</th>
                <th className="py-2">Export</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.userId} className="border-b border-border/50 align-top">
                  <td className="py-3 pr-3">
                    <Link href={`/admin/users/${row.userId}`} className="font-semibold text-primary underline">
                      {row.name || "(no name)"}
                    </Link>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">{row.email}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{row.userId}</p>
                  </td>
                  <td className="py-3 pr-3">
                    <p>{row.planCode ?? "No plan code"}</p>
                    <p className="text-xs text-muted-foreground">{row.subscriptionStatus ?? "No subscription row"}</p>
                  </td>
                  <td className="py-3 pr-3">
                    <p className={`text-lg font-bold tabular-nums ${scoreTone(row.package.protectionScore)}`}>
                      {row.package.protectionScore}/100
                    </p>
                    <p className="text-xs capitalize text-muted-foreground">{row.package.riskLevel.replaceAll("_", " ")}</p>
                  </td>
                  <td className="py-3 pr-3">
                    {row.package.missingEvidence.length > 0 ? (
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {row.package.missingEvidence.slice(0, 4).map((item) => (
                          <li key={item.key}>{item.label}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Complete</span>
                    )}
                  </td>
                  <td className="py-3 pr-3 text-xs text-muted-foreground">
                    {row.lastActiveAt ? new Date(row.lastActiveAt).toLocaleString() : "Not recorded"}
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/api/admin/revenue-protection/users/${encodeURIComponent(row.userId)}/chargeback-package`}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-[var(--theme-heading-text)] transition hover:border-primary/40"
                      >
                        JSON
                      </Link>
                      <Link
                        href={`/api/admin/revenue-protection/users/${encodeURIComponent(row.userId)}/chargeback-package?format=txt`}
                        className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/15"
                      >
                        Download
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No learners found for this revenue protection view.</p>
          ) : null}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Recent audited exports</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-2 pr-3">Created</th>
                <th className="py-2 pr-3">User</th>
                <th className="py-2 pr-3">Format</th>
                <th className="py-2">Generated by</th>
              </tr>
            </thead>
            <tbody>
              {data.recentExports.map((row) => (
                <tr key={`${row.userId}-${row.createdAt}-${row.format}`} className="border-b border-border/50">
                  <td className="py-2 pr-3 text-xs">{new Date(row.createdAt).toLocaleString()}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{row.userId}</td>
                  <td className="py-2 pr-3">{row.format}</td>
                  <td className="py-2 font-mono text-xs text-muted-foreground">{row.generatedByUserId ?? "not recorded"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.recentExports.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">No evidence exports recorded yet.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
