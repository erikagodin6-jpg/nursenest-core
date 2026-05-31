import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";

export type QuestionBankLauncherDecision =
  | {
      status: "ready";
      reason: "published_and_session_pool_usable";
      publishedQuestionCount: number;
      visibleQuestionCount: number;
    }
  | {
      status: "publishing";
      reason: "published_question_count_zero";
      publishedQuestionCount: 0;
      visibleQuestionCount: number;
    }
  | {
      status: "unavailable";
      reason:
        | "question_snapshot_unavailable"
        | "published_questions_filtered_out"
        | "session_pool_not_usable_with_published_questions";
      publishedQuestionCount: number | null;
      visibleQuestionCount: number | null;
    };

export function resolveQuestionBankLauncherDecision(
  snapshot: PathwayQuestionBankSnapshot,
  linearPracticePoolUsable: boolean,
): QuestionBankLauncherDecision {
  if (snapshot.status !== "ok") {
    return {
      status: "unavailable",
      reason: "question_snapshot_unavailable",
      publishedQuestionCount: null,
      visibleQuestionCount: null,
    };
  }

  if (snapshot.publishedQuestionCount === 0) {
    return {
      status: "publishing",
      reason: "published_question_count_zero",
      publishedQuestionCount: 0,
      visibleQuestionCount: snapshot.visibleQuestionCount,
    };
  }

  if (snapshot.visibleQuestionCount === 0) {
    return {
      status: "unavailable",
      reason: "published_questions_filtered_out",
      publishedQuestionCount: snapshot.publishedQuestionCount,
      visibleQuestionCount: 0,
    };
  }

  if (!linearPracticePoolUsable) {
    return {
      status: "unavailable",
      reason: "session_pool_not_usable_with_published_questions",
      publishedQuestionCount: snapshot.publishedQuestionCount,
      visibleQuestionCount: snapshot.visibleQuestionCount,
    };
  }

  return {
    status: "ready",
    reason: "published_and_session_pool_usable",
    publishedQuestionCount: snapshot.publishedQuestionCount,
    visibleQuestionCount: snapshot.visibleQuestionCount,
  };
}
