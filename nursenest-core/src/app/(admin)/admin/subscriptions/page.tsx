import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { eachStripePriceMatrixRow } from "@/lib/stripe/pricing-map";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  await requireAdmin();
  const [recent, byStatus, byTier, byCountry] = await Promise.all([
    prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
      take: 40,
      select: {
        id: true,
        status: true,
        planTier: true,
        planCountry: true,
        createdAt: true,
        user: { select: { email: true, name: true } },
      },
    }),
    prisma.subscription.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.subscription.groupBy({ by: ["planTier"], _count: { _all: true } }),
    prisma.subscription.groupBy({ by: ["planCountry"], _count: { _all: true } }),
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
                <span>{r.planTier ?? "—"}</span>
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
                <span>{r.planCountry ?? "—"}</span>
                <span className="tabular-nums">{r._count._all}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Stripe price env matrix</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Checkout uses these env vars — missing cells show as unavailable in pricing UI.
        </p>
        {missing.length > 0 ? (
          <p className="mt-3 text-sm text-amber-800 dark:text-amber-200">
            Missing: {missing.length} — {missing.slice(0, 6).map((m) => m.envKey).join(", ")}
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
                  <td className="py-1.5 font-mono">{m.priceId ?? "—"}</td>
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
                    {s.planTier ?? "—"} / {s.planCountry ?? "—"}
                  </td>
                  <td className="py-2 text-xs">{s.createdAt.toISOString().slice(0, 19)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          MRR not stored in-app — derive from Stripe dashboard or reporting export.
        </p>
      </section>
    </main>
  );
}
