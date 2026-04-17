import Link from "next/link";
import type { AdminDashboardOverview } from "@/lib/admin/load-admin-dashboard-overview";

function fmt(n: number | null | undefined, fallback = "—"): string {
  if (n == null || Number.isNaN(n)) return fallback;
  return n.toLocaleString();
}

function CardShell({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section
      className="flex flex-col rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-sm"
      style={{ boxShadow: "var(--semantic-shadow-soft, 0 1px 3px color-mix(in srgb, var(--semantic-text-primary) 8%, transparent))" }}
    >
      <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">{title}</h2>
      <div className="mt-4 flex-1 space-y-3 text-sm text-[var(--semantic-text-secondary)]">{children}</div>
      {footer ? <div className="mt-5 border-t border-[var(--semantic-border-soft)] pt-4">{footer}</div> : null}
    </section>
  );
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="nn-btn-primary inline-flex min-h-[2.5rem] w-full items-center justify-center rounded-xl px-4 text-sm font-semibold"
    >
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
  return (
    <div className="space-y-8">
      {showHeader ? (
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] md:text-3xl">Admin Dashboard</h1>
          <p className="max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <CardShell
          title="Content Management"
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
          title="Exams / Question Bank"
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

        <CardShell title="System Health">
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
                  {new Date(data.health.lastAutomation.at).toLocaleString()} — {data.health.lastAutomation.jobType}
                  {data.health.lastAutomation.summary ? ` · ${data.health.lastAutomation.summary}` : ""}
                </span>
              ) : (
                <span className="text-xs text-[var(--semantic-text-muted)]">No recent entries (or unavailable).</span>
              )}
            </li>
          </ul>
          <Link
            href="/admin/system-status"
            className="nn-btn-secondary inline-flex min-h-[2.5rem] w-full items-center justify-center rounded-xl px-4 text-sm font-semibold"
          >
            Full system status
          </Link>
        </CardShell>

        <CardShell
          title="Quick Actions"
          footer={
            <Link
              href="/admin/operations"
              className="nn-btn-secondary inline-flex min-h-[2.5rem] w-full items-center justify-center rounded-xl px-4 text-sm font-semibold"
            >
              Operations center
            </Link>
          }
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
