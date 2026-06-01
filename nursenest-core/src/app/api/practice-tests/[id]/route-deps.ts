import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { withRetry } from "@/lib/resilience/with-retry";
import {
  captureCatCoachGenerationAnalytics,
  capturePracticeTestCompletedAnalytics,
} from "@/lib/observability/learner-product-analytics";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { recordTopicOutcomesFromPracticeTest } from "@/lib/learner/topic-performance";
import { buildPracticeAdaptivePostMissPayload } from "@/lib/learner/build-learner-adaptive-wire-bundle";
import { recordQuestionPeerAnalyticsAndBuildPayload } from "@/lib/questions/question-peer-analytics";
import {
  advanceCatPracticeTest,
  finalizeCatPracticeTest,
} from "@/lib/practice-tests/cat-session";
import { enrichPracticeTestResultsWithCatCoach } from "@/lib/practice-tests/enrich-cat-results-coach";
import { parsePracticeTestConfigAtBoundary } from "@/lib/practice-tests/practice-test-config-boundary";
import { computePracticeTestResults } from "@/lib/practice-tests/score-practice-test";
import {
  enforcePracticeTestDetailProtection,
  enforcePracticeTestMutationProtection,
} from "@/lib/http/api-protection";

export const practiceTestRouteDeps = {
  requireSubscriberSession,
  prisma,
  findPracticeTest: (args: Parameters<typeof prisma.practiceTest.findFirst>[0]) =>
    withRetry(() => prisma.practiceTest.findFirst(args), { maxAttempts: 3 }),
  updatePracticeTest: (args: Parameters<typeof prisma.practiceTest.update>[0]) =>
    withRetry(() => prisma.practiceTest.update(args), { maxAttempts: 2 }),
  setSentryServerContext,
  advanceCatPracticeTest,
  finalizeCatPracticeTest,
  recordTopicOutcomesFromPracticeTest,
  buildPracticeAdaptivePostMissPayload,
  recordQuestionPeerAnalyticsAndBuildPayload,
  enrichPracticeTestResultsWithCatCoach,
  computePracticeTestResults,
  parsePracticeTestConfigAtBoundary,
  capturePracticeTestCompletedAnalytics,
  captureCatCoachGenerationAnalytics,
  enforcePracticeTestDetailProtection,
  enforcePracticeTestMutationProtection,
};
