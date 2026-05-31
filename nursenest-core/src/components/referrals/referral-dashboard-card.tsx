"use client";

import { useMemo, useState } from "react";
import { Copy, Gift, Link2, QrCode, ShieldCheck, Sparkles, Trophy, UsersRound } from "lucide-react";
import type {
  CampusChallengeTemplate,
  ReferralGrowthSummary,
  ReferralRewardMilestone,
  ReferralShareAssets,
  ShareableMilestoneTemplate,
  SuccessStoryPrompt,
} from "@/lib/referrals/student-ambassador-ecosystem";

type ReferralDashboardCardProps = {
  dashboard: {
    code: { displayCode: string; referralLink: string | null };
    stats: {
      accountsCreated: number;
      qualifiedReferrals: number;
      subscribedReferrals: number;
      rewardsEarned: number;
    };
    rewards: Array<{
      id: string;
      status: string;
      rewardKind: string;
      rewardValue: number | null;
      discountPercent?: number | null;
      featureKey: string | null;
      durationDays: number | null;
      reason: string;
    }>;
    ambassador?: {
      status: string;
      paidReferralCount: number;
      qualifiedReferralCount: number;
      earlyFeatureAccess: boolean;
      prioritySupport: boolean;
    } | null;
    recentReferrals: Array<{
      id: string;
      status: string;
      createdAt: string | Date;
      qualifiedAt: string | Date | null;
      firstSubscribedAt: string | Date | null;
      referred: { name: string | null };
    }>;
    growth?: ReferralGrowthSummary;
    shareAssets?: ReferralShareAssets;
    rewardMilestones?: readonly ReferralRewardMilestone[];
    ambassadorProgram?: {
      professions: readonly string[];
      status: string;
    };
    shareableMilestones?: readonly ShareableMilestoneTemplate[];
    campusChallenges?: readonly CampusChallengeTemplate[];
    successStoryPrompts?: readonly SuccessStoryPrompt[];
  };
};

function rewardLabel(reward: ReferralDashboardCardProps["dashboard"]["rewards"][number]): string {
  if (reward.rewardKind === "FREE_DAYS") return `${reward.rewardValue ?? reward.durationDays ?? 7} free days`;
  if (reward.rewardKind === "FREE_MONTH") return "1 free month";
  if (reward.rewardKind === "FIRST_MONTH_DISCOUNT") return `${reward.discountPercent ?? reward.rewardValue ?? 20}% off first month`;
  if (reward.rewardKind === "PREMIUM_TRIAL") return `${reward.durationDays ?? reward.rewardValue ?? 14}-day premium trial`;
  if (reward.rewardKind === "FEATURE_UNLOCK") return `${reward.featureKey ?? "Premium feature"} access`;
  if (reward.rewardKind === "AMBASSADOR_STATUS") return "Premium Ambassador status";
  if (reward.rewardKind === "ACCOUNT_CREDIT") return `$${reward.rewardValue ?? 0} account credit`;
  return reward.reason;
}

export function ReferralDashboardCard({ dashboard }: ReferralDashboardCardProps) {
  const [message, setMessage] = useState<string | null>(null);
  const referralLink = useMemo(
    () => dashboard.code.referralLink ?? `${globalThis.location?.origin ?? ""}/signup?ref=${encodeURIComponent(dashboard.code.displayCode)}`,
    [dashboard.code.displayCode, dashboard.code.referralLink],
  );

  async function copy(value: string, label: string) {
    await navigator.clipboard?.writeText(value);
    setMessage(`${label} copied.`);
  }

  return (
    <section
      className="nn-card nn-gradient-safe overflow-hidden border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))] bg-gradient-to-br from-[var(--semantic-surface)] via-[var(--semantic-panel-cool)] to-[color-mix(in_srgb,var(--semantic-success)_08%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
      data-testid="referral-dashboard-card"
      aria-labelledby="referral-dashboard-title"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_26%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] text-[var(--semantic-success-contrast)]">
            <Gift className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-success-contrast)]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Rewards require verified, active learners
            </p>
            <h2 id="referral-dashboard-title" className="mt-3 text-xl font-bold tracking-tight text-[var(--theme-heading-text)]">
              Invite Friends
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Share your code or link. Rewards are granted only after your friend creates an account, verifies email, completes onboarding, and starts learning.
            </p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Friend code</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="rounded-xl bg-[var(--semantic-panel-cool)] px-3 py-2 font-mono text-lg font-bold tracking-[0.18em] text-[var(--semantic-text-primary)]">
                {dashboard.code.displayCode}
              </p>
              <button type="button" onClick={() => copy(dashboard.code.displayCode, "Friend code")} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[var(--semantic-border-soft)] px-3 text-sm font-semibold">
                <Copy className="h-4 w-4" aria-hidden />
                Copy
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Referral link</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 truncate rounded-xl bg-[var(--semantic-panel-cool)] px-3 py-2 text-sm font-semibold text-[var(--semantic-text-primary)]">
                {referralLink}
              </p>
              <button type="button" onClick={() => copy(referralLink, "Referral link")} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[var(--semantic-brand)] px-3 text-sm font-bold text-white">
                <Link2 className="h-4 w-4" aria-hidden />
                Copy link
              </button>
            </div>
          </div>
        </div>

        {dashboard.shareAssets ? (
          <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
            <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <QrCode className="h-4 w-4" aria-hidden />
                Referral QR
              </p>
              <img
                src={dashboard.shareAssets.qrCodeUrl}
                alt={`QR code for referral code ${dashboard.shareAssets.referralCode}`}
                width={180}
                height={180}
                className="mt-3 rounded-xl border border-[var(--semantic-border-soft)] bg-white p-2"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shareable referral card</p>
              <h3 className="mt-2 text-lg font-bold text-[var(--semantic-text-primary)]">{dashboard.shareAssets.shareCardTitle}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{dashboard.shareAssets.shareCardBody}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => copy(dashboard.shareAssets!.shareText, "Share text")} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[var(--semantic-border-soft)] px-3 text-sm font-semibold">
                  <Copy className="h-4 w-4" aria-hidden />
                  Copy share text
                </button>
                <button type="button" onClick={() => copy(dashboard.shareAssets!.referralLink, "Referral link")} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[var(--semantic-brand)] px-3 text-sm font-bold text-white">
                  <Link2 className="h-4 w-4" aria-hidden />
                  Copy invite link
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-4">
          {[
            ["Accounts created", dashboard.stats.accountsCreated],
            ["Qualified", dashboard.stats.qualifiedReferrals],
            ["Subscribed", dashboard.stats.subscribedReferrals],
            ["Rewards earned", dashboard.stats.rewardsEarned],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-bold text-[var(--semantic-text-primary)]">{value}</p>
            </div>
          ))}
        </div>

        {dashboard.ambassador && dashboard.ambassador.status !== "NONE" ? (
          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_26%,var(--semantic-border-soft))] bg-[var(--semantic-panel-positive)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ambassador status</p>
            <h3 className="mt-1 text-lg font-bold text-[var(--semantic-text-primary)]">
              {dashboard.ambassador.status === "ELITE_AMBASSADOR" ? "NurseNest Elite Ambassador" : "NurseNest Ambassador"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {dashboard.ambassador.paidReferralCount} paid referrals · early feature access
              {dashboard.ambassador.prioritySupport ? " · priority support" : ""}
            </p>
          </div>
        ) : null}

        {dashboard.growth?.nextMilestone ? (
          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Trophy className="h-4 w-4 text-[var(--semantic-warning-contrast)]" aria-hidden />
                  Next reward
                </p>
                <h3 className="mt-1 text-lg font-bold text-[var(--semantic-text-primary)]">{dashboard.growth.nextMilestone.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{dashboard.growth.nextMilestone.rewardSummary}</p>
              </div>
              <p className="text-sm font-bold text-[var(--semantic-text-primary)]">
                {dashboard.growth.paidReferrals}/{dashboard.growth.nextMilestone.referralsRequired} paid referrals
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--semantic-panel-muted)]">
              <div className="h-full rounded-full bg-[var(--semantic-warning)]" style={{ width: `${dashboard.growth.nextMilestoneProgressPct}%` }} />
            </div>
          </div>
        ) : null}

        {dashboard.rewardMilestones?.length ? (
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <h3 className="text-sm font-bold text-[var(--semantic-text-primary)]">Referral reward ladder</h3>
            <div className="mt-3 grid gap-2 md:grid-cols-5">
              {dashboard.rewardMilestones.map((milestone) => (
                <div key={milestone.referralsRequired} className="rounded-xl bg-[var(--semantic-panel-cool)] p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{milestone.referralsRequired} referrals</p>
                  <p className="mt-1 text-sm font-bold text-[var(--semantic-text-primary)]">{milestone.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{milestone.rewardSummary}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--semantic-text-primary)]">
              <UsersRound className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
              Recent referrals
            </h3>
            <div className="mt-3 space-y-2">
              {dashboard.recentReferrals.length ? dashboard.recentReferrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--semantic-panel-cool)] px-3 py-2 text-sm">
                  <span className="font-medium text-[var(--semantic-text-primary)]">{referral.referred.name || "NurseNest learner"}</span>
                  <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{referral.status.replaceAll("_", " ")}</span>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No referred accounts yet.</p>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--semantic-text-primary)]">
              <Sparkles className="h-4 w-4 text-[var(--semantic-warning-contrast)]" aria-hidden />
              Rewards
            </h3>
            <div className="mt-3 space-y-2">
              {dashboard.rewards.length ? dashboard.rewards.map((reward) => (
                <div key={reward.id} className="rounded-xl bg-[var(--semantic-panel-positive)] px-3 py-2 text-sm">
                  <p className="font-semibold text-[var(--semantic-text-primary)]">{rewardLabel(reward)}</p>
                  <p className="text-xs text-muted-foreground">{reward.status.toLowerCase()} · {reward.reason}</p>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">Rewards appear here after qualified referral milestones are reached.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <h3 className="text-sm font-bold text-[var(--semantic-text-primary)]">Shareable milestones</h3>
            <div className="mt-3 space-y-2">
              {(dashboard.shareableMilestones ?? []).slice(0, 4).map((milestone) => (
                <button
                  key={milestone.kind}
                  type="button"
                  onClick={() => copy(`${milestone.shareText} ${referralLink}`, milestone.title)}
                  className="block w-full rounded-xl bg-[var(--semantic-panel-cool)] px-3 py-2 text-left text-sm"
                >
                  <span className="font-semibold text-[var(--semantic-text-primary)]">{milestone.graphicHeadline}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{milestone.graphicSubline}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <h3 className="text-sm font-bold text-[var(--semantic-text-primary)]">Campus challenges</h3>
            <div className="mt-3 space-y-2">
              {(dashboard.campusChallenges ?? []).slice(0, 4).map((challenge) => (
                <div key={challenge.id} className="rounded-xl bg-[var(--semantic-panel-cool)] px-3 py-2 text-sm">
                  <p className="font-semibold text-[var(--semantic-text-primary)]">{challenge.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{challenge.prompt}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <h3 className="text-sm font-bold text-[var(--semantic-text-primary)]">Success stories</h3>
            <div className="mt-3 space-y-2">
              {(dashboard.successStoryPrompts ?? []).slice(0, 4).map((story) => (
                <div key={story.id} className="rounded-xl bg-[var(--semantic-panel-positive)] px-3 py-2 text-sm">
                  <p className="font-semibold text-[var(--semantic-text-primary)]">{story.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{story.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {message ? <p className="text-sm font-semibold text-[var(--semantic-success-contrast)]">{message}</p> : null}
      </div>
    </section>
  );
}
