import type { Metadata } from "next";

import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { ExamSessionErrorBoundary } from "@/components/exam/exam-session-error-boundary";
import { PracticeTestRunnerClient } from "@/components/student/practice-test-runner-client";
import { NclexCatRunner } from "@/components/exam/nclex-cat-runner";
import { NclexPracticeRunner } from "@/components/exam/nclex-practice-runner";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { LearnerActivityState } from "@/components/student/learner-activity-state";

import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { loadStudySettings } from "@/lib/learner/load-study-settings";
import { DEFAULT_STUDY_SETTINGS } from "@/lib/learner/study-settings";
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
import { loadLearnerActivityBootstrap } from "@/lib/learner/activity-lifecycle";
import { safeServerLog } from "@/lib/observability/safe-server-log";

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

export default async function PracticeTestRunPage({
  params,
}: Props) {
  const { id } = await params;
  const bootstrap = await loadLearnerActivityBootstrap({
    surface: "(student).app.(learner).practice-tests.[id]",
    activityKind: "practice_exam",
    homeHref: "/app/practice-tests",
    homeLabel: "Return to Practice Exams",
    requireSubscription: false,
    routeParams: [{ name: "id", value: id, pattern: /^[a-zA-Z0-9_-]{8,}$/, displayName: "practice test" }],
  });
  const { t } = await getLearnerMarketingBundle();

  if (!bootstrap.ok) return <LearnerActivityState state={bootstrap} paywallContext="questions" />;

  const userId = bootstrap.userId;
  const idParam = bootstrap.routeParams.id!;
  const entitlement = bootstrap.entitlement;

  let studySettings = DEFAULT_STUDY_SETTINGS;

  try {
    studySettings = await loadStudySettings(userId);
  } catch (error) {
    safeServerLog("learner_activity", "practice_test_study_settings_failed", {
      userIdPrefix: userId.slice(0, 8),
      detail: (error instanceof Error ? error.message : String(error)).slice(0, 200),
    });

    studySettings = DEFAULT_STUDY_SETTINGS;
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
          id: idParam,
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
      safeServerLog("learner_activity", "practice_test_pathway_preload_failed", {
        userIdPrefix: userId.slice(0, 8),
        testIdPrefix: idParam.slice(0, 12),
        detail: (error instanceof Error ? error.message : String(error)).slice(0, 200),
      });

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
      safeServerLog("learner_activity", "practice_test_freemium_snapshot_failed", {
        userIdPrefix: userId.slice(0, 8),
        testIdPrefix: idParam.slice(0, 12),
        detail: (error instanceof Error ? error.message : String(error)).slice(0, 200),
      });
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
          testId={idParam}
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
          testId={idParam}
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
          testId={idParam}
          userId={userId}
          userLabel={bootstrap.userLabel}
          protectionFlags={bootstrap.protectionFlags}
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
