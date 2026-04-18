import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import type { BreadcrumbCrumb } from "@/lib/seo/breadcrumb-types";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { LearnerCommandCenterClient } from "@/components/study/learner-command-center-client";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";

export const dynamic = "force-dynamic";

const crumbs: BreadcrumbCrumb[] = [
  { name: "Dashboard", href: "/app" },
  { name: "Study hub", href: undefined },
];

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        title: t("learner.commandCenter.metaTitle"),
        robots: { index: false, follow: false },
      };
    },
    { pathname: "/app/command-center", routeGroup: "student.learner.command_center" },
  );
}

export default async function LearnerCommandCenterPage() {
  const session = await getProtectedRouteSession("(student).app.(learner).command-center");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const { t } = await getLearnerMarketingBundle();

  if (!userId || !isDatabaseUrlConfigured()) {
    redirect(loginWithCallback("/app/command-center"));
  }

  const entitlement = await resolveEntitlementForPage(userId);
  if (entitlement === "error") {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <p className="nn-card p-6 text-sm text-muted">{t("learner.entitlement.verifyFailed")}</p>
      </div>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <div className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <h1 className="text-2xl font-bold">{t("learner.commandCenter.title")}</h1>
        <p className="mt-2 text-sm text-muted">{t("learner.commandCenter.subtitleLocked")}</p>
        <div className="mt-6">
          <SubscriptionPaywall context="lessons" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <LearnerCommandCenterClient />
    </div>
  );
}
