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
import {
  LearnerShellDesktopStudyLinks,
  LearnerShellMobileBottomNav,
  LearnerShellPathwayPill,
} from "@/components/layout/learner-shell-primary-nav";
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
            <div className="nn-learner-exam-chrome-target nn-learner-shell-sticky sticky top-0 z-50 mb-[var(--nn-rhythm-tight-y)] bg-[var(--semantic-bg-base)] pt-1">
              <div className="flex flex-col gap-2">
                <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 shadow-sm sm:px-4 sm:py-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                      <LearnerShellBrandHomeLink />
                      <LearnerShellPathwayPill pathwayPillLabel={pathwayShortLabel} pathwayHubHref={pathwayHubHref} />
                    </div>
                    <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-2.5">
                      <LearnerShellUserBar pathwayShortLabel={pathwayShortLabel} />
                      <UserFeedbackNavPill />
                      <LearnerShellLanguageControl />
                      <LearnerThemeControl />
                    </div>
                  </div>
                </div>
                <div className="nn-learner-shell-nav-row rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-2 shadow-[0_1px_0_0_color-mix(in_srgb,var(--semantic-text-primary)_06%,transparent)] sm:px-3">
                  <LearnerShellDesktopStudyLinks pathwayId={pathwayId} examsLabel={examsLabel} />
                </div>
              </div>
              <LearnerShellMobileBottomNav
                pathwayPillLabel={pathwayShortLabel}
                pathwayId={pathwayId}
                pathwayHubHref={pathwayHubHref}
                examsLabel={examsLabel}
              />
            </div>
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
