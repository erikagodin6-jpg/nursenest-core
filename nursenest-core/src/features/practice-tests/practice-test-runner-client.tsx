"use client";

import dynamic from "next/dynamic";

import { PracticeTestRunPageSkeleton } from "@/components/skeletons/hub-page-skeleton";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";
import type { StudySettings } from "@/lib/learner/study-settings";

export type PracticeTestRunnerClientProps = {
  testId: string;
  userId: string;
  userLabel: string;
  protectionFlags: PremiumProtectionFlags;
  studySettings: StudySettings;
  /**
   * Whether this user has an active premium subscription.
   * Controls gating of Adaptive Study Plan, Smart Review, and Confidence Analytics.
   */
  isEntitled?: boolean;
  /** Server snapshot from stored test config so chrome can render before hydrate returns pathwaySurface. */
  initialPathwaySurface?: PracticeTestPathwayClientShell | null;
  /** Server env `ADAPTIVE_LEARNING_ENABLED` — gates optional post-miss study wiring. */
  adaptiveLearningEnabled?: boolean;
};

const PracticeTestRunnerCore = dynamic(
  () =>
    import("@/features/practice-tests/practice-test-runner-core").then((m) => ({
      default: m.PracticeTestRunnerCore,
    })),
  {
    ssr: false,
    loading: () => <PracticeTestRunPageSkeleton />,
  },
);

export function PracticeTestRunnerClient(props: PracticeTestRunnerClientProps) {
  return <PracticeTestRunnerCore {...props} />;
}
