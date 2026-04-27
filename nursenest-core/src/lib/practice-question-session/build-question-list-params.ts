import type { PracticeCategorySlug, PracticeSessionMode, PracticeSessionSource } from "@/lib/practice-question-session/constants";
import { PRACTICE_CATEGORY_TOPIC } from "@/lib/practice-question-session/constants";
import { questionIdsWithIncorrectAttempts, readQuestionPerformanceEvents } from "@/lib/learner/question-performance-events";

const MAX_EXCLUDE_IDS = 380;

export type BuildQuestionListParamsInput = {
  pathwayId: string;
  source: PracticeSessionSource;
  categorySlug: PracticeCategorySlug | null;
  count: number;
  mode: PracticeSessionMode;
  shuffle: boolean;
  userId: string;
};

/**
 * Builds `URLSearchParams` for `GET /api/questions` (subscriber preview/full list).
 */
export function buildQuestionListSearchParams(input: BuildQuestionListParamsInput): URLSearchParams {
  const { pathwayId, source, categorySlug, count, mode, shuffle, userId } = input;
  const qs = new URLSearchParams({
    mode: "full",
    page: "1",
    pageSize: String(Math.min(Math.max(count, 1), 50)),
    sort: shuffle ? "random" : "recent",
  });
  qs.set("pathwayId", pathwayId);

  const topic =
    categorySlug && (source === "body_systems" || source === "nursing_categories")
      ? PRACTICE_CATEGORY_TOPIC[categorySlug]
      : null;
  if (topic) qs.set("topic", topic);

  if (source === "previously_incorrect") {
    const events = readQuestionPerformanceEvents(userId, 220);
    const ids = questionIdsWithIncorrectAttempts(events, 200);
    if (ids.length > 0) qs.set("mistakeIds", ids.join(","));
  }

  if (source === "not_studied") {
    const events = readQuestionPerformanceEvents(userId, 220);
    const seen = new Set<string>();
    for (const ev of events) {
      const id = ev.questionId?.trim();
      if (id && id.length >= 8 && id.length <= 64) seen.add(id);
    }
    const exclude = [...seen].slice(0, MAX_EXCLUDE_IDS);
    if (exclude.length > 0) qs.set("excludeIds", exclude.join(","));
  }

  const wantWeakStudyMode = source === "weak_areas" || mode === "weak_area";
  if (wantWeakStudyMode) qs.set("studyMode", "weak");

  return qs;
}
