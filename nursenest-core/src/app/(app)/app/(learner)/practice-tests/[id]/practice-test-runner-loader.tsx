"use client";

import dynamic from "next/dynamic";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";
import type { StudySettings } from "@/lib/learner/study-settings";
import { PracticeTestRunPageSkeleton } from "@/components/skeletons/hub-page-skeleton";

const NclexCatRunner = dynamic(
  () => import("@/components/exam/nclex-cat-runner").then((m) => ({ default: m.NclexCatRunner })),
  { loading: () => <PracticeTestRunPageSkeleton />, ssr: false },
);

const NclexPracticeRunner = dynamic(
  () => import("@/components/exam/nclex-practice-runner").then((m) => ({ default: m.NclexPracticeRunner })),
  { loading: () => <PracticeTestRunPageSkeleton />, ssr: false },
);

const PracticeTestRunnerClient = dynamic(
  () =>
    import("@/components/student/practice-test-runner-client").then((m) => ({
      default: m.PracticeTestRunnerClient,
    })),
  { loading: () => <PracticeTestRunPageSkeleton />, ssr: false },
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
      <NclexCatRunner
        testId={props.testId}
        userId={props.userId}
        pathwayLabel={props.pathwayLabelForShell}
      />
    );
  }

  if (props.mode === "practice") {
    return (
      <NclexPracticeRunner
        testId={props.testId}
        userId={props.userId}
        pathwayLabel={props.pathwayLabelForShell}
        shellPresentation={props.shellPresentation}
      />
    );
  }

  return (
    <PracticeTestRunnerClient
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
