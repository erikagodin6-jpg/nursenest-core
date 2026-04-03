import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { LearnerShellUserBar } from "@/components/auth/learner-shell-user-bar";
import { LearnerShellLanguageControl } from "@/components/student/learner-shell-language-control";
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
import {
  MARKETING_LOCALE_COOKIE,
  normalizePreferredMarketingLocale,
} from "@/lib/i18n/marketing-locale-cookie";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { LearnerShellPrimaryNav } from "@/components/layout/learner-shell-primary-nav";
import { LearnerShellBrandHomeLink } from "@/components/student/learner-shell-brand-home-link";
import { LearnerUnauthenticatedGate } from "@/components/student/learner-unauthenticated-gate";

/** Auth is enforced in `src/proxy.ts` (Next.js 16+) so this layout never calls `redirect()` for missing session. */
export const dynamic = "force-dynamic";

async function learnerMarketingBundle() {
  const jar = await cookies();
  const locale = normalizePreferredMarketingLocale(jar.get(MARKETING_LOCALE_COOKIE)?.value);
  const messages = await loadMarketingMessages(locale);
  return { locale, messages };
}

export default async function LearnerShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const { locale, messages } = await learnerMarketingBundle();

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
      <MarketingI18nProvider locale={locale} messages={messages}>
        <LearnerUnauthenticatedGate />
      </MarketingI18nProvider>
    );
  }

  return (
    <MarketingI18nProvider locale={locale} messages={messages}>
      <SentryLearnerShell userId={userId}>
        <LearnerExamChromeGate>
          <div className="mx-auto w-full max-w-6xl px-6 py-8">
            <LearnerAppSectionAnalytics />
            <header className="nn-learner-exam-chrome-target nn-card mb-6 flex flex-col gap-4 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 flex-wrap items-center gap-4">
                <LearnerShellBrandHomeLink />
                <LearnerShellPrimaryNav messages={messages} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <LearnerShellUserBar />
                <LearnerShellLanguageControl />
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
    </MarketingI18nProvider>
  );
}
