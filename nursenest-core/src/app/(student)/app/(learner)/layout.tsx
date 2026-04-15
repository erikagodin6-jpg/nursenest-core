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
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { prisma } from "@/lib/db";
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
import { isLearnerTutorShellEnabled } from "@/lib/learner/tutor/learner-tutor-policy";
import { LearnerTutorShell } from "@/components/learner-tutor";
import { LearnerFeedbackShell } from "@/components/feedback/learner-feedback-shell";
import { UserFeedbackNavPill } from "@/components/feedback/user-feedback-nav-pill";
import { LearnerExamStudyProviders } from "@/components/exam/learner-exam-study-providers";

/** Auth is enforced in `src/proxy.ts` (Next.js 16+) so this layout never calls `redirect()` for missing session. Locale + i18n: `app/(student)/app/layout.tsx`. */
export const dynamic = "force-dynamic";

function pillLabelForRoleTrack(roleTrack: string): string {
  if (roleTrack === "rn") return "RN";
  if (roleTrack === "lpn" || roleTrack === "rpn") return "PN";
  if (roleTrack === "np") return "NP";
  if (roleTrack === "allied") return "Allied";
  return "Pathway";
}

export default async function LearnerShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";

  let studyNextBlock = null;
  let showBaselinePrompt = false;
  let pathwayShortLabel: string | null = null;
  let pathwayId: string | null = null;
  let pathwayHubHref: string | null = null;
  let examsLabel: "CAT Exams" | "Exams" = "Exams";
  let entitlement: Awaited<ReturnType<typeof resolveEntitlementForPage>> = "error";

  if (userId) {
    entitlement = await resolveEntitlementForPage(userId);
    if (entitlement !== "error" && entitlement.hasAccess) {
      studyNextBlock = await loadLearnerStudyNextBlock(userId, entitlement);
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
        pathwayId = lp && lp.length > 0 ? lp : null;
        if (lp) {
          const p = getExamPathwayById(lp);
          pathwayShortLabel = p ? pillLabelForRoleTrack(p.roleTrack) : lp.slice(0, 48);
          if (p) {
            pathwayHubHref = buildExamPathwayPath(p);
            if (p.roleTrack === "rn" || p.roleTrack === "rpn" || p.roleTrack === "lpn" || p.roleTrack === "np") {
              examsLabel = "CAT Exams";
            }
          }
        } else if (u?.alliedProfessionKey) {
          // Allied users don't always have a learnerPath.
          pathwayShortLabel = "Allied";
          pathwayHubHref = "/us/allied/allied-health";
        }
      } catch {
        showBaselinePrompt = false;
      }
    }
  }

  if (!pathwayHubHref) {
    const tier = ((session?.user as { tier?: string | null })?.tier ?? "").toUpperCase();
    if (tier === "RN") {
      pathwayHubHref = "/us/rn/nclex-rn";
      examsLabel = "CAT Exams";
    } else if (tier === "RPN") {
      pathwayHubHref = "/canada/rpn/rex-pn";
      examsLabel = "CAT Exams";
    } else if (tier === "LVN_LPN") {
      pathwayHubHref = "/us/lpn/nclex-pn";
      examsLabel = "CAT Exams";
    } else if (tier === "NP") {
      pathwayHubHref = "/us/np/fnp";
      examsLabel = "CAT Exams";
    } else if (tier === "ALLIED") pathwayHubHref = "/us/allied/allied-health";
  }

  if (!userId) {
    return <LearnerUnauthenticatedGate />;
  }

  const tutorContext =
    entitlement !== "error" && entitlement.hasAccess && isLearnerTutorShellEnabled()
      ? { pathwayId, pathwayLabel: pathwayShortLabel }
      : null;

  return (
    <SentryLearnerShell userId={userId}>
      <LearnerExamStudyProviders>
        <LearnerExamChromeGate>
          <LearnerFeedbackShell pathwayId={pathwayId}>
            <div className="nn-learner-app mx-auto w-full max-w-6xl px-4 pt-[var(--nn-rhythm-shell-y)] pb-[calc(var(--nn-rhythm-shell-y)+5rem+env(safe-area-inset-bottom,0px))] sm:px-6 md:pb-[var(--nn-rhythm-shell-y)]">
            <PathwayLessonProgressRefreshListener />
            <LearnerAppSectionAnalytics />
            <header className="nn-learner-exam-chrome-target nn-card mb-[var(--nn-rhythm-tight-y)] flex min-h-14 flex-col gap-3 rounded-2xl p-3 sm:gap-4 lg:min-h-16 lg:flex-row lg:items-center lg:justify-between lg:p-4">
              <div className="flex min-w-0 flex-wrap items-center gap-3 md:gap-4">
                <LearnerShellBrandHomeLink />
                <LearnerShellPrimaryNav
                  hasActiveSubscription={entitlement !== "error" && entitlement.hasAccess}
                  pathwayPillLabel={pathwayShortLabel}
                  pathwayId={pathwayId}
                  pathwayHubHref={pathwayHubHref}
                  examsLabel={examsLabel}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <LearnerShellUserBar pathwayShortLabel={pathwayShortLabel} />
                <UserFeedbackNavPill />
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
            {tutorContext ? <LearnerTutorShell context={tutorContext} /> : null}
            </div>
          </LearnerFeedbackShell>
        </LearnerExamChromeGate>
      </LearnerExamStudyProviders>
    </SentryLearnerShell>
  );
}
