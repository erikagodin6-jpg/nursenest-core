import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallback } from "@/lib/db/safe-database";
import { CountryCode } from "@prisma/client";
import { pathwayLessonWordCount } from "@/lib/content-quality/classify-lesson";
import { NP_COVERAGE_THRESHOLDS } from "@/lib/np/np-coverage-thresholds";
import { classifyContentItemLesson } from "@/lib/content-quality/classify-lesson";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { getInventoryKeys } from "@/lib/education-images/inventory";

export type ContentQualitySnapshot = {
  generatedAt: string;
  examQuestionsPublished: {
    total: number;
    rationaleMissingOrEmpty: number;
    rationaleThinWords: number;
    rationaleAcceptableOrStrong: number;
  };
  /** Extra teaching-field coverage (published bank). */
  examQuestionTeachingFields?: {
    withCorrectAnswerExplanation: number;
    withDistractorNotes: number;
    withImagesJson: number;
    npCanadaPublished: number;
    npCanadaBelowTarget: boolean;
    npCanadaTarget: number;
  };
  pathwayLessonsPublished: {
    total: number;
    /** Sample up to N rows — thin count among sample (not full scan). */
    sampleSize: number;
    sampleThin: number;
    sampleAcceptable: number;
    sampleStrong: number;
  };
  contentItemLessonsPublished: {
    total: number;
    sampleSize: number;
    sampleThin: number;
    sampleAcceptable: number;
    sampleStrong: number;
  };
  /** Canada NP published rows grouped by `exam` (import pipeline codes). */
  npCanadaPublishedByExam?: Array<{ exam: string; count: number }>;
  /** Topics with the most published questions in the “thin rationale” band (0 < words < 120). */
  thinRationaleTopicsLeaderboard?: Array<{ topic: string | null; thinCount: number }>;
  /** Keys listed in `education-image-inventory.json` (CDN filename resolution). */
  educationImageInventoryKeyCount?: number;
  notes: string[];
};

/** Fallback when command center cannot load DB-backed quality metrics. */
export function emptyContentQualitySnapshot(generatedAt: string): ContentQualitySnapshot {
  return {
    generatedAt,
    examQuestionsPublished: {
      total: 0,
      rationaleMissingOrEmpty: 0,
      rationaleThinWords: 0,
      rationaleAcceptableOrStrong: 0,
    },
    pathwayLessonsPublished: {
      total: 0,
      sampleSize: 0,
      sampleThin: 0,
      sampleAcceptable: 0,
      sampleStrong: 0,
    },
    contentItemLessonsPublished: {
      total: 0,
      sampleSize: 0,
      sampleThin: 0,
      sampleAcceptable: 0,
      sampleStrong: 0,
    },
    notes: ["Metrics unavailable"],
  };
}

/**
 * Rationale word count via Postgres whitespace split (aligned with app `countWords` for normal prose).
 */
async function examQuestionTeachingFieldStats(): Promise<NonNullable<ContentQualitySnapshot["examQuestionTeachingFields"]>> {
  const rows = await prisma.$queryRaw<
    {
      with_cae: bigint;
      with_distractor: bigint;
      with_images: bigint;
      np_ca: bigint;
    }[]
  >`
    SELECT
      COUNT(*) FILTER (
        WHERE correct_answer_explanation IS NOT NULL AND trim(correct_answer_explanation) <> ''
      )::bigint AS with_cae,
      COUNT(*) FILTER (
        WHERE (distractor_rationales IS NOT NULL AND distractor_rationales::text NOT IN ('null', '[]', '{}'))
           OR (incorrect_answer_rationale IS NOT NULL AND incorrect_answer_rationale::text NOT IN ('null', '[]', '{}'))
      )::bigint AS with_distractor,
      COUNT(*) FILTER (WHERE images IS NOT NULL)::bigint AS with_images,
      COUNT(*) FILTER (WHERE tier = 'NP' AND country_code = ${CountryCode.CA})::bigint AS np_ca
    FROM exam_questions
    WHERE status = 'published'
  `;
  const r = rows[0];
  const np = Number(r?.np_ca ?? 0);
  return {
    withCorrectAnswerExplanation: Number(r?.with_cae ?? 0),
    withDistractorNotes: Number(r?.with_distractor ?? 0),
    withImagesJson: Number(r?.with_images ?? 0),
    npCanadaPublished: np,
    npCanadaBelowTarget: np < NP_COVERAGE_THRESHOLDS.canadaNpMinPublished,
    npCanadaTarget: NP_COVERAGE_THRESHOLDS.canadaNpMinPublished,
  };
}

async function npCanadaPublishedByExam(): Promise<NonNullable<ContentQualitySnapshot["npCanadaPublishedByExam"]>> {
  const rows = await prisma.$queryRaw<{ exam: string; c: bigint }[]>`
    SELECT exam, COUNT(*)::bigint AS c
    FROM exam_questions
    WHERE status = 'published' AND tier = 'NP' AND country_code = ${CountryCode.CA}
    GROUP BY exam
    ORDER BY c DESC
  `;
  return rows.map((r) => ({ exam: r.exam, count: Number(r.c) }));
}

async function thinRationaleTopicsLeaderboard(): Promise<
  NonNullable<ContentQualitySnapshot["thinRationaleTopicsLeaderboard"]>
> {
  const rows = await prisma.$queryRaw<{ topic: string | null; thin_count: bigint }[]>`
    WITH w AS (
      SELECT
        NULLIF(trim(topic), '') AS topic_label,
        CASE
          WHEN rationale IS NULL OR trim(rationale) = '' THEN 0
          ELSE cardinality(regexp_split_to_array(trim(regexp_replace(rationale, '\\s+', ' ', 'g')), ' '))
        END AS wc
      FROM exam_questions
      WHERE status = 'published'
    )
    SELECT topic_label AS topic, COUNT(*)::bigint AS thin_count
    FROM w
    WHERE wc > 0 AND wc < 120
    GROUP BY topic_label
    ORDER BY thin_count DESC NULLS LAST
    LIMIT 15
  `;
  return rows.map((r) => ({ topic: r.topic, thinCount: Number(r.thin_count) }));
}

async function examQuestionRationaleStats(): Promise<ContentQualitySnapshot["examQuestionsPublished"]> {
  const rows = await prisma.$queryRaw<
    { total: bigint; missing: bigint; thin: bigint; ok: bigint }[]
  >`
    WITH w AS (
      SELECT
        CASE
          WHEN rationale IS NULL OR trim(rationale) = '' THEN 0
          ELSE cardinality(regexp_split_to_array(trim(regexp_replace(rationale, '\\s+', ' ', 'g')), ' '))
        END AS wc
      FROM exam_questions
      WHERE status = 'published'
    )
    SELECT
      COUNT(*)::bigint AS total,
      COUNT(*) FILTER (WHERE wc = 0)::bigint AS missing,
      COUNT(*) FILTER (WHERE wc > 0 AND wc < 120)::bigint AS thin,
      COUNT(*) FILTER (WHERE wc >= 120)::bigint AS ok
    FROM w
  `;
  const r = rows[0];
  return {
    total: Number(r?.total ?? 0),
    rationaleMissingOrEmpty: Number(r?.missing ?? 0),
    rationaleThinWords: Number(r?.thin ?? 0),
    rationaleAcceptableOrStrong: Number(r?.ok ?? 0),
  };
}

export async function loadContentQualitySnapshot(): Promise<ContentQualitySnapshot> {
  const empty: ContentQualitySnapshot = {
    generatedAt: new Date().toISOString(),
    examQuestionsPublished: {
      total: -1,
      rationaleMissingOrEmpty: -1,
      rationaleThinWords: -1,
      rationaleAcceptableOrStrong: -1,
    },
    pathwayLessonsPublished: { total: -1, sampleSize: 0, sampleThin: -1, sampleAcceptable: -1, sampleStrong: -1 },
    contentItemLessonsPublished: { total: -1, sampleSize: 0, sampleThin: -1, sampleAcceptable: -1, sampleStrong: -1 },
    notes: [],
  };
  if (!isDatabaseUrlConfigured()) {
    empty.notes.push("DATABASE_URL not configured");
    return empty;
  }

  return withDatabaseFallback(async () => {
    const [
      examStats,
      teachingFields,
      pathwayTotal,
      contentTotal,
      npByExam,
      thinLeaderboard,
    ] = await Promise.all([
      examQuestionRationaleStats(),
      examQuestionTeachingFieldStats().catch(() => null),
      prisma.pathwayLesson.count({ where: { status: ContentStatus.PUBLISHED } }),
      prisma.contentItem.count({ where: { type: "lesson", status: "published" } }),
      npCanadaPublishedByExam().catch(() => []),
      thinRationaleTopicsLeaderboard().catch(() => []),
    ]);

    const SAMPLE = 800;
    const pathwayRows = await prisma.pathwayLesson.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { sections: true },
      take: SAMPLE,
      orderBy: { updatedAt: "desc" },
    });

    let pThin = 0;
    let pAcc = 0;
    let pStrong = 0;
    for (const row of pathwayRows) {
      const lesson = { sections: row.sections as PathwayLessonRecord["sections"] };
      const wc = pathwayLessonWordCount(lesson);
      if (wc < 500) pThin++;
      else if (wc < 700) pAcc++;
      else pStrong++;
    }

    const contentRows = await prisma.contentItem.findMany({
      where: { type: "lesson", status: "published" },
      select: { content: true },
      take: SAMPLE,
      orderBy: { updatedAt: "desc" },
    });

    let cThin = 0;
    let cAcc = 0;
    let cStrong = 0;
    for (const row of contentRows) {
      const q = classifyContentItemLesson(row.content);
      if (q.tier === "thin" || q.tier === "missing") cThin++;
      else if (q.tier === "acceptable") cAcc++;
      else cStrong++;
    }

    return {
      generatedAt: new Date().toISOString(),
      examQuestionsPublished: examStats,
      ...(teachingFields ? { examQuestionTeachingFields: teachingFields } : {}),
      npCanadaPublishedByExam: npByExam,
      thinRationaleTopicsLeaderboard: thinLeaderboard,
      educationImageInventoryKeyCount: getInventoryKeys().length,
      pathwayLessonsPublished: {
        total: pathwayTotal,
        sampleSize: pathwayRows.length,
        sampleThin: pThin,
        sampleAcceptable: pAcc,
        sampleStrong: pStrong,
      },
      contentItemLessonsPublished: {
        total: contentTotal,
        sampleSize: contentRows.length,
        sampleThin: cThin,
        sampleAcceptable: cAcc,
        sampleStrong: cStrong,
      },
      notes: [
        "Exam question counts use SQL word splits on `rationale` only (primary narrative field).",
        `Pathway/content lesson samples: last ${SAMPLE} updated rows, not a full corpus scan.`,
        "Filename-based concept images use `education-image-inventory.json`; per-question inventory matches are resolved at runtime, not stored in SQL.",
      ],
    };
  }, empty);
}
