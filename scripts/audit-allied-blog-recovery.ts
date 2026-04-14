import { config as loadEnv } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { PARAMEDIC_BLOG_ARTICLES } from "../../client/src/allied/data/paramedic-blog-data";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(__dirname, "../.env") });
loadEnv({ path: path.join(__dirname, "../../.env") });

const prisma = new PrismaClient();

type LegacyRow = { status?: string | null; legacy_source?: string | null };
type ProfessionAuditRow = {
  profession: string;
  sourcePath: string;
  sourceType: "legacy-export" | "static-ts" | "static-json";
  currentLiveRoute: string;
  backing: "db" | "static" | "mixed";
  postsFound: number;
  dbImportedCount: number | null;
  missingFromLiveEstimate: number | null;
};

function readJsonArray<T>(p: string): T[] {
  if (!fs.existsSync(p)) return [];
  const raw = JSON.parse(fs.readFileSync(p, "utf8"));
  return Array.isArray(raw) ? (raw as T[]) : [];
}

function countMltStubArticles(p: string): number {
  if (!fs.existsSync(p)) return 0;
  const raw = fs.readFileSync(p, "utf8");
  const match = raw.match(/\bslug:\s*"/g);
  return match ? match.length : 0;
}

async function safeDbCount(where: Parameters<typeof prisma.blogPost.count>[0]["where"]): Promise<number | null> {
  try {
    return await prisma.blogPost.count({ where });
  } catch {
    return null;
  }
}

async function main() {
  const legacyPath = path.join(__dirname, "../content/blog-legacy-export.json");
  const imagingPath = path.join(__dirname, "../data/replit-exports/imaging_blog_articles.json");
  const mltStubPath = path.join(__dirname, "../../client/src/allied/pages/mlt-blog.tsx");

  const legacyRows = readJsonArray<LegacyRow>(legacyPath);
  const imagingRows = readJsonArray<Record<string, unknown>>(imagingPath);
  const mltStubCount = countMltStubArticles(mltStubPath);

  const legacyByStatus = legacyRows.reduce<Record<string, number>>((acc, row) => {
    const key = String(row.status ?? "unknown").toLowerCase();
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const legacyBySource = legacyRows.reduce<Record<string, number>>((acc, row) => {
    const key = String(row.legacy_source ?? "unknown").toLowerCase();
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const paramedicDbCount = await safeDbCount({
    OR: [
      { legacySource: "paramedic-static" },
      { tags: { has: "paramedic" } },
      { category: { contains: "paramedic", mode: "insensitive" } },
    ],
  });
  const mltDbCount = await safeDbCount({
    OR: [
      { legacySource: "mlt_blog" },
      { tags: { has: "mlt" } },
      { category: { contains: "laboratory", mode: "insensitive" } },
    ],
  });
  const imagingDbCount = await safeDbCount({
    OR: [
      { legacySource: "imaging_blog" },
      { tags: { has: "medical-imaging" } },
      { category: { contains: "imaging", mode: "insensitive" } },
    ],
  });

  const professions: ProfessionAuditRow[] = [
    {
      profession: "paramedic",
      sourcePath: "client/src/allied/data/paramedic-blog-data.ts",
      sourceType: "static-ts",
      currentLiveRoute: "/allied-health/paramedic/blog",
      backing: "static",
      postsFound: PARAMEDIC_BLOG_ARTICLES.length,
      dbImportedCount: paramedicDbCount,
      missingFromLiveEstimate:
        paramedicDbCount == null ? null : Math.max(0, PARAMEDIC_BLOG_ARTICLES.length - paramedicDbCount),
    },
    {
      profession: "mlt",
      sourcePath: "client/src/allied/pages/mlt-blog.tsx",
      sourceType: "static-ts",
      currentLiveRoute: "/allied-health/mlt/blog",
      backing: "static",
      postsFound: mltStubCount,
      dbImportedCount: mltDbCount,
      missingFromLiveEstimate: mltDbCount == null ? null : Math.max(0, mltStubCount - mltDbCount),
    },
    {
      profession: "imaging",
      sourcePath: "nursenest-core/data/replit-exports/imaging_blog_articles.json",
      sourceType: "static-json",
      currentLiveRoute: "/allied-health/imaging/blog",
      backing: "mixed",
      postsFound: imagingRows.length,
      dbImportedCount: imagingDbCount,
      missingFromLiveEstimate:
        imagingDbCount == null ? null : Math.max(0, imagingRows.length - imagingDbCount),
    },
  ];

  const localizedAlliedCount = await safeDbCount({
    OR: [
      { exam: { contains: "allied", mode: "insensitive" } },
      { category: { contains: "allied", mode: "insensitive" } },
      { tags: { has: "allied-health" } },
    ],
  });

  console.log(
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourcesInspected: {
          legacyExportPath: legacyPath,
          paramedicPath: "client/src/allied/data/paramedic-blog-data.ts",
          mltPath: "client/src/allied/pages/mlt-blog.tsx",
          imagingPath,
        },
        legacyCounts: {
          total: legacyRows.length,
          byStatus: legacyByStatus,
          bySource: legacyBySource,
          published: legacyByStatus.published ?? 0,
          scheduled: legacyByStatus.scheduled ?? 0,
          drafts: legacyByStatus.draft ?? 0,
        },
        professionReport: professions,
        liveServing: {
          canonicalBlogRoute: "/blog",
          localizedBlogRoute: "/{locale}/{region}/{profession}/{exam}/blog",
          productionStaticFallbackUsed: false,
          note:
            "Production fallback should never outrank DB content. Default /blog fallback is intended only for non-production empty-DB development mode.",
        },
        alliedDbCoverageEstimate: {
          candidateAlliedBlogRows: localizedAlliedCount,
        },
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
