import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountCrossLinks } from "@/components/student/learner-account-cross-links";
import { LearnerStudySettingsHub } from "@/components/student/learner-study-settings-hub";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loadStudySettings } from "@/lib/learner/load-study-settings";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.account.studyPreferences.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/study-preferences", routeGroup: "student.learner.account_study_preferences" },
  );
}

export default async function AccountStudyPreferencesPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await getProtectedRouteSession("(student).app.(learner).account.study-preferences");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.settingsHub"));

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.studyPreferences.title")}
          body={t("learner.profile.signedOutHint")}
          hint={t("learner.dashboard.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app/account/study-preferences"), variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
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
  const studySettings = await loadStudySettings(userId);

  return (
    <div className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.studyPreferences.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.studyPreferences.intro")}</p>
      </div>

      {verifyFailed ? (
        <PremiumEmptyState
          headline={t("learner.account.studyPreferences.title")}
          body={t("learner.entitlement.verifyFailed")}
          tone="default"
          primaryCta={{ label: t("paywall.cta.openStudyHub"), href: "/app", variant: "primary" }}
          secondaryCtas={[{ label: t("learner.account.nav.overview"), href: "/app/account/overview", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
          density="compact"
        />
      ) : null}

      <LearnerStudySettingsHub
        userId={userId}
        defaultPathwayLabel={defaultPathwayLabel}
        showExamPlanForm={showExamPlan}
        initialStudySettings={studySettings}
        t={t}
      />

      {!showExamPlan && !verifyFailed ? (
        <div className="nn-card p-6">
          <PremiumEmptyState
            headline={t("learner.account.studyPreferences.title")}
            body={t("learner.profile.performanceGate.body")}
            hint={emptyStateCopy.entitlementLocked.body}
            tone="locked"
            primaryCta={{ label: t("cta.continuePlan"), href: "/pricing", variant: "primary" }}
            secondaryCtas={[{ label: t("paywall.cta.openStudyHub"), href: "/app", variant: "secondary" }]}
            visualLayout="stack"
            ctaLayout="stack"
            density="compact"
            className="mb-4"
          />
          <SubscriptionPaywall context="dashboard" />
        </div>
      ) : null}

      <LearnerAccountCrossLinks variant="settings" t={t} />
    </div>
  );
}
