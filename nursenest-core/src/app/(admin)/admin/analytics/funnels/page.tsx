import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadAdminFunnelAnalytics, parseFunnelSearchParams } from "@/lib/admin/load-admin-funnel-analytics";
import { AdminFunnelAnalyticsDashboard } from "@/components/admin/analytics/admin-funnel-analytics-dashboard";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminFunnelAnalyticsPage({ searchParams }: Props) {
  await requireAdmin();
  const raw = (await searchParams) ?? {};
  const parsed = parseFunnelSearchParams(raw);
  const data = await loadAdminFunnelAnalytics(parsed);

  const initialQuery = {
    fromDay: parsed.fromDay,
    toDay: parsed.toDay,
    country: parsed.segment.country,
    pathway: parsed.segment.pathway,
  };

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Analytics</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Funnel &amp; conversion</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Step volumes from PostHog (unique persons per event) when the query API is configured; otherwise
            database proxies for signups, subscriptions, and first progress. No PII is stored in-app for PostHog
            events beyond hashed distinct ids.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/analytics" className="text-primary underline">
            ← Performance
          </Link>
          <Link href="/admin/analytics/users" className="text-muted-foreground underline">
            User analytics
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <AdminFunnelAnalyticsDashboard initialData={data} initialQuery={initialQuery} />
      </div>
    </main>
  );
}
