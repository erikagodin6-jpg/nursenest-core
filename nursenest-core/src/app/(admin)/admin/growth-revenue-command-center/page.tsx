import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import {
  loadGrowthRevenueCommandCenter,
  type GrowthRevenueMetric,
  type GrowthRevenueStatus,
} from "@/lib/admin/load-growth-revenue-command-center";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Growth & Revenue Command Center | NurseNest Admin",
  description: "Executive command center for traffic, SEO, content performance, revenue, funnels, alerts, and subscriptions.",
};

const statusStyles: Record<GrowthRevenueStatus, string> = {
  green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  yellow: "border-amber-500/35 bg-amber-500/10 text-amber-900 dark:text-amber-100",
  red: "border-rose-500/35 bg-rose-500/10 text-rose-900 dark:text-rose-100",
};

function Card({ metric }: { metric: GrowthRevenueMetric }) {
  return (
    <article className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{metric.label}</p>
        <span className={`rounded-full border px-2 py-1 text-[11px] font-bold uppercase ${statusStyles[metric.status]}`}>
          {metric.status}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-[var(--theme-heading-text)]">{metric.value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{metric.detail}</p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{title}</h2>
      {children}
    </section>
  );
}

export default async function GrowthRevenueCommandCenterPage() {
  await requireAdmin();
  const data = await loadGrowthRevenueCommandCenter();

  return (
    <main className="mx-auto w-full max-w-[1500px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-border/70 bg-[linear-gradient(135deg,var(--theme-card-bg)_0%,color-mix(in_srgb,var(--semantic-brand)_8%,var(--theme-card-bg))_100%)] p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Executive</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
              Growth & Revenue Command Center
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              One owner dashboard for traffic, Search Console, content performance, subscriptions, revenue, funnels,
              SEO ROI, and alert health.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <Link href="/admin/business-command-center" className="text-primary underline">
              Business center
            </Link>
            <Link href="/admin/revenue-alerts" className="text-muted-foreground underline">
              Revenue alerts
            </Link>
            <Link href="/admin/analytics/funnels" className="text-muted-foreground underline">
              Funnels
            </Link>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
          Snapshot <span className="font-semibold text-foreground">{new Date(data.generatedAt).toLocaleString()}</span>
          {data.degraded ? <span className="ml-3 font-semibold text-amber-700 dark:text-amber-200">Partial data mode</span> : null}
        </div>
      </header>

      <Section title="60-Second Owner Read">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Object.values(data.sixtySecondRead).map((item) => <Card key={item.label} metric={item} />)}
        </div>
      </Section>

      <Section title="Traffic Dashboard">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <Card metric={data.traffic.organic} />
          <Card metric={data.traffic.direct} />
          <Card metric={data.traffic.referral} />
          <Card metric={data.traffic.social} />
          <Card metric={data.traffic.email} />
          <Card metric={data.traffic.trend} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {data.traffic.dimensions.map((item) => <Card key={item.label} metric={item} />)}
        </div>
      </Section>

      <Section title="Search Console Dashboard">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card metric={data.searchConsole.impressions} />
          <Card metric={data.searchConsole.clicks} />
          <Card metric={data.searchConsole.ctr} />
          <Card metric={data.searchConsole.averagePosition} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Card metric={{ label: "Keyword Opportunities", value: String(data.searchConsole.keywordOpportunities), status: "yellow", detail: "Untargeted query impressions that can become new branches or links." }} />
          <Card metric={{ label: "Fastest Growing Pages", value: "GSC Required", status: "yellow", detail: "Requires current and previous Search Console exports." }} />
          <Card metric={{ label: "Pages Losing Traffic", value: String(data.searchConsole.pagesLosingTraffic), status: data.searchConsole.pagesLosingTraffic ? "red" : "yellow", detail: "Decay detection from prior-period GSC rows." }} />
        </div>
      </Section>

      <Section title="Content Performance">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Most Visited</h3>
            {(data.content.mostVisited.length ? data.content.mostVisited : [data.traffic.organic]).map((item) => <Card key={item.label} metric={item} />)}
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Most Converted</h3>
            {(data.content.mostConverted.length ? data.content.mostConverted : [data.revenue.conversions]).slice(0, 6).map((item) => <Card key={item.label} metric={item} />)}
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Failing Content</h3>
            {data.content.failing.map((item) => <Card key={item.label} metric={item} />)}
          </div>
        </div>
      </Section>

      <Section title="Revenue Dashboard">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Object.values(data.revenue).map((item) => <Card key={item.label} metric={item} />)}
        </div>
      </Section>

      <Section title="Funnel Analytics">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Object.values(data.funnel).map((item) => <Card key={item.label} metric={item} />)}
        </div>
      </Section>

      <Section title="SEO ROI Dashboard">
        <div className="overflow-x-auto rounded-xl border border-border/70 bg-[var(--theme-card-bg)] shadow-sm">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Cluster</th>
                <th className="px-4 py-3">Traffic</th>
                <th className="px-4 py-3">Conversion Rate</th>
                <th className="px-4 py-3">Revenue</th>
                <th className="px-4 py-3">Content ROI</th>
              </tr>
            </thead>
            <tbody>
              {data.seoRoi.map((row) => (
                <tr key={row.cluster} className="border-b border-border/50">
                  <td className="px-4 py-3 font-semibold text-[var(--theme-heading-text)]">{row.cluster}</td>
                  <td className="px-4 py-3">{row.traffic}</td>
                  <td className="px-4 py-3">{row.conversionRate}</td>
                  <td className="px-4 py-3">{row.revenue}</td>
                  <td className="px-4 py-3">{row.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Alert Center">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {data.alertCenter.map((item) => <Card key={item.label} metric={item} />)}
        </div>
      </Section>
    </main>
  );
}

