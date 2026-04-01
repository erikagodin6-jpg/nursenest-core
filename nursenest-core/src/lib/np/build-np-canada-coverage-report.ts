import type { Prisma } from "@prisma/client";
import { CountryCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withPrismaReadFallback } from "@/lib/prisma/safe-reads";
import { NP_COVERAGE_THRESHOLDS } from "@/lib/np/np-coverage-thresholds";
import { inferNpStemType, type NpStemType } from "@/lib/np/np-question-classification";

function pushWarnings(notes: string[], ...pairs: Array<{ warning?: string }>) {
  for (const p of pairs) {
    if (p.warning) notes.push(p.warning);
  }
}

const PUBLISHED = "published";
const NP_TIER = "NP";

/** Qualified = has non-empty explanatory text in any primary rationale field (aligns with grading payload). */
function qualifiedWhere(): Prisma.ExamQuestionWhereInput {
  return {
    OR: [
      { rationale: { not: null } },
      { correctAnswerExplanation: { not: null } },
      { clinicalReasoning: { not: null } },
      { keyTakeaway: { not: null } },
    ],
  };
}

export type NpCanadaCoverageReport = {
  thresholds: typeof NP_COVERAGE_THRESHOLDS;
  filters: { status: string; tier: string; countryCode: string };
  totals: {
    published: number;
    /** Rows with at least one rationale field populated (may still be thin — see content-quality elsewhere). */
    qualifiedRaw: number;
    withImagesJson: number;
  };
  flags: {
    belowCanadaOverallMinimum: boolean;
    topicGaps: Array<{ topic: string; count: number; belowTopicMin: boolean }>;
    stemTypeThin: Array<{ stemType: NpStemType; count: number; belowFloor: boolean }>;
  };
  byTopic: Array<{ topic: string; count: number }>;
  byQuestionFormat: Array<{ questionFormat: string | null; count: number }>;
  inferredStemTypes: Record<NpStemType, number>;
  notes: string[];
};

const STEM_INFERENCE_CAP = 6000;

export async function buildNpCanadaCoverageReport(): Promise<NpCanadaCoverageReport> {
  const baseWhere = {
    status: PUBLISHED,
    tier: NP_TIER,
    countryCode: CountryCode.CA,
  };

  const notes: string[] = [];

  const publishedRes = await withPrismaReadFallback(
    "np_ca_published_count",
    () => prisma.examQuestion.count({ where: baseWhere }),
    0,
  );
  const qualifiedRes = await withPrismaReadFallback(
    "np_ca_qualified_count",
    () =>
      prisma.examQuestion.count({
        where: { AND: [baseWhere, qualifiedWhere()] },
      }),
    0,
  );
  const imagesRes = await withPrismaReadFallback(
    "np_ca_images_count",
    () =>
      prisma.$queryRaw<{ n: bigint }[]>`
        SELECT COUNT(*)::bigint AS n
        FROM exam_questions
        WHERE status = ${PUBLISHED}
          AND tier = ${NP_TIER}
          AND country_code = ${CountryCode.CA}
          AND images IS NOT NULL
      `.then((rows) => Number(rows[0]?.n ?? 0)),
    0,
  );

  pushWarnings(notes, publishedRes, qualifiedRes, imagesRes);

  const published = publishedRes.value;
  const qualifiedRaw = qualifiedRes.value;
  const withImagesJson = imagesRes.value;

  const topicGroupsRes = await withPrismaReadFallback(
    "np_ca_by_topic",
    () =>
      prisma.examQuestion.groupBy({
        by: ["topic"],
        where: { ...baseWhere, topic: { not: null }, NOT: { topic: "" } },
        _count: { _all: true },
        orderBy: { _count: { topic: "desc" } },
        take: 200,
      }),
    [],
  );

  const formatGroupsRes = await withPrismaReadFallback(
    "np_ca_by_format",
    () =>
      prisma.examQuestion.groupBy({
        by: ["questionFormat"],
        where: baseWhere,
        _count: { _all: true },
      }),
    [],
  );

  pushWarnings(notes, topicGroupsRes, formatGroupsRes);

  const inferredStemTypes: Record<NpStemType, number> = {
    diagnosis: 0,
    next_step: 0,
    management: 0,
    pharmacology: 0,
    interpretation: 0,
    prioritization: 0,
    unmapped: 0,
  };

  const sampleRes = await withPrismaReadFallback(
    "np_ca_stem_sample",
    () =>
      prisma.examQuestion.findMany({
        where: baseWhere,
        select: {
          stem: true,
          questionFormat: true,
          cognitiveLevel: true,
          questionType: true,
        },
        take: STEM_INFERENCE_CAP,
        orderBy: { updatedAt: "desc" },
      }),
    [],
  );

  pushWarnings(notes, sampleRes);

  for (const row of sampleRes.value) {
    const t = inferNpStemType(row);
    inferredStemTypes[t] += 1;
  }

  if (published > STEM_INFERENCE_CAP) {
    notes.push(
      `Stem-type mix inferred from the ${STEM_INFERENCE_CAP} most recently updated rows (published total ${published}).`,
    );
  }

  const byTopic = topicGroupsRes.value
    .filter((g): g is typeof g & { topic: string } => g.topic != null)
    .map((g) => ({ topic: g.topic, count: g._count._all }));

  const topicGaps = byTopic.map((t) => ({
    topic: t.topic,
    count: t.count,
    belowTopicMin: t.count < NP_COVERAGE_THRESHOLDS.topicMin,
  }));

  const stemTypeThin = (Object.keys(inferredStemTypes) as NpStemType[]).map((stemType) => ({
    stemType,
    count: inferredStemTypes[stemType],
    belowFloor:
      stemType !== "unmapped" && inferredStemTypes[stemType] < NP_COVERAGE_THRESHOLDS.stemTypeFloor,
  }));

  const byQuestionFormat = formatGroupsRes.value.map((g) => ({
    questionFormat: g.questionFormat,
    count: g._count._all,
  }));

  return {
    thresholds: NP_COVERAGE_THRESHOLDS,
    filters: { status: PUBLISHED, tier: NP_TIER, countryCode: "CA" },
    totals: {
      published,
      qualifiedRaw,
      withImagesJson,
    },
    flags: {
      belowCanadaOverallMinimum: published < NP_COVERAGE_THRESHOLDS.canadaNpMinPublished,
      topicGaps: topicGaps.filter((t) => t.belowTopicMin).slice(0, 80),
      stemTypeThin: stemTypeThin.filter((s) => s.belowFloor),
    },
    byTopic,
    byQuestionFormat,
    inferredStemTypes,
    notes,
  };
}
