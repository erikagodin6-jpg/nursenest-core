import Link from "next/link";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { LearnerAccountPageHero, LearnerAccountShell } from "@/components/learner-account-ui";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { SUPPORT_EMAIL, SUPPORT_RESPONSE_TIME_COPY, supportMailtoHref } from "@/lib/support/support-policy";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.account.support.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/support", routeGroup: "student.learner.account_support" },
  );
}

export default async function AccountSupportPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await getProtectedRouteSession("(student).app.(learner).account.support");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.support"));

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <LearnerBreadcrumbTrail kind="account-hub" pathname="/app/account" />
        <PremiumEmptyState
          headline={t("learner.account.support.title")}
          body={t("learner.profile.signedOutHint")}
          hint={t("learner.dashboard.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app/account/support"), variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  return (
    <LearnerAccountShell className="space-y-8 py-2" data-testid="learner-account-support">
      <LearnerBreadcrumbTrail kind="account-hub" pathname="/app/account" />
      <LearnerAccountPageHero
        eyebrow={t("learner.account.shell.kicker")}
        title={t("learner.account.support.title")}
        description={t("learner.account.support.intro")}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <section className="nn-card p-5">
          <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("learner.account.support.contactHeading")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{SUPPORT_RESPONSE_TIME_COPY}</p>
          <a
            href={supportMailtoHref()}
            className="mt-4 inline-flex text-sm font-semibold text-primary underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </section>
        <section className="nn-card p-5">
          <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("learner.account.support.billingHelp")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("learner.account.support.billingHelpBody")}</p>
          <Link href="/app/account/billing" className="mt-4 inline-flex text-sm font-semibold text-primary underline">
            {t("learner.account.nav.billing")}
          </Link>
        </section>
        <section className="nn-card p-5 md:col-span-2">
          <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("learner.account.support.accountHelp")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("learner.account.support.accountHelpBody")}</p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <li>
              <Link className="font-medium text-primary underline" href="/app/account/personal">
                {t("learner.account.nav.personal")}
              </Link>
            </li>
            <li>
              <Link className="font-medium text-primary underline" href="/app/account/security">
                {t("learner.account.nav.security")}
              </Link>
            </li>
            <li>
              <Link className="font-medium text-primary underline" href="/contact">
                {t("learner.accountActions.linkContact")}
              </Link>
            </li>
            <li>
              <Link className="font-medium text-primary underline" href="/terms">
                {t("learner.accountActions.linkTerms")}
              </Link>
            </li>
            <li>
              <Link className="font-medium text-primary underline" href="/privacy">
                {t("learner.accountActions.linkPrivacy")}
              </Link>
            </li>
            <li>
              <Link className="font-medium text-primary underline" href="/refund-policy">
                {t("learner.accountActions.linkRefunds")}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </LearnerAccountShell>
  );
}
