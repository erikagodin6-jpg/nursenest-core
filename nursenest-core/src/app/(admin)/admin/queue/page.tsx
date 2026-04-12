import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadAdminRecentBackgroundJobs } from "@/lib/admin/load-admin-recent-background-jobs";

export const dynamic = "force-dynamic";

function fmt(d: Date): string {
  return d.toISOString().replace("T", " ").slice(0, 19) + "Z";
}

export default async function AdminQueuePage() {
  await requireAdmin();
  const { jobs, degraded } = await loadAdminRecentBackgroundJobs(60);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Automation</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Queue &amp; background jobs</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Recent rows from <code className="rounded bg-muted px-1">background_jobs</code>. This page loads once per
            request—refresh to see new status (no live polling).
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/admin/generation" className="text-primary underline">
            Content generation hub →
          </Link>
          <Link href="/admin/automation-logs" className="text-primary underline">
            Automation logs →
          </Link>
          <Link href="/admin/operations" className="text-primary underline">
            Operations →
          </Link>
        </div>
      </div>

      {degraded ? (
        <p className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          Database unavailable—job list empty. Try again when the DB is reachable.
        </p>
      ) : null}

      <section className="mt-8 nn-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Attempts</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3 font-semibold">Last error</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 && !degraded ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    No background jobs yet.
                  </td>
                </tr>
              ) : null}
              {jobs.map((j) => (
                <tr key={j.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium">{j.status}</td>
                  <td className="px-4 py-3 font-mono text-xs">{j.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {j.attempts}/{j.maxAttempts}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{fmt(j.updatedAt)}</td>
                  <td className="max-w-[320px] truncate px-4 py-3 text-xs text-destructive" title={j.lastError ?? ""}>
                    {j.lastError ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-6 text-xs text-muted-foreground">
        Admin API: <code className="rounded bg-muted px-1">GET /api/admin/jobs</code> for filtered pagination.
      </p>
    </main>
  );
}
