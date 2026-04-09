import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadAdminAnalyticsDashboard } from "@/lib/admin/load-admin-analytics-dashboard";
import { AdminAnalyticsDashboard } from "@/components/admin/analytics/admin-analytics-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  const data = await loadAdminAnalyticsDashboard();

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Analytics</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Performance & usage</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Database-backed operational metrics: content signals, learner activity, subscriptions, and automation health. Metrics
            that are not stored in Postgres are called out explicitly — no placeholder KPIs.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin" className="text-primary underline">
            ← Overview
          </Link>
          <Link href="/admin/inventory" className="text-muted-foreground underline">
            Inventory
          </Link>
          <Link href="/admin/hub/publishing" className="text-muted-foreground underline">
            Publishing
          </Link>
          <Link href="/admin/operations" className="text-muted-foreground underline">
            Operations
          </Link>
          <Link href="/admin/diagnostics" className="text-muted-foreground underline">
            Diagnostics
          </Link>
          <Link href="/admin/analytics/users" className="text-primary underline">
            User analytics
          </Link>
          <Link href="/admin/analytics/funnels" className="text-primary underline">
            Funnels →
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <AdminAnalyticsDashboard initialData={data} />
      </div>
    </main>
  );
}
