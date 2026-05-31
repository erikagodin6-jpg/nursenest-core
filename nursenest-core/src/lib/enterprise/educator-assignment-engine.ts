export type EnterpriseAssignmentType =
  | "lesson"
  | "flashcard"
  | "practice_question"
  | "simulation"
  | "clinical_skill"
  | "ecg_activity"
  | "lab_activity"
  | "medication_math";

export type EnterpriseAssignment = Readonly<{
  id: string;
  type: EnterpriseAssignmentType;
  contentId: string;
  assignedByUserId: string;
  learnerIds: readonly string[];
  cohortId: string | null;
  dueAtIso: string | null;
}>;

export type AssignmentCompletionSignal = Readonly<{
  assignmentId: string;
  learnerId: string;
  completed: boolean;
}>;

export function summarizeAssignmentCompletion(
  assignment: EnterpriseAssignment,
  signals: readonly AssignmentCompletionSignal[],
) {
  const scoped = signals.filter((signal) => signal.assignmentId === assignment.id);
  const completed = scoped.filter((signal) => signal.completed).length;
  const assigned = assignment.learnerIds.length;
  return {
    assignmentId: assignment.id,
    assigned,
    completed,
    completionPct: assigned > 0 ? Math.round((completed / assigned) * 100) : 0,
  };
}
