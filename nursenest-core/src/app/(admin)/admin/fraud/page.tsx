import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guards";
import { computeFraudScores, computeFraudSummary } from "@/lib/admin/fraud-scoring";
import { FraudDashboardClient } from "@/components/admin/fraud-dashboard-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fraud Detection",
  robots: { index: false, follow: false },
};

export default async function AdminFraudPage() {
  await requireAdmin();

  const [summary, accounts] = await Promise.all([
    computeFraudSummary(),
    computeFraudScores({ limit: 50, minScore: 10 }),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/admin" className="text-primary underline hover:opacity-90">
          &larr; Admin Overview
        </Link>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Platform Trust</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Fraud Detection</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            Review suspicious signup patterns, trial abuse signals, and duplicate account clusters.
            Accounts are scored automatically. No action is taken without manual review.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Updated {new Date().toLocaleString()}
        </p>
      </div>

      <div className="mt-8">
        <FraudDashboardClient summary={summary} accounts={accounts} />
      </div>
    </main>
  );
}
