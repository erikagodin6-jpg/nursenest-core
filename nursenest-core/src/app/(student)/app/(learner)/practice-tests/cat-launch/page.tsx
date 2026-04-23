import { redirect } from "next/navigation";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { CatDirectLaunchClient } from "@/components/student/cat-direct-launch-client";
import { FreemiumPreviewExhaustedSurface } from "@/components/student/freemium-preview-exhausted-surface";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { pathwayAllowsCatAdaptiveStart } from "@/lib/exam-pathways/pathway-entitlements-policy";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import type { Metadata } from "next";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      robots: { index: false, follow: false },
      title: "Starting exam simulation | NurseNest",
    }),
    { pathname: "/app/practice-tests/cat-launch", routeGroup: "student.learner.practice_test_cat_launch" },
  );
}

type Props = { searchParams: Promise<{ pathwayId?: string }> };

export default async function CatDirectLaunchPage({ searchParams }: Props) {
  const { t } = await getLearnerMarketingBundle();
  const sp = await searchParams;
  const pathwayId = typeof sp.pathwayId === "string" && sp.pathwayId.trim().length > 2 ? sp.pathwayId.trim() : null;

  if (!pathwayId) {
    redirect("/app/practice-tests/start");
  }

  const session = await getProtectedRouteSession("(student).app.(learner).practice-tests.cat_launch");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <div>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <p className="nn-card p-6 text-sm text-muted">{t("learner.entitlement.verifyFailed")}</p>
      </div>
    );
  }

  if (!entitlement.hasAccess) {
    const snap = userId ? await getFreemiumSnapshot(userId) : null;
    return (
      <div>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <h1 className="sr-only">Exam simulation</h1>
        <p className="mt-2 text-sm text-muted">Subscribe to run timed adaptive exam simulations.</p>
        <div className="mt-6">
          <SubscriptionPaywall
            context="questions"
            freemiumRemainingQuestions={snap != null ? snap.questionRemaining : undefined}
            freemiumRemainingLessons={snap != null ? snap.lessonRemaining : undefined}
          />
        </div>
        <FreemiumPreviewExhaustedSurface kind="cat" />
      </div>
    );
  }

  const compatiblePathways = await listPathwaysCompatibleWithSubscription(entitlement);
  const catEligiblePathways = compatiblePathways.filter(pathwayAllowsCatAdaptiveStart);

  if (!catEligiblePathways.some((p) => p.id === pathwayId)) {
    return (
      <div>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <PremiumEmptyState
          headline="Exam simulation"
          body="This exam track is not available for adaptive sessions on your current plan, or CAT is not enabled for that track yet."
          tone="default"
          primaryCta={{
            label: t("learner.dashboard.openAccountHub"),
            href: "/app/account/study-preferences",
            variant: "primary",
          }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/app/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  const pathway = catEligiblePathways.find((p) => p.id === pathwayId)!;
  const shell: PracticeTestPathwayClientShell = {
    id: pathway.id,
    countrySlug: pathway.countrySlug,
    roleTrack: pathway.roleTrack,
    examCode: pathway.examCode,
    shortName: pathway.shortName,
    examFamily: pathway.examFamily,
  };

  return (
    <div>
      <div className="mb-4">
        <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
      </div>
      <CatDirectLaunchClient pathwayId={pathwayId} pathwayShell={shell} />
    </div>
  );
}
