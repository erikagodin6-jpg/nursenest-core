/**
 * Pathway-level blueprint vs inventory audit (read-only aggregates).
 * Does not touch CAT, grading, or entitlements — reporting only.
 */
import { CountryCode, Prisma } from "@prisma/client";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { examQuestionTierStringsForProfileTier } from "@/lib/entitlements/accessible-tiers";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { ContentStatus } from "@prisma/client";
import { inferPathwayFamilyFromExamKeys } from "@/lib/questions/question-bank-taxonomy";
import { RATIONALE_MIN_WORDS } from "@/lib/questions/question-bank-coverage-thresholds";
import type { BlueprintDomainId } from "./blueprint-domain";
import { BLUEPRINT_DOMAIN_LABELS } from "./blueprint-domain";
import type { ClinicalSystemId } from "./clinical-system-id";
import { CLINICAL_SYSTEM_LABELS } from "./clinical-system-id";
import {
  inferBlueprintDomainForRow,
  inferClinicalSystemForRow,
  inferMedicationBuckets,
  type QuestionRowForBlueprint,
} from "./infer-blueprint-from-question-row";
import {
  BLUEPRINT_REPORT_PATHWAY_IDS,
  buildPathwayBlueprintProfile,
  type PathwayBlueprintProfile,
} from "./pathway-blueprint-profiles";
import { classifyCoverage } from "./coverage-status";
import { buildGapBacklog, recommendedFirstAdditions } from "./gap-prioritization";
import type {
  BlueprintDomainCoverageRow,
  BlueprintSystemCoverageRow,
  ExamBlueprintCoverageReport,
  PathwayBlueprintReport,
} from "./blueprint-report-types";

export type {
  BlueprintDomainCoverageRow,
  BlueprintSystemCoverageRow,
  ExamBlueprintCoverageReport,
  PathwayBlueprintReport,
} from "./blueprint-report-types";

const DB_TIMEOUT_MS = 35_000;

type AggRow = {
  topic: string | null;
  subtopic: string | null;
  body_system: string | null;
  exam: string | null;
  nclex_client_needs_category: string | null;
  cnt: bigint;
};

function regionSql(country: CountryCode): Prisma.Sql {
  if (country === CountryCode.US) {
    return Prisma.sql` AND (region_scope IS NULL OR region_scope IN ('BOTH', 'US_ONLY'))`;
  }
  return Prisma.sql` AND (region_scope IS NULL OR region_scope IN ('BOTH', 'CA_ONLY'))`;
}

function countrySql(country: CountryCode): Prisma.Sql {
  if (country === CountryCode.US) {
    return Prisma.sql` AND (country_code IS NULL OR country_code = 'US')`;
  }
  return Prisma.sql` AND (country_code IS NULL OR country_code = 'CA')`;
}

async function loadAggregatedGroups(pathway: ExamPathwayDefinition): Promise<AggRow[]> {
  const keys = [...new Set(pathway.contentExamKeys)];
  if (keys.length === 0) return [];
  const tiers = examQuestionTierStringsForProfileTier(pathway.stripeTier);
  if (tiers.length === 0) return [];

  return prisma.$queryRaw<AggRow[]>`
    SELECT topic, subtopic, body_system, exam, nclex_client_needs_category, COUNT(*)::bigint AS cnt
    FROM exam_questions
    WHERE status = ${DB_PUBLISHED}
      AND exam IN (${Prisma.join(keys)})
      AND tier IN (${Prisma.join(tiers)})
      ${regionSql(pathway.countryCode)}
      ${countrySql(pathway.countryCode)}
    GROUP BY topic, subtopic, body_system, exam, nclex_client_needs_category
  `;
}

async function loadQuality(pathway: ExamPathwayDefinition): Promise<{
  publishedInScope: number;
  thinRationale: number;
  missingRationale: number;
}> {
  const keys = [...new Set(pathway.contentExamKeys)];
  if (keys.length === 0) return { publishedInScope: 0, thinRationale: 0, missingRationale: 0 };
  const tiers = examQuestionTierStringsForProfileTier(pathway.stripeTier);
  if (tiers.length === 0) return { publishedInScope: 0, thinRationale: 0, missingRationale: 0 };

  const rows = await prisma.$queryRaw<
    Array<{ n: bigint; thin: bigint; miss: bigint }>
  >`
    SELECT
      COUNT(*)::bigint AS n,
      COUNT(*) FILTER (
        WHERE rationale IS NOT NULL AND TRIM(rationale) <> ''
        AND (LENGTH(TRIM(rationale)) - LENGTH(REPLACE(TRIM(rationale), ' ', '')) + 1) < ${RATIONALE_MIN_WORDS}
      )::bigint AS thin,
      COUNT(*) FILTER (WHERE rationale IS NULL OR TRIM(COALESCE(rationale, '')) = '')::bigint AS miss
    FROM exam_questions
    WHERE status = ${DB_PUBLISHED}
      AND exam IN (${Prisma.join(keys)})
      AND tier IN (${Prisma.join(tiers)})
      ${regionSql(pathway.countryCode)}
      ${countrySql(pathway.countryCode)}
  `;
  const r = rows[0];
  if (!r) return { publishedInScope: 0, thinRationale: 0, missingRationale: 0 };
  return {
    publishedInScope: Number(r.n),
    thinRationale: Number(r.thin),
    missingRationale: Number(r.miss),
  };
}

async function loadLessonTopicCounts(pathwayId: string): Promise<Map<string, number>> {
  const rows = await prisma.pathwayLesson.groupBy({
    by: ["topicSlug"],
    where: { pathwayId, status: ContentStatus.PUBLISHED, locale: "en" },
    _count: { _all: true },
  });
  return new Map(rows.map((r) => [r.topicSlug, r._count._all]));
}

function rollupDomainsAndSystems(
  pathway: ExamPathwayDefinition,
  profile: PathwayBlueprintProfile,
  groups: AggRow[],
): {
  publishedTotal: number;
  domainCounts: Map<BlueprintDomainId, number>;
  systemCounts: Map<ClinicalSystemId, number>;
  medBucketHits: Set<string>;
  cjProxy: number;
} {
  const family = inferPathwayFamilyFromExamKeys(pathway.contentExamKeys);
  const domainCounts = new Map<BlueprintDomainId, number>();
  const systemCounts = new Map<ClinicalSystemId, number>();
  const medBucketHits = new Set<string>();
  let publishedTotal = 0;
  let cjProxy = 0;

  for (const g of groups) {
    const cnt = Number(g.cnt);
    if (!Number.isFinite(cnt) || cnt <= 0) continue;
    publishedTotal += cnt;
    const row: QuestionRowForBlueprint = {
      topic: g.topic,
      subtopic: g.subtopic,
      bodySystem: g.body_system,
      exam: g.exam,
      nclexClientNeedsCategory: g.nclex_client_needs_category,
      tags: [],
    };
    const domain = inferBlueprintDomainForRow(family, row);
    domainCounts.set(domain, (domainCounts.get(domain) ?? 0) + cnt);
    if (domain === "management_of_care") cjProxy += cnt;

    const sys = inferClinicalSystemForRow(row);
    systemCounts.set(sys, (systemCounts.get(sys) ?? 0) + cnt);

    for (const b of inferMedicationBuckets(row)) {
      medBucketHits.add(b);
    }
  }

  return { publishedTotal, domainCounts, systemCounts, medBucketHits, cjProxy };
}

async function buildPathwayReport(pathway: ExamPathwayDefinition): Promise<PathwayBlueprintReport> {
  const profile = buildPathwayBlueprintProfile(pathway);
  const [groups, q, lessonTopics] = await Promise.all([
    loadAggregatedGroups(pathway),
    loadQuality(pathway),
    loadLessonTopicCounts(pathway.id),
  ]);

  const { publishedTotal, domainCounts, systemCounts, medBucketHits, cjProxy } = rollupDomainsAndSystems(
    pathway,
    profile,
    groups,
  );

  const domains: BlueprintDomainCoverageRow[] = [];
  const domainIds = Object.keys(profile.domainTargets) as BlueprintDomainId[];
  for (const d of domainIds) {
    const tgt = profile.domainTargets[d];
    if (!tgt) continue;
    const questionCount = domainCounts.get(d) ?? 0;
    const pct = publishedTotal > 0 ? Math.round((questionCount / publishedTotal) * 1000) / 10 : 0;
    domains.push({
      domain: d,
      label: BLUEPRINT_DOMAIN_LABELS[d],
      questionCount,
      pctOfPathway: pct,
      minQuestions: tgt.minQuestions,
      stretchQuestions: tgt.stretchQuestions,
      band: classifyCoverage(questionCount, tgt.minQuestions, tgt.stretchQuestions),
    });
  }

  const systems: BlueprintSystemCoverageRow[] = [];
  for (const [sys, tgt] of Object.entries(profile.systemTargets)) {
    if (!tgt) continue;
    const sid = sys as ClinicalSystemId;
    const questionCount = systemCounts.get(sid) ?? 0;
    systems.push({
      system: sid,
      label: CLINICAL_SYSTEM_LABELS[sid],
      questionCount,
      minQuestions: tgt.minQuestions,
      stretchQuestions: tgt.stretchQuestions,
      band: classifyCoverage(questionCount, tgt.minQuestions, tgt.stretchQuestions),
    });
  }
  systems.sort((a, b) => b.questionCount - a.questionCount);

  const pctThin =
    q.publishedInScope > 0 ? Math.round((q.thinRationale / q.publishedInScope) * 1000) / 10 : 0;
  const pctMissing =
    q.publishedInScope > 0 ? Math.round((q.missingRationale / q.publishedInScope) * 1000) / 10 : 0;

  const prioritizedGaps = buildGapBacklog({
    profile,
    publishedQuestionTotal: publishedTotal,
    pctThinRationale: pctThin,
    pctMissingRationale: pctMissing,
    domainRows: domains,
    systemRows: systems,
    medicationBuckets: medBucketHits.size,
    clinicalJudgmentProxyCount: cjProxy,
    lessonTopicCount: lessonTopics.size,
  });
  const additions = recommendedFirstAdditions(prioritizedGaps, 8);

  return {
    pathwayId: pathway.id,
    displayName: pathway.displayName,
    countryCode: pathway.countryCode,
    stripeTier: pathway.stripeTier,
    contentExamKeys: pathway.contentExamKeys,
    profile,
    totals: {
      publishedQuestionsInScope: publishedTotal,
      belowMinTotal: publishedTotal < profile.minTotalQuestions,
      pctThinRationale: q.publishedInScope > 0 ? Math.round((q.thinRationale / q.publishedInScope) * 1000) / 10 : 0,
      pctMissingRationale: q.publishedInScope > 0 ? Math.round((q.missingRationale / q.publishedInScope) * 1000) / 10 : 0,
      distinctMedicationBuckets: medBucketHits.size,
      clinicalJudgmentProxyCount: cjProxy,
      lessonTopicSlugsWithAtLeastOneLesson: lessonTopics.size,
    },
    domains,
    systems,
    prioritizedGaps,
    recommendedFirstAdditions: additions,
  };
}

export async function buildExamBlueprintCoverageReport(): Promise<ExamBlueprintCoverageReport> {
  const generatedAt = new Date().toISOString();
  const notes = [
    "Question scope = published + pathway exam keys + tier ladder + region/country gates (mirrors subscriber pool shape).",
    "Domains inferred from `nclex_client_needs_category` when set, else canonical topic mapping.",
    "Clinical judgment proxy = counts in `management_of_care` domain (not NGN item types).",
    "Medication breadth = distinct coarse buckets from topic/subtopic keywords (not a formulary).",
    `Thin rationale = < ${RATIONALE_MIN_WORDS} words (same heuristic as question-bank coverage).`,
  ];

  if (!isDatabaseUrlConfigured()) {
    return { generatedAt, databaseConfigured: false, notes: [...notes, "DATABASE_URL not set."], pathways: [] };
  }

  return withDatabaseFallbackTimeout(
    async () => {
      const pathways: ExamPathwayDefinition[] = [];
      for (const id of BLUEPRINT_REPORT_PATHWAY_IDS) {
        const p = getExamPathwayById(id);
        if (p && p.status === "active") pathways.push(p);
      }
      const reports = await Promise.all(pathways.map((p) => buildPathwayReport(p)));
      return {
        generatedAt,
        databaseConfigured: true,
        notes,
        pathways: reports,
      };
    },
    {
      generatedAt,
      databaseConfigured: true,
      notes: [...notes, "Blueprint coverage unavailable (query timeout or database/schema error)."],
      pathways: [],
    },
    DB_TIMEOUT_MS,
  );
}
