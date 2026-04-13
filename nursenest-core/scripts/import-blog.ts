/**
 * Import blog posts into BlogPost (Prisma).
 *
 * Source:
 * - JSON export: `content/blog-legacy-export.json` (from `export-monolith-blog-to-json.ts` or manual)
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
import { BlogPostStatus, PrismaClient } from "@prisma/client";
import { PARAMEDIC_BLOG_ARTICLES } from "../../client/src/allied/data/paramedic-blog-data";
import { legacyBlogHtmlFromRow, normalizeBlogAssetUrls } from "../src/lib/blog/serialize-content";
import { excerptFromParamedic, paramedicArticleToHtml } from "../src/lib/blog/serialize-paramedic";

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

type UnifiedImportRow = {
  source: "legacy_export" | "paramedic_static" | "imaging_json" | "mlt_stub";
  sourceKey: string;
  slug: string | null;
  title: string | null;
  summary: string | null;
  seoDescription: string | null;
  category: string | null;
  tags: string[];
  bodyHtml: string | null;
  status: string | null;
  publishedAt: Date | null;
  createdAt: Date | null;
  scheduledAt: Date | null;
  coverImage: string | null;
  legacySource: string;
  careerSlug: string | null;
};

function readLegacyJson(): LegacyExportRow[] {
  const p = path.join(__dirname, "../content/blog-legacy-export.json");
  if (!fs.existsSync(p)) return [];
  const raw = JSON.parse(fs.readFileSync(p, "utf8"));
  return Array.isArray(raw) ? raw : [];
}

function readImagingJson(): Record<string, unknown>[] {
  return readJsonArray<Record<string, unknown>>(path.join(__dirname, "../data/replit-exports/imaging_blog_articles.json"));
}

function readJsonArray<T>(p: string): T[] {
  if (!fs.existsSync(p)) return [];
  const raw = JSON.parse(fs.readFileSync(p, "utf8"));
  return Array.isArray(raw) ? (raw as T[]) : [];
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

function normalizeSlug(seed: string): string {
  const cleaned = seed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 110);
  return cleaned || "legacy-blog-post";
}

async function uniqueSlug(base: string): Promise<string> {
  let candidate = base;
  let n = 0;
  while (await prisma.blogPost.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    n += 1;
    candidate = `${base}-${n}`.slice(0, 120);
  }
  return candidate;
}

const AUTO_PUBLISH_PAST_SCHEDULED = true;

function rowLegacyStatus(row: LegacyExportRow): "published" | "scheduled" | "draft_or_other" {
  const st = (row.status || "").toLowerCase();
  if (st === "published") return "published";
  if (st === "scheduled") return "scheduled";
  return "draft_or_other";
}

function parseDateOrNull(raw: string | null | undefined): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isFinite(d.getTime()) ? d : null;
}

function parseUnknownDateOrNull(raw: unknown): Date | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  return parseDateOrNull(raw);
}

function resolveImportPublishState(row: LegacyExportRow): {
  legacyStatus: "published" | "scheduled" | "draft_or_other";
  postStatus: BlogPostStatus;
  publishAt: Date | null;
  scheduledAt: Date | null;
  autoPublishedFromPastSchedule: boolean;
} {
  const legacyStatus = rowLegacyStatus(row);
  const publishedAt = parseDateOrNull(row.published_at);
  const scheduledAt = parseDateOrNull(row.scheduled_at);

  if (legacyStatus === "published") {
    return {
      legacyStatus,
      postStatus: BlogPostStatus.PUBLISHED,
      publishAt: publishedAt,
      scheduledAt: null,
      autoPublishedFromPastSchedule: false,
    };
  }
  if (legacyStatus === "scheduled") {
    const autoPublish =
      AUTO_PUBLISH_PAST_SCHEDULED &&
      scheduledAt !== null &&
      scheduledAt.getTime() <= Date.now();
    return {
      legacyStatus,
      postStatus: autoPublish ? BlogPostStatus.PUBLISHED : BlogPostStatus.SCHEDULED,
      publishAt: scheduledAt,
      scheduledAt,
      autoPublishedFromPastSchedule: autoPublish,
    };
  }
  return {
    legacyStatus,
    postStatus: BlogPostStatus.DRAFT,
    publishAt: null,
    scheduledAt: null,
    autoPublishedFromPastSchedule: false,
  };
}

function resolveUnifiedRowPublishState(row: UnifiedImportRow): {
  legacyStatus: "published" | "scheduled" | "draft_or_other";
  postStatus: BlogPostStatus;
  publishAt: Date | null;
  scheduledAt: Date | null;
  autoPublishedFromPastSchedule: boolean;
} {
  const status = String(row.status ?? "").toLowerCase();
  if (status === "published") {
    return {
      legacyStatus: "published",
      postStatus: BlogPostStatus.PUBLISHED,
      publishAt: row.publishedAt,
      scheduledAt: null,
      autoPublishedFromPastSchedule: false,
    };
  }
  if (status === "scheduled") {
    const autoPublish =
      AUTO_PUBLISH_PAST_SCHEDULED &&
      row.scheduledAt !== null &&
      row.scheduledAt.getTime() <= Date.now();
    return {
      legacyStatus: "scheduled",
      postStatus: autoPublish ? BlogPostStatus.PUBLISHED : BlogPostStatus.SCHEDULED,
      publishAt: row.scheduledAt,
      scheduledAt: row.scheduledAt,
      autoPublishedFromPastSchedule: autoPublish,
    };
  }
  return {
    legacyStatus: "draft_or_other",
    postStatus: BlogPostStatus.DRAFT,
    publishAt: null,
    scheduledAt: null,
    autoPublishedFromPastSchedule: false,
  };
}

function pickCreatedAt(row: LegacyExportRow): Date {
  if (row.created_at) return new Date(row.created_at);
  if (row.published_at) return new Date(row.published_at);
  if (row.scheduled_at) return new Date(row.scheduled_at);
  return new Date();
}

function firstParagraphExcerpt(html: string): string {
  const p = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? "";
  const plain = p.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.slice(0, 500);
}

function parseMltStubRows(): UnifiedImportRow[] {
  const p = path.join(__dirname, "../../client/src/allied/pages/mlt-blog.tsx");
  if (!fs.existsSync(p)) return [];
  const raw = fs.readFileSync(p, "utf8");
  const regex =
    /\{\s*slug:\s*"([^"]+)"\s*,\s*title:\s*"([^"]+)"\s*,\s*excerpt:\s*"([^"]+)"\s*,\s*discipline:\s*"([^"]+)"\s*,\s*date:\s*"([^"]+)"/g;
  const rows: UnifiedImportRow[] = [];
  for (const m of raw.matchAll(regex)) {
    const [, slug, title, excerpt, discipline, date] = m;
    rows.push({
      source: "mlt_stub",
      sourceKey: slug,
      slug,
      title,
      summary: excerpt,
      seoDescription: excerpt,
      category: discipline || "Medical laboratory",
      tags: ["mlt", discipline.toLowerCase().replace(/[^a-z0-9]+/g, "-")],
      bodyHtml: `<h2>${title}</h2><p>${excerpt}</p>`,
      status: "published",
      publishedAt: parseDateOrNull(date),
      createdAt: parseDateOrNull(date),
      scheduledAt: null,
      coverImage: null,
      legacySource: "mlt-static-stub",
      careerSlug: "mlt",
    });
  }
  return rows;
}

function deriveCareerSlug(input: { legacySource?: string | null; category?: string | null; tags?: string[]; slug?: string | null }): string | null {
  const source = (input.legacySource ?? "").toLowerCase();
  const category = (input.category ?? "").toLowerCase();
  const slug = (input.slug ?? "").toLowerCase();
  const tags = (input.tags ?? []).map((t) => t.toLowerCase());
  if (source.includes("paramedic") || tags.includes("paramedic") || category.includes("paramedic")) return "paramedic";
  if (source.includes("imaging") || slug.startsWith("imaging-") || tags.includes("medical-imaging") || category.includes("imaging")) return "imaging";
  if (source.includes("mlt") || slug.startsWith("mlt-") || tags.includes("mlt") || category.includes("laboratory")) return "mlt";
  if (tags.includes("allied-health") || category.includes("allied")) return "allied-health";
  return null;
}

function buildUnifiedRows(legacyRows: LegacyExportRow[]): UnifiedImportRow[] {
  const fromLegacy: UnifiedImportRow[] = legacyRows.map((row) => {
    const htmlRaw = legacyBlogHtmlFromRow(row);
    const bodyHtml = normalizeBlogAssetUrls(htmlRaw);
    return {
      source: "legacy_export",
      sourceKey: row.slug || row.title || `legacy-${Math.random()}`,
      slug: row.slug ?? null,
      title: row.title ?? null,
      summary: row.summary ?? null,
      seoDescription: row.seo_description ?? null,
      category: row.category ?? null,
      tags: row.tags ?? [],
      bodyHtml,
      status: row.status ?? null,
      publishedAt: parseDateOrNull(row.published_at),
      createdAt: parseDateOrNull(row.created_at),
      scheduledAt: parseDateOrNull(row.scheduled_at),
      coverImage: row.cover_image ?? null,
      legacySource: row.legacy_source ?? "legacy-json",
      careerSlug: deriveCareerSlug({
        legacySource: row.legacy_source,
        category: row.category,
        tags: row.tags ?? [],
        slug: row.slug,
      }),
    };
  });

  const fromParamedic: UnifiedImportRow[] = PARAMEDIC_BLOG_ARTICLES.map((article) => ({
    source: "paramedic_static",
    sourceKey: article.slug,
    slug: article.slug,
    title: article.title,
    summary: excerptFromParamedic(article),
    seoDescription: article.metaDescription,
    category: article.category || "Paramedic",
    tags: article.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    bodyHtml: normalizeBlogAssetUrls(paramedicArticleToHtml(article)),
    status: "published",
    publishedAt: parseDateOrNull(article.publishedDate),
    createdAt: parseDateOrNull(article.publishedDate),
    scheduledAt: null,
    coverImage: null,
    legacySource: "paramedic-static",
    careerSlug: "paramedic",
  }));

  const fromImaging: UnifiedImportRow[] = readImagingJson().map((row) => {
    const slug = typeof row.slug === "string" ? row.slug : null;
    const title = typeof row.title === "string" ? row.title : null;
    const summary = typeof row.summary === "string" ? row.summary : null;
    const contentHtml = typeof row.content_html === "string" ? row.content_html : null;
    const category = typeof row.category === "string" ? row.category : "Medical imaging";
    const status = typeof row.status === "string" ? row.status : "published";
    const tags = Array.isArray(row.tags) ? row.tags.filter((t): t is string => typeof t === "string") : [];
    return {
      source: "imaging_json",
      sourceKey: slug ?? title ?? "imaging-json",
      slug: slug ? `imaging-${slug}` : null,
      title,
      summary,
      seoDescription: typeof row.meta_description === "string" ? row.meta_description : null,
      category,
      tags,
      bodyHtml: contentHtml,
      status,
      publishedAt: parseUnknownDateOrNull(row.published_at),
      createdAt: parseUnknownDateOrNull(row.created_at),
      scheduledAt: parseUnknownDateOrNull(row.scheduled_at),
      coverImage: null,
      legacySource: "imaging_json_export",
      careerSlug: "imaging",
    };
  });

  return [...fromLegacy, ...fromParamedic, ...fromImaging, ...parseMltStubRows()];
}

async function main() {
  let imported = 0;
  let failed = 0;
  let importedLegacy = 0;
  let publishedImported = 0;
  let scheduledImported = 0;
  let scheduledAutoPublished = 0;
  let draftsSkipped = 0;
  let draftsImported = 0;
  let skipped = 0;
  let skippedDuplicate = 0;
  const errors: string[] = [];
  const importedByProfession: Record<string, number> = {};
  const skippedByProfession: Record<string, number> = {};
  const failedByProfession: Record<string, number> = {};
  const skippedReasonCounts: Record<string, number> = {};
  const skip = (reason: string) => {
    skipped += 1;
    skippedReasonCounts[reason] = (skippedReasonCounts[reason] ?? 0) + 1;
  };

  const legacyRows = readLegacyJson();
  const unifiedRows = buildUnifiedRows(legacyRows);

  for (const [idx, row] of unifiedRows.entries()) {
    const fallbackTitle = row.slug ? row.slug.replace(/[-_]+/g, " ").trim() : `Legacy blog post ${idx + 1}`;
    const title = (row.title ?? "").trim() || fallbackTitle || `Legacy blog post ${idx + 1}`;
    const slugSeed = normalizeSlug((row.slug ?? "").trim() || title);
    const slug = await uniqueSlug(slugSeed);
    const publishState = resolveUnifiedRowPublishState(row);
    if (publishState.legacyStatus === "draft_or_other") {
      // Preserve drafts in DB (do not discard legacy content).
      draftsImported += 1;
    }

    const excerpt =
      (row.summary || row.seoDescription || "").trim().slice(0, 500) ||
      firstParagraphExcerpt(row.bodyHtml ?? "") ||
      title.slice(0, 500);
    const legacySource = row.legacySource || "legacy-json";
    const professionKey = row.careerSlug ?? "unspecified";

    const existing = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
    if (existing) {
      skippedDuplicate += 1;
      skippedByProfession[professionKey] = (skippedByProfession[professionKey] ?? 0) + 1;
      skip("duplicate_slug");
      continue;
    }

    const translationGroupId = normalizeSlug(slug.replace(/-(en|fr|es|de|pt|it|nl|tl|hi|zh|ar|ko|ja|ru)$/i, ""));
    try {
      await prisma.blogPost.create({
        data: {
          slug,
          title,
          excerpt,
          body: row.bodyHtml || "<p></p>",
          coverImage: row.coverImage || null,
          tags: row.tags ?? [],
          category: row.category ?? null,
          postStatus: publishState.postStatus,
          publishAt: publishState.publishAt,
          scheduledAt: publishState.scheduledAt,
          locale: "en",
          sourceLocale: "en",
          isAutoTranslated: false,
          translationSource: row.source,
          translationGroupId,
          canonicalPostId: null,
          careerSlug: row.careerSlug,
          legacySource,
          createdAt: row.createdAt ?? new Date(),
          exam: row.careerSlug ? "Allied" : null,
        },
      });
      imported += 1;
      importedLegacy += 1;
      importedByProfession[professionKey] = (importedByProfession[professionKey] ?? 0) + 1;
      if (publishState.legacyStatus === "published") {
        publishedImported += 1;
      } else if (publishState.legacyStatus === "scheduled") {
        scheduledImported += 1;
        if (publishState.autoPublishedFromPastSchedule) scheduledAutoPublished += 1;
      }
    } catch (e) {
      failed += 1;
      failedByProfession[professionKey] = (failedByProfession[professionKey] ?? 0) + 1;
      const reason = e instanceof Error ? e.message : String(e);
      skip("create_failed");
      errors.push(`legacy:${slug} import failed: ${reason}`);
    }
  }

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
  const published = await prisma.blogPost.count({ where: { postStatus: BlogPostStatus.PUBLISHED } });

  console.log(
    JSON.stringify(
      {
        sourceFile: "content/blog-legacy-export.json",
        totalPostsFound: legacyRows.length,
        totalUnifiedRows: unifiedRows.length,
        imported,
        importedLegacy,
        publishedImported,
        scheduledImported,
        draftsImported,
        draftsSkipped,
        scheduledAutoPublished,
        autoPublishPastScheduledEnabled: AUTO_PUBLISH_PAST_SCHEDULED,
        failed,
        skipped,
        skippedDuplicate,
        skippedReasonCounts,
        importedByProfession,
        skippedByProfession,
        failedByProfession,
        errors,
        legacyJsonRows: legacyRows.length,
        prismaTotalBlogPosts: total,
        prismaPublishedBlogPosts: published,
        imageReport,
        note: "Published, scheduled, and draft rows are imported without length/date filtering; scheduling metadata is preserved.",
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
