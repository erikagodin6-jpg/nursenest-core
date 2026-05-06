import Link from "next/link";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { LearnerAccountPageHero, LearnerAccountShell } from "@/components/learner-account-ui";
import { LearnerBillingStatusBanner } from "@/components/student/learner-billing-page-content";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { formatBillingTierLabel, loadBillingPagePayload } from "@/lib/learner/load-billing-page-payload";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { loadPremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";

const QUICK_LINKS: readonly { href: string; labelKey: string; descriptionKey: string }[] = [
  { href: "/app/account/billing", labelKey: "learner.account.nav.billing", descriptionKey: "learner.account.center.quick.billing" },
  { href: "/app/account/settings", labelKey: "learner.account.nav.settings", descriptionKey: "learner.account.center.quick.settings" },
  { href: "/app/account/report", labelKey: "learner.account.nav.report", descriptionKey: "learner.account.center.quick.report" },
  { href: "/app/account/activity", labelKey: "learner.account.nav.activity", descriptionKey: "learner.account.center.quick.activity" },
  { href: "/app/account/support", labelKey: "learner.account.nav.support", descriptionKey: "learner.account.center.quick.support" },
] as const;

export async function LearnerAccountCenterOverview({
  t,
  locale,
}: {
  t: LearnerMarketingT;
  locale: string;
}) {
  const session = await getProtectedRouteSession("(student).app.(learner).account");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const localeTag = locale.replace(/_/g, "-");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <LearnerAccountShell className="py-2">
        <PremiumEmptyState
          headline={t("learner.account.center.title")}
          body={t("learner.profile.signedOutHint")}
          hint={t("learner.dashboard.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app/account"), variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </LearnerAccountShell>
    );
  }

  const entitlement = await resolveEntitlementForPage(userId);
  const [userRow, billing] = await Promise.all([
    prisma.user
      .findUnique({
        where: { id: userId },
        select: { name: true, email: true, learnerPath: true },
      })
      .catch(() => null),
    loadBillingPagePayload(userId).catch(() => null),
  ]);

  let snapshot = null;
  if (entitlement !== "error" && entitlement.hasAccess) {
    try {
      snapshot = await loadPremiumDashboardSnapshot(userId, entitlement);
    } catch {
      snapshot = null;
    }
  }

  const pathwayKey = userRow?.learnerPath?.trim();
  const pathwayLabel = pathwayKey
    ? getExamPathwayById(pathwayKey)?.shortName ?? getExamPathwayById(pathwayKey)?.displayName ?? null
    : null;

  const planLabel =
    billing != null ? formatBillingTierLabel(billing.effectiveTier, billing.effectiveCountry) : t("learner.common.notAvailable");
  const readinessScore = snapshot?.readiness?.score;

  return (
    <LearnerAccountShell className="space-y-8 py-2" data-testid="learner-account-center-overview">
      <LearnerAccountPageHero
        eyebrow={t("learner.account.shell.kicker")}
        title={t("learner.account.center.title")}
        description={t("learner.account.center.intro")}
        actions={
          <Link
            href="/app"
            className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-muted/60"
          >
            {t("learner.account.shell.backToDashboard")}
          </Link>
        }
      />

      <section className="nn-card nn-student-card-lift p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.account.center.sectionProfile")}</h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.name")}</dt>
            <dd className="mt-1 font-medium text-foreground">{userRow?.name?.trim() || t("learner.common.notAvailable")}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.email")}</dt>
            <dd className="mt-1 font-medium text-foreground">{userRow?.email ?? t("learner.common.notAvailable")}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.studyProfile.pathway")}</dt>
            <dd className="mt-1 font-medium text-foreground">{pathwayLabel ?? t("learner.account.center.pathwayUnset")}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.account.center.sectionPlan")}</h2>
        {billing ? (
          <>
            <LearnerBillingStatusBanner
              surface={billing.surface}
              pastDueGraceEndsAt={billing.pastDueGraceEndsAt}
              billingPeriodEndDisplay={billing.billingPeriodEndDisplay}
              localeTag={localeTag}
              t={t}
            />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{t("learner.account.center.planLabel")}</span> {planLabel}
            </p>
            {billing.entitlement !== "error" && !billing.entitlement.hasAccess ? (
              <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--card))] p-4">
                <p className="text-sm text-foreground">{t("learner.account.center.upgradeHint")}</p>
                <Link
                  href="/pricing"
                  className="mt-3 inline-flex rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground"
                >
                  {t("learner.account.center.upgradeCta")}
                </Link>
              </div>
            ) : null}
          </>
        ) : (
          <p className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">{t("learner.account.center.billingUnavailable")}</p>
        )}
      </section>

      {entitlement !== "error" && entitlement.hasAccess && snapshot ? (
        <section className="nn-card nn-student-card-lift border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_40%,var(--card))] p-5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--semantic-info-contrast)]">
            {t("learner.account.center.sectionProgress")}
          </h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.account.center.streak")}</dt>
              <dd className="mt-1 text-lg font-bold text-foreground">{snapshot.studyStreakDays}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.account.center.lessons")}</dt>
              <dd className="mt-1 text-lg font-bold text-foreground">
                {snapshot.overallLessons.pct}%
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  ({snapshot.overallLessons.completed}/{snapshot.overallLessons.total})
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.account.center.readiness")}</dt>
              <dd className="mt-1 text-lg font-bold text-foreground">
                {readinessScore != null && Number.isFinite(readinessScore)
                  ? t("learner.account.center.readinessScore", { score: Math.round(readinessScore) })
                  : t("learner.account.center.readinessPending")}
              </dd>
            </div>
          </dl>
        </section>
      ) : entitlement !== "error" && !entitlement.hasAccess ? (
        <section className="rounded-xl border border-border/70 bg-muted/15 p-5">
          <p className="text-sm text-muted-foreground">{t("learner.account.center.progressLocked")}</p>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.account.center.sectionShortcuts")}</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex h-full flex-col rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-sm transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:shadow-md"
              >
                <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">{t(item.labelKey)}</span>
                <span className="mt-1 text-xs text-muted-foreground">{t(item.descriptionKey)}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          <Link href="/app/account/overview" className="font-medium text-primary underline">
            {t("learner.account.center.moreAnalytics")}
          </Link>
        </p>
      </section>
    </LearnerAccountShell>
  );
}
