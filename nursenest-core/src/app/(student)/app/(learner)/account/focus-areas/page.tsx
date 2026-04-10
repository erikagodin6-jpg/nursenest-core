import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountEmptyState } from "@/components/student/learner-account-empty-state";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { remediationTopicDrillHref, remediationWeakModeTestHref } from "@/lib/learner/remediation-links";
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
        title: t("learner.account.focusAreas.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/focus-areas", routeGroup: "student.learner.account_focus_areas" },
  );
}

export default async function AccountFocusAreasPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.focusAreas"));
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
          <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.focusAreas.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("learner.account.focusAreas.lockedBody")}</p>
        </div>
        <SubscriptionPaywall context="dashboard" />
      </main>
    );
  }

  const topicPerf = await loadUnifiedTopicPerformance(userId, entitlement, 18);

  const weak = topicPerf.weakTopics;
  const strong = topicPerf.strongTopics;
  const empty = weak.length === 0 && strong.length === 0;

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.focusAreas.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.focusAreas.intro")}</p>
      </div>

      {empty ? (
        <LearnerAccountEmptyState
          title={t("learner.account.focusAreas.emptyTitle")}
          body={t("learner.account.focusAreas.emptyBody")}
          hint={emptyStateCopy.noWeakAreasYet.body}
          ctaHref="/app/questions"
          ctaLabel={t("learner.account.focusAreas.emptyCta")}
          secondaryHref="/app/lessons"
          secondaryLabel={t("learner.account.focusAreas.emptySecondary")}
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="nn-card p-6">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("learner.profile.topics.priorityReview")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("learner.account.focusAreas.weakLead")}</p>
          <ul className="mt-4 space-y-3">
            {weak.slice(0, 12).map((w) => {
              const acc = w.attempted > 0 ? Math.round(100 - w.missRate) : null;
              const missLabel =
                w.missed === 1
                  ? t("learner.profile.topics.missOne", { count: w.missed })
                  : t("learner.profile.topics.missMany", { count: w.missed });
              return (
                <li key={w.topic} className="rounded-xl border border-rose-500/20 bg-rose-500/[0.06] px-4 py-3 text-sm">
                  <span className="font-semibold text-foreground">{w.topic}</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {acc != null ? t("learner.profile.topics.accuracyLine", { pct: acc }) : t("learner.common.notAvailable")} · {missLabel}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <Link href={remediationTopicDrillHref(w.topic)} className="text-xs font-semibold text-primary underline">
                      {t("learner.profile.topics.remediateQbank")}
                    </Link>
                    <Link href={remediationWeakModeTestHref(w.topic)} className="text-xs font-semibold text-primary underline">
                      {t("learner.profile.topics.weakMode")}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
          {weak.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">{t("learner.profile.topics.emptyWeak")}</p>
          ) : null}
        </section>

        <section className="nn-card p-6">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("learner.profile.topics.strongHeading")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("learner.account.focusAreas.strongLead")}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {strong.slice(0, 16).map((s) => (
              <li
                key={s.topic}
                className="rounded-full border border-[color-mix(in_srgb,var(--role-success)_22%,transparent)] bg-role-success-soft px-3 py-1.5 text-xs font-medium text-role-success-text"
              >
                {s.topic}{" "}
                <span className="tabular-nums opacity-80">({100 - s.missRate}%)</span>
              </li>
            ))}
          </ul>
          {strong.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">{t("learner.profile.topics.emptyStrong")}</p>
          ) : null}

          {topicPerf.trends.length > 0 ? (
            <div className="mt-8 border-t border-border/60 pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">{t("learner.account.focusAreas.trendsHeading")}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {topicPerf.trends.slice(0, 8).map((tr) => (
                  <li key={tr.topic} className="text-muted-foreground">
                    <span className="font-medium text-foreground">{tr.topic}</span> — {tr.summary}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/app/account/readiness" className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          {t("learner.account.nav.readiness")}
        </Link>
        <Link href="/app/questions" className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/80">
          {t("learner.profile.quickLinks.questionBank")}
        </Link>
      </div>
    </main>
  );
}
