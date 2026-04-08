import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LockedStudyNextPreview } from "@/components/student/locked-study-next-preview";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadAccountHubBundle } from "@/lib/learner/load-account-hub-snapshot";
import { remediationTopicDrillHref, remediationWeakModeTestHref } from "@/lib/learner/remediation-links";
import { readinessBandLabel } from "@/lib/learner/readiness-score";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLearnerMarketingBundle();
  return {
    title: t("learner.account.readiness.metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AccountReadinessPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.readiness"));

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.profile.signedOutHint")}</p>
      </main>
    );
  }

  const bundle = await loadAccountHubBundle(userId);
  if (!bundle) {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.account.loadFailed")}</p>
      </main>
    );
  }

  const { entitlement, premiumSnapshot, topicPerf } = bundle;
  const readiness = premiumSnapshot?.readiness;
  const weakTop3 = topicPerf?.weakTopics.slice(0, 3) ?? [];
  const primaryWeakTopic =
    weakTop3[0]?.normalizedTopic?.trim() ||
    weakTop3[0]?.topic?.trim() ||
    premiumSnapshot?.recommendedQuizTopic?.trim() ||
    "";
  const practiceNextHref = primaryWeakTopic ? remediationTopicDrillHref(primaryWeakTopic) : "/app/questions";
  const lessonsNextHref = premiumSnapshot?.continueLesson?.href?.trim() || "/app/lessons";
  const catNextHref = primaryWeakTopic ? remediationWeakModeTestHref(primaryWeakTopic) : "/app/practice-tests";

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
          <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.readiness.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("learner.profile.performanceGate.body")}</p>
        </div>
        <LockedStudyNextPreview className="nn-card space-y-2 p-6" />
        <SubscriptionPaywall context="dashboard" />
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.readiness.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.readiness.intro")}</p>
      </div>

      {readiness ? (
        <section className="nn-card p-6">
          <div className="rounded-xl border border-role-cta/20 bg-role-cta-soft p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.profile.readiness.label")}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">
              {readiness.score != null ? `${readiness.score}/100` : t("learner.common.notAvailable")}
              <span className="ml-2 text-base font-semibold text-muted-foreground">
                {readinessBandLabel(readiness.band)}
              </span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{readiness.summary}</p>
            {readiness.calibratedPreview ? (
              <p className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-300">
                {t("learner.profile.readiness.calibrationNote")}
              </p>
            ) : null}
            {readiness.holdingBack.length > 0 ? (
              <p className="mt-3 text-sm text-foreground">
                <span className="font-medium">{t("learner.profile.readiness.holdingBack")} </span>
                {readiness.holdingBack.join(" · ")}
              </p>
            ) : null}
            {readiness.factors.length > 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{t("learner.profile.readiness.helping")} </span>
                {readiness.factors
                  .filter((f) => f.points > 0)
                  .slice(0, 6)
                  .map((f) => f.label)
                  .join(" · ") || t("learner.profile.readiness.helpingFallback")}
              </p>
            ) : null}
            <div className="mt-5 border-t border-role-cta/25 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.profile.readiness.nextStepsTitle")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("learner.profile.readiness.nextStepsLead")}</p>
              {weakTop3.length > 0 ? (
                <div className="mt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("learner.profile.readiness.weakTopicsTitle")}
                  </p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-foreground">
                    {weakTop3.map((w) => (
                      <li key={w.normalizedTopic ?? w.topic}>
                        {t("learner.profile.readiness.weakTopicItem", { topic: w.topic, rate: w.missRate })}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={practiceNextHref}
                  className="inline-flex rounded-full border border-role-cta/30 bg-role-cta-soft px-4 py-2 text-sm font-semibold text-role-cta-on-soft hover:bg-[color-mix(in_srgb,var(--role-cta)_14%,var(--bg-card))]"
                >
                  {t("learner.profile.readiness.ctaPractice")}
                </Link>
                <Link
                  href={lessonsNextHref}
                  className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/80"
                >
                  {t("learner.profile.readiness.ctaLessons")}
                </Link>
                <Link
                  href={catNextHref}
                  className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/80"
                >
                  {t("learner.profile.readiness.ctaCat")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="nn-card p-6">
          <p className="text-sm text-muted-foreground">{t("learner.account.readiness.empty")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/app/questions" className="inline-flex rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground">
              {t("learner.profile.quickLinks.questionBank")}
            </Link>
            <Link href="/app/exams" className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/80">
              {t("learner.profile.quickLinks.catPractice")}
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
