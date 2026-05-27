"use client";

import { NclexCatRunner } from "@/components/exam/nclex-cat-runner";
import { NclexPracticeRunner } from "@/components/exam/nclex-practice-runner";
import { PracticeTestRunnerClient } from "@/components/student/practice-test-runner-client";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";
import type { StudySettings } from "@/lib/learner/study-settings";

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
