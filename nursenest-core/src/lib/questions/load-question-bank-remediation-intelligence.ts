import { CountryCode, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { buildQuestionBankCoverageAnalysis } from "@/lib/questions/build-question-bank-coverage-analysis";

const TIMEOUT_MS = 25_000;

export type QuestionBankRemediationIntelligence = {
  generatedAt: string;
  databaseConfigured: boolean;
  np: {
    published: number;
    weakCanonicalTopics: string[];
    uncategorizedPct: number;
    belowFloor: boolean;
  };
  alliedCanada: {
    publishedCA: number;
    publishedUSOrNull: number;
    sharedRegionRows: number;
    caExamTaggedRows: number;
    looksMisclassified: boolean;
    assessment: "classification_gap" | "true_inventory_gap" | "healthy_or_mixed";
  };
  strongestBanks: Array<{ label: string; published: number; thinPct: number; missingPct: number }>;
  weakestBanks: Array<{ label: string; published: number; thinPct: number; missingPct: number }>;
  belowFloorBanks: Array<{ label: string; published: number; minExpected: number }>;
  topWeakCanonicalTopics: Array<{ bucket: string; slug: string; label: string; count: number }>;
  uncategorizedWarnings: Array<{ bucket: string; pct: number; count: number }>;
};

function pct(n: number, d: number): number {
  if (d <= 0) return 0;
  return Math.round((n / d) * 1000) / 10;
}

export async function loadQuestionBankRemediationIntelligence(): Promise<QuestionBankRemediationIntelligence | null> {
  const generatedAt = new Date().toISOString();
  if (!isDatabaseUrlConfigured()) return null;

  const fallback: QuestionBankRemediationIntelligence = {
    generatedAt,
    databaseConfigured: true,
    np: { published: 0, weakCanonicalTopics: [], uncategorizedPct: 0, belowFloor: false },
    alliedCanada: {
      publishedCA: 0,
      publishedUSOrNull: 0,
      sharedRegionRows: 0,
      caExamTaggedRows: 0,
      looksMisclassified: false,
      assessment: "healthy_or_mixed",
    },
    strongestBanks: [],
    weakestBanks: [],
    belowFloorBanks: [],
    topWeakCanonicalTopics: [],
    uncategorizedWarnings: [],
  };

  return withDatabaseFallbackTimeout(
    async () => {
      const coverage = await buildQuestionBankCoverageAnalysis();
      const np = coverage.aggregates.find((a) => a.id === "np");
      const agg = coverage.aggregates.map((a) => ({
        label: a.label,
        published: a.publishedTotal,
        thinPct: a.quality.pctThinRationale,
        missingPct: a.quality.pctMissingRationale,
        minExpected: a.minTotalExpected,
        belowFloor: a.belowMinTotal,
        uncategorizedCount: a.canonicalDistribution.find((d) => d.slug === "uncategorized")?.count ?? 0,
      }));

      const qualityScore = (r: { thinPct: number; missingPct: number }) => r.missingPct * 2 + r.thinPct;
      const strongestBanks = [...agg]
        .sort((a, b) => qualityScore(a) - qualityScore(b) || b.published - a.published)
        .slice(0, 4)
        .map((r) => ({ label: r.label, published: r.published, thinPct: r.thinPct, missingPct: r.missingPct }));
      const weakestBanks = [...agg]
        .sort((a, b) => qualityScore(b) - qualityScore(a) || a.published - b.published)
        .slice(0, 4)
        .map((r) => ({ label: r.label, published: r.published, thinPct: r.thinPct, missingPct: r.missingPct }));
      const belowFloorBanks = agg
        .filter((r) => r.belowFloor && r.minExpected > 0)
        .map((r) => ({ label: r.label, published: r.published, minExpected: r.minExpected }))
        .slice(0, 8);

      const topWeakCanonicalTopics = coverage.aggregates
        .flatMap((a) =>
          a.canonicalDistribution
            .filter((d) => d.belowTopicThreshold || d.slug === "uncategorized")
            .map((d) => ({ bucket: a.label, slug: d.slug, label: d.label, count: d.count })),
        )
        .sort((a, b) => b.count - a.count)
        .slice(0, 12);

      const uncategorizedWarnings = agg
        .map((r) => ({
          bucket: r.label,
          count: r.uncategorizedCount,
          pct: pct(r.uncategorizedCount, r.published),
        }))
        .filter((r) => r.count > 0 && r.pct >= 8)
        .sort((a, b) => b.pct - a.pct);

      const alliedRows = await prisma.$queryRaw<
        Array<{
          ca_rows: bigint;
          us_or_null_rows: bigint;
          shared_region_rows: bigint;
          ca_exam_tag_rows: bigint;
        }>
      >`
        SELECT
          COUNT(*) FILTER (WHERE exam = 'ALLIED' AND status = 'published' AND country_code = 'CA')::bigint AS ca_rows,
          COUNT(*) FILTER (WHERE exam = 'ALLIED' AND status = 'published' AND (country_code = 'US' OR country_code IS NULL))::bigint AS us_or_null_rows,
          COUNT(*) FILTER (WHERE exam = 'ALLIED' AND status = 'published' AND "regionScope" = 'BOTH')::bigint AS shared_region_rows,
          COUNT(*) FILTER (WHERE exam = 'ALLIED' AND status = 'published' AND (exam ILIKE '%CA%' OR exam ILIKE '%CAN%'))::bigint AS ca_exam_tag_rows
        FROM exam_questions
      `;
      const row = alliedRows[0];
      const caRows = Number(row?.ca_rows ?? 0);
      const usOrNullRows = Number(row?.us_or_null_rows ?? 0);
      const sharedRegionRows = Number(row?.shared_region_rows ?? 0);
      const caExamTaggedRows = Number(row?.ca_exam_tag_rows ?? 0);

      const looksMisclassified = caRows <= 5 && usOrNullRows > 250 && sharedRegionRows > 250;
      const assessment: QuestionBankRemediationIntelligence["alliedCanada"]["assessment"] =
        caRows === 0 && !looksMisclassified
          ? "true_inventory_gap"
          : looksMisclassified
            ? "classification_gap"
            : "healthy_or_mixed";

      return {
        generatedAt,
        databaseConfigured: true,
        np: {
          published: np?.publishedTotal ?? 0,
          weakCanonicalTopics: np?.weakCanonicalTopics ?? [],
          uncategorizedPct: np
            ? pct(np.canonicalDistribution.find((d) => d.slug === "uncategorized")?.count ?? 0, np.publishedTotal)
            : 0,
          belowFloor: np?.belowMinTotal ?? false,
        },
        alliedCanada: {
          publishedCA: caRows,
          publishedUSOrNull: usOrNullRows,
          sharedRegionRows,
          caExamTaggedRows,
          looksMisclassified,
          assessment,
        },
        strongestBanks,
        weakestBanks,
        belowFloorBanks,
        topWeakCanonicalTopics,
        uncategorizedWarnings,
      };
    },
    fallback,
    TIMEOUT_MS,
  );
}

