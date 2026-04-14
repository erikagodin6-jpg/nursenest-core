/**
 * Batch-safe legacy blog importer.
 *
 * Sources (intentionally scoped):
 * - data/replit-exports/imaging_blog_articles.json
 * - data/replit-exports/seo_articles.json
 * - client/src/data/seo-content-articles.ts
 *
 * Usage:
 * - `npx tsx scripts/import-blog.ts` (apply mode)
 * - `npx tsx scripts/import-blog.ts --dry-run` (no writes)
 */
import { config as loadEnv } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { BlogPostStatus, PrismaClient } from "@prisma/client";
import { streamJsonArray } from "./lib/stream-json-array";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(__dirname, "../.env") });
loadEnv({ path: path.join(__dirname, "../../.env") });

const prisma = new PrismaClient();
const BATCH_MAX = 100;
const BATCH_MIN = 50;
const MEMORY_REDUCE_THRESHOLD_MB = 512;

type SourceName = "imaging_blog_articles.json" | "seo_articles.json" | "seo-content-articles.ts";

type NormalizedBlogRow = {
  source: SourceName;
  sourceId: string;
  title: string;
  content: string;
  slug: string | null;
  createdAt: Date | null;
  postStatus: BlogPostStatus;
  publishAt: Date | null;
  scheduledAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[] | null;
};

type RunStats = {
  batchNumber: number;
  totalProcessed: number;
  created: number;
  updated: number;
  unchangedSkipped: number;
  dryRunCreates: number;
  dryRunUpdates: number;
  failures: number;
  failureReasons: string[];
};

type ExistingPost = {
  id: string;
  slug: string;
  title: string;
  body: string;
  tags: string[];
  postStatus: BlogPostStatus;
  publishAt: Date | null;
  scheduledAt: Date | null;
  legacySource: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

type ExistingPostIndex = {
  bySlug: Map<string, ExistingPost>;
  byHash: Map<string, ExistingPost>;
  bySourceKey: Map<string, ExistingPost>;
};

class SchemaMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SchemaMismatchError";
  }
}

const schemaFailures: string[] = [];

function hashTitleContent(title: string, content: string): string {
  return crypto.createHash("sha256").update(`${title}\n${content}`).digest("hex");
}

function sourceKeyForRow(row: NormalizedBlogRow): string {
  return `${row.source}:${String(row.sourceId).trim().toLowerCase()}`;
}

function sourceTagForRow(row: NormalizedBlogRow): string {
  return `source-key:${sourceKeyForRow(row)}`;
}

function parseSourceTag(tags: string[]): string | null {
  const hit = tags.find((tag) => tag.startsWith("source-key:"));
  return hit ?? null;
}

function normalizeSlug(seed: string): string {
  const cleaned = seed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 110);
  return cleaned || "legacy-blog-post";
}

function parseDateOrNull(value: unknown): Date | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
}

function parseStatus(raw: unknown): BlogPostStatus {
  const status = String(raw ?? "").toLowerCase();
  if (status === "published") return BlogPostStatus.PUBLISHED;
  if (status === "scheduled") return BlogPostStatus.SCHEDULED;
  return BlogPostStatus.DRAFT;
}

function excerptFromContent(content: string): string {
  const plain = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.slice(0, 500);
}

function validateStringField(row: Record<string, unknown>, fieldName: string, source: string, sourceId: string): string {
  const value = row[fieldName];
  if (typeof value !== "string" || !value.trim()) {
    throw new SchemaMismatchError(`${source}:${sourceId} missing required string field "${fieldName}"`);
  }
  return value;
}

function parseSeoContentArticlesFromTs(filePath: string): Record<string, unknown>[] {
  const raw = fs.readFileSync(filePath, "utf8");
  const marker = "SEO_CONTENT_ARTICLES: SeoArticle[] =";
  const markerIndex = raw.indexOf(marker);
  if (markerIndex < 0) {
    throw new SchemaMismatchError("seo-content-articles.ts missing SEO_CONTENT_ARTICLES export");
  }
  const arrayStart = raw.indexOf("[", markerIndex);
  if (arrayStart < 0) {
    throw new SchemaMismatchError("seo-content-articles.ts missing SEO_CONTENT_ARTICLES array");
  }

  let depth = 0;
  let endIndex = -1;
  let inString = false;
  let escaping = false;
  for (let i = arrayStart; i < raw.length; i += 1) {
    const ch = raw[i];
    if (inString) {
      if (escaping) {
        escaping = false;
        continue;
      }
      if (ch === "\\") {
        escaping = true;
        continue;
      }
      if (ch === "\"") inString = false;
      continue;
    }
    if (ch === "\"") {
      inString = true;
      continue;
    }
    if (ch === "[") depth += 1;
    if (ch === "]") depth -= 1;
    if (depth === 0) {
      endIndex = i;
      break;
    }
  }

  if (endIndex < 0) {
    throw new SchemaMismatchError("seo-content-articles.ts array parsing failed");
  }

  const literal = raw.slice(arrayStart, endIndex + 1);
  const parsed = vm.runInNewContext(literal, {}, { timeout: 3000 });
  if (!Array.isArray(parsed)) {
    throw new SchemaMismatchError("seo-content-articles.ts did not evaluate to an array");
  }
  return parsed as Record<string, unknown>[];
}

function buildSeoArticleBody(row: Record<string, unknown>, sourceId: string): string {
  const sections = row.sections;
  if (!Array.isArray(sections)) {
    throw new SchemaMismatchError(`seo-content-articles.ts:${sourceId} missing sections[]`);
  }

  const title = validateStringField(row, "title", "seo-content-articles.ts", sourceId);
  const parts: string[] = [`# ${title}`];

  for (const section of sections) {
    if (!section || typeof section !== "object") {
      throw new SchemaMismatchError(`seo-content-articles.ts:${sourceId} has invalid section object`);
    }
    const record = section as Record<string, unknown>;
    const heading = validateStringField(record, "heading", "seo-content-articles.ts", sourceId);
    const content = validateStringField(record, "content", "seo-content-articles.ts", sourceId);
    parts.push(`\n## ${heading}\n${content}`);

    if (Array.isArray(record.items) && record.items.length > 0) {
      const listItems = record.items.map((item) => {
        if (typeof item !== "string" || !item.trim()) {
          throw new SchemaMismatchError(`seo-content-articles.ts:${sourceId} contains non-string section item`);
        }
        return `- ${item}`;
      });
      parts.push(listItems.join("\n"));
    }

    if (typeof record.tip === "string" && record.tip.trim()) {
      parts.push(`\nTip: ${record.tip}`);
    }
  }

  if (Array.isArray(row.faqs) && row.faqs.length > 0) {
    parts.push("\n## FAQs");
    for (const faq of row.faqs) {
      if (!faq || typeof faq !== "object") {
        throw new SchemaMismatchError(`seo-content-articles.ts:${sourceId} has invalid faq object`);
      }
      const record = faq as Record<string, unknown>;
      const q = validateStringField(record, "question", "seo-content-articles.ts", sourceId);
      const a = validateStringField(record, "answer", "seo-content-articles.ts", sourceId);
      parts.push(`\n### ${q}\n${a}`);
    }
  }

  if (Array.isArray(row.relatedLinks) && row.relatedLinks.length > 0) {
    parts.push("\n## Related Links");
    for (const link of row.relatedLinks) {
      if (!link || typeof link !== "object") {
        throw new SchemaMismatchError(`seo-content-articles.ts:${sourceId} has invalid related link object`);
      }
      const record = link as Record<string, unknown>;
      const label = validateStringField(record, "title", "seo-content-articles.ts", sourceId);
      const href = validateStringField(record, "href", "seo-content-articles.ts", sourceId);
      const description = typeof record.description === "string" ? ` - ${record.description}` : "";
      parts.push(`- [${label}](${href})${description}`);
    }
  }

  return parts.join("\n").trim();
}

async function* readImagingBlogRows(filePath: string): AsyncGenerator<NormalizedBlogRow, void, void> {
  for await (const rawRow of streamJsonArray(filePath)) {
    try {
      if (!rawRow || typeof rawRow !== "object") {
        throw new SchemaMismatchError("imaging_blog_articles.json contains non-object row");
      }
      const row = rawRow as Record<string, unknown>;
      const sourceId = String(row.id ?? row.slug ?? "unknown");
      const title = validateStringField(row, "title", "imaging_blog_articles.json", sourceId);
      const content = validateStringField(row, "content_html", "imaging_blog_articles.json", sourceId);
      const slug = typeof row.slug === "string" && row.slug.trim() ? row.slug : null;
      const tags = Array.isArray(row.tags) ? row.tags.filter((t): t is string => typeof t === "string" && Boolean(t.trim())) : null;

      yield {
        source: "imaging_blog_articles.json",
        sourceId,
        title,
        content,
        slug,
        createdAt: parseDateOrNull(row.created_at) ?? parseDateOrNull(row.published_at),
        postStatus: parseStatus(row.status),
        publishAt: parseDateOrNull(row.published_at),
        scheduledAt: parseDateOrNull(row.scheduled_at),
        seoTitle: typeof row.meta_title === "string" ? row.meta_title : null,
        seoDescription: typeof row.meta_description === "string" ? row.meta_description : null,
        seoKeywords: tags,
      };
    } catch (error) {
      schemaFailures.push(error instanceof Error ? error.message : String(error));
    }
  }
}

async function* readSeoArticlesRows(filePath: string): AsyncGenerator<NormalizedBlogRow, void, void> {
  for await (const rawRow of streamJsonArray(filePath)) {
    try {
      if (!rawRow || typeof rawRow !== "object") {
        throw new SchemaMismatchError("seo_articles.json contains non-object row");
      }
      const row = rawRow as Record<string, unknown>;
      const sourceId = String(row.id ?? row.slug ?? "unknown");
      const title = validateStringField(row, "title", "seo_articles.json", sourceId);
      const contentHtml = typeof row.content_html === "string" ? row.content_html.trim() : "";
      const contentMd = typeof row.content_md === "string" ? row.content_md.trim() : "";
      const content = contentHtml || contentMd;
      if (!content) {
        throw new SchemaMismatchError(`seo_articles.json:${sourceId} missing required content_html/content_md`);
      }

      const slug = typeof row.slug === "string" && row.slug.trim() ? row.slug : null;
      const keywords = [];
      if (typeof row.target_keyword === "string" && row.target_keyword.trim()) keywords.push(row.target_keyword);

      yield {
        source: "seo_articles.json",
        sourceId,
        title,
        content,
        slug,
        createdAt: parseDateOrNull(row.created_at) ?? parseDateOrNull(row.published_at),
        postStatus: parseStatus(row.status),
        publishAt: parseDateOrNull(row.published_at),
        scheduledAt: null,
        seoTitle: typeof row.meta_title === "string" ? row.meta_title : null,
        seoDescription: typeof row.meta_description === "string" ? row.meta_description : null,
        seoKeywords: keywords.length > 0 ? keywords : null,
      };
    } catch (error) {
      schemaFailures.push(error instanceof Error ? error.message : String(error));
    }
  }
}

async function* readClientSeoContentRows(filePath: string): AsyncGenerator<NormalizedBlogRow, void, void> {
  try {
    const rows = parseSeoContentArticlesFromTs(filePath);
    for (const rawRow of rows) {
      try {
        if (!rawRow || typeof rawRow !== "object") {
          throw new SchemaMismatchError("seo-content-articles.ts contains non-object row");
        }
        const row = rawRow as Record<string, unknown>;
        const sourceId = validateStringField(row, "slug", "seo-content-articles.ts", "unknown");
        const title = validateStringField(row, "title", "seo-content-articles.ts", sourceId);
        const content = buildSeoArticleBody(row, sourceId);
        const seoKeywords =
          typeof row.seoKeywords === "string"
            ? row.seoKeywords
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean)
            : null;

        yield {
          source: "seo-content-articles.ts",
          sourceId,
          title,
          content,
          slug: sourceId,
          createdAt: parseDateOrNull(row.publishDate),
          postStatus: BlogPostStatus.PUBLISHED,
          publishAt: parseDateOrNull(row.publishDate),
          scheduledAt: null,
          seoTitle: typeof row.seoTitle === "string" ? row.seoTitle : null,
          seoDescription: typeof row.seoDescription === "string" ? row.seoDescription : null,
          seoKeywords,
        };
      } catch (error) {
        schemaFailures.push(error instanceof Error ? error.message : String(error));
      }
    }
  } catch (error) {
    schemaFailures.push(error instanceof Error ? error.message : String(error));
  }
}

async function loadExistingDedupState(): Promise<ExistingPostIndex> {
  const byHash = new Map<string, ExistingPost>();
  const bySlug = new Map<string, ExistingPost>();
  const bySourceKey = new Map<string, ExistingPost>();
  let cursor: string | undefined;

  while (true) {
    const page = await prisma.blogPost.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        body: true,
        tags: true,
        postStatus: true,
        publishAt: true,
        scheduledAt: true,
        legacySource: true,
        seoTitle: true,
        seoDescription: true,
      },
      take: 500,
      orderBy: { id: "asc" },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    if (page.length === 0) break;

    for (const post of page) {
      const fullPost: ExistingPost = {
        id: post.id,
        slug: post.slug,
        title: post.title,
        body: post.body,
        tags: [...post.tags],
        postStatus: post.postStatus,
        publishAt: post.publishAt,
        scheduledAt: post.scheduledAt,
        legacySource: post.legacySource,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
      };
      bySlug.set(post.slug, fullPost);
      byHash.set(hashTitleContent(post.title, post.body), fullPost);
      const sourceTag = parseSourceTag(post.tags);
      if (sourceTag) bySourceKey.set(sourceTag.replace(/^source-key:/, ""), fullPost);
    }
    cursor = page[page.length - 1]?.id;
  }

  return { byHash, bySlug, bySourceKey };
}

function logBatchProgress(batchStats: RunStats): void {
  console.log(
    JSON.stringify(
      {
        batch: batchStats.batchNumber,
        totalProcessed: batchStats.totalProcessed,
        created: batchStats.created,
        updated: batchStats.updated,
        unchangedSkipped: batchStats.unchangedSkipped,
        dryRunCreates: batchStats.dryRunCreates,
        dryRunUpdates: batchStats.dryRunUpdates,
        failures: batchStats.failures,
      },
      null,
      2,
    ),
  );
}

async function processBatch(
  batch: NormalizedBlogRow[],
  state: ExistingPostIndex,
  run: RunStats,
  dryRun: boolean,
): Promise<void> {
  for (const row of batch) {
    const sourceKey = sourceKeyForRow(row);
    const sourceTag = sourceTagForRow(row);
    const recordHash = hashTitleContent(row.title, row.content);
    const canonicalSlug = normalizeSlug(row.slug ? row.slug : `${row.source}-${row.sourceId}`);

    const existing =
      state.bySourceKey.get(sourceKey) ??
      state.bySlug.get(canonicalSlug) ??
      state.byHash.get(recordHash) ??
      null;

    const nextTags = [...new Set([...(row.seoKeywords ?? []), sourceTag])];
    if (existing) {
      const payloadChanged =
        existing.title !== row.title ||
        existing.body !== row.content ||
        existing.postStatus !== row.postStatus ||
        (existing.publishAt?.getTime() ?? 0) !== (row.publishAt?.getTime() ?? 0) ||
        (existing.scheduledAt?.getTime() ?? 0) !== (row.scheduledAt?.getTime() ?? 0) ||
        (existing.legacySource ?? null) !== row.source ||
        (existing.seoTitle ?? null) !== (row.seoTitle ?? null) ||
        (existing.seoDescription ?? null) !== (row.seoDescription ?? null) ||
        JSON.stringify([...existing.tags].sort()) !== JSON.stringify([...nextTags].sort()) ||
        existing.slug !== canonicalSlug;

      if (!payloadChanged) {
        run.unchangedSkipped += 1;
        run.totalProcessed += 1;
        continue;
      }

      if (dryRun) {
        run.dryRunUpdates += 1;
        run.totalProcessed += 1;
        continue;
      }

      const slugConflict = state.bySlug.get(canonicalSlug);
      const nextSlug = slugConflict && slugConflict.id !== existing.id ? existing.slug : canonicalSlug;
      try {
        const updated = await prisma.blogPost.update({
          where: { id: existing.id },
          data: {
            slug: nextSlug,
            title: row.title,
            excerpt: excerptFromContent(row.content),
            body: row.content,
            postStatus: row.postStatus,
            publishAt: row.publishAt,
            scheduledAt: row.scheduledAt,
            createdAt: row.createdAt ?? undefined,
            seoTitle: row.seoTitle,
            seoDescription: row.seoDescription,
            tags: nextTags,
            legacySource: row.source,
          },
        });
        const updatedPost: ExistingPost = {
          id: updated.id,
          slug: updated.slug,
          title: updated.title,
          body: updated.body,
          tags: [...updated.tags],
          postStatus: updated.postStatus,
          publishAt: updated.publishAt,
          scheduledAt: updated.scheduledAt,
          legacySource: updated.legacySource,
          seoTitle: updated.seoTitle,
          seoDescription: updated.seoDescription,
        };
        state.bySlug.set(updated.slug, updatedPost);
        state.byHash.set(hashTitleContent(updated.title, updated.body), updatedPost);
        state.bySourceKey.set(sourceKey, updatedPost);
        run.updated += 1;
      } catch (error) {
        run.failures += 1;
        run.failureReasons.push(
          `${row.source}:${row.sourceId} -> ${error instanceof Error ? error.message : String(error)}`,
        );
      }
      run.totalProcessed += 1;
      continue;
    }

    const createData = {
      slug: canonicalSlug,
      title: row.title,
      excerpt: excerptFromContent(row.content),
      body: row.content,
      postStatus: row.postStatus,
      publishAt: row.publishAt,
      scheduledAt: row.scheduledAt,
      createdAt: row.createdAt ?? undefined,
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
      tags: nextTags,
      legacySource: row.source,
    };

    if (dryRun) {
      run.dryRunCreates += 1;
      run.totalProcessed += 1;
      continue;
    }

    let writeError: unknown = null;
    for (let attempt = 0; attempt < 1; attempt += 1) {
      try {
        const created = await prisma.blogPost.create({ data: createData });
        const createdPost: ExistingPost = {
          id: created.id,
          slug: created.slug,
          title: created.title,
          body: created.body,
          tags: [...created.tags],
          postStatus: created.postStatus,
          publishAt: created.publishAt,
          scheduledAt: created.scheduledAt,
          legacySource: created.legacySource,
          seoTitle: created.seoTitle,
          seoDescription: created.seoDescription,
        };
        state.bySlug.set(created.slug, createdPost);
        state.byHash.set(hashTitleContent(created.title, created.body), createdPost);
        state.bySourceKey.set(sourceKey, createdPost);
        writeError = null;
        break;
      } catch (error) {
        writeError = error;
      }
    }

    if (writeError) {
      run.failures += 1;
      run.totalProcessed += 1;
      run.failureReasons.push(
        `${row.source}:${row.sourceId} -> ${writeError instanceof Error ? writeError.message : String(writeError)}`,
      );
      continue;
    }

    run.created += 1;
    run.totalProcessed += 1;
  }
}

function maybeReduceBatchSize(current: number): number {
  const heapUsedMb = Math.round(process.memoryUsage().heapUsed / (1024 * 1024));
  if (heapUsedMb <= MEMORY_REDUCE_THRESHOLD_MB) return current;
  if (current <= BATCH_MIN) return current;
  const next = Math.max(BATCH_MIN, Math.floor(current / 2));
  console.log(JSON.stringify({ memoryMb: heapUsedMb, action: "reduce_batch_size", from: current, to: next }, null, 2));
  return next;
}

async function* allSourceRows(): AsyncGenerator<NormalizedBlogRow, void, void> {
  const imagingPath = path.join(__dirname, "../data/replit-exports/imaging_blog_articles.json");
  const seoArticlesPath = path.join(__dirname, "../data/replit-exports/seo_articles.json");
  const clientSeoPath = path.join(__dirname, "../../client/src/data/seo-content-articles.ts");

  if (fs.existsSync(imagingPath)) {
    yield* readImagingBlogRows(imagingPath);
  }
  if (fs.existsSync(seoArticlesPath)) {
    yield* readSeoArticlesRows(seoArticlesPath);
  }
  if (fs.existsSync(clientSeoPath)) {
    yield* readClientSeoContentRows(clientSeoPath);
  }
}

function parseArgs() {
  const dryRun = process.argv.includes("--dry-run");
  return { dryRun };
}

async function main() {
  const { dryRun } = parseArgs();
  const state = await loadExistingDedupState();
  const run: RunStats = {
    batchNumber: 0,
    totalProcessed: 0,
    created: 0,
    updated: 0,
    unchangedSkipped: 0,
    dryRunCreates: 0,
    dryRunUpdates: 0,
    failures: 0,
    failureReasons: [],
  };

  let batchSize = BATCH_MAX;
  let batch: NormalizedBlogRow[] = [];

  for await (const row of allSourceRows()) {
    batch.push(row);
    if (batch.length < batchSize) continue;

    run.batchNumber += 1;
    await processBatch(batch, state, run, dryRun);
    logBatchProgress(run);
    batch = [];
    batchSize = maybeReduceBatchSize(batchSize);
  }

  if (batch.length > 0) {
    run.batchNumber += 1;
    await processBatch(batch, state, run, dryRun);
    logBatchProgress(run);
    batch = [];
  }

  run.failures += schemaFailures.length;
  run.failureReasons.push(...schemaFailures);

  console.log(
    JSON.stringify(
      {
        dryRun,
        totalBlogPostsCreated: run.created,
        totalBlogPostsUpdated: run.updated,
        dryRunCreates: run.dryRunCreates,
        dryRunUpdates: run.dryRunUpdates,
        unchangedSkipped: run.unchangedSkipped,
        failures: run.failures,
        failureReasons: run.failureReasons,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
