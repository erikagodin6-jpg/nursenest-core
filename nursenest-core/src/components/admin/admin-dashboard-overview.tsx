import Link from "next/link";
import type { AdminDashboardOverview } from "@/lib/admin/load-admin-dashboard-overview";
import { formatDisplayLabel } from "@/lib/ui/format-display-label";

function fmt(n: number | null | undefined, fallback = "—"): string {
  if (n == null || Number.isNaN(n)) return fallback;
  return n.toLocaleString();
}

function CardShell({
  title,
  children,
  footer,
  accent = "blue",
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  accent?: "blue" | "yellow" | "green" | "blush";
}) {
  return (
    <section className="nn-admin-happy-card flex flex-col">
      <span className={`nn-admin-happy-card-accent nn-admin-happy-card-accent--${accent}`} aria-hidden />
      <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">{title}</h2>
      <div className="mt-5 flex-1 space-y-3 text-sm leading-6 text-[var(--semantic-text-secondary)]">{children}</div>
      {footer ? <div className="mt-6 border-t border-[var(--admin-happy-border)] pt-5">{footer}</div> : null}
    </section>
  );
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="nn-admin-happy-btn nn-admin-happy-btn--primary w-full">
      {children}
    </Link>
  );
}

function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="nn-admin-happy-btn nn-admin-happy-btn--blue w-full">
      {children}
    </Link>
  );
}

export function AdminDashboardOverview({
  data,
  showHeader = true,
}: {
  data: AdminDashboardOverview;
  showHeader?: boolean;
}) {
  const tier = data.exams.byTier;
  const dbHealthy = data.health.dbOk === true;
  return (
    <div
      className="space-y-10"
      data-nn-premium-full-platform-convergence=""
      data-nn-premium-platform-family="admin-preview"
      data-nn-premium-platform-module="admin-dashboard"
    >
      {showHeader ? (
        <header className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] md:text-3xl">Admin Dashboard</h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--semantic-text-secondary)]">
            Manage NurseNest content and system
          </p>
          <p className="text-xs text-[var(--semantic-text-muted)]">
            Snapshot {new Date(data.generatedAt).toLocaleString()} ·{" "}
            {data.env.vercelEnv ? `${data.env.nodeEnv} (${data.env.vercelEnv})` : data.env.nodeEnv}
          </p>
        </header>
      ) : (
        <p className="text-xs text-[var(--semantic-text-muted)]">
          Snapshot {new Date(data.generatedAt).toLocaleString()} ·{" "}
          {data.env.vercelEnv ? `${data.env.nodeEnv} (${data.env.vercelEnv})` : data.env.nodeEnv}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total users", value: fmt(data.users.total), bar: "blush" as const },
          { label: "Active subscribers", value: fmt(data.users.activeSubscribers), bar: "yellow" as const },
          { label: "Lessons live", value: fmt(data.content.lessons), bar: "blue" as const },
          {
            label: "System health",
            value: dbHealthy ? "All good" : data.health.dbOk === false ? "Check DB" : "Unknown",
            bar: "green" as const,
          },
        ].map((stat) => (
          <div key={stat.label} className="nn-admin-happy-stat">
            <p className="text-xs font-medium text-[var(--semantic-text-muted)]">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--semantic-text-primary)]">{stat.value}</p>
            <span className={`nn-admin-happy-stat-bar nn-admin-happy-stat-bar--${stat.bar} mt-3 block`} aria-hidden />
          </div>
        ))}
      </div>

      {data.billingIntegrity && data.billingIntegrity.severity !== "ok" ? (
        <div
          className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-warm)] p-4 text-sm text-[var(--semantic-text-primary)] shadow-sm"
          role="alert"
          data-testid="admin-billing-drift-banner"
        >
          <p className="font-semibold text-[var(--semantic-text-primary)]">Access mismatch signals (report only)</p>
          <p className="mt-1 text-[var(--semantic-text-secondary)]">
            DB heuristics flagged potential entitlement drift — severity {data.billingIntegrity.severity}. No automatic
            fixes are applied. Review{" "}
            <Link className="font-semibold text-[var(--semantic-brand)] underline" href="/admin/subscriptions">
              Subscriptions &amp; billing
            </Link>{" "}
            and Stripe reconcile dry-run per runbook.
          </p>
          {data.billingIntegrity.hints[0] ? (
            <p className="mt-2 text-xs text-[var(--semantic-text-muted)]">{data.billingIntegrity.hints[0]}</p>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <CardShell
          title="Content Management"
          accent="blue"
          footer={<PrimaryLink href="/admin/content">Manage Content</PrimaryLink>}
        >
          <ul className="space-y-2">
            <li className="flex justify-between gap-3">
              <span>Blog posts</span>
              <span className="tabular-nums font-semibold text-[var(--semantic-text-primary)]">
                {fmt(data.content.blogPosts)}
              </span>
            </li>
            <li className="flex justify-between gap-3">
              <span>Lessons</span>
              <span className="tabular-nums font-semibold text-[var(--semantic-text-primary)]">
                {fmt(data.content.lessons)}
              </span>
            </li>
            <li className="flex justify-between gap-3">
              <span>Flashcards</span>
              <span className="tabular-nums font-semibold text-[var(--semantic-text-primary)]">
                {fmt(data.content.flashcards)}
              </span>
            </li>
            <li className="flex justify-between gap-3">
              <span>Questions (published)</span>
              <span className="tabular-nums font-semibold text-[var(--semantic-text-primary)]">
                {fmt(data.content.questions)}
              </span>
            </li>
          </ul>
        </CardShell>

        <CardShell
          title="Users & Subscriptions"
          accent="yellow"
          footer={<PrimaryLink href="/admin/users">View Users</PrimaryLink>}
        >
          <ul className="space-y-2">
            <li className="flex justify-between gap-3">
              <span>Total users</span>
              <span className="tabular-nums font-semibold text-[var(--semantic-text-primary)]">
                {fmt(data.users.total)}
              </span>
            </li>
            <li className="flex justify-between gap-3">
              <span>Active subscribers</span>
              <span className="tabular-nums font-semibold text-[var(--semantic-text-primary)]">
                {fmt(data.users.activeSubscribers)}
              </span>
            </li>
          </ul>
          <p className="text-xs text-[var(--semantic-text-muted)]">Subscriptions: active + grace (see analytics for detail).</p>
        </CardShell>

        <CardShell
          title="Billing integrity"
          accent="blush"
          footer={<SecondaryLink href="/admin/subscriptions">Subscriptions &amp; billing</SecondaryLink>}
        >
          {data.billingIntegrity ? (
            <ul className="space-y-2 text-[var(--semantic-text-secondary)]">
              <li className="flex justify-between gap-3">
                <span>Signal severity</span>
                <span className="font-semibold uppercase text-[var(--semantic-text-primary)]">
                  {data.billingIntegrity.severity}
                </span>
              </li>
              <li className="flex justify-between gap-3">
                <span>Paid-like rows missing Stripe customer id</span>
                <span className="tabular-nums font-semibold text-[var(--semantic-text-primary)]">
                  {fmt(data.billingIntegrity.signals.activeLikeMissingStripeCustomer)}
                </span>
              </li>
              <li className="flex justify-between gap-3">
                <span>Plan tier ≠ user.tier (paid-like)</span>
                <span className="tabular-nums font-semibold text-[var(--semantic-text-primary)]">
                  {fmt(data.billingIntegrity.signals.activeLikeTierMismatchUser)}
                </span>
              </li>
              <li className="flex justify-between gap-3">
                <span>Webhook claims (24h)</span>
                <span className="tabular-nums font-semibold text-[var(--semantic-text-primary)]">
                  {data.billingIntegrity.signals.recentWebhookEvents24h == null
                    ? "—"
                    : fmt(data.billingIntegrity.signals.recentWebhookEvents24h)}
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[var(--semantic-text-muted)]">Latest subscription row update</span>
                <span className="text-xs">
                  {data.billingIntegrity.signals.latestSubscriptionUpdatedAt
                    ? new Date(data.billingIntegrity.signals.latestSubscriptionUpdatedAt).toLocaleString()
                    : "—"}
                </span>
              </li>
            </ul>
          ) : (
            <p className="text-[var(--semantic-text-muted)]">Billing integrity metrics unavailable.</p>
          )}
          <p className="mt-2 text-xs text-[var(--semantic-text-muted)]">
            JSON: <code className="rounded bg-[var(--semantic-panel-muted)] px-1">GET /api/admin/billing/integrity-summary</code>{" "}
            (staff). Optional <code className="rounded bg-[var(--semantic-panel-muted)] px-1">?emitLog=1</code> writes{" "}
            <code className="rounded bg-[var(--semantic-panel-muted)] px-1">entitlement_drift_suspected</code> when non-ok.
          </p>
        </CardShell>

        <CardShell
          title="Exams / Question Bank"
          accent="green"
          footer={<PrimaryLink href="/admin/questions">Manage Question Bank</PrimaryLink>}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            By tier (published)
          </p>
          {tier ? (
            <ul className="space-y-1.5">
              {(["RN", "PN", "NP", "Allied", "Other"] as const).map((k) => (
                <li key={k} className="flex justify-between gap-3">
                  <span>{k}</span>
                  <span className="tabular-nums font-medium text-[var(--semantic-text-primary)]">
                    {fmt(tier[k] ?? 0)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--semantic-text-muted)]">Tier breakdown unavailable.</p>
          )}
        </CardShell>

        <CardShell title="System Health" accent="green">
          <ul className="space-y-2">
            <li className="flex justify-between gap-3">
              <span>Database</span>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{
                  background:
                    data.health.dbOk === true
                      ? "color-mix(in srgb, var(--semantic-success) 14%, var(--semantic-surface))"
                      : data.health.dbOk === false
                        ? "color-mix(in srgb, var(--semantic-danger) 14%, var(--semantic-surface))"
                        : "color-mix(in srgb, var(--semantic-text-muted) 12%, var(--semantic-surface))",
                  color: "var(--semantic-text-primary)",
                }}
              >
                {data.health.dbOk === true ? "OK" : data.health.dbOk === false ? "Unreachable" : "Unknown"}
              </span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-[var(--semantic-text-muted)]">Last automation log</span>
              {data.health.lastAutomation ? (
                <span className="text-xs leading-snug">
                  {new Date(data.health.lastAutomation.at).toLocaleString()} —{" "}
                  {formatDisplayLabel(data.health.lastAutomation.jobType)}
                  {data.health.lastAutomation.summary ? ` · ${data.health.lastAutomation.summary}` : ""}
                </span>
              ) : (
                <span className="text-xs text-[var(--semantic-text-muted)]">No recent entries (or unavailable).</span>
              )}
            </li>
          </ul>
          <Link href="/admin/system-status" className="nn-admin-happy-btn nn-admin-happy-btn--blue mt-4 w-full">
            Full system status
          </Link>
        </CardShell>

        <CardShell
          title="Quick Actions"
          accent="blue"
          footer={<SecondaryLink href="/admin/operations">Operations center</SecondaryLink>}
        >
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/users"
                className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
              >
                User lookup & support
              </Link>
            </li>
            <li>
              <Link
                href="/admin/questions/import"
                className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
              >
                Question / import tools
              </Link>
            </li>
            <li>
              <Link
                href="/admin/ai/flashcards"
                className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
              >
                Flashcard AI tools
              </Link>
            </li>
            <li>
              <Link
                href="/admin/automation-logs"
                className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
              >
                Automation logs
              </Link>
            </li>
            <li>
              <Link
                href="/admin/diagnostics"
                className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
              >
                Diagnostics & audits
              </Link>
            </li>
          </ul>
          <p className="mt-3 text-xs text-[var(--semantic-text-muted)]">
            CLI: <code className="rounded bg-[var(--semantic-panel-muted)] px-1">npx tsx scripts/admin/create-admin-user.ts &lt;email&gt;</code>
          </p>
        </CardShell>
      </div>
    </div>
  );
}
