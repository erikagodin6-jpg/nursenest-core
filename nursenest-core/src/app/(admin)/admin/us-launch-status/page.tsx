import { requireAdmin } from "@/lib/auth/guards";
import { buildUsLaunchStatus, type LaunchGateTone } from "@/lib/us-launch/us-launch-status";

export const dynamic = "force-dynamic";

function toneClass(tone: LaunchGateTone): string {
  if (tone === "green") return "border-green-200 bg-green-50 text-green-800";
  if (tone === "yellow") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-red-200 bg-red-50 text-red-800";
}

function toneLabel(tone: LaunchGateTone): string {
  if (tone === "green") return "Ready";
  if (tone === "yellow") return "Needs Attention";
  return "Blocked";
}

export default async function UsLaunchStatusPage() {
  await requireAdmin();
  const status = buildUsLaunchStatus();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">US launch status</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--semantic-text-primary)]">RN launch control board</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--semantic-text-secondary)]">
          Single operational view for launch readiness, revenue funnel, analytics, Stripe, entitlements, and E2E gates.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Launch readiness score</p>
          <p className="mt-2 text-5xl font-black text-slate-950">{status.score}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Final verdict</p>
          <p className="mt-3 text-2xl font-black text-slate-950">{status.verdict}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Billing architecture</p>
          <p className="mt-3 text-2xl font-black text-slate-950">US multi-currency</p>
          <p className="mt-1 text-xs text-slate-500">Canada remains CAD; US checkout requires USD price IDs.</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {status.gates.map((gate) => (
          <article key={gate.id} className={`rounded-2xl border p-5 shadow-sm ${toneClass(gate.tone)}`}>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-black">{gate.label}</h2>
              <span className="rounded-full border border-current px-2 py-0.5 text-[10px] font-black uppercase tracking-wide">
                {toneLabel(gate.tone)}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed">{gate.detail}</p>
          </article>
        ))}
      </section>

      {status.missingUsStripeEnvKeys.length > 0 ? (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900 shadow-sm">
          <h2 className="text-sm font-black uppercase tracking-wide">Blocked Stripe env keys</h2>
          <ul className="mt-3 grid gap-1 text-xs font-mono sm:grid-cols-2">
            {status.missingUsStripeEnvKeys.map((key) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
