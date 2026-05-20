import Link from "next/link";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { ExamSessionErrorBoundary } from "@/components/exam/exam-session-error-boundary";
import { PracticeTestRunnerClient } from "@/components/student/practice-test-runner-client";
import { NclexCatRunner } from "@/components/exam/nclex-cat-runner";
import { NclexPracticeRunner } from "@/components/exam/nclex-practice-runner";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getServerPremiumProtectionFlags } from "@/lib/premium-protection/config";
import { maskUserLabelForWatermark } from "@/lib/premium-protection/mask-user-label";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import type { Metadata } from "next";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { loadStudySettings } from "@/lib/learner/load-study-settings";
import { isAdaptiveLearningEnabled } from "@/lib/learner/adaptive-learning-env";
import { prisma } from "@/lib/db";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  pathwayUsesLoftNclexExamPresentation,
} from "@/lib/practice-tests/premium-exam-shell-pathways";
import {
  practiceTestConfigRecord,
  resolvePremiumNclexShellRoute,
} from "@/lib/practice-tests/resolve-premium-nclex-shell-route";
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
          <LearnerBreadcrumbTrail kind="practice-tests" pathname="/app/practice-tests" />
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
  let nclexShellMode: "cat" | "practice" | null = null;
  let nclexShellPresentation: "standard" | "loft" = "standard";
  let pathwayLabelForShell: string | null = null;

  if (userId && id.length >= 8) {
    const row = await prisma.practiceTest.findFirst({
      where: { id, userId },
      select: { config: true },
    });
    const parsed = practiceTestConfigRecord(row?.config);
    const pathwayId = parsed?.pathwayId ?? "";

    if (parsed) {
      nclexShellMode = resolvePremiumNclexShellRoute({
        config: parsed.config,
        pathwayId,
      });
      if (nclexShellMode && pathwayUsesLoftNclexExamPresentation(pathwayId)) {
        nclexShellPresentation = "loft";
      }
    }

    if (pathwayId) {
      const p = getExamPathwayById(pathwayId);
      if (p) {
        pathwayLabelForShell = p.shortName ?? null;
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
          <LearnerBreadcrumbTrail kind="practice-tests" pathname="/app/practice-tests" />
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

  if (nclexShellMode === "cat") {
    return (
      <ExamSessionErrorBoundary surface="practice_test">
        <NclexCatRunner
          testId={id}
          userId={userId}
          pathwayLabel={pathwayLabelForShell}
        />
      </ExamSessionErrorBoundary>
    );
  }

  if (nclexShellMode === "practice") {
    return (
      <ExamSessionErrorBoundary surface="practice_test">
        <NclexPracticeRunner
          testId={id}
          userId={userId}
          pathwayLabel={pathwayLabelForShell}
          shellPresentation={nclexShellPresentation}
        />
      </ExamSessionErrorBoundary>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:min-h-0">
      <ExamSessionErrorBoundary surface="practice_test">
        <PracticeTestRunnerClient
          testId={id}
          userId={userId}
          userLabel={userLabel}
          protectionFlags={protectionFlags}
          studySettings={studySettings}
          initialPathwaySurface={initialPathwaySurface}
          adaptiveLearningEnabled={isAdaptiveLearningEnabled()}
        />
      </ExamSessionErrorBoundary>
    </div>
  );
}
