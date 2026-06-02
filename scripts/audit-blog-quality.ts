import { STATIC_BLOG_POSTS } from "@/content/blog-static-posts";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallback } from "@/lib/db/safe-database";

type AuditRow = {
  source: "database" | "static";
  title: string;
  slug: string;
  wordCount: number;
  headingsCount: number;
  clinicalDepthSignals: number;
  isLowQuality: boolean;
};

const MIN_WORD_COUNT = 800;
const MIN_HEADINGS_COUNT = 3;
const MIN_DEPTH_SIGNALS = 3;
const MAX_ROWS = 500;

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countWordsFromHtml(html: string): number {
  const plain = stripHtml(html);
  if (!plain) return 0;
  return plain.split(/\s+/).filter(Boolean).length;
}

function countHeadingsFromHtml(html: string): number {
  const matches = html.match(/<h[1-6][^>]*>/gi);
  return matches ? matches.length : 0;
}

function countClinicalDepthSignals(html: string): number {
  const plain = stripHtml(html).toLowerCase();
  const signals = [
    "pathophysiology",
    "assessment",
    "diagnosis",
    "differential",
    "symptom",
    "lab",
    "intervention",
    "management",
    "priority",
    "nclex",
    "safety",
    "rationale",
    "clinical judgment",
  ];
  return signals.reduce((total, signal) => total + (plain.includes(signal) ? 1 : 0), 0);
}

function buildAuditRow(
  source: AuditRow["source"],
  title: string,
  slug: string,
  bodyHtml: string,
): AuditRow {
  const wordCount = countWordsFromHtml(bodyHtml);
  const headingsCount = countHeadingsFromHtml(bodyHtml);
  const clinicalDepthSignals = countClinicalDepthSignals(bodyHtml);
  const isLowQuality =
    wordCount < MIN_WORD_COUNT ||
    headingsCount < MIN_HEADINGS_COUNT ||
    clinicalDepthSignals < MIN_DEPTH_SIGNALS;
  return {
    source,
    title,
    slug,
    wordCount,
    headingsCount,
    clinicalDepthSignals,
    isLowQuality,
  };
}

async function loadDatabaseRows(): Promise<AuditRow[]> {
  if (!isDatabaseUrlConfigured()) return [];
  return withDatabaseFallback(
    async () => {
      const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: "desc" },
        take: MAX_ROWS,
        select: {
          title: true,
          slug: true,
          body: true,
        },
      });
      return posts.map((post) => buildAuditRow("database", post.title, post.slug, post.body ?? ""));
    },
    [],
  );
}

function loadStaticRows(): AuditRow[] {
  return STATIC_BLOG_POSTS.map((post) =>
    buildAuditRow("static", post.title, post.slug, post.bodyHtml ?? ""),
  );
}

async function main(): Promise<void> {
  const dbRows = await loadDatabaseRows();
  const staticRows = loadStaticRows();
  const rows = dbRows.length > 0 ? dbRows : staticRows;
  const low = rows.filter((row) => row.isLowQuality);

  console.log(
    JSON.stringify(
      {
        sourceUsed: dbRows.length > 0 ? "database" : "static",
        thresholds: {
          minWordCount: MIN_WORD_COUNT,
          minHeadingsCount: MIN_HEADINGS_COUNT,
          minClinicalDepthSignals: MIN_DEPTH_SIGNALS,
        },
        totals: {
          audited: rows.length,
          lowQuality: low.length,
          highQuality: rows.length - low.length,
        },
        lowQualityRows: low.slice(0, 50),
      },
      null,
      2,
    ),
  );
}

void main();

