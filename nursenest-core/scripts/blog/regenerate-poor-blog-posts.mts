#!/usr/bin/env npx tsx
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BlogFunnelStage,
  BlogPostIntent,
  BlogPostStatus,
  BlogPostTemplate,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import { coerceBlogSourceRows } from "../../src/lib/blog/apa7";
import { appendBlogAdminPublishLog } from "../../src/lib/blog/blog-admin-publish-log";
import { lessonRowsToRelatedPaths } from "../../src/lib/blog/blog-internal-lesson-links";
import { normalizeBlogTopicIntent } from "../../src/lib/blog/blog-seo-topic-intent";
import { validateBlogPublishQuality } from "../../src/lib/blog/blog-publish-quality-validator";
import { runBlogArticleGenerationPipeline } from "../../src/lib/blog/blog-article-generation-pipeline";
import { loadBlogAuditEnv } from "../../src/lib/db/blog-audit-env-load";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..", "..");
const repoRoot = path.resolve(appRoot, "..");
const reportsDir = path.join(repoRoot, "reports");
const reportPath = path.join(reportsDir, "blog-regeneration-report.md");

type Args = {
  apply: boolean;
  limit: number;
};

type ReportRow = {
  slug: string;
  title: string;
  normalizedTopic: string | null;
  action: "skipped" | "would_regenerate" | "regenerated" | "failed";
  reason: string;
};

function parseArgs(argv: string[]): Args {
  let apply = false;
  let limit = 50;
  for (const arg of argv.slice(2)) {
    if (arg === "--apply") apply = true;
    const match = arg.match(/^--limit=(\d+)$/);
    if (match) limit = Math.max(1, Math.min(500, Number.parseInt(match[1]!, 10)));
  }
  return { apply, limit };
}

function markdownReport(rows: ReportRow[], scanned: number, args: Args): string {
  const regenerated = rows.filter((row) => row.action === "regenerated").length;
  const skipped = rows.filter((row) => row.action === "skipped").length;
  const failures = rows.filter((row) => row.action === "failed").length;
  const lines = [
    "# Blog Regeneration Report",
    "",
    `Generated at: ${new Date().toISOString()}`,
    `Mode: ${args.apply ? "apply" : "dry-run"}`,
    `Total scanned: ${scanned}`,
    `Total regenerated: ${regenerated}`,
    `Total skipped: ${skipped}`,
    `Failures: ${failures}`,
    "",
    "| Slug | Action | Normalized topic | Reason |",
    "| --- | --- | --- | --- |",
  ];
  for (const row of rows) {
    lines.push(
      `| \`${row.slug}\` | ${row.action} | ${(row.normalizedTopic ?? "").replace(/\|/g, "\\|").slice(0, 120)} | ${row.reason.replace(/\|/g, "\\|").slice(0, 180)} |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);
  const env = await loadBlogAuditEnv({
    appRoot,
    repoRoot,
    whenMissingDatabaseUrlLog: "[blog:regenerate:poor] DATABASE_URL is required.",
  });
  if (!env.databaseUrlSet) process.exit(1);

  const prisma = new PrismaClient();
  const rows: ReportRow[] = [];

  try {
    const posts = await prisma.blogPost.findMany({
      where: { postStatus: BlogPostStatus.PUBLISHED },
      orderBy: { updatedAt: "asc" },
      take: args.limit,
      select: {
        id: true,
        slug: true,
        title: true,
        body: true,
        excerpt: true,
        exam: true,
        tags: true,
        targetKeyword: true,
        keywordCluster: true,
        countryTarget: true,
        intent: true,
        funnelStage: true,
        postTemplate: true,
        sourcesJson: true,
        apaReferences: true,
        faqBlock: true,
        adminPublishLog: true,
      },
    });

    const flagged = posts.filter((post) => {
      const quality = validateBlogPublishQuality({
        title: post.title,
        body: post.body,
        targetKeyword: post.targetKeyword,
        tags: post.tags,
        faqBlock: post.faqBlock,
        apaReferences: post.apaReferences,
        sourcesJson: post.sourcesJson,
      });
      return quality.blocking.length > 0;
    });

    for (const post of flagged) {
      const topicSeed = post.targetKeyword?.trim() || post.title.trim();
      const normalized = normalizeBlogTopicIntent(topicSeed, post.exam);
      if (!normalized.accepted) {
        rows.push({
          slug: post.slug,
          title: post.title,
          normalizedTopic: null,
          action: "failed",
          reason: normalized.reason ?? "topic_intent_rejected",
        });
        continue;
      }

      if (!args.apply) {
        rows.push({
          slug: post.slug,
          title: post.title,
          normalizedTopic: normalized.normalizedTopic,
          action: "would_regenerate",
          reason: "quality gate flagged the published post; apply mode would rerun the pipeline.",
        });
        continue;
      }

      try {
        const pipeline = await runBlogArticleGenerationPipeline(
          {
            topic: normalized.normalizedTopic,
            exam: post.exam ?? "NCLEX-RN",
            country: post.countryTarget === "CA" ? "CA" : post.countryTarget === "US" ? "US" : "unspecified",
            keywords: post.tags.join(", "),
            targetKeyword: normalized.normalizedTopic,
            keywordCluster: post.keywordCluster ?? undefined,
            template: post.postTemplate ?? BlogPostTemplate.TOPIC_EXPLAINED,
            intent: post.intent ?? BlogPostIntent.EXAM_PREP,
            funnelStage: post.funnelStage ?? BlogFunnelStage.CONSIDERATION,
            tone: "professional",
            includeImage: false,
            includeAiImage: false,
            fixedSlug: post.slug,
            sourceRecordsJson: coerceBlogSourceRows(Array.isArray(post.sourcesJson) ? post.sourcesJson : []),
            allowInsufficientCitations: true,
          },
          { persist: false },
        );

        if (!pipeline.ok) {
          rows.push({
            slug: post.slug,
            title: post.title,
            normalizedTopic: normalized.normalizedTopic,
            action: "failed",
            reason: pipeline.error,
          });
          continue;
        }

        const regeneratedQuality = validateBlogPublishQuality({
          title: pipeline.plan.h1 || post.title,
          body: pipeline.bodyHtml,
          targetKeyword: normalized.normalizedTopic,
          tags: post.tags,
          faqBlock: { items: pipeline.plan.faqs },
          apaReferences: post.apaReferences,
          sourcesJson: post.sourcesJson,
        });
        if (regeneratedQuality.blocking.length > 0) {
          rows.push({
            slug: post.slug,
            title: post.title,
            normalizedTopic: normalized.normalizedTopic,
            action: "failed",
            reason: regeneratedQuality.blocking.map((item) => item.message).join(" "),
          });
          continue;
        }

        const nextExcerpt = pipeline.bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 480);
        const nextLog = appendBlogAdminPublishLog(post.adminPublishLog, {
          level: "info",
          event: "blog_regeneration_apply",
          message: "Regenerated published blog content from normalized clinical topic.",
          detail: {
            rawTopic: topicSeed,
            normalizedTopic: normalized.normalizedTopic,
            report: "reports/blog-regeneration-report.md",
          },
        });

        await prisma.blogPost.update({
          where: { id: post.id },
          data: {
            slug: post.slug,
            title: (pipeline.plan.h1 || post.title).slice(0, 220),
            excerpt: nextExcerpt.length >= 40 ? nextExcerpt : post.excerpt,
            body: pipeline.bodyHtml,
            seoTitle: pipeline.plan.metaTitle.slice(0, 200),
            seoDescription: pipeline.plan.metaDescription.slice(0, 500),
            targetKeyword: normalized.normalizedTopic,
            outlineJson: pipeline.plan.outline as Prisma.InputJsonValue,
            faqBlock: { items: pipeline.plan.faqs } as Prisma.InputJsonValue,
            titleAlternates: pipeline.plan.titleOptions.slice(0, 8),
            keyQuestions: pipeline.plan.faqs.map((faq) => faq.q).slice(0, 8),
            keywordPlan: pipeline.plan.seoFocusKeywords?.slice(0, 8) ?? [normalized.normalizedTopic],
            relatedLessonPaths: lessonRowsToRelatedPaths(pipeline.plan.suggestedInternalLessons, post.countryTarget === "CA" ? "CA" : post.countryTarget === "US" ? "US" : "unspecified"),
            featuredSnippet: pipeline.plan.featuredSnippetHint ?? null,
            adminPublishLog: nextLog as Prisma.InputJsonValue,
          },
        });

        rows.push({
          slug: post.slug,
          title: post.title,
          normalizedTopic: normalized.normalizedTopic,
          action: "regenerated",
          reason: "Published row updated with normalized clinical topic and regenerated body.",
        });
      } catch (error) {
        rows.push({
          slug: post.slug,
          title: post.title,
          normalizedTopic: normalized.normalizedTopic,
          action: "failed",
          reason: error instanceof Error ? error.message : String(error),
        });
      }
    }

    await fs.mkdir(reportsDir, { recursive: true });
    await fs.writeFile(reportPath, markdownReport(rows, posts.length, args));
    console.log(
      `[blog:regenerate:poor] scanned=${posts.length} flagged=${flagged.length} mode=${args.apply ? "apply" : "dry-run"}`,
    );
    console.log(`[blog:regenerate:poor] wrote ${path.relative(repoRoot, reportPath)}`);
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
