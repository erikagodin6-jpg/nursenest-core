import Link from "next/link";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import type { Metadata } from "next";
import { AccountDeleteDangerZone } from "@/components/account/account-delete-danger-zone";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { LearnerAccountPageHero, LearnerAccountShell } from "@/components/learner-account-ui";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { formatBillingTierLabel, loadBillingPagePayload } from "@/lib/learner/load-billing-page-payload";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

const SETTING_DESTINATIONS: readonly { href: string; titleKey?: string; title?: string; bodyKey?: string; body?: string }[] = [
  {
    href: "/app/account/study-preferences",
    titleKey: "learner.account.nav.settingsHub",
    bodyKey: "learner.account.settingsPage.cardStudyPrefs",
  },
  {
    href: "/app/np",
    title: "Change Certification Pathway",
    body: "Choose CNPLE, FNP, AGPCNP, PMHNP, WHNP, or PNP-PC so NP learning stays certification-scoped.",
  },
  {
    href: "/app/account/personal",
    titleKey: "learner.account.nav.personal",
    bodyKey: "learner.account.settingsPage.cardPersonal",
  },
  {
    href: "/app/account/security",
    titleKey: "learner.account.nav.security",
    bodyKey: "learner.account.settingsPage.cardSecurity",
  },
  {
    href: "/app/account/social",
    title: "Social study privacy",
    body: "Manage friends, group codes, challenges, leaderboards, and privacy-safe stat visibility.",
  },
  {
    href: "/app/account/beta",
    title: "Beta Program",
    body: "Redeem invitation codes, review enabled previews, and send feedback to the NurseNest team.",
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.account.settingsPage.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/settings", routeGroup: "student.learner.account_settings" },
  );
}

export default async function AccountSettingsHubPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await getProtectedRouteSession("(student).app.(learner).account.settings");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const userEmail = (session?.user as { email?: string | null })?.email ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.settings"));
  const billing = userId ? await loadBillingPagePayload(userId).catch(() => null) : null;
  const renewalDate = billing?.stripeRenewal?.currentPeriodEnd ?? billing?.billingPeriodEndDisplay ?? null;
  const nextAmount =
    billing?.stripeRenewal?.nextInvoiceAmountDue != null
      ? new Intl.NumberFormat("en", {
          style: "currency",
          currency: (billing.stripeRenewal.nextInvoiceCurrency ?? "usd").toUpperCase(),
        }).format(billing.stripeRenewal.nextInvoiceAmountDue / 100)
      : "Managed In Stripe";

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <LearnerBreadcrumbTrail kind="account-hub" pathname="/app/account" />
        <PremiumEmptyState
          headline={t("learner.account.settingsPage.title")}
          body="We are checking your learner session."
          hint="Return to the study hub and try again if this does not refresh."
          primaryCta={{ label: "Open Study Hub", href: "/app", variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  return (
    <LearnerAccountShell className="space-y-8 py-2" data-testid="learner-account-settings-hub">
      <LearnerBreadcrumbTrail kind="account-hub" pathname="/app/account" />
      <LearnerAccountPageHero
        eyebrow={t("learner.account.shell.kicker")}
        title={t("learner.account.settingsPage.title")}
        description={t("learner.account.settingsPage.intro")}
      />
      {billing ? (
        <section
          className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-sm"
          data-nn-subscription-summary-card
          data-nn-subscription-summary-surface="settings"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Subscription Summary</p>
              <h2 className="mt-2 text-lg font-bold text-[var(--semantic-text-primary)]">
                {formatBillingTierLabel(billing.effectiveTier, billing.effectiveCountry)}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Status: {billing.subscription?.status?.replaceAll("_", " ") ?? "No Active Subscription"}
              </p>
            </div>
            <dl className="grid min-w-0 gap-3 text-sm sm:grid-cols-3 lg:min-w-[520px]">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Renewal Date</dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {renewalDate ? renewalDate.toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" }) : "Not Available"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Next Charge</dt>
                <dd className="mt-1 font-semibold text-foreground">{nextAmount}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment Method</dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {billing.stripeRenewal?.paymentMethodSummary?.last4
                    ? `${billing.stripeRenewal.paymentMethodSummary.brand?.toUpperCase() ?? "CARD"} ${billing.stripeRenewal.paymentMethodSummary.last4}`
                    : "Managed In Stripe"}
                </dd>
              </div>
            </dl>
          </div>
          <Link href="/app/account/billing" className="mt-4 inline-flex rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground">
            Manage Billing
          </Link>
        </section>
      ) : null}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SETTING_DESTINATIONS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex h-full flex-col rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-sm transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:shadow-md"
            >
              <span className="text-base font-semibold text-[var(--semantic-text-primary)]">{item.title ?? t(item.titleKey ?? "")}</span>
              <span className="mt-2 text-sm text-muted-foreground">{item.body ?? t(item.bodyKey ?? "")}</span>
              <span className="mt-4 text-sm font-semibold text-primary">{t("learner.account.settingsPage.open")} →</span>
            </Link>
          </li>
        ))}
      </ul>
      <AccountDeleteDangerZone userEmail={userEmail} billingHref="/app/account/billing" />
    </LearnerAccountShell>
  );
}
