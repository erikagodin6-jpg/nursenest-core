import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadAlliedOccupationHealth } from "@/lib/admin/load-allied-occupation-health";

export const dynamic = "force-dynamic";

export default async function AdminAlliedOccupationDiagnosticsPage() {
  await requireAdmin();
  const health = await loadAlliedOccupationHealth({ take: 200 });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Diagnostics</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">
            Allied Subscription Occupation Health
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Active-like Allied subscriptions with Stripe mirror. Missing or invalid{" "}
            <code className="rounded bg-muted px-1">alliedCareer</code> blocks premium study until repaired.
            Last webhook sync approximated by <code className="rounded bg-muted px-1">subscription.updatedAt</code>.
          </p>
        </div>
        <Link
          href="/admin/diagnostics"
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          ← Diagnostics home
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-[var(--semantic-panel-muted)] p-4">
          <p className="text-xs font-medium text-muted-foreground">Sample size (max 200)</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--semantic-text-primary)]">{health.counts.total}</p>
        </div>
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_22%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] p-4">
          <p className="text-xs font-medium text-[var(--semantic-success-contrast)]">Valid occupation</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--semantic-success-contrast)]">{health.counts.ok}</p>
        </div>
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_25%,var(--semantic-border-soft))] bg-[var(--semantic-panel-warm)] p-4">
          <p className="text-xs font-medium text-[var(--semantic-warning-contrast)]">Missing occupation</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--semantic-warning-contrast)]">
            {health.counts.missingOccupation}
          </p>
        </div>
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_25%,var(--semantic-border-soft))] bg-[var(--semantic-danger-soft)] p-4">
          <p className="text-xs font-medium text-[var(--semantic-danger-contrast)]">Invalid occupation</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--semantic-danger-contrast)]">
            {health.counts.invalidOccupation}
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">alliedCareer</th>
              <th className="px-3 py-2">user.alliedProfessionKey</th>
              <th className="px-3 py-2">Issue</th>
              <th className="px-3 py-2">Stripe sub</th>
              <th className="px-3 py-2">updatedAt</th>
            </tr>
          </thead>
          <tbody>
            {health.rows.map((r) => (
              <tr key={r.subscriptionId} className="border-t border-border/80">
                <td className="px-3 py-2">
                  <Link className="text-primary underline-offset-4 hover:underline" href={`/admin/users/${r.userId}`}>
                    {r.email}
                  </Link>
                </td>
                <td className="px-3 py-2 font-mono text-xs">{r.status}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.alliedCareer ?? "—"}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.userAlliedProfessionKey ?? "—"}</td>
                <td className="px-3 py-2">{r.issue}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.stripeSubscriptionId.slice(0, 18)}…</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{r.updatedAt.toISOString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
