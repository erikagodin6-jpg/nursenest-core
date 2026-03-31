/**
 * Read-only coverage + quality aggregates over `exam_questions` (published rows).
 * Uses bounded GROUP BY queries — never loads full question bodies.
 */
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { CountryCode, Prisma } from "@prisma/client";
import {
  MIN_PUBLISHED_BY_BUCKET,
  RATIONALE_MIN_WORDS,
  minQuestionsPerCanonicalTopic,
} from "@/lib/questions/question-bank-coverage-thresholds";
import {
  canonicalTopicLabel,
  inferPathwayFamilyFromExamKeys,
  mapRowToCanonicalTopic,
  type CanonicalTopicSlug,
  type PathwayFamily,
} from "@/lib/questions/question-bank-taxonomy";

const DB_TIMEOUT_MS = 25_000;
const GROUP_ROW_WARN = 4000;

export type CoverageBucketId = "rn" | "pn" | "np" | "allied_us" | "allied_ca";

export type CanonicalDistributionEntry = {
  slug: CanonicalTopicSlug;
  label: string;
  count: number;
  pctOfBucket: number;
  belowTopicThreshold: boolean;
};

export type PathwayCoverageRow = {
  pathwayId: string;
  displayName: string;
  pathwayFamily: PathwayFamily;
  contentExamKeys: string[];
  publishedCount: number;
  minTotalExpected: number | null;
  belowMinTotal: boolean;
  canonicalDistribution: CanonicalDistributionEntry[];
  weakCanonicalTopics: CanonicalTopicSlug[];
  quality: {
    publishedInScope: number;
    missingRationale: number;
    thinRationale: number;
    shortStem: number;
    pctMissingRationale: number;
    pctThinRationale: number;
  };
};

export type AggregateBucketSummary = {
  id: CoverageBucketId;
  label: string;
  examKeys: string[];
  pathwayFamily: PathwayFamily;
  publishedTotal: number;
  minTotalExpected: number;
  belowMinTotal: boolean;
  canonicalDistribution: CanonicalDistributionEntry[];
  weakCanonicalTopics: CanonicalTopicSlug[];
  quality: PathwayCoverageRow["quality"];
};

export type QuestionBankCoverageAnalysis = {
  generatedAt: string;
  databaseConfigured: boolean;
  notes: string[];
  rationaleMinWords: number;
  aggregates: AggregateBucketSummary[];
  pathways: PathwayCoverageRow[];
};

function uniq(keys: string[]): string[] {
  return [...new Set(keys.filter(Boolean))];
}

function buildNpExamKeys(): string[] {
  return uniq(EXAM_PATHWAYS.filter((p) => p.roleTrack === "np").flatMap((p) => p.contentExamKeys));
}

function buildRnExamKeys(): string[] {
  return uniq(EXAM_PATHWAYS.filter((p) => p.roleTrack === "rn").flatMap((p) => p.contentExamKeys));
}

function buildPnExamKeys(): string[] {
  return uniq(
    EXAM_PATHWAYS.filter((p) => p.roleTrack === "rpn" || p.roleTrack === "lpn").flatMap((p) => p.contentExamKeys),
  );
}

function rollupCanonical(
  family: PathwayFamily,
  groups: Array<{
    topic: string | null;
    subtopic: string | null;
    body_system: string | null;
    exam: string | null;
    cnt: bigint;
  }>,
  bucketPublished: number,
  minTotalForThreshold: number,
): { distribution: CanonicalDistributionEntry[]; weak: CanonicalTopicSlug[] } {
  const map = new Map<CanonicalTopicSlug, number>();
  for (const g of groups) {
    const slug = mapRowToCanonicalTopic(family, {
      topic: g.topic,
      subtopic: g.subtopic,
      bodySystem: g.body_system,
      exam: g.exam,
    });
    map.set(slug, (map.get(slug) ?? 0) + Number(g.cnt));
  }
  const floor = minQuestionsPerCanonicalTopic(minTotalForThreshold);
  const distribution: CanonicalDistributionEntry[] = [];
  for (const [slug, count] of [...map.entries()].sort((a, b) => b[1] - a[1])) {
    const pct = bucketPublished > 0 ? (count / bucketPublished) * 100 : 0;
    const belowTopicThreshold = count < floor && slug !== "uncategorized";
    distribution.push({
      slug,
      label: canonicalTopicLabel(slug),
      count,
      pctOfBucket: Math.round(pct * 10) / 10,
      belowTopicThreshold,
    });
  }
  const weak = distribution.filter((d) => d.belowTopicThreshold).map((d) => d.slug);
  return { distribution, weak };
}

type TopicGroupRow = {
  topic: string | null;
  subtopic: string | null;
  body_system: string | null;
  exam: string | null;
  cnt: bigint;
};

/** Optional country filter for allied pathways (US includes NULL country rows). */
function alliedPathwayCountrySql(countryCode: CountryCode): Prisma.Sql {
  if (countryCode === CountryCode.US) {
    return Prisma.sql` AND (country_code = 'US' OR country_code IS NULL)`;
  }
  return Prisma.sql` AND country_code = 'CA'`;
}

async function loadTopicGroups(examKeys: string[], alliedCountry?: CountryCode): Promise<TopicGroupRow[]> {
  if (examKeys.length === 0) return [];
  const allied = alliedCountry ? alliedPathwayCountrySql(alliedCountry) : Prisma.empty;
  return prisma.$queryRaw<TopicGroupRow[]>`
    SELECT topic, subtopic, body_system, exam, COUNT(*)::bigint AS cnt
    FROM exam_questions
    WHERE status = ${DB_PUBLISHED} AND exam IN (${Prisma.join(examKeys)}) ${allied}
    GROUP BY topic, subtopic, body_system, exam
  `;
}

async function loadQualityStats(examKeys: string[], alliedCountry?: CountryCode): Promise<{
  publishedInScope: number;
  missingRationale: number;
  thinRationale: number;
  shortStem: number;
}> {
  if (examKeys.length === 0) {
    return { publishedInScope: 0, missingRationale: 0, thinRationale: 0, shortStem: 0 };
  }
  const allied = alliedCountry ? alliedPathwayCountrySql(alliedCountry) : Prisma.empty;
  const rows = await prisma.$queryRaw<
    Array<{
      published_in_scope: bigint;
      missing_rationale: bigint;
      thin_rationale: bigint;
      short_stem: bigint;
    }>
  >`
    SELECT
      COUNT(*)::bigint AS published_in_scope,
      COUNT(*) FILTER (WHERE rationale IS NULL OR TRIM(COALESCE(rationale, '')) = '')::bigint AS missing_rationale,
      COUNT(*) FILTER (
        WHERE rationale IS NOT NULL
        AND TRIM(rationale) <> ''
        AND (
          LENGTH(TRIM(rationale)) - LENGTH(REPLACE(TRIM(rationale), ' ', '')) + 1
        ) < ${RATIONALE_MIN_WORDS}
      )::bigint AS thin_rationale,
      COUNT(*) FILTER (WHERE stem IS NULL OR LENGTH(TRIM(stem)) < 12)::bigint AS short_stem
    FROM exam_questions
    WHERE status = ${DB_PUBLISHED} AND exam IN (${Prisma.join(examKeys)}) ${allied}
  `;
  const r = rows[0];
  if (!r) {
    return { publishedInScope: 0, missingRationale: 0, thinRationale: 0, shortStem: 0 };
  }
  return {
    publishedInScope: Number(r.published_in_scope),
    missingRationale: Number(r.missing_rationale),
    thinRationale: Number(r.thin_rationale),
    shortStem: Number(r.short_stem),
  };
}

function qualityView(q: Awaited<ReturnType<typeof loadQualityStats>>): PathwayCoverageRow["quality"] {
  const n = q.publishedInScope;
  return {
    ...q,
    pctMissingRationale: n > 0 ? Math.round((q.missingRationale / n) * 1000) / 10 : 0,
    pctThinRationale: n > 0 ? Math.round((q.thinRationale / n) * 1000) / 10 : 0,
  };
}

async function buildBucket(
  id: CoverageBucketId,
  label: string,
  examKeys: string[],
  pathwayFamily: PathwayFamily,
  minTotalExpected: number,
): Promise<AggregateBucketSummary> {
  const keys = uniq(examKeys);
  const [groups, q] = await Promise.all([loadTopicGroups(keys), loadQualityStats(keys)]);
  const publishedTotal = groups.reduce((s, g) => s + Number(g.cnt), 0);
  if (groups.length > GROUP_ROW_WARN) {
    /* keep query as-is; surface in notes at caller */
  }
  const { distribution, weak } = rollupCanonical(pathwayFamily, groups, publishedTotal, minTotalExpected);
  return {
    id,
    label,
    examKeys: keys,
    pathwayFamily,
    publishedTotal,
    minTotalExpected,
    belowMinTotal: publishedTotal < minTotalExpected,
    canonicalDistribution: distribution,
    weakCanonicalTopics: weak,
    quality: qualityView(q),
  };
}

async function buildPathwayRow(p: (typeof EXAM_PATHWAYS)[number]): Promise<PathwayCoverageRow> {
  const keys = [...new Set(p.contentExamKeys)];
  const family = inferPathwayFamilyFromExamKeys(keys);
  const alliedCountry = p.roleTrack === "allied" ? p.countryCode : undefined;
  const [groups, q] = await Promise.all([loadTopicGroups(keys, alliedCountry), loadQualityStats(keys, alliedCountry)]);
  const publishedCount = groups.reduce((s, g) => s + Number(g.cnt), 0);
  let minTotal: number | null = null;
  if (family === "nclex_rn") minTotal = MIN_PUBLISHED_BY_BUCKET.rn;
  else if (family === "nclex_pn") minTotal = MIN_PUBLISHED_BY_BUCKET.pn;
  else if (family === "np") minTotal = MIN_PUBLISHED_BY_BUCKET.np;
  else if (family === "allied") minTotal = MIN_PUBLISHED_BY_BUCKET.alliedPerCountry;

  const { distribution, weak } = rollupCanonical(
    family,
    groups,
    publishedCount,
    minTotal ?? Math.max(publishedCount, 1),
  );

  return {
    pathwayId: p.id,
    displayName: p.displayName,
    pathwayFamily: family,
    contentExamKeys: keys,
    publishedCount,
    minTotalExpected: minTotal,
    belowMinTotal: minTotal != null && publishedCount < minTotal,
    canonicalDistribution: distribution,
    weakCanonicalTopics: weak,
    quality: qualityView(q),
  };
}

export async function buildQuestionBankCoverageAnalysis(): Promise<QuestionBankCoverageAnalysis> {
  const generatedAt = new Date().toISOString();
  const databaseConfigured = isDatabaseUrlConfigured();
  const notes: string[] = [
    "Canonical topics are inferred from topic/subtopic/body_system/exam text — tune keywords as labels stabilize.",
    "Aggregate RN/PN/NP pools union exam key sets from the pathway registry; allied is split by country_code.",
    `Thin rationale = published row has < ${RATIONALE_MIN_WORDS} whitespace-delimited words (approximate).`,
  ];

  if (!databaseConfigured) {
    return {
      generatedAt,
      databaseConfigured: false,
      notes: [...notes, "DATABASE_URL not configured."],
      rationaleMinWords: RATIONALE_MIN_WORDS,
      aggregates: [],
      pathways: [],
    };
  }

  return withDatabaseFallbackTimeout(
    async () => {
      const rnKeys = buildRnExamKeys();
      const pnKeys = buildPnExamKeys();
      const npKeys = buildNpExamKeys();

      const [aggRn, aggPn, aggNp, pathways, alliedUsGroups, alliedCaGroups, qUs, qCa] = await Promise.all([
        buildBucket("rn", "NCLEX-RN aggregate (all locales)", rnKeys, "nclex_rn", MIN_PUBLISHED_BY_BUCKET.rn),
        buildBucket("pn", "PN / RPN aggregate (NCLEX-PN + REx-PN)", pnKeys, "nclex_pn", MIN_PUBLISHED_BY_BUCKET.pn),
        buildBucket("np", "NP aggregate (all NP tracks)", npKeys, "np", MIN_PUBLISHED_BY_BUCKET.np),
        Promise.all(EXAM_PATHWAYS.map((p) => buildPathwayRow(p))),
        loadTopicGroups(["ALLIED"], CountryCode.US),
        loadTopicGroups(["ALLIED"], CountryCode.CA),
        loadQualityStats(["ALLIED"], CountryCode.US),
        loadQualityStats(["ALLIED"], CountryCode.CA),
      ]);

      const usPublished = alliedUsGroups.reduce((s, g) => s + Number(g.cnt), 0);
      const caPublished = alliedCaGroups.reduce((s, g) => s + Number(g.cnt), 0);
      const usRoll = rollupCanonical("allied", alliedUsGroups, usPublished, MIN_PUBLISHED_BY_BUCKET.alliedPerCountry);
      const caRoll = rollupCanonical("allied", alliedCaGroups, caPublished, MIN_PUBLISHED_BY_BUCKET.alliedPerCountry);

      const qu = qUs;
      const qc = qCa;
      const alliedUsSummary: AggregateBucketSummary = {
        id: "allied_us",
        label: "Allied — US (ALLIED + US or null country)",
        examKeys: ["ALLIED"],
        pathwayFamily: "allied",
        publishedTotal: usPublished,
        minTotalExpected: MIN_PUBLISHED_BY_BUCKET.alliedPerCountry,
        belowMinTotal: usPublished < MIN_PUBLISHED_BY_BUCKET.alliedPerCountry,
        canonicalDistribution: usRoll.distribution,
        weakCanonicalTopics: usRoll.weak,
        quality: qualityView(qu),
      };
      const alliedCaSummary: AggregateBucketSummary = {
        id: "allied_ca",
        label: "Allied — Canada (ALLIED + CA)",
        examKeys: ["ALLIED"],
        pathwayFamily: "allied",
        publishedTotal: caPublished,
        minTotalExpected: MIN_PUBLISHED_BY_BUCKET.alliedPerCountry,
        belowMinTotal: caPublished < MIN_PUBLISHED_BY_BUCKET.alliedPerCountry,
        canonicalDistribution: caRoll.distribution,
        weakCanonicalTopics: caRoll.weak,
        quality: qualityView(qc),
      };

      const aggregates = [aggRn, aggPn, aggNp, alliedUsSummary, alliedCaSummary];
      notes.push(
        `Aggregate topic group rows: RN ${aggRn.publishedTotal ? "ok" : "0"}, PN ${aggPn.publishedTotal}, NP ${aggNp.publishedTotal}, Allied US ${alliedUsSummary.publishedTotal}, Allied CA ${alliedCaSummary.publishedTotal}.`,
      );

      return {
        generatedAt,
        databaseConfigured: true,
        notes,
        rationaleMinWords: RATIONALE_MIN_WORDS,
        aggregates,
        pathways,
      };
    },
    {
      generatedAt,
      databaseConfigured: true,
      notes: [...notes, "Query timeout building coverage analysis."],
      rationaleMinWords: RATIONALE_MIN_WORDS,
      aggregates: [],
      pathways: [],
    },
    DB_TIMEOUT_MS,
  );
}
