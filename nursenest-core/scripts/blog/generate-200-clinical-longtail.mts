#!/usr/bin/env npx tsx
/**
 * Batch generate 200 long-tail nursing + allied health blog posts.
 *
 * Uses the EXISTING control-panel AI pipeline (OpenAI → DB → optional publish).
 * Duplicate detection, quality gates, and citation guards are handled by the pipeline.
 *
 * USAGE
 * ─────
 * # Dry-run (no DB writes, validates env):
 *   npm run blog:200-clinical -- --dry-run
 *
 * # Generate as drafts (save to DB, no publish):
 *   npm run blog:200-clinical -- --limit=10
 *
 * # Generate and publish immediately (full validation required):
 *   npm run blog:200-clinical -- --publish --limit=10
 *
 * # Resume after a partial run (skips already-published slugs):
 *   npm run blog:200-clinical -- --publish --limit=200 --resume
 *
 * # Filter to one category:
 *   npm run blog:200-clinical -- --category=cardiovascular --limit=20
 *
 * ENV VARS REQUIRED
 * ─────────────────
 *   OPENROUTER_API_KEY with AI_PROVIDER=openrouter, or BLOG_OPENAI_API_KEY / AI_INTEGRATIONS_OPENAI_API_KEY
 *   DATABASE_URL                                            (Postgres connection string)
 *
 * OPTIONAL
 *   BLOG_OPENAI_MODEL or AI_INTEGRATIONS_OPENAI_MODEL      (default: gpt-4.1-mini)
 *   BATCH_DELAY_MS                                          (ms between posts, default 3000)
 *   NEXT_PUBLIC_SITE_URL                                    (default: https://nursenest.ca)
 */
import "../../src/lib/db/script-env-bootstrap";

import { BlogFunnelStage, BlogPostIntent, BlogPostStatus, BlogPostTemplate } from "@prisma/client";
import {
  assertOpenAiKeyConfigured,
  getBlogGenerationModelLabelForLogs,
  primeBlogCliOpenAiIntegrationKey,
} from "@/lib/ai/openai-env";
import { runBlogArticleGenerationPipeline } from "@/lib/blog/blog-article-generation-pipeline";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import {
  LONGTAIL_200_CLINICAL_TOPIC_CATALOG,
  LONGTAIL_200_CATEGORY_COUNTS,
  type ClinicalBlogTopicEntry,
} from "@/lib/blog/longtail-200-clinical-topic-catalog";
import { prisma } from "@/lib/db";

// ── CLI helpers ───────────────────────────────────────────────────────────────

const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nursenest.ca").replace(/\/$/, "");

function argv(key: string): string | undefined {
  const eq = process.argv.find((a) => a.startsWith(`${key}=`));
  if (eq) return eq.slice(key.length + 1);
  const i = process.argv.findIndex((a) => a === key);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function flag(key: string): boolean {
  return process.argv.includes(key);
}

function parseBool(raw: string | undefined, def: boolean): boolean {
  if (!raw) return def;
  return /^(1|true|yes)$/i.test(raw.trim());
}

function parseIntArg(raw: string | undefined, def: number, min: number): number {
  const n = parseInt(raw ?? "", 10);
  return Number.isFinite(n) ? Math.max(min, n) : def;
}

// ── Tier → exam / country mapping ────────────────────────────────────────────

const TIER_MAP: Record<ClinicalBlogTopicEntry["tier"], { exam: string; country: "US" | "CA" | "unspecified" }> = {
  rn:       { exam: "NCLEX-RN", country: "US" },
  rpn:      { exam: "REx-PN", country: "CA" },
  pn:       { exam: "NCLEX-PN", country: "US" },
  np:       { exam: "NP",      country: "unspecified" },
  "new-grad": { exam: "NCLEX-RN", country: "US" },
  allied:   { exam: "ALLIED",  country: "unspecified" },
};

// ── Template selection by category ───────────────────────────────────────────

function templateForCategory(category: string): BlogPostTemplate {
  switch (category) {
    case "pharmacology":
      return BlogPostTemplate.MEDICATION_GUIDE;
    case "critical-care":
    case "pediatrics":
      return BlogPostTemplate.DISEASE_PROCESS_EXPLAINER;
    default:
      return BlogPostTemplate.TOPIC_EXPLAINED;
  }
}

function intentForCategory(category: string): BlogPostIntent {
  return category === "mental-health"
    ? BlogPostIntent.CONCEPT_EXPLAINER
    : BlogPostIntent.EXAM_PREP;
}

// ── Progress tracking ─────────────────────────────────────────────────────────

type RunRow = {
  rank: number;
  category: string;
  topic: string;
  tier: string;
  outcome: "dry_run" | "published" | "draft" | "skipped" | "failed";
  slug?: string;
  wordCount?: number;
  url?: string;
  error?: string;
};

function logRow(row: RunRow): void {
  console.log(JSON.stringify(row));
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  primeBlogCliOpenAiIntegrationKey();

  const dryRun = flag("--dry-run");
  const publish = !dryRun && parseBool(argv("--publish"), false);
  const resume = flag("--resume");
  const limit = parseIntArg(argv("--limit"), 200, 1);
  const categoryFilter = argv("--category")?.trim().toLowerCase();
  const batchDelayMs = parseIntArg(process.env.BATCH_DELAY_MS, 3000, 0);
  const minWords = parseIntArg(argv("--min-words"), 1500, 1000);
  const minReferences = parseIntArg(argv("--min-references"), 4, 1);
  const requireInternalLinks = parseBool(argv("--require-internal-links"), true);
  const validateInternalLinks = parseBool(argv("--validate-internal-links"), publish);
  const paywallSafeLinks = parseBool(argv("--paywall-safe-links"), publish);
  const publishOnlyIfValid = parseBool(argv("--publish-only-if-valid"), true);

  console.log(JSON.stringify({
    banner: "generate-200-clinical-longtail",
    dryRun,
    publish,
    resume,
    limit,
    categoryFilter: categoryFilter ?? "all",
    model: getBlogGenerationModelLabelForLogs(),
    minWords,
    minReferences,
    categoryCounts: LONGTAIL_200_CATEGORY_COUNTS,
    totalTopics: LONGTAIL_200_CLINICAL_TOPIC_CATALOG.length,
  }));

  if (!dryRun) {
    const keyGate = assertOpenAiKeyConfigured({ pipeline: "blog" });
    if (!keyGate.ok) {
      console.error(`[generate-200] ${keyGate.message}`);
      process.exitCode = 1;
      return;
    }
    if (!process.env.DATABASE_URL?.trim()) {
      console.error("[generate-200] DATABASE_URL is required for database writes.");
      process.exitCode = 1;
      return;
    }
  }

  // Filter and slice topics
  let topics = [...LONGTAIL_200_CLINICAL_TOPIC_CATALOG];
  if (categoryFilter) {
    topics = topics.filter((t) => t.category === categoryFilter);
    if (topics.length === 0) {
      console.error(`[generate-200] No topics found for category: ${categoryFilter}`);
      process.exitCode = 1;
      return;
    }
  }
  topics = topics.slice(0, limit);

  const stats = {
    processed: 0,
    published: 0,
    draft: 0,
    skipped: 0,
    failed: 0,
    dryRunOk: 0,
  };

  for (let i = 0; i < topics.length; i++) {
    const entry = topics[i]!;
    const rank = i + 1;
    const { exam, country } = TIER_MAP[entry.tier];
    const template = templateForCategory(entry.category);
    const intent = intentForCategory(entry.category);
    const slug = entry.primaryKeyword.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100);

    console.log(`\n[${rank}/${topics.length}] ${entry.category} | ${entry.tier} | ${entry.topic.slice(0, 80)}`);

    // Dry-run: just validate the topic shape
    if (dryRun) {
      stats.dryRunOk += 1;
      logRow({ rank, category: entry.category, topic: entry.topic, tier: entry.tier, outcome: "dry_run", slug });
      continue;
    }

    // Resume: skip already-published posts with this topic's likely slug
    if (resume) {
      const existing = await prisma.blogPost.findFirst({
        where: {
          OR: [
            { targetKeyword: { contains: entry.primaryKeyword, mode: "insensitive" } },
            { slug: { contains: slug } },
          ],
          postStatus: BlogPostStatus.PUBLISHED,
        },
        select: { slug: true },
      });
      if (existing) {
        stats.skipped += 1;
        logRow({ rank, category: entry.category, topic: entry.topic, tier: entry.tier, outcome: "skipped", slug: existing.slug });
        continue;
      }
    }

    try {
      const result = await runBlogArticleGenerationPipeline(
        {
          topic: entry.topic,
          exam,
          country,
          keywords: entry.primaryKeyword,
          targetKeyword: entry.primaryKeyword,
          keywordCluster: `longtail-200-${entry.category}`,
          template,
          intent,
          funnelStage: BlogFunnelStage.CONSIDERATION,
          tone: "professional",
          includeImage: false,
          includeAiImage: false,
          publishImmediately: publish,
          allowInsufficientCitations: !publish,
          allowGeneratedSourceStubsForPublish: true,
          minPublishReferences: minReferences,
          minPublishWords: minWords,
          validateInternalLinksBeforePublish: validateInternalLinks,
          requireInternalLinks,
          paywallSafeLinksBeforePublish: paywallSafeLinks,
          requireClinicalSectionDepthOnPublish: true,
          publishOnlyIfValid,
          includeFaqsInBody: true,
          includeClinicalPearlsInBody: true,
        },
        { persist: true, idempotencyKey: `longtail-200:${entry.category}:${slug}` },
      );

      stats.processed += 1;

      if (!result.ok) {
        stats.failed += 1;
        logRow({ rank, category: entry.category, topic: entry.topic, tier: entry.tier, outcome: "failed", slug, error: result.error?.slice(0, 300) });
        continue;
      }

      if (result.persistSkipped) {
        stats.skipped += 1;
        logRow({ rank, category: entry.category, topic: entry.topic, tier: entry.tier, outcome: "skipped", slug: result.persistSkipped.existingSlug ?? slug });
        continue;
      }

      const post = result.persist?.post;
      if (!post) {
        stats.failed += 1;
        logRow({ rank, category: entry.category, topic: entry.topic, tier: entry.tier, outcome: "failed", slug, error: "No post in pipeline result" });
        continue;
      }

      const wordCount = result.persist?.bodyHtml
        ? countWordsFromHtml(result.persist.bodyHtml)
        : undefined;

      const postUrl = `${SITE_ORIGIN}/blog/${post.slug}`;
      const isPublished = post.postStatus === BlogPostStatus.PUBLISHED;

      if (isPublished) {
        stats.published += 1;
      } else {
        stats.draft += 1;
      }

      logRow({
        rank,
        category: entry.category,
        topic: entry.topic,
        tier: entry.tier,
        outcome: isPublished ? "published" : "draft",
        slug: post.slug,
        wordCount,
        url: isPublished ? postUrl : undefined,
      });
    } catch (err) {
      stats.failed += 1;
      const msg = err instanceof Error ? err.message : String(err);
      logRow({ rank, category: entry.category, topic: entry.topic, tier: entry.tier, outcome: "failed", slug, error: msg.slice(0, 300) });
    }

    // Rate-limit between requests
    if (i < topics.length - 1 && batchDelayMs > 0) {
      await new Promise((r) => setTimeout(r, batchDelayMs));
    }
  }

  console.log(JSON.stringify({
    summary: {
      dryRun,
      publish,
      limit: topics.length,
      ...stats,
      successRate: topics.length > 0
        ? `${Math.round(((stats.published + stats.draft + stats.dryRunOk) / topics.length) * 100)}%`
        : "n/a",
    },
  }));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
