/**
 * Full cross-tier / cross-country content coverage audit (pathway lessons + bank).
 */
import { ContentStatus, CountryCode, ExamFamily, TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { loadAdminContentCoverageDashboard } from "@/lib/admin/load-admin-content-coverage-dashboard";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { getExamPathwayById, listExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  RELATED_EXAM_QUESTIONS_IDEAL_MIN,
  RELATED_EXAM_QUESTIONS_MIN_TARGET,
} from "@/lib/lessons/lesson-question-cross-links";
import {
  scanLessonQuestionLinkCoverageForPathways,
  type LessonQuestionLinkCoverageRow,
} from "@/lib/lessons/lesson-question-link-coverage-core";

/** Catalog pathway not yet in {@link listExamPathways}; uses US RN exam keys for bank linkage. */
export const NEW_GRAD_TRANSITION_PATHWAY_ID = "us-rn-new-grad-transition";

const UNTAGGED_TOPIC = "__untagged__";
const TOPIC_ROWS = 60;
const LESSON_TOPIC_INDEX_CAP = 20_000;
const ORPHAN_QUESTION_SCAN_CAP = 35_000;

export type ContentDomain = "RN" | "PN" | "NP" | "Allied" | "NewGrad";

const SYNTHETIC_NEW_GRAD_PATHWAY: ExamPathwayDefinition = {
  id: NEW_GRAD_TRANSITION_PATHWAY_ID,
  countrySlug: "us",
  countryCode: CountryCode.US,
  roleTrack: "rn",
  examCode: "new-grad-transition",
  examFamily: ExamFamily.NCLEX_RN,
  examKey: "NEW_GRAD_TRANSITION",
  displayName: "New Grad RN transition (catalog)",
  shortName: "New Grad",
  stripeTier: TierCode.RN,
  contentExamKeys: ["NCLEX-RN", "NCLEX_RN"],
  seoTitle: "",
  seoDescription: "",
  status: "active",
  acquisitionMode: "subscribe",
  internalNotes: "Synthetic registry row for audit only — matches US RN bank scope for related-question counts.",
};

export function resolvePathwayForFullAudit(pathwayId: string): ExamPathwayDefinition | undefined {
  return getExamPathwayById(pathwayId) ?? (pathwayId === NEW_GRAD_TRANSITION_PATHWAY_ID ? SYNTHETIC_NEW_GRAD_PATHWAY : undefined);
}

export function domainForPathway(pathwayId: string, pathway: ExamPathwayDefinition): ContentDomain {
  if (pathwayId === NEW_GRAD_TRANSITION_PATHWAY_ID) return "NewGrad";
  if (pathway.roleTrack === "allied") return "Allied";
  if (pathway.roleTrack === "np") return "NP";
  if (pathway.roleTrack === "rpn" || pathway.roleTrack === "lpn") return "PN";
  return "RN";
}

export type FullContentCoverageCriticalGaps = {
  /** Lessons with zero predicate-matched bank items */
  lessonRowsZeroBankLinks: number;
  /** Lessons with &lt; {@link RELATED_EXAM_QUESTIONS_MIN_TARGET} related questions */
  lessonRowsBelowMinTarget: number;
  /** Published questions (heuristic) whose topic/subtopic does not match any lesson index string */
  questionsNoLessonTopicMatch: number;
  questionsNoLessonTopicMatchCapped: boolean;
  /** Pathway ids with published EN lessons but no registry/synthetic resolution */
  unmappedPathwayIds: string[];
  unmappedLessonCount: number;
  /** Pathways with the most sub-min lessons (top 12) */
  topPathwaysBySubMinLessonCount: Array<{ pathwayId: string; subMinLessons: number; displayName?: string }>;
  /** Sample of worst lessons */
  sampleCriticalLessons: Array<Pick<LessonQuestionLinkCoverageRow, "pathwayId" | "slug" | "title" | "relatedQuestionCount">>;
};

export type FullContentCoverageAudit = {
  generatedAt: string;
  degraded: boolean;
  notes: string[];
  coverageStatus: "healthy" | "needs_attention" | "critical";
  /** Registry-only dashboard slice (sampled link stats, pathway readiness) */
  registryDashboard: Awaited<ReturnType<typeof loadAdminContentCoverageDashboard>>;
  /** Published EN pathway lessons grouped */
  lessonsPerCountry: Array<{ country: string; count: number }>;
  lessonsPerTier: Array<{ tier: string; count: number }>;
  lessonsPerDomain: Record<ContentDomain, number>;
  /** Global published bank distribution */
  questionsByTopic: Array<{ topic: string; count: number }>;
  /** Full lesson × link scan (all pathway ids that appear in DB + registry) */
  lessonLinkScan: {
    summary: Awaited<ReturnType<typeof scanLessonQuestionLinkCoverageForPathways>>["summary"];
    rowCount: number;
    pathwayIdsScanned: number;
  };
  criticalGaps: FullContentCoverageCriticalGaps;
  /** Capped lists for JSON (full grid = run lesson-question-link-coverage) */
  coverageGaps: {
    belowMinLessonsSample: LessonQuestionLinkCoverageRow[];
    idealBandGapLessonsSample: LessonQuestionLinkCoverageRow[];
  };
};

async function distinctPathwayIdsWithPublishedLessons(): Promise<string[]> {
  const rows = await prisma.pathwayLesson.groupBy({
    by: ["pathwayId"],
    where: { status: ContentStatus.PUBLISHED, locale: "en" },
    _count: { _all: true },
  });
  return rows.map((r) => r.pathwayId).sort((a, b) => a.localeCompare(b));
}

export async function buildFullContentCoverageAudit(): Promise<FullContentCoverageAudit> {
  const generatedAt = new Date().toISOString();
  const notes: string[] = [
    "Lesson ↔ bank counts use the same predicate as live lesson pages.",
    "Questions with no lesson links: heuristic — published rows where neither topic nor subtopic appears in a normalized index of lesson topic/topicSlug/bodySystem (cap on scan volume).",
    "Registry dashboard lesson-bank sample is first 200 lessons alphabetically (see dashboard notes).",
  ];
  let degraded = false;

  const registryDashboard = await loadAdminContentCoverageDashboard({
    country: "ALL",
    tier: "ALL",
    exam: "ALL",
    bodySystem: "ALL",
  });
  if (registryDashboard.degraded) degraded = true;

  const dbPathwayIds = await distinctPathwayIdsWithPublishedLessons();
  const registryIds = listExamPathways().map((p) => p.id);
  const pathwayIdsForScan = [...new Set([...registryIds, ...dbPathwayIds])].sort((a, b) => a.localeCompare(b));

  const { rows: linkRows, summary: linkSummary } = await scanLessonQuestionLinkCoverageForPathways(
    pathwayIdsForScan,
    resolvePathwayForFullAudit,
  );

  const lessonCountsByPathway = new Map(
    (
      await prisma.pathwayLesson.groupBy({
        by: ["pathwayId"],
        where: { status: ContentStatus.PUBLISHED, locale: "en" },
        _count: { _all: true },
      })
    ).map((r) => [r.pathwayId, r._count._all]),
  );

  const lessonsPerCountryMap = new Map<string, number>();
  const lessonsPerTierMap = new Map<string, number>();
  const lessonsPerDomain: Record<ContentDomain, number> = {
    RN: 0,
    PN: 0,
    NP: 0,
    Allied: 0,
    NewGrad: 0,
  };

  const unmappedPathwayIds: string[] = [];
  let unmappedLessonCount = 0;

  for (const [pathwayId, count] of lessonCountsByPathway) {
    const p = resolvePathwayForFullAudit(pathwayId);
    if (!p) {
      if (count > 0) {
        unmappedPathwayIds.push(pathwayId);
        unmappedLessonCount += count;
      }
      continue;
    }
    lessonsPerCountryMap.set(p.countryCode, (lessonsPerCountryMap.get(p.countryCode) ?? 0) + count);
    lessonsPerTierMap.set(p.stripeTier, (lessonsPerTierMap.get(p.stripeTier) ?? 0) + count);
    const d = domainForPathway(pathwayId, p);
    lessonsPerDomain[d] += count;
  }

  const lessonsPerCountry = [...lessonsPerCountryMap.entries()]
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => a.country.localeCompare(b.country));
  const lessonsPerTier = [...lessonsPerTierMap.entries()]
    .map(([tier, count]) => ({ tier, count }))
    .sort((a, b) => a.tier.localeCompare(b.tier));

  const topicGroups = await withDatabaseFallback(
    () =>
      prisma.examQuestion.groupBy({
        by: ["topic"],
        where: { status: DB_PUBLISHED },
        _count: { _all: true },
        orderBy: { _count: { topic: "desc" } },
        take: TOPIC_ROWS,
      }),
    [],
  ).catch(() => {
    degraded = true;
    return [];
  });

  const questionsByTopic = topicGroups.map((r) => ({
    topic: r.topic?.trim() ? String(r.topic) : UNTAGGED_TOPIC,
    count: r._count._all,
  }));

  const lessonTopicRows = await withDatabaseFallback(
    () =>
      prisma.pathwayLesson.findMany({
        where: { status: ContentStatus.PUBLISHED, locale: "en" },
        select: { topic: true, topicSlug: true, bodySystem: true },
        take: LESSON_TOPIC_INDEX_CAP,
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
  let orphanCapped = false;
  if (lessonTopicNorm.size > 0) {
    const publishedQs = await withDatabaseFallback(
      () =>
        prisma.examQuestion.findMany({
          where: { status: DB_PUBLISHED },
          select: { topic: true, subtopic: true },
          take: ORPHAN_QUESTION_SCAN_CAP,
        }),
      [],
    ).catch(() => {
      degraded = true;
      return [];
    });
    orphanCapped = publishedQs.length >= ORPHAN_QUESTION_SCAN_CAP;
    for (const q of publishedQs) {
      const top = q.topic?.trim().toLowerCase() ?? "";
      const sub = q.subtopic?.trim().toLowerCase() ?? "";
      const topOk = top.length > 0 && lessonTopicNorm.has(top);
      const subOk = sub.length > 0 && lessonTopicNorm.has(sub);
      if (!topOk && !subOk) orphanQuestionCount += 1;
    }
  }

  const subMinByPathway = new Map<string, number>();
  for (const r of linkRows) {
    if (r.relatedQuestionCount < RELATED_EXAM_QUESTIONS_MIN_TARGET) {
      subMinByPathway.set(r.pathwayId, (subMinByPathway.get(r.pathwayId) ?? 0) + 1);
    }
  }
  const topPathwaysBySubMin = [...subMinByPathway.entries()]
    .map(([pathwayId, subMinLessons]) => ({
      pathwayId,
      subMinLessons,
      displayName: resolvePathwayForFullAudit(pathwayId)?.displayName,
    }))
    .sort((a, b) => b.subMinLessons - a.subMinLessons)
    .slice(0, 12);

  const sampleCriticalLessons = [...linkRows]
    .filter((r) => r.relatedQuestionCount === 0)
    .slice(0, 40)
    .map((r) => ({
      pathwayId: r.pathwayId,
      slug: r.slug,
      title: r.title,
      relatedQuestionCount: r.relatedQuestionCount,
    }));

  const lessonRowsZero = linkRows.filter((r) => r.relatedQuestionCount === 0).length;
  const lessonRowsBelowMin = linkRows.filter((r) => r.relatedQuestionCount < RELATED_EXAM_QUESTIONS_MIN_TARGET).length;
  const totalLessonRows = linkRows.length;
  const pctBelowMin = totalLessonRows > 0 ? (lessonRowsBelowMin / totalLessonRows) * 100 : 0;

  const criticalGaps: FullContentCoverageCriticalGaps = {
    lessonRowsZeroBankLinks: lessonRowsZero,
    lessonRowsBelowMinTarget: lessonRowsBelowMin,
    questionsNoLessonTopicMatch: orphanQuestionCount,
    questionsNoLessonTopicMatchCapped: orphanCapped,
    unmappedPathwayIds: unmappedPathwayIds.sort(),
    unmappedLessonCount,
    topPathwaysBySubMinLessonCount: topPathwaysBySubMin,
    sampleCriticalLessons,
  };

  if (orphanCapped) {
    notes.push(`Orphan question scan capped at ${ORPHAN_QUESTION_SCAN_CAP} rows — count may be incomplete.`);
  }
  if (lessonTopicRows.length >= LESSON_TOPIC_INDEX_CAP) {
    notes.push(`Lesson topic index capped at ${LESSON_TOPIC_INDEX_CAP} rows — orphan heuristic may undercount matches.`);
  }
  if (unmappedPathwayIds.length) {
    notes.push(`${unmappedPathwayIds.length} pathway id(s) have lessons but no audit resolver (add to exam registry or synthetic list).`);
  }

  let coverageStatus: FullContentCoverageAudit["coverageStatus"] = "healthy";
  if (pctBelowMin >= 15 || lessonRowsZero >= 200 || orphanQuestionCount >= 8000 || unmappedLessonCount > 0) {
    coverageStatus = "critical";
  } else if (pctBelowMin >= 5 || lessonRowsZero >= 50 || orphanQuestionCount >= 2000) {
    coverageStatus = "needs_attention";
  }

  const belowMinLessonsSample = linkRows
    .filter((r) => r.relatedQuestionCount < RELATED_EXAM_QUESTIONS_MIN_TARGET)
    .sort((a, b) => a.relatedQuestionCount - b.relatedQuestionCount || a.pathwayId.localeCompare(b.pathwayId))
    .slice(0, 250);

  const idealBandGapLessonsSample = linkRows
    .filter(
      (r) =>
        r.relatedQuestionCount >= RELATED_EXAM_QUESTIONS_MIN_TARGET &&
        r.relatedQuestionCount < RELATED_EXAM_QUESTIONS_IDEAL_MIN,
    )
    .slice(0, 120);

  return {
    generatedAt,
    degraded: degraded || registryDashboard.degraded,
    notes,
    coverageStatus,
    registryDashboard,
    lessonsPerCountry,
    lessonsPerTier,
    lessonsPerDomain,
    questionsByTopic,
    lessonLinkScan: {
      summary: linkSummary,
      rowCount: linkRows.length,
      pathwayIdsScanned: pathwayIdsForScan.length - linkSummary.skippedPathways.length,
    },
    criticalGaps,
    coverageGaps: {
      belowMinLessonsSample,
      idealBandGapLessonsSample,
    },
  };
}
