import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountEmptyState } from "@/components/student/learner-account-empty-state";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadLearnerProfileActivity } from "@/lib/learner/load-learner-profile-activity";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.account.studyHistory.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/study-history", routeGroup: "student.learner.account_study_history" },
  );
}

export default async function AccountStudyHistoryPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.studyHistory"));
  const entitlement = await resolveEntitlementForPage(userId);

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.studyHistory.title")}
          body={t("learner.profile.signedOutHint")}
          hint={t("learner.dashboard.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app/account/study-history"), variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  if (entitlement === "error") {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.studyHistory.title")}
          body={t("learner.entitlement.verifyFailed")}
          tone="default"
          primaryCta={{ label: t("paywall.cta.openStudyHub"), href: "/app", variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.studyHistory.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("learner.account.studyHistory.lockedBody")}</p>
        </div>
        <SubscriptionPaywall context="dashboard" />
      </main>
    );
  }

  const activity = await loadLearnerProfileActivity(userId, {
    mocks: 20,
    practiceTests: 25,
    lessons: 25,
  });

  const total =
    activity.mocks.length + activity.practiceTests.length + activity.lessons.length;

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.studyHistory.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.studyHistory.intro")}</p>
      </div>

      {total === 0 ? (
        (() => {
          const historyCopy = emptyStateCopy.noHistoryYet({ area: "study history" });
          return (
        <LearnerAccountEmptyState
          title={t("learner.account.studyHistory.emptyTitle")}
          body={t("learner.account.studyHistory.emptyBody")}
          hint={historyCopy.body}
          ctaHref="/app"
          ctaLabel={t("learner.account.studyHistory.emptyCtaDashboard")}
          secondaryHref="/app/lessons"
          secondaryLabel={t("learner.account.studyHistory.emptyCtaLessons")}
        />
          );
        })()
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="nn-card p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("learner.profile.activity.mocks")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {activity.mocks.length === 0 ? (
              <li className="text-muted-foreground">{t("learner.profile.activity.noMocks")}</li>
            ) : (
              activity.mocks.map((m) => (
                <li key={m.id} className="border-b border-border/40 pb-2 last:border-0 last:pb-0">
                  <Link href={m.href} className="font-medium text-primary underline">
                    {m.title}
                  </Link>
                  <span className="text-muted-foreground">
                    {" "}
                    · {m.pct}% ({m.score}/{m.total})
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
        <section className="nn-card p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("learner.profile.activity.practiceTests")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {activity.practiceTests.length === 0 ? (
              <li className="text-muted-foreground">{t("learner.profile.activity.noAdaptive")}</li>
            ) : (
              activity.practiceTests.map((pt) => (
                <li key={pt.id} className="border-b border-border/40 pb-2 last:border-0 last:pb-0">
                  <Link href={pt.href} className="font-medium text-primary underline">
                    {pt.title ?? t("learner.profile.activity.practiceTestFallback")}
                  </Link>
                  <span className="text-muted-foreground">
                    {" "}
                    · {pt.status}
                    {pt.accuracyPct != null ? ` · ${pt.accuracyPct}%` : ""}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
        <section className="nn-card p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("learner.profile.activity.lessons")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {activity.lessons.length === 0 ? (
              <li className="text-muted-foreground">{t("learner.profile.activity.noLessons")}</li>
            ) : (
              activity.lessons.map((l) => (
                <li key={l.lessonId} className="border-b border-border/40 pb-2 last:border-0 last:pb-0">
                  <Link href={l.href} className="font-medium text-primary underline">
                    {l.title}
                  </Link>
                  <span className="text-muted-foreground">
                    {" "}
                    · {l.completed ? t("learner.profile.activity.status.completed") : t("learner.profile.activity.status.inProgress")}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <p className="text-center text-xs text-muted-foreground">{t("learner.account.studyHistory.footerNote")}</p>
    </main>
  );
}
