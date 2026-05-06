/**
 * Integration: reliable pipeline path persists a real `BlogPost` row with non-placeholder body
 * (no LLM — deterministic fallback plan + synthetic HTML). Skips when `DATABASE_URL` is unset.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { BLOG_BODY_GENERATION_INCOMPLETE_PLACEHOLDER_TEXT } from "@/lib/blog/blog-article-bounds";
import { runBlogArticleGenerationPipeline } from "@/lib/blog/blog-article-generation-pipeline";
import { sanitizeControlPanelGeneratedSlugInput } from "@/lib/blog/blog-control-panel-generation";
import { buildReliableFallbackBlogControlPanelPlan } from "@/lib/blog/blog-control-panel-plan-fallback";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { prisma } from "@/lib/db";

function smokeBodyHtml(plan: BlogControlPanelPlan): string {
  const parts: string[] = [];
  for (const row of plan.outline) {
    parts.push(`<h2>${row.h2}</h2>`);
    const para = Array.from(
      { length: 24 },
      (_, i) =>
        `Clinical nursing education emphasizes assessment, safety, and therapeutic communication for licensure-style items (${row.h2.toLowerCase()}, segment ${i + 1}).`,
    ).join(" ");
    parts.push(`<p>${para}</p>`);
  }
  for (const link of plan.recommendedInternalLinks ?? []) {
    parts.push(
      `<p>For additional preparation, use <a href="${link.suggestedPath}">${link.anchorText}</a> alongside your study plan.</p>`,
    );
  }
  parts.push("<h2>Frequently asked questions</h2>");
  parts.push(
    "<p>Exam items typically reward prioritization, delegation boundaries, and client education that reflects training rather than invented protocols.</p>",
  );
  return parts.join("\n");
}

test("reliableMode with deterministic plan + synthetic body writes non-placeholder BlogPost", async (t) => {
  if (!process.env.DATABASE_URL?.trim()) {
    t.skip("DATABASE_URL not set");
    return;
  }

  const topic = `Heart Failure Nursing Care smoke ${Date.now()}`;
  const exam = "NCLEX-RN";
  const country = "unspecified" as const;
  const slugBase = sanitizeControlPanelGeneratedSlugInput("smoke-reliable", exam, topic);
  const plan = buildReliableFallbackBlogControlPanelPlan({ topic, exam, country, recommendedSlug: slugBase });
  const bodyHtml = smokeBodyHtml(plan);
  assert.ok(countWordsFromHtml(bodyHtml) >= 800, "synthetic body should meet substantive word floor");

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
        idempotencyKey: `smoke-reliable:${topic}`,
      },
    );

    assert.equal(res.ok, true, !res.ok ? res.error : "");
    if (!res.ok) return;
    assert.ok(res.persist && !("skipped" in res.persist && res.persist.skipped));
    if (!res.persist || res.persist.skipped) return;

    postId = res.persist.post.id;
    const row = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { body: true },
    });
    assert.ok(row?.body);
    assert.ok(!row!.body!.includes(BLOG_BODY_GENERATION_INCOMPLETE_PLACEHOLDER_TEXT));
  } finally {
    if (postId) {
      await prisma.blogPost.delete({ where: { id: postId } }).catch(() => undefined);
    }
  }
});
