import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  claimBlogArticleGenerationJob,
  createBlogArticleGenerationJob,
} from "@/lib/blog/blog-article-generation-job";
import type { ControlPanelGenerateInput } from "@/lib/blog/blog-control-panel-generation";

const hasDb = Boolean(process.env.DATABASE_URL?.trim());

describe("BlogArticleGenerationJob claim", () => {
  const createdIds: string[] = [];

  after(async () => {
    if (!hasDb || createdIds.length === 0) return;
    await prisma.blogArticleGenerationJob.deleteMany({ where: { id: { in: createdIds } } });
  });

  it("create returns queued and claim succeeds once", async () => {
    if (!hasDb) {
      console.info("[BlogArticleGenerationJob claim] skip (no DATABASE_URL)");
      return;
    }
    const input: ControlPanelGenerateInput = {
      topic: "Reliability test topic for job claim",
      exam: "NCLEX-RN",
      country: "unspecified",
      template: BlogPostTemplate.TOPIC_EXPLAINED,
      intent: BlogPostIntent.EXAM_PREP,
      funnelStage: BlogFunnelStage.CONSIDERATION,
      tone: "professional",
      includeImage: true,
      includeAiImage: false,
      publishImmediately: false,
    };
    const job = await createBlogArticleGenerationJob({
      createdById: null,
      input,
    });
    createdIds.push(job.id);
    assert.equal(job.stage, "queued");

    const first = await claimBlogArticleGenerationJob(job.id);
    assert.equal(first, true);
    const row = await prisma.blogArticleGenerationJob.findUnique({ where: { id: job.id } });
    assert.equal(row?.stage, "generating_plan");

    const second = await claimBlogArticleGenerationJob(job.id);
    assert.equal(second, false);
  });
});
