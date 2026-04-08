import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { LearnerPersonalInfoForm } from "@/components/student/learner-personal-info-form";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadPersonalProfilePayload } from "@/lib/learner/load-personal-profile";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLearnerMarketingBundle();
  return {
    title: t("learner.account.personal.metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AccountPersonalPage() {
  const { t, locale } = await getLearnerMarketingBundle();
  const localeTag = locale.replace(/_/g, "-");
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.personal"));

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.profile.signedOutHint")}</p>
      </main>
    );
  }

  const profile = await loadPersonalProfilePayload(userId);
  if (!profile) {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.error.app.description")}</p>
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
    </main>
  );
}
