/**
 * Authoritative content counts for migration / ops.
 * Run: `npx tsx scripts/content-audit-authoritative.ts` (requires DATABASE_URL).
 *
 * For production numbers, set DATABASE_URL to the production Postgres connection
 * (read-only recommended) and run locally or in CI.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(__dirname, "../.env") });
loadEnv({ path: path.join(__dirname, "../../.env") });

import { CountryCode, TierCode } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { questionBankWhereForProfile } from "../src/lib/entitlements/content-access-scope";

const prisma = new PrismaClient();

const PUBLISHED = "published";

async function main() {
  const [
    lessonsTotal,
    lessonsByStatus,
    questionsTotal,
    questionsByStatus,
    questionsByTierPublished,
    blogTotal,
    blogPublished,
  ] = await Promise.all([
    prisma.contentItem.count({ where: { type: "lesson" } }),
    prisma.contentItem.groupBy({ by: ["status"], where: { type: "lesson" }, _count: { _all: true } }),
    prisma.examQuestion.count(),
    prisma.examQuestion.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.examQuestion.groupBy({
      by: ["tier"],
      where: { status: PUBLISHED },
      _count: { _all: true },
    }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
  ]);

  const allPublished = await prisma.contentItem.count({ where: { type: "lesson", status: PUBLISHED } });

  let publishedEmptyBodyTrim = 0;
  try {
    const raw = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n FROM "content_items"
      WHERE type = 'lesson' AND status = 'published'
        AND (
          content IS NULL
          OR content::text = '[]'
          OR LENGTH(TRIM(content::text)) < 3
        )
    `;
    publishedEmptyBodyTrim = Number(raw[0]?.n ?? 0);
  } catch {
    publishedEmptyBodyTrim = -1;
  }

  const learnerPoolByProfile: Record<string, number> = {};
  for (const country of [CountryCode.CA, CountryCode.US]) {
    for (const tier of Object.values(TierCode)) {
      const key = `${country}/${tier}`;
      learnerPoolByProfile[key] = await prisma.examQuestion.count({
        where: questionBankWhereForProfile(country, tier),
      });
    }
  }

  const questionsByStatusMap = Object.fromEntries(
    questionsByStatus.map((g) => [g.status ?? "null", g._count._all]),
  );

  const excluded = {
    byQuestionStatus: questionsByStatusMap,
    publishedButNeedsReview: 0,
    rowsWithDuplicateOfId: 0,
    notes: [
      "Learner pool counts use questionBankWhereForProfile(country, tier) against `exam_questions`.",
      "needsReview / duplicateOfId were legacy Prisma-only fields; production uses `exam_questions` only.",
    ],
  };

  const report = {
    generatedAt: new Date().toISOString(),
    databaseUrlPresent: Boolean(process.env.DATABASE_URL?.trim()),
    lessons: {
      total: lessonsTotal,
      byStatus: Object.fromEntries(lessonsByStatus.map((g) => [g.status ?? "null", g._count._all])),
      published: allPublished,
      draft: lessonsByStatus.find((g) => g.status === "draft")?._count._all ?? 0,
      publishedEmptyBodyStrictEquals: 0,
      publishedEmptyBodyAfterTrim: publishedEmptyBodyTrim,
    },
    questions: {
      total: questionsTotal,
      byStatus: questionsByStatusMap,
      publishedByTier: Object.fromEntries(
        questionsByTierPublished.map((g) => [g.tier, g._count._all]),
      ),
      learnerPoolUsableByCountryTier: learnerPoolByProfile,
      excluded,
    },
    blog: {
      totalRows: blogTotal,
      publishedRows: blogPublished,
    },
  };

  console.log(JSON.stringify(report, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
