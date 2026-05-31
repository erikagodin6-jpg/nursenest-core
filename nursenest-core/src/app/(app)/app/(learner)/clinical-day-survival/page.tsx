import type { Metadata } from "next";
import { ClinicalDaySurvivalHubClient } from "@/components/clinical-day-survival/clinical-day-survival-hub-client";
import { LearnerStudyPageShell } from "@/components/learner-study-ui/learner-study-page-shell";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "Clinical Day Survival Hub | NurseNest",
      description:
        "Prepare for nursing clinical placement with patient assignment prep, medication pass prep, lab interpretation, instructor questions, shift priorities, and rapid review sheets.",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/clinical-day-survival", routeGroup: "student.learner.clinical_day_survival" },
  );
}

export default async function ClinicalDaySurvivalPage() {
  const session = await getProtectedRouteSession("(student).app.(learner).clinical-day-survival");
  const userId = (session?.user as { id?: string })?.id ?? "";

  if (!userId) {
    return (
      <LearnerStudyPageShell>
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-day-survival" />
        <PremiumEmptyState
          headline="Clinical Day Survival Hub"
          body="Sign in to prepare for tomorrow's clinical assignment."
          primaryCta={{ label: "Go to dashboard", href: "/app", variant: "primary" }}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </LearnerStudyPageShell>
    );
  }

  const entitlement = await resolveEntitlementForPage(userId);
  if (entitlement === "error") {
    return (
      <LearnerStudyPageShell>
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-day-survival" />
        <PremiumEmptyState
          headline="Clinical Day Survival Hub"
          body="We could not verify your access. Please refresh or return to the dashboard."
          primaryCta={{ label: "Refresh", href: "/app/clinical-day-survival", variant: "primary" }}
          secondaryCtas={[{ label: "Dashboard", href: "/app", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </LearnerStudyPageShell>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <LearnerStudyPageShell>
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-day-survival" />
        <SubscriptionPaywall context="dashboard" />
      </LearnerStudyPageShell>
    );
  }

  return (
    <LearnerStudyPageShell className="max-w-7xl">
      <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-day-survival" />
      <ClinicalDaySurvivalHubClient />
    </LearnerStudyPageShell>
  );
}
