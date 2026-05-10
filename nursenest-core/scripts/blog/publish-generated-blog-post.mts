#!/usr/bin/env npx tsx
/**
 * Canonical path: generator / Cursor artifacts → validated → `BlogPost` (dry-run default).
 * Files are never public; only persisted `BlogPost` rows power `/blog`, scoped hubs, admin, and sitemap.
 *
 * @example Dry-run one JSON post
 *   npx tsx scripts/blog/publish-generated-blog-post.mts --dry-run --input=./post.json --source=cursor
 *
 * @example Import one file as draft
 *   npx tsx scripts/blog/publish-generated-blog-post.mts --apply --input=./post.json --source=cursor
 *
 * @example Publish one reviewed post (explicit)
 *   npx tsx scripts/blog/publish-generated-blog-post.mts --apply --publish --input=./post.json --source=manual
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogPostStatus, BlogWorkflowStatus, PrismaClient } from "@prisma/client";
import { loadBlogAuditEnv } from "../../src/lib/db/blog-audit-env-load";
import {
  buildLegacySourceProvenance,
  expectedCanonicalBlogPath,
  normalizeGeneratedBlogRecord,
  parseSimpleFrontmatter,
  validateGeneratedBlogMaterialization,
  verifyLiveMatchesIntent,
  wordCountForGeneratedBody,
  isSitemapEligibleCanonicalBlogRow,
  type GeneratedBlogPublishSourceKind,
  type NormalizedGeneratedBlogPost,
} from "../../src/lib/blog/generated-blog-post-publish";
import { publishBlogPostCanonical } from "../../src/lib/blog/publish-blog-post-canonical";
import { blogLiveWhere } from "../../src/lib/blog/blog-visibility";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..", "..");
const repoRoot = path.resolve(appRoot, "..");

type CliArgs = {
  dryRun: boolean;
  apply: boolean;
  publish: boolean;
  input: string | null;
  slug: string | null;
  title: string | null;
  excerpt: string | null;
  bodyFile: string | null;
  sourceKind: GeneratedBlogPublishSourceKind;
  updateExisting: boolean;
  allowPublishedUpdate: boolean;
  limit: number;
};

function parseArgs(argv: string[]): CliArgs {
  let dryRun = true;
  let apply = false;
  let publish = false;
  let input: string | null = null;
  let slug: string | null = null;
  let title: string | null = null;
  let excerpt: string | null = null;
  let bodyFile: string | null = null;
  let sourceKind: GeneratedBlogPublishSourceKind = "cursor";
  let updateExisting = false;
  let allowPublishedUpdate = false;
  let limit = Number.POSITIVE_INFINITY;

  const sourceSet = new Set(["cursor", "batch", "manual", "legacy"]);

  for (const a of argv) {
    if (a === "--dry-run") dryRun = true;
    if (a === "--apply") {
      apply = true;
      dryRun = false;
    }
    if (a === "--publish") publish = true;
    if (a.startsWith("--input=")) input = a.slice("--input=".length).trim() || null;
    if (a.startsWith("--slug=")) slug = a.slice("--slug=".length).trim() || null;
    if (a.startsWith("--title=")) title = a.slice("--title=".length).trim() || null;
    if (a.startsWith("--excerpt=")) excerpt = a.slice("--excerpt=".length).trim() || null;
    if (a.startsWith("--body-file=")) bodyFile = a.slice("--body-file=".length).trim() || null;
    if (a.startsWith("--source=")) {
      const s = a.slice("--source=".length).trim().toLowerCase();
      if (sourceSet.has(s)) sourceKind = s as GeneratedBlogPublishSourceKind;
    }
    if (a === "--update-existing") updateExisting = true;
    if (a === "--allow-published-update") allowPublishedUpdate = true;
    if (a.startsWith("--limit=")) {
      const n = Number(a.slice("--limit=".length));
      if (Number.isFinite(n) && n > 0) limit = n;
    }
  }

  return {
    dryRun,
    apply,
    publish,
    input,
    slug,
    title,
    excerpt,
    bodyFile,
    sourceKind,
    updateExisting,
    allowPublishedUpdate,
    limit,
  };
}

async function readText(p: string): Promise<string> {
  return fs.readFile(p, "utf8");
}

function recordFromJsonText(text: string): Array<Record<string, unknown>> {
  const data = JSON.parse(text) as unknown;
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.posts)) return o.posts as Record<string, unknown>[];
    return [o];
  }
  return [];
}

async function loadRecordsFromFile(
  filePath: string,
  opts: { pickSlug: string | null },
): Promise<Array<{ sourcePath: string; record: Record<string, unknown> }>> {
  const abs = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  const raw = await readText(abs);
  const ext = path.extname(abs).toLowerCase();

  if (ext === ".json") {
    const rows = recordFromJsonText(raw);
    if (opts.pickSlug) {
      const one = rows.find((r) => String(r.slug ?? "") === opts.pickSlug);
      return one ? [{ sourcePath: abs, record: one }] : [];
    }
    return rows.map((record) => ({ sourcePath: abs, record }));
  }

  if (ext === ".md" || ext === ".markdown" || ext === ".mdx") {
    const { meta, body } = parseSimpleFrontmatter(raw);
    const record: Record<string, unknown> = { ...meta, body };
    return [{ sourcePath: abs, record }];
  }

  if (ext === ".html" || ext === ".htm") {
    const { meta, body } = parseSimpleFrontmatter(raw);
    const htmlBody = meta.body ? String(meta.body) : body;
    const record: Record<string, unknown> = { ...meta, body: htmlBody };
    return [{ sourcePath: abs, record }];
  }

  return [];
}

async function collectRecords(args: CliArgs): Promise<Array<{ sourcePath: string; record: Record<string, unknown> }>> {
  const out: Array<{ sourcePath: string; record: Record<string, unknown> }> = [];
  const lim = Number.isFinite(args.limit) ? args.limit : Number.POSITIVE_INFINITY;

  if (args.input) {
    const abs = path.isAbsolute(args.input) ? args.input : path.resolve(process.cwd(), args.input);
    const st = await fs.stat(abs);
    if (st.isDirectory()) {
      const names = await fs.readdir(abs);
      const files = names
        .filter((n) => /\.(json|md|markdown|mdx|html|htm)$/i.test(n))
        .sort()
        .map((n) => path.join(abs, n));
      for (const f of files) {
        if (out.length >= lim) break;
        const chunk = await loadRecordsFromFile(f, { pickSlug: null });
        for (const row of chunk) {
          if (out.length >= lim) break;
          out.push(row);
        }
      }
      return out;
    }
    return loadRecordsFromFile(abs, { pickSlug: args.slug });
  }

  if (args.slug && args.title && args.excerpt && args.bodyFile) {
    const body = await readText(path.isAbsolute(args.bodyFile) ? args.bodyFile : path.resolve(process.cwd(), args.bodyFile));
    return [
      {
        sourcePath: args.bodyFile,
        record: {
          slug: args.slug,
          title: args.title,
          excerpt: args.excerpt,
          body,
        },
      },
    ];
  }

  return out;
}

function draftScalars() {
  return {
    postStatus: BlogPostStatus.NEEDS_REVIEW,
    workflowStatus: BlogWorkflowStatus.NEEDS_SEO_REVIEW,
    publishAt: null as Date | null,
    scheduledAt: null as Date | null,
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.publish && !args.apply) {
    console.error("[blog:publish-generated] --publish requires --apply.");
    process.exit(1);
  }

  const env = await loadBlogAuditEnv({
    appRoot,
    repoRoot,
    whenMissingDatabaseUrlLog:
      "[blog-audit-env] DATABASE_URL missing; publish-generated will skip DB reads/writes until DATABASE_URL is set",
  });

  if (args.apply && !env.databaseUrlSet) {
    console.error("[blog:publish-generated] --apply requires DATABASE_URL.");
    process.exit(1);
  }

  let records = await collectRecords(args);
  const lim = Number.isFinite(args.limit) ? args.limit : records.length;
  records = records.slice(0, lim);
  if (records.length === 0) {
    console.error(
      "[blog:publish-generated] No records resolved. Use --input=<file|dir>, or --slug --title --excerpt --body-file=.",
    );
    process.exit(2);
  }

  const prisma = env.databaseUrlSet ? new PrismaClient() : null;
  const now = new Date();
  const generatedAt = now.toISOString();
  const results: unknown[] = [];

  for (const { sourcePath, record } of records) {
    const rowResult: Record<string, unknown> = { sourcePath };

    const norm = normalizeGeneratedBlogRecord(record);
    if (!norm.ok || !norm.value) {
      rowResult.ok = false;
      rowResult.errors = norm.errors;
      results.push(rowResult);
      continue;
    }
    const n: NormalizedGeneratedBlogPost = norm.value;
    const wc = wordCountForGeneratedBody(n.body);
    rowResult.slug = n.slug;
    rowResult.wordCount = wc;

    let existing: {
      id: string;
      postStatus: BlogPostStatus;
      workflowStatus: BlogWorkflowStatus;
      publishAt: Date | null;
      scheduledAt: Date | null;
      legacySource: string | null;
    } | null = null;
    if (prisma) {
      existing = await prisma.blogPost.findUnique({
        where: { slug: n.slug },
        select: {
          id: true,
          postStatus: true,
          workflowStatus: true,
          publishAt: true,
          scheduledAt: true,
          legacySource: true,
        },
      });
    }

    const val = validateGeneratedBlogMaterialization({
      normalized: n,
      wordCount: wc,
      existing,
      flags: {
        updateExisting: args.updateExisting,
        allowPublishedUpdate: args.allowPublishedUpdate,
        wantPublish: args.publish,
      },
      now,
    });

    const provenance = buildLegacySourceProvenance({
      sourceKind: args.sourceKind,
      inputPath: sourcePath,
      generatedAt,
    });

    const publicPath = expectedCanonicalBlogPath(n.slug, n.careerSlug);
    rowResult.expectedPublicPath = publicPath;

    if (!val.ok) {
      rowResult.ok = false;
      rowResult.action = val.action;
      rowResult.reasons = val.reasons;
      results.push(rowResult);
      continue;
    }

    rowResult.ok = true;
    rowResult.action = val.action;
    rowResult.dryRun = args.dryRun;
    rowResult.wouldPublish = args.publish;

    if (!args.apply || !prisma) {
      results.push(rowResult);
      continue;
    }

    const baseData = {
      title: n.title,
      excerpt: n.excerpt,
      body: n.body,
      category: n.category,
      tags: n.tags,
      locale: n.locale,
      careerSlug: n.careerSlug,
      exam: n.exam,
      seoTitle: n.seoTitle,
      seoDescription: n.seoDescription,
      metaTitleVariant: n.seoTitle,
      metaDescriptionVariant: n.seoDescription,
      targetKeyword: n.targetKeyword,
      apaReferences: n.apaReferences,
      requiresReferences: n.requiresReferences,
      relatedLessonPaths: n.relatedLessonPaths,
      sourcesJson: n.sourcesJson,
      internalLinkPlan: n.internalLinkPlan,
      faqBlock: n.faqBlock,
      schemaSummary: n.schemaSummary,
      legacySource: existing?.legacySource?.trim() || provenance,
    };

    let postId: string;
    if (val.action === "create") {
      const created = await prisma.blogPost.create({
        data: {
          slug: n.slug,
          ...baseData,
          ...draftScalars(),
        },
        select: { id: true },
      });
      postId = created.id;
    } else {
      if (!existing) {
        rowResult.ok = false;
        rowResult.reasons = ["missing_existing_row"];
        results.push(rowResult);
        continue;
      }
      postId = existing.id;
      await prisma.blogPost.update({
        where: { id: existing.id },
        data: {
          ...baseData,
          ...draftScalars(),
        },
      });
    }

    if (args.publish) {
      await publishBlogPostCanonical({
        postId,
        publishAt: now,
        clearScheduledAt: true,
        context: "generated_blog_publish_cli",
        acknowledgePrePublishWarnings: true,
        setLegacySourceIfEmpty: "cursor-generated",
      });
    }

    const reread = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: {
        slug: true,
        postStatus: true,
        workflowStatus: true,
        publishAt: true,
        scheduledAt: true,
      },
    });
    if (!reread) {
      rowResult.verify = "missing_after_write";
      results.push(rowResult);
      continue;
    }

    const verify = verifyLiveMatchesIntent({
      postStatus: reread.postStatus,
      workflowStatus: reread.workflowStatus,
      publishAt: reread.publishAt,
      scheduledAt: reread.scheduledAt,
      intendedPublished: args.publish,
      now,
    });

    const sitemapEligible = isSitemapEligibleCanonicalBlogRow({
      postStatus: reread.postStatus,
      workflowStatus: reread.workflowStatus,
      publishAt: reread.publishAt,
      scheduledAt: reread.scheduledAt,
      now,
    });

    const listed = args.publish
      ? await prisma.blogPost.count({
          where: { AND: [{ slug: n.slug }, blogLiveWhere(now)] },
        })
      : 0;

    rowResult.verify = verify.ok ? "ok" : verify.reasons;
    rowResult.blogPostIsLive = verify.live;
    rowResult.sitemapEligibleWhenPublished = args.publish ? sitemapEligible : false;
    rowResult.blogLiveWhereCountWhenPublished = listed;
    results.push(rowResult);
  }

  if (prisma) await prisma.$disconnect().catch(() => undefined);

  console.log(JSON.stringify({ ok: true, inputCount: records.length, resultCount: results.length, results }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
