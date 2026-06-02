import type { Metadata } from "next";
import { ClinicalAssignmentHubClient } from "@/components/clinical-assignments/clinical-assignment-hub-client";
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
      title: "Clinical Assignment Hub | NurseNest",
      description:
        "Build educational nursing care plans, concept maps, medication cards, SBAR reports, disease worksheets, clinical prep sheets, and reflections.",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/clinical-assignments", routeGroup: "student.learner.clinical_assignments" },
  );
}

export default async function ClinicalAssignmentHubPage() {
  const session = await getProtectedRouteSession("(student).app.(learner).clinical-assignments");
  const userId = (session?.user as { id?: string })?.id ?? "";

  if (!userId) {
    return (
      <LearnerStudyPageShell>
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-assignments" />
        <PremiumEmptyState
          headline="Clinical Assignment Hub"
          body="Sign in to build clinical assignment support tools."
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
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-assignments" />
        <PremiumEmptyState
          headline="Clinical Assignment Hub"
          body="We could not verify your access. Please refresh or return to the dashboard."
          primaryCta={{ label: "Refresh", href: "/app/clinical-assignments", variant: "primary" }}
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
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-assignments" />
        <SubscriptionPaywall context="dashboard" />
      </LearnerStudyPageShell>
    );
  }

  return (
    <LearnerStudyPageShell className="max-w-7xl">
      <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-assignments" />
      <ClinicalAssignmentHubClient />
    </LearnerStudyPageShell>
  );
}
