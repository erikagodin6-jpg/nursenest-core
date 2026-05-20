import Link from "next/link";
import { runSystemStatusProbes } from "@/lib/admin/system-status";
import { SystemStatusDashboard } from "@/components/admin/system-status-dashboard";

export const dynamic = "force-dynamic";

/** Parent `admin/layout` runs `requireAdmin` — avoids duplicate auth/session work on this page. */
export default async function AdminSystemStatusPage() {
  const initial = await runSystemStatusProbes();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Platform</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">System status</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            End-to-end operational checks (liveness, readiness, database, auth, integrations, queues, content). Refreshed on
            demand — not cached. No secret values are exposed.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin" className="rounded-lg border border-border px-3 py-2 font-medium hover:bg-muted">
            ← Command center
          </Link>
          <Link
            href="/api/admin/system-status"
            className="rounded-lg border border-border px-3 py-2 font-medium text-primary underline-offset-4 hover:underline"
          >
            JSON API
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <SystemStatusDashboard initial={initial} />
      </div>
    </main>
  );
}
