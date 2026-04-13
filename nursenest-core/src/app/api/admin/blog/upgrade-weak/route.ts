import { NextResponse } from "next/server";
import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate, BlogPostStatus } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { runBlogArticleGenerationPipeline } from "@/lib/blog/blog-article-generation-pipeline";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { prisma } from "@/lib/db";

const requestSchema = z.object({
  limit: z.number().int().min(1).max(3).default(3),
  minWords: z.number().int().min(800).max(1800).default(1200),
  dryRun: z.boolean().optional(),
});

function headingCountFromHtml(html: string): number {
  return (html.match(/<h[1-6][^>]*>/gi) ?? []).length;
}

/**
 * Regenerate weak blog posts in controlled chunks (max 3 per run).
 * Weak criteria: <800 words OR fewer than 3 headings.
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

  const parsed = requestSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const { limit, minWords, dryRun } = parsed.data;
  console.info("[blog_upgrade_weak] scan_start", { limit, minWords, dryRun: Boolean(dryRun) });

  const candidates = await prisma.blogPost.findMany({
    where: {
      postStatus: {
        in: [BlogPostStatus.PUBLISHED, BlogPostStatus.SCHEDULED, BlogPostStatus.DRAFT],
      },
    },
    orderBy: { updatedAt: "asc" },
    take: 40,
    select: {
      id: true,
      slug: true,
      title: true,
      body: true,
      exam: true,
      tags: true,
      keywordCluster: true,
      targetKeyword: true,
      countryTarget: true,
      intent: true,
      funnelStage: true,
      postTemplate: true,
      postStatus: true,
      publishAt: true,
    },
  });

  const weak = candidates
    .map((post) => ({
      post,
      wordCount: countWordsFromHtml(post.body),
      headings: headingCountFromHtml(post.body),
    }))
    .filter((row) => row.wordCount < 800 || row.headings < 3)
    .slice(0, limit);

  if (dryRun) {
    console.info("[blog_upgrade_weak] dry_run_selected", { count: weak.length });
    return NextResponse.json({
      ok: true,
      dryRun: true,
      requestedLimit: limit,
      selected: weak.map((row) => ({
        id: row.post.id,
        slug: row.post.slug,
        title: row.post.title,
        currentWordCount: row.wordCount,
        currentHeadings: row.headings,
      })),
    });
  }

  const results: Array<{
    id: string;
    slug: string;
    title: string;
    beforeWordCount: number;
    afterWordCount?: number;
    upgraded: boolean;
    error?: string;
  }> = [];

  for (const row of weak) {
    const post = row.post;
    try {
      const topic = post.targetKeyword || post.title;
      const pipeline = await runBlogArticleGenerationPipeline(
        {
          topic,
          exam: post.exam ?? "nclex-rn",
          country: post.countryTarget === "CA" ? "CA" : post.countryTarget === "US" ? "US" : "unspecified",
          keywords: post.tags.join(", "),
          targetKeyword: post.targetKeyword ?? undefined,
          keywordCluster: post.keywordCluster ?? undefined,
          template: post.postTemplate ?? BlogPostTemplate.TOPIC_EXPLAINED,
          intent: post.intent ?? BlogPostIntent.EXAM_PREP,
          funnelStage: post.funnelStage ?? BlogFunnelStage.CONSIDERATION,
          tone: "professional",
          includeImage: false,
          includeAiImage: false,
          fixedSlug: post.slug,
          allowInsufficientCitations: true,
        },
        { persist: false },
      );
      if (!pipeline.ok) {
        console.error("[blog_upgrade_weak] regenerate_failed", {
          id: post.id,
          slug: post.slug,
          error: pipeline.error,
        });
        results.push({
          id: post.id,
          slug: post.slug,
          title: post.title,
          beforeWordCount: row.wordCount,
          upgraded: false,
          error: pipeline.error,
        });
        continue;
      }

      const excerpt = pipeline.bodyHtml
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 480);
      const nextTitle = pipeline.plan.h1?.trim() || pipeline.plan.metaTitle || post.title;
      const afterWordCount = countWordsFromHtml(pipeline.bodyHtml);

      await prisma.blogPost.update({
        where: { id: post.id },
        data: {
          title: nextTitle.slice(0, 220),
          excerpt: excerpt.length >= 40 ? excerpt : post.title,
          body: pipeline.bodyHtml,
          seoTitle: pipeline.plan.metaTitle.slice(0, 200),
          seoDescription: pipeline.plan.metaDescription.slice(0, 500),
          postStatus: post.postStatus,
          publishAt: post.publishAt,
          updatedAt: new Date(),
        },
      });

      results.push({
        id: post.id,
        slug: post.slug,
        title: post.title,
        beforeWordCount: row.wordCount,
        afterWordCount,
        upgraded: afterWordCount >= minWords,
      });
      console.info("[blog_upgrade_weak] regenerate_success", {
        id: post.id,
        slug: post.slug,
        beforeWords: row.wordCount,
        afterWords: afterWordCount,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[blog_upgrade_weak] regenerate_exception", {
        id: post.id,
        slug: post.slug,
        error: message,
      });
      results.push({
        id: post.id,
        slug: post.slug,
        title: post.title,
        beforeWordCount: row.wordCount,
        upgraded: false,
        error: message,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    processed: results.length,
    minWords,
    results,
  });
}

