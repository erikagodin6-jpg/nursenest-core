import Link from "next/link";
import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { remediationTopicDrillHref } from "@/lib/learner/remediation-links";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
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
        title: t("learner.account.reviewQueue.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/review-queue", routeGroup: "student.learner.account_review_queue" },
  );
}

export default async function AccountReviewQueuePage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await getProtectedRouteSession("(student).app.(learner).account.review-queue");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.reviewQueue"));
  const entitlement = await resolveEntitlementForPage(userId);

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.reviewQueue.title")}
          body={t("learner.profile.signedOutHint")}
          hint={t("learner.dashboard.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app/account/review-queue"), variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  if (entitlement === "error") {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.reviewQueue.title")}
          body={t("learner.entitlement.verifyFailed")}
          tone="default"
          primaryCta={{ label: t("paywall.cta.openStudyHub"), href: "/app", variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.reviewQueue.title")}
          body={t("learner.account.reviewQueue.lockedBody")}
          hint={emptyStateCopy.entitlementLocked.body}
          tone="locked"
          primaryCta={{ label: t("cta.continuePlan"), href: "/pricing", variant: "primary" }}
          secondaryCtas={[{ label: t("paywall.cta.openStudyHub"), href: "/app", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
        <SubscriptionPaywall context="questions" />
      </div>
    );
  }

  const topicPerf = await loadUnifiedTopicPerformance(userId, entitlement, 12);
  const reviewTopics = topicPerf.weakTopics.slice(0, 8);

  return (
    <div className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.reviewQueue.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.reviewQueue.intro")}</p>
      </div>

      <section className="nn-card nn-learner-review-queue-intro p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--semantic-chart-4)]">
          {t("learner.account.reviewQueue.howHeading")}
        </h2>
        <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("learner.account.reviewQueue.howBody")}</p>
      </section>

      <section className="nn-card p-6">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("learner.account.reviewQueue.topicQueueHeading")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("learner.account.reviewQueue.topicQueueSub")}</p>
        {reviewTopics.length === 0 ? (
          <div className="mt-6">
            <PremiumEmptyState
              data-nn-empty="account-review-queue"
              tone="early"
              density="compact"
              visualLayout="stack"
              headline={t("learner.account.reviewQueue.emptyTitle")}
              body={t("learner.account.reviewQueue.emptyQueue")}
              hint={emptyStateCopy.noWeakAreasYet.body}
              primaryCta={{ label: t("learner.profile.quickLinks.questionBank"), href: "/app/questions", variant: "primary" }}
              secondaryCtas={[{ label: t("learner.account.nav.focusAreas"), href: "/app/account/focus-areas", variant: "secondary" }]}
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {reviewTopics.map((w) => (
              <li
                key={w.topic}
                className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-foreground">{w.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("learner.account.reviewQueue.topicMeta", { attempted: w.attempted, missRate: w.missRate })}
                  </p>
                </div>
                <Link
                  href={remediationTopicDrillHref(w.topic)}
                  className="inline-flex shrink-0 rounded-full border border-role-cta/30 bg-role-cta-soft px-4 py-2 text-sm font-semibold text-role-cta-on-soft"
                >
                  {t("learner.account.reviewQueue.drillTopic")}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/app/questions" className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          {t("learner.profile.quickLinks.questionBank")}
        </Link>
        <Link href="/app/practice-tests?focus=weak" className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/80">
          {t("learner.account.reviewQueue.weakTests")}
        </Link>
        <Link href="/app/account/focus-areas" className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/80">
          {t("learner.account.nav.focusAreas")}
        </Link>
      </div>
    </div>
  );
}
