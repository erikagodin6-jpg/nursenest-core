import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadAdminDiagnostics } from "@/lib/admin/load-admin-diagnostics";
import { loadAdminOperationsHealth } from "@/lib/admin/load-admin-operations-health";
import { AdminOperationsConsole } from "@/components/admin/admin-operations-console";

export const dynamic = "force-dynamic";

export default async function AdminOperationsPage() {
  await requireAdmin();
  const [d, health] = await Promise.all([loadAdminDiagnostics(), loadAdminOperationsHealth()]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Operations &amp; health</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Live signals from Postgres: background jobs, content automation logs, AI generation runs, publish/schedule rows,
            draft review backlogs, and subscription/Stripe webhook volume. Use drill-down links for full logs — nothing here is
            a vanity metric.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin" className="text-primary underline">
            ← Overview
          </Link>
          <Link href="/admin/automation-logs" className="text-muted-foreground underline">
            Automation logs
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <AdminOperationsConsole diagnostics={d} initialHealth={health} />
      </div>
    </main>
  );
}
