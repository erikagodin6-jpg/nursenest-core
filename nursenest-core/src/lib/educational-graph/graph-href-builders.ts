import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingPathwayLessonsIndexPath, marketingLessonDetailHref } from "@/lib/lessons/lesson-routes";

export function normalizeGraphTopicSlug(topicSlug: string | null | undefined): string {
  return String(topicSlug ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function topicLabelFromSlug(topicSlug: string): string {
  return normalizeGraphTopicSlug(topicSlug)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function graphMechanismHref(topicSlug: string): string {
  return `/nursing-mechanisms/${encodeURIComponent(normalizeGraphTopicSlug(topicSlug))}`;
}

export function graphInterpretationHref(topicSlug: string): string {
  return `/clinical-interpretation/${encodeURIComponent(normalizeGraphTopicSlug(topicSlug))}`;
}

export function graphPracticeHref(pathwayId: string | null | undefined, topicSlug: string): string {
  const params = new URLSearchParams({ topicSlug: normalizeGraphTopicSlug(topicSlug) });
  const id = pathwayId?.trim();
  if (id) params.set("pathwayId", id);
  return `/question-bank?${params.toString()}`;
}

export function graphFlashcardsHref(pathwayId: string | null | undefined, topicSlug: string): string {
  const params = new URLSearchParams({ topicSlug: normalizeGraphTopicSlug(topicSlug) });
  const id = pathwayId?.trim();
  if (id) params.set("pathwayId", id);
  return `/app/flashcards?${params.toString()}`;
}

export function graphReassessmentHref(pathwayId: string | null | undefined, topicSlug: string): string {
  const params = new URLSearchParams({ topicSlug: normalizeGraphTopicSlug(topicSlug) });
  const id = pathwayId?.trim();
  if (id) params.set("pathwayId", id);
  return `/app/practice-tests/cat-launch?${params.toString()}`;
}

export function graphLessonHref(input: {
  pathway?: ExamPathwayDefinition | null;
  anchorLessonSlug?: string | null;
  topicSlug: string;
}): string {
  const lessonSlug = normalizeGraphTopicSlug(input.anchorLessonSlug ?? input.topicSlug);
  if (input.pathway) {
    const base = marketingPathwayLessonsIndexPath(input.pathway);
    return marketingLessonDetailHref(base, lessonSlug) ?? `${base}?topicSlug=${encodeURIComponent(lessonSlug)}`;
  }
  return `/lessons?topicSlug=${encodeURIComponent(lessonSlug)}`;
}
