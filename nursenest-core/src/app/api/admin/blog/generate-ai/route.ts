import { NextResponse } from "next/server";
import {
  ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN,
  adminBlogGenerateInterTopicDelayMs,
} from "@/lib/admin/blog-generate-ai-constants";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  blogGenerateByTopicRequestSchema,
  type BlogGenerateByTopicRequest,
  type BlogSimpleAiDraftBody,
} from "@/lib/admin/blog-simple-ai-draft-schema";
import { logSimpleAiDraftRun } from "@/lib/admin/blog-content-automation-log";
import { adminAiGenerationHttpBlock } from "@/lib/ai/admin-ai-policy";
import {
  generateAutomatedBlogPost,
  normalizeUniqueTopics,
  type AutomationResult,
  type BlogAutomationSeoReadiness,
} from "@/lib/blog/blog-automation-engine";
import { BLOG_ARTICLE_MIN_WORDS, countWordsFromHtml } from "@/lib/blog/blog-word-count";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

/** Multi-topic batches can run for many minutes (sequential OpenAI + persistence). */
export const maxDuration = 300;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** OpenAI / provider pressure — bounded retries per topic (does not retry duplicate/skip outcomes). */
const TRANSIENT_PROVIDER_ERR =
  /rate|429|timeout|timed out|econnreset|overloaded|temporarily unavailable|too many requests|context length|resource_exhausted|throttl|503|service unavailable/i;

function isTransientProviderErrorMessage(message: string): boolean {
  return TRANSIENT_PROVIDER_ERR.test(message.toLowerCase());
}

type AutomatedBlogPostArgs = Parameters<typeof generateAutomatedBlogPost>[0];

async function generateAutomatedBlogPostWithRetries(args: AutomatedBlogPostArgs): Promise<AutomationResult> {
  const maxAttempts = 4;
  let last: AutomationResult = { ok: false, error: "Generation did not run." };
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    last = await generateAutomatedBlogPost(args);
    if (last.ok) return last;
    if (!isTransientProviderErrorMessage(last.error) || attempt === maxAttempts - 1) return last;
    const backoffMs = Math.min(12_000, 900 * 2 ** attempt + Math.floor(Math.random() * 400));
    console.info("[admin_blog_generate] retry_after_transient", {
      topic: args.topic,
      attempt,
      backoffMs,
      errorPreview: last.error.slice(0, 160),
    });
    await sleep(backoffMs);
  }
  return last;
}

type AdminBlogGenerateRowResult =
  | {
      ok: true;
      skipped: false;
      topic: string;
      post: {
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        tags: string[];
        seoTitle: string | null;
        seoDescription: string | null;
        structuredContent: unknown[];
        bodyWordCount: number;
        isFullLength: boolean;
        postStatus: string;
      };
      warnings: string[];
      localized: Array<{ locale: string; region: string; localizedSlug: string; mode: "created" | "updated" }>;
      seoReadiness: BlogAutomationSeoReadiness;
    }
  | {
      ok: true;
      skipped: true;
      topic: string;
      reason: string;
      existingSlug?: string;
      slug?: string;
    }
  | { ok: false; topic: string; error: string };

async function executeOneAdminBlogGeneration(params: {
  topic: string;
  topicIndex: number;
  topicTotal: number;
  topics: string[];
  d: BlogGenerateByTopicRequest;
  adminUserId: string;
  runAt: Date;
  publishNow: boolean;
}): Promise<AdminBlogGenerateRowResult> {
  const { topic, topicIndex, topicTotal, topics, d, adminUserId, runAt, publishNow } = params;
  console.info("[admin_blog_generate] start", {
    topic,
    topicIndex: topicIndex + 1,
    topicTotal,
    exam: d.exam,
    publishNow,
    generateTranslations: d.generateTranslations === true,
  });

  const result = await generateAutomatedBlogPostWithRetries({
    topic,
    keywords: d.keywords,
    exam: d.exam,
    country: d.country ?? "unspecified",
    template: d.template,
    intent: d.intent,
    funnelStage: d.funnelStage,
    tone: d.tone,
    includeImage: d.includeImage,
    includeAiImage: d.includeAiImage,
    targetKeyword: d.targetKeyword ?? topic,
    keywordCluster: d.keywordCluster,
    sourceRecords: d.sourceRecords as Prisma.JsonValue | undefined,
    fixedSlug: topics.length === 1 ? d.slug : undefined,
    autoPublish: publishNow,
    publishAt: publishNow ? runAt : undefined,
    generateTranslations: d.generateTranslations === true,
    translationLocales: d.translationLocales,
    translationRegion: d.translationRegion,
    translationProfession: d.translationProfession,
    translationExam: d.translationExam,
  });

  const bodyForLog: BlogSimpleAiDraftBody = {
    topic,
    keywords: d.keywords,
    exam: d.exam,
    country: d.country,
    template: d.template,
    intent: d.intent,
    funnelStage: d.funnelStage,
    tone: d.tone,
    includeImage: d.includeImage,
    includeAiImage: d.includeAiImage,
    targetKeyword: d.targetKeyword ?? topic,
    keywordCluster: d.keywordCluster,
    countryTarget: d.countryTarget,
    sourceRecords: d.sourceRecords,
    slug: topics.length === 1 ? d.slug : undefined,
    allowDuplicateCanonicalTopic: d.allowDuplicateCanonicalTopic,
    publishNow,
    generateTranslations: d.generateTranslations,
    translationLocales: d.translationLocales,
    translationRegion: d.translationRegion,
    translationProfession: d.translationProfession,
    translationExam: d.translationExam,
  };
  await logSimpleAiDraftRun({ createdById: adminUserId, body: bodyForLog, result });

  if (!result.ok) {
    console.error("[admin_blog_generate] failed", {
      topic,
      exam: d.exam,
      error: result.error,
    });
    return { ok: false, topic, error: result.error };
  }
  if (result.skipped) {
    console.info("[admin_blog_generate] skipped", {
      topic,
      reason: result.reason,
      existingSlug: result.existingSlug ?? null,
    });
    return {
      ok: true,
      skipped: true,
      topic,
      reason: result.reason === "duplicate_topic" ? "duplicate_topic" : result.reason,
      ...(result.reason === "duplicate_topic"
        ? { existingSlug: result.existingSlug, slug: undefined }
        : { slug: result.slug }),
    };
  }

  const saved = await prisma.blogPost.findUnique({
    where: { id: result.post.id },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      body: true,
      tags: true,
      seoTitle: true,
      seoDescription: true,
      outlineJson: true,
      postStatus: true,
    },
  });
  if (!saved) {
    return { ok: false, topic, error: "Post created but could not be reloaded." };
  }
  const bodyWordCount = countWordsFromHtml(saved.body);
  const structuredContent = Array.isArray(saved.outlineJson) ? saved.outlineJson : [];
  const row: AdminBlogGenerateRowResult = {
    ok: true,
    skipped: false,
    topic,
    post: {
      id: saved.id,
      slug: saved.slug,
      title: saved.title,
      excerpt: saved.excerpt,
      tags: saved.tags,
      seoTitle: saved.seoTitle,
      seoDescription: saved.seoDescription,
      structuredContent,
      bodyWordCount,
      isFullLength: bodyWordCount >= BLOG_ARTICLE_MIN_WORDS,
      postStatus: saved.postStatus,
    },
    warnings: [
      ...result.warnings,
      ...(result.localizationErrors.length > 0
        ? [`Localization errors: ${result.localizationErrors.join(" | ")}`]
        : []),
    ],
    localized: result.localized,
    seoReadiness: result.seoReadiness,
  };
  console.info("[admin_blog_generate] success", {
    topic,
    postId: result.post.id,
    slug: result.post.slug,
    localizedCount: result.localized.length,
    localizationErrors: result.localizationErrors.length,
  });
  return row;
}

async function runAllTopicsSequential(params: {
  topics: string[];
  d: BlogGenerateByTopicRequest;
  adminUserId: string;
  runAt: Date;
  publishNow: boolean;
  onProgress?: (evt: Record<string, unknown>) => Promise<void> | void;
}): Promise<AdminBlogGenerateRowResult[]> {
  const { topics, d, adminUserId, runAt, publishNow, onProgress } = params;
  const interTopicMs = topics.length > 1 ? adminBlogGenerateInterTopicDelayMs() : 0;
  const results: AdminBlogGenerateRowResult[] = [];
  for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
    const topic = topics[topicIndex];
    if (topicIndex > 0 && interTopicMs > 0) {
      await sleep(interTopicMs);
    }
    await onProgress?.({
      type: "generating",
      current: topicIndex + 1,
      total: topics.length,
      topic,
    });
    const row = await executeOneAdminBlogGeneration({
      topic,
      topicIndex,
      topicTotal: topics.length,
      topics,
      d,
      adminUserId,
      runAt,
      publishNow,
    });
    results.push(row);
    await onProgress?.({
      type: "item_done",
      current: topicIndex + 1,
      total: topics.length,
      topic,
      outcome: row.ok ? (row.skipped ? "skipped" : "created") : "failed",
      slug: row.ok && !row.skipped ? row.post.slug : undefined,
      error: !row.ok ? row.error : undefined,
      publishHeldAsDraft:
        row.ok && !row.skipped && row.seoReadiness.publishHeldAsDraft === true ? true : undefined,
    });
  }
  return results;
}

function summarizeBatch(results: AdminBlogGenerateRowResult[]) {
  const successCount = results.filter((r) => r.ok && !r.skipped).length;
  const skippedCount = results.filter((r) => r.ok && r.skipped).length;
  const failedCount = results.filter((r) => !r.ok).length;
  return { successCount, skippedCount, failedCount };
}

/**
 * Admin-only AI blog generation by topic.
 * One POST processes up to {@link ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN} unique topics sequentially
 * (controlled throughput — no unbounded parallel provider calls).
 */
export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const aiBlock = adminAiGenerationHttpBlock();
  if (aiBlock) return aiBlock;

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
  const parsed = blogGenerateByTopicRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  const rawTopics =
    d.topics && d.topics.length > 0 ? d.topics : d.topic ? [d.topic] : [];
  const topics = normalizeUniqueTopics(rawTopics, ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN);
  if (topics.length === 0) {
    return NextResponse.json({ error: "Provide at least one topic." }, { status: 400 });
  }
  if (d.generateTranslations && (!d.translationLocales || d.translationLocales.length === 0)) {
    return NextResponse.json(
      { error: "translationLocales required when generateTranslations=true (max 4)." },
      { status: 400 },
    );
  }

  const publishNow = d.publishNow !== false;
  const runAt = new Date();

  if (topics.length > 1) {
    const encoder = new TextEncoder();
    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const writer = writable.getWriter();
    void (async () => {
      try {
        await writer.write(encoder.encode(JSON.stringify({ type: "queued", total: topics.length }) + "\n"));
        const results = await runAllTopicsSequential({
          topics,
          d,
          adminUserId: gate.admin.userId,
          runAt,
          publishNow,
          onProgress: async (evt) => {
            await writer.write(encoder.encode(JSON.stringify(evt) + "\n"));
          },
        });
        const { successCount, skippedCount, failedCount } = summarizeBatch(results);
        const httpStatus = successCount > 0 ? 201 : failedCount > 0 ? 502 : 200;
        await writer.write(
          encoder.encode(
            JSON.stringify({
              type: "complete",
              ok: failedCount === 0,
              mode: "batch",
              publishNow,
              limits: { maxTopicsPerRun: ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN },
              summary: {
                requested: topics.length,
                created: successCount,
                skipped: skippedCount,
                failed: failedCount,
              },
              results,
              httpStatus,
            }) + "\n",
          ),
        );
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        await writer.write(encoder.encode(JSON.stringify({ type: "fatal", error: message }) + "\n"));
      } finally {
        await writer.close();
      }
    })();
    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "private, no-store, must-revalidate",
      },
    });
  }

  const results = await runAllTopicsSequential({
    topics,
    d,
    adminUserId: gate.admin.userId,
    runAt,
    publishNow,
  });
  const { successCount, skippedCount, failedCount } = summarizeBatch(results);

  return NextResponse.json(
    {
      ok: failedCount === 0,
      mode: "single",
      publishNow,
      limits: { maxTopicsPerRun: ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN },
      summary: {
        requested: topics.length,
        created: successCount,
        skipped: skippedCount,
        failed: failedCount,
      },
      results,
    },
    { status: successCount > 0 ? 201 : failedCount > 0 ? 502 : 200 },
  );
}
