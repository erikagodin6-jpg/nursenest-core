import type { TopicSlugIssueKind } from "@/lib/study/topic-slug-normalize";
import { normalizeTopicSlugInput } from "@/lib/study/topic-slug-normalize";

export type LessonTopicIndexRow = {
  id: string;
  pathwayId: string;
  slug: string;
  topicSlug: string;
  title: string;
  locale: string;
  status: string;
};

export function indexLessonsByPathwayTopic(rows: LessonTopicIndexRow[]): Map<string, LessonTopicIndexRow[]> {
  const m = new Map<string, LessonTopicIndexRow[]>();
  for (const r of rows) {
    const key = `${r.pathwayId}\0${normalizeTopicSlugInput(r.topicSlug)}`;
    const arr = m.get(key) ?? [];
    arr.push(r);
    m.set(key, arr);
  }
  return m;
}

/** Exported for scripts and tests: unique published lesson for pathway × normalized topic slug. */
export function resolveUniqueLessonForTopic(
  pathwayId: string,
  topicSlug: string,
  index: Map<string, LessonTopicIndexRow[]>,
): { status: "ok"; lesson: LessonTopicIndexRow } | { status: "ambiguous"; lessons: LessonTopicIndexRow[] } | { status: "none" } {
  const key = `${pathwayId}\0${normalizeTopicSlugInput(topicSlug)}`;
  const list = index.get(key) ?? [];
  const published = list.filter((l) => String(l.status).toUpperCase() === "PUBLISHED");
  const pool = published.length > 0 ? published : list;
  if (pool.length === 0) return { status: "none" };
  if (pool.length > 1) return { status: "ambiguous", lessons: pool };
  return { status: "ok", lesson: pool[0]! };
}

export type FlashcardLinkCandidate = {
  id: string;
  deckPathwayId: string | null;
  lessonId: string | null;
  categorySlug: string;
  categoryTopicCode: string | null;
};

export function planFlashcardLessonLink(
  card: FlashcardLinkCandidate,
  lessonIndex: Map<string, LessonTopicIndexRow[]>,
): { action: "skip"; reason: string } | { action: "link"; pathwayLessonId: string } | { action: "ambiguous"; reason: string } {
  if (card.lessonId?.trim()) return { action: "skip", reason: "lesson_id_set" };
  const pid = card.deckPathwayId?.trim();
  if (!pid) return { action: "skip", reason: "no_deck_pathway" };
  const topicFromCode = card.categoryTopicCode?.trim();
  const topicSlug = normalizeTopicSlugInput(topicFromCode || card.categorySlug);
  if (!topicSlug) return { action: "skip", reason: "no_topic" };
  const res = resolveUniqueLessonForTopic(pid, topicSlug, lessonIndex);
  if (res.status === "none") return { action: "skip", reason: "no_lesson_for_topic" };
  if (res.status === "ambiguous") return { action: "ambiguous", reason: "multiple_lessons_same_topic" };
  return { action: "link", pathwayLessonId: res.lesson.id };
}

export type ExamQuestionLinkCandidate = {
  id: string;
  exam: string;
  topic: string | null;
  studyLinkPathwayId: string | null;
  studyLinkLessonSlug: string | null;
};

export function planExamQuestionStudyLink(
  pathwayId: string,
  contentExamKeys: string[],
  q: ExamQuestionLinkCandidate,
  lessonIndex: Map<string, LessonTopicIndexRow[]>,
): { action: "skip"; reason: string } | { action: "link"; lessonSlug: string } | { action: "ambiguous"; reason: string } {
  if (q.studyLinkLessonSlug?.trim() && q.studyLinkPathwayId?.trim() === pathwayId) {
    return { action: "skip", reason: "already_linked_same_pathway" };
  }
  if (q.studyLinkLessonSlug?.trim() && q.studyLinkPathwayId && q.studyLinkPathwayId !== pathwayId) {
    return { action: "skip", reason: "linked_other_pathway" };
  }
  const examOk = contentExamKeys.includes(q.exam);
  if (!examOk) return { action: "skip", reason: "exam_not_in_pathway" };
  const topicSlug = normalizeTopicSlugInput(q.topic ?? "");
  if (!topicSlug) return { action: "skip", reason: "no_topic" };
  const res = resolveUniqueLessonForTopic(pathwayId, topicSlug, lessonIndex);
  if (res.status === "none") return { action: "skip", reason: "no_lesson_for_topic" };
  if (res.status === "ambiguous") return { action: "ambiguous", reason: "multiple_lessons_same_topic" };
  return { action: "link", lessonSlug: res.lesson.slug };
}

export function summarizeTopicIssues(issues: TopicSlugIssueKind[]): string {
  return [...new Set(issues)].join(",");
}
