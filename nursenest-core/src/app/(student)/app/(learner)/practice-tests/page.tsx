import { Suspense } from "react";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PracticeTestsHubClient } from "@/components/student/practice-tests-hub-client";
import { isCatExamSimulationFeatureEnabled } from "@/lib/exams/cat-exam-simulation";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { auth } from "@/lib/auth";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import {
  defaultPracticeTestPathwayId,
  listPathwaysCompatibleWithSubscription,
} from "@/lib/exam-pathways/pathway-entitlements";
import { prisma } from "@/lib/db";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export default async function PracticeTestsPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <p className="nn-card p-6 text-sm text-muted">
          We couldn’t finish checking your subscription (database or billing lookup failed). Refresh shortly, or sign in
          again if it keeps happening.
        </p>
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    const snap = userId ? await getFreemiumSnapshot(userId) : null;
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <h1 className="text-3xl font-bold">Practice tests</h1>
        <p className="mt-2 text-sm text-muted">
          Build timed or untimed tests from your question pool, save progress, and review scores with topic breakdowns,
          included with an active plan.
        </p>
        <div className="mt-6">
          <SubscriptionPaywall context="questions" freemiumRemainingQuestions={snap?.questionRemaining ?? 0} />
        </div>
      </main>
    );
  }

  const compatiblePathways = listPathwaysCompatibleWithSubscription(entitlement);
  const learnerPathRow = userId
    ? await prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } })
    : null;
  const defaultPathwayId = defaultPracticeTestPathwayId(
    compatiblePathways,
    learnerPathRow?.learnerPath,
    entitlement.country,
  );
  const pathwayOptions = compatiblePathways.map((p) => ({
    id: p.id,
    label: `${p.shortName} — ${p.displayName}`,
    examFamily: p.examFamily,
  }));

  return (
    <main>
      <div className="mb-4">
        <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
      </div>
      <h1 className="text-3xl font-bold">Practice tests</h1>
      <p className="mt-2 text-sm text-muted">
        Configure length, topics, difficulty, and selection mode. Run timed or untimed sessions, auto-save as you go,
        resume incomplete tests, and review scores with per-topic breakdowns and weak-area links.
      </p>
      <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading…</p>}>
        <PracticeTestsHubClient
          examSimulationEnabled={isCatExamSimulationFeatureEnabled()}
          pathwayOptions={pathwayOptions}
          defaultPathwayId={defaultPathwayId}
        />
      </Suspense>
    </main>
  );
}
