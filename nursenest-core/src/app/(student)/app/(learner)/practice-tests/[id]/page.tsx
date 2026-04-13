import Link from "next/link";
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
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { loadStudySettings } from "@/lib/learner/load-study-settings";

type Props = { params: Promise<{ id: string }> };

/** Private learner session — do not index individual test runs. */
export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();
      return {
        robots: { index: false, follow: false },
        title: t("learner.practiceTests.run.metaTitle"),
      };
    },
    { pathname: "/app/practice-tests/[id]", routeGroup: "student.learner.practice_test_run" },
  );
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
  const studySettings = await loadStudySettings(userId);

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
    <main className="pt-2 md:pt-4">
      <ExamSessionErrorBoundary surface="practice_test">
        <PracticeTestRunnerClient
          testId={id}
          userId={userId}
          userLabel={userLabel}
          protectionFlags={protectionFlags}
          studySettings={studySettings}
        />
      </ExamSessionErrorBoundary>
    </main>
  );
}
