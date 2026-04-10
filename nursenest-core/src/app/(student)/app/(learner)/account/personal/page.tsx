import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { LearnerAccountCrossLinks } from "@/components/student/learner-account-cross-links";
import { LearnerPersonalInfoForm } from "@/components/student/learner-personal-info-form";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadPersonalProfilePayload } from "@/lib/learner/load-personal-profile";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.account.personal.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/personal", routeGroup: "student.learner.account_personal" },
  );
}

export default async function AccountPersonalPage() {
  const { t, locale } = await getLearnerMarketingBundle();
  const localeTag = locale.replace(/_/g, "-");
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.personal"));

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.personal.title")}
          body={t("learner.profile.signedOutHint")}
          hint={t("learner.dashboard.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app/account/personal"), variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  const profile = await loadPersonalProfilePayload(userId);
  if (!profile) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.personal.title")}
          body={t("learner.error.app.description")}
          tone="default"
          primaryCta={{ label: t("learner.account.nav.overview"), href: "/app/account/overview", variant: "primary" }}
          secondaryCtas={[{ label: t("paywall.cta.openStudyHub"), href: "/app", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.personal.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.personal.intro")}</p>
      </div>

      <LearnerPersonalInfoForm initial={profile} t={t} localeTag={localeTag} />

      <LearnerAccountCrossLinks variant="settings" t={t} />
    </main>
  );
}
