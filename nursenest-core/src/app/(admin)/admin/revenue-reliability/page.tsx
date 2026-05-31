import { requireAdmin } from "@/lib/auth/guards";
import { loadEntitlementDriftSignals } from "@/lib/billing/entitlement-drift-signals.server";
import { publicAppOriginForBilling } from "@/lib/env/public-app-origin";

export const dynamic = "force-dynamic";

function toneClass(tone: "green" | "yellow" | "red"): string {
  if (tone === "green") return "border-green-200 bg-green-50 text-green-900";
  if (tone === "yellow") return "border-amber-200 bg-amber-50 text-amber-900";
  return "border-red-200 bg-red-50 text-red-900";
}

function driftTone(severity: "ok" | "warn" | "critical"): "green" | "yellow" | "red" {
  if (severity === "ok") return "green";
  if (severity === "warn") return "yellow";
  return "red";
}

export default async function RevenueReliabilityPage() {
  await requireAdmin();
  const drift = await loadEntitlementDriftSignals();
  const webhookConfigured = Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim());
  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
  const appOriginConfigured = Boolean(publicAppOriginForBilling());
  const syncConfigured = webhookConfigured && stripeConfigured && appOriginConfigured;

  const cards = [
    {
      label: "Stripe client",
      tone: stripeConfigured ? "green" as const : "red" as const,
      detail: stripeConfigured ? "Server Stripe key is present." : "STRIPE_SECRET_KEY is missing.",
    },
    {
      label: "Webhook verification",
      tone: webhookConfigured ? "green" as const : "red" as const,
      detail: webhookConfigured ? "Webhook signatures can be verified." : "STRIPE_WEBHOOK_SECRET is missing.",
    },
    {
      label: "Checkout return",
      tone: appOriginConfigured ? "green" as const : "red" as const,
      detail: appOriginConfigured ? "Checkout success URLs have a public origin." : "Public app origin is missing.",
    },
    {
      label: "Entitlement drift",
      tone: driftTone(drift.severity),
      detail:
        drift.severity === "ok"
          ? "No DB-side drift signals detected."
          : "Review drift counts and run Stripe reconciliation before launch.",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
          Revenue reliability
        </p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--semantic-text-primary)]">
          Billing diagnostics
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--semantic-text-secondary)]">
          Admin view for Stripe synchronization, entitlement drift, checkout recovery, and paid-access safety.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className={`rounded-2xl border p-5 shadow-sm ${toneClass(card.tone)}`}>
            <p className="text-xs font-bold uppercase tracking-wide opacity-75">{card.label}</p>
            <p className="mt-3 text-sm leading-relaxed">{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-950">Synchronization controls</h2>
            <p className="mt-1 text-sm text-slate-600">
              Use dry-run before apply. Apply mode repairs trusted Stripe subscriptions into the database mirror.
            </p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${toneClass(syncConfigured ? "green" : "red")}`}>
            {syncConfigured ? "Ready" : "Blocked"}
          </span>
        </div>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
          <a className="rounded-xl border border-slate-200 p-3 font-semibold text-slate-900 hover:bg-slate-50" href="/api/admin/billing/integrity-summary">
            Integrity summary
          </a>
          <a className="rounded-xl border border-slate-200 p-3 font-semibold text-slate-900 hover:bg-slate-50" href="/api/admin/billing/stripe-reconcile">
            Stripe reconcile dry-run
          </a>
          <a className="rounded-xl border border-slate-200 p-3 font-semibold text-slate-900 hover:bg-slate-50" href="/admin/subscriptions">
            Subscription operations
          </a>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Entitlement drift signals</h2>
        <dl className="mt-4 grid gap-4 md:grid-cols-4">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Severity</dt>
            <dd className="mt-1 text-2xl font-black text-slate-950">{drift.severity}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Missing customer</dt>
            <dd className="mt-1 text-2xl font-black text-slate-950">{drift.signals.activeLikeMissingStripeCustomer}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Tier mismatch</dt>
            <dd className="mt-1 text-2xl font-black text-slate-950">{drift.signals.activeLikeTierMismatchUser}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Webhook events 24h</dt>
            <dd className="mt-1 text-2xl font-black text-slate-950">{drift.signals.recentWebhookEvents24h ?? "n/a"}</dd>
          </div>
        </dl>
        {drift.hints.length > 0 ? (
          <ul className="mt-4 grid gap-2 text-sm text-slate-700">
            {drift.hints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
}
