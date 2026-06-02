import Link from "next/link";
import type {
  ExecutiveBusinessCommandCenterData,
  ExecutiveBusinessMetric,
  ExecutiveHealthStatus,
} from "@/lib/admin/load-executive-business-command-center";

const statusStyles: Record<ExecutiveHealthStatus, string> = {
  green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  yellow: "border-amber-500/35 bg-amber-500/10 text-amber-900 dark:text-amber-100",
  red: "border-rose-500/35 bg-rose-500/10 text-rose-900 dark:text-rose-100",
};

const dotStyles: Record<ExecutiveHealthStatus, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-rose-500",
};

function StatusPill({ status }: { status: ExecutiveHealthStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${statusStyles[status]}`}>
      <span className={`h-2 w-2 rounded-full ${dotStyles[status]}`} />
      {status}
    </span>
  );
}

function MetricCard({ metric, emphasized = false }: { metric: ExecutiveBusinessMetric; emphasized?: boolean }) {
  return (
    <article className={`rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm ${emphasized ? "sm:p-5" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{metric.label}</p>
        <StatusPill status={metric.status} />
      </div>
      <p className={`mt-3 font-bold tracking-tight text-[var(--theme-heading-text)] ${emphasized ? "text-3xl" : "text-2xl"}`}>
        {metric.value}
      </p>
      {metric.note ? <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{metric.note}</p> : null}
    </article>
  );
}

function RankedList({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: ExecutiveBusinessCommandCenterData["topProducts"];
  empty: string;
}) {
  return (
    <section className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ol className="mt-3 space-y-2">
          {rows.map((row, index) => (
            <li key={`${row.label}-${index}`} className="flex items-start justify-between gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--theme-heading-text)]">
                  {index + 1}. {row.label}
                </p>
                {row.note ? <p className="mt-0.5 text-xs text-muted-foreground">{row.note}</p> : null}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold tabular-nums">{row.value}</p>
                <span className={`mt-1 inline-block h-2 w-2 rounded-full ${dotStyles[row.status]}`} aria-label={row.status} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export function ExecutiveBusinessCommandCenter({ data }: { data: ExecutiveBusinessCommandCenterData }) {
  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-border/70 bg-[linear-gradient(135deg,var(--theme-card-bg)_0%,color-mix(in_srgb,var(--semantic-brand)_8%,var(--theme-card-bg))_100%)] p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Executive</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
              Business command center
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Daily owner view for revenue, subscriptions, learner activity, product momentum, referral sources, and
              learning-platform health.
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
            Snapshot <span className="font-semibold text-foreground">{new Date(data.generatedAt).toLocaleString()}</span>
          </div>
        </div>
        {data.notes.length > 0 ? (
          <div className="mt-5 grid gap-2 text-xs text-muted-foreground lg:grid-cols-3">
            {data.notes.map((note) => (
              <p key={note} className="rounded-lg border border-border/60 bg-background/55 px-3 py-2">
                {note}
              </p>
            ))}
          </div>
        ) : null}
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard metric={data.uptime.systemHealth} emphasized />
        <MetricCard metric={data.revenue.mrr} emphasized />
        <MetricCard metric={data.revenue.arr} emphasized />
        <MetricCard metric={data.revenue.revenueYesterday} emphasized />
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Revenue protection</h2>
            <p className="text-sm text-muted-foreground">Billing risk and Stripe-side items to review each morning.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <Link href="/admin/subscriptions" className="text-primary underline">
              Subscription rows
            </Link>
            <Link href="/admin/premium-protection" className="text-muted-foreground underline">
              Evidence center
            </Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard metric={data.revenue.failedPayments} />
          <MetricCard metric={data.revenue.chargebacks} />
          <MetricCard metric={data.revenue.refunds} />
          <MetricCard metric={data.revenue.institutionRevenue} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Subscribers and learners</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard metric={data.subscriptions.newSubscribers} />
          <MetricCard metric={data.subscriptions.cancelledSubscribers} />
          <MetricCard metric={data.learnerActivity.activeLearners} />
          <MetricCard metric={data.learnerActivity.studySessions} />
          <MetricCard metric={data.learnerActivity.questionsAnswered} />
        </div>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Learning availability</h2>
            <p className="text-sm text-muted-foreground">Core learner activities must remain available for revenue trust.</p>
          </div>
          <Link href="/admin/operations" className="text-sm font-semibold text-primary underline">
            Operations detail
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricCard metric={data.uptime.flashcards} />
          <MetricCard metric={data.uptime.cat} />
          <MetricCard metric={data.uptime.questions} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <RankedList title="Top performing products" rows={data.topProducts} empty="No active product rows yet." />
        <RankedList title="Top referral sources" rows={data.topReferralSources} empty="No referral source data in the last 30 days." />
      </section>

      <section className="rounded-xl border border-border/70 bg-muted/20 p-4">
        <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">60-second morning read</h2>
        <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
          <p>
            <span className="font-semibold text-foreground">Money:</span> MRR, ARR, yesterday revenue, failed payments,
            refunds, chargebacks.
          </p>
          <p>
            <span className="font-semibold text-foreground">Learning:</span> active learners, sessions, questions answered,
            flashcards, CAT, question uptime.
          </p>
          <p>
            <span className="font-semibold text-foreground">Growth:</span> new subscribers, cancelled subscribers, top products,
            referrals, institutions.
          </p>
        </div>
      </section>
    </div>
  );
}
