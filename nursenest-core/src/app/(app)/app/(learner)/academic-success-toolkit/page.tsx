import type { Metadata } from "next";
import { AcademicSuccessToolkitClient } from "@/components/academic-success/academic-success-toolkit-client";
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
      title: "Academic Success Toolkit | NurseNest",
      description:
        "Use NurseNest's cross-profession academic success toolkit for assignment scaffolds, study tools, research support, group projects, presentations, and academic writing feedback.",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/academic-success-toolkit", routeGroup: "student.learner.academic_success_toolkit" },
  );
}

export default async function AcademicSuccessToolkitPage() {
  const session = await getProtectedRouteSession("(student).app.(learner).academic-success-toolkit");
  const userId = (session?.user as { id?: string })?.id ?? "";

  if (!userId) {
    return (
      <LearnerStudyPageShell>
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/academic-success-toolkit" />
        <PremiumEmptyState
          headline="Academic Success Toolkit"
          body="Sign in to use assignment scaffolds, research tools, study materials, and academic writing support."
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
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/academic-success-toolkit" />
        <PremiumEmptyState
          headline="Academic Success Toolkit"
          body="We could not verify your access. Please refresh or return to the dashboard."
          primaryCta={{ label: "Refresh", href: "/app/academic-success-toolkit", variant: "primary" }}
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
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/academic-success-toolkit" />
        <SubscriptionPaywall context="dashboard" />
      </LearnerStudyPageShell>
    );
  }

  return (
    <LearnerStudyPageShell className="max-w-7xl">
      <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/academic-success-toolkit" />
      <AcademicSuccessToolkitClient />
    </LearnerStudyPageShell>
  );
}
