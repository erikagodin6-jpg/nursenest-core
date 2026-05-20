/**
 * Fourth-pass RN coaching orchestration — single entry for all learner surfaces.
 */
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import {
  buildPostExamPerformanceReport,
  resolvePostExamSessionKind,
  type BuildPostExamPerformanceReportInput,
  type PostExamPerformanceReport,
} from "@/lib/learner/post-exam-performance-report";
import {
  buildRnCoachingIntelligenceReport,
  type BuildRnCoachingIntelligenceInput,
} from "@/lib/learner/rn-coaching-intelligence/build-rn-coaching-intelligence-report";
import type { RnCoachingIntelligenceReport } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { PostExamCoachingReport } from "@/lib/learner/post-exam-coaching/types";
import { attachCoachingToPerformanceReport } from "@/lib/learner/rn-coaching-intelligence/coaching-performance-merge";
import { governCoachingReportCopy } from "@/lib/learner/rn-coaching-intelligence/ai-coaching-governance";
import { loadLearnerCoachingContext } from "@/lib/learner/rn-coaching-intelligence/learner-coaching-context-loader";

export type LearnerCoachingContextPayload = {
  topicTrends: TopicTrendRow[];
  weakTopics: WeakTopicRow[];
  strongTopics: WeakTopicRow[];
  recentSessionCount: number;
  source: string;
};

export type BuildOrchestratedPostExamInput = BuildPostExamPerformanceReportInput & {
  topicTrends?: TopicTrendRow[];
  weakTopicRows?: WeakTopicRow[];
  recentSessionCount?: number;
  remediationUserId?: string | null;
  timingByQuestionId?: Record<string, { dwellMs?: number; answerChanges?: number; rereads?: number }>;
};

/** Map unified intelligence report to legacy post-exam coaching shape (superset-compatible). */
export function mapIntelligenceToPostExamCoaching(
  report: RnCoachingIntelligenceReport,
): PostExamCoachingReport & RnCoachingIntelligenceReport {
  return report as PostExamCoachingReport & RnCoachingIntelligenceReport;
}

export function toRnCoachingInput(input: BuildOrchestratedPostExamInput): BuildRnCoachingIntelligenceInput {
  const sessionKind = resolvePostExamSessionKind(input.config, input.pathwayId);
  return {
    results: input.results,
    config: input.config,
    pathwayId: input.pathwayId,
    sessionKind:
      sessionKind === "loft_simulation"
        ? "loft_simulation"
        : sessionKind === "cat"
          ? "cat"
          : sessionKind === "readiness_assessment"
            ? "readiness_assessment"
            : sessionKind === "timed_assessment"
              ? "timed_assessment"
              : "practice_exam",
    elapsedMs: input.elapsedMs,
    timedMode: input.timedMode,
    timeLimitSec: input.timeLimitSec,
    questionOutcomes: input.questionOutcomes,
    confidenceByQuestionId: input.confidenceByQuestionId,
    topicTrends: input.topicTrends,
    weakTopicRows: input.weakTopicRows,
    recentSessionCount: input.recentSessionCount,
    remediationUserId: input.remediationUserId,
    timingByQuestionId: input.timingByQuestionId,
  };
}

/**
 * P0 — unified post-exam report build (replaces legacy post-exam-coaching-only path).
 */
export function buildOrchestratedPostExamReport(
  input: BuildOrchestratedPostExamInput,
): PostExamPerformanceReport & { coaching: PostExamCoachingReport & RnCoachingIntelligenceReport } {
  const intelligence = buildRnCoachingIntelligenceReport(toRnCoachingInput(input));
  const coaching = mapIntelligenceToPostExamCoaching(intelligence);
  const base = buildPostExamPerformanceReport(input);
  const merged = attachCoachingToPerformanceReport(base, coaching as PostExamCoachingReport);
  return {
    ...merged,
    coaching: {
      ...coaching,
      ...intelligence,
    },
  };
}

/** @deprecated Use {@link buildOrchestratedPostExamReport} */
export function buildEnrichedPostExamPerformanceReport(input: BuildOrchestratedPostExamInput) {
  return buildOrchestratedPostExamReport(input);
}

export async function loadLearnerCoachingContextForUser(
  userId: string,
  entitlement: Parameters<typeof loadLearnerCoachingContext>[1],
): Promise<LearnerCoachingContextPayload> {
  return loadLearnerCoachingContext(userId, entitlement);
}

export function sanitizeOrchestratedCopy(
  blocks: string[],
  coachingModel: RnCoachingIntelligenceReport["coachingModel"],
): string[] {
  return governCoachingReportCopy(blocks, coachingModel);
}
