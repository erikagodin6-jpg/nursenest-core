import catalog from "@/content/pathway-lessons/catalog.json";
import type { PathwayLessonRecord, PathwayLessonSection, PathwayLessonSectionKind } from "@/lib/lessons/pathway-lesson-types";

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

/**
 * Pathway lessons are loaded from a repo JSON catalog (bundled server-side only).
 * Full lesson bodies are rendered in HTML only for entitled users; locked users receive
 * preview sections only. See docs/pathway-lesson-catalog-security.md.
 */

const CANONICAL_ORDER: PathwayLessonSectionKind[] = [
  "clinical_meaning",
  "exam_relevance",
  "core_concept",
  "clinical_scenario",
  "takeaways",
];

function hasAllCanonicalKinds(sections: PathwayLessonSection[]): boolean {
  return CANONICAL_ORDER.every((k) => sections.some((s) => s.kind === k));
}

function sanitizeSectionBody(body: unknown): string {
  if (typeof body !== "string") return "";
  return body.trim();
}

function sanitizeSection(raw: Partial<PathwayLessonSection>, index: number): PathwayLessonSection {
  const kind = (raw.kind ?? "intro") as PathwayLessonSectionKind;
  const heading = typeof raw.heading === "string" && raw.heading.trim().length > 0 ? raw.heading.trim() : "Section";
  const id = typeof raw.id === "string" && raw.id.trim().length > 0 ? raw.id : `${kind}-${index}`;
  return {
    id,
    heading,
    kind,
    body: sanitizeSectionBody(raw.body),
  };
}

function sanitizeIncomingSections(sections: unknown): PathwayLessonSection[] {
  if (!Array.isArray(sections)) return [];
  return sections.map((s, i) => sanitizeSection(s as Partial<PathwayLessonSection>, i));
}

/** Fixed lesson structure: clinical meaning, exam relevance, core, scenario, takeaways. */
function expandToStandardFiveSections(sections: PathwayLessonSection[]): PathwayLessonSection[] {
  const cleaned = sanitizeIncomingSections(sections);

  if (cleaned.length >= 5 && hasAllCanonicalKinds(cleaned)) {
    const ordered = CANONICAL_ORDER.map((k) => cleaned.find((s) => s.kind === k)).filter(
      (s): s is PathwayLessonSection => Boolean(s),
    );
    if (ordered.length === 5) {
      return ordered.map((s) => ({
        ...s,
        body: s.body || defaultBodyFor(s.kind),
      }));
    }
  }

  const byKind = Object.fromEntries(cleaned.map((s) => [s.kind, s])) as Partial<
    Record<PathwayLessonSectionKind, PathwayLessonSection>
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

function defaultBodyFor(kind: PathwayLessonSectionKind): string {
  switch (kind) {
    case "clinical_meaning":
      return "Read the stem as a safety and prioritization problem first, then match your action to the risk you can justify.";
    case "exam_relevance":
      return "Examiners use these topics to test whether you can prioritize, sequence safely, and justify your next action.";
    case "core_concept":
      return "Anchor pathophysiology to assessment findings, then tie interventions to monitoring and escalation rules.";
    case "clinical_scenario":
      return "Picture one client whose data forces a fork: stable monitoring versus urgent escalation. Choose the branch the stem supports.";
    case "takeaways":
      return "Before your next question block, restate one rule you will not violate on prioritization or scope.";
    default:
      return "";
  }
}

function normalizeLesson(raw: CatalogShape["pathways"][string]["lessons"][number]): PathwayLessonRecord {
  const title = typeof raw.title === "string" ? raw.title : "Lesson";
  const seoTitle = typeof raw.seoTitle === "string" ? raw.seoTitle : title;
  const seoDescription = typeof raw.seoDescription === "string" ? raw.seoDescription : "";
  const rawPc = raw.previewSectionCount;
  const previewCandidate =
    typeof rawPc === "number" && Number.isFinite(rawPc) && rawPc > 0 ? Math.floor(rawPc) : 1;

  const base: PathwayLessonRecord = {
    slug: raw.slug,
    title,
    topic: typeof raw.topic === "string" ? raw.topic : "",
    topicSlug: typeof raw.topicSlug === "string" ? raw.topicSlug : "",
    bodySystem: typeof raw.bodySystem === "string" ? raw.bodySystem : "",
    previewSectionCount: Math.max(1, Math.min(previewCandidate, 5)),
    seoTitle,
    seoDescription,
    sections: raw.sections as PathwayLessonRecord["sections"],
  };
  const expanded = expandToStandardFiveSections(base.sections as PathwayLessonSection[]);
  const maxPreview = Math.min(expanded.length, 5);
  const preview = Math.max(1, Math.min(base.previewSectionCount, maxPreview || 1));
  return {
    ...base,
    sections: expanded,
    previewSectionCount: preview,
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
