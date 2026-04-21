/**
 * Conservative backfill: align published bank rows that are already in the pathway pool
 * but have empty `topic` so they match lesson topic OR branches (body_system already matches).
 *
 * Does not invent stems. One exam_question row is assigned to at most one lesson per plan.
 */
import { prisma } from "@/lib/db";
import { pathwayExamQuestionMarketingWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import {
  countRelatedExamQuestionsForPathwayLesson,
  RELATED_EXAM_QUESTIONS_MIN_TARGET,
} from "@/lib/lessons/lesson-question-cross-links";
import { scanLessonQuestionLinkCoverage } from "@/lib/lessons/lesson-question-link-coverage-core";

export type LessonGapSalvageItem = {
  examQuestionId: string;
  pathwayId: string;
  lessonSlug: string;
  lessonTitle: string;
  setTopic: string;
  setSubtopic: string;
  mergeTags: string[];
  priorTopic: string | null;
  priorSubtopic: string | null;
  priorTags: string[];
};

function uniqTags(tags: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const t of tags) {
    const s = t.trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

/**
 * Build an ordered list of topic/tag updates to raise under-covered lessons toward the minimum target.
 */
export async function buildLessonGapSalvagePlan(options: {
  pathwayFilter?: string | null;
  /** Hard cap on how many exam rows to touch */
  maxQuestionUpdates?: number;
}): Promise<{
  items: LessonGapSalvageItem[];
  notes: string[];
}> {
  const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-product-registry");
  const maxUpdates = options.maxQuestionUpdates ?? 2000;
  const notes: string[] = [
    "Salvage only targets published questions in the pathway marketing pool with empty topic and matching body_system.",
    "Each question id appears at most once. Re-run after --apply to measure new related counts.",
  ];

  const { rows } = await scanLessonQuestionLinkCoverage(options.pathwayFilter ?? null);
  const under = rows
    .filter((r) => r.relatedQuestionCount < RELATED_EXAM_QUESTIONS_MIN_TARGET)
    .sort((a, b) => a.relatedQuestionCount - b.relatedQuestionCount || a.pathwayId.localeCompare(b.pathwayId));

  const items: LessonGapSalvageItem[] = [];
  const assignedQuestionIds = new Set<string>();

  for (const row of under) {
    if (items.length >= maxUpdates) break;
    if (!row.bodySystem?.trim() || !row.topic?.trim()) {
      notes.push(`skip lesson (missing body_system or topic label): ${row.pathwayId}/${row.slug}`);
      continue;
    }

    const pathway = getExamPathwayById(row.pathwayId);
    if (!pathway) continue;

    let needed = RELATED_EXAM_QUESTIONS_MIN_TARGET - row.relatedQuestionCount;
    if (needed <= 0) continue;

    const base = pathwayExamQuestionMarketingWhere(pathway);
    const body = row.bodySystem.trim();

    while (needed > 0 && items.length < maxUpdates) {
      const batch = await prisma.examQuestion.findMany({
        where: {
          AND: [
            base,
            { bodySystem: { equals: body, mode: "insensitive" } },
            { OR: [{ topic: null }, { topic: "" }] },
            ...(assignedQuestionIds.size > 0 ? [{ id: { notIn: [...assignedQuestionIds] } }] : []),
          ],
        },
        orderBy: { updatedAt: "desc" },
        take: Math.min(60, needed * 6),
        select: { id: true, topic: true, subtopic: true, tags: true },
      });

      let progressed = false;
      for (const q of batch) {
        if (items.length >= maxUpdates) break;
        if (assignedQuestionIds.has(q.id)) continue;

        const mergeTags = uniqTags([...(q.tags ?? []), row.topicSlug.trim()]);
        const setTopic = row.topic.trim();
        const setSubtopic = (q.subtopic?.trim() || setTopic).trim();

        items.push({
          examQuestionId: q.id,
          pathwayId: row.pathwayId,
          lessonSlug: row.slug,
          lessonTitle: row.title,
          setTopic,
          setSubtopic,
          mergeTags,
          priorTopic: q.topic,
          priorSubtopic: q.subtopic,
          priorTags: [...(q.tags ?? [])],
        });
        assignedQuestionIds.add(q.id);
        needed -= 1;
        progressed = true;
        if (needed <= 0) break;
      }

      if (!progressed) break;
    }
  }

  return { items, notes };
}

export async function applyLessonGapSalvagePlan(items: LessonGapSalvageItem[]): Promise<{
  applied: number;
  failures: Array<{ id: string; message: string }>;
}> {
  const failures: Array<{ id: string; message: string }> = [];
  let applied = 0;

  for (const it of items) {
    try {
      await prisma.examQuestion.update({
        where: { id: it.examQuestionId },
        data: {
          topic: it.setTopic,
          subtopic: it.setSubtopic,
          tags: it.mergeTags,
        },
      });
      applied += 1;
    } catch (e) {
      failures.push({
        id: it.examQuestionId,
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return { applied, failures };
}

/** Re-verify counts for lessons touched by the plan (unique pathwayId+slug). */
export async function recountLessonsAfterSalvage(items: LessonGapSalvageItem[]): Promise<
  Array<{
    pathwayId: string;
    slug: string;
    relatedQuestionCount: number;
  }>
> {
  const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-product-registry");
  const keys = new Map<string, { pathwayId: string; slug: string }>();
  for (const it of items) {
    keys.set(`${it.pathwayId}:${it.lessonSlug}`, { pathwayId: it.pathwayId, slug: it.lessonSlug });
  }

  const out: Array<{ pathwayId: string; slug: string; relatedQuestionCount: number }> = [];
  for (const { pathwayId, slug } of keys.values()) {
    const pathway = getExamPathwayById(pathwayId);
    if (!pathway) continue;
    const L = await prisma.pathwayLesson.findFirst({
      where: { pathwayId, slug, locale: "en" },
      select: { title: true, topic: true, topicSlug: true, bodySystem: true },
    });
    if (!L) continue;
    const relatedQuestionCount = await countRelatedExamQuestionsForPathwayLesson({
      pathway,
      lessonTitle: L.title,
      lessonTopic: L.topic,
      lessonTopicSlug: L.topicSlug,
      bodySystem: L.bodySystem,
      lessonSlug: slug,
    });
    out.push({ pathwayId, slug, relatedQuestionCount });
  }
  return out.sort((a, b) => a.pathwayId.localeCompare(b.pathwayId) || a.slug.localeCompare(b.slug));
}

export { RELATED_EXAM_QUESTIONS_MIN_TARGET };
