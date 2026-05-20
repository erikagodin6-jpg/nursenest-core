import Link from "next/link";
import { AdminPhase4bCanonicalEntitlementsPanel } from "@/components/admin/admin-phase4b-canonical-entitlements.server";
import { requireAdmin } from "@/lib/auth/guards";
import { loadEntitlementDriftSignals } from "@/lib/billing/entitlement-drift-signals.server";
import { eachStripePriceMatrixRow } from "@/lib/stripe/pricing-map";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  await requireAdmin();
  const [recent, byStatus, byTier, byCountry, drift] = await Promise.all([
    prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
      take: 40,
      select: {
        id: true,
        status: true,
        planTier: true,
        planCountry: true,
        createdAt: true,
        updatedAt: true,
        stripeSubscriptionId: true,
        stripeCustomerId: true,
        user: { select: { email: true, name: true } },
      },
    }),
    prisma.subscription.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.subscription.groupBy({ by: ["planTier"], _count: { _all: true } }),
    prisma.subscription.groupBy({ by: ["planCountry"], _count: { _all: true } }),
    loadEntitlementDriftSignals().catch(() => null),
  ]);

  const matrix = eachStripePriceMatrixRow();
  const missing = matrix.filter((m) => !m.priceId);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Subscriptions & billing</h1>
          <p className="mt-1 text-sm text-muted-foreground">Stripe subscription rows + price matrix coverage.</p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-primary underline">
          ← Overview
        </Link>
      </div>

      {drift && drift.severity !== "ok" ? (
        <aside
          className="mt-6 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-warm)] p-4 text-sm text-[var(--semantic-text-primary)]"
          role="status"
          data-testid="admin-subscriptions-drift-panel"
        >
          <p className="font-semibold">Integrity signals ({drift.severity})</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs sm:text-sm">
            <li>Missing Stripe customer on paid-like rows: {drift.signals.activeLikeMissingStripeCustomer}</li>
            <li>Plan tier vs user.tier mismatch (paid-like): {drift.signals.activeLikeTierMismatchUser}</li>
            <li>Webhook claims (24h): {drift.signals.recentWebhookEvents24h ?? "unknown"}</li>
            <li>
              Latest subscription mirror update:{" "}
              {drift.signals.latestSubscriptionUpdatedAt
                ? new Date(drift.signals.latestSubscriptionUpdatedAt).toLocaleString()
                : "—"}
            </li>
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            Report-only — use Stripe reconcile dry-run and ops runbook. Optional structured log: GET{" "}
            <code className="rounded bg-muted px-1">/api/admin/billing/integrity-summary?emitLog=1</code>.
          </p>
        </aside>
      ) : null}

      <AdminPhase4bCanonicalEntitlementsPanel drift={drift} />

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="nn-card p-6">
          <h2 className="text-lg font-semibold">By status</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {byStatus.map((r) => (
              <li key={r.status} className="flex justify-between">
                <span>{r.status}</span>
                <span className="tabular-nums">{r._count._all}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="nn-card p-6">
          <h2 className="text-lg font-semibold">By plan tier</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {byTier.map((r) => (
              <li key={String(r.planTier)} className="flex justify-between">
                <span>{r.planTier ?? "N/A"}</span>
                <span className="tabular-nums">{r._count._all}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="nn-card p-6">
          <h2 className="text-lg font-semibold">By plan country</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {byCountry.map((r) => (
              <li key={String(r.planCountry)} className="flex justify-between">
                <span>{r.planCountry ?? "N/A"}</span>
                <span className="tabular-nums">{r._count._all}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Stripe price env matrix</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Checkout uses these env vars. Missing cells show as unavailable in pricing UI.
        </p>
        {missing.length > 0 ? (
          <p className="mt-3 text-sm text-amber-800 dark:text-amber-200">
            Missing: {missing.length}. {missing.slice(0, 6).map((m) => m.envKey).join(", ")}
            {missing.length > 6 ? "…" : ""}
          </p>
        ) : (
          <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-300">All cells have price IDs.</p>
        )}
        <div className="mt-4 max-h-96 overflow-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border">
              <tr>
                <th className="py-2">Env key</th>
                <th className="py-2">Price id</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((m) => (
                <tr key={m.envKey} className="border-b border-border/40">
                  <td className="py-1.5 font-mono">{m.envKey}</td>
                  <td className="py-1.5 font-mono">{m.priceId ?? "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Recent subscription rows</h2>
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="py-2">User</th>
                <th className="py-2">Status</th>
                <th className="py-2">Plan</th>
                <th className="py-2">Stripe linkage</th>
                <th className="py-2">Updated</th>
                <th className="py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((s) => (
                <tr key={s.id} className="border-b border-border/50">
                  <td className="py-2">
                    {s.user.name} <span className="font-mono text-xs text-muted-foreground">{s.user.email}</span>
                  </td>
                  <td className="py-2">{s.status}</td>
                  <td className="py-2">
                    {s.planTier ?? "N/A"} / {s.planCountry ?? "N/A"}
                  </td>
                  <td className="py-2 text-xs font-mono text-muted-foreground">
                    sub {s.stripeSubscriptionId.slice(0, 12)}… · cust {s.stripeCustomerId ? `${s.stripeCustomerId.slice(0, 10)}…` : "—"}
                  </td>
                  <td className="py-2 text-xs">{s.updatedAt.toISOString().slice(0, 19)}</td>
                  <td className="py-2 text-xs">{s.createdAt.toISOString().slice(0, 19)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          MRR not stored in-app. Derive from Stripe dashboard or reporting export.
        </p>
      </section>
    </main>
  );
}
