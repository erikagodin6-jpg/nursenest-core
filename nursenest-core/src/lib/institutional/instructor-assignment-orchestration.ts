import "server-only";

import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { CohortId, ExamPathwayId, RemediationAssignment, UserId } from "@/lib/institutional/contracts";

/**
 * Context passed when resolving what an instructor (or org-admin) may assign.
 * All checks must remain **server-side**; cohort role is future — today use staff + audit only.
 */
export interface InstructorAssignmentAuthContext {
  actorUserId: UserId;
  /** Future: cohort instructor vs org-admin vs staff. */
  actorKind: "staff_content" | "staff_support" | "staff_super" | "future_cohort_instructor";
  cohortId: CohortId | null;
}

/**
 * Hooks into existing adaptive / linked-learning **read** paths (no new persistence here).
 *
 * - Weak topics: align with `@/lib/learner/topic-performance` (`loadWeakTopicPracticePlan`, `getWeakTopicNamesForPractice`).
 * - Linked assets: align with `@/lib/lessons/pathway-lesson-linked-learning-assets` signals on pathway lessons.
 */
export interface AdaptiveLinkedLearningPreview {
  weakTopicKeys: readonly string[];
  /** Lesson slugs that carry linked-learning signals for a pathway (authoring-time). */
  linkedLessonSlugs: readonly string[];
}

export type AssignmentOrchestrationResult =
  | { ok: true; assignmentIds: readonly string[] }
  | { ok: false; code: "not_implemented" | "forbidden" | "entitlement_blocked"; detail?: string };

/**
 * **Stub** — assignment persistence and notifications are out of scope for Phase 7.
 * Implementations will enqueue rows + respect `getUserAccess` for each target learner before surfacing locked content.
 */
export interface InstructorAssignmentOrchestrator {
  previewAdaptiveTargetsForLearner(
    learnerUserId: UserId,
    pathwayId: ExamPathwayId,
    entitlement: AccessScope,
  ): Promise<AdaptiveLinkedLearningPreview>;

  proposeRemediationAssignments(
    auth: InstructorAssignmentAuthContext,
    targets: readonly { learnerUserId: UserId; topicKey: string; pathwayId: ExamPathwayId | null }[],
  ): Promise<readonly RemediationAssignment[]>;

  /** Future: bulk assign pathway / lessons — must not upgrade Stripe entitlements. */
  enqueuePathwayAssignment(
    auth: InstructorAssignmentAuthContext,
    cohortId: CohortId,
    pathwayId: ExamPathwayId,
    learnerUserIds: readonly UserId[],
  ): Promise<AssignmentOrchestrationResult>;
}

/**
 * No-op orchestrator for type-checking dependents; returns safe empty previews.
 */
export function createPhase7StubInstructorAssignmentOrchestrator(): InstructorAssignmentOrchestrator {
  return {
    async previewAdaptiveTargetsForLearner() {
      return { weakTopicKeys: [], linkedLessonSlugs: [] };
    },
    async proposeRemediationAssignments() {
      return [];
    },
    async enqueuePathwayAssignment() {
      return { ok: false, code: "not_implemented", detail: "Phase 7 stub — persistence not enabled." };
    },
  };
}
