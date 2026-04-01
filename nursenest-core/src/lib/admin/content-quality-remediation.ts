import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallback } from "@/lib/db/safe-database";
import { classifyContentItemLesson } from "@/lib/content-quality/classify-lesson";

export type ThinQuestionRow = {
  id: string;
  exam: string;
  topic: string | null;
  wordCount: number;
  updatedAt: string;
};

export type NewestLowQualityQuestionRow = ThinQuestionRow & { tier: "missing" | "thin" };

export type ThinContentLessonRow = {
  id: string;
  title: string;
  wordCount: number;
  updatedAt: string;
};

export type RemediationReport = {
  generatedAt: string;
  thinQuestionsByExam: Array<{ exam: string; thinOrMissing: number; total: number }>;
  weakStemByExam: Array<{ exam: string; weakStem: number; total: number }>;
  weakByTopic: Array<{ exam: string; topic: string; weakCount: number }>;
  thinQuestionsSample: ThinQuestionRow[];
  newestPoorQuestions: NewestLowQualityQuestionRow[];
  thinContentLessonsSample: ThinContentLessonRow[];
  priorityMessage: string;
};

export async function loadRemediationReport(): Promise<RemediationReport | null> {
  if (!isDatabaseUrlConfigured()) return null;

  return withDatabaseFallback(async () => {
    const byExam = await prisma.$queryRaw<{ exam: string; bad: bigint; total: bigint }[]>`
      WITH w AS (
        SELECT exam,
          CASE
            WHEN rationale IS NULL OR trim(rationale) = '' THEN 0
            ELSE cardinality(regexp_split_to_array(trim(regexp_replace(rationale, '\\s+', ' ', 'g')), ' '))
          END AS wc
        FROM exam_questions
        WHERE status = 'published'
      )
      SELECT exam,
        COUNT(*) FILTER (WHERE wc < 120)::bigint AS bad,
        COUNT(*)::bigint AS total
      FROM w
      GROUP BY exam
      ORDER BY bad DESC NULLS LAST
      LIMIT 20
    `;

    const thinSample = await prisma.$queryRaw<
      { id: string; exam: string; topic: string | null; wc: bigint; updated_at: Date }[]
    >`
      WITH w AS (
        SELECT id, exam, topic, updated_at,
          CASE
            WHEN rationale IS NULL OR trim(rationale) = '' THEN 0
            ELSE cardinality(regexp_split_to_array(trim(regexp_replace(rationale, '\\s+', ' ', 'g')), ' '))
          END AS wc
        FROM exam_questions
        WHERE status = 'published'
      )
      SELECT id, exam, topic, wc, updated_at
      FROM w
      WHERE wc > 0 AND wc < 120
      ORDER BY wc ASC, updated_at DESC
      LIMIT 25
    `;

    const weakStemByExam = await prisma.$queryRaw<{ exam: string; weak_stem: bigint; total: bigint }[]>`
      SELECT exam,
        COUNT(*) FILTER (WHERE stem IS NULL OR LENGTH(TRIM(stem)) < 24)::bigint AS weak_stem,
        COUNT(*)::bigint AS total
      FROM exam_questions
      WHERE status = 'published'
      GROUP BY exam
      ORDER BY weak_stem DESC, total DESC
      LIMIT 20
    `;

    const weakByTopic = await prisma.$queryRaw<{ exam: string; topic: string | null; weak_count: bigint }[]>`
      WITH w AS (
        SELECT
          exam,
          topic,
          CASE
            WHEN rationale IS NULL OR trim(rationale) = '' THEN 0
            ELSE cardinality(regexp_split_to_array(trim(regexp_replace(rationale, '\\s+', ' ', 'g')), ' '))
          END AS wc
        FROM exam_questions
        WHERE status = 'published'
      )
      SELECT exam, topic, COUNT(*)::bigint AS weak_count
      FROM w
      WHERE wc < 120
      GROUP BY exam, topic
      ORDER BY weak_count DESC
      LIMIT 30
    `;

    const newestPoor = await prisma.$queryRaw<
      { id: string; exam: string; topic: string | null; wc: bigint; updated_at: Date }[]
    >`
      WITH w AS (
        SELECT id, exam, topic, updated_at,
          CASE
            WHEN rationale IS NULL OR trim(rationale) = '' THEN 0
            ELSE cardinality(regexp_split_to_array(trim(regexp_replace(rationale, '\\s+', ' ', 'g')), ' '))
          END AS wc
        FROM exam_questions
        WHERE status = 'published'
      )
      SELECT id, exam, topic, wc, updated_at
      FROM w
      WHERE wc < 120
      ORDER BY updated_at DESC
      LIMIT 20
    `;

    const contentRows = await prisma.contentItem.findMany({
      where: { type: "lesson", status: "published" },
      select: { id: true, title: true, content: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 120,
    });
    const thinContentLessonsSample: ThinContentLessonRow[] = contentRows
      .map((r) => ({ r, q: classifyContentItemLesson(r.content) }))
      .filter((x) => x.q.tier === "thin" || x.q.tier === "missing")
      .slice(0, 15)
      .map((x) => ({
        id: x.r.id,
        title: x.r.title,
        wordCount: x.q.wordCount,
        updatedAt: x.r.updatedAt.toISOString(),
      }));

    const thinQuestionsSample: ThinQuestionRow[] = thinSample.map((r) => ({
      id: r.id,
      exam: r.exam,
      topic: r.topic,
      wordCount: Number(r.wc),
      updatedAt: r.updated_at.toISOString(),
    }));

    const newestPoorQuestions: NewestLowQualityQuestionRow[] = newestPoor.map((r) => ({
      id: r.id,
      exam: r.exam,
      topic: r.topic,
      wordCount: Number(r.wc),
      updatedAt: r.updated_at.toISOString(),
      tier: Number(r.wc) <= 0 ? "missing" : "thin",
    }));

    const thinSum = byExam.reduce((s, r) => s + Number(r.bad), 0);

    return {
      generatedAt: new Date().toISOString(),
      thinQuestionsByExam: byExam.map((r) => ({
        exam: r.exam,
        thinOrMissing: Number(r.bad),
        total: Number(r.total),
      })),
      weakStemByExam: weakStemByExam.map((r) => ({
        exam: r.exam,
        weakStem: Number(r.weak_stem),
        total: Number(r.total),
      })),
      weakByTopic: weakByTopic.map((r) => ({
        exam: r.exam,
        topic: r.topic ?? "Uncategorized",
        weakCount: Number(r.weak_count),
      })),
      thinQuestionsSample,
      newestPoorQuestions,
      thinContentLessonsSample,
      priorityMessage:
        thinSum > 800
          ? "Large backlog of thin rationales — prioritize worst exams and newest edits first."
          : "Use exam rollups to prioritize; sample lists link to REST IDs for your editor workflow.",
    };
  }, null);
}
