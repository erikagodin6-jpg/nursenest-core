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

/** Fixed lesson structure for every pathway lesson: clinical meaning, exam relevance, core, scenario, takeaways. */
function expandToStandardFiveSections(
  sections: PathwayLessonRecord["sections"],
): PathwayLessonRecord["sections"] {
  if (
    sections.length >= 5 &&
    sections.some((s) => s.kind === "takeaways") &&
    sections.some((s) => s.kind === "clinical_meaning")
  ) {
    return sections.slice(0, 5);
  }

  const byKind = Object.fromEntries(sections.map((s) => [s.kind, s])) as Partial<
    Record<PathwayLessonRecord["sections"][number]["kind"], PathwayLessonRecord["sections"][number]>
  >;

  const intro = byKind.intro ?? byKind.clinical_meaning;
  const core = byKind.core ?? byKind.core_concept;
  const clinical = byKind.clinical_application ?? byKind.clinical_scenario;
  const exam = byKind.exam_tips ?? byKind.exam_relevance;
  const explicitTakeaways = byKind.takeaways;

  const examBody = (exam?.body ?? "").trim();
  const sentences = examBody.split(/(?<=[.!?])\s+/).filter(Boolean);
  const examRelevanceBody =
    sentences.length > 1
      ? sentences.slice(0, Math.min(2, sentences.length)).join(" ")
      : examBody.length > 0
        ? `${examBody} Boards reward judgment, pacing, and elimination over memorizing isolated facts.`
        : "Examiners use these topics to test whether you can prioritize, sequence safely, and justify your next action.";

  const takeawaysBody =
    explicitTakeaways?.body?.trim() ||
    (sentences.length > 2
      ? sentences.slice(2).join(" ")
      : "Before your next question block, restate one rule you will not violate on prioritization or scope.");

  return [
    {
      id: "clinical_meaning",
      heading: "What this means clinically",
      kind: "clinical_meaning",
      body:
        intro?.body?.trim() ||
        "Read the stem as a safety and prioritization problem first, then match your action to the risk you can justify.",
    },
    {
      id: "exam_relevance",
      heading: "Why this appears on exams",
      kind: "exam_relevance",
      body: examRelevanceBody,
    },
    {
      id: "core_concept",
      heading: "Core concept explanation",
      kind: "core_concept",
      body:
        core?.body?.trim() ||
        "Anchor pathophysiology to assessment findings, then tie interventions to monitoring and escalation rules.",
    },
    {
      id: "clinical_scenario",
      heading: "Clinical scenario example",
      kind: "clinical_scenario",
      body:
        clinical?.body?.trim() ||
        "Picture one client whose data forces a fork: stable monitoring versus urgent escalation. Choose the branch the stem supports.",
    },
    {
      id: "takeaways",
      heading: "Key takeaways",
      kind: "takeaways",
      body: takeawaysBody,
    },
  ];
}

function normalizeLesson(raw: CatalogShape["pathways"][string]["lessons"][number]): PathwayLessonRecord {
  const base: PathwayLessonRecord = {
    slug: raw.slug,
    title: raw.title,
    topic: raw.topic,
    topicSlug: raw.topicSlug,
    bodySystem: raw.bodySystem,
    previewSectionCount: Math.max(1, Math.min(raw.previewSectionCount ?? 1, 5)),
    seoTitle: raw.seoTitle,
    seoDescription: raw.seoDescription,
    sections: raw.sections as PathwayLessonRecord["sections"],
  };
  const expanded = expandToStandardFiveSections(base.sections);
  return {
    ...base,
    sections: expanded,
    previewSectionCount: Math.max(1, Math.min(base.previewSectionCount, expanded.length)),
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
