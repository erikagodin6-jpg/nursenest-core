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
import {
  hrefForResolvedQuestionBankEntry,
  resolveSubscribedQuestionBankPathways,
  type ResolvedQuestionBankPathways,
} from "@/lib/learner/tier-scoped-study-routes";

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

  let practiceQuestionsHref = "/app/questions";
  let pathwayOptions: { id: string; label: string }[] = [];
  let pathwayResolution: ResolvedQuestionBankPathways | null = null;

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
      practiceQuestionsHref = hrefForResolvedQuestionBankEntry(resolved);

      pathwayOptions = compatible.map((p) => ({ id: p.id, label: p.displayName ?? p.shortName }));
      if (entitlement.tier === TierCode.PRE_NURSING) {
        pathwayOptions = [{ id: "pre-nursing", label: "Pre-Nursing" }, ...pathwayOptions];
      }
    } catch {
      pathwayOptions = [];
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

  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-8 text-sm">{t("learner.loading.flashcards")}</div>}>
      <FlashcardsHubClient
        pathwayOptions={pathwayOptions}
        practiceQuestionsHref={practiceQuestionsHref}
        defaultScopedPathwayId={pathwayResolution?.state === "scoped" ? pathwayResolution.defaultPathwayId : null}
      />
    </Suspense>
  );
}
