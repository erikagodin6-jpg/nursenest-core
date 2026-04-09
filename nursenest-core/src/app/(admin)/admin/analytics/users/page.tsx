import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadAdminUserAnalytics, parseUserAnalyticsSearchParams } from "@/lib/admin/load-admin-user-analytics";
import { AdminUserAnalyticsDashboard } from "@/components/admin/analytics/admin-user-analytics-dashboard";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminUserAnalyticsPage({ searchParams }: Props) {
  await requireAdmin();
  const raw = (await searchParams) ?? {};
  const parsed = parseUserAnalyticsSearchParams(raw);
  const data = await loadAdminUserAnalytics(parsed);

  const serializableQuery = {
    fromDay: parsed.fromDay,
    toDay: parsed.toDay,
    country: parsed.country,
    pathway: parsed.pathway,
    subscription: parsed.subscription,
  };

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Analytics</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">User analytics</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Learner behavior from Postgres: activity proxies, pathways, subscriptions, and weekly cohort retention. Filters
            apply to profile fields (country, pathway, subscription) and the selected activity window.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/analytics" className="text-primary underline">
            ← Performance &amp; usage
          </Link>
          <Link href="/admin/users" className="text-muted-foreground underline">
            User list
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <AdminUserAnalyticsDashboard initialData={data} initialQuery={serializableQuery} />
      </div>
    </main>
  );
}
