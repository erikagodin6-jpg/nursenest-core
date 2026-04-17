import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { getStaffSession } from "@/lib/auth/staff-session";
import type { StaffTier } from "@/lib/auth/staff-roles";
import { loadAdminCommandCenter } from "@/lib/admin/load-admin-command-center";
import { loadAdminDashboardOverview } from "@/lib/admin/load-admin-dashboard-overview";
import { AdminCommandCenter } from "@/components/admin/admin-command-center";
import { AdminDashboardOverview } from "@/components/admin/admin-dashboard-overview";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();

  const [overview, commandCenter] = await Promise.all([
    loadAdminDashboardOverview().catch((e) => {
      console.error("[AdminPage] loadAdminDashboardOverview", e);
      return null;
    }),
    loadAdminCommandCenter().catch((e) => {
      console.error("[AdminPage] loadAdminCommandCenter", e);
      return null;
    }),
  ]);

  const staff = await getStaffSession();
  const staffTier: StaffTier = staff?.tier ?? "super";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {overview ? (
        <AdminDashboardOverview data={overview} />
      ) : (
        <div
          className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-warm)] p-6 text-sm text-[var(--semantic-text-secondary)]"
          role="status"
        >
          Overview metrics could not be loaded. Check database connectivity or{" "}
          <Link className="font-semibold text-[var(--semantic-brand)] underline" href="/admin/system-status">
            system status
          </Link>
          .
        </div>
      )}

      {commandCenter ? (
        <div className="mt-10 space-y-3">
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Platform command center</h2>
          <p className="text-sm text-[var(--semantic-text-muted)]">
            Deeper operational metrics (safe partial data — individual blocks may hide on error).
          </p>
          <AdminCommandCenter data={commandCenter} staffTier={staffTier} />
        </div>
      ) : (
        <div
          className="mt-10 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm text-[var(--semantic-text-secondary)]"
          role="status"
        >
          Extended command center metrics are unavailable. Open{" "}
          <Link className="font-semibold underline" href="/admin/operations">
            operations
          </Link>{" "}
          for tooling.
        </div>
      )}
    </main>
  );
}
