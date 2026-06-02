import type { ExamKey, MasterTopicMapTopic } from "./master-topic-map.types";
import { findTopic, getExamTrack } from "./master-topic-map";

export type TopicLinkPlan = {
  /** Same category (auto), capped */
  sameCategoryTopicIds: string[];
  /** Explicit graph edges from the map */
  prerequisites: string[];
  advanced: string[];
  /** Union for “related lessons” blocks (deduped, excludes self) */
  relatedLessonTopicIds: string[];
  questionTopicHints: string[];
  relatedToolSlugs: string[];
};

/**
 * Auto-generated internal linking targets for a lesson row in the production pipeline.
 * Does not emit URLs — consumers map topic IDs to slugs when lessons exist.
 */
export function buildTopicLinkPlan(exam: ExamKey, categoryId: string, topicId: string): TopicLinkPlan | null {
  const found = findTopic(exam, categoryId, topicId);
  if (!found) return null;
  const { topic } = found;

  const sameCategory = uniqueStrings([
    ...topic.autoRelatedTopicIds,
    ...topic.prerequisiteTopicIds,
    ...topic.advancedTopicIds,
  ]).filter((id) => id !== topicId);

  return {
    sameCategoryTopicIds: topic.autoRelatedTopicIds.filter((id) => id !== topicId),
    prerequisites: [...topic.prerequisiteTopicIds],
    advanced: [...topic.advancedTopicIds],
    relatedLessonTopicIds: sameCategory.slice(0, 8),
    questionTopicHints: [...topic.questionTopicHints],
    relatedToolSlugs: [...topic.relatedToolSlugs],
  };
}

/** Resolve topic id (same exam) to display name for outlines / admin tooling */
export function resolveTopicName(exam: ExamKey, topicId: string): string | null {
  const track = getExamTrack(exam);
  for (const cat of track.categories) {
    const t = cat.topics.find((x) => x.id === topicId);
    if (t) return t.name;
  }
  return null;
}

/** Related question keywords for SEO + programmatic practice hubs (no PII) */
export function questionSeoTagsForTopic(topic: MasterTopicMapTopic, categoryName: string, exam: ExamKey): string[] {
  return uniqueStrings([...topic.questionTopicHints, categoryName, exam.toLowerCase()]);
}

function uniqueStrings(arr: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of arr) {
    const k = s.trim();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(k);
  }
  return out;
}
