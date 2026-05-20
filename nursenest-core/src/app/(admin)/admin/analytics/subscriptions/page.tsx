import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import {
  loadAdminSubscriptionAnalytics,
  parseSubscriptionAnalyticsSearchParams,
} from "@/lib/admin/load-admin-subscription-analytics";
import { AdminSubscriptionAnalyticsDashboard } from "@/components/admin/analytics/admin-subscription-analytics-dashboard";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminSubscriptionAnalyticsPage({ searchParams }: Props) {
  await requireAdmin();
  const raw = (await searchParams) ?? {};
  const parsed = parseSubscriptionAnalyticsSearchParams(raw);
  const data = await loadAdminSubscriptionAnalytics(parsed);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Analytics</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Subscriptions &amp; revenue signals</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Operational view from NurseNest database rows (status, plan tier/country, trials, pathways). Dollar amounts and
            billing-period renewal dates stay in Stripe — gaps are called out explicitly.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/subscriptions" className="text-primary underline">
            Subscription rows
          </Link>
          <Link href="/admin/analytics" className="text-muted-foreground underline">
            ← Analytics hub
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <AdminSubscriptionAnalyticsDashboard
          initialData={data}
          initialQuery={{ fromDay: parsed.fromDay, toDay: parsed.toDay }}
        />
      </div>
    </main>
  );
}
