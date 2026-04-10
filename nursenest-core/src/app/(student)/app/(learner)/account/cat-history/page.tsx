import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerAccountEmptyState } from "@/components/student/learner-account-empty-state";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadLearnerCatHistory } from "@/lib/learner/load-learner-cat-history";
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
        title: t("learner.account.catHistory.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/account/cat-history", routeGroup: "student.learner.account_cat_history" },
  );
}

export default async function AccountCatHistoryPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.catHistory"));
  const entitlement = await resolveEntitlementForPage(userId);

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.catHistory.title")}
          body={t("learner.profile.signedOutHint")}
          hint={t("learner.dashboard.signedOutHint")}
          primaryCta={{ label: t("learner.gate.signIn"), href: loginWithCallback("/app/account/cat-history"), variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  if (entitlement === "error") {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline={t("learner.account.catHistory.title")}
          body={t("learner.entitlement.verifyFailed")}
          tone="default"
          primaryCta={{ label: t("paywall.cta.openStudyHub"), href: "/app", variant: "primary" }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.catHistory.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("learner.account.catHistory.lockedBody")}</p>
        </div>
        <SubscriptionPaywall context="dashboard" />
      </main>
    );
  }

  const rows = await loadLearnerCatHistory(userId);

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.catHistory.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.catHistory.intro")}</p>
      </div>

      {rows.length === 0 ? (
        <LearnerAccountEmptyState
          title={t("learner.account.catHistory.emptyTitle")}
          body={t("learner.account.catHistory.emptyBody")}
          hint={emptyStateCopy.noExamHistory.body}
          ctaHref="/app/practice-tests"
          ctaLabel={t("learner.account.catHistory.emptyCta")}
          secondaryHref="/app/account/readiness"
          secondaryLabel={t("learner.account.catHistory.emptySecondary")}
        />
      ) : (
        <section className="nn-card overflow-hidden p-0">
          <div className="divide-y divide-border/60">
            {rows.map((r) => (
              <div key={r.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Link href={r.href} className="font-semibold text-primary underline">
                    {r.title?.trim() || t("learner.account.catHistory.unnamedSession")}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.completedAt
                      ? t("learner.account.catHistory.completedAt", { date: r.completedAt.slice(0, 10) })
                      : t("learner.account.catHistory.updatedAt", { date: r.updatedAt.slice(0, 10) })}
                    {" · "}
                    {r.status}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-3 text-sm tabular-nums">
                  {r.accuracyPct != null ? (
                    <span className="font-semibold text-foreground">{r.accuracyPct}%</span>
                  ) : (
                    <span className="text-muted-foreground">{t("learner.common.notAvailable")}</span>
                  )}
                  {r.estimatedAbility != null ? (
                    <span className="text-muted-foreground">
                      θ {r.estimatedAbility > 0 ? "+" : ""}
                      {r.estimatedAbility.toFixed(2)}
                    </span>
                  ) : null}
                  {r.catDecision ? (
                    <span className="rounded-full bg-muted/50 px-2 py-0.5 text-xs font-medium capitalize text-foreground">
                      {r.catDecision.replace(/_/g, " ")}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
