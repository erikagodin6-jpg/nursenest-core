import Link from "next/link";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { auth } from "@/lib/auth";
import { LearnerShellUserBar } from "@/components/auth/learner-shell-user-bar";
import { CheckoutSuccessBanner } from "@/components/student/checkout-success-banner";
import { LearnerExamChromeGate } from "@/components/exam/learner-exam-chrome";
import { LearnerAdaptiveStrip } from "@/components/student/learner-adaptive-strip";
import { LearnerThemeControl } from "@/components/student/learner-theme-control";
import { LearnerAppSectionAnalytics } from "@/components/observability/learner-app-section-analytics";
import { SentryLearnerShell } from "@/components/observability/sentry-learner-shell";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loadLearnerAdaptiveStrip } from "@/lib/learner/load-learner-adaptive-strip";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { userShouldSeeBaselinePrompt } from "@/lib/baseline/baseline-assessment";
import { BaselineAssessmentPrompt } from "@/components/student/baseline-assessment-prompt";

/** Auth is enforced in `src/proxy.ts` (Next.js 16+) so this layout never calls `redirect()` for missing session. */
export const dynamic = "force-dynamic";

export default async function LearnerShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";

  let adaptiveStrip = null;
  let showBaselinePrompt = false;
  if (userId) {
    const ent = await resolveEntitlementForPage(userId);
    if (ent !== "error" && ent.hasAccess) {
      adaptiveStrip = await loadLearnerAdaptiveStrip(userId, ent);
    }
    if (isDatabaseUrlConfigured()) {
      try {
        const u = await prisma.user.findUnique({
          where: { id: userId },
          select: { baselineAssessmentSkippedAt: true, baselineAssessmentCompletedAt: true },
        });
        showBaselinePrompt = u != null && userShouldSeeBaselinePrompt(u);
      } catch {
        showBaselinePrompt = false;
      }
    }
  }

  if (!userId) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <Link href="/" className="mb-6 inline-flex overflow-visible" aria-label="NurseNest home">
          <SiteBrandLogoMark />
        </Link>
        <p className="text-sm text-[var(--theme-muted-text)]">
          <Link className="font-medium text-primary underline" href="/login">
            Sign in
          </Link>{" "}
          to access the learner app.
        </p>
      </div>
    );
  }

  return (
    <SentryLearnerShell userId={userId}>
    <LearnerExamChromeGate>
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <LearnerAppSectionAnalytics />
      <header className="nn-learner-exam-chrome-target nn-card mb-6 flex flex-col gap-4 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-4">
          <Link href="/" className="inline-flex shrink-0 overflow-visible">
            <SiteBrandLogoMark />
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium">
          <Link className="rounded-full border border-primary/15 bg-primary/8 px-3 py-2 text-primary" href="/app">
            Dashboard
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/app/lessons">
            Lessons
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/app/questions">
            Question Bank
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/app/practice-tests">
            Practice tests
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/app/exams">
            Practice Exams
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/app/study-plan">
            Study plan
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/app/flashcards">
            Flashcards
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/blog">
            Blog
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/tools">
            Clinical tools
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/case-studies">
            Case studies
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/pricing">
            Plans
          </Link>
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LearnerShellUserBar />
          <LearnerThemeControl />
        </div>
      </header>
      {adaptiveStrip ? (
        <div className="nn-learner-exam-chrome-dim mb-4">
          <LearnerAdaptiveStrip model={adaptiveStrip} />
        </div>
      ) : null}
      <div className="nn-learner-exam-chrome-dim">
        <CheckoutSuccessBanner />
      </div>
      <BaselineAssessmentPrompt show={showBaselinePrompt} />
      {children}
    </div>
    </LearnerExamChromeGate>
    </SentryLearnerShell>
  );
}
