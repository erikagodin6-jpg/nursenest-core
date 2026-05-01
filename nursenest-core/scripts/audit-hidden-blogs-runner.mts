#!/usr/bin/env npx tsx
/**
 * Hidden blog inventory + safe recovery (dry-run by default).
 *
 * Usage (from `nursenest-core/` package cwd):
 *   node --import tsx scripts/audit-hidden-blogs-runner.mts
 *   node --import tsx scripts/audit-hidden-blogs-runner.mts --write-reports
 *   node --import tsx scripts/audit-hidden-blogs-runner.mts --apply --limit 5
 *   node --import tsx scripts/audit-hidden-blogs-runner.mts --apply-jobs --limit 3
 *
 * Or: `node ../scripts/audit-hidden-blogs.mjs` from repo root (wrapper sets cwd).
 */
import { mkdirSync, writeFileSync, existsSync, readdirSync, statSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { BlogPostStatus, BlogWorkflowStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { blogPostIsLive, blogLiveWhere } from "@/lib/blog/blog-visibility";
import { blogPrePublishValidationSelect, validateBlogPrePublish } from "@/lib/blog/blog-pre-publish-validation";
import { publishBlogPostCanonical } from "@/lib/blog/publish-blog-post-canonical";
import {
  classifyBlogRowForRecoveryAudit,
  recoveryAuditWordCount,
  RECOVERY_AUDIT_DEFAULT_MIN_WORDS,
  type RecoveryAuditBucket,
} from "@/lib/blog/blog-recovery-audit";
import { scheduleDeferredBlogArticleGenerationJobRetry } from "@/lib/blog/blog-article-generation-job";
import { STATIC_BLOG_POSTS } from "@/content/blog-static-posts";
import { describeCanonicalBlogNotLiveReason } from "@/lib/blog/blog-public-pipeline-trace";
import { absoluteUrl } from "@/lib/seo/site-origin";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..");
const REPO_ROOT = join(PKG_ROOT, "..");
const REPORTS_DIR = join(REPO_ROOT, "reports");

type Cli = {
  dryRun: boolean;
  apply: boolean;
  applyJobs: boolean;
  writeReports: boolean;
  limit: number;
  category?: string;
  exam?: string;
  tier?: string;
  status?: RecoveryAuditBucket;
  source?: string;
  repairContent: boolean;
};

function parseCli(argv: string[]): Cli {
  const out: Cli = {
    dryRun: true,
    apply: false,
    applyJobs: false,
    writeReports: false,
    limit: 10_000,
    repairContent: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--apply") out.apply = true;
    else if (a === "--dry-run") out.dryRun = true;
    else if (a === "--write-reports") out.writeReports = true;
    else if (a === "--apply-jobs") out.applyJobs = true;
    else if (a === "--repair-content") out.repairContent = true;
    else if (a === "--limit") out.limit = Math.max(1, Math.min(50_000, Number(argv[++i] ?? "100")));
    else if (a === "--category") out.category = argv[++i];
    else if (a === "--exam") out.exam = argv[++i];
    else if (a === "--tier") out.tier = argv[++i];
    else if (a === "--status") out.status = argv[++i] as RecoveryAuditBucket;
    else if (a === "--source") out.source = argv[++i];
  }
  if (out.apply || out.applyJobs) out.dryRun = false;
  if (out.tier && !out.exam) out.exam = out.tier;
  return out;
}

const blogAuditSelect = {
  ...blogPrePublishValidationSelect,
  publishAt: true,
  scheduledAt: true,
  workflowStatus: true,
  legacySource: true,
  locale: true,
  careerSlug: true,
  updatedAt: true,
} as const;

function scanOptionalDirs(): { path: string; exists: boolean; fileCount: number; sample: string[] }[] {
  const roots = [
    "/root/nursenestest-core-reclone",
    join(REPO_ROOT, "backup-system"),
    join(REPO_ROOT, "reports"),
    join(REPO_ROOT, "data"),
    join(REPO_ROOT, "server"),
    join(REPO_ROOT, "scripts"),
    join(REPO_ROOT, "nursenest-core", "nursenest-core"),
    PKG_ROOT,
  ];
  try {
    for (const name of readdirSync("/root")) {
      if (/^nursenest-core-corrupt/i.test(name)) {
        roots.push(join("/root", name));
      }
    }
  } catch {
    /* ignore */
  }
  const out: { path: string; exists: boolean; fileCount: number; sample: string[] }[] = [];
  for (const p of roots) {
    if (!existsSync(p)) {
      out.push({ path: p, exists: false, fileCount: 0, sample: [] });
      continue;
    }
    let n = 0;
    const sample: string[] = [];
    const walk = (dir: string, depth: number) => {
      if (depth > 3 || n > 500) return;
      let entries: string[] = [];
      try {
        entries = readdirSync(dir);
      } catch {
        return;
      }
      for (const name of entries) {
        if (name === "node_modules" || name === ".git") continue;
        const full = join(dir, name);
        let st: ReturnType<typeof statSync>;
        try {
          st = statSync(full);
        } catch {
          continue;
        }
        if (st.isDirectory()) walk(full, depth + 1);
        else if (/blog|article|post/i.test(name) && /\.(json|md|mdx|html)$/i.test(name)) {
          n += 1;
          if (sample.length < 12) sample.push(relative(REPO_ROOT, full));
        }
      }
    };
    walk(p, 0);
    out.push({ path: p, exists: true, fileCount: n, sample });
  }
  return out;
}

async function main() {
  loadEnv({ path: join(PKG_ROOT, ".env") });
  const cli = parseCli(process.argv.slice(2));
  if (cli.repairContent) {
    console.error("--repair-content is not implemented; refusing to rewrite bodies.");
    process.exit(2);
  }

  mkdirSync(REPORTS_DIR, { recursive: true });
  const now = new Date();
  const minWords = Number(process.env.BLOG_RECOVERY_AUDIT_MIN_WORDS ?? RECOVERY_AUDIT_DEFAULT_MIN_WORDS);

  const inventory: Record<string, unknown> = {
    generatedAt: now.toISOString(),
    minWordFloor: minWords,
    databaseUrlConfigured: isDatabaseUrlConfigured(),
    filesystemScan: scanOptionalDirs(),
    staticCorpusSlugs: STATIC_BLOG_POSTS.map((p) => p.slug),
    blogPosts: [] as unknown[],
    contentItemsBlog: [] as unknown[],
    generationJobs: [] as unknown[],
  };

  if (!isDatabaseUrlConfigured()) {
    console.log("[audit-hidden-blogs] DATABASE_URL not configured — skipping Prisma inventory.");
    if (cli.writeReports) {
      writeFileSync(join(REPORTS_DIR, "blog-hidden-content-inventory.json"), JSON.stringify(inventory, null, 2));
      console.log(`Wrote placeholder inventory (filesystem scan only): ${join(REPORTS_DIR, "blog-hidden-content-inventory.json")}`);
    }
    console.log("Dry-run complete (no DB).");
    process.exit(0);
  }

  const slugCounts = await prisma.blogPost.groupBy({
    by: ["slug"],
    _count: { slug: true },
    where: { slug: { not: "" } },
  });
  const dupSlugs = new Set(
    slugCounts.filter((r) => (r._count?.slug ?? 0) > 1).map((r) => r.slug),
  );

  const where: Prisma.BlogPostWhereInput = {};
  if (cli.category) where.category = { contains: cli.category, mode: "insensitive" };
  if (cli.exam) where.exam = cli.exam;
  if (cli.source) where.legacySource = { contains: cli.source, mode: "insensitive" };

  const skipBlogRowQuery = cli.status === "FAILED_OR_PENDING_GENERATION";
  const rows = skipBlogRowQuery
    ? []
    : await prisma.blogPost.findMany({
        where,
        select: blogAuditSelect,
        orderBy: { updatedAt: "desc" },
        take: cli.limit,
      });

  const sitemapEligibleIds = new Set(
    (
      await prisma.blogPost.findMany({
        where: blogLiveWhere(now),
        select: { id: true },
      })
    ).map((r) => r.id),
  );

  const jobs = await prisma.blogArticleGenerationJob.findMany({
    where: {
      OR: [
        { stage: "failed" },
        { stage: "queued" },
        { stage: "generating_plan" },
        { stage: "generating_body" },
        { stage: "repairing_body" },
        { stage: "validating_citations" },
        { stage: "prepublish_checks" },
        { stage: "publishing" },
      ],
    },
    select: {
      id: true,
      stage: true,
      blogPostId: true,
      repairable: true,
      retryCount: true,
      lastError: true,
      failureCode: true,
      resultSlug: true,
      resultTitle: true,
      createdAt: true,
      nextAttemptAt: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 500,
  });

  let contentItemsBlog: { id: string; slug: string; title: string; status: string | null; type: string }[] = [];
  try {
    contentItemsBlog = await prisma.contentItem.findMany({
      where: { type: "blog" },
      select: { id: true, slug: true, title: true, status: true, type: true },
      take: 500,
    });
  } catch {
    contentItemsBlog = [];
  }
  inventory.contentItemsBlog = contentItemsBlog;

  const postsOut: Record<string, unknown>[] = [];
  const groups: Record<RecoveryAuditBucket, typeof postsOut> = {
    READY_TO_PUBLISH: [],
    NEEDS_REVIEW: [],
    BLOCKED: [],
    ORPHANED: [],
    FAILED_OR_PENDING_GENERATION: [],
    LIVE: [],
  };
  const jobSummaries: unknown[] = [];

  for (const row of rows) {
    const pre = await validateBlogPrePublish(row, row.id);
    const dup = dupSlugs.has(row.slug);
    const classified = classifyBlogRowForRecoveryAudit({
      row: {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        body: row.body,
        postStatus: row.postStatus,
        workflowStatus: row.workflowStatus,
        publishAt: row.publishAt,
        scheduledAt: row.scheduledAt,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        category: row.category,
        legacySource: row.legacySource,
      },
      duplicateSlug: dup,
      prePublish: pre,
      now,
      minWordFloor: minWords,
    });
    let bucket = classified.bucket;
    if (cli.status && bucket !== cli.status) continue;

    const hiddenReason =
      bucket === "LIVE"
        ? ["public_live"]
        : [
            describeCanonicalBlogNotLiveReason(
              {
                postStatus: row.postStatus,
                publishAt: row.publishAt,
                scheduledAt: row.scheduledAt,
                workflowStatus: row.workflowStatus,
                slug: row.slug,
                locale: row.locale ?? "en",
                careerSlug: row.careerSlug,
                exam: row.exam,
              },
              now,
            ),
          ];
    const wordCount = recoveryAuditWordCount(row.body);
    const entry = {
      id: row.id,
      title: row.title,
      slug: row.slug,
      currentSource: "prisma:BlogPost",
      postStatus: row.postStatus,
      workflowStatus: row.workflowStatus,
      publishAt: row.publishAt?.toISOString() ?? null,
      expectedPublicUrl: absoluteUrl(`/blog/${encodeURI(row.slug)}`),
      sitemapEligible: sitemapEligibleIds.has(row.id),
      wordCount,
      seoTitle: row.seoTitle,
      metaDescription: row.seoDescription,
      category: row.category,
      exam: row.exam,
      duplicateRisk: dup,
      bucket,
      reasons: classified.reasons,
      hiddenReasonCodes: hiddenReason,
      prePublishBlocking: pre.blocking.map((b) => ({ id: b.id, message: b.message })),
    };
    postsOut.push(entry);
    groups[bucket].push(entry);
  }

  for (const j of jobs) {
    const jobEntry = {
      id: j.id,
      currentSource: "prisma:BlogArticleGenerationJob",
      stage: j.stage,
      blogPostId: j.blogPostId,
      repairable: j.repairable,
      retryCount: j.retryCount,
      lastError: j.lastError?.slice(0, 500) ?? null,
      failureCode: j.failureCode,
      resultSlug: j.resultSlug,
      resultTitle: j.resultTitle,
      nextAttemptAt: j.nextAttemptAt?.toISOString() ?? null,
      bucket: "FAILED_OR_PENDING_GENERATION" as const,
    };
    (inventory.generationJobs as unknown[]).push(jobEntry);
    jobSummaries.push(jobEntry);
  }

  inventory.blogPosts = postsOut;

  console.log("\n=== Blog recovery audit (canonical BlogPost) ===\n");
  for (const k of Object.keys(groups) as RecoveryAuditBucket[]) {
    if (k === "FAILED_OR_PENDING_GENERATION") console.log(`${k}: ${jobSummaries.length}`);
    else console.log(`${k}: ${groups[k].length}`);
  }

  if (cli.writeReports) {
    writeFileSync(join(REPORTS_DIR, "blog-hidden-content-inventory.json"), JSON.stringify(inventory, null, 2));
    console.log(`\nWrote ${join(REPORTS_DIR, "blog-hidden-content-inventory.json")}`);
  }

  if (!cli.apply && !cli.applyJobs) {
    console.log(
      "\nDry-run: no writes. Use --apply for READY_TO_PUBLISH (canonical publish) or --apply-jobs to defer failed repairable generation jobs.",
    );
    process.exit(0);
  }

  if (cli.apply) {
    const targets = groups.READY_TO_PUBLISH.filter((p) => "id" in p && typeof (p as { id: string }).id === "string") as {
      id: string;
      slug: string;
    }[];
    let published = 0;
    for (const t of targets.slice(0, cli.limit)) {
      try {
        await publishBlogPostCanonical({
          postId: t.id,
          publishAt: now,
          context: "audit_hidden_blogs_apply",
          acknowledgePrePublishWarnings: true,
          skipRevalidate: true,
        });
        published += 1;
        console.log(`Published (canonical): ${t.slug}`);
      } catch (e) {
        console.error(`Skip ${t.slug}:`, e instanceof Error ? e.message : e);
      }
    }
    console.log(`\n--apply complete: ${published} published (READY_TO_PUBLISH only).`);
  }

  if (cli.applyJobs) {
    const failedRepairable = jobs.filter((j) => j.stage === "failed" && j.repairable);
    let jn = 0;
    for (const j of failedRepairable.slice(0, cli.limit)) {
      const r = await scheduleDeferredBlogArticleGenerationJobRetry(j.id);
      console.log(`Job ${j.id}:`, r);
      if (r.ok) jn += 1;
    }
    console.log(`\n--apply-jobs complete: deferred ${jn} repairable failed generation jobs.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
