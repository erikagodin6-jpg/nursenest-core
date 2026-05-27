import type { Metadata } from "next";

import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { ExamSessionErrorBoundary } from "@/components/exam/exam-session-error-boundary";
import { PracticeTestRunnerLoader } from "./practice-test-runner-loader";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { LearnerActivityState } from "@/components/student/learner-activity-state";

import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { loadStudySettings } from "@/lib/learner/load-study-settings";
import { DEFAULT_STUDY_SETTINGS } from "@/lib/learner/study-settings";
import { isAdaptiveLearningEnabled } from "@/lib/learner/adaptive-learning-env";
import { loadLearnerActivityBootstrap } from "@/lib/learner/activity-lifecycle";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { loadPracticeTestShellBootstrap } from "@/lib/practice-tests/load-practice-test-shell-bootstrap";

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
    requireSubscription: true,
    routeParams: [{ name: "id", value: id, pattern: /^[a-zA-Z0-9_-]{8,}$/, displayName: "practice test" }],
  });

  if (!bootstrap.ok) return <LearnerActivityState state={bootstrap} paywallContext="questions" />;

  const userId = bootstrap.userId;
  const idParam = bootstrap.routeParams.id!;
  const entitlement = bootstrap.entitlement;

  if (!entitlement.hasAccess) {
    const [{ t }, snap] = await Promise.all([
      getLearnerMarketingBundle(),
      userId
        ? getFreemiumSnapshot(userId).catch((error) => {
            safeServerLog("learner_activity", "practice_test_freemium_snapshot_failed", {
              userIdPrefix: userId.slice(0, 8),
              testIdPrefix: idParam.slice(0, 12),
              detail: (error instanceof Error ? error.message : String(error)).slice(0, 200),
            });
            return null;
          })
        : Promise.resolve(null),
    ]);

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

  const [studySettings, shellBootstrap] = await Promise.all([
    loadStudySettings(userId).catch((error) => {
      safeServerLog("learner_activity", "practice_test_study_settings_failed", {
        userIdPrefix: userId.slice(0, 8),
        detail: (error instanceof Error ? error.message : String(error)).slice(0, 200),
      });

      return DEFAULT_STUDY_SETTINGS;
    }),
    loadPracticeTestShellBootstrap({ userId, testId: idParam }),
  ]);

  const {
    initialPathwaySurface,
    nclexShellMode,
    nclexShellPresentation,
    pathwayLabelForShell,
  } = shellBootstrap;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:min-h-0">
      <ExamSessionErrorBoundary surface="practice_test">
        <PracticeTestRunnerLoader
          mode={nclexShellMode ?? "standard"}
          testId={idParam}
          userId={userId}
          userLabel={bootstrap.userLabel}
          protectionFlags={bootstrap.protectionFlags}
          studySettings={studySettings}
          isEntitled={entitlement.hasAccess}
          initialPathwaySurface={
            initialPathwaySurface
          }
          adaptiveLearningEnabled={isAdaptiveLearningEnabled()}
          pathwayLabelForShell={pathwayLabelForShell}
          shellPresentation={nclexShellPresentation}
        />
      </ExamSessionErrorBoundary>
    </div>
  );
}
