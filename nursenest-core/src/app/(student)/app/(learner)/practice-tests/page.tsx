import { Suspense } from "react";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PracticeTestsHubClient } from "@/components/student/practice-tests-hub-client";
import { isCatExamSimulationFeatureEnabled } from "@/lib/exams/cat-exam-simulation";
import { FreemiumPreviewExhaustedSurface } from "@/components/student/freemium-preview-exhausted-surface";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { ContentEmptyState } from "@/components/ui/content-empty-state";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { catPathwayExamCodeLabel, catPathwayRegionalExamLine } from "@/lib/exam-pathways/cat-pathway-labels";
import { defaultPracticeTestPathwayId, listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { pathwayAllowsCatAdaptiveStart } from "@/lib/exam-pathways/pathway-entitlements-policy";
import { resolveStudyLoopCatHref } from "@/lib/exam-pathways/study-loop-cat-routing";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { LearnerStudyQuickLinksCard } from "@/components/student/learner-study-quick-links-card";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { readPracticeTestsHubBootstrapSnapshot } from "@/lib/study-content-failover/practice-tests-hub-bootstrap-snapshot-read";
import { snapshotAgeMs } from "@/lib/study-content-failover/study-published-snapshot-store";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export default async function PracticeTestsPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await getProtectedRouteSession("(student).app.(learner).practice-tests");
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
      <div className="space-y-6">
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <div className="nn-learner-page-hero">
          <h1 className="text-3xl font-bold text-[var(--semantic-text-primary)]">{t("learner.practiceTests.title")}</h1>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("learner.practiceTests.subtitle.locked")}</p>
        </div>
        <div>
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

  let pathwayOptions: {
    id: string;
    label: string;
    examFamily: string;
    examCodeLabel: string;
  }[] = [];
  let defaultPathwayId: string | null = null;
  let catEligiblePathwayIds: string[] = [];
  let hubBootstrapSource: "primary" | "secondary" = "primary";

  try {
    const compatiblePathways = await listPathwaysCompatibleWithSubscription(entitlement);
    const learnerPathRow = userId
      ? await prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } })
      : null;
    defaultPathwayId = await defaultPracticeTestPathwayId(
      compatiblePathways,
      learnerPathRow?.learnerPath,
      entitlement.country,
    );
    pathwayOptions = compatiblePathways.map((p) => ({
      id: p.id,
      label: `${p.shortName} — ${p.displayName}`,
      examFamily: p.examFamily,
      examCodeLabel: p.shortName.trim(),
    }));
    catEligiblePathwayIds = compatiblePathways.filter(pathwayAllowsCatAdaptiveStart).map((p) => p.id);
  } catch (e) {
    safeServerLog("learner_practice_tests", "hub_bootstrap_primary_failed", {
      user_id_prefix: userId.slice(0, 8),
      error_message: e instanceof Error ? e.message.slice(0, 400) : String(e).slice(0, 400),
    });
    const tier = entitlement.tier != null ? String(entitlement.tier) : "";
    const country = entitlement.country != null ? String(entitlement.country) : "";
    const snap = tier && country ? await readPracticeTestsHubBootstrapSnapshot({ tier, country }) : null;
    if (snap?.payload) {
      hubBootstrapSource = "secondary";
      pathwayOptions = snap.payload.pathwayOptions;
      defaultPathwayId = snap.payload.defaultPathwayId;
      catEligiblePathwayIds = snap.payload.catEligiblePathwayIds;
      const age = snapshotAgeMs(snap.capturedAt);
      safeServerLog("learner_practice_tests", "study_content_failover", {
        event: "study_content_failover",
        surface: "practice_tests_hub_bootstrap",
        source_used: "secondary",
        failover_reason: "primary_db_failed",
        snapshot_version: snap.version.slice(0, 120),
        snapshot_age_ms: String(Math.round(age)),
        user_id_prefix: userId.slice(0, 8),
      });
    } else {
      return (
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
          <div className="mb-4">
            <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
          </div>
          <ContentEmptyState
            variant="generic"
            headline={t("learner.practiceTests.title")}
            body="We could not load practice exam tracks from live data and no published snapshot is available. Please retry shortly."
            primaryCta={{ label: "Retry", href: "/app/practice-tests" }}
          />
        </div>
      );
    }
  }
  const catHref = resolveStudyLoopCatHref({
    authState: "signed_in",
    pathwayId: defaultPathwayId,
    availablePathwayIds: catEligiblePathwayIds,
    intent: "start",
  });

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
      </div>
      <div className="nn-learner-page-hero">
        <h1 className="text-3xl font-bold text-[var(--semantic-text-primary)]">{t("learner.practiceTests.title")}</h1>
        <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("learner.practiceTests.subtitle.subscriber")}</p>
        <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">
          {t("learner.practiceTests.pageHero.catInsightsLead")}{" "}
          <Link href="/app/practice-tests/cat-insights" className="font-semibold text-primary underline">
            {t("learner.practiceTests.pageHero.catInsightsLink")}
          </Link>
          .
        </p>
      </div>
      <LearnerStudyQuickLinksCard t={t} id="practice-tests-study-quick-links" catHref={catHref} />
      <Suspense fallback={<p className="text-sm text-[var(--semantic-text-secondary)]">{t("learner.loading.section")}</p>}>
        <PracticeTestsHubClient
          pathwayOptions={pathwayOptions}
          defaultPathwayId={defaultPathwayId}
          catEligiblePathwayIds={catEligiblePathwayIds}
          examSimulationEnabled={isCatExamSimulationFeatureEnabled()}
          hubBootstrapSource={hubBootstrapSource}
        />
      </Suspense>
    </div>
  );
}
