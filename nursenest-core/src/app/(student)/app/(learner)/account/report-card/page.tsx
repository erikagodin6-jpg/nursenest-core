import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

const TAKE = 30;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLearnerMarketingBundle();
  return {
    title: t("learner.account.reportCard.metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AccountReportCardPage() {
  const { t, locale } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const crumbs = appAccountBreadcrumbs(t("learner.account.nav.reportCard"));
  const localeTag = locale.replace(/_/g, "-");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.profile.signedOutHint")}</p>
      </main>
    );
  }

  if (entitlement === "error") {
    return (
      <main className="space-y-4">
        <BreadcrumbTrail items={crumbs} />
        <p className="text-sm text-muted-foreground">{t("learner.entitlement.verifyFailed")}</p>
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.reportCard.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("learner.account.reportCard.lockedBody")}</p>
        </div>
        <SubscriptionPaywall context="exams" />
        <Link href="/pricing" className="inline-flex text-sm font-semibold text-primary underline">
          {t("learner.profile.cta.plansPricing")}
        </Link>
      </main>
    );
  }

  const attempts = await prisma.examAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: TAKE,
    select: {
      id: true,
      score: true,
      total: true,
      createdAt: true,
      exam: { select: { title: true } },
    },
  });

  const latest = attempts[0];
  const latestPct =
    latest && latest.total > 0 ? Math.round((latest.score / latest.total) * 100) : null;

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <div>
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{t("learner.account.reportCard.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("learner.account.reportCard.intro")}</p>
      </div>

      <aside className="nn-card border-primary/15 bg-primary/5 p-5 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">{t("learner.exams.page.reportCardTitle")}</p>
        <p className="mt-2">{t("learner.exams.page.reportCardBody")}</p>
      </aside>

      {latestPct !== null ? (
        <p className="text-sm font-medium text-foreground">
          {t("learner.exams.page.latestAttempt", {
            score: latest?.score ?? 0,
            total: latest?.total ?? 0,
            pct: latestPct,
          })}{" "}
          {latestPct >= 75 ? t("learner.exams.page.latestStrong") : t("learner.exams.page.latestWeak")}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">{t("learner.exams.page.noAttempts")}</p>
      )}

      <section className="nn-card overflow-hidden p-0">
        <div className="border-b border-border/60 bg-muted/20 px-4 py-3">
          <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("learner.account.reportCard.tableHeading")}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("learner.account.reportCard.tableSub")}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[20rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">{t("learner.account.reportCard.colExam")}</th>
                <th className="px-4 py-3 font-medium">{t("learner.account.reportCard.colScore")}</th>
                <th className="px-4 py-3 font-medium">{t("learner.account.reportCard.colDate")}</th>
              </tr>
            </thead>
            <tbody>
              {attempts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                    {t("learner.account.reportCard.empty")}
                  </td>
                </tr>
              ) : (
                attempts.map((a) => {
                  const pct = a.total > 0 ? Math.round((a.score / a.total) * 100) : 0;
                  return (
                    <tr key={a.id} className="border-b border-border/40 last:border-0">
                      <td className="px-4 py-3 font-medium text-foreground">{a.exam.title}</td>
                      <td className="px-4 py-3 tabular-nums text-muted-foreground">
                        {pct}% ({a.score}/{a.total})
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{a.createdAt.toLocaleDateString(localeTag)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/app/exams"
          className="inline-flex rounded-full bg-role-cta px-4 py-2.5 text-sm font-semibold text-role-cta-foreground"
        >
          {t("learner.account.reportCard.ctaExams")}
        </Link>
        <Link href="/app/questions" className="inline-flex rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted/80">
          {t("learner.profile.quickLinks.questionBank")}
        </Link>
      </div>
    </main>
  );
}
