import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountEmptyState } from "@/components/student/learner-account-empty-state";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadPremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.account.questionBankPerf.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/question-bank-performance", routeGroup: "student.learner.account_question_bank_performance" },
  );
}

export default async function AccountQuestionBankPerformancePage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.questionBankPerf"));
  const entitlement = await resolveEntitlementForPage(userId);

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.profile.signedOutHint")}</p>
      </main>
    );
  }

  if (entitlement === "error") {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.entitlement.verifyFailed")}</p>
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.questionBankPerf.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("learner.account.questionBankPerf.lockedBody")}</p>
        </div>
        <SubscriptionPaywall context="questions" />
      </main>
    );
  }

  let premium = null;
  let topicPerf = null;
  try {
    premium = await loadPremiumDashboardSnapshot(userId, entitlement);
  } catch {
    premium = null;
  }
  try {
    topicPerf = await loadUnifiedTopicPerformance(userId, entitlement, 14);
  } catch {
    topicPerf = null;
  }

  const practice = premium?.practice;
  const thinData = !practice || practice.gradedTotal === 0;

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.questionBankPerf.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.questionBankPerf.intro")}</p>
      </div>

      {thinData ? (
        <LearnerAccountEmptyState
          title={t("learner.account.questionBankPerf.emptyTitle")}
          body={t("learner.account.questionBankPerf.emptyBody")}
          hint={emptyStateCopy.noProgressYet.body}
          ctaHref="/app/questions"
          ctaLabel={t("learner.account.questionBankPerf.emptyCta")}
          secondaryHref="/app/account/focus-areas"
          secondaryLabel={t("learner.account.questionBankPerf.emptySecondary")}
        />
      ) : null}

      <section className="nn-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">{t("learner.account.questionBankPerf.summaryHeading")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t("learner.profile.snapshot.scoredAccuracy")}
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-primary">
              {practice && practice.gradedTotal > 0 ? `${practice.accuracyPct ?? 0}%` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {practice && practice.gradedTotal > 0
                ? t("learner.profile.snapshot.scoredDetail", {
                    graded: practice.gradedTotal,
                    sessions: practice.sessionCount,
                  })
                : t("learner.profile.snapshot.scoredEmpty")}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t("learner.account.questionBankPerf.sessionsLabel")}
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-primary">{practice?.sessionCount ?? 0}</p>
            <p className="text-xs text-muted-foreground">{t("learner.account.questionBankPerf.sessionsHint")}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t("learner.account.questionBankPerf.topicsTracked")}
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-primary">
              {topicPerf ? topicPerf.weakTopics.length + topicPerf.strongTopics.length : 0}
            </p>
            <p className="text-xs text-muted-foreground">{t("learner.account.questionBankPerf.topicsTrackedHint")}</p>
          </div>
        </div>
      </section>

      {topicPerf && topicPerf.trends.length > 0 ? (
        <section className="nn-card p-6">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("learner.account.questionBankPerf.trendsHeading")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("learner.account.questionBankPerf.trendsSub")}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {topicPerf.trends.slice(0, 6).map((tr) => (
              <li key={tr.topic} className="flex flex-wrap justify-between gap-2 border-b border-border/40 pb-2 last:border-0">
                <span className="font-medium">{tr.topic}</span>
                <span className="tabular-nums text-muted-foreground">{tr.summary}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Link
          href="/app/questions"
          className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          {t("learner.profile.quickLinks.questionBank")}
        </Link>
        <Link
          href="/app/account/report-card"
          className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/80"
        >
          {t("learner.account.nav.reportCard")}
        </Link>
      </div>
    </main>
  );
}
