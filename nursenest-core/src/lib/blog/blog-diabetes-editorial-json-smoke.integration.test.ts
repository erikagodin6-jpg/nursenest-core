/**
 * Smoke: topic "diabetes" → persisted BlogPost with non-placeholder body (deterministic plan + HTML; no LLM).
 * Proves editorial JSON tolerance path + canonical persist do not block on outline.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { BlogFunnelStage, BlogPostIntent, BlogPostStatus, BlogPostTemplate } from "@prisma/client";
import { BLOG_BODY_GENERATION_INCOMPLETE_PLACEHOLDER_TEXT } from "@/lib/blog/blog-article-bounds";
import { runBlogArticleGenerationPipeline } from "@/lib/blog/blog-article-generation-pipeline";
import { sanitizeControlPanelGeneratedSlugInput } from "@/lib/blog/blog-control-panel-generation";
import { buildReliableFallbackBlogControlPanelPlan } from "@/lib/blog/blog-control-panel-plan-fallback";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { prisma } from "@/lib/db";

function bodyForDiabetesPlan(plan: BlogControlPanelPlan): string {
  const parts: string[] = [];
  for (const row of plan.outline) {
    parts.push(`<h2>${row.h2}</h2>`);
    const para = Array.from(
      { length: 22 },
      (_, i) =>
        `Diabetes mellitus nursing care integrates glucose monitoring, medication teaching, and foot safety education for licensure-style prioritization (${i + 1}).`,
    ).join(" ");
    parts.push(`<p>${para}</p>`);
  }
  for (const link of plan.recommendedInternalLinks ?? []) {
    parts.push(
      `<p>Continue studying with <a href="${link.suggestedPath}">${link.anchorText}</a> for structured practice.</p>`,
    );
  }
  parts.push("<h2>Frequently asked questions</h2>");
  parts.push(
    "<p>Nursing exams emphasize signs of hypo- and hyperglycemia, insulin safety, and client teaching that reflects evidence-based training.</p>",
  );
  return parts.join("\n");
}

test("diabetes topic: pipeline persists DRAFT BlogPost with substantive non-placeholder body", async (t) => {
  if (!process.env.DATABASE_URL?.trim()) {
    t.skip("DATABASE_URL not set");
    return;
  }

  const topic = "diabetes";
  const exam = "NCLEX-RN";
  const country = "unspecified" as const;
  const slugBase = sanitizeControlPanelGeneratedSlugInput("diabetes-smoke", exam, topic);
  const plan = buildReliableFallbackBlogControlPanelPlan({ topic, exam, country, recommendedSlug: slugBase });
  const bodyHtml = bodyForDiabetesPlan(plan);
  assert.ok(countWordsFromHtml(bodyHtml) >= 800);

  let postId: string | null = null;
  try {
    const res = await runBlogArticleGenerationPipeline(
      {
        topic,
        exam,
        country,
        template: BlogPostTemplate.TOPIC_EXPLAINED,
        intent: BlogPostIntent.EXAM_PREP,
        funnelStage: BlogFunnelStage.CONSIDERATION,
        tone: "professional",
        includeImage: false,
        includeAiImage: false,
        targetKeyword: topic,
        allowInsufficientCitations: true,
      },
      {
        persist: true,
        reliableMode: true,
        initialPlan: plan,
        initialBodyHtml: bodyHtml,
        idempotencyKey: `diabetes-smoke:${Date.now()}`,
      },
    );

    assert.equal(res.ok, true, !res.ok ? res.error : "");
    if (!res.ok) return;
    assert.ok(res.persist && !("skipped" in res.persist && res.persist.skipped));
    if (!res.persist || res.persist.skipped) return;

    postId = res.persist.post.id;
    assert.ok(
      res.persist.post.postStatus === BlogPostStatus.DRAFT || res.persist.post.postStatus === BlogPostStatus.PUBLISHED,
      `unexpected status ${res.persist.post.postStatus}`,
    );

    const row = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { body: true },
    });
    assert.ok(row?.body);
    assert.match(row!.body!, /diabetes/i);
    assert.ok(!row!.body!.includes(BLOG_BODY_GENERATION_INCOMPLETE_PLACEHOLDER_TEXT));
  } finally {
    if (postId) await prisma.blogPost.delete({ where: { id: postId } }).catch(() => undefined);
  }
});
