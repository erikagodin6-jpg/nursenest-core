import Link from "next/link";
import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { LearnerAccountPageHero, LearnerAccountShell } from "@/components/learner-account-ui";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadLearnerProfileActivity } from "@/lib/learner/load-learner-profile-activity";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { learnerAccountLeafCrumbs as appAccountBreadcrumbs } from "@/lib/breadcrumbs/learner-navigation";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.account.activity.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/activity", routeGroup: "student.learner.account_activity" },
  );
}

export default async function AccountActivityPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await getProtectedRouteSession("(student).app.(learner).account.activity");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.activity"));

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <LearnerBreadcrumbTrail kind="account-hub" pathname="/app/account" />
        <PremiumEmptyState
          headline={t("learner.account.activity.title")}
          body={t("learner.profile.signedOutHint")}
          hint={t("learner.dashboard.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app/account/activity"), variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  const entitlement = await resolveEntitlementForPage(userId);
  const activity =
    entitlement !== "error" && entitlement.hasAccess
      ? await loadLearnerProfileActivity(userId, { mocks: 5, practiceTests: 5, lessons: 8 })
      : { mocks: [], practiceTests: [], lessons: [] };

  const hasAny =
    activity.mocks.length > 0 || activity.practiceTests.length > 0 || activity.lessons.length > 0;

  return (
    <LearnerAccountShell className="space-y-8 py-2" data-testid="learner-account-activity">
      <LearnerBreadcrumbTrail kind="account-hub" pathname="/app/account" />
      <LearnerAccountPageHero
        eyebrow={t("learner.account.shell.kicker")}
        title={t("learner.account.activity.title")}
        description={t("learner.account.activity.intro")}
      />

      {entitlement === "error" || !entitlement.hasAccess ? (
        <div className="rounded-xl border border-border/70 bg-muted/15 p-5 text-sm text-muted-foreground">
          {t("learner.account.activity.lockedHint")}
        </div>
      ) : null}

      {!hasAny && entitlement !== "error" && entitlement.hasAccess ? (
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_35%,var(--card))] p-6 text-center">
          <p className="text-sm text-foreground">{t("learner.account.activity.empty")}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/app"
              className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/70"
            >
              {t("learner.account.activity.ctaDashboard")}
            </Link>
            <Link
              href="/app/lessons"
              className="inline-flex rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground"
            >
              {t("learner.account.activity.ctaLessons")}
            </Link>
          </div>
        </div>
      ) : null}

      {hasAny ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="nn-card p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.account.activity.sectionLessons")}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {activity.lessons.map((l) => (
                <li key={l.lessonId}>
                  <Link href={l.href} className="font-medium text-primary hover:underline">
                    {l.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">{l.completed ? t("learner.account.activity.lessonDone") : t("learner.account.activity.lessonInProgress")}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className="nn-card p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.account.activity.sectionMocks")}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {activity.mocks.map((m) => (
                <li key={m.id}>
                  <Link href={m.href} className="font-medium text-primary hover:underline">
                    {m.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {t("learner.account.activity.mockScore", { pct: Math.round(m.pct) })}
                  </p>
                </li>
              ))}
            </ul>
          </section>
          <section className="nn-card p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.account.activity.sectionPractice")}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {activity.practiceTests.map((p) => (
                <li key={p.id}>
                  <Link href={p.href} className="font-medium text-primary hover:underline">
                    {p.title?.trim() || t("learner.account.activity.practiceSession")}
                  </Link>
                  {p.accuracyPct != null ? (
                    <p className="text-xs text-muted-foreground">
                      {t("learner.account.activity.practiceAccuracy", { pct: Math.round(p.accuracyPct) })}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      {entitlement !== "error" && entitlement.hasAccess ? (
        <div className="flex flex-wrap gap-3">
          <Link
            href="/app/account/study-history"
            className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/70"
          >
            {t("learner.account.activity.ctaHistory")}
          </Link>
          <Link href="/app/account/cat-history" className="text-sm font-semibold text-primary underline">
            {t("learner.account.activity.ctaCatHistory")}
          </Link>
        </div>
      ) : null}
    </LearnerAccountShell>
  );
}
