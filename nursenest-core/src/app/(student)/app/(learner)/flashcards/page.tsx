import { Suspense } from "react";
import { TierCode } from "@prisma/client";
import { FlashcardsHubClient } from "@/components/flashcards/flashcards-hub-client";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { ContentEmptyState } from "@/components/ui/content-empty-state";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { resolveSubscribedQuestionBankPathways, type ResolvedQuestionBankPathways } from "@/lib/learner/tier-scoped-study-routes";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { readFlashcardsHubPathwayBootstrapSnapshot } from "@/lib/study-content-failover/flashcards-hub-bootstrap-snapshot-read";
import { snapshotAgeMs } from "@/lib/study-content-failover/study-published-snapshot-store";

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
        <p className="text-sm text-muted-foreground">{t("learner.flashcards.page.subtitle.locked")}</p>
        <SubscriptionPaywall context="dashboard" />
      </div>
    );
  }

  let pathwayOptions: { id: string; label: string }[] = [];
  let pathwayResolution: ResolvedQuestionBankPathways | null = null;
  let pathwayBootstrapSource: "primary" | "secondary" = "primary";

  if (userId && isDatabaseUrlConfigured()) {
    try {
      const compatible = await listPathwaysCompatibleWithSubscription(entitlement);
      const u = await prisma.user.findUnique({
        where: { id: userId },
        select: { learnerPath: true },
      });
      const lp = u?.learnerPath?.trim() ?? null;
      const resolved = resolveSubscribedQuestionBankPathways({
        requestedPathwayId,
        compatible: compatible.map((p) => ({ id: p.id, shortName: p.shortName })),
        learnerPath: lp,
      });
      pathwayResolution = resolved;

      pathwayOptions = compatible.map((p) => ({ id: p.id, label: p.displayName ?? p.shortName }));
      if (entitlement.tier === TierCode.PRE_NURSING) {
        pathwayOptions = [{ id: "pre-nursing", label: "Pre-Nursing" }, ...pathwayOptions];
      }
    } catch (e) {
      safeServerLog("learner_flashcards", "pathway_bootstrap_primary_failed", {
        user_id: userId.slice(0, 8),
        outcome: "error",
        error_message: e instanceof Error ? e.message.slice(0, 400) : String(e).slice(0, 400),
      });
      const tier = entitlement.tier != null ? String(entitlement.tier) : "";
      const country = entitlement.country != null ? String(entitlement.country) : "";
      const snap = tier && country ? await readFlashcardsHubPathwayBootstrapSnapshot({ tier, country }) : null;
      if (snap?.payload) {
        pathwayBootstrapSource = "secondary";
        pathwayOptions = snap.payload.pathwayOptions;
        if (entitlement.tier === TierCode.PRE_NURSING) {
          pathwayOptions = [{ id: "pre-nursing", label: "Pre-Nursing" }, ...pathwayOptions];
        }
        pathwayResolution = resolveSubscribedQuestionBankPathways({
          requestedPathwayId,
          compatible: snap.payload.compatibleRows,
          learnerPath: null,
        });
        const age = snapshotAgeMs(snap.capturedAt);
        safeServerLog("learner_flashcards", "study_content_failover", {
          event: "study_content_failover",
          surface: "flashcards_hub_pathway_bootstrap",
          source_used: "secondary",
          failover_reason: "primary_db_failed",
          snapshot_version: snap.version.slice(0, 120),
          snapshot_age_ms: String(Math.round(age)),
          user_id_prefix: userId.slice(0, 8),
        });
      } else {
        return (
          <div className="mx-auto max-w-3xl px-4 py-8">
            <ContentEmptyState
              variant="generic"
              headline="Could not load flashcard tracks"
              body="We hit an error while loading your subscription pathways and no published snapshot is available. Retry in a moment — this is not an empty library."
              primaryCta={{ label: "Retry", href: "/app/flashcards" }}
            />
          </div>
        );
      }
    }
  }

  if (pathwayResolution?.state === "invalid_requested") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <ContentEmptyState
          variant="generic"
          headline="This study track is not on your account"
          body="Choose an exam you are subscribed to in Study preferences, or open Flashcards from your hub with a valid track link."
          primaryCta={{ label: "Study preferences", href: "/app/account/study-preferences" }}
        />
      </div>
    );
  }

  if (pathwayResolution?.state === "no_pathway_context") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <ContentEmptyState
          variant="generic"
          headline={t("learner.flashcards.page.noPathwayHeadline", "Choose your exam track")}
          body={t(
            "learner.flashcards.page.noPathwayBody",
            "Select a pathway in Study preferences so flashcards stay aligned with your subscription.",
          )}
          primaryCta={{ label: t("learner.flashcards.page.studyPreferencesCta", "Study preferences"), href: "/app/account/study-preferences" }}
        />
      </div>
    );
  }

  if (pathwayResolution?.state !== "scoped") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-[var(--theme-muted-text)]">
        {t("learner.entitlement.flashcardsShort")}
      </div>
    );
  }

  const scopedPathwayId = pathwayResolution.defaultPathwayId;
  const pathwayDisplayName =
    pathwayOptions.find((p) => p.id === scopedPathwayId)?.label ?? pathwayResolution.pathwayOptions[0]?.shortName ?? scopedPathwayId;

  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-8 text-sm">{t("learner.loading.flashcards")}</div>}>
      <FlashcardsHubClient
        scopedPathwayId={scopedPathwayId}
        pathwayDisplayName={pathwayDisplayName}
        pathwayBootstrapSource={pathwayBootstrapSource}
      />
    </Suspense>
  );
}
