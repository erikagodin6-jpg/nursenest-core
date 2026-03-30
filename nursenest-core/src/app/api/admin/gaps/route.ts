import { NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";

const LOW_THRESHOLD = 20;
const PUBLISHED = "published";
/** Max low-coverage topics returned (bounded response; count query still scans groups). */
const LOW_TOPIC_LIST_CAP = 350;

async function getGapsPayload() {
  const [lowTopicRows, lowTopicTotalRows, lessonCount, examsPerFamily] = await Promise.all([
    prisma.$queryRaw<{ topic: string | null; cnt: bigint }[]>`
      SELECT topic, COUNT(*)::bigint AS cnt
      FROM exam_questions
      WHERE status = ${PUBLISHED} AND topic IS NOT NULL
      GROUP BY topic
      HAVING COUNT(*) < ${LOW_THRESHOLD}
      ORDER BY COUNT(*) ASC
      LIMIT ${LOW_TOPIC_LIST_CAP}
    `,
    prisma.$queryRaw<{ n: bigint }[]>`
      SELECT COUNT(*)::bigint AS n FROM (
        SELECT topic FROM exam_questions
        WHERE status = ${PUBLISHED} AND topic IS NOT NULL
        GROUP BY topic
        HAVING COUNT(*) < ${LOW_THRESHOLD}
      ) t
    `,
    prisma.contentItem.count({
      where: { type: "lesson", status: PUBLISHED },
    }),
    prisma.exam.groupBy({
      by: ["examFamily"],
      _count: { examFamily: true },
      where: { status: ContentStatus.PUBLISHED },
    }),
  ]);

  const lowQuestionTopicsTotal = Number(lowTopicTotalRows[0]?.n ?? 0);
  const lowQuestionTopics = lowTopicRows.map((r) => ({
    topic: r.topic,
    publishedQuestions: Number(r.cnt),
  }));

  return {
    lowQuestionTopics,
    lowQuestionTopicsTruncated: lowQuestionTopicsTotal > lowQuestionTopics.length,
    lowQuestionTopicsTotal,
    lowQuestionTopicsListCap: LOW_TOPIC_LIST_CAP,
    lessonsPublished: lessonCount,
    publishedExamsByFamily: examsPerFamily,
    thresholds: { lowQuestionCount: LOW_THRESHOLD },
    note: "Flashcard↔lesson links live in `flashcard_bank.lesson_links` JSON in production; not modeled in Prisma yet. Low-topic list is SQL-capped; total reflects all sparse topics.",
  };
}

/** Coverage gaps: topic buckets with few published questions (production `exam_questions` has no Category FK). */
export async function GET() {
  const gate = await requireAdmin();
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
      note: "Flashcard↔lesson links live in `flashcard_bank.lesson_links` JSON in production; not modeled in Prisma yet.",
      degraded: true,
    } as Parameters<typeof NextResponse.json>[0]),
  );
}
