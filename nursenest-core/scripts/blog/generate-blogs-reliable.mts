#!/usr/bin/env npx tsx
/**
 * Reliable blog generation CLI — relaxed topic gate, plan fallback, draft-first with warnings.
 *
 * Usage:
 *   npm run generate:blogs:reliable -- --topic="Heart Failure Nursing Care" --publish
 *   npm run generate:blogs:reliable -- --topic="..." --apply
 *
 * `--publish` persists and requests immediate publish when output gates pass; otherwise draft stays with warnings.
 * `--apply` persists as DRAFT only (no immediate publish).
 *
 * Requires DATABASE_URL when persisting. Requires blog OpenAI credentials for full LLM path (no --dry-skip-ai).
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { runBlogArticleGenerationPipeline } from "../../src/lib/blog/blog-article-generation-pipeline";
import { normalizeBlogTopicIntent } from "../../src/lib/blog/blog-seo-topic-intent";
import { countWordsFromHtml } from "../../src/lib/blog/blog-word-count";
import { loadBlogAuditEnv } from "../../src/lib/db/blog-audit-env-load";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..", "..");
const repoRoot = path.resolve(appRoot, "..");

type CliArgs = {
  topic: string;
  apply: boolean;
  publish: boolean;
  exam: string;
  country: "US" | "CA" | "unspecified";
};

function parseArgs(argv: string[]): CliArgs {
  let topic = "";
  let apply = false;
  let publish = false;
  let exam = "NCLEX-RN";
  let country: "US" | "CA" | "unspecified" = "unspecified";

  for (const a of argv.slice(2)) {
    if (a === "--apply") apply = true;
    if (a === "--publish") publish = true;
    if (a.startsWith("--topic=")) topic = a.slice("--topic=".length).trim();
    if (a.startsWith("--exam=")) exam = a.slice("--exam=".length).trim() || exam;
    if (a.startsWith("--country=")) {
      const c = a.slice("--country=".length).trim().toUpperCase();
      if (c === "US") country = "US";
      else if (c === "CA") country = "CA";
    }
  }

  if (!topic) {
    topic = process.env.BLOG_RELIABLE_TOPIC?.trim() || "";
  }
  if (!topic) {
    topic = "Heart Failure Nursing Care";
  }

  return { topic, apply, publish, exam, country };
}

function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nursenest.ca").replace(/\/$/, "");
}

function logStage(label: string, payload: Record<string, unknown>): void {
  console.info(`[reliable:${label}]`, JSON.stringify(payload));
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);
  const persist = args.apply || args.publish;
  const publishImmediately = Boolean(args.publish);

  const env = await loadBlogAuditEnv({
    appRoot,
    repoRoot,
    whenMissingDatabaseUrlLog: "[generate:blogs:reliable] DATABASE_URL is required when using --apply or --publish.",
  });
  if (persist && !env.databaseUrlSet) process.exit(1);

  logStage("topic_received", { topic: args.topic });
  const topicIntent = normalizeBlogTopicIntent(args.topic, args.exam, { legacyCompatible: true });
  logStage("topic_intent", {
    accepted: topicIntent.accepted,
    reason: topicIntent.accepted ? null : topicIntent.reason,
    normalizedTopic: topicIntent.normalizedTopic,
  });
  if (!topicIntent.accepted) {
    console.error("[generate:blogs:reliable] topic_intent_rejected — stopping.");
    process.exit(1);
  }

  const stages: string[] = [];
  const res = await runBlogArticleGenerationPipeline(
    {
      topic: args.topic,
      exam: args.exam,
      country: args.country,
      template: BlogPostTemplate.TOPIC_EXPLAINED,
      intent: BlogPostIntent.EXAM_PREP,
      funnelStage: BlogFunnelStage.CONSIDERATION,
      tone: "professional",
      includeImage: false,
      includeAiImage: false,
      targetKeyword: args.topic,
      allowInsufficientCitations: true,
      publishImmediately,
    },
    {
      persist,
      reliableMode: true,
      idempotencyKey: `reliable-cli:${Date.now()}:${args.topic.slice(0, 40)}`,
      onProgressStage: async (s) => {
        stages.push(s);
        logStage("pipeline_progress", { stage: s });
      },
    },
  );

  if (!res.ok) {
    logStage("pipeline_failed", {
      stage: res.stage,
      code: res.code ?? null,
      error: res.error,
      repairPassesUsed: res.repairPassesUsed ?? null,
    });
    console.error("[generate:blogs:reliable] FAILED:", res.error);
    process.exit(1);
  }

  const wc = countWordsFromHtml(res.bodyHtml);
  const planFlags = res.plan.needsReviewFlags ?? [];
  const usedFallbackPlan = planFlags.includes("minimal_fallback_plan_used");
  logStage("article_ready", {
    wordCount: wc,
    slugFromPlan: res.plan.recommendedSlug,
    planNeedsReviewFlags: planFlags,
    planSchemaPath: usedFallbackPlan ? "deterministic_fallback" : "llm_or_repaired",
  });

  if (!persist) {
    logStage("dry_run_no_persist", { wordCount: wc });
    console.info("[generate:blogs:reliable] No --apply/--publish: generation only (no DB write).");
    return;
  }

  if (res.persistSkipped) {
    logStage("persist_skipped", {
      reason: res.persistSkipped.reason,
      existingSlug: res.persistSkipped.existingSlug ?? null,
    });
    console.info("[generate:blogs:reliable] Persist skipped:", res.persistSkipped.reason);
    process.exit(2);
  }

  if (!res.persist) {
    console.error("[generate:blogs:reliable] Internal error: persist missing");
    process.exit(1);
  }

  const { post, warnings } = res.persist;
  const url = `${siteOrigin()}/blog/${post.slug}`;
  logStage("persist_complete", {
    finalStatus: post.postStatus,
    blogPostId: post.id,
    slug: post.slug,
    url,
    warnings,
    publishRequested: publishImmediately,
  });

  console.info("");
  console.info("=== generate:blogs:reliable — result ===");
  console.info(`final_status: ${post.postStatus}`);
  console.info(`blog_post_id: ${post.id}`);
  console.info(`slug: ${post.slug}`);
  console.info(`url: ${url}`);
  console.info(`warnings:\n${warnings.length ? warnings.map((w) => `  - ${w}`).join("\n") : "  (none)"}`);
  console.info("========================================");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
