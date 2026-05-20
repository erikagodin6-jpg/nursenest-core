import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import {
  buildOrchestratedPostExamReport,
  type BuildOrchestratedPostExamInput,
} from "@/lib/learner/rn-coaching-intelligence/coaching-orchestration";
import { buildRnCoachingIntelligenceReport } from "@/lib/learner/rn-coaching-intelligence/build-rn-coaching-intelligence-report";
import {
  mapIntelligenceToPostExamCoaching,
  toRnCoachingInput,
} from "@/lib/learner/rn-coaching-intelligence/coaching-orchestration";
import { governCoachingReportCopy } from "@/lib/learner/rn-coaching-intelligence/ai-coaching-governance";
import { validateCoachingCopyForPathway } from "@/lib/testing/testing-model";
import type { PostExamCoachingReport } from "@/lib/learner/post-exam-coaching/types";
import type { RnCoachingIntelligenceReport } from "@/lib/learner/rn-coaching-intelligence/coaching-types";

export type { BuildOrchestratedPostExamInput as BuildPostExamCoachingReportInput } from "@/lib/learner/rn-coaching-intelligence/coaching-orchestration";

export { attachCoachingToPerformanceReport } from "@/lib/learner/rn-coaching-intelligence/coaching-performance-merge";

/**
 * Unified RN learner-state coaching report (delegates to rn-coaching-intelligence engine).
 */
export function buildPostExamCoachingReport(
  input: BuildOrchestratedPostExamInput,
): PostExamCoachingReport & RnCoachingIntelligenceReport {
  const intelligence = buildRnCoachingIntelligenceReport(toRnCoachingInput(input));
  const coaching = mapIntelligenceToPostExamCoaching(intelligence);

  const pathwayId = coaching.dashboardFeed.pathwayId;
  if (pathwayId) {
    const copyBlocks = governCoachingReportCopy(
      [
        coaching.dashboardFeed.headline,
        ...coaching.longitudinalNarratives,
        coaching.readinessReliability.guidance,
        ...coaching.timingV2.coachingNarratives,
      ],
      coaching.coachingModel,
    );
    validateCoachingCopyForPathway(pathwayId, copyBlocks.join(" "));
  }

  return coaching;
}

export function buildEnrichedPostExamPerformanceReport(input: BuildOrchestratedPostExamInput) {
  return buildOrchestratedPostExamReport(input);
}
