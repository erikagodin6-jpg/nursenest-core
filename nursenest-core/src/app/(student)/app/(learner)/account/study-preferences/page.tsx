import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountCrossLinks } from "@/components/student/learner-account-cross-links";
import { LearnerStudySettingsHub } from "@/components/student/learner-study-settings-hub";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
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
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.settingsHub"));

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.profile.signedOutHint")}</p>
      </main>
    );
  }

  let defaultPathwayLabel: string | null = null;
  try {
    const u = await prisma.user.findUnique({
      where: { id: userId },
      select: { learnerPath: true },
    });
    const lp = u?.learnerPath?.trim();
    if (lp) {
      const p = getExamPathwayById(lp);
      defaultPathwayLabel = p ? p.shortName || p.displayName : lp;
    }
  } catch {
    /* optional */
  }

  const verifyFailed = entitlement === "error";
  const showExamPlan = !verifyFailed && entitlement.hasAccess;

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.studyPreferences.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.studyPreferences.intro")}</p>
      </div>

      {verifyFailed ? (
        <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
          {t("learner.entitlement.verifyFailed")}
        </p>
      ) : null}

      <LearnerStudySettingsHub
        userId={userId}
        defaultPathwayLabel={defaultPathwayLabel}
        showExamPlanForm={showExamPlan}
        t={t}
      />

      {!showExamPlan && !verifyFailed ? (
        <div className="nn-card p-6">
          <SubscriptionPaywall context="dashboard" />
        </div>
      ) : null}

      <LearnerAccountCrossLinks variant="settings" t={t} />
    </main>
  );
}
