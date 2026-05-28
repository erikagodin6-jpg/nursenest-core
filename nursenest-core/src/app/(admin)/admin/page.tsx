import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { getStaffSession } from "@/lib/auth/staff-session";
import type { StaffTier } from "@/lib/auth/staff-roles";
import { loadAdminCommandCenter } from "@/lib/admin/load-admin-command-center";
import { loadAdminDashboardOverview } from "@/lib/admin/load-admin-dashboard-overview";
import { AdminCommandCenter } from "@/components/admin/admin-command-center";
import { AdminDashboardOverview } from "@/components/admin/admin-dashboard-overview";
import { AdminUserStatsPanel } from "@/components/admin/admin-user-stats-panel";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

function AdminPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8" data-testid="admin-dashboard-shell">
      <header className="mb-6 flex min-w-0 flex-col gap-4 rounded-3xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Operations</p>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] md:text-3xl">
            Admin command center
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--semantic-text-secondary)]">
            A focused staff console for platform health, learners, content, revenue, and fraud signals. Open the
            dedicated analytics pages when you need deeper investigation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            className="rounded-xl border border-border/80 px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            href="/admin/observability"
          >
            Observability
          </Link>
          <Link
            className="rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/15"
            href="/admin/analytics"
          >
            Analytics hub
          </Link>
        </div>
      </header>
      {children}
    </main>
  );
}

function AdminFocusLinks() {
  const links = [
    {
      href: "/admin/analytics",
      title: "Analytics hub",
      copy: "Traffic, engagement, subscriptions, study activity, and anti-fraud telemetry.",
    },
    {
      href: "/admin/users",
      title: "Users & support",
      copy: "Look up learners, review activity evidence, support subscriptions, and inspect risk flags.",
    },
    {
      href: "/admin/content",
      title: "Content quality",
      copy: "Audit lessons, question banks, pathway coverage, and content readiness.",
    },
    {
      href: "/admin/hub/publishing",
      title: "Publishing",
      copy: "Manage blog publishing, SEO workflows, and queued content operations.",
    },
    {
      href: "/admin/subscriptions",
      title: "Billing",
      copy: "Review subscriptions, trials, revenue health, and cancellation states.",
    },
    {
      href: "/admin/operations",
      title: "Operations",
      copy: "System health, jobs, diagnostics, and internal reliability tools.",
    },
  ];

  return (
    <section className="mt-6" aria-labelledby="admin-focus-links-heading">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 id="admin-focus-links-heading" className="text-lg font-bold text-[var(--semantic-text-primary)]">
            Priority workspaces
          </h2>
          <p className="text-sm text-[var(--semantic-text-muted)]">
            Consolidated entry points replace the older duplicated dashboard blocks.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group min-w-0 rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
          >
            <span className="text-sm font-bold text-[var(--semantic-text-primary)] group-hover:text-primary">
              {link.title}
            </span>
            <span className="mt-1 block text-sm leading-6 text-[var(--semantic-text-secondary)]">{link.copy}</span>
          </Link>
        ))}
      </div>
    </section>
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
          Operations
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
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Suspense fallback={<AdminOverviewFallback />}>
          <AdminOverviewSection />
        </Suspense>
        <AdminUserStatsPanel />
      </div>

      <AdminFocusLinks />

      <Suspense fallback={<AdminCommandCenterFallback />}>
        <AdminCommandCenterSection />
      </Suspense>
    </AdminPageShell>
  );
}
