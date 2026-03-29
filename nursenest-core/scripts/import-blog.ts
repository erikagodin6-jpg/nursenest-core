/**
 * Import blog posts into BlogPost (Prisma).
 *
 * Sources:
 * 1. Static paramedic articles from monolith `client/src/allied/data/paramedic-blog-data.ts`
 * 2. JSON export: `content/blog-legacy-export.json` (from `export-monolith-blog-to-json.ts` or manual)
 *
 * Usage: `npx tsx scripts/import-blog.ts`
 * Env: DATABASE_URL
 *
 * Does not modify Lesson or Question models.
 *
 * Storage policy: production blog content lives in the **database**, not in `public/`.
 * See `docs/CONTENT_WORKFLOWS.md` (blog) and `docs/STORAGE_POLICY.md`.
 */
import { config as loadEnv } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { PARAMEDIC_BLOG_ARTICLES } from "../../client/src/allied/data/paramedic-blog-data";
import { excerptFromParamedic, paramedicArticleToHtml } from "../src/lib/blog/serialize-paramedic";
import { legacyBlogHtmlFromRow, normalizeBlogAssetUrls } from "../src/lib/blog/serialize-content";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(__dirname, "../.env") });
loadEnv({ path: path.join(__dirname, "../../.env") });
const prisma = new PrismaClient();

type LegacyExportRow = {
  slug: string;
  title: string;
  summary?: string | null;
  seo_description?: string | null;
  category?: string | null;
  tags?: string[] | null;
  content?: unknown;
  body?: string | null;
  content_html?: string | null;
  status?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  scheduled_at?: string | null;
  updated_at?: string | null;
  cover_image?: string | null;
  legacy_source?: string | null;
};

function readLegacyJson(): LegacyExportRow[] {
  const p = path.join(__dirname, "../content/blog-legacy-export.json");
  if (!fs.existsSync(p)) return [];
  const raw = JSON.parse(fs.readFileSync(p, "utf8"));
  return Array.isArray(raw) ? raw : [];
}

/** Count <img> and non-absolute src (before or after migration fixes). */
function scanImageRefs(html: string): { imgTags: number; nonAbsoluteSrc: number } {
  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  let nonAbsoluteSrc = 0;
  for (const tag of imgs) {
    const m = tag.match(/\bsrc=["']([^"']+)["']/i);
    const src = m?.[1]?.trim() ?? "";
    if (src && !src.startsWith("http") && !src.startsWith("data:")) nonAbsoluteSrc += 1;
  }
  return { imgTags: imgs.length, nonAbsoluteSrc };
}

const MIN_BODY_CHARS = 80;

function rowShouldPublish(row: LegacyExportRow): boolean {
  const st = (row.status || "").toLowerCase();
  if (st === "published") return true;
  if (st === "scheduled") {
    if (!row.scheduled_at) return false;
    return new Date(row.scheduled_at) <= new Date();
  }
  return false;
}

function pickCreatedAt(row: LegacyExportRow): Date {
  if (row.created_at) return new Date(row.created_at);
  if (row.published_at) return new Date(row.published_at);
  if (row.scheduled_at) return new Date(row.scheduled_at);
  return new Date();
}

async function main() {
  let imported = 0;
  let skippedDuplicate = 0;
  let skippedDraft = 0;
  let skippedThin = 0;
  const errors: string[] = [];

  const legacyRows = readLegacyJson();
  let legacyPublishedInFile = 0;
  let legacyDraftInFile = 0;
  for (const row of legacyRows) {
    const st = (row.status || "").toLowerCase();
    if (st === "published") legacyPublishedInFile += 1;
    else if (st === "draft") legacyDraftInFile += 1;
  }

  for (const article of PARAMEDIC_BLOG_ARTICLES) {
    const bodyRaw = paramedicArticleToHtml(article);
    const body = normalizeBlogAssetUrls(bodyRaw);
    const excerpt = excerptFromParamedic(article).slice(0, 2000);
    const tags = [...(article.keywords ?? "").split(",").map((s) => s.trim()).filter(Boolean), "allied-health", "paramedic"];
    const created = new Date(article.publishedDate);
    if (!body.trim()) {
      errors.push(`paramedic:${article.slug} empty body`);
      continue;
    }
    const existing = await prisma.blogPost.findUnique({ where: { slug: article.slug } });
    if (existing) {
      skippedDuplicate += 1;
      continue;
    }
    await prisma.blogPost.create({
      data: {
        slug: article.slug,
        title: article.title,
        excerpt,
        body,
        coverImage: null,
        tags,
        category: article.category || "allied-health",
        published: true,
        legacySource: "paramedic-static",
        createdAt: created,
      },
    });
    imported += 1;
  }

  for (const row of legacyRows) {
    if (!row.slug || !row.title) {
      errors.push("legacy: missing slug or title");
      continue;
    }
    if (!rowShouldPublish(row)) {
      skippedDraft += 1;
      continue;
    }

    const htmlRaw = legacyBlogHtmlFromRow(row);
    const body = normalizeBlogAssetUrls(htmlRaw);
    if (body.trim().length < MIN_BODY_CHARS) {
      skippedThin += 1;
      errors.push(`legacy:${row.slug} skipped (body under ${MIN_BODY_CHARS} chars)`);
      continue;
    }

    const excerpt =
      (row.seo_description || row.summary || "").trim().slice(0, 2000) || "(No excerpt)";
    const legacySource = row.legacy_source || "legacy-json";

    const existing = await prisma.blogPost.findUnique({ where: { slug: row.slug } });
    if (existing) {
      skippedDuplicate += 1;
      continue;
    }
    await prisma.blogPost.create({
      data: {
        slug: row.slug,
        title: row.title,
        excerpt,
        body: body || "<p></p>",
        coverImage: row.cover_image || null,
        tags: row.tags ?? [],
        category: row.category ?? null,
        published: true,
        legacySource,
        createdAt: pickCreatedAt(row),
      },
    });
    imported += 1;
  }

  const paramedicSlugs = PARAMEDIC_BLOG_ARTICLES.map((a) => a.slug);
  const totalLegacySourcesFound = PARAMEDIC_BLOG_ARTICLES.length + legacyRows.length;

  let imageReport = { totalImgTagsInBodies: 0, nonAbsoluteAfterImport: 0, coverImagesHttp: 0, coverImagesRelative: 0 };
  try {
    const all = await prisma.blogPost.findMany({ select: { body: true, coverImage: true } });
    for (const p of all) {
      const s = scanImageRefs(p.body);
      imageReport.totalImgTagsInBodies += s.imgTags;
      imageReport.nonAbsoluteAfterImport += s.nonAbsoluteSrc;
      if (p.coverImage) {
        if (p.coverImage.startsWith("http")) imageReport.coverImagesHttp += 1;
        else imageReport.coverImagesRelative += 1;
      }
    }
  } catch {
    /* optional post-import scan */
  }

  const total = await prisma.blogPost.count();
  const published = await prisma.blogPost.count({ where: { published: true } });

  console.log(
    JSON.stringify(
      {
        imported,
        skippedDuplicate,
        skippedDraft,
        skippedThin,
        errors,
        totalLegacySourcesFound,
        paramedicSourceCount: paramedicSlugs.length,
        legacyJsonRows: legacyRows.length,
        legacyPublishedInExportFile: legacyPublishedInFile,
        legacyDraftInExportFile: legacyDraftInFile,
        prismaTotalBlogPosts: total,
        prismaPublishedBlogPosts: published,
        imageReport,
        note:
          "Run scripts/export-monolith-blog-to-json.ts with LEGACY_DATABASE_URL to refresh content/blog-legacy-export.json from content_items, imaging_blog_articles, and mlt_blog_posts.",
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
