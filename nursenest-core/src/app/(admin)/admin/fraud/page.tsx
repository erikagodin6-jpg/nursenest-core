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
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">Fraud Detection</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Review suspicious signup patterns, trial abuse signals, and duplicate account clusters.
        </p>
      </div>

      <FraudDashboardClient summary={summary} accounts={accounts} />
    </main>
  );
}
