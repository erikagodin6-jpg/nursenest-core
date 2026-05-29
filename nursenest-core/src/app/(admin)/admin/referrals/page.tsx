import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guards";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadAdminReferralDashboard } from "@/lib/referrals/referral-rewards";
import {
  createReferralRewardRule,
  grantManualReferralReward,
  resolveReferralFraudSignal,
  toggleReferralRewardRule,
} from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Referral Management | NurseNest Admin",
  robots: { index: false, follow: false },
};

function countByStatus(rows: Array<{ status: string; _count: { _all: number } }>, status: string): number {
  return rows.find((row) => row.status === status)?._count._all ?? 0;
}

export default async function AdminReferralManagementPage() {
  await requireAdmin();
  if (!isDatabaseUrlConfigured()) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">Referral Management</h1>
        <p className="mt-2 text-sm text-muted-foreground">Database connection is unavailable.</p>
      </main>
    );
  }

  const dashboard = await loadAdminReferralDashboard();
  const created = dashboard.statusRows.reduce((total: number, row: { _count: { _all: number } }) => total + row._count._all, 0);
  const qualified = countByStatus(dashboard.statusRows, "QUALIFIED") + countByStatus(dashboard.statusRows, "SUBSCRIBED");
  const subscribed = countByStatus(dashboard.statusRows, "SUBSCRIBED");
  const conversion = created > 0 ? Math.round((qualified / created) * 100) : 0;

  return (
    <main className="mx-auto w-full max-w-[1500px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-3xl border border-border/70 bg-[var(--theme-card-bg)] p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Growth operations</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">Referral Management</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Track referral attribution, qualification gates, rewards, paid conversions, and fraud-review signals. Rewards are never granted for clicks or account creation alone.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Accounts created", created],
          ["Qualified referrals", qualified],
          ["Paid conversions", subscribed],
          ["Conversion rate", `${conversion}%`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold text-[var(--theme-heading-text)]">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form action={createReferralRewardRule} className="rounded-3xl border border-border/70 bg-[var(--theme-card-bg)] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Create reward rule</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-1 text-sm font-semibold">
              Rule name
              <input name="name" required placeholder="1 qualified referral → 7 free days" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Description
              <textarea name="description" rows={3} className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-semibold">
                Trigger
                <select name="trigger" className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
                  <option value="QUALIFIED_REFERRAL_COUNT">Qualified referrals</option>
                  <option value="PAID_REFERRAL_COUNT">Paid referrals</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                Threshold
                <input name="threshold" type="number" min="1" defaultValue="1" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-semibold">
                Reward
                <select name="rewardKind" className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
                  <option value="FREE_DAYS">Free days</option>
                  <option value="FREE_MONTH">Free month</option>
                  <option value="ACCOUNT_CREDIT">Account credit</option>
                  <option value="FEATURE_UNLOCK">Feature unlock</option>
                  <option value="AMBASSADOR_STATUS">Ambassador status</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                Value
                <input name="rewardValue" type="number" min="0" placeholder="7, 30, or credit cents" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-semibold">
                Feature key
                <input name="featureKey" placeholder="advanced_ecg_limited" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                Duration days
                <input name="durationDays" type="number" min="0" placeholder="30" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
              </label>
            </div>
            <button className="min-h-[44px] rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground" type="submit">
              Save reward rule
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <section className="rounded-3xl border border-border/70 bg-[var(--theme-card-bg)] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Reward rules</h2>
            <div className="mt-4 space-y-3">
              {dashboard.rules.map((rule: any) => (
                <article key={rule.id} className="rounded-2xl border border-border/70 bg-background/50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-[var(--theme-heading-text)]">{rule.name}</p>
                      <p className="text-sm text-muted-foreground">{rule.trigger.replaceAll("_", " ")} · threshold {rule.threshold} · {rule.rewardKind.replaceAll("_", " ")}</p>
                    </div>
                    <form action={toggleReferralRewardRule}>
                      <input type="hidden" name="id" value={rule.id} />
                      <input type="hidden" name="enabled" value={String(!rule.enabled)} />
                      <button className="rounded-xl border border-border px-3 py-2 text-sm font-semibold" type="submit">
                        {rule.enabled ? "Disable" : "Enable"}
                      </button>
                    </form>
                  </div>
                </article>
              ))}
              {dashboard.rules.length === 0 ? <p className="text-sm text-muted-foreground">No reward rules configured yet.</p> : null}
            </div>
          </section>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border/70 bg-[var(--theme-card-bg)] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Top referrers</h2>
          <div className="mt-4 space-y-3">
            {dashboard.topReferrers.map((row: any) => (
              <div key={row.user.id} className="rounded-2xl border border-border/70 bg-background/50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-[var(--theme-heading-text)]">{row.user.name ?? "Learner"}</p>
                    <p className="text-sm text-muted-foreground">{row.user.email}</p>
                  </div>
                  <div className="text-sm font-bold text-primary">{row.referrals} referrals</div>
                </div>
                <form action={grantManualReferralReward} className="mt-3 flex gap-2">
                  <input type="hidden" name="referrerUserId" value={row.user.id} />
                  <input name="reason" placeholder="Manual reward reason" className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                  <button className="rounded-xl bg-primary px-3 py-2 text-sm font-bold text-primary-foreground" type="submit">Grant</button>
                </form>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-[var(--theme-card-bg)] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Fraud review queue</h2>
          <div className="mt-4 space-y-3">
            {dashboard.fraudSignals.map((signal: any) => (
              <article key={signal.id} className="rounded-2xl border border-amber-300/60 bg-amber-50/70 p-4 text-amber-950">
                <p className="text-sm font-bold">{signal.type.replaceAll("_", " ")}</p>
                <p className="mt-1 text-sm">{signal.detail}</p>
                <p className="mt-1 text-xs">{signal.subject?.email ?? "Unknown learner"}</p>
                <form action={resolveReferralFraudSignal} className="mt-3">
                  <input type="hidden" name="id" value={signal.id} />
                  <button className="rounded-xl border border-amber-400 px-3 py-2 text-sm font-bold" type="submit">Mark reviewed</button>
                </form>
              </article>
            ))}
            {dashboard.fraudSignals.length === 0 ? <p className="text-sm text-muted-foreground">No open referral fraud signals.</p> : null}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border/70 bg-[var(--theme-card-bg)] p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Recent rewards</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-2">Referrer</th>
                <th className="py-2">Reward</th>
                <th className="py-2">Status</th>
                <th className="py-2">Reason</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.rewards.map((reward: any) => (
                <tr key={reward.id} className="border-t border-border/60">
                  <td className="py-3">{reward.referrer?.email ?? "Unknown"}</td>
                  <td className="py-3">{reward.rewardKind.replaceAll("_", " ")}</td>
                  <td className="py-3">{reward.status}</td>
                  <td className="py-3">{reward.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
