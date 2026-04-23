import type { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN } from "@/lib/admin/blog-generate-ai-constants";
import { blogSimpleAiDraftBodySchema } from "@/lib/admin/blog-simple-ai-draft-schema";

/**
 * Parse textarea lines for admin blog batch generation.
 * Line numbers refer to the original textarea (1-based), including blank lines
 * (only non-empty trimmed lines are validated for length).
 */
export function parseBatchTopicLines(
  raw: string,
  maxTopics: number = ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN,
):
  | { ok: true; topics: string[] }
  | { ok: false; message: string } {
  const lines = raw.split(/\r?\n/);
  const nonEmpty: { lineNumber1Based: number; text: string }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i]!.trim();
    if (t) nonEmpty.push({ lineNumber1Based: i + 1, text: t });
  }
  const shortLineNumbers = nonEmpty.filter((x) => x.text.length < 3).map((x) => x.lineNumber1Based);
  if (shortLineNumbers.length > 0) {
    const preview = shortLineNumbers.slice(0, 20).join(", ");
    const suffix = shortLineNumbers.length > 20 ? " …" : "";
    return {
      ok: false,
      message: `Each batch topic line must be at least 3 characters after trim. Invalid line number(s): ${preview}${suffix}.`,
    };
  }
  const topics = nonEmpty.map((x) => x.text).slice(0, maxTopics);
  if (topics.length === 0) {
    return { ok: false, message: "Add at least one non-empty topic line for batch mode." };
  }
  return { ok: true, topics };
}

/** App-level validation for pasted `sourceRecords` (same rules as generate-ai body schema). */
export function validateStructuredSourceRecordsJson(
  records: unknown,
): { ok: true } | { ok: false; message: string } {
  const r = blogSimpleAiDraftBodySchema.pick({ sourceRecords: true }).safeParse({ sourceRecords: records });
  if (r.success) return { ok: true };
  const flat = r.error.flatten();
  const parts: string[] = [];
  if (flat.formErrors.length) parts.push(...flat.formErrors);
  for (const [k, v] of Object.entries(flat.fieldErrors)) {
    if (v?.length) parts.push(`${k}: ${v.join(" ")}`);
  }
  const detail = parts.filter(Boolean).join(" | ") || "Invalid structured sources.";
  return {
    ok: false,
    message: `Structured sources JSON is invalid. ${detail} Use full https:// URLs or omit the url field.`,
  };
}

export type BuildAdminBlogGenerateAiRequestBodyInput = {
  enableBatch: boolean;
  topicTrimmed: string;
  batchTopics: string[];
  slugCleanedOptional: string | undefined;
  keywords: string;
  exam: string;
  template: BlogPostTemplate;
  tone: "professional" | "supportive" | "direct";
  intent: BlogPostIntent;
  funnelStage: BlogFunnelStage;
  targetKeyword: string;
  keywordCluster: string;
  includeImage: boolean;
  includeAiImage: boolean;
  sourceRecords: unknown;
  publishNow: boolean;
};

/** JSON body for POST `/api/admin/blog/generate-ai` (undefined keys omitted by JSON.stringify). */
export function buildAdminBlogGenerateAiRequestBody(
  input: BuildAdminBlogGenerateAiRequestBodyInput,
): Record<string, unknown> {
  const {
    enableBatch,
    topicTrimmed,
    batchTopics,
    slugCleanedOptional,
    keywords,
    exam,
    template,
    tone,
    intent,
    funnelStage,
    targetKeyword,
    keywordCluster,
    includeImage,
    includeAiImage,
    sourceRecords,
    publishNow,
  } = input;

  const common = {
    keywords: keywords || undefined,
    exam,
    template,
    tone,
    intent,
    funnelStage,
    targetKeyword: targetKeyword || undefined,
    keywordCluster: keywordCluster || undefined,
    includeImage,
    includeAiImage,
    sourceRecords,
    publishNow,
  };

  if (enableBatch) {
    return {
      ...common,
      topic: undefined,
      topics: batchTopics,
    };
  }

  return {
    ...common,
    topic: topicTrimmed,
    topics: undefined,
    slug: slugCleanedOptional && slugCleanedOptional.length > 0 ? slugCleanedOptional : undefined,
  };
}

/** Map admin AI gate HTTP JSON to a single admin-facing string (never browser validation). */
export function formatAdminBlogGenerateAiBlockedError(json: {
  error?: string;
  hint?: string;
  code?: string;
}): string {
  const hint = typeof json.hint === "string" ? json.hint.trim() : "";
  const error = typeof json.error === "string" ? json.error.trim() : "";
  if (hint && error) {
    if (hint.toLowerCase().startsWith(error.toLowerCase())) return hint;
    return `${error} ${hint}`;
  }
  return hint || error || "AI generation request failed.";
}
