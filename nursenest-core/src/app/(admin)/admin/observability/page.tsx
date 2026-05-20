import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { getStaffSession } from "@/lib/auth/staff-session";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { loadAdminObservabilityHub } from "@/lib/admin/load-admin-observability-hub";
import { AdminObservabilityHubMetrics } from "@/components/admin/admin-observability-hub-metrics";
import { AdminObservabilityLearnerRoster } from "@/components/admin/admin-observability-learner-roster.client";

export const dynamic = "force-dynamic";

export default async function AdminObservabilityPage() {
  await requireAdmin();
  const staff = await getStaffSession().catch(() => null);
  const tier = staff?.tier ?? "super";
  const canRoster = tier === "super" || tier === "support";

  const hub = await loadAdminObservabilityHub().catch(() => null);
  const pathwayOptions = EXAM_PATHWAYS.slice(0, 40).map((p) => ({ id: p.id, label: p.displayName }));

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8" data-testid="admin-observability-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--semantic-text-primary)]">Observability hub</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--semantic-text-secondary)]">
            One-stop snapshot for study-system usage, subscription health, content gaps, and (for support/super) a
            filterable learner roster. Payloads stay bounded; deep scans stay behind existing APIs and workflows.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin" className="text-[var(--semantic-brand)] underline">
            ← Command center
          </Link>
          <Link href="/admin/diagnostics" className="text-[var(--semantic-text-secondary)] underline">
            Diagnostics
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-positive)]/10 px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
        <strong className="text-[var(--semantic-text-primary)]">Staff-only.</strong> Never embed these metrics on public
        routes. Aggregated hub JSON:{" "}
        <code className="rounded bg-[var(--semantic-surface)] px-1 py-0.5 text-xs">GET /api/admin/observability/hub</code>
      </div>

      {!hub ? (
        <div
          className="mt-8 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-warm)]/20 p-6 text-sm text-[var(--semantic-text-secondary)]"
          role="status"
        >
          Observability metrics are unavailable (database off or safe mode). Try{" "}
          <Link href="/admin/system-status" className="font-semibold text-[var(--semantic-brand)] underline">
            system status
          </Link>
          .
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          <AdminObservabilityHubMetrics hub={hub} />
          <AdminObservabilityLearnerRoster canLoad={canRoster} pathwayOptions={pathwayOptions} />
        </div>
      )}
    </main>
  );
}
