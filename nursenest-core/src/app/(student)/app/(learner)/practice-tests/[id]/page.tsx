import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { ExamSessionErrorBoundary } from "@/components/exam/exam-session-error-boundary";
import { PracticeTestRunnerClient } from "@/components/student/practice-test-runner-client";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getServerPremiumProtectionFlags } from "@/lib/premium-protection/config";
import { maskUserLabelForWatermark } from "@/lib/premium-protection/mask-user-label";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import type { Metadata } from "next";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { loadStudySettings } from "@/lib/learner/load-study-settings";
import { prisma } from "@/lib/db";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";

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
  const session = await getProtectedRouteSession("(student).app.(learner).practice-tests.[id]");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const { t } = await getLearnerMarketingBundle();

  if (entitlement === "error") {
    return (
      <div>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <p className="nn-card p-6 text-sm text-muted">{t("learner.entitlement.verifyFailed")}</p>
      </div>
    );
  }

  const email = (session?.user as { email?: string | null })?.email ?? null;
  const protectionFlags = getServerPremiumProtectionFlags();
  const userLabel = maskUserLabelForWatermark(email, userId || "unknown");
  const studySettings = await loadStudySettings(userId);

  let initialPathwaySurface: PracticeTestPathwayClientShell | null = null;
  if (userId && id.length >= 8) {
    const row = await prisma.practiceTest.findFirst({
      where: { id, userId },
      select: { config: true },
    });
    const raw = row?.config;
    const pathwayId =
      raw && typeof raw === "object" && !Array.isArray(raw) && typeof (raw as Record<string, unknown>).pathwayId === "string"
        ? String((raw as Record<string, unknown>).pathwayId).trim()
        : "";
    if (pathwayId) {
      const p = getExamPathwayById(pathwayId);
      if (p) {
        initialPathwaySurface = {
          id: p.id,
          countrySlug: p.countrySlug,
          roleTrack: p.roleTrack,
          examCode: p.examCode,
          shortName: p.shortName,
          examFamily: p.examFamily,
        };
      }
    }
  }

  if (!entitlement.hasAccess) {
    const snap = userId ? await getFreemiumSnapshot(userId) : null;
    return (
      <div>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <h1 className="text-2xl font-bold">{t("learner.practiceTests.run.title")}</h1>
        <p className="mt-2 text-sm text-muted">{t("learner.practiceTests.run.subtitleLocked")}</p>
        <div className="mt-6">
          <SubscriptionPaywall
            context="questions"
            freemiumRemainingQuestions={snap != null ? snap.questionRemaining : undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2 md:pt-4">
      <ExamSessionErrorBoundary surface="practice_test">
        <PracticeTestRunnerClient
          testId={id}
          userId={userId}
          userLabel={userLabel}
          protectionFlags={protectionFlags}
          studySettings={studySettings}
          initialPathwaySurface={initialPathwaySurface}
        />
      </ExamSessionErrorBoundary>
    </div>
  );
}
