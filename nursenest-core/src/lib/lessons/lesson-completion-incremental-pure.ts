import type { Prisma } from "@prisma/client";
import type {
  PathwayLessonFigure,
  PathwayLessonPremiumSectionKind,
  PathwayLessonQuizItem,
  PathwayLessonSection,
} from "./pathway-lesson-types";

/** Same value as `NN_LESSON_DB_PAYLOAD_V2` in pathway-lesson-catalog-sync (inlined so tests do not load the catalog module). */
export const NN_LESSON_DB_PAYLOAD_V2 = "nnLessonPayloadV2" as const;

/** Row shape used by completion evaluation (exported for incremental pipeline tests). */
export type LessonCompletionLessonRow = {
  id: string;
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  sections: Prisma.JsonValue;
};

export type CompletionStatus = "COMPLETE" | "PARTIAL" | "EMPTY";

export const REQUIRED_SECTIONS: PathwayLessonPremiumSectionKind[] = [
  "introduction",
  "pathophysiology_overview",
  "signs_symptoms",
  "red_flags",
  "labs_diagnostics",
  "nursing_assessment_interventions",
  "clinical_pearls",
  "client_education",
  "tier_specific_relevance",
  "country_specific_notes",
  "related_next_steps",
];

export function words(s: string): number {
  const t = s.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

export function paragraphs(s: string): string[] {
  return s
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function sectionMap(sections: PathwayLessonSection[]): Map<string, PathwayLessonSection> {
  return new Map(sections.map((s) => [s.kind, s]));
}

/** Preserves recall / checkpoint payloads when merging or rewriting DB JSON. */
export function normalizeSectionsRich(raw: Prisma.JsonValue): PathwayLessonSection[] {
  if (!Array.isArray(raw)) return [];
  const out: PathwayLessonSection[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const x = raw[i];
    if (!x || typeof x !== "object") continue;
    const item = x as Record<string, unknown>;
    const kind = typeof item.kind === "string" ? item.kind.trim() : "";
    const body = typeof item.body === "string" ? item.body.trim() : "";
    if (!kind || !body) continue;
    out.push({
      id: typeof item.id === "string" && item.id.trim() ? item.id : `${kind}-${i}`,
      heading: typeof item.heading === "string" && item.heading.trim() ? item.heading : "Section",
      kind: kind as PathwayLessonSection["kind"],
      body,
      ...(Array.isArray(item.figures) ? { figures: item.figures as PathwayLessonFigure[] } : {}),
      ...(Array.isArray(item.recallPrompts) ? { recallPrompts: item.recallPrompts as PathwayLessonSection["recallPrompts"] } : {}),
      ...(Array.isArray(item.checkpointQuestions)
        ? { checkpointQuestions: item.checkpointQuestions as PathwayLessonSection["checkpointQuestions"] }
        : {}),
      ...(Array.isArray(item.keyRecallFacts) ? { keyRecallFacts: item.keyRecallFacts as PathwayLessonSection["keyRecallFacts"] } : {}),
      ...(typeof item.audioUrl === "string" || item.audioUrl === null ? { audioUrl: item.audioUrl as string | null } : {}),
    });
  }
  return out;
}

/** Sections with at least this many words are treated as substantive and preserved during incremental merge. */
export const MIN_SECTION_BODY_WORDS_TO_PRESERVE = 50;

export function mergeIncrementalPremiumSections(
  current: PathwayLessonSection[],
  proposed: PathwayLessonSection[],
): PathwayLessonSection[] {
  const curMap = sectionMap(current);
  const propMap = sectionMap(proposed);
  const out: PathwayLessonSection[] = [];
  for (const kind of REQUIRED_SECTIONS) {
    const cur = curMap.get(kind);
    const prop = propMap.get(kind);
    if (cur && words(cur.body) >= MIN_SECTION_BODY_WORDS_TO_PRESERVE) {
      out.push(cur);
      continue;
    }
    if (prop) out.push(prop);
    else if (cur) out.push(cur);
  }
  return out;
}

export function quizDedupeKey(q: PathwayLessonQuizItem): string {
  const ext = q as PathwayLessonQuizItem & { examQuestionId?: string };
  if (typeof ext.examQuestionId === "string" && ext.examQuestionId.trim()) {
    return `id:${ext.examQuestionId.trim()}`;
  }
  return `stem:${q.question.trim().slice(0, 160)}`;
}

/** Puts existing items first, then adds generated items without duplicates. */
export function mergeQuizItemsNoDup(
  existing: PathwayLessonQuizItem[],
  generated: PathwayLessonQuizItem[],
): PathwayLessonQuizItem[] {
  const seen = new Set<string>();
  const out: PathwayLessonQuizItem[] = [];
  for (const q of existing) {
    const k = quizDedupeKey(q);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(q);
  }
  for (const q of generated) {
    const k = quizDedupeKey(q);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(q);
  }
  return out;
}

export function buildSectionsDbPayload(
  sections: PathwayLessonSection[],
  pre: PathwayLessonQuizItem[],
  post: PathwayLessonQuizItem[],
): Prisma.InputJsonValue {
  if (pre.length > 0 || post.length > 0) {
    return {
      [NN_LESSON_DB_PAYLOAD_V2]: true,
      sections,
      preTest: pre,
      postTest: post,
    } as unknown as Prisma.InputJsonValue;
  }
  return sections as unknown as Prisma.InputJsonValue;
}

function isLikelyClinicalTopic(lesson: Pick<LessonCompletionLessonRow, "title" | "topic" | "bodySystem">): boolean {
  const t = `${lesson.title} ${lesson.topic} ${lesson.bodySystem}`.toLowerCase();
  if (t.includes("priorit") || t.includes("delegat") || t.includes("safety")) return false;
  return true;
}

export function evaluateCompletion(args: {
  lesson: LessonCompletionLessonRow;
  sections: PathwayLessonSection[];
  preQuestions: PathwayLessonQuizItem[];
  postQuestions: PathwayLessonQuizItem[];
}): { status: CompletionStatus; gaps: string[] } {
  const gaps: string[] = [];
  const m = sectionMap(args.sections);

  for (const kind of REQUIRED_SECTIONS) {
    const body = m.get(kind)?.body?.trim() ?? "";
    if (!body) gaps.push(`Missing section: ${kind}`);
  }

  if (isLikelyClinicalTopic(args.lesson)) {
    const patho = m.get("pathophysiology_overview")?.body ?? "";
    if (paragraphs(patho).length < 3) gaps.push("Pathophysiology requires at least 3 strong paragraphs.");
  }

  if (args.preQuestions.length < 3) gaps.push("Needs at least 3 pre-lesson questions.");
  if (args.postQuestions.length < 5) gaps.push("Needs at least 5 post-lesson questions.");
  if (args.postQuestions.filter((q) => !!q.rationale?.trim()).length < 5) {
    gaps.push("Post-lesson questions need rationales for at least 5 items.");
  }

  const totalWords = args.sections.reduce((sum, sec) => sum + words(sec.body), 0);
  if (totalWords < 280) return { status: "EMPTY", gaps: gaps.length ? gaps : ["Lesson body is too thin."] };
  if (gaps.length === 0) return { status: "COMPLETE", gaps: [] };
  return { status: "PARTIAL", gaps };
}
