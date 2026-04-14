#!/usr/bin/env npx tsx
/**
 * Safe batched import for legacy blog manifests (e.g. data/blog-manifest/batch-01/batch-01-import-ready.json).
 * Does not delete rows. Skips overwriting DB content when existing post is longer/richer.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/blog/import-legacy-manifest.ts --dry-run
 *   npx tsx scripts/blog/import-legacy-manifest.ts --apply --batch-size=25
 *   npx tsx scripts/blog/import-legacy-manifest.ts --apply --manifest=../../data/blog-manifest/batch-01/batch-01-import-ready.json
 *
 * Writes: data/audit/blog-deduplication-from-legacy.json
 */
import "../../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  BlogPostIntent,
  BlogPostStatus,
  BlogPostTemplate,
  BlogWorkflowStatus,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import { isDatabaseUrlConfigured } from "../../src/lib/db/safe-database";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..", "..", "..");
const DEFAULT_MANIFEST = path.join(REPO_ROOT, "data/blog-manifest/batch-01/batch-01-import-ready.json");
const DEDUPE_OUT = path.join(REPO_ROOT, "data/audit/blog-deduplication-from-legacy.json");

const prisma = new PrismaClient();
const MIN_BODY_CHARS = 200;
const LEGACY_SOURCE = "legacy-manifest:batch-01-import-ready.json";

type ManifestFile = {
  generatedAt?: string;
  batch?: string;
  posts: ManifestPost[];
};

type ManifestPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  locale?: string;
  sourceLocale?: string | null;
  translationGroupId?: string | null;
  canonicalPostId?: string | null;
  isAutoTranslated?: boolean;
  translationSource?: string | null;
  targetKeyword?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  relatedLessonPaths?: string[];
  relatedTools?: string[];
  category?: string | null;
  careerSlug?: string | null;
  exam?: string | null;
  postTemplate?: string | null;
  intent?: string | null;
  workflowStatus?: string | null;
  postStatus?: string | null;
  requiresReferences?: boolean;
  apaReferences?: string[];
};

type DedupeEntry = {
  slug: string;
  action: "created" | "updated" | "skipped_inferior" | "skipped_invalid" | "would_create" | "would_update" | "would_skip_inferior" | "failed";
  detail?: string;
  existingWordCount?: number;
  incomingWordCount?: number;
};

function hashTitleBody(title: string, body: string): string {
  return crypto.createHash("sha256").update(`${title}\n${body}`).digest("hex");
}

function stripHtmlLite(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function wordCount(s: string): number {
  return stripHtmlLite(s)
    .split(/\s+/)
    .filter(Boolean).length;
}

function parseEnum<E extends Record<string, string>>(en: E, raw: string | null | undefined, fallback: E[keyof E]): E[keyof E] {
  if (!raw) return fallback;
  return (Object.values(en) as string[]).includes(raw) ? (raw as E[keyof E]) : fallback;
}

function sourceTag(slug: string): string {
  return `source-key:manifest:batch-01:${slug.trim().toLowerCase()}`;
}

function preserveExistingOverIncoming(existing: { body: string; title: string }, incoming: ManifestPost): boolean {
  const ew = wordCount(existing.body);
  const iw = wordCount(incoming.body);
  if (iw < 120 && ew > 400) return true;
  if (ew >= 350 && iw < ew * 0.82) return true;
  if (ew > iw + 200) return true;
  return false;
}

function parseArgs(): { manifestPath: string; apply: boolean; batchSize: number } {
  const wantsApply = process.argv.includes("--apply");
  const wantsDry = process.argv.includes("--dry-run");
  if (wantsApply && wantsDry) {
    console.error("Use either --apply or --dry-run, not both.");
    process.exit(1);
  }
  /** Default: dry-run (safe). Must pass --apply to write to the database. */
  const apply = wantsApply && !wantsDry;
  let manifestPath = DEFAULT_MANIFEST;
  const m = process.argv.find((a) => a.startsWith("--manifest="));
  if (m) manifestPath = path.resolve(m.split("=", 2)[1]!.trim());
  let batchSize = 25;
  const b = process.argv.find((a) => a.startsWith("--batch-size="));
  if (b) {
    const n = Number(b.split("=", 2)[1]);
    if (Number.isFinite(n) && n >= 1 && n <= 25) batchSize = Math.floor(n);
  }
  return { manifestPath, apply, batchSize };
}

function loadManifest(p: string): ManifestFile {
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw) as ManifestFile;
}

function toCreateData(row: ManifestPost): Prisma.BlogPostCreateInput {
  const tags = [sourceTag(row.slug)];
  const template = parseEnum(BlogPostTemplate, row.postTemplate, BlogPostTemplate.TOPIC_EXPLAINED);
  const intent = parseEnum(BlogPostIntent, row.intent, BlogPostIntent.EXAM_PREP);
  const workflow = parseEnum(BlogWorkflowStatus, row.workflowStatus, BlogWorkflowStatus.GENERATED);
  const status = parseEnum(BlogPostStatus, row.postStatus, BlogPostStatus.DRAFT);

  return {
    slug: row.slug.trim(),
    title: row.title.trim(),
    excerpt: row.excerpt.trim().slice(0, 2000),
    body: row.body,
    tags,
    category: row.category ?? undefined,
    locale: row.locale ?? "en",
    sourceLocale: row.sourceLocale ?? "en",
    translationGroupId: row.translationGroupId ?? undefined,
    isAutoTranslated: row.isAutoTranslated ?? false,
    translationSource: row.translationSource ?? undefined,
    targetKeyword: row.targetKeyword ?? undefined,
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    relatedLessonPaths: row.relatedLessonPaths ?? [],
    relatedTools: row.relatedTools ?? [],
    careerSlug: row.careerSlug ?? undefined,
    exam: row.exam ?? undefined,
    postTemplate: template,
    intent,
    workflowStatus: workflow,
    postStatus: status,
    requiresReferences: row.requiresReferences ?? false,
    apaReferences: row.apaReferences ?? [],
    legacySource: LEGACY_SOURCE,
  };
}

async function main(): Promise<void> {
  const { manifestPath, apply, batchSize } = parseArgs();
  const dryRun = !apply;

  if (!fs.existsSync(manifestPath)) {
    console.error(`Manifest not found: ${manifestPath}`);
    process.exit(1);
  }

  const manifest = loadManifest(manifestPath);
  const posts = (manifest.posts ?? []).filter((p) => {
    if (!p.slug?.trim() || !p.title?.trim()) return false;
    if (!p.body || p.body.trim().length < MIN_BODY_CHARS) return false;
    return true;
  });

  const invalid = (manifest.posts ?? []).length - posts.length;
  const entries: DedupeEntry[] = [];
  const summary: Record<string, unknown> = {
    generatedAt: new Date().toISOString(),
    manifestPath,
    dryRun,
    batchSize,
    postsInFile: manifest.posts?.length ?? 0,
    postsEligible: posts.length,
    postsInvalidDropped: invalid,
    created: 0,
    updated: 0,
    skippedInferior: 0,
    failed: 0,
    databaseStatus: "ok",
  };

  if (!isDatabaseUrlConfigured()) {
    for (const p of posts) {
      entries.push({
        slug: p.slug,
        action: dryRun ? "would_create" : "failed",
        detail: "DATABASE_URL not configured",
        incomingWordCount: wordCount(p.body),
      });
    }
    fs.mkdirSync(path.dirname(DEDUPE_OUT), { recursive: true });
    fs.writeFileSync(DEDUPE_OUT, JSON.stringify({ summary, entries }, null, 2), "utf8");
    console.log(JSON.stringify({ ...summary, wrote: DEDUPE_OUT }, null, 2));
    await prisma.$disconnect().catch(() => undefined);
    process.exit(0);
  }

  let dbAvailable = true;
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbAvailable = false;
  }

  if (!dbAvailable) {
    summary.databaseStatus = "unreachable";
    for (const p of posts) {
      entries.push({
        slug: p.slug,
        action: "would_create",
        detail: "Database unreachable — run with --apply when DATABASE_URL points to a live Postgres instance.",
        incomingWordCount: wordCount(p.body),
      });
    }
    fs.mkdirSync(path.dirname(DEDUPE_OUT), { recursive: true });
    fs.writeFileSync(DEDUPE_OUT, JSON.stringify({ summary, entries }, null, 2), "utf8");
    console.log(JSON.stringify({ ...summary, wrote: DEDUPE_OUT }, null, 2));
    await prisma.$disconnect().catch(() => undefined);
    process.exit(0);
  }

  for (let i = 0; i < posts.length; i += batchSize) {
    const chunk = posts.slice(i, i + batchSize);
    const slugs = chunk.map((p) => p.slug.trim());
    const existingRows = await prisma.blogPost.findMany({
      where: { slug: { in: slugs } },
      select: {
        id: true,
        slug: true,
        title: true,
        body: true,
        postStatus: true,
        tags: true,
        legacySource: true,
      },
    });
    const bySlug = new Map(existingRows.map((r) => [r.slug, r]));

    for (const row of chunk) {
      const incomingWc = wordCount(row.body);
      const existing = bySlug.get(row.slug.trim());

      if (!existing) {
        if (dryRun) {
          summary.created += 1;
          entries.push({ slug: row.slug, action: "would_create", incomingWordCount: incomingWc });
          continue;
        }
        try {
          await prisma.blogPost.create({ data: toCreateData(row) });
          summary.created += 1;
          entries.push({ slug: row.slug, action: "created", incomingWordCount: incomingWc });
        } catch (e) {
          summary.failed += 1;
          entries.push({
            slug: row.slug,
            action: "failed",
            detail: e instanceof Error ? e.message : String(e),
            incomingWordCount: incomingWc,
          });
        }
        continue;
      }

      const ew = wordCount(existing.body);
      if (preserveExistingOverIncoming(existing, row)) {
        summary.skippedInferior += 1;
        entries.push({
          slug: row.slug,
          action: dryRun ? "would_skip_inferior" : "skipped_inferior",
          detail: "Kept existing DB copy (longer/richer).",
          existingWordCount: ew,
          incomingWordCount: incomingWc,
        });
        continue;
      }

        const nextTags = [...new Set([...existing.tags, sourceTag(row.slug)])];
        const data: Prisma.BlogPostUpdateInput = {
          title: row.title.trim(),
          excerpt: row.excerpt.trim().slice(0, 2000),
          body: row.body,
          tags: nextTags,
          category: row.category ?? undefined,
          locale: row.locale ?? "en",
          sourceLocale: row.sourceLocale ?? "en",
          translationGroupId: row.translationGroupId ?? undefined,
          targetKeyword: row.targetKeyword ?? undefined,
          seoTitle: row.seoTitle ?? undefined,
          seoDescription: row.seoDescription ?? undefined,
          relatedLessonPaths: row.relatedLessonPaths ?? [],
          relatedTools: row.relatedTools ?? [],
          careerSlug: row.careerSlug ?? undefined,
          exam: row.exam ?? undefined,
          postTemplate: parseEnum(BlogPostTemplate, row.postTemplate, BlogPostTemplate.TOPIC_EXPLAINED),
          intent: parseEnum(BlogPostIntent, row.intent, BlogPostIntent.EXAM_PREP),
          workflowStatus: parseEnum(BlogWorkflowStatus, row.workflowStatus, BlogWorkflowStatus.GENERATED),
          requiresReferences: row.requiresReferences ?? false,
          apaReferences: row.apaReferences ?? [],
          legacySource: LEGACY_SOURCE,
        };

      if (dryRun) {
        summary.updated += 1;
        entries.push({
          slug: row.slug,
          action: "would_update",
          existingWordCount: ew,
          incomingWordCount: incomingWc,
        });
        continue;
      }

      try {
        await prisma.blogPost.update({
          where: { id: existing.id },
          data: data,
        });
        summary.updated += 1;
        entries.push({
          slug: row.slug,
          action: "updated",
          existingWordCount: ew,
          incomingWordCount: incomingWc,
        });
      } catch (e) {
        summary.failed += 1;
        entries.push({
          slug: row.slug,
          action: "failed",
          detail: e instanceof Error ? e.message : String(e),
          existingWordCount: ew,
          incomingWordCount: incomingWc,
        });
      }
    }
  }

  fs.mkdirSync(path.dirname(DEDUPE_OUT), { recursive: true });
  fs.writeFileSync(DEDUPE_OUT, JSON.stringify({ summary, entries, contentHashesSample: posts.slice(0, 3).map((p) => ({ slug: p.slug, hash: hashTitleBody(p.title, p.body) })) }, null, 2), "utf8");

  console.log(JSON.stringify({ ...summary, wrote: DEDUPE_OUT }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
