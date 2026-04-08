import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PremiumLearnerHub } from "@/components/student/premium-learner-hub";
import { LockedStudyNextPreview } from "@/components/student/locked-study-next-preview";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadAccountHubBundle } from "@/lib/learner/load-account-hub-snapshot";
import { loadRecentLearnerNotesSummary } from "@/lib/learner/load-recent-learner-notes-summary";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLearnerMarketingBundle();
  return {
    title: t("learner.account.progress.metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AccountProgressPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.progress"));

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

  if (entitlement === "error") {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.entitlement.verifyFailed")}</p>
      </main>
    );
  }

  if (!entitlement.hasAccess || !premiumSnapshot) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.progress.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("learner.profile.performanceGate.body")}</p>
        </div>
        <LockedStudyNextPreview className="nn-card space-y-2 p-6" />
        <SubscriptionPaywall context="dashboard" />
      </main>
    );
  }

  const notes = await loadRecentLearnerNotesSummary(userId);
  const weakTopicTitles = topicPerf?.weakTopics.map((w) => w.topic) ?? [];

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.progress.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.progress.intro")}</p>
      </div>
      <PremiumLearnerHub snapshot={premiumSnapshot} weakTopicTitles={weakTopicTitles} recentNotes={notes} />
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/app/account/overview" className="font-semibold text-primary underline underline-offset-2">
          {t("learner.account.progress.backToOverview")}
        </Link>
      </p>
    </main>
  );
}
