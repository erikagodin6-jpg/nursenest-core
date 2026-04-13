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

async function main() {
  let imported = 0;
  let failed = 0;
  let importedLegacy = 0;
  let publishedImported = 0;
  let scheduledImported = 0;
  let scheduledAutoPublished = 0;
  let draftsSkipped = 0;
  let skipped = 0;
  const errors: string[] = [];
  const skippedReasonCounts: Record<string, number> = {};
  const skip = (reason: string) => {
    skipped += 1;
    skippedReasonCounts[reason] = (skippedReasonCounts[reason] ?? 0) + 1;
  };

  const legacyRows = readLegacyJson();

  for (const [idx, row] of legacyRows.entries()) {
    const htmlRaw = legacyBlogHtmlFromRow(row);
    const body = normalizeBlogAssetUrls(htmlRaw);
    const fallbackTitle = row.slug ? row.slug.replace(/[-_]+/g, " ").trim() : `Legacy blog post ${idx + 1}`;
    const title = (row.title ?? "").trim() || fallbackTitle || `Legacy blog post ${idx + 1}`;
    const slugSeed = normalizeSlug((row.slug ?? "").trim() || title);
    const slug = await uniqueSlug(slugSeed);
    const publishState = resolveImportPublishState(row);
    if (publishState.legacyStatus === "draft_or_other") {
      draftsSkipped += 1;
      skip("draft_or_other_status");
      continue;
    }

    const excerpt =
      (row.summary || row.seo_description || "").trim().slice(0, 500) ||
      firstParagraphExcerpt(body) ||
      title.slice(0, 500);
    const legacySource = row.legacy_source || "legacy-json";
    try {
      await prisma.blogPost.create({
        data: {
          slug,
          title,
          excerpt,
          body: body || "<p></p>",
          coverImage: row.cover_image || null,
          tags: row.tags ?? [],
          category: row.category ?? null,
          postStatus: publishState.postStatus,
          publishAt: publishState.publishAt,
          scheduledAt: publishState.scheduledAt,
          legacySource,
          createdAt: pickCreatedAt(row),
        },
      });
      imported += 1;
      importedLegacy += 1;
      if (publishState.legacyStatus === "published") {
        publishedImported += 1;
      } else if (publishState.legacyStatus === "scheduled") {
        scheduledImported += 1;
        if (publishState.autoPublishedFromPastSchedule) scheduledAutoPublished += 1;
      }
    } catch (e) {
      failed += 1;
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
        imported,
        importedLegacy,
        publishedImported,
        scheduledImported,
        draftsSkipped,
        scheduledAutoPublished,
        autoPublishPastScheduledEnabled: AUTO_PUBLISH_PAST_SCHEDULED,
        failed,
        skipped,
        skippedReasonCounts,
        errors,
        legacyJsonRows: legacyRows.length,
        prismaTotalBlogPosts: total,
        prismaPublishedBlogPosts: published,
        imageReport,
        note: "Published and scheduled rows are imported regardless of body length/date; drafts are skipped by status only.",
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
