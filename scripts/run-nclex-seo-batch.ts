import "../src/lib/db/env-bootstrap";
import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { generateAutomatedBlogPost } from "../src/lib/blog/blog-automation-engine";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(__dirname, "../.env") });
loadEnv({ path: path.join(__dirname, "../../.env") });

const TOPICS: readonly string[] = [
  "Hyperkalemia vs Hypokalemia NCLEX",
  "Hyponatremia vs Hypernatremia",
  "SIADH vs Diabetes Insipidus",
  "Metabolic vs Respiratory Acidosis vs Alkalosis",
  "Heart Failure NCLEX Guide",
  "Sepsis NCLEX Signs and Treatment",
  "Shock Types NCLEX",
  "DKA vs HHS NCLEX",
  "COPD vs Asthma NCLEX",
  "Stroke vs TIA NCLEX",
  "Addison's vs Cushing's NCLEX",
  "Crohn's vs Ulcerative Colitis",
  "Angina vs Myocardial Infarction",
  "Iron Deficiency vs B12 Anemia",
  "Pneumonia vs Tuberculosis",
  "How to pass NCLEX in 30 days",
  "Best NCLEX study plan",
  "NCLEX prioritization strategies",
  "SATA questions explained NCLEX",
  "Normal lab values nursing",
  "ABG interpretation made easy",
];

type Mode = "immediate" | "scheduled";

function parseArg(name: string): string | undefined {
  const hit = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

function inferTemplateAndIntent(topic: string): { template: BlogPostTemplate; intent: BlogPostIntent } {
  const t = topic.toLowerCase();
  if (t.includes(" vs ")) {
    return { template: BlogPostTemplate.COMPARISON_ARTICLE, intent: BlogPostIntent.COMPARISON };
  }
  if (t.includes("how to pass") || t.includes("study plan")) {
    return { template: BlogPostTemplate.STUDY_PLAN, intent: BlogPostIntent.STUDY_STRATEGY };
  }
  if (t.includes("prioritization")) {
    return { template: BlogPostTemplate.PRIORITIZATION_ARTICLE, intent: BlogPostIntent.EXAM_PREP };
  }
  if (t.includes("lab values") || t.includes("abg")) {
    return { template: BlogPostTemplate.LAB_VALUES_GUIDE, intent: BlogPostIntent.EXAM_PREP };
  }
  if (t.includes("guide")) {
    return { template: BlogPostTemplate.EXAM_GUIDE, intent: BlogPostIntent.EXAM_PREP };
  }
  return { template: BlogPostTemplate.TOPIC_EXPLAINED, intent: BlogPostIntent.EXAM_PREP };
}

async function main(): Promise<void> {
  const mode = (parseArg("mode") as Mode | undefined) ?? "immediate";
  const exam = parseArg("exam") ?? "NCLEX-RN";
  const country = (parseArg("country") as "US" | "CA" | "unspecified" | undefined) ?? "US";
  const cadencePerDay = Math.max(1, Math.min(3, Number.parseInt(parseArg("cadencePerDay") ?? "2", 10) || 2));
  const batchSize = Math.max(1, Math.min(20, Number.parseInt(parseArg("batchSize") ?? "10", 10) || 10));
  const offset = Math.max(0, Number.parseInt(parseArg("offset") ?? "0", 10) || 0);
  const startAtInput = parseArg("startAt");
  const startAt = startAtInput ? new Date(startAtInput) : new Date();
  const intervalMs = Math.floor((24 * 60 * 60 * 1000) / cadencePerDay);

  if (!Number.isFinite(startAt.getTime())) {
    throw new Error("Invalid --startAt value. Use ISO format, e.g. 2026-04-13T12:00:00Z");
  }

  const selectedTopics = TOPICS.slice(offset, offset + batchSize);
  if (selectedTopics.length === 0) {
    throw new Error("No topics selected. Adjust --offset and --batchSize.");
  }

  const created: Array<{ topic: string; slug: string; url: string; publishAt: string }> = [];
  const skipped: Array<{ topic: string; reason: string; existingSlug?: string }> = [];
  const failed: Array<{ topic: string; error: string }> = [];

  for (let i = 0; i < selectedTopics.length; i += 1) {
    const topic = selectedTopics[i];
    const { template, intent } = inferTemplateAndIntent(topic);
    const publishAt = mode === "scheduled" ? new Date(startAt.getTime() + i * intervalMs) : new Date();
    const targetKeyword = topic.toLowerCase().includes("nclex") ? topic : `${topic} NCLEX`;

    const result = await generateAutomatedBlogPost({
      topic,
      exam,
      country,
      template,
      intent,
      funnelStage: BlogFunnelStage.CONSIDERATION,
      tone: "professional",
      includeImage: false,
      includeAiImage: false,
      targetKeyword,
      autoPublish: true,
      publishAt,
    });

    if (!result.ok) {
      failed.push({ topic, error: result.error });
      continue;
    }
    if (result.skipped) {
      skipped.push({
        topic,
        reason: result.reason,
        existingSlug: result.existingSlug,
      });
      continue;
    }
    created.push({
      topic,
      slug: result.post.slug,
      url: `/blog/${result.post.slug}`,
      publishAt: publishAt.toISOString(),
    });
  }

  console.log(
    JSON.stringify(
      {
        ok: failed.length === 0,
        mode,
        exam,
        country,
        cadencePerDay,
        batchSizeRequested: batchSize,
        offset,
        topicsAttempted: selectedTopics.length,
        createdCount: created.length,
        skippedCount: skipped.length,
        failedCount: failed.length,
        created,
        skipped,
        failed,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
