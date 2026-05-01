#!/usr/bin/env npx tsx
/**
 * Import recoverable hidden full-body blog cohorts into canonical `BlogPost` (dry-run default).
 *
 * Reads: `reports/blog-hidden-content-inventory.json` (repo root).
 *
 * Usage:
 *   npx tsx scripts/blog/import-hidden-blog-content.mts --dry-run --source=all --limit=10
 *   npx tsx scripts/blog/import-hidden-blog-content.mts --apply --source=batch01 --limit=5
 *   npx tsx scripts/blog/import-hidden-blog-content.mts --apply --publish --source=newgrad --slug=my-slug
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogPostStatus, BlogWorkflowStatus, PrismaClient } from "@prisma/client";
import { loadBlogAuditEnv } from "../../src/lib/db/blog-audit-env-load";
import { countWordsFromHtml } from "../../src/lib/blog/blog-word-count";
import {
  hiddenBlogImportSourceTypeMatchesFilter,
  longFormSectionsToHtml,
  parseHiddenBlogImportSourceFilter,
  planHiddenBlogImport,
  type HiddenBlogImportPlanFlags,
} from "../../src/lib/blog/hidden-blog-content-import-plan";
import { LONG_FORM_BLOG_POSTS } from "../../src/lib/seo/long-form-seo-blog-posts";
import { publishBlogPostCanonical } from "../../src/lib/blog/publish-blog-post-canonical";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..", "..");
const repoRoot = path.resolve(appRoot, "..");
const reportsDir = path.join(repoRoot, "reports");
const inventoryPath = path.join(reportsDir, "blog-hidden-content-inventory.json");
const dryRunReportPath = path.join(reportsDir, "blog-hidden-content-import-dry-run.md");
const resultJsonPath = path.join(reportsDir, "blog-hidden-content-import-result.json");

type InventoryRow = {
  title?: string;
  slug?: string;
  sourceType?: string;
  sourceLocation?: string;
  locale?: string | null;
  wordCount?: number | null;
  reasons?: string[];
  metadata?: Record<string, unknown>;
};

type InventoryFile = {
  inventory?: InventoryRow[];
};

function countWordsFromMarkdown(value: string): number {
  return value
    .replace(/[#>*_`\[\]\(\)\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function parseArgs(argv: string[]) {
  let dryRun = true;
  let apply = false;
  let publish = false;
  let updateExisting = false;
  let allowPublishedUpdate = false;
  let source: string = "all";
  let limit = Number.POSITIVE_INFINITY;
  let slugFilter: string | null = null;

  for (const a of argv) {
    if (a === "--dry-run") dryRun = true;
    if (a === "--apply") {
      apply = true;
      dryRun = false;
    }
    if (a === "--publish") publish = true;
    if (a === "--update-existing") updateExisting = true;
    if (a === "--allow-published-update") allowPublishedUpdate = true;
    if (a.startsWith("--source=")) source = a.slice("--source=".length).trim() || "all";
    if (a.startsWith("--limit=")) {
      const n = Number(a.slice("--limit=".length));
      if (Number.isFinite(n) && n > 0) limit = n;
    }
    if (a.startsWith("--slug=")) slugFilter = a.slice("--slug=".length).trim() || null;
  }

  return { dryRun, apply, publish, updateExisting, allowPublishedUpdate, source, limit, slugFilter };
}

async function readJson<T>(p: string): Promise<T> {
  const raw = await fs.readFile(p, "utf8");
  return JSON.parse(raw) as T;
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

type ResolvedCandidate = {
  row: InventoryRow;
  bodyHtml: string;
  wordCount: number;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  category: string | null;
  tags: string[];
  careerSlug: string | null;
  exam: string | null;
  locale: string;
  apaReferences: string[];
  requiresReferences: boolean;
  relatedLessonPaths: string[];
};

async function resolveCandidateBody(row: InventoryRow): Promise<ResolvedCandidate | null> {
  const slug = String(row.slug ?? "").trim();
  const title = String(row.title ?? "").trim();
  const st = String(row.sourceType ?? "");
  const meta = row.metadata ?? {};

  if (st === "manifest_import_ready") {
    const batchPath = path.join(repoRoot, "data", "blog-manifest", "batch-01", "batch-01-import-ready.json");
    if (!(await exists(batchPath))) return null;
    const batch = await readJson<{ posts?: Array<Record<string, unknown>> }>(batchPath);
    const entry = batch.posts?.find((p) => String(p.slug ?? "") === slug);
    if (!entry) return null;
    const body = String(entry.body ?? "");
    const wc = countWordsFromHtml(body);
    return {
      row,
      bodyHtml: body,
      wordCount: wc,
      excerpt: String(entry.excerpt ?? ""),
      seoTitle: String(entry.seoTitle ?? ""),
      seoDescription: String(entry.seoDescription ?? ""),
      category: entry.category != null ? String(entry.category) : null,
      tags: Array.isArray(entry.tags) ? (entry.tags as string[]).map(String) : [],
      careerSlug: entry.careerSlug != null ? String(entry.careerSlug) : null,
      exam: entry.exam != null ? String(entry.exam) : null,
      locale: String(entry.locale ?? "en"),
      apaReferences: Array.isArray(entry.apaReferences) ? (entry.apaReferences as string[]).map(String) : [],
      requiresReferences: Boolean(entry.requiresReferences),
      relatedLessonPaths: Array.isArray(entry.relatedLessonPaths) ? (entry.relatedLessonPaths as string[]).map(String) : [],
    };
  }

  if (st === "newgrad_batch_file") {
    const loc = String(row.sourceLocation ?? "");
    const indexPath = path.isAbsolute(loc) ? loc : path.join(repoRoot, loc);
    const batchDir = path.dirname(indexPath);
    const items = await readJson<Array<Record<string, unknown>>>(indexPath).catch(() => null);
    if (!items) return null;
    const item = items.find((it) => String(it.slug ?? "") === slug);
    if (!item) return null;
    const manifestId = Number(item.manifestId ?? 0);
    const bodyName = `body-${String(manifestId).padStart(2, "0")}.html`;
    const bodyPath = path.join(batchDir, bodyName);
    const bodyHtml = (await exists(bodyPath)) ? await fs.readFile(bodyPath, "utf8") : "";
    const wc = bodyHtml ? countWordsFromHtml(bodyHtml) : 0;
    return {
      row,
      bodyHtml,
      wordCount: wc,
      excerpt: String(item.excerpt ?? ""),
      seoTitle: String(item.seoTitle ?? ""),
      seoDescription: String(item.seoDescription ?? ""),
      category: "New grad nursing",
      tags: Array.isArray(item.keywords) ? (item.keywords as string[]).map(String) : [],
      careerSlug: null,
      exam: "NCLEX-RN",
      locale: "en",
      apaReferences: [],
      requiresReferences: false,
      relatedLessonPaths: Array.isArray(item.relatedLessonPaths) ? (item.relatedLessonPaths as string[]).map(String) : [],
    };
  }

  if (st === "long_form_post_ts") {
    const post = LONG_FORM_BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) return null;
    const bodyMarkdown = post.sections.map((s) => `${s.heading}\n${s.body}`).join("\n\n");
    const bodyHtml = longFormSectionsToHtml(post.sections);
    const wc = countWordsFromMarkdown(bodyMarkdown);
    return {
      row,
      bodyHtml,
      wordCount: wc,
      excerpt: post.metaDescription,
      seoTitle: post.metaTitle,
      seoDescription: post.metaDescription,
      category: null,
      tags: [post.primaryKeyword],
      careerSlug: post.profession,
      exam: post.exam,
      locale: post.locale,
      apaReferences: post.references.map((r) => r.text),
      requiresReferences: true,
      relatedLessonPaths: [],
    };
  }


  return null;
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
    console.error("[blog:import-hidden] --publish requires --apply.");
    process.exit(1);
  }

  const sourceFilter = parseHiddenBlogImportSourceFilter(args.source);
  if (!sourceFilter) {
    console.error(`[blog:import-hidden] Invalid --source=${args.source} (use batch01|newgrad|longform|all).`);
    process.exit(1);
  }

  const env = await loadBlogAuditEnv({
    appRoot,
    repoRoot,
    whenMissingDatabaseUrlLog:
      "[blog-audit-env] DATABASE_URL missing; import will skip DB duplicate checks until DATABASE_URL is set",
  });
  if (args.apply && !env.databaseUrlSet) {
    console.error("[blog:import-hidden] --apply requires DATABASE_URL (load .env files or export in shell).");
    process.exit(1);
  }

  if (!(await exists(inventoryPath))) {
    console.error(`[blog:import-hidden] Missing inventory. Run blog:audit:hidden first: ${inventoryPath}`);
    process.exit(1);
  }

  const inventoryDoc = await readJson<InventoryFile>(inventoryPath);
  const inventory = inventoryDoc.inventory ?? [];

  const prisma = env.databaseUrlSet ? new PrismaClient() : null;
  const flags: HiddenBlogImportPlanFlags = {
    updateExisting: args.updateExisting,
    allowPublishedUpdate: args.allowPublishedUpdate,
    publish: args.publish,
  };

  const now = new Date();
  const results: Array<{
    slug: string;
    sourceType: string;
    outcome: string;
    reasons: string[];
    duplicateCheck?: string;
  }> = [];

  const mdLines: string[] = [
    "# Hidden blog content import (dry-run / plan)",
    "",
    `- Generated: ${now.toISOString()}`,
    `- Mode: ${args.apply ? (args.publish ? "APPLY+PUBLISH" : "APPLY") : "DRY_RUN"}`,
    `- Source filter: ${sourceFilter}`,
    `- Limit: ${Number.isFinite(args.limit) ? args.limit : "none"}`,
    `- DATABASE_URL: ${env.databaseUrlSet ? "set" : "missing (duplicate checks skipped)"}`,
    "",
    "## Rows",
    "",
    "| slug | sourceType | outcome | reasons |",
    "| --- | --- | --- | --- |",
  ];

  let processed = 0;
  for (const row of inventory) {
    if (processed >= args.limit) break;
    const st = String(row.sourceType ?? "");
    if (!hiddenBlogImportSourceTypeMatchesFilter(st, sourceFilter)) continue;
    const slug = String(row.slug ?? "").trim();
    if (args.slugFilter && slug !== args.slugFilter) continue;

    const resolved = await resolveCandidateBody(row);
    if (!resolved) {
      results.push({ slug, sourceType: st, outcome: "skip", reasons: ["resolve_body_failed"] });
      continue;
    }

    const title = String(row.title ?? "").trim();

    let existing: {
      id: string;
      postStatus: BlogPostStatus;
      workflowStatus: BlogWorkflowStatus;
      publishAt: Date | null;
      scheduledAt: Date | null;
      legacySource: string | null;
    } | null = null;
    let duplicateNote = "skipped_no_database_url";
    if (prisma) {
      const hit = await prisma.blogPost.findUnique({
        where: { slug },
        select: {
          id: true,
          postStatus: true,
          workflowStatus: true,
          publishAt: true,
          scheduledAt: true,
          legacySource: true,
        },
      });
      existing = hit;
      duplicateNote = hit ? "exists" : "absent";
    }

    const plan = planHiddenBlogImport({
      sourceType: st,
      title,
      slug,
      excerpt: resolved.excerpt,
      bodyHtml: resolved.bodyHtml,
      wordCount: resolved.wordCount,
      seoTitle: resolved.seoTitle,
      seoDescription: resolved.seoDescription,
      category: resolved.category,
      tags: resolved.tags,
      careerSlug: resolved.careerSlug,
      exam: resolved.exam,
      locale: resolved.locale || "en",
      inventoryReasons: row.reasons ?? [],
      existing,
      flags,
      now,
    });

    if (plan.outcome === "skip") {
      results.push({
        slug,
        sourceType: st,
        outcome: "skip",
        reasons: plan.reasons,
        duplicateCheck: duplicateNote,
      });
      mdLines.push(`| ${slug} | ${st} | skip | ${plan.reasons.join("; ")} |`);
      continue;
    }

    processed += 1;

    mdLines.push(`| ${slug} | ${st} | ${plan.outcome} | ${plan.reasons.join("; ") || "ok"} |`);

    results.push({
      slug,
      sourceType: st,
      outcome: args.apply ? plan.outcome : `dry_run:${plan.outcome}`,
      reasons: plan.reasons,
      duplicateCheck: duplicateNote,
    });

    if (!args.apply || !prisma) continue;

    const baseData = {
      title,
      excerpt: plan.resolvedExcerpt,
      body: resolved.bodyHtml,
      category: plan.taxonomyCategory ?? resolved.category,
      tags: resolved.tags,
      exam: resolved.exam,
      careerSlug: resolved.careerSlug,
      locale: resolved.locale || "en",
      seoTitle: plan.resolvedSeoTitle,
      seoDescription: plan.resolvedSeoDescription,
      metaTitleVariant: plan.resolvedSeoTitle,
      metaDescriptionVariant: plan.resolvedSeoDescription,
      apaReferences: resolved.apaReferences,
      requiresReferences: resolved.requiresReferences,
      relatedLessonPaths: resolved.relatedLessonPaths,
      legacySource: existing?.legacySource?.trim() || "hidden-content-import",
    };

    if (plan.outcome === "create_draft" || plan.outcome === "would_publish_new") {
      const created = await prisma.blogPost.create({
        data: {
          slug,
          ...baseData,
          ...draftScalars(),
        },
        select: { id: true },
      });
      if (plan.outcome === "would_publish_new" && args.publish) {
        await publishBlogPostCanonical({
          postId: created.id,
          publishAt: now,
          clearScheduledAt: true,
          context: "audit_hidden_blogs_apply",
          acknowledgePrePublishWarnings: true,
          setLegacySourceIfEmpty: "hidden-content-import",
        });
      }
    } else if (plan.outcome === "update_draft" || plan.outcome === "would_publish_update") {
      if (!existing) continue;
      await prisma.blogPost.update({
        where: { id: existing.id },
        data: {
          ...baseData,
          ...draftScalars(),
        },
      });
      if (plan.outcome === "would_publish_update" && args.publish) {
        await publishBlogPostCanonical({
          postId: existing.id,
          publishAt: now,
          clearScheduledAt: true,
          context: "audit_hidden_blogs_apply",
          acknowledgePrePublishWarnings: true,
          setLegacySourceIfEmpty: "hidden-content-import",
        });
      }
    }
  }

  if (prisma) await prisma.$disconnect().catch(() => undefined);

  await fs.mkdir(reportsDir, { recursive: true });
  await fs.writeFile(dryRunReportPath, mdLines.join("\n"), "utf8");
  await fs.writeFile(
    resultJsonPath,
    JSON.stringify(
      {
        generatedAt: now.toISOString(),
        args,
        env: { databaseUrlSet: env.databaseUrlSet },
        resultCount: results.length,
        results,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(JSON.stringify({ ok: true, dryRunReportPath, resultJsonPath, processed }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
