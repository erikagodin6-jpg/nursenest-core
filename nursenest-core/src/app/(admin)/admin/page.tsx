import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { getStaffSession } from "@/lib/auth/staff-session";
import type { StaffTier } from "@/lib/auth/staff-roles";
import { loadAdminCommandCenter } from "@/lib/admin/load-admin-command-center";
import { loadAdminDashboardOverview } from "@/lib/admin/load-admin-dashboard-overview";
import { AdminCommandCenter } from "@/components/admin/admin-command-center";
import { AdminDashboardOverview } from "@/components/admin/admin-dashboard-overview";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

function AdminPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8" data-testid="admin-dashboard-shell">
      <header className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] md:text-3xl">Admin Dashboard</h1>
        <p className="max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
          Operations, content, and platform health for authenticated staff.
        </p>
      </header>
      {children}
    </main>
  );
}

function AdminOverviewFallback() {
  return (
    <div
      className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 text-sm text-[var(--semantic-text-secondary)]"
      data-testid="admin-overview-pending"
      role="status"
    >
      Loading overview metrics…
    </div>
  );
}

async function AdminOverviewSection() {
  const overview = await loadAdminDashboardOverview().catch((e) => {
    console.error("[AdminPage] loadAdminDashboardOverview", e);
    safeServerLog("admin_dashboard", "overview_load_failed", {
      detail: e instanceof Error ? e.message.slice(0, 180) : "unknown",
    });
    return null;
  });

  if (!overview) {
    return (
      <div
        className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-warm)] p-6 text-sm text-[var(--semantic-text-secondary)]"
        data-testid="admin-overview-fallback"
        role="status"
      >
        Overview metrics could not be loaded. Check database connectivity or{" "}
        <Link className="font-semibold text-[var(--semantic-brand)] underline" href="/admin/system-status">
          system status
        </Link>
        .
      </div>
    );
  }

  return <AdminDashboardOverview data={overview} showHeader={false} />;
}

function AdminCommandCenterFallback() {
  return (
    <div
      className="mt-10 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm text-[var(--semantic-text-secondary)]"
      data-testid="admin-command-center-pending"
      role="status"
    >
      Loading the extended command center…
    </div>
  );
}

async function AdminCommandCenterSection() {
  const staff = await getStaffSession().catch(() => null);
  const staffTier: StaffTier = staff?.tier ?? "super";
  const commandCenter = await loadAdminCommandCenter().catch((e) => {
    console.error("[AdminPage] loadAdminCommandCenter", e);
    safeServerLog("admin_dashboard", "command_center_load_failed", {
      detail: e instanceof Error ? e.message.slice(0, 180) : "unknown",
    });
    return null;
  });

  if (!commandCenter) {
    return (
      <div
        className="mt-10 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm text-[var(--semantic-text-secondary)]"
        data-testid="admin-command-center-fallback"
        role="status"
      >
        Extended command center metrics are unavailable. Open{" "}
        <Link className="font-semibold underline" href="/admin/operations">
          operations
        </Link>{" "}
        for tooling.
      </div>
    );
  }

  return (
    <section className="mt-10 space-y-3" data-testid="admin-command-center-section">
      <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Platform command center</h2>
      <p className="text-sm text-[var(--semantic-text-muted)]">
        Deeper operational metrics stream in after the admin shell so `/admin` stays responsive.
      </p>
      <AdminCommandCenter data={commandCenter} staffTier={staffTier} />
    </section>
  );
}

export default async function AdminPage() {
  await requireAdmin();
  return (
    <AdminPageShell>
      <Suspense fallback={<AdminOverviewFallback />}>
        <AdminOverviewSection />
      </Suspense>

      <Suspense fallback={<AdminCommandCenterFallback />}>
        <AdminCommandCenterSection />
      </Suspense>
    </AdminPageShell>
  );
}
