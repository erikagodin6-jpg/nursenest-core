import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountCrossLinks } from "@/components/student/learner-account-cross-links";
import { LearnerSecurityHub } from "@/components/student/learner-security-hub";
import { JWT_SESSION_MAX_AGE_SEC } from "@/lib/auth/auth-session-constants";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadAccountHubBundle } from "@/lib/learner/load-account-hub-snapshot";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLearnerMarketingBundle();
  return {
    title: t("learner.account.security.metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AccountSecurityPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.security"));

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.profile.signedOutHint")}</p>
      </main>
    );
  }

  const bundle = await loadAccountHubBundle(userId);
  const hasPassword = Boolean(bundle?.userRow?.passwordHash);
  const sessionMaxDays = Math.max(1, Math.round(JWT_SESSION_MAX_AGE_SEC / 86400));

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.security.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.security.intro")}</p>
      </div>
      <LearnerSecurityHub hasPassword={hasPassword} sessionMaxDays={sessionMaxDays} />

      <LearnerAccountCrossLinks variant="settings" t={t} />
    </main>
  );
}
