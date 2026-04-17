/**
 * Bounded admin/ops aggregates for `exam_questions` coverage (counts only).
 */
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";

const DB_TIMEOUT_MS = 10_000;
/** Cap cross-tabs to keep JSON small. */
const CROSS_TAB_LIMIT = 150;
const TOP_TOPIC_SAMPLES = 80;
const REPORT_CACHE_MS = 30_000;
let cachedReport: { at: number; value: QuestionBankCoverageReport } | null = null;
let reportInFlight: Promise<QuestionBankCoverageReport> | null = null;

export type QuestionBankCoverageReport = {
  generatedAt: string;
  databaseConfigured: boolean;
  totals: {
    allRows: number;
    publishedRows: number;
    draftOrOtherRows: number;
  };
  /** Top buckets — may be truncated; see cap note. */
  byExam: Array<{ exam: string | null; count: number }>;
  byStatus: Array<{ status: string | null; count: number }>;
  byTier: Array<{ tier: string; count: number }>;
  /**
   * exam × tier × country × status — ordered by count desc, capped.
   * `pathway` is not a DB column; use `pathwayPublishedMatch` for registry inference.
   */
  crossTabExamTierCountryStatus: Array<{
    exam: string | null;
    tier: string;
    countryCode: string | null;
    status: string | null;
    count: number;
  }>;
  pathwayPublishedMatch: Array<{
    pathwayId: string;
    displayName: string;
    contentExamKeys: string[];
    publishedCount: number;
  }>;
  topicTopPublished: Array<{ topic: string; count: number }>;
  notes: string[];
  caps: { crossTabRows: number; topicSamples: number };
};

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function buildQuestionBankCoverageReport(): Promise<QuestionBankCoverageReport> {
  const nowTs = Date.now();
  if (cachedReport && nowTs - cachedReport.at < REPORT_CACHE_MS) return cachedReport.value;
  if (reportInFlight) return reportInFlight;

  const generatedAt = new Date().toISOString();
  const databaseConfigured = isDatabaseUrlConfigured();
  const notes: string[] = [
    "UI pathway filter uses `contentExamKeys` AND subscriber tier/region gates — exam string must intersect keys (case-sensitive to DB).",
    "Topic filter is exact match on `exam_questions.topic` (see topicTopPublished for common labels).",
  ];

  if (!databaseConfigured) {
    return {
      generatedAt,
      databaseConfigured: false,
      totals: { allRows: -1, publishedRows: -1, draftOrOtherRows: -1 },
      byExam: [],
      byStatus: [],
      byTier: [],
      crossTabExamTierCountryStatus: [],
      pathwayPublishedMatch: EXAM_PATHWAYS.map((p) => ({
        pathwayId: p.id,
        displayName: p.displayName,
        contentExamKeys: [...p.contentExamKeys],
        publishedCount: -1,
      })),
      topicTopPublished: [],
      notes: [...notes, "DATABASE_URL not configured."],
      caps: { crossTabRows: CROSS_TAB_LIMIT, topicSamples: TOP_TOPIC_SAMPLES },
    };
  }

  reportInFlight = withDatabaseFallbackTimeout(
    async () => {
      const allRows = await prisma.examQuestion.count();
      const publishedRows = await prisma.examQuestion.count({ where: { status: DB_PUBLISHED } });
      const byExam = await prisma.examQuestion.groupBy({
        by: ["exam"],
        _count: { _all: true },
        orderBy: { _count: { exam: "desc" } },
        take: 40,
      });
      const byStatus = await prisma.examQuestion.groupBy({ by: ["status"], _count: { _all: true } });
      const byTier = await prisma.examQuestion.groupBy({
        by: ["tier"],
        _count: { _all: true },
        orderBy: { _count: { tier: "desc" } },
        take: 30,
      });
      const crossTab = await prisma.$queryRaw<
        Array<{
          exam: string | null;
          tier: string;
          country_code: string | null;
          status: string | null;
          cnt: bigint;
        }>
      >`
        SELECT exam, tier, country_code, status, COUNT(*)::bigint AS cnt
        FROM exam_questions
        GROUP BY exam, tier, country_code, status
        ORDER BY cnt DESC
        LIMIT ${CROSS_TAB_LIMIT}
      `;
      const topicTopPublished = await prisma.$queryRaw<Array<{ topic: string; cnt: bigint }>>`
        SELECT topic, COUNT(*)::bigint AS cnt
        FROM exam_questions
        WHERE status = ${DB_PUBLISHED} AND topic IS NOT NULL AND TRIM(topic) <> ''
        GROUP BY topic
        ORDER BY cnt DESC
        LIMIT ${TOP_TOPIC_SAMPLES}
      `;

      const pathwayPublishedMatch: QuestionBankCoverageReport["pathwayPublishedMatch"] = [];
      for (const batch of chunk(EXAM_PATHWAYS, 4)) {
        const rows = await Promise.all(
          batch.map(async (p) => {
            const keys = [...new Set(p.contentExamKeys)];
            const publishedCount = await prisma.examQuestion.count({
              where: { status: DB_PUBLISHED, exam: { in: keys } },
            });
            return {
              pathwayId: p.id,
              displayName: p.displayName,
              contentExamKeys: keys,
              publishedCount,
            };
          }),
        );
        pathwayPublishedMatch.push(...rows);
      }

      const zeros = pathwayPublishedMatch.filter((r) => r.publishedCount === 0).map((r) => r.pathwayId);
      if (zeros.length > 0) {
        notes.push(`Pathways with zero published rows for contentExamKeys: ${zeros.join(", ")}`);
      }

      const report = {
        generatedAt,
        databaseConfigured: true,
        totals: {
          allRows,
          publishedRows,
          draftOrOtherRows: Math.max(0, allRows - publishedRows),
        },
        byExam: byExam.map((r) => ({ exam: r.exam, count: r._count._all })),
        byStatus: byStatus.map((r) => ({ status: r.status, count: r._count._all })).sort((a, b) => b.count - a.count),
        byTier: byTier.map((r) => ({ tier: r.tier, count: r._count._all })),
        crossTabExamTierCountryStatus: crossTab.map((r) => ({
          exam: r.exam,
          tier: r.tier,
          countryCode: r.country_code,
          status: r.status,
          count: Number(r.cnt),
        })),
        pathwayPublishedMatch,
        topicTopPublished: topicTopPublished.map((r) => ({ topic: r.topic, count: Number(r.cnt) })),
        notes,
        caps: { crossTabRows: CROSS_TAB_LIMIT, topicSamples: TOP_TOPIC_SAMPLES },
      };
      cachedReport = { at: Date.now(), value: report };
      return report;
    },
    {
      generatedAt,
      databaseConfigured: true,
      totals: { allRows: -1, publishedRows: -1, draftOrOtherRows: -1 },
      byExam: [],
      byStatus: [],
      byTier: [],
      crossTabExamTierCountryStatus: [],
      pathwayPublishedMatch: [],
      topicTopPublished: [],
      notes: [...notes, "Query timeout or error building report."],
      caps: { crossTabRows: CROSS_TAB_LIMIT, topicSamples: TOP_TOPIC_SAMPLES },
    },
    DB_TIMEOUT_MS,
  ).finally(() => {
    reportInFlight = null;
  });
  return reportInFlight;
}
