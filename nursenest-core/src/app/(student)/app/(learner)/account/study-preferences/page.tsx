import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { LearnerAccountPageHero, LearnerAccountShell } from "@/components/learner-account-ui";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { learnerAccountLeafCrumbs as appAccountBreadcrumbs } from "@/lib/breadcrumbs/learner-navigation";
import { LearnerAccountCrossLinks } from "@/components/student/learner-account-cross-links";
import { LearnerStudySettingsHub } from "@/components/student/learner-study-settings-hub";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loadStudySettings } from "@/lib/learner/load-study-settings";
import { parseMeasurementPreference } from "@/lib/measurements/measurement-preference";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
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
        <LearnerBreadcrumbTrail kind="account-hub" pathname="/app/account" />
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
  let emailEngagementOptOut = false;
  let measurementPreference = null;
  try {
    const u = await prisma.user.findUnique({
      where: { id: userId },
      select: { learnerPath: true, emailEngagementOptOut: true, measurementPreference: true },
    });
    emailEngagementOptOut = Boolean(u?.emailEngagementOptOut);
    measurementPreference = parseMeasurementPreference(u?.measurementPreference ?? null);
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
    <LearnerAccountShell className="py-2">
      <LearnerBreadcrumbTrail kind="account-hub" pathname="/app/account" />
      <LearnerAccountPageHero title={t("learner.account.studyPreferences.title")} description={t("learner.account.studyPreferences.intro")} />

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
        initialEmailEngagementOptOut={emailEngagementOptOut}
        initialMeasurementPreference={measurementPreference}
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
    </LearnerAccountShell>
  );
}
