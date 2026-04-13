import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  blogGenerateByTopicRequestSchema,
  type BlogSimpleAiDraftBody,
} from "@/lib/admin/blog-simple-ai-draft-schema";
import { logSimpleAiDraftRun } from "@/lib/admin/blog-content-automation-log";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { generateBlogPost } from "@/lib/blog/generate-blog-ai-draft";
import { BLOG_ARTICLE_MIN_WORDS, countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { prisma } from "@/lib/db";

/**
 * Admin-only AI blog generation by topic.
 * Supports one topic or up to 3 topics per request (cost control).
 */
export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  if (!isAdminAiGenerationEnabled()) {
    return NextResponse.json(
      { error: "AI admin generation disabled", hint: "Set AI_ADMIN_GENERATION_ENABLED=true" },
      { status: 403 },
    );
  }
  const keyCheck = assertOpenAiKeyConfigured();
  if (!keyCheck.ok) {
    return NextResponse.json({ error: keyCheck.message }, { status: 503 });
  }

  const parsed = blogGenerateByTopicRequestSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  const topics =
    d.topics && d.topics.length > 0
      ? d.topics
      : d.topic
        ? [d.topic]
        : [];
  if (topics.length === 0) {
    return NextResponse.json({ error: "Provide at least one topic." }, { status: 400 });
  }
  if (topics.length > 3) {
    return NextResponse.json({ error: "Batch limit exceeded (max 3 topics per run)." }, { status: 400 });
  }

  const publishNow = d.publishNow !== false;
  const runAt = new Date();
  const results: Array<
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
      }
    | {
        ok: true;
        skipped: true;
        topic: string;
        reason: string;
        existingSlug?: string;
        slug?: string;
      }
    | { ok: false; topic: string; error: string }
  > = [];

  for (const topic of topics) {
    const result = await generateBlogPost({
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
      publishAt: publishNow ? runAt : undefined,
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
    };
    await logSimpleAiDraftRun({ createdById: gate.admin.userId, body: bodyForLog, result });

    if (!result.ok) {
      results.push({ ok: false, topic, error: result.error });
      continue;
    }
    if (result.skipped) {
      results.push({
        ok: true,
        skipped: true,
        topic,
        reason: result.reason === "duplicate_topic" ? "duplicate_topic" : result.reason,
        ...(result.reason === "duplicate_topic" ? { existingSlug: result.existingSlug, slug: undefined } : { slug: result.slug }),
      });
      continue;
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
      results.push({ ok: false, topic, error: "Post created but could not be reloaded." });
      continue;
    }
    const bodyWordCount = countWordsFromHtml(saved.body);
    const structuredContent = Array.isArray(saved.outlineJson) ? saved.outlineJson : [];
    results.push({
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
      warnings: result.warnings,
    });
  }

  const successCount = results.filter((r) => r.ok && !r.skipped).length;
  const skippedCount = results.filter((r) => r.ok && r.skipped).length;
  const failedCount = results.filter((r) => !r.ok).length;

  return NextResponse.json(
    {
      ok: failedCount === 0,
      mode: topics.length > 1 ? "batch" : "single",
      publishNow,
      limits: { maxTopicsPerRun: 3 },
      summary: { requested: topics.length, created: successCount, skipped: skippedCount, failed: failedCount },
      results,
    },
    { status: successCount > 0 ? 201 : failedCount > 0 ? 502 : 200 },
  );
}
