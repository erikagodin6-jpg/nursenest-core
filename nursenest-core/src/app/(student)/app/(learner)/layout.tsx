import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { LearnerShellUserBar } from "@/components/auth/learner-shell-user-bar";
import { LearnerShellLanguageControl } from "@/components/student/learner-shell-language-control";
import { CheckoutSuccessBanner } from "@/components/student/checkout-success-banner";
import { LearnerExamChromeGate } from "@/components/exam/learner-exam-chrome";
import { LearnerStudyNextBlock } from "@/components/student/learner-study-next-block";
import { LearnerThemeControl } from "@/components/student/learner-theme-control";
import { LearnerAppSectionAnalytics } from "@/components/observability/learner-app-section-analytics";
import { SentryLearnerShell } from "@/components/observability/sentry-learner-shell";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadLearnerStudyNextBlock } from "@/lib/learner/load-learner-study-next-block";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { prisma } from "@/lib/db";
import { resolveDashboardIdentity } from "@/lib/learner/resolve-dashboard-identity";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { userShouldSeeBaselinePrompt } from "@/lib/baseline/baseline-assessment";
import { BaselineAssessmentPrompt } from "@/components/student/baseline-assessment-prompt";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";
import { LearnerShellPrimaryNav } from "@/components/layout/learner-shell-primary-nav";
import { LearnerShellBrandHomeLink } from "@/components/student/learner-shell-brand-home-link";
import { LearnerUnauthenticatedGate } from "@/components/student/learner-unauthenticated-gate";
import {
  PageTransitionShell,
  learnerShellShouldDisablePageTransition,
} from "@/lib/motion/page-transition-shell";

/** Auth is enforced in `src/proxy.ts` (Next.js 16+) so this layout never calls `redirect()` for missing session. Locale + i18n: `app/(student)/app/layout.tsx`. */
export const dynamic = "force-dynamic";

export default async function LearnerShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";

  let studyNextBlock = null;
  let showBaselinePrompt = false;
  let pathwayShortLabel: string | null = null;
  if (userId) {
    const ent = await resolveEntitlementForPage(userId);
    if (ent !== "error" && ent.hasAccess) {
      studyNextBlock = await loadLearnerStudyNextBlock(userId, ent);
    }
    if (isDatabaseUrlConfigured()) {
      try {
        const u = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            baselineAssessmentSkippedAt: true,
            baselineAssessmentCompletedAt: true,
            learnerPath: true,
            alliedProfessionKey: true,
          },
        });
        showBaselinePrompt = u != null && userShouldSeeBaselinePrompt(u);
        const lp = u?.learnerPath?.trim();
        if (lp) {
          const p = getExamPathwayById(lp);
          pathwayShortLabel = p ? p.shortName || p.displayName : lp.slice(0, 48);
        } else if (u?.alliedProfessionKey) {
          // Allied users don't have a learnerPath; derive label from career identity
          const identity = resolveDashboardIdentity({
            tier: (session?.user as { tier?: string })?.tier,
            learnerPathId: null,
            alliedProfessionKey: u.alliedProfessionKey,
          });
          pathwayShortLabel = identity.pill;
        }
      } catch {
        showBaselinePrompt = false;
      }
    }
  }

  if (!userId) {
    return <LearnerUnauthenticatedGate />;
  }

  return (
    <SentryLearnerShell userId={userId}>
      <LearnerExamChromeGate>
        <div className="nn-learner-app mx-auto w-full max-w-6xl px-4 py-[var(--nn-rhythm-shell-y)] sm:px-6">
          <PathwayLessonProgressRefreshListener />
          <LearnerAppSectionAnalytics />
          <header className="nn-learner-exam-chrome-target nn-card mb-[var(--nn-rhythm-tight-y)] flex min-h-14 flex-col gap-3 rounded-2xl p-3 sm:gap-4 lg:min-h-16 lg:flex-row lg:items-center lg:justify-between lg:p-4">
            <div className="flex min-w-0 flex-wrap items-center gap-3 md:gap-4">
              <LearnerShellBrandHomeLink />
              <LearnerShellPrimaryNav />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <LearnerShellUserBar pathwayShortLabel={pathwayShortLabel} />
              <LearnerShellLanguageControl />
              <LearnerThemeControl />
            </div>
          </header>
          {studyNextBlock ? (
            <div className="nn-learner-exam-chrome-dim mb-[var(--nn-rhythm-tight-y)]">
              <Suspense
                fallback={
                  <div
                    className="min-h-[10rem] rounded-xl border border-[var(--nn-presentation-divider)] bg-[var(--nn-presentation-wash)]"
                    aria-hidden
                  />
                }
              >
                <LearnerStudyNextBlock model={studyNextBlock} />
              </Suspense>
            </div>
          ) : null}
          <div className="nn-learner-exam-chrome-dim">
            <CheckoutSuccessBanner />
          </div>
          <BaselineAssessmentPrompt show={showBaselinePrompt} />
          <PageTransitionShell shouldDisableTransition={learnerShellShouldDisablePageTransition}>
            {children}
          </PageTransitionShell>
        </div>
      </LearnerExamChromeGate>
    </SentryLearnerShell>
  );
}
