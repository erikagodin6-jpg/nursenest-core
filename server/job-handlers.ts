import type { registerJobHandler } from "./job-queue";

type RegisterFn = typeof registerJobHandler;

function safeParseJson(value: any, fallback: any = {}) {
  if (!value) return fallback;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function toSafeString(value: any, fallback = ""): string {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
}

export function registerAllJobHandlers(register: RegisterFn): void {
  register("blog_batch_generate", async (_job: any, _batch: any, payload: any) => {
    const { generateBlogPost } = await import("./blog-automation");
    const { storage } = await import("./storage");
    const { generateUniqueSlugSuffix } = await import("@shared/seo-utils");

    const topics = Array.isArray(payload?.topics) ? payload.topics : [];
    const citationStyle = payload?.citationStyle || "apa7";
    const authorName = payload?.authorName || "Erika Godin, RN";
    const publishAllNow = payload?.publishAllNow === true;
    const batchIndex = Number(payload?.batchIndex) || 0;
    const batchSize = Number(payload?.batchSize) || 5;
    const batchItemCount = Number(payload?.batchItemCount) || topics.length;

    const startIdx = batchIndex * batchSize;
    const endIdx = Math.min(startIdx + batchItemCount, topics.length);

    for (let i = startIdx; i < endIdx; i++) {
      const topicEntry = topics[i];
      const topicText =
        typeof topicEntry === "string"
          ? topicEntry
          : toSafeString(topicEntry?.topic);

      if (!topicText.trim()) continue;

      try {
        const post = await generateBlogPost(topicText.trim(), citationStyle);

        const baseSlug =
          toSafeString(post?.slug)
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "") || `blog-${generateUniqueSlugSuffix()}`;

        const duplicateExists = await storage.checkDuplicateSlug(baseSlug);
        const finalSlug = duplicateExists
          ? `${baseSlug}-${generateUniqueSlugSuffix()}`
          : baseSlug;

        await storage.createContentItem({
          title: post.title,
          slug: finalSlug,
          type: "blog",
          category: "nursing-education",
          tier: "free",
          status: publishAllNow ? "published" : "draft",
          tags: post.tags,
          summary: post.summary,
          content: post.content,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
          seoKeywords: post.seoKeywords,
          primaryKeyword: post.primaryKeyword,
          publishedAt: publishAllNow ? new Date() : null,
          autoPublish: true,
          authorName,
        });

        console.log(`[JobHandler:blog_batch_generate] Generated: ${post.title}`);
      } catch (err: any) {
        console.error(
          `[JobHandler:blog_batch_generate] Failed topic "${topicText}":`,
          err?.message || err
        );
      }
    }
  });

  register("blog_expand_all", async (_job: any, _batch: any, payload: any) => {
    const { expandAllShortPosts } = await import("./blog-automation");
    const minWords = Number(payload?.minWords) || 2000;
    await expandAllShortPosts(minWords);
  });

  register("bulk_flashcard_align", async () => {
    const { bulkGenerateAlignedFlashcards } = await import("./exam-flashcard-mapper");
    await bulkGenerateAlignedFlashcards();
  });

  register("convert_to_flashcard", async () => {
    const {
      mapExamQuestionsToFlashcards,
      bulkGenerateAlignedFlashcards,
    } = await import("./exam-flashcard-mapper");

    await mapExamQuestionsToFlashcards();
    await bulkGenerateAlignedFlashcards();
  });

  register("sm2_bulk_generate", async (_job: any, _batch: any, payload: any) => {
    const sm2Engine = await import("./sm2-engine");

    await sm2Engine.bulkGenerateFromContent(
      payload?.sourceType,
      payload?.tier,
      Number(payload?.limit) || 50
    );
  });

  register("content_expansion", async () => {
    const { runExpansionJob } = await import("./content-expansion-job");
    await runExpansionJob();
  });

  register("bulk_question_generate", async (_job: any, _batch: any, payload: any) => {
    const { runBulkGeneration } = await import("./bulk-question-generator");

    await runBulkGeneration({
      model: payload?.model || "gpt-4o-mini",
      triggeredBy: payload?.triggeredBy || "worker",
      dryRun: payload?.dryRun !== false,
      batchSize: Number(payload?.batchSize) || 50,
      tierFilter: payload?.tierFilter,
    });
  });

  register("autopilot_content", async (job: any, _batch: any, payload: any) => {
    const { pool } = await import("./storage");
    const { processAutopilotJob } = await import("./autopilot");

    const engineKey = payload?.engineKey || job?.engine_key || "";
    const jobPayload = safeParseJson(job?.payload, {});
    const mergedPayload = { ...jobPayload, ...(payload || {}) };

    const inserted = await pool.query(
      `INSERT INTO autopilot_jobs (engine_key, status, payload)
       VALUES ($1, 'running', $2)
       RETURNING id`,
      [engineKey, JSON.stringify(mergedPayload)]
    );

    const autopilotJobId = inserted.rows[0]?.id;
    await processAutopilotJob(autopilotJobId, engineKey, mergedPayload);
  });
}