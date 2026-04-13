import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import {
  loadAdminProductIntelligence,
  parseProductIntelligenceSearchParams,
} from "@/lib/admin/load-admin-product-intelligence";
import { AdminProductIntelligenceView } from "@/components/admin/analytics/admin-product-intelligence-view";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminProductIntelligencePage({ searchParams }: Props) {
  await requireAdmin();
  const raw = (await searchParams) ?? {};
  const parsed = parseProductIntelligenceSearchParams(raw);
  const data = await loadAdminProductIntelligence(parsed);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Analytics</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Product intelligence</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Actionable signals from Postgres and optional PostHog — weak lessons, friction, CAT drop-off, feedback
            clusters, and navigation usage contrast. No placeholder metrics; gaps are stated explicitly.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/analytics" className="text-primary underline">
            ← Performance hub
          </Link>
          <Link href="/admin/analytics/study-performance" className="text-muted-foreground underline">
            Study tables
          </Link>
          <Link href="/admin/analytics/funnels" className="text-muted-foreground underline">
            Marketing funnels
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {data == null ? (
          <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-8 text-sm text-muted-foreground shadow-sm">
            Product intelligence requires a configured database and is unavailable in safe mode.
          </div>
        ) : (
          <AdminProductIntelligenceView data={data} />
        )}
      </div>
    </main>
  );
}
