/**
 * Blog generation CLI — **writes only to the existing `BlogPost` table** and uses the same loaders as production.
 *
 * Flow:
 * 1. Topic(s) from `--topic` / `--topics-file`
 * 2. `runBlogArticleGenerationPipeline` (plan → body → persist draft)
 * 3. Script validation on persisted row (slug, title, structure, FAQs → keyQuestions, CTA)
 * 4. Optional `--publish`: `publishGeneratedBlogArticle` → `publishBlogPostCanonical` (same as control panel)
 *
 * Run from app package:
 *   cd nursenest-core && npx tsx scripts/generate-blog-posts.ts --topic="Sepsis recognition for NCLEX" --draft
 *   cd nursenest-core && npx tsx scripts/generate-blog-posts.ts --topic="..." --publish
 *   cd nursenest-core && npx tsx scripts/generate-blog-posts.ts --topics-file=./tmp/blog-topics.txt --pathway=us-rn-nclex-rn
 *
 * Env: `BLOG_OPENAI_API_KEY` or `AI_INTEGRATIONS_OPENAI_API_KEY` (see `blog-ai-generate.ts`).
 */
import "../src/lib/db/script-env-bootstrap";

import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { assertOpenAiKeyConfigured, getBlogOpenAiChatModel } from "@/lib/ai/openai-env";
import { runBlogArticleGenerationPipeline } from "@/lib/blog/blog-article-generation-pipeline";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { publishGeneratedBlogArticle } from "@/lib/blog/publish-generated-blog-article";
import {
  BLOG_SOURCE_OF_TRUTH_SUMMARY,
  blogTitleExistsCaseInsensitive,
  logBlogGenerationPipeline,
  parseGenerateBlogPostsCliArgs,
  readTopicsFromTopicsFile,
  validateScriptBlogPostPayload,
} from "@/lib/blog/generate-blog-posts-pipeline";
import { resolveBatchPathway } from "@/lib/blog/blog-batch-cli";
import { prisma } from "@/lib/db";
import { getPublishedBlogPostBySlug } from "@/lib/blog/safe-blog-queries";

const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nursenest.ca").replace(/\/$/, "");

function primeOpenAiKeyFromCliEnv(): void {
  const resolved =
    process.env.BLOG_OPENAI_API_KEY?.trim() || process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim() || "";
  if (resolved) process.env.AI_INTEGRATIONS_OPENAI_API_KEY = resolved;
}

function buildControlPanelInput(
  topic: string,
  exam: string,
  country: "US" | "CA" | "unspecified",
  cli: ReturnType<typeof parseGenerateBlogPostsCliArgs>,
) {
  const kw = topic.slice(0, 200);
  return {
    topic,
    exam,
    country,
    keywords: kw,
    targetKeyword: kw,
    template: BlogPostTemplate.TOPIC_EXPLAINED,
    intent: BlogPostIntent.STUDY_STRATEGY,
    funnelStage: BlogFunnelStage.CONSIDERATION,
    tone: "professional" as const,
    includeImage: false,
    includeAiImage: false,
    /** Always false here: publish goes through `publishGeneratedBlogArticle` so visibility matches admin. */
    publishImmediately: false,
    allowInsufficientCitations: false,
    allowGeneratedSourceStubsForPublish: true,
    minPublishReferences: cli.minReferences,
    minPublishWords: cli.minWords,
    validateInternalLinksBeforePublish: cli.validateInternalLinks,
    publishOnlyIfValid: cli.publishOnlyIfValid,
    paywallSafeLinksBeforePublish: cli.paywallSafeLinks,
    requireClinicalSectionDepthOnPublish: true,
    includeFaqsInBody: cli.includeFaqs,
    includeClinicalPearlsInBody: cli.includeClinicalPearls,
  };
}

async function main(): Promise<void> {
  primeOpenAiKeyFromCliEnv();
  const cli = parseGenerateBlogPostsCliArgs(process.argv);
  const pathway = resolveBatchPathway(cli.pathwayId);

  logBlogGenerationPipeline("source_of_truth", { summary: BLOG_SOURCE_OF_TRUTH_SUMMARY });
  logBlogGenerationPipeline("loader_contract", {
    detail: "After writes, public HTML is read via getPublishedBlogPostBySlug + blogLiveWhere (same as /blog/[slug]).",
  });

  // eslint-disable-next-line no-console
  console.log(`Model: ${getBlogOpenAiChatModel()}`);
  const keyGate = assertOpenAiKeyConfigured({ pipeline: "blog" });
  if (!keyGate.ok) {
    // eslint-disable-next-line no-console
    console.error(`[generate-blog-posts] ${keyGate.message}`);
    process.exitCode = 1;
    return;
  }

  const topics: string[] = [...cli.topics];
  if (cli.topicsFile) {
    topics.push(...readTopicsFromTopicsFile(cli.topicsFile));
  }
  const uniqueTopics = [...new Set(topics.map((t) => t.trim()).filter((t) => t.length >= 3))];
  if (uniqueTopics.length === 0) {
    // eslint-disable-next-line no-console
    console.error("Provide at least one topic via --topic=... and/or --topics-file=path/to/file");
    process.exitCode = 1;
    return;
  }

  logBlogGenerationPipeline("config", {
    dryRun: cli.dryRun,
    publishAfterDraft: cli.publish,
    pathwayId: pathway.pathwayId,
    topicCount: uniqueTopics.length,
    minWords: cli.minWords,
  });

  let failures = 0;
  for (let i = 0; i < uniqueTopics.length; i += 1) {
    const topic = uniqueTopics[i]!;
    logBlogGenerationPipeline("topic_start", { index: i + 1, total: uniqueTopics.length, topic });

    const input = buildControlPanelInput(topic, pathway.exam, pathway.country, cli);
    const idem = `generate-blog-posts-cli:${Date.now()}:${i}:${topic.slice(0, 40)}`;

    try {
      const result = await runBlogArticleGenerationPipeline(input, {
        persist: !cli.dryRun,
        substantiveWordMinOverride: cli.minWords,
        idempotencyKey: idem,
        onProgressStage: async (stage) => {
          logBlogGenerationPipeline("pipeline_stage", { stage });
        },
      });

      if (!result.ok) {
        failures += 1;
        logBlogGenerationPipeline("pipeline_failed", { stage: result.stage, error: result.error, code: result.code ?? null });
        continue;
      }

      const slug = result.persist?.post.slug ?? result.plan.recommendedSlug;
      const postId = result.persist?.post.id;
      const words = countWordsFromHtml(result.bodyHtml);
      const publicUrl = `${SITE_ORIGIN}/blog/${encodeURIComponent(slug)}`;

      logBlogGenerationPipeline("generated", { slug, postId: postId ?? null, wordCount: words, publicUrlDraftNote: publicUrl });

      if (!cli.dryRun && postId) {
        const row = await prisma.blogPost.findUnique({
          where: { id: postId },
          select: {
            slug: true,
            title: true,
            body: true,
            excerpt: true,
            keyQuestions: true,
            ctaHref: true,
            ctaText: true,
          },
        });
        if (!row) {
          failures += 1;
          logBlogGenerationPipeline("persist_missing_row", { postId });
          continue;
        }

        const dupTitle = await blogTitleExistsCaseInsensitive(prisma, row.title, postId);
        if (dupTitle) {
          failures += 1;
          logBlogGenerationPipeline("reject_duplicate_title_after_persist", { title: row.title, postId });
          continue;
        }

        const minWordsGate = cli.publish ? cli.minWords : Math.min(1200, cli.minWords);
        const v = validateScriptBlogPostPayload({
          slug: row.slug,
          title: row.title,
          body: row.body,
          excerpt: row.excerpt,
          keyQuestions: row.keyQuestions,
          ctaHref: row.ctaHref,
          ctaText: row.ctaText,
          minWords: minWordsGate,
        });
        if (!v.ok) {
          failures += 1;
          logBlogGenerationPipeline("reject_script_validation", { postId, reasons: v.reasons });
          continue;
        }

        logBlogGenerationPipeline("write_prisma", {
          model: "BlogPost",
          id: postId,
          slug: row.slug,
          table: "blog_posts",
        });

        if (cli.publish) {
          logBlogGenerationPipeline("publish_start", { postId, slug: row.slug });
          await publishGeneratedBlogArticle(
            { id: postId },
            {
              publishAt: new Date(),
              context: "generate_blog_posts_cli",
              minWords: cli.minWords,
              minReferences: cli.minReferences,
              requireApaReferences: true,
              requireInternalLinks: true,
              validateInternalLinks: cli.validateInternalLinks,
              paywallSafeLinks: cli.paywallSafeLinks,
              requireClinicalSectionDepth: true,
              publishOnlyIfValid: cli.publishOnlyIfValid,
              prisma,
            },
          );
          logBlogGenerationPipeline("publish_ok", { postId, slug: row.slug });
        }

        const visible = await getPublishedBlogPostBySlug(row.slug);
        logBlogGenerationPipeline("load_public_check", {
          slug: row.slug,
          loader: "getPublishedBlogPostBySlug",
          visible: Boolean(visible),
          publicUrl,
          note: visible ? "row_matches_blogLiveWhere" : "draft_or_not_yet_public",
        });
      } else {
        logBlogGenerationPipeline("dry_run_skip_persist", { slug });
      }
    } catch (e) {
      failures += 1;
      const msg = e instanceof Error ? e.message : String(e);
      logBlogGenerationPipeline("topic_failed", { topic, error: msg });
    }
  }

  if (failures > 0) {
    process.exitCode = 1;
  }
}

void main().finally(async () => {
  await prisma.$disconnect();
});
