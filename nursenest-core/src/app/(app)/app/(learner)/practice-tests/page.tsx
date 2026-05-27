import { Suspense } from "react";
import { ExamFamily, TierCode } from "@prisma/client";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { FlashcardsPathwayPickSurface } from "@/components/flashcards/flashcards-pathway-pick-surface";
import { PracticeTestsHubClient } from "@/components/student/practice-tests-hub-client";
import { PracticeActivitySkeleton } from "@/components/skeletons/hub-page-skeleton";
import { isCatExamSimulationFeatureEnabled } from "@/lib/exams/cat-exam-simulation";
import { FreemiumPreviewExhaustedSurface } from "@/components/student/freemium-preview-exhausted-surface";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { ContentEmptyState } from "@/components/ui/content-empty-state";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import {
  examPathwaysForStudyHubSubscription,
  listPathwaysCompatibleWithSubscription,
} from "@/lib/exam-pathways/pathway-entitlements";
import { pathwayAllowsCatAdaptiveStart } from "@/lib/exam-pathways/pathway-entitlements-policy";
import { resolveStudyLoopCatHref } from "@/lib/exam-pathways/study-loop-cat-routing";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import {
  resolveSubscribedQuestionBankPathways,
  type ResolvedQuestionBankPathways,
} from "@/lib/learner/tier-scoped-study-routes";
import { prisma } from "@/lib/db";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { readPracticeTestsHubBootstrapSnapshot } from "@/lib/study-content-failover/practice-tests-hub-bootstrap-snapshot-read";
import { snapshotAgeMs } from "@/lib/study-content-failover/study-published-snapshot-store";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { getPathwayLessonPracticeHubSnapshot } from "@/lib/learner-study-hub/pathway-lesson-study-materials";
import { normalizeLearnerFlashcardsPathwayQueryId } from "@/lib/flashcards/flashcards-pathway-query";

type PageProps = {
  searchParams: Promise<{
    pathwayId?: string | string[] | undefined;
    topic?: string | string[] | undefined;
    /** Canonical CAT-launch param set by appPathwayCatSessionStartPath. */
    catLaunch?: string | string[] | undefined;
  }>;
};

function isTruthyParam(v: string | string[] | undefined): boolean {
  const s = Array.isArray(v) ? v[0] : v;
  if (typeof s !== "string") return false;
  const t = s.trim();
  return t.length > 0 && t !== "0" && t !== "false";
}

export default async function PracticeTestsPage({ searchParams }: PageProps) {
  const { t } = await getLearnerMarketingBundle();
  const sp = await searchParams;
  const rawPid = sp.pathwayId;
  const catRequested = isTruthyParam(sp.catLaunch);
  const pathwayQueryRaw =
    typeof rawPid === "string" && rawPid.trim().length > 2
      ? rawPid.trim()
      : Array.isArray(rawPid) && typeof rawPid[0] === "string" && rawPid[0].trim().length > 2
        ? rawPid[0].trim()
        : null;

  const session = await getProtectedRouteSession("(student).app.(learner).practice-tests");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  safeServerLog("learner_practice_tests", "server_bootstrap_auth_entitlement", {
    loader_name: "practice_tests_page",
    pathway_id_raw: pathwayQueryRaw ?? "",
    user_id_prefix: userId.slice(0, 8),
    has_session: session ? "1" : "0",
    entitlement_state: entitlement === "error" ? "error" : entitlement.hasAccess ? "has_access" : "no_access",
    tier: entitlement === "error" ? "" : String(entitlement.tier ?? ""),
    country: entitlement === "error" ? "" : String(entitlement.country ?? ""),
  });

  if (entitlement === "error") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-5">
          <LearnerBreadcrumbTrail kind="practice-tests" pathname="/app/practice-tests" />
        </div>
        <div className="nn-learner-page-hero">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.75rem]">
            {t("learner.practiceTests.title")}
          </h1>
          <p className="mt-2.5 max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:mt-3">
            {t("learner.entitlement.verifyFailed")}
          </p>
        </div>
      </div>
    );
  }

  if (!entitlement.hasAccess) {
    let snap = null;
    try {
      snap = userId ? await getFreemiumSnapshot(userId) : null;
    } catch (error) {
      safeServerLog("learner_practice_tests", "freemium_snapshot_failed", {
        loader_name: "practice_tests_hub_page",
        user_id_prefix: userId.slice(0, 8),
        error_message: error instanceof Error ? error.message.slice(0, 400) : String(error).slice(0, 400),
      });
    }
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 sm:px-6">
        <div className="mb-1">
          <LearnerBreadcrumbTrail kind="practice-tests" pathname="/app/practice-tests" />
        </div>
        <div className="nn-learner-page-hero">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.75rem]">
            {t("learner.practiceTests.title")}
          </h1>
          <p className="mt-2.5 max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:mt-3">
            {t("learner.practiceTests.subtitle.locked")}
          </p>
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

  const requestedPathwayId = pathwayQueryRaw
    ? normalizeLearnerFlashcardsPathwayQueryId(pathwayQueryRaw, entitlement.country)
    : null;

  let pathwayOptions: {
    id: string;
    label: string;
    examFamily: string;
    examCodeLabel: string;
  }[] = [];
  let defaultPathwayId: string | null = null;
  let catEligiblePathwayIds: string[] = [];
  let hubBootstrapSource: "primary" | "secondary" = "primary";
  let pathwayResolution: ResolvedQuestionBankPathways | null = null;

  try {
    const rawCompatible = await listPathwaysCompatibleWithSubscription(entitlement);
    const compatiblePathways = examPathwaysForStudyHubSubscription(entitlement, rawCompatible);
    const learnerPathRow = userId
      ? await prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } })
      : null;
    const learnerLp = learnerPathRow?.learnerPath?.trim() ?? null;
    pathwayOptions = compatiblePathways.map((p) => ({
      id: p.id,
      label: `${p.shortName} — ${p.displayName}`,
      examFamily: p.examFamily,
      examCodeLabel: p.shortName.trim(),
    }));
    catEligiblePathwayIds = compatiblePathways.filter(pathwayAllowsCatAdaptiveStart).map((p) => p.id);
    pathwayResolution = resolveSubscribedQuestionBankPathways({
      requestedPathwayId,
      compatible: compatiblePathways.map((p) => ({ id: p.id, shortName: p.shortName })),
      learnerPath: learnerLp,
      requireExplicitRequestedPathwayId: true,
    });
    if (pathwayResolution.state === "scoped") {
      defaultPathwayId = pathwayResolution.defaultPathwayId;
    }
    safeServerLog("learner_practice_tests", "pathway_bootstrap_resolved", {
      loader_name: "practice_tests_page",
      user_id_prefix: userId.slice(0, 8),
      requested_pathway_id: requestedPathwayId ?? "",
      learner_path: learnerLp ?? "",
      raw_compatible_count: rawCompatible.length,
      compatible_count: compatiblePathways.length,
      compatible_ids: compatiblePathways.map((p) => p.id).join(",").slice(0, 400),
      cat_eligible_ids: catEligiblePathwayIds.join(",").slice(0, 400),
      resolution_state: pathwayResolution.state,
      default_pathway_id: defaultPathwayId ?? "",
    });
  } catch (e) {
    safeServerLog("learner_practice_tests", "hub_bootstrap_primary_failed", {
      user_id_prefix: userId.slice(0, 8),
      requested_pathway_id: requestedPathwayId ?? "",
      tier: String(entitlement.tier ?? ""),
      country: String(entitlement.country ?? ""),
      error_name: e instanceof Error ? e.name : "unknown",
      error_message: e instanceof Error ? e.message.slice(0, 400) : String(e).slice(0, 400),
    });
    const tier = entitlement.tier != null ? String(entitlement.tier) : "";
    const country = entitlement.country != null ? String(entitlement.country) : "";
    let snap = null;
    try {
      snap = tier && country ? await readPracticeTestsHubBootstrapSnapshot({ tier, country }) : null;
    } catch {
      snap = null;
    }
    if (snap?.payload) {
      hubBootstrapSource = "secondary";
      pathwayOptions =
        entitlement.tier === TierCode.NP
          ? snap.payload.pathwayOptions.filter((p) => p.examFamily === ExamFamily.NP)
          : snap.payload.pathwayOptions;
      const npIds = new Set(pathwayOptions.map((p) => p.id));
      catEligiblePathwayIds = snap.payload.catEligiblePathwayIds.filter((id) => npIds.has(id));
      pathwayResolution = resolveSubscribedQuestionBankPathways({
        requestedPathwayId,
        compatible: pathwayOptions.map((p) => ({ id: p.id, shortName: p.examCodeLabel?.trim() || p.id })),
        learnerPath: null,
        requireExplicitRequestedPathwayId: true,
      });
      if (pathwayResolution.state === "scoped") {
        defaultPathwayId = pathwayResolution.defaultPathwayId;
      } else {
        defaultPathwayId = snap.payload.defaultPathwayId;
      }
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
            <LearnerBreadcrumbTrail kind="practice-tests" pathname="/app/practice-tests" />
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

  if (pathwayResolution?.state === "invalid_requested") {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <div className="mb-4">
          <LearnerBreadcrumbTrail kind="practice-tests" pathname="/app/practice-tests" />
        </div>
        <ContentEmptyState
          variant="generic"
          headline="This study track is not on your account"
          body="Choose an exam you are subscribed to."
          primaryCta={{ label: "Study preferences", href: "/app/account/study-preferences" }}
        />
      </div>
    );
  }

  if (pathwayResolution?.state === "no_pathway_context") {
    return (
      <div className="space-y-4">
        <div className="mb-4">
          <LearnerBreadcrumbTrail kind="practice-tests" pathname="/app/practice-tests" />
        </div>
        <FlashcardsPathwayPickSurface
          baseAppPath="/app/practice-tests"
          title={t("learner.practiceTests.title")}
          subtitle="Choose an exam track for practice exams. Your selection opens the shared study setup with that pathway selected."
          pathways={pathwayOptions.map((p) => ({ id: p.id, label: p.label }))}
        />
      </div>
    );
  }

  if (pathwayResolution?.state !== "scoped") {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div className="mb-1">
          <LearnerBreadcrumbTrail kind="practice-tests" pathname="/app/practice-tests" />
        </div>
        <div className="nn-learner-page-hero">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.75rem]">
            {t("learner.practiceTests.title")}
          </h1>
          <p className="mt-2.5 max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:mt-3">
            {t("learner.entitlement.verifyFailed")}
          </p>
        </div>
      </div>
    );
  }

  let catHref = "/app/practice-tests?catLaunch=1";
  try {
    catHref = resolveStudyLoopCatHref({
      authState: "signed_in",
      pathwayId: defaultPathwayId,
      availablePathwayIds: catEligiblePathwayIds,
      intent: "start",
    });
  } catch (error) {
    const fallbackPathway = defaultPathwayId?.trim();
    catHref = fallbackPathway
      ? `/app/practice-tests?pathwayId=${encodeURIComponent(fallbackPathway)}&catLaunch=1`
      : "/app/practice-tests?catLaunch=1";
    safeServerLog("learner_practice_tests", "cat_href_resolve_failed", {
      loader_name: "practice_tests_hub_page",
      pathway_id: fallbackPathway ?? "",
      error_message: error instanceof Error ? error.message.slice(0, 400) : String(error).slice(0, 400),
    });
  }

  let pathwayLessonPractice = null;
  try {
    pathwayLessonPractice =
      defaultPathwayId && defaultPathwayId.trim().length > 0
        ? await getPathwayLessonPracticeHubSnapshot(defaultPathwayId.trim())
        : null;
  } catch {
    pathwayLessonPractice = null;
  }

  const scopedPid = defaultPathwayId?.trim() ?? "";
  const catalogPathway = scopedPid ? getExamPathwayById(scopedPid) : undefined;
  const pathwayLabelFromOptions = pathwayOptions.find((p) => p.id === scopedPid)?.label;
  const pathwayDisplayName =
    catalogPathway?.displayName ?? catalogPathway?.shortName ?? pathwayLabelFromOptions ?? scopedPid;

  return (
    <Suspense fallback={<PracticeActivitySkeleton label={t("learner.loading.section")} />}>
      <PracticeTestsHubClient
        pathwayOptions={pathwayOptions}
        defaultPathwayId={defaultPathwayId}
        pathwayDisplayName={pathwayDisplayName}
        catEligiblePathwayIds={catEligiblePathwayIds}
        examSimulationEnabled={isCatExamSimulationFeatureEnabled()}
        hubBootstrapSource={hubBootstrapSource}
        catHref={catHref}
        pathwayLessonPractice={pathwayLessonPractice}
        initialCatMode={catRequested}
      />
    </Suspense>
  );
}
