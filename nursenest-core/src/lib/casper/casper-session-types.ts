import type { CasperFeedbackRating, CasperSessionEvaluation } from "@/lib/casper/casper-feedback";

export type CasperSessionMode = "mini" | "full-length" | "weakness-drill";

export type CasperSessionStatus = "draft" | "in-progress" | "completed";

export type CasperSessionResponse = {
  scenarioId: string;
  responseText: string;
  createdAtIso: string;
  updatedAtIso: string;
};

export type CasperSessionRecord = {
  id: string;
  learnerId: string;
  mode: CasperSessionMode;
  status: CasperSessionStatus;
  startedAtIso: string;
  completedAtIso?: string;
  responses: CasperSessionResponse[];
  evaluation?: CasperSessionEvaluation;
  overallRating?: CasperFeedbackRating;
};

export type CasperSessionSummary = {
  id: string;
  mode: CasperSessionMode;
  status: CasperSessionStatus;
  startedAtIso: string;
  overallRating?: CasperFeedbackRating;
};

export function buildCasperSessionSummary(
  session: CasperSessionRecord,
): CasperSessionSummary {
  return {
    id: session.id,
    mode: session.mode,
    status: session.status,
    startedAtIso: session.startedAtIso,
    overallRating: session.overallRating,
  };
}
