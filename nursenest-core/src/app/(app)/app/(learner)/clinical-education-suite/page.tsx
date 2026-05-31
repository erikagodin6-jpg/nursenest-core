import type { Metadata } from "next";
import { ClinicalEducationSuiteClient } from "@/components/cross-profession-education/clinical-education-suite-client";
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
      title: "Clinical Education Suite | NurseNest",
      description:
        "Use NurseNest's cross-profession clinical education suite for clinical preparation, documentation training, concept maps, reasoning, simulations, placement tracking, and competency portfolios.",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/clinical-education-suite", routeGroup: "student.learner.clinical_education_suite" },
  );
}

export default async function ClinicalEducationSuitePage() {
  const session = await getProtectedRouteSession("(student).app.(learner).clinical-education-suite");
  const userId = (session?.user as { id?: string })?.id ?? "";

  if (!userId) {
    return (
      <LearnerStudyPageShell>
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-education-suite" />
        <PremiumEmptyState
          headline="Clinical Education Suite"
          body="Sign in to use cross-profession clinical preparation, documentation, simulation, and competency portfolio tools."
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
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-education-suite" />
        <PremiumEmptyState
          headline="Clinical Education Suite"
          body="We could not verify your access. Please refresh or return to the dashboard."
          primaryCta={{ label: "Refresh", href: "/app/clinical-education-suite", variant: "primary" }}
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
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-education-suite" />
        <SubscriptionPaywall context="dashboard" />
      </LearnerStudyPageShell>
    );
  }

  return (
    <LearnerStudyPageShell className="max-w-7xl">
      <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-education-suite" />
      <ClinicalEducationSuiteClient />
    </LearnerStudyPageShell>
  );
}
