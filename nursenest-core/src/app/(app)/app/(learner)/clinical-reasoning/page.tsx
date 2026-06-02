import type { Metadata } from "next";
import { ClinicalReasoningPathwayRunner } from "@/components/clinical-reasoning/clinical-reasoning-pathway-runner";
import { LearnerStudyPageShell } from "@/components/learner-study-ui/learner-study-page-shell";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { CLINICAL_REASONING_PATHWAYS } from "@/lib/clinical-reasoning/clinical-reasoning-pathways-engine";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "Clinical Reasoning Pathways | NurseNest",
      description:
        "Interactive clinical reasoning pathways that teach learners to recognize cues, prioritize problems, act safely, and evaluate outcomes.",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/clinical-reasoning", routeGroup: "student.learner.clinical_reasoning" },
  );
}

export default async function ClinicalReasoningPage() {
  const session = await getProtectedRouteSession("(student).app.(learner).clinical-reasoning");
  const userId = (session?.user as { id?: string })?.id ?? "";

  if (!userId) {
    return (
      <LearnerStudyPageShell>
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-reasoning" />
        <PremiumEmptyState
          headline="Clinical Reasoning Pathways"
          body="Sign in to use interactive clinical reasoning pathways."
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
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-reasoning" />
        <PremiumEmptyState
          headline="Clinical Reasoning Pathways"
          body="We could not verify your access. Please refresh or return to the dashboard."
          primaryCta={{ label: "Refresh", href: "/app/clinical-reasoning", variant: "primary" }}
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
        <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-reasoning" />
        <SubscriptionPaywall context="dashboard" />
      </LearnerStudyPageShell>
    );
  }

  return (
    <LearnerStudyPageShell className="max-w-7xl">
      <LearnerBreadcrumbTrail kind="dashboard" pathname="/app/clinical-reasoning" />
      <ClinicalReasoningPathwayRunner pathways={CLINICAL_REASONING_PATHWAYS} />
    </LearnerStudyPageShell>
  );
}
