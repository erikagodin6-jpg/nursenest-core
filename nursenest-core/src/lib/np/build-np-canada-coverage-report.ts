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
    withHttpsImages: number;
    withoutHttpsImages: number;
  };
  deficits: {
    topicsBelowThreshold: Array<{ topic: string; count: number; min: number; deficit: number }>;
    stemTypesBelowThreshold: Array<{ stemType: NpStemType; count: number; floor: number; deficit: number }>;
    topicTeachingDepthGaps: Array<{
      topic: string;
      total: number;
      lackingTeachingDepth: number;
      lackingRate: number;
    }>;
  };
  flags: {
    belowCanadaOverallMinimum: boolean;
    topicGaps: Array<{ topic: string; count: number; belowTopicMin: boolean }>;
    stemTypeThin: Array<{ stemType: NpStemType; count: number; belowFloor: boolean }>;
  };
  byTopic: Array<{ topic: string; count: number }>;
  byQuestionFormat: Array<{ questionFormat: string | null; count: number }>;
  inferredStemTypes: Record<NpStemType, number>;
  nextActions: {
    highestRiskTopicGaps: Array<{ topic: string; count: number; deficit: number; priorityScore: number }>;
    weakestStemTypeCoverage: Array<{ stemType: NpStemType; count: number; deficit: number; priorityScore: number }>;
    weakTeachingDepthWithVolume: Array<{
      topic: string;
      total: number;
      lackingTeachingDepth: number;
      lackingRate: number;
      priorityScore: number;
    }>;
  };
  notes: string[];
};

const STEM_INFERENCE_CAP = 6000;
const DETAIL_ROW_CAP = 12000;

function hasHttpsUrl(value: unknown): boolean {
  if (typeof value === "string") return /^https:\/\//i.test(value.trim());
  if (Array.isArray(value)) return value.some((v) => hasHttpsUrl(v));
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((v) => hasHttpsUrl(v));
  }
  return false;
}

function hasTeachingDepth(row: {
  rationale: string | null;
  correctAnswerExplanation: string | null;
  clinicalReasoning: string | null;
  keyTakeaway: string | null;
  distractorRationales: Prisma.JsonValue | null;
  incorrectAnswerRationale: Prisma.JsonValue | null;
}): boolean {
  const hasText = (v: string | null | undefined) => Boolean(v && v.trim().length > 0);
  const hasJson = (v: Prisma.JsonValue | null | undefined) =>
    v != null && JSON.stringify(v) !== "null" && JSON.stringify(v) !== "{}" && JSON.stringify(v) !== "[]";
  const score =
    Number(hasText(row.rationale)) +
    Number(hasText(row.correctAnswerExplanation)) +
    Number(hasText(row.clinicalReasoning)) +
    Number(hasText(row.keyTakeaway)) +
    Number(hasJson(row.distractorRationales)) +
    Number(hasJson(row.incorrectAnswerRationale));
  return score >= 2;
}

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

  const detailRowsRes = await withPrismaReadFallback(
    "np_ca_detail_rows",
    () =>
      prisma.examQuestion.findMany({
        where: baseWhere,
        select: {
          topic: true,
          stem: true,
          questionFormat: true,
          cognitiveLevel: true,
          questionType: true,
          rationale: true,
          correctAnswerExplanation: true,
          clinicalReasoning: true,
          keyTakeaway: true,
          distractorRationales: true,
          incorrectAnswerRationale: true,
          images: true,
        },
        take: DETAIL_ROW_CAP,
        orderBy: { updatedAt: "desc" },
      }),
    [],
  );
  pushWarnings(notes, detailRowsRes);

  for (const row of sampleRes.value) {
    const t = inferNpStemType(row);
    inferredStemTypes[t] += 1;
  }

  if (published > STEM_INFERENCE_CAP) {
    notes.push(
      `Stem-type mix inferred from the ${STEM_INFERENCE_CAP} most recently updated rows (published total ${published}).`,
    );
  }
  if (published > DETAIL_ROW_CAP) {
    notes.push(
      `Depth/image row diagnostics sampled from the ${DETAIL_ROW_CAP} most recently updated rows (published total ${published}).`,
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

  let withHttpsImages = 0;
  let withoutHttpsImages = 0;
  const topicDepth = new Map<string, { total: number; lacking: number }>();
  for (const row of detailRowsRes.value) {
    if (hasHttpsUrl(row.images)) withHttpsImages += 1;
    else withoutHttpsImages += 1;

    const topic = row.topic?.trim();
    if (!topic) continue;
    const agg = topicDepth.get(topic) ?? { total: 0, lacking: 0 };
    agg.total += 1;
    if (!hasTeachingDepth(row)) agg.lacking += 1;
    topicDepth.set(topic, agg);
  }

  const topicsBelowThreshold = topicGaps
    .filter((t) => t.belowTopicMin)
    .map((t) => ({
      topic: t.topic,
      count: t.count,
      min: NP_COVERAGE_THRESHOLDS.topicMin,
      deficit: Math.max(0, NP_COVERAGE_THRESHOLDS.topicMin - t.count),
    }))
    .sort((a, b) => b.deficit - a.deficit || a.count - b.count)
    .slice(0, 120);

  const stemTypesBelowThreshold = stemTypeThin
    .filter((s) => s.belowFloor)
    .map((s) => ({
      stemType: s.stemType,
      count: s.count,
      floor: NP_COVERAGE_THRESHOLDS.stemTypeFloor,
      deficit: Math.max(0, NP_COVERAGE_THRESHOLDS.stemTypeFloor - s.count),
    }))
    .sort((a, b) => b.deficit - a.deficit || a.count - b.count);

  const topicTeachingDepthGaps = [...topicDepth.entries()]
    .map(([topic, v]) => ({
      topic,
      total: v.total,
      lackingTeachingDepth: v.lacking,
      lackingRate: v.total > 0 ? Number((v.lacking / v.total).toFixed(4)) : 0,
    }))
    .filter((r) => r.lackingTeachingDepth > 0)
    .sort((a, b) => b.lackingRate - a.lackingRate || b.lackingTeachingDepth - a.lackingTeachingDepth)
    .slice(0, 120);

  const highestRiskTopicGaps = topicsBelowThreshold
    .map((r) => ({
      topic: r.topic,
      count: r.count,
      deficit: r.deficit,
      priorityScore: r.deficit * 10 + (r.count === 0 ? 50 : 0),
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 20);

  const weakestStemTypeCoverage = stemTypesBelowThreshold
    .map((r) => ({
      stemType: r.stemType,
      count: r.count,
      deficit: r.deficit,
      priorityScore: r.deficit * 10,
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 12);

  const weakTeachingDepthWithVolume = topicTeachingDepthGaps
    .filter((r) => r.total >= NP_COVERAGE_THRESHOLDS.topicMin)
    .map((r) => ({
      ...r,
      priorityScore: Math.round(r.lackingRate * 1000 + r.lackingTeachingDepth * 4),
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 20);

  return {
    thresholds: NP_COVERAGE_THRESHOLDS,
    filters: { status: PUBLISHED, tier: NP_TIER, countryCode: "CA" },
    totals: {
      published,
      qualifiedRaw,
      withImagesJson,
      withHttpsImages,
      withoutHttpsImages,
    },
    deficits: {
      topicsBelowThreshold,
      stemTypesBelowThreshold,
      topicTeachingDepthGaps,
    },
    flags: {
      belowCanadaOverallMinimum: published < NP_COVERAGE_THRESHOLDS.canadaNpMinPublished,
      topicGaps: topicGaps.filter((t) => t.belowTopicMin).slice(0, 80),
      stemTypeThin: stemTypeThin.filter((s) => s.belowFloor),
    },
    byTopic,
    byQuestionFormat,
    inferredStemTypes,
    nextActions: {
      highestRiskTopicGaps,
      weakestStemTypeCoverage,
      weakTeachingDepthWithVolume,
    },
    notes,
  };
}
