import type { Metadata } from "next";
import { ClinicalWorksheetBuilderClient } from "@/components/clinical-worksheets/clinical-worksheet-builder-client";
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
      title: "Clinical Worksheet & Brain Sheet Builder | NurseNest",
      description:
        "Build nursing brain sheets, patient worksheets, lab trackers, medication organizers, shift task lists, SBAR reports, and multi-patient clinical prioritization tools.",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/clinical-worksheet-builder", routeGroup: "student.learner.clinical_worksheet_builder" },
  );
}

export default async function ClinicalWorksheetBuilderPage() {
  const session = await getProtectedRouteSession("(student).app.(learner).clinical-worksheet-builder");
  const userId = (session?.user as { id?: string })?.id ?? "";

  if (!userId) {
    return (
      <LearnerStudyPageShell>
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-worksheet-builder" />
        <PremiumEmptyState
          headline="Clinical Worksheet & Brain Sheet Builder"
          body="Sign in to build clinical worksheets and nursing brain sheets."
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
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-worksheet-builder" />
        <PremiumEmptyState
          headline="Clinical Worksheet & Brain Sheet Builder"
          body="We could not verify your access. Please refresh or return to the dashboard."
          primaryCta={{ label: "Refresh", href: "/app/clinical-worksheet-builder", variant: "primary" }}
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
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-worksheet-builder" />
        <SubscriptionPaywall context="dashboard" />
      </LearnerStudyPageShell>
    );
  }

  return (
    <LearnerStudyPageShell className="max-w-7xl">
      <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-worksheet-builder" />
      <ClinicalWorksheetBuilderClient />
    </LearnerStudyPageShell>
  );
}
