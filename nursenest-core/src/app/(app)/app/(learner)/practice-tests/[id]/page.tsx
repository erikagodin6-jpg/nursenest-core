import Link from "next/link";
import type { Metadata } from "next";

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

type Props = {
  params: Promise<{ id: string }>;
};

/** Private learner session — never index individual runs. */
export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const { t } = await getLearnerMarketingBundle();

      return {
        robots: {
          index: false,
          follow: false,
        },

        title: t("learner.practiceTests.run.metaTitle"),
      };
    },
    {
      pathname: "/app/practice-tests/[id]",
      routeGroup: "student.learner.practice_test_run",
    },
  );
}

function isSafeTestId(value: string): boolean {
  return /^[a-zA-Z0-9_-]{8,}$/.test(value);
}

export default async function PracticeTestRunPage({
  params,
}: Props) {
  const { id } = await params;

  if (!isSafeTestId(id)) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <LearnerBreadcrumbTrail
            kind="practice-tests"
            pathname="/app/practice-tests"
          />
        </div>

        <div className="nn-card p-6">
          <h1 className="text-lg font-semibold">
            Invalid practice test
          </h1>

          <p className="mt-2 text-sm text-muted">
            The requested practice test could not be loaded.
          </p>

          <div className="mt-4">
            <Link
              href="/app/practice-tests"
              className="nn-button nn-button-primary"
            >
              Return to Practice Tests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let session = null;

  try {
    session = await getProtectedRouteSession(
      "(student).app.(learner).practice-tests.[id]",
    );
  } catch (error) {
    console.error(
      "[practice-test-run] protected route session failed",
      error,
    );

    return (
      <div className="p-6">
        <div className="mb-4">
          <LearnerBreadcrumbTrail
            kind="practice-tests"
            pathname="/app/practice-tests"
          />
        </div>

        <div className="nn-card p-6">
          <h1 className="text-lg font-semibold">
            Session unavailable
          </h1>

          <p className="mt-2 text-sm text-muted">
            We could not verify your learner session.
          </p>

          <div className="mt-4">
            <Link
              href="/login"
              className="nn-button nn-button-primary"
            >
              Sign In Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userId =
    (session?.user as { id?: string })?.id ?? "";

  const email =
    (session?.user as { email?: string | null })?.email ??
    null;

  let entitlement:
    | Awaited<ReturnType<typeof resolveEntitlementForPage>>
    | "error" = "error";

  try {
    entitlement = await resolveEntitlementForPage(userId);
  } catch (error) {
    console.error(
      "[practice-test-run] entitlement resolution failed",
      error,
    );
  }

  const { t } = await getLearnerMarketingBundle();

  if (entitlement === "error") {
    return (
      <div className="p-6">
        <div className="mb-4">
          <LearnerBreadcrumbTrail
            kind="practice-tests"
            pathname="/app/practice-tests"
          />
        </div>

        <div className="nn-card p-6">
          <h1 className="text-lg font-semibold">
            Access verification unavailable
          </h1>

          <p className="mt-2 text-sm text-muted">
            {t("learner.entitlement.verifyFailed")}
          </p>
        </div>
      </div>
    );
  }

  const protectionFlags =
    getServerPremiumProtectionFlags();

  const userLabel = maskUserLabelForWatermark(
    email,
    userId || "unknown",
  );

  let studySettings = null;

  try {
    studySettings = await loadStudySettings(userId);
  } catch (error) {
    console.error(
      "[practice-test-run] study settings failed",
      error,
    );

    studySettings = null;
  }

  let initialPathwaySurface:
    | PracticeTestPathwayClientShell
    | null = null;

  let nclexShellMode:
    | "cat"
    | "practice"
    | null = null;

  let nclexShellPresentation:
    | "standard"
    | "loft" = "standard";

  let pathwayLabelForShell: string | null = null;

  if (userId) {
    try {
      const row = await prisma.practiceTest.findFirst({
        where: {
          id,
          userId,
        },

        select: {
          config: true,
        },
      });

      const parsed = practiceTestConfigRecord(
        row?.config,
      );

      const pathwayId = parsed?.pathwayId ?? "";

      if (parsed) {
        nclexShellMode =
          resolvePremiumNclexShellRoute({
            config: parsed.config,
            pathwayId,
          });

        if (
          nclexShellMode &&
          pathwayUsesLoftNclexExamPresentation(
            pathwayId,
          )
        ) {
          nclexShellPresentation = "loft";
        }
      }

      if (pathwayId) {
        const pathway = getExamPathwayById(pathwayId);

        if (pathway) {
          pathwayLabelForShell =
            pathway.shortName ?? null;

          initialPathwaySurface = {
            id: pathway.id,
            countrySlug: pathway.countrySlug,
            roleTrack: pathway.roleTrack,
            examCode: pathway.examCode,
            shortName: pathway.shortName,
            examFamily: pathway.examFamily,
          };
        }
      }
    } catch (error) {
      console.error(
        "[practice-test-run] pathway preload failed",
        error,
      );

      initialPathwaySurface = null;
      nclexShellMode = null;
    }
  }

  if (!entitlement.hasAccess) {
    let snap = null;

    try {
      snap = userId
        ? await getFreemiumSnapshot(userId)
        : null;
    } catch (error) {
      console.error(
        "[practice-test-run] freemium snapshot failed",
        error,
      );
    }

    return (
      <div className="p-6">
        <div className="mb-4">
          <LearnerBreadcrumbTrail
            kind="practice-tests"
            pathname="/app/practice-tests"
          />
        </div>

        <h1 className="text-2xl font-bold">
          {t("learner.practiceTests.run.title")}
        </h1>

        <p className="mt-2 text-sm text-muted">
          {t(
            "learner.practiceTests.run.subtitleLocked",
          )}
        </p>

        <div className="mt-6">
          <SubscriptionPaywall
            context="questions"
            freemiumRemainingQuestions={
              snap != null
                ? snap.questionRemaining
                : undefined
            }
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
          shellPresentation={
            nclexShellPresentation
          }
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
          initialPathwaySurface={
            initialPathwaySurface
          }
          adaptiveLearningEnabled={isAdaptiveLearningEnabled()}
        />
      </ExamSessionErrorBoundary>
    </div>
  );
}