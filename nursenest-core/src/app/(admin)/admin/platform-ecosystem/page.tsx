import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { getStaffSession } from "@/lib/auth/staff-session";
import { loadAdminEcosystemReadinessRegistry } from "@/lib/admin/admin-ecosystem-readiness-registry";
import { AdminEcosystemReadinessPanel } from "@/components/admin/admin-ecosystem-readiness-panel";

export const dynamic = "force-dynamic";

export default async function AdminPlatformEcosystemPage() {
  await requireAdmin();
  await getStaffSession().catch(() => null);

  const registry = loadAdminEcosystemReadinessRegistry();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8" data-testid="admin-platform-ecosystem-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--semantic-text-primary)]">Platform ecosystem readiness</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--semantic-text-secondary)]">
            Phase 10B internal overview: extensibility contracts, marketplace direction (metadata only), integration event
            taxonomy, and governance samples. All rows are admin-managed summaries — not runtime configuration.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin" className="text-[var(--semantic-brand)] underline">
            ← Command center
          </Link>
          <Link href="/admin/observability" className="text-[var(--semantic-text-secondary)] underline">
            Observability
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <AdminEcosystemReadinessPanel
          capabilities={[...registry.capabilities]}
          plannedPlugins={[...registry.plannedPlugins]}
          marketplaceSamples={[...registry.marketplaceSamples]}
          integrationContracts={[...registry.integrationContracts]}
          governance={[...registry.governance]}
          moderationStates={[...registry.moderationStates]}
        />
      </div>
    </main>
  );
}
