import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  blogGenerateByTopicRequestSchema,
  type BlogSimpleAiDraftBody,
} from "@/lib/admin/blog-simple-ai-draft-schema";
import { logSimpleAiDraftRun } from "@/lib/admin/blog-content-automation-log";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { generateAutomatedBlogPost, normalizeUniqueTopics } from "@/lib/blog/blog-automation-engine";
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
    d.topics && d.topics.length > 0
      ? d.topics
      : d.topic
        ? [d.topic]
        : [];
  const topics = normalizeUniqueTopics(rawTopics, 3);
  if (topics.length === 0) {
    return NextResponse.json({ error: "Provide at least one topic." }, { status: 400 });
  }
  if (topics.length > 3) {
    return NextResponse.json({ error: "Batch limit exceeded (max 3 topics per run)." }, { status: 400 });
  }
  if (d.generateTranslations && (!d.translationLocales || d.translationLocales.length === 0)) {
    return NextResponse.json(
      { error: "translationLocales required when generateTranslations=true (max 4)." },
      { status: 400 },
    );
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
        localized: Array<{ locale: string; region: string; localizedSlug: string; mode: "created" | "updated" }>;
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
    console.info("[admin_blog_generate] start", {
      topic,
      exam: d.exam,
      publishNow,
      generateTranslations: d.generateTranslations === true,
    });
    const result = await generateAutomatedBlogPost({
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
      sourceRecords: d.sourceRecords as unknown,
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
    await logSimpleAiDraftRun({ createdById: gate.admin.userId, body: bodyForLog, result });

    if (!result.ok) {
      console.error("[admin_blog_generate] failed", {
        topic,
        exam: d.exam,
        error: result.error,
      });
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
      console.info("[admin_blog_generate] skipped", {
        topic,
        reason: result.reason,
        existingSlug: result.existingSlug ?? null,
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
      warnings: [
        ...result.warnings,
        ...(result.localizationErrors.length > 0
          ? [`Localization errors: ${result.localizationErrors.join(" | ")}`]
          : []),
      ],
      localized: result.localized,
    });
    console.info("[admin_blog_generate] success", {
      topic,
      postId: result.post.id,
      slug: result.post.slug,
      localizedCount: result.localized.length,
      localizationErrors: result.localizationErrors.length,
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
