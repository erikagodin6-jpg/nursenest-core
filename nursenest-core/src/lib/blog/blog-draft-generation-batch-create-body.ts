import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate, CountryCode } from "@prisma/client";
import { z } from "zod";
import { DRAFT_BATCH_MAX_TOPICS } from "@/lib/blog/blog-draft-generation-batch-constants";
import { RN_TOPIC_MAP_SHELL_MAX_ITEMS } from "@/lib/blog/blog-topic-map-shell-batch-constants";

export const blogDraftGenerationBatchCreateBodySchema = z.object({
  topicsText: z.string().min(1).max(500_000),
  exam: z.string().min(2).max(80),
  country: z.enum(["US", "CA", "unspecified"]).optional(),
  template: z.nativeEnum(BlogPostTemplate),
  intent: z.nativeEnum(BlogPostIntent).optional(),
  funnelStage: z.nativeEnum(BlogFunnelStage).optional(),
  tone: z.enum(["professional", "supportive", "direct"]).optional(),
  keywords: z.string().max(400).optional(),
  keywordCluster: z.string().max(200).optional(),
  countryTarget: z.nativeEnum(CountryCode).optional(),
  includeImage: z.boolean().optional(),
  includeAiImage: z.boolean().optional(),
  allowDuplicateCanonicalTopic: z.boolean().optional(),
});

export type BlogDraftGenerationBatchCreateBody = z.infer<typeof blogDraftGenerationBatchCreateBodySchema>;

/** Server-owned RN topic-map shell batch (no topicsText; no inline processing on create). */
export const blogRnTopicMapShellJobCreateBodySchema = z.object({
  jobKind: z.literal("rn_topic_map_shell"),
  idempotencyKey: z.string().min(8).max(128).optional(),
});

export type BlogRnTopicMapShellJobCreateBody = z.infer<typeof blogRnTopicMapShellJobCreateBodySchema>;

export const blogGenerationAiJobCreateBodySchema = blogDraftGenerationBatchCreateBodySchema.extend({
  idempotencyKey: z.string().min(8).max(128).optional(),
});

export type BlogGenerationAiJobCreateBody = z.infer<typeof blogGenerationAiJobCreateBodySchema>;

export const blogGenerationJobCreateBodySchema = z.union([
  blogRnTopicMapShellJobCreateBodySchema,
  blogGenerationAiJobCreateBodySchema,
]);

export type BlogGenerationJobCreateBody = z.infer<typeof blogGenerationJobCreateBodySchema>;

export function assertTopicsWithinBatchLimit(topicsLength: number): string | null {
  if (topicsLength > DRAFT_BATCH_MAX_TOPICS) {
    return `Too many topics (max ${DRAFT_BATCH_MAX_TOPICS}). Split into multiple batches.`;
  }
  return null;
}

export function assertRnTopicMapShellRowCount(rowCount: number): string | null {
  if (rowCount === 0) {
    return "master-topic-map.json missing or has no RN topics.";
  }
  if (rowCount > RN_TOPIC_MAP_SHELL_MAX_ITEMS) {
    return `Too many topic-map rows (max ${RN_TOPIC_MAP_SHELL_MAX_ITEMS}).`;
  }
  return null;
}
