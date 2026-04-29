import { Suspense } from "react";
import { TierCode } from "@prisma/client";
import { LearnerRenderTraceBanner } from "@/components/dev/learner-render-trace-banner";
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
import { buildFlashcardCustomSession } from "@/lib/flashcards/build-flashcard-custom-session";
import { parseCustomSessionSourceKind } from "@/lib/flashcards/custom-session-card-filters";
import { visiblePathwayIdsForAppLessons } from "@/lib/lessons/app-pathway-lesson-list-scope";
import type { FlashcardsHubServerPayload } from "@/lib/flashcards/flashcards-hub-types";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export default async function FlashcardsPage({ searchParams }: PageProps) {
  const { t } = await getLearnerMarketingBundle();
  const sp = await searchParams;

  const rawPid = sp.pathwayId;
  const requestedPathwayId =
    typeof rawPid === "string" && rawPid.trim().length > 2
      ? rawPid.trim()
      : Array.isArray(rawPid) && typeof rawPid[0] === "string" && rawPid[0].trim().length > 2
      ? rawPid[0].trim()
      : null;

  const session = await getProtectedRouteSession("(student).app.(learner).flashcards");
  const userId = (session?.user as { id?: string })?.id ?? "";

  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-[var(--theme-muted-text)]">
        {t("learner.entitlement.flashcardsShort")}
      </div>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{t("learner.flashcards.page.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("learner.flashcards.page.subtitle.locked")}
        </p>
        <SubscriptionPaywall context="dashboard" />
      </div>
    );
  }

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
      });

      pathwayOptions = compatible.map((p) => ({
        id: p.id,
        label: p.displayName ?? p.shortName,
      }));

      if (entitlement.tier === TierCode.PRE_NURSING) {
        pathwayOptions = [{ id: "pre-nursing", label: "Pre-Nursing" }, ...pathwayOptions];
      }
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

  const catalogPathway = getExamPathwayById(scopedPathwayId);
  const pathwayLabelFromOptions = pathwayOptions.find((p) => p.id === scopedPathwayId)?.label;
  const pathwayDisplayName =
    catalogPathway?.displayName ?? catalogPathway?.shortName ?? pathwayLabelFromOptions ?? scopedPathwayId;

  let initialHub: FlashcardsHubServerPayload | null = null;
  if (userId && isDatabaseUrlConfigured() && entitlement.hasAccess) {
    const inv = await buildFlashcardCustomSession({
      userId,
      entitlement,
      pathwayId: scopedPathwayId,
      selectedCategories: [],
      stateIds: [],
      weakOnly: false,
      incorrectOnly: false,
      starredOnly: false,
      savedOnly: false,
      notesOnly: false,
      revisitOnly: false,
      notStudiedOnly: false,
      recentStudiedOnly: false,
      recentDays: 7,
      shuffle: false,
      mode: "mixed",
      limit: 20,
      includeCards: false,
      sourceKind: parseCustomSessionSourceKind("all"),
      sessionSeed: null,
      cardLimitRaw: "20",
    });
    if (inv.ok) {
      initialHub = { categoryOptions: inv.categoryOptions, matchingTotal: inv.summary.matchingCards };
    }
  }

  const visiblePathwayIds = await visiblePathwayIdsForAppLessons(entitlement, learnerPath);
  const catHref = resolveStudyLoopCatHref({
    authState: "signed_in",
    pathwayId: scopedPathwayId,
    availablePathwayIds: visiblePathwayIds,
    intent: "start",
  });

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
          lessonsHubHref={`/app/lessons?pathwayId=${encodeURIComponent(scopedPathwayId)}`}
        />
      </Suspense>
    </div>
  );
}