import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountCrossLinks } from "@/components/student/learner-account-cross-links";
import { LearnerSecurityHub } from "@/components/student/learner-security-hub";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { JWT_SESSION_MAX_AGE_SEC } from "@/lib/auth/auth-session-constants";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadAccountHubBundle } from "@/lib/learner/load-account-hub-snapshot";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.account.security.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/security", routeGroup: "student.learner.account_security" },
  );
}

export default async function AccountSecurityPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.security"));

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.security.title")}
          body={t("learner.profile.signedOutHint")}
          hint={t("learner.dashboard.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app/account/security"), variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  const bundle = await loadAccountHubBundle(userId);
  const hasPassword = Boolean(bundle?.userRow?.passwordHash);
  const sessionMaxDays = Math.max(1, Math.round(JWT_SESSION_MAX_AGE_SEC / 86400));

  return (
    <div className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.security.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.security.intro")}</p>
      </div>
      <LearnerSecurityHub hasPassword={hasPassword} sessionMaxDays={sessionMaxDays} />

      <LearnerAccountCrossLinks variant="settings" t={t} />
    </div>
  );
}
