import { Suspense } from "react";
import { FreemiumCrossTrackNudge } from "@/components/student/freemium-cross-track-nudge";
import { FreemiumPreviewExhaustedSurface } from "@/components/student/freemium-preview-exhausted-surface";
import { FreemiumQuestionPeek } from "@/components/student/freemium-question-peek";
import { QuestionBankPracticeClient } from "@/components/student/question-bank-practice-client";
import { QuestionBankPracticeSetupClient } from "@/components/student/question-bank-practice-setup-client";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { auth } from "@/lib/auth";
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

export default async function QuestionBankPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <PremiumEmptyState
        headline={t("learner.questions.title")}
        body={t("learner.entitlement.verifyFailed")}
        tone="default"
        primaryCta={{ label: t("learner.dashboard.openAccountHub"), href: "/app/account/overview", variant: "primary" }}
        secondaryCtas={[{ label: t("nav.lessons"), href: "/app/lessons", variant: "secondary" }]}
        visualLayout="stack"
        ctaLayout="stack"
      />
    );
  }

  let defaultPathwayId: string | null = null;
  let pathwayOptions: { id: string; label: string }[] = [];
  let pathwayExamKeysByPathwayId: Record<string, string[]> = {};
  let pathwayCountryByPathwayId: Record<string, string> = {};
  if (userId && entitlement.hasAccess && isDatabaseUrlConfigured()) {
    try {
      const compatible = listPathwaysCompatibleWithSubscription(entitlement);
      pathwayOptions = compatible.map((p) => ({ id: p.id, label: p.shortName }));
      for (const p of compatible) {
        pathwayExamKeysByPathwayId[p.id] = [...p.contentExamKeys];
        pathwayCountryByPathwayId[p.id] = String(p.countryCode);
      }
      const u = await prisma.user.findUnique({
        where: { id: userId },
        select: { learnerPath: true },
      });
      const lp = u?.learnerPath?.trim();
      defaultPathwayId =
        lp && compatible.some((pathway) => pathway.id === lp) ? lp : (compatible[0]?.id ?? null);
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
          <QuestionBankPracticeSetupClient pathwayId={defaultPathwayId} />
        </Suspense>
      ) : null}

      {userId && studySettings ? (
        <section
          className="nn-card space-y-4 p-6"
          aria-labelledby="nn-question-bank-classic-heading"
        >
          <div className="space-y-1">
            <h2
              id="nn-question-bank-classic-heading"
              className="text-xl font-bold text-[var(--semantic-text-primary)]"
            >
              Question bank
            </h2>
            <p className="text-sm text-[var(--semantic-text-secondary)]">
              Filters, study vs exam-style delivery, presets, and topic rollups—restored from the legacy test-bank
              interaction model on current NurseNest themes.
            </p>
          </div>
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
