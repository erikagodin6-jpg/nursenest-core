export type {
  AssignedLesson,
  AssignedPathway,
  AssignedPracticeExam,
  AssignmentContentKind,
  Cohort,
  CohortAnalyticsSnapshot,
  CohortId,
  CohortLifecycleStatus,
  CohortMemberRole,
  CohortMembership,
  ExamPathwayId,
  InstructorRef,
  Organization,
  OrganizationId,
  OrganizationStatus,
  RemediationAssignment,
  RemediationAssignmentSource,
  UserId,
} from "@/lib/institutional/contracts";

export type {
  CohortCompletionSummaryDto,
  CohortEngagementSummaryDto,
  CohortLearnerReadinessRowDto,
  CohortRemediationSummaryDto,
  WeakTopicClusterSummaryDto,
} from "@/lib/institutional/cohort-analytics-dto";

export type {
  AdaptiveLinkedLearningPreview,
  AssignmentOrchestrationResult,
  InstructorAssignmentAuthContext,
  InstructorAssignmentOrchestrator,
} from "@/lib/institutional/instructor-assignment-orchestration";

export { createPhase7StubInstructorAssignmentOrchestrator } from "@/lib/institutional/instructor-assignment-orchestration";

export type {
  InstitutionType,
  InstitutionalCohortRow,
  InstitutionalDashboardData,
  InstitutionalLearnerRow,
  InstitutionalLicenseEventRow,
  InstitutionalOrganizationSummary,
  InstitutionalRole,
  InstitutionalStatus,
} from "@/lib/institutional/licensing-types";

export {
  INSTITUTION_TYPES,
  calculateSeatUtilization,
  institutionTypeLabel,
  normalizeInstitutionType,
} from "@/lib/institutional/licensing-types";
