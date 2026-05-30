import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadConversionIntelligenceCommandCenter } from "@/lib/conversion/load-conversion-intelligence-command-center.server";
import type { ConversionRecommendation } from "@/lib/conversion/conversion-intelligence-engine";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function numberValue(value: number | null | undefined): string {
  if (value == null) return "No data";
  return value.toLocaleString();
}

function pctValue(value: number | null | undefined): string {
  if (value == null) return "No data";
  return `${value}%`;
}

function severityClass(severity: ConversionRecommendation["severity"]): string {
  if (severity === "critical") return "border-[var(--semantic-danger)] text-[var(--semantic-danger)]";
  if (severity === "high") return "border-[var(--semantic-warning)] text-[var(--semantic-warning)]";
  return "border-[var(--semantic-border)] text-[var(--semantic-text-secondary)]";
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">{label}</p>
      <p className="mt-3 text-3xl font-bold text-[var(--semantic-text-primary)]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">{detail}</p>
    </article>
  );
}

export default async function ConversionIntelligencePage({ searchParams }: Props) {
  await requireAdmin();
  const raw = (await searchParams) ?? {};
  const data = await loadConversionIntelligenceCommandCenter({
    fromDay: first(raw.from),
    toDay: first(raw.to),
  });
  const summary = data.report.executiveSummary;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8" data-testid="conversion-intelligence">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Revenue intelligence
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] md:text-3xl">
            Conversion Intelligence Engine
          </h1>
          <p className="text-sm leading-7 text-[var(--semantic-text-secondary)]">
            Cohort funnels, content-to-purchase attribution, feature discovery lift, drop-off risk, pricing intelligence,
            alerts, and highest-impact growth recommendations.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link className="text-[var(--semantic-brand)] underline" href="/admin/analytics/funnels">
            Funnel detail
          </Link>
          <Link className="text-[var(--semantic-text-muted)] underline" href="/admin/business-command-center">
            Business command center
          </Link>
        </div>
      </header>

      <section className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-4 shadow-sm">
        <form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="text-xs font-semibold text-[var(--semantic-text-muted)]">
            From
            <input
              className="mt-1 w-full rounded-lg border border-[var(--semantic-border)] bg-[var(--semantic-surface)] px-3 py-2 text-sm text-[var(--semantic-text-primary)]"
              type="date"
              name="from"
              defaultValue={data.fromDay}
            />
          </label>
          <label className="text-xs font-semibold text-[var(--semantic-text-muted)]">
            To
            <input
              className="mt-1 w-full rounded-lg border border-[var(--semantic-border)] bg-[var(--semantic-surface)] px-3 py-2 text-sm text-[var(--semantic-text-primary)]"
              type="date"
              name="to"
              defaultValue={data.toDay}
            />
          </label>
          <button className="rounded-lg bg-[var(--role-cta)] px-4 py-2 text-sm font-semibold text-[var(--role-cta-foreground)]" type="submit">
            Apply
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--semantic-text-muted)]">
          <span>Source: {data.source}</span>
          <span>Window: {data.fromDay} to {data.toDay}</span>
          {data.degraded ? <span className="font-semibold text-[var(--semantic-warning)]">Partial / proxy mode</span> : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5" aria-label="Conversion executive summary">
        <StatCard label="Visitors" value={numberValue(summary.visitors)} detail="Top-of-funnel unique visitor signal" />
        <StatCard label="Sign-ups" value={numberValue(summary.signups)} detail="Account creation across cohorts" />
        <StatCard label="Subscribers" value={numberValue(summary.subscribers)} detail="Paid conversion rows or event counts" />
        <StatCard label="Revenue" value={`$${summary.revenueDollars.toLocaleString()}`} detail="Operational catalog estimate" />
        <StatCard label="Checkout success" value={pctValue(summary.checkoutSuccessPct)} detail="Completions divided by checkout starts" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Cohort funnels</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-[var(--semantic-text-muted)]">
                <tr>
                  <th className="border-b border-[var(--semantic-border)] py-3 pr-4">Cohort</th>
                  <th className="border-b border-[var(--semantic-border)] py-3 pr-4">Sign-ups</th>
                  <th className="border-b border-[var(--semantic-border)] py-3 pr-4">Checkout</th>
                  <th className="border-b border-[var(--semantic-border)] py-3 pr-4">Subscribers</th>
                  <th className="border-b border-[var(--semantic-border)] py-3 pr-4">Conv.</th>
                  <th className="border-b border-[var(--semantic-border)] py-3">Largest drop</th>
                </tr>
              </thead>
              <tbody className="text-[var(--semantic-text-secondary)]">
                {data.report.cohortInsights.map((row) => (
                  <tr key={row.cohort}>
                    <td className="border-b border-[var(--semantic-border-muted)] py-3 pr-4 font-semibold">{row.cohort}</td>
                    <td className="border-b border-[var(--semantic-border-muted)] py-3 pr-4">{numberValue(row.signups)}</td>
                    <td className="border-b border-[var(--semantic-border-muted)] py-3 pr-4">{numberValue(row.checkoutStarts)}</td>
                    <td className="border-b border-[var(--semantic-border-muted)] py-3 pr-4">{numberValue(row.subscribers)}</td>
                    <td className="border-b border-[var(--semantic-border-muted)] py-3 pr-4">{pctValue(row.conversionPct)}</td>
                    <td className="border-b border-[var(--semantic-border-muted)] py-3">{row.largestDropOffLabel ?? "No measured drop-off"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Highest impact opportunities</h2>
          <div className="mt-4 space-y-3">
            {data.report.recommendations.slice(0, 8).map((item) => (
              <article key={`${item.title}-${item.evidence}`} className="rounded-xl border border-[var(--semantic-border)] bg-[var(--semantic-surface-subtle)] p-4">
                <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${severityClass(item.severity)}`}>
                  {item.severity}
                </span>
                <h3 className="mt-3 text-sm font-bold text-[var(--semantic-text-primary)]">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-[var(--semantic-text-secondary)]">{item.evidence}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-muted)]">{item.suggestedAction}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Top revenue drivers</h2>
          <ol className="mt-4 space-y-2 text-sm">
            {data.report.topRevenueDrivers.slice(0, 8).map((row, index) => (
              <li key={row.page} className="rounded-lg border border-[var(--semantic-border-muted)] p-3">
                <p className="font-semibold text-[var(--semantic-text-primary)]">{index + 1}. {row.page}</p>
                <p className="text-[var(--semantic-text-secondary)]">${row.revenueDollars.toLocaleString()} · {row.subscriptions} subscriptions</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Top converting features</h2>
          <ol className="mt-4 space-y-2 text-sm">
            {data.report.topConvertingFeatures.slice(0, 8).map((row, index) => (
              <li key={row.feature} className="rounded-lg border border-[var(--semantic-border-muted)] p-3">
                <p className="font-semibold text-[var(--semantic-text-primary)]">{index + 1}. {row.feature.replace(/_/g, " ")}</p>
                <p className="text-[var(--semantic-text-secondary)]">{row.conversionPct}% conversion · {row.explorers.toLocaleString()} explorers</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Pricing intelligence</h2>
          <ol className="mt-4 space-y-2 text-sm">
            {data.report.pricingInsights.slice(0, 8).map((row, index) => (
              <li key={row.planCode} className="rounded-lg border border-[var(--semantic-border-muted)] p-3">
                <p className="font-semibold text-[var(--semantic-text-primary)]">{index + 1}. {row.planCode}</p>
                <p className="text-[var(--semantic-text-secondary)]">{row.checkoutCompletionPct}% checkout · ${row.revenueDollars.toLocaleString()}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Instrumentation contract</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {data.report.instrumentationContract.map((stage) => (
            <article key={stage.stage} className="rounded-xl border border-[var(--semantic-border)] bg-[var(--semantic-surface-subtle)] p-4">
              <p className="font-semibold text-[var(--semantic-text-primary)]">{stage.label}</p>
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{stage.businessQuestion}</p>
              <p className="mt-2 font-mono text-xs leading-5 text-[var(--semantic-text-muted)]">
                {stage.requiredSignals.join(", ")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[var(--semantic-border)] bg-[var(--semantic-surface-subtle)] p-4 text-sm text-[var(--semantic-text-secondary)]">
        {data.notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </section>
    </main>
  );
}
