import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { PremiumLearnerHub } from "@/components/student/premium-learner-hub";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LockedStudyNextPreview } from "@/components/student/locked-study-next-preview";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadPremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import { loadRecentLearnerNotesSummary } from "@/lib/learner/load-recent-learner-notes-summary";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLearnerMarketingBundle();
  return {
    title: t("learner.dashboard.metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function LearnerDashboardPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const crumbs = appShellBreadcrumbs("dashboard");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <h1 className="text-3xl font-bold text-[var(--theme-heading-text)]">{t("learner.dashboard.signedOutTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("learner.dashboard.signedOutHint")}</p>
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
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.dashboard.kicker")}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">{t("learner.dashboard.title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.dashboard.subtitle.locked")}</p>
        </div>
        <LockedStudyNextPreview className="nn-card space-y-2 p-6" />
        <SubscriptionPaywall context="dashboard" />
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/app/account/overview" className="font-semibold text-primary underline underline-offset-2">
            {t("learner.dashboard.accountHubLink")}
          </Link>
        </p>
      </main>
    );
  }

  let snapshot = null;
  let weakTopicTitles: string[] = [];
  try {
    const [snap, topicPerf, notes] = await Promise.all([
      loadPremiumDashboardSnapshot(userId, entitlement),
      loadUnifiedTopicPerformance(userId, entitlement, 8),
      loadRecentLearnerNotesSummary(userId),
    ]);
    snapshot = snap;
    weakTopicTitles = topicPerf?.weakTopics.map((w) => w.topic) ?? [];
    if (snapshot) {
      return (
        <main className="space-y-6">
          <BreadcrumbTrail items={crumbs} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.dashboard.kicker")}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">{t("learner.dashboard.title")}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.dashboard.subtitle.subscriber")}</p>
          </div>
          <PremiumLearnerHub snapshot={snapshot} weakTopicTitles={weakTopicTitles} recentNotes={notes} />
          <section className="nn-card flex flex-col gap-3 p-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">{t("learner.dashboard.accountTeaser")}</p>
            <Link
              href="/app/account/overview"
              className="inline-flex w-full shrink-0 justify-center rounded-full border border-role-cta/30 bg-role-cta-soft px-4 py-2.5 text-sm font-semibold text-role-cta-on-soft sm:w-auto"
            >
              {t("learner.dashboard.openAccountHub")}
            </Link>
          </section>
        </main>
      );
    }
  } catch {
    snapshot = null;
  }

  return (
    <main className="space-y-4">
      <BreadcrumbTrail items={crumbs} />
      <p className="text-sm text-muted-foreground">{t("learner.dashboard.loadFailed")}</p>
      <Link href="/app/account/overview" className="text-sm font-semibold text-primary underline">
        {t("learner.dashboard.openAccountHub")}
      </Link>
    </main>
  );
}
