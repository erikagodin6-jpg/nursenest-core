import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import {
  loadEducatorAnalyticsDashboard,
  parseEducatorAnalyticsSearchParams,
} from "@/lib/admin/load-educator-analytics-dashboard";
import { AdminEducatorAnalyticsDashboard } from "@/components/admin/analytics/admin-educator-analytics-dashboard";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminEducatorAnalyticsPage({ searchParams }: Props) {
  await requireAdmin();
  const raw = (await searchParams) ?? {};
  const parsed = parseEducatorAnalyticsSearchParams(raw);
  const data = await loadEducatorAnalyticsDashboard(parsed);

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Educator Analytics</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">
            Nursing program intelligence
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Cohort-level weaknesses, unsafe reasoning trends, confidence calibration, and early warning signals for nursing
            instructors and program leads. Built from persisted learner activity, not placeholder KPIs.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/analytics" className="text-primary underline">
            ← Analytics
          </Link>
          <Link href="/admin/analytics/study-performance" className="text-muted-foreground underline">
            Study performance
          </Link>
          <Link href="/admin/analytics/weak-areas" className="text-muted-foreground underline">
            Weak areas
          </Link>
          <Link href="/admin/users" className="text-muted-foreground underline">
            User lookup
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <AdminEducatorAnalyticsDashboard
          initialData={data}
          initialQuery={{
            fromDay: parsed.fromDay,
            toDay: parsed.toDay,
            pathwayId: parsed.pathwayId ?? "",
          }}
        />
      </div>
    </main>
  );
}
