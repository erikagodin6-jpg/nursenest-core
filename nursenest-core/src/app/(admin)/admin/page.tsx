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
    <main
      className="nn-admin-happy-main mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      data-testid="admin-dashboard-shell"
    >
      <header className="nn-admin-happy-hero mb-10 flex min-w-0 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 space-y-3">
          <p className="nn-admin-happy-eyebrow">Operations</p>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] md:text-3xl">
            Admin command center
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[var(--semantic-text-secondary)]">
            A bright, calm staff console for platform health, learners, content, revenue, and fraud signals. Open
            dedicated analytics pages when you need deeper investigation.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="nn-admin-happy-btn nn-admin-happy-btn--blue" href="/admin/observability">
            Observability
          </Link>
          <Link className="nn-admin-happy-btn nn-admin-happy-btn--primary" href="/admin/analytics">
            Analytics hub
          </Link>
        </div>
      </header>
      {children}
    </main>
  );
}

type WorkspaceAccent = "blue" | "yellow" | "green" | "blush";

function AdminFocusLinks() {
  const links: {
    href: string;
    title: string;
    copy: string;
    accent: WorkspaceAccent;
  }[] = [
    {
      href: "/admin/analytics",
      title: "Analytics hub",
      copy: "Traffic, engagement, subscriptions, study activity, and anti-fraud telemetry.",
      accent: "yellow",
    },
    {
      href: "/admin/users",
      title: "Users & support",
      copy: "Look up learners, review activity evidence, support subscriptions, and inspect risk flags.",
      accent: "blush",
    },
    {
      href: "/admin/content",
      title: "Content quality",
      copy: "Audit lessons, question banks, pathway coverage, and content readiness.",
      accent: "blue",
    },
    {
      href: "/admin/content-command-center",
      title: "Content command center",
      copy: "Unified content quality, rationale, scope, curriculum, freshness, and review queues.",
      accent: "blue",
    },
    {
      href: "/admin/curriculum-coverage",
      title: "Curriculum coverage",
      copy: "Map questions, flashcards, lessons, simulations, ECG, pharmacology, and clinical skills to exam competencies.",
      accent: "green",
    },
    {
      href: "/admin/hub/publishing",
      title: "Publishing",
      copy: "Manage blog publishing, SEO workflows, and queued content operations.",
      accent: "green",
    },
    {
      href: "/admin/subscriptions",
      title: "Billing",
      copy: "Review subscriptions, trials, revenue health, and cancellation states.",
      accent: "yellow",
    },
    {
      href: "/admin/revenue-protection",
      title: "Revenue protection",
      copy: "Generate chargeback evidence packages from acknowledgements, billing, sessions, and learning activity.",
      accent: "blue",
    },
    {
      href: "/admin/referrals",
      title: "Referrals",
      copy: "Manage invite rewards, qualification gates, paid conversions, and fraud review.",
      accent: "blush",
    },
    {
      href: "/admin/operations",
      title: "Operations",
      copy: "System health, jobs, diagnostics, and internal reliability tools.",
      accent: "green",
    },
  ];

  return (
    <section className="mt-12" aria-labelledby="admin-focus-links-heading">
      <div className="mb-6 space-y-2">
        <h2 id="admin-focus-links-heading" className="text-lg font-bold text-[var(--semantic-text-primary)]">
          Priority workspaces
        </h2>
        <p className="text-sm leading-6 text-[var(--semantic-text-muted)]">
          Consolidated entry points — clear, colorful, and easy to scan.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="nn-admin-happy-workspace group min-w-0"
          >
            <span
              className={`nn-admin-happy-card-accent nn-admin-happy-card-accent--${link.accent}`}
              aria-hidden
            />
            <span className="block text-sm font-bold text-[var(--semantic-text-primary)] group-hover:text-[var(--semantic-info-contrast)]">
              {link.title}
            </span>
            <span className="mt-2 block text-sm leading-6 text-[var(--semantic-text-secondary)]">{link.copy}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function AdminOverviewFallback() {
  return (
    <div
      className="nn-admin-happy-card text-sm text-[var(--semantic-text-secondary)]"
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
        className="nn-admin-happy-card text-sm text-[var(--semantic-text-secondary)]"
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
      className="nn-admin-happy-card mt-12 text-sm text-[var(--semantic-text-secondary)]"
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
        className="nn-admin-happy-card mt-12 text-sm text-[var(--semantic-text-secondary)]"
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
    <section className="mt-12 space-y-4" data-testid="admin-command-center-section">
      <div className="nn-admin-happy-footer-strip text-sm">
        Platform command center — deeper operational metrics stream in after the shell so{" "}
        <code className="rounded bg-white/80 px-1 text-xs">/admin</code> stays responsive.
      </div>
      <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Platform command center</h2>
      <AdminCommandCenter data={commandCenter} staffTier={staffTier} />
    </section>
  );
}

export default async function AdminPage() {
  await requireAdmin();
  return (
    <AdminPageShell>
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
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
