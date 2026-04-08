import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { ExamSessionErrorBoundary } from "@/components/exam/exam-session-error-boundary";
import { PracticeTestRunnerClient } from "@/components/student/practice-test-runner-client";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { auth } from "@/lib/auth";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getServerPremiumProtectionFlags } from "@/lib/premium-protection/config";
import { maskUserLabelForWatermark } from "@/lib/premium-protection/mask-user-label";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

/** Private learner session — do not index individual test runs. */
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLearnerMarketingBundle();
  return {
    robots: { index: false, follow: false },
    title: t("learner.practiceTests.run.metaTitle"),
  };
}

export default async function PracticeTestRunPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const { t } = await getLearnerMarketingBundle();

  if (entitlement === "error") {
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <p className="nn-card p-6 text-sm text-muted">{t("learner.entitlement.verifyFailed")}</p>
      </main>
    );
  }

  const email = (session?.user as { email?: string | null })?.email ?? null;
  const protectionFlags = getServerPremiumProtectionFlags();
  const userLabel = maskUserLabelForWatermark(email, userId || "unknown");

  if (!entitlement.hasAccess) {
    const snap = userId ? await getFreemiumSnapshot(userId) : null;
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <h1 className="text-2xl font-bold">{t("learner.practiceTests.run.title")}</h1>
        <p className="mt-2 text-sm text-muted">{t("learner.practiceTests.run.subtitleLocked")}</p>
        <div className="mt-6">
          <SubscriptionPaywall context="questions" freemiumRemainingQuestions={snap?.questionRemaining ?? 0} />
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="mb-4">
        <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
      </div>
      <h1 className="text-2xl font-bold">{t("learner.practiceTests.run.title")}</h1>
      <p className="mt-1 text-sm text-muted">
        <a className="font-medium text-primary underline" href="/app/practice-tests">
          {t("learner.practiceTests.run.backToBank")}
        </a>
      </p>
      <div className="mt-6">
        <ExamSessionErrorBoundary surface="practice_test">
          <PracticeTestRunnerClient
            testId={id}
            userId={userId}
            userLabel={userLabel}
            protectionFlags={protectionFlags}
          />
        </ExamSessionErrorBoundary>
      </div>
    </main>
  );
}
