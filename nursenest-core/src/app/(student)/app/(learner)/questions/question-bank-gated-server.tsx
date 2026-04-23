import { Suspense } from "react";
import Link from "next/link";
import { FreemiumCrossTrackNudge } from "@/components/student/freemium-cross-track-nudge";
import { FreemiumPreviewExhaustedSurface } from "@/components/student/freemium-preview-exhausted-surface";
import { FreemiumQuestionPeek } from "@/components/student/freemium-question-peek";
import { PracticeExamLauncherClient } from "@/components/student/practice-exam-launcher-client";
import { QuestionBankPracticeClient } from "@/components/student/question-bank-practice-client";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { freemiumLessonsExhausted, freemiumQuestionsExhausted } from "@/lib/conversion/freemium-gates";
import { loadStudySettings } from "@/lib/learner/load-study-settings";
import { maskUserLabelForWatermark } from "@/lib/premium-protection/mask-user-label";
import { getServerPremiumProtectionFlags } from "@/lib/premium-protection/config";
import { resolveSubscribedQuestionBankPathways } from "@/lib/learner/tier-scoped-study-routes";

type SearchParams = Promise<{ pathwayId?: string | string[] }>;

export async function QuestionBankGatedEntry({
  searchParams,
  variant,
}: {
  searchParams: SearchParams;
  variant: "launcher" | "bank";
}) {
  const { t } = await getLearnerMarketingBundle();
  const sp = await searchParams;
  const rawPid = sp.pathwayId;
  const requestedPathwayId =
    typeof rawPid === "string" && rawPid.trim().length > 2
      ? rawPid.trim()
      : Array.isArray(rawPid) && typeof rawPid[0] === "string" && rawPid[0].trim().length > 2
        ? rawPid[0].trim()
        : null;

  const session = await getProtectedRouteSession("(student).app.(learner).questions");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <PremiumEmptyState
        headline={t("learner.questions.title")}
        body={t("learner.entitlement.verifyFailed")}
        tone="default"
        primaryCta={{ label: t("learner.dashboard.openAccountHub"), href: "/app/account", variant: "primary" }}
        secondaryCtas={[{ label: t("nav.lessons"), href: "/app/lessons", variant: "secondary" }]}
        visualLayout="stack"
        ctaLayout="stack"
      />
    );
  }

  let defaultPathwayId: string | null = null;
  let pathwayOptions: { id: string; label: string }[] = [];
  const pathwayExamKeysByPathwayId: Record<string, string[]> = {};
  const pathwayCountryByPathwayId: Record<string, string> = {};
  if (userId && entitlement.hasAccess && isDatabaseUrlConfigured()) {
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

      if (resolved.state === "invalid_requested") {
        return (
          <PremiumEmptyState
            headline={t("learner.questions.title")}
            body="The exam track in the address is not included on your current plan. Use a hub link for your track, or choose an exam in study preferences."
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
        );
      }

      if (resolved.state === "no_pathway_context") {
        return (
          <PremiumEmptyState
            headline={t("learner.questions.title")}
            body="Choose your exam track in study preferences so practice questions stay scoped to one pathway."
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
        );
      }

      const scopedIds = new Set(resolved.pathwayOptions.map((p) => p.id));
      const scopedRows = compatible.filter((p) => scopedIds.has(p.id));
      pathwayOptions = resolved.pathwayOptions.map((p) => ({ id: p.id, label: p.shortName }));
      defaultPathwayId = resolved.defaultPathwayId;
      for (const p of scopedRows) {
        pathwayExamKeysByPathwayId[p.id] = [...p.contentExamKeys];
        pathwayCountryByPathwayId[p.id] = String(p.countryCode);
      }
    } catch {
      /* optional */
    }
  }

  if (!entitlement.hasAccess) {
    const snap = userId ? await getFreemiumSnapshot(userId) : null;
    return (
      <div className="space-y-6">
        <div className="nn-learner-page-hero">
          <h1 className="text-3xl font-bold text-[var(--semantic-text-primary)]">{t("learner.questions.title")}</h1>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("learner.questions.subtitle.locked")}</p>
        </div>
        {userId && snap && !freemiumQuestionsExhausted(snap) ? (
          <div className="mt-6">
            <FreemiumQuestionPeek />
          </div>
        ) : null}
        <div className="mt-6">
          <SubscriptionPaywall
            context="questions"
            freemiumRemainingQuestions={snap != null ? snap.questionRemaining : undefined}
            freemiumRemainingLessons={snap != null ? snap.lessonRemaining : undefined}
          />
        </div>
        {userId && snap && freemiumLessonsExhausted(snap) && !freemiumQuestionsExhausted(snap) ? (
          <FreemiumCrossTrackNudge variant="lessons_exhausted" />
        ) : null}
        {userId && snap && freemiumQuestionsExhausted(snap) ? <FreemiumPreviewExhaustedSurface kind="questions" /> : null}
      </div>
    );
  }

  const email = (session?.user as { email?: string | null })?.email ?? null;
  const protectionFlags = getServerPremiumProtectionFlags();
  const userLabel = maskUserLabelForWatermark(email, userId || "unknown");
  const studySettings = userId ? await loadStudySettings(userId) : null;

  if (variant === "launcher") {
    return (
      <div className="space-y-6">
        {userId ? (
          <Suspense
            fallback={
              <div
                role="status"
                aria-busy="true"
                aria-live="polite"
                className="flex min-h-[8rem] items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-6"
              >
                <p className="text-sm text-[var(--semantic-text-secondary)]">{t("learner.loading.questionBank")}</p>
              </div>
            }
          >
            <PracticeExamLauncherClient pathwayId={defaultPathwayId} />
          </Suspense>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--semantic-text-primary)] sm:text-2xl">Question bank</h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
            Filters, presets, and topic rollups for power users. For a quick session, use the{" "}
            <Link href="/app/questions" className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">
              practice exam launcher
            </Link>
            .
          </p>
        </div>
      </div>
      {userId && studySettings ? (
        <section className="nn-card space-y-4 p-6" aria-labelledby="nn-question-bank-classic-heading">
          <h2 id="nn-question-bank-classic-heading" className="sr-only">
            Question bank filters and session
          </h2>
          <Suspense
            fallback={
              <div
                role="status"
                aria-busy="true"
                aria-live="polite"
                className="flex min-h-[12rem] items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-8"
              >
                <p className="text-sm text-[var(--semantic-text-secondary)]">{t("learner.loading.questionBank")}</p>
              </div>
            }
          >
            <QuestionBankPracticeClient
              userId={userId}
              userLabel={userLabel}
              protectionFlags={protectionFlags}
              pathwayOptions={pathwayOptions}
              defaultPathwayId={defaultPathwayId}
              pathwayExamKeysByPathwayId={pathwayExamKeysByPathwayId}
              pathwayCountryByPathwayId={pathwayCountryByPathwayId}
              studySettings={studySettings}
            />
          </Suspense>
        </section>
      ) : null}
    </div>
  );
}
