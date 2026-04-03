import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadAdminDiagnostics } from "@/lib/admin/load-admin-diagnostics";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";

export const dynamic = "force-dynamic";

export default async function AdminOperationsPage() {
  await requireAdmin();
  const d = await loadAdminDiagnostics();
  const safe = isRuntimeSafeMode();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Operations & health</h1>
          <p className="mt-1 text-sm text-muted-foreground">Database + optional HTTP probes + safe mode.</p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-primary underline">
          ← Overview
        </Link>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="nn-card p-6">
          <h2 className="text-lg font-semibold">Database</h2>
          <p className="mt-2 text-sm">
            Status: <strong>{d.dbHealth.status}</strong>
            {d.dbHealth.latencyMs != null ? ` · ${d.dbHealth.latencyMs}ms` : ""}
          </p>
          {d.dbHealth.error ? <p className="mt-2 text-sm text-rose-700">{d.dbHealth.error}</p> : null}
        </div>
        <div className="nn-card p-6">
          <h2 className="text-lg font-semibold">Safe mode</h2>
          <p className="mt-2 text-sm">{safe ? "ON (reduced writes / metrics)" : "Off"}</p>
        </div>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">HTTP probes</h2>
        {d.apiHealth.probed ? (
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              {d.apiHealth.liveness.path}: {d.apiHealth.liveness.ok ? "ok" : "fail"}{" "}
              {d.apiHealth.liveness.status ? `(${d.apiHealth.liveness.status})` : ""}
            </li>
            <li>
              {d.apiHealth.readiness.path}: {d.apiHealth.readiness.ok ? "ok" : "fail"}{" "}
              {d.apiHealth.readiness.status ? `(${d.apiHealth.readiness.status})` : ""}
            </li>
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No public base URL. Probes skipped.</p>
        )}
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">JSON diagnostics</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm">
          <li>
            <Link className="text-primary underline" href="/api/admin/diagnostics">
              /api/admin/diagnostics
            </Link>
          </li>
          <li>
            <Link className="text-primary underline" href="/api/admin/operations-dashboard">
              /api/admin/operations-dashboard
            </Link>
          </li>
          <li>
            <Link className="text-primary underline" href="/admin/diagnostics">
              HTML diagnostics dashboard
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
