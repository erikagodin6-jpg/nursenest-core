import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { adminAiGenerationHttpBlock } from "@/lib/ai/admin-ai-policy";
import { appendBlogAdminPublishLog } from "@/lib/blog/blog-admin-publish-log";
import { BLOG_ARTICLE_MIN_BODY_CHARS } from "@/lib/blog/blog-article-generation-pipeline";
import {
  appendRequiredStudyLinksBlock,
  regenerateControlPanelSection,
} from "@/lib/blog/blog-control-panel-generation";
import { lessonRowsToRelatedPaths } from "@/lib/blog/blog-internal-lesson-links";
import {
  countryTargetToEditorialCountry,
  reconstructBlogControlPanelPlanFromPost,
  safeBlogFunnelForReconstruct,
  safeBlogIntentForReconstruct,
  safeBlogTemplateForReconstruct,
} from "@/lib/blog/blog-reconstruct-plan-from-post";
import { BLOG_ARTICLE_MIN_WORDS, countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Regenerates **HTML body only** from the stored editorial outline (same model pass as the control panel).
 * Does not rewrite SERP columns unless the editor runs SEO regenerate separately.
 */
export async function POST(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const aiBlock = adminAiGenerationHttpBlock();
  if (aiBlock) return aiBlock;

  const { id } = await ctx.params;

  const row = await prisma.blogPost.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      titleAlternates: true,
      slug: true,
      seoTitle: true,
      seoDescription: true,
      excerpt: true,
      outlineJson: true,
      faqBlock: true,
      internalLinkPlan: true,
      keyTakeaways: true,
      featuredSnippet: true,
      keywordPlan: true,
      exam: true,
      countryTarget: true,
      postTemplate: true,
      intent: true,
      funnelStage: true,
      targetKeyword: true,
      adminPublishLog: true,
    },
  });
  if (!row) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });

  const plan = reconstructBlogControlPanelPlanFromPost(row);
  if (!plan) {
    return NextResponse.json(
      {
        error: "Stored outline is missing or too short to reconstruct the editorial plan. Use the full control panel or edit outline JSON.",
        code: "PLAN_NOT_RECONSTRUCTABLE",
      },
      { status: 422 },
    );
  }

  const topic = (row.targetKeyword?.trim() || row.title).trim();
  const exam = row.exam?.trim() || "NCLEX-RN";
  const country = countryTargetToEditorialCountry(row.countryTarget);

  let bodyHtml: string;
  try {
    const out = await regenerateControlPanelSection({
      section: "article_html",
      topic,
      exam,
      country,
      template: safeBlogTemplateForReconstruct(row.postTemplate),
      intent: safeBlogIntentForReconstruct(row.intent),
      funnelStage: safeBlogFunnelForReconstruct(row.funnelStage),
      tone: "professional",
      keywords: row.keywordPlan.join(", ").slice(0, 500) || undefined,
      currentPlan: plan,
      currentTitle: row.title,
    });
    if (out.section !== "article_html") {
      return NextResponse.json({ error: "Unexpected regeneration section" }, { status: 500 });
    }
    bodyHtml = out.bodyHtml;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "body_regeneration_failed", message: msg }, { status: 502 });
  }

  const relatedPaths = lessonRowsToRelatedPaths(plan.suggestedInternalLessons, country);
  const bodyWithLinks = appendRequiredStudyLinksBlock({
    bodyHtml,
    exam,
    country,
    relatedPaths,
  });

  if (bodyWithLinks.length < BLOG_ARTICLE_MIN_BODY_CHARS) {
    return NextResponse.json(
      { error: "body_too_short", message: "Regenerated body is shorter than the minimum character threshold." },
      { status: 422 },
    );
  }
  const words = countWordsFromHtml(bodyWithLinks);
  if (words < BLOG_ARTICLE_MIN_WORDS) {
    return NextResponse.json(
      {
        error: "body_too_short",
        message: `Regenerated body is ${words} words; minimum is ${BLOG_ARTICLE_MIN_WORDS}.`,
      },
      { status: 422 },
    );
  }

  const nextLog = appendBlogAdminPublishLog(row.adminPublishLog, {
    event: "body_regenerated",
    message: "Article HTML regenerated from stored outline (admin API).",
  });

  const updated = await prisma.blogPost.update({
    where: { id },
    data: {
      body: bodyWithLinks,
      adminPublishLog: nextLog as Prisma.InputJsonValue,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      body: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ ok: true, post: updated });
}
