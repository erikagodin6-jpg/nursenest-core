import { NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { withPrismaReadFallback } from "@/lib/prisma/safe-reads";

const LOW_THRESHOLD = 20;
const PUBLISHED = "published";
/** Max low-coverage topics returned (bounded response; count query still scans groups). */
const LOW_TOPIC_LIST_CAP = 350;

async function getGapsPayload() {
  const lowTopicRows = await withPrismaReadFallback(
    "gaps_low_topics",
    () =>
      prisma.$queryRaw<{ topic: string | null; cnt: bigint }[]>`
      SELECT topic, COUNT(*)::bigint AS cnt
      FROM exam_questions
      WHERE status = ${PUBLISHED} AND topic IS NOT NULL
      GROUP BY topic
      HAVING COUNT(*) < ${LOW_THRESHOLD}
      ORDER BY COUNT(*) ASC
      LIMIT ${LOW_TOPIC_LIST_CAP}
    `,
    [],
  );
  const lowTopicTotalRows = await withPrismaReadFallback(
    "gaps_low_topics_total",
    () =>
      prisma.$queryRaw<{ n: bigint }[]>`
      SELECT COUNT(*)::bigint AS n FROM (
        SELECT topic FROM exam_questions
        WHERE status = ${PUBLISHED} AND topic IS NOT NULL
        GROUP BY topic
        HAVING COUNT(*) < ${LOW_THRESHOLD}
      ) t
    `,
    [] as { n: bigint }[],
  );
  const lessonCountRes = await withPrismaReadFallback(
    "gaps_lessons_published",
    () =>
      prisma.contentItem.count({
        where: { type: "lesson", status: PUBLISHED },
      }),
    0,
  );
  const examsPerFamilyRes = await withPrismaReadFallback(
    "gaps_exams_by_family",
    () =>
      prisma.exam.groupBy({
        by: ["examFamily"],
        _count: { examFamily: true },
        where: { status: ContentStatus.PUBLISHED },
      }),
    [],
  );

  const warnings = [
    lowTopicRows.warning,
    lowTopicTotalRows.warning,
    lessonCountRes.warning,
    examsPerFamilyRes.warning,
  ].filter(Boolean) as string[];

  const lowQuestionTopicsTotal = Number(lowTopicTotalRows.value[0]?.n ?? 0);
  const lowQuestionTopics = lowTopicRows.value.map((r) => ({
    topic: r.topic,
    publishedQuestions: Number(r.cnt),
  }));

  return {
    lowQuestionTopics,
    lowQuestionTopicsTruncated: lowQuestionTopicsTotal > lowQuestionTopics.length,
    lowQuestionTopicsTotal,
    lowQuestionTopicsListCap: LOW_TOPIC_LIST_CAP,
    lessonsPublished: lessonCountRes.value,
    publishedExamsByFamily: examsPerFamilyRes.value,
    thresholds: { lowQuestionCount: LOW_THRESHOLD },
    queryWarnings: warnings,
    note: "Flashcard↔lesson links live in `flashcard_bank.lesson_links` JSON in production; not modeled in Prisma yet. Low-topic list is SQL-capped; total reflects all sparse topics.",
  };
}

/** Coverage gaps: topic buckets with few published questions (production `exam_questions` has no Category FK). */
export async function GET() {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  return withDatabaseFallback(
    async () => NextResponse.json(await getGapsPayload()),
    NextResponse.json({
      lowQuestionTopics: [],
      lowQuestionTopicsTruncated: false,
      lowQuestionTopicsTotal: 0,
      lowQuestionTopicsListCap: LOW_TOPIC_LIST_CAP,
      lessonsPublished: 0,
      publishedExamsByFamily: [],
      thresholds: { lowQuestionCount: LOW_THRESHOLD },
      queryWarnings: [],
      note: "Flashcard↔lesson links live in `flashcard_bank.lesson_links` JSON in production; not modeled in Prisma yet.",
      degraded: true,
    } as Parameters<typeof NextResponse.json>[0]),
  );
}
