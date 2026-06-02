import type { LearnerStudyNextBlockModel } from "@/lib/learner/load-learner-study-next-block";

/** GET `/api/learner/command-center` — review counts must not fake zeros when the loader fails. */
export type CommandCenterReviewOk = {
  loadState: "ok";
  href: string;
  overdue: number;
  dueToday: number;
  highRisk: number;
  total: number;
  message: string;
};

export type CommandCenterReviewErrorPayload = {
  loadState: "error";
  href: string;
  message: string;
  retryable: boolean;
};

export type CommandCenterReviewPayload = CommandCenterReviewOk | CommandCenterReviewErrorPayload;

export type CommandCenterSegmentLoadFailures = {
  studyNext?: boolean;
  topicPerformance?: boolean;
  review?: boolean;
  mistakes?: boolean;
  notes?: boolean;
};

export type CommandCenterNoteRow = {
  id: string;
  scope: string;
  contextId: string;
  title: string | null;
  snippet: string;
  topic: string | null;
  updatedAt: string;
  href: string;
  scopeLabel: string;
  kind: "note" | "bookmark" | "rationale";
};

export type CommandCenterMistakeRow = {
  id: string;
  topic: string | null;
  stemSnippet: string;
  lastMissedAt: string;
  href: string;
};

/** Stable contract for the learner command center JSON response. */
export type CommandCenterApiPayload = {
  studyNext: LearnerStudyNextBlockModel | null;
  weakTopics: Array<{ topic: string; missRate: number; href: string }>;
  notes: CommandCenterNoteRow[];
  mistakes: CommandCenterMistakeRow[];
  review: CommandCenterReviewPayload;
  plannedLessons: Array<{ title: string; href: string }>;
  /** Present when any parallel segment failed — client must not treat empty arrays / missing studyNext as “user has no data”. */
  segmentLoadFailures?: CommandCenterSegmentLoadFailures;
};

export function isCommandCenterReviewOk(r: CommandCenterReviewPayload): r is CommandCenterReviewOk {
  return r.loadState === "ok";
}
