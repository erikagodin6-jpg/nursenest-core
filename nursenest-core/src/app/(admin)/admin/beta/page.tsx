import type { Metadata } from "next";
import { BetaFeedbackKind, BetaFeatureKey } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { BETA_FEATURE_OPTIONS, betaFeaturesToLabels } from "@/lib/beta/beta-access";
import {
  createBetaAccessCode,
  disableBetaAccessCode,
  enableBetaAccessCode,
  extendBetaAccessCode,
  revokeBetaAccessGrant,
  sendBetaInvitationEmail,
} from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beta Access Management | NurseNest Admin",
  robots: { index: false, follow: false },
};

function formatDate(value: Date | null | undefined): string {
  if (!value) return "No expiry";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

function formatFeatures(features: readonly BetaFeatureKey[]): string {
  const labels = betaFeaturesToLabels(features);
  return labels.length ? labels.join(", ") : "No features selected";
}

export default async function AdminBetaAccessPage() {
  await requireAdmin();

  if (!isDatabaseUrlConfigured()) {
    return (
      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">Beta Access Management</h1>
        <p className="mt-2 text-sm text-muted-foreground">Database connection is unavailable in this environment.</p>
      </main>
    );
  }

  const [codes, recentFeedback, activitySummary, inviteLogs] = await Promise.all([
    prisma.betaAccessCode.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
      include: {
        grants: {
          orderBy: { redeemedAt: "desc" },
          take: 20,
          include: { user: { select: { id: true, email: true, name: true } } },
        },
        creator: { select: { email: true, name: true } },
      },
    }),
    prisma.betaFeedbackReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.betaActivityEvent.groupBy({
      by: ["eventType"],
      _count: { _all: true },
      orderBy: { _count: { eventType: "desc" } },
      take: 10,
    }),
    prisma.betaInvitationEmailLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { code: { select: { name: true, displayCode: true } } },
    }),
  ]).catch(() => [[], [], [], []] as const);

  const activeTesterCount = new Set(
    codes.flatMap((code) => code.grants.filter((grant) => !grant.revokedAt).map((grant) => grant.userId)),
  ).size;

  return (
    <main className="mx-auto w-full max-w-[1500px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-3xl border border-border/70 bg-[var(--theme-card-bg)] p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Operations</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">Beta Access Management</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Generate invitation codes, unlock feature-specific previews, track tester usage, collect beta feedback, and revoke access from one admin surface.
            </p>
          </div>
          <a
            href="/api/admin/beta/testers/export"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-primary/25 bg-primary/10 px-4 text-sm font-bold text-primary hover:bg-primary/15"
          >
            Export testers
          </a>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Active testers</p>
          <p className="mt-2 text-3xl font-bold text-[var(--theme-heading-text)]">{activeTesterCount}</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Codes</p>
          <p className="mt-2 text-3xl font-bold text-[var(--theme-heading-text)]">{codes.length}</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent feedback</p>
          <p className="mt-2 text-3xl font-bold text-[var(--theme-heading-text)]">{recentFeedback.length}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <form action={createBetaAccessCode} className="rounded-3xl border border-border/70 bg-[var(--theme-card-bg)] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Create beta code</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-1 text-sm font-semibold">
              Code name
              <input name="name" required placeholder="Clinical Skills early access" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Custom code (optional)
              <input name="code" placeholder="CLINICALSKILLS-EARLY" className="rounded-xl border border-border bg-background px-3 py-2 text-sm uppercase" />
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Description
              <textarea name="description" rows={3} className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
            </label>
            <div className="grid gap-3">
              <p className="text-sm font-semibold">Enabled beta features</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {BETA_FEATURE_OPTIONS.map((feature) => (
                  <label key={feature.key} className="flex gap-2 rounded-xl border border-border/70 bg-background/50 p-3 text-sm">
                    <input name="features" value={feature.key} type="checkbox" className="mt-1" />
                    <span>
                      <span className="block font-semibold">{feature.label}</span>
                      <span className="block text-xs text-muted-foreground">{feature.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-semibold">
                Expiration
                <input name="expiresAt" type="datetime-local" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
              </label>
              <label className="grid gap-1 text-sm font-semibold">
                Max redemptions
                <input name="maxRedemptions" type="number" min="1" placeholder="Blank = unlimited" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
              </label>
            </div>
            <button className="min-h-[44px] rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground" type="submit">
              Create code
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {codes.map((code) => (
            <article key={code.id} className="rounded-3xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{code.name}</h2>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${code.enabled ? "bg-emerald-500/15 text-emerald-700" : "bg-slate-500/15 text-slate-700"}`}>
                      {code.enabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-sm font-bold text-primary">{code.displayCode}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{code.description || "No description provided."}</p>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">{formatFeatures(code.features)}</p>
                </div>
                <div className="text-sm text-muted-foreground sm:text-right">
                  <p>{code.usageCount}/{code.maxRedemptions ?? "unlimited"} used</p>
                  <p>{formatDate(code.expiresAt)}</p>
                  <p>Created by {code.creator?.name ?? code.creator?.email ?? "admin"}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
                <form action={extendBetaAccessCode} className="flex gap-2">
                  <input type="hidden" name="codeId" value={code.id} />
                  <input name="expiresAt" type="datetime-local" className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                  <button className="rounded-xl border border-border px-3 text-sm font-bold" type="submit">Extend</button>
                </form>
                <form action={code.enabled ? disableBetaAccessCode : enableBetaAccessCode}>
                  <input type="hidden" name="codeId" value={code.id} />
                  <button className="min-h-[40px] rounded-xl border border-border px-3 text-sm font-bold" type="submit">
                    {code.enabled ? "Disable" : "Enable"}
                  </button>
                </form>
              </div>

              <form action={sendBetaInvitationEmail} className="mt-4 grid gap-2 rounded-2xl border border-border/70 bg-background/45 p-3 md:grid-cols-[1fr_1.2fr_auto]">
                <input type="hidden" name="codeId" value={code.id} />
                <input name="targetEmail" type="email" required placeholder="tester@example.com" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                <input name="expectations" placeholder="Testing expectations (optional)" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                <button className="min-h-[40px] rounded-xl bg-primary px-3 text-sm font-bold text-primary-foreground" type="submit">Send invite</button>
              </form>

              {code.grants.length ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="py-2">Tester</th>
                        <th className="py-2">Redeemed</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {code.grants.map((grant) => (
                        <tr key={grant.id}>
                          <td className="py-2">{grant.user.name || grant.user.email}</td>
                          <td className="py-2">{formatDate(grant.redeemedAt)}</td>
                          <td className="py-2">{grant.revokedAt ? "Revoked" : "Active"}</td>
                          <td className="py-2">
                            {!grant.revokedAt ? (
                              <form action={revokeBetaAccessGrant} className="flex gap-2">
                                <input type="hidden" name="grantId" value={grant.id} />
                                <input name="reason" placeholder="Reason" className="rounded-lg border border-border bg-background px-2 py-1 text-xs" />
                                <button className="rounded-lg border border-red-500/30 px-2 py-1 text-xs font-bold text-red-700" type="submit">Revoke</button>
                              </form>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border/70 bg-[var(--theme-card-bg)] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Recent beta feedback</h2>
          <div className="mt-4 space-y-3">
            {recentFeedback.length ? recentFeedback.map((item) => (
              <article key={item.id} className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <span>{betaFeaturesToLabels([item.feature])[0]}</span>
                  <span>{item.kind === BetaFeedbackKind.QUALITY_RATING ? `${item.rating ?? "No"} / 5` : item.kind}</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                <p className="mt-2 font-semibold text-[var(--theme-heading-text)]">{item.summary}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.user.name || item.user.email}</p>
              </article>
            )) : <p className="text-sm text-muted-foreground">No beta feedback yet.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-[var(--theme-card-bg)] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Tester analytics</h2>
          <div className="mt-4 grid gap-3">
            {activitySummary.length ? activitySummary.map((item) => (
              <div key={item.eventType} className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/45 p-4">
                <span className="text-sm font-semibold">{item.eventType.replace(/_/g, " ").toLowerCase()}</span>
                <span className="text-lg font-bold text-primary">{item._count._all}</span>
              </div>
            )) : <p className="text-sm text-muted-foreground">No beta activity events yet.</p>}
          </div>
          <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-muted-foreground">Recent invitations</h3>
          <div className="mt-3 space-y-2 text-sm">
            {inviteLogs.map((log) => (
              <div key={log.id} className="rounded-2xl border border-border/70 bg-background/45 p-3">
                <p className="font-semibold">{log.targetEmail}</p>
                <p className="text-muted-foreground">{log.code.name} · {log.status} · {formatDate(log.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
