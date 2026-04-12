/**
 * Admin content coverage dashboard — bounded aggregates + sampled lesson-question link checks.
 */
import { ContentStatus, CountryCode, TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayExamQuestionMarketingWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { countPathwayLessons } from "@/lib/lessons/pathway-lesson-loader";
import {
  countRelatedExamQuestionsForPathwayLesson,
  RELATED_EXAM_QUESTIONS_MIN_TARGET,
} from "@/lib/lessons/lesson-question-cross-links";
import { MIN_PATHWAY_LESSONS_SCALE_TARGET } from "@/lib/lessons/pathway-lesson-scale";

const MAX_LESSON_LINK_SCANS = 200;
const TOPIC_ROWS = 35;
const UNTAGGED_TOPIC = "__untagged__";

export type AdminContentCoverageFilter = {
  country: CountryCode | "ALL";
  tier: TierCode | "ALL";
  /** Substring match on pathway `contentExamKeys` or pathway id */
  exam: string | "ALL";
  /** Exact-ish match on pathway_lessons.body_system (published en) */
  bodySystem: string | "ALL";
};

export type PathwayCoverageReadinessRow = {
  pathwayId: string;
  displayName: string;
  countryCode: CountryCode;
  stripeTier: TierCode;
  publishedLessonsEn: number;
  effectiveLessons: number;
  pathwayPublishedQuestions: number;
  /** Sampled % of scanned lessons with ≥ {@link RELATED_EXAM_QUESTIONS_MIN_TARGET} bank matches; null if not sampled */
  pctLessonsMeetingMinQuestions: number | null;
  lessonsScannedForLinks: number;
  readinessScore: number;
  readinessLabel: "strong" | "moderate" | "weak";
};

export type AdminContentCoverageDashboard = {
  generatedAt: string;
  degraded: boolean;
  filter: AdminContentCoverageFilter;
  pathwaysMatched: number;
  /** Published `en` lessons in scope (body filter applied) */
  totalPublishedLessonsEn: number;
  lessonsPerCountry: Array<{ country: string; count: number }>;
  lessonsPerTier: Array<{ tier: string; count: number }>;
  questionsByTopic: Array<{ topic: string; count: number }>;
  lessonsWithNoQuestions: {
    scanned: number;
    countZero: number;
    sample: Array<{ pathwayId: string; slug: string; title: string }>;
  };
  questionsWithNoLessonTopicMatch: {
    count: number;
    note: string;
  };
  pathwayReadiness: PathwayCoverageReadinessRow[];
  notes: string[];
};

function normalizePathways(filter: AdminContentCoverageFilter): ExamPathwayDefinition[] {
  let list = EXAM_PATHWAYS;
  if (filter.country !== "ALL") list = list.filter((p) => p.countryCode === filter.country);
  if (filter.tier !== "ALL") list = list.filter((p) => p.stripeTier === filter.tier);
  if (filter.exam !== "ALL") {
    const q = filter.exam.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.contentExamKeys.some((k) => k.toLowerCase().includes(q)) ||
        p.examCode.toLowerCase().includes(q),
    );
  }
  return list;
}

function readinessLabel(score: number): PathwayCoverageReadinessRow["readinessLabel"] {
  if (score >= 75) return "strong";
  if (score >= 45) return "moderate";
  return "weak";
}

function readinessScoreForPathway(args: {
  effectiveLessons: number;
  pathwayPublishedQuestions: number;
  /** 0–100 from sampled lessons; null = infer from question density vs lessons */
  lessonLinkSamplePct: number | null;
  publishedLessonsEn: number;
}): number {
  const lessonPct = Math.min(1, args.effectiveLessons / Math.max(1, MIN_PATHWAY_LESSONS_SCALE_TARGET));
  const qPct = Math.min(1, args.pathwayPublishedQuestions / 200);
  const linkPct =
    args.lessonLinkSamplePct != null
      ? Math.min(1, args.lessonLinkSamplePct / 100)
      : Math.min(
          1,
          args.pathwayPublishedQuestions / Math.max(1, args.publishedLessonsEn * RELATED_EXAM_QUESTIONS_MIN_TARGET),
        );
  return Math.min(100, Math.round(lessonPct * 38 + qPct * 37 + linkPct * 25));
}

export async function loadAdminContentCoverageDashboard(
  filter: AdminContentCoverageFilter,
): Promise<AdminContentCoverageDashboard> {
  const generatedAt = new Date().toISOString();
  const notes: string[] = [];
  let degraded = false;

  const pathways = normalizePathways(filter);
  if (pathways.length === 0) {
    return {
      generatedAt,
      degraded: false,
      filter,
      pathwaysMatched: 0,
      totalPublishedLessonsEn: 0,
      lessonsPerCountry: [],
      lessonsPerTier: [],
      questionsByTopic: [],
      lessonsWithNoQuestions: { scanned: 0, countZero: 0, sample: [] },
      questionsWithNoLessonTopicMatch: { count: 0, note: "No pathways matched filters." },
      pathwayReadiness: [],
      notes: ["No pathways matched the current filters."],
    };
  }

  const pathwayIds = new Set(pathways.map((p) => p.id));
  const examKeyUnion = [...new Set(pathways.flatMap((p) => p.contentExamKeys))];

  const lessonWhere = {
    pathwayId: { in: [...pathwayIds] },
    status: ContentStatus.PUBLISHED,
    locale: "en",
    ...(filter.bodySystem !== "ALL" && filter.bodySystem.trim()
      ? { bodySystem: { equals: filter.bodySystem.trim(), mode: "insensitive" as const } }
      : {}),
  };

  const [perPathwayLessonCounts, topicGroups] = await Promise.all([
    withDatabaseFallback(
      () =>
        prisma.pathwayLesson.groupBy({
          by: ["pathwayId"],
          where: lessonWhere,
          _count: { _all: true },
        }),
      [],
    ).catch(() => {
      degraded = true;
      return [];
    }),
    examKeyUnion.length > 0
      ? withDatabaseFallback(
          () =>
            prisma.examQuestion.groupBy({
              by: ["topic"],
              where: {
                status: DB_PUBLISHED,
                exam: { in: examKeyUnion },
                ...(filter.bodySystem !== "ALL" && filter.bodySystem.trim()
                  ? { bodySystem: { equals: filter.bodySystem.trim(), mode: "insensitive" } }
                  : {}),
              },
              _count: { _all: true },
              orderBy: { _count: { topic: "desc" } },
              take: TOPIC_ROWS,
            }),
          [],
        ).catch(() => {
          degraded = true;
          return [];
        })
      : Promise.resolve([]),
  ]);

  const pubLessonsByPathway = new Map(perPathwayLessonCounts.map((r) => [r.pathwayId, r._count._all]));
  let totalPublishedLessonsEn = 0;
  for (const p of pathways) totalPublishedLessonsEn += pubLessonsByPathway.get(p.id) ?? 0;

  const lessonsPerCountryMap = new Map<string, number>();
  const lessonsPerTierMap = new Map<string, number>();
  for (const p of pathways) {
    const n = pubLessonsByPathway.get(p.id) ?? 0;
    lessonsPerCountryMap.set(p.countryCode, (lessonsPerCountryMap.get(p.countryCode) ?? 0) + n);
    lessonsPerTierMap.set(p.stripeTier, (lessonsPerTierMap.get(p.stripeTier) ?? 0) + n);
  }
  const lessonsPerCountry = [...lessonsPerCountryMap.entries()]
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => a.country.localeCompare(b.country));
  const lessonsPerTier = [...lessonsPerTierMap.entries()]
    .map(([tier, count]) => ({ tier, count }))
    .sort((a, b) => a.tier.localeCompare(b.tier));

  const questionsByTopic = topicGroups
    .map((r) => ({
      topic: r.topic?.trim() ? String(r.topic) : UNTAGGED_TOPIC,
      count: r._count._all,
    }))
    .sort((a, b) => b.count - a.count);

  /** Lesson topic index for orphan question heuristic (per filtered pathways) */
  const lessonTopicRows = await withDatabaseFallback(
    () =>
      prisma.pathwayLesson.findMany({
        where: {
          pathwayId: { in: [...pathwayIds] },
          status: ContentStatus.PUBLISHED,
          locale: "en",
        },
        select: { topic: true, topicSlug: true, bodySystem: true },
        take: 12_000,
      }),
    [],
  ).catch(() => {
    degraded = true;
    return [];
  });

  const lessonTopicNorm = new Set<string>();
  for (const row of lessonTopicRows) {
    const t = row.topic?.trim().toLowerCase();
    if (t) lessonTopicNorm.add(t);
    const slug = row.topicSlug?.trim().toLowerCase();
    if (slug) {
      lessonTopicNorm.add(slug.replace(/-/g, " "));
      lessonTopicNorm.add(slug);
    }
    const bs = row.bodySystem?.trim().toLowerCase();
    if (bs) lessonTopicNorm.add(bs);
  }

  let orphanQuestionCount = 0;
  if (examKeyUnion.length > 0 && lessonTopicNorm.size > 0) {
    const publishedInExams = await withDatabaseFallback(
      () =>
        prisma.examQuestion.findMany({
          where: {
            status: DB_PUBLISHED,
            exam: { in: examKeyUnion },
            ...(filter.bodySystem !== "ALL" && filter.bodySystem.trim()
              ? { bodySystem: { equals: filter.bodySystem.trim(), mode: "insensitive" } }
              : {}),
          },
          select: { topic: true, subtopic: true },
          take: 25_000,
        }),
      [],
    ).catch(() => {
      degraded = true;
      return [];
    });

    for (const q of publishedInExams) {
      const top = q.topic?.trim().toLowerCase() ?? "";
      const sub = q.subtopic?.trim().toLowerCase() ?? "";
      const topOk = top.length > 0 && lessonTopicNorm.has(top);
      const subOk = sub.length > 0 && lessonTopicNorm.has(sub);
      if (!topOk && !subOk) orphanQuestionCount += 1;
    }
    if (publishedInExams.length >= 25_000) {
      notes.push("Question vs lesson topic match capped at 25k rows — counts may be incomplete.");
    }
  }

  /** Sample lessons for link coverage */
  const lessonSample = await withDatabaseFallback(
    () =>
      prisma.pathwayLesson.findMany({
        where: lessonWhere,
        select: {
          pathwayId: true,
          slug: true,
          title: true,
          topic: true,
          topicSlug: true,
          bodySystem: true,
        },
        orderBy: [{ pathwayId: "asc" }, { slug: "asc" }],
        take: MAX_LESSON_LINK_SCANS,
      }),
    [],
  ).catch(() => {
    degraded = true;
    return [];
  });

  const pathwayById = new Map(pathways.map((p) => [p.id, p]));
  const counts = await Promise.all(
    lessonSample.map(async (L) => {
      const pathway = pathwayById.get(L.pathwayId);
      if (!pathway) return { slug: L.slug, pathwayId: L.pathwayId, n: 0 };
      const n = await countRelatedExamQuestionsForPathwayLesson({
        pathway,
        lessonTitle: L.title,
        lessonTopic: L.topic,
        lessonTopicSlug: L.topicSlug,
        bodySystem: L.bodySystem,
        lessonSlug: L.slug,
      });
      return { slug: L.slug, pathwayId: L.pathwayId, n };
    }),
  );

  const countZero = counts.filter((c) => c.n === 0).length;

  const zeroSample = counts
    .filter((c) => c.n === 0)
    .slice(0, 25)
    .map((c) => {
      const row = lessonSample.find((x) => x.pathwayId === c.pathwayId && x.slug === c.slug);
      return {
        pathwayId: c.pathwayId,
        slug: c.slug,
        title: row?.title ?? c.slug,
      };
    });

  /** Per-pathway readiness */
  const pathwayReadiness: PathwayCoverageReadinessRow[] = [];
  for (const p of pathways) {
    const publishedLessonsEn = pubLessonsByPathway.get(p.id) ?? 0;
    let effectiveLessons = publishedLessonsEn;
    try {
      const eff = await countPathwayLessons(p.id);
      if (eff >= 0) effectiveLessons = eff;
    } catch {
      degraded = true;
    }

    const baseWhere = pathwayExamQuestionMarketingWhere(p);
    let pathwayPublishedQuestions = 0;
    try {
      pathwayPublishedQuestions = await prisma.examQuestion.count({
        where: { AND: [baseWhere, { status: DB_PUBLISHED }] },
      });
    } catch {
      degraded = true;
    }

    const sampleForPathway = counts.filter((c) => c.pathwayId === p.id);
    const pctLessonsMeetingMinQuestions =
      sampleForPathway.length > 0
        ? Math.round(
            (sampleForPathway.filter((s) => s.n >= RELATED_EXAM_QUESTIONS_MIN_TARGET).length / sampleForPathway.length) *
              1000,
          ) / 10
        : null;

    const readinessScore = readinessScoreForPathway({
      publishedLessonsEn,
      effectiveLessons,
      pathwayPublishedQuestions,
      lessonLinkSamplePct: pctLessonsMeetingMinQuestions,
    });

    pathwayReadiness.push({
      pathwayId: p.id,
      displayName: p.displayName,
      countryCode: p.countryCode,
      stripeTier: p.stripeTier,
      publishedLessonsEn,
      effectiveLessons,
      pathwayPublishedQuestions,
      pctLessonsMeetingMinQuestions,
      lessonsScannedForLinks: sampleForPathway.length,
      readinessScore,
      readinessLabel: readinessLabel(readinessScore),
    });
  }

  pathwayReadiness.sort(
    (a, b) => a.countryCode.localeCompare(b.countryCode) || b.readinessScore - a.readinessScore,
  );

  notes.push(
    `Lesson-bank link sample: first ${lessonSample.length} published EN lessons in filter (alphabetical). ` +
      `${countZero} with zero predicate-matched questions in sample.`,
  );
  notes.push(
    "Questions with no lesson topic match: published rows in selected exam keys where neither topic nor subtopic matches the lesson topic/topicSlug/bodySystem index (heuristic).",
  );

  return {
    generatedAt,
    degraded,
    filter,
    pathwaysMatched: pathways.length,
    totalPublishedLessonsEn,
    lessonsPerCountry,
    lessonsPerTier,
    questionsByTopic,
    lessonsWithNoQuestions: {
      scanned: lessonSample.length,
      countZero,
      sample: zeroSample,
    },
    questionsWithNoLessonTopicMatch: {
      count: orphanQuestionCount,
      note: "Compared question topic/subtopic to lesson topic/topicSlug/bodySystem index for filtered pathways.",
    },
    pathwayReadiness,
    notes,
  };
}
