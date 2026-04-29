/**
 * Terminal blog generation — wraps {@link runBlogArticleGenerationPipeline} (no duplicated body/SEO/persist logic).
 *
 * Usage (from `nursenest-core/` or repo root via `npm run generate:blogs --`):
 *   npx tsx scripts/blog-ai-generate.ts [--dry-run] [--limit=5] [--topic "…"] [--pathophysiology-only]
 *     [--tier rn|rpn|pn|np|new-grad|allied] [--publish true|false] [--min-words 1200]
 *
 * API key: `BLOG_OPENAI_API_KEY` || `AI_INTEGRATIONS_OPENAI_API_KEY` (injected into `AI_INTEGRATIONS_OPENAI_API_KEY` for shared helpers).
 */
import "../src/lib/db/script-env-bootstrap";

import type { Prisma } from "@prisma/client";
import { BlogFunnelStage, BlogPostIntent, BlogPostStatus, BlogPostTemplate } from "@prisma/client";
import type { ControlPanelGenerateInput } from "@/lib/blog/blog-control-panel-generation";
import {
  BLOG_CLI_PATHOPHYSIOLOGY_CORPUS,
  filterCorpusTopics,
  pickCorpusSlice,
  type BlogCliCorpusTopic,
} from "@/lib/blog/blog-cli-pathophysiology-topic-corpus";
import { parseBlogCliArgs } from "@/lib/blog/blog-cli-generate-args";
import { blogCliTierToExamCountry } from "@/lib/blog/blog-cli-tier-profile";
import {
  blogIntentForQualityGate,
  collectBlogContentQualityIssues,
} from "@/lib/blog/blog-content-quality-gate";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { runBlogArticleGenerationPipeline } from "@/lib/blog/blog-article-generation-pipeline";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";

const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nursenest.ca").replace(/\/$/, "");

function primeOpenAiKeyFromCliEnv(): void {
  const resolved =
    process.env.BLOG_OPENAI_API_KEY?.trim() || process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim() || "";
  if (resolved) {
    process.env.AI_INTEGRATIONS_OPENAI_API_KEY = resolved;
  }
}

function faqBlockFromPlan(plan: BlogControlPanelPlan): Prisma.JsonValue {
  return { items: plan.faqs.map((f) => ({ q: f.q, a: f.a })) } as unknown as Prisma.JsonValue;
}

function buildInput(topic: string, tier: BlogCliCorpusTopic["tier"], publishImmediately: boolean): ControlPanelGenerateInput {
  const { exam, country } = blogCliTierToExamCountry(tier);
  const kw = topic.slice(0, 200);
  return {
    topic,
    exam,
    country,
    keywords: kw,
    targetKeyword: kw,
    template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
    intent: BlogPostIntent.CONCEPT_EXPLAINER,
    funnelStage: BlogFunnelStage.CONSIDERATION,
    tone: "professional",
    includeImage: false,
    includeAiImage: false,
    publishImmediately,
    allowInsufficientCitations: false,
  };
}

function bannerLine(label: string): void {
  console.log(`\n${"=".repeat(12)} ${label} ${"=".repeat(12)}`);
}

type RunStats = {
  processed: number;
  published: number;
  generatedNoPublish: number;
  skippedTitleGate: number;
  failedValidation: number;
  failedPipeline: number;
};

async function main(): Promise<void> {
  primeOpenAiKeyFromCliEnv();

  const keyGate = assertOpenAiKeyConfigured();
  if (!keyGate.ok) {
    console.error(`[blog-ai-generate] ${keyGate.message}`);
    console.error("Set BLOG_OPENAI_API_KEY or AI_INTEGRATIONS_OPENAI_API_KEY (e.g. in .env.local).");
    process.exitCode = 1;
    return;
  }

  const args = parseBlogCliArgs(process.argv);
  const persist = !args.dryRun;
  const publishLive = args.publish && !args.dryRun;

  const corpusFiltered = filterCorpusTopics({
    entries: BLOG_CLI_PATHOPHYSIOLOGY_CORPUS,
    pathophysiologyOnly: args.pathophysiologyOnly,
    tier: args.tier,
  });

  const explicitTopics = args.topics.length > 0;
  const rows: BlogCliCorpusTopic[] = explicitTopics
    ? args.topics.map((topic) => ({
        topic,
        tier: args.tier ?? "rn",
        pathophysiology: true,
      }))
    : pickCorpusSlice(corpusFiltered, args.limit);

  bannerLine("blog-ai-generate");
  console.log(
    `limit=${args.limit} dryRun=${args.dryRun} publish=${args.publish} pathophysiologyOnly=${args.pathophysiologyOnly} tier=${args.tier ?? "(all)"} minWords=${args.minWords} topics=${rows.length}`,
  );
  if (args.dryRun) {
    console.log("Dry-run: no database writes; pipeline uses persist=false.");
  }

  const stats: RunStats = {
    processed: 0,
    published: 0,
    generatedNoPublish: 0,
    skippedTitleGate: 0,
    failedValidation: 0,
    failedPipeline: 0,
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!;
    const topic = row.topic;
    const tier = row.tier;
    stats.processed += 1;
    bannerLine(`[${i + 1}/${rows.length}]`);
    console.log(`topic: ${topic}`);
    console.log(`tier: ${tier}`);

    const input = buildInput(topic, tier, publishLive);
    const idem = `cli-blog-gen:${Date.now()}:${i}`;

    try {
      const result = await runBlogArticleGenerationPipeline(input, {
        persist,
        substantiveWordMinOverride: args.minWords,
        idempotencyKey: idem,
        onProgressStage: async (stage) => {
          console.log(`  stage: ${stage}`);
        },
      });

      if (result.ok) {
        const words = countWordsFromHtml(result.bodyHtml);
        const slug = result.persist?.post.slug ?? result.plan.recommendedSlug;
        const postId = result.persist?.post.id;
        const refCount = result.plan.apaSourceStubs?.length ?? 0;
        const repairs = result.repairPassesUsed ?? 0;

        const strict = blogIntentForQualityGate(input.template, input.intent);
        const titleForGate = (result.plan.h1 || result.plan.titleOptions[0] || topic).trim();
        const quality = collectBlogContentQualityIssues({
          title: titleForGate,
          body: result.bodyHtml,
          targetKeyword: input.targetKeyword ?? input.topic,
          postTemplate: input.template,
          intent: strict,
          faqBlock: faqBlockFromPlan(result.plan),
          apaReferences: [],
          sourcesJson: { version: 2, verified: [], excluded: [], generatedAt: new Date().toISOString() },
        });
        const blocks = quality.filter((q) => q.severity === "block");
        if (blocks.length > 0) {
          stats.failedValidation += 1;
          console.log(`status: failed_validation`);
          console.log(`wordCount: ${words}`);
          console.log(`slug: ${slug}`);
          console.log(`referenceStubs: ${refCount}`);
          console.log(`repairAttempts: ${repairs}`);
          for (const b of blocks.slice(0, 6)) {
            console.log(`  gate: ${b.id} — ${b.message}`);
          }
          continue;
        }

        if (words < args.minWords) {
          stats.failedValidation += 1;
          console.log(`status: failed_validation (below minWords ${args.minWords})`);
          console.log(`wordCount: ${words}`);
          continue;
        }

        const published = result.persist?.post.postStatus === BlogPostStatus.PUBLISHED;
        if (published) {
          stats.published += 1;
          console.log(`status: published`);
        } else if (result.persist?.post) {
          stats.generatedNoPublish += 1;
          console.log(`status: generated (draft or needs review)`);
        } else {
          stats.generatedNoPublish += 1;
          console.log(`status: generated (dry-run or no persist payload)`);
        }
        console.log(`wordCount: ${words}`);
        console.log(`slug: ${slug}`);
        console.log(`referenceStubs: ${refCount}`);
        console.log(`repairAttempts: ${repairs}`);
        if (postId && slug) {
          console.log(`publicUrl: ${SITE_ORIGIN}/blog/${encodeURIComponent(slug)}`);
        }
        continue;
      }

      const titleSkip =
        result.code === "BLOG_TITLE_BODY_GATE" || result.error.startsWith("blog_title_not_ready:");
      if (titleSkip) {
        stats.skippedTitleGate += 1;
        const reason =
          result.code === "BLOG_TITLE_BODY_GATE"
            ? (result.details as { titleGateReason?: string } | undefined)?.titleGateReason ?? result.code
            : result.error.replace(/^blog_title_not_ready:/, "").trim();
        console.log(`status: skipped_title_gate`);
        console.log(`titleGateReason: ${reason}`);
        console.log(`detail: ${result.error}`);
        console.log(`repairAttempts: ${result.repairPassesUsed ?? 0}`);
        continue;
      }

      stats.failedPipeline += 1;
      console.log(`status: failed_pipeline`);
      console.log(`stage: ${result.stage}`);
      console.log(`code: ${result.code ?? "(none)"}`);
      console.log(`error: ${result.error}`);
      console.log(`repairAttempts: ${result.repairPassesUsed ?? 0}`);
    } catch (e) {
      stats.failedPipeline += 1;
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`status: failed_pipeline`);
      console.log(`error: ${msg}`);
    }
  }

  bannerLine("Summary");
  console.log(`totalProcessed: ${stats.processed}`);
  console.log(`published: ${stats.published}`);
  console.log(`generatedNoPublish: ${stats.generatedNoPublish}`);
  console.log(`skippedTitleGate: ${stats.skippedTitleGate}`);
  console.log(`failedValidation: ${stats.failedValidation}`);
  console.log(`failedPipeline: ${stats.failedPipeline}`);
  console.log(`estimatedTokens: n/a (pipeline does not aggregate provider usage in this CLI)`);

  if (stats.failedPipeline > 0 || stats.failedValidation > 0) {
    process.exitCode = 1;
  }
}

void main();
