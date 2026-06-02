import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import {
  loadAdminStudyPerformanceAnalytics,
  parseStudyPerformanceSearchParams,
} from "@/lib/admin/load-admin-study-performance-analytics";
import { AdminStudyPerformanceDashboard } from "@/components/admin/analytics/admin-study-performance-dashboard";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminStudyPerformancePage({ searchParams }: Props) {
  await requireAdmin();
  const raw = (await searchParams) ?? {};
  const parsed = parseStudyPerformanceSearchParams(raw);
  const data = await loadAdminStudyPerformanceAnalytics(parsed);

  const initialQuery = { fromDay: parsed.fromDay, toDay: parsed.toDay };

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Analytics</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Study &amp; content performance</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Lessons (`Progress`), question topics (`UserTopicStat`), and CAT practice tests / sessions — all from the database.
            Rationale engagement is called out where we do not persist it.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/analytics" className="text-primary underline">
            ← Performance
          </Link>
          <Link href="/admin/analytics/users" className="text-muted-foreground underline">
            Users
          </Link>
          <Link href="/admin/analytics/product-intelligence" className="text-primary underline">
            Product intelligence →
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <AdminStudyPerformanceDashboard initialData={data} initialQuery={initialQuery} />
      </div>
    </main>
  );
}
