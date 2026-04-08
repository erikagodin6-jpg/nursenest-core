import Link from "next/link";
import { TrialStatus } from "@prisma/client";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerProfileAccountActions } from "@/components/student/learner-profile-account-actions";
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
    title: t("learner.account.billing.metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AccountBillingPage() {
  const { t, locale } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.billing"));
  const localeTag = locale.replace(/_/g, "-");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.profile.signedOutHint")}</p>
      </main>
    );
  }

  const bundle = await loadAccountHubBundle(userId);
  if (!bundle) {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.account.loadFailed")}</p>
      </main>
    );
  }

  const { userRow, subscription, entitlement } = bundle;
  const showBillingPortal = Boolean(subscription?.stripeCustomerId?.trim());

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.billing.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.billing.intro")}</p>
      </div>

      <section className="nn-card p-6">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("learner.profile.subscription.heading")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("learner.profile.subscription.subtitle")}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.access")}</dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {entitlement === "error"
                ? t("learner.profile.access.verifyUnknown")
                : entitlement.hasAccess
                  ? t("learner.profile.access.activePaid")
                  : t("learner.profile.access.noSubscription")}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.profileTierCountry")}</dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {userRow ? `${tierLabel(userRow.tier)} · ${userRow.country}` : t("learner.common.notAvailable")}
            </dd>
          </div>
          {subscription ? (
            <>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.stripeSubscription")}</dt>
                <dd className="mt-0.5 font-mono text-xs text-foreground">{subscription.stripeSubscriptionId}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.stripeStatus")}</dt>
                <dd className="mt-0.5 font-medium text-foreground">{subscription.status}</dd>
              </div>
              {subscription.planTier ? (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.planTierCheckout")}</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{tierLabel(subscription.planTier)}</dd>
                </div>
              ) : null}
              {subscription.planCountry ? (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.planCountry")}</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{subscription.planCountry}</dd>
                </div>
              ) : null}
            </>
          ) : null}
          {userRow?.trialStatus && userRow.trialStatus !== TrialStatus.NONE ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.trial")}</dt>
              <dd className="mt-0.5 text-foreground">
                {userRow.trialStatus}
                {userRow.trialEndsAt
                  ? t("learner.profile.trialEndsAt", {
                      date: userRow.trialEndsAt.toLocaleDateString(localeTag),
                    })
                  : ""}
              </dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-4">
          <Link
            href="/pricing"
            className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/80"
          >
            {t("learner.profile.cta.plansPricing")}
          </Link>
        </div>
      </section>

      <section className="nn-card p-6">
        <LearnerProfileAccountActions
          hasPassword={Boolean(userRow?.passwordHash)}
          showBillingPortal={showBillingPortal}
          variant="billingOnly"
        />
      </section>
    </main>
  );
}
