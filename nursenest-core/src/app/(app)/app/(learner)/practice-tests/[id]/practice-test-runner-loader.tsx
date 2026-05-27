"use client";

import dynamic from "next/dynamic";
import { PracticeTestRunPageSkeleton } from "@/components/skeletons/hub-page-skeleton";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";
import type { StudySettings } from "@/lib/learner/study-settings";

const DynamicPracticeTestRunnerClient = dynamic(
  () =>
    import("@/components/student/practice-test-runner-client").then(
      (module) => module.PracticeTestRunnerClient,
    ),
  { loading: () => <PracticeTestRunPageSkeleton withRouteAria={false} /> },
);

const DynamicNclexCatRunner = dynamic(
  () => import("@/components/exam/nclex-cat-runner").then((module) => module.NclexCatRunner),
  { loading: () => <PracticeTestRunPageSkeleton withRouteAria={false} /> },
);

const DynamicNclexPracticeRunner = dynamic(
  () => import("@/components/exam/nclex-practice-runner").then((module) => module.NclexPracticeRunner),
  { loading: () => <PracticeTestRunPageSkeleton withRouteAria={false} /> },
);

export function PracticeTestRunnerLoader(props: {
  mode: "cat" | "practice" | "standard";
  testId: string;
  userId: string;
  userLabel: string;
  protectionFlags: PremiumProtectionFlags;
  studySettings: StudySettings;
  isEntitled: boolean;
  initialPathwaySurface: PracticeTestPathwayClientShell | null;
  adaptiveLearningEnabled: boolean;
  pathwayLabelForShell: string | null;
  shellPresentation: "standard" | "loft";
}) {
  if (props.mode === "cat") {
    return (
      <DynamicNclexCatRunner
        testId={props.testId}
        userId={props.userId}
        pathwayLabel={props.pathwayLabelForShell}
      />
    );
  }

  if (props.mode === "practice") {
    return (
      <DynamicNclexPracticeRunner
        testId={props.testId}
        userId={props.userId}
        pathwayLabel={props.pathwayLabelForShell}
        shellPresentation={props.shellPresentation}
      />
    );
  }

  return (
    <DynamicPracticeTestRunnerClient
      testId={props.testId}
      userId={props.userId}
      userLabel={props.userLabel}
      protectionFlags={props.protectionFlags}
      studySettings={props.studySettings}
      isEntitled={props.isEntitled}
      initialPathwaySurface={props.initialPathwaySurface}
      adaptiveLearningEnabled={props.adaptiveLearningEnabled}
    />
  );
}
