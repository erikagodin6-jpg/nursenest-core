import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadRevenueAlertsCenterDashboard } from "@/lib/revenue-alerts/revenue-alerts-center.server";

export const dynamic = "force-dynamic";

function stat(label: string, value: string | number, detail?: string) {
  return (
    <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{value}</p>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </div>
  );
}

function testButton(action: string, label: string) {
  return (
    <form action="/api/admin/revenue-alerts/test" method="post">
      <input type="hidden" name="action" value={action} />
      <button
        type="submit"
        className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/15"
      >
        {label}
      </button>
    </form>
  );
}

export default async function AdminRevenueAlertsPage() {
  await requireAdmin();
  const data = await loadRevenueAlertsCenterDashboard();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Revenue alerts</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Revenue Alerts Center</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Owner notifications, delivery status, audit logs, health checks, and test sends for financially important events.
          </p>
        </div>
        <Link href="/admin/revenue-protection" className="text-sm font-semibold text-primary underline">
          Revenue protection →
        </Link>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {stat("Today", data.summary.today)}
        {stat("This week", data.summary.thisWeek)}
        {stat("This month", data.summary.thisMonth)}
        {stat("Unread alerts", data.summary.unread)}
        {stat("Resolved alerts", data.summary.resolved)}
        {stat("Revenue events", data.summary.revenueEvents)}
      </section>

      <section className="mt-8 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Notification health</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {stat("Stripe webhooks", data.health.stripeWebhookConfigured ? "OK" : "Missing")}
          {stat("Email delivery", data.health.emailConfigured ? "Configured" : "Missing")}
          {stat("SMS delivery", data.health.smsConfigured ? "Configured" : "Missing")}
          {stat("Notification queues", data.health.notificationQueueHealthy ? "Healthy" : "Needs review", `${data.health.recentFailedDeliveries} failed`)}
          {stat("Background jobs", data.health.backgroundJobsHealthy ? "Healthy" : "Needs config")}
          {stat("Optional webhooks", data.health.discordConfigured || data.health.slackConfigured ? "Configured" : "Not set")}
        </div>
        {data.health.missingCritical.length > 0 ? (
          <p className="mt-4 rounded-lg border border-red-300/60 bg-red-50 p-3 text-sm font-semibold text-red-700 dark:bg-red-950/25 dark:text-red-200">
            Critical missing config: {data.health.missingCritical.join(", ")}
          </p>
        ) : null}
      </section>

      <section className="mt-8 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Channel tests</h2>
            <p className="mt-1 text-sm text-muted-foreground">Run these after changing notification configuration.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {testButton("email", "Send Test Email")}
            {testButton("sms", "Send Test SMS")}
            {testButton("subscription", "Simulate Subscription")}
            {testButton("renewal", "Simulate Renewal")}
            {testButton("failed_payment", "Simulate Failed Payment")}
            {testButton("cancellation", "Simulate Cancellation")}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Recent revenue alerts</h2>
            <p className="mt-1 text-sm text-muted-foreground">Generated {new Date(data.generatedAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-2 pr-3">Created</th>
                <th className="py-2 pr-3">Event</th>
                <th className="py-2 pr-3">Amount</th>
                <th className="py-2 pr-3">Delivery</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">SMS</th>
                <th className="py-2 pr-3">Retry</th>
                <th className="py-2">Errors</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.id} className="border-b border-border/50 align-top">
                  <td className="py-3 pr-3 text-xs">{new Date(row.createdAt).toLocaleString()}</td>
                  <td className="py-3 pr-3">
                    <p className="font-semibold text-[var(--theme-heading-text)]">{row.event}</p>
                    <p className="text-xs text-muted-foreground">{row.subject}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{row.userId}</p>
                  </td>
                  <td className="py-3 pr-3 font-semibold tabular-nums">{row.amountLabel}</td>
                  <td className="py-3 pr-3">{row.deliveryStatus}</td>
                  <td className="py-3 pr-3">{row.emailStatus}</td>
                  <td className="py-3 pr-3">{row.smsStatus}</td>
                  <td className="py-3 pr-3">{row.retryStatus}</td>
                  <td className="py-3 text-xs text-muted-foreground">{row.errorMessages.join("; ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No revenue alerts recorded yet.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
