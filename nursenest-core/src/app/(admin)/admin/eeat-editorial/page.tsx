import Link from "next/link";

import { EeatEditorialDashboardClient } from "@/components/admin/eeat-editorial-dashboard-client";
import { loadEeatEditorialDashboard } from "@/lib/admin/eeat-editorial-dashboard";
import { requireAdmin } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function AdminEeatEditorialPage() {
  await requireAdmin();
  const vm = await loadEeatEditorialDashboard();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">SEO & trust</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">E-E-A-T editorial dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Operational view of the static E-E-A-T audit outputs under <code className="rounded bg-muted px-1">data/audit/</code>.
            Use this to prioritize manual fixes — no auto-generated copy. Re-run{" "}
            <code className="rounded bg-muted px-1">npm run audit:eeat-system</code> after content changes.
          </p>
          {vm.generatedAtPageScores ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Page scores generated {new Date(vm.generatedAtPageScores).toLocaleString()}
              {vm.freshnessMeta.catalogBundleMtime
                ? ` · catalog bundle ${new Date(vm.freshnessMeta.catalogBundleMtime).toLocaleDateString()}`
                : ""}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/seo"
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            SEO & internal links
          </Link>
          <Link
            href="/admin"
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            ← Command center
          </Link>
        </div>
      </div>

      <EeatEditorialDashboardClient vm={vm} />
    </main>
  );
}
