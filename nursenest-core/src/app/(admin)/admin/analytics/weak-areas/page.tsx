import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadAdminWeakAreas, parseWeakAreasSearchParams } from "@/lib/admin/load-admin-weak-areas";
import { AdminWeakAreasView } from "@/components/admin/analytics/admin-weak-areas-view";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminWeakAreasPage({ searchParams }: Props) {
  await requireAdmin();
  const raw = (await searchParams) ?? {};
  const parsed = parseWeakAreasSearchParams(raw);
  const data = await loadAdminWeakAreas(parsed);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Analytics</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Weak areas</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Ranked weak points from real signals — completion, engagement proxies, feedback friction, bank difficulty,
            PostHog learner sections, and conversion URL trends. Dual-window comparison highlights regression vs noise.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/analytics" className="text-primary underline">
            ← Hub
          </Link>
          <Link href="/admin/analytics/product-intelligence" className="text-muted-foreground underline">
            Product intelligence
          </Link>
          <Link href="/admin/analytics/study-performance" className="text-muted-foreground underline">
            Study tables
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {data == null ? (
          <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-8 text-sm text-muted-foreground shadow-sm">
            Weak areas analytics requires a configured database and is unavailable in safe mode.
          </div>
        ) : (
          <AdminWeakAreasView data={data} />
        )}
      </div>
    </main>
  );
}
