import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountCrossLinks } from "@/components/student/learner-account-cross-links";
import { LearnerReadinessPremium } from "@/components/student/learner-readiness-premium";
import { LockedStudyNextPreview } from "@/components/student/locked-study-next-preview";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadReadinessPagePayload } from "@/lib/learner/load-readiness-page-payload";
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
  const { t, locale } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.readiness"));
  const localeTag = locale.replace(/_/g, "-");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.profile.signedOutHint")}</p>
      </main>
    );
  }

  const entitlement = await resolveEntitlementForPage(userId);

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

  const payload = await loadReadinessPagePayload(userId, entitlement);

  if (!payload) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.readiness.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("learner.account.loadFailed")}</p>
        </div>
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

      <div className="rounded-xl border border-primary/20 bg-primary/[0.04] px-4 py-3 text-sm">
        <p className="font-semibold text-[var(--theme-heading-text)]">{t("learner.readinessPage.integratedCallout.title")}</p>
        <p className="mt-1 text-muted-foreground">{t("learner.readinessPage.integratedCallout.body")}</p>
      </div>

      <LearnerReadinessPremium payload={payload} t={t} localeTag={localeTag} />

      <LearnerAccountCrossLinks variant="readiness" t={t} />
    </main>
  );
}
