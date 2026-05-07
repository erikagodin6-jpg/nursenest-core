import { Suspense } from "react";
import { LearnerRenderTraceBanner } from "@/components/dev/learner-render-trace-banner.dynamic";
import { FlashcardsHubClient } from "@/components/flashcards/flashcards-hub-client";
import { FlashcardsPathwayPickSurface } from "@/components/flashcards/flashcards-pathway-pick-surface";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { ContentEmptyState } from "@/components/ui/content-empty-state";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import {
  resolveSubscribedQuestionBankPathways,
  type ResolvedQuestionBankPathways,
} from "@/lib/learner/tier-scoped-study-routes";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { readFlashcardsHubPathwayBootstrapSnapshot } from "@/lib/study-content-failover/flashcards-hub-bootstrap-snapshot-read";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { resolveStudyLoopCatHref } from "@/lib/exam-pathways/study-loop-cat-routing";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import { builderCategoryOptionsForPathway } from "@/lib/flashcards/flashcard-builder-taxonomy";
import { flashcardLessonVirtualDiagnosticsForPathway } from "@/lib/learner-study-hub/pathway-lesson-study-materials";
import { loadFlashcardsExamInventoryForPathway } from "@/lib/flashcards/load-flashcards-exam-inventory.server";
import { normalizeLearnerFlashcardsPathwayQueryId } from "@/lib/flashcards/flashcards-pathway-query";
import { visiblePathwayIdsForAppLessons } from "@/lib/lessons/app-pathway-lesson-list-scope";
import type { FlashcardsHubServerPayload } from "@/lib/flashcards/flashcards-hub-types";

type PageProps = {
  searchParams: Promise<{
    pathwayId?: string | string[];
    alliedProfession?: string | string[];
    topic?: string | string[];
    weakOnly?: string | string[];
  }>;
};

export default async function FlashcardsPage({ searchParams }: PageProps) {
  const { t } = await getLearnerMarketingBundle();
  const sp = await searchParams;

  const rawAllied = sp.alliedProfession;
  const alliedProfessionParam =
    typeof rawAllied === "string" && rawAllied.trim()
      ? rawAllied.trim().toLowerCase()
      : Array.isArray(rawAllied) && typeof rawAllied[0] === "string" && rawAllied[0].trim()
        ? rawAllied[0].trim().toLowerCase()
        : "";
  const alliedProfessionFromQuery = alliedProfessionParam
    ? getAlliedProfessionByProfessionKey(alliedProfessionParam)?.professionKey ?? ""
    : "";

  const rawPid = sp.pathwayId;
  const pathwayQueryRaw =
    typeof rawPid === "string" && rawPid.trim().length > 2
      ? rawPid.trim()
      : Array.isArray(rawPid) && typeof rawPid[0] === "string" && rawPid[0].trim().length > 2
      ? rawPid[0].trim()
      : null;

  const rawTopic = sp.topic;
  const hubTopicFromQuery =
    typeof rawTopic === "string" && rawTopic.trim()
      ? rawTopic.trim().toLowerCase()
      : Array.isArray(rawTopic) && typeof rawTopic[0] === "string" && rawTopic[0].trim()
        ? rawTopic[0].trim().toLowerCase()
        : null;

  const rawWeak = sp.weakOnly;
  const initialWeakOnly =
    (typeof rawWeak === "string" && rawWeak === "1") ||
    (Array.isArray(rawWeak) && rawWeak.some((v) => v === "1"));

  const session = await getProtectedRouteSession("(student).app.(learner).flashcards");
  const userId = (session?.user as { id?: string })?.id ?? "";

  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="nn-card rounded-2xl border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm leading-relaxed text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]">
          {t("learner.entitlement.flashcardsShort")}
        </div>
      </div>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 sm:px-6">
        <div className="nn-learner-page-hero">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)]">{t("learner.flashcards.page.title")}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {t("learner.flashcards.page.subtitle.locked")}
          </p>
        </div>
        <SubscriptionPaywall context="dashboard" />
      </div>
    );
  }

  const requestedPathwayId = pathwayQueryRaw
    ? normalizeLearnerFlashcardsPathwayQueryId(pathwayQueryRaw, entitlement.country)
    : null;

  let pathwayOptions: { id: string; label: string }[] = [];
  let pathwayResolution: ResolvedQuestionBankPathways | null = null;
  let pathwayBootstrapSource: "primary" | "secondary" = "primary";
  let learnerPath: string | null = null;

  if (userId && isDatabaseUrlConfigured()) {
    try {
      const compatible = await listPathwaysCompatibleWithSubscription(entitlement);

      const u = await prisma.user.findUnique({
        where: { id: userId },
        select: { learnerPath: true },
      });

      const lp = u?.learnerPath?.trim() ?? null;
      learnerPath = lp;

      pathwayResolution = resolveSubscribedQuestionBankPathways({
        requestedPathwayId,
        compatible: compatible.map((p) => ({ id: p.id, shortName: p.shortName })),
        learnerPath: lp,
        requireExplicitRequestedPathwayId: true,
      });

      pathwayOptions = compatible.map((p) => ({
        id: p.id,
        label: p.displayName ?? p.shortName,
      }));
    } catch (e) {
      safeServerLog("learner_flashcards", "pathway_bootstrap_primary_failed", {
        user_id: userId.slice(0, 8),
        outcome: "error",
      });

      const snap = await readFlashcardsHubPathwayBootstrapSnapshot({
        tier: String(entitlement.tier ?? ""),
        country: String(entitlement.country ?? ""),
      });

      if (snap?.payload) {
        pathwayBootstrapSource = "secondary";
        pathwayOptions = snap.payload.pathwayOptions;

        pathwayResolution = resolveSubscribedQuestionBankPathways({
          requestedPathwayId,
          compatible: snap.payload.compatibleRows,
          learnerPath: null,
          requireExplicitRequestedPathwayId: true,
        });
      } else {
        return (
          <ContentEmptyState
            variant="generic"
            headline="Could not load flashcard tracks"
            body="We hit an error while loading your subscription pathways."
            primaryCta={{ label: "Retry", href: "/app/flashcards" }}
          />
        );
      }
    }
  }

  if (pathwayResolution?.state === "invalid_requested") {
    return (
      <ContentEmptyState
        variant="generic"
        headline="This study track is not on your account"
        body="Choose an exam you are subscribed to."
        primaryCta={{ label: "Study preferences", href: "/app/account/study-preferences" }}
      />
    );
  }

  if (pathwayResolution?.state === "no_pathway_context") {
    return (
      <div className="space-y-2">
        <LearnerRenderTraceBanner
          data-route="flashcards"
          label="NN_RENDER_TRACE: flashcards live route (pathway picker)"
        />
        <FlashcardsPathwayPickSurface
          title={t("learner.flashcards.page.noPathwayHeadline") ?? t("learner.flashcards.page.title")}
          subtitle={
            t("learner.flashcards.page.noPathwayBody") ??
            "Choose an exam track for flashcards. Your selection is applied via the URL — no redirects."
          }
          pathways={pathwayOptions}
        />
      </div>
    );
  }

  if (pathwayResolution?.state !== "scoped") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm">
        {t("learner.entitlement.flashcardsShort")}
      </div>
    );
  }

  const scopedPathwayId = pathwayResolution.defaultPathwayId;

  const pathwayLessonFlashDiagnostics =
    entitlement.hasAccess && scopedPathwayId
      ? await flashcardLessonVirtualDiagnosticsForPathway(scopedPathwayId, {
          selectedCategories: [],
          filterModeLabel: "all cards",
        })
      : null;

  const catalogPathway = getExamPathwayById(scopedPathwayId);
  const pathwayLabelFromOptions = pathwayOptions.find((p) => p.id === scopedPathwayId)?.label;
  const pathwayDisplayName =
    catalogPathway?.displayName ?? catalogPathway?.shortName ?? pathwayLabelFromOptions ?? scopedPathwayId;

  let initialHub: FlashcardsHubServerPayload | null = null;
  if (userId && isDatabaseUrlConfigured() && entitlement.hasAccess) {
    if (catalogPathway) {
      const inv = await loadFlashcardsExamInventoryForPathway({
        userId,
        entitlement,
        pathway: catalogPathway,
      });
      if (inv.ok) {
        initialHub = {
          categoryOptions: inv.categoryOptions,
          matchingTotal: inv.total,
          lessonVirtualDiagnostics: pathwayLessonFlashDiagnostics,
          poolDiagnostics: inv.diagnostics,
        };
      } else {
        /** Pathway skeleton matches lessons hub even when inventory query fails — avoids empty hub + false client errors. */
        initialHub = {
          categoryOptions: builderCategoryOptionsForPathway(scopedPathwayId),
          matchingTotal: 0,
          lessonVirtualDiagnostics: pathwayLessonFlashDiagnostics,
        };
      }
    } else {
      initialHub = {
        categoryOptions: builderCategoryOptionsForPathway(scopedPathwayId),
        matchingTotal: 0,
        lessonVirtualDiagnostics: pathwayLessonFlashDiagnostics,
      };
    }
  } else if (entitlement.hasAccess) {
    initialHub = {
      categoryOptions: builderCategoryOptionsForPathway(scopedPathwayId),
      matchingTotal: 0,
      lessonVirtualDiagnostics: pathwayLessonFlashDiagnostics,
    };
  }

  const visiblePathwayIds = await visiblePathwayIdsForAppLessons(entitlement, learnerPath);
  let catHref = resolveStudyLoopCatHref({
    authState: "signed_in",
    pathwayId: scopedPathwayId,
    availablePathwayIds: visiblePathwayIds,
    intent: "start",
  });
  const alliedKeyForFlashcards =
    alliedProfessionFromQuery && isAlliedMarketingCorePathwayId(scopedPathwayId) ? alliedProfessionFromQuery : "";
  if (alliedKeyForFlashcards && catHref.includes("/app/practice-tests/cat-launch")) {
    catHref = appPathwayCatSessionStartPath(scopedPathwayId, { alliedProfession: alliedKeyForFlashcards });
  }

  return (
    <div className="space-y-2">
      <LearnerRenderTraceBanner data-route="flashcards" label="NN_RENDER_TRACE: flashcards live route" />
      <Suspense fallback={<div className="p-4">{t("learner.loading.flashcards")}</div>}>
        <FlashcardsHubClient
          scopedPathwayId={scopedPathwayId}
          pathwayDisplayName={pathwayDisplayName}
          pathwayBootstrapSource={pathwayBootstrapSource}
          catHref={catHref}
          initialHub={initialHub}
          initialPoolDiagnostics={initialHub?.poolDiagnostics ?? null}
          lessonsHubHref={`/app/lessons?pathwayId=${encodeURIComponent(scopedPathwayId)}`}
          alliedProfessionKey={alliedKeyForFlashcards || null}
          hubTopicSlug={hubTopicFromQuery}
          initialWeakOnly={initialWeakOnly}
        />
      </Suspense>
    </div>
  );
}