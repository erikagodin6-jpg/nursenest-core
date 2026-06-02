import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { PLATFORM_FEATURES } from "@/lib/platform-governance/feature-registry";
import { validateAnalyticsContract } from "@/lib/platform-governance/analytics-contract";
import { validateContentGovernanceContract } from "@/lib/platform-governance/content-governance-contract";
import { validateMonetizationContract } from "@/lib/platform-governance/monetization-contract";
import { validateSubscriptionContract, SUBSCRIPTION_RULES } from "@/lib/platform-governance/subscription-contract";
import { buildLaunchReadinessDashboard, platformGovernanceSummary } from "@/lib/platform-governance/launch-readiness";
import { buildNavigationAuditReport } from "@/lib/nav-governance/navigation-audit";

export const dynamic = "force-dynamic";

function StatusPill({ label, tone }: { label: string; tone: "green" | "amber" | "red" | "slate" | "blue" }) {
  const cls = {
    green: "border-green-200 bg-green-50 text-green-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-200 bg-red-50 text-red-700",
    slate: "border-slate-200 bg-slate-50 text-slate-600",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
  }[tone];
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cls}`}>{label}</span>;
}

function bandTone(band: "ready" | "watch" | "blocked"): "green" | "amber" | "red" {
  return band === "ready" ? "green" : band === "watch" ? "amber" : "red";
}

export default async function PlatformGovernancePage() {
  await requireAdmin();

  const navigation = buildNavigationAuditReport(process.cwd());
  const analyticsViolations = validateAnalyticsContract();
  const monetizationViolations = validateMonetizationContract();
  const contentViolations = validateContentGovernanceContract();
  const subscriptionViolations = validateSubscriptionContract();
  const readinessRows = buildLaunchReadinessDashboard();
  const summary = platformGovernanceSummary();
  const totalViolations =
    navigation.violationCount +
    analyticsViolations.length +
    monetizationViolations.length +
    contentViolations.length +
    subscriptionViolations.length;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">Platform governance</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--semantic-text-primary)]">Executive governance dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--semantic-text-secondary)]">
            One view for route, feature, analytics, monetization, content, subscription, and launch-readiness contracts.
          </p>
        </div>
        <Link href="/admin/navigation-compliance" className="text-sm font-semibold text-[var(--semantic-brand)] underline">
          Navigation compliance
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {[
          ["Features", PLATFORM_FEATURES.length, "blue"],
          ["Nav compliance", `${navigation.complianceRate}%`, navigation.violationCount ? "red" : "green"],
          ["Avg readiness", summary.averageScore, summary.averageScore >= 85 ? "green" : "amber"],
          ["Ready", summary.ready, "green"],
          ["Watch", summary.watch, "amber"],
          ["Violations", totalViolations, totalViolations ? "red" : "green"],
        ].map(([label, value, tone]) => (
          <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className={`text-2xl font-black ${tone === "red" ? "text-red-700" : tone === "amber" ? "text-amber-700" : tone === "green" ? "text-green-700" : "text-slate-900"}`}>{value}</p>
            <p className="mt-1 text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Contract health</h2>
            <p className="mt-1 text-xs text-slate-500">CI should run the platform-governance contract test whenever these registries change.</p>
          </div>
          <StatusPill label={totalViolations === 0 ? "passing" : "violations"} tone={totalViolations === 0 ? "green" : "red"} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Navigation", navigation.violationCount],
            ["Analytics", analyticsViolations.length],
            ["Monetization", monetizationViolations.length],
            ["Content", contentViolations.length],
            ["Subscriptions", subscriptionViolations.length],
          ].map(([label, count]) => (
            <div key={String(label)} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-500">{label}</p>
              <p className={`mt-1 text-lg font-black ${Number(count) ? "text-red-700" : "text-green-700"}`}>{count}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-800">Feature registry</h2>
          <p className="mt-1 text-xs text-slate-500">Owner, status, tier, monetization, readiness, and analytics coverage by feature.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-100">
                {["Feature", "Owner", "Status", "Tier", "Money", "Analytics", "Readiness"].map((h) => (
                  <th key={h} className="px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {readinessRows.map(({ feature, score, band }) => (
                <tr key={feature.id} className="border-b border-slate-50">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">{feature.label}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{feature.owner}</td>
                  <td className="px-4 py-3"><StatusPill label={feature.status} tone={feature.status === "production" ? "green" : "amber"} /></td>
                  <td className="px-4 py-3 text-xs text-slate-600">{feature.tier}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{feature.monetizationStatus}</td>
                  <td className="px-4 py-3"><StatusPill label={feature.analyticsCoverage} tone={feature.analyticsCoverage === "full" ? "green" : feature.analyticsCoverage === "none" ? "red" : "amber"} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black tabular-nums text-slate-900">{score}</span>
                      <StatusPill label={band} tone={bandTone(band)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800">Subscription rules</h2>
          <div className="mt-4 space-y-3">
            {SUBSCRIPTION_RULES.map((rule) => (
              <div key={rule.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-slate-700">{rule.id}</p>
                  <StatusPill label={rule.status} tone={rule.status === "enforced" ? "green" : "amber"} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{rule.rule}</p>
                <p className="mt-1 font-mono text-[10px] text-slate-400">{rule.source}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800">Production readiness dimensions</h2>
          <p className="mt-1 text-xs text-slate-500">Every feature is scored across content, QA, analytics, monetization, and reliability.</p>
          <div className="mt-4 space-y-2">
            {readinessRows.slice(0, 6).map(({ feature }) => (
              <div key={feature.id} className="grid grid-cols-[9rem_repeat(5,1fr)] items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700">{feature.label}</span>
                {Object.values(feature.readinessScores).map((score, idx) => (
                  <span key={idx} className="rounded bg-slate-100 px-2 py-1 text-center font-mono text-slate-600">{score}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
