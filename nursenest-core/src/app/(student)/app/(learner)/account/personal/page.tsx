import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadAccountHubBundle } from "@/lib/learner/load-account-hub-snapshot";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

function tierLabel(s: string): string {
  return s.replace(/_/g, " ");
}

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLearnerMarketingBundle();
  return {
    title: t("learner.account.personal.metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AccountPersonalPage() {
  const { t } = await getLearnerMarketingBundle();
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

  const bundle = await loadAccountHubBundle(userId);
  const userRow = bundle?.userRow;

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.personal.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.personal.intro")}</p>
      </div>

      <section className="nn-card p-6">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.email")}</dt>
            <dd className="mt-1 font-medium text-foreground break-all">{userRow?.email ?? t("learner.common.notAvailable")}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.name")}</dt>
            <dd className="mt-1 font-medium text-foreground">{userRow?.name ?? t("learner.common.notAvailable")}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.account.personal.tierCountry")}</dt>
            <dd className="mt-1 font-medium text-foreground">
              {userRow ? `${tierLabel(userRow.tier)} · ${userRow.country}` : t("learner.common.notAvailable")}
            </dd>
          </div>
        </dl>
        <p className="mt-6 border-t border-border/60 pt-6 text-sm text-muted-foreground">{t("learner.account.personal.supportHint")}</p>
        <Link href="/contact" className="mt-3 inline-flex text-sm font-semibold text-primary underline underline-offset-2">
          {t("learner.account.personal.contactLink")}
        </Link>
      </section>

      <section className="nn-card p-6">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{t("learner.account.personal.securityHeading")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("learner.account.personal.securityBody")}</p>
        <Link
          href="/app/account/security"
          className="mt-4 inline-flex rounded-full border border-role-cta/30 bg-role-cta-soft px-4 py-2 text-sm font-semibold text-role-cta-on-soft"
        >
          {t("learner.account.nav.security")}
        </Link>
      </section>
    </main>
  );
}
