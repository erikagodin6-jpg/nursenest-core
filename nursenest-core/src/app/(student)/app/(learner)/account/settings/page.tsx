import Link from "next/link";
import type { Metadata } from "next";
import { AccountDeleteDangerZone } from "@/components/account/account-delete-danger-zone";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { LearnerAccountPageHero, LearnerAccountShell } from "@/components/learner-account-ui";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

const SETTING_DESTINATIONS: readonly { href: string; titleKey?: string; title?: string; bodyKey?: string; body?: string }[] = [
  {
    href: "/app/account/study-preferences",
    titleKey: "learner.account.nav.settingsHub",
    bodyKey: "learner.account.settingsPage.cardStudyPrefs",
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

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <LearnerBreadcrumbTrail kind="account-hub" pathname="/app/account" />
        <PremiumEmptyState
          headline={t("learner.account.settingsPage.title")}
          body={t("learner.profile.signedOutHint")}
          hint={t("learner.dashboard.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app/account/settings"), variant: "primary" }}
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
