import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { ExamPlanSettingsCard } from "@/components/student/exam-plan-settings-card";
import { LockedStudyNextPreview } from "@/components/student/locked-study-next-preview";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLearnerMarketingBundle();
  return {
    title: t("learner.account.studyPreferences.metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AccountStudyPreferencesPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.studyPreferences"));

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

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.studyPreferences.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.studyPreferences.intro")}</p>
      </div>

      {entitlement.hasAccess ? (
        <ExamPlanSettingsCard />
      ) : (
        <>
          <LockedStudyNextPreview className="nn-card space-y-2 p-6" />
          <SubscriptionPaywall context="dashboard" />
        </>
      )}
    </main>
  );
}
