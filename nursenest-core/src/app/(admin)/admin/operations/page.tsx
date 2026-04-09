import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadAdminDiagnostics } from "@/lib/admin/load-admin-diagnostics";
import { loadAdminOperationsHealth } from "@/lib/admin/load-admin-operations-health";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { AdminOperationsConsole } from "@/components/admin/admin-operations-console";

export const dynamic = "force-dynamic";

export default async function AdminOperationsPage() {
  await requireAdmin();
  const [d, health] = await Promise.all([loadAdminDiagnostics(), loadAdminOperationsHealth()]);
  const safe = isRuntimeSafeMode();

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Operations &amp; automation</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Live queue depth, content automation failures, AI generation errors, publish/schedule signals, and billing
            hints from Postgres. Stripe financial detail stays in the Stripe Dashboard — webhook receipt counts here are
            activity-only.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin" className="text-primary underline">
            ← Overview
          </Link>
          <Link href="/admin/automation-logs" className="text-muted-foreground underline">
            Automation logs
          </Link>
          <Link href="/admin/diagnostics" className="text-muted-foreground underline">
            Diagnostics
          </Link>
        </div>
      </div>

      <div className="mt-2 text-xs text-muted-foreground">
        Safe mode: <strong>{safe ? "on" : "off"}</strong> · Diagnostics DB: <strong>{d.dbHealth.status}</strong>
        {d.dbHealth.latencyMs != null ? ` (${d.dbHealth.latencyMs}ms)` : ""}
      </div>

      <div className="mt-8">
        <AdminOperationsConsole initialHealth={health} diagnostics={d} />
      </div>
    </main>
  );
}
