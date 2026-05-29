import type { Metadata } from "next";
import { LearnerAccountPageHero, LearnerAccountShell } from "@/components/learner-account-ui";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { BetaFeedbackButton } from "@/components/beta/beta-feedback-button";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { betaFeaturesToLabels } from "@/lib/beta/beta-feature-options";
import { redeemBetaAccessCodeAction } from "./actions";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "Beta Program | NurseNest",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/account/beta", routeGroup: "student.learner.account_beta" },
  );
}

function statusMessage(status?: string, name?: string, message?: string): { tone: "success" | "error"; text: string } | null {
  if (status === "redeemed") return { tone: "success", text: `Welcome to the NurseNest Beta Program. You now have access to ${name || "your beta preview"}.` };
  if (status === "already") return { tone: "success", text: `${name || "This beta code"} is already active on your account.` };
  if (message) return { tone: "error", text: message };
  return null;
}

export default async function AccountBetaProgramPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { t } = await getLearnerMarketingBundle();
  const session = await getProtectedRouteSession("(student).app.(learner).account.beta");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const sp = await searchParams;
  const notice = statusMessage(sp.status, sp.name, sp.message);

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <LearnerAccountShell className="space-y-8 py-2">
        <LearnerBreadcrumbTrail kind="account-leaf" leafLabel="Beta Program" pathname="/app/account" />
        <PremiumEmptyState
          headline="Beta Program"
          body="We are checking your learner session."
          hint="Return to the study hub and try again if this does not refresh."
          primaryCta={{ label: "Open Study Hub", href: "/app", variant: "primary" }}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </LearnerAccountShell>
    );
  }

  const [grants, feedback] = await Promise.all([
    prisma.betaAccessGrant.findMany({
      where: { userId },
      orderBy: { redeemedAt: "desc" },
      include: { code: { select: { name: true, description: true, displayCode: true, enabled: true } } },
    }),
    prisma.betaFeedbackReport.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, feature: true, kind: true, rating: true, summary: true, createdAt: true, status: true },
    }),
  ]).catch(() => [[], []] as const);

  const activeFeatures = Array.from(new Set(grants.filter((grant) => !grant.revokedAt).flatMap((grant) => grant.features)));
  return (
    <LearnerAccountShell className="space-y-8 py-2" data-testid="learner-account-beta">
      <LearnerBreadcrumbTrail kind="account-leaf" leafLabel="Beta Program" pathname="/app/account" />
      <LearnerAccountPageHero
        eyebrow={t("learner.account.shell.kicker")}
        title="Beta Program"
        description="Redeem invitation codes, see your enabled previews, and send feedback directly to the NurseNest team."
      />
      {notice ? (
        <div
          className={`rounded-2xl border p-4 text-sm font-semibold ${
            notice.tone === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800"
              : "border-red-500/30 bg-red-500/10 text-red-800"
          }`}
        >
          {notice.text}
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <form action={redeemBetaAccessCodeAction} className="rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Redeem beta access code</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the code provided by NurseNest. Codes may be single-use, expiring, unlimited-use, or tied to specific preview features.
          </p>
          <label className="mt-5 grid gap-1 text-sm font-semibold">
            Access code
            <input
              name="code"
              required
              placeholder="FLASHCARDS-V2"
              className="rounded-xl border border-[var(--semantic-border-soft)] bg-background px-3 py-3 text-sm font-bold uppercase tracking-wide"
            />
          </label>
          <button type="submit" className="mt-4 min-h-[44px] rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">
            Redeem code
          </button>
        </form>

        <div className="rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Your beta access</h2>
            {activeFeatures.length ? (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">BETA TESTER</span>
            ) : null}
          </div>
          <div className="mt-4 grid gap-3">
            {grants.length ? (
              grants.map((grant) => (
                <article key={grant.id} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-background/45 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-bold text-[var(--semantic-text-primary)]">{grant.code.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{grant.code.description || betaFeaturesToLabels(grant.features).join(", ")}</p>
                      <p className="mt-2 text-xs font-semibold text-muted-foreground">{betaFeaturesToLabels(grant.features).join(", ")}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${grant.revokedAt ? "bg-slate-500/15 text-slate-700" : "bg-emerald-500/15 text-emerald-700"}`}>
                      {grant.revokedAt ? "Revoked" : "Active"}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-[var(--semantic-border-soft)] p-4 text-sm text-muted-foreground">
                No beta features are active yet. Redeem a code from an administrator to unlock previews.
              </p>
            )}
          </div>
        </div>
      </section>

      <BetaFeedbackButton features={activeFeatures} />

      <section className="rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Your feedback history</h2>
        <div className="mt-4 grid gap-3">
          {feedback.length ? (
            feedback.map((item) => (
              <article key={item.id} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-background/45 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <span>{betaFeaturesToLabels([item.feature])[0]}</span>
                  <span>{item.kind}</span>
                  <span>{item.rating ? `${item.rating}/5` : "Not rated"}</span>
                  <span>{item.status}</span>
                </div>
                <p className="mt-2 font-semibold text-[var(--semantic-text-primary)]">{item.summary}</p>
              </article>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No feedback submitted yet.</p>
          )}
        </div>
      </section>
    </LearnerAccountShell>
  );
}
