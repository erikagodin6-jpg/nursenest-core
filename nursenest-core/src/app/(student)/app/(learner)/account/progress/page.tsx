import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountCrossLinks } from "@/components/student/learner-account-cross-links";
import { LearnerSilentSectionDegradedFallback } from "@/components/student/learner-silent-section-degraded-fallback";
import { LearnerProgressPageContent } from "@/components/student/learner-progress-page-content";
import { LockedStudyNextPreview } from "@/components/student/locked-study-next-preview";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadProgressPagePayload } from "@/lib/learner/load-progress-page-payload";
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
        title: t("learner.account.progress.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/progress", routeGroup: "student.learner.account_progress" },
  );
}

export default async function AccountProgressPage() {
  const { t, locale } = await getLearnerMarketingBundle();
  const session = await getProtectedRouteSession("(student).app.(learner).account.progress");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.progress"));
  const localeTag = locale.replace(/_/g, "-");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.progress.title")}
          body={t("learner.profile.signedOutHint")}
          hint={t("learner.dashboard.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app/account/progress"), variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.progress.title")}
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
          headline={t("learner.account.progress.title")}
          body={t("learner.profile.performanceGate.body")}
          hint={emptyStateCopy.entitlementLocked.body}
          tone="locked"
          primaryCta={{ label: t("cta.continuePlan"), href: "/pricing", variant: "primary" }}
          secondaryCtas={[{ label: t("paywall.cta.openStudyHub"), href: "/app", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
        <LockedStudyNextPreview className="nn-card space-y-2 p-6" />
        <SubscriptionPaywall context="dashboard" />
      </div>
    );
  }

  const payload = await loadProgressPagePayload(userId, entitlement);
  if (!payload || payload.degraded?.active) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.progress.title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.progress.intro")}</p>
        </div>
        <LearnerSilentSectionDegradedFallback surfaceName="progress-page" />
        <LearnerAccountCrossLinks variant="progress" t={t} continueLesson={payload?.continueLesson ?? null} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.progress.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.progress.intro")}</p>
      </div>
      <LearnerProgressPageContent data={payload} t={t} localeTag={localeTag} />

      <LearnerAccountCrossLinks variant="progress" t={t} continueLesson={payload.continueLesson} />
    </div>
  );
}
