export type AccreditationReportKind =
  | "program_evaluation"
  | "competency_tracking"
  | "outcome_reporting"
  | "readiness_reporting"
  | "student_engagement";

export type AccreditationSupportReport = Readonly<{
  kind: AccreditationReportKind;
  title: string;
  evidenceFields: readonly string[];
  futureWorkflow: true;
}>;

export const ACCREDITATION_SUPPORT_REPORTS: readonly AccreditationSupportReport[] = [
  {
    kind: "program_evaluation",
    title: "Program Evaluation",
    evidenceFields: ["cohort completion", "readiness trend", "weak area trend"],
    futureWorkflow: true,
  },
  {
    kind: "competency_tracking",
    title: "Competency Tracking",
    evidenceFields: ["validated competencies", "simulation performance", "clinical skills completion"],
    futureWorkflow: true,
  },
  {
    kind: "outcome_reporting",
    title: "Outcome Reporting",
    evidenceFields: ["readiness growth", "completion rate", "risk learner improvement"],
    futureWorkflow: true,
  },
  {
    kind: "readiness_reporting",
    title: "Readiness Reporting",
    evidenceFields: ["exam readiness", "placement readiness", "clearances"],
    futureWorkflow: true,
  },
  {
    kind: "student_engagement",
    title: "Student Engagement",
    evidenceFields: ["active learners", "assignment completion", "study consistency"],
    futureWorkflow: true,
  },
];
