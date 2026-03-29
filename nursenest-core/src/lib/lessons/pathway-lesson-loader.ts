import catalog from "@/content/pathway-lessons/catalog.json";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

type CatalogShape = {
  version: number;
  pathways: Record<
    string,
    {
      lessons: Array<{
        slug: string;
        title: string;
        topic: string;
        topicSlug: string;
        bodySystem: string;
        previewSectionCount: number;
        seoTitle: string;
        seoDescription: string;
        sections: PathwayLessonRecord["sections"];
      }>;
    }
  >;
};

const data = catalog as CatalogShape;

function normalizeLesson(raw: CatalogShape["pathways"][string]["lessons"][number]): PathwayLessonRecord {
  return {
    slug: raw.slug,
    title: raw.title,
    topic: raw.topic,
    topicSlug: raw.topicSlug,
    bodySystem: raw.bodySystem,
    previewSectionCount: Math.max(1, Math.min(raw.previewSectionCount ?? 1, raw.sections.length)),
    seoTitle: raw.seoTitle,
    seoDescription: raw.seoDescription,
    sections: raw.sections,
  };
}

export function listPathwayIdsWithLessons(): string[] {
  return Object.keys(data.pathways).filter((id) => (data.pathways[id]?.lessons?.length ?? 0) > 0);
}

export function getPathwayLessons(pathwayId: string): PathwayLessonRecord[] {
  const bucket = data.pathways[pathwayId];
  if (!bucket?.lessons?.length) return [];
  return bucket.lessons.map(normalizeLesson);
}

export function getPathwayLesson(pathwayId: string, slug: string): PathwayLessonRecord | undefined {
  return getPathwayLessons(pathwayId).find((l) => l.slug === slug);
}

export type TopicCluster = { topicSlug: string; label: string; count: number };

export function listTopicClusters(pathwayId: string): TopicCluster[] {
  const lessons = getPathwayLessons(pathwayId);
  const map = new Map<string, { label: string; count: number }>();
  for (const l of lessons) {
    const cur = map.get(l.topicSlug) ?? { label: l.topic, count: 0 };
    cur.count += 1;
    map.set(l.topicSlug, { label: l.topic, count: cur.count });
  }
  return [...map.entries()]
    .map(([topicSlug, v]) => ({ topicSlug, label: v.label, count: v.count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getLessonsForTopic(pathwayId: string, topicSlug: string): PathwayLessonRecord[] {
  return getPathwayLessons(pathwayId).filter((l) => l.topicSlug === topicSlug);
}
