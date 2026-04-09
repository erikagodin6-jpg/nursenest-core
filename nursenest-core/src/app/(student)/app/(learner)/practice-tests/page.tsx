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
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { LearnerStudyQuickLinksCard } from "@/components/student/learner-study-quick-links-card";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export default async function PracticeTestsPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <p className="nn-card p-6 text-sm text-muted">{t("learner.entitlement.verifyFailed")}</p>
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    const snap = userId ? await getFreemiumSnapshot(userId) : null;
    return (
      <main className="space-y-6">
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <div className="nn-learner-page-hero">
          <h1 className="text-3xl font-bold text-[var(--semantic-text-primary)]">{t("learner.practiceTests.title")}</h1>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("learner.practiceTests.subtitle.locked")}</p>
        </div>
        <div>
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
    <main className="space-y-6">
      <div className="mb-4">
        <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
      </div>
      <div className="nn-learner-page-hero">
        <h1 className="text-3xl font-bold text-[var(--semantic-text-primary)]">{t("learner.practiceTests.title")}</h1>
        <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("learner.practiceTests.subtitle.subscriber")}</p>
        <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">
          <Link href="/app/practice-tests/cat-insights" className="font-semibold text-primary underline">
            CAT readiness dashboard
          </Link>{" "}
          — pass outlook trends across your completed adaptive sessions.
        </p>
      </div>
      <LearnerStudyQuickLinksCard t={t} id="practice-tests-study-quick-links" />
      <Suspense fallback={<p className="text-sm text-[var(--semantic-text-secondary)]">{t("learner.loading.section")}</p>}>
        <PracticeTestsHubClient
          pathwayOptions={pathwayOptions}
          defaultPathwayId={defaultPathwayId}
          examSimulationEnabled={isCatExamSimulationFeatureEnabled()}
        />
      </Suspense>
    </main>
  );
}
