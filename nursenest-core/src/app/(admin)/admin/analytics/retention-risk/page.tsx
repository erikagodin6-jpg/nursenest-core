import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guards";
import { loadRetentionRiskDashboard } from "@/lib/admin/subscription-risk";
import { AdminRetentionRiskClient } from "@/components/admin/admin-retention-risk-client";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Retention Risk · Admin" };

export default async function RetentionRiskPage() {
  await requireAdmin();

  const data = isDatabaseUrlConfigured()
    ? await loadRetentionRiskDashboard({ minRiskLevel: "medium", limit: 200 })
    : null;

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Analytics</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">Retention Risk Dashboard</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Active subscribers flagged by inactivity, expiry, payment failures, and low engagement. Use for
            proactive outreach, renewal campaigns, and support prioritisation.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/analytics" className="text-muted-foreground underline">← Analytics</Link>
          <Link href="/admin/analytics/subscriptions" className="text-primary underline">Subscription analytics</Link>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
        <strong>Internal only.</strong> Risk signals are heuristic — not a definitive cancellation prediction.
        Use alongside human judgement. Outreach actions must follow your privacy and communication policies.
      </div>

      <div className="mt-6">
        <AdminRetentionRiskClient initialData={data} />
      </div>
    </main>
  );
}
