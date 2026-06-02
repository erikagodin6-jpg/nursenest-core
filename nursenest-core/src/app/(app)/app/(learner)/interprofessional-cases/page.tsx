import type { Metadata } from "next";
import { InterprofessionalCaseCollaborationHubClient } from "@/components/interprofessional/interprofessional-case-collaboration-hub-client";
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
      title: "Interprofessional Case Collaboration Hub | NurseNest",
      description:
        "Practice interprofessional education cases, role perspectives, team huddles, consult decisions, SBAR communication, discharge planning, and team-based clinical decision-making.",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/interprofessional-cases", routeGroup: "student.learner.interprofessional_cases" },
  );
}

export default async function InterprofessionalCasesPage() {
  const session = await getProtectedRouteSession("(student).app.(learner).interprofessional-cases");
  const userId = (session?.user as { id?: string })?.id ?? "";

  if (!userId) {
    return (
      <LearnerStudyPageShell>
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/interprofessional-cases" />
        <PremiumEmptyState
          headline="Interprofessional Case Collaboration Hub"
          body="Sign in to practice role clarity, team communication, patient advocacy, and interprofessional clinical decision-making."
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
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/interprofessional-cases" />
        <PremiumEmptyState
          headline="Interprofessional Case Collaboration Hub"
          body="We could not verify your access. Please refresh or return to the dashboard."
          primaryCta={{ label: "Refresh", href: "/app/interprofessional-cases", variant: "primary" }}
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
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/interprofessional-cases" />
        <SubscriptionPaywall context="dashboard" />
      </LearnerStudyPageShell>
    );
  }

  return (
    <LearnerStudyPageShell className="max-w-7xl">
      <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/interprofessional-cases" />
      <InterprofessionalCaseCollaborationHubClient />
    </LearnerStudyPageShell>
  );
}
